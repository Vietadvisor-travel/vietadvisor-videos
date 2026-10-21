---
name: "poison-pill-studio"
description: "Produce Poison Pill episodes end to end: 8–12 min 16:9 English YouTube documentaries on why companies rise and fall: wow scripts (A/V script, hit words, beats, laughs), real photos brought alive (2.5D living pictures, depth atmosphere, light), one grade/light/grain over every frame, word-level voice sync, 11 looks by content, 71 scene types, fast resumable rendering. Linters, auto-director, critic loop, director-package mode. Start with START.md."
---

# Poison Pill Studio v5.2 "Ultimate": the complete production system

**Channel:** Poison Pill · @poisonpill.channel · "Why great companies rise, and why they fall."
**Format:** **16:9 only**, 8–12 min, English VO + English on screen, SFX only (no music). **The look follows the content**
(11 looks, `references/look.md`), and **the tone is playful**: clear first, then a laugh (`references/humor.md`). No cartoon characters, ever.
**Standard:** Kurzgesagt-level clarity × Johnny Harris maps & paper × Vox evidence × Coffeezilla receipts ×
MagnatesMedia collage × LEMMiNO 3D atmosphere.

> **The owner's rule:** "Nếu biên ra không đủ chi tiết và hời hợt, thì sản phẩm chạy từ engine cũng đểu." ("If the
> direction is thin and shallow, whatever comes out of the engine will be bad too.")
> The engine only executes direction; it can't invent it. **Every sentence gets the picture that explains it.** A film
> made of photo + slammed word + stamp + shake is a slideshow, and it does not ship.

## What makes v5 different (read first)
0. **Invent, don't assemble (v5.2).**
   - `build` composes each picture from the sentence: real images, 24 icons, text, numbers and arrows, with 30 verbs
     timed to words (`build.md`). Use it on ≥ 25 % of beats.
   - Accents and transitions vary per episode.
   - `pp_history` stops episodes repeating each other.
1. **The script carries the film.** Write an A/V script with a THESIS of 25 words or fewer, a reveal ladder, scenes "in
   the room", one **hit word** per sentence, `[BEAT]` pauses and `(J)` laughs (`script-masterclass.md`). Gate:
   `pp_scriptlint --long` ≥ 8.5.
2. **Real photos, alive.** `scene` lifts the subject off a sharp real photo, adds depth atmosphere and light, and the
   camera flies through the planes. Use it on ≥ 20 % of beats (`motion.md`).
3. **One film, not a collage of sources.** One grade, one light direction and one grain go over every frame, including
   3D, diagrams and AI fills. Real-3D stays ≤ 10 %, for signature moments only.
4. **Locked to the voice.** Word-level timing comes from the voice-over. Pictures land 3 frames before the stressed
   word (`editing.md`).
5. **Music and edit life (v5.1):**
   - Real tracks from a curated library, cut to the acts on bar lines, dropping out under every `[BEAT]` (`music.md`).
   - A camera punch on every **hit word**.
   - Automatic re-frames on long beats.
   - Motivated transitions at act changes and on "But…" lines.
6. **Generated images only fill gaps:** clean plates, environments, props, textures. Never a real person, document,
   logo or event (`ai-images.md`).

## START HERE (in this order, no skipping)
1. **Install and prove it:** `engine-addon/INSTALL.md`, then `node tools/pp_doctor.mjs` → ALL PASS. Open `out/pp_doctor.jpg`.
2. **Read** this file, then `references/visual-modes.md` (what to show), `references/camera.md` (how to shoot it),
   `references/shot-script.md` (how to plan it), and `references/script-and-story.md` (how to write it).
3. **Follow the pipeline** below. On a multi-agent platform use `references/multi-agent.md`, and always the critic loop in
   `references/gauntlet.md`.

## Director package mode (Claude = brain, Muse = hands)
When the director is asked for **"gói đạo diễn"** / a director package, it produces ONE file `EPISODE_<nn>_<slug>.md` exactly as
defined in `references/director-package.md`: META · FACTS TO VERIFY · ASSETS · SCRIPT · VISUAL SCRIPT · STORYBOARD (exact syntax)
· INSTRUCTIONS FOR MUSE · SELF-CHECK. No web search; every checkable fact goes to the verify list. The production agent builds
the film from it without redesigning anything.

## The 12 non-negotiables
1. **Ideas, not collage.** At least 70 % of beats show the idea through a set piece, a screen or diagram mode, a 3D shot,
   a map or marked evidence. Plain collage (photo + type) is at most 35 %. Use at least 8 different scene types from at
   least 3 families per episode. No mode appears 3 times in a row or in more than about 15 % of beats. **Real-3D ≤ 20 %
   of beats** (slow to render); the 19 FAST modes give depth and motion at 2D speed.
2. **A visual script before any storyboard.** Every sentence gets MEANING → IDEA → MODE → CAMERA → ON WORD → BRIDGE
   (`pp_shotscript check` passes).
3. **A camera with intent.** Every beat of 3 s or more has `shot=` (3D shots fly their own). Scale changes across every
   cut, and moves land on stressed words.
4. **Restraint.** Shakes and crash zooms ≤ 2/min, flashes ≤ 1.5/min, stamps ≤ 3/min, glitches ≤ 1/min, hero-text slams on
   ≤ 40 % of beats. The modes carry the energy.
5. **Real material is the backbone.** Real people, documents, posts, articles, footage and data go **on** the objects:
   prints on dominoes and chess kings, screenshots in the phone and the browser, portraits in the profile and on the board
   table. At least 60 % of beats carry a real image. AI images are never used for a real person, document or product.
6. **The look fits the content, always 16:9** (`look.md`). Red is for crisis and stamps only. **Tone playful** (`humor.md`),
   with real photos and edit timing, and **never cartoon characters or mascots**.
7. **One picture change about every 1.5–2 s**, from mode events, camera keyframes or overlays, on the spoken word.
8. **Cuts by meaning:** zoom-through, match on shape, match on action, continuity of an actor, whip on "but". Otherwise a
   hard cut. Never a fade or a dissolve.
9. **Sound:** SFX on every event (automatic), about 1 s of silence before the biggest hit, −14 LUFS.
10. **Facts:** 2 sources per number, date or quote; posts, quotes and headlines are verbatim; unknown = out.
11. **Story:**
    - a thesis first;
    - a hook in 15 s;
    - an open loop in minute 1;
    - BUT/THEREFORE between beats;
    - a re-hook every 2–3 min;
    - a midpoint twist;
    - the thesis landed at the end.

    `pp_scriptlint` ≥ 8.5.
12. **Gates:**
    - `pp_doctor` ALL PASS;
    - `pp_scriptlint` ≥ 8.5;
    - `pp_shotscript check` clean;
    - `pp_lint` 0 errors and ≥ 9.0 per act;
    - every `pp_sheet` row looked at;
    - an independent critic says SHIP;
    - human rubric ≥ 9/10.

## The pipeline
| # | Stage | Tool → output | Gate |
|---|---|---|---|
| 0 | Install | `pp_doctor.mjs` | ALL PASS |
| 1 | Scaffold & topic | `pp_new.mjs <slug> "<Subject>" --archetype … --min 10` · `story-archetypes.md` | topic ≥ 75/100 |
| 2 | Research dossier | `research/<slug>_dossier*.md` (facts, verbatim posts/quotes/messages, documents, screenshots, data series, coordinates) | 2 sources per fact |
| 3 | Fact-check (independent) | `research/<slug>_factcheck.md` | 0 unverified used |
| 4 | Thesis, loop, act map, VO script | `research/<slug>_script.md` → `pp_scriptlint.mjs … --long` | ≥ 8.5 + critic KEEP |
| 5 | **Visual script** | `pp_shotscript.mjs research/<slug>_script.md` → fill every cell (`shot-script.md`) | `pp_shotscript check` 0 errors + critic KEEP |
| 6 | Assets (from the IDEA column) | `pp_assets.py import/pop/report`, screenshots, `pp_clip.py`, data CSVs | report 0 problems |
| 7 | Storyboard per act | the shot-script rows → `stories/<slug>-aN.story` (`pp_autodirect … --split` gives a draft) | `pp_lint` 0 errors, ≥ 9.0 |
| 8 | Look at it | `pp_sheet.mjs` (every beat × 4 moments) + `pp_review.mjs` | every row explains its sentence |
| 9 | Critic loop | `gauntlet.md`: fresh critic → top 6 fixes → verification critic | SHIP |
| 10 | Draft render | `pp_speed.mjs` (SLOW beats?) → `render.mjs --fmt 16x9 --scale .5 --jobs N` | alive at 1× |
| 11 | Make & join | `make.mjs` per act (16:9) `--jobs N [--lite]`; crash → same command `--resume` → concat → loudness → full-film critic | −14 LUFS, SHIP |
| 12 | Package & deliver | `pp_thumb.mjs`, titles, description, credits | human rubric ≥ 9/10 |

## One beat, four ways (the same sentence, four families)
> *"Everyone saw the famous names. Nobody looked at what was underneath."*
```
# cine act=doubt shot="1.7:pt:.5,.3|ws/glide|2:pt:.5,.78@underneath/drop" fx="iceberg:x;tip:FAMOUS NAMES;deep:NO AUDIENCE,NO PLAN,NO TIME;dive:underneath"
# cine act=doubt fx="zoomchain:x;img:press_wall,katzenberg,memo_scan;pts:.62,.4~.5,.6;go:names~underneath"
# cine act=doubt fx="desk3d:x;img:press_1,katzenberg,memo_scan,downloads_chart;lab:CASE 0417 · QUIBI;open:saw;spread:underneath;hero:3"
# cine act=doubt bg=quibi_press_wall shot="ms:1|insert:2@underneath/dolly" focus="1@0|2@underneath" mid="katzenberg;x:.28;h:.62;at:c1|memo_scan;x:.72;h:.6;at:underneath;style:print;tape" fg="@doc;x:.1;y:.99;h:.2;at:c1" fx="mark:2;at:underneath+.6"
Everyone saw the famous names. Nobody looked at what was underneath.
```
Pick the one that best serves this moment of the film and its neighbours (variety, bridges, act signature).

## Reference index
| File | Read when |
|---|---|
| `references/script-masterclass.md` | **always (writing)**: hooks, reveal ladder, scenes, line craft, humor, endings, the A/V script, the critic's scorecard |
| `references/editing.md` | **always (directing)**: cut rhythm, word sync, layering, transitions, camera, sound layers, text, per-beat/per-minute critic checklist |
| `references/motion.md` | **always (visuals)**: easing, idle motion, parallax, atmosphere, light, grain, the cohesion grade, AI imagery |
| `references/build.md` | **always**: the free-form composer, how to turn any sentence into its own picture, 25 examples, freshness rules |
| `references/music.md` | music library (safe sources, moods), how the score is cut to the acts automatically |
| `references/ai-images.md` | when an image is missing: what may be generated, the style bible per look, disclosure |
| `references/director-package.md` | **director package mode**: the one-file brain of an episode + the standard production instructions |
| `references/visual-modes.md` | **always**: the 70 scene types, the content→mode decision table, the variety budget, sequencing |
| `references/humor.md` | **always**: playful tone, 10 comedy techniques, the photo-based comedy tools and their caps, where not to joke |
| `references/camera.md` | **always**: shot sizes, angles, moves, rack focus, grammar, recipes |
| `references/shot-script.md` | **always**: the per-second visual script, bridges, a worked example |
| `references/script-and-story.md` | writing: thesis, architecture, BUT/THEREFORE, loops, re-hooks, specificity, hooks, packaging |
| `references/gauntlet.md` | **always on Muse**: why agents fail, the builder ≠ critic loop, critic prompt, ledger |
| `references/multi-agent.md` | multi-agent roles, waves, prompts |
| `references/look.md` | **always**: the 11 looks and which content gets which, per act/beat switching, 16:9 only |
| `references/toolkit.md` | every tool + the v3 capability map + how to extend the engine |
| `references/device-catalog.md` · `cine-beat.md` · `shot-library.md` | v3 overlay devices, exact `# cine` syntax, 60 collage recipes |
| `references/directing.md` · `genre-craft.md` · `visual-bible.md` | word→event dictionary, what the best channels do, frame QA |
| `references/research-and-assets.md` · `story-archetypes.md` | sources, licences, photo/footage pipeline · 8 story shapes |
| `references/sound-and-voice.md` · `production.md` · `quality-rubric.md` · `engine-fixes.md` | sound · render & delivery (§7: render speed on a weak machine) · the 10-point gate · install & fork issues |
| `examples/` | `fast_demo`, `fun_demo`, `looks_demo`, `world_demo`, `sets_demo`, `modes_demo`, `modes2_demo`, `3d_demo`, `3d2_demo`, `map3d_demo`, `camera_demo`, `quibi_cinematic`, `episode_template` |
