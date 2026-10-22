# Motion Studio — changelog

## 2026-10 · v10.1 (layout guard, all English)
- `toontype.js` layout guard: per-frame lettering boxes (keyed by scene time); bubbles and bursts slide clear of words, never into
  the caption band. Draw big words first.
- Ep6 acts re-placed so bubbles/bursts sit beside faces, the tour group's walk lasts its caption, labels sit on empty ground.
- SKILL.md rewritten as one clean v10 house format: acted cast, designed cartoon lettering, 3-s hook, continuous action,
  no chapters, nothing overlaps, all English on screen, frames checks in both formats.

## 2026-10 · v7 (art styles)
- `engine/library/artstyles.js` + header `artstyle:` / beat `artstyle=`: 11 whole-frame looks (comic, watercolor, riso,
  papercut, dongho, lacquer, neon, pixel, vhs, chalk, storyb) with real posterisation and palette mapping, ink-line
  extraction, halftone, grain, paper and crackle textures. `references/art-styles.md` says which look fits which content.

## 2026-10 · v6 (ultimate: content, sound, music)
- **Content**: `references/content-strategy.md` (platform rules 2026, packaging, topic rubric, 40 scored ideas),
  `references/writing-retention.md` (hooks, retention model, open loops, bland-script detector, 0–100 rubric),
  `references/story-devices.md` (46 devices, recurring cast, joke density, Ep.4 critique + rewrites).
- **Sound**: `tools/sfx_pro.py` — 358 sounds in 17 categories (253 curated CC0 samples, 3.2 MB, + layered synthesis),
  per-call variation. `tools/sound_design.py` rewritten: event list → rule table → priority scheduler → bus mixer → QA
  (ep4 vertical: 6.8 → 14.0 events/10 s, 19 → 46 unique sounds, 23 → 0 silent gaps, phone loss 15.1 → 3–5 dB, −13 LUFS / −2.4 dBTP).
  `engine/timeline.js` emits character, camera, transition, UI and lettering events into the cues file.
- **Music**: `tools/music_pro.py` — 19 moods (vn_folk, vn_epic, wonder, tension, lofi_hanoi, sad_comedy …), real song form from the
  cues, anti-repetition (12 → 0 repeated 4-bar blocks), hit points, comic buttons, 9 stingers, stems, phone-band energy 20 % → 52 %.

## 2026-10 · v5 (cinema craft: lettering, sound, captions)
**New**
- `engine/library/typekit.js` — 12 art-directed lettering looks on any beat (`art=` `artfx=`): slam, stack, count, stamp, typeon,
  mask, gold, neon, comic, hand, split, sign. Seven new OFL display fonts with Vietnamese (Anton, Oswald, Playfair Display,
  Bangers, Pacifico, Patrick Hand, Bungee) as font roles `impact cond serif comic script hand sign`.
- Sound: trailer grammar in `tools/sound_design.py` — riser, boom (sub-drop), riser_hit, braam, shimmer, neon_buzz, tick_roll,
  whoosh_by (doppler), horn_far, bus_horn, air_brake, city_bed; automatic sounds for lettering, flat-3D streets (near-miss,
  bus, titles, running), shot_eyes/bird/worm, 3D set pieces, chapters, film titles; **silence before the hit** (music dips)
  automatic on big titles and on `drop=`; negative `sfx=` offsets for J-cuts.
- Captions: automatic accent colour on numbers/years/prices; `caps=off` per beat.
- Lint `cinema` checks: lettering density, too many looks, repeated angles, no silence-before-hit, no colour script.
- References: `cinematography.md`, `typography.md`, `sound-music.md`, `captions.md`. SKILL.md rewritten around a shot list
  and a WOW checklist.
**Fixed**
- A comment had swallowed the caption baseline line in `engine/ui.js` (render crash).

## 2026-10 · v4 (Ep. 4 — flat-3D sets)
- FLAT3D: pinhole camera + near clipping + painter sort + sun shading + fog for flat polygons; billboards for characters.
- Hà Nội Old Quarter street set; `street3d` directed shots (cam presets/paths, walking, flow-around, near miss, bus, titles).
- Detailed scooter + rider art (front/back, masks, passengers, plates); stratus skies; ground light pools; wires clamped near lens.

## 2026-10 · v3.2 (WOW pass)
- Real 3D: three.js r160 vendored (`engine/library/three.min.js`) + `scene3d.js` (map3d, fleet3d, solid 3D titles).
- 2D cinematic set pieces `wow_*`; Kurzgesagt-style `charstyle: nutshell`, `grade=nutshell`, places cosmos / nutshell_lab / orbit.
- Captions in 9:16 smaller (46) and lower (baseline 76 %, raised only when a beat sets capY < .6).

## 2026-10 · v3 (Ep. 3 — Vietnam's S; two formats)
- Every episode = vertical cut (≤ 3 min) + YouTube 16:9 cut (≤ 10 min); `references/viral.md` + per-episode viral research step.
- `# sshape` map beat (grow / terrain / narrow / length, country face, golden S); map zoom now scales with render size
  (it looked right in qa at .25 but tiny at full res — always audit frames from the finished file).
- Voice delivery pass: held beats on `…`/` — `, slower short punchlines; narrator default af_heart.
- `capY=` on any beat; `qa.py --fmt 16x9`; full speaker names in SRT; `make --no-deliver` no longer crashes; hats crown/mandarin.

## 2026-10 · v2 (Ep. 2 egg coffee upgrade)
**Fixed (root causes found by second-by-second QA of Ep. 2 v2)**
- Extras floated at awning/counter height: they walked on a hard-coded line 150 u above the ground. Now every place
  declares its walkway (`WALK` / `place.walk`); places without one get no automatic extras; auto extras only in
  establishing beats and they fade out from MLS inwards.
- Heads cropped in close shots (9:16): headroom now counts hair/buns/hats; shot sizes keep ≥ 2 head-widths at MS;
  hands-busy characters (hold / stir / sip / wipe…) are never framed tighter than MS.
- Talk props floated in mid-air: they now stand on a low table beside the host; coverage alternates two-shot / medium.
- Coverage silently dropped shots (sequence filter compared against dropped entries) → dialogues stuck on a wide shot.
- Info cards left the bottom half of 9:16 empty (host hidden): host now shown small below; captions between.
- Captions sat inside the TikTok/Reels bottom UI: vertical safe area y ≤ 70 %, width 74 %.
- Light-leak washed whole frames to white; stat numbers and banners overflowed narrow frames; long film titles now wrap.
**New**
- `tools/qa.py` (one still per second → contact sheets), `tools/deliver.py` (one universal < 30 MB file, SSIM-checked),
  `tools/sound_design.py` (33 synthesized foley sounds, place beds, beat grammar, `sfx=` cues, multi-mood `score:`).
- Places `metropole_bar`, `giang_kitchen`, `hanoi1946` (with tram), `cafe_giang`; props `egg_whisk_bowl`, `caphe_trung_bath`.
- `grade=sepia`; steam moment and paper titles now move (push, sway, drifting light/dust).
- Faster default narration (~3.1 words/s), tighter caption/dialogue gaps; film grain lowered (files 3× smaller, same look).

## v9 — house format (Oct 2026)
- Visual-first format: `# vis` (hero, macro, explode, vs, receipt, grid, bars, daycycle, build) + close-ups in `vis_close.js`
  (coffee, ride, ticket, cheers, bed, hagiang, trainstreet, build set buncha). Fixed HEAD / STAGE / CAPTION layout; motion bridges.
- `# nw` nutworld: the street drawn in nutshell 2D as a multiplane camera (5 planes, traffic, steam, lanterns, dawn→night,
  close-shot lens whips, POIs cart/cafe/pho/biahoi/hotel, pinned price tags).
- `transitions2.js`: zoomthru, match, liquid, burst, blobs, spin, slices, cube, ripple, bloom, stripes2, drop (+ `tc= tc2= tcol= tdur=`).
- Captions: one style only, small (34 u / 30 u) and fixed in the bottom band; capY ignored; kinetic caption styles disabled.
- One look: props in vis are drawn in the nutshell char style (no outlines); end frame redrawn in nutshell.
- lint: `ERROR format` when > 15 % of beats are talking heads or two in a row; capY warning.
- tools/sheet.mjs: contact sheet of real frames (v / h) before rendering.
- world3d.js (three.js street) kept for special set pieces only — reads as a game, not house style.
- references: vis-format.md, nutworld-transitions.md, script-frames.md, world3d.md. Reference episode: ep5v2 / ep5v2-yt.
