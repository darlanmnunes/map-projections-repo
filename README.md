# map-projections-repo

Repositório com os materiais e códigos da disciplina EAM 431, Projeções Cartográficas
(Engenharia de Agrimensura e Cartográfica, UFV). Prof. Darlan M. Nunes.

## Vídeos animados das aulas teóricas

Cada vídeo é uma animação em que tudo na tela é função do tempo e calculado pelas
equações das projeções (nenhuma curva desenhada à mão). O código de cada vídeo fica
numa pasta própria; os MP4 renderizados não são versionados.

| Aula | Pasta | Vídeos |
|---|---|---|
| 08. Projeções Conformes | [aula08_projecoes_conformes](aula08_projecoes_conformes/) | V1 a V5 prontos; V6 e V7 a fazer |

### Estrutura de um vídeo

```
aulaNN_tema/vNN_tema/
  README.md            objetivo, cenas, conferência dos números
  roteiro.md           roteiro original
  python/              geração de dados geométricos e conferência numérica
  motion/
    scenes.json        cenas, durações, paleta e fontes
    base.css           identidade visual
    shared.js          projeções e desenho comuns às cenas
    scene-<id>.js      uma cena por arquivo: init() monta, render(t) desenha o instante t
    *.json             dados gerados pelo Python
  export/              MP4 renderizado (ignorado pelo git)
```

### Identidade visual

Fundo branco; azul-marinho `#1F3864` (elementos principais e equações); laranja
`#E8711A` (destaques); azul `#0432FF` (títulos); cinza `#9A9A9A` (reticulado);
vermelho `#C0392B` a 55 % (indicatrizes de Tissot). Texto em Arimo (métrica do
Arial dos slides), equações em STIX Two Text. Nome do professor em todas as cenas ("Prof. Dr. Darlan M. Nunes" a partir do V5).

### Ferramentas

- `ferramentas/preview/index.html`: pré-visualização no navegador, com barra de tempo.
  Sirva a raiz do repositório e abra
  `http://localhost:8000/ferramentas/preview/?v=aula08_projecoes_conformes/v01_conforme_x_equivalente`.
- `ferramentas/renderizar_mp4.py`: renderiza o vídeo quadro a quadro (Chrome headless
  + ffmpeg) e grava `export/<vídeo>.mp4`.
- `ferramentas/empacotar_motion.py`: empacota a pasta `motion/` nos documentos do
  editor de animação usado para revisão.

```bash
python -m http.server 8000
python ferramentas/renderizar_mp4.py aula08_projecoes_conformes/v01_conforme_x_equivalente
```

Requisitos: Python 3.9+ com `numpy`, `scipy`, `shapely`, `pyogrio` e `pyproj` (só para gerar dados),
Google Chrome e ffmpeg.

## Licença

Ver [LICENSE](LICENSE).
