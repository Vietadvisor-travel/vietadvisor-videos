# Poison Pill Studio: changelog

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
