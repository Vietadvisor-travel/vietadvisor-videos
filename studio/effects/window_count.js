/* @effect window_count
   @does: real footage of an apartment block at night; on the word windows light up across the frame faster and faster while the count runs up to its total
   @params: in, out, bg, n, go, lab, sub
   @uses: — (swap these ids for the new episode's own)
   @tags: apartments,count,windows,real-estate,scale,night
   @born: wework a5-11: bought majority stakes in more than four thousand apartments
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, rng, dur }) => {
  // real footage of an apartment block at night; on the word a grid of windows over it lights up faster and faster, far
  // more windows than one building has, while the count runs up to its total and locks. params: bg, n, go, lab, sub, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#05060a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.03 + .05 * clamp(t / dur)); ctx.save(); ctx.filter = 'brightness(.55)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const N = +(P.n || 4000), k = clamp(p(P.go || 0, 3, 'inOut')), cols = 80, rows = 50, cw = W / cols, ch = H * .86 / rows, r = rng(5), shown = Math.floor(cols * rows * k * k);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < shown; i++) { const c = Math.floor(r() * cols), rr = Math.floor(r() * rows); ctx.fillStyle = r() > .3 ? 'rgba(255,205,120,.75)' : 'rgba(255,240,200,.6)'; ctx.fillRect(c * cw + cw * .2, rr * ch + ch * .2, cw * .6, ch * .55); } ctx.restore();
  const cnt = Math.round(N * k), gr = ctx.createLinearGradient(0, H * .3, 0, H * .7); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.5, `rgba(0,0,0,${.8 * clamp(k * 3)})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.fillRect(0, H * .3, W, H * .4);
  text((k >= 1 ? '' : '') + cnt.toLocaleString('en-US') + (k >= 1 ? '+' : ''), W / 2, H * .46, { size: 150 * u, font: 'impact', col: '#ffd58a', lw: 0, a: clamp(k * 4) });
  if (P.lab) text(P.lab, W / 2, H * .58, { size: 52 * u, font: 'cond', col: '#f4efe4', lw: 0, ls: 5 * u, a: clamp(k * 3) }); if (P.sub) text(P.sub, W / 2, H * .66, { size: 40 * u, font: 'cond', col: '#c9bda6', lw: 0, a: clamp(k * 3) });
  ctx.restore();
}
