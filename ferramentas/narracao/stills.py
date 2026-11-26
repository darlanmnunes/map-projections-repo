"""Quadros de revisão: python stills.py <video> <t1> [t2 ...] → <tmp>/eam431_stills/<video>_<t>.png
Usa o Chrome headless do renderizador (CDP), um processo para todos os quadros."""
import sys, os, time, base64, json, subprocess, tempfile, urllib.request
from pathlib import Path
RAIZ = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / 'ferramentas'))
import renderizar_mp4 as R

video = sys.argv[1].strip('/')
ts = [float(x) for x in sys.argv[2:]]
import tempfile
out = Path(tempfile.gettempdir()) / 'eam431_stills'; out.mkdir(exist_ok=True)
ph, pc = R.servidor(), R.porta_livre()
chrome = subprocess.Popen([R.CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-proxy-server', f'--remote-debugging-port={pc}',
                           f'--user-data-dir={tempfile.mkdtemp()}', '--window-size=1920,1080', 'about:blank'],
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    op = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    for _ in range(150):
        try:
            al = [t for t in json.load(op.open(f'http://127.0.0.1:{pc}/json')) if t['type'] == 'page']
            if al: break
        except OSError: pass
        time.sleep(0.2)
    cdp = R.CDP(al[0]['webSocketDebuggerUrl'])
    cdp('Emulation.setDeviceMetricsOverride', width=1920, height=1080, deviceScaleFactor=1, mobile=False)
    cdp('Page.enable')
    cdp('Page.navigate', url=f'http://127.0.0.1:{ph}/ferramentas/preview/index.html?v={video}&t=0&still=1')
    for _ in range(300):
        tit = cdp('Runtime.evaluate', expression='document.title')['result'].get('value')
        if tit in ('pronto', 'erro'): break
        time.sleep(0.1)
    if tit != 'pronto':
        print('ERRO:', cdp('Runtime.evaluate', expression="document.querySelector('pre')?.textContent")['result'].get('value'))
        sys.exit(1)
    nome = Path(video).name
    for t in ts:
        cdp('Runtime.evaluate', expression=f'render({t})')
        png = cdp('Page.captureScreenshot', format='png')['data']
        p = out / f'{nome}_{t:05.1f}.png'
        p.write_bytes(base64.b64decode(png)); print(p)
finally:
    chrome.terminate()
