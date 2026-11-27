# V1. Por que coordenadas locais: a grade, as três famílias e o plano topográfico

**Aula 11, slides 3 a 5, 7 e 17 a 20.** Duração: 194 s, com narração.

## Ideia

Partir do problema de obra em Viçosa: o projeto na grade UTM e a locação com a estação total
não têm a mesma escala, e o erro é (k − 1)·L. Trocar de projeção (RTM, LTM) não resolve, porque
a altitude pesa. Daí as três famílias de sistemas locais (SGL, STL e projeções locais), o plano
topográfico tangente em O e elevado à altitude média (fator de elevação F_L) e os limites do plano
(NBR 13133:2021: 35 km de diagonal e 150 m de desnível), em que a altitude pesa mais que a curvatura.

## Cenas e narração

1. **Projeto na grade, obra no terreno.** Linha de 1 km no terreno e na grade UTM; erro (k − 1)·L; k − 1 de UTM, RTM, LTM, TM municipal e plano local em Viçosa.
   - *Imagine um loteamento em Viçosa. O projeto foi desenhado na grade UTM, e a obra vai ser locada com a estação total, que mede distâncias no terreno.*
   - *Na Aula dez vimos que a grade não tem a escala do terreno. Aqui, juntando a projeção e a altitude, a grade UTM estica cada quilômetro em oitenta e seis milímetros.*
   - *Se o projeto está na grade e a medida está no terreno, cada distância erra k menos um vezes o comprimento. Numa quadra de cem metros, quase nove milímetros; num alinhamento de dois quilômetros, dezessete centímetros.*
   - *E não basta trocar de projeção. A RTM e a LTM têm escala quase igual a um no elipsoide, mas a setecentos metros de altitude ainda sobram cerca de cem milímetros por quilômetro, para menos. Só zera quem compensa a altitude: o plano topográfico local e uma transversa de Mercator municipal.*
2. **Três famílias.** Cartões do SGL (z na normal), STL (z na vertical) e projeções locais (TM com MC na cidade).
   - *Por isso existem os sistemas locais. São três famílias, e o que muda entre elas é a superfície onde as coordenadas são calculadas.*
   - *No sistema geodésico local, o plano é tangente ao elipsoide na origem, e o eixo z segue a normal. É o sistema que o INCRA usa para calcular a área dos imóveis rurais.*
   - *No sistema topográfico local, o plano é o mesmo, mas o eixo z segue a vertical, o fio de prumo. É o plano da estação total nivelada.*
   - *E as projeções locais são transversas de Mercator com outros parâmetros: o meridiano central na cidade e o fator de escala ajustado à altitude.*
3. **O plano topográfico local.** Corte: elipsoide, plano tangente em O elevado a hL = 700 m, terreno; fator de elevação FL; planta com (150 000; 250 000).
   - *Vamos olhar o plano topográfico de perto. Ele é tangente na origem, mas não fica no nível do elipsoide: fica elevado à altitude média do terreno.*
   - *Assim, a distância calculada no plano é igual à medida no campo. O fator de elevação é o raio médio mais a altitude, dividido pelo raio médio. A setecentos metros, ele acrescenta cento e dez milímetros por quilômetro: é o inverso do fator de altitude da Aula dez.*
   - *A origem recebe as coordenadas cento e cinquenta mil e duzentos e cinquenta mil metros, para que todos os pontos do levantamento fiquem positivos.*
4. **Até onde vale o plano.** Corte com a superfície caindo abaixo do plano; tabela s − d e zL; NBR 13133:2021 (35 km, 150 m); faixa de altitude com o plano no meio (11,8 mm/km).
   - *Mas um plano não acompanha a curvatura. Longe da origem, a superfície cai abaixo do plano, e essa queda cresce com o quadrado da distância. A dezessete quilômetros e meio, são vinte e quatro metros.*
   - *Na planimetria o efeito é bem menor e cresce com o cubo: a diferença entre o arco e a sua projeção no plano é de só vinte e dois milímetros, na mesma distância.*
   - *Por isso a norma de levantamentos topográficos limita o plano a trinta e cinco quilômetros de diagonal e a cento e cinquenta metros entre o ponto mais alto e o mais baixo.*
   - *E quem pesa é a altitude. Com o plano na altitude média, o pior ponto fica a setenta e cinco metros dele, e a distância erra quase doze milímetros por quilômetro. No próximo vídeo, vamos ver como se calculam essas coordenadas.*

## Som

Trilha da série a partir de 260 s, abaixando sob a voz. Efeitos discretos sincronizados com as
palavras: traço nas linhas, entrada nos cartões e tabelas, toque nos valores, confirmação nos resultados.
