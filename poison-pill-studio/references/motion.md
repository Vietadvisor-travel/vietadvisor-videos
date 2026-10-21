# Motion, light, texture and cohesion: the premium recipes (v5)

## Engine mapping
| Recipe (below) | Engine |
|---|---|
| One global grade, one light direction, animated grain over EVERY frame (photos, diagrams, 3D, AI fills) | v5 finish pass in `pp_cine.js` (per look; about 15 ms a frame) |
| 2.5D photo parallax (plate, lifted subject, foreground), contact shadow, rim light, breathing | `scene` mode (`pp_art.js`) + the camera rig |
| Atmosphere with depth (motes brighten in beams, near particles blurred) | `air:` inside `scene`, or the `air` overlay on any beat: dust, bokeh, smoke, fog, rays, rain, snow, embers, ash, sparks, papers, bills, confetti, leak, lightning |
| Light sweep, sun glow, flicker, neon | `scene … light:sweep@<word>`, `sun@x,y`, `flicker`, `neon` |
| 3D pulled toward the photos (raised blacks, shared light, grain, palette) | finish pass + 3D materials and world colours follow the look |
| Easing (expo-out entrances, ≤ 10 % overshoot), staggers of 2–4 frames | built into the modes; keep custom params inside these ranges |
| Film-age stack (dust, scratches, flicker) only for archival or vintage | `look: vintage` or a `look=vintage` beat |
| Light leaks ≤ 1 per 30–60 s, only at cuts | `air:x;kind:leak` on the first beat after a cut; lint keeps it rare |

Avoid the "cheap" list: lens flares without a light source, chromatic aberration, big elastic bounces, constant shakes,
glowing text, and linear moves.

---
Scope: numeric recipes for a Canvas2D engine (no After Effects). They cover Kurzgesagt, Ordinary Folk, Buck and Giant Ant-style motion, the 12 principles, 2.5D and depth-map photo parallax, kinetic type, data-viz animation, Vox and Johnny Harris collage, light FX, texture, grading, and using AI imagery alongside archival photos.

**Units.** All timings assume **30 fps** unless noted (multiply by 0.8 for 24 fps, or by 2 for 60 fps). Easing curves are written as CSS-style `cubic-bezier(x1,y1,x2,y2)`.

**Where the numbers come from.** Some numbers are sourced: Material curves, light-leak dissolve, grain ranges, Ken Burns defaults, reading speed, studio pipeline facts and the APA guidance. Everything else is practitioner convention, synthesised from tutorials and frame-by-frame observation. Those are marked *(heuristic)* where it matters. Treat them as tuned starting points, not law.

---

## 0. The one-paragraph answer: what reads as "premium" vs "cheap"

| Premium | Cheap |
|---|---|
| Every move eased, and asymmetrically: fast out, long settle | Linear keyframes, or a symmetric ease-in-out on everything |
| Elements arrive staggered (2–4 f apart) with hierarchy | Everything pops on the same frame |
| Duration scales with distance and size | One duration (e.g. 15 f) for every move |
| Something always moves slightly (idle drift, particles, a slow push, 1–3 % scale over a shot) | Dead-static frames between animations |
| One light direction, one palette, one grain, one grade over everything | Each asset keeps its native look (stock photo, flat vector and AI render all visible as separate sources) |
| Restrained FX: grain 3–6 %, vignette 15–30 %, bloom only on emissive things | Lens flares, chromatic aberration, heavy light leaks, glow on text, drop shadows at 75 % black |
| Overshoot 3–10 %, settling in 1–2 oscillations | Elastic bounce of 30 %+ with 4+ wobbles (feels "template") |
| Depth: 3–5 layers with parallax and atmospheric fade | Single flat plane |
| Typography holds long enough to read (≥ 0.3 s per word, ≥ 1.5 s minimum) | Text flies in and out before it can be read; spinning or 3D-flipping words |

Two studios illustrate the left column. Kurzgesagt draws about 200 Illustrator panels per video (2–3 illustrators over 8–12 weeks) and animates by hand in After Effects. Ordinary Folk founder JR Canest is known for detail-oriented keyframing tightly synced to audio. The common thread is that each motion is designed, not left to tool defaults. A UI-timing guide puts it bluntly: the default curve and default duration that tools hand you are the main cause of a "cheap" feel.

---

## 1. Easing library (use these, never linear for transforms)

```
// Entrances: "emphasized decelerate" (Material 3). Long, luxurious settle.
EASE_IN_HERO   = cubic-bezier(0.05, 0.7, 0.1, 1.0)
// Exits: "emphasized accelerate"
EASE_OUT_HERO  = cubic-bezier(0.3, 0.0, 0.8, 0.15)
// Standard move from A to B on screen (Material standard)
EASE_STANDARD  = cubic-bezier(0.4, 0.0, 0.2, 1.0)
// Decelerate-only (Material legacy)
EASE_DECEL     = cubic-bezier(0.0, 0.0, 0.2, 1.0)
// Motion-design "expo out", the AE "Flow"-style snappy settle (heuristic)
EASE_EXPO_OUT  = cubic-bezier(0.16, 1.0, 0.3, 1.0)
// Gentle back/overshoot, about 5–8 % past target (heuristic)
EASE_BACK_SOFT = cubic-bezier(0.34, 1.36, 0.64, 1.0)   // ≈ 6–8 % overshoot
EASE_BACK_MED  = cubic-bezier(0.34, 1.56, 0.64, 1.0)   // ≈ 10 % overshoot (upper limit for "classy")
// Camera moves and Ken Burns: slow-in, slow-out
EASE_CAMERA    = cubic-bezier(0.45, 0.0, 0.55, 1.0)    // sine in-out
```

**Rules of thumb (heuristic, consistent with School of Motion and Material teaching):**

- **Entrance.** Use ease-out, i.e. decelerate into rest. This is the default for anything appearing.
- **Exit.** Use ease-in, i.e. accelerate away. Make it **30–40 % shorter** than the matching entrance, because exits should not compete for attention.
- **Move on screen.** Use asymmetric ease-in-out, accelerating quickly and spending about 60 % of the time decelerating. In AE terms that is outgoing influence ≈ 30–40 % and incoming influence ≈ 75–90 %. This "fast-out, long-in" graph is the single biggest premium signal.
- **Linear.** Reserve it for continuous mechanical motion: rotating planets, conveyor belts, scrolling backgrounds, particle drift, and time-of-day progressions.

### Springs (for overshoot with physical follow-through)

Use a damped harmonic oscillator per property, stepped at a fixed dt:

```
x'' = -k (x - target) - c x'     // mass = 1
```

| Feel | stiffness k | damping c | ζ = c / (2√k) | overshoot | settle |
|---|---|---|---|---|---|
| Critically damped, "expensive UI" | 170 | 26 | 1.0 | 0 % | ≈ 18 f |
| Classy pop (recommended default) | 200 | 20 | 0.71 | ≈ 4 % | ≈ 20 f |
| Lively character or icon | 300 | 18 | 0.52 | ≈ 15 % | ≈ 24 f |
| Cartoon or toy (rarely premium) | 400 | 10 | 0.25 | ≈ 45 % | 40 f+ |

Motion.dev's community preset of damping 20–25 as "balanced, professional" matches the ζ ≈ 0.6–0.8 band. Keep ζ ≥ 0.5 for documentary tone.

**Implementation.** Precompute the spring curve to a lookup table (LUT) once, then use it as an easing function over N frames. That keeps it deterministic for frame-exact rendering.

---

## 2. Timing tables (30 fps)

### Durations by element and distance (heuristic)

| Action | Frames | Seconds |
|---|---|---|
| Small icon or label pop-in (scale 0 → 1) | 8–12 | 0.27–0.4 |
| Text line slide-up + fade (20–40 px travel) | 12–18 | 0.4–0.6 |
| Card or panel entrance (travel < 25 % of frame) | 15–20 | 0.5–0.67 |
| Large element crossing half the frame | 20–30 | 0.67–1.0 |
| Full-screen wipe or transition | 12–20 | 0.4–0.67 |
| Camera push between scenes (big zoom) | 30–45 | 1.0–1.5 |
| Ken Burns or idle push for a whole shot | shot length (3–8 s) | — |
| Exit of any element | 0.6–0.7 × its entrance | — |
| Hold after an element settles, before the next beat | ≥ 6–10 | ≥ 0.2–0.33 |

**Scale duration with distance.** A practical formula (heuristic) is `dur_frames = clamp(10 + 0.02 × distance_px, 10, 36)` at 1080p.

### Stagger

- **Sibling items** (list rows, bars, icons, letters of a word): a **2–4 f** offset per item. Grouped animations of 12 or more items should finish within **~20 f of total stagger**, so for large sets use `stagger = min(3f, 20f / n)`.
- **Hierarchy** (overlapping action): root on frame 0, primary at +1–3 f, secondary at +3–6 f, tertiary at +6–10 f.
- **Per-letter kinetic type:** 1–2 f per character, or 3–5 f per word.
- **Stagger order** follows reading order (top→bottom, left→right) or radiates from the focal point. A random order of ±1 f jitter on top of a structured order adds life.
- **Weight.** Offsetting the X-scale and Y-scale keyframes of the same object by **1 f** reads light and snappy; **2 f** reads heavier and softer.

### Follow-through and secondary motion

- Secondary parts (hair, antenna, label tags, shadows, hanging wires, leaves) continue **4–8 f** past the primary stop. Implement this as a lagged copy: `secondary(t) = primary(t − lag)` with lag = 2–4 f plus its own spring.
- A **fast stop** gets a longer follow-through (6–8 f, bigger amplitude). A **slow stop** gets a subtler one (3–4 f).
- Rotational drag: when an object translates, tilt it **2–6°** opposite to travel, proportional to velocity (`rot = −k·vx`, k tuned so that maximum velocity gives ≈ 5°). Settle it with a spring (ζ ≈ 0.5).

### Anticipation

- Before a big move, pull back by **5–10 % of travel distance** (or scale down to 0.95) over **4–6 f**, then go. Skip it for small UI-like moves under 100 px, where it reads as fussy.
- For a pop-in, use scale 0 → 1.06 → 0.98 → 1.0, or a spring with ζ 0.6. On a 2-bezier version: 0 → 1.06 over 8 f with expo-out, then 1.06 → 1.0 over 6 f with sine in-out.

### Squash and stretch (volume-preserving)

- Keep `sx · sy = 1`. Stretch along velocity: `s = 1 + min(0.15, |v| · k)`, so `sy = s`, `sx = 1/s`.
- Documentary or premium caps: **≤ 8 % stretch** for objects, **≤ 15 %** for characters or blobs. Never apply it to text or photos.

### Arcs

Never move a character or object in a straight diagonal over large distances. Add a perpendicular offset `sin(πt) · 0.08 · distance` to bend the path into a gentle arc.

---

## 3. "Alive" idle motion (the Kurzgesagt and Ordinary Folk secret)

Premium frames are never fully still. Layer the following continuous motions, all **linear or sinusoidal and low amplitude** (heuristic values at 1920×1080):

| Element | Motion | Amplitude | Period |
|---|---|---|---|
| Whole scene (camera) | Slow push-in | 2–4 % scale per shot (≈ 0.5 % per s) | shot length |
| Background stars or particles | Drift | 2–10 px/s | — |
| Floating objects (cells, planets, islands) | Bob y + rotate | 3–8 px; 1–3° | 3–6 s, with phases randomised per object |
| Characters | "Breathing" scale y | 1–1.5 % | 2.5–4 s |
| Glows and emissives | Opacity flicker or pulse | ±5–10 % | 1.5–4 s (use 2–3 summed sines at incommensurate periods, or smooth noise) |
| Water or atmosphere | Gradient band shift | 5–20 px | 6–10 s |

**Noise.** Use 1D smooth value noise or simplex noise (not `Math.random` per frame) for wobble, seeded per object for determinism.

### Atmospheric particles (dust, motes, spores, stars)

- **Count at 1080p:** 40–120 visible motes for "air", 150–400 for a star field. More reads as snow or noise, fewer as dirty pixels.
- **Size distribution:** 70 % at 1–2 px, 25 % at 2–4 px, 5 % at 4–8 px (out-of-focus bokeh, blurred 2–6 px at opacity 0.15–0.35).
- **Speed:** 3–15 px/s drift plus per-particle sine wander (±4 px, 3–7 s). Near particles move 2–4× faster than far ones (parallax).
- **Opacity:** 0.15–0.6. Twinkle via `opacity · (0.7 + 0.3 · sin(ωt + φ))`.
- **Blend:** `globalCompositeOperation = 'lighter'` (additive) or 'screen'. Tint the motes with the scene's key-light colour, not pure white.
- **Inside light beams:** multiply particle alpha by beam intensity at the particle's position, so motes brighten ×2–3 in the beam. This single detail sells volumetric light.

---

## 4. Layering and depth (Kurzgesagt-style construction)

Kurzgesagt's look comes from rounded vector shapes and vibrant, controlled palettes. Depth comes from discrete layers with **atmospheric perspective**, not from realism.

### Layer stack (back to front) and parallax ratios

The camera moves by Δ; each layer moves by Δ × ratio.

| Layer | Parallax ratio | Blur (px at 1080p) | Atmospheric treatment |
|---|---|---|---|
| Sky or gradient backdrop | 0.0–0.05 | 0 | — |
| Far background (mountains, city, nebula) | 0.15–0.25 | 0–2 | Mix 40–60 % toward the sky colour, lower contrast |
| Mid background | 0.4–0.5 | 0–1 | Mix 15–25 % toward the sky colour |
| Subject plane | 1.0 | 0 | Full saturation and contrast |
| Foreground framing (leaves, rocks, silhouettes) | 1.3–1.8 | 4–12 | Dark silhouette at 70–90 % value-down; fill with the darkest palette colour |
| Overlay particles | 1.5–2.5 | 2–6 | Additive |

- **Scale with depth.** When the camera dollies (zooms), use `layerScale = 1 + zoom × ratio`, not a uniform scale. That is what makes it 2.5D instead of a flat zoom.
- **Fake depth of field.** Blur only the foreground and far layers. Canvas `ctx.filter = 'blur(6px)'` is expensive, so pre-render blurred layers to offscreen canvases once per asset (the blur is static), then transform.

### Flat-but-lit shading recipe (Kurzgesagt-like)

For every shape, use the following (heuristic, observed):

1. **Base fill.** One flat colour from the palette.
2. **Shadow side.** The same shape, clipped and offset 6–15 % of its size away from the light. Use the base colour shifted **−8 to −15 L\*** and **hue-shifted 10–20° toward blue or violet** (cool shadows), at full opacity. Alternatively use multiply with a palette shadow colour at 30–50 %.
3. **Highlight side.** A thin crescent toward the light, at +8–12 L\* and hue-shifted 5–15° toward yellow (warm light).
4. **Rim light** on subjects against dark backgrounds. Use a 2–4 px stroke on the light-facing edge in a light colour (often the complementary accent, e.g. cyan rim on an orange subject), at 60–100 % opacity. Construct it as the shape minus the same shape offset 3 px toward the light, using `destination-out` on an offscreen canvas.
5. **Gradient overlay.** A linear gradient on top: transparent → 10–20 % darker, in the light direction. This adds volume without leaving the flat style.
6. **Emissive objects** (stars, screens, cells, lamps) get bloom (see §8). Nothing else glows.

**Global light.** One direction per scene, typically top-left at about 135° (or the scene's narrative light source). Store `scene.lightDir` and derive all highlight and shadow offsets from it. That shared light is what makes 50 assets look like one illustration.

### Colour script

Pixar-style colour scripts plan **the palette per scene as an emotional arc**: a strip of thumbnails read left to right, with intensity tracking emotion. For a video, plan the following.

- **Per-scene palette.** 1 background hue family, 1 dominant mid-tone, and 1–2 accents (saturated, used on ≤ 10 % of pixels for the focal point).
- **Arc.** Calm or neutral (desaturated, cooler) → tension (higher contrast, complementary clash) → resolution (warm, brighter). *Up* goes vibrant → grey-brown in grief. *Coco* sets warm against cool purples and blues.
- **Implementation.** Define `scenes[i].grade = {lift, gamma, gain, tint, sat}` and interpolate between grades across transitions over 15–30 f, so colour changes feel motivated rather than cut.
- **Kurzgesagt habit.** Background colours are dark and saturated (deep navy or purple, not black). Subjects are bright and saturated. Never use pure #000 or #FFF; clamp to roughly L\* 8–95.

---

## 5. 2.5D photo parallax ("The Kid Stays in the Picture" effect)

This effect was popularised by the 2002 Robert Evans documentary. A single photo is split into planes (fg, mid, bg), holes behind the cut-outs are filled, and the planes are moved in pseudo-3D. More planes make a believable camera move harder, so **2–3 planes is the sweet spot**.

### Recipe

1. **Plates.**
   - bg = inpainted background (AI-fill or clone).
   - subject = cut-out with a 1–2 px feathered alpha.
   - Optional fg plate (an object nearest the camera).
   - Extend the bg plate 10–15 % beyond the frame on all sides.
2. **Camera move per shot.** Use **4–7 s** with EASE_CAMERA (sine in-out) or linear with 10 f ease at each end.
   - Subject scale 1.00 → 1.06–1.10 (push in), or a lateral move.
   - bg scale 1.00 → 1.02–1.04 (it moves **30–50 %** as much as the subject).
   - Lateral shift: subject 20–40 px, bg 6–15 px, fg 50–80 px (opposite direction feel via larger magnitude).
   - Overall: the **subject/background parallax ratio ≈ 2–3 : 1**. Above 4 : 1 the "cardboard cut-out" look becomes obvious. Some docs use that deliberately, but for premium keep it subtle.
3. **Depth cues.**
   - Blur the bg plate 1–3 px (fake shallow DOF) and drop its contrast by 5–10 %.
   - Add a soft contact or drop shadow from the subject onto the bg: 20–40 px blur, 15–25 % opacity, offset along the scene light direction. This hides the cut seam.
4. **Edge hygiene.** Choke the alpha by 1 px and feather 1–2 px. Halos are the #1 tell, so check them on the brightest bg.
5. **Never combine** with spinning or rotation over 2°. The illusion breaks.

**Plain Ken Burns (single plane)** reference values: library defaults are end-scale 1.2–1.3 over a clip. An FFmpeg recipe uses 0.001 zoom per frame (≈ 2.5 %/s at 25 fps). For premium docs, use **5–12 % total over 5–8 s**, eased in and out (*heuristic*). Above about 3 %/s it starts to feel like a slideshow app.

---

## 6. Depth-map photo animation (Depth Anything, DepthFlow-style)

**Pipeline.** Estimate monocular depth (Depth Anything V2 is preloaded by the open-source DepthFlow), then displace pixels by `offset = depth × cameraShift`. Google's Cinematic Photos write-up notes:

- Only **relative depth** is needed.
- **Stretching at depth discontinuities** is the main artifact, and it grows with camera travel.
- Depth accuracy at **person boundaries** matters most. Google fixes it with median filtering plus segmentation masks that pull misclassified foreground pixels forward.

### Canvas2D-friendly implementation

Per-pixel displacement is costly in 2D, so do one of two things:

- **(a) Bucket the depth** into 4–8 slices with feathered masks and parallax each slice like §5. Each slice gets its own ratio `r = depth_mean^1.2`.
- **(b) Run a WebGL pass offscreen** and draw the result back into the 2D canvas.

### Safe parameters (heuristic)

- Maximum displacement of the nearest pixel: **1.5–3 % of frame width** (30–55 px at 1080p) over the full move. Above ≈ 4 %, smearing becomes visible.
- Preferred motion: slow dolly-in combined with a slight lateral or circular orbit. The circle radius should be 0.5–1 % of the width, with a period equal to the shot length (or 6–10 s for loops).
- Pre-process the depth: median 5×5, then a bilateral blur, then **dilate the foreground depth by 2–4 px** so edges belong to the foreground. Clamp to the 2nd–98th percentile.
- "Steady" focal plane: set the zero-displacement depth at the subject. The subject stays locked while bg and fg move in opposite directions, so stretching is split between two smaller amounts.
- Add 2–4 % grain **after** displacement. It masks smeared areas.

---

## 7. Kinetic typography and on-screen text

### Reading time (sourced ranges)

- Adult silent reading is ≈ 5 words/s. "Don't Blink" flashed words for 5–7 f (≈ 0.2 s) **only because each word was a single beat synced to VO**.
- Teaching guidelines: ≥ 3 s per on-screen phrase, ≤ 3 words/s.
- **Engine rule (heuristic synthesis):** `hold_s = max(1.5, 0.3 × words + 0.5)` after the text finishes animating in. Text that duplicates the VO can use 0.2 s/word synced to the spoken word.

### Premium text motion

- Build lines with a **mask reveal** (text slides up 40–60 % of its cap height from behind a clip rect), 12–16 f, EASE_EXPO_OUT, stagger 3–4 f per line or 2 f per word. This is cleaner than fades or scale.
- Pair it with an opacity 0 → 1 over the first 60 % of the move.
- Use at most a slight tracking animation (letter-spacing +2 % → 0 over 20 f). Never use rotation, 3D flips, bounce at more than 5 %, or per-letter colour cycling.
- **Highlighter sweep** (Vox signature): draw a rectangle behind the word, scaleX 0 → 1 from the left over 10–14 f with EASE_STANDARD. Use the colour at ≈ 85 % opacity with multiply blending and slightly ragged edges, ±1–2 px noise on the top and bottom edge.
- **Numbers:** count up with EASE_DECEL over 20–40 f. Use tabular figures (`font-variant-numeric: tabular-nums`) so digits do not jitter. Land on the final number 4–6 f before the VO says it.
- **Exits:** 8–10 f, opacity plus 10–20 px drift in the direction of the next beat.

### Typography for documentaries

- **Fonts:** 1 serif for headlines (editorial and Vox-like), 1 grotesk for labels.
- **Labels:** 28–40 px at 1080p.
- **Safe margins:** keep text inside 90 % title-safe.
- **Legibility:** text on photos gets a scrim, a 40–60 % gradient from the darkest palette colour behind it, not a drop shadow.

---

## 8. Light effects (restraint is the whole game)

### Bloom or glow (emissive objects only)

Canvas approach:

1. Draw the emissives to an offscreen canvas at ¼ resolution.
2. Blur it twice with `filter blur(8px)` and `blur(24px)` (in ¼-res pixels that is a large radius).
3. Composite back with `'lighter'` (additive) at 0.3–0.6, or `'screen'`.

A two-radius bloom (tight core plus wide halo) reads far more "optical" than one blur. Keep the halo tinted with the object colour, not white.

### God rays (volumetric beams)

Classic method (GPU Gems 3): render the light source and occluders (black) into a ¼–⅛-size buffer, then apply a radial blur toward the light position. The parameters are density, decay, weight and samples.

**Canvas2D cheap version** (heuristic):

- Draw the light buffer.
- Run 6–10 passes of `drawImage(self)` scaled **1.02–1.06×** around the light point, at 0.85 alpha each. This is iterative radial zoom-blur.
- Composite with 'screen' at 0.2–0.45.
- **Animate** the light point ±1–2 % of the width, or rotate the occluders slowly, so the rays sweep subtly.
- **Directional beams** (window light): use 3–7 long feathered trapezoids with a linear gradient from 25 % to 0 % opacity. Each one's opacity breathes ±20 % with noise over 2–5 s. Add dust motes that brighten inside the beams (§3).

### Light leaks

- **Blend:** Screen (natural) or Add/'lighter' (more glow).
- **Use them only at transitions.** Align the **brightest frame with the cut**. Ramp up over ≈ 8–15 f and down over 10–20 f. Use a 3–4 f cross-dissolve at the ends of leak assets that do not start or end on black.
- **Procedural version:** 2–3 large radial gradients (orange #FF8A3D, magenta #FF4D6D, warm yellow), 40–80 % of the frame size, drifting 50–150 px across the window. Peak opacity is 0.35–0.6 on 'screen'.
- **Frequency:** at most 1 leak per 30–60 s of video. More than that reads as a wedding-video template.

### Lens flares and chromatic aberration

- **Lens flares:** generally "cheap" signals in explainers. Only use them when a literal bright light source (sun or star) is in frame. Then use 1 subtle anamorphic streak (horizontal, 2–4 px tall, 0.15–0.3 opacity) and no ring and ghost chains.
- **Chromatic aberration:** if used, ≤ 1–2 px RGB offset, at frame edges only (scaled by radius), and never on text.

### Vignette

- Radial gradient from transparent at 55–65 % radius to the palette's darkest colour (not pure black) at the corners.
- **Strength:** 15–30 % for illustration, 25–40 % for archival photos (helps focus and hides edges). Use multiply or 'source-over' with a dark colour.
- Elliptical, matching the frame aspect.
- Breathing (±2 %) is optional.

---

## 9. Texture overlays (the glue for mixed media)

### Film grain

- **Ranges:** subtle grain is 10–30 % layer opacity in Photoshop terms (15–30 % subtle, 40–60 % prominent in compositor terms). Web overlays use 0.05–0.07 opacity. An 8–15 % noise amount suits Premiere-style noise.
- **Engine recipe (heuristic):**
  1. Pre-generate **8–12 tiles** of 256×256 monochrome Gaussian noise, centred on 50 % grey with σ ≈ 18–25 /255.
  2. Each frame, pick a random tile and a random offset. Grain changes **every frame** (or every 2nd frame at 24 fps for a filmic look).
  3. Draw with `'overlay'` (or 'soft-light') at **0.06–0.12** for illustration, **0.10–0.18** for archival or photo scenes.
  4. Scale the tile 1.0–1.5× for a coarser 16 mm feel.
- **Must be global:** apply it after everything, including text. Shared grain is what visually welds AI renders, vector and photos together.
- **Static vs moving:** static grain looks like a dirty screen, so **always animate it**.

### Paper texture (collage and Vox look)

- A scanned paper texture over the full frame, 'multiply' at 0.15–0.35 (warm off-white #F2EAD8 to #E8DCC0 base).
- For cut-out photos on paper:
  - Torn or deckled edge masks (irregular alpha, 3–8 px roughness).
  - Paper drop shadow: offset 4–10 px along the light direction, blur 8–16 px, opacity 0.25–0.4, colour = dark warm brown, not black.
  - A slight rotation of ±1–4° per item.
- **Stop-motion feel:** Vox animates graphics at **12 fps inside a 24 fps edit**. Implement this by quantising animation time to every 2nd frame (`t_anim = floor(frame/2)*2`) for collage elements only, while grain and camera still run every frame.
- **"Boil":** jitter the position of cut-out elements by ±0.5–1 px and rotation by ±0.3°, changing every 2–3 frames.

### Halftone

- Convert the photo to luma.
- Draw a dot grid (cell 6–12 px at 1080p, angle 45° for mono, or CMYK at 15/75/0/45°) with radius ∝ √(1 − luma).
- Composite the dots in a palette ink colour over a paper colour.
- **Use it as a style for archival photos in collage scenes.** Halftone is also a useful honesty marker for AI-generated imagery (see §11).
- **Cache per asset.** Never compute it per frame; animate only the reveal or mask.

### Film dust and scratches

- **Dust:** 0–3 specks per frame, 1–4 px, random positions, 1–2 frame lifetimes, 'screen' (white specks) or 'multiply' (dark specks), opacity 0.3–0.7.
- **Scratches:** one vertical line for 4–20 f, 1 px, opacity 0.1–0.2, x jitter ±2 px.
- **Gate weave:** whole-frame translate ±0.5–1 px with smooth noise (0.5–1 Hz). Archival sections only.
- **Flicker:** brightness ±1.5–3 % per frame, archival only.
- Keep all of these **off** in modern or flat scenes. Switching the "film age" stack per section signals era, a technique used across Johnny Harris and Vox historical segments.

---

## 10. Colour grading for cohesion across mixed media

The consensus approach is **one global grade or glaze over everything**, a shared texture layer, and **a single imposed light direction**. Then selectively desaturate the surrounding elements while keeping full saturation on accent elements.

### Engine pipeline (per frame, after compositing all layers)

1. **Per-asset normalisation (pre-render, cached).** Photos and AI images get the following before entering the scene:
   - Auto-levels to the 1st–99th percentile.
   - Saturation × 0.7–0.85.
   - White balance pulled toward the scene key-light temperature.
   - **Palette-map** (optional, strong cohesion): a 3D LUT or gradient-map toward the scene palette at 20–40 % mix.
2. **Global grade.** Apply it via a WebGL LUT, or in 2D with layered composites:
   - **Lift (shadows tint):** fill with the shadow colour (e.g. teal-navy #12304A) using 'lighten' at 0.1–0.2 for raised, filmic blacks (black floor at L\* ≈ 6–10).
   - **Gain (highlight tint):** warm (#FFE2B8) 'soft-light' at 0.1–0.2.
   - **Overall tint:** 'color' blend of the scene key colour at 0.05–0.12.
   - **Saturation:** 'saturation' blend with grey at 0.1–0.25 to desaturate uniformly. Then redraw the 1–2 focal accent elements on top un-graded or less graded. This is the "selective saturation" trick.
3. **Shared light.** Add a large soft radial gradient from `scene.lightDir` on 'soft-light' at 0.15–0.3, plus vignette (§8). This is the "digital lighting layer" that imposes one light direction over photos shot under different light.
4. **Texture.** Grain (and paper, if collage) last.

### Matching 3D renders and flat diagrams to photos

- **3D renders:** pull them toward photos by:
  - Adding 1–2 px blur (renders are too sharp).
  - Grain.
  - Black floor raised to the same lift.
  - Specular highlights clamped to ≤ L\* 95.
  - Rim light coloured like the scene key light.
- **Flat diagrams over photos:** draw them in the **palette's ink colour** (not pure white).
  - Add a 1–2 px "paper" drop shadow or 'multiply' the diagram strokes at 85–90 %.
  - Lines should draw on (stroke-dashoffset style) over 15–30 f with EASE_STANDARD.
  - Map borders and highlights should glow subtly (bloom at 0.2) if the scene is dark.
- **Consistency checks (automatable):**
  - Mean luminance per scene within ±10 %.
  - Each asset's 5th-percentile luminance (black point) within ±3 L\* of the global floor.
  - Dominant hue of every asset within 30° of the scene palette, or explicitly an accent.

---

## 11. AI-generated imagery alongside real archival (2024–2026 practice)

### Context

- The **Archival Producers Alliance** published *Best Practices for Use of Generative AI in Documentaries* (Sept 2024). It is endorsed by IDA, the Alliance of Documentary Editors and Kartemquin, among others. Key points:
  - Treat GenAI imagery with the same intentionality as a recreation.
  - Keep a **GenAI cue sheet**.
  - Credit AI elements like archival or music.
  - Never create fake "archival" assets.
- **Backlash example:** Netflix's *What Jennifer Did* (2024) was criticised for AI-looking "photos" of a real person.
- **YouTube:** disclosure is required for realistic synthetic content (real people's likeness, altered real events or places, realistic scenes). As of 2026 the label sits under the player for long-form videos and can be auto-applied when undisclosed photoreal AI is detected.
- **Faceless documentary channels** (the Fern, MagnatesMedia, Wordy Tales style) widely use Midjourney or Leonardo stills as narration illustration.

### Sensible use (what reads as honest and premium)

1. **Use AI for non-evidentiary roles:**
   - Atmospheric backgrounds (skies, landscapes, textures).
   - Generic objects and props (a ledger, a 1960s telephone, a cargo ship).
   - Establishing moods.
   - Fillers between archival beats.
   - Extending or inpainting archival plates for parallax (fill holes and frame edges).
2. **Never use AI** for depictions of real, identifiable people or specific real events that a viewer could read as a photo of record.
3. **Stylise AI to signal "illustration":** push it through the same collage or illustration treatment (halftone, paper, palette-map at 40–70 %, posterise). It then reads as artwork, not evidence. The APA notes that a grainy, dated-looking AI portrait among real archival photos will be read as authentic even if the credits disclose it. **Do not** age AI images to match archival.
4. **Visual separation:** keep real archival in its own "frame language" (photo border, date caption, film-age stack). Keep AI and illustration in the "world" layer (backgrounds, collage, parallax environments).
5. **Upscale and clean.** AI outputs need the same grade, grain and light-direction normalisation as everything else (§10), or they look plasticky. Typical fixes:
   - Reduce micro-contrast and clarity by about 10–20 %.
   - Desaturate by 15–25 %.
   - Add grain.
   - Slightly blur over-sharp "AI detail".
6. **Disclosure:** use the YouTube "altered or synthetic" toggle when any photoreal scene is generated, and add an on-screen tag for AI reconstructions (e.g. a small "Illustration" or "AI reconstruction" corner label, 18–22 px, 60 % opacity).

---

## 12. Data-visualisation animation (NYT, The Pudding, Bloomberg, Vox)

Principle: **animated transitions show the interpolated in-between states**. They are triggered by narrative beats, not continuous gimmicks, and should be restrained. In video, each VO sentence is the equivalent of a scroll step.

### Recipes (heuristic)

- **Axes first, then data.** Axes and gridlines fade in over 10–15 f (gridlines at 10–20 % opacity, ink colour). Data starts 6–10 f later.
- **Bar charts:** bars grow from baseline with EASE_EXPO_OUT over 15–24 f, stagger 2–3 f, in sorted or reading order. Value labels count up in sync and land 2–4 f after the bar.
- **Line charts:** draw on left → right (dash-offset) at **constant speed in x**. Linear (or very mild ease) is right here, because time must look uniform. The duration matches the VO span (1–4 s). A leading dot (4–6 px) with a glow travels with the tip, and the end label fades in when the line arrives.
- **Highlighting:** dim non-focal series to 20–30 % opacity and desaturate them. The focal series goes to accent colour with a 2× stroke width, over 10–12 f.
- **State changes** (re-sort, re-scale): 20–30 f, EASE_STANDARD. Animate the axis and the data together so the viewer can track the objects.
- **Bar chart race:** interpolate values linearly between keyframes (d3 convention is about 10 interpolated frames per data step, at ≈ 250 ms per step on the web). Animate rank changes with ease. Avoid it when exact values matter.
- **Maps** (Johnny Harris and Vox, typically via GEOlayers in AE):
  - A muted base map with a paper texture.
  - A highlighted country fills with the accent colour, wiping in over 12–20 f.
  - Borders draw on.
  - The camera pushes in 30–60 f with EASE_CAMERA.
  - A mask or shape reveal is scaled to mimic zoom-out.
  - Labels pop with a 5 % overshoot.
- **Numbers on screen:** at most 1 key number per beat. Hold it ≥ 2 s.

---

## 13. Premium shot assembly checklist (for the engine's defaults)

```
FPS = 30
DEFAULT_IN   = { dur: 15, ease: EXPO_OUT, from: { y:+24, opacity:0 } }
DEFAULT_OUT  = { dur: 10, ease: EASE_OUT_HERO, to: { y:-12, opacity:0 } }
STAGGER      = 3            // frames, siblings
POP          = spring(k=200, c=20)   // ≈4 % overshoot
CAMERA_DRIFT = scale 1.00→1.03 over shot, EASE_CAMERA
PARALLAX     = [0.05, 0.2, 0.45, 1.0, 1.5]
PARTICLES    = 60–100 motes, 3–15 px/s, alpha .15–.6, additive, key-light tint
GRAIN        = mono, σ=20/255, overlay, .08 (illustration) / .14 (photo), per-frame
VIGNETTE     = .22 (illus) / .32 (photo), start 60 % radius, darkest palette colour
BLOOM        = emissives only, ¼-res, two radii, .4 'lighter'
GRADE        = lift tint .15, gain warm .12, sat −15 %, accent exempt
LIGHT_DIR    = per scene, drives highlights / shadows / rim / drop shadows
TEXT_HOLD    = max(1.5 s, 0.3 s × words + 0.5 s)
TRANSITIONS  = cut on VO beat (default); match-cut or camera push for topic shifts;
               light leak ≤ 1 per 45 s; whip-pan 8–10 f with 20–40 px directional blur
```

### Transition taxonomy (premium)

- **Hard cut on a beat** is the default (about 70 % of transitions).
- **Camera continuity:** push into an object that becomes the next scene, 30–45 f.
- **Match cut:** shape or colour carries over.
- **Mask wipe** with a palette-coloured leading edge: 12–16 f.
- **Avoid** cube spins, page curls, star wipes, and default cross-dissolves longer than 15 f between graphics. Dissolves are fine between photos (10–20 f).

### Sound sync

Premium motion lands on audio. Key poses should hit **0–2 f before** the corresponding SFX or VO stress (the eye leads the ear). Whooshes start 4–6 f before the motion peak.

---

## Sources

**Studios, Kurzgesagt, Ordinary Folk, Buck, Giant Ant**
- https://artsatmichigan.umich.edu/ink/2019/09/27/simple-bright-beautiful-the-work-of-kurzgesagt
- https://www.lingq.com/en/learn-english-online/courses/689474/how-to-make-a-kurzgesagt-video-in-120-4887128/ (Kurzgesagt "How to make a Kurzgesagt video in 120 hours" transcript)
- https://www.skillshare.com/en/classes/Motion-Graphics-with-Kurzgesagt-%E2%80%93-Part-1/631970755
- https://www.schoolofmotion.com/blog/how-to-design-for-animation-with-ordinary-folk
- https://schoolofmotion.com/podcast/ordinary-folk-interview
- https://2020.motionawards.com/judge/jorge-r-canedo-estrada/
- https://motionhatch.transistor.fm/episodes/98-how-giant-ant-became-a-leading-motion-design-studio-w-jay-grandin

**Animation principles, easing and springs**
- https://playbooks.com/skills/dylantarre/animation-principles/video-motion-graphics
- https://playbooks.com/skills/dylantarre/animation-principles/follow-through-overlapping
- https://invideo.io/faq/why-does-staggering-width-and-height-keyframes-by-12/
- https://www.adobe.com/uk/creativecloud/animation/discover/principles-of-animation.html
- https://dribbble.com/stories/2020/07/27/disney-principles-of-animation-ui-interactions
- https://api.flutter.dev/flutter/material/Easing/emphasizedDecelerate-constant.html
- https://api.flutter.dev/flutter/material/Easing/emphasizedAccelerate-constant.html
- https://m1.material.io/motion/duration-easing.html
- https://developer.apple.com/documentation/quartzcore/caspringanimation
- https://cdn.jsdelivr.net/npm/claude-code-skills@0.5.0/data/skills/199-biotechnologies-motion-dev-animations-skill/reference/spring-physics.md
- https://mantlr.com/blog/easing-springs-timing-ui-motion
- https://www.premiumbeat.com/blog/10-after-effects-mistakes-avoid

**2.5D, Ken Burns and depth-map parallax**
- https://thecreatorsproject.vice.com/blog/joe-fellows-teaches-us-how-to-master-25D-photography
- https://community.adobe.com/questions-529/animate-old-photos-28461
- https://research.adobe.com/publication/3d-ken-burns-effect-from-a-single-image
- https://ar5iv.arxiv.org/html/1909.05483
- https://research.google/blog/the-technology-behind-cinematic-photos/
- https://pypi.org/project/depthflow
- https://www.huggingface.co/spaces/BrokenSource/DepthFlow/blob/main/README.md
- https://www.mintlify.com/francozanardi/movielite/api/vfx/zoom
- https://www.bannerbear.com/blog/how-to-do-a-ken-burns-style-effect-with-ffmpeg

**Kinetic type, Vox and Johnny Harris collage and maps**
- https://motionographer.com/?p=64918
- https://soma.sbcc.edu/Users/Russotti/113/113lect_typeinmotion.html
- https://www.grid.uns.ac.rs/symposium/download/2024/89.pdf
- https://www.premiumbeat.com/blog/replicating-vox-motion-graphic/
- https://easy-peasy.ai/blog/how-to-make-vox-style-videos-with-ai
- https://community.adobe.com/t5/after-effects-discussions/how-does-johnny-harris-do-this-mask-reveal-animation-in-after-effects/td-p/15191636
- https://aescripts.com/learn/tag/GEOlayers/
- https://animationobsessive.substack.com/p/collage-animators-in-their-own-words

**Light, texture, grain and grading**
- https://landing-pages.invideo.io/blog/light-leaks/
- https://nofilmschool.com/2016/03/3-ways-illuminate-your-film-using-light-leaks-premiumbeat
- https://borisfx.com/documentation/sapphire/ae/dissolvelightleak/
- https://composer-docs.vindral.com/operators/operators-film-grain.html
- https://www.aiarty.com/edit-photo/add-grain-in-photoshop.htm
- https://hub.jkdevstudio.com/docs/monogram/advanced-features/grain-overlay
- https://blog.motionarray.com/learn/premiere-pro/how-to-create-your-own-film-grain-in-premiere-pro-for-free/
- https://polycount.com/discussion/100860/god-rays (refers to GPU Gems 3, ch. 13, volumetric light scattering)
- https://help.shapediver.com/doc/god-rays
- https://docs.wallpaperengine.io/en/scene/effects/effect/godrays.html
- https://www.thepromptindex.com/skill/1058-concept-art-mixed-media-collage
- https://www.studiobinder.com/blog/what-is-a-color-script-definition/
- https://www.moma.org/audio/playlist/192/2581

**Data visualisation**
- https://pudding.cool/process/how-to-implement-scrollytelling
- https://data.europa.eu/apps/data-visualisation-guide/scrollytelling-animated-transition
- https://observablehq.com/@d3/bar-chart-race-explained

**AI imagery and documentary ethics**
- https://opendoclab.mit.edu/presents/archival-producers-alliance-apa-best-practices-use-generative-ai-documentaries/
- https://www.mishcon.com/download/apa-genai-best-practices
- https://ethicsandjournalism.org/?p=1466
- https://www.documentarytube.com/blog/is-it-ethical-to-use-ai-generated-images-in-a-documentary/
- https://404media.co/netflix-doc-what-jennifer-did-uses-ai-images-to-create-false-historical-record/
- https://air.io/en/youtube-glossary/what-is-youtubes-ai-content-disclosure-policy
- https://mobilesyrup.com/2026/05/27/youtube-ai-labelling-more-visible/
- https://www.onlinejobs.ph/jobseekers/job/Visual-Artist-Creator-2D-3D-or-AI-Generated-Visuals-YouTube-Documentary-Style-1501142
