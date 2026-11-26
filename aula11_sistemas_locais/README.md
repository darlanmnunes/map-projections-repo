# Aula 11: Sistemas de coordenadas locais

Vídeos animados e narrados para a aula 11 de EAM 431
(`EAM431_aula11_20262_Sistemas_Coordenadas_Locais`). São três vídeos mais longos, sobre os pontos
mais difíceis da aula: por que sair da grade UTM, a rotação do geocêntrico para o topocêntrico e a
conversão do UTM para o plano topográfico local. Os números seguem o exemplo resolvido de Viçosa
(origem φ₀ = −20°44′10″, λ₀ = −42°53′25″, h₀ = 700 m) e são recalculados com o pyproj (GRS80).

| Vídeo | Tema | Slides | Duração |
|---|---|---|---|
| [V1](v01_por_que_plano_local/) | Por que coordenadas locais e até onde vale o plano | 3 a 5, 7 e 17 a 20 | 3 min 14 s |
| [V2](v02_terna_topocentrica/) | Do geocêntrico ao topocêntrico: a matriz T | 14 a 16 e 22 | 3 min 53 s |
| [V3](v03_utm_para_plano_local/) | Do UTM ao plano local: rigoroso, similaridade e polar | 26 a 29 e 31 a 35 | 3 min 37 s |

A narração e a trilha seguem o mesmo processo da Aula 10 (ver
[../aula10_transporte_coordenadas/README.md](../aula10_transporte_coordenadas/README.md) e
[../ferramentas/narracao/](../ferramentas/narracao/)). O bloco comum (`comum/a11.js` e `comum/base.css`)
é copiado para cada vídeo por `comum/atualizar_comum.py`.

## Como reproduzir um vídeo

```bash
python aula11_sistemas_locais/<vídeo>/python/gerar_dados.py
python ferramentas/montar_audio.py aula11_sistemas_locais/<vídeo>
python ferramentas/renderizar_mp4.py aula11_sistemas_locais/<vídeo>
```
