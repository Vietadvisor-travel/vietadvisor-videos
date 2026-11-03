#!/usr/bin/env python3
"""Location ambience beds, synthesised (royalty-free): city traffic & horns, market chatter, countryside birds &
cicadas, night crickets, river/sea water, wind, rain, interior room tone. One bed per scene, chosen from the place
(and weather), crossfaded with a J-cut: each new bed starts 0.6 s BEFORE its picture.
  python3 tools/ambience.py out/x_cues.json out/x_amb.wav"""
import json, sys
import numpy as np
from scipy.signal import butter, sosfilt
SR = 44100
R = np.random.default_rng(11)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], btype='band', fs=SR, output='sos'), x)
def noise(n): return R.uniform(-1, 1, n)
def slow(n, rate=.3, depth=.5): t = np.arange(n) / SR; return 1 - depth + depth * (.5 + .5 * np.sin(2 * np.pi * rate * t + R.uniform(0, 6)) * (.6 + .4 * np.sin(2 * np.pi * rate * .37 * t)))
def place_events(n, rate, make):
    out = np.zeros(n); k = 0
    while True:
        k += int(R.exponential(SR / rate));
        if k >= n: break
        e = make(); j = min(n, k + len(e)); out[k:j] += e[:j - k]
    return out
def env(m, a=.01, r=.3): t = np.arange(m) / SR; return np.minimum(1, t / a) * np.exp(-t / r)
def horn():
    m = int(SR * R.uniform(.15, .45)); t = np.arange(m) / SR; f = R.choice([380, 420, 470, 520]); x = np.sign(np.sin(2 * np.pi * f * t)) * .5 + np.sin(2 * np.pi * f * 1.26 * t) * .5
    return lp(x, 2200) * np.minimum(1, t / .01) * np.minimum(1, (m / SR - t) / .03) * R.uniform(.05, .14)
def scooter():
    m = int(SR * R.uniform(1.8, 3)); t = np.arange(m) / SR; d = m / SR; g = np.exp(-((t - d / 2) / (d / 4)) ** 2)
    f0 = R.uniform(70, 110); f = f0 * (1.08 - .16 * (t / d)); ph = np.cumsum(f) / SR
    x = (np.sign(np.sin(2 * np.pi * ph)) * .4 + bp(noise(m), 300, 1800) * .6) * g; return lp(x, 2500) * R.uniform(.08, .16)
def chirp():
    m = int(SR * R.uniform(.06, .14)); t = np.arange(m) / SR; f = R.uniform(2500, 4800); sw = f * (1 + .35 * np.sin(np.pi * t / (m / SR)))
    return np.sin(2 * np.pi * np.cumsum(sw) / SR) * env(m, .005, .05) * R.uniform(.04, .1)
def clink():
    m = int(SR * .25); t = np.arange(m) / SR; f = R.uniform(1800, 3200); return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.7 * t)) * env(m, .002, .06) * R.uniform(.03, .07)
def drip():
    m = int(SR * .2); t = np.arange(m) / SR; f = R.uniform(700, 1400) * (1 + 2 * np.exp(-t * 40)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(m, .002, .05) * .08
def chatter(n, dens=1.):
    base = bp(noise(n), 250, 2600); words = np.zeros(n); k = 0
    while k < n: m = int(SR * R.uniform(.12, .35)); g = np.hanning(m) * R.uniform(.3, 1); j = min(n, k + m); words[k:j] += g[:j - k]; k += int(m * R.uniform(.6, 1.4) / dens)
    return base * lp(words, 12) * .22
def bed(kind, n):
    if kind == 'city': return lp(noise(n), 180) * .5 * slow(n, .08, .3) + bp(noise(n), 400, 2000) * .03 + place_events(n, .7, scooter) + place_events(n, .25, horn) + chatter(n, .5) * .5
    if kind == 'town': return lp(noise(n), 160) * .25 + chatter(n, .7) * .8 + place_events(n, .25, scooter) * .7 + place_events(n, .06, horn) + place_events(n, .5, chirp) * .5
    if kind == 'market': return chatter(n, 1.6) * 1.2 + place_events(n, 1.2, clink) + hp(noise(n), 5000) * .01 * slow(n, .5, .6) + place_events(n, .2, scooter) * .6
    if kind == 'country': return bp(noise(n), 150, 900) * .08 * slow(n, .15, .6) + place_events(n, 1.6, chirp) + bp(noise(n), 4200, 6500) * .025 * (.6 + .4 * np.sign(np.sin(2 * np.pi * 38 * np.arange(n) / SR)))
    if kind == 'mountain': return bp(noise(n), 120, 700) * .16 * slow(n, .07, .7) + place_events(n, .5, chirp)
    if kind == 'night': t = np.arange(n) / SR; return bp(noise(n), 4300, 4800) * .05 * (np.sin(2 * np.pi * 3.1 * t) > .4) + lp(noise(n), 150) * .05 + place_events(n, .15, chirp) * .4
    if kind == 'water': return lp(noise(n), 700) * .25 * slow(n, .25, .7) + bp(noise(n), 1200, 3500) * .02 * slow(n, .6, .8)
    if kind == 'sea': return lp(noise(n), 900) * .35 * slow(n, .11, .85) + hp(noise(n), 3000) * .03 * slow(n, .11, .9)
    if kind == 'rain': return hp(noise(n), 1200) * .12 + bp(noise(n), 300, 1500) * .05 + place_events(n, 6, drip) * .4
    if kind == 'cave': return lp(noise(n), 120) * .08 + place_events(n, .8, drip)
    if kind == 'room': return lp(noise(n), 300) * .02 + place_events(n, .05, clink) * .5
    return np.zeros(n)
PLACE_AMB = {'oldquarter': 'city', 'hanoi': 'city', 'saigon': 'city', 'benthanh': 'market', 'sidewalk': 'city', 'trainstreet': 'town', 'night_market': 'market', 'hue': 'town', 'hoian': 'town', 'dalat': 'country',
             'hagiang': 'mountain', 'sapa': 'mountain', 'village': 'country', 'homestay': 'night', 'mekong': 'water', 'ninhbinh': 'water', 'halong': 'sea', 'phuquoc': 'sea', 'muine': 'mountain', 'phongnha': 'cave', 'danang': 'mountain'}
MOMENT_AMB = {'pass': 'mountain', 'lanterns': 'night', 'downpour': 'rain', 'seasons': 'country', 'steam': 'room', 'train': 'town', 'cave': 'cave', 'sunrise': 'country', 'fireworks': 'city', 'crossing': 'city', 'window': 'room', 'mapdive': None, 'split': 'town'}
def kind_for(s):
    if s.get('moment'): return MOMENT_AMB.get(s['moment'])
    p, desc = s.get('place') or '', s.get('placeDesc') or ''
    if s.get('weather') == 'rain': return 'rain'
    if p in PLACE_AMB: k = PLACE_AMB[p]
    elif 'kit=room' in desc: k = 'room'
    elif 'base=' in desc: k = PLACE_AMB.get(desc.split('base=')[1].split()[0], 'town')
    elif 'market' in desc: k = 'market'
    elif 'water=sea' in desc: k = 'sea'
    elif 'water=' in desc: k = 'water'
    elif any(w in desc for w in ('town', 'colonial', 'street3d')): k = 'town'
    elif desc: k = 'country'
    else: return None
    if s.get('time') == 'night' and k in ('country', 'mountain', 'town'): k = 'night' if k != 'town' else 'town'
    return k
def build(cues_path, out_path):
    C = json.load(open(cues_path, encoding='utf-8')); D = C.get('duration') or 60; n = int(SR * (D + 2)); L = np.zeros(n); Rr = np.zeros(n)
    sc = C['scenes']; lead, fade = .6, .8
    for i, s in enumerate(sc):
        k = kind_for(s)
        if not k: continue
        t0 = max(0, s['start'] - (lead if i else 0)); t1 = min(D + 1, s['start'] + s['dur'] + (lead if i < len(sc) - 1 else 1))
        i0, i1 = int(t0 * SR), int(t1 * SR); m = i1 - i0
        if m <= 0: continue
        a = bed(k, m); b = bed(k, m) if k not in ('room',) else a   # decorrelated stereo
        e = np.ones(m); f = min(int(fade * SR), m // 2); e[:f] = np.linspace(0, 1, f); e[-f:] = np.minimum(e[-f:], np.linspace(1, 0, f))
        L[i0:i1] += a * e; Rr[i0:i1] += b * e
    st = np.stack([L, Rr]); pk = np.abs(st).max()
    if pk > 0: st = st / pk * .7
    from scipy.io import wavfile
    wavfile.write(out_path, SR, (st.T * 32767).astype(np.int16)); print('ambience:', out_path)
if __name__ == '__main__':
    if len(sys.argv) < 3: print(__doc__)
    else: build(sys.argv[1], sys.argv[2])
