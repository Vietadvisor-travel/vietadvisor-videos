title: custom scenes demo (v6 — the director writes the animation)
channel: poisonpill
look: tech
voice: am_michael
music: none
endcard: off

#! scene money_river
({ t, at, p, W, H, u, layer, img, draw, text, icon, air, ease, lerp, clamp, rng, col, num }) => {
  layer(1, () => { draw(img('t_space'), W / 2, H / 2, H * 1.15, { a: .55 }); });
  const k = p('raised', 1.4), g = p('ads', 1.0), gone = p('gone', .8);
  layer(1.6, () => { const ph = icon('phone', W * .78, H * .5, H * .5 * (1 + .15 * g), { a: 1 - gone * .7 }); });
  for (let i = 0; i < 70; i++) { const r = rng(i * 3 + 1); const sp = .15 + r() * .25; const prog = (r() + t * sp) % 1;
    const x = lerp(W * .05, W * .78, Math.min(1, prog * (1 + g * 2))), y = H * (.5 + Math.sin(prog * 6 + i) * .18 * (1 - prog));
    layer(1.4 + r(), () => icon(r() > .3 ? 'coin' : 'dollar', x, y, (30 + r() * 30) * u * k * (1 - gone), { rot: t * (r() - .5) * 4, a: k * (1 - gone) })); }
  if (gone > 0) air('embers', { dens: 1.5, t0: at('gone') });
  text(num(1750000000 * ease.out(p('raised', 1.6)), '$'), W * .3, H * .25, { size: 130 * u, col: gone > .5 ? col.red : col.gold, a: k });
  text('GONE IN 6 MONTHS', W * .3, H * .38, { size: 46 * u, font: 'cond', weight: 700, col: col.red, a: gone, ls: 6 * u });
}
#! end

#! scene hundred_doors
({ t, at, p, W, H, u, layer, icon, text, ease, lerp, rng, col }) => {
  const open = p('opened', 2.2, 'inOut'), shut = p('closed', 1.4, 'inOut');
  for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) { const i = r * 14 + c; const R = rng(i + 9); const on = R() < open * 1.1 && R() > shut * 1.05;
    layer(1.8 + r * .1, () => icon('store', W * (.08 + c * .064), H * (.22 + r * .1), H * .085 * (on ? 1 : .8), { col: on ? col.gold : '#3a4458', a: on ? 1 : .55 })); }
  text(Math.round(1100 * open * (1 - shut * .9)).toLocaleString('en-US') + ' STORES', W / 2, H * .85, { size: 70 * u, col: shut > .3 ? col.red : col.ink });
}
#! end

# cine act=rise shot="ws|ms:pt:.45,.45@ads/dolly" fx="code:money_river;sfx:foley_coins@raised~whoosh_by@ads~battle_fire@gone"
They raised one point seven five billion dollars, spent it on ads, and it was gone in six months.

# cine act=fall fx="code:hundred_doors;sfx:pop_cascade@opened~glitch_power_down@closed"
They opened eleven hundred stores in three years, and then closed almost all of them.
#! scene shredder
({ t, p, W, H, u, layer, img, draw, text, ease, lerp, rng, col }) => {
  // a document slides into a shredder; strips fall and curl below it
  const inK = p('memo', .8), sh = p('shredded', 1.6, 'lin');
  const doc = img('t_page'); const dw = H * .5, dh = H * .62, x = W / 2, top = lerp(-dh, H * .12, inK) + sh * dh;
  layer(2, () => { const cut = H * .55;                               // the shredder mouth
    if (doc) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, cut); ctx.clip(); ctx.drawImage(doc, x - dw / 2, top, dw, dh); ctx.restore();
      const n = 16; for (let i = 0; i < n; i++) { const r = rng(i); const len = Math.max(0, top + dh - cut); if (len <= 0) break; ctx.save(); ctx.translate(x - dw / 2 + (i + .5) * dw / n, cut); ctx.rotate((r() - .5) * .12 * sh);
        ctx.drawImage(doc, (i / n) * doc.width, Math.max(0, (cut - top) / dh) * doc.height, doc.width / n, Math.min(1, len / dh) * doc.height, -dw / n / 2 + Math.sin(t * 3 + i) * 3 * u * sh, 0, dw / n - 2, len); ctx.restore(); } }
    ctx.fillStyle = '#2b2f36'; ctx.fillRect(x - dw * .62, cut - 18 * u, dw * 1.24, 60 * u); ctx.fillStyle = '#e5484d'; ctx.fillRect(x - dw * .5, cut + 20 * u, 18 * u, 8 * u); });
  text('DELETED', W * .82, H * .3, { size: 70 * u, col: col.red, a: p('shredded', .4), rot: -.1 });
}
#! end

#! scene quote_highlight
({ t, at, p, W, H, u, layer, text, ctx, col, lerp }) => {
  // a verbatim quote set in serif; each phrase is highlighted as the narrator reads it
  const lines = ['"We are not', 'shutting down.', 'Quibi is here', 'to stay."'], keys = ['not', 'shutting', 'here', 'stay'];
  layer(2, () => lines.forEach((l, i) => { const y = H * (.26 + i * .14), k = p(keys[i], .5, 'inOut'); ctx.font = `900 ${84 * u}px "Playfair Display", serif`; const w = ctx.measureText(l).width;
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,214,60,.85)'; ctx.fillRect(W * .5 - w / 2 - 8 * u, y - 30 * u, (w + 16 * u) * k, 66 * u); ctx.restore();
    text(l, W / 2, y, { size: 84 * u, font: 'serif', weight: 900, col: col.ink, lw: 0, a: Math.min(1, p(i ? keys[i - 1] : 'not', .4) + (i ? 0 : 1)) }); }));
  text('— the company, April 2020', W / 2, H * .82, { size: 30 * u, font: 'cond', weight: 700, col: col.ink, lw: 0, a: p('stay', .5) });
}
#! end

#! scene rivals_race
({ t, p, W, H, u, layer, icon, text, line, lerp, ease, col }) => {
  // two companies as cars on a road chart; the leader changes on the word
  const road = (x) => H * (.7 - .45 * Math.pow(x, 1.3)); const k = p('overtook', 1.4, 'inOut'); const go = p('race', 3, 'lin');
  layer(1.8, () => { const pts = []; for (let i = 0; i <= 40; i++) pts.push([W * (.06 + .88 * i / 40), road(i / 40)]); line(pts, { col: '#9aa3b2', w: 26, k: 1 }); line(pts, { col: '#ffffff', w: 3, dash: [18, 16] }); });
  const a = lerp(.15, .62, go) + .12 * (1 - k), b = lerp(.1, .55, go) + .2 * k;     // A leads, then B passes
  layer(2.1, () => { icon('car', W * (.06 + .88 * a), road(a) - 30 * u, 70 * u, { col: '#8a8f98' }); text('BLOCKBUSTER', W * (.06 + .88 * a), road(a) - 90 * u, { size: 26 * u, font: 'cond', weight: 700, col: col.ink, lw: 0 }); });
  layer(2.2, () => { icon('car', W * (.06 + .88 * b), road(b) - 30 * u, 70 * u, { col: col.red }); text('NETFLIX', W * (.06 + .88 * b), road(b) - 90 * u, { size: 26 * u, font: 'cond', weight: 700, col: col.red, lw: 0 }); });
}
#! end

# cine act=doubt fx="code:shredder;sfx:foley_paper@memo~foley_scissors@shredded"
The memo was clear, and by Friday it had been shredded.

# cine act=doubt fx="code:quote_highlight;sfx:foley_marker@not~foley_marker@here"
We are not shutting down. Quibi is here to stay.

# cine act=rise fx="code:rivals_race;sfx:engine_loop@race~whoosh_by@overtook"
For years they were in the race together, until the small one overtook the giant.
