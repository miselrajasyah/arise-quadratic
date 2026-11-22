'use strict';

window.Ice = (() => {
  const T = (k, v) => window.IT(k, v);
  const K = () => window.Materi.kit;
  const $ = (id) => document.getElementById(id);
  const PRE = { 0: 'g', E: 'e', D: 'd', C: 'c', B: 'b', A: 'a', S: 's' };
  const ls = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {

      }
    },
  };
  const mem = {};
  const uid = () => {
    try {
      const u = typeof me === 'function' ? me() : null;
      return (u && (u.id || u.uid || u.email || u.name)) || 'g';
    } catch (e) {
      return 'g';
    }
  };
  const key = (c) => 'ad_ice21_' + uid() + '_' + c;
  const load = (c) => {
    const base = { u: 1, ck: 0, a: {}, r: '' };
    try {
      const raw = ls.get(key(c));
      return Object.assign(base, raw ? JSON.parse(raw) : mem[c] || {});
    } catch (e) {
      return base;
    }
  };
  const save = (c, s) => {
    mem[c] = s;
    ls.set(key(c), JSON.stringify(s));
  };
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]);
  const parse = (v) => parseFloat(String(v).replace(',', '.').replace('−', '-'));

  const R = {};

  R['0'] = {
    ids: ['ic0R', 'ic0H'],
    html1: () => {
      const k = K();
      return `<p class="mut">${T('g_sim')}</p><div class="mw"><div class="ctl">${k.slider('ic0R', T('g_R'), 4, 16, 1, 8)}${k.slider('ic0H', T('g_H'), 1, 8, 1, 3)}</div><div id="ic0svg"></div><p><button class="btn" id="ic0go" type="button">${T('g_throw')}</button> <span class="ice-msg" id="ic0msg"></span></p></div>`;
    },
    html2: () => `<p class="mut">${T('g_tab')}</p><div class="scrl"><table class="mtab" id="ic0tab"></table></div><p class="mut sm">${T('g_note')}</p>`,
    draw: (ctx, tx) => {
      const k = K(), C = k.C, Rr = k.$v('ic0R'), H = k.$v('ic0H'), f = (t) => -((4 * H) / (Rr * Rr)) * t * (t - Rr);
      const g = k.Gx(420, 280, [-1, 17], [-1, 9], 28);
      let s = k.frame(g, 2, 2) + k.vline(g, Rr / 2, C.vi, '') + k.curve(g, f, C.cy, 3.5);
      s += k.dot(g, 0, 0, C.gr, T('g_hunter'), 8, 18) + k.dot(g, 10, 0, C.pk, T('g_goblin'), 0, -12, 'middle') + k.dot(g, Rr / 2, H, C.gold, '(' + k.f2(Rr / 2) + ', ' + H + ')', 0, -10, 'middle');
      if (tx != null) s += k.dot(g, tx, f(tx), '#fff', '', 0, 0);
      else if ($('ic0msg')) $('ic0msg').textContent = '';
      k.put('ic0svg', k.svg(g, s, T('g_alt')));
      let x = `<tr><th>${T('ice_xrow')}</th>`, y = `<tr><th>${T('ice_yrow')}</th>`;
      for (let i = 0; i <= Rr; i++) {
        const hi = Math.abs(i - Rr / 2) < 0.51 ? ' class="hi"' : '';
        x += `<td${hi}>${i}</td>`;
        y += `<td${hi}>${k.f2(f(i))}</td>`;
      }
      k.put('ic0tab', x + '</tr>' + y + '</tr>');
    },
    goal: () => ({ ok: K().$v('ic0R') === 10 && K().$v('ic0H') >= 5 }),
    init: (ctx, refresh) => {
      $('ic0go').onclick = () => {
        const Rr = K().$v('ic0R'), id = (ctx.run = (ctx.run || 0) + 1);
        let t0 = null;
        const step = (ts) => {
          if (ctx.run !== id || !$('ic0go')) return;
          if (t0 == null) t0 = ts;
          const p = Math.min(1, (ts - t0) / 1100);
          refresh(p * Rr);
          if (p < 1) return requestAnimationFrame(step);
          ctx.moves++;
          refresh(Rr);
          $('ic0msg').textContent = Rr === 10 ? T('g_hit') : T('g_miss', { x: Rr });
        };
        requestAnimationFrame(step);
      };
    },
    items: [
      { t: 'num', q: 'g_q1', e: 'g_e1', ans: [6] },
      { t: 'num', q: 'g_q2', e: 'g_e2', ans: [7] },
      { t: 'mc', q: 'g_q3', o: 'g_o3', e: 'g_e3', ans: 1 },
    ],
    formal: ['g_f_def', ['g_f_1', 'g_f_2', 'g_f_3'], 'g_f_ex'],
  };

  R.E = {
    ids: ['icEh', 'icEk', 'icEa'],
    zero: ['icEa'],
    html1: () => {
      const k = K();
      return `<p class="mut">${T('e_sim')}</p><div class="mw"><div class="ctl">${k.slider('icEh', T('e_h'), -5, 5, 1, 2)}${k.slider('icEk', T('e_k'), -5, 5, 1, -3)}${k.slider('icEa', T('e_a'), -3, 3, 0.5, 1)}</div><div id="icEsvg"></div><p class="eq" id="icEq"></p></div>`;
    },
    html2: () => `<p class="mut">${T('e_tab')}</p><div class="scrl"><table class="mtab" id="icEtab"></table></div><p class="mut sm">${T('e_note')}</p>`,
    draw: () => {
      const k = K(), C = k.C, h = k.$v('icEh'), kk = k.$v('icEk'), a = k.$v('icEa');
      const g = k.Gx(420, 300, [-8, 8], [-7, 12], 28);
      let s = `<defs>${k.arrowDef('icEmk', C.gold)}</defs>` + k.frame(g, 2, 2) + k.vline(g, h, C.vi, T('e_aura', { h: k.f2(h) }));
      s += k.curve(g, (x) => x * x, '#6f7fd0', 2.5, '6 5') + k.curve(g, (x) => a * (x - h) ** 2 + kk, C.cy, 3.5);
      if (h || kk) s += `<line x1="${g.X(0)}" y1="${g.Y(0)}" x2="${g.X(h)}" y2="${g.Y(kk)}" stroke="${C.gold}" stroke-width="2.5" marker-end="url(#icEmk)"/>`;
      s += `<circle cx="${g.X(-3)}" cy="${g.Y(4)}" r="11" fill="none" stroke="${C.pk}" stroke-width="2.5" stroke-dasharray="4 3"/><text x="${g.X(-3) + 14}" y="${g.Y(4) - 8}" fill="${C.pk}" font-size="12" font-weight="700">${T('e_target')} (-3, 4)</text>`;
      s += k.dot(g, 0, 0, '#9aa6e8', '', 0, 0) + k.dot(g, h, kk, C.gold, '(' + k.f2(h) + ', ' + k.f2(kk) + ')', 10, kk > 8 ? 20 : -10);
      k.put('icEsvg', k.svg(g, s, T('e_alt')));
      k.put('icEq', `$${k.vertexTeX(a, h, kk)}$`);
      let r = `<tr><th>$x$</th><th>$x^2$</th><th>${T('e_col2')}</th><th>${T('e_col3')}</th></tr>`;
      for (let x = -3; x <= 3; x++) r += `<tr class="${x === 0 ? 'hi' : ''}"><td>${k.f2(x)}</td><td>${x * x}</td><td>(${k.f2(x)}, ${x * x})</td><td>(${k.f2(x + h)}, ${k.f2(a * x * x + kk)})</td></tr>`;
      k.put('icEtab', r);
    },
    goal: () => ({ ok: K().$v('icEh') === -3 && K().$v('icEk') === 4 }),
    items: [
      { t: 'num', q: 'e_q1', e: 'e_e1', ans: [4, -2], lab: ['$h =$', '$k =$'] },
      { t: 'num', q: 'e_q2', e: 'e_e2', ans: [-3] },
      { t: 'mc', q: 'e_q3', o: 'e_o3', e: 'e_e3', ans: 1 },
    ],
    formal: ['e_f_def', ['e_f_1', 'e_f_2', 'e_f_3', 'e_f_4'], 'e_f_ex'],
  };

  R.D = {
    ids: ['icDh', 'icDk', 'icDa'],
    zero: ['icDa'],
    html1: () => {
      const k = K();
      return `<p class="mut">${T('d_sim')}</p><div class="mw"><div class="ctl">${k.slider('icDh', T('d_h'), -2, 8, 1, 3)}${k.slider('icDk', T('d_k'), -4, 9, 1, 5)}${k.slider('icDa', T('d_a'), -2, 2, 0.25, -0.5)}</div><div id="icDsvg"></div></div>`;
    },
    html2: () => `<p class="mut">${T('d_tab1')}</p><div class="scrl"><table class="mtab" id="icDtab1"></table></div><p class="mut" style="margin-top:14px">${T('d_tab2')}</p><div id="icDtab2"></div>`,
    draw: () => {
      const k = K(), C = k.C, n2 = k.n2, h = k.$v('icDh'), kk = k.$v('icDk'), a = k.$v('icDa'), f = (x) => a * (x - h) ** 2 + kk, up = a > 0;
      const g = k.Gx(420, 300, [-3, 12], [-6, 10], 28);
      let s = k.frame(g, 2, 2) + k.vline(g, h, C.vi, 'x = ' + k.f2(h)) + k.curve(g, f, C.cy, 3.5);
      s += k.dot(g, h, kk, C.gold, T('d_vtx') + ' (' + k.f2(h) + ', ' + k.f2(kk) + ')', 0, kk > 8 ? 20 : -10, 'middle');
      s += k.dot(g, 8, 0, C.pk, T('d_plat') + ' (8, 0)', 0, 18, 'middle');
      const yi = f(0);
      if (yi >= -6 && yi <= 10) s += k.dot(g, 0, yi, C.gr, T('d_yint') + ' ' + k.f2(yi), 8, -8);
      k.put('icDsvg', k.svg(g, s, T('d_alt')));
      let r1 = '<tr><th>$x$</th>', r2 = '<tr><th>$y$</th>';
      for (let x = h - 3; x <= h + 3; x++) {
        const c = x === h ? ' class="hi"' : '';
        r1 += `<td${c}>${k.f2(x)}</td>`;
        r2 += `<td${c}>${k.f2(f(x))}</td>`;
      }
      k.put('icDtab1', r1 + '</tr>' + r2 + '</tr>');
      const H = T('d_th').split('||'), iv = (d1, d2) => `${T(d1)} $(-\\infty, ${n2(h)})$; ${T(d2)} $(${n2(h)}, \\infty)$`;
      const rows = [
        [T('d_s1'), `${up ? T('d_up') : T('d_down')} ($a = ${n2(a)}$)`],
        [T('d_s2'), `$(${n2(h)}, ${n2(kk)})$`],
        [T('d_s3'), `$x = ${n2(h)}$`],
        [T('d_s4'), up ? iv('d_dec', 'd_inc') : iv('d_inc', 'd_dec')],
        [T('d_s5'), `$(0, ${n2(a * h * h + kk)})$`],
        [T('d_s6'), `${T('d_dom')}: $\\mathbb{R}$; ${T('d_rng')}: $y ${up ? '\\ge' : '\\le'} ${n2(kk)}$`],
      ];
      k.put('icDtab2', `<p class="eq">$${k.vertexTeX(a, h, kk)}$</p><div class="scrl"><table class="mtab left"><tr><th>${H[0]}</th><th>${H[1]}</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table></div>`);
    },
    goal: () => {
      const k = K(), h = k.$v('icDh'), kk = k.$v('icDk'), a = k.$v('icDa');
      return { ok: a < 0 && kk >= 4 && Math.abs(a * (8 - h) ** 2 + kk) < 0.01 };
    },
    items: [
      { t: 'num', q: 'd_q1', e: 'd_e1', ans: [6] },
      { t: 'mc', q: 'd_q2', o: 'd_o2', e: 'd_e2', ans: 0 },
      { t: 'mc', q: 'd_q3', o: 'd_o3', e: 'd_e3', ans: 0 },
    ],
    formal: ['d_f_def', ['d_f_1', 'd_f_2', 'd_f_3', 'd_f_4', 'd_f_5'], 'd_f_ex'],
  };

  R.C = {
    ids: ['icCa', 'icCb', 'icCc', 'icCx'],
    zero: ['icCa'],
    html1: () => {
      const k = K();
      return `<p class="mut">${T('c_sim')}</p><div class="mw"><div class="ctl">${k.slider('icCa', T('c_a'), -3, 3, 0.5, -1)}${k.slider('icCb', T('c_b'), -6, 12, 1, 6)}${k.slider('icCc', T('c_c'), 0, 10, 1, 5)}${k.slider('icCx', T('c_x'), 0, 10, 0.5, 2)}</div><div id="icCsvg"></div><p class="eq" id="icCq"></p></div>`;
    },
    html2: () => `<p class="mut">${T('c_tab')}</p><div class="scrl"><table class="mtab" id="icCtab"></table></div><p class="eq" id="icCnote"></p>`,
    draw: () => {
      const k = K(), C = k.C, a = k.$v('icCa'), b = k.$v('icCb'), c = k.$v('icCc'), x = k.$v('icCx'), P = (t) => a * t * t + b * t + c;
      const g = k.Gx(420, 300, [-1, 11], [-12, 26], 28);
      let s = k.frame(g, 2, 4) + k.curve(g, P, C.cy, 3.5) + k.dot(g, 0, c, C.pk, T('c_cap') + ' ' + c, 8, -8);
      s += `<line x1="${g.X(x)}" y1="${g.Y(0)}" x2="${g.X(x)}" y2="${g.Y(P(x))}" stroke="${C.gold}" stroke-width="2" stroke-dasharray="5 4"/>` + k.dot(g, x, P(x), C.gold, '', 0, 0);
      s += `<text x="${g.pad + 6}" y="${g.pad + 4}" fill="${C.gold}" font-size="13" font-weight="700">${T('c_prof', { p: k.f2(P(x)) })}</text>`;
      k.put('icCsvg', k.svg(g, s, T('c_alt')));
      k.put('icCq', `$P(x) = ${k.stdTeX(a, b, c).slice(4)}$`);
      const v = [...Array(9)].map((_, i) => P(i)), d1 = v.slice(1).map((q, i) => q - v[i]), d2 = d1.slice(1).map((q, i) => q - d1[i]);
      let r = '<tr><th>$x$</th>' + v.map((_, i) => `<td>${i}</td>`).join('') + '</tr>';
      r += '<tr><th>$P(x)$</th>' + v.map((q) => `<td>${k.f2(q)}</td>`).join('') + '</tr>';
      r += '<tr><th>$\\Delta$</th>' + d1.map((q) => `<td>${k.f2(q)}</td>`).join('') + '<td>-</td></tr>';
      r += '<tr class="hi"><th>$\\Delta^2$</th>' + d2.map((q) => `<td>${k.f2(q)}</td>`).join('') + '<td>-</td><td>-</td></tr>';
      k.put('icCtab', r);
      k.put('icCnote', T('c_note', { v: k.n2(2 * a) }));
    },
    goal: () => {
      const k = K(), a = k.$v('icCa'), P = a * k.$v('icCx') ** 2 + k.$v('icCb') * k.$v('icCx') + k.$v('icCc');
      return { ok: a < 0 && P >= 14 };
    },
    items: [
      { t: 'num', q: 'c_q1', e: 'c_e1', ans: [-2] },
      { t: 'num', q: 'c_q2', e: 'c_e2', ans: [3] },
      { t: 'num', q: 'c_q3', e: 'c_e3', ans: [14] },
    ],
    formal: ['c_f_def', ['c_f_1', 'c_f_2', 'c_f_3', 'c_f_4', 'c_f_5'], 'c_f_ex'],
  };

  R.B = {
    ids: ['icBr1', 'icBr2', 'icBa'],
    zero: ['icBa'],
    html1: () => {
      const k = K();
      return `<p class="mut">${T('b_sim')}</p><div class="mw"><div class="ctl">${k.slider('icBr1', T('b_r1'), -8, 10, 1, 2)}${k.slider('icBr2', T('b_r2'), -8, 10, 1, 8)}${k.slider('icBa', T('b_a'), -2, 2, 0.25, -0.5)}</div><div id="icBsvg"></div></div>`;
    },
    html2: () => `<p class="mut">${T('b_tab')}</p><div id="icBarea"></div><p class="mut sm">${T('b_area_note')}</p>`,
    draw: () => {
      const k = K(), C = k.C, n2 = k.n2, r1 = k.$v('icBr1'), r2 = k.$v('icBr2'), a = k.$v('icBa'), f = (x) => a * (x - r1) * (x - r2), m = (r1 + r2) / 2;
      const g = k.Gx(420, 300, [-10, 12], [-6, 14], 28), lo = Math.min(r1, r2), hi = Math.max(r1, r2);
      let s = k.frame(g, 2, 2) + `<rect x="${g.X(lo)}" y="${g.Y(0)}" width="${g.X(hi) - g.X(lo)}" height="${g.Y(-6) - g.Y(0)}" fill="rgba(255,90,122,.18)"/>`;
      s += k.vline(g, m, C.vi, '') + k.curve(g, f, C.cy, 3.5) + k.dot(g, r1, 0, C.gold, T('b_gate') + ' 1', 0, 20, 'middle') + k.dot(g, r2, 0, C.gold, T('b_gate') + ' 2', 0, 20, 'middle');
      s += `<text x="${g.pad + 6}" y="${g.pad + 4}" fill="${C.gold}" font-size="13" font-weight="700">${T('b_span', { s: k.f2(hi - lo) })} | ${T('b_peak', { p: k.f2(f(m)) })}</text>`;
      k.put('icBsvg', k.svg(g, s, T('b_alt')));
      const strip = (t) => t.replace(/^y = /, '');
      const area = `<div class="ice-area"><i></i><b>$x$</b><b>$${n2(-r1)}$</b><b>$x$</b><span class="a-x2">$x^2$</span><span class="a-x">$${n2(-r1)}x$</span><b>$${n2(-r2)}$</b><span class="a-x">$${n2(-r2)}x$</span><span class="a-k">$${n2(r1 * r2)}$</span></div>`;
      k.put('icBarea', `${area}<p class="eq">${T('b_expand')} $${strip(k.facTeX(1, r1, r2))} = ${strip(k.stdTeX(1, -(r1 + r2), r1 * r2))}$</p><p class="eq">${T('b_axis', { v: n2(m) })}</p>`);
    },
    goal: () => {
      const k = K(), r1 = k.$v('icBr1'), r2 = k.$v('icBr2'), a = k.$v('icBa');
      return { ok: Math.abs(r2 - r1) === 8 && a < 0 && Math.abs(-a * (r2 - r1) ** 2 / 4 - 8) < 0.01 };
    },
    items: [
      { t: 'num', q: 'b_q1', e: 'b_e1', ans: [5] },
      { t: 'num', q: 'b_q2', e: 'b_e2', ans: [16] },
      { t: 'mc', q: 'b_q3', o: 'b_o3', e: 'b_e3', ans: 0 },
    ],
    formal: ['b_f_def', ['b_f_1', 'b_f_2', 'b_f_3', 'b_f_4', 'b_f_5'], 'b_f_ex'],
  };

  R.A = {
    ids: ['icAr1', 'icAr2', 'icAa'],
    zero: ['icAa'],
    html1: () => {
      const k = K();
      return `<p class="mut">${T('a_sim')}</p><div class="mw"><div class="ctl">${k.slider('icAr1', T('a_r1'), -2, 8, 1, 1)}${k.slider('icAr2', T('a_r2'), -2, 8, 1, 5)}${k.slider('icAa', T('a_a'), -2, 2, 0.25, -1)}</div><div id="icAsvg"></div></div>`;
    },
    html2: () => `<p class="mut">${T('a_tab')}</p><div class="ice-cards" id="icAcards"></div><p class="mut sm">${T('a_wide')}</p>`,
    draw: () => {
      const k = K(), C = k.C, n2 = k.n2, r1 = k.$v('icAr1'), r2 = k.$v('icAr2'), a = k.$v('icAa'), f = (x) => a * (x - r1) * (x - r2);
      const b = -a * (r1 + r2), c = a * r1 * r2, h = (r1 + r2) / 2, kv = f(h);
      const g = k.Gx(420, 300, [-4, 12], [-6, 22], 28);
      let s = k.frame(g, 2, 4) + k.vline(g, h, C.vi, '') + k.curve(g, f, C.cy, 3.5) + k.dot(g, r1, 0, C.gr, '', 0, 0) + k.dot(g, r2, 0, C.gr, '', 0, 0);
      s += k.dot(g, 0, c, C.pk, '', 0, 0) + k.dot(g, h, kv, C.gold, '(' + k.f2(h) + ', ' + k.f2(kv) + ')', 0, kv > 18 ? 20 : -10, 'middle');
      s += `<text x="${g.pad + 6}" y="${g.pad + 4}" fill="${C.gold}" font-size="13" font-weight="700">${T('a_peak')}: ${k.f2(kv)}</text>`;
      k.put('icAsvg', k.svg(g, s, T('a_alt')));
      const card = (hk, tk, eq, info) => `<div class="ice-card"><b>${T(hk)}</b><p class="eq">$${eq}$</p><small>${T(tk)}</small><p>$${info}$</p></div>`;
      k.put('icAcards', card('a_c1_h', 'a_c1_t', k.vertexTeX(a, h, kv), `(h, k) = (${n2(h)}, ${n2(kv)})`) + card('a_c2_h', 'a_c2_t', k.stdTeX(a, b, c), `(0, c) = (0, ${n2(c)})`) + card('a_c3_h', 'a_c3_t', k.facTeX(a, r1, r2), `x = ${n2(r1)},\\ ${n2(r2)}`));
    },
    goal: () => {
      const k = K(), r1 = k.$v('icAr1'), r2 = k.$v('icAr2'), a = k.$v('icAa');
      return { ok: Math.abs((r1 + r2) / 2 - 4) < 0.001 && Math.abs(-a * (r2 - r1) ** 2 / 4 - 16) < 0.001 };
    },
    items: [
      { t: 'num', q: 'a_q1', e: 'a_e1', ans: [2] },
      { t: 'num', q: 'a_q2', e: 'a_e2', ans: [-2] },
      { t: 'mc', q: 'a_q3', o: 'a_o3', e: 'a_e3', ans: 1 },
    ],
    formal: [
      'a_f_def',
      ['a_f_conv', 'a_f_cmp'],
      'a_f_ex',
      () => {
        const H = T('a_f_th').split('||'), row = (n, eq, r) => `<tr><td>${T(n)}</td><td>$${eq}$</td><td>${T(r)}</td></tr>`;
        return `<div class="scrl"><table class="mtab left"><tr>${H.map((x) => `<th>${x}</th>`).join('')}</tr>${row('a_f_v', 'y = a(x - h)^2 + k', 'a_f_rv')}${row('a_f_s', 'y = ax^2 + bx + c', 'a_f_rs')}${row('a_f_f', 'y = a(x - r_1)(x - r_2)', 'a_f_rf')}</table></div>`;
      },
    ],
  };

  const SPRE = [[1, -2, -8], [1, -4, 4], [1, 0, 4], [1, -1, -6]];
  R.S = {
    ids: ['icSa', 'icSb', 'icSc'],
    zero: ['icSa'],
    html1: () => {
      const k = K();
      return `<p class="mut">${T('s_sim')}</p><div class="mw"><div class="ctl">${k.slider('icSa', T('s_a'), -3, 3, 0.5, 1)}${k.slider('icSb', T('s_b'), -8, 8, 1, -2)}${k.slider('icSc', T('s_c'), -8, 8, 1, -8)}</div><div id="icSsvg"></div><div class="dpanel" id="icSd"></div></div>`;
    },
    html2: () => `<p class="mut">${T('s_tab')}</p><div class="scrl"><table class="mtab left" id="icStab"></table></div><h4 style="margin-top:16px">${T('s_sign_h')}</h4><div class="scrl"><table class="mtab left" id="icSsign"></table></div>`,
    draw: (ctx) => {
      const k = K(), C = k.C, n2 = k.n2, a = k.$v('icSa'), b = k.$v('icSb'), c = k.$v('icSc'), f = (x) => a * x * x + b * x + c, D = b * b - 4 * a * c;
      const rs = D < 0 ? [] : D === 0 ? [-b / (2 * a)] : [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((p, q) => p - q);
      ctx.seen[rs.length] = 1;
      const g = k.Gx(420, 300, [-8, 8], [-12, 12], 28);
      let s = k.frame(g, 4, 4) + k.curve(g, f, C.cy, 3.5) + rs.map((x) => `<circle cx="${g.X(x)}" cy="${g.Y(0)}" r="8" fill="${C.rd}" stroke="#fff" stroke-width="2"/><text x="${g.X(x)}" y="${g.Y(0) - 13}" fill="${C.rd}" font-size="12" font-weight="700" text-anchor="middle">${k.f2(x)}</text>`).join('');
      s += `<text x="${g.pad + 6}" y="${g.pad + 4}" fill="${C.gold}" font-size="13" font-weight="700">${T('s_n', { n: rs.length })}</text>`;
      k.put('icSsvg', k.svg(g, s, T('s_alt')));
      k.put('icSd', `<p>$${k.stdTeX(a, b, c)}$</p><p>$D = b^2 - 4ac = (${n2(b)})^2 - 4(${n2(a)})(${n2(c)}) = ${n2(D)}$</p>${D < 0 ? `<p class="mut">${T('s_none')}</p>` : ''}`);
      const cnt = (q) => (q < 0 ? 0 : q === 0 ? 1 : 2), H = T('s_th').split('||');
      let r = `<tr><th>${H[0]}</th><th>$D$</th><th>${H[1]}</th></tr><tr class="hi"><td>${T('s_now')}: $${k.stdTeX(a, b, c)}$</td><td>$${n2(D)}$</td><td>${rs.length}</td></tr>`;
      SPRE.forEach(([pa, pb, pc]) => {
        const pd = pb * pb - 4 * pa * pc;
        r += `<tr><td>$${k.stdTeX(pa, pb, pc)}$</td><td>$${pd}$</td><td>${cnt(pd)}</td></tr>`;
      });
      k.put('icStab', r);
      const SH = T('s_sign_th').split('||'), reg = [], tst = [];
      if (D > 0) {
        reg.push(`$(-\\infty, ${n2(rs[0])})$`, `$(${n2(rs[0])}, ${n2(rs[1])})$`, `$(${n2(rs[1])}, \\infty)$`);
        tst.push(rs[0] - 1, (rs[0] + rs[1]) / 2, rs[1] + 1);
      } else if (D === 0) {
        reg.push(`$(-\\infty, ${n2(rs[0])})$`, `$(${n2(rs[0])}, \\infty)$`);
        tst.push(rs[0] - 1, rs[0] + 1);
      } else {
        reg.push(T('s_all'));
        tst.push(0);
      }
      k.put('icSsign', `<tr><th>${SH[0]}</th><th>${SH[1]}</th><th>$f(x)$</th><th>${SH[2]}</th></tr>` + reg.map((q, i) => `<tr><td>${q}</td><td>${k.f2(tst[i])}</td><td>${k.f2(f(tst[i]))}</td><td>${f(tst[i]) > 0 ? T('s_pos') : T('s_neg')}</td></tr>`).join(''));
    },
    goal: (ctx) => ({
      ok: !!(ctx.seen[0] && ctx.seen[1] && ctx.seen[2]),
      extra: `${T('s_prog')} ` + [2, 1, 0].map((n) => `<em class="${ctx.seen[n] ? 'ok' : ''}">${T('s_chip', { n })}</em>`).join(' '),
    }),
    items: [
      { t: 'num', q: 's_q1', e: 's_e1', ans: [36] },
      { t: 'num', q: 's_q2', e: 's_e2', ans: [0] },
      { t: 'mc', q: 's_q3', o: 's_o3', e: 's_e3', ans: 0 },
    ],
    formal: ['s_f_def', ['s_f_1', 's_f_2', 's_f_3', 's_f_4', 's_f_5'], 's_f_ex'],
  };

  const berg = (st) => {
    const poly = [
      [4, '160,6 188,60 132,60', 160, 42],
      [3, '132,60 188,60 208,106 112,106', 160, 88],
      [2, '112,106 208,106 238,158 82,158', 160, 138],
      [1, '82,158 238,158 266,216 54,216', 160, 192],
    ];
    return `<svg class="ice-berg" viewBox="0 0 320 232" role="img" aria-label="Iceberg"><rect x="0" y="60" width="320" height="172" fill="rgba(77,139,255,.14)"/><path d="M0 60 Q20 54 40 60 T80 60 T120 60 T160 60 T200 60 T240 60 T280 60 T320 60" fill="none" stroke="#5ee6f2" stroke-width="2"/>${poly
      .map(([n, p, x, y]) => `<g class="ib ib${n}${n <= st.u ? ' on' : ''}" data-l="${n}" tabindex="0" role="button"><polygon points="${p}"/><text x="${x}" y="${y}" text-anchor="middle">${n} ${T('ice_b' + n)}</text></g>`)
      .join('')}</svg>`;
  };
  const formalHTML = (c) => {
    const [def, lis, ex, extra] = R[c].formal;
    return `<div class="ice-formal"><h4>${T('ice_def')}</h4><p class="ice-def">${T(def)}</p>${typeof extra === 'function' ? extra() : ''}<h4>${T('ice_prop')}</h4><ul class="l">${lis.map((k) => `<li>${T(k)}</li>`).join('')}</ul><h4>${T('ice_exm')}</h4><p class="ice-ex">${T(ex)}</p></div>`;
  };
  const itemHTML = (c, it, i, st) => {
    const a = st.a[i];
    let body = '';
    if (it.t === 'num') {
      body = `<div class="ice-ins">${it.ans
        .map((_, j) => `${it.lab ? `<span>${it.lab[j]}</span>` : ''}<input class="ice-in" inputmode="decimal" autocomplete="off" data-i="${i}" data-j="${j}" value="${esc(Array.isArray(a) ? a[j] : '')}" aria-label="${T('ice_pred', { n: i + 1 })}">`)
        .join('')}</div>`;
    } else {
      body = `<div class="ice-opts">${T(it.o)
        .split('||')
        .map((o, j) => `<button type="button" class="ice-opt${a === j ? ' on' : ''}" data-i="${i}" data-o="${j}">${o}</button>`)
        .join('')}</div>`;
    }
    return `<div class="ice-q" data-i="${i}"><p><b>${T('ice_pred', { n: i + 1 })}</b> ${T(it.q)}</p>${body}<div class="ice-fb" id="icefb${i}"></div></div>`;
  };
  const html = (c) => {
    const m = R[c], p = PRE[c], st = load(c);
    const lay = (n, inner) => `<section class="ice-l${n > st.u ? ' lock' : ''}" data-l="${n}" id="ice${c}l${n}"><header><span class="ice-bdg">${T('ice_layer', { n })}</span><h3>${T('ice_l' + n + '_t')}</h3><p class="mut sm">${T('ice_l' + n + '_s')}</p></header><div class="ice-lk">${n === 4 ? T('ice_lock4') : T('ice_lockn', { n: n - 1 })}</div><div class="ice-by">${inner}</div></section>`;
    const l1 = `${m.html1()}<div class="ice-goal" id="icegoal"><b>${T('ice_goal_h')}:</b> <span>${T(p + '_goal')}</span> <strong id="icegs"></strong><div id="icegx"></div></div><p class="mut sm" id="icegate"></p><button type="button" class="btn" data-ice="2" id="icen2"${st.u >= 2 ? ' hidden' : ' disabled'}>${T('ice_next2')}</button>`;
    const l2 = `${m.html2()}<p style="margin-top:14px"><button type="button" class="btn" data-ice="3" id="icen3"${st.u >= 3 ? ' hidden' : ''}>${T('ice_next3')}</button></p>`;
    const l3 = `${m.items.map((it, i) => itemHTML(c, it, i, st)).join('')}<label class="ice-ref"><span>${T('ice_reflect')}</span><textarea id="icer" rows="2" placeholder="${esc(T('ice_ph'))}">${esc(st.r)}</textarea></label><p><button type="button" class="btn" data-ice="chk" id="icechk">${st.ck ? T('ice_chk2') : T('ice_chk')}</button></p><div class="ice-sum" id="icesum"></div>`;
    return `<div class="ice" data-c="${c}" data-no-i18n><div class="mat-head"><h2>${T(p + '_title')}</h2><p>${T(p + '_story')}</p></div><div class="ice-top"><div><small class="tag">${T('ice_tag')}</small><h3>${T('ice_head')}</h3><p class="mut sm">${T('ice_head_p')}</p><p class="mut sm"><i>${T('ice_bergcap')}</i></p></div><div id="iceberg">${berg(st)}</div></div>${lay(1, l1)}${lay(2, l2)}${lay(3, l3)}${lay(4, formalHTML(c))}</div>`;
  };

  const init = (c, root) => {
    const el = (root || document).querySelector('.ice[data-c="' + c + '"]');
    if (!el) return;
    const m = R[c], ctx = { c, moves: 0, done: false, seen: {}, run: 0 };
    const reveal = () => {
      const st = load(c);
      el.querySelectorAll('.ice-l').forEach((s) => s.classList.toggle('lock', +s.dataset.l > st.u));
      $('iceberg').innerHTML = berg(st);
      ['2', '3'].forEach((n) => {
        const b = $('icen' + n);
        if (b) b.hidden = st.u >= +n;
      });
    };
    const gate = () => {
      const b = $('icen2');
      if (!b || b.hidden) return;
      const need = Math.max(0, 3 - ctx.moves);
      b.disabled = !(ctx.done || need === 0);
      $('icegate').textContent = b.disabled ? T('ice_gate_need', { n: need }) : '';
    };
    const refresh = (tx) => {
      m.draw(ctx, tx);
      const g = m.goal(ctx);
      if (g.ok) ctx.done = true;
      $('icegs').textContent = ctx.done ? '✔ ' + T('ice_goal_ok') : '';
      $('icegoal').classList.toggle('ok', ctx.done);
      $('icegx').innerHTML = g.extra || '';
      gate();
    };
    m.ids.forEach((id) => {
      const e = $(id);
      e.addEventListener('input', () => {
        if (m.zero && m.zero.includes(id) && +e.value === 0) e.value = e.step;
        m.ids.forEach((i) => ($(i + 'v').textContent = K().n2($(i).value)));
        ctx.moves++;
        ctx.run++;
        refresh();
      });
    });
    refresh();
    m.init && m.init(ctx, refresh);
    const open = (n) => {
      const st = load(c);
      st.u = Math.max(st.u, n);
      save(c, st);
      reveal();
      const t = $('ice' + c + 'l' + n);
      t && t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const check = () => {
      const st = load(c), fb = (i, h) => ($('icefb' + i).innerHTML = h);
      const empty = m.items.some((it, i) => (it.t === 'num' ? !Array.isArray(st.a[i]) || st.a[i].length < it.ans.length || it.ans.some((_, j) => String(st.a[i][j] == null ? '' : st.a[i][j]).trim() === '') : st.a[i] == null));
      if (empty) {
        $('icesum').textContent = T('ice_fill');
        return;
      }
      let ok = 0;
      m.items.forEach((it, i) => {
        const a = st.a[i];
        const good = it.t === 'num' ? it.ans.every((v, j) => Math.abs(parse(a[j]) - v) < 0.0001) : a === it.ans;
        if (good) ok++;
        const ans = it.t === 'num' ? `$${it.ans.join(',\\ ')}$` : T(it.o).split('||')[it.ans];
        fb(i, `<p class="${good ? 'ok' : 'bad'}"><b>${good ? '✔ ' + T('ice_ok') : '✖ ' + T('ice_no')}</b>${good ? '' : ' ' + T('ice_ans', { a: ans })}</p><p class="mut sm">${T(it.e)}</p>`);
        el.querySelectorAll('.ice-q[data-i="' + i + '"]').forEach((q) => {
          q.classList.toggle('good', good);
          q.classList.toggle('miss', !good);
        });
      });
      st.ck = 1;
      st.u = 4;
      save(c, st);
      $('icechk').textContent = T('ice_chk2');
      $('icesum').innerHTML = `<b>${T('ice_score', { a: ok, b: m.items.length })}</b> ${T('ice_opened')}`;
      reveal();
      const t = $('ice' + c + 'l4');
      t && t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    el.addEventListener('click', (e) => {
      const opt = e.target.closest('.ice-opt');
      if (opt) {
        const st = load(c), i = +opt.dataset.i;
        st.a[i] = +opt.dataset.o;
        save(c, st);
        opt.parentElement.querySelectorAll('.ice-opt').forEach((b) => b.classList.toggle('on', b === opt));
        return;
      }
      const nx = e.target.closest('[data-ice]');
      if (nx) {
        const v = nx.dataset.ice;
        if (v === 'chk') check();
        else open(+v);
        return;
      }
      const band = e.target.closest('.ib');
      if (band && +band.dataset.l <= load(c).u) {
        const t = $('ice' + c + 'l' + band.dataset.l);
        t && t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    el.addEventListener('input', (e) => {
      const t = e.target;
      if (t.classList.contains('ice-in')) {
        const st = load(c), i = +t.dataset.i;
        if (!Array.isArray(st.a[i])) st.a[i] = [];
        st.a[i][+t.dataset.j] = t.value;
        save(c, st);
      } else if (t.id === 'icer') {
        const st = load(c);
        st.r = t.value;
        save(c, st);
      }
    });
  };

  return {
    has: (c) => !!R[c],
    html: (c) => (R[c] ? html(c) : ''),
    init,

    reset: (c) => {
      delete mem[c];
      try {
        localStorage.removeItem(key(c));
      } catch (e) {

      }
    },
  };
})();
