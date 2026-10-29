"""
V3. Fator de escala no fuso UTM e linhas de secância.

Gera o módulo de dados da animação (motion/v3-dados.json) e confere os números
dos slides 15, 16 e 17 no GRS80 (UTM 23S, k0 = 0,9996), com pyproj.

Cada ponto do mapa do fuso 23 é guardado nas duas vistas da animação:
(λ, φ) em graus, para a vista geográfica, e (E, N) em km, para a vista da grade.

- 'malha': nós de 0,25° × 2° no fuso 23 (−48° a −42°, 6° N a 62° S), com E, N e
  a distorção m − 1 em ppm (mm/km).
- 'sec': linha de secância leste (m = 1); a oeste é o espelho em relação ao MC.
- 'iso': isolinhas de distorção (ppm), metade leste.
- 'borda': borda leste do fuso (λ = −42°); 'mc': meridiano central.
- 'land': costa Natural Earth 1:50m recortada no fuso.

Uso:
    python gerar_dados.py [pasta_com_os_geojson_natural_earth]
"""

import json
import sys
import tempfile
import urllib.request
from pathlib import Path

import numpy as np
import pyogrio
from pyproj import Proj
from scipy.optimize import brentq
from shapely.geometry import box
from shapely.ops import unary_union

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v3-dados.json"
BASE_NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/"

LAM0, K0 = -45.0, 0.9996
VICOSA = (-(42 + 52 / 60), -(20 + 45 / 60))
PHI_N, PHI_S = 6.0, -62.0
ISO = [-300, -200, 200, 400, 600, 800]
UTM = Proj(proj="utm", zone=23, south=True, ellps="GRS80")


def carregar(nome, pasta):
    local = Path(pasta) / f"{nome}.geojson" if pasta else None
    if local and local.exists():
        return pyogrio.read_dataframe(local)
    with tempfile.TemporaryDirectory() as tmp:
        destino = Path(tmp) / f"{nome}.geojson"
        urllib.request.urlretrieve(BASE_NE + nome + ".geojson", destino)
        return pyogrio.read_dataframe(destino)


def m(lam, phi):
    return UTM.get_factors(lam, phi).parallel_scale


def ponto(lam, phi):
    E, N = UTM(lam, phi)
    return [round(lam, 4), round(phi, 4), round(E / 1000, 3), round(N / 1000, 3)]


def dms(g):
    s = round(abs(g) * 3600)
    return f"{s // 3600}°{s % 3600 // 60:02d}′{s % 60:02d}″"


def lam_sec(phi, alvo=1.0):
    """Longitude leste onde m = alvo no paralelo phi (None se não houver no intervalo)."""
    f = lambda l: m(l, phi) - alvo
    if f(LAM0 + 1e-6) > 0 or f(-38.0) < 0:
        return None
    return brentq(f, LAM0 + 1e-6, -38.0, xtol=1e-10)


def main():
    pasta = sys.argv[1] if len(sys.argv) > 1 else None

    lams = np.arange(-48, -41.999, 0.25)
    phis = np.arange(PHI_N, PHI_S - 0.001, -2.0)
    malha = {"lam": [round(float(v), 2) for v in lams], "phi": [round(float(v), 1) for v in phis],
             "E": [], "N": [], "ppm": []}
    for p in phis:
        E, N = UTM(lams, np.full_like(lams, p))
        malha["E"].append([round(v / 1000, 2) for v in E])
        malha["N"].append([round(v / 1000, 2) for v in N])
        malha["ppm"].append([round((m(l, p) - 1) * 1e6, 1) for l in lams])

    fino = np.arange(PHI_N, PHI_S - 0.001, -0.5)
    sec = [ponto(lam_sec(p), p) for p in fino]
    iso = {}
    for v in ISO:
        linha = []
        for p in fino:
            l = lam_sec(p, 1 + v * 1e-6)
            if l is not None and l <= -42.0:
                linha.append(ponto(l, p))
        iso[str(v)] = linha
    borda = [ponto(-42.0, p) for p in fino]
    mc = [ponto(LAM0, p) for p in fino]

    paises = carregar("ne_50m_admin_0_countries", pasta)
    terra = unary_union(paises.geometry.values).intersection(box(-48, PHI_S, -42, PHI_N))
    terra = terra.simplify(0.03).segmentize(0.3)
    aneis = []
    for g in getattr(terra, "geoms", [terra]):
        if g.geom_type != "Polygon" or g.is_empty:
            continue
        a = []
        for lam, phi in g.exterior.coords:
            a += ponto(lam, phi)
        aneis.append(a)

    E_v, N_v = UTM(*VICOSA)
    dados = {
        "fonte": "GRS80, UTM 23S (pyproj); Natural Earth 1:50m",
        "malha": malha, "sec": sec, "iso": iso, "borda": borda, "mc": mc, "land": aneis,
        "vicosa": ponto(*VICOSA) + [round(m(*VICOSA), 6)],
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB\n")

    # Conferência dos slides
    print(f"MC: m = {m(LAM0, 0):.4f} ({(m(LAM0, 0) - 1) * 1e5:+.0f} cm/km, 1/{1 / (1 - K0):.0f})")
    mb = m(-42, 0)
    print(f"Borda do fuso no Equador: m = {mb:.5f} ({(mb - 1) * 1e5:+.0f} cm/km, 1/{1 / (mb - 1):.0f})")
    print(f"Borda do fuso em 80° S: m = {m(-42, -80):.5f}")
    print("\nLinhas de secância (slide 16):  φ | Δλ esfera | Δλ GRS80 | E − 500 000")
    for nome, p in [("0°", 0), ("−10°", -10), ("−20°45′", VICOSA[1]), ("−30°", -30),
                    ("−33°45′", -33.75), ("−57°18′", -(57 + 18 / 60))]:
        esf = np.degrees(np.arcsin(np.sqrt(1 - K0 ** 2) / np.cos(np.radians(p))))
        l = lam_sec(p)
        print(f"  {nome:>8} | {dms(esf)} | {dms(l - LAM0)} | {(UTM(l, p)[0] - 500000) / 1000:.2f} km")
    p57 = brentq(lambda p: lam_sec(p) - (-42.0), -50, -62)
    print(f"Secância encosta na borda (Δλ = 3°) em φ = {p57:.2f}° ({dms(p57)} S)")
    print(f"Na esfera: x_s = R √(2(1 − k0)) = {6378.137 * np.sqrt(2 * (1 - K0)):.1f} km")
    print(f"\nViçosa: E = {E_v:.2f} m; N = {N_v:.2f} m; E − 500 000 = {(E_v - 500000) / 1000:.1f} km; "
          f"m = {m(*VICOSA):.6f}; 1 000,000 m → {1000 * m(*VICOSA):.3f} m")
    l_v = lam_sec(VICOSA[1])
    print(f"Faixa com m < 1 no paralelo de Viçosa: {2 * (UTM(l_v, VICOSA[1])[0] - 500000) / 1000:.0f} km "
          f"(E de {(1000000 - UTM(l_v, VICOSA[1])[0]) / 1000:.0f} a {UTM(l_v, VICOSA[1])[0] / 1000:.0f} km)")
    print(f"Borda no paralelo de Viçosa: m = {m(-42, VICOSA[1]):.6f} ({(m(-42, VICOSA[1]) - 1) * 1e6:+.0f} ppm)")


if __name__ == "__main__":
    main()
