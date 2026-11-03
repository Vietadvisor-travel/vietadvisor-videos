/* FLAT3D — a tiny flat-shaded 3D layer for the 2D engine: real camera angles (worm's-eye, crane, dolly, over-the-shoulder,
   bird's-eye) while everything stays hand-drawn flat animation. Polygons are projected with a pinhole camera, clipped at the
   near plane, sorted back-to-front, lit by a sun direction, fogged by distance. Characters and vehicles are billboards drawn
   with the normal 2D rig, scaled by depth — the "2.5D animated film" look.
   API (inside a moment's render):
     const cam = F3.cam({ pos:[x,y,z], yaw, pitch, fov })   // degrees for yaw/pitch/fov; y up, z forward
     F3.begin(cam, { fog:'#hex', fogNear, fogFar, sun:[x,y,z], amb })
     F3.quad(pts4, color, { emissive, key, after(fn) })     // world-space corners; `after` draws detail in the same depth slot
     F3.box(x0,y0,z0, x1,y1,z1, color, opt) · F3.line(pts, width, color) · F3.billboard([x,y,z], drawFn(sx,sy,scale), key)
     F3.flush()                                               // paints everything back to front
     F3.P([x,y,z]) → [sx, sy, depth] | null                  // project a point (for labels pinned to the world) */
(function () {
  const D2R = Math.PI / 180;
  const hex = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const rgb = a => `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})`;
  const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const F3 = window.F3 = { list: [], C: null, env: null };
  F3.cam = (o) => { const yaw = (o.yaw || 0) * D2R, pitch = (o.pitch || 0) * D2R, fov = (o.fov || 50) * D2R;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    return { pos: o.pos, cy, sy, cp, sp, f: (H / 2) / Math.tan(fov / 2), roll: (o.roll || 0) * D2R }; };
  // world → camera space (x right, y up, z forward)
  function toCam(p, c) { let x = p[0] - c.pos[0], y = p[1] - c.pos[1], z = p[2] - c.pos[2];
    const x1 = c.cy * x - c.sy * z, z1 = c.sy * x + c.cy * z;            // yaw (turn right = +)
    const y2 = c.cp * y - c.sp * z1, z2 = c.sp * y + c.cp * z1;          // pitch (look up = +)
    if (c.roll) { const cr = Math.cos(c.roll), sr = Math.sin(c.roll); return [cr * x1 - sr * y2, sr * x1 + cr * y2, z2]; }
    return [x1, y2, z2]; }
  const NEAR = .15;
  function scr(v, c) { return [W / 2 + c.f * v[0] / v[2], H / 2 - c.f * v[1] / v[2]]; }
  F3.P = (p) => { const v = toCam(p, F3.C); if (v[2] < NEAR) return null; const s = scr(v, F3.C); return [s[0], s[1], v[2]]; };
  function clipNear(vs) { const out = []; for (let i = 0; i < vs.length; i++) { const a = vs[i], b = vs[(i + 1) % vs.length], ia = a[2] >= NEAR, ib = b[2] >= NEAR;
    if (ia) out.push(a); if (ia !== ib) { const t = (NEAR - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]); } } return out; }
  F3.begin = (cam, env = {}) => { F3.C = cam; F3.list = []; F3.env = { fog: hex(env.fog || '#c8b8a8'), fogNear: env.fogNear ?? 20, fogFar: env.fogFar ?? 120, sun: norm(env.sun || [-.5, .8, -.3]), amb: env.amb ?? .62, dif: env.dif ?? .5 }; };
  function norm(v) { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function shade(col, pts, o) { const e = F3.env; let c = hex(col);
    if (!o.emissive) { const a = pts[0], b = pts[1], d = pts[pts.length - 1]; const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      let n = norm([u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]); const cp = F3.C.pos, ctr = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length, s[2] + p[2] / pts.length], [0, 0, 0]);
      if ((cp[0] - ctr[0]) * n[0] + (cp[1] - ctr[1]) * n[1] + (cp[2] - ctr[2]) * n[2] < 0) n = [-n[0], -n[1], -n[2]];   // face the camera
      const k = e.amb + e.dif * Math.max(0, n[0] * e.sun[0] + n[1] * e.sun[1] + n[2] * e.sun[2]); c = c.map(v => Math.min(255, v * k)); }
    return c; }
  function fogged(c, d) { const e = F3.env; const t = Math.max(0, Math.min(1, (d - e.fogNear) / (e.fogFar - e.fogNear))); return rgb(mixc(c, e.fog, t * t * .9)); }
  F3.quad = (pts, col, o = {}) => { const vs = pts.map(p => toCam(p, F3.C)); const cv = clipNear(vs); if (cv.length < 3) return;
    const sp = cv.map(v => scr(v, F3.C)); const dd = Math.max(...vs.map(v => v[2])) * .5 + vs.reduce((s, v) => s + v[2], 0) / vs.length * .5, d = o.key ?? dd;
    const x0 = Math.min(...sp.map(p => p[0])), x1 = Math.max(...sp.map(p => p[0])), y0 = Math.min(...sp.map(p => p[1])), y1 = Math.max(...sp.map(p => p[1]));
    if (x1 < -W * .5 || x0 > W * 1.5 || y1 < -H * .5 || y0 > H * 1.5) return;
    const c = shade(col, pts, o); F3.list.push({ d, sp, fill: fogged(c, o.key ? Math.min(...vs.map(v => v[2])) + 8 : dd), o, pts }); };
  F3.box = (x0, y0, z0, x1, y1, z1, col, o = {}) => { const key = o.key; const f = (a, c) => F3.quad(a, c, { ...o, key });
    f([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], o.top || col); f([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], col);
    f([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], col); f([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], o.side || col); f([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], o.side || col); };
  F3.line = (pts, w, col, o = {}) => { const pv = pts.map(p => toCam(p, F3.C)); const d = o.key ?? Math.min(...pv.map(v => v[2])); F3.list.push({ d, line: pv, w, col, o }); };
  F3.billboard = (p, fn, key) => { const v = toCam(p, F3.C); if (v[2] < NEAR) return; const s = scr(v, F3.C); F3.list.push({ d: key ?? v[2], bb: fn, sx: s[0], sy: s[1], sc: F3.C.f / v[2] / 1000, depth: v[2] }); };
  F3.flush = () => { F3.list.sort((a, b) => b.d - a.d); const e = F3.env;
    for (const it of F3.list) {
      if (it.bb) { ctx.save(); const t = Math.max(0, Math.min(1, (it.depth - e.fogNear) / (e.fogFar - e.fogNear))); it.bb(it.sx, it.sy, it.sc, t); ctx.restore(); continue; }
      if (it.line) { ctx.beginPath(); let started = false; for (let i = 0; i < it.line.length; i++) { const v = it.line[i]; if (v[2] < 1.2) { started = false; continue; } const s = scr(v, F3.C); if (!started) { ctx.moveTo(s[0], s[1]); started = true; } else ctx.lineTo(s[0], s[1]); }
        const dd = Math.max(1.2, it.d); ctx.lineWidth = Math.min(7 * U(), Math.max(1, it.w * F3.C.f / dd)); ctx.strokeStyle = it.col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); continue; }
      ctx.beginPath(); it.sp.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fillStyle = it.fill; ctx.fill();
      if (it.o.edge) { ctx.lineWidth = it.o.edge; ctx.strokeStyle = 'rgba(30,20,30,.35)'; ctx.stroke(); }
      if (it.o.glow) { const cx = it.sp.reduce((s, p) => s + p[0], 0) / it.sp.length, cy = it.sp.reduce((s, p) => s + p[1], 0) / it.sp.length, r = Math.max(10, Math.hypot(it.sp[0][0] - it.sp[2 % it.sp.length][0], it.sp[0][1] - it.sp[2 % it.sp.length][1]) * 1.6);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, it.o.glow); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2); ctx.restore(); }
      if (it.o.after) it.o.after(it); } };
  // affine-map a 2D drawing onto a projected quad (text and signs on facades); fn draws in a unit box w×h
  F3.onQuad = (it, w, h, fn) => { const [a, b, , d] = it.sp; if (!a || !b || !d) return; ctx.save(); ctx.beginPath(); it.sp.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.clip();
    ctx.setTransform((b[0] - a[0]) / w, (b[1] - a[1]) / w, (d[0] - a[0]) / h, (d[1] - a[1]) / h, a[0], a[1]); fn(); ctx.restore(); };
  // smooth camera path helper: keys [{t, pos, yaw, pitch, fov}] with ease in/out between
  F3.path = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++; const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)]; const u = b.t > a.t ? Math.max(0, Math.min(1, (t - a.t) / (b.t - a.t))) : 0, e = u * u * (3 - 2 * u);
    const L = (x, y) => x + (y - x) * e; return { pos: a.pos.map((v, k) => L(v, b.pos[k])), yaw: L(a.yaw || 0, b.yaw || 0), pitch: L(a.pitch || 0, b.pitch || 0), fov: L(a.fov || 50, b.fov || 50), roll: L(a.roll || 0, b.roll || 0) }; };
})();
