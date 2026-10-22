#!/usr/bin/env python3
"""Real photos as animated cut-out stickers (collage / Johnny-Harris style) next to the drawn cast.
  python3 tools/sticker.py make <image path or URL> <id> [--cut auto|none] [--credit "Photo: Name / Source"] [--license "CC BY-SA 4.0"]
        → engine/library/img/<id>.png (background removed, trimmed, ≤1000 px) + entry in engine/library/images.json
  python3 tools/sticker.py search "phở bò Hà Nội" [--n 8]       # Wikimedia Commons (free licences, credit filled in)
  python3 tools/sticker.py plate <photo> <id> [--credit …]       # photo → drawn-style background plate (use bgphoto=<id>)
  python3 tools/sticker.py list                                   # what's registered
Background removal: rembg (isnet-general-use, offline after first download ~170 MB). --cut none keeps the
rectangle (the engine then frames it as a polaroid / torn-paper card).
Licence rule: only your own photos, or free-licence images with the credit filled in (Unsplash/Pexels licence,
CC BY / BY-SA / CC0, public domain). Never stock or social-media photos without permission."""
import sys, os, json, io, re, urllib.request, urllib.parse
from PIL import Image, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(ROOT, 'engine', 'library'); IMG = os.path.join(LIB, 'img'); REG = os.path.join(LIB, 'images.json')
UA = {'User-Agent': 'VietadvisorMotionStudio/3 (contact@vietadvisor.travel)'}

def load_reg(): return json.load(open(REG, encoding='utf-8')) if os.path.exists(REG) else {}
def save_reg(r):
    json.dump(r, open(REG, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    import base64   # images.js embeds data URLs so the render canvas is never tainted (file:// images would be)
    out = {k: {**v, 'data': 'data:image/png;base64,' + base64.b64encode(open(os.path.join(ROOT, v['src']), 'rb').read()).decode()} for k, v in r.items() if os.path.exists(os.path.join(ROOT, v['src']))}
    open(os.path.join(LIB, 'images.js'), 'w').write('window.IMAGES = ' + json.dumps(out) + ';\n')

def fetch(src):
    if re.match(r'^https?://', src):
        with urllib.request.urlopen(urllib.request.Request(src, headers=UA), timeout=60) as f: return Image.open(io.BytesIO(f.read()))
    return Image.open(src)

_sess = None
def cutout(im):
    global _sess
    try:
        from rembg import remove, new_session
    except ImportError:
        os.system(f'{sys.executable} -m pip install -q rembg --break-system-packages'); from rembg import remove, new_session
    if _sess is None:
        try: _sess = new_session('isnet-general-use')
        except Exception: _sess = new_session('u2netp')
    out = remove(im.convert('RGB'), session=_sess, post_process_mask=True)
    a = out.split()[-1].filter(ImageFilter.GaussianBlur(.8)).point(lambda v: 0 if v < 40 else (255 if v > 215 else v))   # clean, slightly soft edge
    out.putalpha(a); return out

def make(src, id_, cut='auto', credit='', license_=''):
    os.makedirs(IMG, exist_ok=True); im = fetch(src); im.load()
    im = im.convert('RGBA'); has_alpha = im.getextrema()[3][0] < 250
    if cut == 'auto' and not has_alpha: im = cutout(im)
    bbox = im.getbbox() if (cut != 'none' or has_alpha) else None
    if bbox: im = im.crop(bbox)
    im.thumbnail((1000, 1000), Image.LANCZOS); p = os.path.join(IMG, id_ + '.png'); im.save(p, optimize=True)
    r = load_reg(); r[id_] = { 'src': f'engine/library/img/{id_}.png', 'w': im.width, 'h': im.height, 'cut': cut != 'none' or has_alpha, 'credit': credit, 'license': license_, 'from': src if re.match(r'^https?://', src) else os.path.basename(src) }
    save_reg(r); print(f'sticker {id_}: {im.width}x{im.height} → {p}', '' if credit or not re.match(r'^https?://', src) else '  ⚠ add --credit/--license')

def plate(src, id_, credit='', license_='', k=14):
    """Photo → hand-drawn style background plate (edge-preserving smoothing + colour quantisation + ink lines)."""
    import numpy as np, cv2
    os.makedirs(IMG, exist_ok=True); im = fetch(src).convert('RGB'); im.thumbnail((1600, 1600), Image.LANCZOS); a = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    sm = a.copy()
    for _ in range(4): sm = cv2.bilateralFilter(sm, 9, 60, 9)
    Z = sm.reshape(-1, 3).astype(np.float32); _, lab, cen = cv2.kmeans(Z, k, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 12, 1.0), 2, cv2.KMEANS_PP_CENTERS)
    q = cen[lab.flatten()].reshape(sm.shape).astype(np.uint8)
    hsv = cv2.cvtColor(q, cv2.COLOR_BGR2HSV).astype(np.float32); hsv[..., 1] = np.clip(hsv[..., 1] * 1.18, 0, 255); hsv[..., 2] = np.clip(hsv[..., 2] * 1.04 + 6, 0, 255); q = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    g = cv2.medianBlur(cv2.cvtColor(a, cv2.COLOR_BGR2GRAY), 7); e = cv2.adaptiveThreshold(g, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 5)
    e = cv2.erode(e, np.ones((2, 2), np.uint8)); ink = np.array([22, 29, 43], np.uint8)
    out = np.where(e[..., None] < 128, (q * .25 + ink * .75).astype(np.uint8), q)
    p = os.path.join(IMG, id_ + '.png'); Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB)).save(p, optimize=True)
    r = load_reg(); r[id_] = {'src': f'engine/library/img/{id_}.png', 'w': out.shape[1], 'h': out.shape[0], 'cut': False, 'plate': True, 'credit': credit, 'license': license_, 'from': src if re.match(r'^https?://', src) else os.path.basename(src)}
    save_reg(r); print(f'plate {id_}: {out.shape[1]}x{out.shape[0]} → {p}  (use: bgphoto={id_})')

def search(q, n=8):
    api = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({'action': 'query', 'generator': 'search', 'gsrnamespace': 6, 'gsrsearch': q, 'gsrlimit': n, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|mime', 'iiurlwidth': 1200, 'format': 'json'})
    with urllib.request.urlopen(urllib.request.Request(api, headers=UA), timeout=30) as f: d = json.load(f)
    for p in (d.get('query') or {}).get('pages', {}).values():
        ii = p['imageinfo'][0]; m = ii.get('extmetadata', {}); artist = re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', '')).strip()
        if not ii.get('mime', '').startswith('image/'): continue
        print(json.dumps({'url': ii.get('thumburl') or ii['url'], 'title': p['title'], 'license': m.get('LicenseShortName', {}).get('value', ''), 'credit': f"Photo: {artist} / Wikimedia Commons"}, ensure_ascii=False))

if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k, d='': a[a.index('--' + k) + 1] if '--' + k in a else d
    if not a: print(__doc__)
    elif a[0] == 'make': make(a[1], a[2], opt('cut', 'auto'), opt('credit'), opt('license'))
    elif a[0] == 'plate': plate(a[1], a[2], opt('credit'), opt('license'))
    elif a[0] == 'search': search(a[1], int(opt('n', 8)))
    elif a[0] == 'remove': r = load_reg(); r.pop(a[1], None); save_reg(r); print('removed', a[1])
    elif a[0] == 'list': [print(k, v['w'], v['h'], v.get('credit', '')) for k, v in load_reg().items()]
    else: print(__doc__)
