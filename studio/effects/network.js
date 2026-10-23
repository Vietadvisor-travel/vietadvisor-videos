/* @effect network
   @does: a recruitment pyramid grows downward level by level on the beat: every member is a living footage portrait in a circle, lines join recruit to recruiter, then gold flows up every line to the single node at the top
   @params: clips, levels, go, flow, top, toplab, in, out
   @uses: crowd or people clips (clips)
   @tags: mlm, pyramid, network, recruitment, money-flow, footage
   @born: onecoin v2 (every buyer was also a salesman)
*/
({ t, at, p, W, H, u, clip, ctx, params: P, clamp, lerp, seam, text, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#0c0a08'; ctx.fillRect(0, 0, W, H); const gl = ctx.createRadialGradient(W / 2, H * .3, 0, W / 2, H * .3, W * .7); gl.addColorStop(0, 'rgba(255,200,130,.12)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
  const ids = String(P.clips).split(','), L = +(P.levels || 4), cues = String(P.go || '').split(',').filter(Boolean), tf = P.flow ? at(P.flow) : 1e9;
  const lvT = i => i === 0 ? 0 : cues[i - 1] ? at(cues[i - 1]) : .4 + i * .6, nodes = [];
  for (let l = 0; l < L; l++) { const n = 2 ** l, y = H * (.16 + l * (.66 / Math.max(1, L - 1))); for (let j = 0; j < n; j++) nodes.push({ l, j, x: W * (.5 + (j - (n - 1) / 2) * (.84 / Math.max(1, 2 ** (L - 1))) * (2 ** (L - 1 - l))), y, par: l ? nodes.findIndex(q => q.l === l - 1 && q.j === (j >> 1)) : -1 }); }
  const r0 = H * .11;
  nodes.forEach(nd => { if (nd.par < 0) return; const pa = nodes[nd.par], k = clamp((t - lvT(nd.l)) / .5); if (k <= 0) return; ctx.strokeStyle = 'rgba(216,180,106,.35)'; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(lerp(pa.x, nd.x, k), lerp(pa.y, nd.y, k)); ctx.stroke();
    if (t > tf) for (let q = 0; q < 3; q++) { const f = ((t - tf) * .9 + q / 3 + nd.j * .13) % 1; ctx.fillStyle = '#e8c77e'; ctx.beginPath(); ctx.arc(lerp(nd.x, pa.x, f), lerp(nd.y, pa.y, f), 5 * u, 0, 7); ctx.fill(); } });
  nodes.forEach((nd, i) => { const k = clamp((t - lvT(nd.l) - .15 - nd.j * .04) / .45); if (k <= 0) return; const r = r0 * (nd.l ? Math.max(.5, 1 - nd.l * .16) : 1.15) * (.6 + .4 * (1 - Math.pow(1 - k, 3)));
    const im = clip(ids[i % ids.length], -i * .7, 1); ctx.save(); ctx.globalAlpha = k; ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, 7); ctx.clip(); if (im) { const s = 2 * r / Math.min(im.width, im.height); ctx.filter = 'brightness(1.25) contrast(1.1)'; ctx.drawImage(im, nd.x - im.width * s / 2, nd.y - im.height * s / 2, im.width * s, im.height * s); ctx.filter = 'none'; } ctx.restore();
    ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = nd.l ? 'rgba(241,233,216,.5)' : '#e8c77e'; ctx.lineWidth = (nd.l ? 2 : 5) * u; ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, 7); ctx.stroke(); ctx.restore(); });
  if (P.top && t > tf) { const a = clamp((t - tf - .4) / .4), tp = nodes[0]; ctx.save(); ctx.globalAlpha = a; text(P.top, tp.x + r0 * 1.6, tp.y - 6 * u, { size: 64 * u, font: 'impact', col: '#e8c77e', lw: 0, align: 'left' });
    if (P.toplab) text(P.toplab, tp.x + r0 * 1.6, tp.y + 50 * u, { size: 40 * u, font: 'cond', col: '#cbbfa8', lw: 0, align: 'left' }); ctx.restore(); }
  ctx.restore();
}
