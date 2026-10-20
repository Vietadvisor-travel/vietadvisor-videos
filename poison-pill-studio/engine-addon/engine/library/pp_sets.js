/* Poison Pill v4 — SET PIECES: the idea of a sentence acted out by objects in a world (not overlays on a photo).
   Each set fills the frame, is built from paper cut-outs on the dossier desk, has its own depth planes (so the v4 camera
   rig parallaxes through it), mounts REAL photos on the objects, and is driven by spoken words.
   Use in fx= :  set:<kind>;at:<word>;…  (one set per beat; mid=/fg= still work on top — usually leave them empty)

   domino    n:6 · lab:A,B,C… · img:id1,id2… · fall:<word>  (chain reaction: cause → effect → collapse)
   scale     left:<label|@img> · right:<label|@img> · tip:<word> · to:-1..1 (−1 left heavy) (comparison, verdict, imbalance)
   tower     rows:9 · lab:… (labels of the side-on rows, bottom→top) · block:<n> (which labelled row is pulled) · pull:<word> · fall:<word> (fragile structure, the one block)
   iceberg   tip:<label> · deep:a,b,c (hidden labels) · dive:<word> (what you see vs what is under)
   mania     from:1 · to:40 · unit:$B · pop:<word> · lab:<label> (hype, valuation, mania, burst)
   chess     a:@img · b:@img · move:<word> · take:<word> (strategy, rivalry, the move that ended it)
   city      vals:12,30,8 · lab:A,B,C · img:… · grow:<word> · fall:<index>@<word> (data as skyline: market cap, size)
   hourglass lab:<label> · left:<text> (time running out; burn rate; runway)
   strings   img:id1,id2,id3 · lab:<controller> · pull:<word> (hidden control, puppets, who really decides)
   crack     img:<id> · lab:<label> · split:<word> (foundation breaks; the ground gives way)
   pipes     nodes:A>B>C · img:… · rate:1 · cut:<word> (money / users / power flowing; the pipe that breaks)
   ladder    steps:6 · img:<id> · lab:… · slip:<word> (climb, ranks, fall from the top) */
(function () {
  if (!window.PPCINE) return; const { EXT, num, split, toned, HAS, PP } = window.PPCINE;
  const INK = '#14213d', RED = '#c0392b', KRAFT = '#c9a46b', CREAM = '#efe5d0', CARD = '#f6efdf', TEAL = '#2a6b5e', SH = 'rgba(40,25,10,.38)';
  const gold = () => PP.gold;
  const cut = (fn, u, k = 1) => { ctx.save(); ctx.shadowColor = SH; ctx.shadowBlur = 16 * u * k; ctx.shadowOffsetY = 9 * u * k; ctx.shadowOffsetX = 3 * u * k; fn(); ctx.restore(); };
  const poly = (pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
  const lab = (s, x, y, size, col = INK, o = {}) => T(String(s).toUpperCase(), x, y, { size, font: o.font || 'cond', weight: o.weight || 700, fill: col, lw: 0, ls: (o.ls ?? 2) * U(), rot: o.rot || 0 });
  // a real photo, cropped to cover a rect (clipped), warm archive print by default; '@' prefix accepted
  function photo(id, x, y, w, h, o = {}) { id = String(id || '').replace(/^@/, ''); if (!id || !HAS(id)) { ctx.save(); ctx.fillStyle = 'rgba(20,33,61,.12)'; ctx.fillRect(x, y, w, h); ctx.restore(); return false; }
    const tc = toned(id, o.tone || 'aged', 0, 'print'); const im = tc.c; const s = Math.max(w / im.width, h / im.height) * (o.zoom || 1); ctx.save(); ctx.beginPath(); o.round ? ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, TAU) : ctx.rect(x, y, w, h); ctx.clip(); ctx.drawImage(im, x + (w - im.width * s) / 2, y + (h - im.height * s) * (o.top ? .15 : .5), im.width * s, im.height * s); ctx.restore(); return true; }
  const P = (e, lt) => lt - e.t;
  const spring = (x, k = 9, d = 4.2) => x <= 0 ? 0 : 1 - Math.exp(-d * x) * Math.cos(k * x); // damped overshoot to 1
  const groundShadow = (x, y, w, u, a = .25) => { ctx.save(); const g = ctx.createRadialGradient(x, y, 0, x, y, w); g.addColorStop(0, `rgba(40,25,10,${a})`); g.addColorStop(1, 'rgba(40,25,10,0)'); ctx.fillStyle = g; ctx.scale(1, .22); ctx.beginPath(); ctx.arc(x, y / .22, w, 0, TAU); ctx.fill(); ctx.restore(); };
  const world = (draw, sfx) => ({ world: true, sfx, draw });

  // ---------------------------------------------------------------- DOMINO: chain reaction in depth
  EXT.domino = world((e, lt, X) => { const u = X.u, v = H > W; const n = num(e.n, 6); const labs = split(e.lab, ','), imgs = split(e.img, ','); const tf = X.at(e.fall, e.t + 1.2); const p = P(e, lt); if (p < 0) return;
    X.layer(1.7, () => { ctx.save(); ctx.fillStyle = 'rgba(90,65,30,.16)'; poly([[0, H * .78], [W, H * .62], [W, H], [0, H]]); ctx.fill(); ctx.restore(); });
    X.layer(2, () => { for (let i = n - 1; i >= 0; i--) { const q = i / (n - 1); const sc = lerp(1.15, .5, q); const bx = lerp(W * (v ? .16 : .1), W * (v ? .86 : .84), q), by = lerp(H * .9, H * .64, q); const w = W * (v ? .13 : .075) * sc, h = H * .46 * sc;
      const appear = E.out5(clamp((p - i * .08) / .4)); if (appear <= 0) continue; const td = tf + i * .2; const a = lt < td ? 0 : Math.min(1.12, Math.pow(clamp((lt - td) / .26), 2) * 1.12); const ang = a * (i === n - 1 ? 1.45 : 1.12);
      groundShadow(bx + Math.sin(ang) * h * .5, by, w * 1.4 + Math.sin(ang) * h * .5, u, .3); ctx.save(); ctx.translate(bx + w / 2, by + (1 - appear) * H * .3); ctx.rotate(ang); ctx.globalAlpha *= appear;
      cut(() => { ctx.fillStyle = '#1c2230'; ctx.fillRect(-w, -h, w, h); }, u, sc); ctx.fillStyle = '#2b3242'; ctx.fillRect(-w, -h, w * .14, h);
      ctx.fillStyle = CARD; ctx.fillRect(-w * .84, -h * .94, w * .72, h * .88); ctx.strokeStyle = INK; ctx.lineWidth = 2 * u * sc; ctx.beginPath(); ctx.moveTo(-w * .84, -h * .5); ctx.lineTo(-w * .12, -h * .5); ctx.stroke();
      if (imgs[i]) photo(imgs[i], -w * .8, -h * .9, w * .64, h * .36, { top: 1 }); else { ctx.fillStyle = i === n - 1 ? RED : INK; for (let d = 0; d < (i % 6) + 1; d++) { ctx.beginPath(); ctx.arc(-w * .48 + ((d % 2) - .5) * w * .3, -h * .78 + Math.floor(d / 2) * h * .12, w * .07, 0, TAU); ctx.fill(); } }
      if (labs[i]) { ctx.save(); ctx.translate(-w * .48, -h * .25); ctx.rotate(-Math.PI / 2); lab(labs[i], 0, 0, Math.min(w * .5, (v ? 30 : 26) * u * sc + 6 * u), i === n - 1 ? RED : INK); ctx.restore(); }
      ctx.restore(); } });
  }, (e, at) => { const tf = at(e.fall, e.t + 1.2); return [...Array(num(e.n, 6))].map((_, i) => [tf + i * .2 + .24, i === num(e.n, 6) - 1 ? 'impact_big' : 'impact_wood_light', .55]); });

  // ---------------------------------------------------------------- SCALE: weighing two things
  EXT.scale = world((e, lt, X) => { const u = X.u, v = H > W; const p = P(e, lt); if (p < 0) return; const tt = X.at(e.tip, e.t + 1.4); const to = num(e.to, -1); const tipK = lt < tt ? 0 : spring(lt - tt, 7, 3.2); const ang = to * .32 * tipK + Math.sin(lt * 1.3) * .012;
    const cx = W * .5, top = H * (v ? .3 : .24), post = H * (v ? .42 : .5), arm = W * (v ? .36 : .27), rise = E.out5(clamp(p / .6));
    X.layer(1.8, () => { groundShadow(cx, top + post + 20 * u, W * .25, u, .3); cut(() => { ctx.fillStyle = '#2b3242'; poly([[cx - 90 * u, top + post + 24 * u], [cx + 90 * u, top + post + 24 * u], [cx + 50 * u, top + post - 6 * u], [cx - 50 * u, top + post - 6 * u]]); ctx.fill(); ctx.fillRect(cx - 12 * u, top + (1 - rise) * post, 24 * u, post * rise); }, u); });
    X.layer(2, () => { ctx.save(); ctx.translate(cx, top + (1 - rise) * post); ctx.rotate(ang); cut(() => { ctx.fillStyle = gold(); ctx.fillRect(-arm, -9 * u, arm * 2, 18 * u); ctx.beginPath(); ctx.arc(0, 0, 22 * u, 0, TAU); ctx.fill(); }, u); ctx.restore();
      [[-1, e.left], [1, e.right]].forEach(([sd, what]) => { const hx = cx + Math.cos(ang) * arm * sd, hy = top + (1 - rise) * post + Math.sin(ang) * arm * sd; const L = H * (v ? .2 : .24); const py = hy + L; const pw = W * (v ? .3 : .19);
        ctx.strokeStyle = 'rgba(30,25,20,.7)'; ctx.lineWidth = 2.5 * u; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - pw * .45, py); ctx.moveTo(hx, hy); ctx.lineTo(hx + pw * .45, py); ctx.stroke();
        const it = String(what || ''); const ph = pw * .9; if (it[0] === '@') { cut(() => { ctx.fillStyle = CARD; ctx.fillRect(hx - ph * .42, py - ph * .95, ph * .84, ph * .9); }, u); photo(it, hx - ph * .38, py - ph * .91, ph * .76, ph * .74, { top: 1 }); }
        else if (it) { const sz = (v ? 50 : 54) * u; cut(() => { ctx.fillStyle = sd < 0 ? INK : RED; ctx.fillRect(hx - pw * .36, py - sz * 1.6, pw * .72, sz * 1.5); }, u); lab(it, hx, py - sz * .85, Math.min(sz, pw * .72 / Math.max(3, it.length) * 1.7), CREAM, { font: 'impact', weight: 400 }); }
        cut(() => { ctx.fillStyle = gold(); ctx.beginPath(); ctx.ellipse(hx, py, pw * .5, 14 * u, 0, 0, Math.PI); ctx.fill(); ctx.fillRect(hx - pw * .5, py - 4 * u, pw, 8 * u); }, u); }); });
  }, (e, at) => [[e.t, 'impact_metal_light', .5], [at(e.tip, e.t + 1.4), 'impact_thump', .8]]);

  // ---------------------------------------------------------------- TOWER: a Jenga stack; one block pulled; collapse
  EXT.tower = world((e, lt, X) => { const u = X.u, v = H > W; const rows = num(e.rows, 9); const labs = split(e.lab, ','); const p = P(e, lt); if (p < 0) return; const tp = X.at(e.pull, 1e9), tfall = X.at(e.fall, tp + 1.1); const pi = num(e.block, 2) * 2 - 1; // block = n-th labelled (side-on) row from the bottom
    const bw = W * (v ? .3 : .17), bh = H * (v ? .05 : .072), cx = W * num(e.x, .5), base = H * .84;
    X.layer(1.9, () => groundShadow(cx, base, bw * 2.4, u, .35));
    X.layer(2, () => { for (let r = 0; r < rows; r++) for (let c = 0; c < 3; c++) { const id = r * 3 + c; const build = E.out5(clamp((p - r * .07) / .35)); if (build <= 0) continue; const along = r % 2 === 0; let x = cx + (c - 1) * bw * (along ? .34 : 0), y = base - (r + .5) * bh - (1 - build) * H * .4; let w = along ? bw * .32 : bw, rot = 0, al = build;
      if (r === pi && c === 1 && lt > tp) { const k = E.inOut(clamp((lt - tp) / .9)); x += (along ? 0 : k * bw * 1.6); if (along) y -= 0; w = along ? w : bw; al *= 1; ctx.save(); ctx.translate(x + (along ? k * W * .2 : 0), y); }
      else { if (lt > tfall) { const q = lt - tfall - (rows - r) * .03; if (q > 0) { const rr = rng(id * 7 + 3); const dir = rr() > .45 ? 1 : -1; x += dir * q * q * W * .08 * (r / rows + .3) + q * W * .05 * dir; y += Math.min(base - y - bh * .5, q * q * H * .9); rot = dir * q * 2.4 * (rr() + .3); } } ctx.save(); ctx.translate(x, y); }
      ctx.rotate(rot); ctx.globalAlpha *= al; const ww = along ? w : bw * .98; cut(() => { ctx.fillStyle = (id * 37) % 5 === 0 ? '#d7b98a' : KRAFT; ctx.fillRect(-ww / 2, -bh / 2, ww, bh * .94); }, u, .6); ctx.strokeStyle = 'rgba(90,60,25,.35)'; ctx.lineWidth = 1 * u; for (let g = 0; g < 3; g++) { ctx.beginPath(); ctx.moveTo(-ww / 2, -bh * .3 + g * bh * .25); ctx.lineTo(ww / 2, -bh * .25 + g * bh * .25); ctx.stroke(); }
      const L = !along && labs[(r - 1) >> 1]; if (L && c === 1) lab(L, 0, 0, Math.min(bh * .55, ww / Math.max(4, L.length) * 1.6), r === pi ? RED : INK); ctx.restore(); } });
  }, (e, at) => { const tp = at(e.pull, 1e9); return [[e.t, 'impact_wood_light', .5], [tp, 'trans_slide', .7], [at(e.fall, tp + 1.1), 'impact_big', .9]]; });

  // ---------------------------------------------------------------- ICEBERG: what you see vs what is underneath
  EXT.iceberg = world((e, lt, X) => { const u = X.u, v = H > W; const p = P(e, lt); if (p < 0) return; const wl = H * num(e.y, .36); const deep = split(e.deep, ','); const cx = W * .5; const s = W * (v ? .9 : .5);
    X.layer(1.2, () => { const sk = ctx.createLinearGradient(0, 0, 0, wl); sk.addColorStop(0, '#d9d0bc'); sk.addColorStop(1, '#ece4d2'); ctx.fillStyle = sk; ctx.fillRect(0, 0, W, wl); const sea = ctx.createLinearGradient(0, wl, 0, H); sea.addColorStop(0, '#5f8f8f'); sea.addColorStop(1, '#13283a'); ctx.fillStyle = sea; ctx.fillRect(0, wl, W, H - wl);
      ctx.save(); ctx.globalCompositeOperation = 'soft-light'; for (let i = 0; i < 5; i++) { const x = W * (i / 5) + Math.sin(lt * .4 + i) * 40 * u; const g = ctx.createLinearGradient(x, wl, x + W * .1, H); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; poly([[x, wl], [x + W * .05, wl], [x + W * .2, H], [x + W * .1, H]]); ctx.fill(); } ctx.restore(); });
    X.layer(2, () => { const rise = E.out5(clamp(p / .9)); const bob = Math.sin(lt * 1.1) * 6 * u + (1 - rise) * H * .25; ctx.save(); ctx.translate(cx, wl + bob);
      const under = [[-.08, 0], [.1, 0], [.34, .18], [.46, .44], [.3, .7], [.08, .86], [-.22, .8], [-.44, .55], [-.38, .26], [-.2, .06]].map(([x, y]) => [x * s, y * (H - wl) * .98]);
      ctx.save(); poly(under); const ug = ctx.createLinearGradient(0, 0, 0, H - wl); ug.addColorStop(0, 'rgba(200,225,230,.75)'); ug.addColorStop(1, 'rgba(70,110,130,.55)'); ctx.fillStyle = ug; ctx.fill(); ctx.restore();
      cut(() => { poly([[-.1 * s, 0], [-.04 * s, -wl * .42], [.02 * s, -wl * .52], [.06 * s, -wl * .3], [.11 * s, 0]]); ctx.fillStyle = '#f7f4ee'; ctx.fill(); }, u); ctx.fillStyle = 'rgba(160,190,200,.5)'; poly([[.02 * s, -wl * .52], [.06 * s, -wl * .3], [.11 * s, 0], [.03 * s, 0]]); ctx.fill();
      if (e.tip) lab(e.tip, 0, -wl * .62, (v ? 40 : 44) * u, INK);
      const dv = X.at(e.dive, e.t + 1.6); deep.forEach((d, i) => { const q = E.out(clamp((lt - dv - i * .45) / .4)); if (q <= 0) return; const y = (H - wl) * (.22 + i * .2), x = ((i % 2) ? .16 : -.18) * s; ctx.save(); ctx.globalAlpha *= q; lab(d, x, y, (v ? 34 : 36) * u * (1 + i * .08), '#f2efe6'); ctx.restore(); });
      ctx.restore(); });
    X.layer(2.6, () => { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2.5 * u; ctx.beginPath(); for (let x = 0; x <= W; x += 12 * u) { const y = wl + Math.sin(x * .02 + lt * 2) * 4 * u; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); });
  }, (e, at) => [[e.t, 'battle_splash_big', .4], [at(e.dive, e.t + 1.6), 'whoosh_down', .7]]);

  // ---------------------------------------------------------------- MANIA: valuation inflating, then pop
  EXT.mania = world((e, lt, X) => { const u = X.u, v = H > W; const p = P(e, lt); if (p < 0) return; const tp = X.at(e.pop, 1e9); const a = num(e.from, 1), b = num(e.to, 40); const k = E.inOut(clamp(p / num(e.dur, Math.max(1.2, tp - e.t - .1))));
    const val = a + (b - a) * k; const R = Math.min(W, H) * lerp(.08, v ? .36 : .34, Math.sqrt(k)); const cx = W * .5, cy = H * .46; const wob = 1 + Math.sin(lt * 7) * .015 * k;
    X.layer(1.8, () => { ctx.save(); ctx.strokeStyle = 'rgba(20,33,61,.35)'; ctx.lineWidth = 3 * u; ctx.setLineDash([8 * u, 8 * u]); ctx.beginPath(); ctx.moveTo(W * .08, H * .84); ctx.lineTo(W * .92, H * .84); ctx.stroke(); ctx.restore(); });
    X.layer(2, () => { if (lt < tp) { ctx.save(); ctx.translate(cx, cy); ctx.scale(wob, 2 - wob); const g = ctx.createRadialGradient(-R * .3, -R * .35, R * .05, 0, 0, R); g.addColorStop(0, 'rgba(255,255,255,.75)'); g.addColorStop(.5, 'rgba(210,180,120,.22)'); g.addColorStop(.92, 'rgba(184,134,11,.4)'); g.addColorStop(1, 'rgba(120,80,20,.55)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(120,80,20,.5)'; ctx.lineWidth = 2 * u; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.ellipse(-R * .42, -R * .45, R * .16, R * .07, -.7, 0, TAU); ctx.fill(); ctx.restore();
        const txt = (e.pre || '$') + (val >= 10 ? Math.round(val) : val.toFixed(1)) + (e.unit || 'B'); T(txt, cx, cy, { size: Math.max(30 * u, R * .42), font: 'impact', fill: INK, lw: 0 }); if (e.lab) lab(e.lab, cx, cy + R * .38, Math.max(18 * u, R * .12), '#7a5a10'); }
      else { const q = lt - tp; const r = rng(5); ctx.save(); for (let i = 0; i < 40; i++) { const an = r() * TAU, sp = (.6 + r()) * R * 1.8; const x = cx + Math.cos(an) * (R * .9 + sp * q), y = cy + Math.sin(an) * (R * .9 + sp * q) + q * q * H * .6; ctx.globalAlpha = clamp(1 - q / 1.2); ctx.fillStyle = r() > .5 ? 'rgba(184,134,11,.8)' : 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(x, y, (2 + r() * 5) * u, 0, TAU); ctx.fill(); }
        ctx.globalAlpha = clamp(1 - q / .35); ctx.strokeStyle = 'rgba(184,134,11,.7)'; ctx.lineWidth = 6 * u * (1 - q); ctx.beginPath(); ctx.arc(cx, cy, R * (1 + q * 1.4), 0, TAU); ctx.stroke(); ctx.restore(); if (q > .25) { const kk = E.out5(clamp((q - .25) / .3)); T(e.after || '$0', cx, H * .78 - (1 - kk) * 20 * u, { size: (v ? 120 : 130) * u * lerp(1.6, 1, kk), font: 'impact', fill: RED, lw: 0, alpha: kk }); } } });
  }, (e, at) => [[e.t, 'riser_tension', .4], [at(e.pop, 1e9), 'cartoon_pop', .9]]);

  // ---------------------------------------------------------------- CHESS: two rivals on a board; the move; the capture
  EXT.chess = world((e, lt, X) => { const u = X.u, v = H > W; const p = P(e, lt); if (p < 0) return; const tm = X.at(e.move, e.t + 1.2), tk = X.at(e.take, 1e9);
    const top = H * .42, bot = H * .98, wt = W * (v ? .7 : .42), wb = W * (v ? 1.3 : .95), cx = W * .5; const sq = (c, r) => { const y0 = lerp(top, bot, Math.pow(r / 8, 1.25)), y1 = lerp(top, bot, Math.pow((r + 1) / 8, 1.25)); const w0 = lerp(wt, wb, r / 8), w1 = lerp(wt, wb, (r + 1) / 8); return [[cx - w0 / 2 + w0 * c / 8, y0], [cx - w0 / 2 + w0 * (c + 1) / 8, y0], [cx - w1 / 2 + w1 * (c + 1) / 8, y1], [cx - w1 / 2 + w1 * c / 8, y1]]; };
    const ctr = (c, r) => { const q = sq(c, r); return [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, lerp(wt, wb, (r + .5) / 8) / 8]; };
    X.layer(1.8, () => { cut(() => { ctx.fillStyle = '#5a4128'; poly([[cx - wt / 2 - 14 * u, top - 10 * u], [cx + wt / 2 + 14 * u, top - 10 * u], [cx + wb / 2 + 30 * u, bot + 20 * u], [cx - wb / 2 - 30 * u, bot + 20 * u]]); ctx.fill(); }, u); for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { poly(sq(c, r)); ctx.fillStyle = (r + c) % 2 ? '#3b2a1a' : '#e9dcc0'; ctx.fill(); } });
    const piece = (c, r, kind, img, col, fallen) => { const [x, y, s0] = ctr(c, r); const s = s0 * 1.35; const h = s * (kind === 'king' ? 2.3 : 1.5); ctx.save(); ctx.translate(x, y); if (fallen) { ctx.translate(fallen * s * 1.5, -fallen * s * .3); ctx.rotate(fallen * 1.5); ctx.globalAlpha *= clamp(1.4 - fallen); } groundShadow(0, 0, s * .6, u, .4);
      cut(() => { ctx.fillStyle = col; poly([[-s * .38, 0], [s * .38, 0], [s * .26, -s * .18], [s * .16, -h * .7], [-s * .16, -h * .7], [-s * .26, -s * .18]]); ctx.fill(); ctx.beginPath(); ctx.arc(0, -h * .78, s * (kind === 'king' ? .42 : .3), 0, TAU); ctx.fill(); if (kind === 'king') { ctx.fillRect(-s * .05, -h * 1.12, s * .1, s * .32); ctx.fillRect(-s * .16, -h * 1.05, s * .32, s * .09); } }, u, .8);
      if (img) { ctx.save(); ctx.strokeStyle = gold(); ctx.lineWidth = 3 * u; const rr2 = s * (kind === 'king' ? .38 : .27); photo(img, -rr2, -h * .78 - rr2, rr2 * 2, rr2 * 2, { round: 1, top: 1 }); ctx.beginPath(); ctx.arc(0, -h * .78, rr2, 0, TAU); ctx.stroke(); ctx.restore(); } ctx.restore(); };
    X.layer(2.2, () => { const mk = E.inOut(clamp((lt - tm) / .7)); const hop = Math.sin(mk * Math.PI) * 40 * u; const fall = lt > tk ? clamp((lt - tk) / .6) : 0;
      const A0 = [2, 6], A1 = [num(e.tc, 4), num(e.tr, 3)]; const pa = [lerp(A0[0], A1[0], mk), lerp(A0[1], A1[1], mk)];
      [[1, 1, 'pawn'], [6, 2, 'pawn'], [5, 6, 'pawn'], [1, 7, 'pawn']].forEach(([c, r, k2]) => piece(c, r, k2, null, r < 4 ? '#2b2b2b' : '#efe7d6'));
      piece(A1[0], A1[1] - 1 >= 0 ? A1[1] - 1 : 0, 'king', e.b, '#2b2b2b', fall); ctx.save(); ctx.translate(0, -hop); piece(pa[0], pa[1], 'king', e.a, '#efe7d6'); ctx.restore();
      if (e.alab) lab(e.alab, ...ctr(A0[0], 7).slice(0, 2), (v ? 30 : 30) * u, INK); });
  }, (e, at) => [[at(e.move, e.t + 1.2), 'impact_wood_light', .7], [at(e.take, 1e9), 'impact_thump', .8]]);

  // ---------------------------------------------------------------- CITY: values as a skyline of cut-paper towers
  EXT.city = world((e, lt, X) => { const u = X.u, v = H > W; const p = P(e, lt); if (p < 0) return; const vals = split(e.vals, ',').map(Number), labs = split(e.lab, ','), imgs = split(e.img, ','); const n = vals.length; const max = Math.max(...vals) || 1; const tg = X.at(e.grow, e.t + .3);
    const [fi, fw] = String(e.fall || '').split('@'); const tf = fw ? X.at(fw, 1e9) : 1e9; const base = H * .86;
    X.layer(1.3, () => { ctx.save(); ctx.fillStyle = 'rgba(90,70,45,.18)'; for (let i = 0; i < 18; i++) { const r = rng(i * 13); const w = W * (.03 + r() * .04), h = H * (.08 + r() * .22); ctx.fillRect((i / 18) * W, base - h, w, h); } ctx.restore(); });
    X.layer(2, () => { const gap = W * (v ? .86 : .7) / n; const x0 = W / 2 - gap * n / 2; vals.forEach((val, i) => { const k = E.out5(clamp((lt - tg - i * .12) / 1.1)); let h = H * (v ? .5 : .56) * val / max * k; const w = gap * .62; const x = x0 + gap * (i + .5) - w / 2; let rot = 0, dy = 0;
      if (+fi === i + 1 && lt > tf) { const q = lt - tf; rot = Math.min(1.35, q * q * 1.8); dy = Math.min(h * .2, q * q * H * .2); }
      ctx.save(); ctx.translate(x + w, base + dy); ctx.rotate(rot); ctx.translate(-w, 0); cut(() => { ctx.fillStyle = i === n - 1 && e.hl !== 'off' ? RED : i % 2 ? '#2b3242' : INK; ctx.fillRect(0, -h, w, h); }, u);
      ctx.fillStyle = 'rgba(240,210,140,.75)'; const cw = w / 5, rh = H * .028; for (let yy = -h + rh * .8; yy < -rh; yy += rh * 1.5) for (let c = 0; c < 3; c++) { if (rng(Math.floor(yy) * 7 + c + i)() > .55) ctx.fillRect(cw * (1 + c * 1.2) - cw * .6, yy, cw * .6, rh * .6); }
      if (imgs[i] && h > w) { ctx.save(); ctx.strokeStyle = CREAM; ctx.lineWidth = 4 * u; photo(imgs[i], w * .1, -h - w * .9, w * .8, w * .8, { round: 1, top: 1 }); ctx.beginPath(); ctx.arc(w / 2, -h - w * .5, w * .4, 0, TAU); ctx.stroke(); ctx.restore(); }
      ctx.restore(); if (k > .6) { const al = clamp((k - .6) / .3); lab(labs[i] || '', x + w / 2, base + 30 * u, (v ? 28 : 26) * u, INK); T(e.unit !== undefined ? (e.pre || '$') + Math.round(val * k) + e.unit : String(Math.round(val * k)), x + w / 2, base - h - (imgs[i] ? w * 1.1 : 0) - 26 * u, { size: (v ? 40 : 38) * u, font: 'impact', fill: INK, lw: 0, alpha: al }); } }); ctx.fillStyle = 'rgba(40,25,10,.4)'; ctx.fillRect(0, base, W, 3 * u); });
  }, (e, at) => split(e.vals, ',').map((_, i) => [at(e.grow, e.t + .3) + i * .12, 'ui_data_blip', .5]));

  // ---------------------------------------------------------------- HOURGLASS: time running out
  EXT.hourglass = world((e, lt, X) => { const u = X.u, v = H > W; const p = P(e, lt); if (p < 0) return; const d = num(e.dur, 4); const k = clamp(p / d); const cx = W * num(e.x, .5), cy = H * .47, hh = H * .32, hw = Math.min(W, H) * .17;
    X.layer(2, () => { const pin = E.out5(clamp(p / .5)); ctx.save(); ctx.translate(cx, cy + (1 - pin) * H * .3); groundShadow(0, hh * 1.12, hw * 1.4, u, .35);
      cut(() => { ctx.fillStyle = '#5a4128'; ctx.fillRect(-hw * 1.25, -hh * 1.12, hw * 2.5, hh * .1); ctx.fillRect(-hw * 1.25, hh * 1.02, hw * 2.5, hh * .1); ctx.fillRect(-hw * 1.15, -hh * 1.05, hw * .1, hh * 2.1); ctx.fillRect(hw * 1.05, -hh * 1.05, hw * .1, hh * 2.1); }, u);
      const glass = () => { ctx.beginPath(); ctx.moveTo(-hw, -hh); ctx.bezierCurveTo(-hw, -hh * .3, -hw * .08, -hh * .15, -hw * .06, 0); ctx.bezierCurveTo(-hw * .08, hh * .15, -hw, hh * .3, -hw, hh); ctx.lineTo(hw, hh); ctx.bezierCurveTo(hw, hh * .3, hw * .08, hh * .15, hw * .06, 0); ctx.bezierCurveTo(hw * .08, -hh * .15, hw, -hh * .3, hw, -hh); ctx.closePath(); };
      ctx.save(); glass(); ctx.clip(); ctx.fillStyle = 'rgba(230,240,240,.35)'; ctx.fillRect(-hw, -hh, hw * 2, hh * 2); ctx.fillStyle = '#c99a3a'; const topLvl = lerp(-hh * .82, -hh * .02, Math.sqrt(k)); ctx.fillRect(-hw, topLvl, hw * 2, -topLvl); const botH = hh * .8 * Math.sqrt(k); ctx.beginPath(); ctx.moveTo(-hw, hh); ctx.lineTo(hw, hh); ctx.lineTo(hw * .9, hh - botH * .7); ctx.quadraticCurveTo(0, hh - botH * 1.25, -hw * .9, hh - botH * .7); ctx.closePath(); ctx.fill(); if (k < 1) ctx.fillRect(-1.6 * u, 0, 3.2 * u, hh - botH * .9); ctx.restore();
      glass(); ctx.strokeStyle = 'rgba(40,30,20,.6)'; ctx.lineWidth = 3 * u; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-hw * .7, -hh * .85, hw * .08, hh * .5); ctx.restore();
      if (e.lab) lab(e.lab, cx, cy - hh * 1.35, (v ? 40 : 44) * u, INK); if (e.left) { const al = clamp((p - .8) / .4); T(e.left, cx + (v ? 0 : hw * 2.6), cy + (v ? hh * 1.4 : 0), { size: (v ? 70 : 80) * u, font: 'impact', fill: RED, lw: 0, alpha: al }); } });
  }, (e) => [[e.t, 'ui_tick', .3]]);

  // ---------------------------------------------------------------- STRINGS: someone above holds the strings
  EXT.strings = world((e, lt, X) => { const u = X.u, v = H > W; const p = P(e, lt); if (p < 0) return; const imgs = split(e.img, ','); const n = Math.max(1, imgs.length); const tp = X.at(e.pull, 1e9); const pull = lt > tp ? spring(lt - tp, 8, 3.5) : 0; const sw = Math.sin(lt * 1.4) * .03;
    const barY = H * .12 - pull * H * .05, cx = W * .5, bw = W * (v ? .7 : .46);
    X.layer(2.4, () => { ctx.save(); ctx.translate(cx, barY); ctx.rotate(sw); cut(() => { ctx.fillStyle = '#5a4128'; ctx.fillRect(-bw / 2, -10 * u, bw, 20 * u); ctx.fillRect(-12 * u, -H * .2, 24 * u, H * .2); }, u); if (e.lab) { ctx.save(); ctx.fillStyle = INK; ctx.fillRect(-bw * .18, -H * .1, bw * .36, 46 * u); lab(e.lab, 0, -H * .1 + 23 * u, 26 * u, CREAM); ctx.restore(); } ctx.restore(); });
    X.layer(2, () => { imgs.forEach((id, i) => { const fx = n === 1 ? 0 : (i / (n - 1) - .5); const ax = cx + fx * bw * .9 * Math.cos(sw), ay = barY + fx * bw * .9 * Math.sin(sw); const hx = cx + fx * W * (v ? .62 : .5), dangle = Math.sin(lt * 1.7 + i * 1.3) * 8 * u; const hy = H * .5 - pull * H * .08 + Math.sin(lt * 2 + i) * 4 * u; const ph = H * (v ? .3 : .38), pw = ph * .78;
      ctx.strokeStyle = 'rgba(30,25,20,.65)'; ctx.lineWidth = 1.6 * u; [[-.36, 0], [.36, 0], [0, -.04]].forEach(([ox]) => { ctx.beginPath(); ctx.moveTo(ax + ox * 40 * u, ay); ctx.lineTo(hx + dangle + ox * pw, hy - ph * .5); ctx.stroke(); });
      ctx.save(); ctx.translate(hx + dangle, hy); ctx.rotate(dangle * .004); cut(() => { ctx.fillStyle = CARD; ctx.fillRect(-pw / 2 - 8 * u, -ph / 2 - 8 * u, pw + 16 * u, ph + 16 * u); }, u); photo(id, -pw / 2, -ph / 2, pw, ph, { top: 1 }); ctx.restore(); }); });
  }, (e, at) => [[at(e.pull, 1e9), 'battle_creak', .7]]);

  // ---------------------------------------------------------------- CRACK: the ground splits under the subject
  EXT.crack = world((e, lt, X) => { const u = X.u, v = H > W; const p = P(e, lt); if (p < 0) return; const ts = X.at(e.split, e.t + 1.2); const q = lt - ts; const gy = H * .7; const cx = W * .5;
    const pts = []; const r = rng(11); for (let i = 0; i <= 14; i++) pts.push([cx + (r() - .5) * W * .05 + (i - 7) * 2 * u, gy + i / 14 * (H - gy)]); const open = q > 0 ? E.out(clamp(q / .8)) * W * .08 : 0; const run = q > 0 ? clamp(q / .35) : 0;
    X.layer(1.9, () => { ctx.save(); const g = ctx.createLinearGradient(0, gy, 0, H); g.addColorStop(0, '#b39467'); g.addColorStop(1, '#8a6c45'); ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy); if (q > 0) { ctx.fillStyle = '#1a120a'; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x - open / 2 * (1 - i / 14 * .5), y) : ctx.moveTo(x, y)); for (let i = 14; i >= 0; i--) ctx.lineTo(pts[i][0] + open / 2 * (1 - i / 14 * .5), pts[i][1]); ctx.fill(); }
      ctx.strokeStyle = '#2a1c10'; ctx.lineWidth = 3 * u; ctx.beginPath(); const m = Math.floor(run * 14); for (let i = 0; i <= m; i++) { const [x, y] = pts[i]; i ? ctx.lineTo(x, y) : ctx.moveTo(x, gy); } ctx.stroke(); if (run > .5) { [[-1, .3], [1, .5], [-1, .7]].forEach(([sd, f]) => { const [x, y] = pts[Math.floor(f * 14)]; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sd * W * .12 * (run - .5) * 2, y + 20 * u); ctx.stroke(); }); } ctx.restore(); });
    X.layer(2, () => { const ph = H * (v ? .36 : .46), pw = ph * .78; const sink = q > .3 ? Math.min(H * .5, Math.pow(q - .3, 2) * H * 1.2) : 0; const tilt = q > .2 ? Math.min(.5, (q - .2) * .6) : 0; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, gy + 2 * u); if (sink > 0) ctx.rect(cx - open, gy, open * 2, H); ctx.clip(); ctx.translate(cx, gy - ph / 2 + sink); ctx.rotate(tilt * (r() > .5 ? 1 : -1));
      cut(() => { ctx.fillStyle = CARD; ctx.fillRect(-pw / 2 - 8 * u, -ph / 2 - 8 * u, pw + 16 * u, ph + 16 * u); }, u); photo(e.img, -pw / 2, -ph / 2, pw, ph, { top: 1 }); if (e.lab) { ctx.fillStyle = INK; ctx.fillRect(-pw / 2, ph / 2 - 44 * u, pw, 44 * u); lab(e.lab, 0, ph / 2 - 22 * u, 24 * u, CREAM); } ctx.restore(); });
  }, (e, at) => [[at(e.split, e.t + 1.2), 'impact_big', .9], [at(e.split, e.t + 1.2) + .3, 'impact_stone', .7]]);

  // ---------------------------------------------------------------- PIPES: money / users moving between nodes through pipes
  EXT.pipes = world((e, lt, X) => { const u = X.u, v = H > W; const p = P(e, lt); if (p < 0) return; const nodes = split(e.nodes, '>'), imgs = split(e.img, ','); const n = nodes.length; const tc = X.at(e.cut, 1e9); const ci = num(e.at_cut, n - 1);
    const pos = nodes.map((_, i) => v ? [W * .5 + (i % 2 ? .18 : -.18) * W, H * (.2 + .55 * i / Math.max(1, n - 1))] : [W * (.14 + .72 * i / Math.max(1, n - 1)), H * (.46 + (i % 2 ? -.08 : .06))]); const R = Math.min(W, H) * .085;
    X.layer(1.9, () => { for (let i = 0; i < n - 1; i++) { const [ax, ay] = pos[i], [bx, by] = pos[i + 1]; const broken = i + 1 === ci && lt > tc; const k = E.out(clamp((p - i * .3) / .5)); ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#5a4128'; ctx.lineWidth = 22 * u; ctx.beginPath(); ctx.moveTo(ax, ay); const mx = lerp(ax, bx, broken ? .45 : k), my = lerp(ay, by, broken ? .45 : k); ctx.lineTo(mx, my); ctx.stroke(); if (broken) { ctx.beginPath(); ctx.moveTo(lerp(ax, bx, .58), lerp(ay, by, .58)); ctx.lineTo(bx, by); ctx.stroke(); } ctx.strokeStyle = '#7a5a38'; ctx.lineWidth = 12 * u; ctx.stroke(); ctx.restore();
      const rate = num(e.rate, 1); for (let c = 0; c < 8; c++) { let f = ((lt * .45 * rate + c / 8) % 1); if (k < 1 && f > k) continue; if (broken) { if (f > .45 && f < .58) continue; if (f >= .58) { const q = lt - tc; const sx = lerp(ax, bx, .45), sy = lerp(ay, by, .45); const r2 = rng(c * 9 + Math.floor(lt * 3)); ctx.fillStyle = gold(); ctx.beginPath(); ctx.arc(sx + (r2() - .5) * 30 * u, sy + ((lt * 2 + c / 8) % 1) * H * .25, 8 * u, 0, TAU); ctx.fill(); continue; } }
        const x = lerp(ax, bx, f), y = lerp(ay, by, f); ctx.fillStyle = gold(); ctx.beginPath(); ctx.arc(x, y, 8 * u, 0, TAU); ctx.fill(); ctx.strokeStyle = '#7a5a10'; ctx.lineWidth = 1.5 * u; ctx.stroke(); } } });
    X.layer(2.1, () => { pos.forEach(([x, y], i) => { const k = E.out5(clamp((p - i * .3) / .4)); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); cut(() => { ctx.fillStyle = CARD; ctx.beginPath(); ctx.arc(0, 0, R + 8 * u, 0, TAU); ctx.fill(); }, u); if (!photo(imgs[i], -R, -R, R * 2, R * 2, { round: 1, top: 1 })) { ctx.fillStyle = i === n - 1 ? RED : INK; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); } ctx.restore(); lab(nodes[i], x, y + R + 30 * u, (v ? 30 : 28) * u, INK); }); });
  }, (e, at) => [[e.t, 'foley_coin_drop', .5], [at(e.cut, 1e9), 'impact_metal_light', .8]]);

  // ---------------------------------------------------------------- LADDER: the climb, and the slip from the top
  EXT.ladder = world((e, lt, X) => { const u = X.u, v = H > W; const p = P(e, lt); if (p < 0) return; const n = num(e.steps, 6); const labs = split(e.lab, ','); const ts = X.at(e.slip, 1e9); const lx = W * (v ? .5 : .42), top = H * .1, bot = H * .9, lw = W * (v ? .3 : .16);
    const climb = E.inOut(clamp(p / num(e.dur, Math.max(1.5, Math.min(4, ts - e.t - .2))))); const step = climb * (n - 1);
    X.layer(2, () => { cut(() => { ctx.fillStyle = '#5a4128'; ctx.fillRect(lx - lw / 2, top, 12 * u, bot - top); ctx.fillRect(lx + lw / 2 - 12 * u, top, 12 * u, bot - top); for (let i = 0; i < n; i++) { const y = lerp(bot - 30 * u, top + 30 * u, i / (n - 1)); ctx.fillRect(lx - lw / 2, y - 6 * u, lw, 12 * u); } }, u);
      labs.forEach((L, i) => { const y = lerp(bot - 30 * u, top + 30 * u, i / (n - 1)); T(String(L).toUpperCase(), lx + lw / 2 + 28 * u, y, { size: (v ? 26 : 30) * u, font: 'cond', weight: 700, fill: i <= step + .01 ? INK : 'rgba(20,33,61,.35)', lw: 0, align: 'left', ls: 2 * u }); });
      const fall = lt > ts ? lt - ts : 0; const y = lerp(bot - 30 * u, top + 30 * u, step / (n - 1)) + Math.min(H, fall * fall * H * 1.4); const ph = H * .2, pw = ph * .78; ctx.save(); ctx.translate(lx + Math.sin(lt * 3) * 3 * u + fall * W * .1, y - ph * .55); ctx.rotate(fall * 2.2); cut(() => { ctx.fillStyle = CARD; ctx.fillRect(-pw / 2 - 6 * u, -ph / 2 - 6 * u, pw + 12 * u, ph + 12 * u); }, u); photo(e.img, -pw / 2, -ph / 2, pw, ph, { top: 1 }); ctx.restore(); });
  }, (e, at) => [[at(e.slip, 1e9), 'whoosh_down', .8]]);

  window.PPSETS = ['domino', 'scale', 'tower', 'iceberg', 'mania', 'chess', 'city', 'hourglass', 'strings', 'crack', 'pipes', 'ladder'];
})();
