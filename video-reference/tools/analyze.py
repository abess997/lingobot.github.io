#!/usr/bin/env python3
"""تحليل مقطع مرجعي: الأبعاد، الإيقاع (نقاط القطع)، الصوت، ولوحات صور للمعاينة.

الاستخدام:
    python3 tools/analyze.py inbox/reel.mp4 --slug my-ref [--threshold 0.3]
    python3 tools/analyze.py --url "https://www.instagram.com/reel/..." --slug my-ref
    python3 tools/analyze.py inbox/reel.mp4 --slug my-ref --transcribe [--language ar]

يكتب في references/<slug>/:
    analysis.json, breakdown.md (إن لم يوجد), contact_shots.jpg, contact_timeline.jpg
    ومع --transcribe: words.json (جاهز لـ captions.py --words) + transcript.srt + transcript.txt
مع --url: ينزّل المقطع إلى inbox/<slug>.mp4 أولاً (يحتاج yt-dlp).
يحتاج: ffmpeg, ffprobe, Pillow — واختيارياً yt-dlp و openai-whisper (انظر requirements.txt)
"""
import argparse
import datetime as dt
import json
import math
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
THUMB_W = 270


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def probe(path):
    r = run(["ffprobe", "-v", "error", "-print_format", "json",
             "-show_format", "-show_streams", str(path)])
    if r.returncode != 0:
        sys.exit(f"ffprobe فشل: {r.stderr.strip()}")
    data = json.loads(r.stdout)
    v = next((s for s in data["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in data["streams"] if s["codec_type"] == "audio"), None)
    if v is None:
        sys.exit("لا يوجد مسار فيديو في الملف")
    num, den = (v.get("avg_frame_rate") or "0/1").split("/")
    fps = float(num) / float(den) if float(den) else 0.0
    w, h = int(v["width"]), int(v["height"])
    # احترام التدوير (فيديوهات الجوال)
    rot = 0
    for sd in v.get("side_data_list", []) or []:
        if "rotation" in sd:
            rot = int(sd["rotation"])
    if abs(rot) in (90, 270):
        w, h = h, w
    g = math.gcd(w, h)
    return {
        "duration": round(float(data["format"]["duration"]), 3),
        "width": w, "height": h,
        "aspect": f"{w // g}:{h // g}",
        "orientation": "vertical" if h > w else ("square" if h == w else "horizontal"),
        "fps": round(fps, 2),
        "video_codec": v.get("codec_name"),
        "has_audio": a is not None,
        "bitrate_kbps": round(int(data["format"].get("bit_rate", 0)) / 1000),
    }


def detect_cuts(path, threshold):
    r = run(["ffmpeg", "-hide_banner", "-i", str(path), "-an",
             "-vf", f"select='gt(scene,{threshold})',showinfo", "-f", "null", "-"])
    times = [float(m) for m in re.findall(r"pts_time:([\d.]+)", r.stderr)]
    # دمج القطعات الأقرب من 0.15ث (فلاش / وميض)
    cuts = []
    for t in times:
        if not cuts or t - cuts[-1] > 0.15:
            cuts.append(round(t, 3))
    return cuts


def loudness(path):
    r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-vn",
             "-af", "ebur128=framelog=quiet", "-f", "null", "-"])
    out = {}
    m = re.search(r"Integrated loudness:\s*I:\s*(-?[\d.]+) LUFS", r.stderr)
    if m:
        out["integrated_lufs"] = float(m.group(1))
    m = re.search(r"Loudness range:\s*LRA:\s*([\d.]+) LU", r.stderr)
    if m:
        out["lra_lu"] = float(m.group(1))
    return out


def download(url, slug):
    """تنزيل مقطع من رابط إلى inbox/<slug>.mp4 عبر yt-dlp. يرجع (المسار، معلومات المقطع)."""
    if not shutil.which("yt-dlp"):
        sys.exit("yt-dlp غير مثبت: pip install -r requirements.txt")
    inbox = ROOT / "inbox"
    inbox.mkdir(exist_ok=True)
    for old in inbox.glob(f"{slug}.*"):
        old.unlink()
    print(f"→ تنزيل {url} ...")
    r = run(["yt-dlp", "--no-playlist", "--write-info-json",
             "-f", "bv*+ba/b", "--merge-output-format", "mp4",
             "-o", str(inbox / f"{slug}.%(ext)s"), "--", url])
    if r.returncode != 0:
        sys.exit(f"yt-dlp فشل: {r.stderr.strip()[-500:]}")
    vids = [f for f in inbox.glob(f"{slug}.*") if f.suffix in (".mp4", ".mkv", ".webm", ".mov")]
    if not vids:
        sys.exit("لم يُعثر على الفيديو بعد التنزيل")
    info = {}
    info_file = inbox / f"{slug}.info.json"
    if info_file.exists():
        raw = json.loads(info_file.read_text(encoding="utf-8"))
        info = {k: raw.get(k) for k in ("title", "uploader", "webpage_url", "upload_date",
                                         "view_count", "like_count", "description")}
        info_file.unlink()
    return vids[0], info


def srt_time(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def transcribe(path, out, model_name, language):
    """تفريغ نصي بـ Whisper مع توقيت كل كلمة → words.json + transcript.srt + transcript.txt"""
    try:
        import whisper
    except ImportError:
        sys.exit("Whisper غير مثبت: pip install -r requirements.txt")
    print(f"→ تفريغ نصي بـ Whisper ({model_name}) ... (أول مرة ينزّل النموذج)")
    model = whisper.load_model(model_name)
    res = model.transcribe(str(path), language=language or None,
                           word_timestamps=True, fp16=False)
    words, srt = [], []
    for i, seg in enumerate(res.get("segments", []), 1):
        for w in seg.get("words", []):
            text = w["word"].strip()
            if text:
                words.append({"text": text, "start": round(w["start"], 2), "end": round(w["end"], 2)})
        srt += [str(i), f"{srt_time(seg['start'])} --> {srt_time(seg['end'])}", seg["text"].strip(), ""]
    (out / "words.json").write_text(json.dumps(words, ensure_ascii=False, indent=1), encoding="utf-8")
    (out / "transcript.srt").write_text("\n".join(srt), encoding="utf-8")
    (out / "transcript.txt").write_text(res.get("text", "").strip() + "\n", encoding="utf-8")
    return {"model": model_name, "language": res.get("language"), "word_count": len(words)}


def pacing_label(avg):
    if avg < 1.0:
        return "سريع جداً (أقل من ثانية للقطة)"
    if avg < 2.0:
        return "سريع (1–2 ثانية)"
    if avg < 4.0:
        return "متوسط (2–4 ثواني)"
    return "هادئ / لقطة طويلة (أكثر من 4 ثواني)"


def grab_frame(path, t, dest):
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{t:.3f}",
         "-i", str(path), "-frames:v", "1", "-vf", f"scale={THUMB_W}:-2", str(dest)])
    return dest.exists()


def contact_sheet(path, times, dest, cols=6):
    font = ImageFont.load_default()
    with tempfile.TemporaryDirectory() as td:
        frames = []
        for i, t in enumerate(times):
            f = Path(td) / f"f{i:03d}.jpg"
            if grab_frame(path, t, f):
                frames.append((t, Image.open(f).convert("RGB")))
        if not frames:
            return False
        fw, fh = frames[0][1].size
        cols = min(cols, len(frames))
        rows = math.ceil(len(frames) / cols)
        sheet = Image.new("RGB", (cols * fw, rows * fh), "black")
        d = ImageDraw.Draw(sheet)
        for i, (t, im) in enumerate(frames):
            x, y = (i % cols) * fw, (i // cols) * fh
            sheet.paste(im.resize((fw, fh)), (x, y))
            label = f"#{i + 1}  {t:.2f}s"
            d.rectangle([x, y, x + 90, y + 14], fill="black")
            d.text((x + 3, y + 2), label, fill="yellow", font=font)
        sheet.save(dest, quality=85)
        return True


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video", nargs="?", help="مسار المقطع (أو استخدم --url)")
    ap.add_argument("--url", help="رابط ريلز/تيك توك/يوتيوب: ينزّله إلى inbox/ ثم يحلله")
    ap.add_argument("--slug", help="اسم مجلد المرجع (افتراضي: اسم الملف؛ مطلوب مع --url)")
    ap.add_argument("--threshold", type=float, default=0.3, help="حساسية كشف القطع 0–1 (أقل = أحسّ)")
    ap.add_argument("--source", default="", help="رابط أو وصف المصدر")
    ap.add_argument("--max-shots", type=int, default=36)
    ap.add_argument("--transcribe", action="store_true", help="تفريغ نصي بـ Whisper مع توقيت كل كلمة")
    ap.add_argument("--whisper-model", default="small",
                    choices=["tiny", "base", "small", "medium", "large", "turbo"],
                    help="نموذج Whisper (افتراضي small؛ turbo/large أدق للعربي وأبطأ وأكبر)")
    ap.add_argument("--language", default="", help="لغة الكلام مثل ar أو en (فارغ = كشف تلقائي)")
    args = ap.parse_args()

    if bool(args.video) == bool(args.url):
        ap.error("أعطِ مسار مقطع أو --url (واحد منهما فقط)")
    if args.url and not args.slug:
        ap.error("--slug مطلوب مع --url")
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            sys.exit(f"{tool} غير مثبت")
    slug = re.sub(r"[^\w\-]+", "-", args.slug or Path(args.video).stem).strip("-").lower() or "ref"
    info = {}
    if args.url:
        src, info = download(args.url, slug)
        args.source = args.source or args.url
    else:
        src = Path(args.video)
    if not src.exists():
        sys.exit(f"الملف غير موجود: {src}")
    out = ROOT / "references" / slug
    out.mkdir(parents=True, exist_ok=True)

    print(f"→ تحليل {src.name} ...")
    meta = probe(src)
    dur = meta["duration"]
    cuts = detect_cuts(src, args.threshold)
    bounds = [0.0] + [c for c in cuts if 0 < c < dur] + [dur]
    shots = [{"start": round(a, 3), "end": round(b, 3), "length": round(b - a, 3)}
             for a, b in zip(bounds, bounds[1:]) if b - a > 0.04]
    lengths = [s["length"] for s in shots]
    avg = sum(lengths) / len(lengths)
    srt = sorted(lengths)
    pacing = {
        "shot_count": len(shots),
        "cuts_per_minute": round(len(cuts) / dur * 60, 1) if dur else 0,
        "avg_shot_sec": round(avg, 2),
        "median_shot_sec": round(srt[len(srt) // 2], 2),
        "shortest_shot_sec": round(srt[0], 2),
        "longest_shot_sec": round(srt[-1], 2),
        "first_cut_sec": cuts[0] if cuts else None,
        "label": pacing_label(avg),
    }
    audio = loudness(src) if meta["has_audio"] else {}
    transcript = None
    if args.transcribe:
        if meta["has_audio"]:
            transcript = transcribe(src, out, args.whisper_model, args.language)
        else:
            print("⚠ لا يوجد صوت — تخطّي التفريغ النصي")

    # لوحة اللقطات: منتصف كل لقطة (بحد أقصى max-shots)
    picked = shots if len(shots) <= args.max_shots else \
        [shots[round(i * (len(shots) - 1) / (args.max_shots - 1))] for i in range(args.max_shots)]
    contact_sheet(src, [(s["start"] + s["end"]) / 2 for s in picked], out / "contact_shots.jpg")
    # لوحة زمنية: 12 لقطة موزعة بالتساوي (مفيدة لقراءة الكابشن)
    n = 12
    contact_sheet(src, [dur * (i + 0.5) / n for i in range(n)], out / "contact_timeline.jpg")

    analysis = {
        "slug": slug, "file": src.name, "source": args.source,
        "analyzed_at": dt.date.today().isoformat(),
        "scene_threshold": args.threshold,
        "meta": meta, "pacing": pacing, "audio": audio,
        "cuts": cuts, "shots": shots,
    }
    if info:
        analysis["source_info"] = info
    if transcript:
        analysis["transcript"] = transcript
    (out / "analysis.json").write_text(json.dumps(analysis, ensure_ascii=False, indent=2), encoding="utf-8")

    metrics = "\n".join([
        f"- المدة: **{dur:.1f}ث** · {meta['width']}×{meta['height']} ({meta['aspect']}, {meta['orientation']}) · {meta['fps']} fps",
        f"- اللقطات: **{pacing['shot_count']}** · قطعات/دقيقة: **{pacing['cuts_per_minute']}**",
        f"- متوسط اللقطة: **{pacing['avg_shot_sec']}ث** (الوسيط {pacing['median_shot_sec']}ث، الأقصر {pacing['shortest_shot_sec']}ث، الأطول {pacing['longest_shot_sec']}ث)",
        f"- الإيقاع: **{pacing['label']}** · أول قطع عند: {pacing['first_cut_sec']}ث",
        f"- الصوت: {audio.get('integrated_lufs', '—')} LUFS (المدى {audio.get('lra_lu', '—')} LU)" if meta["has_audio"] else "- الصوت: لا يوجد",
    ])
    bd = out / "breakdown.md"
    if not bd.exists():
        tpl = (ROOT / "references" / "_TEMPLATE" / "breakdown.md").read_text(encoding="utf-8")
        bd.write_text(tpl.replace("{{slug}}", slug).replace("{{source}}", args.source or src.name)
                      .replace("{{date}}", analysis["analyzed_at"]).replace("{{metrics}}", metrics)
                      .replace("{{preset}}", "—"), encoding="utf-8")

    print(metrics)
    if transcript:
        print(f"- التفريغ: {transcript['word_count']} كلمة ({transcript['language']}) → words.json")
    print(f"✓ النتائج في {out.relative_to(ROOT)}/  — افتح contact_shots.jpg و contact_timeline.jpg")


if __name__ == "__main__":
    main()
