/* @effect footage_split
   @does: one full-frame shot is sliced into panels on spoken words, each new panel sliding in from the right with its own footage
   @params: base, clips, keys, close
   @uses: — (swap these ids for the new episode's own)
   @tags: footage,split-screen,montage,stock,list
   @born: demo-stock (stock-as-material test)
*/
({ t, at, p, spring, stagger, W, H, u, clip, ctx, params, clamp, lerp, ease }) => {
  // one shot opens full frame, then on a word it is sliced into N panels: each new panel slides in from the right (the film's current)
  // carrying its own footage; at the end the last panel widens back to full frame. params: base, clips (a,b,c), keys (word,word,word), close
  const base = params.base, ids = String(params.clips).split(','), keys = String(params.keys).split(','), n = ids.length + 1;
  const panels = [base, ...ids]; const ks = [1, ...keys.map(k => clamp(spring(k, { stiff: 120, damp: 20 })))];
  const shown = ks.filter(k => k > .001).length; const close = params.close ? clamp(p(params.close, .7, 'inOut')) : 0;
  const total = ks.reduce((a, k) => a + k, 0) || 1; let x = 0;
  panels.forEach((id, i) => {
    let w = W * ks[i] / total; if (close) w = i === panels.length - 1 ? lerp(w, W, close) : w * (1 - close);
    if (w < 1) return; const im = clip(id, 0, 1); ctx.save(); ctx.beginPath(); ctx.rect(x, 0, w, H); ctx.clip();
    if (im) { const s = Math.max(w / im.width, H / im.height) * 1.04; const dx = x + w / 2 + (1 - ks[i]) * 160 * u; ctx.drawImage(im, dx - im.width * s / 2, H / 2 - im.height * s / 2, im.width * s, im.height * s); }
    ctx.restore(); if (i && w < W - 2) { ctx.fillStyle = '#0b0b0d'; ctx.fillRect(x - 3 * u, 0, 6 * u, H); } x += w;
  });
}
