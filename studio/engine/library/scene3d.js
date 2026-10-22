/* REAL 3D set pieces (three.js r160, WebGL — SwiftShader when headless). Rendered on an offscreen WebGL canvas and
   composited into the frame, so the film grade, captions and transitions still apply.
   # moment kind=map3d stages="938;Independence|1069;…|today;"   — Việt Nam as a raised relief slab; Đại Việt's territory
       rises out of the land era by era while a camera glides north → south; Champa / Khmer lands sink; 3D year titles.
   # moment kind=fleet3d                                          — 1306: the wedding fleet on a moving sea at golden hour,
       fog, layered mountains, lanterns, camera skimming the waves then craning up; "1306" as a solid 3D title in the sky.
   Hoàng Sa & Trường Sa are always shown (red). */
(function () {
  if (typeof THREE === 'undefined') { console.warn('three.js missing'); return; }
  const T3 = { r: null, cv: null, w: 0, h: 0 };
  function renderer() {
    if (!T3.r) { T3.cv = document.createElement('canvas'); T3.r = new THREE.WebGLRenderer({ canvas: T3.cv, antialias: true, preserveDrawingBuffer: true, alpha: false });
      T3.r.shadowMap.enabled = true; T3.r.shadowMap.type = THREE.PCFSoftShadowMap; T3.r.localClippingEnabled = true; T3.r.outputColorSpace = THREE.SRGBColorSpace; T3.r.toneMapping = THREE.ACESFilmicToneMapping; T3.r.toneMappingExposure = 1.05; }
    if (T3.w !== W || T3.h !== H) { T3.r.setPixelRatio(1); T3.r.setSize(W, H, false); T3.w = W; T3.h = H; }
    return T3.r;
  }
  const merc = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI;
  const SC = 1; // 1 world unit = 1 degree
  const X = lon => (lon - 106.5) * SC, Z = lat => -(merc(lat) - merc(15.5)) * SC;
  function shapeFrom(ring) { const s = new THREE.Shape(); ring.forEach(([lo, la], i) => { const x = X(lo), y = -Z(la); i ? s.lineTo(x, y) : s.moveTo(x, y); }); return s; }
  function slab(rings, depth, mat, bevel = .05) { const shapes = rings.filter(r => r.length > 8).map(shapeFrom); const g = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * .8, bevelSegments: 2, curveSegments: 1 });
    g.rotateX(-Math.PI / 2); const m = new THREE.Mesh(g, mat); m.castShadow = true; m.receiveShadow = true; return m; }
  // a solid 3D title: text drawn to a texture and stacked in thin layers (dark core → lit face) — reads as extruded type
  function title3d(txt, o = {}) { const c = document.createElement('canvas'), fs = 220; c.width = 2048; c.height = 360; const x = c.getContext('2d');
    x.font = `900 ${fs}px ${FONT.display}`; x.textAlign = 'center'; x.textBaseline = 'middle'; if (o.ls) x.letterSpacing = o.ls + 'px'; x.fillStyle = '#fff'; x.fillText(txt, 1024, 190);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const grp = new THREE.Group(), n = o.layers || 26, w = o.w || 6, h = w * 360 / 2048;
    for (let i = 0; i < n; i++) { const k = i / (n - 1); const col = new THREE.Color(o.side || '#7a2a10').lerp(new THREE.Color(o.face || '#fff2d8'), i === n - 1 ? 1 : k * .35);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, alphaTest: .35, side: THREE.DoubleSide, fog: false }));
      m.position.z = i * (o.depth || .012) * w; grp.add(m); }
    return grp; }
  const STAGE = { blob: 19.6, 938: 18.0, 1069: 16.88, 1306: 15.68, 1471: 12.88, 1611: 12.52, 1653: 11.58, 1697: 11.0, 1698: 10.4, 1757: 6, today: 6 };

  // ---------------------------------------------------------------- map3d
  const MAP = {};
  function buildMap() {
    const sc = new THREE.Scene(); sc.background = new THREE.Color('#0d2236'); sc.fog = new THREE.Fog('#0d2236', 14, 40);
    const sun = new THREE.DirectionalLight('#ffe2b8', 2.6); sun.position.set(-8, 14, 6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 60 }); sc.add(sun);
    sc.add(new THREE.HemisphereLight('#9fc6ff', '#3a2a20', .9));
    // sea with a slow swell
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(80, 80, 120, 120), new THREE.MeshStandardMaterial({ color: '#2f86a8', roughness: .35, metalness: .15 })); sea.rotation.x = -Math.PI / 2; sea.position.y = -.02; sea.receiveShadow = true; sc.add(sea);
    const sand = new THREE.MeshStandardMaterial({ color: '#c9b98a', roughness: .95 });
    for (const k of ['CN', 'LA', 'KH', 'TH', 'MM']) if (GEO[k]) sc.add(slab(GEO[k], .08, sand, .02));
    const vn = GEO.VN;
    const mRed = new THREE.MeshStandardMaterial({ color: '#e0312b', roughness: .55, clippingPlanes: [] });
    const mCh = new THREE.MeshStandardMaterial({ color: '#2f9e8f', roughness: .7, clippingPlanes: [] });
    const mKh = new THREE.MeshStandardMaterial({ color: '#8d6cc0', roughness: .7, clippingPlanes: [] });
    const base = slab(vn, .12, new THREE.MeshStandardMaterial({ color: '#d9c48f', roughness: .9 }), .03); sc.add(base);
    const red = slab(vn, .55, mRed, .06), ch = slab(vn, .2, mCh, .04), kh = slab(vn, .2, mKh, .04); sc.add(red, ch, kh);
    // Trường Sơn: a ridge of peaks along the west
    const peakM = new THREE.MeshStandardMaterial({ color: '#6b5a46', roughness: 1, flatShading: true }), snowM = new THREE.MeshStandardMaterial({ color: '#f2efe6', roughness: 1, flatShading: true });
    [[103.9, 21.6], [104.5, 20.6], [105.0, 19.6], [105.6, 18.7], [106.2, 17.7], [106.9, 16.7], [107.4, 15.6], [107.8, 14.6], [108.0, 13.5], [107.9, 12.4]].forEach(([lo, la], i) => { for (let j = 0; j < 3; j++) { const h = .35 + ((i * 7 + j * 3) % 5) * .08; const c = new THREE.Mesh(new THREE.ConeGeometry(.22 + j * .03, h, 5), peakM); c.position.set(X(lo) + (j - 1) * .28, .55 + h / 2, Z(la) + (j - 1) * .15); c.castShadow = true; sc.add(c); const s = new THREE.Mesh(new THREE.ConeGeometry(.08 + j * .01, h * .3, 5), snowM); s.position.set(c.position.x, .55 + h - h * .15, c.position.z); sc.add(s); } });
    // Hoàng Sa & Trường Sa — always shown
    const isl = new THREE.MeshStandardMaterial({ color: '#e0312b', roughness: .5, emissive: '#5a0a08' });
    for (const [lo, la] of [[111.6, 16.5], [112.2, 16.8], [112.6, 16.3], [111.9, 16.0], [112.4, 15.9], [114.3, 10.4], [113.8, 9.6], [115.0, 9.9], [114.6, 8.9], [113.2, 8.6], [112.0, 8.7]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, .12, 10), isl); c.position.set(X(lo), .06, Z(la)); sc.add(c); }
    const cam = new THREE.PerspectiveCamera(38, W / H, .1, 200);
    Object.assign(MAP, { sc, sun, sea, red, ch, kh, mRed, mCh, mKh, cam, titles: {} });
  }
  function seaSwell(sea, t, amp = .02) { const p = sea.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, Math.sin(x * .9 + t * 1.2) * amp + Math.cos(y * .7 - t) * amp); } p.needsUpdate = true; sea.geometry.computeVertexNormals(); }

  MOMENTS.map3d = { dur: 8, capY: .8, sfx: [[0, 'map_whoosh']], render(lt, D, o) {
    if (!MAP.sc) buildMap(); const R = renderer(), V = H > W;
    const st = (o.stages || '938;|today;').split('|').map(s => { const [id, l] = s.split(';'); return { id: id.trim(), label: (l || '').trim() }; });
    const per = D / st.length, k = Math.min(st.length - 1, Math.floor(lt / per)), lk = lt - k * per, p = SMs(clamp(lk / 1.4));
    const latPrev = STAGE[st[Math.max(0, k - 1)].id] ?? 18, latCur = STAGE[st[k].id] ?? 18, lat = k ? lerp(latPrev, latCur, p) : latCur;
    const zF = Z(lat), zK = Z(11.1);
    // red: north of the front; Champa: between the front and the Khmer line; Khmer: south of both
    MAP.mRed.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, 0, -1), zF)];
    MAP.mCh.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, 0, 1), -zF), new THREE.Plane(new THREE.Vector3(0, 0, -1), zK)];
    MAP.mKh.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, 0, 1), -Math.max(zF, zK))];
    MAP.red.scale.y = 1 + .25 * Math.sin(Math.min(1, lk / .6) * Math.PI) * (k ? 1 : 0); // the new land "pops"
    seaSwell(MAP.sea, lt);
    // camera glides along the coast, looking at the frontier from the south-east, slightly orbiting
    const SP = [[22.5, 105.3], [21, 105.7], [19.4, 105.8], [18, 106.3], [16.7, 107.1], [15.6, 108.1], [14.2, 108.7], [12.9, 108.8], [11.9, 108.6], [11.1, 107.6], [10.6, 106.5], [10, 105.6], [9.2, 105.1]];
    const lonAt = la => { for (let i = 1; i < SP.length; i++) if (la <= SP[i - 1][0] && la >= SP[i][0]) return lerp(SP[i - 1][1], SP[i][1], (SP[i - 1][0] - la) / (SP[i - 1][0] - SP[i][0])); return la > 20 ? 105.4 : 105.2; };
    const fl = clamp(lat, 9.5, 21.5), focusLat = lerp(19.5, fl, .7), tx = X(lonAt(focusLat)), tz = Z(focusLat);
    const ang = .5 + Math.sin(lt * .18) * .08, dist = V ? 12.5 : 10.5;
    MAP.cam.aspect = W / H; MAP.cam.fov = V ? 50 : 36; MAP.cam.updateProjectionMatrix();
    MAP.cam.position.set(tx + Math.sin(ang) * dist * .7, dist * .95, tz + Math.cos(ang) * dist * .75); MAP.cam.lookAt(tx - .3, 0, tz - (V ? .6 : 0));
    // floating 3D year title above the frontier
    const yr = st[k].id === 'today' ? 'TODAY' : st[k].id === 'blob' ? '' : st[k].id;
    for (const key in MAP.titles) MAP.titles[key].visible = false;
    if (yr) { let t3 = MAP.titles[yr]; if (!t3) { t3 = MAP.titles[yr] = title3d(yr, { w: 5.2, side: '#5a1408', face: '#fff4dc', ls: 18 }); MAP.sc.add(t3); }
      t3.visible = true; const a = E.back ? E.back(clamp(lk / .5)) : 1; t3.scale.setScalar(Math.max(.001, a)); t3.position.set(tx - 1.6, 3.0 + Math.sin(lt * 1.4) * .08, tz - 2.6); t3.lookAt(MAP.cam.position); }
    R.render(MAP.sc, MAP.cam); ctx.drawImage(T3.cv, 0, 0, W, H);
    // art-directed 2D lettering on top: the stage name sits under the 3D year like a caption plate
    if (st[k].label) { const u = U(), a = clamp((lk - .4) / .5); ctx.save(); ctx.globalAlpha = a; ctx.font = `800 ${(V ? 40 : 34) * u}px ${FONT.display}`; ctx.textAlign = 'center'; ctx.letterSpacing = `${6 * u}px`;
      const tw = ctx.measureText(st[k].label.toUpperCase()).width + 50 * u, y = H * (V ? .3 : .26); ctx.fillStyle = 'rgba(10,16,30,.6)'; ctx.fillRect(W / 2 - tw / 2, y - 34 * u, tw, 60 * u); ctx.fillStyle = '#ffe1a8'; ctx.fillText(st[k].label.toUpperCase(), W / 2, y + 8 * u); ctx.restore(); }
  } };

  // ---------------------------------------------------------------- fleet3d
  const FL = {};
  function skyMat() { return new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { top: { value: new THREE.Color('#1c1440') }, mid: { value: new THREE.Color('#b3476e') }, low: { value: new THREE.Color('#ffb36a') }, sunDir: { value: new THREE.Vector3(0, .06, -1).normalize() } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 low; uniform vec3 sunDir; varying vec3 vP; void main(){ float h = vP.y; vec3 c = mix(low, mid, smoothstep(0.0, 0.18, h)); c = mix(c, top, smoothstep(0.18, 0.6, h)); float s = max(dot(vP, sunDir), 0.0); c += vec3(1.0,0.75,0.45) * pow(s, 24.0) * 0.9 + vec3(1.0,0.95,0.85) * pow(s, 900.0) * 4.0; gl_FragColor = vec4(c, 1.0); }' }); }
  function boat(s, dark) { const g = new THREE.Group(); const hullS = new THREE.Shape(); hullS.moveTo(-2.2, .5); hullS.quadraticCurveTo(-1.2, -.35, 0, -.4); hullS.quadraticCurveTo(1.4, -.35, 2.4, .6); hullS.lineTo(2.9, 1.3); hullS.lineTo(2.55, 1.35); hullS.lineTo(2.2, .75); hullS.lineTo(-2.0, .75); hullS.lineTo(-2.5, 1.1); hullS.closePath();
    const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(hullS, { depth: 1.1, bevelEnabled: true, bevelThickness: .08, bevelSize: .06, bevelSegments: 2 }), new THREE.MeshStandardMaterial({ color: dark, roughness: .8 })); hull.position.z = -.55; hull.castShadow = true; g.add(hull);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, .6, .9), new THREE.MeshStandardMaterial({ color: '#5a2a1c', roughness: .8 })); cabin.position.set(-.4, 1.05, 0); g.add(cabin); const roof = new THREE.Mesh(new THREE.ConeGeometry(.95, .45, 4), new THREE.MeshStandardMaterial({ color: '#7a1a12', roughness: .7 })); roof.rotation.y = Math.PI / 4; roof.position.set(-.4, 1.58, 0); roof.scale.set(1.2, 1, .8); g.add(roof);
    const sailM = new THREE.MeshStandardMaterial({ color: '#e9b26a', roughness: .9, side: THREE.DoubleSide, emissive: '#5a2a10', emissiveIntensity: .25 });
    for (const [x, h, w] of [[.5, 3.0, 1.7], [1.7, 2.3, 1.3]]) { const mast = new THREE.Mesh(new THREE.CylinderGeometry(.04, .05, h + .4, 6), new THREE.MeshStandardMaterial({ color: '#3a2214' })); mast.position.set(x, .75 + (h + .4) / 2, 0); g.add(mast);
      const sg = new THREE.PlaneGeometry(w, h, 6, 8); const sp = sg.attributes.position; for (let i = 0; i < sp.count; i++) sp.setZ(i, Math.sin((sp.getX(i) / w + .5) * Math.PI) * .25); sg.computeVertexNormals(); const sail = new THREE.Mesh(sg, sailM); sail.position.set(x + w / 2 - .05, .95 + h / 2, .05); sail.castShadow = true; g.add(sail);
      for (let r = 1; r < 5; r++) { const bat = new THREE.Mesh(new THREE.BoxGeometry(w, .03, .03), new THREE.MeshStandardMaterial({ color: '#3a2214' })); bat.position.set(x + w / 2, .95 + r * h / 5, .2); g.add(bat); } }
    const lanM = new THREE.MeshBasicMaterial({ color: '#ffcf7a' }); for (let i = 0; i < 6; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), lanM); l.position.set(-1.8 + i * .75, .95, .62); g.add(l); }
    const pl = new THREE.PointLight('#ffb35a', 2.2, 5, 2); pl.position.set(0, 1.2, .9); g.add(pl); g.scale.setScalar(s); return g; }
  function ridgeMesh(z, h, col, seed) { const g = new THREE.PlaneGeometry(120, h * 2, 160, 1); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); if (y > 0) p.setY(i, h * (.55 + .45 * Math.sin(x * .09 + seed) * Math.cos(x * .037 + seed * 2) + .15 * Math.sin(x * .41 + seed))); else p.setY(i, -2); } g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, fog: true })); m.position.set(0, 0, z); return m; }
  function buildFleet() {
    const sc = new THREE.Scene(); sc.fog = new THREE.Fog('#e88a6a', 18, 90);
    sc.add(new THREE.Mesh(new THREE.SphereGeometry(150, 32, 16), skyMat()));
    const sun = new THREE.DirectionalLight('#ffb070', 2.4); sun.position.set(0, 6, -60); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 120 }); sc.add(sun); sc.add(new THREE.HemisphereLight('#ff9e7a', '#3a2440', 1.5)); const rim = new THREE.DirectionalLight('#ffd0a0', 1.2); rim.position.set(12, 5, 10); sc.add(rim);
    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(4.5, 48), new THREE.MeshBasicMaterial({ color: '#fff1cf', fog: false })); sunDisc.position.set(6, 3.2, -120); sc.add(sunDisc);
    [[-95, 12, '#a7496e', 1], [-75, 9, '#7c2f5e', 2], [-58, 6.5, '#55204f', 3], [-44, 4.5, '#3a1838', 4]].forEach(([z, h, c, s]) => sc.add(ridgeMesh(z, h, c, s)));
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(160, 160, 160, 160), new THREE.MeshStandardMaterial({ color: '#5a2a4a', roughness: .18, metalness: .55 })); sea.rotation.x = -Math.PI / 2; sea.receiveShadow = true; sc.add(sea);
    // sun glitter path: a strip of additive sparkles
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(6, 120), new THREE.MeshBasicMaterial({ color: '#ffb36a', transparent: true, opacity: .35, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); gl.rotation.x = -Math.PI / 2; gl.position.set(5, .05, -60); sc.add(gl);
    const boats = [boat(1, '#24121c'), boat(.7, '#2a1420'), boat(.6, '#2a1420')]; boats[0].position.set(0, 0, 0); boats[1].position.set(-7, 0, -9); boats[2].position.set(7.5, 0, -13); boats.forEach(b => { b.rotation.y = -Math.PI / 2 + .25; sc.add(b); });
    const t3 = title3d('1306', { w: 30, side: '#6a1a10', face: '#fff1d6', ls: 40, layers: 30 }); t3.position.set(0, 8.5, -22); sc.add(t3);
    const cam = new THREE.PerspectiveCamera(40, W / H, .1, 400); Object.assign(FL, { sc, sea, boats, cam, t3 });
  }
  MOMENTS.fleet3d = { dur: 8, capY: .8, sfx: [[0, 'whoosh'], [1.5, 'choir']], render(lt, D, o) {
    if (!FL.sc) buildFleet(); const R = renderer(), V = H > W;
    const p = FL.sea.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, Math.sin(x * .35 + lt * 1.3) * .18 + Math.sin(y * .5 - lt * 1.7 + x * .2) * .12 + Math.sin(x * 1.3 + y * 1.1 + lt * 2.4) * .04); } p.needsUpdate = true; FL.sea.geometry.computeVertexNormals();
    FL.boats.forEach((b, i) => { b.position.y = Math.sin(lt * 1.3 + i) * .12 + .05; b.rotation.z = Math.sin(lt * 1.1 + i * 2) * .04; b.rotation.x = Math.sin(lt * .9 + i) * .03; b.position.x += 0; });
    const q = SMs(clamp(lt / D)); FL.cam.aspect = W / H; FL.cam.fov = V ? 58 : 40; FL.cam.updateProjectionMatrix();
    // skim low past the lead boat, then crane up and back to reveal the fleet and the title
    FL.cam.position.set(lerp(7.5, -2.5, q), lerp(1.8, 4.5, q * q), lerp(8.5, 14, q)); FL.cam.lookAt(lerp(.5, 0, q), lerp(1.8, 3.6, q), lerp(-3, -9, q));
    FL.t3.lookAt(FL.cam.position); const a = E.back ? E.back(clamp((lt - 1.2) / .7)) : 1; FL.t3.scale.setScalar(Math.max(.001, a));
    R.render(FL.sc, FL.cam); ctx.drawImage(T3.cv, 0, 0, W, H);
    const u = U(), b = clamp((lt - 2.2) / .6); if (b > 0) { ctx.save(); ctx.globalAlpha = b; ctx.font = `700 ${(V ? 34 : 30) * u}px ${FONT.display}`; ctx.textAlign = 'center'; ctx.letterSpacing = `${10 * u}px`; ctx.fillStyle = '#ffe2bd'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 12 * u; ctx.fillText('THE WEDDING FLEET SAILS SOUTH', W / 2, H * (V ? .2 : .14)); ctx.restore(); }
    const lbH = V ? H * .06 : H * .09; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, lbH); ctx.fillRect(0, H - lbH, W, lbH);
  } };
})();
