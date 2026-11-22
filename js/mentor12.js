'use strict';

window.Mentor = (() => {
  const norm = (s) =>
    (window.Mp ? Mp.std(s) : String(s == null ? '' : s))
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[−–—]/g, '-')
      .replace(/²/g, '^2');
  const N = '-?\\d+(?:\\.\\d+)?';

  const pt = (s) => {
    const m = norm(s).match(new RegExp('^\\(?(' + N + '),(' + N + ')\\)?$'));
    return m ? [+m[1], +m[2]] : null;
  };
  const num = (s) => {
    const n = norm(s).replace(',', '.'),
      p = pt(s);
    if (p) return p[1];
    return new RegExp('^' + N + '$').test(n) ? +n : null;
  };
  const eqx = (s, v = 'x') => {
    const m = norm(s).replace(',', '.').match(new RegExp('^' + v + '=(' + N + ')$'));
    return m ? +m[1] : null;
  };

  const mc = (map) => (sel) => (sel && sel.length ? map[sel[0]] || null : null);
  const first = (...r) => r.find((x) => x) || null;
  const A = {};

  A.E0 = mc({ 1: ['signHK', { h: 3, k: -2 }], 2: ['signK', { k: -2, wk: 2 }], 3: ['swapHK', { h: 3, k: -2 }] });
  A.E2 = mc({ 1: ['widthA'], 2: ['aVsK'], 3: ['openDir', { a: 2, dir: 'up' }] });
  A.E3 = mc({ 1: ['signH', { h: -4, wh: 4 }], 2: ['signK', { k: -3, wk: 3 }], 3: ['signHK', { h: -4, k: -3 }] });

  A.D0 = mc({ 1: ['openDir', { a: -1, dir: 'down' }], 2: ['useHnotK', { h: 6 }], 3: ['signH', { h: 6, wh: -6 }] });
  A.D1 = (v) => {
    const n = (v || []).map(norm),
      p = pt(n[1] || ''),
      ax = eqx(n[2] || ''),
      yi = num(n[3] || '');
    return first(
      /atas|up|上|위/.test(n[0] || '') ? ['openDir', { a: -2, dir: 'down' }] : null,
      p && p[0] === 1 && p[1] === 5 ? ['signH', { h: -1, wh: 1 }] : null,
      p && p[0] === -1 && p[1] === -5 ? ['signK', { k: 5, wk: -5 }] : null,
      p && p[0] === 1 && p[1] === -5 ? ['signHK', { h: -1, k: 5 }] : null,
      p && p[0] === 5 && p[1] === -1 ? ['swapHK', { h: -1, k: 5 }] : null,
      ax === 1 ? ['signH', { h: -1, wh: 1 }] : null,
      /^y=/.test(n[2] || '') ? ['axisHoriz'] : null,
      ax === 5 ? ['useHnotK', { h: -1 }] : null,
      yi === 5 ? ['yIntSubst', { e: '-2(0 + 1)^2 + 5', y: 3 }] : null,
      yi === 6 ? ['forgotA', { e: '-2(0 + 1)^2 + 5', y: 3 }] : null,
    );
  };
  A.D2 = mc({ 1: ['domainRange'], 2: ['openDir', { a: -1, dir: 'down' }], 3: ['domainRange'] });
  const yi3 = ['yIntSubst', { e: '(0 - 2)^2 - 3', y: 1 }];
  A.D3 = mc({ 1: yi3, 2: yi3, 3: yi3 });

  A.C0 = mc({ 1: ['openDir', { a: 1, dir: 'up' }], 2: ['signH', { h: 2, wh: -2 }] });
  A.C1 = (v) => {
    const d = norm((v || [])[0]),
      r = norm((v || [])[1]);
    return first(
      d && !/semua|all|real|-∞.*∞|r$|すべて|全|実数|전체|모든|실수/.test(d) ? ['domainRange'] : null,
      /(≤|<=|<).*-1|y(≤|<=|<)-?1/.test(r) && /-1/.test(r) ? ['openDir', { a: 1, dir: 'up' }] : null,
      /(≥|>=|>)1$/.test(r) ? ['signK', { k: -1, wk: 1 }] : null,
    );
  };
  A.C2 = mc({ 1: ['openDir', { a: -1, dir: 'down' }], 2: ['axisSign', { x: 3, wx: -3 }], 3: ['openDir', { a: -1, dir: 'down' }] });
  A.C3 = mc({ 1: ['axisSign', { x: 2, wx: -2 }], 2: ['vertexSubst', { x: 2, y: -1 }], 3: ['vertexRecipe'] });

  const rb = ['rootSign', { f1: 'x - 1200', r1: 1200 }];
  A.B0 = mc({ 1: ['openDir', { a: '-0{,}001', dir: 'down' }], 2: rb, 3: rb });
  A.B1 = mc({ 1: ['cIsY0'], 2: ['cIsY0'] });
  const yb = ['yIntSubst', { e: '-0{,}001 \\cdot 0 \\cdot (0 - 1200)', y: 0 }];
  A.B3 = mc({ 1: yb, 2: yb, 3: yb });
  A.B5 = mc({ 1: ['rootSign', { f1: 'x + 3', r1: -3 }], 2: ['rootIsCoef'], 3: ['rootIsCoef'] });
  const am = ['axisMid', { r1: 1, r2: -3, x: -1 }];
  A.B6 = mc({ 1: am, 2: am, 3: am });

  A.A0 = mc({ 0: ['widthA'], 1: ['widthA'] });
  A.A1 = mc({ 1: ['widthA'], 2: ['openDir', { a: '0{,}5', dir: 'up' }], 3: ['openDir', { a: 3, dir: 'up' }] });
  A.A2 = (v) => {
    const n = norm((v || [])[0]);
    return first(
      /\(x\+2\)/.test(n) && /-1$/.test(n) ? ['signHK', { h: 2, k: 1 }] : null,
      /\(x\+2\)/.test(n) ? ['signH', { h: 2, wh: -2 }] : null,
      /\(x-2\)\^2-1$/.test(n) ? ['signK', { k: 1, wk: -1 }] : null,
    );
  };

  A.S0 = (sel) =>
    !sel || !sel.length
      ? null
      : first(
          sel.includes(2) ? ['rootSign', { f1: 'x + 2', r1: -2 }] : null,
          sel.includes(3) ? ['rootSign', { f1: 'x - 4', r1: 4 }] : null,
          sel.includes(4) ? ['rootFromConst', { c: -8 }] : null,
        );
  A.S1 = (v) => {
    const n = (v || []).map(norm),
      yi = pt(n[0] || '') || [null, null],
      vt = pt(n[1] || ''),
      ax = eqx(n[2] || '');
    return first(
      (yi[1] === 8 || num(n[0] || '') === 8) && yi[1] !== -8 ? ['yIntC', { c: -8 }] : null,
      vt && vt[0] === -1 && vt[1] === -9 ? ['axisSign', { x: 1, wx: -1 }] : null,
      vt && vt[0] === 1 && vt[1] !== -9 ? ['vertexSubst', { x: 1, y: -9 }] : null,
      ax === -1 ? ['axisSign', { x: 1, wx: -1 }] : null,
    );
  };
  A.S2 = (sel) => (sel && sel.length ? ['discNature', { D: -16 }] : null);
  A.S3 = (v) => {
    const a = num((v || [])[0]),
      b = num((v || [])[1]);
    return first(
      a !== null && a !== -5 ? ['substSign', { e: '3^2 - 2(3) - 8', y: -5 }] : null,
      b === -8 || b === -12 ? ['squareNeg'] : null,
      b !== null && b !== 0 ? ['substSign', { e: '(-2)^2 - 2(-2) - 8', y: 0 }] : null,
    );
  };

  A.R0 = mc({ 1: ['signH', { h: 1, wh: -1 }], 2: ['openDir', { a: 1, dir: 'up' }], 3: ['signK', { k: -4, wk: 4 }] });
  A.R2 = mc({ 1: ['axisHoriz'], 2: ['useHnotK', { h: 'x_{\\text{v}}' }], 3: ['axisHoriz'] });

  A.P1 = mc({ 1: ['signH', { h: 4, wh: -4 }], 2: ['signK', { k: 1, wk: -1 }], 3: ['swapHK', { h: 4, k: 1 }] });
  A.P2 = mc({ 1: ['openDir', { a: -3, dir: 'down' }], 2: ['parabolaHoriz'], 3: ['parabolaHoriz'] });
  A.P3 = mc({ 1: ['axisNoHalf', { x: 3 }], 2: ['axisSign', { x: 3, wx: -3 }] });
  A.P4 = mc({ 1: ['yIntC', { c: -7 }], 2: ['yIntB', { c: -7 }], 3: ['yIntSubst', { e: '2(0)^2 + 3(0) - 7', y: -7 }] });
  A.T1 = mc({ 1: ['signH', { h: -2, wh: 2 }], 2: ['signK', { k: -5, wk: 5 }], 3: ['swapHK', { h: -2, k: -5 }] });
  A.T2 = mc({ 1: ['openDirK', { a: '0{,}5', dir: 'up' }], 2: ['parabolaHoriz'], 3: ['parabolaHoriz'] });
  A.T3 = mc({ 1: ['axisSign', { x: -4, wx: 4 }], 2: ['axisIsB', { a: 1, b: 8, x: -4 }], 3: ['axisNoHalf', { x: -4 }] });
  A.T4 = mc({ 1: ['yIntC', { c: 9 }], 2: ['yIntB', { c: 9 }], 3: ['yIntSubst', { e: '-(0)^2 + 5(0) + 9', y: 9 }] });

  const hide = () => {
    const p = document.getElementById('mw12');
    if (p) p.remove();
  };
  let tmr = 0;

  function show(id, vars, opts = {}) {
    if (!window.V2MIS || !V2MIS[id]) return;
    const v = Object.assign({}, vars || {});
    if (v.dir === 'up' || v.dir === 'down') v.dir = T2('dir_' + v.dir);
    hide();
    clearTimeout(tmr);
    const p = document.createElement('div');
    p.id = 'mw12';
    p.className = 'mw12';
    p.setAttribute('role', 'alertdialog');
    p.setAttribute('aria-live', 'assertive');
    p.innerHTML =
      `<div class="mw12h"><b class="no-i18n">${T2('warn_tag')}</b><button type="button" class="mw12x" aria-label="X">×</button></div>` +
      `<small class="mw12s">${T2('warn_sub')}</small>` +
      `<h4 class="mw12n">${T2mis(id, 'n')}</h4>` +
      `<p class="mw12m">${T2mis(id, 'm', v)}</p>` +
      `<button type="button" class="btn mw12ok">${T2('warn_ok')}</button>`;
    document.body.appendChild(p);

    try {
      if (window.renderMathInElement) {
        window.renderMathInElement(p, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
          strict: 'ignore',
          trust: false,
          ignoredClasses: ['no-math', 'katex'],
        });
      } else if (window.renderMath) window.renderMath(p);
    } catch (e) {
      console.warn('KaTeX mentor:', e);
    }
    p.querySelector('.mw12x').onclick = p.querySelector('.mw12ok').onclick = hide;
    try {
      window.AU && AU.sfx('bad');
      window.Sys && Sys.flash('#ff2a4a');
    } catch (e) {

    }
    if (opts.ms) tmr = setTimeout(hide, opts.ms);
  }
  function record(id) {
    try {
      const u = me();
      if (!u) return;
      u.mis = u.mis || {};
      u.mis[id] = (u.mis[id] || 0) + 1;
    } catch (e) {

    }
  }

  function analyze(k, ans, it) {
    const f = A[k];

    if (!f) {
      if (it && it.mis && it.t === 'mc' && Array.isArray(ans)) {
        const j = ans.find((x) => it.mis[x]);
        return j === undefined ? null : it.mis[j];
      }
      return null;
    }
    try {
      return f(ans) || null;
    } catch (e) {
      console.warn('Mentor ' + k, e);
      return null;
    }
  }

  function onWrong(k, it, ans, opts = {}) {
    if (!it || it.t === 'open') return null;
    const r = analyze(k, ans, it);
    if (!r) return null;
    record(r[0]);
    if (k[0] !== 'P' && k[0] !== 'T') show(r[0], r[1], opts);
    return r;
  }

  function read(it, box) {
    if (it.t === 'mc') return [...box.querySelectorAll('input:checked')].map((e) => +e.value).sort();
    return [...box.querySelectorAll('[data-f]')].map((e) => e.value);
  }
  document.addEventListener('keydown', (e) => e.key === 'Escape' && hide());
  addEventListener('hashchange', hide);
  return { A, analyze, onWrong, show, hide, record, read, norm, pt, num, eqx };
})();
