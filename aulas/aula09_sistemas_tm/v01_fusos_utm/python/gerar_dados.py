"""
V1. 60 fusos: do globo ao fuso de Viçosa.

Gera o módulo de dados da animação (motion/v1-dados.json) e confere os números
dos slides 7, 8, 9, 12 e 13 com pyproj.

- 'land': massas de terra (Natural Earth 1:50m, simplificadas) para o globo e o mapa-múndi.
- 'brasil': contorno do Brasil continental; 'mg': contorno de Minas Gerais.

Uso:
    python gerar_dados.py [pasta_com_os_geojson_do_natural_earth]

Sem a pasta, os GeoJSON são lidos do repositório oficial do Natural Earth no GitHub.
"""

import json
import math
import sys
from pathlib import Path

import numpy as np
import pyogrio
from pyproj import CRS
from shapely.ops import unary_union

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v1-dados.json"
BASE_NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/"

VICOSA = (-(42 + 52 / 60), -(20 + 45 / 60))
CIDADES = {"Viçosa": VICOSA[0], "Belo Horizonte": -(43 + 56 / 60), "Uberlândia": -(48 + 17 / 60)}


def ler(nome, pasta):
    fonte = (Path(pasta) / f"{nome}.geojson") if pasta else BASE_NE + nome + ".geojson"
    return pyogrio.read_dataframe(fonte)


def aneis(geom, tol, minimo=0.0):
    geom = geom.simplify(tol)
    out = []
    for p in getattr(geom, "geoms", [geom]):
        if p.is_empty or p.area < minimo:
            continue
        a = np.asarray(p.exterior.coords)
        if len(a) > 3:
            out.append([round(float(v), 2) for v in a.ravel()])
    return out


def fuso(lam):
    return math.floor((lam + 180) / 6) + 1


def main():
    pasta = sys.argv[1] if len(sys.argv) > 1 else None
    paises = ler("ne_50m_admin_0_countries", pasta)
    ufs = ler("ne_50m_admin_1_states_provinces", pasta)
    brasil = paises[paises["ADMIN"] == "Brazil"].geometry.values[0]
    continente = max(brasil.geoms, key=lambda p: p.area)
    mg = ufs[(ufs["admin"] == "Brazil") & (ufs["postal"] == "MG")].geometry.values[0]

    dados = {
        "fonte": "Natural Earth 1:50m",
        "land": aneis(unary_union(paises.geometry.values), 0.35, 0.5),
        "brasil": aneis(continente, 0.06),
        "mg": aneis(mg, 0.04),
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB")

    # Fusos do Brasil continental (extremos de longitude do contorno)
    x0, _, x1, _ = continente.bounds
    print(f"Brasil continental: λ de {x0:.2f}° a {x1:.2f}° → fusos {fuso(x0)} a {fuso(x1)}")
    x0, _, x1, _ = mg.bounds
    print(f"Minas Gerais: λ de {x0:.2f}° a {x1:.2f}° → fusos {fuso(x0)} a {fuso(x1)}")
    print("Fuso 1: de", 6 * 1 - 186, "a", 6 * 1 - 180, "| fuso 60: de", 6 * 60 - 186, "a", 6 * 60 - 180)

    lam, phi = VICOSA
    q = (lam + 180) / 6
    F = fuso(lam)
    mc = 6 * F - 183
    dl = (lam - mc) * 60
    banda = "CDEFGHJKLMNPQRSTUVWX"[math.floor((phi + 80) / 8)]
    epsg = 31960 + F
    print(f"Viçosa: λ = {lam:.4f}°; λ + 180° = {lam + 180:.2f}°; (λ + 180°)/6 = {q:.2f} → F = {F}")
    print(f"MC = 6·{F} − 183 = {mc}°; Δλ = +{int(dl // 60)}°{round(dl % 60):02d}′; banda {banda}")
    print(f"EPSG:{epsg} = {CRS.from_epsg(epsg).name}")
    for nome, l in CIDADES.items():
        print(f"  {nome}: λ = {l:.4f}° → fuso {fuso(l)}")


if __name__ == "__main__":
    main()
