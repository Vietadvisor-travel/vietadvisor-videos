# Art styles — whole-frame art direction (`artstyle:`)

`charstyle:` only changes how **characters** are drawn (outline, proportion) — the difference between its 10 options is
small. `artstyle:` changes the **whole picture**: line, colour, texture, paper. One line in the header gives an episode
its own identity; one key on a beat gives a single shot a different world (flashback, dream, archive footage).

```
artstyle: comic                 # header — the whole film
# moment kind=wow_fleet artstyle=lacquer     # one beat only
# talk place=hanoi artstyle=none             # turn it off for one beat
```
Implementation: `engine/library/artstyles.js`, a post pass over the finished frame (before captions). All free, no assets.
Cost: ~10–40 ms/frame (the ones doing a palette pass — riso, dongho, lacquer, papercut, pixel — are the slow ones).

| artstyle | Look | Best for |
|---|---|---|
| **`nutshell`** | **HOUSE LOOK** — natural colour, outline-free soft shapes, glow only on real highlights (lamps, sun, neon), a touch of indigo in the shadows | **the default for every episode** unless the content clearly calls for another |
| `comic` | posterised colour + heavy ink lines + halftone dots + paper tint | street energy, action, gags, Spider-Verse feel |
| `watercolor` | soft wash, wet dark rim, paper grain, muted colour | nature, caves, rivers, calm/poetic beats, intros |
| `riso` | 5-ink risograph screen print, misregistration, heavy grain | food, markets, posters, youthful/trendy episodes |
| `papercut` | flat posterised layers with cut-paper drop shadows | explainers, how-it-works, nature, kid-friendly |
| `dongho` | Đông Hồ folk woodblock: 6-colour palette, carved outline, điệp paper | Vietnamese history, folk tales, Tết, culture |
| `lacquer` | sơn mài: deep black-red lacquer, gold leaf on highlights, crackle | dynasties, battles, legends, prestige openings |
| `neon` | crushed blacks, cyan/magenta bloom, chroma shift, scanlines | nightlife, night markets, Sài Gòn after dark |
| `pixel` | 8-bit pixels, 4-level colour, scanlines | game-style gags, "level up", retro jokes |
| `vhs` | tape chroma shift, scanlines, noise, tracking lines | 80s/90s flashbacks, "archive footage" beats |
| `chalk` | slate board with chalk strokes | school/explainer asides, rules, diagrams |
| `storyb` | pencil storyboard on paper | plans, "what if", behind-the-scenes, previz |

## How to choose
- **The house look is `charstyle: nutshell` + `artstyle: nutshell`.** (Don't add `grade=nutshell` on top — double bloom blows out skies.) Characters stay nutshell in EVERY
  episode (round, outline-free, dot eyes, rim light) so the channel is recognisable; only `artstyle:` changes.
- **One style per episode** (plus at most one second style used *deliberately* for flashbacks or a dream). Switching
  every beat looks broken, not designed.
- **Pick from the content**: history → `dongho` or `lacquer`; street/comedy → `comic`; nature/route → `watercolor` or
  `papercut`; food/market → `riso`; night → `neon`.
- **Never the same style as the previous episode** — this is what makes the channel look designed rather than templated
  (lint's `[variety]` check compares against the other stories in the folder).
- Combine with `grade=` (colour) and `charstyle=` (characters): e.g. `artstyle: dongho` + `charstyle: paper` + `grade=sepia`.
- Captions and `art=` lettering are drawn **after** the style pass, so they stay crisp and readable.
