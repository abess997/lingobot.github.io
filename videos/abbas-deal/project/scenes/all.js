/* كل مشاهد الفيلم. الكابشن والشريط بالستيج؛ هني المحتوى بس.
   كل الأوقات مطلقة ومأخوذة من كلامه: w(l,i) = بداية الكلمة i بالسطر l. */
const w = (ctx, l, i) => ctx.wordTime('l' + l, i).s;
const PILL_Y = 500;

/* 1 — أنا عباس الناصر · ومن 2025 وأنا أشتغل على فكرة */
MOTION.scene({ id: 's1', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  K.pop(X, K.k(ctx, t, .02, .45), 540, PILL_Y, () => K.pill(X, ctx, 540, PILL_Y, 600, 'عباس الناصر', 'SINCE 2025', K.ic.person));
  // السنة تعدّ لين 2025 مع الكلمة
  const t25 = w(ctx, 2, 1), kY = K.k(ctx, t, t25 - .5, .4);
  const yr = Math.round(2019 + 6 * E.expoOut(prog(t, t25 - .45, t25 + .15)));
  K.pop(X, kY, 540, 860, () => {
    ctx.text(X, String(yr), 540, 880, { family: 'num', weight: 800, size: 250, color: P.acc, baseline: 'middle', dir: 'ltr', letterSpacing: -6 });
    ctx.text(X, 'START', 540, 1030, { family: 'num', weight: 600, size: 24, color: P.mut, baseline: 'middle', dir: 'ltr', letterSpacing: 8 });
  });
  // خط منقّط ينزل لكرت الفكرة
  const tF = w(ctx, 2, -1);
  K.dash(X, P, 540, 1070, 540, 1170, E.cubicOut(prog(t, tF - .7, tF - .2)));
  K.pop(X, K.k(ctx, t, tF - .25, .4), 540, 1260, () => {
    K.card(X, P, 300, 1170, 480, 180, 34);
    const pulse = .5 + .5 * Math.sin((t - tF) * 7);
    X.save(); X.fillStyle = K.a(P.acc, .10 + .06 * pulse); X.beginPath(); X.arc(680, 1260, 58, 0, 7); X.fill(); X.restore();
    K.ic.bulb(X, 680, 1262, 74, P.acc);
    ctx.text(X, 'فكرة', 470, 1262, { family: 'display', weight: 700, size: 70, color: P.ink, baseline: 'middle' });
  });
} });

/* 2 — الفكرة جت من مشكلة حقيقية عشتها 6 سنين في مبيعات العقار */
MOTION.scene({ id: 's2', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start;
  K.pop(X, K.k(ctx, t, w(ctx, 3, -2) - .1, .4), 540, PILL_Y, () => K.pill(X, ctx, 540, PILL_Y, 640, 'مبيعات العقار', 'REAL ESTATE SALES', K.ic.building));
  // مبنى كبير يرتسم
  const kB = E.cubicOut(prog(t, t0 + .1, t0 + .7));
  K.pop(X, kB, 540, 780, () => {
    K.card(X, P, 380, 650, 320, 260, 40);
    K.ic.building(X, 540, 782, 190, P.ink);
  });
  // ختم «مشكلة حقيقية» أحمر مايل
  const tP = w(ctx, 3, 3), kP = K.k(ctx, t, tP - .05, .25);
  if (kP > 0) {
    X.save(); X.translate(790, 700); X.rotate(-.12); const s = 1.25 - .25 * kP; X.scale(s, s); X.globalAlpha = kP;
    X.fillStyle = P.card; X.strokeStyle = P.err; X.lineWidth = 4; X.beginPath(); X.roundRect(-150, -42, 300, 84, 14); X.fill(); X.stroke();
    ctx.text(X, 'مشكلة حقيقية', 0, 3, { family: 'body', weight: 700, size: 40, color: P.err, baseline: 'middle' });
    X.restore();
  }
  // خط زمني: 6 سنين (RTL — تبدأ من اليمين)
  const t6 = w(ctx, 3, 6), y = 1080, x1 = 900, x0 = 180, kL = E.cubicOut(prog(t, t6 - .5, t6 + .9));
  const kT = K.k(ctx, t, t6 - .7, .35);
  if (kT > 0) {
    X.save(); X.globalAlpha = kT; X.strokeStyle = K.a(P.ink, .14); X.lineWidth = 8; X.lineCap = 'round';
    X.beginPath(); X.moveTo(x1, y); X.lineTo(x0, y); X.stroke();
    X.strokeStyle = P.acc; X.beginPath(); X.moveTo(x1, y); X.lineTo(x1 - (x1 - x0) * kL, y); X.stroke(); X.restore();
    for (let i = 0; i < 6; i++) {
      const x = x1 - (x1 - x0) * (i + 1) / 6, on = kL >= (i + 1) / 6 - .01;
      X.save(); X.globalAlpha = kT; X.fillStyle = on ? P.acc : P.card; X.strokeStyle = on ? P.acc : K.a(P.ink, .25); X.lineWidth = 4;
      X.beginPath(); X.arc(x, y, 16, 0, 7); X.fill(); X.stroke(); X.restore();
      ctx.text(X, String(i + 1), x, y + 56, { family: 'num', weight: 700, size: 30, color: on ? P.ink : P.mut, baseline: 'middle', dir: 'ltr', alpha: kT });
    }
  }
  K.pop(X, K.k(ctx, t, t6 + .1, .35), 540, 1300, () => K.badge(X, ctx, 540, 1300, '6 سنين في الميدان', 470));
} });

/* 3 — كل طرف الصفقة شايف جزء بس */
MOTION.scene({ id: 's3', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tJ = w(ctx, 4, 4);
  K.pop(X, K.k(ctx, t, t0 + .05, .4), 540, PILL_Y, () => K.pill(X, ctx, 540, PILL_Y, 520, 'الصفقة', 'ONE DEAL · 3 PARTIES', K.ic.doc));
  // ورقة الصفقة تنقسم ثلاث قطع
  const split = E.cubicInOut(prog(t, tJ - .35, tJ + .25)), cx = 540, top = 640, cw = 360, ph = 110;
  const nodes = [['العميل', 815], ['المطوّر', 540], ['البنك', 265]];
  for (let i = 0; i < 3; i++) {   // الخطوط أول عشان تمر تحت الكروت
    const dx = (nodes[i][1] - cx) * .55 * split, y = top + i * (ph + 14 + 40 * split);
    K.dash(X, P, nodes[i][1], 1270 - 50, cx + dx, y + ph / 2, E.cubicOut(prog(t, tJ - .1 + i * .06, tJ + .35 + i * .06)));
  }
  for (let i = 0; i < 3; i++) {
    const k = K.k(ctx, t, t0 + .15 + i * .07, .35);
    const dx = (nodes[i][1] - cx) * .55 * split, y = top + i * (ph + 14 + 40 * split);
    K.pop(X, k, cx + dx, y + ph / 2, () => {
      K.card(X, P, cx + dx - cw / 2, y, cw, ph, 22);
      X.fillStyle = K.a(P.acc, .9); X.fillRect(cx + dx - cw / 2 + 34, y + 34, 120 + i * 30, 14);
      X.fillStyle = K.a(P.ink, .12); X.fillRect(cx + dx - cw / 2 + 34, y + 64, 220 - i * 20, 12);
    });
    // كل طرف يشوف قطعته بس
    const kn = K.k(ctx, t, t0 + .5 + i * .12, .35), ny = 1270;
    K.pop(X, kn, nodes[i][1], ny, () => K.node(X, ctx, nodes[i][1], ny, nodes[i][0], false, 240, 96));
  }
  K.pop(X, K.k(ctx, t, tJ + .25, .35), 540, 1420, () => K.badge(X, ctx, 540, 1420, 'كل طرف يشوف جزء', 520));
} });

/* 4 — فبدأت أرسم الحل  (فاصل الفصل 02) */
function chapterNum(ctx, t, n, tIn, label) {
  const { X, P, E, prog } = ctx;
  const k = E.expoOut(prog(t, tIn, tIn + .55));
  if (k <= 0) return;
  X.save(); X.globalAlpha = k; X.translate(540, 900); const s = .86 + .14 * k; X.scale(s, s);
  ctx.text(X, n, 0, 0, { family: 'num', weight: 800, size: 380, color: P.acc, baseline: 'middle', dir: 'ltr', letterSpacing: -10 });
  X.restore();
  ctx.text(X, label, 540, 1130, { family: 'num', weight: 600, size: 26, color: P.mut, baseline: 'middle', dir: 'ltr', letterSpacing: 10, alpha: K.k(ctx, t, tIn + .25, .35) });
}
MOTION.scene({ id: 's4', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  chapterNum(ctx, t, '02', ctx.scene.start + .02, 'THE SOLUTION');
  // قلم يرسم خط تحت الرقم مع «أرسم»
  const tD = w(ctx, 5, 1);
  ctx.drawPath(X, [[760, 1050], [620, 1062], [460, 1046], [320, 1058]], E.cubicInOut(prog(t, tD - .1, tD + .55)), { width: 8, color: P.ink, cap: 'round', smooth: true, tip: { r: 7, color: P.acc } });
} });

/* 5 — مساحة صفقة وحدة */
MOTION.scene({ id: 's5', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tOne = w(ctx, 6, -1);
  K.pop(X, K.k(ctx, t, t0 + .05, .4), 540, PILL_Y, () => K.pill(X, ctx, 540, PILL_Y, 600, 'مساحة صفقة', 'ONE DEAL WORKSPACE', K.ic.hand));
  const C = [540, 960];
  const nodes = [['العميل', 830, 720], ['المطوّر', 250, 720], ['البنك', 540, 1250]];
  nodes.forEach(([n, x, y], i) => {
    K.dash(X, P, x, y, C[0], C[1], E.cubicOut(prog(t, t0 + .45 + i * .12, t0 + .9 + i * .12)));
  });
  // المركز: يتعبّى أزرق مع «وحدة»
  const kC = K.k(ctx, t, t0 + .15, .4), on = E.cubicOut(prog(t, tOne - .05, tOne + .25));
  K.pop(X, kC, C[0], C[1], () => {
    X.save(); X.shadowColor = K.a(P.acc, .25 * on); X.shadowBlur = 50;
    K.card(X, P, C[0] - 130, C[1] - 130, 260, 260, 48, on > .5 ? P.acc : P.card); X.restore();
    X.lineWidth = 4; X.strokeStyle = P.acc; X.beginPath(); X.roundRect(C[0] - 130, C[1] - 130, 260, 260, 48); X.stroke();
    K.ic.hand(X, C[0], C[1] - 22, 120, on > .5 ? P.onAcc : P.acc);
    ctx.text(X, 'صفقة وحدة', C[0], C[1] + 70, { family: 'body', weight: 700, size: 36, color: on > .5 ? P.onAcc : P.ink, baseline: 'middle' });
  });
  nodes.forEach(([n, x, y], i) => K.pop(X, K.k(ctx, t, t0 + .3 + i * .1, .35), x, y, () => K.node(X, ctx, x, y, n, false, 250, 96)));
} });

/* 6 — ومحادثة توثق كل خطوة */
MOTION.scene({ id: 's6', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start;
  K.pop(X, K.k(ctx, t, t0 + .05, .4), 540, PILL_Y, () => K.pill(X, ctx, 540, PILL_Y, 560, 'المحادثة', 'EVERY STEP LOGGED', K.ic.chat));
  const x = 110, y = 620, cw = 860, chH = 720;
  K.pop(X, K.k(ctx, t, t0 + .12, .4), 540, y + chH / 2, () => { K.card(X, P, x, y, cw, chH, 32); K.chrome(X, P, x, y, cw, 'DEAL THREAD', ctx); });
  const msgs = [['أرغب بحجز الوحدة A-12', 'CLIENT', 1], ['تم تأكيد الحجز', 'DEVELOPER', 0], ['استلمنا طلب التمويل', 'BANK', 0], ['رفعت المستندات', 'CLIENT', 1]];
  const times = [w(ctx, 7, 0) + .25, w(ctx, 7, 1), w(ctx, 7, 2), w(ctx, 7, 3)];
  msgs.forEach(([m, who, right], i) => {
    const k = K.k(ctx, t, times[i] - .05, .3), my = y + 120 + i * 145, mw = 560, mx = right ? x + cw - 40 - mw : x + 40;
    K.pop(X, k, mx + mw / 2, my + 50, () => {
      X.fillStyle = right ? K.a(P.acc, .09) : K.a(P.ink, .045); X.strokeStyle = right ? K.a(P.acc, .5) : K.a(P.ink, .12); X.lineWidth = 2.5;
      X.beginPath(); X.roundRect(mx, my, mw, 104, 26); X.fill(); X.stroke();
      ctx.text(X, m, mx + mw - 30, my + 52, { family: 'body', weight: 700, size: 34, color: P.ink, align: 'right', baseline: 'middle' });
      ctx.text(X, who, mx + 28, my + 52, { family: 'num', weight: 700, size: 18, color: right ? P.acc : P.mut, align: 'left', dir: 'ltr', baseline: 'middle', letterSpacing: 2 });
    }, 14);
    // علامة توثيق خضراء
    const kc = E.cubicOut(prog(t, times[i] + .18, times[i] + .45));
    if (kc > 0) K.check(X, right ? mx - 34 : mx + mw + 34, my + 52, 22, P.ok, kc);
  });
} });

/* 7 — وحالة يشوفها الكل */
MOTION.scene({ id: 's7', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tAll = w(ctx, 8, -1);
  K.pop(X, K.k(ctx, t, t0 + .05, .4), 540, PILL_Y, () => K.pill(X, ctx, 540, PILL_Y, 600, 'حالة الصفقة', 'SAME STATUS FOR ALL', K.ic.route));
  const y = 820, xs = [840, 540, 240], steps = ['عقد', 'تمويل', 'مستندات'];
  const kS = K.k(ctx, t, t0 + .15, .35);
  K.pop(X, kS, 540, y, () => { K.card(X, P, 110, y - 150, 860, 300, 34); });
  if (kS > 0) {
    X.save(); X.globalAlpha = kS; X.strokeStyle = K.a(P.ink, .12); X.lineWidth = 6; X.beginPath(); X.moveTo(840, y + 10); X.lineTo(240, y + 10); X.stroke();
    X.strokeStyle = P.acc; X.beginPath(); X.moveTo(840, y + 10); X.lineTo(840 - 600 * E.cubicOut(prog(t, t0 + .25, t0 + .8)), y + 10); X.stroke(); X.restore();
    steps.forEach((s, i) => {
      const done = i < 2, tc = t0 + .3 + i * .18;
      if (done) K.check(X, xs[i], y + 10, 30, P.ok, E.cubicOut(prog(t, tc, tc + .3)));
      else { const p = .5 + .5 * Math.sin((t - t0) * 8); X.save(); X.globalAlpha = kS; X.fillStyle = K.a(P.acc, .18 + .12 * p); X.beginPath(); X.arc(xs[i], y + 10, 40, 0, 7); X.fill(); X.fillStyle = P.acc; X.beginPath(); X.arc(xs[i], y + 10, 22, 0, 7); X.fill(); X.restore(); }
      ctx.text(X, s, xs[i], y - 70, { family: 'body', weight: 700, size: 40, color: done ? P.ink : P.acc, baseline: 'middle', alpha: kS });
    });
  }
  // الأطراف الثلاثة يشوفون نفس الحالة
  const ppl = [['العميل', 840, K.ic.person], ['المطوّر', 540, K.ic.building], ['البنك', 240, K.ic.bank]];
  ppl.forEach(([n, x, ic], i) => {
    const k = K.k(ctx, t, t0 + .35 + i * .08, .35), py = 1180;
    K.dash(X, P, x, py - 70, x, y + 150, E.cubicOut(prog(t, tAll - .3 + i * .05, tAll + .1 + i * .05)));
    K.pop(X, k, x, py, () => {
      X.fillStyle = P.card; X.strokeStyle = P.ink; X.lineWidth = 4; X.beginPath(); X.arc(x, py, 66, 0, 7); X.fill(); X.stroke();
      ic(X, x, py, 76, P.ink);
      ctx.text(X, n, x, py + 112, { family: 'body', weight: 700, size: 34, color: P.ink, baseline: 'middle' });
    });
  });
  K.pop(X, K.k(ctx, t, tAll + .05, .3), 540, 1420, () => K.badge(X, ctx, 540, 1420, 'نفس الحالة للكل', 460));
} });

/* 8 — وقائمة مستندات واضحة من البداية */
MOTION.scene({ id: 's8', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start;
  K.pop(X, K.k(ctx, t, t0 + .05, .4), 540, PILL_Y, () => K.pill(X, ctx, 540, PILL_Y, 600, 'المستندات', 'CHECKLIST · DAY ONE', K.ic.doc));
  const x = 150, y = 640, cw = 780, chH = 600;
  K.pop(X, K.k(ctx, t, t0 + .12, .4), 540, y + chH / 2, () => { K.card(X, P, x, y, cw, chH, 32); K.chrome(X, P, x, y, cw, 'DOCUMENTS', ctx); });
  const docs = ['الهوية الوطنية', 'تعريف بالراتب', 'عقد الحجز'];
  const tm = w(ctx, 9, 1), times = [tm, tm + .4, tm + .8];
  let done = 0;
  docs.forEach((d, i) => {
    const ry = y + 140 + i * 120, k = K.k(ctx, t, t0 + .3 + i * .08, .3), kc = E.cubicOut(prog(t, times[i], times[i] + .3));
    if (kc > .5) done++;
    K.pop(X, k, 540, ry, () => {
      X.strokeStyle = K.a(P.ink, .25); X.lineWidth = 3; X.beginPath(); X.roundRect(x + cw - 96, ry - 26, 52, 52, 12); X.stroke();
      ctx.text(X, d, x + cw - 130, ry + 2, { family: 'body', weight: 700, size: 42, color: P.ink, align: 'right', baseline: 'middle' });
      K.ic.doc(X, x + 70, ry, 56, K.a(P.ink, .3));
    }, 10);
    if (kc > 0) K.check(X, x + cw - 70, ry, 30, P.ok, kc);
  });
  // شريط الاكتمال
  const by = y + chH - 110, f = E.cubicOut(prog(t, tm, tm + 1.1)), kb = K.k(ctx, t, t0 + .5, .3);
  if (kb > 0) {
    X.save(); X.globalAlpha = kb; X.fillStyle = K.a(P.ink, .08); X.beginPath(); X.roundRect(x + 50, by, cw - 100, 16, 8); X.fill();
    X.fillStyle = P.acc; X.beginPath(); X.roundRect(x + cw - 50 - (cw - 100) * f, by, (cw - 100) * f, 16, 8); X.fill(); X.restore();
    ctx.text(X, done + ' / 3', x + 50, by + 56, { family: 'num', weight: 700, size: 30, color: P.ink, align: 'left', dir: 'ltr', baseline: 'middle', alpha: kb });
  }
  const tB = w(ctx, 9, -1);
  K.pop(X, K.k(ctx, t, tB - .1, .35), 540, 1400, () => K.badge(X, ctx, 540, 1400, 'واضحة من أول يوم', 480));
} });

/* 9 — واللي تشوفها هنا  (فاصل الفصل 03) */
MOTION.scene({ id: 's9', draw(t, lt, ctx) { chapterNum(ctx, t, '03', ctx.scene.start + .02, 'THE JOURNEY'); } });

/* 10 — جزء صغير بس من الحل */
MOTION.scene({ id: 's10', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tS = w(ctx, 11, 1);
  // شبكة قطع: وحدة معبّاة والباقي فاضي — ومع «صغير» تكبر الشبكة فتصغر القطعة
  const zoom = E.cubicInOut(prog(t, tS - .2, tS + .5)), n = 7, size = 200 - 70 * zoom, gap = 18 - 6 * zoom;
  const cx = 540, cy = 920;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const dr = r - 3, dc = c - 3, ring = Math.max(Math.abs(dr), Math.abs(dc));
    const vis = ring <= 1 ? 1 : zoom * E.cubicOut(prog(t, tS + (ring - 2) * .12, tS + .3 + (ring - 2) * .12));
    if (vis <= 0) continue;
    const kk = ring === 0 ? K.k(ctx, t, t0 + .05, .35) : ring === 1 ? K.k(ctx, t, t0 + .15 + (r + c) * .02, .3) : vis;
    const x = cx + dc * (size + gap) - size / 2, y = cy + dr * (size + gap) - size / 2;
    X.save(); X.globalAlpha = kk * (ring >= 3 ? .6 : 1);
    if (ring === 0) { X.fillStyle = P.acc; X.beginPath(); X.roundRect(x, y, size, size, size * .16); X.fill(); }
    else { X.strokeStyle = K.a(P.ink, .25); X.lineWidth = 3; X.setLineDash([10, 9]); X.beginPath(); X.roundRect(x, y, size, size, size * .16); X.stroke(); }
    X.restore();
  }
  ctx.text(X, 'هنا', cx, cy + 2, { family: 'body', weight: 700, size: 46 - 18 * zoom, color: P.onAcc, baseline: 'middle', alpha: K.k(ctx, t, t0 + .2, .3) });
  K.pop(X, K.k(ctx, t, tS + .35, .35), 540, 1420, () => K.badge(X, ctx, 540, 1420, 'هذا جزء صغير بس', 470));
} });

/* 11 — والرحلة لسه في أولها */
MOTION.scene({ id: 's11', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tB = w(ctx, 12, -1);
  K.pop(X, K.k(ctx, t, t0 + .05, .4), 540, PILL_Y, () => K.pill(X, ctx, 540, PILL_Y, 520, 'الرحلة', 'JUST GETTING STARTED', K.ic.route));
  // طريق متعرّج طويل منقّط، والنقطة الزرقاء عند البداية
  const path = [[880, 1330], [880, 1180], [700, 1120], [380, 1160], [200, 1040], [260, 860], [600, 860], [820, 760], [760, 640]];
  const kp = E.cubicInOut(prog(t, t0 + .1, t0 + 1.1));
  X.save(); X.setLineDash([14, 12]);
  ctx.drawPath(X, path, kp, { width: 5, color: K.a(P.ink, .3), cap: 'round', smooth: true });
  X.restore();
  // الجزء المقطوع (صغير جداً)
  ctx.drawPath(X, path.slice(0, 3), E.cubicOut(prog(t, tB - .2, tB + .4)) * .45, { width: 9, color: P.acc, cap: 'round', smooth: true });
  // علم النهاية
  const kf = K.k(ctx, t, t0 + 1, .35);
  K.pop(X, kf, 760, 620, () => { X.strokeStyle = P.ink; X.lineWidth = 5; X.beginPath(); X.moveTo(760, 640); X.lineTo(760, 560); X.stroke(); X.fillStyle = P.ink; X.beginPath(); X.moveTo(760, 560); X.lineTo(820, 578); X.lineTo(760, 598); X.fill(); });
  // «احنا هنا»
  const kd = K.k(ctx, t, t0 + .2, .35), pulse = .5 + .5 * Math.sin((t - t0) * 7);
  if (kd > 0) {
    X.save(); X.globalAlpha = kd; X.fillStyle = K.a(P.acc, .18 + .1 * pulse); X.beginPath(); X.arc(880, 1330, 40 + 8 * pulse, 0, 7); X.fill();
    X.fillStyle = P.acc; X.beginPath(); X.arc(880, 1330, 20, 0, 7); X.fill(); X.restore();
    K.pop(X, kd, 700, 1330, () => { K.card(X, P, 560, 1296, 230, 70, 35); ctx.text(X, 'احنا هنا', 675, 1333, { family: 'body', weight: 700, size: 34, color: P.acc, baseline: 'middle' }); });
  }
} });

/* 12 — وأطلع لشريك تقني يبني معي الرحلة */
MOTION.scene({ id: 's12', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tP = w(ctx, 13, 1), tB = w(ctx, 13, 3), tM = w(ctx, 13, 4);
  K.pop(X, K.k(ctx, t, tP - .1, .4), 540, PILL_Y, () => K.pill(X, ctx, 540, PILL_Y, 600, 'شريك تقني', 'TECHNICAL PARTNER', K.ic.hand));
  const A = [790, 930], B = [290, 930], R = 120;
  // الخط بينهم يرتسم مع «يبني»
  K.dash(X, P, A[0] - R - 10, A[1], B[0] + R + 10, B[1], E.cubicOut(prog(t, tB - .15, tB + .45)));
  // عباس
  K.pop(X, K.k(ctx, t, t0 + .1, .4), A[0], A[1], () => {
    X.fillStyle = P.card; X.strokeStyle = P.ink; X.lineWidth = 5; X.beginPath(); X.arc(A[0], A[1], R, 0, 7); X.fill(); X.stroke();
    ctx.text(X, 'ع', A[0], A[1] + 6, { family: 'display', weight: 700, size: 110, color: P.ink, baseline: 'middle' });
    ctx.text(X, 'عباس', A[0], A[1] + R + 60, { family: 'body', weight: 700, size: 42, color: P.ink, baseline: 'middle' });
  });
  // الشريك: دائرة منقّطة «؟» تتعبّى أزرق مع «معي»
  const on = E.cubicOut(prog(t, tM - .05, tM + .3));
  K.pop(X, K.k(ctx, t, t0 + .3, .4), B[0], B[1], () => {
    X.save(); if (on < 1) { X.strokeStyle = P.acc; X.lineWidth = 5; X.setLineDash([16, 12]); X.beginPath(); X.arc(B[0], B[1], R, 0, 7); X.stroke(); }
    X.setLineDash([]); X.globalAlpha = on; X.fillStyle = P.acc; X.beginPath(); X.arc(B[0], B[1], R * (.85 + .15 * on), 0, 7); X.fill(); X.restore();
    if (on < .5) ctx.text(X, '؟', B[0], B[1] + 8, { family: 'display', weight: 700, size: 120, color: P.acc, baseline: 'middle', alpha: 1 - on * 2 });
    else K.ic.person(X, B[0], B[1] + 6, 130, P.onAcc);
    ctx.text(X, 'أنت؟', B[0], B[1] + R + 60, { family: 'body', weight: 700, size: 42, color: P.acc, baseline: 'middle' });
  });
  K.pop(X, K.k(ctx, t, w(ctx, 13, -1) - .05, .35), 540, 1340, () => K.badge(X, ctx, 540, 1340, 'نبني الرحلة سوا', 460));
} });

/* 13 — خلنا نتكلم */
MOTION.scene({ id: 's13', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tC = w(ctx, 14, 1);
  // كرت التعريف
  K.pop(X, K.k(ctx, t, t0 + .05, .4), 540, 640, () => {
    K.card(X, P, 190, 560, 700, 170, 40);
    X.fillStyle = P.card; X.strokeStyle = P.ink; X.lineWidth = 4; X.beginPath(); X.arc(780, 645, 52, 0, 7); X.fill(); X.stroke();
    ctx.text(X, 'ع', 780, 650, { family: 'display', weight: 700, size: 52, color: P.ink, baseline: 'middle' });
    ctx.text(X, 'عباس الناصر', 690, 620, { family: 'display', weight: 700, size: 46, color: P.ink, align: 'right', baseline: 'middle' });
    ctx.text(X, 'يدوّر شريك تقني', 690, 676, { family: 'body', weight: 400, size: 32, color: P.mut, align: 'right', baseline: 'middle' });
  });
  // الزر الأزرق + ضغطة
  const kB = K.k(ctx, t, t0 + .2, .4), press = Math.sin(Math.PI * ctx.clamp((t - tC) / .22, 0, 1));
  K.pop(X, kB, 540, 960, () => {
    X.save(); X.translate(540, 960); const s = 1 - .05 * press; X.scale(s, s);
    X.shadowColor = K.a(P.acc, .35); X.shadowBlur = 50; X.shadowOffsetY = 18;
    X.fillStyle = P.acc; X.beginPath(); X.roundRect(-320, -82, 640, 164, 82); X.fill(); X.restore();
    ctx.text(X, 'خلنا نتكلم', 540, 966, { family: 'display', weight: 700, size: 70, color: P.onAcc, baseline: 'middle' });
  });
  // موجة بعد الضغطة
  const rp = prog(t, tC + .05, tC + .8);
  if (rp > 0 && rp < 1) { X.save(); X.strokeStyle = K.a(P.acc, .5 * (1 - rp)); X.lineWidth = 4; X.beginPath(); X.roundRect(540 - 320 - 60 * rp, 960 - 82 - 60 * rp, 640 + 120 * rp, 164 + 120 * rp, 82 + 60 * rp); X.stroke(); X.restore(); }
  // مؤشر الماوس يجي للزر
  const km = E.cubicInOut(prog(t, t0 + .4, tC - .02)), mx = 860 - 220 * km, my = 1260 - 250 * km;
  if (t > t0 + .35) {
    X.save(); X.translate(mx, my); const s = 1 - .12 * press; X.scale(s, s);
    X.fillStyle = P.ink; X.strokeStyle = '#fff'; X.lineWidth = 4; X.lineJoin = 'round';
    X.beginPath(); X.moveTo(0, 0); X.lineTo(0, 66); X.lineTo(16, 52); X.lineTo(28, 78); X.lineTo(40, 72); X.lineTo(28, 47); X.lineTo(48, 46); X.closePath(); X.stroke(); X.fill(); X.restore();
  }
  K.pop(X, K.k(ctx, t, tC + .4, .4), 540, 1200, () => K.badge(X, ctx, 540, 1200, 'تواصل معي', 360));
} });
