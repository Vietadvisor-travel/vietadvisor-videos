title: demo · fx kit showcase
channel: poisonpill
look: luxury
tone: dry
voice: am_michael*.7+bm_george*.3
delivery: tense
music: auto
captions: off
endcard: off

#! scene photo_tower
({ t, at, p, W, H, u, img, ctx, params, clamp, lerp, extrude, drop, shatter, draw, cover, block }) => {
  // real photos become the floors of a tower: each floor is a thick slab cut from a photo, dropped in on the beat and
  // landing with a bounce; the camera climbs with the tower. On a word one floor is pulled out sideways and the rest shatter.
  // params: floors (image ids, bottom first), go, pull, k (index of the pulled floor), sky (backdrop image)
  const ids = String(params.floors).split(','), n = ids.length, fh = H * .12, fw = W * .4, base = H * .9, t0 = at(params.go), tp = at(params.pull), k = +params.k || 1;
  const S = window.__strips || (window.__strips = {});
  const strip = id => { if (S[id]) return S[id]; const c = img(id); if (!c) return null; const s = document.createElement('canvas'); s.width = 900; s.height = Math.round(900 * fh / fw); const g = s.getContext('2d');
    const sc = Math.max(s.width / c.width, s.height / c.height); g.drawImage(c, (s.width - c.width * sc) / 2, (s.height - c.height * sc) / 2, c.width * sc, c.height * sc); return S[id] = s; };
  const landed = ids.filter((_, i) => t > t0 + i * .42 + .3).length, climb = Math.max(0, (landed + 1.6) * fh - H * .62);
  const cam = 0, prog = clamp((t - t0) / (n * .42 + .5)), sc = lerp(1.9, 1, 1 - Math.pow(1 - prog, 2));   // pull back as it grows
  if (params.sky) cover(img(params.sky), { z: 1.2, oy: cam / H * .2, filter: 'blur(5px) brightness(.5)' });
  ctx.save(); ctx.translate(W / 2, base); ctx.scale(sc, sc); ctx.translate(-W / 2, -base + H * .06 * (sc - 1));
  const g = ctx.createLinearGradient(0, base, 0, base + H * .4); g.addColorStop(0, '#15120e'); g.addColorStop(1, '#050403'); ctx.fillStyle = g; ctx.fillRect(-W, base, W * 3, H * 2);
  ids.forEach((id, i) => {
    const s = strip(id); if (!s) return; const ty = base - (i + .5) * fh, tl = t0 + i * .42, y = drop(tl, ty - H * 1.2 - cam, ty, { bounce: .22 });
    if (t < tl) return;
    if (t >= tp && i === k) { const q = clamp((t - tp) / .45); block(s, W / 2 + q * q * W * .9, ty, fw, fh); return; }
    if (t >= tp + .35) { shatter(s, { x: W / 2, y: ty, w: fw, h: fh, t0: tp + .35 + Math.abs(i - k) * .06, cols: 8, rows: 2, origin: [W / 2, base - (k + .5) * fh], force: 700, floor: base, seed: 3 + i }); return; }
    block(s, W / 2, y, fw, fh);
  });
  ctx.restore();
}
#! end

#! scene doc_flip
({ t, at, p, spring, W, H, u, img, ctx, params, clamp, lerp, card, draw }) => {
  // a real document arrives from deep space, turning over in 3D (its paper back first), and lands flat with a shadow;
  // then a highlighter runs across one line on the word. params: doc, bg, land, mark, line (0..1 height on the page)
  const c = img(params.doc); const k = clamp(spring(params.land, { stiff: 70, damp: 15 }), 0, 1.04);
  ctx.save(); ctx.filter = 'blur(8px) brightness(.4)'; draw(img(params.bg), W / 2, H / 2, H * 1.15); ctx.restore();
  if (!c || t < at(params.land) - .05) return; const w = W * .5, h = w * c.height / c.width;
  card(c, { x: W / 2, y: H * .47, w, h, ry: (1 - k) * Math.PI * 1.15, rx: (1 - k) * .6, rz: -.03 * k, z: (1 - k) * 2600 * u, shadow: k > .3, shade: true, back: '#d8cdb6' });
  const m = clamp(p(params.mark, .7, 'inOut')); if (m > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(250,215,60,.75)'; const y = H * .47 - h / 2 + h * (+params.line || .4); ctx.fillRect(W / 2 - w * .44, y - h * .035, w * .88 * m, h * .07); ctx.restore(); }
}
#! end

#! scene tear_reveal
({ t, at, p, W, H, u, img, clip, ctx, params, clamp, draw, grab, tear, cover }) => {
  // the whole picture (a still with a slow push) tears in two like paper on the word, revealing footage underneath.
  // params: a (image id), b (clip id), go
  cover(img(params.a), { z: 1.05 + .05 * clamp(t / 6) }); const A = grab('tearA');
  const im = clip(params.b, 0, 1); if (im) { const s = Math.max(W / im.width, H / im.height) * 1.04; ctx.drawImage(im, W / 2 - im.width * s / 2, H / 2 - im.height * s / 2, im.width * s, im.height * s); }
  tear(A, clamp(p(params.go, 1.3, 'inOut')), { seed: 5, ang: .1, gap: .7, curl: .14 });
}
#! end

#! scene burn_away
({ t, at, p, W, H, u, img, ctx, params, clamp, draw, grab, burn, cover }) => {
  // a photo burns away from a point with a glowing, charred edge, revealing the next picture beneath. params: a, b, go
  cover(img(params.a), { z: 1.04 + .03 * clamp(t / 6) }); const A = grab('burnA');
  cover(img(params.b), { z: 1.04 }); burn(A, clamp(p(params.go, 2.4, 'inOut')), { seed: 8, cx: .5, cy: .6 });
}
#! end

#! scene gold_ink
({ t, at, p, W, H, u, img, clip, ctx, params, clamp, lerp, blob, extrude, drop, grab, chroma }) => {
  // ink spreads from the centre and the city appears through it; a real object (cut-out with thickness) drops onto the
  // floor in front; on the last word the frame takes an RGB-split hit. params: clip, obj, ink, go, hit
  ctx.fillStyle = '#070605'; ctx.fillRect(0, 0, W, H);
  const r = lerp(0, W * .75, clamp(p(params.ink, 2.2, 'out'))); if (r > 1) { ctx.save(); blob(W / 2, H * .45, r, { seed: 4, wob: .25, flow: 1 }); ctx.clip(); const im = clip(params.clip, 0, 1);
    if (im) { const s = Math.max(W / im.width, H / im.height) * 1.06; ctx.filter = 'brightness(.75)'; ctx.drawImage(im, W / 2 - im.width * s / 2, H / 2 - im.height * s / 2, im.width * s, im.height * s); } ctx.restore(); }
  if (t > at(params.go)) extrude(img(params.obj), W / 2, drop(at(params.go), -H * .4, H * .55, { bounce: .2 }), H * .5, { depth: 26, ang: 2.4 });
  const hk = 1 - clamp((t - at(params.hit)) / .45); if (t > at(params.hit) && hk > 0) chroma(grab('hit'), 16 * hk, { ang: .2 });
}
#! end

# cine act=rise fx="code:photo_tower;floors:onecoin_sofia,onecoin_luxembourg,onecoin_kensington,onecoin_macau,onecoin_dubai,onecoin_wembley_night;go:built;pull:pulled;k:2;sky:onecoin_art_mood_city"
It was built floor by floor, city by city, until it touched the sky. Then one floor was pulled.

# cine act=doubt fx="code:doc_flip;doc:onecoin_doc_doj_greenwood;bg:onecoin_art_investigation_wall;land:paperwork;mark:always;line:.42"
The paperwork arrived later. It always does.

# cine act=fall fx="code:tear_reveal;a:onecoin_dubai;b:stock_weather_sea_lightning_storm_over_colorad_01;go:apart"
And the whole picture came apart.

# cine act=fall fx="code:burn_away;a:onecoin_euro_cash;b:onecoin_art_empty_stage;go:burned"
{grave} The money did not vanish. It burned.

# cine act=after fx="code:gold_ink;clip:stock_city_night_new_york_city_time_lapse_01;obj:onecoin_gold_bars;ink:left;go:gold;hit:silence"
What was left was gold. And silence.
