'use strict';

(() => {
  const body = document.body;
  const view = () => (location.hash.replace(/^#\/?/, '').split('/')[0] || '').toLowerCase();
  const setView = () => (body.dataset.view = view());
  addEventListener('hashchange', setView);
  setView();

  const isField = (el) => !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && !/^(range|checkbox|radio|button|submit)$/.test(el.type || '');
  document.addEventListener('focusin', (e) => body.classList.toggle('typing', isField(e.target)));
  document.addEventListener('focusout', () => setTimeout(() => body.classList.toggle('typing', isField(document.activeElement)), 60));

  function wrapTables(root) {
    (root || document).querySelectorAll('table').forEach((t) => {
      if (t.parentElement && t.parentElement.classList.contains('tblw')) return;
      const w = document.createElement('div');
      w.className = 'tblw';
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }
  const centerNav = () => {
    const n = document.getElementById('nav'),
      a = n && n.querySelector('a.on');
    if (a && n.scrollWidth > n.clientWidth) n.scrollLeft = a.offsetLeft - (n.clientWidth - a.offsetWidth) / 2;
  };
  const start = () => {
    const v = document.getElementById('view'),
      n = document.getElementById('nav');
    if (v) {
      wrapTables(v);
      new MutationObserver(() => wrapTables(v)).observe(v, { childList: true, subtree: true });
    }
    if (n) {
      new MutationObserver(centerNav).observe(n, { childList: true });
      centerNav();
    }
  };
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', start) : start();
})();
