# The look follows the content (v4.2). 16:9 only.

There is no fixed channel colour any more. **Each episode picks the look that fits its story**, and a single act or a
single beat may switch look when the story changes world, for example a 1920s flashback inside a modern episode.
A look sets everything at once:
- the backdrops (base colours, texture and ornament);
- how real photos are treated;
- the accent palette and the colour of every act;
- the vignette;
- the colours of the paper map;
- the ink and card colours of every set piece and mode;
- the light and background of the 3D shots.

```
look: tech                       ← story header: the whole episode (or the whole act file)
# cine act=flash look=vintage …  ← one beat in another world (a flashback, a quote from 1929)
```

## The 11 looks: which content gets which look

| Look | What it looks like | Use it for |
|---|---|---|
| `dossier` (default) | case file on a desk: manila, kraft, archive prints | investigations, frauds, "the file on…" stories |
| `noir` | dark navy, B&W prints, red crisis | scandals, deaths, dark mysteries |
| `editorial` | clean off-white, black ink, signal red/yellow, colour photos | explainers, modern business, consumer brands (Apple, Nike, IKEA) |
| `tech` | near-black slate, cyan and violet light, scan lines | tech, startups, crypto, AI, social media (FTX, Theranos, WeWork, Meta) |
| `luxury` | black and champagne gold, film grain, elegant B&W | billionaires, fashion, luxury, hotels, art (LVMH, Gucci, Rolex) |
| `vintage` | sepia film with scratches, warm brown | 1850–1950 history (Rockefeller, Ford, Titanic, the 1929 crash) |
| `retro` | 80s/90s purple night, hot pink and cyan, synth grid | Atari, Blockbuster, Nintendo, MTV-era brands, the dot-com bubble |
| `broadcast` | cool white newsroom, navy, breaking red | recent news events, trials, public collapses |
| `eastern` | rice paper, vermilion seal, gold, ink | Asian conglomerates (Samsung, Alibaba, Toyota, Tata, Vingroup, Evergrande) |
| `ledger` | banker's green, ruled lines, gold | banks, Wall Street, financial crises, hedge funds (Lehman, SVB, Credit Suisse) |
| `blueprint` | engineering blue, white grid lines | manufacturing, aviation, cars, infrastructure, engineering failures (Boeing, Tesla factories) |

**How to choose.** Ask what world the story lives in, not what mood you want. If two looks fit, take the one the
audience would *expect least but accept at once*. Change look inside an episode only on a world change, such as a
flashback, an archive quote or a different country; at most 2 looks per episode, plus single-beat flashes.

## Rules that hold in every look
- **Format:** 16:9 only (1920×1080 final). No vertical cuts, no Shorts.
- **Red is for crisis and stamps only.** Each look defines its own red; never use it as decoration.
- **Captions:** one style, bottom 10 %, white with a dark stroke, numbers in the look's accent, never moved.
- **Physical objects keep their own colours.** A napkin is still a napkin, a newspaper is still newsprint, a receipt is
  still white thermal paper, a phone is still a phone. Only the world around them and the diagrams change.
- **Missing photos** show as a "PHOTO NEEDED" card. The draft stays watchable, but `pp_lint` errors until every image
  is imported. Never ship a card.
- **Check a look before committing to it:** `node tools/pp_looksheet.mjs stories/<file>.story --looks tech,editorial`
  renders the same story in each look side by side (`out/pp_looks.jpg`).

## Per-act colour script (automatic)
Every look carries 7 act grades: setup, rise, doubt, fall, after, flash and lesson. `act=` on a beat picks them, so the
colour already tells the story, from warm rise to cold doubt to the red edge of the fall. Don't override them unless
the beat needs it (`bg=`, `bgTone=`, `vig=`).

## Adding a look
Looks are data in `engine/library/pp_looks.js`: `def('<name>', { family, gold, red, ink, bg, plate, mid, vig, map, three, acts })`.
Copy the closest look, change its colours, then render `pp_looksheet` and check every beat type is readable. Add the
name to the `LOOKS` list in `tools/pp_lint.mjs`.
