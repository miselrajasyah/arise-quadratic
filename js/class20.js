'use strict';

window.Cls = (() => {
  const RE = /^[\p{L}\p{N}][\p{L}\p{N} ._-]{0,15}$/u;

  const norm = (v) => {
    v = String(v || '').replace(/\s+/g, ' ').trim().toUpperCase().slice(0, 16);
    return RE.test(v) ? v : '';
  };
  const of = (u) => (u && u.cls) || '';
  const cmp = (a, b) => a.localeCompare(b, 'id', { numeric: true });

  const known = () =>
    [
      ...new Set(
        [...(window.CLASS_LIST || []).map(norm), ...Object.values(DB.users).filter((u) => u.role === 'student').map(of)].filter(Boolean),
      ),
    ].sort(cmp);
  const view = {};

  const sel = (page) => {
    const u = me(),
      v = view[page];
    if (v != null && (v === '*' || known().includes(v))) return v;
    return u && u.role === 'student' && of(u) ? of(u) : '*';
  };
  const filter = (list, page) => {
    const v = sel(page);
    return v === '*' ? list : list.filter((s) => of(s) === v);
  };
  const label = (c) => (c ? T2('cl_one', { c: esc(c) }) : T2('cl_all'));

  const bar = (page) => {
    const v = sel(page),
      mine = of(me());
    return `<div class="card clbar"><label>${T2('cl_filter')}<select data-clf="${page}"><option value="*"${v === '*' ? ' selected' : ''}>${T2('cl_all')}</option>${known()
      .map((c) => `<option value="${esc(c)}"${v === c ? ' selected' : ''}>${esc(c)}${c === mine ? ' ★' : ''}</option>`)
      .join('')}</select></label></div>`;
  };
  document.addEventListener('change', (e) => {
    const s = e.target.closest && e.target.closest('select[data-clf]');
    if (!s) return;
    view[s.dataset.clf] = s.value;
    route();
  });

  const chip = (u) => (u && u.role === 'student' && of(u) ? ` <small class="clchip" title="${esc(T2('cl_label'))}">${esc(of(u))}</small>` : '');
  function fill(c) {
    const u = me();
    u.cls = c;
    u.clsAt = Date.now();
    save();
    window.WBoss && WBoss.onBosses();
    route();
  }

  function ask(wajib) {
    const u = me();
    if (!u || u.role !== 'student' || document.getElementById('clm')) return;
    const m = document.createElement('div');
    m.id = 'clm';
    m.className = 'clm';
    m.innerHTML = `<form class="sys" role="dialog" aria-modal="true"><small class="tag">${T2('cl_tag')}</small><h3>${T2('cl_ask_h')}</h3><p class="mut sm">${T2('cl_ask_p')}</p>
<label>${T2('cl_label')}<input id="clmi" list="clml" maxlength="16" autocomplete="off" value="${esc(of(u))}" placeholder="${esc(T2('cl_ph'))}"></label><datalist id="clml">${known().map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
<p class="err" id="clme" role="alert"></p><p><button class="btn" type="submit">${T2('cl_save')}</button>${wajib ? '' : ` <button class="btn ghost" type="button" id="clmx">${T2('cl_cancel')}</button>`}</p></form>`;
    document.body.appendChild(m);
    const i = m.querySelector('#clmi');
    i.focus();
    m.querySelector('form').onsubmit = (e) => {
      e.preventDefault();
      const c = norm(i.value);
      if (!c) return (m.querySelector('#clme').textContent = T2('cl_err'));
      m.remove();
      fill(c);
      toast(T2('cl_saved', { c }));
    };
    const x = m.querySelector('#clmx');
    x && (x.onclick = () => m.remove());
  }

  const check = () => {
    const u = DB.me && me();
    u && u.role === 'student' && !of(u) && setTimeout(() => ask(true), 600);
  };
  return { norm, of, known, sel, filter, bar, chip, ask, check, label };
})();
