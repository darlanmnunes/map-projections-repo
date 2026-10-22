# V6. Estereográfica: perspectiva do antípoda e o plano secante do UPS

**Slides:** 20 e 21 (Projeção Estereográfica; UPS)
**Duração:** 60 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** mostrar a construção perspectiva, a preservação de círculos e o
efeito de k₀ = 0,994.

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 15 s | `motion/scene-corte.js` | Globo em corte meridiano, plano tangente no polo sul, raios a partir do polo norte; ρ = 2R tan(c/2) |
| 2 | 15 a 28 s | `motion/scene-circulo.js` | Globo completo; círculo de 10° em torno de (35° E, 50° S) projetado no plano; a câmera desce até ver o plano de frente |
| 3 | 28 a 45 s | `motion/scene-secante.js` | Zoom no polo sul; o plano sobe e corta o globo em 81°06′52″ S; gráfico de m com k₀ = 1 e k₀ = 0,994 |
| 4 | 45 a 60 s | `motion/scene-polar.js` | Vista polar com a Antártida, indicatrizes, círculo de m = 1 e limite do UPS em 80° S |

## Geometria

- Construção perspectiva exata na esfera (R = 1): o raio que sai do polo norte N = (0, 0, 1)
  e passa por P atinge o plano z = zp em t·P, com t = (1 − zp) / (1 − z_P).
  Plano tangente: zp = −1, o que dá ρ = 2R tan(c/2).
- Plano secante: zp = −R(2k₀ − 1) = −0,988 R, o que dá ρ = 2R k₀ tan(c/2). O plano sobe só
  0,012 R; por isso a cena 3 aproxima a câmera do polo sul enquanto ele sobe.
- O círculo projetado no plano é calculado ponto a ponto pelos raios; vista de frente
  (câmera abaixo do plano), a imagem é um círculo exato.
- Gráfico: m = 2k₀ / (1 + cos c), c = 90° − |φ| (esfera, como no roteiro).
- Vista polar (cena 4): x = ρ sen λ, y = ρ cos λ, com ρ = 2k₀ tan(c/2) e λ₀ = 0°.

Conferência (saída de `python/gerar_dados.py`):

| Grandeza | Esfera | GRS80 (UPS) |
|---|---|---|
| Círculo de m = 1 | 81°06′53,55″ S | 81°06′52,26″ S |
| m no polo | 0,9940 | 0,9940 |
| m em 80° S | 1,0016 | 1,0016 |

O rótulo do círculo de corte usa o valor do GRS80 (81°06′52″ S, como no slide 21); o
gráfico usa a fórmula da esfera, cujo cruzamento arredonda para 81°07′ S nos dois casos.

## Arquivos

```
python/gerar_dados.py   gera motion/v6-dados.json (costa) e confere os números
motion/scenes.json      lista de cenas, durações, paleta e fontes
motion/base.css         identidade visual
motion/shared.js        câmera 3D com corte, plano tangente ou secante e raios do polo norte
motion/scene-*.js       uma cena por arquivo
motion/v6-dados.json    dados gerados
```

## Como reproduzir

```bash
python aula08_projecoes_conformes/v06_estereografica_ups/python/gerar_dados.py
python ferramentas/renderizar_mp4.py aula08_projecoes_conformes/v06_estereografica_ups
```
