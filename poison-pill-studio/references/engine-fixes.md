# Engine fixes — the 4 known problems of the fork (16 Oct 2026) and how the add-on handles them

Diagnosed against the Vietadvisor Motion Studio engine source (the fork `local-empire-files-studio` shares it).

## 7.1 New images render as text (their file name)
**Cause:** the renderer never reads `engine/library/img/*.png` or `images.json`. It loads only `engine/library/images.js`
(`window.IMAGES = {id: {…, data: "data:image/png;base64,…"}}`), which is rebuilt only by `tools/sticker.py`. The four Quibi
images were copied + added to `images.json` by hand → `images.js` stale → `IMG[id]` empty → `drawSticker` draws the
placeholder card with the id text. Second cause: files named `quibi-*.png` (hyphen) while ids are `quibi_*` (underscore).
**Fix:** `python3 tools/pp_img.py sync` (rebuilds images.js, repairs hyphen/underscore paths, lists broken entries). From now
on import only with `pp_img.py add`. `pp_lint` ERRORs on any id that is not embedded; the add-on draws a red MISSING IMAGE card.

## 7.2 Collage background too light
**Cause:** `collage` hard-codes `placeOpts.color = o.bg || '#ecdcb8'` (paper). `bg=#101c2e` darkens it, but the beat is still a
sticker board (slots, dashed line, camera visiting each photo) — that is the "slideshow" look.
**Fix:** don't use `collage` / `photo` / `stat` / `quote` / `art` for Poison Pill. Use `# cine` (navy/black/procedural or a real plate,
three planes, act grade). `pp_lint` warns on any legacy beat.

## 7.3 `bgImg` not visible
**Cause:** same as 7.1 (the plate had no pixels) and the collage studio place paints over a background layer.
**Fix:** `# cine bg=<plate id> bgBlur=10 bgDim=.45` — the plate is blurred once and cached at frame size ×1.18, toned per act, and
moved on its own parallax plane.

## 7.4 Quote beat shows "?"
**Cause (most likely):** the fork's `quote` recipe reads a key the story didn't pass (the base engine prints `'?'` as the
fallback for missing values, e.g. `vnd: o.vnd || '?'`), or curly quotes/apostrophes in an unquoted value broke the key=value parse.
**Fix:** `fx="quote:<verbatim text>;at:<word>;by:<speaker, year>"` inside `# cine`. Keep the whole value inside double quotes;
use straight apostrophes; no `|` or `;` inside the quote text.

## Install / compatibility
- Add-on = `engine/library/pp_cine.js`, `pp_world.js`, `pp_cine2.js`, `pp_cine3.js` (registered LAST, in that order, in `engine/library/index.js`) + tools `pp_lint.mjs pp_img.py pp_clip.py pp_review.mjs pp_thumb.mjs pp_new.mjs pp_assets.py pp_data.py pp_autodirect.mjs`.
- v2 extensions plug in through `PPCINE.EXT[<event>] = { draw(e, lt, X), sfx, under|screen|post, d, prep }` and `PPCINE.BGX[<bg>] = (lt, o, X) => …` — add new devices there without touching pp_cine.js.
- It only uses engine globals (`ctx W H U E T setFont wrap textW mkCanvas IMG timeCaps SB`), wraps `SB.compile` and `caption`
  only when the story header says `channel: poisonpill`; Vietadvisor stories are untouched.
- If the fork renamed a global, grep the add-on for it and alias it at the top of the file.

## Extending
- New prop: add `PROP.<name>(h, lt, o)` (draw centred on 0,0, ~±100·h/200 units); add it to `PROPS` in `pp_lint.mjs`.
- New event: add a draw function, dispatch it in the render's fx loop, give it an entry in `FXS` (sound).
- New act grade: add to `ACT` (tint, op, a, acc, sat, bg) and to `RED_OK` in lint if it is a crisis act.
After any change: `node tools/frames.mjs stories/quibi_cinematic.story h "1.5,5.6,11,17.8,21.5,26,30,38,43"` and look.
