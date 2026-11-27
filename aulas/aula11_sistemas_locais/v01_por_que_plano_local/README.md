# Aula 11, V1: por que coordenadas locais

Vídeo narrado (3 min 14 s) sobre a grade UTM e o terreno, as três famílias de sistemas
locais e o plano topográfico local. Roteiro e narração em [roteiro.md](roteiro.md).

- `python/gerar_dados.py`: calcula com pyproj (GRS80) o fator combinado na origem do exemplo
  (UTM, RTM, LTM, TM municipal), F_L, R_m e o erro do plano em função da distância, e confere com
  os slides 5 e 18 a 20; grava `motion/v1-dados.json`.
- `motion/`: cenas (`scene-*.js`), `scenes.json`, narração em `voz/` e faixa de áudio `audio.mp3`.

```bash
python aulas/aula11_sistemas_locais/v01_por_que_plano_local/python/gerar_dados.py
python ferramentas/montar_audio.py aulas/aula11_sistemas_locais/v01_por_que_plano_local
python ferramentas/renderizar_mp4.py aulas/aula11_sistemas_locais/v01_por_que_plano_local
```
