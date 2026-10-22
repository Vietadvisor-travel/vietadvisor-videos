# Film language — make it feel like an animated film, not a slideshow

The engine already does the heavy lifting automatically (coverage, lens depth, DOF, light, springs,
lip sync). This page is how you **direct** it from the storyboard. Every key below is a beat option.

## 1. Coverage — the edit inside a scene (automatic)
`intro talk price social dialogue ride hook` beats are cut like a film: establishing shot first, then
closer shots on each new caption, shot/reverse-shot in dialogue, a close-up on reactions. Rules built in:
size changes ≥2 steps per cut (30° rule), ≥1.5 s per shot, subtle 3 % creep-in during each shot.
- `cover=none` — keep one continuous wide shot (for gags, maps, UI-heavy beats).
- `shot=MCU on=dave angle=low` — one fixed framing for the whole beat.
- `shots="WS dave|MCU linh|CU dave low"` — your own coverage: entry *i* starts with caption *i*
  (`SIZE subject angle`).

**Shot sizes** (cartoon proportions): `EWS` place with a tiny figure · `WS` full figure in its world ·
`FS` head-to-toe · `MLS` most of the body · `MS` head + torso (default dialogue) · `MCU` head + shoulders ·
`CU` face · `ECU` eyes/mouth only. **Angles**: `eye` (default) · `low` (power, awe) · `high` (small,
vulnerable) · `dutch` (unease, comedy). Lead room is automatic (space in front of the face).

| Moment | Use |
|---|---|
| New place | `WS`/`EWS` (+ `lens=wide`) for 3–5 s before any close-up |
| Explaining | `MS` → `MCU` on the next line |
| Reaction / punchline | `CU` or `MCU`, hard cut, hold 1–2 s |
| Awe (landmark, mountain) | `low` angle, `lens=wide`, slow push (`cam=pushIn`) |
| Intimacy / quiet | `lens=tele`, `MCU`, `light=sunset`, few cuts |
| Comedy | `dutch` on the reaction, `impact` on the hit (gag beats do this) |

## 2. Lens & depth (multiplane)
Backgrounds move like real depth: when the camera pushes in, the place zooms **less** than the characters,
anchored at the ground line (feet never slide). `lens=wide` (deep, dramatic) · `normal` (default) ·
`tele` (compressed, intimate) · `flat` (no depth). Close shots blur the background automatically
(`MS` 1.5 px … `ECU` 8 px); override with `dof=0` or `dof=6`.

## 3. Light
Every character gets a cast shadow and a rim light from the scene's key light, matched to time of day:
`day` (warm, high), `sunset` (orange, long shadows, strong rim), `night` (cool moon rim), `studio` (soft).
Override per beat: `light=sunset|night|day|studio|none`. Use `time=sunset` for emotional payoffs.

## 4. Acting (automatic)
- Every keyed move runs through a spring: anticipation (moves back a little first), overshoot and settle.
- Heads turn toward where characters look (3/4 view); blinks, breathing, idle sway are always on.
- Lip sync follows the real voice-over: hosts in `talk` and speakers in `dialogue` move their mouths to
  their line's audio. Dialogue lines carry mood: `lines="a:shocked:Is it safe?|b:happy:Yes."`
- Speech bubbles follow the speaker through every cut (above the head, or beside it on close shots).

## 5. Transitions — choose by meaning
| Transition | Meaning / when |
|---|---|
| `fgwipe` | a dark foreground element sweeps past and hides the cut — the most cinematic default for travel |
| `lightleak` | warm memory, montage, emotional payoff |
| `inkbleed` / `burn` / `watercolor` | history, chapters, flashbacks, gentle painterly change |
| `portal` | fly into a detail (window, bowl, map pin) — zoom-through |
| `tear` | scrapbook / "meanwhile" / contrast |
| `glitch` | myth-busting, tech, a jump in time |
| `whip` / `whipUp` | fast travel between places |
| `iris` `circles` `stripes` `push` `paper` `slide` `flash` `zoom` `fade` `cut` | classic cartoon grammar |
Formats choose a family automatically; set `trans=` on a beat to direct a specific cut.

## 6. Titles
`# title variant=film place=hoian text="HỘI AN|BY LANTERN LIGHT" sub="a Vietadvisor short"` —
letterbox bars, tracking-settle letters and a light sweep over a darkened place. Other variants:
`slam` (cartoon burst), `paper` (typewriter on parchment), `place` (title over a live place).

## 7. Real photos inside the cartoon (mixed media)
- Make a sticker: `python3 tools/sticker.py make <photo or URL> <id> --credit "Photo: Name / Source" --license "CC BY 4.0"`
  (background removed automatically; `--cut none` keeps the rectangle → polaroid/torn-paper card).
- Use it: `photo=<id>` on any beat (slaps in on the free side; `px= py= ph= pstyle=sticker|polaroid|torn plabel=`),
  `# collage photos="a|b|c" labels="A|B|C"` (photos slap onto paper in sync with captions, camera visits each),
  `# photo img=<id> hero=linh label="LAN HẠ BAY" focus=.5,.4` (full-frame Ken Burns plate with a cartoon host in front).
- Credits are drawn on photo plates and written to the credits file. Only your own photos or free-licence
  images with credit (see brand-rules.md).

## 8. Generated cast & sets (no asset limits)
```
cast: minh = man elder skin=5 hair=bald beard=white top=baba:#3a6b8a bottom=wide:black hat=nonla name="Ông Minh"
set:  temple_hill = sky=dawn far=karst mid=pagoda,forest ground=dirt deco=fog,petals
set:  night_rain = base=oldquarter time=night deco=rain,fog
```
- **cast** words: `man woman boy girl kid teen elder slim stocky freckles`; keys `skin=1-7 hair=style:color
  top=type:color bottom=type:color shoes= hat=type:color glasses=round|square|gold beard= mustache= goatee= acc=bag,camera,… name=`.
  Hair: short spiky curly bun ponytail long longwavy bob braid twin afro buzz bald topknot side flat wavy grey_short.
  Tops: tee shirt polo tank hoodie jacket leather longsleeve vest uniform baba aodai robe hmong thai dao chef.
  Bottoms: jeans shorts cargo_shorts skirt longskirt pleated wide sarong aodaipants. Hats: nonla cap bucket beanie beret helmet chef headband daoturban hmongwrap.
- **set** keys: `sky=day|sunset|night|dawn far=hills|karst|mountains|skyline|sea mid=town|colonial|pagoda|stilt|cham|market|forest|palms|bamboo|terraces
  water=river|lake|sea[:#hex] ground=road|pavement|dirt|grass|sand|floor|rail deco=lanterns|wires|trees|stalls|boats|rain|fog|snow|petals|fireflies|flags|altar
  palette=hanoi|hoian|saigon|pastel|north|mekong`, `base=<place>` to dress an existing place, `kit=room wall= floor= window=day|night` for interiors.
- Still missing something specific (a named landmark, a dish)? Write it as code (asset-authoring.md) or use a real-photo sticker.

## 9. A living world
- **Extras**: pedestrians and scooters cross behind the action automatically in city places; `extras=none|crowd|traffic|both`.
- **Weather**: `weather=rain|fog|snow|petals|fireflies` on any beat (rain has ground splashes).
- **Time-lapse**: `# timelapse place=hoian times="day,sunset,night"` — clouds race, lights come on.
- **Deep streets**: `set: s = kit=street3d palette=hoian time=night deco=fog` — one-point perspective street with lanterns and wires.
- **Photo backdrops**: `python3 tools/sticker.py plate <photo> <id>` turns a real photo into a drawn-style plate;
  use `bgphoto=<id>` (`ground=.86` = where feet stand) so cartoon actors perform inside a real location.
- **Back view**: `back=yes` (first character) or `back=<id>` — characters walk away from camera / look at a view.
- **Film look**: every frame gets a WebGL pass — bloom, warm halation on lights, grade per format, paper fibre,
  grain, vignette. `--draft` previews skip nothing; set `post=false` in a raw episode to disable.

## 10. Checklist for a film-quality video
1. One establishing shot per new place (`WS`/`EWS`, ideally `lens=wide`).
2. At least 3 different shot sizes per minute; at least one `CU` reaction per minute.
3. Light changes with the story (day → `sunset` for the payoff, `night` for social scenes).
4. Transitions chosen by meaning, at most two of the same family in a row.
5. One mixed-media moment (photo plate or collage) when a real place matters.
6. A quiet beat (3–6 s, no new information, music up) after every 2–3 dense beats in long videos.
7. 1–2 signature moments (§11) at the peaks; foreground framing (§12) on 1–3 scenes.
8. Every character *does* something (§14) — nobody just stands.
9. `review.mjs` score ≥ 85.

## 11. Signature moments — the visual peaks (`# moment kind=…`)
Hand-directed set pieces with their own camera choreography, light, depth and sound. Use 1–2 per minute at
the emotional peaks, with character/info beats between them (a film of only moments is a showreel).
| kind | what happens | keys |
|---|---|---|
| `crossing` | hero walks through Hà Nội traffic, scooters flow around | `hero=` |
| `mapdive` | map of Việt Nam dives to a pin, clouds rush past, a vista or place opens | `to=<city> label= place= time=` |
| `pass` | crane up over a sunset range, rider climbs a hairpin road into the distance | `hero= time=sunset|day|dawn|night helmet=` |
| `steam` | food hero shot: ingredients drop in, splashes, steam curls, rim light | `dish=<prop>` |
| `downpour` | sky turns, lightning, rain sweeps the street, people run, umbrellas | `place= cast=a,b,c` |
| `cave` | rowing boat glides out of a karst cave toward the light | `hero= guide=` |
| `lanterns` | night river, lantern strings, a lantern set down and drifting | — |
| `seasons` | terraced valley turns green → gold as the sun arcs | `labels="JUNE|SEPTEMBER"` |
| `sunrise` | silhouette on a rock, sun breaks the horizon, rays | `over=sea|mountains hero=` |
| `train` | train squeezes down a street, people flatten to the walls, carriage blur | — |
| `fireworks` | Tết / New Year over lake and skyline, crowd silhouettes | — |
| `window` | landscape racing past a sleeper-bus window, passenger in foreground | `time= hero= expr=` |
| `split` | two places at once with a sliding divider and VS badge | `a= b= labels="A|B" heroA= heroB= timeA= timeB=` |
All take captions (`capAt=` first caption time, `capY=` position) and `dur=`. Mapdive into `pass` is a
built-in match cut (same sunset vista).

## 12. Foreground framing & air (`fg=`, `rays=`)
`fg=leaves|bamboo|lanterns|window|door|wires|flowers|crowd|bokeh|grass|rain` (combine: `fg=wires+bokeh`) — an
out-of-focus near plane that moves faster than the subject: instant depth, "we are inside the place".
`rays=yes|right` — light shafts and floating dust. Use on 1–3 scenes per video, chosen by place
(wires in Hà Nội, lanterns in Hội An, bamboo/leaves in the countryside, door/window for interiors).

## 13. Camera moves (`cam=`, combine with `+`)
New: `crane` (rise to reveal) · `craneDown` · `vertigo` (dolly zoom — subject grows, background falls away; awe,
realisation) · `arc` (circle a character) · `whip` · `snap` (comic punch-in) · `breathe` (living still).
Classic: `pushIn pullOut crashZoom panL panR tiltUp tiltDown dutch handheld drift orbit reveal bounce dolly`.

## 14. Acting (`act=`)
`act="dave:shade|linh:walk:1.2>stop:.3>wave"` sets any character's action on any beat; chains blend
(.28 s) and one-shots (`release startle fall bowDeep pickUp throwUp`) play from their segment start.
Props are added automatically for `chopsticks sip phone selfie slurp toast`. Talking hosts gesture on their own.
Full list: shot-recipes.md.

## 15. Review before you render
`node tools/review.mjs stories/<slug>.story` (≈10 s) renders a 4 fps animatic and scores the cut: hook energy,
dead air, shot length & rhythm, monotony, peaks vs valleys, quiet beats, close-ups per minute, light journey,
foreground depth, reading speed. Fix until **score ≥ 85**, then make.

## 16. Character art direction (`charstyle:` header) — redesign the cast for every video
The same characters (Dave, Linh, generated cast…) are re-drawn in a different design language per video:
| style | look | good for |
|---|---|---|
| `chibi` | big head, big eyes, thick ink (house default) | explainers, comedy |
| `storybook` | taller, softer, fine brown line, dot eyes, warm palette | food, stories, family |
| `flat` | long limbs, no outlines, no shading, bean eyes, vivid | guides, myths, data |
| `paper` | paper cut-out with layered shadows, muted colours | versus, scrapbook, crafts |
| `ink` | woodblock / ink-wash: bold black line, sepia, calm eyes | history, culture, temples |
| `anime` | tall proportions, large sparkling eyes, pastel | youth, romance, Đà Lạt |
| `toy` | clay / vinyl toy: chunky, no outline, glossy light | countdowns, quizzes, kids |
| `noir` | deep shadows, cool palette | nightlife, mysteries, rain |
| `retro` | 1930s rubber-hose pie eyes, warm print colours | nostalgia, old Sài Gòn |
| `nutshell` | round, outline-free, dot eyes, rim light, saturated on deep backgrounds (pair with `grade=nutshell`, places `cosmos` `nutshell_lab` `orbit`) | science & big-picture explainers — `references/nutshell-style.md` |
Formats pick a default (explainer chibi · countdown toy · myth flat · food storybook · history ink · guide flat ·
versus paper · story storybook · night noir · quiz toy). Override per video with `charstyle:` and per character with
`style=` in a `cast:` line. Lint notes when two consecutive videos share a style.

## 17. Vertical (9:16) composition rules — built in, know them when you direct
- **Safe area**: TikTok / Reels / Shorts cover the top ~15 %, the right action rail (~12 %) and the bottom ~30 %
  (name + description). Captions are clamped to y ≤ 70 % and 74 % width; keep big text and faces inside x 10–88 %, y 15–70 %.
- **Shot sizes are wider in 9:16**: chibi heads are wide, so the frame keeps ≥ 2 head-widths at MS (1.55 at MCU, 1.25 at CU)
  and full headroom (hair, buns, hats counted). A character who holds or uses something (`hold=`, `act=stir|sip|eat|wipe…`)
  is never framed tighter than MS — the hands and the prop stay in shot.
- **Props never float**: a `talk` prop stands on a low table beside the host; coverage alternates a two-shot
  (host + prop) with a medium on the host.
- **Extras walk on a real surface**: each place declares its walkway (`WALK` in world.js / `walk` on a place);
  places without one get no automatic extras. Automatic extras only appear in establishing/travel beats
  (ride, reveal, intro, route, title, timelapse, hook, moment, montage) and fade out from MLS inwards.
- **Info cards (myth, steps, list)** fill the frame: card on top, caption under it, `host=` small at the bottom;
  pass `place=` for a real background instead of the plain studio.
- **QA every second, not every scene**: `python3 tools/qa.py stories/x.story` renders one still per second into
  contact sheets. Look at every sheet before `make` — floating people/vehicles, cropped heads, text on faces,
  props off-frame, empty halves of the frame, and anything static for > 3 s.
