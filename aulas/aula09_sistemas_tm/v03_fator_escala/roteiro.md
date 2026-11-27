# Roteiro: V3. Fator de escala no fuso UTM e linhas de secância

Aula 09, slides 15, 16 e 17. Duração: 65 s. Sem narração; textos curtos na tela.
Complementa o V7 da Aula 08 (que mostrou o perfil de m no paralelo de Viçosa e o
cilindro que encolhe) com o corte do cilindro secante e o mapa do fuso 23.

## Cena 1 (0 a 20 s): corte perpendicular ao MC

- Título: "Fator de escala no fuso UTM"; subtítulo: "Cilindro secante: redução no centro,
  ampliação nas bordas"; nota "Corte perpendicular ao MC, fora de escala".
- O arco do elipsoide se desenha. O cilindro aparece tangente no MC e desce até a posição
  secante; os dois pontos de corte são as linhas de secância.
- Entre elas o cilindro passa por dentro do elipsoide (azul, "redução: m < 1"); fora delas,
  por fora (vermelho, "ampliação: m > 1").
- Rótulos: "MC: m = k₀ = 0,9996", "linha de secância, m = 1 (≈ 180 km do MC)",
  "borda do fuso (3° do MC), m ≈ 1,00098 no Equador".
- À direita, eq. (6) na esfera: m ≈ k₀ (1 + x²/2R²); dobrar x quadruplica a distorção.
- Três números entram em sequência: 0,9996 (meridiano central, −40 cm/km, 1/2 500),
  1,0000 (linhas de secância, ≈ 180 km do MC), 1,00098 (borda no Equador, +98 cm/km, ≈ 1/1 000).

## Cena 2 (20 a 46 s): linhas de secância no fuso 23

- Título: "Linhas de secância: onde m = 1". Mapa do fuso 23 (−48° a −42°, de 6° N a 62° S)
  em latitude e longitude, colorido pela distorção em mm/km (ppm): azul reduz, vermelho amplia.
- As linhas de secância se desenham de norte a sul e se abrem para o sul:
  sen Δλₛ = √(1 − k₀²)/cos φ. Cotas: Δλₛ = 1°36′55″ no Equador; Δλₛ = 3° em 57°19′ S, onde a
  linha encosta na borda do fuso.
- Morph para a grade (E, N): o fuso se estreita para o sul, e as linhas de secância ficam
  retas, a ≈ 180 km do MC (179,75 km no Equador; 180,61 km perto de 57° S):
  xₛ ≈ R √(2(1 − k₀)) ≈ 180 km.
- Isolinhas (−300, −200, +200, +400, +600, +800 ppm): faixas quase paralelas ao MC, porque m
  depende quase só de x. m < 1 numa faixa central de ≈ 360 km; m > 1 nas bordas.

## Cena 3 (46 a 65 s): Viçosa

- Título: "Viçosa: 222 km a leste do MC". O mapa fica na grade, com o campo esmaecido.
- Viçosa aparece com a cota de 222 km até o MC. À direita: E = 722 120,59 m,
  N = 7 704 054,61 m; m = 1,000210 (+210 mm/km).
- Duas barras de 1 km: 1 000,000 m no elipsoide e 1 000,210 m na grade; o detalhe das
  extremidades mostra a diferença de 21 cm.
- Fecho: entre 0,9996 no MC e 1,00098 na borda do fuso no Equador; em 80° S a borda fica em 0,99964.
