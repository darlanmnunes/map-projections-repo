# V1. 60 fusos: do globo ao fuso de Viçosa

Aula 09, slides 7, 8, 9, 12 e 13. Duração: 60 s.

## Objetivo didático

Mostrar de onde vem o número do fuso UTM: a numeração começa no antimeridiano e cresce para leste em
passos de 6°, e o fuso de um ponto é simplesmente quantos blocos de 6° cabem entre 180° W e a sua
longitude, mais um. Com isso, a eq. (3) do slide 12 deixa de ser uma fórmula para decorar.

## Cenas

| Cena | Tempo | Conteúdo |
|---|---|---|
| `globo` | 0 a 17 s | Globo girando para leste; fusos 1 a 60 numerados; Brasil nos fusos 18 a 25 |
| `mundo` | 17 a 31 s | Mapa-múndi com as 60 faixas de 80° S a 84° N; zoom no Brasil, em Minas Gerais e em Viçosa |
| `regra` | 31 a 52 s | λ + 180° = 137,13° preenchido em blocos de 6°: 22 inteiros, F = 23; MC, Δλ e hemisfério |
| `final` | 52 a 60 s | Viçosa: fuso 23, MC −45°, UTM 23S, EPSG:31983 |

## Geometria e equações

- Fuso F: de 6F − 186° a 6F − 180°, meridiano central λMC = 6F − 183°; limites de latitude 80° S e 84° N.
- Número do fuso (slide 12, eq. 3): F = ⌊(λ + 180°)/6°⌋ + 1, com λ em graus decimais, negativo a oeste.
- Globo: projeção ortográfica da esfera, com o hemisfério oculto descartado (polígonos levados ao limbo).
- Mapa-múndi e zoom: coordenadas (λ, φ) em escala linear (equiretangular), janela interpolada.
- Contornos: Natural Earth 1:50m (países, Brasil continental e Minas Gerais), simplificados.

## Conferência dos números

`python python/gerar_dados.py` gera `motion/v1-dados.json` e imprime:

| Grandeza | Na tela | Calculado | Slide |
|---|---|---|---|
| Fusos do Brasil continental | 18 a 25 | 18 a 25 (λ de −74,00° a −34,81°) | 8 e 9 |
| Fusos de Minas Gerais | 22, 23 e 24 | 22 a 24 (λ de −51,00° a −39,86°) | 9 |
| λ + 180° em Viçosa | 137,13° | 137,13° | 13 |
| (λ + 180°)/6° | 22,86 | 22,86 | 13 |
| Fuso de Viçosa | 23 | 23 | 13 |
| MC | −45° | −45° | 13 |
| Δλ | +2°08′ | +2°08′ | 13 |
| Banda MGRS | K | K | 13 |
| EPSG | 31983 | SIRGAS 2000 / UTM zone 23S | 9 e 13 |
| Belo Horizonte, Uberlândia | 23, 22 | 23, 22 | 13 |
