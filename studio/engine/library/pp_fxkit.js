/* Poison Pill v6.5: FX KIT, the craft tools for custom scenes (window.PPKIT).
   Every helper is a pure function of its inputs and the beat time, so frames render in any order on any worker.
   In a custom scene they arrive in the API object (all guarded: queued layers flush first, so draw order stays as written):

   PERSPECTIVE AND 3D
     quad(src, [[x,y]×4 TL,TR,BR,BL], {a, n})        any image, clip frame, label or snapshot mapped onto 4 corners (true perspective)
     card(src, {x,y,w,h, rx,ry,rz, z, fov, a, back, shade})   a flat thing turned in 3D (radians); back: colour of the reverse side
     label(text, {size, font, col, bg, pad, weight, ls})      text rendered to a canvas, to put ON a surface with quad()/card()
     extrude(src, x, y, h, {depth, ang, col, a, shadow})      a cut-out with real thickness (a photo becomes an object)
   PHYSICS (closed form, deterministic)
     drop(t0, from, to, {g, bounce})                          a value falling under gravity and bouncing to rest (stacking)
     shatter(src, {x,y,w,h, t0, cols, rows, origin:[x,y], force, g, floor, spin, seed, a})   breaks into shards that fly and land
   PAPER, FIRE, INK (transitions on a snapshot)
     grab()                                                   the frame drawn so far, as a canvas (draw scene A, grab, draw scene B, then:)
     tear(snapA, k, {seed, ang, gap, curl, edge})             scene A torn in two across the frame, halves pull apart and curl
     burn(snapA, k, {seed, cx, cy, scale, glow})              scene A burns away from a point with a glowing, charred edge
     blob(cx, cy, r, {seed, wob, n})                          an organic ink/stain path (fill it, or ctx.clip() to reveal through it)
   FRAMING AND SOLIDS
     cover(src, {z, ox, oy, a, filter})                     fill the frame edge to edge (never pillar-boxed)
     block(src, x, y, w, h, {depth, skew, side})             a solid block with the photo on its face, a lit top and a dark side
   OPTICS
     zoomBlur(snap, amt, {cx, cy, n})                         radial speed blur into a point (whip, impact, arrival)
     chroma(snap, px, {ang})                                  RGB split (a hit, a glitch, a lie exposed)
*/
(function () {
  const C = {};
  const cv = (key, w, h) => { let c = C[key]; if (!c) { c = C[key] = document.createElement('canvas'); } if (c.width !== w || c.height !== h) { c.width = w; c.height = h; } return c; };
  const R = seed => { let s = (Math.abs(seed | 0) * 2654435761 + 1) >>> 0; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  // value noise field cached per (seed, w, h)
  const NF = {};
  function field(seed, w, h, scale) {
    const key = seed + ':' + w + ':' + h + ':' + scale; if (NF[key]) return NF[key];
    const r = R(seed); const gw = Math.ceil(w / scale) + 2, gh = Math.ceil(h / scale) + 2; const g = new Float32Array(gw * gh).map(() => r());
    const g2s = scale / 3, gw2 = Math.ceil(w / g2s) + 2, gh2 = Math.ceil(h / g2s) + 2; const g2 = new Float32Array(gw2 * gh2).map(() => r());
    const sm = x => x * x * (3 - 2 * x); const F = new Float32Array(w * h);
    const sample = (G, GW, x, y) => { const xi = Math.floor(x), yi = Math.floor(y), fx = sm(x - xi), fy = sm(y - yi); const a = G[yi * GW + xi], b = G[yi * GW + xi + 1], c = G[(yi + 1) * GW + xi], d = G[(yi + 1) * GW + xi + 1]; return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy; };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) F[y * w + x] = .7 * sample(g, gw, x / scale, y / scale) + .3 * sample(g2, gw2, x / g2s, y / g2s);
    return NF[key] = F;
  }
  function inv3(m) { const [a, b, c, d, e, f, g, h, i] = m; const A = e * i - f * h, B = -(d * i - f * g), Cc = d * h - e * g, D = -(b * i - c * h), E = a * i - c * g, F = -(a * h - b * g), G = b * f - c * e, H = -(a * f - c * d), I = a * e - b * d; const det = a * A + b * B + c * Cc; if (Math.abs(det) < 1e-9) return null; return [A / det, D / det, G / det, B / det, E / det, H / det, Cc / det, F / det, I / det]; }
  function homog(q) { // unit square → quad
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q; const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
    let g = 0, h = 0; const den = dx1 * dy2 - dx2 * dy1; if (Math.abs(dx3) > 1e-9 || Math.abs(dy3) > 1e-9) { g = (dx3 * dy2 - dx2 * dy3) / den; h = (dx1 * dy3 - dx3 * dy1) / den; }
    const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
    return (u, v) => { const w = g * u + h * v + 1; return [(a * u + b * v + x0) / w, (d * u + e * v + y0) / w]; };
  }

  window.PPKIT = function (A) {
    const { ctx, W, H, u, t } = A; const dur = A.dur || 4;
    function tri(src, s, d) {
      const M = inv3([s[0][0], s[0][1], 1, s[1][0], s[1][1], 1, s[2][0], s[2][1], 1]); if (!M) return;
      const mul = v => [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]];
      const X = mul([d[0][0], d[1][0], d[2][0]]), Y = mul([d[0][1], d[1][1], d[2][1]]);
      const cx = (d[0][0] + d[1][0] + d[2][0]) / 3, cy = (d[0][1] + d[1][1] + d[2][1]) / 3; ctx.save(); ctx.beginPath();
      d.forEach(([x, y], i) => { const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1, ex = x + dx / l * .9, ey = y + dy / l * .9; i ? ctx.lineTo(ex, ey) : ctx.moveTo(ex, ey); }); ctx.closePath(); ctx.clip();
      ctx.transform(X[0], Y[0], X[1], Y[1], X[2], Y[2]);
      const xs = s.map(p => p[0]), ys = s.map(p => p[1]); const sx = Math.max(0, Math.floor(Math.min(...xs)) - 1), sy = Math.max(0, Math.floor(Math.min(...ys)) - 1);
      const sw = Math.min(src.width, Math.ceil(Math.max(...xs)) + 1) - sx, sh = Math.min(src.height, Math.ceil(Math.max(...ys)) + 1) - sy;
      if (sw > 0 && sh > 0) ctx.drawImage(src, sx, sy, sw, sh, sx, sy, sw, sh); ctx.restore();
    }
    function quad(src, q, o = {}) {
      if (!src || !src.width) return; const n = o.n || 10, P = homog(q), sw = src.width, sh = src.height; ctx.save(); ctx.globalAlpha *= o.a ?? 1;
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
        const u0 = i / n, u1 = (i + 1) / n, v0 = j / n, v1 = (j + 1) / n; const a = P(u0, v0), b = P(u1, v0), c = P(u1, v1), d = P(u0, v1);
        const sa = [u0 * sw, v0 * sh], sb = [u1 * sw, v0 * sh], sc = [u1 * sw, v1 * sh], sd = [u0 * sw, v1 * sh];
        tri(src, [sa, sb, sc], [a, b, c]); tri(src, [sa, sc, sd], [a, c, d]);
      }
      ctx.restore();
    }
    function project(o) {
      const { x = W / 2, y = H / 2, w = W * .4, h = H * .4, rx = 0, ry = 0, rz = 0, z = 0, fov = 1.1 } = o; const f = (H / 2) / Math.tan(fov / 2);
      return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([px, py]) => {
        let X = px, Y = py, Z = 0; let c = Math.cos(rz), s = Math.sin(rz); [X, Y] = [X * c - Y * s, X * s + Y * c];
        c = Math.cos(rx); s = Math.sin(rx); [Y, Z] = [Y * c - Z * s, Y * s + Z * c]; c = Math.cos(ry); s = Math.sin(ry); [X, Z] = [X * c + Z * s, -X * s + Z * c];
        Z += z; const k = f / (f + Z); return [x + X * k, y + Y * k];
      });
    }
    function card(src, o = {}) {
      const q = project(o); const cross = (q[1][0] - q[0][0]) * (q[3][1] - q[0][1]) - (q[1][1] - q[0][1]) * (q[3][0] - q[0][0]);
      if (cross < 0) { ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = o.back || '#e9e2d2'; ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.restore(); return q; }
      if (o.shadow) { ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * .45; ctx.filter = `blur(${18 * u}px)`; ctx.fillStyle = '#000'; ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(p[0] + 14 * u, p[1] + 24 * u) : ctx.moveTo(p[0] + 14 * u, p[1] + 24 * u)); ctx.closePath(); ctx.fill(); ctx.restore(); }
      quad(src, q, o);
      if (o.shade) { const k = Math.min(.6, Math.abs(Math.sin(o.ry || 0)) * .5 + Math.abs(Math.sin(o.rx || 0)) * .3); ctx.save(); ctx.globalAlpha *= k * (o.a ?? 1); ctx.fillStyle = '#000'; ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.restore(); }
      return q;
    }
    function label(text, o = {}) {
      const size = o.size || 120, pad = o.pad ?? size * .3, font = (typeof FONT !== 'undefined' && FONT[o.font || 'cond']) || o.font || 'sans-serif', wt = o.weight || (typeof FW !== 'undefined' && FW[o.font || 'cond']) || 700;
      const key = 'lab:' + text + size + font + (o.col || '') + (o.bg || ''); const m = cv('meas', 4, 4).getContext('2d'); m.font = `${wt} ${size}px ${font}`; if (o.ls) m.letterSpacing = o.ls + 'px';
      const w = Math.ceil(m.measureText(text).width + pad * 2), h = Math.ceil(size * 1.3 + pad * 2); const c = cv(key, w, h), g = c.getContext('2d');
      g.clearRect(0, 0, w, h); if (o.bg) { g.fillStyle = o.bg; g.fillRect(0, 0, w, h); } g.font = `${wt} ${size}px ${font}`; if (o.ls) g.letterSpacing = o.ls + 'px'; g.textBaseline = 'middle'; g.fillStyle = o.col || '#f3ecdc'; g.fillText(text, pad, h / 2 + size * .04); return c;
    }
    function extrude(src, x, y, h, o = {}) {
      if (!src) return; const w = h * src.width / src.height, depth = (o.depth ?? 14) * u, ang = o.ang ?? 2.2, n = Math.max(2, Math.round(depth / (1.5 * u)));
      const sil = cv('sil:' + (src.__id || (src.__id = Math.random().toString(36).slice(2))), src.width, src.height), g = sil.getContext('2d');
      if (!sil.__done) { g.clearRect(0, 0, sil.width, sil.height); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = o.col || '#2a241c'; g.fillRect(0, 0, sil.width, sil.height); g.globalCompositeOperation = 'source-over'; sil.__done = 1; }
      ctx.save(); ctx.globalAlpha *= o.a ?? 1;
      if (o.shadow !== false) { ctx.save(); ctx.globalAlpha *= .4; ctx.filter = `blur(${16 * u}px)`; ctx.drawImage(sil, x - w / 2 + Math.cos(ang) * depth * 2, y - h / 2 + Math.sin(ang) * depth * 2 + 10 * u, w, h); ctx.restore(); }
      for (let i = n; i >= 1; i--) { const k = i / n; ctx.drawImage(sil, x - w / 2 + Math.cos(ang) * depth * k, y - h / 2 + Math.sin(ang) * depth * k, w, h); }
      ctx.drawImage(src, x - w / 2, y - h / 2, w, h); ctx.restore();
    }
    function drop(t0, from, to, o = {}) {
      const g = (o.g ?? 5200) * u, b = o.bounce ?? .28, tau = t - t0; if (tau <= 0) return from; const dist = to - from, sgn = Math.sign(dist) || 1, D = Math.abs(dist);
      const tl = Math.sqrt(2 * D / g); if (tau < tl) return from + sgn * .5 * g * tau * tau;
      let v = g * tl * b, tt = tau - tl; for (let k = 0; k < 4 && v > 30 * u; k++) { const air = 2 * v / g; if (tt < air) return to - sgn * (v * tt - .5 * g * tt * tt); tt -= air; v *= b; } return to;
    }
    const shardCache = {};
    function shards(cols, rows, seed) {
      const key = cols + 'x' + rows + ':' + seed; if (shardCache[key]) return shardCache[key]; const r = R(seed), P = [];
      for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) { const edge = i === 0 || j === 0 || i === cols || j === rows; P.push([(i + (edge ? 0 : (r() - .5) * .7)) / cols, (j + (edge ? 0 : (r() - .5) * .7)) / rows]); }
      const T = []; const id = (i, j) => j * (cols + 1) + i; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const a = P[id(i, j)], b = P[id(i + 1, j)], c = P[id(i + 1, j + 1)], d = P[id(i, j + 1)]; if (r() < .5) { T.push([a, b, c], [a, c, d]); } else { T.push([a, b, d], [b, c, d]); } }
      return shardCache[key] = T.map(tr => ({ tr, r1: r(), r2: r(), r3: r() }));
    }
    function shatter(src, o = {}) {
      if (!src) return; const { x = W / 2, y = H / 2, w = W * .5, h = W * .5 * src.height / src.width, t0 = 0, cols = 7, rows = 6, seed = 7 } = o;
      const g = (o.g ?? 3200) * u, force = (o.force ?? 900) * u, floor = o.floor ?? H * 1.3, spin = o.spin ?? 6, org = o.origin || [x, y + h * .2], tau = Math.max(0, t - t0);
      ctx.save(); ctx.globalAlpha *= o.a ?? 1;
      for (const s of shards(cols, rows, seed)) {
        const pts = s.tr.map(([a, b]) => [x - w / 2 + a * w, y - h / 2 + b * h]); const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
        let dx = 0, dy = 0, rot = 0;
        if (tau > 0) { const vx0 = cx - org[0], vy0 = cy - org[1], l = Math.hypot(vx0, vy0) || 1, f = force * (.55 + s.r1 * .9) * (1.2 - Math.min(1, l / (w * .8)) * .6);
          const vx = vx0 / l * f, vy = vy0 / l * f - force * .35 * s.r2; const tl = (() => { const a = .5 * g, b = vy, c = cy - floor; const disc = b * b - 4 * a * c; return disc > 0 ? (-b + Math.sqrt(disc)) / (2 * a) : 99; })();
          const ta = Math.min(tau, tl); dx = vx * ta; dy = vy * ta + .5 * g * ta * ta; rot = (s.r3 - .5) * spin * ta;
          if (tau > tl) { const tt = tau - tl; dx += vx * .25 * (1 - Math.exp(-4 * tt)) / 4; } }
        ctx.save(); ctx.translate(cx + dx, cy + dy); ctx.rotate(rot); ctx.translate(-cx, -cy);
        const S = pts.map(([px, py]) => [(px - (x - w / 2)) / w * src.width, (py - (y - h / 2)) / h * src.height]); tri(src, S, pts); ctx.restore();
      }
      ctx.restore();
    }
    function grab(key = 'snap') { const c = cv(key, ctx.canvas.width, ctx.canvas.height), g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height); g.drawImage(ctx.canvas, 0, 0); return c; }
    function tearPath(seed, ang, n) { const r = R(seed); const pts = []; let off = 0; for (let i = 0; i <= n; i++) { off += (r() - .5) * 22; off *= .82; pts.push([i / n, off + (r() - .5) * 9]); } return pts; }
    function tear(snap, k, o = {}) {
      if (!snap) return; const seed = o.seed ?? 3, ang = o.ang ?? .12, gap = (o.gap ?? .55) * W, curl = o.curl ?? .16, n = 90; const Wc = ctx.canvas.width, Hc = ctx.canvas.height, sc = Wc / W;
      const L = Math.hypot(W, H) * 1.2, cx = W / 2, cy = H / 2, ca = Math.cos(ang), sa = Math.sin(ang); // the tear runs roughly vertical, tilted by ang
      const line = tearPath(seed, ang, n).map(([s, off]) => { const along = (s - .5) * L; return [cx + -sa * along + ca * off * u, cy + ca * along + sa * off * u]; });
      const ease = k * k * (3 - 2 * k), dist = gap * ease;
      [[-1, 'L'], [1, 'R']].forEach(([side]) => {
        ctx.save(); const tx = ca * dist * .5 * side, ty = sa * dist * .5 * side + 40 * u * ease, rot = side * curl * ease; ctx.translate(cx + tx, cy + ty); ctx.rotate(rot); ctx.translate(-cx, -cy);
        ctx.beginPath(); line.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); const far = side * L; ctx.lineTo(line[n][0] + ca * far, line[n][1] + sa * far); ctx.lineTo(line[0][0] + ca * far, line[0][1] + sa * far); ctx.closePath();
        ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40 * u * ease; ctx.shadowOffsetY = 18 * u * ease; ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
        ctx.save(); ctx.clip(); ctx.drawImage(snap, 0, 0, Wc, Hc, 0, 0, W, H); ctx.restore();
        if (o.edge !== false && ease > .002) { const r = R(seed + (side > 0 ? 11 : 0)); ctx.save(); ctx.strokeStyle = o.edgeCol || '#efe8da'; ctx.lineCap = 'round';
          for (let i = 0; i < n; i++) { const a = line[i], b = line[i + 1]; ctx.lineWidth = (3 + r() * 6) * u; ctx.beginPath(); ctx.moveTo(a[0] + ca * side * r() * 4 * u, a[1]); ctx.lineTo(b[0] + ca * side * r() * 4 * u, b[1]); ctx.stroke(); if (r() < .35) { ctx.lineWidth = 1 * u; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] - ca * side * (4 + r() * 10) * u, a[1] + (r() - .5) * 8 * u); ctx.stroke(); } }
          ctx.restore(); }
        ctx.restore();
      });
    }
    function burn(snap, k, o = {}) {
      if (!snap) return; if (k <= 0) { ctx.drawImage(snap, 0, 0, snap.width, snap.height, 0, 0, W, H); return; } if (k >= 1) return;
      const lw = 320, lh = Math.round(320 * H / W), F = field(o.seed ?? 5, lw, lh, o.scale ?? 18), cx = (o.cx ?? .5) * lw, cy = (o.cy ?? .55) * lh, md = Math.hypot(lw, lh) * .75;
      const mk = cv('burnm', lw, lh), gl = cv('burng', lw, lh), mg = mk.getContext('2d'), gg = gl.getContext('2d'); const MI = mg.createImageData(lw, lh), GI = gg.createImageData(lw, lh); const th = k * 1.25 - .1;
      for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) { const i = y * lw + x, v = Math.hypot(x - cx, y - cy) / md * .7 + F[i] * .45, e = v - th, j = i * 4;
        MI.data[j + 3] = e <= 0 ? 0 : 255; const char = e > 0 && e < .06 ? 1 - e / .06 : 0; MI.data[j] = MI.data[j + 1] = MI.data[j + 2] = 0; if (char) { MI.data[j + 3] = 255; }
        const glow = e > -.012 && e < .025 ? 1 - Math.abs(e - .006) / .02 : 0; if (glow > 0) { GI.data[j] = 255; GI.data[j + 1] = 120 + 90 * glow; GI.data[j + 2] = 30; GI.data[j + 3] = Math.min(255, 255 * glow * (o.glow ?? 1)); }
        if (char) GI.data[j + 3] = Math.max(GI.data[j + 3], 0); MI.data[j] = Math.round(char * 255); }
      mg.putImageData(MI, 0, 0); gg.putImageData(GI, 0, 0);
      const T = cv('burnt', snap.width, snap.height), tg = T.getContext('2d'); tg.globalCompositeOperation = 'source-over'; tg.clearRect(0, 0, T.width, T.height); tg.drawImage(snap, 0, 0);
      // char: darken near the edge (red channel of the mask holds the char amount)
      const ch = cv('burnc', lw, lh), cg = ch.getContext('2d'); const CI = cg.createImageData(lw, lh); for (let i = 0; i < lw * lh; i++) { CI.data[i * 4 + 3] = MI.data[i * 4] * .85; } cg.putImageData(CI, 0, 0);
      tg.imageSmoothingEnabled = true; tg.drawImage(ch, 0, 0, T.width, T.height); tg.globalCompositeOperation = 'destination-in'; tg.drawImage(mk, 0, 0, T.width, T.height); tg.globalCompositeOperation = 'source-over';
      ctx.drawImage(T, 0, 0, T.width, T.height, 0, 0, W, H); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${2 * u}px)`; ctx.drawImage(gl, 0, 0, W, H); ctx.filter = `blur(${10 * u}px)`; ctx.globalAlpha = .7; ctx.drawImage(gl, 0, 0, W, H); ctx.restore();
    }
    function blob(cx, cy, r, o = {}) { const n = o.n || 72, rr = R(o.seed ?? 9), ph = Array.from({ length: 5 }, () => rr() * 6.28), wob = o.wob ?? .22; ctx.beginPath();
      for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2; let m = 1; for (let k = 0; k < 5; k++) m += wob / (k + 1) * Math.sin(a * (k + 2) + ph[k] + (o.flow ?? 0) * t * (k + 1) * .3); const x = cx + Math.cos(a) * r * m, y = cy + Math.sin(a) * r * m; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.closePath(); }
    function zoomBlur(snap, amt, o = {}) { if (!snap) return; const n = o.n || 10, cx = o.cx ?? W / 2, cy = o.cy ?? H / 2; ctx.save(); ctx.drawImage(snap, 0, 0, snap.width, snap.height, 0, 0, W, H);
      for (let i = 1; i <= n; i++) { const s = 1 + amt * i / n; ctx.globalAlpha = .5 / (i * .7 + .3) * .55; ctx.setTransform(ctx.getTransform()); ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); ctx.drawImage(snap, 0, 0, snap.width, snap.height, 0, 0, W, H); ctx.restore(); } ctx.restore(); }
    function chroma(snap, px, o = {}) { if (!snap) return; const ang = o.ang ?? 0, dx = Math.cos(ang) * px * u, dy = Math.sin(ang) * px * u; const out = cv('chr', snap.width, snap.height), g = out.getContext('2d');
      g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, out.width, out.height); const sc = snap.width / W;
      [['#f00', -dx, -dy], ['#0f0', 0, 0], ['#00f', dx, dy]].forEach(([c, ox, oy]) => { const tmp = cv('chr' + c, snap.width, snap.height), tg = tmp.getContext('2d'); tg.globalCompositeOperation = 'source-over'; tg.clearRect(0, 0, tmp.width, tmp.height); tg.drawImage(snap, 0, 0); tg.globalCompositeOperation = 'multiply'; tg.fillStyle = c; tg.fillRect(0, 0, tmp.width, tmp.height); g.globalCompositeOperation = 'lighter'; g.drawImage(tmp, ox * sc, oy * sc); });
      ctx.drawImage(out, 0, 0, out.width, out.height, 0, 0, W, H); }
    function cover(src, o = {}) { // fill the frame edge to edge (no pillar-box), optional push z, drift ox/oy (fractions), filter
      if (!src || !src.width) return; const z = o.z ?? 1, s = Math.max(W / src.width, H / src.height) * z; ctx.save(); ctx.globalAlpha *= o.a ?? 1; if (o.filter) ctx.filter = o.filter;
      ctx.drawImage(src, W / 2 - src.width * s / 2 + (o.ox || 0) * W, H / 2 - src.height * s / 2 + (o.oy || 0) * H, src.width * s, src.height * s); ctx.restore(); }
    function block(src, x, y, w, h, o = {}) { // a solid block: the photo on its face, a lit top face in perspective, a dark side
      const d = (o.depth ?? .35) * h, sx = (o.skew ?? .35) * d; ctx.save(); ctx.globalAlpha *= o.a ?? 1;
      ctx.fillStyle = o.side || '#1c1813'; ctx.beginPath(); ctx.moveTo(x + w / 2, y - h / 2); ctx.lineTo(x + w / 2 + sx, y - h / 2 - d); ctx.lineTo(x + w / 2 + sx, y + h / 2 - d); ctx.lineTo(x + w / 2, y + h / 2); ctx.fill();
      if (src) quad(src, [[x - w / 2 + sx, y - h / 2 - d], [x + w / 2 + sx, y - h / 2 - d], [x + w / 2, y - h / 2], [x - w / 2, y - h / 2]], { a: .55, n: 4 });
      ctx.fillStyle = 'rgba(255,240,210,.12)'; ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x - w / 2 + sx, y - h / 2 - d); ctx.lineTo(x + w / 2 + sx, y - h / 2 - d); ctx.lineTo(x + w / 2, y - h / 2); ctx.fill();
      if (src) ctx.drawImage(src, x - w / 2, y - h / 2, w, h); ctx.strokeStyle = 'rgba(255,235,200,.25)'; ctx.lineWidth = 1.5 * u; ctx.strokeRect(x - w / 2, y - h / 2, w, h); ctx.restore(); }
    function seam(inDir, outDir, o = {}) { // the motion doctrine's seams: arrive already moving (power4.out), leave accelerating (power4.in);
      // call once at the top of a scene (inside ctx.save/restore); dirs: left right up down in out none
      const D = (o.dist ?? .14) * W, ti = o.tin ?? .45, to = o.tout ?? .3; let dx = 0, dy = 0, s = 1, bl = 0; const pin = clamp(t / ti), pout = clamp((t - (dur - to)) / to);
      const ei = 1 - Math.pow(1 - pin, 4), eo = Math.pow(pout, 4); const v = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
      if (v[inDir]) { dx -= v[inDir][0] * D * (1 - ei); dy -= v[inDir][1] * D * (1 - ei); bl += (1 - ei) * 8; } if (inDir === 'in') { s *= .8 + .2 * ei; bl += (1 - ei) * 10; } if (inDir === 'out') { s *= 1.22 - .22 * ei; bl += (1 - ei) * 10; }
      if (v[outDir]) { dx += v[outDir][0] * D * eo; dy += v[outDir][1] * D * eo; bl += eo * 8; } if (outDir === 'in') { s *= 1 + .22 * eo; bl += eo * 10; } if (outDir === 'out') { s *= 1 - .18 * eo; bl += eo * 10; }
      ctx.translate(W / 2 + dx * u / u, H / 2 + dy); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2); if (bl > .4) ctx.filter = `blur(${(bl * u).toFixed(1)}px)`; return { dx, dy, s, bl }; }
    function paperDesk(o = {}) { // a dark investigator's desk lit by one lamp: leather/wood gradient, lamp pool, vignette, fine grain (procedural, no image)
      const lx = (o.lx ?? .5) * W, ly = (o.ly ?? .45) * H; ctx.fillStyle = o.col || '#1a140e'; ctx.fillRect(-W, -H, W * 3, H * 3);
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, W * .75); g.addColorStop(0, 'rgba(255,214,150,.13)'); g.addColorStop(.45, 'rgba(255,190,120,.05)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3);
      const r = R(o.seed ?? 21); ctx.save(); ctx.globalAlpha = .05; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.2 * u; for (let i = 0; i < 70; i++) { const y = r() * H * 1.4 - H * .2; ctx.beginPath(); ctx.moveTo(-W * .2, y); ctx.bezierCurveTo(W * .3, y + (r() - .5) * 40 * u, W * .7, y + (r() - .5) * 40 * u, W * 1.2, y + (r() - .5) * 20 * u); ctx.stroke(); } ctx.restore(); }
    function paper(w, h, o = {}) { // a sheet of paper as a canvas (off-white, faint fibres, soft edge shading) to type or draw on
      const key = 'paper:' + w + 'x' + h + (o.tint || ''); if (C[key] && C[key].__ok) return C[key]; const c = cv(key, w, h), g = c.getContext('2d'); g.fillStyle = o.tint || '#e4ddcf'; g.fillRect(0, 0, w, h);
      const r = R(77); g.globalAlpha = .05; for (let i = 0; i < 400; i++) { g.fillStyle = r() < .5 ? '#000' : '#fff'; g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); } g.globalAlpha = 1;
      const e = g.createLinearGradient(0, 0, w, 0); e.addColorStop(0, 'rgba(0,0,0,.06)'); e.addColorStop(.1, 'rgba(0,0,0,0)'); e.addColorStop(.9, 'rgba(0,0,0,0)'); e.addColorStop(1, 'rgba(0,0,0,.08)'); g.fillStyle = e; g.fillRect(0, 0, w, h); c.__ok = 1; return c; }
    function marker(pts, k, o = {}) { // a hand-drawn marker stroke (circle, underline, tick) drawn up to fraction k; pts in px
      if (k <= 0 || pts.length < 2) return; const r = R(o.seed ?? 5); ctx.save(); ctx.strokeStyle = o.col || 'rgba(200,30,30,.85)'; ctx.lineWidth = (o.w ?? 7) * u; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; } let left = L * clamp(k);
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length && left > 0; i++) { const f = Math.min(1, left / seg[i - 1]); ctx.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f); left -= seg[i - 1]; } ctx.stroke(); ctx.restore(); }
    function ellipsePts(cx, cy, rx, ry, seed = 3) { const r = R(seed), n = 40, P = []; const a0 = -2.4 + r() * .3; for (let i = 0; i <= n * 1.12; i++) { const a = a0 + i / n * Math.PI * 2, w = 1 + (r() - .5) * .06; P.push([cx + Math.cos(a) * rx * w * (1 + i / n * .04), cy + Math.sin(a) * ry * w]); } return P; }
    return { seam, paperDesk, paper, marker, ellipsePts, cover, block, quad, card, project, label, extrude, drop, shatter, grab, tear, burn, blob, zoomBlur, chroma };
  };
})();
