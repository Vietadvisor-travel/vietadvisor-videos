# The director package: one file = the whole brain of an episode

Claude (the director, no web search, no execution) writes ONE file per episode: `EPISODE_<slug>.md`. Muse (production,
unlimited tokens) builds the film from it without inventing anything. The file has these 8 sections, in this order and
with these exact headings, because Muse's instructions parse them.

````markdown
# EPISODE <nn> · <slug> · <working title>

## 0. META
- slug: <lowercase-hyphen>          - length: <8–10 min ≈ 1,300–1,600 words>   - acts: a0 … a6
- archetype: <story-archetypes.md>   - format: 16:9 only
- look: <one of the 11 looks, chosen by the CONTENT: look.md table> (+ a second look for a flashback act, if any)
- tone: playful | dry   (playful by default: humor.md; dry only for tragedies)
- music: auto (moods follow the acts: music.md) · optional `score:` override · the 3 biggest reveals sit right after a [BEAT] (music drops out)
- thesis (≤ 25 words): "<X rose/fell because Y, which means Z>"
- master loop (the question the whole film answers): "<…>"
- best fact (held for the midpoint / ~6:00): "<…>" · second-best fact (the hook): "<…>"
- reveal ladder (least → most shocking, one rung every 60–90 s): 1) … 2) … 3) … 4) … 5) …
- callback plant (object/joke in act 1 paid off at the end): "<…>"
- scenes "in the room" (≥ 2, at turning points): a?: <time + room + people + detail> · a?: <…>
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
| F02 | comparison: "$1.75B = a 10-minute show every day for 4,000 years" | arithmetic | recompute from F01 + stated assumptions | a2-5 |
Every number, date, name spelling and quote the film states, with nothing missing.

## 2. ASSETS
| id | role | exactly what the image/clip must show | search hint | beats |
|---|---|---|---|---|
| katzenberg | cut | Jeffrey Katzenberg, waist-up, 2018–2020, neutral background | "Jeffrey Katzenberg 2019 portrait" Wikimedia | a1-3, a1-7 |
| quibi_letter | screenshot | Medium post "A Letter from Jeffrey & Meg", Oct 21 2020, top paragraph | medium.com/@quibi | a4-5 |
Roles for real images: cut (person/object cut-out) · plate (background photo) · prop (document/object print) · screenshot (for
browser/post/phone3d) · clip (footage, give start time).
Roles for GENERATED images (ai-images.md; only where no real image can do the job, ≤ 1 per 4 beats, never a real person,
document, logo or event): clean (a real photo with the subject removed) · env (environment) · prop (generic object) ·
texture · fg (foreground element). For those, fill the column "exactly what it must show" AND add `gen: "<subject prompt>"`.
Ids are lowercase_underscores and must match the storyboard.

## 3. SCRIPT: an A/V script (script-masterclass.md §6), one sentence per line
- `**hit word**` (one per sentence): where the picture or the hit lands.
- `[BEAT]`: a held pause (the voice really pauses) before a punchline or reveal.
- `(J)`: an intended laugh. Aim for 15–25 per 10 min in playful tone.
- `[SFX: …]` / `[TEXT: …]`: notes for the storyboard. They are not spoken.
## a0 COLD act=fall
<sentence with one **hit word**> [BEAT] <punchline> (J)
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
look: <look>
tone: playful
voice: am_michael
music: auto
endcard: off
# cine …
<the VO sentence>
```
### stories/<slug>-a1.story
…(one block per act; only the last act omits `endcard: off`)

## 6. INSTRUCTIONS FOR MUSE
(copy the standard block from director-package.md §2; add any episode-specific notes below it)

## 7. DIRECTOR'S SELF-CHECK
- beats: <n> · scene types: <n> (list) · families: set <n> / mode <n> / fast <n> / 3d <n> (≤ 20 %) / map <n> / collage <n> (<%>)
- look chosen because: <one line> · laughs marked (J): <n> (15–25 per 10 min) · no cartoon characters ✓
- pp_scriptlint-style self-score: hook + promise ≤ 30 s ✓ · something new every 20–40 s ✓ · re-hooks ≈ 3:00 and 6:00 ✓ · midpoint twist ✓
  · ≥ 2 scenes ✓ · final line ≤ 15 words ✓ · no filler / hype words ✓ · every sentence has a **hit word** and a picture ✓
- build compositions ≥ 25 % of beats, each different ✓ · nothing reused from the last 3 episodes' opening/look/signature scenes ✓
- living pictures (`scene`) ≥ 20 % of beats ✓ · real-3D ≤ 10 % ✓ · generated images ≤ 1 per 4 beats, all allowed roles ✓
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
   - real-3D shots only at signature moments (the cold open, an act turn, the climax), **≤ 10 % of beats**: overused
     they read as a different film, and they render slowly.
   - **living pictures** (`scene`: sharp real photo, the subject lifted onto its own plane, atmosphere and light) replace
     plain collage for people, places and moments, on ≥ 20 % of beats (motion.md, visual-modes.md). Everywhere else, use the FAST modes (`isocity`, `isobars`,
     `coverflow`, `spinpaper`, `units`, `tank`, `race`, `rollnum`, `faceoff`, `invoice`, `candles`, `vault`, `slots`,
     `outbreak`, `meter`, `calendar`, `papercut`, `flapboard`).
4. **Invent the pictures** (`build.md`).
   - At least 25 % of beats are `build` compositions made from their own sentence. No two beats share a composition.
   - Templates (sets, modes, 3D) are used only when they fit exactly.
   - Read the `pp_history show` output Muse pasted into the request. Do not reuse the last 3 episodes' opening, look or
     signature template scenes.
5. **Pick the look from the content** (`look.md`). Write it in META and in every act header.
5. **Write the script like script-masterclass.md:** thesis first, a hook in 30 s, a reveal ladder, scenes in the room,
   but/therefore, specific numbers made physical, the punch word last, a final line ≤ 15 words.
6. **Tone playful** (`humor.md`): mark intended laughs `(J)` in §3, and use the photo-based comedy tools (`freeze`,
   `expect`, `cutaway`, `dramatic`, `math`, `meme`, `aside`) within their caps. **Never cartoon characters or mascots.**
7. **Length:** 8–10 min is about 110–150 beats. The file is long, so write it as a downloadable file if your interface
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
MUSIC: keep the library at ≥ 3 tracks per mood (music.md; safe sources only, licence kept); paste pp_music.py credits into
the description.
GENERATED IMAGES: only the §2 rows with role clean/env/prop/texture/fg and a gen: prompt. Prompt = the look's prefix from
ai-images.md §3 + the gen: text + the suffix. Import with pp_img.py add … --gen "<tool>". Never generate anything else.
STEPS: 1) pp_doctor ALL PASS  2) verify §1 → research/<slug>_factcheck.md (✓/✗ + source)  3) import §2 → pp_assets.py report
0 problems (no PHOTO NEEDED anywhere)  4) save §5 blocks to stories/  5) pp_lint every act: 0 errors, ≥ 9.0 (syntax fixes
only)  6) pp_sheet + pp_review every act; a SEPARATE fresh critic agent compares the sheets with §4 and lists beats whose
picture doesn't match its IDEA; fix only execution (assets, framing, timing), re-sheet  7) make.mjs per act (16:9) with --jobs <CPU cores>; add --lite on a 2-core machine; if anything
crashes or the machine reboots, run the SAME command again with --resume (finished chunks are kept); watch
out/<act>_16x9_v.chunks/progress.json (if 'updated' is older than 15 min, the job is stuck: restart it with --resume) → join →
−14 LUFS → 15 stills checked  8) thumbnail per §0, titles, description with sources and credits.
BEFORE RENDERING: node tools/pp_speed.mjs stories/<act>.story → any beat marked SLOW: report it, don't redesign it.
REPORT: pp_doctor output · factcheck table (with every change) · pp_lint score per act · all pp_sheet JPGs · critic notes
and fixes · final MP4 + 10 stills.
```
