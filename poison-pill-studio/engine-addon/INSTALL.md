# Install the Poison Pill add-on (v4) into the engine (Vietadvisor Motion Studio, or the fork local-empire-files-studio)

1. **Copy the files:**
   ```bash
   cp engine-addon/engine/library/pp_*.js  <engine>/engine/library/
   cp engine-addon/tools/pp_*              <engine>/tools/
   ```
2. **Register them LAST, in this order,** in `<engine>/engine/library/index.js`. `three.min` must already be in the list,
   before these:
   ```js
   window.LIBRARY = [ …existing…, 'pp_cine', 'pp_world', 'pp_cine2', 'pp_cine3', 'pp_cam', 'pp_sets', 'pp_3d', 'pp_modes', 'pp_modes2'];
   ```
3. **Install dependencies and rebuild the image bundle:**
   ```bash
   cd <engine> && npm install --no-audit --no-fund && pip install numpy scipy pillow rembg && python3 tools/pp_img.py sync
   ```
4. **Prove it.** Fix every FAIL before anything else, then look at the picture it writes.
   ```bash
   node tools/pp_doctor.mjs        # ALL PASS + out/pp_doctor.jpg (collage+camera · set piece · screen mode · 3D globe)
   ```
5. **Run the smoke tests** (examples use the test ids `t_*`; without those images you'll see PHOTO NEEDED cards, which is
   fine for a smoke test):
   ```bash
   pip install scikit-image && python3 tools/pp_testimages.py   # imports the public-domain test photos t_* (optional)
   cp <skill>/examples/*.story stories/
   node tools/pp_sheet.mjs stories/sets_demo.story      # 12 set pieces
   node tools/pp_sheet.mjs stories/modes_demo.story     # screen modes
   node tools/pp_sheet.mjs stories/modes2_demo.story    # diagrams + metaphors batch 2
   node tools/pp_sheet.mjs stories/3d_demo.story        # 3D shots (WebGL)
   node tools/pp_sheet.mjs stories/3d2_demo.story       # 3D batch 2
   node tools/pp_sheet.mjs stories/map3d_demo.story     # the map table
   ```
6. **Start a new episode:** `node tools/pp_new.mjs <slug> "<Subject>" --archetype rise-fall --min 10`, then follow SKILL.md.

Tested on the base engine with Node 22, Playwright Chromium (SwiftShader WebGL) and Python 3.13. The tests covered
`pp_doctor` ALL PASS, every demo sheet, lint and autodirect. 3D shots render at 0.7× and are upscaled (set
`window.PP3D_SCALE = 1` for a final at full resolution if your machine is fast).

**Fork note (local-empire-files-studio):** if the fork renamed `SB.recipes`, `timeCaps`, `renderEpisode` or `_starts`,
`pp_doctor` fails on "engine loads the add-on" or "renders". See `references/engine-fixes.md`.
