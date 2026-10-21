# Poison Pill Studio: changelog

## v4.2 (Oct 2026): the look follows the content, a funnier tone, fast rendering
- **11 looks chosen by the content** (`pp_looks.js`, `look.md`):
  - dossier, noir, editorial, tech, luxury, vintage, retro, broadcast, eastern, ledger, blueprint;
  - per episode (`look:`), per act file, or per beat (`look=`);
  - each sets the backdrops, photo treatment, accent palette, act grades, vignette, map colours, the ink and card colours
    of every set piece and mode, and the 3D world light;
  - `pp_looksheet` compares looks side by side.
- **19 FAST modes** (`pp_modes3.js`, 40–110 ms a frame): isocity, isobars, coverflow, spinpaper, spotlight, units, tank,
  race, rollnum, faceoff, invoice, candles, vault, slots, outbreak, meter, calendar, papercut, flapboard.
- **Tone playful** (`humor.md`, `pp_fun.js`):
  - 10 comedy techniques for explainers;
  - photo-based comedy tools: freeze, expect, cutaway, dramatic, math, meme, aside, with caps checked by lint;
  - cartoon characters are forbidden by lint (owner rule).
- **Render speed on weak machines:**
  - the post pass is off by default;
  - frame reuse on still frames;
  - fast depth-of-field blur;
  - the world map is cached;
  - 3D at 15 fps and 0.62× (`--lite`: 12 fps and 0.5×);
  - chunked rendering on a shared queue (`--jobs`), resumable after a crash or reboot (`--resume`);
  - a watchdog per frame, `progress.json`, x264 veryfast;
  - `pp_speed` estimates render time per beat.
- **Lint and auto-director:**
  - know all 70 scene types;
  - prefer fast modes;
  - cap real 3D at 20 % (auto-director `--fast` uses none);
  - validate look names;
  - add the `depth` family.
- **Docs:**
  - new: `humor.md`, `production.md` §7;
  - rewritten: `look.md`;
  - updated: `visual-modes.md` (fast and comedy sections, decision table), `director-package.md` (look, tone, 3D cap,
    render rules), START.md, SKILL.md, INSTALL.


## v4 (Oct 2026): ideas, not collage
- **The dossier look** is the default: manila, kraft, newsprint, graph paper, warm archive prints, ink type. `look: noir` keeps the v3
  dark style. **16:9 only.**
- **Camera rig** (`pp_cam.js`): `shot=` keyframes with shot sizes framed on a subject, moves on spoken words (dolly, glide, whip,
  crash, rack, vertigo, truck, drop, rise), true per-plane parallax, dutch, low/high angle, rack focus, motion blur, handheld.
- **46 scene types in 5 families:**
  - 17 set pieces (`pp_sets.js`, `pp_modes2.js`);
  - 14 screen and diagram modes (`pp_modes.js`, `pp_modes2.js`);
  - 15 real-3D shots (`pp_3d.js`: desk, map table, globe, gallery, timeline, skyline, title, money, phone, boardroom,
    building, conveyor, pie, stacks, monitors);
  - collage;
  - maps (now in paper).
- **Tools:**
  - `pp_doctor`: proves the install and renders every family.
  - `pp_scriptlint`: script score.
  - `pp_shotscript`: the per-second visual script, with a check.
  - `pp_sheet`: beat contact sheets.
  - `pp_testimages`: imports the public-domain test photos.
- **Auto-director** picks a mode by the meaning of each sentence and won't repeat a mode within 4 beats. It writes `shot=`
  cameras.
- **Lint v4:**
  - scores ideas vs collage, camera direction, restraint (shake/flash/stamp/slam caps) and variety of scene types and
    families;
  - checks set and mode images and words.
- **Docs:**
  - new: `visual-modes.md`, `camera.md`, `shot-script.md`, `look.md`, `gauntlet.md`;
  - rewritten: `script-and-story.md`, `multi-agent.md`, SKILL.md;
  - updated: `toolkit.md`, `quality-rubric.md`, INSTALL.
- **Fixes:**
  - `pp_review` no longer crashes when `out/` doesn't exist;
  - missing images render as neutral PHOTO NEEDED cards;
  - all SFX names are verified.

## v3: 100+ collage devices, 14 tools, 60 recipes, multi-agent pipeline
## v2: maps, footage, evidence devices, scaffold, archetypes
## v1: `# cine` 3-plane beat, real-photo pipeline
