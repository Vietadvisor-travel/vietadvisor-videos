/* @effect medal_drop
   @does: real footage of an old stadium behind; on the word gold medals drop one after another onto a dark ribbon bar and ring as they land, a count beside them, then a caption sets
   @params: bg, n, go, lab, sub, in, out
   @uses: any clip
   @tags: medals,olympics,gold,count,victory,record
   @born: nike-vs-adidas a1-03: Jesse Owens wins four Olympic gold medals in Dassler spikes
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const n = +(P.n || 4), t0 = at(P.go || 0), cx = W / 2, y = H * .48, gap = W * .13;
  ctx.fillStyle = 'rgba(10,10,10,.6)'; ctx.fillRect(cx - gap * n / 2 - 40 * u, y - 110 * u, gap * n + 80 * u, 220 * u);
  for (let i = 0; i < n; i++) { const st = t0 + i * .3, kk = clamp((t - st) / .35); if (kk <= 0) continue; const x = cx + (i - (n - 1) / 2) * gap, yy = y - (1 - kk * kk) * H * .6, r = 70 * u;
    ctx.strokeStyle = '#a3261c'; ctx.lineWidth = 16 * u; ctx.beginPath(); ctx.moveTo(x - 30 * u, yy - r - 80 * u); ctx.lineTo(x, yy - r); ctx.lineTo(x + 30 * u, yy - r - 80 * u); ctx.stroke();
    const g = ctx.createRadialGradient(x - r * .3, yy - r * .3, r * .1, x, yy, r); g.addColorStop(0, '#fff3b0'); g.addColorStop(.5, '#e8b923'); g.addColorStop(1, '#8a6410'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, yy, r, 0, 6.29); ctx.fill(); text(String(i + 1), x, yy, { size: 60 * u, font: 'impact', col: '#6b4b08', lw: 0 }); }
  const a = clamp(p(t0 + n * .3, .4)); if (P.lab) text(P.lab, W / 2, H * .2, { size: 54 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u, a }); if (P.sub) text(P.sub, W / 2, H * .78, { size: 36 * u, font: 'cond', col: '#e2d6c2', lw: 0, a });
  ctx.restore();
}
