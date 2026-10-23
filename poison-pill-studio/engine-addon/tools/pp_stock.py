#!/usr/bin/env python3
"""pp_stock — the channel's SHARED stock-footage library (v6.2), next to each episode's own clips pack.

Muse builds the library once and grows it over time: jobs/_stock/stock_library_1.zip, _2.zip … (made with
`pp_pack.py clips-export stock <folder> <clips.json>`; ids start with `stock_`; every clip has desc, tags, author, licence).
The library can hold hundreds of clips, so nothing is extracted until a story uses it:

  python3 tools/pp_stock.py index                       → research/stock_catalog.md (+ stock_index.json): every clip with what it
                                                           shows, tags, length, licence, and the episodes that already used it
                                                           (setup.sh runs this; fast, nothing is extracted)
  python3 tools/pp_stock.py find <words…>               → the best-matching library clips for a beat ("aerial city night", "cash counting")
  python3 tools/pp_stock.py pull <slug> stories/<slug>-a*.story
                                                         → extracts ONLY the stock_* clips the stories use (24 fps, 1280 px, streamed),
                                                           and records them as used by <slug> in stock_used.json
Rules (CLAUDE.md): prefer the episode's own clips for named people, places and events; use the library for generic
action, mood and texture. Avoid a library clip used in the last 3 episodes unless it is the declared motif."""
import sys, os, re, json, zipfile, glob, shutil, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); REPO = os.path.dirname(ROOT)
LIBZ = os.path.join(REPO, 'jobs', '_stock'); IDX = os.path.join(ROOT, 'research', 'stock_index.json')
USED = os.path.join(ROOT, 'stock_used.json'); CAT = os.path.join(ROOT, 'research', 'stock_catalog.md')


def zips():
    return sorted(glob.glob(os.path.join(LIBZ, 'stock_library_*.zip')))


def used():
    return json.load(open(USED)) if os.path.exists(USED) else {}


def index(quiet=False):
    idx = {}
    for zp in zips():
        with zipfile.ZipFile(zp) as z:
            P = json.loads(z.read('pack.json').decode('utf-8'))
            for i, m in P.get('clips', {}).items():
                if m.get('file') in z.namelist():
                    idx[i] = {**m, 'zip': os.path.relpath(zp, REPO)}
    os.makedirs(os.path.dirname(IDX), exist_ok=True); json.dump(idx, open(IDX, 'w'), ensure_ascii=False, indent=1)
    U = used(); order = ['slug order'] + list(U.get('_order', []))
    rows = [f'# Shared stock library ({len(idx)} clips)', '',
            'Use as `bg=clip:<id>`, `mid="clip:<id>;…"`, `fg="clip:<id>;…"` or `clip(\'<id>\')` in a custom scene, then run',
            '`python3 tools/pp_stock.py pull <slug> stories/<slug>-a*.story` before lint/sheet/render.', '',
            '| id | what it shows | tags | s | licence · author | used in |', '|---|---|---|---|---|---|']
    for i, m in sorted(idx.items(), key=lambda kv: (','.join(kv[1].get('tags', [])) if isinstance(kv[1].get('tags'), list) else str(kv[1].get('tags', '')), kv[0])):
        tags = m.get('tags', ''); tags = ', '.join(tags) if isinstance(tags, list) else tags
        rows.append(f"| `{i}` | {m.get('desc', '—')} | {tags} | {m.get('dur', '?')} | {m.get('license', '')} · {m.get('author', '?')} | {', '.join(U.get(i, [])) or '—'} |")
    open(CAT, 'w', encoding='utf-8').write('\n'.join(rows) + '\n')
    if not quiet:
        print(f'{CAT}: {len(idx)} library clips from {len(zips())} zip(s)')
    return idx


def find(words):
    idx = json.load(open(IDX)) if os.path.exists(IDX) else index(True); U = used(); q = [w.lower() for w in words]
    sc = []
    for i, m in idx.items():
        hay = (i + ' ' + str(m.get('desc', '')) + ' ' + (' '.join(m['tags']) if isinstance(m.get('tags'), list) else str(m.get('tags', '')))).lower()
        s = sum(2 if re.search(r'\b' + re.escape(w) + r'\b', hay) else (1 if w in hay else 0) for w in q)
        if s: sc.append((s - .5 * len(U.get(i, [])), i, m))
    for s, i, m in sorted(sc, reverse=True)[:15]:
        print(f"{s:4.1f}  {i:40s} {m.get('dur', '?')}s  {m.get('desc', '')[:70]}  {'(used: ' + ', '.join(U.get(i, [])) + ')' if U.get(i) else ''}")


def pull(slug, stories):
    idx = json.load(open(IDX)) if os.path.exists(IDX) else index(True)
    txt = ''.join(open(s, encoding='utf-8').read() for s in stories)
    want = sorted(set(re.findall(r'\b(stock_[a-z0-9_]+?)(?:__\d+)?\b', txt)))
    reg = json.load(open(os.path.join(ROOT, 'engine', 'library', 'images.json')))
    sys.path.insert(0, os.path.join(ROOT, 'tools')); import pp_clip
    tmp = os.path.join(ROOT, 'out', '_stockpull'); os.makedirs(tmp, exist_ok=True); n = 0; missing = []
    for i in want:
        if i not in idx:
            missing.append(i); continue
        if i + '__000' in reg:
            continue
        m = idx[i]
        with zipfile.ZipFile(os.path.join(REPO, m['zip'])) as z:
            src = os.path.join(tmp, os.path.basename(m['file']))
            with z.open(m['file']) as a, open(src, 'wb') as b: shutil.copyfileobj(a, b)
        cr = m.get('credit') or ' · '.join(x for x in (m.get('author'), m.get('source')) if x)
        pp_clip.add(src, i, start=float(m.get('start', 0)), dur=float(m.get('dur', 6)), fps=int(m.get('fps', 24)), width=int(m.get('width', 1280)), credit=cr, lic=m.get('license', ''), desc=m.get('desc', ''), sync=False)
        os.remove(src); n += 1
    if n:
        subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'pp_img.py'), 'sync'], check=True)
    U = used(); U.setdefault('_order', [])
    if slug not in U['_order']: U['_order'].append(slug)
    for i in want:
        if i in idx and slug not in U.setdefault(i, []): U[i].append(slug)
    json.dump(U, open(USED, 'w'), ensure_ascii=False, indent=1)
    print(f'{len(want)} library clips used by {slug}: {n} extracted, {len(want) - n - len(missing)} already present' + (f'; NOT IN LIBRARY: {", ".join(missing)}' if missing else ''))
    recent = U['_order'][-4:-1]
    again = [i for i in want if any(s in recent for s in U.get(i, []) if s != slug)]
    if again: print('note: also used in the last 3 episodes (OK only for the declared motif):', ', '.join(again))


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a or a[0] not in ('index', 'find', 'pull'): print(__doc__); sys.exit(1)
    if a[0] == 'index': index()
    elif a[0] == 'find': find(a[1:])
    else: pull(a[1], a[2:])
