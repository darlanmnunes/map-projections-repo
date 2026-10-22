"""
Empacota a pasta motion/ de um vídeo nos documentos do filme Motion.

Cada arquivo vira um JSON {"kind": ..., "text": ...} (módulos) e o filme
recebe também film/meta e film/script. Os JSON gerados são enviados ao
filme com a ferramenta de dados do artefato (um documento por arquivo).

Uso:
    python ferramentas/empacotar_motion.py <pasta_do_video> <pasta_saida> "<título>"
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

TIPOS = {".js": "js", ".css": "css", ".json": "json", ".html": "html", ".txt": "text"}


def main():
    video, saida, titulo = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
    motion = video / "motion"
    (saida / "modules").mkdir(parents=True, exist_ok=True)
    (saida / "film").mkdir(parents=True, exist_ok=True)

    agora = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    meta = {"v": 1, "title": titulo, "updatedAt": agora}
    (saida / "film" / "meta.json").write_text(json.dumps(meta, ensure_ascii=False), encoding="utf-8")
    script = {"code": "window.CUT = kit.scenes();"}
    (saida / "film" / "script.json").write_text(json.dumps(script), encoding="utf-8")

    for arq in sorted(motion.iterdir()):
        tipo = TIPOS.get(arq.suffix)
        if tipo is None:
            continue
        texto = arq.read_text(encoding="utf-8")
        if len(texto.encode("utf-8")) > 200 * 1024:
            sys.exit(f"{arq.name} passa de 200 KiB")
        doc = {"kind": tipo, "text": texto}
        (saida / "modules" / f"{arq.name}.json").write_text(json.dumps(doc, ensure_ascii=False), encoding="utf-8")
        print(f"modules/{arq.name}")


if __name__ == "__main__":
    main()
