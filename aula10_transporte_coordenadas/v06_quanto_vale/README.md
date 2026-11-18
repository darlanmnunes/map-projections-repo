# V6. Quanto vale cada correção e quando simplificar

**Slides:** 19 (quanto vale cada correção), 22 (quando dá para simplificar) e 23 (do UTM ao sistema local); notas da UFPR (Delazari, 2022), slide 14
**Duração:** 140 s · 1920 × 1080 · 30 fps · com narração

**Objetivo didático:** dar ordem de grandeza a cada correção do transporte, refazendo o exemplo
de Viçosa sem uma delas de cada vez; mostrar que ψ e a diferença entre o fator do ponto e o da
linha crescem com D²E′/(2R²); e organizar a decisão de quando simplificar.

O roteiro completo, com a narração, está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Arquivo | Conteúdo |
|---|---|---|
| 1 | `motion/scene-erros.js` | Deslocamento do ponto 3 quando uma correção é esquecida, em barras com escala logarítmica, e a precisão de uma estação total |
| 2 | `motion/scene-regra.js` | d ≈ D²E′/(2R²) para E′ = 100, 222 (Viçosa) e 300 km; 1 km → 3 mm, 3 km → 25 mm, 10 km → 27 cm |
| 3 | `motion/scene-decisao.js` | As três perguntas do slide 22 e as respostas |
| 4 | `motion/scene-ponte.js` | Terreno → grade UTM → sistema local (Aula 11) e a pergunta do slide 23 |

## Conferência

Saída de `python/gerar_dados.py` (GRS80, SIRGAS 2000 / UTM 23S, módulo `comum/transporte.py`).
Cada valor é a distância entre o ponto 3 calculado sem a correção e o ponto 3 do slide 17
(E₃ = 724 818,294 m; N₃ = 7 704 974,775 m).

| Correção esquecida | Deslocamento | Slide 19 |
|---|---|---|
| γ (orientação por azimute geodésico, −0°45′22″) | 37,6 m | 38 m |
| m₂₃ (D_c = Dₑ) | 0,62 m | dezenas de cm |
| Fₕ (Dₑ = Dₕ) | 0,30 m | dezenas de cm |
| m₂₃ e Fₕ juntos | 0,32 m | metade se compensa |
| m do ponto 2 no lugar de m₂₃ | 21,4 mm | 21 mm |
| ψ₂₃ (vante) | 7,2 mm | 7 mm |
| Estação total, 2 mm + 2 ppm em 2,85 km | 7,7 mm | ≈ 8 mm |

O valor de 7 mm do slide corresponde a esquecer só o ψ da vante. Esquecendo só o da ré, o ponto
se desloca 8,8 mm; esquecendo os dois, 1,5 mm, porque no exemplo ψ₂₁ e ψ₂₃ quase se cancelam
(β − α = +0,11″).

| d ≈ D²E′/(2R²) em Viçosa (E′ = 222,1 km, R = √(MN)) | Valor | Slide 22 |
|---|---|---|
| D = 1 km | 2,7 mm | 3 mm |
| D = 3 km | 24,7 mm | 25 mm |
| D = 10 km | 274 mm | 27 cm |

## Narração e som

Como no V1: narração em `motion/voz/` (Gemini TTS, voz Charon), trilha da série a partir de
230 s, abaixando sob a voz, e efeitos de `ferramentas/audio/sons/`; faixa final em
`motion/audio.mp3`, montada por `ferramentas/montar_audio.py`.

## Arquivos

```
python/gerar_dados.py   gera motion/v6-dados.json (deslocamentos, curvas d(D)) e confere os números
motion/scenes.json      cenas, falas da narração, efeitos sonoros e tempos
motion/base.css         identidade visual (cópia de comum/base.css)
motion/shared.js        bloco comum da Aula 10 e as escalas dos gráficos
motion/scene-*.js       uma cena por arquivo
motion/voz/             narração: roteiro falado, uma fala por arquivo e os tempos das palavras
motion/audio.mp3        faixa final (narração, trilha e efeitos)
```

## Como reproduzir

```bash
python aula10_transporte_coordenadas/v06_quanto_vale/python/gerar_dados.py
python ferramentas/montar_audio.py aula10_transporte_coordenadas/v06_quanto_vale
python ferramentas/renderizar_mp4.py aula10_transporte_coordenadas/v06_quanto_vale
```

Pré-visualização: `http://localhost:8000/ferramentas/preview/?v=aula10_transporte_coordenadas/v06_quanto_vale`.
