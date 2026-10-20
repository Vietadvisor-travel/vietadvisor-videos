# The director package: one file = the whole brain of an episode

Claude (the director, no web search, no execution) writes ONE file per episode: `EPISODE_<slug>.md`. Muse (production,
unlimited tokens) builds the film from it without inventing anything. The file has these 8 sections, in this order and
with these exact headings, because Muse's instructions parse them.

````markdown
# EPISODE <nn> · <slug> · <working title>

## 0. META
- slug: <lowercase-hyphen>          - length: <8–10 min ≈ 1,300–1,600 words>   - acts: a0 … a6
- archetype: <story-archetypes.md>   - look: dossier                            - format: 16:9 only
- thesis: "<one surprising, arguable, provable sentence>"
- open loop (planted ≤ 0:45): "<line>" → paid off at <act/beat>: "<line>"
- midpoint twist (≈ 50 %): "<the fact that reframes everything>"
- signature shots: a0 <mode> · a2 <mode> · a3 <mode> · a4 <mode> · a6 <mode>
- titles: 1) … 2) … 3) …          - thumbnail brief: <face id + number + red word, ≤ 3 elements>
- pinned comment: "<the open question>"
- SEO: primary keyword · 3 secondary · 15 tags · description lines 1–2 (keyword + hook) · chapter titles

## 1. FACTS TO VERIFY
| id | claim exactly as used | value in the script | where to verify (suggested sources) | beats |
|---|---|---|---|---|
| F01 | Quibi raised before launch | $1.75 billion | WSJ/Variety Mar 2020, Wikipedia refs | a0-1, a2-4 |
Every number, date, name spelling and quote the film states, with nothing missing.

## 2. ASSETS
| id | role | exactly what the image/clip must show | search hint | beats |
|---|---|---|---|---|
| katzenberg | cut | Jeffrey Katzenberg, waist-up, 2018–2020, neutral background | "Jeffrey Katzenberg 2019 portrait" Wikimedia | a1-3, a1-7 |
| quibi_letter | screenshot | Medium post "A Letter from Jeffrey & Meg", Oct 21 2020, top paragraph | medium.com/@quibi | a4-5 |
Roles: cut (person/object cut-out) · plate (background photo) · prop (document/object print) · screenshot (for browser/post/
phone3d) · clip (footage, give start time). Ids are lowercase_underscores and must match the storyboard.

## 3. SCRIPT (VO, verbatim, one sentence per line)
## a0 COLD act=fall
<sentence>
…
## a1 ORIGIN act=setup
…

## 4. VISUAL SCRIPT
| # | act | VO | MEANING | IDEA (what we see) | MODE | CAMERA | ON WORD | BRIDGE → next |
|---|---|---|---|---|---|---|---|---|

## 5. STORYBOARD
### stories/<slug>-a0.story
```story
title: <slug> a0
channel: poisonpill
voice: am_michael
music: none
endcard: off
# cine …
<the VO sentence>
```
### stories/<slug>-a1.story
…(one block per act; only the last act omits `endcard: off`)

## 6. INSTRUCTIONS FOR MUSE
(copy the standard block from director-package.md §2; add any episode-specific notes below it)

## 7. DIRECTOR'S SELF-CHECK
- beats: <n> · scene types: <n> (list) · families: set <n> / mode <n> / 3d <n> / map <n> / collage <n> (<%>)
- no mode 3× in a row ✓ · every beat ≥ 3 s has shot= or a *3d mode ✓ · every at:/@word exists in its sentence ✓
- every asset id in §5 is listed in §2 ✓ · every number in §3 is listed in §1 ✓
````

## 1. Rules for the director (Claude)
1. **No web search, and no claims to have verified anything.**
   - Write from knowledge.
   - Everything checkable goes into §1. If you're unsure, still write the most likely value, put it in §1, and mark it
     `(unsure)`.
2. **Write the storyboard in exact engine syntax:** `cine-beat.md`, `visual-modes.md`, `camera.md`. Muse is not allowed
   to redesign it.
   - Every `at:`, `@word`, `fall:`, `go:` and similar key must be a word that occurs in that beat's own sentence.
   - Inside a mode, list items use `~`. `|` only separates events.
3. **The variety budget is mandatory** (`visual-modes.md` §0):
   - ≥ 8 scene types from ≥ 3 families;
   - collage ≤ 35 %;
   - no mode 3× in a row;
   - signature 3D shots at the cold open and at the act turns.
4. **Length:** 8–10 min is about 110–150 beats. The file is long, so write it as a downloadable file if your interface
   can. If a single reply would be cut off, split it into `PART 1/3`, `PART 2/3`… at section or act boundaries. Each part
   ends with `— CONTINUES IN PART k —`. Muse joins the parts.

## 2. Standard instructions for Muse (paste into §6 of every package)
```
You are the production team. This file is the director's final decision. Build the film exactly from it.
ALLOWED: research and verify §1; find/import §2 assets (exact ids); fix pure syntax errors reported by pp_lint WITHOUT
changing what a beat shows; replace a number/date/name in BOTH §3 and §5 if §1 verification proves it wrong (log it);
replace an unobtainable asset with the closest real equivalent (log it).
FORBIDDEN: rewriting sentences, changing modes/cameras/order, adding or removing beats, AI images of real people/documents,
approving your own work.
STEPS: 1) pp_doctor ALL PASS  2) verify §1 → research/<slug>_factcheck.md (✓/✗ + source)  3) import §2 → pp_assets.py report
0 problems (no PHOTO NEEDED anywhere)  4) save §5 blocks to stories/  5) pp_lint every act: 0 errors, ≥ 9.0 (syntax fixes
only)  6) pp_sheet + pp_review every act; a SEPARATE fresh critic agent compares the sheets with §4 and lists beats whose
picture doesn't match its IDEA; fix only execution (assets, framing, timing), re-sheet  7) make.mjs per act (16:9) → join →
−14 LUFS → 15 stills checked  8) thumbnail per §0, titles, description with sources and credits.
REPORT: pp_doctor output · factcheck table (with every change) · pp_lint score per act · all pp_sheet JPGs · critic notes
and fixes · final MP4 + 10 stills.
```
