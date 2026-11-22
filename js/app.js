'use strict';

const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];

const KEY = 'arise_v5',
  today = () => new Date().toISOString().slice(0, 10);

const hash = (s) => {
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
};
let DB = JSON.parse(localStorage.getItem(KEY) || 'null') || { users: {}, me: null };
const save = () => {
    localStorage.setItem(KEY, JSON.stringify(DB));

    window.Cloud && Cloud.dirty();
  },
  me = () => DB.users[DB.me];

const mk = (n, role, pw, demo) => ({
  name: n,
  role,
  pw: hash(pw),
  demo: !!demo,
  streak: 1,
  last: today(),
  done: {},
  st: {},
});
function seedDemo() {

  if (!DB.seeded) {
    const SM = {
      Misel: {
        E1: 'Sumbu simetri selalu melewati vertex, jadi persamaannya x = h.',
        R1: 'Aktivitasnya seru, sistem rank bikin semangat. Soal Rank S paling menantang.',
      },
      Wildan: {
        E1: 'Sumbu simetri adalah x = h, sama dengan koordinat x dari vertex.',
        B4: 'Jembatan Golden Gate punya kabel berbentuk parabola, kira-kira y = 0,0002x² dengan vertex di tengah.',
      },
      Zidan: {
        E1: 'Persamaannya x = h karena parabola simetris terhadap garis vertikal lewat vertex.',
      },
    };
    [
      ['Misel', 10, 0.95],
      ['Wildan', 7, 0.85],
      ['Zidan', 6, 0.8],
      ['Panji', 5, 0.7],
      ['Hakim', 4, 0.6],
    ].forEach(([n, k, q], i) => {
      const u = mk(n, 'student', 'arise123', 1);
      RK.slice(0, k).forEach((r, j) => {
        let sc = Math.max(25, Math.round((q - (j % 3) * 0.09 + (i % 2) * 0.05) * 100));
        if (r.c === 'P') sc = 30 + i * 6;
        if (r.c === 'T') sc = 92;
        u.done[r.c] = { score: sc, xp: Math.round(r.xp * (0.4 + (0.6 * sc) / 100)) };
        (Q[r.c] || []).forEach((it, m) => {
          const ok = it.t === 'open' || (m + i + j) % 4 !== 0,
            att = ok ? 1 + ((m + i) % 2) : 3;
          u.st[r.c + m] = { att, done: 1, ok, score: ok ? [100, 66, 33][att - 1] : 0 };
        });
      });
      Object.entries(SM[n] || {}).forEach(([key, v]) => {
        if (u.st[key]) u.st[key].v = v;
      });
      DB.users[n] = u;
    });
    DB.users['Guru Demo'] = mk('Guru Demo', 'teacher', TEACHER_CODE, 1);
    DB.seeded = 1;
    save();
  }

  Object.entries({ Misel: '9A', Wildan: '9A', Zidan: '9B', Panji: '9B', Hakim: '9C' }).forEach(([n, c]) => {
    const u = DB.users[n];
    if (u && u.demo && !u.cls) u.cls = c;
  });

  if (!DB.v6) {
    const now = Date.now(),
      R0 = { Misel: 9, Wildan: 8, Zidan: 6 };
    Object.entries(R0).forEach(([n, b]) => {
      const u = DB.users[n];
      if (u && !u.raid) {
        u.raid = { best: b, runs: [{ ts: now - 864e5, ok: b, n: 10, pts: b * 130, sec: 140 }] };
        u.bonus = b * 10;
      }
    });
    DB.forum = DB.forum || [];
    DB.forum.push(
      {
        id: 'w1',
        demo: 1,
        rank: 'all',
        title: 'Selamat datang di Guild Hall',
        body: 'Tanyakan apa saja soal fungsi kuadrat di sini. Sebelum bertanya, coba pakai tombol Petunjuk dulu ya.',
        by: 'Guru Demo',
        ts: now - 6 * 864e5,
        pin: 1,
        likes: ['Misel'],
        replies: [],
      },
      {
        id: 't1',
        demo: 1,
        rank: 'E',
        title: 'Kenapa sumbu simetri x = h, bukan x = -h?',
        body: 'Di y = (x - 3)² + 2 aku bingung kenapa sumbunya x = 3, bukan x = -3.',
        by: 'Wildan',
        ts: now - 2 * 864e5,
        likes: ['Zidan', 'Misel'],
        replies: [
          {
            by: 'Guru Demo',
            body: 'Bentuknya (x - h). Karena tandanya minus, h = 3. Vertex (3, 2) dan sumbu x = 3. Kalau (x + 3), baru h = -3.',
            ts: now - 2 * 864e5 + 36e5,
            likes: ['Wildan'],
            best: true,
          },
          {
            by: 'Misel',
            body: 'Trik: cari x yang membuat isi kurung nol. Itu posisi sumbunya.',
            ts: now - 864e5,
            likes: [],
          },
        ],
      },
      {
        id: 't2',
        demo: 1,
        rank: 'B',
        title: 'Cara cepat mencari akar dari bentuk faktor',
        body: 'Untuk y = 2(x - 1)(x + 3) apakah akarnya langsung 1 dan -3?',
        by: 'Panji',
        ts: now - 864e5,
        likes: ['Hakim'],
        replies: [
          {
            by: 'Misel',
            body: 'Betul. Setiap faktor dibuat nol: x - 1 = 0 dan x + 3 = 0.',
            ts: now - 864e5 + 18e5,
            likes: [],
            best: true,
          },
        ],
      },
      {
        id: 't3',
        demo: 1,
        rank: 'S',
        title: 'Tips Peak Question tentang x-intercept',
        body: 'Ada yang punya cara cepat menemukan x-intercept y = x² - 2x - 8?',
        by: 'Hakim',
        ts: now - 36e5 * 5,
        likes: [],
        replies: [],
      },
    );
    DB.v6 = 1;
    save();
  }
}

const xpOf = (u) => Object.values(u.done).reduce((a, d) => a + d.xp, 0) + (u.bonus || 0),
  titleOf = (x) => TT.filter((t) => x >= t[0]).pop()[1],
  nextOf = (x) => (TT.find((t) => t[0] > x) || [0])[0];
const skill = (u) => AX.map((r) => (u.done[r.c] ? u.done[r.c].score : 0)),
  students = () =>
    Object.values(DB.users).filter(
      (u) => u.role === 'student' && (u.cloud || u.imported || (DB.owner && u.demo)),
    );
const state = (u, i) =>
  u.done[RK[i].c]
    ? 'done'
    : i === 0 || u.done[RK[i - 1].c]
      ? RK.findIndex((r) => !u.done[r.c]) === i
        ? 'current'
        : 'open'
      : 'locked';

const pre = (u) => (u.done.P ? u.done.P.score : null),
  post = (u) => (u.done.T ? u.done.T.score : null),
  ngain = (u) => {
    const a = pre(u),
      b = post(u);
    if (a == null || b == null) return null;
    return a >= 100 ? (b >= 100 ? 1 : 0) : Math.max(-1, (b - a) / (100 - a));
  },
  ngCat = (g) => (g == null ? '-' : g >= 0.7 ? 'Tinggi' : g >= 0.3 ? 'Sedang' : 'Rendah'),
  fmt = (g) => (g == null ? '-' : g.toFixed(2));

const maxA = (c) => (c === 'P' || c === 'T' ? 1 : 3);

const shuf = (n, seed) => {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    h = (Math.imul(h, 1103515245) + 12345) | 0;
    const j = (h >>> 8) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

const NAME_RE = /^[\p{L}\p{N} ._-]{2,24}$/u,
  ago = (t) => {
    const m = Math.round((Date.now() - t) / 6e4);
    return m < 1
      ? 'baru saja'
      : m < 60
        ? m + ' menit lalu'
        : m < 1440
          ? Math.round(m / 60) + ' jam lalu'
          : Math.round(m / 1440) + ' hari lalu';
  };
const FR = () => DB.forum || (DB.forum = []),
  forumCount = (n) =>
    FR().reduce((a, t) => a + (t.by === n ? 1 : 0) + t.replies.filter((r) => r.by === n).length, 0),
  isT = () => me().role === 'teacher',

  RAID_DEF = { raidSec: 60, raidN: 10, v: 2 },
  cfg = () => Object.assign({}, RAID_DEF, DB.cfg && DB.cfg.v === 2 ? DB.cfg : {});

const roleOf = (n) => (DB.users[n] || {}).role || (window.Sync && Sync.role(n)) || '';
const chip = (n) =>
  `<span class="tagc" style="${roleOf(n) === 'teacher' ? 'border-color:var(--gold);color:var(--gold)' : ''}">${window.Avatar ? Avatar.html(n, 22) : ''}${esc(n)}${roleOf(n) === 'teacher' ? ' (Guru)' : ''}</span>`;

const BADGES = [
  ['Voice of Shadows', 'Aktif di forum (3 topik atau balasan)', (u) => forumCount(u.name) >= 3],
  ['Raid Runner', 'Selesaikan 1 Raid Waktu', (u) => !!(u.raid && u.raid.runs.length)],
  [
    'Growth Mindset',
    'Posttest lebih tinggi dari pretest',
    (u) => {
      const g = ngain(u);
      return g != null && g > 0;
    },
  ],
  ['First Blood', 'Selesaikan 1 dungeon', (u) => Object.keys(u.done).length > 0],
  ['Dagger Master', 'Lolos game belati', (u) => !!u.done['0']],
  ['Boss Slayer', 'Taklukkan Rank S', (u) => !!u.done.S],
  ['Shadow Monarch', 'Capai 1200 XP', (u) => xpOf(u) >= 1200],
  ['Streak 3', 'Belajar 3 hari berturut-turut', (u) => u.streak >= 3],
];

const AU = {
  ctx: null,
  sfxOn: true,
  mus: false,
  vol: 0.55,
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.vol;
    this.master.connect(this.ctx.destination);
  },
  tone(f, t, d, ty, g, dest) {
    const c = this.ctx,
      o = c.createOscillator(),
      v = c.createGain();
    o.type = ty;
    o.frequency.value = f;
    v.gain.setValueAtTime(0.0001, t);
    v.gain.exponentialRampToValueAtTime(g, t + 0.03);
    v.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(v);
    v.connect(dest || this.master);
    o.start(t);
    o.stop(t + d + 0.05);
  },
  sfx(n) {
    if (!this.ctx || !this.sfxOn) return;
    this.ctx.resume();
    const t = this.ctx.currentTime,
      s = (a, ty, g, d = 0.18, gap = 0.09) =>
        a.forEach((f, i) => this.tone(f, t + i * gap, d, ty, g));
    ({
      click: () => s([700], 'square', 0.08, 0.07),
      ok: () => s([523, 659, 784], 'triangle', 0.2),
      bad: () => s([220, 165], 'sawtooth', 0.14, 0.22, 0.13),
      up: () => s([392, 523, 659, 784, 1047], 'triangle', 0.22, 0.4, 0.1),
      launch: () => s([200, 300, 420, 560], 'sawtooth', 0.08, 0.12, 0.05),
      hit: () => s([880, 1320], 'square', 0.1, 0.2, 0.07),
    })[n]?.();
  },
  start() {
    this.init();
    this.ctx.resume();
    if (this.mus) return;
    this.mus = true;
    const mg = (this.mg = this.ctx.createGain());
    mg.gain.value = 0.6;
    mg.connect(this.master);
    const ch = [
        [110, 220, 261.6, 329.6],
        [87.3, 174.6, 220, 261.6],
        [130.8, 261.6, 329.6, 392],
        [98, 196, 246.9, 293.7],
      ],
      sp = 60 / 84 / 2;
    let step = 0,
      next = this.ctx.currentTime + 0.1;
    this.timer = setInterval(() => {
      while (next < this.ctx.currentTime + 0.5) {
        const c = ch[Math.floor(step / 16) % 4],
          s = step % 16;
        if (s === 0) {
          this.tone(c[0] / 2, next, sp * 14, 'sawtooth', 0.08, mg);
          this.tone(c[1], next, sp * 15, 'triangle', 0.05, mg);
        }
        if (s % 2 === 0)
          this.tone(c[[1, 2, 3, 2][(s / 2) % 4]] * 2, next, sp * 1.6, 'triangle', 0.07, mg);
        if (s % 8 === 4) this.tone(55, next, 0.28, 'sine', 0.3, mg);
        next += sp;
        step++;
      }
    }, 120);
  },
  stop() {
    clearInterval(this.timer);
    this.mus = false;
    if (this.mg) this.mg.gain.value = 0;
  },
  set(v) {
    this.vol = v;
    if (this.master) this.master.gain.value = v;
  },
};
const sync = () => {
  if (window.Aud) return Aud.sync();
  $('#bm').textContent = 'Musik: ' + (AU.mus ? 'ON' : 'OFF');
  $('#bm').classList.toggle('on', AU.mus);
  $('#bs').textContent = 'SFX: ' + (AU.sfxOn ? 'ON' : 'OFF');
  $('#bs').classList.toggle('on', AU.sfxOn);
};
$('#bm').onclick = () => {
  if (AU.mus) AU.stop();
  else AU.start();
  sync();
};
$('#bs').onclick = () => {
  AU.sfxOn = !AU.sfxOn;
  sync();
};
$('#bv').oninput = (e) => AU.set(e.target.value / 100);
document.addEventListener(
  'pointerdown',
  () => {
    if (!AU.mus && !AU.manual) {
      AU.manual = 1;
      AU.start();
      sync();
    }
  },
  { once: true },
);
document.addEventListener('click', (e) => {
  if (e.target.closest('button,a,.rank,tr.pick,.steps div')) AU.sfx('click');
});

const toast = (m) => {
  const d = document.createElement('div');
  d.className = 't';
  d.textContent = m;
  $('#toast').append(d);
  setTimeout(() => d.remove(), 3400);
};

function overlay(h, ms = 2600, snd = 'up') {
  const o = $('#ovl');
  o.innerHTML = h;
  o.hidden = false;
  AU.sfx(snd);
  if (snd === 'levelup' && window.Sys) {
    Sys.flash('#ffd86b');
    Sys.pop('LEVEL UP!', 'good', 2200);
  }
  setTimeout(() => (o.hidden = true), ms);
}
const army = () =>
  '<div class="army">' +
  Array.from({ length: 9 }, (_, i) => `<i style="animation-delay:${i * 0.1}s"></i>`).join('') +
  '</div>';

function countUp() {
  $$('[data-n]').forEach((e) => {
    const t = +e.dataset.n,
      s = performance.now();
    (function f(n) {
      const k = Math.min((n - s) / 1100, 1);
      e.textContent = Math.round(t * (1 - (1 - k) ** 3));
      if (k < 1) requestAnimationFrame(f);
    })(s);
  });
  setTimeout(() => $$('[data-w]').forEach((b) => (b.style.width = b.dataset.w + '%')), 150);
}
function reveal() {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.08 },
  );
  $$('.rv').forEach((e, i) => {
    e.style.transitionDelay = Math.min(i * 0.06, 0.5) + 's';
    io.observe(e);
  });
}
function tilt() {
  if (window.matchMedia && matchMedia('(hover:none)').matches) return;
  $$('.tilt').forEach((c) => {
    c.onmousemove = (e) => {
      const r = c.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    };
    c.onmouseleave = () => (c.style.transform = '');
  });
}

function plot(cv, fns, o = {}) {
  if (!cv) return;
  const x = cv.getContext('2d'),
    W = cv.width,
    H = cv.height,
    [a, b] = o.x || [-6, 6],
    [c, d] = o.y || [-6, 10],
    X = (v) => ((v - a) / (b - a)) * W,
    Y = (v) => H - ((v - c) / (d - c)) * H;
  x.clearRect(0, 0, W, H);
  x.lineWidth = 1;
  x.strokeStyle = 'rgba(120,150,255,.15)';
  const sx = Math.max(1, Math.round((b - a) / 12)),
    sy = Math.max(1, Math.round((d - c) / 10));
  for (let i = Math.ceil(a); i <= b; i += sx) {
    x.beginPath();
    x.moveTo(X(i), 0);
    x.lineTo(X(i), H);
    x.stroke();
  }
  for (let j = Math.ceil(c); j <= d; j += sy) {
    x.beginPath();
    x.moveTo(0, Y(j));
    x.lineTo(W, Y(j));
    x.stroke();
  }
  x.strokeStyle = 'rgba(180,200,255,.6)';
  x.lineWidth = 2;
  x.beginPath();
  x.moveTo(X(0), 0);
  x.lineTo(X(0), H);
  x.moveTo(0, Y(0));
  x.lineTo(W, Y(0));
  x.stroke();
  fns.forEach((f) => {
    x.strokeStyle = f.col || '#4d8bff';
    x.lineWidth = 3;
    x.shadowColor = x.strokeStyle;
    x.shadowBlur = 10;
    x.beginPath();
    let st = 0;
    for (let i = 0; i <= W; i += 2) {
      const y = f.f(a + (i / W) * (b - a));
      if (!isFinite(y)) continue;
      st ? x.lineTo(i, Y(y)) : x.moveTo(i, Y(y));
      st = 1;
    }
    x.stroke();
    x.shadowBlur = 0;
  });
  if (o.axis != null) {
    x.setLineDash([6, 5]);
    x.strokeStyle = '#f472a8';
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(X(o.axis), 0);
    x.lineTo(X(o.axis), H);
    x.stroke();
    x.setLineDash([]);
  }
  (o.pts || []).forEach((p) => {
    x.fillStyle = p.col || '#ffd86b';
    x.beginPath();
    x.arc(X(p.x), Y(p.y), 6, 0, 7);
    x.fill();
    if (p.l) {
      x.fillStyle = '#e6ecff';
      x.font = '13px Rajdhani';
      x.fillText(p.l, X(p.x) + 9, Y(p.y) - 9);
    }
  });
}

function radar(cv, labels, series, anim = true) {
  const x = cv.getContext('2d'),
    W = cv.width,
    H = cv.height,
    cx = W / 2,
    cy = H / 2 + 4,
    Rr = Math.min(W, H) / 2 - 46,
    n = labels.length,
    A = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  let s0 = performance.now();
  (function f(now) {
    const k = anim ? Math.min((now - s0) / 800, 1) : 1,
      e = 1 - (1 - k) ** 3;
    x.clearRect(0, 0, W, H);
    x.lineWidth = 1;
    x.strokeStyle = 'rgba(120,150,255,.25)';
    for (let l = 1; l <= 5; l++) {
      x.beginPath();
      for (let i = 0; i < n; i++)
        x[i ? 'lineTo' : 'moveTo'](
          cx + (Math.cos(A(i)) * Rr * l) / 5,
          cy + (Math.sin(A(i)) * Rr * l) / 5,
        );
      x.closePath();
      x.stroke();
    }
    labels.forEach((t, i) => {
      x.beginPath();
      x.moveTo(cx, cy);
      x.lineTo(cx + Math.cos(A(i)) * Rr, cy + Math.sin(A(i)) * Rr);
      x.stroke();
      x.fillStyle = '#cfd8ff';
      x.font = '700 13px Rajdhani';
      x.textAlign = 'center';
      x.fillText(t, cx + Math.cos(A(i)) * (Rr + 24), cy + Math.sin(A(i)) * (Rr + 24) + 4);
    });
    series.forEach((s) => {
      x.beginPath();
      s.v.forEach((v, i) => {
        const r = ((Rr * v) / 100) * e;
        x[i ? 'lineTo' : 'moveTo'](cx + Math.cos(A(i)) * r, cy + Math.sin(A(i)) * r);
      });
      x.closePath();
      x.fillStyle = s.col + '44';
      x.fill();
      x.strokeStyle = s.col;
      x.lineWidth = 2.5;
      x.stroke();
      s.v.forEach((v, i) => {
        const r = ((Rr * v) / 100) * e;
        x.fillStyle = s.col;
        x.beginPath();
        x.arc(cx + Math.cos(A(i)) * r, cy + Math.sin(A(i)) * r, 4, 0, 7);
        x.fill();
      });
    });
    if (k < 1) requestAnimationFrame(f);
  })(s0);
}

const LBL = AX.map((r) => r.n.replace('Rank ', '') + ': ' + r.t.split(' ')[0]);

function sliders(box, cfg) {
  box.innerHTML = `<canvas class="plot" width="560" height="320"></canvas><div class="ctl">${['a', 'h', 'k'].map((p) => `<label>${p}<input type="range" data-p="${p}" min="${cfg[p][0]}" max="${cfg[p][1]}" step=".5" value="${cfg[p][2]}"><b>${cfg[p][2]}</b></label>`).join('')}</div><p class="eq"></p>`;
  const up = () => {
    const v = {};
    $$('[data-p]', box).forEach((e) => {
      v[e.dataset.p] = +e.value;
      e.nextElementSibling.textContent = e.value;
    });
    plot($('canvas', box), [{ f: (x) => v.a * (x - v.h) ** 2 + v.k }], {
      pts: [{ x: v.h, y: v.k, l: `(${v.h}, ${v.k})` }],
      axis: v.h,
    });

    const N = (n) => String(n).replace('.', '{,}'),
      A = v.a === 1 ? '' : v.a === -1 ? '-' : N(v.a),
      sq = v.h === 0 ? 'x^2' : `(x ${v.h < 0 ? '+ ' + N(-v.h) : '- ' + N(v.h)})^2`,
      K = v.k === 0 ? '' : v.k < 0 ? ' - ' + N(-v.k) : ' + ' + N(v.k);
    $('.eq', box).textContent =
      (v.a === 0 ? `$y = ${N(v.k)}$` : `$y = ${A}${sq}${K}$`) +
      `  |  vertex $(${N(v.h)}, ${N(v.k)})$  |  sumbu $x = ${N(v.h)}$  |  ` +
      (v.a > 0 ? 'terbuka ke atas' : v.a < 0 ? 'terbuka ke bawah' : '$a = 0$, bukan fungsi kuadrat');
  };
  box.oninput = up;
  up();
}

function dagger(box, done) {
  box.innerHTML =
    '<canvas class="plot" width="640" height="280"></canvas><div class="ctl"><label>Sudut<input id="da" type="range" min="15" max="75" value="45"><b>45</b></label><label>Tenaga<input id="dp" type="range" min="12" max="32" value="22"><b>22</b></label><button class="btn" id="dg">Lempar belati</button></div><div class="dgs"><span>Lemparan <b id="dn">0</b>/3</span><span>Skor <b id="ds">0</b></span><span id="dm">Target bergerak! Atur sudut dan tenaga, lalu bidik zona kuning.</span></div><p class="mut sm">Jarak lemparan $R = \\dfrac{v^2 \\sin 2\\theta}{g}$ dengan $g = 9{,}8$. Jarak diukur dari kiri dalam meter.</p>';
  const cv = $('canvas', box),
    x = cv.getContext('2d'),
    g = 9.8,
    X0 = 20,
    PM = 5.888,
    GY = 250,
    TGT_MIN = 32,
    TGT_MAX = 90,
    HALF = 4,
    px = (m) => X0 + m * PM,
    Y = (v) => GY - v * 6.5,
    rnd = (a, b) => a + Math.random() * (b - a);
  let n = 0,
    s = 0,
    fl = null,
    base = rnd(TGT_MIN, TGT_MAX),
    goal = base,
    amp = 0,
    w = 1,
    ph = 0,
    tg = base,
    T0 = performance.now(),
    last = T0;

  const newTarget = () => {
    do goal = rnd(TGT_MIN, TGT_MAX);
    while (Math.abs(goal - base) < 14);
    amp = DB.rm ? 0 : rnd(3, 6.5);
    w = rnd(0.8, 1.3);
    ph = Math.random() * 6.28;
  };
  newTarget();
  const msg = (t) => ($('#dm', box).textContent = t);
  const frame = (now) => {
    if (!cv.isConnected) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const t = (now - T0) / 1000;
    base += (goal - base) * (DB.rm ? 1 : Math.min(1, dt * 2.2));
    tg = base + amp * Math.sin(w * t + ph);

    x.clearRect(0, 0, 640, 280);
    x.fillStyle = '#050816';
    x.fillRect(0, 0, 640, 280);
    x.fillStyle = '#4d8bff';
    x.fillRect(0, GY, 640, 3);
    x.font = '11px Rajdhani';
    x.textAlign = 'center';
    for (let m = 10; m <= 100; m += 10) {
      x.fillStyle = 'rgba(142,154,208,.55)';
      x.fillRect(px(m), GY, 1, 7);
      x.fillText(m + ' m', px(m), GY + 20);
    }

    const zx = px(tg - HALF),
      zw = HALF * 2 * PM;
    x.fillStyle = 'rgba(255,216,107,.28)';
    x.fillRect(zx, GY - 10, zw, 12);
    x.strokeStyle = '#ffd86b';
    x.lineWidth = 2;
    x.strokeRect(zx, GY - 10, zw, 12);
    x.fillStyle = '#ffd86b';
    x.beginPath();
    x.moveTo(px(tg), GY - 14);
    x.lineTo(px(tg) - 6, GY - 26);
    x.lineTo(px(tg) + 6, GY - 26);
    x.fill();
    x.fillText('TARGET', px(tg), GY - 32);
    x.fillStyle = '#f472a8';
    x.beginPath();
    x.arc(X0, GY, 9, 0, 7);
    x.fill();

    if (fl) {
      const k = Math.min((now - fl.t0) / 1200, 1),
        tt = k * fl.T;
      x.strokeStyle = '#4d8bff';
      x.lineWidth = 3;
      x.shadowColor = '#4d8bff';
      x.shadowBlur = 10;
      x.beginPath();
      for (let q = 0; q <= tt; q += fl.T / 60)
        x[q ? 'lineTo' : 'moveTo'](px(fl.vx * q), Y(fl.vy * q - 0.5 * g * q * q));
      x.stroke();
      x.shadowBlur = 0;
      x.fillStyle = '#fff';
      x.beginPath();
      x.arc(px(fl.vx * tt), Y(fl.vy * tt - 0.5 * g * tt * tt), 6, 0, 7);
      x.fill();
      if (k >= 1) {

        const d = Math.abs(fl.R - tg),
          pts = Math.max(0, Math.round(20 - d * 0.85));
        fl = null;
        n++;
        s += pts;
        $('#dn', box).textContent = n;
        $('#ds', box).textContent = s;
        msg(`+${pts} poin (selisih ${d.toFixed(1).replace('.', ',')} m)`);
        AU.sfx(pts > 10 ? 'hit' : 'bad');
        if (n === 3) {
          if (s >= 35) {
            msg('Skor ' + s + '. Gerbang terbuka!');
            done(s);
          } else {
            msg('Skor ' + s + ' kurang dari 35. Coba lagi!');
            setTimeout(() => {
              n = 0;
              s = 0;
              newTarget();
              $('#dn', box).textContent = 0;
              $('#ds', box).textContent = 0;
            }, 1600);
          }
        } else newTarget();
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  $$('input', box).forEach((e) => (e.oninput = () => (e.nextElementSibling.textContent = e.value)));
  $('#dg', box).onclick = () => {
    if (fl || n >= 3) return;
    AU.sfx('launch');
    const th = ($('#da', box).value * Math.PI) / 180,
      v = +$('#dp', box).value,
      vx = v * Math.cos(th),
      vy = v * Math.sin(th),
      T = (2 * vy) / g;
    fl = { vx, vy, T, R: vx * T, t0: performance.now() };
  };
}

const stdAns = (x) => (window.Mp ? Mp.std(x) : String(x == null ? '' : x).toLowerCase().replace(/\s/g, ''));
function itemHTML(c, i, it) {
  const k = c + i,
    st = me().st[k] || { att: 0 },
    T = maxA(c) === 1,
    hx = it.hint || (EXP[k] || [])[0],
    ex = it.exp || (EXP[k] || [])[1];
  let h = `<div class="item ${st.done ? (st.ok ? 'ok' : 'bad') : ''}" data-k="${k}"><h4>${it.tag}</h4><p>${it.q}</p>${it.html || ''}`;
  if (it.t === 'mc') {
    const ord = it.noShuf ? [...it.o.keys()] : shuf(it.o.length, k + DB.me);
    h +=
      '<div class="opts">' +
      ord
        .map(
          (j, x) =>
            `<label><input type="${it.multi ? 'checkbox' : 'radio'}" name="${k}" value="${j}" ${st.done ? 'disabled' : ''}><span>${String.fromCharCode(65 + x)}. ${it.o[j]}</span></label>`,
        )
        .join('') +
      '</div>';
  }
  if (it.t === 'fill')
    h +=
      '<div class="fills">' +
      it.f
        .map(
          (f, j) =>
            `<label>${f.l}<input data-f="${j}" ${st.done ? 'disabled' : ''} value="${(st.v || [])[j] || ''}"></label>`,
        )
        .join('') +
      '</div>';
  if (it.t === 'open')
    h += `<textarea rows="3" ${st.done ? 'disabled' : ''} placeholder="Tulis jawabanmu...">${st.v || ''}</textarea>`;
  if (st.done)
    return (
      h +
      (T
        ? '<p class="res">Jawaban tersimpan.</p>'
        : `<p class="res">${st.ok ? 'Benar. Skor ' + st.score : 'Belum tepat. Jawaban: ' + (it.show || '')}</p>` +
          (ex ? `<p class="exp"><b>Pembahasan:</b> ${ex}</p>` : '')) +
      '</div>'
    );
  return (
    h +
    (hx && !T
      ? `<button class="btn ghost hintb" style="margin-right:8px">${Skill.hintLabel(c)}</button>`
      : '') +
    `<button class="btn chk">${it.t === 'open' ? 'Kirim' : 'Check my answer'} <small>(${it.t === 'open' ? 1 : maxA(c) + (st.ex ? 1 : 0) - st.att})</small></button><p class="hintp">${st.hint && hx ? 'Petunjuk: ' + hx : ''}</p><p class="res"></p></div>`
  );
}

function check(k) {
  const c = k[0],
    i = +k.slice(1),
    it = Q[c][i],
    u = me(),
    st = (u.st[k] = u.st[k] || { att: 0 }),
    box = $(`[data-k="${k}"]`);
  let ok = false,
    v,
    ans;
  if (window.Bat && Bat.blocked(c)) return Bat.koUI(c);
  if (it.t === 'mc') {
    const sel = $$('input:checked', box)
      .map((e) => +e.value)
      .sort();
    if (!sel.length) return toast('Pilih jawaban dulu');
    ans = sel;
    ok = sel.join() === it.a.join();
  } else if (it.t === 'fill') {
    v = $$('[data-f]', box).map((e) => e.value);
    ans = v;
    st.v = v;
    ok = it.f.every((f, j) => f.r.test(stdAns(v[j])));
  } else {
    v = $('textarea', box).value.trim();
    const mn = window.I18N && ['ja', 'ko'].includes(I18N.lang) ? Math.ceil(it.min / 2) : it.min;
    if (v.length < mn) return toast('Tulis minimal ' + mn + ' karakter');
    st.v = v;
    ok = true;
  }
  st.att++;
  if (it.t === 'mc') st.sel = ans;
  if (!ok && c !== 'P' && c !== 'T' && window.WL) WL.miss('q:' + k);
  if (!ok && window.Mentor) Mentor.onWrong(k, it, ans);
  if (window.Bat && it.t !== 'open') ok ? Bat.onRight(c) : Bat.onWrong(c);
  let lim0 = it.t === 'open' ? 1 : maxA(c) + (st.ex ? 1 : 0);

  if (!ok && st.att >= lim0 && it.t !== 'open' && Skill.canExtra(c, st)) {
    st.ex = 1;
    lim0++;
    Skill.note('extra');
  }
  const last = ok || st.att >= lim0;
  if (!last) {
    $('.res', box).textContent = 'Belum tepat. Sisa percobaan: ' + (lim0 - st.att);
    $('.chk small', box).textContent = '(' + (lim0 - st.att) + ')';
    AU.sfx('bad');
    save();
    Co.say('retry');
    return;
  }
  st.done = 1;
  st.ok = ok;
  st.score =
    it.t === 'open'
      ? it.re && !it.re.test(v)
        ? 60
        : 100
      : ok
        ? Math.max(0, [100, 66, 33, 20][st.att - 1] - (st.hint ? (st.hp == null ? 10 : st.hp) : 0))
        : 0;
  AU.sfx(ok ? 'ok' : 'bad');
  save();
  RS.hit = ok ? 'hit' : 'miss';
  Co.say(ok ? 'correct' : 'wrong');
  if (ok) {
    dq('ans');
    burst($('.chk'));
  }
  paint();
  RS.hit = null;
}

const allAnswered = (c) => (Q[c] || []).every((_, j) => (me().st[c + j] || {}).done);
function finish(c) {
  const u = me(),
    r = RK.find((x) => x.c === c),
    sc = Math.round(Q[c].reduce((a, _, j) => a + u.st[c + j].score, 0) / Q[c].length);
  completeRank(c, sc, Math.round(r.xp * (0.4 + (0.6 * sc) / 100)));
}

function completeRank(c, sc, xp) {
  const u = me();
  if (u.done[c]) return;
  if (xp > 0) xp = Math.round(xp * Skill.xpMul() * (window.Forge ? Forge.xpMul() : 1));
  const before = titleOf(xpOf(u)),
    had = BADGES.map((b) => b[2](u)),
    ub = Co.unlocked(u);
  u.done[c] = { score: sc, xp, ts: Date.now() };
  window.Forge && Forge.onClear(c, xp);
  Co.checkUnlock(ub);
  dq('rank');
  burst(null, 80);
  BADGES.forEach((b, i) => {
    if (!had[i] && b[2](u)) toast('Badge baru: ' + b[0]);
  });
  if (u.last !== today()) {
    u.streak = u.last && (new Date(today()) - new Date(u.last)) / 864e5 <= 1.5 ? u.streak + 1 : 1;
    u.last = today();
  }
  const t = titleOf(xpOf(u));
  if (t !== before) u.done[c].up = t;
  save();
  if (window.Cut && Cut.auto()) {

    let went = false;
    const go = () => {
      if (went) return;
      went = true;
      location.hash = '#/result/' + c;
    };
    const ok = Cut.arise({ c, up: t !== before ? t : null, from: before, xp, done: go });
    Co.say(t !== before ? 'levelup' : 'clear', true);
    if (ok === false) {
      window.Bat ? Bat.extract(c) : AU.sfx('up');
      go();
    }
    return;
  }
  if (t !== before) {
    overlay(
      `<div><small class="tag">[ SYSTEM ]</small><h2>LEVEL UP</h2><p>${t}</p><p class="mut">+${xp} XP</p></div>${army()}`,
      2300,
      'levelup',
    );
    Co.say('levelup', true);
    setTimeout(() => window.Bat && Bat.extract(c), 2400);
    setTimeout(() => (location.hash = '#/result/' + c), 2350);
  } else {
    window.Bat ? Bat.extract(c) : AU.sfx('up');
    Co.say('clear', true);
    location.hash = '#/result/' + c;
  }
}

const V = {};
let RS = { c: null, step: 0, qi: 0 };

const stepsOf = (c) =>
  (c === 'P' || c === 'T'
    ? ['Misi']
    : ['Misi'].concat(window.Materi && Materi.has(c) ? ['Materi'] : [], ['Praktik'])
  ).concat(window.Prac && Prac.has(c) ? ['Latihan'] : [], Q[c] ? ['Soal'] : []);

const exHTML = (c) => {
  let ex = '';
  if (c === 'E') ex = '<h3>Applet: Vertex Form</h3><div id="ap"></div>';
  if (c === 'D')
    ex =
      '<h3>Contoh: $y = (x - 2)^2 - 3$</h3><p class="mut sm">Klik tiap kartu untuk membuka jawabannya.</p><div class="steps">' +
      [
        ['a. Concavity', 'Terbuka ke atas ($a = 1 \\gt 0$)'],
        ['b. Vertex', '$(2, -3)$'],
        ['c. Sumbu simetri', '$x = 2$'],
        ['d. Interval', 'Turun $(-\\infty, 2)$, naik $(2, \\infty)$'],
        ['e. $y$-intercept', '$(0, 1)$'],
        ['f. Domain dan range', 'Domain: semua real. Range: $y \\ge -3$'],
      ]
        .map((s) => `<div><b>${s[0]}</b><span>${s[1]}</span></div>`)
        .join('') +
      '</div><canvas class="plot" id="exg" width="560" height="260" style="margin-top:14px"></canvas>';
  if (c === 'C')
    ex =
      '<h3>Bentuk Standar</h3><p>Untuk $y = x^2 - 4x + 3$, sumbu simetri $x = -\\dfrac{b}{2a} = 2$, lalu $y = 4 - 8 + 3 = -1$, jadi vertex $(2, -1)$. Gunakan ini untuk memilih grafik pada soal.</p><canvas class="plot" id="exg" width="560" height="260"></canvas>';
  if (c === 'B')
    ex =
      '<h3>Bentuk Faktor dan Jembatan</h3><p>Jembatan baru melintang 1200 ft dengan akar $x = 0$ dan $x = 1200$, sehingga sumbu simetri di $x = 600$.</p><canvas class="plot" id="exg" width="560" height="240"></canvas>';
  if (c === 'A')
    ex =
      '<h3>Kanvas Bebas</h3><div class="ctl"><label>$y =$ <input id="fxin" value="x^2-4x+3" style="width:220px" autocomplete="off" spellcheck="false"></label><button class="btn" id="pf">Gambar</button></div><canvas class="plot" id="sk" width="560" height="320"></canvas><p class="mut sm">Contoh: 2x^2-3, -(x-1)^2+4, 0.5x^2. Coba bandingkan lebarnya!</p>';
  if (c === 'S')
    ex =
      '<h3>Applet 1: Bentuk grafik</h3><div id="ap"></div><h3 style="margin-top:20px">Applet 2: Temukan $x$-intercept</h3><canvas class="plot" id="xi" width="560" height="300"></canvas><div class="ctl"><label>x<input id="xs" type="range" min="-6" max="8" step=".5" value="-5"><b id="xv">-5</b></label></div><p class="eq" id="xm"></p><h3 style="margin-top:20px">Applet 3: $y$-intercept, vertex, sumbu</h3><canvas class="plot" id="yi" width="560" height="300"></canvas><div class="ctl"><label><input type="checkbox" data-o="y"> $y$-intercept</label><label><input type="checkbox" data-o="v"> vertex</label><label><input type="checkbox" data-o="a"> sumbu simetri</label></div>';
  if (c === 'R')
    ex =
      '<h3>Remember This!</h3><ul class="l"><li>Vertex form: $y = a(x - h)^2 + k$, vertex $(h, k)$, sumbu $x = h$.</li><li>Standard form: $y = ax^2 + bx + c$, sumbu $x = -\\dfrac{b}{2a}$.</li><li>Factored form: $y = a(x - p)(x - q)$, akar $p$ dan $q$.</li><li>Nilai $a$ menentukan arah dan lebar parabola.</li></ul>';
  if (c === '0')
    ex =
      '<h3>Recreating Gravity</h3><p class="mut">Seret slider untuk mengatur lemparan. Zona target terus bergerak dan pindah tiap lemparan. 3 lemparan per game, skor total minimal 35.</p><div id="dgm"></div>';
  const r = RK.find((x) => x.c === c);
  if (r.part)
    ex += `<div style="margin-top:22px"><div class="ice-opt-lab"><h3>Lab Eksplorasi Opsional: GeoGebra Part ${r.part}</h3><p class="mut sm">Opsional. Applet bawaan website ini sudah cukup untuk lanjut ke soal. Buka bila ingin bereksplorasi lebih bebas di kelas GeoGebra asli.</p><button class="btn ghost" id="og">Buka applet GeoGebra</button><div class="frame" id="gf" hidden></div></div></div>`;
  return ex;
};

function initPractice(c) {
  const u = me();
  if (c === '0')
    dagger($('#dgm'), (s) => (window.Prac ? Prac.gate0(s) : completeRank('0', Math.min(100, Math.round((s / 60) * 100)), 50)));
  if ($('#ap'))
    sliders(
      $('#ap'),
      c === 'E'
        ? { a: [-3, 3, 1], h: [-5, 5, 0], k: [-5, 5, 0] }
        : { a: [-3, 3, 1], h: [-5, 5, 1], k: [-9, 5, -9] },
    );
  $$('.steps div').forEach((d) => (d.onclick = () => d.classList.toggle('on')));
  if ($('#exg')) {
    const E = {
      D: [
        (x) => (x - 2) ** 2 - 3,
        {
          pts: [
            { x: 2, y: -3, l: '(2,-3)' },
            { x: 0, y: 1, l: '(0,1)' },
          ],
          axis: 2,
        },
      ],
      C: [(x) => x * x - 4 * x + 3, { pts: [{ x: 2, y: -1, l: '(2,-1)' }], axis: 2, y: [-4, 8] }],
      B: [
        (x) => -0.001 * x * (x - 1200),
        { x: [-100, 1300], y: [-50, 420], pts: [{ x: 600, y: 360, l: '(600,360)' }], axis: 600 },
      ],
    }[c];
    plot($('#exg'), [{ f: E[0] }], E[1]);
  }
  if ($('#sk')) {
    const dr = () => {
      try {
        let e = $('#fxin')
          .value.replace(/\^/g, '**')
          .replace(/(\d|\))\s*x/g, '$1*x')
          .replace(/(\d|x|\))\s*\(/g, '$1*(')
          .replace(/\)\s*\(/g, ')*(');
        if (!/^[0-9x+\-*/().\s]+$/.test(e)) throw 0;
        e = e.replace(/(^|[(+*/])\s*-\s*(?=[x(\d.])/g, '$1-1*');
        const f = new Function('x', 'return ' + e);
        f(1);
        plot($('#sk'), [{ f, col: '#f472a8' }]);
      } catch (_) {
        toast('Fungsi tidak valid');
      }
    };
    $('#pf').onclick = dr;
    dr();
  }
  if ($('#xi')) {
    const f = (x) => x * x - 2 * x - 8,
      up = () => {
        const t = +$('#xs').value;
        $('#xv').textContent = t;
        plot($('#xi'), [{ f }], {
          x: [-6, 8],
          y: [-12, 14],
          pts: [{ x: t, y: f(t), l: `(${t}, ${f(t)})`, col: f(t) === 0 ? '#4cc38a' : '#ffd86b' }],
        });
        $('#xm').textContent =
          f(t) === 0 ? 'x-intercept ditemukan: y = 0 saat x = ' + t : 'y = ' + f(t);
        if (f(t) === 0) AU.sfx('hit');
      };
    $('#xs').oninput = up;
    up();
  }
  if ($('#yi')) {
    const f = (x) => x * x - 2 * x - 8,
      up = () => {
        const o = (k) => $(`[data-o=${k}]`).checked,
          p = [];
        if (o('y')) p.push({ x: 0, y: -8, l: '(0,-8)', col: '#4cc38a' });
        if (o('v')) p.push({ x: 1, y: -9, l: '(1,-9)', col: '#f472a8' });
        plot($('#yi'), [{ f }], { x: [-6, 8], y: [-12, 14], pts: p, axis: o('a') ? 1 : null });
      };
    $$('[data-o]').forEach((e) => (e.onchange = up));
    up();
  }
  if ($('#og'))
    $('#og').onclick = () => {
      const f = $('#gf');
      f.hidden = false;
      f.innerHTML = `<iframe loading="lazy" allowfullscreen src="https://www.geogebra.org/material/iframe/id/${PART[RK.find((x) => x.c === c).part]}/width/1000/height/700/border/888888/rc/false/ai/false/sdz/true/smb/false/stb/false/stbh/true/ld/false/sri/true"></iframe>`;
      $('#og').hidden = true;
    };
}

function paint() {
  const c = RS.c,
    u = me(),
    i = RK.findIndex((x) => x.c === c),
    r = RK[i],
    st = stepsOf(c),
    cur = st[RS.step],
    items = Q[c] || [],
    nx = RK[i + 1],
    dn = u.done[c];
  let h = `<div class="sys"><span class="badge" style="background:${r.col}">${RI(c)}</span><small class="tag">[ SYSTEM ] ${r.n.toUpperCase()} ${r.xp ? '| +' + r.xp + ' XP' : '| tanpa XP'} ${dn ? '| SELESAI, skor ' + dn.score : ''}</small><h2>${r.t}</h2><p><button class="btn ghost" data-go="#/forum/${c}">Diskusi di forum</button></p><div class="stp">${st.map((s, j) => `<button class="${j === RS.step ? 'on' : j < RS.step ? 'dn' : ''}" data-act="tab" data-v="${j}"><i>${IC(Ico.STEPICON[s] || 'gate')}</i>${s === 'Soal' && window.Prac && Prac.has(c) ? 'Boss Quiz' : s}</button>`).join('<em></em>')}</div></div><div class="card">`;
  if (cur === 'Misi') {
    h += `<h3>Misi</h3>${window.Brief ? Brief.html(c) : ''}<p>${r.info}</p>${window.Bat ? Bat.intro(c) : ''}`;
    if (c === '0')
      h +=
        '<p class="mut" style="margin-top:10px">Dive into the dungeon of curves. Setiap parabola adalah portal menuju tantangan baru. Kamu berperan sebagai shadow soldier yang menaklukkan tiap level dengan kemampuan grafikmu.</p><h3 style="margin-top:14px">Tujuan belajar</h3><ul class="l"><li>Transformasi grafik fungsi kuadrat dari vertex form.</li><li>Vertex dan sumbu simetri dari vertex, standar, dan faktor.</li><li>Karakteristik parabola: concavity, interval, domain, range.</li><li>Menggambar parabola dari tiga bentuk.</li><li>Membandingkan dua fungsi kuadrat.</li></ul>';
    h += `<p class="ttl" style="margin:14px 0">${r.xp ? 'Hadiah: +' + r.xp + ' XP' : 'Tes ini tidak memberi XP, hasilnya dipakai untuk menghitung N-gain'}</p><button class="btn" data-act="tab" data-v="1">${c === 'P' || c === 'T' ? 'Mulai tes' : st[1] === 'Materi' ? 'Buka materi' : 'Mulai praktik'}</button>`;
  } else if (cur === 'Materi') {
    h += Materi.html(c) + `<p style="margin-top:22px"><button class="btn" data-act="tab" data-v="${st.indexOf('Praktik')}">Lanjut ke praktik</button></p>`;
  } else if (cur === 'Praktik') {
    h +=
      exHTML(c) +
      (items.length
        ? `<p style="margin-top:20px"><button class="btn" data-act="tab" data-v="${st.indexOf(st.includes('Latihan') ? 'Latihan' : 'Soal')}">${st.includes('Latihan') ? 'Lanjut ke latihan' : 'Lanjut ke soal'}</button></p>`
        : dn
          ? `<p style="margin-top:20px"><button class="btn" data-go="#/result/${c}">Lihat hasil</button></p>`
          : '');
  } else if (cur === 'Latihan') {
    h += Prac.html(c);
  } else if (window.Prac && !Prac.unlocked(c)) {
    h += `<h3>Kuis Penaklukan Gate terkunci</h3><p class="mut">Selesaikan dulu Latihan Bertahap (${Prac.count(c)}/${PQ[c].length})${c === '0' ? ' dan game belati di langkah Praktik' : ''} untuk melawan Boss Gate ini.</p><p><button class="btn" data-act="tab" data-v="${st.indexOf('Latihan')}">Ke Latihan Bertahap</button></p>`;
  } else {
    const qi = RS.qi,
      it = items[qi],
      sd = (me().st[c + qi] || {}).done;
    h += battleHTML(c, items);
    h += `<div class="dots">${items
      .map((_, j) => {
        const s = u.st[c + j] || {};
        return `<b class="${s.done ? (s.ok ? 'ok' : 'bad') : ''} ${j === qi ? 'cur' : ''}" data-act="qgo" data-v="${j}">${j + 1}</b>`;
      })
      .join(
        '',
      )}<span class="mut">Soal ${qi + 1} dari ${items.length}</span></div>${itemHTML(c, qi, it)}<div class="nav2">${qi > 0 ? '<button class="btn ghost" data-act="qgo" data-v="' + (qi - 1) + '">Sebelumnya</button>' : '<span></span>'}${sd ? (qi < items.length - 1 ? `<button class="btn" data-act="qgo" data-v="${qi + 1}">Soal berikutnya</button>` : allAnswered(c) ? `<button class="btn" data-act="finish">${dn ? 'Lihat hasil' : 'Selesaikan dan lihat hasil'}</button>` : '<span class="mut">Masih ada soal yang belum dijawab.</span>') : '<span></span>'}</div>${allAnswered(c) && window.Rev && (c !== 'P' || u.done.T) ? `<div class="pdone"><h4>Pembahasan tiap nomor</h4>${Rev.quizList(c)}</div>` : ''}`;
  }
  $('#rk').innerHTML = h + '</div>';
  window.Gloss && Gloss.apply($('#rk'));
  window.Brief && (cur === 'Misi' ? (Brief.mount || Brief.init)(c, $('#rk')) : Brief.stop());
  if (cur === 'Materi') Materi.init(c, $('#rk'));
  if (cur === 'Praktik') initPractice(c);
  if (cur === 'Latihan') Prac.init(c);
  if (cur === 'Soal' && $('.item')) {
    const b = $('.item');
    const q = items[RS.qi];
    q.draw && q.draw(b);
    window.Cut && Cut.bossGate(c);
  }
}

V.rank = (c) => {
  const u = me(),
    i = RK.findIndex((r) => r.c === c);
  if (i < 0 || state(u, i) === 'locked') {
    location.hash = '#/map';
    return '';
  }
  if (RS.c !== c) {
    const it = Q[c] || [],
      f = it.findIndex((_, j) => !(u.st[c + j] || {}).done);
    RS = { c, step: 0, qi: f < 0 ? 0 : f };
    if (window.Sys && c !== 'P' && c !== 'T') {
      AU.sfx('gate');
      Sys.pop('GATE TERBUKA: ' + RK[i].n, 'info', 2200);
    }
  }
  return '<div id="rk"></div>';
};
V.rank.post = () => paint();

const ladder = (u, list) =>
  '<div class="ladder">' +
  list
    .map((r) => {
      const i = RK.indexOf(r),
        s = state(u, i);
      return `<div class="rank rv ${s === 'open' ? '' : s}" data-go="${s === 'locked' ? '' : '#/rank/' + r.c}"><span class="badge" style="background:${r.col}">${RI(r.c)}</span><b>${r.n}</b><small>${r.t}</small><em>+${r.xp} XP</em></div>`;
    })
    .join('') +
  '</div>';

V.dash = () => {
  const u = me(),
    xp = xpOf(u),
    nx = nextOf(xp),
    cur = RK.findIndex((r) => !u.done[r.c]),
    all = students().sort((a, b) => xpOf(b) - xpOf(a));
  return `<div class="grid2"><div class="sys rv"><small class="tag">[ SYSTEM ] STATUS HUNTER</small><h1>${u.name}</h1><p class="ttl">${titleOf(xp)}</p><div><span class="big" data-n="${xp}">0</span> <span class="mut">/ ${nx || 'MAX'} XP</span></div><div class="bar"><div data-w="${nx ? Math.min(100, (xp / nx) * 100) : 100}"></div></div><div class="grid3"><div class="stat"><b data-n="${Object.keys(u.done).length}">0</b><span>Quest selesai</span></div><div class="stat"><b>${u.streak}</b><span>Streak hari</span></div><div class="stat"><b>${BADGES.filter((b) => b[2](u)).length}</b><span>Badge</span></div></div><p class="mut sm" style="margin-top:10px">Pretest ${pre(u) ?? '-'} | Posttest ${post(u) ?? '-'} | N-gain ${fmt(ngain(u))} (${ngCat(ngain(u))})</p>${window.Forge ? Forge.dashLine(u) : ''}<p style="margin-top:14px">${cur > -1 ? `<button class="btn" data-go="#/rank/${RK[cur].c}">${Object.keys(u.done).length ? 'Lanjut' : 'Mulai'}: ${RK[cur].n}</button>` : '<span class="ttl">Semua dungeon ditaklukkan. Arigatou!</span>'} <button class="btn ghost" data-go="#/map">Peta dungeon</button></p></div>
 <div class="card rv"><small class="tag">[ SYSTEM ] SPIDER ANALYSIS</small><h3>Peta Kecerdasanmu</h3><canvas id="rd" width="440" height="340" style="width:100%"></canvas><p class="mut sm">Skor tiap dungeon (0 sampai 100). Makin penuh jaring, makin kuat.</p></div></div>
 ${dashExtras(u)}
 <h3 class="rv">Peta Dungeon</h3>${ladder(u, RK)}
 <div class="grid2"><div class="card rv"><small class="tag">[ SYSTEM ] PENCAPAIAN</small>${BADGES.map((b) => `<p style="opacity:${b[2](u) ? 1 : 0.35}">${IC(b[2](u) ? 'star' : 'starO')} <b>${b[0]}</b> <span class="mut">${b[1]}</span></p>`).join('')}</div>
 <div class="card rv"><small class="tag">[ SYSTEM ] PERINGKAT</small><table>${all
   .slice(0, 6)
   .map(
     (s, i) =>
       `<tr style="${s.name === u.name ? 'background:rgba(154,90,255,.2)' : ''}"><td>#${i + 1}</td><td>${s.name}</td><td>${titleOf(xpOf(s))}</td><td>${xpOf(s)} XP</td></tr>`,
   )
   .join('')}</table></div></div>`;
};
V.dash.post = () => radar($('#rd'), LBL, [{ v: skill(me()), col: '#4d8bff' }]);

V.map = () => {
  const u = me();
  return `<div class="sys rv"><small class="tag">[ SYSTEM ] PETA DUNGEON</small><h2>Quadratic Function Dungeon</h2><p class="mut">Taklukkan dungeon secara berurutan. Tiap dungeon terbuka setelah yang sebelumnya selesai.</p></div><h3 class="rv">Pretest, Gerbang, dan Part 1 (Rank E, D, C)</h3>${ladder(
    u,
    RK.filter((r) => r.c === 'P' || r.c === '0' || r.part === 1),
  )}<h3 class="rv">Part 2 (Rank B, A, S), Wrap-up, dan Posttest</h3>${ladder(
    u,
    RK.filter((r) => r.part === 2 || r.c === 'T'),
  )}`;
};
V.result = (c) => {
  const u = me(),
    i = RK.findIndex((r) => r.c === c),
    r = RK[i],
    d = u.done[c];
  if (!d) {
    location.hash = '#/map';
    return '';
  }
  const nx = RK[i + 1],
    rows =
      (Q[c] || [])
        .map((it, j) => {
          const s = u.st[c + j] || {};
          return `<tr><td>${it.tag}</td><td>${s.ok ? 'Benar' : 'Perlu belajar lagi'}</td><td>${s.att || 0}</td><td>${s.score || 0}</td></tr>`;
        })
        .join('') ||
      '<tr><td colspan="4" class="mut">Game belati: skor mengikuti total poin lemparan.</td></tr>';
  return `<div class="sys resh rv"><div class="army sm">${Array.from({ length: 9 }, (_, k) => `<i style="animation-delay:${k * 0.1}s"></i>`).join('')}</div><small class="tag">[ SYSTEM ] ${r.n.toUpperCase()}</small><h1 class="glitch" data-t="CLEARED">CLEARED</h1>${d.up ? `<p class="ttl">LEVEL UP: ${d.up}</p>` : ''}${c === 'T' && ngain(u) != null ? `<p class="ttl">N-gain ${fmt(ngain(u))} (${ngCat(ngain(u))}) | Pretest ${pre(u)} | Posttest ${post(u)}</p>` : ''}<div class="grid3" style="max-width:560px;margin:16px auto"><div class="stat"><b>+${d.xp}</b><span>XP</span></div><div class="stat"><b>${d.score}</b><span>Skor</span></div><div class="stat"><b>${xpOf(u)}</b><span>Total XP</span></div></div><p>${nx ? `<button class="btn" data-go="#/rank/${nx.c}">Lanjut ke ${nx.n}: ${nx.t}</button>` : '<button class="btn" data-go="#/dash">Semua selesai. Lihat dashboard</button>'} <button class="btn ghost" data-go="#/map">Peta dungeon</button></p></div>
 <div class="grid2"><div class="card rv"><small class="tag">[ SYSTEM ] RINCIAN</small><table><tr><th>SOAL</th><th>HASIL</th><th>PERCOBAAN</th><th>SKOR</th></tr>${rows}</table></div><div class="card rv"><small class="tag">[ SYSTEM ] SPIDER ANALYSIS</small><canvas id="rd" width="440" height="340" style="width:100%"></canvas></div></div>`;
};
V.result.post = () => radar($('#rd'), LBL, [{ v: skill(me()), col: '#4d8bff' }]);
V.profile = () => {
  const u = me(),
    xp = xpOf(u),
    ref = Object.entries(u.st).filter(([k, s]) => s.v && typeof s.v === 'string');
  return `<div class="grid2"><div class="sys rv"><small class="tag">[ SYSTEM ] PROFIL HUNTER</small><span class="profav">${window.Forge ? Forge.av(u.name, 72, u) : Avatar.html(u.name, 72)}</span><h1>${esc(u.name)}</h1><p class="ttl">${titleOf(xp)}</p><p>${xp} XP | streak ${u.streak} hari</p>${window.Forge ? Forge.profileBlock(u) : ''}<p>${T2('cl_label')}: <b>${esc(u.cls || '-')}</b> <button class="btn ghost" data-act="cls">${T2('cl_change')}</button></p>${window.Tr ? Tr.studentBox() : ''}<p style="margin-top:14px"><button class="btn ghost" data-go="#/avatar">Ubah avatar</button> <button class="btn ghost" data-act="reset">Reset progres</button> ${RK.every((r) => u.done[r.c]) ? '<button class="btn" data-go="#/cert">Lihat sertifikat</button>' : ''}</p></div><div class="card rv"><small class="tag">[ SYSTEM ] SPIDER ANALYSIS</small><canvas id="rd" width="440" height="340" style="width:100%"></canvas></div></div>
 <div class="grid2"><div class="card rv"><small class="tag">[ SYSTEM ] RIWAYAT DUNGEON</small><table><tr><th>DUNGEON</th><th>SKOR</th><th>XP</th></tr>${
   RK.filter((r) => u.done[r.c])
     .map(
       (r) =>
         `<tr class="pick" data-go="#/result/${r.c}"><td>${r.n}</td><td>${u.done[r.c].score}</td><td>${u.done[r.c].xp}</td></tr>`,
     )
     .join('') || '<tr><td class="mut">Belum ada dungeon yang selesai.</td></tr>'
 }</table></div><div class="card rv"><small class="tag">[ SYSTEM ] BADGE DAN CATATAN</small>${BADGES.map((b) => `<p style="opacity:${b[2](u) ? 1 : 0.35}">${IC(b[2](u) ? 'star' : 'starO')} <b>${b[0]}</b></p>`).join('')}<h3 style="margin-top:12px">Jawaban tertulismu</h3>${ref.map(([k, s]) => `<p class="sm"><b>${k}</b>: ${esc(s.v)}</p>`).join('') || '<p class="mut sm">Belum ada.</p>'}</div></div>`;
};
V.profile.post = () => radar($('#rd'), LBL, [{ v: skill(me()), col: '#4d8bff' }]);

V.ggb =
  () => `<div class="card rv"><small class="tag">[ SYSTEM ] LAB EKSPLORASI OPSIONAL</small><h2>Lab Eksplorasi Opsional: GeoGebra Classroom</h2><p class="mut">Halaman ini opsional dan tidak memengaruhi XP maupun nilai. Semua applet interaktif yang kamu butuhkan sudah ada di langkah Materi dan Praktik tiap dungeon. Gunakan lab ini bila ingin bereksplorasi lebih bebas.</p><div class="tabs" id="gt"><button class="on" data-p="1">Part 1: Rank E, D, C</button><button data-p="2">Part 2: Rank B, A, S</button></div><div class="frame" id="gf" style="margin-top:12px"></div><p class="sm"><a style="color:var(--cy)" id="gl" target="_blank" rel="noopener" href="https://www.geogebra.org/m/rxe5muqn">Buka langsung di GeoGebra</a></p></div>
<div class="grid2"><div class="card rv"><h3>Elemen Part 1</h3>${['Feedback', 'Activity Backstory', 'Lesson Objectives', 'Activity Instructions', 'Materials Explanation', 'Condition and Term', 'Quadratic Function Characteristics', 'Parent Function', 'Important Terms', 'Video penjelasan', 'Intro: Recreating Gravity (game belati)', 'Activity 1 Rank E: Vertex Form', 'Activity 2 Rank D: Graphing in Vertex Form', 'Activity 3 Rank C: Standard Form', 'Multiple, Challenger, Semi-Pro', 'Reflection dan Reference'].map((t) => `<span class="tagc">${t}</span>`).join('')}</div><div class="card rv"><h3>Elemen Part 2</h3>${['Feedback', 'Activity Backstory', 'Activity 4 Rank B: Factored Form', 'Architectural Bridge Challenge 1/5 sampai 5/5', 'Activity 5 Rank A: Putting it All Together', 'Activity 6 Rank S: Sketch and Explaining', 'Enam applet (contoh dan latihan)', 'Multiple Choice x-intercept', 'Peak Question', 'Wrap-Up: Review Questions', 'Remember This!', 'Reflection'].map((t) => `<span class="tagc">${t}</span>`).join('')}</div></div>`;
V.ggb.post = () => {
  const ld = (p) => {
    $('#gf').innerHTML =
      `<iframe loading="lazy" allowfullscreen src="https://www.geogebra.org/material/iframe/id/${PART[p]}/width/1000/height/700/border/888888/rc/false/ai/false/sdz/true/smb/false/stb/false/stbh/true/ld/false/sri/true"></iframe>`;
    $('#gl').href = 'https://www.geogebra.org/m/' + PART[p];
  };
  ld(1);
  $$('#gt button').forEach(
    (b) =>
      (b.onclick = () => {
        $$('#gt button').forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
        ld(b.dataset.p);
      }),
  );
};

V.board = () => {
  const cs = window.Cls ? Cls.filter(students(), 'board') : students(),
    all = cs.slice().sort((a, b) => xpOf(b) - xpOf(a)),
    rd = cs
      .filter((x) => x.raid)
      .sort((a, b) => b.raid.best - a.raid.best);
  return (
    (window.Cls ? Cls.bar('board') : '') +
    podium(all) +
    (window.Forge ? Forge.hall(cs) : '') +
    `<div class="card rv"><small class="tag">[ SYSTEM ] PERINGKAT HUNTER</small><table><tr><th>#</th><th>NAMA</th><th>TITLE</th><th>XP</th></tr>${all.map((s, i) => `<tr style="${s.name === DB.me ? 'background:rgba(154,90,255,.2)' : ''}"><td>${i + 1}</td><td>${window.Forge ? Forge.av(s.name, 24, s) : Avatar.html(s.name, 24)} ${esc(s.name)}</td><td>${titleOf(xpOf(s))}</td><td>${xpOf(s)}</td></tr>`).join('')}</table></div><div class="card rv"><small class="tag">[ SYSTEM ] PERINGKAT RAID WAKTU</small><table><tr><th>#</th><th>NAMA</th><th>SKOR TERBAIK</th><th>PERCOBAAN</th></tr>${rd.map((s, i) => `<tr style="${s.name === DB.me ? 'background:rgba(154,90,255,.2)' : ''}"><td>${i + 1}</td><td>${window.Forge ? Forge.av(s.name, 24, s) : Avatar.html(s.name, 24)} ${esc(s.name)}</td><td>${s.raid.best}</td><td>${s.raid.runs.length}</td></tr>`).join('') || '<tr><td class="mut">Belum ada yang mencoba.</td></tr>'}</table></div>`
  );
};
let SEL = null;

let CCT = 0;
const ccStats = (all) => {
  const sc = [];
  all.forEach((s) => AX.forEach((r) => s.done[r.c] && sc.push(s.done[r.c].score)));
  const gs = all.map(ngain).filter((g) => g != null),
    v = window.Cls ? Cls.sel('class') : '*',
    wb = window.WBoss ? WBoss.choices().filter((b) => b.status === 'active' && (v === '*' || !b.cls || b.cls === v)).length : 0;
  return {
    n: all.length,
    started: all.filter((s) => Object.keys(s.done).length).length,
    sc: sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length) : null,
    ng: gs.length ? gs.reduce((a, b) => a + b, 0) / gs.length : null,
    wb,
  };
};
const ccWbHint = (n) => (n ? 'Boss sedang berlangsung' : 'Tidak ada sesi aktif');
const cmdCenter = (all) => {
  const k = ccStats(all);
  return `<section class="gm-cc rv"><div class="gm-hd"><span class="gm-crest">${IC('crown')}</span><div><h2>GUILD MASTER COMMAND CENTER</h2><p>PANEL KONTROL GURU</p></div></div>${window.Cls ? Cls.bar('class') : ''}<div class="gm-stats"><div class="gm-st"><i>${IC('hunter')}</i><b data-n="${k.n}">0</b><span>Total Siswa Terdaftar</span><small>${k.started} sudah memulai</small></div><div class="gm-st"><i>${IC('star')}</i><b>${k.sc == null ? '-' : k.sc}</b><span>Rata-Rata Skor Kelas</span><small>dari dungeon yang selesai</small></div><div class="gm-st"><i>${IC('radar')}</i><b>${fmt(k.ng)}</b><span>Rata-Rata N-Gain</span><small>${k.ng == null ? 'Belum ada data' : ngCat(k.ng)}</small></div><button type="button" class="gm-st gm-wb" data-go="#/worldboss"><i>${IC('swords')}</i><b id="gmwb">${k.wb}</b><span>Sesi World Boss Aktif</span><small id="gmwbh">${ccWbHint(k.wb)}</small></button></div></section>`;
};
const ccLive = () => {
  clearInterval(CCT);
  CCT = setInterval(() => {
    const b = $('#gmwb');
    if (!b || !/^#\/class/.test(location.hash || '#/class')) return clearInterval(CCT);
    const k = ccStats(window.Cls ? Cls.filter(students(), 'class') : students());
    b.textContent = k.wb;
    $('#gmwbh').textContent = ccWbHint(k.wb);
  }, 4000);
};

V.class = () => {
  const all = (window.Cls ? Cls.filter(students(), 'class') : students()).slice().sort((a, b) => xpOf(b) - xpOf(a)),
    n = all.length || 1,
    avg = AX.map((_, i) => Math.round(all.reduce((a, s) => a + skill(s)[i], 0) / n));
  SEL = SEL && DB.users[SEL] ? SEL : (all[0] || {}).name;
  return cmdCenter(all) + `<div class="grid2"><div class="card rv"><small class="tag">[ SYSTEM ] DAFTAR SISWA</small><table><tr><th>NAMA</th><th>KELAS</th><th>TITLE</th><th>XP</th><th>PROGRES</th><th>PRE</th><th>POST</th><th>N-GAIN</th></tr>${all.map((s) => `<tr class="pick ${s.name === SEL ? 'sel' : ''}" data-s="${s.name}"><td>${s.name}</td><td>${esc((s.cls) || '-')}</td><td>${titleOf(xpOf(s))}</td><td>${xpOf(s)}</td><td>${Object.keys(s.done).length}/${RK.length}</td><td>${pre(s) ?? '-'}</td><td>${post(s) ?? '-'}</td><td>${fmt(ngain(s))}</td></tr>`).join('')}</table><p style="margin-top:12px"><button class="btn ghost" id="csv">Unduh CSV</button></p></div>
<div class="card rv"><small class="tag" id="rt">[ SYSTEM ] SPIDER ANALYSIS: ${SEL || '-'} (biru) vs KELAS (ungu)</small><canvas id="rd" width="440" height="340" style="width:100%"></canvas></div></div>
<div class="card rv"><small class="tag">[ SYSTEM ] ANALISIS PER DUNGEON</small><table><tr><th>DUNGEON</th><th>TOPIK</th><th>RATA-RATA SKOR</th><th>SELESAI</th></tr>${AX.map((r, i) => `<tr><td>${r.n}</td><td>${r.t}</td><td>${avg[i]}</td><td>${all.filter((s) => s.done[r.c]).length}/${all.length}</td></tr>`).join('')}</table></div>${annForm()}`;
};
V.class.post = () => {
  annWire();
  ccLive();
  const all = window.Cls ? Cls.filter(students(), 'class') : students(),
    n = all.length || 1,
    avg = AX.map((_, i) => Math.round(all.reduce((a, s) => a + skill(s)[i], 0) / n)),
    draw = () =>
      radar($('#rd'), LBL, [
        { v: skill(DB.users[SEL] || { done: {} }), col: '#4d8bff' },
        { v: avg, col: '#9a5aff' },
      ]);
  draw();
  $$('tr.pick').forEach(
    (t) =>
      (t.onclick = () => {
        SEL = t.dataset.s;
        $$('tr.pick').forEach((x) => x.classList.toggle('sel', x === t));
        $('#rt').textContent = `[ SYSTEM ] SPIDER ANALYSIS: ${SEL} (biru) vs KELAS (ungu)`;
        draw();
      }),
  );
  $('#csv').onclick = () => {
    const rows = [
        ['Nama', 'Kelas', 'Title', 'XP', ...AX.map((r) => r.n), 'Pretest', 'Posttest', 'N-gain'],
        ...all.map((s) => [
          s.name,
          s.cls || '',
          titleOf(xpOf(s)),
          xpOf(s),
          ...skill(s),
          pre(s) ?? '',
          post(s) ?? '',
          fmt(ngain(s)),
        ]),
      ],
      a = document.createElement('a');
    a.href =
      'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.map((r) => r.join(',')).join('\n'));
    a.download = 'rekap_hunter.csv';
    a.click();
  };
};

V.resp = () => {
  const rows = [];
  students().forEach((s) =>
    Object.entries(s.st).forEach(([k, x]) => {
      if (typeof x.v === 'string' && Q[k[0]] && Q[k[0]][+k.slice(1)])
        rows.push([
          esc(s.name),
          Q[k[0]][+k.slice(1)].tag + ' (' + RK.find((r) => r.c === k[0]).n + ')',
          esc(x.v),
        ]);
    }),
  );
  return `<div class="card rv"><small class="tag">[ SYSTEM ] JAWABAN TERTULIS SISWA</small><p class="mut">Discussion, Challenge 5/5, dan Reflection yang dikirim siswa.</p><table><tr><th>SISWA</th><th>SOAL</th><th>JAWABAN</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('') || '<tr><td colspan="3" class="mut">Belum ada jawaban.</td></tr>'}</table></div>`;
};
V.analysis = () => {
  const S = students(),
    rows = [];
  RK.forEach((r) =>
    (Q[r.c] || []).forEach((it, j) => {
      if (it.t === 'open') return;
      const a = S.map((s) => s.st[r.c + j]).filter((x) => x && x.done),
        p = a.length ? Math.round((a.filter((x) => x.ok).length / a.length) * 100) : null;
      rows.push([r.n, r.c + (j + 1), it.tag, a.length, p]);
    }),
  );
  const g = S.map((s) => ngain(s)).filter((x) => x != null),
    ag = g.length ? g.reduce((a, b) => a + b, 0) / g.length : null,
    ap = S.filter((s) => pre(s) != null),
    ao = S.filter((s) => post(s) != null),
    m = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : '-');
  return `<div class="grid3"><div class="card stat rv"><b>${m(ap.map((u) => pre(u)))}</b><span>Rata-rata pretest (${ap.length} siswa)</span></div><div class="card stat rv"><b>${m(ao.map((u) => post(u)))}</b><span>Rata-rata posttest (${ao.length} siswa)</span></div><div class="card stat rv"><b>${fmt(ag)}</b><span>Rata-rata N-gain (${ngCat(ag)})</span></div></div>
<div class="grid2"><div class="card rv"><small class="tag">[ SYSTEM ] ANALISIS BUTIR SOAL</small><table><tr><th>DUNGEON</th><th>SOAL</th><th>DIJAWAB</th><th>% BENAR</th><th>KATEGORI</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[3]}</td><td><div class="pb"><i style="width:${r[4] || 0}%"></i></div> ${r[4] ?? '-'}</td><td>${r[4] == null ? '-' : r[4] > 70 ? 'Mudah' : r[4] >= 40 ? 'Sedang' : 'Sulit'}</td></tr>`).join('')}</table></div>
<div class="card rv"><small class="tag">[ SYSTEM ] N-GAIN PER SISWA</small><table><tr><th>NAMA</th><th>PRE</th><th>POST</th><th>N-GAIN</th><th>KATEGORI</th></tr>${S.map((s) => `<tr><td>${s.name}</td><td>${pre(s) ?? '-'}</td><td>${post(s) ?? '-'}</td><td>${fmt(ngain(s))}</td><td>${ngCat(ngain(s))}</td></tr>`).join('')}</table><p class="mut sm">N-gain = (posttest - pretest) / (100 - pretest). Tinggi: 0,7 ke atas. Sedang: 0,3 sampai 0,7. Rendah: di bawah 0,3.</p></div></div><div class="grid2"><div class="card rv"><small class="tag">[ SYSTEM ] PENGATURAN RAID WAKTU</small><label>Waktu per soal (detik)<input id="cs" type="number" min="20" max="300" value="${cfg().raidSec}"></label><label>Jumlah soal per raid<input id="cn" type="number" min="3" max="20" value="${cfg().raidN}"></label><p class="mut sm">Soal isian mendapat waktu dua kali lipat. ${window.Sync && Sync.isOn() ? 'Pengaturan tersimpan di cloud dan langsung berlaku untuk semua siswa.' : 'Pengaturan akun demo tersimpan di browser ini.'}</p><p style="margin-top:10px"><button class="btn" id="cfgs">Simpan</button></p></div><div class="card rv"><small class="tag">[ SYSTEM ] REKAP RAID</small><table><tr><th>NAMA</th><th>TERBAIK</th><th>PERCOBAAN</th><th>BONUS XP</th></tr>${S.map((s) => `<tr><td>${esc(s.name)}</td><td>${s.raid ? s.raid.best : '-'}</td><td>${s.raid ? s.raid.runs.length : 0}</td><td>${s.bonus || 0}</td></tr>`).join('')}</table></div></div>`;
};
V.analysis.post = () => {
  $('#cfgs').onclick = () => {
    const a = Math.min(300, Math.max(20, +$('#cs').value || RAID_DEF.raidSec)),
      n = Math.min(20, Math.max(3, +$('#cn').value || RAID_DEF.raidN));
    DB.cfg = { raidSec: a, raidN: n, v: 2 };
    if (window.Sync && Sync.isOn()) Sync.saveCfg(a, n);
    save();
    toast(window.Sync && Sync.isOn() ? 'Pengaturan raid disimpan di cloud untuk semua siswa' : 'Pengaturan raid disimpan');
  };
};
const helpStudent =
  () => `<div class="sys rv"><small class="tag">[ SYSTEM ] PANDUAN</small><h2>Cara Bermain</h2><ul class="l"><li>Daftar atau masuk, lalu kerjakan <b>Pretest</b> untuk mengukur kemampuan awal.</li><li>Taklukkan dungeon berurutan: Gerbang, Rank E, D, C, B, A, S, lalu Wrap-up.</li><li>Tiap dungeon sekarang punya empat langkah: <b>Misi</b>, <b>Materi</b> (model Iceberg 4 lapisan: situasi nyata, model, temukan pola, rumus formal), <b>Praktik</b> (applet dan contoh), lalu <b>Soal</b>.</li><li>GeoGebra Classroom kini menjadi <b>Lab Eksplorasi Opsional</b>: tidak wajib dan tidak memengaruhi XP. Buka lewat kartu di bawah atau menu Pengaturan.</li><li>Soal punya 3 percobaan. Tombol Petunjuk membantu tetapi mengurangi 10 poin (skill karakter bisa mengurangi penalti ini). Pembahasan muncul setelah menjawab.</li><li>Bingung dengan istilah seperti Gate, Rank, Raid, atau Enhance? Buka <a class="gllink" data-gl="open">Panduan Istilah System</a>, atau arahkan kursor (ketuk di HP) pada kata bergaris titik-titik.</li><li>Setiap karakter pendamping punya <b>skill</b> unik. Pilih temanmu di menu Karakter, lalu lihat skill aktifnya di sana.</li><li>Pintasan keyboard: angka 1 sampai 9 memilih opsi, Enter memeriksa jawaban, panah kiri atau kanan berpindah soal.</li><li>Selesai semua dungeon, kerjakan <b>Posttest</b> untuk melihat N-gain dan membuka sertifikat.</li></ul></div>
<div class="grid2"><div class="card rv"><h3>Dungeon dan XP</h3><table><tr><th>DUNGEON</th><th>TOPIK</th><th>XP</th></tr>${RK.map((r) => `<tr><td>${r.n}</td><td>${r.t}</td><td>${r.xp}</td></tr>`).join('')}</table></div><div class="card rv"><h3>Title Hunter</h3><table>${TT.map((t) => `<tr><td>${t[1]}</td><td>${t[0]} XP</td></tr>`).join('')}</table><h3 style="margin-top:16px">Musik dan suara</h3><p class="mut">Tombol di kanan bawah mengatur musik, efek suara, dan volume. Browser baru mengizinkan suara setelah kamu mengklik sesuatu.</p><h3 style="margin-top:16px">Skor dan spider analysis</h3><p class="mut">Skor tiap dungeon (0 sampai 100) membentuk jaring 6 sumbu di dashboard dan profil.</p></div><div class="card rv ice-opt-lab"><small class="tag">[ SYSTEM ] LAB EKSPLORASI OPSIONAL</small><h3>GeoGebra Classroom</h3><p class="mut">GeoGebra Classroom untuk bereksplorasi lebih bebas. Tidak wajib dan tidak memengaruhi XP.</p><p><button class="btn ghost" data-go="#/ggb">Buka Lab Eksplorasi</button></p></div></div>`;

V.help = () => (isT() && window.Gm247 ? Gm247.helpView() : helpStudent());

V.cert = () => {
  const u = me();
  if (!RK.every((r) => u.done[r.c])) {
    location.hash = '#/profile';
    return '';
  }
  return `<div class="cert rv"><small class="tag">[ SYSTEM ] SERTIFIKAT</small><h1 class="ttl">SHADOW MONARCH</h1><p>Dengan ini dinyatakan bahwa</p><h2 style="font-size:36px;margin:8px 0">${u.name}</h2><p>telah menaklukkan seluruh dungeon Quadratic Function Dungeon dengan total <b>${xpOf(u)} XP</b> dan title <b>${titleOf(xpOf(u))}</b>.</p><p>Pretest ${pre(u)} | Posttest ${post(u)} | N-gain ${fmt(ngain(u))} (${ngCat(ngain(u))})</p><canvas id="rd" width="440" height="320" style="max-width:100%"></canvas><p class="mut">${new Date().toLocaleDateString(window.I18N ? I18N.locale() : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p><p class="noprint"><button class="btn" onclick="window.print()">Cetak atau simpan PDF</button> <button class="btn ghost" data-go="#/profile">Kembali</button></p></div>`;
};
V.cert.post = () => radar($('#rd'), LBL, [{ v: skill(me()), col: '#4d8bff' }]);

V.avatar = () => Avatar.view();
V.avatar.post = () => Avatar.post();
V.chars = () => charsView();

V.team = () => (window.Team ? Team.view() : '');
V.settings = () => settingsView();
V.settings.post = settingsPost;
V.chars.post = () => {};

let RD = null,
  RDT = null;
const raidPool = (u) => {
  const p = [];
  RK.forEach((r) => {
    if ('EDCBAS'.includes(r.c) && u.done[r.c])
      (Q[r.c] || []).forEach((it, j) => {
        if (it.t !== 'open') p.push({ c: r.c, j, it });
      });
  });
  return p;
};
const evalBox = (it, b) =>
  it.t === 'mc'
    ? $$('input:checked', b)
        .map((e) => +e.value)
        .sort()
        .join() === it.a.join()
    : $$('[data-f]', b).every((e, j) => it.f[j].r.test(stdAns(e.value)));
V.raid = () => {
  return `<div class="sys rv"><small class="tag">[ SYSTEM ] RAID WAKTU</small><h2>Time Attack</h2><p class="mut">Jawab soal acak melawan waktu. Makin cepat, makin tinggi poinnya.</p></div><div id="rdz"></div>`;
};
V.raid.post = () => raidPaint();
function raidPaint() {
  const z = $('#rdz');
  if (!z) return;
  const u = me(),
    c = cfg(),
    pool = raidPool(u);
  if (RD && !RD.fin) {
    raidQ();
    return;
  }
  if (!RD) {
    const best = (u.raid || {}).best || 0,
      runs = (u.raid || {}).runs || [];
    z.innerHTML = pool.length
      ? `<div class="grid2"><div class="card"><h3>Aturan</h3><ul class="l"><li>${Math.min(c.raidN, pool.length)} soal acak dari dungeon yang sudah kamu taklukkan (${pool.length} soal tersedia).</li><li>Waktu ${c.raidSec} detik per soal (isian ${c.raidSec * 2} detik).</li><li>Poin: 100 per jawaban benar ditambah bonus kecepatan sampai 50.</li><li>Bonus XP: +10 untuk setiap peningkatan skor terbaikmu.</li></ul><p class="ttl">Skor terbaik: ${best}</p><button class="btn" id="rgo">Mulai raid</button></div><div class="card"><h3>Riwayat</h3><table><tr><th>WAKTU</th><th>BENAR</th><th>POIN</th><th>DURASI</th></tr>${runs.map((r) => `<tr><td>${ago(r.ts)}</td><td>${r.ok}/${r.n}</td><td>${r.pts}</td><td>${r.sec} dtk</td></tr>`).join('') || '<tr><td class="mut">Belum ada.</td></tr>'}</table></div></div>`
      : `<div class="card"><h3>Raid terkunci</h3><p class="mut">Taklukkan minimal Rank E dulu agar ada soal untuk raid.</p><button class="btn" data-go="#/map">Ke peta dungeon</button></div>`;
    if ($('#rgo')) $('#rgo').onclick = () => raidStart(pool);
    return;
  }
  if (RD.fin) {
    const f = RD.fin;
    z.innerHTML = `<div class="sys resh"><small class="tag">[ SYSTEM ] RAID SELESAI</small><h1 class="ttl">${RD.ok}/${RD.items.length} BENAR</h1><div class="grid3" style="max-width:560px;margin:14px auto"><div class="stat"><b>${RD.pts}</b><span>Poin</span></div><div class="stat"><b>${f.sec}s</b><span>Durasi</span></div><div class="stat"><b>+${f.bonus}</b><span>Bonus XP</span></div></div><p><button class="btn" id="rag">Ulangi raid</button> <button class="btn ghost" id="rdn">Selesai</button></p></div><div class="card"><h3>Rincian</h3><table><tr><th>SOAL</th><th>HASIL</th><th>POIN</th></tr>${RD.log.map((l) => `<tr><td>${l.tag}</td><td>${l.ok ? 'Benar' : 'Salah'}</td><td>${l.pts}</td></tr>`).join('')}</table></div>`;
    $('#rag').onclick = () => raidStart(pool);
    $('#rdn').onclick = () => {
      RD = null;
      raidPaint();
    };
    return;
  }
}
function raidStart(pool) {
  const c = cfg();
  Co.say('raid', true);
  window.Bat && Bat.raidStartReset();
  RD = {
    items: shuf(pool.length, String(Math.random()))
      .slice(0, Math.min(c.raidN, pool.length))
      .map((i) => pool[i]),
    i: 0,
    ok: 0,
    pts: 0,
    t0: Date.now(),
    log: [],
  };
  raidQ();
}
function raidQ() {
  const z = $('#rdz'),
    it = RD.items[RD.i].it,
    lim = (it.t === 'fill' ? 2 : 1) * cfg().raidSec + Skill.raidSec() + (window.Forge ? Forge.raidSec() : 0);
  RD.lock = false;
  RD.lim = lim;
  RD.t = Date.now();
  RD.tick = 0;
  const ord =
    it.t === 'mc' ? (it.noShuf ? [...it.o.keys()] : shuf(it.o.length, String(Math.random()))) : [];
  z.innerHTML = `${window.Bat ? Bat.raidHud(RD.items[RD.i].c) : ''}<div class="card"><div class="dgs"><span>Soal <b>${RD.i + 1}</b>/${RD.items.length}</span><span>Benar <b>${RD.ok}</b></span><span>Poin <b>${RD.pts}</b></span><b id="tt2" class="big" style="font-size:28px;margin-left:auto">${lim}</b></div><div class="tmr"><i id="tb2"></i></div><div class="item" id="rq"><h4>${it.tag}</h4><p>${it.q}</p>${it.html || ''}${it.t === 'mc' ? '<div class="opts">' + ord.map((j, x) => `<label><input type="${it.multi ? 'checkbox' : 'radio'}" name="rq" value="${j}"><span>${String.fromCharCode(65 + x)}. ${it.o[j]}</span></label>`).join('') + '</div>' : '<div class="fills">' + it.f.map((f, j) => `<label>${f.l}<input data-f="${j}"></label>`).join('') + '</div>'}<button class="btn" id="rk2">Kunci jawaban</button><p class="res"></p></div></div>`;
  it.draw && it.draw($('#rq'));
  $('#rk2').onclick = () => raidAnswer(false);
  Skill.raidButton();
  clearInterval(RDT);
  RDT = setInterval(() => {
    const left = Math.max(0, RD.lim - (Date.now() - RD.t) / 1000);
    $('#tb2').style.width = Math.min(100, (left / RD.lim) * 100) + '%';
    $('#tt2').textContent = Math.ceil(left);
    if (left <= 5 && Math.ceil(left) !== RD.tick && left > 0) {
      RD.tick = Math.ceil(left);
      AU.sfx('click');
    }
    if (left <= 0) raidAnswer(true);
  }, 100);
}
function raidAnswer(timeout) {
  if (RD.lock) return;
  RD.lock = true;
  clearInterval(RDT);
  const it = RD.items[RD.i].it,
    b = $('#rq'),
    left = Math.max(0, RD.lim - (Date.now() - RD.t) / 1000),
    ok = !timeout && evalBox(it, b),
    pts = ok ? Math.round((100 + Math.round((Math.min(left, RD.lim) / RD.lim) * 50)) * Skill.raidPtsMul()) : 0;
  if (!ok && !timeout && window.Mentor) Mentor.onWrong(RD.items[RD.i].c + RD.items[RD.i].j, it, Mentor.read(it, b), { ms: 7000 });
  RD.ok += ok ? 1 : 0;
  RD.pts += pts;
  RD.log.push({ tag: it.tag, ok, pts });
  $$('input', b).forEach((e) => (e.disabled = true));
  $('#rk2').hidden = true;
  $('.res', b).textContent = ok
    ? 'Benar! +' + pts + ' poin'
    : (timeout ? 'Waktu habis. ' : 'Salah. ') + 'Jawaban: ' + (it.show || '');
  AU.sfx(ok ? 'ok' : 'bad');
  if (window.Bat) ok ? Bat.onRight('RAID') : Bat.onWrong('RAID');
  setTimeout(() => {
    if (!$('#rdz') || !RD) return;
    if (window.Bat && Bat.blocked('RAID')) {
      RD.pend = 1;
      return;
    }
    raidAdvance();
  }, 1500);
}
function raidAdvance() {
  if (!RD) return;
  RD.i++;
  RD.i >= RD.items.length ? raidFinish() : raidQ();
}
function raidFinish() {
  const u = me(),
    sec = Math.round((Date.now() - RD.t0) / 1000),
    r = (u.raid = u.raid || { best: 0, runs: [] }),
    bonus = Math.max(0, RD.ok - r.best) * 10,
    before = titleOf(xpOf(u));
  r.best = Math.max(r.best, RD.ok);
  r.runs.unshift({ ts: Date.now(), ok: RD.ok, n: RD.items.length, pts: RD.pts, sec });
  r.runs = r.runs.slice(0, 10);
  u.bonus = (u.bonus || 0) + bonus;
  window.Forge && Forge.onRaid(RD.ok, RD.items.length);
  save();
  RD.fin = { bonus, sec };
  Co.say(RD.ok >= RD.items.length * 0.7 ? 'raidwin' : 'raidlose', true);
  dq('raid');
  if (RD.ok >= RD.items.length * 0.7) burst(null, 80);
  const t = titleOf(xpOf(u));
  if (t !== before)
    overlay(
      `<div><small class="tag">[ SYSTEM ]</small><h2>LEVEL UP</h2><p>${t}</p></div>${army()}`,
      2300,
      'levelup',
    );
  else AU.sfx('up');
  BADGES.forEach((b) => {
    if (b[0] === 'Raid Runner' && r.runs.length === 1) toast('Badge baru: Raid Runner');
  });
  raidPaint();
}

const rankOpts = (sel) =>
  RK.map(
    (r) =>
      `<option value="${r.c}" ${r.c === sel ? 'selected' : ''}>${esc(r.n)}: ${esc(r.t)}</option>`,
  ).join('');
const thrRow = (t) =>
  `<div class="card tilt thr rv" data-go="#/thread/${t.id}"><div><b>${t.pin ? '[PIN] ' : ''}${esc(t.title)}</b> ${t.replies.some((r) => r.best) ? '<span class="tagc" style="border-color:var(--gr);color:var(--gr)">Terjawab</span>' : ''}</div><div class="mut sm">${t.rank === 'all' ? 'Umum' : esc((RK.find((r) => r.c === t.rank) || {}).n || '')} | ${esc(t.by)}${roleOf(t.by) === 'teacher' ? ' (Guru)' : ''} | ${ago(t.ts)} | ${t.replies.length} balasan | ${t.likes.length} suka</div></div>`;
V.forum = (a) => {
  const f = a || 'all',
    list = FR()
      .filter((t) => DB.owner || !t.demo)
      .filter((t) => f === 'all' || t.rank === f || (t.rank === 'all' && f === 'all'))
      .sort((x, y) => (y.pin ? 1 : 0) - (x.pin ? 1 : 0) || y.ts - x.ts);
  return `<div class="sys rv"><small class="tag">[ SYSTEM ] FORUM DISKUSI</small><h2>Guild Hall</h2><p class="mut">Tanya, jawab, dan bagikan trik. Guru ikut menjawab dan bisa menyematkan topik penting. ${window.Sync && Sync.isOn() ? 'Forum tersinkron di cloud: semua hunter dan guru melihat isi yang sama.' : 'Forum akun demo hanya tersimpan di browser ini.'}</p><div class="ctl"><label>Dungeon<select id="ff"><option value="all">Semua</option>${rankOpts(f)}</select></label><label>Cari<input id="fq" placeholder="Kata kunci"></label></div></div>
<div class="card rv"><details ${a && a !== 'all' ? 'open' : ''}><summary>Buat topik baru</summary><label>Judul<input id="tt" maxlength="90"></label><label>Dungeon<select id="tr"><option value="all">Umum</option>${rankOpts(f)}</select></label><label>Isi pertanyaan<textarea id="tb" rows="3" maxlength="1000"></textarea></label><p style="margin-top:10px"><button class="btn" id="tp">Kirim topik</button></p></details></div><div id="fl">${list.map(thrRow).join('') || '<div class="card mut">Belum ada topik di dungeon ini.</div>'}</div>`;
};
V.forum.post = () => {
  $('#ff').onchange = (e) => (location.hash = '#/forum/' + e.target.value);
  $('#fq').oninput = (e) => {
    const q = e.target.value.toLowerCase();
    $$('.thr').forEach((x) => (x.hidden = !x.textContent.toLowerCase().includes(q)));
  };
  $('#tp').onclick = () => {
    const ti = $('#tt').value.trim(),
      bo = $('#tb').value.trim();
    if (ti.length < 3 || bo.length < 5) return toast('Judul minimal 3 dan isi minimal 5 karakter');
    if (window.Ui24 && !Ui24.forumGate()) return;
    const id = window.Sync && Sync.isOn() ? Sync.newThreadId() : Date.now().toString(36),
      rk = $('#tr').value,
      ts0 = Date.now();
    FR().unshift({
      id,
      rank: rk,
      title: ti,
      body: bo,
      by: DB.me,
      ts: ts0,
      likes: [],
      replies: [],
    });
    if (window.Sync && Sync.isOn()) Sync.threadAdd({ id, rank: rk, title: ti, body: bo, ts: ts0 });
    save();
    AU.sfx('ok');
    Co.say('forum', true);
    dq('forum');
    location.hash = '#/thread/' + id;
  };
};
V.thread = (id) => {
  const t = FR().find((x) => x.id === id);
  if (!t) {
    location.hash = '#/forum';
    return '';
  }
  const me0 = DB.me,
    can = t.by === me0 || isT();
  return `<p class="rv"><button class="btn ghost" data-go="#/forum/${t.rank}">Kembali ke forum</button></p><div class="sys rv"><small class="tag">[ SYSTEM ] ${t.rank === 'all' ? 'UMUM' : esc((RK.find((r) => r.c === t.rank) || {}).n || '').toUpperCase()}</small><h2>${t.pin ? '[PIN] ' : ''}${esc(t.title)}</h2><p class="mut sm">${chip(t.by)} ${ago(t.ts)}</p><p style="margin:12px 0;white-space:pre-wrap">${esc(t.body)}</p><p><button class="btn ghost" data-fa="like" data-id="${t.id}">${t.likes.includes(me0) ? 'Batal suka' : 'Suka'} (${t.likes.length})</button> ${isT() ? `<button class="btn ghost" data-fa="pin" data-id="${t.id}">${t.pin ? 'Lepas sematan' : 'Sematkan'}</button>` : ''} ${can ? `<button class="btn ghost" data-fa="del" data-id="${t.id}">Hapus topik</button>` : ''}</p></div>
<h3 class="rv">${t.replies.length} Balasan</h3>${t.replies.map((r, i) => `<div class="card rv" style="${r.best ? 'border-color:var(--gr)' : ''}"><p class="mut sm">${chip(r.by)} ${ago(r.ts)} ${r.best ? '<span class="tagc" style="border-color:var(--gr);color:var(--gr)">Jawaban terbaik</span>' : ''}</p><p style="margin:8px 0;white-space:pre-wrap">${esc(r.body)}</p><p><button class="btn ghost" data-fa="rlike" data-id="${t.id}" data-r="${i}">${r.likes.includes(me0) ? 'Batal suka' : 'Suka'} (${r.likes.length})</button> ${can ? `<button class="btn ghost" data-fa="best" data-id="${t.id}" data-r="${i}">${r.best ? 'Lepas tanda terbaik' : 'Jawaban terbaik'}</button>` : ''} ${isT() || r.by === me0 ? `<button class="btn ghost" data-fa="rdel" data-id="${t.id}" data-r="${i}">Hapus</button>` : ''}</p></div>`).join('')}
<div class="card rv"><h3>Tulis balasan</h3><textarea id="rb" rows="3" maxlength="1000" placeholder="Bantu temanmu dengan penjelasan yang jelas..."></textarea><p style="margin-top:10px"><button class="btn" data-fa="reply" data-id="${t.id}">Kirim balasan</button></p></div>`;
};
document.addEventListener('click', (e) => {
  const f = e.target.closest('[data-fa]');
  if (!f) return;
  const t = FR().find((x) => x.id === f.dataset.id),
    a = f.dataset.fa,
    i = +f.dataset.r,
    u = DB.me;
  if (!t) return;
  const tg = (arr) => {
    const x = arr.indexOf(u);
    x < 0 ? arr.push(u) : arr.splice(x, 1);
  };
  const CL = window.Sync && Sync.isOn();
  if (a === 'like') {
    tg(t.likes);
    CL && Sync.like(t.id, t.likes.includes(u));
  }
  if (a === 'rlike') {
    tg(t.replies[i].likes);
    CL && Sync.rlike(t.replies[i].id, t.replies[i].likes.includes(u));
  }
  if (a === 'pin' && isT()) {
    t.pin = !t.pin;
    CL && Sync.pin(t.id, t.pin);
  }
  if (a === 'best' && (t.by === u || isT())) {
    const w = !t.replies[i].best;
    t.replies.forEach((r) => (r.best = false));
    t.replies[i].best = w;
    CL && Sync.best(t.id, w ? t.replies[i].id : null);
  }
  if (a === 'rdel' && (isT() || t.replies[i].by === u)) {
    const rid0 = t.replies[i].id;
    t.replies.splice(i, 1);
    CL && Sync.rdel(rid0);
  }
  if (a === 'del' && (isT() || t.by === u)) {
    DB.forum = FR().filter((x) => x !== t);
    CL && Sync.tdel(t.id);
    save();
    return (location.hash = '#/forum');
  }
  if (a === 'reply') {
    const b = $('#rb').value.trim();
    if (b.length < 2) return toast('Balasan terlalu pendek');
    if (window.Ui24 && !Ui24.forumGate()) return;
    const rp0 = { id: CL ? Sync.newReplyId() : undefined, by: u, body: b, ts: Date.now(), likes: [] };
    t.replies.push(rp0);
    CL && Sync.replyAdd(t.id, rp0);
    AU.sfx('ok');
    Co.say('forum', true);
    dq('forum');
  }
  save();
  route();
});

const SITE_FULL =
  () => `<header class="snav"><b class="brand">${IC('logo')}${TXT.brand}<span>${TXT.brandSub}</span></b><button class="burger" id="bg" aria-label="Buka menu">&#9776;</button><nav id="snv">${TXT.menu.map((a) => `<a data-sc="${a[0]}">${a[1]}</a>`).join('')}</nav><div class="sauth"><button class="btn ghost" data-auth="login">Masuk</button> <button class="btn" data-auth="register">Daftar</button></div></header>
<section class="lhero"><div class="hero"><div class="portal"><i></i><i></i><i></i></div><small class="tag">${TXT.heroTag}</small><h1 class="glitch" data-t="${TXT.heroTitle}">${TXT.heroTitle}</h1><p class="sub">${TXT.heroSub}</p><p class="mut">${TXT.heroDesc}</p><p style="margin-top:18px"><button class="btn" data-auth="register">${TXT.ctaStart}</button> <button class="btn ghost" data-auth="login">${TXT.ctaLogin}</button></p></div>
<svg class="para" viewBox="0 0 520 300"><path class="draw" d="M20 260 Q260 -120 500 260"/>${[
    ['E', 44, 224],
    ['D', 87, 169],
    ['C', 130, 125],
    ['B', 174, 95],
    ['A', 217, 76],
    ['S', 260, 70],
  ]
    .map(
      (d, i) =>
        `<g class="dot r${d[0]}" style="--i:${i}" transform="translate(${d[1]} ${d[2]})"><circle r="15"/>${ICS(Ico.RICON[d[0]], 0, 0, 17)}</g>`,
    )
    .join('')}</svg></section>
<section class="sec" id="about"><h2 class="rv">${TXT.aboutTitle}</h2><div class="grid2"><div class="card rv"><h3>${TXT.backstoryTitle}</h3><p class="mut">${TXT.backstory}</p></div><div class="card rv"><h3>${TXT.objectivesTitle}</h3><ul class="l">${TXT.objectives.map((o) => `<li>${o}</li>`).join('')}</ul></div></div></section>
<section class="sec" id="flow"><h2 class="rv">${TXT.flowTitle}</h2><div class="grid4">${TXT.flow.map((s, i) => `<div class="card tilt rv"><span class="badge" style="background:#4d8bff">${IC(Ico.FLOWICON[i] || 'gate')}</span><h3>${s[1]}</h3><p class="mut">${s[2]}</p></div>`).join('')}</div></section>
<section class="sec" id="dg"><h2 class="rv">${TXT.dungeonTitle}</h2><div class="grid3">${AX.map((r) => `<div class="card tilt rv"><span class="badge" style="background:${r.col}">${RI(r.c)}</span><h3>${r.n}: ${r.t}</h3><p class="mut">${SUM[r.c] || ''}</p><p class="ttl">+${r.xp} XP</p></div>`).join('')}</div></section>
<section class="sec" id="fitur"><h2 class="rv">${TXT.fiturTitle}</h2><div class="grid3">${TXT.fitur.map((f) => `<div class="card tilt rv"><h3>${f[0]}</h3><p class="mut">${f[1]}</p></div>`).join('')}</div></section>
<section class="sec" id="chars"><h2 class="rv">${TXT.charsTitle}</h2><p class="mut rv" style="margin-bottom:16px">${TXT.charsDesc}</p><div class="grid3">${CHARS.slice(
    0,
    6,
  )
    .map(
      (c) =>
        `<div class="card tilt chcard rv" data-ch="${c.id}"><div class="chfig">${c.svg('happy')}</div><div class="cbub" hidden></div><h3>${c.name}</h3><p class="ttl sm">${c.role}</p><p class="mut">${c.bio}</p></div>`,
    )
    .join('')}</div></section>
${window.Team ? Team.section() : ''}
<section class="sec" id="faq"><h2 class="rv">${TXT.faqTitle}</h2>${FAQ.map((f) => `<details class="card rv"><summary>${f[0]}</summary><p class="mut">${f[1]}</p></details>`).join('')}</section>
<footer class="foot"><b class="brand">${IC('logo')}${TXT.brand}${TXT.brandSub}</b><p class="mut">${TXT.footer}</p><p class="mut sm"><button type="button" class="lnk" data-legal></button></p></footer>`;

const SITE = () => {
  let h = SITE_FULL();
  if (window.Sim) h = h.replace('<section class="sec" id="chars">', Sim.section() + '<section class="sec" id="chars">');
  if (window.Cine) h = h.replace('<section class="lhero">', Cine.section() + '<section class="lhero">');
  if (!SHOW_TEAM)
    h = h
      .replace(/<section class="sec" id="tim">[\s\S]*?<\/section>/, '')
      .replace(/<a data-sc="tim">[^<]*<\/a>/, '');
  return h;
};

const NAV = {
  student: [
    ['#/dash', 'Dashboard'],
    ['#/map', 'Peta'],
    ['#/board', 'Peringkat'],
    ['#/raid', 'Raid'],
    ['#/redgate', 'Endless Red Gate'],
    ['#/bonus', 'Misi Bonus'],
    ['#/worldboss', 'World Boss Raid'],
    ['#/forge', 'Shadow Forge'],
    ['#/lens', 'Quadratic Lens'],
    ['#/forum', 'Forum'],
    ['#/chars', 'Karakter'],
    ['#/archive', 'Arsip Bayangan'],
    ['#/weakness', 'Catatan Kesalahan'],
    ['#/team', 'Tim'],
    ['#/profile', 'Profil'],
    ['#/settings', 'Pengaturan'],
    ['#/help', 'Panduan'],
  ],
  teacher: [
    ['#/class', 'Kelas'],
    ['#/analysis', 'Analisis'],
    ['#/monitor', 'Monitor Live'],
    ['#/worldboss', 'World Boss Raid'],
    ['#/gatebuilder', 'Buat Red Gate Baru'],
    ['#/resp', 'Jawaban'],
    ['#/forum', 'Forum'],
    ['#/board', 'Peringkat'],
    ['#/settings', 'Pengaturan'],
    ['#/help', 'Panduan'],
  ],
};

function route() {
  if (!DB.me || !me()) return;
  const u = me(),
    h = location.hash || (u.role === 'teacher' ? '#/class' : '#/dash'),
    [, k, a] = h.split('/'),
    T = u.role === 'teacher',
    SO = ['dash', 'map', 'rank', 'result', 'profile', 'cert', 'raid', 'archive', 'redgate', 'bonus', 'forge', 'weakness'];
  if (!V[k] || (T && SO.includes(k)) || (!T && ['class', 'resp', 'analysis', 'monitor', 'gatebuilder'].includes(k))) {
    location.hash = T ? '#/class' : '#/dash';
    return;
  }
  clearInterval(RDT);
  if (k !== 'raid') RD = null;
  const grp = k === 'rank' || k === 'result' ? '#/map' : k === 'thread' ? '#/forum' : '#/' + k;
  $('#nav').dataset.role = u.role;
  $('#nav').innerHTML = NAV[u.role]
    .map(
      (n) =>
        `<a data-go="${n[0]}" class="${n[0] === grp || (k === 'rank' && n[0] === '#/dash') ? 'on' : ''}">${n[1]}${window.Gates && n[0] === '#/bonus' ? Gates.badge() : ''}${window.WBoss && n[0] === '#/worldboss' ? WBoss.badge() : ''}</a>`,
    )
    .join('');

  $('#who').innerHTML = `<a class="whoav" data-go="#/avatar" title="Ubah avatar">${window.Avatar ? Avatar.html(u.name, 30) : ''}</a>${esc(u.name)}${T ? ' (Guru)' : window.Cls ? Cls.chip(u) : ''}`;
  window.Gloss && Gloss.mountButton();
  vbarSync();

  if (window.Cloud && ['board', 'class', 'analysis', 'resp', 'dash', 'monitor', 'gatebuilder'].includes(k))
    Cloud.others().then((ch) => ch && (location.hash || '') === h && !typingNow() && route());
  const out = V[k](a);
  if (!out) return;
  $('#view').innerHTML = out;
  V[k].post && V[k].post(a);
  window.Gloss && Gloss.apply($('#view'));
  countUp();
  reveal();
  tilt();
  Co.render();
  Co.sync();
  Co.enterView(k);
  scrollTo(0, 0);
}
document.addEventListener('click', (e) => {
  const t = e.target;
  let g = t.closest('[data-go]');
  if (g && g.dataset.go) location.hash = g.dataset.go;
  if (t.closest('.chk')) check(t.closest('.item').dataset.k);
  const s = t.closest('[data-sc]');
  if (s) {
    document.getElementById(s.dataset.sc).scrollIntoView({ behavior: 'smooth' });
    const sn = $('#snv');
    sn && sn.classList.remove('open');
  }
  const au = t.closest('[data-auth]');
  if (au) openAuth(au.dataset.auth);
  const ac = t.closest('[data-act]');
  if (ac) {
    const a = ac.dataset.act,
      v = +ac.dataset.v;
    if (a === 'cls') window.Cls && Cls.ask(false);
    if (a === 'tab') {
      RS.step = v;
      paint();
      scrollTo(0, 0);
    }
    if (a === 'qgo') {
      RS.qi = v;
      paint();
    }
    if (a === 'finish') {
      me().done[RS.c] ? (location.hash = '#/result/' + RS.c) : finish(RS.c);
    }
    if (a === 'reset' && confirm('Hapus semua progresmu?')) {
      const u = me();
      u.done = {};
      u.st = {};
      u.pr = {};
      u.wl = {};
      u.streak = 1;
      u.resetAt = Date.now();
      save();
      RS = { c: null, step: 0, qi: 0 };
      route();
    }
  }
});
document.addEventListener('click', (e) => {
  const t = e.target,
    hb = t.closest('.hintb');
  if (hb) {
    const it0 = hb.closest('.item'),
      k = it0.dataset.k,
      it = Q[k[0]][+k.slice(1)],
      st = (me().st[k] = me().st[k] || { att: 0 });
    st.hint = 1;
    st.hp = Skill.hintCost(k[0], k);
    save();
    $('.hintp', it0).textContent = 'Petunjuk: ' + (it.hint || (EXP[k] || [])[0]);
    hb.hidden = true;
    Co.say('hint');
  }
});
addEventListener('hashchange', route);

let role = 'student',
  mode = 'login',
  inApp = false,
  authBusy = false;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  erm = (m) => ($('#er').textContent = m || ''),
  okm = (m) => ($('#okm').textContent = m || ''),

  typingNow = () => {
    const el = document.activeElement;
    return !!el && /INPUT|TEXTAREA|SELECT/.test(el.tagName) && el.offsetParent !== null;
  };
function syncAuth() {
  const reg = mode === 'register',
    rst = mode === 'reset';
  $$('#modes button').forEach((b) => b.classList.toggle('on', b.dataset.m === (rst ? 'login' : mode)));
  $$('#roles button').forEach((b) => b.classList.toggle('on', b.dataset.r === role));
  $('#rw').hidden = rst;
  $$('#roles button').forEach((b) => {
    const st = b.dataset.r === 'student';
    b.textContent = (reg ? 'Daftar sebagai ' : 'Masuk sebagai ') + (st ? 'Hunter (Siswa)' : 'God / Guild Master (Guru)');
  });
  $('#nmw').hidden = !reg;

  $('#nml').textContent = role === 'teacher' ? 'Nama guru' : 'Nama hunter';
  $('#nm').placeholder = role === 'teacher' ? 'Nama yang tampil di kelas dan forum' : 'Nama yang tampil di peringkat';
  $('#clw').hidden = !(reg && role === 'student');
  if (window.Cls && !$('#cllist').children.length) $('#cllist').innerHTML = Cls.known().map((c) => `<option value="${esc(c)}">`).join('');
  $('#pww').hidden = rst;
  $('#cdw').hidden = !(reg && role === 'teacher');
  $('#rsh').hidden = !rst;
  $('.forgot').hidden = mode !== 'login';
  $('#sb').textContent = rst ? 'Kirim link reset password' : reg ? 'Daftar dan mulai' : 'Masuk';
  $('#pw').autocomplete = reg ? 'new-password' : 'current-password';
  $('#pw').placeholder = reg ? 'Minimal 6 karakter' : 'Password';
  erm('');
  okm('');
}
function openAuth(m) {
  mode = m;
  $('#authm').hidden = false;
  syncAuth();
  (m === 'register' ? $('#nm') : $('#em')).focus();
}
$$('#modes button').forEach(
  (b) =>
    (b.onclick = () => {
      mode = b.dataset.m;
      syncAuth();
    }),
);
$$('#roles button').forEach(
  (b) =>
    (b.onclick = () => {
      role = b.dataset.r;
      syncAuth();
    }),
);
$('#ax').onclick = () => ($('#authm').hidden = true);
$('#fgt').onclick = () => {
  mode = 'reset';
  syncAuth();
  $('#em').focus();
};
$('#fgt').onkeydown = (e) => (e.key === 'Enter' || e.key === ' ') && $('#fgt').click();

function enter(n) {
  DB.me = n;
  save();
  inApp = true;
  $('#site').hidden = true;
  $('#authm').hidden = true;
  $('#vgate').hidden = true;
  $('#app').hidden = false;
  RS = { c: null, step: 0, qi: 0 };
  location.hash = me().role === 'teacher' ? '#/class' : '#/dash';
  AU.sfx('gate');
  route();
  window.Ui24 && Ui24.awaken();
  Co.mount();
  Co.say('welcome', true);
  window.Cls && Cls.check();

  if (window.__loginRole && window.__loginRole !== me().role)
    toast(me().role === 'teacher' ? 'Akun ini terdaftar sebagai God / Guild Master (Guru), jadi kamu diarahkan ke dashboard Guru.' : 'Akun ini terdaftar sebagai Hunter (Siswa), jadi kamu diarahkan ke dashboard Hunter.');
  window.__loginRole = null;
}
$('#login').onsubmit = async (e) => {
  e.preventDefault();
  if (authBusy) return;
  erm('');
  okm('');
  const n = $('#nm').value.trim(),
    em = $('#em').value.trim(),
    p = $('#pw').value;
  if (!window.Cloud || !window.FB)
    return erm(
      window.Cloud && Cloud.failed
        ? 'Tidak bisa terhubung ke server (offline atau diblokir). Coba lagi saat online.'
        : 'Layanan akun masih dimuat. Coba lagi sebentar.',
    );
  if (!EMAIL_RE.test(em)) return erm('Isi alamat email yang valid.');
  if (mode === 'register') {
    if (!NAME_RE.test(n))
      return erm(
        'Nama hanya boleh huruf, angka, spasi, titik, strip, dan garis bawah (2 sampai 24 karakter).',
      );
    if (p.length < 6) return erm('Password minimal 6 karakter.');
    if (role === 'teacher' && $('#cd').value !== TEACHER_CODE) return erm('Kode guru salah.');
    if (role === 'student' && !Cls.norm($('#cl').value)) return erm(T2('cl_err'));
  } else if (mode === 'login' && !p) return erm('Isi password.');
  authBusy = true;
  const btn = $('#sb');
  btn.disabled = true;
  btn.textContent = 'Memproses...';
  try {
    if (mode === 'reset') {
      await FB.resetPassword(em);
      okm('Jika email itu terdaftar, link reset password sudah dikirim. Cek inbox dan folder Spam.');
    } else if (mode === 'login') {
      window.__loginRole = role;
      await FB.login(em, p);
      await Cloud.onUser(FB.current());
    } else {
      await Cloud.register({ name: n, email: em, pw: p, role, code: $('#cd').value, cls: role === 'student' ? Cls.norm($('#cl').value) : '' });
    }
  } catch (err) {
    erm(err && err.code === 'nama-dipakai' ? 'Nama hunter itu sudah dipakai. Pilih nama lain.' : Cloud.msg(err));
  } finally {
    authBusy = false;
    btn.disabled = false;
    syncAuth_keep();
  }
};

function syncAuth_keep() {
  const er = $('#er').textContent,
    ok = $('#okm').textContent;
  syncAuth();
  erm(er);
  okm(ok);
}
$$('.demo button').forEach(
  (b) =>
    (b.onclick = () => {
      const n = b.dataset.d === 's' ? 'Misel' : 'Guru Demo';
      if (!DB.users[n] || DB.users[n].cloud) return toast('Akun demo belum tersedia di perangkat ini.');
      enter(n);
    }),
);
$('#out').onclick = async () => {
  Co.unmount();
  if (me() && me().cloud && window.Cloud) {
    await Cloud.logout();
    window.Sync && Sync.stop();
  }
  DB.me = null;
  save();
  inApp = false;
  $('#app').hidden = true;
  $('#site').hidden = false;
  location.hash = '';
  showSite();
};

function vbarSync() {
  const u = DB.me && me(),
    show = !!(u && u.cloud && window.Cloud && Cloud.uid && !Cloud.verified);
  $('#vbar').hidden = !show;
  if (show) $('#vbe').textContent = u.email || '';
}
const verifyMsg = (err) =>
  err && err.code === 'auth/too-many-requests'
    ? 'Terlalu sering meminta. Tunggu beberapa menit lalu coba lagi.'
    : Cloud.msg(err);
async function sendVerify(onOk, onErr) {
  try {
    await FB.sendVerification();
    onOk('Link verifikasi dikirim ke ' + (me() ? me().email : 'emailmu') + '. Cek inbox dan folder Spam.');
  } catch (err) {
    onErr(verifyMsg(err));
  }
}
async function checkVerify(onDone, onNo, onErr) {
  try {
    const u = await FB.refreshUser();
    if (u && u.emailVerified) {
      Cloud.verified = true;
      onDone();
    } else onNo('Belum terverifikasi. Klik link di email, lalu tekan tombol ini lagi.');
  } catch (err) {
    onErr(Cloud.msg(err));
  }
}
$('#vbs').onclick = () => sendVerify(toast, toast);
$('#vbc').onclick = () =>
  checkVerify(
    () => {
      vbarSync();
      toast('Email terverifikasi. Terima kasih!');
    },
    toast,
    toast,
  );
$('#vgs').onclick = () =>
  sendVerify(
    (m) => {
      $('#vger').textContent = '';
      $('#vgok').textContent = m;
    },
    (m) => {
      $('#vgok').textContent = '';
      $('#vger').textContent = m;
    },
  );
$('#vgc').onclick = () =>
  checkVerify(
    () => cloudAfterLogin(me()),
    (m) => {
      $('#vgok').textContent = '';
      $('#vger').textContent = m;
    },
    (m) => {
      $('#vger').textContent = m;
    },
  );
$('#vgo').onclick = () => $('#out').click();

function cloudAfterLogin(u, offline, mailed) {
  vbarSync();
  if (REQUIRE_VERIFIED && !Cloud.verified && !offline) {

    $('#site').hidden = true;
    $('#authm').hidden = true;
    $('#app').hidden = true;
    $('#vge').textContent = u.email || '';
    $('#vgate').hidden = false;
    inApp = false;
    return;
  }
  if (inApp && !$('#app').hidden) {
    applyPrefs();
    if (!typingNow()) route();
  } else enter(u.name);
  Cloud.watch();
  window.Sync && Sync.start();
  Cloud.others(true).then((ch) => ch && !typingNow() && route());
  if (mailed === true) toast('Link verifikasi dikirim ke ' + u.email + '. Cek inbox dan folder Spam.');
  if (mailed === false)
    toast('Akun dibuat, tetapi email verifikasi gagal terkirim. Tekan "Kirim link verifikasi" di atas.');
}

function cloudSignedOut() {
  window.Sync && Sync.stop();
  Co.unmount();
  Cloud.purge();
  inApp = false;
  $('#app').hidden = true;
  $('#vgate').hidden = true;
  $('#site').hidden = false;
  location.hash = '';
  showSite();
}
function showSite() {
  $('#site').innerHTML = SITE();
  window.Gloss && Gloss.apply($('#site'));
  $('#bg').onclick = () => $('#snv').classList.toggle('open');
  window.I18N && I18N.mount();
  window.Sim && Sim.init();
  window.Cine && Cine.init();
  reveal();
  tilt();
  scrollTo(0, 0);
}
applyPrefs();
splashInit();
if (DB.me && me()) {
  inApp = true;
  $('#site').hidden = true;
  $('#app').hidden = false;
  route();
  Co.mount();
} else showSite();

(function () {
  const c = $('#fx'),
    x = c.getContext('2d');
  let W, H;
  const rs = () => {
    W = c.width = innerWidth;
    H = c.height = innerHeight;
  };
  rs();
  addEventListener('resize', rs);
  const P = Array.from({ length: 70 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 2 + 0.4,
    v: Math.random() * 0.5 + 0.15,
    h: Math.random() > 0.5 ? '#4d8bff' : '#9a5aff',
  }));
  (function f() {
    x.clearRect(0, 0, W, H);
    P.forEach((p) => {
      p.y -= p.v;
      if (p.y < -5) {
        p.y = H + 5;
        p.x = Math.random() * W;
      }
      x.beginPath();
      x.arc(p.x, p.y, p.r, 0, 7);
      x.fillStyle = p.h;
      x.shadowBlur = 8;
      x.shadowColor = p.h;
      x.fill();
    });
    requestAnimationFrame(f);
  })();
})();
sync();
