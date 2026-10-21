#!/usr/bin/env python3
"""Poison Pill image registry — fixes the "image renders as its file name" bug for good.

WHY IMAGES SHOWED UP AS TEXT: the renderer never reads engine/library/img/*.png or images.json.
It only reads engine/library/images.js (every image embedded as a data URL so the canvas can be exported).
images.js is rebuilt ONLY by tools/sticker.py (or this tool). Copying a PNG + editing images.json by hand
leaves images.js stale → the engine finds no pixels → it draws a placeholder with the id.

  python3 tools/pp_img.py add <file|url> <id> [--role cut|plate|prop] [--credit "Photo: … / Source"] [--license "CC BY 4.0"]
        cut   = person/object cut-out: background removed (rembg) → used in mid= / fg=   (default)
        plate = full rectangle kept (no removal) → used as bg=  (blurred & toned by the engine)
        prop  = rectangle kept, small object/document photo for fg=
        --gen "<tool>"  = the image was AI-generated (v5: ONLY clean plates, environments, objects/props, textures — never a real
                          person, document, logo or event). It is logged as AI in the registry and in the credits file.
  python3 tools/pp_img.py gen-list        # the AI cue sheet: every generated image and its role (paste into the description)
  python3 tools/pp_img.py sync            # rebuild images.js from images.json (after ANY manual edit), report broken entries
  python3 tools/pp_img.py check <story>   # every id used in a story exists AND is embedded
  python3 tools/pp_img.py list
Ids: lowercase letters, digits and underscores only (quibi_bg_hollywood). The file is renamed to <id>.png — hyphen/underscore
mismatches between file names and ids were the second cause of missing images.
"""
import sys, os, json, re, base64, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); LIB = os.path.join(ROOT, 'engine', 'library'); REG = os.path.join(LIB, 'images.json')
def load(): return json.load(open(REG, encoding='utf-8')) if os.path.exists(REG) else {}
def sync(quiet=False):
    r = load(); out, bad = {}, []
    for k, v in r.items():
        src = os.path.join(ROOT, v.get('src', ''))
        if not os.path.exists(src):
            alt = os.path.join(LIB, 'img', k.replace('_', '-') + '.png'), os.path.join(LIB, 'img', k + '.png')
            found = next((a for a in alt if os.path.exists(a)), None)
            if found: v['src'] = os.path.relpath(found, ROOT).replace(os.sep, '/'); src = found; print(f'fixed path {k} → {v["src"]}')
            else: bad.append(k); continue
        mime = 'image/jpeg' if src.lower().endswith(('.jpg', '.jpeg')) else 'image/png'
        out[k] = {**v, 'data': f'data:{mime};base64,' + base64.b64encode(open(src, 'rb').read()).decode()}
    json.dump(r, open(REG, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    open(os.path.join(LIB, 'images.js'), 'w').write('window.IMAGES = ' + json.dumps(out) + ';\n')
    if not quiet: print(f'images.js rebuilt: {len(out)} embedded' + (f', BROKEN (file missing): {", ".join(bad)}' if bad else ''))
    return bad
def add(src, id_, role='cut', credit='', lic='', gen=''):
    if not re.match(r'^[a-z0-9_]+$', id_): sys.exit(f'bad id "{id_}" — use lowercase, digits, underscores')
    cut = 'auto' if role == 'cut' else 'none'
    cmd = [sys.executable, os.path.join(ROOT, 'tools', 'sticker.py'), 'make', src, id_, '--cut', cut] + (['--credit', credit] if credit else []) + (['--license', lic] if lic else [])
    subprocess.run(cmd, check=True); r = load(); r[id_]['role'] = role
    if gen: r[id_]['gen'] = gen; r[id_]['credit'] = f'AI-generated illustration ({gen})'
    json.dump(r, open(REG, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); sync(True); print(f'{id_}: role={role} embedded ✓')
def check(story):
    t = open(story, encoding='utf-8').read(); r = load(); js = open(os.path.join(LIB, 'images.js')).read() if os.path.exists(os.path.join(LIB, 'images.js')) else ''
    ids = set(re.findall(r'\bbg=(\w+)', t)); [ids.update(w.split(',')) for w in re.findall(r'\bbg="?wall:([\w,]+)', t)]; ids.discard('wall'); [ids.update(x.split(';')[0].strip() for x in m.split('|')) for m in re.findall(r'\b(?:mid|fg)="([^"]+)"', t)]
    ids = {i for i in ids if i and not i.startswith('@') and not re.match(r'^(navy|paper|black|news|chart|spot|flash|world|cork|wood)$', i)}; bad = 0
    for i in sorted(ids):
        st = 'OK' if i in r and f'"{i}":' in js else ('NOT EMBEDDED → run sync' if i in r else 'NOT REGISTERED → add'); bad += st != 'OK'; print(f'{i:32} {st}')
    sys.exit(1 if bad else 0)
if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k, d='': a[a.index('--' + k) + 1] if '--' + k in a else d
    if not a: print(__doc__)
    elif a[0] == 'add': add(a[1], a[2], opt('role', 'cut'), opt('credit'), opt('license'), opt('gen'))
    elif a[0] == 'gen-list': [print(f"{k:32} {v.get('role', '-'):6} {v['gen']}") for k, v in load().items() if v.get('gen')]
    elif a[0] == 'sync': sys.exit(1 if sync() else 0)
    elif a[0] == 'check': check(a[1])
    elif a[0] == 'list': [print(f"{k:32} {v.get('role', '-'):6} {v['w']}x{v['h']} {v.get('credit', '')}") for k, v in load().items()]
    else: print(__doc__)
