#!/usr/bin/env python3
"""Free English voice-over with Kokoro-82M (Apache-2.0, runs offline on CPU) — no API key, no cost.
  python3 tools/voice.py setup                                   # one-time: pip deps + model files (~120 MB) into ~/.cache/va-voice
  python3 tools/voice.py voices                                  # list voice ids
  python3 tools/voice.py synth out/x_lines.json out/vo [--voice am_michael] [--speed 1.0]
        → out/vo/vo_<k>.wav per spoken line + out/vo/durs.json (seconds, in line order) — cached by text+voice
  python3 tools/voice.py place out/x_cues.json out/vo out/x_vo.wav  # lay the lines on the timeline (44.1 kHz)
  python3 tools/voice.py say "Text to test" test.wav [--voice af_heart]
  python3 tools/voice.py audition "A line from the script." out/aud      # the same line in 8 narrator casts → pick one
VOICE DIRECTION (v6, references/voice-direction.md): a voice is a name or a blend ("am_michael*.7+bm_george*.3"); the story
header `voices: musk=bm_george; holmes=bf_emma` casts quote voices (caption "@musk: …"); `delivery: calm|lively|tense|wry|warm`
sets the episode's read; every line is read by its act (setup/rise/doubt/fall/after…) and by what the sentence does (scene-setting,
fact, build-up, reveal, question), with seeded human jitter; {slow} {fast} {hold} {hit} {low} {up} {soft} {archive} tags in a
caption fine-tune one line.Vietnamese names are respelled for an English voice via tools/pron_vi.json (edit/extend freely)."""
import json, os, re, sys, hashlib, unicodedata, subprocess
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.expanduser(os.environ.get('VA_VOICE_DIR', '~/.cache/va-voice'))
# fp32 model: ~4x faster than int8 on x86 CPUs (int8 ConvTranspose/LSTM are slow in onnxruntime) and cleaner audio.
# PP_VOICE_INT8=1 keeps the small int8 file for machines short on disk/RAM.
MODEL_F = 'kokoro-v1.0.int8.onnx' if os.environ.get('PP_VOICE_INT8') else 'kokoro-v1.0.onnx'
MODEL, VOICES = os.path.join(CACHE, MODEL_F), os.path.join(CACHE, 'voices-v1.0.bin')
URLS = {'kokoro-v1.0.onnx': 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.onnx',
        'kokoro-v1.0.int8.onnx': 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx',
        'voices-v1.0.bin': 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin'}
SR_OUT = 44100
DEFAULT_SPK = {'narrator': 'am_michael', 'a': 'am_echo', 'b': 'af_heart', 'c': 'bm_george', 'd': 'af_nicole'}

def setup():
    subprocess.call([sys.executable, '-m', 'pip', 'install', '-q', 'kokoro-onnx', 'soundfile', '--break-system-packages'])
    os.makedirs(CACHE, exist_ok=True)
    for f in [MODEL_F, 'voices-v1.0.bin']:
        p = os.path.join(CACHE, f)
        if not os.path.exists(p) or os.path.getsize(p) < 1e6: subprocess.check_call(['curl', '-sSL', '-o', p, URLS[f]])
    print('voice ready:', CACHE)

_k = None
def kokoro():
    global _k
    if _k is None:
        if not os.path.exists(MODEL) or not os.path.exists(VOICES): setup()
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
    s = s.replace('&', ' and ').replace('…', '…').replace('—', ' — ').replace('–', ' to ').replace('·', ',').replace('%', ' percent')
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

def voice_for(spk, narrator, cast=None):
    if re.match(r'^[abefhijpz][fm]_\w+$', spk or ''): return spk
    if spk in (None, '', 'narrator'): return narrator
    if cast and spk in cast: return cast[spk]
    if spk and spk not in DEFAULT_SPK:   # an uncast quote voice: a contrasting voice of the other accent, never the narrator's
        return 'bm_george' if vbase(narrator)[0] == 'a' else 'am_fenrir'
    return DEFAULT_SPK.get(spk, 'af_heart' if narrator.startswith('am') or narrator.startswith('bm') else 'am_echo')

# ---------------------------------------------------------------- casting: names, blends, prosody mixes
_VS = {}
def vstyle(spec):
    """'am_michael' → name · 'am_michael*.7+bm_george*.3' → blended style · 'am_michael~am_puck*.2' → am_michael's timbre with
    20 % of am_puck's prosody half (pitch/pacing) — a different read, the same man."""
    spec = (spec or 'am_michael').strip()
    if re.fullmatch(r'[a-z]{2}_\w+', spec): return spec
    if spec in _VS: return _VS[spec]
    K = kokoro(); m = re.fullmatch(r'([a-z]{2}_\w+)\s*~\s*([a-z]{2}_\w+)(?:\*([\d.]+))?', spec)
    if m:
        b, d, w = K.get_voice_style(m.group(1)), K.get_voice_style(m.group(2)), float(m.group(3) or .15)
        st = np.concatenate([b[..., :128], (1 - w) * b[..., 128:] + w * d[..., 128:]], -1)
    else:
        parts = [(p.split('*')[0].strip(), float(p.split('*')[1]) if '*' in p else 1.0) for p in spec.split('+') if p.strip()]
        tot = sum(w for _, w in parts) or 1; st = sum(K.get_voice_style(n) * (w / tot) for n, w in parts)
    _VS[spec] = st.astype(np.float32); return _VS[spec]
def vlang(spec): return 'en-gb' if (spec or 'a').strip()[:1] == 'b' else 'en-us'
def vbase(spec): return re.match(r'\s*([a-z]{2}_\w+)', spec or 'am_michael').group(1)

def tts(text, voice, speed=1.0):
    s, sr = kokoro().create(speakable(text), voice=vstyle(voice), speed=max(.5, min(2., speed)), lang=vlang(voice))
    s = np.asarray(s, dtype=np.float32)
    a = np.abs(s); thr = max(1e-3, a.max() * .02); idx = np.where(a > thr)[0]   # trim silence
    if len(idx): s = s[max(0, idx[0] - int(sr * .03)): idx[-1] + int(sr * .08)]
    return s, sr

# ---------------------------------------------------------------- delivery direction (references/voice-direction.md)
# act → (speed ×, gap ×, pitch semitones): the same narrator reads the rise faster and brighter, the fall slower and lower.
ACT = {'hook': (1.02, .9, 0), 'setup': (.98, 1., 0), 'rise': (1.04, .85, .15), 'peak': (1.03, .9, .1), 'doubt': (.96, 1.15, -.15),
       'fall': (.93, 1.25, -.35), 'crash': (.92, 1.3, -.4), 'after': (.91, 1.3, -.25), 'lesson': (.92, 1.2, -.2), 'verdict': (.92, 1.25, -.2)}
DELIV = {'calm': (.96, 1.15, -.1), 'lively': (1.04, .85, .2), 'tense': (.97, 1.1, -.2), 'wry': (1.0, 1.05, 0), 'warm': (.97, 1.1, 0)}
# sentence role → (speed ×, pause before, pause after) — the silence BEFORE a reveal is the device (research/voice.md §2.1)
ROLE = {'set': (.95, 0, .26), 'fact': (.99, 0, .18), 'build': (1.03, 0, .1), 'reveal': (.88, .32, .3), 'q': (.95, 0, .42), 'quote': (.95, .12, .22)}
DIR = {'slow': (.9, 0, 0), 'fast': (1.08, 0, 0), 'hold': (1, .7, 0), 'hit': (.87, .5, .45), 'soft': (.94, 0, .1)}
def role_of(s, spk=None):
    w = len(re.sub(r'[*\[\]]', '', s).split())
    if spk and spk != 'narrator': return 'quote'
    if s.rstrip().endswith('?'): return 'q'
    if w <= 5: return 'reveal'
    if re.search(r'\d', s): return 'fact'
    return 'set' if w > 20 else 'build'
def rnd_for(text): return np.random.default_rng(int(hashlib.md5(text.encode()).hexdigest()[:8], 16))

def tts_expr(text, voice, speed=1.0, act=None, dirs=(), delivery=None, spk=None):
    """Delivery pass on top of Kokoro. Each sentence is read by its role (set / fact / build / reveal / question / quote), the
    line by its act and the episode's delivery, plus {tags}; '…' or ' — ' = a held beat, [BEAT] (\u200b) = a 0.6 s pause.
    Seeded jitter (±2 % speed, ±50 ms pauses) keeps the rhythm human but makes a re-render identical."""
    R = rnd_for(text + str(act) + str(dirs)); A = ACT.get(act or '', (1, 1, 0)); Dl = DELIV.get(delivery or '', (1, 1, 0))
    dsp, dpre, dpost = 1., 0., 0.
    for d in dirs:
        if d in DIR: x = DIR[d]; dsp *= x[0]; dpre = max(dpre, x[1]); dpost = max(dpost, x[2])
    gk = A[1] * Dl[1]; chunks = [c for c in re.split(r'(…|\.\.\.| — | – |\u200b)', text)]; out = []; sr0 = 24000
    if dpre: out.append(('gap', dpre))
    for c in chunks:
        if c == '\u200b': out.append(('beat', .6)); continue   # [BEAT] from the script: a held pause, invisible in the caption (kept at a line end too)
        if c in ('…', '...', ' — ', ' – '): out.append(('gap', .42 * gk)); continue
        if not c.strip(): continue
        sents = [x for x in re.split(r'(?<=[.!?])\s+', c.strip()) if x.strip()]
        for k, sent in enumerate(sents):
            if not re.search(r'[A-Za-z0-9À-ỹ]', sent): continue
            r = role_of(sent, spk); rs, pre, post = ROLE[r]
            if 'hit' in dirs and k == len(sents) - 1: rs = min(rs, .88)
            if pre and (k or out): out.append(('gap', pre * gk + R.uniform(-.04, .04)))
            sp = speed * rs * A[0] * Dl[0] * dsp * (1 + R.uniform(-.02, .02))
            x, sr0 = tts(sent, voice, sp); out.append(('sig', x, sent))
            if k < len(sents) - 1: out.append(('gap', max(.08, post * gk + R.uniform(-.05, .05))))
    while out and out[-1][0] == 'gap': out.pop()
    while out and out[0][0] == 'gap' and not dpre: out.pop(0)
    while out and out[0][0] == 'beat': out.pop(0)   # a leading [BEAT] → the caption gap does it
    if not any(o[0] == 'sig' for o in out): x, sr = tts(text, voice, speed); return x, sr, align_chunk(text, x, sr, 0.0, voice)
    parts, words, t = [], [], 0.0
    for o in out:
        if o[0] in ('gap', 'beat'): n = int(sr0 * max(0, o[1])); parts.append(np.zeros(n, np.float32)); t += n / sr0
        else: parts.append(o[1]); words += align_chunk(o[2], o[1], sr0, t, voice); t += len(o[1]) / sr0
    x = np.concatenate(parts)
    st = A[2] + Dl[2] + (-.5 if 'low' in dirs else 0) + (.4 if 'up' in dirs else 0) + R.uniform(-.12, .12)
    if abs(st) >= .1 or 'archive' in dirs: x = colour(x, sr0, st, 'archive' in dirs)
    return x, sr0, words

def colour(x, sr, semitones=0., archive=False):
    """Formant-preserving pitch shift (ffmpeg rubberband: timing unchanged, so word timings stay valid) and the optional
    'archive' band-limit for read documents. Falls back to the dry signal if ffmpeg lacks rubberband."""
    import tempfile
    af = []
    if abs(semitones) >= .1: af.append(f'rubberband=pitch={2 ** (semitones / 12):.4f}:formant=preserved')
    if archive: af.append('highpass=f=160,lowpass=f=6500,aecho=0.8:0.4:14:0.12')
    if not af: return x
    with tempfile.TemporaryDirectory() as d:
        i, o = os.path.join(d, 'i.wav'), os.path.join(d, 'o.wav'); write_wav(i, x, sr)
        r = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', i, '-af', ','.join(af), o], capture_output=True)
        if r.returncode or not os.path.exists(o): return x
        y, _ = read_wav(o)
    return y[:len(x)] if len(y) >= len(x) else np.pad(y, (0, len(x) - len(y)))

def _phon_len(tok, voice):
    sp = speakable(tok)
    try: return max(1, len(re.sub(r'\s', '', kokoro().tokenizer.phonemize(sp, vlang(voice)))))
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
    cast = {k.strip(): v.strip() for k, v in re.findall(r'([\w-]+)\s*=\s*([^;]+)', L.get('voices') or '')}
    if 'narrator' in cast and not voice: narr = cast['narrator']
    delivery = (L.get('delivery') or '').strip().lower() or None
    if speed in (None, 'auto'):  # calibrate to ~2.7 words/s (≈160 wpm, explainer pace) from the first lines
        probe = [ln['text'] for ln in L['lines'][:4]] or ['This is a short calibration line for the narrator.']
        dur = 0
        for pr in probe: x, sr = tts(pr, narr, 1.0); dur += len(x) / sr
        words = len(' '.join(probe).split()); wps = words / dur
        speed = min(1.2, max(.85, round(3.15 / wps, 2)))
        print(f'  narrator {narr}: {wps:.2f} words/s at speed 1.0 → speed {speed}' + (f' · delivery {delivery}' if delivery else '') + (f' · cast {cast}' if cast else ''))
    speed = float(speed)
    for ln in L['lines']:
        v = voice_for(ln.get('spk'), narr, cast); act = ln.get('act'); dirs = tuple(ln.get('dir') or ())
        key = hashlib.md5(f"{ln['text']}|{v}|{speed}|{act}|{dirs}|{delivery}|{ln.get('spk')}|x3".encode()).hexdigest()[:12]
        cp = os.path.join(outdir, f'c_{key}.wav'); out = os.path.join(outdir, f"vo_{ln['k']}.wav"); cw = cp.replace('.wav', '.words.json')
        if not os.path.exists(cp) or not os.path.exists(cw):
            x, sr, wd = tts_expr(ln['text'], v, speed, act, dirs, delivery, ln.get('spk')); write_wav(cp, resample(x, sr), SR_OUT); json.dump(wd, open(cw, 'w'))
        x, sr = read_wav(cp); write_wav(out, x, sr); durs.append(round(len(x) / sr, 3)); wlist.append(json.load(open(cw)))
        tag = (act or '-')[:6] + ('{' + ','.join(dirs) + '}' if dirs else '')
        print(f"  [{ln['k']:>3}] {v[:22]:<22} {tag:<12} {durs[-1]:5.2f}s  {speakable(ln['text'])[:60]}")
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
        try: ph = kokoro().tokenizer.phonemize(speakable(ln['text']), vlang(voice_for(ln.get('spk'), narr, cast)))
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
    if not os.environ.get('PP_VO_DRY') and np.abs(track).max() > 1e-4:
        # "recorded, not generated": a low room-tone bed (no digital-silence gating between lines, ≈ −62 dBFS) and a light
        # narrator EQ (warmth, less box, presence). Level, de-ess and compression are done by sound_design.py on the VO bus.
        rg = np.random.default_rng(7); br = np.cumsum(rg.standard_normal(len(track)).astype(np.float32)); br -= np.convolve(br, np.ones(4410) / 4410, 'same')
        br *= 10 ** (-62 / 20) / (np.sqrt(np.mean(br ** 2)) + 1e-9); last = max((s['t1'] for s in C['subs'] if s.get('vo') is not None), default=D) + .8
        env = np.clip(np.minimum(np.arange(len(track)) / (SR_OUT * .5), (last * SR_OUT - np.arange(len(track))) / (SR_OUT * .5)), 0, 1); track = track + br * env
        tmp = out_path + '.raw.wav'; write_wav(tmp, track, SR_OUT)
        r = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'highpass=f=70,lowshelf=f=120:g=2,equalizer=f=250:t=q:w=1:g=-2.5,equalizer=f=3200:t=q:w=1.2:g=2,highshelf=f=10000:g=1', '-ar', str(SR_OUT), '-ac', '1', out_path], capture_output=True)
        if r.returncode: write_wav(out_path, track, SR_OUT)
        os.remove(tmp)
    else: write_wav(out_path, track, SR_OUT)
    print('vo track:', out_path)

CASTS = ['am_michael', 'am_michael*.7+bm_george*.3', 'am_michael~am_puck*.2', 'bm_george', 'am_fenrir', 'bm_lewis*.6+am_michael*.4', 'af_heart', 'bf_emma']
def audition(text, outdir, casts=None):
    """The same line in several casts (names, blends, prosody mixes) so the director picks the episode's narrator by ear."""
    os.makedirs(outdir, exist_ok=True)
    for i, c in enumerate(casts or CASTS):
        x, sr, _ = tts_expr(text, c, .95); f = os.path.join(outdir, f'{i}_' + re.sub(r'[^\w.~+-]', '', c.replace('*', 'x')) + '.wav'); write_wav(f, resample(x, sr), SR_OUT)
        print(f'  {f}  {len(x) / sr:4.1f}s  voice: {c}')

if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k, d=None: a[a.index('--' + k) + 1] if '--' + k in a else d
    cmd = a[0] if a else 'help'
    if cmd == 'setup': setup()
    elif cmd == 'voices': print(' '.join(sorted(kokoro().get_voices())))
    elif cmd == 'synth': synth(a[1], a[2], opt('voice'), opt('speed', 'auto'))
    elif cmd == 'place': place(a[1], a[2], a[3])
    elif cmd == 'say': x, sr, _ = tts_expr(a[1], opt('voice', 'am_michael'), float(opt('speed', 1.0)), opt('act'), tuple((opt('dir') or '').split(',')) if opt('dir') else ()); write_wav(a[2], resample(x, sr), SR_OUT); print(speakable(a[1]))
    elif cmd == 'audition': audition(a[1], a[2], opt('casts').split(',') if opt('casts') else None)
    elif cmd == 'text': print(speakable(a[1]))
    else: print(__doc__)
