# Storyboard Reference (.story)

The storyboard is the only file you normally write. ~20–40 lines → a finished 45–120 s episode
in 16:9 and 9:16. The compiler (`engine/storyboard.js`) handles layout, camera, transitions,
timing, entrances, shakes and SFX.

## File shape
```
title: <episode title>
format: explainer            # sets look, transitions, camera energy, music, voice — see directing.md
voice: am_michael            # optional override · none = no voice-over
music: adventure             # optional override · mood name, a file path (mp3/wav), or none
look: grade=warm captions=karaoke boil=off step=1 smear=on   # optional overrides
sources: <url> — checked <Mon YYYY>
cast: minh = man elder skin=5 hair=bald beard=white top=baba:#3a6b8a hat=nonla name="Ông Minh"   # new characters (film-language.md §8)
set: temple_hill = sky=dawn far=karst mid=pagoda,forest ground=dirt deco=fog                     # new places
// angle: … (treatment lines — see directing.md)

# <beat> key=value key="value with spaces"
Caption line one (one idea, 6–14 words).
Caption line two.

# <beat> …
```
- Header keys: `title`, `format`, `voice`, `music`, `score`, `look`, `sources`. `score: comedy@1 quiz@4 emotional@5 cafe@17 adventure@25`
  = a multi-mood soundtrack (mood@scene number, 1-based), crossfaded at the cuts — one mood per act, never one loop for the whole film. Formats: explainer · countdown · myth · food ·
  history · guide · versus · story · night · quiz. Music moods: adventure · cafe · upbeat · comedy · epic · emotional ·
  night · chill · quiz. Voices: `python3 tools/voice.py voices` (am_michael, af_heart, bm_george, bf_emma, am_puck…).
- `look:` `look`: `grade` = warm · golden · teal · night · punchy · clean;
  `captions` = line · karaoke · punch; `boil` = off · on · <px>; `step` = 1 · 2 (on twos); `smear` = on · off.
- Captions: one per line. Each line is spoken by the narrator; with voice-over on, every caption is timed to its
  real audio length (otherwise ≈2.6 words/s). **Sync trick**: in `steps`, `timeline`, `budget`, `countdown`
  give exactly one caption per item → each item appears the moment its line is spoken.
  `*word*` = yellow highlight · `[45,000 ₫]` = brand-orange accent (prices, punchlines).
- `// comment` lines are ignored. A final `# end` is added automatically if missing.
- Ids: characters, places, props, cities → `asset-catalog.md` (+ anything you add in `engine/library/`).

## Options every beat accepts
`place=<id>` · `time=day|sunset|night` · `dur=<s>` (minimum; captions can extend it) ·
`trans=<transition>` (override) · `cam=<move>` (extra camera move over the whole beat) ·
`grade=<grade>` · `caps=line|karaoke|punch`.
Cinema (film-language.md): `shot=WS|FS|MLS|MS|MCU|CU|ECU on=<char> angle=eye|low|high|dutch` · `shots="WS dave|MCU linh|CU dave low"`
(one per caption) · `cover=none` · `lens=wide|normal|tele|flat` · `light=day|sunset|night|studio|none` · `dof=<px>` ·
`impact=no` (gags) · `photo=<sticker id>` + `px= py= ph= pstyle=sticker|polaroid|torn plabel="…"`.
World: `extras=none|crowd|traffic|both` · `weather=rain|fog|snow|petals|fireflies` · `back=yes|<char>` · `bgphoto=<plate id> ground=.86`.
Header `charstyle: storybook|flat|paper|ink|anime|toy|noir|retro|chibi` redesigns every character for this video (film-language §16).
Sound (any beat): `sfx="0.4:egg_crack|1.2:whisk:0.6:-0.2"` (offset s : sound [: gain [: pan]]) · `foley=no` to mute the automatic foley.
Sounds: egg_crack whisk pour spoon_clink cup_set door_bell register coins footsteps fan record_scratch rumble steam simmer slide_whistle slide_down
tape_rewind shutter heartbeat drumroll typing tram_bell bike_bell slurp claps creak squeak wipe knock clock sugar plop ooh scooter_horn + every engine cue (impact ding whoosh pop sparkle choir …).
Grade (any beat): `grade=warm|golden|teal|night|punchy|clean|sepia` — sepia for flashbacks / period scenes.
Depth & acting (any beat): `fg=leaves|bamboo|lanterns|window|door|wires|flowers|crowd|bokeh|grass|rain` (+ to combine) · `rays=yes|right` ·
`act="dave:shade|linh:walk:1>wave"` · `cam=crane+breathe` (moves combine with +; new: crane craneDown vertigo arc whip snap breathe).

Any beat also takes `capY=` (caption height 0–1, e.g. `.44` to lift a caption off a face).
Cinema keys on any beat (v5):
- `artstyle=comic|watercolor|riso|papercut|dongho|lacquer|neon|pixel|vhs|chalk|storyb|none` — whole-frame art direction
  (header `artstyle:` sets it for the film; references/art-styles.md).
- `art="BIG|small" artfx=slam|stack|count|stamp|typeon|mask|gold|neon|comic|hand|split|sign artAt= artOut= artX= artY= artCol= artSize=`
  — art-directed lettering with its own sound (references/typography.md).
- `drop=1.2` — music cuts out 0.4 s before 1.2 s and slams back (silence before the hit).
- `caps=off` — hide the caption on this beat (the voice still plays; the lettering carries the line).
- `sfx="-0.6:city_bed:.4"` — negative offset = J-cut (sound leads the picture). New sounds: riser boom riser_hit braam shimmer
  neon_buzz tick_roll whoosh_by horn_far air_brake bus_horn city_bed (references/sound-music.md).

## Beats
| Beat | Purpose | Keys (defaults) |
|---|---|---|
| `map` | Hook: zoom from the region to a place, drop a pin | `to=<city id>` or `lon= lat=` · `label="TEXT"` · `zoom=640` |
| `title` | Title card | `text="LINE 1\|LINE 2"` · `sub=` · `variant=slam\|paper\|place\|film` (place/film: over `place=` at `time=`) · `bg=` · `bike=no` |
| `intro` | Hero drops in with name tag, host enters, asks, hero reacts | `hero=dave` · `mood=neutral` · `react=starstruck` · `reactPose=cheer` · `host=` · `ask="line\nline"` · `shout="SIGN ME UP"` · `label=` · `role=` · `place=oldquarter` |
| `talk` | Host explains (lip-flaps while each line is spoken; `speaks=no` to stop); prop (stands on a low table beside the host — two-shot / medium alternate) or big text | `host=linh` · `pose=present` · `pose2=point` · `mood=happy` · `prop=<id>` · `size=1` (× auto-fit) · `big="TEXT"` · `place=studio` |
| `price` | Price Check (brand format B) | `hero=dave` · `seller=<id>` · `hold=<prop>` · `holdScale=.4` · `item="…"` · `vnd="45.000 ₫"` · `usd="$1.80"` · `checked="Oct 2026"` · `react=yummy` · `place=sidewalk` |
| `list` | Checklist (format D) — in 9:16 the card sits on top, caption under it, `host=` small at the bottom; give `place=` for a real background | `title="WHEN TO GO"` · `items="a\|b\|!avoid this"` (`!` = red ✗) · `host=linh` · `step=` |
| `compare` | A vs B split (stacks in 9:16) | `leftTitle= rightTitle=` · `left=<char> right=<char>` · `leftRide=yes` · `leftMood=` · `leftPose=` · `leftPrice="vnd;usd;item"` (same for right) · `checked=` |
| `reveal` | Landmark reveal: detail → wide + banner | `place=` · `label="BANNER"` · `hero=` · `pose=photo` · `mood=starstruck` · `fx=.62 fy=.45` (start point) · `particles=sparkles\|fireflies\|petals` · `rays=yes` · `season=gold` |
| `ride` | Riding through a place, parallax, speed lines | `place=hagiang` · `hero=dave` · `vehicle=moto\|scooter\|cyclo` · `passenger=<char>` · `stop=yes` + `sign="NAME" sub="subtitle"` · `react=` |
| `gag` | Setup → crash zoom + dutch + shake + punch text | `hero=` · `hold=<prop>` · `mood=happy` · `react=shocked` · `reactPose=scared` · `punch="TEXT!"` · `hit=<s>` · `place=` |
| `social` | Night table: toasts, sparkles, expression drift | `hero=` · `host=hmong_grandpa` · `toasts=3` · `cheer="MỘT, HAI, BA… DZÔ!"` · `drink=ruou_ngo` · `food= food2=` · `drift=no` · `place=homestay` |
| `route` | Map route with mini rider + stat cards | `stops="hanoi,ninhbinh,…"` (city ids, add more with `CITY`) · `loop=yes` · `stats="BIG;small\|BIG;small"` · `zoom=` · `hero=` · `vehicle=` |
| `stat` | One giant animated number | `value=350` · `from=0` · `prefix= suffix=" km"` · `decimals=0` · `label="of mountain road"` · `bg=#hex` |
| `scale` | Height/depth gag with escalating ruler | `place=phongnha` · `marks="here\|far\|NOPE."` |
| `payoff` | Sunset transformation + title + CTA | `hero=` · `host=` · `title="A\|B"` · `sub=` · `cta=vietadvisor.travel` · `ctaTop=` · `beard=no` · `place=` |
| `chapter` | Long-form chapter card | `num=2` · `text="The North"` |
| `end` | Brand end frame "— Vietadvisor" | `url=` |
| `hook` | Cold open: big question over a dimmed place | `text="…"` · `place=` · `hero=` `mood=` `pose=` |
| `countdown` | "#3 — item" card | `n=3` · `text="Bánh mì"` · `prop=banhmi` · `size=1.7` · `sub="25,000 ₫ · ≈ $1"` · `hero=` · `bg=#hex` |
| `myth` | MYTH card → BUSTED stamp → FACT card | `myth="…"` · `fact="…"` · `stamp=BUSTED` · `host=` (2 captions: myth line, fact line) |
| `quiz` | Question, 3–4 options, 3-2-1 ring, reveal | `q="…"` · `options="a\|b\|c"` · `answer=2` · `reveal=<s>` (default: start of last caption) |
| `timeline` | History line with years | `title=` · `events="1802;Label;prop\|1945;Label"` |
| `steps` | Numbered how-to cards with icons | `title=` · `items="a\|b\|c"` · `icons="phone\|backpack\|money"` (prop ids) · `host=` |
| `budget` | Stacked cost bar + total | `title=` · `items="Bike;1.2M\|Food;600k"` · `total="3M ₫"` · `usd="$118"` · `checked=` |
| `calendar` | 12 months rated 1–3 | `title=` · `rating="2,2,3,3,2,1,1,1,3,3,3,2"` · `note="…"` |
| `dialogue` | Two characters talk; bubbles; each voiced with its own voice; lip-sync | `a=dave b=linh place=` · `lines="a:mood:text\|b:mood:text"` · `voiceA=am_echo voiceB=af_heart` |
| `montage` | Fast cuts through places with stamps | `places="hanoi,hoian,saigon"` · `labels="A\|B\|C"` · `seg=0.9` |
| `collage` | Real-photo stickers slap onto paper, camera visits each | `photos="id1\|id2\|id3"` · `labels="A\|B\|C"` · `style=sticker\|polaroid\|torn` (one caption per photo = sync) |
| `photo` | Full-frame real photo (Ken Burns) + optional cartoon host | `img=<id>` · `focus=.5,.4` · `z0=1.04 z1=1.16` · `label=` · `hero=` `pose=` `mood=` · `credit=no` |
| `timelapse` | One place from day to night, clouds racing | `place=` · `times="day,sunset,night"` · `dur=` |
| `moment` | Signature set piece (film-language §11) | `kind=crossing\|mapdive\|pass\|steam\|downpour\|cave\|lanterns\|seasons\|sunrise\|train\|fireworks\|window\|split` + its keys · `capAt=` `capY=` `dur=` |
| `raw` | Escape hatch: a full scene object in JSON (see episode-schema.md), closed by `# endraw` | — |

## Structure that works (60–90 s)
`map` → `title` → `intro` → 3–6 body beats (`route`/`reveal`/`ride`/`price`/`compare`/`gag`/`social`) →
`list` (practical) → `payoff` → `end`. Put a `gag` or `stat` every ~20 s as a pattern interrupt.
Short-form (7–20 s Reels): 2–4 beats, e.g. `price` + `gag` + `end`, captions `punch`.

## Physics & grounding (automatic)
Bikes on grass/floor/studio get a road; people on water get a sampan; `sit`/`sitHold` get a red plastic stool;
plain backgrounds get a floor shadow. Lint reports `FLOAT/physics` errors for anything above its support —
fix with `y:'ground'`, a sensible place, or mark a deliberate mid-air moment with `air:1` (raw scenes).

## Example (complete)
```
title: Bún chả in Hà Nội, honestly
format: food
sources: <url> — checked Oct 2026
// angle: bún chả is a lunch dish — arrive at 7 pm and it's gone
// hook: "Most tourists eat Hà Nội's best lunch… at dinner." + map zoom

# map to=hanoi label="HÀ NỘI"
This is *Vietnam*. Up north… *Hà Nội*.

# intro hero=kenji mood=thinking host=linh ask="Lunch?\nBún chả."
Kenji has a spreadsheet for lunch.
Linh has a better idea.

# price place=sidewalk hero=kenji seller=cophovn hold=buncha item="bún chả, street stall" vnd="50.000 ₫" usd="$2" checked="Oct 2026"
A full set runs about [50,000 ₫] (~$2).

# gag place=sidewalk hero=kenji hold=chili react=hot punch="SPICY!"
Go easy on the chili.

# list title="Good to know" items="Lunch only — 11 am to 2 pm|Dip, don't pour|!Tourist menus — double price"
Bún chả is a lunch dish. Most stalls close by 2 pm.

# payoff hero=kenji host=linh title="BÚN CHẢ|HÀ NỘI" sub="11 am – 2 pm · 50k ₫ · 0 regrets"
Kenji updated his spreadsheet.
```
