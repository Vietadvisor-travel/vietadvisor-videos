# Camera & Motion Language

## Camera moves (`scene.moves`)
Moves stack on top of the scene's keyframed camera (`scene.cam`). Times are scene-local seconds.

| Move | Params | Use it for | Typical length |
|---|---|---|---|
| `drift` | `amp` (1) | Gentle life on any held shot. Default for beauty shots. | whole scene |
| `handheld` | `amp` (1) | Documentary / on-the-ground feel, tension. | whole scene |
| `pushIn` | `amt` (.15), `to:[x,y]` | Emphasis while a fact is spoken. | 2–4 s |
| `pullOut` | `amt` (.25), `from:[x,y]` | Context after a detail ("…and it's 800 m deep"). | 1.5–3 s |
| `reveal` | `from:[x,y]`, `z` (2.2) | Open tight on a detail → wide landmark. | 1.5–2.5 s |
| `crashZoom` | `amt` (.6), `to:[x,y]` | Punchline / shock. Pair with a shake and a stamp. | 0.15–0.3 s |
| `bounce` | `amt` (.08) | Elastic hit on a beat (price lands, title lands). | 0.4–0.6 s |
| `panL` / `panR` | `dist` (.2) | Follow a line of things, travel. | 1.5–4 s |
| `tiltUp` / `tiltDown` | `dist` (.2) | Reveal height / depth (towers, canyons). | 1.5–3 s |
| `dutch` | `deg` (6) | Chaos, drunk, danger, comedy unease. | hold |
| `orbit` | `amt` (.06) | Fake 3D: layers with `depth` slide at different speeds. | 3–6 s |
| `dolly` | `amt` (.2) | Push in while foreground (`depth`>1) spreads out — cinematic entry. | 2–4 s |
| `follow` | `id`, `z` (1.2), `lag` (.15), `headroom` | Keep a moving character framed. | while moving |
| `focus` | `from`, `to` (depth values) | Rack focus between foreground and background layers. | 0.6–1.2 s |

Ease per move with `ease:` — `inOut` (default), `out`, `out5`, `back`, `elastic`, `bounce`, `sine`,
`smooth`, `anticipate`, `snap`, `lin`, `in`.

### Depth & focus
Give world layers a `depth`: background 0.3–0.7, subject 1, foreground 1.3–2. Depth layers:
- parallax against pans/orbits automatically,
- spread outward during `dolly`,
- blur by distance from the focus plane (`scene.focus` or a `focus` move). Use 1–3 depth layers per
  shot — blur is expensive.

## Character motion
- **Keys** interpolate numbers (x, y, s, rot, dx, dy, alpha, jump…) and switch everything else
  (pose, expr, hold, flip) at the key time. Per-key `ease`, and `dur` to make the move start late.
- **Entrances / exits**: `in: {type, at, dur}` and `out: {…}` with `pop`, `drop` (squash + dust),
  `up`, `slideL`, `slideR`, `zoom`, `fade`.
- **Auto secondary motion**: characters lean into horizontal movement and switch to `walk` /`run`
  when travelling (if their pose is `stand`). Breathing, blinking, hair/skirt/lantern sway are always on.
- **Riding**: `ride: 1` puts the character on a `moto` (or `vehicle: 'scooter'|'cyclo'`), with wheel
  spin, bumps and wind. `speed` scales the bump.
- **Squash** on impact: `in: {type:'drop'}` or keys on `squash`.

## Timing table (30 fps)
| Thing | Duration |
|---|---|
| Pop-in (`back`) | 0.3–0.4 s |
| Stagger between list items | 0.15–0.4 s (lists: 0.6–1.3 s if each is read) |
| Caption on screen | 1.6–3.4 s (≈3.5 words/s) |
| Comedic pause before punch | 0.3–0.5 s |
| Crash zoom | 0.15–0.3 s |
| Screen shake | 0.25–0.5 s, amp 6 (tap) – 22 (huge) |
| Transition | 0.4–0.6 s |
| Scene | 5–11 s |
| Hold on title | 2.5–3.5 s |
| End frame | 1.5–2 s |

## Transitions (`scene.transition = {type, dur}`)
`whip` / `whipUp` (travel) · `ink` (new chapter) · `iris` (time passes; `center:[x,y]`) · `flash`
(impact) · `zoom` (into detail) · `paper` (to explainer) · `slide` (comparison) · `fade` (calm) ·
`brand` (into end frame) · `stripes` (energetic chapter change) · `circles` (playful reveal) · `push` (A pushed out by B, lists/steps) · `cut`.

## Effects
- Particles (layer `{type:'particles', name}` or `scene.particles`): `confetti`, `petals`, `fireflies`,
  `rain`, `sparkles`, `dust`, `snow`.
- `focusLines(cx, cy, t, a)` anime emphasis lines · `speedLines(t, a)` · `burstBg()` radial burst ·
  `dustPuff()` · screen shakes `scene.shakes = [[t, amp, dur]]`.
- Film finish (grain + vignette) is automatic; `EPISODE.finish = {grain:false}` to disable.

## Research-backed rules (built into the compiler — follow them when writing raw scenes)
- **Hook ≤ 3 s**: motion + on-screen text from frame 1; the point, not a greeting. Over half of
  short-form viewers decide within 3 s. Formulas: curiosity gap ("This pass is 800 m deep. Here's
  why people still ride it."), list ("3 things nobody tells you about…"), contrarian, comparison.
- **Narration pace ≈ 150 wpm (2.5–2.6 words/s)** — captions double as the VO script; 60 s ≈ 140–150 words.
- **Visual change cadence**: short-form/animated every 2–4 s; long-form explainer sections 10–20 s
  max per idea; a burst of 5–10 quick cuts every 2–3 min; re-hook every ~60–120 s in long-form.
- **Zoom grammar**: slow push-in = tension/importance; slow pull-out = release/context; crash zoom = punchline.
- **Cut grammar**: skip a shot size between cuts (wide → close), keep screen direction consistent,
  keep the subject within ~10 % of its previous screen position across a cut, match adjacent zoom directions.
- **Timing split**: ~⅓ anticipation, ⅓ action, ⅓ follow-through; exits ~⅔ the duration of entrances;
  stagger grouped elements by 5–10 frames (0.17–0.33 s).
- **Smears**: fast moves get 1–2 frames of multiples/stretch (automatic via `LOOK.smear`).
- **Line boil**: 3–4 variants at 8–12 fps gives a hand-drawn feel (`look: boil=on`) — use for comedy
  or retro episodes, not for every video.
- **On twos** (`step=2`): characters animate at 15 fps while camera stays 30 fps — classic cartoon snap.
- **Silence/breath**: give 0.3–1 s of calm before a big reveal; never 2 s with no motion at all.
- **Sound design** (cue sheet → `--audio`): whoosh on camera/transition moves, pop on text/UI,
  impact on hits, ding on prices; music −20 to −25 dB under voice in calm parts.
- **End**: one-line CTA, hold a useful final frame (end frame), never a black card.

## Look presets (`look:` header or `EPISODE.look`)
| Key | Values | Effect |
|---|---|---|
| `grade` | warm (default) · golden · teal · night · punchy · clean | saturation/contrast + soft-light tint + bloom |
| `captions` | line · karaoke · punch | static lines · words light up as spoken · 1–3 giant words at a time |
| `boil` | off · on · <px amplitude> | hand-drawn line wobble at 8 fps |
| `step` | 1 · 2 | characters on ones / on twos |
| `smear` | on · off | motion multiples on fast moves |
Scene-level: `scene.look = { grade }`, `scene.capStyle`. Light helpers for custom shots: `godRays(x, y, t, {a})`, `glow(x, y, r, col, a)`.

## Composition QA (what `lint` checks in every sampled frame)
- **Physics**: characters/vehicles/animals/furniture above their support (`FLOAT`), bikes or buses on water, boats on land.
- **Faces**: caption over a face, face off-frame after the entrance, two faces overlapping, subject too small.
- **Text**: caption over UI text or over a key prop, text cut at the frame edge, caption outside the 9:16 safe zone.
- **Framing**: empty top half (raise the subject, zoom, or put a title/UI there).
- **Structure**: same transition twice, scene > 12 s, no camera move, missing hook text / end frame,
  three identical beats in a row, too few beat types, structure too similar to another story in `stories/`.
