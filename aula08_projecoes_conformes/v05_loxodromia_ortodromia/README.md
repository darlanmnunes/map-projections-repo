# V5. Loxodromia × ortodromia: São Paulo → Joanesburgo

**Slides:** 17 e 18 (Ortodromia e loxodromia; exemplo)
**Duração:** 60 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** mostrar no globo que rumo constante não é caminho mais curto, e
que cada projeção endireita uma das duas linhas.

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 18 s | `motion/scene-globo.js` | Globo no Atlântico Sul; geodésica e loxodromia; ângulos com os meridianos −30°, −10° e 10° |
| 2 | 18 a 32 s | `motion/scene-mercator.js` | O globo vira a Mercator (x = λ, y = ψ): a loxodromia fica reta |
| 3 | 32 a 46 s | `motion/scene-gnomonica.js` | Da Mercator à gnomônica centrada no meio da rota: a geodésica fica reta |
| 4 | 46 a 60 s | `motion/scene-placar.js` | Placar: 7 551 km × 7 442 km, +109 km (1,5 %); frase final |

## Geometria

Elipsoide GRS80, como no slide 18. São Paulo (−23,55°; −46,63°), Joanesburgo
(−26,20°; 28,05°).

- Geodésica: `pyproj.Geod` (algoritmo de Karney), 240 pontos.
- Loxodromia: rumo α = atan2(Δλ, Δψ), com ψ a latitude isométrica do elipsoide; ψ varia
  linearmente com λ ao longo da rota, e a distância é o arco de meridiano dividido por cos α.
- Mercator: x = λ, y = ψ (elipsoide). Gnomônica: esférica, centrada no meio da geodésica
  (−9,757°; −30,281°). Na gnomônica, a geodésica do elipsoide se afasta da reta em
  0,043 % do comprimento (menos de 1 px na tela); o slide 18 a chama de "quase reta".
- As três etapas são uma única transformação contínua de cada ponto: globo ortográfico,
  Mercator e gnomônica.
- Os arcos de ângulo da cena 1 são desenhados na esfera, do norte do meridiano até o azimute
  da rota naquele ponto.

Conferência (saída de `python/gerar_dados.py`):

| Grandeza | Valor |
|---|---|
| Geodésica: azimute de saída / chegada | 109,71° / 74,09° |
| Geodésica: latitude mínima | 30,4° S |
| Geodésica: azimutes em −30°, −10°, 10° | 102,44°, 92,64°, 82,59° |
| Geodésica: distância | 7 442 km |
| Loxodromia: rumo / distância | 92,23° / 7 551 km |
| Diferença | +109 km (1,5 %) |

## Arquivos

```
python/gerar_dados.py   gera motion/v5-dados.json (rotas, ângulos, costa) e confere os números
motion/scenes.json      lista de cenas, durações, paleta e fontes
motion/base.css         identidade visual
motion/shared.js        globo, Mercator, gnomônica e a transformação contínua entre eles
motion/scene-*.js       uma cena por arquivo
motion/v5-dados.json    dados gerados
```

## Como reproduzir

```bash
python aula08_projecoes_conformes/v05_loxodromia_ortodromia/python/gerar_dados.py
python ferramentas/renderizar_mp4.py aula08_projecoes_conformes/v05_loxodromia_ortodromia
```

O script Python usa também `pyproj` (geodésica) e `scipy` (arco de meridiano).
