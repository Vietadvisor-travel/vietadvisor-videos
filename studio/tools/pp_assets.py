#!/usr/bin/env python3
"""Batch asset import for an episode — the Asset hunter's one command.
  python3 tools/pp_assets.py import research/<slug>_assets.csv [--enhance]
  python3 tools/pp_assets.py pop <file|url> <id> [--credit …]      # 2.5D pair: <id> (cut-out) + <id>_plate (same photo as plate)
  python3 tools/pp_assets.py search "<query>" [--n 8]               # free-licence candidates (Wikimedia Commons) with credit lines
  python3 tools/pp_assets.py report research/<slug>_assets.csv      # what is imported / missing / unlicensed
CSV columns (pp_new.mjs writes the header): id,role(cut|plate|prop|clip|pop),layer,source/search,licence,credit,used in,status
  source = a local path or an https URL (image) · for role=clip: video path/URL + optional "@start+dur" (clip.mp4@12+3)
--enhance: auto-contrast + light unsharp mask before import (old scans, low-contrast archive photos)."""
import sys, os, csv, subprocess, re, json, tempfile
def rows_of(path): return [{re.sub(r'\(.*\)', '', k or '').strip(): (v or '') for k, v in r.items()} for r in csv.DictReader(open(path, encoding='utf-8-sig'))]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); T = os.path.join(ROOT, 'tools'); REG = os.path.join(ROOT, 'engine', 'library', 'images.json')
def run(*a): return subprocess.run([sys.executable, *a], check=True)
def enhance(src):
    from PIL import Image, ImageOps, ImageFilter
    import urllib.request, io
    im = Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(src, headers={'User-Agent': 'PoisonPillStudio/1'}), timeout=60).read())) if re.match(r'^https?://', src) else Image.open(src)
    mode = 'RGBA' if im.mode in ('RGBA', 'LA') else 'RGB'; im = im.convert(mode)
    rgb = ImageOps.autocontrast(im.convert('RGB'), cutoff=1).filter(ImageFilter.UnsharpMask(radius=2, percent=80, threshold=3))
    if mode == 'RGBA': rgb.putalpha(im.split()[-1])
    out = os.path.join(tempfile.mkdtemp(), 'enh.png'); rgb.save(out); return out
def add(row, enh=False):
    id_, role, src = row['id'].strip(), (row.get('role') or 'cut').split('(')[0].strip(), (row.get('source') or row.get('source/search') or '').strip()
    credit, lic = row.get('credit', ''), row.get('licence', row.get('license', ''))
    if not id_ or not src or src.startswith('<'): print('skip (no source):', id_); return False
    if role == 'clip':
        m = re.match(r'^(.*?)(?:@([\d.]+)\+([\d.]+))?$', src); args = [os.path.join(T, 'pp_clip.py'), 'add', m.group(1), id_]
        if m.group(2): args += ['--start', m.group(2), '--dur', m.group(3)]
        run(*args, '--credit', credit, '--license', lic); return True
    if enh: src = enhance(src)
    if role == 'pop': pop(src, id_, credit, lic); return True
    run(os.path.join(T, 'pp_img.py'), 'add', src, id_, '--role', role if role in ('cut', 'plate', 'prop') else 'cut', '--credit', credit, '--license', lic); return True
def pop(src, id_, credit='', lic=''):
    run(os.path.join(T, 'pp_img.py'), 'add', src, id_, '--role', 'cut', '--credit', credit, '--license', lic)
    run(os.path.join(T, 'pp_img.py'), 'add', src, id_ + '_plate', '--role', 'plate', '--credit', credit, '--license', lic)
    print(f'2.5D pair ready → bg={id_}_plate bgBlur=6 + mid="{id_};…"  (the person lifts off their own photo; use cam=vertigo or orbit)')
def report(path):
    reg = json.load(open(REG, encoding='utf-8')) if os.path.exists(REG) else {}; bad = 0
    for row in rows_of(path):
        i = row['id'].strip(); ok = i in reg or (i + '__000') in reg; lic = (row.get('licence') or '').strip()
        st = ('OK' if ok else 'MISSING') + ('' if lic else ' · NO LICENCE'); bad += st != 'OK'; print(f'{i:30} {row.get("role", ""):6} {st}')
    print(f'\n{bad} problem(s)'); sys.exit(1 if bad else 0)
if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k, d='': a[a.index('--' + k) + 1] if '--' + k in a else d
    if not a: print(__doc__)
    elif a[0] == 'import':
        n = 0
        for row in rows_of(a[1]):
            try: n += bool(add(row, '--enhance' in a))
            except Exception as ex: print('FAILED', row.get('id'), ex)
        print(f'{n} imported'); run(os.path.join(T, 'pp_img.py'), 'sync')
    elif a[0] == 'pop': pop(a[1], a[2], opt('credit'), opt('license'))
    elif a[0] == 'search': run(os.path.join(T, 'sticker.py'), 'search', a[1], '--n', opt('n', '8'))
    elif a[0] == 'report': report(a[1])
    else: print(__doc__)
