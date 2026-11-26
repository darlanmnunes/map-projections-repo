"""
V2. Do geodésico ao geocêntrico e ao topocêntrico: a terna local.

Gera motion/v2-dados.json e confere os números dos slides 14 a 16 e 22 da Aula 11
(GRS80, SIRGAS 2000), com o pyproj:

- origem O (φ0, λ0, h0): coordenadas geocêntricas pela eq. (29) e pelo pyproj (+proj=cart);
- matriz T = R1(90° − φ0) R3(90° + λ0), eq. (31): linhas = vetores leste, norte e normal;
- P1 a 1 800 m de O, azimute geodésico 35°, h = 712 m: (xL, yL, zL) pela eq. (30) e pelo
  pyproj (+proj=topocentric), distância e azimute no plano, e a queda da superfície;
- convergência no plano local, eq. (37): γL ≈ xL tan φ0 / Rm, por km e a 17,5 km.

Uso:
    python gerar_dados.py
"""

import json
import math
from pathlib import Path

import numpy as np
from pyproj import Geod, Transformer

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v2-dados.json"

A, F = 6378137.0, 1 / 298.257222101          # GRS80
E2 = F * (2 - F)
RHO = 180 / math.pi * 3600


def dms(s):
    g, m, sec = s
    sinal = -1 if g < 0 else 1
    return sinal * (abs(g) + m / 60 + sec / 3600)


phi0, lam0, h0 = dms((-20, 44, 10)), dms((-42, 53, 25)), 700.0


def raios(phi):
    s = math.sin(math.radians(phi))
    w = math.sqrt(1 - E2 * s * s)
    return A * (1 - E2) / w ** 3, A / w      # M, N


def geocentrico(phi, lam, h):              # eq. (29)
    _, N = raios(phi)
    p, l = math.radians(phi), math.radians(lam)
    return np.array([(N + h) * math.cos(p) * math.cos(l), (N + h) * math.cos(p) * math.sin(l),
                     (N * (1 - E2) + h) * math.sin(p)])


def matriz_T(phi, lam):                    # eq. (31)
    p, l = math.radians(phi), math.radians(lam)
    return np.array([[-math.sin(l), math.cos(l), 0],
                     [-math.sin(p) * math.cos(l), -math.sin(p) * math.sin(l), math.cos(p)],
                     [math.cos(p) * math.cos(l), math.cos(p) * math.sin(l), math.sin(p)]])


cart = Transformer.from_pipeline("+proj=cart +ellps=GRS80")
XO = geocentrico(phi0, lam0, h0)
XO_pp = np.array(cart.transform(lam0, phi0, h0))
T = matriz_T(phi0, lam0)

# P1: problema direto no elipsoide a partir de O
g = Geod(ellps="GRS80")
lam1, phi1, _ = g.fwd(lam0, phi0, 35.0, 1800.0)
h1 = 712.0
X1 = geocentrico(phi1, lam1, h1)
loc = T @ (X1 - XO)
topo = Transformer.from_pipeline(f"+proj=pipeline +step +proj=cart +ellps=GRS80 "
                                 f"+step +proj=topocentric +ellps=GRS80 +lat_0={phi0} +lon_0={lam0} +h_0={h0}")
loc_pp = np.array(topo.transform(lam1, phi1, h1))
dist = math.hypot(loc[0], loc[1])
az = math.degrees(math.atan2(loc[0], loc[1]))
M0, N0 = raios(phi0)
Rm = math.sqrt(M0 * N0)
queda = 1800.0 ** 2 / (2 * Rm)             # eq. (32)

# Convergência no plano local, eq. (37)
gkm = 1000 * math.tan(math.radians(phi0)) / Rm * RHO
g175 = 17500 * math.tan(math.radians(phi0)) / Rm * RHO
# conferência: Δλ sen φ de um ponto 17,5 km a leste de O
lam_e, phi_e, _ = g.fwd(lam0, phi0, 90.0, 17500.0)
g175_geo = (lam_e - lam0) * math.sin(math.radians((phi0 + phi_e) / 2)) * 3600

dados = {
    "O": dict(phi=phi0, lam=lam0, h=h0, X=XO.tolist(), M=M0, N=N0, Rm=Rm),
    "T": T.tolist(),
    "P1": dict(phi=phi1, lam=lam1, h=h1, X=X1.tolist(), dX=(X1 - XO).tolist(), xL=loc[0], yL=loc[1], zL=loc[2],
               dist=dist, az=az, queda=queda),
    "conv": dict(gkm=gkm, g175=g175, g175_geo=g175_geo),
}
SAIDA.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def fdms(x, c=2):
    s = "−" if x < 0 else ""
    x = abs(x); d = int(x); m = int((x - d) * 60); sec = (x - d - m / 60) * 3600
    return f"{s}{d}°{m:02d}′{sec:0{3 + c}.{c}f}″"


print("O geocêntrico eq.(29):", np.round(XO, 3), " pyproj:", np.round(XO_pp, 3))
print("   esperado 4 372 598,548 ; −4 061 886,871 ; −2 244 342,857")
print("T =\n", np.round(T, 6))
print("T Tᵀ = I:", np.allclose(T @ T.T, np.eye(3)))
print("P1 φ, λ:", fdms(phi1, 4), fdms(lam1, 4), "  (−20°43′22,0545″; −42°52′49,3171″)")
print("P1 local eq.(30):", np.round(loc, 3), " pyproj:", np.round(loc_pp, 3), "  (1 032,553; 1 474,639; 11,745)")
print(f"√(xL²+yL²) = {dist:.3f}  (1 800,202)   atan2 = {fdms(az)}  (34°59′59,94″)")
print(f"Rm = {Rm:.0f}  queda s²/2Rm = {queda:.3f} m")
print(f"γL: {gkm:.2f}″ por km; a 17,5 km {fdms(g175 / 3600)} (Δλ sen φ: {fdms(g175_geo / 3600)})")
