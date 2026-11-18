# 🎬 Video Studio

مساحة عمل شخصية لإنتاج الفيديو والتصميم بالذكاء الاصطناعي، مبنية على
[OpenMontage](https://github.com/OpenMontageInc/OpenMontage) (رخصة AGPLv3).

## التشغيل لأول مرة (على جهازك)

```bash
git clone --recurse-submodules https://github.com/abess997/lingobot.github.io.git
cd lingobot.github.io/video-studio
./setup.sh
```

المتطلبات: Python 3.10+، Node.js 22.23.4+ (أو 24.22.1+ / 26.12.1+)، FFmpeg.

بعدها افتح Claude Code **داخل مجلد `video-studio`**:

```bash
claude
```

وقل مثلاً: «أبي فيديو 30 ثانية عمودي عن ...» أو استخدم `/new-video`.

## إضافة مفاتيح API (اختياري — يفتح مزوّدين أكثر)
عدّل `OpenMontage/.env`. التفاصيل والأولويات في [`05-workflow/api-keys-guide.md`](05-workflow/api-keys-guide.md).
بدون مفاتيح تشتغل: Remotion / HyperFrames / FFmpeg / تفريغ صوتي محلي / تحليل فيديو.

## الهيكل
```
video-studio/
├── CLAUDE.md                  ← تعليمات Claude لهذا المشروع
├── setup.sh                   ← تثبيت بأمر واحد
├── .claude/commands/          ← أوامر /new-video وغيرها
├── 01-brand/                  ← هويتك البصرية + ملف style لـ OpenMontage
├── 02-references/             ← مراجع فيديو، تصاميم، برومبتات
├── 03-projects/_template/     ← قالب مشروع فيديو
├── 04-assets/                 ← أصولك (شعار، خطوط، موسيقى...)
├── 05-workflow/               ← قوائم تحقق، تكاليف، تقويم محتوى
├── 06-claude-ai-project/      ← لو تبي تستخدمه في Claude.ai Projects
└── OpenMontage/               ← الأداة نفسها (submodule)
```

## تحديث الأداة
```bash
cd OpenMontage && git pull origin main && make setup
cd .. && git add OpenMontage && git commit -m "Update OpenMontage"
```
