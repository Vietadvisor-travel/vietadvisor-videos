/* @effect boarding
   @does: a boarding pass (a reconstruction, labelled as such) flies in turning over in 3D and lands on the desk; its fields type in; on the word its stub tears off and drifts away
   @params: from, to, date, fields, tear, recon, in, out
   @uses: none (typeset)
   @tags: travel, escape, flight, document, reconstruction, tear
   @born: onecoin v2 (Sofia to Athens, 25 October 2017)
*/
({ t, at, p, W, H, u, ctx, params: P, clamp, lerp, seam, paperDesk, card, spring, text, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .45 });
  const bw = 1500, bh = 560, S = window.__bp || (window.__bp = document.createElement('canvas')); S.width = bw; S.height = bh; const g = S.getContext('2d'), F = typeof FONT !== 'undefined' ? FONT : {};
  g.fillStyle = '#f3efe6'; g.beginPath(); g.roundRect(0, 0, bw, bh, 28); g.fill(); g.fillStyle = '#1d2a44'; g.fillRect(0, 0, bw, 96); g.font = `600 40px ${F.cond || 'sans-serif'}`; g.fillStyle = '#f3efe6'; g.textBaseline = 'middle'; g.fillText('BOARDING PASS', 50, 50);
  g.setLineDash([14, 12]); g.strokeStyle = '#b9b2a4'; g.lineWidth = 3; g.beginPath(); g.moveTo(bw * .74, 110); g.lineTo(bw * .74, bh - 20); g.stroke(); g.setLineDash([]);
  const ty = (s, x, y, size, col, cue, font) => { const n = cue ? Math.ceil(s.length * clamp((t - at(cue)) / .5)) : s.length; g.font = `${font || '700'} ${size}px ${F.impact || 'sans-serif'}`; g.fillStyle = col; g.fillText(s.slice(0, Math.max(0, n)), x, y); };
  ty(P.from || 'SOF', 60, 230, 170, '#1d2a44'); g.font = `400 60px sans-serif`; g.fillStyle = '#8b8371'; g.fillText('→', 430, 230); ty(P.to || 'ATH', 520, 230, 170, '#1d2a44');
  String(P.fields || '').split('~').filter(Boolean).forEach((f, i) => { const [lab, val] = f.split('='); g.font = `600 30px ${F.cond || 'sans-serif'}`; g.fillStyle = '#8b8371'; g.fillText(lab, 60 + i * 300, 380); ty(val || '', 60 + i * 300, 440, 56, '#1d2a44', null, '400'); });
  if (P.date) { g.font = `600 30px ${F.cond || 'sans-serif'}`; g.fillStyle = '#8b8371'; g.fillText('DATE', bw * .77, 180); ty(P.date, bw * .77, 240, 50, '#1d2a44', null, '400'); }
  for (let i = 0; i < 30; i++) { g.fillStyle = '#1d2a44'; g.fillRect(bw * .77 + i * 9, 330, (i * 7) % 3 + 2, 140); }
  const k = clamp(spring(.15, { stiff: 80, damp: 16 }), 0, 1.03), w = W * .74, h = w * bh / bw, tk = P.tear ? clamp(p(P.tear, 1.2, 'inOut')) : 0, cx = W * .5, cy = H * .48;
  if (tk <= 0) card(S, { x: cx, y: cy, w, h, ry: (1 - k) * 2.6, rx: (1 - k) * .5 + .12, rz: -.03, z: (1 - k) * 2200 * u, shadow: true, back: '#e3ddd0', n: 12 });
  else { const cut = .74, L = document.createElement('canvas'), Rr = document.createElement('canvas'); L.width = Math.round(bw * cut); L.height = bh; Rr.width = bw - L.width; Rr.height = bh; L.getContext('2d').drawImage(S, 0, 0); Rr.getContext('2d').drawImage(S, -L.width, 0);
    card(L, { x: cx - w / 2 + w * cut / 2, y: cy, w: w * cut, h, rx: .12, rz: -.03, shadow: true, n: 10 }); card(Rr, { x: cx - w / 2 + w * cut + w * (1 - cut) / 2 + tk * W * .25, y: cy + tk * H * .25, w: w * (1 - cut), h, rx: .12 + tk * .5, rz: -.03 + tk * .6, z: tk * 300 * u, shadow: true, n: 8 }); }
  if (P.recon) text(P.recon, W * .5, H * .92, { size: 32 * u, font: 'serif', col: '#a99a82', lw: 0 });
  ctx.restore();
}
