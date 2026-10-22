"""
Renderiza um vídeo do repositório em MP4, quadro a quadro, sem depender da
página do Motion: Chrome headless abre ferramentas/preview/ e cada quadro é
capturado pelo DevTools Protocol e enviado ao ffmpeg.

Requisitos: Google Chrome e ffmpeg instalados; só biblioteca padrão do Python.

Uso (na raiz do repositório):
    python ferramentas/renderizar_mp4.py aula08_projecoes_conformes/v01_conforme_x_equivalente \
        [--fps 30] [--saida video.mp4]
"""

import argparse
import base64
import functools
import http.server
import json
import os
import socket
import struct
import subprocess
import tempfile
import threading
import time
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


class CDP:
    """Cliente WebSocket mínimo (RFC 6455) para o DevTools Protocol."""

    def __init__(self, url):
        host, rest = url[len("ws://"):].split("/", 1)
        h, p = host.split(":")
        self.s = socket.create_connection((h, int(p)))
        chave = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall((f"GET /{rest} HTTP/1.1\r\nHost: {host}\r\nUpgrade: websocket\r\n"
                        f"Connection: Upgrade\r\nSec-WebSocket-Key: {chave}\r\n"
                        "Sec-WebSocket-Version: 13\r\n\r\n").encode())
        resp = b""
        while b"\r\n\r\n" not in resp:
            resp += self.s.recv(1)
        self.n = 0

    def _ler(self, k):
        b = b""
        while len(b) < k:
            b += self.s.recv(k - len(b))
        return b

    def _recv(self):
        dados = b""
        while True:
            b0, b1 = self._ler(2)
            k = b1 & 0x7F
            if k == 126:
                k = struct.unpack(">H", self._ler(2))[0]
            elif k == 127:
                k = struct.unpack(">Q", self._ler(8))[0]
            dados += self._ler(k)
            if b0 & 0x80:
                return json.loads(dados)

    def __call__(self, metodo, **params):
        self.n += 1
        msg = json.dumps({"id": self.n, "method": metodo, "params": params}).encode()
        cab = bytes([0x81])
        k = len(msg)
        cab += bytes([0x80 | k]) if k < 126 else (bytes([0x80 | 126]) + struct.pack(">H", k) if k < 65536
                                                  else bytes([0x80 | 127]) + struct.pack(">Q", k))
        mask = os.urandom(4)
        self.s.sendall(cab + mask + bytes(c ^ mask[i % 4] for i, c in enumerate(msg)))
        while True:
            r = self._recv()
            if r.get("id") == self.n:
                if "error" in r:
                    raise RuntimeError(r["error"])
                return r["result"]


def servidor():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(RAIZ))
    http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv.server_address[1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--saida")
    a = ap.parse_args()
    video = a.video.strip("/")
    cenas = json.loads((RAIZ / video / "motion" / "scenes.json").read_text(encoding="utf-8"))["scenes"]
    total = sum(s["dur"] for s in cenas)
    saida = Path(a.saida or RAIZ / video / "export" / (Path(video).name + ".mp4"))
    saida.parent.mkdir(parents=True, exist_ok=True)

    porta_http = servidor()
    perfil = tempfile.mkdtemp()
    chrome = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                               "--remote-debugging-port=9333", f"--user-data-dir={perfil}",
                               "--window-size=1920,1080", "about:blank"],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        sem_proxy = urllib.request.build_opener(urllib.request.ProxyHandler({}))
        alvos = []
        for _ in range(150):
            try:
                alvos = [t for t in json.load(sem_proxy.open("http://127.0.0.1:9333/json")) if t["type"] == "page"]
                if alvos:
                    break
            except OSError:
                pass
            time.sleep(0.2)
        ws = alvos[0]["webSocketDebuggerUrl"]
        cdp = CDP(ws)
        cdp("Emulation.setDeviceMetricsOverride", width=1920, height=1080, deviceScaleFactor=1, mobile=False)
        cdp("Page.enable")
        cdp("Page.navigate", url=f"http://127.0.0.1:{porta_http}/ferramentas/preview/index.html?v={video}&t=0&still=1")
        for _ in range(300):
            titulo = cdp("Runtime.evaluate", expression="document.title")["result"].get("value")
            if titulo in ("pronto", "erro"):
                break
            time.sleep(0.1)
        if titulo != "pronto":
            raise RuntimeError("a pré-visualização não carregou")

        ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(a.fps),
                               "-i", "-", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16",
                               "-preset", "slow", "-movflags", "+faststart", str(saida)], stdin=subprocess.PIPE)
        n = round(total * a.fps)
        for i in range(n):
            cdp("Runtime.evaluate", expression=f"render({i / a.fps})")
            png = cdp("Page.captureScreenshot", format="png")["data"]
            ff.stdin.write(base64.b64decode(png))
            if i % a.fps == 0:
                print(f"\r{i / a.fps:5.1f} s / {total} s", end="", flush=True)
        ff.stdin.close()
        ff.wait()
        print(f"\n{saida.relative_to(RAIZ) if saida.is_relative_to(RAIZ) else saida}")
    finally:
        chrome.terminate()


if __name__ == "__main__":
    main()
