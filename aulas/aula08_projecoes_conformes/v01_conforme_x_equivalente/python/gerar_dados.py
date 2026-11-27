"""
V1. Conforme x equivalente: o que acontece com um círculo infinitesimal.

Gera o módulo de dados usado pela animação (motion/v1-dados.json) e confere
os números que aparecem na tela.

- Linha de costa: Natural Earth 1:110m (países dissolvidos em terra firme).
- 'land': terra inteira, para o globo.
- 'box': terra recortada na janela dos mapas (λ de -115° a 25°, φ de -75° a 15°),
  para a transformação globo -> mapa.

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
SAIDA = AQUI.parent / "motion" / "v1-dados.json"

# Arquivo padrão: cópia do Natural Earth 110m que acompanha o pyogrio
SHP_PADRAO = (
    Path(pyogrio.__file__).parent
    / "tests" / "fixtures" / "naturalearth_lowres" / "naturalearth_lowres.shp"
)

# Janela dos mapas (graus) e parâmetros do roteiro
LON = (-115.0, 25.0)
LAT = (-75.0, 15.0)
RAIO_ANGULAR = 7.0          # raio dos círculos na esfera (graus)
LATITUDES = (0.0, -30.0, -60.0)
SIMPLIFICA = 0.2            # tolerância de simplificação (graus)
ADENSA = 1.5                # espaçamento máximo entre vértices (graus)
LAT_MIN = -85.0             # limite para evitar y infinito na Mercator


def aneis(geom):
    """Lista de anéis exteriores (lon, lat) de um Polygon/MultiPolygon."""
    polys = getattr(geom, "geoms", [geom])
    return [np.asarray(p.exterior.coords) for p in polys if not p.is_empty]


def achatar(anel):
    """[lon0, lat0, lon1, lat1, ...] com uma casa decimal."""
    a = anel.copy()
    a[:, 1] = np.clip(a[:, 1], LAT_MIN, 90.0)
    return [round(float(v), 1) for v in a.ravel()]


def conferir_numeros():
    """Fatores de escala que o roteiro manda exibir."""
    print("φ      sec φ   Mercator m  σ     Lambert a(L-O)  b(N-S)  σ")
    for phi in LATITUDES:
        f = np.radians(phi)
        sec, cos = 1 / np.cos(f), np.cos(f)
        print(f"{phi:5.0f}  {sec:6.3f}  {sec:9.3f}  {sec**2:5.3f}"
              f"  {sec:13.3f}  {cos:6.3f}  {sec * cos:4.2f}")
    # ϖ da Lambert em -60°: 2 arcsen((a - b)/(a + b))
    a, b = 2.0, 0.5
    w = 2 * np.degrees(np.arcsin((a - b) / (a + b)))
    print(f"Lambert em -60°: ϖ = {w:.2f}° (> 0)")


def main():
    shp = Path(sys.argv[1]) if len(sys.argv) > 1 else SHP_PADRAO
    paises = pyogrio.read_dataframe(shp)
    terra = unary_union(paises.geometry.values).simplify(SIMPLIFICA).segmentize(ADENSA)
    janela = terra.intersection(box(LON[0], LAT[0], LON[1], LAT[1]))

    dados = {
        "fonte": "Natural Earth 1:110m",
        "lon": LON,
        "lat": LAT,
        "land": [achatar(a) for a in aneis(terra) if len(a) > 3],
        "box": [achatar(a) for a in aneis(janela) if len(a) > 3],
    }
    SAIDA.write_text(json.dumps(dados, separators=(",", ":")), encoding="utf-8")
    n = sum(len(a) for a in dados["land"]) // 2
    print(f"{SAIDA.name}: {len(dados['land'])} anéis, {n} vértices, "
          f"{SAIDA.stat().st_size / 1024:.0f} KiB")
    conferir_numeros()


if __name__ == "__main__":
    main()
