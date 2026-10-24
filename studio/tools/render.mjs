// Render an episode.
//   node tools/render.mjs stories/x.story --fmt 16x9 --out out/x.mp4 [--jobs N] [--lite] [--chunk 4] [--reuse 0] [--from 0 --to 60] [--stills 1.5,10,22]
//   Crashed or rebooted? Run the SAME command again: it resumes from the finished chunks.
import { launch } from './browser.mjs'; import { spawn } from 'child_process'; import fs from 'fs'; import path from 'path';
const args = process.argv.slice(2); const ep = args[0]; const opt = k => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : undefined; };
const fmt = opt('fmt') || '16x9'; const sc_ = +(opt('scale') || 1); const [w, h] = (fmt === '9x16' ? [1080, 1920] : fmt === '1x1' ? [1080, 1080] : fmt === '4x5' ? [1080, 1350] : [1920, 1080]).map(v => Math.round(v * sc_ / 2) * 2);
const fps = +(opt('fps') || 30); const LITE = args.includes('--lite');
const browser = await launch();
const isStory = /\.(story|txt)$/.test(ep);
const voi = process.argv.indexOf('--vo'); const VO = voi > 0 && fs.existsSync(process.argv[voi + 1]) ? JSON.parse(fs.readFileSync(process.argv[voi + 1], 'utf8')) : null;
const ENVP = voi > 0 ? path.join(path.dirname(process.argv[voi + 1]), 'envs.json') : null; const ENV = ENVP && fs.existsSync(ENVP) ? JSON.parse(fs.readFileSync(ENVP, 'utf8')) : null; const VISP = ENVP && ENVP.replace(/envs\.json$/, 'visemes.json'); const VIS = VISP && fs.existsSync(VISP) ? JSON.parse(fs.readFileSync(VISP, 'utf8')) : null; const WRDP = ENVP && ENVP.replace(/envs\.json$/, 'words.json'); const WRD = WRDP && fs.existsSync(WRDP) ? JSON.parse(fs.readFileSync(WRDP, 'utf8')) : null;
async function openPage() { const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('console', m => { const t = m.text(); if (!/ERR_FILE|missing|GL Driver|swiftshader|GroupMarker/i.test(t)) console.log('PAGE:', t); }); page.on('pageerror', e => console.log('ERR:', e.message));
  await page.goto('file://' + process.cwd() + '/studio.html' + (isStory ? '' : '?ep=' + encodeURIComponent(ep)), { timeout: 180000 }); await page.evaluate(() => window.READY);
  if (LITE) await page.evaluate(() => { window.PP3D_SCALE = .5; window.PP3D_FPS = 12; window.PP3D_SHADOW = 256; });
  if (isStory) await page.evaluate(([t, vo, env, vis, wrd]) => { window.VOENV = env; window.VOVIS = vis; window.VOWORDS = wrd; window.EPISODE = SB.compile(t, vo ? { vo } : {}); }, [fs.readFileSync(ep, 'utf8'), VO, ENV, VIS, WRD]);
  const d = await page.evaluate(([w, h]) => { const c = document.getElementById('c'); c.width = w; c.height = h; W = w; H = h; ctx = c.getContext('2d'); return loadEpisode(window.EPISODE); }, [w, h]);
  return { page, dur: d }; }
const { page, dur } = await openPage();
const frameOn = async (pg, t, type = 'image/jpeg', q = .95) => { const d = await pg.evaluate(async ([t, type, q]) => { await renderReady(t); return document.getElementById('c').toDataURL(type, q); }, [t, type, q]); return Buffer.from(d.split(',')[1], 'base64'); };
const frame = (t, type, q) => frameOn(page, t, type, q);
if (opt('lines')) { const L = await page.evaluate(t => { SB.compile(t, { collect: 1 }); return { lines: SB._lines, voice: EPISODE.voice, music: EPISODE.music, format: EPISODE.format }; }, fs.readFileSync(ep, 'utf8')); const e = await page.evaluate(t => { const x = SB.compile(t); return { voice: x.voice, music: x.music, format: x.format }; }, fs.readFileSync(ep, 'utf8')); const st = fs.readFileSync(ep, 'utf8'), hv = k => ((st.match(new RegExp('^\\s*' + k + '\\s*:\\s*(.+)$', 'im')) || [])[1] || '').trim() || undefined; fs.writeFileSync(opt('lines'), JSON.stringify({ ...L, ...e, voices: hv('voices'), delivery: hv('delivery') }, null, 1)); console.log('lines', L.lines.length); }
else if (opt('stills')) { const dir = opt('out') || 'out/stills'; fs.mkdirSync(dir, { recursive: true }); for (const t of opt('stills').split(',').map(Number)) fs.writeFileSync(`${dir}/${fmt}_t${t.toFixed(2)}.jpg`, await frame(t, 'image/jpeg', .85)); }
else if (opt('cues')) { const cues = await page.evaluate(() => episodeCues()); fs.writeFileSync(opt('cues'), JSON.stringify(cues, null, 2)); console.log('duration', dur); }
else {
  // v4.2 render: the film is cut into small CHUNKS (default 4 s) pulled from a shared queue by N browser pages.
  //  · resume  — finished chunks are kept on disk; re-running the same command after a crash/reboot continues where it stopped
  //  · reuse   — frame f+1 is copied when frames f and f+2 look the same (still beats cost ~half)   --reuse 0 to disable
  //  · watchdog — a frame taking longer than --frame-timeout (90 s) restarts that page and retries the chunk once
  //  · progress — out/<name>.chunks/progress.json is rewritten after every chunk (done, total, eta, updated)
  //  · --lite  — weak machines: 3D at half resolution & 12 fps     · --jobs N (default = CPU cores, memory permitting)
  const os = await import('os'); const crypto = await import('crypto');
  const out = opt('out') || `out/episode_${fmt}.mp4`; const f0 = Math.round((+(opt('from') || 0)) * fps), f1 = Math.round((+(opt('to') || dur)) * fps);
  const chunkF = Math.max(30, Math.round(+(opt('chunk') || 4) * fps)); const reuse = opt('reuse') !== '0'; const thr = +(opt('reuse-thr') || .7); const ftimeout = +(opt('frame-timeout') || 90) * 1000;
  const memJobs = Math.max(1, Math.floor(os.totalmem() / 2.2e9)); const jobs = Math.max(1, Math.min(+(opt('jobs') || Math.min(os.cpus().length, 4, memJobs)), Math.ceil((f1 - f0) / chunkF)));
  const preset = opt('preset') || 'veryfast', crf = opt('crf') || '18';
  // v6.6 content-addressed chunks: each chunk's file name is a hash of everything that can change its pixels — the
  // shared parts (header, #! scene code, effects library, image registry, format) plus the beats it overlaps (± 1 s)
  // with their timing (the voice of a line is fixed by its text, so the beat text covers it). Editing one beat re-renders only the chunks around it; a crash or a new session resumes.
  const cdir = out.replace(/\.mp4$/, '.chunks'); const H5 = x => crypto.createHash('md5').update(x).digest('hex');
  const src = fs.readFileSync(ep, 'utf8'), fileH = f => fs.existsSync(f) ? H5(fs.readFileSync(f)) : '';
  const beatRe = /^# (?!!)/m, parts = src.split(/^(?=# (?!!))/m);
  const sceneCode = (src.match(/^#! scene[\s\S]*?^#! end/gm) || []).join('\n');
  const beats = parts.slice(1).map(b => b.split('\n').filter(l => !l.startsWith('//')).join('\n').replace(/^#! scene[\s\S]*?^#! end/gm, ''));
  const starts = await page.evaluate(() => _starts.slice()); const perBeat = beats.length === starts.length && beatRe.test(src);
  const shared = H5([parts[0].split('\n').filter(l => !l.startsWith('//')).join('\n'), sceneCode, fileH('engine/library/effects.js'), fileH('engine/library/images.json'), fileH('engine/library/pp_fxkit.js'), fmt, sc_, fps, chunkF, LITE].join('|'));
  const whole = H5([src, VO ? JSON.stringify(VO) : ''].join('|'));
  const chunkSig = (a, b) => { if (!perBeat) return H5(shared + whole + a + '-' + b); const t0 = a / fps - 1, t1 = b / fps + 1, ends = starts.slice(1).concat([dur]);
    const ids = starts.map((s, i) => i).filter(i => ends[i] > t0 && starts[i] < t1); return H5([shared, a, b, ...ids.map(i => i + ':' + starts[i].toFixed(3) + ':' + ends[i].toFixed(3) + ':' + beats[i])].join('|')); };
  fs.mkdirSync(cdir, { recursive: true });
  const chunks = []; for (let a = f0; a < f1; a += chunkF) { const b = Math.min(f1, a + chunkF); chunks.push({ a, b, f: `${cdir}/c${String(a).padStart(6, '0')}_${chunkSig(a, b).slice(0, 12)}.mp4` }); }
  const todo = chunks.filter(c => !fs.existsSync(c.f)); const total = chunks.length; let doneN = total - todo.length; const t0 = Date.now(); let framesDone = 0, reused = 0; const todoFrames = todo.reduce((s, c) => s + c.b - c.a, 0);
  if (doneN) console.log(`resuming: ${doneN}/${total} chunks already rendered`);
  const progress = () => { const el = (Date.now() - t0) / 1000, eta = framesDone ? el / framesDone * (todoFrames - framesDone) : null; fs.writeFileSync(cdir + '/progress.json', JSON.stringify({ done: doneN, total, framesDone, todoFrames, reused, elapsed_s: Math.round(el), eta_s: eta && Math.round(eta), jobs, updated: new Date().toISOString() }, null, 1));
    console.log(`${fmt} chunk ${doneN}/${total} · ${framesDone}/${todoFrames} frames · reused ${reused} · ${el.toFixed(0)}s${eta ? ' · eta ' + (eta / 60).toFixed(1) + ' min' : ''} (${jobs} jobs)`); };
  const enc = o => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', preset, '-tune', 'animation', '-crf', crf, '-g', '60', '-pix_fmt', 'yuv420p', '-threads', '1', o], { stdio: ['pipe', 'ignore', 'inherit'] });
  const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout ' + what)), ms))]);
  const shot = async (pg, f) => { const r = await withTimeout(pg.evaluate(async ([t]) => { await renderReady(t); const c = document.getElementById('c'); let s = window._ppSig; if (!s) { s = window._ppSig = document.createElement('canvas'); s.width = 64; s.height = 36; } const g = s.getContext('2d', { willReadFrequently: true }); g.drawImage(c, 0, 0, 64, 36);
      return { d: c.toDataURL('image/jpeg', .95), s: Array.from(g.getImageData(0, 0, 64, 36).data) }; }, [f / fps]), ftimeout, 'frame ' + f + ' (t=' + (f / fps).toFixed(2) + 's)'); return { buf: Buffer.from(r.d.split(',')[1], 'base64'), sig: r.s }; };
  const same = (x, y) => { let d = 0; for (let i = 0; i < x.length; i += 4) d += Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]); return d / (x.length / 4 * 3) < thr; };
  const renderChunk = async (pg, c) => { const tmp = c.f.replace(/\.mp4$/, '.tmp.mp4'); const ff = enc(tmp); let ffErr = null; ff.on('error', e => ffErr = e); const put = async buf => { if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); framesDone++; };
    try { let prev = await shot(pg, c.a); await put(prev.buf); let f = c.a + 1;
      while (f < c.b) { if (reuse && f + 1 < c.b) { const nxt = await shot(pg, f + 1); if (same(prev.sig, nxt.sig)) { await put(prev.buf); reused++; } else await put((await shot(pg, f)).buf); await put(nxt.buf); prev = nxt; f += 2; }
        else { prev = await shot(pg, f); await put(prev.buf); f++; } }
      ff.stdin.end(); await new Promise(r => ff.on('close', r)); if (ffErr) throw ffErr; fs.renameSync(tmp, c.f); }
    catch (e) { try { ff.stdin.destroy(); ff.kill('SIGKILL'); } catch (_) {} if (fs.existsSync(tmp)) fs.unlinkSync(tmp); throw e; } };
  const worker = async (k) => { let pg = k === 0 ? page : (await openPage()).page;
    while (todo.length) { const c = todo.shift(); let ok = false;
      for (let attempt = 1; attempt <= 2 && !ok; attempt++) { try { await renderChunk(pg, c); ok = true; } catch (e) { console.log(`⚠ chunk at ${(c.a / fps).toFixed(1)}s failed (${e.message}) — attempt ${attempt}/2, restarting the page`); try { await pg.close(); } catch (_) {} pg = (await openPage()).page; } }
      if (!ok) throw new Error(`chunk ${(c.a / fps).toFixed(1)}–${(c.b / fps).toFixed(1)} s failed twice: check that beat with pp_speed / pp_sheet, or use --lite`); doneN++; progress(); } };
  await Promise.all(Array.from({ length: jobs }, (_, k) => worker(k)));
  const list = cdir + '/list.txt'; fs.writeFileSync(list, chunks.map(c => `file '${path.resolve(c.f)}'`).join('\n'));
  const { execFileSync } = await import('child_process'); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out]);
  // v6.6: chunks are KEPT (they are the cache for the next edit or a crashed session); stale ones beyond the newest
  // 3 versions of each time slot are pruned. --clean-chunks removes the folder after a successful render.
  if (args.includes('--clean-chunks')) fs.rmSync(cdir, { recursive: true, force: true });
  else { const keep = new Set(chunks.map(c => path.basename(c.f))), bySlot = {}; for (const f of fs.readdirSync(cdir).filter(f => /^c\d{6}_/.test(f) && !keep.has(f))) (bySlot[f.slice(0, 7)] ||= []).push(f);
    for (const fs_ of Object.values(bySlot)) fs_.map(f => [f, fs.statSync(cdir + '/' + f).mtimeMs]).sort((x, y) => y[1] - x[1]).slice(2).forEach(([f]) => fs.unlinkSync(cdir + '/' + f)); }
  console.log(`rendered ${f1 - f0} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s · ${reused} reused · ${jobs} jobs`);
  if (args.includes('--audio')) { // procedural SFX track from the cue sheet, muxed into the MP4
    const { execFileSync } = await import('child_process'); const cj = out.replace(/\.mp4$/, '_cues.json'), wav = out.replace(/\.mp4$/, '_sfx.wav'), tmp = out.replace(/\.mp4$/, '_tmp.mp4');
    fs.writeFileSync(cj, JSON.stringify(await page.evaluate(() => episodeCues()), null, 1));
    execFileSync('python3', [path.join(path.dirname(new URL(import.meta.url).pathname), 'sfx.py'), 'mix', cj, wav], { stdio: 'inherit' });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', out, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', tmp]); fs.renameSync(tmp, out);
  }
  console.log('done', out, dur);
}
await browser.close();
