#!/usr/bin/env bash
# Build the three deliverables: bundle (b64 for the artifact), skill zip, full zip.
set -e
cd "$(dirname "$0")/.."
OUT=${1:-/mnt/user-data/outputs}; ST=$(mktemp -d); V=$ST/va-studio
mkdir -p $V/engine/library $V/tools $V/references $V/stories $V/episodes $V/fonts
cp engine/*.js $V/engine/; cp -r engine/library/* $V/engine/library/
for f in ambience.py browser.mjs build_player.mjs catalog_md.py export_assets.mjs lint.mjs make.mjs music.py prep_geo.mjs preview.mjs pron_vi.json render.mjs review.mjs sfx.py shot.mjs srt.py sticker.py voice.py pack.sh artifact_page.py; do cp tools/$f $V/tools/; done
cp -r skill/references/* $V/references/; cp skill/SKILL.md skill/README.md $V/; cp stories/*.story $V/stories/; cp episodes/_template.js episodes/camera-reel.js episodes/ha-giang-loop.js $V/episodes/
cp pkg/fonts/* $V/fonts/; cp studio.html package.json $V/; node tools/build_player.mjs $V/player.html >/dev/null
(cd $ST && zip -qr va.zip va-studio) && base64 -w0 $ST/va.zip > pub/va-studio.zip.b64.txt
# skill-only zip
S=$ST/s/vietadvisor-motion-studio; mkdir -p $S; cp skill/SKILL.md $S/; cp -r skill/references $S/; (cd $ST/s && zip -qr skill.zip vietadvisor-motion-studio); cp $ST/s/skill.zip $OUT/vietadvisor-motion-studio-skill.zip
# full zip (bundle + assets + reference sheets)
F=$ST/f/vietadvisor-motion-studio; mkdir -p $F; cp -r $V/* $F/; cp -r pkg/vietadvisor-motion-studio/assets pkg/vietadvisor-motion-studio/reference_sheets $F/; printf "node_modules/\nout/\n" > $F/.gitignore
python3 - "$F" <<'PY'
import sys,os
from PIL import Image
root=sys.argv[1]
for d,_,fs in os.walk(root):
    if '/assets' not in d and '/reference_sheets' not in d: continue
    for f in fs:
        p=os.path.join(d,f)
        if not f.lower().endswith('.png'): continue
        im=Image.open(p); m=1024 if 'reference_sheets' in d else 640
        if max(im.size)>m: im.thumbnail((m,m),Image.LANCZOS)
        if 'reference_sheets' in d: im.convert('RGB').save(p[:-4]+'.jpg',quality=82); os.remove(p)
        else: im.save(p,optimize=True)
PY
(cd $ST/f && zip -qr full.zip vietadvisor-motion-studio); cp $ST/f/full.zip $OUT/vietadvisor-motion-studio.zip
ls -la $OUT/vietadvisor-motion-studio*.zip pub/va-studio.zip.b64.txt; rm -rf $ST
