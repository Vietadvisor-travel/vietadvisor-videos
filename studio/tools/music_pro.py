#!/usr/bin/env python3
"""music_pro: procedural score engine for Vietadvisor Motion Studio. Every sound is synthesised here (numpy/scipy),
so the output is royalty-free by construction. It is a drop-in replacement for tools/music.py.

  python3 tools/music_pro.py score out/x_cues.json out/x_music.wav [--mood adventure] [--seed title]
                                    [--stems out/stems/] [--modulate auto|off|N] [--lufs -16]
  python3 tools/music_pro.py stinger comedy_button out/x.wav [--mood comedy]
  python3 tools/music_pro.py demo out/demos/              # one ~25 s demo per mood + every stinger
  python3 tools/music_pro.py list                         # moods, aliases, stingers

Moods: adventure comedy epic emotional cafe night quiz upbeat chill vn_folk vn_epic mystery tension wonder sneaky
       triumph lofi_hanoi march sad_comedy   (aliases: food history story guide myth countdown versus battle sad ...)
Stingers: comedy_button reveal fail win tension_hit vn_gong chapter transition record_scratch_stop

How the score follows the edit:
 * each scene's beat type sets an energy level (0-4). The section changes on the bar line nearest the cut, and the
   bars are labelled with a song form: intro, A (verse, sparse), B (lift), C (hook, full band), D (climax in the last
   act), build (fill + riser into a bigger section), breakdown (after a peak), end (resolved cadence on the end frame).
 * every 4-bar phrase has a variant number per section label. It rotates the lead instrument, the melodic transform
   (repeat/sequence/inversion/diminution), the register, the counter-melody, the drum and comp patterns, and
   call-and-response swaps, so no 4-bar block plays twice in a row unchanged.
 * hit points: an accent on cuts into hook/title/reveal/chapter/hero moments, a 0.45 s near-silence drop-out before
   reveals and payoffs, a comic "button" at the end of gag/dialogue beats (the music then re-enters on the next bar),
   the melody thins out under narration (subs), an optional key change in the last act, and a V-I cadence on the end frame.
 * the leitmotif contour comes from --seed only, so all moods of one episode (same seed) share one theme, transformed
   by each mood's rhythm feel, mode and instruments (pass the episode slug as the seed from sound_design.py).
 * master: stem reverb (synthetic stereo hall IR), sidechain, tape saturation, glue compression, BS.1770 loudness
   normalisation to -16 LUFS integrated, and a 4x-oversampled true-peak limiter at -1.5 dBTP.
"""
import json, sys, os, hashlib, time
import numpy as np
from scipy.signal import butter, sosfilt, lfilter, oaconvolve, resample_poly
from scipy.ndimage import maximum_filter1d, uniform_filter1d

SR = 44100
TWOPI = 2 * np.pi

# ============================================================================ DSP helpers
_SOS = {}
def _sos(kind, f, o):
    k = (kind, tuple(np.atleast_1d(np.round(f, 1))), o)
    if k not in _SOS:
        if kind == 'band':
            hi = min(SR * .45, f[1]); lo = max(20, min(f[0], hi * .7)); f = [lo, hi]
        else: f = min(max(20, f), SR * .45)
        _SOS[k] = butter(o, f, btype=kind, fs=SR, output='sos')
    return _SOS[k]
def lp(x, f, o=2): return sosfilt(_sos('low', f, o), x, axis=-1)
def hp(x, f, o=2): return sosfilt(_sos('high', f, o), x, axis=-1)
def bp(x, a, b, o=2): return sosfilt(_sos('band', (a, b), o), x, axis=-1)
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tvec(d): return np.arange(max(1, int(SR * d))) / SR
def norm(x, p=1.0):
    m = np.abs(x).max()
    return x * (p / m) if m > 1e-9 else x
def release_env(t, dur, rel, a=.003):
    e = np.clip(t / max(a, 1e-4), 0, 1)
    return e * np.where(t > dur, np.clip(1 - (t - dur) / max(rel, 1e-4), 0, 1) ** 2, 1.0)
def phase_of(freq): return np.cumsum(freq) / SR
def saw_blep(freq, ph0=0.):
    """band-limited sawtooth (polyBLEP) for a per-sample frequency array"""
    assert np.ndim(freq) == 1, "saw_blep needs a per-sample frequency array"
    freq = np.asarray(freq, float)
    dt = np.clip(freq / SR, 1e-6, .45); ph = (np.cumsum(dt) + ph0) % 1.0; y = 2 * ph - 1
    m = ph < dt; t1 = ph[m] / dt[m]; y[m] -= t1 + t1 - t1 * t1 - 1
    m = ph > 1 - dt; t2 = (ph[m] - 1) / dt[m]; y[m] -= t2 * t2 + t2 + t2 + 1
    return y
def square_blep(freq, ph0=0.): return .5 * (saw_blep(freq, ph0) - saw_blep(freq, ph0 + .5))
def pitch_warp(x, cents):
    """time-varying resample: cents (array, len >= len(x)) bends the pitch of x"""
    rate = 2 ** (np.asarray(cents)[:len(x)] / 1200.); pos = np.cumsum(rate) - rate[0]
    pos = pos[pos < len(x) - 1]
    return np.interp(pos, np.arange(len(x)), x)
def pan_gains(p):
    th = (np.clip(p, -1, 1) + 1) * np.pi / 4
    return np.cos(th) * 1.4142, np.sin(th) * 1.4142

class Rng:
    def __init__(s, seed): s.r = np.random.default_rng(seed)
    def f(s, a=0., b=1.): return float(s.r.uniform(a, b))
    def i(s, n): return int(s.r.integers(0, n))
    def ch(s, xs): return xs[s.i(len(xs))]
    def noise(s, n): return s.r.uniform(-1, 1, int(n))
    def p(s, prob): return s.r.random() < prob
    def wch(s, xs, w):
        w = np.asarray(w, float); return xs[int(s.r.choice(len(xs), p=w / w.sum()))]

# ============================================================================ instruments
# every instrument: fn(f, dur, vel, R, **opts) -> mono float array (attack .. release tail); peak ~ vel
INST = {}
def inst(name, cache=True, **meta):
    def deco(fn): INST[name] = dict(fn=fn, cache=cache, **meta); return fn
    return deco

# ---- Karplus-Strong (vectorised with lfilter) + body resonance
_BODY = {}
def body_ir(kind):
    if kind not in _BODY:
        r = np.random.default_rng(7); t = tvec(.09)
        modes = {'guitar': [(98, 30), (204, 40), (390, 55), (580, 70), (1150, 120)],
                 'tranh': [(240, 45), (520, 60), (900, 80), (1700, 120), (2600, 160)],
                 'nguyet': [(180, 40), (360, 55), (740, 80), (1400, 110)],
                 'bass': [(55, 18), (110, 25), (220, 40), (420, 60)],
                 'violin': [(280, 40), (460, 50), (1000, 80), (2700, 140)]}[kind]
        ir = np.zeros_like(t); ir[0] = 1.0
        for f, d in modes: ir += np.sin(TWOPI * f * t + r.uniform(0, 6)) * np.exp(-t * d) * .16
        ir += r.uniform(-1, 1, len(t)) * np.exp(-t * 160) * .25
        _BODY[kind] = ir / np.sqrt(np.sum(ir ** 2))
    return _BODY[kind]

def ks(f, dur, R, bright=.5, t60=2.0, pick=.15, body=None, body_mix=.45):
    N = max(2, int(SR / f)); s = .5 + .45 * bright           # loop-filter weight: s->1 = brighter, less damping
    f0 = SR / (N + 1 - s)
    n = int(SR * dur * f0 / f) + N + 1
    exc = R.noise(N); exc = lp(exc, 600 + 9000 * bright * bright, 1)
    k = int(pick * N)
    if k > 0: exc = exc - np.roll(exc, k)                 # pluck position comb
    g = 10 ** (-3 * (N + 1 - s) / (SR * t60))
    a = np.zeros(N + 2); a[0] = 1; a[N] = -g * s; a[N + 1] = -g * (1 - s)
    x = np.zeros(n); x[:N] = exc
    y = lfilter([1.0], a, x)
    pos = np.arange(int(len(y) * f0 / f)) * (f / f0)        # resample to exact pitch
    y = np.interp(pos, np.arange(len(y)), y)
    if body is not None: y = (1 - body_mix) * y + body_mix * oaconvolve(y, body_ir(body))[:len(y)] * 2.2
    return y

def _ks_inst(f, dur, vel, R, bright, t60, body, rel=.12, maxd=4.0, pick=.15, body_mix=.45):
    d = min(dur, maxd); y = ks(f, d + rel, R, bright * (.7 + .3 * vel), t60, pick, body, body_mix)
    t = np.arange(len(y)) / SR; y *= np.where(t > d, np.clip(1 - (t - d) / rel, 0, 1), 1)
    return norm(y, vel)

@inst('guitar')
def guitar(f, dur, vel, R, **k): return _ks_inst(f, dur, vel, R, .45, 2.4, 'guitar', .15)
@inst('steel')
def steel(f, dur, vel, R, **k): return _ks_inst(f, dur, vel, R, .75, 3.0, 'guitar', .2)
@inst('harp')
def harp(f, dur, vel, R, **k): return _ks_inst(f, max(dur, 1.2), vel, R, .55, 3.2, 'guitar', .6, pick=.5)
@inst('pizz')
def pizz(f, dur, vel, R, **k):
    y = _ks_inst(f, min(dur, .45), vel, R, .4, .5, 'violin', .2, pick=.3, body_mix=.6)
    return norm(hp(y, 90), vel)
@inst('ubass')
def ubass(f, dur, vel, R, **k):   # upright bass pizzicato, harmonics kept for phone speakers
    y = _ks_inst(f, min(dur, 2.0), vel, R, .35, 1.6, 'bass', .1, pick=.22, body_mix=.5)
    return norm(np.tanh(y * 2.2), vel)

def _tranh_like(f, dur, vel, R, opts, bright, t60, body):
    d = min(dur, 3.5) + .5; y = ks(f, d, R, bright * (.7 + .3 * vel), t60, .12, body, .5)
    n = len(y); t = np.arange(n) / SR
    if opts.get('trem'):                                  # đàn nguyệt / tranh tremolo picking on long notes
        rate = 13.0; tr = .55 + .45 * np.abs(np.sin(np.pi * rate * t)) ** 3; y = y * np.where(t < dur, tr, 1)
    cents = np.zeros(n)
    bend = opts.get('bend', 0)                             # nhấn: press to the note from below / above
    if bend: cents += bend * 100 * np.exp(-t * 14)
    if opts.get('nhan_up'):                                # press after the pluck: rises a step
        cents += opts['nhan_up'] * 100 * np.clip((t - .18) / .12, 0, 1)
    if opts.get('rung', 0):                                # rung: left-hand vibrato after the attack
        cents += opts['rung'] * np.sin(TWOPI * 5.6 * t) * np.clip((t - .2) / .3, 0, 1)
    if np.any(cents): y = pitch_warp(y, cents)
    t = np.arange(len(y)) / SR; y = y * np.where(t > dur + .25, np.clip(1 - (t - dur - .25) / .25, 0, 1), 1)
    return norm(y, vel)
@inst('tranh', cache=False)
def tranh(f, dur, vel, R, **k): return _tranh_like(f, dur, vel, R, k, .82, 2.6, 'tranh')
@inst('nguyet', cache=False)
def nguyet(f, dur, vel, R, **k): return _tranh_like(f, dur, vel, R, k, .5, 1.2, 'nguyet')

@inst('bau', cache=False)
def bau(f, dur, vel, R, scoop=0, fall=0, rise=0, rung=28, **k):
    """đàn bầu: a harmonic (flageolet) on one string: near-sine, soft swell, rod bends, widening vibrato"""
    d = dur + .45; t = tvec(d); c = np.zeros_like(t)
    if scoop: c += -scoop * 100 * np.exp(-t * 9)
    if rise: c += rise * 100 * np.clip((t - dur * .45) / max(.12, dur * .25), 0, 1)
    if fall: c += -fall * 100 * np.clip((t - dur * .7) / max(.1, dur * .3), 0, 1) ** 1.5
    c += rung * np.sin(TWOPI * 5.3 * t + R.f(0, 6)) * np.clip((t - .22) / .5, 0, 1) * (1 + .5 * np.clip(t - .8, 0, 1))
    ph = phase_of(f * 2 ** (c / 1200))
    x = np.sin(TWOPI * ph) + .22 * np.sin(2 * TWOPI * ph) + .07 * np.sin(3 * TWOPI * ph) + .025 * np.sin(5 * TWOPI * ph)
    click = lp(R.noise(len(t)), 3000) * np.exp(-t * 220) * .25
    e = (1 - np.exp(-t * 60)) * np.exp(-t * .55) * (1 + .1 * np.sin(TWOPI * 5.3 * t) * np.clip(t - .3, 0, 1))
    e *= np.where(t > dur, np.clip(1 - (t - dur) / .45, 0, 1) ** 1.5, 1)
    y = np.tanh((x * e + click) * 1.3)                     # the electric (pickup) đàn bầu is slightly driven
    return norm(y, vel)

@inst('sao', cache=False)
def sao(f, dur, vel, R, grace=0, vib=1.0, **k):
    """sáo trúc: breathy sine, chiff, scoop, delayed vibrato; grace = semitones of a luyến grace note above"""
    d = dur + .12; t = tvec(d); c = -35 * np.exp(-t * 25)
    if grace: g = .06; c += np.where(t < g, grace * 100, 0) * 1.0
    c += vib * 16 * np.sin(TWOPI * 5.2 * t + R.f(0, 6)) * np.clip((t - .25) / .35, 0, 1)
    ph = phase_of(f * 2 ** (c / 1200))
    x = np.sin(TWOPI * ph) + .28 * np.sin(2 * TWOPI * ph + .5) + .1 * np.sin(3 * TWOPI * ph) + .035 * np.sin(4 * TWOPI * ph)
    br = bp(R.noise(len(t)), max(300, f * .9), min(16000, f * 3.2)) * (.16 + .06 * np.sin(TWOPI * 5.2 * t))
    chiff = bp(R.noise(len(t)), 1800, 6000) * np.exp(-t * 60) * .3
    e = release_env(t, dur, .1, .035) * (1 + .06 * np.sin(TWOPI * 5.2 * t) * np.clip((t - .25) / .35, 0, 1))
    return norm((x + br + chiff) * e, vel)
@inst('piccolo', cache=False)
def piccolo(f, dur, vel, R, **k): return sao(f, dur, vel, R, vib=.7, **k)

@inst('clarinet')
def clarinet(f, dur, vel, R, **k):
    d = dur + .1; t = tvec(d); fr = f * (1 + .0025 * np.sin(TWOPI * 5 * t) * np.clip((t - .3) / .3, 0, 1))
    x = lp(square_blep(fr, R.f()), min(9000, f * (3 + 3 * vel)), 2)
    x += bp(R.noise(len(t)), f, f * 4) * .05
    return norm(hp(x * release_env(t, dur, .07, .03), 120), vel)
@inst('bassoon')
def bassoon(f, dur, vel, R, **k):
    d = dur + .08; t = tvec(d); fr = f * (1 - .01 * np.exp(-t * 30))
    s = saw_blep(fr, R.f()); x = bp(s, 300, 900) * 1.2 + bp(s, 1000, 1500) * .5 + lp(s, f * 2.5) * .5
    return norm(x * release_env(t, dur, .06, .02), vel)
@inst('accordion')
def accordion(f, dur, vel, R, **k):
    d = dur + .1; t = tvec(d)
    x = sum(saw_blep(np.full(len(t), f * 2 ** (c / 1200)), R.f()) * w + square_blep(np.full(len(t), f * 2 ** (c / 1200)), R.f()) * w * .6 for c, w in ((-9, .5), (0, .6), (11, .5)))
    x = bp(x, 250, 3800) * (1 + .05 * np.sin(TWOPI * 3.2 * t))
    return norm(x * release_env(t, dur, .08, .04), vel)

def _brass(f, dur, vel, R, cut_lo, cut_hi, att_f, att_a, rel, voices=(-5, 0, 6), scoop=40):
    d = dur + rel; t = tvec(d)
    pe = 2 ** ((-scoop * np.exp(-t / .035) + 9 * np.sin(TWOPI * 5.2 * t) * np.clip((t - .35) / .3, 0, 1)) / 1200)
    x = sum(saw_blep(f * pe * 2 ** (c / 1200), R.f()) for c in voices) / len(voices)
    dark = lp(x, min(cut_lo, SR * .4), 2); bright = lp(x, min(cut_hi * (.6 + .5 * vel), SR * .4), 2)
    fe = np.clip(t / att_f, 0, 1) * (.55 + .45 * np.exp(-np.clip(t - att_f, 0, None) * 4)) * vel   # filter env
    fe = np.where(t > dur, fe * np.clip(1 - (t - dur) / rel, 0, 1), fe)
    y = dark * (1 - fe) + bright * fe + bp(R.noise(len(t)), 800, 4000) * .02 * np.exp(-t * 20)
    return norm(y * release_env(t, dur, rel, att_a), vel)
@inst('trumpet')
def trumpet(f, dur, vel, R, **k): return _brass(f, dur, vel, R, f * 1.8 + 300, f * 7 + 2500, .05, .02, .1)
@inst('horn')
def horn(f, dur, vel, R, **k): return _brass(f, dur, vel, R, f * 1.3 + 200, f * 3.5 + 900, .14, .07, .25, scoop=25)
@inst('trombone')
def trombone(f, dur, vel, R, **k): return _brass(f, dur, vel, R, f * 1.6 + 200, f * 5 + 1500, .07, .03, .12)
@inst('tuba')
def tuba(f, dur, vel, R, **k):
    y = _brass(f, dur, vel, R, f * 2 + 150, f * 6 + 700, .05, .02, .08, scoop=30)
    return norm(np.tanh(y * 1.8), vel)                      # 2nd/3rd harmonics carry it on phones
@inst('brass_sec')
def brass_sec(f, dur, vel, R, **k):
    hi = _brass(f, dur, vel, R, f * 1.8 + 300, f * 7 + 2500, .05, .02, .12, voices=(-8, -3, 0, 4, 9))
    lo = _brass(f / 2, dur, vel, R, f + 200, f * 4 + 1500, .07, .03, .12, voices=(-6, 0, 7))
    m = min(len(hi), len(lo)); return norm(hi[:m] + .6 * lo[:m], vel)

def _strings(f, dur, vel, R, att=.22, rel=.45, voices=4, vib=1.0, cut=1.0, det=7):
    d = dur + rel; t = tvec(d); x = np.zeros_like(t)
    for v in range(voices):
        c = R.f(-det, det); vr = R.f(4.8, 6.2); vd = vib * R.f(.0025, .0045)
        fr = f * 2 ** (c / 1200) * (1 + vd * np.sin(TWOPI * vr * t + R.f(0, 6)) * np.clip((t - .12) / .4, 0, 1))
        x += saw_blep(fr, R.f())
    x = lp(x / voices, min(SR * .4, (1800 + f * 2.5) * cut * (.6 + .5 * vel)), 2)
    x = hp(x, 110) + bp(x, 700, 1400) * .35                # violin-family formant lift (phone band)
    x += bp(R.noise(len(t)), 2000, 7000) * .02             # bow noise
    a = np.clip(t / att, 0, 1) ** 1.6
    return norm(x * a * np.where(t > dur, np.clip(1 - (t - dur) / rel, 0, 1) ** 1.5, 1), vel)
@inst('strings')
def strings(f, dur, vel, R, att=.25, **k): return _strings(f, dur, vel, R, att=att)
@inst('strings_hi')
def strings_hi(f, dur, vel, R, **k): return _strings(f, dur, vel, R, att=.06, rel=.3, voices=5, cut=1.3)
@inst('violin')
def violin(f, dur, vel, R, **k):
    y = _strings(f, dur, vel, R, att=.07, rel=.25, voices=1, vib=1.9, cut=1.25)
    return norm(y + .5 * oaconvolve(y, body_ir('violin'))[:len(y)], vel)
@inst('cello')
def cello(f, dur, vel, R, **k):
    y = _strings(f, dur, vel, R, att=.1, rel=.3, voices=2, vib=1.5, cut=.9)
    return norm(y + .4 * oaconvolve(y, body_ir('violin'))[:len(y)], vel)
@inst('spicc')
def spicc(f, dur, vel, R, **k): return _strings(f, min(dur, .16), vel, R, att=.012, rel=.12, voices=4, cut=1.4)

@inst('choir')
def choir(f, dur, vel, R, **k):
    d = dur + .6; t = tvec(d); x = np.zeros_like(t)
    for v in range(4):
        fr = f * 2 ** (R.f(-9, 9) / 1200) * (1 + .004 * np.sin(TWOPI * R.f(4.5, 5.8) * t + R.f(0, 6)))
        x += saw_blep(fr, R.f())
    y = bp(x, 550, 900) * 1.0 + bp(x, 1000, 1350) * .55 + bp(x, 2400, 3100) * .25
    return norm(y * np.clip(t / .45, 0, 1) * np.where(t > dur, np.clip(1 - (t - dur) / .6, 0, 1), 1), vel)

@inst('pad')
def pad(f, dur, vel, R, cut=1.0, **k):
    d = dur + .8; t = tvec(d)
    x = sum(saw_blep(np.full(len(t), f * 2 ** (c / 1200)), R.f()) for c in (-12, -4, 5, 13)) / 4
    y = lp(x, min(SR * .4, (700 + f * 2) * cut), 2)
    return norm(y * np.clip(t / .6, 0, 1) ** 1.5 * np.where(t > dur, np.clip(1 - (t - dur) / .8, 0, 1), 1), vel)
@inst('pad_air')
def pad_air(f, dur, vel, R, **k):
    y = pad(f, dur, 1, R, cut=1.6); t = np.arange(len(y)) / SR
    air = bp(R.noise(len(y)), f * 3, min(16000, f * 9)) * .12 * np.clip(t / 1.0, 0, 1) * np.where(t > dur, np.clip(1 - (t - dur) / .8, 0, 1), 1)
    return norm(y + air, vel)
@inst('pluck_syn')
def pluck_syn(f, dur, vel, R, **k):
    d = min(dur, 1.0) + .5; t = tvec(d)
    x = (saw_blep(np.full(len(t), f * 2 ** (-6 / 1200)), R.f()) + saw_blep(np.full(len(t), f * 2 ** (6 / 1200)), R.f())) * .5
    fe = np.exp(-t * 16); y = lp(x, f * 1.5 + 200) * (1 - fe) + lp(x, 7000) * fe
    return norm(y * np.exp(-t * 3.2) * np.clip(t / .002, 0, 1), vel)
@inst('saw_lead')
def saw_lead(f, dur, vel, R, **k):
    d = dur + .1; t = tvec(d); fr = f * (1 + .004 * np.sin(TWOPI * 5.5 * t) * np.clip((t - .2) / .3, 0, 1))
    x = (saw_blep(fr * 2 ** (-7 / 1200), R.f()) + saw_blep(fr * 2 ** (7 / 1200), R.f())) * .5
    return norm(lp(x, 3200) * release_env(t, dur, .08, .01), vel)

# ---- keys & mallets
@inst('piano')
def piano(f, dur, vel, R, **k):
    rel = .3; d = min(dur, 5.0); t = tvec(d + rel); x = np.zeros_like(t); B = .00025
    dbase = .5 + f / 260 * .8
    for h in range(1, 16):
        fh = h * f * np.sqrt(1 + B * h * h)
        if fh > 11000: break
        a = h ** -(1.7 - .8 * vel); dk = dbase * (1 + .3 * (h - 1))
        env = .62 * np.exp(-t * dk * 2.4) + .38 * np.exp(-t * dk * .42)
        x += a * env * (np.sin(TWOPI * fh * t + R.f(0, 6)) + .8 * np.sin(TWOPI * fh * 1.0007 * t + R.f(0, 6)))
    x += lp(R.noise(len(t)), 2200) * np.exp(-t * 250) * .25 * vel
    x *= np.clip(t / .002, 0, 1) * np.where(t > d, np.exp(-(t - d) * 18), 1)
    return norm(x, vel)
@inst('epiano')
def epiano(f, dur, vel, R, trem=0, **k):
    d = min(dur, 4) + .35; t = tvec(d)
    I = (.8 + 2.2 * vel) * np.exp(-t * 3.5) + .25
    x = np.sin(TWOPI * f * t + I * np.sin(TWOPI * f * t)) * np.exp(-t * (.9 + f / 900))
    x += .22 * vel * np.sin(TWOPI * f * t + 1.2 * np.exp(-t * 25) * np.sin(TWOPI * 14 * f * t)) * np.exp(-t * 9)   # tine
    if trem: x *= 1 + .3 * np.sin(TWOPI * 4.6 * t)
    return norm(x * release_env(t, min(dur, 4), .3, .002), vel)
def _mallet(f, dur, vel, R, parts, maxd, thump=.15):
    t = tvec(maxd); x = np.zeros_like(t)
    for r, a, dcy in parts:
        if f * r < 16000: x += a * np.sin(TWOPI * f * r * t + R.f(0, 6)) * np.exp(-t * dcy)
    x += lp(R.noise(len(t)), 1500) * np.exp(-t * 200) * thump
    return norm(x * np.clip(t / .001, 0, 1), vel)
@inst('marimba')
def marimba(f, dur, vel, R, **k): return _mallet(f, dur, vel, R, [(1, 1, 4.5), (3.93, .3 * vel, 14), (9.2, .1 * vel, 35)], 1.4)
@inst('xylo')
def xylo(f, dur, vel, R, **k): return _mallet(f, dur, vel, R, [(1, 1, 9), (3.0, .5 * vel, 18), (6.1, .2 * vel, 35)], .8, .25)
@inst('glock')
def glock(f, dur, vel, R, **k): return _mallet(f, dur, vel, R, [(1, 1, 2.2), (2.76, .4, 5), (5.4, .2 * vel, 11), (8.9, .08, 20)], 2.4, .05)
@inst('celesta')
def celesta(f, dur, vel, R, **k): return _mallet(f, dur, vel, R, [(1, 1, 3), (2, .18, 7), (3.95, .1, 14)], 2.0, .08)
@inst('vibes')
def vibes(f, dur, vel, R, **k):
    y = _mallet(f, dur, vel, R, [(1, 1, 1.0), (4.0, .18 * vel, 4), (10.0, .05, 10)], 2.8, .06)
    t = np.arange(len(y)) / SR; return y * (1 + .28 * np.sin(TWOPI * 5.4 * t))
@inst('bell')
def bell(f, dur, vel, R, **k):
    t = tvec(3.2); I = 3.2 * vel * np.exp(-t * 2.2)
    x = np.sin(TWOPI * f * t + I * np.sin(TWOPI * f * 3.5 * t)) * np.exp(-t * 1.3) + .3 * np.sin(TWOPI * f * 2.0 * t) * np.exp(-t * 2.5)
    return norm(x * np.clip(t / .001, 0, 1), vel)

# ---- bass
@inst('ebass')
def ebass(f, dur, vel, R, **k):
    d = min(dur, 3) + .08; t = tvec(d); ph = TWOPI * f * t
    x = np.sin(ph) + .5 * np.sin(2 * ph) + .22 * np.sin(3 * ph) + .08 * np.sin(4 * ph)
    x = np.tanh(x * 1.6) * (np.exp(-t * 1.4) * .8 + .2) + lp(R.noise(len(t)), 1200) * np.exp(-t * 300) * .2
    return norm(lp(x, 2200) * release_env(t, min(dur, 3), .06, .004), vel)
@inst('subbass')
def subbass(f, dur, vel, R, **k):
    d = dur + .1; t = tvec(d); ph = TWOPI * f * t
    x = np.tanh((np.sin(ph) + .25 * np.sin(2 * ph)) * 1.8) + .12 * np.sin(3 * ph)
    return norm(x * release_env(t, dur, .1, .01), vel)
@inst('synbass')
def synbass(f, dur, vel, R, **k):
    d = dur + .05; t = tvec(d); x = saw_blep(np.full(len(t), f), R.f()) * .6 + square_blep(np.full(len(t), f * 1.003), R.f()) * .4
    fe = np.exp(-t * 12); y = lp(x, f * 2 + 150) * (1 - fe) + lp(x, 2800) * fe
    return norm(np.tanh(y * 1.5) * release_env(t, dur, .04, .003), vel)

# ---- drums & percussion (stem: drums)
def _tone_drum(R, f0, f1, k, dec, noise=.3, nlp=3000, d=.6, extra=()):
    t = tvec(d); fr = f1 + (f0 - f1) * np.exp(-t * k)
    x = np.sin(TWOPI * phase_of(fr)) * np.exp(-t * dec)
    for r, a, dc in extra: x += a * np.sin(TWOPI * phase_of(fr * r)) * np.exp(-t * dc)
    x += lp(R.noise(len(t)), nlp) * np.exp(-t * 90) * noise
    return x
@inst('kick')
def kick(f, dur, vel, R, **k):
    x = _tone_drum(R, 160, 50, 32, 6.5, .2, 4000, .5); t = tvec(.5)
    x += bp(R.noise(len(x)), 1500, 5000) * np.exp(-t * 300) * .45 + np.sin(TWOPI * 1900 * t) * np.exp(-t * 180) * .15   # beater click (phone band)
    return norm(np.tanh(x * 1.8), vel)
@inst('kick_soft')
def kick_soft(f, dur, vel, R, **k): return norm(lp(_tone_drum(R, 110, 48, 25, 7, .1, 1500, .45), 1800), vel)
@inst('kick_lofi')
def kick_lofi(f, dur, vel, R, **k): return norm(lp(np.tanh(_tone_drum(R, 130, 52, 28, 8, .25, 2500, .4) * 2.5), 2600), vel)
@inst('snare')
def snare(f, dur, vel, R, **k):
    t = tvec(.35); x = (np.sin(TWOPI * 185 * t) * np.exp(-t * 28) + .6 * np.sin(TWOPI * 330 * t) * np.exp(-t * 35)) * .6
    nz = R.noise(len(t)); x += (hp(lp(nz, 9000), 1200) * np.exp(-t * 17) + bp(nz, 2500, 6000) * np.exp(-t * 40) * .6)
    return norm(x, vel)
@inst('snare_lofi')
def snare_lofi(f, dur, vel, R, **k): return norm(lp(np.tanh(snare(0, 0, 1, R) * 2), 5000), vel)
@inst('rim')
def rim(f, dur, vel, R, **k):
    t = tvec(.08); return norm((np.sin(TWOPI * 1700 * t) + .6 * np.sin(TWOPI * 820 * t)) * np.exp(-t * 70) + hp(R.noise(len(t)), 2000) * np.exp(-t * 150) * .5, vel)
@inst('clap')
def clap(f, dur, vel, R, **k):
    t = tvec(.35); e = sum((t >= j * .009) * np.exp(-np.clip(t - j * .009, 0, None) * 140) for j in range(4)) + np.exp(-t * 16) * .45
    return norm(bp(R.noise(len(t)), 900, 5500) * e, vel)
@inst('hat')
def hat(f, dur, vel, R, **k):
    t = tvec(.08); m = sum(square_blep(np.full(len(t), r * 40.0), R.f()) for r in (2, 3, 4.16, 5.43, 6.79, 8.21))
    return norm(hp(m * .4 + R.noise(len(t)), 7500) * np.exp(-t * 65), vel)
@inst('hat_open')
def hat_open(f, dur, vel, R, **k):
    t = tvec(.45); m = sum(square_blep(np.full(len(t), r * 40.0), R.f()) for r in (2, 3, 4.16, 5.43, 6.79, 8.21))
    return norm(hp(m * .4 + R.noise(len(t)), 7000) * np.exp(-t * 8), vel)
@inst('ride')
def ride(f, dur, vel, R, **k):
    t = tvec(1.2); x = sum(np.sin(TWOPI * fr * t + R.f(0, 6)) * a for fr, a in ((3150, .4), (4810, .3), (5920, .2), (7400, .15)))
    return norm((x * np.exp(-t * 3.5) + hp(R.noise(len(t)), 6000) * np.exp(-t * 12) * .6), vel)
@inst('crash')
def crash(f, dur, vel, R, **k):
    t = tvec(2.6); x = hp(R.noise(len(t)), 3500) * np.exp(-t * 1.9) + bp(R.noise(len(t)), 600, 3000) * np.exp(-t * 4) * .4
    return norm(x * np.clip(t / .004, 0, 1), vel)
@inst('tom')
def tom(f, dur, vel, R, **k): return norm(_tone_drum(R, f * 1.5, f, 20, 7, .2, 2500, .6, ((1.5, .3, 12),)), vel)
@inst('shaker')
def shaker(f, dur, vel, R, **k):
    t = tvec(.1); return norm(bp(R.noise(len(t)), 3500, 11000) * np.sin(np.pi * np.minimum(1, t / .1)) ** 2, vel)
@inst('tamb')
def tamb(f, dur, vel, R, **k):
    t = tvec(.25); jingle = sum(np.sin(TWOPI * fr * t) for fr in (5200, 6800, 8100)) * .2
    return norm((hp(R.noise(len(t)), 5000) + jingle) * np.exp(-t * 14), vel)
@inst('snap')
def snap(f, dur, vel, R, **k):
    t = tvec(.08); return norm(bp(R.noise(len(t)), 1500, 4500) * np.exp(-t * 90) + np.sin(TWOPI * 2100 * t) * np.exp(-t * 120) * .3, vel)
@inst('brush')
def brush(f, dur, vel, R, **k):
    t = tvec(.22); return norm(bp(R.noise(len(t)), 1500, 9000) * np.sin(np.pi * np.minimum(1, t / .22)) ** .7 * np.exp(-t * 6), vel)
@inst('woodblock')
def woodblock(f, dur, vel, R, **k):
    t = tvec(.12); ff = f or 1200; return norm((np.sin(TWOPI * ff * t) + .4 * np.sin(TWOPI * ff * 2.6 * t)) * np.exp(-t * 50) + bp(R.noise(len(t)), 1000, 5000) * np.exp(-t * 300) * .3, vel)
@inst('cowbell')
def cowbell(f, dur, vel, R, **k):
    t = tvec(.3); x = square_blep(np.full(len(t), 540.0)) + square_blep(np.full(len(t), 800.0))
    return norm(bp(x, 500, 3000) * (np.exp(-t * 25) * .6 + np.exp(-t * 6) * .4), vel)
@inst('triangle')
def triangle(f, dur, vel, R, **k):
    t = tvec(1.8); return norm(sum(np.sin(TWOPI * fr * t) * a for fr, a in ((5100, .6), (6900, .4), (8700, .3))) * np.exp(-t * 2.2), vel)
@inst('timpani')
def timpani(f, dur, vel, R, **k):
    t = tvec(2.2); fr = f * (1 + .015 * np.exp(-t * 6)); x = np.zeros_like(t)
    for r, a, dc in ((1, 1, 1.8), (1.504, .5, 3), (1.742, .3, 4), (2.0, .25, 4.5), (2.245, .15, 6)):
        x += a * np.sin(TWOPI * phase_of(fr * r)) * np.exp(-t * dc)
    x += lp(R.noise(len(t)), 900) * np.exp(-t * 40) * .5
    return norm(np.tanh(x * 1.3), vel)
@inst('taiko')
def taiko(f, dur, vel, R, **k):
    x = _tone_drum(R, (f or 62) * 1.5, f or 62, 18, 4.2, .6, 1100, 1.0, ((1.6, .35, 9), (2.3, .15, 14)))
    return norm(np.tanh(x * 1.5), vel)
@inst('trong')
def trong(f, dur, vel, R, **k):      # trống trận / trống cái: big barrel drum, long ring + stick slap
    x = _tone_drum(R, (f or 78) * 1.35, f or 78, 14, 3.0, .5, 1800, 1.4, ((1.59, .4, 6), (2.14, .25, 9), (2.65, .12, 12)))
    return norm(np.tanh(x * 1.4), vel)
@inst('trong_rim')
def trong_rim(f, dur, vel, R, **k):  # "cắc": stick on the wooden body
    t = tvec(.1); return norm(np.sin(TWOPI * 1050 * t) * np.exp(-t * 60) + bp(R.noise(len(t)), 1500, 5000) * np.exp(-t * 180) * .7, vel)
@inst('trong_nho')
def trong_nho(f, dur, vel, R, **k):  # small drum (trống cơm-like, pitched "tùng")
    return norm(_tone_drum(R, (f or 190) * 1.25, f or 190, 22, 9, .25, 3000, .45, ((1.5, .25, 18),)), vel)
@inst('mo')
def mo(f, dur, vel, R, **k):         # mõ: hollow wooden slit drum
    t = tvec(.18); ff = f or 820
    return norm((np.sin(TWOPI * ff * t) + .35 * np.sin(TWOPI * ff * 2.3 * t)) * np.exp(-t * 34) + bp(R.noise(len(t)), 800, 3000) * np.exp(-t * 200) * .3, vel)
@inst('songlang')
def songlang(f, dur, vel, R, **k):   # song lang: the foot clapper that marks strong beats in tài tử
    t = tvec(.07); return norm((np.sin(TWOPI * 2300 * t) + .4 * np.sin(TWOPI * 3550 * t)) * np.exp(-t * 110) + hp(R.noise(len(t)), 3000) * np.exp(-t * 400) * .4, vel)
@inst('chieng')
def chieng(f, dur, vel, R, **k):     # chiêng: knobbed gong, clear pitch, beating partials, bloom
    t = tvec(4.5); ff = f or 196; x = np.zeros_like(t)
    for r, a, dc in ((1, 1, .7), (2.01, .45, 1.1), (2.76, .3, 1.5), (3.6, .18, 2.2), (4.9, .1, 3)):
        x += a * (np.sin(TWOPI * ff * r * t + R.f(0, 6)) + .7 * np.sin(TWOPI * (ff * r + .45 * r) * t)) * np.exp(-t * dc)
    x = x * (1 - np.exp(-t * 45)) + lp(R.noise(len(t)), 600) * np.exp(-t * 30) * .35
    return norm(x, vel)
@inst('gong_big')
def gong_big(f, dur, vel, R, **k):   # tam-tam style: inharmonic cloud that blooms
    t = tvec(5.0); x = np.zeros_like(t); r = np.random.default_rng(3)
    for j in range(28):
        fr = 90 * np.exp(r.uniform(0, np.log(40))); x += np.sin(TWOPI * fr * t + r.uniform(0, 6)) * np.exp(-t * (.5 + fr / 2500)) / (1 + j * .1)
    bloom = np.clip(t / .35, 0, 1) ** .8
    x = x * (.3 + .7 * bloom) + lp(R.noise(len(t)), 300) * np.exp(-t * 6) * .8
    return norm(x, vel)

# ---- FX (stem: fx)
@inst('riser', cache=False)
def riser(f, dur, vel, R, **k):
    t = tvec(dur); c = (t / dur) ** 2
    sw = np.zeros_like(t); nz = R.noise(len(t)); seg = 2048
    for i in range(0, len(t), seg):
        fc = 400 + 7000 * c[min(i, len(t) - 1)]; sw[i:i + seg] = bp(nz[i:i + seg], fc * .7, min(SR * .45, fc * 1.4))
    base = f or 220; tone = saw_blep(base * 2 ** (2 * c), R.f()) * .25 + saw_blep(base * 1.5 * 2 ** (2 * c), R.f()) * .15
    return norm((sw + lp(tone, 3000)) * c ** 1.3 * np.clip((dur - t) / .02, 0, 1), vel)
@inst('revcym')
def revcym(f, dur, vel, R, **k): return norm(crash(0, 0, 1, R)[::-1][-int(SR * max(.3, min(dur, 2.5))):], vel)
@inst('subdrop')
def subdrop(f, dur, vel, R, **k):
    t = tvec(1.8); fr = np.geomspace(110, 34, len(t)); ph = phase_of(fr)
    x = np.sin(TWOPI * ph) * np.exp(-t * 1.8) + .35 * np.sin(2 * TWOPI * ph) * np.exp(-t * 3) + .2 * np.sin(4 * TWOPI * ph) * np.exp(-t * 6)
    return norm(np.tanh(x * 1.6), vel)
@inst('impact')
def impact(f, dur, vel, R, **k):
    t = tvec(1.6); x = np.sin(TWOPI * phase_of(np.geomspace(140, 45, len(t)))) * np.exp(-t * 3.5)
    x += bp(R.noise(len(t)), 200, 2500) * np.exp(-t * 14) * .8 + hp(R.noise(len(t)), 4000) * np.exp(-t * 5) * .15
    return norm(np.tanh(x * 1.5), vel)
@inst('whoosh')
def whoosh(f, dur, vel, R, **k):
    d = dur or .8; t = tvec(d); nz = R.noise(len(t)); y = np.zeros_like(t); seg = 1024
    for i in range(0, len(t), seg):
        u = i / len(t); fc = 500 + 3500 * np.sin(np.pi * u); y[i:i + seg] = bp(nz[i:i + seg], fc * .6, fc * 1.6)
    return norm(y * np.sin(np.pi * t / d) ** 2, vel)
@inst('scratch', cache=False)
def scratch(f, dur, vel, R, **k):
    d = .5; t = tvec(d); mv = np.sin(TWOPI * 3.2 * t) * np.exp(-t * 1.5)  # forward/back hand motion
    rate = 1 + 2.5 * np.abs(mv); nz = R.noise(len(t)); y = np.zeros_like(t); seg = 256
    for i in range(0, len(t), seg): fc = 300 + 2200 * rate[i] / 3.5; y[i:i + seg] = bp(nz[i:i + seg], fc * .7, fc * 1.5)
    tone = np.sin(TWOPI * phase_of(220 * rate)) * .5
    return norm((y + tone) * np.abs(mv) ** .5 * np.clip((d - t) / .03, 0, 1), vel)
@inst('crackle', cache=False)
def crackle_inst(f, dur, vel, R, **k):
    n = int(SR * dur); x = np.zeros(n); idx = R.r.integers(0, n, max(1, n // 1800)); x[idx] = R.noise(len(idx)) * R.r.random(len(idx)) ** 2
    return hp(lp(x, 5000), 700) * 1.2 + lp(R.noise(n), 300) * .01

# ============================================================================ theory
MAJ = [0, 2, 4, 5, 7, 9, 11]; MIN = [0, 2, 3, 5, 7, 8, 10]; DOR = [0, 2, 3, 5, 7, 9, 10]; LYD = [0, 2, 4, 6, 7, 9, 11]
HMIN = [0, 2, 3, 5, 7, 8, 11]; MIXO = [0, 2, 4, 5, 7, 9, 10]; PHR = [0, 1, 3, 5, 7, 8, 10]
PMAJ = [0, 2, 4, 7, 9]; PMIN = [0, 3, 5, 7, 10]
BAC = [0, 2, 5, 7, 9]          # điệu Bắc: hò xự xang xê cống ~ C D F G A (bright, joyful)
OAN = [0, 3, 5, 7, 8]          # điệu Nam / hơi Oán ~ C Eb+ F G Ab+ (melancholy; xự and cống raised, rung on xang/cống)
OAN_MICRO = {3: 30, 8: 45}     # cents offsets by semitone class (performance-practice approximation)
CHROM = {'b2': (1, 'M'), 'b3': (3, 'M'), 'b6': (8, 'M'), 'b7': (10, 'M'), 'D': (7, 'M7'), 'IV': (5, 'M'), 'II': (2, 'M')}

def chord_pcs(spec, st):
    """chord spec (scale degree int or chromatic name) -> (root semitone, [semitones above key root])"""
    hs = st['hs']; ext = st.get('ext', '')
    if isinstance(spec, str):
        r, q = CHROM[spec]; notes = [r, r + 4, r + 7] + ([r + 10] if q == 'M7' else [])
        if ext in ('7', '9') and q == 'M': notes.append(r + (10 if spec in ('b7', 'b3', 'b6') else 11))
        return r, notes
    deg = spec; sc = lambda k: hs[(deg + k) % 7] + 12 * ((deg + k) // 7)
    r = sc(0)
    if ext == 'open': return r, [r, sc(4), sc(1) + 12]                    # root-5th-9th (VN moods: no 3rd)
    notes = [r, sc(2), sc(4)]
    if ext == 'sus2': notes[1] = sc(1)
    if ext in ('7', '9'): notes.append(sc(6))
    if ext in ('9', 'add9'): notes.append(sc(1) + 12)
    return r, notes

def voice(notes, root, prev, lo=52, hi=74):
    """voice-led voicing of chord tones (semitones relative to key root midi already added)"""
    pcs = sorted(set(n % 12 for n in notes)); best, bc = None, 1e9
    for inv in range(len(pcs)):
        for base in range(lo - 12, hi):
            if base % 12 != pcs[inv]: continue
            v = [base];
            for p in pcs[inv + 1:] + pcs[:inv]:
                n = v[-1] + 1
                while n % 12 != p: n += 1
                v.append(n)
            if v[0] < lo or v[-1] > hi: continue
            c = sum(min(abs(a - b) for b in prev) for a in v) if prev else abs(np.mean(v) - (lo + hi) / 2) * 2
            if c < bc: best, bc = v, c
    return best or sorted(lo + (p - lo) % 12 for p in pcs)

def scale_midis(st, lo, hi, root):
    out = []
    for o in range(-2, 8):
        for s in st['ms']:
            m = root + s + 12 * o
            if lo <= m <= hi: out.append(m)
    return sorted(out)

# ============================================================================ styles (moods)
FEELS = {   # rhythm cells (onset, dur) per 1 or 2 beats
    'bouncy': [[(0, .5), (.5, .5)], [(0, 1)], [(0, .75), (.75, .25)], [(0, .5)], [(0, 1.5), (1.5, .5)], [(0, .5), (.5, .5), (1, 1)]],
    'lyrical': [[(0, 1)], [(0, 2)], [(0, 1.5), (1.5, .5)], [(0, 1), (1, 1)], [(0, 3)]],
    'driving': [[(0, .5), (.5, .5)], [(0, .25), (.25, .25), (.5, .5)], [(0, 1)], [(0, .5), (.5, .5), (1, .5), (1.5, .5)]],
    'sparse': [[(0, 2)], [(0, 1), (1, 1)], [(0, 3)], [(0, 1.5), (1.5, .5)], [(0, 4)]],
    'sneaky': [[(0, .25), (.5, .25)], [(0, .5)], [(0, .25), (.25, .25), (.5, .25)], [(0, .25), (1, .25)], [(0, .75), (.75, .25)]],
    'folk': [[(0, .5), (.5, .5)], [(0, 1.5), (1.5, .5)], [(0, 1)], [(0, .25), (.25, .25), (.5, 1)], [(0, 2)]],
    'fanfare': [[(0, .75), (.75, .25)], [(0, 1)], [(0, .33), (.33, .33), (.67, .33)], [(0, 2)], [(0, .5), (.5, .5)]],
}
def M(**k): return k
STYLES = {
 'adventure': M(bpm=112, root=62, hs=MAJ, ms=PMAJ, ext='', prog=dict(A=[0, 4, 5, 3], B=[3, 4, 2, 5], C=[3, 0, 4, 5], X=[5, 3, 0, 4]),
                kit='pop', bass='pop', bass_inst='ebass', comp=['strum', 'stabs'], comp_inst=['steel', 'piano'], pad='strings',
                leads=['tranh', 'sao', 'trumpet', 'steel'], counter=['horn', 'strings', 'sao'], arp='harp', feel='bouncy', hit='orch', verb=1.5, mod=2),
 'comedy': M(balance='comic', bpm=108, root=60, hs=MAJ, ms=MAJ, ext='', prog=dict(A=[0, 3, 4, 0], B=[5, 1, 4, 0], C=[0, 5, 3, 4], X=[3, 'b6', 4, 0]),
             kit='comedy', bass='oompah', bass_inst='tuba', comp=['pizz_off'], comp_inst=['pizz'], pad=None,
             leads=['bassoon', 'xylo', 'clarinet', 'pizz'], counter=['clarinet', 'glock', 'bassoon'], arp=None, feel='bouncy', hit='comedy', verb=1.0, chromatic=True, mod=1, swing=.1),
 'epic': M(balance='drive', bpm=92, root=62, hs=MIN, ms=MIN, ext='', prog=dict(A=[0, 5, 2, 6], B=[5, 2, 6, 3], C=[0, 6, 5, 'D'], X=[5, 6, 0, 0]),
           kit='epic', bass='ostinato', bass_inst='cello', comp=['ostinato'], comp_inst=['spicc'], pad='strings', choir=True,
           leads=['brass_sec', 'strings_hi', 'horn', 'choir'], counter=['horn', 'strings', 'trombone'], arp=None, feel='lyrical', hit='orch', verb=2.0, mod=1),
 'emotional': M(balance='soft', bpm=72, root=60, hs=MAJ, ms=MAJ, ext='add9', prog=dict(A=[0, 2, 3, 4], B=[5, 3, 0, 4], C=[3, 4, 2, 5], X=[5, 4, 3, 3]),
                kit='soft', bass='long', bass_inst='cello', comp=['arp_piano'], comp_inst=['piano'], pad='strings',
                leads=['piano', 'sao', 'violin', 'cello'], counter=['strings', 'sao', 'cello'], arp=None, feel='lyrical', hit='soft', verb=1.9, mod=1),
 'cafe': M(balance='soft', bpm=92, root=65, hs=MAJ, ms=MAJ, ext='7', prog=dict(A=[1, 4, 0, 5], B=[3, 2, 1, 4], C=[0, 5, 1, 4], X=[3, 'b7', 0, 0]),
           kit='brush', bass='walking', bass_inst='ubass', comp=['rhodes'], comp_inst=['epiano'], pad=None,
           leads=['vibes', 'tranh', 'clarinet', 'guitar'], counter=['clarinet', 'vibes'], arp=None, feel='bouncy', hit='soft', verb=1.2, swing=.2),
 'night': M(balance='soft', bpm=84, root=57, hs=MIN, ms=PMIN, ext='9', prog=dict(A=[0, 5, 2, 6], B=[3, 6, 2, 5], C=[5, 6, 0, 0], X=[3, 4, 0, 0]),
            kit='lofi', bass='long8', bass_inst='ebass', comp=['rhodes'], comp_inst=['epiano'], pad='pad', trem=True,
            leads=['bau', 'epiano', 'sao'], counter=['sao', 'pad'], arp='pluck_syn', feel='sparse', hit='soft', verb=1.6, swing=.16, crackle=True, delay=True),
 'quiz': M(balance='drive', bpm=120, root=62, hs=MIN, ms=MIN, ext='', prog=dict(A=[0, 0, 5, 'D'], B=[3, 'D', 0, 5], C=[0, 5, 3, 'D'], X=[5, 'D', 0, 0]),
           kit='quiz', bass='pulse8', bass_inst='synbass', comp=['pizz_ost'], comp_inst=['pizz'], pad='pad',
           leads=['marimba', 'pizz', 'pluck_syn', 'glock'], counter=['strings', 'clarinet'], arp=None, feel='driving', hit='pop', verb=1.0, mod=1),
 'upbeat': M(balance='drive', bpm=122, root=60, hs=MAJ, ms=PMAJ, ext='', prog=dict(A=[5, 3, 0, 4], B=[3, 4, 5, 5], C=[0, 4, 5, 3], X=[3, 4, 0, 0]),
             kit='four', bass='offbeat', bass_inst='synbass', comp=['stabs'], comp_inst=['piano'], pad='pad', sc=.45,
             leads=['pluck_syn', 'sao', 'saw_lead', 'glock'], counter=['strings', 'saw_lead'], arp='pluck_syn', feel='driving', hit='pop', verb=1.2, mod=2),
 'chill': M(balance='soft', bpm=96, root=64, hs=MAJ, ms=PMAJ, ext='9', prog=dict(A=[3, 0, 4, 5], B=[5, 3, 0, 4], C=[0, 2, 3, 4], X=[3, 3, 0, 0]),
            kit='soft', bass='long8', bass_inst='ebass', comp=['arp_guitar'], comp_inst=['guitar'], pad='pad',
            leads=['sao', 'guitar', 'vibes', 'tranh'], counter=['sao', 'strings'], arp=None, feel='sparse', hit='soft', verb=1.5, swing=.08, delay=True),
 'vn_folk': M(balance='soft', bpm=96, root=55, hs=MAJ, ms=BAC, ext='open', prog=dict(A=[0, 3, 0, 4], B=[5, 3, 1, 4], C=[0, 4, 5, 3], X=[3, 1, 4, 0]),
              kit='vnsoft', bass='long8', bass_inst='ubass', comp=['tranh_arp'], comp_inst=['tranh'], pad='strings',
              leads=['sao', 'tranh', 'bau', 'nguyet'], counter=['bau', 'sao', 'strings'], arp=None, feel='folk', hit='vn', verb=1.6, vn=True, delay=True),
 'vn_epic': M(balance='drive', bpm=100, root=62, hs=MIN, ms=OAN, micro=OAN_MICRO, ext='open', prog=dict(A=[0, 0, 5, 6], B=[5, 6, 0, 3], C=[0, 6, 5, 6], X=[5, 6, 0, 0]),
              kit='vnwar', bass='ostinato', bass_inst='cello', comp=['ostinato'], comp_inst=['spicc'], pad='strings', choir=True,
              leads=['sao', 'brass_sec', 'bau', 'strings_hi'], counter=['horn', 'strings', 'bau'], arp=None, feel='folk', hit='vn', verb=1.9, vn=True),
 'mystery': M(balance='soft', bpm=80, root=64, hs=HMIN, ms=HMIN, ext='', prog=dict(A=[0, 5, 3, 'D'], B=[0, 'b2', 0, 'D'], C=[5, 3, 'D', 0], X=[3, 'D', 0, 0]),
              kit='mystery', bass='walk_slow', bass_inst='ubass', comp=['pizz_sparse'], comp_inst=['pizz'], pad='pad', padcut=.6,
              leads=['celesta', 'clarinet', 'violin', 'bell'], counter=['cello', 'clarinet'], arp='celesta', feel='sparse', hit='tension', verb=2.0, delay=True),
 'tension': M(balance='drive', bpm=100, root=61, hs=MIN, ms=PHR, ext='', prog=dict(A=[0, 0, 'b2', 0], B=[5, 5, 'D', 'D'], C=[0, 'b2', 5, 'D'], X=[0, 'b2', 0, 0]),
              kit='tension', bass='pulse16', bass_inst='synbass', comp=['ostinato'], comp_inst=['spicc'], pad='strings',
              leads=['strings_hi', 'horn', 'piano', 'cello'], counter=['cello', 'horn'], arp=None, feel='sparse', hit='tension', verb=1.6),
 'wonder': M(balance='soft', bpm=84, root=63, hs=LYD, ms=LYD, ext='add9', prog=dict(A=[0, 1, 0, 1], B=[5, 3, 0, 4], C=[3, 4, 5, 0], X=[3, 1, 0, 0]),
             kit='wonder', bass='long', bass_inst='subbass', comp=['pad_only'], comp_inst=['pad_air'], pad='pad_air', choir=True,
             leads=['pluck_syn', 'bell', 'sao', 'choir'], counter=['strings', 'choir'], arp='pluck_syn', feel='lyrical', hit='soft', verb=2.4, delay=True, mod=2),
 'sneaky': M(balance='comic', bpm=100, root=57, hs=MIN, ms=MIN, ext='7', prog=dict(A=[0, 0, 3, 'D'], B=[5, 'D', 0, 0], C=[0, 3, 'D', 0], X=[3, 'D', 0, 0]),
             kit='sneaky', bass='walk_chrom', bass_inst='ubass', comp=['pizz_sneak'], comp_inst=['pizz'], pad=None,
             leads=['bassoon', 'clarinet', 'pizz', 'vibes'], counter=['clarinet', 'bassoon'], arp=None, feel='sneaky', hit='comedy', verb=1.2, chromatic=True, swing=.12),
 'triumph': M(balance='drive', bpm=116, root=58, hs=MAJ, ms=MAJ, ext='', prog=dict(A=[0, 3, 0, 4], B=[5, 3, 4, 4], C=[0, 'b6', 'b7', 0], X=[3, 4, 0, 0]),
              kit='march_big', bass='march', bass_inst='tuba', comp=['ostinato'], comp_inst=['spicc'], pad='strings',
              leads=['trumpet', 'brass_sec', 'strings_hi', 'horn'], counter=['horn', 'strings', 'trombone'], arp='glock', feel='fanfare', hit='orch', verb=1.8, mod=2),
 'lofi_hanoi': M(balance='soft', bpm=76, root=65, hs=MAJ, ms=PMAJ, ext='9', prog=dict(A=[1, 4, 0, 5], B=[3, 2, 1, 4], C=[3, 4, 2, 5], X=[3, 3, 0, 0]),
                 kit='lofi', bass='long8', bass_inst='ebass', comp=['rhodes'], comp_inst=['epiano'], pad=None, trem=True,
                 leads=['bau', 'epiano', 'sao', 'bau'], counter=['sao', 'guitar'], arp=None, feel='sparse', hit='soft', verb=1.3, swing=.22, crackle=True, wow=True, delay=True),
 'march': M(balance='drive', bpm=112, root=58, hs=MAJ, ms=MAJ, ext='', prog=dict(A=[0, 4, 4, 0], B=[3, 0, 4, 0], C=[0, 3, 4, 0], X=[3, 4, 0, 0]),
            kit='march', bass='march', bass_inst='tuba', comp=['oompah'], comp_inst=['brass_stab'], pad=None,
            leads=['trumpet', 'piccolo', 'glock', 'clarinet'], counter=['trombone', 'clarinet'], arp=None, feel='fanfare', hit='orch', verb=1.4, mod=1),
 'sad_comedy': M(balance='soft', bpm=132, bpb=3, root=62, hs=HMIN, ms=HMIN, ext='', prog=dict(A=[0, 3, 'D', 0], B=[5, 1, 'D', 0], C=[3, 0, 'D', 0], X=[3, 'D', 0, 0]),
                 kit='waltz', bass='waltz', bass_inst='tuba', comp=['waltz'], comp_inst=['pizz'], pad=None,
                 leads=['accordion', 'clarinet', 'violin', 'bassoon'], counter=['violin', 'clarinet'], arp=None, feel='lyrical', hit='comedy', verb=1.3, chromatic=True),
}
ALIAS = {'food': 'cafe', 'history': 'epic', 'story': 'emotional', 'guide': 'chill', 'myth': 'comedy', 'countdown': 'upbeat', 'versus': 'upbeat',
         'battle': 'vn_epic', 'folk': 'vn_folk', 'sad': 'emotional', 'lofi': 'lofi_hanoi', 'science': 'wonder', 'heist': 'sneaky', 'victory': 'triumph',
         'suspense': 'tension', 'spooky': 'mystery', 'awkward': 'sad_comedy'}

# drum kits: per energy level a list of bar variants; 16 steps (4/4) or 12 (3/4); x=1 X=1.15 o=.6 g=.3
KITS = {
 'pop': {1: [dict(shaker='x.o.x.o.x.o.x.o.')], 2: [dict(kick='x.......x.o.....', snare='....x.......x...', hat='x.o.x.o.x.o.x.o.'), dict(kick='x.....o.x.......', rim='....x.......x...', hat='x.o.x.o.x.o.x.oo')],
         3: [dict(kick='x.....o.x.o.....', snare='....x.......x...', hat='xoxoxoxoxoxoxoxo', tamb='....x.......x...'), dict(kick='x..o..o.x.o...o.', snare='....x.......x..g', hat='xoxoxoxoxoxoxoxo')],
         4: [dict(kick='x.o...o.x.o...o.', snare='....X.......X...', hat='xxxxxxxxxxxxxxxx', clap='....x.......x...')]},
 'four': {1: [dict(hat='..x...x...x...x.')], 2: [dict(kick='x...x...x...x...', hat='..x...x...x...x.')], 3: [dict(kick='x...x...x...x...', clap='....x.......x...', hat_open='..x...x...x...x.', hat='g.g.g.g.g.g.g.g.')],
          4: [dict(kick='x...x...x...x...', clap='....x.......x...', hat_open='..x...x...x...x.', hat='xoxoxoxoxoxoxoxo', shaker='oooooooooooooooo')]},
 'lofi': {1: [dict(hat='x.o.x.o.x.o.x.o.')], 2: [dict(kick='x......o..x.....', snare='....x.......x...', hat='x.o.x.o.x.o.x.o.'), dict(kick='x.......o.x....o', snare='....x.......x...', hat='x.o.x.ogx.o.x.o.')],
          3: [dict(kick='x......o..x..o..', snare='....x.......x...', hat='xoxoxoxoxoxoxoxo', shaker='..o...o...o...o.')], 4: [dict(kick='x......o..x..o..', snare='....x..g....x...', hat='xoxoxoxoxoxoxoxo', shaker='o.o.o.o.o.o.o.o.')]},
 'comedy': {1: [dict(woodblock='x.......x.......')], 2: [dict(kick='x.......x.......', snare_brush='....x.......x...', woodblock='......x.......x.'), dict(kick='x.......x.......', woodblock='....x.x.....x...')],
            3: [dict(kick='x.......x.......', snare='....x.......x...', shaker='x.x.x.x.x.x.x.x.', woodblock='......x.......x.'), dict(kick='x.....x.x.......', snare='....x.......x...', shaker='x.x.x.x.x.x.x.x.', cowbell='x.......x.......')],
            4: [dict(kick='x.....x.x.....x.', snare='....x.......x...', hat='x.x.x.x.x.x.x.x.', woodblock='..x...x...x...x.')]},
 'epic': {1: [dict()], 2: [dict(taiko='x.......x.......', tom='..........o...o.'), dict(taiko='x.....x.x.......')],
          3: [dict(taiko='x.....x.x.....x.', snare='....x.......x...', tom='..o.......o.o...'), dict(taiko='x..x..x.x.......', snare='....x.......x.g.', tom='......o.....o.oo')],
          4: [dict(taiko='x.x...x.x.x...x.', snare='....X.......X...', tom='oo.o..oo..o.oooo', timpani='x.......x.......')]},
 'soft': {1: [dict()], 2: [dict(shaker='x.o.x.o.x.o.x.o.', kick_soft='x.........x.....')], 3: [dict(kick_soft='x.........x.....', rim='........x.......', shaker='xoxoxoxoxoxoxoxo')],
          4: [dict(kick_soft='x.....o...x.....', snare='........x.......', shaker='xoxoxoxoxoxoxoxo', tamb='....x.......x...')]},
 'brush': {1: [dict(brush='x.......x.......')], 2: [dict(brush='x...x...x...x...', ride='x.....o.x.....o.'), dict(brush='x...x...x...x...', ride='x...o.o.x...o.o.')],
           3: [dict(kick_soft='x.........x.....', brush='x...x...x...x...', ride='x...o.o.x...o.o.', rim='....x.......x...')], 4: [dict(kick_soft='x.....o...x.....', snare_brush='....x.......x...', ride='x..ox.oox..ox.oo')]},
 'quiz': {1: [dict(hat='x.o.x.o.x.o.x.o.')], 2: [dict(hat='xoxoxoxoxoxoxoxo', kick='x.......x.......')], 3: [dict(kick='x...x...x...x...', hat='xoxoxoxoxoxoxoxo', rim='....x.......x...')],
          4: [dict(kick='x...x...x...x.x.', snare='....x.......x...', hat='xxxxxxxxxxxxxxxx')]},
 'vnsoft': {1: [dict(songlang='x.......x.......')], 2: [dict(mo='x.....x.....x...', songlang='....x.......x...'), dict(mo='x..x....x..x....', songlang='....x.......x...')],
            3: [dict(trong_nho='x.....x.x.......', mo='..x...x...x...x.', songlang='....x.......x...', shaker='x.x.x.x.x.x.x.x.')],
            4: [dict(trong='x.......x.......', trong_nho='..x.x.x...x.x.x.', mo='x.x.x.x.x.x.x.x.', songlang='....x.......x...')]},
 'vnwar': {1: [dict(trong='x...............')], 2: [dict(trong='x.......x.......', trong_rim='....x.......x...'), dict(trong='x.....x.x.......', trong_rim='..x...x...x...x.')],
           3: [dict(trong='x..x..x.x.......', trong_rim='....x.x.....x.x.', trong_nho='..........x.x.x.'), dict(trong='x.....x.x..x....', trong_rim='x.x.x.x.x.x.x.x.', taiko='........x.......')],
           4: [dict(trong='x.x.x.x.x.x.x.x.', trong_rim='.x.x.x.x.x.x.x.x', taiko='x.......x.......', trong_nho='oooooooooooooooo')]},
 'mystery': {1: [dict()], 2: [dict(shaker='..o...o...o...o.', tom='x...............')], 3: [dict(kick_soft='x.........x.....', rim='........x.......', shaker='..o...o...o...o.')],
             4: [dict(kick_soft='x.....o...x.....', snare='........x.......', shaker='xoxoxoxoxoxoxoxo')]},
 'tension': {1: [dict(hat='x...x...x...x...')], 2: [dict(kick='x.......x.......', hat='x.x.x.x.x.x.x.x.')], 3: [dict(kick='x..x....x..x....', tom='......o.......o.', hat='xoxoxoxoxoxoxoxo')],
             4: [dict(kick='x..x..x.x..x..x.', snare='....x.......x...', tom='..o...o...o.oooo', hat='xxxxxxxxxxxxxxxx')]},
 'wonder': {1: [dict()], 2: [dict(shaker='..o...o...o...o.')], 3: [dict(kick_soft='x.......x.......', clap='....x.......x...', shaker='xoxoxoxoxoxoxoxo')],
            4: [dict(kick='x.......x.o.....', clap='....x.......x...', hat='xoxoxoxoxoxoxoxo', tamb='....x.......x...')]},
 'sneaky': {1: [dict(snap='....x.......x...')], 2: [dict(snap='....x.......x...', brush='x.......x.......')], 3: [dict(kick_soft='x.......x.......', snap='....x.......x...', brush='x.x.x.x.x.x.x.x.')],
            4: [dict(kick_soft='x.....x.x.......', snare_brush='....x.......x...', snap='....x.......x...', ride='x.ox.ox.x.ox.ox.')]},
 'march_big': {1: [dict(snare='x.......x.......')], 2: [dict(snare='x..gx.g.x..gx.gg', kick='x.......x.......')], 3: [dict(snare='x.gxx.gxx.gxx.gg', kick='x.......x.......', crash_lite='x...............', timpani='x.......x.......')],
               4: [dict(snare='xgxxxgxxxgxxxgxx', kick='x...x...x...x...', timpani='x...x...x...x...', crash_lite='x.......x.......')]},
 'march': {1: [dict(snare='x.......x.......')], 2: [dict(snare='x..gx...x..gx...', kick='x.......x.......')], 3: [dict(snare='x.gxx.g.x.gxx.gg', kick='x.......x.......', crash_lite='....x.......x...')],
           4: [dict(snare='xgxxxgxxxgxxxgxx', kick='x...x...x...x...', crash_lite='....x.......x...', glockhit='')]},
 'waltz': {1: [dict(triangle='x...........')], 2: [dict(brush='x...x...x...', triangle='x...........')], 3: [dict(kick_soft='x...........', snare_brush='....x...x...', triangle='x...........')],
           4: [dict(kick_soft='x...........', snare_brush='....x...x...', tamb='....x...x...')]},
}
VEL = {'x': 1.0, 'X': 1.15, 'o': .6, 'g': .3}
DRUM_GAIN = {'kick': 1.0, 'kick_soft': .9, 'kick_lofi': .95, 'snare': .7, 'snare_lofi': .65, 'snare_brush': .4, 'rim': .35, 'clap': .5, 'hat': .22, 'hat_open': .22,
             'ride': .2, 'shaker': .18, 'tamb': .2, 'snap': .35, 'brush': .3, 'woodblock': .4, 'cowbell': .25, 'triangle': .18, 'taiko': .9, 'tom': .55, 'timpani': .7,
             'trong': 1.0, 'trong_rim': .4, 'trong_nho': .5, 'mo': .45, 'songlang': .35, 'crash': .4, 'crash_lite': .25, 'chieng': .6, 'gong_big': .7}
DRUM_PAN = {'hat': .3, 'hat_open': .3, 'shaker': -.35, 'tamb': -.3, 'ride': .35, 'rim': .1, 'woodblock': .4, 'cowbell': -.3, 'triangle': .45, 'tom': -.2,
            'mo': .35, 'songlang': -.35, 'trong_rim': .25, 'trong_nho': -.25, 'snap': .25, 'brush': -.1, 'crash': -.25, 'crash_lite': -.25}

ENERGY = {'hook': 3, 'title': 3, 'countdown': 3, 'gag': 2, 'montage': 3, 'quiz': 2, 'route': 3, 'ride': 3, 'stat': 3, 'compare': 3, 'payoff': 3,
          'intro': 2, 'price': 2, 'reveal': 3, 'steps': 2, 'budget': 2, 'myth': 2, 'list': 2, 'map': 2, 'timeline': 2, 'calendar': 2, 'scale': 2, 'chapter': 2,
          'sshape': 2, 'timelapse': 2, 'talk': 1, 'dialogue': 1, 'social': 1, 'raw': 2, 'moment': 2, 'end': 0}
MOMENT_E = {'street3d': 3, 'shot_eyes': 1, 'shot_bird': 2, 'mapdive': 3, 'steam': 1, 'window': 1, 'split': 2, 'wow_fleet': 3, 'wow_south': 3, 'map3d': 3, 'fleet3d': 3, 'wow_storm': 3}
ACCENT_BEATS = {'hook', 'title', 'reveal', 'chapter', 'payoff', 'stat', 'montage', 'countdown'}
ACCENT_MOMENTS = {'street3d', 'mapdive', 'map3d', 'fleet3d', 'wow_fleet', 'wow_south', 'wow_storm'}
DROP_BEATS = {'reveal', 'payoff'}
DROP_MOMENTS = {'mapdive', 'map3d', 'fleet3d', 'wow_fleet', 'wow_south'}
BUTTON_BEATS = {'gag', 'dialogue', 'myth'}
ROLE_STEM = {'drums': 'drums', 'bass': 'bass', 'harmony': 'harmony', 'pad': 'harmony', 'arp': 'harmony', 'melody': 'melody', 'counter': 'melody', 'fx': 'fx'}
STEMS = ['drums', 'bass', 'harmony', 'melody', 'fx']
ROLE_GAIN = {'drums': .5, 'bass': .62, 'fx': .7, 'final': .9}
INST_GAIN = {'tranh': .55, 'sao': .5, 'bau': .55, 'nguyet': .5, 'trumpet': .45, 'horn': .42, 'trombone': .4, 'brass_sec': .5, 'tuba': .48, 'strings': .2, 'strings_hi': .36,
             'violin': .42, 'cello': .45, 'spicc': .26, 'choir': .2, 'pad': .14, 'pad_air': .17, 'pluck_syn': .38, 'saw_lead': .32, 'piano': .5, 'epiano': .4,
             'marimba': .5, 'xylo': .42, 'glock': .3, 'celesta': .38, 'vibes': .42, 'bell': .3, 'ebass': .48, 'subbass': .42, 'synbass': .4, 'ubass': .6,
             'guitar': .45, 'steel': .4, 'harp': .38, 'pizz': .45, 'clarinet': .4, 'bassoon': .5, 'accordion': .38, 'piccolo': .38}

# ============================================================================ the score
class Score:
    def __init__(s, n):
        s.n = n; s.ev = []
    def add(s, t, role, name, midi=None, dur=.5, vel=1., pan=0., gain=1., **opts):
        if t < -0.5 or t >= s.n / SR: return
        s.ev.append((t, role, name, midi, dur, vel, pan, gain, opts))

def halftime(pat):
    """'breath' variation: half-time feel (backbeat on 3), thinned cymbals, no fills"""
    out = {}
    for dn, ps in pat.items():
        if not ps: continue
        L = len(ps)
        if dn in ('kick', 'kick_soft', 'kick_lofi', 'taiko', 'trong'): out[dn] = ''.join('x' if k == 0 or (k == L * 5 // 8 and ps[k] != '.') else '.' for k in range(L))
        elif dn in ('snare', 'clap', 'rim', 'trong_rim', 'snap', 'snare_brush'): out[dn] = ''.join('x' if k == L // 2 else '.' for k in range(L))
        elif dn in ('hat', 'shaker', 'tamb', 'ride', 'brush', 'mo', 'songlang', 'triangle', 'woodblock'): out[dn] = ''.join('o' if (k % 4 == 0 and c != '.') else '.' for k, c in enumerate(ps))
    return out

def scene_level(sc):
    b = sc.get('beat') or sc['id'].split('_', 1)[-1]
    if b == 'moment': return MOMENT_E.get(sc.get('moment') or '', 2)
    return ENERGY.get(b, 2)
def beat_of(sc): return sc.get('beat') or sc['id'].split('_', 1)[-1]

def plan_form(cues, st, mod_opt='auto'):
    scenes = cues['scenes']; D = cues.get('duration') or (scenes[-1]['start'] + scenes[-1]['dur'])
    end_t = next((s['start'] for s in scenes if beat_of(s) == 'end'), D)
    bpb = st.get('bpb', 4); beat = 60 / st['bpm']; bar = beat * bpb
    nbar = max(1, int(np.ceil(end_t / bar - .05)))
    # section switches on the bar line nearest each cut
    lv = [2] * nbar; owner = [0] * nbar
    marks = sorted((min(nbar - 1, int(round(sc['start'] / bar))), i) for i, sc in enumerate(scenes) if sc['start'] < end_t - .05)
    cur, own = scene_level(scenes[0]), 0; mi = 0
    for b in range(nbar):
        while mi < len(marks) and marks[mi][0] <= b: own = marks[mi][1]; cur = scene_level(scenes[own]); mi += 1
        lv[b] = max(1, cur); owner[b] = own
    lab = [{1: 'A', 2: 'B', 3: 'C', 4: 'D'}[l] for l in lv]
    first = beat_of(scenes[0])
    if first not in ('hook', 'title') and nbar >= 6 and scene_level(scenes[0]) >= 2: lab[0] = 'intro'
    # last-act climax: the last run of C that starts after 45 % of the cue becomes D
    runs = []; b = 0
    while b < nbar:
        e = b
        while e + 1 < nbar and lab[e + 1] == lab[b]: e += 1
        runs.append([b, e, lab[b]]); b = e + 1
    late = [r for r in runs if r[2] == 'C' and r[0] >= .45 * nbar]
    if late:
        for b in range(late[-1][0], late[-1][1] + 1): lab[b] = 'D'
    # breakdown: a quiet run right after a peak
    for k in range(1, len(runs)):
        if runs[k][2] == 'A' and runs[k - 1][2] in ('C', 'D') and runs[k][1] - runs[k][0] >= 1:
            for b in range(runs[k][0], runs[k][1] + 1): lab[b] = 'X'
    # build: the bar before a rise into C/D (if the current run has >= 2 bars)
    order = {'intro': 0, 'A': 1, 'X': 1, 'B': 2, 'C': 3, 'D': 4}
    for b in range(1, nbar - 1):
        if lab[b + 1] in ('C', 'D') and order.get(lab[b], 0) < order[lab[b + 1]] and (lab[b - 1] == lab[b] or order[lab[b + 1]] - order.get(lab[b], 0) >= 2): lab[b] = 'build'
    lvl = [{'intro': 1, 'A': 1, 'X': 1, 'B': 2, 'build': 2, 'C': 3, 'D': 4}[l] for l in lab]
    # modulation for the last act
    mod_bar, mod_st = None, 0
    if mod_opt != 'off' and st.get('mod') and end_t >= 45:
        dl = [b for b in range(nbar) if lab[b] == 'D']
        if dl and dl[0] >= 4: mod_bar, mod_st = dl[0], (st['mod'] if mod_opt == 'auto' else int(mod_opt))
    return dict(D=D, end_t=end_t, beat=beat, bar=bar, bpb=bpb, nbar=nbar, lab=lab, lvl=lvl, owner=owner, mod_bar=mod_bar, mod_st=mod_st)

def make_contour(seed):
    """the leitmotif's melodic shape comes from the episode seed only, so every mood of one episode shares the theme"""
    R = Rng(int(hashlib.md5(('motif' + seed).encode()).hexdigest()[:8], 16)); steps, idx, last = [0], 0, 0
    for k in range(31):
        stp = R.wch([-3, -2, -1, 0, 1, 2, 3, 4], [.4, 1, 2.2, .7, 2.2, 1, .5, .3])
        if abs(last) >= 3: stp = -int(np.sign(last)) * R.ch([1, 2])
        idx = int(np.clip(idx + stp, -4, 6)); steps.append(idx); last = stp
    return steps

def make_motif(R, st, bpb, contour=None):
    cells = FEELS[st['feel']]; notes = []; b = 0.; total = 2 * bpb
    while b < total - .01:
        c = R.ch(cells); span = max(1, int(np.ceil(max(o + d for o, d in c) - 1e-6)))
        if b + span > total: c = [(0, total - b)]; span = total - b
        for o, d in c: notes.append([b + o, d])
        b += span
    if notes[-1][1] < 1 and len(notes) > 2: notes[-1][1] = max(notes[-1][1], 1.0)
    steps, idx, last = [], 0, 0
    for k in range(len(notes)):
        if k == 0: steps.append(0); continue
        stp = R.wch([-3, -2, -1, 0, 1, 2, 3, 4], [.4, 1, 2.2, .7, 2.2, 1, .5, .3])
        if abs(last) >= 3: stp = -int(np.sign(last)) * R.ch([1, 2])       # leap -> step back
        idx = int(np.clip(idx + stp, -4, 6)); steps.append(idx); last = stp
    if contour: steps = [contour[k % len(contour)] for k in range(len(notes))]
    return [(o, d, s) for (o, d), s in zip(notes, steps)]

def render_score(cues, mood='adventure', seed='va', stems_dir=None, mod_opt='auto', target_lufs=-16., verbose=True):
    t0 = time.time()
    mood = ALIAS.get(mood, mood); st = STYLES.get(mood, STYLES['adventure'])
    R = Rng(int(hashlib.md5((seed + mood).encode()).hexdigest()[:8], 16))
    P = plan_form(cues, st, mod_opt); D, end_t, beat, bar, bpb, nbar = P['D'], P['end_t'], P['beat'], P['bar'], P['bpb'], P['nbar']
    n = int(SR * (D + 3)); S = Score(n); scenes = cues['scenes']
    steps = 4 * bpb; sw = st.get('swing', 0)
    speech = np.zeros(int(D * 100) + 400, bool)
    for sb in cues.get('subs', []): speech[int(sb['t0'] * 100):int(sb['t1'] * 100) + 15] = True
    talking = lambda t: speech[min(len(speech) - 1, max(0, int(t * 100)))]
    key = lambda b: st['root'] + (P['mod_st'] if P['mod_bar'] is not None and b >= P['mod_bar'] else 0)
    micro = st.get('micro', {})
    def mc(m): return m + micro.get((int(round(m)) - st['root']) % 12, 0) / 100.
    def hum(t, amt=.004): return t + float(np.clip(R.r.normal(0, amt), -.01, .01))
    def hv(v): return float(np.clip(v * (1 + R.r.normal(0, .06)), .1, 1.3))
    def swing_t(t_step, k, sub):  # k = step index at subdivision sub per beat
        return t_step + (beat / sub) * sw * (1.6 if sub == 4 else 1.0) if k % 2 else t_step
    motif = make_motif(R, st, bpb, make_contour(seed)); motif2 = make_motif(R, st, bpb, make_contour(seed + '/B'))   # leitmotif + B theme
    counters = {}; prev_voicing = None; prev_counter = None
    phrase_ct = {}; bars_info = []
    for b in range(nbar):
        lab = P['lab'][b]; s0 = b
        while s0 > 0 and P['lab'][s0 - 1] == lab: s0 -= 1
        pos = b - s0; bip = pos % 4
        if bip == 0: phrase_ct[lab] = phrase_ct.get(lab, -1) + 1
        bars_info.append((lab, phrase_ct.get(lab, 0), bip, pos))
    minor = st['hs'] in (MIN, HMIN, DOR, PHR)
    def prog_for(lab, v):
        kk = lab if lab in ('A', 'B', 'C', 'X') else ('C' if lab == 'D' else ('A' if lab == 'intro' else 'B'))
        base = list(st['prog'][kk]); m = v % 4
        if m == 1 and kk in ('C',): return base[2:] + base[:2]                       # same chords, new order
        if m == 2:                                                                    # substitution on chord 2 (I->vi, IV->ii / i->III, VI->iv)
            sub = ({0: 2, 5: 3, 3: 5} if minor else {0: 5, 3: 1, 5: 3, 4: 2})
            base[1] = sub.get(base[1], base[1]) if isinstance(base[1], int) else base[1]; return base
        if m == 3 and kk in ('A', 'B', 'X'): return list(st['prog'][{'A': 'B', 'B': 'A', 'X': 'A'}[kk]])
        return base
    chords = []
    for b in range(nbar):
        lab, v, bip, pos = bars_info[b]; pl = prog_for(lab, v)
        spec = pl[pos % len(pl)]
        if lab == 'build': spec = 4 if st['hs'] in (MAJ, LYD, MIXO) else ('D' if st['hs'] in (HMIN,) or 'D' in sum(st['prog'].values(), []) else 6)
        if b == nbar - 1: spec = 4 if st['hs'] in (MAJ, LYD, MIXO) else ('D' if not st.get('vn') else 6)   # dominant before the end cadence
        if P['mod_bar'] is not None and b == P['mod_bar'] - 1: spec = 'D'                                 # V of the new key (pivot)
        chords.append(spec)
    # ------------------------------------------------------------------ per bar
    mel_cache = {}
    for b in range(nbar):
        t0b = b * bar; lab, v, bip, pos = bars_info[b]; e = P['lvl'][b]; K = key(b)
        spec = chords[b]; r_semi, cn = chord_pcs(spec, st); root_m = K + r_semi
        nxt = chords[b + 1] if b + 1 < nbar else 0; nroot = key(b + 1) + chord_pcs(nxt, st)[0]
        abs_notes = [K + x for x in cn]
        vo = voice(abs_notes, root_m, prev_voicing, 55, 79); prev_voicing = vo
        last_bar = (b == nbar - 1); next_lab = P['lab'][b + 1] if b + 1 < nbar else 'end'
        phrase_end = (bip == 3) or (next_lab != lab)
        talk = talking(t0b + bar * .5)
        tex = v % 4 if lab in ('B', 'C', 'D') else -1          # 2 = 'breath' (half-time, pads + arp), 3 = 'push' (extra perc, counter up)
        breath = (tex == 2 and e >= 2 and not last_bar); push = (tex == 3)
        # ---------------- pad / sustained harmony
        pad_i = st.get('pad')
        if breath and not pad_i: pad_i = 'strings'
        if pad_i and (e >= 2 or lab in ('X', 'intro', 'A')):
            g = {1: .7, 2: .8, 3: .9, 4: 1.0}[e] * (1.15 if lab == 'X' else 1)
            hold = bar if not (b + 1 < nbar and chords[b + 1] == spec and bip < 3) else bar * 2
            if not (b > 0 and chords[b - 1] == spec and bars_info[b - 1][2] < 3 and bip % 2 == 1 and hold == bar):
                for j, m in enumerate(vo): S.add(t0b, 'pad', pad_i, mc(m), hold + .05, .8, (-.5 + j / max(1, len(vo) - 1)) * .8, g, cut=st.get('padcut', 1.0))
        if st.get('choir') and e >= 3:
            for m in vo[-2:]: S.add(t0b, 'pad', 'choir', mc(m + 12 if m < 60 else m), bar + .1, .7, R.f(-.5, .5), .8)
        # ---------------- comp (rhythmic harmony)
        comp = st['comp'][v % len(st['comp'])]; ci = st['comp_inst'][v % len(st['comp_inst'])]
        if breath and comp not in ('pad_only', 'tranh_arp', 'ostinato'): comp = 'pad_only'
        cg = {1: .55, 2: .8, 3: 1.0, 4: 1.05}[e]
        if lab == 'X': cg *= .7
        if comp == 'strum' and e >= 2:
            pat = [(0, 1, .95), (1, 1, .55), (1.5, -1, .5), (2.5, -1, .6), (3, 1, .7), (3.5, -1, .5)] if e >= 3 else [(0, 1, .9), (2, 1, .7)]
            if v % 2: pat = [(0, 1, .9), (.75, -1, .45), (1.5, 1, .6), (2, -1, .5), (2.5, 1, .7), (3.5, -1, .5)] if e >= 3 else pat
            for bt, dirn, vv in pat:
                if bt >= bpb: continue
                ns = vo if dirn > 0 else vo[::-1]
                for j, m in enumerate(ns): S.add(hum(t0b + bt * beat + j * .012), 'harmony', 'steel' if ci == 'steel' else 'guitar', mc(m), beat * 1.4, hv(vv * cg), -.3 + .15 * j, .8)
        elif comp == 'stabs' and e >= 2:
            pat = [0, 1.5, 2.5] if v % 2 == 0 else [.5, 1.5, 2.5, 3.5]
            if e >= 3: pat = [0, .5, 1.5, 2, 3, 3.5] if v % 2 else [0, 1.5, 2.5, 3.5]
            for bt in pat:
                for m in vo: S.add(hum(t0b + bt * beat), 'harmony', 'piano', mc(m), beat * .45, hv(.65 * cg), R.f(-.3, .3), .5)
        elif comp == 'pizz_off':
            for k in range(bpb):
                if k % 2 == 1 or (e >= 3 and k % 2 == 0 and v % 2):
                    for m in vo: S.add(hum(t0b + k * beat + (beat * .5 if k % 2 == 0 else 0)), 'harmony', 'pizz', mc(m), beat * .4, hv(.6 * cg), R.f(-.4, .4), .6)
        elif comp == 'ostinato':
            if e >= 2 or lab == 'X':
                seq = [root_m - 12, root_m - 5, root_m, root_m - 5] if v % 2 == 0 else [root_m - 12, root_m, root_m - 12 + 7, root_m + 3 if st['hs'] is MIN else root_m + 4]
                sub = 4 if e >= 3 else 2
                for k in range(bpb * sub):
                    acc = 1.0 if k % sub == 0 else .65
                    S.add(hum(t0b + k * beat / sub, .002), 'harmony', ci, mc(seq[k % len(seq)] + 12), beat / sub * .8, hv(.75 * acc * cg), (-.4 if k % 2 else .4), .9)
        elif comp == 'arp_piano':
            pat = [0, 2, 1, 2, 3 % len(vo), 2, 1, 2] if v % 2 == 0 else [0, 1, 2, 3 % len(vo), 2, 1, 0, 1]
            sub = 2 if e <= 2 else 4
            if bpb * sub >= 8:
                S.add(t0b, 'harmony', 'piano', mc(root_m - 12), bar, hv(.7 * cg), -.1, .55)
                for k in range(bpb * sub):
                    m = vo[pat[k % 8] % len(vo)] + (12 if k >= 4 * sub // 2 and v % 3 == 2 else 0)
                    S.add(hum(t0b + k * beat / sub), 'harmony', 'piano', mc(m), beat * 1.2, hv((.55 if k % 2 else .7) * cg), .1 + .2 * np.sin(k), .55)
        elif comp == 'rhodes':
            pat = [(0, 1.3, .8), (1.75, .6, .5), (2.5, 1.2, .7)] if v % 2 == 0 else [(0, 2.2, .8), (2.5, .4, .55), (3.25, .6, .5)]
            if e <= 1: pat = [(0, bar / beat * .95, .7)]
            for bt, du, vv in pat:
                for j, m in enumerate(vo): S.add(swing_t(t0b + bt * beat + j * .008, int(bt * 2), 2), 'harmony', 'epiano', mc(m), du * beat, hv(vv * cg), -.35 + .7 * j / max(1, len(vo) - 1), .75, trem=st.get('trem', 0))
        elif comp == 'arp_guitar':
            pat = [0, 1, 2, 1, 3 % len(vo), 1, 2, 1] if v % 2 == 0 else [0, 2, 1, 3 % len(vo), 2, 1, 0, 2]
            if e >= 1:
                S.add(t0b, 'harmony', 'guitar', mc(root_m - 12 if root_m - 12 >= 40 else root_m), bar, .7 * cg, -.1, .7)
                for k in range(bpb * 2): S.add(swing_t(hum(t0b + k * beat / 2), k, 2), 'harmony', 'guitar', mc(vo[pat[k % 8] % len(vo)]), beat * 1.5, hv(.55 * cg), .3 * (1 if k % 2 else -1), .7)
        elif comp == 'tranh_arp':     # đàn tranh pentatonic patterns (với ngón vê / runs) over the chord
            sm = scale_midis(st, 55, 84, K); cps = [m for m in sm if (m - K) % 12 in [x % 12 for x in cn]] or sm
            base = [m for m in cps if m >= vo[0]][:4] or cps[:4]
            pat = [0, 1, 2, 3, 2, 1, 2, 1] if v % 2 == 0 else [0, 2, 1, 3, 1, 2, 0, 3]
            sub = 2 if e <= 2 else 4
            for k in range(bpb * sub):
                if e <= 1 and k % 2: continue
                m = base[pat[k % 8] % len(base)]
                S.add(hum(t0b + k * beat / sub), 'harmony', 'tranh', mc(m), beat * .9, hv((.7 if k % sub == 0 else .5) * cg), R.f(-.5, .5), .55)
        elif comp == 'pizz_ost':
            seq = [root_m, root_m + 7, root_m + 12, root_m + 7]
            for k in range(bpb * 2): S.add(hum(t0b + k * beat / 2, .002), 'harmony', 'pizz', mc(seq[k % 4]), beat * .4, hv((.75 if k % 2 == 0 else .55) * cg), (-.3 if k % 2 else .3), .55)
        elif comp == 'pizz_sparse':
            for bt in ([0, 1.5] if v % 2 == 0 else [0, 2.5, 3]):
                if bt < bpb: S.add(hum(t0b + bt * beat), 'harmony', 'pizz', mc(vo[R.i(len(vo))]), beat * .5, hv(.6 * cg), R.f(-.5, .5), .6)
        elif comp == 'pizz_sneak':     # tiptoe: staccato chord tones on 1 and 3, chromatic grace on the "and" of 4
            for bt in (0, 2):
                for m in vo[:2]: S.add(hum(t0b + bt * beat), 'harmony', 'pizz', mc(m), beat * .3, hv(.7 * cg), R.f(-.4, .4), .6)
            if v % 2: S.add(t0b + 3.5 * beat, 'harmony', 'pizz', mc(vo[0] - 1), beat * .25, .5 * cg, .3, .6)
        elif comp == 'pad_only': pass
        elif comp == 'oompah':
            for k in (1, 3):
                for m in vo: S.add(hum(t0b + k * beat), 'harmony', 'trombone', mc(m), beat * .35, hv(.55 * cg), R.f(-.3, .3), .35)
        elif comp == 'waltz':
            for k in (1, 2):
                for m in vo: S.add(hum(t0b + k * beat), 'harmony', 'pizz', mc(m), beat * .4, hv(.6 * cg), R.f(-.4, .4), .55)
        # ---------------- arpeggiator layer (texture)
        if (st.get('arp') or breath) and (e >= 2 or lab == 'X') and (e >= 3 or v % 2 == 0 or breath):
            ai = st.get('arp') or ('harp' if not st.get('vn') else 'tranh'); sub = 4 if (e >= 3 and st['bpm'] < 100) else 2
            seq = vo + [vo[1] + 12, vo[2] + 12 if len(vo) > 2 else vo[0] + 24]
            order = [0, 1, 2, 3, 4, 3, 2, 1] if (v + b) % 2 == 0 else [0, 2, 1, 3, 2, 4, 3, 1]
            for k in range(bpb * sub):
                S.add(hum(t0b + k * beat / sub, .003), 'arp', ai, mc(seq[order[k % 8] % len(seq)] + 12), beat / sub * 1.6, hv(.5 + .1 * (k % sub == 0)), (-.45 if k % 2 else .45), .55)
        # ---------------- bass
        bi = st['bass_inst']; bs = st['bass']; bR = root_m - 24
        while bR < 33: bR += 12
        while bR > 52: bR -= 12
        nR = nroot - 24
        while nR < bR - 6: nR += 12
        while nR > bR + 6: nR -= 12
        approach = nR - 1 if nR > bR else nR + 1
        fifth = bR + 7; bg = {1: .6, 2: .85, 3: 1.0, 4: 1.05}[e]
        bnotes = []
        if breath and bs not in ('walking', 'waltz'): bnotes = [(0, bpb * .6, bR, .85), (bpb * .75, bpb * .22, approach, .6)]
        elif lab == 'X' or (e == 1 and bs not in ('walking', 'walk_slow', 'walk_chrom', 'waltz')): bnotes = [(0, bpb * .95, bR, .7)] if (lab != 'intro' or b > 0) else []
        elif bs == 'pop': bnotes = [(0, 1.4, bR, 1), (1.5, .45, bR, .7), (2, 1, bR, .9), (3, .45, fifth if v % 2 else bR, .75), (3.5, .45, approach, .7)]
        elif bs == 'oompah': bnotes = [(0, .45, bR, 1), (2, .45, fifth - 12 if fifth - 12 >= 33 else fifth, .9)] + ([(3.5, .3, approach, .6)] if v % 2 else [])
        elif bs == 'ostinato': bnotes = [(k * .5, .42, bR + (12 if k % 4 == 3 and e >= 3 else 0), 1 if k % 2 == 0 else .75) for k in range(bpb * 2)]
        elif bs == 'long': bnotes = [(0, bpb * .98, bR, .9)]
        elif bs == 'long8': bnotes = [(0, 1.5, bR, 1), (1.5, 1, bR, .7), (2.5, 1.0, bR if e < 3 else fifth, .8), (3.5, .45, approach, .65)]
        elif bs == 'walking':
            sc = scale_midis(st, bR - 3, bR + 12, K); w = [bR, min(sc, key=lambda m: abs(m - (bR + 4))), fifth, approach]
            if v % 2: w = [bR, fifth, bR + 12 if bR + 12 <= 55 else bR + 9, approach]
            bnotes = [(k, .9, w[k], .9 if k == 0 else .75) for k in range(4)]
        elif bs == 'walk_slow': bnotes = [(0, 1.8, bR, .9), (2, 1.8, fifth if v % 2 else approach, .7)]
        elif bs == 'walk_chrom': bnotes = [(0, .45, bR, 1), (1, .45, bR + 3 if st['hs'] is MIN else bR + 4, .75), (2, .45, fifth, .85), (3, .45, fifth + 1, .7), (3.5, .3, approach, .6)]
        elif bs == 'pulse8': bnotes = [(k * .5, .35, bR + (12 if k == 6 and v % 2 else 0), .9 if k % 2 == 0 else .7) for k in range(bpb * 2)]
        elif bs == 'pulse16': bnotes = [(k * .25, .2, bR, .9 if k % 4 == 0 else .6) for k in range(bpb * 4)] if e >= 3 else [(k * .5, .4, bR, .85) for k in range(bpb * 2)]
        elif bs == 'offbeat': bnotes = [(k + .5, .4, bR + (12 if k == 3 and v % 2 else 0), .9) for k in range(4)] + ([(0, .3, bR, .8)] if e >= 3 else [])
        elif bs == 'march': bnotes = [(0, .45, bR, 1), (1, .45, fifth - 12 if fifth - 12 >= 33 else fifth, .85), (2, .45, bR, .95), (3, .45, fifth - 12 if fifth - 12 >= 33 else fifth, .85)]
        elif bs == 'waltz': bnotes = [(0, .8, bR if pos % 2 == 0 else fifth - 12 if fifth - 12 >= 33 else fifth, 1)]
        if last_bar and bnotes: bnotes = [x for x in bnotes if x[0] < bpb - .6] + [(bpb - .5, .45, bR + 7 if bR + 7 <= 55 else bR - 5, .8)]
        for bt, du, m, vv in bnotes:
            if bt >= bpb: continue
            S.add(swing_t(hum(t0b + bt * beat, .003), int(bt * 2), 2), 'bass', bi, mc(m), du * beat, hv(vv * bg), 0, 1.0)
        if bi != 'subbass' and e >= 3 and st['bass'] in ('pop', 'long8', 'offbeat'): S.add(t0b, 'bass', 'subbass', mc(bR - 12 if bR - 12 >= 28 else bR), bar * .9, .6, 0, .3)
        # ---------------- drums
        kit = KITS[st['kit']]; kv = kit.get(e) or kit[max(kit)]
        if lab == 'X': kv = kit.get(1, [{}])
        if lab == 'intro': kv = kit.get(1, [{}])
        pat = kv[(v + bip // 2) % len(kv)]
        if breath: pat = halftime(pat)
        if push and e >= 3: pat = dict(pat, **({'shaker': 'xoxoxoxoxoxoxoxo'[:steps]} if 'shaker' not in pat else {'tamb': ('....x.......x...' if bpb == 4 else '....x...x...')}))
        fill = phrase_end and not last_bar and e >= 2
        bigger = (P['lvl'][b + 1] > e) if b + 1 < nbar else False
        for dn, ps in pat.items():
            if not ps: continue
            name = {'crash_lite': 'crash', 'glockhit': 'glock'}.get(dn, dn)
            if st['kit'] == 'lofi': name = {'kick': 'kick_lofi', 'snare': 'snare_lofi'}.get(name, name)
            if dn == 'snare_brush': name = 'brush'
            for k, ch in enumerate(ps[:steps]):
                if ch == '.': continue
                if fill and k >= steps * 3 // 4 and dn in ('snare', 'snare_lofi', 'hat', 'tom', 'clap', 'trong_rim', 'rim'): continue
                vv = VEL.get(ch, 1) * (1.0 if e >= 3 else .85)
                tk = t0b + k * beat / 4; tk = swing_t(tk, k, 4) if st['kit'] in ('lofi', 'brush', 'comedy', 'sneaky') else tk
                S.add(hum(tk, .0035), 'drums', name, None, .3, hv(vv), DRUM_PAN.get(dn, 0), DRUM_GAIN.get(dn, .5))
        if fill:   # fills into the next phrase/section
            fk = st['kit']; st4 = steps * 3 // 4
            for k in range(st4, steps):
                tk = t0b + k * beat / 4; ramp = .45 + .55 * (k - st4) / max(1, steps - st4 - 1)
                if fk in ('epic',): S.add(tk, 'drums', 'tom' if k % 2 else 'taiko', None, .3, ramp, -.3 + .2 * (k % 3), .6) if k % 2 == 0 or bigger else None
                elif fk in ('vnwar', 'vnsoft'): S.add(tk, 'drums', 'trong_nho' if k % 2 else 'trong', None, .3, ramp, -.2 + .15 * (k % 3), .55) if (k % 2 == 0 or bigger) else None
                elif fk in ('comedy', 'sneaky'):
                    if k % 2 == 0 or bigger: S.add(tk, 'drums', 'woodblock', 900 + 150 * (k % 3), .2, ramp, .3, .4)
                elif fk in ('march', 'march_big', 'quiz', 'tension'): S.add(tk, 'drums', 'snare', None, .2, ramp * .9, .05, .6)
                elif fk in ('soft', 'wonder', 'mystery', 'waltz', 'brush'):
                    if k == steps - 2 and bigger: S.add(tk, 'drums', 'shaker', None, .2, .8, 0, .3)
                else:
                    if k % 2 == 0 or bigger: S.add(tk, 'drums', 'snare' if fk != 'lofi' else 'snare_lofi', None, .2, ramp * .8, .05 * (k % 3), .55)
            if bigger and e >= 2: S.add(t0b + bar - min(bar, 1.6), 'fx', 'revcym', None, min(bar, 1.6), .5, .2, .35)
        # crash/accent at section starts that go up
        if b > 0 and P['lvl'][b] > P['lvl'][b - 1] and e >= 3:
            S.add(t0b, 'drums', 'crash', None, 1, .9, -.25, .45)
            if st['kit'] in ('vnwar', 'vnsoft'): S.add(t0b, 'drums', 'chieng', None, 3, .8, .1, .45)
        if lab == 'build':  # riser + rolling snare/tom swell + bass pulse
            S.add(t0b + .02, 'fx', 'riser', None, bar - .02, .8, 0, .32, base=mtof(K - 12))
        # ---------------- melody (lead) & counter
        want_mel = lab in ('B', 'C', 'D', 'X', 'intro') or (lab == 'A' and (bip >= 2 or v % 2 == 1)) or lab == 'build'
        if lab == 'build': want_mel = False
        leads = st['leads']; li = leads[(v + {'A': 0, 'B': 1, 'C': 2, 'D': 0, 'X': 3, 'intro': 1}.get(lab, 0)) % len(leads)]
        if lab == 'D': li = leads[0] if v % 2 == 0 else leads[min(len(leads) - 1, 1)]
        if bip == 0:   # (re)build the 4-bar phrase melody
            mel_cache.clear()
            th = motif2 if (lab == 'B' and v % 2 == 1) or (lab == 'C' and v % 4 == 3) else motif
            transform = ['orig', 'seq', 'inv', 'dim'][v % 4] if lab != 'X' else 'aug'
            reg = 12 if (v % 3 == 2 and lab in ('C', 'D')) else 0
            if lab == 'D': reg = 12 if v % 2 else 0
            lo_m, hi_m = (64 + reg, 88 + reg) if li not in ('cello', 'bassoon', 'trombone', 'horn') else (50, 70)
            if li in ('sao', 'piccolo', 'glock', 'celesta', 'bell') : lo_m, hi_m = lo_m + (5 if li == 'sao' else 12), hi_m + (5 if li == 'sao' else 12)
            sm = scale_midis(st, lo_m - 7, hi_m + 7, K)
            centre = min(sm, key=lambda m: abs(m - (lo_m + 7)))
            ci0 = sm.index(centre)
            notes = []
            for half in (0, 1):
                hb = b + half * 2
                if hb >= nbar: break
                base_steps = th
                if half == 1:
                    if transform == 'seq': base_steps = [(o, d, s + 2) for o, d, s in th]
                    elif transform == 'inv': base_steps = [(o, d, -s) for o, d, s in th]
                    else: base_steps = [(o, d, s) for o, d, s in th]
                    base_steps = base_steps[:-1] + [(base_steps[-1][0], max(base_steps[-1][1], 1.5), base_steps[-1][2])] if len(base_steps) > 1 else base_steps
                elif transform == 'dim':
                    nb = []
                    for o, d, s in th:
                        if d >= 1: nb += [(o, d / 2, s), (o + d / 2, d / 2, s + 1)]
                        else: nb.append((o, d, s))
                    base_steps = nb
                elif transform == 'aug': base_steps = [(o, d * 1.5, s) for o, d, s in th if o < bpb * 1.4]
                for o, d, s in base_steps:
                    tb = hb + int(o // bpb)
                    if tb >= nbar or tb > b + 3: continue
                    idx = int(np.clip(ci0 + s, 0, len(sm) - 1)); m = sm[idx]
                    strong = abs(o % bpb) < 1e-6 or (bpb == 4 and abs(o % bpb - 2) < 1e-6)
                    ccn = [(key(tb) + x) % 12 for x in chord_pcs(chords[tb], st)[1]]
                    if strong:
                        cands = [mm for mm in sm if mm % 12 in ccn and abs(mm - m) <= 4]
                        if cands: m = min(cands, key=lambda mm: abs(mm - m))
                    notes.append([hb * bar + o * beat, d * beat, m, tb])
            # cadence: the last note of the phrase lands on a chord tone (tonic at a section end)
            if notes:
                lt = notes[-1]; tb = lt[3]; endsec = (tb + 1 >= nbar) or (P['lab'][min(nbar - 1, b + 4)] != lab)
                tgt = [(key(tb) + x) % 12 for x in ([0] if endsec and chords[tb] in (0,) else chord_pcs(chords[tb], st)[1][:2])]
                c2 = [mm for mm in sm if mm % 12 in tgt]
                if c2: lt[2] = min(c2, key=lambda mm: abs(mm - lt[2]))
            if st.get('chromatic'):   # comic chromatic approach notes into long notes
                extra = []
                for nn in notes:
                    if nn[1] >= beat * .9 and R.p(.35): extra.append([nn[0] - beat * .25, beat * .22, nn[2] - 1, nn[3]])
                notes += extra
            mel_cache['notes'] = notes; mel_cache['inst'] = li; mel_cache['v'] = v
        # play the notes of this bar
        if want_mel and mel_cache.get('notes'):
            li = mel_cache['inst']
            resp = (v % 2 == 1 and len(st['counter']) > 0 and lab in ('B', 'C', 'A') and bip >= 2)   # call & response
            inst_now = st['counter'][(v // 2) % len(st['counter'])] if resp else li
            if inst_now in ('pad', 'strings') and resp: inst_now = leads[(v + 1) % len(leads)]
            mg = {1: .75, 2: .85, 3: 1.0, 4: 1.05}[e]
            for t_on, du, m, tb in mel_cache['notes']:
                if tb != b or t_on >= end_t - .05: continue
                tk = swing_t(t_on, int(round((t_on - t0b) / (beat / 2))), 2) if sw else t_on
                vv = .85 * mg
                if talking(t_on):          # voice is sacred: thin and soften under narration
                    if du < beat * .9 and R.p(.55): continue
                    vv *= .6
                opts = {}
                if inst_now == 'sao': opts = dict(grace=(2 if R.p(.3) and du > beat * .7 else 0))
                if inst_now == 'bau': opts = dict(scoop=(R.ch([1, 2]) if du > beat * .7 and R.p(.6) else 0), fall=(R.ch([1, 2]) if du > beat * 1.4 and R.p(.35) else 0), rise=(1 if du > beat * 1.4 and R.p(.2) else 0))
                if inst_now in ('tranh', 'nguyet'): opts = dict(bend=(-R.ch([1, 2]) if du > beat * .7 and R.p(.35) else 0), rung=(30 if du > beat * .9 else 0), trem=(inst_now == 'nguyet' and du > beat * 1.4))
                mm = m if inst_now not in ('cello', 'bassoon', 'trombone', 'horn') or m < 72 else m - 12
                if inst_now in ('cello', 'bassoon', 'trombone') and mm > 70: mm -= 12
                S.add(hum(tk), 'melody', inst_now, mc(mm), du * (.92 if inst_now not in ('sao', 'bau', 'violin') else 1.0), hv(vv), R.f(-.15, .15), 1.0, **opts)
                if lab == 'D' and inst_now not in ('choir',) and e >= 4:   # climax: octave doubling on strings/brass
                    S.add(hum(tk), 'counter', 'strings_hi' if inst_now != 'strings_hi' else 'horn', mc(mm - 12), du, hv(vv * .55), .3, .7)
            # tranh glissando into the phrase (lướt)
            if bip == 0 and li in ('tranh',) and R.p(.6) and mel_cache['notes']:
                first = mel_cache['notes'][0]; sm2 = [x for x in scale_midis(st, first[2] - 14, first[2] - 1, K)][-5:]
                for j, m in enumerate(sm2): S.add(first[0] - (len(sm2) - j) * .045, 'melody', 'tranh', mc(m), .25, .45 + .08 * j, -.2 + .1 * j, .8)
        # counter-melody: guide tones (3rd/7th) moving by step, in a lower register
        if (e >= 3 or (e == 2 and v % 2 == 1) or lab == 'X') and st['counter'] and not last_bar:
            cinst = st['counter'][(v + (1 if lab == 'D' else 0)) % len(st['counter'])]
            if cinst == mel_cache.get('inst'): cinst = st['counter'][(v + 1) % len(st['counter'])]
            guide = [K + x for x in cn[1:]]; cands = []
            for gtone in guide:
                for o in range(-2, 3):
                    mm = gtone + 12 * o
                    if 55 <= mm <= 70: cands.append(mm)
            if cands:
                c = min(cands, key=lambda mm: abs(mm - (prev_counter or 62))); prev_counter = c
                if push: c += 12
                if lab == 'X' or st['feel'] in ('lyrical', 'sparse'): S.add(hum(t0b), 'counter', cinst, mc(c), bar * .97, hv(.6), .35, .75)
                else:
                    S.add(hum(t0b), 'counter', cinst, mc(c), bar * .48, hv(.6), .35, .75)
                    c2 = min(cands, key=lambda mm: abs(mm - c - R.ch([-2, -1, 1, 2]))); S.add(hum(t0b + bar / 2), 'counter', cinst, mc(c2), bar * .48, hv(.55), .35, .75)
    # ------------------------------------------------------------------ hit points
    envm = np.ones(n); envfx = np.ones(n); hits = []; buttons = []; drops = []
    last_hit, last_btn, last_drop = -99, -99, -99
    for i, sc in enumerate(scenes):
        bt = beat_of(sc); t = sc['start']
        if t >= end_t - .05: break
        kind = sc.get('moment') or ''
        is_acc = (bt in ACCENT_BEATS or (bt == 'moment' and kind in ACCENT_MOMENTS)) and (i == 0 or scene_level(scenes[i - 1]) <= scene_level(sc) or bt in ('title', 'reveal', 'chapter'))
        if is_acc and t - last_hit >= (2.5 if bt in ('title', 'reveal', 'chapter', 'payoff') else 5.0):
            bb = min(nbar - 1, int(t / bar)); add_hit(S, st, t, key(bb), chords[bb], R, big=(bt in ('title', 'reveal', 'payoff', 'hook'))); hits.append(round(t, 2)); last_hit = t
            if (bt in DROP_BEATS or kind in DROP_MOMENTS) and t - last_drop >= 20 and t > 1.0:
                a0 = int((t - .45) * SR); a1 = int((t - .33) * SR); tp = int(t * SR)
                envm[a0:a1] = np.minimum(envm[a0:a1], np.linspace(1, .1, max(1, a1 - a0))); envm[a1:tp] = np.minimum(envm[a1:tp], .1)
                envm[tp:tp + int(.05 * SR)] = np.minimum(envm[tp:tp + int(.05 * SR)], np.linspace(.1, 1, int(.05 * SR)))
                S.add(t - 1.2, 'fx', 'revcym', None, 1.2, .5, -.2, .3); drops.append(round(t, 2)); last_drop = t
        if bt in BUTTON_BEATS and sc['dur'] >= 2.0 and i + 1 < len(scenes):
            tb = sc['start'] + sc['dur'] - .22
            if tb - last_btn >= 9 and tb < end_t - .3:
                bb = min(nbar - 1, int(tb / bar)); add_button(S, st, tb, key(bb), R); buttons.append(round(tb, 2)); last_btn = tb
                nb_t = (int(tb / bar) + 1) * bar                     # re-enter on the next bar line, never mid-bar
                a = int((tb - .3) * SR); z = int(min(nb_t, tb + bar) * SR)
                if z > a:
                    envm[a:int(tb * SR)] = np.minimum(envm[a:int(tb * SR)], np.linspace(1, .5, max(1, int(tb * SR) - a)))
                    envm[int(tb * SR):z] = np.minimum(envm[int(tb * SR):z], .32)
    # ------------------------------------------------------------------ the end cadence (resolved on the end frame)
    Kf = key(nbar); add_final(S, st, end_t + .03, Kf, R)
    fe = int((end_t + .02) * SR); envm[fe:] = 0.0   # everything stops on the end frame except the final chord (fx/final role)
    tail = int((end_t + 2.2) * SR)
    if tail < n: envfx[tail:] *= np.clip(1 - (np.arange(n - tail) / SR) / 1.6, 0, 1)
    # ------------------------------------------------------------------ render
    stems = render_events(S, n, R)
    if st.get('crackle'):
        stems['fx'] += np.stack([INST['crackle']['fn'](0, n / SR, 1, R), INST['crackle']['fn'](0, n / SR, 1, R)]) * .05
    for k in ('drums', 'bass', 'harmony', 'melody'): stems[k] *= envm[None, :]
    stems['final'] *= envfx[None, :]
    stems['fx'] *= envfx[None, :]
    stems = process_stems(stems, st, S, P, R)
    master, g = master_bus(stems, st, target_lufs)
    info = dict(mood=mood, bpm=st['bpm'], bars=nbar, form=''.join({'intro': 'i', 'build': '^', 'X': 'x'}.get(l, l) for l in P['lab']), hits=hits, buttons=buttons, drops=drops,
                modulation=(P['mod_bar'], P['mod_st']), events=len(S.ev), secs=round(time.time() - t0, 1))
    if stems_dir:
        os.makedirs(stems_dir, exist_ok=True); info['stems'] = {}
        for k in STEMS: info['stems'][k] = os.path.join(stems_dir, f'{k}.wav'); write(info['stems'][k], np.clip(stems[k] * g, -1, 1))
    return master, info

# ---------------------------------------------------------------- hit point builders (events)
def add_hit(S, st, t, K, spec, R, big=False):
    h = st['hit']; r, cn = chord_pcs(spec if spec in (0, 4, 5, 3) else 0, st); vo = voice([K + x for x in cn], K + r, None, 55, 76)
    g = 1.0 if big else .75
    if h == 'orch':
        for m in vo + [vo[0] - 12]: S.add(t, 'fx', 'brass_sec' if m > 52 else 'trombone', m, .32, .95 * g, R.f(-.4, .4), .55)
        for m in vo: S.add(t, 'fx', 'strings_hi', m + 12, .25, .8 * g, R.f(-.5, .5), .4)
        S.add(t, 'fx', 'timpani', K - 24 if K - 24 > 36 else K - 12, 1.5, g, 0, .8)
        S.add(t, 'fx', 'crash', None, 2, .9 * g, -.2, .5); S.add(t, 'fx', 'taiko', None, 1, g, 0, .7)
    elif h == 'pop':
        for m in vo: S.add(t, 'fx', 'pluck_syn', m + 12, .3, .9 * g, R.f(-.4, .4), .5)
        S.add(t, 'fx', 'kick', None, .4, g, 0, .9); S.add(t, 'fx', 'crash', None, 2, .8 * g, -.2, .5); S.add(t, 'fx', 'subdrop', None, 1.5, .7 * g, 0, .5)
    elif h == 'comedy':
        for m in vo: S.add(t, 'fx', 'pizz', m, .3, .9, R.f(-.4, .4), .6)
        S.add(t, 'fx', 'xylo', vo[-1] + 12, .3, .8, .3, .45); S.add(t, 'fx', 'crash', None, 1.2, .55 * g, -.2, .35); S.add(t, 'fx', 'tuba', vo[0] - 24 if vo[0] - 24 > 30 else vo[0] - 12, .3, .9, 0, .6)
    elif h == 'vn':
        S.add(t, 'fx', 'chieng', None, 3, g, .1, .7); S.add(t, 'fx', 'trong', None, 1.4, g, 0, .9)
        for m in vo[:2]: S.add(t, 'fx', 'strings_hi', m + 12, .4, .7 * g, R.f(-.5, .5), .35)
    elif h == 'tension':
        S.add(t, 'fx', 'impact', None, 1.5, g, 0, .7); S.add(t, 'fx', 'strings_hi', K + 13, .5, .8, .4, .3); S.add(t, 'fx', 'strings_hi', K + 12, .5, .8, -.4, .3)
        S.add(t, 'fx', 'timpani', K - 12, 1.5, g, 0, .6)
    else:  # soft
        for m in vo: S.add(t, 'fx', 'bell' if m > 60 else 'glock', m + 12, 1.5, .6 * g, R.f(-.5, .5), .35)
        S.add(t, 'fx', 'crash', None, 2, .45 * g, -.2, .3); S.add(t, 'fx', 'kick_soft', None, .4, .8 * g, 0, .7)
def add_button(S, st, t, K, R):
    """comic button: a 2-note 'bum-BUM' (V -> I) landing at t (the gag's last frame)"""
    fam = st['hit']
    if fam in ('comedy',):
        S.add(t - .17, 'fx', 'pizz', K - 5, .12, .8, -.2, .6); S.add(t - .17, 'fx', 'bassoon', K - 17, .12, .7, 0, .5)
        S.add(t, 'fx', 'pizz', K, .2, 1, .2, .7); S.add(t, 'fx', 'bassoon', K - 12, .22, .9, 0, .6); S.add(t, 'fx', 'woodblock', 1300, .1, .8, .3, .5)
    elif fam in ('vn',):
        S.add(t - .15, 'fx', 'mo', 900, .1, .7, .3, .55); S.add(t, 'fx', 'mo', 700, .1, .9, .3, .6); S.add(t, 'fx', 'tranh', K + 12, .4, .8, -.2, .6)
    elif fam in ('orch',):
        S.add(t - .16, 'fx', 'pizz', K - 5, .12, .8, -.2, .6); S.add(t, 'fx', 'pizz', K, .2, 1, .2, .7); S.add(t, 'fx', 'timpani', K - 12 if K - 12 > 36 else K, .5, .7, 0, .5)
    elif fam in ('pop',):
        S.add(t - .15, 'fx', 'pluck_syn', K + 7, .12, .8, -.2, .5); S.add(t, 'fx', 'pluck_syn', K + 12, .25, 1, .2, .55); S.add(t, 'fx', 'clap', None, .2, .8, 0, .4)
    else:
        S.add(t - .15, 'fx', 'glock', K + 19, .3, .6, -.3, .3); S.add(t, 'fx', 'glock', K + 24, .5, .8, .3, .35); S.add(t, 'fx', 'pizz', K, .2, .8, 0, .4)
def add_final(S, st, t, K, R):
    """resolved tonic chord on the end frame (role 'final' survives the stop envelope)"""
    r, cn = chord_pcs(0, st); vo = voice([K + x for x in cn], K, None, 55, 76); fam = st['hit']
    lead = st['leads'][0]; pad = st.get('pad') or 'strings'
    for m in vo: S.add(t, 'final', pad, m, 2.4, .8, R.f(-.5, .5), .55 if pad not in ('pad', 'pad_air') else .45)
    for m in vo: S.add(t, 'final', 'piano' if fam not in ('vn',) else 'tranh', m, 2.2, .7, R.f(-.4, .4), .4)
    S.add(t, 'final', lead, vo[-1] + (12 if vo[-1] < 64 else 0), 2.0, .8, 0, .6 * INST_GAIN.get(lead, .5) / .5)
    S.add(t, 'final', st['bass_inst'], K - 24 if K - 24 >= 33 else K - 12, 2.0, .9, 0, .9 * INST_GAIN.get(st['bass_inst'], .6) / .6)
    S.add(t, 'final', 'crash', None, 2, .6, -.2, .35)
    if fam == 'vn': S.add(t, 'final', 'chieng', None, 3, .8, .1, .55)
    elif fam in ('orch', 'tension'): S.add(t, 'final', 'timpani', K - 24 if K - 24 > 36 else K - 12, 1.5, .8, 0, .6)
    else: S.add(t, 'final', 'kick_soft', None, .4, .8, 0, .6)

# ---------------------------------------------------------------- rendering
def render_events(S, n, R):
    stems = {k: np.zeros((2, n)) for k in STEMS + ['final']}
    cache = {}
    for (t, role, name, midi, dur, vel, pan, gain, opts) in S.ev:
        spec = INST.get(name)
        if spec is None: continue
        f = 0.0 if midi is None else (float(midi) if midi > 127 else mtof(midi))   # > 127 = literal Hz
        cacheable = spec['cache'] and not opts
        k = (name, round(f, 2), round(dur, 2), round(vel, 1), R.i(3) if role in ('drums',) or name in ('pizz', 'guitar', 'steel', 'harp', 'ubass') else 0) if cacheable else None
        if k is not None and k in cache: x = cache[k]
        else:
            x = np.array(spec['fn'](f, max(.02, dur), float(np.clip(vel, .05, 1.3)), R, **opts), dtype=float)
            fo = min(len(x), 256); x[-fo:] *= np.linspace(1, 0, fo)            # de-click tails
            if k is not None: cache[k] = x
        g = (gain * INST_GAIN.get(name, 1.0) if role not in ('drums',) else gain) * ROLE_GAIN.get(role, 1.0)
        stem = 'final' if role == 'final' else ROLE_STEM.get(role, 'fx')
        i = int(t * SR)
        if i < 0: x = x[-i:]; i = 0
        j = min(n, i + len(x))
        if j <= i: continue
        gl, gr = pan_gains(pan); seg = x[:j - i] * g
        stems[stem][0, i:j] += seg * gl; stems[stem][1, i:j] += seg * gr
    return stems

_IR = {}
def hall_ir(t60=1.8, seed=11):
    k = (round(t60, 2), seed)
    if k in _IR: return _IR[k]
    r = np.random.default_rng(seed); L = int(SR * min(4.0, t60 * 1.15)); t = np.arange(L) / SR; out = []
    for c in range(2):
        nz = r.uniform(-1, 1, L)
        lo = lp(nz, 500) * np.exp(-6.9 * t / (t60 * 1.15)); mid = bp(nz, 500, 4000) * np.exp(-6.9 * t / t60); hi = hp(nz, 4000) * np.exp(-6.9 * t / (t60 * .45))
        ir = (lo + mid + hi * .6) * np.clip(t / .03, 0, 1)
        pre = int(.018 * SR); ir = np.concatenate([np.zeros(pre), ir])[:L]
        for d, a in ((.011, .5), (.019, .35), (.027, .3), (.041, .2)):   # early reflections
            ir[int((d + c * .003) * SR)] += a * (1 if r.random() > .5 else -1)
        out.append(ir / np.sqrt(np.sum(ir ** 2)))
    _IR[k] = np.stack(out); return _IR[k]

def widen(x, amt, ms):
    """mono-compatible width: add a delayed, high-passed copy of the mid signal to the side channel (cancels in mono)"""
    d = int(SR * ms / 1000); mid = x.mean(0); ex = np.zeros_like(mid); ex[d:] = hp(mid, 250)[:-d] * amt
    return np.stack([x[0] + ex, x[1] - ex])

BALANCE = {'default': dict(drums=-3, bass=-4, harmony=-3), 'soft': dict(drums=-7, bass=-5, harmony=-2.5),
           'drive': dict(drums=-1.5, bass=-3.5, harmony=-3), 'comic': dict(drums=-4.5, bass=-3, harmony=-4)}
SEND = {'drums': .08, 'bass': .0, 'harmony': .3, 'melody': .26, 'fx': .2, 'final': .25}
def process_stems(stems, st, S, P, R):
    n = stems['drums'].shape[1]; t60 = st.get('verb', 1.5); ir = hall_ir(t60)
    # final chord: split back into stems so stem export sums to the mix
    stems['harmony'] += stems.pop('final')
    # sidechain: bass+harmony pump against the kick (upbeat/house)
    if st.get('sc'):
        env = np.ones(n); depth = st['sc']; L = int(SR * P['beat'] * .7); curve = 1 - depth * np.exp(-np.arange(L) / (L / 4))
        for (t, role, name, *_r) in S.ev:
            if role == 'drums' and name.startswith('kick'):
                i = max(0, int(t * SR)); j = min(n, i + L)
                if j > i: env[i:j] = np.minimum(env[i:j], curve[:j - i])
        stems['bass'] *= env; stems['harmony'] *= env
    stems['bass'] = hp(stems['bass'], 32, 2)
    stems['harmony'] = hp(stems['harmony'], 110, 2); stems['harmony'] -= .35 * bp(stems['harmony'], 170, 420)   # carve low-mid mud
    stems['melody'] = hp(stems['melody'], 180, 2) * 1.35
    stems['harmony'] = widen(stems['harmony'], .55, 13); stems['melody'] = widen(stems['melody'], .25, 9); stems['drums'] = widen(stems['drums'], .2, 7)
    if st.get('crackle') or st.get('wow'):
        for k in ('harmony', 'melody'): stems[k] = lp(stems[k], 7500, 2)
    # tempo-synced ping-pong delay on melody
    if st.get('delay'):
        d = int(SR * P['beat'] * .75); m = stems['melody']; dl = np.zeros_like(m); src = lp(hp(m.mean(0), 300), 5000)
        for k in range(1, 5):
            off = d * k
            if off >= n: break
            dl[(k + 1) % 2, off:] += src[:n - off] * (.32 ** k) * 1.2
        stems['melody'] = m + dl
    for k in STEMS:
        sd = SEND[k] * (t60 / 1.6) ** .5
        if sd <= 0 or not np.any(stems[k]): continue
        wet = np.stack([oaconvolve(stems[k][c], ir[c])[:n] for c in range(2)])
        stems[k] = stems[k] + wet * sd
    # auto-balance: gated BS.1770 loudness of each stem relative to the melody stem (clamped +-8 dB)
    tgt = BALANCE.get(st.get('balance', 'default'))
    ref = lufs(stems['melody']) if np.any(stems['melody']) else None
    if ref is not None and ref > -60:
        for k, off in tgt.items():
            if np.any(stems[k]):
                l = lufs(stems[k])
                if l > -60: stems[k] *= 10 ** (float(np.clip(ref + off - l, -8, 8)) / 20)
        if np.any(stems['fx']):
            lf = lufs(stems['fx'])
            if lf > ref - 4: stems['fx'] *= 10 ** ((ref - 4 - lf) / 20)          # hits never shout over the band
    if st.get('wow'):     # tape wow & flutter on the whole music bed
        t = np.arange(n) / SR; cents = 9 * np.sin(TWOPI * .45 * t) + 3 * np.sin(TWOPI * 5.7 * t)
        for k in STEMS:
            if np.any(stems[k]):
                y = np.stack([pitch_warp(stems[k][c], cents) for c in range(2)]); stems[k] = np.pad(y, ((0, 0), (0, n - y.shape[1])))[:, :n]
    return stems

# ---------------------------------------------------------------- loudness (ITU-R BS.1770-4) and true peak
def k_weight(x):
    f0, G, Q = 1681.974450955533, 3.999843853973347, 0.7071752369554196
    K = np.tan(np.pi * f0 / SR); Vh = 10 ** (G / 20); Vb = Vh ** 0.4996667741545416; a0 = 1 + K / Q + K * K
    b1 = [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0]; a1 = [1, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]
    f0, Q = 38.13547087602444, 0.5003270373238773; K = np.tan(np.pi * f0 / SR); d = 1 + K / Q + K * K
    b2 = [1, -2, 1]; a2 = [1, 2 * (K * K - 1) / d, (1 - K / Q + K * K) / d]
    return lfilter(b2, a2, lfilter(b1, a1, x, axis=-1), axis=-1)
def lufs(x):
    x = np.atleast_2d(x); y = k_weight(x); blk, hop = int(.4 * SR), int(.1 * SR)
    if y.shape[1] < blk: y = np.pad(y, ((0, 0), (0, blk - y.shape[1])))
    p2 = (y ** 2).sum(0); cs = np.concatenate([[0], np.cumsum(p2)])
    starts = np.arange(0, y.shape[1] - blk + 1, hop); z = (cs[starts + blk] - cs[starts]) / blk
    l = -0.691 + 10 * np.log10(z + 1e-12); g = z[l > -70]
    if not len(g): return -70.
    lr = -0.691 + 10 * np.log10(g.mean()) - 10; g2 = z[(l > -70) & (l > lr)]
    return float(-0.691 + 10 * np.log10(g2.mean()))
def lufs_momentary_max(x):
    x = np.atleast_2d(x); y = k_weight(x); blk, hop = int(.4 * SR), int(.05 * SR)
    if y.shape[1] < blk: y = np.pad(y, ((0, 0), (0, blk - y.shape[1])))
    p2 = (y ** 2).sum(0); cs = np.concatenate([[0], np.cumsum(p2)]); s = np.arange(0, y.shape[1] - blk + 1, hop)
    return float((-0.691 + 10 * np.log10((cs[s + blk] - cs[s]) / blk + 1e-12)).max())
def true_peak_db(x):
    up = resample_poly(np.atleast_2d(x), 4, 1, axis=1); return float(20 * np.log10(np.abs(up).max() + 1e-12))

def tp_limit(x, ceil_db=-1.6, la_ms=1.5, rel_ms=60):
    c = 10 ** (ceil_db / 20); up = resample_poly(x, 4, 1, axis=1); n = x.shape[1]
    pk = np.abs(up).max(0)[:n * 4]; pk = np.pad(pk, (0, max(0, n * 4 - len(pk))))[:n * 4].reshape(n, 4).max(1)
    gr = np.maximum(0, 20 * np.log10(np.maximum(pk, 1e-9) / c))
    if gr.max() <= 0: return x
    la = max(1, int(SR * la_ms / 1000)); h = maximum_filter1d(gr, 2 * la + 1)
    h = uniform_filter1d(h, la + 1); h = maximum_filter1d(h, la + 1)
    a = np.exp(-1 / (SR * rel_ms / 1000)); rel = lfilter([1 - a], [1, -a], h); g = np.maximum(h, rel)
    return x * 10 ** (-g / 20)[None, :]

def master_bus(stems, st, target=-16.):
    mix = sum(stems[k] for k in STEMS)
    # tone: gentle presence (phone band) + low rumble cut
    mix = hp(mix, 28, 2); mix = mix - .25 * lp(mix, 110, 2) + bp(mix, 1800, 4500) * .2 + bp(mix, 500, 1500) * .08
    # glue compressor (RMS, 2:1 above threshold, 30 ms / 250 ms)
    g0 = 10 ** ((-20 - lufs(mix)) / 20); mix *= g0
    lvl = np.sqrt(lfilter([1 - np.exp(-1 / (SR * .03))], [1, -np.exp(-1 / (SR * .03))], (mix ** 2).max(0)) + 1e-12)
    db = 20 * np.log10(lvl); thr = -20; over = np.maximum(0, db - thr); grd = over * (1 - 1 / 2.0)
    a = np.exp(-1 / (SR * .25)); grd = np.maximum(grd, lfilter([1 - a], [1, -a], grd)); gc = 10 ** (-grd / 20)
    mix *= gc[None, :]
    # tape saturation (soft, level-dependent)
    drive = 1.6; mix = np.tanh(mix * drive) / drive
    # loudness to target, then true-peak limit (iterate)
    gain_total = g0
    for _ in range(3):
        gl = 10 ** ((target - lufs(mix)) / 20); mix *= gl; gain_total *= gl
        mix = tp_limit(mix, -1.6)
        if abs(lufs(mix) - target) < .3 and true_peak_db(mix) <= -1.5: break
    tp = true_peak_db(mix)
    if tp > -1.5: mix *= 10 ** ((-1.55 - tp) / 20)
    # the gain to apply to stems so they sum to (approximately) the pre-limiter master
    stem_gain = gain_total * float(np.median(gc))
    return mix, stem_gain

# ============================================================================ stingers
STINGERS = ['comedy_button', 'reveal', 'fail', 'win', 'tension_hit', 'vn_gong', 'chapter', 'transition', 'record_scratch_stop']
def stinger(kind, mood='adventure', seed='sting'):
    st = STYLES.get(ALIAS.get(mood, mood), STYLES['adventure']); K = st['root']; R = Rng(int(hashlib.md5((kind + seed).encode()).hexdigest()[:8], 16))
    dur = {'comedy_button': 1.4, 'reveal': 4.2, 'fail': 3.4, 'win': 3.6, 'tension_hit': 3.8, 'vn_gong': 5.0, 'chapter': 4.0, 'transition': 2.4, 'record_scratch_stop': 2.6}[kind]
    n = int(SR * dur); S = Score(n)
    if kind == 'comedy_button':           # "bum-BUM!" V -> I with woodblock
        for t, m, v in ((.05, K - 5, .8), (.3, K, 1.0)):
            S.add(t, 'melody', 'pizz', m, .15, v, -.2, .8); S.add(t, 'melody', 'pizz', m + 12, .15, v * .8, .2, .6); S.add(t, 'bass', 'bassoon', m - 12, .14, v, 0, .8)
        S.add(.3, 'bass', 'tuba', K - 24, .2, .9, 0, .7); S.add(.3, 'drums', 'woodblock', 1300, .1, 1, .3, .6); S.add(.3, 'drums', 'crash', None, 1, .35, -.2, .25)
    elif kind == 'reveal':                # riser -> silence -> orchestral hit + shimmer
        S.add(0, 'fx', 'riser', None, 1.7, .9, 0, .5, base=mtof(K - 12)); S.add(.2, 'fx', 'revcym', None, 1.5, .7, .2, .4)
        th = 1.9; vo = voice([K, K + 4, K + 7], K, None, 55, 72)
        for m in vo + [vo[0] - 12]: S.add(th, 'melody', 'brass_sec', m, .9, 1, R.f(-.4, .4), .55)
        for m in vo: S.add(th, 'harmony', 'strings', m + 12, 2.0, .9, R.f(-.5, .5), .5); S.add(th + .05, 'harmony', 'glock', m + 24, 1, .6, R.f(-.5, .5), .3)
        S.add(th, 'drums', 'timpani', K - 24, 2, 1, 0, .8); S.add(th, 'drums', 'taiko', None, 1, 1, 0, .8); S.add(th, 'drums', 'crash', None, 2, .9, -.2, .5); S.add(th, 'fx', 'subdrop', None, 1.5, .8, 0, .5)
    elif kind == 'fail':                  # sad trombone: 3 falling notes + a long wobbling 4th
        for j, (t, m, d) in enumerate(((.05, K - 2, .38), (.5, K - 3, .38), (.95, K - 4, .38), (1.42, K - 5, 1.6))):
            S.add(t, 'melody', 'trombone', m - 12, d, .9, 0, 1.0, wah=1, last=(j == 3))
        S.add(1.42, 'bass', 'tuba', K - 29, 1.5, .6, 0, .6)
    elif kind == 'win':                   # fanfare: major arpeggio + held tonic + cymbal + glock sparkle
        seq = [(0, K, .18), (.2, K + 4, .18), (.4, K + 7, .18), (.6, K + 12, 1.8)]
        for t, m, d in seq: S.add(t, 'melody', 'trumpet', m, d, 1, 0, .8); S.add(t, 'melody', 'trumpet', m - 5 if t >= .6 else m, d, .6, .3, .4)
        for m in (K - 12, K - 5, K + 4): S.add(.6, 'harmony', 'brass_sec', m, 1.6, .8, R.f(-.4, .4), .45); S.add(.6, 'harmony', 'strings', m + 12, 2.2, .7, R.f(-.5, .5), .4)
        for k in range(8): S.add(.6 + k * .07, 'fx', 'glock', K + 24 + [0, 4, 7, 12][k % 4], .5, .6, -.5 + k * .14, .3)
        S.add(.6, 'drums', 'crash', None, 2, 1, -.2, .5); S.add(.6, 'drums', 'timpani', K - 24, 1.5, 1, 0, .7)
        for k in range(6): S.add(k * .1, 'drums', 'snare', None, .2, .4 + k * .1, 0, .4)
    elif kind == 'tension_hit':           # low cluster + boom + high violin stab (b2)
        S.add(0, 'fx', 'impact', None, 1.6, 1, 0, .8); S.add(0, 'fx', 'subdrop', None, 1.5, .8, 0, .6)
        for m in (K - 24, K - 23, K - 17): S.add(0, 'harmony', 'brass_sec' if m > 40 else 'trombone', m + 12, 1.2, .9, R.f(-.3, .3), .5)
        S.add(0, 'melody', 'strings_hi', K + 25, 1.6, .9, .4, .4); S.add(0, 'melody', 'strings_hi', K + 24, 1.6, .9, -.4, .4)
        S.add(0, 'drums', 'timpani', K - 24, 2, 1, 0, .8); S.add(0, 'drums', 'gong_big', None, 3, .6, 0, .4)
    elif kind == 'vn_gong':               # chiêng + trống + đàn bầu bend
        S.add(0, 'drums', 'trong', None, 1.5, 1, 0, .9); S.add(.0, 'drums', 'chieng', None, 4, 1, .1, .8); S.add(.55, 'drums', 'trong_rim', None, .2, .7, .3, .5)
        S.add(.6, 'drums', 'trong', None, 1.5, .8, 0, .8); S.add(.6, 'drums', 'chieng', mtof(55), 4, .6, -.2, .5)
        S.add(.35, 'melody', 'bau', K + 12, 2.6, .9, 0, .7, scoop=2, fall=0, rise=0)
        for j, m in enumerate([K, K + 2, K + 5, K + 7, K + 9, K + 12]): S.add(.05 + j * .04, 'harmony', 'tranh', m, .5, .6, -.4 + j * .15, .5)
    elif kind == 'chapter':               # swell + timpani + bell chord (a page turn)
        vo = voice([K, K + 4, K + 7, K + 11], K, None, 55, 74)
        for m in vo: S.add(0, 'harmony', 'strings', m, 2.4, .8, R.f(-.5, .5), .5, att=1.1)
        S.add(.2, 'fx', 'revcym', None, 1.0, .5, .2, .4); S.add(1.2, 'drums', 'timpani', K - 24, 2, .9, 0, .7)
        for m in vo: S.add(1.2, 'melody', 'bell', m + 12, 2.5, .7, R.f(-.5, .5), .35); S.add(1.2, 'melody', 'harp', m, 1.5, .6, R.f(-.5, .5), .4)
        S.add(1.2, 'drums', 'crash', None, 2, .5, -.2, .3)
    elif kind == 'transition':            # whoosh + reverse cymbal into a pluck gliss
        S.add(0, 'fx', 'revcym', None, .9, .7, .2, .5); S.add(.2, 'fx', 'whoosh', None, .8, .9, 0, .6)
        for j, m in enumerate([K, K + 2, K + 4, K + 7, K + 9, K + 12, K + 14, K + 16]): S.add(.9 + j * .035, 'melody', 'harp', m + 12, .6, .5 + j * .05, -.5 + j * .13, .45)
        S.add(.9, 'drums', 'kick_soft', None, .4, .8, 0, .6)
    elif kind == 'record_scratch_stop':   # a chord playing -> record scratch -> tape stop -> silence
        vo = voice([K, K + 4, K + 7], K, None, 55, 72)
        for m in vo: S.add(0, 'harmony', 'epiano', m, .9, .8, R.f(-.4, .4), .7)
        S.add(0, 'bass', 'ebass', K - 24, .9, .9, 0, .8)
        for k in range(4): S.add(k * .25, 'drums', 'kick' if k % 2 == 0 else 'snare', None, .2, .8, 0, .6); S.add(k * .25 + .125, 'drums', 'hat', None, .1, .6, .3, .3)
        S.add(.88, 'fx', 'scratch', None, .5, 1, 0, .9)
    stems = render_events_sting(S, n, R, kind)
    mix = sum(stems[k] for k in STEMS) + stems['final']
    ir = hall_ir(1.4); wet = np.stack([oaconvolve(mix[c], ir[c])[:n] for c in range(2)]); mix = mix + wet * .12
    if kind == 'record_scratch_stop':     # tape stop on the music (not on the scratch) from 0.9 s
        i0 = int(.9 * SR); seg = sum(stems[k] for k in ('harmony', 'bass', 'drums'))[:, i0:]
        L = seg.shape[1]; rate = np.clip(1 - np.arange(L) / (SR * .45), 0, 1) ** 1.5; pos = np.cumsum(rate)
        stop = np.stack([np.interp(pos, np.arange(L), seg[c]) for c in range(2)]) * (rate > .01)
        mix[:, i0:] = mix[:, i0:] - seg - wet[:, i0:] * .12 + stop + stems['fx'][:, i0:] * 0
    t = np.arange(n) / SR; mix *= np.clip((dur - t) / .15, 0, 1)[None, :]
    mix = hp(mix, 30)
    mix *= 10 ** ((-14 - lufs_momentary_max(mix)) / 20)
    mix = tp_limit(mix, -1.6); tp = true_peak_db(mix)
    if tp > -1.5: mix *= 10 ** ((-1.55 - tp) / 20)
    return mix

def render_events_sting(S, n, R, kind):
    # like render_events, but supports the sad-trombone 'wah' (mute opening/closing) on a note
    evs = []
    for e in S.ev:
        if e[8].get('wah'):
            t, role, name, midi, dur, vel, pan, gain, opts = e
            x = INST['trombone']['fn'](mtof(midi), dur, vel, R); tt = np.arange(len(x)) / SR
            w = .5 - .5 * np.cos(TWOPI * (2.4 if not opts.get('last') else 1.6) * tt)            # plunger mute "wah"
            x = lp(x, 500) * (1 - w) + x * w
            if opts.get('last'): x = pitch_warp(x, 40 * np.sin(TWOPI * 6 * tt) * np.clip(tt / .5, 0, 1) - 60 * np.clip((tt - 1.1) / .5, 0, 1))
            evs.append((t, role, '_raw', x, dur, vel, pan, gain * INST_GAIN['trombone'], {}))
        else: evs.append(e)
    raw = [e for e in evs if e[2] == '_raw']; S.ev = [e for e in evs if e[2] != '_raw']
    stems = render_events(S, n, R)
    for t, role, _, x, dur, vel, pan, gain, _o in raw:
        i = int(t * SR); j = min(n, i + len(x)); gl, gr = pan_gains(pan); stems[ROLE_STEM[role]][0, i:j] += x[:j - i] * gain * gl; stems[ROLE_STEM[role]][1, i:j] += x[:j - i] * gain * gr
    return stems

# ============================================================================ io + CLI
def write(path, st):
    from scipy.io import wavfile
    d = os.path.dirname(os.path.abspath(path)); os.makedirs(d, exist_ok=True)
    wavfile.write(path, SR, (np.clip(st.T, -1, 1) * 32767).astype(np.int16))

DEMO_CUES = {'duration': 26.0, 'music': 'adventure', 'scenes': [
    {'id': '1_hook', 'start': 0, 'dur': 3.2, 'beat': 'hook'}, {'id': '2_title', 'start': 3.2, 'dur': 3.0, 'beat': 'title'},
    {'id': '3_dialogue', 'start': 6.2, 'dur': 5.1, 'beat': 'dialogue', 'place': 'oldquarter'}, {'id': '4_gag', 'start': 11.3, 'dur': 3.0, 'beat': 'gag'},
    {'id': '5_talk', 'start': 14.3, 'dur': 2.9, 'beat': 'talk'}, {'id': '6_reveal', 'start': 17.2, 'dur': 3.4, 'beat': 'reveal'},
    {'id': '7_moment', 'start': 20.6, 'dur': 3.8, 'beat': 'moment', 'moment': 'street3d'}, {'id': '8_end', 'start': 24.4, 'dur': 1.6, 'beat': 'end'}],
    'subs': [{'t0': .3, 't1': 2.9, 'text': 'How do you cross a street with seven million motorbikes?'}, {'t0': 6.5, 't1': 8.4, 'text': 'I read about this.'},
             {'t0': 8.8, 't1': 10.6, 'text': 'Then why are you still there?'}, {'t0': 11.6, 't1': 13.2, 'text': '…A buffalo?'},
             {'t0': 14.5, 't1': 17.0, 'text': 'Rule number one: never run.'}, {'t0': 21.0, 't1': 23.6, 'text': 'Slow. Steady. Let the bus go.'}],
    'cues': []}

def main(a):
    opt = lambda k, d=None: a[a.index('--' + k) + 1] if '--' + k in a else d
    if not a or a[0] in ('-h', '--help'): print(__doc__); return
    if a[0] == 'list':
        print('moods:', ' '.join(STYLES)); print('aliases:', ', '.join(f'{k}->{v}' for k, v in ALIAS.items())); print('stingers:', ' '.join(STINGERS)); return
    if a[0] == 'score':
        cues = json.load(open(a[1], encoding='utf-8')); mood = opt('mood') or cues.get('music') or 'adventure'; D = cues.get('duration') or 60
        if os.path.exists(mood) or mood.endswith(('.mp3', '.wav', '.m4a', '.ogg')) or mood in ('none', 'off'):
            import importlib.util
            sp = importlib.util.spec_from_file_location('music_legacy', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'music.py'))
            ml = importlib.util.module_from_spec(sp); sp.loader.exec_module(ml)
            write(a[2], ml.load_user_track(mood, D) if mood not in ('none', 'off') else np.zeros((2, int(SR * (D + 1))))); print('music:', a[2], mood); return
        st, info = render_score(cues, mood, opt('seed') or cues.get('title') or a[1], opt('stems'), opt('modulate', 'auto'), float(opt('lufs', -16)))
        write(a[2], st); print('music:', a[2], json.dumps(info, ensure_ascii=False)); return
    if a[0] == 'stinger':
        x = stinger(a[1], opt('mood') or 'adventure', opt('seed') or 'sting'); write(a[2], x); print('stinger:', a[2]); return
    if a[0] == 'demo':
        out = a[1]; os.makedirs(out, exist_ok=True); cues = DEMO_CUES
        if '--cues' in a: cues = json.load(open(opt('cues'), encoding='utf-8'))
        only = opt('only'); moods = only.split(',') if only else list(STYLES)
        for md in moods:
            st, info = render_score(cues, md, 'demo'); write(os.path.join(out, md + '.wav'), st); print(md, json.dumps(info, ensure_ascii=False), flush=True)
        if not only:
            os.makedirs(os.path.join(out, 'stingers'), exist_ok=True)
            for k in STINGERS:
                md = {'comedy_button': 'comedy', 'vn_gong': 'vn_folk', 'fail': 'comedy', 'tension_hit': 'tension', 'chapter': 'emotional'}.get(k, 'adventure')
                write(os.path.join(out, 'stingers', k + '.wav'), stinger(k, md)); print('stinger', k, flush=True)
        return
    print(__doc__)

if __name__ == '__main__':
    main(sys.argv[1:])
