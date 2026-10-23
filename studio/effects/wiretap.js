/* @effect wiretap
   @does: a phone lies on the desk mid-call; the caller's initials sit on the screen, a live waveform runs and the call timer counts; on a word a red REC lamp and a label slide in — someone else is listening
   @params: caller, sub, rec, lab, heart, in, out
   @uses: none (drawn)
   @tags: surveillance, informant, phone, recording, betrayal, fbi
   @born: onecoin v2 (it was her boyfriend)
*/
({ t, at, p, W, H, u, ctx, params: P, clamp, lerp, seam, paperDesk, card, marker, ellipsePts, text, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .48 });
  const pw = 760, ph = 1400, S = window.__wt || (window.__wt = document.createElement('canvas')); S.width = pw; S.height = ph; const g = S.getContext('2d'), F = typeof FONT !== 'undefined' ? FONT : {};
  g.fillStyle = '#0b0b0d'; g.beginPath(); g.roundRect(0, 0, pw, ph, 90); g.fill(); g.fillStyle = '#121418'; g.beginPath(); g.roundRect(26, 26, pw - 52, ph - 52, 70); g.fill();
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#9aa3ad'; g.font = `500 44px ${F.cond || 'sans-serif'}`; g.fillText('CALL IN PROGRESS', pw / 2, 170);
  g.fillStyle = '#2a2f37'; g.beginPath(); g.arc(pw / 2, 390, 140, 0, 7); g.fill(); g.fillStyle = '#e6dccb'; g.font = `700 120px ${F.impact || 'sans-serif'}`; g.fillText(P.caller || 'G. A.', pw / 2, 395);
  if (P.sub) { g.font = `400 46px ${F.serif || 'serif'}`; g.fillStyle = '#c9cfd6'; g.fillText(P.sub, pw / 2, 600); }
  const secs = Math.floor(t + 47); g.font = `500 60px ${F.cond || 'sans-serif'}`; g.fillStyle = '#4cc38a'; g.fillText('00:' + String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(secs % 60).padStart(2, '0'), pw / 2, 700);
  for (let i = 0; i < 46; i++) { const a = Math.abs(Math.sin(i * .7 + t * 9) * Math.sin(i * .23 + t * 3.1)) * .9 + .1; g.fillStyle = '#4cc38a'; const bh = a * 220; g.fillRect(70 + i * 13.5, 920 - bh / 2, 8, bh); }
  const rk = P.rec ? clamp(p(P.rec, .4, 'out')) : 0; if (rk > 0) { g.globalAlpha = rk; g.fillStyle = '#e5484d'; g.beginPath(); g.arc(150, 1150, 26, 0, 7); g.fill(); g.font = `700 64px ${F.impact || 'sans-serif'}`; g.textAlign = 'left'; g.fillText('REC', 200, 1152); g.font = `500 44px ${F.cond || 'sans-serif'}`; g.fillStyle = '#e6dccb'; g.fillText(P.lab || 'FBI', 200, 1230); g.globalAlpha = 1; }
  const w = H * .5, h = w * ph / pw, k = clamp(t / Math.max(1, dur)); card(S, { x: W * .5, y: H * .56, w, h, rx: .58 - .04 * k, ry: .05, rz: -.08, shadow: true, n: 14 });
  if (P.heart) marker(ellipsePts(W * .5, H * .36, H * .2, H * .13, 4), clamp(p(P.heart, .7, 'inOut')), { w: 8 });
  ctx.restore();
}
