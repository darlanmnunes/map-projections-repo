# V3. Fator de escala no fuso UTM e linhas de secância

**Slides:** 15, 16 e 17 (fator de escala no fuso UTM; linhas de secância; fator de escala no fuso 23)
**Duração:** 65 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** mostrar onde o cilindro secante reduz e onde amplia as distâncias, e
por que as linhas de secância parecem se abrir para o sul num mapa em latitude e longitude,
mas ficam a ≈ 180 km do MC na grade UTM.

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 20 s | `motion/scene-corte.js` | Corte perpendicular ao MC (fora de escala): elipsoide × cilindro secante; 0,9996, 1,0000 e 1,00098 |
| 2 | 20 a 46 s | `motion/scene-secancia.js` | Fuso 23 com a distorção em ppm; Δλₛ cresce para o sul e encosta na borda perto de 57° S; morph para (E, N), onde xₛ ≈ 180 km |
| 3 | 46 a 65 s | `motion/scene-vicosa.js` | Viçosa a 222 km do MC: m = 1,000210; 1 000,000 m → 1 000,210 m |

## Geometria

- Cena 1: o círculo é a seção do elipsoide pelo plano do Equador; o eixo do cilindro está
  nesse plano, então o cilindro aparece como uma reta à distância k·R do centro. Para que o
  corte seja visível, os ângulos estão exagerados: secância a 18° e borda a 33° do MC (na
  realidade, 1,6° e 3°). Os números na tela são os do GRS80.
- Cenas 2 e 3: cada ponto do fuso 23 (malha de 0,25° × 2°, linhas de 0,5° em latitude) é
  calculado no GRS80 com pyproj e guardado nas duas vistas: (λ, φ) e (E, N) do UTM 23S. A
  vista geográfica é linear em λ e φ; a da grade é linear em E e N. As duas coincidem no MC
  e nas bordas do fuso no Equador, e o morph interpola ponto a ponto.
- Cor de cada célula: média de m − 1 (ppm) nos quatro cantos; branco em zero, azul até
  −400 ppm, vermelho até +1 000 ppm.
- Linha de secância: λ tal que m(λ, φ) = 1, por brentq em cada latitude; a oeste, o espelho
  em relação ao MC. Isolinhas: o mesmo, com m = 1 + v·10⁻⁶.
- Linhas de costa: Natural Earth 1:50m recortadas no fuso.

## Conferência

Saída de `python/gerar_dados.py` (GRS80, UTM 23S, k₀ = 0,9996):

| Grandeza | Slide | Calculado |
|---|---|---|
| m no MC | 0,9996; −40 cm/km (1/2 500) | 0,9996; −40 cm/km; 1/2 500 |
| m na borda do fuso no Equador | 1,00098; +98 cm/km (≈ 1/1 000) | 1,00098; +98 cm/km; 1/1 019 |
| m na borda do fuso em 80° S | 0,99964 | 0,99964 |
| Δλₛ esfera / GRS80 / E − 500 000, φ = 0° | 1°37′14″ / 1°36′55″ / 179,75 km | 1°37′14″ / 1°36′55″ / 179,75 km |
| idem, φ = −10° | 1°38′44″ / 1°38′25″ / 179,79 km | 1°38′44″ / 1°38′25″ / 179,79 km |
| idem, φ = −20°45′ | 1°43′59″ / 1°43′41″ / 179,91 km | 1°43′59″ / 1°43′41″ / 179,91 km |
| idem, φ = −30° | 1°52′17″ / 1°52′00″ / 180,06 km | 1°52′17″ / 1°52′00″ / 180,06 km |
| idem, φ = −33°45′ | 1°56′57″ / 1°56′41″ / 180,13 km | 1°56′57″ / 1°56′41″ / 180,13 km |
| idem, φ = −57°18′ | 3°00′03″ / 2°59′52″ / 180,61 km | 3°00′03″ / 2°59′52″ / 180,61 km |
| Secância encosta na borda (Δλₛ = 3°) | por volta de 57° | 57,33° S (57°19′34″) |
| xₛ na esfera, R √(2(1 − k₀)) | ≈ 180 km | 180,4 km |
| Viçosa: E; N | 722 120,59 m; 7 704 054,61 m | 722 120,59 m; 7 704 054,61 m |
| Viçosa: distância ao MC; m | 222 km; 1,000210 | 222,1 km; 1,000210 |
| 1 000,000 m no elipsoide, em Viçosa | 1 000,210 m na grade | 1 000,210 m |
| Faixa com m < 1 (paralelo de Viçosa) | ≈ 360 km | 360 km (E de 320 a 680 km) |

## Arquivos

```
python/gerar_dados.py   gera motion/v3-dados.json (malha, secantes, isolinhas, costa) e confere os números
motion/scenes.json      lista de cenas, durações, paleta, fontes e início da trilha
motion/base.css         identidade visual
motion/shared.js        mapa do fuso 23 nas vistas (φ, λ) e (E, N), com morph
motion/scene-*.js       uma cena por arquivo
motion/v3-dados.json    dados gerados
```

## Como reproduzir

```bash
python aula09_sistemas_tm/v03_fator_escala/python/gerar_dados.py [pasta_com_geojson_natural_earth]
python ferramentas/renderizar_mp4.py aula09_sistemas_tm/v03_fator_escala
```

Sem a pasta, o script baixa `ne_50m_admin_0_countries.geojson` do repositório do Natural Earth.
