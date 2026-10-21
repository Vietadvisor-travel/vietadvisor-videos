// pp_history — the channel's memory across episodes, so no two episodes look alike.
//   node tools/pp_history.mjs record stories/<slug>-a*.story     (make.mjs does this automatically after every act)
//   node tools/pp_history.mjs check  stories/<slug>-a*.story     (pp_lint runs the same check on every act)
//   node tools/pp_history.mjs show                               (last 10 episodes: look, opening, signature scenes, tracks)
// Stored in history.json at the engine root: per episode → look, opening scene type, scene types used, build verbs used,
// written transitions, music tracks. The check warns when the new episode reuses the last episodes' signature choices.
import fs from 'fs'; import path from 'path';
const HIST = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'history.json');
const load = () => { try { return JSON.parse(fs.readFileSync(HIST, 'utf8')); } catch { return []; } };
export function profile(files) { const p = { ep: '', looks: [], open: null, modes: {}, verbs: {}, trans: {}, tracks: [] };
  files.forEach(f => { const t = fs.readFileSync(f, 'utf8'); p.ep = path.basename(f).replace(/\.story$/, '').replace(/-a\d+$/, '').replace(/-yt$/, ''); const lk = (t.match(/^\s*look\s*:\s*(\w+)/im) || [])[1] || 'dossier'; if (!p.looks.includes(lk)) p.looks.push(lk);
    [...t.matchAll(/^#\s*cine\b([^\n]*)$/gm)].forEach((m, i) => { const fx = (m[1].match(/fx="([a-z0-9]+):/) || [])[1] || (/\bbg=world/.test(m[1]) ? 'map' : 'collage'); if (p.open === null && /-a0\b|-a0\./.test(f) || (p.open === null && files.length === 1 && i === 0)) p.open = fx; p.modes[fx] = (p.modes[fx] || 0) + 1;
      if (fx === 'build') [...m[1].matchAll(/\.(\w+)(?::[^@~"]*)?@/g)].forEach(v => p.verbs[v[1]] = (p.verbs[v[1]] || 0) + 1); const tr = (m[1].match(/\btrans=(\w+)/) || [])[1]; if (tr) p.trans[tr] = (p.trans[tr] || 0) + 1; });
    const used = path.join(path.dirname(HIST), 'out', path.basename(f).replace(/\.story$/, '') + '_music_used.json'); try { JSON.parse(fs.readFileSync(used, 'utf8')).forEach(x => { if (!p.tracks.includes(x)) p.tracks.push(x); }); } catch {} });
  return p; }
const SIGN = m => !/^(collage|map|build|scene|air|post|chat|browser|profile)$/.test(m);   // template scenes that become a "signature" when reused
export function check(files) { const p = profile(files); const H = load().filter(h => h.ep !== p.ep).slice(-3); const W = [];
  if (!H.length) return W; const prev = H[H.length - 1];
  if (p.open && H.some(h => h.open === p.open)) W.push(`history: the cold open uses "${p.open}" again (also opened ${H.filter(h => h.open === p.open).map(h => h.ep).join(', ')}) — open with something this channel hasn't shown recently`);
  if (prev.looks.length && p.looks.every(l => prev.looks.includes(l)) && p.looks.length) W.push(`history: same look as the previous episode (${prev.ep}: ${prev.looks.join(', ')}) — fine only if the content truly demands it`);
  const mine = Object.keys(p.modes).filter(SIGN); H.forEach(h => { const shared = mine.filter(m => h.modes[m]); if (mine.length >= 4 && shared.length / mine.length > .5) W.push(`history: ${shared.length} of ${mine.length} template scene types repeat from ${h.ep} (${shared.slice(0, 8).join(', ')}) — invent these beats with build/scene instead`); });
  const tot = Object.values(p.modes).reduce((a, b) => a + b, 0); const b = p.modes.build || 0; if (tot >= 12 && b / tot < .25) W.push(`freshness: only ${b} of ${tot} beats are composed with build (${Math.round(b / tot * 100)} %) — invent ≥ 25 % of beats from their own sentence (references/build.md)`);
  return W; }
const main = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname); const [cmd, ...files] = main ? process.argv.slice(2) : [];
if (cmd === 'record') { const p = profile(files); const H = load().filter(h => h.ep !== p.ep); H.push({ ...p, date: new Date().toISOString().slice(0, 10) }); fs.writeFileSync(HIST, JSON.stringify(H.slice(-30), null, 1)); console.log('history: recorded', p.ep, '·', Object.keys(p.modes).length, 'scene types ·', p.tracks.length, 'tracks'); }
else if (cmd === 'check') { const W = check(files); W.forEach(w => console.log('WARN ', w)); if (!W.length) console.log('history: fresh ✓'); }
else if (cmd === 'show') load().slice(-10).forEach(h => console.log(`${h.date} ${h.ep.padEnd(28)} look ${h.looks.join('/').padEnd(14)} open ${String(h.open).padEnd(12)} ${Object.keys(h.modes).filter(SIGN).slice(0, 8).join(' ')} · tracks ${h.tracks.length}`));
else if (cmd) console.log('usage: node tools/pp_history.mjs record|check|show stories/<slug>-a*.story');
