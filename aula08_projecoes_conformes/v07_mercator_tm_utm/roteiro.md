# Roteiro: V7. Da Mercator à Transversa de Mercator e ao UTM

Fonte: `EAM431_aula08_20262_Prompts_Motion.docx`.

Slides: Slides 22, 23 e 24 (TM; equações; ponte para o UTM)

Objetivo didático: Visualizar o giro do cilindro, o fuso de 6° e o efeito de k₀ = 0,9996 (cilindro secante), preparando a Aula 09.

Duração: 60 a 75 s


## Prompt para o Motion

Crie um vídeo animado curto (60 a 75 s) para uma aula de Projeções Cartográficas, sobre o tema: Da Mercator à Transversa de Mercator e ao UTM.

Objetivo didático: Visualizar o giro do cilindro, o fuso de 6° e o efeito de k₀ = 0,9996 (cilindro secante), preparando a Aula 09.


### Roteiro

- Cena 1 (0 a 15 s). Globo 3D com um cilindro semitransparente tangente ao Equador (Mercator). O cilindro gira 90° em torno de um eixo no plano do Equador até tocar o globo ao longo do meridiano −45°, que fica laranja (meridiano central, MC). Texto: 'Transversa de Mercator: o contato passa a ser um meridiano'.
- Cena 2 (15 a 28 s). Destacar no globo o fuso 23, de −48° a −42°, e o ponto de Viçosa (φ = −20°45′, λ = −42°52′). Indicatrizes circulares ao longo do paralelo de Viçosa: crescem para longe do MC. Mostrar m ≈ 1 + x² / (2R²).
- Cena 3 (28 a 46 s). Gráfico de m contra a distância x ao MC, de −312 km a +312 km (bordas do fuso na latitude de Viçosa). Curva cinza tracejada: TM tangente, k₀ = 1, de 1 no MC a 1,0012 nas bordas. A curva desce, multiplicada por 0,9996, e vira a curva azul-marinho do UTM: cruza m = 1 em x ≈ ±180 km (linhas laranja verticais). Ponto de Viçosa: x = 222 km, m = 1,000210.
- Cena 4 (46 a 62 s). Volta ao 3D: o cilindro encolhe levemente e passa a cortar o globo em duas linhas paralelas ao MC, a cerca de 180 km de cada lado. Etiquetas: 'MC: m = 0,9996', 'linhas de secância: m = 1', 'bordas: m até 1,00098 no Equador'.
- Cena 5 (62 a 72 s). Texto final: 'Viçosa em UTM 23S: E = 722 120,59 m; N = 7 704 054,61 m'. Rodapé: 'Próxima aula: UTM, RTM e LTM'.

### Regras gerais (valem para todo o vídeo)

- Público: graduação em Engenharia de Agrimensura e Cartográfica (UFV), disciplina EAM 431, Projeções Cartográficas. O vídeo será inserido num slide do PowerPoint, então não precisa de abertura, logotipo nem créditos.
- Formato 16:9, 1920 × 1080, sem narração. Todo o texto na tela em português do Brasil, frases curtas, sem travessões. Ritmo lento: cada estado importante fica parado pelo menos 2 s antes da próxima transição. Exportar em MP4.
- Paleta: fundo branco; azul-marinho #1F3864 para elementos principais e equações; laranja #E8711A para destaques e linhas especiais; azul #0432FF para títulos; cinza #9A9A9A para meridianos e paralelos; vermelho translúcido #C0392B (opacidade 55 %) para indicatrizes de Tissot. Fonte sem serifa; equações em tipografia matemática.
- Notação obrigatória: φ latitude, λ longitude, λ₀ meridiano central, ψ latitude isométrica, m fator de escala, σ fator de área, ϖ deformação angular máxima, k₀ fator de escala no centro ou no MC, ρ raio do paralelo no plano, γ ângulo polar ou convergência meridiana. Usar 'sen' e não 'sin'. x para leste e y para norte.
- Cenas 3D: globo, cone, cilindro e plano devem ser objetos 3D de verdade, com câmera em órbita lenta ou fixa, iluminação suave e superfícies de projeção semitransparentes (opacidade 30 a 40 %) para que se veja a linha de contato com o globo. Se a ferramenta tiver motor 3D (por exemplo Three.js/WebGL), use-o. Se não tiver, desenhe o globo em projeção ortográfica calculada (rotação de eixos e descarte do hemisfério oculto), que dá a mesma aparência de 3D com geometria exata.
- Precisão: todas as curvas, reticulados e círculos devem ser calculados pelas equações dadas no roteiro, nunca desenhados à mão livre. Números exibidos na tela devem ser exatamente os informados, com vírgula decimal.
