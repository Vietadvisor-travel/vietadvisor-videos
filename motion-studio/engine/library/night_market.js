/* Example new PLACE: a night market street (works 16:9 + 9:16, parallax, day/night). */
defPlace('night_market', 'Night market — food stalls & string lights', 'Covered stalls with awnings, string lights, plastic stools, steam from woks. Use time=night.', 160, (t, o) => {
  const u = U(), gy = HB() - 160 * u, s = o.scroll || 0, night = o.time !== 'day'; LW = 5 * u;
  sky({ ...o, t, time: night ? 'night' : o.time }, gy - 420 * u);
  layerRep(1700 * u, .3, s, x0 => { for (let i = 0; i < 6; i++) tubeHouse(x0 + i * 290 * u, gy - 140 * u, 270 * u, (360 + (i * 61 % 140)) * u, ['#8ac0d8', '#e88a6a', '#f2c14e', '#a8d08a'][i % 4], { u, balcony: 1 }); });
  // stalls
  layerRep(1500 * u, .75, s, x0 => { for (let i = 0; i < 3; i++) { const sx = x0 + 120 * u + i * 500 * u, c = ['#e8402a', '#2f6fb0', '#3fa36b'][i];
    sRR(sx, gy - 230 * u, 380 * u, 150 * u, 6 * u, '#7a5232', { lw: 5 * u }); for (let k = 0; k < 6; k++) sPoly([[sx - 20 * u + k * 70 * u, gy - 300 * u], [sx + 50 * u + k * 70 * u, gy - 300 * u], [sx + 50 * u + k * 70 * u, gy - 250 * u], [sx - 20 * u + k * 70 * u, gy - 250 * u]], k % 2 ? '#fff6e0' : c, { lw: 4 * u, hi: null });
    drawProp(['pho', 'banhxeo', 'banh_cuon'][i], sx + 190 * u, gy - 228 * u, .5 * u, { steam: true }, t); } });
  // string lights
  for (let k = 0; k < 2; k++) { const y0 = gy - 470 * u + k * 60 * u; ctx.beginPath(); for (let x = -40; x <= W + 40; x += 20) ctx.lineTo(x, y0 + Math.sin((x + s * .5) / (180 * u)) * 26 * u); ctx.lineWidth = 3 * u; ctx.strokeStyle = C.ink; ctx.stroke();
    for (let x = -((s * .5) % (90 * u)); x <= W + 40; x += 90 * u) { const y = y0 + Math.sin((x + s * .5) / (180 * u)) * 26 * u + 10 * u; if (night) glow(x, y, 40 * u, ['#ffd36a', '#ff7aa8', '#7ad8ff'][Math.floor(hash(Math.round(x)) * 3)], .55); circ(x, y, 7 * u, night ? '#fff3b0' : '#f2efe6', 3 * u); } }
  rr(-20, gy - 6 * u, W + 40, H - gy + 30, 0, '#6e6a66', LW);
  layerRep(1200 * u, 1, s, x0 => { drawProp('stool', x0 + 200 * u, gy + 60 * u, .45 * u); drawProp('stool', x0 + 280 * u, gy + 64 * u, .45 * u, { color: '#3a7bd5' }); drawProp('table_low', x0 + 640 * u, gy + 70 * u, .55 * u); });
  if (night) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(80,90,170,.4)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
});
