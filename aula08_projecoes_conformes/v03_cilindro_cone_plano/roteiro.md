# Roteiro: V3. Uma família, três superfícies: cilindro, cone e plano

Fonte: `EAM431_aula08_20262_Prompts_Motion.docx`.

Slides: Slides 8 e 9 (Construção das Projeções Conformes Normais)

Objetivo didático: Mostrar que Mercator, Lambert e estereográfica polar são o mesmo modelo ρ = C·e^(−nψ), mudando só a constante n.

Duração: 55 a 70 s


## Prompt para o Motion

Crie um vídeo animado curto (55 a 70 s) para uma aula de Projeções Cartográficas, sobre o tema: Uma família, três superfícies: cilindro, cone e plano.

Objetivo didático: Mostrar que Mercator, Lambert e estereográfica polar são o mesmo modelo ρ = C·e^(−nψ), mudando só a constante n.


### Roteiro

- Cena 1 (0 a 12 s). Globo 3D visto de lado, polo sul embaixo. Um cone semitransparente, com eixo no eixo de rotação, encosta no globo ao longo do paralelo −30°. Destacar em laranja a linha de contato. Indicatrizes circulares vermelhas em −10°, −30°, −50° e −70°.
- Cena 2 (12 a 24 s). O cone é cortado ao longo de uma geratriz e desenrolado no plano: vira um setor circular cuja abertura é 360°·n, com n = sen 30° = 0,5 (setor de 180°). Meridianos viram raios, paralelos viram arcos concêntricos. Mostrar ρ = C·e^(−nψ) e γ = n(λ − λ₀).
- Cena 3 (24 a 40 s). Animação contínua de n diminuindo de 0,5 até perto de 0, com um contador 'n = ...' na tela. O vértice do cone sobe até sair da tela, o setor se abre e os arcos se endireitam até virar uma faixa retangular: a Mercator. Em 3D, o cone vira um cilindro tangente ao Equador. Texto: 'n → 0: cilindro, Mercator'.
- Cena 4 (40 a 55 s). Agora n cresce de 0,5 até 1. O cone se achata até virar um plano tangente no polo sul, e o setor se fecha num disco de 360°: estereográfica polar. Texto: '|n| = 1: plano, estereográfica'. Em todas as etapas as indicatrizes continuam círculos.
- Cena 5 (55 a 65 s). Quadro final com os três mapas lado a lado (Mercator, Lambert, estereográfica polar) e a legenda: 'Mesma condição de conformidade; n escolhe a superfície'. Equação de escala comum: m = nρ / (N cos φ).

### Regras gerais (valem para todo o vídeo)

- Público: graduação em Engenharia de Agrimensura e Cartográfica (UFV), disciplina EAM 431, Projeções Cartográficas. O vídeo será inserido num slide do PowerPoint, então não precisa de abertura, logotipo nem créditos.
- Formato 16:9, 1920 × 1080, sem narração. Todo o texto na tela em português do Brasil, frases curtas, sem travessões. Ritmo lento: cada estado importante fica parado pelo menos 2 s antes da próxima transição. Exportar em MP4.
- Paleta: fundo branco; azul-marinho #1F3864 para elementos principais e equações; laranja #E8711A para destaques e linhas especiais; azul #0432FF para títulos; cinza #9A9A9A para meridianos e paralelos; vermelho translúcido #C0392B (opacidade 55 %) para indicatrizes de Tissot. Fonte sem serifa; equações em tipografia matemática.
- Notação obrigatória: φ latitude, λ longitude, λ₀ meridiano central, ψ latitude isométrica, m fator de escala, σ fator de área, ϖ deformação angular máxima, k₀ fator de escala no centro ou no MC, ρ raio do paralelo no plano, γ ângulo polar ou convergência meridiana. Usar 'sen' e não 'sin'. x para leste e y para norte.
- Cenas 3D: globo, cone, cilindro e plano devem ser objetos 3D de verdade, com câmera em órbita lenta ou fixa, iluminação suave e superfícies de projeção semitransparentes (opacidade 30 a 40 %) para que se veja a linha de contato com o globo. Se a ferramenta tiver motor 3D (por exemplo Three.js/WebGL), use-o. Se não tiver, desenhe o globo em projeção ortográfica calculada (rotação de eixos e descarte do hemisfério oculto), que dá a mesma aparência de 3D com geometria exata.
- Precisão: todas as curvas, reticulados e círculos devem ser calculados pelas equações dadas no roteiro, nunca desenhados à mão livre. Números exibidos na tela devem ser exatamente os informados, com vírgula decimal.
