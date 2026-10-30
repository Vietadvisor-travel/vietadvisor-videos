/* @effect sign_zoom
   @does: the camera travels into one detail of a real archive photo, a frame drawing itself round that detail on the word, and a caption sets under the frame
   @params: pic, x0, y0, x1, y1, go, lab, sub, in, out
   @uses: any photo
   @tags: detail,zoom,sign,archive,evidence,closeup
   @born: nike-vs-adidas a1-02: two brothers register a shoe factory together
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const im = img(P.pic); if (!im) { ctx.restore(); return; } const k = clamp(t / Math.max(1, dur)), e = k * k * (3 - 2 * k), x0 = +(P.x0 || .3), y0 = +(P.y0 || .2), x1 = +(P.x1 || .7), y1 = +(P.y1 || .4), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const s0 = Math.max(W / im.width, H / im.height) * 1.05, s1 = Math.min(W * .62 / ((x1 - x0) * im.width), H * .5 / ((y1 - y0) * im.height)), s = lerp(s0, Math.max(s0, s1), e), px = W / 2 - lerp(.5, cx, e) * im.width * s, py = H * .46 - lerp(.5, cy, e) * im.height * s;
  ctx.filter = 'sepia(.35) brightness(.9)'; ctx.drawImage(im, px, py, im.width * s, im.height * s); ctx.filter = 'none';
  const t0 = at(P.go || 0), kf = clamp((t - t0) / .7); if (kf > 0) { const rx = px + x0 * im.width * s, ry = py + y0 * im.height * s, rw = (x1 - x0) * im.width * s, rh = (y1 - y0) * im.height * s; ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 5 * u; ctx.beginPath(); const per = 2 * (rw + rh) * kf; ctx.moveTo(rx, ry); let d = per; [[rx + rw, ry], [rx + rw, ry + rh], [rx, ry + rh], [rx, ry]].reduce((pr, q) => { if (d <= 0) return q; const L = Math.hypot(q[0] - pr[0], q[1] - pr[1]), f = Math.min(1, d / L); ctx.lineTo(lerp(pr[0], q[0], f), lerp(pr[1], q[1], f)); d -= L; return q; }, [rx, ry]); ctx.stroke(); }
  const a = clamp(p(t0 + .5, .4)); if (P.lab) text(P.lab, W / 2, H * .8, { size: 54 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 4 * u, a }); if (P.sub) text(P.sub, W / 2, H * .86, { size: 34 * u, font: 'cond', col: '#e2d6c2', lw: 0, a });
  ctx.restore();
}
