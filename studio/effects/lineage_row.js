/* @effect lineage_row
   @does: a row of real portrait prints lies on the dark desk, one per leader, each with a name and a tag; the family ones are tied by a gold thread; on the word the last print slides into its slot from outside the thread, its tag in a different colour, and the camera eases along the row to it
   @params: items, go, lab, in, out
   items: id^NAME^TAG~… (the last one is the newcomer)
   @uses: any portraits
   @tags: succession,outsider,family,lineage,ceo,generation
   @born: lego a5-02: Knudstorp was 35, and the first chief executive from outside the family in a generation
*/
({ t, at, p, spring, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .45 });
  const I = (P.items || '').split('~').filter(Boolean).map(s => s.split('^')), n = I.length, k = clamp(t / Math.max(1, dur)), t0 = at(P.go || 0), ks = clamp(p(t0, .8, 'out')), pw = W * .19, gap = W * .035, x0 = W / 2 - (n * pw + (n - 1) * gap) / 2 + pw / 2, cy = H * .44;
  ctx.save(); ctx.translate(lerp(W * .03, -W * .03, k), 0);
  ctx.strokeStyle = '#d9a93a'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(x0, cy - H * .2); ctx.lineTo(x0 + (n - 2) * (pw + gap), cy - H * .2); ctx.stroke();
  I.forEach(([id, name, tag], i) => { const last = i === n - 1, im = img(id); if (!im) return; const ph = pw * 1.25, x = x0 + i * (pw + gap), y = last ? lerp(H * 1.3, cy, ks) : cy, rot = last ? lerp(.2, .02, ks) : (i % 2 ? .02 : -.02);
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#efe8da'; ctx.fillRect(-pw / 2 - 10 * u, -ph / 2 - 10 * u, pw + 20 * u, ph + 20 * u); ctx.shadowColor = 'transparent';
    const s = Math.max(pw / im.width, ph / im.height); ctx.beginPath(); ctx.rect(-pw / 2, -ph / 2, pw, ph); ctx.clip(); ctx.filter = last ? 'none' : 'grayscale(.6)'; ctx.drawImage(im, -im.width * s / 2, -ph / 2, im.width * s, im.height * s); ctx.filter = 'none'; ctx.restore();
    if (!last) { ctx.fillStyle = '#d9a93a'; ctx.beginPath(); ctx.arc(x, cy - H * .2, 9 * u, 0, 6.29); ctx.fill(); }
    const a = last ? ks : 1; text(name, x, y + ph / 2 + 44 * u, { size: 32 * u, font: 'cond', col: '#f2ead8', lw: 0, ls: 2 * u, a }); text(tag, x, y + ph / 2 + 86 * u, { size: 30 * u, font: 'cond', col: last ? '#ff8a6a' : '#d9a93a', lw: 0, ls: 2 * u, a }); });
  ctx.restore(); if (P.lab) text(P.lab, W / 2, H * .1, { size: 46 * u, font: 'cond', col: '#efe4cf', lw: 0, ls: 5 * u, a: ks });
  ctx.restore();
}
