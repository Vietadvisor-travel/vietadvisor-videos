# Install the Poison Pill add-on (v3) into the engine (Vietadvisor Motion Studio or the fork local-empire-files-studio)
1. Copy:
   cp engine/library/{pp_cine.js,pp_world.js,pp_cine2.js,pp_cine3.js}  <engine>/engine/library/
   cp tools/*  <engine>/tools/
2. Register LAST, in this order, in <engine>/engine/library/index.js:
   window.LIBRARY = [ …existing…, 'pp_cine', 'pp_world', 'pp_cine2', 'pp_cine3'];
3. Rebuild the image bundle (fixes images rendering as text):   python3 tools/pp_img.py sync
4. Smoke test (both must pass):
   cp <skill>/examples/*.story stories/
   python3 tools/pp_img.py check stories/quibi_cinematic.story    # import the listed ids first (role cut/plate/prop)
   node tools/pp_lint.mjs stories/quibi_cinematic.story           # 0 errors, DIRECTOR SCORE ≥ 9
   node tools/pp_review.mjs stories/v2_devices.story              # look at the sheets
5. New episode:  node tools/pp_new.mjs <slug> "<Subject>" --archetype rise-fall --min 10
Tested on the base engine (Node 22, Playwright Chromium 1194): lint, review sheets, thumbnail, silent 1080p render OK.
