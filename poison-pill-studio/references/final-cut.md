# FINAL CUT v6.2: footage leads, a clean frame, a concept you have never seen

**v6.2 overrides the shares and rules below wherever they disagree.** Owner feedback on ep. 4 (OneCoin): elements sat
in odd places and sometimes collided, burned-in captions were not wanted, and the film did not feel "wow". It felt
sparse and not polished enough. The most important quality is creativity. Muse now sources a lot of stock video, and
an episode may use more footage than stills.

## A. The mix (replaces the §1 table)
| Kind | Share of beats | Notes |
|---|---|---|
| **Moving footage leads**: archival or stock clips are the main picture | **≥ 45 %** | clips stream from disk (v6.2), so 60–150 clips per episode is fine; 2–8 s each. Two sources: the episode's clips pack (the named people, places and events) and the shared library `stock_*` (`pp_stock.py find` / `pull`; generic action, mood, texture) |
| Real stills brought alive (scene, parallax, rack focus) | 15–30 % | people, documents, places without footage |
| AI moment art | ≤ 20 % | only for moments with no footage and no photo |
| Custom code scenes | 8–14 beats | built ON footage or photos: masks, split screens, screen inserts, data drawn onto the real picture |
| Drawn-only graphics (maps, diagrams, flapboards…) | ≤ 8 % | only when a mechanism needs a diagram |
| Text-only frames | **0**, except one deliberate black-card punch per film | a sentence never "becomes" a word on a dark plate |

## B. The clean frame (every beat; gate: `node tools/pp_layout.mjs` = 0 flags on every act)
1. **No burned-in captions.** Every act header has `captions: off`; YouTube gets `<slug>_FULL.srt` (`publish.md`).
2. **Safe area:**
   - all type and every key subject stays inside a 5 % margin;
   - nothing sits in the bottom 12 % (player controls and YouTube captions);
   - no type closer than 3 % to another type block.
3. **One type system:**
   - **hero:** 110–170 px, at most 4 words;
   - **headline:** 64–90 px;
   - **label:** ≥ 40 px.

   Nothing smaller except credits. Never the `tag:` element (it is too small at 1080p); use `txt:`. One accent colour.
4. **One focal point per frame.** Type goes in the empty third opposite the subject, never on faces, products or
   documents being read.
5. **The camera never pushes type off frame.** On beats with type, the end zoom is ≤ 1.12. Bigger moves happen only
   on pictures with no type on them.
6. **Everything lands early:**
   - counters reach their final value, and type-ons finish, by 50 % of the beat;
   - the last 30 % of a beat holds a finished, readable frame;
   - a viewer pausing on any frame sees the final number, never "$3.91B" for "$4 billion".
7. **Plates and clips are used once.** A second use is allowed only for a declared motif (written in META).
8. **No white boxes:** documents and receipts sit on the look's paper colour, or as real prints in the scene, with a shadow.
9. `pp_layout.mjs` hooks every text draw on the real frame and reports EDGE (outside the safe area) and OVERLAP (two
   type blocks colliding). Fix every flag: move the type, shrink it, or reduce the camera's end zoom. Rendering with a
   flag is not allowed.

## C. Creativity is the first gate, not the last
1. **One visual concept per episode,** written in META before any beat:
   - a world or device that carries the whole film and that no other channel would use for this story;
   - examples: "the film is a forensic audit of one email", "every act is a floor of the same empty hotel", "the
     money is always shown as one physical object that changes state".
   - The motif (final-cut §4) lives inside this concept.
2. **Three ideas per key beat.** For the hook, every act turn, the 3 reveals and the ending, write 3 picture ideas in the
   beat table and pick the one an informed viewer would least expect but understand in 2 seconds. Keep the losing two
   in the package, so the critic can see the choice.
3. **Each act has one hero sequence of 8–20 s,** designed as a mini film across 3–6 beats:
   - footage, match cuts, a custom scene over the footage, and a sound hit, with one camera language;
   - examples: the money's route as real streets seen from a plane window, with the sums burned onto the glass; the
     price typed into the database while real trading-floor footage freezes.
4. **Footage is composed, not pasted.** Use clips as layers:
   - masked into a phone or a window;
   - split screens that answer each other;
   - a clip playing inside a document's photo;
   - match cuts on shape (a coin → a spotlight → a camera lens);
   - speed ramps on the hit word;
   - rack focus from footage to a document.
5. **Montage runs carry the energy:** at least 3 per episode, of 4–8 clips at 0.8–1.5 s each, cut on the music's beat.
6. **The critic scores "never seen before" explicitly.** A beat that any channel would make for this sentence is
   swap-FAIL, even when it is clean.

## D. Quality bar before render (in this order)
1. Package META has the visual concept, the 3-ideas rows and the hero sequences.
2. `pp_scriptlint` ≥ 8.5 · `pp_lint` ≥ 9.0, 0 errors · **`pp_layout` 0 flags** · `pp_sheet` looked at.
3. Critic round on sheets → fixes → **`--lite` render of every act** → critic round on real frames (1 frame per beat at
   75 %) → fixes → final render. Ship at ≥ 85 % of beats ≥ 5/8 and ≥ 90 % swap PASS. If 3 rounds don't reach it,
   say so plainly in the delivery report with the scores.

---

# FINAL CUT (v6.1): the anti-mechanical method

What makes a film feel "made by a machine" is rarely one big flaw. It is the sum of four repetitions:
- **the same device** again and again (photo + slammed word + stamp);
- **the same rhythm**: every beat about 4 s, every move a slow push;
- **the same entrance**: everything pops in with the same ease;
- **pictures that could belong to any sentence.**

Mid-tier documentary channels and Remotion-built channels avoid all four. This file sets the bar Claude Code meets on
every episode. `pp_lint` checks the measurable parts.

## 1. The visual mix of one episode: PICTURES LEAD (the owner's rule)
Owner's rule: real images first, AI illustration where it makes the story more visual, and **not too much drawn 2D or
3D graphics**, because too much of it gets boring.

| Kind | Share of beats | Notes |
|---|---|---|
| **Picture-led beats**: a real photo, a real clip or AI moment art is the main picture | **≥ 75 %** | lint: "real or AI images" |
| … real photos and real clips | ≥ 45 % | people, places, products, documents, headlines, footage |
| … AI moment art brought alive (`scene`: plate + lifted elements + air + camera) | 20–35 % | illustrates moments no photo exists for |
| **Real b-roll clips** (2–4 s) | 8–15 % | montage runs, act openers |
| **Custom code scenes** | 6–12 beats | **built ON images**: photos and art as layers, with type, numbers and motion on top. Never a drawing alone. |
| **Drawn-only graphics** (icons, diagrams, templates without a photo) | **≤ 15 %** | only when a mechanism or number needs a diagram |
| Real-3D | ≤ 3 % (0–2 shots) | only for one signature moment, or none |

Practical rules:
- `build` compositions start from a real or AI image (`@<id>` as the main element), with icons only as small accents.
- No template appears more than twice. Prefer `scene` and custom scenes over templates.
- Every number that matters is a custom scene over a picture: the pile of money on the real factory floor, the queue on
  the real street.

## 2. Design every beat before writing the stories: the BEAT TABLE
Fill this table in the director package (§4 VISUAL SCRIPT) for every sentence:

| # | sentence (short) | the viewer must GET | picture idea (one concrete line, never "show X") | device | source ids | shot / move | rhythm | in |
|---|---|---|---|---|---|---|---|---|

**The rules of the table:**
1. **The swap test.** Could this picture illustrate another sentence of this film, or of another film? If yes, it is
   wallpaper. Redesign it until it only fits this sentence.
2. **Neighbours differ.** Each beat differs from the previous one in at least **2 of 5** things: device, shot size,
   camera direction, dominant colour, and the screen side where the subject sits.
3. **One "never seen" idea per act, made from pictures.** Each act has one picture this channel has never shown (check `pp_history show`),
   written as a custom scene.
4. **Numbers are never just text.** Every important number becomes a physical comparison, written as a custom scene:
   a pile, a queue, a city of stacks, a clock, a map that fills.
5. **People are real.** A real person is a real photo or a clip. AI art shows places, objects, crowds from behind,
   hands, silhouettes and metaphors.

## 2b. Stay on the content: the picture IS the sentence
A viewer should be able to mute the voice and still follow the story. For every beat:
1. **Show exactly who, what, where and when the sentence names.** "In 2007, Nokia's boardroom in Espoo…" means the real
   Espoo HQ photo, a "2007" date card and the boardroom art. It never means a generic office.
2. **The change happens on its word.** If the sentence says "doubled", something doubles on "doubled". If it says
   "collapsed", the picture collapses on "collapsed". Every beat has at least one event locked to a spoken word.
3. **Claims carry evidence.** A claim about money, a lawsuit or a quote shows the real document, headline or post (a
   screenshot from the pack), marked: highlighted, circled or zoomed onto the line.
4. **Numbers become physical comparisons.** "$4 billion" alone is noise; "$4 billion, more than the GDP of Fiji"
   shows the two piles side by side.
5. **Cause and effect read left to right**, before and after read top to bottom, and the camera leads the eye in that
   order.
6. **One idea per frame.** If the sentence has two ideas, it is two beats.
7. **The research decides the pictures.** Every key moment in the RESEARCH file (the 3 decisions, the mechanism, the
   counterfactual) gets its own designed picture, never a recycled one.

## 3. Rhythm: edit like a person
- **Vary beat length:** 1.5–2 s punches, 3–5 s statements, 6–8 s breaths. Variation ≥ 35 % (lint). Never 5 equal
  beats in a row.
- **Montage runs:** 3–6 beats of 1–1.5 s each (clips, photos, headlines) when the story accelerates (the boom, the
  spread, the panic). Write them as separate short captions or `[BEAT]`-free lists.
- **Breaths:** after each big reveal, a 2–3 s hold on a quiet picture, with the music up and no text.
- **Silence:** the `[BEAT]` before each of the 3 biggest reveals. The voice and the music both stop.
- **Act turns:** a change of look in light (act colour), music mood and camera grammar (handheld → locked-off, or the
  reverse).

## 4. Motion polish: the Remotion standard (custom scenes)
- **Nothing appears linearly.** Use `spring(word)` for physical entries with a little overshoot, `stagger(i, n, word)`
  for cascades, and `p(word, dur, 'out5')` for clean eases.
- **Hold the final state ≥ 0.5 s** before the cut, so the eye can read it.
- **Fast moves get a trail:** `mblur(3, .03, dt => …)`. Idle things breathe: `wobble(seed, amp)`.
- **Type moves with meaning:** counting numbers, words that land on their spoken word, labels that draw their leader
  line. Never more than 8 words on screen besides the caption.
- **Depth always:** background plate (blurred), subject, foreground element, air (dust, haze, light), each layer at its
  own depth (`layer(d, …)`).
- **One motif per episode:** a recurring visual object that changes state across the acts (a coin that gets
  heavier, a red line that grows, a building whose windows go dark). It ties the custom scenes together.

## 5. AI moment art: how to use it well
Muse delivers 25–40 illustrations of the episode's key moments (16:9, one style bible per look), plus separate element
cut-outs.
- **Bring each one alive:**
  `fx="scene:x;plate:<slug>_art_<moment>;subj:<slug>_el_<object>@x,y,h;air:dust,rays;light:sweep@<word>"`
  plus `shot=` for a camera move through the planes.
- **Build over the art:** `build` elements and type, or a custom scene with `img('<slug>_art_…')` as the background
  layer and real cut-outs on top. This is the strongest look: real people on AI-built worlds.
- **Never two art beats in a row with the same camera move.** Alternate push, pan, rise and rack-focus.
- **Disclosure:** AI images are listed in the credits automatically. Tick YouTube's synthetic-content box if any is
  photorealistic.

## 6. The critic watches the film, not the plan
1. After the sheets pass, render each act as a draft (`make.mjs … --lite`).
2. Extract one frame per beat at its hit word into a contact sheet:
   `node tools/pp_sheet.mjs stories/<act>.story` (storyboard timing), or ffmpeg on the draft.
3. A **fresh agent** (never the builder) opens the images and scores each beat with the WOW gate (gauntlet.md)
   **plus the swap test**. Every beat that is swappable, or scores ≤ 3/8, is redesigned. At most 3 rounds.
4. It also listens to 3 voice lines (one rise, one fall, one reveal) and reports any line that sounds flat.

## 7. The finished film must pass
- The first 5 seconds show something no other channel would show for this story.
- Every act has its "never seen" picture, and the motif is visible in every act.
- No template appears more than twice, and invented beats are ≥ 60 %.
- Rhythm variation is ≥ 35 %, with at least 2 montage runs and at least 3 breaths.
- The critic's swap test passes for ≥ 90 % of beats.
