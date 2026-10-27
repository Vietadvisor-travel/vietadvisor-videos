/* @effect cent_grid
   @does: a hundred real banknotes laid out in a grid stand for the whole sum; on the word ninety-nine of them drop away off the floor one after another and a single note is left in the light
   @params: img, at, keep, share (how many notes stay), lab, sub, in, out
   @uses: a banknote image (img)
   @tags: money, ratio, percent, loss, recovery, one-percent
   @born: onecoin v2 (one cent on the dollar)
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, seam, paperDesk, drop, text, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .45 });
  const NT = window.__note || (window.__note = (() => { const c = document.createElement('canvas'); c.width = 520; c.height = 230; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 520, 230); gr.addColorStop(0, '#cfd8c4'); gr.addColorStop(1, '#93a58c'); g.fillStyle = gr; g.beginPath(); g.roundRect(0, 0, 520, 230, 14); g.fill(); g.strokeStyle = 'rgba(30,50,30,.55)'; g.lineWidth = 6; g.strokeRect(16, 16, 488, 198); g.lineWidth = 2; g.strokeRect(28, 28, 464, 174); g.fillStyle = 'rgba(30,50,30,.75)'; g.font = '700 90px Anton, sans-serif'; g.textBaseline = 'middle'; g.fillText('100', 48, 118); g.textAlign = 'right'; g.fillText('100', 472, 118); g.beginPath(); g.arc(260, 115, 62, 0, 7); g.fillStyle = 'rgba(30,50,30,.18)'; g.fill(); return c; })());
  const c = P.img ? img(P.img) || NT : NT; const cols = 10, rows = 10, gw = W * .56, cw = gw / cols, chh = cw * .48, gx = W / 2 - gw / 2 + cw / 2, gy = H * .08 + chh / 2, keep = +(P.keep ?? 44), t0 = P.at ? at(P.at) : 1e9;
  for (let i = 0; i < 100; i++) { const x = gx + (i % cols) * cw, y0 = gy + Math.floor(i / cols) * chh * 1.32, r = ((i * 37) % 100) / 100, td = t0 + r * 1.4, nk = +(P.share || 1), kept = nk > 1 ? r * 100 >= 100 - nk : i === keep, gone = !kept && t > td;
    const y = gone ? drop(td, y0, y0 + H * 1.2, { bounce: 0 }) : y0, rot = gone ? (t - td) * (r - .5) * 3 : 0, a = gone ? clamp(1 - (t - td) / 1.2) : 1, lit = kept && t > t0 + 1.5 ? clamp((t - t0 - 1.5) / .5) : 0;
    if (a <= 0) continue; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); const s = 1 + lit * .25; ctx.scale(s, s); ctx.shadowColor = lit ? 'rgba(232,199,126,.8)' : 'rgba(0,0,0,.5)'; ctx.shadowBlur = (lit ? 40 : 8) * u;
    ctx.drawImage(c, -cw * .45, -chh * .45, cw * .9, chh * .9); ctx.restore(); }
  const la = clamp((t - t0 - 1.8) / .4); if (la > 0 && P.lab) { ctx.save(); ctx.globalAlpha = la; text(P.lab, W / 2, H * .74, { size: 72 * u, font: 'impact', col: '#e8c77e', lw: 0 }); if (P.sub) text(P.sub, W / 2, H * .74 + 66 * u, { size: 40 * u, font: 'cond', col: '#cbbfa8', lw: 0 }); ctx.restore(); }
  ctx.restore();
}
