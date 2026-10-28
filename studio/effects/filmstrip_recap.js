/* @effect filmstrip_recap
   @does: a strip of film frames slides across the dark, each frame a real picture of something the story let go; as each passes the centre a red line strikes through it; a top line sets the context
   @params: frames, go, lab, sub, in, out
   frames: id^LABEL~…
   @uses: any photos or clips
   @tags: recap,stopped,cut,focus,summary,subtraction
   @born: lego a5-16: the swing came from what LEGO stopped doing
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#0c0a08'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const F = (P.frames || '').split('~').filter(Boolean).map(s => s.split('^')), fw = W * .3, fh = fw * .62, gap = 36 * u, cy = H * .48, k = clamp(t / Math.max(1, dur)), t0 = at(P.go || 0), stripW = F.length * (fw + gap), off = lerp(W * .55, W * .45 - stripW + fw, k);
  ctx.fillStyle = '#1b1814'; ctx.fillRect(0, cy - fh / 2 - 46 * u, W, fh + 92 * u); ctx.fillStyle = '#0c0a08'; for (let x = (off % (40 * u)) - 40 * u; x < W; x += 40 * u) { ctx.fillRect(x, cy - fh / 2 - 34 * u, 20 * u, 16 * u); ctx.fillRect(x, cy + fh / 2 + 18 * u, 20 * u, 16 * u); }
  F.forEach(([id, lab], i) => { const x = off + i * (fw + gap), im = clip(id, 0, 1) || img(id); if (x > W || x + fw < 0) return; if (im) { const s = Math.max(fw / im.width, fh / im.height); ctx.save(); ctx.beginPath(); ctx.rect(x, cy - fh / 2, fw, fh); ctx.clip(); ctx.filter = 'brightness(.8)'; ctx.drawImage(im, x + fw / 2 - im.width * s / 2, cy - im.height * s / 2, im.width * s, im.height * s); ctx.restore(); }
    const passed = clamp((W * .55 - x) / (fw * .5)); if (t > t0 && passed > 0) { ctx.strokeStyle = '#e0352a'; ctx.lineWidth = 12 * u; ctx.beginPath(); ctx.moveTo(x + fw * .08, cy + fh * .35); ctx.lineTo(x + fw * .08 + fw * .84 * passed, cy + fh * .35 - fh * .7 * passed); ctx.stroke(); }
    const la = clamp(Math.min(x - W * .06, W * .94 - fw - x) / (60 * u)); if (lab && la > 0) text(lab, x + fw / 2, cy + fh / 2 + 80 * u, { size: 34 * u, font: 'cond', col: '#efe4cf', lw: 0, ls: 4 * u, a: la }); });
  if (P.lab) text(P.lab, W / 2, H * .13, { size: 54 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 6 * u }); if (P.sub) text(P.sub, W / 2, H * .2, { size: 30 * u, font: 'cond', col: '#d9cdb8', lw: 0 });
  ctx.restore();
}
