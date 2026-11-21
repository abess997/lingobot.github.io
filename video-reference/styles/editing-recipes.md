# وصفات المونتاج

أوامر ffmpeg مجرّبة لأساليب الريلز الشائعة. أضف وصفة جديدة كلما ظهر أسلوب في مرجع.
كل الأمثلة على فيديو عمودي 1080×1920.

## تجهيز
```bash
# تحويل أي فيديو إلى 9:16 (قص المنتصف)
ffmpeg -i in.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -c:a copy out.mp4

# 9:16 مع خلفية ضبابية بدل القص (لفيديو أفقي)
ffmpeg -i in.mp4 -filter_complex "[0]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30[bg];[0]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" -c:a copy out.mp4
```

## القطع والإيقاع
```bash
# قص جزء (من 3.2ث لمدة 1.5ث) بدقة الإطار
ffmpeg -ss 3.2 -i in.mp4 -t 1.5 -c:v libx264 -c:a aac part.mp4

# دمج أجزاء بنفس الإعدادات
printf "file 'a.mp4'\nfile 'b.mp4'\n" > list.txt && ffmpeg -f concat -safe 0 -i list.txt -c copy out.mp4

# إزالة الصمت تلقائياً (jump cut للكلام) — يكشف فترات الصمت لتقطعها
ffmpeg -i in.mp4 -af silencedetect=noise=-35dB:d=0.35 -f null - 2>&1 | grep silence_
```

## الزوم
```bash
# زوم بطيء مستمر (Ken Burns) من 100% إلى 115%
ffmpeg -i in.mp4 -vf "scale=2160:-2,zoompan=z='min(zoom+0.0008,1.15)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30" -c:a copy out.mp4

# زوم مفاجئ (punch-in 120%) على مقطع — يُستخدم للتأكيد على كلمة
ffmpeg -i part.mp4 -vf "crop=iw/1.2:ih/1.2,scale=1080:1920" -c:a copy punch.mp4
```

## الانتقالات
```bash
# انتقال بين مقطعين (offset = مدة الأول - مدة الانتقال)
ffmpeg -i a.mp4 -i b.mp4 -filter_complex "[0][1]xfade=transition=slideleft:duration=0.25:offset=2.75" out.mp4
# أنواع مفيدة: fade, slideleft, slideup, smoothleft, zoomin, circleopen, wipeleft, fadeblack
```

## اللون
```bash
# تباين وتشبع أعلى (مظهر "ريلز")
ffmpeg -i in.mp4 -vf "eq=contrast=1.08:saturation=1.25:brightness=0.02" -c:a copy out.mp4
# دافئ
ffmpeg -i in.mp4 -vf "colorbalance=rs=0.06:bs=-0.06" -c:a copy out.mp4
```

## الصوت
```bash
# توحيد الصوت على -14 LUFS (معيار المنصات تقريباً)
ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy out.mp4

# موسيقى خلفية منخفضة تحت الكلام (ducking)
ffmpeg -i voice.mp4 -i music.mp3 -filter_complex "[1]volume=0.25[m];[m][0:a]sidechaincompress=threshold=0.03:ratio=8[d];[0:a][d]amix=inputs=2:duration=first" -c:v copy out.mp4
```

## كابشن
```bash
python3 tools/captions.py --words words.json --preset bold-pop --out captions.ass
ffmpeg -i in.mp4 -vf "ass=captions.ass" -c:a copy out.mp4
```
⚠️ لاستخراج لقطة تحقق من فيديو عليه كابشن: ضع `-ss` **بعد** `-i` عند استخدام فلتر `ass` مباشرة، وإلا يبدأ توقيت الكابشن من الصفر.

## المنطقة الآمنة للريلز
- لا تضع نصاً مهماً في آخر ~20% من الأسفل (الوصف والأزرار) ولا في ~15% من الجهة اليمنى (أيقونات اللايك والتعليق).
- لذلك `margin_v` في الأنماط الافتراضية ≈ 560–620 بكسل من الأسفل.
