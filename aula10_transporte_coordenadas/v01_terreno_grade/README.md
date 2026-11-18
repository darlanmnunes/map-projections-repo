# V1. Do terreno à grade: por que transportar coordenadas

**Slides:** 3 e 5 (por que transportar; duas famílias de reduções) e o diagrama das reduções lineares das notas da UFPR (Delazari, 2022, slides 3 a 8)
**Duração:** 167 s · 1920 × 1080 · 30 fps · com narração

**Objetivo didático:** entender que as medidas de campo (ângulos e distâncias no terreno) e as
coordenadas UTM estão em superfícies diferentes, e que cada medida passa por reduções antes de
entrar no cálculo: a distância por Fₕ e m₁₂, as direções por ψ (e por γ, se a orientação for
geográfica). Apresenta os problemas direto e inverso, que os vídeos seguintes resolvem.

O roteiro completo, com a narração, está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Arquivo | Conteúdo |
|---|---|---|
| 1 | `motion/scene-campo.js` | Planta do exemplo de Viçosa na grade UTM 23S: marcos GNSS 1 e 2, estação total em 2, ângulo α e distância Dₕ até o ponto 3 |
| 2 | `motion/scene-superficies.js` | Terreno, elipsoide (SR) e plano UTM (SP) em corte; as reduções Fₕ, m₁₂, ψ e γ entre eles |
| 3 | `motion/scene-distancia.js` | Distância inclinada → horizontal → elipsoide (× Fₕ, verticais convergentes) → projeção (× m₁₂); o fuso com m < 1 e m > 1 e o valor de Viçosa |
| 4 | `motion/scene-direcoes.js` | Geodésica projetada (curva, concavidade para o MC), corda, tangente, ψ e γ; esquema exagerado |
| 5 | `motion/scene-problemas.js` | Problema direto e problema inverso; os próximos vídeos |

## Conferência

Saída de `python/gerar_dados.py` (GRS80, SIRGAS 2000 / UTM 23S, módulo `comum/transporte.py`):

| Grandeza | Valor | Slide |
|---|---|---|
| Ponto 3 (problema direto) | E₃ = 724 818,294 m; N₃ = 7 704 974,775 m | 17 |
| Fₕ (hₘ = 668 m) | 0,9998953 | 6 e 17 |
| m em Viçosa (estação 2) | 1,000210 | 4 |
| Dₕ → Dₑ → D_c | 2 850,000 → 2 849,701 → 2 850,320 m | 17 |
| γ na estação 2 | −0°45′22,075″ | 11 e 18 |

Os desenhos das cenas 2 a 4 são esquemas: a convergência das verticais, a curvatura da
geodésica projetada e os ângulos ψ e γ estão muito exagerados, como avisa a nota na tela.

## Narração e som

- Narração em português, gerada por síntese de voz (Gemini TTS, voz Charon) a partir de
  `motion/voz/narracao.json`; um arquivo por fala em `motion/voz/` e, em `voz/falas.json`, a
  duração e o instante de cada palavra, que as cenas usam para sincronizar a animação
  (`kit.em('fala', 'palavra')`).
- Trilha da série ao fundo, abaixando sob a voz, e efeitos discretos de `ferramentas/audio/sons/`
  (ver [CREDITOS.md](../../ferramentas/audio/CREDITOS.md)). A faixa final é `motion/audio.mp3`,
  montada por `ferramentas/montar_audio.py`.

## Arquivos

```
python/gerar_dados.py   gera motion/v1-dados.json (pontos e valores do exemplo de Viçosa) e confere os números
motion/scenes.json      cenas, falas da narração, efeitos sonoros e tempos
motion/base.css         identidade visual (cópia de comum/base.css)
motion/shared.js        bloco comum da Aula 10 (comum/a10.js) e a planta do exemplo
motion/scene-*.js       uma cena por arquivo
motion/voz/             narração: roteiro falado, uma fala por arquivo e os tempos das palavras
motion/audio.mp3        faixa final (narração, trilha e efeitos)
```

## Como reproduzir

```bash
python aula10_transporte_coordenadas/v01_terreno_grade/python/gerar_dados.py
python ferramentas/montar_audio.py aula10_transporte_coordenadas/v01_terreno_grade
python ferramentas/renderizar_mp4.py aula10_transporte_coordenadas/v01_terreno_grade
```

Pré-visualização: `http://localhost:8000/ferramentas/preview/?v=aula10_transporte_coordenadas/v01_terreno_grade`.
