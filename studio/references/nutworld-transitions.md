# NUTWORLD + TRANSITIONS II (Oct 2026) — the current house format

User verdicts that shaped this: talking heads = boring; 2D explainer = 6/10 "too static, infographic"; three.js world =
"looks like a 3D game, not nutshell". Rule now: **everything is drawn in the nutshell 2D style** (like the bánh mì / phở
builds and the characters) — space and depth come from a multiplane camera, not from 3D rendering. `world3d.js` stays in the
engine only for special set pieces; never use it for ordinary places.

## `# nw` — the street as a multiplane illustration (engine/library/nutworld.js)
Layers: sky (stars at night, soft clouds) · far skyline in fog colour · tube houses (soft gradients, rim light, shutters,
balconies, plants, AC units, awnings, Vietnamese signs, glowing windows at night) + trees + wires with lanterns ·
pavement and road with POIs (bánh mì cart, stool café, phở stall with steam, bia hơi corner, hotel lobby café) and live
scooter traffic · blurred foreground canopy (depth of field) · drifting motes.
Keys: `focus=cart|cafe|pho|biahoi|hotel` or `x=0..1`, `cam=truck|truckL|push|pull|tilt|rise|drift`, `zoom=1–2`,
`time=dawn|day|sunset|night`, `head=`, `tags="poi:TEXT:sub:at"`, `traffic=0`.

## Transitions that connect by meaning (engine/library/transitions2.js)
`trans=<name> tc=x,y (focus in outgoing frame) tc2=x,y (incoming) tcol=#hex tdur=s`
| name | what happens | use it when |
|---|---|---|
| `zoomthru` | camera dives into a point of A; B opens in a round portal there | street → the cart's food; window → interior; cup → café |
| `match` | A's focus slides/scales onto B's focus while dissolving | round bowl → round sun; coin → plate; same shape, new place |
| `liquid` | wavy fill (coffee/broth/beer) floods up, drains into B | anything poured |
| `burst` | A shatters into tiles from the focus, B settles | totals, reveals, "everything adds up" |
| `bloom` | the focus flares to warm light which becomes B | lanterns, sunrise, neon, night |
| `ripple` | a drop lands, rings carry B | steam/rain/drip moments |
| `blobs` `stripes2` | brand-colour shapes sweep | a turn in the story (save card, new act) |
| `spin` `slices` `cube` `drop` | energy changes, comparisons, gags | lists, versus, punchlines |
Plus the classic set (whip, iris, ink, push, paper…). Rules: every cut is either motivated by content (zoomthru, match,
liquid, bloom, ripple) or by rhythm (whip, slices, blobs); never two of the same in a row; the focus `tc` must sit on the
object the next scene is about.

## A film = rhythm of scales
wide street (truck) → push to a POI → zoomthru into a 2D detail build → liquid/match out to the next place → versus/receipt
data beat via slices/burst → night bloom → payoff. Every 2–4 s something lands (an ingredient, a price, a whoosh), every
beat has camera motion, nothing holds still.
