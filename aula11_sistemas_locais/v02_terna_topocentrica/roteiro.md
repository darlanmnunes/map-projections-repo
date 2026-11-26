# V2. A terna topocêntrica: do geodésico ao geocêntrico e ao plano local

**Aula 11, slides 14 a 16 e 22.** Duração: cerca de 3 min, com narração.

## Ideia

É o passo mais abstrato da aula: sair de (φ, λ, h) para coordenadas geocêntricas (X, Y, Z), eq. (29), e daí para uma terna presa à origem O, com um eixo para leste, um para norte e um na normal, eq. (30) e (31). O globo em pseudo-3D mostra a translação até O e os dois giros da matriz T. O exemplo de P1 mostra que a terna preserva distância e azimute e que zL já sente a curvatura. O vídeo termina com a convergência dos meridianos no plano local, eq. (37).

## Cenas e narração

1. **Do elipsoide ao espaço.** Globo em pseudo-3D com eixos X, Y, Z e a origem O em Viçosa; eq. (29) e as coordenadas geocêntricas de O.
   - *No campo, o GNSS entrega latitude, longitude e altitude geométrica. Para chegar a um plano local, o primeiro passo é sair do elipsoide e ir para o espaço: as coordenadas geocêntricas X, Y e Z.*
   - *A origem fica no centro da Terra. O eixo Z aponta para o polo norte, o eixo X para o meridiano de Greenwich, no equador, e o eixo Y completa a terna, noventa graus a leste.*
   - *A equação vinte e nove faz a conversão, com o raio do primeiro vertical, N, e a altitude h. Para a origem do exemplo, em Viçosa, X dá cerca de quatro mil trezentos e setenta e dois quilômetros. Y e Z são negativos, porque o ponto fica a oeste de Greenwich e no hemisfério sul.*
2. **Uma terna presa à origem.** Terna leste-norte-normal em O; eixos X, Y, Z transladados do centro até O.
   - *Só que coordenadas geocêntricas são números de milhões de metros, em eixos que nada têm a ver com o terreno. O que queremos é uma terna presa à origem O: um eixo para leste, um para norte e um na normal ao elipsoide.*
   - *Essa é a terna topocêntrica. Primeiro, subtraímos as coordenadas da origem, e a terna passa a nascer em O. Falta girá-la.*
3. **Dois giros e a matriz T.** A terna gira em torno de Z (90° + λ0) e do novo X (90° − φ0) até leste, norte e normal; matriz T da eq. (31).
   - *A rotação é feita em dois giros, com a latitude e a longitude da origem.*
   - *No primeiro giro, em torno do eixo Z, de noventa graus mais lambda zero, o eixo X passa a apontar para leste.*
   - *No segundo giro, em torno desse novo eixo X, de noventa graus menos fi zero, o eixo Z deita até coincidir com a normal em O, e o eixo Y passa a apontar para o norte.*
   - *O produto dos dois giros é a matriz T, da equação trinta e um. Cada linha de T é um vetor unitário: leste, norte e normal. E T é ortogonal: para voltar, basta usar a transposta.*
4. **P1 na terna local.** Planta com xL e yL de P1; tabela eq. (30) × pyproj; perfil com a queda da superfície que faz zL = 11,745 m.
   - *Vamos a um ponto. P1 está a mil e oitocentos metros da origem, com azimute geodésico de trinta e cinco graus e altitude de setecentos e doze metros.*
   - *Pela equação trinta, x L dá mil e trinta e dois metros para leste, e y L, mil quatrocentos e setenta e cinco metros para norte. O pyproj dá o mesmo resultado.*
   - *A distância no plano é de mil e oitocentos metros e vinte centímetros, e o azimute continua sendo trinta e cinco graus.*
   - *E o z L? O ponto está doze metros acima da origem, mas z L dá onze metros e setenta e cinco centímetros. O quarto de metro que falta é a curvatura: a mil e oitocentos metros, a superfície já desceu abaixo do plano tangente.*
5. **Os meridianos convergem.** Plano local com meridianos convergindo para o sul; só no meridiano da origem YL é o norte geográfico; γL pela eq. (37).
   - *Último cuidado: a orientação. O eixo y L aponta para o norte geográfico só no meridiano da origem.*
   - *A leste ou a oeste, os meridianos convergem para o polo, e o norte geográfico se afasta do eixo y L. É a convergência no plano local, gama L: aproximadamente x L vezes a tangente de fi zero, dividido pelo raio médio.*
   - *Em Viçosa, são cerca de doze segundos por quilômetro. Na borda de um plano de trinta e cinco quilômetros, a dezessete quilômetros e meio da origem, chega a três minutos e meio. Por isso, o memorial deve dizer se o azimute é do plano ou geodésico.*

## Som

Trilha da série a partir de 300 s, abaixando sob a voz. Efeitos: papel na troca de cena; traço quando um eixo ou linha é desenhado; toque de madeira nos eixos da terna; kalimba na equação e na matriz; confirmação quando o resultado confere com o pyproj.
