/* TYPEKIT — art-directed title lettering for any beat (not subtitles). One call, twelve looks, each with its own
   font role, entrance, life and exit, tuned on the craft rules in references/typography.md.
     beat keys (any beat):  art="BIG LINE|small line"  artfx=slam  artAt=.3  artOut=4  artX=.5  artY=.22  artCol=#ffd34a  artSize=1
     in code:               TYPE.draw('slam', 'BIG|small', lt, { at:.3, x:.5, y:.22, col:'#ffd34a', size:1, out:4 })
   Looks (artfx):
     slam    Anton, 2.4× → 1 overshoot, colour misregistration, shock ring          hook numbers, rules, verdicts
     stack   Anton words stacked to one justified block, each word slams in          hook statements ("NEVER|RUN")
     count   Anton number rolls up from 0 (keeps prefix/suffix and separators)        stats: 7,000,000 · 1,288 · 50.000 ₫
     stamp   red ink seal, drops and thuds, inked texture                            BANNED · CHECKED · 1288 · SOLD OUT
     typeon  Oswald typewriter card with cursor                                      place/date cards: HÀ NỘI · 1945
     mask    Playfair serif rises out of a mask line, slow tracking-in, hairline      chapter/trailer titles, history
     gold    Playfair metallic gradient + moving glint                               dynasties, victories, luxury
     neon    Pacifico/Bungee tube sign, flickers on, glow                            night markets, bars, Saigon nights
     comic   Bangers onomatopoeia on a halftone starburst, jitter on twos            BEEP! · WHOOSH · CRACK (Spider-Verse)
     hand    Patrick Hand note written on, scribbled underline                       tips, asides, "pro tip"
     split   Anton cut in half, halves slide in from opposite sides and lock         versus, turns, before/after
     sign    Bungee street sign plate (yellow/black)                                 rules of the road, warnings
   Accent: wrap a word in *stars* to colour it with artCol (stack / slam / mask). */
(function () {
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const eo = t => 1 - Math.pow(1 - cl(t), 3), eio = t => { t = cl(t); return t * t * (3 - 2 * t); };
  const back = t => { t = cl(t); const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const rgba = (c, a) => { if (!c || c[0] !== '#') return c; const n = parseInt(c.slice(1, 7), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const vert = () => H > W;
  const fitSize = (s, role, size, maxW, ls = 0) => { ctx.save(); setFont(size, role); ctx.letterSpacing = ls + 'px'; const w = ctx.measureText(s).width; ctx.restore(); return w > maxW ? size * maxW / w : size; };
  const wid = (s, role, size, ls = 0) => { ctx.save(); setFont(size, role); ctx.letterSpacing = ls + 'px'; const w = ctx.measureText(s).width; ctx.restore(); return w; };
  // one text draw: stroke, hard or soft shadow, fill (colour or gradient); registers a lint box so qa sees it
  function tx(s, x, y, o) {
    ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); if (o.sc) ctx.scale(o.sc, o.sc * (o.sy || 1)); if (o.skew) ctx.transform(1, 0, o.skew, 1, 0, 0);
    ctx.globalAlpha *= (o.a ?? 1); setFont(o.size, o.role); ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = (o.ls || 0) + 'px';
    if (typeof LINT !== 'undefined' && LINT.on) { const tag = LINT.tag; LINT.tag = 'text'; lintText(s, o.size, o.align || 'center'); LINT.tag = tag; }
    if (o.hard) { ctx.fillStyle = o.hardCol || '#120a14'; if (o.lw) { ctx.lineWidth = o.lw; ctx.strokeStyle = o.hardCol || '#120a14'; ctx.lineJoin = 'round'; ctx.strokeText(s, o.hard, o.hard); } ctx.fillText(s, o.hard, o.hard); }
    if (o.soft) { ctx.shadowColor = o.softCol || 'rgba(0,0,0,.5)'; ctx.shadowBlur = o.soft; ctx.shadowOffsetY = o.soft * .3; }
    if (o.lw) { ctx.lineJoin = 'round'; ctx.miterLimit = 2; ctx.lineWidth = o.lw; ctx.strokeStyle = o.stroke || '#140c18'; ctx.strokeText(s, 0, 0); ctx.shadowColor = 'transparent'; }
    ctx.fillStyle = o.fill || '#fff'; ctx.fillText(s, 0, 0); ctx.restore();
  }
  // words with *accent* marks → [[word, accent]]
  const marks = s => String(s).split(/\s+/).filter(Boolean).map(w => /^\*.*\*$/.test(w) ? [w.slice(1, -1), 1] : [w.replace(/\*/g, ''), 0]);
  const plain = s => String(s || '').replace(/\*/g, '');
  const offs = {}; const off = (k, w, h) => { let c = offs[k]; if (!c || c.width !== w || c.height !== h) { c = offs[k] = document.createElement('canvas'); c.width = w; c.height = h; } const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); return [c, g]; };

  const S = {};
  S.slam = (a, b, p, o) => { const u = U(), x = o.x, y = o.y; const words = marks(a); const s0 = fitSize(plain(a), 'impact', o.size * (vert() ? 170 : 150) * u, o.maxW);
    const k = p < .18 ? 2.4 - 1.4 * eo(p / .18) : 1 + Math.sin((p - .18) * 28) * Math.exp(-(p - .18) * 8) * .05, al = cl(p / .08);
    if (p > .16 && p < .7) { const q = (p - .16) / .54; ctx.save(); ctx.globalAlpha *= (1 - q) * .7; ctx.strokeStyle = o.col; ctx.lineWidth = 10 * u * (1 - q); ctx.beginPath(); ctx.ellipse(x, y, (wid(plain(a), 'impact', s0) * .55 + 40 * u) * (1 + q * .5), s0 * (.7 + q * .6), 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    const mis = (1 - cl((p - .1) / .5)) * 16 * u, tw = words.reduce((s, [w]) => s + wid(w + ' ', 'impact', s0), 0) - wid(' ', 'impact', s0);
    const drawLine = (dx, fillOver, lw) => { let cx = x - tw / 2 * k; for (const [w, acc] of words) { const ww = wid(w, 'impact', s0) * k; tx(w, cx + ww / 2 + dx, y, { size: s0, sc: k, role: 'impact', fill: fillOver || (acc ? o.col : '#fff'), lw, a: al, soft: lw ? 18 * u : 0 }); cx += ww + wid(' ', 'impact', s0) * k; } };
    if (mis > .5) { ctx.save(); ctx.globalCompositeOperation = 'screen'; drawLine(-mis, '#00d9ff', 0); drawLine(mis, '#ff2d6f', 0); ctx.restore(); }
    drawLine(0, null, s0 * .11);
    if (b) { const q = eo((p - .3) / .35), s1 = fitSize(b, 'cond', o.size * (vert() ? 64 : 54) * u, o.maxW, 8 * u); tx(b.toUpperCase(), x, y + s0 * .72 + (1 - q) * 30 * u, { size: s1, role: 'cond', ls: 8 * u, fill: o.col, lw: s1 * .16, a: q, soft: 10 * u }); } };
  S.stack = (a, b, p, o) => { const u = U(); const ws = marks(a); const bw = o.maxW * (vert() ? .92 : .62); let y = o.y - (vert() ? 90 : 70) * u * (ws.length - 1) * .5;
    ws.forEach(([w, acc], i) => { const s = Math.min(o.size * (vert() ? 260 : 210) * u, fitSize(w.toUpperCase(), 'impact', 400 * u, bw)); const q = (p - i * .11); if (q <= 0) { y += s * .9; return; }
      const k = q < .14 ? 1.9 - .9 * eo(q / .14) : 1; tx(w.toUpperCase(), o.x, y + s * .45, { size: s, sc: k, role: 'impact', fill: acc || (i === ws.length - 1 && !ws.some(z => z[1])) ? o.col : '#fff', lw: s * .08, hard: 8 * u, a: cl(q / .06) }); y += s * .9; });
    if (b) { const q = eo((p - ws.length * .11 - .15) / .3); tx(b.toUpperCase(), o.x, y + 40 * u, { size: fitSize(b, 'cond', 52 * u * o.size, bw, 6 * u), role: 'cond', ls: 6 * u, fill: '#fff', lw: 8 * u, a: q }); } };
  S.count = (a, b, p, o) => { const u = U(); const m = String(a).match(/^(.*?)(\d[\d.,\s]*\d|\d)(.*)$/); let shown = a;
    if (m) { const raw = m[2], sep = /\d[.,]\d{3}/.test(raw) ? (raw.match(/[.,\s]/) || [''])[0] : '', val = +raw.replace(/[.,\s]/g, ''), c = eio(p / 1.2), v = Math.round(val * c);
      shown = m[1] + (sep ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(v)) + m[3]; }
    const s0 = fitSize(a, 'impact', o.size * (vert() ? 190 : 160) * u, o.maxW), done = p > 1.2, pop = done ? 1 + Math.exp(-(p - 1.2) * 10) * .12 : 1;
    if (done) { const q = cl((p - 1.2) / .5); ctx.save(); ctx.globalAlpha *= (1 - q) * .6; ctx.strokeStyle = o.col; ctx.lineWidth = 8 * u; ctx.beginPath(); ctx.arc(o.x, o.y, s0 * (.6 + q * 1.4), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    tx(shown, o.x, o.y, { size: s0, sc: pop, role: 'impact', fill: done ? o.col : '#fff', lw: s0 * .1, soft: 20 * u, a: cl(p / .1) });
    if (b) tx(b.toUpperCase(), o.x, o.y + s0 * .75, { size: fitSize(b, 'cond', o.size * 58 * u, o.maxW, 8 * u), role: 'cond', ls: 8 * u, fill: '#fff', lw: 10 * u, a: eo((p - .5) / .4) }); };
  S.stamp = (a, b, p, o) => { const u = U(); const col = o.colSet ? o.col : '#d0202f'; const s0 = fitSize(a, 'impact', o.size * (vert() ? 120 : 104) * u, o.maxW * .8, 4 * u);
    const tw = wid(a, 'impact', s0, 4 * u), s1 = b ? Math.min(s0 * .32, fitSize(b, 'cond', 40 * u, tw, 5 * u)) : 0, bw = tw + 70 * u, bh = s0 * 1.18 + (b ? s1 * 1.5 : 0);
    const k = p < .14 ? 1.9 - .9 * eo(p / .14) : 1 + Math.sin((p - .14) * 30) * Math.exp(-(p - .14) * 12) * .03; if (p <= 0) return;
    const cw = Math.ceil(bw + 40 * u), chh = Math.ceil(bh + 40 * u); const [cv, g] = off('stamp', cw, chh); const ox = cw / 2, oy = chh / 2;
    g.fillStyle = 'rgba(250,244,230,.82)'; g.fillRect(ox - bw / 2, oy - bh / 2, bw, bh); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 14 * u; g.strokeRect(ox - bw / 2, oy - bh / 2, bw, bh); g.lineWidth = 3 * u; g.strokeRect(ox - bw / 2 + 12 * u, oy - bh / 2 + 12 * u, bw - 24 * u, bh - 24 * u);
    g.font = `400 ${s0}px ${FONT.impact}`; g.letterSpacing = 4 * u + 'px'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(a, ox, oy - (b ? s1 * .7 : 0));
    if (b) { g.font = `700 ${s1}px ${FONT.cond}`; g.letterSpacing = 5 * u + 'px'; g.fillText(b.toUpperCase(), ox, oy + s0 * .5); }
    g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 200; i++) { const r = hash(i) ** 3 * 5 * u + .5 * u; g.globalAlpha = .4 + hash(i + 9) * .6; g.beginPath(); g.arc(hash(i + 1) * cw, hash(i + 2) * chh, r, 0, Math.PI * 2); g.fill(); }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(-.08); ctx.scale(k, k); ctx.globalAlpha *= cl(p / .06) * .94; ctx.drawImage(cv, -ox, -oy); ctx.restore();
    if (typeof LINT !== 'undefined' && LINT.on) LINT.boxes.push({ k: 'text', s: a, x0: o.x - bw / 2, y0: o.y - bh / 2, x1: o.x + bw / 2, y1: o.y + bh / 2 }); };
  S.typeon = (a, b, p, o) => { const u = U(); const A = Array.from(plain(a).normalize('NFC').toUpperCase()), B = Array.from((b || '').normalize('NFC').toUpperCase()); const cps = 20;
    const n = Math.floor(p * cps), na = Math.min(A.length, n), nb = cl(n - A.length - 4, 0, B.length); const s0 = fitSize(A.join(''), 'cond', o.size * (vert() ? 74 : 64) * u, o.maxW * .86, 6 * u), s1 = s0 * .6;
    const w = Math.max(wid(A.join(''), 'cond', s0, 6 * u), B.length ? wid(B.join(''), 'cond', s1, 4 * u) : 0) + 60 * u, h = s0 * 1.5 + (B.length ? s1 * 1.6 : 0), x0 = o.x - w / 2;
    ctx.save(); ctx.globalAlpha *= cl(p / .1) * .62; ctx.fillStyle = '#0b0b10'; ctx.fillRect(x0, o.y - s0 * .8, w * eo(p / .25), h); ctx.restore();
    ctx.save(); ctx.fillStyle = o.col; ctx.fillRect(x0, o.y - s0 * .8, 8 * u, h * eo(p / .25)); ctx.restore();
    const ta = A.slice(0, na).join(''); tx(ta, x0 + 30 * u, o.y, { size: s0, role: 'cond', ls: 6 * u, align: 'left', fill: '#fff' });
    if (B.length) tx(B.slice(0, nb).join(''), x0 + 30 * u, o.y + s0 * 1.05, { size: s1, role: 'cond', ls: 4 * u, align: 'left', fill: o.col });
    const blink = Math.floor(p * 3.4) % 2 === 0 || n < A.length + B.length + 4; if (blink) { const cxp = nb > 0 || n >= A.length + 4 && B.length ? x0 + 30 * u + wid(B.slice(0, nb).join(''), 'cond', s1, 4 * u) : x0 + 30 * u + wid(ta, 'cond', s0, 6 * u); const cy = nb > 0 || (n >= A.length + 4 && B.length) ? o.y + s0 * 1.05 : o.y; const ss = cy === o.y ? s0 : s1;
      ctx.save(); ctx.fillStyle = o.col; ctx.fillRect(cxp + 6 * u, cy - ss * .42, ss * .45, ss * .84); ctx.restore(); } };
  S.mask = (a, b, p, o) => { const u = U(); const s0 = fitSize(plain(a), 'serif', o.size * (vert() ? 132 : 120) * u, o.maxW * .86, 18 * u), ls0 = (2 + 16 * (1 - eo(p / 2.2))) * u;
    const lines = [[plain(a), 'serif', s0, ls0, '#fff6e6', 0]]; if (b) lines.push([b.toUpperCase(), 'cond', Math.min(s0 * .42, fitSize(b.toUpperCase(), 'cond', 64 * u, o.maxW * .8, 20 * u)), (6 + 14 * (1 - eo(p / 2.2))) * u, o.col, .28]);
    let y = o.y; lines.forEach(([s, role, sz, ls, fill, delay], i) => { const q = eo((p - delay) / .7); const lh = sz * 1.3; ctx.save(); ctx.beginPath(); ctx.rect(0, y - lh / 2, W, lh); ctx.clip();
      tx(s, o.x, y + (1 - q) * lh, { size: sz, role, ls, fill, soft: 24 * u, softCol: 'rgba(0,0,0,.7)', lw: i ? sz * .12 : sz * .05, stroke: 'rgba(20,10,20,.85)' }); ctx.restore();
      if (i === 0) { const r = eio((p - .25) / .8), rw = wid(s, role, sz, ls) * .5 * r; ctx.save(); ctx.strokeStyle = rgba(o.col, .9); ctx.lineWidth = 2.5 * u; ctx.beginPath(); ctx.moveTo(o.x - rw, y + lh * .52); ctx.lineTo(o.x + rw, y + lh * .52); ctx.stroke(); ctx.restore(); }
      y += lh * (i === 0 ? .98 : 1); }); };
  S.gold = (a, b, p, o) => { const u = U(); const s0 = fitSize(plain(a), 'serif', o.size * (vert() ? 150 : 130) * u, o.maxW * .88, 3 * u), k = 1.1 - .1 * eo(p / .9), al = eo(p / .6);
    const tw = wid(plain(a), 'serif', s0, 3 * u), cw = Math.ceil(tw + 80 * u), chh = Math.ceil(s0 * 1.6); const [cv, g] = off('gold', cw, chh); const ox = cw / 2, oy = chh / 2;
    g.font = `900 ${s0}px ${FONT.serif}`; g.letterSpacing = 3 * u + 'px'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const gr = g.createLinearGradient(0, oy - s0 * .5, 0, oy + s0 * .5); [['#fff3c4', 0], ['#f2c75c', .35], ['#a8691c', .55], ['#f7d778', .75], ['#6b3c0b', 1]].forEach(([c, t]) => gr.addColorStop(t, c));
    g.lineJoin = 'round'; g.lineWidth = s0 * .07; g.strokeStyle = '#3a1f06'; g.strokeText(plain(a), ox, oy); g.fillStyle = gr; g.fillText(plain(a), ox, oy);
    g.globalCompositeOperation = 'source-atop'; const gx = -cw * .3 + ((p * .55) % 1.6) * cw * 1.1; const sh = g.createLinearGradient(gx - 60 * u, 0, gx + 60 * u, 0); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(.5, 'rgba(255,255,240,.85)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sh; g.setTransform(1, 0, -.4, 1, oy * .4, 0); g.fillRect(0, 0, cw, chh); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.translate(o.x, o.y); ctx.scale(k, k); ctx.globalAlpha *= al; ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 26 * u; ctx.shadowOffsetY = 10 * u; ctx.drawImage(cv, -ox, -oy); ctx.restore();
    if (typeof LINT !== 'undefined' && LINT.on) LINT.boxes.push({ k: 'text', s: a, x0: o.x - tw / 2, y0: o.y - s0 / 2, x1: o.x + tw / 2, y1: o.y + s0 / 2 });
    if (b) tx(b.toUpperCase(), o.x, o.y + s0 * .78, { size: Math.min(s0 * .38, fitSize(b, 'cond', 60 * u, o.maxW * .8, 10 * u)), role: 'cond', ls: 10 * u, fill: '#f6e3b0', lw: 8 * u, stroke: '#3a1f06', soft: 14 * u, a: eo((p - .5) / .5) }); };
  S.neon = (a, b, p, o) => { const u = U(); const role = o.role || 'script', col = o.colSet ? o.col : '#ff4fa3'; const s0 = fitSize(plain(a), role, o.size * (vert() ? 130 : 112) * u, o.maxW);
    const f = Math.floor(p * 24), on = p > .06 && !(p < .8 && hash(f) < .4) && !(p > 2 && hash(f + 77) < .02), hum = .92 + Math.sin(p * 40) * .04;
    const tube = (s, x, y, sz, c, r) => { if (!on) { tx(s, x, y, { size: sz, role: r, fill: rgba(c, .18), lw: sz * .05, stroke: rgba(c, .3) }); return; }
      ctx.save(); ctx.globalAlpha *= hum; ctx.shadowColor = c; for (const [bl, lw] of [[44, .1], [20, .06]]) { ctx.shadowBlur = bl * u; tx(s, x, y, { size: sz, role: r, fill: 'rgba(0,0,0,0)', lw: sz * lw, stroke: c }); } ctx.restore();
      tx(s, x, y, { size: sz, role: r, fill: '#fff4fb', lw: sz * .025, stroke: '#ffd8ef', a: hum }); };
    tube(plain(a), o.x, o.y, s0, col, role); if (b) tube(b.toUpperCase(), o.x, o.y + s0 * .85, Math.min(s0 * .4, fitSize(b.toUpperCase(), 'sign', 54 * u, o.maxW)), '#46e8ff', 'sign'); };
  S.comic = (a, b, p, o) => { const u = U(); const s0 = fitSize(plain(a).toUpperCase(), 'comic', o.size * (vert() ? 170 : 150) * u, o.maxW * .8, 3 * u), k = back(p / .22), j = Math.floor(p * 12), jx = (hash(j) - .5) * 6 * u, jy = (hash(j + 3) - .5) * 6 * u;
    if (p <= 0) return; const tw = wid(plain(a).toUpperCase(), 'comic', s0, 3 * u), R = Math.max(tw * .62, s0 * .9);
    ctx.save(); ctx.translate(o.x + jx, o.y + jy); ctx.rotate(-.06); ctx.scale(k, k);
    const burst = () => { ctx.beginPath(); for (let i = 0; i < 28; i++) { const an = i / 28 * Math.PI * 2, rr = (i % 2 ? .72 : 1.08 + hash(i) * .2) * R; ctx.lineTo(Math.cos(an) * rr * 1.12, Math.sin(an) * rr * .62); } ctx.closePath(); };
    burst(); ctx.fillStyle = '#120a14'; ctx.save(); ctx.translate(10 * u, 10 * u); ctx.fill(); ctx.restore(); burst(); ctx.fillStyle = o.colSet ? o.col : '#ff3b30'; ctx.fill(); ctx.lineWidth = 7 * u; ctx.strokeStyle = '#120a14'; ctx.stroke();
    ctx.save(); burst(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.22)'; const st = 16 * u; for (let yy = -R; yy < R; yy += st) for (let xx = -R * 1.3; xx < R * 1.3; xx += st) { const rr = st * .32 * (1 - Math.hypot(xx, yy) / (R * 1.4)); if (rr > .5) { ctx.beginPath(); ctx.arc(xx + (yy / st % 2 ? st / 2 : 0), yy, rr, 0, Math.PI * 2); ctx.fill(); } } ctx.restore();
    ctx.restore();
    tx(plain(a).toUpperCase(), o.x + jx, o.y + jy, { size: s0, sc: k, rot: -.06, skew: -.12, role: 'comic', ls: 3 * u, fill: '#ffe14a', lw: s0 * .14, hard: 7 * u });
    if (b) tx(b.toUpperCase(), o.x, o.y + R * .8, { size: s0 * .32, role: 'comic', ls: 2 * u, fill: '#fff', lw: s0 * .06, a: eo((p - .25) / .2), rot: -.06 }); };
  S.hand = (a, b, p, o) => { const u = U(); const s0 = fitSize(plain(a), 'hand', o.size * (vert() ? 96 : 84) * u, o.maxW), tw = wid(plain(a), 'hand', s0), q = eio(p / (.25 + plain(a).length * .035));
    ctx.save(); ctx.beginPath(); ctx.rect(o.x - tw / 2 - 20 * u, o.y - s0, (tw + 40 * u) * q, s0 * 2); ctx.clip(); tx(plain(a), o.x, o.y, { size: s0, role: 'hand', fill: o.colSet ? o.col : '#fff', lw: s0 * .12, rot: -.03, hard: 4 * u }); ctx.restore();
    const r = eio((p - .2) / .5); if (r > 0) { ctx.save(); ctx.strokeStyle = o.colSet ? o.col : '#ffd34a'; ctx.lineWidth = 7 * u; ctx.lineCap = 'round'; ctx.beginPath(); const x0 = o.x - tw / 2, y0 = o.y + s0 * .58; for (let i = 0; i <= 40 * r; i++) { const t = i / 40; ctx.lineTo(x0 + tw * t, y0 + Math.sin(t * 9) * 3 * u - t * 10 * u); } ctx.stroke(); ctx.restore(); }
    if (b) tx(b, o.x + tw * .1, o.y + s0 * 1.2, { size: s0 * .55, role: 'hand', fill: '#fff', lw: s0 * .07, rot: -.03, a: eo((p - .7) / .3) }); };
  S.split = (a, b, p, o) => { const u = U(); const s = plain(a).toUpperCase(), s0 = fitSize(s, 'impact', o.size * (vert() ? 170 : 150) * u, o.maxW), q = eo(p / .45), d = (1 - q) * W * .6;
    for (const [top, dir] of [[1, -1], [0, 1]]) { ctx.save(); ctx.beginPath(); ctx.rect(0, top ? o.y - s0 : o.y, W, s0); ctx.clip(); tx(s, o.x + dir * d, o.y, { size: s0, role: 'impact', fill: top ? '#fff' : o.col, lw: s0 * .1, soft: 16 * u }); ctx.restore(); }
    if (p > .45 && p < .75) { ctx.save(); ctx.globalAlpha *= 1 - (p - .45) / .3; ctx.fillStyle = '#fff'; ctx.fillRect(0, o.y - 2 * u, W, 4 * u); ctx.restore(); }
    if (b) tx(b.toUpperCase(), o.x, o.y + s0 * .75, { size: fitSize(b, 'cond', o.size * 56 * u, o.maxW, 8 * u), role: 'cond', ls: 8 * u, fill: '#fff', lw: 9 * u, a: eo((p - .5) / .3) }); };
  S.sign = (a, b, p, o) => { const u = U(); const s = plain(a).toUpperCase(), s0 = fitSize(s, 'sign', o.size * (vert() ? 84 : 72) * u, o.maxW * .8), tw = wid(s, 'sign', s0), s1 = b ? s0 * .42 : 0;
    const bw = tw + 80 * u, bh = s0 * 1.5 + (b ? s1 * 1.6 : 0), k = back(p / .3), sw = Math.sin(p * 3) * Math.exp(-p * 1.5) * .06; if (p <= 0) return;
    ctx.save(); ctx.translate(o.x, o.y - bh * .3); ctx.rotate(sw); ctx.scale(1, k); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-bw / 2 + 10 * u, 10 * u, bw, bh); ctx.fillStyle = o.colSet ? o.col : '#ffcf1f'; ctx.fillRect(-bw / 2, 0, bw, bh);
    ctx.lineWidth = 8 * u; ctx.strokeStyle = '#141414'; ctx.strokeRect(-bw / 2 + 12 * u, 12 * u, bw - 24 * u, bh - 24 * u);
    ctx.restore(); tx(s, o.x, o.y - bh * .3 + s0 * .8 * k, { size: s0, sy: k, sc: 1, role: 'sign', fill: '#141414', rot: sw });
    if (b) tx(b.toUpperCase(), o.x, o.y - bh * .3 + (s0 * 1.5 + s1 * .4) * k, { size: s1, sy: k, sc: 1, role: 'cond', ls: 5 * u, fill: '#141414', rot: sw }); };

  const TYPE = window.TYPE = { styles: Object.keys(S) };
  TYPE.draw = (style, text, lt, o = {}) => { const fn = S[style] || S.slam; const [a, b] = String(text).split('|'); const at = o.at ?? .3; const p = lt - at; if (p < 0) return;
    let al = 1, sc = 1; if (o.out && lt > o.out) { const q = cl((lt - o.out) / .3); al = 1 - q; sc = 1 - q * .04; if (al <= 0) return; }
    const oo = { x: (o.x ?? .5) * W, y: (o.y ?? (vert() ? .24 : .22)) * H, col: o.col || '#ffd34a', colSet: !!o.col, size: o.size || 1, role: o.role, maxW: W * (vert() ? .84 : .72) };
    ctx.save(); if (al < 1) { ctx.globalAlpha *= al; ctx.translate(oo.x, oo.y); ctx.scale(sc, sc); ctx.translate(-oo.x, -oo.y); } fn(a, b, p, oo); ctx.restore(); };
  // the sound each look makes on entry (tools/sound_design.py reads the same table)
  TYPE.sfx = { slam: 'impact', stack: 'thud', count: 'tick_roll', stamp: 'stamp', typeon: 'typing', mask: 'riser_hit', gold: 'shimmer', neon: 'neon_buzz', comic: 'pop', hand: 'pen_draw', split: 'whoosh', sign: 'thud' };
})();
