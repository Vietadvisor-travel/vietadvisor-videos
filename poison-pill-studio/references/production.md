# Production — from storyboard to the uploaded file

## 1. Files
```
research/<slug>.md                 dossier (facts, sources, quotes, asset list)
stories/<slug>-a0.story … -a6.story   one per act; all `channel: poisonpill`; all but the last `endcard: off`
out/<slug>-aN_16x9_FINAL.mp4       per act
out/<slug>_FINAL.mp4               the joined film  +  <slug>.srt  +  <slug>_description.txt  +  <slug>_credits.txt
```

## 2. Tools (full list with roles: `toolkit.md`)
| Tool | Job |
|---|---|
| `node tools/pp_new.mjs <slug> "<Subject>" --archetype <k> --min 10` | scaffold dossier, shot list, asset list, 7 act files, checklist |
| `python3 tools/pp_img.py add/sync/check/list` | real photos: cut-outs, plates, prints (the only way images reach the renderer) |
| `python3 tools/pp_clip.py add <video> <id> --start s --dur 3` | real footage as an image sequence layer (`clip:<id>`) |
| `node tools/pp_lint.mjs <story>` | rules + DIRECTOR SCORE /10 |
| `node tools/pp_speed.mjs <story>` | ms per frame per beat, a render estimate, SLOW beats flagged |
| `node tools/pp_looksheet.mjs <story> --looks a,b,c` | the same story in several looks side by side (choose the look) |
| `node tools/pp_review.mjs <story> [--beats 5-12]` | auto review sheets: a frame 0.45 s after every event of every beat |
| `node tools/frames.mjs <story> h "t1,t2…"` | frames at exact times |
| `node tools/render.mjs <story> --fmt 16x9 --scale .5 --out …` | silent draft |
| `node tools/make.mjs <story> --skip-lint --speed 1.0 --fmt 16x9` | voiced, sound-designed FINAL |
| `node tools/pp_thumb.mjs <thumb.story> --t 1.2` | thumbnail 1280×720 + 160 px readability check |
| `python3 tools/pp_assets.py import/pop/search/report` | batch real-image import, 2.5D pairs, licence report |
| `python3 tools/pp_data.py chart/bars/circles/tally` | real data → chart events |
| `node tools/pp_autodirect.mjs <script.md> <assets.csv> --split` | first-draft act files |

## 3. Per act loop
```bash
python3 tools/pp_img.py check stories/<slug>-a2.story          # all images OK
node tools/pp_lint.mjs stories/<slug>-a2.story                 # 0 errors, warnings addressed
node tools/pp_review.mjs stories/<slug>-a2.story                # review sheets → out/<slug>-a2_review_NN.jpg  (look at EVERY one)
node tools/render.mjs stories/<slug>-a2.story --fmt 16x9 --scale .5 --out out/<slug>-a2_draft.mp4   # silent draft, ~2 min per minute
# final, voiced + sound pass (detached; one job at a time on a 2-CPU box)
setsid nohup node tools/make.mjs stories/<slug>-a2.story --skip-lint --speed 1.0 --fmt 16x9 --jobs 2 --lite > out/a2.log 2>&1 &
# crashed / rebooted?  run the same line again with --resume   ·   progress: out/<slug>-a2_16x9_v.chunks/progress.json
```
pp_review picks the frames itself (0.45 s after every event); add frames.mjs times for anything in between. A QA sheet with any red MISSING IMAGE card, a face under the caption, or two similar frames in a row goes back to the storyboard.

## 4. Join & check
```bash
ls out/<slug>-a*_16x9_FINAL.mp4 | sort | sed "s/^/file '/;s/$/'/" > out/list.txt
ffmpeg -f concat -safe 0 -i out/list.txt -c copy out/<slug>_FINAL.mp4
ffmpeg -i out/<slug>_FINAL.mp4 -af loudnorm=print_format=summary -f null - 2>&1 | tail -12   # ≈ −14 LUFS
# subtitles: concatenate the per-act .srt with offsets (python: shift each by the previous durations)
```
Watch the joined file at the act boundaries (the cut must be a hard cut on a word, no black frame) and extract 15+ stills from the FINAL file for the last QA pass.

## 5. Time budget (agent)
Research 15 % · script 15 % · shot list 25 % · assets 15 % · storyboard 15 % · QA/fix 10 % · render 5 %. If the shot list took less time than the storyboard, it was too shallow.

## 6. Delivery
Upload FINAL mp4 + srt + description + credits to the owner's Drive folder (or attach), and report: duration, beats, % beats with real photos, lint summary, 6 representative stills.

## 7. Render speed on a weak machine (2 CPU cores, 7 GB, no GPU)
v4.2 fixes each cause found on the production machine:

| Cause | Fix in v4.2 |
|---|---|
| A film post pass (grain, vignette, chromatic) on every frame, 0.5–1 s each | off by default (`post: on` in the header brings it back for a fast machine); grain and vignette are now cheap 2D overlays |
| Every frame redrawn even when almost nothing moves | **frame reuse**: if frames f and f+2 look the same, f+1 is copied. Still beats cost about half. Turn it off with `--reuse 0` |
| Blur done with the slow CPU filter | depth-of-field blur by downscale/upscale (about 20× faster) |
| The world map redrawn country by country every frame | the map is rasterised once per zoom band and reused; only highlights draw live |
| 3D through software WebGL | 3D draws at 15 fps (12 with `--lite`) and at 0.62× (0.5× with `--lite`); in-between frames are reused. Keep 3D ≤ 20 % of beats; use the FAST modes |
| One render process per job | `--jobs N` runs N browser pages on a shared queue of chunks (default: CPU cores, limited by memory) |
| A reboot kills the job and the whole segment is lost | the film renders in **4 s chunks** kept on disk. Run the same command again (make.mjs: add `--resume`) and it continues from the last finished chunk |
| A stuck segment blocks the whole pipeline | **watchdog**: a frame over 90 s (`--frame-timeout`) restarts that page and retries the chunk once, then stops with the beat's time range |
| No way to see progress | `out/<name>.chunks/progress.json` is rewritten after every chunk (done, total, eta, updated). Monitor that file; if `updated` is older than 15 min, restart with `--resume` |
| x264 "medium" competes with the renderer for CPU | `veryfast` preset, 1 thread per chunk; the delivery step re-encodes small anyway |

**Commands:**
```bash
node tools/pp_speed.mjs stories/<act>.story              # ms per frame per beat + an estimate; SLOW beats flagged before you render
node tools/make.mjs stories/<act>.story --fmt 16x9 --jobs 2 --lite        # 2-core machine
node tools/make.mjs stories/<act>.story --fmt 16x9 --jobs 2 --lite --resume   # after a crash or reboot: same command + --resume
```
**Measured (4 cores, software WebGL):**
- 2D beats render at 40–110 ms a frame.
- 3D beats render at 150–500 ms a frame.
- A 66 s film of fast modes rendered in 2 min with 4 jobs.

On a 2-core machine, expect about 2–3× slower. Run one act at a time, never two `make.mjs` in parallel.
