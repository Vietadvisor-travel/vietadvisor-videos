#!/usr/bin/env python3
"""Import the public-domain test photos used by examples/*.story (ids t_*), from scikit-image's bundled data.
  pip install scikit-image && python3 tools/pp_testimages.py
Real episodes never use these — they exist so smoke tests and demos show real photographs instead of PHOTO NEEDED cards."""
import os, subprocess, sys
try:
    import skimage
except ImportError:
    sys.exit('pip install scikit-image first')
D = os.path.join(os.path.dirname(skimage.__file__), 'data'); HERE = os.path.dirname(os.path.abspath(__file__))
for f, i, r in [('astronaut.png', 't_astro', 'cut'), ('camera.png', 't_cameraman', 'cut'), ('coffee.png', 't_coffee', 'prop'), ('rocket.jpg', 't_rocket', 'plate'), ('page.png', 't_page', 'prop'),
                ('hubble_deep_field.jpg', 't_space', 'plate'), ('motorcycle_left.png', 't_garage', 'plate'), ('coins.png', 't_coins', 'prop'), ('chelsea.png', 't_cat', 'cut')]:
    subprocess.run([sys.executable, os.path.join(HERE, 'pp_img.py'), 'add', os.path.join(D, f), i, '--role', r], check=False)
subprocess.run([sys.executable, os.path.join(HERE, 'pp_img.py'), 'sync'], check=False)
