'use strict';

(() => {
  const box = document.getElementById('audio');
  if (!box || document.getElementById('abx')) return;
  const KEY = 'ad_audmin';
  const ls = {
    get() {
      try {
        return localStorage.getItem(KEY);
      } catch (e) {
        return null;
      }
    },
    set(v) {
      try {
        localStorage.setItem(KEY, v);
      } catch (e) {

      }
    },
  };
  const b = document.createElement('button');
  b.id = 'abx';
  b.type = 'button';
  b.className = 'abx';
  b.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>';
  const apply = (min) => {
    box.classList.toggle('min', min);
    document.body.classList.toggle('audopen', !min);
    b.setAttribute('aria-expanded', min ? 'false' : 'true');
    const t = min ? 'Buka panel suara' : 'Perkecil panel suara';
    b.title = t;
    b.setAttribute('aria-label', t);
    const m = document.getElementById('bmenu');
    if (m && min) m.hidden = true;
  };

  const phone = () => !!(window.matchMedia && matchMedia('(max-width:768px)').matches);
  let min = ls.get();
  min = phone() ? true : min == null ? false : min === '1';
  box.prepend(b);
  apply(min);
  b.addEventListener('click', () => {
    min = !box.classList.contains('min');
    !phone() && ls.set(min ? '1' : '0');
    apply(min);
  });

  setInterval(() => b.classList.toggle('live', !!(window.AU && AU.mus)), 1500);
})();

document.addEventListener('langchange', () => {
  if (!window.Gloss) return;
  Gloss.mountButton();
  const m = document.getElementById('glm');
  if (m) {
    const open = !m.hidden;
    m.remove();
    if (open) Gloss.open('open');
  }
});
