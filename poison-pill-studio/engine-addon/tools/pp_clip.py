#!/usr/bin/env python3
"""Real FOOTAGE as a layer: turn a short video clip (archive news, an ad, a keynote moment) into an image sequence the
engine plays inside any layer —  mid="clip:<id>;style:tv"  ·  fg="clip:<id>;style:polaroid"  ·  bg=clip:<id>
  python3 tools/pp_clip.py add <video> <id> [--start 12.5] [--dur 3] [--fps 12] [--width 720] [--cut none|auto] [--noloop]
        [--credit "Footage: … / Source"] [--license "…"]
  python3 tools/pp_clip.py list
Frames are registered as <id>__000 … in images.json and embedded in images.js (via pp_img sync). Keep clips SHORT
(2–4 s, ≤ 12 fps, ≤ 720 px): every frame is embedded in the render bundle. Use only footage you may use (own, licensed,
public domain, or short editorial fair-use excerpts that the narration comments on) — credit it.
--cut auto removes the background of every frame (slow; for a person on a plain background)."""
import sys, os, json, subprocess, tempfile, glob, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); LIB = os.path.join(ROOT, 'engine', 'library'); IMG = os.path.join(LIB, 'img'); REG = os.path.join(LIB, 'images.json')
sys.path.insert(0, os.path.join(ROOT, 'tools'))
def load(): return json.load(open(REG, encoding='utf-8')) if os.path.exists(REG) else {}
def add(src, id_, start=0, dur=3, fps=12, width=720, cut='none', loop=True, credit='', lic=''):
    os.makedirs(IMG, exist_ok=True); tmp = tempfile.mkdtemp()
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(start), '-t', str(dur), '-i', src, '-vf', f'fps={fps},scale={width}:-2', '-q:v', '4', os.path.join(tmp, 'f%03d.jpg')], check=True)
    frames = sorted(glob.glob(os.path.join(tmp, 'f*.jpg'))); r = load()
    for k in [k for k in r if k.startswith(id_ + '__')]: r.pop(k)
    for i, f in enumerate(frames):
        fid = f'{id_}__{i:03d}'; dst = os.path.join(IMG, fid + ('.png' if cut == 'auto' else '.jpg'))
        if cut == 'auto':
            import sticker; from PIL import Image; im = sticker.cutout(Image.open(f)); im.save(dst)
        else: shutil.copy(f, dst)
        from PIL import Image; w, h = Image.open(dst).size
        r[fid] = {'src': os.path.relpath(dst, ROOT).replace(os.sep, '/'), 'w': w, 'h': h, 'cut': cut == 'auto', 'role': 'clip', 'fps': fps, 'loop': loop, 'credit': credit, 'license': lic, 'from': os.path.basename(src)}
    json.dump(r, open(REG, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); shutil.rmtree(tmp)
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'pp_img.py'), 'sync'], check=True)
    print(f'clip {id_}: {len(frames)} frames @ {fps} fps → use mid="clip:{id_};style:tv" or bg=clip:{id_}')
if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k, d='': a[a.index('--' + k) + 1] if '--' + k in a else d
    if not a: print(__doc__)
    elif a[0] == 'add': add(a[1], a[2], float(opt('start', 0)), float(opt('dur', 3)), int(opt('fps', 12)), int(opt('width', 720)), opt('cut', 'none'), '--noloop' not in a, opt('credit'), opt('license'))
    elif a[0] == 'list':
        seen = {}
        for k, v in load().items():
            if '__' in k and v.get('role') == 'clip': seen[k.split('__')[0]] = seen.get(k.split('__')[0], 0) + 1
        [print(f'{k:28} {n} frames') for k, n in seen.items()]
    else: print(__doc__)
