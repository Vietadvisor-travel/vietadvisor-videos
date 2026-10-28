/* @effect mould_mill
   @does: real factory footage behind; a steel mould lies in front; on the word a new cavity is cut into it with a shower of sparks, and a price is scratched into the steel beside the new cavity
   @params: clip, go, price, lab, in, out
   @uses: lego_cut_mould + any factory clip
   @tags: mould,tooling,cost,manufacturing,new-part,complexity
   @born: lego a2-13: every new shape needs its own steel mould, and a mould can cost tens of thousands of dollars
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.clip, 0, 1) || img(P.clip), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .1 * k, filter: 'brightness(.38) blur(2px)' });
  const m = img('lego_cut_mould'), mw = W * lerp(.62, .66, k), mh = m ? mw * m.height / m.width : H * .3, mx = W / 2 - mw / 2, my = H * .5 - mh / 2;
  if (m) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 20 * u; ctx.drawImage(m, mx, my, mw, mh); ctx.restore(); }
  const t0 = at(P.go || 0), kc = clamp((t - t0) / 1.1), cx = mx + mw * .78, cy = my + mh * .62, cw = mw * .12, ch = mh * .22;
  if (kc > 0) { ctx.fillStyle = 'rgba(25,25,28,.9)'; ctx.fillRect(cx - cw / 2, cy - ch / 2, cw * kc, ch); ctx.strokeStyle = 'rgba(220,220,230,.6)'; ctx.lineWidth = 2 * u; ctx.strokeRect(cx - cw / 2, cy - ch / 2, cw * kc, ch);
    if (kc < 1) { const r = rng(Math.floor(t * 40)); for (let i = 0; i < 26; i++) { const a = -Math.PI * (.2 + r() * .6), d = r() * 120 * u; ctx.fillStyle = r() > .5 ? '#ffd27a' : '#fff3c4'; ctx.fillRect(cx - cw / 2 + cw * kc + Math.cos(a) * d, cy + Math.sin(a) * d, 4 * u, 4 * u); } } }
  const kp = clamp((t - t0 - 1) / .9); if (kp > 0 && P.price) { const s = P.price.slice(0, Math.ceil(P.price.length * kp)); text(s, cx, cy + ch / 2 + 70 * u, { size: 70 * u, font: 'hand', col: '#f2c14e', lw: 0 }); }
  if (P.lab) text(P.lab, W / 2, H * .12, { size: 58 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: clamp(p(t0 + .3, .4)) });
  ctx.restore();
}
