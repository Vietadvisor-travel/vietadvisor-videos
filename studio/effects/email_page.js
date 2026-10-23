/* @effect email_page
   @does: a quoted email as a printed page on the desk under the lamp; the camera reads into it and red marker circles (or underlines) chosen words on their cue words; a source line keeps it honest
   @params: head, lines, src, circle, under, zoom, zat, rot, in, out
   @uses: none (typeset)
   @tags: document, email, evidence, quote, marker, motif
   @born: onecoin v2 (the exit-strategy email, re-read at every act turn)
*/
({ t, at, p, W, H, u, ctx, params: P, clamp, lerp, seam, paperDesk, paper, marker, ellipsePts, dur }) => {
  // head: lines above a rule (· separated); lines: body lines (~ separated); circle: word@cue,word@cue; under: word@cue; zoom: target line index; zat: cue word
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .4 });
  const head = String(P.head || '').split('·').map(s => s.trim()).filter(Boolean), lines = String(P.lines || '').split('~').map(s => s.trim());
  const pw = W * .66, ph = H * .84, fs = 52 * u, lh = fs * 1.45, top = H * .08;
  const z = P.zoom !== undefined ? clamp(p(P.zat || 0, 1.6, 'inOut')) : 0, zl = +(P.zoom || 0), ty = top + H * .08 + head.length * 40 * u + 60 * u + zl * lh;
  const sc = lerp(1.08, 1.45, z), drift = clamp(t / Math.max(1, dur)) * .02;
  ctx.translate(W / 2, H / 2); ctx.scale(sc + drift, sc + drift); ctx.translate(-W / 2, -lerp(H / 2, ty, z)); ctx.translate(W / 2, 0); ctx.rotate((+P.rot || -1.2) * Math.PI / 180);
  const key = 'pg:' + P.head + P.lines + P.src + W, PG = window.__pages || (window.__pages = {}); let pg = PG[key];
  const F = (typeof FONT !== 'undefined' ? FONT : {}), x = pw * .09, pos = {};
  if (!pg) { pg = PG[key] = document.createElement('canvas'); pg.width = Math.round(pw); pg.height = Math.round(ph); const g = pg.getContext('2d'); g.drawImage(paper(pg.width, pg.height), 0, 0);
    let y = H * .07; g.textBaseline = 'middle'; g.textAlign = 'left';
    head.forEach(h => { g.font = `600 ${34 * u}px ${F.cond || 'sans-serif'}`; g.fillStyle = '#5b5145'; g.fillText(h, x, y); y += 40 * u; });
    y += 14 * u; g.fillStyle = 'rgba(80,70,55,.35)'; g.fillRect(x, y, pw * .82, 2 * u); y += 46 * u;
    g.font = `400 ${fs}px "Be Vietnam Pro", sans-serif`; g.fillStyle = '#1f1a14';
    lines.forEach((ln, i) => { g.fillText(ln, x, y + i * lh); let cx = x; ln.split(/(\s+)/).forEach(w => { const ww = g.measureText(w).width; const k = w.toLowerCase().replace(/[^a-z]/g, ''); if (k) (pos[k] = pos[k] || []).push([cx + ww / 2, y + i * lh, ww]); cx += ww; }); });
    if (P.src) { g.font = `400 ${30 * u}px ${F.serif || 'serif'}`; g.fillStyle = '#7a6d5c'; g.fillText(P.src, x, y + lines.length * lh + 40 * u); }
    pg.__pos = pos; }
  ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 18 * u; ctx.drawImage(pg, -pw / 2, top, pw, ph); ctx.shadowColor = 'transparent';
  ctx.translate(-pw / 2, top); const POS = pg.__pos;
  String(P.circle || '').split(',').filter(Boolean).forEach((c, j) => { const [w, cue] = c.split('@'); (POS[w.toLowerCase()] || []).slice(0, 1).forEach(([cx, cy, ww]) => marker(ellipsePts(cx, cy, ww * .7 + 14 * u, fs * .78, 11 + j), clamp(p(cue, .55, 'inOut')), { w: 6 })); });
  String(P.under || '').split(',').filter(Boolean).forEach((c, j) => { const [w, cue] = c.split('@'); (POS[w.toLowerCase()] || []).slice(0, 1).forEach(([cx, cy, ww]) => marker([[cx - ww / 2 - 6 * u, cy + fs * .55], [cx + ww / 2 + 8 * u, cy + fs * .5]], clamp(p(cue, .4, 'out')), { w: 6 })); });
  ctx.restore();
}
