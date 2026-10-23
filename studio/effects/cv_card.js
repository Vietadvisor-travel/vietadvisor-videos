/* @effect cv_card
   @does: a CV card fills the frame under the lamp and fills in row by row on the beat while the camera rides to the newest row; a yellow correction sticker can fix an inflated claim; the last row can arrive in red and be circled by the marker
   @params: name, rows, step, go, fix, fixrow, fixat, red, ring, in, out
   @uses: none (typeset)
   @tags: biography, cv, credentials, correction, record, founder
   @born: onecoin v2 (the most credible person in any room)
*/
({ t, at, p, spring, W, H, u, ctx, params: P, clamp, lerp, seam, paperDesk, paper, marker, ellipsePts, text, dur }) => {
  // rows: TITLE/detail~…  step: rows visible at the end of the beat (the last one arrives on go)  red: index of a red row  ring: cue word for the marker around the red row
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .45, ly: .45 });
  const rows = String(P.rows || '').split('~').map(r => r.split('/')), step = +(P.step || 0), t0 = at(P.go || 0), red = P.red !== undefined ? +P.red : -1;
  const cw = W * .6, rh = H * .115, top = H * .15, ch = H * .3 + rows.length * rh, cx = W * .5;
  const focus = step > 0 ? top + H * .27 + (step - 1) * rh : top + H * .1, k = clamp((t - t0) / .8), e = k * k * (3 - 2 * k), z = lerp(1.03, 1.11, e), fy = lerp(H * .5, Math.min(focus, H * .62), e * .6);
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -fy + (H / 2 - H * .5));
  ctx.save(); ctx.translate(cx, top + ch / 2); ctx.rotate(-.012); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 18 * u; ctx.drawImage(paper(Math.round(cw), Math.round(ch), { tint: '#e8e1d2' }), -cw / 2, -ch / 2, cw, ch); ctx.restore();
  ctx.fillStyle = '#b08d47'; ctx.fillRect(cx - cw / 2, top, cw, 10 * u);
  text('CURRICULUM VITAE', cx - cw * .44, top + H * .06, { size: 40 * u, font: 'cond', col: '#7a6448', lw: 0, align: 'left', ls: 6 * u });
  text(P.name || '', cx - cw * .44, top + H * .15, { size: 84 * u, font: 'serif', col: '#1f1913', lw: 0, align: 'left' });
  rows.forEach((r, i) => { if (i >= step) return; const isNew = i === step - 1, kk = isNew ? clamp(spring(t0, { stiff: 150, damp: 22 })) : 1; if (kk <= 0) return; const y = top + H * .27 + i * rh, isRed = i === red;
    ctx.save(); ctx.globalAlpha = Math.min(1, kk); ctx.translate((1 - kk) * -60 * u, 0); if (isRed) { ctx.fillStyle = 'rgba(160,30,30,.14)'; ctx.fillRect(cx - cw * .47, y - rh * .42, cw * .94, rh * .84); }
    text(r[0], cx - cw * .44, y - rh * .14, { size: 60 * u, font: 'cond', col: isRed ? '#8f1d1d' : '#2a2219', lw: 0, align: 'left', ls: 2 * u }); if (r[1]) text(r[1], cx - cw * .44, y + rh * .24, { size: 44 * u, font: 'serif', col: isRed ? '#8f1d1d' : '#4a3d2e', lw: 0, align: 'left' }); ctx.restore();
    if (P.fix && String(P.fixrow) === String(i)) { const f = clamp(spring(P.fixat || 0, { stiff: 220, damp: 16 }), 0, 1.15); if (f > 0) { ctx.save(); ctx.translate(cx + cw * .22, y); ctx.rotate(-.07); ctx.scale(f, f); ctx.fillStyle = '#e8c766'; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 12 * u; ctx.fillRect(-190 * u, -40 * u, 380 * u, 80 * u); ctx.shadowColor = 'transparent'; text(P.fix, 0, 0, { size: 48 * u, font: 'impact', col: '#2a2219', lw: 0 }); ctx.restore(); } }
    if (isRed && P.ring) marker(ellipsePts(cx - cw * .1, y, cw * .46, rh * .58, 9), clamp(p(P.ring, .7, 'inOut')), { w: 8 }); });
  ctx.restore();
}
