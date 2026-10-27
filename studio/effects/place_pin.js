/* @effect place_pin
   @does: a real place (footage or photo) with a map pin dropped on it on the word and an address card beside it
   @params: in, out, bg, x, y, go, lab, sub
   @uses: — (swap these ids for the new episode's own)
   @tags: map,pin,place,address,location,origin
   @born: wework a1-03: their first floor, at 154 Grand Street in SoHo
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // a real place (footage or photo) with a map pin dropped onto it on the word, and the address card it points to: the
  // street becomes a location in the story. params: bg, x, y (pin point, fractions), go, lab, sub, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const px = (+P.x || .5) * W, py = (+P.y || .5) * H, z = 1.04 + .06 * clamp(t / dur);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * 1.02; ctx.save(); ctx.translate(px, py); ctx.scale(z, z); ctx.translate(-px, -py); ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const g = ctx.createRadialGradient(px, py, H * .1, px, py, W * .7); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const d = clamp(spring(P.go || .3, { stiff: 190, damp: 15 }), 0, 1.15), y = py - (1 - Math.min(1, d)) * H * .5;
  if (d > 0) { const r = clamp(p(P.go || .3, 1.2, 'out')); ctx.strokeStyle = `rgba(242,193,78,${(1 - r) * .8})`; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.ellipse(px, py, 20 * u + 90 * u * r, (20 * u + 90 * u * r) * .35, 0, 0, 7); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(px, py, 16 * u, 6 * u, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#e5484d'; ctx.beginPath(); ctx.moveTo(px, y); ctx.bezierCurveTo(px - 34 * u, y - 46 * u, px - 34 * u, y - 96 * u, px, y - 96 * u); ctx.bezierCurveTo(px + 34 * u, y - 96 * u, px + 34 * u, y - 46 * u, px, y); ctx.fill();
    ctx.fillStyle = '#fff4e0'; ctx.beginPath(); ctx.arc(px, y - 66 * u, 11 * u, 0, 7); ctx.fill(); }
  const ca = clamp(p(P.go || .3, .5, 'out5')); if (ca > 0 && P.lab) { const right = px < W * .55, cx = right ? px + 70 * u : px - 70 * u, cy = Math.min(Math.max(py - 150 * u, H * .14), H * .6);
    setFont(64 * u, 'cond'); const tw = Math.max(ctx.measureText(P.lab).width, P.sub ? (setFont(40 * u, 'cond'), ctx.measureText(P.sub).width) : 0) + 60 * u, bx = right ? cx : cx - tw;
    ctx.save(); ctx.globalAlpha = ca; ctx.translate(0, (1 - ca) * 20 * u); ctx.fillStyle = 'rgba(14,13,12,.86)'; ctx.beginPath(); ctx.roundRect(bx, cy - 50 * u, tw, P.sub ? 150 * u : 100 * u, 10 * u); ctx.fill(); ctx.fillStyle = '#e5484d'; ctx.fillRect(bx, cy - 50 * u, 8 * u, P.sub ? 150 * u : 100 * u);
    text(P.lab, bx + 30 * u, cy, { size: 64 * u, font: 'cond', col: '#f4efe4', align: 'left', lw: 0, ls: 3 * u }); if (P.sub) text(P.sub, bx + 30 * u, cy + 62 * u, { size: 40 * u, font: 'cond', col: '#c9bda6', align: 'left', lw: 0 }); ctx.restore(); }
  ctx.restore();
}
