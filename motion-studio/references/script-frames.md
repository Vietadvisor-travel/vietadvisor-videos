# Script → frames: designing every second (v9, Oct 2026)

The user's bar: "every scene, every second, every frame must be wow and follow the content exactly". Write the film twice:
once as words (the voice), once as pictures (the frames). Neither is allowed to be generic.

## 1. Treatment block (top of the .story, as // lines) — mandatory
```
// ANGLE   one sentence: what the viewer will believe after 60 s that they didn't before
// SHAPE   hook → spine (the list / the journey / the build) → turn (twist, trap, myth) → payoff → save card → open loop
// COLOUR  palette per act, changing on the turns (dawn rose → day blue → night indigo + gold → twist cold teal)
// MOTION  the bridges: which object carries us into the next scene (zoom INTO the cart, coffee FLOODS, bowl MATCHES coin…)
// SOUND   where music drops before the biggest number, which liquids splash, where the register rings
// VIRAL   number in second 1, a counter the viewer competes with, one twist, one save card, an open loop to the next episode
```
## 2. One `// mm:ss` frame line above every beat
`// 0:15 ZOOM THROUGH the cart glass → the sandwich builds itself, one ingredient per word, lid snaps shut with crumbs.`
It states: **the bridge in** (how we arrive), **what moves** (≥ 2 things), **what lands on which word**, **the bridge out**.
If you can't write that line, the beat is a slide — redesign it.

## 3. Rules for the words
- First line contains the hook number or the question ("Seventeen dollars. A whole day in Vietnam.").
- One idea per caption line, 3–8 words; lists = one item per line (each item gets its own animation hit).
- Every line names something drawable. Abstract lines ("it's amazing") are cut or rewritten into a picture.
- A turn every 15–25 s in verticals ("Now the one nobody warns you about."), a re-hook every 60–90 s in YouTube cuts (a new number, question or twist — never a chapter card; the film is one continuous story).
- End on an open loop that names the next episode's promise.

## 4. Rules for the frames
- **Characters act every beat** (a hero with a want + locals with personality); information lives inside the scene. See acted-scenes.md.
- **Show the process, not the result**: build, pour, drip, count, print, stamp, clink, fall, bounce.
- **Something lands every 1–2 s**; nothing holds still > 1 s; camera always moves (push, drift, truck, tilt, rise).
- **Bridge every cut by meaning** (zoomthru, match, liquid, bloom, ripple, burst) or by rhythm (whip, slices, blobs, cube, drop) —
  never the same bridge twice in a row; tc= on the object the next scene is about.
- **Alternate scale**: wide place (nw) → close process (vis close/build) → data (receipt/vs/bars) → place again.
- **One look**: nutshell 2D everywhere; HEAD = headline only; captions fixed small at the bottom band.
- Close-ups available: coffee · ride · ticket · cheers · bed · hagiang · trainstreet · build banhmi/pho/buncha · hero · vs ·
  receipt · grid · bars · daycycle. A new subject gets its own close-up drawn in vis_close.js before it gets a generic icon.

## 5. Check
`node tools/sheet.mjs stories/x.story v 2` and `… h 2` → every frame: one subject, readable, nothing in the caption band, the
headline legible, the price on screen when spoken. Then render; pull 8 frames from the FINAL file at the transitions and look.
