# Roteiro: V4. Lambert com 1 e 2 paralelos padrão: do cone tangente ao secante

Fonte: `EAM431_aula08_20262_Prompts_Motion.docx`.

Slides: Slides 11, 12 e 13 (Lambert 1 PP, 2 PP e exemplo em Viçosa)

Objetivo didático: Explicar por que o cone secante distribui melhor a distorção e de onde vem m = 0,94995 em Viçosa.

Duração: 55 a 70 s


## Prompt para o Motion

Crie um vídeo animado curto (55 a 70 s) para uma aula de Projeções Cartográficas, sobre o tema: Lambert com 1 e 2 paralelos padrão: do cone tangente ao secante.

Objetivo didático: Explicar por que o cone secante distribui melhor a distorção e de onde vem m = 0,94995 em Viçosa.


### Roteiro

- Cena 1 (0 a 15 s). Tela dividida. À esquerda, globo 3D e um cone tangente no paralelo −24°; a linha de contato em laranja. À direita, gráfico do fator de escala m contra a latitude (de +10° a −55°, eixo invertido como num mapa: norte à esquerda). A curva tracejada laranja toca m = 1 só em −24° e sobe para os dois lados, em forma de parábola. Texto: '1 paralelo padrão: m ≥ 1'.
- Cena 2 (15 a 32 s). O cone afunda no globo, sem mudar de forma, até cortá-lo em dois paralelos: −5° e −42° (duas linhas laranja). No gráfico, a curva desce, multiplicada por 0,9485, e passa a cruzar m = 1 exatamente em −5° e −42°. A faixa entre eles fica sombreada em azul claro com o rótulo 'entre os PP: m < 1'. Texto: '2 paralelos padrão: a mesma curva, deslocada para baixo'.
- Cena 3 (32 a 48 s). Ponto de Viçosa (φ = −20°45′) aparece no globo e na curva: m = 0,94995. Etiquetas: 'distâncias −5 %', 'áreas −9,8 % (σ = m² = 0,90241)'. Explicar na tela: 'PP afastados 37°: distorção maior no centro da faixa'.
- Cena 4 (48 a 65 s). Mapa plano da Lambert (cone desenvolvido) com λ₀ = −60°. Destacar o meridiano de Viçosa (λ = −42°52′) e o meridiano central; mostrar o ângulo entre eles: γ = n(λ − λ₀) = −6,96°, com n = −0,406. Texto final: 'Na Lambert, a convergência meridiana é exatamente n(λ − λ₀)'.

### Regras gerais (valem para todo o vídeo)

- Público: graduação em Engenharia de Agrimensura e Cartográfica (UFV), disciplina EAM 431, Projeções Cartográficas. O vídeo será inserido num slide do PowerPoint, então não precisa de abertura, logotipo nem créditos.
- Formato 16:9, 1920 × 1080, sem narração. Todo o texto na tela em português do Brasil, frases curtas, sem travessões. Ritmo lento: cada estado importante fica parado pelo menos 2 s antes da próxima transição. Exportar em MP4.
- Paleta: fundo branco; azul-marinho #1F3864 para elementos principais e equações; laranja #E8711A para destaques e linhas especiais; azul #0432FF para títulos; cinza #9A9A9A para meridianos e paralelos; vermelho translúcido #C0392B (opacidade 55 %) para indicatrizes de Tissot. Fonte sem serifa; equações em tipografia matemática.
- Notação obrigatória: φ latitude, λ longitude, λ₀ meridiano central, ψ latitude isométrica, m fator de escala, σ fator de área, ϖ deformação angular máxima, k₀ fator de escala no centro ou no MC, ρ raio do paralelo no plano, γ ângulo polar ou convergência meridiana. Usar 'sen' e não 'sin'. x para leste e y para norte.
- Cenas 3D: globo, cone, cilindro e plano devem ser objetos 3D de verdade, com câmera em órbita lenta ou fixa, iluminação suave e superfícies de projeção semitransparentes (opacidade 30 a 40 %) para que se veja a linha de contato com o globo. Se a ferramenta tiver motor 3D (por exemplo Three.js/WebGL), use-o. Se não tiver, desenhe o globo em projeção ortográfica calculada (rotação de eixos e descarte do hemisfério oculto), que dá a mesma aparência de 3D com geometria exata.
- Precisão: todas as curvas, reticulados e círculos devem ser calculados pelas equações dadas no roteiro, nunca desenhados à mão livre. Números exibidos na tela devem ser exatamente os informados, com vírgula decimal.
