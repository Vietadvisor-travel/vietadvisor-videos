/* SHEET helpers — used by export tools to lay out reference sheets */
'use strict';
function propGrid(names, cols, cell, t = 1, labels = true) {
  names.forEach((n, i) => { const p = PROP[n]; const cx = (i % cols) * cell + cell / 2, cy = Math.floor(i / cols) * cell + cell * .78;
    const s = Math.min(cell * .82 / p.w, cell * .66 / p.h); drawProp(n, cx, cy - (p.anchor === 'top' ? 0 : 0), s, {}, t);
    if (labels) T(p.label, cx, cy + cell * .12, { size: Math.max(14, cell * .07), font: 'body', fill: C.ink, lw: 0 }); });
}
// render a place (or any fn) into an offscreen canvas of w×h
function renderOff(w, h, fn) { const c = mkCanvas(w, h), pW = W, pH = H, pc = ctx; W = w; H = h; ctx = c.getContext('2d'); try { fn(); } finally { W = pW; H = pH; ctx = pc; } return c; }
function placeSheet(ids, cols, tw, th, fw, fh, opts = {}) {
  ids.forEach((id, i) => { const c = renderOff(fw, fh, () => { PLACE[id].draw(opts.t || 1, { t: opts.t || 1, time: opts.time, ...(opts.o || {}) }); if (opts.guide) { const gy = PLACE[id].ground(); ctx.setLineDash([20, 12]); line(0, gy, W, gy, 4, '#ff00aa'); ctx.setLineDash([]); } });
    const x = (i % cols) * (tw + 20) + 20, y = Math.floor(i / cols) * (th + 60) + 20; ctx.drawImage(c, x, y, tw, th); rr(x, y, tw, th, 0, null, 3);
    T(PLACE[id].label, x + tw / 2, y + th + 26, { size: 22, font: 'body', fill: C.ink, lw: 0 }); });
}
