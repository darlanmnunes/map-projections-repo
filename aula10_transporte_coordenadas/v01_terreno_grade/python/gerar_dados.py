"""
V1. Do terreno à grade: por que transportar coordenadas.

Gera motion/v1-dados.json com os pontos do exemplo resolvido de Viçosa (slide 16)
e os valores que o vídeo mostra, calculados pelo módulo comum
(aula10_transporte_coordenadas/comum/transporte.py), e confere-os com o slide 17.

Uso:
    python gerar_dados.py
"""

import json
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parents[1] / "comum"))
import transporte as T  # noqa: E402

SAIDA = AQUI.parent / "motion" / "v1-dados.json"

v = T.VICOSA
r = T.direto(v["E1"], v["N1"], v["E2"], v["N2"], v["alfa"], v["Dh"], v["hm"])
m2 = T.m_ponto(v["E2"], v["N2"])
dados = {
    "p1": [v["E1"], v["N1"]], "p2": [v["E2"], v["N2"]], "p3": [round(r["E3"], 3), round(r["N3"], 3)],
    "alfa": v["alfa"], "Dh": v["Dh"], "hm": v["hm"],
    "azc21": r["azc21"], "azq23": r["azq23"], "azc23": r["azc23"],
    "Fh": r["Fh"], "m2": m2, "m23": r["m23"], "Dc": r["Dc"], "De": r["De"],
    "gama2": T.gama(v["E2"], v["N2"]),
}
SAIDA.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

print(f"E3 = {r['E3']:.3f}  N3 = {r['N3']:.3f}   (slide 17: 724 818,294 ; 7 704 974,775)")
print(f"Fh = {r['Fh']:.7f}  m(Viçosa) = {m2:.6f}  m23 = {r['m23']:.8f}   (0,9998953 ; 1,000210 ; 1,00021720)")
print(f"Dh = {v['Dh']:.3f} → De = {r['De']:.3f} → Dc = {r['Dc']:.3f}   (2 849,701 ; 2 850,320)")
print(f"γ2 = {T.dms(dados['gama2'])}   (−0°45′22,075″)")
print(SAIDA.relative_to(AQUI.parents[2]))
