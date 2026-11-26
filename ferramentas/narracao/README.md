# Narração dos vídeos (Aula 10 em diante)

- `gerar_voz.py <vídeo> <modelo>`: narra todas as falas de `motion/voz/narracao.json` numa só
  requisição de TTS (voz Charon, modelo `gemini-2.5-flash-preview-tts`), corta o áudio nas pausas entre
  as falas, conferindo cada corte com o whisper, e grava `motion/voz/<id>.mp3` e `falas.json`.
  Precisa da variável `TTS_ENGINE` com o caminho do motor de TTS (`audio.mjs` do media-use).
- `qa_voz.py <vídeos…>`: transcreve cada fala e compara com o texto do roteiro.
- `palavras.py <vídeos…>`: refaz os instantes de cada palavra, usados por `kit.em('fala', 'palavra')`.
- `stills.py <vídeo> <t…>`: quadros PNG de revisão, renderizados pelo player.

Depois: `ferramentas/montar_audio.py` e `ferramentas/renderizar_mp4.py`.
