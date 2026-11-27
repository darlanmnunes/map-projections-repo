"""
Copia o bloco comum da Aula 10 para cada vídeo.

O player carrega um único shared.js e um único base.css por vídeo. Este script
coloca comum/a10.js no início de cada motion/shared.js (até a linha-marcador) e
copia comum/base.css para cada motion/base.css.

Uso:
    python aulas/aula10_transporte_coordenadas/comum/atualizar_comum.py
"""

from pathlib import Path

AQUI = Path(__file__).resolve().parent
MARCA = "// ---- fim do bloco comum (comum/a10.js) ----\n"

a10 = (AQUI / "a10.js").read_text(encoding="utf-8")
css = (AQUI / "base.css").read_text(encoding="utf-8")
for motion in sorted(AQUI.parent.glob("v*/motion")):
    sh = motion / "shared.js"
    proprio = sh.read_text(encoding="utf-8").split(MARCA, 1)[-1] if sh.exists() else ""
    sh.write_text(a10 + MARCA + proprio, encoding="utf-8")
    (motion / "base.css").write_text(css, encoding="utf-8")
    print(motion.parent.name)
