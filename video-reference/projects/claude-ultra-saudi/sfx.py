#!/usr/bin/env python3
"""مؤثرات صوتية مُركّبة (أصلية، بدون حقوق): whoosh / pop / click / impact / ding / error / tick.
تُستخدم من render.py عبر mix_sfx(events, duration, out_wav)."""
import numpy as np, wave

SR = 44100
rng = np.random.default_rng(7)


def env(n, a=0.005, r=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    if r: e *= np.exp(-t / r)
    return e


def bandnoise(n, lo, hi):
    X = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n)
    return y / (np.abs(y).max() + 1e-9)


def whoosh(d=0.38):
    n = int(d * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    # كنس ترددي: ضوضاء مفلترة تتحرك من منخفض لعالي
    for k, (lo, hi) in enumerate([(300, 900), (700, 2000), (1500, 4000), (3000, 8000)]):
        seg = bandnoise(n, lo, hi)
        c = (k + 0.5) / 4
        y += seg * np.exp(-((t / d - c) ** 2) / 0.02)
    y *= np.sin(np.pi * t / d) ** 1.5
    return 0.55 * y / (np.abs(y).max() + 1e-9)


def pop(f0=900, d=0.09):
    n = int(d * SR); t = np.arange(n) / SR
    f = f0 * (1 + 1.2 * np.exp(-t / 0.012))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.03)
    return 0.6 * y


def click(d=0.03):
    n = int(d * SR)
    y = bandnoise(n, 2000, 9000) * env(n, 0.0005, 0.004)
    y += 0.5 * np.sin(2 * np.pi * 2400 * np.arange(n) / SR) * env(n, 0.0005, 0.006)
    return 0.5 * y


def tick(d=0.02):
    n = int(d * SR)
    return 0.18 * bandnoise(n, 3000, 10000) * env(n, 0.0005, 0.003)


def impact(d=0.7):
    n = int(d * SR); t = np.arange(n) / SR
    f = 55 + 90 * np.exp(-t / 0.05)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.22)
    crack = bandnoise(n, 800, 7000) * env(n, 0.001, 0.035)
    return 0.85 * boom + 0.35 * crack


def ding(d=1.0):
    n = int(d * SR); t = np.arange(n) / SR
    y = sum(a * np.sin(2 * np.pi * f * t) for f, a in [(1318.5, 1), (1975.5, .5), (2637, .25)])
    return 0.28 * y * env(n, 0.002, 0.28)


def error(d=0.22):
    n = int(d * SR); t = np.arange(n) / SR
    y = np.sign(np.sin(2 * np.pi * 170 * t)) * 0.5 + np.sign(np.sin(2 * np.pi * 120 * t)) * 0.5
    X = np.fft.rfft(y); fr = np.fft.rfftfreq(n, 1 / SR); X[fr > 2500] = 0
    y = np.fft.irfft(X, n)
    return 0.22 * y * env(n, 0.004) * (t < d * 0.85)


def swish_up(d=0.5):  # رايزر قصير قبل الـ CTA
    n = int(d * SR); t = np.arange(n) / SR
    y = bandnoise(n, 2000, 9000) * (t / d) ** 2
    return 0.35 * y * (1 - np.exp(-(d - t) / 0.01))


BANK = {"whoosh": whoosh, "pop": pop, "pop_hi": lambda: pop(1400, 0.07), "click": click, "tick": tick,
        "impact": impact, "ding": ding, "error": error, "riser": swish_up}


def mix_sfx(events, duration, out, gain=0.55):
    """events: [(time, name, vol)]"""
    N = int(duration * SR) + SR
    buf = np.zeros(N)
    cache = {}
    for t0, name, vol in events:
        if name not in cache: cache[name] = BANK[name]()
        s = cache[name]; i = int(max(t0, 0) * SR)
        j = min(N, i + len(s)); buf[i:j] += vol * s[: j - i]
    buf = buf[: int(duration * SR)] * gain
    buf = np.tanh(buf * 1.2) / 1.2
    with wave.open(out, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
