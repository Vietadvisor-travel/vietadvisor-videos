#!/usr/bin/env python3
"""ONE finished file that opens on every device and fits a chat attachment (< 30 MB).
  python3 tools/deliver.py out/<slug>_9x16_master.mp4 [--mb 29.3] [--out out/<slug>_FINAL.mp4]
H.264 High (universal: iPhone, Android, Windows, Mac, every browser), two-pass at exactly the bitrate the size
budget allows, AAC 128 kb/s, +faststart. Then it checks: size under budget, plays (ffprobe), and SSIM against the
master (≥ 0.985 = indistinguishable on a phone). Keep film grain low in the render (post.js) — grain is what
makes cartoons expensive to encode."""
import sys, os, subprocess, json, re, tempfile
a = sys.argv[1:]; src = a[0]; opt = lambda k, d: a[a.index('--' + k) + 1] if '--' + k in a else d
mb = float(opt('mb', 29.3)); out = opt('out', re.sub(r'(_master)?\.mp4$', '', src) + '_FINAL.mp4')
pr = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate', '-of', 'json', src]))
D = float(pr['format']['duration']); abps = 128_000
vbps = int((mb * 1024 * 1024 * 8 * .985) / D - abps)   # 1.5 % container headroom
if vbps < 600_000: print(f'⚠ {D:.0f}s is long for {mb} MB — video bitrate would be {vbps//1000} kb/s; split the film or raise --mb');
log = tempfile.mktemp(); v = ['-c:v', 'libx264', '-preset', 'slower', '-tune', 'animation', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p', '-b:v', str(vbps), '-maxrate', str(int(vbps * 2.2)), '-bufsize', str(int(vbps * 4)), '-g', '60']
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', src, *v, '-pass', '1', '-passlogfile', log, '-an', '-f', 'mp4', os.devnull])
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', src, *v, '-pass', '2', '-passlogfile', log, '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-movflags', '+faststart', out])
for f in os.listdir(os.path.dirname(log) or '.'):
    if f.startswith(os.path.basename(log)): os.remove(os.path.join(os.path.dirname(log), f))
size = os.path.getsize(out) / 1048576
ok = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_name,profile,width,height', '-of', 'json', out]))['streams']
ss = subprocess.run(['ffmpeg', '-i', out, '-i', src, '-lavfi', '[0:v][1:v]ssim', '-f', 'null', '-'], capture_output=True, text=True).stderr
ssim = float(re.findall(r'All:([0-9.]+)', ss)[-1]) if 'All:' in ss else 0
print(f'deliver → {out}  {size:.1f} MB  ({vbps // 1000} kb/s video)  SSIM vs master {ssim:.4f}  streams {[s["codec_name"] for s in ok]}')
if size >= 30: print('✗ over 30 MB — lower --mb'); sys.exit(1)
if ssim < .975: print('⚠ visible quality loss — reduce grain in the render or split the film')
