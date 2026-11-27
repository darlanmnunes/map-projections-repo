"""
V3. Uma família, três superfícies: cilindro, cone e plano.

Gera o módulo de dados da animação (motion/v3-dados.json) e confere os números
da família cônica conforme normal na esfera (R = 1), polo sul como vértice:

    s = −φ (latitude contada para o sul), ψs = ln tan(45° + s/2)
    ρ = C e^(−n ψs),  γ = n (λ − λ0),  n = sen s0 (cone tangente em s0)
    C = (cos s0 / n) e^(n ψs0) = (1 + sen s0) tan(45° + s0/2)^(n − 1) / n
    m = n ρ / cos φ

- 'land': linha de costa Natural Earth 1:110m inteira, para o globo.
- 'south': terra do hemisfério sul até 80° S, com Δλ = λ − λ0 em [−180°, 180°],
  para os mapas (o corte fica no meridiano oposto a λ0).

Uso:
    python gerar_dados.py [caminho/para/naturalearth_lowres.shp]
"""

import json
import sys
from pathlib import Path

import numpy as np
import pyogrio
from shapely.geometry import box
from shapely.ops import unary_union

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v3-dados.json"
SHP_PADRAO = (
    Path(pyogrio.__file__).parent
    / "tests" / "fixtures" / "naturalearth_lowres" / "naturalearth_lowres.shp"
)

LAMBDA0 = -45.0               # meridiano central
S_MAX = 80.0                  # limite sul dos mapas
SIMPLIFICA = 0.2
ADENSA = 1.5


def aneis(geom):
    polys = getattr(geom, "geoms", [geom])
    return [np.asarray(p.exterior.coords) for p in polys if not p.is_empty and p.area > 0]


def achatar(a):
    return [round(float(v), 1) for v in a.ravel()]


def psi_s(s):
    return np.log(np.tan(np.pi / 4 + s / 2))


def constante(n):
    s0 = np.arcsin(n)
    return (1 + np.sin(s0)) * np.tan(np.pi / 4 + s0 / 2) ** (n - 1) / n


def conferir_numeros():
    n = np.sin(np.radians(30))
    print(f"Lambert tangente em −30°: n = sen 30° = {n:.3f}; abertura do setor = {360 * n:.0f}°")
    for nome, nn in (("Lambert", n), ("estereográfica", 1.0)):
        c = constante(nn)
        print(f"{nome}: C = {c:.4f}")
        for s in (10, 30, 50, 70):
            rho = c * np.exp(-nn * psi_s(np.radians(s)))
            m = nn * rho / np.cos(np.radians(s))
            print(f"   φ = −{s}°: ρ = {rho:.4f}, m = {m:.4f}")
    for s in (10, 30, 50, 70):
        print(f"Mercator φ = −{s}°: m = sec φ = {1 / np.cos(np.radians(s)):.4f}")
    nn = 1e-4
    print(f"n = {nn}: n·C = {nn * constante(nn):.5f} (→ 1, C = a/n)")


def main():
    shp = Path(sys.argv[1]) if len(sys.argv) > 1 else SHP_PADRAO
    terra = unary_union(pyogrio.read_dataframe(shp).geometry.values)
    terra = terra.simplify(SIMPLIFICA).segmentize(ADENSA)

    # Hemisfério sul em Δλ contínuo: corte no antimeridiano de λ0 (λ = 135°)
    corte = LAMBDA0 + 180
    sul = []
    for lon0, lon1, desloca in ((-180, corte, 0), (corte, 180, -360)):
        parte = terra.intersection(box(lon0, -S_MAX, lon1, 0))
        for a in aneis(parte):
            if len(a) > 3:
                b = a.copy()
                b[:, 0] = b[:, 0] - LAMBDA0 + desloca
                sul.append(achatar(b))

    dados = {
        "fonte": "Natural Earth 1:110m",
        "lambda0": LAMBDA0,
        "land": [achatar(a) for a in aneis(terra) if len(a) > 3],
        "south": sul,
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB, {len(sul)} anéis no sul")
    conferir_numeros()


if __name__ == "__main__":
    main()
