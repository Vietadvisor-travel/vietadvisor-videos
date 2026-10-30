/* @effect valuation_tag
   @does: a paper price tag swings in on a string in front of a real building and a value is written on it; later values strike the old one through, the tag swinging on each change
   @params: in, out, bg, vals, x, lab, sub
   @uses: — (swap these ids for the new episode's own)
   @tags: price,valuation,tag,repricing,strike,money
   @born: wework a1-16: at a valuation of forty-seven billion dollars
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  // a paper price tag on a string swings into frame in front of a real building (or anything with a price) and a value is
  // written on it by hand; later values can strike the old one through and be written underneath, the tag swinging on each
  // change. params: bg, vals (v@word ~ …), lab (small line on the tag), sub, x, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) cover(bg, { z: 1.03 + .05 * clamp(t / dur), filter: 'brightness(.7) saturate(.85)' });
  const vals = String(P.vals).split('~').map(s => { const [v, w] = s.split('@'); return { v, w }; }), hx = (+P.x || .64) * W, hy = -H * .02;
  const k0 = clamp(spring(vals[0].w ? at(vals[0].w) - .5 : .1, { stiff: 120, damp: 12 }), 0, 1.1); let sw = (1 - k0) * .9; vals.forEach((v, i) => { if (i && t > at(v.w)) { const x = t - at(v.w); sw += Math.exp(-3 * x) * Math.sin(x * 9) * .12; } });
  const len = H * .3, tw = W * .27, th = H * (.36 + .14 * (vals.length - 1)), ang = sw + Math.sin(t * 1.3) * .0;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); ctx.strokeStyle = '#d9cfbd'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len); ctx.stroke();
  ctx.translate(0, len); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 14 * u; ctx.fillStyle = '#efe4c8';
  ctx.beginPath(); ctx.moveTo(-tw * .22, 0); ctx.lineTo(tw * .22, 0); ctx.lineTo(tw / 2, th * .16); ctx.lineTo(tw / 2, th); ctx.lineTo(-tw / 2, th); ctx.lineTo(-tw / 2, th * .16); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(0, th * .08, 9 * u, 0, 7); ctx.fill();
  if (P.lab) text(P.lab, 0, th * .19, { size: 40 * u, font: 'cond', col: '#5b5143', lw: 0, ls: 4 * u });
  vals.forEach((v, i) => { const w = v.w ? clamp((t - at(v.w)) / .5) : clamp(t / .5); if (w <= 0) return; const y = th * (.5 + .17 * i), sz = (i ? 96 : 112) * u;
    ctx.save(); setFont(sz, 'impact'); const full = ctx.measureText(v.v).width; ctx.beginPath(); ctx.rect(-full / 2 - 4, y - sz, full * w + 8, sz * 2); ctx.clip(); text(v.v, 0, y, { size: sz, font: 'impact', col: i === vals.length - 1 ? '#b3261e' : '#1a1a1a', lw: 0 }); ctx.restore();
    const next = vals[i + 1]; if (next && next.w) { const sk = clamp((t - at(next.w) + .25) / .3); if (sk > 0) { setFont(sz, 'impact'); const fw = ctx.measureText(v.v).width; ctx.strokeStyle = '#b3261e'; ctx.lineWidth = 8 * u; ctx.beginPath(); ctx.moveTo(-fw / 2 - 10 * u, y + 6 * u); ctx.lineTo(-fw / 2 - 10 * u + (fw + 20 * u) * sk, y - 10 * u); ctx.stroke(); } } });
  ctx.restore();
  if (P.sub) text(P.sub, W * .27, H * .8, { size: 44 * u, font: 'cond', col: '#efe6d2', lw: 0, a: clamp(p(vals[0].w || 0, .6)) });
  ctx.restore();
}
