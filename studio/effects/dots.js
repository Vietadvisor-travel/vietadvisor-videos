/* @effect dots
   @does: a vast number becomes a field of gold points that fills the dark frame in waves from one point outward, faster and faster, while the count sets in large type — a crowd too big to film
   @params: n, go, lab, sub, cx, cy, bg, in, out
   @uses: none (drawn)
   @tags: scale, crowd, victims, count, millions, data
   @born: onecoin v2 (three and a half million investors)
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, seam, text, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#070605'; ctx.fillRect(0, 0, W, H);
  if (P.bg) { const b = clip(P.bg, 0, 1) || img(P.bg); if (b) cover(b, { z: 1.08 + .2 * clamp(t / Math.max(1, dur)), filter: 'brightness(.42)' }); }
  const N = +(P.n || 9000), t0 = at(P.go || 0), k = clamp((t - t0) / Math.max(1, dur * .55)), shown = Math.floor(N * k * k), cx = (+P.cx || .5) * W, cy = (+P.cy || .62) * H;
  const D = window.__dots || (window.__dots = (() => { let s = 12345; const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; return Array.from({ length: 12000 }, () => [r(), r(), r()]); })());
  const pts = D.slice(0, N).map(([a, b, c]) => [a * W, H * .3 + b * H * .7, c]).sort((q, w) => Math.hypot(q[0] - cx, q[1] - cy) - Math.hypot(w[0] - cx, w[1] - cy));
  if (P.row) { const n = +P.n || 24, t0 = at(P.go || 0); for (let i = 0; i < n; i++) { const x = W * (.1 + .8 * i / Math.max(1, n - 1)), y = H * .6, k = clamp((t - t0 - i * .06) / .25); if (k <= 0) continue; ctx.fillStyle = '#e8c77e'; ctx.beginPath(); ctx.arc(x, y, 24 * u * k, 0, 6.29); ctx.fill(); ctx.strokeStyle = '#8a6a2a'; ctx.lineWidth = 4 * u; ctx.stroke(); } if (P.rowlab) text(P.rowlab, W / 2, H * .6 + 70 * u, { size: 44 * u, font: 'cond', col: '#e6dccb', lw: 0, a: clamp(p(t0 + n * .06, .4)) }); } else {
ctx.fillStyle = '#e8c77e'; for (let i = 0; i < shown; i++) {  const [x, y, c] = pts[i], a = .35 + .65 * c, r = (1.2 + c * 1.6) * u; ctx.globalAlpha = a; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); } ctx.globalAlpha = 1; }
  const g = ctx.createLinearGradient(0, 0, 0, H * .45); g.addColorStop(0, 'rgba(7,6,5,1)'); g.addColorStop(1, 'rgba(7,6,5,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * .45);
  const la = clamp(p(P.go || 0, .4, 'out')); if (la > 0 && P.lab) { ctx.globalAlpha = la; text(P.lab, W / 2, H * .16, { size: 104 * u, font: 'impact', col: '#e8c77e', lw: 0 }); if (P.sub) text(P.sub, W / 2, H * .16 + 92 * u, { size: 48 * u, font: 'serif', col: '#e6dccb', lw: 0 }); }
  if (P.sub2) text(P.sub2, W / 2, H * .78, { size: 52 * u, font: 'impact', col: '#f6efe2', lw: 0, a: clamp(p(at(P.at2 || 0), .4)) });
  ctx.restore();
}
