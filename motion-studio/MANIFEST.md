# Vietadvisor Motion Studio — engine v11 (canvas cartoon engine)

Imported 3 Nov 2026 from the Cowork session "Tạo video hoạt hình" (`/home/claude/work/va-studio`), via
`va-studio-v11-engine.zip` (4,525,737 bytes, md5 1bc292d6bdd9386050493a81449896a5, 415 files) placed by the owner in
Google Drive "The If Machine Channel". Excluded at packaging: out/ (8.2 GB renders), node_modules/, mp4/wav, model weights.

This folder is the clean canvas engine used by The If Machine. `../studio/` is the older v10.1 copy that the Poison Pill
add-on modified (pp_* tools, effects, stock library); do not mix the two.

Setup: `npm install` then `python3 tools/voice.py setup` (once per container). Run: `node tools/make.mjs stories/<name>.story`.

Changes after v10.1 (from the Cowork manifest):
- SKILL.md v11: no mascot / no standing cast; bespoke per-content shots with distinct cameras (rule 0)
- engine/library/ep7_hagiang.js: karst parallax, scrolling road, rider, sleeper bus, rental shop, checkpoint, homestay, Ma Pi Leng canyon + fog, running receipt tally
- engine/library/ep8_hoian.js: macro lantern ignition, aerial river map, isometric booth, POV phone + balance scale, water-level release, moonrise, riverfront clock, ticket punch, flood cutaway, turning-lantern save card, aerial bay
- engine/library/toontype.js: tape() honours out=
- engine/library/index.js: registers ep7_hagiang, ep8_hoian
- tools/pron_vi.json: new place-name pronunciations
- stories: ep7-ha-giang-loop(.yt), ep8-hoi-an-lantern-boat(.yt), _close, test-*
