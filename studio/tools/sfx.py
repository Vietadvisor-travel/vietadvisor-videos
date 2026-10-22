#!/usr/bin/env python3
"""Procedural SFX for Vietadvisor episodes — no sound files or licences needed.
  python3 tools/sfx.py mix out/cues.json out/sfx.wav     # build an SFX track from a cue sheet
  python3 tools/sfx.py lib sfx/                          # export every sound as a .wav (for editors)
Cue names: pop ding whoosh whoosh_up whoosh_down impact thud stamp clink tick buzzer boing sparkle slide
           choir engine_loop typewriter pen_draw map_whoosh pin_drop gasp fall brake gulp pop_cascade moto_pass
Unknown names fall back to 'pop'."""
import json, sys, os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt
SR = 44100
rng = np.random.default_rng(7)
def t_(d): return np.arange(int(SR * d)) / SR
def env(n, a=.005, r=None, curve=4):
    e = np.ones(n); ai = max(1, int(SR * a)); e[:ai] = np.linspace(0, 1, ai)
    tail = np.linspace(0, 1, n - ai); e[ai:] = np.exp(-curve * tail) if r is None else e[ai:]; return e
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, btype='high', fs=SR, output='sos'), x)
def sine(f, d, ph=0):
    t = t_(d); f = np.broadcast_to(f, t.shape) if np.ndim(f) else np.full(t.shape, f); return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)
def noise(d): return rng.uniform(-1, 1, int(SR * d))
def sweep_noise(d, f0, f1, q=.6):
    x = noise(d); n = len(x); out = np.zeros(n); seg = 512
    for i in range(0, n, seg):
        f = f0 + (f1 - f0) * i / n; out[i:i + seg] = bp(x[i:i + seg], max(60, f * (1 - q / 2)), min(SR / 2 - 100, f * (1 + q / 2)))
    return out
def bell(d, peak=.4):
    n = int(SR * d); x = np.linspace(0, 1, n); return np.where(x < peak, (x / peak) ** 2, ((1 - x) / (1 - peak)) ** 2)
S = {}
S['pop'] = lambda: sine(np.linspace(520, 980, int(SR * .07)), .07) * env(int(SR * .07), .002, curve=7) * .8
S['ding'] = lambda: (sine(1318.5, .9) + .5 * sine(2637, .9) + .25 * sine(3955, .9)) * env(int(SR * .9), .003, curve=5) * .45
S['whoosh'] = lambda: sweep_noise(.45, 500, 2600) * bell(.45, .55) * 1.6
S['map_whoosh'] = lambda: sweep_noise(1.2, 300, 1800) * bell(1.2, .6) * 1.4
S['whoosh_up'] = lambda: sweep_noise(.6, 300, 3500) * bell(.6, .7) * 1.6
S['whoosh_down'] = lambda: sweep_noise(.8, 3000, 250) * bell(.8, .3) * 1.6
S['slide'] = lambda: sweep_noise(.3, 1200, 2200) * bell(.3, .3) * 1.2
S['moto_pass'] = lambda: (lp(np.sign(sine(np.linspace(70, 95, int(SR * 1.4)), 1.4)), 900) * .5 + sweep_noise(1.4, 400, 1200) * .5) * bell(1.4, .5)
S['impact'] = lambda: (sine(np.linspace(120, 38, int(SR * .7)), .7) * 1.0 + lp(noise(.7), 1800) * .6) * env(int(SR * .7), .002, curve=5)
S['thud'] = lambda: (sine(np.linspace(110, 55, int(SR * .25)), .25) + lp(noise(.25), 600) * .3) * env(int(SR * .25), .002, curve=8)
S['fall'] = lambda: sine(np.linspace(1400, 300, int(SR * .5)), .5) * bell(.5, .2) * .35
S['pin_drop'] = lambda: np.concatenate([S['fall']()[:int(SR * .4)] * .7, np.zeros(int(SR * .05))])
S['stamp'] = lambda: (lp(noise(.18), 2500) * .9 + sine(np.linspace(140, 70, int(SR * .18)), .18)) * env(int(SR * .18), .001, curve=10)
S['clink'] = lambda: (sine(2490, .5) + .7 * sine(3720, .5) + .4 * sine(5150, .5)) * env(int(SR * .5), .001, curve=9) * .35
S['tick'] = lambda: hp(noise(.025), 3000) * env(int(SR * .025), .0005, curve=12) * .9
S['typewriter'] = S['tick']
S['buzzer'] = lambda: lp(np.sign(sine(140, .45)), 2400) * env(int(SR * .45), .005, curve=1.5) * .35
S['boing'] = lambda: sine(220 + 160 * np.sin(np.linspace(0, 18, int(SR * .6))) * np.linspace(1, 0, int(SR * .6)) + np.linspace(0, 140, int(SR * .6)), .6) * env(int(SR * .6), .003, curve=3) * .6
def _sparkle():
    n = int(SR * .6); out = np.zeros(n)
    for k in range(5):
        x = sine(2000 + 900 * k, .25) * env(int(SR * .25), .001, curve=10); i = int(SR * k * .06); out[i:i + len(x)] += x[:n - i]
    return out * .25
S['sparkle'] = _sparkle
def _cascade():
    n = int(SR * 1.8); out = np.zeros(n); p = S['pop']()
    for k in range(18):
        i = int(SR * k * .03); out[i:i + len(p)] += p * (.9 - k * .04)
    return out * .6
S['pop_cascade'] = _cascade
def _choir():
    d = 2.6; t = t_(d); vib = 1 + .006 * np.sin(2 * np.pi * 5.5 * t); x = 0
    for f in (261.6, 329.6, 392.0, 523.3):
        saw = 2 * ((np.cumsum(f * vib) / SR) % 1) - 1; x = x + saw
    x = bp(x, 500, 1300) * 1.2 + bp(x, 2400, 3200) * .4; return x * bell(d, .25) * .35
S['choir'] = _choir
S['engine_loop'] = lambda: lp(np.sign(sine(82 + 6 * np.sin(np.linspace(0, 30, int(SR * 2.5))), 2.5)), 700) * (.6 + .4 * np.sin(np.linspace(0, 60, int(SR * 2.5)))) * bell(2.5, .1) * .3
S['pen_draw'] = lambda: bp(noise(1.5), 1500, 4000) * (.5 + .5 * np.abs(np.sin(np.linspace(0, 40, int(SR * 1.5))))) * bell(1.5, .1) * .35
S['gasp'] = lambda: bp(noise(.35), 800, 2600) * bell(.35, .3) * .8
S['brake'] = lambda: bp(noise(.6), 2500, 5000) * bell(.6, .2) * .5
S['gulp'] = lambda: sine(np.linspace(300, 120, int(SR * .18)), .18) * env(int(SR * .18), .003, curve=6) * .7
S['impact_big'] = lambda: S['impact']() * 1.2
def _thunder():
    d = 3.2; n = noise(d); x = lp(n, 160) * 2.2 + bp(n, 200, 900) * .6
    t = t_(d); e = np.exp(-t * 1.1) * (np.minimum(1, t / .04)) * (1 + .6 * np.sin(2 * np.pi * 3.3 * t) * np.exp(-t * 2)); crack = hp(noise(d), 2500) * np.exp(-t * 18) * .8
    return (x * e + crack) * .9
S['thunder'] = _thunder
S['wind'] = lambda: bp(noise(3.0), 250, 900) * (.5 + .5 * np.sin(np.linspace(0, 5, int(SR * 3.0)))) * bell(3.0, .4) * .8
S['rain_burst'] = lambda: (hp(noise(3.0), 1500) * .6 + bp(noise(3.0), 400, 1500) * .3) * np.minimum(1, t_(3.0) / 1.2) * bell(3.0, .05)
S['splash'] = lambda: (bp(noise(.5), 600, 3500) * np.exp(-t_(.5) * 9) + sine(np.linspace(900, 300, int(SR * .5)), .5) * np.exp(-t_(.5) * 14) * .4)
S['sizzle'] = lambda: hp(noise(3.0), 3000) * (.7 + .3 * np.abs(np.sin(np.linspace(0, 90, int(SR * 3.0))))) * bell(3.0, .3) * .5
S['drip'] = lambda: sine(np.linspace(1400, 600, int(SR * .25)) * (1 + 2 * np.exp(-t_(.25) * 40)), .25) * np.exp(-t_(.25) * 22) * .8
def _horn():
    d = 1.6; t = t_(d); x = 0
    for f in (311, 370, 466): x = x + np.sign(np.sin(2 * np.pi * f * t)) * .3 + np.sin(2 * np.pi * f * 2 * t) * .2
    return lp(x, 2400) * np.minimum(1, t / .05) * np.minimum(1, (d - t) / .2) * .7
S['train_horn'] = _horn
def _train():
    d = 3.0; t = t_(d); clack = np.zeros_like(t)
    for k in np.arange(0, d, .23): i = int(k * SR); m = min(len(t) - i, int(SR * .05)); clack[i:i + m] += np.exp(-np.arange(m) / SR * 80)
    rumble = lp(noise(d), 120) * 2; g = np.exp(-((t - 1.2) / .8) ** 2)
    return (rumble + bp(clack * noise(d), 800, 3000) * 2 + bp(noise(d), 300, 1200) * .5) * g * .7
S['train_pass'] = _train
def _firework():
    d = 2.4; t = t_(d); boom = lp(noise(d), 200) * np.exp(-t * 4) * 2 * np.minimum(1, t / .01)
    crackle = np.zeros_like(t); r = np.random.default_rng(3)
    for k in r.uniform(.25, 2.0, 40): i = int(k * SR); m = min(len(t) - i, 400); crackle[i:i + m] += r.uniform(.2, .6) * np.exp(-np.arange(m) / 60)
    return (boom + hp(crackle * noise(d), 2000) * np.exp(-t * .8)) * .8
S['firework'] = _firework
GAIN = {'whoosh': .7, 'map_whoosh': .6, 'slide': .6, 'pop': .55, 'tick': .5, 'ding': .6, 'choir': .7, 'engine_loop': .5, 'moto_pass': .6}
def get(name):
    f = S.get(name) or S['pop']; x = np.asarray(f(), dtype=np.float64); m = np.max(np.abs(x)) or 1; return x / m * GAIN.get(name, .8)
def mix(cues_path, out_path):
    d = json.load(open(cues_path)); dur = max([s['start'] + s['dur'] for s in d['scenes']] + [1]); n = int(SR * (dur + 1)); track = np.zeros(n)
    for c in d['cues']:
        x = get(c['sfx']); i = int(SR * max(0, c['t'] - (.25 if 'whoosh' in c['sfx'] else 0))); j = min(n, i + len(x)); track[i:j] += x[:j - i] * c.get('gain', 1)
    track = np.tanh(track * 1.2) / np.tanh(1.2); track *= .85 / (np.max(np.abs(track)) or 1)
    track = track[:int(SR * dur)]; wavfile.write(out_path, SR, (track * 32767).astype(np.int16)); print('wrote', out_path, f'{dur:.1f}s', len(d['cues']), 'cues')
if __name__ == '__main__':
    if sys.argv[1] == 'mix': mix(sys.argv[2], sys.argv[3])
    elif sys.argv[1] == 'lib':
        os.makedirs(sys.argv[2], exist_ok=True)
        for k in S: wavfile.write(os.path.join(sys.argv[2], k + '.wav'), SR, (get(k) * 32767 * .9).astype(np.int16))
        print('exported', len(S), 'sounds')
