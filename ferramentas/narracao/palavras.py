"""Refaz as palavras (texto e tempos) de motion/voz/falas.json com whisper large-v3-turbo, fala a fala.
Uso: python palavras.py <pasta_do_video> [...]"""
import json, subprocess, sys
from pathlib import Path
MODELO = str(Path.home() / ".cache/hyperframes/whisper/models/ggml-large-v3-turbo-q5_0.bin")
import tempfile
TMP = Path(tempfile.gettempdir()) / "eam431_qa"; TMP.mkdir(exist_ok=True)
for v in sys.argv[1:]:
    voz = Path(v).resolve() / "motion" / "voz"
    falas = json.loads((voz / "falas.json").read_text(encoding="utf-8"))
    for k in falas:
        wav = TMP / f"pw_{k}.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(voz / f"{k}.mp3"), "-ar", "16000", "-ac", "1", str(wav)], check=True)
        base = TMP / f"pw_{k}"
        subprocess.run(["whisper-cli", "-m", MODELO, "-l", "pt", "-ml", "1", "-sow", "-oj", "-of", str(base), "-np", "-f", str(wav)],
                       capture_output=True, text=True, check=True)
        seg = json.loads(Path(str(base) + ".json").read_text(encoding="utf-8", errors="replace"))["transcription"]
        words = []
        for s in seg:
            txt = s["text"].strip()
            if not txt:
                continue
            a, b = s["offsets"]["from"] / 1000, s["offsets"]["to"] / 1000
            words.append({"text": txt, "start": round(a, 3), "end": round(b, 3)})
        falas[k]["words"] = words
        print(v, k, " ".join(w["text"] for w in words)[:110])
    (voz / "falas.json").write_text(json.dumps(falas, ensure_ascii=False, indent=0), encoding="utf-8")
