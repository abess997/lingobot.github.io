#!/usr/bin/env python3
"""يضغط الوقفات الطويلة في التعليق الصوتي ويسرّعه قليلاً.
python3 process_vo.py in.mp3 out.wav [--tempo 1.08] [--max-gap 0.16]"""
import argparse, subprocess, re, wave
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--tempo", type=float, default=1.08)
ap.add_argument("--max-gap", type=float, default=0.16)
ap.add_argument("--sentence-gap", type=float, default=0.24)
a = ap.parse_args()
SR = 44100
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", a.inp, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                     capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", a.inp, "-af", "silencedetect=noise=-35dB:d=0.12", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
st = [float(v) for v in re.findall(r"silence_start: ([0-9.]+)", log)]
en = [float(v) for v in re.findall(r"silence_end: ([0-9.]+)", log)]
dur = len(x) / SR
segs, cur = [], 0.0
for s, e in zip(st, en + [dur] * (len(st) - len(en))):
    gap = e - s
    keep = a.sentence_gap if gap > 0.3 else min(gap, a.max_gap)
    if s <= 0.01:      # صمت البداية
        cur = max(e - 0.05, 0); continue
    segs.append((cur, s + keep / 2)); cur = e - keep / 2
segs.append((cur, dur))
# قصّ صمت النهاية
y = np.concatenate([x[int(s * SR):int(e * SR)] for s, e in segs if e > s])
tmp = a.out + ".tmp.wav"
with wave.open(tmp, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af",
                f"atempo={a.tempo},highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,"
                "loudnorm=I=-15:TP=-1.5:LRA=7", "-ar", str(SR), a.out], check=True)
import os; os.remove(tmp)
d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.out],
                         capture_output=True, text=True).stdout)
print(f"{dur:.2f}s -> {d:.2f}s")
