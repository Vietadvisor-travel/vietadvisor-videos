title: onecoin thumbnail
channel: poisonpill
look: luxury
voice: none
music: none
endcard: off

#! scene thumb_exit
({ t, W, H, u, layer, img, draw, text, ctx, col }) => {
  // three elements: her real portrait cut out (BW, white border), a torn strip of the 2014 email with the line circled
  // in red marker, and "$4B" in gold. Reads at 160 px.
  const bg = ctx.createRadialGradient(W * .62, H * .45, 0, W * .62, H * .45, W * .7); bg.addColorStop(0, '#2a1d12'); bg.addColorStop(1, '#070504');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  layer(1, () => { const p = img('onecoin_ruja'); if (!p) return; const h = H * 1.12, w = h * p.width / p.height, x = W * .02, y = H * .02;
    const s = document.createElement('canvas'); s.width = p.width; s.height = p.height; const g = s.getContext('2d'); g.filter = 'grayscale(1) contrast(1.25) brightness(1.05)'; g.drawImage(p, 0, 0);
    ctx.save(); ctx.shadowColor = '#fff'; for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]]) { ctx.shadowOffsetX = dx * 9 * u; ctx.shadowOffsetY = dy * 9 * u; ctx.drawImage(s, x, y, w, h); } ctx.restore();
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 40 * u; ctx.drawImage(s, x, y, w, h); ctx.restore(); });
  layer(2, () => { // torn email strip
    const cx = W * .7, cy = H * .3, sw = W * .5, sh = H * .27; ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.05);
    const edge = (x0, x1, y, amp, seed) => { const n = 26; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, r = Math.sin(i * 12.9898 + seed) * 43758.5453; ctx.lineTo(x, y + (r - Math.floor(r) - .5) * amp); } };
    ctx.beginPath(); ctx.moveTo(-sw / 2, -sh / 2); edge(-sw / 2, sw / 2, -sh / 2, 22 * u, 1); edge(sw / 2, -sw / 2, sh / 2, 22 * u, 7); ctx.closePath();
    ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 14 * u; ctx.fillStyle = '#efe6d2'; ctx.fill(); ctx.restore();
    text('TAKE THE MONEY', cx, cy - sh * .16, { size: 84 * u, font: 'serif', weight: 900, col: '#17120d', lw: 0, rot: -.05 });
    text('AND RUN', cx + sw * .02, cy + sh * .2, { size: 84 * u, font: 'serif', weight: 900, col: '#17120d', lw: 0, rot: -.05 });
    ctx.save(); ctx.translate(cx, cy + sh * .03); ctx.rotate(-.07); ctx.strokeStyle = 'rgba(200,22,22,.92)'; ctx.lineWidth = 11 * u; ctx.lineCap = 'round'; ctx.beginPath();
    for (let i = 0; i <= 64; i++) { const a = -2.6 + i / 64 * (Math.PI * 2 + .5), rr = 1 + .04 * Math.sin(i * .7); ctx.lineTo(Math.cos(a) * sw * .5 * rr, Math.sin(a) * sh * .56 * rr); } ctx.stroke(); ctx.restore(); });
  layer(3, () => { text('$4B', W * .73, H * .7, { size: 300 * u, font: 'impact', col: col.gold }); });
}
#! end

# cine act=thumb fx="code:thumb_exit"
Thumbnail.
