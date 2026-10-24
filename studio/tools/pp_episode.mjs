// One command renders a whole episode and survives crashes, restarts and new sessions (v6.6):
//   node tools/pp_episode.mjs render <slug> [--jobs 3] [--acts 0,2] [--no-drive]   → out/<slug>_16x9_FINAL.mp4 + _DELIVERY.mp4
//   node tools/pp_episode.mjs status <slug>                                          → what is done, what is left
// Run it in the background with nohup; run the SAME command again after anything goes wrong. It never starts over:
//  · an act whose story, effects and images are unchanged since its last good render is skipped (out/<slug>-aN.sig);
//  · inside an act, render.mjs keeps content-addressed chunks, so an edited act re-renders only the edited beats and a
//    crashed act continues from its last chunk; the voice is cached per line (voice.py), so only changed lines are re-voiced;
//  · every finished act master is copied to Drive <slug>/renders/ (when GDRIVE_* is set): a NEW session/container pulls
//    the masters back instead of rendering again;
//  · preflight stops early with a clear message when the disk, /dev/shm or memory cannot hold a render;
//  · each act is retried twice; the log is out/<slug>_episode.log and the state out/<slug>_episode.json.
import { execFileSync, spawnSync } from 'child_process'; import fs from 'fs'; import crypto from 'crypto'; import os from 'os';
const a = process.argv.slice(2), cmd = a[0], slug = a[1], opt = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : undefined; }, has = k => a.includes('--' + k);
if (!cmd || !slug) { console.log(fs.readFileSync(new URL(import.meta.url)).toString().split('\n').slice(0, 11).join('\n')); process.exit(1); }
const LOG = `out/${slug}_episode.log`, STATE = `out/${slug}_episode.json`; fs.mkdirSync('out', { recursive: true });
const log = m => { const l = `[${new Date().toISOString().slice(11, 19)}] ${m}`; console.log(l); fs.appendFileSync(LOG, l + '\n'); };
const H5 = x => crypto.createHash('md5').update(x).digest('hex'), fileH = f => fs.existsSync(f) ? H5(fs.readFileSync(f)) : '';
const acts = fs.readdirSync('stories').filter(f => new RegExp(`^${slug}-a(\\d+)\\.story$`).test(f)).map(f => +f.match(/-a(\d+)\./)[1]).sort((x, y) => x - y)
  .filter(n => !opt('acts') || opt('acts').split(',').map(Number).includes(n));
if (!acts.length) { console.error(`no stories/${slug}-aN.story`); process.exit(1); }
const shared = H5(['engine/library/effects.js', 'engine/library/images.json', 'engine/library/pp_fxkit.js', 'tools/render.mjs', 'tools/sound_design.py'].map(fileH).join('|'));
const sigOf = n => H5(fs.readFileSync(`stories/${slug}-a${n}.story`) + '|' + shared).slice(0, 10);
const master = n => `out/${slug}-a${n}_16x9.mp4`, sigFile = n => `out/${slug}-a${n}.sig`;
const done = n => fs.existsSync(master(n)) && fs.existsSync(sigFile(n)) && fs.readFileSync(sigFile(n), 'utf8') === sigOf(n);
const drive = !has('no-drive') && !!(process.env.GDRIVE_REFRESH_TOKEN || fs.existsSync(os.homedir() + '/.config/poisonpill/drive.env'));
const sh = (c, args, o = {}) => spawnSync(c, args, { encoding: 'utf8', maxBuffer: 1 << 28, ...o });
const state = () => ({ slug, acts: Object.fromEntries(acts.map(n => [n, done(n) ? 'done' : 'todo'])), final: fs.existsSync(`out/${slug}_16x9_FINAL.mp4`), updated: new Date().toISOString() });
if (cmd === 'status') { console.log(JSON.stringify(state(), null, 1)); process.exit(); }
if (cmd !== 'render') { console.error('commands: render | status'); process.exit(1); }

// preflight: the three failures seen on ep. 4 (disk allowance, shared memory, page memory) stop here, not 40 minutes in
const availGB = +sh('df', ['--output=avail', '-B1G', '.']).stdout.trim().split('\n').pop(), shmGB = +sh('df', ['--output=avail', '-B1G', '/dev/shm']).stdout.trim().split('\n').pop();
const memGB = os.freemem() / 1e9; log(`preflight: disk ${availGB} GB free · /dev/shm ${shmGB} GB · RAM ${memGB.toFixed(1)} GB free · drive backup ${drive ? 'on' : 'off'}`);
if (availGB < 6) { log(`STOP: only ${availGB} GB disk left (need ≥ 6). Delete old out/*.mp4 renders, then run the same command.`); process.exit(2); }
if (shmGB < 3) { log(`STOP: /dev/shm has ${shmGB} GB free (need ≥ 3); a stuck Chromium is holding it: pkill -f chrome-linux, then rerun.`); process.exit(2); }
const jobs = opt('jobs') || String(Math.max(1, Math.min(os.cpus().length - 1, Math.floor(memGB / 2.5), 3)));

for (const n of acts) {
  if (done(n)) { log(`a${n}: unchanged since its last render, skipped`); continue; }
  const sg = sigOf(n), dname = `${slug}-a${n}_16x9_${sg}.mp4`;
  if (drive && sh('python3', ['tools/pp_drive.py', 'get', `${slug}/renders/${dname}`, '--to', 'out/_drive']).status === 0 && fs.existsSync(`out/_drive/${slug}/renders/${dname}`)) {
    fs.renameSync(`out/_drive/${slug}/renders/${dname}`, master(n)); fs.writeFileSync(sigFile(n), sg); log(`a${n}: pulled the finished master from Drive`); continue; }
  let ok = false;
  for (let k = 1; k <= 3 && !ok; k++) {
    log(`a${n}: render attempt ${k} (jobs ${jobs})`);
    const r = sh('node', ['tools/make.mjs', `stories/${slug}-a${n}.story`, '--fmt', '16x9', '--jobs', jobs, '--no-deliver'], { stdio: ['ignore', fs.openSync(`out/render_a${n}.log`, 'w'), fs.openSync(`out/render_a${n}.log`, 'a')] });
    ok = r.status === 0 && fs.existsSync(master(n));
    if (!ok) { const tail = fs.readFileSync(`out/render_a${n}.log`, 'utf8').split('\n').filter(l => /Error|ENOSPC|crash|Timeout/i.test(l)).slice(-2).join(' | ');
      log(`a${n}: attempt ${k} failed: ${tail || 'exit ' + r.status}`); sh('pkill', ['-f', 'chrome-linux/chrome']); }
  }
  if (!ok) { log(`a${n}: FAILED 3 times, stopping. Fix the cause and run the same command (finished chunks are kept).`); fs.writeFileSync(STATE, JSON.stringify(state(), null, 1)); process.exit(3); }
  fs.writeFileSync(sigFile(n), sg); log(`a${n}: done`);
  if (drive) { fs.copyFileSync(master(n), `out/${dname}`); const u = sh('python3', ['tools/pp_drive.py', 'put', `out/${dname}`, '--to', `${slug}/renders`]); fs.unlinkSync(`out/${dname}`);
    log(`a${n}: Drive backup ${u.status === 0 ? 'ok' : 'FAILED (render is safe locally): ' + (u.stderr || '').split('\n').filter(Boolean).pop()}`); }
  fs.writeFileSync(STATE, JSON.stringify(state(), null, 1));
}
if (opt('acts')) { log('selected acts done (no join with --acts)'); process.exit(); }

// join the act masters, two-pass loudnorm to −14 LUFS / −1.5 dBTP, CRF-20 master + ~5 Mbps delivery
const all = fs.readdirSync('stories').filter(f => new RegExp(`^${slug}-a\\d+\\.story$`).test(f)).map(f => +f.match(/-a(\d+)\./)[1]).sort((x, y) => x - y);
if (!all.every(done)) { log('not every act is rendered; run the same command again'); process.exit(3); }
const list = `out/${slug}_concat.txt`; fs.writeFileSync(list, all.map(n => `file '${process.cwd()}/${master(n)}'`).join('\n'));
log('join: concat + loudness pass 1');
const ff = args => { const r = sh('ffmpeg', ['-nostdin', '-hide_banner', '-y', ...args]); if (r.status) { log('ffmpeg failed: ' + r.stderr.split('\n').slice(-3).join(' ')); process.exit(4); } return r.stderr; };
ff(['-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', `out/${slug}_joined.mp4`]);
const m1 = ff(['-i', `out/${slug}_joined.mp4`, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']); const j = JSON.parse(m1.slice(m1.lastIndexOf('{'), m1.lastIndexOf('}') + 1));
const af = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=48000`;
log('join: CRF-20 master');
ff(['-loglevel', 'error', '-i', `out/${slug}_joined.mp4`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-af', af, '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', `out/${slug}_16x9_FINAL.mp4`]);
log('join: ~5 Mbps delivery');
ff(['-loglevel', 'error', '-i', `out/${slug}_16x9_FINAL.mp4`, '-c:v', 'libx264', '-preset', 'medium', '-b:v', '5M', '-maxrate', '6M', '-bufsize', '10M', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', `out/${slug}_16x9_DELIVERY.mp4`]);
fs.unlinkSync(`out/${slug}_joined.mp4`);
const lu = ff(['-i', `out/${slug}_16x9_FINAL.mp4`, '-af', 'ebur128=peak=true', '-f', 'null', '-']).split('\n').filter(l => /^\s+(I:|Peak:)/.test(l)).slice(-2).map(s => s.trim()).join(' · ');
if (drive) sh('python3', ['tools/pp_drive.py', 'put', `out/${slug}_16x9_FINAL.mp4`, '--to', `${slug}/renders`]);
fs.writeFileSync(STATE, JSON.stringify(state(), null, 1));
log(`EPISODE DONE → out/${slug}_16x9_FINAL.mp4 (${(fs.statSync(`out/${slug}_16x9_FINAL.mp4`).size / 1e6).toFixed(0)} MB) + _DELIVERY.mp4 · ${lu}`);
