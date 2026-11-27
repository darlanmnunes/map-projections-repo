"""
V5. Problema inverso, contra-azimute e os três arcos da UFPR.

Gera motion/v5-dados.json com os valores que o vídeo mostra, calculados pelo módulo comum
(aulas/aula10_transporte_coordenadas/comum/transporte.py), e os confere com o slide 18 da Aula 10
e com o exercício do problema inverso das notas da UFPR (Delazari, 2022, slides 23 e 24).

- 'vicosa': problema inverso da linha 2→3 do exemplo resolvido (slides 16 a 18) e o mesmo
  transporte feito no elipsoide (pyproj Geod);
- 'contra': contra-azimute 3→2 e a convergência dos meridianos entre 2 e 3 (≈ Δλ sen φ);
- 'arcos': as três linhas do exercício da UFPR (arco do equador, linha sobre o MC e trecho
  do meridiano de 42° O, borda do fuso 23).

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

SAIDA = AQUI.parent / "motion" / "v5-dados.json"

v = T.VICOSA
d = T.direto(v["E1"], v["N1"], v["E2"], v["N2"], v["alfa"], v["Dh"], v["hm"])
E2, N2, E3, N3 = v["E2"], v["N2"], d["E3"], d["N3"]
inv = T.inverso(E2, N2, E3, N3, v["hm"])
inv32 = T.inverso(E3, N3, E2, N2, v["hm"])
# Fator da linha pela eq. (19) (Simpson com os fatores exatos), como no slide 18
inv["m12"] = T.m_simpson(E2, N2, E3, N3)
inv["De"] = inv["Dc"] / inv["m12"]
inv["Dh"] = inv["De"] / inv["Fh"]
el = T.elipsoide(v["E1"], v["N1"], E2, N2, v["alfa"], v["Dh"], v["hm"])
dif_mm = math.dist((el["E3"], el["N3"]), (E3, N3)) * 1000
g2 = T.gama(E2, N2)
g2x = T.gama_exato(E2, N2)

# Contra-azimute: Az32 − Az23 − 180° = convergência dos meridianos entre 2 e 3
lo2, la2 = T.UTM23(E2, N2, inverse=True)
lo3, la3 = T.UTM23(E3, N3, inverse=True)
falta = (inv32["az12"] - inv["az12"] - 180) * 3600          # segundos (negativo: faltam)
conv = (lo3 - lo2) * math.sin(math.radians((la2 + la3) / 2)) * 3600

LINHAS = {
    "1": dict(nome="Arco do equador", p1=(505000.0, 10000000.0), p2=(508000.0, 10000000.0)),
    "2": dict(nome="Sobre o MC", p1=(500000.0, 7950000.0), p2=(500000.0, 7947000.0)),
    "3": dict(nome="Meridiano de 42° O", p1=(802819.794, 7231690.208), p2=(802696.935, 7226148.832)),
}
arcos = {}
for k, L in LINHAS.items():
    r = T.inverso(*L["p1"], *L["p2"])
    lo1, la1 = T.UTM23(*L["p1"], inverse=True)
    lo2_, la2_ = T.UTM23(*L["p2"], inverse=True)
    arcos[k] = dict(nome=L["nome"], p1=L["p1"], p2=L["p2"], lon1=lo1, lat1=la1, lon2=lo2_, lat2=la2_,
                    azc=r["azc"], Dc=r["Dc"], psi=r["psi12"], gama=r["gama1"], az=r["az12"], m=r["m12"], De=r["De"])

# Fuso 23 esquemático: meridianos −48°, −45° (MC) e −42° e o equador, em km na grade UTM 23S
fuso = {}
for lam in (-48.0, -45.0, -42.0):
    pts = [T.UTM23(lam, phi) for phi in [4 - 0.5 * i for i in range(77)]]
    fuso[str(int(lam))] = [[round(e / 1000, 2), round(n / 1000, 2)] for e, n in pts]
fuso["eq"] = [[round(T.UTM23(l / 10, 0.0)[0] / 1000, 2), 10000.0] for l in range(-480, -419)]

dados = {
    "fuso": fuso,
    "vicosa": dict(E2=E2, N2=N2, E3=E3, N3=N3, gama2=g2, gama2x=g2x, azc=inv["azc"], Dc=inv["Dc"], psi=inv["psi12"],
                   az23=inv["az12"], az23el=el["az23"], az32=inv32["az12"], az32el=el["az32"], m=inv["m12"],
                   De=inv["De"], Deel=el["De"], Fh=inv["Fh"], Dh=inv["Dh"], E3el=el["E3"], N3el=el["N3"], dif_mm=dif_mm),
    "contra": dict(lon2=lo2, lat2=la2, lon3=lo3, lat3=la3, falta=falta, conv=conv),
    "arcos": arcos,
}
SAIDA.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

V = dados["vicosa"]
print("Viçosa, linha 2→3 (slide 18)")
print(f"  γ2 eq.(24) {T.dms(g2)}  exato {T.dms(g2x)}   (−0°45′22,075″)")
print(f"  AzC {T.dms(V['azc'])}  ψ23 {V['psi']:+.3f}″  Dc {V['Dc']:.3f}  m23 {V['m']:.8f}")
print(f"  Az23 grade {T.dms(V['az23'])}  elipsoide {T.dms(V['az23el'])}   (70°24′35,946″ ; 70°24′35,945″)")
print(f"  Az32 grade {T.dms(V['az32'])}  elipsoide {T.dms(V['az32el'])}   (250°24′03,073″)")
print(f"  De grade {V['De']:.4f}  elipsoide {V['Deel']:.4f}   (2 849,7015)")
print(f"  Dh = De/Fh = {V['Dh']:.4f}   (2 850,0000)")
print(f"  E3, N3 grade {E3:.3f} ; {N3:.3f}  elipsoide {el['E3']:.3f} ; {el['N3']:.3f}  dif {dif_mm:.4f} mm   (0,005 mm)")
print(f"Contra-azimute: Az32 − Az23 = {T.dms(V['az32'] - V['az23'])}  faltam {-falta:.1f}″  Δλ sen φ = {conv:+.1f}″")
print("Três arcos (UFPR, slide 24)")
for k, a in arcos.items():
    print(f"  {k} {a['nome']}: λ {a['lon1']:.4f} φ {a['lat1']:.4f}  AzC {T.dms(a['azc'])}  ψ {a['psi']:+.3f}″  γ {T.dms(a['gama'], 3)}"
          f"  Az {T.dms(a['az'], 1)}  m {a['m']:.8f}  Dc {a['Dc']:.3f}  De {a['De']:.3f}")
print(SAIDA.relative_to(AQUI.parents[3]))
