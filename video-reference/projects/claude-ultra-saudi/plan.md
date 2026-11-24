# claude-ultra-saudi — نسخة سعودية من مرجع claude-ultra-workflow

**الناتج:** `outputs/claude-ultra-saudi.mp4` (غير مرفوع لـ git) · 1080×1920 · 30fps · H.264 + AAC 48kHz · 32.4ث · -14.6 LUFS، والذروة -1.4 dBFS
**الغلاف المقترح:** `outputs/claude-ultra-saudi-cover.jpg` (لقطة الختم $0)

## ما تم نسخه من المرجع وما تغيّر
| العنصر | المرجع | النسخة السعودية |
|---|---|---|
| السكربت | إنجليزي، 6 مقاطع (Hook ← قيمة ← دليل ← طريقة ← اعتراض ← CTA) | نفس البنية والترتيب، مكتوب باللهجة السعودية البيضاء (`script.txt`). أضفت «للي يشتغلون على مشاريع مفتوحة المصدر» عشان ما يفهم المتابع إن العرض للكل |
| الصوت | المقدم نفسه | ElevenLabs `eleven_v4`، صوت «Ali Ahmed - Authentic Saudi Dialect» (`OoE8swS3hImZANNOodf6`)، الأخذ A من اثنين، مع ضغط الوقفات وتسريع ×1.08 (`process_vo.py`) |
| الشكل | شبكة تصميم برتقالية، ومقابض تحديد، وصناديق صفراء، وبطاقات متصفح | نفس الأسلوب، لكن **كل شيء مرسوم بالكود** (`render.py`) بدون أي لقطة من الفيديو الأصلي |
| المقدم والكرتون | وجه + نسخة كرتونية | **محذوفين** (ما ننسخ وجه شخص ثاني). بدلهم شريط موجة صوتية يتحرك مع الكلام |
| المؤثرات | whoosh / impact / pop / click / ding (استنتاج من الطيف) | مؤثرات **مركّبة بالكود** وبدون حقوق (`sfx.py`) على نفس اللحظات: whoosh بين المشاهد، impact مع ختم $0، pop مع الفقاعات والشارات، click للمؤشر، tick للكتابة، error للحد، riser + impact + ding للـ CTA |
| الكابشن | كاريوكي إنجليزي | كاريوكي عربي RTL كلمة كلمة، توقيته من whisper ومحاذاة حروف (`align.py` ← `words.json`) |

## إعادة الرندر
```bash
python3 process_vo.py takeA.mp3 voA.wav
python3 /tmp/tx.py small voA.wav:ar      # whisper ← voA.wav.words.json
python3 align.py script.txt voA.wav.words.json words.json
python3 render.py --vo voA.wav --words words.json --assets <مجلد الخطوط: Tajawal + Amiri> --out ../../outputs/claude-ultra-saudi.mp4
```
الخطوط (OFL من google/fonts): Tajawal Black/ExtraBold/Bold، Amiri Bold/BoldItalic.
للمعاينة السريعة: `--preview 1.0,5.0,...` يطلّع PNG بدل الفيديو.

## كابشن المنشور المقترح (انسخه)
```
أنثروبيك تعطي ٦ شهور من Claude Ultra ببلاش 🤯
الباقة اللي سعرها 200$ بالشهر، يعني 1,200$ قيمتها.

البرنامج اسمه Claude for Open Source، وهو للي يساهمون في مشاريع مفتوحة المصدر.
ومو شرط تكون مشهور: إذا الناس تعتمد على شغلك، قدّم على كل حال.

اكتب ULTRA بالتعليقات وأرسل لك الرابط 👇

#كلود #ذكاء_اصطناعي #Claude #ClaudeCode #برمجة #مبرمجين #السعودية #تقنية
```

## التحقق من المعلومات (بحث 2026-11-24)
- ✅ Ultra هي أعلى باقة فردية بـ 200$ شهرياً (الاسم الجديد لـ Max 20x من ~30 أكتوبر 2026): support.claude.com، apidog، mixed-news
- ✅ برنامج Claude for Open Source يعطي 6 شهور مجاناً، وصفحة التسويق تقول «6 months of free Claude Ultra»، أما الشروط الرسمية فتقول «Claude Max 20x» (نفس الباقة قبل تغيير الاسم): anthropic.com/claude-for-oss-terms، claude.com/open-source-max
- ✅ فيه مسار «قدّم على كل حال» لمن يصون مشروعاً يعتمد عليه الناس (في الشروط الرسمية وصفحة البرنامج)
- ⚠️ «بدون حد الـ 5 ساعات» للحسابات الموثّقة فقط، والحد الأسبوعي باقي (10× Pro) حسب مصادر ثانوية
- ⚠️ تفاصيل الأهلية بالأرقام (عدد النجوم، طلبات الدمج) تختلف بين المصادر، فكتبتها في الفيديو بصيغة عامة
