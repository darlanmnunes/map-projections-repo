# Roteiro: V6. Estereográfica: perspectiva do antípoda e o plano secante do UPS

Fonte: `EAM431_aula08_20262_Prompts_Motion.docx`.

Slides: Slides 20 e 21 (Projeção Estereográfica; UPS)

Objetivo didático: Mostrar a construção perspectiva, a preservação de círculos e o efeito de k₀ = 0,994.

Duração: 50 a 65 s


## Prompt para o Motion

Crie um vídeo animado curto (50 a 65 s) para uma aula de Projeções Cartográficas, sobre o tema: Estereográfica: perspectiva do antípoda e o plano secante do UPS.

Objetivo didático: Mostrar a construção perspectiva, a preservação de círculos e o efeito de k₀ = 0,994.


### Roteiro

- Cena 1 (0 a 15 s). Globo 3D cortado ao meio (vista em corte meridiano), plano horizontal tangente no polo sul, ponto de vista no polo norte. Raios partem do polo norte, atravessam pontos do globo e atingem o plano. Mostrar ρ = 2R tan(c/2), com c a distância angular ao polo sul.
- Cena 2 (15 a 28 s). Volta à vista 3D completa. Um pequeno círculo desenhado no globo (por exemplo, de 10° de raio em torno de 50° S) é projetado pelos raios e continua círculo no plano. Texto: 'Círculos continuam círculos'.
- Cena 3 (28 a 45 s). O plano sobe para dentro do globo e passa a cortá-lo num círculo (linha laranja) em 81°06′52″ S. Ao lado, gráfico de m = 2k₀ / (1 + cos c) de −90° a −60°: a curva com k₀ = 1 (cinza tracejada) desce para a curva com k₀ = 0,994 (azul-marinho), que cruza m = 1 em 81°07′ S. Etiquetas: 'polo: m = 0,994'; '80° S: m = 1,0016'.
- Cena 4 (45 a 60 s). Vista polar plana com a Antártida, indicatrizes circulares, o círculo de m = 1 e o limite do UPS em 80° S tracejado. Texto final: 'UPS: k₀ = 0,994; λ₀ = 0°; FE = FN = 2 000 000 m; complementa o UTM'.

### Regras gerais (valem para todo o vídeo)

- Público: graduação em Engenharia de Agrimensura e Cartográfica (UFV), disciplina EAM 431, Projeções Cartográficas. O vídeo será inserido num slide do PowerPoint, então não precisa de abertura, logotipo nem créditos.
- Formato 16:9, 1920 × 1080, sem narração. Todo o texto na tela em português do Brasil, frases curtas, sem travessões. Ritmo lento: cada estado importante fica parado pelo menos 2 s antes da próxima transição. Exportar em MP4.
- Paleta: fundo branco; azul-marinho #1F3864 para elementos principais e equações; laranja #E8711A para destaques e linhas especiais; azul #0432FF para títulos; cinza #9A9A9A para meridianos e paralelos; vermelho translúcido #C0392B (opacidade 55 %) para indicatrizes de Tissot. Fonte sem serifa; equações em tipografia matemática.
- Notação obrigatória: φ latitude, λ longitude, λ₀ meridiano central, ψ latitude isométrica, m fator de escala, σ fator de área, ϖ deformação angular máxima, k₀ fator de escala no centro ou no MC, ρ raio do paralelo no plano, γ ângulo polar ou convergência meridiana. Usar 'sen' e não 'sin'. x para leste e y para norte.
- Cenas 3D: globo, cone, cilindro e plano devem ser objetos 3D de verdade, com câmera em órbita lenta ou fixa, iluminação suave e superfícies de projeção semitransparentes (opacidade 30 a 40 %) para que se veja a linha de contato com o globo. Se a ferramenta tiver motor 3D (por exemplo Three.js/WebGL), use-o. Se não tiver, desenhe o globo em projeção ortográfica calculada (rotação de eixos e descarte do hemisfério oculto), que dá a mesma aparência de 3D com geometria exata.
- Precisão: todas as curvas, reticulados e círculos devem ser calculados pelas equações dadas no roteiro, nunca desenhados à mão livre. Números exibidos na tela devem ser exatamente os informados, com vírgula decimal.
