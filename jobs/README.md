# Jobs: Claude (brain) ⇄ Muse (hands), no API

This repo is the shared desk between two agents:
- **Claude**: the owner's Claude plan, used in claude.ai / Claude Code. It does the thinking that decides quality: thesis,
  the per-second visual script, and judging renders.
- **Muse**: unlimited tokens. It does all the heavy work: research, writing `.story` files, importing assets, rendering,
  running the lint/fix loops.

Nobody calls anybody. Each side reads the folder, does its step, commits, and pushes. The owner (or a scheduled Claude
routine) just says "check jobs".

## Folder per episode: `jobs/<slug>/`
| File | Written by | Read by | Content |
|---|---|---|---|
| `00_request.md` | owner | both | topic, angle, deadline, anything the owner wants |
| `01_brief.md` | **Claude** | Muse | thesis, open loop, title, act map, signature shot per act, research questions |
| `02_dossier.md` | Muse | Claude | the research answers: facts with 2 sources, verbatim quotes/posts, image/footage leads |
| `03_script.md` | Muse (draft) → **Claude** (final) | both | VO script, one sentence per line, `## aN NAME act=…` headers |
| `04_shotscript.md` | **Claude** | Muse | the visual script: every sentence → MEANING · IDEA · MODE · CAMERA · ON WORD · BRIDGE |
| `05_assets.csv` + `assets/` | Muse | — | every image imported (`pp_assets.py`), ids match the shot script |
| `06_stories/` | Muse | — | `<slug>-aN.story` per act: lint 0 errors, ≥ 9.0 |
| `07_review/` | Muse | **Claude** | `pp_sheet` JPGs per act + lint output (`lint_aN.txt`) + `pp_scriptlint` output. **Small JPGs only, never the MP4** |
| `08_critic_rN.md` | **Claude** | Muse | round N: verdict per act (SHIP / ONE MORE PASS), the top 6 fixes with beat numbers |
| `09_ledger.md` | Muse | both | round · what the critic said · what changed · lint score |
| `STATUS.md` | whoever acts last | both | ONE line: `WAITING_FOR: claude|muse|owner — <what>` |

## The loop
```
owner: 00_request ─► Claude: 01_brief ─► Muse: 02_dossier + draft 03_script ─► Claude: final 03_script + 04_shotscript
  ─► Muse: assets + stories + pp_lint + pp_sheet → 07_review ─► Claude: 08_critic_r1 ─► Muse: fix → 07_review (new) ─► Claude: r2 …
  ─► Claude: SHIP ─► Muse: make + final + package
```
Rules:
- Always update `STATUS.md` when you finish a step, then commit with the message `[<slug>] <step> done → WAITING_FOR <who>`.
- Muse never edits the files Claude writes (01, the final 03, 04, 08), and Claude never edits Muse's files. If you
  disagree, write a note in `STATUS.md`.
- Review images are **contact sheets** (`pp_sheet`, 4 frames per beat), so Claude judges a whole act from 2–3 JPGs. That
  keeps Claude's usage small.
