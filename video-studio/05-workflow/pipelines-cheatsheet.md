# دليل سريع: أي pipeline أستخدم؟

| أبي... | Pipeline | يحتاج مفاتيح؟ |
|---|---|---|
| شرح لفكرة/موضوع بتعليق وصور | `animated-explainer` | غالباً (TTS + صور) |
| موشن جرافيك، أرقام، تايبوغرافي، رسوم بيانية | `animation` | لا (Remotion/HyperFrames) |
| مونتاج من لقطات حقيقية مجانية | `documentary-montage` | اختياري (Pexels/Pixabay) |
| تريلر / فيلم براند / مزاجي | `cinematic` | غالباً (توليد فيديو) |
| تقطيع فيديو طويل لمقاطع قصيرة | `clip-factory` | لا (تفريغ محلي) |
| تحرير فيديو شخص يتكلم | `talking-head` | لا |
| تسجيل شاشة / شرح تطبيق | `screen-demo` | لا |
| لقطات + جرافيكس فوقها | `hybrid` | حسب الأصول |
| بودكاست → مقاطع فيديو | `podcast-repurpose` | لا |
| ترجمة/دبلجة فيديو | `localization-dub` | نعم (ترجمة/TTS) |
| مقدّم أفاتار رقمي | `avatar-spokesperson` | نعم (HeyGen وغيره) |
| شخصيات كرتونية متحركة | `character-animation` | لا |

المصدر: `OpenMontage/pipeline_defs/*.yaml` — الوصف الكامل وقواعد الجودة هناك.

## أوامر مفيدة (من داخل OpenMontage/)
```bash
make preflight                         # وش الأدوات المتاحة حالياً
make demo-list && make demo            # فيديوهات تجريبية بدون مفاتيح
python -m backlot open                 # لوحة متابعة كل المشاريع
python -m backlot open <project-id>    # لوحة مشروع واحد
```
