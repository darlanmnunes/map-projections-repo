# V5. Problema inverso, contra-azimute e os três arcos da UFPR

**Slides:** 11, 15 e 18 (convergência a partir de E e N; roteiro do problema inverso; conferência) e o exercício do problema inverso das notas da UFPR (Delazari, 2022, slides 16, 17, 23 e 24)
**Duração:** 167 s · 1920 × 1080 · 30 fps · com narração

**Objetivo didático:** percorrer o roteiro do problema inverso (de duas coordenadas UTM ao
azimute geodésico e às distâncias no elipsoide e no terreno), conferi-lo no exemplo de Viçosa,
entender por que o contra-azimute não é o azimute mais 180° e interpretar as três linhas do
exercício da UFPR pela posição que ocupam no fuso.

O roteiro completo, com a narração, está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Arquivo | Conteúdo |
|---|---|---|
| 1 | `motion/scene-roteiro.js` | Slide 15 em seis passos: D_c e Az_C (27), ψ₁₂ (23) e γ₁ (24), Az₁₂ (28), Dₑ = D_c/m₁₂, Dₕ = Dₑ/Fₕ; esquema com ΔE, ΔN, NQ, NG, ψ e γ; quadrantes do arco tangente |
| 2 | `motion/scene-conferencia.js` | Slide 18: a linha 2→3 de Viçosa pela grade e pelo elipsoide (pyproj Geod) |
| 3 | `motion/scene-contra.js` | Az₃₂ − Az₂₃ = 179°59′27″: os 33″ que faltam são a convergência dos meridianos entre 2 e 3 (esquema exagerado) |
| 4 | `motion/scene-arcos.js` | As três linhas da UFPR no fuso 23: arco do equador, linha sobre o MC e trecho do meridiano de 42° O |

## Conferência

Saída de `python/gerar_dados.py` (GRS80, SIRGAS 2000 / UTM 23S, módulo `comum/transporte.py`):

| Grandeza | Grade, eq. (27) e (28) | Elipsoide (pyproj Geod) | Slide 18 |
|---|---|---|---|
| γ₂ (eq. 24) | −0°45′22,075″ | −0°45′22,075″ | −0°45′22,075″ |
| Az₂₃ | 70°24′35,946″ | 70°24′35,946″ | 70°24′35,946″ / 70°24′35,945″ |
| Az₃₂ | 250°24′03,073″ | 250°24′03,074″ | 250°24′03,073″ |
| Dₑ | 2 849,7015 m | 2 849,7015 m | 2 849,7015 m |
| Dₕ = Dₑ/Fₕ | 2 850,0000 m | (medida: 2 850,000 m) | 2 850,0000 m |
| Ponto 3 | 724 818,294; 7 704 974,775 | igual, diferença 0,004 mm | 0,005 mm |

- m₂₃ pela eq. (19), Simpson com os fatores exatos (1,00021721), como no slide 18; a eq. (20)
  daria Dₑ = 2 849,7017 m.
- Contra-azimute: Az₃₂ − Az₂₃ = 179°59′27,1″; faltam 32,9″, e Δλ sen φ entre 2 e 3 dá 32,9″.

Três linhas da UFPR (problema inverso; m₁₂ pela eq. 20):

| Linha | Posição | Az_C | γ₁ | ψ₁₂ | Az₁₂ | m₁₂ | D_c → Dₑ (m) |
|---|---|---|---|---|---|---|---|
| 1 | equador, E 505 → 508 km | 90° | 0 | 0 | 90° | 0,99960053 | 3 000 → 3 001,199 |
| 2 | MC, N 7 950 → 7 947 km (φ ≈ −18,5°) | 180° | 0 | 0 | 180° | 0,99960000 | 3 000 → 3 001,200 |
| 3 | meridiano de 42° O, φ ≈ −25° | 181°16′12,4″ | −1°16′07,8″ | −4,275″ | 180°00′00,3″ | 1,00073194 | 5 542,738 → 5 538,684 |

A linha 3 está sobre a borda do fuso 23: o problema inverso devolve azimute geodésico de 180°,
embora na grade a linha apareça inclinada de 1°16′ (a convergência meridiana ali).

## Narração e som

Como no V1: narração (Gemini TTS, voz Charon) em `motion/voz/`, trilha da série a partir de
180 s abaixando sob a voz, e efeitos de `ferramentas/audio/sons/`; faixa final em
`motion/audio.mp3`, montada por `ferramentas/montar_audio.py`.

## Arquivos

```
python/gerar_dados.py   gera motion/v5-dados.json (Viçosa, contra-azimute, três linhas e o fuso 23) e confere os números
motion/scenes.json      cenas, falas da narração, efeitos sonoros e tempos
motion/base.css         identidade visual (cópia de comum/base.css)
motion/shared.js        bloco comum da Aula 10 (comum/a10.js), estilos do vídeo e o fuso esquemático
motion/scene-*.js       uma cena por arquivo
motion/voz/             narração: roteiro falado, uma fala por arquivo e os tempos das palavras
motion/audio.mp3        faixa final (narração, trilha e efeitos)
```

## Como reproduzir

```bash
python aula10_transporte_coordenadas/v05_problema_inverso/python/gerar_dados.py
python ferramentas/montar_audio.py aula10_transporte_coordenadas/v05_problema_inverso
python ferramentas/renderizar_mp4.py aula10_transporte_coordenadas/v05_problema_inverso
```

Pré-visualização: `http://localhost:8000/ferramentas/preview/?v=aula10_transporte_coordenadas/v05_problema_inverso`.
