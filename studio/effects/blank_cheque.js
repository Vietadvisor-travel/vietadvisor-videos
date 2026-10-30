/* @effect blank_cheque
   @does: two paper cheques lie on a dark desk under the lamp, one per bidder; on the first word the first cheque writes itself in ink line by line; on the second word the other stays blank, greys and slides away
   @params: bg, a, b, lines, go, go2, in, out
   @uses: none (procedural paper) + optional photo
   @tags: offer,contract,bid,deal,signing,rival
   @born: nike-vs-adidas a2-02: Adidas did not match; Nike gave him five years, $2.5M and his own shoe
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .28})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t1 = at(P.go || 0), t2 = at(P.go2 || P.go || 0), L = (P.lines || '').split('~'), kd = clamp(p(t2, .9, 'inOut'));
  const cheque = (cx, cy, rot, name, fill, gr, a) => { const w = W * .38, h = H * .3; ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.rotate(rot); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = gr ? '#b9b3a8' : '#efe6cf'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(80,60,40,.35)'; ctx.lineWidth = 2 * u; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-w * .42, -h * .1 + i * h * .2); ctx.lineTo(w * .42, -h * .1 + i * h * .2); ctx.stroke(); }
    text(name, -w * .3, -h * .32, { size: 34 * u, font: 'cond', col: '#3a2c1c', lw: 0, ls: 3 * u }); fill(w, h); ctx.restore(); };
  cheque(W * .3, H * .48, -.03, P.a || 'OFFER A', (w, h) => L.forEach((s, i) => { const kk = clamp((t - t1 - i * .5) / .5); if (kk <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-w * .42, -h * .2 + i * h * .2 - 30 * u, w * .84 * kk, 50 * u); ctx.clip(); text(s, 0, -h * .14 + i * h * .2, { size: 40 * u, font: 'hand', col: '#13305e', lw: 0 }); ctx.restore(); }), 0, 1);
  cheque(lerp(W * .72, W * 1.2, kd), H * .52 + kd * 40 * u, .04, P.b || 'OFFER B', () => {}, kd > 0, 1 - kd * .5);
  ctx.restore();
}
