# Install the Poison Pill add-on (v5) into the engine (Vietadvisor Motion Studio, or the fork local-empire-files-studio)

1. **Copy the files:**
   ```bash
   cp engine-addon/engine/library/pp_*.js  <engine>/engine/library/
   cp engine-addon/tools/pp_*              <engine>/tools/
   cp engine-addon/tools/render.mjs engine-addon/tools/make.mjs engine-addon/tools/voice.py <engine>/tools/   # renderer + word-level voice timing
   ```
2. **Register them LAST, in this order,** in `<engine>/engine/library/index.js`. `three.min` must already be in the list,
   before these:
   ```js
   window.LIBRARY = [ …existing…, 'pp_cine', 'pp_looks', 'pp_world', 'pp_cine2', 'pp_cine3', 'pp_cam', 'pp_sets', 'pp_3d', 'pp_modes', 'pp_modes2', 'pp_modes3', 'pp_fun', 'pp_art'];
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
   node tools/pp_sheet.mjs stories/fast_demo.story      # v4.2: 19 fast modes
   node tools/pp_sheet.mjs stories/fun_demo.story       # v4.2: comedy tools
   node tools/pp_looksheet.mjs stories/looks_demo.story # v4.2: the same beats in all 11 looks → out/pp_looks.jpg
   node tools/pp_speed.mjs stories/fast_demo.story      # ms per frame per beat
   node tools/pp_sheet.mjs stories/scene_demo.story     # v5: living pictures + atmosphere
   node tools/make.mjs stories/v5_demo.story --fmt 16x9 --jobs 2   # v5: full voiced demo (word-synced)
   ```
6. **Start a new episode:** `node tools/pp_new.mjs <slug> "<Subject>" --archetype rise-fall --min 10`, then follow SKILL.md.

Tested on the base engine with Node 22, Playwright Chromium (SwiftShader WebGL) and Python 3.13. The tests covered
`pp_doctor` ALL PASS, every demo sheet, lint and autodirect, and a full `make.mjs` run with voice. 3D shots render at
0.62× and 15 fps and are upscaled. On a fast machine, set `window.PP3D_SCALE = 1` and `window.PP3D_FPS = 30` for full
quality. On a weak machine, pass `--lite` (see `references/production.md` §7).

**Fork note (local-empire-files-studio):** if the fork renamed `SB.recipes`, `timeCaps`, `renderEpisode` or `_starts`,
`pp_doctor` fails on "engine loads the add-on" or "renders". See `references/engine-fixes.md`.
