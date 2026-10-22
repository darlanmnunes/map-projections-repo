# Roteiro: V1. Conforme × equivalente: o que acontece com um círculo infinitesimal

Fonte: `EAM431_aula08_20262_Prompts_Motion.docx`.

Slides: Slides 3 e 4 (Conceitos e Definições; Condição Métrica da Conformidade)

Objetivo didático: Mostrar que conformidade significa escala igual em todas as direções, e não escala igual a 1, e que a área é o preço pago (σ = m²).

Duração: 45 a 55 s


## Prompt para o Motion

Crie um vídeo animado curto (45 a 55 s) para uma aula de Projeções Cartográficas, sobre o tema: Conforme × equivalente: o que acontece com um círculo infinitesimal.

Objetivo didático: Mostrar que conformidade significa escala igual em todas as direções, e não escala igual a 1, e que a área é o preço pago (σ = m²).


### Roteiro

- Cena 1 (0 a 8 s). Globo 3D com meridianos e paralelos a cada 15°, girando devagar até centrar a América do Sul. Sobre o meridiano λ = −45°, três pequenos círculos vermelhos de mesmo raio angular (7°) nas latitudes φ = 0°, −30° e −60°. Texto: 'Três círculos iguais na esfera'.
- Cena 2 (8 a 22 s). O globo se desenrola em dois mapas lado a lado, com o mesmo eixo x = λ. À esquerda, Mercator: y = ln tan(45° + φ/2). À direita, Lambert cilíndrica equivalente: y = sen φ. Os três círculos acompanham a transformação. Na Mercator continuam círculos, com raio multiplicado por sec φ (1; 1,155; 2). Na Lambert viram elipses: semieixo leste-oeste sec φ e norte-sul cos φ.
- Cena 3 (22 a 35 s). Títulos sobre cada mapa: 'Conforme (Mercator): ϖ = 0, σ = m²' e 'Equivalente (Lambert cilíndrica): σ = 1, ϖ > 0'. Ao lado do círculo de −60°, etiquetas: Mercator m = 2, σ = 4; Lambert semieixos 2 e 0,5, σ = 1.
- Cena 4 (35 a 50 s). Zoom num quadradinho infinitesimal do globo: na Mercator ele vira um quadrado maior; na Lambert, um retângulo de mesma área. Surge a condição: E/e = G/g = m², F = 0. Texto final: 'Conforme: mesma escala em todas as direções, não escala igual a 1'.

### Regras gerais (valem para todo o vídeo)

- Público: graduação em Engenharia de Agrimensura e Cartográfica (UFV), disciplina EAM 431, Projeções Cartográficas. O vídeo será inserido num slide do PowerPoint, então não precisa de abertura, logotipo nem créditos.
- Formato 16:9, 1920 × 1080, sem narração. Todo o texto na tela em português do Brasil, frases curtas, sem travessões. Ritmo lento: cada estado importante fica parado pelo menos 2 s antes da próxima transição. Exportar em MP4.
- Paleta: fundo branco; azul-marinho #1F3864 para elementos principais e equações; laranja #E8711A para destaques e linhas especiais; azul #0432FF para títulos; cinza #9A9A9A para meridianos e paralelos; vermelho translúcido #C0392B (opacidade 55 %) para indicatrizes de Tissot. Fonte sem serifa; equações em tipografia matemática.
- Notação obrigatória: φ latitude, λ longitude, λ₀ meridiano central, ψ latitude isométrica, m fator de escala, σ fator de área, ϖ deformação angular máxima, k₀ fator de escala no centro ou no MC, ρ raio do paralelo no plano, γ ângulo polar ou convergência meridiana. Usar 'sen' e não 'sin'. x para leste e y para norte.
- Cenas 3D: globo, cone, cilindro e plano devem ser objetos 3D de verdade, com câmera em órbita lenta ou fixa, iluminação suave e superfícies de projeção semitransparentes (opacidade 30 a 40 %) para que se veja a linha de contato com o globo. Se a ferramenta tiver motor 3D (por exemplo Three.js/WebGL), use-o. Se não tiver, desenhe o globo em projeção ortográfica calculada (rotação de eixos e descarte do hemisfério oculto), que dá a mesma aparência de 3D com geometria exata.
- Precisão: todas as curvas, reticulados e círculos devem ser calculados pelas equações dadas no roteiro, nunca desenhados à mão livre. Números exibidos na tela devem ser exatamente os informados, com vírgula decimal.
