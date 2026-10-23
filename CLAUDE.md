# Poison Pill: Claude makes the film, Muse only researches and sources

**Split of work:**
- **Muse** (internet, image generation): deep research plus all source material for one episode. It pushes these to
  `jobs/<slug>/` in this repo:
  - `RESEARCH_<slug>.md`: the story-mining worksheet, sections A–M;
  - `<slug>_assets.zip`: real photos (already cut out), AI fills for gaps only, a catalogue of what each image shows, and
    credits;
  - `<slug>_clips_1.zip`, `_2.zip` … (v6.2): lots of stock and archival footage (MP4, 2–8 s, with author + licence);
    footage now leads the film;
  - once only: `jobs/_music/music_library_*.zip` (MP3, split into parts of ≤ 90 MB; `setup.sh` imports them).
- **Claude Code** (you, in this repo): everything else. Direction, script, storyboard, custom scenes, voice, render,
  critic. The owner sends a single line.

The rulebook is `poison-pill-studio/` (SKILL.md and references/). The engine with the v6 add-on installed is `studio/`.

## When the owner writes "làm tập <slug>" (or "làm tập: <topic>")
1. **Set up:**
   - `git pull`, then `bash studio/setup.sh` (about 1–2 min the first time in a session; it must end with ALL PASS).
   - The voice model download needs github.com and the npm/pip registries.
2. **Load the sources:**
   - Run `cd studio && python3 tools/pp_pack.py import ../jobs/<slug>/<slug>_assets.zip ../jobs/<slug>/<slug>_clips_*.zip`
     (clips stream from disk; any number is fine).
   - Read `jobs/<slug>/RESEARCH_<slug>.md` and the printed image catalogue (also saved as
     `studio/research/<slug>_catalog.md`).
   - **Use only catalogue ids.** Where no image exists, use AI moment art from the pack, or a custom scene over a picture. Never draw a
     real person.
3. **Direct:**
   - Write the director package exactly as `poison-pill-studio/references/director-package.md` defines, built on the
     research: angle (anti-Wikipedia test), format (not the last one), value rubric ≥ 15/20, thesis, reveal ladder,
     A/V script with hit words, voice cast (`voice-direction.md`), 8–14 custom-scene beats built on footage or photos (`custom-scenes.md`),
     invented beats ≥ 50 %.
   - Check history first: `cd studio && node tools/pp_history.mjs show`.
   - **Follow `poison-pill-studio/references/final-cut.md`, starting with v6.2 (§A–D, it overrides the older shares):**
     - **creativity first:**
       - one visual concept per episode, never used by another channel for this story;
       - 3 picture ideas for every key beat, choosing the least expected;
       - one footage-led hero sequence of 8–20 s per act;
       - ≥ 3 montage runs;
     - **footage leads:**
       - ≥ 45 % of beats on moving footage;
       - footage composed as layers: masks, split screens, screen inserts, match cuts (custom scenes have `clip()`);
       - AI art ≤ 20 %;
       - drawn-only ≤ 8 %;
       - no text-only frames;
       - 3D at most 0–2 shots;
     - **a clean frame:**
       - no burned-in captions (`captions: off` in every act header);
       - 5 % safe area, nothing in the bottom 12 %;
       - type ≥ 40 px;
       - camera end zoom ≤ 1.12 on beats with type;
       - counters and type finished by 50 % of the beat;
       - every plate or clip used once (except the declared motif);
     - fill the BEAT TABLE, with the swap test, for every sentence, and stay on the content (§2b);
     - vary the rhythm (punches, montage runs, breaths), and use one motif per episode;
     - write custom scenes built ON images, with spring and stagger motion.
   - Save it as `jobs/<slug>/EPISODE_<slug>.md`.
4. **Build:**
   - Write `studio/stories/<slug>-a0.story … -aN.story`.
   - Run `node tools/pp_scriptlint.mjs` (≥ 8.5) and `node tools/pp_lint.mjs` on each act: 0 errors and ≥ 9.0.
   - Run **`node tools/pp_layout.mjs` on each act: 0 flags** (type outside the safe area or colliding). Never render
     with a flag.
   - Run `node tools/pp_sheet.mjs` on each act.
5. **Critic (a fresh agent, never the builder):**
   - Spawn a separate agent with the WOW gate from `references/gauntlet.md` plus the swap test (final-cut.md §6). It
     must OPEN the sheet images and judge the pixels.
   - Redesign every beat it scores ≤ 3/8 or that fails the swap test. At most 3 rounds.
   - Then a `--lite` draft render of every act, and a critic round on 1 frame per beat taken from the real video
     (at 75 % of each beat).
   - The ship gate: ≥ 85 % of beats ≥ 5/8 and ≥ 90 % swap PASS. If 3 rounds don't reach it, say so with the scores.
6. **Render:**
   - Run `node tools/make.mjs stories/<slug>-aN.story --fmt 16x9 --jobs <cores>` per act, in the background. Use
     `--resume` after any interruption.
   - Join the acts into `out/<slug>_16x9_FINAL.mp4`: concat, then two-pass loudnorm to −14 LUFS / −1.5 dBTP.
   - Make a delivery encode of about 5 Mbps (≈ 400 MB for 10 min); keep the CRF-20 master.
7. **Deliver:**
   - Run `python3 tools/pp_publish.py <slug>`. It writes `out/<slug>_FULL.srt` (YouTube subtitles, joined and re-cut)
     and `out/<slug>_publish_facts.json` (chapters, credits, AI images, voices, CC BY items missing an author).
   - Write `jobs/<slug>/UPLOAD_GUIDE_<slug>.txt` exactly as `poison-pill-studio/references/publish.md` §3 defines:
     titles, description with chapters, sources and every credit, tags, Studio fields, the altered-content decision
     with its reason, end screen and cards, pinned comment, and the 48-hour checklist.
   - Copy the SRT and the thumbnail(s) to `jobs/<slug>/`.
   - Send the owner: the final MP4, the SRT, the upload guide, the thumbnail(s) and 10 stills.
   - Commit the stories, `studio/history.json`, `jobs/<slug>/EPISODE_<slug>.md`, the SRT, the upload guide and the
     thumbnail(s), then push.
   - Never commit MP4s (GitHub's limit is 100 MB), and never commit the imported library (`studio/engine/library/img/`,
     `images.json`, `images.js`); it is rebuilt from the packs in every session.
   - Report honestly: what was checked, what is uncertain, and the critic scores.

**Missing sources:** if `jobs/<slug>/` has no research or no pack, say so and stop. Tell the owner the exact sentence
to send Muse: `nghiên cứu và đóng gói: <topic>`.

## Rules that never change
- 16:9 only. No cartoon characters or mascots. Real footage and real images first. AI images only for plates, environments, props and
  textures, never for real people, documents, logos or events.
- Every number in the script must appear in the research with a source. Otherwise cut it or mark it in the report.
- Quote voices only for verbatim, sourced quotes, attributed on screen.
- No burned-in captions. YouTube gets the `.srt`; the picture keeps the bottom 12 % free.
- No layout flags (`pp_layout.mjs`): nothing outside the safe area, and no type colliding with type.
- Every on-screen number shows its final, correct value for at least the last half of its beat.
