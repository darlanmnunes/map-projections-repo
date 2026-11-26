"""
V3. Do UTM ao plano topográfico local: método rigoroso, similaridade 2D e método polar.

Gera motion/v3-dados.json com os valores que o vídeo mostra e os confere com o exemplo
resolvido da Aula 11 (slides 26 a 35): origem O em Viçosa, plano em hL = 700 m (altitude
geométrica), constantes XL,0 = 150 000 m e YL,0 = 250 000 m.

- rigoroso: (E, N) → (φ, λ) pela TM inversa; (φ, λ, hL) → (X, Y, Z), eq. (29); T · ΔX, eq. (30)
  e (31); + constantes, eq. (35). Conferido com +proj=topocentric (origem em hL).
- similaridade 2D: translação, rotação γ0 e escala 1/k, com k = m0/FL, eq. (38) e (39).
- polar: S e AzC na grade, De = S/mOP (Simpson, Aula 10 eq. 19), DL = FL · De,
  AzG = AzC + ψ + γ0, eq. (41).

Uso:
    python gerar_dados.py
"""

import json
import math
import sys
from pathlib import Path

import numpy as np
from pyproj import Transformer

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parents[2] / "aula10_transporte_coordenadas" / "comum"))
import transporte as T  # noqa: E402

SAIDA = AQUI.parent / "motion" / "v3-dados.json"
D = math.pi / 180
HL, X0L, Y0L = 700.0, 150000.0, 250000.0
O = (719681.442, 7705624.750)
PTS = {"P1": (720733.226, 7707085.928), "P2": (720538.909, 7703169.665), "P3": (716340.454, 7706258.886)}

lon0, lat0 = T.UTM23(*O, inverse=True)
M0, N0 = T.raios(lat0)
RM = math.sqrt(M0 * N0)
FL = (RM + HL) / RM
m0 = T.m_ponto(*O)
g0 = T.gama_exato(*O)                       # graus
k = m0 / FL


def ecef(lon, lat, h):
    Mx, Nx = T.raios(lat)
    p, l = lat * D, lon * D
    return np.array([(Nx + h) * math.cos(p) * math.cos(l), (Nx + h) * math.cos(p) * math.sin(l),
                     (Nx * (1 - T.E2) + h) * math.sin(p)])


sl, cl, sp, cp = math.sin(lon0 * D), math.cos(lon0 * D), math.sin(lat0 * D), math.cos(lat0 * D)
TM = np.array([[-sl, cl, 0], [-sp * cl, -sp * sl, cp], [cp * cl, cp * sl, sp]])
XO = ecef(lon0, lat0, HL)
topo = Transformer.from_pipeline(
    f"+proj=pipeline +step +proj=cart +ellps=GRS80 +step +proj=topocentric +ellps=GRS80 "
    f"+lon_0={lon0} +lat_0={lat0} +h_0={HL}")


def rigoroso(E, N):
    lon, lat = T.UTM23(E, N, inverse=True)
    X = ecef(lon, lat, HL)
    x, y, z = TM @ (X - XO)
    xp, yp, zp = topo.transform(lon, lat, HL)
    assert abs(x - xp) < 1e-6 and abs(y - yp) < 1e-6
    return dict(lon=lon, lat=lat, X=X.tolist(), dX=(X - XO).tolist(), x=x, y=y, z=z, XL=X0L + x, YL=Y0L + y)


def similar(E, N):
    dE, dN = E - O[0], N - O[1]
    c, s = math.cos(g0 * D), math.sin(g0 * D)
    a, b = dE * c + dN * s, -dE * s + dN * c
    return dict(dE=dE, dN=dN, c=c, s=s, a=a, b=b, x=a / k, y=b / k, XL=X0L + a / k, YL=Y0L + b / k)


def polar(E, N):
    azc, S = T.az_corda(*O, E, N)
    mop = T.m_simpson(*O, E, N)
    De = S / mop
    DL = FL * De
    ps = T.psi(*O, E, N)
    azg = azc + ps / 3600 + g0
    return dict(S=S, azc=azc, mop=mop, De=De, DL=DL, psi=ps, azg=azg,
                XL=X0L + DL * math.sin(azg * D), YL=Y0L + DL * math.cos(azg * D))


res = {}
for nome, (E, N) in PTS.items():
    r, si, po = rigoroso(E, N), similar(E, N), polar(E, N)
    res[nome] = dict(E=E, N=N, rig=r, sim=si, pol=po,
                     e_sim=math.hypot(si["XL"] - r["XL"], si["YL"] - r["YL"]) * 1000,
                     e_pol=math.hypot(po["XL"] - r["XL"], po["YL"] - r["YL"]) * 1000)
# P1 sem γ0: rotação esquecida
p1 = res["P1"]
sem_g = math.hypot(p1["sim"]["dE"] / k - p1["rig"]["x"], p1["sim"]["dN"] / k - p1["rig"]["y"])

# Erro da similaridade em função da distância à origem (pior azimute)
curva = []
for d_km in [0.5, 1, 2, 3, 5, 8, 12, 17.5]:
    pior = 0
    for az in range(0, 360, 15):
        lon, lat, _ = T.GEOD.fwd(lon0, lat0, az, d_km * 1000)
        E, N = T.UTM23(lon, lat)
        r, si = rigoroso(E, N), similar(E, N)
        pior = max(pior, math.hypot(si["XL"] - r["XL"], si["YL"] - r["YL"]) * 1000)
    curva.append([d_km, pior])

dados = dict(O=dict(E=O[0], N=O[1], lon=lon0, lat=lat0, X=XO.tolist()), hL=HL, FL=FL, Rm=RM, m0=m0, g0=g0, k=k,
             T=TM.tolist(), pts=res, sem_g=sem_g, curva=curva)
SAIDA.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

print(f"O: φ {T.dms(lat0)} λ {T.dms(lon0)}  Rm {RM:.0f}  FL {FL:.6f}  m0 {m0:.6f}  γ0 {T.dms(g0, 2)}  k {k:.7f}")
print(f"   XO {XO[0]:.3f} {XO[1]:.3f} {XO[2]:.3f}   (4 372 598,548; −4 061 886,871; −2 244 342,857)")
for nome, p in res.items():
    r, si, po = p["rig"], p["sim"], p["pol"]
    print(f"{nome}: rig {r['XL']:.3f} {r['YL']:.3f} z {r['z']:.3f} | sim {si['XL']:.3f} {si['YL']:.3f} ({p['e_sim']:.1f} mm)"
          f" | pol {po['XL']:.3f} {po['YL']:.3f} ({p['e_pol']:.1f} mm)")
po = res["P1"]["pol"]
print(f"P1 polar: S {po['S']:.3f} AzC {T.dms(po['azc'], 2)} mOP {po['mop']:.6f} De {po['De']:.3f} DL {po['DL']:.3f} ψ {po['psi']:+.2f}″ AzG {T.dms(po['azg'], 2)}")
print(f"P1 sem γ0: {sem_g:.2f} m   (23 m)")
print("similaridade × rigoroso (pior azimute):", ", ".join(f"{d} km {e:.0f} mm" for d, e in curva), "  (3, 12, 71, 881 mm)")
print(SAIDA.relative_to(AQUI.parents[2]))
