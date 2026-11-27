"""
V5. UTM, RTM e LTM: a mesma TM com outros parâmetros.

Gera o módulo de dados da animação (motion/v5-dados.json) e confere os números
dos slides 24 a 27 no GRS80, com pyproj.

- 'curvas': distorção linear (m − 1) × 10⁶, em ppm (mm/km), contra a distância ao MC
  (km de grade, E − E₀) ao longo do paralelo de Viçosa, para o UTM (fuso 23, MC −45°),
  o RTM (MC −43°) e o LTM (MC −42°30′), de borda a borda de cada fuso.
- 'mg' e 'vizinhos': contornos de Minas Gerais e das UFs vizinhas (Natural Earth 1:50m),
  em (λ, φ) graus, recortados ao quadro do mapa.

Uso:
    python gerar_dados.py [pasta_com_geojson_natural_earth]

Sem a pasta, o GeoJSON ne_50m_admin_1_states_provinces é baixado do repositório
oficial do Natural Earth no GitHub.
"""

import json
import sys
from pathlib import Path

import numpy as np
import pyogrio
from pyproj import Proj
from shapely.geometry import box

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v5-dados.json"
BASE_NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/"
UFS = "ne_50m_admin_1_states_provinces"

VICOSA = (-(42 + 52 / 60), -(20 + 45 / 60))
QUADRO = (-53.0, -24.0, -38.0, -13.5)          # λ mín, φ mín, λ máx, φ máx do mapa
# O contorno 1:50m de MG para em −50,998°; a divisa oeste fica em ≈ 51°03′ W (notebook da aula 09)
OESTE_MG = -(51 + 3 / 60)
SIMPLIFICA = 0.02

# Os cinco parâmetros da eq. (1): amplitude do fuso, MC (de Viçosa), k0, E0, N0 (Sul)
SISTEMAS = {
    "UTM": dict(amp=6, mc=-45.0, k0=0.9996, e0=500_000, n0=10_000_000),
    "RTM": dict(amp=2, mc=-43.0, k0=0.999995, e0=400_000, n0=5_000_000),
    "LTM": dict(amp=1, mc=-42.5, k0=0.999995, e0=200_000, n0=5_000_000),
}


def proj(s):
    return Proj(proj="tmerc", lon_0=s["mc"], k=s["k0"], x_0=s["e0"], y_0=s["n0"], ellps="GRS80")


def achatar(a):
    return [round(float(v), 3) for v in np.asarray(a).ravel()]


def aneis(geom):
    partes = getattr(geom, "geoms", [geom])
    return [np.asarray(p.exterior.coords) for p in partes if not p.is_empty and p.geom_type == "Polygon"]


def fusos_em(l0, l1, amp, borda0):
    """Quantos fusos de amplitude amp (limites em borda0 + k·amp) a faixa de longitude [l0, l1] corta."""
    return int(np.ceil((l1 - borda0) / amp) - np.floor((l0 - borda0) / amp))


def main():
    pasta = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    fonte = pasta / f"{UFS}.geojson" if pasta else BASE_NE + UFS + ".geojson"
    ufs = pyogrio.read_dataframe(fonte, columns=["admin", "postal"])
    ufs = ufs[ufs["admin"] == "Brazil"]
    mg = ufs[ufs["postal"] == "MG"].geometry.values[0]
    quadro = box(*QUADRO)
    vizinhos = [g.intersection(quadro) for p, g in zip(ufs["postal"], ufs.geometry) if p != "MG"]

    phi = VICOSA[1]
    curvas = {}
    for nome, s in SISTEMAS.items():
        p = proj(s)
        lams = np.linspace(s["mc"] - s["amp"] / 2, s["mc"] + s["amp"] / 2, 121)
        pts = []
        for lam in lams:
            e, _ = p(lam, phi)
            m = p.get_factors(lam, phi).parallel_scale
            pts.append([round((e - s["e0"]) / 1000, 3), round((m - 1) * 1e6, 3)])
        curvas[nome] = pts

    mg_s = mg.simplify(SIMPLIFICA)
    dados = {
        "fonte": "Natural Earth 1:50m; GRS80",
        "quadro": QUADRO,
        "curvas": curvas,
        "mg": [achatar(a) for a in aneis(mg_s)],
        "vizinhos": [achatar(a) for g in vizinhos if not g.is_empty for a in aneis(g.simplify(SIMPLIFICA))],
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB\n")

    print("Viçosa (φ = −20°45′, λ = −42°52′), GRS80:")
    for nome, s in SISTEMAS.items():
        p = proj(s)
        e, n = p(*VICOSA)
        f = p.get_factors(*VICOSA)
        g = f.meridian_convergence       # mesmo sinal da aula (pyproj e Snyder)
        gs = abs(g) * 3600
        print(f"  {nome}: MC {s['mc']:+.1f}°  E = {e:,.2f} m  N = {n:,.2f} m  "
              f"m = {f.parallel_scale:.6f} ({(f.parallel_scale - 1) * 1e6:+.0f} mm/km)  "
              f"x = {(e - s['e0']) / 1000:+.1f} km  "
              f"γ = {'−' if g < 0 else '+'}{int(gs // 3600)}°{int(gs % 3600 // 60):02d}′{gs % 60:05.2f}″")
    print("\nBorda do fuso no Equador e escala no MC:")
    for nome, s in SISTEMAS.items():
        p = proj(s)
        mb = p.get_factors(s["mc"] + s["amp"] / 2, 0).parallel_scale
        print(f"  {nome}: m = {mb:.6f} (≈ 1/{1 / (mb - 1):,.0f});  MC: 1/{1 / (1 - s['k0']):,.0f}")
    print("\nAmplitude de cada curva (ppm) no paralelo de Viçosa:")
    for nome, c in curvas.items():
        ys = [v for _, v in c]
        print(f"  {nome}: de {min(ys):+.1f} a {max(ys):+.1f} ppm; x até ±{c[-1][0]:.1f} km")

    l0, l1 = OESTE_MG, mg.bounds[2]
    print(f"\nFusos sobre Minas Gerais (λ de {l0:.2f}° a {l1:.2f}°; no contorno 1:50m, λ mín = {mg.bounds[0]:.3f}°):")
    print(f"  UTM (6°, limites em 6F − 186°): {fusos_em(l0, l1, 6, -186)}")
    print(f"  RTM (2°, limites nas longitudes pares): {fusos_em(l0, l1, 2, -180)}")
    print(f"  LTM (1°, limites nas longitudes inteiras): {fusos_em(l0, l1, 1, -180)} "
          f"(só {fusos_em(*mg.bounds[::2], 1, -180)} com o contorno 1:50m)")
    utm = proj(SISTEMAS["UTM"])
    pts = np.asarray(mg.exterior.coords if mg.geom_type == "Polygon" else max(mg.geoms, key=lambda g: g.area).exterior.coords)
    phi_oeste = pts[np.argmin(pts[:, 0]), 1]
    m_oeste = utm.get_factors(-51, phi_oeste).parallel_scale
    print(f"  Fuso 23 esticado até a divisa oeste (Δλ = 6°, φ = {phi_oeste:.2f}°): "
          f"m = {m_oeste:.4f} ({(m_oeste - 1) * 1000:.1f} m por km)")


if __name__ == "__main__":
    main()
