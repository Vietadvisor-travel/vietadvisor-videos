# Scene Recipes

Reusable patterns. Copy the snippet, change ids/text. All snippets are scene objects for `EPISODE.scenes`.

## 1. Map open (hook) — "This is Vietnam… and this is X"
Zoom from the region to a place, drop a pin with a label. Motion from frame 1.
```js
{ id: 'map', dur: 7, layers: [{ type: 'map', view: [{ lon: 105.6, lat: 16.2, k: 46 }],
    camLerp: { t0: 1.5, t1: 4.8, a: { lon: 105.6, lat: 16.2, k: 46 }, b: { lon: 108.33, lat: 15.88, k: 640 } },
    o: { pins: [{ lon: 108.33, lat: 15.88, label: 'HỘI AN', at: 4.3 }] } }],
  captions: [[.1, 2.2, 'This is *Vietnam*.'], [2.4, 6.8, 'And halfway down the coast… *Hội An*.']], shakes: [[4.75, 14, .45]] }
```

## 2. Title slam
`render: renderTitle`-style: radial burst, star, title lines slam in with scale 3→1 (`UI.title`), ribbon subtitle, a bike crossing. 3–3.5 s, `transition: flash`.

## 3. Character intro + want
Character drops in (`in:{type:'drop'}`), arrow + name label, an expression that states the problem (bored, hungry, lost), host enters (`slideR`) with a speech bubble, reaction (`starstruck` + `cheer` + crash zoom + focus lines).

## 4. Route on the map
`map` layer with `route` + `routeP` keys (0→1), `cities` + `cityAt` pop times, a mini rider following `S._mapO._head`, stat cards popping on the side (vertical: one at a time with `until`).

## 5. Price Check (brand format B)
```js
{ type: 'ui', name: 'price', screen: true, at: 1.2,
  o: { x: .72, y: .3, item: 'phở bò, street stall', vnd: '45.000 ₫', usd: '$1.80', checked: 'Oct 2026' } }
```
Character holding the item (`hold: 'pho'`, pose `hold`/`eat`, expr `yummy`), `bounce` camera on the tag landing, SFX `ding`.

## 6. Skip / Instead (brand format C)
Split screen (`UI.skipInstead` or a divider `fn` + two places): crowded famous spot on the left/top with `bored`/`angry` crowd, alternative on the right/bottom with `joy`. Cross out the left with a stamp `SKIP`, then `pushIn` on the right.

## 7. How it works (brand format D)
Step list: `UI.checklist` items at 0.8–1.3 s intervals with a host pointing (`point` / `present`). Use `no:1` for a red ✗ item. Add one gag per 2 steps.

## 8. Landmark reveal
`place` + `moves: [{type:'reveal', from:[.7,.4], z:2.2, t0:0, t1:2}]` + label banner `UI.banner` popping at the end + `drift` afterwards. Particles (petals/sparkles) for beauty.

## 9. The scale gag (height / depth / distance)
Camera `tiltDown` or a custom tall world (see `renderCanyon` in `episodes/ha-giang-loop.js`), a ruler with escalating labels ("far → farther → NOPE."), then whip back to the character's reaction (`scared`, `pale`).

## 10. Night / social scene
`homestay`/`hoian` night + fireflies/lanterns, `toast` pose loops with sparkle bursts and shake taps, a counter (`UI.counter`) or punch text ("DZÔ!"), expression drift from `happy` → `tipsy` → `dizzy`. Always pair alcohol with a safety line.

## 11. Comparison (A vs B)
Divider + two headers + two characters + two price tags (see the `how` scene). In 9:16 stack top/bottom and put captions on the divider (`capY: { v: .5 }`).

## 12. Payoff + CTA
Sunset version of a place, character transformed (`cool`, shades, beard), title + subline + `UI.cta`, sparkles, then `transition: brand` into `UI.endFrame`.

## 13. Explainer with host (talking head)
`place: 'studio'`, host on a third with `present`/`point`/`think`, big text or a prop popping in on the other third, `pushIn` slowly, cut (not transition) between points.

## 14. Chapter card (long-form)
`UI.chapter` over a dimmed scene: "CHAPTER 2 — The North".
