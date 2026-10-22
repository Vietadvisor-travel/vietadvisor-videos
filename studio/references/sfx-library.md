# Vietadvisor Motion Studio: professional SFX palette (sfx_pro)

**Module:** `va-studio/tools/sfx_pro.py` | **Samples:** `va-studio/assets/sfx/` (253 CC0 OGGs, 2.66 MB) | **Licences:** `va-studio/assets/sfx/LICENSES.md`
**Count:** 358 named sounds across 17 categories (162 use recorded CC0 takes, the rest are pure layered synthesis). Every sound takes `var` for natural variation.

```
python3 tools/sfx_pro.py list                       # catalogue
python3 tools/sfx_pro.py demo out/sfx_demo/         # one wav per category (all sounds, 0.35 s gaps)
python3 tools/sfx_pro.py render vn_temple_bell bell.wav 3 dur=8
python3 tools/sfx_pro.py qa research/sfx/qa_table.md
```

## 1. Research: how professional cartoon, trailer and motion SFX are built

What I took from the sources, and where it shows up in the code:

| Principle | What pros do | How sfx_pro does it |
|---|---|---|
| **Layering by band and role** | Each hit or whoosh is built from a *transient* (click/snap, 1-6 ms), a *body* (mid-band material), a *tail* (reverb/ring) and a *sweetener* (sub, metal, sparkle). Each layer gets its own EQ band so the layers don't mask each other (Ableton trailer guide; IRPR glossary; Pixflow/Morphic layering guides). | `_imp()` = recorded take + synthetic sub thump + optional click + room IR. `impact_cinematic` = HP-noise transient + saturated pitched kick body + 42 Hz sub + pitched-down metal grit + hall. `hit_slam`, `impact_big` and `trans_stinger` follow the same recipe. |
| **Never the same sample twice** | Round-robin over several takes, plus random pitch (a few %), volume and filter on every trigger (IRPR "why is my game audio repetitive"; Godot AudioStreamRandomizer; footstep-variation guides). | `var` drives round-robin over takes, then pitch from a golden-ratio sequence (±0.35-1.0 × 4-8 %, so consecutive vars are always well apart), a random low-pass tilt and timing jitter inside sequences. QA: worst var0/var1 correlation is 0.96 across all sounds. |
| **Whoosh = band sweep shaped by speed and size** | Small and fast: short, bright, high band. Big and slow: long, low band, sub and rumble, more tail. Pass-bys use doppler, and envelopes are asymmetric (slow in, fast out). Deenen recommends layering multiple whooshes, doppler and LFO movement. | `whoosh()` sweeps a time-varying band-pass over pink noise with an asymmetric envelope, plus an air layer, optional sub and an optional resonant whistle. There are size presets from tiny (0.16 s) to huge (1.6 s, 110-1600 Hz, plus woom and hall). `whoosh_by`, `vehicle_moto_pass` and `battle_arrow_whiz` use a physical doppler model (retarded time, 1/r gain, air-absorption LPF). |
| **Trailer vocabulary** | Braam: stacked octave brass, filter bloom, slow downward bend, distortion, hall. Riser: pitch and filter up with accelerating LFO, ending on a hit or silence. Sub drop: sine glide down 2-3 octaves. Reverse cymbal. Downer. (Ableton; Violet Recording trailer article) | `hit_braam`, `riser_noise` (tremolo accelerating 4→26 Hz), `riser_tone` (Shepard), `riser_tension` (cluster tremolo), `riser_reverse_cymbal` (modal cymbal, reversed), `hit_sub_drop`, `riser_downer(_sub)`, `riser_suck`. |
| **Classic cartoon vocabulary** | Slide whistle (falls and rises), xylophone tiptoe and blink, cymbal "frying pan", bottle-pluck tongue, bonks and boings, blop gallop. Sci-fi sounds came from synths. Bulb horns. Library boings pitched up and down (99% Invisible on Treg Brown and Hanna-Barbera; voices.com list). | Recorded CC0 slide whistles (Ben Burnes) for up/down/wobble/bounce/flutter. Synthesized `cartoon_tiptoe` and `cartoon_blink` (modal xylophone bars 1 : 3.93 : 9.5), `cartoon_gallop`, `cartoon_bonk`, `cartoon_boing` (spring take plus jaw-harp formant), `cartoon_honk`, `cartoon_fall_whistle`, `cartoon_sad_trombone`, `cartoon_tada`, and others. |
| **Spider-Verse / comic grammar** | Punchy, stylised hits; record-scratch and hip-hop textures in the score; frame-stutter glitches (A Sound Effect and Enhanced Media write-ups). | `hit_comic` (punch + square blip + bit-crushed "pow"), `hit_glitch`, `glitch_stutter`, `trans_glitch_cut`, `trans_record_scratch` (true back-and-forth varispeed). |
| **Physical modelling for materials** | Modal synthesis (sums of damped sinusoids with material-specific partial ratios and decay laws) for bells, bars, glass and wood. Karplus-Strong for strings. Granular synthesis for rain, crowds and applause (CCRMA modal notes; MIT 21M.380; DAFx bell paper; Farnell, *Designing Sound*). | `modal()`, `membrane()` (Bessel ratios 1, 1.59, 2.14 …), `metal_modes()`, `karplus()` (block-vectorised), `cymbal()`, granular `events()`, formant voices (`glottal()` + `formant()`), synthetic room/hall/temple/valley IRs convolved with `fftconvolve`. |
| **Vietnamese cultural palette** | Bronze temple bell with beating doublets and a long hum, the wooden fish (mõ, "hollow, muffled but clear", keeps the chanting rhythm), bossed gongs (cồng chiêng), Tết firecrackers, vendor calls, karaoke from down the alley, đàn bầu bends, đàn tranh glissandi. | 23 `vn_*` sounds; see the catalogue. |

## 2. Sources tried for CC0 samples (sandbox reachability and licence)

| Source | Result | Used? |
|---|---|---|
| kenney.nl (Kenney audio packs, CC0) | Proxy **403** on CONNECT from the sandbox | Not directly. The same CC0 packs came through GitHub mirrors (below). |
| opengameart.org | Proxy **403** from the sandbox. Pages readable with WebFetch for licence checks only. | Licence verification only |
| freesound.org | Proxy **403** (and needs a login for downloads) | No |
| sonniss.com GDC bundles | Proxy **403**. The licence also forbids standalone redistribution of the raw files ("only when embedded in a project"). | No, not redistributable inside our package |
| archive.org, pixabay.com, bigsoundbank.com, commons/upload.wikimedia.org | Proxy **403** | No |
| api.github.com search | Refused ("sessions are bound to their configured repositories") | No search; repos found via WebSearch instead |
| github.com web UI / codeload zips for non-attached repos | **403** | Skipped; not routed around |
| Anonymous `git clone --depth 1` (smart-HTTP read) of public repos | **Allowed by the proxy** (the sanctioned read path) | **Yes** |
| github.com/Calinou/kenney-interface-sounds, /kenney-ui-audio | CC0 (License.txt) | **Yes**: UI, glitch |
| github.com/lavenderdotpet/CC0-Public-Domain-Sounds (repo CC0-1.0) | Contains Kenney Impact/RPG/Casino/Digital/Sci-fi (CC0 License.txt each), rubberduck's OGA CC0 packs (verified on the OGA uploader collection), Ben Burnes / Abstraction packs (CC0 per `_README.txt`), Warfork CC0 (Team Forbidden waiver file) | **Yes**, the main source |
| github.com/KenneyNL/Starter-Kit-3D-Platformer, Starter-Kit-Racing | README marks the sounds CC0 (code is MIT) | **Yes**: motorcycle engine, engine, skid, crash, coin |
| KenneyNL Starter-Kit FPS / City-Builder / Match-3 | Sounds not explicitly marked CC0 (MIT repo) | Excluded (kept the set CC0-only) |
| github.com/Loppansson/kenney-*-for-godot (Godot Asset Library) | Repos no longer exist (raw 404; git asks for auth) | No |
| BBC Sound Effects (RemArc), ESC-50 | Non-commercial licences | Excluded on licence grounds |

Curation: 253 files from 33 packs. Each was trimmed of leading silence and cut to a category maximum (0.4-8 s), given a 3 ms fade-in and 25 ms fade-out, peak-normalised to -1 dBFS, then encoded as mono 44.1 kHz Vorbis at q4. **Total 2.66 MB** (3.2 MB on disk). The script is `research/sfx/scripts/curate.py` and the provenance manifest is `research/sfx/scripts/manifest.json`. The raw 1.1 GB download folder was deleted after curation.

## 3. Quality assurance (listen-check by analysis)

The full table (all sounds, var 0 and var 1) is in `research/sfx/qa_table.md`: duration, peak, RMS, spectral centroid, DC, edge sample, var0/var1 correlation, CPU and loop seam.

- **Peak:** every sound is 0.90. **DC:** at most 3e-18 (Hann-weighted DC removal after the fades, so short sounds stay clean). **Edges:** the first and last samples are 0.0 (fade-in ≥ 2.5 ms, fade-out ≥ 5-30 ms), so there are no clicks.
- **Variation:** the maximum var0/var1 waveform correlation is **0.96**, so no two variations are identical. Sample pitch follows a golden-ratio sequence over `var`, so neighbouring vars never collide.
- **Loops:** with `loop=True`, `amb_*` beds use an equal-power wrap crossfade. Seam discontinuity is at most 4.1 × the mean sample step, which is inaudible (the noise floor of the bed).
- **Spectra:** centroids sit where the material lives. Sub and hum sounds are at 50-130 Hz (hit_sub_drop, riser_downer_sub, nature_thunder_far). Hiss textures are at 9-12 kHz (wok sizzle, static, leaves, reverse cymbal, firecrackers). Everything else is 300 Hz-8 kHz. Outliers fixed during QA:
  - Tonal "ringing" in rain pings: moved to 14 short low-Q kernels.
  - Over-bright idle engine: LPF at 3.2 kHz and less mechanical noise.
  - Over-long mõ tail: room instead of temple IR.
  - Micro-length Kenney glitches (12-36 ms): now stuttered sequences.
  - Var collisions: golden-ratio pitch.
- **CPU:** the median is **0.06 s** per sound. A few dense one-shots cost 0.3-0.6 s (arrow volley, crowd cheer, crowd murmur, lion dance, huge whoosh). Beds cost 0.3-1.1 s per 6 s. Times include first-time sample decoding and IR generation, both of which are cached afterwards.
- A spectrogram sanity sheet for 16 key syntheses is in `research/sfx/spectrograms.png`.

## 4. Integration notes for the mixer (`sound_design.py`)

`sound_design.py` was **not modified**. The recommended hook keeps its current behaviour for legacy names and routes new names to sfx_pro:

```python
# top of sound_design.py
spec2 = importlib.util.spec_from_file_location('sfxpro', os.path.join(HERE, 'sfx_pro.py'))
P = importlib.util.module_from_spec(spec2); spec2.loader.exec_module(P)
PRO_ALIAS = {   # legacy cue -> sfx_pro name (optional upgrade path)
  'whoosh': 'whoosh_med', 'map_whoosh': 'trans_map_dive', 'impact': 'impact_cinematic', 'boom': 'hit_boom', 'riser': 'riser_noise',
  'braam': 'hit_braam', 'thud': 'impact_thump', 'stamp': 'hit_slam', 'record_scratch': 'trans_record_scratch', 'tape_rewind': 'trans_tape_rewind',
  'slide_whistle': 'cartoon_slide_up', 'slide_down': 'cartoon_slide_down', 'heartbeat': 'hit_heartbeat', 'typing': 'ui_typing', 'tick_roll': 'ui_counter',
  'coins': 'foley_coins', 'footsteps': 'foley_steps', 'knock': 'foley_knock', 'creak': 'foley_creak', 'claps': 'crowd_applause', 'ooh': 'crowd_ooh',
  'gasp': 'crowd_gasp', 'slurp': 'food_slurp', 'spoon_clink': 'food_spoon_stir', 'cup_set': 'food_bowl_set', 'pour': 'food_pour_tea', 'simmer': 'food_boil_broth',
  'sizzle': 'food_wok_sizzle', 'egg_crack': 'food_egg_crack', 'bike_bell': 'vehicle_bike_bell', 'tram_bell': 'vehicle_cyclo_bell', 'scooter_horn': 'vehicle_moto_horn',
  'horn_far': 'vehicle_moto_horn', 'whoosh_by': 'vehicle_moto_pass', 'moto_pass': 'vehicle_moto_pass', 'bus_horn': 'vehicle_bus_horn', 'air_brake': 'vehicle_bus_brake',
  'engine_loop': 'vehicle_moto_idle', 'train_horn': 'vehicle_train_horn', 'train_pass': 'vehicle_train_pass', 'city_bed': 'amb_city_traffic', 'fan': 'amb_fan_room',
  'thunder': 'nature_thunder', 'rain_burst': 'nature_rain_burst', 'splash': 'nature_splash', 'firework': 'vn_firework', 'shimmer': 'magic_shimmer',
  'sparkle': 'magic_sparkle', 'boing': 'cartoon_boing', 'pop': 'cartoon_pop', 'pin_drop': 'ui_pin_drop', 'tick': 'ui_tick', 'clink': 'food_cup_clink', 'pen_draw': 'foley_marker'}
def get(name, opts, var=0):
    use_pro = opts.pop('pro', True)                      # pro=False keeps the legacy synth for a cue
    pro = name if name in P.REG else (PRO_ALIAS.get(name) if use_pro else None)
    if pro:
        x = P.get(pro, var, **opts)
        if P.REG[pro]['loop']:            # beds: level by RMS like the existing code
            rms = np.sqrt(np.mean(x ** 2)) or 1; x = x * min(1 / np.abs(x).max(), .12 / rms)
        return x / (np.abs(x).max() or 1)
    ...existing LIB / E.get path...
# in main(): pass a distinct var per event so repeats differ:
#   x = get(name, dict(opts), var=hash((si, round(off, 2), name)) & 0xffff) * gain
```

**Variation:** always pass a different `var` per event, for example the event index or `hash((scene, offset, name))`. The same `(name, var, opts)` always returns identical audio, so renders stay reproducible. For sequences, prefer the built-in sequencers, which already avoid repeating a take: `foley_steps(n, gap, surface)`, `food_chop_fast(n)`, `ui_typing(dur)`, `foley_knock(n)`, `battle_war_drum(n, bpm)`, `vn_mo_chant(dur, bpm)`.

**Gains:** `describe()[name]['gain']` is the suggested event gain on the Foley/SFX bus. It assumes the bus sits under VO at the current `foley_gain .5` with the -3 dB VO duck. Rules of thumb:
- UI ticks and hovers: 0.3-0.4
- Clicks, pops, foley: 0.35-0.45
- Whooshes: 0.4-0.55
- Impacts: 0.45-0.6
- Cinematic hits (impact_cinematic, hit_slam, braam): 0.6-0.7, paired with the existing "dip before the hit"
- Beds (`amb_*`): 0.25-0.35 and never louder than VO -18 dB

**Timing:** risers and `whoosh_reverse` / `riser_suck` end on their final sample, so place them at `hit_time - len/SR`. `trans_stinger` has its hit at +0.45 s. Whooshes peak at about 55 % of their length, so place them about 0.25-0.5 s before the cut.

**Beds:** `get('amb_x', var, dur=scene_dur + 1.2)` returns a bed with 0.3 s fades, ready to drop in. Use `loop=True` for a seamless tile that you crossfade or loop yourself (J-cut 0.6 s like `ambience.py`).

**Suggested beat-grammar upgrades:**
- quiz: `hit_heartbeat` + `riser_tension` (3 s) → `crowd_ooh` + `crowd_applause`
- myth: `trans_record_scratch`
- gag: `cartoon_slide_up` / `cartoon_bonk` / `cartoon_sad_trombone`
- price: `foley_coins` + `ui_counter`
- title film: `riser_noise` → `hit_slam` + `hit_sub_drop`
- chapter: `trans_stinger`
- map3d / fleet: `riser_noise` → `hit_braam` + `whoosh_huge`
- street3d: `amb_city_traffic` + `vehicle_moto_pass` + `vehicle_moto_horn`
- pagoda scenes: `amb_temple` + `vn_temple_bell` / `vn_mo_chant`
- Tết: `vn_firecracker_string` + `amb_crowd_festival` + `vn_lion_dance`
- history battles: `battle_war_drum` → `battle_arrow_volley` → `battle_sword_clash` / `battle_clash_melee` + `battle_charge_cry`, Bạch Đằng: `battle_stake_crack` / `battle_ship_crack`
- food: `food_wok_sizzle`, `food_slurp`, `food_spoon_stir`, `food_ice_clink`, `food_coffee_drip`

**Dependencies:** numpy, scipy, and `ffmpeg` on PATH (decodes the OGGs once; results are cached). If `assets/sfx` is missing, sample layers become silent and a single warning is printed per key. The synthetic layers still render.

## 5. Research sources

- Ableton, *Learn How to Make High-Impact Sounds for Movies and Trailers*: https://www.ableton.com/en/blog/learn-how-to-make-high-impact-sounds-for-movies-and-trailers/
- Violet Recording, *Sound Design for Trailers*: https://violetrecording.com/sound-design-for-trailers/ ; *How to Make Whoosh Sounds*: https://violetrecording.com/how-to-make-whoosh-sounds/
- Designing Sound, *Charles Deenen special: 100 whooshes in 2 minutes*: https://designingsound.org/2010/02/26/charles-deenen-special-100-whooshes-in-2-minutes ; *Whoosh review*: https://designingsound.org/2014/02/25/whoosh-review/
- UVI, *Whoosh Designer tips*: https://support.uvi.net/hc/en-us/articles/360001692797-Whoosh-Designer-Tips
- IRPR Sound glossary, *layering / impact / whoosh*: https://sounddesign.irpr.agency/glossary/layering/ , https://sounddesign.irpr.agency/glossary/impact/ , https://sounddesign.irpr.agency/glossary/whoosh/
- IRPR, *Why is my game audio repetitive*: https://sounddesign.irpr.agency/guides/why-is-my-game-audio-repetitive/
- Pixflow, *Sound effects layering*: https://pixflow.net/blog/sound-effects-layering ; Morphic, *How to layer sound effects*: https://morphic.com/resources/how-to/how-to-layer-sound-effects
- Krotos, *What is sound design in film*: https://krotos.studio/blog/what-is-sound-design-in-film
- Godot docs, *AudioStreamRandomizer* (random pitch/volume per trigger): https://docs.godotengine.org/de/4.x/classes/class_audiostreamrandomizer.html ; Bugnet, *footstep variation*: https://bugnet.io/blog/how-to-implement-footstep-variation-to-avoid-repetition
- 99% Invisible, *Classic cartoon sound effects* (transcript): https://99percentinvisible.org/episode/classic-cartoon-sound-effects/transcript/ ; Voices.com, *most commonly used cartoon sound effects*: https://www.voices.com/blog/most-commonly-used-cartoon-sound-effects/
- A Sound Effect, *Spider-Man: Into the Spider-Verse sound*: https://www.asoundeffect.com/spider-man-into-the-spider-verse-sound/ ; Enhanced Media: https://enhanced.media/blog/2019/9/30/spider-man-into-the-spider-verse-and-the-eye-catching-sound-elements
- Modal synthesis: CCRMA notes https://ccrma.stanford.edu/workshops/dsp2008/prc/modal.pdf ; MIT 21M.380 lecture 14 https://ocw.mit.edu/courses/21m-380-music-and-technology-sound-design-spring-2016/ ; DAFx, *Efficient modeling and synthesis of bell-like sounds* https://dafx.de/paper-archive/details/g31AEhtQ6ww5tzEZDddvkg ; Andy Farnell, *Designing Sound* (MIT Press)
- Wooden fish (mõ): https://en.wikipedia.org/wiki/Wooden_fish ; https://plumvillage.shop/products/meditation/wooden-fish/
- Sonniss licence summary: https://licenseorg.com/guide/music-audio/sonniss
- CC0 sources: https://github.com/lavenderdotpet/CC0-Public-Domain-Sounds , https://github.com/Calinou/kenney-interface-sounds , https://github.com/Calinou/kenney-ui-audio , https://github.com/KenneyNL/Starter-Kit-3D-Platformer , https://github.com/KenneyNL/Starter-Kit-Racing , https://godotengine.org/asset-library/asset?filter=kenney , https://opengameart.org/content/cc0-audio-uploader-rubberduck , https://opengameart.org/content/100-cc0-sfx

## 6. Full catalogue

Columns: name · category · description · suggested gain · when to use. **[S]** marks sounds that use recorded CC0 takes. All sounds accept `var`. Options are listed in the descriptions (dur, n, gap, surface, f0, note, bpm, loop).



### ui_* (30)

| name | description | gain | when to use |
|---|---|---|---|
| `ui_bong` [S] | soft bong | 0.45 | section marker, notification |
| `ui_button` [S] | plastic button push | 0.40 | press, remote control, elevator |
| `ui_click` [S] | crisp interface click (Kenney Interface Sounds, 3 takes) | 0.45 | buttons, cursor taps, small cuts |
| `ui_click_soft` [S] | soft rounded click | 0.40 | gentle UI taps, list items |
| `ui_close` [S] | panel closes | 0.45 | card/panel leaving |
| `ui_confirm` [S] | positive confirmation chime | 0.50 | correct answer, booking confirmed |
| `ui_counter` | accelerating tick roll for number counters (dur), optional end ding | 0.40 | price/stat counting up |
| `ui_data_blip` | short digital data blip (FM) | 0.35 | numbers updating, HUD data |
| `ui_drop` [S] | drop/plonk | 0.45 | item lands in slot, icon drop |
| `ui_error` [S] | negative/error buzz | 0.45 | wrong answer, myth busted, denied |
| `ui_glass` [S] | glassy ping | 0.40 | premium highlight, price reveal |
| `ui_hover` [S] | hover/rollover tick | 0.30 | cursor hover, subtle accents |
| `ui_key` [S] | single keyboard key | 0.35 | text typing per letter |
| `ui_maximize` [S] | expand blip (rising) | 0.45 | zoom into a card, expand |
| `ui_minimize` [S] | collapse blip (falling) | 0.45 | zoom out of a card, collapse |
| `ui_notification` | two-note marimba notification (modal bars) | 0.45 | new fact card, tip appears |
| `ui_open` [S] | panel opens | 0.45 | card/panel appearing |
| `ui_pin_drop` | map pin drop: tiny falling whistle + pop + plastic thock | 0.50 | pins landing on the map |
| `ui_pluck` [S] | plucky blip | 0.40 | list items popping in |
| `ui_pop` | bubbly pop: pitched sine blip + click transient | 0.50 | icons/stickers popping in |
| `ui_question` [S] | questioning two-tone | 0.45 | quiz question appears |
| `ui_scroll` [S] | scroll ratchet | 0.35 | scrolling lists, dial turning |
| `ui_select` [S] | select/confirm blip | 0.45 | choosing an option, map POI highlight |
| `ui_shutter` | camera shutter: two mechanical clacks + spring ring | 0.45 | photo moments, snapshot freeze-frame |
| `ui_switch` [S] | mechanical switch | 0.40 | menu switch, light switch |
| `ui_swoosh` | tight UI swoosh (synth filtered noise) | 0.40 | cards sliding, menu transitions |
| `ui_text_reveal` | soft per-letter ticks for a text reveal (n letters, gap) | 0.35 | kinetic typography, captions writing on |
| `ui_tick` [S] | tiny tick | 0.40 | counters, timeline ticks, clock seconds |
| `ui_toggle` [S] | toggle switch | 0.40 | on/off states, checkbox |
| `ui_typing` [S] | keyboard typing burst (recorded + per-key round robin), dur opt | 0.40 | type-on titles, laptop shots |

### whoosh_* (16)

| name | description | gain | when to use |
|---|---|---|---|
| `whoosh_air` [S] | recorded air blast (rubberduck) | 0.40 | air release, steam push, door draft |
| `whoosh_big` [S] | big whoosh: band sweep + sub + pitched-down organic swish | 0.55 | camera moves, big reveals, map pans |
| `whoosh_by` | close pass-by: doppler-shifted air + whistle | 0.55 | something whizzing past camera |
| `whoosh_cloth` | cloth/flag flap: noise with 14-22 Hz flutter | 0.40 | flags, capes, banners, lantern cloth |
| `whoosh_down` | falling whoosh (filter sweeps down) | 0.50 | drop, zoom out, falling objects |
| `whoosh_fire` | fire whoosh: roaring low band + crackle + sweep | 0.50 | torches, fire arrows, dragon-like bursts |
| `whoosh_huge` [S] | huge cinematic pass: low band sweep, rumble, woom layer, hall tail | 0.60 | fleet/map3d flyovers, epic transitions |
| `whoosh_med` | medium whoosh: pink-noise band sweep + air + light sub | 0.50 | scene transitions, objects flying past |
| `whoosh_reverse` | reverse swell (reversed whoosh + reversed plate) that ends on the cut | 0.50 | pre-cut suck-in, place so it ends on the hit |
| `whoosh_slash` [S] | fast slash swish | 0.50 | blade swings, fast wipes |
| `whoosh_small` [S] | small swish: synth + organic swish layer | 0.45 | cards, stickers, quick cuts |
| `whoosh_swish` [S] | organic swish (recorded stick/cloth swings, 3 takes) | 0.45 | hand gestures, quick swipes, sword-less swings |
| `whoosh_tiny` | very short airy flick (0.16 s) | 0.40 | small icons, captions flicking in |
| `whoosh_twirl` [S] | twirling multi-pass swish (recorded) | 0.45 | spins, rotations, character twirl |
| `whoosh_up` | rising whoosh (filter sweeps up) | 0.50 | zoom in, lift-off, text flying up |
| `whoosh_whistle` [S] | thin whistling swing (recorded + resonant synth) | 0.40 | thin objects swinging, sticks, cables |

### impact_* (23)

| name | description | gain | when to use |
|---|---|---|---|
| `impact_bell` | bell-like heavy metal strike | 0.50 | metal bells struck, alarm, ringing hits |
| `impact_big` [S] | big layered impact: heavy punch + boom + metal grit + hall | 0.65 | big moments, giant object lands |
| `impact_body` | punch/body hit (medium) | 0.55 | comic punches, bumping into things |
| `impact_body_heavy` | heavy punch/body slam + sub | 0.60 | big comedic hits, knockouts |
| `impact_ceramic` | ceramic plate/bowl impact | 0.45 | bowls on table, phở bowl set down |
| `impact_cinematic` [S] | cinematic trailer hit: transient + distorted kick body + sub + low metal + hall tail | 0.70 | title slams, chapter cards, reveals of scale |
| `impact_glass` | glass impact (heavy) | 0.50 | bottle set down hard, glass cracking |
| `impact_glass_light` | light glass tap | 0.40 | glass clink accents, ice tea glass |
| `impact_hit` | generic mid hit (breaking/falling/hit pack) | 0.50 | general hits, things knocked over |
| `impact_metal` | heavy metal impact with ringing tail | 0.55 | wok hit, metal gate, armour |
| `impact_metal_hit` | metal bar/sheet hit | 0.50 | pipes, pans, gates, scaffolding |
| `impact_metal_light` | light metal tap | 0.45 | spoons, keys, small tins |
| `impact_plank` | plank/board impact | 0.50 | boat planks, floorboards, signboards falling |
| `impact_slam` | door/lid slam (recorded) + sub | 0.55 | doors, lids, shutters slammed |
| `impact_soft` | soft cushioned impact + low thump | 0.50 | objects landing on cloth/sand, gentle stamps |
| `impact_soft_heavy` | heavy soft impact (body-on-ground feel) | 0.55 | falls on dirt, sacks, bodies dropping |
| `impact_squelch` | wet fruit slap/knock (melon recordings) | 0.45 | fruit, soft cartoon slaps, mango drop |
| `impact_stone` | stone/rock impact | 0.50 | stone steps, rock falls, citadel walls |
| `impact_thump` | deep thump/thunk (recorded) + sub | 0.50 | boxes dropped, heavy object on table, title thunk |
| `impact_tin` | tin can impact | 0.45 | tin roofs, cans, light sheet metal |
| `impact_wood` | heavy wood impact: recorded take + sub + room | 0.55 | crates, wooden stakes hit, doors slammed |
| `impact_wood_hit` | wooden hit (rubberduck) | 0.50 | wood props, paddles, sticks |
| `impact_wood_light` | light wood knock | 0.45 | chopsticks box, small wooden props |

### hit_* (11)

| name | description | gain | when to use |
|---|---|---|---|
| `hit_boom` | trailer boom: falling sub + noise body + air | 0.60 | reveals, cuts to wide shots |
| `hit_braam` | braam: stacked detuned octave saws, filter bloom, downward bend, hall | 0.60 | epic scale reveals (map3d, fleets, mountains) |
| `hit_comic` [S] | Spider-Verse comic punch: punch + square blip + bitcrushed "pow" | 0.60 | comic-panel hits, halftone frames, onomatopoeia text |
| `hit_glitch` [S] | glitched hit: chopped repeats with pitch steps + bitcrush | 0.55 | Spider-Verse glitch frames, tech reveals |
| `hit_heartbeat` | heartbeat (lub-dub) pair, n beats, gap | 0.50 | suspense before a reveal, quiz tension |
| `hit_metal` [S] | anvil-like metal stinger (free-bar modal partials) + recorded metal | 0.55 | dramatic reveals, sword-like accents, "ting!" moments |
| `hit_slam` [S] | title slam: snap + heavy punch + short sub drop + low metal + plate | 0.65 | art-directed titles slamming on screen |
| `hit_snap` | tight snap transient (no tail) | 0.45 | kinetic text cuts, sticker snaps, beat accents |
| `hit_sub_drop` | sub drop (90->28 Hz sine glide, saturated) | 0.60 | under title slams, dramatic drop, bass punctuation |
| `hit_taiko` | big taiko/war-drum hit (modal membrane, pitch drop, hall) | 0.60 | battle beats, chapter hits, heavy accents |
| `hit_tom` | floor-tom hit (modal membrane) | 0.50 | rhythmic accents, drum fills |

### riser_* (8)

| name | description | gain | when to use |
|---|---|---|---|
| `riser_downer` | downer: falling saw tone + falling noise, decaying | 0.45 | after a reveal, deflation, scene settles |
| `riser_downer_sub` | long sub downer with rumble | 0.50 | heavy aftermath, entering a cave, ominous fall |
| `riser_noise` | noise riser: band sweep 300->9 kHz, accelerating tremolo; ends at dur | 0.45 | build-up into a reveal; place at hit_time - dur |
| `riser_reverse_cymbal` | reversed cymbal swell (modal cymbal synthesis reversed) | 0.50 | classic pre-hit swell, magic reveal lead-in |
| `riser_short` | short 0.7 s riser (noise + tone) | 0.45 | quick build into a pop/text hit |
| `riser_suck` | reverse suck-in: big whoosh + hall, reversed | 0.50 | into black, before a chapter card |
| `riser_tension` | string-like semitone cluster tremolo with opening filter | 0.45 | suspense, "what happens next" moments |
| `riser_tone` | tonal riser: Shepard-style octave glissando + noise bed | 0.45 | tension rising, countdowns |

### trans_* (14)

| name | description | gain | when to use |
|---|---|---|---|
| `trans_film_flicker` | film projector clatter (24 fps pulses) + hiss | 0.35 | archive/old-film transitions, history flashback |
| `trans_glitch_cut` | glitch cut: stutter + bitcrush + click | 0.45 | hard cuts with digital glitch flavour |
| `trans_map_dive` | map dive: long descending whoosh with sub swell | 0.55 | diving from globe/map to street level |
| `trans_page_turn` [S] | page turn (recorded) + air | 0.45 | storybook transitions, chapter pages |
| `trans_pop_in` | element pop-in: tiny rising whoosh + pop | 0.45 | stickers, labels, emoji popping into frame |
| `trans_record_scratch` | vinyl record scratch (back-and-forth varispeed over a music-like source) | 0.50 | myth-buster stop, comedic interruption |
| `trans_slide` [S] | card slide (recorded card slides + air) | 0.45 | lower-thirds, cards sliding in |
| `trans_stinger` | whoosh into a cinematic hit (hit at +0.45 s) | 0.60 | chapter cards, location title cards |
| `trans_swipe` [S] | fast swipe: tiny whoosh + click | 0.45 | swipe cuts, carousel moves |
| `trans_tape_rewind` | tape rewind: rising chirps + warble | 0.45 | flashback, map-dive rewind, time travel |
| `trans_tape_stop` | tape stop: chord decelerating to zero with closing filter | 0.50 | comedic halt, freeze-frame, "wait, what?" |
| `trans_wipe` [S] | soft wipe (lowpassed whoosh + paper slide) | 0.45 | wipe transitions, map paper slides |
| `trans_zoom_in` [S] | zoom in: rising whoosh + rising tone + select blip on arrival | 0.50 | push-in on a map location |
| `trans_zoom_out` | zoom out: falling whoosh + falling tone | 0.50 | pull back to the wide map |

### cartoon_* (31)

| name | description | gain | when to use |
|---|---|---|---|
| `cartoon_blink` | xylophone blink (two quick high notes) | 0.40 | eye blinks, realisation, cute beat |
| `cartoon_boing` [S] | classic boing: recorded spring + vibrato sine jaw-harp layer | 0.50 | bounces, head bonks, springy jumps |
| `cartoon_bonk` [S] | hollow head bonk: wood-block modes + melon knock + tiny pitch drop | 0.55 | head hits, coconut bonk, slapstick |
| `cartoon_can_dent` [S] | small can dent/flick | 0.40 | tiny dents, flicks, tin gags |
| `cartoon_dizzy` | woozy dizzy warble (descending vibrato tone) | 0.40 | spinning eyes, confusion |
| `cartoon_fall_whistle` | falling bomb whistle (slow glide down + vibrato), optional far thud | 0.45 | Wile E. Coyote fall, object dropping from sky |
| `cartoon_gallop` | blop gallop: rapid pitched blops in triplets (dur) | 0.45 | cartoon run cycle, legs spinning |
| `cartoon_gulp` | gulp (falling resonant blip + throat click) | 0.45 | nervous swallow, eating whole |
| `cartoon_honk` | bulb horn honk (reed source + nasal formant, pitch scoop) | 0.45 | clown honk, nose squeeze, silly accent |
| `cartoon_plop` [S] | viscous bottle plop | 0.45 | drops into liquid, goo, cartoon blobs |
| `cartoon_poof` | smoke poof (lowpassed noise puff + air) | 0.45 | vanishing, magic puff, dust cloud |
| `cartoon_pop` [S] | cork/bottle pop (recorded) + synth blip sweetener | 0.50 | characters popping in, bubbles, ideas |
| `cartoon_ricochet` [S] | cartoon ricochet "pyeww" (descending whine + recorded ric) | 0.45 | bullets/stones bouncing off, deflected objects |
| `cartoon_sad_trombone` | sad trombone "wah wah wah waaah" (brassy saw + wah filter) | 0.50 | fails, wrong guesses, deflated jokes |
| `cartoon_saw_wobble` [S] | flexed pull-saw wobble (musical saw-like) | 0.45 | woozy, spooky-funny, jelly wobble |
| `cartoon_slide_bounce` [S] | slide whistle up-and-down bounce | 0.45 | bouncing, yo-yo, hopping |
| `cartoon_slide_down` [S] | slide whistle down (recorded) | 0.45 | falling, deflating, sad reaction |
| `cartoon_slide_flutter` [S] | fluttering slide whistle drop | 0.45 | leaf falling, paper floating down |
| `cartoon_slide_quick` [S] | quick slide-whistle squeak | 0.40 | blink-and-miss gags, sneaky moves |
| `cartoon_slide_up` [S] | slide whistle up (recorded, Ben Burnes) | 0.45 | rising, jumping, eyebrow raise |
| `cartoon_slide_wobble` [S] | wobbly slide whistle | 0.45 | dizzy, drunk, wobbly motion |
| `cartoon_splat` [S] | splat: squish + low thump | 0.50 | pie in face, falling into mud |
| `cartoon_spring` [S] | recorded spring twang (3 takes) | 0.45 | springs, jack-in-the-box, bounce |
| `cartoon_squeak` | rubber squeak (fast FM glide) | 0.40 | rubber ducks, squeezed toys, tiny characters |
| `cartoon_squish` [S] | squishy mud/slime | 0.45 | stepping in mud, squeezing, gross-out gag |
| `cartoon_stretch` | rubber stretch creak (rising stick-slip tone) | 0.40 | stretching limbs, pulling elastic |
| `cartoon_tada` | ta-da! brassy two-chord fanfare | 0.45 | reveals of a solution, proud moments |
| `cartoon_tiptoe` | xylophone tiptoe (modal bars, alternating notes, n steps) | 0.40 | sneaking, tiptoeing, secret moves |
| `cartoon_tweet` | birds circling a dizzy head (repeating chirp loop, dur) | 0.40 | after a bonk, dazed character |
| `cartoon_wop` [S] | saw "wop" flex | 0.40 | quick wobble accent, rubber-hose bend |
| `cartoon_zip` | zip-out: fast rising whistle + swish | 0.45 | character dashes off screen |

### foley_* (51)

| name | description | gain | when to use |
|---|---|---|---|
| `foley_bag_rustle` [S] | plastic bag rustle (recorded) | 0.35 | market shopping, snacks |
| `foley_book_close` [S] | book close/place | 0.45 | closing the guidebook, end of chapter |
| `foley_book_flip` [S] | book page flips | 0.40 | guidebook browsing |
| `foley_camera` [S] | camera shutter (synth) + recorded click | 0.45 | photo snaps, tourist cameras |
| `foley_can` [S] | can tab pluck / crush | 0.40 | soda can, beer can moments |
| `foley_card_shuffle` [S] | card shuffle/fan | 0.40 | shuffling options, quick montage |
| `foley_cards` [S] | card slide/place | 0.35 | tickets, cards dealt, menus |
| `foley_chain` [S] | chain rattle | 0.40 | bike chain, anchors, gates |
| `foley_chair_roll` [S] | chair rolling | 0.35 | office, studio scenes |
| `foley_chips` [S] | plastic chips stacking | 0.40 | counting, tokens, plastic clatter |
| `foley_clap` | single hand clap (band-passed noise burst + palm thump) | 0.45 | one clap, "let's go!", rhythm accents |
| `foley_click_mech` [S] | small mechanical click | 0.35 | flashlight, cap, latch |
| `foley_cloth` [S] | cloth rustle (Kenney RPG Audio, 3 takes) | 0.35 | character movement, gestures, sitting down |
| `foley_coin_drop` | single coin drop: ring + spinning wobble accelerating to rest (modal) | 0.45 | a tip on the counter, lucky coin, price punchline |
| `foley_coins` [S] | handful of coins (3 takes) | 0.45 | paying, tips, price beats |
| `foley_creak` [S] | wood creak | 0.40 | old houses, floorboards, boat planks |
| `foley_dice` [S] | dice throw | 0.40 | random choice, games, chance |
| `foley_door_close` [S] | door closing | 0.45 | leaving rooms |
| `foley_door_open` [S] | door opening | 0.45 | entering rooms, shops |
| `foley_drawer` [S] | drawer open/close | 0.40 | desk, kitchen drawers |
| `foley_hammer` [S] | hammer strike | 0.45 | building, workshop, crafts |
| `foley_keys` [S] | key ring jingle | 0.40 | homestay keys, motorbike keys |
| `foley_knife_draw` [S] | knife drawn from sheath | 0.40 | blades, kitchen knife reveal |
| `foley_knock` [S] | door knock pattern (n knocks) | 0.45 | knocking at homestay door |
| `foley_leather` [S] | leather handling | 0.35 | bags, belts, backpacks |
| `foley_lock` [S] | lock/latch open | 0.40 | doors, lockers, gates |
| `foley_marker` [S] | thick marker lines | 0.35 | map route drawing, underlines |
| `foley_page_turn` [S] | single page turn | 0.40 | menu reading, map unfolding |
| `foley_paper` [S] | paper handling/crumple | 0.35 | maps, tickets, wrapping |
| `foley_paper_cut` [S] | paper cut | 0.40 | tickets, cut-out art |
| `foley_paper_flutter` [S] | paper flutter | 0.35 | flyers, receipts in wind |
| `foley_pen_click` [S] | pen cap / pencil click | 0.35 | start writing, small mechanical accent |
| `foley_pen_write` [S] | pen writing on paper | 0.35 | handwritten titles, notes, postcards |
| `foley_pencil` [S] | pencil scribble/lines | 0.35 | sketching maps, hand-drawn art |
| `foley_plastic` [S] | crinkly plastic bag | 0.35 | market bags, snacks, packaging |
| `foley_ratchet` [S] | ratchet | 0.40 | tightening, mechanics, bike repair |
| `foley_rattle` [S] | bottle/pill rattle | 0.40 | shakers, rattles, maracas-like |
| `foley_riffle` [S] | riffle through pages | 0.40 | flip-book montage, searching |
| `foley_rummage` [S] | rummaging in a box | 0.40 | searching, packing a bag |
| `foley_scissors` [S] | scissors snip | 0.40 | cutting, ribbon, tailor shop |
| `foley_snap` [S] | sharp snap | 0.45 | twig snap, breaking stick, finger snap-like |
| `foley_step_carpet` [S] | single footstep on carpet | 0.40 | one step on carpet; use foley_steps for walks |
| `foley_step_concrete` [S] | single footstep on concrete | 0.40 | one step on concrete; use foley_steps for walks |
| `foley_step_dirt` [S] | single footstep on dirt | 0.40 | one step on dirt; use foley_steps for walks |
| `foley_step_grass` [S] | single footstep on grass | 0.40 | one step on grass; use foley_steps for walks |
| `foley_step_wet` [S] | single footstep on wet | 0.40 | one step on wet; use foley_steps for walks |
| `foley_step_wood` [S] | single footstep on wood | 0.40 | one step on wood; use foley_steps for walks |
| `foley_steps` [S] | walk/run sequence: n steps, gap, surface=concrete|stone|wood|grass|carpet|snow|wet|dirt (no repeats) | 0.40 | characters walking/running, approach shots |
| `foley_tape` [S] | tape pull | 0.40 | packing, taping posters |
| `foley_tools` [S] | tools handling | 0.40 | workshop, repair stalls |
| `foley_zipper` | zipper pull (accelerating micro-clicks + noise) | 0.35 | bags, jackets, backpacks |

### food_* (24)

| name | description | gain | when to use |
|---|---|---|---|
| `food_boil_broth` [S] | simmering broth: recorded boil + low synthetic blops (dur) | 0.35 | phở pot, hotpot, kitchen bed |
| `food_bottle_plop` [S] | bottle opening plop | 0.40 | opening sauce/fish-sauce bottles |
| `food_bowl_set` | ceramic bowl set down (modal porcelain + table thud) | 0.45 | phở bowl placed, rice bowls |
| `food_bubble_pot` | thick bubbling blops (lowpassed chirps) | 0.40 | chè, sauces, mud pots |
| `food_chop` [S] | knife chop on wooden board + board thump | 0.45 | herbs, garlic, chopping montage |
| `food_chop_fast` [S] | rapid chopping sequence (n chops) | 0.45 | kitchen montage, street-food prep |
| `food_chopsticks` | chopsticks tap/click pair (small wooden rods, modal) | 0.40 | eating noodles, picking up food |
| `food_coffee_drip` | phin filter drips (pitched plinks, slow, dur) | 0.40 | Vietnamese coffee brewing, quiet café beat |
| `food_crunch` | crispy crunch (bánh mì crust / spring roll): granular crackle bursts | 0.45 | biting crispy food |
| `food_cup_clink` [S] | glass/cup clink (recorded, 3 takes) | 0.45 | cheers "Một hai ba dzô!", glasses touching |
| `food_dishes` [S] | dishes clatter | 0.40 | restaurant, washing up, quán cơm |
| `food_egg_crack` | egg crack: shell micro-cracks + shell rattle + drip | 0.45 | cooking, bánh mì ốp la, egg coffee |
| `food_fizz_open` [S] | can/bottle open + fizz | 0.45 | cold drinks, beer opening |
| `food_ice_clink` | ice cubes in a glass (random modal clinks + glass ring) | 0.45 | cà phê sữa đá, iced tea, cold drinks |
| `food_knife_scrape` [S] | knife scrape on board | 0.40 | scraping chopped ingredients into wok |
| `food_knife_slice` [S] | knife slice | 0.45 | slicing herbs, mango, meat |
| `food_melon` [S] | juicy fruit tear/squish | 0.40 | cutting fruit, jackfruit, durian |
| `food_pot` [S] | metal pot handling | 0.45 | pots, lids, kitchen action |
| `food_pour_beer` | pouring beer: glug pour + fizz tail | 0.45 | bia hơi street corner, cheers moments |
| `food_pour_tea` | pouring tea: resonant band rising as the cup fills + bubbles | 0.45 | trà đá, tea ceremony, pouring drinks |
| `food_slurp` | noodle slurp: sucked noise with rising band + wet clicks | 0.45 | phở / bún slurping, eating reactions |
| `food_spoon_stir` | spoon stirring in a glass (rhythmic clinks) | 0.45 | stirring cà phê sữa, condensed milk |
| `food_wok_sizzle` | wok sizzle: dense granular crackle + hiss with swells (dur) | 0.40 | stir-fry, street food, bánh xèo pouring |
| `food_wok_toss` [S] | wok toss: metal scrape + sizzle burst + whoosh | 0.50 | flame-wok moments, chef action |

### vehicle_* (16)

| name | description | gain | when to use |
|---|---|---|---|
| `vehicle_bike_bell` | single bicycle bell ding-ding | 0.40 | bicycles, gentle street accent |
| `vehicle_boat_engine` | longtail / river boat diesel putt-putt (slow single cylinder) + water slap (dur) | 0.40 | Mekong boats, Ninh Bình sampans with motor, Hạ Long tenders |
| `vehicle_bus_brake` | air-brake hiss "psssh" | 0.45 | bus stops, arrivals |
| `vehicle_bus_horn` | bus/truck air horn (low dual tone) | 0.55 | sleeper bus, trucks on mountain passes |
| `vehicle_car_horn` | car horn (dual-tone) | 0.50 | taxis, Grab cars |
| `vehicle_crash` [S] | vehicle crash: recorded impact + glass + metal debris | 0.55 | comic crash, accident gag (keep it light) |
| `vehicle_cyclo_bell` | cyclo / bicycle thumb-bell trill "ring-ring" (modal bell, fast restrikes) | 0.45 | xích lô rides, Hội An bicycles |
| `vehicle_moto_horn` | scooter horn "beep-beep" (buzzy electric horn ~420 Hz) | 0.50 | Vietnamese traffic honks, friendly warnings |
| `vehicle_moto_horn_long` | long scooter horn blast | 0.50 | annoyed driver, traffic jam |
| `vehicle_moto_idle` [S] | motorbike idle: synthetic single-cylinder putt + recorded engine layer (dur) | 0.40 | parked Honda Cub/Wave, waiting at lights |
| `vehicle_moto_pass` | motorbike pass-by with doppler, distance filtering (v, d0 opts) | 0.50 | scooters passing camera, street scenes |
| `vehicle_moto_rev` [S] | motorbike rev: rpm 1500->6500->1800, synthetic + recorded engine | 0.50 | revving before take-off, Hà Giang loop bravado |
| `vehicle_moto_start` [S] | kick-start: two mechanical clunks, crank, catch, settle to idle | 0.50 | starting the bike at the homestay, journey begins |
| `vehicle_skid` [S] | tyre skid (Kenney racing) | 0.45 | sudden stops, near-misses |
| `vehicle_train_horn` | diesel train horn (chord, long) | 0.55 | Reunification Express, Hà Nội train street |
| `vehicle_train_pass` | train pass: rumble + wheel clacks + doppler-ish swell | 0.50 | train street, railway crossings |

### amb_* (23)

| name | description | gain | when to use |
|---|---|---|---|
| `amb_bamboo_wind` | wind through bamboo: gusts + leaf rustle + hollow culm knocks + creaks (loopable bed: dur, loop) | 0.35 | bamboo forests, Mai Châu, mountain villages |
| `amb_beach` | beach: waves + steady sea breeze + faint distant voices (loopable bed: dur, loop) | 0.35 | Mỹ Khê, Nha Trang, Phú Quốc beaches |
| `amb_boat_ride` | boat ride: putt-putt engine + water wash along the hull (loopable bed: dur, loop) | 0.35 | Mekong boat trips, Tràng An, Hạ Long cruises |
| `amb_cafe` | café: low murmur + cups/spoons + phin drips + distant street (loopable bed: dur, loop) | 0.30 | cà phê scenes, Hà Nội cafés, dialogue rooms |
| `amb_cave` | cave: deep low air + sparse echoing drips (loopable bed: dur, loop) | 0.30 | Sơn Đoòng, Phong Nha, Thiên Đường caves |
| `amb_cicadas` | cicada chorus (ve sầu): dense swelling buzz layers (loopable bed: dur, loop) | 0.30 | hot summer days, Huế, countryside noon |
| `amb_city_traffic` | Hà Nội/Sài Gòn street: recorded traffic wash + synthetic scooter swarm passes + horns (loopable bed: dur, loop) | 0.35 | Old Quarter, roundabouts, street3d scenes |
| `amb_countryside` | countryside day: birds + distant rooster + buffalo bell + breeze + light insects (loopable bed: dur, loop) | 0.30 | rice terraces, village lanes, Mai Châu valleys |
| `amb_crickets` | night crickets chorus (several voices, different pitches and rhythms) (loopable bed: dur, loop) | 0.30 | night scenes, rural homestays |
| `amb_crowd_festival` | festival crowd: dense babble + cheers swells + distant drums + firecrackers (loopable bed: dur, loop) | 0.35 | Tết streets, lantern festival, fireworks night |
| `amb_fan_room` | hot room with a ceiling fan (blade swish ~1.6 Hz + motor hum) (loopable bed: dur, loop) | 0.30 | homestay rooms, old bars, siesta scenes |
| `amb_frogs` | frog chorus after rain (ếch nhái): many croakers + small high chirpers (loopable bed: dur, loop) | 0.30 | rice paddies at night, Mekong evenings |
| `amb_jungle` | tropical forest: insects + birds + distant calls + drips (loopable bed: dur, loop) | 0.35 | Cúc Phương, Phong Nha jungle, Cát Tiên |
| `amb_kitchen` | busy street-food kitchen: wok sizzle swells + chopping + simmering pot + clatter (loopable bed: dur, loop) | 0.35 | quán ăn, street-food stalls, cooking classes |
| `amb_market` | busy market: babble + distant vendor calls + plastic bags + clinks + scooters (loopable bed: dur, loop) | 0.35 | Bến Thành, Đồng Xuân, night markets |
| `amb_monsoon` | monsoon downpour: dense rain roar + gusts + splatter + distant thunder (loopable bed: dur, loop) | 0.40 | tropical storms, rainy-season drama |
| `amb_night_village` | village night: crickets + frogs + occasional gecko + far dog + distant moto (loopable bed: dur, loop) | 0.30 | homestay nights, Hà Giang, Mekong villages |
| `amb_rain_tin_roof` | rain on a tin roof: recorded rain + metallic droplet pings + roof drum + gutter drips (loopable bed: dur, loop) | 0.35 | homestays in the rain, Hội An floods, cosy interiors |
| `amb_river` | river: recorded flowing water + burbles + low flow (loopable bed: dur, loop) | 0.35 | Mekong banks, mountain streams, Ninh Bình |
| `amb_room_tone` | quiet interior room tone (brown noise + faint 50 Hz mains hum) (loopable bed: dur, loop) | 0.25 | interiors, studio, under dialogue |
| `amb_temple` | pagoda: still air + distant birds + chant drone + occasional bowl bell and mõ (loopable bed: dur, loop) | 0.30 | Chùa Một Cột, Bái Đính, Perfume Pagoda interiors |
| `amb_traffic_far` | distant city hum (lowpassed traffic wash, occasional far horn) (loopable bed: dur, loop) | 0.30 | rooftops, hotel windows, city at night |
| `amb_waves` | sea waves: swells every ~6-9 s with foam hiss and low thumps (loopable bed: dur, loop) | 0.35 | beaches, Hạ Long, coastal roads |

### vn_* (23)

| name | description | gain | when to use |
|---|---|---|---|
| `vn_bamboo_clack` | bamboo tube knock (hollow closed-tube odd partials) | 0.40 | bamboo dance (múa sạp), bamboo forests, rafts |
| `vn_bell_recorded` [S] | recorded small bells (rubberduck) | 0.45 | shop door bells, wind-chime-like accents |
| `vn_bell_small` | small temple hand-bell (chuông gia trì) - bright, ringing | 0.45 | ritual moments, incense offering, transitions |
| `vn_bowl_bell` | struck bowl bell (chuông mõ/singing bowl): long beating partials | 0.45 | meditation, pagoda interiors, calm reveal |
| `vn_dan_bau` | đàn bầu (monochord): harmonic pluck with expressive pitch bend + vibrato | 0.45 | Vietnamese cultural reveals, emotional local colour |
| `vn_dan_tranh` | đàn tranh (16-string zither) pentatonic glissando + plucked notes | 0.45 | opening titles, cultural montage, elegant transitions |
| `vn_firecracker` | single firecracker bang + slap echo | 0.50 | single pop, gag punctuation |
| `vn_firecracker_string` | Tết firecracker string (pháo dây): dense irregular cracks + thumps + outdoor slap (dur) | 0.50 | Tết celebrations, festival openings, New Year scenes |
| `vn_firework` [S] | firework burst: recorded + synthetic crackle tail | 0.50 | Tết fireworks, Đà Nẵng fireworks festival |
| `vn_gong` | bossed gong (cồng/chiêng): clear pitched fundamental, padded mallet | 0.55 | Central Highlands culture, festival openings, chapter accents |
| `vn_gong_big` | large flat gong (tam-tam style): dense modes blooming after the strike | 0.55 | grand openings, imperial Huế, dramatic reveal |
| `vn_gong_ensemble` | Central-Highlands chiêng ensemble: 4 tuned gongs interlocking pattern (dur) | 0.50 | Tây Nguyên scenes, festival montage |
| `vn_gong_recorded` [S] | recorded gong (rubberduck) | 0.50 | gong accents with real-world texture |
| `vn_karaoke_far` | distant neighbourhood karaoke: boomy beat + echoing sung melody through a cheap speaker (dur) | 0.30 | evening alleys, comic local-colour beat |
| `vn_lion_dance` | lion dance (múa lân): big drum pattern + cymbal crashes + small gong (dur) | 0.50 | Mid-Autumn festival, Tết, shop openings |
| `vn_mo` | wooden fish (mõ): hollow woody tok, short resonant decay | 0.50 | Buddhist chanting, pagoda rhythm, gentle comic tok |
| `vn_mo_chant` | mõ chanting rhythm (steady ~100 bpm), bowl bell at the phrase end (dur) | 0.45 | pagoda interiors, meditation montage |
| `vn_mo_trau` | mõ trâu (wooden buffalo bell) clonking with the animal's steps | 0.40 | rice paddies, highland trails with buffalo |
| `vn_phach` | bamboo phách clicks (ca trù rhythm, 5 hits) | 0.40 | ca trù, imperial music, traditional rhythm beds |
| `vn_song_loan` | song loan clapper (cải lương wooden clapper): crisp double click | 0.45 | traditional theatre, southern music cues |
| `vn_temple_bell` | great bronze temple bell (chuông chùa) struck by a wooden log: doublet partials beat, long hum | 0.55 | pagoda establishing shots, dawn at a temple, solemn moments |
| `vn_temple_drum` | pagoda drum (trống chùa): deep slow hits with long resonance (n hits) | 0.50 | pagoda rituals, Huế imperial scenes |
| `vn_vendor_call` | street vendor call "rao" (non-lexical sung phrase with tonal contours, distant) | 0.35 | Hà Nội street hawkers, market alleys - texture, not words |

### crowd_* (9)

| name | description | gain | when to use |
|---|---|---|---|
| `crowd_applause` | applause: granular claps (each a band-passed burst), dur | 0.45 | performance endings, quiz correct, celebration |
| `crowd_aww` | crowd "awww" (falling pitch, a->u) | 0.45 | cute moments, disappointment, sympathy |
| `crowd_cheer` | crowd cheer: sustained "yeah!" voices + whistles + applause | 0.50 | victories, festival climax, arrivals |
| `crowd_gasp` | crowd gasp: staggered aspirated inhale through /a/ formants | 0.45 | shock reveals, prices, surprising facts |
| `crowd_kids_cheer` | children cheering "yay!" (high voices, e->a) | 0.45 | school kids, festival children, cute wins |
| `crowd_laugh` | crowd laughter: many "ha-ha" pulse trains with descending pitch, breathy | 0.45 | jokes landing, comedic beats |
| `crowd_murmur` | indoor crowd murmur / babble (non-lexical) | 0.30 | restaurants, waiting rooms, under VO for crowds |
| `crowd_ooh` | crowd "oooh" (voices u->o, pitch rise-fall) | 0.45 | impressive reveal, quiz answer, "wow" moment |
| `crowd_wow` | crowd "woah!" (u->o->a, rising) | 0.45 | amazing view reveals, stunts |

### battle_* (30)

| name | description | gain | when to use |
|---|---|---|---|
| `battle_arrow_thunk` [S] | arrow hits wood: sharp thunk + shaft quiver | 0.50 | arrows into shields, posts, ship hulls |
| `battle_arrow_volley` | arrow volley: dozens of bow twangs then a wall of whizzes (n arrows) | 0.55 | massed archers, sky full of arrows |
| `battle_arrow_whiz` | single arrow whiz-by (fletching flutter + doppler) | 0.45 | arrows flying past camera |
| `battle_bang` [S] | gunshot/bang (recorded) | 0.55 | muskets, starting pistol, sharp bangs |
| `battle_blade_strike` [S] | blade strike (Warfork CC0) | 0.50 | sword swings that connect |
| `battle_bow_release` | bow release: string twang (Karplus) + wood thump | 0.45 | archers loosing arrows |
| `battle_cannon` [S] | cannon shot (recorded) - add hit_boom for scale | 0.60 | artillery, citadel defence, signal shots |
| `battle_cannon_big` [S] | big cannon: recorded shot + sub boom + valley echo | 0.65 | fortress cannons, naval guns |
| `battle_charge_cry` | battle cry: many male voices yelling /a/ with rising pitch | 0.50 | armies charging, rebels rising |
| `battle_clash_melee` | melee: overlapping sword clashes, shield bashes, grunts-free (dur) | 0.50 | battle montage background |
| `battle_creak` | deep timber groan (stick-slip friction pulses) | 0.45 | ship hulls straining, stressed wood |
| `battle_drum_march` | marching drums loop: low drums + rim clicks (dur) | 0.45 | troops marching, historical montage |
| `battle_elephant` | war elephant trumpet (brassy formant scream + low rumble) | 0.50 | Hai Bà Trưng / Bà Triệu / Quang Trung war elephants |
| `battle_explosion` [S] | explosion: recorded blast + sub + debris | 0.60 | gunpowder, sieges, dramatic destruction |
| `battle_fire` | fire: roaring low band + stochastic crackles (dur) | 0.40 | burning ships, torches, village fires, campfires (lower gain) |
| `battle_fire_spell` [S] | fire burst (recorded) | 0.50 | fire arrows igniting, flames bursting |
| `battle_glass_break` [S] | glass breaking | 0.50 | shattering, windows |
| `battle_horse_gallop` | horse gallop: 4-beat hoof clops on dirt (dur, tempo) | 0.50 | cavalry, messengers, Trần dynasty riders |
| `battle_horse_neigh` | horse whinny (formant synthesis: rising scream then tremolo descent + snort) | 0.45 | cavalry charge, war horses rearing |
| `battle_metal_fall` [S] | metal objects falling | 0.50 | armour/weapons dropped |
| `battle_rock_break` [S] | rock breaking | 0.50 | citadel walls hit, catapult impacts |
| `battle_shield_bash` [S] | shield bash: heavy wood + metal rim + sub | 0.55 | shield walls, charge impacts |
| `battle_ship_crack` [S] | warship breaking: groan + big timber cracks + splash + debris | 0.60 | ships impaled on stakes, naval battle climax |
| `battle_splash_big` [S] | big splash: pitched-down splash + low thump + spray | 0.55 | soldiers/ships into the river, giant splash |
| `battle_stake_crack` [S] | wooden stake/beam cracking (recorded breaks + creak tail) | 0.55 | Bạch Đằng stakes, palisades breaking |
| `battle_sword_clash` [S] | sword clash: inharmonic metal ring + recorded blade hit + scrape | 0.55 | duels, generals clashing |
| `battle_sword_draw` [S] | sword drawn: recorded unsheath pitched down + metallic ring | 0.45 | readying for battle |
| `battle_war_drum` | war drum (trống trận): big membrane hits in a march pattern (n, bpm) | 0.55 | armies advancing, Bạch Đằng, Tây Sơn battle scenes |
| `battle_war_horn` | war horn / buffalo horn (tù và): brassy low tone with slow swell and pitch rise | 0.50 | call to arms, signal across the valley |
| `battle_wood_fall` [S] | wooden debris falling | 0.50 | collapsing palisades, ship debris |

### nature_* (22)

| name | description | gain | when to use |
|---|---|---|---|
| `nature_bird_chirp` | small bird chirps (2-4 quick FM chirps) | 0.35 | morning, gardens, cafés |
| `nature_bird_song` | songbird phrase (whistled notes with glides, bulbul-like) | 0.35 | countryside mornings, temples |
| `nature_bubble` [S] | underwater bubbles | 0.40 | snorkelling, fish tanks, diving |
| `nature_buffalo` | water buffalo low moo (formant u->o, breathy) | 0.40 | rice paddy scenes, countryside |
| `nature_cicada` | cicada burst: buzzing AM noise swelling and fading (ve sầu) | 0.35 | summer heat, Huế afternoons |
| `nature_cricket` | single cricket chirping (4.5 kHz pulsed carrier) | 0.30 | night, quiet pause, awkward silence gag |
| `nature_dog_far` | distant dog barks (two barks, outdoor slap) | 0.30 | village nights, alley ambience |
| `nature_drip` | single water drip "plink" | 0.40 | caves, leaks, quiet moments |
| `nature_frog` | frog croak (pulsed glottal croaks through formants) | 0.35 | rice fields at night, rainy season |
| `nature_gecko` | tokay gecko call "tắc-kè" (rattle + repeated two-syllable calls) | 0.40 | night in the village, jungle lodge, humour beat |
| `nature_koel` | koel "ko-el" call (chim tu hú), rising repeated two-note whistle | 0.35 | Vietnamese summer countryside, nostalgia |
| `nature_leaves` | leaves rustle (granular high noise) | 0.35 | forest, bamboo groves, tree shake |
| `nature_mud` [S] | mud squelch | 0.40 | rice paddies, rainy trails |
| `nature_rain_burst` [S] | rain burst: shower building in over 1.2 s (recorded rain + synth hiss) | 0.45 | sudden downpour beats |
| `nature_rooster` | rooster crow "cock-a-doodle-doo" (formant synthesis, harsh) | 0.45 | village dawn, homestay mornings |
| `nature_splash` [S] | water splash (3 takes) | 0.50 | jumping into water, paddles, fish |
| `nature_splash_small` [S] | small splash | 0.45 | pebbles, drops into ponds |
| `nature_stones` [S] | stones / pebbles tumbling | 0.45 | rocky paths, karst, landslide gag |
| `nature_thunder` [S] | thunder: recorded clap + synthetic crack and long rumble | 0.60 | storms, monsoon arrival, dramatic weather |
| `nature_thunder_far` | distant thunder rumble (lowpassed, no crack) | 0.45 | approaching storm, ominous mood |
| `nature_wave_crash` | single wave breaking on the shore (swell, crash, foam hiss) | 0.50 | beach shots, Mũi Né, Phú Quốc |
| `nature_wind_gust` | wind gust (moving band-pass noise) | 0.40 | mountain passes, Mã Pí Lèng, open plains |

### magic_* (15)

| name | description | gain | when to use |
|---|---|---|---|
| `magic_chime_up` | ascending pentatonic chime arpeggio (modal bells) | 0.45 | positive reveals, "did you know?", lightbulb |
| `magic_coin` [S] | coin pickup | 0.45 | saving money tips, rewards |
| `magic_force_field` [S] | force field hum | 0.40 | shields, barrier, protective bubble |
| `magic_gem` [S] | gem pickup shimmer | 0.45 | treasure, hidden gem places |
| `magic_harp_gliss` | harp glissando (Karplus-Strong, pentatonic, up or down) | 0.45 | dream sequences, flashbacks, lovely views |
| `magic_phaser_up` [S] | phaser rising | 0.40 | energy charging, sci-fi lift |
| `magic_poof` | magic poof: puff + sparkle tail | 0.45 | appear/disappear transformations |
| `magic_power_up` [S] | arcade power-up arpeggio (Kenney Digital) | 0.45 | level-up, unlock, achievement |
| `magic_reveal` | magic reveal: reverse cymbal swell -> bell + shimmer bloom | 0.50 | hidden gems revealed, before/after reveals |
| `magic_shimmer` | sustained shimmer (many AM partials), dur | 0.40 | golden hour, temple glow, wonder |
| `magic_sparkle` | sparkle: random high bell pings + glitter noise | 0.40 | shiny objects, clean rooms, magic touches |
| `magic_spell` [S] | spell cast: recorded spell + rising shimmer | 0.45 | transformations, fantasy beats |
| `magic_tone` [S] | digital tone motif | 0.40 | small rewards, highlights |
| `magic_twinkle` | twinkle: two-three tiny high pings | 0.35 | stars, eyes sparkling, clean shine |
| `magic_wand` | wand swish + sparkle trail | 0.40 | pointing at map, magic gestures |

### glitch_* (12)

| name | description | gain | when to use |
|---|---|---|---|
| `glitch_beep_error` | double square-wave error beep | 0.40 | system error, wrong turn on map |
| `glitch_bitcrush` | bitcrushed sweep (sample-rate + bit reduction) | 0.40 | retro-digital transitions, data dive |
| `glitch_computer` [S] | computer processing noise | 0.35 | loading, data screens |
| `glitch_data` | data stream: rapid random beeps (computing) | 0.35 | map loading, statistics computing |
| `glitch_noise` | digital noise burst with gating | 0.35 | signal interference, cut to static |
| `glitch_phaser_down` [S] | phaser falling tone | 0.40 | power loss, fail state |
| `glitch_power_down` | power-down: falling tone with closing filter | 0.45 | screen switches off, energy drained |
| `glitch_scratch` [S] | digital scratch | 0.40 | rewind accents, broken signal |
| `glitch_short` [S] | short digital glitch: 3-6 recorded micro-glitches (Kenney) stuttered with pitch steps | 0.40 | UI glitch, data corruption accent |
| `glitch_stutter` | stuttered tone/noise fragments with bitcrush | 0.40 | glitch transitions, Spider-Verse frame stutter |
| `glitch_tv_static` | TV static burst with mains hum | 0.30 | old TV/archive footage, channel change |
| `glitch_zap` [S] | electric zap | 0.40 | power surge, neon flicker |
