# ناشر X: اربط حساباتك في X مع Claude

خادم MCP خاص بك يعمل على Cloudflare Workers. تضيف رابطه في Claude مرة واحدة، وبعدها تقول لـ Claude:

- «حوّل هذا المقال لثريد من ٥ تغريدات وانشره من ‎@acme»
- «جدول أفضل فكرة لبكرة الساعة ٩ الصبح»
- «وش عندي مجدول هالأسبوع؟»
- «أي من آخر ٢٠ تغريدة جاب مشاهدات أكثر؟»

Claude يعرض لك النص أولاً، ولا ينشر إلا بعد موافقتك.

## ماذا يستطيع

| الأداة | ماذا تفعل |
|---|---|
| `publish_post` | تنشر تغريدة الآن، مع صور، من حساب واحد أو من كل الحسابات |
| `publish_thread` | تنشر ثريد (كل تغريدة رد على التي قبلها) |
| `schedule_posts` | تجدول تغريدة أو ثريد لوقت لاحق |
| `list_scheduled` / `reschedule` / `cancel_scheduled` | تعرض المجدول، وتغيّر وقته، وتلغيه |
| `delete_post` | تحذف تغريدة منشورة |
| `post_history` | سجل كل ما نُشر عن طريق الخادم |
| `post_stats` | المشاهدات والإعجابات وإعادة النشر والردود |
| `my_mentions` | من ذكر حسابك مؤخراً |
| `search_posts` | بحث في التغريدات العامة لآخر ٧ أيام |
| `save_image` / `list_images` / `delete_image` | صور محفوظة بالاسم («انشرها مع صورة الإطلاق») |
| `list_accounts` | الحسابات المربوطة |

**ما لا يستطيعه أبداً:** الإعجاب، المتابعة، الرد على الآخرين نيابةً عنك، أو الرسائل الخاصة. هذه الأدوات غير موجودة أصلاً، وصلاحيات X المطلوبة لا تشملها.

## التكلفة

- **Cloudflare:** الخطة المجانية تكفي للاستخدام الشخصي.
- **X API:** الدفع حسب الاستخدام بلا اشتراك. تشتري رصيداً من [console.x.com](https://console.x.com). الأسعار كما في [docs.x.com](https://docs.x.com/x-api/getting-started/pricing) في نوفمبر ٢٠٢٦ (قد تتغير):

| العملية | السعر |
|---|---|
| نشر تغريدة | ‎$0.015 |
| نشر تغريدة **فيها رابط** | ‎$0.20 |
| قراءة تغريدة (إحصائيات، بحث، إشارات) | ‎$0.005 لكل تغريدة |
| حذف | ‎$0.010 |

## التركيب

تحتاج: حساب [Cloudflare](https://dash.cloudflare.com/sign-up) مجاني، وحساب مطوّر في X فيه رصيد، و Node.js 20 أو أحدث.

### ١. انشر الخادم على Cloudflare

```bash
cd x-mcp && npm install
```

```bash
npx wrangler login
```

```bash
npm run deploy
```

أول نشر ينشئ قاعدة البيانات والتخزين تلقائياً، ويطبع رابط الخادم، مثل `https://x-mcp.<اسمك>.workers.dev`. احفظه.

```bash
npm run db:migrate
```

### ٢. ضع كلمة المرور والمفتاح السري

```bash
npx wrangler secret put OWNER_PASSWORD
```

(كلمة مرور قوية تختارها أنت: تدخل بها اللوحة وتوافق بها على Claude.)

```bash
openssl rand -base64 32 | npx wrangler secret put APP_SECRET
```

### ٣. أنشئ تطبيقاً في X

في [console.x.com](https://console.x.com) أنشئ App، ثم في إعدادات المصادقة (User authentication settings):

- **App permissions:** ‏Read and write
- **Type of App:** ‏Web App (confidential client)
- **Callback URI:** ‏`https://x-mcp.<اسمك>.workers.dev/x/callback` (رابطك من الخطوة ١ + ‎`/x/callback`، مطابق حرفياً)
- **Website URL:** رابطك نفسه

بعد الحفظ تظهر **OAuth 2.0 Client ID** و **Client Secret**. ضعهما:

```bash
npx wrangler secret put X_CLIENT_ID
```

```bash
npx wrangler secret put X_CLIENT_SECRET
```

### ٤. اربط حسابك وClaude

1. افتح رابط الخادم وادخل بكلمة المرور.
2. اضغط **ربط حساب X** ووافق على صفحة X.
3. انسخ الرابط من اللوحة (ينتهي بـ ‎`/mcp`).
4. في Claude: **Settings ← Connectors ← Add custom connector**، الصق الرابط، ثم أدخل كلمة مرور اللوحة في صفحة الموافقة.

في Claude Code:

```bash
claude mcp add --transport http x https://x-mcp.<اسمك>.workers.dev/mcp
```

## الأمان

- لا أحد يستخدم الخادم إلا من يعرف كلمة مرور اللوحة: الدخول للوحة، والموافقة على أي تطبيق (Claude) يريد الاتصال.
- مفاتيح X مشفّرة (AES-GCM) في قاعدة البيانات، والأسرار في Cloudflare Secrets فقط وليست في الكود.
- بعد ١٠ محاولات كلمة مرور خاطئة يُقفل الدخول من ذلك العنوان ١٥ دقيقة.
- لإلغاء الإذن نهائياً: افصل الحساب من اللوحة، ثم من X: ‏Settings ← Security ← Connected apps.

## التطوير

```bash
npm run typecheck
```

```bash
npm test
```

`npm test` يشغّل الخادم محلياً مقابل X API وهمي ويختبر ٤٩ حالة: الدخول، ربط X، موافقة Claude (OAuth)، كل الأدوات، الجدولة، وتجديد المفاتيح.

الملفات: `src/index.ts` (الربط و OAuth والجدولة كل دقيقة)، `src/mcp.ts` (أدوات Claude)، `src/x.ts` (X API)، `src/publish.ts` (النشر والصور والجدولة)، `src/web.ts` (اللوحة وصفحة الموافقة)، `migrations/` (قاعدة البيانات).
