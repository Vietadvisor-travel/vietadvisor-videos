/* @effect floor_grid
   @does: a real floor in perspective: its outline traced as one space, then cut into a grid of lit desks tagged with a monthly price, or a tape of YEAR marks running away along it
   @params: in, out, plate, quad, whole, mode, nx, ny, cut, tag, price, n, lab
   @uses: — (swap these ids for the new episode's own)
   @tags: floor,grid,desks,perspective,lease,unit-economics,real-estate
   @born: wework a1-05: cut it into desks, and rent the desks out by the month
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, stagger, dur }) => {
  // a real floor (photo) seen in perspective: on the word its outline is traced as ONE space; then (mode desks) the floor is
  // cut into a grid of desks that light one by one, each tagged with its monthly price; or (mode lease) a tape of year
  // marks runs away along the floor. params: plate, quad (x,y × 4: far-left, far-right, near-right, near-left), mode, whole, cut, tag, lab, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.plate, 0, 1) || img(P.plate); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.03 + .04 * clamp(t / dur)); ctx.save(); ctx.filter = 'brightness(.85)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const q = String(P.quad || '.3,.55,.7,.55,.95,.86,.05,.86').split(',').map(Number), Q = [[q[0] * W, q[1] * H], [q[2] * W, q[3] * H], [q[4] * W, q[5] * H], [q[6] * W, q[7] * H]];
  const at2 = (a, b) => { const top = [lerp(Q[0][0], Q[1][0], a), lerp(Q[0][1], Q[1][1], a)], bot = [lerp(Q[3][0], Q[2][0], a), lerp(Q[3][1], Q[2][1], a)]; return [lerp(top[0], bot[0], b), lerp(top[1], bot[1], b)]; };
  const out = clamp(p(P.whole || 0, .9, 'inOut')); if (out > 0) { ctx.save(); ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 5 * u; ctx.setLineDash([2 * (W + H) * out, 99999]); ctx.beginPath(); Q.forEach((v, i) => i ? ctx.lineTo(...v) : ctx.moveTo(...v)); ctx.closePath(); ctx.stroke(); ctx.restore(); }
  if (P.mode === 'desks') { const nx = +(P.nx || 6), ny = +(P.ny || 4), c = clamp(p(P.cut || 0, .6, 'inOut'));
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const k = stagger(i + j * nx, nx * ny, P.cut || 0, 1.2, .35); if (k <= 0) continue;
      const a = at2(i / nx, j / ny), b = at2((i + 1) / nx, j / ny), cc = at2((i + 1) / nx, (j + 1) / ny), d = at2(i / nx, (j + 1) / ny);
      ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(242,193,78,.16)'; ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 2.5 * u; ctx.beginPath(); [a, b, cc, d].forEach((v, n) => n ? ctx.lineTo(v[0] + (b[0] - a[0]) * .06 * (n === 1 || n === 2 ? -1 : 1), v[1]) : ctx.moveTo(v[0] + (b[0] - a[0]) * .06, v[1])); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
    const ta = clamp(p(P.tag || 0, .5, 'out')); if (ta > 0) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i += 2) { const m = at2((i + .5) / nx, (j + .5) / ny), sc = .55 + .45 * (j + 1) / ny; text(P.price || '/MONTH', m[0], m[1] - 10 * u, { size: 40 * u * sc / .8, font: 'cond', col: '#fff6df', lw: 0, a: ta * stagger(i + j * nx, nx * ny, P.tag || 0, .8, .3) }); } }
  if (P.mode === 'lease') { const n = +(P.n || 12), r = clamp(p(P.cut || 0, 1.8, 'inOut'));
    for (let i = n - 1; i >= 0; i--) { const f = i / (n - 1), d = Math.pow(f, .55); if (f > r) continue; const a = at2(.5, 1 - d * .96), sc = lerp(1, .22, d), k = clamp((r - f) * n);
      ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(14,12,9,.55)'; setFont(64 * u * sc, 'cond'); const tw = ctx.measureText('YEAR').width + 40 * u * sc; ctx.fillRect(a[0] - tw / 2, a[1] - 40 * u * sc, tw, 80 * u * sc); ctx.restore();
      text('YEAR', a[0], a[1], { size: 64 * u * sc, font: 'cond', col: i % 2 ? '#f2c14e' : '#fff3d6', lw: 0, ls: 4 * u * sc, a: k }); } }
  const la = clamp(p(P.cut || P.whole || 0, .5, 'out')); if (P.lab) text(P.lab, W / 2, H * .14, { size: 72 * u, font: 'cond', col: '#fff6df', lw: 0, ls: 6 * u, a: la });
  ctx.restore();
}
