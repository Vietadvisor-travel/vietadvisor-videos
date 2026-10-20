# Quality rubric — the 10-point gate

Two halves. **Automatic** (`pp_lint` DIRECTOR SCORE, per act and for the joined story) must be ≥ 9.0 before anyone watches.
**Human** (below) is scored by the Showrunner/QA critic on the draft and the FINAL; ship only at ≥ 9/10 with no category below 0.7.

## Human rubric (each 0–1, write the score + one line of evidence)
| # | Category | 1.0 looks like | 0.6 looks like (a "6/10" film) |
|---|---|---|---|
| 1 | **Thesis & story** | one surprising truth, every act turns it, the last line lands it; open loop paid | a chronological summary of events |
| 2 | **Research** | specific dated numbers, verbatim quotes, primary documents on screen, 0 errors | round numbers, Wikipedia-level, a quote paraphrased |
| 3 | **Hook (0–30 s)** | the end first, a number burns, case-file sting by 0:20, a question we must answer | "In this video we'll look at…" |
| 4a | **Ideas, not collage (v4)** | every sentence's picture explains it: set pieces, screen modes, 3D shots, maps; ≥ 8 different scene types from ≥ 3 families; collage ≤ 35 % | photo + slammed word + stamp + shake, again and again |
| 4b | **Camera (v4)** | every shot has a size, an angle and a move with a reason; scale changes across cuts; bridges by meaning | the same slow push everywhere, or random shakes |
| 4 | **Real-image richness** | real faces, places, documents, headlines, footage, maps — different every few beats | the same 3 photos recycled, or props/type carrying the film |
| 5 | **Composition & depth** | thumbnail-worthy frames: 3 planes, thirds, negative space, colour per act | centred subjects, flat frames, busy collages |
| 6 | **Motion & rhythm** | something lands on every stressed word; bursts and silences; never two similar shots in a row | a picture per paragraph, zooms only |
| 7 | **Typography** | ≤ 8 words, hero slams in negative space, numbers count, thesis builds on black | captions doing the work, text over faces |
| 8 | **Sound** | each event has its hit, risers into peaks, silence before the biggest one, clean VO | no SFX or random ones; music bed |
| 9 | **Craft & finish** | no missing images, no overlaps, no cropped faces, clean act-to-act cuts, correct loudness | placeholder cards, jumps, clipping |
| 10 | **Packaging** | title + thumbnail promise exactly what the film delivers; credits & sources complete | vague title, unreadable thumbnail |

## From 6 to 10 — the usual fixes
- 6 → 7: replace every prop-only beat with a real image; add a document beat (`mark` + `lens`) per act.
- 7 → 8: rewrite the shot list so EVERY sentence names its event word; kill all dead air > 2 s.
- 8 → 9: use ≥ 15 different devices across the episode (device-catalog.md) — evidence boards, maps, data, paper, atmosphere; signature moments (cold open burn, case file, map fly, evidence lens, collapse shatter, kinetic thesis); colour script strictly by act; sound design pass with risers and one real silence.
- 9 → 10: the research shows something the viewer has never seen (a primary document, a forgotten clip, an exact number); every frame passes the thumbnail test; the last line makes the viewer rethink the first.

## Report format (append to out/<slug>_checklist.md)
```
AUTOMATIC  a0 9.6 · a1 9.3 · a2 9.4 · a3 9.1 · a4 9.7 · a5 9.2 · a6 9.8 · joined 9.4
HUMAN      thesis 1.0 · research .9 · hook 1.0 · images .9 · composition .9 · motion 1.0 · type 1.0 · sound .9 · craft 1.0 · packaging .9  = 9.5
FIXED      a3/4 dead air → stamp on "losing"; a2/9 same bg as a2/8 → wall:… ; thumbnail text too small → 240 px
```
