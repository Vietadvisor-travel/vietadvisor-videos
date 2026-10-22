# Using this package with Meta Muse (Muse Image / Muse Video / Muse Spark agent)

Muse Image composes from multiple reference images, keeps coherence across edit turns, can search
the web, and (with Muse Spark) can write and run code. Muse Video is in preview with native audio.
This package gives Muse three ways in — use whichever your Muse surface supports.

## Path A — Reference-driven generation (works today in the Meta AI app / meta.ai)
1. Start a new chat. Upload, in this order: `reference_sheets/00_style_card.png`,
   `01_cast_all.png`, the cast sheet(s) for the characters in your shot, `02_expressions_dave.png`,
   the place you want from `assets/places/16x9/` or `9x16/`, and any props from `assets/props/`.
2. Paste the **Master style prompt** below, then a **shot prompt**.
3. Iterate with small edits ("same frame, Dave now looks scared, keep everything else").
4. Use the generated stills as keyframes for Muse Video (image-to-video) when available, or animate
   them in CapCut.

### Master style prompt (paste first, every session)
```
You are the art director for "Vietadvisor", an animated channel about travelling in Vietnam.
Match the uploaded reference sheets exactly:
- 2D cartoon, chibi proportions (head ≈ 42% of height), big round eyes with two highlights, small nose.
- Thick warm-ink outlines (#2B1D16, never pure black), round line caps.
- Cel shading: flat base colour + one lighter top-left crescent + one darker, slightly purple
  bottom-right crescent. No gradients on characters, no textures, no photo-realism.
- Palette: warm paper #F3E6C4, brand orange #EE4D2D (only for prices/CTA/punchline), flag red
  #DA251D, star gold #FFCD00, sky #8FD3F0, karst green #5F8F5A.
- Typography: titles in Baloo 2 ExtraBold, captions in Be Vietnam Pro ExtraBold, white or yellow
  with a thick dark outline. Vietnamese diacritics must be correct.
- Characters must stay on-model with the cast sheet: same outfits, colours, hair, accessories.
- Ethnic minority dress is simplified but accurate and respectful; people are hosts and experts.
- Riders always wear helmets. Map of Vietnam always shows Hoàng Sa and Trường Sa.
Confirm you understand, then wait for the shot description.
```

### Shot prompt template
```
SHOT: <id> — <format 16:9 | 9:16>
PLACE: <place id from the sheet, time of day>
CHARACTERS: <id> at <left third / centre / right third>, pose <pose>, expression <expr>; …
PROPS: <prop ids and where>
CAMERA: <wide | medium | close-up | low angle | dutch>, focus on <subject>
TEXT ON SCREEN: "<caption>" (bottom, inside safe zone) + "<price tag: 45.000 ₫ ≈ $1.80, checked Oct 2026>"
MOOD/GAG: <one sentence>
Keep the exact Vietadvisor style from the references.
```

### Video prompt template (Muse Video, image-to-video)
```
Animate this frame in the Vietadvisor 2D cartoon style. Duration <4–8> s.
Motion: <character action with anticipation and overshoot>, <secondary motion: hair/lanterns sway>.
Camera: <slow push-in | pan right | crash zoom at 2s | handheld drift>.
Keep outlines, colours and character design identical to the first frame. No morphing, no new characters,
no text changes. Snappy cartoon timing, not floaty.
```

## Path B — Muse Spark writes the episode, the engine renders it
The engine is plain JavaScript. Give Muse `SKILL.md`, `references/*.md` and `episodes/_template.js`,
ask it to write `episodes/<slug>.js`, then:
- **Any browser:** open `player.html`, paste/load the episode file, press ▶ to preview and ⏺ to record
  a WebM in 16:9 or 9:16 (exact frame timing, no install).
- **Any computer with Node 18+:** `npm install` then `node tools/render.mjs …` for MP4 (see SKILL.md).
If Muse can run code in its own sandbox, ask it to run `player.html` headless or `render.mjs`; if not,
it hands you the episode file and you render.

### Prompt to give Muse Spark
```
Read SKILL.md and the references. Write a Vietadvisor episode file (window.EPISODE = {...}) about
<topic>, <length> seconds, for <16:9 and 9:16>. Research real prices with sources first.
Use only ids that exist in references/asset-catalog.md. Follow brand-rules.md and the QA checklist.
Return only the JS file.
```

## Path C — Assets only (CapCut / Premiere / After Effects / Canva)
All characters, props, places and UI are exported as transparent PNGs in `assets/`, fonts in
`fonts/`. Build scenes manually with keyframes; follow `camera-and-motion.md` for timing.

## Consistency tips
- Always upload the cast sheet when a character appears — models drift without it.
- One change per edit turn.
- Generate backgrounds and characters separately, then composite, for maximum control.
- For a new character: generate on a plain cream background next to `01_cast_all.png` "as the 32nd
  member of this cast", then (optionally) rebuild it in code with `defChar()` for perfect reuse.
