# Trilha da série

`trilha_eam431.mp3`: primeiros 330 s de "Ambient Piano Guitar Texture E", de deadrobotmusic,
https://freesound.org/people/deadrobotmusic/sounds/703137/ (licença CC0 1.0, conferida na página em
29/10/2026), recodificado em MP3 de 128 kbit/s.

Cada vídeo usa um trecho diferente, a partir de `trilha.inicio` (segundos) no seu `scenes.json`.
No MP4, o trecho entra em fade de 1,5 s, sai em fade de 3 s e é normalizado a −16 LUFS
(pico real ≤ −1,5 dBTP) por `ferramentas/renderizar_mp4.py`. No navegador, o player toca o mesmo trecho.

# Efeitos sonoros (Aula 10 em diante)

`sons/*.wav`: efeitos curtos sintetizados por código (banco de receitas do earshot), sem
gravações de terceiros. Cada um tem uma função fixa em todos os vídeos:

| Arquivo | Uso |
|---|---|
| `passagem.wav` | troca de cena (papel deslizando) |
| `traco.wav` | uma linha sendo desenhada |
| `entrada.wav` | um ponto, rótulo ou cartão aparecendo |
| `tique.wav` | itens de lista e células de tabela |
| `passo.wav` | um passo do roteiro de cálculo, uma pergunta (marimba) |
| `confere.wav` | um resultado que confere com o publicado ou com o elipsoide |
| `realce.wav` | um conceito-chave (kalimba suave) |

O nível de cada efeito é dado em `scenes.json` (`sons[].g`, em dB) e a mixagem é feita por
`ferramentas/montar_audio.py`.

# Narração (Aula 10 em diante)

Voz sintetizada pelo Gemini TTS (modelo `gemini-2.5-flash-preview-tts`, voz Charon), a partir do
texto em `motion/voz/narracao.json` de cada vídeo. Cada vídeo foi narrado numa única chamada e
cortado em falas nas pausas; cada fala foi conferida com o roteiro por transcrição automática.
