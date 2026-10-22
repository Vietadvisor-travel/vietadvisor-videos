#!/usr/bin/env python3
"""pp_pack — move a finished image set from one machine to another (Muse finds the images, Claude builds the film).

  python3 tools/pp_pack.py export <slug> [--ids a,b,c | --prefix nokia_] [--desc research/<slug>_desc.json] [--research RESEARCH_<slug>.md]
        → packs/<slug>_assets.zip : every image already imported with pp_img.py / pp_find.py (cut-outs stay cut out),
          pack.json (id → role, credit, licence, AI flag, what it shows) and CATALOG.md (the list the director writes against).
          Default selection: every id that starts with "<slug>_". --desc: {"id": "what it shows", …} for the catalogue.
  python3 tools/pp_pack.py import packs/<slug>_assets.zip
        → images copied into engine/library/img, registry merged (credits and AI flags kept), images.js rebuilt.
          Prints CATALOG.md. Ids already present are replaced by the pack's version.
  python3 tools/pp_pack.py list packs/<slug>_assets.zip
  python3 tools/pp_pack.py music-export          → packs/music_library.zip (the whole music/ library: tracks + library.json)
  python3 tools/pp_pack.py music-import packs/music_library.zip   → music/ merged (tracks added, library.json entries merged)
Only PNG/JPG/WEBP images and the two metadata files are read from a pack; ids must be lowercase_underscores."""
import sys, os, json, re, zipfile, shutil, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); LIB = os.path.join(ROOT, 'engine', 'library'); REG = os.path.join(LIB, 'images.json')
ID = re.compile(r'^[a-z0-9_]+$'); EXT = ('.png', '.jpg', '.jpeg', '.webp')
def load(): return json.load(open(REG, encoding='utf-8')) if os.path.exists(REG) else {}

def catalog(meta, slug):
    rows = sorted(meta.items(), key=lambda kv: (kv[1].get('role', ''), kv[0]))
    out = [f'# Image catalogue: {slug} ({len(rows)} images)', '', 'Use ONLY these ids in the storyboard (mid=, bg=, fg=, @id in build, img() in custom scenes).', '',
           '| id | role | what it shows | licence / credit | AI |', '|---|---|---|---|---|']
    for k, v in rows:
        out.append(f"| `{k}` | {v.get('role', '')} | {v.get('desc', '') or '—'} | {(v.get('license') or '') + (' · ' if v.get('license') and v.get('credit') else '') + (v.get('credit') or '')} | {'AI' if v.get('gen') else ''} |")
    out += ['', 'role: cut = cut-out (mid=/fg=) · plate = full background (bg=) · prop = object/document photo (fg=).',
            'AI images are only plates/environments/props/textures — never real people, documents, logos or events.']
    return '\n'.join(out) + '\n'

def export(slug, ids=None, prefix=None, desc=None, research=None):
    r = load(); pre = prefix or (slug.replace('-', '_') + '_')
    sel = [i for i in (ids or [k for k in r if k.startswith(pre)]) if i in r]
    if not sel: sys.exit(f'nothing to pack: no registered ids {"in --ids" if ids else "starting with " + pre} (import them first with pp_find.py / pp_img.py)')
    D = json.load(open(desc, encoding='utf-8')) if desc else {}
    os.makedirs(os.path.join(ROOT, 'packs'), exist_ok=True); zp = os.path.join(ROOT, 'packs', f'{slug}_assets.zip'); meta = {}
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
        for i in sel:
            v = r[i]; src = os.path.join(ROOT, v.get('src', ''))
            if not os.path.exists(src): print('missing file, skipped:', i); continue
            z.write(src, 'img/' + i + os.path.splitext(src)[1].lower())
            meta[i] = {k: v[k] for k in ('role', 'cut', 'credit', 'license', 'gen', 'w', 'h') if k in v}; meta[i]['file'] = 'img/' + i + os.path.splitext(src)[1].lower()
            if D.get(i): meta[i]['desc'] = D[i]
        z.writestr('pack.json', json.dumps({'slug': slug, 'images': meta}, ensure_ascii=False, indent=1))
        z.writestr('CATALOG.md', catalog(meta, slug))
        if research and os.path.exists(research): z.write(research, os.path.basename(research))
    print(f'packed {len(meta)} images → {zp} ({os.path.getsize(zp) / 1e6:.1f} MB)'); print(catalog(meta, slug))

def read_pack(zp):
    z = zipfile.ZipFile(zp); P = json.loads(z.read('pack.json').decode('utf-8')); return z, P

def imp(zp):
    z, P = read_pack(zp); r = load(); dst = os.path.join(LIB, 'img'); os.makedirs(dst, exist_ok=True); n = 0
    for i, m in P['images'].items():
        f = m.get('file', '')
        if not ID.match(i) or not f.startswith('img/') or '..' in f or not f.lower().endswith(EXT) or f not in z.namelist(): print('rejected entry:', i); continue
        out = os.path.join(dst, i + os.path.splitext(f)[1].lower())
        with z.open(f) as a, open(out, 'wb') as b: shutil.copyfileobj(a, b)
        e = {k: m[k] for k in ('role', 'cut', 'credit', 'license', 'gen', 'w', 'h') if k in m}; e['src'] = os.path.relpath(out, ROOT).replace(os.sep, '/'); e['from'] = os.path.basename(zp)
        if m.get('desc'): e['desc'] = m['desc']
        r[i] = e; n += 1
    json.dump(r, open(REG, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for extra in [x for x in z.namelist() if x.endswith('.md') and '/' not in x and x != 'CATALOG.md']:
        os.makedirs(os.path.join(ROOT, 'research'), exist_ok=True); open(os.path.join(ROOT, 'research', extra), 'wb').write(z.read(extra)); print('research file →', 'research/' + extra)
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'pp_img.py'), 'sync'], check=True)
    cat = z.read('CATALOG.md').decode('utf-8'); os.makedirs(os.path.join(ROOT, 'research'), exist_ok=True)
    open(os.path.join(ROOT, 'research', f"{P.get('slug', 'pack')}_catalog.md"), 'w', encoding='utf-8').write(cat)
    print(f'imported {n} images from {zp}'); print(cat)

AUD = ('.mp3', '.wav', '.ogg', '.flac', '.m4a', '.json')
def music_export():
    d = os.path.join(ROOT, 'music'); zp = os.path.join(ROOT, 'packs', 'music_library.zip'); os.makedirs(os.path.dirname(zp), exist_ok=True)
    if not os.path.exists(os.path.join(d, 'library.json')): sys.exit('no music/library.json — build the library with pp_music.py add first')
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_STORED) as z:
        for base, _, fs in os.walk(d):
            for f in fs:
                if f.lower().endswith(AUD): full = os.path.join(base, f); z.write(full, os.path.relpath(full, ROOT).replace(os.sep, '/'))
    print(f'music library → {zp} ({os.path.getsize(zp) / 1e6:.1f} MB)')
def music_import(zp):
    z = zipfile.ZipFile(zp); old = {}; lj = os.path.join(ROOT, 'music', 'library.json')
    if os.path.exists(lj): old = json.load(open(lj, encoding='utf-8'))
    n = 0
    for f in z.namelist():
        if not f.startswith('music/') or '..' in f or not f.lower().endswith(AUD) or f == 'music/library.json': continue
        out = os.path.join(ROOT, f); os.makedirs(os.path.dirname(out), exist_ok=True)
        with z.open(f) as a, open(out, 'wb') as b: shutil.copyfileobj(a, b)
        n += 1
    new = json.loads(z.read('music/library.json').decode('utf-8')); old.update(new); os.makedirs(os.path.dirname(lj), exist_ok=True)
    json.dump(old, open(lj, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(f'music: {n} files, {len(new)} tracks merged → music/library.json')

if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k: a[a.index('--' + k) + 1] if '--' + k in a else None
    if not a: print(__doc__)
    elif a[0] == 'export': export(a[1], opt('ids').split(',') if opt('ids') else None, opt('prefix'), opt('desc'), opt('research'))
    elif a[0] == 'import': imp(a[1])
    elif a[0] == 'music-export': music_export()
    elif a[0] == 'music-import': music_import(a[1])
    elif a[0] == 'list': z, P = read_pack(a[1]); print(z.read('CATALOG.md').decode('utf-8'))
    else: print(__doc__)
