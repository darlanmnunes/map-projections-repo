# V4. Convergência meridiana: norte de quadrícula × norte geográfico

Aula 09 (Sistemas TM, UTM, RTM e LTM), slides 19 e 20; exercício 5 do slide 30.
Duração: 66 s, sem narração.

## Ideia

Na grade UTM, todas as linhas de N constante são retas paralelas, mas os meridianos (fora do
MC) são curvas que convergem para o polo. Em cada ponto, o norte da grade e o norte verdadeiro
diferem de um ângulo: a convergência meridiana γ. O vídeo mostra o ângulo num esquema
exagerado, o sinal de γ nos quatro quadrantes, os valores reais no fuso 23 e o uso de γ para
passar do azimute geodésico ao azimute de quadrícula.

## Cenas

1. **NQ × NG (0 a 17 s).** Grade TM (retas de E e N constantes). Entram os meridianos e
   paralelos projetados (curvas, GRS80). Em P (Δλ = 35°, φ = −35°): seta do norte de
   quadrícula (paralela ao MC), seta do norte geográfico (tangente à imagem do meridiano) e o
   ângulo γ entre elas. Texto: γ ≈ Δλ sen φ (10); γ > 0 quando NQ está a leste de NG; aqui
   γ = −21°54′. Nota: esquema exagerado; no fuso UTM, |γ| não passa de cerca de 2°.
2. **Quatro quadrantes (17 a 38 s).** P percorre Hemisfério Sul leste → Sul oeste → Norte
   oeste → Norte leste e volta. Painel ao vivo com Δλ, φ, γ exato (GRS80) e Δλ sen φ; o quadro
   de sinais do slide 19 acende a célula do quadrante. Ao cruzar o MC e o Equador aparece
   "γ = 0". Fecho: γ = 0 no MC e no Equador; k₀ não altera γ.
3. **Fuso 23 (38 a 53 s).** Mapa do fuso 23 em UTM colorido por γ (azul a oeste, γ > 0;
   laranja a leste, γ < 0), com o Brasil e Minas Gerais. Gráfico γ × φ para Δλ = +1°, +2°08′ e
   +3°: as curvas exatas e Δλ sen φ quase coincidem. Viçosa: eq. (10) γ = −0°45′21″;
   eq. (11) γ = −0°45′22,07″ (= pyproj). Borda do fuso em 33°45′ S: |γ| = 1°40′.
4. **Azimute de quadrícula (53 a 66 s).** Em Viçosa, NQ, NG e uma visada de 1 km com
   Az = 145°33′25″ (a partir de NG). Az_Q = Az − γ = 146°18′47″ (12). A mesma visada com o Az
   aplicado a partir de NQ (γ ignorado) cai 13 m ao lado. Ângulos ampliados 10× no desenho.
   Nota: na Aula 10 entra a redução angular ψ.
