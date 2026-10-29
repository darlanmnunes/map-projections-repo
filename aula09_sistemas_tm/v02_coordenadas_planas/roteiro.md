# Roteiro: V2. Coordenadas planas do fuso: origem, falso leste e falso norte

Slides: 10 (Origem, eixos e falsas coordenadas) e 11 (Um par (E, N) não basta)

Objetivo didático: mostrar que cada fuso UTM é um sistema plano-retangular próprio, com origem
no cruzamento do Equador com o meridiano central, e que o falso leste e o falso norte só
deslocam essa origem para que nenhuma coordenada seja negativa. Por isso um par (E, N) sozinho
não identifica um ponto: o fuso, o hemisfério e o referencial fazem parte da coordenada.

Duração: 62 s, sem narração.

## Cenas

- Cena 1 (0 a 18 s). Título "Cada fuso tem o seu próprio plano". Gráfico em x e y (km) da
  Transversa de Mercator (GRS80, λ₀ = −45°): as bordas do fuso 23 (−48° e −42°) e o MC são
  desenhados a partir do Equador até 80° S e 84° N; surgem os meridianos de 1° e os paralelos de
  8°. Ponto O no cruzamento do Equador com o MC; os eixos ficam laranja. Destacam-se a metade
  oeste (x < 0) e a metade sul (y < 0). No Equador, o fuso vai de −334 km a +334 km. Nota:
  escala horizontal 15× maior que a vertical.
- Cena 2 (18 a 38 s). Título "Falso leste e falso norte". A origem anda 500 km para oeste
  (seta "500 000 m") e os rótulos x viram E: E = 500 000 + 0,9996 x; no Equador o fuso vai de
  ≈ 166 km a ≈ 834 km. Depois a origem desce 10 000 km (seta "10 000 000 m") até o canto do
  gráfico, a falsa origem do Hemisfério Sul, e os rótulos y viram N:
  N = 10 000 000 + 0,9996 y (Sul) e N = 0,9996 y (Norte). Rótulos: 80° S, N ≈ 1 118 km;
  84° N, N ≈ 9 328 km. Por fim, um ponto sai de O até Viçosa enquanto E e N correm de
  (500 000; 10 000 000) até E = 722 120,59 m e N = 7 704 054,61 m.
- Cena 3 (38 a 53 s). Título "Um par (E, N) não basta". Mapa do Brasil com os fusos 18 a 25
  (limites cheios, MC tracejados). O mesmo (E, N) de Viçosa aparece primeiro no fuso 23 (laranja,
  com o Δλ = 2°08′ ao MC) e depois nos outros sete fusos, de oeste para leste. Texto: "Uma
  coordenada UTM sem o fuso não é coordenada".
- Cena 4 (53 a 62 s). Cartão final: "Forma completa: SIRGAS 2000 / UTM 23S (EPSG:31983);
  E = 722 120,59 m; N = 7 704 054,61 m". Aviso: em "23S" o S é o hemisfério (padrão EPSG); no
  MGRS, "S" é a banda de 32° N a 40° N, e Viçosa no MGRS é 23K.
