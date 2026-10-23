#!/usr/bin/env python3
"""pp_drive: big media (stock library, episode clips packs, music) lives on Google Drive, not in git (v6.4).

Drive layout (one folder shared "Anyone with the link: Viewer"):
  PoisonPill_Media/_stock/stock_library_1.zip, _2.zip …      the shared stock library (any size; ≤ 2 GB per zip is easiest)
  PoisonPill_Media/<slug>/<slug>_clips_1.zip, _2.zip …        an episode's own footage (and big <slug>_assets.zip if any)
  PoisonPill_Media/_music/music_library_*.zip                 optional
Zips are the same packs pp_pack.py clips-export / music-export make, so nothing changes for Muse except where they go.

Access: the Drive API (www.googleapis.com). Credentials in environment variables (never in git):
  GDRIVE_CLIENT_ID + GDRIVE_CLIENT_SECRET + GDRIVE_REFRESH_TOKEN   OAuth, scope drive.file: the folder stays private and
                                                                    the token sees only what these tools uploaded (Muse + Claude)
  or GDRIVE_API_KEY                                                 read-only, needs the folder shared "Anyone with the link"
The folder id lives in jobs/_drive.json (written by the first upload) or GDRIVE_FOLDER. Zips are read with HTTP range
requests, so a catalogue costs a few KB and a story pulls only the clips it uses, never the whole GB zip.

  python3 tools/pp_drive.py put <files…> --to _stock      → Muse: resumable upload (skips files already there, same md5)
  python3 tools/pp_drive.py share                         → optional: anyone with the link can view (API-key mode)

  python3 tools/pp_drive.py check                 → key + folder reachable? lists the top level
  python3 tools/pp_drive.py ls [sub/path]         → every file with size (writes research/drive_files.json)
  python3 tools/pp_drive.py get <path|glob> [--to dir]   → full download with resume + md5 check (rarely needed)
  python3 tools/pp_pack.py import drive:<slug>/<slug>_assets.zip "drive:<slug>/<slug>_clips_*.zip"   (remote import)
  python3 tools/pp_stock.py index                 → indexes local AND Drive stock zips (only pack.json is read)
  python3 tools/pp_stock.py pull <slug> stories/<slug>-a*.story   → extracts only the used clips, from Drive if needed
"""
import sys, os, re, json, io, fnmatch, hashlib, time, zipfile
import urllib.request, urllib.parse, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); REPO = os.path.dirname(ROOT)
API = os.environ.get('PP_DRIVE_API', 'https://www.googleapis.com/drive/v3'); UPLOAD = os.environ.get('PP_DRIVE_UPLOAD', 'https://www.googleapis.com/upload/drive/v3')
TOKEN_URL = os.environ.get('PP_DRIVE_TOKEN', 'https://oauth2.googleapis.com/token'); CFG = os.path.join(REPO, 'jobs', '_drive.json'); FILES = os.path.join(ROOT, 'research', 'drive_files.json')


_TOK = {'t': '', 'exp': 0}
def oauth():
    return all(os.environ.get(k) for k in ('GDRIVE_CLIENT_ID', 'GDRIVE_CLIENT_SECRET', 'GDRIVE_REFRESH_TOKEN'))


def auth():
    """(query params, headers) for a Drive call: OAuth bearer if the refresh-token trio is set, else the API key."""
    if oauth():
        if time.time() > _TOK['exp'] - 60:
            body = urllib.parse.urlencode({'client_id': os.environ['GDRIVE_CLIENT_ID'], 'client_secret': os.environ['GDRIVE_CLIENT_SECRET'],
                                           'refresh_token': os.environ['GDRIVE_REFRESH_TOKEN'], 'grant_type': 'refresh_token'}).encode()
            try: d = json.load(urllib.request.urlopen(urllib.request.Request(TOKEN_URL, body), timeout=30))
            except urllib.error.HTTPError as e: sys.exit(f'Drive login failed ({e.code}): refresh token expired or revoked? jobs/DRIVE_SETUP.md step 2\n' + e.read().decode()[:300])
            _TOK.update(t=d['access_token'], exp=time.time() + int(d.get('expires_in', 3600)))
        return {}, {'Authorization': 'Bearer ' + _TOK['t']}
    k = os.environ.get('GDRIVE_API_KEY', '').strip()
    if not k: sys.exit('no Drive credentials: set GDRIVE_CLIENT_ID + GDRIVE_CLIENT_SECRET + GDRIVE_REFRESH_TOKEN (or GDRIVE_API_KEY for public links) — jobs/DRIVE_SETUP.md')
    return {'key': k}, {}


def call(path, params=None, headers=None, method='GET', data=None, base=None):
    q, h = auth(); q = {**q, 'supportsAllDrives': 'true', **(params or {})}
    return _get(f'{base or API}/{path}?' + urllib.parse.urlencode(q), {**h, **(headers or {})}, method=method, data=data)


def folder(create=False):
    f = os.environ.get('GDRIVE_FOLDER', '').strip()
    if not f and os.path.exists(CFG): f = json.load(open(CFG)).get('folder', '')
    m = re.search(r'folders/([\w-]+)', f) or re.search(r'[?&]id=([\w-]+)', f)
    f = m.group(1) if m else f
    if not f and create:   # first upload (Muse): make PoisonPill_Media in the Drive root and record it for every later session
        f = mkdir('PoisonPill_Media', 'root'); json.dump({'folder': f, 'note': 'Google Drive folder for big media (pp_drive.py); written by the first upload'}, open(CFG, 'w'), indent=1)
        print(f'created Drive folder PoisonPill_Media ({f}) → jobs/_drive.json: commit and push it')
    if not f: sys.exit('no Drive folder yet: set GDRIVE_FOLDER, or let the first `pp_drive.py put` create it (jobs/DRIVE_SETUP.md)')
    return f


def configured():
    return (oauth() or bool(os.environ.get('GDRIVE_API_KEY'))) and bool(os.environ.get('GDRIVE_FOLDER') or os.path.exists(CFG))


def mkdir(name, parent):
    for f in children(parent):
        if f['name'] == name and f['mimeType'].endswith('folder'): return f['id']
    body = json.dumps({'name': name, 'mimeType': 'application/vnd.google-apps.folder', 'parents': [parent]}).encode()
    return json.load(call('files', {'fields': 'id'}, {'Content-Type': 'application/json'}, 'POST', body))['id']


def md5sum(p):
    h = hashlib.md5()
    with open(p, 'rb') as f:
        for c in iter(lambda: f.read(1 << 22), b''): h.update(c)
    return h.hexdigest()


def put(paths, dest):
    """Resumable upload of local files into <folder>/<dest>/; a file already there with the same md5 is skipped,
    one with the same name but other content is replaced (a new version keeps the same Drive id)."""
    if not oauth(): sys.exit('uploading needs the OAuth trio (GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN): jobs/DRIVE_SETUP.md')
    par = folder(create=True)
    for part in [x for x in dest.strip('/').split('/') if x]: par = mkdir(part, par)
    have = {f['name']: f for f in children(par)}
    for p in paths:
        name, size = os.path.basename(p), os.path.getsize(p); old = have.get(name)
        if old and old.get('md5Checksum') == md5sum(p): print('already on Drive:', dest + '/' + name); continue
        meta = json.dumps({'name': name} if old else {'name': name, 'parents': [par]}).encode()
        r = call(f"files/{old['id']}" if old else 'files', {'uploadType': 'resumable', 'fields': 'id'}, {'Content-Type': 'application/json; charset=UTF-8', 'X-Upload-Content-Length': str(size)},
                 'PATCH' if old else 'POST', meta, base=UPLOAD)
        loc, sent, CH = r.headers['Location'], 0, 64 << 20
        with open(p, 'rb') as f:
            while sent < size:
                f.seek(sent); c = f.read(CH); hdr = {'Content-Range': f'bytes {sent}-{sent + len(c) - 1}/{size}'}
                try:
                    resp = urllib.request.urlopen(urllib.request.Request(loc, c, {**auth()[1], **hdr}, method='PUT'), timeout=300); sent = size; resp.read()
                except urllib.error.HTTPError as e:
                    if e.code == 308:   # chunk accepted, continue from what the server holds
                        rg = e.headers.get('Range'); sent = int(rg.split('-')[1]) + 1 if rg else 0
                    elif e.code in (500, 502, 503, 504): time.sleep(3)
                    else: sys.exit(f'upload failed {e.code}: ' + e.read().decode()[:300])
                except (urllib.error.URLError, TimeoutError, ConnectionError):
                    time.sleep(3); q = urllib.request.Request(loc, b'', {**auth()[1], 'Content-Range': f'bytes */{size}'}, method='PUT')
                    try: urllib.request.urlopen(q, timeout=60); sent = size
                    except urllib.error.HTTPError as e2:
                        rg = e2.headers.get('Range'); sent = int(rg.split('-')[1]) + 1 if e2.code == 308 and rg else 0
                print(f'\r{dest}/{name}: {sent / 1e6:,.0f} / {size / 1e6:,.0f} MB', end='', flush=True)
        print(' ✓')
    if os.path.exists(FILES): os.remove(FILES)


def share():
    """Anyone with the link can view the folder (needed only when Claude reads with an API key instead of OAuth)."""
    body = json.dumps({'role': 'reader', 'type': 'anyone'}).encode()
    call(f'files/{folder()}/permissions', {}, {'Content-Type': 'application/json'}, 'POST', body).read(); print('shared: anyone with the link can view', folder())


def _get(url, headers=None, tries=5, method='GET', data=None):
    for t in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, data, headers or {}, method=method), timeout=60)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and t < tries - 1: time.sleep(2 ** t); continue
            body = e.read().decode('utf-8', 'replace')[:300]
            hint = {400: 'is the API key valid?', 403: 'Drive API enabled for the key, and the file shared "Anyone with the link"?',
                    404: 'is the folder/file shared "Anyone with the link"?'}.get(e.code, '')
            sys.exit(f'Drive API {e.code}: {hint}\n{body}')
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            if t < tries - 1: time.sleep(2 ** t); continue
            sys.exit(f'Drive API unreachable: {e}')


def children(fid):
    out, tok = [], None
    while True:
        q = {'q': f"'{fid}' in parents and trashed = false", 'fields': 'nextPageToken, files(id, name, mimeType, size, md5Checksum, modifiedTime)',
             'pageSize': 1000, 'includeItemsFromAllDrives': 'true'}
        if tok: q['pageToken'] = tok
        d = json.load(call('files', q))
        out += d.get('files', []); tok = d.get('nextPageToken')
        if not tok: return out


def walk(fid=None, prefix=''):
    """{relative/path: {id, size, md5, modified}} for every file under the folder."""
    res = {}
    for f in children(fid or folder()):
        p = prefix + f['name']
        if f['mimeType'] == 'application/vnd.google-apps.folder': res.update(walk(f['id'], p + '/'))
        else: res[p] = {'id': f['id'], 'size': int(f.get('size', 0)), 'md5': f.get('md5Checksum', ''), 'modified': f.get('modifiedTime', '')}
    return res


def files(refresh=False):
    if not refresh and os.path.exists(FILES) and time.time() - os.path.getmtime(FILES) < 600: return json.load(open(FILES))
    F = walk(); os.makedirs(os.path.dirname(FILES), exist_ok=True); json.dump(F, open(FILES, 'w'), indent=1); return F


def match(pattern, F=None):
    F = F or files(); pattern = pattern[6:] if pattern.startswith('drive:') else pattern
    return sorted(p for p in F if fnmatch.fnmatch(p, pattern))


class RemoteFile(io.RawIOBase):
    """A seekable read-only file over HTTP range requests, so zipfile can read a pack's directory and single members."""
    def __init__(self, fetch, size, name='', block=1 << 20):
        self.fetch, self.size, self.name, self.pos, self.block = fetch, size, name, 0, block; self.buf, self.bufat = b'', -1
    def readable(self): return True
    def seekable(self): return True
    def tell(self): return self.pos
    def seek(self, off, whence=0):
        self.pos = off if whence == 0 else self.pos + off if whence == 1 else self.size + off; return self.pos
    def read(self, n=-1):
        if n is None or n < 0: n = self.size - self.pos
        n = max(0, min(n, self.size - self.pos))
        if not n: return b''
        if self.bufat <= self.pos and self.pos + n <= self.bufat + len(self.buf):
            s = self.pos - self.bufat; self.pos += n; return self.buf[s:s + n]
        if n >= self.block:   # big reads (a whole clip) go straight through
            d = self.fetch(self.pos, self.pos + n - 1); self.pos += len(d); return d
        end = min(self.size, self.pos + self.block) - 1; self.buf, self.bufat = self.fetch(self.pos, end), self.pos
        return self.read(n)
    def readinto(self, b):
        d = self.read(len(b)); b[:len(d)] = d; return len(d)


def _fetch_id(fid):
    def fetch(a, b):
        return call(f'files/{fid}', {'alt': 'media'}, {'Range': f'bytes={a}-{b}'}).read()
    return fetch


def open_zip(path):
    """'drive:<path>' (or a plain Drive path) → zipfile.ZipFile reading over the network."""
    F = files(); p = path[6:] if path.startswith('drive:') else path
    if p not in F:
        F = files(True)
        if p not in F: sys.exit(f'not on Drive: {p} (python3 tools/pp_drive.py ls)')
    m = F[p]; return zipfile.ZipFile(io.BufferedReader(RemoteFile(_fetch_id(m['id']), m['size'], p), 1 << 20))


def get(pattern, to=None):
    F = files(True); out = []
    for p in match(pattern, F):
        m = F[p]; dst = os.path.join(to or os.path.join(ROOT, 'out', '_drive'), p); os.makedirs(os.path.dirname(dst), exist_ok=True)
        part = dst + '.part'; have = os.path.getsize(part) if os.path.exists(part) else 0
        if os.path.exists(dst) and os.path.getsize(dst) == m['size']: out.append(dst); print('have', dst); continue
        while have < m['size']:
            r = call(f"files/{m['id']}", {'alt': 'media'}, {'Range': f'bytes={have}-'})
            with open(part, 'ab') as w:
                while True:
                    c = r.read(1 << 22)
                    if not c: break
                    w.write(c); have += len(c); print(f'\r{p}: {have / 1e6:,.0f} / {m["size"] / 1e6:,.0f} MB', end='', flush=True)
        print()
        if m['md5']:
            h = hashlib.md5()
            with open(part, 'rb') as f:
                for c in iter(lambda: f.read(1 << 22), b''): h.update(c)
            if h.hexdigest() != m['md5']: os.remove(part); sys.exit(f'md5 mismatch on {p}: deleted, run again')
        os.replace(part, dst); out.append(dst)
    if not out: print('nothing on Drive matches', pattern)
    return out


if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k: a[a.index('--' + k) + 1] if '--' + k in a else None
    if not a or a[0] not in ('check', 'ls', 'get', 'put', 'share'): print(__doc__); sys.exit(1)
    if a[0] == 'put': put([x for x in a[1:] if not x.startswith('--') and x != opt('to')], opt('to') or ''); sys.exit()
    if a[0] == 'share': share(); sys.exit()
    if a[0] == 'check':
        top = children(folder()); print(f'Drive OK: folder {folder()} has {len(top)} items')
        for f in top: print('  ' + f['name'] + ('/' if f['mimeType'].endswith('folder') else f"  {int(f.get('size', 0)) / 1e6:,.0f} MB"))
    elif a[0] == 'ls':
        F = files(True); sub = a[1] if len(a) > 1 else ''
        rows = [(p, m) for p, m in sorted(F.items()) if p.startswith(sub)]
        for p, m in rows: print(f"{m['size'] / 1e6:10,.1f} MB  {p}")
        print(f'{len(rows)} files, {sum(m["size"] for _, m in rows) / 1e9:,.2f} GB')
    else: get(a[1], opt('to'))
