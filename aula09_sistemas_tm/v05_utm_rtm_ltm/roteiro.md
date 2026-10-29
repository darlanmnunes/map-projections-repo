# Roteiro: V5. UTM, RTM e LTM: a mesma TM com outros parâmetros

**Aula 09, slides 24 a 27.** Duração: 65 s. Sem narração; trilha da série ao fundo.

**Mensagem:** UTM, RTM e LTM não são três projeções. São a Transversa de Mercator no
elipsoide com cinco parâmetros diferentes (amplitude do fuso, MC, k₀, E₀ e N₀). Fusos
mais estreitos reduzem a distorção, mas multiplicam os limites de fuso.

## Cena 1 (0 a 22 s): uma só projeção, cinco parâmetros

- Título: "UTM, RTM e LTM: uma só projeção".
- Eq. (1): E = E₀ + k₀ x; N = N₀ + k₀ y, com x e y da TM (escala 1 no MC, origem no
  Equador). Frase: entre os três sistemas mudam só os cinco parâmetros.
- Quadro de parâmetros que passa de UTM (6°; 6F − 183°; 0,9996; 500 000 m; 10 000 000 m)
  a RTM (2°; longitudes ímpares; 0,999995; 400 000 m; 5 000 000 m) aos 9 s e a LTM (1°;
  meios graus; 0,999995; 200 000 m; 5 000 000 m) aos 15 s. O valor que muda fica laranja.
- Faixa de longitude de −49° a −41° com Viçosa: os limites de fuso se acrescentam
  (6° → 2° → 1°), os MCs aparecem tracejados e o fuso de Viçosa encolhe em laranja
  (MC −45°, −43°, −42°30′). Abaixo, o uso de cada sistema.

## Cena 2 (22 a 44 s): distorção ao longo do paralelo de Viçosa

- Gráfico ppm (mm/km) contra a distância ao MC (km). A parábola do UTM vai de −400 no MC
  a +806 na borda; Viçosa: +210.
- Entram RTM (tracejado azul, até ±104 km) e LTM (laranja, até ±52 km): a mesma
  parábola rasa, com mínimo −5. "No MC: 1/2 500 no UTM e 1/200 000 no RTM e no LTM".
- Zoom (31,4 a 34,6 s): o eixo vertical passa a −12…140 ppm. O LTM é o trecho central do
  RTM. Viçosa: −3 no RTM e +13 no LTM.

## Cena 3 (44 a 65 s): RTM e LTM sobre Minas Gerais

- Mapa de MG e vizinhos em (λ, φ). Fusos UTM (3), com o fuso 23 em destaque; seta do MC
  −45° até a divisa oeste: Δλ ≈ 6°, m = 1,0045 (4,5 m por km).
- Aos 50,5 s, fusos RTM (7, Viçosa no MC −43°); aos 55 s, LTM (13, MC −42°30′).
- Fecho: "Menos distorção, mais limites de fuso". Para o estado inteiro, cônicas como a
  Lambert com 2 paralelos padrão ou a Albers (Aulas 07 e 08).
