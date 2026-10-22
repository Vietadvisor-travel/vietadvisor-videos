#!/usr/bin/env python3
"""Frame-by-frame QA contact sheets for a storyboard, before the expensive render.
  python3 tools/qa.py stories/x.story [--every 1.0] [--scale .25] [--fmt 9x16|16x9]
Renders one still every N seconds (real voice timing if out/<slug>_vo/durs.json exists), stamps the time on
each, and writes out/<slug>_qa_<k>.jpg sheets (40 frames each). Look at every sheet: floating people or
vehicles, cropped heads, empty halves of the frame, text on faces, long static stretches."""
import sys, os, json, subprocess, glob
from PIL import Image, ImageDraw
a = sys.argv[1:]; story = a[0]; opt = lambda k, d: float(a[a.index('--' + k) + 1]) if '--' + k in a else d
fmt = a[a.index('--fmt') + 1] if '--fmt' in a else '9x16'
every, scale = opt('every', 1.0), opt('scale', .25)
slug = os.path.splitext(os.path.basename(story))[0]; base = f'out/{slug}'; vo = f'{base}_vo/durs.json'
cues = f'{base}_qa_cues.json'; voa = ['--vo', vo] if os.path.exists(vo) else []
subprocess.check_call(['node', 'tools/render.mjs', story, '--cues', cues, *voa], stdout=subprocess.DEVNULL)
D = json.load(open(cues))['duration']; ts = [round(i * every + every / 2, 2) for i in range(int(D / every))]
d = f'{base}_qa'; os.makedirs(d, exist_ok=True); [os.remove(f) for f in glob.glob(d + '/*.jpg')]
subprocess.check_call(['node', 'tools/render.mjs', story, '--fmt', fmt, '--scale', str(scale), '--stills', ','.join(map(str, ts)), '--out', d, *voa], stdout=subprocess.DEVNULL)
fs = sorted(glob.glob(d + '/*.jpg'), key=lambda f: float(f.split('_t')[-1][:-4]))
for old in glob.glob(f'{base}_qa_*.jpg'): os.remove(old)
per, cols = 40, 10
for s in range(0, len(fs), per):
    ch = fs[s:s + per]; im0 = Image.open(ch[0]); w, h = im0.size; rows = (len(ch) + cols - 1) // cols
    sh = Image.new('RGB', (cols * w, rows * h), 'black'); dr = ImageDraw.Draw(sh)
    for i, f in enumerate(ch):
        x, y = (i % cols) * w, (i // cols) * h; sh.paste(Image.open(f), (x, y)); t = float(f.split('_t')[-1][:-4])
        dr.rectangle([x, y, x + 62, y + 18], fill='black'); dr.text((x + 4, y + 3), f'{int(t // 60)}:{t % 60:04.1f}', fill='yellow')
    sh.save(f'{base}_qa_{s // per}.jpg', quality=85)
print(f'qa: {len(fs)} frames over {D:.1f}s → {base}_qa_*.jpg ({(len(fs) + per - 1) // per} sheets)')
