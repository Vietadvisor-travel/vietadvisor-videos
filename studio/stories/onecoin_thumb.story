title: onecoin thumbnail
channel: poisonpill
look: luxury
voice: none
music: none
endcard: off

#! scene thumb_note
({ t, W, H, u, layer, img, draw, text, ctx, col }) => {
  layer(1, () => { draw(img('onecoin_art_wembley_gown'), W * .62, H * .5, H * 1.05, { a: .55 }); ctx.fillStyle = 'rgba(6,5,4,.35)'; ctx.fillRect(0, 0, W, H); });
  layer(2, () => { draw(img('onecoin_ruja'), W * .24, H * .58, H * 1.05);
    ctx.save(); ctx.translate(W * .68, H * .3); ctx.rotate(-.04); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(-W * .29 + 12 * u, -H * .13 + 14 * u, W * .58, H * .26); ctx.fillStyle = '#f1e8d4'; ctx.fillRect(-W * .29, -H * .13, W * .58, H * .26); ctx.restore();
    text('"TAKE THE MONEY', W * .68, H * .26, { size: 92 * u, font: 'serif', weight: 900, col: '#1b1510', lw: 0, rot: -.04 });
    text('AND RUN"', W * .68, H * .37, { size: 92 * u, font: 'serif', weight: 900, col: '#9b1c1c', lw: 0, rot: -.04 });
    text('$4 BILLION', W * .7, H * .74, { size: 210 * u, font: 'impact', col: col.gold }); });
}
#! end

# cine act=thumb fx="code:thumb_note"
Thumbnail.
