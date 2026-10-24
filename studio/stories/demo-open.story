title: demo · onecoin opening as one continuous take (v6.6 method)
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

#! scene open_take
({ t, at, p, W, H, u, img, clip, ctx, clamp, lerp, ease, cover, card, quad, blob, zoomBlur, chroma, grab, burn, text, dur }) => {
  // ONE camera, 7 movements, each born from the last (motion-doctrine §0):
  // A exterior → push through the doors · B inside, rows of phones filming the dark stage, multiplying as families join
  // C the phones' glow becomes gold dust that rises into a spotlight cone; the real stage footage lives inside the cone
  // D freeze on her, the name assembles in depth · E the frozen frame tilts away and multiplies into a wall of screens
  // that turns into code · F out of the code one line of her email types itself in space; the camera rides it; red ring
  // G the ring becomes a porthole onto her FBI poster; on "vanished" she burns out of it
  const K = w => at(w), sm = x => x * x * (3 - 2 * x), io = (a, b) => sm(clamp((t - a) / Math.max(.01, b - a)));
  const tSeats = K('seats'), tMusic = K('music'), tLight = K('light'), tFeet = K('feet'), tQueen = K('Cryptoqueen'), tTonight = K('Tonight'),
        tFraud = K('frauds'), tNight = K('night'), tEmail = K('email'), tEnd = K('end'), tOne = K('OneCoin'), tEsc = K('escape'), tVan = K('vanished');
  const drawFit = (im, x, y, w, h, z = 1, ox = .5, oy = .5) => { if (!im) return; const s = Math.max(w / im.width, h / im.height) * z; ctx.drawImage(im, x + (w - im.width * s) * ox, y + (h - im.height * s) * oy, im.width * s, im.height * s); };
  ctx.fillStyle = '#050403'; ctx.fillRect(0, 0, W, H);
  const LINE = 'Take the money and run', FS = 120 * u;
  const ringGeo = tt => { ctx.save(); ctx.font = `600 ${FS}px "Be Vietnam Pro", sans-serif`; const ride = clamp((tt - tEmail) / Math.max(.01, tEnd + .6 - tEmail)), r_ = sm(ride);
    const full = ctx.measureText(LINE).width, x0 = W * .5 - r_ * W * .42 + W * .06, sx = x0 - full * .5 * (1 - r_ * .4), rw = ctx.measureText('run').width;
    const g = [sx, sx + ctx.measureText('Take the money and ').width + rw / 2, H * .5, rw * .78, FS * .62]; ctx.restore(); return g; };

  // ---- A + B background: the arena. Exterior pushes in, accelerating; through the doors into the dark hall (pull back = arrival)
  const aK = clamp(t / Math.max(1, tSeats - .4)), inside = io(tSeats - 1.6, tSeats + .2);
  if (t < tSeats + .4) { cover(img('onecoin_wembley_night'), { z: 1.04 + 1.9 * Math.pow(aK, 2.2), oy: .12 * aK, filter: `brightness(${1.05 - .35 * aK}) contrast(1.1)` });
    if (aK > .55) zoomBlur(grab('a_blur'), (aK - .55) * 1.6); }
  if (inside > 0 && t < tMusic + 2) { ctx.save(); if (inside < 1) { blob(W / 2, H * .55, W * .9 * inside, { seed: 2, wob: .18, flow: 1 }); ctx.clip(); }
    cover(img('onecoin_art_empty_stage'), { z: lerp(1.5, 1.08, ease.out(io(tSeats - 1.6, tSeats + 2.5))), oy: .35, filter: 'brightness(.9) contrast(1.1)' });
    const crowdBg = io(tSeats, tSeats + 1.5) * (1 - io(tMusic, tMusic + 1.2)); if (crowdBg > 0) { ctx.globalAlpha = crowdBg * .75; drawFit(clip('stock_people_applause_02', tSeats, .8), 0, H * .35, W, H * .65, 1.1, .5, .6); ctx.globalAlpha = 1; } ctx.restore(); }

  // ---- B: rows of phones rise from the seats, each filming the stage; the camera trucks right; on "families" more rows join
  const crowd = (n0, rows, y0, h0, gap, from, dim) => { for (let r = 0; r < rows; r++) for (let i = 0; i < n0 + r * 2; i++) {
      const rise = ease.out(clamp((t - from - r * .35 - i * .07) / .7)); if (rise <= 0) continue;
      const ph = h0 * Math.pow(.72, r), pw = ph * .52, truck = (t - tSeats) * W * .035 * (1 + r * .4);
      const x = ((i + .5) * (pw + gap * Math.pow(.72, r)) - truck + r * pw * .3) % (W + pw * 2) - pw, y = y0 - r * h0 * .28 + (1 - rise) * H * .5;
      const glow = io(K('savings') - .2, K('savings') + .6), up = io(tMusic - .3, tMusic + 1.4); if (up >= 1) continue;
      ctx.save(); ctx.globalAlpha = (1 - up) * (1 - dim * r * .18); ctx.translate(x, y - up * H * .25); ctx.rotate((i % 3 - 1) * .05);
      ctx.fillStyle = '#0d0d10'; ctx.beginPath(); ctx.roundRect(-pw / 2 - 5 * u, -ph / 2 - 5 * u, pw + 10 * u, ph + 10 * u, 14 * u); ctx.fill();
      ctx.beginPath(); ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 10 * u); ctx.clip();
      drawFit(clip('onecoin_clip_ruja_stage', -(i * .9 + r * 2.1), 1), -pw / 2, -ph / 2, pw, ph, 1.25, .3 + (i % 4) * .12, .4);
      if (glow > 0) { ctx.strokeStyle = `rgba(240,205,130,${glow})`; ctx.lineWidth = 6 * u; ctx.strokeRect(-pw / 2, -ph / 2, pw, ph); ctx.fillStyle = `rgba(232,199,126,${.22 * glow})`; ctx.globalCompositeOperation = 'screen'; ctx.fillRect(-pw / 2, -ph / 2, pw, ph); }
      ctx.restore(); } };
  if (t > tSeats - .2 && t < tMusic + 1.6) crowd(7, 1 + Math.floor(3 * io(K('families') - .3, K('families') + 1.2) * 1.01), H * .86, H * .5, 22 * u, tSeats, 1);

  // ---- C: the glow leaves the phones as gold dust, rising into a cone of light; inside the cone, the real stage
  const cone = io(tMusic, tLight + .3), full = io(tLight, tFeet + .6);
  if (t > tMusic - .2 && t < tQueen + .4) {
    const apex = [W * .5, -H * .1], bw = lerp(W * .16, W * 1.6, ease.inOut(full)), by = H * 1.05;
    // the footage plays at speed, then ramps up on "feet" (the room standing), then slows into the freeze
    const ramp = t < tFeet ? t : tFeet + (t - tFeet) * (t < tQueen ? 1.7 : 1), off = Math.min(ramp, tQueen + .7) - tMusic + 4;
    ctx.save(); ctx.beginPath(); ctx.moveTo(apex[0] - W * .01 * (1 - full), apex[1]); ctx.lineTo(apex[0] + bw / 2, by); ctx.lineTo(apex[0] - bw / 2, by); ctx.closePath(); ctx.globalAlpha = cone; ctx.clip();
    ctx.filter = `brightness(${lerp(1.5, 1.1, full)})`; drawFit(clip('onecoin_clip_ruja_stage', t - off, 1), 0, 0, W, H, lerp(1.35, 1.06, full), .5, .3); ctx.filter = 'none';
    const gb = ctx.createLinearGradient(0, 0, 0, H); gb.addColorStop(0, `rgba(255,236,190,${.35 * (1 - full)})`); gb.addColorStop(1, 'rgba(255,236,190,0)'); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = gb; ctx.fillRect(0, 0, W, H); ctx.restore();
    const R = n => { const x = Math.sin(n * 91.7) * 43758.5; return x - Math.floor(x); };
    for (let k = 0; k < 420; k++) { const born = tMusic - .2 + R(k) * 1.6, q = clamp((t - born) / 2.2); if (q <= 0 || q >= 1) continue;
      const x0 = W * R(k + 7), y0 = H * (.6 + .35 * R(k + 3)), x = lerp(x0, W * .5 + (R(k + 5) - .5) * W * .2 * q, ease.inOut(q)), y = lerp(y0, H * .15, ease.inOut(q));
      ctx.fillStyle = `rgba(240,205,130,${.9 * (1 - q)})`; ctx.beginPath(); ctx.arc(x, y, (3.5 + 5 * R(k + 9)) * u * (1 - q * .5), 0, 7); ctx.fill(); } }

  // ---- D: freeze on her; the name assembles letter by letter in depth, then holds still (titles land and stay)
  if (t >= tQueen - .05 && t < tTonight + 1.4) {
    const fz = tQueen + .7 - tMusic + 4, push = io(tQueen, tTonight); ctx.save();
    drawFit(clip('onecoin_clip_ruja_stage', t - fz, 1), 0, 0, W, H, 1.06 + .18 * ease.out(push), .5, .3);
    ctx.fillStyle = `rgba(0,0,0,${.35 * push})`; ctx.fillRect(0, 0, W, H); ctx.restore();
    const word = 'THE CRYPTOQUEEN', lw = W * .052; [...word].forEach((ch, i) => { const k = ease.out(clamp((t - tQueen + .25 - i * .03) / .45)); if (k <= 0 || ch === ' ') return;
      text(ch, W * .5 + (i - (word.length - 1) / 2) * lw, H * .8 + (1 - k) * H * .12, { size: 92 * u * (1 + (1 - k) * 1.6), font: 'serif', weight: 900, col: '#e8c77e', a: k, lw: 0 }); }); }

  // ---- E: the frozen frame tilts away into a wall of identical screens (the pitch sold everywhere) that flickers into code
  if (t >= tTonight - .1 && t < tNight + 1) {
    const k = ease.inOut(io(tTonight, tTonight + 3.2)), multi = io(K('future'), K('future') + 2), toCode = io(tFraud - .2, tFraud + .5);
    const fz = tQueen + .7 - tMusic + 4, fr = clip('onecoin_clip_ruja_stage', t - fz, 1), code = clip('stock_screen_code_07', tTonight, 1);
    const n = 1 + Math.round(multi * 6), cw = W * lerp(1, .23, k), ch = H * lerp(1, .23, k);
    for (let r = -Math.floor(n / 2); r <= Math.floor(n / 2); r++) for (let c = -n; c <= n; c++) { if ((r || c) && multi <= 0) continue;
      const cx = W / 2 + c * cw * 1.08, cy = H / 2 + r * ch * 1.08 + (c % 2) * ch * .1 * k, d = Math.hypot(r, c), on = clamp(multi * 7 - d);
      if (!(r === 0 && c === 0) && on <= 0) continue; if (cx < -cw || cx > W + cw || cy < -ch || cy > H + ch) continue;
      const src = toCode > (d * .12 % 1) ? code : fr; if (!src) continue;
      card(src, { x: cx, y: cy, w: cw, h: ch, rx: .25 * k, ry: -.35 * k + c * .04 * k, rz: 0, z: 0, shadow: k > .2, shade: true }); }
    if (toCode > 0 && toCode < 1) chroma(grab('e_hit'), 14 * (1 - toCode)); }

  // ---- F: out of the code, one line of her email types itself in space; the camera rides along it; a red ring on "run"
  if (t >= tNight - .3 && t < tOne + .8) {
    const k = io(tNight - .3, tNight + .9), code = clip('stock_screen_code_07', tTonight, 1);
    ctx.save(); ctx.globalAlpha = .8 - .35 * k; drawFit(code, 0, 0, W, H, 1.2 + io(tNight - .3, tOne) * .9, .5 - io(tEmail, tEnd) * .2, .5); ctx.restore();
    ctx.fillStyle = `rgba(5,4,3,${.45 * k})`; ctx.fillRect(0, 0, W, H);
    text('FROM  Ruja Ignatova  ·  TO  Sebastian Greenwood  ·  9 AUGUST 2014', W * .5, H * .32, { size: 30 * u, font: 'cond', weight: 700, col: '#a99a82', a: io(tEmail - .2, tEmail + .5) * (1 - io(tOne, tOne + .5)), lw: 0, ls: 3 * u });
    const line = LINE, ty = io(tEmail, tEnd - .4), nC = Math.floor(line.length * ty), fs = FS, [sx, rx, , rwE] = ringGeo(t);
    ctx.save(); ctx.font = `600 ${fs}px "Be Vietnam Pro", sans-serif`; ctx.textBaseline = 'middle'; const shown = line.slice(0, nC);
    ctx.fillStyle = '#f1e8d4'; ctx.fillText(shown, sx, H * .5); if (nC < line.length && (t * 2.5 % 1) < .6) ctx.fillRect(sx + ctx.measureText(shown).width + 6 * u, H * .5 - fs * .4, 6 * u, fs * .8);
    const ring = io(tEnd, tEnd + .8), rw = rwE / .78;
    if (ring > 0) { ctx.strokeStyle = 'rgba(205,30,30,.95)'; ctx.lineWidth = 9 * u; ctx.lineCap = 'round'; ctx.beginPath();
      for (let i = 0; i <= 60 * ring; i++) { const a = -2.4 + i / 60 * 6.9, rr = 1 + .05 * Math.sin(i * .9); ctx.lineTo(rx + Math.cos(a) * rw * .78 * rr, H * .5 + Math.sin(a) * fs * .62 * rr); } ctx.stroke(); }
    text('— Ruja Ignatova, email of 9 August 2014 (quoted by the US Justice Department)', W * .5, H * .7, { size: 30 * u, font: 'serif', col: '#a99a82', a: io(tEnd - .2, tEnd + .4) * (1 - io(tOne, tOne + .5)), lw: 0 });
    ctx.restore(); }

  // ---- G: the ring opens into a porthole onto her FBI wanted photo; on "vanished" she burns out of it, leaving the empty poster
  if (t >= tOne - .2) {
    const [, rx, ry, rw, rh] = ringGeo(Math.min(t, tOne - .2)), k = ease.inOut(io(tOne - .2, tOne + 1.4));
    const cx = lerp(rx, W / 2, k), cy = lerp(ry, H / 2, k), ex = lerp(rw, W * .75, k), ey = lerp(rh, H * .75, k);
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, ex, ey, 0, 0, 7); ctx.clip();
    const pan = ease.inOut(io(tOne + 1.2, tVan)); cover(img('onecoin_doc_fbi_wanted'), { z: lerp(1.5, 1.0, k) + .35 * pan, ox: .5 - .25 * pan, oy: .3 + .15 * pan, filter: 'brightness(.95)' });
    const b = io(tVan, tVan + 2.2); if (b > 0) { const A = grab('g_burn'); cover(img('onecoin_doc_fbi_wanted'), { z: 1.21, oy: .25, filter: 'brightness(.35) blur(3px)' }); burn(A, b, { seed: 4, cx: .35, cy: .5 }); }
    ctx.restore(); ctx.strokeStyle = `rgba(205,30,30,${.95 * (1 - k)})`; ctx.lineWidth = 9 * u; ctx.beginPath(); ctx.ellipse(cx, cy, ex, ey, 0, 0, 7); ctx.stroke(); }
}
#! end

# cine act=hook fx="code:open_take"
Picture an arena in London. Packed. Dark. Waiting.
Out in the seats are people who have put their savings into a new kind of money, and talked their families into it too.
Then the music swells, a woman in a red ball gown walks into the light, and the whole room gets to its feet.
Her followers call her the Cryptoqueen.
Tonight she'll sell them the future of money. American prosecutors would later call it one of the largest frauds ever.
But this story isn't really about that night. It's about an email she wrote two years before it: one line that says exactly how it would all end.
{grave} This is the story of OneCoin, and of Ruja Ignatova: the woman who wrote her own escape plan… and then vanished.
