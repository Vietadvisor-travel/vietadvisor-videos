# Music: real tracks, cut to the story automatically (v5.1)

The channel now has a music bed: `music: auto` in the story header (the default from v5.1; `music: none` turns it off).
Good documentary music does three jobs:
- it sets the **mood of each act**;
- it **drops out** right before the big reveals, so the silence hits;
- it **swells** at act turns.

The engine does all three automatically. Your jobs are to supply good tracks once, and to mark `[BEAT]`s in the script.

## 1. Build the library once (production agent), then reuse it
Use **instrumental, cinematic or documentary** tracks: 70–130 bpm, at least 2 minutes long, no vocals, no famous melodies.
Collect **at least 3 tracks per mood** so episodes don't sound alike.

| Mood | Used for (by act) | What it should sound like |
|---|---|---|
| `curious` | setup | light pulse, plucks or piano, a question in the air |
| `rise` | rise | driving, optimistic, building drums or arpeggios |
| `tension` | doubt | low pulse, ticking, suspended strings or synths |
| `dark` | fall | heavy, minor, sub drones, slow hits |
| `sad` | after | sparse piano or strings, space |
| `reflective` | lesson | warm, resolved, gentle |
| `epic` | climax (via `score:`) | big, wide, percussive |
| `comedy` | light gags (via `score:`) | pizzicato, sneaky, quirky |
| `archive` | flash (flashbacks) | old-time, warm, a little grainy |
| `tech` | tech episodes (via `score:`) | electronic, clean, pulsing |

**Safe sources for a monetised YouTube channel** (keep the licence text for every file):
- **YouTube Audio Library.** Free. Some tracks need the attribution shown on their page.
- **Pixabay Music.** Pixabay Content License, free for commercial use, no attribution needed.
- **Uppbeat** (free tier). Credit line required.
- **Incompetech / Kevin MacLeod.** CC BY 4.0, credit required.
- **Free Music Archive.** Only tracks marked **CC BY**. Never NC (non-commercial) or ND.

**Never** use commercial songs, film scores, "no copyright" uploads of unknown origin, or anything marked NC or ND.

```bash
python3 tools/pp_music.py add ~/dl/dark_pulse.mp3 dark_pulse_01 --mood tension,dark --credit "Artist – Title" --license "Pixabay Content License"
python3 tools/pp_music.py moods      # coverage: aim for ≥ 3 per mood
python3 tools/pp_music.py list       # bpm, length, intro bars, licence
```

On `add`, each track is analysed: tempo, the bar grid, energy per bar, where the intro ends and where the peak is.

## 2. What happens automatically at mix time (`make.mjs` → `sound_design.py`)
- Each act becomes a mood: setup→curious, rise→rise, doubt→tension, fall→dark, after→sad, lesson→reflective,
  flash→archive. Runs shorter than 18 s merge into the previous one, so the music doesn't change every few seconds.
- A different track is picked per mood run (no repeats in one episode while alternatives exist).
- The track enters **on a bar line at the cut**. The first track plays its intro; later ones skip their intro. If the
  act is longer than the track, it **loops on a bar line** with a half-bar crossfade.
- Moods crossfade at the act change over about 1.4 s.
- Under the voice, the music is ducked 6–12 dB with a dynamic EQ keyed by the voice.
- Every `[BEAT]` in the script makes the music **drop out** under the pause. So do reveals, stamps and slams.
- Stingers (reveal, fail, comedy button) are added sparingly.
- The whole mix is normalised to −14 LUFS.
- Used tracks go to `out/<slug>_music_used.json`. `python3 tools/pp_music.py credits <story>` prints the credit lines
  for the description.
- **No library track for a mood?** The procedural score (`music_pro.py`) fills that mood, so the film is never silent.
  Still, real tracks sound much better.

## 3. Directing the music (optional)
- Override the moods by beat number: `score: curious@1 tension@14 epic@41 sad@52 reflective@60`.
- Put the **biggest reveal** right after a `[BEAT]`. The drop-out is automatic.
- Start a new act on a strong cut, so the new track enters on the downbeat.
