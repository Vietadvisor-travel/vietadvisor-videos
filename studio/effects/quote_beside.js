/* @effect quote_beside
   @does: a real photo of the speaker fills one side; their verbatim words light from grey to ink word by word on the other, then hold still with the source under them
   @params: in, out, side, pw, pic, size, q, go, span, name, src
   @uses: — (swap these ids for the new episode's own)
   @tags: quote,verbatim,person,document,serif,attribution
   @born: wework a0-04: its mission was to elevate the world's consciousness
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // a real photo of whoever said (or published) the words fills one side; their verbatim words set in serif on the other,
  // lighting from grey to ink word by word as the narrator reaches them, then holding dead still; the source sits under.
  // params: pic, q (the verbatim words), go (word that starts the reveal), span (s), src, name, side (l|r: where the photo is), pw, size, in, out
  const fit = (im, x, y, w, h, z, f) => { if (!im || !im.width) return; const s = Math.max(w / im.width, h / im.height) * z; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); if (f) ctx.filter = f; ctx.drawImage(im, x + w / 2 - im.width * s / 2, y + h / 2 - im.height * s / 2, im.width * s, im.height * s); ctx.restore(); };
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#12110f'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const right = P.side === 'r', pw = W * (+P.pw || .44), px = right ? W - pw : 0;
  fit(clip(P.pic, 0, 1) || img(P.pic), px, 0, pw, H, 1.04 + .05 * clamp(t / dur), 'grayscale(.15) contrast(1.05)');
  const eg = ctx.createLinearGradient(right ? px : px + pw, 0, right ? px + W * .12 : px + pw - W * .12, 0); eg.addColorStop(0, 'rgba(18,17,15,1)'); eg.addColorStop(1, 'rgba(18,17,15,0)'); ctx.fillStyle = eg; ctx.fillRect(right ? px : px + pw - W * .12, 0, W * .12, H);
  const size = (+P.size || 60) * u, tx = right ? W * .07 : pw + W * .05, maxW = W - pw - W * .12, lines = wrap(String(P.q), size, maxW, 'serif');
  const words = lines.map(l => l.split(' ')), n = words.flat().length, lit = clamp((t - at(P.go || 0)) / (+P.span || 2.4)) * n, lh = size * 1.32;
  const y0 = H * .46 - (lines.length - 1) * lh / 2; let idx = 0;
  if (P.name) text(P.name, tx, y0 - lh * .95, { size: 40 * u, font: 'cond', col: '#d6b25e', align: 'left', lw: 0, ls: 4 * u, a: clamp(t / .5) });
  setFont(size, 'serif');
  words.forEach((ws, li) => { let x = tx; ws.forEach(w => { const on = clamp(lit - idx); const c = Math.round(lerp(88, 243, on)); text(w, x, y0 + li * lh, { size, font: 'serif', align: 'left', col: `rgb(${c},${Math.round(lerp(84, 236, on))},${Math.round(lerp(76, 220, on))})`, lw: 0 }); setFont(size, 'serif'); x += ctx.measureText(w + ' ').width; idx++; }); });
  if (P.src) text(P.src, tx, y0 + lines.length * lh + 6 * u, { size: 40 * u, font: 'cond', col: '#a99d87', align: 'left', lw: 0, a: clamp(p(P.go || 0, .6)) });
  ctx.restore();
}
