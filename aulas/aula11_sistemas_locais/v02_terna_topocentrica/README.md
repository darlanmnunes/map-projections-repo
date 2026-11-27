# V2. A terna topocêntrica

Aula 11 (sistemas de coordenadas locais), slides 14 a 16 e 22. Roteiro e narração em [roteiro.md](roteiro.md).

```bash
python aulas/aula11_sistemas_locais/v02_terna_topocentrica/python/gerar_dados.py     # dados e conferência com o pyproj
python ferramentas/montar_audio.py aulas/aula11_sistemas_locais/v02_terna_topocentrica  # tempos das cenas e faixa de áudio
python ferramentas/renderizar_mp4.py aulas/aula11_sistemas_locais/v02_terna_topocentrica
```

`gerar_dados.py` confere a origem O (eq. 29), a matriz T (eq. 31), o ponto P1 (eq. 30 contra `+proj=topocentric`) e a convergência no plano local (eq. 37) com os valores do deck.
