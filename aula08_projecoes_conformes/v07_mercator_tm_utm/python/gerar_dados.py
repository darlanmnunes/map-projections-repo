"""
V7. Da Mercator à Transversa de Mercator e ao UTM.

Gera o módulo de dados da animação (motion/v7-dados.json) e confere os números
do roteiro no GRS80 (slides 22 a 24), com pyproj.

- 'curva': x (km) e m da TM tangente (k0 = 1, λ0 = −45°) ao longo do paralelo de Viçosa,
  de λ = −48° a −42° (bordas do fuso 23). A curva do UTM é a mesma × 0,9996.
- 'land': costa Natural Earth 1:110m (globo).

Uso:
    python gerar_dados.py [caminho/para/naturalearth_lowres.shp]
"""

import json
import sys
from pathlib import Path

import numpy as np
import pyogrio
from pyproj import Proj
from scipy.optimize import brentq
from shapely.ops import unary_union

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v7-dados.json"
SHP_PADRAO = (
    Path(pyogrio.__file__).parent
    / "tests" / "fixtures" / "naturalearth_lowres" / "naturalearth_lowres.shp"
)

LAM0, K0 = -45.0, 0.9996
VICOSA = (-(42 + 52 / 60), -(20 + 45 / 60))
SIMPLIFICA = 0.2
ADENSA = 1.5


def achatar(a):
    return [round(float(v), 2) for v in np.asarray(a).ravel()]


def main():
    shp = Path(sys.argv[1]) if len(sys.argv) > 1 else SHP_PADRAO
    terra = unary_union(pyogrio.read_dataframe(shp).geometry.values)
    terra = terra.simplify(SIMPLIFICA).segmentize(ADENSA)
    aneis = [np.asarray(p.exterior.coords) for p in getattr(terra, "geoms", [terra]) if not p.is_empty]

    tm = Proj(proj="tmerc", lon_0=LAM0, k=1, ellps="GRS80")
    utm = Proj(proj="utm", zone=23, south=True, ellps="GRS80")
    phi = VICOSA[1]

    lams = np.linspace(-48, -42, 241)
    xs = [tm(l, phi)[0] / 1000 for l in lams]
    ms = [tm.get_factors(l, phi).parallel_scale for l in lams]

    dados = {
        "fonte": "Natural Earth 1:110m; GRS80",
        "curva": [[round(x, 3), round(m, 7)] for x, m in zip(xs, ms)],
        "land": [achatar(a) for a in aneis if len(a) > 3],
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB")

    E, N = utm(*VICOSA)
    mv = utm.get_factors(*VICOSA).parallel_scale
    lc = brentq(lambda l: utm.get_factors(l, phi).parallel_scale - 1, -44.99, -42)
    print(f"Viçosa em UTM 23S: E = {E:.2f} m; N = {N:.2f} m; m = {mv:.6f}; x = {(E - 500000) / 1000:.0f} km")
    print(f"Bordas do fuso na latitude de Viçosa: x = ±{xs[-1]:.0f} km; TM k0 = 1: m = {ms[-1]:.4f}")
    print(f"UTM: m = 1 em x = ±{(utm(lc, phi)[0] - 500000) / 1000:.0f} km")
    print(f"Borda no Equador: m = {utm.get_factors(-42, 0).parallel_scale:.5f}")
    print(f"Linhas de secância: ±{np.degrees(np.arccos(K0)):.3f}° de arco do MC (esfera)")


if __name__ == "__main__":
    main()
