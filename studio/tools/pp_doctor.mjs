// pp_doctor — run FIRST on any machine/agent before making an episode. Proves the add-on is installed, registered in the
// right order, renders every family (collage · set piece · mode · 3D/WebGL · camera rig), the image bundle is in sync,
// every SFX name resolves, and the toolchain exists. Most "the agent made a terrible video" cases fail here.
//   node tools/pp_doctor.mjs            → PASS/FAIL per check, out/pp_doctor.jpg (one frame per family — LOOK at it)
import fs from 'fs'; import { execSync } from 'child_process'; import { launch } from './browser.mjs';
const R = []; const ok = (name, pass, hint = '') => R.push([pass ? 'PASS' : 'FAIL', name, pass ? '' : hint]); const warn = (name, hint) => R.push(['WARN', name, hint]);
const sh = c => { try { return execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim(); } catch (e) { return null; } };
ok('node ≥ 18', +process.versions.node.split('.')[0] >= 18, 'install Node 18+');
ok('ffmpeg', !!sh('ffmpeg -version'), 'install ffmpeg (apt install ffmpeg / brew install ffmpeg)');
ok('python3 + numpy + scipy', sh(`python3 -c "import numpy, scipy; print(1)"`) === '1', 'pip install numpy scipy');
if (sh(`python3 -c "import rembg; print(1)"`) !== '1') warn('rembg (cut-out background removal)', 'pip install rembg — without it role=cut photos keep their background');
const idx = fs.readFileSync('engine/library/index.js', 'utf8'); const ORDER = ['three.min', 'pp_cine', 'pp_looks', 'pp_world', 'pp_cine2', 'pp_cine3', 'pp_cam', 'pp_sets', 'pp_3d', 'pp_modes', 'pp_modes2', 'pp_modes3', 'pp_fun', 'pp_art', 'pp_build', 'pp_custom'];
const pos = ORDER.map(n => idx.indexOf(`'${n}'`)); ok('add-on files exist', ORDER.slice(1).every(n => fs.existsSync(`engine/library/${n}.js`)), 'copy engine-addon/engine/library/*.js into engine/library/');
ok('add-on registered in index.js, in order, LAST', pos.every(p => p >= 0) && pos.every((p, i) => !i || p > pos[i - 1]) && /'pp_custom'\s*\]/.test(idx), `window.LIBRARY must end with: ${ORDER.slice(1).map(n => `'${n}'`).join(', ')}  (three.min before them)`);
const reg = fs.existsSync('engine/library/images.json') ? JSON.parse(fs.readFileSync('engine/library/images.json', 'utf8')) : {}; const js = fs.existsSync('engine/library/images.js') ? fs.readFileSync('engine/library/images.js', 'utf8') : ''; const stale = Object.keys(reg).filter(k => !js.includes(`"${k}":`));
ok(`image bundle in sync (${Object.keys(reg).length} registered)`, !stale.length, `${stale.length} image(s) registered but not embedded (${stale.slice(0, 5).join(', ')}) → python3 tools/pp_img.py sync`);
const sfx = sh(`python3 -c "
import sys,re,glob; sys.path.insert(0,'tools'); import sound_design as sd
n=set()
for f in glob.glob('engine/library/pp_*.js'): n|=set(re.findall(r\\"'((?:foley|impact|whoosh|hit|ui|riser|glitch|trans|battle|cartoon|crowd|amb|nature|magic|vn|food|vehicle)_[a-z0-9_]+)'\\",open(f).read()))
print(','.join(sorted(x for x in n if sd.resolve(x)[0] is None)) or 'OK')"`);
ok('every SFX name resolves', sfx === 'OK', sfx === null ? 'tools/sound_design.py failed to import (python deps?)' : 'unknown: ' + sfx);
// render smoke test: one beat per family, both formats are NOT needed (16:9 only)
const story = `title: doctor\nchannel: poisonpill\nvoice: am_michael\nmusic: none\nendcard: off\n
# cine act=setup shot="ws|mcu:pt:.5,.45@second/dolly" hero="DOCTOR;at:first;pos:c" fx="stamp:OK;at:second;col:gold"
The first check. The second check.\n
# cine act=doubt fx="iceberg:x;tip:TIP;deep:A,B;dive:under;at:c1"
What you see. And what is under.\n
# cine act=doubt fx="browser:x;title:Doctor headline;src:Ledger;scroll:page;at:c1"
The page scrolls to the line.\n
# cine act=rise fx="globe3d:x;pins:-74,40.7,NEW YORK~139.7,35.7,TOKYO;go:tokyo;at:c1"
From New York to Tokyo.\n`;
const browser = await launch(); const page = await browser.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const res = await page.evaluate((txt) => { const out = { libs: {}, frames: [] }; out.libs = { cine: !!window.PPCINE, cam: !!window.PPCAM, sets: !!window.PPSETS, modes: !!window.PPMODES, d3: !!window.PP3D, three: typeof THREE !== 'undefined', world: !!(window.PP_WORLD && window.PP_WORLD.length), looks: !!(window.PPLOOKS && window.PPLOOKS.length >= 11), fast: !!(window.PPCINE && window.PPCINE.EXT.isocity && window.PPCINE.EXT.flapboard), living: !!(window.PPART && window.PPCINE.EXT.scene), build: !!(window.PPBUILD && window.PPCINE.EXT.build), custom: !!(window.PPCINE.CUSTOM && window.PPCINE.EXT.code && window.PPCINE.extractScenes) };
  let gl = false; try { const c = document.createElement('canvas'); gl = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { } out.gl = gl;
  const ep = SB.compile(txt); const c = document.getElementById('c'); c.width = 960; c.height = 540; W = 960; H = 540; ctx = c.getContext('2d'); loadEpisode(ep); out.beats = ep.scenes.length; out.channel = ep.channel;
  const sheet = mkCanvas(960 * 2, 540 * 2), g = sheet.getContext('2d'); ep.scenes.slice(0, 4).forEach((s, i) => { renderEpisode(_starts[i] + s.dur * .75); g.drawImage(c, (i % 2) * 960, Math.floor(i / 2) * 540); const d = ctx.getImageData(0, 0, 960, 540).data; let mn = 255, mx = 0; for (let k = 0; k < d.length; k += 4 * 97) { const L = d[k] * .3 + d[k + 1] * .59 + d[k + 2] * .11; mn = Math.min(mn, L); mx = Math.max(mx, L); } out.frames.push(mx - mn); });
  out.jpg = sheet.toDataURL('image/jpeg', .8); return out; }, story);
fs.mkdirSync('out', { recursive: true }); fs.writeFileSync('out/pp_doctor.jpg', Buffer.from(res.jpg.split(',')[1], 'base64')); await browser.close();
ok('engine loads the add-on (PPCINE, looks, camera, sets, modes, fast modes, 3D, world map)', Object.values(res.libs).every(Boolean), 'missing: ' + Object.entries(res.libs).filter(([, v]) => !v).map(([k]) => k).join(', ') + ' — check index.js order and the console');
ok('channel mode on (header `channel: poisonpill`)', res.channel === 'poisonpill', 'SB.compile did not switch to the channel — is pp_cine.js loaded?');
ok('WebGL available (3D shots)', res.gl, 'Chromium has no WebGL — run with SwiftShader (default in Playwright) or a GPU; 3D shots render black otherwise');
['collage + camera rig', 'set piece', 'screen mode', '3D shot'].forEach((n, i) => ok(`renders: ${n}`, (res.frames[i] || 0) > 40, 'frame is (almost) flat — open out/pp_doctor.jpg and the console errors below'));
ok('no engine errors', !errs.length, errs.slice(0, 4).join(' | '));
const w = Math.max(...R.map(r => r[1].length)); R.forEach(([s, n, h]) => console.log(`${s.padEnd(4)}  ${n.padEnd(w)}  ${h}`)); console.log('\nlook at out/pp_doctor.jpg (4 frames: collage+camera, set piece, screen mode, 3D globe)');
const fails = R.filter(r => r[0] === 'FAIL').length; console.log(fails ? `\n${fails} FAIL — fix before making anything.` : '\nALL PASS — the studio is ready.'); process.exit(fails ? 1 : 0);
