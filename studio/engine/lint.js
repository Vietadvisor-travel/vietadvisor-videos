/* LINT — automatic QA so the agent doesn't have to eyeball dozens of frames.
   lintEpisode() → { issues: [...], summary } — text rules + sampled visual collision checks. */
'use strict';
// tag captions & faces
const _capLint = caption; caption = function (...a) { const p = LINT.tag; LINT.tag = 'caption'; try { return _capLint(...a); } finally { LINT.tag = p; } };
const _personLint = person; person = function (x, y, s, spec, o = {}) { _personLint(x, y, s, spec, o); if (!LINT.on || (o.alpha ?? 1) < .3 || LINT.tag === 'bg') return; const b = bodyOf(spec); const hy = y - s * (b.leg + b.torso + b.head * .95) * (o.pose === 'sit' || o.pose === 'sitHold' ? .82 : 1); const m = ctx.getTransform(); const px = m.a * x + m.c * hy + m.e, py = m.b * x + m.d * hy + m.f, r = Math.hypot(m.a, m.b) * s * b.head * .95; LINT.boxes.push({ k: 'face', ent: LINT.entering, s: spec.seed, x0: px - r, y0: py - r, x1: px + r, y1: py + r }); };
const _propLint = drawProp; drawProp = function (name, x, y, s = 1, o = {}, t = 0) { _propLint(name, x, y, s, o, t); if (!LINT.on || LINT.tag !== 'world' || ctx.globalAlpha < .3) return; const p = PROP[name]; if (!p || ['cloud', 'sun', 'moon', 'wave'].includes(name)) return; const m = ctx.getTransform(); const X = (a, b) => m.a * a + m.c * b + m.e, Y = (a, b) => m.b * a + m.d * b + m.f; const xs = [X(x - p.w * s / 2, y), X(x + p.w * s / 2, y - p.h * s)], ys = [Y(x - p.w * s / 2, y), Y(x + p.w * s / 2, y - p.h * s)]; LINT.boxes.push({ k: 'prop', s: name, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }); };
const BANNED = ['hidden gem', 'bucket list', 'must-visit', 'before you die', 'paradise on earth', 'wanderlust', 'nestled', 'boasts', 'a testament to', 'vibrant tapestry', 'best in vietnam', 'the best '];
function lintEpisode(step = .25) {
  const issues = []; const add = (sev, scene, t, msg) => issues.push({ sev, scene, t: +(+t).toFixed(2), msg });
  // ---- text / structure rules
  let prevTr = null;
  EP.scenes.forEach((s0, k) => { const S = vmerge(s0), st = _starts[k];
    (S.captions || []).forEach(c => { const words = c[2].replace(/[\*\[\]]/g, '').split(/\s+/).filter(Boolean).length, d = c[1] - c[0];
      if (words / d > (words <= 4 ? 4.2 : 3.6)) add('warn', s0.id, st + c[0], `caption too fast (${(words / d).toFixed(1)} w/s): "${c[2].slice(0, 50)}"`);
      if (words > 18) add('warn', s0.id, st + c[0], `caption too long (${words} words) — split it`);
      const low = c[2].toLowerCase(); BANNED.forEach(b => { if (low.includes(b)) add('error', s0.id, st + c[0], `banned phrase "${b}"`); });
      if (/₫|vnd/i.test(c[2]) && !/\$/.test(c[2])) add('warn', s0.id, st + c[0], 'price in VND without ≈USD'); });
    (S.layers || []).forEach(L0 => { const L = vmerge(L0); if (L.type === 'ui' && L.name === 'price' && L.o) { if (!L.o.usd) add('warn', s0.id, st, 'price tag missing usd'); if (!L.o.checked) add('error', s0.id, st, 'price tag missing "checked" date'); } });
    const tr = vmerge(s0.transition || {}); if (k > 0 && tr.type && tr.type !== 'cut' && tr.type === prevTr) add('warn', s0.id, st, `same transition "${tr.type}" twice in a row`); prevTr = tr.type;
    if (S.dur > 12 && !((S.coverage || []).length > 1)) add('warn', s0.id, st, `scene is ${S.dur.toFixed(1)} s — over 12 s without a cut`);
    if (!S.render && !(S.moves || []).length && !(S.cam || []).length && S.dur > 3.5) add('info', s0.id, st, 'no camera move — add drift/pushIn');
  });
  if (EP.scenes.length && !(EP.scenes[EP.scenes.length - 1].layers || []).some(l => l.name === 'endFrame')) add('error', 'end', episodeDuration(), 'missing end frame (— Vietadvisor)');
  const first = vmerge(EP.scenes[0]); if (!(first.captions || []).length || first.captions[0][0] > .4) add('warn', EP.scenes[0].id, 0, 'no text on screen in the first 0.4 s (hook)');
  // ---- sampled visual checks
  const V = H > W, safeTop = V ? H * .14 : 0, safeBot = V ? H * .86 : H;
  const ov = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
  const dur = episodeDuration(); LINT.on = true;
  const inTrans = t => EP.scenes.some((s, k) => { if (!k) return false; const d = (vmerge(s.transition || {}).dur ?? .5); return Math.abs(t - _starts[k]) < d / 2 + .1; });
  for (let t = .1; t < dur; t += step) { if (inTrans(t)) continue; LINT.boxes = []; renderEpisode(t); const bx = LINT.boxes; let k = 0; while (k < EP.scenes.length - 1 && t >= _starts[k + 1]) k++; const sid = EP.scenes[k].id;
    const caps = bx.filter(b => b.k === 'caption'), faces = bx.filter(b => b.k === 'face'), texts = bx.filter(b => b.k === 'ui');
    for (const c of caps) { for (const f of faces) { const a = ov(c, f); if (a > (f.x1 - f.x0) * (f.y1 - f.y0) * .12) add('warn', sid, t, `caption covers a face ("${c.s}")`); } for (const x of texts) if (ov(c, x) > 40 * 40) add('warn', sid, t, `caption overlaps on-screen text "${x.s}"`); if (V && (c.y0 < safeTop || c.y1 > safeBot)) add('warn', sid, t, `caption outside 9:16 safe zone`); }
    for (const p of bx.filter(b => b.k === 'phys')) add(p.sev, sid, t, 'FLOAT/physics: ' + p.s);
    const props = bx.filter(b => b.k === 'prop' && (b.x1 - b.x0) * (b.y1 - b.y0) > 50 * 50);
    for (const c of caps) for (const p of props) if (ov(c, p) > (p.x1 - p.x0) * (p.y1 - p.y0) * .3) add('warn', sid, t, `caption hides prop "${p.s}" — move the prop up or the caption (capY)`);
    const S = vmerge(EP.scenes[k]);
    if (!S.render) { const faces2 = faces.filter(f => !f.ent); const onF = faces2.filter(f => (f.x0 + f.x1) / 2 > 0 && (f.x0 + f.x1) / 2 < W && (f.y0 + f.y1) / 2 > 0 && (f.y0 + f.y1) / 2 < H);
      if (!S.coverage) for (const f of faces2) if (!onF.includes(f) && t - _starts[k] > 1) add('warn', sid, t, `a character's face is off-frame`);
      for (let i = 0; i < onF.length; i++) for (let j = i + 1; j < onF.length; j++) { const a = onF[i], b = onF[j]; if (ov(a, b) > Math.min((a.x1 - a.x0) * (a.y1 - a.y0), (b.x1 - b.x0) * (b.y1 - b.y0)) * .3) add('warn', sid, t, 'two characters overlap (faces) — spread x'); }
      if (onF.length) { const big = Math.max(...onF.map(f => f.x1 - f.x0)); if (big < Math.min(W, H) * .06 && !texts.length) add('warn', sid, t, 'subject too small — scale up the characters or zoom (cam z)');
        const topMost = Math.min(...onF.map(f => f.y0), ...texts.map(x => x.y0), ...props.map(p => p.y0)); if (topMost > H * (V ? .5 : .55)) add('info', sid, t, 'empty top half — raise the subject, zoom in, or put a title/UI up there'); } }
    for (const x of bx.filter(b => b.k === 'caption' || b.k === 'ui')) if (x.x0 < -4 || x.x1 > W + 4 || x.y0 < -4 || x.y1 > H + 4) add('warn', sid, t, `text cut off at frame edge: "${x.s}"`);
    if (V) for (const x of texts) if ((x.y0 + x.y1) / 2 < H * .08 || (x.y0 + x.y1) / 2 > H * .9) add('info', sid, t, `text near 9:16 UI area: "${x.s}"`);
  }
  LINT.on = false;
  // merge repeats: same scene+msg → first time + count
  const m = new Map(); for (const i of issues) { const key = i.scene + '|' + i.msg; if (!m.has(key)) m.set(key, { ...i, n: 1 }); else m.get(key).n++; }
  const out = [...m.values()].filter(i => !/cut off|covers a face|overlaps|safe zone|hides prop|off-frame|overlap \(faces\)|too small|empty top/.test(i.msg) || i.n >= 3).sort((a, b) => a.t - b.t);
  return { issues: out, summary: { errors: out.filter(i => i.sev === 'error').length, warnings: out.filter(i => i.sev === 'warn').length, info: out.filter(i => i.sev === 'info').length, duration: +dur.toFixed(1), scenes: EP.scenes.length, format: `${W}x${H}` } };
}
