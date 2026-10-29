"""
V4. Convergência meridiana: norte de quadrícula × norte geográfico.

Gera o módulo de dados da animação (motion/v4-dados.json) e confere os números
dos slides 19, 20 e 30 (exercício 5) no GRS80, com pyproj.

- 'esq': esquema exagerado (cenas 1 e 2). TM no GRS80 com λ0 = 0 e k0 = 1, em km:
  meridianos a cada 10° (Δλ de −40° a 40°) e paralelos a cada 15° (de −60° a 60°).
- 'trilha': o ponto P percorre os quatro quadrantes, em (Δλ, φ) = (35°, −35°) →
  (−35°, −35°) → (−35°, 35°) → (35°, 35°); cada amostra traz Δλ, φ, x, y e γ exato.
- 'fuso': fuso 23 em UTM 23S (km), com nós a cada 0,25° × 0,5° (de −48° a −42° e de 0° a
  −35°), γ no centro de cada célula, contorno do Brasil e de Minas Gerais recortados no fuso.
- 'curvas': γ exato contra φ (0° a −35°) para Δλ = 1°, 2°08′ (Viçosa) e 3°.

Convenção de sinal (pyproj, Snyder e slides): γ > 0 quando o norte de quadrícula está a
leste do norte geográfico. Az_Q = Az − γ.

Uso:
    python gerar_dados.py [pasta com ne_50m_admin_0_countries.geojson e
                           ne_50m_admin_1_states_provinces.geojson]
Sem a pasta, os arquivos do Natural Earth 1:50m são lidos do repositório oficial no GitHub.
"""

import json
import sys
from pathlib import Path

import numpy as np
import pyogrio
from pyproj import Proj
from shapely.geometry import box

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "motion" / "v4-dados.json"
BASE_NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/"

VICOSA = (-(42 + 52 / 60), -(20 + 45 / 60))
AZ = 145 + 33 / 60 + 25 / 3600          # exercício 5 (slide 30)
TRILHA = [(35, -35), (-35, -35), (-35, 35), (35, 35)]


def ne(pasta, nome):
    fonte = (Path(pasta) / f"{nome}.geojson") if pasta else BASE_NE + nome + ".geojson"
    return pyogrio.read_dataframe(fonte)


def dms(g, casas=0):
    s = "−" if g < 0 else "+"
    g = abs(g)
    d = int(g)
    m = int((g - d) * 60)
    seg = (g - d - m / 60) * 3600
    if round(seg, casas) >= 60:
        m, seg = m + 1, 0.0
    return f"{s}{d}°{m:02d}′{seg:0{3 + casas if casas else 2}.{casas}f}″".replace(".", ",")


def r1(v):
    return [round(float(a), 1) for a in v]


def main():
    pasta = sys.argv[1] if len(sys.argv) > 1 else None
    tm = Proj(proj="tmerc", lon_0=0, k=1, ellps="GRS80")
    utm = Proj(proj="utm", zone=23, south=True, ellps="GRS80")
    km = lambda p, lam, phi: [c / 1000 for c in p(lam, phi)]

    # Esquema exagerado
    mer, par = [], []
    for dl in range(-40, 41, 10):
        phi = np.arange(-62, 62.01, 1.0)
        x, y = km(tm, np.full_like(phi, dl), phi)
        mer.append({"dl": dl, "x": r1(x), "y": r1(y)})
    for p0 in range(-60, 61, 15):
        lam = np.arange(-46, 46.01, 1.0)
        x, y = km(tm, lam, np.full_like(lam, p0))
        par.append({"phi": p0, "x": r1(x), "y": r1(y)})

    # Trilha de P pelos quatro quadrantes (fechada), 90 amostras por trecho
    tr = []
    for k in range(4):
        (a, b), (c, d) = TRILHA[k], TRILHA[(k + 1) % 4]
        for u in np.linspace(0, 1, 90, endpoint=False):
            dl, phi = a + (c - a) * u, b + (d - b) * u
            x, y = km(tm, dl, phi)
            g = tm.get_factors(dl, phi).meridian_convergence
            tr.append([round(dl, 3), round(phi, 3), round(x, 1), round(y, 1), round(g, 4)])

    # Conferência geométrica: a tangente ao meridiano projetado faz −γ (horário) com o norte de quadrícula
    for dl, phi in [(35, -35), (-35, 35), (40, -40)]:
        x0, y0 = tm(dl, phi - 1e-4)
        x1, y1 = tm(dl, phi + 1e-4)
        ang = np.degrees(np.arctan2(x1 - x0, y1 - y0))
        assert abs(ang + tm.get_factors(dl, phi).meridian_convergence) < 1e-4

    # Fuso 23 (UTM 23S, km)
    lams = np.arange(-48, -41.99, 0.25)
    phis = np.arange(0, -35.01, -0.5)
    L, P = np.meshgrid(lams, phis)
    E, N = km(utm, L, P)
    gam = [[round(utm.get_factors(lams[i] + 0.125, phis[j] - 0.25).meridian_convergence, 3)
            for i in range(len(lams) - 1)] for j in range(len(phis) - 1)]
    linhas = []
    recorte = box(-48, -35, -42, 0)
    paises = ne(pasta, "ne_50m_admin_0_countries")
    ufs = ne(pasta, "ne_50m_admin_1_states_provinces")
    for geom, peso in [(paises[paises["ADMIN"] == "Brazil"].geometry.iloc[0], "br"),
                       (ufs[(ufs["admin"] == "Brazil") & (ufs["postal"] == "MG")].geometry.iloc[0], "mg")]:
        bd = geom.boundary.intersection(recorte)
        for ln in getattr(bd, "geoms", [bd]):
            if ln.is_empty or ln.geom_type != "LineString":
                continue
            c = np.asarray(ln.coords)
            e, n = km(utm, c[:, 0], c[:, 1])
            linhas.append({"k": peso, "e": r1(e), "n": r1(n)})

    curvas = []
    for dl in (1, 2 + 8 / 60, 3):
        ph = np.arange(0, -35.01, -0.5)
        curvas.append({"dl": round(dl, 4), "g": [round(utm.get_factors(-45 + dl, p).meridian_convergence, 4) for p in ph]})

    ev, nv = km(utm, *VICOSA)
    gv = utm.get_factors(*VICOSA).meridian_convergence
    dados = {
        "fonte": "GRS80, pyproj; Natural Earth 1:50m",
        "esq": {"mer": mer, "par": par},
        "trilha": tr,
        "fuso": {"lam": [float(v) for v in lams], "phi": [float(v) for v in phis],
                 "E": [r1(r) for r in E], "N": [r1(r) for r in N], "gamma": gam, "linhas": linhas},
        "curvas": curvas,
        "vicosa": {"E": round(ev, 3), "N": round(nv, 3), "gamma": round(gv, 9)},
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    print(f"{SAIDA.name}: {SAIDA.stat().st_size / 1024:.0f} KiB")

    dl = np.radians(VICOSA[0] + 45)
    g10 = np.degrees(dl * np.sin(np.radians(VICOSA[1])))
    borda = utm.get_factors(-42, -33.75).meridian_convergence
    print(f"Viçosa: Δλ = {dms(VICOSA[0] + 45)}, φ = {dms(VICOSA[1])}")
    print(f"  eq. (10) γ ≈ Δλ sen φ = {dms(g10)}")
    print(f"  pyproj (= eq. 11)     = {dms(gv, 2)}  ({gv:.6f}°)")
    print(f"  diferença eq.(10) − exato = {(g10 - gv) * 3600:+.2f}″")
    print(f"Borda leste do fuso 23 em 33°45′ S: γ = {dms(borda)} (oeste: {dms(-borda)})")
    print(f"Erro de 45′ numa visada de 1 km: {1000 * np.tan(np.radians(0.75)):.1f} m "
          f"(com γ de Viçosa: {1000 * np.tan(np.radians(abs(gv))):.1f} m)")
    azq = AZ - gv
    print(f"Exercício 5: Az = {dms(AZ)} → Az_Q = Az − γ = {dms(azq)}")
    print("Esquema exagerado (TM, λ0 = 0):")
    for dl, phi in [(40, -40)] + TRILHA:
        g = tm.get_factors(dl, phi).meridian_convergence
        ap = np.degrees(np.radians(dl) * np.sin(np.radians(phi)))
        print(f"  Δλ = {dl:+d}°, φ = {phi:+d}°: γ = {g:+.2f}°  (Δλ sen φ = {ap:+.2f}°)")
    print(f"k0 não altera γ: TM k0 = 1 em Viçosa = "
          f"{Proj(proj='tmerc', lon_0=-45, k=1, ellps='GRS80').get_factors(*VICOSA).meridian_convergence:.6f}°")


if __name__ == "__main__":
    main()
