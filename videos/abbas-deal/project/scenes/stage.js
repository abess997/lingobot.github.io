/* الستيج: الخلفية والشبكة، شريط الفصول، الكابشن كلمة بكلمة، والأفاتار — ثابتين طول الفيلم.
   الأسلوب من video-style/STYLE.md: خلفية فاتحة + شبكة خفيفة، أزرق واحد، كروت بيضاء بظل ناعم. */
const CHAPTERS = [
  { n: '01', name: 'المشكلة', s: 0, e: 11.12 },
  { n: '02', name: 'الحل', s: 11.12, e: 20.56 },
  { n: '03', name: 'الرحلة', s: 20.56, e: 30 },
];
const KEY = new Set(['عباس', 'الناصر', '2025', 'فكرة', 'مشكلة', '6', 'العقار', 'جزء', 'الحل', 'وحدة', 'توثق', 'الكل', 'مستندات', 'صغير', 'أولها', 'تقني', 'نتكلم']);
const SERIF = new Set(['فكرة', 'الحل', 'الكل', 'أولها', 'نتكلم']);   // الكلمة المهمة بخط ثاني بدل الإطار

window.K = {
  a(hex, al) { const h = hex.replace('#', ''), n = parseInt(h, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${al})`; },
  /* دخول ناعم: 0→1 بين s و s+d */
  k(ctx, t, s, d = .35) { return ctx.E.cubicOut(ctx.prog(t, s, s + d)); },
  /* ارسم fn داخل تحويل دخول: شفافية + تكبير من 0.94 + صعود بسيط */
  pop(X, k, cx, cy, fn, dy = 18) {
    if (k <= 0) return; X.save(); X.globalAlpha *= Math.min(1, k);
    const s = .94 + .06 * k; X.translate(cx, cy + (1 - k) * dy); X.scale(s, s); X.translate(-cx, -cy); fn(); X.restore();
  },
  card(X, P, x, y, w, h, r = 28, fill) {
    X.save(); X.shadowColor = 'rgba(20,28,48,.10)'; X.shadowBlur = 44; X.shadowOffsetY = 16;
    X.fillStyle = fill || P.card; X.beginPath(); X.roundRect(x, y, w, h, r); X.fill(); X.restore();
    X.save(); X.strokeStyle = K.a(P.ink, .10); X.lineWidth = 2; X.beginPath(); X.roundRect(x, y, w, h, r); X.stroke(); X.restore();
  },
  /* شريط نافذة بثلاث نقاط فوق الكرت */
  chrome(X, P, x, y, w, label, ctx) {
    ['#E5675E', '#E9B949', '#5CB868'].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(x + 34 + i * 26, y + 32, 8, 0, 7); X.fill(); });
    if (label) ctx.text(X, label, x + w - 32, y + 33, { family: 'num', weight: 600, size: 22, color: P.mut, align: 'right', dir: 'ltr', baseline: 'middle', letterSpacing: 2 });
    X.fillStyle = K.a(P.ink, .08); X.fillRect(x, y + 62, w, 2);
  },
  /* كبسولة العنوان: بيضاء بحد أسود سميك + أيقونة + سطر مونو أزرق */
  pill(X, ctx, cx, cy, w, label, sub, icon) {
    const { P } = ctx, h = 132, x = cx - w / 2, y = cy - h / 2;
    X.save(); X.shadowColor = 'rgba(20,28,48,.10)'; X.shadowBlur = 30; X.shadowOffsetY = 10;
    X.fillStyle = P.card; X.beginPath(); X.roundRect(x, y, w, h, h / 2); X.fill(); X.restore();
    X.lineWidth = 5; X.strokeStyle = P.ink; X.beginPath(); X.roundRect(x, y, w, h, h / 2); X.stroke();
    if (icon) icon(X, x + w - 78, cy, 50, P.acc, P);
    const tx = icon ? cx - 34 : cx;
    ctx.text(X, label, tx, cy - (sub ? 12 : 0), { family: 'display', weight: 700, size: 54, color: P.ink, baseline: 'middle' });
    if (sub) ctx.text(X, sub, tx, cy + 38, { family: 'num', weight: 600, size: 20, color: P.acc, baseline: 'middle', dir: 'ltr', letterSpacing: 3 });
  },
  /* عقدة صغيرة (كبسولة) — active = معبّاة أزرق */
  node(X, ctx, cx, cy, label, active, w = 250, h = 96) {
    const { P } = ctx, x = cx - w / 2, y = cy - h / 2;
    X.save(); X.shadowColor = 'rgba(20,28,48,.08)'; X.shadowBlur = 24; X.shadowOffsetY = 8;
    X.fillStyle = active ? P.acc : P.card; X.beginPath(); X.roundRect(x, y, w, h, h / 2); X.fill(); X.restore();
    X.lineWidth = 4; X.strokeStyle = active ? P.acc : P.ink; X.beginPath(); X.roundRect(x, y, w, h, h / 2); X.stroke();
    ctx.text(X, label, cx, cy + 2, { family: 'body', weight: 700, size: 40, color: active ? P.onAcc : P.ink, baseline: 'middle' });
  },
  /* شارة النتيجة: أزرق فاتح بحد أزرق */
  badge(X, ctx, cx, cy, label, w) {
    const { P } = ctx, h = 92, x = cx - w / 2, y = cy - h / 2;
    X.fillStyle = K.a(P.acc, .08); X.beginPath(); X.roundRect(x, y, w, h, h / 2); X.fill();
    X.lineWidth = 3; X.strokeStyle = K.a(P.acc, .85); X.stroke();
    ctx.text(X, label, cx, cy + 2, { family: 'body', weight: 700, size: 40, color: P.acc, baseline: 'middle' });
  },
  /* خط أزرق منقّط يرتسم من a إلى b بنسبة k */
  dash(X, P, x1, y1, x2, y2, k, color) {
    if (k <= 0) return; X.save(); X.strokeStyle = color || P.acc; X.lineWidth = 4; X.setLineDash([12, 11]); X.lineCap = 'round';
    X.beginPath(); X.moveTo(x1, y1); X.lineTo(x1 + (x2 - x1) * k, y1 + (y2 - y1) * k); X.stroke(); X.restore();
  },
  check(X, cx, cy, r, color, k = 1) {
    X.save(); X.fillStyle = color; X.beginPath(); X.arc(cx, cy, r * (.9 + .1 * k), 0, 7); X.fill();
    X.strokeStyle = '#fff'; X.lineWidth = r * .22; X.lineCap = 'round'; X.lineJoin = 'round';
    const p = [[cx - r * .42, cy + r * .02], [cx - r * .1, cy + r * .34], [cx + r * .46, cy - r * .3]];
    X.beginPath(); X.moveTo(...p[0]);
    if (k < .5) { const q = k * 2; X.lineTo(p[0][0] + (p[1][0] - p[0][0]) * q, p[0][1] + (p[1][1] - p[0][1]) * q); }
    else { X.lineTo(...p[1]); const q = (k - .5) * 2; X.lineTo(p[1][0] + (p[2][0] - p[1][0]) * q, p[1][1] + (p[2][1] - p[1][1]) * q); }
    X.stroke(); X.restore();
  },
  /* أيقونات خطية بسيطة (مرسومة، بلا شعارات) */
  ic: {
    bulb(X, cx, cy, s, c) { X.save(); X.strokeStyle = c; X.lineWidth = s * .09; X.lineCap = 'round'; X.lineJoin = 'round';
      X.beginPath(); X.arc(cx, cy - s * .12, s * .3, Math.PI * .8, Math.PI * 2.2); X.lineTo(cx + s * .13, cy + s * .26); X.lineTo(cx - s * .13, cy + s * .26); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(cx - s * .11, cy + s * .4); X.lineTo(cx + s * .11, cy + s * .4); X.stroke(); X.restore(); },
    building(X, cx, cy, s, c) { X.save(); X.strokeStyle = c; X.lineWidth = s * .08; X.lineJoin = 'round';
      X.strokeRect(cx - s * .3, cy - s * .4, s * .36, s * .8); X.strokeRect(cx + s * .06, cy - s * .1, s * .26, s * .5);
      X.fillStyle = c; for (let r = 0; r < 3; r++) for (let q = 0; q < 2; q++) X.fillRect(cx - s * .23 + q * s * .14, cy - s * .3 + r * s * .2, s * .07, s * .08); X.restore(); },
    person(X, cx, cy, s, c) { X.save(); X.strokeStyle = c; X.lineWidth = s * .09; X.lineCap = 'round';
      X.beginPath(); X.arc(cx, cy - s * .16, s * .17, 0, 7); X.stroke();
      X.beginPath(); X.arc(cx, cy + s * .42, s * .32, Math.PI * 1.15, Math.PI * 1.85); X.stroke(); X.restore(); },
    bank(X, cx, cy, s, c) { X.save(); X.strokeStyle = c; X.lineWidth = s * .08; X.lineJoin = 'round'; X.lineCap = 'round';
      X.beginPath(); X.moveTo(cx - s * .38, cy - s * .14); X.lineTo(cx, cy - s * .38); X.lineTo(cx + s * .38, cy - s * .14); X.closePath(); X.stroke();
      for (let i = -1; i <= 1; i++) { X.beginPath(); X.moveTo(cx + i * s * .22, cy - s * .04); X.lineTo(cx + i * s * .22, cy + s * .24); X.stroke(); }
      X.beginPath(); X.moveTo(cx - s * .4, cy + s * .36); X.lineTo(cx + s * .4, cy + s * .36); X.stroke(); X.restore(); },
    chat(X, cx, cy, s, c) { X.save(); X.strokeStyle = c; X.lineWidth = s * .08; X.lineJoin = 'round';
      X.beginPath(); X.roundRect(cx - s * .38, cy - s * .3, s * .76, s * .5, s * .12); X.stroke();
      X.beginPath(); X.moveTo(cx - s * .18, cy + s * .2); X.lineTo(cx - s * .26, cy + s * .38); X.lineTo(cx + s * .02, cy + s * .2); X.stroke(); X.restore(); },
    doc(X, cx, cy, s, c) { X.save(); X.strokeStyle = c; X.lineWidth = s * .08; X.lineJoin = 'round';
      X.beginPath(); X.moveTo(cx - s * .28, cy - s * .4); X.lineTo(cx + s * .12, cy - s * .4); X.lineTo(cx + s * .28, cy - s * .24); X.lineTo(cx + s * .28, cy + s * .4); X.lineTo(cx - s * .28, cy + s * .4); X.closePath(); X.stroke();
      for (let i = 0; i < 3; i++) { X.beginPath(); X.moveTo(cx - s * .16, cy - s * .1 + i * s * .15); X.lineTo(cx + s * .16, cy - s * .1 + i * s * .15); X.stroke(); } X.restore(); },
    route(X, cx, cy, s, c) { X.save(); X.strokeStyle = c; X.lineWidth = s * .08; X.lineCap = 'round';
      X.beginPath(); X.moveTo(cx - s * .36, cy + s * .3); X.bezierCurveTo(cx - s * .1, cy + s * .3, cx - s * .3, cy - s * .2, cx, cy - s * .1); X.bezierCurveTo(cx + s * .3, cy, cx + s * .1, cy - s * .32, cx + s * .36, cy - s * .32); X.stroke();
      X.fillStyle = c; X.beginPath(); X.arc(cx - s * .36, cy + s * .3, s * .09, 0, 7); X.fill(); X.beginPath(); X.arc(cx + s * .36, cy - s * .32, s * .09, 0, 7); X.fill(); X.restore(); },
    hand(X, cx, cy, s, c) { X.save(); X.strokeStyle = c; X.lineWidth = s * .08; X.lineCap = 'round'; X.lineJoin = 'round';
      X.beginPath(); X.moveTo(cx - s * .42, cy - s * .05); X.lineTo(cx - s * .16, cy - s * .2); X.lineTo(cx + s * .06, cy - s * .04); X.lineTo(cx + s * .42, cy - s * .05); X.stroke();
      X.beginPath(); X.moveTo(cx - s * .3, cy + s * .02); X.lineTo(cx - s * .02, cy + s * .26); X.lineTo(cx + s * .3, cy + s * .02); X.stroke(); X.restore(); },
  },
};

MOTION.stage({
  under(t, lt, ctx) {
    const { X, P } = ctx;
    X.fillStyle = P.bg; X.fillRect(0, 0, 1080, 1920);
    // شبكة دفتر خفيفة تتلاشى عند الأطراف (مثل المرجع)
    X.strokeStyle = K.a(P.ink, .06); X.lineWidth = 2; X.beginPath();
    for (let x = 0; x <= 1080; x += 90) { X.moveTo(x + .5, 0); X.lineTo(x + .5, 1920); }
    for (let y = 15; y <= 1920; y += 90) { X.moveTo(0, y + .5); X.lineTo(1080, y + .5); }
    X.stroke();
    const g = X.createRadialGradient(540, 960, 260, 540, 960, 900);
    g.addColorStop(0, K.a(P.bg, 0)); g.addColorStop(1, K.a(P.bg, 1)); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920);
  },
  over(t, lt, ctx) {
    const { X, P, E, prog } = ctx;
    /* ── شريط الفصول (RTL: الأول يمين) ── */
    const kIn = E.cubicOut(prog(t, .05, .5));
    const gap = 18, w = (960 - gap * 2) / 3;
    CHAPTERS.forEach((c, i) => {
      const x1 = 1020 - i * (w + gap), x0 = x1 - w, done = t >= c.e - .05, act = t >= c.s && t < c.e;
      const col = act || done ? P.ink : K.a(P.ink, .32);
      ctx.text(X, c.n, x1, 178, { family: 'num', weight: 700, size: 24, color: act || done ? P.acc : K.a(P.ink, .3), align: 'right', dir: 'ltr', baseline: 'middle', alpha: kIn, letterSpacing: 2 });
      ctx.text(X, c.name, x1 - 52, 176, { family: 'body', weight: 700, size: 28, color: col, align: 'right', baseline: 'middle', alpha: kIn });
      X.save(); X.globalAlpha = kIn; X.fillStyle = K.a(P.ink, .09); X.beginPath(); X.roundRect(x0, 206, w, 7, 3.5); X.fill();
      const f = E.sineInOut(prog(t, c.s, c.e - .1)); if (f > 0) { X.fillStyle = P.acc; X.beginPath(); X.roundRect(x1 - w * f, 206, w * f, 7, 3.5); X.fill(); }
      X.restore();
    });

    /* ── الكابشن فوق: كلمتين بكل مرة، الكلمة المهمة داكنة بإطار أزرق ── */
    const chunks = window.__chunks || (window.__chunks = (() => {
      const out = [];
      for (const L of ctx.vo ? Object.values(ctx.vo) : []) {
        const ws = L.words; let i = 0;
        while (i < ws.length) { const n = ws.length - i === 3 ? 3 : Math.min(2, ws.length - i); out.push(ws.slice(i, i + n)); i += n; }
      }
      out.sort((a, b) => a[0].s - b[0].s);
      out.forEach((c, j) => { const nx = out[j + 1]; const end = c[c.length - 1].e; c.s = c[0].s - .06; c.end = nx && nx[0].s - end < .8 ? nx[0].s - .06 : end + .45; });
      return out;
    })());
    const ch = chunks.find(c => t >= c.s && t < c.end);
    if (ch) {
      const size = 62, sp = 34, fam = ctx.font('body', 400, size);
      X.save(); X.font = fam; const ws = ch.map(w => ctx.text.westernDigits ? ctx.text.westernDigits(w.w) : w.w);
      const wd = ws.map(s => X.measureText(s).width * (SERIF.has(s) ? 1.12 : 1)); X.restore();
      const total = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
      let x = 540 + total / 2;              // RTL: أول كلمة يمين
      const kOut = 1 - E.cubicIn(prog(t, ch.end - .14, ch.end));
      ch.forEach((w, i) => {
        const s = ws[i], cx = x - wd[i] / 2, k = E.cubicOut(prog(t, w.s - .06, w.s + .16));
        const key = KEY.has(s), serif = SERIF.has(s), y = 330 + (1 - k) * 22;
        const al = k * kOut;
        if (al > 0) {
          if (key && !serif) {   // إطار تحديد أزرق بزوايا مربعة
            const fw = wd[i] + 30, fh = 84, fx = cx - fw / 2, fy = 330 - fh / 2 - 2;
            X.save(); X.globalAlpha = al; X.fillStyle = K.a(P.acc, .07); X.fillRect(fx, fy, fw * k, fh);
            X.strokeStyle = P.acc; X.lineWidth = 2.5; X.strokeRect(fx, fy, fw * k, fh);
            X.fillStyle = P.acc; [[fx, fy], [fx + fw * k, fy], [fx, fy + fh], [fx + fw * k, fy + fh]].forEach(([a, b]) => X.fillRect(a - 5, b - 5, 10, 10));
            X.restore();
          }
          ctx.text(X, s, cx, y, serif ? { family: 'Aref Ruqaa', weight: 700, size: size + 6, color: P.acc, baseline: 'middle', alpha: al }
            : { family: 'body', weight: key ? 700 : 400, size, color: key ? P.ink : P.mut, baseline: 'middle', alpha: al });
        }
        x -= wd[i] + sp;
      });
    }

    /* ── الأفاتار تحت يسار (الحرف الأول من الاسم) ── */
    const kA = E.cubicOut(prog(t, .2, .7));
    X.save(); X.globalAlpha = kA; X.fillStyle = P.card; X.strokeStyle = P.ink; X.lineWidth = 4;
    X.beginPath(); X.arc(112, 1462, 46, 0, 7); X.fill(); X.stroke(); X.restore();
    ctx.text(X, 'ع', 112, 1466, { family: 'display', weight: 700, size: 44, color: P.ink, baseline: 'middle', alpha: kA });
  },
});
