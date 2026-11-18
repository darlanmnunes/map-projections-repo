# V1. Do terreno à grade: por que transportar coordenadas

**Aula 10, slides 3 e 5; notas da UFPR (Delazari, 2022), slides 2 a 8.** Duração: 167 s, com narração.

## Ideia

Começar pelo problema concreto de campo, em Viçosa, e mostrar por que ele não se resolve com
trigonometria plana direta: as medidas estão no terreno, as coordenadas estão no plano UTM, e
entre os dois há o elipsoide. A distância passa por três reduções (ao horizonte, ao elipsoide
com Fₕ, à projeção com m₁₂); as direções, pela redução angular ψ e, quando a orientação é
geográfica, pela convergência γ. O vídeo termina definindo os problemas direto e inverso.

## Cenas e narração

1. **O problema no campo.** Planta na grade UTM com os pontos do slide 16.
   - *Uma equipe de topografia trabalha em Viçosa. O receptor GNSS deu as coordenadas UTM de dois
     marcos. Agora, a estação total vai medir um ângulo e uma distância até um ponto novo.*
   - *A pergunta da aula é simples: com essas medidas, quais são as coordenadas UTM do ponto novo?*
2. **Três superfícies.** Terreno, elipsoide e plano em corte, com as reduções entre eles.
   - *O problema é que as medidas e as coordenadas não estão na mesma superfície. O ângulo e a
     distância foram medidos no terreno.*
   - *As coordenadas geodésicas estão no elipsoide, a superfície de referência. E as coordenadas
     UTM estão no plano da projeção.*
   - *Antes de calcular, cada medida precisa passar do terreno para a grade. Essa passagem se
     chama redução.*
3. **A distância.** O diagrama das reduções lineares da UFPR, animado; a cadeia
   Dᵢ → Dₕ → Dₑ → D_c ao lado; o fuso com as faixas m < 1 e m > 1 e Viçosa (m = 1,000210).
   - *Comece pela distância. O distanciômetro mede uma distância inclinada, entre o instrumento
     e o prisma.*
   - *Reduzida ao horizonte, ela vira a distância horizontal.*
   - *Levada ao elipsoide, fica um pouco menor, porque as verticais de A e de B não são
     paralelas: elas convergem para o centro da Terra. Essa redução é o fator de altitude, Fₕ.*
   - *Por fim, a projeção aplica o fator de escala da linha, m₁₂. No plano, a distância pode
     ficar maior ou menor do que no elipsoide. Depende de onde a linha está no fuso.*
4. **As direções.** Grade com o MC; geodésica projetada, corda, tangente, ψ, NQ, NG e γ.
   - *Agora, as direções. A projeção UTM é conforme: preserva o ângulo entre duas curvas. Mas a
     geodésica, a linha mais curta no elipsoide, vira uma curva no plano.*
   - *As coordenadas, porém, são calculadas pela reta entre os pontos: a corda. O pequeno ângulo
     entre a tangente à curva e a corda é a redução angular, ψ.*
   - *E, se a orientação vier do norte geográfico, entra também a convergência meridiana, γ, que
     você já viu na aula nove.*
5. **Dois problemas.** Cartões do problema direto e do inverso; lista dos próximos vídeos.
   - *Com essas reduções, resolvemos dois problemas. No problema direto, partimos de pontos
     conhecidos e das medidas de campo, e chegamos às coordenadas do ponto novo.*
   - *No problema inverso, partimos de duas coordenadas UTM e voltamos ao azimute geodésico e às
     distâncias no elipsoide e no terreno.*
   - *Nos próximos vídeos, vamos ver cada redução, quanto ela vale em Viçosa e o roteiro completo
     de cálculo.*

## Som

Trilha da série a partir de 20 s, abaixando sob a voz. Efeitos: papel deslizando na troca de
cena; traço suave quando uma linha é desenhada; toque de madeira quando um ponto ou rótulo
aparece; marimba nas perguntas; kalimba nos conceitos-chave (ψ, γ).
