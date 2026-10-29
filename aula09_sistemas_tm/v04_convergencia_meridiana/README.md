# V4. Convergência meridiana: norte de quadrícula × norte geográfico

**Slides:** 19 e 20 (convergência meridiana; fuso 23) e exercício 5 do slide 30
**Duração:** 66 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** ver por que o norte da grade e o norte verdadeiro não coincidem fora do
MC, como o sinal de γ muda nos quatro quadrantes, quanto γ vale de fato no fuso 23 e como ele
entra na passagem do azimute geodésico para o azimute de quadrícula.

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 17 s | `motion/scene-grade.js` | Grade TM, meridianos e paralelos projetados; em P (Δλ = 35°, φ = −35°), NQ, NG e γ (esquema exagerado) |
| 2 | 17 a 38 s | `motion/scene-quadrantes.js` | P percorre os quatro quadrantes; γ exato e Δλ sen φ ao vivo; quadro de sinais; γ = 0 no MC e no Equador |
| 3 | 38 a 53 s | `motion/scene-fuso.js` | γ no fuso 23: mapa, γ × φ para Δλ fixo, Viçosa e a borda em 33°45′ S |
| 4 | 53 a 66 s | `motion/scene-pratica.js` | Visada de 1 km em Viçosa: Az → Az_Q = Az − γ; o erro de 13 m quando γ é ignorado |

## Geometria e equações

- Convenção de sinal (a mesma do pyproj, de Snyder e dos slides): γ > 0 quando o norte de
  quadrícula está a leste do norte geográfico. A tangente ao meridiano projetado faz −γ
  (sentido horário) com o norte de quadrícula; `gerar_dados.py` confere isso por diferenças
  finitas sobre a TM.

  | Sinal de γ | Oeste do MC | Leste do MC |
  |---|---|---|
  | Hemisfério Norte | γ < 0 | γ > 0 |
  | Hemisfério Sul | γ > 0 | γ < 0 |

- Aproximação de primeira ordem (Aula 08): γ ≈ Δλ sen φ (10). Série completa no elipsoide:
  eq. (11) do slide 20; o vídeo usa o valor exato do pyproj (algoritmo de Poder e Engsager),
  que coincide com a eq. (11) em Viçosa.
- Azimute de quadrícula: Az_Q = Az − γ (12). Na Aula 10 entra também a redução angular ψ.
- Esquema das cenas 1 e 2: TM no GRS80 com λ0 = 0 e k₀ = 1, em km; meridianos a cada 10°
  (Δλ até ±40°) e paralelos a cada 15°. A grade de quadrícula tem retas a cada 1 000 km.
- Cena 3: fuso 23 em UTM 23S (EPSG:31983), nós a cada 0,25° × 0,5°, γ no centro de cada
  célula; contornos do Natural Earth 1:50m. Curvas γ(φ) para Δλ fixo, exatas (pyproj) e
  Δλ sen φ (tracejadas).
- Cena 4: os ângulos γ do desenho estão ampliados 10× para aparecer; os números na tela são
  os reais.

## Conferência

Saída de `python/gerar_dados.py` (GRS80, pyproj):

| Grandeza | Valor | Slide |
|---|---|---|
| Viçosa: Δλ, φ | +2°08′, −20°45′ | 20 |
| γ pela eq. (10), Δλ sen φ | −0°45′21″ | 20 |
| γ exato (pyproj = eq. 11) | −0°45′22,07″ | 20 |
| Diferença eq. (10) − exato | 1,1″ | notas do 20 |
| Borda do fuso 23 em 33°45′ S | \|γ\| = 1°40′ (1°40′04″) | 20 |
| Erro de 45′ numa visada de 1 km | 13,1 m (13,2 m com o γ de Viçosa) | 20 |
| Exercício 5: Az = 145°33′25″ | Az_Q = 146°18′47″ | 30 |
| TM com k₀ = 1 em Viçosa | γ = −0,756132° (igual ao UTM) | 19 |
| Esquema: Δλ = ±35°, φ = ±35° | \|γ\| = 21°54′; Δλ sen φ = 20°05′ | (esquema) |

## Arquivos

```
python/gerar_dados.py   gera motion/v4-dados.json (esquema, trilha de P, fuso 23, curvas γ × φ) e confere os números
motion/scenes.json      lista de cenas, durações, paleta, fontes e início da trilha sonora
motion/base.css         identidade visual
motion/shared.js        esquema TM, setas NQ e NG, ângulo γ e formatação de ângulos
motion/scene-*.js       uma cena por arquivo
motion/v4-dados.json    dados gerados
```

## Como reproduzir

```bash
python aula09_sistemas_tm/v04_convergencia_meridiana/python/gerar_dados.py [pasta_natural_earth]
```

Sem a pasta, os contornos do Natural Earth 1:50m são lidos do repositório oficial no GitHub.
Pré-visualização: `http://localhost:8000/ferramentas/preview/?v=aula09_sistemas_tm/v04_convergencia_meridiana`.
