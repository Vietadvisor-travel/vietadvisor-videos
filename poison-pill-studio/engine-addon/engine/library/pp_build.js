/* Poison Pill v5.2 — BUILD: the free-form scene composer. Instead of picking a template, the director INVENTS the picture of
   each sentence from elements and verbs, timed to its words. Any real photo, cut-out or generated prop; 24 drawn icons;
   kinetic text; counters; arrows; tags — each with motion verbs. Everything idles (breathes, floats) so nothing is dead.
   fx="build:x;el:<K>=<element>,x,y,size~…;do:<K>.<verb>[:<arg>]@<word>~…"
   ELEMENTS  @<image id>,x,y,h          real photo / cut-out / generated prop (h = height as a fraction of the frame)
             icon:<name>[*N],x,y,h      person coin dollar building factory store house car truck ship plane phone laptop doc
                                        chart_up chart_down bank lock key bulb gear globe crown bomb (×N = a crowd/pile of them)
             txt:<TEXT>,x,y,size[,red|gold|ink|paper]   num:<value>[:pre[:unit]],x,y,size   tag:<LABEL>,x,y,size
             arrow:<A>><B>              a drawn arrow between two elements     line:<A>-<B>  a plain connector
   VERBS     enter : pop rise drop slideL slideR unfold zoom fade type(txt) draw(arrow)      (default: pop, staggered)
             act   : grow[:k] shrink[:k] pulse shake spin flip tilt swing float move:x,y follow:<K> multiply:N count(num)
                     glow dim red gray stamp:<TEXT> crack burn explode fall vanish
   Example — "They raised $1.75 billion, spent it on ads, and it was gone in six months."
     fx="build:x;el:C=icon:coin*14,.3,.55,.1~N=num:1750000000:$,.3,.22,110~A=icon:phone,.72,.55,.32~R=arrow:C>A;
         do:N.count@raised~C.multiply:14@raised~R.draw@spent~C.follow:A@spent~A.glow@ads~A.burn@gone~N.red@gone" */
(function () {
  if (!window.PPCINE) return; const { EXT, num, split, toned, HAS, PP, LOOK } = window.PPCINE;
  let INK = '#14213d', RED = '#c0392b', CARD = '#f6efdf', SH = 'rgba(40,25,10,.38)', DK = 0;
  const thm = () => { const t = window.PPCINE.THEME(); INK = t.ink; RED = t.red; CARD = t.card; SH = t.sh; DK = t.dark; };
  const lookTone = () => (LOOK.cur && LOOK.cur.mid && LOOK.cur.mid.tone) || 'aged';
  const getImg = (id, tone) => { id = String(id || '').replace(/^@/, '').trim(); return id && HAS(id) ? toned(id, tone || lookTone(), 0, 'print').c : null; };
  const big = (v, pre = '', unit = '') => { const a = Math.abs(v); return pre + (a >= 1e9 ? (v / 1e9).toFixed(a % 1e9 ? 2 : 0).replace(/\.?0+$/, '') + 'B' : a >= 1e6 ? (v / 1e6).toFixed(a % 1e6 ? 1 : 0) + 'M' : a >= 1e4 ? Math.round(v / 1e3) + 'K' : Math.round(v).toLocaleString('en-US')) + unit; };
  // ---------------------------------------------------------------- 24 icons, drawn in a 100-unit box centred on 0,0
  const ICON = {
    person: g => { g.arc(0, -28, 17, 0, TAU); g.moveTo(-30, 46); g.quadraticCurveTo(-30, -6, 0, -6); g.quadraticCurveTo(30, -6, 30, 46); g.closePath(); },
    coin: g => { g.ellipse(0, 0, 40, 40, 0, 0, TAU); }, dollar: g => { g.rect(-46, -24, 92, 48); },
    building: g => { g.rect(-26, -48, 52, 96); }, house: g => { g.moveTo(-40, 0); g.lineTo(0, -40); g.lineTo(40, 0); g.lineTo(30, 0); g.lineTo(30, 40); g.lineTo(-30, 40); g.lineTo(-30, 0); g.closePath(); },
    factory: g => { g.moveTo(-46, 40); g.lineTo(-46, -10); g.lineTo(-22, 4); g.lineTo(-22, -10); g.lineTo(2, 4); g.lineTo(2, -44); g.lineTo(18, -44); g.lineTo(18, 4); g.lineTo(46, 4); g.lineTo(46, 40); g.closePath(); },
    store: g => { g.rect(-42, -14, 84, 54); g.moveTo(-48, -14); g.lineTo(-38, -40); g.lineTo(38, -40); g.lineTo(48, -14); g.closePath(); },
    car: g => { g.moveTo(-46, 16); g.lineTo(-46, -2); g.lineTo(-26, -6); g.lineTo(-14, -24); g.lineTo(18, -24); g.lineTo(32, -6); g.lineTo(46, -2); g.lineTo(46, 16); g.closePath(); g.moveTo(-22, 22); g.arc(-26, 22, 9, 0, TAU); g.moveTo(34, 22); g.arc(30, 22, 9, 0, TAU); },
    truck: g => { g.rect(-48, -26, 60, 44); g.moveTo(12, -10); g.lineTo(34, -10); g.lineTo(48, 6); g.lineTo(48, 18); g.lineTo(12, 18); g.closePath(); g.moveTo(-26, 26); g.arc(-30, 26, 9, 0, TAU); g.moveTo(34, 26); g.arc(30, 26, 9, 0, TAU); },
    ship: g => { g.moveTo(-48, 6); g.lineTo(48, 6); g.lineTo(34, 30); g.lineTo(-36, 30); g.closePath(); g.rect(-30, -20, 50, 26); g.rect(-6, -40, 12, 20); },
    plane: g => { g.moveTo(-48, 4); g.lineTo(40, -4); g.quadraticCurveTo(52, 0, 40, 6); g.lineTo(-48, 10); g.closePath(); g.moveTo(-6, 2); g.lineTo(-24, -34); g.lineTo(-12, -34); g.lineTo(14, 2); g.closePath(); g.moveTo(-6, 8); g.lineTo(-24, 40); g.lineTo(-12, 40); g.lineTo(14, 8); g.closePath(); },
    phone: g => { g.rect(-24, -46, 48, 92); }, laptop: g => { g.rect(-36, -30, 72, 46); g.moveTo(-48, 22); g.lineTo(48, 22); g.lineTo(42, 32); g.lineTo(-42, 32); g.closePath(); },
    doc: g => { g.moveTo(-32, -46); g.lineTo(16, -46); g.lineTo(32, -30); g.lineTo(32, 46); g.lineTo(-32, 46); g.closePath(); },
    chart_up: g => { g.rect(-40, 10, 18, 30); g.rect(-12, -10, 18, 50); g.rect(16, -36, 18, 76); }, chart_down: g => { g.rect(-40, -36, 18, 76); g.rect(-12, -10, 18, 50); g.rect(16, 14, 18, 26); },
    bank: g => { g.moveTo(-48, -14); g.lineTo(0, -46); g.lineTo(48, -14); g.closePath(); g.rect(-40, -10, 80, 8); [-30, -10, 10, 30].forEach(x => g.rect(x - 5, -2, 10, 34)); g.rect(-46, 34, 92, 10); },
    lock: g => { g.rect(-30, -6, 60, 48); g.moveTo(-18, -6); g.arc(0, -6, 18, Math.PI, 0); g.lineTo(12, -6); g.arc(0, -6, 12, 0, Math.PI, true); g.closePath(); },
    key: g => { g.arc(-24, 0, 18, 0, TAU); g.rect(-8, -5, 54, 10); g.rect(30, 5, 6, 12); g.rect(40, 5, 6, 8); },
    bulb: g => { g.arc(0, -10, 28, 0, TAU); g.rect(-13, 16, 26, 24); }, gear: g => { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.rect(Math.cos(a) * 34 - 7, Math.sin(a) * 34 - 7, 14, 14); } g.moveTo(32, 0); g.arc(0, 0, 32, 0, TAU); },
    globe: g => { g.arc(0, 0, 42, 0, TAU); }, crown: g => { g.moveTo(-44, 30); g.lineTo(-44, -20); g.lineTo(-22, 4); g.lineTo(0, -34); g.lineTo(22, 4); g.lineTo(44, -20); g.lineTo(44, 30); g.closePath(); },
    bomb: g => { g.arc(-4, 8, 34, 0, TAU); g.rect(10, -36, 12, 16); },
  };
  const ICONC = {}; function iconSprite(name, col) { const key = name + col; if (ICONC[key]) return ICONC[key]; const c = mkCanvas(220, 220), g = c.getContext('2d'); g.translate(110, 110); g.scale(1.9, 1.9);
    g.fillStyle = col; g.shadowColor = 'rgba(0,0,0,.28)'; g.shadowBlur = 8; g.shadowOffsetY = 4; g.beginPath(); (ICON[name] || ICON.doc)(g); g.fill('evenodd'); g.shadowColor = 'transparent';
    g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.rect(-60, -60, 120, 46); g.save(); g.clip(); g.beginPath(); (ICON[name] || ICON.doc)(g); g.restore(); // top sheen
    if (name === 'coin') { g.fillStyle = 'rgba(0,0,0,.2)'; g.font = '700 44px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', 0, 2); }
    if (name === 'dollar') { g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(0, 0, 14, 17, 0, 0, TAU); g.fill(); }
    if (name === 'globe') { g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 3; g.beginPath(); g.ellipse(0, 0, 18, 42, 0, 0, TAU); g.moveTo(-42, 0); g.lineTo(42, 0); g.stroke(); }
    if (name === 'doc') { g.fillStyle = 'rgba(255,255,255,.45)'; for (let i = 0; i < 6; i++) g.fillRect(-22, -26 + i * 12, 40 - (i % 3) * 8, 4); }
    if (name === 'phone' || name === 'laptop') { g.fillStyle = 'rgba(255,255,255,.35)'; name === 'phone' ? g.fillRect(-18, -38, 36, 72) : g.fillRect(-30, -24, 60, 34); }
    return (ICONC[key] = c); }
  const CHAR = new Map(); function charred(c) { if (CHAR.has(c)) return CHAR.get(c); const d = mkCanvas(c.width, c.height), g = d.getContext('2d'); g.drawImage(c, 0, 0); g.globalCompositeOperation = 'source-in'; const gr = g.createLinearGradient(0, d.height, 0, 0); gr.addColorStop(0, '#1a0f08'); gr.addColorStop(.7, '#3a2216'); gr.addColorStop(1, '#ff7a2a'); g.fillStyle = gr; g.fillRect(0, 0, d.width, d.height); CHAR.set(c, d); return d; }
  const COL = n => n === 'red' ? RED : n === 'gold' ? PP.gold : n === 'paper' ? CARD : n === 'ink' ? INK : null;
  const iconCol = name => /coin|crown|key|bulb/.test(name) ? PP.gold : /dollar/.test(name) ? '#5f8a52' : /bomb/.test(name) ? '#2a2a2e' : DK ? '#cfd8e6' : INK;
  // ---------------------------------------------------------------- parse
  function parse(e, X) { const el = {}, order = []; split(e.el, '~').forEach((s, i) => { const k = s.indexOf('='); if (k < 0) return; const key = s.slice(0, k).trim(); const body = s.slice(k + 1); let kind, arg, rest;
      if (body[0] === '@') { const p = body.slice(1).split(','); kind = 'img'; arg = p[0]; rest = p.slice(1); } else { const c = body.indexOf(':'); kind = body.slice(0, c); const p = body.slice(c + 1).split(','); arg = p[0]; rest = p.slice(1); }
      const [x, y, sz, col] = [num(rest[0], .5), num(rest[1], .5), num(rest[2], kind === 'txt' || kind === 'num' || kind === 'tag' ? 80 : .3), rest[3]]; el[key] = { key, kind, arg, x, y, sz, col, i }; order.push(key); });
    const acts = split(e.do, '~').map(s => { const m = s.trim().match(/^(\w+)\.(\w+)(?::([^@]*))?(?:@(.+))?$/); return m ? { k: m[1], v: m[2], a: m[3], t: m[4] ? X.at(m[4].trim(), e.t) : e.t } : null; }).filter(Boolean).sort((a, b) => a.t - b.t);
    return { el, order, acts }; }
  const ENTER = new Set(['pop', 'rise', 'drop', 'slideL', 'slideR', 'unfold', 'zoom', 'fade', 'type', 'draw']);
  // state of one element at time lt (pure function of time → deterministic & seekable)
  function stateOf(E0, acts, lt, e, X, all) { const st = { x: E0.x, y: E0.y, s: 1, sx: 1, rot: 0, a: 1, tint: null, gray: 0, glow: 0, burn: 0, crack: 0, explode: 0, mult: 1, multK: 0, stamp: null, stampK: 0, dim: 0, count: 0, type: 1, draw: 1, fall: 0, shake: 0, followK: 0, follow: null };
    const mine = acts.filter(a => a.k === E0.key); const ent = mine.find(a => ENTER.has(a.v)); const t0 = ent ? ent.t : e.t + E0.i * .18; const v = ent ? ent.v : (E0.kind === 'arrow' || E0.kind === 'line' ? 'draw' : E0.kind === 'txt' ? 'type' : 'pop'); const p = (lt - t0) / .55;
    if (p < 0) { st.a = 0; return st; } const q = clamp(p);
    if (v === 'pop') st.s *= E.back(q); else if (v === 'rise') { st.y += (1 - E.out5(q)) * .35; st.a = q; } else if (v === 'drop') { st.y -= (1 - E.bounce(q)) * .6; } else if (v === 'slideL') st.x -= (1 - E.out5(q)) * .6; else if (v === 'slideR') st.x += (1 - E.out5(q)) * .6;
    else if (v === 'unfold') st.sx = E.out5(q); else if (v === 'zoom') { st.s *= lerp(2.4, 1, E.out5(q)); st.a = q; } else if (v === 'fade') st.a = q; else if (v === 'type') st.type = clamp((lt - t0) / Math.max(.3, String(E0.arg).length * .045)); else if (v === 'draw') st.draw = E.inOut(clamp((lt - t0) / .7));
    for (const a of mine) { if (ENTER.has(a.v) || lt < a.t) continue; const d = lt - a.t, k = E.out5(clamp(d / .5)), A = a.a;
      switch (a.v) {
        case 'grow': st.s *= 1 + (num(A, 1.6) - 1) * k; break; case 'shrink': st.s *= 1 - (1 - num(A, .5)) * k; break; case 'pulse': st.s *= 1 + .18 * Math.sin(Math.min(1, d / .45) * Math.PI); break;
        case 'shake': st.shake = Math.max(0, 1 - d / .7); break; case 'spin': st.rot += TAU * E.inOut(clamp(d / .9)); break; case 'flip': st.sx *= Math.cos(Math.PI * E.inOut(clamp(d / .6))); break;
        case 'tilt': st.rot += num(A, -.18) * k; break; case 'swing': st.rot += .3 * Math.exp(-d * 2.2) * Math.sin(d * 9); break; case 'float': st.y -= .03 * Math.sin(d * 2); break;
        case 'move': { const [mx, my] = String(A || '.5,.5').split(/[ ,]/).map(Number); const kk = E.inOut(clamp(d / .8)); st.x = lerp(st.x, mx, kk); st.y = lerp(st.y, my, kk); break; }
        case 'follow': { const T = all[A]; if (T) { st.follow = T; st.followK = E.inOut(clamp(d / 1.1)); } break; }
        case 'multiply': st.mult = Math.max(1, Math.round(num(A, 8))); st.multK = E.out5(clamp(d / .8)); break; case 'count': st.count = E.out(clamp(d / 1.4)); break;
        case 'glow': st.glow = Math.min(1, d / .3); break; case 'dim': st.dim = k; break; case 'red': st.tint = RED; break; case 'gray': st.gray = k; break;
        case 'stamp': st.stamp = A || 'FAILED'; st.stampK = clamp(d / .2); break; case 'crack': st.crack = E.out(clamp(d / .9)); break; case 'burn': st.burn = clamp(d / 1.4); break;
        case 'explode': st.explode = clamp(d / 1.2); break; case 'fall': st.fall = d; break; case 'vanish': st.a *= 1 - k; st.s *= 1 - .4 * k; break; }
    } return st; }
  // ---------------------------------------------------------------- draw one element (its sprite at a given size)
  function sprite(E0, st) { if (E0.kind === 'img') return getImg(E0.arg, st.gray > .5 ? 'bw' : undefined); if (E0.kind === 'icon') { const nm = String(E0.arg).split('*')[0]; return iconSprite(nm, st.tint || COL(E0.col) || iconCol(nm)); } return null; }
  function drawBody(E0, st, u, lt) { const c = sprite(E0, st);
    if (c) { const hh = E0.sz * H, ww = hh * c.width / c.height; const parts = st.explode > 0 ? 4 : st.crack > 0 ? 2 : 1;
      if (parts === 1) { ctx.drawImage(c, -ww / 2, -hh / 2, ww, hh); return [ww, hh]; }
      for (let i = 0; i < parts; i++) { const sx = parts === 2 ? i * .5 : (i % 2) * .5, sy = parts === 2 ? 0 : Math.floor(i / 2) * .5, sw = .5, sh = parts === 2 ? 1 : .5; const k = parts === 2 ? st.crack : st.explode; const dir = parts === 2 ? (i ? 1 : -1) : [-1, 1, -1, 1][i];
        ctx.save(); ctx.translate((sx - .25 + (parts === 2 ? 0 : 0)) * ww + dir * k * ww * (parts === 2 ? .12 : .6), (parts === 2 ? 0 : (sy - .25) * hh) + k * k * hh * (parts === 2 ? .3 : 1.4) - (parts === 4 ? k * hh * .4 : 0)); ctx.rotate(dir * k * (parts === 2 ? .12 : 1.4)); ctx.globalAlpha *= parts === 4 ? 1 - k * .8 : 1;
        ctx.drawImage(c, sx * c.width, sy * c.height, sw * c.width, sh * c.height, -ww * sw / 2, -hh * sh / 2, ww * sw, hh * sh); ctx.restore(); } return [ww, hh]; }
    const col = st.tint || COL(E0.col) || INK; const size = E0.sz * u;
    if (E0.kind === 'txt') { const s = String(E0.arg); T(s.slice(0, Math.ceil(s.length * st.type)), 0, 0, { size, font: 'impact', fill: col, stroke: DK ? '#000' : CARD, lw: size * .08, ls: 2 * u }); return [s.length * size * .5, size]; }
    if (E0.kind === 'num') { const [v, pre, unit] = String(E0.arg).split(':'); const val = +v * (st.count || (E0._counted ? 1 : 0)); T(big(val, pre || '', unit || ''), 0, 0, { size, font: 'impact', fill: col, stroke: DK ? '#000' : CARD, lw: size * .08 }); return [size * 4, size]; }
    if (E0.kind === 'tag') { const s = String(E0.arg).toUpperCase(); const w = textW(s, size * .5, 'cond', 700) + size * .8; ctx.save(); ctx.shadowColor = SH; ctx.shadowBlur = 12 * u; ctx.shadowOffsetY = 6 * u; ctx.fillStyle = st.tint || COL(E0.col) || CARD; ctx.fillRect(-w / 2, -size * .45, w, size * .9); ctx.restore(); ctx.fillStyle = RED; ctx.fillRect(-w / 2, -size * .45, 6 * u, size * .9); T(s, 0, 0, { size: size * .5, font: 'cond', weight: 700, fill: INK, lw: 0, ls: 3 * u }); return [w, size]; }
    return [0, 0]; }
  // ---------------------------------------------------------------- BUILD
  EXT.build = { world: true, sfx: (e, at) => { const out = []; split(e.do, '~').forEach(s => { const m = s.match(/\.(\w+)(?::[^@]*)?@(.+)$/); if (!m) return; const t = at(m[2].trim(), e.t); const S = { grow: 'whoosh_up', shrink: 'whoosh_down', shake: 'impact_soft', spin: 'whoosh_by', drop: 'impact_thump', fall: 'cartoon_fall_whistle', stamp: 'impact_stamp', crack: 'battle_glass_break', burn: 'battle_fire', explode: 'battle_explosion', multiply: 'pop_cascade', count: 'tick_roll', red: 'glitch_beep_error', glow: 'magic_shimmer', follow: 'whoosh_by', draw: 'foley_marker', pop: 'trans_pop_in', rise: 'whoosh_up' }[m[1]]; if (S) out.push([t, S, m[1] === 'explode' ? .6 : .4]); }); return out.slice(0, 12); },
    draw(e, lt, X) { thm(); const u = X.u; const P = e._P || (e._P = parse(e, X)); const { el, order, acts } = P; const sts = {}; order.forEach(k => { sts[k] = stateOf(el[k], acts, lt, e, X, el); });
      const posOf = k => { const s = sts[k], E0 = el[k]; let x = s.x, y = s.y; if (s.follow) { x = lerp(x, s.follow.x, s.followK); y = lerp(y, s.follow.y, s.followK) - Math.sin(s.followK * Math.PI) * .18; } return [x * W, y * H + s.fall * s.fall * H * .9]; };
      // connectors first (behind)
      X.layer(1.9, () => order.forEach(k => { const E0 = el[k], s = sts[k]; if (!(E0.kind === 'arrow' || E0.kind === 'line') || s.a <= 0) return; const [A, B] = String(E0.arg).split(/[>-]/); if (!el[A] || !el[B]) return; const [ax, ay] = posOf(A), [bx, by] = posOf(B);
        const mx = (ax + bx) / 2, my = (ay + by) / 2 - Math.hypot(bx - ax, by - ay) * .22; const pt = q => [(1 - q) * (1 - q) * ax + 2 * (1 - q) * q * mx + q * q * bx, (1 - q) * (1 - q) * ay + 2 * (1 - q) * q * my + q * q * by]; const k0 = .12, k1 = .12 + .76 * s.draw;
        ctx.save(); ctx.strokeStyle = s.tint || COL(E0.col) || RED; ctx.lineWidth = 6 * u; ctx.lineCap = 'round'; ctx.setLineDash(E0.kind === 'line' ? [10 * u, 10 * u] : []); ctx.beginPath(); for (let i = 0; i <= 30; i++) { const [x, y] = pt(lerp(k0, k1, i / 30)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        if (E0.kind === 'arrow' && s.draw > .9) { const [x1, y1] = pt(k1), [x0, y0] = pt(k1 - .03); const a = Math.atan2(y1 - y0, x1 - x0); ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(x1 + Math.cos(a) * 14 * u, y1 + Math.sin(a) * 14 * u); ctx.lineTo(x1 + Math.cos(a + 2.5) * 22 * u, y1 + Math.sin(a + 2.5) * 22 * u); ctx.lineTo(x1 + Math.cos(a - 2.5) * 22 * u, y1 + Math.sin(a - 2.5) * 22 * u); ctx.closePath(); ctx.fill(); } ctx.restore(); }));
      // bodies, back to front by y
      const bodies = order.filter(k => !/^(arrow|line)$/.test(el[k].kind)).sort((a, b) => sts[a].y - sts[b].y);
      X.layer(2, () => bodies.forEach(k => { const E0 = el[k], s = sts[k]; if (s.a <= 0) return; if (E0.kind === 'num' && s.count) E0._counted = 1; const [px, py] = posOf(k); const idle = Math.sin(lt * 1.3 + E0.i * 1.7);
        const copies = s.mult > 1 ? s.mult : (E0.kind === 'icon' && /\*/.test(E0.arg) ? Math.max(1, +String(E0.arg).split('*')[1]) : 1); const isPile = copies > 1; const r = rng(E0.i * 31 + 7);
        for (let c = 0; c < copies; c++) { const ang = r() * TAU, rad = Math.sqrt(r()) * E0.sz * H * (isPile ? 1.1 : 0) * (s.mult > 1 ? s.multK : 1); const ox = c ? Math.cos(ang) * rad * 1.5 : 0, oy = c ? Math.sin(ang) * rad * .7 : 0;
          ctx.save(); ctx.translate(px + ox + (s.shake ? Math.sin(lt * 70 + c) * 10 * u * s.shake : 0), py + oy + idle * 4 * u); ctx.rotate(s.rot + (s.fall ? s.fall * 2.2 : 0) + (isPile ? (r() - .5) * .5 : idle * .01)); const sc = s.s * (isPile && c ? .82 + r() * .3 : 1) * (1 + Math.sin(lt * 1.1 + E0.i) * .006); ctx.scale(sc * s.sx, sc); ctx.globalAlpha *= s.a * (1 - .7 * s.dim) * (1 - s.burn * .85);
          if (s.glow) { const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, E0.sz * H * .9); gr.addColorStop(0, `rgba(255,220,120,${.45 * s.glow})`); gr.addColorStop(1, 'rgba(255,220,120,0)'); ctx.fillStyle = gr; ctx.fillRect(-E0.sz * H, -E0.sz * H, E0.sz * H * 2, E0.sz * H * 2); }
          drawBody(E0, s, u, lt);
          if (s.burn > 0) { const c0 = sprite(E0, s); if (c0) { const hh = E0.sz * H, ww = hh * c0.width / c0.height; ctx.globalAlpha = Math.min(1, s.burn * 1.4) * s.a; ctx.drawImage(charred(c0), -ww / 2, -hh / 2, ww, hh); } }
          ctx.restore(); }
        if (s.burn > 0 && s.burn < 1) { const r2 = rng(E0.i + 3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 24; i++) { const ph = (lt * .8 + r2()) % 1; const x = px + (r2() - .5) * E0.sz * H, y = py - ph * E0.sz * H * 1.4; ctx.globalAlpha = (1 - ph) * (1 - s.burn); ctx.fillStyle = r2() > .5 ? '#ff8a3a' : '#ffd36b'; ctx.beginPath(); ctx.arc(x, y, (2 + r2() * 4) * u, 0, TAU); ctx.fill(); } ctx.restore(); }
        if (s.stamp) { const k = s.stampK; ctx.save(); ctx.translate(px, py); ctx.rotate(-.14); ctx.scale(lerp(2, 1, k), lerp(2, 1, k)); ctx.globalAlpha *= k * .92; const w = textW(s.stamp, 58 * u, 'impact') + 40 * u; ctx.strokeStyle = RED; ctx.lineWidth = 6 * u; ctx.strokeRect(-w / 2, -40 * u, w, 80 * u); T(s.stamp, 0, 4 * u, { size: 58 * u, font: 'impact', fill: RED, lw: 0 }); ctx.restore(); } })); } };
  window.PPBUILD = { icons: Object.keys(ICON), verbs: [...ENTER, 'grow', 'shrink', 'pulse', 'shake', 'spin', 'flip', 'tilt', 'swing', 'float', 'move', 'follow', 'multiply', 'count', 'glow', 'dim', 'red', 'gray', 'stamp', 'crack', 'burn', 'explode', 'fall', 'vanish'] };
})();
