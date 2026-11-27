<p align="center">
  <img src="ferramentas/identidade/logos/eam_selo.png" alt="Selo da Engenharia de Agrimensura e Cartográfica da UFV" width="96">
</p>

<h1 align="center">Projeções Cartográficas em movimento</h1>

<p align="center">
  <b>EAM 431, Projeções Cartográficas | Engenharia de Agrimensura e Cartográfica | UFV</b><br>
  Animações e vídeos narrados das aulas teóricas, desenhados a partir das equações das projeções.<br>
  Prof. Dr. Darlan Miranda Nunes
</p>

<p align="center">
  <a href="https://darlanmnunes.github.io/map-projections-repo/"><b>Assistir no navegador</b></a> |
  <a href="#conteúdo">Vídeos por aula</a> |
  <a href="#como-citar">Como citar</a> |
  <a href="https://github.com/darlanmnunes/map-projections-repo/releases">Versões</a>
</p>

<p align="center">
  <a href="https://github.com/darlanmnunes/map-projections-repo/releases/latest"><img alt="Versão" src="https://img.shields.io/github/v/release/darlanmnunes/map-projections-repo?label=vers%C3%A3o&color=1F3864"></a>
  <a href="https://darlanmnunes.github.io/map-projections-repo/"><img alt="Site no ar" src="https://img.shields.io/website?url=https%3A%2F%2Fdarlanmnunes.github.io%2Fmap-projections-repo%2F&label=galeria&up_message=no%20ar&up_color=8C1A1D"></a>
  <img alt="4 aulas, 21 vídeos" src="https://img.shields.io/badge/v%C3%ADdeos-4%20aulas%20%7C%2021%20v%C3%ADdeos-C9A227">
  <img alt="Licenças: MIT (código) e CC BY-NC 4.0 (conteúdo)" src="https://img.shields.io/badge/licen%C3%A7as-MIT%20%2B%20CC%20BY--NC%204.0-56607A">
</p>

---

## Sobre

Este repositório reúne os vídeos animados usados nas aulas teóricas de EAM 431.
Os vídeos das aulas 08 e 09 duram de 50 s a 75 s; os das aulas 10 e 11, narrados, de 2 a 4 min. Cada um
foi feito para entrar num slide ou acompanhar a aula e mostrar, em movimento,
uma ideia que é difícil de ver numa figura parada: um cilindro que gira até virar a
Transversa de Mercator, um cone que se desenrola num setor, um círculo da esfera que
continua círculo no plano.

Três princípios guiam todos os vídeos:

- **Geometria exata.** Toda curva, reticulado e indicatriz na tela é calculada pelas
  equações da projeção (esfera ou elipsoide GRS80), nunca desenhada à mão. O globo 3D é
  uma projeção ortográfica calculada, com descarte do hemisfério oculto.
- **Números conferidos.** Cada vídeo tem um script Python que recalcula, com `pyproj` e
  `numpy`, todos os valores que aparecem na tela e os compara com os slides.
- **Reprodutível.** O vídeo é código: qualquer instante é uma função do tempo, e o MP4 é
  gerado quadro a quadro a partir do repositório.

## Conteúdo

### Aula 08 · Projeções Conformes

| Vídeo | Tema | Slides | Duração |
|---|---|---|---|
| [V1](aulas/aula08_projecoes_conformes/v01_conforme_x_equivalente/) | Conforme × equivalente: o que acontece com um círculo infinitesimal | 3 e 4 | 50 s |
| [V2](aulas/aula08_projecoes_conformes/v02_latitude_isometrica/) | Latitude isométrica: do retângulo ao quadrado | 5 | 55 s |
| [V3](aulas/aula08_projecoes_conformes/v03_cilindro_cone_plano/) | Uma família, três superfícies: cilindro, cone e plano | 8 e 9 | 65 s |
| [V4](aulas/aula08_projecoes_conformes/v04_lambert_1pp_2pp/) | Lambert com 1 e 2 paralelos padrão: do cone tangente ao secante | 11 a 13 | 65 s |
| [V5](aulas/aula08_projecoes_conformes/v05_loxodromia_ortodromia/) | Loxodromia × ortodromia: São Paulo → Joanesburgo | 17 e 18 | 60 s |
| [V6](aulas/aula08_projecoes_conformes/v06_estereografica_ups/) | Estereográfica: perspectiva do antípoda e o plano secante do UPS | 20 e 21 | 60 s |
| [V7](aulas/aula08_projecoes_conformes/v07_mercator_tm_utm/) | Da Mercator à Transversa de Mercator e ao UTM | 22 a 24 | 72 s |

### Aula 09 · Sistemas de Projeção Transversa de Mercator (TM, UTM, RTM e LTM)

| Vídeo | Tema | Slides | Duração |
|---|---|---|---|
| [V1](aulas/aula09_sistemas_tm/v01_fusos_utm/) | 60 fusos: do globo ao fuso de Viçosa | 7 a 13 | 62 s |
| [V2](aulas/aula09_sistemas_tm/v02_coordenadas_planas/) | Coordenadas planas do fuso: origem, falso leste e falso norte | 10 e 11 | 62 s |
| [V3](aulas/aula09_sistemas_tm/v03_fator_escala/) | Fator de escala no fuso UTM e linhas de secância | 15 a 17 | 65 s |
| [V4](aulas/aula09_sistemas_tm/v04_convergencia_meridiana/) | Convergência meridiana: norte de quadrícula × norte geográfico | 19 e 20 | 66 s |
| [V5](aulas/aula09_sistemas_tm/v05_utm_rtm_ltm/) | UTM, RTM e LTM: a mesma TM com outros parâmetros | 24 a 27 | 65 s |

### Aula 10 · Transporte de coordenadas UTM (problemas direto e inverso) · vídeos narrados

| Vídeo | Tema | Slides | Duração |
|---|---|---|---|
| [V1](aulas/aula10_transporte_coordenadas/v01_terreno_grade/) | Do terreno à grade: por que transportar coordenadas | 3 e 5 | 2 min 47 s |
| [V2](aulas/aula10_transporte_coordenadas/v02_reducoes_lineares/) | Reduções lineares: Fₕ, m₁₂ e o fator combinado | 6 a 8 | 2 min 31 s |
| [V3](aulas/aula10_transporte_coordenadas/v03_geodesica_corda_psi/) | Geodésica projetada, corda e a redução angular ψ | 9 e 10 | 2 min 08 s |
| [V4](aulas/aula10_transporte_coordenadas/v04_problema_direto/) | Problema direto, passo a passo (Viçosa e UFPR) | 12, 14, 16, 17 e 20 | 2 min 37 s |
| [V5](aulas/aula10_transporte_coordenadas/v05_problema_inverso/) | Problema inverso, contra-azimute e os três arcos da UFPR | 11, 15 e 18 | 2 min 47 s |
| [V6](aulas/aula10_transporte_coordenadas/v06_quanto_vale/) | Quanto vale cada correção e quando simplificar | 19, 22 e 23 | 2 min 20 s |

### Aula 11 · Sistemas de coordenadas locais · vídeos narrados

| Vídeo | Tema | Slides | Duração |
|---|---|---|---|
| [V1](aulas/aula11_sistemas_locais/v01_por_que_plano_local/) | Por que coordenadas locais e até onde vale o plano | 3 a 5, 7 e 17 a 20 | 3 min 14 s |
| [V2](aulas/aula11_sistemas_locais/v02_terna_topocentrica/) | Do geocêntrico ao topocêntrico: a matriz T | 14 a 16 e 22 | 3 min 53 s |
| [V3](aulas/aula11_sistemas_locais/v03_utm_para_plano_local/) | Do UTM ao plano local: rigoroso, similaridade e polar | 26 a 29 e 31 a 35 | 3 min 37 s |

Cada pasta tem um README com o objetivo didático, as cenas, as equações usadas e a tabela
de conferência dos números. Os MP4 finais ficam no Google Drive da disciplina; o
repositório guarda só o código que os gera.

## Galeria no navegador

A galeria está publicada em
**https://darlanmnunes.github.io/map-projections-repo/**.

O arquivo [index.html](index.html) é uma galeria com os vídeos, organizada por aula: cada aula é
um menu que se expande com todos os seus vídeos (a mais recente abre aberta, e um link como
`#aula11` abre a aula correspondente); cada cartão mostra uma miniatura desenhada ao vivo e abre o vídeo no
player, com barra de tempo, reprodução e pausa (barra de espaço) e a trilha sonora, que pode
ser desligada. Nada é pré-renderizado: o navegador executa o código das cenas e
lê os dados JSON de cada vídeo.

O workflow [.github/workflows/pages.yml](.github/workflows/pages.yml) publica a galeria no
GitHub Pages a cada push em `main` (pasta `_site` com `index.html`, `ferramentas/` e as
pastas das aulas, sem scripts Python nem MP4). Um vídeo novo entra na galeria quando é
acrescentado à lista `AULAS` do `index.html` (uma aula nova é um item novo da lista).

## Estrutura do repositório

```
aulas/aula08_projecoes_conformes/      uma pasta por aula (aulas/aula09_sistemas_tm/, ...)
  README.md                      lista dos vídeos da aula
  v01_conforme_x_equivalente/    uma pasta por vídeo
    README.md                    objetivo, cenas, geometria e conferência dos números
    roteiro.md                   roteiro original do vídeo
    python/gerar_dados.py        dados geométricos (linhas de costa, curvas) e conferência
    motion/
      scenes.json                cenas, durações, paleta, fontes e início do trecho da trilha
      base.css                   identidade visual
      shared.js                  projeções e desenho comuns às cenas
      scene-<id>.js              uma cena por arquivo: init() monta, render(t) desenha o instante t
      v1-dados.json              dados gerados pelo Python
    export/                      MP4 renderizado (fora do controle de versão)
index.html                       galeria dos vídeos (página inicial do GitHub Pages)
.github/workflows/pages.yml      publicação da galeria no GitHub Pages
ferramentas/
  preview/index.html             player no navegador, com barra de tempo e som
  identidade/moldura.css         moldura comum a todos os vídeos (identidade dos slides)
  audio/trilha_eam431.mp3        trilha da série (CC0; ver audio/CREDITOS.md)
  audio/sons/                    efeitos sonoros curtos (Aula 10 em diante)
  montar_audio.py                faixa dos vídeos narrados: narração, trilha e efeitos
  renderizar_mp4.py              renderização quadro a quadro em MP4, com a trilha mixada
  empacotar_motion.py            empacota a pasta motion/ para o editor de revisão
```

## Como reproduzir

Requisitos: Python 3.9 ou mais recente com `numpy`, `scipy`, `shapely`, `pyogrio` e
`pyproj` (para gerar os dados), além de Google Chrome e ffmpeg (para o MP4).

1. Gerar os dados e conferir os números de um vídeo:

   ```bash
   python aulas/aula08_projecoes_conformes/v07_mercator_tm_utm/python/gerar_dados.py
   ```

2. Pré-visualizar no navegador, a partir da raiz do repositório:

   ```bash
   python -m http.server 8000
   ```

   e abrir `http://localhost:8000/` (galeria) ou
   `http://localhost:8000/ferramentas/preview/?v=aulas/aula08_projecoes_conformes/v07_mercator_tm_utm`.

3. Renderizar o MP4 (1920 × 1080, 30 fps, com a trilha; `--sem-som` para vídeo mudo), gravado em `export/`:

   ```bash
   python ferramentas/renderizar_mp4.py aulas/aula08_projecoes_conformes/v07_mercator_tm_utm
   ```

As linhas de costa e os limites vêm do Natural Earth 1:110m e 1:50m (domínio público).

## Identidade visual e som

Todo vídeo leva a moldura dos slides da disciplina, desenhada pelo player por cima das cenas
(`ferramentas/identidade/moldura.css`): no canto superior esquerdo, três traços nas cores da
UFV (azul-marinho `#1F3864`, vermelho `#8C1A1D` e dourado `#C9A227`); no canto superior
direito, "EAM 431 | Projeções Cartográficas | 2026" e, abaixo, "Prof. Dr. Darlan M. Nunes".
Dentro das cenas: fundo branco, azul-marinho
`#1F3864` para elementos principais e equações, laranja `#E8711A` para destaques, azul
`#0432FF` para títulos, cinza `#9A9A9A` para meridianos e paralelos e vermelho `#C0392B` a
55 % para as indicatrizes de Tissot. Texto em Arimo (mesma métrica do Arial dos slides) e
equações em STIX Two Text. Notação da disciplina: φ, λ, λ₀, ψ, m, σ, ϖ, k₀, ρ e γ; "sen"
em vez de "sin"; x para leste e y para norte.

A trilha é uma só para a série, um ambiente sóbrio de piano e guitarra sem sons de natureza
("Ambient Piano Guitar Texture E", deadrobotmusic, Freesound, CC0); cada vídeo usa um trecho
diferente. Detalhes em [ferramentas/audio/CREDITOS.md](ferramentas/audio/CREDITOS.md).

## Como citar

Se usar estes vídeos ou o código, cite o repositório. Os metadados estão em
[CITATION.cff](CITATION.cff) (o GitHub mostra a citação pronta em "Cite this repository"):

> NUNES, D. M. **Projeções Cartográficas em movimento**: animações e vídeos narrados da disciplina
> EAM 431, Projeções Cartográficas (UFV). Versão 1.0.0. Viçosa: Universidade Federal de Viçosa, 2026.
> Disponível em: https://github.com/darlanmnunes/map-projections-repo.

O DOI do Zenodo será indicado aqui assim que a versão 1.0.0 for arquivada.

## Autor

Prof. Dr. Darlan Miranda Nunes ([ORCID 0000-0001-5566-7919](https://orcid.org/0000-0001-5566-7919)),
Departamento de Engenharia Civil, Setor de Engenharia de Agrimensura e Cartográfica,
Universidade Federal de Viçosa.

## Licença

- **Código** (Python, JavaScript, CSS e HTML, inclusive `ferramentas/` e as pastas `python/` e
  `motion/` de cada vídeo): licença MIT, em [LICENSE](LICENSE).
- **Conteúdo didático** (os vídeos, roteiros, textos das narrações, faixas de áudio e READMEs das
  aulas): [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.pt-br), em
  [LICENSE-CONTEUDO](LICENSE-CONTEUDO), a mesma licença dos slides da disciplina.
- **Fora das licenças**: os logotipos da UFV e da Engenharia de Agrimensura e Cartográfica
  (`ferramentas/identidade/logos/`, uso restrito à identificação institucional), a trilha
  (CC0, de deadrobotmusic) e os contornos do Natural Earth (domínio público).

Detalhes em [NOTICE](NOTICE).
