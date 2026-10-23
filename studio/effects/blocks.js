/* @effect blocks
   @does: values become solid blocks that rise out of a dark floor one by one on the beat (photo or tone on their faces, a lit top, a dark side); one block is singled out on a word; an empty plinth can stand for a missing value
   @params: vals, labs, txts, show, go, gap, hl, hlat, img, scale, empty, note, base, in, out, bg
   @uses: optional face image (img) and background clip (bg)
   @tags: data, comparison, bars, solids, ladder, sentences, scale
   @born: onecoin v2 (package ladder, the sentence line-up, Bitcoin vs OneCoin)
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, seam, cover, block, drop, text, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = P.bg ? clip(P.bg, 0, 1) : null; if (bg) cover(bg, { z: 1.1, filter: 'blur(10px) brightness(.3)' }); else { ctx.fillStyle = '#0a0907'; ctx.fillRect(0, 0, W, H); }
  const vals = String(P.vals).split(',').map(Number), labs = String(P.labs || '').split(','), txts = String(P.txts || '').split(','), n = vals.length;
  const base = (+P.base || .78) * H, maxH = H * .58, log = P.scale === 'log', mx = Math.max(...vals.map(v => log ? Math.log10(v + 1) : v)), gw = W * .8 / n, bw = Math.min(gw * .7, W * .2);
  const fl = ctx.createLinearGradient(0, base, 0, H); fl.addColorStop(0, '#1b1611'); fl.addColorStop(1, '#060504'); ctx.fillStyle = fl; ctx.fillRect(0, base, W, H - base);
  const t0 = P.go ? at(P.go) : .3, gap = +(P.gap || .5), hl = P.hl !== undefined ? +P.hl : -1, hk = P.hlat ? clamp(p(P.hlat, .5, 'out')) : 0, face = P.img ? img(P.img) : null;
  const show = +(P.show || 0); vals.forEach((v, i) => { const x = W * .1 + gw * (i + .5), ti = i < show ? -9 : t0 + (i - show) * gap, isEmpty = String(P.empty) === String(i);
    if (t >= ti) { const hh = isEmpty ? 0 : Math.max(10 * u, maxH * (log ? Math.log10(v + 1) : v) / mx), g = clamp((t - ti) / .6), e = 1 - Math.pow(1 - g, 3), cur = hh * e;
      const dim = hl >= 0 && hk > 0 && i !== hl ? 1 - .55 * hk : 1; ctx.save(); ctx.globalAlpha = dim;
      if (isEmpty) { ctx.strokeStyle = 'rgba(216,180,106,.6)'; ctx.setLineDash([10 * u, 8 * u]); ctx.lineWidth = 3 * u; ctx.strokeRect(x - bw / 2, base - maxH * .5, bw, maxH * .5); ctx.setLineDash([]); }
      else if (cur > 1) block(face, x, base - cur / 2, bw, cur, { depth: .18, skew: .5, side: '#120f0b' });
      if (!face && !isEmpty && cur > 1) { const gr = ctx.createLinearGradient(x - bw / 2, 0, x + bw / 2, 0); gr.addColorStop(0, i === hl ? '#e2c27c' : '#7d6a4c'); gr.addColorStop(1, i === hl ? '#b88f45' : '#4d4131'); ctx.fillStyle = gr; ctx.fillRect(x - bw / 2, base - cur, bw, cur); }
      ctx.restore(); const ta = clamp((t - ti - .35) / .3) * dim;
      if (ta > 0) { ctx.save(); ctx.globalAlpha = ta; if (txts[i]) text(txts[i], x, base - (isEmpty ? maxH * .5 : cur) - 52 * u, { size: 72 * u, font: 'impact', col: i === hl ? '#e8c77e' : '#f1e9d8', lw: 0 });
        if (labs[i]) text(labs[i], x, base + 50 * u, { size: 44 * u, font: 'cond', col: '#cbbfa8', lw: 0 }); ctx.restore(); } } });
  if (P.note) text(P.note, W * .5, H * .1, { size: 48 * u, font: 'serif', col: '#a99a82', lw: 0 });
  ctx.restore();
}
