# Roteiro: V5. Loxodromia × ortodromia: São Paulo → Joanesburgo

Fonte: `EAM431_aula08_20262_Prompts_Motion.docx`.

Slides: Slides 17 e 18 (Ortodromia e loxodromia; exemplo)

Objetivo didático: Mostrar no globo que rumo constante não é caminho mais curto, e que cada projeção endireita uma das duas linhas.

Duração: 55 a 70 s


## Prompt para o Motion

Crie um vídeo animado curto (55 a 70 s) para uma aula de Projeções Cartográficas, sobre o tema: Loxodromia × ortodromia: São Paulo → Joanesburgo.

Objetivo didático: Mostrar no globo que rumo constante não é caminho mais curto, e que cada projeção endireita uma das duas linhas.


### Roteiro

- Cena 1 (0 a 18 s). Globo 3D centrado no Atlântico Sul. Pontos: São Paulo (φ = −23,55°, λ = −46,63°) e Joanesburgo (φ = −26,20°, λ = 28,05°). Desenhar a geodésica em azul-marinho: sai de São Paulo com azimute 109,71°, desce até 30,4° S e chega com 74,09°. Desenhar a loxodromia em laranja: rumo constante de 92,23°. Em três meridianos ao longo da rota laranja, mostrar pequenos arcos indicando que o ângulo com o meridiano é sempre o mesmo; na rota azul, o ângulo muda.
- Cena 2 (18 a 32 s). O globo se transforma na projeção de Mercator (x = λ, y = ψ). A linha laranja vira reta; a azul vira curva que desce para o sul. Texto: 'Mercator: a loxodromia é reta'.
- Cena 3 (32 a 46 s). Transição para a projeção gnomônica centrada no meio da rota. A linha azul vira reta; a laranja se curva para o norte. Texto: 'Gnomônica: o círculo máximo é reto'.
- Cena 4 (46 a 60 s). Placar final: 'Loxodromia: 7 551 km' e 'Geodésica: 7 442 km'; diferença '+109 km (1,5 %)'. Texto final: 'Rumo constante facilita a navegação, mas não é o caminho mais curto'.

### Regras gerais (valem para todo o vídeo)

- Público: graduação em Engenharia de Agrimensura e Cartográfica (UFV), disciplina EAM 431, Projeções Cartográficas. O vídeo será inserido num slide do PowerPoint, então não precisa de abertura, logotipo nem créditos.
- Formato 16:9, 1920 × 1080, sem narração. Todo o texto na tela em português do Brasil, frases curtas, sem travessões. Ritmo lento: cada estado importante fica parado pelo menos 2 s antes da próxima transição. Exportar em MP4.
- Paleta: fundo branco; azul-marinho #1F3864 para elementos principais e equações; laranja #E8711A para destaques e linhas especiais; azul #0432FF para títulos; cinza #9A9A9A para meridianos e paralelos; vermelho translúcido #C0392B (opacidade 55 %) para indicatrizes de Tissot. Fonte sem serifa; equações em tipografia matemática.
- Notação obrigatória: φ latitude, λ longitude, λ₀ meridiano central, ψ latitude isométrica, m fator de escala, σ fator de área, ϖ deformação angular máxima, k₀ fator de escala no centro ou no MC, ρ raio do paralelo no plano, γ ângulo polar ou convergência meridiana. Usar 'sen' e não 'sin'. x para leste e y para norte.
- Cenas 3D: globo, cone, cilindro e plano devem ser objetos 3D de verdade, com câmera em órbita lenta ou fixa, iluminação suave e superfícies de projeção semitransparentes (opacidade 30 a 40 %) para que se veja a linha de contato com o globo. Se a ferramenta tiver motor 3D (por exemplo Three.js/WebGL), use-o. Se não tiver, desenhe o globo em projeção ortográfica calculada (rotação de eixos e descarte do hemisfério oculto), que dá a mesma aparência de 3D com geometria exata.
- Precisão: todas as curvas, reticulados e círculos devem ser calculados pelas equações dadas no roteiro, nunca desenhados à mão livre. Números exibidos na tela devem ser exatamente os informados, com vírgula decimal.

## Ajuste combinado

A partir do V5, o nome na tela é "Prof. Dr. Darlan M. Nunes".
