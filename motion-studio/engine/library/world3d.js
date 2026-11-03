/* WORLD3D — a living, toon-shaded 3D Vietnam street the camera flies through (three.js r160, WebGL/SwiftShader).
   One world per film → every beat is a CAMERA MOVE to a point of interest + an ACTION that happens there,
   and every cut is a continuous fly-through (one-take feel). Nutshell house colours, soft shadows, fog, time of day.
   # w3 at=cart|cafe|pho|biahoi|hotel|street|sky cam=push|orbit|crane|drop|macro|low|top|track|chase|dollyzoom|reveal
        act=banhmi|pho|coffee|traffic|money|cheers|tags|none  time=dawn|day|sunset|night  head="MAIN|sub"  …act keys
   2D on top: HEAD headline + fixed captions (vis.js zones) + price chips pinned to 3D objects (projected). */
'use strict';
(function () {
  if (typeof THREE === 'undefined') { console.warn('three.js missing'); return; }
  const R3 = { r: null, cv: null, w: 0, h: 0 };
  function renderer() {
    if (!R3.r) { R3.cv = document.createElement('canvas'); R3.r = new THREE.WebGLRenderer({ canvas: R3.cv, antialias: false, preserveDrawingBuffer: true });
      R3.r.shadowMap.enabled = false; /* vector look: no rendered shadows, flat contact-shadow shapes instead */ R3.r.outputColorSpace = THREE.SRGBColorSpace; R3.r.toneMapping = THREE.NoToneMapping; }
    const RS = window.W3_SCALE || .72; if (R3.w !== W || R3.h !== H) { R3.r.setPixelRatio(1); R3.r.setSize(Math.round(W * RS), Math.round(H * RS), false); R3.w = W; R3.h = H; } // render small (SwiftShader cost ∝ pixels), upscale smooth
    return R3.r;
  }
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);
  // ---------- toon materials (3-step ramp = animated-film shading, no outlines = nutshell)
  const ramp = (() => { const d = new Uint8Array([150, 255]); const t = new THREE.DataTexture(d, 2, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
  const MC = {}; const M = (col, o) => { o = o || {}; const k = col + JSON.stringify(o); if (!MC[k]) MC[k] = o.basic ? new THREE.MeshBasicMaterial({ color: col, ...o.p }) : new THREE.MeshToonMaterial({ color: col, gradientMap: ramp, ...(o.em ? { emissive: o.em, emissiveIntensity: o.ei ?? 1 } : {}), ...(o.p || {}) }); return MC[k]; };
  function gradGeo(g, col, k = .18) { const c = new THREE.Color(col), hsl = {}; c.getHSL(hsl); g.computeBoundingBox(); const b = g.boundingBox, pos = g.attributes.position, arr = new Float32Array(pos.count * 3); const top = new THREE.Color().setHSL(hsl.h, Math.min(1, hsl.s * 1.05), Math.min(.95, hsl.l + k * .6)), bot = new THREE.Color().setHSL((hsl.h + .02) % 1, Math.min(1, hsl.s * 1.1), Math.max(.05, hsl.l - k));
    for (let i = 0; i < pos.count; i++) { const t = (pos.getY(i) - b.min.y) / Math.max(1e-4, b.max.y - b.min.y); const cc = bot.clone().lerp(top, t); arr.set([cc.r, cc.g, cc.b], i * 3); } g.setAttribute('color', new THREE.BufferAttribute(arr, 3)); return g; }
  const MG = {}; const MGr = (o) => { const k = JSON.stringify(o || {}); return MG[k] || (MG[k] = new THREE.MeshToonMaterial({ color: '#ffffff', vertexColors: true, gradientMap: ramp, ...((o && o.em) ? { emissive: o.em, emissiveIntensity: o.ei ?? 1 } : {}) })); };
  const mesh = (g, m, cast = true) => { const x = new THREE.Mesh(g, m); x.castShadow = cast; x.receiveShadow = true; return x; };
  const box = (w, h, d, c, o) => (o && (o.em || o.p || o.basic)) ? mesh(new THREE.BoxGeometry(w, h, d), M(c, o)) : mesh(gradGeo(new THREE.BoxGeometry(w, h, d), c), MGr(o));
  const cyl = (rt, rb, h, c, seg = 16, o) => (o && (o.em || o.p)) ? mesh(new THREE.CylinderGeometry(rt, rb, h, seg), M(c, o)) : mesh(gradGeo(new THREE.CylinderGeometry(rt, rb, h, seg), c), MGr(o));
  const sph = (r, c, o, seg = 16) => (o && (o.em || o.p)) ? mesh(new THREE.SphereGeometry(r, seg, Math.max(8, seg / 2 | 0)), M(c, o)) : mesh(gradGeo(new THREE.SphereGeometry(r, seg, Math.max(8, seg / 2 | 0)), c, .25), MGr(o));
  const at = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; return o; };
  const grp = (...k) => { const g = new THREE.Group(); k.forEach(c => c && g.add(c)); return g; };
  function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
  const SIGNS = ['PHỞ GIA TRUYỀN', 'BÁNH MÌ', 'CÀ PHÊ', 'BIA HƠI', 'TẠP HÓA', 'BÚN CHẢ', 'XE MÁY', 'NHÀ NGHỈ', 'TRÀ ĐÁ', 'SIM 4G', 'CƠM BÌNH DÂN', 'BÁNH CUỐN'];
  const signTex = (txt, bg, fg) => canvasTex(512, 128, (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = '800 70px "Be Vietnam Pro", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h / 2 + 4, w - 30); });
  // ---------- builders
  const HOUSE = ['#ffb84d', '#ff7a59', '#4fc3a1', '#ffd98a', '#ff8fab', '#5aa9e6', '#f6a04d', '#9be07a', '#9b7bd6', '#ffe0b8']; // nutshell: saturated, soft, no greys
  function shophouse(w, h, side, i) { const g = new THREE.Group(), col = HOUSE[i % HOUSE.length], d = 6; const body = box(w, h, d, col); body.position.y = h / 2; g.add(body);
    const floors = Math.floor(h / 3.2); for (let f = 1; f < floors; f++) { const y = f * 3.2 + 1.5; const win = box(w * .62, 1.6, .1, '#2a3550', { em: '#ffcf7a', ei: 0 }); win.userData.win = 1; g.add(at(win, 0, y, d / 2 + .02));
      if (f % 2) { g.add(at(box(w * .9, .12, .9, '#e9e4da'), 0, y - .95, d / 2 + .45)); for (let k = -3; k <= 3; k++) g.add(at(box(.05, .7, .05, '#33384a'), k * w * .13, y - .55, d / 2 + .85)); g.add(at(box(w * .9, .05, .05, '#33384a'), 0, y - .2, d / 2 + .85)); }
      if ((i + f) % 3 === 0) g.add(at(box(.7, .5, .45, '#e8ecf0'), w * .3, y + .6, d / 2 + .25)); if ((i + f) % 4 === 1) g.add(at(sph(.35, '#4f9a4a'), -w * .32, y - .55, d / 2 + .75)); }
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(w * .86, w * .86 / 4), new THREE.MeshBasicMaterial({ map: signTex(SIGNS[i % SIGNS.length], ['#d6332a', '#f2c14e', '#1f6fb5', '#2e8b57'][i % 4], i % 4 === 1 ? '#3a1d10' : '#fff') })); sg.userData.sign = 1; g.add(at(sg, 0, 3.0, d / 2 + .06));
    const awn = box(w * .95, .08, 1.4, ['#2e8b57', '#d6332a', '#1f6fb5', '#f2c14e'][(i + 1) % 4]); awn.rotation.x = .25; g.add(at(awn, 0, 2.45, d / 2 + .7));
    const door = box(w * .8, 2.2, .08, ['#8a5a3a', '#6a4a6a', '#5a6a8a', '#9a6a40'][i % 4], { em: '#ffcf7a', ei: 0 }); door.userData.win = 1; g.add(at(door, 0, 1.1, d / 2 + .01));
    g.position.set(0, 0, side * (5.5 + d / 2)); if (side > 0) g.rotation.y = Math.PI; return g; }
  function tree(h = 5) { return grp(at(cyl(.12, .18, h, '#7a5634', 8), 0, h / 2, 0), at(sph(1.4, '#3f8f4a', null, 10), 0, h, 0), at(sph(1, '#57a85a', null, 10), .7, h - .4, .4)); }
  function scooter(col) { const g = new THREE.Group(); const body = box(1.5, .45, .42, col); body.position.y = .55; g.add(body); g.add(at(box(.5, .5, .4, col), .55, .9, 0)); g.add(at(box(.55, .12, .36, '#2a2a33'), -.25, .84, 0));
    const wheels = []; for (const x of [-.55, .6]) { const w = cyl(.28, .28, .14, '#222', 14); w.rotation.x = Math.PI / 2; w.position.set(x, .28, 0); g.add(w); wheels.push(w); } g.add(at(box(.06, .6, .5, '#555'), .75, 1.2, 0)); g.add(at(sph(.08, '#fff6c0', { em: '#fff2a0', ei: .8 }), .82, .95, 0));
    const rider = grp(at(box(.35, .6, .4, ['#2f6fbf', '#e6e2d6', '#d6332a', '#3a3a4a', '#2e8b57'][Math.floor(rnd() * 5)]), 0, 1.35, 0), at(sph(.2, '#e9b88c'), .02, 1.83, 0), at(sph(.23, ['#f2c14e', '#d6332a', '#ffffff', '#1f6fb5'][Math.floor(rnd() * 4)]), 0, 1.9, 0)); rider.position.x = -.1; g.add(rider);
    const bl = new THREE.Mesh(new THREE.CircleGeometry(.9, 24), new THREE.MeshBasicMaterial({ color: '#2a1f6a', transparent: true, opacity: .35, depthWrite: false })); bl.rotation.x = -Math.PI / 2; bl.scale.set(1, .45, 1); bl.position.y = .015; g.add(bl);
    g.userData.wheels = wheels; return g; }
  function stool(col = '#2f6fe0') { return grp(at(box(.32, .04, .32, col), 0, .42, 0), ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => at(box(.04, .42, .04, col), a * .13, .21, b * .13))); }
  function lowTable(col = '#c8432d') { return grp(at(box(.7, .04, .5, col), 0, .55, 0), ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => at(box(.04, .55, .04, '#888'), a * .3, .27, b * .2))); }
  function cart() { const g = new THREE.Group(); g.add(at(box(1.6, .9, .8, '#2e8b57'), 0, .65, 0)); const glass = mesh(new THREE.BoxGeometry(1.5, .6, .7), new THREE.MeshPhysicalMaterial({ color: '#cfe8ff', transparent: true, opacity: .25, roughness: .1 }), false); g.add(at(glass, 0, 1.45, 0));
    for (let k = 0; k < 6; k++) { const b = mesh(new THREE.CapsuleGeometry(.05, .28, 4, 8), M('#e3a04a')); b.rotation.z = Math.PI / 2; g.add(at(b, -.5 + k * .2, 1.25, (k % 2 ? .1 : -.12))); }
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .3), new THREE.MeshBasicMaterial({ map: signTex('BÁNH MÌ', '#f2c14e', '#b8261d') })); g.add(at(sg, 0, 1.95, .36)); { const rf = box(1.6, .05, .8, '#d6332a'); rf.castShadow = false; g.add(at(rf, 0, 1.78, 0)); }
    g.add(at(box(.8, .03, .45, '#c9965a'), .1, 1.11, .55)); // cutting board (stage for the build)
    for (const x of [-.6, .6]) { const w = cyl(.22, .22, .08, '#333', 14); w.rotation.x = Math.PI / 2; g.add(at(w, x, .22, .42)); } return g; }
  function lantern(col = '#e33a2a') { return grp(at(sph(.22, col, { em: col, ei: .5 }), 0, 0, 0), at(cyl(.1, .1, .06, '#f2c14e', 8), 0, .22, 0), at(cyl(.1, .1, .06, '#f2c14e', 8), 0, -.22, 0)); }
  // ---------- the world
  const WD = {};
  function build() {
    const sc = new THREE.Scene(); WD.sc = sc; WD.cam = new THREE.PerspectiveCamera(45, 1, .05, 400);
    WD.hemi = new THREE.HemisphereLight('#fff0e0', '#5b4bb0', 1.0); sc.add(WD.hemi); WD.rim = new THREE.DirectionalLight('#7fe0ff', 1.1); sc.add(WD.rim); sc.add(WD.rim.target); WD.sun = new THREE.DirectionalLight('#fff1d6', 2.2); WD.sun.castShadow = true; WD.sun.shadow.mapSize.set(1024, 1024);
    Object.assign(WD.sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 140 }); WD.sun.shadow.bias = -.0006; sc.add(WD.sun); sc.add(WD.sun.target);
    sc.fog = new THREE.Fog('#f2c9a0', 18, 95); { const g = new THREE.BufferGeometry(), pts = []; for (let i = 0; i < 600; i++) { const a = rnd() * TAU, e = .15 + rnd() * 1.2, r = 180; pts.push(Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r); } g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); WD.stars = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffffff', size: 1.4, sizeAttenuation: false, fog: false })); sc.add(WD.stars); }
    sc.add(at(box(240, .1, 11, '#3b3f7a'), 0, -.05, 0)); for (const s of [-1, 1]) { sc.add(at(box(240, .2, 2.6, '#8b86c9'), 0, .1, s * 4.2)); sc.add(at(box(240, .22, .15, '#c9c3f0'), 0, .11, s * 2.9)); }
    for (let x = -110; x < 110; x += 4) sc.add(at(box(1.8, .02, .14, '#ffd98a', null), x, .02, 0));
    sc.add(at(box(240, .1, 60, '#4a3f8a'), 0, -.12, 0));
    let i = 0; for (const side of [-1, 1]) { let x = -70; while (x < 70) { const w = 3.4 + rnd() * 1.6, h = 8 + rnd() * 8; const hs = shophouse(w, h, side, i++); hs.position.x = x + w / 2; sc.add(hs); x += w + .05; } }
    for (let x = -66; x < 66; x += 9) { for (const s of [-1, 1]) { const t = tree(4.5 + rnd()); t.position.set(x + s * 2, 0, s * 4.6); sc.add(t); } }
    // wires + lanterns + string lights
    WD.glows = []; for (let x = -60; x < 60; x += 6) { const pts = []; for (let k = 0; k <= 10; k++) { const z = -5 + k; pts.push(V3(x + Math.sin(k) * .2, 7.5 - Math.sin(k / 10 * Math.PI) * .9, z * 1.0)); } const cu = new THREE.CatmullRomCurve3(pts); sc.add(mesh(new THREE.TubeGeometry(cu, 20, .025, 4), M('#1c1c24'), false));
      if (x % 12 === 0) for (let k = 2; k < 9; k += 2) { const l = lantern(['#e33a2a', '#f2c14e', '#e86a2a'][k % 3]); l.position.copy(cu.getPoint(k / 10)).add(V3(0, -.35, 0)); sc.add(l); WD.glows.push(l); } }
    // POI sets
    WD.cart = cart(); at(WD.cart, 0, .2, -4.3); sc.add(WD.cart);
    WD.cafe = new THREE.Group(); at(WD.cafe, 16, .2, -4.4); for (let k = 0; k < 3; k++) { const t = lowTable(); t.position.set(k * 1.6 - 1.6, 0, 0); WD.cafe.add(t); for (const dz of [-.5, .5]) { const s = stool(k % 2 ? '#d6332a' : '#2f6fe0'); s.position.set(k * 1.6 - 1.6 + (dz > 0 ? .3 : -.3), 0, dz); WD.cafe.add(s); } } sc.add(WD.cafe);
    WD.pho = new THREE.Group(); at(WD.pho, -16, .2, 4.4, Math.PI); WD.pho.add(at(cyl(.45, .4, .7, '#b8bcc4', 20), -1.2, .55, 0)); WD.pho.add(at(lowTable('#2f6fe0'), .4, 0, 0)); WD.pho.add(at(stool(), .4, 0, .55)); sc.add(WD.pho);
    WD.biahoi = new THREE.Group(); at(WD.biahoi, 30, .2, 4.4, Math.PI); for (let k = 0; k < 4; k++) { const t = lowTable('#2f6fe0'); t.position.set(k * 1.5 - 2, 0, 0); WD.biahoi.add(t); for (let j = 0; j < 4; j++) { const s = stool('#d6332a'); s.position.set(k * 1.5 - 2 + (j - 1.5) * .35, 0, j % 2 ? .5 : -.5); WD.biahoi.add(s); } } sc.add(WD.biahoi);
    WD.hotel = new THREE.Group(); at(WD.hotel, -32, 0, -4.6); WD.hotel.add(at(box(7, 12, 1, '#2b2f3c'), 0, 6, -.8)); const gl = mesh(new THREE.BoxGeometry(6, 3, .1), new THREE.MeshPhysicalMaterial({ color: '#ffe6a8', emissive: '#ffcf7a', emissiveIntensity: .35, transparent: true, opacity: .55 }), false); WD.hotel.add(at(gl, 0, 1.6, -.25)); WD.hotel.add(at(box(6.4, .3, .3, '#d4a84a'), 0, 3.2, -.2));
    const hs = new THREE.Mesh(new THREE.PlaneGeometry(4, .6), new THREE.MeshBasicMaterial({ map: signTex('GRAND LOBBY CAFÉ', '#1a1d28', '#e8c46a') })); WD.hotel.add(at(hs, 0, 3.7, -.1)); sc.add(WD.hotel);
    // traffic
    WD.bikes = []; for (let k = 0; k < 18; k++) { const b = scooter(['#d6332a', '#f4f0e6', '#1f6fb5', '#2e2e38', '#f2c14e', '#7fb7a4'][k % 6]); const lane = [-2.2, -1, .2, 1.4, 2.4][k % 5]; b.userData.lane = lane; b.userData.dir = lane < 0 ? -1 : 1; b.userData.v = 5 + rnd() * 4; b.userData.x0 = rnd() * 120 - 60; if (b.userData.dir < 0) b.rotation.y = Math.PI; sc.add(b); WD.bikes.push(b); }
    WD.dyn = new THREE.Group(); sc.add(WD.dyn); WD.steam = steamTex();
  }
  function steamTex() { return canvasTex(128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); }); }
  // ---------- time of day
  const TOD = { dawn: { sky: ['#ff9a76', '#4b3f95'], fog: '#e8869a', sun: '#ffb38a', si: 1.18, hemi: 0.92, el: .2, az: -1.1, night: 0, rim: '#8fe3ff' }, day: { sky: ['#8fe0ff', '#3a6fd8'], fog: '#a9d8f5', sun: '#fff1d0', si: 1.49, hemi: 1.04, el: .9, az: -.5, night: 0, rim: '#ffffff' },
    sunset: { sky: ['#ff7e5f', '#3b2b7b'], fog: '#d9708a', sun: '#ff9a5a', si: 1.18, hemi: 0.8, el: .14, az: 1.1, night: .25, rim: '#ffcf7a' }, night: { sky: ['#2a2a7a', '#070a26'], fog: '#1d1f5a', sun: '#8aa0ff', si: 0.28, hemi: 0.44, el: .9, az: .4, night: 1, rim: '#5fd0ff' } };
  const skyCache = {}; function setTime(name) { const T = TOD[name] || TOD.day; if (WD.timeName === name) return; WD.timeName = name;
    WD.sc.background = skyCache[name] || (skyCache[name] = canvasTex(4, 256, (g) => { const r = g.createLinearGradient(0, 0, 0, 256); r.addColorStop(0, T.sky[1]); r.addColorStop(.75, T.sky[0]); r.addColorStop(1, T.fog); g.fillStyle = r; g.fillRect(0, 0, 4, 256); }));
    WD.sc.fog.color.set(T.fog); WD.rim.color.set(T.rim); WD.sun.color.set(T.sun); if (WD.stars) WD.stars.visible = T.night > .5; WD.sun.intensity = T.si; WD.hemi.intensity = T.hemi;
    WD.sc.traverse(o => { if (o.userData && o.userData.win && o.material) { o.material = o.material.clone(); o.material.emissiveIntensity = T.night * (.6 + Math.random() * .6); } });
    WD.glows.forEach(l => l.children[0].material.emissiveIntensity = .4 + T.night * 1.6); WD.night = T.night; WD.T = T; }
  function placeSun(cx, cam) { const T = WD.T; WD.sun.position.set(cx + Math.sin(T.az) * 60, 8 + T.el * 70, Math.cos(T.az) * 40); WD.sun.target.position.set(cx, 0, 0); if (cam) { const b = cam.position.clone().sub(WD.sun.target.position); WD.rim.position.set(cx - b.x * 2, 12, -b.z * 2); WD.rim.target.position.set(cx, 1, 0); } }
  // ---------- traffic (pure function of time)
  function traffic(t) { WD.bikes.forEach(b => { const u = b.userData; let x = u.x0 + u.dir * u.v * t; x = ((x + 70) % 140 + 140) % 140 - 70; b.position.set(x, .2, u.lane); u.wheels.forEach(w => w.rotation.y = t * u.v * 3); b.position.y = .2 + Math.abs(Math.sin(t * 9 + u.x0)) * .015; }); }
  // ---------- POIs: target + default framing (distance, height, yaw)
  const POI = { cart: { t: [0.1, 1.2, -3.75], d: 3.2, h: .6, yaw: 0 }, board: { t: [0.1, 1.4, -3.72], d: .8, h: 1.1, yaw: .15 }, cafe: { t: [16, .75, -4.4], d: 3.4, h: .5, yaw: .3 }, cup: { t: [16, .9, -4.4], d: 1.8, h: .45, yaw: .2 },
    pho: { t: [-15.6, .8, 4.4], d: 3, h: .6, yaw: Math.PI - .2 }, bowl: { t: [-15.6, .9, 4.4], d: 1.25, h: .7, yaw: Math.PI - .1 }, biahoi: { t: [29.5, 1.0, 4.4], d: 1.9, h: .5, yaw: Math.PI + .25 },
    hotel: { t: [-32, 2.4, -4.8], d: 6.5, h: .35, yaw: .55 }, money: { t: [0, .35, 1.6], d: 2.6, h: .6, yaw: .6 }, street: { t: [0, 1.4, 0], d: 9, h: .4, yaw: .9 }, sky: { t: [0, 0, 0], d: 40, h: 45, yaw: .5 } };
  function frame(poi, cam, p, o) { const P = POI[poi] || POI.street, T = V3(...P.t), d = P.d * (o.dist ?? 1), y0 = P.yaw + (o.yaw ?? 0); const pe = E.inOut(p), ps = E.sine(p);
    let yaw = y0, dist = d, h = P.h * d * .6 + .3, fov = +(o.fov || 40), tg = T.clone();
    switch (cam) {
      case 'push': dist = d * lerp(1.35, .82, pe); break;
      case 'pull': dist = d * lerp(.7, 1.5, pe); break;
      case 'orbit': yaw = y0 + lerp(-.75, .75, ps); break;
      case 'crane': h = lerp(.2, d * 1.4, pe); dist = d * lerp(1, 1.25, pe); break;
      case 'drop': h = lerp(d * 2.2, P.h * d * .6, E.out(p)); yaw = y0 + lerp(.5, 0, pe); break;
      case 'macro': dist = d * lerp(.75, .6, ps); h = d * .3; fov = 32; yaw = y0 + lerp(-.25, .25, ps); break;
      case 'low': h = .12; dist = d * .8; fov = 62; tg.y += 1.2; yaw = y0 + lerp(-.2, .2, ps); break;
      case 'hero': h = d * lerp(1.05, .8, pe); dist = d * lerp(.95, .7, pe); yaw = y0 + lerp(-.45, .35, ps); fov = 34; break;
      case 'curb': { tg = V3(lerp(-6, 6, ps), .9, .4); return { pos: V3(lerp(-14, -2, ps), .35 + Math.sin(p * 3) * .03, -2.75), tg, fov: 60 }; }
      case 'top': h = d * 1.6; dist = .01 + d * .05; yaw = y0 + p * 1.2; fov = 50; break;
      case 'track': tg.x += lerp(-4, 4, ps); break;
      case 'dollyzoom': fov = lerp(28, 70, pe); dist = d * lerp(1.8, .62, pe) * Math.tan(28 * Math.PI / 360) / Math.tan(lerp(28, 70, pe) * Math.PI / 360) * 1.6; break;
      case 'reveal': h = lerp(.3, d * .8, pe); dist = d * lerp(.35, 1.4, pe); yaw = y0 + lerp(-.6, 0, pe); break;
      case 'chase': { const b = WD.bikes[+(o.bike || 3)]; tg = b.position.clone().add(V3(0, 1, 0)); yaw = b.userData.dir > 0 ? -Math.PI / 2 + .35 : Math.PI / 2 + .35; dist = 3.2; h = 1.4; break; }
    }
    const pos = V3(tg.x + Math.sin(yaw) * dist, tg.y + h, tg.z + Math.cos(yaw) * dist); return { pos, tg, fov }; }
  const lerpV = (a, b, k) => a.clone().lerp(b, k);
  // ---------- actions (pure functions of beat time; build meshes once per beat id)
  const ACT = {};
  const dropY = (q, h = .5) => q <= 0 ? null : (1 - E.bounce(clamp(q / .55))) * h;
  ACT.banhmi = { make() { const g = new THREE.Group(); const bread = (c) => { const m = mesh(new THREE.CapsuleGeometry(.045, .24, 6, 12), M(c)); m.rotation.z = Math.PI / 2; m.scale.set(1, 1, .9); return m; };
      g.userData.bot = at(bread('#e39a45'), 0, 0, 0); g.userData.bot.scale.y = .55; g.userData.top = bread('#eaa34c'); g.userData.top.scale.y = .6; const hinge = new THREE.Group(); hinge.position.set(0, .02, -.035); hinge.add(at(g.userData.top, 0, .01, .035)); g.userData.hinge = hinge;
      g.add(g.userData.bot, hinge); const P = g.userData.parts = {};
      P.pate = at(box(.25, .006, .06, '#9b5a36'), 0, .026, 0); P.pork = grp(...[0, 1, 2, 3].map(k => { const s = cyl(.03, .03, .01, '#b4613c', 12); s.scale.set(1, 1, .7); return at(s, -.09 + k * .06, .035, 0); }));
      P.pickles = grp(...Array.from({ length: 14 }, (_, k) => { const s = box(.045, .006, .006, k % 3 ? '#f08a2a' : '#f6efe0'); s.rotation.y = (k * 1.7) % 1 - .5; return at(s, -.1 + (k * .37 % 1) * .2, .045 + (k % 3) * .004, (k * .53 % 1 - .5) * .04); }));
      P.cucumber = grp(...[0, 1].map(k => at(box(.16, .012, .012, '#4f9e3d'), -.03 + k * .05, .052, k ? .012 : -.012)));
      P.herbs = grp(...Array.from({ length: 7 }, (_, k) => at(sph(.012, k % 2 ? '#3f9a3a' : '#57b04a', null, 8), -.1 + k * .033, .066, (k % 2 - .5) * .02)));
      P.chili = grp(...Array.from({ length: 6 }, (_, k) => { const r = mesh(new THREE.TorusGeometry(.007, .003, 6, 10), M('#e1352a')); r.rotation.x = Math.PI / 2; return at(r, -.09 + k * .035, .072, ((k * 7) % 3 - 1) * .012); }));
      Object.values(P).forEach(o => { o.visible = false; g.add(o); }); g.position.set(.1, 1.36, -3.72); g.scale.setScalar(1.6); return g; },
    update(g, lt, ats, tClose) { const P = g.userData.parts; Object.keys(P).forEach((k, j) => { const q = lt - (ats[j] ?? 99); const y = dropY(q, .25); P[k].visible = y !== null; if (y !== null) P[k].position.y = (P[k].userData.y0 ??= P[k].position.y) + y; });
      { const c = E.back(clamp((lt - tClose) / .35)), hg = g.userData.hinge; hg.position.set(0, lerp(.09, .02, c), lerp(-.09, -.035, c)); hg.rotation.x = lerp(-.55, 0, c); hg.rotation.z = lerp(.08, 0, c) + Math.sin(lt * 1.3) * .02 * (1 - c); } g.position.y = 1.36 + (1 - E.back(clamp(lt / .5))) * .3; } , order: ['pate', 'pork', 'pickles', 'cucumber', 'herbs', 'chili'], anchor: [.1, 1.3, -3.75] };
  ACT.pho = { make() { const g = new THREE.Group(); const pts = []; for (let k = 0; k <= 10; k++) { const a = k / 10; pts.push(new THREE.Vector2(.05 + Math.sin(a * Math.PI / 2) * .11, a * .09)); }
      const bowl = mesh(new THREE.LatheGeometry(pts, 32), M('#f6f2e8', { p: { side: THREE.DoubleSide } })); g.add(bowl); g.add(at(mesh(new THREE.TorusGeometry(.16, .006, 6, 40), M('#3a6fb0')), 0, .09, 0)); g.children[1].rotation.x = Math.PI / 2;
      const P = g.userData.parts = {}; const disc = (r, c, y) => { const m = cyl(r, r, .004, c, 32); return at(m, 0, y, 0); };
      P.broth = disc(.15, '#d79a4c', .07); P.noodles = grp(...Array.from({ length: 10 }, (_, k) => { const t = mesh(new THREE.TorusGeometry(.02 + (k % 3) * .006, .003, 5, 12, 4), M('#fbf3df')); t.rotation.x = Math.PI / 2; return at(t, Math.cos(k * 2.4) * .07, .076, Math.sin(k * 2.4) * .07); }));
      P.beef = grp(...[0, 1, 2, 3].map(k => { const s = cyl(.035, .035, .004, '#c4505a', 12); s.scale.set(1, 1, .6); return at(s, Math.cos(k * 1.6) * .06, .082, Math.sin(k * 1.6) * .06); }));
      P.herbs = grp(...Array.from({ length: 9 }, (_, k) => at(sph(.012, k % 2 ? '#3f9a3a' : '#57b04a', null, 8), Math.cos(k * 2) * .09, .088, Math.sin(k * 2) * .09)));
      P.lime = at(sph(.025, '#8fd14f', null, 12), .12, .095, .05); P.chili = grp(...Array.from({ length: 5 }, (_, k) => { const r = mesh(new THREE.TorusGeometry(.008, .003, 6, 10), M('#e1352a')); r.rotation.x = Math.PI / 2; return at(r, Math.cos(k * 1.3 + 1) * .05, .092, Math.sin(k * 1.3 + 1) * .05); }));
      Object.values(P).forEach(o => { o.visible = false; g.add(o); }); g.userData.steam = Array.from({ length: 5 }, (_, k) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: WD.steam, transparent: true, depthWrite: false, opacity: .5 })); g.add(s); return s; });
      g.position.set(-15.6, .78, 4.4); g.scale.setScalar(1.8); return g; },
    update(g, lt, ats, tc, o) { const P = g.userData.parts; Object.keys(P).forEach((k, j) => { const q = o && o.full ? 9 : lt - (ats[j] ?? 99); const y = k === 'broth' ? (q > 0 ? 0 : null) : dropY(q, .3); P[k].visible = y !== null; if (y !== null) { P[k].position.y = (P[k].userData.y0 ??= P[k].position.y) + y; if (k === 'broth') P[k].scale.set(clamp(q / .6) + .01, 1, clamp(q / .6) + .01); }
        if (k === 'beef' && q > 0) P[k].children.forEach(c => c.material = M(clamp((q - .6) / 1.2) > .5 ? '#9a5a46' : '#c4505a')); });
      const on = (o && o.full) || lt > (ats[0] ?? 0); g.userData.steam.forEach((s, k) => { const p = ((lt * .35 + k / 5) % 1); s.visible = on; s.position.set(Math.sin(k * 2 + lt) * .04, .12 + p * .35, Math.cos(k) * .03); s.scale.setScalar(.08 + p * .18); s.material.opacity = (1 - p) * .45; }); g.position.y = .78 + (1 - E.back(clamp(lt / .5))) * .25; }, order: ['broth', 'noodles', 'beef', 'herbs', 'lime', 'chili'], anchor: [-15.6, .95, 4.4] };
  ACT.coffee = { make() { const g = new THREE.Group(); const glass = mesh(new THREE.CylinderGeometry(.045, .038, .13, 24, 1, true), new THREE.MeshPhysicalMaterial({ color: '#e8f4ff', transparent: true, opacity: .3, side: THREE.DoubleSide }), false); g.add(at(glass, 0, .065, 0));
      const liq = cyl(.042, .037, 1, '#6a3a1e', 20); g.add(liq); g.userData.liq = liq; const phin = grp(at(cyl(.04, .035, .07, '#c9ccd2', 20), 0, 0, 0), at(cyl(.06, .06, .006, '#c9ccd2', 24), 0, -.035, 0), at(cyl(.042, .042, .01, '#b8bcc2', 20), 0, .04, 0)); phin.position.y = .17; g.add(phin); g.userData.phin = phin;
      g.userData.drops = Array.from({ length: 4 }, () => { const d = sph(.004, '#3a1f12', null, 6); g.add(d); return d; }); g.userData.ice = Array.from({ length: 4 }, (_, k) => { const c = mesh(new THREE.BoxGeometry(.025, .025, .025), new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: .55 }), false); g.add(c); return c; });
      g.position.set(16, .78, -4.4); g.scale.setScalar(2.2); return g; },
    update(g, lt, ats) { const fill = clamp((lt - .3) / Math.max(2, (ats[1] ?? 3))); g.userData.liq.scale.y = .01 + fill * .09; g.userData.liq.position.y = (.01 + fill * .09) / 2 + .002;
      g.userData.drops.forEach((d, k) => { const p = (lt * 1.6 + k / 4) % 1; d.position.set(0, .13 - p * (.12 - fill * .09), 0); d.visible = fill < .98; });
      const iceT = ats[1] ?? 2.5; g.userData.ice.forEach((c, k) => { const y = dropY(lt - iceT - k * .08, .3); c.visible = y !== null; if (y !== null) { c.position.set(Math.cos(k * 1.7) * .018, .02 + fill * .07 + y, Math.sin(k * 1.7) * .018); c.rotation.set(k, k * 2, lt * .2); } });
      g.userData.phin.visible = lt < iceT; }, order: [], anchor: [16, .95, -4.4] };
  ACT.money = { make() { const g = new THREE.Group(); const tex = {}; const note = (v, c) => { tex[v] ||= canvasTex(256, 128, (x, w, h) => { x.fillStyle = c; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 8; x.strokeRect(8, 8, w - 16, h - 16); x.fillStyle = '#1b1530'; x.font = '800 54px "Be Vietnam Pro"'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(v, w / 2, h / 2 + 3); });
        return new THREE.Mesh(new THREE.PlaneGeometry(.3, .15), new THREE.MeshToonMaterial({ map: tex[v], gradientMap: ramp, side: THREE.DoubleSide })); };
      g.userData.notes = Array.from({ length: 24 }, (_, k) => { const n = note(['10.000', '20.000', '50.000', '100.000', '200.000'][k % 5], ['#d4a24a', '#5a8fd0', '#e07aa0', '#5ab08a', '#e0784a'][k % 5]); n.castShadow = true; g.add(n); return n; }); const pl = new THREE.PointLight('#ffd9a0', 6, 8, 1.5); pl.position.set(.5, 2.2, .6); g.add(pl); g.position.set(0, .2, 1.6); return g; },
    update(g, lt) { g.userData.notes.forEach((n, k) => { const t0 = k * .12, q = lt - t0; if (q < 0) { n.visible = false; return; } n.visible = true; const fall = clamp(q / 1.4); const y = lerp(4, .02 + k * .006, E.out(fall)); n.position.set(Math.sin(k * 3.1) * .08 * (1 - fall) + (k % 3 - 1) * .02, y, Math.cos(k * 2.3) * .06 * (1 - fall)); n.rotation.set(lerp(Math.PI / 2 + Math.sin(q * 6 + k) * 1.2, -Math.PI / 2, E.out(fall)), k * .7, Math.sin(q * 5 + k) * (1 - fall)); }); }, order: [], anchor: [0, .5, 1.6] };
  ACT.cheers = { make() { const g = new THREE.Group(); g.userData.gl = [-1, 1].map(s => { const gg = grp(at(mesh(new THREE.CylinderGeometry(.045, .04, .14, 20), new THREE.MeshPhysicalMaterial({ color: '#ffd35a', transparent: true, opacity: .85, emissive: '#f2a53a', emissiveIntensity: .2 })), 0, .07, 0), at(cyl(.046, .046, .03, '#fffaf0', 20), 0, .155, 0)); g.add(gg); return gg; }); const pl = new THREE.PointLight('#ffcf8a', 3, 4, 1.5); pl.position.set(0, .6, -.4); g.add(pl); g.position.set(29.5, .78, 4.4); g.scale.setScalar(1.5); return g; },
    update(g, lt, ats) { const tc = ats[0] ?? 1; g.userData.gl.forEach((x, k) => { const s = k ? 1 : -1; const p = E.inOut(clamp((lt - tc + .5) / .5)), back = E.out(clamp((lt - tc) / .4)); x.position.set(s * lerp(.22, .05, p) + s * back * .06, lerp(0, .12, p) - back * .04, 0); x.rotation.z = -s * lerp(0, .35, p) * (1 - back * .5); }); }, order: [], anchor: [30, 1.1, 4.4] };
  ACT.traffic = ACT.none = ACT.tags = { make() { return new THREE.Group(); }, update() { }, order: [] };
  // ---------- depth of field (2 renders: colour + focus mask → 2D composite: blurred frame, sharp where in focus)
  const DOF = { mat: null, sm: null, mk: null };
  function dofMask(R, sc, cam, focus, range) { if (!DOF.mat) DOF.mat = new THREE.ShaderMaterial({ uniforms: { f: { value: 1 }, r: { value: 1 } }, vertexShader: 'varying float vz; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vz = -mv.z; gl_Position = projectionMatrix * mv; }', fragmentShader: 'uniform float f; uniform float r; varying float vz; void main(){ float a = clamp(1.0 - (abs(vz - f) - r * .35) / r, 0.0, 1.0); gl_FragColor = vec4(a, a, a, 1.0); }' });
    DOF.mat.uniforms.f.value = focus; DOF.mat.uniforms.r.value = range; const bg = sc.background, fog = sc.fog; sc.background = new THREE.Color(0); sc.fog = null; sc.overrideMaterial = DOF.mat; R.render(sc, cam); sc.overrideMaterial = null; sc.background = bg; sc.fog = fog;
    const w = Math.ceil(W / 4), h = Math.ceil(H / 4); if (!DOF.sm || DOF.sm.width !== w) { DOF.sm = mkCanvas(w, h); DOF.mk = mkCanvas(w, h); } const g = DOF.sm.getContext('2d', { willReadFrequently: true }); g.drawImage(R3.cv, 0, 0, w, h); const d = g.getImageData(0, 0, w, h); for (let i = 0; i < d.data.length; i += 4) { d.data[i + 3] = d.data[i]; d.data[i] = d.data[i + 1] = d.data[i + 2] = 255; } DOF.mk.getContext('2d').putImageData(d, 0, 0); return DOF.mk; }
  function composeDOF(R, sc, cam, focus, range, blur) { const sharp = mkCanvas(W, H), sg = sharp.getContext('2d'); sg.drawImage(R3.cv, 0, 0, W, H); const mk = dofMask(R, sc, cam, focus, range);
    if (!DOF.lo || DOF.lo.width !== Math.ceil(W / 3)) DOF.lo = mkCanvas(Math.ceil(W / 3), Math.ceil(H / 3)); const lg = DOF.lo.getContext('2d'); lg.filter = `blur(${blur / 3}px)`; lg.drawImage(sharp, 0, 0, DOF.lo.width, DOF.lo.height); lg.filter = 'none'; ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(DOF.lo, 0, 0, W, H); ctx.restore(); sg.globalCompositeOperation = 'destination-in'; sg.imageSmoothingEnabled = true; sg.drawImage(mk, 0, 0, W, H); ctx.drawImage(sharp, 0, 0); }
  // ---------- beat recipe
  const BEATS = []; let LAST = null;
  SB.recipes.w3 = (o, b) => { const { caps, end } = timeCaps(b.caps, .35, .06, b.capStyle); const dur = Math.max(+(o.dur || 0), end + .35, 3); const idx = BEATS.length; const act = ACT[o.act] ? o.act : 'none';
    const parts = (o.parts || '').split('|').filter(Boolean).map(s => { const [id, lab] = s.split(':'); return { id, lab: lab || id.toUpperCase() }; }); const n = parts.length, hasIntro = caps.length > n && n > 0;
    const ats = n ? parts.map((_, k) => caps[k + (hasIntro ? 1 : 0)] ? caps[k + (hasIntro ? 1 : 0)][0] + .05 : .8 + k * .7) : caps.map(c => c[0] + .05); const tClose = +(o.closeAt ?? ((ats[n - 1] ?? 1) + 1.1));
    const beat = { o, idx, dur, act, parts, ats, tClose, cam: o.cam || ['push', 'orbit', 'crane', 'macro', 'reveal'][idx % 5], at: o.at || 'street', time: o.time || 'day' }; BEATS.push(beat);
    const travel = idx > 0 ? +(o.travel ?? .9) : 0; const prev = idx > 0 ? BEATS[idx - 1] : null; let G = null;
    const tags = (o.tags || '').split('|').filter(Boolean).map(s => { const [poi, txt, sub, tt] = s.split(':'); return { poi, txt, sub, at: +(tt ?? .8) }; });
    const draw = lt => { if (!WD.sc) build(); const Rr = renderer(); setTime(beat.time);
      if (!G || G.userData.beat !== idx) { WD.dyn.clear(); G = ACT[act].make(); G.userData.beat = idx; WD.dyn.add(G); }
      ACT[act].update(G, lt, n ? ats : (act === 'pho' ? [] : ats), tClose, o); traffic(lt + idx * 9);
      const p = clamp((lt - travel * .6) / Math.max(.5, dur - travel * .6)); let f = frame(beat.at, beat.cam, p, o);
      if (prev && lt < travel) { const pf = frame(prev.at, prev.cam, 1, prev.o), k = E.inOut(clamp(lt / travel)); const far = pf.pos.distanceTo(f.pos); const lift = Math.sin(k * Math.PI) * Math.min(14, far * .35);
        f = { pos: lerpV(pf.pos, f.pos, k).add(V3(0, lift, 0)), tg: lerpV(pf.tg, f.tg, k), fov: lerp(pf.fov, f.fov, k) }; }
      if (o.out === 'push' && lt > dur - .45) { const k = E.in(clamp((lt - (dur - .45)) / .45)); f.pos = lerpV(f.pos, f.tg, k * .92); f.fov = lerp(f.fov, f.fov * .7, k); }
      const sh = (+o.shake || 0) + (beat.cam === 'low' || beat.cam === 'chase' ? .02 : .006); f.pos.add(V3(Math.sin(lt * 7.1) * sh, Math.sin(lt * 5.3) * sh, 0));
      const C = WD.cam; C.aspect = W / H; C.fov = f.fov * (H > W ? 1.25 : 1); C.updateProjectionMatrix(); C.position.copy(f.pos); C.lookAt(f.tg); placeSun(f.tg.x, C);
      Rr.render(WD.sc, C); const ap = +(o.dof ?? 0); const fd = f.pos.distanceTo(f.tg);
      if (ap > .05 && !window.W3_NODOF && !(prev && lt < travel)) composeDOF(Rr, WD.sc, C, fd, Math.max(.15, fd * (1.2 - ap)), (2 + ap * 9) * U()); else ctx.drawImage(R3.cv, 0, 0, W, H);
      if (prev && lt < travel) { const sp = Math.sin(clamp(lt / travel) * Math.PI); if (sp > .2) { const u = U(), r = rng(idx); ctx.save(); ctx.globalAlpha = .28 * sp; for (let i = 0; i < 18; i++) { const y = r() * H, l = (300 + r() * 700) * u; rr(r() * W - l / 2, y, l, (2 + r() * 5) * u, 3 * u, '#fff', 0); } ctx.restore(); } }
      { const u = U(), r = rng(31 + idx); for (let i = 0; i < 22; i++) { const x = (r() * W + lt * (6 + r() * 18) * u) % W, y = (r() * H - lt * (4 + r() * 10) * u + H * 4) % H, rad = (1.5 + r() * 4) * u; ctx.globalAlpha = .18 + r() * .25; circ(x, y, rad, '#fff6e0', 0); } ctx.globalAlpha = 1; }
      { const g0 = ctx.createLinearGradient(0, 0, 0, H * .3); g0.addColorStop(0, 'rgba(8,10,28,.55)'); g0.addColorStop(1, 'rgba(8,10,28,0)'); ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H * .3); const g1 = ctx.createLinearGradient(0, H * .72, 0, H); g1.addColorStop(0, 'rgba(8,10,28,0)'); g1.addColorStop(1, 'rgba(8,10,28,.5)'); ctx.fillStyle = g1; ctx.fillRect(0, H * .72, W, H * .28); }
      // 2D: price chips pinned to 3D points, then HEAD headline
      tags.forEach(tg => { const P = POI[tg.poi]; if (!P) return; const v = V3(...P.t).add(V3(0, .25, 0)).project(C); if (v.z > 1) return; const x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H; const q = (lt - tg.at) / .45; if (q > 0 && window.VIS && VIS.tag) VIS.tag(x, Math.max(H * .3, Math.min(H * .7, y)), tg.txt, tg.sub, q, '#ffcf4a', lt); });
      const cur = n ? parts.filter((_, j) => lt >= ats[j]).length - 1 : -1; const hd = cur >= 0 ? parts[cur].lab + '|' + (o.sub || '') : o.head;
      if (window.VIS && VIS.headline) VIS.headline(lt > tClose && o.final ? o.final : hd, lt, lt > tClose && o.final ? tClose : cur >= 0 ? ats[cur] : .2, o.acc || '#ffcf4a'); };
    const sfx = [...(travel ? [[0, 'whoosh']] : []), ...(o.out === 'push' ? [[dur - .45, 'whoosh_up']] : []), ...(n ? ats.map(a => [a + .25, 'thud']) : []), ...(act === 'banhmi' ? [[tClose + .15, 'impact']] : []), ...(act === 'money' ? [[.3, 'coins'], [1.2, 'register']] : []), ...(act === 'cheers' ? [[(ats[0] ?? 1), 'clink']] : []), ...tags.map(t => [t.at, 'register'])];
    return { dur, place: 'studio', placeOpts: { color: '#111', floor: false }, light: 'none', layers: [{ type: 'fn', screen: true, draw }], captions: caps, sfx: sfx.filter(s => s[0] < dur), w3: 1 };
  };
  window.W3D = { POI, TOD, beats: BEATS };
})();
