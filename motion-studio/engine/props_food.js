/* PROPS — FOOD & DRINK. Origin = bottom-centre on the table/ground. o.steam toggles steam. */
'use strict';
function steamFx(x, y, t, n = 3, s = 1) {
  for (let k = 0; k < n; k++) { const p = ((t * .55 + k / n) % 1); ctx.save(); ctx.globalAlpha *= (1 - p) * .7 * Math.min(1, p * 4);
    ctx.beginPath(); const xx = x + (k - (n - 1) / 2) * 26 * s; ctx.moveTo(xx, y);
    for (let i = 0; i < 6; i++) ctx.quadraticCurveTo(xx + Math.sin(i * 1.7 + t * 3 + k) * 14 * s, y - (i + .5) * 22 * s * (0.4 + p), xx + Math.sin(i + t * 2 + k) * 6 * s, y - (i + 1) * 22 * s * (0.4 + p));
    ctx.lineWidth = 10 * s; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
}
function bowl(w, h, col = '#f7f4ec', rim = '#3a6fb0', y = 0) {
  sPoly([[-w, y - h], [w, y - h], [w * .62, y - 8], [-w * .62, y - 8]], col, { inner: () => { for (let i = -5; i <= 5; i++) { ctx.beginPath(); ctx.arc(i * w * .18, y - h * .55, 7, 0, TAU); ctx.lineWidth = 3; ctx.strokeStyle = rim; ctx.stroke(); } line(-w, y - h + 9, w, y - h + 9, 4, rim); } });
  sRR(-w * .4, y - 12, w * .8, 12, 4, col, { lw: 5 });
}
defProp('pho', 'food', 'Phở bò (beef noodle soup)', 230, 190, (o, t) => {
  if (o.steam !== false) steamFx(0, -150, t, 3);
  bowl(110, 100);
  ell(0, -100, 108, 26, '#d99a4a', 5); // broth
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, -100, 104, 23, 0, 0, TAU); ctx.clip();
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-90 + i * 20, -96); ctx.bezierCurveTo(-80 + i * 20, -120, -60 + i * 20, -80, -50 + i * 20, -104); ctx.lineWidth = 5; ctx.strokeStyle = '#fbf3df'; ctx.stroke(); }
  for (const [x, y, r] of [[-40, -104, 0], [10, -98, .4], [50, -106, -.3]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(r); sEll(0, 0, 26, 9, '#a8564a', { lw: 3 }); line(-16, -2, 16, 2, 2, '#e8a090'); ctx.restore(); }
  for (const [x, y] of [[-70, -100], [80, -98], [-10, -110], [30, -94]]) { ell(x, y, 10, 5, '#5aa845', 2.5, .5); }
  for (const [x, y] of [[-60, -110], [60, -112]]) ell(x, y, 5, 3, '#e8402a', 0);
  ctx.restore();
  // chopsticks + lime + chili
  line(-40, -170, 110, -88, 9, '#c58a4a'); line(-24, -178, 118, -96, 9, '#b07a3c');
  ctx.save(); ctx.translate(150, -8); sCirc(0, -18, 18, '#8ccf4a', { lw: 4 }); ctx.restore();
});
defProp('banhmi', 'food', 'Bánh mì (baguette sandwich)', 260, 130, (o, t) => {
  sPoly([[-120, -10], [120, -10], [100, 0], [-100, 0]], '#f0e2c0', { lw: 4 }); // paper
  // bottom bun
  sSmooth([[-125, -30], [-110, -10], [110, -10], [125, -30], [0, -44]], '#e7a45a');
  // fillings
  for (let i = 0; i < 7; i++) { ctx.save(); ctx.translate(-90 + i * 30, -46); ctx.rotate(-.3 + i * .1); rr(-14, -4, 28, 8, 3, '#f08a3c', 3); ctx.restore(); }
  for (let i = 0; i < 6; i++) ell(-80 + i * 32, -52, 16, 7, '#5aa845', 3, i * .4);
  for (let i = 0; i < 5; i++) rr(-90 + i * 40, -60, 30, 9, 3, '#e4a69a', 3);
  ell(-20, -48, 10, 4, '#e8402a', 0);
  // top bun
  sSmooth([[-128, -50], [-100, -86], [0, -98], [100, -86], [128, -54], [0, -60]], '#eaa95e', { inner: () => { for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 30 - 10, -80); ctx.quadraticCurveTo(i * 30, -90, i * 30 + 12, -78); ctx.lineWidth = 4; ctx.strokeStyle = '#ffd59a'; ctx.stroke(); } } });
}, { gripY: 50 });
defProp('caphe_phin', 'food', 'Cà phê phin (drip coffee)', 120, 220, (o, t) => {
  // glass
  sPoly([[-46, -110], [46, -110], [40, 0], [-40, 0]], 'rgba(220,240,250,.55)', { hi: '#fff', inner: () => { ctx.fillStyle = '#fff3d8'; ctx.fillRect(-60, -24, 120, 30); ctx.fillStyle = '#5a3420'; ctx.fillRect(-60, -64, 120, 42); } });
  // drip
  const p = (t * 1.2) % 1; circ(0, -112 + p * 40, 4, '#3a2014', 0);
  // phin filter
  sRR(-38, -150, 76, 40, 6, '#c7ccd1'); sRR(-56, -114, 112, 10, 4, '#aab0b6', { lw: 5 }); sRR(-30, -170, 60, 22, 8, '#d3d7db', { lw: 5 }); sCirc(0, -178, 8, '#aab0b6', { lw: 4 });
});
defProp('caphe_suada', 'food', 'Cà phê sữa đá (iced milk coffee)', 110, 230, (o, t) => {
  sPoly([[-44, -150], [44, -150], [38, 0], [-38, 0]], 'rgba(220,240,250,.5)', { hi: '#fff', inner: () => { const g = ctx.createLinearGradient(0, -130, 0, 0); g.addColorStop(0, '#8a5432'); g.addColorStop(1, '#c79262'); ctx.fillStyle = g; ctx.fillRect(-60, -125, 120, 130); for (const [x, y] of [[-14, -100], [16, -80], [-6, -54], [18, -30]]) rr(x - 12, y - 12, 24, 22, 5, 'rgba(255,255,255,.55)', 2.5); } });
  line(12, -150, 30, -215, 8, C.red); line(12, -150, 30, -215, 3, '#fff');
}, { gripY: 70 });
defProp('caphe_trung', 'food', 'Cà phê trứng (egg coffee)', 130, 140, (o, t) => {
  sEll(0, -6, 66, 14, '#f4efe6', { lw: 5 }); // saucer
  sPoly([[-44, -90], [44, -90], [34, -14], [-34, -14]], '#f7f4ec');
  ell(0, -90, 44, 12, '#f6d58a', 5); ctx.save(); ctx.globalAlpha = .6; ell(-8, -92, 14, 4, '#c7883e', 0); ctx.restore();
  ctx.beginPath(); ctx.arc(52, -56, 18, -1.4, 1.4); fs(null, 8); ctx.beginPath(); ctx.arc(52, -56, 18, -1.4, 1.4); fs(null, 3, '#f7f4ec');
  if (o.steam !== false) steamFx(0, -110, t, 2, .7);
});
defProp('banhxeo', 'food', 'Bánh xèo (crispy pancake)', 260, 110, (o, t) => {
  sEll(0, -14, 128, 22, '#f4efe6'); // plate
  shaded(() => { ctx.moveTo(-100, -26); ctx.quadraticCurveTo(0, -140, 100, -26); ctx.closePath(); }, '#f2b632', { inner: () => { for (let i = 0; i < 18; i++) circ(-80 + (i * 37 % 160), -40 - (i * 23 % 60), 4, '#d8862a', 0); } });
  for (let i = 0; i < 4; i++) ell(-40 + i * 26, -32, 14, 6, '#f2a0a0', 3, .2); for (let i = 0; i < 6; i++) ell(-90 + i * 36, -18, 16, 6, '#5aa845', 3, i);
});
defProp('goicuon', 'food', 'Gỏi cuốn (fresh spring rolls)', 250, 110, (o, t) => {
  sEll(0, -10, 124, 20, '#f4efe6');
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(-70 + i * 60, -40); ctx.rotate(-.15); sRR(-30, -22, 60, 46, 22, 'rgba(250,245,235,.9)', { lw: 4, inner: () => { ell(-6, -4, 12, 7, '#f08a6a', 0); ell(10, 6, 12, 6, '#7cc05c', 0); } }); ctx.restore(); }
  sCirc(100, -34, 22, '#c9853e', { lw: 4 }); ctx.save(); ctx.globalAlpha = .8; ell(100, -40, 14, 6, '#7a4a2a', 0); ctx.restore();
});
defProp('buncha', 'food', 'Bún chả (grilled pork & noodles)', 280, 160, (o, t) => {
  ctx.save(); ctx.translate(-70, 0); bowl(70, 70, '#f7f4ec', '#3a6fb0'); ell(0, -70, 68, 16, '#e0a35a', 4);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, -70, 64, 14, 0, 0, TAU); ctx.clip(); for (let i = 0; i < 5; i++) sCirc(-40 + i * 20, -70, 12, '#8a4a2a', { lw: 3 }); for (let i = 0; i < 3; i++) ell(-30 + i * 30, -76, 9, 5, '#f08a3c', 2); ctx.restore(); ctx.restore();
  ctx.save(); ctx.translate(70, 0); sEll(0, -10, 80, 16, '#f4efe6'); for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(-40 + i * 10, -24, 14, Math.PI, 0); fs(null, 4, '#fbf3df'); } ctx.restore();
  if (o.steam !== false) steamFx(-70, -100, t, 2, .7);
});
defProp('comtam', 'food', 'Cơm tấm (broken rice)', 260, 120, (o, t) => {
  sEll(0, -12, 126, 22, '#f4efe6');
  sSmooth([[-90, -24], [-60, -60], [-10, -62], [10, -28]], '#fbf8ef'); for (let i = 0; i < 20; i++) ell(-70 + (i * 13 % 70), -32 - (i * 7 % 26), 4, 2, '#e9e2d0', 0, i);
  ctx.save(); ctx.translate(40, -40); ctx.rotate(.1); sRR(-50, -18, 100, 36, 16, '#b0602e', { inner: () => { for (let i = 0; i < 5; i++) line(-40 + i * 20, -16, -30 + i * 20, 16, 4, '#7a3a1a'); } }); ctx.restore();
  sEll(-20, -58, 26, 18, '#fffdf7', { lw: 4 }); sCirc(-20, -58, 10, '#f5b52a', { lw: 3 });
  for (let i = 0; i < 4; i++) ell(90 - i * 16, -18, 12, 5, '#5aa845', 3, i);
});
defProp('che', 'food', 'Chè (sweet dessert)', 100, 210, (o, t) => {
  sPoly([[-42, -160], [42, -160], [34, 0], [-34, 0]], 'rgba(220,240,250,.5)', { hi: '#fff', inner: () => { const bands = ['#7a4a8a', '#f2e6c0', '#7cc05c', '#f08a3c', '#fff6e0']; bands.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(-60, -i * 30 - 30, 120, 30); }); for (let i = 0; i < 6; i++) rr(-24 + (i % 3) * 18, -150 + (i > 2 ? 14 : 0), 16, 14, 4, 'rgba(255,255,255,.7)', 2); } });
  line(-30, -10, -46, -190, 7, '#e9e2d0');
}, { gripY: 70 });
defProp('trada', 'food', 'Trà đá (iced tea)', 90, 160, (o, t) => {
  sPoly([[-36, -120], [36, -120], [30, 0], [-30, 0]], 'rgba(220,240,250,.5)', { hi: '#fff', inner: () => { ctx.fillStyle = '#d8a84a'; ctx.fillRect(-50, -100, 100, 110); for (const [x, y] of [[-10, -84], [12, -62], [-6, -40]]) rr(x - 10, y - 10, 20, 18, 4, 'rgba(255,255,255,.55)', 2); } });
}, { gripY: 55 });
defProp('biahoi', 'food', 'Bia hơi (fresh draught beer)', 110, 190, (o, t) => {
  sPoly([[-42, -150], [42, -150], [36, 0], [-36, 0]], 'rgba(230,240,240,.45)', { hi: '#fff', inner: () => { ctx.fillStyle = '#f0b53a'; ctx.fillRect(-60, -130, 120, 140); ctx.fillStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(-20 + (i * 13 % 40), -20 - ((t * 60 + i * 23) % 100), 3, 0, TAU); ctx.fill(); } } });
  sSmooth([[-46, -146], [-30, -176], [0, -170], [30, -180], [46, -146]], '#fffaf0', { lw: 5 });
}, { gripY: 70 });
defProp('ruou_ngo', 'food', 'Rượu ngô (corn wine) jug & cups', 200, 170, (o, t) => {
  sSmooth([[-50, -10], [-62, -70], [-30, -112], [-22, -140], [22, -140], [30, -112], [62, -70], [50, -10]], '#c97b45', { inner: () => line(-60, -80, 60, -80, 4, '#8a4a22') });
  sRR(-28, -160, 56, 22, 8, '#8a5a32', { lw: 5 });
  for (const x of [80, 120]) { sPoly([[x - 16, -40], [x + 16, -40], [x + 11, 0], [x - 11, 0]], '#f4f1ea', { lw: 4 }); ell(x, -38, 13, 3, '#f2e3b0', 0); }
});
// fruits
defProp('mango', 'food', 'Xoài (mango)', 130, 100, (o) => { sSmooth([[-60, -40], [-30, -80], [30, -86], [62, -46], [40, -8], [-30, -4]], '#f6b62e', { shadow: '#e2802a' }); ell(30, -84, 14, 6, '#5aa845', 4, -.5); });
defProp('dragonfruit', 'food', 'Thanh long (dragon fruit)', 140, 150, (o) => {
  sEll(0, -60, 56, 62, '#e8337a'); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .45; ctx.save(); ctx.translate(Math.cos(a) * 50, -60 + Math.sin(a) * 56); ctx.rotate(a + Math.PI / 2); sPoly([[-10, 0], [10, 0], [0, -28]], '#7cc05c', { lw: 4 }); ctx.restore(); }
  if (o.half) { sEll(80, -40, 44, 44, '#fbf8f2', { lw: 5, inner: () => { for (let i = 0; i < 40; i++) circ(80 + Math.cos(i * 2.4) * (i % 7) * 5, -40 + Math.sin(i * 2.4) * (i % 7) * 5, 2, C.ink, 0); } }); }
});
defProp('coconut', 'food', 'Dừa (coconut, with straw)', 140, 190, (o) => { sCirc(0, -64, 64, '#7cb53c', { shadow: '#4f8f2a' }); sEll(0, -118, 28, 10, '#f4efe0', { lw: 4 }); line(4, -120, 26, -186, 9, '#3a9ad8'); line(26, -186, 46, -186, 9, '#3a9ad8'); }, { gripY: 64 });
defProp('durian', 'food', 'Sầu riêng (durian)', 160, 160, (o) => { sEll(0, -66, 70, 64, '#a8b84a', { inner: () => { for (let i = 0; i < 30; i++) { const x = -60 + (i * 41 % 120), y = -120 + (i * 29 % 110); poly([[x - 7, y + 6], [x + 7, y + 6], [x, y - 8]], '#7f8f2a', 2.5); } } }); line(0, -128, 4, -152, 9, '#6b5a2a'); });
defProp('rambutan', 'food', 'Chôm chôm (rambutan)', 170, 120, (o) => { for (const [x, y] of [[-50, -36], [0, -40], [50, -36], [-25, -76], [25, -78]]) { sCirc(x, y, 30, '#e0303a'); for (let k = 0; k < 14; k++) { const a = k * TAU / 14; pline([[x + Math.cos(a) * 28, y + Math.sin(a) * 28], [x + Math.cos(a + .3) * 40, y + Math.sin(a + .3) * 40]], 3, '#3fa04a'); } } });
defProp('banana', 'food', 'Chuối (banana bunch)', 170, 130, (o) => { for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(-10, -96); ctx.rotate(-.75 + i * .32); shaded(() => { ctx.moveTo(-8, 0); ctx.quadraticCurveTo(-26, 60, 10, 96); ctx.quadraticCurveTo(30, 100, 26, 88); ctx.quadraticCurveTo(0, 60, 10, 0); ctx.closePath(); }, '#f8d548', { lw: 5 }); ctx.restore(); } sRR(-24, -112, 30, 26, 6, '#7a8a2a', { lw: 5 }); });
defProp('lychee', 'food', 'Vải (lychee)', 140, 110, (o) => { for (const [x, y] of [[-34, -30], [8, -34], [44, -28], [-12, -66], [26, -68]]) { sCirc(x, y, 24, '#d84a4a', { inner: () => { for (let k = 0; k < 8; k++) circ(x + Math.cos(k) * 12, y + Math.sin(k * 2) * 12, 2.5, '#a8302a', 0); } }); } pline([[-12, -90], [0, -120], [20, -130]], 5, '#6b5a2a'); });
defProp('chili', 'food', 'Ớt (chili)', 120, 70, (o) => { for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(-36 + i * 36, -12); ctx.rotate(-.9 + i * .1); shaded(() => { ctx.moveTo(0, -6); ctx.bezierCurveTo(30, -18, 60, -6, 76, 22); ctx.bezierCurveTo(50, 8, 24, 14, 0, 12); ctx.closePath(); }, '#e0302a', { lw: 4 }); line(-2, 3, -16, -6, 6, '#3fa04a'); ctx.restore(); } });
defProp('bowl_rice', 'food', 'Bát cơm (bowl of rice)', 150, 120, (o) => { bowl(60, 55, '#f7f4ec', '#3a6fb0'); sSmooth([[-56, -55], [-30, -90], [30, -92], [56, -55]], '#fbf8ef'); line(-60, -110, 60, -60, 7, '#c58a4a'); line(-50, -116, 66, -68, 7, '#b07a3c'); });
defProp('banhbao', 'food', 'Bánh bao (steamed bun)', 120, 110, (o, t) => { sSmooth([[-54, -6], [-56, -40], [-30, -74], [0, -82], [30, -74], [56, -40], [54, -6]], '#fbf7ee', { inner: () => { for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 10, -80); ctx.quadraticCurveTo(i * 14, -60, i * 22, -50); ctx.lineWidth = 3; ctx.strokeStyle = '#e6dcc6'; ctx.stroke(); } } }); if (o.steam !== false) steamFx(0, -90, t, 2, .6); });
defProp('nuocmia', 'food', 'Nước mía (sugarcane juice)', 90, 180, (o) => { sPoly([[-38, -130], [38, -130], [32, 0], [-32, 0]], 'rgba(220,240,250,.5)', { hi: '#fff', inner: () => { ctx.fillStyle = '#d6dc8a'; ctx.fillRect(-50, -110, 100, 120); } }); line(8, -130, 22, -180, 7, '#7cc05c'); }, { gripY: 60 });
