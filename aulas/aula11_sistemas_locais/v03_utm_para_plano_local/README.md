# V3. Do UTM ao plano topográfico local

Vídeo narrado da Aula 11 (slides 26 a 29 e 31 a 35): as três mudanças entre a grade UTM e o plano
topográfico local e os três métodos de cálculo (rigoroso, similaridade 2D e polar), com o ponto P1
do exemplo de Viçosa. Roteiro e narração em [roteiro.md](roteiro.md).

```bash
python aulas/aula11_sistemas_locais/v03_utm_para_plano_local/python/gerar_dados.py   # dados e conferência com o deck
python ferramentas/montar_audio.py aulas/aula11_sistemas_locais/v03_utm_para_plano_local
python ferramentas/renderizar_mp4.py aulas/aula11_sistemas_locais/v03_utm_para_plano_local
```

`gerar_dados.py` calcula o método rigoroso pela terna topocêntrica (eq. 29 a 31, conferida com
`+proj=topocentric` do pyproj, origem em hL = 700 m), a similaridade (eq. 38 e 39) e o método polar
(eq. 41, com m da linha, ψ e γ do módulo da Aula 10).
