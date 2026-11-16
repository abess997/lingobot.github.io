/* الستيج (نسخة 2): الخلفية والشبكة، شريط الفصول، كبسولة العنوان اللي تتحوّل بين المشاهد، والكابشن بأسلوب المرجع.
   بلا أفاتار ثابت وبلا اسم ثابت. */
const CHAPTERS = [
  { n: '01', name: 'المشكلة', s: 0, e: 11.12 },
  { n: '02', name: 'الحل', s: 11.12, e: 20.56 },
  { n: '03', name: 'الرحلة', s: 20.56, e: 30 },
];
/* كبسولة العنوان: [وقت، نص، سطر صغير، إيموجي] — null = تختفي */
const PILLS = [
  [0.02, 'عباس الناصر', 'SINCE 2025', '👋'],
  [2.45, null],
  [4.70, 'مبيعات العقار', 'REAL ESTATE SALES', '🏢'],
  [8.66, 'الصفقة', 'ONE DEAL · 3 PARTIES', '📄'],
  [11.05, null],
  [12.56, 'مساحة صفقة', 'ONE DEAL WORKSPACE', '🤝'],
  [14.10, 'المحادثة', 'EVERY STEP LOGGED', '💬'],
  [16.08, 'حالة الصفقة', 'SAME STATUS FOR ALL', '📍'],
  [17.30, 'المستندات', 'CHECKLIST · DAY ONE', '📋'],
  [20.50, null],
  [21.68, 'جزء من الحل', 'JUST ONE PIECE', '🧩'],
  [23.66, 'الرحلة', 'JUST GETTING STARTED', '🗺️'],
  [25.14, 'شريك تقني', 'TECHNICAL PARTNER', '👨‍💻'],
  [27.85, null],
];
const KEY = new Set(['عباس', '2025', 'مشكلة', '6', 'العقار', 'جزء', 'وحدة', 'توثق', 'مستندات', 'صغير', 'تقني', 'نتكلم']);
const SERIF = new Set(['فكرة', 'حقيقية', 'الحل', 'الكل', 'البداية', 'أولها', 'الرحلة']);   // مثل الكلمة المائلة بالمرجع

window.K = {
  a(hex, al) { const h = hex.replace('#', ''), n = parseInt(h, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${al})`; },
  k(ctx, t, s, d = .35) { return ctx.E.cubicOut(ctx.prog(t, s, s + d)); },
  pop(X, k, cx, cy, fn, dy = 18) {
    if (k <= 0) return; X.save(); X.globalAlpha *= Math.min(1, k);
    const s = .94 + .06 * k; X.translate(cx, cy + (1 - k) * dy); X.scale(s, s); X.translate(-cx, -cy); fn(); X.restore();
  },
  emoji(X, ch, x, y, size, alpha = 1) {
    X.save(); X.globalAlpha *= alpha; X.font = `${size}px "Noto Color Emoji"`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.direction = 'ltr';
    X.fillText(ch, x, y + size * .06); X.restore();
  },
  card(X, P, x, y, w, h, r = 28, fill) {
    X.save(); X.shadowColor = 'rgba(20,28,48,.10)'; X.shadowBlur = 44; X.shadowOffsetY = 16;
    X.fillStyle = fill || P.card; X.beginPath(); X.roundRect(x, y, w, h, r); X.fill(); X.restore();
    X.save(); X.strokeStyle = K.a(P.ink, .10); X.lineWidth = 2; X.beginPath(); X.roundRect(x, y, w, h, r); X.stroke(); X.restore();
  },
  chrome(X, P, x, y, w, label, ctx) {
    ['#E5675E', '#E9B949', '#5CB868'].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(x + 34 + i * 26, y + 32, 8, 0, 7); X.fill(); });
    if (label) ctx.text(X, label, x + w - 32, y + 33, { family: 'num', weight: 600, size: 22, color: P.mut, align: 'right', dir: 'ltr', baseline: 'middle', letterSpacing: 2 });
    X.fillStyle = K.a(P.ink, .08); X.fillRect(x, y + 62, w, 2);
  },
  /* كرت فيه لقطة من الفيديو الأصلي. الحركة الحية تنضاف فوقه بـffmpeg بنفس المكان بالضبط (VC). */
  VC: { x: 90, y: 640, w: 900, h: 343, r: 28 },
  clipCard(X, ctx, img, k, rect) {
    const R = rect || K.VC, { P } = ctx;
    K.pop(X, k, R.x + R.w / 2, R.y + R.h / 2, () => {
      X.save(); X.shadowColor = 'rgba(20,28,48,.16)'; X.shadowBlur = 50; X.shadowOffsetY = 20; X.fillStyle = '#000';
      X.beginPath(); X.roundRect(R.x, R.y, R.w, R.h, R.r); X.fill(); X.restore();
      X.save(); X.beginPath(); X.roundRect(R.x, R.y, R.w, R.h, R.r); X.clip(); X.drawImage(ctx.img(img), R.x, R.y, R.w, R.h); X.restore();
      X.save(); X.strokeStyle = P.ink; X.lineWidth = 4; X.beginPath(); X.roundRect(R.x - 2, R.y - 2, R.w + 4, R.h + 4, R.r + 2); X.stroke(); X.restore();
    }, 0);
  },
  node(X, ctx, cx, cy, label, active, w = 250, h = 96, emo) {
    const { P } = ctx, x = cx - w / 2, y = cy - h / 2;
    X.save(); X.shadowColor = 'rgba(20,28,48,.08)'; X.shadowBlur = 24; X.shadowOffsetY = 8;
    X.fillStyle = active ? P.acc : P.card; X.beginPath(); X.roundRect(x, y, w, h, h / 2); X.fill(); X.restore();
    X.lineWidth = 4; X.strokeStyle = active ? P.acc : P.ink; X.beginPath(); X.roundRect(x, y, w, h, h / 2); X.stroke();
    if (emo) { K.emoji(X, emo, x + w - 46, cy, 38); ctx.text(X, label, cx - 22, cy + 2, { family: 'body', weight: 700, size: 36, color: active ? P.onAcc : P.ink, baseline: 'middle' }); }
    else ctx.text(X, label, cx, cy + 2, { family: 'body', weight: 700, size: 38, color: active ? P.onAcc : P.ink, baseline: 'middle' });
  },
  badge(X, ctx, cx, cy, label, w) {
    const { P } = ctx, h = 92, x = cx - w / 2, y = cy - h / 2;
    X.fillStyle = K.a(P.acc, .08); X.beginPath(); X.roundRect(x, y, w, h, h / 2); X.fill();
    X.lineWidth = 3; X.strokeStyle = K.a(P.acc, .85); X.stroke();
    ctx.text(X, label, cx, cy + 2, { family: 'body', weight: 700, size: 40, color: P.acc, baseline: 'middle' });
  },
  dash(X, P, x1, y1, x2, y2, k, color) {
    if (k <= 0) return; X.save(); X.strokeStyle = color || P.acc; X.lineWidth = 4; X.setLineDash([12, 11]); X.lineCap = 'round';
    X.beginPath(); X.moveTo(x1, y1); X.lineTo(x1 + (x2 - x1) * k, y1 + (y2 - y1) * k); X.stroke(); X.restore();
  },
  check(X, cx, cy, r, color, k = 1) {
    if (k <= 0) return;
    X.save(); X.fillStyle = color; X.beginPath(); X.arc(cx, cy, r * (.7 + .3 * Math.min(1, k * 2)), 0, 7); X.fill();
    X.strokeStyle = '#fff'; X.lineWidth = r * .22; X.lineCap = 'round'; X.lineJoin = 'round';
    const p = [[cx - r * .42, cy + r * .02], [cx - r * .1, cy + r * .34], [cx + r * .46, cy - r * .3]];
    X.beginPath(); X.moveTo(...p[0]);
    if (k < .5) { const q = k * 2; X.lineTo(p[0][0] + (p[1][0] - p[0][0]) * q, p[0][1] + (p[1][1] - p[0][1]) * q); }
    else { X.lineTo(...p[1]); const q = (k - .5) * 2; X.lineTo(p[1][0] + (p[2][0] - p[1][0]) * q, p[1][1] + (p[2][1] - p[1][1]) * q); }
    X.stroke(); X.restore();
  },
  /* شرارات صغيرة تطلع من نقطة (لحظة تأكيد) */
  burst(X, P, cx, cy, k, n = 10, r0 = 60, r1 = 130, color) {
    if (k <= 0 || k >= 1) return;
    X.save(); X.strokeStyle = color || P.acc; X.lineWidth = 5; X.lineCap = 'round'; X.globalAlpha = 1 - k;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, d0 = r0 + (r1 - r0) * k * .6, d1 = r0 + (r1 - r0) * k;
      X.beginPath(); X.moveTo(cx + Math.cos(a) * d0, cy + Math.sin(a) * d0); X.lineTo(cx + Math.cos(a) * d1, cy + Math.sin(a) * d1); X.stroke(); }
    X.restore();
  },
};

MOTION.stage({
  under(t, lt, ctx) {
    const { X, P } = ctx;
    X.fillStyle = P.bg; X.fillRect(0, 0, 1080, 1920);
    X.strokeStyle = K.a(P.ink, .06); X.lineWidth = 2; X.beginPath();
    for (let x = 0; x <= 1080; x += 90) { X.moveTo(x + .5, 0); X.lineTo(x + .5, 1920); }
    for (let y = 15; y <= 1920; y += 90) { X.moveTo(0, y + .5); X.lineTo(1080, y + .5); }
    X.stroke();
    const g = X.createRadialGradient(540, 960, 260, 540, 960, 900);
    g.addColorStop(0, K.a(P.bg, 0)); g.addColorStop(1, K.a(P.bg, 1)); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920);
  },
  over(t, lt, ctx) {
    const { X, P, E, prog } = ctx;
    /* ── شريط الفصول ── */
    const kIn = E.cubicOut(prog(t, .05, .5)), gap = 18, w = (960 - gap * 2) / 3;
    CHAPTERS.forEach((c, i) => {
      const x1 = 1020 - i * (w + gap), x0 = x1 - w, done = t >= c.e - .05, act = t >= c.s && t < c.e;
      ctx.text(X, c.n, x1, 178, { family: 'num', weight: 700, size: 24, color: act || done ? P.acc : K.a(P.ink, .3), align: 'right', dir: 'ltr', baseline: 'middle', alpha: kIn, letterSpacing: 2 });
      ctx.text(X, c.name, x1 - 52, 176, { family: 'body', weight: 700, size: 28, color: act || done ? P.ink : K.a(P.ink, .32), align: 'right', baseline: 'middle', alpha: kIn });
      X.save(); X.globalAlpha = kIn; X.fillStyle = K.a(P.ink, .09); X.beginPath(); X.roundRect(x0, 206, w, 7, 3.5); X.fill();
      const f = E.sineInOut(prog(t, c.s, c.e - .1)); if (f > 0) { X.fillStyle = P.acc; X.beginPath(); X.roundRect(x1 - w * f, 206, w * f, 7, 3.5); X.fill(); }
      X.restore();
    });

    /* ── كبسولة العنوان: تتحوّل بين المشاهد (العرض يتمدد، النص القديم يطلع فوق والجديد يطلع من تحت) ── */
    let i = -1; for (let j = 0; j < PILLS.length; j++) if (t >= PILLS[j][0]) i = j;
    if (i >= 0) {
      const cur = PILLS[i], prev = i > 0 ? PILLS[i - 1] : [0, null], tk = cur[0], k = E.cubicInOut(prog(t, tk, tk + .45));
      const width = p => { if (!p || !p[1]) return 0; X.save(); X.font = ctx.font('display', 700, 54); const m = X.measureText(p[1]).width; X.restore(); return Math.max(440, m + 230); };
      const w0 = width(prev), w1 = width(cur), on0 = prev[1] ? 1 : 0, on1 = cur[1] ? 1 : 0;
      const vis = on0 + (on1 - on0) * k;
      if (vis > .001) {
        const pw = (w0 || w1) + ((w1 || w0) - (w0 || w1)) * k, ph = 132, cx = 540, cy = 500;
        X.save(); X.globalAlpha = vis; X.translate(cx, cy); const s = .9 + .1 * vis; X.scale(s, s); X.translate(-cx, -cy);
        X.save(); X.shadowColor = 'rgba(20,28,48,.10)'; X.shadowBlur = 30; X.shadowOffsetY = 10;
        X.fillStyle = P.card; X.beginPath(); X.roundRect(cx - pw / 2, cy - ph / 2, pw, ph, ph / 2); X.fill(); X.restore();
        X.lineWidth = 5; X.strokeStyle = P.ink; X.beginPath(); X.roundRect(cx - pw / 2, cy - ph / 2, pw, ph, ph / 2); X.stroke();
        X.beginPath(); X.roundRect(cx - pw / 2 + 4, cy - ph / 2 + 4, pw - 8, ph - 8, ph / 2); X.clip();
        const drawP = (p, dy, al) => { if (!p || !p[1] || al <= 0) return;
          K.emoji(X, p[3], cx + pw / 2 - 74, cy + dy, 54, al);
          ctx.text(X, p[1], cx - 34, cy - 12 + dy, { family: 'display', weight: 700, size: 54, color: P.ink, baseline: 'middle', alpha: al });
          ctx.text(X, p[2], cx - 34, cy + 38 + dy, { family: 'num', weight: 600, size: 20, color: P.acc, baseline: 'middle', dir: 'ltr', letterSpacing: 3, alpha: al }); };
        if (on0 && on1) { drawP(prev, -90 * k, 1 - k); drawP(cur, 90 * (1 - k), k); }
        else drawP(on1 ? cur : prev, 0, 1);
        X.restore();
      }
    }

    /* ── الكابشن بأسلوب المرجع: الكلمات تتجمّع وحدة وحدة، رمادي هادي، والمهمة داكنة بإطار تحديد أو بخط مائل ── */
    const chunks = window.__chunks || (window.__chunks = (() => {
      const out = [];
      for (const L of Object.values(ctx.vo || {})) {
        const ws = L.words; let j = 0;
        while (j < ws.length) { const n = ws.length - j === 4 ? 2 : Math.min(3, ws.length - j); out.push(ws.slice(j, j + n)); j += n; }
      }
      out.sort((a, b) => a[0].s - b[0].s);
      out.forEach((c, j) => { const nx = out[j + 1], end = c[c.length - 1].e; c.s = c[0].s - .06; c.end = nx && nx[0].s - end < .8 ? nx[0].s - .04 : end + .45; });
      return out;
    })());
    const ch = chunks.find(c => t >= c.s && t < c.end);
    if (ch) {
      const size = 58, sp = 22;
      const ws = ch.map(w => ctx.text.westernDigits(w.w));
      X.save(); const wd = ws.map(s => { X.font = SERIF.has(s) ? ctx.font('Aref Ruqaa', 700, size + 8) : ctx.font('body', KEY.has(s) ? 700 : 400, size); return X.measureText(s).width + (KEY.has(s) ? 20 : 0); }); X.restore();
      const total = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
      let x = 540 + total / 2;
      const kOut = 1 - E.cubicIn(prog(t, ch.end - .16, ch.end));
      ch.forEach((w, j) => {
        const s = ws[j], cx = x - wd[j] / 2, k = E.cubicOut(prog(t, w.s - .08, w.s + .2)), al = k * kOut;
        const key = KEY.has(s), serif = SERIF.has(s), y = 335 + (1 - k) * 16;
        if (al > 0) {
          X.save(); const bl = (1 - k) * 10 + (1 - kOut) * 8; if (bl > .3) X.filter = `blur(${bl.toFixed(1)}px)`;
          if (key) {
            const kb = E.cubicOut(prog(t, w.s + .02, w.s + .3)), fw = wd[j] + 12, fh = 82, fx = cx - fw / 2, fy = 335 - fh / 2 - 2;
            X.globalAlpha = al * kb; X.fillStyle = K.a(P.acc, .07); X.fillRect(fx, fy, fw, fh);
            X.strokeStyle = P.acc; X.lineWidth = 2.5; X.strokeRect(fx, fy, fw, fh);
            X.fillStyle = P.acc; [[fx, fy], [fx + fw, fy], [fx, fy + fh], [fx + fw, fy + fh]].forEach(([a, b]) => X.fillRect(a - 5, b - 5, 10, 10));
            X.globalAlpha = 1;
          }
          ctx.text(X, s, cx, y, serif ? { family: 'Aref Ruqaa', weight: 700, size: size + 8, color: P.ink, baseline: 'middle', alpha: al }
            : { family: 'body', weight: key ? 700 : 400, size, color: key ? P.ink : '#9A9CA1', baseline: 'middle', alpha: al });
          X.restore();
        }
        x -= wd[j] + sp;
      });
    }
  },
});
