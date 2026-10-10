"""art/*.jpg|png → 가벼운 WebP (폰 9:16 풀스크린 기준). 사용: python3 tools/to_webp.py
 - 배경·전신·활동 그림: 가로 600px(9:16) / 표정 얼굴(face_*): 240×360 / 가로형(bg_alley 등): 가로 800px
 - 변환 후 원본(jpg/png)은 지운다. 새 그림은 art/에 jpg 또는 png로 넣고 이 스크립트를 돌리면 된다."""
import os, sys
from PIL import Image
D = os.path.join(os.path.dirname(__file__), '..', 'art')
before = after = 0
for f in sorted(os.listdir(D)):
    n, ext = os.path.splitext(f)
    if ext.lower() not in ('.jpg', '.jpeg', '.png'): continue
    p = os.path.join(D, f); before += os.path.getsize(p)
    im = Image.open(p).convert('RGB'); w, h = im.size
    if n.startswith('face_'): size, q = (240, 360), 78
    elif w > h: size, q = (800, round(800 * h / w)), 76
    else: size, q = (600, round(600 * h / w)), 75
    im.resize(size, Image.LANCZOS).save(os.path.join(D, n + '.webp'), 'WEBP', quality=q, method=6)
    os.remove(p); after += os.path.getsize(os.path.join(D, n + '.webp'))
print('converted: %.1fMB → %.1fMB' % (before / 1e6, after / 1e6))
