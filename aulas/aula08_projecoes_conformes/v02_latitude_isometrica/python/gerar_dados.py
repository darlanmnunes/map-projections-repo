"""
V2. Latitude isométrica: do retângulo ao quadrado.

Gera o módulo de dados da animação (motion/v2-dados.json) e confere os números
que aparecem na tela. Elipsoide GRS80, como no slide 5.

- 'land': linha de costa Natural Earth 1:110m, para o globo.
- 'psi': |ψ| em graus para |φ| de 0° a 85°, a cada 0,25°, para o gráfico da cena 4.

Uso:
    python gerar_dados.py [caminho/para/naturalearth_lowres.shp]
"""

import json
import sys
from pathlib import Path

import numpy as np
import pyogrio
from shapely.ops import unary_union

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v2-dados.json"
SHP_PADRAO = (
    Path(pyogrio.__file__).parent
    / "tests" / "fixtures" / "naturalearth_lowres" / "naturalearth_lowres.shp"
)

A = 6378137.0                 # GRS80: semieixo maior (m)
E2 = 0.00669438002290         # GRS80: primeira excentricidade ao quadrado
SIMPLIFICA = 0.2
ADENSA = 1.5
VICOSA = -(20 + 45 / 60)      # φ = −20°45′


def raios(phi):
    """M (meridiana) e N (primeiro vertical) em metros."""
    w = 1 - E2 * np.sin(phi) ** 2
    return A * (1 - E2) / w ** 1.5, A / np.sqrt(w)


def psi(phi):
    """Latitude isométrica no elipsoide (rad)."""
    e = np.sqrt(E2)
    es = e * np.sin(phi)
    return np.log(np.tan(np.pi / 4 + phi / 2) * ((1 - es) / (1 + es)) ** (e / 2))


def achatar(anel):
    a = anel.copy()
    a[:, 1] = np.clip(a[:, 1], -85.0, 90.0)
    return [round(float(v), 1) for v in a.ravel()]


def conferir_numeros():
    print("φ      N cos φ / M   cos φ")
    for p in (0, -30, -60):
        f = np.radians(p)
        m, n = raios(f)
        print(f"{p:4d}   {n * np.cos(f) / m:10.4f}   {np.cos(f):.4f}")
    v = np.degrees(psi(np.radians(VICOSA)))
    print(f"Viçosa φ = −20°45′: ψ = {v:.4f}° ({np.radians(v):.6f} rad)")
    print(f"φ = 85°: ψ = {np.degrees(psi(np.radians(85))):.2f}°")


def main():
    shp = Path(sys.argv[1]) if len(sys.argv) > 1 else SHP_PADRAO
    terra = unary_union(pyogrio.read_dataframe(shp).geometry.values)
    terra = terra.simplify(SIMPLIFICA).segmentize(ADENSA)
    aneis = [np.asarray(p.exterior.coords) for p in getattr(terra, "geoms", [terra])]

    fis = np.arange(0, 85.0001, 0.25)
    dados = {
        "fonte": "Natural Earth 1:110m; GRS80",
        "land": [achatar(a) for a in aneis if len(a) > 3],
        "psi": [round(float(np.degrees(psi(np.radians(f)))), 4) for f in fis],
        "passo": 0.25,
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB")
    conferir_numeros()


if __name__ == "__main__":
    main()
