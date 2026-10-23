# MUSE: big media goes to Google Drive, not git (v6.4). Read this whole file, then follow it from now on.

**Why:**
- The stock library and episode footage now reach several GB. Git (and GitHub's 100 MB limit) cannot hold them.
- From now on every big zip goes to the owner's Google Drive with `studio/tools/pp_drive.py`.
- Git keeps only text and small files.
- Claude Code reads the zips straight from Drive. It downloads only each zip's catalogue and the clips a film uses.

## 0. Before the first upload
1. `git pull` (you need `studio/tools/pp_drive.py`).
2. Check that the environment has `GDRIVE_CLIENT_ID`, `GDRIVE_CLIENT_SECRET` and `GDRIVE_REFRESH_TOKEN`
   (`env | grep -c GDRIVE_` prints 3).
   - If not, stop and tell the owner: "cần cài chìa khoá Drive theo jobs/DRIVE_SETUP.md".
   - Never ask for the values in chat.
3. Network: `www.googleapis.com` and `oauth2.googleapis.com` must be reachable.

## 1. What goes where
| What | Where | How |
|---|---|---|
| `RESEARCH_<slug>.md`, `desc.json`, notes | git `jobs/<slug>/` | as before |
| `<slug>_assets.zip` (images) ≤ 90 MB | git `jobs/<slug>/` | as before |
| `<slug>_assets.zip` > 90 MB | Drive `<slug>/` | `pp_drive.py put … --to <slug>` |
| episode footage `<slug>_clips_N.zip` | **Drive `<slug>/`** | `pp_drive.py put … --to <slug>` |
| shared stock library `stock_library_N.zip` | **Drive `_stock/`** | `pp_drive.py put … --to _stock` |
| music library | git `jobs/_music/` (unchanged) | as before |
| `jobs/_drive.json` (the Drive folder id) | git | written by your FIRST upload: commit and push it |

**Never** `git add` a clips zip or a stock zip again. `.gitignore` now blocks them as a safety net.

## 2. Episode footage
```bash
cd studio && git pull --rebase
python3 tools/pp_pack.py clips-export <slug> <folder of trimmed mp4> <folder>/clips.json --max-mb 1900
python3 tools/pp_drive.py put packs/<slug>_clips_*.zip --to <slug>
# only if the images pack is over 90 MB:
python3 tools/pp_drive.py put packs/<slug>_assets.zip --to <slug>
python3 tools/pp_drive.py ls <slug>          # check: every part is listed with its size
cd .. && git add jobs/<slug> jobs/_drive.json && git commit -m "[<slug>] research + assets (footage on Drive)" && git pull --rebase && git push
```

## 3. Shared stock library (add to it as often as you like)
```bash
cd studio && git pull --rebase
python3 tools/pp_drive.py ls _stock          # the last number in use, e.g. stock_library_7.zip
python3 tools/pp_pack.py clips-export stock <folder> <folder>/clips.json --max-mb 1900
# rename the parts, continuing the numbering, and never reuse an old number:
mv packs/stock_clips_1.zip packs/stock_library_8.zip    # (and _2 → 9, …)
python3 tools/pp_drive.py put packs/stock_library_8.zip --to _stock
python3 tools/pp_stock.py index              # check: the clip count went up, "(… on Drive)"
cd .. && git add jobs/_drive.json && git commit -m "stock library: +<n> clips (Drive)" --allow-empty && git pull --rebase && git push
```
- **Clip ids:** `stock_<category>_<what>_<nn>`.
- **Every clip** needs `desc`, `tags`, `author`, `source`, `source_url` and `license`: no author, no entry.
- **Each clip** is 2–8 s, H.264, no audio, 1280–1920 px wide.
- **Zip size:** each zip ≤ 1.9 GB (`--max-mb 1900`). Smaller zips upload and resume more easily.

## 4. If something goes wrong
- An upload breaks off: run the same `put` again. It resumes, and skips any file already on Drive with the same content.
- A file with the same name but new content replaces the old one. So **never reuse a stock_library number**: the old
  clips would vanish.
- `Drive login failed`: the refresh token expired. Tell the owner to redo step 2 of `jobs/DRIVE_SETUP.md`.

## 5. Report to the owner (in Vietnamese, as always)
- The slug.
- Images (real / AI).
- Clips, with the number of parts and the total size on Drive.
- The 5 most surprising facts, and the risks.
- For a stock update: how many clips were added, the total now in the library, and the topics they cover.
