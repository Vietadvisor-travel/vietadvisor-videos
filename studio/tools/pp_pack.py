#!/usr/bin/env python3
"""pp_pack — move a finished image set from one machine to another (Muse finds the images, Claude builds the film).

  python3 tools/pp_pack.py export <slug> [--ids a,b,c | --prefix nokia_] [--desc research/<slug>_desc.json] [--research RESEARCH_<slug>.md]
        → packs/<slug>_assets.zip : every image already imported with pp_img.py / pp_find.py (cut-outs stay cut out),
          pack.json (id → role, credit, licence, AI flag, what it shows) and CATALOG.md (the list the director writes against).
          Default selection: every id that starts with "<slug>_". --desc: {"id": "what it shows", …} for the catalogue.
  python3 tools/pp_pack.py import packs/<slug>_assets.zip
        → images copied into engine/library/img, registry merged (credits and AI flags kept), images.js rebuilt.
          Prints CATALOG.md. Ids already present are replaced by the pack's version.
  python3 tools/pp_pack.py clips-export <slug> <folder of trimmed mp4> <clips.json>   (v6.2 stock footage, Muse)
        → packs/<slug>_clips_1.zip, _2.zip … (≤ 88 MB each). Claude imports them together with the assets pack:
  python3 tools/pp_pack.py import ../jobs/<slug>/<slug>_assets.zip ../jobs/<slug>/<slug>_clips_*.zip
  python3 tools/pp_pack.py import drive:<slug>/<slug>_assets.zip "drive:<slug>/<slug>_clips_*.zip"   (v6.4: read from Google Drive, pp_drive.py)
  python3 tools/pp_pack.py clips-export <slug> <folder> <clips.json> --max-mb 1900   (v6.4: bigger parts for Drive)
  python3 tools/pp_pack.py list packs/<slug>_assets.zip
  python3 tools/pp_pack.py music-export          → packs/music_library_1.zip, _2.zip … (MP3 128 kb/s, each ≤ 90 MB)
  python3 tools/pp_pack.py music-import <zip> [<zip> …]   → music/ merged (tracks added, library.json entries merged)
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
    if str(zp).startswith('drive:'): sys.path.insert(0, os.path.join(ROOT, 'tools')); import pp_drive; z = pp_drive.open_zip(zp)   # v6.4: big packs live on Drive
    else: z = zipfile.ZipFile(zp)
    if 'pack.json' in z.namelist(): return z, json.loads(z.read('pack.json').decode('utf-8'))
    # Muse v6.6 layout: no pack.json; images under photos/ docs/ ai/ described by jobs/<slug>/desc.json (or desc.json in the zip),
    # clips under clips/ described by clips.json in the zip
    slug = re.sub(r'_(assets|clips)(_\d+)?\.zip$', '', os.path.basename(str(zp))); P = {'slug': slug, 'images': {}, 'clips': {}}
    dj = os.path.join(ROOT, '..', 'jobs', slug, 'desc.json')
    desc = json.loads(z.read('desc.json').decode('utf-8')) if 'desc.json' in z.namelist() else json.load(open(dj, encoding='utf-8')) if os.path.exists(dj) and any(x.lower().endswith(EXT) for x in z.namelist()) else []
    for m in desc:
        e = {k: m[k] for k in ('file', 'role', 'credit', 'license', 'gen', 'desc', 'w', 'h') if k in m}
        if m.get('kind') == 'el' and m.get('role') == 'cut': e['cut'] = 'solid'   # Muse cut-outs have solid backgrounds, not alpha
        P['images'][m['id'].replace('-', '_')] = e
    if 'clips.json' in z.namelist():
        for m in json.loads(z.read('clips.json').decode('utf-8')):
            P['clips'][m['id']] = {'file': m['file'], 'dur': m.get('duration', 6), 'width': min(1600, int(m.get('width', 1280))), 'author': m.get('author'), 'source': m.get('source'), 'license': m.get('license', ''), 'source_url': m.get('source_url', ''), 'desc': m.get('desc', '')}
    if not P['images'] and not P['clips']: raise SystemExit(f'{zp}: no pack.json, no clips.json, and no desc.json for slug {slug}')
    return z, P

def imp(zp):
    z, P = read_pack(zp); P.setdefault('images', {}); r = load(); dst = os.path.join(LIB, 'img'); os.makedirs(dst, exist_ok=True); n = 0
    for i, m in P['images'].items():
        f = m.get('file', '')
        if not ID.match(i) or not f.startswith(('img/', 'photos/', 'docs/', 'ai/')) or '..' in f or not f.lower().endswith(EXT) or f not in z.namelist(): print('rejected entry:', i); continue
        out = os.path.join(dst, i + os.path.splitext(f)[1].lower())
        with z.open(f) as a, open(out, 'wb') as b: shutil.copyfileobj(a, b)
        e = {k: m[k] for k in ('role', 'cut', 'credit', 'license', 'gen', 'w', 'h') if k in m}; e['src'] = os.path.relpath(out, ROOT).replace(os.sep, '/'); e['from'] = os.path.basename(zp)
        if m.get('desc'): e['desc'] = m['desc']
        r[i] = e; n += 1
    json.dump(r, open(REG, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    # v6.2 stock footage: pack.json "clips": {id: {file: "clips/<id>.mp4", start, dur, credit, license, author, source_url, desc}}
    clips = P.get('clips', {}); nc = 0
    if clips:
        sys.path.insert(0, os.path.join(ROOT, 'tools')); import pp_clip; tmpd = os.path.join(ROOT, 'out', '_packclips'); os.makedirs(tmpd, exist_ok=True)
        for i, m in clips.items():
            f = m.get('file', ''); i = i.replace('-', '_')   # Muse may slug ids with hyphens (nike-vs-adidas_clip_…)
            if not ID.match(i) or '..' in f or not f.lower().endswith(('.mp4', '.mov', '.webm', '.m4v')) or f not in z.namelist(): print('rejected clip:', i); continue
            src = os.path.join(tmpd, os.path.basename(f))
            with z.open(f) as a, open(src, 'wb') as b: shutil.copyfileobj(a, b)
            cr = m.get('credit') or ' · '.join(x for x in (m.get('author'), m.get('source')) if x)
            try: pp_clip.add(src, i, start=float(m.get('start', 0)), dur=float(m.get('dur', 6)), fps=int(m.get('fps', 24)), width=int(m.get('width', 1280)), credit=cr, lic=m.get('license', ''), desc=m.get('desc', ''), sync=False); nc += 1
            except subprocess.CalledProcessError: print(f'skipped clip {i}: ffmpeg cannot decode it (tell Muse to re-trim it)')
            os.remove(src)
        r = load()
    for extra in [x for x in z.namelist() if x.endswith('.md') and '/' not in x and x != 'CATALOG.md']:
        os.makedirs(os.path.join(ROOT, 'research'), exist_ok=True); open(os.path.join(ROOT, 'research', extra), 'wb').write(z.read(extra)); print('research file →', 'research/' + extra)
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'pp_img.py'), 'sync'], check=True)
    cat = z.read('CATALOG.md').decode('utf-8') if 'CATALOG.md' in z.namelist() else ''; os.makedirs(os.path.join(ROOT, 'research'), exist_ok=True)
    cf = os.path.join(ROOT, 'research', f"{P.get('slug', 'pack')}_catalog.md")
    if cat: open(cf, 'a' if os.path.basename(zp) != f"{P.get('slug', 'pack')}_assets.zip" and os.path.exists(cf) else 'w', encoding='utf-8').write(cat)
    print(f'imported {n} images and {nc} clips from {zp}'); print(cat)

def clips_export(slug, folder, meta_json, max_mb=88):
    """Muse: trimmed stock clips (MP4, H.264, no audio, 1280–1920 px, 2–8 s) + clips.json {id: {file, start, dur, desc, author, source, source_url, license}}
    → packs/<slug>_clips_1.zip, _2.zip … each ≤ max_mb, with pack.json {"slug", "clips": {…}} and CATALOG.md rows for the clips."""
    M = json.load(open(meta_json, encoding='utf-8')); os.makedirs(os.path.join(ROOT, 'packs'), exist_ok=True); parts, cur, size = [], {}, 0
    for i, m in M.items():
        f = os.path.join(folder, os.path.basename(m.get('file') or i + '.mp4'))
        if not ID.match(i) or not os.path.exists(f): print('skipped clip (bad id or missing file):', i); continue
        sz = os.path.getsize(f) / 1e6
        if cur and size + sz > max_mb: parts.append(cur); cur, size = {}, 0
        cur[i] = (f, m); size += sz
    if cur: parts.append(cur)
    for k, part in enumerate(parts, 1):
        zp = os.path.join(ROOT, 'packs', f'{slug}_clips_{k}.zip'); rows = [f'## Clips ({os.path.basename(zp)})', '', '| id | role | what it shows | licence / credit | AI |', '|---|---|---|---|---|']; meta = {}
        with zipfile.ZipFile(zp, 'w', zipfile.ZIP_STORED) as z:
            for i, (f, m) in part.items():
                arc = 'clips/' + i + os.path.splitext(f)[1].lower(); z.write(f, arc); meta[i] = {**m, 'file': arc}
                rows.append(f"| `{i}` | clip | {m.get('desc', '—')} ({m.get('dur', '?')} s) | {m.get('license', '')} · {m.get('author', '')} · {m.get('source', '')} |  |")
            z.writestr('pack.json', json.dumps({'slug': slug, 'clips': meta}, ensure_ascii=False, indent=1)); z.writestr('CATALOG.md', '\n'.join(rows) + '\n')
        print(f'{zp}: {len(part)} clips, {os.path.getsize(zp) / 1e6:.1f} MB')

AUD = ('.mp3', '.wav', '.ogg', '.flac', '.m4a', '.json')
def music_export(kbps=128, max_mb=90):
    """Tracks are transcoded to MP3 (WAV masters would be ~10x bigger; the score is mixed under the voice, 128 kb/s is
    transparent there) and split into parts of ≤ 90 MB each (GitHub refuses files over 100 MB)."""
    import tempfile
    d = os.path.join(ROOT, 'music'); lj = os.path.join(d, 'library.json'); os.makedirs(os.path.join(ROOT, 'packs'), exist_ok=True)
    if not os.path.exists(lj): sys.exit('no music/library.json — build the library with pp_music.py add first')
    L = json.load(open(lj, encoding='utf-8')); tmp = tempfile.mkdtemp(); items = []
    for tid, v in L.items():
        src = os.path.join(ROOT, v['file'])
        if not os.path.exists(src): print('missing, skipped:', tid); continue
        arc = 'music/' + tid + '.mp3'; out = os.path.join(tmp, tid + '.mp3')
        if src.lower().endswith('.mp3'): shutil.copy(src, out)
        else: subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-c:a', 'libmp3lame', '-b:a', f'{kbps}k', out], check=True)
        items.append((tid, arc, out, {**v, 'file': arc}))
    for f in os.listdir(os.path.join(ROOT, 'packs')):
        if f.startswith('music_library') and f.endswith('.zip'): os.remove(os.path.join(ROOT, 'packs', f))
    parts, cur, size = [], [], 0
    for it in items:
        sz = os.path.getsize(it[2])
        if cur and size + sz > max_mb * 1e6: parts.append(cur); cur, size = [], 0
        cur.append(it); size += sz
    if cur: parts.append(cur)
    for k, part in enumerate(parts, 1):
        zp = os.path.join(ROOT, 'packs', f'music_library_{k}.zip')
        with zipfile.ZipFile(zp, 'w', zipfile.ZIP_STORED) as z:
            for tid, arc, out, meta in part: z.write(out, arc)
            z.writestr('music/library.json', json.dumps({tid: meta for tid, arc, out, meta in part}, ensure_ascii=False, indent=1))
        print(f'  {zp}  {len(part)} tracks  {os.path.getsize(zp) / 1e6:.1f} MB')
    shutil.rmtree(tmp); print(f'music library: {len(items)} tracks in {len(parts)} part(s) → copy packs/music_library_*.zip to jobs/_music/')
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
    elif a[0] == 'clips-export': clips_export(a[1], a[2], a[3], float(opt('max-mb') or 88))   # --max-mb 1900 for packs that go to Drive
    elif a[0] == 'import':
        args = []
        for x in [x for x in a[1:] if not x.startswith('--')]:
            if x.startswith('drive:') and any(c in x for c in '*?['): sys.path.insert(0, os.path.join(ROOT, 'tools')); import pp_drive; args += ['drive:' + p for p in pp_drive.match(x)]
            else: args.append(x)
        [imp(x) for x in args]   # several parts: pp_pack.py import <slug>_assets.zip <slug>_clips_1.zip …
    elif a[0] == 'music-export': music_export()
    elif a[0] == 'music-import': [music_import(z) for z in a[1:]]
    elif a[0] == 'list': z, P = read_pack(a[1]); print(z.read('CATALOG.md').decode('utf-8'))
    else: print(__doc__)
