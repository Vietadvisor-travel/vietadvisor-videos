---
name: "poison-pill-studio"
description: "Produce ANY Poison Pill episode end to end — long-form 16:9 YouTube documentaries (8–12 min, English) on why companies, founders and empires rise and fall — at MagnatesMedia / Johnny Harris / Vox level: a cut-and-paste collage of REAL photos, documents, maps, data and archive footage with 100+ cinematic devices (3-plane parallax, marker annotation, evidence boards, data viz, paper & screen props, atmosphere, film transitions), every event locked to a spoken word, SFX only. Includes the engine add-on, 14 production tools (scaffold, asset import, footage, data, auto-director, lint score, review sheets, thumbnail), 60 shot recipes, 8 story archetypes and a multi-agent pipeline; ships only at Director Score ≥ 9/10."
---

# Poison Pill Studio (v3 · Oct 2026) — the complete production system

**Channel:** Poison Pill · @poisonpill.channel · https://www.youtube.com/@poisonpill.channel · ID UCkZRWnux4CKYbe6ayD9-g3Q
**Promise:** "Why great companies rise, and why they fall."  **Format:** 16:9 · 8–12 min · English VO + on-screen English · no Shorts · no music.
**Standard:** MagnatesMedia (cut-out luxury collage) × Johnny Harris (paper, burns, match cuts) × Vox (marker, maps) × Coffeezilla (evidence) × Polymatter (data).

> **Golden rule (the owner's words): "Nếu biên ra không đủ chi tiết và hời hợt, thì sản phẩm chạy từ engine cũng đểu."**
> The engine executes direction; it cannot invent it. Each SENTENCE is a shot, each STRESSED WORD is a visual event, each
> LAYER holds a REAL image wherever one exists. Detail, finish, "làm đến nơi đến chốn" — or it does not ship.

## What this skill gives you
- **Engine add-on** (`engine-addon/`): `pp_cine.js` (3-plane cinematic beat, act grades, channel mode) · `pp_world.js` (real world map data) · `pp_cine2.js` (maps, evidence, footage, timeline, ledger, kinetic type, case-file sting) · `pp_cine3.js` (marker annotation, investigation board, photo rip/burn/glitch, match stack, polaroids, 15 data-viz devices, memos, spinning newspaper, search bar, notifications, 16 atmosphere/lens effects, 5 new transitions).
- **14 tools** — scaffold, asset import & 2.5D pairs, footage, data→chart, auto-director, lint + Director Score, review sheets, thumbnail… → `references/toolkit.md`.
- **The language**: `references/device-catalog.md` (everything that can appear on screen) · `references/cine-beat.md` (syntax) · `references/shot-library.md` (60 lint-clean recipes).
- **The craft**: `visual-bible.md` · `directing.md` · `genre-craft.md` (what the best channels do + retention research) · `story-archetypes.md` · `script-and-story.md`.
- **The process**: `multi-agent.md` (Muse agent, parallel roles) · `production.md` · `quality-rubric.md` (10-point gate).

## ★ The 15 non-negotiables
1. **3 depth planes** in every frame — BG (blurred, dimmed, toned context) · MID (real cut-out / real print, on a third) · FG (real object or document in the bottom band).
2. **A new visual event every ≤ 1.5–2 s, on the stressed word.** No still frame under a voice (`pp_lint` measures every gap).
3. **Real images are the backbone** — real people, places, documents, headlines, receipts, footage, map borders, data. ≥ 70 % of beats carry a real image. Drawn props and type are seasoning. AI images only for generic backgrounds/symbols — never a real person, document, headline or product.
4. **Colour tells the story**: navy · gold · paper · red (crisis only) · teal (doubt/flashback); act script setup → rise → doubt → fall → after → lesson.
5. **Type is image**: hero 1–3 words slam on the word, support line gold, ≤ 8 words on screen, never on a face.
6. **Caption**: one fixed style, bottom 10 %, never moves.
7. **Composition**: thirds, leading lines, 30–40 % negative space; confrontation = two subjects facing.
8. **Camera + parallax on every shot**; never the same camera, backdrop or composition twice in a row.
9. **Cuts**: ~80 % hard cut on the word; whip / match / slam / tear / burn / glitch / shutter / flash for meaning. No fades, dissolves, 3D flips.
10. **Sound**: SFX on every event (automatic), risers into peaks, ~1 s of silence before the biggest hit; no music bed; −14 LUFS.
11. **Facts**: 2 sources per number/date/quote; quotes and headlines verbatim from the dossier; unknown = out; generic props labelled as illustration.
12. **Thesis first**: one surprising truth; open loop in the first 30 s paid in the last minute; return to the premise every 2–3 min.
13. **Signature**: cold open (the end first) → `# ppcase` sting by ~0:20 → acts → thesis on black (`kin`) → end card.
14. **Gates**: `pp_lint` 0 errors and DIRECTOR SCORE ≥ 9.0; every `pp_review` sheet inspected; human rubric ≥ 9/10.
15. **Finish**: FINAL MP4 1080p + `.srt` + thumbnail (160 px readable) + description (timestamps, sources, credits) + pinned comment.

## 0. Set up (once per session)
```bash
cp engine-addon/engine/library/{pp_cine.js,pp_world.js,pp_cine2.js,pp_cine3.js} <engine>/engine/library/
cp engine-addon/tools/*  <engine>/tools/
# engine/library/index.js → append LAST, in order:  'pp_cine','pp_world','pp_cine2','pp_cine3'
cd <engine> && npm install --no-audit --no-fund && python3 tools/voice.py setup && python3 tools/pp_img.py sync
```
Smoke test: `examples/*.story` → `pp_lint` 0 errors → `pp_review` sheets look right. Fork bugs & install details: `references/engine-fixes.md`.

## 1. The pipeline (multi-agent version: `references/multi-agent.md`)
| # | Stage | Tool / output | Gate |
|---|---|---|---|
| 0 | Scaffold | `pp_new.mjs <slug> "<Subject>" --archetype …` | files exist |
| 1 | Topic & archetype | `story-archetypes.md`, score ≥ 75 | owner OK if unsure |
| 2 | Research dossier | `research/<slug>.md` (timeline, money, people, quotes, documents, footage, map coords, data CSVs) | 2 sources per fact |
| 3 | Fact-check (independent) | `research/<slug>_factcheck.md` | 0 unverified |
| 4 | Thesis, act map, VO script | `research/<slug>_script.md` (one sentence per line, `## aN NAME act=…`) | read-aloud test |
| 5 | Assets | `pp_assets.py search/import/pop`, `pp_clip.py`, `pp_data.py` | `pp_assets.py report` 0 problems |
| 6 | First-draft direction | `pp_autodirect.mjs … --split` → `stories/<slug>-aN.story` | runs clean |
| 7 | **Direction by hand** (the real work) | refine every line with `directing.md`, `device-catalog.md`, `shot-library.md` | no `?` placeholders, every sentence has its event |
| 8 | Lint & score | `pp_lint.mjs` per act | 0 errors, score ≥ 9.0 |
| 9 | Visual QA | `pp_review.mjs` per act → fix → repeat | every frame passes `visual-bible §8` |
| 10 | Draft render | `render.mjs --scale .5` | alive at 1× |
| 11 | Make & join | `make.mjs` per act → concat → loudness | −14 LUFS, 15 stills checked |
| 12 | Package & deliver | `pp_thumb.mjs`, description, credits | human rubric ≥ 9/10 |

## 2. One beat
```
# cine act=doubt bg=cork cam=hand mid="quibi_ceo;x:.18;h:.36;bottom:.5;at:c1;style:print;tape|quibi_investor;x:.5;h:.34;bottom:.46;at:investor;style:print;tape|quibi_rival;x:.82;h:.36;bottom:.52;at:rival;style:print;tape" fg="quibi_contract;x:.5;y:.99;h:.3;at:deal;style:polaroid;rot:4" fx="string:1>2>3;at:investor;rate:.8|stamp:CONNECTED;at:deal;x:.5;y:.7;col:grey;size:60"
The CEO. His investor. And his biggest rival. All in the same deal.
```
`bg=` backdrop · `cam=` camera · `mid=`/`fg=` real images (styles, tones, entrances) · `hero=`/`sup=` type · `fx=` events (`|`) each with `at:<word>` · `trans=` cut type.
Full list of 100+ devices: `references/device-catalog.md`.

## 3. Directing in one screen (`directing.md` + `genre-craft.md`)
Number → count/odometer/stack · name → real cut-out + lower third · place → plate or map pin/route · date → typed card/timeline · document → real scan + circle/mark/lens/redact/scan · connection → cork board + red string · claim → bubble/quote/memo · press → match stack/spinning paper/headline storm/photo wall · market → ticker/stockcard/chart · scale → dots/crowd/circles/bars · how it works → flow + coinflow · archive → `clip:` in a TV, VHS, halftone · then/now → split · culprit → spot/silhouette · realisation → vertigo + pulse + focus · collapse → shatter/burnaway/rip + burn-swap to $0 + red + siren · thesis → `kin` on black + burn.
Rhythm: denser in minutes 0–3, a burst every 2–3 min, premise loop every 2–3 min, silence before the peak, smash cut after calm.

## 4. Quality gates
`pp_lint` DIRECTOR SCORE /10 (sync, placeholders, dead air, planes, real-image share, density, words, hook, device variety ≥ 15 per episode, repetition, colour order) ≥ 9.0, then the human rubric in `quality-rubric.md` ≥ 9/10 written into `out/<slug>_checklist.md`.

## 5. Reference index
| File | Read when |
|---|---|
| `references/toolkit.md` | **always** — every tool + "I need to show… → how" capability map |
| `references/device-catalog.md` | **always** — every backdrop, camera, layer style, tone, entrance, event, transition |
| `references/visual-bible.md` | always — the 8 elements of a frame, palette/act grades, frame QA |
| `references/directing.md` | always — shot list method, word→event dictionary, rhythm |
| `references/genre-craft.md` | always — what MagnatesMedia/Harris/Vox/Coffeezilla/Polymatter do + retention research |
| `references/shot-library.md` | storyboarding — 60 recipes (S01–S60) |
| `references/cine-beat.md` | exact syntax of every key |
| `references/story-archetypes.md` | choosing the shape (8 archetypes) |
| `references/script-and-story.md` | topic score, 10-min architecture, hooks, line craft, packaging |
| `references/research-and-assets.md` | dossier, sources, real photos/footage/maps, licences, import |
| `references/multi-agent.md` | running on Muse agent / any multi-agent platform |
| `references/sound-and-voice.md` · `production.md` · `quality-rubric.md` · `engine-fixes.md` | sound · render & delivery · the gate · install & extend |
| `examples/` | `quibi_cinematic` (directed 60 s) · `v2_devices` · `v3_devices` · `episode_template` |
