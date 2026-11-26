# V3. Do UTM ao plano topográfico local: rigoroso, similaridade e polar

**Aula 11, slides 26 a 29 e 31 a 35.** Duração: 217 s, com narração.

## Ideia

Mostrar as três mudanças entre a grade UTM e o plano local (origem, orientação e escala) e os três
caminhos de cálculo com o mesmo ponto P1 do exemplo de Viçosa: o método rigoroso como referência, a
similaridade 2D (parâmetros fixos na origem, erra 8 mm em P1) e o método polar (reduções da Aula 10
ponto a ponto, 0,6 mm). Fecha com o erro da similaridade em função da distância à origem.

## Cenas e narração

1. **O que muda.** Slide 26: translação (EO, NO), rotação γ0 = −0°44′50,20″, escala k = m0/FL = 1,0000864 e constantes (150 000; 250 000).
   - *O levantamento chegou em coordenadas UTM, mas a obra vai ser locada num plano topográfico local. Como passar de um sistema para o outro?*
   - *São três mudanças, e todas você já conhece. Primeiro, a origem: subtraímos as coordenadas UTM do ponto de origem, em Viçosa.*
   - *Depois, a orientação. No plano local, o eixo Y aponta para o norte geográfico; na grade, para o norte de quadrícula. A diferença é a convergência meridiana na origem: menos quarenta e quatro minutos e cinquenta segundos.*
   - *Por fim, a escala. Na origem, a grade estica as distâncias pelo fator combinado: oitenta e seis milímetros por quilômetro. No fim, somamos as constantes do plano, cento e cinquenta mil e duzentos e cinquenta mil metros.*
   - *Há três caminhos para fazer essas contas: o método rigoroso, a similaridade e o método polar.*
2. **Método rigoroso.** Slides 27 e 32: (E,N)→(φ,λ); (φ,λ,hL)→(X,Y,Z); T·Δ → xL, yL, zL = −0,255 m (descartado); + constantes → P1.
   - *O método rigoroso não faz nenhuma aproximação de plano. Vamos acompanhar o ponto P1, a mil e oitocentos metros da origem.*
   - *Primeiro passo: das coordenadas UTM para latitude e longitude, pelo problema inverso da projeção TM.*
   - *Segundo passo: latitude, longitude e altitude viram coordenadas geocêntricas X, Y e Z. Atenção: o ponto e a origem são levados à altitude do plano, setecentos metros.*
   - *Terceiro passo: a matriz de rotação T gira a diferença entre os dois vetores para a terna local. Saem x para leste, y para norte e z na normal.*
   - *O z vale menos vinte e cinco centímetros: é a queda da superfície abaixo do plano tangente. Ele é descartado, porque o plano local é só planimétrico.*
   - *Quarto passo: somamos as constantes. Estas são as coordenadas de P1 no plano local, e elas servem de referência para os outros dois métodos.*
3. **Similaridade 2D.** Slides 28 e 33: eq. (38) e (39); P1 girado de γ0 e dividido por k; erro de 8 mm.
   - *O primeiro atalho é a similaridade em duas dimensões. Ela aplica as três mudanças com valores fixos, calculados uma única vez na origem.*
   - *Tiramos a origem, giramos pela convergência e dividimos pelo fator combinado. É uma transformação de Helmert com parâmetros calculados, e não ajustados.*
   - *Em P1, o resultado erra oito milímetros. Por quê? Porque, longe da origem, o fator de escala e a convergência já não são os da origem.*
4. **Método polar.** Slides 29 e 33: S, AzC, De = S/mOP, DL = FL·De, AzG = AzC + ψ + γ0, eq. (41); erro de 0,6 mm.
   - *O segundo atalho é o método polar. Para cada ponto, usamos a distância e o azimute a partir da origem, com as reduções da aula dez.*
   - *A corda na grade é dividida pelo fator de escala da linha e volta a mil e oitocentos metros, no elipsoide. O fator de elevação leva essa distância ao plano.*
   - *O azimute da corda recebe a redução angular e a convergência na origem, e volta a trinta e cinco graus, o azimute geodésico.*
   - *Com distância e azimute, as coordenadas saem como na topografia. Em P1, o erro cai para seis décimos de milímetro.*
5. **Quanto vale.** Slides 34 e 35: erro da similaridade com a distância (3, 12, 71, 882 mm), polar ≈ 1 mm, esquecer γ0 = 23 m; qual método usar.
   - *Quanto vale cada escolha? A similaridade erra três milímetros a um quilômetro da origem, doze milímetros a dois quilômetros e setenta milímetros a cinco quilômetros.*
   - *Na borda do plano, a dezessete quilômetros e meio, o erro chega a quase noventa centímetros. Já o método polar fica em torno de um milímetro nos três pontos do exemplo.*
   - *E o erro mais grave é esquecer a convergência: só em P1, o ponto se desloca vinte e três metros.*
   - *Em resumo: a similaridade serve para um ou dois quilômetros em torno da origem. Acima disso, use o método rigoroso ou o método polar.*

## Som

Trilha da série a partir de 340 s, abaixando sob a voz. Efeitos discretos sincronizados com as palavras (traço, entrada, passo, tique, confere, realce).
