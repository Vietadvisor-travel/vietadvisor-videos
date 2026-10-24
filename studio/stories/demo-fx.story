title: demo · one continuous effects performance · ep. 4 opening (the owner's brief, 24 Oct 2026)
channel: poisonpill
look: luxury
tone: playful
voice: am_michael*.7+bm_george*.3
delivery: tense
voices: ruja=bf_emma
music: auto
captions: off
autotrans: off
endcard: off

#! scene fx_run
({ t, at, W, H, u, img, clip, ctx, clamp, lerp, shatter, burn, grab, chroma, text }) => {
  // Every sentence is its own effect, invented for its words, and the last object of one sentence BECOMES the first of
  // the next: heartbeat → ticker → coins → piggy bank → OneCoin → family tree → ticket → barcode → equaliser → red silk
  // → curtains → stage footage → strips → frozen quote → "Bitcoin" → coin → slashed → OneCoin rises → cracks → shards →
  // 0/1 rain → NOTHING → burns → counter → lands on real cash. Everything is computed from t (parallel render pages).
  const K = w => at(w), sm = x => x * x * (3 - 2 * x), eo = x => 1 - Math.pow(1 - x, 3), cl = clamp;
  const io = (a, b) => sm(cl((t - a) / Math.max(.01, b - a))), lin = (a, b) => cl((t - a) / Math.max(.01, b - a));
  const eb = x => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const R = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const F = { imp: '"Anton", sans-serif', cond: '700 1px "Oswald", sans-serif', serif: '"Playfair Display", serif', body: '"Be Vietnam Pro", sans-serif' };
  const GOLD = '#e8c77e', RED = '#c8202a', CREAM = '#f1e8d4';
  const CV = (k, w, h) => { const c = (window.__fxc ||= {})[k] || (window.__fxc[k] = document.createElement('canvas')); if (c.width !== w || c.height !== h) { c.width = w; c.height = h; } return c; };
  // letters of a word, each with its own transform: fn(i, n) → {x, y, s, r, a}
  const letters = (str, x, y, size, font, col, fn, ls = 0) => { ctx.save(); ctx.font = `${size}px ${font}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    const ws = [...str].map(c => ctx.measureText(c).width + ls), tot = ws.reduce((a, b) => a + b, 0); let cx = x - tot / 2;
    [...str].forEach((ch, i) => { const w = ws[i], o = fn(i, str.length) || {}; cx += w / 2; if ((o.a ?? 1) > 0.01) { ctx.save(); ctx.translate(cx + (o.x || 0), y + (o.y || 0)); ctx.rotate(o.r || 0); ctx.scale(o.s ?? 1, o.sy ?? o.s ?? 1);
      ctx.globalAlpha = cl(o.a ?? 1); ctx.fillStyle = o.col || col; ctx.fillText(ch, 0, 0); ctx.restore(); } cx += w / 2; }); ctx.restore(); return tot; };
  const coin = (x, y, r, label, glint, spin = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(spin, 1);
    const g = ctx.createRadialGradient(-r * .3, -r * .35, r * .1, 0, 0, r); g.addColorStop(0, '#fff1c4'); g.addColorStop(.45, '#e2b34f'); g.addColorStop(1, '#8a5a12');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(90,55,10,.8)'; ctx.lineWidth = r * .06; ctx.beginPath(); ctx.arc(0, 0, r * .82, 0, 7); ctx.stroke();
    if (label) { ctx.fillStyle = 'rgba(95,60,12,.9)'; ctx.font = `${r * .3}px ${F.imp}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const n = Math.round(label.length * cl(label.k ?? 1)); ctx.fillText(label.slice(0, n), 0, r * .04); }
    if (glint > 0 && glint < 1) { ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const gx = lerp(-r * 1.6, r * 1.6, glint), gr = ctx.createLinearGradient(gx - r * .3, 0, gx + r * .3, 0);
      gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,250,220,.75)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.rotate(-.5); ctx.fillStyle = gr; ctx.fillRect(-r * 2, -r * 2, r * 4, r * 4); ctx.restore(); }
    ctx.restore(); };
  const fitClip = (im, x, y, w, h, z = 1, oy = .4) => { if (!im) return; const s = Math.max(w / im.width, h / im.height) * z; ctx.drawImage(im, x + (w - im.width * s) / 2, y + (h - im.height * s) * oy, im.width * s, im.height * s); };

  ctx.fillStyle = '#07060a'; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, H * .45, H * .2, W / 2, H * .5, W * .75); v.addColorStop(0, 'rgba(40,30,22,.35)'); v.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);

  const tPic = K('Picture'), tArena = K('arena'), tLon = K('London'), tPack = K('Packed'), tDark = K('Dark'), tWait = K('Waiting'), tOut = K('Out'),
        tSav = K('savings'), tKind = K('kind'), tFam = K('families'), tThen = K('Then'), tMus = K('music'), tGown = K('gown'), tLight = K('light'), tFeet = K('feet'),
        tProm = K('promised'), tBtc = K('Bitcoin'), tAny = K('anymore'), tSell = K('selling'), tRep = K('replace'), tDid = K('did'),
        tStory = K('story'), tNever = K('never'), tRaised = K('raised'), tBil = K('billion'), tDol = K('dollars');
  const EX = W / 2, EY = H * .56, RX = W * .32, RY = H * .24;

  // ===== 1 · PICTURE pops · ARENA bends into the arena's outline · LONDON rides the river · PACKED · DARK sweeps · WAITING beats
  if (t < tOut + .6) {
    if (t < tArena + .5) letters('PICTURE', W / 2, H * .45, 150 * u, F.imp, CREAM, (i, n) => { const k = eb(cl((t - tPic - i * .06) / .35)), out = io(tArena - .25, tArena + .1);
      return { y: (1 - k) * 60 * u - out * 120 * u, s: k, a: k * (1 - out), r: (1 - k) * (i % 2 ? .3 : -.3) }; }, 6 * u);
    const bend = io(tArena, tArena + .9), ell = io(tArena + .5, tArena + 1.5), dk = io(tDark - .05, tDark + .9);
    if (t > tArena - .05 && t < tPack + .6) letters('ARENA', W / 2, H * .45, 170 * u, F.imp, GOLD, (i, n) => { const a = Math.PI * (1.15 + .7 * i / (n - 1)), k = eo(cl((t - tArena - .1 - i * .05) / .3));
      const ex = EX + Math.cos(a) * RX - (W / 2 + (i - 2) * 120 * u), ey = EY + Math.sin(a) * RY - H * .45;
      return { x: ex * bend, y: ey * bend + (1 - k) * 80 * u, s: k * (1 - .55 * bend), a: k * (1 - io(tPack, tPack + .5)), r: bend * (a - Math.PI * 1.5) }; }, 10 * u);
    if (ell > 0) { ctx.save(); ctx.strokeStyle = GOLD; ctx.globalAlpha = 1 - dk * .75; ctx.lineWidth = 3 * u; for (const [s, lw] of [[1, 3], [.55, 2], [.25, 2.5]]) { ctx.lineWidth = lw * u; ctx.beginPath(); ctx.ellipse(EX, EY, RX * s, RY * s, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ell); ctx.stroke(); } ctx.restore(); }
    const riv = io(tLon - .1, tLon + .9); if (riv > 0) { ctx.save(); ctx.strokeStyle = 'rgba(120,160,200,.7)'; ctx.lineWidth = 5 * u; ctx.globalAlpha = 1 - dk; ctx.beginPath(); const pts = [];
      for (let i = 0; i <= 80 * riv; i++) { const x = W * (.05 + .9 * i / 80), y = H * .2 + Math.sin(i / 80 * 7) * H * .05 + Math.sin(i / 80 * 2.3) * H * .04; pts.push([x, y]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
      const lab = 'LONDON'; [...lab].forEach((c, i) => { const p = pts[Math.min(pts.length - 1, Math.floor(10 + i * 4 + riv * 30))]; if (!p) return; text(c, p[0], p[1] - 30 * u, { size: 40 * u, font: 'cond', weight: 700, col: '#a9c6e0', a: io(tLon + .1 * i, tLon + .3 + .1 * i) * (1 - dk), lw: 0 }); }); }
    // 1,500 seats pour in on "Packed"; a dark sweep passes on "Dark"; one stays, and beats
    const sweep = lerp(-W * .1, W * 1.1, io(tDark - .05, tDark + .8));
    if (t > tPack - .1) for (let i = 0; i < 1500; i++) { const a = R(i) * Math.PI * 2, rr = .58 + .4 * Math.sqrt(R(i + 5)), x = EX + Math.cos(a) * RX * rr, y = EY + Math.sin(a) * RY * rr, d = tPack + R(i + 9) * .9, k = eo(cl((t - d) / .45));
      if (k <= 0) continue; const off = x < sweep, keep = i === 77; let al = k * (off && !keep ? .12 : 1); if (keep && t > tWait) al = .6 + .4 * Math.pow(Math.max(0, Math.sin((t - tWait) * 7)), 6);
      if (t > tOut + .1 && !keep) al *= 1 - io(tOut, tOut + .4); ctx.fillStyle = keep && t > tDark ? '#ffd27a' : `rgba(232,199,126,${al})`; ctx.globalAlpha = keep ? al : 1; ctx.beginPath(); ctx.arc(x, y - (1 - k) * H * .4, (keep ? 7 : 3.2) * u, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
    if (t > tPack - .05 && t < tDark + .3) letters('PACKED', W / 2, H * .17, 110 * u, F.imp, CREAM, (i, n) => { const k = io(tPack, tPack + .35), sq = io(tPack + .35, tPack + .7); return { x: (i - (n - 1) / 2) * 60 * u * (1 - k) - (i - (n - 1) / 2) * 18 * u * sq, sy: 1 + .25 * sq, s: 1 - .12 * sq, a: k * (1 - io(tDark - .1, tDark + .2)) }; }, 4 * u);
    if (t > tDark - .1 && t < tWait + .4) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sweep, H); ctx.clip(); letters('DARK', W / 2, H * .17, 130 * u, F.imp, '#1a1714', () => ({ a: 1 - io(tWait - .2, tWait + .3) })); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(sweep, 0, W, H); ctx.clip(); letters('DARK', W / 2, H * .17, 130 * u, F.imp, CREAM, () => ({ a: io(tDark - .1, tDark + .1) })); ctx.restore(); }
    // the heartbeat line leaves the last dot and runs right
    const ecg = io(tWait, tOut + .2); if (ecg > 0) { const x0 = EX + Math.cos(R(77) * Math.PI * 2) * RX * (.58 + .4 * Math.sqrt(R(82))), y0 = EY + Math.sin(R(77) * Math.PI * 2) * RY * (.58 + .4 * Math.sqrt(R(82))), flat = io(tOut - .1, tOut + .5);
      ctx.save(); ctx.strokeStyle = '#ffd27a'; ctx.lineWidth = 4 * u; ctx.shadowColor = '#ffb84a'; ctx.shadowBlur = 16 * u; ctx.beginPath();
      for (let i = 0; i <= 200 * ecg; i++) { const x = lerp(x0, W * 1.05, i / 200), ph = (i % 40) / 40, spike = ph > .45 && ph < .6 ? Math.sin((ph - .45) / .15 * Math.PI * 2) * H * .12 : 0, y = lerp(y0 + spike, H * .5, flat); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); } }

  // ===== 2 · the flat line becomes a ticker of what people put in · it shatters into coins · a piggy bank · it turns into OneCoin · a family tree
  if (t > tOut - .1 && t < tThen + .8) {
    const tick = 'SAVINGS · PENSION · HOUSE DEPOSIT · COLLEGE FUND · INHERITANCE · SAVINGS · PENSION · HOUSE DEPOSIT · ';
    const tk = CV('tick', 2400, 200), tg = tk.getContext('2d'); tg.clearRect(0, 0, 2400, 200); tg.font = `120px ${F.imp}`; tg.fillStyle = CREAM; tg.textBaseline = 'middle'; tg.fillText(tick, 20 - ((t - tOut) * 700) % 1400, 100);
    tg.fillStyle = GOLD; tg.fillRect(0, 186, 2400, 6);
    const tw = W * 1.25, th = tw * 200 / 2400; if (t < tSav) { ctx.globalAlpha = io(tOut - .1, tOut + .4); ctx.drawImage(tk, W / 2 - tw / 2, H * .5 - th / 2, tw, th); ctx.globalAlpha = 1; }
    else if (t < tSav + 1.6) shatter(tk, { x: W / 2, y: H * .5, w: tw, h: th, t0: tSav, cols: 16, rows: 2, force: 380, g: 2600, floor: H * 1.4, seed: 4, origin: [W / 2, H * .62], a: 1 - io(tSav + .8, tSav + 1.5) });
    // piggy bank drawn in gold line; coins drop into its slot
    const pig = io(tSav + .1, tSav + .9), turn = io(tKind - .1, tKind + .8), PX = W / 2, PY = H * .6;
    if (pig > 0 && turn < 1) { ctx.save(); ctx.translate(PX, PY); ctx.rotate(turn * Math.PI / 2); ctx.scale(1 - .3 * turn, 1 - .3 * turn); ctx.globalAlpha = 1 - turn; ctx.strokeStyle = GOLD; ctx.lineWidth = 6 * u; ctx.lineJoin = 'round';
      ctx.setLineDash([2400 * u * pig, 4000 * u]); ctx.beginPath(); ctx.ellipse(0, 0, 230 * u, 160 * u, 0, 0, 7); ctx.moveTo(230 * u, -20 * u); ctx.lineTo(280 * u, -20 * u); ctx.lineTo(280 * u, 40 * u); ctx.lineTo(225 * u, 40 * u);
      ctx.moveTo(-60 * u, -150 * u); ctx.lineTo(-30 * u, -210 * u); ctx.lineTo(10 * u, -158 * u); for (const lx of [-130, 110]) { ctx.moveTo(lx * u, 140 * u); ctx.lineTo(lx * u, 200 * u); ctx.lineTo((lx + 40) * u, 200 * u); ctx.lineTo((lx + 40) * u, 150 * u); }
      ctx.moveTo(-50 * u, -165 * u); ctx.lineTo(50 * u, -165 * u); ctx.stroke(); ctx.restore(); }
    for (let k = 0; k < 18; k++) { const d = tSav + .25 + k * .07, q = cl((t - d) / .55); if (q <= 0 || q >= 1 || turn > .3) continue; const x0 = W * (.1 + .8 * R(k + 40)), y0 = H * .5;
      coin(lerp(x0, PX, eo(q)), lerp(y0, PY - 165 * u, q * q) - Math.sin(q * Math.PI) * H * .12, 26 * u, '', 0, Math.cos(q * 9 + k)); }
    // the piggy turns 90° and becomes the coin: ONECOIN is stamped letter by letter, a glint crosses it
    const cK = io(tKind + .2, tKind + .9), split = io(tFam, tFam + .7), lvl2 = io(tFam + .9, tFam + 1.6), toTicket = io(tThen - .7, tThen);
    if (cK > 0 && split < 1) { const lab = 'ONECOIN'; lab.k = io(tKind + .6, tKind + 1.4); coin(PX, lerp(PY, H * .5, cK), lerp(150, 230, eb(cK)) * u, Object.assign(new String(lab), { k: lab.k }), lin(tKind + 1.4, tKind + 2.1), 1); }
    // the family tree: the coin splits into three, each a window onto a real crowd; each splits again
    if (split > 0) { const L1 = [-1, 0, 1].map(j => [W / 2 + j * W * .26, H * .38]), L2 = []; L1.forEach(p => [-1, 0, 1].forEach(j => L2.push([p[0] + j * W * .085, H * .74])));
      const sc = 1 - .75 * toTicket, ox = W / 2, oy = H * .5; ctx.save(); ctx.translate(ox, oy); ctx.scale(sc, sc); ctx.translate(-ox, -oy); ctx.globalAlpha = 1 - toTicket * .6;
      ctx.strokeStyle = GOLD; ctx.lineWidth = 3 * u; L1.forEach((p, i) => { ctx.beginPath(); ctx.moveTo(W / 2, H * .5); ctx.lineTo(lerp(W / 2, p[0], split), lerp(H * .5, p[1], split)); ctx.stroke(); });
      L2.forEach((p, i) => { if (lvl2 <= 0) return; const q = L1[Math.floor(i / 3)]; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(lerp(q[0], p[0], lvl2), lerp(q[1], p[1], lvl2)); ctx.stroke(); });
      const win = (x, y, r, k, seed) => { if (k <= 0) return; ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * k, 0, 7); ctx.clip(); fitClip(clip('stock_people_applause_02', tFam - seed, 1), x - r, y - r, r * 2, r * 2, 1.4, .5); ctx.restore();
        ctx.strokeStyle = GOLD; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.arc(x, y, r * k, 0, 7); ctx.stroke(); };
      L1.forEach((p, i) => { const k = eb(cl((t - tFam - i * .1) / .5)); coin(lerp(W / 2, p[0], split), lerp(H * .5, p[1], split), 70 * u * (1 - io(tFam + .3, tFam + .7)) * k, '', 0); win(p[0], p[1], 95 * u, io(tFam + .3, tFam + .8), i * 1.3); });
      L2.forEach((p, i) => win(p[0], p[1], 52 * u, eb(cl((t - tFam - 1.1 - i * .05) / .45)), i * .7 + 3)); ctx.restore(); }
    // …and the tree folds into a ticket
    if (toTicket > 0) { const tw2 = W * .62, th2 = H * .36; ctx.save(); ctx.globalAlpha = toTicket; ctx.translate(W / 2, H * .5); ctx.fillStyle = 'rgba(241,232,212,.08)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 4 * u;
      ctx.beginPath(); ctx.roundRect(-tw2 / 2, -th2 / 2, tw2, th2, 18 * u); ctx.fill(); ctx.stroke(); ctx.setLineDash([10 * u, 10 * u]); ctx.beginPath(); ctx.moveTo(tw2 * .22, -th2 / 2); ctx.lineTo(tw2 * .22, th2 / 2); ctx.stroke(); ctx.restore();
      text('ADMIT ONE', W / 2 - W * .12, H * .45, { size: 64 * u, font: 'impact', col: CREAM, a: toTicket, lw: 0 }); text('WEMBLEY ARENA · 11 JUNE 2016', W / 2 - W * .12, H * .56, { size: 30 * u, font: 'cond', weight: 700, col: GOLD, a: toTicket, lw: 0, ls: 3 * u }); } }

  // ===== 3 · the ticket's barcode lifts into an equaliser · the bars melt into red silk · the silk parts like curtains on the real footage · the room stands in strips
  const BC = i => W / 2 + W * .2 + (i - 15) * 4.2 * u, eqx = i => W * (.12 + .76 * i / 31);
  if (t > tThen - .3 && t < tProm + .6) {
    const lift = io(tMus - .1, tMus + .7), melt = io(tGown - .2, tGown + .6), open = io(tLight - .1, tLight + 1.1), standK = t - tFeet;
    if (melt < 1) for (let i = 0; i < 32; i++) { const bh = H * .26 * (R(i) > .5 ? 1 : .8), eh = H * (.08 + .3 * Math.abs(Math.sin(t * 6.1 + i * .9) * Math.sin(t * 2.3 + i * .37))) * lift;
      const x = lerp(BC(i), eqx(i), eo(lift)), w = lerp(R(i + 3) > .5 ? 6 * u : 3 * u, W * .016, lift), h = lerp(bh, eh, lift), y = lerp(H * .5 + bh / 2, H * .78, lift);
      ctx.fillStyle = lift > .5 ? `rgba(232,199,126,${1 - melt})` : `rgba(241,232,212,${1 - melt})`; ctx.save(); ctx.translate(x, y); ctx.rotate(melt * .9); ctx.fillRect(-w / 2, -h, w, h); ctx.restore(); }
    // red silk: a ribbon born from the bars, flowing; on "light" it splits into two curtains that part on the real stage
    if (melt > 0) {
      if (open > 0) { ctx.save(); fitClip(clip('onecoin_clip_ruja_stage', tLight - .3, standK > 0 ? 1 : 1), 0, 0, W, H, 1.15 - .08 * open, .35);
        if (standK > 0) { const snap = grab('stand'); ctx.fillStyle = '#07060a'; ctx.fillRect(0, 0, W, H); const n = 12; for (let s = 0; s < n; s++) { const d = standK - s * .06, k = d < 0 ? 0 : (d < .35 ? -Math.sin(d / .35 * Math.PI) * .06 : 0) ;
            ctx.drawImage(snap, s * snap.width / n, 0, snap.width / n + 1, snap.height, s * W / n, k * H - (d > 0 && d < .7 ? (1 - Math.min(1, d / .7)) * 0 : 0), W / n + 1, H); } }
        const g = ctx.createRadialGradient(W / 2, -H * .1, 0, W / 2, H * .4, H); g.addColorStop(0, `rgba(255,236,190,${.35 * (1 - io(tLight + .6, tLight + 1.6))})`); g.addColorStop(1, 'rgba(255,236,190,0)'); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      for (const side of [-1, 1]) { const gap = open * W * .62; ctx.save(); ctx.beginPath(); const edge = W / 2 + side * gap;
        ctx.moveTo(side < 0 ? -10 : W + 10, -10); for (let i = 0; i <= 30; i++) { const y = H * i / 30, wv = Math.sin(i * .6 + t * 3 + side) * 30 * u * (1 - open * .5) * melt; ctx.lineTo(lerp(W / 2 + side * W * .5 * (1 - melt), edge, 1) + wv, y); } ctx.lineTo(side < 0 ? -10 : W + 10, H + 10); ctx.closePath();
        const cg = ctx.createLinearGradient(edge - side * W * .3, 0, edge, 0); cg.addColorStop(0, '#4a0609'); cg.addColorStop(.6, '#a3141c'); cg.addColorStop(1, '#e0353c'); ctx.fillStyle = cg; ctx.globalAlpha = melt; ctx.fill();
        ctx.globalAlpha = .25 * melt; ctx.strokeStyle = '#000'; for (let f = 1; f < 6; f++) { ctx.lineWidth = 8 * u; ctx.beginPath(); const fx = edge - side * f * W * .07; ctx.moveTo(fx, 0); ctx.lineTo(fx + Math.sin(f + t) * 12 * u, H); ctx.stroke(); } ctx.restore(); }
      if (standK > .8) { const k = eb(cl((standK - .8) / .35)); text('STANDING OVATION', W / 2, H * .82, { size: 96 * u * (1.5 - .5 * k), font: 'impact', col: GOLD, a: cl(k) * (1 - io(tProm - .2, tProm + .2)), rot: -.04, lw: 0 }); } } }

  // ===== 4 · the frame freezes and greys · her promise types itself, word by word · "Bitcoin" lifts out, becomes the coin · slashed in two
  const QUOTE = ['“In', 'two', 'years,', 'nobody', 'will', 'speak', 'about', 'Bitcoin', 'anymore.”'];
  if (t > tProm - .3 && t < tSell + 1.2) {
    const fr = io(tProm - .3, tProm + .4); ctx.save(); ctx.filter = `grayscale(${fr}) brightness(${1 - .45 * fr})`; fitClip(clip('onecoin_clip_ruja_stage', t - (tProm - (tLight - .3)), 1), 0, 0, W, H, 1.07 + .1 * io(tProm, tAny), .35); ctx.filter = 'none'; ctx.restore();
    ctx.save(); ctx.font = `${70 * u}px ${F.serif}`; const sp = 18 * u, widths = QUOTE.map(w => ctx.measureText(w).width), tot = widths.reduce((a, b) => a + b + sp, -sp); ctx.restore();
    let x = W / 2 - tot / 2; const lift = io(tBtc - .1, tBtc + .4), slash = io(tAny, tAny + .35), part = io(tAny + .35, tAny + 1.1);
    QUOTE.forEach((w, i) => { const tw = widths[i], d = lerp(tProm + .1, tBtc, i / 7), k = eb(cl((t - d) / .3)); const isB = w === 'Bitcoin';
      if (!isB || lift <= 0) text(w, x + tw / 2, H * .2 + (1 - k) * -40 * u, { size: 70 * u, font: 'serif', weight: 900, col: CREAM, a: cl(k) * (1 - io(tSell, tSell + .4)), lw: 0 });
      else { const cx = lerp(x + tw / 2, W / 2, eo(lift)), cy = lerp(H * .2, H * .52, eo(lift)), r = lerp(40, 190, eo(lift)) * u, spin = Math.cos(io(tBtc + .4, tBtc + 1.2) * Math.PI * 2);
        if (lift < .5) text(w, cx, cy, { size: 70 * u * (1 + lift * 2), font: 'serif', weight: 900, col: '#f7931a', a: 1 - lift * 2, lw: 0 });
        if (lift > .3) { const c = CV('btc', 512, 512), g = c.getContext('2d'); g.clearRect(0, 0, 512, 512); g.fillStyle = '#f7931a'; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = `300px ${F.body}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('₿', 256, 270);
          for (const side of [-1, 1]) { ctx.save(); ctx.translate(cx + side * part * W * .25, cy + part * part * H * .8); ctx.rotate(side * part * .8); ctx.beginPath(); ctx.moveTo(-r * 2, side < 0 ? -r * 2 : r * 2); ctx.lineTo(r * 2, side < 0 ? -r * 2 : r * 2); ctx.lineTo(r * 2, -r * .5); ctx.lineTo(-r * 2, r * .5); ctx.closePath();
            if (part > 0 || slash > 0) ctx.clip(); ctx.scale(spin * cl((lift - .3) / .7), cl((lift - .3) / .7)); ctx.globalAlpha = 1 - io(tSell + .2, tSell + .8); ctx.drawImage(c, -r, -r, r * 2, r * 2); ctx.restore(); if (!(part > 0 || slash > 0)) break; }
          if (slash > 0 && part < 1) { ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 12 * u; ctx.lineCap = 'round'; ctx.shadowColor = RED; ctx.shadowBlur = 20 * u; ctx.beginPath(); ctx.moveTo(cx - r * 1.5, cy + r * .75); ctx.lineTo(lerp(cx - r * 1.5, cx + r * 1.5, slash), lerp(cy + r * .75, cy - r * .75, slash)); ctx.globalAlpha = 1 - part; ctx.stroke(); ctx.restore(); } } }
      x += tw + sp; });
    if (io(tProm + .5, tProm + 1) > 0) text('Ruja Ignatova · Wembley Arena · 11 June 2016', W / 2, H * .28, { size: 30 * u, font: 'cond', weight: 700, col: '#a99a82', a: io(tProm + .5, tProm + 1) * (1 - io(tSell, tSell + .4)), lw: 0, ls: 2 * u }); }

  // ===== 4b · from between the halves, OneCoin rises · 5 · it cracks, shatters, the shards fall as 0/1 rain that settles into NOTHING
  const coinCv = () => { const c = CV('one', 600, 600), g = c.getContext('2d'); g.clearRect(0, 0, 600, 600); const sv = ctx; return c; };
  if (t > tSell - .1 && t < tStory + .3) {
    const rise = io(tSell, tSell + 1), crack = io(tDid - .1, tDid + .3), boom = tDid + .35;
    // render the OneCoin into its own canvas so it can shatter for real
    const c = CV('one', 600, 600), g = c.getContext('2d'); g.clearRect(0, 0, 600, 600); { const sv = [ctx.canvas]; }
    const og = g; og.save(); const gr = og.createRadialGradient(210, 200, 30, 300, 300, 290); gr.addColorStop(0, '#fff1c4'); gr.addColorStop(.45, '#e2b34f'); gr.addColorStop(1, '#8a5a12'); og.fillStyle = gr; og.beginPath(); og.arc(300, 300, 290, 0, 7); og.fill();
    og.strokeStyle = 'rgba(90,55,10,.8)'; og.lineWidth = 16; og.beginPath(); og.arc(300, 300, 238, 0, 7); og.stroke(); og.fillStyle = 'rgba(95,60,12,.9)'; og.font = `88px ${F.imp}`; og.textAlign = 'center'; og.textBaseline = 'middle'; og.fillText('ONECOIN', 300, 305);
    if (crack > 0) { og.strokeStyle = '#2a1a05'; og.lineWidth = 7; for (let k = 0; k < 9; k++) { let x = 300, y = 300; og.beginPath(); og.moveTo(x, y); const a0 = k / 9 * Math.PI * 2 + R(k) * .5; for (let s = 0; s < 8 * crack; s++) { x += Math.cos(a0 + (R(k * 9 + s) - .5) * 1.2) * 34; y += Math.sin(a0 + (R(k * 9 + s) - .5) * 1.2) * 34; og.lineTo(x, y); } og.stroke(); } }
    og.restore();
    const r = lerp(60, 230, eb(rise)) * u, cy = lerp(H * .85, H * .5, eo(rise));
    if (t < boom) { ctx.save(); ctx.translate(W / 2 + (crack > 0 ? Math.sin(t * 80) * 4 * u * crack : 0), cy); ctx.drawImage(c, -r, -r, r * 2, r * 2); ctx.restore();
      const gl = lin(tSell + .8, tSell + 1.5); if (gl > 0 && gl < 1) coin(W / 2, cy, r, '', gl, 1); }
    else if (t < boom + 1.4) shatter(c, { x: W / 2, y: H * .5, w: r * 2, h: r * 2, t0: boom, cols: 8, rows: 8, force: 1100, g: 1800, floor: H * 1.6, seed: 9, origin: [W / 2, H * .5], a: 1 - io(boom + .35, boom + .8) });
    if (t > boom && t < boom + .4) chroma(grab('boom'), 18 * (1 - (t - boom) / .4));
    // the 0/1 rain: born where the shards fly, it falls, then flies to the dots that spell NOTHING
    const tg = window.__nothing || (window.__nothing = (() => { const m = document.createElement('canvas'); m.width = 960; m.height = 220; const mg = m.getContext('2d'); mg.font = `200px ${F.imp}`; mg.textAlign = 'center'; mg.textBaseline = 'middle'; mg.fillStyle = '#fff'; mg.fillText('NOTHING', 480, 115);
      const d = mg.getImageData(0, 0, 960, 220).data, pts = []; for (let y = 0; y < 220; y += 9) for (let x = 0; x < 960; x += 9) if (d[(y * 960 + x) * 4 + 3] > 128) pts.push([x / 960, y / 220]); return pts; })());
    if (t > boom + .25) { const fly = io(boom + .55, boom + 1.25), out = io(tStory + .04, tStory + .08); ctx.save(); ctx.font = `600 ${22 * u}px "Oswald", monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      tg.forEach(([px, py], i) => { const tau = t - boom - .25, a = R(i) * Math.PI * 2, sp = (200 + 600 * R(i + 1)) * u, x0 = W / 2 + Math.cos(a) * sp * Math.min(tau, .5), y0 = H * .5 + Math.sin(a) * sp * Math.min(tau, .5) + 900 * u * Math.pow(Math.max(0, tau - .2), 2) * .5;
        const tx = W / 2 + (px - .5) * W * .7, ty = H * .5 + (py - .5) * H * .32, e = sm(cl(fly * 1.3 - R(i + 2) * .3)); ctx.fillStyle = e > .9 ? GOLD : 'rgba(150,220,170,.9)'; ctx.globalAlpha = 1 - out;
        ctx.fillText(R(i + 7) > .5 ? '1' : '0', lerp(x0, tx, e), lerp(Math.min(y0, H * 1.1), ty, e)); }); ctx.restore(); } }

  // ===== 6 · NOTHING burns away from below · from the ash a counter rolls up to $4,000,000,000 · it drops onto real cash
  if (t > tStory - .1) {
    const b = io(tStory + .05, K('product') + .2); if (b < 1) { const A = CV('ash', W, H); const ag = A.getContext('2d'); ag.clearRect(0, 0, W, H); ag.font = `600 ${22 * u}px "Oswald", monospace`; ag.textAlign = 'center'; ag.textBaseline = 'middle'; ag.fillStyle = GOLD;
      (window.__nothing || []).forEach(([px, py], i) => ag.fillText(R(i + 7) > .5 ? '1' : '0', W / 2 + (px - .5) * W * .7, H * .5 + (py - .5) * H * .32));
      const S = grab('pre6'); ctx.drawImage(A, 0, 0); const B2 = grab('ashsnap'); ctx.drawImage(S, 0, 0, S.width, S.height, 0, 0, W, H); burn(B2, b, { seed: 6, cx: .5, cy: 1.05, glow: 1.4 }); }
    const roll = io(K('product') - .1, tBil + .25), stops = [0, 10000, 1000000, 100000000, 4000000000], seg = roll * (stops.length - 1), si = Math.min(stops.length - 2, Math.floor(seg)), f = seg - si;
    const val = roll >= 1 ? 4e9 : Math.round(lerp(stops[si], stops[si + 1], sm(f)) / (si < 2 ? 1 : 1e5)) * (si < 2 ? 1 : 1e5);
    const drop = io(tDol - .05, tDol + .35), squash = t > tDol + .35 ? Math.exp(-(t - tDol - .35) * 6) * Math.sin((t - tDol - .35) * 18) : 0;
    // the number lands on a pile of the same gold coins the film began with (they pour in as it rolls)
    for (let k = 0; k < 46; k++) { const d = tRaised + k * .045, q = cl((t - d) / .5); if (q <= 0) continue; const row = Math.floor(Math.sqrt(k * 2)), col_ = k - row * (row + 1) / 2;
      const tx = W / 2 + (col_ - row / 2) * 70 * u * (1 - row * .02) + (R(k) - .5) * 14 * u, ty = H * .86 - (9 - row) * 0 - (Math.max(0, 8 - row)) * 0 - (k < 46 ? 0 : 0) - (9 - Math.min(9, row)) * 22 * u * 0 + row * 22 * u - 160 * u;
      coin(tx, lerp(-H * .2, ty, eo(q)) + (q >= 1 && squash > 0 ? squash * 6 * u : 0), 44 * u, '', 0, .35 + .65 * Math.abs(Math.cos(k + (1 - q) * 9))); }
    if (t > K('product') - .3) { const k = eb(io(K('product') - .3, K('product') + .1)); const s = '$' + val.toLocaleString('en-US') + (roll >= 1 ? '+' : '');
      letters(s, W / 2, lerp(H * .3, H * .36, drop) + (1 - Math.max(0, squash) * 0) * 0, 150 * u * k, F.imp, GOLD, (i) => ({ y: (si < 4 && roll < 1 && i > 0 ? Math.sin(t * 40 + i) * 6 * u * (1 - f) : 0) }), 2 * u);
      if (roll >= 1) text('taken from investors · US Justice Department', W / 2, H * .45, { size: 32 * u, font: 'cond', weight: 700, col: '#a99a82', a: io(tBil + .3, tBil + .8), lw: 0, ls: 2 * u }); } }
}
#! end

# cine act=hook fx="code:fx_run"
Picture an arena in London. Packed. Dark. Waiting.
Out in the seats are people who have put their savings into a new kind of money, and talked their families into it too.
Then the music swells, a woman in a red ball gown walks into the light, and the whole room gets to its feet.
She promised them that in two years, nobody would speak about Bitcoin anymore.
She was selling them the coin that would replace it.
That coin did not exist.
This is the story of how a product that never existed raised more than four billion dollars.
