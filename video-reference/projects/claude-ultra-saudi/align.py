#!/usr/bin/env python3
"""يحاذي كلمات السكربت مع توقيتات whisper (حتى لو اختلف الإملاء) عبر محاذاة الحروف.
python3 align.py script.txt whisper_words.json out_words.json"""
import json, re, sys, difflib

def norm(s):
    s = re.sub(r"[ً-ْـ]", "", s)          # تشكيل وتطويل
    s = re.sub(r"[إأآا]", "ا", s).replace("ة", "ه").replace("ى", "ي")
    return re.sub(r"[^؀-ۿa-zA-Z0-9]", "", s)

script = open(sys.argv[1], encoding="utf-8").read().split()
ww = json.load(open(sys.argv[2], encoding="utf-8"))
wc, wt = [], []
for w in ww:
    n = norm(w["text"]) or "_"
    for i, c in enumerate(n):
        wc.append(c); wt.append(w["start"] + (w["end"] - w["start"]) * (i + 0.5) / len(n))
sc, owner = [], []
for k, tok in enumerate(script):
    for c in norm(tok):
        sc.append(c); owner.append(k)
m = [None] * len(sc)
for op, a0, a1, b0, b1 in difflib.SequenceMatcher(None, sc, wc, autojunk=False).get_opcodes():
    for i in range(a0, a1):
        if op == "equal":
            m[i] = b0 + (i - a0)
        elif b1 > b0:
            m[i] = b0 + int((i - a0) * (b1 - b0) / max(1, a1 - a0))
# حروف بدون مقابل: استيفاء من الجيران
times = [wt[j] if j is not None else None for j in m]
for i in range(len(times)):
    if times[i] is None:
        prev = next((times[j] for j in range(i - 1, -1, -1) if times[j] is not None), 0.0)
        nxt = next((times[j] for j in range(i + 1, len(times)) if times[j] is not None), prev)
        times[i] = (prev + nxt) / 2
out = []
for k, tok in enumerate(script):
    ts = [times[i] for i in range(len(sc)) if owner[i] == k]
    out.append({"text": tok, "start": round(min(ts) - 0.06, 3), "end": round(max(ts) + 0.06, 3)})
for i in range(1, len(out)):              # ترتيب صارم
    out[i]["start"] = max(out[i]["start"], out[i - 1]["start"] + 0.05)
json.dump(out, open(sys.argv[3], "w", encoding="utf-8"), ensure_ascii=False, indent=0)
for o in out: print(f'{o["start"]:6.2f} {o["end"]:6.2f} {o["text"]}')
