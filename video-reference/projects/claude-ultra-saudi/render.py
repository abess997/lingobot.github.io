#!/usr/bin/env python3
"""رندر ريل «كلود ألترا ببلاش» بالسعودي — موشن جرافيك على نمط المرجع claude-ultra-workflow.

python3 render.py --vo vo.wav --words words.json --assets <fonts dir> --out out.mp4 [--preview 1.0,5.2,...]

كل شيء يُرسم بالكود (لا لقطات من الفيديو الأصلي): خلفية شبكة التصميم، نوافذ المتصفح، مقابض التحديد،
الصناديق الصفراء، كابشن كاريوكي عربي، شريط موجة الصوت، ومؤثرات صوتية مركّبة (sfx.py).
"""
import argparse, json, math, re, subprocess, wave
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

import sfx

W, H, FPS = 1080, 1920, 30
RAQM = ImageFont.Layout.RAQM

# ── الألوان (مقاسة من إطارات المرجع) ─────────────────────────────
BG_C = (208, 113, 80)      # #D07150 وسط
BG_E = (149, 63, 35)       # #953F23 أطراف
YEL = (255, 210, 63)
INK = (29, 26, 23)
CARD = (31, 29, 27)
CARD2 = (42, 40, 37)
LINE = (70, 66, 62)
WHITE = (255, 255, 255)
CREAM = (243, 201, 105)    # لون الكلمات «البراند» بالخط المزخرف
RED = (229, 72, 77)
SPARK = (217, 119, 87)
BLUE = (47, 111, 235)

ap = argparse.ArgumentParser()
ap.add_argument("--vo", required=True)
ap.add_argument("--words", required=True)
ap.add_argument("--assets", required=True)
ap.add_argument("--out", default="out.mp4")
ap.add_argument("--preview", default="")
ap.add_argument("--tail", type=float, default=0.9)
args = ap.parse_args()
A = Path(args.assets)


@lru_cache(None)
def F(name, size):
    paths = {"black": A / "Tajawal-Black.ttf", "xb": A / "Tajawal-ExtraBold.ttf", "bold": A / "Tajawal-Bold.ttf",
             "serif": A / "Amiri-Bold.ttf", "serifi": A / "Amiri-BoldItalic.ttf",
             "mono": "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf",
             "inter": None}
    p = paths[name]
    if name == "inter":
        import glob
        c = [x for x in glob.glob("/usr/share/fonts/**/Inter*SemiBold*.[ot]tf", recursive=True)] or \
            glob.glob("/usr/share/fonts/**/Inter*.[ot]tf", recursive=True)
        p = c[0]
    if name == "mono" and not Path(p).exists():
        import glob
        p = glob.glob("/usr/share/fonts/**/JetBrainsMono*.[ot]tf", recursive=True)[0]
    return ImageFont.truetype(str(p), size, layout_engine=RAQM)


def is_ar(s):
    return bool(re.search(r"[؀-ۿ]", s))


@lru_cache(4096)
def text_img(s, font, size, fill=WHITE, pad=6):
    f = F(font, size)
    kw = {"direction": "rtl", "language": "ar"} if is_ar(s) else {}
    l, t, r, b = ImageDraw.Draw(Image.new("L", (1, 1))).textbbox((0, 0), s, font=f, **kw)
    asc, desc = f.getmetrics()
    im = Image.new("RGBA", (r - l + 2 * pad, asc + desc + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((pad - l, pad), s, font=f, fill=fill, **kw)
    return im


# ── منحنيات الحركة ───────────────────────────────────────────────
def cl(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def p_of(t, t0, d):
    return cl((t - t0) / d) if d > 0 else float(t >= t0)


def e_out(p):
    return 1 - (1 - p) ** 3


def e_back(p, s=1.9):
    p -= 1
    return 1 + (s + 1) * p ** 3 + s * p ** 2


def e_io(p):
    return 3 * p * p - 2 * p ** 3


# ── أدوات الرسم ──────────────────────────────────────────────────
def paste(dst, im, cx, cy, scale=1.0, alpha=1.0, rot=0.0, blur=0):
    if alpha <= 0.01 or scale <= 0.01:
        return
    if scale != 1.0:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.BICUBIC)
    if rot:
        im = im.rotate(rot, Image.BICUBIC, expand=True)
    if blur:
        im = im.filter(ImageFilter.GaussianBlur(blur))
    if alpha < 1:
        a = im.getchannel("A").point(lambda v: int(v * alpha))
        im = im.copy(); im.putalpha(a)
    dst.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))


def rrect(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, r, fill=fill, outline=outline, width=width)


def handles(d, box, col=WHITE, alpha=255):
    """مقابض التحديد على طريقة برامج التصميم (دوائر في الزوايا وكبسولات في المنتصف)."""
    x0, y0, x1, y1 = box
    c = col + (alpha,)
    d.rectangle(box, outline=c, width=3)
    for x, y in [(x0, y0), (x1, y0), (x0, y1), (x1, y1)]:
        d.ellipse((x - 11, y - 11, x + 11, y + 11), fill=c, outline=(60, 40, 30, alpha), width=2)
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    for (x, y, hw, hh) in [(mx, y0, 22, 8), (mx, y1, 22, 8), (x0, my, 8, 22), (x1, my, 8, 22)]:
        d.rounded_rectangle((x - hw, y - hh, x + hw, y + hh), 8, fill=c, outline=(60, 40, 30, alpha), width=2)


def check(d, x, y, s, col):
    d.line([(x, y + s * .55), (x + s * .38, y + s * .9), (x + s, y + s * .1)], fill=col, width=max(3, int(s / 6)), joint="curve")


def spark_icon(size, col=SPARK, bg=None):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if bg:
        rrect(d, (0, 0, size - 1, size - 1), size // 4, fill=bg)
    c = size / 2
    rng = np.random.default_rng(3)
    for k in range(11):
        a = k * 2 * math.pi / 11 + 0.15
        L = size * (0.30 + 0.09 * rng.random())
        w = max(2, int(size * 0.075))
        d.line([(c + math.cos(a) * size * 0.05, c + math.sin(a) * size * 0.05),
                (c + math.cos(a) * L, c + math.sin(a) * L)], fill=col, width=w)
    return im


def browser(cw, ch, url):
    im = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    rrect(d, (0, 0, cw - 1, ch - 1), 18, fill=CARD, outline=(90, 86, 80), width=2)
    rrect(d, (0, 0, cw - 1, 58), 18, fill=(22, 21, 20))
    d.rectangle((0, 40, cw - 1, 58), fill=(22, 21, 20))
    for i, c in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
        d.ellipse((22 + i * 30, 20, 40 + i * 30, 38), fill=c)
    rrect(d, (150, 13, cw - 150, 45), 10, fill=(44, 42, 40))
    u = text_img(url, "inter", 22, (200, 196, 190))
    im.alpha_composite(u, (int(cw / 2 - u.width / 2), int(29 - u.height / 2)))
    return im


def bar(d, x, y, w, h=12, col=(78, 74, 70)):
    rrect(d, (x, y, x + w, y + h), h // 2, fill=col)


# ── محتوى البطاقات ────────────────────────────────────────────────
CW, CH = 940, 560


@lru_cache(None)
def pricing_card(scale=1.0, hi_ultra=True):
    """جدول الأسعار (رسم تقريبي، ليس لقطة شاشة) — Free / Pro / Max / Ultra."""
    cw, ch = int(CW * scale), int(CH * scale)
    im = browser(cw, ch, "claude.com/pricing")
    d = ImageDraw.Draw(im)
    s = scale
    cols = ["Free", "Pro", "Max", "Ultra"]
    colw = (cw - 40 * s) / 4
    for i, name in enumerate(cols):
        x0 = 20 * s + i * colw
        if name == "Ultra" and hi_ultra:
            d.rectangle((x0 + 6 * s, 72 * s, x0 + colw - 6 * s, ch - 14 * s), outline=YEL, width=max(2, int(3 * s)))
        spark = spark_icon(int(30 * s), (190, 186, 180))
        im.alpha_composite(spark, (int(x0 + 20 * s), int(90 * s)))
        t = text_img(name, "serif", int(40 * s), WHITE)
        im.alpha_composite(t, (int(x0 + 16 * s), int(126 * s)))
        bar(d, int(x0 + 22 * s), int(190 * s), int(colw * 0.55), int(10 * s))
        if name == "Ultra":
            p = text_img("$200", "inter", int(34 * s), WHITE)
            im.alpha_composite(p, (int(x0 + 18 * s), int(214 * s)))
        elif name == "Max":
            p = text_img("$100", "inter", int(34 * s), WHITE)
            im.alpha_composite(p, (int(x0 + 18 * s), int(214 * s)))
        else:
            bar(d, int(x0 + 22 * s), int(228 * s), int(colw * 0.3), int(22 * s), (90, 86, 82))
        bar(d, int(x0 + 22 * s), int(268 * s), int(colw * 0.35), int(8 * s), (66, 62, 58))
        rrect(d, (x0 + 20 * s, 300 * s, x0 + colw - 20 * s, 340 * s), int(8 * s), fill=(236, 234, 230))
        for k in range(5):
            bar(d, int(x0 + 22 * s), int((370 + k * 32) * s), int(colw * (0.75 - 0.08 * (k % 3))), int(9 * s))
    return im


@lru_cache(None)
def features_card():
    im = browser(CW, CH, "claude.com/pricing")
    d = ImageDraw.Draw(im)
    t = text_img("كل مميزات Max، وفوقها:", "xb", 40, WHITE)
    im.alpha_composite(t, (CW - 60 - t.width, 100))
    rows = ["بدون حد الـ ٥ ساعات", "استخدام أسبوعي ١٠ أضعاف Pro", "رصيد API بـ 200$ كل شهر"]
    for i, r in enumerate(rows):
        y = 190 + i * 100
        t = text_img(r, "bold", 40, (235, 232, 226))
        im.alpha_composite(t, (CW - 120 - t.width, y))
        check(d, CW - 100, y + 14, 34, (120, 200, 120))
    return im


FEAT_ROW_Y = [190, 290, 390]


@lru_cache(None)
def chat_base():
    im = browser(CW, CH, "claude.ai")
    d = ImageDraw.Draw(im)
    rrect(d, (30, CH - 92, CW - 30, CH - 30), 14, fill=CARD2)
    t = text_img("رد على Claude...", "bold", 28, (130, 126, 120))
    im.alpha_composite(t, (CW - 60 - t.width, CH - 61 - t.height // 2))
    return im


def bubble(s):
    t = text_img(s, "bold", 38, WHITE)
    im = Image.new("RGBA", (t.width + 48, t.height + 22), (0, 0, 0, 0))
    rrect(ImageDraw.Draw(im), (0, 0, im.width - 1, im.height - 1), 22, fill=(60, 57, 54))
    im.alpha_composite(t, (24, 11))
    return im


CODE = [("●", "Write(src/Landing.tsx)", (232, 120, 90)), ("", "  └ Wrote 84 lines", (140, 136, 130)),
        ("●", "Update(src/Pricing.tsx)", (232, 120, 90)), ("", "  └ Added 3 plans", (140, 136, 130))]


def code_lines(d, im, chars):
    """chars: عدد الحروف الظاهرة (تأثير الكتابة)."""
    y = 96; left = chars
    for dot, txt, col in CODE:
        if left <= 0:
            break
        s = txt[:left]; left -= len(txt)
        if dot:
            d.ellipse((44, y + 14, 60, y + 30), fill=col)
        t = text_img(s, "mono", 32, (225, 222, 216) if dot else (150, 146, 140))
        im.alpha_composite(t, (74, y))
        y += 54


@lru_cache(None)
def oss_card(word_count, sub=True):
    cw, ch = 760, 440
    im = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    rrect(d, (0, 0, cw - 1, ch - 1), 30, fill=(253, 251, 248))
    sp = spark_icon(120)
    im.alpha_composite(sp, (cw // 2 - 60, 46))
    words = ["Claude", "for", "Open", "Source"][:word_count]
    if words:
        l1 = " ".join(words[:2]); l2 = " ".join(words[2:])
        t1 = text_img(l1, "serifi", 76, INK)
        im.alpha_composite(t1, (cw // 2 - t1.width // 2, 175))
        if l2:
            t2 = text_img(l2, "serifi", 76, INK)
            im.alpha_composite(t2, (cw // 2 - t2.width // 2, 262))
    if sub and word_count >= 4:
        t3 = text_img("٦ شهور من Claude Ultra", "bold", 28, (150, 140, 130))
        im.alpha_composite(t3, (cw // 2 - t3.width // 2, 368))
    return im


ELIG = [("مشرفين المشاريع:", "مشروع مشهور ونشط"),
        ("المساهمين الأساسيين:", "فريق أساسي بمشروع معروف"),
        ("المساهمين النشطين:", "طلبات دمج كثيرة بمشاريع غيرك"),
        ("بنية تحتية حساسة:", "مشروع يعتمد عليه الكثير")]
ELIG_LAST = "ما تنطبق عليك؟ إذا الناس تعتمد على شغلك، قدّم على كل حال"


@lru_cache(None)
def elig_card():
    im = browser(CW, CH - 10, "claude.com/contact-sales/claude-for-oss")
    d = ImageDraw.Draw(im)
    y = 92
    for head, body in ELIG:
        h = text_img(head, "xb", 30, WHITE)
        b = text_img(body, "bold", 30, (200, 196, 190))
        x = CW - 70
        d.ellipse((x + 18, y + 22, x + 30, y + 34), fill=(200, 196, 190))
        im.alpha_composite(h, (x - h.width, y))
        im.alpha_composite(b, (x - h.width - 10 - b.width, y))
        y += 80
    d.line((40, y + 6, CW - 40, y + 6), fill=LINE, width=2)
    t = text_img(ELIG_LAST, "xb", 28, WHITE)
    im.alpha_composite(t, (CW - 50 - t.width, y + 30))
    return im


ELIG_LAST_Y = 92 + 80 * 4 + 30


def badge(s, bg=YEL, fg=INK, size=40, font="xb"):
    t = text_img(s, font, size, fg)
    im = Image.new("RGBA", (t.width + 44, t.height + 8), (0, 0, 0, 0))
    rrect(ImageDraw.Draw(im), (0, 0, im.width - 1, im.height - 1), im.height // 2, fill=bg)
    im.alpha_composite(t, (22, 4))
    return im


def cursor_img(s=56):
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pts = [(4, 2), (4, s * .78), (s * .27, s * .6), (s * .42, s * .95), (s * .55, s * .9), (s * .41, s * .55), (s * .68, s * .55)]
    d.polygon(pts, fill=WHITE, outline=INK)
    d.line(pts + [pts[0]], fill=INK, width=3)
    return im


CURSOR = cursor_img()


# ── الخلفية ──────────────────────────────────────────────────────
def make_bg():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H * 0.38) / (H * 0.62)) ** 2)
    r = np.clip(r, 0, 1) ** 1.4
    img = np.zeros((H, W, 3), np.float32)
    for c in range(3):
        img[..., c] = BG_C[c] * (1 - r) + BG_E[c] * r
    im = Image.fromarray(img.astype(np.uint8)).convert("RGBA")
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    step = 240
    for x in range(-60, W + step, step // 4):
        d.line((x, 0, x, H), fill=(255, 255, 255, 10 if (x + 60) % step else 26), width=1 if (x + 60) % step else 2)
    for y in range(0, H, step // 4):
        d.line((0, y, W, y), fill=(255, 255, 255, 10 if y % step else 26), width=1 if y % step else 2)
    for x in range(-60, W + step, step):
        for y in range(0, H, step):
            d.line((x - 12, y, x + 12, y), fill=(255, 255, 255, 90), width=2)
            d.line((x, y - 12, x, y + 12), fill=(255, 255, 255, 90), width=2)
    for i, y in enumerate(range(step, H, step)):
        n = str((i + 1) * 5)
        for x in (6, W - 40):
            d.line((x if x < 100 else W - 14, y, (x + 10) if x < 100 else W, y), fill=(255, 255, 255, 120), width=2)
            t = text_img(n, "inter", 22, (255, 255, 255, 150))
            ov.alpha_composite(t, (24 if x < 100 else W - 34 - t.width, y - t.height // 2))
    # حبيبات خفيفة
    g = (np.random.default_rng(1).normal(0, 4, (H, W))).astype(np.int16)
    base = np.asarray(Image.alpha_composite(im, ov)).astype(np.int16)
    base[..., :3] = np.clip(base[..., :3] + g[..., None], 0, 255)
    return Image.fromarray(base.astype(np.uint8), "RGBA")


# ── التوقيت ──────────────────────────────────────────────────────
words = json.load(open(args.words, encoding="utf-8"))
SCRIPT = Path(__file__).with_name("script.txt").read_text(encoding="utf-8")
TOK = [w for w in SCRIPT.split()]
assert len(TOK) == len(words), f"script tokens {len(TOK)} != words.json {len(words)}"


def norm(s):
    return re.sub(r"[^؀-ۿA-Za-z0-9]", "", s).replace("ِ", "").replace("ّ", "")


NT = [norm(t) for t in TOK]


def wi(token, occ=1):
    n = norm(token); k = 0
    for i, x in enumerate(NT):
        if x == n:
            k += 1
            if k == occ:
                return i
    raise KeyError(token)


def T(token, occ=1):
    return words[wi(token, occ)]["start"]


def TE(token, occ=1):
    return words[wi(token, occ)]["end"]


# مجموعات الكابشن (عدد الكلمات لكل مجموعة، بالترتيب)
GROUPS = [3, 2, 3, 1, 3, 3,   3, 1, 2, 1, 2, 2, 2,   3, 3, 2, 2,   2, 2, 4, 2, 2, 2,   2, 4, 3, 4,   2, 2, 3]
assert sum(GROUPS) == len(TOK), (sum(GROUPS), len(TOK))
HILITE = {wi("ببلاش!"), wi("أعلى"), wi("استخدام"), wi("أكثر", 1), wi("بواجد،", 1), wi("أكثر", 2), wi("بواجد،", 2),
          wi("أقل"), wi("بكثير."), wi("سهلة:"), wi("مو"), wi("متأكد"), wi("قدّم"), wi("الرابط.")}
BRAND = {wi("كلود", 1), wi("ألترا..."), wi("كلود", 2), wi("كلود", 3), wi("فور"), wi("أوبن"), wi("سورس،"), wi("ألترا", 2)}


def disp(tok):
    return tok.replace("...", "").replace("!", "").replace(".", "").replace(":", "")


group_of = []
starts = []
i = 0
for g in GROUPS:
    starts.append(i); group_of += [len(starts) - 1] * g; i += g

VO_DUR = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", args.vo],
                              capture_output=True, text=True).stdout)
DUR = VO_DUR + args.tail

# مشاهد
S_A = 0.0
S_B = T("هذي") - 0.12
S_C = T("رسايل") - 0.12
SX_FRAC, SY_FRAC, SW = 0.475, 0.50, 180
S_D = T("والطريقة") - 0.12
S_E2 = T("هم") - 0.10
S_F = T("اكتب") - 0.25
t_six = T("ستة")
t_free = T("ببلاش!")
t_badgeA = T("أحد")
t_click = T("باقة") + 0.15
t_200 = T("بمِيتين")
t_feat = T("وأعلى")
t_use = T("استخدام")
t_code = T("برمجة")
t_limit = T("والليمت")
t_less = T("أقل")
t_simple = T("سهلة:")
t_called = T("اسمه")
t_name = [T("كلود", 3), T("فور"), T("أوبن"), T("سورس،")]
t_forwho = T("للي")
t_notsure = T("مو")
t_apply = T("قدّم")
t_ultra = T("ألترا", 2)
t_link = T("وأرسل")
bubble_t = [T("رسايل"), T("أكثر", 1), T("بواجد،", 1)]

SFX = []


def S(t, n, v=1.0):
    SFX.append((t, n, v))


for t in (S_B, S_C, S_D, S_E2):
    S(t - 0.08, "whoosh", 0.9)
S(0.05, "pop", 0.8)
S(0.40, "pop_hi", 0.7)
S(t_six - 0.05, "whoosh", 0.6)
S(t_free - 0.02, "impact", 1.0)
S(t_badgeA, "pop", 0.8)
S(t_click, "click", 1.0)
S(t_200, "pop", 0.8)
S(t_feat - 0.05, "whoosh", 0.5)
S(t_use, "pop_hi", 0.6)
for bt in bubble_t:
    S(bt, "pop_hi", 0.7)
for k in range(16):
    S(t_code + k * 0.07, "tick", 0.8)
S(t_limit, "error", 0.9)
S(t_less, "whoosh", 0.6)
S(t_less + 0.1, "pop", 0.8)
S(t_simple, "pop", 0.8)
S(t_called, "pop_hi", 0.7)
for tn in t_name:
    S(tn, "tick", 1.2)
S(t_forwho, "pop", 0.6)
S(t_notsure, "pop", 0.7)
S(t_apply, "pop", 0.9)
S(S_F - 0.45, "riser", 0.9)
S(S_F + 0.1, "impact", 0.8)
S(t_ultra, "ding", 1.0)
S(t_ultra + 0.25, "click", 0.9)


# ── شريط الموجة الصوتية (بدل وجه المقدم) ─────────────────────────
def load_env():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", args.vo, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                         capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    hop = 16000 // FPS
    n = len(x) // hop
    rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
    return rms / (rms.max() + 1e-9)


ENV = load_env()


def draw_wave(fr, t, d):
    i = int(t * FPS)
    cx, cy = W // 2, 1440
    nb = 23
    for k in range(nb):
        j = i - abs(k - nb // 2) // 2
        v = ENV[j] if 0 <= j < len(ENV) else 0
        h = 10 + 95 * v * (0.55 + 0.45 * math.cos((k - nb // 2) / nb * math.pi))
        x = cx + (k - nb // 2) * 26
        rrect(d, (x - 8, cy - h / 2, x + 8, cy + h / 2), 8, fill=(255, 255, 255, 215 if k != nb // 2 else 255))


# ── الكابشن ──────────────────────────────────────────────────────
CAP_Y = 1255
CAP_SIZE = 76


def word_img(k, active):
    s = disp(TOK[k])
    if k in BRAND:
        return text_img(s, "serif", CAP_SIZE + 10, CREAM)
    if k in HILITE:
        return text_img(s, "xb", CAP_SIZE, INK)
    return text_img(s, "xb", CAP_SIZE, WHITE)


def draw_caption(fr, t):
    cur = None
    for k, w in enumerate(words):
        if w["start"] - 0.04 <= t:
            cur = k
    if cur is None:
        return
    g = group_of[cur]
    g0 = starts[g]; g1 = g0 + GROUPS[g]
    # لا نعرض مجموعة جديدة إلا عندما يبدأ أول كلماتها
    if t > words[g1 - 1]["end"] + 0.6 and g1 < len(words) and words[g1]["start"] > t + 0.0:
        pass
    imgs = [word_img(k, True) for k in range(g0, g1)]
    gap = 18
    total = sum(im.width for im in imgs) + gap * (len(imgs) - 1)
    x = W / 2 + total / 2  # RTL: نبدأ من اليمين
    d = ImageDraw.Draw(fr)
    # صناديق التمييز (تدمج الكلمات المتتالية)
    pos = []
    for k, im in zip(range(g0, g1), imgs):
        pos.append((k, x - im.width, x, im))
        x -= im.width + gap
    runs = []
    for k, x0, x1, im in pos:
        if k in HILITE:
            if runs and runs[-1][-1][0] == k - 1:
                runs[-1].append((k, x0, x1))
            else:
                runs.append([(k, x0, x1)])
    for run in runs:
        k0 = run[0][0]
        p = e_out(p_of(t, words[k0]["start"] - 0.04, 0.14))
        if p <= 0:
            continue
        rx1 = run[0][2] + 10
        rx0 = run[-1][1] - 10
        rx0p = rx1 - (rx1 - rx0) * p
        rrect(d, (rx0p, CAP_Y - 44, rx1, CAP_Y + 46), 6, fill=YEL)
    for k, x0, x1, im in pos:
        st = words[k]["start"]
        if t < st - 0.04:
            if k in HILITE:
                continue
            a = 0.0
            paste(fr, im, (x0 + x1) / 2, CAP_Y, 1.0, a)
            continue
        p = p_of(t, st - 0.04, 0.10)
        sc = 0.85 + 0.15 * e_back(p)
        paste(fr, im, (x0 + x1) / 2, CAP_Y + (1 - p) * 10, sc, cl(p * 1.5))


# ── عناصر مشتركة ─────────────────────────────────────────────────
def headline(fr, t, t0, text, box_text=None, t_box=None, icon=False, out=None):
    p = e_out(p_of(t, t0, 0.25))
    a = p
    if out is not None:
        a *= 1 - p_of(t, out - 0.12, 0.12)
    if a <= 0:
        return
    y = 330 if box_text else 300
    ti = text_img(text, "black", 84, WHITE)
    if icon:
        ic = spark_icon(84, SPARK, WHITE)
        tw = ti.width + ic.width + 18
        x0 = W / 2 + tw / 2
        if is_ar(text):
            paste(fr, ic, x0 - ic.width / 2, y + 2 - (1 - p) * 20, 1, a)
            paste(fr, ti, x0 - ic.width - 18 - ti.width / 2, y - (1 - p) * 20, 1, a)
        else:
            paste(fr, ic, W / 2 - tw / 2 + ic.width / 2, y + 2 - (1 - p) * 20, 1, a)
            paste(fr, ti, W / 2 - tw / 2 + ic.width + 18 + ti.width / 2, y - (1 - p) * 20, 1, a)
    else:
        paste(fr, ti, W / 2, y - (1 - p) * 20, 1, a)
    if box_text:
        pb = e_out(p_of(t, t_box, 0.2))
        if pb > 0:
            bt = text_img(box_text, "black", 70, INK)
            bw, bh = bt.width + 70, bt.height + 16
            d = ImageDraw.Draw(fr)
            x1 = W / 2 + bw / 2; x0 = x1 - bw * pb
            yb = y + 70
            al = int(255 * a)
            d.rectangle((x0, yb, x1, yb + bh), fill=YEL + (al,))
            # دبوس الملاحظة (مثل المرجع)
            d.line((x1 - 6, yb, x1 - 6, yb - 30), fill=YEL + (al,), width=3)
            d.ellipse((x1 - 15, yb - 42, x1 + 3, yb - 24), fill=YEL + (al,), outline=WHITE + (al,), width=3)
            d.line((x0 + 6, yb + bh, x0 + 6, yb + bh + 34), fill=YEL + (al,), width=3)
            d.ellipse((x0 - 3, yb + bh + 28, x0 + 15, yb + bh + 46), fill=YEL + (al,), outline=WHITE + (al,), width=3)
            if pb > 0.5:
                paste(fr, bt, W / 2, yb + bh / 2, 1, a * (pb - 0.5) * 2)


def card_in(t, t0, t_out=None):
    p = p_of(t, t0, 0.32)
    sc = 0.86 + 0.14 * e_back(p, 1.4)
    a = cl(p * 2.5)
    dy = (1 - e_out(p)) * 70
    blur = 0
    if t_out is not None and t > t_out - 0.16:
        q = p_of(t, t_out - 0.16, 0.16)
        a *= 1 - q; dy -= q * 90; blur = int(q * 8)
    return sc, a, dy, blur


def place_card(fr, im, cy, t, t0, t_out=None, with_handles=True, drift=True):
    sc, a, dy, blur = card_in(t, t0, t_out)
    if drift:
        sc *= 1 + 0.015 * cl((t - t0) / 3.0)
    if a <= 0:
        return None
    paste(fr, im, W / 2, cy + dy, sc, a, blur=blur)
    box = (W / 2 - im.width * sc / 2, cy + dy - im.height * sc / 2, W / 2 + im.width * sc / 2, cy + dy + im.height * sc / 2)
    if with_handles and a > 0.6:
        handles(ImageDraw.Draw(fr), box, alpha=int(255 * a))
    return box


def place_badge(fr, s, x, y, t, t0, t_out=None, **kw):
    if t < t0:
        return
    if t_out is not None and t > t_out:
        return
    b = badge(s, **kw)
    p = p_of(t, t0, 0.22)
    paste(fr, b, x, y, 0.4 + 0.6 * e_back(p, 2.2), cl(p * 3))


# ── المشاهد ──────────────────────────────────────────────────────
CARD_Y = 790


def scene_A(fr, t):
    headline(fr, t, 0.0, "كلود ألترا،", "مجاناً لمدة ٦ شهور", 0.35, out=S_B)
    if t >= S_B:
        return
    cy = CARD_Y + 20
    # زوم على عمود Ultra عند «ستة شهور» — الإطار ثابت والمحتوى يكبر
    z = e_io(p_of(t, t_six - 0.05, 0.4))
    if z <= 0:
        im = pricing_card(1.0)
    else:
        big = pricing_card(2.0)
        bw, bh = big.size
        top = 58 * 2                       # نتجاهل شريط المتصفح في النسخة الكبيرة
        bodyh = bh - top
        asp = (CH - 58) / CW
        w0, w1 = bw, bw * 0.47
        cx0, cx1 = bw / 2, bw * 0.80
        cy0, cy1 = top + bodyh / 2, top + bodyh * 0.40
        cw_ = w0 + (w1 - w0) * z; ch_ = cw_ * asp
        ccx = cx0 + (cx1 - cx0) * z; ccy = cy0 + (cy1 - cy0) * z
        ccx = min(max(ccx, cw_ / 2), bw - cw_ / 2); ccy = min(max(ccy, top + ch_ / 2), bh - ch_ / 2)
        crop = big.crop((int(ccx - cw_ / 2), int(ccy - ch_ / 2), int(ccx + cw_ / 2), int(ccy + ch_ / 2)))
        crop = crop.resize((CW, CH - 58), Image.BICUBIC)
        im = browser(CW, CH, "claude.com/pricing")
        mask = Image.new("L", (CW, CH - 58), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, -20, CW - 1, CH - 59), 18, fill=255)
        im.paste(crop, (0, 58), mask)
    box = place_card(fr, im, cy, t, 0.05, S_B)
    if box is None:
        return
    d = ImageDraw.Draw(fr)
    if z >= 1 and t >= t_free - 0.05:
        # شطب $200 + ختم $0
        bx0, by0, bx1, by1 = box
        sx = bx0 + (bx1 - bx0) * SX_FRAC
        sy = by0 + (by1 - by0) * SY_FRAC
        p = e_out(p_of(t, t_free - 0.05, 0.15))
        d.line((sx - 10, sy, sx - 10 + SW * p, sy), fill=RED, width=9)
        st = Image.new("RGBA", (260, 150), (0, 0, 0, 0))
        sd = ImageDraw.Draw(st)
        rrect(sd, (6, 6, 254, 144), 22, fill=YEL, outline=INK, width=6)
        tx = text_img("$0", "black", 110, INK)
        st.alpha_composite(tx, (130 - tx.width // 2, 75 - tx.height // 2))
        q = p_of(t, t_free, 0.25)
        paste(fr, st, bx0 + (bx1 - bx0) * 0.80, by0 + (by1 - by0) * 0.60, 2.2 - 1.2 * e_back(q, 1.2), cl(q * 3), rot=8)
    place_badge(fr, "٦ شهور × 200$ = 1,200$", W / 2, (box[3] if box else 1100) + 50, t, t_badgeA, S_B - 0.1)


def scene_B(fr, t):
    if t < S_B or t >= S_C:
        return
    headline(fr, t, S_B, "Claude Ultra", icon=True, out=S_C)
    cy = CARD_Y
    if t < t_feat:
        box = place_card(fr, pricing_card(1.0), cy, t, S_B, t_feat + 0.16)
        if box:
            # المؤشر يتحرك لزر Ultra ويضغط
            bx0, by0, bx1, by1 = box
            tx, ty = bx0 + (bx1 - bx0) * 0.86, by0 + (by1 - by0) * 0.57
            p = e_io(p_of(t, S_B + 0.15, t_click - S_B - 0.15))
            x = bx1 + 60 + (tx - bx1 - 60) * p
            y = by1 + 80 + (ty - by1 - 80) * p
            sc = 1 - 0.18 * math.sin(math.pi * p_of(t, t_click, 0.18))
            paste(fr, CURSOR, x + 20, y + 24, sc)
            place_badge(fr, "200$ بالشهر", W / 2, by1 + 50, t, t_200)
    else:
        box = place_card(fr, features_card(), cy, t, t_feat, S_C)
        if box:
            bx0, by0, bx1, by1 = box
            sc = (bx1 - bx0) / CW
            p = e_out(p_of(t, t_use, 0.25))
            if p > 0:
                ry = by0 + (FEAT_ROW_Y[1] - 14) * sc
                d = ImageDraw.Draw(fr)
                x1 = bx1 - 40 * sc; x0 = bx0 + 140 * sc
                d.rectangle((x1 - (x1 - x0) * p, ry, x1, ry + 78 * sc), outline=YEL, width=5)
            place_badge(fr, "استخدام أكثر بـ 10x", W / 2, by1 + 50, t, t_use + 0.1)


def scene_C(fr, t):
    if t < S_C or t >= S_D:
        return
    cy = CARD_Y - 60
    sc_, a, dy, blur = card_in(t, S_C, S_D)
    im = chat_base().copy()
    d = ImageDraw.Draw(im)
    if t < t_code:
        msgs = ["خطط لي أسبوع الإطلاق", "اكتب صفحة الهبوط", "والحين ١٠ إيميلات"]
        y = 90
        for k, (m, bt) in enumerate(zip(msgs, bubble_t)):
            if t >= bt - 0.03:
                b = bubble(m)
                p = p_of(t, bt - 0.03, 0.18)
                bb = b.resize((max(1, int(b.width * (0.6 + 0.4 * e_back(p)))), max(1, int(b.height * (0.6 + 0.4 * e_back(p))))))
                im.alpha_composite(bb, (CW - 40 - bb.width, y))
            y += 110
    else:
        n = int((t - t_code) / 0.022)
        code_lines(d, im, n)
        if t >= t_limit:
            p = e_out(p_of(t, t_limit, 0.18))
            y0 = 330
            rrect(d, (40, y0, CW - 40, y0 + 80), 12, fill=(70, 26, 28), outline=RED, width=3)
            msg = text_img("وصلت حد الاستخدام لـ ٥ ساعات", "xb", 36, (255, 220, 220))
            im.alpha_composite(msg, (CW - 100 - msg.width, y0 + 40 - msg.height // 2))
            d.ellipse((CW - 86, y0 + 22, CW - 50, y0 + 58), outline=(255, 120, 120), width=4)
            d.line((CW - 68, y0 + 30, CW - 68, y0 + 44), fill=(255, 120, 120), width=4)
            d.ellipse((CW - 71, y0 + 48, CW - 65, y0 + 54), fill=(255, 120, 120))
            if t >= t_less:
                q = e_out(p_of(t, t_less, 0.2))
                d.line((CW - 30, y0 + 40, CW - 30 - (CW - 60) * q, y0 + 40), fill=RED, width=6)
    box = place_card(fr, im, cy, t, S_C, S_D)
    if box and t >= t_less:
        place_badge(fr, "بدون حد الـ ٥ ساعات", W / 2, box[3] + 50, t, t_less)


def scene_D(fr, t):
    if t < S_D or t >= S_E2:
        return
    cy = CARD_Y - 30
    wc = sum(1 for tn in t_name if t >= tn - 0.03)
    box = place_card(fr, oss_card(wc), cy, t, S_D, S_E2, with_handles=False)
    if not box:
        return
    if t >= t_called and t < t_name[0] + 0.6:
        place_badge(fr, "اسمه", W / 2 - 200, box[1] - 10, t, t_called, bg=BLUE, fg=WHITE, size=32)
    yb = box[3] + 50
    if t < t_forwho:
        place_badge(fr, "نموذج تقديم واحد قصير", W / 2, yb, t, t_simple, size=34)
    elif t < t_notsure:
        place_badge(fr, "للي يشتغلون على المصادر المفتوحة", W / 2, yb, t, t_forwho, size=34)
    else:
        place_badge(fr, "مو متأكد إنك مؤهل؟", W / 2, yb, t, t_notsure, size=34)


def scene_E(fr, t):
    if t < S_E2 or t >= S_F:
        return
    headline(fr, t, S_E2, "مين يقدر يقدّم؟", icon=True, out=S_F)
    box = place_card(fr, elig_card(), CARD_Y, t, S_E2, S_F)
    if box and t >= t_apply:
        bx0, by0, bx1, by1 = box
        sc = (bx1 - bx0) / CW
        p = e_out(p_of(t, t_apply, 0.25))
        d = ImageDraw.Draw(fr)
        y0 = by0 + (ELIG_LAST_Y - 8) * sc
        d.rectangle((bx1 - 30 * sc - (bx1 - bx0 - 60 * sc) * p, y0, bx1 - 30 * sc, y0 + 64 * sc), outline=YEL, width=5)
        place_badge(fr, "قدّم على كل حال", W / 2, by1 + 50, t, t_apply + 0.1)


def scene_F(fr, t):
    if t < S_F:
        return
    p = p_of(t, S_F, 0.3)
    # «اكتب في التعليقات» + ULTRA ضخمة
    lab = badge("اكتب في التعليقات", bg=INK, fg=WHITE, size=46, font="xb")
    paste(fr, lab, W / 2, 610 - (1 - e_out(p)) * 40, 1, cl(p * 2))
    q = p_of(t, t_ultra - 0.05, 0.3)
    if q > 0:
        tx = text_img("ULTRA", "black", 190, INK)
        bw, bh = tx.width + 120, tx.height + 30
        b = Image.new("RGBA", (bw, bh), YEL + (255,))
        b.alpha_composite(tx, (bw // 2 - tx.width // 2, bh // 2 - tx.height // 2))
        sc = 1.6 - 0.6 * e_back(q, 1.6)
        paste(fr, b, W / 2, 820, sc, cl(q * 3))
        if q >= 1:
            handles(ImageDraw.Draw(fr), (W / 2 - bw / 2, 820 - bh / 2, W / 2 + bw / 2, 820 + bh / 2))
            # مؤشر يضغط
            c = p_of(t, t_ultra + 0.15, 0.35)
            paste(fr, CURSOR, W / 2 + bw / 2 - 40 + (1 - e_out(c)) * 120, 820 + bh / 2 - 10 + (1 - e_out(c)) * 120,
                  1 - 0.15 * math.sin(math.pi * p_of(t, t_ultra + 0.45, 0.18)))
    # فقاعة تعليق
    if t >= S_F + 0.1:
        r = p_of(t, S_F + 0.1, 0.25)
        bub = Image.new("RGBA", (150, 130), (0, 0, 0, 0))
        bd = ImageDraw.Draw(bub)
        rrect(bd, (4, 4, 146, 100), 30, fill=WHITE)
        bd.polygon([(40, 96), (30, 126), (74, 98)], fill=WHITE)
        for k in range(3):
            bd.ellipse((38 + k * 30, 44, 52 + k * 30, 58), fill=INK)
        paste(fr, bub, W / 2, 440, 0.4 + 0.6 * e_back(r, 2), cl(r * 3), rot=-6)


BG = make_bg()


def frame(t):
    # زوم بطيء للخلفية + نبضة عند الختم والـ CTA
    zoom = 1.0 + 0.02 * (t / DUR)
    kick = 0.018 * math.exp(-max(0, t - t_free) / 0.12) * (t >= t_free) + 0.02 * math.exp(-max(0, t - t_ultra) / 0.15) * (t >= t_ultra)
    z = zoom + kick
    bg = BG.resize((int(W * z), int(H * z)), Image.BILINEAR)
    fr = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H)).copy()
    scene_A(fr, t); scene_B(fr, t); scene_C(fr, t); scene_D(fr, t); scene_E(fr, t); scene_F(fr, t)
    d = ImageDraw.Draw(fr)
    draw_wave(fr, t, d)
    draw_caption(fr, t)
    return fr.convert("RGB")


if args.preview:
    out = Path(args.out).with_suffix("")
    for s in args.preview.split(","):
        frame(float(s)).save(f"{out}_p{float(s):05.2f}.png")
    print("previews written")
    raise SystemExit

# ── الرندر ───────────────────────────────────────────────────────
sfx_wav = str(Path(args.out).with_suffix(".sfx.wav"))
sfx.mix_sfx(SFX, DUR, sfx_wav)
silent = str(Path(args.out).with_suffix(".video.mp4"))
proc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                         "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p",
                         "-profile:v", "high", silent], stdin=subprocess.PIPE)
n = int(DUR * FPS)
for i in range(n):
    proc.stdin.write(frame(i / FPS).tobytes())
    if i % 90 == 0:
        print(f"  frame {i}/{n}", flush=True)
proc.stdin.close(); proc.wait()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", silent, "-i", args.vo, "-i", sfx_wav, "-filter_complex",
                f"[1:a]apad=whole_dur={DUR}[v];[2:a]volume=0.9[s];[v][s]amix=inputs=2:normalize=0:duration=first,"
                "loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000,alimiter=limit=0.84:level=false[a]",
                "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
                "-t", f"{DUR:.3f}", args.out], check=True)
print("done", args.out, f"{DUR:.2f}s")
