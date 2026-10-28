/* @effect box_vs_parts
   @does: a closed cardboard box lands on a dark desk with its small price tag; on the word its parts pour out beside it into a growing heap, and a much bigger tag drops onto the heap: the parts cost more than the box sells for
   @params: bg, box, go, heap, btag, htag, note, in, out
   @uses: lego_cut_box, lego_cut_brick_* , any photo or clip as bg
   @tags: cost,price,loss-leader,box,parts,mismatch
   @born: lego a0-05: some sets cost more to source than the whole box sold for
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H); if (bg) cover(bg, { z: 1.08 + .12 * clamp(t / Math.max(1, dur)), filter: 'brightness(.35) blur(3px)' });
  const g = ctx.createRadialGradient(W * .5, H * .7, 0, W * .5, H * .7, W * .6); g.addColorStop(0, 'rgba(255,214,150,.18)'); g.addColorStop(1, 'rgba(0,0,0,.5)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const bx = img(P.box || 'lego_cut_box'), kb = clamp(spring(.15, { stiff: 160, damp: 16 }), 0, 1.05), floor = H * .84;
  if (bx) { const h = H * .42, w = h * bx.width / bx.height; ctx.drawImage(bx, W * .3 - w / 2, floor - h - (1 - Math.min(1, kb)) * H * .6, w, h); }
  const tag = (s, x, y, sc, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, a); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = '#f4ecd9'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 16 * u; const tw = s.length * 22 * u + 70 * u; ctx.fillRect(-tw / 2, -46 * u, tw, 92 * u); ctx.shadowColor = 'transparent'; ctx.restore(); text(s, x, y + 2 * u, { size: 40 * u * sc, font: 'cond', col: '#2a2219', lw: 0, ls: 3 * u, a }); };
  tag(P.btag || "THE BOX'S PRICE", W * .3, H * .3 - (1 - clamp(p(.5, .5))) * 40 * u, .9, clamp(p(.5, .5)));
  const ids = ['lego_cut_brick_red', 'lego_cut_brick_yellow', 'lego_cut_brick_blue', 'lego_cut_brick_white'].map(i => img(i)), r = rng(4), t0 = at(P.go || 0), n = +(P.heap || 70);
  let top = floor; for (let i = 0; i < n; i++) { const st = t0 + i * .045, b = ids[i % 4]; if (t < st || !b) continue; const xx = r(), sz = (.035 + r() * .03) * H, col = Math.abs(xx - .5) * 2;
    const fy = floor - H * .3 * (1 - col * col) * clamp(i / n * 1.2) - r() * H * .03, x = W * (.56 + xx * .32), tau = t - st, sx = lerp(W * .3, x, clamp(tau * 2.2)), y = Math.min(fy, floor - H * .38 - 40 * u + 2200 * u * tau * tau);
    top = Math.min(top, fy); ctx.save(); ctx.translate(sx, y); ctx.rotate((r() - .5) * 2); const w = sz * b.width / b.height; ctx.drawImage(b, -w / 2, -sz / 2, w, sz); ctx.restore(); }
  const ht = t0 + n * .045 * .7, kh = clamp(spring(ht, { stiff: 140, damp: 11 }), 0, 1.15); if (t > ht) tag(P.htag || 'WHAT THE PARTS COST', W * .72, lerp(-H * .2, H * .3, Math.min(1, kh)), 1.35, 1);
  if (P.note) text(P.note, W / 2, H * .1, { size: 34 * u, font: 'cond', col: '#d9cdb8', lw: 0, ls: 2 * u, a: clamp(p(t0, .5)) * .9 });
  ctx.restore();
}
