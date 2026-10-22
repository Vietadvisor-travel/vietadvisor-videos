# Sound & music — the half of the film people feel

Sources: Storyblocks SFX guide, trailer-music structure (riser → hit → silence → drop), animated-feature sound practice
(Spider-Verse, Pixar shorts), platform loudness (YouTube/TikTok normalise around −14 LUFS). All sounds are synthesized in
`tools/sound_design.py` / `tools/sfx.py` — free, no licences. `make.mjs` runs the whole pass automatically.

## The layers (bottom to top)
1. **Ambience bed** — where we are, always on, low (`city_bed` on flat-3D streets, place beds: kitchen simmer, café spoons, bar fan, wind on aerials).
2. **Score** — one mood per act (`score: comedy@1 adventure@5 epic@12 emotional@20`), crossfaded at cuts (equal power, 1.4 s).
3. **Foley** — things we see: footsteps, scooters passing (`whoosh_by`, doppler), horns (`horn_far`, `scooter_horn`, `bus_horn`), air brakes, cups, coins.
4. **Design hits** — the cinema: `riser`, `boom` (sub-drop), `riser_hit`, `braam`, `impact`, `shimmer`, `stamp`, `tick_roll`, `neon_buzz`, `record_scratch`.
5. **Voice** — always on top; music ducks −9.5 dB under it, foley −3 dB, beds by √duck.

## Grammar the engine now applies automatically
| Picture | Sound |
|---|---|
| `art=` lettering | its look's sound on the landing frame (table in typography.md); slam/mask/stamp/split/gold get **silence before the hit** |
| `street3d` | city bed + 1 distant horn every ~3 s; `near=` → close whoosh-by + horn; `bus=` → bus horn + air brake; `title=` → impact + boom with dip; `mode=run` → fast footsteps; `done=` → small applause |
| `shot_eyes` | heartbeat for the whole shot | 
| `shot_bird` | wind | `shot_worm` → whoosh-by |
| `map3d` `fleet3d` `wow_fleet` `wow_south` | riser into the cut (starts 1.4 s before) + braam on it, dip |
| `wow_storm` | thunder + rain burst | `sshape` → map whoosh |
| `chapter` | whoosh + thud | `title variant=film` → riser + boom, dip |
| quiz / price / myth / gag / stat / timelapse | heartbeat+drumroll+ooh / register+coins / record scratch / slide whistle / clock |
| any beat `drop=1.2` | music cuts out 0.4 s before 1.2 s and slams back on it (smash cut, punchline) |
Add anything else per beat: `sfx="0.4:whoosh_by:.8:-.5|1.2:boom"` (offset:sound[:gain[:pan]]; negative offset = J-cut, the sound leads the picture).

## Rules
- **Silence is the loudest sound.** Before the biggest reveal of each act, drop the music (`drop=`), let one ambient detail play, then hit.
- **Riser length = anticipation length**: 1.2–2 s, ending exactly on the cut/hit. Never two risers within 10 s.
- **Whoosh length matches the motion** (a fast whip 0.3 s, a crane 1.2 s `map_whoosh`). Whooshes lead the visual by ~0.25 s (auto).
- **Hits on cuts, not everywhere**: ≤ 1 big hit (boom/braam) per 15 s; small hits (thud, stamp) can land on lettering.
- **Comedy sounds** (boing, slide whistle, record scratch) sparingly — once or twice per episode, and the music stops on the same frame as a record scratch.
- **Never cover a line** the viewer needs: design hits go between sentences or on the stressed word of a short line.
- **Panning tells space**: a scooter crossing left→right pans left→right; horns scattered ±0.8.
- **Score follows the story**: hook = full energy; explanation = sparse; turn = change mood; payoff = biggest; end = resolved chord (auto).
  Change mood at act turns only (3–5 per vertical, 5–8 per YouTube cut).
- **Mix**: voice peaks −1 dBFS, music −14.5 dB under, final −14 LUFS (auto). Check on phone speakers: if the horn bed masks words, lower `amb_db`.
- **Voice delivery** (Kokoro `af_heart`): `…` before a punchline holds a beat; punchlines ≤ 4 words are spoken slower; questions in the hook; numbers stressed.

## Design file (optional, `stories/<slug>.sound.json`)
`{"dips":[12.4], "music_db":-15, "amb_db":-19, "events":[[3, -0.6, "city_bed", .4, 0, {"dur":5}]]}` — merges with the automatic pass.

## Event-driven sound system (Oct 2026) — `tools/sound_design.py`
One pass owns the whole soundtrack: **event list → rule table → priority scheduler → bus mixer → QA**. `make.mjs` no longer mixes `sfx.py` or `ambience.py` stems; it runs `sound_design.py`, then normalises each format in two passes, gain only.
- **Events.** `render.mjs --cues` now writes `events` into `out/<slug>_cues.json`. They come from `episodeEvents()` in `engine/timeline.js`: transitions, character enter, exit, pose, expression and walk moves, camera moves and shakes, UI elements and checklist items, UI exits and lettering. The story adds beats and their keys (`art=`, `drop=`, street3d keys, `shot_*`, map3d, chapter, title film, quiz, myth, gag, reveal, payoff …), plus `sfx=` cues (negative offset = J-cut), the beat recipes' own cues, and `design.json` events. Old cue files without `events` still work.
- **Rule table.** The tables at the top of `sound_design.py`: `R_trans`, `UI_RULES`/`R_ui`, `EXPR`/`POSE`/`R_char`, `R_cam`, `ART` (12 lettering looks), `beat_rules` (beats, street3d, moments), `PLACE_BED`/`KIND_BED` (beds) and `PALETTE` (off-screen place texture). Each layer is (sound, offset of the sound's **peak** from the visual frame, dB, pan, priority, tier, bus). Sounds come from `tools/sfx_pro.py` (358 layered sounds). Legacy names are mapped through `LEGACY_TO_PRO`, and the old synths stay as a fallback. Any sound with less than 40% of its energy in 400 Hz–6 kHz automatically gets harmonics and a click so it reads on a phone.
- **Priorities** run from P1 (never dropped: voice, hero hits, brand) to P5 (sweeteners). Tiers: T1 hero, T2 foreground, T3 texture, T4 bed.
- **Scheduler rules:**
  - Duplicates merge: same sound within 0.25 s, or any two hits within 0.15 s. A shake hit yields to a designed hit within 0.45 s.
  - Under speech, hero/design hits slide into the nearest gap; P3–P5 foreground sounds drop 4 dB.
  - Spacing: T1 hits ≥ 4 s apart (vertical) / 6 s (YouTube), otherwise demoted; risers ≥ 10 s apart; comedy stingers ≥ 15 s apart.
  - At most 3 foreground sounds at once, and at most 2 from one family.
  - A gap filler and a density floor (§2 of research/mix/sound-grammar.md) add place texture when a stretch goes quiet.
- **Buses:**
  - **VO:** HPF 90 Hz, −3 dB shelf at 180 Hz, −2.5 dB at 300 Hz, +4 dB at 3.2 kHz, +2 dB shelf at 10 kHz, de-esser, 2.5:1 compressor, peak control.
  - **MUS:** score from `tools/music_pro.py` if it exists, else `music.py`; multi-mood crossfade. Ducked −10 dB (vertical) / −12 dB (YouTube) under the voice, plus a −4 dB dynamic dip at 1.5–4 kHz. Silence-before-the-hit dips. Stingers (`music_pro.py stinger`: comedy_button, reveal, fail, win, chapter) land in speech gaps, ≥ 8 s apart.
  - **FG / BG / AMB:** EQ, voice-keyed ducking and dynamic EQ. Beds run continuously per place with a 0.4 s J-cut and a 0.6 s L-cut. Three reverbs (room / street / open) follow the place.
  - **Faders** are solved against the voice: music −18 LU under speech, beds −24 LU.
- **Loudness.** Vertical −13 LUFS, YouTube −14 LUFS. True-peak limiter at −2.3 dBTP, so the AAC file stays at or below −1.5 dBTP. `make.mjs` then runs two-pass `loudnorm` in `linear=true` (gain-only) mode per format.
- **QA.** `out/<slug>_sound_qa.json` plus a printed table:
  - events per 10 s (overall, per window, and per section: hook, body, dialogue, payoff);
  - unique sounds, top sounds, empty windows, foreground concurrency;
  - T1 spacing, hits on words, coverage of visual events, scheduler drops, voice-masking windows by bus;
  - phone-band check per bus (HP 400 Hz 24 dB/oct, mono);
  - LUFS, TP, LRA, hook loudness, limiter gain reduction.

  `python3 tools/sound_design.py qa <file.wav> --stems out/<slug>` checks any mix.
- **Flags:** `--fmt vertical|youtube`, `--lufs`, `--tp`, `--no-stingers`, `--legacy-stems`; design.json `auto`, `stingers`, `music_db`/`amb_db` (offsets), `dips`, `events`. Debug the master with `SD_DEBUG=1`.
