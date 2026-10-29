# V5. UTM, RTM e LTM: a mesma TM com outros parâmetros

**Slides:** 24 a 27 (RTM; LTM; quadro comparativo; RTM e LTM sobre Minas Gerais)
**Duração:** 65 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** mostrar que UTM, RTM e LTM são a mesma Transversa de Mercator com
outros cinco parâmetros, e que fusos mais estreitos trocam distorção por limites de fuso.

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 22 s | `motion/scene-parametros.js` | Eq. (1); quadro de parâmetros UTM → RTM → LTM; faixa de longitude em torno de Viçosa dividida em fusos de 6°, 2° e 1° |
| 2 | 22 a 44 s | `motion/scene-parabolas.js` | Distorção (ppm) contra a distância ao MC no paralelo de Viçosa; zoom: o LTM é o trecho central do RTM |
| 3 | 44 a 65 s | `motion/scene-minas.js` | Fusos UTM, RTM e LTM sobre Minas Gerais (3, 7 e 13); fuso de Viçosa em destaque |

## Geometria e equações

- Os três sistemas usam a eq. (1), E = E₀ + k₀ x e N = N₀ + k₀ y, sobre a TM do GRS80
  (pyproj, algoritmo de Poder e Engsager).

  | Sistema | Fuso | MC | k₀ | E₀ (m) | N₀ Sul (m) |
  |---|---|---|---|---|---|
  | UTM | 6° | 6F − 183° | 0,9996 | 500 000 | 10 000 000 |
  | RTM | 2° | longitudes ímpares | 0,999995 | 400 000 | 5 000 000 |
  | LTM | 1° | meios graus | 0,999995 | 200 000 | 5 000 000 |

- Os limites de fuso são múltiplos de 6°, de 2° e de 1° contados a partir de 180°. Cada
  conjunto contém o anterior, então a animação passa de um sistema ao outro acrescentando
  linhas (`A9V5.linhas` em `motion/shared.js`).
- Gráfico da cena 2: (m − 1) × 10⁶ em 121 pontos de borda a borda de cada fuso, no
  paralelo de Viçosa (φ = −20°45′), contra E − E₀ em km. O zoom interpola as escalas dos
  eixos geometricamente, e as marcas dos eixos são recalculadas a cada quadro.
- Mapa da cena 3: (λ, φ) com a longitude multiplicada por cos 19°, como nas figuras dos
  slides. Contornos das UFs: Natural Earth 1:50m, simplificados a 0,02°.

## Conferência

Saída de `python/gerar_dados.py` (GRS80):

| Grandeza | Slide | Calculado |
|---|---|---|
| Viçosa, UTM 23S | E = 722 120,59 m; N = 7 704 054,61 m; m = 1,000210; γ = −0°45′22″ | igual; γ = −0°45′22,07″ |
| Viçosa, RTM (MC −43°) | E = 413 885,61 m; N = 2 704 607,74 m; m = 0,999997; γ = −0°02′50″ | igual; γ = −0°02′50,06″ |
| Viçosa, LTM (MC −42°30′) | m = 1,000013; γ = +0°07′48″ | m = 1,000013 (x = −38,2 km); γ = +0°07′47,67″ |
| Distorção em Viçosa | +210, −3 e +13 mm/km | +210, −3 e +13 mm/km |
| Borda do fuso no Equador | 1,000981; 1,000148 (≈ 1/6 700); 1,000033 (≈ 1/30 000) | 1,000981; 1,000148 (1/6 741); 1,000033 (1/29 999) |
| Escala no MC | 1/2 500; 1/200 000 | 1/2 500; 1/200 000 |
| Curvas no paralelo de Viçosa | UTM −400 a +800; RTM e LTM mínimo −5 | UTM −400,0 a +806,4 (±312,4 km); RTM −5,0 a +129,0 (±104,1 km); LTM −5,0 a +28,5 (±52,1 km) |
| Fusos sobre MG | 3 UTM, 7 RTM, 13 LTM | 3, 7 e 13 com a divisa oeste em ≈ 51°03′ W |
| Fuso 23 esticado até a divisa oeste | m = 1,0045 | Δλ = 6°, φ = −19,66°: m = 1,0045 |

Observação: o contorno 1:50m de Minas Gerais para em λ = −50,998°, a poucos metros do
meridiano −51°; com ele, só 12 fusos LTM tocariam o estado. A divisa oeste real fica em
≈ 51°03′ W, e a contagem usa esse valor (13 fusos, como no slide 27).

## Arquivos

```
python/gerar_dados.py   gera motion/v5-dados.json (curvas, contornos) e confere os números
motion/scenes.json      lista de cenas, durações, paleta, fontes e início da trilha
motion/base.css         identidade visual
motion/shared.js        parâmetros dos sistemas, fusos e limites de cada sistema
motion/scene-*.js       uma cena por arquivo
motion/v5-dados.json    dados gerados
```

## Como reproduzir

```bash
python aula09_sistemas_tm/v05_utm_rtm_ltm/python/gerar_dados.py [pasta_com_geojson]
python ferramentas/renderizar_mp4.py aula09_sistemas_tm/v05_utm_rtm_ltm
```
