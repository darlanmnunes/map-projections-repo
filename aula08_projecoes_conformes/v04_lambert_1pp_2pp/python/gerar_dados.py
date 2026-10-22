"""
V4. Lambert com 1 e 2 paralelos padrão: do cone tangente ao secante.

Gera o módulo de dados da animação (motion/v4-dados.json) e confere os números
do slide 13: Lambert conforme cônica, parâmetros ESRI:102015 no GRS80
(φ1 = −5°, φ2 = −42°, φ0 = −32°, λ0 = −60°), ponto de Viçosa.

Fórmulas (Snyder, 1987, eq. 15-1 a 15-11), escritas para o hemisfério sul pela
simetria φ → −φ (n < 0):
    mc(φ) = cos φ / (1 − e² sen²φ)^½
    t(φ)  = tan(45° − φ/2) / ((1 − e sen φ)/(1 + e sen φ))^(e/2)
    n = (ln mc1 − ln mc2) / (ln t1 − ln t2),  F = mc1 / (n t1^n),  ρ = a F t^n
    m(φ) = mc1 t^n / (mc(φ) t1^n),  γ = n (λ − λ0)

- 'm2': m(φ) da Lambert com 2 PP, φ de +10° a −55° a cada 0,25°.
- 'land': costa Natural Earth 1:110m inteira (globo); 'sa': recorte da América do Sul.

Uso:
    python gerar_dados.py [caminho/para/naturalearth_lowres.shp]
"""

import json
import sys
from pathlib import Path

import numpy as np
import pyogrio
from scipy.optimize import minimize_scalar
from shapely.geometry import box
from shapely.ops import unary_union

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v4-dados.json"
SHP_PADRAO = (
    Path(pyogrio.__file__).parent
    / "tests" / "fixtures" / "naturalearth_lowres" / "naturalearth_lowres.shp"
)

A = 6378137.0
E2 = 0.00669438002290
E = np.sqrt(E2)
PHI1, PHI2, PHI0, LAM0 = -5.0, -42.0, -32.0, -60.0
VICOSA = (-(42 + 52 / 60), -(20 + 45 / 60))   # (λ, φ)
SIMPLIFICA = 0.2
ADENSA = 1.5


def mc(f):
    return np.cos(f) / np.sqrt(1 - E2 * np.sin(f) ** 2)


def t(f):
    # versão sul: usa −φ (simetria), o que dá n < 0 com ρ positivo
    g = -f
    return np.tan(np.pi / 4 - g / 2) / ((1 - E * np.sin(g)) / (1 + E * np.sin(g))) ** (E / 2)


def constantes():
    f1, f2 = np.radians(PHI1), np.radians(PHI2)
    n = (np.log(mc(f1)) - np.log(mc(f2))) / (np.log(t(f1)) - np.log(t(f2)))
    return n, f1


def escala(phi_graus, n, f1):
    f = np.radians(phi_graus)
    return mc(f1) * t(f) ** n / (mc(f) * t(f1) ** n)


def achatar(a):
    return [round(float(v), 2) for v in a.ravel()]


def main():
    shp = Path(sys.argv[1]) if len(sys.argv) > 1 else SHP_PADRAO
    terra = unary_union(pyogrio.read_dataframe(shp).geometry.values)
    terra = terra.simplify(SIMPLIFICA).segmentize(ADENSA)
    aneis = lambda g: [np.asarray(p.exterior.coords) for p in getattr(g, "geoms", [g]) if not p.is_empty]
    sa = terra.intersection(box(-100, -60, -20, 15))

    # n positivo nas fórmulas do sul espelhado; o sinal do slide é o do hemisfério sul
    n_abs, f1 = constantes()
    n = -abs(n_abs)
    m = lambda p: escala(p, n_abs, f1)
    fis = np.arange(10, -55.0001, -0.25)
    res = minimize_scalar(m, bounds=(-40, -10), method="bounded")
    k = float(m(res.x))
    mv = float(m(VICOSA[1]))
    gamma = n * (VICOSA[0] - LAM0)

    dados = {
        "fonte": "Natural Earth 1:110m; GRS80; ESRI:102015",
        "n": n,
        "phiMin": float(res.x),
        "k": k,
        "m2": [round(float(m(p)), 6) for p in fis],
        "passo": -0.25,
        "land": [achatar(a) for a in aneis(terra) if len(a) > 3],
        "sa": [achatar(a) for a in aneis(sa) if len(a) > 3],
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB")
    print(f"n = {n:.6f}")
    print(f"m(−5°) = {m(PHI1):.6f}, m(−42°) = {m(PHI2):.6f}")
    print(f"mínimo de m em φ = {res.x:.3f}° (1 PP equivalente), m = {k:.5f}")
    print(f"Viçosa: m = {mv:.5f}, σ = m² = {mv ** 2:.5f}, "
          f"distâncias {100 * (mv - 1):.1f} %, áreas {100 * (mv ** 2 - 1):.1f} %")
    print(f"γ = n(λ − λ0) = {gamma:.3f}°")
    print(f"PP afastados {PHI1 - PHI2:.0f}°")


if __name__ == "__main__":
    main()
