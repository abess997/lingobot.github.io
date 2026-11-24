#!/usr/bin/env python3
"""يقص وضعيات الشخصية من لوحة 3×2 بخلفية خضراء ويزيل الأخضر (chroma key + despill).
python3 extract_poses.py sheet.png out_dir"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

src, out = sys.argv[1], Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
R, G, B = im[..., 0], im[..., 1], im[..., 2]
green = G - np.maximum(R, B)                       # كم البكسل «أخضر»
alpha = np.clip((70 - green) / (70 - 25), 0, 1)    # >70 خلفية، <25 شخصية
fg = alpha > 0.5
rgb = im.copy()
spill = G > np.maximum(R, B)
rgb[..., 1] = np.where(spill, np.maximum(R, B), G)  # إزالة الانسكاب الأخضر من الحواف
rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
H, W = fg.shape
rows = [(0, H // 2), (H // 2, H)]
names = [["neutral", "talk", "point"], ["wow", "shrug", "thumbs"]]
for ri, (y0, y1) in enumerate(rows):
    colfg = fg[y0:y1].sum(0) > 2
    # نقسم عند أعرض فجوتين خاليتين
    gaps, x = [], 0
    while x < W:
        if not colfg[x]:
            s = x
            while x < W and not colfg[x]: x += 1
            if s > 0 and x < W: gaps.append((x - s, (s + x) // 2))
        x += 1
    cuts = sorted(c for _, c in sorted(gaps, reverse=True)[:2])
    bounds = [0] + cuts + [W]
    for ci in range(3):
        xa, xb = bounds[ci], bounds[ci + 1]
        cell = fg[y0:y1, xa:xb]
        ys, xs = np.where(cell)
        bx0, bx1, by0, by1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        crop = Image.fromarray(rgba[y0 + by0:y0 + by1, xa + bx0:xa + bx1], "RGBA")
        a = crop.getchannel("A").filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
        crop.putalpha(a)
        crop.save(out / f"{names[ri][ci]}.png")
        print(names[ri][ci], crop.size, "bottom_at_cell_edge:", y0 + by1 >= y1 - 3)
