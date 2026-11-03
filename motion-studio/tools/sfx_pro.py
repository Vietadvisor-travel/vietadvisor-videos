#!/usr/bin/env python3
"""Vietadvisor Motion Studio - professional SFX palette (CC0 samples + layered synthesis).

    from sfx_pro import get, NAMES, describe
    x = get('impact_wood', var=3)            # mono float64 @ 44.1 kHz, peak ~0.9
    x = get('amb_rain_tin_roof', dur=12, loop=True)

    python3 tools/sfx_pro.py list                 # catalogue (name, category, gain, description)
    python3 tools/sfx_pro.py demo out/sfx_demo/   # one wav per category, sounds back-to-back (0.35 s gaps)
    python3 tools/sfx_pro.py render <name> out.wav [var] [k=v ...]
    python3 tools/sfx_pro.py qa [out.md]          # RMS / peak / centroid / DC / click / CPU table

Design rules (see research/sfx/sfx-report.md):
  * every sound is LAYERED: transient + body + tail (+ sweetener), each layer filtered into its own band;
  * `var` (int) seeds a natural variation: round-robin over the recorded takes, pitch +-3..8 %,
    random filter tilt, timing jitter of sub-events - pass a different var for every repeat;
  * same (name, var, opts) -> identical output (reproducible renders);
  * amb_* beds take dur= (s). Default output has 0.3 s fades (safe to drop in a timeline);
    loop=True returns a seamless tile (equal-power wrap crossfade, no fades) for looping.
Samples live in assets/sfx/<category>/<name>_<n>.ogg (CC0, see assets/sfx/LICENSES.md); if they are missing
the module still works, sample layers fall back to silence and the synthetic layers carry the sound.
"""
import os, sys, zlib, glob, json, time, subprocess, functools, math
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly
from scipy.io import wavfile

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(os.path.dirname(HERE), 'assets', 'sfx')

# =====================================================================================  DSP primitives
def secs(d): return max(1, int(round(SR * d)))
def tt(n): return np.arange(n) / SR
def fq(f): return float(np.exp(round(math.log(max(f, 10.)) * 150) / 150))  # 0.7 % grid for filter cache

@functools.lru_cache(maxsize=8192)
def _sos(kind, f1, f2, order):
    ny = SR / 2 * .96
    if kind == 'band':
        lo, hi = max(15., min(f1, ny * .9)), min(ny, max(f2, f1 * 1.05))
        return butter(order, [lo, hi], btype='band', fs=SR, output='sos')
    return butter(order, min(ny, max(15., f1)), btype=kind, fs=SR, output='sos')
def lp(x, f, o=2): return sosfilt(_sos('low', fq(f), 0., o), x)
def hp(x, f, o=2): return sosfilt(_sos('high', fq(f), 0., o), x)
def bp(x, lo, hi, o=2): return sosfilt(_sos('band', fq(lo), fq(hi), o), x)
def reso(x, f, q=10.): return bp(x, f * (1 - .5 / q), f * (1 + .5 / q))
def vfilt(x, f, kind='low', bw=1., block=128, order=2):
    """time-varying filter: f is an array (Hz per sample); block-wise coefficients with carried state."""
    f = np.full(len(x), float(f)) if np.ndim(f) == 0 else np.asarray(f, float)
    out = np.empty_like(x); zi = None
    for i in range(0, len(x), block):
        fc = f[min(i, len(f) - 1)]
        sos = _sos('band', fq(fc / (1 + bw / 2)), fq(fc * (1 + bw / 2)), order) if kind == 'band' else _sos(kind, fq(fc), 0., order)
        if zi is None or zi.shape[0] != sos.shape[0]: zi = np.zeros((sos.shape[0], 2))
        out[i:i + block], zi = sosfilt(sos, x[i:i + block], zi=zi)
    return out
def nz(x, p=1.):
    m = np.abs(x).max() if len(x) else 0
    return x * (p / m) if m > 0 else x
def rmsn(x, r=.25):
    m = np.sqrt(np.mean(x ** 2)) if len(x) else 0
    return x * (r / m) if m > 0 else x
def phase(f, n): return np.cumsum(np.full(n, float(f)) if np.ndim(f) == 0 else np.asarray(f, float)[:n]) / SR
def sine(f, n, ph=0.): return np.sin(2 * np.pi * phase(f, n) + ph)
def _blep(p, dt):
    y = np.zeros_like(p); a = p < dt; b = p > 1 - dt
    t = p[a] / dt[a]; y[a] = t + t - t * t - 1
    t = (p[b] - 1) / dt[b]; y[b] = t * t + t + t + 1
    return y
def saw(f, n, ph=0.):
    dt = np.clip(np.full(n, float(f)) if np.ndim(f) == 0 else np.asarray(f, float)[:n], 1, SR / 2) / SR
    p = (np.cumsum(dt) + ph) % 1.
    return 2 * p - 1 - _blep(p, dt)
def square(f, n, duty=.5):
    dt = np.clip(np.full(n, float(f)) if np.ndim(f) == 0 else np.asarray(f, float)[:n], 1, SR / 2) / SR
    p = np.cumsum(dt) % 1.; q = (p + duty) % 1.
    return (2 * p - 1 - _blep(p, dt)) - (2 * q - 1 - _blep(q, dt))
def env_ar(n, a, peak_shape=2., tail=2.):
    """asymmetric bell envelope: rise over fraction a, fall to 0 at the end."""
    x = np.linspace(0, 1, n); a = min(max(a, 1e-3), .999)
    return np.where(x < a, (x / a) ** peak_shape, ((1 - x) / (1 - a)) ** tail)
def dec(n, T60): return np.exp(-6.9 * tt(n) / max(T60, 1e-4))
def att(n, a): return np.minimum(1., tt(n) / max(a, 1e-4))
def fade(x, a=.003, r=.012):
    x = x.copy(); n = len(x); ai, ri = min(n // 2, secs(a)), min(n // 2, secs(r))
    if ai > 1: x[:ai] *= np.linspace(0, 1, ai)
    if ri > 1: x[-ri:] *= np.linspace(1, 0, ri)
    return x
def mix(*items):
    """mix((x, t, g), (y, t2), z ...) -> sum with offsets in seconds."""
    norm = []
    for it in items:
        if isinstance(it, np.ndarray): norm.append((it, 0., 1.))
        elif len(it) == 2: norm.append((it[0], it[1], 1.))
        else: norm.append(tuple(it))
    n = max(int(round(t * SR)) + len(x) for x, t, g in norm)
    out = np.zeros(n)
    for x, t, g in norm:
        i = int(round(t * SR))
        if i < 0: x = x[-i:]; i = 0
        out[i:i + len(x)] += x * g
    return out
def place(out, x, t, g=1.):
    i = int(round(t * SR))
    if i < 0: x = x[-i:]; i = 0
    j = min(len(out), i + len(x))
    if j > i: out[i:j] += x[:j - i] * g
def pad(x, n): return np.pad(x, (0, max(0, n - len(x))))[:n]
def ad(*xs):
    """sum signals of different lengths (zero-padded to the longest)."""
    n = max(len(x) for x in xs); return sum(pad(np.asarray(x, float), n) for x in xs)
def repitch(x, ratio):
    """varispeed (pitch and length together) with a polyphase resampler; ratio > 1 = higher/shorter."""
    if abs(ratio - 1) < 2e-3 or len(x) < 8: return x
    up = 1000; down = int(round(up * ratio)); g = math.gcd(up, down)
    return resample_poly(x, up // g, down // g)
def varispeed(x, rate, start=0.):
    pos = start + np.cumsum(np.asarray(rate, float))
    pos = pos[(pos >= 0) & (pos < len(x) - 1)] if np.all(rate >= 0) else np.clip(pos, 0, len(x) - 2)
    return np.interp(pos, np.arange(len(x)), x)
def crush(x, bits=6, hold=4):
    q = 2 ** bits; y = np.round(x * q) / q
    return np.repeat(y[::hold], hold)[:len(x)]
def sat(x, drive=2.): return np.tanh(x * drive) / np.tanh(drive)
def pinkn(r, n):
    w = r.standard_normal(n); X = np.fft.rfft(w); f = np.arange(len(X)); f[0] = 1
    y = np.fft.irfft(X / np.sqrt(f), n); return y / (np.abs(y).max() or 1)
def brown(r, n):
    y = np.cumsum(r.standard_normal(n)); y = hp(y, 25); return y / (np.abs(y).max() or 1)

def modal(freqs, t60s, amps, n, r=None, onset=None):
    """sum of exponentially damped sinusoids (modal synthesis). onset: optional rise time per mode."""
    t = tt(n); out = np.zeros(n)
    for k, (f, T, a) in enumerate(zip(freqs, t60s, amps)):
        if f <= 10 or f >= SR / 2 * .95 or a == 0: continue
        m = min(n, secs(T * 1.15))
        ph = r.uniform(0, 2 * np.pi) if r is not None else 0.
        e = np.exp(-6.9 * t[:m] / T)
        if onset is not None and onset[k] > 0: e = e * (1 - np.exp(-t[:m] / onset[k]))
        out[:m] += a * e * np.sin(2 * np.pi * f * t[:m] + ph)
    return out
def karplus(f, n, r, T60=1.5, bright=.6, pick=.0):
    """Karplus-Strong plucked string, block-vectorised (each period is computed from the previous)."""
    N = max(2, int(round(SR / f))); dcy = 10 ** (-3 / (T60 * f))
    buf = r.uniform(-1, 1, N)
    if bright < 1:
        a = bright
        for _ in range(2): buf = a * buf + (1 - a) * np.roll(buf, 1)
    if pick > 0:  # pick position comb: removes harmonics with a node at the pick point
        d = max(1, int(N * pick)); buf = buf - np.roll(buf, d)
    y = np.zeros(n + N + 1); y[1:N + 1] = buf; k = N + 1
    while k < n + N + 1:
        e = min(k + N, n + N + 1)
        y[k:e] = dcy * .5 * (y[k - N:e - N] + y[k - N - 1:e - N - 1]); k = e
    return y[1:n + 1]

_IRS = {}
IRDEF = {'room': (.6, .4, 7000, 0), 'kitchen': (.7, .5, 8000, 0), 'hall': (3., 2.2, 5000, 0), 'temple': (6., 4.5, 3200, 0),
         'plate': (2., 1.4, 9500, 0), 'outdoor': (1.6, .7, 4500, 1), 'valley': (4., 2.5, 3000, 2)}
def ir(kind):
    if kind in _IRS: return _IRS[kind]
    L, rt, lpf, slap = IRDEF[kind]; r = np.random.default_rng(zlib.crc32(kind.encode())); n = secs(L); t = tt(n)
    x = r.standard_normal(n) * np.exp(-6.9 * t / rt)
    w = np.exp(-t / (rt * .35)); x = lp(x, lpf) * w + lp(x, lpf * .3) * (1 - w)
    x[:secs(.012)] = 0; x[secs(.012):secs(.03)] *= np.linspace(0, 1, secs(.03) - secs(.012))
    for k in range(9):  # early reflections
        i = secs(r.uniform(.006, .05 if kind in ('room', 'kitchen') else .09)); x[i] += r.uniform(-1, 1) * .8 * np.sqrt(np.sum(x ** 2) / n) * 30
    if slap:
        taps = [(.13, .45), (.29, .3), (.47, .18)] if slap == 1 else [(.35, .4), (.8, .25), (1.4, .15), (2.1, .08)]
        for d, g in taps:
            i = secs(d)
            if i < n - 2000: x[i:i + 2000] += lp(r.standard_normal(2000) * np.exp(-np.arange(2000) / 300), 2500) * g * 3 * np.sqrt(np.sum(x ** 2) / n) * 10
    x = x / np.sqrt(np.sum(x ** 2)); _IRS[kind] = x; return x
def verb(x, kind='room', wet=.25, pre_lp=None):
    y = fftconvolve(x if pre_lp is None else lp(x, pre_lp), ir(kind))
    g = np.sqrt(np.mean(x ** 2) / (np.mean(y ** 2) + 1e-12)) if len(x) else 1
    return pad(x, len(y)) * (1 - wet * .5) + y * g * wet * 1.4
def doppler(src, n, v=18., d0=3., tc=None, c=343.):
    """moving source passing a listener: source signal src (>= n samples), speed v m/s, closest distance d0."""
    tc = n / SR / 2 if tc is None else tc
    tau = tt(int(n * 1.3)); dist = np.sqrt(d0 ** 2 + (v * (tau - tc)) ** 2); arr = tau + dist / c
    tq = tt(n); emit = np.interp(tq, arr, tau); dq = np.interp(tq, arr, dist)
    y = np.interp(emit * SR, np.arange(len(src)), src, left=0, right=0)
    y = vfilt(y, np.clip(12000 * (d0 / dq) ** .8, 700, 16000), 'low', block=256)
    return y * (d0 / dq), dq

# =====================================================================================  samples
@functools.lru_cache(maxsize=None)
def _files(key):
    cat, name = key.split('/')
    return tuple(sorted(glob.glob(os.path.join(ASSETS, cat, name + '_[0-9].ogg')) + glob.glob(os.path.join(ASSETS, cat, name + '_[0-9][0-9].ogg'))))
@functools.lru_cache(maxsize=None)
def _load(path):
    try:
        p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True)
        x = np.frombuffer(p.stdout, dtype=np.float32).astype(np.float64)
    except Exception: x = np.zeros(1)
    x.setflags(write=False); return x
_WARNED = set()

# =====================================================================================  context + registry
class Ctx:
    def __init__(s, name, var, opts):
        s.name, s.var, s.o = name, int(var), dict(opts)
        s.r = np.random.default_rng([zlib.crc32(name.encode()), int(var) & 0xffffffff, 7])
    def u(s, a, b): return float(s.r.uniform(a, b))
    def jit(s, pct):
        """variation factor: |deviation| in [0.35, 1] x pct %, random sign (never ~0, so takes always differ)."""
        return 1 + (1 if s.r.random() < .5 else -1) * s.u(.35 * pct, pct) / 100
    def ch(s, seq): return seq[int(s.r.integers(len(seq)))]
    def wn(s, n): return s.r.uniform(-1, 1, n)
    def pn(s, n): return pinkn(s.r, n)
    def opt(s, k, d): return type(d)(s.o.get(k, d)) if not isinstance(d, (list, tuple, dict)) and d is not None else s.o.get(k, d)
    def smp(s, key, pct=5., idx=0, filt=True, rand=False, abs_i=None):
        """one recorded take: round-robin over takes by (var + idx), then pitch/filter variation."""
        files = _files(key)
        if not files:
            if key not in _WARNED: _WARNED.add(key); print(f'[sfx_pro] missing samples: {key} (synthetic layers only)', file=sys.stderr)
            return np.zeros(secs(.05))
        i = int(s.r.integers(len(files))) if rand else (abs_i if abs_i is not None else s.var + idx) % len(files)
        # pitch from a golden-ratio sequence over var: consecutive vars are always well apart (+-0.35..1 x pct %)
        g = ((s.var * .6180339887 + zlib.crc32((s.name + key).encode()) / 2 ** 32 + idx * .382) % 1) * 2 - 1
        ratio = 1 + np.sign(g or 1) * (.35 + .65 * abs(g)) * pct / 100
        x = np.array(_load(files[i])); x = repitch(x, ratio)
        if filt and s.r.random() < .5: x = lp(x, s.u(7000, 17000))
        return x
    def smp_any(s, key, pct=5.): return s.smp(key, pct, rand=True)

REG = {}
def snd(name, cat, gain, desc, use, loop=False):
    def deco(fn):
        REG[name] = dict(fn=fn, category=cat, gain=gain, description=desc, use=use, loop=loop); return fn
    return deco
def S(cat, name, key, gain, desc, use, pct=5., lay=None):
    """register a sample-backed sound with variation; lay(c, x) may add synthetic layers."""
    def fn(c):
        x = c.smp(key, pct)
        return lay(c, x) if lay else x
    REG[name] = dict(fn=fn, category=cat, gain=gain, description=desc, use=use, loop=False)

def _finish(x, loop=False):
    x = np.asarray(x, float); x[~np.isfinite(x)] = 0
    if not loop:
        x = hp(x, 22)
        a = np.abs(x); m = a.max()
        if m > 0:
            idx = np.nonzero(a > m * 10 ** (-64 / 20))[0]
            x = x[:idx[-1] + secs(.01)] if len(idx) else x
        x = fade(x, .0025, min(.03, len(x) / SR / 6))
        w = np.hanning(len(x)) if len(x) > 2 else np.ones(len(x))
        x = x - w * (x.mean() / (w.mean() or 1))   # zero DC without touching the faded edges
    m = np.abs(x).max()
    return x * (.9 / m) if m > 0 else x
def _loopify(make, c, dur, xf=None):
    xf = xf or min(1.0, dur / 4); n = secs(dur); k = secs(xf)
    x = make(n + k); x = pad(x, n + k); x = hp(x - x.mean(), 22)
    out = x[:n].copy(); w = np.linspace(0, np.pi / 2, k)
    out[:k] = x[n:n + k] * np.cos(w) + x[:k] * np.sin(w)
    if not c.o.get('loop', False): out = fade(out, .3, .3)
    return out
def bed(name, desc, use, gain=.35, dflt=8.):
    def deco(maker):
        def fn(c): return _loopify(lambda n: maker(c, n), c, float(c.o.get('dur', dflt)))
        REG[name] = dict(fn=fn, category='amb', gain=gain, description=desc, use=use, loop=True); return maker
    return deco

# =====================================================================================  shared builders
def whoosh(c, d, f0, f1, peak=.55, bw=1.0, air=.4, sub=0., whistle=0., mode='env', tail=1.6):
    n = secs(d * c.jit(8)); e = env_ar(n, peak * c.jit(6), 2.2, tail)
    x = np.linspace(0, 1, n)
    f = f0 * (f1 / f0) ** (e if mode == 'env' else x ** 1.3)
    f = f * c.jit(6)
    body = rmsn(vfilt(c.pn(n), f, 'band', bw))
    hiss = rmsn(vfilt(c.wn(n), np.minimum(f * 2.4, 16000), 'band', 1.4)) * air
    out = (body + hiss) * e
    if sub: out += rmsn(lp(c.wn(n), 110, 4)) * e ** 1.6 * sub * 1.4
    if whistle: out += rmsn(vfilt(c.wn(n), f * 1.3, 'band', .06)) * e ** 2 * whistle
    return out
def thump(c, f0=110, f1=42, d=.35, T=.25):
    n = secs(d); f = f1 + (f0 - f1) * np.exp(-tt(n) * 28)
    return sine(f, n) * dec(n, T) * att(n, .001)
def click(c, f=4000, d=.008, bw=1.2): n = secs(d); return bp(c.wn(n), f / (1 + bw), min(19000, f * (1 + bw))) * dec(n, d / 1.2)
def mallet(c, cutoff=2500, d=.012): n = secs(d); return lp(c.wn(n), cutoff) * np.hanning(n)
def membrane(c, f0, T=.8, drop=.12, n=None, bright=1.):
    n = n or secs(T * 1.4); ratios = [1, 1.59, 2.14, 2.30, 2.65, 2.92, 3.16, 3.5]
    t = tt(n); bend = 1 + drop * np.exp(-t * 30)
    out = np.zeros(n)
    for k, rr in enumerate(ratios):
        a = (1, .5, .35, .25, .2, .15, .12, .1)[k] * (bright if k else 1)
        out += a * sine(f0 * rr * bend * c.jit(.6), n) * dec(n, T / (1 + k * .45))
    return out * att(n, .002)
def metal_modes(c, f0, n, count=24, spread=(1, 14), T=1.2, tilt=.8):
    fr = np.sort(f0 * np.exp(c.r.uniform(np.log(spread[0]), np.log(spread[1]), count)))
    return modal(fr, T * (fr / f0) ** -.45, (fr / f0) ** -tilt * c.r.uniform(.4, 1, count), n, c.r)
def cymbal(c, d=2.5, f0=420):
    n = secs(d); m = metal_modes(c, f0, n, 70, (1, 26), 2.2, .35)
    sh = hp(c.wn(n), 4500) * dec(n, d * .8) * .7
    return nz(m) * .6 + sh * att(n, .002)
FORM = {'a': (730, 1090, 2440), 'e': (530, 1840, 2480), 'i': (290, 2250, 3000), 'o': (570, 840, 2410),
        'u': (320, 870, 2240), 'ae': (660, 1720, 2410), 'ah': (640, 1190, 2390)}
def formant(x, v, scale=1.):
    out = np.zeros_like(x)
    for F, g in zip(FORM[v], (1., .55, .28)):
        F *= scale; out += bp(x, F * .9, F * 1.1) * g
    return out
def glottal(c, f0, n, breath=.15, jitter=.012, rough=0.):
    f0 = np.full(n, float(f0)) if np.ndim(f0) == 0 else np.asarray(f0, float)[:n]
    j = lp(c.r.standard_normal(n), 25); j = j / (np.abs(j).max() or 1)
    src = saw(f0 * (1 + jitter * j), n)
    if rough: src = src * (1 + rough * sine(f0 * .5, n))
    src = lp(src, 2600, 1) + c.wn(n) * breath
    return src
def voices(c, n, count, f0_fn, amp_fn, vowel_a, vowel_b=None, wcurve=None, mix_g=(1., 1.17, 1.32), breath=.15):
    """crowd of `count` voices summed per group (male/female/kid) then formant-filtered once per group."""
    out = np.zeros(n)
    for gi, sc in enumerate(mix_g):
        A = np.zeros(n); B = np.zeros(n); k = 0
        for v in range(count):
            if v % len(mix_g) != gi: continue
            base = (115, 210, 300)[gi] * c.u(.85, 1.18)
            f0 = f0_fn(base, v); a = amp_fn(v)
            g = glottal(c, f0, n, breath) * a
            if vowel_b is None: A += g
            else:
                w = wcurve(v); A += g * (1 - w); B += g * w
        out += formant(A, vowel_a, sc) + (formant(B, vowel_b, sc) if vowel_b else 0)
    return out
def vowel_voice(c, f0, n, vowels, breath=.12, scale=1., rough=0.):
    """single voice through a vowel sequence (crossfaded static formants)."""
    g = glottal(c, f0, n, breath, rough=rough); out = np.zeros(n); k = len(vowels)
    if k == 1: return formant(g, vowels[0], scale)
    x = np.linspace(0, k - 1, n)
    for i, v in enumerate(vowels):
        w = np.clip(1 - np.abs(x - i), 0, 1); out += formant(g * w, v, scale)
    return out
def engine(c, rpm, n, cyl=1, pipe=260., rough=.25, mech=.15, kernel_ms=45):
    """4-stroke engine from exhaust pulses: rpm array -> firing impulse train convolved with a pipe 'pop'."""
    rpm = np.full(n, float(rpm)) if np.ndim(rpm) == 0 else np.asarray(rpm, float)[:n]
    fire = rpm / 60 * cyl / 2; ph = np.cumsum(fire) / SR
    idx = np.nonzero(np.diff(np.floor(ph)) > 0)[0]
    imp = np.zeros(n); jit = (c.r.random(len(idx)) - .5) * .004 * SR
    ii = np.clip((idx + jit).astype(int), 0, n - 1); imp[ii] = 1 + rough * c.r.standard_normal(len(ii))
    k = secs(kernel_ms / 1000); kt = tt(k)
    pop = (np.sin(2 * np.pi * pipe * kt) * np.exp(-kt * 70) + lp(c.r.standard_normal(k), 900) * np.exp(-kt * 120) * .6
           + np.sin(2 * np.pi * pipe * 2.4 * kt) * np.exp(-kt * 140) * .3)
    x = fftconvolve(imp, pop)[:n]
    tone = sum(saw(fire * h, n) / h for h in (1, 2)) * .25
    mechn = hp(c.wn(n), 3000) * (.5 + .5 * np.sin(2 * np.pi * ph * 2)) * mech
    return lp(x + lp(tone, 1200) + mechn, 6000)
def horn_tone(c, f, n, buzz=.6):
    sq = square(f, n) * buzz + saw(f, n) * (1 - buzz)
    return lp(bp(sq, f * .8, 4500) + reso(sq, f * 3.1, 4) * .5, 5000)
def bird_chirp(c, f=3500, d=.08, up=.4):
    n = secs(d); x = np.linspace(0, 1, n); fr = f * (1 + up * np.sin(np.pi * x)) * c.jit(5)
    return sine(fr + 300 * sine(fr * .07, n), n) * np.sin(np.pi * x) ** 1.5
def events(c, n, rate, make, jitter=True):
    out = np.zeros(n); t = 0.
    while True:
        t += c.r.exponential(1 / rate) if jitter else 1 / rate
        if t * SR >= n: break
        place(out, make(), t)
    return out
def babble(c, n, density=1., count=18, scale_mix=(1., 1.17), lp_f=2600):
    out = np.zeros(n)
    for gi, sc in enumerate(scale_mix):
        for v in ('a', 'o', 'e', 'i'):
            src = np.zeros(n)
            for k in range(max(1, count // (len(scale_mix) * 4))):
                base = (120, 215)[gi % 2] * c.u(.85, 1.2)
                f0 = base * (1 + .15 * lp(c.r.standard_normal(n), 3) / .05 * .05)
                syl = lp((c.r.random(n // 2205 + 2) < .55 * density).astype(float).repeat(2205)[:n], 14)
                syl *= lp(np.abs(c.r.standard_normal(n // 22050 + 2)).repeat(22050)[:n], 1)
                src += glottal(c, np.clip(f0, 70, 400), n, .2) * syl
            out += formant(src, v, sc)
    return lp(out, lp_f)

# =====================================================================================  UI
S('ui', 'ui_click', 'ui/click', .45, 'crisp interface click (Kenney Interface Sounds, 3 takes)', 'buttons, cursor taps, small cuts', 4)
S('ui', 'ui_click_soft', 'ui/click_soft', .4, 'soft rounded click', 'gentle UI taps, list items', 4)
S('ui', 'ui_tick', 'ui/tick', .4, 'tiny tick', 'counters, timeline ticks, clock seconds', 5)
S('ui', 'ui_select', 'ui/select', .45, 'select/confirm blip', 'choosing an option, map POI highlight', 5)
S('ui', 'ui_confirm', 'ui/confirm', .5, 'positive confirmation chime', 'correct answer, booking confirmed', 3)
S('ui', 'ui_error', 'ui/error', .45, 'negative/error buzz', 'wrong answer, myth busted, denied', 3)
S('ui', 'ui_open', 'ui/open', .45, 'panel opens', 'card/panel appearing', 5)
S('ui', 'ui_close', 'ui/close', .45, 'panel closes', 'card/panel leaving', 5)
S('ui', 'ui_toggle', 'ui/toggle', .4, 'toggle switch', 'on/off states, checkbox', 5)
S('ui', 'ui_switch', 'ui/switch', .4, 'mechanical switch', 'menu switch, light switch', 5)
S('ui', 'ui_scroll', 'ui/scroll', .35, 'scroll ratchet', 'scrolling lists, dial turning', 5)
S('ui', 'ui_drop', 'ui/drop', .45, 'drop/plonk', 'item lands in slot, icon drop', 5)
S('ui', 'ui_glass', 'ui/glass', .4, 'glassy ping', 'premium highlight, price reveal', 4)
S('ui', 'ui_maximize', 'ui/maximize', .45, 'expand blip (rising)', 'zoom into a card, expand', 4)
S('ui', 'ui_minimize', 'ui/minimize', .45, 'collapse blip (falling)', 'zoom out of a card, collapse', 4)
S('ui', 'ui_pluck', 'ui/pluck', .4, 'plucky blip', 'list items popping in', 5)
S('ui', 'ui_bong', 'ui/bong', .45, 'soft bong', 'section marker, notification', 4)
S('ui', 'ui_question', 'ui/question', .45, 'questioning two-tone', 'quiz question appears', 4)
S('ui', 'ui_hover', 'ui/rollover', .3, 'hover/rollover tick', 'cursor hover, subtle accents', 5)
S('ui', 'ui_key', 'ui/key', .35, 'single keyboard key', 'text typing per letter', 6)
S('ui', 'ui_button', 'ui/button', .4, 'plastic button push', 'press, remote control, elevator', 5)

@snd('ui_typing', 'ui', .4, 'keyboard typing burst (recorded + per-key round robin), dur opt', 'type-on titles, laptop shots')
def _(c):
    d = c.opt('dur', 2.0); n = secs(d + .3); out = np.zeros(n); t = 0.; last = -1
    while t < d:
        i = int(c.r.integers(4))
        if i == last: i = (i + 1) % 4
        last = i; k = c.smp('ui/key', 7, idx=i)
        place(out, k, t, c.u(.5, 1.)); t += c.u(.06, .17) if c.r.random() > .08 else c.u(.25, .4)
    if c.opt('ding', 0): place(out, nz(_bell_small(c, 1900, .9)) * .4, d)
    return out
@snd('ui_text_reveal', 'ui', .35, 'soft per-letter ticks for a text reveal (n letters, gap)', 'kinetic typography, captions writing on')
def _(c):
    n_ = int(c.opt('n', 14)); gap = c.opt('gap', .045); out = np.zeros(secs(n_ * gap + .2))
    for k in range(n_):
        f = 3200 * c.jit(12); x = ad(click(c, f, .012, .6), sine(f * .5, secs(.012)) * dec(secs(.012), .006) * .3)
        place(out, x, k * gap + c.u(0, gap * .2), c.u(.5, 1))
    return out
@snd('ui_pop', 'ui', .5, 'bubbly pop: pitched sine blip + click transient', 'icons/stickers popping in')
def _(c):
    n = secs(.09); f0 = 380 * c.jit(10); f = f0 + 900 * (1 - np.exp(-tt(n) * 60))
    body = sine(f, n) * dec(n, .06) * att(n, .002)
    return mix(body, (click(c, 5000, .004) * .5, 0), (lp(c.wn(secs(.02)), 2000) * dec(secs(.02), .01) * .2, 0))
@snd('ui_notification', 'ui', .45, 'two-note marimba notification (modal bars)', 'new fact card, tip appears')
def _(c):
    root = c.ch([523.3, 587.3, 659.3]) * c.jit(1.5); out = []
    for k, (rr, t) in enumerate([(1, 0), (1.5 if c.r.random() > .5 else 1.335, .11)]):
        f = root * rr; n = secs(.7)
        out.append((ad(modal([f, f * 3.98, f * 9.2], [.5, .12, .04], [1, .25, .08], n, c.r), mallet(c, 3000, .006) * .2), t))
    return mix(*out)
@snd('ui_data_blip', 'ui', .35, 'short digital data blip (FM)', 'numbers updating, HUD data')
def _(c):
    n = secs(c.u(.04, .09)); f = c.ch([880, 1320, 1760, 2093]) * c.jit(2)
    return sine(f + f * 2 * sine(f * c.ch([.5, 2, 3]), n) * dec(n, .03), n) * dec(n, .06) * att(n, .002)
@snd('ui_counter', 'ui', .4, 'accelerating tick roll for number counters (dur), optional end ding', 'price/stat counting up')
def _(c):
    d = c.opt('dur', 1.4); out = np.zeros(secs(d + 1)); k = 0; t = 0.; N = int(c.opt('ticks', 24))
    while t < d:
        f = 2600 + 900 * (t / d); place(out, ad(click(c, f * c.jit(5), .01, .5), sine(f / 2, secs(.01)) * dec(secs(.01), .004) * .4), t, .6 + .4 * t / d)
        k += 1; t = d * (k / N) ** .75
    if c.opt('ding', 1): place(out, nz(_bell_small(c, 2093, .7)) * .5, d)
    return out
@snd('ui_pin_drop', 'ui', .5, 'map pin drop: tiny falling whistle + pop + plastic thock', 'pins landing on the map')
def _(c):
    n = secs(.22); w = sine(np.linspace(2600, 900, n) * c.jit(5), n) * np.hanning(n) * .25
    th = ad(thump(c, 300, 140, .1, .05) * .7, bp(c.wn(secs(.03)), 800, 3000) * dec(secs(.03), .015) * .4)
    return mix((w, 0), (th, .2), (click(c, 4500, .005) * .5, .2))
@snd('ui_swoosh', 'ui', .4, 'tight UI swoosh (synth filtered noise)', 'cards sliding, menu transitions')
def _(c): return whoosh(c, .22, 1500, 6000, .6, .9, .5)
@snd('ui_shutter', 'ui', .45, 'camera shutter: two mechanical clacks + spring ring', 'photo moments, snapshot freeze-frame')
def _(c):
    def clack(): n = secs(.03); return ad(bp(c.wn(n), 1500, 7000) * dec(n, .012), thump(c, 500, 200, .03, .01) * .3)
    ring = metal_modes(c, 2400, secs(.12), 6, (1, 3), .08) * .15
    return mix((clack(), 0), (ring, .005), (clack() * .8, c.u(.06, .09)))

# =====================================================================================  GLITCH
@snd('glitch_short', 'glitch', .4, 'short digital glitch: 3-6 recorded micro-glitches (Kenney) stuttered with pitch steps', 'UI glitch, data corruption accent')
def _(c):
    out = np.zeros(secs(.4)); t = 0.
    for k in range(int(c.u(3, 7))):
        place(out, nz(c.smp('glitch/glitch', 8, rand=True)) * c.u(.5, 1), t); t += c.u(.015, .05)
    return out
S('glitch', 'glitch_scratch', 'glitch/scratch', .4, 'digital scratch', 'rewind accents, broken signal', 5)
S('glitch', 'glitch_computer', 'glitch/computer', .35, 'computer processing noise', 'loading, data screens', 5)
S('glitch', 'glitch_zap', 'glitch/zap', .4, 'electric zap', 'power surge, neon flicker', 6)
S('glitch', 'glitch_phaser_down', 'glitch/phaser_down', .4, 'phaser falling tone', 'power loss, fail state', 5)
@snd('glitch_stutter', 'glitch', .4, 'stuttered tone/noise fragments with bitcrush', 'glitch transitions, Spider-Verse frame stutter')
def _(c):
    out = np.zeros(secs(.5)); t = 0.; f = c.u(300, 900)
    for k in range(int(c.u(5, 9))):
        n = secs(c.u(.015, .05)); src = square(f * c.ch([1, 1, 2, .5, 1.5]), n) * .4 + c.wn(n) * c.u(.1, .6)
        place(out, crush(bp(src, 200, 6000), c.ch([3, 4, 5]), c.ch([2, 4, 8])) * np.hanning(n) ** .3, t); t += n / SR + c.ch([0, 0, .012, .03])
    return out
@snd('glitch_bitcrush', 'glitch', .4, 'bitcrushed sweep (sample-rate + bit reduction)', 'retro-digital transitions, data dive')
def _(c):
    n = secs(.45); f = np.geomspace(c.u(1500, 3000), c.u(80, 200), n)
    return crush(saw(f, n) * env_ar(n, .1, 1, 1.5), 3, int(c.u(6, 20)))
@snd('glitch_data', 'glitch', .35, 'data stream: rapid random beeps (computing)', 'map loading, statistics computing')
def _(c):
    d = c.opt('dur', 1.0); out = np.zeros(secs(d + .1)); t = 0.
    while t < d:
        n = secs(c.u(.012, .04)); f = c.ch([1046, 1318, 1568, 2093, 2637, 3136]) * c.jit(1)
        place(out, square(f, n) * .3 * np.hanning(n) ** .2, t, c.u(.3, 1)); t += n / SR + c.u(0, .025)
    return lp(out, 7000)
@snd('glitch_noise', 'glitch', .35, 'digital noise burst with gating', 'signal interference, cut to static')
def _(c):
    n = secs(c.u(.3, .5)); gate = np.repeat(c.r.random(n // 441 + 1) > .4, 441)[:n].astype(float)
    return crush(c.wn(n), 4, 3) * lp(gate, 200) * env_ar(n, .05, 1, 1)
@snd('glitch_power_down', 'glitch', .45, 'power-down: falling tone with closing filter', 'screen switches off, energy drained')
def _(c):
    n = secs(c.u(.9, 1.2)); x = np.linspace(0, 1, n); f = 600 * c.jit(10) * np.exp(-x * 3.2)
    src = saw(f, n) * .6 + square(f * .5, n) * .3
    return vfilt(src, 6000 * np.exp(-x * 3.5) + 120, 'low') * (1 - x) ** 1.2
@snd('glitch_tv_static', 'glitch', .3, 'TV static burst with mains hum', 'old TV/archive footage, channel change')
def _(c):
    n = secs(c.opt('dur', .8)); hum = sine(50, n) * .2 + sine(150, n) * .1
    return (hp(c.wn(n), 800) * .8 + hum) * (.7 + .3 * c.r.random(n // 882 + 1).repeat(882)[:n])
@snd('glitch_beep_error', 'glitch', .4, 'double square-wave error beep', 'system error, wrong turn on map')
def _(c):
    f = c.u(380, 460); x = lp(square(f, secs(.12)), 3500) * .5
    return mix((fade(x, .002, .01), 0), (fade(x, .002, .01), .17))

# =====================================================================================  WHOOSH
@snd('whoosh_tiny', 'whoosh', .4, 'very short airy flick (0.16 s)', 'small icons, captions flicking in')
def _(c): return whoosh(c, .16, 1800, 7000, .55, 1., .6)
@snd('whoosh_small', 'whoosh', .45, 'small swish: synth + organic swish layer', 'cards, stickers, quick cuts')
def _(c): return mix(whoosh(c, .3, 900, 4500, .55, 1., .45), (nz(c.smp('whoosh/swish', 6)) * .5 * np.sqrt(np.mean(whoosh(c, .3, 900, 4500) ** 2)) * 4, 0))
@snd('whoosh_med', 'whoosh', .5, 'medium whoosh: pink-noise band sweep + air + light sub', 'scene transitions, objects flying past')
def _(c): return whoosh(c, .55, 450, 3200, .55, .9, .4, .12)
@snd('whoosh_big', 'whoosh', .55, 'big whoosh: band sweep + sub + pitched-down organic swish', 'camera moves, big reveals, map pans')
def _(c):
    w = whoosh(c, .9, 230, 2400, .55, .9, .35, .35)
    s = nz(repitch(c.smp('whoosh/swish', 5), .62)) * np.abs(w).max() * .45
    return mix(w, (s, .9 * .55 - len(s) / SR * .45))
@snd('whoosh_huge', 'whoosh', .6, 'huge cinematic pass: low band sweep, rumble, woom layer, hall tail', 'fleet/map3d flyovers, epic transitions')
def _(c):
    w = whoosh(c, 1.6, 110, 1600, .55, .8, .25, .6)
    wm = nz(repitch(c.smp('whoosh/woom', 5), .8)) * np.abs(w).max() * .4
    return verb(mix(w, (wm, .4)), 'hall', .25)
@snd('whoosh_up', 'whoosh', .5, 'rising whoosh (filter sweeps up)', 'zoom in, lift-off, text flying up')
def _(c): return whoosh(c, .6, 300, 5500, .85, .9, .4, .1, mode='lin', tail=1.)
@snd('whoosh_down', 'whoosh', .5, 'falling whoosh (filter sweeps down)', 'drop, zoom out, falling objects')
def _(c):
    n = secs(.75 * c.jit(6)); e = env_ar(n, .25, 1.5, 1.8); f = 4500 * (200 / 4500) ** np.linspace(0, 1, n) ** .8
    return (rmsn(vfilt(c.pn(n), f, 'band', .9)) + rmsn(lp(c.wn(n), 160, 4)) * .25 * e) * e
@snd('whoosh_by', 'whoosh', .55, 'close pass-by: doppler-shifted air + whistle', 'something whizzing past camera')
def _(c):
    n = secs(1.0); src = rmsn(bp(c.pn(int(n * 1.4)), 500, 5000)) + rmsn(reso(c.wn(int(n * 1.4)), 1400 * c.jit(10), 12)) * .4
    y, dq = doppler(src, n, v=c.u(25, 40), d0=c.u(1.2, 2.5)); return y
@snd('whoosh_swish', 'whoosh', .45, 'organic swish (recorded stick/cloth swings, 3 takes)', 'hand gestures, quick swipes, sword-less swings')
def _(c): return c.smp('whoosh/swish', 7)
@snd('whoosh_twirl', 'whoosh', .45, 'twirling multi-pass swish (recorded)', 'spins, rotations, character twirl')
def _(c): return c.smp('whoosh/twirl', 6)
@snd('whoosh_whistle', 'whoosh', .4, 'thin whistling swing (recorded + resonant synth)', 'thin objects swinging, sticks, cables')
def _(c):
    x = c.smp('whoosh/whistle', 6); n = len(x)
    return x + rmsn(vfilt(c.wn(n), np.linspace(1800, 3200, n) * c.jit(8), 'band', .05)) * np.hanning(n) * np.sqrt(np.mean(x ** 2)) * .6
@snd('whoosh_slash', 'whoosh', .5, 'fast slash swish', 'blade swings, fast wipes')
def _(c): return c.smp('whoosh/slash', 6)
@snd('whoosh_reverse', 'whoosh', .5, 'reverse swell (reversed whoosh + reversed plate) that ends on the cut', 'pre-cut suck-in, place so it ends on the hit')
def _(c): return verb(whoosh(c, .7, 400, 3500, .5, .9, .4, .2), 'plate', .5)[::-1]
@snd('whoosh_cloth', 'whoosh', .4, 'cloth/flag flap: noise with 14-22 Hz flutter', 'flags, capes, banners, lantern cloth')
def _(c):
    n = secs(c.u(.5, .8)); fl = (.55 + .45 * np.sin(2 * np.pi * phase(c.u(14, 22) * (1 + .3 * np.sin(np.linspace(0, 6, n))), n))) ** 2
    return bp(c.pn(n), 250, 2600) * fl * env_ar(n, .35, 1.5, 1.5)
@snd('whoosh_fire', 'whoosh', .5, 'fire whoosh: roaring low band + crackle + sweep', 'torches, fire arrows, dragon-like bursts')
def _(c):
    n = secs(.9); e = env_ar(n, .3, 1.5, 1.8)
    roar = rmsn(vfilt(c.pn(n), 200 + 900 * e, 'band', 1.2)) * e
    cr = events(c, n, 40, lambda: hp(c.wn(secs(.003)), 2500) * c.u(.2, 1)) * e
    return roar + cr * .6
@snd('whoosh_air', 'whoosh', .4, 'recorded air blast (rubberduck)', 'air release, steam push, door draft')
def _(c): return c.smp('whoosh/air', 6)

# =====================================================================================  IMPACT
def _imp(c, key, sub=.4, sub_f=(110, 45), sub_T=.3, room='room', wet=.15, pct=6, tr=.0, lpf=None):
    s = c.smp(key, pct); s = nz(s)
    if lpf: s = lp(s, lpf)
    lay = [s]
    if sub: lay.append((nz(thump(c, sub_f[0] * c.jit(6), sub_f[1], sub_T * 1.5, sub_T)) * sub, 0))
    if tr: lay.append((click(c, 5000, .004) * tr, 0))
    x = mix(*lay)
    return verb(x, room, wet) if wet else x
@snd('impact_soft', 'impact', .5, 'soft cushioned impact + low thump', 'objects landing on cloth/sand, gentle stamps')
def _(c): return _imp(c, 'impact/soft', .35, (90, 45), .15, wet=.08)
@snd('impact_soft_heavy', 'impact', .55, 'heavy soft impact (body-on-ground feel)', 'falls on dirt, sacks, bodies dropping')
def _(c): return _imp(c, 'impact/soft_heavy', .5, (80, 38), .25, wet=.1)
@snd('impact_wood', 'impact', .55, 'heavy wood impact: recorded take + sub + room', 'crates, wooden stakes hit, doors slammed')
def _(c): return _imp(c, 'impact/wood_heavy', .4, (120, 55), .2)
@snd('impact_wood_light', 'impact', .45, 'light wood knock', 'chopsticks box, small wooden props')
def _(c): return _imp(c, 'impact/wood_light', .15, (180, 90), .08, wet=.1)
@snd('impact_plank', 'impact', .5, 'plank/board impact', 'boat planks, floorboards, signboards falling')
def _(c): return _imp(c, 'impact/plank', .3, (110, 55), .15)
@snd('impact_metal', 'impact', .55, 'heavy metal impact with ringing tail', 'wok hit, metal gate, armour')
def _(c): return _imp(c, 'impact/metal_heavy', .3, (100, 50), .2, wet=.2)
@snd('impact_metal_light', 'impact', .45, 'light metal tap', 'spoons, keys, small tins')
def _(c): return _imp(c, 'impact/metal_light', .0, wet=.1)
@snd('impact_glass', 'impact', .5, 'glass impact (heavy)', 'bottle set down hard, glass cracking')
def _(c): return _imp(c, 'impact/glass_heavy', .1, (200, 100), .05, wet=.12)
@snd('impact_glass_light', 'impact', .4, 'light glass tap', 'glass clink accents, ice tea glass')
def _(c): return _imp(c, 'impact/glass_light', 0, wet=.1)
@snd('impact_ceramic', 'impact', .45, 'ceramic plate/bowl impact', 'bowls on table, phở bowl set down')
def _(c): return _imp(c, 'impact/plate', .15, (200, 110), .06, wet=.12)
@snd('impact_body', 'impact', .55, 'punch/body hit (medium)', 'comic punches, bumping into things')
def _(c): return _imp(c, 'impact/punch', .3, (120, 60), .12, wet=.06)
@snd('impact_body_heavy', 'impact', .6, 'heavy punch/body slam + sub', 'big comedic hits, knockouts')
def _(c): return _imp(c, 'impact/punch_heavy', .55, (100, 40), .22, wet=.08)
@snd('impact_stone', 'impact', .5, 'stone/rock impact', 'stone steps, rock falls, citadel walls')
def _(c): return _imp(c, 'impact/stone', .35, (90, 45), .2)
@snd('impact_tin', 'impact', .45, 'tin can impact', 'tin roofs, cans, light sheet metal')
def _(c): return _imp(c, 'impact/tin', .1, wet=.1)
@snd('impact_bell', 'impact', .5, 'bell-like heavy metal strike', 'metal bells struck, alarm, ringing hits')
def _(c): return _imp(c, 'impact/bell', 0, wet=.2)
@snd('impact_slam', 'impact', .55, 'door/lid slam (recorded) + sub', 'doors, lids, shutters slammed')
def _(c): return _imp(c, 'impact/slam', .35, (100, 45), .2)
@snd('impact_thump', 'impact', .5, 'deep thump/thunk (recorded) + sub', 'boxes dropped, heavy object on table, title thunk')
def _(c): return _imp(c, 'impact/thump', .45, (95, 42), .2, wet=.1)
@snd('impact_hit', 'impact', .5, 'generic mid hit (breaking/falling/hit pack)', 'general hits, things knocked over')
def _(c): return _imp(c, 'impact/hit', .25)
@snd('impact_metal_hit', 'impact', .5, 'metal bar/sheet hit', 'pipes, pans, gates, scaffolding')
def _(c): return _imp(c, 'impact/metal_hit', .15, wet=.2)
@snd('impact_wood_hit', 'impact', .5, 'wooden hit (rubberduck)', 'wood props, paddles, sticks')
def _(c): return _imp(c, 'impact/wood_hit', .2)
@snd('impact_squelch', 'impact', .45, 'wet fruit slap/knock (melon recordings)', 'fruit, soft cartoon slaps, mango drop')
def _(c): return _imp(c, 'impact/melon', .2, (120, 60), .08, wet=.05)
@snd('impact_big', 'impact', .65, 'big layered impact: heavy punch + boom + metal grit + hall', 'big moments, giant object lands')
def _(c):
    a = nz(c.smp('impact/punch_heavy', 5)); b = nz(_boom(c, 1.6)) * .8; m = nz(lp(repitch(c.smp('impact/metal_heavy', 5), .6), 4000)) * .3
    return verb(mix(a, b, m), 'hall', .2)
@snd('impact_cinematic', 'impact', .7, 'cinematic trailer hit: transient + distorted kick body + sub + low metal + hall tail', 'title slams, chapter cards, reveals of scale')
def _(c):
    n = secs(2.6); t = tt(n)
    tr = hp(c.wn(secs(.006)), 3000) * np.hanning(secs(.006))
    body = sat(sine(48 + 140 * np.exp(-t * 22), n) * dec(n, .5), 3) * .9
    sub = sine(42 * c.jit(4), n) * dec(n, 2.2) * att(n, .01) * .7
    grit = nz(lp(repitch(c.smp('impact/metal_heavy', 4), .45), 3000)) * .35
    noise_b = lp(c.wn(n), 1200) * dec(n, .35) * .35
    return verb(mix((tr * .8, 0), body, sub, grit, noise_b), 'hall', .3)

# =====================================================================================  HIT (cinematic)
def _boom(c, d=2.2):
    n = secs(d); t = tt(n)
    sub = sine(np.geomspace(95, 30, n) * c.jit(4), n) * dec(n, d * .9) * 1.1
    body = lp(c.wn(n), 900) * dec(n, .4) * .7; air = hp(c.wn(n), 3000) * dec(n, .9) * .1
    return sat((sub + body + air) * att(n, .002), 1.6)
@snd('hit_boom', 'hit', .6, 'trailer boom: falling sub + noise body + air', 'reveals, cuts to wide shots')
def _(c): return verb(_boom(c), 'hall', .2)
@snd('hit_sub_drop', 'hit', .6, 'sub drop (90->28 Hz sine glide, saturated)', 'under title slams, dramatic drop, bass punctuation')
def _(c):
    d = c.opt('dur', 2.2); n = secs(d); f = 28 + 62 * np.exp(-tt(n) * 2.2 / d * 2) * c.jit(5)
    return sat(sine(f, n) * dec(n, d * 1.1) * att(n, .004), 1.8)
@snd('hit_braam', 'hit', .6, 'braam: stacked detuned octave saws, filter bloom, downward bend, hall', 'epic scale reveals (map3d, fleets, mountains)')
def _(c):
    d = c.opt('dur', 2.6); n = secs(d); t = tt(n); f0 = c.opt('note', 55.) * c.jit(1.5)
    bend = 1 - .03 * (t / d) ** 1.5; x = np.zeros(n)
    for m, g in [(1, 1), (1.004, .9), (2, .7), (1.996, .6), (1.5, .45), (.5, .5), (3, .25)]:
        x += saw(f0 * m * bend, n, c.u(0, 1)) * g
    fe = 250 + 2200 * np.exp(-t * 3) * att(n, .06) + 300 * (1 - t / d)
    y = sat(vfilt(x, fe, 'low', block=256) * att(n, .05) * dec(n, d * .9), 2.2)
    return verb(y, 'hall', .35)
@snd('hit_taiko', 'hit', .6, 'big taiko/war-drum hit (modal membrane, pitch drop, hall)', 'battle beats, chapter hits, heavy accents')
def _(c):
    f0 = c.opt('f0', 72.) * c.jit(5); m = membrane(c, f0, 1.0, .18)
    return verb(mix(m, (mallet(c, 1500, .01) * .6, 0), (bp(c.wn(secs(.06)), 300, 900) * dec(secs(.06), .04) * .3, 0)), 'hall', .25)
@snd('hit_tom', 'hit', .5, 'floor-tom hit (modal membrane)', 'rhythmic accents, drum fills')
def _(c): return verb(ad(membrane(c, 120 * c.jit(6), .5, .1), mallet(c, 4000, .006) * .4), 'room', .15)
@snd('hit_snap', 'hit', .45, 'tight snap transient (no tail)', 'kinetic text cuts, sticker snaps, beat accents')
def _(c):
    n = secs(.05); return mix(hp(c.wn(secs(.003)), 3000), bp(c.wn(n), 1200, 5000) * dec(n, .02) * .7, (thump(c, 200, 100, .05, .02) * .4, 0))
@snd('hit_slam', 'hit', .65, 'title slam: snap + heavy punch + short sub drop + low metal + plate', 'art-directed titles slamming on screen')
def _(c):
    p = nz(c.smp('impact/punch_heavy', 4)); s = nz(thump(c, 90, 34, .9, .6)) * .8
    m = nz(lp(repitch(c.smp('impact/metal_heavy', 4), .5), 3500)) * .25; tr = hp(c.wn(secs(.004)), 3500) * .6
    return verb(mix(p, s, m, tr), 'plate', .18)
@snd('hit_comic', 'hit', .6, 'Spider-Verse comic punch: punch + square blip + bitcrushed "pow"', 'comic-panel hits, halftone frames, onomatopoeia text')
def _(c):
    n = secs(.09); blip = square(np.geomspace(900, 160, n) * c.jit(8), n) * dec(n, .07) * .5
    pow_ = crush(bp(c.wn(secs(.12)), 400, 5000) * dec(secs(.12), .06), 4, 4) * .5
    return mix(nz(c.smp('impact/punch', 6)), blip, pow_, (thump(c, 140, 60, .2, .1) * .6, 0))
@snd('hit_metal', 'hit', .55, 'anvil-like metal stinger (free-bar modal partials) + recorded metal', 'dramatic reveals, sword-like accents, "ting!" moments')
def _(c):
    n = secs(2.5); f0 = 380 * c.jit(6)
    bar = modal([f0 * r for r in (1, 2.76, 5.40, 8.93, 13.34)], [2.2, 1.4, .9, .5, .3], [1, .6, .4, .25, .12], n, c.r)
    return verb(mix(nz(bar) * .7, nz(c.smp('impact/metal_heavy', 4)) * .6, (click(c, 6000, .003) * .5, 0)), 'hall', .25)
@snd('hit_glitch', 'hit', .55, 'glitched hit: chopped repeats with pitch steps + bitcrush', 'Spider-Verse glitch frames, tech reveals')
def _(c):
    h = nz(c.smp('impact/punch_heavy', 4))[:secs(.08)]; out = np.zeros(secs(.6)); t = 0.
    for k in range(int(c.u(3, 6))):
        place(out, crush(repitch(h, c.ch([1, 1.26, .8, 1.5])), 5, c.ch([1, 2, 4])), t, 1 - k * .1); t += c.u(.03, .07)
    place(out, nz(_boom(c, 1.2)) * .6, t); return out
@snd('hit_heartbeat', 'hit', .5, 'heartbeat (lub-dub) pair, n beats, gap', 'suspense before a reveal, quiz tension')
def _(c):
    nb = int(c.opt('n', 3)); gap = c.opt('gap', .8); out = np.zeros(secs(nb * gap + .5))
    for k in range(nb):
        for dt, g in ((0, 1), (.22, .65)):
            place(out, ad(thump(c, 75 * c.jit(8), 40 * c.jit(8), .25, .15 * c.jit(15)), lp(c.wn(secs(.03)), 300) * dec(secs(.03), .015) * .3), k * gap + dt, g)
    return out

# =====================================================================================  RISER
@snd('riser_noise', 'riser', .45, 'noise riser: band sweep 300->9 kHz, accelerating tremolo; ends at dur', 'build-up into a reveal; place at hit_time - dur')
def _(c):
    d = c.opt('dur', 2.0); n = secs(d); x = np.linspace(0, 1, n)
    f = 300 * (9000 / 300) ** (x ** 1.4); trem = 1 - .45 * x * (.5 + .5 * np.sin(2 * np.pi * phase(4 + 22 * x ** 2, n)))
    y = rmsn(vfilt(c.pn(n), f, 'band', .8, block=256)) + rmsn(hp(c.wn(n), 6000)) * .3 * x ** 2
    return fade(y * x ** 2.2 * trem, .05, .004)
@snd('riser_tone', 'riser', .45, 'tonal riser: Shepard-style octave glissando + noise bed', 'tension rising, countdowns')
def _(c):
    d = c.opt('dur', 2.4); n = secs(d); x = np.linspace(0, 1, n); y = np.zeros(n); base = 110 * c.jit(3)
    for k in range(6):
        oc = (k + x * 1.5) % 6; f = base * 2 ** oc; w = np.exp(-((oc - 3) / 1.3) ** 2)
        y += saw(f, n) * w * .3 + sine(f, n) * w * .3
    y = lp(y, 5000) + rmsn(bp(c.pn(n), 500, 6000)) * .15 * x
    return fade(y * x ** 1.8, .05, .004)
@snd('riser_tension', 'riser', .45, 'string-like semitone cluster tremolo with opening filter', 'suspense, "what happens next" moments')
def _(c):
    d = c.opt('dur', 3.0); n = secs(d); x = np.linspace(0, 1, n); f0 = 196 * c.jit(2); y = np.zeros(n)
    for k, m in enumerate((1, 1.0595, 1.1225, 1.1892, 2.0)):
        trem = .55 + .45 * np.sin(2 * np.pi * phase(7 + 14 * x + k * .7, n) + k)
        y += saw(f0 * m * (1 + .06 * x ** 2) * (1 + .003 * np.sin(2 * np.pi * 5.5 * tt(n) + k)), n) * trem
    y = vfilt(y, 400 + 6000 * x ** 2, 'low', block=256)
    return verb(fade(y * (.15 + .85 * x ** 1.5), .2, .004), 'hall', .25)[:n + secs(.3)]
@snd('riser_short', 'riser', .45, 'short 0.7 s riser (noise + tone)', 'quick build into a pop/text hit')
def _(c):
    n = secs(.7); x = np.linspace(0, 1, n)
    y = rmsn(vfilt(c.pn(n), 600 * 12 ** x, 'band', .8)) + rmsn(sine(300 * 4 ** x, n)) * .4
    return fade(y * x ** 2, .02, .003)
@snd('riser_reverse_cymbal', 'riser', .5, 'reversed cymbal swell (modal cymbal synthesis reversed)', 'classic pre-hit swell, magic reveal lead-in')
def _(c): return fade(cymbal(c, c.opt('dur', 2.0) * 1.1)[::-1][-secs(c.opt('dur', 2.0)):], .05, .004)
@snd('riser_suck', 'riser', .5, 'reverse suck-in: big whoosh + hall, reversed', 'into black, before a chapter card')
def _(c): return verb(whoosh(c, .9, 250, 2600, .55, .9, .35, .3), 'hall', .6)[::-1]
@snd('riser_downer', 'riser', .45, 'downer: falling saw tone + falling noise, decaying', 'after a reveal, deflation, scene settles')
def _(c):
    d = c.opt('dur', 1.6); n = secs(d); x = np.linspace(0, 1, n)
    y = lp(saw(900 * c.jit(5) * np.exp(-x * 2.8), n), 3000) * .5 + rmsn(vfilt(c.pn(n), 5000 * np.exp(-x * 3) + 100, 'low')) * .5
    return y * (1 - x) ** 1.5 * att(n, .01)
@snd('riser_downer_sub', 'riser', .5, 'long sub downer with rumble', 'heavy aftermath, entering a cave, ominous fall')
def _(c):
    d = c.opt('dur', 2.5); n = secs(d); x = np.linspace(0, 1, n)
    return (sine(120 * c.jit(8) * np.exp(-x * 1.6 * c.jit(10)), n) * 1. + rmsn(vfilt(c.wn(n), 200 * (1 - x) + 50, 'low', order=4)) * .4) * (1 - x) ** 1.2 * att(n, .01)

# =====================================================================================  TRANSITIONS
@snd('trans_swipe', 'trans', .45, 'fast swipe: tiny whoosh + click', 'swipe cuts, carousel moves')
def _(c): return mix(whoosh(c, .2, 1500, 6500, .7, 1., .5), (nz(c.smp('ui/click', 4)) * .3, .14))
@snd('trans_wipe', 'trans', .45, 'soft wipe (lowpassed whoosh + paper slide)', 'wipe transitions, map paper slides')
def _(c): return mix(lp(whoosh(c, .45, 500, 2600, .5, 1., .3), 5000), (nz(c.smp('foley/cards', 6)) * .2, .05))
@snd('trans_page_turn', 'trans', .45, 'page turn (recorded) + air', 'storybook transitions, chapter pages')
def _(c): return mix(c.smp('foley/page_turn', 5), (whoosh(c, .35, 600, 3000, .5) * .05, .05))
@snd('trans_tape_stop', 'trans', .5, 'tape stop: chord decelerating to zero with closing filter', 'comedic halt, freeze-frame, "wait, what?"')
def _(c):
    n = secs(1.5); f = c.ch([110, 130.8, 146.8]) * c.jit(4); src = sum(saw(f * m, n) for m in (1, 1.26, 1.5, 2)) * .25
    src = lp(src, 3000) + lp(c.wn(n), 4000) * .05
    m = secs(.7 * c.jit(12)); rate = np.linspace(1, 0, m) ** c.u(1.2, 2.)
    y = varispeed(src, rate); return vfilt(y, 6000 * np.linspace(1, .05, len(y)) + 80, 'low')
@snd('trans_tape_rewind', 'trans', .45, 'tape rewind: rising chirps + warble', 'flashback, map-dive rewind, time travel')
def _(c):
    n = secs(1.4); x = np.linspace(0, 1, n); f = 400 + 3500 * x ** 1.5
    y = rmsn(vfilt(c.wn(n), f, 'band', .5)) + rmsn(sine(np.linspace(180, 1400, n) * (1 + .1 * np.sin(np.linspace(0, 90, n))), n)) * .3
    return y * (.2 + .8 * x ** 1.2) * np.hanning(n) ** .3
@snd('trans_record_scratch', 'trans', .5, 'vinyl record scratch (back-and-forth varispeed over a music-like source)', 'myth-buster stop, comedic interruption')
def _(c):
    n = secs(2.0); f = c.ch([220, 196, 247]); src = lp(sum(saw(f * m, n) for m in (1, 1.5, 2.01)) * .3 + c.wn(n) * .15, 4000)
    m = secs(.55); tq = tt(m); rate = 3.5 * np.sin(2 * np.pi * tq / .55 * 1.5) * np.hanning(m) + .3
    y = varispeed(src, rate, start=secs(.5)); y = bp(y, 250, 5000) + hp(c.wn(len(y)), 3000) * .03
    return y * np.hanning(len(y)) ** .3
@snd('trans_glitch_cut', 'trans', .45, 'glitch cut: stutter + bitcrush + click', 'hard cuts with digital glitch flavour')
def _(c): return mix(nz(REG['glitch_stutter']['fn'](c)), (click(c, 3000, .006) * .6, .35))
@snd('trans_zoom_in', 'trans', .5, 'zoom in: rising whoosh + rising tone + select blip on arrival', 'push-in on a map location')
def _(c):
    w = whoosh(c, .6, 300, 5000, .85, .9, .4, .1, mode='lin', tail=1.); n = len(w)
    tone = sine(220 * 4 ** np.linspace(0, 1, n), n) * np.linspace(0, 1, n) ** 2 * .15
    return mix(w + tone, (nz(c.smp('ui/select', 4)) * .25, n / SR * .9))
@snd('trans_zoom_out', 'trans', .5, 'zoom out: falling whoosh + falling tone', 'pull back to the wide map')
def _(c):
    n = secs(.7); x = np.linspace(0, 1, n)
    return (rmsn(vfilt(c.pn(n), 4500 * 0.06 ** x, 'band', .9)) + sine(900 * .25 ** x, n) * .15) * env_ar(n, .2, 1.5, 1.6)
@snd('trans_map_dive', 'trans', .55, 'map dive: long descending whoosh with sub swell', 'diving from globe/map to street level')
def _(c):
    n = secs(1.6); x = np.linspace(0, 1, n); e = env_ar(n, .7, 1.8, 1.5)
    return rmsn(vfilt(c.pn(n), 3000 * (250 / 3000) ** x, 'band', 1.)) * e + rmsn(lp(c.wn(n), 90, 4)) * .5 * e ** 1.5
@snd('trans_stinger', 'trans', .6, 'whoosh into a cinematic hit (hit at +0.45 s)', 'chapter cards, location title cards')
def _(c): return mix(whoosh(c, .5, 400, 3000, .9, .9, .4, .2, mode='lin', tail=.5) * .8, (nz(REG['impact_cinematic']['fn'](c)), .45))
@snd('trans_film_flicker', 'trans', .35, 'film projector clatter (24 fps pulses) + hiss', 'archive/old-film transitions, history flashback')
def _(c):
    d = c.opt('dur', 1.5); n = secs(d); ph = phase(24 * c.jit(2), n) % 1
    clat = bp(c.wn(n), 800, 4000) * np.exp(-ph * 20) * .8
    return (clat + hp(c.wn(n), 2000) * .08 + sine(48, n) * .1) * att(n, .05)
@snd('trans_pop_in', 'trans', .45, 'element pop-in: tiny rising whoosh + pop', 'stickers, labels, emoji popping into frame')
def _(c): return mix(whoosh(c, .16, 1000, 5000, .85, 1., .4, mode='lin', tail=.6) * .6, (nz(REG['ui_pop']['fn'](c)), .13))
@snd('trans_slide', 'trans', .45, 'card slide (recorded card slides + air)', 'lower-thirds, cards sliding in')
def _(c): return mix(c.smp('foley/cards', 6), (whoosh(c, .25, 800, 3500) * .05, 0))

# =====================================================================================  CARTOON
S('cartoon', 'cartoon_slide_up', 'cartoon/slide_up', .45, 'slide whistle up (recorded, Ben Burnes)', 'rising, jumping, eyebrow raise', 4)
S('cartoon', 'cartoon_slide_down', 'cartoon/slide_down', .45, 'slide whistle down (recorded)', 'falling, deflating, sad reaction', 4)
S('cartoon', 'cartoon_slide_wobble', 'cartoon/slide_wobble', .45, 'wobbly slide whistle', 'dizzy, drunk, wobbly motion', 4)
S('cartoon', 'cartoon_slide_bounce', 'cartoon/slide_bounce', .45, 'slide whistle up-and-down bounce', 'bouncing, yo-yo, hopping', 4)
S('cartoon', 'cartoon_slide_flutter', 'cartoon/slide_flutter', .45, 'fluttering slide whistle drop', 'leaf falling, paper floating down', 4)
S('cartoon', 'cartoon_slide_quick', 'cartoon/slide_quick', .4, 'quick slide-whistle squeak', 'blink-and-miss gags, sneaky moves', 4)
S('cartoon', 'cartoon_spring', 'cartoon/spring', .45, 'recorded spring twang (3 takes)', 'springs, jack-in-the-box, bounce', 6)
S('cartoon', 'cartoon_saw_wobble', 'cartoon/saw_wobble', .45, 'flexed pull-saw wobble (musical saw-like)', 'woozy, spooky-funny, jelly wobble', 5)
S('cartoon', 'cartoon_wop', 'cartoon/saw_wop', .4, 'saw "wop" flex', 'quick wobble accent, rubber-hose bend', 5)
S('cartoon', 'cartoon_plop', 'cartoon/plop', .45, 'viscous bottle plop', 'drops into liquid, goo, cartoon blobs', 5)
S('cartoon', 'cartoon_squish', 'cartoon/squish', .45, 'squishy mud/slime', 'stepping in mud, squeezing, gross-out gag', 6)
S('cartoon', 'cartoon_can_dent', 'cartoon/can_dent', .4, 'small can dent/flick', 'tiny dents, flicks, tin gags', 5)
@snd('cartoon_pop', 'cartoon', .5, 'cork/bottle pop (recorded) + synth blip sweetener', 'characters popping in, bubbles, ideas')
def _(c): x = nz(c.smp('cartoon/pop', 6)); return mix(x, (nz(REG['ui_pop']['fn'](c)) * .3, 0))
@snd('cartoon_boing', 'cartoon', .5, 'classic boing: recorded spring + vibrato sine jaw-harp layer', 'bounces, head bonks, springy jumps')
def _(c):
    n = secs(.7); x = np.linspace(0, 1, n); f = 180 * c.jit(8) * (1 + .9 * x) + 70 * np.sin(2 * np.pi * phase(11 * c.jit(10), n)) * (1 - x)
    harp = formant(saw(f, n), 'o', 1.3) * dec(n, .55) * att(n, .003)
    return mix(nz(harp) * .7, nz(c.smp('cartoon/spring', 6)) * .5)
@snd('cartoon_bonk', 'cartoon', .55, 'hollow head bonk: wood-block modes + melon knock + tiny pitch drop', 'head hits, coconut bonk, slapstick')
def _(c):
    n = secs(.35); f = 520 * c.jit(8); bend = 1 + .08 * np.exp(-tt(n) * 40)
    blk = sum(a * sine(f * r * bend, n) * dec(n, T) for r, a, T in [(1, 1, .12), (2.31, .45, .06), (3.9, .2, .03)])
    return mix(nz(ad(blk, mallet(c, 4000, .004) * .4)) * .8, nz(c.smp('impact/melon', 6)) * .35, (thump(c, 160, 80, .15, .07) * .3, 0))
@snd('cartoon_fall_whistle', 'cartoon', .45, 'falling bomb whistle (slow glide down + vibrato), optional far thud', 'Wile E. Coyote fall, object dropping from sky')
def _(c):
    d = c.opt('dur', 1.6); n = secs(d); x = np.linspace(0, 1, n); f = 2200 * c.jit(5) * (.2 ** x) * (1 + .012 * np.sin(2 * np.pi * 6 * tt(n)))
    w = (sine(f, n) + .2 * sine(f * 2, n)) * (.3 + .7 * x) * att(n, .05)
    return mix(w, (nz(_boom(c, 1.)) * .5 * c.opt('thud', 1), d)) if c.opt('thud', 1) else w
@snd('cartoon_zip', 'cartoon', .45, 'zip-out: fast rising whistle + swish', 'character dashes off screen')
def _(c):
    n = secs(.25); f = np.geomspace(500, 3500, n) * c.jit(6)
    return mix(sine(f, n) * env_ar(n, .7, 1, 1) * .5, whoosh(c, .25, 1200, 6000, .7, 1., .5))
@snd('cartoon_gallop', 'cartoon', .45, 'blop gallop: rapid pitched blops in triplets (dur)', 'cartoon run cycle, legs spinning')
def _(c):
    d = c.opt('dur', 1.2); out = np.zeros(secs(d + .2)); t = 0.; k = 0; f0 = c.u(220, 320)
    while t < d:
        n = secs(.05); f = f0 * (1.25 if k % 3 == 1 else 1) * c.jit(3); fr = f * (1 + .8 * np.exp(-tt(n) * 60))
        place(out, sine(fr, n) * dec(n, .035) * att(n, .001), t, .6 + .4 * (k % 3 == 0)); t += .07 if k % 3 < 2 else .12; k += 1
    return out
@snd('cartoon_tiptoe', 'cartoon', .4, 'xylophone tiptoe (modal bars, alternating notes, n steps)', 'sneaking, tiptoeing, secret moves')
def _(c):
    nst = int(c.opt('n', 6)); gap = c.opt('gap', .28); out = np.zeros(secs(nst * gap + .6)); notes = [c.ch([784, 880]), c.ch([659, 698])]
    for k in range(nst):
        f = notes[k % 2] * c.jit(.5); m = ad(modal([f, f * 3.93, f * 9.5], [.35, .1, .03], [1, .3, .08], secs(.5), c.r), mallet(c, 5000, .004) * .3)
        place(out, m, k * gap + c.u(0, .02), c.u(.7, 1))
    return out
@snd('cartoon_blink', 'cartoon', .4, 'xylophone blink (two quick high notes)', 'eye blinks, realisation, cute beat')
def _(c):
    f = c.ch([1318, 1568]) * c.jit(1)
    b = lambda ff: ad(modal([ff, ff * 3.93], [.2, .06], [1, .25], secs(.3), c.r), mallet(c, 6000, .003) * .2)
    return mix(b(f), (b(f * 1.335), .07))
@snd('cartoon_squeak', 'cartoon', .4, 'rubber squeak (fast FM glide)', 'rubber ducks, squeezed toys, tiny characters')
def _(c):
    n = secs(c.u(.12, .22)); f = np.linspace(1700, 2600, n) * c.jit(8)
    return sine(f + 120 * sine(f * .03 + 30, n), n) * np.hanning(n)
@snd('cartoon_honk', 'cartoon', .45, 'bulb horn honk (reed source + nasal formant, pitch scoop)', 'clown honk, nose squeeze, silly accent')
def _(c):
    n = secs(c.u(.22, .35)); f = 330 * c.jit(6) * (1 - .18 * np.exp(-tt(n) * 25))
    src = saw(f, n) + square(f, n, .3) * .5
    return formant(src, 'ae', 1.5) * env_ar(n, .08, 1, .8)
@snd('cartoon_splat', 'cartoon', .5, 'splat: squish + low thump', 'pie in face, falling into mud')
def _(c): return mix(nz(c.smp('cartoon/squish', 5)), (thump(c, 140, 60, .2, .1) * .6, 0), (nz(c.smp('nature/splash_small', 6)) * .25, 0))
@snd('cartoon_poof', 'cartoon', .45, 'smoke poof (lowpassed noise puff + air)', 'vanishing, magic puff, dust cloud')
def _(c):
    n = secs(.45); e = env_ar(n, .08, 1.2, 2)
    return (rmsn(lp(c.pn(n), 1200 * c.jit(15))) + rmsn(bp(c.wn(n), 2000, 6000)) * .3) * e
@snd('cartoon_ricochet', 'cartoon', .45, 'cartoon ricochet "pyeww" (descending whine + recorded ric)', 'bullets/stones bouncing off, deflected objects')
def _(c):
    n = secs(.55); f = np.geomspace(3200, 1300, n) * c.jit(6)
    return mix(sine(f, n) * dec(n, .5) * att(n, .002) * .5, nz(c.smp('battle/ricochet', 5)) * .5)
@snd('cartoon_tweet', 'cartoon', .4, 'birds circling a dizzy head (repeating chirp loop, dur)', 'after a bonk, dazed character')
def _(c):
    d = c.opt('dur', 1.6); out = np.zeros(secs(d + .2)); t = 0.; k = 0
    while t < d:
        place(out, bird_chirp(c, 3600 if k % 2 else 4200, .07, .3), t, .5 + .5 * np.sin(t * 7) ** 2); t += .12; k += 1
    return out
@snd('cartoon_gulp', 'cartoon', .45, 'gulp (falling resonant blip + throat click)', 'nervous swallow, eating whole')
def _(c):
    n = secs(.2); return mix(click(c, 1500, .008, .5) * .3, (formant(saw(np.linspace(260, 120, n) * c.jit(6), n), 'u', 1.) * dec(n, .12), .02))
@snd('cartoon_stretch', 'cartoon', .4, 'rubber stretch creak (rising stick-slip tone)', 'stretching limbs, pulling elastic')
def _(c):
    n = secs(.6); f = np.linspace(90, 260, n) * c.jit(8); src = square(f, n, .15)
    return bp(src, 400, 3000) * env_ar(n, .7, 1, 1)
@snd('cartoon_dizzy', 'cartoon', .4, 'woozy dizzy warble (descending vibrato tone)', 'spinning eyes, confusion')
def _(c):
    n = secs(1.2 * c.jit(8)); x = np.linspace(0, 1, n); f = 900 * c.jit(8) * .5 ** x * (1 + .08 * np.sin(2 * np.pi * phase((6 + 4 * x) * c.jit(15), n)))
    return (sine(f, n) + .3 * sine(f * 1.5, n)) * env_ar(n, .1, 1, 1.4) * .6
@snd('cartoon_sad_trombone', 'cartoon', .5, 'sad trombone "wah wah wah waaah" (brassy saw + wah filter)', 'fails, wrong guesses, deflated jokes')
def _(c):
    notes = [(293.7, .32), (277.2, .32), (261.6, .32), (246.9, 1.1)]; out = []; t = 0.
    for k, (f, d) in enumerate(notes):
        n = secs(d); vib = 1 + (.012 * np.sin(2 * np.pi * 5.5 * tt(n)) * np.minimum(1, tt(n) / .3) if k == 3 else 0)
        src = saw(f * c.jit(.5) * vib, n); wah = 400 + 1600 * np.sin(np.pi * np.minimum(1, tt(n) / min(d, .35))) ** 2
        out.append((vfilt(src, wah, 'low') * env_ar(n, .15, 1, .7), t)); t += d + .03
    return verb(mix(*out), 'room', .15)
@snd('cartoon_tada', 'cartoon', .45, 'ta-da! brassy two-chord fanfare', 'reveals of a solution, proud moments')
def _(c):
    def chord(fs, d):
        n = secs(d); return lp(sum(saw(f * c.jit(.4), n) for f in fs), 3500) * env_ar(n, .05, 1, 1.2)
    return verb(mix((chord([261.6, 329.6, 392], .15), 0), (chord([349.2, 440, 523.3, 698.5], .9), .17)), 'room', .2)

# =====================================================================================  FOLEY
S('foley', 'foley_cloth', 'foley/cloth', .35, 'cloth rustle (Kenney RPG Audio, 3 takes)', 'character movement, gestures, sitting down', 6)
S('foley', 'foley_leather', 'foley/leather', .35, 'leather handling', 'bags, belts, backpacks', 6)
S('foley', 'foley_book_flip', 'foley/book_flip', .4, 'book page flips', 'guidebook browsing', 5)
S('foley', 'foley_book_close', 'foley/book_close', .45, 'book close/place', 'closing the guidebook, end of chapter', 5)
S('foley', 'foley_page_turn', 'foley/page_turn', .4, 'single page turn', 'menu reading, map unfolding', 5)
S('foley', 'foley_riffle', 'foley/riffle', .4, 'riffle through pages', 'flip-book montage, searching', 5)
S('foley', 'foley_pen_write', 'foley/pen_write', .35, 'pen writing on paper', 'handwritten titles, notes, postcards', 4)
S('foley', 'foley_pencil', 'foley/pencil', .35, 'pencil scribble/lines', 'sketching maps, hand-drawn art', 4)
S('foley', 'foley_marker', 'foley/marker', .35, 'thick marker lines', 'map route drawing, underlines', 4)
S('foley', 'foley_pen_click', 'foley/pen_click', .35, 'pen cap / pencil click', 'start writing, small mechanical accent', 5)
S('foley', 'foley_paper_cut', 'foley/paper_cut', .4, 'paper cut', 'tickets, cut-out art', 5)
S('foley', 'foley_paper_flutter', 'foley/paper_flutter', .35, 'paper flutter', 'flyers, receipts in wind', 5)
S('foley', 'foley_paper', 'foley/paper', .35, 'paper handling/crumple', 'maps, tickets, wrapping', 5)
S('foley', 'foley_coins', 'foley/coins', .45, 'handful of coins (3 takes)', 'paying, tips, price beats', 5)
S('foley', 'foley_chips', 'foley/chips', .4, 'plastic chips stacking', 'counting, tokens, plastic clatter', 5)
S('foley', 'foley_cards', 'foley/cards', .35, 'card slide/place', 'tickets, cards dealt, menus', 6)
S('foley', 'foley_card_shuffle', 'foley/card_shuffle', .4, 'card shuffle/fan', 'shuffling options, quick montage', 4)
S('foley', 'foley_dice', 'foley/dice', .4, 'dice throw', 'random choice, games, chance', 5)
S('foley', 'foley_keys', 'foley/keys', .4, 'key ring jingle', 'homestay keys, motorbike keys', 5)
S('foley', 'foley_lock', 'foley/lock', .4, 'lock/latch open', 'doors, lockers, gates', 5)
S('foley', 'foley_door_open', 'foley/door_open', .45, 'door opening', 'entering rooms, shops', 4)
S('foley', 'foley_door_close', 'foley/door_close', .45, 'door closing', 'leaving rooms', 4)
S('foley', 'foley_creak', 'foley/creak', .4, 'wood creak', 'old houses, floorboards, boat planks', 5)
S('foley', 'foley_knife_draw', 'foley/knife_draw', .4, 'knife drawn from sheath', 'blades, kitchen knife reveal', 5)
S('foley', 'foley_can', 'foley/can', .4, 'can tab pluck / crush', 'soda can, beer can moments', 5)
S('foley', 'foley_scissors', 'foley/scissors', .4, 'scissors snip', 'cutting, ribbon, tailor shop', 5)
S('foley', 'foley_ratchet', 'foley/ratchet', .4, 'ratchet', 'tightening, mechanics, bike repair', 5)
S('foley', 'foley_click_mech', 'foley/click_mech', .35, 'small mechanical click', 'flashlight, cap, latch', 6)
S('foley', 'foley_drawer', 'foley/drawer', .4, 'drawer open/close', 'desk, kitchen drawers', 5)
S('foley', 'foley_tape', 'foley/tape', .4, 'tape pull', 'packing, taping posters', 5)
S('foley', 'foley_rummage', 'foley/rummage', .4, 'rummaging in a box', 'searching, packing a bag', 5)
S('foley', 'foley_plastic', 'foley/plastic', .35, 'crinkly plastic bag', 'market bags, snacks, packaging', 5)
S('foley', 'foley_rattle', 'foley/rattle', .4, 'bottle/pill rattle', 'shakers, rattles, maracas-like', 5)
S('foley', 'foley_hammer', 'foley/hammer', .45, 'hammer strike', 'building, workshop, crafts', 5)
S('foley', 'foley_tools', 'foley/tools', .4, 'tools handling', 'workshop, repair stalls', 5)
S('foley', 'foley_chain', 'foley/chain', .4, 'chain rattle', 'bike chain, anchors, gates', 5)
S('foley', 'foley_snap', 'foley/snap', .45, 'sharp snap', 'twig snap, breaking stick, finger snap-like', 5)
S('foley', 'foley_chair_roll', 'foley/chair_roll', .35, 'chair rolling', 'office, studio scenes', 4)
STEP_KEYS = {'concrete': 'foley/step_concrete', 'stone': 'foley/step_concrete', 'wood': 'foley/step_wood', 'grass': 'foley/step_grass',
             'carpet': 'foley/step_carpet', 'snow': 'foley/step_snow', 'wet': 'foley/step_wet', 'leather': 'foley/step_leather', 'dirt': 'foley/step_leather'}
for _surf in ('concrete', 'wood', 'grass', 'carpet', 'wet', 'dirt'):
    S('foley', f'foley_step_{_surf}', STEP_KEYS[_surf], .4, f'single footstep on {_surf}', f'one step on {_surf}; use foley_steps for walks', 6)
@snd('foley_steps', 'foley', .4, 'walk/run sequence: n steps, gap, surface=concrete|stone|wood|grass|carpet|snow|wet|dirt (no repeats)', 'characters walking/running, approach shots')
def _(c):
    nst = int(c.opt('n', 6)); gap = c.opt('gap', .45); key = STEP_KEYS.get(c.o.get('surface', 'concrete'), 'foley/step_concrete')
    nf = max(1, len(_files(key))); out = np.zeros(secs(nst * gap + .8)); last = -1
    for k in range(nst):
        i = int(c.r.integers(nf)); i = (i + 1) % nf if i == last and nf > 1 else i; last = i
        x = c.smp(key, 6, abs_i=i); g = (.75 if k % 2 else 1.) * c.u(.8, 1.)
        place(out, x, k * gap * c.jit(4) if k else 0, g)
    return out
@snd('foley_knock', 'foley', .45, 'door knock pattern (n knocks)', 'knocking at homestay door')
def _(c):
    k_ = int(c.opt('n', 3)); out = np.zeros(secs(k_ * .2 + .6))
    for k in range(k_): place(out, ad(nz(c.smp('impact/wood_light', 6, idx=k)), thump(c, 200, 110, .08, .04) * .4), k * .18 * c.jit(8), c.u(.75, 1))
    return verb(out, 'room', .15)
@snd('foley_coin_drop', 'foley', .45, 'single coin drop: ring + spinning wobble accelerating to rest (modal)', 'a tip on the counter, lucky coin, price punchline')
def _(c):
    n = secs(1.6); f = 5200 * c.jit(6); out = np.zeros(n); t = 0.; gap = .16; g = 1.
    while t < 1.4 and gap > .012:
        place(out, ad(modal([f, f * 1.47, f * 2.1], [.25, .15, .08], [1, .6, .3], secs(.3), c.r), click(c, 7000, .002) * .4), t, g)
        t += gap; gap *= .82; g *= .93
    return out
@snd('foley_zipper', 'foley', .35, 'zipper pull (accelerating micro-clicks + noise)', 'bags, jackets, backpacks')
def _(c):
    d = c.u(.35, .55); n = secs(d); out = bp(c.wn(n), 1500, 6000) * .2; t = 0.; rate = 60
    while t < d:
        place(out, click(c, 3500 * c.jit(10), .003), t, c.u(.4, 1)); t += 1 / rate; rate *= 1.03
    return out * env_ar(n, .2, 1, .5)
@snd('foley_camera', 'foley', .45, 'camera shutter (synth) + recorded click', 'photo snaps, tourist cameras')
def _(c): return mix(nz(REG['ui_shutter']['fn'](c)), nz(c.smp('foley/click_mech', 5)) * .3)
@snd('foley_clap', 'foley', .45, 'single hand clap (band-passed noise burst + palm thump)', 'one clap, "let\'s go!", rhythm accents')
def _(c):
    n = secs(.09); return mix(bp(c.wn(n), 900 * c.jit(10), 3500) * dec(n, .03), (thump(c, 220, 140, .03, .015) * .3, 0))
@snd('foley_bag_rustle', 'foley', .35, 'plastic bag rustle (recorded)', 'market shopping, snacks')
def _(c): return c.smp('foley/plastic', 6)

# =====================================================================================  FOOD
S('food', 'food_knife_slice', 'food/knife_slice', .45, 'knife slice', 'slicing herbs, mango, meat', 6)
S('food', 'food_knife_scrape', 'food/knife_scrape', .4, 'knife scrape on board', 'scraping chopped ingredients into wok', 5)
S('food', 'food_dishes', 'food/dishes', .4, 'dishes clatter', 'restaurant, washing up, quán cơm', 5)
S('food', 'food_bottle_plop', 'food/bottle_plop', .4, 'bottle opening plop', 'opening sauce/fish-sauce bottles', 5)
S('food', 'food_melon', 'food/melon', .4, 'juicy fruit tear/squish', 'cutting fruit, jackfruit, durian', 5)
@snd('food_chop', 'food', .45, 'knife chop on wooden board + board thump', 'herbs, garlic, chopping montage')
def _(c): return mix(nz(c.smp('food/chop', 6)), (thump(c, 180, 100, .08, .04) * .3, 0))
@snd('food_chop_fast', 'food', .45, 'rapid chopping sequence (n chops)', 'kitchen montage, street-food prep')
def _(c):
    k_ = int(c.opt('n', 8)); gap = c.opt('gap', .14); out = np.zeros(secs(k_ * gap + .5))
    for k in range(k_): place(out, ad(nz(c.smp('food/chop', 8, idx=k)), thump(c, 180, 100, .06, .03) * .25), k * gap * c.jit(6), c.u(.7, 1))
    return out
@snd('food_pot', 'food', .45, 'metal pot handling', 'pots, lids, kitchen action', )
def _(c): return verb(c.smp('food/pot', 5), 'kitchen', .1)
@snd('food_wok_sizzle', 'food', .4, 'wok sizzle: dense granular crackle + hiss with swells (dur)', 'stir-fry, street food, bánh xèo pouring')
def _(c):
    d = c.opt('dur', 3.0); n = secs(d); t = tt(n); sw = .7 + .3 * np.sin(2 * np.pi * .7 * t + c.u(0, 6))
    hiss = rmsn(hp(c.pn(n), 3500)) * .6
    imp = (c.r.random(n) < 900 / SR) * c.r.uniform(.2, 1, n); cr = hp(fftconvolve(imp, np.exp(-np.arange(60) / 8) * c.wn(60))[:n], 2500)
    pops = events(c, n, 6, lambda: bp(c.wn(secs(.01)), 800, 3000) * dec(secs(.01), .004) * c.u(.5, 1.5))
    return (hiss + rmsn(cr) * .9 + pops * .4) * sw * att(n, .08)
@snd('food_wok_toss', 'food', .5, 'wok toss: metal scrape + sizzle burst + whoosh', 'flame-wok moments, chef action')
def _(c):
    sc = nz(c.smp('food/knife_scrape', 5)) * .4; s = nz(REG['food_wok_sizzle']['fn'](Ctx('food_wok_sizzle', c.var, {'dur': 1.2})))
    s *= env_ar(len(s), .15, 1, 1.5)
    return mix(sc, (s * .8, .1), (whoosh(c, .4, 300, 2000) * .3, .05), (nz(c.smp('food/pot', 5)) * .3, 0))
@snd('food_pour_tea', 'food', .45, 'pouring tea: resonant band rising as the cup fills + bubbles', 'trà đá, tea ceremony, pouring drinks')
def _(c):
    d = c.opt('dur', 1.6); n = secs(d); x = np.linspace(0, 1, n); f = (550 + 900 * x ** .7) * c.jit(6)
    stream = rmsn(vfilt(c.pn(n), f, 'band', .35)) * (.7 + .3 * np.sin(2 * np.pi * phase(9, n)) ** 2)
    bub = events(c, n, 18, lambda: sine(np.linspace(c.u(500, 1300), c.u(1500, 2500), secs(.02)), secs(.02)) * np.hanning(secs(.02)))
    return fade(stream + bub * .3, .08, .25)
@snd('food_pour_beer', 'food', .45, 'pouring beer: glug pour + fizz tail', 'bia hơi street corner, cheers moments')
def _(c):
    p = nz(REG['food_pour_tea']['fn'](Ctx('food_pour_tea', c.var, {'dur': 1.3}))); n = secs(2.2)
    fz = hp(c.wn(n), 4000) * (c.r.random(n) > .7) * dec(n, 2.) * .3
    return mix(lp(p, 3000) * .9, (fz, .6))
@snd('food_boil_broth', 'food', .35, 'simmering broth: recorded boil + low synthetic blops (dur)', 'phở pot, hotpot, kitchen bed')
def _(c):
    d = c.opt('dur', 4.); n = secs(d); src = nz(c.smp('food/boil_loop', 4))
    rec = np.tile(src, n // len(src) + 1)[:n] if len(src) > 100 else np.zeros(n)
    bl = events(c, n, 9, lambda: sine(np.linspace(c.u(150, 300), c.u(400, 700), secs(.05)), secs(.05)) * np.hanning(secs(.05)))
    return rmsn(rec, .2) + bl * .25 + rmsn(lp(c.pn(n), 300), .05)
@snd('food_bubble_pot', 'food', .4, 'thick bubbling blops (lowpassed chirps)', 'chè, sauces, mud pots')
def _(c): n = secs(c.opt('dur', 2.)); return lp(events(c, n, 7, lambda: sine(np.linspace(c.u(120, 220), c.u(300, 550), secs(.08)), secs(.08)) * np.hanning(secs(.08)) ** 2), 1500)
@snd('food_chopsticks', 'food', .4, 'chopsticks tap/click pair (small wooden rods, modal)', 'eating noodles, picking up food')
def _(c):
    def tick(): f = 2300 * c.jit(10); n = secs(.06); return ad(modal([f, f * 2.7, f * 5.2], [.04, .02, .01], [1, .5, .2], n, c.r), click(c, 5000, .002) * .3)
    return mix((tick(), 0), (tick() * .8, c.u(.05, .12)), (tick() * .6, c.u(.25, .35)) if c.r.random() > .5 else (np.zeros(1), 0))
@snd('food_cup_clink', 'food', .45, 'glass/cup clink (recorded, 3 takes)', 'cheers "Một hai ba dzô!", glasses touching')
def _(c): return c.smp('food/glass_clink', 6)
@snd('food_bowl_set', 'food', .45, 'ceramic bowl set down (modal porcelain + table thud)', 'phở bowl placed, rice bowls')
def _(c):
    f = 1250 * c.jit(6); n = secs(.8)
    return mix(modal([f, f * 2.18, f * 3.6, f * 5.1], [.6, .35, .2, .1], [1, .6, .3, .15], n, c.r) * .5, (thump(c, 160, 90, .1, .05) * .6, 0), (lp(c.wn(secs(.02)), 3000) * .3, 0))
@snd('food_slurp', 'food', .45, 'noodle slurp: sucked noise with rising band + wet clicks', 'phở / bún slurping, eating reactions')
def _(c):
    d = c.u(.5, .8); n = secs(d); x = np.linspace(0, 1, n)
    s = rmsn(vfilt(c.wn(n), 700 + 1900 * x, 'band', .7)) * env_ar(n, .6, 1.2, .6) * (.6 + .4 * (c.r.random(n // 441 + 1).repeat(441)[:n] > .3))
    wet = events(c, n, 12, lambda: click(c, c.u(1500, 4000), .006, .5))
    return s + wet * .4
@snd('food_crunch', 'food', .45, 'crispy crunch (bánh mì crust / spring roll): granular crackle bursts', 'biting crispy food')
def _(c):
    k_ = int(c.opt('n', 2)); out = np.zeros(secs(k_ * .35 + .3))
    for k in range(k_):
        n = secs(c.u(.12, .2)); x = np.zeros(n); imp = (c.r.random(n) < .02) * c.r.uniform(.2, 1, n)
        x = fftconvolve(imp, c.wn(80) * np.exp(-np.arange(80) / 15))[:n]
        place(out, ad(bp(x, 900, 7000) * env_ar(n, .1, 1, 1), thump(c, 150, 80, .05, .03) * .2), k * .33 + c.u(0, .04))
    return out
@snd('food_egg_crack', 'food', .45, 'egg crack: shell micro-cracks + shell rattle + drip', 'cooking, bánh mì ốp la, egg coffee')
def _(c):
    out = np.zeros(secs(.45))
    for t, g in [(0, 1), (.018, .7), (.05, .5), (.075, .35)]: place(out, hp(c.wn(secs(.012)), 1800) * dec(secs(.012), .004) * g, t * c.jit(10))
    place(out, bp(c.wn(secs(.09)), 2500, 7000) * dec(secs(.09), .03) * .35, .01)
    place(out, sine(np.linspace(900, 380, secs(.07)), secs(.07)) * dec(secs(.07), .03) * .4, .3)
    return out
@snd('food_fizz_open', 'food', .45, 'can/bottle open + fizz', 'cold drinks, beer opening')
def _(c):
    n = secs(1.5); fz = hp(c.wn(n), 3500) * (c.r.random(n) > .6) * dec(n, 1.3) * .35
    return mix(nz(c.smp('foley/can', 5)), (fz, .05), (hp(c.wn(secs(.25)), 2000) * dec(secs(.25), .15) * .5, .02))
@snd('food_ice_clink', 'food', .45, 'ice cubes in a glass (random modal clinks + glass ring)', 'cà phê sữa đá, iced tea, cold drinks')
def _(c):
    out = np.zeros(secs(1.)); fg = 1800 * c.jit(5)
    for k in range(int(c.u(4, 8))):
        f = c.u(2500, 6500); n = secs(.25)
        place(out, ad(modal([f, f * 1.6, fg], [.08, .05, .4], [1, .4, .3], n, c.r), click(c, 6000, .002) * .3), c.u(0, .5), c.u(.3, 1))
    return out
@snd('food_spoon_stir', 'food', .45, 'spoon stirring in a glass (rhythmic clinks)', 'stirring cà phê sữa, condensed milk')
def _(c):
    d = c.opt('dur', 1.6); out = np.zeros(secs(d + .6)); t = 0.; f = 3100 * c.jit(5)
    while t < d:
        place(out, ad(modal([f, f * 1.71, f * 2.53], [.3, .2, .1], [1, .5, .3], secs(.4), c.r), click(c, 6000, .002) * .3), t, c.u(.3, .8)); t += c.u(.18, .26)
    return out + pad(bp(c.wn(secs(d)), 1000, 4000) * .03, len(out))
@snd('food_coffee_drip', 'food', .4, 'phin filter drips (pitched plinks, slow, dur)', 'Vietnamese coffee brewing, quiet café beat')
def _(c):
    d = c.opt('dur', 3.); n = secs(d)
    def drip():
        m = secs(.18); f = c.u(700, 1300) * (1 + 1.5 * np.exp(-tt(m) * 45)); return sine(f, m) * dec(m, .06) * att(m, .002)
    return events(c, n, c.opt('rate', 2.2), drip)

# =====================================================================================  VEHICLE
@snd('vehicle_moto_idle', 'vehicle', .4, 'motorbike idle: synthetic single-cylinder putt + recorded engine layer (dur)', 'parked Honda Cub/Wave, waiting at lights')
def _(c):
    d = c.opt('dur', 4.); n = secs(d); rpm = c.opt('rpm', 1500.) * c.jit(6) * (1 + .03 * np.sin(2 * np.pi * .7 * tt(n)))
    syn = lp(engine(c, rpm, n, pipe=230 * c.jit(8), mech=.05), 3200)
    rec = nz(c.smp('vehicle/motorbike_loop', 4)); rec = repitch(rec, .55)
    rec = np.tile(rec, n // max(1, len(rec)) + 1)[:n] if len(rec) > 100 else np.zeros(n)
    return rmsn(syn) + rmsn(lp(rec, 2000)) * .35
@snd('vehicle_moto_rev', 'vehicle', .5, 'motorbike rev: rpm 1500->6500->1800, synthetic + recorded engine', 'revving before take-off, Hà Giang loop bravado')
def _(c):
    n = secs(2.2); x = np.linspace(0, 1, n); rpm = 1500 + 5000 * np.sin(np.pi * np.clip(x / .75, 0, 1)) ** 1.5 * c.jit(8)
    syn = engine(c, rpm, n, pipe=240 * c.jit(8))
    rec = c.smp('vehicle/motorbike_loop', 3); rec = np.tile(rec, n // max(1, len(rec)) + 2) if len(rec) > 100 else np.zeros(n * 2)
    rv = varispeed(rec, .6 + 1.2 * (rpm - 1500) / 5000)[:n]
    return rmsn(syn) * (.6 + .4 * (rpm / 6500)) + rmsn(pad(rv, n)) * .4 * (rpm / 6500)
@snd('vehicle_moto_pass', 'vehicle', .5, 'motorbike pass-by with doppler, distance filtering (v, d0 opts)', 'scooters passing camera, street scenes')
def _(c):
    n = secs(c.opt('dur', 2.4)); m = int(n * 1.4); rpm = c.opt('rpm', 4200.) * c.jit(10)
    src = rmsn(engine(c, rpm, m, pipe=250 * c.jit(10))) + rmsn(bp(c.wn(m), 400, 3000)) * .25
    y, _ = doppler(src, n, v=c.opt('v', 14.) * c.jit(15), d0=c.opt('d0', 2.5)); return y
@snd('vehicle_moto_start', 'vehicle', .5, 'kick-start: two mechanical clunks, crank, catch, settle to idle', 'starting the bike at the homestay, journey begins')
def _(c):
    n = secs(2.8); out = np.zeros(n)
    for t in (0, .55):
        place(out, ad(nz(c.smp('impact/metal_light', 6)) * .4, thump(c, 120, 60, .15, .08) * .5), t)
        place(out, engine(c, np.linspace(300, 600, secs(.35)), secs(.35), pipe=200) * .4, t + .05)
    m = secs(1.8); rpm = 1500 + 2500 * np.exp(-tt(m) * 3) * att(m, .08)
    place(out, rmsn(engine(c, rpm, m, pipe=230)) * fade(np.ones(m), .05, .4), 1.0)
    return out
@snd('vehicle_moto_horn', 'vehicle', .5, 'scooter horn "beep-beep" (buzzy electric horn ~420 Hz)', 'Vietnamese traffic honks, friendly warnings')
def _(c):
    f = c.u(390, 480); k_ = int(c.opt('n', c.ch([1, 2, 2, 3]))); out = []
    for k in range(k_):
        n = secs(c.u(.12, .22)); out.append((fade(horn_tone(c, f * c.jit(.5), n) + horn_tone(c, f * 1.26, n) * .5, .005, .02), k * c.u(.2, .28)))
    return mix(*out)
@snd('vehicle_moto_horn_long', 'vehicle', .5, 'long scooter horn blast', 'annoyed driver, traffic jam')
def _(c): n = secs(c.u(.7, 1.1)); f = c.u(400, 470); return fade(horn_tone(c, f, n) + horn_tone(c, f * 1.26, n) * .5, .01, .06)
@snd('vehicle_car_horn', 'vehicle', .5, 'car horn (dual-tone)', 'taxis, Grab cars')
def _(c): n = secs(c.u(.3, .5)); f = 330 * c.jit(5); return fade(horn_tone(c, f, n, .4) + horn_tone(c, f * 1.26, n, .4) * .8, .01, .04)
@snd('vehicle_bus_horn', 'vehicle', .55, 'bus/truck air horn (low dual tone)', 'sleeper bus, trucks on mountain passes')
def _(c): n = secs(c.u(.6, .9)); return fade(horn_tone(c, 196 * c.jit(2), n, .3) + horn_tone(c, 233, n, .3) * .8, .02, .1)
@snd('vehicle_bus_brake', 'vehicle', .45, 'air-brake hiss "psssh"', 'bus stops, arrivals')
def _(c):
    n = secs(c.u(.8, 1.1)); return (rmsn(hp(c.wn(n), 2500)) + rmsn(bp(c.wn(n), 900, 2000)) * .5) * dec(n, .9) * att(n, .015)
@snd('vehicle_cyclo_bell', 'vehicle', .45, 'cyclo / bicycle thumb-bell trill "ring-ring" (modal bell, fast restrikes)', 'xích lô rides, Hội An bicycles')
def _(c):
    f = 2950 * c.jit(3); out = np.zeros(secs(1.4))
    for b in range(int(c.opt('n', 2))):
        for k in range(10):
            place(out, modal([f, f * 1.5, f * 2.3], [.5, .3, .15], [1, .5, .25], secs(.6), c.r), b * .45 + k * .028, .8 - k * .05)
    return out
@snd('vehicle_bike_bell', 'vehicle', .4, 'single bicycle bell ding-ding', 'bicycles, gentle street accent')
def _(c):
    f = 3300 * c.jit(3); b = lambda: ad(modal([f, f * 1.49, f * 2.4], [.7, .4, .2], [1, .5, .25], secs(.8), c.r), click(c, 6000, .002) * .2)
    return mix((b(), 0), (b() * .8, .15))
@snd('vehicle_train_horn', 'vehicle', .55, 'diesel train horn (chord, long)', 'Reunification Express, Hà Nội train street')
def _(c):
    n = secs(c.opt('dur', 1.6)); fs = [311 * c.jit(1), 370, 466]
    return verb(fade(sum(horn_tone(c, f, n, .5) for f in fs), .05, .25), 'outdoor', .25)
@snd('vehicle_train_pass', 'vehicle', .5, 'train pass: rumble + wheel clacks + doppler-ish swell', 'train street, railway crossings')
def _(c):
    d = c.opt('dur', 4.); n = secs(d); t = tt(n); g = np.exp(-((t - d / 2) / (d / 3.5)) ** 2)
    clk = np.zeros(n); k = 0.
    while k < d:
        place(clk, bp(c.wn(secs(.04)), 600, 3000) * dec(secs(.04), .015), k); place(clk, bp(c.wn(secs(.04)), 600, 3000) * dec(secs(.04), .015) * .7, k + .09); k += .42
    return (rmsn(lp(c.pn(n), 150)) + rmsn(clk) * .7 + rmsn(bp(c.pn(n), 300, 1500)) * .3 + rmsn(hp(c.wn(n), 4000)) * .1) * g
@snd('vehicle_boat_engine', 'vehicle', .4, 'longtail / river boat diesel putt-putt (slow single cylinder) + water slap (dur)', 'Mekong boats, Ninh Bình sampans with motor, Hạ Long tenders')
def _(c):
    d = c.opt('dur', 4.); n = secs(d); rpm = c.opt('rpm', 800.) * c.jit(8) * (1 + .04 * np.sin(2 * np.pi * .4 * tt(n)))
    eng = engine(c, rpm, n, pipe=150 * c.jit(8), rough=.35, mech=.3, kernel_ms=60)
    water = rmsn(lp(c.pn(n), 700)) * (.6 + .4 * np.sin(2 * np.pi * .9 * tt(n)) ** 2)
    return rmsn(eng) + water * .35
S('vehicle', 'vehicle_skid', 'vehicle/skid', .45, 'tyre skid (Kenney racing)', 'sudden stops, near-misses', 5)
@snd('vehicle_crash', 'vehicle', .55, 'vehicle crash: recorded impact + glass + metal debris', 'comic crash, accident gag (keep it light)')
def _(c): return mix(nz(c.smp('vehicle/crash', 4)), (nz(c.smp('battle/glass_break', 5)) * .4, .05), (nz(c.smp('battle/metal_fall', 5)) * .3, .15))

# =====================================================================================  NATURE
S('nature', 'nature_splash', 'nature/splash', .5, 'water splash (3 takes)', 'jumping into water, paddles, fish', 6)
S('nature', 'nature_splash_small', 'nature/splash_small', .45, 'small splash', 'pebbles, drops into ponds', 6)
S('nature', 'nature_bubble', 'nature/bubble', .4, 'underwater bubbles', 'snorkelling, fish tanks, diving', 6)
S('nature', 'nature_stones', 'nature/stones', .45, 'stones / pebbles tumbling', 'rocky paths, karst, landslide gag', 5)
S('nature', 'nature_mud', 'nature/mud', .4, 'mud squelch', 'rice paddies, rainy trails', 6)
@snd('nature_thunder', 'nature', .6, 'thunder: recorded clap + synthetic crack and long rumble', 'storms, monsoon arrival, dramatic weather')
def _(c):
    d = 4.; n = secs(d); t = tt(n); r_ = lp(c.wn(n), 160) * 2 + bp(c.wn(n), 200, 900) * .6
    e = np.exp(-t * 1.1) * att(n, .04) * (1 + .6 * np.sin(2 * np.pi * 3.3 * t) * np.exp(-t * 2)); crack = hp(c.wn(n), 2500) * np.exp(-t * 18) * .8
    return mix(rmsn(r_ * e + crack), nz(c.smp('nature/thunder', 5)) * .5)
@snd('nature_thunder_far', 'nature', .45, 'distant thunder rumble (lowpassed, no crack)', 'approaching storm, ominous mood')
def _(c):
    n = secs(4.); t = tt(n); return lp(c.pn(n), 220, 4) * np.exp(-((t - 1.2) / 1.1) ** 2) * (1 + .5 * np.sin(2 * np.pi * 1.7 * t))
@snd('nature_rain_burst', 'nature', .45, 'rain burst: shower building in over 1.2 s (recorded rain + synth hiss)', 'sudden downpour beats')
def _(c):
    n = secs(3.); src = nz(c.smp('nature/rain_loop', 3)); rec = pad(np.tile(src, 2), n) if len(src) > 100 else np.zeros(n)
    return (rmsn(rec) + rmsn(hp(c.wn(n), 1500)) * .4) * np.minimum(1, tt(n) / 1.2) * fade(np.ones(n), .01, .6)
@snd('nature_drip', 'nature', .4, 'single water drip "plink"', 'caves, leaks, quiet moments')
def _(c):
    n = secs(.25); f = c.u(800, 1500) * (1 + 2 * np.exp(-tt(n) * 40)); return sine(f, n) * dec(n, .08) * att(n, .002)
@snd('nature_wave_crash', 'nature', .5, 'single wave breaking on the shore (swell, crash, foam hiss)', 'beach shots, Mũi Né, Phú Quốc')
def _(c):
    n = secs(4.); t = tt(n); sw = np.exp(-((t - 1.3) / .7) ** 2); foam = np.exp(-((t - 2.2) / 1.) ** 2)
    return rmsn(vfilt(c.pn(n), 300 + 2500 * sw, 'low', block=256)) * (sw + .4 * foam) + rmsn(hp(c.wn(n), 3000)) * foam * .3
@snd('nature_wind_gust', 'nature', .4, 'wind gust (moving band-pass noise)', 'mountain passes, Mã Pí Lèng, open plains')
def _(c):
    n = secs(c.opt('dur', 3.)); x = np.linspace(0, 1, n); e = np.sin(np.pi * x) ** 1.5
    return rmsn(vfilt(c.pn(n), 300 + 700 * e + 150 * np.sin(2 * np.pi * phase(.6, n)), 'band', .7, block=256)) * e
@snd('nature_leaves', 'nature', .35, 'leaves rustle (granular high noise)', 'forest, bamboo groves, tree shake')
def _(c):
    n = secs(c.opt('dur', 2.)); g = lp(np.abs(c.r.standard_normal(n // 441 + 1)).repeat(441)[:n], 20)
    return hp(c.wn(n), 2500) * g * np.sin(np.pi * np.linspace(0, 1, n)) ** .5
@snd('nature_bird_chirp', 'nature', .35, 'small bird chirps (2-4 quick FM chirps)', 'morning, gardens, cafés')
def _(c):
    out = []; f = c.u(3000, 5000)
    for k in range(int(c.u(2, 5))): out.append((bird_chirp(c, f, c.u(.04, .09), c.u(.2, .6)), k * c.u(.08, .14)))
    return mix(*out)
@snd('nature_bird_song', 'nature', .35, 'songbird phrase (whistled notes with glides, bulbul-like)', 'countryside mornings, temples')
def _(c):
    out = []; t = 0.; base = c.u(1800, 2600)
    for k in range(int(c.u(4, 7))):
        n = secs(c.u(.07, .18)); f0 = base * c.ch([1, 1.25, 1.5, 1.33, .9]); f1 = f0 * c.u(.8, 1.3)
        out.append((sine(np.linspace(f0, f1, n), n) * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.2, t)); t += n / SR + c.u(.02, .08)
    return verb(mix(*out), 'outdoor', .2)
@snd('nature_koel', 'nature', .35, 'koel "ko-el" call (chim tu hú), rising repeated two-note whistle', 'Vietnamese summer countryside, nostalgia')
def _(c):
    out = []; f = c.u(700, 900)
    for k in range(int(c.opt('n', 3))):
        g = 1 + k * .08
        for j, (ff, d) in enumerate([(f * g, .16), (f * g * 1.3, .32)]):
            n = secs(d); fr = np.linspace(ff, ff * 1.05, n)
            out.append((formant(saw(fr, n) * .3 + sine(fr, n), 'u', 1.6) * env_ar(n, .2, 1.5, 1), k * .75 + j * .2))
    return verb(mix(*out), 'valley', .3)
@snd('nature_rooster', 'nature', .45, 'rooster crow "cock-a-doodle-doo" (formant synthesis, harsh)', 'village dawn, homestay mornings')
def _(c):
    segs = [(.12, 520, 560, 'o'), (.09, 600, 640, 'u'), (.13, 700, 760, 'o'), (.7, 780, 600, 'o')]; out = []; t = 0.; s = c.jit(6)
    for d, f0, f1, v in segs:
        n = secs(d); f = np.linspace(f0, f1, n) * s
        out.append((vowel_voice(c, f, n, [v, 'a'] if d > .5 else [v], .25, 1.9, rough=.5) * env_ar(n, .15, 1, 1.2 if d > .5 else .6), t)); t += d + .015
    return verb(mix(*out), 'outdoor', .25)
@snd('nature_gecko', 'nature', .4, 'tokay gecko call "tắc-kè" (rattle + repeated two-syllable calls)', 'night in the village, jungle lodge, humour beat')
def _(c):
    out = [(events(c, secs(.4), 40, lambda: click(c, 1500, .006, .5)) * .3, 0)]; t = .5
    for k in range(int(c.opt('n', 4))):
        for j, (d, v, f0, f1) in enumerate([(.11, 'o', 260, 280), (.24, 'e', 300, 210)]):
            n = secs(d); out.append((vowel_voice(c, np.linspace(f0, f1, n) * c.jit(3), n, [v], .3, 1.4, rough=.8) * env_ar(n, .2, 1, .8), t + j * .14))
        t += c.u(.75, .95)
    return verb(mix(*out), 'outdoor', .2)
@snd('nature_frog', 'nature', .35, 'frog croak (pulsed glottal croaks through formants)', 'rice fields at night, rainy season')
def _(c):
    out = []; f0 = c.u(150, 450); t = 0.
    for k in range(int(c.u(2, 4))):
        n = secs(c.u(.12, .25)); pr = c.u(18, 35); g = (np.sin(2 * np.pi * pr * tt(n)) > .2).astype(float)
        out.append((formant(glottal(c, f0, n, .1) * lp(g, 300), c.ch(['o', 'u', 'a']), f0 / 200) * env_ar(n, .2, 1, 1), t)); t += n / SR + c.u(.1, .3)
    return mix(*out)
@snd('nature_cricket', 'nature', .3, 'single cricket chirping (4.5 kHz pulsed carrier)', 'night, quiet pause, awkward silence gag')
def _(c):
    d = c.opt('dur', 2.); n = secs(d); f = c.u(4200, 4900); ph = phase(c.u(1.2, 1.8), n) % 1
    pulses = ((np.sin(2 * np.pi * 30 * tt(n)) > 0) & (ph < .12)).astype(float)
    return sine(f, n) * lp(pulses, 600)
@snd('nature_cicada', 'nature', .35, 'cicada burst: buzzing AM noise swelling and fading (ve sầu)', 'summer heat, Huế afternoons')
def _(c):
    n = secs(c.opt('dur', 4.)); x = np.linspace(0, 1, n); e = np.sin(np.pi * x) ** 2
    am = .5 + .5 * np.sin(2 * np.pi * phase(c.u(130, 200), n))
    return bp(c.wn(n), 4500 * c.jit(10), 7500) * am * e
@snd('nature_buffalo', 'nature', .4, 'water buffalo low moo (formant u->o, breathy)', 'rice paddy scenes, countryside')
def _(c):
    n = secs(c.u(1.3, 1.8)); f = np.linspace(115, 92, n) * c.jit(5)
    return verb(vowel_voice(c, f, n, ['u', 'o', 'u'], .3, .8, rough=.4) * env_ar(n, .25, 1.2, 1.5), 'outdoor', .2)
@snd('nature_dog_far', 'nature', .3, 'distant dog barks (two barks, outdoor slap)', 'village nights, alley ambience')
def _(c):
    out = []
    for k in range(int(c.u(1, 3))):
        n = secs(.13); out.append((vowel_voice(c, np.linspace(380, 260, n) * c.jit(5), n, ['a'], .3, 1.3, rough=.6) * env_ar(n, .1, 1, 1), k * c.u(.25, .4)))
    return verb(lp(mix(*out), 2500), 'outdoor', .35)

# =====================================================================================  VIETNAMESE CULTURAL
def _bell_small(c, f, T=1.2):
    return modal([f, f * 2.32, f * 4.25, f * 6.63, f * 9.38], [T, T * .6, T * .35, T * .2, T * .1], [1, .6, .35, .2, .1], secs(T * 1.2), c.r)
@snd('vn_temple_bell', 'vn', .55, 'great bronze temple bell (chuông chùa) struck by a wooden log: doublet partials beat, long hum', 'pagoda establishing shots, dawn at a temple, solemn moments')
def _(c):
    d = c.opt('dur', 7.); n = secs(d); f0 = c.opt('f0', 98.) * c.jit(3)
    rat = [.5, 1., 1.19, 1.5, 2., 2.52, 2.98, 3.6, 4.4, 5.3]; amp = [.6, 1., .55, .45, .4, .3, .22, .15, .1, .06]
    fr, T, A = [], [], []
    for r_, a in zip(rat, amp):
        for det in (-.35, .35):
            fr.append(f0 * r_ + det * (1 + r_)); T.append(min(d, 14 / (1 + r_ * .9))); A.append(a * .5)
    body = modal(fr, T, A, n, c.r)
    strike = ad(lp(c.wn(secs(.03)), 900) * np.hanning(secs(.03)) * .5, thump(c, 120, 70, .1, .05) * .4)
    return verb(mix(body, strike), 'temple', .3)
@snd('vn_bell_small', 'vn', .45, 'small temple hand-bell (chuông gia trì) - bright, ringing', 'ritual moments, incense offering, transitions')
def _(c): return verb(mix(_bell_small(c, 1180 * c.jit(3), 1.6), (click(c, 6000, .002) * .3, 0)), 'temple', .2)
@snd('vn_bowl_bell', 'vn', .45, 'struck bowl bell (chuông mõ/singing bowl): long beating partials', 'meditation, pagoda interiors, calm reveal')
def _(c):
    f = 392 * c.jit(4); fr = []; T = []; A = []
    for r_, a, t60 in [(1, 1, 7), (2.71, .5, 4), (5.15, .3, 2.5), (8.3, .12, 1.2)]:
        for det in (-.6, .6): fr.append(f * r_ + det); T.append(t60); A.append(a * .5)
    return verb(mix(modal(fr, T, A, secs(c.opt('dur', 6.)), c.r), (mallet(c, 2500, .008) * .3, 0)), 'temple', .2)
@snd('vn_bell_recorded', 'vn', .45, 'recorded small bells (rubberduck)', 'shop door bells, wind-chime-like accents')
def _(c): return c.smp('vn/bell', 4)
@snd('vn_gong', 'vn', .55, 'bossed gong (cồng/chiêng): clear pitched fundamental, padded mallet', 'Central Highlands culture, festival openings, chapter accents')
def _(c):
    f = c.opt('f0', 220.) * c.jit(3); n = secs(c.opt('dur', 4.5))
    m = modal([f, f * 1.52, f * 2.0, f * 2.43, f * 3.0, f * 3.6, f * 4.2], [4, 2.2, 2.5, 1.4, 1.2, .8, .5], [1, .35, .45, .2, .18, .1, .06], n, c.r)
    return verb(mix(m, (mallet(c, 1200, .012) * .5, 0), (thump(c, f * .6, f * .5, .15, .1) * .4, 0)), 'hall', .2)
@snd('vn_gong_big', 'vn', .55, 'large flat gong (tam-tam style): dense modes blooming after the strike', 'grand openings, imperial Huế, dramatic reveal')
def _(c):
    n = secs(c.opt('dur', 6.)); fr = np.sort(np.exp(c.r.uniform(np.log(90), np.log(4000), 80)))
    m = modal(fr, 5. * (fr / 90) ** -.35, (fr / 90) ** -.3 * c.r.uniform(.3, 1, 80), n, c.r, onset=.05 + .5 * (fr / 4000))
    return verb(mix(nz(m), (thump(c, 70, 50, .5, .4) * .5, 0), (mallet(c, 800, .02) * .4, 0)), 'hall', .25)
@snd('vn_gong_recorded', 'vn', .5, 'recorded gong (rubberduck)', 'gong accents with real-world texture')
def _(c): return verb(c.smp('vn/gong', 4), 'hall', .15)
@snd('vn_gong_ensemble', 'vn', .5, 'Central-Highlands chiêng ensemble: 4 tuned gongs interlocking pattern (dur)', 'Tây Nguyên scenes, festival montage')
def _(c):
    d = c.opt('dur', 4.); out = np.zeros(secs(d + 3)); tun = [196, 220, 261.6, 293.7]; beat = .25 * c.jit(3)
    pat = [[1, 0, 0, 1, 0, 0, 1, 0], [0, 0, 1, 0, 0, 1, 0, 0], [0, 1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0]]
    gongs = [ad(modal([f, f * 1.52, f * 2.0], [2.2, 1.2, 1.4], [1, .3, .4], secs(2.5), c.r), mallet(c, 1000, .01) * .3) for f in tun]
    k = 0
    while k * beat < d:
        for g, p in zip(gongs, pat):
            if p[k % 8]: place(out, g, k * beat + c.u(0, .015), c.u(.6, 1))
        k += 1
    return verb(out, 'outdoor', .2)
@snd('vn_mo', 'vn', .5, 'wooden fish (mõ): hollow woody tok, short resonant decay', 'Buddhist chanting, pagoda rhythm, gentle comic tok')
def _(c):
    f = c.opt('f0', 620.) * c.jit(5); n = secs(.4)
    body = modal([f, f * 1.48, f * 2.6, 300 * c.jit(5)], [.14, .06, .03, .1], [1, .3, .12, .5], n, c.r)
    return verb(mix(body, (mallet(c, 2500, .006) * .4, 0)), 'room', .12)
@snd('vn_mo_chant', 'vn', .45, 'mõ chanting rhythm (steady ~100 bpm), bowl bell at the phrase end (dur)', 'pagoda interiors, meditation montage')
def _(c):
    d = c.opt('dur', 6.); gap = 60 / c.opt('bpm', 100.) * c.jit(2); out = np.zeros(secs(d + 6)); t = 0.; k = 0
    while t < d: place(out, nz(REG['vn_mo']['fn'](Ctx('vn_mo', c.var * 100 + k, {}))), t, c.u(.75, 1)); t += gap; k += 1
    place(out, nz(REG['vn_bowl_bell']['fn'](c)) * .6, t); return out
@snd('vn_song_loan', 'vn', .45, 'song loan clapper (cải lương wooden clapper): crisp double click', 'traditional theatre, southern music cues')
def _(c):
    def k_(): f = 1800 * c.jit(6); return ad(modal([f, f * 2.2, 900], [.03, .015, .04], [1, .4, .5], secs(.08), c.r), click(c, 4000, .002) * .3)
    return mix((k_(), 0), (k_() * .8, c.u(.07, .1)))
@snd('vn_phach', 'vn', .4, 'bamboo phách clicks (ca trù rhythm, 5 hits)', 'ca trù, imperial music, traditional rhythm beds')
def _(c):
    out = np.zeros(secs(1.6)); t = 0.
    for k in range(5):
        f = 1500 * c.jit(5); place(out, ad(modal([f, f * 2.6, f * 4.1], [.05, .025, .012], [1, .4, .2], secs(.1), c.r), click(c, 3500, .002) * .3), t, c.u(.6, 1)); t += c.ch([.16, .16, .32])
    return out
@snd('vn_firecracker_string', 'vn', .5, 'Tết firecracker string (pháo dây): dense irregular cracks + thumps + outdoor slap (dur)', 'Tết celebrations, festival openings, New Year scenes')
def _(c):
    d = c.opt('dur', 3.); n = secs(d); out = np.zeros(n); t = 0.
    while t < d:
        m = secs(c.u(.008, .02)); x = ad(hp(c.wn(m), c.u(800, 2000)) * dec(m, .006), thump(c, 160, 90, .03, .015) * .3)
        place(out, x, t, c.u(.4, 1)); t += c.r.exponential(1 / c.u(18, 40))
    return verb(out, 'outdoor', .3)
@snd('vn_firecracker', 'vn', .5, 'single firecracker bang + slap echo', 'single pop, gag punctuation')
def _(c):
    m = secs(.04); return verb(mix(hp(c.wn(m), 1200) * dec(m, .01), (thump(c, 140, 70, .1, .05) * .5, 0)), 'outdoor', .35)
@snd('vn_firework', 'vn', .5, 'firework burst: recorded + synthetic crackle tail', 'Tết fireworks, Đà Nẵng fireworks festival')
def _(c):
    d = 2.6; n = secs(d); cr = np.zeros(n)
    for k in c.r.uniform(.3, 2.2, 40): place(cr, hp(c.wn(secs(.008)), 2500) * dec(secs(.008), .004) * c.u(.2, .7), k)
    return mix(nz(c.smp('vn/firework', 4)), (cr * np.exp(-tt(n) * .8) * .6, 0))
@snd('vn_lion_dance', 'vn', .5, 'lion dance (múa lân): big drum pattern + cymbal crashes + small gong (dur)', 'Mid-Autumn festival, Tết, shop openings')
def _(c):
    d = c.opt('dur', 4.); out = np.zeros(secs(d + 2)); beat = .2 * c.jit(3)
    pat_d = [1, 0, 1, 1, 0, 1, 0, 1]; pat_c = [1, 0, 0, 0, 1, 0, 0, 0]; pat_g = [0, 0, 1, 0, 0, 0, 1, 0]
    drum = lambda: ad(membrane(c, 95 * c.jit(3), .5, .12), mallet(c, 2500, .006) * .4)
    cym = lambda: cymbal(c, .8, 500) * dec(secs(.8), .35)
    gg = lambda: modal([660, 1000, 1320], [.5, .3, .2], [1, .4, .3], secs(.6), c.r)
    k = 0
    while k * beat < d:
        if pat_d[k % 8]: place(out, drum(), k * beat, c.u(.7, 1))
        if pat_c[k % 8]: place(out, nz(cym()) * .5, k * beat)
        if pat_g[k % 8]: place(out, gg() * .3, k * beat)
        k += 1
    return verb(out, 'outdoor', .2)
@snd('vn_temple_drum', 'vn', .5, 'pagoda drum (trống chùa): deep slow hits with long resonance (n hits)', 'pagoda rituals, Huế imperial scenes')
def _(c):
    k_ = int(c.opt('n', 3)); out = np.zeros(secs(k_ * 1.1 + 3))
    for k in range(k_): place(out, ad(membrane(c, 62 * c.jit(3), 1.8, .1), mallet(c, 900, .02) * .4), k * 1.05 * c.jit(3), c.u(.8, 1))
    return verb(out, 'temple', .25)
@snd('vn_vendor_call', 'vn', .35, 'street vendor call "rao" (non-lexical sung phrase with tonal contours, distant)', 'Hà Nội street hawkers, market alleys - texture, not words')
def _(c):
    f0 = c.u(210, 260); seq = [(.22, 1., 1.25, 'a'), (.18, 1.1, .85, 'o'), (.3, 1.2, 1.2, 'i'), (.45, 1.1, .7, 'a')]; t = 0.; out = []
    for d, a, b, v in seq[:int(c.u(3, 5))]:
        n = secs(d * c.jit(10)); f = np.linspace(f0 * a, f0 * b, n) * (1 + .02 * np.sin(2 * np.pi * 6 * tt(n)))
        out.append((vowel_voice(c, f, n, [v], .15, 1.18) * env_ar(n, .2, 1, .8), t)); t += n / SR + .04
    return verb(lp(mix(*out), 3200), 'outdoor', .4)
@snd('vn_karaoke_far', 'vn', .3, 'distant neighbourhood karaoke: boomy beat + echoing sung melody through a cheap speaker (dur)', 'evening alleys, comic local-colour beat')
def _(c):
    d = c.opt('dur', 6.); n = secs(d); out = np.zeros(n); bpm = c.u(92, 110); b = 60 / bpm; t = 0.; k = 0
    while t < d:
        place(out, thump(c, 90, 50, .3, .2), t); place(out, saw(c.ch([82.4, 98, 110]), secs(b * .9)) * dec(secs(b * .9), .4) * .2, t)
        t += b; k += 1
    t = 0.; scale = [261.6, 293.7, 329.6, 392, 440]
    while t < d:
        nd = c.ch([b, b, b * 2]); m = secs(nd); f = c.ch(scale) * (1 + .015 * np.sin(2 * np.pi * 5.5 * tt(m)))
        place(out, vowel_voice(c, f, m, [c.ch(['o', 'a', 'e'])], .1, 1.15) * env_ar(m, .1, 1, .6) * .6, t); t += nd
    y = sat(hp(out, 180), 2.5); y = lp(y, 1100)
    return verb(y, 'outdoor', .5)[:n]
@snd('vn_dan_bau', 'vn', .45, 'đàn bầu (monochord): harmonic pluck with expressive pitch bend + vibrato', 'Vietnamese cultural reveals, emotional local colour')
def _(c):
    d = c.opt('dur', 2.2); n = secs(d); f = c.opt('note', 392.) * c.jit(1)
    k = karplus(f / 2, int(n * 1.6), c.r, T60=2.5, bright=.4, pick=.5)
    x = np.linspace(0, 1, n); bend = 1 + .06 * np.clip((x - .35) / .2, 0, 1) - .03 * np.clip((x - .7) / .2, 0, 1)
    vib = 1 + .012 * np.sin(2 * np.pi * 5.5 * tt(n)) * np.clip((x - .2) * 3, 0, 1)
    y = varispeed(k, bend * vib)[:n]
    return verb(lp(hp(y, f * .8), 5000), 'room', .2)
@snd('vn_dan_tranh', 'vn', .45, 'đàn tranh (16-string zither) pentatonic glissando + plucked notes', 'opening titles, cultural montage, elegant transitions')
def _(c):
    sc = [293.7, 329.6, 392, 440, 523.3, 587.3, 659.3, 784, 880]; out = np.zeros(secs(3.5)); t = 0.
    order = sc[::-1] if c.r.random() > .5 else sc
    for f in order: place(out, karplus(f * c.jit(.3), secs(2.2), c.r, 1.6, .7, .2), t, c.u(.5, .8)); t += .055
    for k in range(2): place(out, karplus(c.ch(sc[:5]), secs(2.), c.r, 2., .6, .25), t + .25 + k * .35, .9)
    return verb(out, 'room', .2)
@snd('vn_bamboo_clack', 'vn', .4, 'bamboo tube knock (hollow closed-tube odd partials)', 'bamboo dance (múa sạp), bamboo forests, rafts')
def _(c):
    f = c.u(320, 650); n = secs(.35); return verb(ad(modal([f, f * 3.0, f * 5.0], [.18, .06, .03], [1, .35, .15], n, c.r), mallet(c, 3000, .004) * .4), 'outdoor', .15)
@snd('vn_mo_trau', 'vn', .4, 'mõ trâu (wooden buffalo bell) clonking with the animal\'s steps', 'rice paddies, highland trails with buffalo')
def _(c):
    out = np.zeros(secs(2.)); f = c.u(380, 520)
    for k in range(int(c.u(3, 6))):
        m = modal([f, f * 1.85, f * 3.1], [.25, .12, .05], [1, .4, .15], secs(.4), c.r)
        place(out, ad(m, mallet(c, 2000, .005) * .3), k * c.u(.3, .5), c.u(.5, 1)); place(out, m * .5, k * .4 + .05)
    return verb(out, 'outdoor', .2)

# =====================================================================================  CROWD
def _onset(c, count, spread): return [c.u(0, spread) for _ in range(count)]
@snd('crowd_gasp', 'crowd', .45, 'crowd gasp: staggered aspirated inhale through /a/ formants', 'shock reveals, prices, surprising facts')
def _(c):
    n = secs(.7); count = int(c.opt('n', 14)); out = np.zeros(n)
    for v in range(count):
        m = secs(c.u(.25, .4)); x = c.wn(m) * .8 + glottal(c, c.u(150, 300), m, 0) * .15
        place(out, formant(x, c.ch(['a', 'ah', 'o']), c.u(1., 1.3)) * env_ar(m, .15, 1.2, 1.5), c.u(0, .12), c.u(.5, 1))
    return verb(out, 'hall', .25)
@snd('crowd_ooh', 'crowd', .45, 'crowd "oooh" (voices u->o, pitch rise-fall)', 'impressive reveal, quiz answer, "wow" moment')
def _(c):
    n = secs(1.5); x = np.linspace(0, 1, n)
    out = voices(c, n, int(c.opt('n', 18)), lambda b, v: b * (1 + .12 * np.sin(np.pi * x) * c.u(.5, 1.2)),
                 lambda v: env_ar(n, c.u(.25, .45), 1.5, 1.3) * c.u(.5, 1), 'u', 'o', lambda v: np.clip(x * 1.5, 0, 1), breath=.25)
    return verb(out, 'hall', .25)
@snd('crowd_aww', 'crowd', .45, 'crowd "awww" (falling pitch, a->u)', 'cute moments, disappointment, sympathy')
def _(c):
    n = secs(1.4); x = np.linspace(0, 1, n)
    out = voices(c, n, int(c.opt('n', 16)), lambda b, v: b * 1.25 * (1 - .3 * x), lambda v: env_ar(n, .2, 1.5, 1.2) * c.u(.5, 1), 'a', 'u', lambda v: x ** 1.5, breath=.25)
    return verb(out, 'hall', .25)
@snd('crowd_wow', 'crowd', .45, 'crowd "woah!" (u->o->a, rising)', 'amazing view reveals, stunts')
def _(c):
    n = secs(1.1); x = np.linspace(0, 1, n)
    out = voices(c, n, 16, lambda b, v: b * (1 + .3 * x), lambda v: env_ar(n, .3, 1.2, 1.4) * c.u(.5, 1), 'o', 'a', lambda v: np.clip(x * 2 - .3, 0, 1), breath=.25)
    return verb(out, 'hall', .25)
@snd('crowd_laugh', 'crowd', .45, 'crowd laughter: many "ha-ha" pulse trains with descending pitch, breathy', 'jokes landing, comedic beats')
def _(c):
    d = c.opt('dur', 2.); n = secs(d + .5); out = np.zeros(n)
    for gi, sc in enumerate((1., 1.17)):
        src = np.zeros(n)
        for v in range(int(c.opt('n', 14)) // 2):
            t0 = c.u(0, .4); rate = c.u(4, 6.5); base = (130, 230)[gi] * c.u(.85, 1.2)
            m = secs(c.u(.9, d)); tt_ = tt(m); pul = np.maximum(0, np.sin(2 * np.pi * rate * tt_)) ** 2 * np.exp(-tt_ / c.u(.8, 1.6))
            f = base * (1.2 - .25 * tt_ / (m / SR))
            place(src, glottal(c, f, m, .5) * pul, t0, c.u(.4, 1))
        out += formant(src, 'a', sc) + formant(src, 'ah', sc) * .3
    return verb(out, 'hall', .25)
@snd('crowd_cheer', 'crowd', .5, 'crowd cheer: sustained "yeah!" voices + whistles + applause', 'victories, festival climax, arrivals')
def _(c):
    d = c.opt('dur', 2.5); n = secs(d); x = np.linspace(0, 1, n)
    v = voices(c, n, int(c.opt('n', 24)), lambda b, k: b * (1.3 + .25 * np.minimum(1, x * 4)) * (1 + .02 * np.sin(2 * np.pi * c.u(4, 6) * tt(n))),
               lambda k: np.clip((x - c.u(0, .15)) * 8, 0, 1) * (1 - x) ** .7 * c.u(.4, 1), 'e', 'a', lambda k: np.clip(x * 5, 0, 1), breath=.3)
    wh = np.zeros(n)
    for k in range(int(c.u(1, 4))):
        m = secs(c.u(.3, .6)); place(wh, sine(np.linspace(c.u(1800, 2500), c.u(2500, 3200), m), m) * env_ar(m, .3, 1, 1) * .15, c.u(.2, d * .7))
    ap = REG['crowd_applause']['fn'](Ctx('crowd_applause', c.var, {'dur': d}))
    return verb(mix(rmsn(v), (wh, 0), (rmsn(ap) * .6, 0)), 'hall', .25)
@snd('crowd_applause', 'crowd', .45, 'applause: granular claps (each a band-passed burst), dur', 'performance endings, quiz correct, celebration')
def _(c):
    d = c.opt('dur', 2.5); n = secs(d); density = c.opt('density', 140.); cnt = int(d * density)
    times = c.r.uniform(0, d - .05, cnt); out = np.zeros(n + secs(.1))
    for t0 in times:
        m = secs(.03); f = c.u(800, 2800); place(out, bp(c.wn(m), f * .6, f * 1.8) * dec(m, .012), t0, c.u(.3, 1))
    return out * pad(np.minimum(1, tt(n) / .25) * np.minimum(1, (d - tt(n)) / .8), len(out))
@snd('crowd_murmur', 'crowd', .3, 'indoor crowd murmur / babble (non-lexical)', 'restaurants, waiting rooms, under VO for crowds')
def _(c): return babble(c, secs(c.opt('dur', 4.)), 1., 18)
@snd('crowd_kids_cheer', 'crowd', .45, 'children cheering "yay!" (high voices, e->a)', 'school kids, festival children, cute wins')
def _(c):
    n = secs(1.6); x = np.linspace(0, 1, n)
    out = voices(c, n, 12, lambda b, v: b * (1.2 + .2 * np.sin(np.pi * x)), lambda v: env_ar(n, .15, 1, 1.2) * c.u(.5, 1), 'e', 'a',
                 lambda v: np.clip(x * 3, 0, 1), mix_g=(1.32, 1.4), breath=.25)
    return verb(out, 'hall', .2)

# =====================================================================================  BATTLE / HISTORY
S('battle', 'battle_blade_strike', 'battle/blade_strike', .5, 'blade strike (Warfork CC0)', 'sword swings that connect', 6)
S('battle', 'battle_wood_fall', 'battle/wood_fall', .5, 'wooden debris falling', 'collapsing palisades, ship debris', 5)
S('battle', 'battle_rock_break', 'battle/rock_break', .5, 'rock breaking', 'citadel walls hit, catapult impacts', 5)
S('battle', 'battle_glass_break', 'battle/glass_break', .5, 'glass breaking', 'shattering, windows', 5)
S('battle', 'battle_metal_fall', 'battle/metal_fall', .5, 'metal objects falling', 'armour/weapons dropped', 5)
@snd('battle_war_drum', 'battle', .55, 'war drum (trống trận): big membrane hits in a march pattern (n, bpm)', 'armies advancing, Bạch Đằng, Tây Sơn battle scenes')
def _(c):
    k_ = int(c.opt('n', 8)); b = 60 / c.opt('bpm', 96.); out = np.zeros(secs(k_ * b + 2)); pat = [1, .5, .8, 0, 1, .5, .8, .6]
    for k in range(k_):
        g = pat[k % 8]
        if g: place(out, ad(membrane(c, 58 * c.jit(3), 1.1, .15), mallet(c, 1200, .015) * .5), k * b + c.u(0, .01), g * c.u(.85, 1))
    return verb(out, 'valley', .25)
@snd('battle_drum_march', 'battle', .45, 'marching drums loop: low drums + rim clicks (dur)', 'troops marching, historical montage')
def _(c):
    d = c.opt('dur', 4.); out = np.zeros(secs(d + 1.5)); b = 60 / c.opt('bpm', 112.) / 2; k = 0
    while k * b < d:
        if k % 4 == 0: place(out, membrane(c, 70 * c.jit(2), .8, .12), k * b)
        if k % 2 == 1: place(out, ad(membrane(c, 190 * c.jit(3), .2, .05) * .5, click(c, 3000, .004) * .4), k * b)
        k += 1
    return verb(out, 'outdoor', .2)
@snd('battle_arrow_whiz', 'battle', .45, 'single arrow whiz-by (fletching flutter + doppler)', 'arrows flying past camera')
def _(c):
    n = secs(.6); m = int(n * 1.4); fl = .6 + .4 * np.sin(2 * np.pi * phase(c.u(150, 250), m))
    src = rmsn(bp(c.wn(m), 1200, 6000)) * fl + rmsn(reso(c.wn(m), 2400 * c.jit(10), 8)) * .4
    y, _ = doppler(src, n, v=c.u(50, 70), d0=c.u(.8, 2.)); return y
@snd('battle_bow_release', 'battle', .45, 'bow release: string twang (Karplus) + wood thump', 'archers loosing arrows')
def _(c): return mix(lp(karplus(c.u(90, 130), secs(.5), c.r, .25, .5), 3000) * .8, (thump(c, 200, 100, .08, .04) * .5, 0), (whoosh(c, .2, 1500, 5000) * .3, .02))
@snd('battle_arrow_volley', 'battle', .55, 'arrow volley: dozens of bow twangs then a wall of whizzes (n arrows)', 'massed archers, sky full of arrows')
def _(c):
    k_ = int(c.opt('n', 30)); out = np.zeros(secs(2.8))
    wz = [nz(REG['battle_arrow_whiz']['fn'](Ctx('battle_arrow_whiz', c.var * 1000 + k, {}))) for k in range(6)]
    bw = [nz(REG['battle_bow_release']['fn'](Ctx('battle_bow_release', c.var * 1000 + k, {}))) for k in range(4)]
    for k in range(k_):
        if k < k_ // 2: place(out, repitch(bw[k % 4], c.jit(6)) * .25, c.u(0, .3))
        place(out, repitch(wz[k % 6], c.jit(8)) * c.u(.15, .45), c.u(.3, 1.6))
    return verb(out, 'valley', .2)
@snd('battle_arrow_thunk', 'battle', .5, 'arrow hits wood: sharp thunk + shaft quiver', 'arrows into shields, posts, ship hulls')
def _(c):
    q = karplus(c.u(70, 110), secs(.4), c.r, .3, .3) * np.sin(2 * np.pi * 18 * tt(secs(.4))) * .4
    return mix(nz(c.smp('impact/wood_light', 6)), (thump(c, 250, 120, .06, .03) * .5, 0), (lp(q, 1500), .01))
@snd('battle_sword_clash', 'battle', .55, 'sword clash: inharmonic metal ring + recorded blade hit + scrape', 'duels, generals clashing')
def _(c):
    n = secs(1.4); ring = metal_modes(c, 1600 * c.jit(8), n, 20, (1, 6), .9, .5)
    sc = bp(c.wn(secs(.25)), 2500, 8000) * env_ar(secs(.25), .1, 1, 1) * .3
    return verb(mix(nz(ring) * .6, nz(c.smp('battle/blade_hit', 5)) * .7, (sc, .03), (click(c, 7000, .003) * .5, 0)), 'outdoor', .15)
@snd('battle_sword_draw', 'battle', .45, 'sword drawn: recorded unsheath pitched down + metallic ring', 'readying for battle')
def _(c):
    x = repitch(c.smp('foley/knife_draw', 4), .8); n = secs(1.2)
    return mix(nz(x), (metal_modes(c, 2200, n, 10, (1, 4), .8, .5) * .08, len(x) / SR * .7))
@snd('battle_shield_bash', 'battle', .55, 'shield bash: heavy wood + metal rim + sub', 'shield walls, charge impacts')
def _(c): return mix(nz(c.smp('impact/wood_heavy', 5)), nz(c.smp('impact/metal_light', 5)) * .3, (thump(c, 110, 45, .4, .25) * .6, 0))
@snd('battle_stake_crack', 'battle', .55, 'wooden stake/beam cracking (recorded breaks + creak tail)', 'Bạch Đằng stakes, palisades breaking')
def _(c): return verb(mix(nz(c.smp('battle/wood_break', 5)), (nz(REG['battle_creak']['fn'](c)) * .35, .1), (thump(c, 90, 40, .5, .3) * .5, 0)), 'outdoor', .2)
@snd('battle_creak', 'battle', .45, 'deep timber groan (stick-slip friction pulses)', 'ship hulls straining, stressed wood')
def _(c):
    n = secs(c.u(.8, 1.4)); x = np.linspace(0, 1, n); f = (30 + 50 * np.sin(np.pi * x) + 10 * np.sin(2 * np.pi * 3 * x)) * c.jit(15)
    pul = square(f, n, .08); return bp(pul, 250, 1800) * env_ar(n, .4, 1, 1)
@snd('battle_ship_crack', 'battle', .6, 'warship breaking: groan + big timber cracks + splash + debris', 'ships impaled on stakes, naval battle climax')
def _(c):
    g = nz(REG['battle_creak']['fn'](c)) * .5; b = nz(c.smp('battle/wood_break', 4, idx=0)); b2 = nz(repitch(c.smp('battle/wood_break', 4, idx=1), .7))
    return verb(mix(g, (b, .5), (b2 * .8, .8), (nz(c.smp('nature/splash', 4)) * .5, 1.1), (nz(c.smp('battle/wood_fall', 4)) * .4, 1.2), (nz(_boom(c, 1.5)) * .5, .5)), 'valley', .2)
@snd('battle_horse_gallop', 'battle', .5, 'horse gallop: 4-beat hoof clops on dirt (dur, tempo)', 'cavalry, messengers, Trần dynasty riders')
def _(c):
    d = c.opt('dur', 2.5); stride = .42 / c.opt('speed', 1.); out = np.zeros(secs(d + .3)); t = 0.
    while t < d:
        for k, off in enumerate((0, .08, .18, .24)):
            m = secs(.06); hoof = ad(lp(c.wn(m), 1500) * dec(m, .02), thump(c, 160, 80, .06, .03) * .6)
            place(out, hoof, t + off * stride / .42 + c.u(0, .008), c.u(.6, 1))
        t += stride
    return out
@snd('battle_horse_neigh', 'battle', .45, 'horse whinny (formant synthesis: rising scream then tremolo descent + snort)', 'cavalry charge, war horses rearing')
def _(c):
    n = secs(1.4); x = np.linspace(0, 1, n)
    f = np.where(x < .15, 450 + 500 * x / .15, 950 - 500 * (x - .15) / .85) * (1 + .12 * np.sin(2 * np.pi * 11 * tt(n)) * (x > .15)) * c.jit(5)
    v = vowel_voice(c, f, n, ['i', 'e', 'a'], .3, 1.5, rough=.6) * env_ar(n, .1, 1, 1) * (1 - .4 * (np.sin(2 * np.pi * 11 * tt(n)) > .5) * (x > .2))
    sn = lp(c.wn(secs(.3)), 900) * env_ar(secs(.3), .2, 1, 1) * .5
    return verb(mix(v, (sn, 1.45)), 'outdoor', .2)
@snd('battle_elephant', 'battle', .5, 'war elephant trumpet (brassy formant scream + low rumble)', 'Hai Bà Trưng / Bà Triệu / Quang Trung war elephants')
def _(c):
    n = secs(1.3); x = np.linspace(0, 1, n); f = (420 + 300 * np.sin(np.pi * x ** .7)) * c.jit(5)
    v = vowel_voice(c, f, n, ['e', 'ae', 'a'], .2, 1.8, rough=.9) * env_ar(n, .15, 1, 1)
    return verb(mix(v, rmsn(lp(c.wn(n), 120)) * .3 * env_ar(n, .3, 1, 1)), 'valley', .2)
S('battle', 'battle_cannon', 'battle/cannon', .6, 'cannon shot (recorded) - add hit_boom for scale', 'artillery, citadel defence, signal shots', 5)
@snd('battle_cannon_big', 'battle', .65, 'big cannon: recorded shot + sub boom + valley echo', 'fortress cannons, naval guns')
def _(c): return verb(mix(nz(c.smp('battle/cannon', 4)), nz(_boom(c, 2.)) * .6), 'valley', .2)
@snd('battle_explosion', 'battle', .6, 'explosion: recorded blast + sub + debris', 'gunpowder, sieges, dramatic destruction')
def _(c): return mix(nz(c.smp('battle/explosion', 4)), nz(_boom(c, 2.2)) * .5, (nz(c.smp('nature/stones', 5)) * .25, .3))
@snd('battle_bang', 'battle', .55, 'gunshot/bang (recorded)', 'muskets, starting pistol, sharp bangs')
def _(c): return verb(c.smp('battle/bang', 5), 'outdoor', .25)
@snd('battle_fire', 'battle', .4, 'fire: roaring low band + stochastic crackles (dur)', 'burning ships, torches, village fires, campfires (lower gain)')
def _(c):
    d = c.opt('dur', 3.); n = secs(d); t = tt(n)
    roar = rmsn(lp(c.pn(n), 400)) * (.7 + .3 * lp(np.abs(c.r.standard_normal(n // 441 + 1)).repeat(441)[:n], 3))
    cr = events(c, n, 25, lambda: hp(c.wn(secs(.004)), 2000) * c.u(.2, 1)) + events(c, n, 3, lambda: bp(c.wn(secs(.02)), 600, 3000) * dec(secs(.02), .008) * 1.5)
    return roar + cr * .7 + rmsn(hp(c.wn(n), 4000)) * .1
@snd('battle_fire_spell', 'battle', .5, 'fire burst (recorded)', 'fire arrows igniting, flames bursting')
def _(c): return c.smp('battle/fire_spell', 5)
@snd('battle_war_horn', 'battle', .5, 'war horn / buffalo horn (tù và): brassy low tone with slow swell and pitch rise', 'call to arms, signal across the valley')
def _(c):
    d = c.opt('dur', 2.4); n = secs(d); x = np.linspace(0, 1, n); f = c.opt('f0', 138.) * c.jit(3) * (1 + .04 * np.minimum(1, x * 5))
    src = saw(f, n) * (1 + .1 * np.sin(2 * np.pi * 5 * tt(n)) * x)
    y = vfilt(src, 300 + 2200 * np.minimum(1, x * 3) * (1 - .4 * x), 'low', block=256)
    return verb((formant(y, 'o', 1.) * .5 + y * .5) * env_ar(n, .25, 1.2, .5), 'valley', .35)
@snd('battle_splash_big', 'battle', .55, 'big splash: pitched-down splash + low thump + spray', 'soldiers/ships into the river, giant splash')
def _(c): return mix(nz(repitch(c.smp('nature/splash', 4), .6)), (thump(c, 90, 40, .4, .2) * .6, 0), (nz(c.smp('nature/splash', 4, idx=1)) * .4, .1))
@snd('battle_charge_cry', 'battle', .5, 'battle cry: many male voices yelling /a/ with rising pitch', 'armies charging, rebels rising')
def _(c):
    n = secs(c.opt('dur', 2.)); x = np.linspace(0, 1, n)
    v = voices(c, n, int(c.opt('n', 24)), lambda b, k: b * 1.6 * (1 + .25 * x), lambda k: np.clip((x - c.u(0, .2)) * 6, 0, 1) * (1 - x) ** .5, 'a', mix_g=(1., 1., 1.08), breath=.4)
    return verb(sat(v / (np.abs(v).max() or 1), 1.5), 'valley', .3)
@snd('battle_clash_melee', 'battle', .5, 'melee: overlapping sword clashes, shield bashes, grunts-free (dur)', 'battle montage background')
def _(c):
    d = c.opt('dur', 3.); out = np.zeros(secs(d + 1.5)); t = 0.; k = 0
    while t < d:
        nm = c.ch(['battle_sword_clash', 'battle_sword_clash', 'battle_shield_bash', 'battle_blade_strike', 'impact_body'])
        place(out, nz(REG[nm]['fn'](Ctx(nm, c.var * 100 + k, {}))) * c.u(.2, .7), t); t += c.u(.12, .45); k += 1
    return verb(out, 'outdoor', .2)

# =====================================================================================  MAGIC
S('magic', 'magic_power_up', 'magic/power_up', .45, 'arcade power-up arpeggio (Kenney Digital)', 'level-up, unlock, achievement', 4)
S('magic', 'magic_phaser_up', 'magic/phaser_up', .4, 'phaser rising', 'energy charging, sci-fi lift', 5)
S('magic', 'magic_gem', 'magic/gem', .45, 'gem pickup shimmer', 'treasure, hidden gem places', 5)
S('magic', 'magic_force_field', 'magic/force_field', .4, 'force field hum', 'shields, barrier, protective bubble', 5)
S('magic', 'magic_tone', 'magic/tone', .4, 'digital tone motif', 'small rewards, highlights', 4)
S('magic', 'magic_coin', 'magic/coin', .45, 'coin pickup', 'saving money tips, rewards', 5)
@snd('magic_sparkle', 'magic', .4, 'sparkle: random high bell pings + glitter noise', 'shiny objects, clean rooms, magic touches')
def _(c):
    d = c.opt('dur', .8); out = np.zeros(secs(d + .5))
    for k in range(int(c.u(6, 12))):
        f = c.u(2500, 6000); place(out, _bell_small(c, f, .3) * .4, c.u(0, d), c.u(.3, 1))
    out += pad(hp(c.wn(secs(d)), 6000) * (c.r.random(secs(d)) > .97) * .5 * env_ar(secs(d), .3, 1, 1), len(out))
    return out
@snd('magic_shimmer', 'magic', .4, 'sustained shimmer (many AM partials), dur', 'golden hour, temple glow, wonder')
def _(c):
    d = c.opt('dur', 1.8); n = secs(d); out = np.zeros(n)
    for k in range(14):
        f = c.u(1800, 5500); out += sine(f, n) * (.5 + .5 * np.sin(2 * np.pi * c.u(3, 9) * tt(n) + c.u(0, 6))) * c.u(.2, 1)
    return out * env_ar(n, .35, 1.2, 1.4)
@snd('magic_chime_up', 'magic', .45, 'ascending pentatonic chime arpeggio (modal bells)', 'positive reveals, "did you know?", lightbulb')
def _(c):
    sc = [523.3, 587.3, 659.3, 784, 880, 1046.5, 1174.7]; out = np.zeros(secs(1.8)); st = int(c.r.integers(0, 2))
    for k, f in enumerate(sc[st:st + 5]): place(out, _bell_small(c, f * 2, .9), k * .07, .5 + .1 * k)
    return verb(out, 'plate', .2)
@snd('magic_twinkle', 'magic', .35, 'twinkle: two-three tiny high pings', 'stars, eyes sparkling, clean shine')
def _(c): return mix(*[(_bell_small(c, c.u(3500, 5500), .25) * .5, k * c.u(.06, .1)) for k in range(int(c.u(2, 4)))])
@snd('magic_poof', 'magic', .45, 'magic poof: puff + sparkle tail', 'appear/disappear transformations')
def _(c): return mix(nz(REG['cartoon_poof']['fn'](c)), (nz(REG['magic_sparkle']['fn'](Ctx('magic_sparkle', c.var, {'dur': .5}))) * .4, .05))
@snd('magic_spell', 'magic', .45, 'spell cast: recorded spell + rising shimmer', 'transformations, fantasy beats')
def _(c): return mix(nz(c.smp('magic/spell', 5)), nz(REG['magic_shimmer']['fn'](Ctx('magic_shimmer', c.var, {'dur': 1.2}))) * .3)
@snd('magic_reveal', 'magic', .5, 'magic reveal: reverse cymbal swell -> bell + shimmer bloom', 'hidden gems revealed, before/after reveals')
def _(c):
    rc = nz(REG['riser_reverse_cymbal']['fn'](Ctx('riser_reverse_cymbal', c.var, {'dur': 1.2})))
    bl = verb(mix(_bell_small(c, 1046.5, 1.5), _bell_small(c, 1568, 1.2) * .6), 'plate', .3)
    return mix(rc * .6, (nz(bl), 1.2), (nz(REG['magic_shimmer']['fn'](Ctx('magic_shimmer', c.var, {'dur': 1.5}))) * .3, 1.2))
@snd('magic_wand', 'magic', .4, 'wand swish + sparkle trail', 'pointing at map, magic gestures')
def _(c): return mix(whoosh(c, .3, 1500, 6000, .4, 1., .5) * .6, (nz(REG['magic_sparkle']['fn'](Ctx('magic_sparkle', c.var, {'dur': .5}))) * .7, .12))
@snd('magic_harp_gliss', 'magic', .45, 'harp glissando (Karplus-Strong, pentatonic, up or down)', 'dream sequences, flashbacks, lovely views')
def _(c):
    sc = [261.6, 293.7, 329.6, 392, 440]; notes = [f * 2 ** o for o in (0, 1, 2) for f in sc]
    if c.r.random() > .5: notes = notes[::-1]
    out = np.zeros(secs(3.))
    for k, f in enumerate(notes): place(out, karplus(f, secs(2.), c.r, 1.8, .8), k * .045, .6)
    return verb(out, 'hall', .25)

# =====================================================================================  AMBIENCE BEDS (loopable)
def _tile(c, key, n):
    src = c.smp(key, 3)
    if len(src) < 1000: return np.zeros(n)
    k = min(secs(.4), len(src) // 4); out = np.zeros(n); t = int(c.r.integers(0, max(1, len(src) // 2))); i = -t
    while i < n:  # overlap-add with equal-power crossfades to avoid seams
        seg = src.copy(); w = np.sin(np.linspace(0, np.pi / 2, k))
        seg[:k] *= w; seg[-k:] *= w[::-1]
        j = max(0, i); s0 = j - i; e = min(n, i + len(seg)); out[j:e] += seg[s0:s0 + e - j]; i += len(seg) - k
    return out
def scoot_far(c, n):
    m = secs(c.u(2, 3.5)); y = engine(c, c.u(3000, 4500), int(m * 1.4), pipe=c.u(200, 280))
    z, _ = doppler(rmsn(y), m, v=c.u(8, 14), d0=c.u(6, 15)); return z
@bed('amb_city_traffic', 'Hà Nội/Sài Gòn street: recorded traffic wash + synthetic scooter swarm passes + horns', 'Old Quarter, roundabouts, street3d scenes', .35)
def _(c, n):
    wash = rmsn(_tile(c, 'vehicle/highway_loop', n), .12) + rmsn(lp(c.pn(n), 400), .06)
    sc = events(c, n, c.opt('density', 1.4), lambda: scoot_far(c, n) * c.u(.3, 1))
    hn = events(c, n, .5, lambda: nz(REG['vehicle_moto_horn']['fn'](Ctx('vehicle_moto_horn', int(c.r.integers(1e6)), {}))) * c.u(.03, .1))
    return wash + rmsn(sc, .1) + lp(hn, 3500)
@bed('amb_market', 'busy market: babble + distant vendor calls + plastic bags + clinks + scooters', 'Bến Thành, Đồng Xuân, night markets', .35)
def _(c, n):
    b = rmsn(babble(c, n, 1.3, 24), .12)
    vc = events(c, n, .25, lambda: nz(REG['vn_vendor_call']['fn'](Ctx('vn_vendor_call', int(c.r.integers(1e6)), {}))) * c.u(.03, .07))
    cl = events(c, n, 1.2, lambda: nz(c.smp_any('food/glass_clink')) * c.u(.01, .04))
    bag = events(c, n, .4, lambda: nz(c.smp_any('foley/plastic'))[:secs(.8)] * c.u(.01, .03))
    sc = events(c, n, .3, lambda: scoot_far(c, n) * .5)
    return b + vc + cl + bag + rmsn(sc, .04)
@bed('amb_rain_tin_roof', 'rain on a tin roof: recorded rain + metallic droplet pings + roof drum + gutter drips', 'homestays in the rain, Hội An floods, cosy interiors', .35)
def _(c, n):
    rain = rmsn(_tile(c, 'nature/rain_loop', n), .1)
    pings = np.zeros(n)
    for k in range(14):   # many short, low-Q metallic kernels -> diffuse 'tink' texture without static tones
        f = c.u(1500, 6000); ker = modal([f, f * c.u(1.4, 1.8), f * c.u(2.3, 2.9)], [c.u(.02, .05), .02, .012], [1, .4, .2], secs(.06), c.r)
        imp = (c.r.random(n) < c.opt('intensity', 1.) * 7 / SR) * c.r.uniform(.2, 1, n); pings += fftconvolve(imp, ker)[:n]
    drum = fftconvolve((c.r.random(n) < 6 / SR) * c.r.uniform(.3, 1, n), thump(c, 160, 110, .1, .05))[:n]
    drips = events(c, n, 1.5, lambda: nz(REG['nature_drip']['fn'](Ctx('nature_drip', int(c.r.integers(1e6)), {}))) * c.u(.02, .06))
    return rain + rmsn(pings, .05) + rmsn(drum, .03) + drips
@bed('amb_monsoon', 'monsoon downpour: dense rain roar + gusts + splatter + distant thunder', 'tropical storms, rainy-season drama', .4)
def _(c, n):
    t = tt(n); gust = .75 + .25 * lp(c.r.standard_normal(n // 441 + 1).repeat(441)[:n], 1) / .3
    roar = rmsn(lp(c.pn(n), 5000), .12) * np.clip(gust, .5, 1.3) + rmsn(lp(c.wn(n), 250, 4), .06)
    spl = rmsn(hp(fftconvolve((c.r.random(n) < 400 / SR) * c.r.uniform(.2, 1, n), c.wn(60) * np.exp(-np.arange(60) / 10))[:n], 1500), .05)
    th = events(c, n, .12, lambda: nz(REG['nature_thunder_far']['fn'](Ctx('nature_thunder_far', int(c.r.integers(1e6)), {}))) * .15)
    return roar + spl + rmsn(_tile(c, 'nature/rain_loop', n), .06) + th
@bed('amb_river', 'river: recorded flowing water + burbles + low flow', 'Mekong banks, mountain streams, Ninh Bình', .35)
def _(c, n):
    w = rmsn(_tile(c, 'nature/water_loop', n), .1)
    bub = events(c, n, 20, lambda: sine(np.linspace(c.u(300, 800), c.u(900, 1600), secs(.03)), secs(.03)) * np.hanning(secs(.03)) * c.u(.2, 1))
    return w + rmsn(bub, .03) + rmsn(lp(c.pn(n), 300), .04)
@bed('amb_waves', 'sea waves: swells every ~6-9 s with foam hiss and low thumps', 'beaches, Hạ Long, coastal roads', .35, 12.)
def _(c, n):
    out = np.zeros(n); t = c.u(0, 2)
    while t < n / SR:
        m = secs(c.u(5, 7)); place(out, nz(REG['nature_wave_crash']['fn'](Ctx('nature_wave_crash', int(c.r.integers(1e6)), {})))[:m] * c.u(.5, 1), t - 1); t += c.u(5.5, 8.5)
    return out * .5 + rmsn(lp(c.pn(n), 500), .03)
@bed('amb_crickets', 'night crickets chorus (several voices, different pitches and rhythms)', 'night scenes, rural homestays', .3)
def _(c, n):
    out = np.zeros(n)
    for k in range(int(c.opt('count', 6))):
        cc = Ctx('nature_cricket', c.var * 50 + k, {'dur': n / SR}); out += pad(nz(REG['nature_cricket']['fn'](cc)), n) * c.u(.1, .5)
    return out + rmsn(lp(c.pn(n), 200), .01)
@bed('amb_cicadas', 'cicada chorus (ve sầu): dense swelling buzz layers', 'hot summer days, Huế, countryside noon', .3)
def _(c, n):
    out = np.zeros(n)
    for k in range(5):
        m = secs(c.u(3, 6)); t = c.u(-2, n / SR)
        cc = Ctx('nature_cicada', c.var * 50 + k, {'dur': m / SR}); place(out, nz(REG['nature_cicada']['fn'](cc)) * c.u(.3, 1), t)
    base = bp(c.wn(n), 5000, 7000) * (.5 + .5 * np.sin(2 * np.pi * phase(160, n))) * .25
    return out + base
@bed('amb_frogs', 'frog chorus after rain (ếch nhái): many croakers + small high chirpers', 'rice paddies at night, Mekong evenings', .3)
def _(c, n):
    out = events(c, n, 4, lambda: nz(REG['nature_frog']['fn'](Ctx('nature_frog', int(c.r.integers(1e6)), {}))) * c.u(.1, .5))
    ch = events(c, n, 6, lambda: bird_chirp(c, c.u(2500, 3500), .03, .1) * c.u(.05, .15))
    return out + ch + rmsn(lp(c.pn(n), 300), .01)
@bed('amb_jungle', 'tropical forest: insects + birds + distant calls + drips', 'Cúc Phương, Phong Nha jungle, Cát Tiên', .35)
def _(c, n):
    ins = bp(c.wn(n), 3500, 6000) * (.5 + .5 * np.sin(2 * np.pi * phase(40, n))) * .08
    br = events(c, n, 1.2, lambda: nz(REG[c.ch(['nature_bird_song', 'nature_bird_chirp', 'nature_koel'])]['fn'](Ctx('nature_bird_song', int(c.r.integers(1e6)), {}))) * c.u(.03, .12))
    dr = events(c, n, .8, lambda: nz(REG['nature_drip']['fn'](Ctx('nature_drip', int(c.r.integers(1e6)), {}))) * .03)
    return ins + br + dr + rmsn(lp(c.pn(n), 600), .03)
@bed('amb_bamboo_wind', 'wind through bamboo: gusts + leaf rustle + hollow culm knocks + creaks', 'bamboo forests, Mai Châu, mountain villages', .35)
def _(c, n):
    t = tt(n); g = np.clip(.6 + .4 * lp(c.r.standard_normal(n // 441 + 1).repeat(441)[:n], .5) / .2, .2, 1.3)
    wind = rmsn(vfilt(c.pn(n), 350 + 400 * g, 'band', .8, block=512), .08) * g
    leaves = rmsn(hp(c.wn(n), 3000), .03) * g ** 2
    kn = events(c, n, 1.2, lambda: nz(REG['vn_bamboo_clack']['fn'](Ctx('vn_bamboo_clack', int(c.r.integers(1e6)), {}))) * c.u(.02, .08))
    cr = events(c, n, .25, lambda: nz(REG['battle_creak']['fn'](Ctx('battle_creak', int(c.r.integers(1e6)), {}))) * c.u(.02, .05))
    return wind + leaves + kn + cr
@bed('amb_night_village', 'village night: crickets + frogs + occasional gecko + far dog + distant moto', 'homestay nights, Hà Giang, Mekong villages', .3)
def _(c, n):
    cri = np.zeros(n)
    for k in range(4): cri += pad(nz(REG['nature_cricket']['fn'](Ctx('nature_cricket', c.var * 9 + k, {'dur': n / SR}))), n) * c.u(.05, .2)
    fr = events(c, n, 1.5, lambda: nz(REG['nature_frog']['fn'](Ctx('nature_frog', int(c.r.integers(1e6)), {}))) * c.u(.05, .2))
    gk = events(c, n, .06, lambda: nz(REG['nature_gecko']['fn'](Ctx('nature_gecko', int(c.r.integers(1e6)), {'n': 3}))) * .15)
    dg = events(c, n, .08, lambda: nz(REG['nature_dog_far']['fn'](Ctx('nature_dog_far', int(c.r.integers(1e6)), {}))) * .08)
    return cri + fr + gk + dg + rmsn(lp(c.pn(n), 250), .01)
@bed('amb_cafe', 'café: low murmur + cups/spoons + phin drips + distant street', 'cà phê scenes, Hà Nội cafés, dialogue rooms', .3)
def _(c, n):
    b = rmsn(babble(c, n, .8, 12, lp_f=2000), .08)
    sp = events(c, n, .5, lambda: nz(REG['food_spoon_stir']['fn'](Ctx('food_spoon_stir', int(c.r.integers(1e6)), {'dur': .8}))) * c.u(.02, .05))
    cu = events(c, n, .3, lambda: nz(REG['food_bowl_set']['fn'](Ctx('food_bowl_set', int(c.r.integers(1e6)), {}))) * c.u(.02, .05))
    st = rmsn(lp(_tile(c, 'vehicle/highway_loop', n), 900), .03)
    return verb(b + sp + cu, 'room', .2)[:n] + st
@bed('amb_room_tone', 'quiet interior room tone (brown noise + faint 50 Hz mains hum)', 'interiors, studio, under dialogue', .25)
def _(c, n): return rmsn(lp(brown(c.r, n), 400), .05) + sine(50, n) * .004 + sine(100, n) * .002
@bed('amb_temple', 'pagoda: still air + distant birds + chant drone + occasional bowl bell and mõ', 'Chùa Một Cột, Bái Đính, Perfume Pagoda interiors', .3, 12.)
def _(c, n):
    air = rmsn(lp(c.pn(n), 500), .02)
    drone = vowel_voice(c, 110 * (1 + .01 * np.sin(2 * np.pi * .2 * tt(n))), n, ['o'], .1, .9)
    drone = rmsn(lp(drone, 1200), .03) * (.6 + .4 * np.sin(2 * np.pi * .1 * tt(n)))
    bl = events(c, n, .08, lambda: nz(REG['vn_bowl_bell']['fn'](Ctx('vn_bowl_bell', int(c.r.integers(1e6)), {'dur': 5.}))) * .1)
    br = events(c, n, .3, lambda: nz(REG['nature_bird_chirp']['fn'](Ctx('nature_bird_chirp', int(c.r.integers(1e6)), {}))) * .03)
    return verb(air + drone + bl + br, 'temple', .3)[:n]
@bed('amb_kitchen', 'busy street-food kitchen: wok sizzle swells + chopping + simmering pot + clatter', 'quán ăn, street-food stalls, cooking classes', .35)
def _(c, n):
    sz = rmsn(REG['food_wok_sizzle']['fn'](Ctx('food_wok_sizzle', c.var, {'dur': n / SR})), .06)
    ch = events(c, n, .35, lambda: nz(REG['food_chop_fast']['fn'](Ctx('food_chop_fast', int(c.r.integers(1e6)), {'n': int(c.u(3, 8))}))) * .08)
    bo = rmsn(pad(REG['food_boil_broth']['fn'](Ctx('food_boil_broth', c.var, {'dur': n / SR})), n), .04)
    di = events(c, n, .3, lambda: nz(c.smp_any('food/dishes')) * .05)
    return verb(sz + ch + bo + di, 'kitchen', .15)[:n]
@bed('amb_beach', 'beach: waves + steady sea breeze + faint distant voices', 'Mỹ Khê, Nha Trang, Phú Quốc beaches', .35, 12.)
def _(c, n):
    w = REG['amb_waves']['fn'](Ctx('amb_waves', c.var, {'dur': n / SR, 'loop': True}))
    wind = rmsn(bp(c.pn(n), 200, 1200), .03) * (.7 + .3 * np.sin(2 * np.pi * .07 * tt(n)))
    return pad(w, n) * .9 + wind + rmsn(lp(babble(c, n, .4, 8), 1200), .008)
@bed('amb_countryside', 'countryside day: birds + distant rooster + buffalo bell + breeze + light insects', 'rice terraces, village lanes, Mai Châu valleys', .3, 12.)
def _(c, n):
    br = events(c, n, .8, lambda: nz(REG[c.ch(['nature_bird_chirp', 'nature_bird_song'])]['fn'](Ctx('nature_bird_chirp', int(c.r.integers(1e6)), {}))) * c.u(.03, .1))
    ro = events(c, n, .05, lambda: lp(nz(REG['nature_rooster']['fn'](Ctx('nature_rooster', int(c.r.integers(1e6)), {}))), 2500) * .06)
    bell = events(c, n, .08, lambda: nz(REG['vn_mo_trau']['fn'](Ctx('vn_mo_trau', int(c.r.integers(1e6)), {}))) * .04)
    breeze = rmsn(bp(c.pn(n), 200, 900), .03) * (.6 + .4 * np.sin(2 * np.pi * .09 * tt(n)))
    ins = bp(c.wn(n), 4500, 6500) * .006
    return br + ro + bell + breeze + ins
@bed('amb_crowd_festival', 'festival crowd: dense babble + cheers swells + distant drums + firecrackers', 'Tết streets, lantern festival, fireworks night', .35)
def _(c, n):
    b = rmsn(babble(c, n, 1.6, 28), .12)
    dr = events(c, n, .15, lambda: lp(nz(REG['vn_lion_dance']['fn'](Ctx('vn_lion_dance', int(c.r.integers(1e6)), {'dur': 2.}))), 2500) * .06)
    fc = events(c, n, .1, lambda: nz(REG['vn_firecracker_string']['fn'](Ctx('vn_firecracker_string', int(c.r.integers(1e6)), {'dur': 1.5}))) * .05)
    return b + dr + fc
@bed('amb_cave', 'cave: deep low air + sparse echoing drips', 'Sơn Đoòng, Phong Nha, Thiên Đường caves', .3)
def _(c, n):
    dr = events(c, n, .8, lambda: nz(REG['nature_drip']['fn'](Ctx('nature_drip', int(c.r.integers(1e6)), {}))) * c.u(.05, .15))
    return verb(dr, 'temple', .5)[:n] + rmsn(lp(c.pn(n), 120, 4), .05)
@bed('amb_fan_room', 'hot room with a ceiling fan (blade swish ~1.6 Hz + motor hum)', 'homestay rooms, old bars, siesta scenes', .3)
def _(c, n):
    t = tt(n); hum = sine(100, n) * .03 + sine(50, n) * .02
    air = rmsn(lp(c.pn(n), 900), .05) * (.65 + .35 * np.sin(2 * np.pi * 1.6 * t))
    return hum + air
@bed('amb_traffic_far', 'distant city hum (lowpassed traffic wash, occasional far horn)', 'rooftops, hotel windows, city at night', .3)
def _(c, n):
    w = rmsn(lp(_tile(c, 'vehicle/highway_loop', n), 700), .06) + rmsn(lp(c.pn(n), 300), .04)
    hn = events(c, n, .2, lambda: lp(nz(REG['vehicle_moto_horn']['fn'](Ctx('vehicle_moto_horn', int(c.r.integers(1e6)), {}))), 1500) * .02)
    return w + hn
@bed('amb_boat_ride', 'boat ride: putt-putt engine + water wash along the hull', 'Mekong boat trips, Tràng An, Hạ Long cruises', .35)
def _(c, n):
    e = REG['vehicle_boat_engine']['fn'](Ctx('vehicle_boat_engine', c.var, {'dur': n / SR}))
    return rmsn(pad(e, n), .08) + rmsn(_tile(c, 'nature/water_loop', n), .06)

# =====================================================================================  public API
NAMES = sorted(REG)
CATEGORIES = ['ui', 'whoosh', 'impact', 'hit', 'riser', 'trans', 'cartoon', 'foley', 'food', 'vehicle', 'amb', 'vn', 'crowd', 'battle', 'nature', 'magic', 'glitch']
def get(name, var=0, **opts):
    """render one sound -> mono float64 ndarray @ 44.1 kHz, peak ~0.9. var: int seed for natural variation."""
    if name not in REG:
        alias = {'whoosh': 'whoosh_med', 'impact': 'impact_big', 'boom': 'hit_boom'}.get(name)
        if not alias: raise KeyError(f'unknown sfx_pro sound: {name}')
        name = alias
    e = REG[name]; c = Ctx(name, var, opts)
    x = np.asarray(e['fn'](c), float)
    return _finish(x, loop=e['loop'] and bool(opts.get('loop', False)))
def describe():
    return {k: {'description': v['description'], 'category': v['category'], 'gain': v['gain'], 'use': v['use'],
                'loop': v['loop'], 'samples': _uses_samples(k)} for k, v in sorted(REG.items())}
@functools.lru_cache(maxsize=None)
def _uses_samples(name):
    import inspect
    try: src = inspect.getsource(REG[name]['fn'])
    except Exception: src = ''
    return ('smp(' in src or 'key, pct' in src or '_tile(' in src)

def _wav(path, x): wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
def demo(out_dir, cats=None):
    os.makedirs(out_dir, exist_ok=True); gap = np.zeros(secs(.35)); tot = 0
    for cat in cats or CATEGORIES:
        parts = []; names = [k for k in NAMES if REG[k]['category'] == cat]
        for k in names:
            x = get(k, 0, dur=4.) if REG[k]['loop'] else get(k, 0)
            parts += [x * REG[k]['gain'] / max(REG[k]['gain'], .3), gap]
        if parts:
            y = np.concatenate(parts); _wav(os.path.join(out_dir, f'{cat}.wav'), y); tot += len(names)
            print(f'{cat:8s} {len(names):3d} sounds  {len(y) / SR:6.1f}s  -> {os.path.join(out_dir, cat + ".wav")}')
    print('total', tot)
def qa(out_md=None, vars_=(0, 1)):
    rows = []
    for k in NAMES:
        res = []
        for v in vars_:
            t0 = time.process_time(); x = get(k, v, dur=6.) if REG[k]['loop'] else get(k, v); dt = time.process_time() - t0; res.append((x, dt))
        x, dt = res[0]
        X = np.abs(np.fft.rfft(x[:secs(4)] * np.hanning(min(len(x), secs(4)))))
        fr = np.fft.rfftfreq(min(len(x), secs(4)), 1 / SR); cen = float((X * fr).sum() / (X.sum() + 1e-12))
        rms = float(np.sqrt(np.mean(x ** 2))); pk = float(np.abs(x).max()); dc = float(np.mean(x))
        edge = max(abs(x[0]), abs(x[-1]))
        y = res[1][0]; m = min(len(x), len(y)); corr = float(np.dot(x[:m], y[:m]) / (np.linalg.norm(x[:m]) * np.linalg.norm(y[:m]) + 1e-12)) if m > 10 else 0
        seam = ''
        if REG[k]['loop']:
            L = get(k, 0, dur=6., loop=True); d1 = np.abs(np.diff(L)).mean(); seam = f'{abs(L[0] - L[-1]) / (d1 + 1e-12):.1f}'
        rows.append((k, REG[k]['category'], len(x) / SR, pk, 20 * np.log10(rms + 1e-12), cen, dc, edge, corr, max(r[1] for r in res), seam))
    hdr = '| name | cat | dur s | peak | RMS dBFS | centroid Hz | DC | edge | corr v0/v1 | CPU s | loop seam |\n|---|---|---|---|---|---|---|---|---|---|---|\n'
    body = ''.join(f'| {r[0]} | {r[1]} | {r[2]:.2f} | {r[3]:.2f} | {r[4]:.1f} | {r[5]:.0f} | {r[6]:.1e} | {r[7]:.1e} | {r[8]:.2f} | {r[9]:.2f} | {r[10]} |\n' for r in rows)
    if out_md: open(out_md, 'w').write(hdr + body)
    else: print(hdr + body)
    return rows

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a or a[0] in ('-h', '--help'): print(__doc__)
    elif a[0] == 'list':
        for k, d in describe().items(): print(f"{k:28s} {d['category']:8s} g={d['gain']:.2f} {'[S]' if d['samples'] else '   '} {d['description']}")
        print(len(NAMES), 'sounds')
    elif a[0] == 'demo': demo(a[1] if len(a) > 1 else 'out/sfx_demo', a[2].split(',') if len(a) > 2 else None)
    elif a[0] == 'render':
        kv = {}
        for s in a[4:]:
            k, v = s.split('='); kv[k] = float(v) if v.replace('.', '', 1).lstrip('-').isdigit() else v
        _wav(a[2], get(a[1], int(a[3]) if len(a) > 3 else 0, **kv)); print('wrote', a[2])
    elif a[0] == 'qa': qa(a[1] if len(a) > 1 else None)
