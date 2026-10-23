title: demo · stock footage as material
channel: poisonpill
look: luxury
tone: dry
voice: am_michael*.7+bm_george*.3
delivery: tense
music: auto
captions: off
endcard: off

#! scene footage_split
({ t, at, p, spring, stagger, W, H, u, clip, ctx, params, clamp, lerp, ease }) => {
  // one shot opens full frame, then on a word it is sliced into N panels: each new panel slides in from the right (the film's current)
  // carrying its own footage; at the end the last panel widens back to full frame. params: base, clips (a,b,c), keys (word,word,word), close
  const base = params.base, ids = String(params.clips).split(','), keys = String(params.keys).split(','), n = ids.length + 1;
  const panels = [base, ...ids]; const ks = [1, ...keys.map(k => clamp(spring(k, { stiff: 120, damp: 20 })))];
  const shown = ks.filter(k => k > .001).length; const close = params.close ? clamp(p(params.close, .7, 'inOut')) : 0;
  const total = ks.reduce((a, k) => a + k, 0) || 1; let x = 0;
  panels.forEach((id, i) => {
    let w = W * ks[i] / total; if (close) w = i === panels.length - 1 ? lerp(w, W, close) : w * (1 - close);
    if (w < 1) return; const im = clip(id, 0, 1); ctx.save(); ctx.beginPath(); ctx.rect(x, 0, w, H); ctx.clip();
    if (im) { const s = Math.max(w / im.width, H / im.height) * 1.04; const dx = x + w / 2 + (1 - ks[i]) * 160 * u; ctx.drawImage(im, dx - im.width * s / 2, H / 2 - im.height * s / 2, im.width * s, im.height * s); }
    ctx.restore(); if (i && w < W - 2) { ctx.fillStyle = '#0b0b0d'; ctx.fillRect(x - 3 * u, 0, 6 * u, H); } x += w;
  });
}
#! end

#! scene word_cut_montage
({ t, at, p, W, H, u, clip, ctx, params, clamp, lerp }) => {
  // one clip per spoken key word, hard-cut ON the word; every shot is already pushing in when it arrives (zoom-through seam:
  // the outgoing shot accelerates 1→1.2 with blur in the last .2 s, the new one lands at .8→1). params: clips, keys
  const ids = String(params.clips).split(','), keys = String(params.keys).split(',');
  let k = 0; keys.forEach((w, i) => { if (t >= at(w)) k = i; });
  const t0 = at(keys[k]), t1 = k + 1 < keys.length ? at(keys[k + 1]) : t0 + 99, lt = t - t0, left = t1 - t;
  const arrive = clamp(lt / .5), z = lerp(.86, 1, 1 - Math.pow(1 - arrive, 4)) * (1 + .03 * lt) * (left < .2 ? 1 + (.2 - left) : 1);
  const im = clip(ids[k], t0, 1); if (!im) return; ctx.save();
  const bl = (lt < .12 ? (.12 - lt) * 60 : 0) + (left < .2 ? (.2 - left) * 45 : 0); if (bl > .5) ctx.filter = `blur(${bl.toFixed(1)}px)`;
  const s = Math.max(W / im.width, H / im.height) * z; ctx.drawImage(im, W / 2 - im.width * s / 2, H / 2 - im.height * s / 2, im.width * s, im.height * s); ctx.restore();
}
#! end

#! scene ramp_freeze
({ t, at, p, W, H, u, clip, ctx, params, clamp, lerp, text }) => {
  // footage plays, slows on one word (speed ramp 1 → .15), freezes on the next word; on the freeze the picture drains to
  // monochrome and a thin frame line draws round it, so the held instant reads as evidence. params: clip, slow, freeze
  const id = params.clip, ts = at(params.slow), tf = at(params.freeze);
  const eff = t < ts ? t : t < tf ? ts + (t - ts) * lerp(1, .15, clamp((t - ts) / .4)) : ts + (tf - ts) * .4;
  const im = clip(id, t - eff, 1); if (!im) return; const fr = clamp(p(params.freeze, .35, 'out5'));
  ctx.save(); ctx.filter = `grayscale(${fr.toFixed(2)}) contrast(${(1 + .25 * fr).toFixed(2)})`;
  const s = Math.max(W / im.width, H / im.height) * (1.02 + .04 * clamp(t / 6)); ctx.drawImage(im, W / 2 - im.width * s / 2, H / 2 - im.height * s / 2, im.width * s, im.height * s); ctx.restore();
  if (fr > 0) { ctx.save(); ctx.fillStyle = `rgba(0,0,0,${.18 * fr})`; ctx.fillRect(0, 0, W, H);
    const m = 60 * u, len = 2 * (W + H - 4 * m) * fr; ctx.strokeStyle = '#e8e2d4'; ctx.lineWidth = 3 * u; ctx.setLineDash([len, 99999]);
    ctx.strokeRect(m, m, W - 2 * m, H - 2 * m); ctx.restore(); }
}
#! end

#! scene framed_insert
({ t, at, p, spring, W, H, u, clip, ctx, params, clamp, lerp }) => {
  // the world outside (footage, blurred and dark) and one window into the subject: a second clip in a tall frame that rises
  // into place on a word with a premium spring, then the camera pushes into the frame until it fills the screen on the
  // last word (object becomes the world). params: outside, inside, rise, fill
  const out = clip(params.outside, 0, 1), ins = clip(params.inside, 0, 1);
  const r = clamp(spring(params.rise, { stiff: 160, damp: 24 })), f = clamp(p(params.fill, .9, 'inOut'));
  if (out) { ctx.save(); ctx.filter = `blur(${(10 * (1 - f)).toFixed(1)}px) brightness(${lerp(.45, 1, f).toFixed(2)})`; const s = Math.max(W / out.width, H / out.height) * (1.05 + .1 * f);
    ctx.drawImage(out, W / 2 - out.width * s / 2, H / 2 - out.height * s / 2, out.width * s, out.height * s); ctx.restore(); }
  if (!ins || r <= 0) return;
  const fw = lerp(W * .34, W, f), fh = lerp(H * .7, H, f), cx = lerp(W * .62, W / 2, f), cy = lerp(H * .5 + (1 - r) * H * .6, H / 2, f);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50 * u * (1 - f); ctx.fillStyle = '#0b0b0d'; ctx.fillRect(cx - fw / 2 - 8 * u * (1 - f), cy - fh / 2 - 8 * u * (1 - f), fw + 16 * u * (1 - f), fh + 16 * u * (1 - f)); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(cx - fw / 2, cy - fh / 2, fw, fh); ctx.clip(); const s = Math.max(fw / ins.width, fh / ins.height) * 1.02;
  ctx.drawImage(ins, cx - ins.width * s / 2, cy - ins.height * s / 2, ins.width * s, ins.height * s); ctx.restore();
}
#! end

# cine act=setup fx="code:footage_split;base:stock_city_night_new_york_city_time_lapse_01;clips:stock_crowds_street_scramble_crossing_at_robinso_01,stock_airplane_landing_aircraft_haneda_2021_01,stock_warehouse_20201119_tfaa_lsc_0044_clipx_01;keys:streets,airports,ports"
Every night, the money moves. Through streets, through airports, through ports. It never sleeps.

# cine act=rise fx="code:word_cut_montage;clips:stock_warehouse_20201119_tfaa_lsc_0044_clipx_01,stock_datacenter_what_s_inside_this_decommiss_01,stock_city_night_time_lapsed_millennium_eye_01;keys:containers,cables,lights"
Not in vaults. In containers. In cables. In a million lights that nobody counts.

# cine act=doubt fx="code:ramp_freeze;clip:stock_weather_sea_lightning_storm_over_colorad_01;slow:storm;freeze:everyone"
{tense} And when the storm finally comes, everyone remembers where they were.

# cine act=after fx="code:framed_insert;outside:stock_city_night_new_york_city_time_lapse_01;inside:stock_construction_building_construction_crane_01;rise:built;fill:machine"
{grave} But it almost never hits the people who built the machine.
