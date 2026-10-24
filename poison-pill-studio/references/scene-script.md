# THE SCENE SCRIPT: write every second, then build the effect it needs (v6.3)

**The owner's rule (Oct 2026):**
- Creativity does not come from quotas ("use X at least N times, Y at most M").
- It comes from writing, second by second, what the viewer SEES at each moment of the content.
- Then build exactly that effect, so the picture follows the content.
- Then save the effect, so the channel can make something similar again.

This file replaces every share and cap in `final-cut.md` §A and §C. Only safety rules stay hard: facts, licences,
layout (`pp_layout`), no burned-in captions, no real person drawn by AI.

**What went wrong on ep. 4 (OneCoin), so it never happens again:**
- Beats were planned as "which device goes on this sentence" (a tag, a stamp, a hero word, a template).
- The film became text that slid and shook, a few repeated effects and some flat 2D drawings.
- Nobody had written down what the viewer actually sees, second by second.

---

## 1. Before any second: three films, then one (the world, the device, the form)
Write **three storylines** for the episode. They are three different films, not three titles:
- **World:** where the film lives and what it looks like, taken from the subject, e.g. "inside the database that
  pretended to be a blockchain", "a forensic audit of one email", "the airport departures hall of a fugitive".
- **Device:** what carries the story, e.g. one object that changes state, one document re-read in every act, one
  number made physical again and again, one route on one map.
- **Form:** how the camera and the cuts carry it, e.g. one continuous dive, object-to-object chain, endless zoom into
  a detail that becomes the next world, split screen collapsing into one, match cuts on one shape.

For each storyline write:
- the first 2 seconds, exactly;
- the beats in one line;
- the look and the sound in one line each.

Pick the one a stranger would follow and remember. Write all three into the package (`META → storylines`): the losing
two show the choice, and a later episode can use them.

## 2. The SCENE CARD: one per sentence, written before any code
For every sentence of the voice-over, write a card. This is the per-second script. It is the most important text in
the package: if it is thin, the film will be thin.

```
### a2-07 · "Fifty euro cents at launch. Twenty-nine ninety-five by 2019." (≈ 4.2 s)
MEANS      the price was set by hand by the company, not by any market
SEE        the viewer must see a human typing a price, and a line that only ever climbs in steps, never wiggles
WORLD      inside the database (the episode's world): dark office, one monitor (art_database_room)
SECONDS
  0.0  continuing the previous push (seam: Z forward), we are already flying into the monitor glass
  0.4  the glass fills the frame; a spreadsheet cell "PRICE (EUR)" sits centre-left, cursor blinking
  0.9  on "Fifty": a gloved finger of light types 0.50 — each keystroke clicks; the cell commits with a soft flash
  1.6  the camera pulls back left→right along a timeline; each year a new row is typed: 1.20 · 4.85 · 9.10 …
       (the steps are illustrative and labelled as such; only 0.50 and 29.95 are facts)
  3.0  on "twenty-nine ninety-five": the last cell is typed, the steps behind it connect into a gold staircase line
  3.6  stillness 0.4 s: the line holds, the cursor blinks once, and a real market chart (Bitcoin 2014–2019) ghosts in
       behind it for contrast: jagged vs perfectly stepped
  4.2  exit: the camera keeps travelling right (the film's current) → cut mid-motion into the next scene
LAYERS     bg: database art (blur 6) · mid: spreadsheet surface · fg: monitor bezel edge passing camera · air: none
CAMERA     push in 0→0.4 (expo.out), then truck right 1.6→4.2 (power2.inOut), no creeping zoom after it lands
MOTION     route = sequenced UI life (the UI does what the voice says); no idle wobble
SEAM       in: Z-forward continuing a2-06 · out: X-right (the current) carrying the gold line into a2-08
SOUND      keyboard clicks on each typed value, one low hit on 29.95, room tone; music ducks in the 0.4 s stillness
TEXT       only the typed values and one small "STEPS ILLUSTRATIVE" note; no headline, no caption
EFFECT     NEW: typed_value_timeline (params: values, years, start/end word, plate, compare_chart) → save to library
```

A card is done when:
- **MEANS** is one sentence a stranger understands.
- **SEE** names something you could photograph or film. Not "show the scam"; "a finger typing a price".
- **SECONDS** has a timed line for every change, and each change is caused by a spoken word or by the previous motion.
  Nothing appears "because a beat needs an event".
- **SEAM** says how the motion leaves and how the next scene receives it (`motion-doctrine.md` §1). The film is one
  continuous camera, not a stack of slides.
- **TEXT** is the minimum. If the picture can say it, the text goes. Type is never the picture.
- **EFFECT** says one of:
  - `REUSE @name (params)`, found with `node tools/pp_fx.mjs list <words>`;
  - `ADAPT @name → new_name (what changes)`;
  - `NEW name (params)`, which gets built and saved.

**The test:** read only the SECONDS lines, without the voice. Do they tell the story? Would a viewer screenshot one of
those frames? If not, rewrite the card. Never patch it with a stamp or a shake.

## 3. Where the pictures come from (in this order, every card)
1. **Real footage of the thing named:** the episode's clips pack (archival, press, the real place).
2. **The shared stock library** for action, mood and texture (`pp_stock.py find`). Footage is a material:
   - mask it into a window, a phone, a passport photo or a document;
   - split it across the frame;
   - speed-ramp it on the word;
   - freeze it on the beat;
   - match-cut its shapes.
3. **Real photos brought into depth:** subject lifted, background rebuilt, camera moving through the planes (`scene`).
4. **AI moment art** only for moments with no footage and no photo: places, objects, silhouettes, never a real face.
5. **Drawn graphics** only when a mechanism needs a diagram, and then drawn ON a real picture.

## 3b. The shot list: ask for the exact picture (v6.6)
Real footage and photos are the picture (motion-doctrine §0), so the film is only as precise as its sources. After the
cards, write `jobs/<slug>/SHOTLIST_<slug>.md`:

| # | card | sentence (short) | the literal picture | kind | have (catalogue id) | status |
|---|---|---|---|---|---|---|
| 1 | a2-18 | "the only exchange kept going offline" | the real xcoinx exchange page, archive.org, a sell order stuck "pending" | screenshot | – | NEED |
| 2 | a4-12 | "her brother landed at LAX" | LAX arrivals hall or apron, 2019-ish, wide | footage | onecoin_lax (photo) | HAVE (photo; footage better) |

- "Literal" means: with the sound off, the picture says what the sentence says. Generic stock under a caption fails.
- Prefer, in order: footage of the thing itself → a photo of it → its document or web page → specific stock of the
  action → an AI part composited on a real picture.
- More than 15 % NEED → the owner sends Muse `bổ sung shotlist <slug>` (round 2, MUSE_STANDING §2b) before the build.

## 4. Build the effect, then save it
- **Write the effect as a custom scene** (`custom-scenes.md`) from its card:
  - every timed line of SECONDS becomes a timed event on its word (`at()`, `spring()`, `stagger()`);
  - every layer becomes a `layer(depth, …)`;
  - footage comes in through `clip()`.
- **Make it reusable as you write it:**
  - the content goes in `params`: words, values, image ids, colours of meaning;
  - the motion goes in the code.
  - A function that has "Greenwood" or "€29.95" inside it is a one-off; one that takes `rows:` and `keys:` is a tool.
- **Check it** with `pp_sheet` (the beat) and `pp_layout` (0 flags) before moving on.
- **Save it:**
  `node tools/pp_fx.mjs save stories/<slug>-aN.story <scene> --as <name> --does "<what the viewer sees>" --tags … --born "<slug aN-bM: sentence>"`.
  The library keeps the code, the parameters, a preview strip and where it was born. `effects/CATALOG.md` is the
  channel's growing vocabulary.
- **Before inventing, look:** `node tools/pp_fx.mjs list <words from MEANS>`. Reuse is right when the moment truly has
  the same shape (a ratio, an escape, a document that lies). Adapt when it almost fits. The library is a memory, not a
  menu: a new film still needs at least one effect per act that did not exist before it.

## 4b. The craft tools a card can ask for (v6.5 FX kit, `custom-scenes.md`)
- Perspective and 3D cards: footage on a tilted screen, a document turning over, words printed on a wall.
- Thickness and solids: photos become objects with depth.
- Gravity, stacking and shattering.
- Paper tears, fire burns, ink spreads.
- Speed blur and RGB hits.
- Real 3D shots (`desk3d`, `globe3d`, `city3d`, `money3d`…) for the one or two moments a film needs a true 3D world.

Write the card first, then reach for the tool. A tool is never the idea.

## 5. The seams: one camera through the whole film (from `motion-doctrine.md`)
- Choose the film's current (default: left to right) and the reserved moves with their meanings:
  - up: a reveal;
  - Z forward: deeper into the same thought;
  - Z back: arrival;
  - burst: leaving a world.
- Every cut is cut mid-motion with matching direction and speed on both sides, or it is a deliberate hard cut on a
  hit word. Never fade, never "settle, then cut".
- Carry an object across the cut whenever you can: the gold line becomes the runway light; the coin becomes the
  spotlight; the email's highlighter becomes the courtroom bar.

Every act header carries `autotrans: off`. The cards own every seam; the engine's automatic stylised transitions
(tear, burn, whip every 5 beats) would cut across them.

## 6. What a weak card looks like (rewrite it)
| Weak card says | Why it fails | A strong card says instead |
|---|---|---|
| "hero text: $4 BILLION, stamp, shake" | type and punctuation are not a picture | "a vault door swings open on 'billion'; the camera falls into 4,000 real stacks of notes that keep going past the frame edge" |
| "AI art of a courtroom + lower third" | wallpaper: it fits any trial in any film | "the real SDNY steps, footage; a jury-room clock (stock) spins 4 hours in 1.5 s; the doors open on 'hours'" |
| "map Sofia → Athens" | a diagram with no one in it | "a boarding-pass barcode fills the frame, its bars become the runway lights of the takeoff footage, which pulls back into the map line ending at Athens" |
| "chat UI with the messages" | screens of text read as slides | "the message bubble appears on a phone held in a hand (stock), the camera racks focus from the phone to a crowd of investors at an event (footage) on 'idiots'" |

## 7. Tells of a generated film (never, from HyperFrames' list and our ep. 4)
- a dark void with small things floating in it;
- glow, bokeh and dust particles as decoration;
- cream paper + serif + small mono labels as the house look;
- everything fading and sliding up;
- every beat entering the same way;
- titles that keep breathing, bobbing or creeping after they land;
- a slow push late in every shot;
- stamps and shakes as punctuation;
- floating cards and three panels standing in for a scene;
- the same picture behind several sentences.

The engine no longer breathes things by default (`idle: off`).

## 8. The package
`EPISODE_<slug>.md` §4 is now **the SCENE CARDS** (one per sentence, the format in §2), followed by the effects ledger:
| effect | NEW / REUSE / ADAPT | cards | saved as |
|---|---|---|---|

The storyboard (§5) is written FROM the cards. If a card cannot be built, change the card first, then the code.
