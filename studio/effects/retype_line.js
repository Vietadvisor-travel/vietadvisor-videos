/* @effect retype_line
   @does: the camera travels down a real page to one sentence; on the word a paper strip slides across the page and a typewriter retypes that sentence on it, big enough to read, and one word is underlined in red as it lands
   @params: doc, fx, fy, line, hl, go, rate, src, in, out
   @uses: any document page
   @tags: document,quote,verbatim,report,admission,typewriter
   @born: lego a3-02: its own annual report opened: 2003 was a very disappointing year
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const d = img(P.doc), k = clamp(t / Math.max(1, dur)), e = k * k * (3 - 2 * k), fx = +(P.fx || .3), fy = +(P.fy || .25);
  if (d) { const z = lerp(1.1, 2.4, e), s = W / d.width * z, cxp = lerp(.5, fx, e), cyp = lerp(.15, fy, e); ctx.filter = 'brightness(.42)'; ctx.drawImage(d, W / 2 - cxp * d.width * s, H / 2 - cyp * d.height * s, d.width * s, d.height * s); ctx.filter = 'none'; }
  const t0 = at(P.go || 0), L = P.line || '', ks = clamp(p(t0, .35, 'out'));
  if (ks > 0) { const sw = W * .86, sh = 170 * u, sx = lerp(-sw, W / 2 - sw / 2, ks), sy = H * .44 - sh / 2; ctx.save(); ctx.translate(sx + sw / 2, sy + sh / 2); ctx.rotate(-.012); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#f3ecdc'; ctx.fillRect(-sw / 2, -sh / 2, sw, sh); ctx.shadowColor = 'transparent';
    const n = Math.floor(clamp((t - t0 - .35) * +(P.rate || 26), 0, L.length)), sz = Math.min(64 * u, sw * .92 / (L.length * .56)), s = L.slice(0, n); ctx.font = `${sz}px "Courier New", monospace`; const fw = ctx.measureText(L).width, x0 = -fw / 2;
    ctx.fillStyle = '#1e1a15'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, x0, 0);
    if (P.hl) { const i = L.indexOf(P.hl); if (i >= 0 && n >= i + P.hl.length) { const xa = x0 + ctx.measureText(L.slice(0, i)).width, xb = x0 + ctx.measureText(L.slice(0, i + P.hl.length)).width, kh = clamp((t - t0 - .35 - (i + P.hl.length) / +(P.rate || 26)) / .3); ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 6 * u; ctx.beginPath(); ctx.moveTo(xa, sz * .6); ctx.lineTo(lerp(xa, xb, kh), sz * .6); ctx.stroke(); } }
    ctx.restore(); }
  if (P.src) text(P.src, W / 2, H * .62, { size: 30 * u, font: 'cond', col: '#d9cdb8', lw: 0, a: ks });
  ctx.restore();
}
