/* Episode template — copy to episodes/<slug>.js and edit.
   Render: node tools/render.mjs episodes/<slug>.js --fmt 16x9 --out out/<slug>_16x9.mp4  */
window.EPISODE = {
  title: 'Phở in Hà Nội, honestly', fps: 30,
  sources: ['<url> — checked <Mon YYYY>'],
  scenes: [
    { id: 'hook', dur: 4,
      place: 'oldquarter', moves: [{ type: 'drift' }, { type: 'crashZoom', t0: 2.2, t1: 2.45, amt: .5, to: [.55, .55] }],
      layers: [
        { type: 'char', id: 'dave', x: .4, y: 'ground', s: 1.3, expr: 'thinking', pose: 'stand', in: { type: 'drop', at: 0 }, keys: [{ t: 2.2, expr: 'starstruck', pose: 'cheer' }] },
        { type: 'prop', name: 'pho', x: .64, y: 'ground', s: 1.1, in: { type: 'pop', at: 1.6 } },
      ],
      captions: [[.1, 2.1, 'Dave wants *phở*.'], [2.3, 3.9, 'Good news: it’s everywhere.']], shakes: [[2.25, 14, .35]], sfx: [[0, 'whoosh'], [2.2, 'impact']] },
    { id: 'price', dur: 5, transition: { type: 'whip', dur: .45 },
      place: 'sidewalk', moves: [{ type: 'pushIn', t0: 0, t1: 5, amt: .12, to: [.45, .55] }],
      layers: [
        { type: 'char', id: 'cophovn', x: .3, y: 'ground', s: 1.3, pose: 'present', expr: 'happy' },
        { type: 'char', id: 'dave', x: .62, y: 'ground', s: 1.3, pose: 'eat', hold: 'pho', holdScale: .35, expr: 'yummy' },
        { type: 'ui', name: 'price', screen: true, at: 1, o: { x: .78, y: .28, item: 'phở bò, street stall', vnd: '45.000 ₫', usd: '$1.80', checked: 'Oct 2026' }, v: { o: { x: .5, y: .3 } } },
      ],
      captions: [[.2, 2.6, 'A street bowl runs about [45,000 ₫] (~$1.80).'], [2.7, 4.8, 'Go before 9 am — the broth is at its best.']], sfx: [[1, 'ding']] },
    { id: 'end', dur: 2, transition: { type: 'brand', dur: .6 }, layers: [{ type: 'ui', name: 'endFrame', screen: true, always: 1, o: {} }] },
  ]
};
