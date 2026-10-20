# Multi-agent production (Muse agent or any platform that runs several agents at once)

The principles:
- Run work **in parallel where it's independent and in sequence where judgement must be consistent.**
- **The builder never judges its own work** (`gauntlet.md`).
- Every agent reads `SKILL.md` plus the references listed for its role, writes ONLY its contract files, and never edits
  another role's files; it files notes instead.
- The Showrunner owns the thesis and the final yes.

## 1. Roles
| Role | Reads | Writes (contract) | Gate it must pass |
|---|---|---|---|
| **Showrunner** (1) | everything | `research/<slug>_brief.md`: thesis, archetype, title, open loop, act map, signature shots per act | owner OK on thesis |
| **Installer** (1, first) | `engine-addon/INSTALL.md` | a working engine | `pp_doctor` ALL PASS + looked at `out/pp_doctor.jpg` |
| **Researchers** ×2–3 | research-and-assets §1 | `research/<slug>_dossier_<part>.md`: dated facts, numbers, verbatim quotes/posts/messages, documents, footage and photo leads, coords, data series, each with 2 sources | — |
| **Fact-checker** (independent) | dossiers | `research/<slug>_factcheck.md` ✓ / ✗ / ? | 0 unverified lines used |
| **Writer** (1, one voice) | brief, verified dossier, `script-and-story.md` | `research/<slug>_script.md` | `pp_scriptlint` ≥ 8.5 + script critic KEEP |
| **Visual director** (1, one taste) | script, `visual-modes.md`, `camera.md`, `shot-script.md` | `research/<slug>_shotscript.md`: every row MEANING / IDEA / MODE / CAMERA / WORD / BRIDGE | `pp_shotscript check` 0 errors + visual-script critic KEEP |
| **Asset hunters** ×2–3 (people · places · documents/screens · data) | shot script, research-and-assets, toolkit | `research/<slug>_assets.csv` → `pp_assets.py import`, screenshots for `browser`/`post`/`phone3d`, footage `pp_clip.py`, data series | `pp_assets.py report` 0 problems |
| **Storyboarders** ×1 per act (parallel) | their act's shot-script rows, `visual-modes.md`, `camera.md`, `cine-beat.md` | `stories/<slug>-aN.story` | `pp_lint` 0 errors, ≥ 9.0 |
| **Critic** (fresh context every round) | ONLY sheets/frames + brief + shot script + owner's words | `out/<slug>_critic_<round>.md` | — (it never builds) |
| **Sound & finish** (1) | sound-and-voice, production | make per act, concat, loudness, `.srt` | −14 LUFS, frames checked |
| **Packager** (1) | script-and-story §8 | thumbnail, 3 titles, description, pinned comment | — |

## 2. Waves (what runs in parallel)
```
W0  Installer: install → pp_doctor ALL PASS  ∥  Showrunner: pp_new.mjs scaffold + 3 thesis candidates      [2 agents]
W1  Researchers A/B/C in parallel → merge dossier                                                           [2–3]
W2  Fact-checker  ∥  Showrunner locks thesis, loop, act map, signature shots                               [2]
W3  Writer: full VO script → pp_scriptlint ≥ 8.5 → script CRITIC (fresh) → revise → re-lint                  [1 + critic]
W4  Visual director: pp_shotscript → fill every row → check → visual-script CRITIC → revise                 [1 + critic]
W5  Asset hunters in parallel (from the shot script's IDEA column)  ∥  Showrunner prepares make settings      [2–3]
W6  Storyboarders, one per act, in parallel: shot-script rows → .story → lint ≥ 9.0 → pp_sheet + pp_review   [6–7]
W7  Act CRITICS (fresh, one per act, parallel) → builders fix top 6 → VERIFICATION critic → SHIP/ONE MORE  [6–7 + 6–7]
W8  Sound & finish: make per act (16:9) → join → loudness → full-film CRITIC on the MP4 frames             [1 + critic]
W9  Packager  ∥  Showrunner human rubric ≥ 9/10 → deliver                                                   [2]
```
These waves are strictly ordered. Never start W6 before W4 passes, and never start W8 before every act is SHIP.

## 3. Prompts (paste and fill the <>)
**Storyboarder (act N):**
> Read SKILL.md, references/visual-modes.md, camera.md, cine-beat.md. Translate rows <a–b> of
> research/<slug>_shotscript.md into stories/<slug>-a<N>.story, one `# cine` beat per row:
> - the row's MODE as the main `fx=`;
> - the row's CAMERA as `shot=` (none on *3d modes);
> - the change on the row's ON WORD;
> - real asset ids from research/<slug>_assets.csv.
>
> Run pp_lint until 0 errors and ≥ 9.0, then pp_sheet. Look at every row of the sheet and fix anything that doesn't show
> its MEANING. Write nothing outside your act file.

**Critic:** see `gauntlet.md` §2. Give it only the sheets, the brief, the shot script and the owner's words.

## 4. Rules that keep quality
- One Writer and one Visual director per episode, so the film has one voice and one taste. Storyboarders execute their
  decisions.
- The asset list is generated **from the IDEA column**: each prop, document, screenshot and portrait the ideas need.
- Builders fix; critics never touch files. Each critic round starts with a fresh context.
- The ledger (`out/<slug>_ledger.md`) is updated after every round. It's the proof of craft.
