"""Uma chamada de TTS por vídeo: narra todas as falas de motion/voz/narracao.json de uma vez
e corta o áudio em falas nas pausas entre parágrafos.

Uso: TTS_ENGINE=<audio.mjs> python ferramentas/narracao/gerar_voz.py <pasta_do_video> <modelo>
Saída: motion/voz/<id>.mp3 e motion/voz/falas.json ({id: {dur, words}}).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import os, tempfile
ENGINE = os.environ["TTS_ENGINE"]          # caminho do audio.mjs (motor de TTS do media-use)
SCRATCH = Path(tempfile.gettempdir()) / "eam431_voz"

video = Path(sys.argv[1]).resolve()
modelo = sys.argv[2]
voz = video / "motion" / "voz"
nar = json.loads((voz / "narracao.json").read_text(encoding="utf-8"))
sem = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--sem=")), [])
ids = [k for k in nar["falas"] if k not in sem]
textos = [nar["falas"][k] for k in ids]
trab = SCRATCH / video.name
trab.mkdir(parents=True, exist_ok=True)

wav = trab / "assets" / "voice" / "tudo.wav"
if not wav.exists() or "--refazer" in sys.argv:
    for f in (trab / "assets" / "voice").glob("tudo*.wav"):
        f.unlink()
    req = {"provider": "gemini", "tts_model": modelo, "voice": nar["voz"], "lang": "pt", "style": nar["estilo"],
           "lines": [{"id": "tudo", "text": "\n\n".join(textos)}], "bgm": {"mode": "none"}}
    (trab / "req.json").write_text(json.dumps(req, ensure_ascii=False), encoding="utf-8")
    r = subprocess.run(["node", ENGINE, "--request", "req.json", "--hyperframes", ".", "--out", "meta.json", "--only", "tts"],
                       cwd=trab, capture_output=True, text=True)
    print(r.stdout[-800:], r.stderr[-800:])
meta = json.loads((trab / "meta.json").read_text())
v = next(x for x in meta["voices"] if x["id"] == "tudo")
wav = trab / v["path"]
words = v["words"]
total = v["duration_s"]
print(f"duração total {total:.1f} s, {len(words)} palavras")
print("início:", " ".join(w["text"] for w in words[:12]))

# Pausas (silêncios) do áudio
r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(wav), "-af", "silencedetect=noise=-38dB:d=0.12", "-f", "null", "-"],
                   capture_output=True, text=True)
ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
fim = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
pausas = [(a, b) for a, b in zip(ini, fim)]

# Fronteiras: as primeiras palavras de cada fala, procuradas em sequência na transcrição;
# o corte fica no meio da pausa que termina logo antes delas
import unicodedata
def nrm(x):
    x = x.replace("ψ", "psi").replace("Ψ", "psi").replace("γ", "gama").replace("Δ", "delta")
    x = unicodedata.normalize("NFD", x.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in x if unicodedata.category(c) != "Mn"))
W = [nrm(w["text"]) for w in words]
cortes, i0 = [], 0
import difflib, tempfile
LARGE = str(Path.home() / ".cache/hyperframes/whisper/models/ggml-large-v3-turbo-q5_0.bin")
def ouvir(t0, d):
    with tempfile.NamedTemporaryFile(suffix=".wav", dir=str(trab)) as f:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t0:.3f}", "-t", f"{d:.3f}", "-i", str(wav),
                        "-ar", "16000", "-ac", "1", f.name], check=True)
        r = subprocess.run(["whisper-cli", "-m", LARGE, "-l", "pt", "-nt", "-np", "-f", f.name], capture_output=True, text=True)
    toks = [x for x in (nrm(y) for y in r.stdout.split()) if x]
    lead = ["#"] if toks and toks[0].isdigit() else []      # fala que começaria com um número: improvável
    return lead + [x for x in toks if x not in NUMS and not x.isdigit()]
NUMS = set("um uma dois duas tres quatro cinco seis sete oito nove dez onze doze treze catorze quinze dezesseis vinte trinta quarenta cinquenta sessenta setenta oitenta noventa cem cento duzentos trezentos quatrocentos quinhentos seiscentos setecentos oitocentos novecentos mil milhao virgula zero".split())
def igual(x, y):
    return x == y or (len(x) > 3 and difflib.SequenceMatcher(None, x, y).ratio() >= 0.75)
for k in range(1, len(ids)):
    sig = [x for x in (nrm(y) for y in textos[k].split()[:10]) if len(x) >= 3 and x not in NUMS][:3]
    melhor = None
    for i in range(i0 + max(1, int(0.6 * len(textos[k - 1].split()))), len(W)):
        if not igual(W[i], sig[0]):
            continue
        resto = W[i + 1:i + 7]
        if len(sig) < 2 or any(igual(w, sig[1]) for w in resto):
            melhor = i; break
    if melhor is None and len(sig) > 2:   # a transcrição errou a 1ª âncora: tenta a 2ª e a 3ª
        for i in range(i0 + 1, len(W) - 1):
            if igual(W[i], sig[1]) and any(igual(w, sig[2]) for w in W[i + 1:i + 6]):
                melhor = max(i0 + 1, i - 1); sig = sig[1:]; break
    if melhor is None:      # só a primeira palavra-âncora, se for longa
        melhor = next((i for i in range(i0 + 1, len(W)) if len(sig[0]) >= 5 and igual(W[i], sig[0])), None)
    if melhor is None:
        raise SystemExit(f"não achei o início de {ids[k]}: {sig}")
    ts = words[melhor]["start"]
    toks = [nrm(y) for y in textos[k].split()]
    lead = toks.index(sig[0]) if sig[0] in toks else 0      # palavras curtas antes da âncora
    # candidatas: pausas perto da âncora; escolhe a que, ouvida pelo whisper large, abre a próxima fala
    cand = [(a_, b_) for a_, b_ in pausas if ts - 0.45 * lead - 2.5 < b_ <= ts + 2.2 and b_ - a_ >= 0.12]
    esperado = [x for x in (nrm(y) for y in textos[k].split()[:6]) if x and x not in NUMS][:3]
    melhor_c, melhor_s = None, -1
    for a_, b_ in cand:
        ouv = ouvir((a_ + b_) / 2, 2.4)[:4]
        sc = difflib.SequenceMatcher(None, esperado, ouv[:len(esperado)]).ratio() + 0.05 * min(b_ - a_, 1.0)
        if sc > melhor_s:
            melhor_c, melhor_s = (a_, b_), sc
    if melhor_s < 0.75:       # âncora duvidosa: varre as pausas perto da posição proporcional
        f0, f1_ = words[0]["start"], words[-1]["end"]
        prop = f0 + sum(len(x) for x in textos[:k]) / sum(len(x) for x in textos) * (f1_ - f0)
        ant = cortes[-1] if cortes else 0.0
        for a_, b_ in pausas:
            if abs((a_ + b_) / 2 - prop) > 7 or (a_ + b_) / 2 <= ant + 1.0 or b_ - a_ < 0.12:
                continue
            ouv = ouvir((a_ + b_) / 2, 2.4)[:4]
            sc = difflib.SequenceMatcher(None, esperado, ouv[:len(esperado)]).ratio() + 0.05 * min(b_ - a_, 1.0)
            if sc > melhor_s:
                melhor_c, melhor_s = (a_, b_), sc
    meio = (melhor_c[0] + melhor_c[1]) / 2 if melhor_c else ts - 0.12
    if melhor_s < 0.6:
        print(f"  aviso: corte {ids[k - 1]}|{ids[k]} incerto ({melhor_s:.2f})")
    cortes.append(meio)
    i0 = melhor
limites = [0.0] + cortes + [total]

falas = {}
for k, fid in enumerate(ids):
    a, b = limites[k], limites[k + 1]
    ws = [w for w in words if a <= (w["start"] + w["end"]) / 2 < b]
    # corte no meio das pausas: a fala fica inteira, com meia pausa de silêncio em cada ponta
    t0 = a if k else max(0.0, (ws[0]["start"] - 0.15) if ws else 0.0)
    t1 = b
    mp3 = voz / f"{fid}.mp3"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t0:.3f}", "-to", f"{t1:.3f}", "-i", str(wav),
                    "-af", "afade=t=in:d=0.02,areverse,afade=t=in:d=0.06,areverse", "-ac", "1", "-ar", "48000",
                    "-c:a", "libmp3lame", "-b:a", "96k", str(mp3)], check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp3)],
                               capture_output=True, text=True).stdout)
    falas[fid] = {"dur": round(dur, 3), "words": [{"text": w["text"], "start": round(w["start"] - t0, 3), "end": round(w["end"] - t0, 3)} for w in ws]}
    print(f"{fid} {dur:5.1f} s | {' '.join(w['text'] for w in ws)}")
    print(f"{'':10}| {textos[k]}")
antigo = json.loads((voz / "falas.json").read_text(encoding="utf-8")) if (voz / "falas.json").exists() else {}
for k in sem:
    if k in antigo:
        falas[k] = antigo[k]
falas = {k: falas[k] for k in nar["falas"] if k in falas}
for f in voz.glob("*.mp3"):
    if f.stem not in falas:
        f.unlink()
(voz / "falas.json").write_text(json.dumps(falas, ensure_ascii=False, indent=0), encoding="utf-8")
