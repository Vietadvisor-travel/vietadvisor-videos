/* PROPS — VEHICLES (side view, facing right). Origin = ground under centre. o.spin = wheel angle. */
'use strict';
function wheel(x, y, r, spin, rim = '#c4c9ce') {
  sCirc(x, y, r, '#26211f', { lw: 6, hi: '#4a4542' }); sCirc(x, y, r * .62, rim, { lw: 4 }); circ(x, y, r * .18, '#555', 3);
  for (let k = 0; k < 6; k++) { const a = spin + k * TAU / 6; line(x, y, x + Math.cos(a) * r * .58, y + Math.sin(a) * r * .58, 3, '#666'); }
}
defProp('moto', 'vehicle', 'Xe máy số (Cub-style motorbike)', 360, 220, (o, t) => {
  const c = o.color || C.red, sp = o.spin ?? t * 12;
  if (o.shadow !== false) shadowBlob(0, 0, 160, .2);
  wheel(-100, -48, 48, sp); wheel(100, -48, 48, sp);
  sRR(-150, -86, 96, 16, 8, '#a8aeb4', { lw: 5 }); // exhaust
  sSmooth([[-130, -110], [-40, -116], [10, -86], [60, -98], [92, -54], [56, -52], [10, -64], [-40, -64], [-116, -82]], c);
  sRR(-128, -136, 112, 26, 13, '#2c2523', { lw: 5 });
  line(100, -48, 74, -156, 10, '#55504c'); line(100, -48, 74, -156, 4, '#9aa1a8');
  sSmooth([[54, -176], [108, -172], [118, -132], [76, -114]], c);
  circ(110, -146, 14, '#fff7b0', 4); line(48, -184, 82, -176, 9);
  if (o.rack !== false) { sRR(-158, -178, 74, 48, 10, o.bagColor || '#4a7bb7'); line(-148, -156, -94, -156, 4, shade(o.bagColor || '#4a7bb7', -.2)); }
  if (o.plate) { rr(-176, -96, 30, 22, 3, '#fff', 4); }
});
defProp('scooter', 'vehicle', 'Xe tay ga (scooter)', 340, 200, (o, t) => {
  const c = o.color || '#f2f2f2', sp = o.spin ?? t * 12; shadowBlob(0, 0, 150, .2);
  wheel(-96, -40, 40, sp); wheel(100, -40, 40, sp);
  sSmooth([[-140, -80], [-120, -132], [-20, -126], [20, -70], [70, -86], [96, -160], [118, -150], [110, -60], [60, -40], [-100, -40]], c);
  sRR(-130, -150, 110, 26, 12, '#2c2523', { lw: 5 }); line(96, -160, 80, -196, 9); line(66, -200, 96, -192, 9); circ(118, -128, 10, '#fff7b0', 4);
});
defProp('cyclo', 'vehicle', 'Xích lô (cyclo)', 380, 260, (o, t) => {
  const sp = o.spin ?? t * 6; shadowBlob(0, 0, 170, .2);
  wheel(-120, -46, 46, sp); wheel(60, -46, 46, sp); wheel(150, -46, 46, sp);
  // passenger seat in front (left)
  sPoly([[-170, -60], [-40, -60], [-30, -150], [-60, -170], [-170, -150]], o.color || '#2f6fb0', { inner: () => rr(-160, -150, 110, 30, 6, '#e8402a', 3) });
  rr(-180, -66, 160, 16, 6, '#3a3a40', 5);
  pline([[-40, -60], [60, -46], [130, -180], [150, -46]], 8, '#3a3a40'); sRR(110, -200, 60, 18, 8, '#2c2523', { lw: 5 });
  if (o.hood) shaded(() => { ctx.moveTo(-176, -150); ctx.quadraticCurveTo(-110, -260, -30, -150); ctx.closePath(); }, '#e8402a');
});
defProp('basketboat', 'vehicle', 'Thuyền thúng (basket boat)', 260, 120, (o, t) => {
  const rk = Math.sin(t * 2) * .05; ctx.rotate(rk);
  sEll(0, -40, 120, 40, '#c99a5b', { inner: () => { for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(i * 14, -80); ctx.lineTo(i * 14 + 20, 0); ctx.lineWidth = 2.5; ctx.strokeStyle = '#8a6235'; ctx.stroke(); ctx.beginPath(); ctx.moveTo(i * 14, -80); ctx.lineTo(i * 14 - 20, 0); ctx.stroke(); } } });
  sEll(0, -62, 120, 18, '#6b4a2a', { lw: 6 });
});
defProp('sampan', 'vehicle', 'Thuyền Tràng An (row boat)', 420, 140, (o, t) => {
  ctx.rotate(Math.sin(t * 1.5) * .02);
  shaded(() => { ctx.moveTo(-210, -60); ctx.quadraticCurveTo(-180, 0, 0, 0); ctx.quadraticCurveTo(180, 0, 210, -60); ctx.quadraticCurveTo(0, -40, -210, -60); ctx.closePath(); }, o.color || '#6e8fb0');
  line(-200, -58, 200, -58, 5, shade(o.color || '#6e8fb0', -.2));
  if (o.oar !== false) { line(120, -120, 180, 20, 7, '#8a5a32'); }
});
defProp('junk', 'vehicle', 'Du thuyền Hạ Long (junk boat)', 520, 420, (o, t) => {
  ctx.rotate(Math.sin(t * 1.2) * .015);
  for (const [x, h, w] of [[-90, 320, 150], [70, 260, 120]]) { line(x, -60, x, -60 - h, 7, '#5a3b26'); sPoly([[x + 4, -60 - h + 10], [x + w, -60 - h + 30], [x + w - 10, -80], [x + 4, -90]], o.sail || '#e8742a', { inner: () => { for (let i = 1; i < 6; i++) line(x, -60 - h + i * h / 6, x + w, -50 - h + i * h / 6 + 10, 3, shade(o.sail || '#e8742a', -.2)); } }); }
  shaded(() => { ctx.moveTo(-250, -110); ctx.lineTo(240, -100); ctx.lineTo(200, 0); ctx.lineTo(-200, 0); ctx.closePath(); }, '#7a4a2a');
  sRR(-180, -170, 300, 64, 8, '#f2e6c8', { inner: () => { for (let i = 0; i < 6; i++) rr(-160 + i * 46, -156, 30, 28, 4, '#5ab8e6', 3); } });
  line(-250, -108, 240, -98, 6, '#4a2a1a');
});
defProp('sleeperbus', 'vehicle', 'Xe giường nằm (sleeper bus)', 640, 260, (o, t) => {
  const sp = o.spin ?? t * 10, c = o.color || '#f2f2f2';
  wheel(-200, -40, 40, sp); wheel(200, -40, 40, sp);
  sRR(-300, -250, 600, 214, 30, c, { inner: () => { for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) rr(-270 + i * 74, -230 + r * 76, 60, 56, 8, '#2f4f70', 3); ctx.fillStyle = C.brand; ctx.fillRect(-310, -80, 620, 18); } });
  rr(240, -230, 50, 120, 10, '#5ab8e6', 4);
});
defProp('train', 'vehicle', 'Tàu hoả Thống Nhất (train carriage)', 700, 260, (o, t) => {
  const c = o.color || '#2f6fb0'; for (const x of [-240, -150, 150, 240]) wheel(x, -26, 26, t * 8, '#999');
  sRR(-330, -240, 660, 200, 16, c, { inner: () => { ctx.fillStyle = '#f2f2f2'; ctx.fillRect(-340, -150, 680, 30); for (let i = 0; i < 7; i++) rr(-300 + i * 88, -220, 64, 54, 8, '#cfe8f6', 3); } });
});
defProp('plane', 'vehicle', 'Máy bay (plane)', 520, 200, (o, t) => {
  sSmooth([[-240, -90], [-200, -120], [180, -124], [250, -98], [200, -70], [-210, -70]], '#f4f4f6'); sPoly([[-20, -96], [80, -96], [-40, -10], [-90, -10]], '#dde3ea'); sPoly([[-200, -110], [-170, -110], [-220, -190], [-250, -190]], C.brand);
  for (let i = 0; i < 9; i++) circ(-140 + i * 34, -102, 7, '#5ab8e6', 2.5); rr(196, -114, 30, 14, 6, '#5ab8e6', 2.5);
});
defProp('bike_flower', 'vehicle', 'Xe đạp bán hoa (Hà Nội flower bike)', 340, 300, (o, t) => {
  wheel(-100, -50, 48, t * 4); wheel(100, -50, 48, t * 4); pline([[-100, -50], [-20, -50], [40, -140], [100, -50]], 7, '#2f6f5a'); pline([[-20, -50], [-50, -140], [40, -140]], 7, '#2f6f5a'); line(-70, -150, -30, -150, 9);
  sPoly([[-170, -150], [-40, -150], [-50, -210], [-160, -210]], '#c99a5b', { inner: () => { for (let i = 0; i < 4; i++) line(-170, -160 - i * 14, -40, -160 - i * 14, 2.5, '#8a6235'); } });
  const cols = ['#ff7aa8', '#ffd23a', '#fff', '#e8302a', '#c58aff'];
  for (let i = 0; i < 16; i++) { const x = -165 + (i * 37 % 120), y = -220 - (i * 23 % 60); line(x, -200, x, y, 3, '#3f8f4a'); sCirc(x, y, 12, cols[i % 5], { lw: 3 }); }
});
