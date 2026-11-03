/* =====================================================================
   MAP — stylised map of Vietnam & neighbours (Natural Earth 1:50m).
   Always shows Hoàng Sa & Trường Sa as Vietnamese.
   vnMap({ lon, lat, k, t, vnFill, labels, cities:[ids], route:[[lon,lat],..], routeP, pins:[{lon,lat,label,at}] })
   k = pixels per degree (≈ 46 whole region, 600+ provincial zoom). Returns projector P(lon,lat).
   ===================================================================== */
'use strict';
const CITY = {
  hanoi: ['Hà Nội', 105.85, 21.03], hagiang: ['Hà Giang', 104.98, 22.82], sapa: ['Sa Pa', 103.84, 22.34], halong: ['Hạ Long', 107.08, 20.95],
  ninhbinh: ['Ninh Bình', 105.97, 20.25], phongnha: ['Phong Nha', 106.28, 17.59], hue: ['Huế', 107.59, 16.46], danang: ['Đà Nẵng', 108.2, 16.05],
  hoian: ['Hội An', 108.33, 15.88], nhatrang: ['Nha Trang', 109.19, 12.24], dalat: ['Đà Lạt', 108.44, 11.94], muine: ['Mũi Né', 108.29, 10.93],
  hcmc: ['TP. Hồ Chí Minh', 106.7, 10.78], cantho: ['Cần Thơ', 105.78, 10.03], phuquoc: ['Phú Quốc', 103.98, 10.29], maichau: ['Mai Châu', 105.08, 20.66],
  dongvan: ['Đồng Văn', 105.36, 23.28], meovac: ['Mèo Vạc', 105.41, 23.16], caobang: ['Cao Bằng', 106.26, 22.67], quynhon: ['Quy Nhơn', 109.22, 13.78], condao: ['Côn Đảo', 106.6, 8.69]
};
const ISLANDS = { hoangsa: [[111.6, 16.5], [112.2, 16.8], [112.6, 16.3], [111.9, 16.0], [112.4, 15.9], [112.0, 16.25]], truongsa: [[114.3, 10.4], [113.8, 9.6], [115.0, 9.9], [114.6, 8.9], [113.2, 8.6], [112.0, 8.7], [115.6, 10.7], [114.0, 11.2], [114.9, 8.3]] };
const mercY = lat => -Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI;
function mapProjector(o) { const cy = mercY(o.lat); return (lon, lat) => [(lon - o.lon) * o.k + W / 2, (mercY(lat) - cy) * o.k + H / 2]; }
// smooth camera between two map views (keeps the target steady while zooming)
function mapCamLerp(a, b, p) { const k = Math.exp(lerp(Math.log(a.k), Math.log(b.k), p)); const off = [(b.lon - a.lon) * a.k, (mercY(b.lat) - mercY(a.lat)) * a.k]; const lon = b.lon - off[0] * (1 - p) / k, my = mercY(b.lat) - off[1] * (1 - p) / k; const lat = (Math.atan(Math.exp(-my * Math.PI / 180)) - Math.PI / 4) * 360 / Math.PI; return { lon, lat, k }; }
function vnMap(o) {
  const P = mapProjector(o), t = o.t || 0, u = U(), k = o.k;
  // sea
  ctx.fillStyle = o.sea || '#8fc4d2'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .3; ctx.strokeStyle = '#5f9fb3'; ctx.lineWidth = 4 * u; ctx.lineCap = 'round';
  for (let i = 0; i < 46; i++) { const x = hash(i) * W, y = hash(i + 40) * H, dx = Math.sin(t * 1.5 + i) * 6 * u; ctx.beginPath(); ctx.moveTo(x + dx, y); ctx.quadraticCurveTo(x + 15 * u + dx, y - 10 * u, x + 30 * u + dx, y); ctx.quadraticCurveTo(x + 45 * u + dx, y + 10 * u, x + 60 * u + dx, y); ctx.stroke(); }
  ctx.restore();
  const ring = rg => { ctx.beginPath(); rg.forEach(([lo, la], i) => { const [x, y] = P(lo, la); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); };
  const lcol = { CN: '#e3cf9c', LA: '#d9c88f', TH: '#e8d9ae', KH: '#dccb95', MM: '#e2d3a0' };
  for (const key of Object.keys(GEO)) { if (key === 'VN') continue; for (const rg of GEO[key]) { ring(rg); fs(lcol[key] || '#e6d6a6', 3.5 * u); } }
  const vf = o.vnFill ?? 1;
  for (const rg of GEO.VN) { ring(rg); ctx.fillStyle = '#ead8a8'; ctx.fill(); ctx.save(); ctx.globalAlpha = vf; ctx.fillStyle = o.vnColor || C.red; ctx.fill(); ctx.restore(); ring(rg); fs(null, (5 + (o.pulse || 0) * 6) * u); }
  // islands — always drawn
  for (const grp of ['hoangsa', 'truongsa']) for (const [lo, la] of ISLANDS[grp]) { const [x, y] = P(lo, la); circ(x, y, Math.max(3 * u, k * .06), o.vnColor || C.red, 2.5 * u); }
  const lab = o.labels ?? (1 - inv(110, 220, k));
  if (lab > 0) { ctx.save(); ctx.globalAlpha = lab;
    const L = (s, lo, la, sz = 40) => { const [x, y] = P(lo, la); T(s, x, y, { size: sz * u, fill: C.inkSoft, lw: 0, font: 'body', ls: 6 * u }); };
    L('CHINA', 106.5, 26.3, 46); L('LAOS', 102.8, 19.7); L('THAILAND', 100.6, 15.4); L('CAMBODIA', 104.9, 12.8, 34);
    { const [x, y] = P(112.2, 17.45); T('Hoàng Sa', x, y, { size: 22 * u, fill: C.red, lw: 0, font: 'body' }); }
    { const [x, y] = P(114.6, 7.6); T('Trường Sa', x, y, { size: 22 * u, fill: C.red, lw: 0, font: 'body' }); }
    ctx.restore(); }
  if (o.underlay) o.underlay(P, o);
  // route
  if (o.route && o.route.length > 1) {
    const pts = o.route.map(([lo, la]) => P(lo, la)); const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = (o.routeP ?? 1) * cum[cum.length - 1]; let i = 0; const seg = [pts[0]]; while (i < pts.length - 1 && cum[i + 1] <= L) { i++; seg.push(pts[i]); }
    if (i < pts.length - 1) { const f = (L - cum[i]) / (cum[i + 1] - cum[i]); seg.push([lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]); }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); seg.forEach((q, j) => j ? ctx.lineTo(...q) : ctx.moveTo(...q));
    ctx.lineWidth = 18 * u; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 11 * u; ctx.strokeStyle = o.routeColor || C.brand; ctx.stroke(); ctx.setLineDash([10 * u, 14 * u]); ctx.lineWidth = 3 * u; ctx.strokeStyle = '#fff3d0'; ctx.stroke(); ctx.setLineDash([]);
    o._head = seg[seg.length - 1]; o._dir = seg.length > 1 ? Math.atan2(seg[seg.length - 1][1] - seg[seg.length - 2][1], seg[seg.length - 1][0] - seg[seg.length - 2][0]) : 0;
  }
  // cities
  for (const id of (o.cities || [])) { const c = CITY[id]; if (!c) continue; const [x, y] = P(c[1], c[2]); const a = o.cityAt ? pop(t, o.cityAt[id] ?? 0, .35) : 1; if (a <= 0) continue; sCirc(x, y, 11 * u * a, '#fff', { lw: 5 * u }); T(c[0], x + 18 * u, y, { size: 30 * u, align: 'left', fill: '#fff', lw: 8 * u, scale: a }); }
  for (const pn of (o.pins || [])) { const [x, y] = P(pn.lon, pn.lat); mapPin(x, y, t - (pn.at || 0), pn.label, u * (pn.s || 1), pn.color); }
  return P;
}
// animated drop pin with label. tt = time since drop start
function mapPin(x, y, tt, label, s = 1, col = C.brand) {
  if (tt < 0) return; const dp = clamp(tt / .45), land = tt - .45;
  const yy = lerp(-700 * s, 0, E.in(dp)); const sq = land > 0 ? wob(tt, .45, 8, 30) : 0;
  ctx.save(); ctx.globalAlpha *= .3 * dp; ell(x, y, 30 * s * dp, 9 * s * dp, '#000', 0); ctx.restore();
  if (land > 0 && land < .7) for (let k2 = 0; k2 < 2; k2++) { const p = clamp(land / .7 * 1.3 - k2 * .25); if (p <= 0 || p >= 1) continue; ctx.save(); ctx.globalAlpha *= 1 - p; ctx.beginPath(); ctx.ellipse(x, y, 140 * s * E.out(p), 56 * s * E.out(p), 0, 0, TAU); ctx.lineWidth = 8 * s; ctx.strokeStyle = shade(col, -.15); ctx.stroke(); ctx.restore(); }
  ctx.save(); ctx.translate(x, y + yy); ctx.scale(s * (1 + sq * .25), s * (1 - sq * .25));
  shaded(() => { ctx.moveTo(0, 0); ctx.bezierCurveTo(-18, -40, -52, -70, -52, -110); ctx.arc(0, -110, 52, Math.PI, 0); ctx.bezierCurveTo(52, -70, 18, -40, 0, 0); ctx.closePath(); }, col, { lw: 7 });
  sCirc(0, -110, 21, '#fff', { lw: 6 }); ctx.restore();
  if (label && land > .1) UIbanner(x + 10 * s, y + 74 * s, label, E.back(clamp((land - .1) / .35)) * s, C.yel, C.ink, 54);
}
