// pp_fx — the channel's growing EFFECTS LIBRARY (v6.3). Every scene effect Claude invents for a moment of a film is saved
// here with what it does, its parameters and a preview, so a later episode can find it, reuse it (code:@name;param:…)
// or adapt it instead of starting from nothing. The library is how the channel's craft accumulates.
//   node tools/pp_fx.mjs save <story> <scene> [--as <name>] --does "<what it shows, one line>" --tags a,b,c [--born "<slug aN bM: sentence>"]
//        → effects/<name>.js (+ previews/<name>.jpg rendered from the beat that uses it) and a rebuilt bundle + CATALOG.md
//   node tools/pp_fx.mjs list [words…]      → matching effects with what they do, params and tags
//   node tools/pp_fx.mjs build              → engine/library/effects.js (the bundle the engine loads) + effects/CATALOG.md (setup.sh runs it)
// Use in a story: fx="code:@<name>;<param>:<value>;…" — no #! scene block needed. To adapt one, copy its file into the story
// as a #! scene block under a NEW name, change it, then save it as a new effect.
import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const DIR = path.join(ROOT, 'effects'), PREV = path.join(DIR, 'previews');
const [cmd, ...rest] = process.argv.slice(2); const opt = k => { const i = rest.indexOf('--' + k); return i >= 0 ? rest[i + 1] : undefined; };
fs.mkdirSync(PREV, { recursive: true });

function meta(src) { const m = {}; (src.match(/^\/\*([\s\S]*?)\*\//) || ['', ''])[1].split('\n').forEach(l => { const r = l.match(/@(\w+)\s*:?\s*(.*)$/); if (r) m[r[1]] = r[2].trim(); }); return m; }
function body(src) { return src.replace(/^\/\*[\s\S]*?\*\/\s*/, ''); }
function all() { return fs.readdirSync(DIR).filter(f => f.endsWith('.js')).sort().map(f => { const src = fs.readFileSync(path.join(DIR, f), 'utf8'); return { name: f.slice(0, -3), src, m: meta(src) }; }); }

function build(quiet) {
  const fx = all(); const bundle = {}; fx.forEach(e => bundle[e.name] = body(e.src));
  fs.writeFileSync(path.join(ROOT, 'engine', 'library', 'effects.js'), 'window.PP_EFFECTS = ' + JSON.stringify(bundle) + ';\n');
  const rows = [`# Effects library (${fx.length})`, '', 'Every effect was invented for one moment of one film. Use it as `fx="code:@<name>;<param>:<value>…"`, adapt a copy under a new name, or invent a new one and save it (`node tools/pp_fx.mjs save …`).', '',
    '| preview | effect | what it does | params | tags | born in |', '|---|---|---|---|---|---|'];
  fx.forEach(e => rows.push(`| ${fs.existsSync(path.join(PREV, e.name + '.jpg')) ? `![](previews/${e.name}.jpg)` : '—'} | \`@${e.name}\` | ${e.m.does || '—'} | ${e.m.params || '—'} | ${e.m.tags || ''} | ${e.m.born || ''} |`));
  fs.writeFileSync(path.join(DIR, 'CATALOG.md'), rows.join('\n') + '\n');
  if (!quiet) console.log(`effects library: ${fx.length} effects → engine/library/effects.js, effects/CATALOG.md`);
}

if (cmd === 'save') {
  const [story, scene] = rest; if (!story || !scene) { console.log('usage: node tools/pp_fx.mjs save <story> <scene> [--as <name>] --does "…" --tags a,b [--born "…"]'); process.exit(1); }
  const name = opt('as') || scene; if (!/^[a-z0-9_]+$/.test(name)) { console.log('effect names are lowercase_underscores'); process.exit(1); }
  const txt = fs.readFileSync(story, 'utf8'); const m = txt.match(new RegExp('^#!\\s*scene\\s+' + scene + '\\s*\\n([\\s\\S]*?)^#!\\s*end\\s*$', 'm'));
  if (!m) { console.log(`no "#! scene ${scene}" block in ${story}`); process.exit(1); }
  const code = m[1].trim(); const params = [...new Set([...code.matchAll(/params\.(\w+)/g)].map(x => x[1]))]; const uses = [...new Set([...code.matchAll(/(?:img|clip)\('([a-z0-9_]+)'/g)].map(x => x[1]))];
  if (!opt('does')) { console.log('--does "<what it shows>" is required: the next director finds effects by what they do'); process.exit(1); }
  const head = `/* @effect ${name}\n   @does: ${opt('does')}\n   @params: ${params.join(', ') || '—'}\n   @uses: ${uses.join(', ') || '—'} (swap these ids for the new episode's own)\n   @tags: ${opt('tags') || ''}\n   @born: ${opt('born') || path.basename(story)}\n*/\n`;
  fs.writeFileSync(path.join(DIR, name + '.js'), head + code + '\n');
  const beats = txt.split(/^(?=#\s*(?:cine|ppcase|ppend)\b)/m).filter(b => /^#\s*(cine|ppcase|ppend)\b/.test(b)); const k = beats.findIndex(b => new RegExp('code:@?' + scene + '\\b').test(b.split('\n')[0]));
  if (k >= 0) { try { const out = execFileSync('node', [path.join(ROOT, 'tools', 'pp_sheet.mjs'), story, '--beats', `${k + 1}-${k + 1}`, '--at', '.25,.55,.9'], { cwd: ROOT }).toString(); const f = out.split('\n').find(l => l.endsWith('.jpg')); if (f) fs.copyFileSync(path.join(ROOT, f.trim()), path.join(PREV, name + '.jpg')); } catch (e) { console.log('preview failed:', e.message.split('\n')[0]); } }
  build(true); console.log(`saved @${name} (${params.length} params) → effects/${name}.js${fs.existsSync(path.join(PREV, name + '.jpg')) ? ' + preview' : ''}`);
} else if (cmd === 'preview') {   // a preview strip for an effect written straight into effects/ (no #! scene block): from a beat that uses it
  const [story, name] = rest; const txt = fs.readFileSync(story, 'utf8'); const beats = txt.split(/^(?=#\s*(?:cine|ppcase|ppend)\b)/m).filter(b => /^#\s*(cine|ppcase|ppend)\b/.test(b));
  const k = beats.findIndex(b => new RegExp('code:@?' + name + '\\b').test(b.split('\n')[0])); if (k < 0) { console.log(`no beat in ${story} uses ${name}`); process.exit(1); }
  const out = execFileSync('node', [path.join(ROOT, 'tools', 'pp_sheet.mjs'), story, '--beats', `${k + 1}-${k + 1}`, '--at', '.25,.55,.9'], { cwd: ROOT }).toString(); const f = out.split('\n').find(l => l.endsWith('.jpg'));
  if (f) { fs.copyFileSync(path.join(ROOT, f.trim()), path.join(PREV, name + '.jpg')); build(true); console.log(`preview → effects/previews/${name}.jpg`); }
} else if (cmd === 'list') {
  const q = rest.map(w => w.toLowerCase()); all().map(e => ({ e, s: q.reduce((a, w) => a + ((e.name + ' ' + Object.values(e.m).join(' ')).toLowerCase().includes(w) ? 1 : 0), 0) })).filter(x => !q.length || x.s).sort((a, b) => b.s - a.s)
    .forEach(({ e }) => console.log(`@${e.name.padEnd(22)} ${e.m.does || ''}\n${' '.repeat(24)}params: ${e.m.params || '—'} · tags: ${e.m.tags || ''} · born: ${e.m.born || ''}`));
} else if (cmd === 'build') build();
else { console.log(fs.readFileSync(new URL(import.meta.url)).toString().split('\n').filter(l => l.startsWith('//')).join('\n')); }
