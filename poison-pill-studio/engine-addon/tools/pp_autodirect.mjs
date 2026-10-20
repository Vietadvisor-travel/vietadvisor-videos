// Auto-director: turns a VO script + the asset list into a FIRST-DRAFT storyboard — every sentence gets a # cine line with
// 3 planes, real images matched by keyword, events on the stressed words, rotating cameras/backdrops and the act colour.
// It is a starting point (≈ 6–7/10); the Director then refines every line by hand to ≥ 9/10.
// v4: sentences whose IDEA can be acted (cause chain, comparison, hidden mass, hype, rivalry, runway, control…) become SET PIECES
// with their own camera path; every other beat gets a shot= (scale change + a move on the stressed word) instead of cam=.
//   node tools/pp_autodirect.mjs research/<slug>_script.md research/<slug>_assets.csv [--out stories/<slug>-draft.story] [--split]
// Script format:  "## a2 RISE act=rise" headers, then one sentence per line (as spoken). Optional inline hints:
//   [[mid:katzenberg]] [[bg:quibi_bg_wallst]] [[fx:stamp:FLOP;at:nobody]] are passed straight through.
// Assets CSV: id,role,layer,source,licence,credit,used in,status,keys   (keys = words that should summon this image, | separated)
import fs from 'fs';
const [scriptF, assetsF] = process.argv.slice(2); const opt = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined; };
if (!scriptF) { console.log('usage: node tools/pp_autodirect.mjs <script.md> [assets.csv] [--out file] [--split]'); process.exit(1); }
const csv = f => { if (!f || !fs.existsSync(f)) return []; const L = fs.readFileSync(f, 'utf8').trim().split(/\r?\n/); const hd = L[0].split(',').map(s => s.trim().replace(/\(.*\)/, '')); return L.slice(1).map(l => { const c = l.split(','); const o = {}; hd.forEach((h, i) => o[h] = (c[i] || '').trim()); return o; }); };
const assets = csv(assetsF).filter(a => a.id); const keysOf = a => (a.keys || a['used in'] || '').toLowerCase().split('|').map(s => s.trim()).filter(Boolean).concat(a.id.toLowerCase().split('_').slice(1));
const byRole = r => assets.filter(a => (a.role || '').startsWith(r));
const PLACES = { 'new york': [-74, 40.7], london: [-0.1, 51.5], tokyo: [139.7, 35.7], 'los angeles': [-118.2, 34], hollywood: [-118.3, 34.1], 'san francisco': [-122.4, 37.8], 'silicon valley': [-122.1, 37.4], seattle: [-122.3, 47.6], chicago: [-87.6, 41.9], paris: [2.35, 48.86], berlin: [13.4, 52.5], shanghai: [121.5, 31.2], beijing: [116.4, 39.9], 'hong kong': [114.2, 22.3], singapore: [103.8, 1.35], seoul: [127, 37.6], mumbai: [72.9, 19.1], dubai: [55.3, 25.2], moscow: [37.6, 55.8], sydney: [151.2, -33.9], 'são paulo': [-46.6, -23.5], toronto: [-79.4, 43.7], hanoi: [105.8, 21], 'ho chi minh': [106.7, 10.8], ohio: [-82.9, 40], texas: [-97.7, 30.3], cleveland: [-81.7, 41.5], detroit: [-83, 42.3] };
const NUMW = /\b(million|billion|trillion|thousand|percent)\b/i; const YEAR = /\b(1[789]\d\d|20\d\d)\b/; const DIGNUM = /\$?\d[\d,.]*\s*(million|billion|trillion|thousand|%|percent|[MBK]\b)?/i;
const DOWN = /\b(fell|fall|crash\w*|dropp\w*|plung\w*|collaps\w*|lost|losing|sank|tumbl\w*|halv\w*)\b/i, UP = /\b(grew|grow\w*|doubl\w*|tripl\w*|soar\w*|skyrocket\w*|explod\w*|rose|surg\w*)\b/i;
const DEATH = /\b(shut\w*|bankrupt\w*|died|dead|gone|closed|over|ended|killed)\b/i, LIE = /\b(blam\w*|denied|deny|excuse\w*|claimed|insisted|promised|lied)\b/i, SAID = /\b(said|wrote|told|announced|tweeted|declared)\b/i;
const MONEY = /\b(money|cash|dollars|funding|raised|invest\w*|paid|profit\w*|revenue)\b/i, DOC = /\b(memo|letter|report|document|filing|contract|email|lawsuit|court)\b/i, PHONE = /\b(app|phone|download\w*|users|subscri\w*)\b/i, PRESS = /\b(headline\w*|press|papers|media|journalists|news)\b/i;
// v4: the IDEA of a sentence → a set piece (references/set-pieces.md). First match wins; at most one set per beat.
const CONCEPTS = [
  ['domino', /\b(chain reaction|domino|knock-on|one after another|cascade|triggered|led to|which led|set off)\b/i, (t, w) => `domino:x;n:5;lab:?,?,?,?,?;fall:${w}`],
  ['scale', /\b(versus|vs\.?|compared|outweigh\w*|heavier|lighter|balance|trade-?off|instead of|more than)\b/i, (t, w) => `scale:x;left:?;right:?;tip:${w};to:1`],
  ['iceberg', /\b(hidden|underneath|beneath|below the surface|surface|nobody saw|no one saw|behind the scenes|secret\w*)\b/i, (t, w) => `iceberg:x;tip:?;deep:?,?,?;dive:${w}`],
  ['mania', /\b(valuation|valued at|hype|bubble|mania|frenzy|worth \$?\d|soared to)\b/i, (t, w, dw) => `mania:x;from:1;to:?;unit:B;lab:VALUATION;pop:${dw}`],
  ['chess', /\b(rival\w*|competitor\w*|strateg\w*|outplay\w*|checkmate|out-?maneuver\w*|price war|the war)\b/i, (t, w) => `chess:x;a:@?;b:@?;move:${w};take:${w}+2`],
  ['city', /\b(market cap|grew (to|every)|every year|each year|per year|biggest|largest|year after year)\b/i, (t, w) => `city:x;vals:?,?,?;lab:?,?,?;unit:B;grow:${w}`],
  ['hourglass', /\b(months? (left|of cash)|running out|ran out|deadline|runway|burn(ing|ed)? (through|cash|money)|time was)\b/i, (t, w) => `hourglass:x;lab:CASH LEFT;left:?;dur:4`],
  ['strings', /\b(controll?\w*|pulled the strings|puppet\w*|the board|really decided|behind them|calling the shots)\b/i, (t, w) => `strings:x;img:?,?;lab:?;pull:${w}`],
  ['crack', /\b(foundation|cracks?|crumbl\w*|gave way|exposed|unravel\w*)\b/i, (t, w) => `crack:x;img:?;lab:?;split:${w}`],
  ['pipes', /\b(flow\w*|funnel\w*|poured into|money went|paid out|subsidi\w*|cash flow)\b/i, (t, w) => `pipes:x;nodes:?>?>?;img:?,?,?;cut:${w}`],
  ['ladder', /\b(promot\w*|climb\w*|rose to|rise to|from intern|to the top|career|top job)\b/i, (t, w) => `ladder:x;steps:5;img:?;lab:?,?,?,?,?;slip:${w}`],
  ['tower', /\b(depend\w* on|relied on|rested on|held up by|house of cards|fragile|one (block|pillar))\b/i, (t, w) => `tower:x;rows:9;lab:?,?,?,?;block:2;pull:${w}`]];
// v4: camera grammar per set (opening frame → the move on the key word) and for collage beats (scale changes every cut)
const SET_SHOTS = { domino: w => `1.8:pt:.2,.62|1.4:pt:.6,.6@${w}/truck|ws@${w}+1.2/dolly`, scale: w => `ws;angle:low|1.6:pt:.68,.5@${w}/dolly`, iceberg: w => `1.7:pt:.5,.3|ws/glide|2:pt:.5,.78@${w}/drop`,
  mania: (w, dw) => `ws|1.5:pt:.5,.46/glide|ws@${dw}/crash`, chess: w => `ws;angle:high|cu:pt:.55,.62@${w}/dolly;angle:low;dutch:-5`, city: w => `1.5:pt:.3,.75|ws@${w}/glide`, hourglass: w => `ms:pt:.5,.47|1.5:pt:.5,.55@${w}/dolly`,
  strings: w => `1.4:pt:.5,.55|ws@${w}/rise`, crack: w => `ws|1.6:pt:.5,.72@${w}/drop`, pipes: w => `1.6:pt:.2,.46|ws@${w}/truck`, ladder: w => `1.5:pt:.42,.8|1.5:pt:.42,.2/glide|ws@${w}/crash`, tower: w => `1.5:pt:.5,.5|ws@${w}/dolly` };
const SIZES = ['ws', 'mcu', 'ms', 'cu']; const MOVES = ['dolly', 'rack', 'truck', 'dolly', 'glide']; let lastOpen = '', shakes = 0;
const CAMS = ['push', 'panR', 'pull', 'drift', 'panL', 'vertigo', 'orbit', 'tiltU', 'hand']; const BGS = { setup: ['navy', 'paper'], rise: ['navy', 'chart'], doubt: ['news', 'navy', 'chart'], fall: ['black', 'chart'], after: ['navy', 'paper'], flash: ['paper'], lesson: ['spot'] };
const lines = fs.readFileSync(scriptF, 'utf8').split(/\r?\n/); const out = []; const files = {}; let act = 'setup', file = 'draft', n = 0, lastCam = '', lastBg = '', usedMid = {};
const firstWord = (s, re) => { const m = s.match(re); return m ? m[0].toLowerCase().replace(/[^a-z0-9$%']/g, '') : null; };
const stressed = s => s.split(/\s+/).map(w => w.replace(/[^\w$%']/g, '')).filter(w => w.length > 3).sort((a, b) => b.length - a.length);
const fmtNum = s => { const m = s.match(/\$?([\d,.]+)\s*(million|billion|trillion|thousand|%|percent)?/i); if (!m) return null; const v = m[1].replace(/,$/, ''); const u = (m[2] || '').toLowerCase(); return (s.includes('$') || /million|billion|trillion/.test(u) ? '$' : '') + v + ({ million: 'M', billion: 'B', trillion: 'T', thousand: 'K', '%': '%', percent: '%' }[u] || ''); };
const push = l => { (files[file] = files[file] || []).push(l); out.push(l); };
for (const raw of lines) { const L = raw.trim(); if (!L) continue;
  const h = L.match(/^##\s*(\S+)\s*(.*)$/); if (h) { file = h[1]; const am = h[2].match(/act=(\w+)/); if (am) act = am[1]; push(`\n// ===== ${h[1]} ${h[2]}`); continue; }
  if (/^#|^\/\//.test(L)) continue; n++;
  const hints = [...L.matchAll(/\[\[(\w+):([^\]]+)\]\]/g)].map(m => [m[1], m[2]]); const text = L.replace(/\[\[[^\]]+\]\]/g, '').replace(/\s+/g, ' ').trim(); const low = text.toLowerCase();
  const o = { act }; const fx = [], mids = [], fgs = []; const W = stressed(text);
  // MID: real cut-outs / prints whose keys appear in the sentence (people first)
  for (const a of [...byRole('cut'), ...byRole('pop'), ...byRole('prop')]) { const k = keysOf(a).find(k => k.length > 2 && low.includes(k)); if (k && mids.length < 2) mids.push(`${a.id};at:${k.split(' ')[0]}${mids.length ? ';flip' : ''}${a.role === 'prop' ? ';style:print;tape' : ''}`); }
  // BG: plate by keyword, else a place on the world map, else the act family (never the same twice)
  const plate = byRole('plate').find(a => keysOf(a).some(k => k.length > 2 && low.includes(k))); const place = Object.keys(PLACES).find(p => low.includes(p));
  if (plate) o.bg = plate.id; else if (place && !mids.length) { const [lo, la] = PLACES[place]; o.bg = 'world'; o.map = `${lo},${la},4`; fx.push(`pin:${place.toUpperCase()};ll:${lo},${la};at:${place.split(' ')[0]}`); }
  else { const fam = BGS[act] || BGS.setup; o.bg = fam.find(b => b !== lastBg) || fam[0]; if (o.bg === 'navy' && byRole('plate').length) { const p = byRole('plate')[n % byRole('plate').length]; if (p.id !== lastBg) o.bg = p.id; } }
  if (o.bg && !/^(navy|paper|black|news|chart|spot|world)$/.test(o.bg)) o.bgBlur = 10; lastBg = o.bg;
  // HERO / numbers / dates
  const ny = text.match(YEAR); const dn = [...text.matchAll(new RegExp(DIGNUM.source, 'gi'))].map(m => m[0]).find(m => !/^(1[789]\d\d|20\d\d)[,.]?\s*$/.test(m.trim()) && /\d/.test(m)) || null; const wnum = firstWord(text, NUMW);
  if (dn) { const v = fmtNum(dn); if (v) o.hero = `${v};at:${(wnum || dn.replace(/[^\w.$]/g, '')).toLowerCase()};fx:count`; } else if (wnum) o.hero = `$?;at:${wnum};fx:count` /* TODO: write the figure */;
  if (ny) o.date = ny[0];
  // events from the meaning of the sentence
  if (DOWN.test(text)) fx.push(`chart:down;at:${firstWord(text, DOWN)};lab:-?%`); else if (UP.test(text)) fx.push(`chart:up;at:${firstWord(text, UP)};lab:+?%`);
  if (DEATH.test(text)) { o.act = act === 'setup' || act === 'rise' ? act : 'fall'; const w = firstWord(text, DEATH); if (mids.length) fx.push(`shatter:1;at:${w}`); fx.push(`stamp:${w.toUpperCase().replace(/ED$/, '')};at:${w};x:.75;y:.68${o.act === 'fall' ? '' : ';col:grey'}`); }
  if (LIE.test(text) && mids.length) { const lw = firstWord(text, LIE); fx.push(`bubble:?;at:${lw}`, `strike:b1;at:${lw}+1.2`); }
  if (SAID.test(text) && /"|“/.test(text)) { const q = text.match(/["“]([^"”]+)["”]/); if (q) fx.push(`quote:${q[1]};at:${firstWord(text, SAID)};by:?`); }
  if (PRESS.test(text)) fx.push(`headline:?;src:?;at:${firstWord(text, PRESS)}`);
  if (DOC.test(text) && mids.some(m => /style:print/.test(m))) fx.push(`mark:1;at:${firstWord(text, DOC)}`, `lens:1;at:${firstWord(text, DOC)}+.5`);
  // FG: a real object if one matches, else the matching prop (keeps 3 planes)
  const fgA = byRole('prop').find(a => !mids.some(m => m.startsWith(a.id + ';')) && keysOf(a).some(k => low.includes(k)));
  if (fgA) fgs.push(`${fgA.id};x:.86;y:.99;h:.26;at:${keysOf(fgA).find(k => low.includes(k)).split(' ')[0]};style:polaroid;rot:-6`);
  else if (MONEY.test(text)) fgs.push(`@cash;x:.84;y:.97;h:.16;at:${firstWord(text, MONEY)}`); else if (DOC.test(text)) fgs.push(`@doc;x:.85;y:.98;h:.26;at:${firstWord(text, DOC)}`); else if (PHONE.test(text)) fgs.push(`@phone;x:.86;y:.9;h:.3;at:${firstWord(text, PHONE)}`); else fgs.push(`@doc;x:.88;y:.99;h:.22;at:${W[1] || 'c1'}`);
  // v4: does the sentence carry an idea a set piece can ACT? then the set replaces the collage (photos go onto the set)
  const con = CONCEPTS.find(([, re]) => re.test(text)); let setName = null;
  if (con) { setName = con[0]; const clean = x => x.toLowerCase().replace(/[^a-z0-9$%']/g, ''); const w = clean(text.match(con[1])[0].split(/\s+/)[0]); const last = clean(text.split(/\s+/).filter(x => x.replace(/\W/g, '').length > 2).pop() || w); const occ = (text.toLowerCase().match(new RegExp('\\b' + last + '\\b', 'g')) || []).length; const dw = DEATH.test(text) ? clean(firstWord(text, DEATH)) : last + (occ > 1 ? '#' + occ : ''); fx.length = 0; fx.push(con[2](text, w, dw)); mids.length = 0; fgs.length = 0; delete o.hero; delete o.date; o.solo = 1; o.shot = SET_SHOTS[setName](w, dw); }
  if (hints.length) hints.forEach(([k, v]) => { if (k === 'fx') fx.push(v); else if (k === 'mid') mids.unshift(v); else if (k === 'fg') fgs.unshift(v); else o[k] = v; });
  if (!setName) { // collage beat: open on a different scale than the last beat, move on the stressed word; crash only on a real number, ≤ 1 per ~6 beats
    const open = SIZES.find((z, i) => z !== lastOpen && (n + i) % 2 === 0) || 'ws'; const key = (o.hero && (o.hero.match(/at:([^;]+)/) || [])[1]) || (W[0] || '').toLowerCase(); const tgt = mids.length ? '1' : 'pt:.5,.45';
    const move = o.hero && /fx:count/.test(o.hero) && shakes++ % 6 === 0 ? 'crash' : MOVES[n % MOVES.length]; const end = open === 'ws' ? `mcu:${tgt}` : 'ws'; o.shot = key ? `${open}${open === 'ws' ? '' : ':' + tgt}|${end}@${key}/${move}` : open; lastOpen = open; }
  else lastOpen = 'set';
  const kv = Object.entries(o).map(([k, v]) => /[\s;|:,]/.test(String(v)) ? `${k}="${v}"` : `${k}=${v}`).join(' ');
  push(`// ${String(n).padStart(3, '0')} TODO director: refine composition, check every at:, replace ? placeholders`);
  push(`# cine ${kv}${mids.length ? ` mid="${mids.join('|')}"` : ''}${fgs.length ? ` fg="${fgs.join('|')}"` : ''}${fx.length ? ` fx="${fx.join('|')}"` : ''}`); push(text); push(''); }
const head = s => `title: ${s}\nchannel: poisonpill\nvoice: am_michael\nmusic: none\n`;
if (process.argv.includes('--split')) { const ks = Object.keys(files); ks.forEach((k, i) => { const f = `stories/${scriptF.split('/').pop().replace(/_script\.md$|\.md$/, '')}-${k}.story`; fs.writeFileSync(f, head(k) + (i < ks.length - 1 ? 'endcard: off\n' : '') + files[k].join('\n') + '\n'); console.log('wrote', f); }); }
else { const f = opt('out') || 'stories/draft.story'; fs.writeFileSync(f, head('draft') + out.join('\n') + '\n'); console.log('wrote', f, `(${n} beats) → now: node tools/pp_lint.mjs ${f}`); }
