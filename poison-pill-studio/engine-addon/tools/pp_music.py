#!/usr/bin/env python3
"""pp_music — the Poison Pill music library: real, royalty-free tracks, analysed once, then cut to the edit automatically.

  python3 tools/pp_music.py add <file|url> <id> --mood tension[,dark] --credit "Artist – Title" --license "Pixabay License"
  python3 tools/pp_music.py list                 # every track: moods, bpm, length, intro, licence
  python3 tools/pp_music.py moods                # which moods are covered and how many tracks each (≥ 3 per mood is healthy)
  python3 tools/pp_music.py credits <story>      # credit lines for the tracks a finished episode used (from out/<slug>_music_used.json)

MOODS (one track can carry several): curious · rise · tension · dark · sad · reflective · epic · comedy · archive · tech
How the act of each beat picks the mood (sound_design.py does it automatically for `channel: poisonpill`):
  setup→curious  rise→rise  doubt→tension  fall→dark  after→sad  lesson→reflective  flash→archive   (header `score:` overrides)
What happens at mix time: each act-run of ≥ 18 s gets one track; the track enters on a bar line at the cut, loops on bar
lines if the act is longer, crossfades into the next mood over one bar, drops out before every [BEAT] and every reveal,
ducks 6–12 dB under the voice, and ends with the last line. No library track for a mood → the procedural score fills in.

Where to get tracks (YouTube-monetisation-safe; keep the licence text): YouTube Audio Library (no attribution or as stated),
Pixabay Music (Pixabay Content License), Uppbeat free tier (credit line), Incompetech / Kevin MacLeod (CC BY 4.0, credit),
Free Music Archive tracks marked CC BY (never NC/ND). Prefer instrumental, cinematic/documentary, 70–130 bpm, ≥ 2 min.
"""
import sys, os, json, re, subprocess, hashlib
import numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); LIBD = os.path.join(ROOT, 'music'); LIB = os.path.join(LIBD, 'library.json'); SR = 44100
MOODS = ['curious', 'rise', 'tension', 'dark', 'sad', 'reflective', 'epic', 'comedy', 'archive', 'tech']
def load(): return json.load(open(LIB, encoding='utf-8')) if os.path.exists(LIB) else {}
def save(L): os.makedirs(LIBD, exist_ok=True); json.dump(L, open(LIB, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

def read_mono(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '22050', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32), 22050

def analyse(path):
    """tempo (autocorrelation of a spectral-flux onset envelope), beat phase, bar grid, energy per bar, intro end, peak."""
    x, sr = read_mono(path); hop = 512; n = 2048; win = np.hanning(n).astype(np.float32)
    frames = max(1, (len(x) - n) // hop); S = np.abs(np.fft.rfft(np.stack([x[i * hop:i * hop + n] * win for i in range(frames)]), axis=1))
    flux = np.maximum(0, np.diff(np.log1p(S), axis=0)).sum(1); flux = np.concatenate([[0], flux]); flux -= np.convolve(flux, np.ones(16) / 16, 'same'); flux = np.maximum(flux, 0)
    fps = sr / hop; ac = np.correlate(flux, flux, 'full')[len(flux) - 1:]; lo, hi = int(fps * 60 / 180), int(fps * 60 / 60)
    w = np.arange(lo, hi); prior = np.exp(-.5 * (np.log2((60 * fps / w) / 110) / .9) ** 2); lag = w[np.argmax(ac[lo:hi] * prior)]; bpm = 60 * fps / lag
    phase = max(range(int(lag)), key=lambda p: flux[p::int(round(lag))].sum()) if lag >= 1 else 0
    beat0 = phase / fps; spb = 60 / bpm; bar = spb * 4; dur = len(x) / sr
    nb = int((dur - beat0) // bar); en = []
    for b in range(nb):
        a, e = int((beat0 + b * bar) * sr), int((beat0 + (b + 1) * bar) * sr); seg = x[a:e]
        en.append(round(float(10 * np.log10(np.mean(seg ** 2) + 1e-10)), 1))
    med = float(np.median(en)) if en else -30; intro = next((i for i, v in enumerate(en) if v > med - 3), 0)
    k = min(8, max(1, nb)); roll = [np.mean(en[i:i + k]) for i in range(max(1, nb - k + 1))]; peak = int(np.argmax(roll)) if en else 0
    return {'bpm': round(bpm, 1), 'beat0': round(beat0, 3), 'bar': round(bar, 3), 'dur': round(dur, 2), 'bars': nb, 'energy': en, 'intro_bar': intro, 'peak_bar': peak}

def add(src, id_, moods, credit='', lic=''):
    if not re.match(r'^[a-z0-9_]+$', id_): sys.exit('bad id: lowercase, digits, underscores')
    ms = [m.strip() for m in moods.split(',') if m.strip()]; bad = [m for m in ms if m not in MOODS]
    if bad: sys.exit(f'unknown mood {bad} — use: {" ".join(MOODS)}')
    os.makedirs(LIBD, exist_ok=True); dst = os.path.join(LIBD, id_ + '.wav')
    if re.match(r'^https?://', src): tmp = dst + '.dl'; subprocess.run(['curl', '-sSL', '-o', tmp, src], check=True); src = tmp
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '2', '-ar', str(SR), dst], check=True)
    a = analyse(dst); L = load(); L[id_] = {'file': os.path.relpath(dst, ROOT), 'moods': ms, 'credit': credit, 'license': lic, **a}; save(L)
    print(f"{id_}: {', '.join(ms)} · {a['bpm']} bpm · {a['dur']:.0f} s · {a['bars']} bars · intro {a['intro_bar']} · peak bar {a['peak_bar']}")

# ---------------------------------------------------------------- used by sound_design.py
ACT_MOOD = {'setup': 'curious', 'rise': 'rise', 'doubt': 'tension', 'fall': 'dark', 'after': 'sad', 'lesson': 'reflective', 'flash': 'archive', 'thumb': 'curious'}
FALLBACK = {'curious': 'wonder', 'rise': 'upbeat', 'tension': 'tension', 'dark': 'mystery', 'sad': 'emotional', 'reflective': 'emotional', 'epic': 'epic', 'comedy': 'sneaky', 'archive': 'chill', 'tech': 'night'}
def pick(mood, used, seed):
    L = load(); c = [k for k, v in L.items() if mood in v.get('moods', [])]
    if not c: return None
    c.sort(key=lambda k: (used.count(k), hashlib.md5((seed + k).encode()).hexdigest())); return c[0]
def read_track(tid):
    v = load()[tid]; raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(ROOT, v['file']), '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).reshape(-1, 2).T.copy(); return x, v
def arrange(tid, t0, t1, n, first=False, xf=1.4):
    """place track `tid` so a bar line lands on t0 (the cut) and it plays to t1 (+ the crossfade tail); when the act is
    longer than the track it loops back on a bar line with a half-bar crossfade. Returns a (2, n) buffer."""
    x, v = read_track(tid); bar, b0 = v['bar'], v['beat0']; tdur = x.shape[1] / SR; out = np.zeros((2, n), np.float32)
    start_bar = 0 if first else v.get('intro_bar', 0); loop_s = b0 + (max(1, v.get('intro_bar', 0)) if v['bars'] > 8 else 0) * bar
    pre = xf / 2 + (bar if not first else 0); T, T_end = t0 - pre, t1 + xf; s0 = b0 + start_bar * bar - pre; f = bar * .5; seam = False
    while T < T_end - .05:
        limit = tdur - bar; length = min(T_end - T, max(bar, np.floor(max(0., limit - s0) / bar) * bar if s0 < limit else bar))
        o, a = int(round(T * SR)), int(round(s0 * SR)); k = int(round(length * SR)); c = np.zeros((2, k), np.float32)
        lo = max(0, -a); hi = min(k, x.shape[1] - a)
        if hi > lo: c[:, lo:hi] = x[:, a + lo:a + hi]
        fk = min(int(f * SR), k // 2)
        if seam and fk: c[:, :fk] *= np.linspace(0, 1, fk)[None, :]
        if T + length < T_end - .05 and fk: c[:, -fk:] *= np.linspace(1, 0, fk)[None, :]
        i0, j0 = max(0, o), min(n, o + k)
        if j0 > i0: out[:, i0:j0] += c[:, i0 - o:j0 - o]
        T += length - (f if T + length < T_end - .05 else 0); s0 = loop_s; seam = True
    return out

if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k, d='': a[a.index('--' + k) + 1] if '--' + k in a else d
    if not a: print(__doc__)
    elif a[0] == 'add': add(a[1], a[2], opt('mood', 'tension'), opt('credit'), opt('license'))
    elif a[0] == 'list': [print(f"{k:28} {','.join(v['moods']):22} {v['bpm']:6} bpm {v['dur']:6.0f} s  intro {v['intro_bar']:2}  {v.get('license', '')}") for k, v in load().items()]
    elif a[0] == 'moods': L = load(); [print(f"{m:11} {sum(m in v['moods'] for v in L.values())} tracks") for m in MOODS]
    elif a[0] == 'credits':
        slug = os.path.basename(a[1]).rsplit('.', 1)[0]; p = os.path.join(ROOT, 'out', slug + '_music_used.json'); L = load()
        for t in (json.load(open(p)) if os.path.exists(p) else []): v = L.get(t, {}); print(f"Music: {v.get('credit', t)} — {v.get('license', '')}")
    else: print(__doc__)
