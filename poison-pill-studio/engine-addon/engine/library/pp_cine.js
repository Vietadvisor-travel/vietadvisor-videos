/* =====================================================================
   POISON PILL — cinematic documentary layer (Oct 2026)
   "Why great companies rise, and why they fall."

   One beat does the heavy lifting:  # cine
   Every shot = 3 depth planes + type designed into the frame + events locked to WORDS.
     BG   blurred, darkened, toned context plate (or a procedural set: navy, paper, news, chart, black, spot)
     MID  the subject: cut-out photos, BW / duotone, white border, on the thirds, own parallax
     FG   symbolic objects (cash, pill, doc, phone, coins, photo cut-outs) in the bottom band, fastest parallax
     TYPE hero (1–3 words, slam) + support line (gold) — max 8 words on screen besides the caption
     FX   stamps, strikes, bubbles, headlines, charts, counters, shatter, burn, flashes — each fires on a word

   Syntax (inside a .story with header `channel: poisonpill`):
   # cine act=rise bg=hollywood bgBlur=10 cam=push
     mid="katzenberg;x:.28;h:.62;tone:bw;at:legends;lab:JEFFREY KATZENBERG|whitman;x:.74;h:.6;at:legends+.25;lab:MEG WHITMAN"
     fg="@cash;x:.5;y:.93;h:.2;at:billion"
     hero="$1.75B;at:billion;fx:count"  sup="ON A CRAZY IDEA;at:crazy"
     fx="flash:gold;at:billion|stamp:BET;at:bet;x:.8;y:.25"
   In twenty twenty, two Hollywood legends bet one point seven five billion dollars on a crazy idea.

   at: a word of the captions (first match; "word#2" = 2nd occurrence; "+.3" offset), "c2" (2nd caption start) or seconds.
   ===================================================================== */
'use strict';
(function () {
  const PP = window.PP = { navy: '#101c2e', navy2: '#0a1220', gold: '#c9a227', gold2: '#e8c766', paper: '#f5f1e8', paper2: '#e6dcc6', red: '#c0392b', teal: '#2a6b5e', ink: '#0b0f17', grey: '#8c8c8c', white: '#fbf8f1' };
  const ACT = { // colour script per act: grade overlay + accent + default bg
    setup: { tint: '#d9a35a', op: 'soft-light', a: .22, acc: PP.gold, sat: 0, bg: 'navy' },
    rise: { tint: PP.gold, op: 'soft-light', a: .34, acc: PP.gold, sat: 0, bg: 'navy', glow: 1 },
    doubt: { tint: PP.teal, op: 'color', a: .32, acc: '#9fc9bd', sat: .25, bg: 'navy' },
    fall: { tint: PP.red, op: 'soft-light', a: .18, acc: PP.red, sat: .45, bg: 'black', red: 1 },
    after: { tint: PP.navy, op: 'multiply', a: .35, acc: PP.paper2, sat: .75, bg: 'navy' },
    flash: { tint: PP.teal, op: 'multiply', a: .42, acc: PP.ink, sat: .55, bg: 'paper', sepia: 1, light: 1 }, // flashback
    lesson: { tint: PP.navy, op: 'multiply', a: .25, acc: PP.gold, sat: .5, bg: 'spot' },
    thumb: { tint: '#000000', op: 'soft-light', a: 0, acc: PP.gold2, sat: 0, bg: 'navy', glow: 1 } }; // thumb = thumbnails only: full colour, no grade
  // LOOK — v4 default is BRIGHT (daylight editorial: cream paper, colour photos, ink type). Header `look: noir` = the v3 dark style.
  const LOOK = { bright: true, name: 'dossier', cur: null }; const LOOKS = {}; const DARK = {}; Object.keys(ACT).forEach(k => DARK[k] = { ...ACT[k] });
  const BRIGHT = { setup: { tint: '#b98a4a', op: 'multiply', a: .10, acc: '#14213d', sup: '#a8741a', sat: 0, bg: 'cream' },
    rise: { tint: '#c99a3a', op: 'multiply', a: .10, acc: '#c98a0b', sup: '#14213d', sat: 0, bg: 'cream', glow: 0 },
    doubt: { tint: '#6f9a8e', op: 'multiply', a: .14, acc: '#1f6f5f', sup: '#14213d', sat: .12, bg: 'news' },
    fall: { tint: '#b5523f', op: 'multiply', a: .14, acc: PP.red, sup: '#14213d', sat: .3, bg: 'cream', red: 1 },
    after: { tint: '#8e98a6', op: 'multiply', a: .16, acc: '#14213d', sup: '#5b6b80', sat: .35, bg: 'cream' },
    flash: { tint: '#e9d6a8', op: 'multiply', a: .22, acc: PP.ink, sup: '#7a5a10', sat: .55, bg: 'paper', sepia: 1, light: 1 },
    lesson: { tint: '#a8875a', op: 'multiply', a: .10, acc: '#14213d', sup: '#a8741a', sat: .15, bg: 'spot' },
    thumb: { tint: '#000000', op: 'soft-light', a: 0, acc: '#c98a0b', sup: '#14213d', sat: 0, bg: 'cream' } };
  const RED0 = PP.red;
  LOOKS.dossier = { name: 'dossier', family: 'light', dossier: 1, gold: ['#b8860b', '#8a6200'], red: RED0, ink: '#14213d', stroke: '#fffaf0', acts: BRIGHT,
    plate: { blend: 'multiply', alpha: .78, wash: 'rgba(214,190,145,.16)', tone: 'warm', blur: 6, dim: 0, toneBy: { flash: 'sepia', doubt: 'cool', after: 'cool' } }, mid: { tone: 'aged', fall: 'bw', after: 'bw', flash: 'sepia' },
    vig: { col: '70,45,15', a: .2, red: '120,30,20', ra: .32 }, three: null };
  LOOKS.noir = { name: 'noir', family: 'dark', noir: 1, gold: [PP.gold, PP.gold2], red: RED0, ink: PP.paper, acts: DARK,
    plate: { blend: 'source-over', alpha: 1, wash: 'rgba(8,14,26,.35)', tone: 'navy', blur: 10, dim: .45, toneBy: { rise: 'gold', doubt: 'teal', flash: 'teal', fall: 'red' } }, mid: { tone: 'bw', flash: 'teal' },
    vig: { col: '0,0,0', a: .42, red: '0,0,0', ra: .55 }, three: { bg: '#0c1424', key: '#bcd2ff', amt: .55 } };
  let EPLOOK = LOOKS.dossier;
  function useLook(L) { L = L || LOOKS.dossier; LOOK.cur = L; LOOK.name = L.name; LOOK.bright = L.family === 'light'; [PP.gold, PP.gold2] = L.gold; PP.red = L.red || RED0; }
  function setLook(x) { const L = typeof x === 'string' ? LOOKS[x] : x === false ? LOOKS.noir : x === true ? LOOKS.dossier : x; EPLOOK = L || LOOKS.dossier; useLook(EPLOOK); Object.keys(ACT).forEach(k => { ACT[k] = EPLOOK.acts[k] || EPLOOK.acts.setup; }); }
  // THEME: the ink/card palette the set pieces & modes draw with, so diagrams stay legible on every look
  function THEME() { const L = LOOK.cur || LOOKS.dossier; if (L.dossier) return { ink: '#14213d', card: '#f6efdf', cream: '#efe5d0', sh: 'rgba(40,25,10,.38)', red: '#c0392b', dark: 0 };
    if (L.family === 'light') return { ink: L.ink, card: L.stroke || '#ffffff', cream: (L.bg.base.chart || L.bg.base.cream)[0], sh: 'rgba(20,20,30,.28)', red: L.red, dark: 0 };
    const b = L.bg ? L.bg.base : null; return { ink: L.ink || '#eef2f8', card: b ? b.spot[0] : '#1a2436', cream: b ? b.chart[0] : '#141d2c', sh: 'rgba(0,0,0,.55)', red: L.red || '#e5484d', dark: 1 }; }
  // ---------------------------------------------------------------- v5 FINISH: one grade, one light, one grain over EVERY frame
  // (photos, diagrams, 3D, AI fills…) — the glue that makes mixed media read as one film. Per look: L.finish overrides.
  // cost-tuned for CPU rendering (~15 ms/frame at 1080p): a 'lighten' fill + two cached full-frame overlays drawn source-over
  const FIN = { light: { lift: '#2a2219', liftA: .5, gain: '255,226,184', keyA: .12, edge: '60,40,20', edgeA: .1, grain: .05 }, dark: { lift: '#0e1622', liftA: .55, gain: '200,220,255', keyA: .08, edge: '0,0,0', edgeA: .12, grain: .07 } };
  const FINC = {}; function finLight(F, key) { const k = key + W + 'x' + H; if (FINC[k]) return FINC[k]; const c = mkCanvas(W, H), g = c.getContext('2d'); const kx = W * .18, ky = H * .08;
    const gr = g.createRadialGradient(kx, ky, 0, kx, ky, Math.hypot(W, H) * .75); gr.addColorStop(0, `rgba(${F.gain},${F.keyA})`); gr.addColorStop(.55, `rgba(${F.gain},0)`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const ed = g.createRadialGradient(W * .55, H * .45, Math.min(W, H) * .45, W * .5, H * .5, Math.hypot(W, H) * .62); ed.addColorStop(0, `rgba(${F.edge},0)`); ed.addColorStop(1, `rgba(${F.edge},${F.edgeA})`); g.fillStyle = ed; g.fillRect(0, 0, W, H); return (FINC[k] = c); }
  const GRN = []; function grainFrames() { if (GRN.length && GRN[0].width === W + 128) return GRN; GRN.length = 0; for (let k = 0; k < 4; k++) { const w = W + 128, h = H + 128, c = mkCanvas(w, h), g = c.getContext('2d'), d = g.createImageData(w, h), r = rng(901 + k * 13);
      for (let i = 0; i < d.data.length; i += 4) { const v = r(); const lum = v > .5 ? 255 : 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = lum; d.data[i + 3] = Math.abs(v - .5) * 2 * 255 * .55; } g.putImageData(d, 0, 0); GRN.push(c); } return GRN; }
  function finish(lt, A) { const L = LOOK.cur || LOOKS.dossier; if (window.PP_NOFINISH) return; const F = { ...(L.family === 'light' ? FIN.light : FIN.dark), ...(L.finish || {}) };
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = F.liftA; ctx.globalCompositeOperation = 'lighten'; ctx.fillStyle = F.lift; ctx.fillRect(0, 0, W, H);   // raised, tinted black floor (3D, photos & diagrams share it)
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(finLight(F, L.name), 0, 0);                                                                  // one shared key light (top-left) + soft edges
    const G = grainFrames(), f = Math.floor(lt * 12); ctx.globalAlpha = F.grain * (A && A.sepia ? 1.6 : 1); ctx.drawImage(G[f % G.length], -((f * 37) % 128), -((f * 53) % 128)); ctx.restore(); }  // animated grain on every frame
  const midTone = act => { const M = LOOK.cur.mid; return M[act] || M.tone; };
  const split = (s, d = '|') => String(s || '').split(d).map(x => x.trim()).filter(Boolean);
  const num = (v, d) => (v === undefined || v === '' || isNaN(+v)) ? d : +v;
  const item = s => { const f = split(s, ';'); const o = { id: f[0] }; f.slice(1).forEach(p => { const k = p.indexOf(':'); if (k > 0) o[p.slice(0, k).trim()] = p.slice(k + 1).trim(); else o[p] = '1'; }); return o; };
  const isV = () => H > W;
  const HAS = id => /^clip:/.test(id || '') ? !!(IMG[clipFrame(id, 0)] && IMG[clipFrame(id, 0)].naturalWidth) : /^wall:/.test(id || '') ? id.slice(5).split(',').some(x => !!(IMG[x] && IMG[x].naturalWidth)) : !!(IMG[id] && IMG[id].naturalWidth);
  const MISSING = new Set();
  const EXT = {}, BGX = {}; // v2 extensions register fx and backdrops here (pp_cine2.js)
  const CLIPN = {}; function clipFrame(id, p) { const name = id.slice(5); if (CLIPN[name] === undefined) { let n = 0; while (window.IMAGES[name + '__' + String(n).padStart(3, '0')]) n++; CLIPN[name] = n; } const n = CLIPN[name]; if (!n) return name + '__000'; const meta = window.IMAGES[name + '__000'] || {}; const f = Math.floor(Math.max(0, p) * (meta.fps || 12)); const k = meta.loop === false ? Math.min(n - 1, f) : f % n; return name + '__' + String(k).padStart(3, '0'); }

  // ---------------------------------------------------------------- word clock
  function clock(caps) {
    const words = []; caps.forEach((c, ci) => { const raw = String(c[2]).replace(/[\*\[\]]/g, ''); const toks = raw.split(/\s+/).filter(Boolean); const total = toks.reduce((s, w) => s + w.length + 1, 0) || 1; let acc = 0; const span = Math.max(.3, (c[1] - c[0]) - .3);
      const vw = window.VOWORDS && c[3] && c[3].vo !== undefined ? window.VOWORDS[c[3].vo] : null; const norm = w => w.toLowerCase().replace(/[^a-z0-9$%€£.\-']/g, '').replace(/^[.\-']+|[.\-']+$/g, '');
      const tv = toks.filter(w => /[A-Za-z0-9$%€£]/.test(w)); if (vw && vw.length === tv.length) { tv.forEach((w, i) => words.push({ w: norm(w), t: c[0] + .05 + vw[i][1], ci })); return; }   // v5: real word times from the voice-over
      toks.forEach(w => { words.push({ w: norm(w), t: c[0] + span * acc / total, ci }); acc += w.length + 1; }); });
    return (at, def = .3) => { if (at === undefined || at === '') return def; let s = String(at).trim(), off = 0; const m = s.match(/^(.*?)([+\-]\d*\.?\d+)$/); if (m && m[1] && isNaN(+m[1])) { s = m[1]; off = +m[2]; } else if (m && !m[1]) return Math.max(0, def + +m[2]);
      if (!isNaN(+s)) return +s + off; const cm = s.match(/^c(\d+)$/i); if (cm) { const c = caps[+cm[1] - 1]; return (c ? c[0] : def) + off; }
      let [w, n] = s.toLowerCase().split('#'); n = +(n || 1); w = w.replace(/[^a-z0-9$%€£.\-']/g, ''); let k = 0; for (const x of words) if (x.w === w || (w.length > 2 && x.w.startsWith(w))) { if (++k === n) return Math.max(0, x.t - (window.PP_LEAD ?? .1)) + off; }   // v5: picture lands ~3 frames BEFORE the spoken word
      console.warn('PP: word not found for at:', at); return def + off; };
  }

  // ---------------------------------------------------------------- image toning + borders (cached)
  const TONED = {};
  function toneMap(tone) { const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    if (tone === 'warm') return [hex('#3a2a18'), hex('#fff6e4')]; if (tone === 'cool') return [hex('#1b2a3a'), hex('#eef4f8')]; if (tone === 'duo') return [hex('#0d1626'), hex('#f2e9d6')]; if (tone === 'gold') return [hex('#0d1626'), hex('#f0cf6a')]; if (tone === 'red') return [hex('#1a0606'), hex('#ff6a5a')]; if (tone === 'teal') return [hex('#071a17'), hex('#bfe6da')]; if (tone === 'navy') return [hex('#050a14'), hex('#9fb4d6')]; if (tone === 'blueprint') return [hex('#0b2a55'), hex('#d6ecff')]; if (tone === 'sepia') return [hex('#2a1a0c'), hex('#f0dcb4')]; if (tone === 'neon') return [hex('#12002a'), hex('#7ff6ff')]; return null; }
  function toned(id, tone = 'bw', border = 1, style = 'print') {
    const key = id + '|' + tone + '|' + border + '|' + style; if (TONED[key]) return TONED[key]; const im = IMG[id]; if (!im || !im.naturalWidth) return null;
    const meta = window.IMAGES[id] || {}; const w = im.naturalWidth, h = im.naturalHeight; const cut = meta.cut !== false;
    const src = mkCanvas(w, h), g = src.getContext('2d'); g.drawImage(im, 0, 0);
    if (tone === 'sketch' || tone === 'shadow') { const d = g.getImageData(0, 0, w, h), p = d.data, L = new Float32Array(w * h); for (let i = 0; i < w * h; i++) L[i] = (p[i * 4] * .299 + p[i * 4 + 1] * .587 + p[i * 4 + 2] * .114) / 255;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; let v; if (tone === 'shadow') { v = .03; } else { const gx = (L[i + 1] || L[i]) - (L[i - 1] || L[i]), gy = (L[i + w] || L[i]) - (L[i - w] || L[i]); const ed = Math.min(1, Math.hypot(gx, gy) * 5); const hatch = ((x + y) % 6 < 2 && L[i] < .55 ? .35 : 0) + ((x - y + 600) % 6 < 2 && L[i] < .3 ? .35 : 0); v = clamp(.96 - ed * .9 - hatch - (1 - L[i]) * .25); } const c0 = tone === 'shadow' ? [6, 8, 12] : [34, 26, 18], c1 = [242, 234, 216]; p[i * 4] = c0[0] + (c1[0] - c0[0]) * v; p[i * 4 + 1] = c0[1] + (c1[1] - c0[1]) * v; p[i * 4 + 2] = c0[2] + (c1[2] - c0[2]) * v; }
      g.putImageData(d, 0, 0); }
    else if (tone === 'halftone') { const d = g.getImageData(0, 0, w, h), p = d.data; const out = mkCanvas(w, h), og = out.getContext('2d'); og.fillStyle = '#efe7d4'; og.fillRect(0, 0, w, h); og.fillStyle = '#16120e'; const st = Math.max(5, Math.round(Math.max(w, h) / 120));
      for (let y = 0; y < h; y += st) for (let x = (y / st) % 2 ? st / 2 : 0; x < w; x += st) { const i = (Math.min(h - 1, y | 0) * w + Math.min(w - 1, x | 0)) * 4; const L = (p[i] * .299 + p[i + 1] * .587 + p[i + 2] * .114) / 255; const r = st * .62 * Math.sqrt(1 - L); if (r > .3) { og.beginPath(); og.arc(x, y, r, 0, TAU); og.fill(); } }
      g.clearRect(0, 0, w, h); g.drawImage(out, 0, 0); if (meta.cut !== false) { g.globalCompositeOperation = 'destination-in'; g.drawImage(im, 0, 0); g.globalCompositeOperation = 'source-over'; } }
    else if (tone === 'aged') { const d = g.getImageData(0, 0, w, h), p = d.data; for (let i = 0; i < p.length; i += 4) { const L = p[i] * .299 + p[i + 1] * .587 + p[i + 2] * .114; const r0 = L + (p[i] - L) * .5, g0 = L + (p[i + 1] - L) * .5, b0 = L + (p[i + 2] - L) * .5; p[i] = clamp(r0 * .96 + 14, 0, 255); p[i + 1] = clamp(g0 * .93 + 8, 0, 255); p[i + 2] = clamp(b0 * .82 + 2, 0, 255); } g.putImageData(d, 0, 0); } // archive print: half saturation, warm paper cast
    else if (tone !== 'color') { const d = g.getImageData(0, 0, w, h), p = d.data, map = toneMap(tone), con = tone === 'bw' ? 1.28 : 1.18;
      for (let i = 0; i < p.length; i += 4) { let L = (p[i] * .299 + p[i + 1] * .587 + p[i + 2] * .114) / 255; L = clamp((L - .5) * con + .5 + .02); if (map) { const [a, b] = map; p[i] = a[0] + (b[0] - a[0]) * L; p[i + 1] = a[1] + (b[1] - a[1]) * L; p[i + 2] = a[2] + (b[2] - a[2]) * L; } else { p[i] = p[i + 1] = p[i + 2] = L * 255; } }
      g.putImageData(d, 0, 0); }
    else { const d = g.getImageData(0, 0, w, h), p = d.data; for (let i = 0; i < p.length; i += 4) { const L = p[i] * .299 + p[i + 1] * .587 + p[i + 2] * .114; for (let k = 0; k < 3; k++) p[i + k] = clamp((L + (p[i + k] - L) * .82 - 128) * 1.1 + 128, 0, 255); } g.putImageData(d, 0, 0); }
    if (style === 'tv' && !cut) { const bz = Math.round(Math.max(w, h) * .07); const c = mkCanvas(w + bz * 2, h + bz * 2), cg = c.getContext('2d'); cg.fillStyle = '#16171b'; rrc(cg, 0, 0, c.width, c.height, bz * .9); cg.fill(); cg.fillStyle = '#2a2c33'; rrc(cg, bz * .25, bz * .25, c.width - bz * .5, c.height - bz * .5, bz * .7); cg.fill(); cg.save(); rrc(cg, bz, bz, w, h, bz * .5); cg.clip(); cg.drawImage(src, bz, bz); cg.fillStyle = 'rgba(0,0,0,.22)'; for (let y = bz; y < bz + h; y += 4) cg.fillRect(bz, y, w, 1.6); const gl = cg.createRadialGradient(bz + w / 2, bz + h / 2, h * .2, bz + w / 2, bz + h / 2, h * .8); gl.addColorStop(0, 'rgba(255,255,255,.06)'); gl.addColorStop(1, 'rgba(0,0,0,.45)'); cg.fillStyle = gl; cg.fillRect(bz, bz, w, h); cg.restore(); return (TONED[key] = { c, pad: bz, w, h, cut }); }
    if (!border) return (TONED[key] = { c: src, pad: 0, w, h, cut });
    const b = Math.round(Math.max(w, h) * (cut ? .016 : style === 'polaroid' ? .045 : .03)) + 4, sh = Math.round(Math.max(w, h) * .03); const bot = !cut && style === 'polaroid' ? b * 3.2 : b; const pad = bot + sh + 4; const c = mkCanvas(w + pad * 2, h + pad * 2), cg = c.getContext('2d');
    // silhouette for the white border (cut-outs) or a print border (rectangles)
    const sil = mkCanvas(w, h), sg = sil.getContext('2d');
    if (cut) { sg.drawImage(im, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = PP.white; sg.fillRect(0, 0, w, h); } else { sg.fillStyle = PP.white; sg.fillRect(0, 0, w, h); }
    // baked soft drop shadow (offset down-right) → depth without per-frame blur
    cg.save(); cg.filter = `blur(${sh * .55}px)`; cg.globalAlpha = .55; const shd = mkCanvas(w, h), shg = shd.getContext('2d'); shg.drawImage(sil, 0, 0); shg.globalCompositeOperation = 'source-in'; shg.fillStyle = '#000'; shg.fillRect(0, 0, w, h); cg.drawImage(shd, pad + sh * .35, pad + sh * .55); cg.restore();
    if (cut) { for (let a = 0; a < TAU; a += TAU / 28) cg.drawImage(sil, pad + Math.cos(a) * b, pad + Math.sin(a) * b); }
    else if (style === 'raw') { } else if (style === 'torn') { const r = rng(id.length * 17 + 3); const x0 = pad - b, y0 = pad - b, x1 = pad + w + b, y1 = pad + h + b, J = b * .5; cg.beginPath(); cg.moveTo(x0, y0); const N = 70; for (let i = 1; i <= N; i++) cg.lineTo(x0 + (x1 - x0) * i / N, y0 + (r() - .3) * J); for (let i = 1; i <= N; i++) cg.lineTo(x1 - (r() - .3) * J, y0 + (y1 - y0) * i / N); for (let i = N - 1; i >= 0; i--) cg.lineTo(x0 + (x1 - x0) * i / N, y1 - (r() - .3) * J); for (let i = N - 1; i > 0; i--) cg.lineTo(x0 + (r() - .3) * J, y0 + (y1 - y0) * i / N); cg.closePath(); cg.fillStyle = '#f3ecdc'; cg.fill(); cg.save(); cg.clip(); cg.drawImage(src, pad - b * .35, pad - b * .35, w + b * .7, h + b * .7); cg.restore(); return (TONED[key] = { c, pad, w, h, cut }); }
    else { cg.fillStyle = PP.white; cg.fillRect(pad - b, pad - b, w + b * 2, h + b + bot); }
    cg.drawImage(src, pad, pad);
    return (TONED[key] = { c, pad, w, h, cut });
  }
  function missing(id, x, y, hh) { MISSING.add(id); const u = U(); if (LOOK.bright) return missingCard(id, x, y, hh, u); ctx.save(); ctx.fillStyle = 'rgba(192,57,43,.85)'; ctx.fillRect(x - hh * .35, y - hh / 2, hh * .7, hh); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4 * u; ctx.strokeRect(x - hh * .35, y - hh / 2, hh * .7, hh);
    T('MISSING IMAGE', x, y - 22 * u, { size: 26 * u, font: 'cond', fill: '#fff', lw: 0 }); T(id, x, y + 18 * u, { size: 24 * u, font: 'body', fill: '#fff', lw: 0 }); ctx.restore(); }

  // ---------------------------------------------------------------- procedural backdrops
  const BGC = {};
  function missingCard(id, x, y, hh, u) { const w = hh * .72; ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x - w / 2, y - hh / 2, w, hh); ctx.setLineDash([10 * u, 8 * u]); ctx.strokeStyle = 'rgba(20,33,61,.55)'; ctx.lineWidth = 3 * u; ctx.strokeRect(x - w / 2, y - hh / 2, w, hh); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(20,33,61,.18)'; ctx.beginPath(); ctx.arc(x, y - hh * .12, w * .2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + hh * .2, w * .34, hh * .16, 0, Math.PI, 0); ctx.fill();
    T('PHOTO NEEDED', x, y + hh * .34, { size: Math.max(14 * u, hh * .045), font: 'cond', weight: 700, fill: '#c0392b', lw: 0, ls: 2 * u }); T(id, x, y + hh * .41, { size: Math.max(12 * u, hh * .035), font: 'cond', weight: 500, fill: '#14213d', lw: 0 }); ctx.restore(); }
  function wallPlate(ids, tone) { const tw = Math.round(W * 1.18), th = Math.round(H * 1.18); const c = mkCanvas(tw, th), g = c.getContext('2d'); g.fillStyle = LOOK.cur && LOOK.cur.bg ? LOOK.cur.bg.base.cream[1] : LOOK.bright ? '#efe6d2' : '#1a2233'; g.fillRect(0, 0, tw, th); const r = rng(ids.join().length * 7); const n = Math.max(6, ids.length * 2);
    for (let k = 0; k < n; k++) { const id = ids[k % ids.length]; if (!HAS(id)) continue; const T0 = toned(id, tone, 1, 'torn'); const hh = th * (.32 + r() * .2), s = hh / T0.c.height; g.save(); g.translate(tw * ((k % 4) / 3.2 + .08 + (r() - .5) * .1), th * (Math.floor(k / 4) * .5 + .25 + (r() - .5) * .15)); g.rotate((r() - .5) * .3); g.drawImage(T0.c, -T0.c.width * s / 2, -hh / 2, T0.c.width * s, hh); g.restore(); } return { naturalWidth: tw, naturalHeight: th, _c: c }; }
  function blurredPlate(id, blur, dim, tone) { const key = [id, blur, dim, tone, W, H].join('|'); if (BGC[key]) return BGC[key]; if (/^wall:/.test(id)) { const wp = wallPlate(id.slice(5).split(','), tone || 'navy'); const c = mkCanvas(wp.naturalWidth, wp.naturalHeight), g = c.getContext('2d'); g.filter = `blur(${blur * U()}px) brightness(${1 - dim})`; g.drawImage(wp._c, 0, 0); g.filter = 'none'; return (BGC[key] = c); } const im = IMG[id]; if (!im || !im.naturalWidth) return null;
    const tw = Math.round(W * 1.18), th = Math.round(H * 1.18); const c = mkCanvas(tw, th), g = c.getContext('2d'); const T0 = toned(id, tone || 'navy', 0); const s = Math.max(tw / im.naturalWidth, th / im.naturalHeight);
    g.filter = `blur(${blur * U()}px) brightness(${1 - dim})`; g.drawImage(T0.c, (tw - im.naturalWidth * s) / 2, (th - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s); g.filter = 'none'; return (BGC[key] = c); }
  function procBg(kind, lt, seed) { const u = U(); const r = rng(seed);
    if (!LOOK.cur.noir && /^(navy|spot|news|chart|black|cream)$/.test(kind)) return brightBg(kind, lt, r, u);
    if (!LOOK.cur.noir && !LOOK.cur.dossier && (kind === 'paper' || kind === 'flash')) return brightBg('flash', lt, r, u);
    if (LOOK.bright && (kind === 'paper' || kind === 'flash')) { ctx.fillStyle = '#ece0c4'; ctx.fillRect(0, 0, W, H); const g = ctx.createRadialGradient(W * .5, H * .45, H * .1, W * .5, H * .5, Math.hypot(W, H) * .62); g.addColorStop(0, 'rgba(255,252,240,.5)'); g.addColorStop(1, 'rgba(150,110,60,.28)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.globalAlpha = .06; for (let i = 0; i < 70; i++) { ctx.fillStyle = r() > .5 ? '#5a4020' : '#fff'; ctx.fillRect(r() * W, r() * H, (20 + r() * 160) * u, 1.5 * u); } ctx.restore(); return; }
    if (kind === 'paper' || kind === 'flash') { ctx.fillStyle = '#d6c7a6'; ctx.fillRect(0, 0, W, H); const g = ctx.createRadialGradient(W * .5, H * .45, H * .1, W * .5, H * .5, Math.hypot(W, H) * .6); g.addColorStop(0, 'rgba(255,250,235,.22)'); g.addColorStop(1, 'rgba(70,45,20,.5)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.globalAlpha = .08; for (let i = 0; i < 70; i++) { ctx.fillStyle = r() > .5 ? '#5a4020' : '#fff'; ctx.fillRect(r() * W, r() * H, (20 + r() * 160) * u, 1.5 * u); } ctx.restore();
      ctx.save(); ctx.globalAlpha = .12; ctx.strokeStyle = '#6b5030'; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(W * .5 + 30 * u, 0); ctx.lineTo(W * .5 - 20 * u, H); ctx.stroke(); ctx.restore(); return; }
    if (kind === 'cork' || kind === 'wood') { const base = kind === 'cork' ? '#7a5634' : '#3b2618'; ctx.fillStyle = base; ctx.fillRect(0, 0, W, H);
      if (kind === 'cork') { for (let i = 0; i < 2600; i++) { ctx.fillStyle = r() > .5 ? 'rgba(40,22,10,.35)' : 'rgba(190,140,90,.28)'; ctx.fillRect(r() * W, r() * H, (1 + r() * 4) * u, (1 + r() * 3) * u); } }
      else { for (let y = 0; y < H; y += 6 * u) { ctx.strokeStyle = `rgba(${r() > .5 ? '20,10,4' : '120,80,50'},${.15 + r() * .2})`; ctx.lineWidth = (1 + r() * 2) * u; ctx.beginPath(); ctx.moveTo(0, y); for (let x = 0; x <= W; x += 80 * u) ctx.lineTo(x, y + Math.sin(x * .004 + y * .01) * 6 * u); ctx.stroke(); } }
      const g = ctx.createRadialGradient(W * .5, H * .4, H * .1, W * .5, H * .5, Math.hypot(W, H) * .62); g.addColorStop(0, 'rgba(255,220,170,.18)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); dust(lt, r, .05); return; }
    if (kind === 'black') { ctx.fillStyle = '#050608'; ctx.fillRect(0, 0, W, H); dust(lt, r, .05); return; }
    // navy family
    const g = ctx.createRadialGradient(W * .55, H * .42, H * .05, W * .5, H * .5, Math.hypot(W, H) * .62); g.addColorStop(0, '#1d3050'); g.addColorStop(.55, PP.navy); g.addColorStop(1, '#050a14'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (kind === 'spot') { const s = ctx.createRadialGradient(W * .5, H * .1, 10, W * .5, H * .5, H * .9); s.addColorStop(0, 'rgba(255,240,200,.22)'); s.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = s; ctx.fillRect(0, 0, W, H); dust(lt, r, .12); return; }
    if (kind === 'news') { ctx.save(); ctx.globalAlpha = .13; ctx.translate(-((lt * 12 * u) % (W * .2)), 0); for (let col = 0; col < 7; col++) { const x0 = col * W * .2 + 20 * u; ctx.fillStyle = '#e8e2d2'; ctx.fillRect(x0, H * .06, W * .17, 26 * u); for (let l = 0; l < 40; l++) ctx.fillRect(x0, H * .14 + l * 22 * u, W * (.1 + r() * .07), 7 * u); } ctx.restore(); ctx.filter = 'none'; dust(lt, r, .06); return; }
    if (kind === 'chart') { ctx.save(); ctx.globalAlpha = .14; ctx.strokeStyle = '#7fa0d0'; ctx.lineWidth = 1.5 * u; for (let x = 0; x < W; x += 80 * u) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 80 * u) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore();
      ctx.save(); ctx.globalAlpha = .18; setFont(18 * u, 'cond', 500); ctx.fillStyle = '#9fb4d6'; for (let i = 0; i < 26; i++) { const y = (i * 41 * u + lt * 30 * u) % H; ctx.fillText((r() * 900 + 100).toFixed(2) + (r() > .5 ? ' ▲' : ' ▼'), (r() * .9) * W, y); } ctx.restore(); dust(lt, r, .05); return; }
    // plain navy: faint grid + drifting dust
    ctx.save(); ctx.globalAlpha = .045; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1 * u; for (let x = 0; x < W; x += 120 * u) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } ctx.restore(); dust(lt, r, .09); }
  function dust(lt, r, a) { const u = U(); ctx.save(); for (let i = 0; i < 34; i++) { const x = (r() * W + lt * (6 + r() * 12) * u) % W, y = (r() * H - lt * (4 + r() * 8) * u + H) % H; ctx.globalAlpha = a * (.4 + r()); ctx.fillStyle = '#fff3d6'; ctx.beginPath(); ctx.arc(x, y, (1 + r() * 2.6) * u, 0, TAU); ctx.fill(); } ctx.restore(); }

  // ---------------------------------------------------------------- drawn props (no photo needed)
  const PROP = {
    cash(h, lt) { const u = h / 200; for (let k = 0; k < 5; k++) { const y = -k * 16 * u; ctx.save(); ctx.translate(Math.sin(k * 2.1) * 6 * u, y); ctx.rotate(Math.sin(k * 1.7) * .03); ctx.fillStyle = k % 2 ? '#3f6b45' : '#4b7a50'; ctx.fillRect(-170 * u, -14 * u, 340 * u, 28 * u); ctx.fillStyle = '#d8d0b0'; ctx.fillRect(-28 * u, -14 * u, 56 * u, 28 * u); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2 * u; ctx.strokeRect(-170 * u, -14 * u, 340 * u, 28 * u); ctx.restore(); }
      ctx.save(); ctx.translate(0, -100 * u); ctx.fillStyle = '#5b8a5c'; ctx.fillRect(-150 * u, -10 * u, 300 * u, 120 * u); ctx.strokeStyle = '#d9e4c4'; ctx.lineWidth = 4 * u; ctx.strokeRect(-140 * u, 0, 280 * u, 100 * u); ctx.fillStyle = '#d9e4c4'; ctx.beginPath(); ctx.arc(0, 50 * u, 34 * u, 0, TAU); ctx.fill(); T('100', -105 * u, 22 * u, { size: 26 * u, font: 'cond', fill: '#d9e4c4', lw: 0 }); T('100', 105 * u, 80 * u, { size: 26 * u, font: 'cond', fill: '#d9e4c4', lw: 0 }); ctx.fillStyle = '#c9a227'; ctx.fillRect(-150 * u, 40 * u, 300 * u, 18 * u); ctx.restore(); },
    coins(h) { const u = h / 200; for (let s = 0; s < 3; s++) for (let k = 0; k < 6 - s; k++) { const x = (s - 1) * 90 * u, y = -k * 18 * u; ctx.fillStyle = k % 2 ? '#b58b1b' : PP.gold; ctx.beginPath(); ctx.ellipse(x, y, 40 * u, 12 * u, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#6b5210'; ctx.lineWidth = 2 * u; ctx.stroke(); } },
    pill(h, lt, o) { const u = h / 200, br = o && o.broken; ctx.save(); ctx.rotate(-.5); const half = (col, dir) => { ctx.save(); ctx.translate(dir * (br ? 30 * u : 0), br ? dir * 8 * u : 0); ctx.rotate(br ? dir * .35 : 0); ctx.beginPath(); if (dir < 0) { ctx.moveTo(0, -46 * u); ctx.lineTo(-90 * u, -46 * u); ctx.arc(-90 * u, 0, 46 * u, -Math.PI / 2, Math.PI / 2, true); ctx.lineTo(0, 46 * u); } else { ctx.moveTo(0, -46 * u); ctx.lineTo(90 * u, -46 * u); ctx.arc(90 * u, 0, 46 * u, -Math.PI / 2, Math.PI / 2); ctx.lineTo(0, 46 * u); } ctx.closePath(); const g = ctx.createLinearGradient(0, -46 * u, 0, 46 * u); g.addColorStop(0, shade(col, .18)); g.addColorStop(.5, col); g.addColorStop(1, shade(col, -.22)); ctx.fillStyle = g; ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(dir < 0 ? -110 * u : 10 * u, -34 * u, 100 * u, 10 * u); ctx.restore(); };
      half(PP.red, -1); half(PP.paper, 1); ctx.restore(); },
    doc(h, lt, o) { const u = h / 200; ctx.save(); ctx.rotate(-.04); ctx.fillStyle = PP.paper; ctx.fillRect(-120 * u, -160 * u, 240 * u, 320 * u); ctx.fillStyle = 'rgba(40,30,20,.6)'; T(o && o.title || 'CONFIDENTIAL', 0, -125 * u, { size: 22 * u, font: 'cond', fill: '#2a2018', lw: 0 }); for (let l = 0; l < 11; l++) ctx.fillRect(-95 * u, (-90 + l * 22) * u, (150 + (l * 37) % 40) * u, 6 * u); ctx.restore(); },
    phone(h, lt, o) { const u = h / 200; ctx.save(); ctx.fillStyle = '#0c0c10'; rr(-62 * u, -120 * u, 124 * u, 240 * u, 18 * u); ctx.fill(); const g = ctx.createLinearGradient(0, -110 * u, 0, 110 * u); g.addColorStop(0, '#26324a'); g.addColorStop(1, '#0f1626'); ctx.fillStyle = g; rr(-54 * u, -108 * u, 108 * u, 216 * u, 12 * u); ctx.fill(); if (o && o.label) T(o.label, 0, 0, { size: 26 * u, font: 'impact', fill: PP.gold2, lw: 0 }); ctx.restore(); },
    arrowdown(h) { const u = h / 200; ctx.fillStyle = PP.red; ctx.beginPath(); ctx.moveTo(-30 * u, -100 * u); ctx.lineTo(30 * u, -100 * u); ctx.lineTo(30 * u, 20 * u); ctx.lineTo(70 * u, 20 * u); ctx.lineTo(0, 100 * u); ctx.lineTo(-70 * u, 20 * u); ctx.lineTo(-30 * u, 20 * u); ctx.closePath(); ctx.fill(); },
  };
  function tapes(cw, ch, u, i) { [[-1, -1], [1, -1]].forEach(([sx, sy], k) => { ctx.save(); ctx.translate(sx * cw * .36, sy * ch * .44); ctx.rotate(sx * .6 + (i + k) * .07); ctx.fillStyle = 'rgba(232,220,180,.82)'; ctx.fillRect(-60 * u, -16 * u, 120 * u, 32 * u); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-60 * u, -16 * u, 120 * u, 6 * u); ctx.restore(); }); }
  const BASE = new Set(['cash', 'coins']); // props drawn upward from their base; the rest are centred
  function rrc(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  // ---------------------------------------------------------------- shatter (precomputed shards of any drawn canvas)
  function shards(seed, n = 7) { const r = rng(seed), out = []; const P = []; for (let j = 0; j <= n; j++) { P.push([]); for (let i = 0; i <= n; i++) P[j].push([i / n + (i > 0 && i < n ? (r() - .5) * .9 / n : 0), j / n + (j > 0 && j < n ? (r() - .5) * .9 / n : 0)]); }
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const a = P[j][i], b = P[j][i + 1], c = P[j + 1][i + 1], d = P[j + 1][i]; [[a, b, c], [a, c, d]].forEach(tri => { const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3; out.push({ tri, cx, cy, vx: (cx - .5) * (1.4 + r() * 1.6) + (r() - .5) * .5, vy: (cy - .65) * (1.2 + r()) - r() * .6, rot: (r() - .5) * 6 }); }); }
    return out; }
  function drawShattered(c, x, y, w, h, p, seed) { const S = shards(seed); const g = 2.4; ctx.save(); S.forEach(s => { const tx = (s.vx * p) * w * .9, ty = (s.vy * p + g * p * p) * h * .9; ctx.save(); ctx.globalAlpha *= clamp(1.25 - p); ctx.translate(x - w / 2 + s.cx * w + tx, y - h / 2 + s.cy * h + ty); ctx.rotate(s.rot * p); ctx.translate(-(x - w / 2 + s.cx * w), -(y - h / 2 + s.cy * h)); ctx.beginPath(); s.tri.forEach((q, k) => { const px = x - w / 2 + q[0] * w, py = y - h / 2 + q[1] * h; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); ctx.clip(); ctx.drawImage(c, x - w / 2, y - h / 2, w, h); ctx.restore(); }); ctx.restore(); }

  // ---------------------------------------------------------------- type
  // DOSSIER backdrops (v4 default look): the episode is a case file on a desk — manila folder, kraft, aged newsprint,
  // graph paper; matte, warm, never glowing. Fibre, foxing, folds and a folder edge are baked once per size (cached).
  const DOS = {}; const DCOL = { cream: ['#d8c39a', '#c6ab7a'], navy: ['#d8c39a', '#c6ab7a'], news: ['#d9d2c0', '#c4baa2'], chart: ['#dcd8c4', '#c9c2a8'], spot: ['#cdb48a', '#b0915f'], black: ['#9c8664', '#7e6a4c'] };
  function dossierPaper(kind, seed) { const key = kind + '|' + W + '|' + H + '|' + seed; if (DOS[key]) return DOS[key]; const c = mkCanvas(W, H), g = c.getContext('2d'); const u = U(), r = rng(seed * 31 + kind.length); const [a, b] = DCOL[kind] || DCOL.cream;
    const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 2200; i++) { g.fillStyle = r() > .5 ? 'rgba(90,65,30,.07)' : 'rgba(255,248,230,.07)'; g.fillRect(r() * W, r() * H, (8 + r() * 60) * u, (1 + r()) * u); } // fibre
    for (let i = 0; i < 9; i++) { const x = r() * W, y = r() * H, R = (20 + r() * 90) * u; const f = g.createRadialGradient(x, y, 0, x, y, R); f.addColorStop(0, 'rgba(120,80,30,.10)'); f.addColorStop(1, 'rgba(120,80,30,0)'); g.fillStyle = f; g.fillRect(x - R, y - R, 2 * R, 2 * R); } // foxing
    if (kind === 'news') { g.globalAlpha = .5; for (let col = 0; col < 6; col++) { const x0 = col * W * .17 + 30 * u; g.fillStyle = 'rgba(40,35,28,.55)'; g.fillRect(x0, H * .07, W * .15, 18 * u); g.fillStyle = 'rgba(40,35,28,.22)'; for (let l = 0; l < 44; l++) g.fillRect(x0, H * .13 + l * 20 * u, W * (.09 + r() * .06), 5 * u); } g.globalAlpha = 1; }
    else if (kind === 'chart') { g.strokeStyle = 'rgba(70,110,95,.22)'; g.lineWidth = 1 * u; for (let x = 0; x < W; x += 24 * u) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y < H; y += 24 * u) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.strokeStyle = 'rgba(70,110,95,.35)'; for (let x = 0; x < W; x += 120 * u) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y < H; y += 120 * u) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } }
    else if (kind !== 'black') { // the folder: a back sheet edge, a tab, a crease
      g.fillStyle = 'rgba(80,55,25,.10)'; g.fillRect(W * .03, H * .05, W * .94, H * .9); g.fillStyle = DCOL[kind] ? a : '#d8c39a'; g.fillRect(W * .035, H * .06, W * .93, H * .88);
      g.fillStyle = 'rgba(80,55,25,.12)'; g.fillRect(W * .06, H * .02, W * .2, H * .05); g.fillStyle = a; g.fillRect(W * .062, H * .025, W * .196, H * .045);
      g.fillStyle = 'rgba(30,25,20,.45)'; g.font = `700 ${14 * u}px "Oswald", sans-serif`; g.fillText('CASE FILE · CONFIDENTIAL', W * .075, H * .055);
      g.strokeStyle = 'rgba(90,65,30,.12)'; g.lineWidth = 2 * u; g.beginPath(); g.moveTo(W * .5 + 14 * u, H * .06); g.lineTo(W * .5 - 10 * u, H * .94); g.stroke(); }
    const v = g.createRadialGradient(W * .5, H * .45, Math.min(W, H) * .3, W * .5, H * .5, Math.hypot(W, H) * .62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(70,45,15,.28)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
    return (DOS[key] = c); }
  // generic look painter (cached per look/kind/size): base gradient + texture + ornament + kind pattern + vignette
  const LPC = {}; function lookPaper(L, kind) { const key = L.name + '|' + kind + '|' + W + '|' + H; if (LPC[key]) return LPC[key]; const c = mkCanvas(W, H), g = c.getContext('2d'); const u = U(), r = rng(7 + kind.length * 13); const B = L.bg; const [a, b] = B.base[kind] || B.base.cream; const dark = L.family === 'dark';
    const gr = g.createLinearGradient(0, 0, W * .35, H); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const lp = g.createRadialGradient(W * .56, H * .36, H * .05, W * .5, H * .5, Math.hypot(W, H) * .6); lp.addColorStop(0, dark ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.22)'); lp.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = lp; g.fillRect(0, 0, W, H);
    if (B.tex === 'fibre' || B.tex === 'film') for (let i = 0; i < 1800; i++) { g.fillStyle = r() > .5 ? 'rgba(80,55,25,.07)' : 'rgba(255,248,230,.07)'; g.fillRect(r() * W, r() * H, (8 + r() * 60) * u, (1 + r()) * u); }
    if (B.tex === 'grain' || B.tex === 'film') for (let i = 0; i < 14000; i++) { g.fillStyle = r() > .5 ? (dark ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.04)') : (dark ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.08)'); g.fillRect(r() * W, r() * H, 1.4 * u, 1.4 * u); }
    if (B.tex === 'scan') { g.fillStyle = 'rgba(0,0,0,.16)'; for (let y = 0; y < H; y += 3 * u) g.fillRect(0, y, W, Math.max(1, u)); }
    g.strokeStyle = B.ink; g.fillStyle = B.ink; g.lineWidth = Math.max(1, u);
    const lines = (step, vert = true, horiz = true, lw = 1) => { g.lineWidth = lw * u; g.beginPath(); if (vert) for (let x = 0; x <= W; x += step) { g.moveTo(x, 0); g.lineTo(x, H); } if (horiz) for (let y = 0; y <= H; y += step) { g.moveTo(0, y); g.lineTo(W, y); } g.stroke(); };
    if (B.orn === 'grid') lines(60 * u); else if (B.orn === 'dots') { for (let x = 20 * u; x < W; x += 40 * u) for (let y = 20 * u; y < H; y += 40 * u) { g.beginPath(); g.arc(x, y, 1.6 * u, 0, TAU); g.fill(); } }
    else if (B.orn === 'blueprint') { g.globalAlpha = .55; lines(24 * u); g.globalAlpha = 1.4; lines(120 * u, true, true, 1.6); g.globalAlpha = 1; }
    else if (B.orn === 'lines') lines(46 * u, false); else if (B.orn === 'ledger') { lines(40 * u, false); g.strokeStyle = 'rgba(229,72,77,.28)'; g.lineWidth = 2 * u; g.beginPath(); g.moveTo(W * .08, 0); g.lineTo(W * .08, H); g.moveTo(W * .085, 0); g.lineTo(W * .085, H); g.stroke(); }
    else if (B.orn === 'stripes') { g.lineWidth = 1.2 * u; g.beginPath(); for (let x = -H; x < W; x += 28 * u) { g.moveTo(x, H); g.lineTo(x + H, 0); } g.stroke(); }
    else if (B.orn === 'frame') { g.lineWidth = 2 * u; g.strokeRect(W * .03, H * .05, W * .94, H * .9); g.lineWidth = 1 * u; g.strokeRect(W * .036, H * .062, W * .928, H * .876); }
    else if (B.orn === 'seal') { g.lineWidth = 1 * u; g.beginPath(); for (let x = W * .06; x < W; x += 90 * u) { g.moveTo(x, 0); g.lineTo(x, H); } g.stroke(); g.save(); g.translate(W * .93, H * .84); g.rotate(-.06); g.strokeStyle = 'rgba(178,34,34,.55)'; g.lineWidth = 5 * u; g.strokeRect(-44 * u, -44 * u, 88 * u, 88 * u); g.fillStyle = 'rgba(178,34,34,.55)'; g.font = `700 ${46 * u}px "Noto Sans SC", serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('印', 0, 2 * u); g.restore(); }
    else if (B.orn === 'synth') { const hz = H * .64; const sun = g.createLinearGradient(0, hz - H * .3, 0, hz); sun.addColorStop(0, 'rgba(255,170,90,.35)'); sun.addColorStop(1, 'rgba(244,114,182,.25)'); g.save(); g.beginPath(); g.arc(W * .5, hz, H * .26, Math.PI, 0); g.fillStyle = sun; g.fill(); g.fillStyle = b; for (let k = 0; k < 6; k++) g.fillRect(W * .2, hz - (k + 1) * H * .03 + k * 2 * u, W * .6, (2 + k * 1.2) * u); g.restore();
      g.strokeStyle = B.ink; g.lineWidth = 1.5 * u; g.beginPath(); for (let k = 0; k < 14; k++) { const y = hz + Math.pow(k / 13, 2.2) * (H - hz); g.moveTo(0, y); g.lineTo(W, y); } for (let k = -12; k <= 12; k++) { g.moveTo(W * .5 + k * W * .02, hz); g.lineTo(W * .5 + k * W * .2, H); } g.stroke(); }
    if (kind === 'news') { g.globalAlpha = .6; for (let col = 0; col < 6; col++) { const x0 = col * W * .17 + 30 * u; g.fillRect(x0, H * .07, W * .15, 16 * u); g.globalAlpha = .3; for (let l = 0; l < 44; l++) g.fillRect(x0, H * .13 + l * 20 * u, W * (.09 + r() * .06), 5 * u); g.globalAlpha = .6; } g.globalAlpha = 1; }
    if (kind === 'chart' && B.orn !== 'grid' && B.orn !== 'blueprint') lines(30 * u);
    const v = g.createRadialGradient(W * .5, H * .45, Math.min(W, H) * .3, W * .5, H * .5, Math.hypot(W, H) * .62); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(${B.vig},${B.vigA})`); g.fillStyle = v; g.fillRect(0, 0, W, H);
    return (LPC[key] = c); }
  function lookFx(L, kind, lt, u) { const dark = L.family === 'dark';
    if (kind === 'spot') { const s2 = ctx.createRadialGradient(W * .5, H * .3, 10, W * .5, H * .45, H * .8); s2.addColorStop(0, dark ? 'rgba(255,240,200,.12)' : 'rgba(255,240,200,.2)'); s2.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = s2; ctx.fillRect(0, 0, W, H); }
    if (L.bg.tex === 'film') { const r = rng(Math.floor(lt * 12)); ctx.save(); ctx.strokeStyle = 'rgba(40,25,10,.28)'; ctx.lineWidth = 1.2 * u; for (let i = 0; i < 3; i++) { const x = r() * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (r() - .5) * 18 * u, H); ctx.stroke(); } ctx.globalAlpha = .05 + .04 * Math.abs(Math.sin(lt * 21)); ctx.fillStyle = '#fff3d6'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (L.bg.tex === 'scan') { const y = (lt * 140 * u) % (H + 200 * u) - 100 * u; const gr = ctx.createLinearGradient(0, y - 60 * u, 0, y + 60 * u); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,255,255,.035)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gr; ctx.fillRect(0, y - 60 * u, W, 120 * u); }
    dust(lt, rng(5), dark ? .06 : .03); }
  function brightBg(kind, lt, r, u) { const L = LOOK.cur; if (L && !L.dossier && L.bg) { ctx.drawImage(lookPaper(L, kind), 0, 0); lookFx(L, kind, lt, u); return; } ctx.drawImage(dossierPaper(kind, 3), 0, 0); if (kind === 'spot') { const s2 = ctx.createRadialGradient(W * .5, H * .3, 10, W * .5, H * .45, H * .8); s2.addColorStop(0, 'rgba(255,225,160,.22)'); s2.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = s2; ctx.fillRect(0, 0, W, H); } dust(lt, r, .03); }
  // fast depth-of-field: draw the plane at 1/k resolution, then upscale with smoothing (≈ gaussian blur, 5–10× cheaper than ctx.filter)
  const SOFTC = {}; function softLayer(bl, fn) { const k = Math.max(2, Math.min(7, Math.round(bl / 1.6) + 1)); const w = Math.ceil(W / k), h = Math.ceil(H / k); let c = SOFTC[k]; if (!c || c.width !== w || c.height !== h) c = SOFTC[k] = mkCanvas(w, h); const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); g.setTransform(1 / k, 0, 0, 1 / k, 0, 0); g.globalAlpha = 1; g.filter = 'none';
    withCtx(g, () => { ctx.save(); fn(); ctx.restore(); }); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'medium'; ctx.drawImage(c, 0, 0, w * k, h * k); ctx.restore(); }
  function heroType(H0, lt, A, R, u) {
    const t0 = H0.t, fx = H0.fx || 'slam'; if (lt < t0) return null; const p = lt - t0; const V = isV(); let size = num(H0.size, V ? 150 : 168) * u; const font = H0.font || 'impact';
    let txt = H0.id; if (H0.to && lt >= H0.toT) txt = H0.to;
    if (fx === 'count' && !(H0.to && lt >= H0.toT)) { const m = txt.match(/^(\D*)([\d.,]+)(.*)$/); if (m) { const tgt = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, from = num(H0.from, 0); const k = E.out(clamp(p / num(H0.cdur, 1.3))); txt = m[1] + (from + (tgt - from) * k).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, dec ? '' : ',') + m[3]; } }
    if (fx === 'type') { const n = Math.floor(p / .06); txt = txt.slice(0, n); }
    const maxW = W * (V ? .86 : .58); setFont(size, font); let tw = ctx.measureText(txt).width; if (tw > maxW) { size *= maxW / tw; setFont(size, font); tw = ctx.measureText(txt).width; }
    const sc = fx === 'slam' || fx === 'count' || fx === 'stamp' ? lerp(2.4, 1, E.out5(clamp(p / .35))) : 1; const al = fx === 'slam' ? clamp(p / .08) : 1;
    let jx = 0, jy = 0; if (p < .3 && fx !== 'type') { const k = (1 - p / .3) * 7 * u; jx = (Math.random() - .5) * k; jy = (Math.random() - .5) * k; }
    let col = H0.col === 'red' ? PP.red : H0.col === 'paper' ? PP.paper : H0.col === 'white' ? '#ffffff' : H0.col && H0.col[0] === '#' ? H0.col : A.acc;
    const burning = H0.to && lt < H0.toT && lt > H0.toT - .9; if (burning) { const q = 1 - (H0.toT - lt) / .9; col = q > .5 ? PP.red : col; jx += (Math.random() - .5) * 10 * u * q; jy += (Math.random() - .5) * 10 * u * q; }
    const swapP = H0.to && lt >= H0.toT ? lt - H0.toT : -1; const sc2 = swapP >= 0 ? lerp(1.9, 1, E.out5(clamp(swapP / .3))) : 1; if (swapP >= 0 && H0.toCol) col = H0.toCol === 'red' ? PP.red : H0.toCol;
    const x = H0.x * W + jx, y = H0.y * H + jy; ctx.save(); ctx.translate(x, y); ctx.scale(sc * sc2, sc * sc2); ctx.globalAlpha *= al;
    if (A.glow || (H0.glow)) { ctx.save(); ctx.shadowColor = rgba(PP.gold, .55); ctx.shadowBlur = 40 * u; T(txt, 0, 0, { size, font, fill: col, lw: 0, ls: 2 * u }); ctx.restore(); }
    if (LOOK.bright) { T(txt, 0, 6 * u, { size, font, fill: 'rgba(60,40,20,.18)', lw: 0, ls: 2 * u }); T(txt, 0, 0, { size, font, fill: col, stroke: LOOK.cur.stroke || '#fffaf0', lw: 6 * u, ls: 2 * u }); } else { T(txt, 0, 4 * u, { size, font, fill: 'rgba(0,0,0,.55)', lw: 0, ls: 2 * u }); T(txt, 0, 0, { size, font, fill: col, stroke: PP.ink, lw: 5 * u, ls: 2 * u }); }
    if (burning) embers(0, 0, tw, size, lt, u);
    ctx.restore(); return { x0: x - tw / 2, x1: x + tw / 2, y0: y - size / 2, y1: y + size / 2, size };
  }
  function embers(x, y, w, h, lt, u) { const r = rng(9); ctx.save(); for (let i = 0; i < 26; i++) { const ph = (lt * (.8 + r()) + r()) % 1; ctx.globalAlpha = (1 - ph) * .9; ctx.fillStyle = r() > .5 ? '#ff7a2a' : '#ffc04a'; ctx.beginPath(); ctx.arc(x + (r() - .5) * w, y + h * .3 - ph * h * 1.2, (2 + r() * 3) * u, 0, TAU); ctx.fill(); } ctx.restore(); }
  function supType(S0, lt, A, u, below) { if (lt < S0.t) return; const p = lt - S0.t; const V = isV(); const size = num(S0.size, V ? 50 : 56) * u; const y = (below ? below.y1 + 40 * u + size / 2 : S0.y * H) + (1 - E.out(clamp(p / .4))) * 26 * u; const x = below ? (below.x0 + below.x1) / 2 : S0.x * W;
    const col = S0.col === 'paper' ? PP.paper : S0.col === 'red' ? PP.red : LOOK.bright ? (A.sup || '#14213d') : A.acc === PP.red ? PP.paper : PP.gold2; ctx.save(); ctx.globalAlpha *= clamp(p / .35); T(S0.id, x, y, { size, font: 'cond', weight: 700, fill: col, stroke: LOOK.bright ? (LOOK.cur.stroke || '#fffaf0') : PP.ink, lw: (LOOK.bright ? 5 : 3) * u, ls: 3 * u }); ctx.restore(); }

  // ---------------------------------------------------------------- fx events
  function stamp(e, lt, u) { const p = lt - e.t; if (p < 0) return; const size = num(e.size, 84) * u; const col = e.col === 'grey' ? '#9a9a9a' : e.col === 'gold' ? PP.gold : PP.red; const sc = lerp(2.2, 1, E.out5(clamp(p / .22)));
    ctx.save(); ctx.translate(num(e.x, .72) * W, num(e.y, .3) * H); ctx.rotate(num(e.rot, -10) * Math.PI / 180); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(p / .06) * .92; setFont(size, 'impact'); const w = ctx.measureText(e.arg).width + size * .6, h = size * 1.25;
    ctx.strokeStyle = col; ctx.lineWidth = 7 * u; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.lineWidth = 2.5 * u; ctx.strokeRect(-w / 2 + 10 * u, -h / 2 + 10 * u, w - 20 * u, h - 20 * u); T(e.arg, 0, 0, { size, font: 'impact', fill: col, lw: 0, ls: 4 * u });
    ctx.globalCompositeOperation = 'destination-out'; const r = rng(e.arg.length * 13); for (let i = 0; i < 90; i++) { ctx.globalAlpha = .5; ctx.fillRect((r() - .5) * w, (r() - .5) * h, (2 + r() * 6) * u, (2 + r() * 4) * u); } ctx.restore(); }
  function strike(e, lt, box, u) { const p = lt - e.t; if (p < 0 || !box) return; const k1 = E.out(clamp(p / .14)), k2 = E.out(clamp((p - .12) / .14)); const pad = 10 * u; const { x0, y0, x1, y1 } = box;
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = PP.red; ctx.lineWidth = 16 * u; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 8 * u;
    ctx.beginPath(); ctx.moveTo(x0 - pad, y0 - pad); ctx.lineTo(lerp(x0 - pad, x1 + pad, k1), lerp(y0 - pad, y1 + pad, k1)); ctx.stroke(); if (k2 > 0) { ctx.beginPath(); ctx.moveTo(x1 + pad, y0 - pad); ctx.lineTo(lerp(x1 + pad, x0 - pad, k2), lerp(y0 - pad, y1 + pad, k2)); ctx.stroke(); } ctx.restore(); }
  function bubble(e, lt, anchor, u, i) { const p = lt - e.t; if (p < 0) return null; const size = num(e.size, 40) * u; setFont(size, 'serif', 900); const w = ctx.measureText(e.arg).width + 44 * u, h = size + 34 * u;
    const ax = anchor ? anchor.x : W * .5, ay = anchor ? anchor.y0 : H * .4; const side = e.side ? (e.side === 'l' ? -1 : 1) : (ax > W * .5 ? -1 : 1); const edge = anchor ? (side > 0 ? anchor.x1 : anchor.x0) : ax; let x = num(e.x, -1) >= 0 ? +e.x * W : edge + side * (w * .5 + 36 * u) + (i % 2) * side * 40 * u, y = num(e.y, -1) >= 0 ? +e.y * H : ay + h * .6 + (i || 0) * (h + 30 * u); x = clamp(x, w / 2 + 30 * u, W - w / 2 - 30 * u);
    const sc = E.back(clamp(p / .22)); ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = 'rgba(0,0,0,.35)'; rr(-w / 2 + 6 * u, -h / 2 + 8 * u, w, h, 6 * u); ctx.fill(); ctx.fillStyle = PP.paper; rr(-w / 2, -h / 2, w, h, 6 * u); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-side * w * .3, h / 2 - 2 * u); ctx.lineTo(-side * (w * .5 + 18 * u), h / 2 + 22 * u); ctx.lineTo(-side * w * .12, h / 2 - 2 * u); ctx.fill(); T(e.arg, 0, 2 * u, { size, font: 'serif', weight: 900, fill: PP.ink, lw: 0 }); ctx.restore();
    return { x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 }; }
  function headline(e, lt, u) { const p = lt - e.t; if (p < 0) return; const V = isV(); const w = (V ? .84 : .5) * W, size = (V ? 52 : 50) * u; const lines = wrap(e.arg.toUpperCase(), size, w - 60 * u, 'serif'); const h = 90 * u + lines.length * size * 1.08 + 120 * u;
    const x = num(e.x, V ? .5 : .68) * W, y = num(e.y, .42) * H; const k = E.out5(clamp(p / .3)); ctx.save(); ctx.translate(x + (1 - k) * W * .5, y); ctx.rotate(num(e.rot, -3) * Math.PI / 180 * k);
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-w / 2 + 12 * u, -h / 2 + 16 * u, w, h); ctx.fillStyle = '#efe8d6'; ctx.fillRect(-w / 2, -h / 2, w, h);
    T((e.src || 'THE DAILY LEDGER').toUpperCase(), 0, -h / 2 + 38 * u, { size: 26 * u, font: 'serif', weight: 900, fill: '#1a1a1a', lw: 0, ls: 3 * u }); ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-w / 2 + 24 * u, -h / 2 + 62 * u, w - 48 * u, 3 * u);
    lines.forEach((ln, i) => T(ln, 0, -h / 2 + 90 * u + size * .55 + i * size * 1.08, { size, font: 'serif', weight: 900, fill: '#111', lw: 0 }));
    ctx.fillStyle = 'rgba(20,20,20,.35)'; const yb = -h / 2 + 100 * u + lines.length * size * 1.08; for (let c = 0; c < 3; c++) for (let l = 0; l < 4; l++) ctx.fillRect(-w / 2 + 24 * u + c * (w - 48 * u) / 3, yb + l * 18 * u, (w - 48 * u) / 3 - 18 * u, 6 * u);
    ctx.restore(); }
  function chart(e, lt, u, A) { const p = lt - e.t; if (p < 0) return; const V = isV(); const x0 = num(e.x, V ? .1 : .52) * W, w = num(e.w, V ? .8 : .4) * W, y0 = num(e.y, V ? .3 : .44) * H, h = num(e.h, V ? .25 : .32) * H; const down = (e.arg || 'down') !== 'up';
    const pts = split(e.pts || (down ? '20,35,48,62,70,64,40,22,9' : '10,14,22,30,41,55,66,80,95'), ',').map(Number); const k = E.inOut(clamp(p / num(e.dur, 1.6))); const n = pts.length - 1; const col = e.col === 'gold' ? PP.gold : down ? PP.red : PP.gold2;
    ctx.save(); ctx.globalAlpha *= clamp(p / .2); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2 * u; for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(x0, y0 + h * i / 4); ctx.lineTo(x0 + w, y0 + h * i / 4); ctx.stroke(); }
    const P = i => [x0 + w * i / n, y0 + h * (1 - pts[i] / 100)]; const upto = k * n; ctx.beginPath(); for (let i = 0; i <= Math.floor(upto); i++) { const [x, y] = P(i); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } let tip = P(Math.floor(upto)); if (upto < n) { const a = P(Math.floor(upto)), b = P(Math.floor(upto) + 1), f = upto % 1; tip = [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; ctx.lineTo(tip[0], tip[1]); }
    ctx.lineWidth = 7 * u; ctx.lineJoin = 'round'; ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 18 * u; ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(tip[0], tip[1], 10 * u, 0, TAU); ctx.fill();
    if (e.lab) { const R = V || tip[0] > W * .72; T(e.lab, tip[0] + (R ? -14 : 18) * u, tip[1] - 40 * u, { size: 54 * u, font: 'impact', fill: col, stroke: PP.ink, lw: 4 * u, align: R ? 'right' : 'left' }); } ctx.restore(); }
  function leadLine(e, lt, boxes, u) { const p = lt - e.t; if (p < 0) return; const [a, b] = String(e.arg).split('>'); const A = boxes[a], B = boxes[b]; if (!A || !B) return; const k = E.inOut(clamp(p / .6)); const ax = A.x, ay = (A.y0 + A.y1) / 2, bx = B.x, by = (B.y0 + B.y1) / 2;
    ctx.save(); ctx.setLineDash([16 * u, 12 * u]); ctx.strokeStyle = PP.gold; ctx.lineWidth = 5 * u; ctx.beginPath(); ctx.moveTo(ax, ay); const mx = (ax + bx) / 2, my = Math.min(ay, by) - 120 * u; const ex = lerp(ax, bx, k), ey = lerp(ay, by, k) - Math.sin(k * Math.PI) * 60 * u; ctx.quadraticCurveTo(lerp(ax, mx, k), lerp(ay, my, k), ex, ey); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = PP.gold; ctx.beginPath(); ctx.arc(ex, ey, 9 * u, 0, TAU); ctx.fill(); ctx.restore(); }
  function dateCard(e, lt, u) { const p = lt - e.t; if (p < 0) return; const V = isV(); const size = num(e.size, V ? 64 : 72) * u; const x = num(e.x, V ? .5 : .06) * W, y = num(e.y, V ? .12 : .12) * H; const n = Math.floor(p / .045);
    ctx.save(); ctx.globalAlpha *= clamp(p / .1); const s = e.arg.slice(0, n); T(s, x, y, { size, font: 'cond', weight: 700, fill: PP.paper, stroke: PP.ink, lw: 3 * u, ls: 6 * u, align: V ? 'center' : 'left' }); const tw = textW(s, size, 'cond', 700) + 6 * u * s.length; ctx.fillStyle = PP.gold; ctx.fillRect(V ? x - tw / 2 : x, y + size * .62, tw * E.out(clamp(p / .5)), 4 * u); ctx.restore(); }


  function quoteCard(e, lt, u, light) { const qc = light ? PP.ink : PP.paper, qc2 = light ? '#7a5a10' : PP.gold2; const p = lt - e.t; if (p < 0) return; const V = isV(); const size = num(e.size, V ? 54 : 58) * u; const maxW = W * num(e.w, V ? .82 : .5); const words = e.arg.split(/\s+/); const lines = wrap(e.arg, size, maxW, 'serif'); const x = num(e.x, V ? .5 : .64) * W, y0 = num(e.y, .3) * H; const nShow = Math.floor(p / num(e.rate, .11)) + 1;
    ctx.save(); ctx.globalAlpha *= clamp(p / .15); T('“', x - maxW / 2 - 10 * u, y0 - size * .2, { size: size * 3.2, font: 'serif', weight: 900, fill: PP.gold, lw: 0, align: 'left' }); let k = 0;
    lines.forEach((ln, li) => { const ws = ln.split(' '); setFont(size, 'serif', 900); let xx = x - maxW / 2 + size * 1.1; ws.forEach(w => { if (k++ < nShow) T(w, xx, y0 + li * size * 1.2 + size * .5, { size, font: 'serif', weight: 900, fill: qc, lw: 0, align: 'left', shadow: light ? 0 : 3 * u }); setFont(size, 'serif', 900); xx += ctx.measureText(w + ' ').width; }); });
    if (e.by && nShow >= words.length) { const q = clamp((p - words.length * num(e.rate, .11)) / .3); ctx.globalAlpha *= q; T('— ' + e.by.toUpperCase(), x - maxW / 2 + size * 1.1, y0 + lines.length * size * 1.2 + size * .7, { size: size * .5, font: 'cond', weight: 700, fill: qc2, lw: 0, align: 'left', ls: 3 * u }); }
    ctx.restore(); }

  // ---------------------------------------------------------------- the beat
  const CAMS = { vertigo: { z: [1, 1], dx: 0, dy: 0, vert: 1 }, orbit: { z: [1, .3], dx: 0, dy: 0, orb: 1 }, hand: { z: [1, .5], dx: 0, dy: 0, hand: 1 }, rise: { z: [1, .6], dx: 0, dy: 1.6 }, push: { z: [1, 1], dx: 0, dy: 0 }, pull: { z: [1, -1], dx: 0, dy: 0 }, panR: { z: [1, .3], dx: -1, dy: 0 }, panL: { z: [1, .3], dx: 1, dy: 0 }, tiltU: { z: [1, .3], dx: 0, dy: 1 }, tiltD: { z: [1, .3], dx: 0, dy: -1 }, drift: { z: [1, .4], dx: -.35, dy: .2 }, hold: { z: [1, .15], dx: 0, dy: 0 } };
  let N = 0;
  SB.recipes.cine = (o, b) => {
    const { caps, end } = timeCaps(b.caps, .12, .06, b.capStyle); const at = clock(caps); const idx = ++N; const dur = Math.max(num(o.dur, 0), end + .25, 2.2);
    const LK = (o.look && LOOKS[o.look]) || EPLOOK; const A = LK.acts[o.act] || LK.acts.setup; const bgKind = o.bg || A.bg; const cam = CAMS[o.cam] || CAMS[['push', 'drift', 'panR', 'pull', 'panL'][idx % 5]];
    const crash = o.crash ? at(o.crash) : -1;
    const V = isV;
    const mids = split(o.mid).map(item).map((m, i, all) => { const n = all.length; const defX = n === 1 ? (o.side === 'r' ? .66 : .34) : n === 2 ? [.3, .7][i] : .2 + .6 * i / (n - 1); const hh = num(m.h, n > 2 ? .44 : .6); return { ...m, x: num(m.x, defX), h: hh, y: m.y !== undefined ? +m.y : num(m.bottom, .8) - hh / 2, vx: num(m.vx, n === 1 ? .5 : .25 + .5 * i / Math.max(1, n - 1)), vh: num(m.vh, n > 1 ? .3 : .42), vy: m.vy !== undefined ? +m.vy : (n === 1 ? .72 : .5 + (i % 2) * .2) - num(m.vh, n > 1 ? .3 : .42) / 2, t: at(m.at, .15 + i * .3), d: 1 + .1 * (i % 3) * .7 }; });
    const fgs = split(o.fg).map(item).map((f, i) => ({ ...f, x: num(f.x, .5 + (i - .5) * .3), y: num(f.y, .92), h: num(f.h, .22), vx: num(f.vx, .5), vy: num(f.vy, .86), vh: num(f.vh, .16), t: at(f.at, .5 + i * .25) }));
    const firstMid = mids[0]; const heroAuto = firstMid ? (firstMid.x < .5 ? [.68, .3] : [.32, .3]) : [.5, .42];
    const hero = o.hero ? (() => { const h = item(o.hero); const pos = h.pos; const xy = pos === 't' ? [.5, .18] : pos === 'c' ? [.5, .45] : pos === 'l' ? [.3, .38] : pos === 'r' ? [.7, .38] : pos === 'b' ? [.5, .7] : heroAuto; return { ...h, x: num(h.x, xy[0]), y: num(h.y, xy[1]), vx: num(h.vx, .5), vy: num(h.vy, mids.length ? .17 : .4), t: at(h.at, .2), toT: h.to ? at(h.toAt, dur - 1) : 1e9 }; })() : null;
    const sup = o.sup ? (() => { const s = item(o.sup); return { ...s, x: num(s.x, hero ? hero.x : .5), y: num(s.y, .6), t: at(s.at, (hero ? hero.t : 0) + .35) }; })() : null;
    const fx = split(o.fx).map(item).map(e => { const k = e.id.indexOf(':'); return { ...e, type: k > 0 ? e.id.slice(0, k) : e.id, arg: k > 0 ? e.id.slice(k + 1) : '', t: at(e.at, .5) }; });
    // sound: every visual event gets its own hit (no music on this channel)
    const sfx = []; mids.forEach(m => sfx.push([m.t, m.in === 'rise' ? 'whoosh_up' : 'impact_thump', .7])); fgs.forEach(f => sfx.push([f.t, f.id === '@cash' || f.id === '@coins' ? 'foley_coins' : 'foley_paper', .6]));
    if (hero) { sfx.push([Math.max(0, hero.t - .25), 'whoosh_reverse', .5]); sfx.push([hero.t, hero.fx === 'type' ? 'ui_typing' : 'impact_cinematic', .85]); if (hero.fx === 'count') sfx.push([hero.t + .05, 'ui_counter', .6]); if (hero.to) { sfx.push([hero.toT - .9, 'whoosh_fire', .6]); sfx.push([hero.toT, 'hit_sub_drop', .9]); } }
    if (sup) sfx.push([sup.t, 'ui_text_reveal', .45]);
    const FXS = { stamp: 'stamp', strike: 'ui_error', bubble: 'ui_pop', flash: 'hit_braam', headline: 'foley_paper_flutter', chart: 'ui_data_blip', line: 'foley_marker', shatter: 'battle_glass_break', date: 'ui_typing', quote: 'foley_pen_write', shake: 'impact_big', drop: 'whoosh_down', red: 'riser_tension' };
    fx.forEach(e => { if (FXS[e.type]) sfx.push([e.t, e.sfx || FXS[e.type], .8]); if (e.type === 'drop') sfx.push([e.t + .55, 'battle_glass_break', .8]); if (e.type === 'flash' && e.arg === 'red') sfx.push([e.t, 'hit_boom', .9]); });
    if (crash >= 0) sfx.push([crash, 'whoosh_slash', .7]); fx.forEach(e => { const xe = EXT[e.type]; if (xe && xe.sfx) (typeof xe.sfx === 'function' ? xe.sfx(e, at) : [[e.t, xe.sfx, .7]]).forEach(q => sfx.push(q)); if (xe && xe.prep) xe.prep(e, at, caps); });
    if (hero && o.riser !== 'off' && (o.act === 'fall' || o.act === 'lesson' || o.big)) sfx.push([Math.max(0, hero.t - 1.2), 'riser_tension', .45]);
    const shakes = fx.filter(e => e.type === 'shake' || e.type === 'stamp' || e.type === 'flash').map(e => [e.t, num(e.amp, e.type === 'shake' ? 1 : .45)]); if (hero && hero.fx !== 'type') shakes.push([hero.t, .6]);
    const fgNeg = (o.neg || '') === 'off';
    const rig = window.PPCAM && o.shot ? window.PPCAM.build(o, at, dur, { mids, fgs, hero }) : null; // v4 camera rig (pp_cam.js)

    // v5.1 EDIT LIFE: **hit words** in the caption → a camera punch (+3.5 %, 0.12 s attack) and a soft hit, on the word;
    // long collage beats without a directed camera → an automatic re-frame (a "cut" to a tighter angle) at each clause break
    const capTxt = (b.caps || []).map(c => String(c)).join(' '); const hitWords = [...capTxt.matchAll(/\*\*([^*]+)\*\*/g)].map(m => m[1].trim().split(/\s+/)[0]).filter(Boolean);
    const hitT = o.hits === 'off' ? [] : hitWords.map(w => at(w.replace(/[^A-Za-z0-9$%€£.'-]/g, ''), -1)).filter(t => t >= 0);
    const worldFx = fx.some(e => EXT[e.type] && EXT[e.type].world); const reframes = [];
    if (!o.shot && !worldFx && o.reframe !== 'off' && dur >= 4.5) { const toks = capTxt.replace(/\*\*/g, '').split(/\s+/); toks.forEach((w, i) => { if (/[,;:]$/.test(w) && i < toks.length - 2) { const t = at(toks[i + 1].replace(/[^A-Za-z0-9$%€£.'-]/g, ''), -1); if (t > .8 && t < dur - .8) reframes.push(t); } }); }
    hitT.forEach(t => sfx.push([Math.max(0, t - .02), 'hit_soft', .35]));
    // v5.2 freshness: each hit gets one of 7 accent styles, in an order that differs per EPISODE (seed) and never repeats
    // back-to-back; ~40 % of hits get no accent at all, so the rhythm breathes instead of ticking like a metronome
    const STY = ['in', 'tiltL', 'panR', 'out', 'in', 'tiltR', 'panL']; const seed = window.PPCINE.EPSEED || 0;
    const hitSty = hitT.map((t, i) => { const g = (idx * 7 + i * 3 + seed) % 97; return g % 5 < 2 ? 'none' : STY[(idx * 3 + i * 5 + seed) % STY.length]; });
    const punch = lt => { let z = 1, dx = 0, rot = 0; hitT.forEach((th, i) => { const x = lt - th; const st = hitSty[i]; if (x < 0 || st === 'none') return; const e1 = x < .12 ? E.out(x / .12) : Math.max(.35, 1 - (x - .12) / 1.4 * .65);
        if (st === 'in') z += .035 * e1; else if (st === 'out') z -= .03 * e1; else if (st === 'tiltL' || st === 'tiltR') { rot += (st === 'tiltL' ? -1 : 1) * .012 * e1; z += .02 * e1; } else { dx += (st === 'panL' ? -1 : 1) * .018 * e1; z += .02 * e1; } });
      reframes.forEach((tr, i) => { if (lt >= tr) { z += (i % 2 ? -.06 : .07); dx += i % 2 ? 0 : ((i + seed) % 4 ? -.02 : .02); } }); return [Math.max(.97, z), dx, rot]; };
    const render = (lt) => { const [pz, pdx, prot] = punch(lt); if (pz === 1 && !pdx && !prot) return render0(lt); const zz = Math.max(pz, 1 + Math.abs(pdx) * 2.2 + Math.abs(prot) * 1.8); ctx.save(); ctx.translate(W / 2 + pdx * W, H * .45); ctx.rotate(prot); ctx.scale(zz, zz); ctx.translate(-W / 2, -H * .45); render0(lt); ctx.restore(); };
    const render0 = (lt) => { useLook(LK); const u = U(), v = V(); const k = clamp(lt / dur); const kk = E.sine(k);
      let sh = 0; shakes.forEach(([t, a]) => { const p = lt - t; if (p >= 0 && p < .3) sh = Math.max(sh, a * (1 - p / .3)); }); const sx = sh ? (Math.random() - .5) * 18 * u * sh : 0, sy = sh ? (Math.random() - .5) * 18 * u * sh : 0;
      let cz = 0; if (crash >= 0 && lt > crash) cz = .22 * E.out5(clamp((lt - crash) / .18));
      const hx = cam.hand || o.hand ? fbm(lt * 1.3 + 3) * 9 * u : 0, hy = cam.hand || o.hand ? fbm(lt * 1.1 + 9) * 7 * u : 0; const cs = rig ? rig.state(lt, v) : null; const layer = rig ? (depth, fn) => { const bl = rig.blurOf(cs, depth, u); if (bl > .6 && !window.PP_SLOWBLUR) { softLayer(bl, () => { ctx.translate(sx * depth * .6, sy * depth * .6); rig.apply(cs, depth, lt, u); fn(); }); return; } ctx.save(); ctx.translate(sx * depth * .6, sy * depth * .6); rig.apply(cs, depth, lt, u); if (bl > .4 && window.PP_SLOWBLUR) ctx.filter = `blur(${bl.toFixed(1)}px)`; fn(); ctx.restore(); } : (depth, fn) => { let z = 1 + (cam.z[1] > 0 ? kk : 1 - kk) * .05 * depth * Math.abs(cam.z[1]) + cz * depth * .5; if (cam.vert) z = depth < 1.9 ? 1.2 - kk * .18 : 1 + kk * .12 * (depth - 1.4); let dx = cam.dx * (kk - .5) * W * .025 * depth, dy = cam.dy * (kk - .5) * H * .025 * depth; if (cam.orb) dx = (kk - .5) * W * .05 * (depth - 2); dx += hx * depth * .5; dy += hy * depth * .5; ctx.save(); ctx.translate(W / 2 + dx + sx * depth * .6, H / 2 + dy + sy * depth * .6); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); fn(); ctx.restore(); };
      // BG
      layer(1, () => { if (BGX[bgKind]) { BGX[bgKind](lt, o, { at, dur, A, u, idx, procBg }); } else if (/^clip:/.test(bgKind) && HAS(bgKind)) { const id = clipFrame(bgKind, lt); const T0 = toned(id, o.bgTone || 'navy', 0); const im = T0.c, s2 = Math.max(W / im.width, H / im.height) * 1.08; ctx.save(); ctx.filter = `blur(${num(o.bgBlur, 6) * u}px) brightness(${1 - num(o.bgDim, .45)})`; ctx.drawImage(im, (W - im.width * s2) / 2, (H - im.height * s2) / 2, im.width * s2, im.height * s2); ctx.restore(); } else if (HAS(bgKind)) { const L = LOOK.cur, P = L.plate; const c = blurredPlate(bgKind, num(o.bgBlur, P.blur), num(o.bgDim, P.dim), o.bgTone || (P.toneBy || {})[o.act] || P.tone); if (P.blend === 'multiply') { ctx.drawImage(L.dossier ? dossierPaper('cream', 3) : lookPaper(L, 'cream'), 0, 0); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = num(o.bgAlpha, P.alpha); ctx.drawImage(c, (W - c.width) / 2, (H - c.height) / 2); ctx.restore(); } else ctx.drawImage(c, (W - c.width) / 2, (H - c.height) / 2); ctx.fillStyle = P.wash; ctx.fillRect(0, 0, W, H); }
        else if (IMAGES_ID(bgKind)) { procBg('navy', lt, idx); missing(bgKind, W * .5, H * .5, H * .3); } else procBg(bgKind, lt, idx * 7 + 1); });
      if (o.date) dateCard({ arg: o.date, t: at(o.dateAt, .05) }, lt, u);
      const X = { at, dur, A, u, idx, bgKind, layer, o };
      fx.forEach(e => { const xe = EXT[e.type]; if (xe && xe.draw && xe.under) layer(xe.d || 1.4, () => xe.draw(e, lt, X)); });
      fx.forEach(e => { const xe = EXT[e.type]; if (xe && xe.world) xe.draw(e, lt, X); }); // v4 set pieces: draw their own planes through X.layer
      // MID
      const boxes = {}; X.boxes = boxes; mids.forEach((m, i) => { const mx = (v ? m.vx : m.x) * W, my = (v ? m.vy : m.y) * H, mh = (v ? m.vh : m.h) * H; const p = lt - m.t; const sh2 = fx.find(e => e.type === 'shatter' && (e.arg === String(i + 1) || e.arg === m.id));
        layer(2 + (i % 3) * .35, () => { if (p < 0) return; if (m.id[0] === '@') { const nm = m.id.slice(1); if (!PROP[nm]) return; const k3 = E.out5(clamp(p / .3)); const sc3 = lerp(1.25, 1, k3); boxes[i + 1] = { x: mx, y0: my - mh / 2, y1: my + mh / 2, x0: mx - mh * .3, x1: mx + mh * .3 }; ctx.save(); ctx.globalAlpha *= clamp(p / .08); ctx.translate(mx, my + (BASE.has(nm) ? mh * .45 : 0)); ctx.rotate(num(m.rot, 0) * Math.PI / 180); ctx.scale(sc3, sc3); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 14 * u; PROP[nm](mh / 1.25, lt, m); ctx.restore(); return; }
          const mid_ = /^clip:/.test(m.id) ? clipFrame(m.id, p) : m.id; const tc = HAS(m.id) ? toned(mid_, m.tone || midTone(o.act), m.border === 'off' ? 0 : 1, m.style || 'print') : null;
          const inn = m.in || 'slap'; let sc = 1, oy = 0, ox = 0, al = 1, rot = num(m.rot, ((i % 2) ? 1.6 : -1.4)) * Math.PI / 180;
          let blurIn = 0; if (inn === 'drop') { oy = -(1 - E.out5(clamp(p / .55))) * H * .7; blurIn = (1 - clamp(p / .6)) * 18; } else if (inn === 'zoom') { sc = lerp(.2, 1, E.back(clamp(p / .45))); } else if (inn === 'develop') { al = 1; } else if (inn === 'slap') { sc = lerp(1.22, 1, E.out5(clamp(p / .25))); al = clamp(p / .06); } else if (inn === 'rise') { oy = (1 - E.out5(clamp(p / .5))) * H * .5; } else if (inn === 'slideL') { ox = -(1 - E.out5(clamp(p / .4))) * W * .6; } else if (inn === 'slideR') { ox = (1 - E.out5(clamp(p / .4))) * W * .6; }
          const breathe = 1 + Math.sin(lt * 1.3 + i) * .006;
          if (!tc) { missing(m.id, mx, my, mh); boxes[i + 1] = { x: mx, y0: my - mh / 2, y1: my + mh / 2, x0: mx - mh * .35, x1: mx + mh * .35 }; return; }
          const s = mh / tc.h; const cw = tc.c.width * s, ch = tc.c.height * s; const flip = m.flip === '1';
          boxes[i + 1] = boxes[m.id] = { x: mx + ox, y0: my - mh / 2 + oy, y1: my + mh / 2 + oy, x0: mx + ox - tc.w * s / 2, x1: mx + ox + tc.w * s / 2, tc, s, cx: mx + ox, cy: my + oy };
          const rp = fx.find(e => EXT[e.type] && EXT[e.type].midFx && (e.arg === String(i + 1) || e.arg === m.id) && lt >= e.t); if (rp) { EXT[rp.type].midFx(rp, lt, { c: tc.c, x: mx + ox, y: my + oy, w: cw, h: ch, rot: num(m.rot, ((i % 2) ? 1.6 : -1.4)) * Math.PI / 180, u }); return; }
          if (sh2 && lt >= sh2.t) { drawShattered(tc.c, mx + ox, my + oy, cw, ch, clamp((lt - sh2.t - .12) / 1.9), idx * 31 + i); return; }
          ctx.save(); ctx.globalAlpha *= al; if (blurIn > .3) ctx.filter = `blur(${blurIn * u}px)`; ctx.translate(mx + ox, my + oy); ctx.rotate(rot); ctx.scale(sc * breathe * (flip ? -1 : 1), sc * breathe); ctx.drawImage(tc.c, -cw / 2, -ch / 2, cw, ch); if (m.tape) tapes(cw, ch, u, i); if (inn === 'develop' && p < 1.6) { const q = clamp(p / 1.6); ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = `rgba(${q < .5 ? '42,107,94' : '245,241,232'},${(1 - q) * .9})`; ctx.fillRect(-cw / 2, -ch / 2, cw, ch); ctx.globalCompositeOperation = 'source-over'; } ctx.filter = 'none'; ctx.restore();
          if (m.lab && p > .25) { const lp = clamp((p - .25) / .3); const ly = Math.min(my + oy + mh / 2 - 34 * u, H * .8); ctx.save(); ctx.globalAlpha *= lp; const ls = (v ? 26 : 30) * u; const tw = textW(m.lab, ls, 'cond', 700) + m.lab.length * 3 * u; ctx.fillStyle = 'rgba(10,18,32,.86)'; ctx.fillRect(mx + ox - tw / 2 - 16 * u, ly - ls * .75, tw + 32 * u, ls * 1.5); ctx.fillStyle = PP.gold; ctx.fillRect(mx + ox - tw / 2 - 16 * u, ly - ls * .75, 5 * u, ls * 1.5); T(m.lab, mx + ox, ly, { size: ls, font: 'cond', weight: 700, fill: PP.paper, lw: 0, ls: 3 * u }); ctx.restore(); } }); });
      // TYPE (on the mid plane, a little faster than the subject)
      let hb = null; if (hero) layer(2.4, () => { const h2 = v ? { ...hero, x: hero.vx, y: hero.vy } : hero; hb = heroType(h2, lt, A, null, u); }); if (sup) layer(2.4, () => supType(v ? { ...sup, x: .5, y: (hero ? hero.vy : .4) + .1 } : sup, lt, A, u, hb));
      // FX that live in the world
      let bi = 0; fx.forEach(e => { if (e.type === 'stamp') layer(2.6, () => stamp(e, lt, u)); else if (e.type === 'headline') layer(2.2, () => headline(e, lt, u)); else if (e.type === 'chart') layer(2, () => chart(e, lt, u, A)); else if (e.type === 'line') layer(2, () => leadLine(e, lt, boxes, u)); else if (e.type === 'date') dateCard(e, lt, u); else if (e.type === 'quote') layer(2.2, () => quoteCard(e, lt, u, /^(paper|flash)$/.test(bgKind)));
        else if (e.type === 'bubble') { const on = boxes[e.on || 1]; const j = bi++; layer(2.4, () => { const bb = bubble(e, lt, on, u, j); if (bb) boxes['b' + (j + 1)] = bb; }); } });
      fx.forEach(e => { const xe = EXT[e.type]; if (xe && xe.draw && !xe.under && !xe.screen && !xe.world) layer(xe.d || 2.4, () => xe.draw(e, lt, X)); });
      fx.forEach(e => { if (e.type === 'strike') layer(2.5, () => strike(e, lt, boxes[e.arg] || boxes['b' + e.arg] || (e.arg === 'hero' ? hb : null), u)); });
      // FG
      fgs.forEach((f, i) => { const p = lt - f.t; if (p < 0) return; layer(3 + i * .3, () => { const fx2 = (v ? f.vx : f.x) * W, fy = (v ? f.vy : f.y) * H, fh = (v ? f.vh : f.h) * H; const k2 = E.out5(clamp(p / .4)); const yy = fy + (1 - k2) * H * .35; const drop = fx.find(e => e.type === 'drop' && (e.arg === f.id.slice(1) || e.arg === String(i + 1)));
        if (f.id[0] === '@') { const nm = f.id.slice(1); if (!PROP[nm]) return; let py = yy, broken = false; if (drop && lt >= drop.t) { const q = lt - drop.t; const fall = Math.min(q, .55); py = lerp(H * -.2, fy, (fall / .55) ** 2); broken = q > .55; if (q > .55 && q < .7) { ctx.save(); ctx.translate(0, (Math.random() - .5) * 6 * u); ctx.restore(); } } else if (drop) return;
          ctx.save(); ctx.translate(fx2, py - (BASE.has(nm) ? 0 : fh * .55)); ctx.rotate(num(f.rot, 0) * Math.PI / 180); ctx.scale(1 + Math.sin(lt * 1.6 + i) * .01, 1); PROP[nm](fh, lt, { ...f, broken }); ctx.restore(); return; }
        const tc = HAS(f.id) ? toned(/^clip:/.test(f.id) ? clipFrame(f.id, p) : f.id, f.tone || 'color', 1, f.style || 'print') : null; if (!tc) return missing(f.id, fx2, yy - fh / 2, fh); const s = fh / tc.h; ctx.drawImage(tc.c, fx2 - tc.c.width * s / 2, yy - tc.c.height * s + tc.pad * s, tc.c.width * s, tc.c.height * s); }); });
      fx.forEach(e => { const xe = EXT[e.type]; if (xe && xe.draw && xe.screen && !xe.post) xe.draw(e, lt, X); });
      // GRADE per act (colour tells the story) + red creep + flashes + vignette
      ctx.save(); if (A.sat) { ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = A.sat; ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, W, H); } ctx.globalCompositeOperation = A.op; ctx.globalAlpha = A.a; ctx.fillStyle = A.tint; ctx.fillRect(0, 0, W, H); ctx.restore();
      const redT = fx.find(e => e.type === 'red'); if (A.red || redT) { const q = redT ? E.inOut(clamp((lt - redT.t) / 2.2)) : .35 + .25 * k; if (q > 0) { const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * (.75 - q * .4), W / 2, H / 2, Math.hypot(W, H) * .6); g.addColorStop(0, 'rgba(192,57,43,0)'); g.addColorStop(1, `rgba(192,57,43,${.55 * q})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } }
      fx.filter(e => e.type === 'flash').forEach(e => { const p = lt - e.t; if (p < 0 || p > .45) return; ctx.save(); ctx.globalAlpha = (1 - p / .45) * (e.arg === 'white' ? .85 : e.arg === 'gold' ? .32 : .55); ctx.globalCompositeOperation = e.arg === 'white' ? 'screen' : 'source-over'; ctx.fillStyle = e.arg === 'red' ? PP.red : e.arg === 'gold' ? PP.gold : '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); });
      if (A.sepia) { ctx.save(); ctx.globalAlpha = .08 + .05 * Math.abs(Math.sin(lt * 23)); ctx.fillStyle = '#f2e3c0'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .42, W / 2, H / 2, Math.hypot(W, H) * .58); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(${A.red ? LOOK.cur.vig.red : LOOK.cur.vig.col},${num(o.vig, A.red ? LOOK.cur.vig.ra : LOOK.cur.vig.a)})`); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      fx.filter(e => EXT[e.type] && EXT[e.type].draw && EXT[e.type].post).sort((a, b) => (EXT[a.type].order || 0) - (EXT[b.type].order || 0)).forEach(e => EXT[e.type].draw(e, lt, X)); if (A.sepia) { const r = rng(Math.floor(lt * 12)); ctx.save(); ctx.strokeStyle = 'rgba(40,30,20,.35)'; ctx.lineWidth = 1.2 * u; for (let i = 0; i < 3; i++) { const x = r() * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (r() - .5) * 20 * u, H); ctx.stroke(); } ctx.fillStyle = 'rgba(30,20,10,.5)'; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(r() * W, r() * H, r() * 2.5 * u, 0, TAU); ctx.fill(); } ctx.restore(); }
      if (rig) rig.post(cs, rig.state(Math.max(0, lt - 1 / 30), v));
      if (!o.raw) finish(lt, A);
      // caption band protection: a soft dark floor so the caption never sits on a busy foreground
      const cb = ctx.createLinearGradient(0, H * .82, 0, H); cb.addColorStop(0, 'rgba(5,8,14,0)'); cb.addColorStop(1, LOOK.bright ? 'rgba(5,8,14,.3)' : 'rgba(5,8,14,.55)'); ctx.fillStyle = cb; ctx.fillRect(0, H * .82, W, H * .18);
    };
    return { dur, render, captions: caps, sfx: sfx.filter(s => s[0] >= 0 && s[0] < dur), look: { grade: 'clean' }, pp: { ev: [...mids.map(m => m.t), ...fgs.map(f => f.t), ...(hero ? [hero.t] : []), ...(hero && hero.to ? [hero.toT] : []), ...(sup ? [sup.t] : []), ...fx.map(e => e.t)].sort((a, b) => a - b), mids: mids.length, fgs: fgs.length, hero: !!hero, fx: fx.length, bg: bgKind, shots: rig ? rig.shots : 0, moves: rig ? rig.kfs.map(k => k.move || 'cut') : [] } };
  };
  const IMAGES_ID = id => !!id && !BGX[id] && !/^(navy|paper|black|news|chart|spot|flash|cork|wood|cream)$/.test(id);

  // ---------------------------------------------------------------- end card
  SB.recipes.ppend = (o, b) => { const { caps, end } = timeCaps(b.caps, .2, .06, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .4, 3.2);
    const render = lt => { const u = U(), v = H > W; procBg('spot', lt, 5); const pk = E.out5(clamp((lt - .1) / .5)); ctx.save(); ctx.translate(W / 2, H * (v ? .4 : .36) - (1 - pk) * H * .5); ctx.rotate(lerp(-1.2, 0, pk)); PROP.pill((v ? 150 : 170) * u, lt, {}); ctx.restore();
      const tk = lt - .55; if (tk > 0) { const s = lerp(2.2, 1, E.out5(clamp(tk / .32))); ctx.save(); ctx.translate(W / 2, H * (v ? .56 : .6)); ctx.scale(s, s); ctx.globalAlpha *= clamp(tk / .08); T(o.name || 'POISON PILL', 0, 0, { size: (v ? 120 : 150) * u, font: 'impact', fill: PP.paper, stroke: PP.ink, lw: 5 * u, ls: 14 * u }); ctx.restore(); }
      const sk = lt - 1.1; if (sk > 0) { ctx.save(); ctx.globalAlpha *= clamp(sk / .4); T(o.sub || 'Subscribe for the next case.', W / 2, H * (v ? .64 : .72) + (1 - E.out(clamp(sk / .4))) * 20 * u, { size: (v ? 44 : 50) * u, font: 'cond', weight: 700, fill: PP.gold2, lw: 0, ls: 3 * u }); ctx.restore(); }
      const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .4, W / 2, H / 2, Math.hypot(W, H) * .6); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.5)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); };
    return { dur, render, captions: caps, sfx: [[.1, 'whoosh_down', .7], [.55, 'impact_cinematic', .9], [1.1, 'ui_text_reveal', .5]], look: { grade: 'clean' } }; };

  // ---------------------------------------------------------------- channel mode: header `channel: poisonpill`
  const ALLOWED = new Set(['cut', 'whip', 'whipUp', 'flash', 'zoom', 'tear', 'burn', 'glitch', 'lightleak', 'push', 'portal']);
  const BANNED = /^(fade|dissolve|cube|spin|circles|iris|paper|ink|inkbleed|blobs|liquid|bloom|ripple|stripes|stripes2|brand|slide)$/;
  const compile0 = SB.compile; let ppMode = false;
  SB.compile = (text, opts) => { const on = /^\s*channel\s*:\s*poison\s*pill\s*$/im.test(text);
    if (!on) { ppMode = false; setLook(false); return compile0(text, opts); } ppMode = true; N = 0; text = text.replace(/\s*\[(BEAT|DROP)\]\s*/g, ' \u200b ').replace(/\s*\(J\)/g, ''); const lm = text.match(/^\s*look\s*:\s*([a-z]+)\s*$/im); setLook(lm ? (lm[1] === 'dark' ? 'noir' : lm[1]) : 'dossier');
    // v5.1 AUTO TRANSITIONS (motivated, rationed): an act change gets the look's chapter transition (paper → tear, tech/retro
    // → glitch, others → burn; into/out of a flashback → lightleak); a sentence opening with But/Yet/However → whip. At most one
    // stylised transition every 5 beats; anything written as trans= wins; header `autotrans: off` disables it.
    const ttl = (text.match(/^\s*title\s*:\s*(.+)$/im) || [])[1] || ''; let hs = 0; for (const ch of ttl) hs = (hs * 31 + ch.charCodeAt(0)) >>> 0; window.PPCINE.EPSEED = hs % 9973;
    if (!/^\s*autotrans\s*:\s*off\s*$/im.test(text)) { const lk = (text.match(/^\s*look\s*:\s*([a-z]+)\s*$/im) || [])[1] || 'dossier'; const pool0 = /^(dossier|vintage|eastern|editorial)$/.test(lk) ? ['tear', 'burn', 'push', 'zoom', 'lightleak'] : /^(tech|retro)$/.test(lk) ? ['glitch', 'push', 'zoom', 'burn', 'flash'] : ['burn', 'push', 'zoom', 'tear', 'lightleak'];
      const pool = pool0.map((t, i) => [t, (i * 7919 + hs) % 101]).sort((a, b) => a[1] - b[1]).map(a => a[0]); let ci = 0; const usedT = {}; const chapNext = () => { for (let k = 0; k < pool.length; k++) { const t = pool[(ci + k) % pool.length]; if ((usedT[t] || 0) < 2) { ci = (ci + k + 1) % pool.length; usedT[t] = (usedT[t] || 0) + 1; return t; } } return 'cut'; };
      const L = text.split('\n'); let prevAct = null, last = -99, bi = -1;
      for (let i = 0; i < L.length; i++) { if (!/^#\s*cine\b/.test(L[i])) continue; bi++; const act = (L[i].match(/\bact=(\w+)/) || [])[1] || 'setup'; let cap = ''; for (let j = i + 1; j < L.length; j++) { if (!L[j].trim()) continue; if (L[j].startsWith('#')) break; cap = L[j]; break; }
        if (bi > 0 && !/\btrans=/.test(L[i]) && bi - last >= 5) { let t = null; if (prevAct && act !== prevAct) t = (act === 'flash' || prevAct === 'flash') ? 'lightleak' : chapNext(); else if (/^\s*(\*\*)?(but|yet|however)\b/i.test(cap)) t = 'whip'; if (t) { L[i] += ' trans=' + t; last = bi; } }
        prevAct = act; } text = L.join('\n'); }
    // transitions: default hard cut; only motivated ones are allowed — fades, iris, slides & 3D flips are refused
    const fixed = String(text).replace(/\btrans=(\w+)/g, (m, t) => (ALLOWED.has(t) || (window.PPCINE.ALLOW_TRANS || []).includes(t)) ? m : (t === 'match' ? 'trans=zoom' : 'trans=cut'));
    const ep = compile0(fixed.replace(/^(#\s*(?:cine|ppend|ppcase)\b(?![^\n]*\btrans=)[^\n]*)$/gm, '$1 trans=cut'), opts);
    ep.scenes.forEach((s, i) => { if (s.transition && BANNED.test(s.transition.type) && !(window.PPCINE.ALLOW_TRANS || []).includes(s.transition.type)) s.transition = { type: 'cut', dur: 0 }; if (s.transition && s.transition.type === 'cut') s.transition.dur = 0; });
    const noEnd = /^\s*endcard\s*:\s*off\s*$/im.test(text); const last = ep.scenes[ep.scenes.length - 1]; if (last && last.id === 'end') { ep.scenes.pop(); if (!noEnd && !ep.scenes.some(s => /_ppend$/.test(s.id))) ep.scenes.push({ ...SB.recipes.ppend({}, { caps: [] }), id: 'ppend', transition: { type: 'cut', dur: 0 } }); }
    ep.look = { ...(ep.look || {}), grade: 'clean' }; ep.channel = 'poisonpill'; if (!/^\s*post\s*:\s*on\s*$/im.test(text)) { ep.post = false; ep.finish = { ...(ep.finish || {}), grain: true }; } return ep; }; // the channel grades itself: skip the engine's WebGL post pass (≈ 100 ms/frame on CPU)
  // captions on this channel: one fixed style, 38 u, bottom 10 %, white + gold numbers, never moved
  const cap0 = window.caption; window.caption = function (text, t0, t1, t, o = {}) { if (!ppMode) return cap0(text, t0, t1, t, o); if (t < t0 || t > t1) return; const u = U(), v = H > W; const out = clamp((t1 - t) / .12), pin = clamp((t - t0) / .12);
    const size = (v ? 40 : 38) * u, maxW = W * (v ? .84 : .72); const raw = String(text).replace(/[\*\[\]]/g, ''); const lines = wrap(raw, size, maxW, 'body'); const lh = size * 1.22; const yB = v ? H * .80 : H * .915; const y0 = yB - (lines.length - 1) * lh;
    ctx.save(); ctx.globalAlpha *= out * pin; lines.forEach((ln, i) => { setFont(size, 'body', 700); const tw = ctx.measureText(ln).width; let x = W / 2 - tw / 2; ln.split(/(\s+)/).forEach(w => { if (!w) return; T(w, x, y0 + i * lh, { size, font: 'body', weight: 700, align: 'left', fill: /\d|\$/.test(w) ? PP.gold2 : '#ffffff', stroke: 'rgba(5,8,14,.9)', lw: size * .16, shadow: 3 * u, shadowCol: 'rgba(0,0,0,.6)' }); setFont(size, 'body', 700); x += ctx.measureText(w).width; }); }); ctx.restore(); };
  try { caption = window.caption; } catch (e) { }
  try { Object.assign(TRANS, { cine: ['cut'], ppend: ['cut'] }); } catch (e) { }
  window.PPCINE = { THEME, LOOK, LOOKS, useLook, setLook, brightBg, CAMS, heroType, supType, PP, ACT, PROP, EXT, BGX, stamp, dateCard, headline, toned, rr, rrc, num, split, item, HAS, clipFrame, procBg, dust, wrap: (...a) => wrap(...a), missing: () => [...MISSING] };
})();
