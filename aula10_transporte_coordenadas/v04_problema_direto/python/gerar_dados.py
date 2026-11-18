"""
V4. Problema direto, passo a passo.

Gera motion/v4-dados.json com todos os valores intermediários do exemplo resolvido de Viçosa
(slides 16 e 17) e do exemplo da UFPR (Delazari, 2022; programa TRANSPUTM; slide 20), calculados
pelo módulo comum (aula10_transporte_coordenadas/comum/transporte.py), e confere-os com os slides.

Uso:
    python gerar_dados.py
"""

import json
import math
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parents[1] / "comum"))
import transporte as T  # noqa: E402

SAIDA = AQUI.parent / "motion" / "v4-dados.json"


def trunc(x, c):
    return math.floor(x * 10 ** c) / 10 ** c


v = T.VICOSA
r = T.direto(v["E1"], v["N1"], v["E2"], v["N2"], v["alfa"], v["Dh"], v["hm"])
r2 = T.direto(v["E1"], v["N1"], v["E2"], v["N2"], v["alfa"], v["Dh"], v["hm"], iter_=2)
it2_mm = math.dist(r2["hist"][0], r2["hist"][1]) * 1000

vic = {
    "p1": [v["E1"], v["N1"]], "p2": [v["E2"], v["N2"]], "alfa": v["alfa"], "Dh": v["Dh"], "hm": v["hm"],
    "azc21": r["azc21"], "psi21": r["psi21"], "azq21": r["azq21"], "azq23": r["azq23"],
    "Fh": r["Fh"], "De": r["De"], "m2": r["m2"], "p3a": [r["E3a"], r["N3a"]],
    "psi23": r["psi23"], "azc23": r["azc23"], "m23": trunc(r["m23"], 8), "k23": r["k23"], "Dc": r["Dc"],
    "p3": [r["E3"], r["N3"]], "beta_s": (r["beta"] - v["alfa"]) * 3600, "it2_mm": it2_mm,
}

u = T.UFPR
ufpr = {"re": [u["E1"], u["N1"]], "est": [u["E2"], u["N2"]], "De": u["De"], "pts": []}
for k, a in u["alfas"].items():
    rr = T.direto(u["E1"], u["N1"], u["E2"], u["N2"], a, u["De"], 0.0)
    pe, pn = u["pub"][k]
    ufpr["pts"].append({"id": k, "alfa": a, "pub": [pe, pn], "calc": [rr["E3"], rr["N3"]],
                        "dif_mm": math.dist((pe, pn), (rr["E3"], rr["N3"])) * 1000,
                        "psi_re": rr["psi21"], "psi_v": rr["psi23"], "azc": rr["azc23"], "m": rr["m23"], "Dc": rr["Dc"]})

SAIDA.write_text(json.dumps({"vic": vic, "ufpr": ufpr}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

print("Viçosa, problema direto (slide 17)")
print(f"  AzC21 = {T.dms(r['azc21'])}  ψ21 = {r['psi21']:+.3f}″   (312°45′21,387″ ; +0,633″)")
print(f"  AzQ21 = {T.dms(r['azq21'])}  AzQ23 = {T.dms(r['azq23'])}   (312°45′22,021″ ; 71°09′58,021″)")
print(f"  Fh = {r['Fh']:.7f}  De = {r['De']:.3f}   (0,9998953 ; 2 849,701)")
print(f"  ponto 3 aproximado: {r['E3a']:.3f} ; {r['N3a']:.3f}   (724 818,276 ; 7 704 974,761)")
print(f"  ψ23 = {r['psi23']:+.3f}″  AzC23 = {T.dms(r['azc23'])}   (+0,523″ ; 71°09′57,497″)")
print(f"  m23 = {vic['m23']:.8f}  k23 = {r['k23']:.8f}  Dc = {r['Dc']:.3f}   (1,00021720 ; 1,00011244 ; 2 850,320)")
print(f"  E3 = {r['E3']:.3f}  N3 = {r['N3']:.3f}   (724 818,294 ; 7 704 974,775)")
print(f"  β − α = {vic['beta_s']:+.3f}″ (+0,11″)   2ª iteração: {it2_mm:.3f} mm (0,1 mm)")
print("UFPR (slide 20)")
for p in ufpr["pts"]:
    print(f"  {p['id']}: calc {p['calc'][0]:.3f} ; {p['calc'][1]:.3f}  pub {p['pub'][0]:.3f} ; {p['pub'][1]:.3f}  dif {p['dif_mm']:.2f} mm")
print(SAIDA.relative_to(AQUI.parents[2]))
