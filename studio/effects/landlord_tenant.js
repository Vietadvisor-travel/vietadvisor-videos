/* @effect landlord_tenant
   @does: looking up at a building: a name card drops high on the facade (who owns it) and another at street level (who rents it), the same portrait on both if it is the same person; gold rent marks climb from tenant to owner
   @params: in, out, bg, face, top, bot, flow, topat, botat
   @uses: — (swap these ids for the new episode's own)
   @tags: landlord,tenant,conflict,self-dealing,building,real-estate
   @born: wework a2-04: the founder was his own company's landlord
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // looking up at a building: two hanging name cards drop in on their words, one high on the facade (who OWNS the
  // building) and one at street level (who RENTS it), each with the same small portrait if it is the same person; then
  // gold rent marks travel up the facade from the tenant to the owner. params: bg, top, bot (label^sub), face, topat, botat, flow, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.04 + .04 * clamp(t / dur)); ctx.save(); ctx.filter = 'brightness(.62) saturate(.8)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const face = P.face ? img(P.face) : null;
  const card = (lab, sub, x, y, w0) => { const k = clamp(spring(w0, { stiff: 150, damp: 16 }), 0, 1.08); if (k <= 0) return; const yy = y - (1 - Math.min(1, k)) * H * .3;
    setFont(58 * u, 'cond'); const tw = Math.max(ctx.measureText(lab).width, (setFont(40 * u, 'cond'), ctx.measureText(sub || '').width)) + (face ? 214 : 70) * u, th = 140 * u;
    ctx.save(); ctx.strokeStyle = '#d9cfbd'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(x, yy - th / 2 - 70 * u); ctx.lineTo(x, yy - th / 2); ctx.stroke();
    ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 12 * u; ctx.fillStyle = '#f2ead9'; ctx.beginPath(); ctx.roundRect(x - tw / 2, yy - th / 2, tw, th, 10 * u); ctx.fill(); ctx.restore();
    let tx = x - tw / 2 + 36 * u; if (face && face.width) { const fs = 112 * u, sc = Math.max(fs / face.width, fs / face.height); ctx.save(); ctx.beginPath(); ctx.arc(tx + fs / 2, yy, fs / 2, 0, 7); ctx.clip(); ctx.drawImage(face, tx + fs / 2 - face.width * sc / 2, yy - face.height * sc * .35, face.width * sc, face.height * sc); ctx.restore(); tx += fs + 26 * u; }
    text(lab, tx, yy - (sub ? 22 * u : 0), { size: 58 * u, font: 'cond', col: '#1c1812', align: 'left', lw: 0, ls: 2 * u }); if (sub) text(sub, tx, yy + 36 * u, { size: 40 * u, font: 'cond', col: '#6b604f', align: 'left', lw: 0 }); };
  const [tl, ts] = String(P.top).split('^'), [bl, bs] = String(P.bot).split('^');
  const fl = clamp(p(P.flow || 0, 2.2, 'lin')); if (fl > 0) for (let i = 0; i < 6; i++) { const f = (fl * 1.6 + i / 6) % 1, x = W * .5 + Math.sin(i * 2.1) * W * .04, y = lerp(H * .7, H * .3, f); ctx.fillStyle = `rgba(242,193,78,${(Math.sin(f * Math.PI) * .95).toFixed(2)})`; text('$', x, y, { size: 64 * u, font: 'impact', col: ctx.fillStyle, lw: 0 }); }
  card(tl, ts, W * .5, H * .26, P.topat || .3); card(bl, bs, W * .5, H * .74, P.botat || .3);
  ctx.restore();
}
