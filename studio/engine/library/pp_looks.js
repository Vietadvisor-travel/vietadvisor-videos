/* Poison Pill v4.2 — LOOKS: the visual identity follows the CONTENT. A look sets backdrops (base, texture, ornament), how real
   photos are treated, accent palette, the colour script per act, the vignette, and the 3D world colours — all at once.
   Story header `look: <name>` (per episode or per act file) · per beat `# cine … look=<name>`.
   dossier   case file on a desk — manila, kraft, archive prints            investigations, frauds, "the file" stories (default)
   noir      dark navy, black & white prints, red crisis                     scandals, deaths, dark mysteries
   editorial clean off-white, black ink, signal red/yellow, colour photos    explainers, modern business, consumer brands
   tech      near-black slate, cyan/violet light, scanlines                 tech, startups, crypto, AI, social media
   luxury    black & champagne gold, film grain, elegant B&W                 billionaires, fashion, luxury, hotels, art
   vintage   sepia film, scratches, warm brown                               1850–1950 history: Rockefeller, Ford, Titanic
   retro     80s/90s purple night, hot pink & cyan, synth grid               Atari, Blockbuster, Nintendo, MTV-era brands
   broadcast cool white newsroom, navy, breaking red                         recent news events, trials, public collapses
   eastern   rice paper, vermilion seal, gold, ink                           Asian conglomerates: Samsung, Alibaba, Toyota, Tata, Vingroup
   ledger    banker's green, ruled lines, gold                               banks, Wall Street, crises, hedge funds
   blueprint engineering blue, white grid lines                             manufacturing, aviation, cars, infrastructure, engineering failures */
(function () {
  if (!window.PPCINE || !window.PPCINE.LOOKS) return; const { LOOKS } = window.PPCINE;
  const A = (tint, op, a, acc, sup, sat, bg, x = {}) => ({ tint, op, a, acc, sup, sat, bg, ...x });
  const acts = (o) => ({ thumb: A('#000000', 'soft-light', 0, o.setup.acc, o.setup.sup, 0, o.setup.bg), ...o });
  const def = (name, L) => { LOOKS[name] = { name, ...L }; };

  def('editorial', { map: { sea: '#dfe6e8', land: '#f7f5f0', line: 'rgba(17,17,17,.35)' }, family: 'light', gold: ['#e0a100', '#b07d00'], red: '#e3342f', ink: '#111111', stroke: '#ffffff',
    bg: { base: { cream: ['#f3f1ec', '#e8e5de'], news: ['#efede7', '#e2ded5'], chart: ['#f2f2ef', '#e5e5e0'], spot: ['#f4f1ea', '#ddd8cc'], black: ['#e7e4dd', '#d6d2c9'], flash: ['#e9dfc8', '#cdbd9c'] }, tex: 'grain', orn: 'dots', ink: 'rgba(17,17,17,.07)', vig: '0,0,0', vigA: .06 },
    plate: { blend: 'source-over', alpha: 1, wash: 'rgba(243,241,236,.30)', tone: 'color', blur: 5, dim: 0, toneBy: { flash: 'sepia', after: 'bw' } }, mid: { tone: 'color', fall: 'bw', after: 'bw', flash: 'sepia' },
    vig: { col: '0,0,0', a: .08, red: '160,20,20', ra: .22 }, three: { bg: '#ecebe6', key: '#ffffff', amt: .55 },
    acts: acts({ setup: A('#ffffff', 'soft-light', 0, '#111111', '#e3342f', 0, 'cream'), rise: A('#ffd23f', 'multiply', .05, '#b07d00', '#111111', 0, 'cream'), doubt: A('#5b8def', 'multiply', .06, '#1d4ed8', '#111111', .1, 'news'),
      fall: A('#e3342f', 'multiply', .07, '#e3342f', '#111111', .25, 'cream', { red: 1 }), after: A('#8a8f98', 'multiply', .1, '#111111', '#555b66', .35, 'cream'), flash: A('#e9d6a8', 'multiply', .2, '#2b1d10', '#7a5a10', .5, 'paper', { sepia: 1, light: 1 }), lesson: A('#ffffff', 'soft-light', 0, '#111111', '#e3342f', .1, 'spot') }) });

  def('tech', { map: { sea: '#060b14', land: '#12223a', line: 'rgba(80,200,255,.45)' }, family: 'dark', gold: ['#22d3ee', '#67e8f9'], red: '#ff3b5c', ink: '#e6f1ff', paper: '#e6f1ff',
    bg: { base: { cream: ['#101a29', '#060a11'], news: ['#0f1824', '#070b12'], chart: ['#0c1420', '#05090f'], spot: ['#14203a', '#04070c'], black: ['#06080c', '#020305'], flash: ['#0b2a2e', '#041214'] }, tex: 'scan', orn: 'grid', ink: 'rgba(80,200,255,.07)', vig: '0,0,0', vigA: .35 },
    plate: { blend: 'source-over', alpha: 1, wash: 'rgba(6,12,24,.45)', tone: 'navy', blur: 8, dim: .25, toneBy: { rise: 'neon', doubt: 'teal', fall: 'red' } }, mid: { tone: 'cool', fall: 'red', after: 'bw', flash: 'teal' },
    vig: { col: '0,0,0', a: .45, red: '120,0,30', ra: .55 }, three: { bg: '#0b1220', key: '#9be7ff', amt: .75 },
    acts: acts({ setup: A('#22d3ee', 'soft-light', .12, '#22d3ee', '#e6f1ff', 0, 'navy'), rise: A('#7c3aed', 'soft-light', .16, '#a78bfa', '#e6f1ff', 0, 'navy', { glow: 1 }), doubt: A('#0ea5e9', 'color', .18, '#7dd3fc', '#e6f1ff', .3, 'news'),
      fall: A('#ff3b5c', 'soft-light', .18, '#ff3b5c', '#e6f1ff', .4, 'black', { red: 1 }), after: A('#334155', 'multiply', .3, '#94a3b8', '#cbd5e1', .6, 'navy'), flash: A('#0d9488', 'multiply', .35, '#99f6e4', '#e6f1ff', .5, 'flash', { light: 0 }), lesson: A('#0f172a', 'multiply', .2, '#22d3ee', '#e6f1ff', .4, 'spot') }) });

  def('luxury', { map: { sea: '#0b0906', land: '#2a2116', line: 'rgba(212,175,55,.5)' }, family: 'dark', gold: ['#d4af37', '#f0d78c'], red: '#b3261e', ink: '#f5e6c8', paper: '#f5e6c8',
    bg: { base: { cream: ['#1a140d', '#080604'], news: ['#17120b', '#070504'], chart: ['#16110b', '#060403'], spot: ['#2a1f12', '#050403'], black: ['#0a0806', '#020101'], flash: ['#3a2a18', '#120c06'] }, tex: 'grain', orn: 'frame', ink: 'rgba(212,175,55,.35)', vig: '0,0,0', vigA: .4 },
    plate: { blend: 'source-over', alpha: 1, wash: 'rgba(10,8,5,.45)', tone: 'sepia', blur: 9, dim: .3, toneBy: { rise: 'gold', fall: 'red' } }, mid: { tone: 'bw', fall: 'red', after: 'bw', flash: 'sepia' },
    vig: { col: '0,0,0', a: .5, red: '90,10,5', ra: .55 }, three: { bg: '#120d08', key: '#ffd58a', amt: .7 },
    acts: acts({ setup: A('#d4af37', 'soft-light', .14, '#d4af37', '#f5e6c8', 0, 'navy', { glow: 1 }), rise: A('#f0d78c', 'soft-light', .22, '#f0d78c', '#f5e6c8', 0, 'spot', { glow: 1 }), doubt: A('#4a5a6a', 'color', .2, '#c9b78f', '#f5e6c8', .3, 'news'),
      fall: A('#b3261e', 'soft-light', .2, '#e5484d', '#f5e6c8', .45, 'black', { red: 1 }), after: A('#2a2520', 'multiply', .3, '#c9b78f', '#a8987a', .7, 'navy'), flash: A('#8a6a3a', 'multiply', .35, '#f0d78c', '#f5e6c8', .55, 'flash', { sepia: 1 }), lesson: A('#120d08', 'multiply', .2, '#d4af37', '#f5e6c8', .4, 'spot') }) });

  def('vintage', { map: { sea: '#bfa77e', land: '#e2cfa6', line: 'rgba(60,40,20,.6)' }, family: 'light', gold: ['#8a5a14', '#6b440c'], red: '#8e2a1b', ink: '#2b1d10', stroke: '#f3e6c8',
    bg: { base: { cream: ['#d9c39b', '#b49668'], news: ['#d6c7a4', '#b5a079'], chart: ['#d8ccab', '#bcab83'], spot: ['#d2b88b', '#9a7c50'], black: ['#6a5640', '#3e3122'], flash: ['#d9c39b', '#b49668'] }, tex: 'film', orn: 'none', ink: 'rgba(43,29,16,.12)', vig: '50,30,10', vigA: .32 },
    plate: { blend: 'multiply', alpha: .9, wash: 'rgba(214,190,145,.18)', tone: 'sepia', blur: 4, dim: 0, toneBy: {} }, mid: { tone: 'sepia', fall: 'sepia', after: 'sepia', flash: 'sepia' },
    vig: { col: '50,30,10', a: .35, red: '110,30,15', ra: .4 }, three: { bg: '#c9b08a', key: '#ffd9a0', amt: .6 },
    acts: acts({ setup: A('#b98a4a', 'multiply', .1, '#2b1d10', '#6b440c', .3, 'cream', { sepia: 1 }), rise: A('#c99a3a', 'multiply', .1, '#6b440c', '#2b1d10', .3, 'cream', { sepia: 1 }), doubt: A('#7a6a52', 'multiply', .14, '#2b1d10', '#5a4a35', .45, 'news', { sepia: 1 }),
      fall: A('#8e2a1b', 'multiply', .14, '#8e2a1b', '#2b1d10', .5, 'cream', { red: 1, sepia: 1 }), after: A('#6a5a48', 'multiply', .16, '#2b1d10', '#5a4a35', .6, 'cream', { sepia: 1 }), flash: A('#e9d6a8', 'multiply', .22, '#2b1d10', '#6b440c', .6, 'paper', { sepia: 1, light: 1 }), lesson: A('#a8875a', 'multiply', .1, '#2b1d10', '#6b440c', .4, 'spot', { sepia: 1 }) }) });

  def('retro', { map: { sea: '#120726', land: '#2a1450', line: 'rgba(244,114,182,.6)' }, family: 'dark', gold: ['#f472b6', '#f9a8d4'], red: '#ff2e63', ink: '#fdf2ff', paper: '#fdf2ff',
    bg: { base: { cream: ['#21103a', '#0a0517'], news: ['#1c0f31', '#090515'], chart: ['#190c2c', '#070412'], spot: ['#2e1548', '#0a0517'], black: ['#0b0618', '#030108'], flash: ['#1b2c4a', '#0a0f1e'] }, tex: 'scan', orn: 'synth', ink: 'rgba(244,114,182,.22)', vig: '10,0,20', vigA: .4 },
    plate: { blend: 'source-over', alpha: 1, wash: 'rgba(24,8,44,.45)', tone: 'neon', blur: 8, dim: .25, toneBy: { fall: 'red' } }, mid: { tone: 'neon', fall: 'red', after: 'bw', flash: 'teal' },
    vig: { col: '10,0,20', a: .5, red: '120,0,40', ra: .55 }, three: { bg: '#1a0b2e', key: '#ff9be0', amt: .75 },
    acts: acts({ setup: A('#f472b6', 'soft-light', .18, '#f472b6', '#fdf2ff', 0, 'navy', { glow: 1 }), rise: A('#22d3ee', 'soft-light', .18, '#67e8f9', '#fdf2ff', 0, 'chart', { glow: 1 }), doubt: A('#7c3aed', 'color', .2, '#c4b5fd', '#fdf2ff', .3, 'news'),
      fall: A('#ff2e63', 'soft-light', .2, '#ff2e63', '#fdf2ff', .4, 'black', { red: 1 }), after: A('#312e81', 'multiply', .3, '#a5b4fc', '#e0e7ff', .6, 'navy'), flash: A('#0e7490', 'multiply', .3, '#67e8f9', '#fdf2ff', .5, 'flash'), lesson: A('#1a0b2e', 'multiply', .2, '#f472b6', '#fdf2ff', .4, 'spot') }) });

  def('broadcast', { map: { sea: '#d5dee8', land: '#f7f9fb', line: 'rgba(13,27,42,.4)' }, family: 'light', gold: ['#c8102e', '#a00d25'], red: '#c8102e', ink: '#0d1b2a', stroke: '#ffffff',
    bg: { base: { cream: ['#f2f4f7', '#dde3ea'], news: ['#eef1f5', '#d9dfe7'], chart: ['#f1f4f8', '#dfe5ed'], spot: ['#f3f5f8', '#d2d9e2'], black: ['#d7dde5', '#c3cbd6'], flash: ['#e6e0d2', '#cfc6b2'] }, tex: 'none', orn: 'stripes', ink: 'rgba(13,27,42,.05)', vig: '0,10,30', vigA: .1 },
    plate: { blend: 'source-over', alpha: 1, wash: 'rgba(242,244,247,.28)', tone: 'color', blur: 5, dim: 0, toneBy: { flash: 'sepia', after: 'bw' } }, mid: { tone: 'color', fall: 'bw', after: 'bw', flash: 'sepia' },
    vig: { col: '0,10,30', a: .12, red: '160,10,30', ra: .25 }, three: { bg: '#e8edf3', key: '#ffffff', amt: .6 },
    acts: acts({ setup: A('#1d4ed8', 'multiply', .04, '#0d1b2a', '#c8102e', 0, 'cream'), rise: A('#1d4ed8', 'multiply', .05, '#1d4ed8', '#0d1b2a', 0, 'chart'), doubt: A('#475569', 'multiply', .08, '#0d1b2a', '#475569', .15, 'news'),
      fall: A('#c8102e', 'multiply', .08, '#c8102e', '#0d1b2a', .3, 'cream', { red: 1 }), after: A('#64748b', 'multiply', .1, '#0d1b2a', '#475569', .4, 'cream'), flash: A('#e9d6a8', 'multiply', .2, '#2b1d10', '#7a5a10', .5, 'paper', { sepia: 1, light: 1 }), lesson: A('#ffffff', 'soft-light', 0, '#0d1b2a', '#c8102e', .1, 'spot') }) });

  def('eastern', { map: { sea: '#b9c4b0', land: '#f0e3c6', line: 'rgba(26,19,17,.5)' }, family: 'light', gold: ['#b8860b', '#8a6200'], red: '#b22222', ink: '#1a1311', stroke: '#f7ecd6',
    bg: { base: { cream: ['#efe2c8', '#d6bf99'], news: ['#ece0c7', '#d2bf9c'], chart: ['#ede3cc', '#d5c4a3'], spot: ['#e6d2ad', '#bd9d6c'], black: ['#3a120e', '#1c0806'], flash: ['#e3d3b3', '#c4ac83'] }, tex: 'fibre', orn: 'seal', ink: 'rgba(26,19,17,.08)', vig: '80,20,10', vigA: .2 },
    plate: { blend: 'multiply', alpha: .82, wash: 'rgba(230,210,170,.16)', tone: 'warm', blur: 6, dim: 0, toneBy: { doubt: 'cool', flash: 'sepia' } }, mid: { tone: 'aged', fall: 'bw', after: 'bw', flash: 'sepia' },
    vig: { col: '80,20,10', a: .22, red: '140,20,10', ra: .34 }, three: { bg: '#e7d6b8', key: '#ffd9a0', amt: .5 },
    acts: acts({ setup: A('#b22222', 'multiply', .06, '#1a1311', '#b22222', 0, 'cream'), rise: A('#b8860b', 'multiply', .1, '#8a6200', '#1a1311', 0, 'cream'), doubt: A('#556b5d', 'multiply', .14, '#2f4a3a', '#1a1311', .15, 'news'),
      fall: A('#b22222', 'multiply', .16, '#b22222', '#1a1311', .3, 'cream', { red: 1 }), after: A('#7a6a58', 'multiply', .16, '#1a1311', '#5a4a3a', .4, 'cream'), flash: A('#e9d6a8', 'multiply', .22, '#2b1d10', '#7a5a10', .55, 'paper', { sepia: 1, light: 1 }), lesson: A('#a8875a', 'multiply', .1, '#1a1311', '#b22222', .15, 'spot') }) });

  def('ledger', { map: { sea: '#061810', land: '#173a28', line: 'rgba(140,220,170,.4)' }, family: 'dark', gold: ['#d4af37', '#f0d78c'], red: '#e5484d', ink: '#eaf4ec', paper: '#eaf4ec',
    bg: { base: { cream: ['#12301f', '#061810'], news: ['#102b1d', '#05140d'], chart: ['#0f2a1c', '#05120b'], spot: ['#173a28', '#05140d'], black: ['#06110b', '#020604'], flash: ['#2a2a18', '#0e0e06'] }, tex: 'grain', orn: 'ledger', ink: 'rgba(140,220,170,.09)', vig: '0,0,0', vigA: .35 },
    plate: { blend: 'source-over', alpha: 1, wash: 'rgba(6,20,14,.45)', tone: 'teal', blur: 8, dim: .3, toneBy: { rise: 'gold', fall: 'red' } }, mid: { tone: 'bw', fall: 'red', after: 'bw', flash: 'sepia' },
    vig: { col: '0,0,0', a: .45, red: '110,0,10', ra: .55 }, three: { bg: '#0c2219', key: '#ffe9b0', amt: .7 },
    acts: acts({ setup: A('#2f855a', 'soft-light', .15, '#d4af37', '#eaf4ec', 0, 'navy'), rise: A('#d4af37', 'soft-light', .2, '#f0d78c', '#eaf4ec', 0, 'chart', { glow: 1 }), doubt: A('#4a6b5a', 'color', .2, '#9fd4b6', '#eaf4ec', .3, 'news'),
      fall: A('#e5484d', 'soft-light', .2, '#e5484d', '#eaf4ec', .4, 'black', { red: 1 }), after: A('#1f3a2c', 'multiply', .3, '#9fd4b6', '#cfe7d9', .6, 'navy'), flash: A('#8a7a3a', 'multiply', .3, '#f0d78c', '#eaf4ec', .55, 'flash', { sepia: 1 }), lesson: A('#061810', 'multiply', .2, '#d4af37', '#eaf4ec', .4, 'spot') }) });

  def('blueprint', { map: { sea: '#0a2a52', land: '#124274', line: 'rgba(214,236,255,.6)' }, family: 'dark', gold: ['#ffd166', '#ffe29a'], red: '#ff6b6b', ink: '#eaf3ff', paper: '#eaf3ff',
    bg: { base: { cream: ['#124274', '#0a2a52'], news: ['#103c6c', '#09284d'], chart: ['#11406f', '#0a2a50'], spot: ['#16508c', '#082447'], black: ['#07203f', '#030e1d'], flash: ['#1b4a6e', '#0b2238'] }, tex: 'none', orn: 'blueprint', ink: 'rgba(214,236,255,.10)', vig: '0,0,20', vigA: .3 },
    plate: { blend: 'source-over', alpha: 1, wash: 'rgba(10,40,80,.45)', tone: 'blueprint', blur: 6, dim: .15, toneBy: { fall: 'red' } }, mid: { tone: 'blueprint', fall: 'red', after: 'bw', flash: 'sepia' },
    vig: { col: '0,0,20', a: .35, red: '100,0,10', ra: .5 }, three: { bg: '#0d335f', key: '#d6ecff', amt: .7 },
    acts: acts({ setup: A('#5aa9ff', 'soft-light', .1, '#ffd166', '#eaf3ff', 0, 'navy'), rise: A('#ffd166', 'soft-light', .14, '#ffd166', '#eaf3ff', 0, 'chart'), doubt: A('#7aa7d6', 'color', .14, '#bfe0ff', '#eaf3ff', .2, 'news'),
      fall: A('#ff6b6b', 'soft-light', .18, '#ff6b6b', '#eaf3ff', .35, 'black', { red: 1 }), after: A('#123a63', 'multiply', .25, '#bfe0ff', '#d6ecff', .5, 'navy'), flash: A('#3a6a8a', 'multiply', .3, '#ffe29a', '#eaf3ff', .5, 'flash'), lesson: A('#0a2a52', 'multiply', .2, '#ffd166', '#eaf3ff', .3, 'spot') }) });

  window.PPLOOKS = Object.keys(LOOKS);
})();
