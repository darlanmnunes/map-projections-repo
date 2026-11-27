# V3. Geodésica projetada, corda e redução angular ψ

**Slides:** 9 e 10 (geodésica projetada, corda e três azimutes; redução angular ψ) e as notas da UFPR (Delazari, 2022: transporte, slides 6 a 8 e 15; TM e UTM, slides 25 a 28)
**Duração:** 128 s · 1920 × 1080 · 30 fps · com narração

**Objetivo didático:** ver por que, mesmo numa projeção conforme, a direção medida no campo não
entra direto no cálculo de E e N: a geodésica vira uma curva na grade e as coordenadas usam a
corda. Distinguir os três azimutes (Az, Az_Q e Az_C), entender de que depende ψ e quanto ele
vale numa linha real em Viçosa.

O roteiro completo, com a narração, está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Arquivo | Conteúdo |
|---|---|---|
| 1 | `motion/scene-curva.js` | Grade com o MC: geodésica projetada (curva com a concavidade voltada para o MC) e corda; detalhe da flecha real numa linha de 3 km em Viçosa |
| 2 | `motion/scene-azimutes.js` | Em 1: NG, NQ, tangente e corda; Az, Az_Q = Az − γ (12), Az_C = Az − γ − ψ (22); valores reais da linha de Viçosa |
| 3 | `motion/scene-comportamento.js` | Eq. (23) e uma linha que percorre o fuso com ψ calculado ao vivo: no MC e em leste-oeste, ψ = 0; afastando-se do MC e crescendo, ψ aumenta |
| 4 | `motion/scene-vicosa.js` | Linha norte-sul de 3 km a 222 km do MC: ψ = 1,70″; sem ψ, o fim se desloca 24,7 mm; conferência com a geodésica calculada no elipsoide |

## Conferência

Saída de `python/gerar_dados.py` (GRS80, SIRGAS 2000 / UTM 23S, módulo `comum/transporte.py`).
Linha norte-sul de 3 km a partir da estação 2 do exemplo de Viçosa (E′ = 222,121 km):

| Grandeza | Valor | Slide |
|---|---|---|
| ψ pela eq. (23) | +1,699″ | 10 (1,7″) |
| ψ da geodésica amostrada (pyproj Geod, projetada; tangente no início × corda) | +1,698″ (diferença 0,001″) | 10 (0,001″) |
| Deslocamento lateral do fim se ψ for esquecido (D·ψ) | 24,7 mm | 10 (25 mm) |
| Flecha da curva (afastamento máximo à corda) | 6,18 mm (D·ψ/4 = 6,18 mm) | (narração) |
| γ na estação | −0°45′22,1″ | 11 |
| Az_C; Az_Q; Az (= Az_Q + γ) | 0°00′00,0″; 0°00′01,7″; 359°14′39,6″ (pyproj: 359°14′39,6″) | 9 |
| ψ de 3 km norte-sul: no MC; leste-oeste; a 300 km; com 10 km a 300 km | 0; 0; 2,30″; 7,65″ | 10 |

Os desenhos das cenas 1 a 3 são esquemas: a curvatura da geodésica, ψ e γ estão muito
exagerados, como avisam as notas na tela; os números são os reais. Na cena 3, ψ cresce
linearmente com o comprimento; o deslocamento lateral (D·ψ) é que cresce com o quadrado.

## Narração e som

- Narração em português, gerada por síntese de voz (Gemini TTS, voz Charon) a partir de
  `motion/voz/narracao.json`; um arquivo por fala em `motion/voz/` e, em `voz/falas.json`, a
  duração e o instante de cada palavra, que as cenas usam para sincronizar a animação.
- Trilha da série a partir de 100 s, abaixando sob a voz, e efeitos de `ferramentas/audio/sons/`
  (ver [CREDITOS.md](../../ferramentas/audio/CREDITOS.md)). Faixa final: `motion/audio.mp3`.

## Arquivos

```
python/gerar_dados.py   gera motion/v3-dados.json (linha de Viçosa, ψ numérico, trajetória da cena 3) e confere os números
motion/scenes.json      cenas, falas da narração, efeitos sonoros e tempos
motion/base.css         identidade visual (cópia de comum/base.css)
motion/shared.js        bloco comum da Aula 10 (comum/a10.js) e as curvas e trajetórias deste vídeo
motion/scene-*.js       uma cena por arquivo
motion/voz/             narração
motion/audio.mp3        faixa final (narração, trilha e efeitos)
```

## Como reproduzir

```bash
python aulas/aula10_transporte_coordenadas/v03_geodesica_corda_psi/python/gerar_dados.py
python ferramentas/montar_audio.py aulas/aula10_transporte_coordenadas/v03_geodesica_corda_psi
python ferramentas/renderizar_mp4.py aulas/aula10_transporte_coordenadas/v03_geodesica_corda_psi
```

Pré-visualização: `http://localhost:8000/ferramentas/preview/?v=aulas/aula10_transporte_coordenadas/v03_geodesica_corda_psi`.
