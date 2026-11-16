/* مشاهد الفيلم (نسخة 2). كبسولة العنوان والكابشن بالستيج.
   الكروت اللي فيها لقطات من الفيديو الأصلي: الصورة الثابتة هني، والحركة الحية تنضاف فوقها بـffmpeg بنفس المكان (K.VC). */
const w = (ctx, l, i) => ctx.wordTime('l' + l, i).s;
/* نوافذ اللقطات الحية (لازم تطابق overlays.json) */
const CLIP = { c2: [5.20, 8.45], c8: [17.80, 20.36], c10: [21.90, 22.58], c12: [25.66, 27.72] };
const clipImg = (id, t) => (t < CLIP[id][1] ? id + 'a' : id + 'b');

/* 1 — أنا عباس الناصر · ومن 2025 وأنا أشتغل على فكرة */
MOTION.scene({ id: 's1', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  // خط قلم يرتسم من اليمين ويوصل للسنة (تحية لأسلوب الفيديو الأصلي)
  const t25 = w(ctx, 2, 1), tF = w(ctx, 2, -1);
  const pen = [[1120, 980], [900, 1010], [760, 940], [640, 1000], [540, 960]];
  const kp = E.cubicInOut(prog(t, .05, t25 - .1));
  const tip = ctx.drawPath(X, pen, kp, { width: 7, color: P.ink, cap: 'round', smooth: true, tip: { r: 9, color: P.acc } });
  // السنة تنفجر من رأس القلم وتعدّ لين 2025
  const kY = E.expoOut(prog(t, t25 - .3, t25 + .25));
  if (kY > 0) {
    const yr = Math.round(2019 + 6 * E.expoOut(prog(t, t25 - .3, t25 + .2)));
    X.save(); X.globalAlpha = kY; X.translate(540, 820); const s = .7 + .3 * kY; X.scale(s, s);
    ctx.text(X, String(yr), 0, 0, { family: 'num', weight: 800, size: 250, color: P.acc, baseline: 'middle', dir: 'ltr', letterSpacing: -6 });
    X.restore();
    K.burst(X, P, 540, 820, prog(t, t25, t25 + .5), 14, 230, 330);
  }
  // كرت الفكرة: لمبة تشتغل
  const kF = K.k(ctx, t, tF - .25, .4);
  K.pop(X, kF, 540, 1220, () => {
    K.card(X, P, 290, 1120, 500, 200, 40);
    const on = E.cubicOut(prog(t, tF, tF + .3)), pulse = .5 + .5 * Math.sin((t - tF) * 6);
    X.save(); X.fillStyle = K.a('#F5C542', (.18 + .12 * pulse) * on); X.beginPath(); X.arc(675, 1220, 72, 0, 7); X.fill(); X.restore();
    K.emoji(X, '💡', 675, 1220, 92);
    ctx.text(X, 'فكرة', 470, 1222, { family: 'display', weight: 700, size: 76, color: P.ink, baseline: 'middle' });
  });
  K.burst(X, P, 675, 1220, prog(t, tF + .05, tF + .6), 10, 80, 150, '#E9B949');
} });

/* 2 — الفكرة جت من مشكلة حقيقية عشتها 6 سنين في مبيعات العقار — لقطة من الفيديو الأصلي */
MOTION.scene({ id: 's2', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, V = K.VC;
  K.clipCard(X, ctx, clipImg('c2', t), K.k(ctx, t, t0 + .1, .4));
  // ختم «مشكلة حقيقية» ينضرب على زاوية الكرت
  const tP = w(ctx, 3, 3), kP = E.cubicOut(prog(t, tP - .05, tP + .18));
  if (kP > 0) {
    X.save(); X.translate(770, V.y + V.h + 50); X.rotate(-.08); const s = 1.5 - .5 * kP; X.scale(s, s); X.globalAlpha = Math.min(1, kP * 1.5);
    X.fillStyle = P.card; X.strokeStyle = P.err; X.lineWidth = 5; X.beginPath(); X.roundRect(-165, -46, 330, 92, 16); X.fill(); X.stroke();
    K.emoji(X, '⚠️', 120, 0, 40);
    ctx.text(X, 'مشكلة حقيقية', -30, 3, { family: 'body', weight: 700, size: 40, color: P.err, baseline: 'middle' });
    X.restore();
  }
  // خط زمني لـ6 سنين (RTL)
  const t6 = w(ctx, 3, 6), y = 1120, x1 = 900, x0 = 180, kL = E.cubicOut(prog(t, t6 - .4, t6 + .9)), kT = K.k(ctx, t, t6 - .6, .35);
  if (kT > 0) {
    X.save(); X.globalAlpha = kT; X.strokeStyle = K.a(P.ink, .14); X.lineWidth = 8; X.lineCap = 'round';
    X.beginPath(); X.moveTo(x1, y); X.lineTo(x0, y); X.stroke();
    X.strokeStyle = P.acc; X.beginPath(); X.moveTo(x1, y); X.lineTo(x1 - (x1 - x0) * kL, y); X.stroke(); X.restore();
    for (let i = 0; i < 6; i++) {
      const x = x1 - (x1 - x0) * (i + 1) / 6, on = kL >= (i + 1) / 6 - .01;
      X.save(); X.globalAlpha = kT; X.fillStyle = on ? P.acc : P.card; X.strokeStyle = on ? P.acc : K.a(P.ink, .25); X.lineWidth = 4;
      X.beginPath(); X.arc(x, y, on ? 18 : 14, 0, 7); X.fill(); X.stroke(); X.restore();
      ctx.text(X, String(i + 1), x, y + 56, { family: 'num', weight: 700, size: 30, color: on ? P.ink : P.mut, baseline: 'middle', dir: 'ltr', alpha: kT });
    }
    K.emoji(X, '🏠', x0 - 10 + 0 * kL, y - 70, 54, E.cubicOut(prog(t, t6 + .7, t6 + 1)));
  }
  K.pop(X, K.k(ctx, t, t6 + .2, .35), 540, 1320, () => K.badge(X, ctx, 540, 1320, '6 سنين في الميدان', 470));
} });

/* 3 — كل طرف الصفقة شايف جزء بس */
MOTION.scene({ id: 's3', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tJ = w(ctx, 4, 4);
  const split = E.cubicInOut(prog(t, tJ - .35, tJ + .25)), cx = 540, top = 650, cw = 380, ph = 116;
  const nodes = [['العميل', 815, '👤'], ['المطوّر', 540, '🏗️'], ['البنك', 265, '🏦']];
  const pieces = ['🪪', '🔑', '💰'];
  for (let i = 0; i < 3; i++) {
    const dx = (nodes[i][1] - cx) * .55 * split, y = top + i * (ph + 14 + 40 * split);
    K.dash(X, P, nodes[i][1], 1220, cx + dx, y + ph / 2, E.cubicOut(prog(t, tJ - .1 + i * .06, tJ + .35 + i * .06)));
  }
  for (let i = 0; i < 3; i++) {
    const k = K.k(ctx, t, t0 + .1 + i * .07, .35);
    const dx = (nodes[i][1] - cx) * .55 * split, y = top + i * (ph + 14 + 40 * split), rot = (i - 1) * .06 * split;
    K.pop(X, k, cx + dx, y + ph / 2, () => {
      X.save(); X.translate(cx + dx, y + ph / 2); X.rotate(rot); X.translate(-(cx + dx), -(y + ph / 2));
      K.card(X, P, cx + dx - cw / 2, y, cw, ph, 22);
      K.emoji(X, pieces[i], cx + dx + cw / 2 - 58, y + ph / 2, 52);
      X.fillStyle = K.a(P.acc, .9); X.fillRect(cx + dx - cw / 2 + 34, y + 36, 130 + i * 24, 14);
      X.fillStyle = K.a(P.ink, .12); X.fillRect(cx + dx - cw / 2 + 34, y + 66, 200 - i * 20, 12);
      X.restore();
    });
  }
  nodes.forEach(([n, x, e], i) => K.pop(X, K.k(ctx, t, t0 + .45 + i * .1, .35), x, 1270, () => K.node(X, ctx, x, 1270, n, false, 240, 96, e)));
  K.pop(X, K.k(ctx, t, tJ + .25, .35), 540, 1420, () => K.badge(X, ctx, 540, 1420, 'كل طرف يشوف جزء', 520));
} });

/* فاصل الفصل: رقم أزرق ضخم */
function chapterNum(ctx, t, n, tIn, label) {
  const { X, P, E, prog } = ctx;
  const k = E.expoOut(prog(t, tIn, tIn + .55));
  if (k <= 0) return;
  X.save(); X.globalAlpha = k; X.translate(540, 900); const s = 1.25 - .25 * k; X.scale(s, s);
  if (k < .98) X.filter = `blur(${((1 - k) * 18).toFixed(1)}px)`;
  ctx.text(X, n, 0, 0, { family: 'num', weight: 800, size: 380, color: P.acc, baseline: 'middle', dir: 'ltr', letterSpacing: -10 });
  X.restore();
  ctx.text(X, label, 540, 1130, { family: 'num', weight: 600, size: 26, color: P.mut, baseline: 'middle', dir: 'ltr', letterSpacing: 10, alpha: K.k(ctx, t, tIn + .25, .35) });
}

/* 4 — فبدأت أرسم الحل */
MOTION.scene({ id: 's4', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  chapterNum(ctx, t, '02', ctx.scene.start + .02, 'THE SOLUTION');
  const tD = w(ctx, 5, 1);
  const tip = ctx.drawPath(X, [[780, 1050], [620, 1064], [460, 1044], [300, 1060]], E.cubicInOut(prog(t, tD - .1, tD + .55)), { width: 8, color: P.ink, cap: 'round', smooth: true });
  if (t > tD - .1) K.emoji(X, '✏️', tip[0] - 10, tip[1] - 40, 64);
} });

/* 5 — مساحة صفقة وحدة */
MOTION.scene({ id: 's5', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tOne = w(ctx, 6, -1), C = [540, 960];
  // الأطراف يطيرون من أماكنهم بالمشهد اللي قبل للمساحة
  const nodes = [['العميل', 830, 720, '👤'], ['المطوّر', 250, 720, '🏗️'], ['البنك', 540, 1250, '🏦']];
  nodes.forEach(([n, x, y], i) => K.dash(X, P, x, y, C[0], C[1], E.cubicOut(prog(t, t0 + .45 + i * .12, t0 + .9 + i * .12))));
  const kC = K.k(ctx, t, t0 + .15, .4), on = E.cubicOut(prog(t, tOne - .05, tOne + .25));
  // حلقات تنبض حول المركز بعد «وحدة»
  for (let r = 0; r < 2; r++) { const q = ctx.fract((t - tOne) * .9 + r * .5); if (t > tOne) { X.save(); X.strokeStyle = K.a(P.acc, .35 * (1 - q)); X.lineWidth = 3; X.beginPath(); X.roundRect(C[0] - 130 - 70 * q, C[1] - 130 - 70 * q, 260 + 140 * q, 260 + 140 * q, 48 + 30 * q); X.stroke(); X.restore(); } }
  K.pop(X, kC, C[0], C[1], () => {
    X.save(); X.shadowColor = K.a(P.acc, .3 * on); X.shadowBlur = 60;
    K.card(X, P, C[0] - 130, C[1] - 130, 260, 260, 48, on > .5 ? P.acc : P.card); X.restore();
    X.lineWidth = 4; X.strokeStyle = P.acc; X.beginPath(); X.roundRect(C[0] - 130, C[1] - 130, 260, 260, 48); X.stroke();
    K.emoji(X, '🤝', C[0], C[1] - 26, 110);
    ctx.text(X, 'صفقة وحدة', C[0], C[1] + 78, { family: 'body', weight: 700, size: 36, color: on > .5 ? P.onAcc : P.ink, baseline: 'middle' });
  });
  nodes.forEach(([n, x, y, e], i) => {
    const k = K.k(ctx, t, t0 + .25 + i * .1, .4), fx = [815, 540, 265][i], fy = 1270;
    const xx = fx + (x - fx) * k, yy = fy + (y - fy) * k;
    K.node(X, ctx, xx, yy, n, false, 240, 96, e);
  });
} });

/* 6 — ومحادثة توثق كل خطوة */
MOTION.scene({ id: 's6', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, x = 110, y = 620, cw = 860, chH = 740;
  K.pop(X, K.k(ctx, t, t0 + .1, .4), 540, y + chH / 2, () => { K.card(X, P, x, y, cw, chH, 32); K.chrome(X, P, x, y, cw, 'DEAL THREAD', ctx); });
  const msgs = [['أرغب بحجز الوحدة A-12', 'CLIENT', 1, '👤'], ['تم تأكيد الحجز', 'DEVELOPER', 0, '🏗️'], ['استلمنا طلب التمويل', 'BANK', 0, '🏦'], ['رفعت المستندات', 'CLIENT', 1, '👤']];
  const times = [w(ctx, 7, 0) + .25, w(ctx, 7, 1), w(ctx, 7, 2), w(ctx, 7, 3)];
  msgs.forEach(([m, who, right, e], i) => {
    const typing = t >= times[i] - .35 && t < times[i];
    const k = K.k(ctx, t, times[i] - .05, .3), my = y + 110 + i * 150, mw = 590, mx = right ? x + cw - 40 - mw : x + 40;
    if (typing && i > 0) {   // نقاط «يكتب…»
      const bx = right ? x + cw - 160 : x + 40;
      X.save(); X.fillStyle = K.a(P.ink, .05); X.beginPath(); X.roundRect(bx, my + 20, 120, 64, 32); X.fill();
      for (let d = 0; d < 3; d++) { const b = .5 + .5 * Math.sin((t * 10) - d); X.fillStyle = K.a(P.ink, .25 + .3 * b); X.beginPath(); X.arc(bx + 34 + d * 26, my + 52 - 4 * b, 7, 0, 7); X.fill(); }
      X.restore();
    }
    K.pop(X, k, mx + mw / 2, my + 52, () => {
      X.fillStyle = right ? K.a(P.acc, .09) : K.a(P.ink, .045); X.strokeStyle = right ? K.a(P.acc, .5) : K.a(P.ink, .12); X.lineWidth = 2.5;
      X.beginPath(); X.roundRect(mx, my, mw, 104, 26); X.fill(); X.stroke();
      K.emoji(X, e, mx + mw - 44, my + 52, 40);
      ctx.text(X, m, mx + mw - 84, my + 52, { family: 'body', weight: 700, size: 33, color: P.ink, align: 'right', baseline: 'middle' });
      ctx.text(X, who, mx + 26, my + 52, { family: 'num', weight: 700, size: 17, color: right ? P.acc : P.mut, align: 'left', dir: 'ltr', baseline: 'middle', letterSpacing: 2 });
    }, 14);
    const kc = E.cubicOut(prog(t, times[i] + .18, times[i] + .45));
    K.check(X, right ? mx - 34 : mx + mw + 34, my + 52, 22, P.ok, kc);
  });
} });

/* 7 — وحالة يشوفها الكل */
MOTION.scene({ id: 's7', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tAll = w(ctx, 8, -1), y = 820, xs = [840, 540, 240], steps = [['عقد', '📝'], ['تمويل', '💰'], ['مستندات', '📂']];
  const kS = K.k(ctx, t, t0 + .12, .35);
  K.pop(X, kS, 540, y, () => { K.card(X, P, 110, y - 170, 860, 320, 34); });
  if (kS > 0) {
    X.save(); X.globalAlpha = kS; X.strokeStyle = K.a(P.ink, .12); X.lineWidth = 6; X.beginPath(); X.moveTo(840, y + 40); X.lineTo(240, y + 40); X.stroke();
    X.strokeStyle = P.acc; X.beginPath(); X.moveTo(840, y + 40); X.lineTo(840 - 600 * E.cubicOut(prog(t, t0 + .25, t0 + .8)), y + 40); X.stroke(); X.restore();
    steps.forEach(([s, e], i) => {
      const done = i < 2, tc = t0 + .3 + i * .18;
      K.emoji(X, e, xs[i], y - 90, 50, kS);
      if (done) K.check(X, xs[i], y + 40, 30, P.ok, E.cubicOut(prog(t, tc, tc + .3)));
      else { const p = .5 + .5 * Math.sin((t - t0) * 8); X.save(); X.globalAlpha = kS; X.fillStyle = K.a(P.acc, .18 + .12 * p); X.beginPath(); X.arc(xs[i], y + 40, 40, 0, 7); X.fill(); X.fillStyle = P.acc; X.beginPath(); X.arc(xs[i], y + 40, 22, 0, 7); X.fill(); X.restore(); }
      ctx.text(X, s, xs[i], y - 26, { family: 'body', weight: 700, size: 38, color: done ? P.ink : P.acc, baseline: 'middle', alpha: kS });
    });
  }
  const ppl = [['العميل', 840, '👤'], ['المطوّر', 540, '🏗️'], ['البنك', 240, '🏦']];
  ppl.forEach(([n, x, e], i) => {
    const k = K.k(ctx, t, t0 + .3 + i * .08, .35), py = 1200, look = E.cubicOut(prog(t, tAll - .2 + i * .05, tAll + .15 + i * .05));
    K.dash(X, P, x, py - 72, x, y + 152, look);
    K.pop(X, k, x, py, () => {
      X.fillStyle = P.card; X.strokeStyle = look > .5 ? P.acc : P.ink; X.lineWidth = 4; X.beginPath(); X.arc(x, py, 68, 0, 7); X.fill(); X.stroke();
      K.emoji(X, look > .5 ? '👀' : e, x, py, 64);
      ctx.text(X, n, x, py + 112, { family: 'body', weight: 700, size: 34, color: P.ink, baseline: 'middle' });
    });
  });
} });

/* 8 — وقائمة مستندات واضحة من البداية — لقطة من الفيديو الأصلي + المستندات */
MOTION.scene({ id: 's8', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start;
  K.clipCard(X, ctx, clipImg('c8', t), K.k(ctx, t, t0 + .1, .4));
  const docs = [['الهوية الوطنية', '🪪'], ['تعريف بالراتب', '💼'], ['عقد الحجز', '📝']];
  const tm = w(ctx, 9, 1), times = [tm, tm + .4, tm + .8];
  docs.forEach(([d, e], i) => {
    const ry = 1090 + i * 108, k = K.k(ctx, t, times[i] - .35, .3), kc = E.cubicOut(prog(t, times[i], times[i] + .3));
    K.pop(X, k, 540, ry, () => {
      K.card(X, P, 230, ry - 44, 620, 88, 44);
      K.emoji(X, e, 790, ry, 44);
      ctx.text(X, d, 740, ry + 2, { family: 'body', weight: 700, size: 38, color: P.ink, align: 'right', baseline: 'middle' });
      X.strokeStyle = K.a(P.ink, .2); X.lineWidth = 3; X.beginPath(); X.arc(290, ry, 24, 0, 7); X.stroke();
    }, 24);
    K.check(X, 290, ry, 26, P.ok, kc);
  });
} });

/* 9 — واللي تشوفها هنا (فاصل 03) */
MOTION.scene({ id: 's9', draw(t, lt, ctx) { chapterNum(ctx, t, '03', ctx.scene.start + .02, 'THE JOURNEY'); } });

/* 10 — جزء صغير بس من الحل: كرت اللقطة يصغر لين يصير قطعة وحدة بشبكة شاشات */
MOTION.scene({ id: 's10', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tS = CLIP.c10[1] + .02, V = K.VC;
  const z = E.cubicInOut(prog(t, tS, tS + .7));
  const tw = 176, th = tw * V.h / V.w, gx = 20, gy = 20, cy = 930;
  // الشبكة حوالين
  if (z > 0) for (let r = -3; r <= 3; r++) for (let c = -2; c <= 2; c++) {
    if (!r && !c) continue;
    const ring = Math.max(Math.abs(r), Math.abs(c)), kk = E.cubicOut(prog(t, tS + .25 + ring * .1, tS + .55 + ring * .1));
    if (kk <= 0) continue;
    const x = 540 + c * (tw + gx) - tw / 2, y = cy + r * (th + gy) - th / 2;
    X.save(); X.globalAlpha = kk * (ring >= 3 ? .5 : 1); X.strokeStyle = K.a(P.ink, .25); X.lineWidth = 3; X.setLineDash([10, 9]);
    X.beginPath(); X.roundRect(x, y, tw, th, 14); X.stroke(); X.restore();
  }
  const R = { x: V.x + (540 - tw / 2 - V.x) * z, y: V.y + (cy - th / 2 - V.y) * z, w: V.w + (tw - V.w) * z, h: V.h + (th - V.h) * z, r: 28 - 14 * z };
  K.clipCard(X, ctx, clipImg('c10', t), K.k(ctx, t, t0 - .15, .3), R);
  K.pop(X, K.k(ctx, t, tS + .8, .35), 540, 1420, () => K.badge(X, ctx, 540, 1420, 'هذا جزء صغير بس', 470));
} });

/* 11 — والرحلة لسه في أولها */
MOTION.scene({ id: 's11', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tB = w(ctx, 12, -1);
  const path = [[880, 1330], [880, 1180], [700, 1120], [380, 1160], [200, 1040], [260, 860], [600, 860], [820, 760], [760, 650]];
  X.save(); X.setLineDash([14, 12]);
  ctx.drawPath(X, path, E.cubicInOut(prog(t, t0 + .1, t0 + 1.1)), { width: 5, color: K.a(P.ink, .3), cap: 'round', smooth: true });
  X.restore();
  ctx.drawPath(X, path.slice(0, 3), E.cubicOut(prog(t, tB - .2, tB + .4)) * .45, { width: 9, color: P.acc, cap: 'round', smooth: true });
  // محطات على الطريق
  [[380, 1160, '🧱'], [200, 1040, '⚙️'], [600, 860, '📈']].forEach(([x, y, e], i) => {
    const k = K.k(ctx, t, t0 + .5 + i * .15, .35);
    K.pop(X, k, x, y, () => { X.fillStyle = P.card; X.strokeStyle = K.a(P.ink, .2); X.lineWidth = 3; X.beginPath(); X.arc(x, y, 44, 0, 7); X.fill(); X.stroke(); K.emoji(X, e, x, y, 44); });
  });
  K.pop(X, K.k(ctx, t, t0 + 1, .35), 760, 610, () => K.emoji(X, '🚩', 778, 600, 90));
  const kd = K.k(ctx, t, t0 + .2, .35), pulse = .5 + .5 * Math.sin((t - t0) * 7);
  if (kd > 0) {
    X.save(); X.globalAlpha = kd; X.fillStyle = K.a(P.acc, .18 + .1 * pulse); X.beginPath(); X.arc(880, 1330, 40 + 8 * pulse, 0, 7); X.fill();
    X.fillStyle = P.acc; X.beginPath(); X.arc(880, 1330, 20, 0, 7); X.fill(); X.restore();
    K.pop(X, kd, 680, 1330, () => { K.card(X, P, 530, 1294, 250, 74, 37); K.emoji(X, '📍', 745, 1331, 34); ctx.text(X, 'احنا هنا', 645, 1333, { family: 'body', weight: 700, size: 34, color: P.acc, baseline: 'middle' }); });
  }
} });

/* 12 — وأطلع لشريك تقني يبني معي الرحلة — لقطة من الفيديو الأصلي + الفكرة تدوّر شريك */
MOTION.scene({ id: 's12', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tB = w(ctx, 13, 3), tM = w(ctx, 13, 4);
  K.clipCard(X, ctx, clipImg('c12', t), K.k(ctx, t, t0 + .1, .4));
  const A = [770, 1180], B = [310, 1180], R = 92;
  K.dash(X, P, A[0] - R - 10, A[1], B[0] + R + 10, B[1], E.cubicOut(prog(t, tB - .15, tB + .45)));
  K.pop(X, K.k(ctx, t, t0 + .3, .4), A[0], A[1], () => {
    X.fillStyle = P.card; X.strokeStyle = P.ink; X.lineWidth = 5; X.beginPath(); X.arc(A[0], A[1], R, 0, 7); X.fill(); X.stroke();
    K.emoji(X, '💡', A[0], A[1], 90);
    ctx.text(X, 'الفكرة', A[0], A[1] + R + 50, { family: 'body', weight: 700, size: 38, color: P.ink, baseline: 'middle' });
  });
  const on = E.cubicOut(prog(t, tM - .05, tM + .3));
  K.pop(X, K.k(ctx, t, t0 + .45, .4), B[0], B[1], () => {
    X.save(); if (on < 1) { X.strokeStyle = P.acc; X.lineWidth = 5; X.setLineDash([16, 12]); X.beginPath(); X.arc(B[0], B[1], R, 0, 7); X.stroke(); }
    X.setLineDash([]); X.globalAlpha = on; X.fillStyle = P.acc; X.beginPath(); X.arc(B[0], B[1], R * (.85 + .15 * on), 0, 7); X.fill(); X.restore();
    if (on < .5) ctx.text(X, '؟', B[0], B[1] + 8, { family: 'display', weight: 700, size: 100, color: P.acc, baseline: 'middle', alpha: 1 - on * 2 });
    else K.emoji(X, '👨‍💻', B[0], B[1], 92);
    ctx.text(X, 'شريك تقني', B[0], B[1] + R + 50, { family: 'body', weight: 700, size: 38, color: P.acc, baseline: 'middle' });
  });
  K.burst(X, P, B[0], B[1], prog(t, tM + .1, tM + .6), 12, R + 10, R + 70);
} });

/* 13 — خلنا نتكلم */
MOTION.scene({ id: 's13', draw(t, lt, ctx) {
  const { X, P, E, prog } = ctx;
  const t0 = ctx.scene.start, tC = w(ctx, 14, 1);
  // فقاعات محادثة تطير حوالين الزر
  [['💬', 260, 760, 0], ['📩', 820, 780, .1], ['☕', 300, 1180, .2], ['🤝', 800, 1170, .3]].forEach(([e, x, y, d]) => {
    const k = K.k(ctx, t, t0 + .2 + d, .4), fl = Math.sin((t - t0) * 2 + d * 10) * 10;
    K.emoji(X, e, x, y + fl + (1 - k) * 40, 76, k);
  });
  const kB = K.k(ctx, t, t0 + .1, .4), press = Math.sin(Math.PI * ctx.clamp((t - tC) / .22, 0, 1));
  K.pop(X, kB, 540, 970, () => {
    X.save(); X.translate(540, 970); const s = 1 - .05 * press; X.scale(s, s);
    X.shadowColor = K.a(P.acc, .35); X.shadowBlur = 50; X.shadowOffsetY = 18;
    X.fillStyle = P.acc; X.beginPath(); X.roundRect(-330, -86, 660, 172, 86); X.fill(); X.restore();
    ctx.text(X, 'خلنا نتكلم', 520, 976, { family: 'display', weight: 700, size: 72, color: P.onAcc, baseline: 'middle' });
    K.emoji(X, '👋', 790, 970, 64);
  });
  const rp = prog(t, tC + .05, tC + .8);
  if (rp > 0 && rp < 1) { X.save(); X.strokeStyle = K.a(P.acc, .5 * (1 - rp)); X.lineWidth = 4; X.beginPath(); X.roundRect(540 - 330 - 60 * rp, 970 - 86 - 60 * rp, 660 + 120 * rp, 172 + 120 * rp, 86 + 60 * rp); X.stroke(); X.restore(); }
  const km = E.cubicInOut(prog(t, t0 + .4, tC - .02)), mx = 860 - 220 * km, my = 1280 - 260 * km;
  if (t > t0 + .35) {
    X.save(); X.translate(mx, my); const s = 1 - .12 * press; X.scale(s, s);
    X.fillStyle = P.ink; X.strokeStyle = '#fff'; X.lineWidth = 4; X.lineJoin = 'round';
    X.beginPath(); X.moveTo(0, 0); X.lineTo(0, 66); X.lineTo(16, 52); X.lineTo(28, 78); X.lineTo(40, 72); X.lineTo(28, 47); X.lineTo(48, 46); X.closePath(); X.stroke(); X.fill(); X.restore();
  }
} });
