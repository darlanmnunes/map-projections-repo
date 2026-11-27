"""
V1. Por que coordenadas locais: a grade UTM, as três famílias e o plano topográfico.

Gera motion/v1-dados.json com os números que o vídeo mostra, calculados com pyproj
(GRS80), e confere-os com os slides 5, 18 a 20 da nota de aula.

Uso:
    python gerar_dados.py
"""

import json
import math
from pathlib import Path

from pyproj import Proj

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v1-dados.json"

# Origem do exemplo (slide 31)
PHI0 = -(20 + 44 / 60 + 10 / 3600)
LAM0 = -(42 + 53 / 60 + 25 / 3600)
H0 = 700.0

a, f = 6378137.0, 1 / 298.257222101
e2 = f * (2 - f)
s2 = math.sin(math.radians(PHI0)) ** 2
M = a * (1 - e2) / (1 - e2 * s2) ** 1.5
N = a / math.sqrt(1 - e2 * s2)
Rm = math.sqrt(M * N)
FL = (Rm + H0) / Rm
Fh = 1 / FL


def m_tm(lon0, k0):
    p = Proj(proj="tmerc", lon_0=lon0, lat_0=0, k=k0, x_0=500000, y_0=10000000, ellps="GRS80")
    return p.get_factors(LAM0, PHI0).meridional_scale


sistemas = [
    ("UTM 23S", m_tm(-45, 0.9996)),
    ("RTM (MC −43°)", m_tm(-43, 0.999995)),
    ("LTM (MC −42°30′)", m_tm(-42.5, 0.999995)),
    ("TM municipal (k₀ = F_L)", m_tm(LAM0, FL)),
]
tab = [dict(nome=n, m=m, k=m * Fh, ppm=(m * Fh - 1) * 1e6) for n, m in sistemas]
tab.append(dict(nome="Plano topográfico local", m=None, k=1.0, ppm=0.0))

curv = []
for s_km in (1, 5, 17.5, 35):
    s = s_km * 1000
    th = s / Rm
    d = Rm * math.sin(th)
    curv.append(dict(s=s_km, sd_mm=(s - d) * 1000, zl=Rm * (1 - math.cos(th))))

dados = dict(phi0=PHI0, lam0=LAM0, h0=H0, Rm=Rm, FL=FL, Fh=Fh, tab=tab, curv=curv,
             alt75=75 / Rm * 1e6, alt150=150 / Rm * 1e6)
SAIDA.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

print(f"Rm = {Rm:.0f} m (6 362 091)   FL = {FL:.6f} (1,000110)   Fh = {Fh:.6f}")
for r in tab:
    print(f"  {r['nome']:26} m = {r['m'] if r['m'] else float('nan'):.6f}  k = {r['k']:.6f}  {r['ppm']:+.0f} mm/km")
print("  (slide 5: +86, −113, −95, 0, 0)")
for c in curv:
    print(f"  s = {c['s']:5} km   s − d = {c['sd_mm']:.3f} mm   zL = {c['zl']:.2f} m")
print(f"  75 m → {dados['alt75']:.1f} mm/km ; 150 m → {dados['alt150']:.1f} mm/km   (11,8 ; 23,6)")
print(SAIDA.relative_to(AQUI.parents[3]))
