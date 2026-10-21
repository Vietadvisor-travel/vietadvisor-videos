# Custom scenes: write the animation of a beat as code (v6)

**Templates make films look alike. Code makes each picture belong to its sentence.**
- For the beats that matter (the cold open, the turns, the reveals, the most important idea of each act), the director
  writes a small animation function.
- Claude writes these like a motion designer would in Remotion or After Effects expressions.
- **Target: 10–20 custom scenes per 10-minute episode.** Use `build` for quick compositions, templates only when they fit
  exactly.

## 1. How it works
Put the function in the act's story file, then use it in a beat:
```
#! scene <name>
({ t, at, p, W, H, u, layer, img, draw, text, icon, air, line, ease, lerp, clamp, rng, noise, num, col, params, ctx }) => {
  …draw this frame…
}
#! end
# cine act=fall shot="ms|mcu:pt:.5,.4@gone/dolly" fx="code:<name>;sfx:foley_coins@raised~battle_fire@gone"
They raised one point seven five billion dollars, and it was gone in six months.
```
The function runs **every frame**. It must be a **pure function of time**: no variables kept between frames, and
randomness only through `rng(seed)`.

## 2. The API
| Name | What it is |
|---|---|
| `t` | seconds since the beat started |
| `at(word)` | the time that word is spoken (real voice timing, 3 frames early) |
| `p(word or time, dur=.6, ease='out5')` | eased progress 0→1 starting at that word; eases: lin, out, out5, inOut, back, bounce, elastic |
| `W, H, u` | frame size; `u` = 1 at 1080p (multiply every pixel size by u) |
| `layer(depth, fn)` | draw on a depth plane so the camera rig (`shot=`) parallaxes and defocuses it. 1 = far, 2 = subject, 3 = near. Calls are grouped by depth automatically |
| `img(id, tone?)` | a registered image (real photo, cut-out, generated prop) as a canvas, toned for the look |
| `draw(c, x, y, h, {a, rot, s, sx, ax, ay, shadow, blend})` | draw an image centred at x,y with height h |
| `text(s, x, y, {size, col, font: impact\|cond\|serif\|hand, weight, a, rot, align, ls, lw})` | type in the look's style |
| `icon(name, x, y, h, {col, a, rot})` | the 24 build icons (person, coin, dollar, factory, store, bank, ship, plane, phone, doc, chart_up…) |
| `air(kind, {dens, t0})` | atmosphere: dust, smoke, embers, rain, papers, bills, sparks, confetti… |
| `line(points, {col, w, k, dash})` | a polyline drawn up to fraction k (animate k for a self-drawing line) |
| `num(v, pre, unit)` | 1750000000 → $1.75B |
| `col` | the look's palette: ink, red, gold, card, dark |
| `ease, lerp, clamp, rng(seed), noise(x)` | helpers |
| `ctx` | the raw Canvas2D context, for clips, gradients and anything else |
| `params` | the fx parameters of the beat (to reuse one scene with different data) |
| `sfx:` in the fx | sound effects on words: `sfx:foley_coins@raised~impact_heavy@gone` |

## 3. Craft rules
- **One idea, one motion.** The picture changes on the hit word. Everything else breathes: drift, float, flicker,
  particles.
- **Real material first.** Use `img()` with the episode's real photos and documents. Icons and text support them.
- **Every scene is different.** Don't copy an example's layout. Take its technique (clip, strips, path, grid, highlight)
  and invent a picture for this sentence.
- **Speed:**
  - Keep each scene under about 150 ms a frame (`node tools/pp_speed.mjs`).
  - Prefer pre-drawn images and simple shapes.
  - Never use `ctx.filter` or `shadowBlur` on many objects.
  - Use fewer than 200 drawn items per frame.
- **Test it:** `node tools/pp_sheet.mjs stories/<act>.story` shows every custom scene at 4 moments. Errors appear in red
  on the frame and in the console. Muse fixes only *errors*, never the idea.

## 4. Worked examples (techniques to learn from, not to reuse as-is)
```js
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
```

```js
#! scene hundred_doors
({ t, at, p, W, H, u, layer, icon, text, ease, lerp, rng, col }) => {
  const open = p('opened', 2.2, 'inOut'), shut = p('closed', 1.4, 'inOut');
  for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) { const i = r * 14 + c; const R = rng(i + 9); const on = R() < open * 1.1 && R() > shut * 1.05;
    layer(1.8 + r * .1, () => icon('store', W * (.08 + c * .064), H * (.22 + r * .1), H * .085 * (on ? 1 : .8), { col: on ? col.gold : '#3a4458', a: on ? 1 : .55 })); }
  text(Math.round(1100 * open * (1 - shut * .9)).toLocaleString('en-US') + ' STORES', W / 2, H * .85, { size: 70 * u, col: shut > .3 ? col.red : col.ink });
}
#! end
```

```js
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
```

```js
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
```

```js
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
```

