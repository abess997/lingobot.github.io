# فيديو عباس — فكرة صفقة العقار (9:16)

- `abbas_9x16.mp4`: النسخة النهائية (1080×1920، 60 فريم، 30 ث، الصوت الأصلي).
- `project/`: ملفات المشروع للتعديل وإعادة الرسم بمحرّك الموشن في بلقن majed-video.
  - `scenes/stage.js`: الخلفية، شريط الفصول، الكابشن، الأفاتار.
  - `scenes/all.js`: الـ13 مشهد (مشهد لكل جملة).
  - `timeline.json`: أوقات المشاهد والكلمات (من تفريغ Whisper).
  - `facts.md`: مصدر كل اسم ورقم على الشاشة.
- المرجع التصميمي: `../../video-style/STYLE.md`.

إعادة الرسم (من مجلد `video-ad-editor/motion` في البلقن):

```bash
node render.js <مسار project> all --fresh
```

بعدها يتركّب الصوت الأصلي على `renders/video.mp4` بـffmpeg.

## النسخة 2 — `abbas_9x16_v2.mp4`
- كابشن بأسلوب المرجع (الكلمات تتجمّع، رمادي هادي، الكلمة المهمة بإطار أو بخط مائل).
- كبسولة عنوان تتحوّل بين المشاهد، بلا أفاتار ولا اسم ثابت.
- إيموجي وأيقونات، ولقطات حية من الفيديو الأصلي داخل كروت (`overlays.json` + `tools/overlay.py`).
- مؤثرات صوتية (`sfx.json`)، بلا موسيقى خلفية.

الترتيب: `render.js … all --fresh` ← `python3 tools/overlay.py <project> <الفيديو الأصلي>` ← `audio.py <project> --no-bed --video renders/video_ov.mp4 --lufs -16`
(`audio.py` يحتاج `vo/vo_full.wav` = صوت الفيديو الأصلي 48kHz.)
