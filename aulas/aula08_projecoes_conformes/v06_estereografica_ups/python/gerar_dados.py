"""
V6. Estereográfica: perspectiva do antípoda e o plano secante do UPS.

Gera o módulo de dados da animação (motion/v6-dados.json) e confere os números
do roteiro (slides 20 e 21).

- Esfera: m = 2 k0 / (1 + cos c), c = 90° − |φ| (distância angular ao polo sul).
- Elipsoide GRS80 (UPS, Snyder 1987, eq. 21-33 a 21-36): círculo de m = 1.
- 'land': costa Natural Earth 1:110m inteira (globo); 'ant': terra ao sul de 55° S
  (mapa polar da cena 4).

Uso:
    python gerar_dados.py [caminho/para/naturalearth_lowres.shp]
"""

import json
import sys
from pathlib import Path

import numpy as np
import pyogrio
from scipy.optimize import brentq
from shapely.geometry import box
from shapely.ops import unary_union

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v6-dados.json"
SHP_PADRAO = (
    Path(pyogrio.__file__).parent
    / "tests" / "fixtures" / "naturalearth_lowres" / "naturalearth_lowres.shp"
)

K0 = 0.994
A = 6378137.0
E2 = 0.00669438002290
E = np.sqrt(E2)
SIMPLIFICA = 0.2
ADENSA = 1.0


def m_esfera(phi, k0=K0):
    c = np.radians(90 - abs(phi))
    return 2 * k0 / (1 + np.cos(c))


def m_ups(phi, k0=K0):
    """Fator de escala da estereográfica polar no elipsoide (UPS)."""
    f = np.radians(abs(phi))
    t = np.tan(np.pi / 4 - f / 2) / ((1 - E * np.sin(f)) / (1 + E * np.sin(f))) ** (E / 2)
    rho = 2 * A * k0 * t / np.sqrt((1 + E) ** (1 + E) * (1 - E) ** (1 - E))
    mc = np.cos(f) / np.sqrt(1 - E2 * np.sin(f) ** 2)
    return rho / (A * mc)


def gms(phi):
    d = int(phi)
    m = (phi - d) * 60
    return f"{d}°{int(m):02d}′{(m - int(m)) * 60:05.2f}″"


def achatar(a):
    return [round(float(v), 2) for v in np.asarray(a).ravel()]


def main():
    shp = Path(sys.argv[1]) if len(sys.argv) > 1 else SHP_PADRAO
    terra = unary_union(pyogrio.read_dataframe(shp).geometry.values)
    terra = terra.simplify(SIMPLIFICA).segmentize(ADENSA)
    aneis = lambda g: [np.asarray(p.exterior.coords) for p in getattr(g, "geoms", [g]) if not p.is_empty]
    sul = terra.intersection(box(-180, -90, 180, -55))

    dados = {
        "fonte": "Natural Earth 1:110m",
        "k0": K0,
        "land": [achatar(a) for a in aneis(terra) if len(a) > 3],
        "ant": [achatar(a) for a in aneis(sul) if len(a) > 3],
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB")

    p_esf = 90 - np.degrees(np.arccos(2 * K0 - 1))
    p_ups = brentq(lambda p: m_ups(p) - 1, 75, 89.9)
    print(f"m = 1 na esfera: {gms(p_esf)} S; no GRS80 (UPS): {gms(p_ups)} S")
    print(f"Esfera: polo m = {m_esfera(90):.4f}; 80° S m = {m_esfera(80):.4f}")
    print(f"GRS80:  polo m = {m_ups(89.9999):.4f}; 80° S m = {m_ups(80):.4f}")
    print(f"Elevação do plano secante: z = −R (2 k0 − 1) = {-(2 * K0 - 1):.3f} R")


if __name__ == "__main__":
    main()
