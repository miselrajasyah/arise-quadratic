'use strict';

(() => {
  const app = document.getElementById('app'),
    site = document.getElementById('site');
  if (app && !app.hidden && DB.me && me()) route();
  else if (site && !site.hidden) showSite();
  document.addEventListener('langchange', () => {
    try {
      if (app && !app.hidden && DB.me && me()) {
        if (!typingNow()) route();
      } else if (site && !site.hidden) showSite();
      window.I18N && I18N.mount();
    } catch (e) {
      console.warn('langchange:', e);
    }
  });
})();
