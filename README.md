# Projeções Cartográficas em movimento

**Animações didáticas e códigos da disciplina EAM 431, Projeções Cartográficas**
Curso de Engenharia de Agrimensura e Cartográfica · Universidade Federal de Viçosa (UFV)
Prof. Dr. Darlan M. Nunes

**▶ Assista no navegador: [darlanmnunes.github.io/map-projections-repo](https://darlanmnunes.github.io/map-projections-repo/)**

---

## Sobre

Este repositório reúne os vídeos animados curtos usados nas aulas teóricas de EAM 431.
Cada vídeo dura de 50 s a 75 s e foi feito para entrar num slide e mostrar, em movimento,
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
| [V1](aula08_projecoes_conformes/v01_conforme_x_equivalente/) | Conforme × equivalente: o que acontece com um círculo infinitesimal | 3 e 4 | 50 s |
| [V2](aula08_projecoes_conformes/v02_latitude_isometrica/) | Latitude isométrica: do retângulo ao quadrado | 5 | 55 s |
| [V3](aula08_projecoes_conformes/v03_cilindro_cone_plano/) | Uma família, três superfícies: cilindro, cone e plano | 8 e 9 | 65 s |
| [V4](aula08_projecoes_conformes/v04_lambert_1pp_2pp/) | Lambert com 1 e 2 paralelos padrão: do cone tangente ao secante | 11 a 13 | 65 s |
| [V5](aula08_projecoes_conformes/v05_loxodromia_ortodromia/) | Loxodromia × ortodromia: São Paulo → Joanesburgo | 17 e 18 | 60 s |
| [V6](aula08_projecoes_conformes/v06_estereografica_ups/) | Estereográfica: perspectiva do antípoda e o plano secante do UPS | 20 e 21 | 60 s |
| [V7](aula08_projecoes_conformes/v07_mercator_tm_utm/) | Da Mercator à Transversa de Mercator e ao UTM | 22 a 24 | 72 s |

### Aula 09 · Sistemas de Projeção Transversa de Mercator (TM, UTM, RTM e LTM)

| Vídeo | Tema | Slides | Duração |
|---|---|---|---|
| [V1](aula09_sistemas_tm/v01_fusos_utm/) | 60 fusos: do globo ao fuso de Viçosa | 7 a 13 | 62 s |
| [V2](aula09_sistemas_tm/v02_coordenadas_planas/) | Coordenadas planas do fuso: origem, falso leste e falso norte | 10 e 11 | 62 s |
| [V3](aula09_sistemas_tm/v03_fator_escala/) | Fator de escala no fuso UTM e linhas de secância | 15 a 17 | 65 s |
| [V4](aula09_sistemas_tm/v04_convergencia_meridiana/) | Convergência meridiana: norte de quadrícula × norte geográfico | 19 e 20 | 66 s |
| [V5](aula09_sistemas_tm/v05_utm_rtm_ltm/) | UTM, RTM e LTM: a mesma TM com outros parâmetros | 24 a 27 | 65 s |

Cada pasta tem um README com o objetivo didático, as cenas, as equações usadas e a tabela
de conferência dos números. Os MP4 finais ficam no Google Drive da disciplina; o
repositório guarda só o código que os gera.

## Galeria no navegador

A galeria está publicada em
**https://darlanmnunes.github.io/map-projections-repo/**.

O arquivo [index.html](index.html) é uma galeria com os vídeos, organizada por aula (com
atalhos no topo): cada cartão mostra uma miniatura desenhada ao vivo e abre o vídeo no
player, com barra de tempo, reprodução e pausa (barra de espaço) e a trilha sonora, que pode
ser desligada. Nada é pré-renderizado: o navegador executa o código das cenas e
lê os dados JSON de cada vídeo.

O workflow [.github/workflows/pages.yml](.github/workflows/pages.yml) publica a galeria no
GitHub Pages a cada push em `main` (pasta `_site` com `index.html`, `ferramentas/` e as
pastas das aulas, sem scripts Python nem MP4). Um vídeo novo entra na galeria quando é
acrescentado à lista `AULAS` do `index.html` (uma aula nova é um item novo da lista).

## Estrutura do repositório

```
aula08_projecoes_conformes/      uma pasta por aula (aula09_sistemas_tm/, ...)
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
  renderizar_mp4.py              renderização quadro a quadro em MP4, com a trilha mixada
  empacotar_motion.py            empacota a pasta motion/ para o editor de revisão
```

## Como reproduzir

Requisitos: Python 3.9 ou mais recente com `numpy`, `scipy`, `shapely`, `pyogrio` e
`pyproj` (para gerar os dados), além de Google Chrome e ffmpeg (para o MP4).

1. Gerar os dados e conferir os números de um vídeo:

   ```bash
   python aula08_projecoes_conformes/v07_mercator_tm_utm/python/gerar_dados.py
   ```

2. Pré-visualizar no navegador, a partir da raiz do repositório:

   ```bash
   python -m http.server 8000
   ```

   e abrir `http://localhost:8000/` (galeria) ou
   `http://localhost:8000/ferramentas/preview/?v=aula08_projecoes_conformes/v07_mercator_tm_utm`.

3. Renderizar o MP4 (1920 × 1080, 30 fps, com a trilha; `--sem-som` para vídeo mudo), gravado em `export/`:

   ```bash
   python ferramentas/renderizar_mp4.py aula08_projecoes_conformes/v07_mercator_tm_utm
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

## Autor

Prof. Dr. Darlan M. Nunes, Departamento de Engenharia Civil, Setor de Engenharia de
Agrimensura e Cartográfica, Universidade Federal de Viçosa.

## Licença

Código sob a licença MIT; veja [LICENSE](LICENSE).
