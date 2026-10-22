/* Example new PROP made with the style recipe: bánh cuốn (steamed rice rolls). */
defProp('banh_cuon', 'food', 'Bánh cuốn (steamed rice rolls)', 260, 120, (o, t) => {
  sEll(0, -12, 126, 22, '#f4efe6');                                    // plate
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(-66 + i * 44, -34 - (i % 2) * 6); ctx.rotate(-.12 + i * .08);
    sRR(-26, -18, 52, 36, 18, 'rgba(250,246,238,.95)', { lw: 4, inner: () => { ell(0, 2, 14, 6, '#c9a27a', 0); } }); ctx.restore(); }
  for (let i = 0; i < 9; i++) circ(-70 + i * 18, -50 - (i % 3) * 4, 4, '#c8873e', 2);      // fried shallots
  for (let i = 0; i < 3; i++) ell(70 + i * 12, -24, 12, 5, '#5aa845', 3, i);                // herbs
  if (o.steam !== false) steamFx(0, -70, t, 2, .6);
});
