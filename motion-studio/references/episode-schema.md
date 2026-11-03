# Episode Schema

An episode is a JS file that sets `window.EPISODE`. It is plain data plus optional functions for
bespoke shots. Load order: the engine is already loaded, so episodes can call any engine function.

```js
window.EPISODE = {
  title: 'Hội An in 60 seconds',
  fps: 30,
  sources: ['…url — checked Oct 2026'],
  finish: { grain: true, vignette: true },
  scenes: [ /* Scene objects, played in order */ ]
};
```

## Scene
| Field | Type | Meaning |
|---|---|---|
| `id` | string | name (used in cue sheets) |
| `dur` | seconds | scene length |
| `transition` | `{type, dur, center?}` | transition INTO this scene (see camera-and-motion.md) |
| `place` | place id | parallax background (`asset-catalog.md`) |
| `placeOpts` | `{time:'day'|'sunset'|'night', season:'gold', color…}` | background options |
| `scroll` | keys `[{t, v}]` | background pan in px (parallax handled per layer) |
| `cam` | keys `[{t, x, y, z, rot, ease}]` | base camera: centre (fractions) + zoom |
| `moves` | `[{type, t0, t1, …}]` | named camera moves stacked on `cam` |
| `focus` | number | focus depth for depth-of-field (default 1) |
| `layers` | Layer[] | everything in the shot |
| `captions` | `[[t0, t1, 'text', {y?, style?, hide?, speaker?}]]` | narration captions; `*hi*` yellow, `[x]` brand orange. `hide:1` = spoken + in SRT but not drawn (dialogue bubbles); `speaker` = voice id or `a`/`b` |
| `capY` | `{h?, v?}` | caption baseline as fraction of height, per format |
| `shakes` | `[[t, amp, dur]]` | screen shakes |
| `particles` | `[{type, t0, t1, a}]` | scene particles |
| `sfx` | `[[t, 'name']]` | sound cue sheet (exported, not rendered) |
| `render` | `(lt, S) => {}` | fully custom scene (replaces place/layers) |
| `bg` | `(lt, S) => {}` | custom background drawn after the place |
| `v` | object | overrides applied only in 9:16 (deep-merged) |

## Layer (common fields)
| Field | Meaning |
|---|---|
| `type` | `char` · `prop` · `ui` · `text` · `map` · `particles` · `fn` |
| `x`, `y` | fractions of stage width/height. `y:'ground'` = the place's ground line. |
| `dx`, `dy` | offsets in units (scaled by `U()`) |
| `s` | scale (characters ≈1 = 400 units ≈ 37 % of a 1080 frame) |
| `z` | draw order |
| `depth` | parallax / dolly / depth-of-field plane (1 = subject) |
| `blur` | extra blur in px |
| `screen` | `true` = drawn after camera (UI, overlays) |
| `keys` | `[{t, …any field…, ease, dur}]` — numbers tween, others switch at `t` |
| `in` / `out` | `{type:'pop'|'drop'|'up'|'slideL'|'slideR'|'zoom'|'fade', at, dur}` |
| `hide` | skip (useful in `v` overrides) |
| `v` | 9:16 overrides for this layer |

### `char`
`id` (character), `pose`, `expr`, `look:[x,y]`, `flip`, `hold` (prop name), `holdScale`, `headwear`
(override), `shades`, `wind`, `jump`, `rot`, `spec` (partial design override), `autoWalk:false`,
`ride:1` + `vehicle`, `bikeColor`, `speed`, `talk` (0–1 lip-flap; key it on/off with `dur:.05`),
`stage` (`none|road|floor|boat|stool` — support drawn under the character; automatic by default),
`air:1` (deliberately off the ground: jumps, passengers, dreams — skips the FLOAT check), `noStool:1`, `floor:false`.

### `prop`
`name`, `opts` (prop-specific: `color`, `steam`, `text`…), `flip`, `rot`.

### `ui`
`name` (`title`, `stat`, `price`, `stamp`, `bubble`, `lower`, `checklist`, `skipInstead`, `counter`,
`chapter`, `arrow`, `punch`, `choir`, `banner`, `logo`, `cta`, `endFrame`), `at` (pop time),
`until` (exit time), `o` (component options; `o.x/o.y ≤ 2` are fractions).

### `text`
`text`, `size`, `fill`, `font:'display'|'body'`, `rot`, `scale`, `lw`, `shadow`.

### `map`
`view:[{t, lon, lat, k}]` (k = px per degree; 46 ≈ whole region, 600 ≈ province, 1100 ≈ loop),
`camLerp:{t0,t1,a,b}` (smooth zoom keeping target fixed), `routeP` keys, `o:{ route:[[lon,lat]…],
cities:[ids], cityAt:{id:t}, pins:[{lon,lat,label,at}], vnFill, vnColor, sea, labels }`.
After drawing, `S._map` = projector `(lon,lat)→[x,y]`, `S._mapO._head` = route head position.

### `fn`
`draw(lt, S, {x, y, u, io})` — custom drawing with the full engine API.

## Engine API you can call in `fn` / `render`
`person(x, y, s, spec, o)` · `drawProp(name, x, y, s, opts, t)` · `PLACE[id].draw(t, o)` ·
`vnMap(o)` · `mapPin()` · `UI.*(p, o, t)` · `caption()` · `T(text, x, y, o)` · `shaded()/sCirc/sEll/
sRR/sPoly/sSmooth` · `karstPeak` · `range()` · `PARTICLES.*` · `focusLines` · `speedLines` ·
`burstBg` · `dustPuff` · easing `E.*` · `pop(t, at, dur)` · `inv/lerp/clamp` · `U()` (unit) ·
`HB()` (baseline) · `W/H` (stage) · `stage(fx, fy, fn)` (draw a fixed 1920×1080 design cover-fitted
to any format — see the Hà Giang episode).

## Formats
`--fmt 16x9` (1920×1080) · `9x16` (1080×1920) · `1x1` (1080×1080) · `4x5` (1080×1350).
