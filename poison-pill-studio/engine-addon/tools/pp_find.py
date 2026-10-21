#!/usr/bin/env python3
"""pp_find — find REAL, reusable images automatically (Openverse + Wikimedia Commons + Wikipedia lead images), score them,
download the best, import them with their licence and credit. If nothing usable exists, it says so — and only then may a
generated image fill the gap (ai-images.md).

  python3 tools/pp_find.py search "<query>" [--kind person|place|company|product|object|document|event] [--n 8]
          → ranked candidates with licence, size and source page (nothing downloaded)
  python3 tools/pp_find.py get "<query>" <id> [--kind …] [--role cut|plate|prop] [--pick 1]
          → downloads the best (or the --pick-th) candidate and runs pp_img.py add with the right credit + licence
  python3 tools/pp_find.py assets <EPISODE package .md> [--dry]
          → reads §2 ASSETS (id · role · what it must show · search hint) and runs `get` for every real-image row;
            writes research/<slug>_assets_found.md (what was found, licence, source, and the rows that still need a human
            or a generated fill)

Licences accepted (commercial use allowed): CC0, Public Domain / PDM, CC BY, CC BY-SA (share-alike: keep the credit; the
episode is not a derivative "adaptation" of the photo in the licence sense when shown as a quotation, but credit it).
Never accepted: NC, ND, "all rights reserved", unknown. Logos/trademarks: only to identify the company (editorial).
"""
import sys, os, json, re, subprocess, urllib.parse, urllib.request, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); UA = {'User-Agent': f"PoisonPillStudio/6 (YouTube documentary research; {os.environ.get('PP_CONTACT', 'set PP_CONTACT=your@email')}) python-urllib"}   # Wikimedia requires a contact UA
OK_LIC = re.compile(r'^(cc0|pdm|public domain|cc[- ]by(?![- ]n[cd])(?:[- ]sa)?)', re.I)
def get_json(url, timeout=25):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r: return json.loads(r.read().decode('utf-8', 'replace'))
def strip(s): return html.unescape(re.sub(r'<[^>]+>', '', s or '')).strip()

def openverse(q, n=20):
    url = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': q, 'license_type': 'commercial,modification', 'page_size': n, 'mature': 'false'})
    try: R = get_json(url).get('results', [])
    except Exception as e: print('  openverse:', e); return []
    out = []
    for r in R:
        lic = f"{r.get('license', '')} {r.get('license_version', '')}".strip(); lic = 'CC0' if lic.lower().startswith('cc0') else ('PDM' if lic.lower().startswith('pdm') else 'CC ' + lic.upper())
        out.append({'src': 'openverse', 'url': r.get('url'), 'w': r.get('width') or 0, 'h': r.get('height') or 0, 'title': r.get('title') or '', 'license': lic,
                    'credit': (r.get('attribution') or f"{r.get('creator') or 'Unknown'} / {r.get('source', '')} ({lic})")[:240], 'page': r.get('foreign_landing_url') or '', 'tags': ' '.join(t.get('name', '') for t in (r.get('tags') or []))})
    return out

def commons(q, n=20):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({'action': 'query', 'generator': 'search', 'gsrsearch': q + ' filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': n,
          'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': 1920, 'format': 'json'})
    try: P = (get_json(url).get('query') or {}).get('pages') or {}
    except Exception as e: print('  commons:', e); return []
    out = []
    for pg in sorted(P.values(), key=lambda x: x.get('index', 99)):
        ii = (pg.get('imageinfo') or [{}])[0]; md = ii.get('extmetadata') or {}; lic = strip((md.get('LicenseShortName') or {}).get('value'))
        if strip((md.get('NonFree') or {}).get('value')).lower() == 'true': continue   # fair-use file: legal only on Wikipedia
        out.append({'src': 'commons', 'url': ii.get('thumburl') or ii.get('url'), 'w': ii.get('width') or 0, 'h': ii.get('height') or 0, 'title': strip(pg.get('title', '')).replace('File:', ''),
                    'license': lic, 'credit': f"{strip((md.get('Artist') or {}).get('value')) or 'Unknown'} / Wikimedia Commons ({lic})", 'page': ii.get('descriptionurl', ''), 'tags': strip((md.get('ImageDescription') or {}).get('value'))[:300]})
    return out

def wiki_lead(q):
    """the lead image of the best-matching English Wikipedia article (great for people, companies, places) + its Commons licence"""
    try:
        s = get_json('https://en.wikipedia.org/w/api.php?' + urllib.parse.urlencode({'action': 'query', 'list': 'search', 'srsearch': q, 'srlimit': 1, 'format': 'json'}))['query']['search']
        if not s: return []
        title = s[0]['title']; pi = get_json('https://en.wikipedia.org/w/api.php?' + urllib.parse.urlencode({'action': 'query', 'titles': title, 'prop': 'pageimages', 'piprop': 'name|original', 'format': 'json'}))
        pg = list(pi['query']['pages'].values())[0]; name = pg.get('pageimage')
        if not name: return []
        c = commons_file(name); return [dict(c, title=f'{title} (Wikipedia lead image)', tags=title)] if c else []
    except Exception as e: print('  wikipedia:', e); return []
def wikidata(q, kind):
    """the entity's own image from Wikidata: P18 (portrait / building / product), for a company also its HQ's P18 (P159)"""
    try:
        E = get_json('https://www.wikidata.org/w/api.php?' + urllib.parse.urlencode({'action': 'wbsearchentities', 'search': q, 'language': 'en', 'limit': 1, 'format': 'json'})).get('search') or []
        if not E: return []
        qid = E[0]['id']; out = []
        def p18(ent):
            c = get_json('https://www.wikidata.org/w/api.php?' + urllib.parse.urlencode({'action': 'wbgetclaims', 'entity': ent, 'property': 'P18', 'format': 'json'})).get('claims', {}).get('P18') or []
            return [x['mainsnak']['datavalue']['value'] for x in c if 'datavalue' in x['mainsnak']]
        for f in p18(qid)[:2]:
            c = commons_file(f)
            if c: out.append(dict(c, title=f'{q} (Wikidata image)', tags=q, src='wikidata'))
        if kind == 'company':
            hq = get_json('https://www.wikidata.org/w/api.php?' + urllib.parse.urlencode({'action': 'wbgetclaims', 'entity': qid, 'property': 'P159', 'format': 'json'})).get('claims', {}).get('P159') or []
            for h in hq[:1]:
                hid = h['mainsnak'].get('datavalue', {}).get('value', {}).get('id')
                for f in (p18(hid) if hid else [])[:1]:
                    c = commons_file(f)
                    if c: out.append(dict(c, title=f'{q} headquarters (Wikidata)', tags=q + ' headquarters building', src='wikidata'))
        return out
    except Exception as e: print('  wikidata:', e); return []
def commons_file(name):
    P = get_json('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({'action': 'query', 'titles': 'File:' + name, 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': 1920, 'format': 'json'}))
    for pg in (P.get('query') or {}).get('pages', {}).values():
        ii = (pg.get('imageinfo') or [{}])[0]; md = ii.get('extmetadata') or {}; lic = strip((md.get('LicenseShortName') or {}).get('value'))
        if strip((md.get('NonFree') or {}).get('value')).lower() == 'true': return None
        if ii: return {'restrict': strip((md.get('Restrictions') or {}).get('value')), 'src': 'wikipedia', 'url': ii.get('thumburl') or ii.get('url'), 'w': ii.get('width') or 0, 'h': ii.get('height') or 0, 'license': lic, 'credit': f"{strip((md.get('Artist') or {}).get('value')) or 'Unknown'} / Wikimedia Commons ({lic})", 'page': ii.get('descriptionurl', '')}
    return None   # non-free (fair-use) Wikipedia images live on en.wikipedia, not Commons → not returned, by design

def score(c, q, kind):
    if not c.get('url') or not OK_LIC.match((c.get('license') or '').strip()): return -1
    w, h = c['w'] or 1, c['h'] or 1; s = min(1, (w * h) / (1600 * 900)) * 40                     # resolution
    ar = w / h; s += 15 if (kind in ('place', 'event', 'object', 'company') and ar > 1.2) or (kind == 'person' and .6 < ar < 1.1) else 5
    words = [x for x in re.findall(r'\w+', q.lower()) if len(x) > 2]; hay = (c.get('title', '') + ' ' + c.get('tags', '')).lower(); s += 30 * sum(x in hay for x in words) / max(1, len(words))
    s += {'wikidata': 18, 'wikipedia': 15, 'commons': 6, 'openverse': 4}.get(c['src'], 0)
    if 'personality' in (c.get('restrict') or '') and kind != 'person': s -= 5
    if re.search(r'\b(logo|icon|svg|map of|diagram|signature)\b', hay) and kind not in ('company', 'document'): s -= 20
    return round(s, 1)

def search(q, kind='object', n=8):
    C = (wikidata(q, kind) + wiki_lead(q) if kind in ('person', 'company', 'place', 'product', 'event') else []) + commons(q) + openverse(q)
    seen, out = set(), []
    for c in C:
        k = (c.get('url') or '').split('?')[0]
        if k in seen: continue
        seen.add(k); c['score'] = score(c, q, kind)
        if c['score'] >= 0: out.append(c)
    return sorted(out, key=lambda c: -c['score'])[:n]

def get(q, id_, kind='object', role='cut', pick=1):
    R = search(q, kind, 12)
    if len(R) < pick: print(f'{id_}: NOTHING usable for "{q}" — rephrase, try a related subject, or (only if allowed) generate it'); return None
    c = R[pick - 1]; os.makedirs(os.path.join(ROOT, 'research', 'dl'), exist_ok=True); ext = os.path.splitext(urllib.parse.urlparse(c['url']).path)[1][:5] or '.jpg'
    dst = os.path.join(ROOT, 'research', 'dl', id_ + ext); req = urllib.request.Request(c['url'], headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r, open(dst, 'wb') as f: f.write(r.read())
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'pp_img.py'), 'add', dst, id_, '--role', role, '--credit', c['credit'][:200], '--license', c['license']], check=True)
    print(f"{id_}: {c['title'][:60]} · {c['w']}×{c['h']} · {c['license']} · score {c['score']} · {c['page']}"); return c

def assets(pkg, dry=False):
    t = open(pkg, encoding='utf-8').read(); sec = re.search(r'##\s*2\.?\s*ASSETS([\s\S]*?)(?:\n##\s*3|\Z)', t); rows = []
    for ln in (sec.group(1) if sec else '').splitlines():
        cells = [x.strip().strip('`') for x in ln.strip().strip('|').split('|')]
        if len(cells) >= 4 and re.match(r'^[a-z0-9_]+$', cells[0]) and cells[1] in ('cut', 'plate', 'prop', 'screenshot'): rows.append(cells)
    slug = re.sub(r'^EPISODE_\d+_', '', os.path.basename(pkg)).replace('.md', ''); rep = [f'# assets found for {slug}\n', '| id | role | found | licence | source |', '|---|---|---|---|---|']
    for c in rows:
        id_, role, what, hint = c[0], c[1], c[2], c[3]; q = re.sub(r'["“”]', '', hint.split(' Wikimedia')[0]) or what
        kind = 'person' if re.search(r'portrait|waist-up|headshot|face', what, re.I) else 'document' if role in ('prop', 'screenshot') else 'place' if role == 'plate' else 'object'
        if role == 'screenshot': rep.append(f'| {id_} | {role} | NEEDS A SCREENSHOT (browser capture) | — | {what[:60]} |'); continue
        if dry: R = search(q, kind, 3); rep.append(f"| {id_} | {role} | {('candidate: ' + R[0]['title'][:50]) if R else 'NOTHING'} | {R[0]['license'] if R else '—'} | {R[0]['page'] if R else '—'} |"); continue
        try: r = get(q, id_, kind, 'cut' if role == 'cut' else 'plate' if role == 'plate' else 'prop')
        except Exception as e: r = None; print(id_, 'failed:', e)
        rep.append(f"| {id_} | {role} | {(r['title'][:50]) if r else 'NOTHING — generate only if the role allows (ai-images.md), else find by hand'} | {r['license'] if r else '—'} | {r['page'] if r else '—'} |")
    out = os.path.join(ROOT, 'research', f'{slug}_assets_found.md'); os.makedirs(os.path.dirname(out), exist_ok=True); open(out, 'w').write('\n'.join(rep) + '\n'); print('→', out)

if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k, d=None: a[a.index('--' + k) + 1] if '--' + k in a else d
    if not a: print(__doc__)
    elif a[0] == 'search': [print(f"{c['score']:5}  {c['src']:9} {c['w']}×{c['h']:<5} {c['license']:14} {c['title'][:60]}\n        {c['page']}") for c in search(a[1], opt('kind', 'object'), int(opt('n', 8)))]
    elif a[0] == 'get': get(a[1], a[2], opt('kind', 'object'), opt('role', 'cut'), int(opt('pick', 1)))
    elif a[0] == 'assets': assets(a[1], '--dry' in a)
    else: print(__doc__)
