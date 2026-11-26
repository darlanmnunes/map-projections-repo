"""Confere cada fala (motion/voz/<id>.mp3) com o texto do roteiro, transcrevendo com whisper large-v3-turbo.
Uso: python qa_voz.py <pasta_do_video> [...]"""
import difflib, json, re, subprocess, sys, unicodedata
from pathlib import Path
MODELO = str(Path.home() / ".cache/hyperframes/whisper/models/ggml-large-v3-turbo-q5_0.bin")
import tempfile
TMP = Path(tempfile.gettempdir()) / "eam431_qa"; TMP.mkdir(exist_ok=True)
NUMS = set("um uma dois duas tres quatro cinco seis sete oito nove dez onze doze treze catorze quinze dezesseis dezessete dezoito dezenove vinte trinta quarenta cinquenta sessenta setenta oitenta noventa cem cento duzentos trezentos quatrocentos quinhentos seiscentos setecentos oitocentos novecentos mil virgula zero e".split())

def toks(x):
    x = x.replace("ψ", " psi ").replace("γ", " gama ").replace("gamma", "gama").replace("Δ", " delta ")
    x = unicodedata.normalize("NFD", x.lower())
    x = "".join(c for c in x if unicodedata.category(c) != "Mn")
    out = []
    for w in re.findall(r"[a-z0-9]+", x):
        if w.isdigit() or w in NUMS:
            continue
        out.append(w)
    return out

for v in sys.argv[1:]:
    voz = Path(v).resolve() / "motion" / "voz"
    nar = json.loads((voz / "narracao.json").read_text(encoding="utf-8"))["falas"]
    print("==", Path(v).name)
    for k, texto in nar.items():
        mp3 = voz / f"{k}.mp3"
        if not mp3.exists():
            print(f"  {k}: FALTA"); continue
        wav = TMP / f"{Path(v).name}_{k}.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-ar", "16000", "-ac", "1", str(wav)], check=True)
        r = subprocess.run(["whisper-cli", "-m", MODELO, "-l", "pt", "-nt", "-np", "-f", str(wav)], capture_output=True, text=True)
        ouv = " ".join(r.stdout.split())
        a, b = toks(texto), toks(ouv)
        sm = difflib.SequenceMatcher(None, a, b)
        rat = sm.ratio()
        dif = [(op, " ".join(a[i1:i2]), " ".join(b[j1:j2])) for op, i1, i2, j1, j2 in sm.get_opcodes() if op != "equal"]
        flag = "OK " if rat >= 0.9 else "VER"
        print(f"  {flag} {k} {rat:.2f}  {ouv}")
        if rat < 0.97:
            for d in dif:
                print(f"        {d}")
