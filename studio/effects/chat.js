/* @effect chat
   @does: a phone lying tilted in the lamp light shows a real message thread: bubbles arrive one by one on their cue words with a typing pause, names above each side; the source sits under the phone
   @params: msgs, cues, left, right, src, bg, in, out
   @uses: optional background clip (bg)
   @tags: messages, chat, phone, evidence, quote, verbatim
   @born: onecoin v2 (These ppl are idiots)
*/
({ t, at, p, W, H, u, clip, ctx, params: P, clamp, lerp, seam, cover, card, paperDesk, text, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = P.bg ? clip(P.bg, 0, 1) : null; if (bg) cover(bg, { z: 1.1, filter: 'blur(12px) brightness(.3)' }); else paperDesk({ lx: .5, ly: .4 });
  const msgs = String(P.msgs).split('~').map(m => { const k = m.indexOf(':'); return { who: m.slice(0, k).trim(), txt: m.slice(k + 1).trim() }; }), cues = String(P.cues || '').split(',');
  const pw = 700, ph = 1300, S = window.__chat || (window.__chat = document.createElement('canvas')); S.width = pw; S.height = ph; const g = S.getContext('2d'), F = typeof FONT !== 'undefined' ? FONT : {};
  g.fillStyle = '#0b0b0d'; g.beginPath(); g.roundRect(0, 0, pw, ph, 80); g.fill(); g.fillStyle = '#16181c'; g.beginPath(); g.roundRect(24, 24, pw - 48, ph - 48, 60); g.fill();
  g.fillStyle = '#20242a'; g.fillRect(24, 110, pw - 48, 2); g.font = `600 44px ${F.cond || 'sans-serif'}`; g.fillStyle = '#c9cfd6'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText((P.left || '') + '  ·  ' + (P.right || ''), pw / 2, 76);
  let y = 170; g.textAlign = 'left';
  msgs.forEach((m, i) => { const tc = cues[i] ? at(cues[i]) : .5 + i * 1.2; if (t < tc - .5) return; const typing = t < tc, mine = m.who === 'R' || m.who === (P.right || '_');
    g.font = `400 60px "Be Vietnam Pro", sans-serif`; const words = m.txt.split(' '), lines = []; let cur = ''; words.forEach(w => { const tt = cur ? cur + ' ' + w : w; if (g.measureText(tt).width > pw * .66 && cur) { lines.push(cur); cur = w; } else cur = tt; }); lines.push(cur);
    const bw = typing ? 120 : Math.max(...lines.map(l => g.measureText(l).width)) + 50, bh = typing ? 90 : lines.length * 74 + 40, x = mine ? pw - 60 - bw : 60;
    const k = clamp((t - tc + .5) / .25); g.globalAlpha = k; g.fillStyle = mine ? '#8a6d33' : '#2a2f37'; g.beginPath(); g.roundRect(x, y, bw, bh, 30); g.fill();
    if (typing) { for (let d = 0; d < 3; d++) { g.fillStyle = `rgba(255,255,255,${.4 + .5 * Math.max(0, Math.sin(t * 8 - d))})`; g.beginPath(); g.arc(x + 35 + d * 25, y + 35, 7, 0, 7); g.fill(); } }
    else { g.fillStyle = '#f2ece0'; lines.forEach((l, j) => g.fillText(l, x + 25, y + 56 + j * 74)); }
    g.globalAlpha = 1; y += bh + 34; });
  const k = clamp(t / Math.max(1, dur)), w = H * .62, h = w * ph / pw;
  card(S, { x: W * .5, y: H * .62, w, h, rx: .62 - .05 * k, ry: -.06, rz: .05, z: 0, shadow: true, n: 14 });
  if (P.src) text(P.src, W * .5, H * .93, { size: 34 * u, font: 'serif', col: '#a99a82', lw: 0 });
  ctx.restore();
}
