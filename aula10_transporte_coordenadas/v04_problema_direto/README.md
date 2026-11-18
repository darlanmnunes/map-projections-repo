# V4. Problema direto, passo a passo

**Slides:** 12, 14, 16, 17 e 20 (ângulo medido × ângulo na grade; roteiro do problema direto; exemplo
de Viçosa; conferência com a UFPR) e as notas da UFPR (Delazari, 2022, slides 9 a 13 e 18 a 22)
**Duração:** 157 s · 1920 × 1080 · 30 fps · com narração

**Objetivo didático:** resolver o exemplo da aula em cinco passos, vendo de onde sai cada número
do quadro do slide 17: por que se soma ψ₂₁ antes de somar α (o ângulo medido está entre as
tangentes), por que γ não entra (a orientação vem de uma ré com coordenadas UTM), por que o ponto 3
é primeiro aproximado e quanto a grade “estica” a distância medida. No fim, o mesmo roteiro
reproduz os quatro pontos do exemplo da UFPR (programa TRANSPUTM).

O roteiro completo, com a narração, está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Arquivo | Conteúdo |
|---|---|---|
| 1 | `motion/scene-dados.js` | Planta do exemplo na grade UTM 23S e o quadro de dados do slide 16 |
| 2 | `motion/scene-passo1.js` | Na estação 2: corda 2→1, ψ₂₁, tangente da ré, α e tangente da vante (ψ exagerados); γ não entra |
| 3 | `motion/scene-passos23.js` | Dₑ = Fₕ · Dₕ, eq. (18); ponto 3 aproximado com m₂ e Az_Q,23 |
| 4 | `motion/scene-passos45.js` | ψ₂₃ e Az_C,23; m₂₃ (Simpson) e D_c; E₃ e N₃, eq. (26); zoom do ponto aproximado ao definitivo |
| 5 | `motion/scene-ufpr.js` | Exemplo da UFPR: pontos A a D, publicado × calculado; a poligonal (3 vira estação, 2 vira ré) |

O quadro de resultados à direita das cenas 2 a 4 tem a mesma ordem do slide 17 e é preenchido
linha a linha, conforme a narração chega a cada passo.

## Conferência

Saída de `python/gerar_dados.py` (GRS80, SIRGAS 2000 / UTM 23S, módulo `comum/transporte.py`):

| Passo | Grandeza | Calculado | Slide 17 |
|---|---|---|---|
| 1 | Az_C,21 ; ψ₂₁ | 312°45′21,387″ ; +0,633″ | igual |
| 1 | Az_Q,21 ; Az_Q,23 | 312°45′22,021″ ; 71°09′58,021″ | igual |
| 2 | Fₕ ; Dₑ | 0,9998953 ; 2 849,701 m | igual |
| 3 | E′₃ ; N′₃ | 724 818,276 ; 7 704 974,761 | igual |
| 4 | ψ₂₃ ; Az_C,23 | +0,523″ ; 71°09′57,497″ | igual |
| 4 | m₂₃ ; k₂₃ | 1,00021720 ; 1,00011244 | igual |
| 4 | D_c | 2 850,320 m (+0,32 m sobre Dₕ) | igual |
| 5 | E₃ ; N₃ | 724 818,294 ; 7 704 974,775 | igual |
| | β − α, eq. (25) | +0,110″ | +0,11″ |
| | 2ª iteração | muda o ponto 3 em menos de 0,001 mm | < 0,1 mm |

m₂₃ vem da eq. (19) com os fatores exatos e é mostrado truncado na 8ª casa, como no slide.
Do ponto aproximado ao definitivo, o ponto 3 anda 2,3 cm.

Exemplo da UFPR (Delazari, 2022; ré 300 000 ; 7 180 000, estação 303 000 ; 7 178 000,
Dₑ = 2 500 m): os quatro pontos irradiados coincidem com os publicados a 0,3, 0,6, 0,2 e 0,3 mm.

O desenho da cena 2 exagera ψ (7° e 6° no lugar de 0,6″ e 0,5″), como avisa a nota na tela.

## Narração e som

Narração em português por síntese de voz (Gemini TTS, voz Charon), em `motion/voz/`; as cenas
sincronizam a animação com as palavras faladas (`kit.em`). Trilha da série a partir de 140 s,
abaixando sob a voz, e efeitos de `ferramentas/audio/sons/` (marimba a cada passo, toque em cada
célula do quadro, sino curto em cada ponto que confere com o publicado). Faixa final:
`motion/audio.mp3`, montada por `ferramentas/montar_audio.py`.

## Arquivos

```
python/gerar_dados.py   gera motion/v4-dados.json (Viçosa passo a passo e UFPR) e confere os números
motion/scenes.json      cenas, falas da narração, efeitos sonoros e tempos
motion/base.css         identidade visual (cópia de comum/base.css)
motion/shared.js        bloco comum da Aula 10 e, depois do marcador, a planta e o quadro de resultados (A10V4)
motion/scene-*.js       uma cena por arquivo
motion/voz/             narração: roteiro falado, uma fala por arquivo e os tempos das palavras
motion/audio.mp3        faixa final (narração, trilha e efeitos)
```

## Como reproduzir

```bash
python aula10_transporte_coordenadas/v04_problema_direto/python/gerar_dados.py
python ferramentas/montar_audio.py aula10_transporte_coordenadas/v04_problema_direto
python ferramentas/renderizar_mp4.py aula10_transporte_coordenadas/v04_problema_direto
```

Pré-visualização: `http://localhost:8000/ferramentas/preview/?v=aula10_transporte_coordenadas/v04_problema_direto`.
