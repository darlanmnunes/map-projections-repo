# V3. Uma família, três superfícies: cilindro, cone e plano

**Slides:** 8 e 9 (Construção das Projeções Conformes Normais)
**Duração:** 65 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** mostrar que Mercator, Lambert e estereográfica polar são o
mesmo modelo ρ = C·e^(−nψ), mudando só a constante n.

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 12 s | `motion/scene-cone.js` | Globo de lado, polo sul embaixo; cone tangente ao paralelo −30°; linha de contato; indicatrizes em −10°, −30°, −50° e −70° |
| 2 | 12 a 24 s | `motion/scene-desenrola.js` | O cone é cortado numa geratriz e desenrolado num setor de 180° (n = sen 30° = 0,5) |
| 3 | 24 a 40 s | `motion/scene-mercator.js` | n diminui até 0,01: o vértice vai ao infinito, o cone vira cilindro e o setor vira a Mercator |
| 4 | 40 a 55 s | `motion/scene-estereo.js` | n volta a 0,5 e cresce até 1: o cone se achata num plano tangente no polo sul; o setor fecha um disco |
| 5 | 55 a 65 s | `motion/scene-familia.js` | Os três mapas lado a lado; ρ = C·e^(−nψ) e m = nρ / (N cos φ) |

## Geometria

Esfera de raio 1 (como no slide 9), vértice do cone do lado do polo sul. Com
s = −φ e ψs = ln tan(45° + s/2):

- ρ = C e^(−n ψs), γ = n(λ − λ0), λ0 = −45°.
- Cone tangente ao paralelo s0: n = sen s0 e
  C = (cos s0 / n) e^(n ψs0) = (1 + sen s0) tan(45° + s0/2)^(n − 1) / n.
  A segunda forma é estável nos dois extremos: n → 0 dá n·C → 1 (C = a/n, Mercator) e
  n = 1 dá C = 2 (estereográfica polar).
- Fator de escala: m = n ρ / cos φ (na esfera, N = 1).
- O desenrolar da cena 2 é isométrico: o mapa é desenhado na superfície do cone
  (distância ao vértice = ρ, azimute = γ / n) e a constante do cone passa de n a 1 com o
  vértice fixo, até o setor ficar plano.
- Vista 3D: projeção ortográfica com a câmera 14° abaixo do Equador, para ver a face
  externa do cone e o plano tangente no polo sul. O corpo do cone é o fecho convexo da
  projeção do tronco, preenchido a 35 %.
- O roteiro diz que o vértice "sobe"; com o vértice do lado do polo sul (necessário para
  o cone tocar o paralelo −30°), ele se afasta para baixo, até sair da tela.

Conferência (saída de `python/gerar_dados.py`):

| | φ = −10° | −30° | −50° | −70° |
|---|---|---|---|---|
| Mercator, m = sec φ | 1,0154 | 1,1547 | 1,5557 | 2,9238 |
| Lambert (n = 0,5, C = 2,2795), m | 1,0601 | 1,0000 | 1,0697 | 1,3993 |
| Estereográfica (n = 1, C = 2), m | 1,7041 | 1,3333 | 1,1325 | 1,0311 |

## Arquivos

```
python/gerar_dados.py   gera motion/v3-dados.json (costa) e confere os números
motion/scenes.json      lista de cenas, durações, paleta e fontes
motion/base.css         identidade visual
motion/shared.js        família cônica, vista 3D (globo, cone, cilindro, plano) e mapas
motion/scene-*.js       uma cena por arquivo
motion/v3-dados.json    dados gerados
```

## Como reproduzir

```bash
python aula08_projecoes_conformes/v03_cilindro_cone_plano/python/gerar_dados.py
python ferramentas/renderizar_mp4.py aula08_projecoes_conformes/v03_cilindro_cone_plano
```
