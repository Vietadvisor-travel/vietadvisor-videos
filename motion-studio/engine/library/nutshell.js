/* "Nutshell" look — science-explainer style in the spirit of Kurzgesagt (our own art, not a copy):
   flat vector shapes with no outlines, saturated complementary palettes on deep backgrounds, soft glows and rim light,
   floating particles, slow continuous motion. Use for big-picture explainers (geography, climate, scale, "how it works").
   charstyle: nutshell        → round, outline-free characters with simple dot eyes and a rim highlight
   look: grade=nutshell       → deep contrast, rich saturation, strong bloom, cool shadows
   places: cosmos · nutshell_lab · orbit (Earth from orbit, Southeast Asia lit)
   Rules: one hero colour per scene against a dark complementary ground; every element breathes (drift / bob / twinkle). */
(function () {
  if (typeof CHAR_STYLES !== 'undefined') {
    CHAR_STYLES.nutshell = { head: .96, leg: .78, torso: .92, tw: 1.08, limb: 1.0, arm: .96, lw: .0001, faceLw: .55, ink: '#141a33', eye: 'dot', nose: 'none', blush: .25, hi: 1.1, sh: .55, pal: 'cosmic', face: 'oval', label: 'science-explainer: round, outline-free, dot eyes, rim light, saturated' };
    if (typeof PAL !== 'undefined') PAL.cosmic = c => { const [h, s, l] = hexToHsl(c); return hslToHex(h, Math.min(1, s * 1.25 + .06), clamp(l * 1.02 + .02, 0, .9)); };
  }
  if (typeof GRADE_GL !== 'undefined') GRADE_GL.nutshell = { sat: 1.2, con: 1.1, lift: .0, gam: 1.0, gain: 1.02, sh: [-.015, .0, .05], hi: [.02, .02, .03], bloom: .55, hal: .12 };
  if (typeof GRADES !== 'undefined') GRADES.nutshell = { sat: 1.2, con: 1.1, bri: 1.0, tint: '#5a6cff', tintA: .05, bloom: .3 };

  const glow = (x, y, r, col, a = 1) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); };
  const grad = (stops, y0 = 0, y1 = H) => { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  function stars(t, n, col = '#ffffff', u = U()) { for (let i = 0; i < n; i++) { const x = hash(i * 3.1) * W, y = hash(i * 7.7) * H * .9, tw = .45 + .55 * Math.sin(t * (1 + hash(i) * 2) + i); const r = (hash(i * 1.3) * 2.2 + .8) * u; ctx.save(); ctx.globalAlpha = .35 + .65 * tw * hash(i * 2.9); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); if (hash(i * 5.5) > .93) glow(x, y, 14 * u, 'rgba(180,200,255,.6)', tw); } }
  function motes(t, n, col, u = U()) { for (let i = 0; i < n; i++) { const ph = (t * .03 * (.5 + hash(i)) + hash(i * 9)) % 1, x = (hash(i * 4.4) * W + Math.sin(t * .4 + i) * 20 * u), y = H * (1 - ph); ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI) * .5; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, (2 + hash(i) * 4) * u, 0, TAU); ctx.fill(); ctx.restore(); } }
  // a planet: flat disc + terminator shadow + rim light + atmosphere glow
  function planet(x, y, r, base, dark, rim, t, rings) { glow(x, y, r * 1.6, rim.replace(')', ',.35)').replace('rgb', 'rgba'), 1);
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = base; ctx.fill(); ctx.clip();
    for (let k = 0; k < 5; k++) { ctx.fillStyle = k % 2 ? dark : base; ctx.globalAlpha = .35; ctx.fillRect(x - r, y - r + (k + .3 + Math.sin(t * .2 + k) * .05) * r * .4, r * 2, r * .12); }
    ctx.globalAlpha = .55; ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(x + r * .45, y + r * .35, r * 1.05, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, Math.PI * .95, Math.PI * 1.65); ctx.lineWidth = r * .05; ctx.strokeStyle = rim; ctx.globalAlpha = .9; ctx.stroke(); ctx.restore();
    if (rings) { ctx.save(); ctx.translate(x, y); ctx.rotate(-.35); ctx.scale(1, .28); ctx.beginPath(); ctx.arc(0, 0, r * 1.7, 0, TAU); ctx.lineWidth = r * .14; ctx.strokeStyle = rim; ctx.globalAlpha = .45; ctx.stroke(); ctx.restore(); } }

  defPlace('cosmos', 'Nutshell — deep space', 'Navy-to-violet space, twinkling stars, a glowing ringed planet with rim light, drifting motes. For scale, origins, big questions.', 120, (t, o) => {
    const u = U(); grad(['#0b0f2e', '#1d1452', '#3a1a5e']); stars(t, 140); glow(W * .78, H * .2, 420 * u, 'rgba(255,90,160,.28)'); glow(W * .15, H * .7, 380 * u, 'rgba(60,140,255,.25)');
    planet(W * .74, H * .3, 150 * u, '#ff7a59', '#b2365f', 'rgb(255,214,150)', t, true); planet(W * .2, H * .18, 46 * u, '#5fd3c8', '#2a6f9e', 'rgb(200,255,250)', t);
    motes(t, 26, '#9fb8ff'); const gy = HB() - 120 * u; ctx.save(); ctx.globalAlpha = .9; const g = ctx.createLinearGradient(0, gy, 0, H); g.addColorStop(0, '#2b1f6b'); g.addColorStop(1, '#120d33'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, gy + 30 * u); ctx.quadraticCurveTo(W / 2, gy - 50 * u, W, gy + 30 * u); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill(); ctx.restore();
    ctx.save(); ctx.strokeStyle = 'rgba(160,190,255,.5)'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(0, gy + 30 * u); ctx.quadraticCurveTo(W / 2, gy - 50 * u, W, gy + 30 * u); ctx.stroke(); ctx.restore();
  });

  defPlace('nutshell_lab', 'Nutshell — soft gradient stage', 'Teal-to-indigo gradient with floating hexagons and glows: a clean stage for characters, diagrams and numbers.', 110, (t, o) => {
    const u = U(); grad(['#0f6e8c', '#1b3f8f', '#2a1f6e']); glow(W * .5, H * .38, 520 * u, 'rgba(120,255,230,.22)');
    for (let i = 0; i < 18; i++) { const x = hash(i * 2.3) * W, y = (hash(i * 6.1) * H + t * (6 + hash(i) * 10) * u) % H, r = (18 + hash(i * 3) * 46) * u, rot = t * .1 * (hash(i) - .5) + i;
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = .1 + hash(i * 8) * .12; ctx.fillStyle = i % 3 ? '#8ff0ff' : '#ffd36b'; ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k * TAU / 6; k ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); }
    motes(t, 20, '#c8fff6'); const gy = HB() - 110 * u; ctx.save(); ctx.fillStyle = 'rgba(10,20,60,.45)'; ctx.fillRect(0, gy, W, H - gy); ctx.restore(); line(0, gy, W, gy, 3 * u, 'rgba(160,255,240,.6)');
  });

  defPlace('orbit', 'Nutshell — Earth from orbit', 'Night-side Earth curving across the bottom with an atmosphere glow, city lights, stars above. Openers about countries and journeys.', 140, (t, o) => {
    const u = U(); grad(['#050818', '#0c1638', '#13265a']); stars(t, 120); const R = Math.max(W, H) * 1.25, cx = W / 2, cy = HB() + R - 240 * u;
    glow(cx, cy - R, 600 * u, 'rgba(90,170,255,.35)'); ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); const g = ctx.createRadialGradient(cx, cy - R * .9, R * .2, cx, cy, R); g.addColorStop(0, '#1d5fa8'); g.addColorStop(1, '#0a2244'); ctx.fillStyle = g; ctx.fill(); ctx.clip();
    for (let i = 0; i < 60; i++) { const a = -Math.PI / 2 + (hash(i * 3.3) - .5) * .5, d = R - (20 + hash(i * 7.1) * 220) * u, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; ctx.globalAlpha = .5 + .5 * Math.sin(t * 2 + i); ctx.fillStyle = '#ffd98a'; ctx.beginPath(); ctx.arc(x, y, (1.5 + hash(i) * 2.5) * u, 0, TAU); ctx.fill(); }
    ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R + 6 * u, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 16 * u; ctx.strokeStyle = 'rgba(120,200,255,.55)'; ctx.shadowColor = 'rgba(120,200,255,.9)'; ctx.shadowBlur = 40 * u; ctx.stroke(); ctx.restore();
  });
})();
