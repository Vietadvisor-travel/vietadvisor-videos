#!/usr/bin/env python3
"""Sound design + final mix for one episode:  EVENT LIST -> RULE TABLE -> PRIORITY SCHEDULER -> BUS MIXER -> QA.

  python3 tools/sound_design.py out/<slug> --story stories/<slug>.story [--design stories/<slug>.sound.json]
                                [--fmt vertical|youtube] [--lufs -13] [--tp -2.0] [--no-stingers] [--legacy-stems]
  python3 tools/sound_design.py qa <mix.wav> [--stems out/<slug>]   # loudness / true peak / phone check of any mix

Inputs  out/<slug>_cues.json (node tools/render.mjs <story> --cues …: scenes, subs, renderer cues and visual `events`),
        out/<slug>_vo.wav (voice.py place).  Sounds: tools/sfx_pro.py (358 layered sounds) → legacy synths below → sfx.py.
Outputs _mix.wav (final: loudness-normalised, true-peak limited) · stems _foley.wav (SFX FG+BG) · _amb.wav (beds) ·
        _music.wav · _sound_qa.json + a printed QA table.
1. EVENTS   renderer `events` (transitions, character enter/exit/pose/expression/moves, camera moves & shakes, UI items,
            lettering) + story beats (beds, beat grammar, street3d/shot_*/map3d/chapter/title film, art=) + `sfx=` cues
            + renderer scene cues + design.json events.
2. RULES    RULES_* tables below map every event kind to layered sounds (name, offset of the sound's PEAK vs the visual
            anchor, dB, pan, priority, tier, bus). Grammar + numbers: references/sound-music.md, research/mix/sound-grammar.md.
3. SCHEDULE duplicates merged (same name < .25 s, hits < .15 s), voice protection (hero hits slide into speech gaps),
            family/T1/riser/comedy spacing, ≤3 foreground sounds at once (≤2 per family), gap filler + density floor.
4. MIX      buses VO · MUS · FG · BG · AMB (+ 3 reverbs): EQ, VO compressor + de-esser, music duck + dynamic EQ keyed by
            the voice, dips (silence before the hit), solved faders, glue, 4× true-peak limiter, loudness target
            (vertical −13 LUFS, YouTube −14 LUFS; TP ≤ −1.5 dBTP after AAC → limiter at −2.3 dBTP).
5. QA       events / 10 s per section, unique sounds, empty windows, concurrency, hits on words, phone-band check, LUFS/TP/LRA.
Story keys: sfx="0.4:egg_crack|1.2:whisk:0.6:-0.2" (offset:sound[:gain[:pan]], negative offset = J-cut) · drop=1.2 ·
foley=no · art=… artfx= artAt= · moment kind=street3d near= bus= walk= mode= flow= hand= done= title= titleAt= traffic= ev= ·
header score: comedy@1 quiz@4 … (mood@scene, crossfaded at the cuts; music from tools/music_pro.py if present, else music.py).
design.json: {"music": [[scene, mood]...], "events": [[scene, off, name, gain, pan, {opts}]...], "dips": [t...], "auto": true,
              "music_db": -14.5, "amb_db": -20, "stingers": true, "lufs": -14}   (music_db/amb_db shift the solved faders)
"""
import gc
import json, sys, os, re, subprocess, importlib.util, zlib, math
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, sosfiltfilt, fftconvolve, resample_poly, oaconvolve
from scipy.ndimage import maximum_filter1d, uniform_filter1d

SR = 44100
rng = np.random.default_rng(11)
HERE = os.path.dirname(os.path.abspath(__file__))
def _load(modname, fn):
    p = os.path.join(HERE, fn)
    if not os.path.exists(p): return None
    try:
        sp = importlib.util.spec_from_file_location(modname, p); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); return m
    except Exception as e:
        print(f'warn: {fn} not loaded ({e})'); return None
E = _load('enginesfx', 'sfx.py')          # legacy engine cues (pop ding whoosh …)
P = _load('sfxpro', 'sfx_pro.py')         # professional palette
AMBM = _load('ambience_mod', 'ambience.py')   # place → bed kind (kind_for)

def T(d): return np.arange(int(SR * d)) / SR
def N(d): return rng.uniform(-1, 1, int(SR * d))
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='high', fs=SR, output='sos'), x)
def dec(n, k): return np.exp(-k * np.arange(n) / SR)
def sine(f, d):
    t = T(d); f = np.broadcast_to(f, t.shape) if np.ndim(f) else np.full(t.shape, float(f)); return np.sin(2 * np.pi * np.cumsum(f) / SR)
def place(out, x, t):
    i = int(t * SR); j = min(len(out), i + len(x))
    if j > i >= 0: out[i:j] += x[:j - i]
def fade(x, a=.01, r=.05):
    n = len(x); ai, ri = min(n, int(SR * a)), min(n, int(SR * r)); x = x.copy()
    if ai: x[:ai] *= np.linspace(0, 1, ai)
    if ri: x[-ri:] *= np.linspace(1, 0, ri)
    return x

# ================================================================ legacy synth library (kept for explicit sfx= names)
# ---------------------------------------------------------------- sound library
def egg_crack(**k):
    out = np.zeros(int(SR * .45))
    for i, (t, g) in enumerate([(0, 1), (.018, .7), (.05, .5), (.075, .35)]):
        c = hp(N(.012), 1800) * dec(int(SR * .012), 380) * g; place(out, c, t)
    shell = bp(N(.09), 2500, 7000) * dec(int(SR * .09), 60) * .35; place(out, shell, .01)
    drip = sine(np.linspace(900, 380, int(SR * .07)), .07) * dec(int(SR * .07), 50) * .5; place(out, drip, .3)
    return out
def whisk(dur=2.0, rate=7.5, accel=0.3, **k):
    out = np.zeros(int(SR * (dur + .2))); t = 0; i = 0
    while t < dur:
        g = .55 + .45 * rng.random(); s = bp(N(.075), 1400 + 900 * rng.random(), 6500) * np.hanning(int(SR * .075)) * g
        place(out, s, t)
        if i % 4 == 3: place(out, E.S['clink']() * .18, t + .02)   # wire tink on the bowl
        r = rate * (1 + accel * t / max(dur, .1)); t += 1 / r * (.85 + .3 * rng.random()); i += 1
    return out
def pour(dur=1.4, lo=500, hi=1200, **k):
    n = int(SR * dur); x = N(dur); out = np.zeros(n); seg = 1024
    for i in range(0, n, seg):
        f = lo + (hi - lo) * (i / n) ** .7; out[i:i + seg] = bp(x[i:i + seg], f * .8, f * 1.25)
    gurgle = sine(220 + 60 * np.sin(np.linspace(0, 60, n)), dur) * .15 * (rng.random(n) > .985)
    out = out * (.7 + .3 * np.sin(np.linspace(0, 40, n)) ** 2) + lp(gurgle, 800)
    return fade(out * 1.4, .08, .25)
def spoon_clink(**k):
    f0 = 3000 + 600 * rng.random(); d = .55
    out = (sine(f0, d) + .6 * sine(f0 * 1.71, d) + .35 * sine(f0 * 2.53, d)) * dec(int(SR * d), 14) * .5
    place(out, hp(N(.004), 4000) * .4, 0); return out
def cup_set(**k):
    d = .5; out = (sine(1850, d) + .5 * sine(2900, d)) * dec(int(SR * d), 22) * .35
    thud = (sine(np.linspace(180, 90, int(SR * .08)), .08) + lp(N(.08), 900) * .5) * dec(int(SR * .08), 45)
    place(out, thud, 0); return out
def door_bell(**k):
    out = np.zeros(int(SR * 1.6))
    for t, f in [(0, 2093), (.09, 1568), (.2, 2093), (.32, 1760)]:
        d = 1.2; x = (sine(f, d) + .4 * sine(f * 2.76, d)) * dec(int(SR * d), 3.5) * (.35 + .1 * rng.random()); place(out, x, t)
    return out
def register(**k):
    out = np.zeros(int(SR * 1.4)); place(out, hp(N(.03), 2000) * dec(int(SR * .03), 120), 0)
    place(out, (lp(N(.12), 3000) * dec(int(SR * .12), 30)) * .6, .05)
    d = 1.2; place(out, (sine(1567, d) + .5 * sine(3134, d) + .3 * sine(2349, d)) * dec(int(SR * d), 3) * .5, .18); return out
def coins(**k):
    out = np.zeros(int(SR * .9))
    for i in range(6):
        f = 4200 + 2500 * rng.random(); d = .25
        place(out, (sine(f, d) + .5 * sine(f * 1.5, d)) * dec(int(SR * d), 25) * (.2 + .2 * rng.random()), i * .07 + .03 * rng.random())
    return out
def footsteps(n=4, gap=.42, surface='wood', **k):
    out = np.zeros(int(SR * (n * gap + .4)))
    for i in range(n):
        d = .12; x = (sine(np.linspace(140, 70, int(SR * d)), d) * .8 + lp(N(d), 1200 if surface == 'wood' else 2500) * .6) * dec(int(SR * d), 40)
        if surface == 'wood': x += bp(N(d), 300, 900) * dec(int(SR * d), 25) * .3
        place(out, x * (.7 + .3 * rng.random()), i * gap + .03 * rng.random())
    return out
def fan(dur=8.0, **k):
    n = int(SR * dur); t = np.arange(n) / SR
    hum = (np.sin(2 * np.pi * 58 * t) * .3 + np.sin(2 * np.pi * 116 * t) * .12)
    air = lp(N(dur), 700) * (.6 + .4 * np.sin(2 * np.pi * 1.6 * t))   # blade swish ~1.6 Hz
    return fade((hum + air) * .35, 1.0, 1.0)
def record_scratch(**k):
    d = .55; n = int(SR * d); x = N(d); out = np.zeros(n); seg = 256
    f = np.concatenate([np.linspace(300, 2600, n // 2), np.linspace(2600, 200, n - n // 2)])
    for i in range(0, n, seg): out[i:i + seg] = bp(x[i:i + seg], f[i] * .7, min(SR / 2 - 200, f[i] * 1.4))
    return out * np.hanning(n) * 2.2
def rumble(**k):
    d = 3.0; x = lp(N(d), 120, 4) * dec(int(SR * d), 1.6) * 3.0
    x += lp(N(d), 60, 4) * dec(int(SR * d), .9) * 1.5; return fade(x, .05, .8)
def steam(dur=3.0, **k):
    return fade(hp(N(dur), 3500) * (np.hanning(int(SR * dur)) ** .5) * .5, .3, .8)
def simmer(dur=3.5, **k):
    out = lp(N(dur), 500) * .25
    for i in range(int(dur * 14)):
        d = .05; f = 300 + 500 * rng.random(); place(out, sine(np.linspace(f, f * 1.8, int(SR * d)), d) * np.hanning(int(SR * d)) * .3, rng.random() * dur)
    return fade(out, .3, .5)
def slide_whistle(up=True, **k):
    d = .55; f = np.linspace(500, 1700, int(SR * d)) if up else np.linspace(1700, 450, int(SR * d))
    f = f * (1 + .02 * np.sin(np.linspace(0, 40, len(f))))
    return (sine(f, d) + .15 * sine(f * 2, d)) * np.hanning(int(SR * d)) ** .4 * .45
def tape_rewind(**k):
    d = 1.5; n = int(SR * d); x = N(d); out = np.zeros(n); seg = 512
    for i in range(0, n, seg):
        f = 400 + 3500 * (i / n) ** 1.5; out[i:i + seg] = bp(x[i:i + seg], f * .8, min(SR / 2 - 300, f * 1.3))
    warble = sine(np.linspace(180, 1400, n) * (1 + .1 * np.sin(np.linspace(0, 90, n))), d) * .25
    return (out * 1.2 + warble) * np.linspace(.2, 1, n) ** 1.2 * np.hanning(n) ** .3
def shutter(**k):
    out = np.zeros(int(SR * .2))
    for t in (0, .07): place(out, hp(N(.02), 2500) * dec(int(SR * .02), 200), t)
    return out
def heartbeat(n=3, gap=.85, **k):
    out = np.zeros(int(SR * (n * gap + .5)))
    for i in range(n):
        for t, g in ((0, 1), (.22, .7)):
            d = .18; place(out, sine(np.linspace(70, 45, int(SR * d)), d) * dec(int(SR * d), 22) * g, i * gap + t)
    return out
def drumroll(dur=2.0, **k):
    out = np.zeros(int(SR * (dur + .6))); t = 0
    while t < dur:
        g = .25 + .75 * (t / dur); d = .05; place(out, bp(N(d), 1500, 7000) * dec(int(SR * d), 60) * g * .6, t); t += .028
    hit = (sine(np.linspace(160, 60, int(SR * .4)), .4) + lp(N(.4), 3000) * .5) * dec(int(SR * .4), 10)
    place(out, hit, dur); return out
def typing(dur=2.0, **k):
    out = np.zeros(int(SR * (dur + .4))); t = 0
    while t < dur:
        place(out, hp(N(.02), 2500) * dec(int(SR * .02), 180) * (.4 + .4 * rng.random()), t); t += .08 + .1 * rng.random()
    place(out, (E.S['ding']() * .35), dur); return out
def tram_bell(**k):
    out = np.zeros(int(SR * 1.8))
    for t in (0, .35):
        d = 1.4; place(out, (sine(1046, d) + .6 * sine(2350, d) + .3 * sine(3400, d)) * dec(int(SR * d), 3) * .35, t)
    return out
def bike_bell(**k):
    out = np.zeros(int(SR * 1.0))
    for t in (0, .14):
        d = .7; place(out, (sine(3100, d) + .5 * sine(4650, d)) * dec(int(SR * d), 6) * .3 * (1 + .3 * np.sin(np.linspace(0, 120, int(SR * d)))), t)
    return out
def slurp(**k):
    d = .6; n = int(SR * d); x = N(d); out = np.zeros(n); seg = 512
    for i in range(0, n, seg): f = 800 + 1800 * (i / n); out[i:i + seg] = bp(x[i:i + seg], f * .7, f * 1.3)
    return out * np.hanning(n) * 1.3
def claps(n=10, dur=1.6, **k):
    out = np.zeros(int(SR * (dur + .3)))
    for i in range(n):
        t = rng.random() * dur; d = .05; place(out, bp(N(d), 900, 4500) * dec(int(SR * d), 70) * (.5 + .5 * rng.random()), t)
    return out * .8
def creak(**k):
    d = .7; n = int(SR * d); f = 180 + 60 * np.sin(np.linspace(0, 9, n)); x = np.sign(sine(f, d)) * .3
    return bp(x, 400, 2200) * np.hanning(n) * .8
def squeak(**k):
    d = .18; return sine(np.linspace(2400, 3100, int(SR * d)), d) * np.hanning(int(SR * d)) * .2
def wipe(n=4, gap=.5, **k):
    out = np.zeros(int(SR * (n * gap + .4)))
    for i in range(n): place(out, bp(N(.3), 800, 3000) * np.hanning(int(SR * .3)) * .35, i * gap)
    return out
def knock(n=3, gap=.18, **k):
    out = np.zeros(int(SR * (n * gap + .3)))
    for i in range(n):
        d = .1; place(out, (sine(np.linspace(220, 120, int(SR * d)), d) + lp(N(d), 1500) * .4) * dec(int(SR * d), 50) * .7, i * gap)
    return out
def clock(dur=3.0, accel=2.5, **k):
    out = np.zeros(int(SR * (dur + .2))); t = 0; i = 0
    while t < dur:
        d = .03; place(out, bp(N(d), 2000 if i % 2 else 2600, 6000) * dec(int(SR * d), 150) * .6, t)
        t += .5 / (1 + accel * t / dur); i += 1
    return out
def sugar(**k):
    d = .9; return fade(bp(N(d), 2500, 9000) * (rng.random(int(SR * d)) > .6) * .5, .05, .3)
def plop(**k):
    d = .18; return sine(np.linspace(260, 520, int(SR * d)), d) * dec(int(SR * d), 25) * .5
def scooter_horn(**k):
    d = .32; out = np.zeros(int(SR * .8))
    for t in (0, .38):
        x = np.sign(sine(415, d)) * .5 + np.sign(sine(523, d)) * .5; place(out, lp(x, 2500) * fade(np.ones(int(SR * d)), .01, .04) * .4, t)
    return out
def ooh(**k):   # small crowd "ooh" chord (soft vowel pad)
    d = 1.4; n = int(SR * d); out = np.zeros(n)
    for f in (196, 247, 294, 392):
        v = sine(f * (1 + .004 * rng.standard_normal()) * (1 + .03 * np.linspace(-1, 0, n)), d)
        out += bp(np.sign(v) * .5 + v * .5, 300, 1400) * .2
    return out * np.hanning(n)

# ---- cinematic layer (trailer grammar): risers into reveals, sub-drop hits, silence before the hit, city beds
def riser(dur=1.8, **k):   # noise + tone climbing to the cut; ends exactly at dur (place it at hit_time - dur)
    n = int(SR * dur); t = np.arange(n) / SR; c = (t / dur) ** 2
    sw = sosfilt(butter(2, [300, 6000], btype='band', fs=SR, output='sos'), N(dur)) * c
    tone = sine(110 * 2 ** (3 * c), dur) * .35 + sine(165 * 2 ** (3 * c), dur) * .2
    return (sw * .8 + tone) * c * fade(np.ones(n), .2, .02)
def boom(**k):           # trailer sub-drop + body + air tail
    d = 2.2; n = int(SR * d); t = np.arange(n) / SR
    sub = sine(np.geomspace(90, 32, n), d) * np.exp(-t * 2.2) * 1.2; body = lp(N(d), 900) * np.exp(-t * 9) * .7
    air = hp(N(d), 3000) * np.exp(-t * 3) * .12; return np.tanh((sub + body + air) * 1.4)
def riser_hit(**k):      # riser that lands on a boom (the hit sits at +1.6 s)
    r = riser(1.6); b = boom(); out = np.zeros(len(r) + len(b)); out[:len(r)] += r * .8; out[len(r):] += b; return out
def braam(dur=2.4, **k): # low brass-like swell for reveals of scale
    n = int(SR * dur); t = np.arange(n) / SR; x = sum(np.sign(sine(f * (1 + .003 * np.sin(t * 5 + i)), dur)) for i, f in enumerate((55, 55.4, 82.4, 110)))
    return lp(x, 700) * np.minimum(1, t / .08) * np.exp(-t * .9) * .5
def shimmer(dur=1.6, **k):
    out = np.zeros(int(SR * dur))
    for i in range(14): f = 1800 + 2600 * rng.random(); place(out, sine(f, .5) * dec(int(SR * .5), 7) * .25, i * dur / 18)
    return out
def neon_buzz(dur=1.0, **k):
    n = int(SR * dur); hum = lp(np.sign(sine(120, dur)), 1500) * .4; gate = np.repeat((rng.random(int(dur * 24) + 1) > .35).astype(float), int(SR / 24) + 1)[:n]
    gate[int(n * .7):] = 1; return hum * gate * fade(np.ones(n), .01, .2)
def tick_roll(dur=1.2, **k):
    out = np.zeros(int(SR * (dur + .9))); k_ = 0; t = 0
    while t < dur: place(out, hp(N(.02), 2500) * dec(int(SR * .02), 300) * .8, t); k_ += 1; t = dur * (k_ / 22) ** .8
    place(out, E.get('ding'), dur); return out
def whoosh_by(**k):      # close scooter pass: doppler engine + air
    d = 1.1; n = int(SR * d); t = np.arange(n) / SR; f = 105 * (1.25 - .5 / (1 + np.exp(-(t - .45) * 14)))
    eng = lp(np.sign(sine(f, d)), 1400) * .5; air = bp(N(d), 600, 3500) * .6; env_ = np.exp(-((t - .45) / .22) ** 2)
    return (eng + air) * env_
def horn_far(**k):
    d = .26; x = lp(np.sign(sine(380 + 40 * rng.random(), d)) * .6 + np.sign(sine(470, d)) * .4, 1800) * fade(np.ones(int(SR * d)), .01, .05)
    out = np.zeros(int(SR * .7)); place(out, x * .5, 0); place(out, x * .35, .32) if rng.random() > .5 else None; return out
def air_brake(**k):
    d = .9; return (hp(N(d), 2500) * .5 + bp(N(d), 900, 2000) * .3) * np.exp(-np.arange(int(SR * d)) / SR * 3.5) * np.minimum(1, np.arange(int(SR * d)) / SR / .02)
def bus_horn(**k):
    d = .7; return lp(np.sign(sine(196, d)) * .6 + np.sign(sine(233, d)) * .4, 1200) * fade(np.ones(int(SR * d)), .02, .12) * .8
def city_bed(dur=6.0, **k):  # Hà Nội street: engine wash, tyre hiss, distant horns, voices murmur
    n = int(SR * dur); t = np.arange(n) / SR
    wash = lp(N(dur), 500) * (.6 + .4 * np.sin(t * .7)) + bp(N(dur), 900, 2600) * .25 * (.5 + .5 * np.sin(t * 1.3 + 1))
    eng = sum(lp(np.sign(sine(70 + 30 * rng.random() + 8 * np.sin(t * (1 + rng.random())), dur)), 600) * (.5 + .5 * np.sin(t * (.5 + rng.random()) + rng.random() * 6)) for _ in range(4)) * .12
    out = wash * .5 + eng
    for _ in range(int(dur / 1.6)): place(out, horn_far() * .18, rng.random() * max(.1, dur - .8))
    return out * fade(np.ones(n), .4, .4)

LIB = {k: v for k, v in globals().items() if callable(v) and k in (
    'egg_crack whisk pour spoon_clink cup_set door_bell register coins footsteps fan record_scratch rumble steam simmer '
    'scooter_horn slide_whistle tape_rewind shutter heartbeat drumroll typing tram_bell bike_bell slurp claps creak squeak wipe knock clock sugar plop ooh '
    'riser boom riser_hit braam shimmer neon_buzz tick_roll whoosh_by horn_far air_brake bus_horn city_bed').split()}


# ================================================================ 0. sound resolution (sfx_pro → legacy synth → sfx.py)
PRO = set(P.REG) if P else set()
PRO_GAIN = {k: v['gain'] for k, v in P.REG.items()} if P else {}
# legacy / engine cue names → sfx_pro (research/sfx/sfx-report.md §4, tuned: UI stamps are thumps, generic impacts mid hits)
LEGACY_TO_PRO = {
    'whoosh': 'whoosh_med', 'map_whoosh': 'whoosh_big', 'impact': 'impact_hit', 'impact_big': 'impact_big', 'boom': 'hit_boom', 'riser': 'riser_noise',
    'braam': 'hit_braam', 'thud': 'impact_thump', 'stamp': 'impact_thump', 'record_scratch': 'trans_record_scratch', 'tape_rewind': 'trans_tape_rewind',
    'slide_whistle': 'cartoon_slide_up', 'slide_down': 'cartoon_slide_down', 'heartbeat': 'hit_heartbeat', 'typing': 'ui_typing', 'tick_roll': 'ui_counter',
    'coins': 'foley_coins', 'footsteps': 'foley_steps', 'knock': 'foley_knock', 'creak': 'foley_creak', 'claps': 'crowd_applause', 'ooh': 'crowd_ooh',
    'gasp': 'crowd_gasp', 'slurp': 'food_slurp', 'spoon_clink': 'food_spoon_stir', 'cup_set': 'food_bowl_set', 'pour': 'food_pour_tea', 'simmer': 'food_boil_broth',
    'sizzle': 'food_wok_sizzle', 'egg_crack': 'food_egg_crack', 'bike_bell': 'vehicle_bike_bell', 'tram_bell': 'vehicle_cyclo_bell', 'scooter_horn': 'vehicle_moto_horn',
    'horn_far': 'vehicle_moto_horn', 'whoosh_by': 'whoosh_by', 'moto_pass': 'vehicle_moto_pass', 'bus_horn': 'vehicle_bus_horn', 'air_brake': 'vehicle_bus_brake',
    'engine_loop': 'vehicle_moto_idle', 'train_horn': 'vehicle_train_horn', 'train_pass': 'vehicle_train_pass', 'city_bed': 'amb_city_traffic', 'fan': 'amb_fan_room',
    'thunder': 'nature_thunder', 'rain_burst': 'nature_rain_burst', 'splash': 'nature_splash', 'firework': 'vn_firework', 'shimmer': 'magic_shimmer',
    'sparkle': 'magic_sparkle', 'boing': 'cartoon_boing', 'pop': 'ui_pop', 'pin_drop': 'ui_pin_drop', 'tick': 'ui_tick', 'clink': 'food_cup_clink', 'pen_draw': 'foley_marker',
    'ding': 'ui_confirm', 'buzzer': 'ui_error', 'slide': 'trans_slide', 'fall': 'cartoon_fall_whistle', 'brake': 'vehicle_skid', 'gulp': 'cartoon_gulp',
    'typewriter': 'ui_key', 'drip': 'nature_drip', 'wind': 'nature_wind_gust', 'shutter': 'ui_shutter', 'squeak': 'cartoon_squeak', 'plop': 'cartoon_plop',
    'door_bell': 'vn_bell_small', 'register': 'ui_glass', 'riser_hit': 'trans_stinger', 'steam': 'whoosh_air'}
# generic names used in the grammar doc → sfx_pro
SPEC_ALIAS = {'whoosh_fast': 'whoosh_small', 'whoosh_long': 'whoosh_big', 'impact_heavy': 'impact_big', 'impact_mid': 'impact_hit', 'hit_soft': 'impact_soft',
              'hit_sub': 'hit_sub_drop', 'hit_stinger': 'hit_snap', 'ui_check': 'ui_pluck', 'ui_cross': 'ui_error', 'impact_stamp': 'impact_thump',
              'ui_ding': 'ui_confirm', 'ui_register': 'ui_glass', 'ui_coins': 'foley_coins', 'riser_soft': 'riser_noise', 'hit_cinematic': 'impact_cinematic',
              'crowd_claps_small': 'crowd_applause', 'hit_punch': 'impact_body'}
BED_LEGACY = {'city_bed', 'fan', 'simmer', 'steam', 'rumble'}
def resolve(name):
    for n in (name, SPEC_ALIAS.get(name), LEGACY_TO_PRO.get(name)):
        if n and n in PRO: return 'pro', n
    if name in LIB or name == 'slide_down': return 'lib', name
    if E and name in E.S: return 'eng', name
    return None, name

def pitch_shift(x, st):
    f = 2 ** (st / 12.); idx = np.arange(0, len(x) - 1, f); return np.interp(idx, np.arange(len(x)), x)
def env_db(x, hop=441):
    n = len(x) // hop
    if n < 1: return np.array([20 * np.log10(np.abs(x).max() + 1e-9)])
    r = np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, 1)); return 20 * np.log10(r + 1e-9)
def phone_fix(x):
    """every one-shot must read through a phone speaker: if < 40 % of its energy sits in 400 Hz–6 kHz, add the sub's
    2nd/3rd harmonics in that band and (for transients) a 2–6 kHz click on the peak."""
    if len(x) < 512: return x
    et = float(np.sum(x ** 2)) or 1.; eb = float(np.sum(bp(x, 400, 6000) ** 2))
    if eb / et >= .4: return x
    low = lp(x, 300); m = np.abs(low).max() or 1
    harm = bp(np.tanh(low / m * 5), 400, 4000); eh = float(np.sum(harm ** 2)) or 1
    g = min(3., math.sqrt(max(0., .45 * et - eb) / (.55 * eh))); y = x + harm * g
    e = env_db(x); pk = int(np.argmax(e)) * 441
    if pk < .4 * len(x) and len(x) < 3 * SR:
        n = int(SR * .006); click = hp(rng.uniform(-1, 1, n), 2000) * np.exp(-np.arange(n) / (SR * .0015))
        i = max(0, pk - int(SR * .002)); j = min(len(y), i + n); y[i:j] += click[:j - i] * .3 * np.abs(y).max()
    return y / (np.abs(y).max() or 1)

_CACHE = {}
def render_raw(name, var=0, opts=None):
    """mono, peak-normalised (beds RMS-levelled) + meta {peak, dur, loop, base, active, real, kind}."""
    opts = dict(opts or {}); key = (name, var, tuple(sorted((k, str(v)) for k, v in opts.items())))
    if key in _CACHE: return _CACHE[key]
    kind, real = resolve(name); st = float(opts.pop('st', 0) or 0)
    if kind == 'pro':
        try: x = P.get(real, var, **opts)
        except TypeError: x = P.get(real, var)
        loop = bool(P.REG[real]['loop']); base = PRO_GAIN[real]
    elif kind == 'lib': x = LIB[real](**opts) if real in LIB else slide_whistle(up=False); loop = real in BED_LEGACY; base = .45
    elif kind == 'eng': x = E.get(real); loop = False; base = .45
    else: raise KeyError(f'unknown sound: {name}')
    x = np.asarray(x, dtype=np.float64)
    if x.ndim > 1: x = x.mean(axis=1 if x.shape[1] <= 2 else 0)
    x = x / (np.abs(x).max() or 1)
    if st: x = pitch_shift(x, st)
    if loop: rms = np.sqrt(np.mean(x ** 2)) or 1; x = x * min(1., .12 / rms)
    else: x = phone_fix(x)
    e = env_db(x); pk = int(np.argmax(e)); above = np.where(e > e[pk] - 20)[0]
    meta = dict(peak=(pk * 441 + 220) / SR, dur=len(x) / SR, loop=loop, base=base, active=((above[-1] + 1) * 441) / SR if len(above) else len(x) / SR, real=real, kind=kind)
    _CACHE[key] = (x, meta); return x, meta

# ================================================================ 1. events
class Ev:
    __slots__ = ('t', 'kind', 'scene', 'a', 'src')
    def __init__(s, t, kind, scene, a=None, src='renderer'): s.t, s.kind, s.scene, s.a, s.src = float(t), kind, int(scene), dict(a or {}), src
class Snd:
    __slots__ = ('name', 'start', 'peak_t', 'dur', 'lin', 'pan', 'bus', 'prio', 'tier', 'family', 'depth', 'sync', 'group', 'opts', 'var', 'ev', 'active', 'real', 'loop', 'scene', 'src')
    def __init__(s, **k):
        for a in Snd.__slots__: setattr(s, a, k.get(a))
FAMILY = lambda real: 'hit' if real.split('_')[0] in ('impact', 'hit') else real.split('_')[0]
T1_NAMES = {'impact_cinematic', 'impact_big', 'hit_slam', 'hit_boom', 'hit_braam', 'trans_stinger'}
COMEDY = {'cartoon_slide_up', 'cartoon_slide_down', 'cartoon_sad_trombone', 'trans_record_scratch', 'cartoon_boing', 'cartoon_honk', 'cartoon_slide_wobble', 'trans_tape_stop'}
TEXTURE = ('foley', 'food', 'nature', 'crowd', 'vn', 'battle', 'vehicle')

ROOMS = {'metropole_bar', 'giang_kitchen', 'cafe_giang', 'homestay', 'studio'}
def parse_story(path):
    """beats in order: (type, opts) — opts parsed from `# type k=v k="v w"` lines; header `score:` line."""
    beats, score, raw = [], None, False
    for ln in open(path, encoding='utf-8'):
        if raw:
            if re.match(r'#\s*endraw', ln): raw = False
            continue
        if ln.startswith('score:'): score = ln.split(':', 1)[1].strip()
        m = re.match(r'#\s*(\w+)(.*)', ln)
        if m and not ln.startswith('#!'):
            o = {k: (v1 if v1 else (v2 if v2 else v3)) for k, v1, v2, v3 in re.findall(r'(\w+)=(?:"([^"]*)"|\'([^\']*)\'|(\S+))', m.group(2))}
            beats.append((m.group(1).lower(), o)); raw = m.group(1).lower() == 'raw'
    if not beats or beats[-1][0] != 'end': beats.append(('end', {}))
    return beats, score

def Ly(name, off=0., db=0., pan=0., prio=3, tier=None, bus=None, align='peak', depth='near', sync=False, group=None, opts=None, lin=None):
    return dict(name=name, off=off, db=db, pan=pan, prio=prio, tier=tier, bus=bus, align=align, depth=depth, sync=sync, group=group, opts=opts or {}, lin=lin)
def whoosh_for(d): return 'whoosh_small' if d < .35 else ('whoosh_med' if d <= .7 else 'whoosh_big')

# ---------------------------------------------------------------- RULES: renderer events (anchor = event t)
def R_trans(e, ctx):
    k = e.kind.split('.', 1)[1]; d = float(e.a.get('dur') or .5); street = ctx['scenes'][e.scene].get('_bed') in ('amb_city_traffic',)
    T = {
        'cut': [],
        'whip': [Ly(whoosh_for(d), 0, 0, ('MOVE', -.6, .6), 2), Ly('whoosh_air', -.04, -10, 0, 4), Ly('impact_soft', d / 2, -12, 0, 4)],
        'whipUp': [Ly('whoosh_up', 0, 0, 0, 2), Ly('whoosh_air', -.04, -10, 0, 4)],
        'circles': [Ly('ui_pop', -d / 2 + i * d / 5, -6, [-.5, .3, -.2, .5, 0][i], 3, group='circ', opts={'st': 2 * i}) for i in range(5)] + [Ly('whoosh_small', 0, -8, 0, 4)],
        'stripes': [Ly('whoosh_small', o, -3, p, 2, group='stripes') for o, p in ((-.07, -.6), (0, 0), (.07, .6))],
        'iris': [Ly('whoosh_down', -d / 4, -2, 0, 2), Ly('ui_pop', 0, -8, 0, 3), Ly('whoosh_up', d / 4, -6, 0, 3)],
        'ink': [Ly('whoosh_down', 0, 0, 0, 2), Ly('impact_squelch', -.05, -12, 0, 4)],
        'inkbleed': [Ly(whoosh_for(d), 0, -2, 0, 2), Ly('riser_reverse_cymbal', 0, -14, 0, 4, align='end')],
        'burn': [Ly('whoosh_fire', 0, 0, 0, 2), Ly('foley_paper', -d / 2, -12, 0, 4, align='start')],
        'lightleak': [Ly('magic_shimmer', 0, -6, 0, 2, opts={'dur': 1.2}), Ly('whoosh_reverse', 0, -10, 0, 3, align='end')],
        'fgwipe': [Ly('vehicle_moto_pass' if street else 'whoosh_by', 0, -2, ('MOVE', .7, -.7), 2)],
        'tear': [Ly('foley_paper_cut', 0, 0, 0, 2), Ly('whoosh_small', .05, -8, 0, 4)],
        'paper': [Ly('trans_page_turn', 0, -2, 0, 3)],
        'slide': [Ly('trans_slide', 0, -2, ('MOVE', .5, -.2), 3), Ly('impact_wood_light', d / 2, -14, 0, 4)],
        'push': [Ly('trans_slide', 0, -2, ('MOVE', .5, -.2), 3), Ly('impact_wood_light', d / 2, -14, 0, 4)],
        'zoom': [Ly('trans_zoom_in', 0, 0, 0, 2), Ly('impact_soft', .1, -10, 0, 4)],
        'flash': [Ly('hit_snap', 0, 0, 0, 1), Ly('impact_hit', 0, -6, 0, 2), Ly('riser_reverse_cymbal', 0, -14, 0, 4, align='end')],
        'fade': [], 'portal': [Ly('magic_spell', 0, 0, 0, 2), Ly('riser_short', 0, -10, 0, 4, align='end')],
        'glitch': [Ly('trans_glitch_cut', 0, 0, 0, 2)], 'watercolor': [Ly('nature_drip', 0, -6, 0, 3), Ly('magic_twinkle', .1, -12, 0, 4)],
        'brand': [Ly('whoosh_med', -.1, -2, 0, 1), Ly('magic_chime_up', .15, 0, 0, 1), Ly('hit_sub_drop', .15, -14, 0, 3)]}
    return T.get(k, [Ly(whoosh_for(d), 0, -2, 0, 2)])

UI_RULES = {
    'price': [Ly('impact_soft', .1, 0, 'X', 2, sync=True), Ly('ui_glass', .14, -4, 'X', 2), Ly('foley_coins', .6, -6, 'X', 3)],
    'stamp': [Ly('impact_thump', 0, 0, 'X', 2, sync=True), Ly('impact_soft', 0, -10, 'X', 4)],
    'stat': [Ly('trans_slide', 0, -4, 'X', 3), Ly('ui_click_soft', .12, -8, 'X', 4)],
    'bubble': [Ly('ui_pop', .08, -4, 'X', 3)],
    'banner': [Ly('whoosh_cloth', 0, -2, 0, 3), Ly('ui_pop', .25, -8, 0, 4)],
    'title': [Ly('impact_hit', .12, -2, 0, 2), Ly('hit_snap', .12, -6, 0, 3)],
    'checklist': [Ly('whoosh_small', 0, -8, 'X', 4)],
    'punch': [Ly('hit_comic', .05, 0, 'X', 2), Ly('impact_body', .05, -8, 'X', 3)],
    'cta': [Ly('magic_chime_up', .1, -4, 0, 2)],
    'lower': [Ly('trans_slide', 0, -6, ('MOVE', -.5, -.2), 3), Ly('ui_tick', .14, -10, 0, 4)],
    'arrow': [Ly('foley_marker', 0, -6, 'X', 3, align='start', opts={'dur': .7}), Ly('ui_pop', .7, -10, 'X', 4)],
    'counter': [Ly('ui_counter', 0, -4, 'X', 2, align='start', opts={'dur': 1.4})],
    'chapter': [Ly('trans_stinger', .1, 0, 0, 1), Ly('foley_page_turn', .35, -12, 0, 4)],
    'choir': [Ly('magic_shimmer', 0, -8, 0, 3, opts={'dur': 1.6})],
    'endFrame': [], 'logo': [],
}
def R_ui(e, ctx):
    k = e.kind.split('.', 1)[1]
    if k == 'checklist.item':
        if e.a.get('no'): return [Ly('ui_error', 0, 0, 'X', 2), Ly('impact_soft', .03, -12, 'X', 4)]
        return [Ly('ui_pluck', 0, 0, 'X', 2, opts={'st': min(6, int(e.a.get('i', 0)))}), Ly('foley_pencil', -.03, -14, 'X', 4)]
    if k == 'out': return [Ly('whoosh_tiny', .05, -12, 'X', 4)]
    out = list(UI_RULES.get(k, [Ly('ui_pop', .12, -4, 'X', 3)]))
    if k == 'price' and e.a.get('checked'): out.append(Ly('impact_thump', .5, -4, 'X', 2, sync=True))
    return out

EXPR = {'shocked': [Ly('hit_snap', 0, -3, 'X', 2), Ly('cartoon_slide_quick', .02, -12, 'X', 4)], 'scared': [Ly('cartoon_squeak', 0, -8, 'X', 3), Ly('hit_snap', 0, -6, 'X', 3)],
        'joy': [Ly('magic_twinkle', .05, -12, 'X', 4)], 'happy': [Ly('magic_twinkle', .05, -14, 'X', 4)], 'grin': [Ly('magic_twinkle', .05, -14, 'X', 4)],
        'starstruck': [Ly('magic_twinkle', 0, -6, 'X', 3), Ly('magic_harp_gliss', .05, -16, 'X', 4)], 'sad': [Ly('cartoon_slide_down', 0, -12, 'X', 3)],
        'hot': [Ly('food_wok_sizzle', 0, -10, 'X', 3, opts={'dur': .8}), Ly('cartoon_honk', .1, -12, 'X', 4)], 'angry': [Ly('cartoon_stretch', 0, -10, 'X', 3)],
        'thinking': [Ly('cartoon_tiptoe', 0, -14, 'X', 4, opts={'n': 2})], 'yummy': [Ly('food_slurp', 0, -6, 'X', 3)], 'dizzy': [Ly('cartoon_dizzy', 0, -12, 'X', 4)],
        'tipsy': [Ly('cartoon_slide_wobble', 0, -14, 'X', 4)], 'smug': [Ly('magic_twinkle', 0, -12, 'X', 4)], 'cool': [Ly('magic_twinkle', 0, -12, 'X', 4)],
        'determined': [Ly('hit_snap', 0, -12, 'X', 4)]}
POSE = {'point': [Ly('whoosh_tiny', 0, -12, 'X', 4), Ly('foley_cloth', 0, -16, 'X', 5)], 'present': [Ly('whoosh_tiny', 0, -14, 'X', 4)],
        'cheer': [Ly('whoosh_swish', 0, -10, 'X', 3), Ly('magic_twinkle', .05, -14, 'X', 4)], 'thumbs': [Ly('whoosh_swish', 0, -12, 'X', 4)],
        'wave': [Ly('whoosh_swish', 0, -14, 'X', 4)], 'photo': [Ly('foley_camera', .3, -4, 'X', 3)], 'eat': [Ly('food_crunch', .2, -10, 'X', 4)],
        'scared': [Ly('foley_cloth', 0, -12, 'X', 4)], 'toast': [], 'walk': [], 'run': [], 'ride': [], 'sitHold': [], 'hold': []}
def surface_for(sc):
    p = sc.get('place') or ''
    if p in ROOMS: return 'wood'
    if p in ('hagiang', 'sapa', 'village', 'dalat', 'muine'): return 'dirt'
    return 'concrete'
def R_char(e, ctx):
    k = e.kind.split('.', 1)[1]; a = e.a; sc = ctx['scenes'][e.scene]
    if k == 'enter':
        d = float(a.get('dur') or .35); ty = a.get('type')
        if ty == 'drop': return [Ly('cartoon_fall_whistle', d, -12, 'X', 3, align='end'), Ly('impact_soft_heavy', d, 0, 'X', 2, sync=True), Ly('cartoon_poof', d + .03, -12, 'X', 4), Ly('cartoon_boing', d + .08, -18, 'X', 5)]
        if ty == 'pop': return [Ly('cartoon_pop', .12, -2, 'X', 3)]
        if ty in ('slideL', 'slideR'): return [Ly('whoosh_small', d - .05, -4, ('MOVE', -.7 if ty == 'slideL' else .7, 'X'), 3), Ly('whoosh_swish', d, -12, 'X', 4)]
        if ty == 'up': return [Ly('whoosh_up', d, -8, 'X', 3)]
        if ty == 'zoom': return [Ly('trans_zoom_in', d, -6, 'X', 3)]
        if ty == 'slap': return [Ly('impact_squelch', d, -2, 'X', 3)]
        return []
    if k == 'exit': return [Ly('cartoon_zip', 0, -6, 'X', 3)]
    if k == 'expr': return list(EXPR.get(a.get('val'), []))
    if k == 'pose': return list(POSE.get(a.get('val'), [Ly('foley_cloth', 0, -16, 'X', 5)]))
    if k == 'ride': return [Ly('vehicle_moto_idle', 0, -14, 'X', 4, bus='BG', align='start', opts={'dur': float(a.get('dur') or 4)})]
    if k == 'move':
        if a.get('ride'): return []
        dur = max(.3, float(a['t1']) - e.t); dist = abs(float(a['x1']) - float(a['x0'])); run = dist / dur > .6
        rate = 3.6 if run else 1.9; n = max(2, int(dur * rate)); p0, p1 = [max(-.8, min(.8, (float(v) - .5) * 1.6)) for v in (a['x0'], a['x1'])]
        return [Ly('foley_steps', .12, -8, ('MOVE', p0, p1), 4, align='start', opts={'n': n, 'gap': round(1 / rate, 3), 'surface': surface_for(sc)})]
    return []

def R_cam(e, ctx):
    k = e.kind.split('.', 1)[1]; a = e.a; t1 = float(a.get('t1', e.t)) - e.t; bt = ctx['scenes'][e.scene].get('_beat')
    if k == 'shake':
        amp = float(a.get('amp') or 0)
        if amp >= 18 and bt in ('title', 'hook', 'countdown'):
            return [Ly('hit_slam', 0, 0, 0, 1, sync=True), Ly('hit_sub_drop', 0, -8, 0, 3), Ly('riser_reverse_cymbal', 0, -14, 0, 4, align='end')]
        nm = 'impact_big' if amp >= 18 else 'impact_hit' if amp >= 14 else 'impact_thump' if amp >= 8 else 'impact_soft'
        return [Ly(nm, 0, 0 if amp >= 14 else -4 if amp >= 8 else -8, 0, 2 if amp >= 14 else 3, sync=True)]
    if k == 'crashZoom': return [Ly('whoosh_up', t1, 0, 0, 2), Ly('hit_snap', t1, -4, 0, 2)]
    if k == 'dutch': return [Ly('hit_snap', t1, -12, 0, 4)]
    if k in ('crane', 'tiltUp'): return [Ly('whoosh_big', 0, -12, 0, 3, align='start')] if t1 < 6 else []
    if k == 'craneDown': return [Ly('whoosh_down', 0, -12, 0, 3, align='start')] if t1 < 6 else []
    if k in ('whip', 'snap'): return [Ly('whoosh_small', t1, -2, ('MOVE', -.5, .5), 2)]
    if k in ('orbit', 'arc'): return [Ly('whoosh_twirl', 0, -14, ('MOVE', -.5, .5), 4, align='start')]
    if k == 'vertigo': return [Ly('riser_tone', t1, -12, 0, 3, align='end')]
    if k == 'bounce': return [Ly('cartoon_boing', 0, -18, 0, 5)]
    if k == 'reveal': return [Ly('whoosh_down', 0, -6, 0, 2, align='start'), Ly('magic_shimmer', t1, -12, 0, 4, opts={'dur': 1.2})]
    if k == 'pullOut': return [Ly('trans_zoom_out', 0, -12, 0, 4, align='start')]
    return []   # pushIn drift handheld breathe follow dolly panL: no sound (sub-perceptual moves)

ART = {   # typekit looks (anchor = artAt)
    'slam': [Ly('hit_slam', 0, 0, 0, 1, sync=True), Ly('hit_sub_drop', 0, -8, 0, 3), Ly('riser_reverse_cymbal', 0, -14, 0, 4, align='end'), Ly('glitch_short', .04, -18, 0, 5)],
    'count': [Ly('ui_counter', 0, -4, 0, 2, align='start', opts={'dur': 1.2}), Ly('ui_confirm', 1.25, -2, 0, 2), Ly('hit_snap', 1.25, -6, 0, 3)],
    'stamp': [Ly('impact_thump', 0, 0, 0, 1, sync=True), Ly('impact_soft', 0, -10, 0, 4)],
    'typeon': [Ly('ui_typing', 0, -4, 0, 3, align='start', opts={'dur': 1.4}), Ly('ui_bong', 1.5, -10, 0, 4)],
    'mask': [Ly('riser_noise', 0, -8, 0, 3, align='end', opts={'dur': 1.6}), Ly('impact_cinematic', 0, 0, 0, 1, sync=True), Ly('magic_shimmer', .2, -16, 0, 5, opts={'dur': 1.2})],
    'gold': [Ly('magic_shimmer', 0, -4, 0, 2, opts={'dur': 1.4}), Ly('hit_braam', 0, -8, 0, 1), Ly('magic_gem', .5, -12, 0, 4)],
    'neon': [Ly('glitch_zap', 0, -6, 0, 3), Ly('magic_force_field', .1, -22, 0, 5, align='start', opts={'dur': 1.5})],
    'comic': [Ly('hit_comic', 0, 0, 0, 2), Ly('cartoon_pop', 0, -8, 0, 4)],
    'hand': [Ly('foley_pen_write', 0, -4, 0, 3, align='start', opts={'dur': 1.0}), Ly('foley_marker', 1.0, -10, 0, 4, align='start', opts={'dur': .4})],
    'split': [Ly('whoosh_slash', 0, -2, -.6, 2, group='split'), Ly('whoosh_slash', 0, -2, .6, 2, group='split'), Ly('impact_metal_hit', .12, 0, 0, 1, sync=True)],
    'sign': [Ly('impact_metal_hit', 0, 0, 0, 2), Ly('foley_chain', .05, -16, 0, 5)]}
ART_DIP = {'slam', 'mask', 'stamp', 'split', 'gold'}
def art_layers(fx, text):
    if fx == 'stack':
        words = [w for w in str(text).split('|')[0].split() if w][:6]; n = max(1, len(words))
        return [Ly('impact_body' if k < n - 1 else 'impact_hit', k * .11, -4 if k < n - 1 else -2, 0, 2, group='stack', opts={'st': min(k, 4)}) for k in range(n)], (n - 1) * .11
    return list(ART.get(fx, ART['slam'])), 0.

# ---------------------------------------------------------------- places: beds + sweetener palette
KIND_BED = {'city': 'amb_city_traffic', 'town': 'amb_traffic_far', 'market': 'amb_market', 'country': 'amb_countryside', 'mountain': 'amb_bamboo_wind',
            'night': 'amb_night_village', 'water': 'amb_river', 'sea': 'amb_waves', 'cave': 'amb_cave', 'rain': 'amb_rain_tin_roof', 'room': 'amb_room_tone'}
PLACE_BED = {'metropole_bar': 'amb_fan_room', 'giang_kitchen': 'amb_kitchen', 'cafe_giang': 'amb_cafe', 'homestay': 'amb_night_village', 'studio': 'amb_room_tone',
             'oldquarter': 'amb_city_traffic', 'sidewalk': 'amb_city_traffic', 'hanoi': 'amb_city_traffic', 'saigon': 'amb_city_traffic'}
PALETTE = {   # bed → [(sound, rate/s, dB, opts)]   off-screen texture (P5, BG, far)
    'amb_city_traffic': [('vehicle_moto_horn', .12, -12, {}), ('vehicle_moto_pass', .12, -10, {}), ('vn_vendor_call', 1 / 25, -14, {}), ('vehicle_bike_bell', 1 / 18, -12, {})],
    'amb_traffic_far': [('vehicle_moto_pass', .08, -12, {}), ('vehicle_bike_bell', 1 / 15, -12, {}), ('nature_bird_chirp', 1 / 10, -14, {})],
    'amb_market': [('vn_vendor_call', 1 / 8, -10, {}), ('food_wok_sizzle', 1 / 10, -12, {'dur': .9}), ('foley_coins', 1 / 12, -12, {}), ('crowd_laugh', 1 / 16, -14, {})],
    'amb_cafe': [('food_spoon_stir', 1 / 3, -10, {}), ('food_cup_clink', 1 / 6, -10, {}), ('food_ice_clink', 1 / 10, -12, {})],
    'amb_kitchen': [('food_chop', 1 / 5, -10, {}), ('food_wok_toss', 1 / 12, -12, {})],
    'amb_fan_room': [('food_cup_clink', 1 / 6, -12, {}), ('impact_glass_light', 1 / 10, -14, {})],
    'amb_bamboo_wind': [('nature_buffalo', 1 / 14, -12, {}), ('nature_bird_chirp', 1 / 6, -14, {}), ('vehicle_moto_pass', 1 / 16, -14, {})],
    'amb_countryside': [('nature_bird_song', 1 / 8, -12, {}), ('nature_rooster', 1 / 40, -14, {})],
    'amb_night_village': [('nature_gecko', 1 / 15, -12, {}), ('nature_dog_far', 1 / 25, -16, {})],
    'amb_river': [('nature_splash_small', 1 / 8, -12, {}), ('vehicle_boat_engine', 1 / 30, -16, {'dur': 3})],
    'amb_waves': [('nature_wave_crash', 1 / 7, -10, {})], 'amb_cave': [('nature_drip', 1 / 2, -10, {})],
    'amb_temple': [('vn_temple_bell', 1 / 12, -10, {}), ('vn_mo', 1 / 20, -12, {})], 'amb_room_tone': []}
DEFAULT_PAL = [('foley_paper', 1, -16, {}), ('ui_tick', 1, -18, {}), ('whoosh_tiny', 1, -16, {}), ('foley_pencil', 1, -16, {}), ('ui_data_blip', 1, -20, {}), ('foley_page_turn', 1, -18, {})]   # scenes with no place: paper/desk texture
CUE_ROTATE = {'whoosh': ['whoosh_med', 'whoosh_swish', 'whoosh_small'], 'pop': ['ui_pop', 'cartoon_pop', 'trans_pop_in'], 'slide': ['trans_slide', 'ui_swoosh'],
              'tick': ['ui_tick', 'ui_click_soft'], 'moto_pass': ['vehicle_moto_pass', 'whoosh_by'], 'impact': ['impact_hit', 'impact_thump']}
REVERB_FOR = {'amb_fan_room': 'S', 'amb_kitchen': 'S', 'amb_cafe': 'S', 'amb_room_tone': 'S', 'amb_night_village': 'S', 'amb_city_traffic': 'M', 'amb_traffic_far': 'M',
              'amb_market': 'M', 'amb_bamboo_wind': 'L', 'amb_countryside': 'L', 'amb_temple': 'L', 'amb_cave': 'L', 'amb_river': 'M', 'amb_waves': 'L'}
def bed_for(sc, bt, o):
    kind = o.get('kind') if bt == 'moment' else None
    if kind in ('street3d', 'shot_worm', 'shot_ots', 'shot_street', 'crossing'): return 'amb_city_traffic'
    if kind in ('shot_bird',): return 'amb_traffic_far'
    if kind in ('map3d', 'fleet3d', 'wow_fleet', 'wow_south', 'mapdive', 'sshape', 'shot_eyes', 'wow_morph'): return None
    if kind == 'wow_storm' or sc.get('weather') == 'rain': return 'amb_monsoon' if kind == 'wow_storm' else 'amb_rain_tin_roof'
    p = sc.get('place') or o.get('place') or ''
    if p in PLACE_BED: b = PLACE_BED[p]
    elif 'pagoda' in p or 'temple' in p or 'pagoda' in (sc.get('placeDesc') or ''): b = 'amb_temple'
    else:
        k = AMBM.kind_for(sc) if AMBM else None; b = KIND_BED.get(k) if k else None
    if b and sc.get('time') == 'night' and b in ('amb_countryside', 'amb_bamboo_wind'): b = 'amb_night_village'
    return b

# ---------------------------------------------------------------- RULES: story beats (anchor = scene start; offsets beat-local)
def num(o, k, d):
    v = o.get(k); return float(v) if v is not None and re.match(r'^-?[\d.]+$', str(v)) else d
def beat_rules(i, sc, bt, o, ctx):
    """returns (layers, dips, stingers, drop_cues): layers are Ly dicts with off relative to scene start."""
    d = sc['dur']; L, dips, sting, drop = [], [], [], set(); kind = o.get('kind', '') if bt == 'moment' else ''
    caps = [x for x in ctx['subs'] if sc['start'] <= x['t0'] < sc['start'] + d]; r = np.random.default_rng(1000 + i)
    cues = [c for c in ctx['cues'] if c.get('scene') == sc['id'] and not c.get('auto')]
    cue_t = lambda nm: next((c['t'] - sc['start'] for c in cues if c['sfx'] == nm), None)
    # art-directed lettering (typekit)
    if o.get('art'):
        fx = o.get('artfx', 'slam'); at = num(o, 'artAt', .3); lay, last = art_layers(fx, o['art'])
        for l in lay: l['off'] += at; L.append(l)
        if fx in ART_DIP or fx == 'stack': dips.append((sc['start'] + at + last, 'hard'))
    if o.get('drop'): dips.append((sc['start'] + num(o, 'drop', 0), 'hard'))
    if bt == 'quiz' and caps:
        rv = caps[-1]['t0'] - sc['start']
        L += [Ly('hit_heartbeat', max(.2, rv - 3.2), -6, 0, 3, align='start', opts={'n': 3, 'gap': .75}), Ly('riser_tension', rv, -10, 0, 3, align='end', opts={'dur': 1.8}),
              Ly('ui_confirm', rv, 0, 0, 1), Ly('crowd_ooh', rv + .1, -6, 0, 3), Ly('crowd_applause', rv + .25, -10, 0, 4, align='start', opts={'dur': 1.4})]
        sting.append((sc['start'] + rv, 'win'))
    if bt == 'myth':
        tb = cue_t('stamp')
        if tb is None and len(caps) > 1: tb = caps[1]['t0'] - sc['start'] - 1.0
        if tb is not None: L.append(Ly('trans_record_scratch', tb - .02, -2, 0, 2)); dips.append((sc['start'] + tb, 'cut')); sting.append((sc['start'] + tb + .35, 'fail'))
    if bt == 'title' and o.get('variant') in (None, 'slam'): drop.add('impact')          # the slam lands on the shake (.38), not at 0
    if bt == 'title' and o.get('variant') in ('film', 'place'):
        L += [Ly('riser_noise', .05, -8, 0, 3, align='end', opts={'dur': 1.6}), Ly('impact_cinematic', .05, 0, 0, 1, sync=True), Ly('magic_shimmer', .25, -14, 0, 5, opts={'dur': 1.5})]
        dips.append((sc['start'] + .05, 'hard')); sting.append((sc['start'] + .05, 'reveal')); drop |= {'whoosh_down'}
    if kind == 'mapdive': L += [Ly('trans_tape_rewind', -.3, -6, 0, 3, align='start'), Ly('trans_map_dive', 0, -4, 0, 2, align='start')]; drop |= {'map_whoosh'}
    if kind == 'steam': L += [Ly('food_pour_tea', .6, -4, 0, 3, align='start', opts={'dur': 1.3}), Ly('whoosh_air', 2.0, -14, .2, 4), Ly('food_spoon_stir', d - 1.2, -6, .2, 3)]
    if bt == 'gag':
        sh = next((c for c in ctx['events'] if c.scene == i and c.kind == 'cam.shake'), None)
        th = (sh.t - sc['start'] - .05) if sh else num(o, 'hit', min(1.8, d * .4)); react = o.get('react', 'shocked')
        tag = {'hot': Ly('food_wok_sizzle', th + .3, -10, 0, 4, opts={'dur': .8}), 'yummy': Ly('food_slurp', th + .5, -6, 0, 3)}.get(react, Ly('cartoon_boing', th + .3, -10, 0, 3))
        L += [Ly('hit_comic', th, 0, 0, 1, sync=True), tag]; dips.append((sc['start'] + th, 'soft')); sting.append((sc['start'] + th + .35, 'comedy_button'))
    if bt == 'reveal':
        L += [Ly('riser_noise', 2.2, -10, 0, 3, align='end', opts={'dur': 1.6}), Ly('hit_boom', 2.2, -4, 0, 1), Ly('magic_reveal', 2.2, -8, 0, 3)]
        dips.append((sc['start'] + 2.2, 'hard')); sting.append((sc['start'] + 2.2, 'reveal'))
    if bt == 'stat': L += [Ly('ui_counter', .2, -4, 0, 2, align='start', opts={'dur': 1.4}), Ly('ui_glass', 1.6, -2, 0, 2), Ly('hit_snap', 1.6, -6, 0, 3)]; drop |= {'tick', 'ding'}
    if bt == 'timelapse': L.append(Ly('clock', 0, -10, 0, 4, align='start', opts={'dur': max(.5, d - .2), 'accel': 4}))
    if bt == 'chapter': sting.append((sc['start'] + .1, 'chapter'))
    if bt == 'dialogue' and (o.get('place') or sc.get('place')) in ROOMS: L.append(Ly('food_bowl_set', .4, -8, .3, 4))
    if bt == 'social':
        for c in cues:
            if c['sfx'] == 'clink': L.append(Ly('crowd_laugh', c['t'] - sc['start'] + .3, -14, 0, 4))
        if o.get('cheer'): L.append(Ly('crowd_cheer', 1.3, -10, 0, 3))
    if bt == 'ride':
        L += [Ly('vehicle_moto_idle', 0, -12, -.1, 4, bus='BG', align='start', opts={'dur': d}), Ly('nature_wind_gust', 0, -14, 0, 5, align='start')]
        if o.get('stop') == 'yes': L.append(Ly('vehicle_skid', d * .45, -6, 0, 3))
        if o.get('sign'): L += [Ly('whoosh_med', d * .5, -6, ('MOVE', .7, .2), 3), Ly('impact_wood_light', d * .62, -10, .2, 4)]
    if bt == 'payoff':
        L += [Ly('riser_short', 2.5, -10, 0, 3, align='end'), Ly('magic_sparkle', 2.55, -8, 0, 3), Ly('crowd_applause', 2.7, -14, 0, 4, align='start', opts={'dur': 2.0})]
        sting.append((sc['start'] + 2.5, 'win'))
    # ---- flat-3D street
    if kind == 'street3d':
        n = num(o, 'traffic', 26); ev_ = o.get('ev') == 'yes'; cam = o.get('cam', '')
        drop |= {'moto_pass'}
        horn_rate = .008 * n * (.3 if ev_ else 1); pass_rate = .012 * n * (.5 if ev_ else 1); farcam = cam in ('crane', 'bird', 'high') or (o.get('path') and '20' in o.get('path', ''))
        t = .3 + r.exponential(1 / max(pass_rate, .05))
        while t < d - .3:
            far = farcam or r.random() < .7; p0 = float(r.choice([-.7, .7]))
            L.append(Ly('vehicle_moto_pass', t, -14 if far else -8, ('MOVE', p0, -p0), 5, depth='far' if far else 'mid', bus='BG')); t += r.exponential(1 / max(pass_rate, .05))
        t = .6 + r.exponential(1 / max(horn_rate, .05))
        while t < d - .3:
            far = farcam or r.random() < .8; L.append(Ly('vehicle_moto_horn', t, -12 if far else -6, float(r.uniform(-.8, .8)), 5, depth='far' if far else 'mid', bus='BG')); t += r.exponential(1 / max(horn_rate, .05))
        if o.get('time') == 'day' or ev_: L.append(Ly('nature_bird_song', 1.0, -16, -.4, 5, depth='far', bus='BG'))
        if 'near' in o:
            nt = num(o, 'near', 1)
            L += [Ly('vehicle_moto_pass', nt, 0, ('MOVE', .7, -.7), 1, tier=1, sync=True), Ly('vehicle_moto_horn', nt - .2, -4, .4, 2), Ly('whoosh_by', nt + .02, -4, ('MOVE', .6, -.6), 2),
                  Ly('hit_heartbeat', nt + .3, -10, 0, 4, align='start', opts={'n': 2, 'gap': .6})]
            dips.append((sc['start'] + nt, 'near'))
        if 'bus' in o:
            b = num(o, 'bus', .2); L += [Ly('vehicle_bus_horn', b + .6, 0, -.2, 2), Ly('vehicle_bus_brake', b + 1.8, -2, -.2, 3), Ly('hit_sub_drop', b + .6, -14, 0, 4)]
        if o.get('walk'):
            m = re.match(r'([\d.]+)-([\d.]+):(-?[\d.]+)>(-?[\d.]+)', o['walk'])
            if m:
                t0, t1, x0, x1 = map(float, m.groups()); mode = o.get('mode', 'steady'); pan = lambda x: max(-.6, min(.6, x / 4.6 * .6))
                if mode == 'run':
                    tr = t0 + (t1 - t0) / 1.6; L += [Ly('foley_steps', t0 + .05, -4, ('MOVE', pan(x0), pan(x1)), 3, align='start', opts={'n': max(2, int((tr - t0) * 3.6)), 'gap': .28, 'surface': 'concrete'}),
                                                    Ly('cartoon_gallop', t0, -12, 0, 4, align='start', opts={'dur': .5}), Ly('vehicle_moto_horn_long', t0 + .6, -4, .5, 3), Ly('vehicle_moto_horn', t0 + 1.2, -6, -.5, 3)]
                elif mode == 'stop':
                    tf = t0 + .45 * (t1 - t0); tr = t0 + .85 * (t1 - t0); xf = x0 + .45 * (x1 - x0)
                    L += [Ly('foley_steps', t0 + .1, -6, ('MOVE', pan(x0), pan(xf)), 3, align='start', opts={'n': max(2, int((tf - t0) * 1.7)), 'gap': .59, 'surface': 'concrete'}),
                          Ly('cartoon_squeak', tf, -8, pan(xf), 2), Ly('cartoon_gulp', tf + .15, -8, pan(xf), 3), Ly('vehicle_moto_horn_long', tf + .4, -2, .5, 2), Ly('vehicle_skid', tf + .45, -4, .5, 2),
                          Ly('foley_steps', tr, -6, ('MOVE', pan(xf), pan(x1)), 4, align='start', opts={'n': max(2, int((t1 - tr) * 1.7) + 1), 'gap': .59, 'surface': 'concrete'})]
                else:
                    L.append(Ly('foley_steps', t0 + .1, -6, ('MOVE', pan(x0), pan(x1)), 3, align='start', opts={'n': max(2, int((t1 - t0) * 1.7)), 'gap': .59, 'surface': 'concrete'}))
        if o.get('flow') == 'yes':
            t = .5
            while t < d - .5: p0 = float(r.uniform(-.5, .5)); L.append(Ly('whoosh_by', t, -12, ('MOVE', p0 + .3, p0 - .3), 5, depth='mid', bus='BG')); t += 1.25 + r.random() * .5
        if o.get('hand') == 'yes': L += [Ly('whoosh_swish', .6, -8, 0, 3), Ly('vehicle_moto_horn', 1.6, -6, .3, 3)]
        if 'done' in o: dn = num(o, 'done', 5); L += [Ly('crowd_applause', dn, -10, .3, 3, align='start', opts={'dur': 1.5}), Ly('cartoon_tada', dn + .1, -10, 0, 3)]
        if o.get('title'):
            ta = num(o, 'titleAt', .4); L += [Ly('hit_slam', ta, 0, 0, 1, sync=True), Ly('hit_sub_drop', ta, -8, 0, 3), Ly('riser_reverse_cymbal', ta, -14, 0, 4, align='end')]
            if '|' in o['title']: L.append(Ly('impact_body', ta + .35, -6, 0, 3))
            dips.append((sc['start'] + ta, 'hard'))
    if kind == 'shot_eyes': L.append(Ly('hit_heartbeat', .1, -4, 0, 2, align='start', opts={'n': max(2, int(d / .75)), 'gap': .75})); drop |= {'heartbeat'}
    if kind == 'shot_bird': L.append(Ly('nature_wind_gust', 0, -8, 0, 3, align='start')); drop |= {'whoosh'}
    if kind == 'shot_worm': L += [Ly('vehicle_moto_pass', .4, 0, ('MOVE', .6, -.6), 2), Ly('vehicle_moto_horn', 1.2, -4, .3, 3)]; drop |= {'moto_pass', 'scooter_horn'}
    if kind == 'shot_ots': drop |= {'heartbeat'}; L.append(Ly('hit_heartbeat', 0, -10, 0, 4, align='start', opts={'n': 3, 'gap': .8}))
    if kind in ('map3d', 'fleet3d', 'wow_fleet', 'wow_south'):
        L += [Ly('riser_noise', 0, -8, 0, 3, align='end', opts={'dur': 1.4}), Ly('hit_braam', 0, -4, 0, 1), Ly('whoosh_huge', .2, -8, 0, 3)]; dips.append((sc['start'], 'hard')); drop |= {'map_whoosh', 'whoosh'}
    if kind == 'wow_storm': L += [Ly('nature_thunder', .8, -2, -.2, 2), Ly('nature_rain_burst', 0, -6, 0, 3)]; drop |= {'thunder'}
    if kind == 'sshape': L.append(Ly('whoosh_big', .2, -6, 0, 3))
    return L, dips, sting, drop

# ================================================================ 2. collect + expand
def legacy_events(C):
    """old cue files (no `events`): auto transition cues re-anchored to the cut."""
    starts = [s['start'] for s in C['scenes']]; out = []
    for c in C['cues']:
        si = next((k for k, s in enumerate(C['scenes']) if s['id'] == c.get('scene')), 0); t = c['t']
        if c.get('auto') and si > 0 and 0 < starts[si] - t <= .5: t = starts[si]
        out.append(Ev(t, 'cue.' + c['sfx'], si, {'gain': c.get('gain', 1), 'auto': c.get('auto', 0)}, 'renderer'))
    return out
def collect(C, beats, D):
    scenes = C['scenes']; evs = []
    if C.get('events'):
        evs += [Ev(e['t'], e['ev'], e['scene'], e.get('a'), 'renderer') for e in C['events']]
        for c in C['cues']:
            if c.get('auto'): continue
            si = next((k for k, s in enumerate(scenes) if s['id'] == c.get('scene')), 0)
            evs.append(Ev(c['t'], 'cue.' + c['sfx'], si, {'gain': c.get('gain', 1)}, 'cue'))
    else: evs += legacy_events(C)
    for i, sc in enumerate(scenes):
        bt, o = beats[i] if i < len(beats) else ('end', {})
        for item in filter(None, (o.get('sfx') or '').split('|')):
            p = item.split(':')
            try: evs.append(Ev(sc['start'] + float(p[0]), 'explicit', i, {'name': p[1], 'gain': float(p[2]) if len(p) > 2 else .5, 'pan': float(p[3]) if len(p) > 3 else 0.}, 'explicit'))
            except (ValueError, IndexError): print('warn: bad sfx cue', item)
    for e in D.get('events', []):
        si, off, name, gain, pan = e[:5]; evs.append(Ev(scenes[si]['start'] + off, 'explicit', si, {'name': name, 'gain': gain, 'pan': pan, 'opts': e[5] if len(e) > 5 else {}}, 'explicit'))
    return sorted(evs, key=lambda e: e.t)

def pan_of(p, a):
    if p == 'X':
        x = a.get('x', .5); return max(-.8, min(.8, (float(x) - .5) * 1.6))
    if isinstance(p, tuple) and p[0] == 'MOVE': return ('MOVE', pan_of(p[1], a), pan_of(p[2], a))
    return float(p)
_LASTVAR = {}; _ROT = {}
def make_snd(l, t_anchor, scene, src, ev, k=0, a=None):
    name = l['name']; opts = dict(l['opts'])
    var = zlib.crc32(f'{name}|{t_anchor:.2f}|{scene}|{k}'.encode()) & 0xffff
    if _LASTVAR.get(name) == var: var = (var + 1) & 0xffff
    _LASTVAR[name] = var
    x, m = render_raw(name, var, opts)
    t = t_anchor + float(l['off'])
    start = t - m['peak'] if (l['align'] == 'peak' and not m['loop']) else (t - m['dur'] if l['align'] == 'end' else t)
    real = m['real']; fam = FAMILY(real)
    tier = l['tier'] or (4 if m['loop'] else 1 if (real in T1_NAMES and l['prio'] <= 2) else 3 if real.split('_')[0] in TEXTURE else 2)
    if l['tier'] is None and real.split('_')[0] in TEXTURE and l['prio'] <= 2 and l['sync']: tier = 2
    lin = l['lin'] if l['lin'] is not None else m['base'] * 10 ** (l['db'] / 20)
    bus = l['bus'] or ('AMB' if m['loop'] else 'BG' if (tier == 3 and l['prio'] >= 4) or l['depth'] in ('far', 'off') else 'FG')
    return Snd(name=name, start=start, peak_t=start + m['peak'], dur=m['dur'], lin=lin, pan=pan_of(l['pan'], a or {}), bus=bus, prio=l['prio'], tier=tier, family=fam,
               depth=l['depth'], sync=l['sync'], group=l['group'], opts=opts, var=var, ev=ev, active=m['active'], real=real, loop=m['loop'], scene=scene, src=src)

def expand(evs, C, beats, ctx, D):
    scenes = C['scenes']; out, dips, stings, unknown = [], list((t, 'hard') for t in D.get('dips', [])), [], []
    drops = {}; foley_off = set()
    for i, sc in enumerate(scenes):
        bt, o = beats[i] if i < len(beats) else ('end', {}); sc['_beat'] = bt; sc['_opts'] = o; sc['_bed'] = bed_for(sc, bt, o)
        if o.get('foley') == 'no': foley_off.add(i)
    auto = D.get('auto', True)
    for i, sc in enumerate(scenes):
        bt, o = sc['_beat'], sc['_opts']
        if not auto or i in foley_off: drops[i] = set(); continue
        lay, dp, st, dr = beat_rules(i, sc, bt, o, ctx); drops[i] = dr; dips += dp; stings += st
        for k, l in enumerate(lay):
            try: out.append(make_snd(l, sc['start'], i, 'beat', None, k))
            except KeyError: unknown.append(l['name'])
    for e in evs:
        fam = e.kind.split('.')[0]; L = []
        if e.kind == 'explicit':
            a = e.a; L = [Ly(a['name'], 0, 0, a.get('pan', 0), 2, sync=True, lin=float(a.get('gain', .5)), opts=a.get('opts') or {})]
            if a['name'] in ('city_bed', 'fan', 'simmer') or (a['name'].startswith('amb_')): L[0]['align'] = 'start'
        elif not auto or e.scene in foley_off: continue
        elif fam == 'cue':
            nm = e.kind[4:]
            if nm in drops.get(e.scene, ()): continue
            o = {'dur': scenes[e.scene]['dur']} if nm in ('engine_loop', 'city_bed', 'sizzle', 'wind', 'rain_burst') else {}
            al = 'start' if nm in ('engine_loop', 'city_bed', 'map_whoosh', 'pen_draw', 'sizzle', 'choir', 'pop_cascade', 'typing', 'tick_roll', 'wind', 'rain_burst', 'heartbeat') else 'peak'
            if nm in CUE_ROTATE: rot = CUE_ROTATE[nm]; _ROT[nm] = _ROT.get(nm, -1) + 1; nm2 = rot[_ROT[nm] % len(rot)]
            else: nm2 = nm
            kind, real = resolve(nm2); base = PRO_GAIN.get(real, .45)
            L = [Ly(nm2, 0, 0, 0, 2 if nm in ('impact', 'stamp', 'pin_drop', 'ding', 'thunder', 'firework', 'train_horn', 'choir') else 3, sync=True, align=al,
                    lin=base * min(1.2, float(e.a.get('gain', 1))), opts=o)]
        elif fam == 'trans': L = R_trans(e, ctx)
        elif fam == 'ui': L = R_ui(e, ctx)
        elif fam in ('char', 'prop', 'text', 'image'):
            if fam == 'char': L = R_char(e, ctx)
            elif e.kind.endswith('.enter'):
                d = float(e.a.get('dur') or .35); ty = e.a.get('type')
                L = [Ly('trans_pop_in' if ty == 'pop' else 'impact_wood_light' if ty == 'drop' else 'whoosh_up' if ty == 'zoom' else 'whoosh_small', d if ty != 'pop' else .12, -4 if ty != 'zoom' else -6, 'X', 3)]
                if fam == 'text' and ty == 'zoom': L.append(Ly('hit_snap', d, -8, 'X', 4))
        elif fam == 'cam': L = R_cam(e, ctx)
        elif fam == 'art': continue    # lettering comes from the story keys (needs the text for `stack`)
        for k, l in enumerate(L):
            try: out.append(make_snd(l, e.t, e.scene, e.src, e, k, e.a))
            except KeyError: unknown.append(l['name'])
    return out, dips, stings, drops, sorted(set(unknown))

# ---------------------------------------------------------------- beds (one continuous bed per run of scenes, J-cut .4 s, L-cut .6 s)
def bed_sounds(scenes, dur):
    runs = []
    for i, sc in enumerate(scenes):
        b = sc.get('_bed'); o = sc.get('_opts', {})
        if sc.get('_beat') == 'end' or not b: continue
        g = 0.
        if o.get('kind') == 'street3d':
            n = num(o, 'traffic', 26); g = -6 if n <= 8 else -3 if n <= 20 else 0
            if o.get('ev') == 'yes': g -= 6
            if o.get('cam') in ('crane', 'bird', 'high'): g -= 4
            if o.get('cam') == 'worm': g += 2
        if o.get('kind') == 'shot_bird': g -= 4
        if runs and runs[-1][0] == b and runs[-1][2] >= sc['start'] - .01: runs[-1][2] = sc['start'] + sc['dur']; runs[-1][3].append((sc['start'], g))
        else: runs.append([b, sc['start'], sc['start'] + sc['dur'], [(sc['start'], g)], i])
    out = []
    for b, t0, t1, gains, si in runs:
        s0 = max(0., t0 - (.4 if t0 > .01 else 0)); s1 = min(dur + .5, t1 + .6)
        try: x, m = render_raw(b, si, {'dur': round(s1 - s0, 2)})
        except KeyError: continue
        x = x.copy(); n = len(x); a = int(SR * (.4 if t0 > .01 else .005)); r_ = int(SR * .6)
        x[:a] *= np.linspace(0, 1, a); x[-r_:] *= np.linspace(1, 0, r_)
        gcurve = np.ones(n)
        for (ts, g) in gains: gcurve[max(0, int((ts - s0) * SR)):] = 10 ** (g / 20)
        gcurve = uniform_filter1d(gcurve, int(SR * .3))
        out.append(Snd(name=b, start=s0, peak_t=s0, dur=n / SR, lin=m['base'], pan=0., bus='AMB', prio=1, tier=4, family='amb', depth='near', sync=False, group=None,
                       opts={'_x': x * gcurve}, var=si, ev=None, active=n / SR, real=b, loop=True, scene=si, src='bed'))
    return out

def sweeteners(scenes, dur, foley_off):
    """off-screen texture from each scene's bed palette (P5, BG, far)."""
    out = []
    for i, sc in enumerate(scenes):
        if i in foley_off or sc.get('_opts', {}).get('kind') == 'street3d': continue
        pal = PALETTE.get(sc.get('_bed') or '', []); r = np.random.default_rng(500 + i)
        for nm, rate, db, op in pal:
            t = .4 + r.exponential(1 / rate)
            while t < sc['dur'] - .3:
                try: out.append(make_snd(Ly(nm, t, db, float(r.uniform(-.7, .7)), 5, depth='far', bus='BG', opts=op), sc['start'], i, 'sweet', None, int(t * 100)))
                except KeyError: pass
                t += r.exponential(1 / rate)
    return out

# ================================================================ 3. scheduler
LIMITS = {'vertical': dict(t1=4., gap=1.5, density={'hook': 10, 'body': 9, 'dialogue': 6, 'payoff': 11}, target={'hook': 14, 'body': 13, 'dialogue': 9, 'payoff': 15}),
          'youtube': dict(t1=6., gap=2.5, density={'hook': 8, 'body': 6, 'dialogue': 5, 'payoff': 9}, target={'hook': 11, 'body': 10, 'dialogue': 7, 'payoff': 13})}
class VAD:
    def __init__(s, vo, subs, n):
        s.hop = 441; nf = n // s.hop + 1; m = np.zeros(nf, bool)
        if vo is not None and np.abs(vo).max() > 1e-4:
            v = vo.mean(0); k = len(v) // s.hop; r = 20 * np.log10(np.sqrt(np.mean(v[:k * s.hop].reshape(k, s.hop) ** 2, 1)) + 1e-9)
            gate = max(-50., np.percentile(r[r > -80], 90) - 26 if np.any(r > -80) else -40); m[:k] = r > gate
        else:
            for x in subs: m[int(x['t0'] * 100):int(x['t1'] * 100)] = True
        m = maximum_filter1d(m.astype(np.uint8), 17, origin=-6).astype(bool)   # ~120 ms hangover + 40 ms look-ahead
        s.m = m
    def at(s, t): i = int(t * 100); return bool(s.m[i]) if 0 <= i < len(s.m) else False
    def gap_near(s, t, lo, hi):
        best = None
        for dt in sorted(np.arange(lo, hi + .001, .01), key=abs):
            if not s.at(t + dt): best = dt; break
        return best
def is_hit(s): return s.family == 'hit' and 'heartbeat' not in s.real
def schedule(cands, vad, fmt, flags):
    lim = LIMITS[fmt]; log = []
    beds = [s for s in cands if s.bus == 'AMB']; rest = sorted([s for s in cands if s.bus != 'AMB'], key=lambda s: s.peak_t)
    # 1. duplicates: same sound < .25 s; any two hits < .15 s; a shake-generated hit yields to a designed hit within .45 s
    shake = lambda s: s.ev is not None and s.ev.kind == 'cam.shake'
    keep = []
    for s in rest:
        dup = None
        for o in reversed(keep[-16:]):
            if o.group is not None and o.group == s.group: continue
            dt = abs(o.peak_t - s.peak_t)
            if (o.real == s.real and dt < .25) or (is_hit(o) and is_hit(s) and (dt < .15 or (dt < .45 and shake(o) != shake(s)))): dup = o; break
        if dup is None: keep.append(s); continue
        if shake(dup) != shake(s): win, lose = (s, dup) if shake(dup) else (dup, s)
        else: win, lose = (dup, s) if (dup.prio, dup.tier, -dup.lin) <= (s.prio, s.tier, -s.lin) else (s, dup)
        win.lin *= 1.12
        if lose is dup: keep[keep.index(dup)] = win
        log.append(('dup', lose.name, round(lose.peak_t, 2)))
    keep.sort(key=lambda s: (s.prio, s.tier, s.peak_t))
    acc = []; t1s = []; risers = []; comedy = []
    def active(s): return [a for a in acc if a.start <= s.peak_t <= a.start + a.active and a is not s]
    for s in keep:
        # 2. voice protection
        if s.bus == 'FG' and vad.at(s.peak_t):
            if not s.sync and s.tier <= 2:
                g = vad.gap_near(s.peak_t, -.15 if s.tier == 1 else -.10, .25 if s.tier == 1 else .15)
                if g is not None: s.start += g; s.peak_t += g
                else: s.lin *= 10 ** ((-6 if s.tier == 1 else -4) / 20); log.append(('masked', s.name, round(s.peak_t, 2)))
            elif s.tier == 1: s.lin *= 10 ** (-3 / 20); log.append(('hit_on_words', s.name, round(s.peak_t, 2)))
            if s.prio >= 3: s.lin *= 10 ** (-4 / 20)        # P3–P5 foreground tucks −4 dB under the voice
        # 3. spacing
        bad = False
        if s.tier == 1 and any(abs(s.peak_t - t) < lim['t1'] for t in t1s): bad = True
        if s.real.startswith('riser_') and any(abs(s.peak_t - t) < 10 for t in risers): bad = True
        if s.real in COMEDY and any(abs(s.peak_t - t) < 15 for t in comedy): bad = True
        if s.group is None and s.tier <= 2 and any(a.family == s.family and a.group is None and abs(a.peak_t - s.peak_t) < .12 for a in acc): bad = True
        if bad:
            if s.prio <= 2:
                s.lin *= 10 ** (-3 / 20)
                if s.tier == 1 and any(abs(s.peak_t - t) < lim['t1'] for t in t1s): s.tier = 2; log.append(('t1_demoted', s.name, round(s.peak_t, 2)))
            else: log.append(('spacing', s.name, round(s.peak_t, 2))); continue
        # 4. concurrency (foreground ≤ 3, same family ≤ 2; designed groups count once)
        if s.bus == 'FG':
            act = [a for a in active(s) if a.bus == 'FG']; grp = {}
            for a in act: grp[a.group or id(a)] = a
            act = list(grp.values())
            same = [a for a in act if a.family == s.family and (s.group is None or a.group != s.group)]
            if len([a for a in act if s.group is None or a.group != s.group]) >= 3 or len(same) >= 2:
                cand = (same if len(same) >= 2 else act) + [s]; victim = max(cand, key=lambda a: (a.prio, a.tier, -a.lin))
                if victim is s: log.append(('busy', s.name, round(s.peak_t, 2))); continue
                acc.remove(victim); log.append(('evicted', victim.name, round(victim.peak_t, 2)))
        acc.append(s)
        if s.tier == 1: t1s.append(s.peak_t)
        if s.real.startswith('riser_'): risers.append(s.peak_t)
        if s.real in COMEDY: comedy.append(s.peak_t)
    return beds + acc, log

def fill_gaps(acc, scenes, vad, fmt, flags, foley_off, dur):
    """gap filler + density floor from the place palette (P5 texture)."""
    lim = LIMITS[fmt]; add = []; r = np.random.default_rng(77)
    onsets = sorted(s.peak_t for s in acc if s.tier <= 3 and s.bus != 'AMB')
    def scene_at(t): return max([k for k, s in enumerate(scenes) if s['start'] <= t] or [0])
    def pick(t):
        k = scene_at(t); sc = scenes[k]
        if k in foley_off or sc.get('_beat') == 'end' or any(abs(t - f) < 1.0 for f in flags): return None
        pal = PALETTE.get(sc.get('_bed') or '', [])
        if sc.get('_opts', {}).get('kind') == 'street3d': pal = PALETTE['amb_city_traffic'] + [('nature_bird_chirp', 1, -16, {}), ('crowd_laugh', 1, -18, {})]
        if not pal: pal = DEFAULT_PAL
        nm, _, db, op = pal[int(r.integers(len(pal)))]
        try: return make_snd(Ly(nm, 0, db, float(r.uniform(-.6, .6)), 5, depth='far', bus='BG', opts=op), t, k, 'gapfill', None, int(t * 100))
        except KeyError: return None
    pts = [0.] + onsets + [dur]
    for a, b in zip(pts, pts[1:]):
        if b - a > lim['gap']:
            step = (b - a) / (int((b - a) / (lim['gap'] * .75)) + 1); t = a + step
            while t < b - step * .5:
                s = pick(t)
                if s: add.append(s)
                t += step
    # density floor per 10 s window (counts T1/T2 = 1, T3 = .5)
    allx = acc + add
    for w0 in np.arange(0, dur, 10.):
        w1 = min(dur, w0 + 10); sec = section_of((w0 + w1) / 2, scenes, dur)
        if sec in ('end',) or w1 - w0 < 4: continue
        need = lim['density'].get(sec, 6) * (w1 - w0) / 10
        have = sum(1 if s.tier <= 2 else .5 for s in allx if w0 <= s.peak_t < w1 and s.tier <= 3 and s.bus != 'AMB')
        k = 0
        while have < need and k < 8:
            t = float(r.uniform(w0 + .3, w1 - .3)); s = pick(t); k += 1
            if s: add.append(s); allx.append(s); have += .5
    return add

def section_of(t, scenes, dur):
    k = max([j for j, s in enumerate(scenes) if s['start'] <= t] or [0]); bt = scenes[k].get('_beat')
    if bt == 'end': return 'end'
    if t < 10: return 'hook'
    if bt in ('payoff',) or t > dur - max(8., dur * .12) and bt != 'end': return 'payoff'
    if bt in ('dialogue', 'talk'): return 'dialogue'
    return 'body'

# ================================================================ 4. DSP for the bus mixer
def biquad(kind, f, q=.707, gdb=0.):
    A = 10 ** (gdb / 40); w = 2 * np.pi * f / SR; c, s_ = np.cos(w), np.sin(w); al = s_ / (2 * q)
    if kind == 'peak': b = [1 + al * A, -2 * c, 1 - al * A]; a = [1 + al / A, -2 * c, 1 - al / A]
    elif kind == 'hshelf':
        sq = 2 * np.sqrt(A) * al; b = [A * ((A + 1) + (A - 1) * c + sq), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - sq)]
        a = [(A + 1) - (A - 1) * c + sq, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - sq]
    elif kind == 'lshelf':
        sq = 2 * np.sqrt(A) * al; b = [A * ((A + 1) - (A - 1) * c + sq), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - sq)]
        a = [(A + 1) + (A - 1) * c + sq, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - sq]
    b = np.array(b) / a[0]; a = np.array(a) / a[0]; return np.array([[b[0], b[1], b[2], 1., a[1], a[2]]])
def eq(x, chain):
    for f in chain: x = sosfilt(f, x, axis=-1)
    return np.asarray(x, np.float32)
HPF = lambda f, o=2: butter(o, f, btype='high', fs=SR, output='sos')
LPF = lambda f, o=2: butter(o, f, btype='low', fs=SR, output='sos')
def env_curve(mask, depth_db, att, hold, rel, n):
    """VAD mask (10 ms frames) → per-sample gain (linear) with attack / hold / release, smoothed in dB."""
    m = mask.astype(float)
    if hold > 0: m = maximum_filter1d(m, int(hold * 100) * 2 + 1, origin=-int(hold * 100))
    tgt = m * depth_db; g = np.zeros_like(tgt); ca = math.exp(-.01 / max(att, .001)); cr = math.exp(-.01 / max(rel, .001)); v = 0.
    for i in range(len(tgt)):
        c = ca if tgt[i] < v else cr; v = tgt[i] + (v - tgt[i]) * c; g[i] = v
    gs = np.interp(np.arange(n) / SR * 100, np.arange(len(g)), g); return 10 ** (gs / 20)
def dyn_band(x, gain_curve, lo, hi):
    """dynamic EQ: scale one band (zero-phase) by gain_curve (linear, per sample)."""
    band = sosfiltfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x, axis=-1); return x + band * (gain_curve[None, :] - 1)
def compress(x, thr_db, ratio, att, rel, knee=6., key=None, max_gr=24.):
    k = (x if key is None else key); mono = np.sqrt(np.mean(k ** 2, 0)) if k.ndim > 1 else np.abs(k)
    hop = 220; nb = len(mono) // hop + 1; pad = np.pad(mono, (0, nb * hop - len(mono)))
    lvl = 20 * np.log10(np.sqrt(np.mean(pad.reshape(nb, hop) ** 2, 1)) * 1.414 + 1e-9)
    over = lvl - thr_db; gr = np.where(over > knee / 2, over * (1 - 1 / ratio), np.where(over > -knee / 2, (over + knee / 2) ** 2 / (2 * knee) * (1 - 1 / ratio), 0.))
    gr = np.minimum(gr, max_gr); sm = np.zeros_like(gr); v = 0.; ca = math.exp(-hop / SR / att); cr = math.exp(-hop / SR / rel)
    for i in range(nb):
        c = ca if gr[i] > v else cr; v = gr[i] + (v - gr[i]) * c; sm[i] = v
    g = 10 ** (-np.interp(np.arange(x.shape[-1]) / hop, np.arange(nb), sm) / 20); return x * g, float(sm.max()) if len(sm) else 0.
def reverb_ir(rt, pre, seed):
    r = np.random.default_rng(seed); n = int(SR * rt * 1.2); t = np.arange(n) / SR; out = []
    for c in range(2):
        x = r.standard_normal(n) * np.exp(-6.9 * t / rt); x = sosfilt(LPF(6000), x); x = np.concatenate([np.zeros(int(pre * SR)), x]); out.append(x / np.sqrt(np.sum(x ** 2)))
    if rt > 1.5: e = np.zeros(int(SR * .25)); e[-1] = .2; out = [np.convolve(o, np.r_[1, e])[:len(o) + len(e)] for o in out]
    return out
DIST = {'near': (0., None, -20., 1.), 'mid': (-6., 9000, -12., .7), 'far': (-12., 3500, -6., .3), 'off': (-14., 5000, -8., .5)}

# ---------------------------------------------------------------- loudness (BS.1770-4) and true peak
def _kw():
    # pre-filter (high shelf, +4 dB @ 1682 Hz) and RLB high-pass (38 Hz), designed for SR (pyloudnorm coefficients method)
    f0, G, Q = 1681.974450955533, 3.999843853973347, .7071752369554196; K = np.tan(np.pi * f0 / SR); Vh = 10 ** (G / 20); Vb = Vh ** .4996667741545416
    a0 = 1 + K / Q + K * K; b = [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0]; a = [1, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]
    f1, Q1 = 38.13547087602444, .5003270373238773; K = np.tan(np.pi * f1 / SR); a1 = 1 + K / Q1 + K * K
    b2 = [1, -2, 1]; a2 = [1, 2 * (K * K - 1) / a1, (1 - K / Q1 + K * K) / a1]
    return np.array([[*b, *a], [*b2, *a2]])
KW = None
def kweight(x):
    global KW
    if KW is None: KW = _kw()
    return sosfilt(KW, x, axis=-1)
def block_ms(x, win=.4, hop=.1):
    y = kweight(np.atleast_2d(x)); w, h = int(SR * win), int(SR * hop); n = max(1, (y.shape[1] - w) // h + 1)
    cs = np.concatenate([np.zeros((y.shape[0], 1)), np.cumsum(y ** 2, 1)], 1)
    idx = np.arange(n) * h; ms = (cs[:, np.minimum(idx + w, y.shape[1])] - cs[:, idx]) / w; return ms.sum(0)
def lufs_blocks(x, win=.4, hop=.1): return -.691 + 10 * np.log10(block_ms(x, win, hop) + 1e-12)
def integrated(x):
    l = lufs_blocks(x); ms = 10 ** ((l + .691) / 10); g = l > -70
    if not g.any(): return -70.
    rel = -.691 + 10 * np.log10(ms[g].mean()) - 10; g &= l > rel; return float(-.691 + 10 * np.log10(ms[g].mean())) if g.any() else -70.
def lra(x):
    s = lufs_blocks(x, 3., .1); s = s[s > -70]
    if not len(s): return 0.
    rel = -.691 + 10 * np.log10(np.mean(10 ** ((s + .691) / 10))) - 20; s = s[s > rel]
    return float(np.percentile(s, 95) - np.percentile(s, 10)) if len(s) else 0.
def true_peak(x):
    m = 0.
    for c in np.atleast_2d(x):
        for i in range(0, len(c), SR * 20):
            a0 = max(0, i - 64); seg = c[a0:i + SR * 20 + 64]
            if not len(seg): continue
            up = np.abs(resample_poly(seg, 4, 1)); lo = (i - a0) * 4; hi = lo + min(SR * 20, len(c) - i) * 4   # drop the filter's edge ringing
            m = max(m, float(up[lo:hi].max()) if hi > lo else 0.)
    return 20 * np.log10(m + 1e-12)
def phone(x):
    y = np.atleast_2d(x).mean(0); return sosfilt(butter(4, 400, btype='high', fs=SR, output='sos'), sosfilt(LPF(12000), y))
def tp_limit(x, ceil_db, lookahead=.005, release=.05, want_gain=False):
    """4× oversampled true-peak limiter at 1 ms control rate (look-ahead hold, exponential release)."""
    blk = 44; n = x.shape[1]; nb = n // blk + 1; pk = np.zeros(nb)
    for c in x:
        for i in range(0, n, SR * 10):
            seg = c[max(0, i - 32):i + SR * 10 + 32]; up = np.abs(resample_poly(seg, 4, 1)); off = (i - max(0, i - 32)) * 4
            up = up[off:off + min(SR * 10, n - i) * 4]; m = len(up) // (blk * 4); b0 = i // blk
            if m: pk[b0:b0 + m] = np.maximum(pk[b0:b0 + m], up[:m * blk * 4].reshape(m, blk * 4).max(1))
            rem = up[m * blk * 4:]
            if len(rem) and b0 + m < nb: pk[b0 + m] = max(pk[b0 + m], rem.max())
    ceil = 10 ** (ceil_db / 20); r = np.maximum(0., 20 * np.log10(np.maximum(pk, 1e-9) / ceil)) + .0
    L = max(1, int(lookahead * 1000)); h = maximum_filter1d(r, 2 * L + 1, origin=-L) if L else r
    h = np.maximum(h, np.convolve(h, np.ones(L + 1) / (L + 1), 'same')); out = np.zeros(nb); v = 0.; cr = math.exp(-1e-3 / release)
    for i in range(nb): v = max(h[i], v * cr); out[i] = v
    out = np.maximum(out, np.r_[out[1:], 0]); out = np.maximum(out, np.r_[0, out[:-1]])
    g = 10 ** (-np.interp(np.arange(n), np.arange(nb) * blk + blk / 2, out) / 20)
    return (g, float(out.max())) if want_gain else (x * g[None, :], float(out.max()))

# ================================================================ music (music_pro.py if present, else music.py) + stingers
def music_engine(): return 'music_pro.py' if os.path.exists(os.path.join(HERE, 'music_pro.py')) else 'music.py'
def music_stem(base, mood, seed):
    eng = music_engine(); p = f'{base}_music_{mood}.wav'; side = p + '.json'; cj = base + '_cues.json'
    ok = os.path.exists(p) and os.path.exists(side) and os.path.getmtime(p) >= os.path.getmtime(cj)
    if ok:
        try: ok = json.load(open(side)).get('engine') == eng and json.load(open(side)).get('seed') == seed
        except Exception: ok = False
    if not ok:
        subprocess.check_call(['python3', os.path.join(HERE, eng), 'score', cj, p, '--mood', mood, '--seed', seed])
        json.dump({'engine': eng, 'seed': seed}, open(side, 'w'))
    return read(p)
def stinger_wav(base, kind, mood, seed):
    if music_engine() != 'music_pro.py': return None
    p = f'{base}_sting_{kind}_{mood}.wav'
    if not os.path.exists(p):
        try: subprocess.check_call(['python3', os.path.join(HERE, 'music_pro.py'), 'stinger', kind, p, '--mood', mood, '--seed', seed], stdout=subprocess.DEVNULL)
        except Exception as e: print('warn: stinger', kind, 'failed:', e); return None
    return read(p)

def auto_music(scenes, beats, score, default):
    if score:   # "comedy@1 quiz@4 emotional@5 cafe@17 adventure@24"  (scene numbers, 1-based)
        out = []
        for tok in score.split():
            m, k = tok.split('@'); out.append([max(0, int(k) - 1), m])
        out = [o for o in sorted(out) if o[0] < len(scenes)] or [[0, default or 'adventure']]
        return out
    return [[0, default or 'adventure']]

def room_ir(sz=.5):
    n = int(SR * sz); t = np.arange(n) / SR
    irs = [lp(rng.uniform(-1, 1, n), 5000) * np.exp(-t * 9) for _ in range(2)]
    return [ir / np.sqrt(np.sum(ir ** 2)) for ir in irs]
def read(path):
    if not path or not os.path.exists(path): return None
    sr, x = wavfile.read(path); x = x.astype(np.float32) / (32768 if x.dtype == np.int16 else 1)
    if x.ndim == 1: x = np.stack([x, x], 1)
    if sr != SR:
        idx = np.linspace(0, len(x) - 1, int(len(x) * SR / sr)); x = np.stack([np.interp(idx, np.arange(len(x)), x[:, c]) for c in range(2)], 1)
    return x.T.astype(np.float32)
def write(path, st): wavfile.write(path, SR, (np.clip(st.T, -1, 1) * 32767).astype(np.int16))
def db(x): return 10 ** (x / 20)

def dip_curve(dips, n, depth_hard, depth_soft):
    g = np.zeros(n); t = np.arange(n) / SR
    for tp, kind in sorted(set((round(a, 2), b) for a, b in dips)):
        if kind == 'soft': a0, a1, dep = tp - .35, tp - .25, depth_soft
        elif kind == 'near': a0, a1, dep = tp + .02, tp + .05, depth_soft
        elif kind == 'cut': a0, a1, dep = tp - .03, tp - .01, depth_hard
        else: a0, a1, dep = tp - .45, tp - .33, depth_hard
        i0, i3 = max(0, int(a0 * SR)), min(n, int((tp + (.6 if kind == 'near' else .05)) * SR))
        if i3 <= i0: continue
        tt = t[i0:i3]; seg = np.where(tt < a1, dep * (tt - a0) / max(1e-3, a1 - a0), dep)
        if kind == 'near': seg = np.where(tt > tp + .3, dep * (1 - (tt - tp - .3) / .3), seg)
        else: seg = np.where(tt >= tp, dep * (1 - (tt - tp) / .05), seg)
        g[i0:i3] = np.minimum(g[i0:i3], seg)
    return db(g)

# ================================================================ 5. render buses + mix + master
def render_bus(snds, n, place_rev):
    B = {k: np.zeros((2, n), np.float32) for k in ('FG', 'BG', 'AMB', 'S', 'M', 'L')}
    for s in snds:
        if s.src == 'bed': x = s.opts['_x'] * s.lin
        else: x, _ = render_raw(s.name, s.var, s.opts); x = x * s.lin
        gdb, lpf, send, width = DIST.get(s.depth or 'near', DIST['near'])
        if s.bus != 'AMB':
            if gdb: x = x * db(gdb)
            if lpf: x = sosfilt(LPF(lpf), x)
        i0 = int(round(s.start * SR)); x = x[max(0, -i0):]; i0 = max(0, i0); j = min(n, i0 + len(x))
        if j <= i0: continue
        x = x[:j - i0]
        if isinstance(s.pan, tuple): p = np.linspace(s.pan[1], s.pan[2], len(x))
        else: p = float(s.pan or 0)
        th = (np.asarray(p) + 1) * np.pi / 4; gl, gr = np.cos(th) ** 1.5, np.sin(th) ** 1.5      # constant power, −4.5 dB centre
        if s.bus != 'AMB' and width < 1: m = (gl + gr) / 2; gl, gr = m + (gl - m) * width, m + (gr - m) * width
        B[s.bus][0, i0:j] += x * gl; B[s.bus][1, i0:j] += x * gr
        rv = place_rev.get(s.scene)
        if rv and s.bus in ('FG', 'BG') and not s.real.startswith(('ui_', 'trans_', 'riser_', 'hit_', 'magic_', 'glitch_')):
            B[rv][0, i0:j] += x * gl * db(send); B[rv][1, i0:j] += x * gr * db(send)
    return B

def median_rel(a, b, mask):
    la, lb = lufs_blocks(a), lufs_blocks(b); k = min(len(la), len(lb), len(mask)); m = mask[:k] & (lb[:k] > -60) & (la[:k] > -70)
    return float(np.median(la[:k][m] - lb[:k][m])) if m.sum() > 5 else None
def p90_rel(a, b, mask):
    la, lb = lufs_blocks(a), lufs_blocks(b); k = min(len(la), len(lb)); va = la[:k][la[:k] > -60]; vb = lb[:k][(mask[:k]) & (lb[:k] > -60)]
    return float(np.percentile(va, 90) - np.median(vb)) if len(va) > 5 and len(vb) > 5 else None

def main(base, design_path=None, story=None, fmt=None, lufs=None, tp=None, stingers=True, legacy=False, quiet=False):
    C = json.load(open(base + '_cues.json')); D = json.load(open(design_path)) if design_path and os.path.exists(design_path) else {}
    scenes = C['scenes']; dur = C['duration']; n = int(SR * (dur + 1.5)); slug = os.path.basename(base)
    fmt = fmt or ('youtube' if slug.endswith('-yt') or C.get('fmt') == '16x9' else 'vertical')
    target = float(lufs if lufs is not None else D.get('lufs', -14. if fmt == 'youtube' else -13.)); ceil = float(tp if tp is not None else -2.3)   # AAC adds up to ~0.5 dB of inter-sample overs → ≤ −1.5 dBTP delivered
    beats, score = parse_story(story) if story and os.path.exists(story) else ([], None)
    pp = bool(story and os.path.exists(story) and re.search(r'^\s*channel\s*:\s*poison\s*pill\s*$', open(story, encoding='utf-8').read(), re.M | re.I))
    if len(beats) < len(scenes): beats = beats + [('end', {})] * (len(scenes) - len(beats))
    V = read(base + '_vo.wav'); pad = lambda x: np.zeros((2, n), np.float32) if x is None else np.pad(x, ((0, 0), (0, max(0, n - x.shape[1]))))[:, :n].astype(np.float32)
    V = pad(V); has_vo = np.abs(V).max() > 1e-4
    vad = VAD(V if has_vo else None, C.get('subs', []), n)
    # ---- 1-2. events → rules
    evs = collect(C, beats, D); ctx = {'scenes': scenes, 'subs': C.get('subs', []), 'cues': C['cues'], 'events': evs, 'fmt': fmt}
    cands, dips, stings, drops, unknown = expand(evs, C, beats, ctx, D)
    for sb in C.get('subs', []):   # v5: [BEAT] in the script (a zero-width mark in the caption) → the music drops out under the held pause
        tx = str(sb.get('text', ''))
        if '\u200b' in tx: dips.append((sb['t0'] + (sb['t1'] - sb['t0']) * tx.index('\u200b') / max(1, len(tx)), 'hard'))
    foley_off = {i for i, (bt, o) in enumerate(beats[:len(scenes)]) if o.get('foley') == 'no'}
    if D.get('auto', True): cands += bed_sounds(scenes, dur) + sweeteners(scenes, dur, foley_off)
    # ---- 3. schedule
    flags = [t for t, k in dips]; acc, log = schedule(cands, vad, fmt, flags)
    if D.get('auto', True): acc += fill_gaps(acc, scenes, vad, fmt, flags, foley_off, dur)
    # ---- 4. buses
    place_rev = {i: REVERB_FOR.get(sc.get('_bed') or '', None) for i, sc in enumerate(scenes)}
    B = render_bus(acc, n, place_rev)
    irs = {'S': reverb_ir(.4, .008, 1), 'M': reverb_ir(.9, .02, 2), 'L': reverb_ir(1.8, .025, 3)}
    irs = {k: [np.asarray(c, np.float32) for c in v] for k, v in irs.items()}
    REV = np.zeros((2, n), np.float32)
    for k in ('S', 'M', 'L'):
        if np.abs(B[k]).max() > 0:
            for c in range(2): REV[c] += np.asarray(oaconvolve(B[k][c], irs[k][c])[:n], np.float32)
        B[k] = None; gc.collect()
    del irs; gc.collect()
    REV = eq(REV, [HPF(250), LPF(6000)])
    # music: multi-mood score crossfaded at the cuts + stingers
    LIBSEG, used_tracks = {}, []
    if pp and C.get('music') != 'none' and 'music' not in D:
        import importlib.util; spec = importlib.util.spec_from_file_location('pp_music', os.path.join(HERE, 'pp_music.py')); PM = importlib.util.module_from_spec(spec); spec.loader.exec_module(PM)
        if score: pm_segs = auto_music(scenes, beats, score, 'curious')
        else:   # one mood per run of acts; runs shorter than 18 s are merged into the previous one
            pm_segs = []
            for i, sc in enumerate(scenes):
                act = (beats[i][1].get('act') if i < len(beats) else None) or 'setup'; m = PM.ACT_MOOD.get(act, 'curious')
                if not pm_segs or pm_segs[-1][1] != m: pm_segs.append([i, m])
            merged = []
            for k, (si, m) in enumerate(pm_segs):
                t_end = scenes[pm_segs[k + 1][0]]['start'] if k + 1 < len(pm_segs) else dur
                if merged and t_end - scenes[si]['start'] < 18: continue
                merged.append([si, m])
            pm_segs = merged or [[0, 'curious']]
        for k, (si, m) in enumerate(pm_segs):
            tid = PM.pick(m, used_tracks, slug)
            if tid:
                t0 = scenes[si]['start'] - .35 if k else 0; t1 = scenes[pm_segs[k + 1][0]]['start'] - .35 if k + 1 < len(pm_segs) else dur + 1
                try: LIBSEG[k] = PM.arrange(tid, max(0, t0), t1, n, first=(k == 0)); used_tracks.append(tid); print(f'  music {m:10} {tid}  {t0:6.1f}–{t1:6.1f} s')
                except Exception as e: print('warn: library track', tid, 'failed:', e)
        D['music'] = [[si, PM.FALLBACK.get(m, m)] for si, m in pm_segs]
        json.dump(used_tracks, open(base + '_music_used.json', 'w'))
    D.setdefault('music', auto_music(scenes, beats, score, C.get('music')))
    segs = D['music']; stems = {}; seed = slug.replace('-yt', '')
    if C.get('music') != 'none':
        for k, (_, mood) in enumerate(segs):
            if k not in LIBSEG and mood not in stems: stems[mood] = music_stem(base, mood, seed)
    M = np.zeros((2, n), np.float32); xf = 1.4
    for k, (si, mood) in enumerate(segs):
        s = LIBSEG.get(k) if k in LIBSEG else stems.get(mood)
        if s is None: continue
        s = np.pad(s, ((0, 0), (0, max(0, n - s.shape[1]))))[:, :n]
        t0 = scenes[si]['start'] - .35 if k else 0; t1 = scenes[segs[k + 1][0]]['start'] - .35 if k + 1 < len(segs) else dur + 2
        tt = np.arange(n) / SR; up = np.clip((tt - (t0 - xf / 2)) / xf, 0, 1) if k else np.ones(n); dn = np.clip(((t1 + xf / 2) - tt) / xf, 0, 1) if k + 1 < len(segs) else np.ones(n)
        M += s * np.sin(np.minimum(up, dn) * np.pi / 2)[None, :]
    had_stems = bool(stems) or bool(LIBSEG); stems.clear(); gc.collect()
    STG = np.zeros((2, n), np.float32); used = []
    if stingers and D.get('stingers', True) and had_stems:
        mood_at = lambda t: next((m for si, m in reversed(segs) if scenes[si]['start'] <= t + .01), segs[0][1])
        for t, kind in sorted(stings):
            if any(abs(t - u) < 8 for u in used) or len(used) >= (4 if fmt == 'vertical' else 8) or vad.at(t): continue
            x = stinger_wav(base, kind, mood_at(t), seed)
            if x is None: continue
            ref = integrated(M) if np.abs(M).max() > 1e-5 else -16.
            x = x * db(ref + 3. - max(-60., float(np.max(lufs_blocks(x))) if x.shape[1] > SR * .4 else 20 * np.log10(np.abs(x).max() + 1e-9) - 8))   # momentary max ≈ score loudness + 3 LU
            pk = int(np.argmax(env_db(x.mean(0)))) * 441; i0 = int(t * SR) - pk
            if i0 < 0: continue
            j = min(n, i0 + x.shape[1]); STG[:, i0:j] += x[:, :j - i0]; used.append(t)
    # ---- 5. bus processing
    key = vad.m if has_vo else np.zeros_like(vad.m)   # no voice → nothing to duck under (captions only)
    Vp = eq(V, [HPF(90, 3), biquad('lshelf', 180, .7, -3.), biquad('peak', 300, 1.2, -2.5), biquad('peak', 3200, .9, 4.), biquad('hshelf', 10000, .7, 2.), LPF(16000)])
    if has_vo:
        sib = sosfiltfilt(butter(2, [5500, 8000], btype='band', fs=SR, output='sos'), Vp, axis=-1); lvl = np.sqrt(np.maximum(uniform_filter1d(np.mean(sib ** 2, 0), 441), 0)) + 1e-9
        ref = np.sqrt(np.maximum(uniform_filter1d(np.mean(Vp ** 2, 0), 441), 0)) + 1e-9; gds = np.clip(-(20 * np.log10(lvl / ref) + 12), -5, 0); Vp = Vp + sib * (db(gds)[None, :] - 1)
        thr = 20 * np.log10(np.percentile(np.sqrt(np.mean(Vp ** 2, 0))[np.sqrt(np.mean(Vp ** 2, 0)) > 1e-3], 90) + 1e-9) - 2 if np.any(np.abs(Vp) > 1e-3) else -20
        Vp, vo_gr = compress(Vp, thr + 1, 2.5, .010, .080)
        Vp = Vp * db(-16 - integrated(Vp))   # VO bus ≈ −16 LUFS
        Vp, vo_lim = tp_limit(Vp, -16 + 10.5, .003, .06)   # voice peak-to-loudness ≤ 10.5 dB so the master limiter barely works
    else: vo_gr = 0.
    yt = fmt == 'youtube'
    duck_m = env_curve(key, D.get('duck_db', -12. if yt else -10.), .025, .15, .40, n); dyn_m = env_curve(key, -4., .015, .1, .25, n)
    Mp = eq(M, [HPF(35), biquad('peak', 2500, .8, -2.), LPF(16000)]); Mp = dyn_band(Mp * duck_m[None, :], dyn_m, 1500, 4000)
    if np.abs(Mp).max() > 1e-5:   # score peak-to-loudness ≤ 11 dB (drum transients) so the master limiter stays light
        Lm = integrated(M); gm_, _ = tp_limit(M, Lm + 11., .003, .08, want_gain=True); Mp = Mp * gm_[None, :]
    Mp *= dip_curve(dips, n, -20., -6.)[None, :]
    FG = eq(B['FG'], [HPF(40)]); FG = dyn_band(FG, env_curve(key, -5., .01, .05, .2, n), 1500, 4500); FG, fg_gr = compress(FG, -14., 4., .001, .06, max_gr=3.)
    BG = eq(B['BG'], [HPF(120), biquad('peak', 2500, .8, -2.)]) * env_curve(key, -6., .02, .1, .35, n)[None, :]
    AMB = eq(B['AMB'], [HPF(80), biquad('lshelf', 200, .7, -3.), biquad('peak', 2500, .7, -4.), LPF(10000)]) * env_curve(key, -8., .04, .15, .6, n)[None, :]
    AMB = dyn_band(AMB, env_curve(key, -4., .02, .1, .3, n), 1000, 4000) * dip_curve(dips, n, -8., -4.)[None, :]
    STGp = eq(STG, [HPF(60)])
    if np.abs(STGp).max() > 1e-5: STGp, _ = tp_limit(STGp, (integrated(M) if np.abs(M).max() > 1e-5 else -16.) + 11., .003, .08)
    # ---- solved faders (relative to the voice; §5.2 of the grammar). design.json music_db / amb_db shift them.
    fad = {'MUS': 0., 'FG': 0., 'BG': 0., 'AMB': 0.}
    if has_vo:
        lv = lufs_blocks(Vp); speech = lv > (np.median(lv[lv > -60]) - 10 if np.any(lv > -60) else -40)
        tg = {'MUS': -18. if not yt else -20., 'AMB': -24.}
        for k, X in (('MUS', Mp), ('AMB', AMB)):
            r = median_rel(X, Vp, speech)
            if r is not None: fad[k] = float(np.clip(tg[k] - r, -15, 15))
        for k, X, tgt in (('FG', FG, -4.), ('BG', BG, -15.)):
            r = p90_rel(X, Vp, speech)
            if r is not None: fad[k] = float(np.clip(tgt - r, -12, 10))
    elif np.abs(Mp).max() > 1e-5:   # no voice: the score is the reference
        allm = np.ones(len(lufs_blocks(Mp)), bool)
        for k, X, tgt in (('FG', FG, 2.), ('BG', BG, -8.)):
            r = p90_rel(X, Mp, allm)
            if r is not None: fad[k] = float(np.clip(tgt - r, -20, 10))
        r = median_rel(AMB, Mp, allm)
        if r is not None: fad['AMB'] = float(np.clip(-10. - r, -20, 10))
    fad['MUS'] += D.get('music_db', -14.5) + 14.5; fad['AMB'] += D.get('amb_db', -20.) + 20.
    if 'foley_gain' in D: fad['FG'] += 20 * math.log10(max(1e-3, D['foley_gain'] / .5)); fad['BG'] += 20 * math.log10(max(1e-3, D['foley_gain'] / .5))
    if legacy:   # optional: also mix the old sfx.py / ambience.py stems underneath
        S0, A0 = pad(read(base + '_sfx.wav')), pad(read(base + '_amb.wav')); FG = FG + S0 * .3; AMB = AMB + A0 * .3
    mus = Mp * db(fad['MUS']); stg = STGp * db(fad['MUS'])  # stingers: score loudness +3 LU, in speech gaps (the bed is ducked, they are not)
    fg, bg, amb = FG * db(fad['FG']), BG * db(fad['BG']), AMB * db(fad['AMB'])
    ref_pk = (20 * np.log10(np.percentile(np.abs(Vp), 99.95) + 1e-9) + 3.) if has_vo else (20 * np.log10(np.percentile(np.abs(mus), 99.95) + 1e-9) + 4. if np.abs(mus).max() > 1e-5 else None)
    if ref_pk is not None:   # hits may peak at most +3 dB over the voice's peaks (+4 over the score without voice): keeps the master limiter light (LRA, punch)
        sc_, sfx_gr = tp_limit(fg + bg, ref_pk, .003, .08, want_gain=True); fg, bg = fg * sc_[None, :], bg * sc_[None, :]
    pre = Vp + mus + stg + fg + bg + amb + REV * db(fad['FG'] - 2)
    pre, glue_gr = compress(pre, 20 * np.log10(np.percentile(np.abs(pre[0]), 99.5) + 1e-9) - 3, 1.5, .03, .2, max_gr=1.5)
    # ---- master: loudness target + true-peak limiter (iterate: limiting costs a little loudness)
    g = target - integrated(pre); out = pre; lim_gr = 0.
    for it in range(5):
        x0 = pre * db(g); gcur, lim_gr = tp_limit(x0, ceil, want_gain=True); out = x0 * gcur[None, :]
        for _ in range(3):                                   # catch residual inter-sample overs
            tpk = true_peak(out)
            if tpk <= ceil + .02: break
            g2, _ = tp_limit(out, ceil - .1, .002, .03, want_gain=True); out = out * g2[None, :]; gcur = gcur * g2
        L = integrated(out)
        if os.environ.get('SD_DEBUG'): print(f'  master iter: gain {g:.2f} → {L:.2f} LUFS, TP {tpk:.2f} (ceil {ceil:.2f}), max GR {lim_gr:.1f}')
        if abs(L - target) < .08: break
        g += (target - L)
    if os.environ.get('SD_DEBUG'):
        i = int(np.argmin(gcur)); w = slice(max(0, i - 2205), i + 2205)
        print('  worst limiting at', round(i / SR, 2), 's; bus peaks (dBFS, pre-master):', {k: round(20 * np.log10(np.abs(v[:, w]).max() + 1e-9), 1) for k, v in (('VO', Vp), ('MUS', mus), ('STG', stg), ('FG', fg), ('BG', bg), ('AMB', amb), ('REV', REV))})
    write(base + '_mix.wav', out); lim_over = float(np.mean(gcur < db(-4.)) * dur * 1000)
    fol = fg + bg; write(base + '_foley.wav', fol / max(1, np.abs(fol).max() / .98)); write(base + '_amb.wav', amb / max(1, np.abs(amb).max() / .98))
    mm = mus + stg; write(base + '_music.wav', mm / max(1, np.abs(mm).max() / .98))
    # ---- 6. QA
    qa = qa_report(acc, log, evs, scenes, dur, vad, fmt, {'VO': Vp, 'MUS': mus, 'FG': fg, 'BG': bg, 'AMB': amb}, out, target, unknown, flags, drops, C)
    qa.update({'faders_db': {k: round(v, 1) for k, v in fad.items()}, 'limiter_max_gr_db': round(lim_gr, 1), 'limiter_ms_over_4db': round(lim_over), 'vo_comp_max_gr_db': round(vo_gr, 1),
               'stingers': len(used), 'music_engine': music_engine(), 'moods': [m for _, m in segs]})
    json.dump(qa, open(base + '_sound_qa.json', 'w'), indent=1, default=float)
    if not quiet: print_qa(qa, base)
    return qa

# ================================================================ 6. QA
def qa_report(acc, log, evs, scenes, dur, vad, fmt, buses, mix, target, unknown, flags, drops, C):
    lim = LIMITS[fmt]; ev_s = [s for s in acc if s.bus != 'AMB' and s.tier <= 3]
    w = lambda s: 1. if s.tier <= 2 else .5
    per10 = []
    for w0 in np.arange(0, dur, 10.):
        xs = [s for s in ev_s if w0 <= s.peak_t < w0 + 10]; per10.append(float(round(sum(w(s) for s in xs) * 10 / max(1., min(10., dur - w0)), 1)))
    sec = {}
    for s in ev_s: sec.setdefault(section_of(s.peak_t, scenes, dur), []).append(s)
    sec_len = {}
    for t in np.arange(0, dur, .1): k = section_of(t, scenes, dur); sec_len[k] = sec_len.get(k, 0) + .1
    density = {k: {'per10s': round(sum(w(s) for s in v) * 10 / max(.5, sec_len.get(k, 1)), 1), 'raw_per10s': round(len(v) * 10 / max(.5, sec_len.get(k, 1)), 1),
                   'min': lim['density'].get(k), 'target': lim['target'].get(k)} for k, v in sec.items()}
    on = sorted(s.peak_t for s in ev_s); end0 = next((sc['start'] for sc in scenes if sc.get('_beat') == 'end'), dur)
    gaps = [(round(a, 2), round(b - a, 2)) for a, b in zip([0.] + on, on + [end0]) if b - a > lim['gap'] and not any(a - .5 <= f <= b + .5 for f in flags)]
    # concurrency
    fgs = sorted([s for s in acc if s.bus == 'FG'], key=lambda s: s.start); conc = 0
    for s in fgs: conc = max(conc, sum(1 for o in fgs if o.start <= s.peak_t <= o.start + o.active))
    t1 = sorted(s.peak_t for s in acc if s.tier == 1); t1_viol = sum(1 for a, b in zip(t1, t1[1:]) if b - a < lim['t1'] - .01)
    hits_words = [round(s.peak_t, 2) for s in acc if s.tier == 1 and vad.at(s.peak_t)]
    renderer = [e for e in evs if e.src == 'renderer' and not e.kind.startswith(('cam.drift', 'cam.handheld', 'cam.pushIn', 'cam.breathe', 'cam.follow', 'trans.cut', 'trans.fade', 'ui.endFrame', 'ui.logo', 'char.pose'))]
    sounded = {id(s.ev) for s in acc if s.ev is not None}; cov = sum(1 for e in renderer if id(e) in sounded) / max(1, len(renderer))
    names = {}
    for s in acc:
        if s.bus != 'AMB': names[s.real] = names.get(s.real, 0) + 1
    top = sorted(names.items(), key=lambda kv: -kv[1])[:6]; tot = sum(names.values()) or 1
    ph = {}
    for k, b in buses.items():
        if np.abs(b).max() < 1e-6: continue
        full, pho = integrated(b), integrated(phone(b)); ph[k] = {'full': round(full, 1), 'phone': round(pho, 1), 'drop': round(full - pho, 1)}
    # voice masking: 1–4 kHz SNR per 400 ms speech window
    mask_warn = 0; mask_by = {}; vb = buses['VO']
    if np.abs(vb).max() > 1e-4:
        band = butter(2, [1000, 4000], btype='band', fs=SR, output='sos'); others = sum(b for k, b in buses.items() if k != 'VO')
        ev_ = np.mean(sosfilt(band, vb, axis=-1) ** 2, 0); eo = np.mean(sosfilt(band, others, axis=-1) ** 2, 0); hop = int(SR * .4)
        for i in range(0, len(ev_) - hop, hop):
            if vad.at(i / SR + .2):
                a, b2 = ev_[i:i + hop].mean(), eo[i:i + hop].mean()
                if a > 0 and 10 * np.log10(a / (b2 + 1e-12)) < 6:
                    mask_warn += 1; worst = max(((k, np.mean(sosfilt(band, b, axis=-1)[:, i:i + hop] ** 2)) for k, b in buses.items() if k != 'VO'), key=lambda kv: kv[1])[0]; mask_by[worst] = mask_by.get(worst, 0) + 1
    mixd = {'lufs_i': round(integrated(mix), 2), 'tp_dbtp': round(true_peak(mix), 2), 'lra': round(lra(mix), 1), 'target': target,
            'hook_s_lufs': round(integrated(mix[:, :int(3 * SR)]), 1), 'phone_lufs': round(integrated(phone(mix)), 1)}
    dl = {}
    for r_, *_ in log: dl[r_] = dl.get(r_, 0) + 1
    return {'fmt': fmt, 'duration': round(dur, 2), 'events_scheduled': len(ev_s), 'beds': sum(1 for s in acc if s.bus == 'AMB'),
            'per10s_weighted': round(sum(w(s) for s in ev_s) * 10 / dur, 1), 'per10s_raw': round(len(ev_s) * 10 / dur, 1), 'per10s_windows': per10,
            'density_by_section': density, 'unique_sounds': len(names), 'top_sounds': [(k, v, round(100 * v / tot)) for k, v in top],
            'empty_windows': gaps, 'max_fg_concurrency': conc, 't1_count': len(t1), 't1_spacing_violations': t1_viol, 'hits_on_words': hits_words,
            'coverage': round(cov, 2), 'scheduler_log': dl, 'unknown_sounds': unknown, 'phone_check': ph, 'voice_mask_windows': mask_warn, 'voice_mask_by_bus': mask_by, 'mix': mixd}

def print_qa(q, base):
    ok = lambda c: 'ok  ' if c else 'FAIL'
    m = q['mix']; print(f'\n── sound QA · {os.path.basename(base)} · {q["fmt"]} · {q["duration"]} s · music {q["music_engine"]} {q["moods"]} · stingers {q["stingers"]}')
    print(f'  events scheduled {q["events_scheduled"]} (+{q["beds"]} beds) · {q["per10s_weighted"]}/10 s weighted ({q["per10s_raw"]} raw) · unique sounds {q["unique_sounds"]} · coverage {int(q["coverage"] * 100)}% of visual events')
    print('  per 10 s window:', q['per10s_windows'])
    for k, v in q['density_by_section'].items():
        mn = v['min']; print(f'   {ok(mn is None or v["per10s"] >= mn)} {k:9s} {v["per10s"]:5.1f}/10 s (min {mn}, target {v["target"]}) raw {v["raw_per10s"]}')
    print(f'  {ok(not q["empty_windows"])} empty windows (> gap limit): {q["empty_windows"] or "none"}')
    print(f'  {ok(q["max_fg_concurrency"] <= 4)} max foreground concurrency {q["max_fg_concurrency"]} · T1 hits {q["t1_count"]}, spacing violations {q["t1_spacing_violations"]} · hits on words {len(q["hits_on_words"])}')
    print(f'  top sounds: ' + ', '.join(f'{k} {v} ({p}%)' for k, v, p in q['top_sounds']))
    print(f'  scheduler: {q["scheduler_log"]} · unknown: {q["unknown_sounds"] or "none"} · voice-mask windows {q["voice_mask_windows"]} {q.get("voice_mask_by_bus", {})}')
    for k, v in q['phone_check'].items(): print(f'   {ok(v["drop"] <= (6 if k == "VO" else 8))} phone {k:4s} {v["full"]:6.1f} → {v["phone"]:6.1f} LUFS (−{v["drop"]} dB)')
    print(f'  {ok(abs(m["lufs_i"] - m["target"]) <= .5)} loudness {m["lufs_i"]} LUFS (target {m["target"]}) · {ok(m["tp_dbtp"] <= -2.0)} TP {m["tp_dbtp"]} dBTP · LRA {m["lra"]} LU · hook(0–3 s) {m["hook_s_lufs"]} · phone {m["phone_lufs"]}')
    print(f'  faders {q["faders_db"]} · limiter max GR {q["limiter_max_gr_db"]} dB ({q.get("limiter_ms_over_4db", 0)} ms > 4 dB) · VO comp max GR {q["vo_comp_max_gr_db"]} dB\n')

def qa_file(path, stems=None):
    x = read(path); r = {'lufs_i': round(integrated(x), 2), 'tp_dbtp': round(true_peak(x), 2), 'lra': round(lra(x), 1), 'phone_lufs': round(integrated(phone(x)), 1), 'hook_s_lufs': round(integrated(x[:, :3 * SR]), 1)}
    print(os.path.basename(path), r)
    if stems:
        for k in ('vo', 'music', 'foley', 'sfx', 'amb'):
            y = read(f'{stems}_{k}.wav')
            if y is not None: f, p = integrated(y), integrated(phone(y)); print(f'   {k:6s} {f:6.1f} → phone {p:6.1f} (−{f - p:.1f} dB)')
    return r

if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k: a[a.index('--' + k) + 1] if '--' + k in a else None
    if not a: print(__doc__); sys.exit()
    if a[0] == 'qa': qa_file(a[1], opt('stems')); sys.exit()
    q = main(a[0], opt('design'), opt('story'), opt('fmt'), float(opt('lufs')) if opt('lufs') else None, float(opt('tp')) if opt('tp') else None,
             stingers='--no-stingers' not in a, legacy='--legacy-stems' in a, quiet='--quiet' in a)
    print('sound design →', a[0] + '_mix.wav', f'{q["events_scheduled"]} events, {q["unique_sounds"]} sounds, {q["mix"]["lufs_i"]} LUFS, TP {q["mix"]["tp_dbtp"]} dBTP')
