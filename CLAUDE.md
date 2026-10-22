# Poison Pill: Claude makes the film, Muse only researches and sources

**Split of work:**
- **Muse** (internet, image generation): deep research plus all source material for one episode. It pushes these to
  `jobs/<slug>/` in this repo:
  - `RESEARCH_<slug>.md`: the story-mining worksheet, sections A–M;
  - `<slug>_assets.zip`: real photos (already cut out), AI fills for gaps only, a catalogue of what each image shows, and
    credits;
  - once only: `jobs/_music/music_library_*.zip` (MP3, split into parts of ≤ 90 MB; `setup.sh` imports them).
- **Claude Code** (you, in this repo): everything else. Direction, script, storyboard, custom scenes, voice, render,
  critic. The owner sends a single line.

The rulebook is `poison-pill-studio/` (SKILL.md and references/). The engine with the v6 add-on installed is `studio/`.

## When the owner writes "làm tập <slug>" (or "làm tập: <topic>")
1. **Set up:**
   - `git pull`, then `bash studio/setup.sh` (about 1–2 min the first time in a session; it must end with ALL PASS).
   - The voice model download needs github.com and the npm/pip registries.
2. **Load the sources:**
   - Run `cd studio && python3 tools/pp_pack.py import ../jobs/<slug>/<slug>_assets.zip`.
   - Read `jobs/<slug>/RESEARCH_<slug>.md` and the printed image catalogue (also saved as
     `studio/research/<slug>_catalog.md`).
   - **Use only catalogue ids.** Where no image exists, invent the picture with `build` or a custom scene. Never draw a
     real person.
3. **Direct:**
   - Write the director package exactly as `poison-pill-studio/references/director-package.md` defines, built on the
     research: angle (anti-Wikipedia test), format (not the last one), value rubric ≥ 15/20, thesis, reveal ladder,
     A/V script with hit words, voice cast (`voice-direction.md`), 3–6 custom scenes (`custom-scenes.md`), ≥ 25 % build.
   - Check history first: `cd studio && node tools/pp_history.mjs show`.
   - Save it as `jobs/<slug>/EPISODE_<slug>.md`.
4. **Build:**
   - Write `studio/stories/<slug>-a0.story … -aN.story`.
   - Run `node tools/pp_scriptlint.mjs` (≥ 8.5) and `node tools/pp_lint.mjs` on each act: 0 errors and ≥ 9.0.
   - Run `node tools/pp_sheet.mjs` on each act.
5. **Critic (a fresh agent, never the builder):**
   - Spawn a separate agent with the WOW gate from `references/gauntlet.md` on the sheets.
   - Redesign every beat it scores ≤ 3/8. At most 3 rounds.
6. **Render:**
   - Run `node tools/make.mjs stories/<slug>-aN.story --fmt 16x9 --jobs <cores>` per act, in the background. Use
     `--resume` after any interruption.
   - Join the acts into `out/<slug>_16x9_FINAL.mp4`, with loudness per make.mjs.
7. **Deliver:**
   - Send the owner the final MP4, 10 stills, the thumbnail, 3 titles, the description (with credits from
     `out/*_credits.txt` and `pp_music.py credits`), and the SEO block from the package.
   - Commit the stories, `studio/history.json` and `jobs/<slug>/EPISODE_<slug>.md`, then push. Never commit MP4s
     (GitHub's limit is 100 MB).
   - Report honestly: what was checked, what is uncertain, and the critic scores.

**Missing sources:** if `jobs/<slug>/` has no research or no pack, say so and stop. Tell the owner the exact sentence
to send Muse: `nghiên cứu và đóng gói: <topic>`.

## Rules that never change
- 16:9 only. No cartoon characters or mascots. Real images first. AI images only for plates, environments, props and
  textures, never for real people, documents, logos or events.
- Every number in the script must appear in the research with a source. Otherwise cut it or mark it in the report.
- Quote voices only for verbatim, sourced quotes, attributed on screen.
