# Style Bible

## Look in one sentence
Bold-outlined, cel-shaded 2D cartoon with chibi proportions, warm paper tones and saturated
Vietnamese colour — friendly, readable at phone size, a little cheeky.

## Line & shading
- Outline: warm ink `#2B1D16` (never pure black), 6 px at character scale 1 (≈5–6 px on props,
  4–7 px on places, scaled with `U()`), round joins and caps.
- Cel shading on every filled shape: base colour + a top-left highlight crescent (+10 % lightness)
  + a bottom-right shadow crescent (−13 % lightness, +6 % saturation, hue −8° toward purple).
  Use `shaded()`, `sCirc`, `sEll`, `sRR`, `sPoly`, `sSmooth` — never flat grey shadows.
- Limbs: thick rounded strokes with an ink pass + colour pass (`limb()`).
- Atmosphere: haze bands between depth layers, soft radial glows for lamps/sun, grain 5 % overlay,
  warm vignette.

## Proportions (character scale 1)
- Adult ≈ 400 units tall: head radius 84 (≈42 % of height incl. hair), torso 110, legs 105.
- Kid: head 78, legs 66. Elder: slightly shorter, wrinkles, grey hair.
- Big eyes (white sclera, brown iris, black pupil, two highlights), small nose, expressive brows.
- Same eye style for every ethnicity — differentiate with skin tone, hair, clothing, accessories.

## Palette
| Token | Hex | Use |
|---|---|---|
| ink | `#2B1D16` | outlines, text stroke |
| paper | `#F3E6C4` | backgrounds, map land |
| cream | `#FFF8EA` | cards, bubbles |
| **brand** | `#EE4D2D` | Vietadvisor accent: prices, numbers, CTA, punchlines |
| red (flag) | `#DA251D` | flag, Vietnam on map |
| gold (flag star) | `#FFCD00` | star, highlights |
| yellow | `#F8C848` | caption highlight, titles |
| sky | `#8FD3F0` → `#C9ECF6` | day sky gradient |
| sea / river | `#5CC0CF` / `#2FBFA6` | water |
| leaf / karst | `#7CB85C` / `#5F8F5A` | vegetation, mountains |
Skin tones `SKIN.s1–s7`, hair `HAIR.*` in `engine/core.js`.

## Typography
| Role | Font | Weight | Notes |
|---|---|---|---|
| Display (titles, stamps, banners) | **Baloo 2** | 800 | Vietnamese diacritics supported |
| Body / captions / labels | **Be Vietnam Pro** | 800 (900 for punch) | designed for Vietnamese |
| Thai | Kanit | 800 | auto fallback |
| Korean / Japanese / Chinese | Noto Sans KR / JP / SC | 900 | auto fallback |
All are SIL Open Font License (free for commercial use). Text is always white or yellow with a thick
ink stroke (≈20–26 % of font size) plus a soft drop shadow.

## Composition
- 16:9: subject on thirds, captions bottom (y≈0.93), cards on the free third.
- 9:16: scene baseline lifted (`HB()`), subject centred, text inside y 0.2–0.8, stack comparisons
  top/bottom, captions may move to a divider or the top (`capY`).
- Layering: far haze → mid → subject → foreground props → screen UI → captions → film finish.

## Motion feel
Snappy in, soft out. Overshoot on arrivals, ease-in on exits, nothing moves linearly except
scrolling backgrounds and wheels. Idle life is always on (breathing, blinking, swaying).

## Don'ts
No gradients on characters (only cel crescents) · no pure black · no thin hairline outlines · no
photoreal textures · no real logos/brands · no real public figures · no stereotyped features.
