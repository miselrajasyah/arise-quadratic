(function () {
  const OPTS = {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
    throwOnError: false,
    strict: 'ignore',
    trust: false,
    ignoredClasses: ['no-math', 'katex'],
  };
  let obs = null,
    queue = new Set(),
    scheduled = false;

  function renderMath(root) {
    if (!window.renderMathInElement) return;
    const el = root || document.body;
    if (!el || !el.isConnected) return;
    if (el.closest && el.closest('.katex')) return;
    if ((el.textContent || '').indexOf('$') < 0) return;
    obs && obs.disconnect();
    try {
      window.renderMathInElement(el, OPTS);
    } catch (e) {
      console.warn('KaTeX:', e);
    }
    watch();
  }
  window.renderMath = renderMath;

  function flush() {
    scheduled = false;
    const list = [...queue];
    queue.clear();
    list.forEach((n) => {
      const el = n.nodeType === 1 ? n : n.parentElement;
      if (el) renderMath(el);
    });
  }
  function watch() {
    if (!obs) {
      obs = new MutationObserver((ms) => {
        ms.forEach((m) => {
          if (m.type === 'characterData') queue.add(m.target);
          else m.addedNodes.forEach((n) => (n.nodeType === 1 || n.nodeType === 3) && queue.add(n));
        });
        if (queue.size && !scheduled) {
          scheduled = true;

          Promise.resolve().then(flush);
        }
      });
    }
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  renderMath(document.body);
  watch();

  addEventListener('load', () => renderMath(document.body));
})();
