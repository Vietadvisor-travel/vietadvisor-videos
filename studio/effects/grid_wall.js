/* @effect grid_wall
   @does: a wall of real pictures in a tight grid, all lit; on the word they go dark one after another in a wave (or at random) until a few or none are left, and the count sets over the dark wall
   @params: in, out, ids, cols, rows, keep, order, go, span, lab, sub
   @uses: — (swap these ids for the new episode's own)
   @tags: grid,wall,closure,count,photos,lights-out,scale
   @born: wework a4-09: the pandemic emptied the offices in every city
*/
({ t, at, p, stagger, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, rng, dur }) => {
  // a wall of real pictures (photos or footage) in a tight grid, all lit; on the word they go dark one after another in a
  // wave from a corner (or in random order), until only a few or none are left, and the count sets over the dark wall.
  // params: ids (comma list, repeated to fill), cols, rows, go, span (s), keep (how many stay lit), lab, sub, order (wave|random), in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#080706'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const ids = String(P.ids).split(',').map(s => s.trim()).filter(Boolean), C = +(P.cols || 6), R = +(P.rows || 4), n = C * R, g = 6 * u, cw = (W - g * (C + 1)) / C, ch = (H - g * (R + 1)) / R, keep = +(P.keep || 0), r = rng(7);
  const ord = Array.from({ length: n }, (_, i) => i); if (P.order === 'random') ord.sort(() => r() - .5); else ord.sort((a, b) => ((a % C) + Math.floor(a / C)) - ((b % C) + Math.floor(b / C)));
  const rank = []; ord.forEach((c, k) => rank[c] = k); const z = 1.02 + .03 * clamp(t / dur);
  for (let i = 0; i < n; i++) { const x = g + (i % C) * (cw + g), y = g + Math.floor(i / C) * (ch + g), im = clip(ids[i % ids.length], 0, 1) || img(ids[i % ids.length]);
    const off = rank[i] < n - keep ? clamp((t - at(P.go || 0) - rank[i] / Math.max(1, n - keep) * (+(P.span || 2.2))) / .25) : 0;
    if (im && im.width) { const s = Math.max(cw / im.width, ch / im.height) * z; ctx.save(); ctx.beginPath(); ctx.rect(x, y, cw, ch); ctx.clip(); ctx.filter = `brightness(${(1 - .88 * off).toFixed(2)}) grayscale(${off.toFixed(2)})`; ctx.drawImage(im, x + cw / 2 - im.width * s / 2, y + ch / 2 - im.height * s / 2, im.width * s, im.height * s); ctx.restore(); } }
  const la = clamp((t - at(P.go || 0) - (+(P.span || 2.2)) * .8) / .5); if (P.lab && la > 0) { const gr = ctx.createLinearGradient(0, H * .3, 0, H * .7); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.5, `rgba(0,0,0,${.6 * la})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.fillRect(0, H * .3, W, H * .4);
    text(P.lab, W / 2, H * .47, { size: 110 * u, font: 'impact', col: '#f4efe4', lw: 0, a: la }); if (P.sub) text(P.sub, W / 2, H * .58, { size: 44 * u, font: 'cond', col: '#cfc3ab', lw: 0, a: la }); }
  ctx.restore();
}
