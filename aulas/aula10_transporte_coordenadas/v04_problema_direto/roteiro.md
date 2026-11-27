# V4. Problema direto, passo a passo

**Aula 10, slides 12, 14, 16, 17 e 20; notas da UFPR (Delazari, 2022), slides 9 a 13 e 18 a 22.**
Duração: 157 s, com narração.

## Ideia

O roteiro do slide 14 aplicado ao exemplo de Viçosa, um passo por vez, com o quadro de
resultados do slide 17 se preenchendo ao lado. Os pontos que mais confundem os alunos ganham
destaque: α está entre as tangentes (por isso ψ₂₁ entra antes de α), γ não entra quando a ré tem
coordenadas UTM, e o ponto 3 é primeiro aproximado porque ψ₂₃ e m₂₃ dependem dele. A conferência
com o exemplo publicado da UFPR fecha o vídeo.

## Cenas e narração

1. **Os dados.** Planta na grade UTM 23S e o quadro do slide 16.
   - *Vamos resolver o problema direto com o exemplo da aula. Em Viçosa, a estação total está no
     ponto dois, de coordenadas UTM conhecidas. Ela visa a ré, o ponto um, também conhecido.*
   - *Da ré até o ponto novo, mede o ângulo horário α, de cento e dezoito graus, vinte e quatro
     minutos e trinta e seis segundos. E mede a distância horizontal: dois mil oitocentos e
     cinquenta metros.*
   - *A altitude média da linha é de seiscentos e sessenta e oito metros. Queremos E e N do ponto
     três.*
2. **Passo 1.** Zoom na estação 2 (ψ exagerado): corda 2→1, ψ₂₁, tangente da ré, α, tangente da
   vante; Az_Q,21 = Az_C,21 + ψ₂₁ e Az_Q,23 = Az_Q,21 + α; selo “γ não entra”.
   - *Passo um. Das coordenadas de um e de dois, sai o azimute da corda de dois para um.*
   - *Mas o ângulo α foi medido entre as tangentes às geodésicas, não entre as cordas. Então
     somamos ψ₂₁, de zero vírgula seis três segundo, e obtemos o azimute da tangente da ré.*
   - *Somando α, temos o azimute de quadrícula da tangente da vante. Repare: γ não entrou. A
     orientação veio de uma ré com coordenadas UTM, e já está na grade.*
3. **Passos 2 e 3.** Dₑ = Fₕ · Dₕ; ponto 3′ aproximado (marcador tracejado) na planta.
   - *Passo dois. A distância horizontal vai ao elipsoide com o fator de altitude: dois mil
     oitocentos e quarenta e nove vírgula setenta metros.*
   - *Passo três. Com o fator de escala do ponto dois, calculamos uma posição aproximada do ponto
     três. Ela é aproximada porque ainda não conhecemos ψ nem o fator de escala da nova linha.*
4. **Passos 4 e 5.** ψ₂₃, Az_C,23, m₂₃, D_c, E₃ e N₃; zoom do ponto 3′ ao 3 (2,3 cm).
   - *Passo quatro. Com o ponto três aproximado, calculamos ψ₂₃, de zero vírgula cinco dois
     segundo, e o azimute da corda da vante.*
   - *E o fator de escala da linha dois três, pela regra de Simpson. A corda projetada fica com dois
     mil oitocentos e cinquenta vírgula trinta e dois metros: trinta e dois centímetros a mais do
     que a medida.*
   - *Passo cinco. Com a corda e o seu azimute, E₃ e N₃ saem pelo seno e pelo cosseno.*
   - *Uma segunda iteração muda o ponto três em menos de um décimo de milímetro. Em linhas
     topográficas, uma iteração basta.*
5. **Conferência UFPR.** Planta do exemplo (ré, estação, A a D) e o quadro publicado × calculado;
   depois, a poligonal: 3 vira estação, 2 vira ré, e surge o lado seguinte.
   - *O mesmo roteiro reproduz o exemplo das notas da UFPR, calculado com o programa TRANSPUTM. Os
     quatro pontos irradiados, de A até D, coincidem com os publicados a menos de um milímetro.*
   - *Numa poligonal, o ponto três vira estação, o dois vira ré, e o roteiro se repete, lado a
     lado.*

## Som

Trilha da série a partir de 140 s, abaixando sob a voz. Marimba a cada “Passo”; toque de madeira
em cada linha do quadro; traço quando uma visada é desenhada; kalimba no ψ₂₁ e no ponto 3
definitivo; sino curto em cada ponto A a D que confere.
