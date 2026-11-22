'use strict';

window.Gm247 = (() => {
  const T = (k, v) => window.T247(k, v);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const tt = (s) => (window.I18N && I18N.t ? I18N.t(s) : s);
  const isT = () => {
    try {
      return !!(DB.me && me() && me().role === 'teacher');
    } catch (e) {
      return false;
    }
  };
  const reduced = () => (typeof DB !== 'undefined' && DB && DB.rm) || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  const WING = 'M0 0 L-26 -84 L-116 -150 Q-108 -114 -130 -102 L-154 -100 Q-138 -74 -146 -54 L-162 -44 Q-122 -42 -98 -24 Q-62 -10 -30 12Z';
  const FING = 'M-26 -84 L-130 -102 M-26 -84 L-146 -54 M-26 -84 L-116 -150';
  const kaiInner = (cls) =>
    `<defs><linearGradient id="kmem${cls}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22104d"/><stop offset="1" stop-color="#06030f"/></linearGradient><linearGradient id="kbody${cls}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#07030f"/><stop offset="1" stop-color="#1a0d3a"/></linearGradient></defs>` +
    `<g transform="translate(246 122)"><g class="kwr kwr-far"><path d="${WING}" fill="#0b0524" stroke="#5a30b8" stroke-width="2" stroke-linejoin="round"/><path d="${FING}" stroke="#2e1766" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>` +
    `<path d="M436 120 L402 102 Q384 92 366 94 Q340 98 318 120 Q272 104 214 108 Q170 110 150 120 Q104 118 68 136 Q44 146 30 146 L6 130 L0 154 L10 170 L36 158 Q74 162 108 150 Q140 142 162 150 Q202 172 264 168 Q306 162 324 140 Q346 128 372 124 L422 130Z" fill="url(#kbody${cls})"/>` +
    '<path d="M214 108 l8 -14 l8 14 M244 106 l8 -14 l8 14 M274 108 l8 -14 l8 14 M304 114 l7 -13 l7 13 M184 110 l8 -12 l8 12 M154 118 l8 -12 l8 12" fill="#07030f" stroke="#5a30b8" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<path d="M368 94 L344 58 L376 86Z M384 98 L372 64 L398 98Z" fill="#07030f" stroke="#7c4be0" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M168 150 Q146 170 122 178 L132 186 Q158 178 176 164Z M300 152 Q316 172 336 178 L328 188 Q304 184 288 166Z" fill="#07030f"/>' +
    '<path d="M122 178 l-12 8 M132 186 l-8 12 M336 178 l10 8 M328 188 l4 12" stroke="#07030f" stroke-width="3.2" stroke-linecap="round"/>' +
    `<g transform="translate(280 120)"><g class="kwr kwr-near"><path d="${WING}" fill="url(#kmem${cls})" stroke="#a46bff" stroke-width="2.6" stroke-linejoin="round" transform="scale(1.12)"/><path d="${FING}" stroke="#5a30b8" stroke-width="3.6" fill="none" stroke-linecap="round" transform="scale(1.12)"/></g></g>` +
    '<circle cx="398" cy="108" r="3.4" fill="#7df9ff"/><circle cx="398" cy="108" r="7.5" fill="#7df9ff" opacity=".32"/>';
  const kaiSVG = (cls) => `<svg class="${cls}" viewBox="-10 -90 470 340" aria-hidden="true" focusable="false">${kaiInner(cls)}</svg>`;

  const emblem = () =>
    '<svg class="gem247" viewBox="0 0 120 132" role="img" aria-label="Guild System Advisor"><defs>' +
    '<linearGradient id="gmGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset=".45" stop-color="#ffd86b"/><stop offset="1" stop-color="#a9791c"/></linearGradient>' +
    '<linearGradient id="gmViol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7b45e8"/><stop offset="1" stop-color="#2a1263"/></linearGradient>' +
    '<radialGradient id="gmGem" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#fff7d6"/><stop offset=".35" stop-color="#ffd86b"/><stop offset=".7" stop-color="#b46bff"/><stop offset="1" stop-color="#4a1f9e"/></radialGradient>' +
    '<radialGradient id="gmHalo" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#b46bff" stop-opacity=".55"/><stop offset="1" stop-color="#b46bff" stop-opacity="0"/></radialGradient></defs>' +
    '<circle class="gem-halo" cx="60" cy="72" r="58" fill="url(#gmHalo)"/>' +
    '<path d="M60 22 L104 42 V86 Q104 104 60 124 Q16 104 16 86 V42Z" fill="url(#gmViol)" stroke="url(#gmGold)" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M60 31 L95 47 V84 Q95 98 60 114 Q25 98 25 84 V47Z" fill="#12082e" stroke="#b46bff" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path class="gem-core" d="M60 44 L80 72 L60 102 L40 72Z" fill="url(#gmGem)" stroke="url(#gmGold)" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M40 72 H80 M60 44 L52 72 L60 102 M60 44 L68 72 L60 102" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>' +
    '<path d="M36 28 L40 10 L50 20 L60 4 L70 20 L80 10 L84 28Z" fill="url(#gmGold)" stroke="#7a560f" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<circle cx="40" cy="10" r="2.6" fill="#b46bff"/><circle cx="60" cy="4" r="3" fill="#fff0b8"/><circle cx="80" cy="10" r="2.6" fill="#b46bff"/>' +
    '<path class="gem-spark" d="M98 32 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#fff0b8"/></svg>';

  const coText = (short) => {
    const s = Co.on() ? 'ON' : 'OFF';
    if (isT()) return T(short ? 'set_adv_short' : 'set_adv', { s });
    return (short ? 'Teman: ' : 'Teman pendamping: ') + s;
  };

  let panel = null,
    open = false,
    seq = 0;

  const classData = () => {
    const all = typeof students === 'function' ? students() : [];
    const list = window.Cls ? Cls.filter(all, 'class') : all;
    const v = window.Cls ? Cls.sel('class') : '*';
    return { list, v };
  };
  const bossHp = (b) => {
    try {
      const st = WBoss.state();
      if (!st || st.bid !== b.id || !Array.isArray(st.hits)) return null;
      const d = st.hits.reduce((a, h) => a + (+h.dmg || 0), 0);
      return Math.max(0, Math.min(100, Math.round((100 * (b.maxHp - d)) / b.maxHp)));
    } catch (e) {
      return null;
    }
  };
  const analyse = () => {
    const { list, v } = classData(),
      n = list.length,
      has = (s, c) => !!(s.done && s.done[c]);
    const pre = list.filter((s) => has(s, 'P')).length,
      post = list.filter((s) => has(s, 'T')).length;
    const ranks = AX.map((r) => {
      const sc = list.filter((s) => has(s, r.c)).map((s) => s.done[r.c].score);
      return { r, k: sc.length, avg: sc.length ? sc.reduce((a, b) => a + b, 0) / sc.length : null };
    })
      .filter((x) => x.k > 0)
      .sort((a, b) => a.avg - b.avg);
    let wb = [];
    try {
      wb = window.WBoss ? WBoss.choices().filter((b) => b.status === 'active' && (v === '*' || !b.cls || b.cls === v)) : [];
    } catch (e) {
      wb = [];
    }
    return { v, n, pre, post, low: ranks[0] || null, wb };
  };

  const bar = (a, n) => `<span class="gadv-bar" aria-hidden="true"><i style="width:${n ? Math.round((100 * a) / n) : 0}%"></i></span>`;
  const sec = (icon, title, body) => `<section class="gadv-sec"><h5><i>${IC(icon)}</i>${esc(title)}</h5>${body}</section>`;

  const head = (scope) =>
    `<div class="gadv-hd"><span class="gadv-crest">${IC('crown')}</span><div><small>[ SYSTEM ]</small><h4>${esc(T('adv_title'))}</h4><p>${esc(T('adv_name'))}${scope ? ' · ' + esc(scope) : ''}</p></div><button type="button" class="gadv-x" data-gadv="close" aria-label="${esc(T('adv_close'))}" title="${esc(T('adv_close'))}">&times;</button></div>`;

  const body = (d) => {
    const wbHtml = d.wb.length
      ? `<p>${esc(T('adv_wb_on', { n: d.wb.length, names: d.wb.map((b) => b.name).join(', ') }))}</p>` +
        d.wb
          .map((b) => ({ b, p: bossHp(b) }))
          .filter((x) => x.p != null)
          .map((x) => `<p class="gadv-sub">${esc(x.b.name)}: ${esc(T('adv_wb_hp', { p: x.p }))}</p>`)
          .join('')
      : `<p>${esc(T('adv_wb_off'))}</p>`;
    if (!d.n) return `<p>${esc(T('adv_empty'))}</p>` + sec('swords', T('adv_sec_wb'), wbHtml);
    const row = (label, a) => `<div class="gadv-row"><b>${esc(label)}</b>${bar(a, d.n)}<p>${esc(T('adv_done', { a, b: d.n - a, n: d.n }))}</p></div>`;
    const rankHtml = d.low
      ? `<p>${esc(T('adv_rank_low', { r: d.low.r.n, t: tt(d.low.r.t), s: Math.round(d.low.avg), k: d.low.k }))}</p>`
      : `<p>${esc(T('adv_rank_none'))}</p>`;
    const rec = [];
    if (d.n - d.pre > 0) rec.push(T('adv_rec_pre', { n: d.n - d.pre }));
    if (d.n - d.post > 0) rec.push(T('adv_rec_post', { n: d.n - d.post }));
    if (d.low) rec.push(T('adv_rec_rank', { r: d.low.r.n }));
    if (!d.wb.length) rec.push(T('adv_rec_wb'));
    if (!rec.length) rec.push(T('adv_rec_ok'));
    return (
      sec('radar', T('adv_sec_test'), row(T('adv_pre'), d.pre) + row(T('adv_post'), d.post)) +
      sec('book', T('adv_sec_rank'), rankHtml) +
      sec('swords', T('adv_sec_wb'), wbHtml) +
      sec('star', T('adv_sec_rec'), `<ul>${rec.slice(0, 4).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`)
    );
  };

  const scopeLabel = (v) => T('adv_scope', { c: v === '*' ? T('adv_all') : v });
  const foot = () => `<div class="gadv-ft"><button type="button" class="btn ghost" data-gadv="refresh">${esc(T('adv_refresh'))}</button></div>`;

  const ensure = () => {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'gadv';
    panel.className = 'gadv';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-live', 'polite');
    panel.setAttribute('aria-label', T('adv_title'));
    panel.setAttribute('data-no-i18n', '');
    document.body.appendChild(panel);
    panel.addEventListener('click', (e) => {
      const b = e.target.closest('[data-gadv]');
      if (!b) return;
      if (b.dataset.gadv === 'close') close();
      if (b.dataset.gadv === 'refresh') show();
    });
    return panel;
  };
  const render = () => {
    if (!panel || !open) return;
    const d = analyse();
    panel.setAttribute('aria-label', T('adv_title'));
    panel.innerHTML = head(scopeLabel(d.v)) + `<div class="gadv-body">${body(d)}</div>` + foot();
  };
  const show = async () => {
    if (!isT()) return;
    const p = ensure(),
      my = ++seq;
    open = true;
    p.hidden = false;
    p.innerHTML = head('') + `<div class="gadv-body"><p class="gadv-load">${esc(T('adv_load'))}</p></div>`;
    try {
      if (window.Cloud && Cloud.others) await Promise.race([Cloud.others(true), new Promise((r) => setTimeout(r, 3500))]);
    } catch (e) {
      console.warn('advisor sync', e);
    }
    if (my === seq && open) render();
  };
  const close = () => {
    open = false;
    seq++;
    if (panel) panel.hidden = true;
  };
  const toggle = () => (open ? close() : show());

  document.addEventListener('click', (e) => {
    if (open && !e.target.closest('#gadv, #cof')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) close();
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.id === 'cof' && Co.advisor()) {
      e.preventDefault();
      toggle();
    }
  });
  addEventListener('hashchange', close);
  document.addEventListener('langchange', () => open && render());

  const helpView = () => {
    const steps = ['gh_i1', 'gh_i2', 'gh_i3', 'gh_i4', 'gh_i5', 'gh_i6'].map((k) => `<li>${T(k)}</li>`).join('');
    const cur = AX.map((r) => `<tr><td>${r.n}</td><td>${r.t}</td><td>${esc(T('gh_f_' + r.c))}</td><td>${r.xp}</td></tr>`).join('');
    const ng = [
      ['lo', 'gh_ng_low', 'gh_ng_low_r'],
      ['md', 'gh_ng_mid', 'gh_ng_mid_r'],
      ['hi', 'gh_ng_high', 'gh_ng_high_r'],
    ]
      .map((x) => `<tr><td><span class="ngc ngc-${x[0]}">${esc(T(x[1]))}</span></td><td>${esc(T(x[2]))}</td></tr>`)
      .join('');
    return (
      `<div class="sys rv"><small class="tag">[ SYSTEM ] ${esc(T('gh_tag'))}</small><h2>${esc(T('gh_title'))}</h2><ul class="l gm-steps">${steps}</ul></div>` +
      `<div class="grid2"><div class="card rv gm-ref"><h3>${esc(T('gh_cur'))}</h3><div class="tblw"><table><tr><th>${esc(T('gh_c_rank'))}</th><th>${esc(T('gh_c_topic'))}</th><th>${esc(T('gh_c_focus'))}</th><th>${esc(T('gh_c_xp'))}</th></tr>${cur}</table></div><p class="mut sm">${esc(T('gh_layers'))}</p></div>` +
      `<div class="card rv gm-ref"><h3>${esc(T('gh_ng'))}</h3><table><tr><th>${esc(T('gh_ng_cat'))}</th><th>${esc(T('gh_ng_rng'))}</th></tr>${ng}</table><p class="mut sm">${esc(T('gh_ng_f'))}</p></div>` +
      '<div class="card rv ice-opt-lab"><small class="tag">[ SYSTEM ] LAB EKSPLORASI OPSIONAL</small><h3>GeoGebra Classroom</h3><p class="mut">GeoGebra Classroom untuk bereksplorasi lebih bebas. Tidak wajib dan tidak memengaruhi XP.</p><p><button class="btn ghost" data-go="#/ggb">Buka Lab Eksplorasi</button></p></div></div>'
    );
  };

  const codeBox = () =>
    isT() && typeof TEACHER_CODE === 'string'
      ? `<div class="tcode247"><small class="tag">[ SYSTEM ] ${esc(T('set_code_t'))}</small><p class="tcv"><b>${esc(TEACHER_CODE)}</b></p><p class="mut sm">${esc(T('set_code_d'))}</p></div>`
      : '';

  const skySVG = () =>
    `<g class="ksky247" aria-hidden="true"><g class="ksky-fly"><svg x="0" y="0" width="86" height="62" viewBox="-10 -90 470 340" overflow="visible">${kaiInner('sk')}</svg></g></g>`;

  let busy = false;
  const GATE = /^#\/(rank\/[0-9A-Za-z]+|redgate|worldboss)$/;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

  const fly = (done) => {
    if (busy) return;
    if (reduced()) return done();
    busy = true;
    const el = document.createElement('div');
    el.className = 'kfx247';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<canvas></canvas>${kaiSVG('kfx-dragon')}`;
    document.body.appendChild(el);
    const cv = el.querySelector('canvas'),
      dr = el.querySelector('.kfx-dragon'),
      near = dr.querySelector('.kwr-near'),
      far = dr.querySelector('.kwr-far'),
      dpr = Math.min(1.5, window.devicePixelRatio || 1),
      W = innerWidth,
      H = innerHeight,
      cx = cv.getContext('2d');
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    const dw = clamp(W * 0.86, 260, 640),
      dh = (dw * 340) / 470,
      P0 = [-0.34 * W, 0.98 * H],
      P1 = [0.42 * W, 0.7 * H],
      P2 = [1.36 * W, -0.06 * H],
      at = (p) => [(1 - p) * (1 - p) * P0[0] + 2 * (1 - p) * p * P1[0] + p * p * P2[0], (1 - p) * (1 - p) * P0[1] + 2 * (1 - p) * p * P1[1] + p * p * P2[1]],
      D = 1200,
      parts = [];
    dr.style.width = dw + 'px';
    dr.style.height = dh + 'px';
    let called = false,
      fin = false,
      t0 = 0,
      last = 0;
    const go = () => {
      if (called) return;
      called = true;
      try {
        done();
      } catch (e) {
        console.warn('kaisel go', e);
      }
    };
    const end = () => {
      if (fin) return;
      fin = true;
      go();
      el.remove();
      busy = false;
    };
    const frame = (now) => {
      if (fin) return;
      if (!t0) t0 = last = now;
      const t = clamp((now - t0) / D, 0, 1),
        dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = clamp(t / 0.86, 0, 1),
        q = ease(p) * 0.6 + p * 0.4,
        [x, y] = at(q),
        [nx, ny] = at(clamp(q + 0.02, 0, 1)),
        ang = clamp((Math.atan2(ny - y, nx - x) * 180) / Math.PI, -60, 30),
        ph = t * Math.PI * 2 * 4.6,
        sc = 0.9 + 0.2 * Math.sin(p * Math.PI);
      near.setAttribute('transform', `rotate(${(-12 + 36 * Math.sin(ph)).toFixed(1)})`);
      far.setAttribute('transform', `rotate(${(-10 + 36 * Math.sin(ph + 0.55)).toFixed(1)})`);
      dr.style.transform = `translate(${(x - dw / 2).toFixed(1)}px,${(y - dh / 2).toFixed(1)}px) rotate(${ang.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
      dr.style.opacity = t > 0.78 ? String(clamp(1 - (t - 0.78) / 0.12, 0, 1)) : '1';

      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.clearRect(0, 0, W, H);
      const mx = x - Math.cos((ang * Math.PI) / 180) * dw * 0.1,
        my = y - Math.sin((ang * Math.PI) / 180) * dw * 0.1;
      if (t < 0.86) {
        for (let i = 0; i < 5; i++)
          parts.push({
            x: mx + (Math.random() - 0.5) * dw * 0.45,
            y: my + (Math.random() - 0.3) * dh * 0.3,
            vx: -(x - nx) * 14 + (Math.random() - 0.5) * 60,
            vy: -(y - ny) * 14 - 30 - Math.random() * 60,
            r: 6 + Math.random() * 12,
            l: 0.45 + Math.random() * 0.45,
            a: 0,
            k: Math.random() < 0.55 ? 0 : 1,
          });
        const g = cx.createRadialGradient(x, y, 0, x, y, dw * 0.55);
        g.addColorStop(0, 'rgba(154,90,255,0.4)');
        g.addColorStop(0.5, 'rgba(60,20,120,0.22)');
        g.addColorStop(1, 'rgba(10,2,24,0)');
        cx.fillStyle = g;
        cx.fillRect(x - dw * 0.6, y - dw * 0.6, dw * 1.2, dw * 1.2);
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        const s = parts[i];
        s.a += dt;
        if (s.a > s.l) {
          parts.splice(i, 1);
          continue;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const k = 1 - s.a / s.l;
        cx.globalAlpha = k * (s.k ? 0.5 : 0.7);
        cx.globalCompositeOperation = s.k ? 'source-over' : 'lighter';
        cx.fillStyle = s.k ? '#07020f' : k > 0.5 ? '#c58bff' : '#7b3df0';
        cx.beginPath();
        cx.arc(s.x, s.y, s.r * (1.4 - k * 0.6), 0, 6.283);
        cx.fill();
      }
      cx.globalAlpha = 1;
      cx.globalCompositeOperation = 'source-over';

      const pt = clamp((t - 0.3) / 0.42, 0, 1);
      if (pt > 0) {
        const R = Math.hypot(W, H) * 0.56,
          r = (1 - Math.pow(1 - pt, 3)) * R,
          px = W / 2,
          py = H / 2;
        const pg = cx.createRadialGradient(px, py, 0, px, py, Math.max(1, r));
        pg.addColorStop(0, 'rgba(4,1,12,1)');
        pg.addColorStop(0.78, 'rgba(18,6,44,0.96)');
        pg.addColorStop(1, 'rgba(90,40,180,0.9)');
        cx.fillStyle = pg;
        cx.beginPath();
        cx.arc(px, py, r, 0, 6.283);
        cx.fill();
        cx.lineWidth = 5;
        cx.strokeStyle = '#c58bff';
        cx.shadowColor = '#9a5aff';
        cx.shadowBlur = 24;
        cx.beginPath();
        cx.arc(px, py, r, 0, 6.283);
        cx.stroke();
        cx.shadowBlur = 0;
        cx.lineWidth = 2;
        cx.strokeStyle = 'rgba(255,216,107,0.8)';
        cx.setLineDash([10, 14]);
        cx.lineDashOffset = -t * 260;
        cx.beginPath();
        cx.arc(px, py, r * 0.9, 0, 6.283);
        cx.stroke();
        cx.setLineDash([]);
      }
      if (t > 0.64 && t < 0.74) {
        cx.fillStyle = `rgba(214,190,255,${0.55 * (1 - Math.abs(t - 0.69) / 0.05)})`;
        cx.fillRect(0, 0, W, H);
      }
      if (t >= 0.68) go();
      el.style.opacity = t > 0.8 ? String(clamp(1 - (t - 0.8) / 0.2, 0, 1)) : '1';
      if (t < 1) requestAnimationFrame(frame);
      else end();
    };
    requestAnimationFrame(frame);
    setTimeout(end, D + 700);
  };

  const enter = (hash) => (GATE.test(hash) ? fly(() => (location.hash = hash)) : (location.hash = hash));

  document.addEventListener(
    'click',
    (e) => {
      if (!/^#\/map(\/|$)/.test(location.hash)) return;
      const g = e.target.closest('[data-go]');
      if (!g || g.disabled || !GATE.test(g.dataset.go || '')) return;
      e.preventDefault();
      e.stopPropagation();
      enter(g.dataset.go);
    },
    true,
  );

  return { isT, emblem, coText, toggle, close, helpView, codeBox, skySVG, fly, enter };
})();
