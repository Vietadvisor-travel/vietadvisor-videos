// pp_scriptlint — score the VO script BEFORE anything is drawn (references/script-and-story.md). A boring script cannot be
// rescued by visuals. Checks length, sentence rhythm, causality (BUT/THEREFORE), open loops & payoffs, re-hooks every
// 2–3 minutes, specificity (numbers, names, dates per minute), vague words, and whether every sentence can be SHOWN.
//   node tools/pp_scriptlint.mjs research/<slug>_script.md [--long]      → report + SCRIPT SCORE /10 (write the film at ≥ 8.5)
import fs from 'fs';
const f = process.argv[2]; if (!f) { console.log('usage: node tools/pp_scriptlint.mjs research/<slug>_script.md [--long]'); process.exit(1); } const long = process.argv.includes('--long');
const raw = fs.readFileSync(f, 'utf8').replace(/\r/g, ''); const secs = []; let cur = { name: '(intro)', lines: [] }; secs.push(cur);
raw.split('\n').forEach(l => { const t = l.trim(); if (!t || t.startsWith('//')) return; const h = t.match(/^##\s*(.*)$/); if (h) { cur = { name: h[1], lines: [] }; secs.push(cur); return; } if (t.startsWith('#')) return; cur.lines.push(t.replace(/\[\[[^\]]+\]\]/g, '').trim()); });
const S = secs.flatMap(s => s.lines.map(l => ({ s: s.name, l }))).filter(x => x.l); const words = x => x.split(/\s+/).filter(Boolean).length; const WPS = 2.6;
let t = 0; S.forEach(x => { x.t = t; x.w = words(x.l); t += x.w / WPS + .35; }); const mins = t / 60; const W = [], E = [];
const turn = /\b(but|so|then|until|which meant|therefore|because|instead|except|yet|however|that's when|and that's why)\b/i; const loop = /(\?|\bwe'll (get|come) (to|back)|\bbut first\b|\bmore on that\b|\bremember (that|this)\b|\bhere's the (thing|problem|twist)\b|\bthat's not the (whole|real) story\b)/i;
const spec = /(\$?\d[\d,.]*\s*(%|percent|million|billion|thousand|k\b|m\b|b\b)?|\b(19|20)\d\d\b|\b(one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty|thirty|forty|fifty|hundred|thousand|million|billion)\b|\b[A-Z][a-z]+ [A-Z][a-z]+\b)/; const vague = /\b(very|really|basically|things?|stuff|a lot|lots of|some kind of|huge|massive|incredible|amazing|interesting|various|many)\b/gi;
const visual = /\b(\d|million|billion|percent|map|city|country|office|building|street|app|phone|document|memo|email|letter|report|tweet|post|headline|stock|price|chart|money|cash|debt|ceo|founder|board|factory|store|ship|plane|years?|months?|days?|grew|fell|crash\w*|rose|launch\w*|signed|fired|resign\w*|bought|sold|sued|raised|lost|spent|team|banks?|messages?|files?|cash|users|audience|market|shows?|deal|contract|product|launch|investors?|employees|staff|stores?|ads?|pay|paid)\b/i;
// 1 length & rhythm
if (long && (mins < 7.5 || mins > 12.5)) W.push(`length ≈ ${mins.toFixed(1)} min — target 8–12 min (≈ ${Math.round(8 * 60 * WPS)}–${Math.round(12 * 60 * WPS)} words)`);
const lens = S.map(x => x.w); const avg = lens.reduce((a, b) => a + b, 0) / Math.max(1, lens.length); S.forEach(x => { if (x.w > 24) W.push(`${tm(x.t)} sentence of ${x.w} words — split it (one sentence ≈ one picture): "${x.l.slice(0, 70)}…"`); });
let flat = 0; for (let i = 2; i < lens.length; i++) if (Math.abs(lens[i] - lens[i - 1]) < 3 && Math.abs(lens[i - 1] - lens[i - 2]) < 3) flat++; const rhythm = lens.length > 6 ? 1 - Math.min(1, flat / lens.length * 2) : 1; if (rhythm < .7) W.push('monotone rhythm — vary sentence length (short punch after a long build); read it aloud');
// 2 hook
const hook = S.filter(x => x.t < 20); const hookOk = hook.some(x => spec.test(x.l)) && hook.some(x => turn.test(x.l) || /\?/.test(x.l) || /\b(never|nobody|only|first|last|biggest|worst|died|dead|lost)\b/i.test(x.l)); if (!hookOk) E.push('hook (first 20 s): needs a specific fact AND a contradiction/question/stake — start with the end, the surprising number or the absurd detail');
const loops = S.filter(x => loop.test(x.l)); if (!S.filter(x => x.t < 60).some(x => loop.test(x.l))) W.push('no open loop in the first minute — promise something you pay off later ("but that\'s not the real story", a question, "remember this number")');
// 3 causality: BUT/THEREFORE density, and/then chains
const turns = S.filter(x => turn.test(x.l)).length; const causal = S.length ? turns / S.length : 0; if (causal < .18) W.push(`only ${Math.round(causal * 100)} % of sentences turn the story (but / so / then / until / which meant) — scenes linked by AND THEN feel like a list; target ≥ 20 %`);
const andThen = S.filter(x => /\band then\b/i.test(x.l)).length; if (andThen > 2) W.push(`"and then" ×${andThen} — replace with BUT (conflict) or SO / WHICH MEANT (consequence)`);
// 4 re-hooks every ~2.5 min
for (let a = 60; a < t - 60; a += 150) { const win = S.filter(x => x.t >= a && x.t < a + 150); if (win.length && !win.some(x => loop.test(x.l) || /\b(but here's|that's when|nobody knew|what happened next|the real reason|it gets worse)\b/i.test(x.l))) W.push(`${tm(a)}–${tm(a + 150)}: no re-hook — every 2–3 min re-raise the stakes or the central question`); }
// 5 specificity & vagueness & showability
const specPM = S.filter(x => spec.test(x.l)).length / Math.max(.25, mins); if (specPM < 6) W.push(`specifics: ${specPM.toFixed(1)} sentences/min carry a number, date or name — target ≥ 6 (specific = believable = visual)`);
const vg = (raw.match(vague) || []).length; if (vg > S.length * .15) W.push(`vague words ×${vg} (very, really, things, huge, amazing…) — replace with the measured fact`);
const blind = S.filter(x => !visual.test(x.l) && x.w > 6); if (blind.length / Math.max(1, S.length) > .3) W.push(`${blind.length} sentences give the picture nothing to show (no number, place, person, object, action) — e.g. "${(blind[0] || { l: '' }).l.slice(0, 60)}…"`);
// 6 ending: thesis + payoff
const last = S.slice(-4).map(x => x.l).join(' '); if (!/\b(lesson|that's why|the real reason|in the end|the truth|because)\b/i.test(last)) W.push('ending: land the thesis in the last 30 s (the real reason / the lesson) and pay off the opening loop');
const score = { 'hook (fact + stake ≤ 20 s)': hookOk ? 1 : 0, 'open loop in minute 1': S.filter(x => x.t < 60).some(x => loop.test(x.l)) ? 1 : 0, 'causality BUT/THEREFORE ≥ 20 %': Math.min(1, causal / .2), 'rhythm varies': rhythm, 'no overlong sentences': 1 - Math.min(1, S.filter(x => x.w > 24).length / Math.max(1, S.length) * 4),
  're-hooks every 2–3 min': W.some(w => /no re-hook/.test(w)) ? .5 : 1, 'specifics ≥ 6 / min': Math.min(1, specPM / 6), 'concrete words (no vague)': 1 - Math.min(1, vg / Math.max(1, S.length) / .3), 'every sentence showable': 1 - Math.min(1, blind.length / Math.max(1, S.length) / .5), 'ending lands the thesis': W.some(w => /^ending/.test(w)) ? 0 : 1 };
function tm(s) { return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; }
console.log(`\n${f}: ${S.length} sentences · ${S.reduce((a, x) => a + x.w, 0)} words · ≈${mins.toFixed(1)} min · avg ${avg.toFixed(1)} words/sentence · ${loops.length} loops`);
E.forEach(m => console.log('ERROR', m)); W.forEach(m => console.log('WARN ', m)); const tot = Object.values(score).reduce((a, b) => a + b, 0);
console.log('\nSCRIPT SCORE (/10):'); Object.entries(score).forEach(([k, v]) => console.log(`  ${v.toFixed(2)}  ${k}`)); console.log(`  = ${tot.toFixed(1)} / 10   (direct the film only at ≥ 8.5)`); process.exit(E.length ? 1 : 0);
