'use strict';

(() => {
  const LANGS = [
    ['id', 'Bahasa Indonesia', 'ID', 'id-ID'],
    ['en', 'English', 'EN', 'en-US'],
    ['ja', '日本語', 'JP', 'ja-JP'],
    ['ko', '한국어', 'KR', 'ko-KR'],
  ];
  const LI = { en: 0, ja: 1, ko: 2 };
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
  const DATA = window.LANG_DATA || {};
  const SAY = window.LANG_SAY || {};
  let cur = ls.get('ad_lang');
  if (!LANGS.some((l) => l[0] === cur)) cur = 'id';

  const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
  const exact = new Map(),
    pats = [];
  Object.keys(DATA).forEach((k) => {
    const nk = norm(k);
    if (/\{\w+\}/.test(nk)) {
      const names = [];
      const re = nk
        .split(/(\{\w+\})/)
        .map((p) => {
          const m = p.match(/^\{(\w+)\}$/);
          if (m) {
            names.push(m[1]);
            return '(.+?)';
          }
          return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        })
        .join('');
      pats.push({ re: new RegExp('^' + re + '$'), names, v: DATA[k], len: nk.length });
    } else exact.set(nk, DATA[k]);
  });
  pats.sort((a, b) => b.len - a.len);

  const tr = (s, depth = 0, strict = false) => {
    if (cur === 'id' || depth > 4) return null;
    const key = norm(s);
    if (!key) return null;
    const li = LI[cur];
    const e = exact.get(key);
    if (e && e[li] != null) return e[li];
    for (const p of pats) {
      const m = key.match(p.re);
      if (!m || p.v[li] == null) continue;
      let out = p.v[li];
      p.names.forEach((n, i) => (out = out.split('{' + n + '}').join(tr(m[i + 1], depth + 1) ?? m[i + 1])));
      return out;
    }
    if (strict) return null;

    const om = key.match(/^([A-H])\. (.+)$/);
    if (om) {
      const r = tr(om[2], depth + 1);
      return r == null ? null : om[1] + '. ' + r;
    }

    if (key.startsWith('[ SYSTEM ] ')) {
      const r = tr(key.slice(11), depth + 1);
      return r == null ? null : '[ SYSTEM ] ' + r;
    }
    if (key.includes(' | ')) {
      let hit = 0;
      const out = key.split(' | ').map((p) => {
        const r = tr(p, depth + 1);
        if (r != null) hit = 1;
        return r ?? p;
      });
      return hit ? out.join(' | ') : null;
    }
    const sent = key.split(/(?<=[.!?])\s+/);
    if (sent.length > 1) {
      let hit = 0;
      const out = sent.map((p) => {
        const r = tr(p, depth + 1);
        if (r != null) hit = 1;
        return r ?? p;
      });
      return hit ? out.join(cur === 'ja' ? '' : ' ') : null;
    }
    return null;
  };

  const SKIP = 'SCRIPT,STYLE,TEXTAREA,NOSCRIPT,.katex,.no-i18n,[data-no-i18n]';
  const ATTRS = ['placeholder', 'title', 'aria-label'];
  const trec = new Map(),
    arec = new Map();
  const doText = (n) => {
    const r = trec.get(n);
    if (r && n.nodeValue === r.v) return;
    const p = n.parentElement;
    if (!p || p.closest(SKIP)) return;
    const o = n.nodeValue,
      t = tr(o);
    if (t == null) {
      trec.delete(n);
      return;
    }
    const lead = o.match(/^\s*/)[0],
      trail = o.match(/\s*$/)[0],
      v = lead + t + trail;
    trec.set(n, { o, v });
    n.nodeValue = v;
  };

  const INL = /^(B|I|EM|STRONG|U|SMALL|SPAN|CODE|BR|SUB|SUP|A)$/,
    brec = new Map();

  const blockOK = (el) => {
    for (let i = 0; el && i < 4 && el !== document.body; i++, el = el.parentElement)
      if (el.children.length && [...el.children].every((c) => INL.test(c.tagName)) && tr(norm(el.innerHTML), 0, true) != null) return true;
    return false;
  };
  const doBlock = (el) => {
    if (!el.children || !el.children.length || el.closest(SKIP)) return false;
    for (const c of el.children) if (!INL.test(c.tagName)) return false;
    if (el.querySelector('.katex,svg')) return false;
    const o = el.innerHTML,
      r = brec.get(el);
    if (r && o === r.v) return true;
    const t = tr(norm(o), 0, true);
    if (t == null) return false;
    brec.set(el, { o, v: t });
    el.innerHTML = t;
    return true;
  };
  const doEl = (el) => {
    if (el.closest && el.closest(SKIP)) return;
    ATTRS.forEach((a) => {
      const val = el.getAttribute(a);
      if (!val) return;
      const rec = arec.get(el) || {},
        r = rec[a];
      if (r && val === r.v) return;
      const t = tr(val);
      if (t == null) {
        if (r) delete rec[a];
        return;
      }
      rec[a] = { o: val, v: t };
      arec.set(el, rec);
      el.setAttribute(a, t);
    });
  };
  const unwrapTips = (root) => {

    (root.querySelectorAll ? [...root.querySelectorAll('.tip')] : []).forEach((el) => {
      const par = el.parentNode;
      if (!par) return;
      el.replaceWith(document.createTextNode(el.textContent));
      par.normalize();
    });
  };
  const apply = (root) => {
    if (cur === 'id') return;
    root = root || document.body;
    if (!root) return;
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1) return;

    if (root.querySelectorAll) [root, ...root.querySelectorAll('p,li,td,th,div,span,small,h1,h2,h3,h4,label,summary,button,figcaption')].forEach((e) => e.nodeType === 1 && e.children.length && doBlock(e));
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(doText);
    doEl(root);
    root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(doEl);
  };
  const restore = () => {
    trec.forEach((r, n) => {
      if (n.isConnected && n.nodeValue === r.v) n.nodeValue = r.o;
    });
    arec.forEach((rec, el) => {
      Object.keys(rec).forEach((a) => {
        if (el.isConnected && el.getAttribute(a) === rec[a].v) el.setAttribute(a, rec[a].o);
      });
    });
    brec.forEach((r, el) => {
      if (el.isConnected && el.innerHTML === r.v) el.innerHTML = r.o;
    });
    trec.clear();
    arec.clear();
    brec.clear();
  };

  let obs = null;
  const startObs = () => {
    if (obs || !document.body) return;
    obs = new MutationObserver((recs) => {
      if (cur === 'id') return;
      const done = new Set();
      recs.forEach((m) => {
        if (m.type === 'characterData') {
          if (!done.has(m.target)) {
            done.add(m.target);
            doText(m.target);
          }
        } else if (m.type === 'attributes') doEl(m.target);
        else m.addedNodes.forEach((n) => !done.has(n) && (done.add(n), apply(n)));
      });
      obs.takeRecords();
    });
    obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  };

  const loadFont = () => {
    if (cur !== 'ja' && cur !== 'ko') return;
    const id = 'lgfont-' + cur;
    if (document.getElementById(id)) return;
    const l = document.createElement('link');
    l.id = id;
    l.rel = 'stylesheet';
    l.href = cur === 'ja' ? 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&display=swap' : 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500;700&display=swap';
    document.head.appendChild(l);
  };

  const switcher = (inline) =>
    `<button type="button" class="lgb" aria-haspopup="true" aria-expanded="false" title="Language / Bahasa / 言語 / 언어" aria-label="Language">${window.FLAG ? FLAG(cur) : ''}<b class="lgc">${LANGS.find((l) => l[0] === cur)[2]}</b></button><div class="lgm"${inline ? '' : ' hidden'} role="menu">${LANGS.map((l) => `<button type="button" role="menuitem" data-lang="${l[0]}" class="${l[0] === cur ? 'on' : ''}" lang="${l[0]}">${window.FLAG ? FLAG(l[0]) : ''}<b>${l[2]}</b><span>${l[1]}</span></button>`).join('')}</div>`;
  const mount = () => {
    const sa = document.querySelector('#site .sauth');
    if (sa && !sa.querySelector('.lgsw')) {
      const d = document.createElement('div');
      d.className = 'lgsw';
      d.dataset.lgslot = 'land';
      sa.prepend(d);
    }
    document.querySelectorAll('[data-lgslot]').forEach((e) => {
      if (e.dataset.lgdone === cur) return;
      e.dataset.lgdone = cur;
      e.innerHTML = switcher(e.classList.contains('lgset'));
    });
  };
  const closeMenus = () => {
    document.querySelectorAll('.lgsw:not(.lgset) .lgm').forEach((m) => (m.hidden = true));
    document.querySelectorAll('.lgb[aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.lgb');
    if (b) {
      const m = b.parentElement.querySelector('.lgm'),
        open = m.hidden;
      closeMenus();
      m.hidden = !open;
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
    const l = e.target.closest('[data-lang]');
    if (l) {
      closeMenus();
      I18N.set(l.dataset.lang);
      return;
    }
    closeMenus();
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenus());

  ['alert', 'confirm', 'prompt'].forEach((f) => {
    const o = window[f].bind(window);
    window[f] = (m, d) => o(cur === 'id' ? m : (tr(m) ?? m), d);
  });

  const glossPatch = () => {
    if (!window.Gloss) return;
    if (!Gloss.__apply) Gloss.__apply = Gloss.apply;
    Gloss.apply = cur === 'id' ? Gloss.__apply : () => {};
  };
  const I18N = {
    langs: LANGS,
    get lang() {
      return cur;
    },
    t: (s) => (cur === 'id' ? s : (tr(s) ?? s)),
    tr,
    apply,
    mount,

    untranslated(root) {
      const out = new Set();
      const w = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const n = w.currentNode,
          p = n.parentElement;
        if (!p || p.closest(SKIP + ',#icoSprite') || trec.has(n) || (p.parentElement && [...brec.keys()].some((e) => e.contains(p))) || blockOK(p)) continue;
        const t = norm(n.nodeValue),
          plain = t.replace(/\$[^$]*\$/g, ' ').replace(/^[A-H]\.\s/, '');
        if (/[A-Za-z]{2}/.test(plain) && tr(t) == null) out.add(t);
      }
      return [...out];
    },

    blocks(root) {
      const out = new Set();
      (root || document.body).querySelectorAll('p,li,td,th,div,span,small,h1,h2,h3,h4,label,summary,button').forEach((el) => {
        if (el.closest(SKIP + ',#icoSprite') || !el.children.length || el.querySelector('.katex,svg')) return;
        if (![...el.children].every((c) => INL.test(c.tagName))) return;
        const frags = [...el.childNodes].filter((n) => n.nodeType === 3 && /[A-Za-z]{3}/.test(n.nodeValue.replace(/\$[^$]*\$/g, ' ')));
        if (frags.length < 2 || brec.has(el)) return;
        const k = norm(el.innerHTML);
        if (tr(k, 0, true) == null) out.add(k);
      });
      return [...out];
    },
    locale: () => LANGS.find((l) => l[0] === cur)[3],

    say(ev) {
      const L = SAY[cur];
      if (!L) return null;
      return L[ev] || (L.view && L.view[ev]) || null;
    },
    set(l) {
      if (!LANGS.some((x) => x[0] === l) || l === cur) return;
      restore();
      cur = l;
      ls.set('ad_lang', l);
      document.documentElement.lang = l;
      loadFont();
      glossPatch();
      if (cur !== 'id') unwrapTips(document.body);
      else if (window.Gloss) {

        ['#view', '#site'].forEach((s) => {
          const el = document.querySelector(s);
          el && !el.hidden && Gloss.apply(el);
        });
      }
      mount();
      window.Aud && Aud.sync();
      apply(document.body);
      const co = document.getElementById('cob');
      if (co) co.hidden = true;
      if (window.Voice) Voice.stop();
      document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
    },
  };
  window.I18N = I18N;

  document.documentElement.lang = cur;
  loadFont();
  glossPatch();
  startObs();
  mount();
  if (cur !== 'id') apply(document.body);
})();
