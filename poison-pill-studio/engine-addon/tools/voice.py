#!/usr/bin/env python3
"""Free English voice-over with Kokoro-82M (Apache-2.0, runs offline on CPU) — no API key, no cost.
  python3 tools/voice.py setup                                   # one-time: pip deps + model files (~120 MB) into ~/.cache/va-voice
  python3 tools/voice.py voices                                  # list voice ids
  python3 tools/voice.py synth out/x_lines.json out/vo [--voice am_michael] [--speed 1.0]
        → out/vo/vo_<k>.wav per spoken line + out/vo/durs.json (seconds, in line order) — cached by text+voice
  python3 tools/voice.py place out/x_cues.json out/vo out/x_vo.wav  # lay the lines on the timeline (44.1 kHz)
  python3 tools/voice.py say "Text to test" test.wav [--voice af_heart]
Vietnamese names are respelled for an English voice via tools/pron_vi.json (edit/extend freely)."""
import json, os, re, sys, hashlib, unicodedata, subprocess
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.expanduser(os.environ.get('VA_VOICE_DIR', '~/.cache/va-voice'))
MODEL, VOICES = os.path.join(CACHE, 'kokoro-v1.0.int8.onnx'), os.path.join(CACHE, 'voices-v1.0.bin')
URL = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
SR_OUT = 44100
DEFAULT_SPK = {'narrator': 'am_michael', 'a': 'am_echo', 'b': 'af_heart', 'c': 'bm_george', 'd': 'af_nicole'}

def setup():
    subprocess.call([sys.executable, '-m', 'pip', 'install', '-q', 'kokoro-onnx', 'soundfile', '--break-system-packages'])
    os.makedirs(CACHE, exist_ok=True)
    for f in ['kokoro-v1.0.int8.onnx', 'voices-v1.0.bin']:
        p = os.path.join(CACHE, f)
        if not os.path.exists(p) or os.path.getsize(p) < 1e6: subprocess.check_call(['curl', '-sSL', '-o', p, URL + f])
    print('voice ready:', CACHE)

_k = None
def kokoro():
    global _k
    if _k is None:
        if not os.path.exists(MODEL): setup()
        from kokoro_onnx import Kokoro
        _k = Kokoro(MODEL, VOICES)
    return _k

# ---------------------------------------------------------------- text normalisation for speech
PRON = json.load(open(os.path.join(HERE, 'pron_vi.json'), encoding='utf-8'))
_keys = sorted(PRON, key=len, reverse=True)
def strip_marks(s): return ''.join(c for c in unicodedata.normalize('NFD', s.replace('đ', 'd').replace('Đ', 'D')) if unicodedata.category(c) != 'Mn')
def num_words(m):
    n, unit = m.group(1), (m.group(2) or '').lower()
    return n + {'k': ' thousand', 'm': ' million', 'b': ' billion'}.get(unit, '')  # unit: k, M, B
def speakable(text):
    s = re.sub(r'[\*\[\]]', '', text)
    s = re.sub(r'[\U0001F300-\U0001FAFF☀-➿]', '', s)  # emoji
    for k in _keys:  # Vietnamese words → English respelling (case-insensitive, diacritics-exact first)
        s = re.sub(r'(?<![\w])' + re.escape(k) + r'(?![\w])', PRON[k], s, flags=re.I)
    s = re.sub(r'(\d)\.(\d{3})(?!\d)', r'\1,\2', s)              # 45.000 → 45,000
    s = re.sub(r'(\d)\.(\d{3})(?!\d)', r'\1,\2', s)
    s = re.sub(r'[~≈]\s*', 'about ', s)
    s = re.sub(r'(\d)\s*[–-]\s*(\$?\d)', r'\1 to \2', s)          # 3–4 → 3 to 4
    s = re.sub(r'\$\s*([\d.,]+)\s+to\s+\$?([\d.,]+)', r'\1 to \2 dollars', s)
    s = re.sub(r'\$\s*([\d.,]+)\s*([kKmM])?\b', lambda m: m.group(1) + ({'k': ' thousand', 'm': ' million'}.get((m.group(2) or '').lower(), '')) + ' dollars', s)
    s = re.sub(r'(\d)\s*km\b', r'\1 kilometres', s); s = re.sub(r'(\d)\s*m\b(?!\w)', r'\1 metres', s)
    s = re.sub(r'([\d.,]+)\s*([kKMB])\b', num_words, s)
    s = re.sub(r'\s*(₫|VND|vnd)\b', ' dong', s).replace('₫', ' dong')
    s = re.sub(r'(\d)\s*°C', r'\1 degrees', s)
    s = s.replace('&', ' and ').replace('…', ', ').replace('—', ', ').replace('–', ' to ').replace('·', ',').replace('%', ' percent')
    s = strip_marks(s)
    return re.sub(r'\s+', ' ', s).strip()

VIS = [('aɪ', 'A'), ('aʊ', 'A'), ('eɪ', 'E'), ('oʊ', 'O'), ('ɔɪ', 'O'), ('tʃ', 'C'), ('dʒ', 'C')]
def vclass(c):
    if c in 'mbp': return 'M'
    if c in 'fv': return 'F'
    if c in 'ɑæaʌɐ': return 'A'
    if c in 'eɛɪiəɚɜ': return 'E'
    if c in 'oɔuʊw': return 'O'
    return 'C'
def visemes(ph, env):
    """Spread the phoneme sequence over the voiced frames of the envelope (vowels weigh more)."""
    ph = re.sub(r"[ˈˌː.,!?;:\-'\"]", '', ph); units = []; i = 0
    while i < len(ph):
        if ph[i] == ' ': i += 1; continue
        hit = next((v for k, v in VIS if ph.startswith(k, i)), None)
        if hit: units.append(hit); i += 2
        else: units.append(vclass(ph[i])); i += 1
    voiced = [k for k, v in enumerate(env) if v > .12]; out = ['X'] * len(env)
    if not units or not voiced: return ''.join(out)
    w = [1.7 if u in 'AEO' else 1.0 for u in units]; tot = sum(w); acc = 0; j = 0
    for k_i, k in enumerate(voiced):
        pos = (k_i + .5) / len(voiced) * tot
        while j < len(units) - 1 and acc + w[j] < pos: acc += w[j]; j += 1
        out[k] = units[j]
    return ''.join(out)

def voice_for(spk, narrator):
    if re.match(r'^[abefhijpz][fm]_\w+$', spk or ''): return spk
    if spk in (None, '', 'narrator'): return narrator
    return DEFAULT_SPK.get(spk, 'af_heart' if narrator.startswith('am') or narrator.startswith('bm') else 'am_echo')

def tts(text, voice, speed=1.0):
    s, sr = kokoro().create(speakable(text), voice=voice, speed=speed, lang='en-gb' if voice.startswith('b') else 'en-us')
    s = np.asarray(s, dtype=np.float32)
    a = np.abs(s); thr = max(1e-3, a.max() * .02); idx = np.where(a > thr)[0]   # trim silence
    if len(idx): s = s[max(0, idx[0] - int(sr * .03)): idx[-1] + int(sr * .08)]
    return s, sr

def tts_expr(text, voice, speed=1.0):
    """Delivery pass: comic timing and rhythm on top of Kokoro.
    '…' or ' — ' = a held beat (0.38 s) before the next words (set-up → punchline); sentences get a 0.14 s breath;
    very short lines (≤ 4 words, the punchlines) are spoken 7 % slower so they land."""
    words = len(re.sub(r'[*\[\]]', '', text).split()); sp = speed * (.93 if words <= 4 else 1.0)
    chunks = [c for c in re.split(r'(…|\.\.\.| — | – |\u200b)', text)]; out = []; sr0 = 24000
    for c in chunks:
        if c == '\u200b': out.append(('gap', .6)); continue   # [BEAT] from the script: a held pause, invisible in the caption
        if c in ('…', '...', ' — ', ' – '): out.append(('gap', .45)); continue
        if not c.strip(): continue
        for k, sent in enumerate([x for x in re.split(r'(?<=[.!?])\s+', c.strip()) if x.strip()]):
            if k: out.append(('gap', .14))
            if not re.search(r'[A-Za-z0-9À-ỹ]', sent): continue
            x, sr0 = tts(sent, voice, sp); out.append(('sig', x, sent))
    while out and out[-1][0] == 'gap': out.pop()
    while out and out[0][0] == 'gap': out.pop(0)
    if not out: x, sr = tts(text, voice, sp); return x, sr, align_chunk(text, x, sr, 0.0, voice)
    parts, words, t = [], [], 0.0
    for o in out:
        if o[0] == 'gap': parts.append(np.zeros(int(sr0 * o[1]), np.float32)); t += int(sr0 * o[1]) / sr0
        else: parts.append(o[1]); words += align_chunk(o[2], o[1], sr0, t, voice); t += len(o[1]) / sr0
    return np.concatenate(parts), sr0, words

def _phon_len(tok, voice):
    sp = speakable(tok)
    try: return max(1, len(re.sub(r'\s', '', kokoro().tokenizer.phonemize(sp, 'en-gb' if voice.startswith('b') else 'en-us'))))
    except Exception: return max(1, len(re.sub(r'[^A-Za-z0-9]', '', sp)))

def align_chunk(text, x, sr, t0, voice):
    """Word timing inside one synthesised sentence: words share the speech time by phoneme count, and comma/semicolon/colon
    boundaries snap to the real pauses found in the audio. Returns [[token, start, end], …] (seconds from the line start)."""
    toks = [w for w in re.sub(r'[*\[\]]', '', text).split() if re.search(r'[A-Za-z0-9$%€£]', w)]
    if not toks: return []
    hop = max(1, int(sr * .01)); n = max(1, len(x) // hop); rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
    ref = np.percentile(rms, 95) or 1; quiet = rms < ref * .08; voiced = np.where(~quiet)[0]
    s0 = (voiced[0] if len(voiced) else 0) * .01; s1 = ((voiced[-1] + 1) if len(voiced) else n) * .01
    gaps, i = [], 0                                           # silent runs ≥ 70 ms inside the speech
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]: j += 1
            if j - i >= 7 and i * .01 > s0 and j * .01 < s1: gaps.append((i * .01, j * .01))
            i = j
        else: i += 1
    wts_all = [_phon_len(w, voice) for w in toks]; tot_all = sum(wts_all)
    brk = [k for k, w in enumerate(toks[:-1]) if re.search(r'[,;:)]$', w)]
    segs, start, ti, used = [], s0, 0, set()                 # each comma snaps to the pause nearest its expected time (±0.4 s)
    for k in brk:
        exp = s0 + (s1 - s0) * sum(wts_all[:k + 1]) / tot_all
        cand = [g for gi, g in enumerate(gaps) if gi not in used and g[0] > start + .05 and abs((g[0] + g[1]) / 2 - exp) < .4]
        if not cand: continue
        g = min(cand, key=lambda g: abs((g[0] + g[1]) / 2 - exp)); used.add(gaps.index(g))
        segs.append((toks[ti:k + 1], start, g[0])); start = g[1]; ti = k + 1
    segs.append((toks[ti:], start, s1)); res = []
    for ts, a, b in segs:
        if not ts: continue
        wts = [_phon_len(w, voice) for w in ts]; tot = sum(wts); acc = 0
        for w, wt in zip(ts, wts):
            ws = a + (b - a) * acc / tot; acc += wt; we = a + (b - a) * acc / tot; res.append([w, round(t0 + ws, 3), round(t0 + we, 3)])
    return res

def resample(x, sr, to=SR_OUT):
    if sr == to: return x
    n = int(len(x) * to / sr); return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)

def write_wav(path, x, sr):
    from scipy.io import wavfile
    wavfile.write(path, sr, (np.clip(x, -1, 1) * 32767).astype(np.int16))
def read_wav(path):
    from scipy.io import wavfile
    sr, x = wavfile.read(path); return x.astype(np.float32) / 32768, sr

def synth(lines_path, outdir, voice=None, speed=1.0):
    L = json.load(open(lines_path, encoding='utf-8')); os.makedirs(outdir, exist_ok=True)
    narr = voice or L.get('voice') or 'am_michael'; durs = []; wlist = []
    if speed in (None, 'auto'):  # calibrate to ~2.7 words/s (≈160 wpm, explainer pace) from the first lines
        probe = [ln['text'] for ln in L['lines'][:4]] or ['This is a short calibration line for the narrator.']
        dur = 0
        for pr in probe: x, sr = tts(pr, narr, 1.0); dur += len(x) / sr
        words = len(' '.join(probe).split()); wps = words / dur
        speed = min(1.2, max(.85, round(3.15 / wps, 2)))
        print(f'  narrator {narr}: {wps:.2f} words/s at speed 1.0 → speed {speed}')
    speed = float(speed)
    for ln in L['lines']:
        v = voice_for(ln.get('spk'), narr); key = hashlib.md5(f"{ln['text']}|{v}|{speed}|x2".encode()).hexdigest()[:12]
        cp = os.path.join(outdir, f'c_{key}.wav'); out = os.path.join(outdir, f"vo_{ln['k']}.wav"); cw = cp.replace('.wav', '.words.json')
        if not os.path.exists(cp) or not os.path.exists(cw):
            x, sr, wd = tts_expr(ln['text'], v, speed); write_wav(cp, resample(x, sr), SR_OUT); json.dump(wd, open(cw, 'w'))
        x, sr = read_wav(cp); write_wav(out, x, sr); durs.append(round(len(x) / sr, 3)); wlist.append(json.load(open(cw)))
        print(f"  [{ln['k']:>3}] {v:<11} {durs[-1]:5.2f}s  {speakable(ln['text'])[:70]}")
    json.dump(durs, open(os.path.join(outdir, 'durs.json'), 'w'))
    json.dump(wlist, open(os.path.join(outdir, 'words.json'), 'w'))   # per line: [[token, start, end], …] — the engine times at:<word> on these
    envs = []   # mouth-openness envelope per line at 30 fps (for lip sync)
    for ln in L['lines']:
        x, sr = read_wav(os.path.join(outdir, f"vo_{ln['k']}.wav")); hop = sr // 30; n = len(x) // hop
        rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(n)]) if n else np.zeros(1)
        ref = np.percentile(rms, 95) or 1; e = np.clip(rms / ref, 0, 1); e = np.convolve(e, [.25, .5, .25], 'same')
        envs.append([round(float(v), 2) for v in e])
    json.dump(envs, open(os.path.join(outdir, 'envs.json'), 'w'))
    vis = []   # viseme track per line at 15 fps: X rest · M m/b/p · F f/v · A open · E wide/teeth · O round · C consonant
    for ln, e in zip(L['lines'], envs):
        try: ph = kokoro().tokenizer.phonemize(speakable(ln['text']), 'en-gb' if voice_for(ln.get('spk'), narr).startswith('b') else 'en-us')
        except Exception: ph = ''
        vis.append(visemes(ph, e[::2]))
    json.dump(vis, open(os.path.join(outdir, 'visemes.json'), 'w'))
    print('voice-over:', len(durs), 'lines,', round(sum(durs), 1), 's total')

def place(cues_path, vodir, out_path):
    C = json.load(open(cues_path, encoding='utf-8')); D = C.get('duration') or max(s['t1'] for s in C['subs']) + 1
    track = np.zeros(int(SR_OUT * (D + 1)), np.float32)
    for s in C['subs']:
        if s.get('vo') is None: continue
        p = os.path.join(vodir, f"vo_{s['vo']}.wav")
        if not os.path.exists(p): continue
        x, sr = read_wav(p); i = int((s['t0'] + .05) * SR_OUT); j = min(len(track), i + len(x)); track[i:j] += x[:j - i]
    write_wav(out_path, track, SR_OUT); print('vo track:', out_path)

if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k, d=None: a[a.index('--' + k) + 1] if '--' + k in a else d
    cmd = a[0] if a else 'help'
    if cmd == 'setup': setup()
    elif cmd == 'voices': print(' '.join(sorted(kokoro().get_voices())))
    elif cmd == 'synth': synth(a[1], a[2], opt('voice'), opt('speed', 'auto'))
    elif cmd == 'place': place(a[1], a[2], a[3])
    elif cmd == 'say': x, sr = tts(a[1], opt('voice', 'am_michael'), float(opt('speed', 1.0))); write_wav(a[2], resample(x, sr), SR_OUT); print(speakable(a[1]))
    elif cmd == 'text': print(speakable(a[1]))
    else: print(__doc__)
