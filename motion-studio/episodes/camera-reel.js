/* CAMERA & MOTION REEL — demonstrates the named camera moves, depth/focus, auto-walk and transitions.
   Each scene is labelled with the techniques it uses. */
const tag = (txt) => ({ type: 'fn', screen: true, draw: (lt) => { const u = U(), p = pop(lt, .15, .35); if (p <= 0) return; const sf = SAFE(); ctx.save(); ctx.translate(sf.left + 20 * u, sf.top + 40 * u); ctx.scale(p, p); const w = textW(txt, 34 * u, 'body') + 40 * u; sRR(0, -30 * u, w, 60 * u, 30 * u, C.ink, { lw: 0, hi: null }); T(txt, 20 * u, 0, { size: 34 * u, font: 'body', fill: C.yel, lw: 0, align: 'left' }); ctx.restore(); } });
window.EPISODE = {
  title: 'Vietadvisor camera & motion reel', fps: 30,
  scenes: [
    { id: 'reveal_focus', dur: 5.5, place: 'hoian', placeOpts: { time: 'night' },
      moves: [{ type: 'reveal', t0: 0, t1: 2.2, from: [.62, .45], z: 2.4, ease: 'out5' }, { type: 'drift', amp: .8 }, { type: 'focus', t0: 2.6, t1: 3.4, from: 1.7, to: 1 }],
      focus: 1.7, layers: [
        { type: 'particles', name: 'fireflies', a: .9 },
        { type: 'char', id: 'lantern', x: .6, y: 'ground', s: 1.1, pose: 'present', expr: 'happy', depth: 1 },
        { type: 'char', id: 'jiwoo', x: .42, y: 'ground', s: 1.1, pose: 'photo', expr: 'love', depth: 1 },
        { type: 'prop', name: 'lantern', x: .12, y: .34, s: 2.2, opts: { color: '#e8402a' }, depth: 1.7 },
        { type: 'prop', name: 'lantern', x: .9, y: .3, s: 2.6, opts: { color: '#f6b62e', ph: 2 }, depth: 1.8 },
        tag('reveal · rack focus · drift'),
      ], captions: [[.3, 5.3, 'Reveal from a detail, then *rack focus* from the lanterns to the people.']] },
    { id: 'dolly', dur: 5, transition: { type: 'whip', dur: .45 }, place: 'halong', placeOpts: { time: 'sunset' },
      moves: [{ type: 'dolly', t0: 0, t1: 5, amt: .28 }],
      layers: [
        { type: 'char', id: 'lena', x: .5, y: 'ground', dy: 30, s: 1.15, pose: 'cheer', expr: 'joy', depth: 1 },
        { type: 'prop', name: 'palm', x: .05, y: 'ground', dy: 120, s: 1.5, depth: 1.8 },
        { type: 'prop', name: 'palm', x: .95, y: 'ground', dy: 120, s: 1.4, flip: 1, depth: 1.9 },
        tag('dolly · foreground spread'),
      ], captions: [[.3, 4.8, 'Dolly in: the foreground palms slide past, the subject grows.']] },
    { id: 'follow', dur: 6, transition: { type: 'ink', dur: .6 }, place: 'oldquarter', scroll: [{ t: 0, v: 0 }, { t: 6, v: 300 }],
      moves: [{ type: 'follow', id: 'walker', t0: 0, z: 1.25 }, { type: 'handheld', amp: 1 }],
      layers: [
        { type: 'char', key: 'walker', id: 'dave', x: .2, y: 'ground', s: 1.2, expr: 'happy', keys: [{ t: 4, x: .7, ease: 'inOut' }, { t: 4.2, expr: 'surprised' }, { t: 5, pose: 'point', expr: 'starstruck' }] },
        { type: 'prop', name: 'bike_flower', x: .86, y: 'ground', s: 1.1 },
        tag('follow cam · handheld · auto-walk + lean'),
      ], captions: [[.3, 5.8, 'Follow cam keeps Dave framed. He auto-walks and leans into the move.']] },
    { id: 'crash', dur: 4.5, transition: { type: 'flash', dur: .5 }, place: 'benthanh',
      moves: [{ type: 'drift' }, { type: 'crashZoom', t0: 1.8, t1: 2.05, amt: .9, to: [.42, .5] }, { type: 'dutch', t0: 1.8, t1: 2.1, deg: 7, ease: 'out5' }],
      layers: [
        { type: 'char', id: 'ploy', x: .42, y: 'ground', s: 1.2, pose: 'hold', hold: 'durian', holdScale: .35, expr: 'happy', keys: [{ t: 1.8, expr: 'shocked', pose: 'scared' }] },
        { type: 'ui', name: 'punch', screen: true, at: 1.85, o: { x: .62, y: .3, text: 'THE SMELL!', size: 120, life: 2.4 } },
        { type: 'fn', screen: true, draw: (lt) => { const p = E.out5(inv(1.8, 2.0, lt)) * (1 - inv(3.6, 4.2, lt)); if (p > 0) focusLines(W * .42, H * .45, lt, p * .8); } },
        tag('crash zoom · dutch angle · focus lines · shake'),
      ], shakes: [[1.85, 20, .5]], captions: [[2.3, 4.3, 'Crash zoom + dutch + shake = punchline.']] },
    { id: 'orbit', dur: 5, transition: { type: 'zoom', dur: .55 }, place: 'sapa', placeOpts: { season: 'gold' },
      moves: [{ type: 'orbit', t0: 0, t1: 5, amt: .07 }],
      layers: [
        { type: 'char', id: 'hmong_woman', x: .46, y: 'ground', s: 1.15, pose: 'wave', expr: 'happy', depth: 1 },
        { type: 'char', id: 'kenji', x: .62, y: 'ground', s: 1.1, pose: 'photo', expr: 'starstruck', depth: 1.05 },
        { type: 'prop', name: 'rice', x: .2, y: 'ground', dy: 100, s: 2.4, depth: 1.7 },
        { type: 'prop', name: 'rice', x: .85, y: 'ground', dy: 110, s: 2.6, depth: 1.8 },
        tag('orbit · depth parallax'),
      ], captions: [[.3, 4.8, 'Orbit: layers at different depths slide at different speeds — fake 3D.']] },
    { id: 'tilt', dur: 5, transition: { type: 'iris', dur: .6 }, place: 'saigon', placeOpts: { time: 'night' },
      cam: [{ t: 0, x: .5, y: .62, z: 1.35 }], moves: [{ type: 'tiltUp', t0: .2, t1: 3, dist: .2, ease: 'smooth' }, { type: 'bounce', t0: 3, t1: 3.6, amt: .06 }],
      layers: [
        { type: 'particles', name: 'sparkles', a: .7 },
        { type: 'char', id: 'wei', x: .4, y: 'ground', s: 1.1, pose: 'pointUp', expr: 'starstruck' },
        { type: 'ui', name: 'banner', screen: true, at: 3, o: { x: .5, y: .2, text: 'SÀI GÒN BY NIGHT', size: 60 } },
        tag('tilt up · bounce on beat · particles'),
      ], captions: [[.3, 4.8, 'Tilt up to reveal height, bounce when the title lands.']] },
    { id: 'end', dur: 2, transition: { type: 'brand', dur: .6 }, layers: [{ type: 'ui', name: 'endFrame', screen: true, always: 1, o: {} }] },
  ]
};
