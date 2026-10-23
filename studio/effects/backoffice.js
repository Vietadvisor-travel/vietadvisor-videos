/* @effect backoffice
   @does: a company back-office screen as a tilted 3D panel in front of real footage: data rows type in on cue, a hero value types, doubles, counts down or flips on a word; the screen is the world of a database that pretends
   @params: bg, title, rows, go, gap, hero, hlab, hat, to, toat, timer, tat, note, ry, in, out, accent
   @uses: a background clip (bg)
   @tags: database, screen, ui, data, numbers, typing, 3d, fake
   @born: onecoin v2 (the coin was a row in a database)
*/
({ t, at, p, W, H, u, clip, ctx, params: P, clamp, lerp, seam, cover, card, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1); if (bg) cover(bg, { z: 1.12, filter: 'blur(7px) brightness(.5) saturate(.8)' }); else { ctx.fillStyle = '#08070a'; ctx.fillRect(0, 0, W, H); }
  const cw = 1400, ch = 820, S = window.__bo || (window.__bo = document.createElement('canvas')); S.width = cw; S.height = ch; const g = S.getContext('2d'), F = typeof FONT !== 'undefined' ? FONT : {}, ac = P.accent || '#d8b46a';
  g.fillStyle = '#0d0f12'; g.fillRect(0, 0, cw, ch); g.fillStyle = '#161a20'; g.fillRect(0, 0, cw, 70); g.fillStyle = ac; g.fillRect(0, 68, cw, 2);
  ['#e5484d', '#e8b04a', '#4cc38a'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(34 + i * 30, 35, 9, 0, 7); g.fill(); });
  g.font = `600 30px ${F.cond || 'sans-serif'}`; g.fillStyle = '#9aa3ad'; g.textBaseline = 'middle'; g.fillText(P.title || 'BACK OFFICE', 140, 36);
  const rows = String(P.rows || '').split('~').filter(Boolean).map(r => r.split('=')), t0 = P.go ? at(P.go) : .3, gap = +(P.gap || .35);
  rows.forEach(([a, b], i) => { const ti = t0 + i * gap; if (t < ti) return; const k = clamp((t - ti) / .25), y = 140 + i * 78; g.globalAlpha = k;
    g.fillStyle = i % 2 ? '#11141a' : '#0f1216'; g.fillRect(40, y - 34, cw - 80, 68); g.font = `500 44px "Be Vietnam Pro", sans-serif`; g.fillStyle = '#c9cfd6'; g.fillText(a, 70, y);
    const vb = String(b || ''), n = Math.ceil(vb.length * clamp((t - ti) / .35)); g.textAlign = 'right'; g.fillStyle = ac; g.fillText(vb.slice(0, n), cw - 70, y); g.textAlign = 'left'; g.globalAlpha = 1; });
  if (P.hero) { const ha = P.hat ? at(P.hat) : 0, ka = clamp((t - ha) / .3); let v = String(P.hero);
    if (P.to && P.toat && t >= at(P.toat)) v = String(P.to); if (P.timer && P.tat) { const r = Math.max(0, +P.timer - Math.max(0, t - at(P.tat)) * (+P.timer / 1.6)); v = t < at(P.tat) ? P.hero : r > 0 ? '00:00:' + String(Math.ceil(r)).padStart(2, '0') : (P.to || P.hero); }
    const flip = P.toat ? clamp((t - at(P.toat)) / .25) : 0, by = ch - 140 - (1 - (flip > 0 && flip < 1 ? Math.abs(Math.sin(flip * Math.PI)) : 0)) * 0;
    if (ka > 0) { g.globalAlpha = ka; g.fillStyle = '#12161c'; g.fillRect(40, ch - 330, cw - 80, 290); g.font = `600 38px ${F.cond || 'sans-serif'}`; g.fillStyle = '#9aa3ad'; g.fillText(P.hlab || '', 70, ch - 290);
      g.font = `700 ${190}px ${F.impact || 'sans-serif'}`; g.fillStyle = flip > 0 && flip < 1 ? '#fff' : ac; g.fillText(v, 70, by); g.globalAlpha = 1; } }
  if (P.note && P.note.length) { g.font = `400 26px ${F.serif || 'serif'}`; g.fillStyle = '#6b737c'; g.textAlign = 'right'; g.fillText(P.note, cw - 50, ch - 26); g.textAlign = 'left'; }
  const ry = +(P.ry ?? -.18), drift = clamp(t / Math.max(1, dur)) * .08, w = W * .7, h = w * ch / cw;
  card(S, { x: W * .5, y: H * .5, w, h, ry: ry + drift, rx: .06, z: 0, shadow: true, n: 14 });
  const glow = ctx.createRadialGradient(W * .5, H * .5, 0, W * .5, H * .5, W * .6); glow.addColorStop(0, 'rgba(216,180,106,.06)'); glow.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
