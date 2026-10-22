/* Poison Pill v4.2 — FUN PACK: comedy timing for a lighter, funnier, easier film (`tone: playful`). Real photos only —
   NO cartoon characters, no mascots. The joke lives in the writing and the edit: the freeze-frame, the expectation vs
   reality cut, the deadpan aside, the silly equation, the dramatic punch-in. Pure Canvas2D, fast.
   freeze    img:<photo> · pt:.42,.35 · cap:Yep. That's Adam. · sub:<line> · at:<word>    record scratch, freeze-frame, circled
   expect    left:<img>,EXPECTATION · right:<img>,REALITY · go:<word>                    expectation vs reality
   cutaway   text:MEANWHILE… · sub:AT THE BOARD MEETING · at:<word>                       the comic title card
   dramatic  img:<face photo> · pt:.5,.35 · at:<word>                                     three punch-ins: dun… dun… DUN
   math      eq:HOLLYWOOD STARS+10-MINUTE SHOWS=$0 (or @img terms) · go:<word>            the silly equation
   aside     (overlay) text:(It was not fine.) · at:<word>                                a deadpan narrator aside, top left
   meme      (overlay) text:<top line> · at:<word>                                        a bold meme caption across the top */
(function () {
  if (!window.PPCINE) return; const { EXT, num, split, toned, HAS, PP, LOOK } = window.PPCINE;
  let INK = '#14213d', RED = '#c0392b', CARD = '#f6efdf', SH = 'rgba(40,25,10,.38)', DK = 0;
  const thm = () => { const t = window.PPCINE.THEME(); INK = t.ink; RED = t.red; CARD = t.card; SH = t.sh; DK = t.dark; };
  const P = (e, lt) => lt - e.t; const mode = (draw, sfx) => ({ world: true, sfx, draw: (e, lt, X) => { thm(); draw(e, lt, X); } });
  const img = (id, t) => { id = String(id || '').replace(/^@/, '').trim(); return id && HAS(id) ? toned(id, t || (LOOK.cur && LOOK.cur.mid && LOOK.cur.mid.tone) || 'aged', 0, 'print').c : null; };
  function cover(c, x, y, w, h, fx = .5, fy = .35) { if (!c) { ctx.fillStyle = 'rgba(128,128,128,.25)'; ctx.fillRect(x, y, w, h); return; } const s = Math.max(w / c.width, h / c.height); ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.drawImage(c, x + (w - c.width * s) * fx, y + (h - c.height * s) * fy, c.width * s, c.height * s); ctx.restore(); }
  const lab = (s, x, y, size, col, o = {}) => T(String(s), x, y, { size, font: o.font || 'cond', weight: o.weight || 700, fill: col, lw: o.lw || 0, stroke: o.stroke, ls: (o.ls ?? 2) * U(), align: o.align || 'center', alpha: o.alpha, rot: o.rot });
  const cut = (fn, u, k = 1) => { ctx.save(); ctx.shadowColor = SH; ctx.shadowBlur = 16 * u * k; ctx.shadowOffsetY = 9 * u * k; fn(); ctx.restore(); };

  // ---------------------------------------------------------------- FREEZE: record scratch, freeze frame, "Yep. That's Adam."
  EXT.freeze = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); const tf = e.t; const frozen = lt >= tf; const id = e.img; const pt = String(e.pt || '.5,.4').split(',').map(Number);
    X.layer(2, () => { const z = frozen ? 1.06 + Math.min(.06, (lt - tf) * .02) : 1 + lt * .015; ctx.save(); ctx.translate(W * pt[0], H * pt[1]); ctx.scale(z, z); ctx.translate(-W * pt[0], -H * pt[1]); cover(img(id, frozen ? 'bw' : 'color'), 0, 0, W, H, .5, .35); ctx.restore();
      if (!frozen) return; const k = clamp((lt - tf) / .25); if (lt - tf < .08) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(0, 0, W, H); } ctx.fillStyle = 'rgba(20,10,0,.12)'; ctx.fillRect(0, 0, W, H);
      const cx = W * pt[0], cy = H * pt[1], R = num(e.r, .16) * H; ctx.save(); ctx.strokeStyle = '#e5231b'; ctx.lineWidth = 9 * u; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 40 * k; i++) { const a = -1.2 + i / 40 * TAU * 1.08; const rr = R * (1 + Math.sin(i * .7) * .04); const x = cx + Math.cos(a) * rr * 1.15, y = cy + Math.sin(a) * rr; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
      const tx = cx > W / 2 ? W * .06 : W * .56; const k2 = clamp((lt - tf - .3) / .3); if (e.cap) T(e.cap, tx, H * .72, { size: 74 * u, font: 'hand', fill: '#ffffff', stroke: '#16120e', lw: 10 * u, align: 'left', alpha: k2, rot: -.03 }); if (e.sub) T(e.sub, tx, H * .8, { size: 34 * u, font: 'hand', fill: '#fff3c4', stroke: '#16120e', lw: 7 * u, align: 'left', alpha: clamp((lt - tf - .7) / .3) }); });
  }, (e) => [[e.t, 'record_scratch', .9]]);

  // ---------------------------------------------------------------- EXPECT: expectation vs reality
  EXT.expect = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); const L = String(e.left || '').split(','), R = String(e.right || '').split(','); const tr = X.at(e.go, e.t + 1.4); if (lt < e.t - .5) return;
    X.layer(2, () => { const pw = W * .38, ph = pw * .72, y = H * .44; const k1 = E.back(clamp((lt - e.t + .5) / .45)); ctx.save(); ctx.translate(W * .27, y); ctx.scale(k1, k1); ctx.rotate(-.02); cut(() => { ctx.fillStyle = '#fff'; ctx.fillRect(-pw / 2 - 12 * u, -ph / 2 - 12 * u, pw + 24 * u, ph + 24 * u); }, u); cover(img(L[0], 'color'), -pw / 2, -ph / 2, pw, ph);
      const r = rng(9); for (let i = 0; i < 6; i++) { const a = lt * 2 + i; const sx = (r() - .5) * pw, sy = (r() - .5) * ph, sz = (8 + 8 * Math.abs(Math.sin(a))) * u; ctx.fillStyle = '#fff8d0'; ctx.beginPath(); for (let j = 0; j < 8; j++) { const rr = j % 2 ? sz * .3 : sz; ctx.lineTo(sx + Math.cos(j / 8 * TAU) * rr, sy + Math.sin(j / 8 * TAU) * rr); } ctx.fill(); }
      ctx.restore(); lab((L[1] || 'EXPECTATION').toUpperCase(), W * .27, y + ph / 2 + 54 * u, 44 * u, INK, { alpha: k1 });
      if (lt >= tr) { const k2 = clamp((lt - tr) / .5); const drop = E.bounce(k2); ctx.save(); ctx.translate(W * .73, y - (1 - drop) * H * .8); ctx.rotate(.07); cut(() => { ctx.fillStyle = '#e8e2d4'; ctx.fillRect(-pw / 2 - 12 * u, -ph / 2 - 12 * u, pw + 24 * u, ph + 24 * u); }, u); cover(img(R[0], 'bw'), -pw / 2, -ph / 2, pw, ph); ctx.restore(); lab((R[1] || 'REALITY').toUpperCase(), W * .73, y + ph / 2 + 54 * u, 44 * u, RED, { alpha: k2 }); } });
  }, (e, at) => [[e.t - .3, 'magic_sparkle', .45], [at(e.go, e.t + 1.4), 'cartoon_sad_trombone', .6]]);

  // ---------------------------------------------------------------- CUTAWAY: the comic title card ("Meanwhile…")
  EXT.cutaway = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const k = E.back(clamp(p / .4));
    X.layer(2, () => { ctx.save(); ctx.fillStyle = DK ? '#141b2b' : '#f3e3b8'; ctx.fillRect(0, 0, W, H); ctx.translate(W / 2, H * .46); ctx.rotate(lt * .25); for (let i = 0; i < 18; i++) { ctx.rotate(TAU / 18); ctx.fillStyle = i % 2 ? (DK ? 'rgba(255,255,255,.04)' : 'rgba(224,161,0,.22)') : 'rgba(0,0,0,0)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, -W * .09); ctx.lineTo(W, W * .09); ctx.closePath(); ctx.fill(); } ctx.restore();
      const txt = String(e.text || 'MEANWHILE…').toUpperCase(); ctx.save(); ctx.translate(W / 2, H * .44); ctx.scale(k, k); ctx.rotate(-.04 + Math.sin(lt * 3) * .01); T(txt, 0, 0, { size: 130 * u, font: 'impact', fill: PP.gold, stroke: '#16120e', lw: 14 * u, shadow: 10 * u, shadowCol: 'rgba(0,0,0,.45)', ls: 3 * u }); ctx.restore();
      if (e.sub) lab(String(e.sub).toUpperCase(), W / 2, H * .62, 40 * u, DK ? '#f4ead2' : '#16120e', { alpha: clamp((p - .35) / .3), ls: 6 }); });
  }, (e) => [[e.t, 'trans_stinger', .6]]);

  // ---------------------------------------------------------------- DRAMATIC: dun… dun… DUN
  EXT.dramatic = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); const pt = String(e.pt || '.5,.38').split(',').map(Number); const step = p < 0 ? 0 : p < .45 ? 1 : p < .9 ? 2 : 3; const z = [1, 1.3, 1.65, 2.05][step]; const rot = [0, -.04, .05, -.07][step];
    X.layer(2, () => { ctx.save(); ctx.translate(W * pt[0], H * pt[1]); ctx.scale(z, z); ctx.rotate(rot); ctx.translate(-W * pt[0], -H * pt[1]); cover(img(e.img, step === 3 ? 'red' : step ? 'bw' : undefined), 0, 0, W, H, .5, .35); ctx.restore();
      if (step) { const v = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .9); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${.35 + step * .15})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); } });
  }, (e) => [[e.t, 'hit_braam', .5], [e.t + .45, 'hit_braam', .6], [e.t + .9, 'hit_cinematic', .8]]);

  // ---------------------------------------------------------------- MATH: the silly equation
  EXT.math = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const raw = String(e.eq || 'A+B=C'); const [lhs, rhs] = raw.split('='); const terms = split(lhs, '+'); const items = []; terms.forEach((t, i) => { if (i) items.push({ op: '+' }); items.push({ t }); }); items.push({ op: '=' }); items.push({ t: rhs || '?', res: 1 });
    const gap = W * .9 / items.length; const tR = X.at(e.go, e.t + terms.length * .6 + .4);
    X.layer(2, () => { items.forEach((it, i) => { const x = W * .05 + gap * (i + .5), y = H * .46; const ti = it.res ? tR : e.t + i * .3; const k = E.back(clamp((lt - ti) / .35)); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); if (it.res) ctx.rotate(Math.sin(lt * 12) * .02 * clamp(1 - (lt - tR)));
      if (it.op) T(it.op, 0, 0, { size: 110 * u, font: 'impact', fill: INK, lw: 0 }); else if (/^@/.test(it.t) && HAS(it.t.slice(1))) { const c = img(it.t); const s2 = Math.min(gap * .9 / c.width, H * .34 / c.height); cut(() => { ctx.fillStyle = '#fff'; ctx.fillRect(-c.width * s2 / 2 - 8 * u, -c.height * s2 / 2 - 8 * u, c.width * s2 + 16 * u, c.height * s2 + 16 * u); }, u, .6); ctx.drawImage(c, -c.width * s2 / 2, -c.height * s2 / 2, c.width * s2, c.height * s2); }
      else { const words = wrap(String(it.t).toUpperCase(), 54 * u, gap * .92, 'impact'); words.forEach((w, j) => T(w, 0, (j - (words.length - 1) / 2) * 58 * u, { size: (it.res ? 96 : 54) * u, font: 'impact', fill: it.res ? RED : INK, lw: 0 })); } ctx.restore(); }); });
  }, (e, at) => [...split(String(e.eq || '').split('=')[0], '+').map((_, i) => [e.t + i * .6, 'cartoon_pop', .45]), [at(e.go, e.t + split(String(e.eq || '').split('=')[0], '+').length * .6 + .4), 'cartoon_sad_trombone', .55]]);

  // ---------------------------------------------------------------- ASIDE (overlay): the deadpan narrator aside
  EXT.aside = { d: 2.6, sfx: 'ui_typing', draw(e, lt, X) { thm(); const u = X.u; const p = lt - e.t; const d = num(e.dur, 2.6); if (p < 0 || p > d) return; const txt = String(e.text || e.arg || ''); const n = Math.floor(clamp(p / Math.max(.4, txt.length * .035)) * txt.length); const a = p > d - .3 ? (d - p) / .3 : 1;
    ctx.save(); ctx.globalAlpha *= a; const size = 34 * u; const tw = textW(txt, size, 'serif') + 40 * u; ctx.fillStyle = DK ? 'rgba(0,0,0,.55)' : 'rgba(255,250,238,.85)'; ctx.fillRect(W * .04, H * .07, tw, size * 1.7); T(txt.slice(0, n), W * .04 + 20 * u, H * .07 + size * .85, { size, font: 'serif', weight: 700, fill: DK ? '#f4ead2' : '#16120e', lw: 0, align: 'left' }); ctx.restore(); } };

  // ---------------------------------------------------------------- MEME (overlay): a bold caption across the top
  EXT.meme = { d: 2.4, sfx: 'hit_comic', draw(e, lt, X) { const u = X.u; const p = lt - e.t; const d = num(e.dur, 2.4); if (p < 0 || p > d) return; const k = E.back(clamp(p / .25)); const a = p > d - .25 ? (d - p) / .25 : 1; const txt = String(e.text || e.arg || '').toUpperCase();
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(W / 2, H * .13); ctx.scale(k, k); const lines = wrap(txt, 76 * u, W * .8, 'impact'); lines.forEach((l, i) => T(l, 0, (i - (lines.length - 1) / 2) * 84 * u, { size: 76 * u, font: 'impact', fill: '#ffffff', stroke: '#000000', lw: 12 * u })); ctx.restore(); } };

  window.PPFUN = { modes: ['freeze', 'expect', 'cutaway', 'dramatic', 'math'], overlays: ['aside', 'meme'] };
})();
