"""
V5. Loxodromia × ortodromia: São Paulo → Joanesburgo.

Gera o módulo de dados da animação (motion/v5-dados.json) e confere os números
do roteiro no elipsoide GRS80 (slide 18).

- Geodésica: pyproj.Geod (Karney), pontos igualmente espaçados.
- Loxodromia: rumo constante α = atan2(Δλ, Δψ), com ψ a latitude isométrica do
  elipsoide; distância = (arco de meridiano entre as latitudes) / cos α.
- Azimutes da geodésica nos meridianos onde a cena 1 mostra os arcos.
- Centro da gnomônica: ponto médio da geodésica.

Uso:
    python gerar_dados.py [caminho/para/naturalearth_lowres.shp]
"""

import json
import sys
from pathlib import Path

import numpy as np
import pyogrio
from pyproj import Geod
from scipy.integrate import quad
from shapely.geometry import box
from shapely.ops import unary_union

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v5-dados.json"
SHP_PADRAO = (
    Path(pyogrio.__file__).parent
    / "tests" / "fixtures" / "naturalearth_lowres" / "naturalearth_lowres.shp"
)

A = 6378137.0
E2 = 0.00669438002290
E = np.sqrt(E2)
SP = (-46.63, -23.55)          # São Paulo (λ, φ)
JO = (28.05, -26.20)           # Joanesburgo (λ, φ)
MERIDIANOS = (-30.0, -10.0, 10.0)
JANELA = (-65.0, -45.0, 45.0, 8.0)   # λ mín, φ mín, λ máx, φ máx dos mapas
SIMPLIFICA = 0.2
ADENSA = 1.5
G = Geod(ellps="GRS80")


def psi(phi):
    f = np.radians(phi)
    es = E * np.sin(f)
    return np.log(np.tan(np.pi / 4 + f / 2) * ((1 - es) / (1 + es)) ** (E / 2))


def arco_meridiano(phi):
    m = lambda f: A * (1 - E2) / (1 - E2 * np.sin(f) ** 2) ** 1.5
    return quad(m, 0, np.radians(phi))[0]


def phi_de_psi(p):
    f = p
    for _ in range(30):
        f = 2 * np.arctan(np.exp(p) * ((1 + E * np.sin(f)) / (1 - E * np.sin(f))) ** (E / 2)) - np.pi / 2
    return f


def achatar(a, k=2):
    return [round(float(v), k) for v in np.asarray(a).ravel()]


def gnomonica(lam, phi, lc, pc):
    l, p, l0, p0 = map(np.radians, (lam, phi, lc, pc))
    c = np.sin(p0) * np.sin(p) + np.cos(p0) * np.cos(p) * np.cos(l - l0)
    x = np.cos(p) * np.sin(l - l0) / c
    y = (np.cos(p0) * np.sin(p) - np.sin(p0) * np.cos(p) * np.cos(l - l0)) / c
    return x, y


def main():
    shp = Path(sys.argv[1]) if len(sys.argv) > 1 else SHP_PADRAO
    terra = unary_union(pyogrio.read_dataframe(shp).geometry.values)
    terra = terra.simplify(SIMPLIFICA).segmentize(ADENSA)
    aneis = lambda g: [np.asarray(p.exterior.coords) for p in getattr(g, "geoms", [g]) if not p.is_empty]
    janela = terra.intersection(box(*JANELA))

    # Geodésica
    az1, az2, dist = G.inv(*SP, *JO)
    geo = [SP] + G.npts(*SP, *JO, 239) + [JO]
    latmin = min(p[1] for p in geo)
    lm, pm, _ = G.fwd(*SP, az1, dist / 2)
    az_mer = []
    for lam in MERIDIANOS:
        # ponto da geodésica no meridiano lam (bisseção no parâmetro de distância)
        a, b = 0.0, dist
        for _ in range(60):
            c = (a + b) / 2
            if G.fwd(*SP, az1, c)[0] < lam:
                a = c
            else:
                b = c
        x, y, _ = G.fwd(*SP, az1, a)
        az = G.inv(x, y, *JO)[0] % 360
        az_mer.append((lam, y, az))

    # Loxodromia
    dl = np.radians(JO[0] - SP[0])
    dpsi = psi(JO[1]) - psi(SP[1])
    alfa = np.degrees(np.arctan2(dl, dpsi)) % 360
    dlox = (arco_meridiano(JO[1]) - arco_meridiano(SP[1])) / np.cos(np.radians(alfa))
    ps = np.linspace(psi(SP[1]), psi(JO[1]), 240)
    lox = [(SP[0] + (JO[0] - SP[0]) * i / 239, np.degrees(phi_de_psi(p))) for i, p in enumerate(ps)]
    lox_mer = [(lam, float(np.interp(lam, [q[0] for q in lox], [q[1] for q in lox]))) for lam in MERIDIANOS]

    # Desvio da geodésica (elipsoide) em relação à reta na gnomônica esférica
    gx, gy = gnomonica(np.array([p[0] for p in geo]), np.array([p[1] for p in geo]), lm, pm)
    x0, y0, x1, y1 = gx[0], gy[0], gx[-1], gy[-1]
    desvio = np.max(np.abs((x1 - x0) * (gy - y0) - (y1 - y0) * (gx - x0)) / np.hypot(x1 - x0, y1 - y0))
    comprimento = np.hypot(x1 - x0, y1 - y0)

    dados = {
        "fonte": "Natural Earth 1:110m; GRS80",
        "sp": SP, "jo": JO,
        "geo": achatar(geo, 4),
        "lox": achatar(lox, 4),
        "centro": [round(lm, 4), round(pm, 4)],
        "azMer": [[l, round(y, 4), round(a, 2)] for l, y, a in az_mer],
        "loxMer": [[l, round(y, 4)] for l, y in lox_mer],
        "rumo": round(float(alfa), 4),
        "az1": round(az1 % 360, 4), "az2": round((az2 + 180) % 360, 4),
        "janela": JANELA,
        "land": [achatar(a) for a in aneis(terra) if len(a) > 3],
        "box": [achatar(a) for a in aneis(janela) if len(a) > 3],
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB")
    print(f"Geodésica: sai com {az1 % 360:.2f}°, chega com {(az2 + 180) % 360:.2f}°, "
          f"{dist / 1000:.0f} km, latitude mínima {latmin:.1f}°")
    for lam, y, a in az_mer:
        print(f"   no meridiano {lam:.0f}°: φ = {y:.2f}°, azimute {a:.2f}°")
    print(f"Loxodromia: rumo {alfa:.2f}°, {dlox / 1000:.0f} km")
    print(f"Diferença: {(dlox - dist) / 1000:.0f} km ({100 * (dlox - dist) / dist:.1f} %)")
    print(f"Centro da gnomônica (meio da geodésica): λ = {lm:.3f}°, φ = {pm:.3f}°")
    print(f"Desvio da geodésica em relação à reta na gnomônica: {100 * desvio / comprimento:.3f} % do comprimento")


if __name__ == "__main__":
    main()
