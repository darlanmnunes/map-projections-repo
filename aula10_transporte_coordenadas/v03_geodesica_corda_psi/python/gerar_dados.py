"""
V3. Geodésica projetada, corda e redução angular ψ.

Gera motion/v3-dados.json e confere os números dos slides 9 e 10 (GRS80, UTM 23S),
com o módulo comum (aula10_transporte_coordenadas/comum/transporte.py):

- 'vic': linha norte-sul de 3 km a partir da estação de Viçosa (slide 16): ψ pela eq. (23),
  ψ "numérico" (geodésica amostrada pelo pyproj Geod e projetada: ângulo entre a tangente
  no início e a corda), flecha (afastamento máximo entre a curva e a corda), deslocamento
  lateral do fim da linha quando ψ é esquecido, γ e os três azimutes.
- 'traj': estados de uma linha que se move no fuso (cena 3), com ψ pela eq. (23):
  sobre o MC (N-S), girando para leste-oeste, voltando e afastando-se para leste, e crescendo.

Uso:
    python gerar_dados.py
"""

import json
import warnings
import math
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parents[1] / "comum"))
import transporte as T  # noqa: E402

warnings.filterwarnings("ignore", category=UserWarning)
SAIDA = AQUI.parent / "motion" / "v3-dados.json"
UTM = T.UTM23


def psi_numerico(E1, N1, E2, N2, n=400):
    """ψ (″) entre a tangente à geodésica projetada em 1 e a corda; flecha (m)."""
    lo1, la1 = UTM(E1, N1, inverse=True)
    lo2, la2 = UTM(E2, N2, inverse=True)
    az12, _, s = T.GEOD.inv(lo1, la1, lo2, la2)
    pts = T.GEOD.fwd_intermediate(lo1, la1, az12, npts=n, del_s=s / (n + 1), initial_idx=0, terminus_idx=0)
    xs, ys = UTM(list(pts.lons), list(pts.lats))
    # tangente: passo de 0,5 m ao longo da geodésica
    lo_t, la_t, _ = T.GEOD.fwd(lo1, la1, az12, 0.5)
    Et, Nt = UTM(lo_t, la_t)
    azT = math.degrees(math.atan2(Et - E1, Nt - N1))
    azC = math.degrees(math.atan2(E2 - E1, N2 - N1))
    dE, dN = E2 - E1, N2 - N1
    L = math.hypot(dE, dN)
    flecha = max(abs((x - E1) * dN - (y - N1) * dE) / L for x, y in zip(xs, ys))
    return (azT - azC) * 3600, flecha, az12


v = T.VICOSA
E1, N1 = v["E2"], v["N2"]                 # estação de Viçosa
E2, N2 = E1, N1 + 3000.0
psi_eq = T.psi(E1, N1, E2, N2)
psi_num, flecha, az_geo = psi_numerico(E1, N1, E2, N2)
g1 = T.gama(E1, N1)
azc, dc = T.az_corda(E1, N1, E2, N2)
azq = azc + psi_eq / 3600
lateral = dc * psi_eq / T.RHO
vic = {"Elinha": E1 - T.E0, "L": dc, "psi": psi_eq, "psi_num": psi_num, "flecha": flecha, "lateral": lateral,
       "gama": g1, "azc": azc, "azq": azq % 360, "az": (azq + g1) % 360, "az_pyproj": az_geo % 360}

# Trajetória da cena 3: (E′ do ponto 1 em km, ângulo da linha em graus, comprimento em km) → ψ
fases = []


def estado(e_km, ang, L_km):
    Ea = T.E0 + e_km * 1000
    Eb = Ea + L_km * 1000 * math.sin(math.radians(ang))
    Nb = N1 + L_km * 1000 * math.cos(math.radians(ang))
    return [round(e_km, 3), round(ang, 3), round(L_km, 3), round(T.psi(Ea, N1, Eb, Nb), 4)]


K = 60
traj = {
    "mc": [estado(0, 0, 3) for _ in range(2)],
    "gira": [estado(0, 90 * u / K, 3) for u in range(K + 1)],
    "volta": [estado(0, 90 * (1 - u / K), 3) for u in range(K + 1)],
    "leste": [estado(300 * u / K, 0, 3) for u in range(K + 1)],
    "cresce": [estado(300, 0, 3 + 7 * u / K) for u in range(K + 1)],
}

dados = {"vic": vic, "traj": traj, "rho": T.RHO, "k0": T.K0}
SAIDA.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

print("Linha N-S de 3 km a partir da estação de Viçosa (E′ = %.3f km)" % (vic["Elinha"] / 1000))
print(f"  ψ eq. (23)        = {psi_eq:+.4f}″   (slide 10: 1,7″)")
print(f"  ψ numérico        = {psi_num:+.4f}″   diferença {psi_eq - psi_num:+.4f}″ (slide 10: 0,001″)")
print(f"  flecha            = {flecha * 1000:.2f} mm   (Dc·ψ/4 = {dc * psi_eq / T.RHO / 4 * 1000:.2f} mm)")
print(f"  deslocamento      = {lateral * 1000:.1f} mm   (slide 10: 25 mm)")
print(f"  γ = {T.dms(g1)}  AzC = {T.dms(azc)}  AzQ = {T.dms(vic['azq'])}  Az = {T.dms(vic['az'])}  (pyproj Az = {T.dms(vic['az_pyproj'])})")
print("Trajetória: ψ no MC %.4f″; E-O %.4f″; a 300 km %.3f″; 10 km a 300 km %.3f″" % (
    traj["mc"][0][3], traj["gira"][-1][3], traj["leste"][-1][3], traj["cresce"][-1][3]))
print(SAIDA.relative_to(AQUI.parents[2]))
