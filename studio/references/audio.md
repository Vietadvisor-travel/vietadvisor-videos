# Audio — voice-over, music, SFX, mix (all free, all offline)

`node tools/make.mjs stories/x.story` does everything below automatically. This page is for tuning.

## Voice-over (Kokoro-82M, Apache-2.0)
- One-time: `python3 tools/voice.py setup` (pip `kokoro-onnx` + ~120 MB model into `~/.cache/va-voice`).
- Every caption line is spoken. Captions are then **timed to the real audio** (two-pass compile), so picture,
  captions and voice stay in sync without manual timing.
- Pace auto-calibrates to ≈2.7 words/s (≈160 wpm). Force with `--speed 0.9`.
- Narrator per format (override with `voice:` header or `--voice`):
  | voice | character | good for |
  |---|---|---|
  | `am_michael` | warm US male | explainer (default) |
  | `af_heart` | warm US female | food, dialogue B |
  | `bm_george` | British male, documentary | history |
  | `bf_emma` | British female, gentle | story |
  | `am_puck` | bright, energetic | countdown, quiz |
  | `af_bella` | playful | myth |
  | `af_sarah` | clear, calm | guide |
  | `af_nicole` | soft, ASMR-ish | night |
  | `am_echo` / `am_eric` / `am_adam` / `bf_isabella` / `bm_lewis` … | `python3 tools/voice.py voices` | dialogue characters |
- **Lip sync**: `voice.py` writes a loudness envelope (`envs.json`) and a viseme track from the phonemes (`visemes.json`:
  closed M/B/P, F/V, open A, wide E, round O, consonant) — hosts in `talk` and speakers in `dialogue` shape their mouths to
  the real words, on 2s like hand-drawn mouths, with a small head bob on stressed syllables.
- Dialogue lines use `voiceA` / `voiceB` (defaults `am_echo` / `af_heart`), so two characters sound different.
- Vietnamese names are respelled for an English voice in `tools/pron_vi.json` (Hà Giang → "Ha Zahng",
  phở → "fuh"). Add words there; test with `python3 tools/voice.py text "…"` and `say "…" test.wav`.
- Prices are read naturally: `50.000 ₫ (~$2)` → "fifty thousand dong (about two dollars)".

## Music (procedural, royalty-free by construction)
- Moods: `adventure` (driving, pentatonic plucks) · `cafe` (lo-fi Rhodes, swing, vinyl) · `upbeat` (four-on-the-floor)
  · `comedy` (pizzicato, marimba, woodblock) · `epic` (taiko, strings, minor) · `emotional` (piano + pad)
  · `night` (minor lo-fi) · `chill` · `quiz` (ticking pulse). Format picks one; override with `music:`.
- The score follows the edit: energy per beat type (hook/title/gag/countdown = full band; talk/dialogue = sparse),
  drum fills before bigger sections, crash on section lifts, a brief dip on big impacts, resolved final chord on the end frame.
  Each title seeds a different motif, so no two videos share a melody.
- Own track: `music: assets/music/my-track.mp3` (looped/trimmed/faded). Use only tracks you have rights to
  (YouTube Audio Library, Pixabay Music, licensed libraries) and credit them if required.
- `music: none` for no music.

## Ambience (location beds)
`tools/ambience.py` builds one bed per scene from its place: city traffic + horns + scooters, market chatter + clinks,
town, countryside birds + cicadas, mountain wind, night crickets, river, sea, rain, cave drips, room tone. Each bed
starts 0.6 s before its picture (J-cut) and crossfades — the single biggest "real film" audio cue. It sits at −21 dB
and dips gently under the voice.

## Traditional colour in the score
Moods now use Vietnamese voices: `sáo` bamboo flute (emotional, chill, epic), `đàn bầu` monochord bends (night),
`đàn tranh` zither with grace-note glissandi (adventure, café).

## SFX
Automatic from the edit (transitions, UI pops, impacts, prices, entrances, engines) — `tools/sfx.py`, 27 sounds.
Add your own cue in a raw scene: `sfx: [[1.2, 'ding']]`.

## Sound design pass (automatic — `tools/sound_design.py`, run by make)
- **Place beds**: hotel-bar ceiling fan (with room reverb), kitchen simmer, café spoon clinks, 1946 tram bells,
  scooters passing on city sidewalks.
- **Beat grammar**: quiz → heartbeat + drumroll into the reveal + small crowd "ooh" and claps · price → register + coins ·
  myth → record-scratch on BUSTED · gag → slide-whistle (+ slurp on yummy reactions) · mapdive → tape-rewind ·
  paper title → typewriter · steam moment → pour + steam + spoon · reveal → shop bell · stat/timelapse → accelerating clock.
- **Your cues**: `sfx="0.4:egg_crack|1.2:whisk:0.6:-0.2"` on any beat (offset : sound : gain : pan). 33 synthesized sounds
  plus every engine cue; interiors get a short room reverb automatically.
- **Score**: header `score: comedy@1 quiz@4 emotional@5 cafe@17 adventure@25` scores each act in its own mood and
  crossfades (equal-power, 1.4 s) at the cuts. Without it, the header `music:` mood plays throughout.
- Full control: `stories/<slug>.sound.json` (`{"music": [[scene_index, mood]...], "events": [[scene_index, offset, sound, gain, pan, {opts}]...], "auto": true}`).

## Mix & loudness
- Voice normalised; music at −14.5 dB under it and **ducked a further −9.5 dB while the voice speaks**; foley ducks −3 dB under the voice
  (40 ms attack, 350 ms release); SFX at −5 dB.
- Final master: `loudnorm` to **−14 LUFS integrated, −1.5 dBTP** (YouTube / Instagram / TikTok standard), AAC 192 kb/s 48 kHz.
- Stems are kept: `out/<slug>_vo.wav`, `_music.wav`, `_sfx.wav`, `_mix.wav` — hand them to an editor if needed.
