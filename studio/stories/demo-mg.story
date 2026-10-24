title: demo · motion-graphics world (three.js) · ep. 4 opening lines 1–3
channel: poisonpill
look: luxury
tone: playful
voice: am_michael*.7+bm_george*.3
delivery: tense
music: auto
captions: off
autotrans: off
endcard: off

#! scene arena_world
({ t, at, W, H, u, clip, ctx, clamp, lerp, text, dur }) => {
  // A designed 3D world is the picture; footage only lives inside it (a jumbotron). Everything is a function of t, so
  // parallel render pages agree frame for frame. Words drive every change (motion-doctrine §0).
  const T3 = window.THREE; if (!T3) return;
  const K = w => at(w), sm = x => x * x * (3 - 2 * x), io = (a, b) => sm(clamp((t - a) / Math.max(.01, b - a)));
  const S = window.__arena || (window.__arena = (() => {
    const cv = document.createElement('canvas'), r = new T3.WebGLRenderer({ canvas: cv, antialias: false, preserveDrawingBuffer: true });
    r.setPixelRatio(1); r.outputColorSpace = T3.SRGBColorSpace; r.toneMapping = T3.ACESFilmicToneMapping; r.toneMappingExposure = 1.4;
    const scene = new T3.Scene(); scene.background = new T3.Color('#05060a'); scene.fog = new T3.FogExp2('#05060a', .018);
    const cam = new T3.PerspectiveCamera(42, 16 / 9, .1, 400);
    const R = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
    // seats: 30 elliptical tiers rising away from a round stage
    const seats = []; for (let row = 0; row < 30; row++) { const rr = 11 + row * .62, n = Math.floor(2 * Math.PI * rr * 1.15 / .55);
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; if (Math.abs(Math.sin(a / 2)) < .07) continue; seats.push([Math.cos(a) * rr * 1.25, 1 + row * .42, Math.sin(a) * rr, a, row, R(seats.length)]); } }
    const N = seats.length, pos = new Float32Array(N * 3), colA = new Float32Array(N * 3), g = new T3.BufferGeometry();
    g.setAttribute('position', new T3.BufferAttribute(pos, 3)); g.setAttribute('color', new T3.BufferAttribute(colA, 3));
    const sp = document.createElement('canvas'); sp.width = sp.height = 64; const sg = sp.getContext('2d'), gr = sg.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); sg.fillStyle = gr; sg.fillRect(0, 0, 64, 64);
    const dot = new T3.CanvasTexture(sp); const pts = new T3.Points(g, new T3.PointsMaterial({ size: .62, map: dot, vertexColors: true, transparent: true, depthWrite: false, blending: T3.AdditiveBlending }));
    scene.add(pts);
    // stage: a glowing ring floor + spectrum bars around it
    const stage = new T3.Mesh(new T3.CylinderGeometry(7, 7, .4, 96), new T3.MeshStandardMaterial({ color: '#15110c', metalness: .6, roughness: .35, emissive: '#3a2a10', emissiveIntensity: .2 })); stage.position.y = .2; scene.add(stage);
    const ringM = new T3.MeshBasicMaterial({ color: '#e8c77e', transparent: true, opacity: .9 }); const ring = new T3.Mesh(new T3.TorusGeometry(7.05, .06, 8, 160), ringM); ring.rotation.x = Math.PI / 2; ring.position.y = .42; scene.add(ring);
    const bars = new T3.InstancedMesh(new T3.BoxGeometry(.32, 1, .32), new T3.MeshBasicMaterial({ color: '#e8c77e', transparent: true, opacity: .85, blending: T3.AdditiveBlending, depthWrite: false }), 96); scene.add(bars);
    // coins
    const coins = new T3.InstancedMesh(new T3.CylinderGeometry(.32, .32, .06, 28), new T3.MeshStandardMaterial({ color: '#f2c14e', metalness: .85, roughness: .3, emissive: '#b07a1a', emissiveIntensity: .9 }), 260); scene.add(coins);
    const coinSrc = [...Array(260)].map((_, k) => seats[Math.floor(R(k + 900) * N)]);
    // recruitment network: from one seat, branching through the stands (3 children each, 4 generations)
    const net = [], root = seats.findIndex(s => s[4] === 8 && Math.abs(s[3] - 2.3) < .05); const near = (s, k) => { let best = 0, bd = 1e9; for (let j = 0; j < N; j += 7) { const q = seats[j], d = Math.abs(Math.hypot(q[0] - s[0], q[2] - s[2]) - 4.5 - R(k) * 3) + Math.abs(q[4] - s[4] - (R(k + 1) * 6 - 2)) * .6 + (R(j + k) * 2); if (d < bd) { bd = d; best = j; } } return best; };
    const gen = [[root]]; for (let gI = 1; gI < 5; gI++) { gen.push([]); gen[gI - 1].forEach((pIdx, k) => { for (let c = 0; c < 3; c++) { const ch = near(seats[pIdx], pIdx + c * 17 + gI * 101); gen[gI].push(ch); net.push([pIdx, ch, gI]); } }); }
    const lg = new T3.BufferGeometry(), lp = new Float32Array(net.length * 6); net.forEach(([a, b], k) => { lp.set([seats[a][0], seats[a][1], seats[a][2], seats[b][0], seats[b][1], seats[b][2]], k * 6); });
    lg.setAttribute('position', new T3.BufferAttribute(lp, 3)); const lines = new T3.LineSegments(lg, new T3.LineBasicMaterial({ color: '#ffd98a', transparent: true, opacity: 1, blending: T3.AdditiveBlending, linewidth: 2 })); scene.add(lines);
    // the light cone and the jumbotron (the only place footage lives)
    const cg = document.createElement('canvas'); cg.width = 4; cg.height = 256; const cgc = cg.getContext('2d'), lgd = cgc.createLinearGradient(0, 0, 0, 256); lgd.addColorStop(0, 'rgba(255,240,200,0)'); lgd.addColorStop(1, 'rgba(255,240,200,1)'); cgc.fillStyle = lgd; cgc.fillRect(0, 0, 4, 256);
    const cone = new T3.Mesh(new T3.ConeGeometry(5.5, 34, 64, 1, true), new T3.MeshBasicMaterial({ color: '#fff0c8', alphaMap: new T3.CanvasTexture(cg), transparent: true, opacity: 0, blending: T3.AdditiveBlending, depthWrite: false, side: T3.DoubleSide })); cone.position.y = 17; scene.add(cone);
    const jc = document.createElement('canvas'); jc.width = 640; jc.height = 360; const jt = new T3.CanvasTexture(jc); jt.colorSpace = T3.SRGBColorSpace;
    const jumbo = new T3.Mesh(new T3.PlaneGeometry(12.8, 7.2), new T3.MeshBasicMaterial({ map: jt, transparent: true, opacity: 0 })); jumbo.position.set(0, 14, -4); scene.add(jumbo);
    const frame = new T3.Mesh(new T3.PlaneGeometry(13.4, 7.8), new T3.MeshBasicMaterial({ color: '#e8c77e', transparent: true, opacity: 0 })); frame.position.set(0, 14, -4.05); scene.add(frame);
    const spot = new T3.SpotLight('#ffe6b0', 0, 60, .35, .6); spot.position.set(0, 30, 0); spot.target.position.set(0, 0, 0); scene.add(spot, spot.target);
    scene.add(new T3.AmbientLight('#8090b0', .35)); const key = new T3.DirectionalLight('#ffd9a0', 1.2); key.position.set(10, 20, 10); scene.add(key);
    return { r, cv, scene, cam, seats, N, pos, colA, g, bars, coins, coinSrc, net, lines, lg, cone, jumbo, frame, jc, jt, spot, ringM, R, dummy: new T3.Object3D() };
  })());
  const { r, cv, scene, cam, seats, N, pos, colA, g, bars, coins, coinSrc, net, lines, lg, cone, jumbo, frame, jc, jt, spot, ringM, R, dummy } = S;
  const sc = window.PP3D_SCALE || .62; if (cv.width !== Math.round(W * sc)) r.setSize(Math.round(W * sc), Math.round(H * sc), false);

  const tPack = K('Packed'), tDark = K('Dark'), tWait = K('Waiting'), tSeats = K('seats'), tSav = K('savings'), tFam = K('families'), tMus = K('music'), tGown = K('gown'), tLight = K('light'), tFeet = K('feet');
  // seats: fill on "Packed" (a wave around the bowl), dim on "Dark", a heartbeat on "Waiting", stand on "feet"
  const fill = t => clamp((t - tPack) / 1.6), dark = io(tDark - .1, tDark + .7), beat = t > tWait ? Math.pow(Math.max(0, Math.sin((t - tWait) * Math.PI * 1.6)), 8) * (1 - io(tSeats, tSeats + 1)) : 0;
  const stand = io(tFeet - .1, tFeet + 1.1);
  for (let i = 0; i < N; i++) { const s = seats[i], on = clamp((fill(t) * 1.25 - ((s[3] / (Math.PI * 2) + s[4] * .01) % 1)) * 4), jump = stand * (.6 + .5 * Math.sin(t * 9 + s[5] * 20)) * clamp(stand * 3 - s[5]);
    pos[i * 3] = s[0]; pos[i * 3 + 1] = s[1] + jump * .9; pos[i * 3 + 2] = s[2];
    const phone = s[5] < .12 ? 1 : 0, lit = .16 + on * (1 - dark * .92) + dark * phone * .9 + beat * .5 + stand * .9, warm = .55 + .45 * s[5];
    colA[i * 3] = lit * (.95 * warm + .15); colA[i * 3 + 1] = lit * (.78 * warm + .12); colA[i * 3 + 2] = lit * (.5 * warm + .2 + phone * dark * .5); }
  g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
  // network spreads generation by generation from "savings" through "families"
  const spread = io(tSav + .3, tFam + 2.2) * 5; lg.setDrawRange(0, net.filter(n => n[2] <= spread).length * 2); lines.material.opacity = .95 * (1 - io(tMus, tMus + 1.5));
  // coins: on "savings" they leave the seats and arc down into the stage, spinning
  for (let k = 0; k < coins.count; k++) { const s = coinSrc[k], st = tSav + R(k + 3) * 3.2, q = clamp((t - st) / 2.4);
    if (q <= 0 || q >= 1) { dummy.scale.setScalar(0); } else { const e = sm(q); dummy.position.set(lerp(s[0], 0, e), lerp(s[1], .8, e) + Math.sin(e * Math.PI) * 6, lerp(s[2], 0, e)); dummy.rotation.set(t * 4 + k, t * 3, 0); dummy.scale.setScalar(1.4 * (1 - .4 * e)); }
    dummy.updateMatrix(); coins.setMatrixAt(k, dummy.matrix); } coins.instanceMatrix.needsUpdate = true;
  // music: a spectrum ring rises around the stage, swelling
  const swell = io(tMus - .2, tMus + 1.5) * (1 - .4 * io(tFeet + 1.5, tFeet + 3));
  for (let k = 0; k < 96; k++) { const a = k / 96 * Math.PI * 2, v = swell * (1.2 + 2.6 * Math.abs(Math.sin(t * 5.3 + k * .7) * Math.sin(t * 2.1 + k * .23))); dummy.position.set(Math.cos(a) * 8.2, v / 2 + .4, Math.sin(a) * 8.2); dummy.rotation.set(0, -a, 0); dummy.scale.set(1, Math.max(.001, v), 1); dummy.updateMatrix(); bars.setMatrixAt(k, dummy.matrix); }
  bars.instanceMatrix.needsUpdate = true; ringM.opacity = .35 + .6 * (1 - dark * .6) + .3 * swell;
  // the light falls on "light"; the jumbotron wakes on "gown" with the real FBI footage of her walk-on
  const beam = io(tLight - .3, tLight + .5); cone.material.opacity = .32 * beam; spot.intensity = 600 * beam;
  const jOn = io(tGown - .4, tGown + .6); jumbo.material.opacity = jOn; frame.material.opacity = jOn * .9;
  if (jOn > 0) { const im = clip('onecoin_clip_ruja_stage', tGown - 1, 1), jx = jc.getContext('2d'); jx.fillStyle = '#000'; jx.fillRect(0, 0, 640, 360); if (im) { const s2 = Math.max(640 / im.width, 360 / im.height); jx.drawImage(im, (640 - im.width * s2) / 2, (360 - im.height * s2) / 2, im.width * s2, im.height * s2); } jt.needsUpdate = true; }
  // the camera: one continuous flight. high orbit → descend → dive to the first seat → ride the network → swing to the jumbotron → pull back wide
  const keys = [[0, [48, 40, 46], [0, 4, 0]], [tPack, [40, 30, 38], [0, 4, 0]], [tWait + .6, [34, 22, 36], [0, 6, 0]], [tSeats + .4, [-4, 17, 14], [-14, 5, 14]],
    [tFam, [-6, 24, 26], [-10, 6, 8]], [tMus + .3, [0, 9, 26], [0, 2, 0]], [tGown + .8, [0, 13, 15], [0, 13.5, -4]], [tLight + 1, [0, 12, 19], [0, 11, -4]], [tFeet + .3, [0, 18, 34], [0, 9, 0]], [tFeet + 3, [46, 44, 52], [0, 4, 0]], [1e4, [50, 46, 56], [0, 4, 0]]];
  let k0 = 0; while (k0 < keys.length - 2 && t > keys[k0 + 1][0]) k0++; const A = keys[k0], B = keys[k0 + 1], q = sm(clamp((t - A[0]) / Math.max(.01, B[0] - A[0])));
  const ang = t * .05; const P = A[1].map((v, i) => lerp(v, B[1][i], q)), Tg = A[2].map((v, i) => lerp(v, B[2][i], q));
  cam.position.set(P[0] * Math.cos(ang) - P[2] * Math.sin(ang), P[1], P[0] * Math.sin(ang) + P[2] * Math.cos(ang)); cam.lookAt(Tg[0] * Math.cos(ang) - Tg[2] * Math.sin(ang), Tg[1], Tg[0] * Math.sin(ang) + Tg[2] * Math.cos(ang));
  jumbo.lookAt(cam.position); frame.quaternion.copy(jumbo.quaternion); frame.position.copy(jumbo.position).add(new T3.Vector3(0, 0, -.05).applyQuaternion(jumbo.quaternion));
  r.render(scene, cam); ctx.drawImage(cv, 0, 0, W, H);
  const lab = io(K('London') - .2, K('London') + .4) * (1 - io(tPack + .6, tPack + 1.2));
  if (lab > 0) text('WEMBLEY ARENA · LONDON · 11 JUNE 2016', W * .5, H * .12, { size: 34 * u, font: 'cond', weight: 700, col: '#e8c77e', a: lab, lw: 0, ls: 6 * u });
}
#! end

# cine act=hook fx="code:arena_world"
Picture an arena in London. Packed. Dark. Waiting.
Out in the seats are people who have put their savings into a new kind of money, and talked their families into it too.
Then the music swells, a woman in a red ball gown walks into the light, and the whole room gets to its feet.
