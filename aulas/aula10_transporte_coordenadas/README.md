# Aula 10: Transporte de coordenadas no sistema UTM (problemas direto e inverso)

Vídeos animados e narrados para a aula 10 de EAM 431
(`EAM431_aula10_20262_Transporte_Coordenadas_UTM`). O conteúdo segue a nota de aula e as notas
de aula da UFPR que servem de referência (Delazari, 2022, *Transporte de coordenadas UTM* e
*Projeção TM e UTM*), com o mesmo exemplo resolvido de Viçosa e a conferência com o exemplo
publicado pela UFPR (programa TRANSPUTM).

| Vídeo | Tema | Slides | Duração | Situação |
|---|---|---|---|---|
| [V1](v01_terreno_grade/) | Do terreno à grade: por que transportar coordenadas | 3 e 5 | 2 min 47 s | pronto |
| [V2](v02_reducoes_lineares/) | Reduções lineares: Fₕ, m₁₂ e o fator combinado | 6 a 8 | 2 min 31 s | pronto |
| [V3](v03_geodesica_corda_psi/) | Geodésica projetada, corda e a redução angular ψ | 9 e 10 | 2 min 08 s | pronto |
| [V4](v04_problema_direto/) | Problema direto, passo a passo (Viçosa e UFPR) | 12, 14, 16, 17 e 20 | 2 min 37 s | pronto |
| [V5](v05_problema_inverso/) | Problema inverso, contra-azimute e os três arcos da UFPR | 11, 15 e 18 | 2 min 47 s | pronto |
| [V6](v06_quanto_vale/) | Quanto vale cada correção e quando simplificar | 19, 22 e 23 | 2 min 20 s | pronto |

## O que há de diferente nesta aula

- **Narração.** Os vídeos são narrados em português (voz sintetizada; ver
  [CREDITOS.md](../ferramentas/audio/CREDITOS.md)). O texto falado de cada vídeo está em
  `motion/voz/narracao.json` e, por cena, no `roteiro.md`. As animações são sincronizadas com as
  palavras: `voz/falas.json` guarda o instante de cada palavra, e as cenas usam
  `kit.em('fala', 'palavra')` para disparar cada elemento.
- **Som.** A faixa de cada vídeo (`motion/audio.mp3`) junta a narração, a trilha da série
  abaixando sob a voz e efeitos discretos sincronizados com as palavras; é montada por
  `ferramentas/montar_audio.py` a partir de `scenes.json` (`falas`, `sons`, `trilha.inicio`).
- **Um só cálculo.** [`comum/transporte.py`](comum/transporte.py) implementa as equações (18) a
  (28) da nota de aula e os roteiros dos problemas direto e inverso. Todos os números que aparecem
  nos vídeos saem dele. Executado diretamente, confere o exemplo de Viçosa (slides 16 a 18) e os
  quatro pontos do exemplo da UFPR (slide 20):

  ```bash
  python aulas/aula10_transporte_coordenadas/comum/transporte.py
  ```

- **Bloco comum.** [`comum/a10.js`](comum/a10.js) (formatação de ângulos e números, setas, arcos,
  entradas de texto) e [`comum/base.css`](comum/base.css) são copiados para cada vídeo por
  `comum/atualizar_comum.py`, porque o player carrega um único `shared.js` e um único `base.css`
  por vídeo.

## Como reproduzir um vídeo

```bash
python aulas/aula10_transporte_coordenadas/<vídeo>/python/gerar_dados.py     # dados e conferência
python ferramentas/montar_audio.py aulas/aula10_transporte_coordenadas/<vídeo>  # tempos das cenas e faixa de áudio
python ferramentas/renderizar_mp4.py aulas/aula10_transporte_coordenadas/<vídeo>
```
