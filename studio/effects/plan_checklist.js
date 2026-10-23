/* @effect plan_checklist
   @does: the clauses of a plan as big serif lines over a runway plate; each gets a hand-drawn tick on its word, the last one lands on the punch word
   @params: —
   @uses: onecoin_art_mood_runway (swap these ids for the new episode's own)
   @tags: plan,checklist,steps,motif,callback
   @born: onecoin a0: She did all three. Almost to the word.
*/
({ t, at, p, spring, stagger, W, H, u, layer, img, draw, text, ctx, col, lerp }) => {
  // the three clauses of the email become a checklist; each one gets its tick on "three", the last lands on "word"
  layer(1, () => { draw(img('onecoin_art_mood_runway'), W * .5, H * .5, H * 1.1, { a: .5 }); ctx.fillStyle = 'rgba(6,5,4,.5)'; ctx.fillRect(0, 0, W, H); });
  const rows = ['TAKE THE MONEY', 'AND RUN', 'AND BLAME SOMEONE ELSE'];
  layer(2, () => rows.forEach((r, i) => {
    const k = stagger(i, 3, 'did', .35, .45), y = H * (.28 + i * .18), tk = i < 2 ? spring(at('three') + i * .25) : spring('word');
    text(r, W * .2 + (1 - k) * -60 * u, y, { size: 84 * u, font: 'serif', weight: 900, col: '#efe2c4', align: 'left', a: k });
    ctx.save(); ctx.translate(W * .14, y - 6 * u); ctx.scale(tk, tk); ctx.strokeStyle = col.gold; ctx.lineWidth = 9 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-26 * u, 0); ctx.lineTo(-6 * u, 22 * u); ctx.lineTo(30 * u, -28 * u); ctx.stroke(); ctx.restore();
  }));
}
