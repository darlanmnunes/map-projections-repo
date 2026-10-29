# V2. Coordenadas planas do fuso: origem, falso leste e falso norte

**Slides:** 10 e 11 (origem, eixos e falsas coordenadas; um par (E, N) não basta)
**Duração:** 62 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** ver que cada fuso UTM tem o seu próprio sistema plano, com origem no
cruzamento do Equador com o MC, e que o falso leste e o falso norte apenas deslocam essa origem
para que E e N nunca sejam negativos. Consequência: o mesmo par (E, N) existe em todos os fusos,
e a coordenada só fica completa com referencial, fuso e hemisfério.

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 18 s | `motion/scene-fuso.js` | Fuso 23 em x e y (km) da TM, de 80° S a 84° N; origem no Equador × MC; x < 0 a oeste, y < 0 ao sul; ±334 km no Equador |
| 2 | 18 a 38 s | `motion/scene-falsa.js` | A origem anda 500 km para oeste e 10 000 km para o sul; x, y viram E, N; Viçosa |
| 3 | 38 a 53 s | `motion/scene-brasil.js` | O mesmo (E, N) de Viçosa nos oito fusos do Brasil (18 a 25) |
| 4 | 53 a 62 s | `motion/scene-final.js` | Forma completa: SIRGAS 2000 / UTM 23S (EPSG:31983); 23S × 23K |

## Geometria

- Fuso 23 (λ de −48° a −42°, MC −45°) nas coordenadas da Transversa de Mercator no GRS80 com
  k₀ = 1 (pyproj, `+proj=tmerc +lon_0=-45 +k=1`), de 80° S a 84° N com passo de 0,5°. As bordas
  são as imagens exatas dos meridianos −48° e −42°; meridianos de 1° e paralelos de 8°.
- O gráfico tem a mesma forma do slide 10: o eixo horizontal está 15× mais ampliado que o
  vertical (0,6 px/km contra 0,04 px/km), e a tela avisa isso. Sem essa ampliação o fuso, com
  668 km de largura e 18 217 km de altura, viraria uma linha.
- Eq. (2) do slide 10: E = 500 000 + 0,9996 x e N = 10 000 000 + 0,9996 y (Hemisfério Sul) ou
  N = 0,9996 y (Hemisfério Norte). Os rótulos E e N ficam nas posições exatas dessa conversão
  (a diferença para os rótulos x e y é de 0,1 px, por isso a troca é um esmaecimento cruzado).
- A falsa origem do Hemisfério Sul (E = 0, N = 0) é o canto inferior esquerdo do gráfico:
  x = −500 km, y = −10 000 km.
- Cena 3: para cada fuso F de 18 a 25, o par (E, N) de Viçosa é convertido de volta com o
  problema inverso do UTM F Sul (pyproj). Todos caem em φ = −20°45′ e a Δλ = +2°08′ do MC do
  fuso (6F − 183°). Mapa em graus (equiretangular, 19 px por grau) com Natural Earth 1:50m.

## Conferência

Saída de `python/gerar_dados.py` (GRS80, pyproj), comparada com os slides 10, 11 e 23:

| Grandeza | Na tela | Calculado | Slide |
|---|---|---|---|
| Viçosa em UTM 23S | E = 722 120,59 m; N = 7 704 054,61 m | 722 120,59; 7 704 054,61 | 11 e 23: iguais |
| Viçosa na TM (k₀ = 1) | ponto em x = 222,2 km; y = −2 296,9 km | 500 000 + 0,9996x = 722 120,59; 10⁷ + 0,9996y = 7 704 054,61 | eq. (2) |
| Fuso no Equador, em x | −334 km a +334 km | ±334,1 km | (166 a 834 km em E) |
| Fuso no Equador, em E | ≈ 166 km a ≈ 834 km | 166,0 a 834,0 km | 10: ≈ 166 a 834 km |
| N em 80° S (no MC) | ≈ 1 118 km | 1 118,4 km | 10: ≈ 1 118 km |
| N em 84° N (no MC) | ≈ 9 328 km | 9 328,1 km | 10: ≈ 9 328 km |
| Δλ de Viçosa ao MC | 2°08′ | +2,1333° = 2°08,0′ | 11 e 13: 2°08′ |
| Mesmo (E, N) nos fusos 18 a 25 | 8 pontos em φ = −20°45′ | φ = −20,7500°, λ = MC + 2,1333° em todos | 11 |
| Forma completa | SIRGAS 2000 / UTM 23S (EPSG:31983) | EPSG 31960 + 23 | 9 e 11 |

## Arquivos

```
python/gerar_dados.py   gera motion/v2-dados.json (fuso 23 na TM, contornos, pontos) e confere os números
motion/scenes.json      lista de cenas, durações, paleta, fontes e início da trilha
motion/base.css         identidade visual
motion/shared.js        gráfico do fuso (x, y → E, N) e mapa do Brasil com os fusos
motion/scene-*.js       uma cena por arquivo
motion/v2-dados.json    dados gerados
```

## Como reproduzir

```bash
python aula09_sistemas_tm/v02_coordenadas_planas/python/gerar_dados.py [pasta_dos_geojson]
python ferramentas/renderizar_mp4.py aula09_sistemas_tm/v02_coordenadas_planas
```

Sem a pasta, os contornos Natural Earth 1:50m são lidos do repositório oficial no GitHub.
