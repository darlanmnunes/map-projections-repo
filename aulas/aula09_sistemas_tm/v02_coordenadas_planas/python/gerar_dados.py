"""
V2. Coordenadas planas do fuso: origem, falso leste e falso norte.

Gera o módulo de dados da animação (motion/v2-dados.json) e confere, no GRS80 e com
pyproj, os números que aparecem na tela (slides 10 e 11).

- 'fuso': o fuso 23 (−48° a −42°, de 80° S a 84° N) nas coordenadas da TM com k0 = 1,
  x e y em km, origem no cruzamento do Equador com o MC (−45°): bordas, meridianos de
  1° em 1° e paralelos de 8° em 8°.
- 'brasil', 'ufs', 'vizinhos': contornos Natural Earth 1:50m em graus (mapa da cena 3).
- 'pontos': onde o mesmo par (E, N) de Viçosa cai em cada fuso de 18 a 25 (Hemisfério Sul).

Uso:
    python gerar_dados.py [pasta_com_os_geojson_natural_earth]

Sem a pasta, os GeoJSON 1:50m são lidos do repositório oficial do Natural Earth no GitHub.
"""

import json
import sys
from pathlib import Path

import numpy as np
import pyogrio
from pyproj import Proj
from shapely.geometry import box

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v2-dados.json"
BASE_NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/"

LAM0, K0 = -45.0, 0.9996
VICOSA = (-(42 + 52 / 60), -(20 + 45 / 60))
JANELA = box(-80, -36, -28, 8)          # recorte do mapa da cena 3 (λ, φ)
SIMPLIFICA = 0.05


def carregar(pasta, nome):
    fonte = (Path(pasta) / f"{nome}.geojson") if pasta else BASE_NE + nome + ".geojson"
    return pyogrio.read_dataframe(fonte)


def aneis(geom):
    """Anéis exteriores de um (Multi)Polygon, achatados em [λ1, φ1, λ2, φ2, ...]."""
    out = []
    for p in getattr(geom, "geoms", [geom]):
        if p.is_empty or p.geom_type != "Polygon":
            continue
        c = np.asarray(p.exterior.coords)
        if len(c) > 3:
            out.append([round(float(v), 2) for v in c.ravel()])
    return out


def linhas(geom):
    """Contornos (anéis) como polilinhas, para os limites das UFs."""
    out = []
    for p in getattr(geom, "geoms", [geom]):
        if p.geom_type == "Polygon":
            c = np.asarray(p.exterior.coords)
            out.append([round(float(v), 2) for v in c.ravel()])
    return out


def main():
    pasta = sys.argv[1] if len(sys.argv) > 1 else None
    paises = carregar(pasta, "ne_50m_admin_0_countries")
    ufs = carregar(pasta, "ne_50m_admin_1_states_provinces")
    brasil = paises[paises["ADMIN"] == "Brazil"].geometry.union_all()
    viz = paises[(paises["CONTINENT"] == "South America") & (paises["ADMIN"] != "Brazil")]
    viz = viz.geometry.union_all().intersection(JANELA).simplify(SIMPLIFICA)
    ufs = ufs[ufs["admin"] == "Brazil"].geometry.simplify(SIMPLIFICA)

    tm = Proj(proj="tmerc", lon_0=LAM0, k=1, ellps="GRS80")

    def km(lams, phis):
        x, y = tm(np.asarray(lams, float), np.asarray(phis, float))
        return [[round(float(a) / 1000, 2), round(float(b) / 1000, 2)] for a, b in zip(x, y)]

    phis = np.arange(-80, 84.01, 0.5)
    fuso = {
        "bordas": [km(np.full_like(phis, l), phis) for l in (-48, -42)],
        "meridianos": [km(np.full_like(phis, l), phis) for l in (-47, -46, -44, -43)],
        "mc": km(np.full_like(phis, LAM0), phis),
        "paralelos": [[p, km(np.linspace(-48, -42, 25), np.full(25, p))] for p in
                      list(range(-80, 81, 8)) + [84]],
    }

    pontos = []
    for f in range(18, 26):
        u = Proj(proj="utm", zone=f, south=True, ellps="GRS80")
        E, N = Proj(proj="utm", zone=23, south=True, ellps="GRS80")(*VICOSA)
        lam, phi = u(E, N, inverse=True)
        pontos.append({"fuso": f, "mc": 6 * f - 183, "lam": round(lam, 4), "phi": round(phi, 4)})

    dados = {
        "fonte": "Natural Earth 1:50m; GRS80",
        "fuso": fuso,
        "brasil": aneis(brasil.simplify(SIMPLIFICA)),
        "vizinhos": aneis(viz),
        "ufs": [l for g in ufs for l in linhas(g)],
        "pontos": pontos,
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB")

    # Conferência dos números da tela
    utm = Proj(proj="utm", zone=23, south=True, ellps="GRS80")
    utmn = Proj(proj="utm", zone=23, ellps="GRS80")
    E, N = utm(*VICOSA)
    x, y = tm(*VICOSA)
    print(f"Viçosa em UTM 23S: E = {E:.2f} m; N = {N:.2f} m")
    print(f"Viçosa na TM (k0 = 1): x = {x / 1000:.1f} km; y = {y / 1000:.1f} km")
    print(f"  confere eq. (2): 500 000 + 0,9996x = {500000 + K0 * x:.2f}; 10 000 000 + 0,9996y = {1e7 + K0 * y:.2f}")
    e1, _ = utm(-48, 0)
    e2, _ = utm(-42, 0)
    print(f"Fuso no Equador: E de {e1 / 1000:.1f} km a {e2 / 1000:.1f} km")
    print(f"Fuso no Equador (TM, k0 = 1): x = ±{tm(-42, 0)[0] / 1000:.1f} km")
    print(f"N em 80° S (no MC): {utm(LAM0, -80)[1] / 1000:.1f} km")
    print(f"N em 84° N (no MC): {utmn(LAM0, 84)[1] / 1000:.1f} km")
    print(f"y em 80° S: {tm(LAM0, -80)[1] / 1000:.1f} km; y em 84° N: {tm(LAM0, 84)[1] / 1000:.1f} km")
    dl = VICOSA[0] - LAM0
    print(f"Δλ de Viçosa: {dl:.4f}° = {int(dl)}°{(dl - int(dl)) * 60:04.1f}′")
    for p in pontos:
        print(f"  fuso {p['fuso']}S (MC {p['mc']}°): λ = {p['lam']:.4f}°, φ = {p['phi']:.4f}°,"
              f" Δλ = {p['lam'] - p['mc']:+.4f}°")


if __name__ == "__main__":
    main()
