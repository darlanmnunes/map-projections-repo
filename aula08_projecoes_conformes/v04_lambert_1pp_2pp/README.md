# V4. Lambert com 1 e 2 paralelos padrão: do cone tangente ao secante

**Slides:** 11, 12 e 13 (Lambert 1 PP, 2 PP e exemplo em Viçosa)
**Duração:** 65 s · 1920 × 1080 · 30 fps · sem narração

**Objetivo didático:** explicar por que o cone secante distribui melhor a distorção e
de onde vem m = 0,94995 em Viçosa.

O roteiro completo está em [roteiro.md](roteiro.md).

## Cenas

| Cena | Tempo | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | 0 a 15 s | `motion/scene-tangente.js` | Globo e cone tangente em −24°; gráfico de m contra φ (norte à esquerda) com a curva de 1 PP |
| 2 | 15 a 32 s | `motion/scene-secante.js` | O cone afunda até cortar o globo em −5° e −42°; a curva desce (× 0,9485) e cruza m = 1 nos PP |
| 3 | 32 a 48 s | `motion/scene-vicosa.js` | Viçosa no globo e na curva: m = 0,94995, distâncias −5 %, áreas −9,8 % |
| 4 | 48 a 65 s | `motion/scene-mapa.js` | Mapa da Lambert (λ0 = −60°); meridiano de Viçosa e γ = n(λ − λ0) = −6,96° |

## Geometria

Lambert cônica conforme no GRS80 com os parâmetros ESRI:102015 do slide 13
(φ1 = −5°, φ2 = −42°, φ0 = −32°, λ0 = −60°), fórmulas de Snyder (1987) escritas para o
hemisfério sul pela simetria φ → −φ.

- O gráfico usa m(φ) da projeção com 2 PP. A curva de 1 PP é a mesma dividida pelo mínimo
  (0,94848, em φ = −23,96°): com o mesmo n, as duas curvas são proporcionais. Por isso,
  "afundar o cone" é multiplicar a curva por 0,9485.
- O mapa da cena 4 é a projeção completa (ρ = a F t^n); o ângulo γ é medido no próprio
  mapa, entre o meridiano de Viçosa e o norte da grade, e dá 6,959°.
- Vista 3D: esfera unitária, câmera 14° abaixo do Equador. O cone tangente tem
  semiângulo 24° e o secante, que passa exatamente por −5° e −42° na esfera, tem 23,5°.
  Na esfera essa diferença de 0,5° não aparece; os valores exatos estão no gráfico e no
  mapa, que usam o elipsoide.

Conferência (saída de `python/gerar_dados.py`):

| Grandeza | Valor |
|---|---|
| n | −0,406158 |
| m(−5°), m(−42°) | 1,000000 |
| mínimo de m | 0,94848 em φ = −23,964° |
| m em Viçosa (φ = −20°45′) | 0,94995 |
| σ = m² | 0,90241 |
| distâncias / áreas | −5,0 % / −9,8 % |
| γ = n(λ − λ0), λ = −42°52′ | −6,959° |

## Arquivos

```
python/gerar_dados.py   gera motion/v4-dados.json (curva m, costa) e confere os números
motion/scenes.json      lista de cenas, durações, paleta e fontes
motion/base.css         identidade visual
motion/shared.js        vista 3D (globo e cone), gráfico de m e Lambert no GRS80
motion/scene-*.js       uma cena por arquivo
motion/v4-dados.json    dados gerados
```

## Como reproduzir

```bash
python aula08_projecoes_conformes/v04_lambert_1pp_2pp/python/gerar_dados.py
python ferramentas/renderizar_mp4.py aula08_projecoes_conformes/v04_lambert_1pp_2pp
```

O script Python usa também `scipy` (para achar o mínimo de m).
