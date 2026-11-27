# V2. Reduções lineares: fator de altitude, fator de escala da linha e fator combinado

**Slides:** 6, 7 e 8 (Fₕ, m₁₂ pela regra de Simpson, fator combinado) e as reduções lineares das notas da UFPR (Delazari, 2022, slides 3 a 5)
**Duração:** 151 s · 1920 × 1080 · 30 fps · com narração

**Objetivo didático:** quantificar as duas reduções multiplicativas da distância. Do terreno ao
elipsoide, Fₕ encolhe a linha porque as verticais convergem; do elipsoide à grade, o fator de
escala varia ao longo da linha e precisa de uma média (Simpson). O produto k = m₁₂ · Fₕ pode
compensar ou somar os dois efeitos, conforme a posição no fuso e a altitude.

O roteiro completo, com a narração, está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Arquivo | Conteúdo |
|---|---|---|
| 1 | `motion/scene-altitude.js` | Linha a h = 668 m desce pelas verticais convergentes até o elipsoide; eq. (18), Rα de Euler, h geométrica; perda por km para h = 100, 668 e 2 000 m |
| 2 | `motion/scene-escala.js` | Perfil de m ao longo de E′ na latitude de Viçosa; linha de 5 km para leste com m₁, m_m e m₂; eq. (19) e (20); erro de usar só m₁ |
| 3 | `motion/scene-combinado.js` | k = m₁₂ · Fₕ (21); barras de Viçosa; mapa de k sobre E′ × h com o contorno k = 1; 1 ha na grade |

## Conferência

Saída de `python/gerar_dados.py` (GRS80, UTM 23S, módulo `comum/transporte.py` e pyproj):

| Grandeza | Valor | Slide |
|---|---|---|
| Fₕ − 1 para h = 100, 668 e 2 000 m | −15,7; −104,7; −313,5 mm/km | 6 |
| Fₕ (h = 668 m) | 0,999895 | 6 e 8 |
| √(MN) em vez de Rα; H em vez de h (10 m) | 0,24 mm/km; 1,57 mm/km | 6 |
| Secância (m = 1) em Viçosa | E′ = ±179,9 km | Aula 09 |
| Linha de 5 km a leste: m₁, m_m, m₂ | 1,00020971; 1,00022351; 1,00023746 | 7 |
| m₁₂ (Simpson, fatores exatos); eq. (20) | 1,00022360; 1,00022353 | 7 |
| Erro de usar só m₁ | 13,9 mm/km | 7 |
| Erro de Simpson (contra a integral numérica de 1/m) | < 0,00001 mm/km | 7 (“0,002”) |
| Viçosa: m, Fₕ, k | +210, −105, +105 mm/km (k = 1,000105) | 8 |
| Mínimo de k na grade (E′ = 0, h = 2 000 m) | −713 mm/km | 8 (“−700”) |
| 1 ha no terreno, na grade | 10 002,1 m² | 8 |

O slide 7 dá 0,002 mm/km como erro da regra de Simpson; a conta aqui, com os fatores exatos do
pyproj, dá um erro ainda menor. Na tela aparece “< 0,002 mm/km”. O mapa de k vai até h = 2 000 m,
onde o mínimo (−713 mm/km) corresponde aos “−700 mm/km” do slide 8 e da narração.

O corte da cena 1 é um esquema: a altitude e a convergência das verticais estão muito exageradas,
como avisa a nota na tela.

## Narração e som

- Narração gerada por síntese de voz (Gemini TTS, voz Charon) a partir de `motion/voz/narracao.json`;
  um arquivo por fala em `motion/voz/` e os instantes das palavras em `voz/falas.json`.
- Trilha da série a partir de 60 s, abaixando sob a voz; efeitos de `ferramentas/audio/sons/`.
  Faixa final em `motion/audio.mp3`, montada por `ferramentas/montar_audio.py`.

## Arquivos

```
python/gerar_dados.py   gera motion/v2-dados.json (Fₕ, perfil de m, linha de 5 km, mapa de k) e confere os números
motion/scenes.json      cenas, falas, efeitos sonoros e tempos
motion/base.css         identidade visual (cópia de comum/base.css)
motion/shared.js        bloco comum da Aula 10, eixos e cores do V2
motion/scene-*.js       uma cena por arquivo
motion/voz/             narração
motion/audio.mp3        faixa final
```

## Como reproduzir

```bash
python aulas/aula10_transporte_coordenadas/v02_reducoes_lineares/python/gerar_dados.py
python ferramentas/montar_audio.py aulas/aula10_transporte_coordenadas/v02_reducoes_lineares
python ferramentas/renderizar_mp4.py aulas/aula10_transporte_coordenadas/v02_reducoes_lineares
```

Pré-visualização: `http://localhost:8000/ferramentas/preview/?v=aulas/aula10_transporte_coordenadas/v02_reducoes_lineares`.
