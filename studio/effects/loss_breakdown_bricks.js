/* @effect loss_breakdown_bricks
   @does: a number built from red studded bricks hangs at the top; on each named cause a share of its bricks breaks off and pours down into its own labelled pile, sized by its part of the total, until only the remainder is left in the number
   @params: bg, num, total, parts, rest, go, in, out
   parts: value^LABEL^word~… ; rest: LABEL shown on what stays
   @uses: any clip or photo
   @tags: breakdown,loss,causes,split,parts,bricks
   @born: lego a4-03: the giant loss came mostly from cleaning up: write-downs, restructuring, and closing what didn't work
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); { const _c = clamp(t / Math.max(1, dur)), _s = 1.01 + .06 * _c * _c * (3 - 2 * _c); ctx.translate(W / 2, H / 2); ctx.scale(_s, _s); ctx.translate(-W / 2 + (_c - .5) * -W * .03, -H / 2); }
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .06 * k, filter: 'brightness(.3) blur(3px)' });
  const F = { '0': '01110100011001110101110011000101110', '1': '00100011000010000100001000010001110', '2': '01110100010000100010001000100011111', '3': '11110000010000101110000010000111110', '4': '00010001100101010010111110001000010', '5': '11111100001111000001000011000101110', '6': '00110010001000011110100011000101110', '7': '11111000010001000100010000100001000', '8': '01110100011000101110100011000101110', '9': '01110100011000101111000010001001100', ',': '00000000000110' };
  const s = String(P.num || '0'), cells = []; let ox = 0; const W0 = []; for (const ch of s) W0.push(ch === ',' ? 2 : 5); const totalW = W0.reduce((a, b) => a + b + 1, -1), cw = Math.min(W * .6 / totalW, H * .3 / 7), x0 = W / 2 - totalW * cw / 2, y0 = H * .08;
  [...s].forEach((ch, j) => { const w = W0[j], g = F[ch] || ''; for (let r = 0; r < 7; r++) for (let c = 0; c < w; c++) if (g[r * w + c] === '1') cells.push({ x: x0 + (ox + c) * cw, y: y0 + r * cw }); ox += w + 1; });
  const R = rng(12), order = cells.map((_, i) => i).sort(() => R() - .5), parts = (P.parts || '').split('~').filter(Boolean).map(q => q.split('^')), total = +(P.total || 1), N = cells.length, grp = new Array(N).fill(-1); let ptr = 0;
  parts.forEach((pt, gi) => { const m = Math.round(N * (+pt[0]) / total); for (let i = 0; i < m && ptr < N; i++) grp[order[ptr++]] = gi; });
  const binX = parts.map((_, gi) => W * (.22 + gi * .28)), base = H * .72, pc = cw * .95, pcols = 6, cnt = parts.map(() => 0);
  const brick = (x, y, sz, a) => { ctx.globalAlpha = a; ctx.fillStyle = '#8f1810'; ctx.fillRect(x + sz * .04, y + sz * .04, sz * .92, sz * .92); ctx.fillStyle = '#c8281e'; ctx.fillRect(x + sz * .04, y + sz * .04, sz * .86, sz * .86); ctx.fillStyle = '#e5483b'; ctx.beginPath(); ctx.arc(x + sz * .47, y + sz * .47, sz * .29, 0, 6.29); ctx.fill(); ctx.globalAlpha = 1; };
  cells.forEach((c, i) => { const gi = grp[i]; if (gi < 0) { brick(c.x, c.y, cw, 1); return; } const st = at(parts[gi][2]) + (cnt[gi] % 40) * .012, idx = cnt[gi]++, tx = binX[gi] - pcols * pc / 2 + (idx % pcols) * pc, ty = base - (Math.floor(idx / pcols) + 1) * pc, kk = clamp((t - st) / .5), e = kk * kk;
    if (kk <= 0) brick(c.x, c.y, cw, 1); else brick(lerp(c.x, tx, kk), lerp(c.y, ty, e), lerp(cw, pc, kk), 1); });
  parts.forEach((pt, gi) => { const a = clamp(p(at(pt[2]) + .5, .4)), top = base - Math.ceil(cnt[gi] / pcols) * pc; text(Number(pt[0]).toLocaleString('en-US'), binX[gi], top - 40 * u, { size: 64 * u, font: 'impact', col: '#ff8a7a', lw: 0, a }); text(pt[1], binX[gi], base + 40 * u, { size: 34 * u, font: 'cond', col: '#efe4cf', lw: 0, ls: 4 * u, a }); });
  ctx.fillStyle = 'rgba(240,230,210,.35)'; ctx.fillRect(W * .08, base + 2 * u, W * .84, 3 * u);
  const last = parts.length ? at(parts[parts.length - 1][2]) : 0; if (P.rest) text(P.rest, W / 2, y0 + 7 * cw + 50 * u, { size: 34 * u, font: 'cond', col: '#efe4cf', lw: 0, ls: 4 * u, a: clamp(p(last + .8, .4)) });
  ctx.restore();
}
