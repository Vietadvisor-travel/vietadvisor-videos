# Toolkit — every tool, what it is for, and the capability map

## 1. Tools (run from the engine root)
| Tool | Input → output | Who uses it |
|---|---|---|
| `node tools/pp_new.mjs <slug> "<Subject>" --archetype <k> --min 10` | → dossier, script, shot list, asset list (with `keys`), 7 act files, checklist | Showrunner |
| `python3 tools/pp_assets.py search "<query>"` | → free-licence photo candidates + credit lines (Wikimedia Commons) | Asset hunters |
| `python3 tools/pp_assets.py import research/<slug>_assets.csv [--enhance]` | CSV of URLs/paths → every image/clip imported, cut out, embedded | Asset hunters |
| `python3 tools/pp_assets.py pop <photo> <id>` | → 2.5D pair (`<id>` cut-out + `<id>_plate`) | Asset hunters |
| `python3 tools/pp_assets.py report research/<slug>_assets.csv` | → OK / MISSING / NO LICENCE per id | Showrunner |
| `python3 tools/pp_img.py add/sync/check/list` | single image import (cut / plate / prop), rebuild bundle, check a story | anyone |
| `python3 tools/pp_clip.py add <video> <id> --start s --dur 3` | real footage → image sequence layer `clip:<id>` | Asset hunters |
| `python3 tools/pp_data.py chart|bars|circles|tally …` | real data (CSV) → paste-ready `chart:` `bars:` `circles:` `tally:` events | Director |
| `node tools/pp_autodirect.mjs research/<slug>_script.md research/<slug>_assets.csv --split` | VO script → first-draft act files (a `# cine` per sentence, 3 planes, events on keywords, rotating cams) | Director (then refines) |
| `node tools/pp_lint.mjs stories/<file>.story` | rules + placeholders + DIRECTOR SCORE /10 | Storyboarders, QA |
| `node tools/pp_review.mjs stories/<file>.story [--beats a-b]` | review sheets: a frame 0.45 s after every event | Storyboarders, QA |
| `node tools/frames.mjs stories/<file>.story h "t1,t2"` | frames at exact times | anyone |
| `node tools/render.mjs <story> --fmt 16x9 --scale .5 --out …` | silent draft MP4 | Storyboarders |
| `node tools/make.mjs <story> --skip-lint --speed 1.0 --fmt 16x9` | voiced + sound-designed FINAL per act | Sound & finish |
| `node tools/pp_thumb.mjs <thumb.story> --t 1.2` | thumbnail 1280×720 + 160 px check | Packager |
| `python3 tools/sfx_pro.py list` · `python3 tools/voice.py voices` | sound & voice catalogues | Sound |

## 2. Capability map — "I need to show…" → how
| Need | Tool chain | Devices |
|---|---|---|
| a real person introduced | pp_assets import (cut) | `mid=` + `lower:` / `lab:` + `in:rise` |
| a person lifting off an old photo (2.5D) | pp_assets pop | `bg=<id>_plate` + `mid=<id>` + `cam=vertigo|orbit` |
| a real document as evidence | pp_assets import (prop), scan ≥ 1500 px | `style:print;tape` + `mark` `lens` `circle` `redact` `scan` |
| archive footage, an ad, a keynote | pp_clip add | `mid="clip:id;style:tv"` / `bg=clip:id` |
| the press reaction | screenshots via pp_assets | `matchstack`, `bg="wall:…"`, `headline`, `spin` |
| the real market / revenue curve | export CSV → pp_data chart/bars | `chart` `bars` `ticker` `stockcard` |
| scale of money | pp_data tally / numbers | `odo` `stack` `moneyrain` `circles` `receipt` |
| people affected (layoffs, users) | — | `crowd` `dots;people` |
| geography / expansion | coordinates in the dossier | `bg=world` `pin` `route` `hl=` |
| who was connected to whom | cut-outs as prints | `bg=cork` + `string` + `spot` |
| how the business works | — | `flow` (+ `!broken step`) + `coinflow` |
| a time jump / an era | — | `timeline` `date` `trans=whip|burn` `vhs` `tone:halftone|sepia` |
| the collapse | — | `shatter` `burnaway` `rip` `to:$0` `flash:red` `red` `siren` `flicker` `days` |
| the thesis | — | `kin:` on `bg=black` + `burn` |
| a mystery figure | — | `tone:shadow` + `spot` + hero `?` |

## 3. Extending the engine (for new devices)
`engine/library/pp_cine3.js` shows the pattern: `PPCINE.EXT.<name> = { draw(e, lt, X), sfx, under|screen|post, d, midFx }` and
`PPCINE.BGX.<name> = (lt, o, X) => …`; new transitions as `FX.<name> = (A, B, p) => …` + `PPCINE.ALLOW_TRANS`. Add the event name to
`FXT` in `pp_lint.mjs` and document it in `device-catalog.md`. Test with `pp_review` before using it in an episode.
