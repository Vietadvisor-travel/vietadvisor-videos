/* @effect laser_scan
   @does: a real product box lies under a checkout scanner; a red laser line sweeps it again and again while a readout beside it hunts for a figure; on the word the readout gives up and prints its answer in red
   @params: box, go, lab, read, in, out
   @uses: lego_cut_box or any cut-out
   @tags: cost,unknown,data,scan,blind,measurement
   @born: lego a4-04: LEGO had no way to cost a single set
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .4, ly: .45 });
  const b = img(P.box || 'lego_cut_box'), k = clamp(t / Math.max(1, dur)), bw = W * .36, bh = b ? bw * b.height / b.width : H * .4, bx = W * .32 - bw / 2 + k * 20 * u, by = H * .47 - bh / 2, t0 = at(P.go || 0);
  if (b) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 20 * u; ctx.drawImage(b, bx, by, bw, bh); ctx.restore(); }
  const ly = by + bh * (.5 + .5 * Math.sin(t * 5)), on = t < t0 + .6; if (on) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createLinearGradient(0, ly - 30 * u, 0, ly + 30 * u); g.addColorStop(0, 'rgba(255,0,0,0)'); g.addColorStop(.5, 'rgba(255,40,30,.75)'); g.addColorStop(1, 'rgba(255,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(bx - 40 * u, ly - 30 * u, bw + 80 * u, 60 * u); ctx.fillStyle = '#ff5040'; ctx.fillRect(bx - 40 * u, ly - 2 * u, bw + 80 * u, 4 * u); ctx.restore(); }
  const rx = W * .73, ry = H * .45, rw = W * .36, rh = H * .3; ctx.fillStyle = '#111a14'; ctx.fillRect(rx - rw / 2, ry - rh / 2, rw, rh); ctx.strokeStyle = '#4a5a50'; ctx.lineWidth = 6 * u; ctx.strokeRect(rx - rw / 2, ry - rh / 2, rw, rh);
  text(P.lab || 'COST PER SET', rx, ry - rh * .27, { size: 36 * u, font: 'cond', col: '#8fe3a8', lw: 0, ls: 5 * u });
  const r = rng(Math.floor(t * 12)), hunt = ['--.--', '- -.- -', '--.-', '---'][Math.floor(r() * 4)], done = t > t0;
  text(done ? (P.read || 'NO DATA') : hunt, rx, ry + rh * .12, { size: 110 * u, font: 'impact', col: done ? '#ff5040' : 'rgba(143,227,168,' + (.4 + .4 * r()).toFixed(2) + ')', lw: 0, a: done ? (Math.floor((t - t0) * 4) % 2 || t > t0 + .8 ? 1 : .35) : 1 });
  ctx.restore();
}
