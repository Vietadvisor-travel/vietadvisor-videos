# Poison Pill: Claude makes the film, Muse only researches and sources

**Split of work:**
- **Muse** (internet, image generation): deep research plus all source material for one episode. It pushes these to
  `jobs/<slug>/` in this repo:
  - `RESEARCH_<slug>.md`: the story-mining worksheet, sections A–M;
  - `<slug>_assets.zip`: real photos (already cut out), AI fills for gaps only, a catalogue of what each image shows, and
    credits;
  - `<slug>_clips_1.zip`, `_2.zip` … (v6.2): lots of stock and archival footage (MP4, 2–8 s, with author + licence),
    **uploaded to Google Drive `<slug>/`, never to git** (v6.4, `jobs/MUSE_DRIVE.md`);
  - once only: `jobs/_music/music_library_*.zip` (MP3, split into parts of ≤ 90 MB; `setup.sh` imports them).
  - **the shared stock library** (v6.2, grows over time): Google Drive `_stock/stock_library_*.zip` (v6.4). Generic footage for every
    episode: action, mood, texture, places, objects. Ids start with `stock_`. `setup.sh` indexes it into
    `studio/research/stock_catalog.md`.
- **Claude Code** (you, in this repo): everything else. Direction, script, storyboard, custom scenes, voice, render,
  critic. The owner sends a single line.

The rulebook is `poison-pill-studio/` (SKILL.md and references/). The engine with the v6 add-on installed is `studio/`.

## ONE COMMAND → THE FINAL RESULT (the owner, 28 Oct 2026; applies in this chat and every new chat)
The owner is not available to check in. When he asks for an episode (or any job), run it **end to end, without
stopping, until the final deliverables of step 7 exist** (final MP4 on Drive, SRT, upload guide, everything committed
and pushed).
- Never end a turn with the work half done: no "next I will…", no progress report that waits for a reply, no
  question he has to answer. Make every judgement call yourself and write it in the final report.
- Long renders: run them in the background and keep working (cards, critic, publish files) meanwhile; when you must
  wait, wait inside the turn (a background wait loop that notifies you), then continue at once.
- Lint, layout, critic or motion failures are fixed by you and re-run, not reported and left.
- The only reasons to stop early are hard blockers he alone can fix (missing research/pack, Drive not configured,
  credentials). Then say exactly what is missing in one message.
- Talk to him only twice: one line when you start, and the final report (what was delivered, the links, critic
  scores, what is uncertain).

## When the owner writes "làm tập <slug>" (or "làm tập: <topic>")
1. **Set up:**
   - `git pull`, then `bash studio/setup.sh` (about 1–2 min the first time in a session; it must end with ALL PASS).
   - The voice model download needs github.com and the npm/pip registries.
2. **Load the sources:**
   - **Big media lives on Google Drive (v6.4, `jobs/DRIVE_SETUP.md`):** the episode's clips packs are in Drive
     `<slug>/`, the shared stock library in Drive `_stock/`; git holds only text, small packs and `jobs/_drive.json`.
     `python3 tools/pp_drive.py check` shows what is there (needs `GDRIVE_*` in the environment).
   - Run `cd studio && python3 tools/pp_pack.py import ../jobs/<slug>/<slug>_assets.zip "drive:<slug>/<slug>_clips_*.zip"`
     (zips read over the network, no full download; local `../jobs/<slug>/<slug>_clips_*.zip` still work; if the assets
     pack is on Drive use `drive:<slug>/<slug>_assets.zip`).
   - If Drive is not configured or a pack is missing, say exactly which, and stop: tell the owner `jobs/DRIVE_SETUP.md`.
   - Read `jobs/<slug>/RESEARCH_<slug>.md`, the printed catalogue of the episode's images and clips (also saved as
     `studio/research/<slug>_catalog.md`), and the shared library catalogue `studio/research/stock_catalog.md`.
   - **Two footage sources, used together:**
     - the episode's own clips for named people, places and events;
     - the shared library for generic action, mood and texture.
     - `python3 tools/pp_stock.py find <words>` finds library clips for a beat. When a beat needs a generic shot the
       library lacks, log it: `python3 tools/pp_stock.py want "<the shot>" --slug <slug>`, then commit
       `jobs/STOCK_WISHLIST.md` (Muse fills it first).
     - Avoid library clips used in the last 3 episodes (the catalogue's "used in" column), except for the declared
       motif.
   - **Use only catalogue ids.** Where no image exists, use AI moment art from the pack, or a custom scene over a picture. Never draw a
     real person.
3. **Direct (v6.3: no quotas; creativity comes second by second from the content):**
   - Check history first: `cd studio && node tools/pp_history.mjs show` (and the last 3 lessons in `jobs/nhat-ky.md`).
   - **Content, SEO and emotion, in parallel with the picture** (`poison-pill-studio/references/content-and-audience.md`):
     - keyword and competitor research BEFORE the angle (Semrush/Ubersuggest connector if present, else autocomplete via
       web search);
     - "Everyone says X. The real story is Y.";
     - 3 titles BEFORE the script (no thumbnail work at all: the owner makes thumbnails himself);
     - a script that works with the screen off (listen-only test);
     - the channel's own character (`jobs/channel.md`);
     - narrator voice: always `voice: supertonic:M1` (the owner's default); other voices only cast inside the film for
       verbatim quotes, documents or witnesses (`voice-direction.md`);
     - an emotional arc per act, voiced with `{excited}` `{urgent}` `{tense}` `{grave}` `{sad}` `{warm}` `{wry}` `{awe}`.
   - Write the director package exactly as `poison-pill-studio/references/director-package.md` defines, built on the
     research:
     - angle (anti-Wikipedia test), format (not the last one), value rubric ≥ 15/20, thesis, reveal ladder;
     - A/V script with hit words;
     - voice cast (`voice-direction.md`).
   - **The picture: write every second first** (`poison-pill-studio/references/scene-script.md`):
     - three storylines (world · device · form), choose one;
     - then a **SCENE CARD for every sentence**: MEANS · SEE · WORLD · SECONDS (a timed line for each change, caused by
       a word or the previous motion) · LAYERS · CAMERA · MOTION · SEAM in/out · SOUND · TEXT · EFFECT;
     - pictures in this order:
       - real footage of the thing named (the episode's clips);
       - the shared stock library as a material (masked, split, ramped, frozen, match-cut; `pp_stock.py find`; avoid
         clips used in the last 3 episodes except the motif);
       - real photos in depth;
       - AI moment art (never a real person);
       - drawn graphics on a real picture.
     - Type is never the picture.
   - **Effects:**
     - Before inventing: `cd studio && node tools/pp_fx.mjs list <words>`.
     - Each card says REUSE @name / ADAPT @name → new / NEW name.
     - Every act adds at least one NEW effect, built generic (content in params).
   - **Motion like a film** (`poison-pill-studio/references/motion-doctrine.md`):
     - seams cut mid-motion along one current;
     - carriers across cuts;
     - no fades, no idle wobble;
     - stillness before the climax;
     - titles land and stay still.
   - Hard rules from `final-cut.md` §B (clean frame) stay.
   - Save it as `jobs/<slug>/EPISODE_<slug>.md`.
   - **Shot list (v6.6, `scene-script.md` §3b):** write `jobs/<slug>/SHOTLIST_<slug>.md`, one row per sentence: the
     literal picture it needs (footage / photo / document / screenshot / AI part), the catalogue id if it exists, else
     NEED. Commit and push it. If more than 15 % of the rows are NEED, stop and tell the owner the line for Muse:
     `bổ sung shotlist <slug>`; when round 2 lands, import it
     (`python3 tools/pp_pack.py import ../jobs/<slug>/<slug>_assets_2.zip "drive:<slug>/<slug>_clips_2*.zip"`) and go on.
   - **Pre-flight on every card before building (v6.7, the owner 28 Oct 2026: faster, still striking).** These are the
     faults the critic punished on LEGO; fix them on paper, not after renders:
     - every count / typed text / number is keyed to an EARLY word and is final by 50 % of its beat (never the hit
       word at the end of the line); no false in-between value on a paused frame;
     - no generic stock where a named thing exists in the pack; no wrong-period picture; no plate used twice (except
       the motif and a declared bookend);
     - every held card (document, chart, desk) has a real camera travel or acted object for its whole length (a slow
       5 % zoom on a dark plate still counts as "still"); no card longer than 4 s without a change;
     - type ≥ 40 px at 1080p (sources ≥ 36 px), never on busy body text, never colliding with type inside the image;
     - the motif beat must SHOW its word, not just drop an object with a label.
4. **Build:**
   - Write `studio/stories/<slug>-a0.story … -aN.story`.
   - Run `python3 tools/pp_stock.py pull <slug> stories/<slug>-a*.story`. It extracts only the library clips the
     stories use and records them as used. Run it again after every story edit that adds a `stock_` clip.
   - Run `node tools/pp_scriptlint.mjs` (≥ 8.5) and `node tools/pp_lint.mjs` on each act: 0 errors and ≥ 9.0.
   - Run **`node tools/pp_layout.mjs` on each act: 0 flags** (type outside the safe area or colliding). Never render
     with a flag.
   - Run `node tools/pp_sheet.mjs` on each act.
   - **Save every NEW effect to the library:**
     `node tools/pp_fx.mjs save stories/<slug>-aN.story <scene> --does "<what the viewer sees>" --tags … --born "<slug aN-bM: sentence>"`.
     Commit `studio/effects/` and `studio/engine/library/effects.js`.
5. **Critic (a fresh agent, never the builder) — on the sheets, no draft renders (v6.7):**
   - The sheets are the engine's own pixels at 0/42/72/96 % of every beat, so they replace `--lite` draft renders
     (a lite pass of 7 acts cost ~70 min per round on LEGO). Do NOT make lite renders.
   - Spawn ONE critic agent for the whole film (all sheets at once, in the background) with the WOW gate from
     `references/gauntlet.md`, the swap test (final-cut.md §6), the SECONDS / swap / pause tests (§C) and the
     listen-only test on one act's VO text (`content-and-audience.md` §2). It must OPEN the sheet images.
   - While it works, write the parts of the upload guide that do not depend on timings (titles, sources, tags, fields).
   - Redesign every beat it scores ≤ 3/8 or that fails swap; re-sheet only the acts you changed. **At most 2 rounds.**
   - The ship gate: ≥ 85 % of beats ≥ 5/8 and ≥ 90 % swap PASS. If 2 rounds don't reach it, ship and say so with the
     scores.
6. **Render:**
   - Run `node tools/make.mjs stories/<slug>-aN.story --fmt 16x9 --jobs <cores>` per act, in the background. Use
     `--resume` after any interruption.
   - Render all acts in ONE background chain that touches a marker file when done; wait on the marker (never on
     `pgrep` of a pattern that also matches the waiting command).
   - Run `python3 tools/pp_motion.py <slug>` on the final acts; if a beat fails, fix it and re-render only that act.
   - Join the acts into `out/<slug>_16x9_FINAL.mp4`: concat (stream copy), measure loudness once, then gain +
     `alimiter` to −14 LUFS / ≤ −1.5 dBTP (audio re-encoded only, video copied).
   - No compressed/delivery encode, no stills, no thumbnail (the owner, 28 Oct 2026).
7. **Deliver:**
   - Run `python3 tools/pp_publish.py <slug>`. It writes `out/<slug>_FULL.srt` (YouTube subtitles, joined and re-cut)
     and `out/<slug>_publish_facts.json` (chapters, credits, AI images, voices, CC BY items missing an author).
   - Write `jobs/<slug>/UPLOAD_GUIDE_<slug>.txt` exactly as `poison-pill-studio/references/publish.md` §3 defines:
     titles, description with chapters, sources and every credit, tags, Studio fields, the altered-content decision
     with its reason, end screen and cards, pinned comment, and the 48-hour checklist.
   - Copy the SRT to `jobs/<slug>/`.
   - **Upload the full master to Drive by default** (the owner, 27 Oct 2026):
     `python3 tools/pp_drive.py put out/<slug>_16x9_FINAL.mp4 --to <slug>`. This is the file to put on YouTube.
   - Send the owner: the SRT and the upload guide (the MP4 is on Drive; no copy, no stills, no thumbnail).
   - Commit the stories, `studio/history.json`, `jobs/<slug>/EPISODE_<slug>.md`, the SRT and the upload guide, then
     push.
   - Never commit MP4s or clips/stock zips (GitHub's limit is 100 MB; big media goes to Drive), and never commit the imported library (`studio/engine/library/img/`,
     `images.json`, `images.js`); it is rebuilt from the packs in every session.
   - Report honestly: what was checked, what is uncertain, and the critic scores.

## When the owner writes "kiểm tra drive"
This means the **media Drive used by the studio**, not a browse with the Google Drive connector. Run:
```bash
env | grep -o '^GDRIVE_[A-Z_]*' ; ls ~/.config/poisonpill/drive.env 2>/dev/null   # names only, never print the values
cd studio && python3 tools/pp_drive.py check && python3 tools/pp_drive.py ls && python3 tools/pp_stock.py index
```
- Report: whether the credentials are present, whether login works, the folder id, the files with their sizes, and the
  number of stock clips indexed.
- If the credentials are missing: say which variable is missing and point to `jobs/DRIVE_SETUP.md` step 3. The
  variables only reach a session opened after they were saved.
- If there is no folder yet (`jobs/_drive.json` missing): run `python3 tools/pp_drive.py selftest`. It creates
  `PoisonPill_Media/_stock`, writes `jobs/_drive.json`, and proves upload, list, range read and delete with a tiny
  file it then removes. Commit and push `jobs/_drive.json` so Muse uploads into the same folder.
- Never point `GDRIVE_FOLDER` at a folder the owner made by hand: the `drive.file` scope cannot see it.

**Missing sources:** if `jobs/<slug>/` has no research or no pack, say so and stop. Tell the owner the exact sentence
to send Muse: `nghiên cứu và đóng gói: <topic>`.

## Rules that never change
- **THE FIRST RULE (the owner, 24 Oct 2026): the picture comes from the sentence, never from the effects menu.** Each
  sentence or scene gets the treatment its own content asks for, chosen for it. **Never repeat a device in one video:**
  each effect/composition at most 2 times per film; only the declared motif (`motif:` in the act header) may return,
  once per act at most. `pp_motion.py` fails the film otherwise.
- 16:9 only. No cartoon characters or mascots. Real footage and real images first. AI images only for plates, environments, props and
  textures, never for real people, documents, logos or events.
- Every number in the script must appear in the research with a source. Otherwise cut it or mark it in the report.
- Quote voices only for verbatim, sourced quotes, attributed on screen.
- No burned-in captions. YouTube gets the `.srt`; the picture keeps the bottom 12 % free.
- No layout flags (`pp_layout.mjs`): nothing outside the safe area, and no type colliding with type.
- Every on-screen number shows its final, correct value for at least the last half of its beat.
