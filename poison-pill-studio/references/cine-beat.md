# `# cine` — full reference (engine add-on `engine/library/pp_cine.js`)

A storyboard line is ONE line: `# cine key=value key="value with spaces" …` followed by its narration lines (each line
is spoken by the VO and shown as the caption). The add-on activates only when the header contains `channel: poisonpill`.

## Header
```
title: <working title>
channel: poisonpill        # REQUIRED — switches on the channel mode (cuts, captions, grade, end card)
voice: am_michael          # Kokoro voice; bm_george for a heavier British tone
music: auto                # scored to the acts (music.md)
length: long               # lint checks 8–12 min across… one file; per-act files: omit
endcard: off               # every act file except the last
sources: <url> — <url> — checked Oct 2026
```
Channel mode does: hard cut by default between beats; `trans=` limited to cut | whip | flash | match (zoom-through) — any banned
transition becomes a cut; captions in the fixed Poison Pill style; `look grade=clean`; the Vietadvisor end frame replaced by the
POISON PILL end card (`# ppend`).

## Timing: `at:`
Every element and event has `at:` — when it lands.
| Form | Meaning |
|---|---|
| `at:billion` | the moment the VO says the first word starting with "billion" in this beat (prefix match for ≥ 3 letters) |
| `at:then#2` | the 2nd occurrence |
| `at:legends+.25` / `at:gone-.2` | offset in seconds (avoid words that end with "-digits", e.g. "covid-19" → use "covid") |
| `at:c2` | start of the 2nd narration line |
| `at:1.4` | seconds from the beat start |
With VO the engine re-times captions to the real audio; word times inside a line are interpolated by characters (accurate to ~0.1–0.2 s). Lint ERRORs when a word is not found — that is a broken sync, fix it.

## Beat keys
| Key | Values | Default |
|---|---|---|
| `act` | `setup` `rise` `doubt` `fall` `after` `flash` `lesson` — grade, accent, default bg (visual-bible §2) | setup |
| `bg` | image id (a real photo plate) · `"wall:id1,id2,id3"` (a wall of real photos, torn & scattered, then blurred — great for 'the press', 'the empire', 'the era') **or** `navy` `paper` `black` `news` (scrolling newspaper wall) `chart` (trading grid + ticker) `spot` (spotlight) | per act |
| `bgBlur` | px at 1080p | 10 |
| `bgDim` | 0–1 brightness cut | .45 |
| `bgTone` | `navy` `gold` `teal` `red` `duo` `bw` `color` | per act |
| `cam` | `push` `pull` `panL` `panR` `tiltU` `tiltD` `drift` `hold` | rotates |
| `crash` | word → 0.18 s crash zoom | – |
| `date` / `dateAt` | typed date card top-left ("APRIL 2020") | – |
| `vig` | vignette strength 0–1 | .42 (.55 fall) |
| `dur` | minimum seconds (narration extends it) | – |
| `trans` | `cut` `whip` `flash` `match` | cut |
| `solo` | `1` = deliberate < 3 planes (silences the lint warning) | – |

## `mid=` — the subjects (`|` between items, `;` between fields)
`mid="katzenberg;x:.24;h:.6;at:two;lab:JEFFREY KATZENBERG|whitman;x:.78;h:.58;at:legends;flip"`
| Field | Meaning | Default |
|---|---|---|
| id | registered cut-out image id, or a prop `@phone` `@cash` `@coins` `@doc` `@pill` `@arrowdown` | – |
| `x` | centre x (0–1) | 1 item .34 (side=r → .66) · 2 items .3/.7 · 3+ spread |
| `h` | height as fraction of frame | .6 (3+ items .44) |
| `bottom` / `y` | bottom edge (default .80 → caption band stays clear) / or explicit centre | bottom .80 |
| `at` | when it slaps in | staggered .15 + .3 s |
| `tone` | `bw` `duo` `gold` `teal` `red` `navy` `color` | bw (teal in flash) |
| `in` | `slap` `rise` `slideL` `slideR` | slap |
| `lab` | nameplate (caps, ≤ 3 words) | – |
| `flip` | mirror (make two people face each other) | – |
| `rot` | degrees | ±1.5 |
| `border` | `off` = no white border | on |
| `style` | rectangular photos: `print` (white photo border) · `torn` (torn paper edge) · `polaroid` (thick bottom) · `raw` (no frame). Cut-outs (transparent PNG) always get the sticker border | print |
| `tape` | masking-tape strips on the top corners (collage feel) | – |
| `label` | (props) text on the prop, e.g. `@phone;label:QUIBI` | – |
Mid items are addressable by index (`1`, `2`…) or id in `strike:` `shatter:` `line:` `bubble on:`.

## `fg=` — foreground objects
`fg="@cash;x:.82;y:.97;h:.17;at:billion|contract_photo;x:.15;y:.98;h:.3;at:signed;rot:8"`
Real photos belong here too: a contract scan, the product, a newspaper photo, a stock certificate — `style:polaroid|torn|print`, `tone:color` by default.
Fields as mid plus `y` (bottom for `@cash/@coins`, centre for the others; default .92) and `h` (.22). FG objects rise into the band on their word. Image ids in fg keep colour (`tone:color`) unless set.
Props: `@cash` (banded stack) · `@coins` (gold stacks) · `@pill` (the channel's capsule; with `drop:pill` it falls from the top and breaks) · `@doc` (`title:` on the paper) · `@phone` (`label:`) · `@arrowdown` (red).

## `hero=` and `sup=`
`hero="$1.75B;at:billion;pos:c;y:.3;fx:count"` · `hero="ARROGANCE;at:arrogance;col:red;pos:c"` · `hero="$1.75B;at:one;to:$0;toAt:gone;toCol:red"`
| Field | Meaning |
|---|---|
| text | 1–3 words |
| `at` | slam time |
| `pos` | `t` top · `c` centre · `l` · `r` · `b` · default = empty third opposite the first mid |
| `x` `y` | explicit position |
| `size` | px at 1080p (auto-fits to 58 % width) |
| `col` | `red` `paper` `white` `#hex` · default act accent |
| `font` | `impact` (Anton) · `serif` (Playfair) · `cond` (Oswald) |
| `fx` | `slam` · `count` (number in the text rolls from `from:` over `cdur:` s) · `type` |
| `to` `toAt` `toCol` | burn-swap: 0.9 s before `toAt` the text shakes, turns red, embers rise; on `toAt` it flashes into `to` |
`sup="BEFORE DAY ONE;at:before"` sits 40 px under the hero (or `x:`/`y:`), gold, Oswald, fade+slide.

## `fx=` — events (each `type:arg;at:word;…`)
| Event | Example | Notes |
|---|---|---|
| `stamp` | `stamp:FLOP;at:nobody;x:.66;y:.3;col:grey;size:110;rot:-10` | rubber stamp slam + grunge; `col` red (crisis) / gold / grey |
| `strike` | `strike:b1;at:then` · `strike:2;at:fired` · `strike:hero;at:no` | red X drawn in two strokes over a bubble (`b1`), a mid (`1`, id) or the hero |
| `bubble` | `bubble:COVID!;at:pandemic;on:1;side:r` | paper speech card beside subject `on`, stacks downwards |
| `quote` | `quote:I attribute everything…;at:said;by:Jeffrey Katzenberg, 2020;x:.62;y:.3;rate:.16` | verbatim quotes only; words appear at `rate` s/word |
| `headline` | `headline:Quibi to shut down;src:THE WALL STREET JOURNAL;at:shut;x:.68;y:.42;rot:-3` | newspaper clipping slides in (paraphrase real headlines faithfully, or quote them) |
| `chart` | `chart:down;at:launches;x:.42;y:.36;w:.46;h:.36;lab:DOWNLOADS;pts:60,72,64,48,40,30` | line draws itself over `dur:` s; `up` = gold, `down` = red; `pts` 0–100 shape (use real data shape when you have it) |
| `line` | `line:1>2;at:bought` | gold dashed leading line between two mids |
| `shatter` | `shatter:1;at:shut` | the cut-out breaks into shards that fall |
| `drop` | `drop:pill;at:poison` | an fg prop falls from above and breaks on landing |
| `flash` | `flash:red;at:gone` · `flash:gold` · `flash:white` | full-frame flash, 0.45 s |
| `red` | `red;at:but` | red creep from the edges starts on that word |
| `shake` | `shake;at:himself;amp:1` | camera shake |
| `date` | `date:OCT 2020;at:six;x:.06;y:.12` | a second date card inside the beat |
Each event automatically gets its SFX (sound-and-voice.md §1); override with `sfx:<sfx_pro name>`.

## `# ppend`
`# ppend` (optional `name=` `sub=`) — the channel end card: the pill drops and rotates in, POISON PILL slams, "Subscribe for the next case." fades up. Added automatically at the end of a file unless `endcard: off`.

## Layout guarantees & limits
- Captions: fixed style, bottom band; mids default to bottom .80 so faces stay clear.
- Hero auto-fits width; bubbles clamp inside the frame; nameplates never enter the caption band.
- The add-on is 16:9-first; 9:16 renders but is not art-directed (channel has no Shorts).
- Missing images render as a **red MISSING IMAGE card** (never silently as text) and `pp_lint` reports an ERROR.

---
# v2 additions (`pp_world.js` + `pp_cine2.js`)

## Backdrops
| `bg=` | What | Keys |
|---|---|---|
| `world` | real Natural Earth borders (Hoàng Sa & Trường Sa always drawn), navy ocean, graticule; the camera flies | `map="lon,lat,zoom"` start · `map2="lon,lat,zoom"` end · `mapAt` `mapDur` · `hl="United States of America,Japan"` (exact Natural Earth names) · `hlAt=<word>` |
| `clip:<id>` | real footage as a blurred moving plate | `bgBlur` `bgDim` `bgTone` |
| `"wall:a,b,c"` | real photos torn and scattered, blurred | as plates |
Zoom guide: world 1 · continent 2–3 · country 4–7 · city 9–14. Long-lat: New York −74,40.7 · London −0.1,51.5 · Tokyo 139.7,35.7 · LA −118.2,34 · SF −122.4,37.8 · Shanghai 121.5,31.2 · Hanoi 105.8,21 · HCMC 106.7,10.8.

## Layers
- `clip:<id>` anywhere an image goes (`mid=` `fg=` `bg=`): real footage imported with `python3 tools/pp_clip.py add video.mp4 <id> --start 12 --dur 3`. Plays from the layer's `at:`. Best with `style:tv` (CRT with scanlines) or `style:polaroid`.
- `tone:halftone` — newspaper-print dots (archive photos, "then" side of a split).
- `style:tv` — CRT bezel + scanlines (news footage, ads, keynotes).

## Events (in `fx=`; `|` separates events)
| Event | Example | Notes |
|---|---|---|
| `pin` | `pin:LONDON;ll:-0.1,51.5;at:london;side:-1;col:red` | on `bg=world`; drops with ripple + nameplate |
| `route` | `route:-118.2,34>-0.1,51.5;at:london;dur:1.2` | gold arc drawn with a travelling light |
| `mark` | `mark:1;r:.08,.42,.9,.5;at:read;col:red` | highlighter over a region of mid 1 (fractions of its box) — real documents |
| `lens` | `lens:1;r:.5,.46;z:2.4;at:read+.4;x:.72;y:.42;size:170` | magnifier: zooms into a point of mid 1 and shows it beside, with a leader line |
| `timeline` | `timeline:1999,2004,2009,2014;from:1999;cur:2009;at:ten;dur:1.4;y:.14` | scrubber across the top; marker races to `cur` |
| `ticker` | `ticker:STOCK ▼ -31%~NASDAQ ▼ -3%;at:c1` | market band (rows by `~`; ▼ / minus = red) |
| `tally` | `tally:Raised=$1.75B~Sold=<$100M;at:raised;rate:.9;total:-94%;x:.66;y:.24;w:.36` | receipt rows tick in, total slams |
| `kin` | `kin:THE REAL POISON PILL;at:the;hl:4;size:120` | kinetic sentence: each word slams on its spoken word; word `hl` in the accent |
| `split` | `split:THEN>NOW;at:c1` | before/after halves with gold divider and labels |
| `spot` | `spot:4;at:one` | the light closes on mid 4 (the culprit), the rest falls dark |
| `burn` | `burn;at:c1;dur:.8` | orange film burn (flashbacks, transitions into the past) |

## Beats & acts
- `# ppcase n=07 title="Quibi" sub="The $1.75B bet" photo=<id> stamp=OPEN|CLOSED stampAt=2.2` — the case-file sting; place it right AFTER the cold open (≈ 0:12–0:20).
- `act=thumb` — full colour, no grade: for thumbnails only (`tools/pp_thumb.mjs`).
- `riser` — a tension riser is added 1.2 s before the hero slam in `fall`/`lesson` beats or with `big=1` (`riser=off` to remove).

---
# v3 additions
The complete, current list of devices (v1+v2+v3: 100+ keys and events — annotation, photo effects, data, paper & screens, atmosphere, transitions, new cameras, tones and entrances) is in **`device-catalog.md`**. Syntax rules stay the same: `|` between events, `;` between fields, `~` between rows, `>` for chains.
