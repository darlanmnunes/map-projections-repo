# V2. Latitude isométrica: do retângulo ao quadrado

**Slide:** 5 (Coordenadas Isométricas)
**Duração:** 55 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** dar sentido geométrico à troca de φ por ψ e mostrar por que
ψ explode perto do polo.

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 12 s | `motion/scene-quadrilatero.js` | Globo; quadrilátero Δφ = Δλ = 5° no Equador; zoom com os lados M dφ e N cos φ dλ |
| 2 | 12 a 24 s | `motion/scene-desliza.js` | O quadrilátero desliza para φ = −30° e −60°; o lado leste-oeste encolhe com cos φ (0,87 e 0,50) |
| 3 | 24 a 40 s | `motion/scene-planifica.js` | Grade λ × ψ: os paralelos se reposicionam por dψ = M dφ / (N cos φ); as células viram quadrados |
| 4 | 40 a 55 s | `motion/scene-grafico.js` | Gráfico de \|ψ\| contra \|φ\| até 85°, reta ψ = φ, Viçosa e ψ → ∞ no polo |

## Geometria

Elipsoide GRS80 (a = 6 378 137 m, ε² = 0,00669438002290), como no slide 5.

- Raios de curvatura: M = a(1 − ε²) / (1 − ε² sen²φ)^(3/2) e N = a / (1 − ε² sen²φ)^(1/2).
- Latitude isométrica: ψ = ln[tan(45° + φ/2) ((1 − ε sen φ)/(1 + ε sen φ))^(ε/2)].
- Painel ampliado (cenas 1 e 2): lados N cos φ dλ e M dφ em escala, com dφ = dλ = 5°.
- Cena 3: as células destacadas têm **Δψ = Δλ = 5°**. Na grade com y = φ elas aparecem
  achatadas; com os paralelos em y = ψ, viram quadrados. (Um quadrilátero com Δφ = Δλ
  continua retângulo em qualquer projeção conforme; o quadrado é o de Δψ = Δλ.)
- Globo: projeção ortográfica oblíqua exata, com descarte do hemisfério oculto.

Conferência (saída de `python/gerar_dados.py`):

| φ | N cos φ / M | cos φ (na tela) |
|---|---|---|
| 0° | 1,0067 | 1 |
| −30° | 0,8704 | 0,87 |
| −60° | 0,5008 | 0,50 |

Viçosa, φ = −20°45′: ψ = −21,0831° (−0,367970 rad). Em φ = 85°: ψ = 179,03°.

## Arquivos

```
python/gerar_dados.py   gera motion/v2-dados.json (costa e curva ψ) e confere os números
motion/scenes.json      lista de cenas, durações, paleta e fontes
motion/base.css         identidade visual
motion/shared.js        elipsoide, ψ, globo e painel ampliado comuns às cenas
motion/scene-*.js       uma cena por arquivo
motion/v2-dados.json    dados gerados
```

## Como reproduzir

```bash
python aula08_projecoes_conformes/v02_latitude_isometrica/python/gerar_dados.py
python ferramentas/renderizar_mp4.py aula08_projecoes_conformes/v02_latitude_isometrica
```
