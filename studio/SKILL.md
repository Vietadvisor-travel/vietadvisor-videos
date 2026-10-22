---
name: vietadvisor-motion-studio
description: Make Vietadvisor animated Vietnam travel films — vertical + 16:9 YouTube cut per episode — in the house nutshell 2D cartoon style: a cast that acts in illustrated places, designed cartoon lettering, a 3-second hook, continuous action, no chapters, all English on screen.
---

# Vietadvisor Motion Studio (v10)

Code-drawn 2D cartoon engine for a travel / experience / knowledge channel in one house look (nutshell). A recurring cast
ACTS the story inside illustrated places, cartoon lettering is designed into every shot, scenes hand over by meaning, captions
stay small and fixed, Kokoro voice, event-driven sound design (358 sounds) and a procedural score. You write a storyboard with a
frame line per beat; the engine renders the vertical and the YouTube cut. Quality lives in the engine — keep your own output small.

## ★ HOUSE FORMAT v10 (Oct 2026) — read before anything else
1. **It must look like a cartoon: a cast that ACTS in an illustrated place** (`references/acted-scenes.md`, reference
   `engine/library/ep6_story.js`). Show what is said by characters doing it — never someone presenting it (talking-head beats
   ≤ 15 %, lint `ERROR format`), never infographic cards as the main picture (timelines, maps, receipts are seasoning, ≤ 3 s,
   ideally diegetic: signs, tapes, clocks, boards).
2. **One look: nutshell 2D everywhere** — characters, places, props, food, data, end frame (flat shapes, soft gradients, rim
   light, no outlines, deep grounds, drifting motes). Never 3D renders (the three.js `w3` world looks like a game), never outlined props.
3. **Places** = acted sets (`# vis kind=<episode> act=…`, built per episode like `ep6_story.js`) or `# nw` multiplane streets.
   **Moments** = `# vis` close-ups (coffee, ride, ticket, cheers, bed, hagiang, trainstreet, build banhmi/pho/buncha…). New subject
   → draw it (`engine/library/vis_close.js` or the episode file).
4. **Every cut is a bridge**: by meaning `trans=zoomthru|match|liquid|bloom|ripple|burst` (`tc=` on the object) or by rhythm
   `whip|slices|blobs|cube|spin|drop|stripes2`. Never the same twice in a row. Scenes connect by meaning, not one long camera take.
5. **The first 3 s are a designed hook**: open inside a moving extreme close-up (the cup, the wheel, the phone), whip out to the hero
   acting, a lettering slam on the stressed word, the question or number by 1.5 s. Check frames at 0.3 / 0.9 / 1.5 / 2.5 s.
6. **Cartoon lettering, designed per shot** (`TOON.word / burst / bubble / nametag / tape`; fonts Paytone One `toon`, Bangers `comic`,
   Coiny `round`): years drop in, onomatopoeia slam on impacts, bubbles come from speakers, tapes measure real distances. Placed in the
   shot's negative space, sized for it — never a few fixed words in the same spot → `references/toon-type.md`.
7. **Continuous action every second**: the camera never stops (breathing push + drift), background life always on (birds, waiters,
   extras, lanterns, steam), every caption line = one action + one lettering reaction, nothing holds the same picture > 1.5 s.
8. **No chapters, ever** (vertical or YouTube): one continuous story like the big animated explainer / travel channels — every scene
   hands over by a visual bridge and a BUT / THEREFORE line. Time of day, a new place or a number carries the structure.
9. **Nothing overlaps**: lettering is auto-guarded (the TOON layout guard slides bubbles/bursts clear of words — draw big words first);
   bubbles and bursts sit beside faces, never on them; a bubble's speaker stays on screen; nothing important in the caption band.
10. **All on-screen text in English** — headlines, lettering, signs, tags, captions. Vietnamese names written without diacritics on
    screen (PHO, BANH MI, LONG BIEN); the voice still pronounces them via `tools/pron_vi.json`.
11. **Captions**: one style, small, fixed in the bottom band (34 u at 81.5 % on 9:16; 30 u near the bottom on 16:9). Never moved.
12. **Check before and after**: `node tools/sheet.mjs stories/x.story v 2` (and `h 2`), then
    `node tools/frames.mjs stories/x.story v "0.3,0.9,1.5,2.5,…"` at every lettering beat in BOTH formats (positions clear on 9:16 can
    collide on 16:9); after make, look at 10–18 frames from the FINAL file.
Reference episode: `stories/ep6-train-street.story` (vertical) + `stories/ep6-train-street-yt.story` (YouTube).

## 0. Set up (once per session, ~3 min)
The package is the user's artifact **Vietadvisor Motion Studio**: `https://claude.ai/artifact/152bF3si93zouyvcfx9JTK`
1. `Artifact` → `action: "read"`, that `url`, `path: "va-studio.zip.b64.txt"` → saved locally (note the path; it is one base64
   line — never print it).
2. `base64 -d <saved path> > va.zip && unzip -q va.zip && cd va-studio && npm install --no-audit --no-fund && python3 tools/voice.py setup`
   (needs Node 18+, ffmpeg, python3 + numpy/scipy; Chromium via Playwright).
   No Artifact tool? Ask the user to attach the system zip and unzip it instead.
3. Earlier `.story` files live in the Project under `motion/` — copy them into `va-studio/stories/` for the variety check.
Read engine source only when adding a new act, close-up, dish, place or transition.

## 1. Workflow
Every episode ships as **two films**: a vertical cut (9:16, 90–150 s, `stories/<slug>.story`) and a **YouTube cut** (16:9, longer
and deeper, `stories/<slug>-yt.story`). Same research, different scripts. Both follow every house rule above.
1. **Facts** — web-search real prices (VND + ≈USD + month checked), hours, rules, dates. Open the pages; two sources for every claim
   a viewer could act on. At least one thing a traveller would save. List sources in the `sources:` line.
1a. **Topic** — score it (`references/content-strategy.md`, ≥ 70; flagship ≥ 80). Entertainment framing beats "educational".
1b. **What's working now** — search this month's platform patterns; write 2–3 `// VIRAL` lines (`references/viral.md`): the hook in
   3 s, a counter viewers compete with, a twist, a save card, an open loop to the next episode; YouTube: a re-hook every 60–90 s,
   a mid-point twist, a callback ending, a next-episode tease (no chapters).
2. **Write the story + frames** (`references/script-frames.md`, `references/story-devices.md`): a hero with a want, a deadline and
   failures; every beat joins with BUT or THEREFORE. Treatment block (ANGLE · SHAPE · COLOUR · MOTION · TYPE · SOUND · VIRAL), then a
   `// mm:ss` frame line above every beat: bridge in, who does what, which lettering lands on which word, bridge out.
   Words: one idea per caption line (3–8 words), every line names something drawable and actable.
3. **Build the acts**: a new episode gets its own `engine/library/ep<N>_<slug>.js` with acts (`ACT.<name>` draws the set + cast,
   `LET.<name>` the lettering), reusing `ep6_story.js` helpers (far side, track/pavement, life, lanterns, fgDepth, motes, cam).
   ≥ 2 things moving at all times, events timed to captions `c[k][0]`. Add the file to `engine/library/index.js`.
4. **Check** — `node tools/lint.mjs stories/<slug>.story` (0 errors), then sheets + frames (rule 12). Fix every frame that is
   unreadable, overlaps, holds still, shows the wrong subject or has Vietnamese on screen.
5. **Make** — run detached (`setsid nohup` from a script, poll the log; the box has 2 CPUs, so render formats one after another):
   vertical `node tools/make.mjs stories/<slug>.story --skip-lint --speed 1.0` (~20 min);
   YouTube `node tools/make.mjs stories/<slug>-yt.story --skip-lint --speed 1.0 --fmt 16x9` (~40 min).
   It voices every line, re-times captions, runs the sound pass (beds, foley, design hits, multi-mood score + stingers,
   −13 LUFS vertical / −14 YouTube, TP ≤ −1.5 dBTP), renders the master and **`out/<slug>_<fmt>_FINAL.mp4`** (one H.264 file
   < 30 MiB). If the session restarts mid-render, the job dies — check `pgrep -f make.mjs` and restart it.
6. **Deliver** — copy FINAL files to `/mnt/user-data/outputs/` and send with SendUserFile (one file per format + `.srt`; keep the
   YouTube master). Save `.story` files to the Project (`project_write local_path`, `motion/<slug>.story`). Never route around a blocked host.

## 2. Storyboard in 20 seconds (v10)
```
title: Train Street, Hanoi — can you still sit there?
format: guide
voice: af_heart
music: upbeat
score: upbeat@1 cafe@6 emotional@19
sources: <url> — checked Oct 2026
// ANGLE   a coffee 1.5 m from a train — the rules changed four times
// MOTION  ECU coffee ripples → whip out to Dave on a stool → bell → the train fills the alley → tape measures 1.5 M
// 0:00 HOOK — inside the cup, three thuds ripple the foam, WHIP OUT: Dave sips, "ON A RAILWAY?!" slams on the last word
# vis kind=ts act=hook bellCap=1 trainCap=2
This is Dave. Dave is drinking egg coffee… on a railway.
That bell means one thing.
Then a full-size train fills the alley.
// 0:09 SLICES → sepia 1902: workers lay rails, "1902" drops in, TOK! TOK! on each spike
# vis kind=ts act=history trans=slices
In 1902, the French laid this line.
```
Beats: acted sets `# vis kind=<episode> act=…` · `# nw` (focus=cart|cafe|pho|biahoi|hotel, cam=truck|truckL|push|pull|tilt|rise|drift,
zoom=, time=, tags=) · `# vis kind=` coffee ride ticket cheers bed hagiang trainstreet build hero macro explode vs receipt grid bars daycycle.
Every beat: `trans= tc= tc2= tcol= tdur= dur= bg=`. `head=` is a no-op on acted sets — lettering lives in `LET`.
Legacy beats (talk, price, dialogue, moment, map, chapter cards…) are out of the house format.

## 3. Rules that are never broken
- Facts real and sourced; prices VND + ≈USD + "checked <Mon YYYY>". No invented numbers.
- Voice: knowledgeable local friend — specific, honest, warm. Banned: hidden gem, bucket list, must-visit, paradise, wanderlust,
  nestled, boasts, testament, vibrant tapestry, unprovable superlatives.
- All on-screen text English; no chapters; nothing overlaps; captions one small fixed style.
- Hook in ≤ 3 s; ends on the brand end frame (auto). Maps of Vietnam show Hoàng Sa & Trường Sa.
- Ethnic minorities appear as hosts/experts, never as jokes. Riders wear helmets; alcohol beats carry the zero-limit / no-riding line.
- Nothing floats, nothing is cropped: people stand on a surface, heads keep headroom.
- Never two episodes with the same structure or the same opening image.
- Voice: narrator `af_heart`; `…` before a punchline holds a beat; punchlines ≤ 4 words.
- Deliver exactly one finished file per format (+ `.srt`).

## 4. Beyond the recipes
- **New act**: `ACT.<name> = (o, c, dur) => ({ sfx, draw: lt => … })` + `LET.<name> = (o, c, lt, R) => …` in the episode file;
  cast via `person(x, y, s, CHAR[id].spec, { t, pose, expr, flip, hold, view })`.
  Poses: stand wave point pointUp cheer thumbs shrug hips think hold holdUp present eat photo facepalm scared clap bow carry dance walk
  run sit sitHold toast ride. Expressions: neutral happy joy grin laugh surprised shocked scared bored sad cry angry smug wink love
  starstruck dizzy tipsy sleepy thinking yummy hot determined nervous cool.
  Cast: dave, cophovn (Cô Hoa), police, lena, kid, grandma, xeom, cyclo, fisher, tour_guide, linh, kenji, sofia, wei, jiwoo, ploy, monk.
- **New close-up / dish**: `engine/library/vis_close.js` (`K.<name>`), `BUILD.<set>` (each layer drops and lands on its word).
- **New place**: `engine/library/nutworld.js` (`POI_X` + a painter); signs in English.
- **New transition**: `engine/library/transitions2.js` (`FX.<name> = (A, B, p, t, c, tr)`, default length in `TR2_DUR`).
- **Audio tuning**: `references/sound-music.md`, `references/sound-grammar.md`; `python3 tools/sfx_pro.py list|demo`,
  `python3 tools/music_pro.py list|demo|stinger <type> out.wav`; specific cues with sfx pro names (`vn_bell_small`,
  `vehicle_train_horn`, `impact_glass`, `ui_shutter`, `foley_tape`, `crowd_laugh`…).

## 5. Reference index (read only what the task needs)
| File | Read when |
|---|---|
| `references/acted-scenes.md` | **always** — the cast acting in places, how to build an episode's acts |
| `references/toon-type.md` | **always** — cartoon fonts, lettering kit, the 3-second hook, continuous action, layout guard |
| `references/script-frames.md` | **always** — treatment block, a frame line per beat, rules for words and frames |
| `references/nutworld-transitions.md` | **always** — `# nw` places and the content-bridged transitions |
| `references/vis-format.md` | close-ups, fixed layout, every `# vis` kind and its keys |
| `references/captions.md` | caption rules (fixed small band) |
| `references/writing-retention.md` | always — hooks, retention curve, open loops, line craft, 0–100 rubric |
| `references/story-devices.md` | always — comedy & story devices, joke density |
| `references/viral.md` | every episode — platform patterns, lengths, YouTube structure (no chapters) |
| `references/content-strategy.md` | choosing the topic — rubric, packaging, scored ideas |
| `references/sound-music.md`, `sound-grammar.md`, `sfx-library.md`, `music-engine.md` | sound and score |
| `references/cinematography.md` | composition, colour script, camera motive |
| `references/nutshell-style.md` | the nutshell look in detail |
| `references/brand-rules.md` | writing captions / facts |
| `references/world3d.md` | only for a special 3D set piece (not house style) |
