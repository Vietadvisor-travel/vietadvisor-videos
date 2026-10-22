# Making New Assets (same style, any content)

The library is a starting set, not a limit. When a story needs something that doesn't exist — a dish,
a landmark, a costume, a vehicle, an animal — build it in code, in the house style, in minutes.

## Fastest first
1. **A person** → a `cast:` line in the storyboard (film-language.md §8) — any age, skin, hair, outfit, hat.
2. **A place** → a `set:` line (kits: town, colonial, pagoda, stilt, cham, market, terraces, interiors…) or
   `base=<place>` + deco/weather to re-dress an existing one.
3. **A real thing that must look real** (a famous dish, a landmark) → a photo sticker (`tools/sticker.py`).
4. Only if none fits → draw it in code (below).

## Decide: reuse, recombine, or build
1. **Reuse** an existing id if it is close enough (check `asset-catalog.md`).
2. **Recombine** for characters: almost every new person is a new `defChar()` that only mixes rig parts
   (hair × headwear × top × bottom × accessories × colours). No drawing code.
3. **Build** a new prop/place only when the thing is recognisable by shape (a landmark, a specific
   dish, a vehicle). Generic things (a cafe, a street) → existing place + props.

## Workflow (≈5 min per asset)
1. **Reference**: list the 3–5 features that make it recognisable + its 3–4 main colours
   (search the web if unsure — e.g. Huế's Thiên Mụ pagoda = 7-tier octagonal tower, pink-grey, bell house).
   Simplify ruthlessly: shapes a 10-year-old could draw, no tiny details below ~8 px at 1080p.
2. **Write** `engine/library/<id>.js` using the templates below, add `<id>` to `engine/library/index.js`.
3. **Preview** in ONE image: `node tools/preview.mjs char|prop|place <id>` → look, fix, repeat.
4. **Refresh**: `node tools/export_assets.mjs assets` (PNGs + catalog) when the set is final.

## Style rules every asset must follow
- Outline: `C.ink`, `LW` 5–6 px (props/characters), scale with `u` in places.
- Fill every shape with cel shading: `shaded(build, colour)`, `sCirc`, `sEll`, `sRR`, `sPoly`, `sSmooth`.
  Never flat fills on main shapes; never pure black; no gradients except sky/water/glow.
- Proportions: chunky and slightly squashed; round corners (`roundRect` radius ≥ 6).
- Colour: start from tokens in `C` (`C.brand`, `C.red`, `C.gold`, `C.leaf`, `C.karst`, `C.sea` …),
  shift with `shade(hex, dl, ds, dh)`. 3–4 colours per asset.
- Secondary motion when it costs one line: sway with `Math.sin(t * k)`, steam with `steamFx()`,
  glow with `glow()`, flags/lanterns swing.
- Cultural accuracy over cuteness for costumes, flags and religious objects.

## Character recipe — `defChar(id, group, name, desc, spec)`
```js
defChar('cyclist_mom', 'local', 'Chị Lan (school run)', 'Hà Nội mum on a bicycle at 7 am.', {
  skin: SKIN.s3, age: 'adult', build: 'slim',                    // age: adult|teen|kid|elder · build: slim|stocky · tall: 1.05
  hair: { style: 'bun', color: HAIR.black, pin: C.gold },        // see table
  top: { type: 'shirt', color: '#f2d0d8', long: 1, pocket: 1 },  // see table
  bottom: { type: 'pants', color: '#3d5a8a' }, shoes: 'sandal', shoeColor: '#8a5a32',
  headwear: { type: 'nonla' }, acc: ['bag'], bagColor: '#7a4a2a',
  lashes: 1, earring: C.gold, face: { mouth: 'smile', mo: .8 }   // default expression overrides
});
```
| Part | Options |
|---|---|
| `hair.style` | spiky · short · side · grey_short · buzz · bald · curly · afro · bob · long · longwavy · ponytail (`tie`) · braid (`tie`) · twin · bun (`pin`) · topknot |
| `top.type` | tee (`print`: star/stripe/heart/text + `text`, `color2`) · tank · polo · shirt (`long`, `pocket`, `pattern:'floral'`) · longsleeve · hoodie · jacket (`inner`) · leather (`inner`) · aodai (`pattern`: lotus/flower, `color2`) · baba · hmong (`bands`, `apron`) · flowerhmong (`bands`) · dao · thai · robe · vest (`inner`) · uniform. Extras: `sleeve`, `cuffs:[colours]`, `belt`, `sash` |
| `bottom.type` | shorts · cargo_shorts · pants · jeans (`cuff`) · cargo · aodaipants · wide · skirt · longskirt · pleated (`bands`, `batik`) · sarong (`band`); `belt` |
| `shoes` | sneaker · sandal · flipflop · boot · heel · barefoot (+ `shoeColor`) |
| `headwear.type` | nonla (`tilt`) · helmet (`visor`, `logo`) · cap (`back`) · bucket · beanie · hmongwrap · flowerhmong · daoturban · thai · headband · beret · flower · chef (+ `color`) |
| `acc` | backpack · bigpack (`packColor`, `strapColor`) · gui (`guiFill`) · khanran · bandana (`bandanaColor`) · silverring · camera · bag (`bagColor`) · lanyard · medal · apron (`apronColor`) |
| face | `glasses`: round/square/gold · `lashes` · `freckles` · `sunburn` · `beard:{color,a}` · `mustache` · `goatee` · `earring` · `eyeColor` · `eyeSize` · `thickBrows` · `lips` · `blush` · `wrinkles` · `faceShape:'oval'` · `bracelet` |

Need a part that doesn't exist (e.g. a new hat)? Add a `case` to `headwear()` (or `drawTop`, `hairFront`…)
in `engine/rig.js` following the neighbouring cases, then preview.

## Prop recipe — `defProp(name, cat, label, w, h, draw(o, t), extra)`
Origin = bottom-centre (sits on the ground/table). `w,h` = approximate size in units (used for auto-fit).
`extra.gripY` = height of the hand grip above the base (for `hold:`).
```js
defProp('trung_vit_lon', 'food', 'Trứng vịt lộn (balut)', 160, 150, (o, t) => {
  sRR(-50, -50, 100, 50, 12, '#c9a66b');                     // egg cup
  sEll(0, -88, 40, 50, '#f4ead8');                            // egg
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, -88, 40, 50, 0, 0, TAU); ctx.clip(); ell(0, -130, 44, 20, '#fff8e8', 4); ctx.restore(); // open top
  drawProp('chili', 60, -6, .4);                              // reuse other props
  if (o.steam !== false) steamFx(0, -150, t, 2, .5);
}, { gripY: 60 });
```

## Place recipe — `defPlace(id, label, desc, gOff, draw(t, o), extra)`
Must work in 16:9 **and** 9:16: use `u = U()` for every size, `HB()` as the bottom baseline,
`gy = HB() - gOff * u` as the ground line, `layerRep(span, factor, scroll, fn)` for parallax
(factor 0.1 far … 1 near), `sky()`, `range()`, `water()`, `hazeBand()`, `tubeHouse()`, `timeTint()`.
```js
defPlace('thien_mu', 'Huế — Thiên Mụ Pagoda', '7-tier octagonal tower above the Perfume River.', 170, (t, o) => {
  const u = U(), gy = HB() - 170 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, gy - 300 * u);
  range(71, 8, 2600 * u, gy - 180 * u, 160 * u, 260 * u, 300 * u, 420 * u, '#8fbf9a', .1, s, 4 * u);   // far hills
  { const x = W * .64 - s * .4;                                     // the hero landmark: position from W so it shows in 9:16 too
    for (let k = 0; k < 7; k++) { const w = (150 - k * 14) * u, h = 62 * u, y = gy - 200 * u - k * h;
      sRR(x - w / 2, y - h, w, h, 4 * u, '#d9b9a9', { lw: 4 * u }); sPoly([[x - w / 2 - 14 * u, y - h], [x + w / 2 + 14 * u, y - h], [x + w / 2, y - h - 16 * u], [x - w / 2, y - h - 16 * u]], '#7a4a3a', { lw: 4 * u }); } }
  water(gy - 60 * u, '#5fa8a0', { ...o, t }, .6);                                                 // river
  rr(-20, gy, W + 40, H - gy + 20, 0, '#b8b2a6', LW);                                              // ground
  timeTint(o);
});
```
**Surface**: tell the physics layer what the ground is — `extra: { surface: 'road'|'pavement'|'dirt'|'grass'|'sand'|'water'|'floor'|'rail' }`
(default grass). Water → characters get a sampan and bikes are an error; grass/floor → riders get a road band.
Hero landmarks: position from `W` (e.g. `W * .64`), not inside `layerRep`, so they are visible in the narrow 9:16 frame; use `layerRep` for repeating scenery.
Check in the preview: ground line (pink) where feet should stand, parallax when scrolled, 9:16 looks
full (no empty sky band), night variant readable.

## Using new assets
They are ordinary ids: `place=thien_mu`, `hold=trung_vit_lon`, `hero=cyclist_mom` in storyboards,
or in episode layers. Commit library files with the episode so the video can be rebuilt later.
