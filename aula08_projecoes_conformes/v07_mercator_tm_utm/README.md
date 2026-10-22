# V7. Da Mercator à Transversa de Mercator e ao UTM

**Slides:** 22, 23 e 24 (TM; equações; ponte para o UTM)
**Duração:** 72 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** visualizar o giro do cilindro, o fuso de 6° e o efeito de
k₀ = 0,9996 (cilindro secante), preparando a Aula 09.

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 15 s | `motion/scene-cilindro.js` | Cilindro tangente ao Equador gira 90° e passa a tocar o globo no meridiano −45° (MC) |
| 2 | 15 a 28 s | `motion/scene-fuso.js` | Fuso 23 (−48° a −42°), Viçosa, indicatrizes da TM ao longo do paralelo de Viçosa; m ≈ 1 + x²/(2R²) |
| 3 | 28 a 46 s | `motion/scene-grafico.js` | m contra x no paralelo de Viçosa: TM tangente × 0,9996 = UTM; m = 1 em ±180 km; Viçosa |
| 4 | 46 a 62 s | `motion/scene-secante.js` | Zoom no fuso 23: o raio do cilindro passa a 0,9996 R e surgem as duas linhas de secância |
| 5 | 62 a 72 s | `motion/scene-final.js` | Viçosa em UTM 23S e ponte para a próxima aula |

## Geometria

- Vista 3D na esfera unitária, câmera ortográfica. O eixo do cilindro gira 90° em torno do
  eixo que passa por (λ0 = −45°, 0°), no plano do Equador: a = z cos θ + (r0 × z) sen θ. O
  contato é o círculo máximo perpendicular a a: o Equador no início e o meridiano λ0 no fim.
- Cilindro secante: raio k₀ = 0,9996; ele corta a esfera em dois círculos menores a
  arccos(0,9996) = 1,621° de arco do MC (≈ 180 km). Como o raio muda só 0,0004 R, a cena 4
  aproxima a câmera do fuso 23 para que as linhas apareçam.
- Indicatrizes da cena 2: círculos com raio proporcional ao m da TM esférica,
  m = 1 / √(1 − cos²φ sen²Δλ), ao longo do paralelo de Viçosa e estendidos até ±45° do MC
  (dentro do fuso, m vai só até 1,0012, o que não apareceria na tela).
- Gráfico da cena 3: m da TM tangente no GRS80 (pyproj), em 241 pontos de −48° a −42°, contra
  x (km). A curva do UTM é a mesma × 0,9996.

Conferência (saída de `python/gerar_dados.py`, GRS80):

| Grandeza | Valor |
|---|---|
| Viçosa em UTM 23S | E = 722 120,59 m; N = 7 704 054,61 m |
| m em Viçosa (UTM) | 1,000210 (x = 222 km) |
| Bordas do fuso no paralelo de Viçosa | x = ±312,5 km (na tela, ±312 km, como no roteiro) |
| TM tangente nas bordas | m = 1,0012 |
| UTM: m = 1 | x = ±180 km |
| UTM: borda no Equador | m = 1,00098 |

## Arquivos

```
python/gerar_dados.py   gera motion/v7-dados.json (curva m(x), costa) e confere os números
motion/scenes.json      lista de cenas, durações, paleta e fontes
motion/base.css         identidade visual
motion/shared.js        globo, fuso 23, cilindro que gira e cilindro secante
motion/scene-*.js       uma cena por arquivo
motion/v7-dados.json    dados gerados
```

## Como reproduzir

```bash
python aula08_projecoes_conformes/v07_mercator_tm_utm/python/gerar_dados.py
python ferramentas/renderizar_mp4.py aula08_projecoes_conformes/v07_mercator_tm_utm
```
