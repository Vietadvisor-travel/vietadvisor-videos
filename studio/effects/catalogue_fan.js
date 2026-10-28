/* @effect catalogue_fan
   @does: real photos of more and more products are dealt onto a dark table like cards, faster and faster, overlapping and turning; on each named word one card lands big in the middle
   @params: cards, keys, go, in, out
   @uses: any set of product photos
   @tags: diversification,sprawl,products,many,catalogue,more
   @born: lego a2-07: by the nineties LEGO was saying yes to everything, more parks, clothes, watches, video games
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, paperDesk, rng, dur }) => {
  // cards: image ids joined with ~ (dealt in order, looping); keys: id@word~… lands that card big on its word
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .45 });
  const C = (P.cards || '').split('~').filter(Boolean), r = rng(14), t0 = at(P.go || 0), n = 34;
  for (let i = 0; i < n; i++) { const st = t0 + Math.pow(i / n, 1.4) * Math.max(1.5, dur * .75), im = img(C[i % C.length]); if (t < st || !im) { r(); r(); r(); continue; } const x = W * (.1 + r() * .8), y = H * (.15 + r() * .7), rot = (r() - .5) * .8, kk = clamp((t - st) / .25), w = W * .16;
    const h = w * im.height / im.width; ctx.save(); ctx.translate(lerp(W * 1.1, x, kk), lerp(-H * .2, y, kk)); ctx.rotate(rot * kk); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 14 * u; ctx.fillStyle = '#f2ece0'; ctx.fillRect(-w / 2 - 6 * u, -h / 2 - 6 * u, w + 12 * u, h + 12 * u); ctx.shadowColor = 'transparent'; ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore(); }
  (P.keys || '').split('~').filter(Boolean).forEach(s => { const [id, w] = s.split('@'), im = img(id), st = at(w); if (!im || t < st) return; const nxt = (P.keys.split('~').map(q => at(q.split('@')[1])).filter(q => q > st)[0]) || 1e9; if (t > nxt + .15) return;
    const kk = clamp(spring(st, { stiff: 200, damp: 18 }), 0, 1.05), ww = W * .42 * kk, hh = ww * im.height / im.width; ctx.save(); ctx.translate(W / 2, H * .48); ctx.rotate(-.03); ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 40 * u; ctx.fillStyle = '#f2ece0'; ctx.fillRect(-ww / 2 - 10 * u, -hh / 2 - 10 * u, ww + 20 * u, hh + 20 * u); ctx.shadowColor = 'transparent'; ctx.drawImage(im, -ww / 2, -hh / 2, ww, hh); ctx.restore(); });
  ctx.restore();
}
