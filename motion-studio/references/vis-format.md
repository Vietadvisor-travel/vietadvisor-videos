# Visual-first format (Oct 2026) — show what is said

The user's verdict on Ep.1–5: "characters standing, talking, waving, bobbing — boring." The film is now built from the
**content**: every line of voice-over gets a picture of the thing it names (an object, a process, a price, a place, a
comparison). Characters are optional extras inside a world, never the presenter. Lint enforces it (`ERROR format`).

## The rule
1. Read the line. Ask "what is it ABOUT?" — draw that. "A bánh mì from a cart" → the bánh mì, on a dawn street, price tag swinging.
2. One idea per beat, one hero element per frame.
3. Talking-head beats (`talk intro dialogue social hook`, `price hero=…`, anything with `host=`) ≤ 15 % and never two in a row.
4. Change the visual system every 1–3 beats (object → comparison → map → street → data) so the eye never settles.

## Fixed layout (no overlaps by construction — engine/library/vis.js)
| zone | 9:16 | 16:9 | holds |
|---|---|---|---|
| HEAD | y 8–24 % | y 6–19 % | the ONLY big type: `head="MAIN|sub"` (Anton + Oswald accent) |
| STAGE | y 26–74 %, x 7–93 % | y 21–84 % | the visual |
| CAPTION | baseline 81.5 %, 34 u | 48 u from bottom, 30 u | subtitles — fixed, small, never moves |
Nothing is placed by free x/y in a vis beat. Do not add `art=` lettering on vis beats (HEAD replaces it).

## Beat: `# vis kind=… head="MAIN|sub" bg=night|wine|teal|indigo|forest|ember|plum|sea place=<PLACE> time=dawn|day|sunset|night`
`place=` puts a real location behind the subject, out of focus and tinted (depth of field — the "product shot on location" look). Items sync to captions automatically.
| kind | shows | keys |
|---|---|---|
| `hero` | one object, focus-pull entrance, rim light, slow push, price tag, optional red stamp | `obj name price sub stamp="×4" tagAt stampAt` |
| `macro` | extreme close-up, cropped, drifting, bokeh | `obj` |
| `explode` | object + labelled parts with leader lines (ingredients, anatomy) | `obj parts="a|b|c"` |
| `vs` | split screen, two objects, prices count up, loser dims, verdict replaces head | `a an pa b bn pb unit verdict win` |
| `receipt` | receipt prints line by line, icons fly in, running total in HEAD, final total | `items="obj:label:price|…" final="…|…" totalLabel` |
| `grid` | 2×N (9:16) / 3×N cards pop in, `!obj` = crossed out | `items="obj:label|!obj:label"` |
| `bars` | horizontal bars grow, values count, one highlighted | `items="label:value[:obj]" hi=1 pre unit` |
| `build` | the dish ASSEMBLES: one ingredient per voice line, drops with bounce, squash on landing, crumbs, lid closes with impact, camera pushes; HEAD names the current ingredient | `set=banhmi|pho parts="id:LABEL|…" sub final` (add sets in `BUILD` for new dishes) |
| `daycycle` | sky + sun travel through a day, object per time, clock in HEAD | `stops="06:30:obj:label[:price]|…" sub` |
Objects = any PROP (`tools/catalog` / asset-catalog.md): food, drinks, vehicles, tickets, money, nature, landmarks props.
Missing object? Draw it as a new `defProp` in `engine/library/<episode>.js` — that is the job, not a reason to show a person.

## Mixing with the rest of the engine
Use `street3d` / `moment` set pieces / `map3d` / `route` / `timelapse` for place and movement; `vis` for things, numbers and
comparisons. A good 2-min vertical: ~60 % vis, ~30 % places/maps/set pieces, ≤ 10 % people (as doers: a vendor's hands, a
rider in traffic, never a presenter).

## Check before render
`node tools/sheet.mjs stories/x.story v 3` → contact sheet of real frames. Every frame: one subject, HEAD/STAGE/CAPTION clean,
nothing overlapping, readable on a phone.

## Motion grammar — "every second wow" (user rule, Oct 2026)
1. **Nothing is ever still.** Every frame has ≥ 2 things moving: camera (push / tilt / drift), the subject (build, count, fly,
   bounce), and texture (steam, bokeh, rings, particles). A held pose > 1 s is a bug.
2. **Show the process, not the result.** Ingredients go IN (build), totals COUNT UP (receipt), prices SWING in (tag), loser DIMS (vs),
   time PASSES (daycycle). If the line names five things, five things animate, each on its own word.
3. **Every cut moves.** vis beats enter and exit with a motion bridge (auto, cycling `zoom → whipL → rise → whipR → spin`;
   override with `in=` / `out=`): exit of beat N and entry of N+1 read as one gesture. Never two plain cuts in a row.
4. **Impacts are felt**: landing → squash 5 % + crumbs + thud; reveal → impact + headline swap; the sound pass hits each one.
5. **Detail on the subject.** If the voice explains what's inside, show it opened up and layered (build), labelled one by one.
   Generic icons for a featured subject are not enough — write the dish/object as its own BUILD set or defProp.
6. Change the visual system every 1–3 beats; reuse a system only with a different camera and colour.

## Ep.6 close-ups (engine/library/ep6_train.js)
`trainst` (one-point street, lantern strings, cafés each side, train squeezes through; `trainAt= time=night notrain=1 measure=1`) ·
`corridor` (top-down plan: track, legal corridor sweeps open, houses inside blink) · `railtime` (history as stops on a rail line,
`events="YEAR;label|…"`, a little train rides stop to stop) · `phonehit` (phone held over the rail, train clips it) · `railmap`
(station, north/south stretches, Long Biên arches, 2026 diversion animates at `divertAt=`) · `bridge` (Long Biên at sunset) ·
`window` (the street rushing past a carriage window). Reference story: `stories/ep6-train-street.story` (+ `-yt`).
