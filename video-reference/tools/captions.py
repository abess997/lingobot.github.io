#!/usr/bin/env python3
"""توليد كابشن متحرك (ASS) من توقيت الكلمات حسب preset من styles/caption-presets.json.

المدخلات (واحد منها):
    --words words.json        [{"text": "...", "start": 0.0, "end": 0.4}, ...]
    --srt subs.srt            يوزع كلمات كل سطر على مدته بالتساوي
    --text "..." --start 0 --end 5   توزيع متساوٍ (تجربة سريعة)

أمثلة:
    python3 tools/captions.py --words w.json --preset bold-pop --out projects/x/captions.ass
    ffmpeg -i in.mp4 -vf "ass=projects/x/captions.ass" -c:a copy outputs/x.mp4
    python3 tools/captions.py --list
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRESETS = ROOT / "styles" / "caption-presets.json"
ARABIC = re.compile(r"[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]")


def ass_color(hex_rgb, alpha=0):
    h = hex_rgb.lstrip("#")
    r, g, b = h[0:2], h[2:4], h[4:6]
    return f"&H{alpha:02X}{b}{g}{r}".upper()


def ass_time(t):
    t = max(0.0, t)
    cs = int(round(t * 100))
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


def esc(text):
    return text.replace("\\", "\\\\").replace("{", "(").replace("}", ")")


def spread(text, start, end):
    words = text.split()
    if not words:
        return []
    step = (end - start) / len(words)
    return [{"text": w, "start": start + i * step, "end": start + (i + 1) * step}
            for i, w in enumerate(words)]


def parse_srt(path):
    blocks = re.split(r"\n\s*\n", Path(path).read_text(encoding="utf-8-sig").strip())
    words = []
    tc = re.compile(r"(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)")
    for b in blocks:
        lines = b.strip().splitlines()
        for i, ln in enumerate(lines):
            m = tc.search(ln)
            if m:
                g = list(map(int, m.groups()))
                s = g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000
                e = g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000
                words += spread(" ".join(lines[i + 1:]), s, e)
                break
    return words


def chunk(words, n):
    """تجميع الكلمات في مجموعات بحد أقصى n، مع كسر المجموعة عند توقف > 0.6ث أو نهاية جملة."""
    groups, cur = [], []
    for w in words:
        if cur and (len(cur) >= n or w["start"] - cur[-1]["end"] > 0.6
                    or re.search(r"[.!?؟،,]$", cur[-1]["text"])):
            groups.append(cur)
            cur = []
        cur.append(w)
    if cur:
        groups.append(cur)
    return groups


def build(words, p, res):
    W, H = res
    up = (lambda s: s.upper()) if p.get("uppercase") else (lambda s: s)
    bold = -1 if p.get("bold") else 0
    border_style = 3 if p.get("box") else 1
    back = ass_color(p.get("back_color", "#000000"), p.get("back_alpha", 0))
    outline_c = back if p.get("box") else ass_color(p["outline_color"])
    hl = ass_color(p["highlight"])
    prim = ass_color(p["primary"])
    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,{p['font']},{p['size']},{prim},{hl},{outline_c},{back},{bold},0,0,0,100,100,0,0,{border_style},{p['outline']},{p['shadow']},{p['alignment']},90,90,{p['margin_v']},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    pop_in = r"{\fscx70\fscy70\t(0,90,\fscx112\fscy112)\t(90,160,\fscx100\fscy100)}"
    events = []
    mode = p["mode"]
    for g in chunk(words, p.get("max_words", 3) if mode != "word" else 1):
        g_end = g[-1]["end"]
        rtl = any(ARABIC.search(w["text"]) for w in g)
        if mode == "line":
            text = " ".join(esc(up(w["text"])) for w in g)
            events.append((g[0]["start"], g_end, r"{\fad(80,60)}" + text))
            continue
        if mode == "word":
            w = g[0]
            events.append((w["start"], w["end"], (pop_in if p.get("pop") else "") + esc(up(w["text"]))))
            continue
        # highlight: حدث لكل كلمة يعرض المجموعة كاملة والكلمة الحالية مميزة
        for i, cw in enumerate(g):
            s = cw["start"]
            e = g[i + 1]["start"] if i + 1 < len(g) else g_end
            parts = []
            for j, w in enumerate(g):
                t = esc(up(w["text"]))
                if j == i:
                    anim = r"\fscx100\fscy100\t(0,70,\fscx118\fscy118)\t(70,150,\fscx108\fscy108)" if p.get("pop") else ""
                    parts.append(f"{{\\c{hl}{anim}}}{t}{{\\r}}")
                else:
                    parts.append(t)
            prefix = r"{\fad(60,0)}" if i == 0 else ""
            if rtl:
                # وسوم الألوان تقسم السطر إلى أجزاء، و libass يرصّ الأجزاء من اليسار لليمين
                # → نعكس ترتيب الكلمات يدوياً ونمنع الالتفاف (\q2) حتى يُقرأ العربي صحيحاً.
                parts.reverse()
                prefix += r"{\q2}"
            events.append((s, e, prefix + " ".join(parts)))
    lines = [f"Dialogue: 0,{ass_time(s)},{ass_time(e)},Cap,,0,0,0,,{t}" for s, e, t in events]
    return header + "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    src = ap.add_mutually_exclusive_group()
    src.add_argument("--words")
    src.add_argument("--srt")
    src.add_argument("--text")
    ap.add_argument("--start", type=float, default=0.0)
    ap.add_argument("--end", type=float)
    ap.add_argument("--preset", default="bold-pop")
    ap.add_argument("--res", default="1080x1920")
    ap.add_argument("--out", default="captions.ass")
    ap.add_argument("--list", action="store_true", help="عرض الأنماط المتاحة")
    a = ap.parse_args()

    presets = json.loads(PRESETS.read_text(encoding="utf-8"))
    presets.pop("_doc", None)
    if a.list:
        for k, v in presets.items():
            print(f"{k:16} {v.get('description', '')}")
        return
    if a.preset not in presets:
        sys.exit(f"preset غير موجود: {a.preset}. المتاح: {', '.join(presets)}")
    p = presets[a.preset]

    if a.words:
        words = json.loads(Path(a.words).read_text(encoding="utf-8"))
    elif a.srt:
        words = parse_srt(a.srt)
    elif a.text:
        if a.end is None:
            sys.exit("--text يحتاج --end")
        words = spread(a.text, a.start, a.end)
    else:
        sys.exit("أعطِ --words أو --srt أو --text")
    if not words:
        sys.exit("لا توجد كلمات")
    if any(ARABIC.search(w["text"]) for w in words) and p.get("uppercase"):
        p = {**p, "uppercase": False}

    W, H = map(int, a.res.lower().split("x"))
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    Path(a.out).write_text(build(words, p, (W, H)), encoding="utf-8")
    print(f"✓ {a.out}  ({len(words)} كلمة، preset={a.preset})")


if __name__ == "__main__":
    main()
