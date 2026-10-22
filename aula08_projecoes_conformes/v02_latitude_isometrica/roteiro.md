# Roteiro: V2. Latitude isométrica: do retângulo ao quadrado

Fonte: `EAM431_aula08_20262_Prompts_Motion.docx`.

Slides: Slide 5 (Coordenadas Isométricas)

Objetivo didático: Dar sentido geométrico à troca de φ por ψ e mostrar por que ψ explode perto do polo.

Duração: 45 a 60 s


## Prompt para o Motion

Crie um vídeo animado curto (45 a 60 s) para uma aula de Projeções Cartográficas, sobre o tema: Latitude isométrica: do retângulo ao quadrado.

Objetivo didático: Dar sentido geométrico à troca de φ por ψ e mostrar por que ψ explode perto do polo.


### Roteiro

- Cena 1 (0 a 12 s). Globo 3D. Destacar um pequeno quadrilátero entre dois meridianos e dois paralelos próximos ao Equador (Δφ = Δλ = 5°). Zoom: os lados medem M·dφ (norte-sul) e N cos φ·dλ (leste-oeste). Perto do Equador é quase um quadrado.
- Cena 2 (12 a 24 s). O mesmo quadrilátero desliza para φ = −30° e depois para φ = −60°, sempre com Δφ = Δλ = 5°. O lado leste-oeste encolhe na proporção cos φ (0,87 e 0,50): vira um retângulo cada vez mais estreito. Texto: 'Mesma variação de ângulo, comprimentos diferentes'.
- Cena 3 (24 a 40 s). Planificar numa grade com λ no eixo horizontal e ψ no vertical. Os paralelos se reposicionam com espaçamento dψ = M dφ / (N cos φ); cada retângulo se estica no sentido norte-sul até virar quadrado. Mostrar a equação ds² = N² cos²φ (dψ² + dλ²) e o texto: 'Coordenadas isométricas: o quadrilátero elementar é um quadrado'. Comentar na tela: 'Esta grade é o reticulado da Mercator'.
- Cena 4 (40 a 55 s). Gráfico de |ψ| (em graus) contra |φ| de 0° a 85°, desenhado progressivamente, com a reta ψ = φ tracejada como referência. Ponto de Viçosa: φ = −20°45′, |ψ| = 21,08°. Em 85°, ψ passa de 170°. Seta final: 'ψ → ∞ no polo: a Mercator não representa os polos'.

### Regras gerais (valem para todo o vídeo)

- Público: graduação em Engenharia de Agrimensura e Cartográfica (UFV), disciplina EAM 431, Projeções Cartográficas. O vídeo será inserido num slide do PowerPoint, então não precisa de abertura, logotipo nem créditos.
- Formato 16:9, 1920 × 1080, sem narração. Todo o texto na tela em português do Brasil, frases curtas, sem travessões. Ritmo lento: cada estado importante fica parado pelo menos 2 s antes da próxima transição. Exportar em MP4.
- Paleta: fundo branco; azul-marinho #1F3864 para elementos principais e equações; laranja #E8711A para destaques e linhas especiais; azul #0432FF para títulos; cinza #9A9A9A para meridianos e paralelos; vermelho translúcido #C0392B (opacidade 55 %) para indicatrizes de Tissot. Fonte sem serifa; equações em tipografia matemática.
- Notação obrigatória: φ latitude, λ longitude, λ₀ meridiano central, ψ latitude isométrica, m fator de escala, σ fator de área, ϖ deformação angular máxima, k₀ fator de escala no centro ou no MC, ρ raio do paralelo no plano, γ ângulo polar ou convergência meridiana. Usar 'sen' e não 'sin'. x para leste e y para norte.
- Cenas 3D: globo, cone, cilindro e plano devem ser objetos 3D de verdade, com câmera em órbita lenta ou fixa, iluminação suave e superfícies de projeção semitransparentes (opacidade 30 a 40 %) para que se veja a linha de contato com o globo. Se a ferramenta tiver motor 3D (por exemplo Three.js/WebGL), use-o. Se não tiver, desenhe o globo em projeção ortográfica calculada (rotação de eixos e descarte do hemisfério oculto), que dá a mesma aparência de 3D com geometria exata.
- Precisão: todas as curvas, reticulados e círculos devem ser calculados pelas equações dadas no roteiro, nunca desenhados à mão livre. Números exibidos na tela devem ser exatamente os informados, com vírgula decimal.
