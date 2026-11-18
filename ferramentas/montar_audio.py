"""
Monta a faixa de áudio de um vídeo narrado: narração, trilha da série e efeitos.

Lê motion/scenes.json e motion/voz/falas.json (duração e palavras de cada fala) e:

1. Encaixa as falas de cada cena em sequência. Cada fala começa `pausa` segundos
   depois do fim da anterior (a primeira, depois do início da cena); a cena dura
   até o fim da última fala mais `cauda` (ou `dur_min`, se maior). Os tempos
   (`t` de cada fala e `dur` da cena) são gravados de volta em scenes.json.
2. Posiciona os efeitos (`sons`) num tempo fixo da cena (`t`) ou numa palavra
   falada (`em`: [fala, palavra, n]), com deslocamento `d` e ganho `g` em dB.
   Os efeitos ficam em ferramentas/audio/sons/<nome>.wav.
3. Mixa: a trilha (a partir de trilha.inicio) entra baixa e abaixa ainda mais
   enquanto há voz (compressão lateral), com fades na entrada e na saída; o
   resultado é normalizado em duas passadas a −16 LUFS, pico real ≤ −1,5 dBTP,
   e gravado em motion/audio.mp3 (scenes.json → audio).

Uso (na raiz do repositório):
    python ferramentas/montar_audio.py aula10_transporte_coordenadas/v01_terreno_grade [--so-tempos]
"""

import argparse
import json
import re
import subprocess
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
TRILHA = RAIZ / "ferramentas" / "audio" / "trilha_eam431.mp3"
SONS = RAIZ / "ferramentas" / "audio" / "sons"
LUFS, PICO = -16, -1.5
TRILHA_DB = -10            # trilha em relação à voz, fora das falas
ENTRA, SAI = 1.5, 3.0


def norm(x):
    x = unicodedata.normalize("NFD", x.lower())
    return re.sub(r"[^a-z0-9ψγ]", "", "".join(c for c in x if unicodedata.category(c) != "Mn"))


def gravar_scenes(caminho, meta):
    """scenes.json com uma cena por linha, como nos demais vídeos."""
    cab = {k: v for k, v in meta.items() if k != "scenes"}
    linhas = ",\n ".join(f'"{k}":' + json.dumps(v, ensure_ascii=False, separators=(",", ":")) for k, v in cab.items())
    cenas = ",\n  ".join(json.dumps(s, ensure_ascii=False, separators=(",", ":")) for s in meta["scenes"])
    caminho.write_text("{" + linhas + ',\n "scenes":[\n  ' + cenas + "]}\n", encoding="utf-8")


def tempos(meta, falas):
    t0 = 0.0
    eventos_voz, eventos_sons = [], []
    for s in meta["scenes"]:
        fim = 0.0
        for f in s.get("falas", []):
            d = falas[f["id"]]
            f["t"] = round(fim + f.get("pausa", 0.8), 2)
            fim = f["t"] + d["dur"]
            eventos_voz.append((t0 + f["t"], f["id"]))
        if s.get("falas"):
            s["dur"] = round(max(fim + s.get("cauda", 1.5), s.get("dur_min", 0)), 2)
        F = {f["id"]: f for f in s.get("falas", [])}
        for e in s.get("sons", []):
            if "em" in e:
                fid, palavra, *n = e["em"]
                n = n[0] if n else 1
                hits = [w for w in falas[fid]["words"] if norm(w["text"]).startswith(norm(palavra))]
                if len(hits) < n:
                    raise SystemExit(f'cena {s["id"]}: a palavra "{palavra}" ({n}ª) não está na fala {fid}')
                t = F[fid]["t"] + hits[n - 1]["start"]
            else:
                t = e["t"]
            eventos_sons.append((t0 + t + e.get("d", 0.0), e["s"], e.get("g", -18)))
        t0 += s["dur"]
    return t0, eventos_voz, eventos_sons


def mixar(pasta, meta, total, voz, sons):
    entradas, filtros, rotulos_voz, rotulos_sons = [], [], [], []
    inicio = meta.get("trilha", {}).get("inicio", 0)
    entradas += ["-ss", str(inicio), "-t", f"{total:.3f}", "-i", str(TRILHA)]
    for i, (t, fid) in enumerate(voz, start=1):
        entradas += ["-i", str(pasta / "voz" / f"{fid}.mp3")]
        ms = round(t * 1000)
        filtros.append(f"[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={ms}|{ms}[v{i}]")
        rotulos_voz.append(f"[v{i}]")
    base = len(voz) + 1
    for j, (t, nome, g) in enumerate(sons):
        entradas += ["-i", str(SONS / f"{nome}.wav")]
        ms = max(0, round(t * 1000))
        filtros.append(f"[{base + j}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={g}dB,adelay={ms}|{ms}[s{j}]")
        rotulos_sons.append(f"[s{j}]")
    filtros.append("".join(rotulos_voz) + f"amix=inputs={len(voz)}:normalize=0:duration=longest,apad=whole_dur={total:.3f},asplit=2[voz][chave]")
    filtros.append(f"[0:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={TRILHA_DB}dB,"
                   f"afade=t=in:d={ENTRA},afade=t=out:st={total - SAI:.3f}:d={SAI}[cama]")
    filtros.append("[cama][chave]sidechaincompress=threshold=0.02:ratio=4:attack=150:release=650:makeup=1[cama2]")
    ultimos = "[voz][cama2]"
    n = 2
    if sons:
        filtros.append("".join(rotulos_sons) + f"amix=inputs={len(sons)}:normalize=0:duration=longest[efeitos]")
        ultimos += "[efeitos]"
        n = 3
    filtros.append(ultimos + f"amix=inputs={n}:normalize=0:duration=first,atrim=0:{total:.3f}[mix]")
    grafo = ";".join(filtros)
    norma = f"loudnorm=I={LUFS}:TP={PICO}:LRA=11"
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *entradas, "-filter_complex",
                        grafo + f";[mix]{norma}:print_format=json[o]", "-map", "[o]", "-f", "null", "-"],
                       capture_output=True, text=True)
    if r.returncode:
        raise SystemExit(r.stderr[-3000:])
    m = json.loads(r.stderr[r.stderr.rindex("{"):])
    norma += (f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
              f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    saida = pasta / "audio.mp3"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *entradas, "-filter_complex",
                    grafo + f";[mix]{norma},aresample=48000[o]", "-map", "[o]", "-c:a", "libmp3lame",
                    "-b:a", "160k", str(saida)], check=True)
    return saida


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--so-tempos", action="store_true", help="só recalcula os tempos de scenes.json")
    a = ap.parse_args()
    pasta = RAIZ / a.video.strip("/") / "motion"
    cam = pasta / "scenes.json"
    meta = json.loads(cam.read_text(encoding="utf-8"))
    falas = json.loads((pasta / "voz" / "falas.json").read_text(encoding="utf-8"))
    total, voz, sons = tempos(meta, falas)
    meta["audio"] = "audio.mp3"
    gravar_scenes(cam, meta)
    print(f"{len(voz)} falas, {len(sons)} efeitos, {total:.1f} s: " +
          ", ".join(f'{s["id"]} {s["dur"]:.1f} s' for s in meta["scenes"]))
    if not a.so_tempos:
        print(mixar(pasta, meta, total, voz, sons).relative_to(RAIZ))


if __name__ == "__main__":
    main()
