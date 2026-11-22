'use strict';

window.Lens = (() => {
  const T = (k, v) => T2(k, v);
  const MAXPX = 1000,
    GAL_MAX = 6;
  const L = {
    img: null,
    W: 0,
    H: 0,
    P: { x: 0, y: 0 },
    ap: 0,
    dx: 0,
    N: 10,
    origin: 'c',
    grid: true,
    kind: 'bridge',
    label: '',
    pts: null,
    drag: null,
    cam: null,
    raf: 0,
  };
  const $q = (s) => document.querySelector('#lnz ' + s);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const org = () => (L.origin === 'c' ? { x: L.W / 2, y: L.H / 2 } : L.origin === 'b' ? { x: L.W / 2, y: L.H } : { x: 0, y: L.H });
  const sc = () => L.W / L.N;
  const math = () => {
    const o = org(),
      s = sc();
    return { h: (L.P.x - o.x) / s, k: (o.y - L.P.y) / s, a: L.ap * s };
  };
  const setMath = (h, k, a) => {
    const o = org(),
      s = sc();
    L.P.x = o.x + h * s;
    L.P.y = o.y - k * s;
    L.ap = a / s;
  };
  const yAt = (x) => L.P.y - L.ap * (x - L.P.x) ** 2;

  function fixDx() {
    const sg = L.dx < 0 ? -1 : 1;
    let d = Math.abs(L.dx);
    const y = L.P.y - L.ap * d * d;
    if (d < 14 || y < 12 || y > L.H - 12) {
      if (Math.abs(L.ap) > 1e-9) {
        const ty = clamp(y, 14, L.H - 14);
        d = Math.sqrt(Math.abs(L.P.y - ty) / Math.abs(L.ap));
      } else d = L.W * 0.2;
      d = clamp(d, 14, L.W * 0.45);
    }
    L.dx = sg * d;
  }
  function defCurve() {
    L.P = { x: L.W / 2, y: L.H * 0.34 };
    const w = L.W * 0.3,
      h = L.H * 0.3;
    L.ap = h / (w * w);
    L.dx = L.W * 0.18;
    L.pts = null;
  }

  const rd = (v, d = 2) => {
    const p = 10 ** d,
      x = Math.round(v * p) / p;
    return Object.is(x, -0) ? 0 : x;
  };
  const nf = (v, d = 2) => String(rd(v, d));
  const coef = (a) => (a === 1 ? '' : a === -1 ? '-' : String(a));
  function eq() {
    const m = math(),
      dA = Math.abs(m.a) < 0.1 ? 3 : 2,
      a = rd(m.a, dA),
      h = rd(m.h),
      k = rd(m.k),
      b = rd(-2 * m.a * m.h),
      c = rd(m.a * m.h * m.h + m.k);
    const kt = (v) => (v === 0 ? '' : v > 0 ? ' + ' + v : ' - ' + -v);
    const vf = `y = ${h === 0 ? coef(a) + 'x^2' : coef(a) + '(x ' + (h > 0 ? '- ' + h : '+ ' + -h) + ')^2'}${kt(k)}`;
    const ab = Math.abs(b);
    const sf = `y = ${coef(a)}x^2${b === 0 ? '' : (b < 0 ? ' - ' : ' + ') + (ab === 1 ? '' : ab) + 'x'}${kt(c)}`;

    const mi = (s) => s.replace(/-/g, '−').replace(/\^2/g, '²').replace(/ \+ /g, ' + ').replace(/x(?=²)/g, 'x');
    const D = -4 * m.a * m.k,
      rt = Math.abs(m.a) > 1e-9 ? -m.k / m.a : -1;
    let roots = null;
    if (Math.abs(m.a) > 1e-9 && rt >= 0) {
      const r = Math.sqrt(rt);
      roots = r < 0.005 ? [m.h] : [m.h - r, m.h + r];
    }
    return { m, a, h, k, b, c, vf, sf, pvf: mi(vf), psf: mi(sf), D, roots, yint: m.a * m.h * m.h + m.k };
  }
  function resultHTML() {
    const e = eq(),
      flat = Math.abs(e.m.a) < 0.005,
      hh = nf(e.m.h),
      kk = nf(e.m.k);
    const tipKey = L.kind === 'ball' ? 'ln_tip_ball' : L.kind === 'fountain' ? 'ln_tip_fountain' : L.kind === 'bridge' || L.kind === 'gate' ? 'ln_tip_arch' : 'ln_tip_other';
    const roots = e.roots ? (e.roots.length === 1 ? `$x = ${nf(e.roots[0])}$` : `$x_1 = ${nf(e.roots[0])},\\ x_2 = ${nf(e.roots[1])}$`) : T('ln_r_noroots');
    return `<h3>${T('ln_res_h')}</h3>
<p class="lneq"><small class="mut">${T('ln_r_vertex')}</small><br>$${e.vf}$</p>
<p class="lneq"><small class="mut">${T('ln_r_std')}</small><br>$${e.sf}$</p>
<ul class="l lnfacts"><li>${T('ln_r_top')}: $(${hh},\\ ${kk})$</li><li>${T('ln_r_axis')}: $x = ${hh}$</li><li>${T('ln_r_yint')}: $(0,\\ ${nf(e.yint)})$</li><li>${T('ln_r_roots')}: ${roots}</li><li>${T('ln_r_disc')}: $D = ${nf(e.D)}$</li></ul>
<p class="lnins">${flat ? T('ln_i_flat') : T(e.m.a < 0 ? 'ln_i_down' : 'ln_i_up', { h: hh, k: kk })}</p><p class="mut sm">${T(tipKey)}</p>`;
  }

  function niceStep(s) {
    for (const u of [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100]) if (u * s >= 38) return u;
    return 200;
  }
  function drawGrid(ctx) {
    const o = org(),
      s = sc(),
      u = niceStep(s),
      st = u * s;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `600 ${Math.max(11, Math.round(L.W / 70))}px Rajdhani, sans-serif`;
    const f = Math.max(11, Math.round(L.W / 70));
    ctx.beginPath();
    for (let i = Math.ceil(-o.x / st); o.x + i * st <= L.W; i++) {
      const x = o.x + i * st;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, L.H);
    }
    for (let i = Math.ceil((o.y - L.H) / st); o.y - i * st >= 0; i++) {
      const y = o.y - i * st;
      ctx.moveTo(0, y);
      ctx.lineTo(L.W, y);
    }
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.moveTo(o.x, 0);
    ctx.lineTo(o.x, L.H);
    ctx.moveTo(0, o.y);
    ctx.lineTo(L.W, o.y);
    ctx.stroke();
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    const lab = (t, x, y) => ctx.fillText(t, x, y);
    for (let i = Math.ceil(-o.x / st); o.x + i * st <= L.W; i++) i && lab(nf(i * u, 2), o.x + i * st + 3, clamp(o.y + f + 2, f + 2, L.H - 4));
    for (let i = Math.ceil((o.y - L.H) / st); o.y - i * st >= 0; i++) i && lab(nf(i * u, 2), clamp(o.x + 4, 2, L.W - 36), o.y - i * st - 3);
    ctx.restore();
  }
  function drawCurve(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, L.W, L.H);
    ctx.clip();
    ctx.lineJoin = ctx.lineCap = 'round';
    const path = () => {
      ctx.beginPath();
      for (let x = 0; x <= L.W; x += 3) (x ? ctx.lineTo : ctx.moveTo).call(ctx, x, yAt(x));
      ctx.lineTo(L.W, yAt(L.W));
    };
    ctx.setLineDash([]);
    path();
    ctx.lineWidth = Math.max(7, L.W / 120);
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.stroke();
    path();
    ctx.lineWidth = Math.max(4, L.W / 220);
    ctx.strokeStyle = '#5ee6f2';
    ctx.shadowColor = '#5ee6f2';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.setLineDash([10, 8]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(190,140,255,0.95)';
    ctx.beginPath();
    ctx.moveTo(L.P.x, 0);
    ctx.lineTo(L.P.x, L.H);
    ctx.stroke();
    ctx.restore();
  }
  const dot = (ctx, x, y, r, fill, ring) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 7);
    ctx.fillStyle = fill;
    ctx.strokeStyle = ring;
    ctx.lineWidth = Math.max(2.5, r / 4);
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  function paintTo(ctx, opts) {
    ctx.drawImage(L.img, 0, 0, L.W, L.H);
    if (opts.grid) drawGrid(ctx);
    drawCurve(ctx);
    const R = Math.max(11, L.W / 70);
    if (opts.handles) {
      const cx = L.P.x + L.dx;
      dot(ctx, cx, yAt(cx), R * 0.9, '#f472a8', '#fff');
      dot(ctx, L.P.x, L.P.y, R, '#ffd86b', '#6a4a00');
    } else dot(ctx, L.P.x, L.P.y, R * 0.7, '#ffd86b', '#6a4a00');
    (L.pts || []).forEach((p, i) => {
      dot(ctx, p.x, p.y, R * 0.8, '#4cc38a', '#fff');
      ctx.save();
      ctx.fillStyle = '#04120a';
      ctx.font = `800 ${Math.round(R * 1.1)}px Orbitron, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), p.x, p.y + 1);
      ctx.restore();
    });
  }
  function draw() {
    const c = document.getElementById('lnc');
    if (!c || !L.img) return;
    if (c.width !== L.W || c.height !== L.H) {
      c.width = L.W;
      c.height = L.H;
    }
    paintTo(c.getContext('2d'), { grid: L.grid, handles: true });
  }

  function sync() {
    if (L.raf) return;
    L.raf = requestAnimationFrame(() => {
      L.raf = 0;
      if (!document.getElementById('lnz')) return;
      draw();
      const m = math(),
        a = document.activeElement;
      const set = (id, v) => {
        const e = $q('#' + id),
          n = $q('#' + id + 'n');
        e && a !== e && (e.value = v);
        n && a !== n && (n.value = rd(v, 3));
      };
      set('lnh', m.h);
      set('lnk', m.k);
      set('lna', m.a);
      const r = $q('#lnres');
      if (r && L.img) {
        r.innerHTML = resultHTML();
        window.renderMath && renderMath(r);
      }
      const nv = $q('#lnnv');
      nv && (nv.textContent = L.N);
    });
  }
  function ranges() {
    const A = 40 / L.N;
    const rg = (id, lo, hi, st) => {
      const e = $q('#' + id);
      if (e) {
        e.min = lo;
        e.max = hi;
        e.step = st;
      }
    };
    rg('lnh', -L.N, L.N, 0.01);
    rg('lnk', -L.N, L.N, 0.01);
    rg('lna', -A, A, 0.005);
  }

  function setImage(src, w, h) {
    const k = Math.min(1, MAXPX / Math.max(w, h)),
      W = Math.max(2, Math.round(w * k)),
      H = Math.max(2, Math.round(h * k)),
      c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    c.getContext('2d').drawImage(src, 0, 0, W, H);
    L.img = c;
    L.W = W;
    L.H = H;
    defCurve();
    show();
  }
  function loadFile(f) {
    if (!f) return;
    const url = URL.createObjectURL(f),
      im = new Image();
    im.onload = () => {
      try {
        setImage(im, im.naturalWidth, im.naturalHeight);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    im.onerror = () => {
      URL.revokeObjectURL(url);
      toast(T('ln_load_err'));
    };
    im.src = url;
  }

  function sample() {
    const W = 960,
      H = 600,
      c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d');
    const sky = x.createLinearGradient(0, 0, 0, H * 0.55);
    sky.addColorStop(0, '#5aa7ff');
    sky.addColorStop(1, '#d6ecff');
    x.fillStyle = sky;
    x.fillRect(0, 0, W, H);
    x.fillStyle = '#fff';
    [[160, 90, 60], [300, 70, 44], [740, 110, 64], [860, 70, 40]].forEach(([cx, cy, r]) => {
      x.globalAlpha = 0.85;
      x.beginPath();
      x.arc(cx, cy, r, 0, 7);
      x.arc(cx + r * 0.8, cy + 8, r * 0.75, 0, 7);
      x.arc(cx - r * 0.8, cy + 10, r * 0.7, 0, 7);
      x.fill();
    });
    x.globalAlpha = 1;
    x.fillStyle = '#4f8f4a';
    x.fillRect(0, 440, W, 40);
    const wt = x.createLinearGradient(0, 470, 0, H);
    wt.addColorStop(0, '#2f7fb8');
    wt.addColorStop(1, '#14507a');
    x.fillStyle = wt;
    x.fillRect(0, 470, W, H - 470);
    x.fillStyle = '#8d8f95';
    x.fillRect(60, 190, 840, 280);
    x.fillStyle = '#a3a5ab';
    x.fillRect(60, 190, 840, 22);
    x.strokeStyle = 'rgba(60,60,70,0.45)';
    x.lineWidth = 2;
    for (let r = 0; r < 12; r++) {
      const y = 212 + r * 22;
      x.beginPath();
      x.moveTo(60, y);
      x.lineTo(900, y);
      x.stroke();
      for (let b = (r % 2) * 30; b < 840; b += 60) {
        x.beginPath();
        x.moveTo(60 + b, y);
        x.lineTo(60 + b, y + 22);
        x.stroke();
      }
    }

    x.beginPath();
    x.moveTo(236, 470);
    for (let px = 236; px <= 724; px += 4) x.lineTo(px, 255 + 0.0036 * (px - 480) ** 2);
    x.lineTo(724, 470);
    x.closePath();
    const hole = x.createLinearGradient(0, 255, 0, 470);
    hole.addColorStop(0, '#9fd0f0');
    hole.addColorStop(1, '#2f7fb8');
    x.fillStyle = hole;
    x.fill();
    x.strokeStyle = '#5a5c63';
    x.lineWidth = 8;
    x.stroke();
    x.fillStyle = '#6f7178';
    for (let p = 70; p <= 890; p += 52) x.fillRect(p, 160, 14, 34);
    x.fillRect(60, 158, 840, 10);
    x.fillStyle = '#2f6b2c';
    [[30, 410, 50], [930, 400, 56]].forEach(([tx, ty, r]) => {
      x.beginPath();
      x.arc(tx, ty, r, 0, 7);
      x.fill();
    });
    L.kind = 'bridge';
    L.label = T('ln_sample_name');
    setImage(c, W, H);

    L.P = { x: W / 2 - 40, y: 215 };
    L.ap = 0.0026;
    L.dx = 160;
    L.N = 10;
    L.origin = 'b';
    ranges();
    show();
  }
  async function camOpen() {
    const box = $q('#lncam');
    if (!box) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false }),
        v = box.querySelector('video');
      L.cam = { stream, v };
      v.srcObject = stream;
      await v.play().catch(() => {});
      box.hidden = false;
    } catch (e) {
      camClose();
      toast(T('ln_cam_err'));
    }
  }
  function camClose() {
    if (L.cam) {
      try {
        L.cam.stream.getTracks().forEach((t) => t.stop());
      } catch (e) {

      }
      L.cam = null;
    }
    const box = document.getElementById('lncam');
    if (box) {
      box.hidden = true;
      const v = box.querySelector('video');
      v && (v.srcObject = null);
    }
  }
  function camSnap() {
    const v = L.cam && L.cam.v;
    if (!v || !v.videoWidth) return;
    setImage(v, v.videoWidth, v.videoHeight);
    camClose();
  }
  function show() {
    const has = !!L.img;
    const w = $q('#lncw'),
      e = $q('#lnempty'),
      ctl = $q('#lnctl'),
      res = $q('#lnres'),
      acts = $q('#lnout');
    if (!w) return;
    w.hidden = !has;
    e.hidden = has;
    ctl.hidden = !has;
    res.hidden = !has;
    acts.hidden = !has;
    const set = (id, v) => {
      const x = $q('#' + id);
      x && (x.value = v);
    };
    set('lnn', L.N);
    set('lnor', L.origin);
    set('lnkind', L.kind);
    set('lnlab', L.label);
    const g = $q('#lngr');
    g && (g.checked = L.grid);
    ranges();
    has && fixDx();
    sync();
  }

  function fit3() {
    const [p1, p2, p3] = L.pts,
      d = (p1.x - p2.x) * (p1.x - p3.x) * (p2.x - p3.x);
    const A = (p3.x * (p2.y - p1.y) + p2.x * (p1.y - p3.y) + p1.x * (p3.y - p2.y)) / d;
    if (Math.abs(d) < 200 || !isFinite(A) || Math.abs(A) < 1e-9) {
      toast(T('ln_3p_bad'));
      return false;
    }
    const B = (p3.x ** 2 * (p1.y - p2.y) + p2.x ** 2 * (p3.y - p1.y) + p1.x ** 2 * (p2.y - p3.y)) / d,
      C = (p2.x * p3.x * (p2.x - p3.x) * p1.y + p3.x * p1.x * (p3.x - p1.x) * p2.y + p1.x * p2.x * (p1.x - p2.x) * p3.y) / d;
    L.P = { x: -B / (2 * A), y: C - (B * B) / (4 * A) };
    L.ap = -A;
    L.dx = p3.x - L.P.x >= 0 ? Math.max(14, p3.x - L.P.x) : Math.min(-14, p3.x - L.P.x);
    return true;
  }
  function set3(on) {
    L.pts = on ? [] : null;
    const b = $q('#ln3p'),
      s = $q('#ln3s');
    if (b) b.textContent = T(on ? 'ln_3p_cancel' : 'ln_3p');
    if (s) s.textContent = on ? T('ln_3p_on', { n: 0 }) : '';
    sync();
  }

  function pos(e) {
    const c = e.currentTarget,
      r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * L.W) / r.width, y: ((e.clientY - r.top) * L.H) / r.height, k: L.W / r.width };
  }
  function down(e) {
    if (!L.img) return;
    const p = pos(e);
    if (L.pts) {
      L.pts.push({ x: p.x, y: p.y });
      const s = $q('#ln3s');
      if (L.pts.length < 3) s && (s.textContent = T('ln_3p_on', { n: L.pts.length }));
      else {
        if (fit3()) {
          L.pts = null;
          set3(false);
          fixDx();
        } else {
          L.pts = [];
          s && (s.textContent = T('ln_3p_on', { n: 0 }));
        }
      }
      return sync();
    }
    const R = 28 * p.k,
      cx = L.P.x + L.dx,
      cy = yAt(cx);
    if (Math.hypot(p.x - L.P.x, p.y - L.P.y) <= R) L.drag = 'v';
    else if (Math.hypot(p.x - cx, p.y - cy) <= R) L.drag = 'c';
    else return;
    e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function move(e) {
    if (!L.drag) return;
    const p = pos(e);
    if (L.drag === 'v') {
      L.P.x = clamp(p.x, -L.W, 2 * L.W);
      L.P.y = clamp(p.y, -L.H, 2 * L.H);
    } else {
      let d = p.x - L.P.x;
      if (Math.abs(d) < 14) d = (L.dx < 0 ? -1 : 1) * 14;
      L.dx = d;
      L.ap = (L.P.y - p.y) / (d * d);
    }
    sync();
  }
  const up = () => {
    L.drag = null;
  };

  function compose(maxW) {
    const e = eq(),
      W = L.W,
      f = Math.max(17, Math.round(W * 0.026)),
      ph = Math.round(f * 7.6),
      c = document.createElement('canvas');
    c.width = W;
    c.height = L.H + ph;
    const x = c.getContext('2d');
    paintTo(x, { grid: L.grid, handles: false });
    x.fillStyle = '#0b1030';
    x.fillRect(0, L.H, W, ph);
    x.fillStyle = '#4d8bff';
    x.fillRect(0, L.H, W, 3);
    const fam = 'Rajdhani, "Noto Sans JP", "Noto Sans KR", sans-serif',
      kinds = { bridge: 'ln_k_bridge', fountain: 'ln_k_fountain', ball: 'ln_k_ball', gate: 'ln_k_gate', other: 'ln_k_other' };
    const line = (t, y, col, size, wt) => {
      x.fillStyle = col;
      x.font = `${wt || 700} ${size || f}px ${fam}`;
      x.fillText(t, f, y);
    };
    const nm = L.label ? ' | ' + L.label : '';
    line(`${T('ln_x_title')}: ${T(kinds[L.kind] || 'ln_k_other')}${nm}`, L.H + f * 1.7, '#ffd86b', f * 1.05, 800);
    line(`${T('ln_r_vertex')}:  ${e.pvf}`, L.H + f * 3.1, '#5ee6f2');
    line(`${T('ln_r_std')}:  ${e.psf}`, L.H + f * 4.4, '#e6ecff');
    line(`${T('ln_r_top')} (h, k) = (${nf(e.m.h)}, ${nf(e.m.k)})   |   a = ${nf(e.m.a, 3)}   |   ${T('ln_r_axis')}: x = ${nf(e.m.h)}`, L.H + f * 5.7, '#c8d2ff', f * 0.9, 600);
    line(`${new Date().toLocaleDateString(window.I18N ? I18N.locale() : 'id-ID')} | ${DB.me || ''} | Quadratic Lens  ${T('ln_s_scale', { n: L.N })}`, L.H + f * 6.9, '#8e9ad0', f * 0.8, 600);
    if (maxW && W > maxW) {
      const t = document.createElement('canvas'),
        k = maxW / W;
      t.width = maxW;
      t.height = Math.round(c.height * k);
      t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
      return t;
    }
    return c;
  }
  function download() {
    if (!L.img) return;
    const c = compose(),
      stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-'),
      go = (url, rev) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `quadratic-lens-${stamp}.png`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          rev && URL.revokeObjectURL(url);
          a.remove();
        }, 800);
      };
    if (c.toBlob) c.toBlob((b) => b && go(URL.createObjectURL(b), true), 'image/png');
    else go(c.toDataURL('image/png'));
    window.AU && AU.sfx('ok');
  }
  const gkey = () => 'ad_lens_' + (DB.me || '');
  const galRead = () => {
    try {
      const l = JSON.parse(localStorage.getItem(gkey()) || '[]');
      return Array.isArray(l) ? l.filter((g) => g && typeof g.img === 'string' && g.P) : [];
    } catch (e) {
      return [];
    }
  };
  function galWrite(l) {
    for (let i = 0; i < 3; i++) {
      try {
        localStorage.setItem(gkey(), JSON.stringify(l));
        return true;
      } catch (e) {
        if (l.length <= 1) return false;
        l = l.slice(0, -1);
      }
    }
    return false;
  }
  function save() {
    if (!L.img) return;
    const e = eq(),
      item = {
        id: 'g' + Date.now().toString(36),
        ts: Date.now(),
        kind: L.kind,
        label: L.label,
        img: L.img.toDataURL('image/jpeg', 0.72),
        th: compose(360).toDataURL('image/jpeg', 0.7),
        W: L.W,
        H: L.H,
        P: { x: L.P.x, y: L.P.y },
        ap: L.ap,
        dx: L.dx,
        N: L.N,
        origin: L.origin,
        eq: e.pvf,
      };
    const l = [item].concat(galRead()).slice(0, GAL_MAX);
    if (galWrite(l)) {
      toast(T('ln_saved'));
      window.AU && AU.sfx('up');
      gallery();
    } else toast(T('ln_save_err'));
  }
  function gallery() {
    const g = $q('#lngal');
    if (!g) return;
    const l = galRead();
    g.innerHTML =
      `<h3>${T('ln_gal_h')}</h3><p class="mut sm">${T('ln_gal_note')}</p>` +
      (l.length
        ? `<div class="lngl">${l
            .map(
              (x) =>
                `<div class="lngi"><img src="${esc(x.th || x.img)}" alt="" loading="lazy"><div><b class="no-i18n">${esc(x.label || '')}</b><small class="mut no-i18n">${esc(x.eq || '')}</small><span><button class="btn ghost" data-lo="${esc(x.id)}">${T('ln_gal_open')}</button><button class="btn ghost" data-ld="${esc(x.id)}">${T('ln_gal_del')}</button></span></div></div>`,
            )
            .join('')}</div>`
        : `<p class="mut">${T('ln_gal_empty')}</p>`);
    g.querySelectorAll('[data-lo]').forEach(
      (b) =>
        (b.onclick = () => {
          const x = galRead().find((y) => y.id === b.dataset.lo);
          if (!x) return;
          const im = new Image();
          im.onload = () => {
            const c = document.createElement('canvas');
            c.width = L.W = x.W;
            c.height = L.H = x.H;
            c.getContext('2d').drawImage(im, 0, 0, x.W, x.H);
            L.img = c;
            L.P = Object.assign({}, x.P);
            L.ap = x.ap;
            L.dx = x.dx;
            L.N = x.N;
            L.origin = x.origin;
            L.kind = x.kind;
            L.label = x.label || '';
            L.pts = null;
            show();
            scrollTo({ top: $q('#lnc').getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' });
          };
          im.src = x.img;
        }),
    );
    g.querySelectorAll('[data-ld]').forEach(
      (b) =>
        (b.onclick = () => {
          galWrite(galRead().filter((y) => y.id !== b.dataset.ld));
          gallery();
        }),
    );
  }

  const kinds = [['bridge', 'ln_k_bridge'], ['fountain', 'ln_k_fountain'], ['ball', 'ln_k_ball'], ['gate', 'ln_k_gate'], ['other', 'ln_k_other']];
  function html() {
    const row = (id, key) =>
      `<div class="lnrow"><label for="${id}n">${T(key)}</label><input id="${id}n" type="number" inputmode="decimal" step="0.01"><input id="${id}" type="range" aria-label="${esc(T(key))}"></div>`;
    return `<div class="sys rv lnh"><small class="tag">${T('ln_tag')}</small><h2>${T('ln_title')}</h2><p class="mut">${T('ln_intro')}</p></div>
<div id="lnz">
<div class="card lnsrc"><h3>${T('ln_src_h')}</h3>
<div class="lnbtns"><button class="btn" id="lnb1">${T('ln_btn_cam')}</button><button class="btn ghost" id="lnb2">${T('ln_btn_live')}</button><button class="btn ghost" id="lnb3">${T('ln_btn_up')}</button><button class="btn ghost" id="lnb4">${T('ln_btn_sample')}</button></div>
<input id="lnf1" type="file" accept="image/*" capture="environment" hidden><input id="lnf2" type="file" accept="image/*" hidden>
<div class="lncam" id="lncam" hidden><video playsinline muted></video><p><button class="btn" id="lnsnap">${T('ln_cam_snap')}</button> <button class="btn ghost" id="lncls">${T('ln_cam_close')}</button></p></div>
<div class="lnmeta"><label>${T('ln_kind_h')}<select id="lnkind">${kinds.map((k) => `<option value="${k[0]}">${T(k[1])}</option>`).join('')}</select></label><label>${T('ln_label')}<input id="lnlab" maxlength="40"></label></div></div>
<div class="lngrid"><div class="card lnstage"><h3>${T('ln_fit_h')}</h3><p class="mut sm">${T('ln_fit_p')}</p>
<p class="lnempty" id="lnempty">${T('ln_empty')}</p><div class="lncw" id="lncw" hidden><canvas id="lnc" role="img" aria-label="${esc(T('ln_canvas'))}"></canvas></div></div>
<div class="lncol"><div class="card lnctl" id="lnctl" hidden>${row('lnh', 'ln_s_h')}${row('lnk', 'ln_s_k')}${row('lna', 'ln_s_a')}
<div class="lnrow"><label for="lnn">${T('ln_s_scale', { n: '<b id="lnnv">10</b>' })}</label><input id="lnn" type="range" min="2" max="60" step="1" value="10"></div><p class="mut sm">${T('ln_s_scale_p')}</p>
<div class="lnmeta"><label>${T('ln_origin')}<select id="lnor"><option value="c">${T('ln_o_c')}</option><option value="b">${T('ln_o_b')}</option><option value="l">${T('ln_o_l')}</option></select></label>
<label class="lnck"><input type="checkbox" id="lngr" checked> ${T('ln_grid')}</label></div>
<div class="lnbtns"><button class="btn ghost" id="ln3p">${T('ln_3p')}</button><button class="btn ghost" id="lnrs">${T('ln_reset')}</button></div><p class="mut sm" id="ln3s" role="status"></p></div>
<div class="card lnres" id="lnres" hidden></div>
<div class="lnbtns" id="lnout" hidden><button class="btn" id="lnsv">${T('ln_save')}</button><button class="btn ghost" id="lndl">${T('ln_dl')}</button></div></div></div>
<div class="card lngal" id="lngal"></div></div>`;
  }
  function wire() {
    const g = (id) => $q('#' + id);
    g('lnb1').onclick = () => g('lnf1').click();
    g('lnb3').onclick = () => g('lnf2').click();
    g('lnf1').onchange = g('lnf2').onchange = (e) => {
      loadFile(e.target.files && e.target.files[0]);
      e.target.value = '';
    };
    g('lnb2').onclick = camOpen;
    g('lnsnap').onclick = camSnap;
    g('lncls').onclick = camClose;
    g('lnb4').onclick = sample;
    g('lnkind').onchange = (e) => {
      L.kind = e.target.value;
      sync();
    };
    g('lnlab').oninput = (e) => (L.label = e.target.value.slice(0, 40));

    ['lnh', 'lnk', 'lna'].forEach((id) =>
      [g(id), g(id + 'n')].forEach(
        (el) =>
          (el.oninput = () => {
            const v = parseFloat(el.value);
            if (!isFinite(v)) return;
            const m = math();
            setMath(id === 'lnh' ? v : m.h, id === 'lnk' ? v : m.k, id === 'lna' ? v : m.a);
            fixDx();
            sync();
          }),
      ),
    );
    g('lnn').oninput = (e) => {
      L.N = clamp(+e.target.value || 10, 2, 60);
      ranges();
      sync();
    };
    g('lnor').onchange = (e) => {
      L.origin = e.target.value;
      sync();
    };
    g('lngr').onchange = (e) => {
      L.grid = e.target.checked;
      sync();
    };
    g('ln3p').onclick = () => set3(!L.pts);
    g('lnrs').onclick = () => {
      defCurve();
      set3(false);
      fixDx();
      sync();
    };
    g('lnsv').onclick = save;
    g('lndl').onclick = download;
    const c = g('lnc');
    c.addEventListener('pointerdown', down);
    c.addEventListener('pointermove', move);
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
  }
  let hashBound = false;
  function mount() {
    wire();
    show();
    gallery();
    if (!hashBound) {
      hashBound = true;
      addEventListener('hashchange', () => !/^#\/lens/.test(location.hash) && camClose());
    }
  }
  V.lens = html;
  V.lens.post = mount;
  return { state: () => L, eq, math, setMath, fit3: (pts) => ((L.pts = pts), fit3()), sample, compose };
})();
