'use strict';

(() => {

  const braced = (s, i) => {

    let d = 0;
    for (let j = i; j < s.length; j++) {
      if (s[j] === '{') d++;
      else if (s[j] === '}' && --d === 0) return [s.slice(i + 1, j), j + 1];
    }
    return [s.slice(i + 1), s.length];
  };
  const SYM = { pm: '±', mp: '∓', le: '≤', leq: '≤', leqslant: '≤', ge: '≥', geq: '≥', geqslant: '≥', ne: '≠', neq: '≠', infty: '∞', in: '∈', cdot: '*', times: '*', div: '/', pi: 'π', to: '->', rightarrow: '->', cup: '∪', cap: '∩', theta: 'θ', alpha: 'α', beta: 'β', delta: 'δ', lambda: 'λ' };
  const simple = (a) => /^-?[a-z0-9.,]+$/.test(a);
  const fromTex = (s) => {
    s = s.replace(/\\(?:left|right|displaystyle|textstyle|bigl|bigr|big)\b\s*/g, '').replace(/\\[,;:! ]/g, '');
    s = s.replace(/\\mathbb\s*\{r\}/g, 'ℝ').replace(/\\(?:text|mathrm|mathbf|textbf|operatorname|mathit)\s*\{([^{}]*)\}/g, '$1');

    for (let guard = 0; guard < 40; guard++) {
      const m = /\\(?:d|t)?frac|\\sqrt/.exec(s);
      if (!m) break;
      const isF = m[0] !== '\\sqrt';
      let i = m.index + m[0].length;
      while (s[i] === ' ') i++;
      const grab = () => {
        while (s[i] === ' ') i++;
        if (s[i] === '{') {
          const [g, e] = braced(s, i);
          i = e;
          return fromTex(g);
        }
        const ch = s[i] || '';
        i += ch ? 1 : 0;
        return ch;
      };
      if (isF) {
        const a = grab(),
          b = grab();
        s = s.slice(0, m.index) + (simple(a) ? a : '(' + a + ')') + '/' + (simple(b) ? b : '(' + b + ')') + s.slice(i);
      } else {
        const a = grab();
        s = s.slice(0, m.index) + 'sqrt(' + a + ')' + s.slice(i);
      }
    }
    s = s.replace(/\\([a-z]+)/g, (x, w) => (w in SYM ? SYM[w] : w));
    s = s.replace(/\\/g, '');
    s = s.replace(/_\s*\{([^{}]*)\}/g, '$1').replace(/_\s*([a-z0-9])/g, '$1');
    s = s.replace(/\^\s*\{([^{}]*)\}/g, (x, c) => '^' + (/^(-?\d+([.,]\d+)?|[a-z])$/.test(c.trim()) ? c.trim() : '(' + c + ')'));
    return s.replace(/[{}]/g, '');
  };

  const std = (raw) => {
    let s = String(raw == null ? '' : raw).toLowerCase().replace(/\$/g, '');
    if (/[\\{}_]/.test(s)) s = fromTex(s);
    s = s.replace(/[−–—]/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/\s/g, '');
    return s.replace(/\^\((-?\d+(?:[.,]\d+)?|[a-z])\)/g, '^$1');
  };

  const KNOWN = { sin: '\\sin', cos: '\\cos', tan: '\\tan', log: '\\log', ln: '\\ln', pi: '\\pi', theta: '\\theta', alpha: '\\alpha', beta: '\\beta', delta: '\\delta', lambda: '\\lambda', sqrt: 'SQRT' };
  const OPS2 = { '<=': '\\le ', '>=': '\\ge ', '!=': '\\ne ', '+-': '\\pm ', '->': '\\to ' };
  const OPS1 = { '+': '+', '-': '-', '=': '=', '<': '<', '>': '>', '≤': '\\le ', '≥': '\\ge ', '≠': '\\ne ', '±': '\\pm ', '∓': '\\mp ', '*': '\\cdot ', '×': '\\cdot ', '÷': '\\div ', ',': ',\\,', ';': ';\\,', ':': ':', '|': '|', '∈': '\\in ', '∪': '\\cup ', '∩': '\\cap ', '−': '-', '%': '\\%', '°': '^{\\circ}', '!': '!', '[': '[', ']': ']' };
  const SYMA = { '∞': '\\infty ', 'ℝ': '\\mathbb{R}', π: '\\pi ', θ: '\\theta ', α: '\\alpha ', β: '\\beta ', δ: '\\delta ', λ: '\\lambda ' };
  const SUP = { '²': '2', '³': '3', '¹': '1' };
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const textTex = (w) => '\\text{' + w.replace(/[\\{}$&#_%^~]/g, '') + '}';

  function plainToTex(src, essay) {
    const T = [];
    const re = /(\s+)|(\d+(?:[.,]\d+)?)|((?:(?![ℝπθαβδλ])\p{L})+)|(<=|>=|!=|\+-|->)|(.)/gu;
    let m,
      sp = false;
    while ((m = re.exec(src))) {
      if (m[1]) sp = true;
      else {
        if (m[3]) {
          const w = m[3],
            lw = w.toLowerCase();
          if (KNOWN[lw]) T.push({ k: 'w', v: lw, sp });
          else if (/^[A-Za-z]+$/.test(w) && w.length < (essay ? 2 : 4)) [...w].forEach((c, n) => T.push({ k: 'v', v: c, sp: n ? false : sp }));
          else T.push({ k: 't', v: w, sp });
        } else if (m[2]) T.push({ k: 'n', v: m[2].replace(',', '{,}'), sp });
        else if (m[4]) T.push({ k: 'o', v: OPS2[m[4]], sp });
        else T.push({ k: 'c', v: m[5], sp });
        sp = false;
      }
    }
    let i = 0,
      closedLast = false;
    const joinAtoms = (a) => a.map((x, n) => (n && (x.sp || false) && (x.kind === 'text' || a[n - 1].kind === 'text') ? '\\ ' : '') + x.tex).join('');
    const term = (a) => (a.length === 1 && a[0].group ? a[0].inner : joinAtoms(a));
    const atomExp = (atoms) => {

      const t = T[i];
      if (!t) return '{\\square}';
      if (t.k === 'c' && t.v === '(') {
        i++;
        const g = seq(true);
        return '{' + (g || '\\square') + '}';
      }
      let neg = '';
      if (t.k === 'c' && t.v === '-' && T[i + 1] && (T[i + 1].k === 'n' || T[i + 1].k === 'v')) {
        neg = '-';
        i++;
      }
      const u = T[i];
      if (u && (u.k === 'n' || u.k === 'v')) {
        i++;
        return '{' + neg + u.v + '}';
      }
      return '{\\square}';
    };
    const atom = () => {
      const t = T[i++];
      if (t.k === 'n') return { tex: t.v, sp: t.sp, kind: 'n' };
      if (t.k === 't') return { tex: textTex(t.v), sp: t.sp, kind: 'text' };
      if (t.k === 'o') return { tex: t.v, sp: t.sp, kind: 'o', op: 1 };
      if (t.k === 'w') {
        if (t.v === 'sqrt') return sqrtAtom(t.sp);
        return { tex: KNOWN[t.v] + ' ', sp: t.sp, kind: 'f' };
      }
      if (t.k === 'v') {
        const nx = T[i];
        if (nx && nx.k === 'n' && !nx.sp && /^\d{1,2}$/.test(nx.v) && 'xyzabchkmntuvw'.includes(t.v)) {
          i++;
          return { tex: t.v + '_{' + nx.v + '}', sp: t.sp, kind: 'v' };
        }
        return { tex: t.v, sp: t.sp, kind: 'v' };
      }
      const c = t.v;
      if (c === '√') return sqrtAtom(t.sp);
      if (c === '(') {
        const g = seq(true),
          cl = closedLast;
        return { tex: '(' + g + (cl ? ')' : ''), inner: g || '\\square', group: 1, sp: t.sp, kind: 'g' };
      }
      if (c === ')') return { tex: ')', sp: t.sp, kind: 'o', op: 1 };
      if (c in SUP) return { tex: '^{' + SUP[c] + '}', sp: false, kind: 'p' };
      if (c in SYMA) return { tex: SYMA[c], sp: t.sp, kind: 'n' };
      if (c in OPS1) return { tex: OPS1[c], sp: t.sp, kind: 'o', op: 1 };
      return { tex: textTex(c), sp: t.sp, kind: 'text' };
    };
    const sqrtAtom = (sp) => {
      const t = T[i];
      let inner = '\\square';
      if (t && t.k === 'c' && t.v === '(') {
        i++;
        inner = seq(true) || '\\square';
      } else if (t && (t.k === 'n' || t.k === 'v')) {
        i++;
        inner = t.v;
      }
      return { tex: '\\sqrt{' + inner + '}', sp, kind: 'r' };
    };

    function seq(inParen) {
      closedLast = false;
      const out = [];
      let cur = [];
      const flush = () => {
        if (cur.length) out.push(joinAtoms(cur));
        cur = [];
      };
      while (i < T.length) {
        const t = T[i];
        if (t.k === 'c' && t.v === ')') {
          if (inParen) {
            i++;
            closedLast = true;
            break;
          }
        }
        if (t.k === 'c' && t.v === '/') {
          i++;
          const num = cur.length ? term(cur) : '\\square';
          cur = [];
          const den = [];
          while (i < T.length) {
            const u = T[i];
            if (u.k === 'o' || (u.k === 'c' && (u.v in OPS1 && u.v !== '(' || u.v === ')' || u.v === '/'))) break;
            const a = atom();
            if (a.kind === 'p' && den.length) den[den.length - 1].tex += a.tex;
            else den.push(a);
            if (T[i] && T[i].k === 'c' && T[i].v === '^') {
              i++;
              den[den.length - 1].tex += '^' + atomExp();
              den[den.length - 1].group = 0;
            }
          }
          cur = [{ tex: '\\frac{' + num + '}{' + (den.length ? term(den) : '\\square') + '}', sp: false, kind: 'fr' }];
          continue;
        }
        if (t.k === 'c' && t.v === '^') {
          i++;
          const e = atomExp();
          if (cur.length) {
            cur[cur.length - 1].tex = (cur[cur.length - 1].kind === 'g' ? cur[cur.length - 1].tex : cur[cur.length - 1].tex) + '^' + e;
            cur[cur.length - 1].group = 0;
          } else cur.push({ tex: '{}^' + e, sp: false, kind: 'p' });
          continue;
        }
        const a = atom();
        if (a.op) {
          flush();
          out.push(a.tex);
        } else if (a.kind === 'p' && cur.length) {
          cur[cur.length - 1].tex += a.tex;
          cur[cur.length - 1].group = 0;
        } else cur.push(a);
      }
      flush();
      return out.join('');
    }
    return seq(false);
  }

  const kx = () => window.katex && window.katex.renderToString;
  const rk = (tex, display) => {
    try {
      return window.katex.renderToString(tex, { throwOnError: false, strict: 'ignore', displayMode: !!display, trust: false });
    } catch (e) {
      return '<span class="no-math">' + esc(tex) + '</span>';
    }
  };

  function previewHTML(val, essay) {
    if (!String(val).trim()) return '';
    if (!kx()) return '<span class="no-math">' + esc(val) + '</span>';
    return String(val)
      .split(/\n/)
      .map((line) => {
        if (!line.trim()) return '<br>';
        let h;
        if (/\$/.test(line)) {
          h = line
            .split('$')
            .map((seg, n) => (n % 2 ? (seg ? rk(/\\[a-zA-Z]/.test(seg) ? seg : plainToTex(seg, false)) : '') : seg ? '<span class="no-math">' + esc(seg) + '</span>' : ''))
            .join('');
        } else if (/\\[a-zA-Z]/.test(line)) h = rk(line);
        else h = rk(plainToTex(line, essay));
        return '<div class="mp-l">' + h + '</div>';
      })
      .join('');
  }

  const ROWS = [
    [
      ['sq', 'x²', 'x^{2}', '^2', 2, 'Kuadrat'],
      ['pw', 'xⁿ', 'x^{\\square}', '^()', 2, 'Pangkat bebas'],
      ['rt', '√', '\\sqrt{\\square}', 'sqrt()', 5, 'Akar kuadrat'],
      ['fr', 'a/b', '\\frac{\\square}{\\square}', '()/()', 1, 'Pecahan'],
      ['pa', '( )', '(\\square)', '()', 1, 'Kurung'],
      ['pm', '±', '\\pm', '±', 1, 'Plus minus'],
      ['inf', '∞', '\\infty', '∞', 1, 'Tak hingga'],
    ],
    [
      ['le', '≤', '\\le', '≤', 1, 'Kurang dari atau sama dengan'],
      ['ge', '≥', '\\ge', '≥', 1, 'Lebih dari atau sama dengan'],
      ['ne', '≠', '\\ne', '≠', 1, 'Tidak sama dengan'],
      ['lt', '<', '<', '<', 1, 'Kurang dari'],
      ['gt', '>', '>', '>', 1, 'Lebih dari'],
      ['eq', '=', '=', '=', 1, 'Sama dengan'],
      ['R', 'ℝ', '\\mathbb{R}', 'ℝ', 1, 'Bilangan real'],
    ],
    ...[['x', 'y', 'h', 'k', 'a', 'b', 'c']].map((r) => r.map((v) => ['v' + v, v, v, v, 1, '', 'mp-var'])),
    [['d7', '7'], ['d8', '8'], ['d9', '9'], ['plus', '+', '+', '+', 1, 'Tambah'], ['minus', '−', '-', '-', 1, 'Kurang'], ['lp', '(', '(', '(', 1, 'Kurung buka'], ['rp', ')', ')', ')', 1, 'Kurung tutup']].map(mk),
    [['d4', '4'], ['d5', '5'], ['d6', '6'], ['mul', '×', '\\times', '*', 1, 'Kali'], ['comma', ',', ',', ',', 1, 'Koma'], ['dot', '.', '.', '.', 1, 'Titik'], ['bs', '⌫', '', '', 0, 'Hapus satu karakter', 'mp-ctl']].map(mk),
    [['d1', '1'], ['d2', '2'], ['d3', '3'], ['d0', '0'], ['left', '←', '', '', 0, 'Geser kursor ke kiri', 'mp-ctl'], ['right', '→', '', '', 0, 'Geser kursor ke kanan', 'mp-ctl'], ['clr', 'C', '', '', 0, 'Bersihkan semua', 'mp-ctl']].map(mk),
  ];
  function mk(b) {
    if (b.length === 2) return [b[0], b[1], b[1], b[1], 1, '', 'mp-num'];
    return b;
  }
  let uidn = 0;

  function insertAt(el, text, caret) {
    el.focus();
    const a = el.selectionStart == null ? el.value.length : el.selectionStart,
      b = el.selectionEnd == null ? a : el.selectionEnd,
      selTxt = el.value.slice(a, b);
    let ins = text,
      pos = caret;
    if (selTxt && /\(\)/.test(text)) {

      const k = text.indexOf('()');
      ins = text.slice(0, k + 1) + selTxt + text.slice(k + 1);
      pos = text === '()/()' ? ins.length - 1 : ins.length;
    }
    el.setRangeText(ins, a, b, 'end');
    const p = a + (selTxt && /\(\)/.test(text) ? pos : pos);
    el.setSelectionRange(p, p);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function act(el, code, b) {
    const v = el.value,
      a = el.selectionStart == null ? v.length : el.selectionStart,
      e = el.selectionEnd == null ? a : el.selectionEnd;
    const set = (p) => {
      el.focus();
      el.setSelectionRange(p, p);
    };
    if (code === 'left') return set(Math.max(0, a - 1));
    if (code === 'right') return set(v.slice(e, e + 3) === ')/(' ? e + 3 : Math.min(v.length, e + 1));
    if (code === 'clr') {
      el.value = '';
      el.focus();
      return el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (code === 'bs') {
      let s = a,
        t = e;
      if (s === t) {
        const L = v.slice(0, s),
          R = v.slice(s);
        const mm = /(sqrt\(|\^\(|\()$/.exec(L);
        if (mm && R[0] === ')') {
          s -= mm[0].length;
          t += 1;
        } else if (s > 0) s -= 1;
        else return;
      }
      el.setRangeText('', s, t, 'end');
      set(s);
      return el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    insertAt(el, b[3], b[4]);
  }

  function build(el, essay) {
    const id = 'mp' + ++uidn,
      wrap = document.createElement('div');
    wrap.className = 'mpad';
    wrap.innerHTML = `<div class="mp-pv no-math" aria-live="polite" hidden></div><div class="mp-bar"><button type="button" class="mp-tg" aria-expanded="false" aria-controls="${id}" title="Buka keypad rumus"><b class="mp-fx" aria-hidden="true">ƒ(x)</b><span>Keypad Rumus</span></button></div><div class="mp-panel" id="${id}" role="group" aria-label="Keypad Rumus" hidden></div>`;
    const pv = wrap.querySelector('.mp-pv'),
      tg = wrap.querySelector('.mp-tg'),
      panel = wrap.querySelector('.mp-panel');
    let built = false;
    const face = (b) => {
      const t = b[2];
      if (!t || !kx() || b[6] === 'mp-ctl') return esc(b[1]);
      return rk(t);
    };
    const buildPanel = () => {
      panel.innerHTML = ROWS.map((r) => `<div class="mp-row">${r.map((b) => `<button type="button" class="mp-k ${b[6] || ''}" data-k="${b[0]}"${b[5] ? ` aria-label="${esc(b[5])}" title="${esc(b[5])}"` : ''}>${face(b)}</button>`).join('')}</div>`).join('') + '<p class="mp-note">Teks biasa dan LaTeX sama-sama diterima.</p>';
      built = !!kx();
    };
    const refresh = () => {
      const html = previewHTML(el.value, essay);
      if (html) pv.innerHTML = html;
      else pv.innerHTML = panel.hidden ? '' : '<span class="mp-ph">Ketik atau tekan tombol, pratinjau rumus muncul di sini.</span>';
      pv.hidden = !pv.innerHTML;
    };
    tg.onclick = () => {
      const open = panel.hidden;
      if (open) {
        if (!built) buildPanel();

        const scope = el.closest('.item') || el.closest('.ice-ref') || document;
        scope.querySelectorAll('.mp-panel:not([hidden])').forEach((p) => p !== panel && p.parentElement.querySelector('.mp-tg').click());
      }
      panel.hidden = !open;
      tg.setAttribute('aria-expanded', String(open));
      tg.title = open ? 'Tutup keypad rumus' : 'Buka keypad rumus';
      tg.classList.toggle('on', open);
      refresh();
      if (open) el.focus();
    };

    panel.addEventListener('pointerdown', (e) => e.target.closest('.mp-k') && e.preventDefault());
    panel.addEventListener('click', (e) => {
      const k = e.target.closest('.mp-k');
      if (!k || el.disabled) return;
      const b = ROWS.flat().find((x) => x[0] === k.dataset.k);
      b && act(el, b[0], b);
    });
    el.addEventListener('input', refresh);

    addEventListener('load', () => {
      if (!built && !panel.hidden) buildPanel();
      refresh();
    });
    el.insertAdjacentElement('afterend', wrap);
    if (el.value) refresh();
    return wrap;
  }

  const TARGETS = 'input[data-f], .item textarea, #icer, [data-mathpad]';
  function attach(el) {
    if (!el || el.dataset.mpad || el.disabled || el.type === 'file') return;
    el.dataset.mpad = '1';
    const fills = el.closest('.fills');
    fills && fills.classList.add('has-mpad');
    build(el, el.tagName === 'TEXTAREA');
  }
  const scan = (root) => {
    root = root && root.querySelectorAll ? root : document;
    if (root.matches && root.matches(TARGETS)) attach(root);
    root.querySelectorAll(TARGETS).forEach(attach);
  };
  let q = new Set(),
    sch = false;
  const mo = new MutationObserver((ms) => {
    ms.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && q.add(n)));
    if (q.size && !sch) {
      sch = true;
      Promise.resolve().then(() => {
        sch = false;
        const l = [...q];
        q.clear();
        l.forEach((n) => n.isConnected && scan(n));
      });
    }
  });
  const start = () => {
    scan(document);
    mo.observe(document.body, { childList: true, subtree: true });
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();

  window.Mp = { std, tex: plainToTex, preview: previewHTML, attach, scan };
})();
