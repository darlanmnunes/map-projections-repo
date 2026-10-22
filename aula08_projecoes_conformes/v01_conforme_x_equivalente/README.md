# V1. Conforme × equivalente: o que acontece com um círculo infinitesimal

**Slides:** 3 e 4 (Conceitos e Definições; Condição Métrica da Conformidade)
**Duração:** 50 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** mostrar que conformidade significa escala igual em todas as
direções, e não escala igual a 1, e que a área é o preço pago (σ = m²).

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 8 s | `motion/scene-globo.js` | Globo gira até centrar a América do Sul; três círculos de 7° sobre λ = −45° (φ = 0°, −30°, −60°) |
| 2 | 8 a 22 s | `motion/scene-desenrola.js` | O globo se divide e se desenrola na Mercator e na Lambert cilíndrica equivalente (mesmo eixo x = λ) |
| 3 | 22 a 35 s | `motion/scene-rotulos.js` | Títulos "Conforme" e "Equivalente"; etiquetas do círculo de −60° |
| 4 | 35 a 50 s | `motion/scene-quadrado.js` | Quadradinho da esfera: quadrado maior na Mercator, retângulo de mesma área na Lambert; E/e = G/g = m², F = 0 |

## Geometria

Tudo é calculado pelas equações (nada desenhado à mão):

- Globo: projeção ortográfica oblíqua exata, com descarte do hemisfério oculto.
- Mercator: x = λ, y = ln tan(45° + φ/2). Lambert cilíndrica: x = λ, y = sen φ.
- Círculos: na esfera, círculo menor de raio angular 7°; nos mapas, indicatriz de
  Tissot com semieixos (sec φ, sec φ) na Mercator e (sec φ, cos φ) na Lambert.
- A transformação globo → mapa interpola cada ponto entre a posição ortográfica e a
  posição projetada; os dois extremos são exatos.
- Linha de costa: Natural Earth 1:110m.

Conferência dos números exibidos (saída de `python/gerar_dados.py`):

| φ | sec φ | Mercator m | σ | Lambert L-O | N-S | σ |
|---|---|---|---|---|---|---|
| 0° | 1,000 | 1,000 | 1,000 | 1,000 | 1,000 | 1 |
| −30° | 1,155 | 1,155 | 1,333 | 1,155 | 0,866 | 1 |
| −60° | 2,000 | 2,000 | 4,000 | 2,000 | 0,500 | 1 |

## Arquivos

```
python/gerar_dados.py   gera motion/v1-dados.json (costa) e confere os números
motion/scenes.json      lista de cenas, durações, paleta e fontes
motion/base.css         identidade visual (cores e tipos dos slides)
motion/shared.js        projeções e desenho comuns às cenas
motion/scene-*.js       uma cena por arquivo
motion/v1-dados.json    linha de costa (gerado)
```

## Como reproduzir

```bash
python aula08_projecoes_conformes/v01_conforme_x_equivalente/python/gerar_dados.py
python ferramentas/renderizar_mp4.py aula08_projecoes_conformes/v01_conforme_x_equivalente
```

O MP4 sai em `export/` (fora do controle de versão).
