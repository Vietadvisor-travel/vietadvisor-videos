/* @effect table
   @does: the investigator's desk under one lamp: real photos and documents lie on it as prints with borders and shadows; the camera travels across; on a word one print lifts, grows past the frame and becomes the world (its footage can come alive inside it); a red marker can circle a print
   @params: items, pan, lift, at, live, mark, mat, mono, txt, tat, ty, tsize, sub, in, out
   @uses: any image ids (items) and a clip (live)
   @tags: desk, evidence, documents, photos, object-becomes-world, investigation, world
   @born: onecoin v2
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, seam, paperDesk, marker, ellipsePts, cover, text, dur }) => {
  // items: id@x,y,rot,h~…  (x,y fractions of the desk; rot degrees; h print height as a fraction of H)
  const items = String(P.items || '').split('~').filter(Boolean).map(s => { const [id, r] = s.split('@'); const [x, y, rot, h] = (r || '.5,.5,0,.4').split(',').map(Number); return { id: id.trim(), x, y, rot: (rot || 0) * Math.PI / 180, h: h || .4 }; });
  const [x0, x1] = String(P.pan || '0,0').split(',').map(Number), k = clamp(t / Math.max(1, dur)), e = k * k * (3 - 2 * k);
  const li = P.lift !== undefined ? +P.lift : -1, tl = P.at ? at(P.at) : 1e9, g = clamp((t - tl) / .7), ge = g < .5 ? 4 * g * g * g : 1 - Math.pow(-2 * g + 2, 3) / 2;
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.save(); ctx.translate(-lerp(x0, x1, e) * W, 0); paperDesk({ lx: .5 + lerp(x0, x1, e), ly: .42 });
  const drawPrint = (it, extra = 1, lift = 0) => { const c = img(it.id); if (!c) return null; const h = it.h * H * extra, w = h * c.width / c.height, m = P.mat === '0' ? 0 : 10 * u * extra;
    ctx.save(); ctx.translate(it.x * W, it.y * H); ctx.rotate(it.rot * (1 - lift)); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = (16 + 40 * lift) * u; ctx.shadowOffsetY = (8 + 30 * lift) * u;
    ctx.fillStyle = '#ece6d8'; ctx.fillRect(-w / 2 - m, -h / 2 - m, w + 2 * m, h + 2 * m); ctx.shadowColor = 'transparent'; ctx.drawImage(c, -w / 2, -h / 2, w, h); ctx.restore(); return [w, h]; };
  items.forEach((it, i) => { if (i !== li || t < tl) drawPrint(it); });
  if (P.mark) String(P.mark).split(',').forEach((mk, j) => { const [mi, mw] = mk.split('@'); const it = items[+mi]; if (it) { const c = img(it.id); if (c) { const h = it.h * H, w = h * c.width / c.height; marker(ellipsePts(it.x * W, it.y * H, w * .56, h * .58, 7 + j), clamp(p(mw, .7, 'inOut')), { w: 8 }); } } });
  ctx.restore();
  if (li >= 0 && t >= tl && items[li]) { // the lifted print leaves the desk and becomes the frame
    const it = items[li], c = img(it.id); if (c) { const sx = it.x * W - lerp(x0, x1, e) * W, sy = it.y * H, h0 = it.h * H, w0 = h0 * c.width / c.height, fill = Math.max(W / w0, H / h0) * 1.04;
      const s = lerp(1, fill, ge), cx = lerp(sx, W / 2, ge), cy = lerp(sy, H / 2, ge); ctx.save(); ctx.translate(cx, cy); ctx.rotate(it.rot * (1 - ge)); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50 * u * (1 - ge); ctx.shadowOffsetY = 30 * u * (1 - ge);
      const m = 10 * u * (1 - ge); ctx.fillStyle = '#ece6d8'; ctx.fillRect(-w0 * s / 2 - m, -h0 * s / 2 - m, w0 * s + 2 * m, h0 * s + 2 * m); ctx.shadowColor = 'transparent'; if (P.mono) ctx.filter = `grayscale(${clamp(p(P.mono, .5, 'inOut')).toFixed(2)})`; ctx.drawImage(c, -w0 * s / 2, -h0 * s / 2, w0 * s, h0 * s); ctx.filter = 'none';
      if (P.live) { const im = clip(P.live, tl + .5, 1), a = clamp((t - tl - .5) / .5); if (im && a > 0) { ctx.globalAlpha = a; const k2 = Math.max(w0 * s / im.width, h0 * s / im.height); ctx.beginPath(); ctx.rect(-w0 * s / 2, -h0 * s / 2, w0 * s, h0 * s); ctx.clip(); ctx.drawImage(im, -im.width * k2 / 2, -im.height * k2 / 2, im.width * k2, im.height * k2); } }
      ctx.restore(); } }
  ctx.restore();
  if (P.txt) { const a = clamp(p(P.tat || 0, .35, 'out')); if (a > 0) { const yy = (+P.ty || .16) * H, sg = ctx.createLinearGradient(0, yy - H * .18, 0, yy + H * .18); sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(.5, `rgba(6,5,4,${.55 * a})`); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.fillRect(0, yy - H * .18, W, H * .36);
    ctx.save(); ctx.globalAlpha = a; text(P.txt, W / 2, yy, { size: (+P.tsize || 70) * u, font: 'impact', col: '#f3ecdc', lw: 0 }); if (P.sub) text(P.sub, W / 2, yy + (+P.tsize || 70) * .9 * u, { size: 40 * u, font: 'serif', col: '#d8cdb6', lw: 0 }); ctx.restore(); } }
}
