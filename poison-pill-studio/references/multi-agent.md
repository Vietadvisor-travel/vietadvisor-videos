# Multi-agent production (Muse agent or any platform that runs several agents at once)

Principle: **parallel where work is independent, sequential where judgement must be consistent, and an independent critic at
every gate.** Every agent reads `SKILL.md` + the references named for its role, writes ONLY its contract files, and never
edits another role's files (it files notes instead). The Showrunner owns the thesis and the final yes.

## 1. Roles
| Role | Reads | Writes (contract) | Never |
|---|---|---|---|
| **Showrunner** (orchestrator, 1) | everything | `research/<slug>_brief.md` (thesis, archetype, title, loop, act map, signature moments), merges, final go | writes beats itself while others work |
| **Researcher** ×2–3 (split by era/act) | research-and-assets §1 | `research/<slug>_dossier_<part>.md` — dated facts, numbers, quotes, documents, footage + photo leads, map coords, each with 2 URLs | paraphrase quotes as quotes |
| **Fact-checker** (independent) | dossiers | `research/<slug>_factcheck.md` — ✓ / ✗ / ? per line with the source that settles it | trust the researcher's sources without opening them |
| **Writer** (1 — one voice) | brief, verified dossier, script-and-story | `research/<slug>_script.md` (VO lines, re-hooks, act marks, word count per act) | invent facts not in the verified dossier |
| **Director** ×1 per 2 acts | script, directing, visual-bible, shot-library | `research/<slug>_shotlist_aN.csv` — every sentence, every column, recipe id | leave a cell empty |
| **Asset hunters** ×2–3 (people · places · documents/footage · data) | shot lists, research-and-assets §2–5, toolkit | `research/<slug>_assets.csv` (id, role, source, licence, credit, used in, keys) → `pp_assets.py import`, 2.5D pairs (`pop`), footage (`pp_clip.py`), data events (`pp_data.py`) | use unlicensed / stock / AI faces |
| **Storyboarders** ×1 per act (parallel) | shot list of their act, cine-beat, shot-library | `stories/<slug>-aN.story` — lint 0 errors, score ≥ 9.0 | change the script wording (file a note to the Writer) |
| **QA critic** (independent, fresh context) | visual-bible §8, quality-rubric, review sheets | `out/<slug>_qa_aN.md` — per beat: pass/fail + the exact fix | approve its own work |
| **Sound & finish** (1) | sound-and-voice, production | make per act, concat, loudness report, `.srt` | — |
| **Packager** (1) | script-and-story §5 | thumbnail (pp_thumb), title options ×3, description, pinned comment | clickbait the film doesn't pay off |

## 2. Waves (what runs in parallel)
```
W0  Showrunner: pp_new.mjs scaffold + brief draft (thesis candidates ×3)                       [1 agent]
W1  Researchers A/B/C in parallel (by era or act)  ──►  merge dossier                          [2–3 agents]
W2  Fact-checker  ∥  Showrunner locks thesis/act map from the dossier                         [2 agents]
W3  Writer: full VO script (one voice) → Showrunner read-through → revise once                [1 agent]
W4  Asset hunters: pp_assets search → assets CSV (with keys) → pp_assets import / pop, pp_clip, pp_data  [2–3 agents]
    ∥ Showrunner: pp_autodirect --split → first-draft act files from script + assets                 [1 agent]
    ∥ Directors in parallel refine the drafts into shot lists (a0–a2 · a3–a4 · a5–a6)               [3 agents]
W5  Asset hunters fill the gaps the Directors asked for (notes.md); pp_assets report = 0 problems [2–3 agents]
W6  Storyboarders a0…a6 in parallel (each: write → pp_lint → fix → pp_review)                 [up to 7 agents]
W7  QA critic per act (fresh context) → storyboarder fixes → re-review  (loop until pass)     [2 agents alternating]
W8  Sound & finish: make a0…a6 sequentially (CPU) → concat → loudness ∥ Packager thumbnail    [2 agents]
W9  Showrunner: human rubric ≥ 9/10, final stills report → deliver                           [1 agent]
```
If the platform runs fewer agents at once, keep the order and shrink the waves; never merge the Fact-checker or the QA critic
into the role they check.

## 3. Handoff contracts (so nothing gets lost between agents)
- Every file starts with a header: `slug · role · version · date · depends on (file@version)`.
- The shot list CSV columns are fixed (`pp_new.mjs` writes them): `act,beat,mm:ss,sentence,shot+cam,BG,MID,FG,hero@word,sup@word,events,sfx,cut,recipe`.
- Asset ids are `<slug>_<thing>` (`quibi_katzenberg`, `quibi_wsj_shutdown`); the assets CSV is the single source of truth for credits.
- Cross-role requests go in `research/<slug>_notes.md` as `- [ ] @Writer beat a3/7: line too long for one shot (19 words) — split?`; the owner role ticks it.
- A stage is "done" only when its gate passes (table in SKILL.md §1) — the Showrunner checks the gate, not the agent's claim.

## 4. Prompts (paste into each agent; replace <…>)
**Researcher** — "You are the Poison Pill researcher for <subject>, part <era/acts>. Read SKILL.md and references/research-and-assets.md. Build the dossier section in the exact format of §1: dated facts with numbers, every one with two independent URLs you opened, verbatim quotes with speaker/date/URL, real document and headline texts, photo and footage leads with licence, map coordinates. Mark confidence. Write only research/<slug>_dossier_<part>.md."
**Fact-checker** — "Independently verify every line of research/<slug>_dossier_*.md by opening sources yourself. Output ✓/✗/? with the settling source. Anything not ✓ is removed from the film."
**Writer** — "Write the VO script for <subject> from the verified dossier only, archetype <x>, thesis <…>, <min> minutes ≈ <words> words. Follow script-and-story.md §2–4: one sentence = one drawable idea (6–14 words), BUT/THEREFORE, re-hook every 60–90 s, open loop in a0, thesis on black in a6."
**Director** — "Start from the pp_autodirect draft of acts <aN–aM>; it is only a skeleton. Turn it into a shot list (directing.md §1, every column). Name the recipe (S01–S36) or describe a new composition. Every sentence gets at least one real image and an event on its stressed word."
**Storyboarder** — "Write stories/<slug>-aN.story from shotlist_aN.csv using cine-beat.md. Run pp_img check, pp_lint (0 errors, DIRECTOR SCORE ≥ 9.0) and pp_review; open every sheet and fix each frame that fails visual-bible §8. Report the score and the sheets."
**QA critic** — "You did not write this act. Open every pp_review sheet of stories/<slug>-aN.story and judge each frame against visual-bible §8 and quality-rubric.md. For each failure give the beat, the frame time, what is wrong and the exact key change. Do not praise; be specific."

## 5. Consistency (one film, many hands)
- One Writer, one voice; one Showrunner for thesis and colour script; Storyboarders share `shot-library.md` and may not invent new colours, fonts or transitions.
- Before W6 the Showrunner writes the **look sheet** in the brief: which photo tones per person (e.g. founder = bw, rival = duo), which bg family per act, which 3–4 signature shots (and where), which devices are reserved for the climax (shatter, burn-swap, kin).
- After W7 the Showrunner renders `pp_review` across act boundaries (`--beats`) to check the cuts between acts flow.
