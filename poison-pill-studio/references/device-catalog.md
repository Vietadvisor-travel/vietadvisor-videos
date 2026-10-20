# Device catalog — everything the engine can put on screen (v3)

One `# cine` line per sentence. Everything below is a key of that line or an event inside `fx="…"` (events separated by `|`,
fields by `;`, rows by `~`, pairs `name=value`, chains `a>b`, points `x,y` as fractions of the frame).
Every event takes `at:<word>` (when it lands) and gets its sound automatically. Shot recipes using them: `shot-library.md`.

## 1. Backdrops `bg=`
| Value | Look | Use for |
|---|---|---|
| `<plate id>` | real photo, blurred 8–12 px, dimmed, toned by act | the place, the era, the HQ (default choice) |
| `"wall:a,b,c"` | real photos torn & scattered, blurred | the press, the era, "everyone" |
| `clip:<id>` | real footage, blurred moving plate | archive atmosphere behind a cut-out |
| `world` + `map= map2= hl= hlAt=` | real borders, camera flies, countries light | expansion, geography, trade, war |
| `navy` · `black` · `spot` | grid navy · void · spotlight | default · collapse · verdict/quote |
| `paper` | aged paper | flashbacks, letters, ledgers |
| `news` | scrolling newspaper wall | press, scandal |
| `chart` | trading grid + ticker numbers | markets, money |
| `cork` · `wood` | cork board · desk | investigation board · polaroid spread / documents on a table |
Keys: `bgBlur bgDim bgTone` (navy gold teal red duo bw color sepia blueprint neon) · `vig` vignette · `date=` typed date card.

## 2. Cameras `cam=` (all with parallax per plane)
`push` (importance) · `pull` (context, emptiness) · `panL/panR` (time, travel) · `tiltU/tiltD` (scale) · `drift` (calm) · `hold` (quotes) · `rise` (ascent) ·
`vertigo` (dolly-zoom: background stretches while the subject holds — the moment someone realises) · `orbit` (planes slide opposite — 3D feel) ·
`hand` (handheld documentary shake — tension, investigation) · `crash=<word>` (0.18 s crash zoom) · `hand=1` adds handheld to any camera.

## 3. Layers `mid=` / `fg=` (real images first)
Content: cut-out id · print id (rectangle) · `clip:<id>` footage · props `@cash @coins @pill @doc @phone @arrowdown`.
| Field | Values |
|---|---|
| `style` | `print` (photo border) · `torn` · `polaroid` · `tv` (CRT + scanlines) · `raw`; cut-outs always get the white sticker border |
| `tape` | masking tape on the corners |
| `tone` | `bw` `duo` `gold` `teal` `red` `navy` `color` `halftone` (newsprint dots) `sketch` (engraving/pen) `shadow` (black silhouette) `sepia` `blueprint` `neon` |
| `in` | `slap` (default) · `rise` · `slideL/slideR` · `drop` (falls from the top, blur clears — Harris) · `zoom` (pops from small) · `develop` (polaroid develops teal→paper) |
| geometry | `x` `h` `bottom` / `y` · `rot` · `flip` · `lab:` nameplate · `border:off` |
2.5D: `python3 tools/pp_assets.py pop photo.jpg <id>` → `bg=<id>_plate bgBlur=6` + `mid="<id>;…"` + `cam=vertigo|orbit` = the person lifts off their own photo.

## 4. Type
`hero=` (1–3 words: `fx:slam|count|type`, `to:/toAt:/toCol:` burn-swap, `font:impact|serif|cond`, `size`, `pos`, `col`) · `sup=` (support line) ·
`kin:` kinetic sentence word-by-word (`hl:` accent word) · `lower:Name~Role` documentary super · `callout:TEXT;on:1` leader-line label · `quote:` verbatim quote typed with attribution.

## 5. Events — annotation (marker language)
| Event | Example |
|---|---|
| `circle` | `circle:1;r:.1,.4,.6,.55;at:look;col:red` (region of mid 1, fractions) |
| `arrow` | `arrow:.82,.2>.58,.42;at:here;lab:HERE` |
| `underline` | `underline:.6,.78,.92;at:numbers;col:gold;double` (x0,y,x1) |
| `scribble` | `scribble:1;r:…;at:wrong` (cross out a region) |
| `mark` | highlighter `mark:1;r:.08,.42,.9,.5` |
| `lens` | magnifier `lens:1;r:.5,.46;z:2.4;x:.72;y:.42` |
| `redact` | black bars `redact:1;lines:.3,.38;.42,.5;reveal:<word>` |
| `scan` | scanner line sweeping a document `scan:1;dur:1.4` |
| `string` | red-string board `string:1>2>3;rate:.8` |
| `strike` | red X over a bubble/mid/hero `strike:b1` |
| `spot` | light closes on one subject `spot:4` |
| `line` | gold dashed leading line `line:1>2` |

## 6. Events — photo effects (real images transformed)
`rip:1` tear in half · `burnaway:1` burns from the edges · `glitchimg:1` digital corruption · `shatter:1` breaks into shards ·
`matchstack:a,b,c,…;step:.4;accel:.85` many real screenshots slam on the same spot, faster (Johnny Harris match cut) ·
`polaroids:a,b,c;rate:.5` photos drop onto the table · `zoomto:1;r:.6,.4;z:6` infinite zoom into a detail (then `trans=slam`) · `drop:pill` prop falls & breaks.

## 7. Events — data (real numbers; `tools/pp_data.py` builds them from CSV)
| Event | Example |
|---|---|
| `chart` | `chart:down;pts:96,92,80…;lab:-90%` |
| `bars` | `bars:Netflix=$29B~Disney+=$22B~Quibi=$1.75B;hl:3;rate:1.4` |
| `donut` | `donut:62;lab:MARKET SHARE` |
| `gauge` | `gauge:92;lab:RISK` |
| `dots` | `dots:9/10;people;cols:10;col:red;lab:9 IN 10 FAIL` |
| `circles` | `circles:Quibi=1.75~Netflix=29;hl:1` (area = value) |
| `odo` | `odo:1750000000;pre:$;lab:…` mechanical counter |
| `days` | `days:180` calendar crossed out |
| `crowd` | `crowd:200;gone:<word>;fade:60;lab:STAFF` people icons, layoffs turn red & fade |
| `stack` | `stack:12;lab:$1.75B` cash tower |
| `coinflow` | `coinflow:1>2` coins arc from subject 1 to 2 |
| `tally` · `receipt` | ledger rows / printed receipt with total |
| `versus` | `versus:Quibi=6 months~Vine=4 years` |
| `flow` | `flow:Users>Subscriptions>!No profit` business-model diagram (`!` = broken step, red) |
| `timeline` · `ticker` · `stockcard` | years scrubber · market band · price card |
| `pin` · `route` (on `bg=world`) | map pins & arcs |

## 8. Events — paper & screens
`headline:` clipping · `spin:` spinning front page (`src: date: photo:`) · `memo:` typed internal memo (`head: meta: stamp:`) · `search:` search bar with results (`res:a~b~c`) ·
`notify:APP~Message` phone notification · `stamp:` rubber stamp · `seal:` wax seal · `bubble:` speech card · `date:` typed date.
Only reproduce real headlines/quotes/memos verbatim from the dossier, or label generic ones clearly as illustration ("THE DAILY LEDGER").

## 9. Events — atmosphere & lens (over the whole frame)
`letterbox` cinema bars · `focus:1` selective focus on one subject · `vhs` tape overlay · `glitch` frame glitch · `siren` police strobe · `flicker` power failure ·
`leak` light leak · `rays` god rays · `smoke` · `rain` · `snow` · `embers` · `moneyrain` · `confetti` · `pulse` heartbeat vignette (`bpm:`) · `burn` film burn · `flash:red|gold|white` · `red` red creep · `shake`.

## 10. Transitions `trans=`
`cut` (default, 80 %) · `whip` / `whipUp` (time/money moves) · `match` (zoom-through on a shared shape) · `flash` (shock) · `slam` (smash cut, punch-in) ·
`tear` (paper tear — collage) · `burn` (film burn into the past) · `glitch` (tech, hacks, crashes) · `shutter` (camera shutter — photo sequences).
Refused: fade, dissolve, cube, spin, iris, page curl, circles.

## 11. Beats & acts
`# cine` · `# ppcase` (case-file sting) · `# ppend` (end card) · acts `setup rise doubt fall after flash lesson thumb`.
