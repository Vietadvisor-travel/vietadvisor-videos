# Typography — lettering is part of the shot

Two kinds of text, never confused:
1. **Lettering** (`art=`): the headline of the shot — designed, placed, animated, timed to a hit. 1–6 words. Not every beat; ~1 per 8–15 s.
2. **Captions**: the voice-over, small and low, for sound-off viewing (see `captions.md`).
Lettering never repeats the caption word for word; it distils it ("Riders read your speed" → `art="THEY'RE READING|YOU"`).

## The twelve looks (`engine/library/typekit.js`)
`# <any beat> … art="BIG LINE|small line" artfx=<look> artAt=.3 artOut=4 artX=.5 artY=.22 artCol=#ffd34a artSize=1`
| artfx | Font | Motion | Use for | Auto sound |
|---|---|---|---|---|
| `slam` | Anton | 2.4× → 1 overshoot, RGB misregistration, shock ring | hook numbers, verdicts, rules | impact + boom, music dips before |
| `stack` | Anton | words stacked into one justified block, each slams | hook statements, commands ("NEVER *RUN*") | thud per word |
| `count` | Anton | number rolls up from 0, rings on landing | statistics, prices, years, distances | tick roll → ding |
| `stamp` | Anton + Oswald | inked red seal drops and thuds | BANNED · CHECKED · SOLD OUT · a year | stamp + thud, dip |
| `typeon` | Oswald | documentary card, typewriter + cursor | place/date slugs ("HÀ NỘI · 1945") | typing |
| `mask` | Playfair Display | rises out of a mask line, slow tracking-in, hairline rule | chapter and trailer titles, history | riser → boom, dip |
| `gold` | Playfair Display | metallic gradient, glint sweep | dynasties, victories, luxury | shimmer + braam |
| `neon` | Pacifico (+Bungee sub) | flickers on, tube glow | night markets, bars, nightlife | neon buzz |
| `comic` | Bangers | halftone starburst, jitter on twos | onomatopoeia: BEEP! WHOOSH! CRACK! | pop + boing |
| `hand` | Patrick Hand | written on, scribbled underline | tips, asides, "pro tip" | pen scratch |
| `split` | Anton | halves slide in from opposite sides and lock | versus, before/after, a turn | whoosh + impact |
| `sign` | Bungee | yellow street plate swings in | road rules, warnings | thud |
`*word*` in the art text = the accent colour (`artCol`). All fonts are OFL and carry full Vietnamese diacritics.

## Art-direction rules
- **Hierarchy**: one dominant line (size), one supporting line (≤ 40 % size, wide tracking, accent colour). Never three sizes.
- **Match the world**: history → serif (`mask`, `gold`); street/energy → condensed sans (`slam`, `stack`, `sign`); comedy → `comic`;
  night → `neon`; documentary facts → `typeon`. One or two looks per episode + the house `slam`, so it feels designed, not a font sampler.
- **Place it in the composition**, in the negative space you planned: sky in a worm's-eye shot, the road in a bird's-eye,
  beside the face (never on it). `artY` .15–.35 in 9:16; in 16:9 use the empty third (`artX=.3` / `.7`).
- **Diegetic beats graphic** when you can: a sign on the facade (`F3.onQuad`), a year chalked on a wall, a price on the cart.
  Kinetic overlays are for the big claims.
- **Time it to the voice**: lettering lands on the stressed word (`artAt` = that word's time in the beat, usually .2–1.2 s), holds ≥ 1.2 s
  plus 0.25 s per word, exits before the next idea (`artOut`) or on the cut.
- **Contrast**: stroke or shadow on everything over busy backgrounds; stamps and signs carry their own plate.
- **Motion vocabulary**: fast in (≤ 0.2 s) with overshoot, slow life (glint, flicker, tracking), quick out (0.3 s). Never fade in slowly on a punchline.
- **Vietnamese**: keep diacritics in lettering (HÀ NỘI, BẠCH ĐẰNG); caps are fine — Anton/Oswald/Playfair stack the marks cleanly.
  Leave 15 % extra top room for stacked tones (Ầ, Ặ).
- **Safe areas** 9:16: x 8–92 %, y 12–70 %. 16:9: 5 % margins. qa.py lint boxes include lettering — fix every "covers a face".
- **Reading time**: ≤ 3 words per second of hold. A number reads as one word.
- Less is more: if the picture already says it, no lettering.

## Recipes
```
# moment kind=street3d cam=worm near=1.0 art="7,000,000|motorbikes" artfx=count artAt=.2
# moment kind=street3d cam=side mode=run art="NEVER *RUN*|rule one" artfx=stack artAt=.3
# moment kind=shot_bird art="The river|riders read you" artfx=mask artAt=.8
# title variant=film text="…" art="BẠCH ĐẰNG|1288" artfx=gold
# moment kind=shot_eyes art="BEEP!" artfx=comic artAt=.4 artOut=1.6
# map … art="BANNED|petrol bikes · Hoàn Kiếm · 2026" artfx=stamp artAt=1.5
```
