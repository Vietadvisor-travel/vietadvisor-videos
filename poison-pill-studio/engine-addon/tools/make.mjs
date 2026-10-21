// One command from storyboard to finished, voiced, scored videos:
//   node tools/make.mjs stories/my.story [--fmt 9x16 (default) | --both] [--voice am_michael|none] [--speed 1.1]   → out/<slug>_9x16_FINAL.mp4 (< 30 MB, send this)
//                                        [--speed 1.0] [--draft] [--skip-lint] [--no-audio] [--reuse-mix]
//                                        [--jobs N] [--lite] [--chunk 4] [--resume]  ← crashed/rebooted? run the SAME command + --resume: voice, mix and finished video chunks are reused
// 1) voice-over lines → Kokoro TTS (free, offline) → real durations   2) lint with real timing (aborts on errors)
// 3) cue sheet → SFX + VO track + music scored to the scenes → mix (music ducked under the voice)
// 4) render each format, mux audio: two-pass gain-only loudness (9x16 −13 LUFS, 16x9 −14 LUFS, TP ≤ −1.5 dBTP)   5) SRT
import { execFileSync, spawnSync } from 'child_process'; import path from 'path'; import fs from 'fs';
const a = process.argv.slice(2), ep = a[0], opt = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : undefined; }, has = k => a.includes('--' + k);
if (!ep) { console.log(fs.readFileSync(new URL(import.meta.url)).toString().split('\n').slice(0, 7).join('\n')); process.exit(); }
const fmts = (opt('fmt') || (has('both') ? '9x16,16x9' : '9x16')).split(','), base = 'out/' + path.basename(ep).replace(/\.\w+$/, ''); fs.mkdirSync('out', { recursive: true });
const node = (args, o = {}) => execFileSync('node', args, { stdio: 'inherit', ...o }), py = (args) => execFileSync('python3', args, { stdio: 'inherit' });
const isStory = /\.(story|txt)$/.test(ep); const story = isStory ? fs.readFileSync(ep, 'utf8') : '';
const hdr = k => (story.match(new RegExp('^' + k + '\\s*:\\s*(.+)$', 'm')) || [])[1]?.trim();
const voice = opt('voice') || hdr('voice'); const wantVoice = !has('no-audio') && isStory && voice !== 'none';
let vo = [];
// 1) voice-over
const resume = has('resume'); if (wantVoice && resume && fs.existsSync(`${base}_vo/durs.json`)) { console.log('resume: reusing the voice-over in', `${base}_vo`); vo = ['--vo', `${base}_vo/durs.json`]; }
else if (wantVoice) { try { node(['tools/render.mjs', ep, '--lines', `${base}_lines.json`]); py(['tools/voice.py', 'synth', `${base}_lines.json`, `${base}_vo`, ...(voice ? ['--voice', voice] : []), '--speed', opt('speed') || 'auto']); vo = ['--vo', `${base}_vo/durs.json`]; }
  catch (e) { console.warn('\n⚠ voice-over unavailable (run: python3 tools/voice.py setup) — continuing with caption timing only.\n'); } }
// 2) lint
if (!has('skip-lint')) { const rep = execFileSync('node', ['tools/lint.mjs', ep, '--out', base, ...vo, ...(fmts.length > 1 ? ['--both'] : fmts[0] === '16x9' ? ['--16x9'] : [])], { encoding: 'utf8' }); console.log(rep); if (/\b[1-9]\d* errors\b/.test(rep) || /^\s+ERROR\s/m.test(rep)) { console.error('Lint errors — fix them first (or --skip-lint).'); process.exit(1); } }
// 2b) director review (advisory)
if (!has('skip-review')) { try { console.log(execFileSync('node', ['tools/review.mjs', ep], { encoding: 'utf8' })); } catch (e) { console.warn('review skipped:', e.message.split('\n')[0]); } }
// 3) audio
node(['tools/render.mjs', ep, '--cues', `${base}_cues.json`, ...vo]);
let mixWav = null;
if (!has('no-audio')) {
  if (vo.length) py(['tools/voice.py', 'place', `${base}_cues.json`, `${base}_vo`, `${base}_vo.wav`]);
  // sound design owns the whole soundtrack: visual events + beats → rule table → scheduler → beds, SFX, score, stingers → bus mix → QA
  // (tools/sfx.py and tools/ambience.py are no longer mixed; pass --legacy-stems to sound_design.py to layer them underneath)
  const design = ep.replace(/\.story$/, '.sound.json'), lufs = fmts.includes('9x16') ? '-13' : '-14';
  if ((has('reuse-mix') || has('resume')) && fs.existsSync(`${base}_mix.wav`)) console.log('reusing', `${base}_mix.wav`);
  else py(['tools/sound_design.py', base, '--story', ep, '--lufs', lufs, '--fmt', fmts.includes('9x16') ? 'vertical' : 'youtube', ...(fs.existsSync(design) ? ['--design', design] : [])]); mixWav = `${base}_mix.wav`;
}
// two-pass, gain-only loudness normalisation (loudnorm linear mode; the mix is already limited at −2 dBTP)
const loudAf = (wav, target) => { const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', wav, '-af', `loudnorm=I=${target}:TP=-1.5:LRA=20:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' });
  const m = JSON.parse(r.stderr.slice(r.stderr.lastIndexOf('{'), r.stderr.lastIndexOf('}') + 1));
  return `loudnorm=I=${target}:TP=-1.5:LRA=20:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`; };
// 4) video per format (+ mux)
for (const f of fmts) { const silent = `${base}_${f}_v.mp4`, out = `${base}_${f}.mp4`;
  const pass = ['jobs', 'chunk', 'reuse', 'frame-timeout', 'preset', 'crf'].flatMap(k => opt(k) ? ['--' + k, opt(k)] : []).concat(has('lite') ? ['--lite'] : []);
  node(['tools/render.mjs', ep, '--fmt', f, '--out', silent, ...vo, ...pass, ...(has('draft') ? ['--scale', '.5'] : [])]);
  if (mixWav) { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', mixWav, '-c:v', 'copy', '-af', loudAf(mixWav, f === '16x9' ? -14 : -13), '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out]); fs.unlinkSync(silent); }
  // delivery: ONE universal file under 30 MB (H.264, two-pass) — the file you send
  if (!has('draft') && !has('no-deliver')) py(['tools/deliver.py', out]);
  else if (!mixWav) fs.renameSync(silent, out); }
// 5) credits for real photos used (paste into the description)
if (isStory && fs.existsSync('engine/library/images.json')) { const reg = JSON.parse(fs.readFileSync('engine/library/images.json', 'utf8')); const ids = new Set(Object.keys(reg).filter(k => new RegExp('(^|[^a-z0-9_])' + k + '([^a-z0-9_]|$)').test(story)));
  const lines = [...ids].filter(i => reg[i]).map(i => `${i}: ${reg[i].credit || 'own photo'}${reg[i].license ? ' (' + reg[i].license + ')' : ''}`); const ai = [...ids].filter(i => reg[i] && reg[i].gen); if (ai.length) lines.push(`AI-generated illustrations (not archival): ${ai.join(', ')} — tick YouTube's "altered or synthetic content" box if any of them is photorealistic`); if (lines.length) fs.writeFileSync(`${base}_credits.txt`, 'Photo credits\n' + lines.join('\n') + '\nAnimation & music: Vietadvisor Motion Studio\n'); }
// 6) subtitles / script
fs.writeFileSync(`${base}.srt`, execFileSync('python3', ['tools/srt.py', `${base}_cues.json`], { encoding: 'utf8' }));
if (isStory) { try { node(['tools/pp_history.mjs', 'record', ep]); } catch (e) { console.warn('history not recorded:', e.message.split('\n')[0]); } }
console.log('\nDONE →', fmts.map(f => `${base}_${f}.mp4`).join(', '), `+ ${base}.srt`);
