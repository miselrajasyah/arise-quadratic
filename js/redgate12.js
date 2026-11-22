'use strict';

window.RedGate = (() => {
  const HP0 = 100,
    DMG = 20,
    DMG_BOSS = 30,
    XP_PER_FLOOR = 5,
    XP_CAP = 150;

  const rnd = (n) => {
    try {
      const a = new Uint32Array(1);
      crypto.getRandomValues(a);
      return a[0] % n;
    } catch (e) {
      return Math.floor(Math.random() * n);
    }
  };
  const ri = (lo, hi) => lo + rnd(hi - lo + 1);
  const pick = (a) => a[rnd(a.length)];
  const nz = (lo, hi) => {
    let v = 0;
    while (!v) v = ri(lo, hi);
    return v;
  };
  const shuffle = (a) => {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = rnd(i + 1);
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  };

  const coef = (a) => (a === 1 ? '' : a === -1 ? '-' : String(a));
  const inner = (h) => (h === 0 ? 'x' : h > 0 ? 'x - ' + h : 'x + ' + -h);
  const vf = (a, h, k) => `y = ${coef(a)}(${inner(h)})^2${k > 0 ? ' + ' + k : k < 0 ? ' - ' + -k : ''}`;
  const std = (a, b, c) => {
    let s = coef(a) + 'x^2';
    if (b) s += (b < 0 ? ' - ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x';
    if (c) s += (c < 0 ? ' - ' : ' + ') + Math.abs(c);
    return 'y = ' + s;
  };
  const fac = (a, r1, r2) => `y = ${coef(a)}(${inner(r1)})(${inner(r2)})`;
  const P = (x, y) => `$(${x}, ${y})$`;
  const par = (n) => (n < 0 ? `(${n})` : String(n));
  const dirOf = (a) => (a > 0 ? 'up' : 'down');

  function build(cor, ds) {
    const seen = new Set([cor.key]),
      pool = [];
    shuffle(ds).forEach((d) => {
      if (!seen.has(d.key)) {
        seen.add(d.key);
        pool.push(d);
      }
    });
    if (pool.length < 3) return null;
    const all = shuffle([Object.assign({ ok: true }, cor)].concat(pool.slice(0, 3)));
    return { opts: all, key: all.findIndex((o) => o.ok) };
  }
  const L = (s) => () => s;

  const rng = (t) => (t === 1 ? 5 : t === 2 ? 7 : 9);
  const G = {
    vertex(t) {
      const R = rng(t),
        a = pick([1, 2, 3, -1, -2, -3]),
        h = nz(-R, R),
        k = nz(-R, R);
      const o = build(
        { key: h + ',' + k, label: L(P(h, k)) },
        [
          { key: -h + ',' + k, label: L(P(-h, k)), mis: 'signH', mv: { h, wh: -h } },
          { key: h + ',' + -k, label: L(P(h, -k)), mis: 'signK', mv: { k, wk: -k } },
          { key: k + ',' + h, label: L(P(k, h)), mis: 'swapHK', mv: { h, k } },
          { key: -h + ',' + -k, label: L(P(-h, -k)), mis: 'signHK', mv: { h, k } },
        ],
      );
      return o && { q: 'q_vertex', f: vf(a, h, k), exp: () => T2('rg_exp_vertex', { h, k }), ...o };
    },
    dir(t) {
      const R = rng(t),
        a = nz(-R + 3, R - 2),
        b = ri(-9, 9),
        c = ri(-9, 9),
        right = dirOf(a),
        wrong = right === 'up' ? 'down' : 'up',
        byC = c !== 0 && (c > 0 ? 'up' : 'down') === wrong;
      const o = build(
        { key: right, label: () => T2('o_' + right) },
        [
          { key: wrong, label: () => T2('o_' + wrong), mis: byC ? 'openDirK' : 'openDir', mv: { a, dir: right } },
          { key: 'left', label: () => T2('o_left'), mis: 'parabolaHoriz', mv: {} },
          { key: 'right', label: () => T2('o_right'), mis: 'parabolaHoriz', mv: {} },
        ],
      );
      return o && { q: 'q_dir', f: std(a, b, c), exp: () => T2('rg_exp_dir', { a, dir: T2('dir_' + right) }), ...o };
    },
    axisVF(t) {
      const R = rng(t),
        a = pick([1, 2, 3, -1, -2, -3]),
        h = nz(-R, R),
        k = nz(-R, R);
      const o = build(
        { key: 'x' + h, label: L(`$x = ${h}$`) },
        [
          { key: 'x' + -h, label: L(`$x = ${-h}$`), mis: 'signH', mv: { h, wh: -h } },
          { key: 'y' + k, label: L(`$y = ${k}$`), mis: 'axisHoriz', mv: {} },
          { key: 'x' + k, label: L(`$x = ${k}$`), mis: 'useHnotK', mv: { h } },
          { key: 'y' + h, label: L(`$y = ${h}$`), mis: 'axisHoriz', mv: {} },
        ],
      );
      return o && { q: 'q_axis', f: vf(a, h, k), exp: () => T2('rg_exp_axis', { x: h }), ...o };
    },
    axisStd(t) {
      const a = pick([1, 2, -1, -2, 3, -3]),
        h = nz(-6, 6),
        b = -2 * a * h,
        c = ri(-9, 9);
      const o = build(
        { key: 'x' + h, label: L(`$x = ${h}$`) },
        [
          { key: 'x' + -h, label: L(`$x = ${-h}$`), mis: 'axisSign', mv: { x: h, wx: -h } },
          { key: 'x' + 2 * h, label: L(`$x = ${2 * h}$`), mis: 'axisNoHalf', mv: { x: h } },
          { key: 'x' + b, label: L(`$x = ${b}$`), mis: 'axisIsB', mv: { a, b, x: h } },
          { key: 'x' + -2 * h, label: L(`$x = ${-2 * h}$`), mis: 'axisNoHalf', mv: { x: h } },
        ],
      );
      return o && { q: 'q_axis', f: std(a, b, c), exp: () => T2('rg_exp_axisstd', { a: par(a), b: par(b), x: h }), ...o };
    },
    yint(t) {
      const a = nz(-3, 3),
        h = nz(-5, 5),
        k = nz(-8, 8),
        y0 = a * h * h + k,
        e = `${a}(0 - ${par(h)})^2 ${k < 0 ? '-' : '+'} ${Math.abs(k)}`;
      const o = build(
        { key: '' + y0, label: L(P(0, y0)) },
        [
          { key: '' + k, label: L(P(0, k)), mis: 'yIntSubst', mv: { e, y: y0 } },
          { key: '' + (h * h + k), label: L(P(0, h * h + k)), mis: 'forgotA', mv: { e, y: y0 } },
          { key: '' + (-a * h + k), label: L(P(0, -a * h + k)), mis: 'noSquare', mv: { e, y: y0 } },
          { key: '' + -y0, label: L(P(0, -y0)), mis: 'yIntSubst', mv: { e, y: y0 } },
        ],
      );
      return o && { q: 'q_yint', f: vf(a, h, k), exp: () => T2('rg_exp_yint', { e, y: y0 }), ...o };
    },
    roots(t) {
      const a = pick([1, 2, -1, -2, 3]);
      let r1, r2;
      do {
        r1 = nz(-6, 6);
        r2 = nz(-6, 6);
      } while (r1 === r2 || r1 + r2 === 0);
      const lab = (x, y) => L(`$x_1 = ${x},\\ x_2 = ${y}$`),
        key = (x, y) => [x, y].sort((m, n) => m - n).join(',');
      const f1 = inner(r1),
        f2 = inner(r2);
      const o = build(
        { key: key(r1, r2), label: lab(r1, r2) },
        [
          { key: key(-r1, -r2), label: lab(-r1, -r2), mis: 'rootSign', mv: { f1, r1 } },
          { key: key(r1, -r2), label: lab(r1, -r2), mis: 'rootSign', mv: { f1: f2, r1: r2 } },
          { key: key(-r1, r2), label: lab(-r1, r2), mis: 'rootSign', mv: { f1, r1 } },
          { key: key(a, r2), label: lab(a, r2), mis: 'rootIsCoef', mv: {} },
        ],
      );
      return o && { q: 'q_roots', f: fac(a, r1, r2), exp: () => T2('rg_exp_roots', { r1: r1, r2: r2 }), ...o };
    },
    disc(t) {
      const a = nz(-4, 4),
        b = ri(-8, 8),
        c = nz(-6, 6),
        D = b * b - 4 * a * c;
      const o = build(
        { key: '' + D, label: L(`$D = ${D}$`) },
        [
          { key: '' + (b * b + 4 * a * c), label: L(`$D = ${b * b + 4 * a * c}$`), mis: 'discPlus', mv: { D } },
          { key: '' + (b * b - 2 * a * c), label: L(`$D = ${b * b - 2 * a * c}$`), mis: 'discHalf', mv: { D } },
          { key: '' + (2 * b - 4 * a * c), label: L(`$D = ${2 * b - 4 * a * c}$`), mis: 'discNoSq', mv: { D } },
          { key: '' + (b - 4 * a * c), label: L(`$D = ${b - 4 * a * c}$`), mis: 'discNoSq', mv: { D } },
        ],
      );
      return o && { q: 'q_disc', f: std(a, b, c), exp: () => T2('rg_exp_disc', { a, b, c, D }), ...o };
    },
    nroots(t) {
      const s = rnd(3);
      let a, b, c, D;
      if (s === 1) {
        a = pick([1, 2, -1, -2, 3]);
        const r = nz(-5, 5);
        b = -2 * a * r;
        c = a * r * r;
        D = 0;
      } else {
        let n = 0;
        do {
          a = nz(-3, 3);
          b = ri(-6, 6);
          c = nz(-6, 6);
          D = b * b - 4 * a * c;
        } while ((s === 2 ? D <= 0 : D >= 0) && ++n < 200);
      }
      const right = 'n' + (D > 0 ? 2 : D === 0 ? 1 : 0),
        ds = ['n0', 'n1', 'n2', 'n3'].filter((x) => x !== right).map((x) => ({ key: x, label: () => T2(x), mis: 'discNature', mv: { D } }));
      const o = build({ key: right, label: () => T2(right) }, ds);
      return o && { q: 'q_nroots', f: std(a, b, c).slice(4), exp: () => T2('rg_exp_nroots', { D }), ...o };
    },
    vertexStd(t) {
      const a = pick([1, 2, -1, -2]),
        h = nz(-5, 5),
        k = nz(-9, 9),
        b = -2 * a * h,
        c = a * h * h + k;
      const o = build(
        { key: h + ',' + k, label: L(P(h, k)) },
        [
          { key: -h + ',' + k, label: L(P(-h, k)), mis: 'axisSign', mv: { x: h, wx: -h } },
          { key: h + ',' + c, label: L(P(h, c)), mis: 'vertexSubst', mv: { x: h, y: k } },
          { key: -b + ',' + c, label: L(P(-b, c)), mis: 'vertexRecipe', mv: {} },
          { key: h + ',' + -k, label: L(P(h, -k)), mis: 'vertexSubst', mv: { x: h, y: k } },
        ],
      );
      return o && { q: 'q_vertex', f: std(a, b, c), exp: () => T2('rg_exp_vertexstd', { h, k }), ...o };
    },
    ext(t) {
      const a = pick([1, 2, 3, -1, -2, -3]);
      let h, k;
      do {
        h = nz(-7, 7);
        k = nz(-9, 9);
      } while (h === k);
      const mm = a > 0 ? 'min' : 'max',
        om = a > 0 ? 'max' : 'min',
        lab = (m, v) => () => `${T2('w_' + m)}: $y = ${v}$`;
      const o = build(
        { key: mm + k, label: lab(mm, k) },
        [
          { key: om + k, label: lab(om, k), mis: 'openDir', mv: { a, dir: dirOf(a) } },
          { key: mm + h, label: lab(mm, h), mis: 'useHnotK', mv: { h } },
          { key: om + h, label: lab(om, h), mis: 'useHnotK', mv: { h } },
        ],
      );
      return o && { q: 'q_ext', f: vf(a, h, k), exp: () => T2('rg_exp_ext', { a, dir: T2('dir_' + dirOf(a)), mm: T2('mm_' + mm), k }), ...o };
    },
  };
  const POOL = { 1: ['vertex', 'dir', 'axisVF'], 2: ['axisStd', 'yint', 'roots'], 3: ['disc', 'nroots', 'vertexStd', 'ext'] };
  const tierOf = (floor) => (floor < 4 ? 1 : floor < 8 ? 2 : 3);
  const isBoss = (floor) => floor % 5 === 0;

  function gen(floor, lastType) {
    const tier = tierOf(floor),
      boss = isBoss(floor);
    let names = [];
    for (let t = boss ? Math.max(2, tier) : 1; t <= tier; t++) names = names.concat(POOL[t]);

    if (tier === 3 && !boss) names = names.concat(POOL[3]);
    for (let i = 0; i < 60; i++) {
      const n = pick(names);
      if (n === lastType && names.length > 1 && i < 30) continue;
      const g = G[n](boss ? Math.max(tier, 2) : tier);
      if (g) return Object.assign(g, { type: n, tier, boss });
    }
    return G.vertex(1);
  }

  let RG = null;
  let FIN = null;
  let SKIP = false;
  const gid = () => Array.from({ length: 4 }, () => '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'[rnd(34)]).join('');
  const rgOf = (u) => (u.rg = u.rg || { best: 0, xp: 0, runs: [] });
  function start() {
    FIN = null;
    RG = { id: gid(), floor: 1, hp: HP0, score: 0, streak: 0, cleared: 0, n: 0, ok: 0, mis: {}, p: null, ans: null, last: null };
    RG.p = gen(1);
    window.AU && AU.sfx('arise');
    paint();
  }
  function submit(sel) {
    if (!RG || !RG.p || RG.ans) return;
    const p = RG.p,
      o = p.opts[sel],
      ok = sel === p.key;
    RG.n++;
    if (ok) {
      const pts = (100 + Math.min(RG.streak, 5) * 10) * (p.boss ? 2 : 1);
      RG.ok++;
      RG.streak++;
      RG.cleared++;
      RG.score += pts;
      RG.ans = { sel, ok, pts };
      window.AU && AU.sfx('ok');
      window.Sys && Sys.pop(T2('rg_ok', { n: pts }), 'good');
    } else {
      const d = p.boss ? DMG_BOSS : DMG;
      RG.hp = Math.max(0, RG.hp - d);
      RG.streak = 0;
      RG.ans = { sel, ok, d };
      if (o.mis) {
        RG.mis[o.mis] = (RG.mis[o.mis] || 0) + 1;
        window.Mentor && Mentor.record(o.mis);
        window.Mentor && Mentor.show(o.mis, o.mv);
      } else window.AU && AU.sfx('bad');
      window.Sys && Sys.shake(0.8);
      window.Sys && Sys.pop(T2('rg_bad', { n: d }), 'dmg');
    }
    try {
      save();
    } catch (e) {

    }
    paint();
  }
  function next() {
    if (!RG || !RG.ans) return;
    if (RG.hp <= 0) return finish();
    if (RG.ans.ok) RG.floor++;
    RG.p = gen(RG.floor, RG.p.type);
    RG.ans = null;
    paint();
    scrollTo(0, 0);
  }
  function finish() {
    if (!RG) return;
    const u = me(),
      r = rgOf(u),
      prev = r.best,
      got = Math.max(0, Math.min((RG.cleared - prev) * XP_PER_FLOOR, XP_CAP - r.xp));
    if (RG.cleared > prev) {
      r.best = RG.cleared;
      r.xp += got;
      u.bonus = (u.bonus || 0) + got;
    }
    if (RG.n) r.runs.unshift({ ts: Date.now(), floor: RG.cleared, score: RG.score, acc: Math.round((RG.ok / RG.n) * 100) });
    r.runs = r.runs.slice(0, 10);
    FIN = { cleared: RG.cleared, floor: RG.floor, score: RG.score, n: RG.n, ok: RG.ok, mis: RG.mis, got, prev, best: r.best };
    RG = null;
    save();
    window.AU && AU.sfx(got ? 'up' : 'down');
    paint();
  }

  const hpCls = (p) => (p > 60 ? 'hi' : p > 30 ? 'mid' : 'lo');
  const misList = (m, n) =>
    Object.entries(m || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .filter(([id]) => window.V2MIS && V2MIS[id])
      .map(([id, c]) => `<li><b>${T2mis(id, 'n')}</b> <span class="mut">x${c}</span></li>`)
      .join('');
  function lobby(u) {
    const r = rgOf(u),
      top = misList(u.mis, 3);
    return `<div class="sys rv rgh"><small class="tag">${T2('rg_tag')}</small><h2>${T2('rg_title')}</h2><p class="mut">${T2('rg_intro')}</p></div>
<div class="grid2"><div class="card rv"><h3>${T2('rg_title')}</h3><ul class="l">${T2('rg_rules').map((x) => `<li>${x}</li>`).join('')}</ul><p class="ttl">${T2('rg_best')}: ${r.best}</p><p><button class="btn" id="rgs">${T2('rg_start')}</button></p></div>
<div class="card rv"><h3>${T2('rg_topmis')}</h3>${top ? `<ul class="l">${top}</ul>` : `<p class="mut">${T2('mis_none')}</p>`}<h3 style="margin-top:14px">${T2('rg_history')}</h3><table><tr><th>${T2('rg_h_when')}</th><th>${T2('rg_h_floor')}</th><th>${T2('rg_h_score')}</th><th>${T2('rg_h_acc')}</th></tr>${r.runs.map((x) => `<tr><td>${typeof ago === 'function' ? ago(x.ts) : ''}</td><td>${x.floor}</td><td>${x.score}</td><td>${x.acc}%</td></tr>`).join('') || `<tr><td class="mut" colspan="4">${T2('rg_none')}</td></tr>`}</table></div></div>`;
  }
  function over() {
    const f = FIN,
      acc = f.n ? Math.round((f.ok / f.n) * 100) : 0,
      ms = misList(f.mis, 5);
    return `<div class="sys resh rv"><small class="tag">${T2('rg_over_tag')}</small><h1 class="ttl">${T2('rg_over_h', { n: f.floor })}</h1><div class="grid3" style="max-width:600px;margin:14px auto"><div class="stat"><b>${f.cleared}</b><span>${T2('rg_cleared')}</span></div><div class="stat"><b>${f.score}</b><span>${T2('rg_score')}</span></div><div class="stat"><b>${acc}%</b><span>${T2('rg_acc')}</span></div></div><p class="${f.got ? 'ttl' : 'mut'}">${f.got ? T2('rg_newrec', { n: f.got }) : T2('rg_norec', { n: f.best })}</p><p style="margin-top:12px"><button class="btn" id="rgs">${T2('rg_again')}</button></p></div>${ms ? `<div class="card rv"><h3>${T2('rg_runmis')}</h3><ul class="l">${ms}</ul></div>` : ''}`;
  }
  function run() {
    const p = RG.p,
      a = RG.ans,
      hp = Math.round((RG.hp / HP0) * 100),
      opts = p.opts
        .map((o, x) => {
          const cls = a ? (x === p.key ? 'rgok' : x === a.sel ? 'rgbad' : '') : '';
          return `<label class="${cls}"><input type="radio" name="rgq" value="${x}" ${a ? 'disabled' : ''} ${a && x === a.sel ? 'checked' : ''}><span>${String.fromCharCode(65 + x)}. ${o.label()}</span></label>`;
        })
        .join('');
    let res = '';
    if (a) {
      res = a.ok
        ? `<p class="res rgres ok">${T2('rg_ok', { n: a.pts })}</p>`
        : `<p class="res rgres bad">${T2('rg_bad', { n: a.d })} | ${T2('rg_reveal')}: ${p.opts[p.key].label()}</p>`;
      res += `<p class="exp">${p.exp()}</p><p><button class="btn" id="rgn">${RG.hp <= 0 ? T2('rg_over_tag').replace('[ SYSTEM ] ', '') : a.ok ? T2('rg_next') : T2('rg_retry_floor')}</button></p>`;
    }
    return `<div class="sys rgh rv"><small class="tag">${T2('rg_tag')}</small><div class="dgs"><span>${T2('rg_floor')} <b>${RG.floor}</b>${p.boss ? ` <em class="rgboss">${T2('rg_boss')}</em>` : ''}</span><span>${T2('rg_score')} <b>${RG.score}</b></span><span>${T2('rg_streak')} <b>${RG.streak}</b></span><span class="mut no-i18n">${T2('rg_gateid')} #${RG.id}</span></div><div class="phpw"><div class="php ${hpCls(hp)}"><i style="width:${hp}%"></i></div><small class="phpt">${T2('rg_hp')} ${RG.hp}/${HP0}</small></div><small class="mut">${T2('rg_unique')}</small></div>
<div class="card rv"><div class="item ${a ? (a.ok ? 'ok' : 'bad') : ''}"><h4>${T2('rg_floor')} ${RG.floor}${p.boss ? ' - ' + T2('rg_boss') : ''}</h4><p>${T2(p.q, { f: p.f })}</p><div class="opts">${opts}</div>${a ? '' : `<p class="mut sm" id="rgpk">${T2('rg_pick')}</p><button class="btn" id="rgl">${T2('rg_lock')}</button>`}${res}</div><p style="margin-top:10px"><button class="btn ghost" id="rgq">${T2('rg_quit')}</button></p></div>`;
  }
  function paint() {
    const z = document.getElementById('rgz');
    if (!z) return;
    z.innerHTML = RG ? run() : FIN ? over() : lobby(me());

    z.querySelectorAll('.rv').forEach((e) => e.classList.add('in'));
    typeof reveal === 'function' && reveal();
    window.renderMath && renderMath(z);
    const q = (s) => z.querySelector(s);
    q('#rgs') && (q('#rgs').onclick = start);
    q('#rgl') &&
      (q('#rgl').onclick = () => {
        const c = z.querySelector('input[name=rgq]:checked');
        c ? submit(+c.value) : window.toast && toast(T2('rg_pick'));
      });
    q('#rgn') && (q('#rgn').onclick = next);
    q('#rgq') && (q('#rgq').onclick = () => (RG.cleared || RG.n ? finish() : ((RG = null), (SKIP = true), paint())));
    z.querySelectorAll('.opts label').forEach((l) => l.addEventListener('click', () => !RG.ans && (q('#rgpk') ? (q('#rgpk').hidden = true) : 0)));
  }

  function enter() {
    const u = me();
    if (!RG && !FIN && !SKIP && u && u.role === 'student') return start();
    paint();
  }
  addEventListener('hashchange', () => {
    if (!/^#\/redgate/.test(location.hash)) SKIP = false;
  });
  return { gen, G, POOL, start, enter, paint, tierOf, isBoss, build, XP_PER_FLOOR, XP_CAP, state: () => RG, hasRun: () => !!RG };
})();

V.redgate = () => `<div id="rgz"></div>`;
V.redgate.post = () => RedGate.enter();
