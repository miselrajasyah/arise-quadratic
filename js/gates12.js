'use strict';

window.Gates = (() => {
  const L = { title: 80, q: 800, o: 200, exp: 600 };
  const clampXp = (v) => Math.max(5, Math.min(50, Math.round(+v) || 20));
  const str = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');
  const cloud = () => !!(window.Sync && Sync.isOn());

  function clean(d, id) {
    if (!d || typeof d.title !== 'string' || typeof d.q !== 'string' || !Array.isArray(d.o) || d.o.length !== 4) return null;
    if (!/^[A-Za-z0-9_-]{1,40}$/.test(String(id || d.id || ''))) return null;
    const o = d.o.map((x) => str(x, L.o));
    if (o.some((x) => !x) || !Number.isInteger(d.a) || d.a < 0 || d.a > 3) return null;
    return { id: String(id || d.id), title: str(d.title, L.title), q: str(d.q, L.q), o, a: d.a, exp: str(d.exp, L.exp), xp: clampXp(d.xp), on: d.on !== false, by: str(d.by, 24), uid: str(d.uid, 60), ts: +d.ts || 0 };
  }
  const all = () =>
    (cloud() ? Sync.gates() : DB.gates || [])
      .map((g) => clean(g, g.id))
      .filter(Boolean)
      .sort((a, b) => b.ts - a.ts);
  const active = () => all().filter((g) => g.on);
  const cg = (u, id) => (u && u.cg && u.cg[id]) || null;
  const unsolved = (u) => active().filter((g) => !(cg(u, g.id) || {}).done);

  const badge = () => {
    try {
      const n = me().role === 'student' ? unsolved(me()).length : 0;
      return n ? ` <span class="nbadge">${n}</span>` : '';
    } catch (e) {
      return '';
    }
  };
  const seen = new Set();
  function notify() {
    try {
      const u = me();
      if (!u || u.role !== 'student') return;
      const fresh = unsolved(u).filter((g) => !seen.has(g.id));
      fresh.forEach((g) => seen.add(g.id));
      if (fresh.length && window.Sys) Sys.pop(T2('bm_toast', { n: fresh.length }), 'good', 3200);
      const a = document.querySelector('#nav a[data-go="#/bonus"]');
      if (a) {
        const old = a.querySelector('.nbadge');
        old && old.remove();
        a.insertAdjacentHTML('beforeend', badge());
      }
    } catch (e) {

    }
  }
  const letters = 'ABCD';
  const rich = (s) => esc(s).replace(/\n/g, '<br>');

  let BM = null;
  V.bonus = () => `<div class="sys rv"><small class="tag">${T2('bm_tag')}</small><h2>${T2('bm_title')}</h2><p class="mut">${T2('bm_intro')}</p></div><div id="bmz"></div>`;
  V.bonus.post = () => paintBonus();
  function paintBonus() {
    const z = document.getElementById('bmz');
    if (!z) return;
    const u = me(),
      g = BM && active().find((x) => x.id === BM);
    if (BM && !g) BM = null;
    if (g) return mission(z, u, g);
    const list = active();
    z.innerHTML = list.length
      ? list
          .map((x) => {
            const r = cg(u, x.id),
              st = r && r.done ? (r.ok ? `<span class="tagc" style="border-color:var(--gr);color:var(--gr)">${T2('bm_done')}</span>` : `<span class="tagc">${T2('bm_failed')}</span>`) : `<span class="tagc bmnew">${T2('bm_new')}</span>`;
            return `<div class="card rv bmcard"><div><b>${esc(x.title)}</b> ${st}</div><div class="mut sm">${T2('bm_reward', { n: x.xp })}${x.by ? ' | ' + T2('bm_by', { n: esc(x.by) }) : ''}</div><p style="margin-top:8px"><button class="btn ${r && r.done ? 'ghost' : ''}" data-bm="${x.id}">${r && r.done ? T2('bm_review') : T2('bm_open')}</button></p></div>`;
          })
          .join('')
      : `<div class="card mut">${T2('bm_empty')}</div>`;
    z.querySelectorAll('[data-bm]').forEach((b) => (b.onclick = () => ((BM = b.dataset.bm), paintBonus(), scrollTo(0, 0))));
  }
  function mission(z, u, g) {
    const r = cg(u, g.id) || { att: 0 },
      done = !!r.done,
      ord = shuf(4, g.id + (DB.me || '')),
      lim = 2;
    const opts = ord
      .map((j, x) => {
        const cls = done ? (j === g.a ? 'rgok' : r.pick === j ? 'rgbad' : '') : '';
        return `<label class="${cls}"><input type="radio" name="bmq" value="${j}" ${done ? 'disabled' : ''}><span>${letters[x]}. ${rich(g.o[j])}</span></label>`;
      })
      .join('');
    z.innerHTML = `<div class="card rv"><div class="item ${done ? (r.ok ? 'ok' : 'bad') : ''}"><h4>${esc(g.title)}</h4><p>${rich(g.q)}</p><div class="opts">${opts}</div>${
      done
        ? `<p class="res">${r.ok ? T2('bm_ok', { n: r.xp || 0 }) : T2('bm_final') + rich(g.o[g.a])}</p>${g.exp ? `<p class="exp"><b>${T2('bm_explain')}</b> ${rich(g.exp)}</p>` : ''}`
        : `<button class="btn" id="bmc">${T2('bm_check')} <small>(${lim - (r.att || 0)})</small></button><p class="res" id="bmr"></p>`
    }</div><p style="margin-top:10px"><button class="btn ghost" id="bmb">${T2('bm_back')}</button></p></div>`;
    z.querySelector('#bmb').onclick = () => ((BM = null), paintBonus());
    const c = z.querySelector('#bmc');
    if (c)
      c.onclick = () => {
        const s = z.querySelector('input[name=bmq]:checked');
        if (!s) return toast(T2('bm_pickfirst'));
        const pick = +s.value,
          ok = pick === g.a,
          rec = (u.cg = u.cg || {}),
          x = (rec[g.id] = rec[g.id] || { att: 0 });
        x.att++;
        x.pick = pick;
        if (ok || x.att >= lim) {
          x.done = 1;
          x.ok = ok ? 1 : 0;
          x.xp = ok ? (x.att === 1 ? g.xp : Math.round(g.xp * 0.6)) : 0;
          x.ts = Date.now();
          if (ok) {
            u.bonus = (u.bonus || 0) + x.xp;
            window.AU && AU.sfx('ok');
            window.burst && burst(c);
            window.Sys && Sys.pop(T2('bm_ok', { n: x.xp }), 'good');
          } else window.AU && AU.sfx('bad');
          save();
          paintBonus();
          notify();
        } else {
          save();
          window.AU && AU.sfx('bad');
          const rr = z.querySelector('#bmr');
          rr.textContent = T2('bm_retry', { n: lim - x.att });
          c.querySelector('small').textContent = '(' + (lim - x.att) + ')';
          z.querySelectorAll('input').forEach((i) => (i.checked = false));
        }
      };
  }

  const blank = () => ({ title: '', q: '', o: ['', '', '', ''], a: 0, exp: '', xp: 20 });
  let DRAFT = blank(),
    ED = null;
  const gid = () => 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  V.gatebuilder = () => {
    const d = DRAFT,
      xps = [10, 20, 30, 40, 50];
    return `<div class="sys rv"><small class="tag">${T2('gb_tag')}</small><h2>${T2('gb_title')}</h2><p class="mut">${T2('gb_intro')}</p><p class="mut sm">${cloud() ? T2('gb_cloud') : T2('gb_local')}</p></div>
<div class="grid2"><div class="card rv gbform"><label>${T2('gb_f_title')}<input id="gbt" maxlength="${L.title}" placeholder="${esc(T2('gb_ph_title'))}" value="${esc(d.title)}"></label>
<label>${T2('gb_f_q')}<textarea id="gbq" rows="4" maxlength="${L.q}" placeholder="${esc(T2('gb_ph_q'))}">${esc(d.q)}</textarea></label>
${[0, 1, 2, 3].map((i) => `<div class="gbopt"><input type="radio" name="gbk" value="${i}" ${d.a === i ? 'checked' : ''} aria-label="${esc(T2('gb_f_key'))} ${letters[i]}"><label>${T2('gb_f_opt', { l: letters[i] })}<input class="gbo" data-i="${i}" maxlength="${L.o}" placeholder="${esc(T2('gb_ph_opt'))}" value="${esc(d.o[i])}"></label></div>`).join('')}
<p class="mut sm">${T2('gb_f_key')}: <b id="gbkl">${letters[d.a]}</b></p>
<label>${T2('gb_f_exp')}<textarea id="gbe" rows="2" maxlength="${L.exp}" placeholder="${esc(T2('gb_ph_exp'))}">${esc(d.exp)}</textarea></label>
<label>${T2('gb_f_xp')}<select id="gbx">${xps.map((x) => `<option value="${x}" ${d.xp === x ? 'selected' : ''}>${x} XP</option>`).join('')}</select></label>
<p class="err" id="gber" role="alert"></p>
<p style="margin-top:10px"><button class="btn" id="gbs">${ED ? T2('gb_update') : T2('gb_save')}</button> ${ED ? `<button class="btn ghost" id="gbc">${T2('gb_cancel')}</button>` : ''}</p></div>
<div class="card rv"><h3>${T2('gb_preview')}</h3><div id="gbp"></div></div></div>
<h3 class="rv" style="margin:18px 0 8px">${T2('gb_list')}</h3><div id="gbl"></div>`;
  };
  V.gatebuilder.post = () => {
    const $q = (s) => document.querySelector(s),
      sync = () => {
        DRAFT.title = $q('#gbt').value;
        DRAFT.q = $q('#gbq').value;
        DRAFT.exp = $q('#gbe').value;
        DRAFT.xp = +$q('#gbx').value;
        document.querySelectorAll('.gbo').forEach((e) => (DRAFT.o[+e.dataset.i] = e.value));
        const k = document.querySelector('input[name=gbk]:checked');
        DRAFT.a = k ? +k.value : 0;
        $q('#gbkl').textContent = letters[DRAFT.a];
        preview();
      };
    ['#gbt', '#gbq', '#gbe', '#gbx'].forEach((s) => $q(s).addEventListener('input', sync));
    document.querySelectorAll('.gbo,input[name=gbk]').forEach((e) => e.addEventListener('input', sync));
    $q('#gbs').onclick = save1;
    $q('#gbc') && ($q('#gbc').onclick = () => ((ED = null), (DRAFT = blank()), route()));
    preview();
    paintList();
  };
  function preview() {
    const p = document.getElementById('gbp');
    if (!p) return;
    const d = DRAFT;
    if (!d.title && !d.q && !d.o.some(Boolean)) {
      p.innerHTML = `<p class="mut">${T2('gb_prev_empty')}</p>`;
      return;
    }
    p.innerHTML = `<div class="item"><h4>${esc(d.title || '...')}</h4><p>${rich(d.q)}</p><div class="opts">${d.o.map((o, i) => `<label class="${i === d.a ? 'rgok' : ''}"><input type="radio" disabled ${i === d.a ? 'checked' : ''}><span>${letters[i]}. ${rich(o)}</span></label>`).join('')}</div>${d.exp ? `<p class="exp"><b>${T2('bm_explain')}</b> ${rich(d.exp)}</p>` : ''}</div>`;
  }
  const verr = (m) => {
    const e = document.getElementById('gber');
    if (e) e.textContent = m || '';
    return !m;
  };
  function validate(d) {
    const t = d.title.trim(),
      q = d.q.trim(),
      o = d.o.map((x) => x.trim());
    if (t.length < 3) return T2('gb_e_title');
    if (q.length < 5) return T2('gb_e_q');
    if (o.some((x) => !x) || new Set(o.map((x) => x.toLowerCase())).size !== 4) return T2('gb_e_opt');
    if (t.length > L.title || q.length > L.q || o.some((x) => x.length > L.o) || d.exp.trim().length > L.exp) return T2('gb_e_len');
    return '';
  }
  function save1() {
    const d = DRAFT,
      msg = validate(d);
    if (msg) return verr(msg), window.AU && AU.sfx('bad');
    verr('');
    const old = ED && all().find((g) => g.id === ED),
      g = {
        id: ED || gid(),
        title: d.title.trim(),
        q: d.q.trim(),
        o: d.o.map((x) => x.trim()),
        a: d.a,
        exp: d.exp.trim(),
        xp: clampXp(d.xp),
        on: old ? old.on : true,
        by: DB.me,
        uid: old && old.uid ? old.uid : (window.Cloud && Cloud.uid) || '',
        ts: old ? old.ts : Date.now(),
      };
    const done = () => {
      const upd = !!ED;
      ED = null;
      DRAFT = blank();
      toast(T2(upd ? 'gb_updated' : 'gb_saved'));
      window.AU && AU.sfx('up');
      route();
    };
    if (cloud()) {
      const b = document.getElementById('gbs');
      b && (b.disabled = true);
      Sync.gateSave(g).then(done, (e) => {
        console.warn('gate gagal', e);
        b && (b.disabled = false);
        verr(T2('gb_fail'));
      });
    } else {
      const l = (DB.gates = DB.gates || []),
        i = l.findIndex((x) => x.id === g.id);
      i >= 0 ? (l[i] = g) : l.push(g);
      save();
      done();
    }
  }
  function stats(id) {
    let a = 0,
      b = 0;
    Object.values(DB.users || {}).forEach((u) => {
      if (u.role !== 'student') return;
      const r = cg(u, id);
      if (r && r.att) a++;
      if (r && r.ok) b++;
    });
    return T2('gb_stats', { a, b });
  }
  function paintList() {
    const z = document.getElementById('gbl');
    if (!z) return;
    const l = all();
    z.innerHTML = l.length
      ? l
          .map(
            (g) =>
              `<div class="card gbrow ${g.on ? '' : 'gboff'}"><div><b>${esc(g.title)}</b> ${g.on ? '' : `<span class="tagc">${T2('gb_inactive')}</span>`}</div><div class="mut sm">${rich(g.q.length > 140 ? g.q.slice(0, 140) + '...' : g.q)}</div><div class="mut sm">${T2('bm_reward', { n: g.xp })} | ${stats(g.id)}</div><p style="margin-top:8px"><button class="btn ghost" data-ge="${g.id}">${T2('gb_edit')}</button> <button class="btn ghost" data-gt="${g.id}">${g.on ? T2('gb_off') : T2('gb_on')}</button> <button class="btn ghost" data-gd="${g.id}">${T2('gb_del')}</button></p></div>`,
          )
          .join('')
      : `<div class="card mut">${T2('gb_empty')}</div>`;
    z.querySelectorAll('[data-ge]').forEach(
      (b) =>
        (b.onclick = () => {
          const g = all().find((x) => x.id === b.dataset.ge);
          if (!g) return;
          ED = g.id;
          DRAFT = { title: g.title, q: g.q, o: g.o.slice(), a: g.a, exp: g.exp, xp: g.xp };
          route();
        }),
    );
    z.querySelectorAll('[data-gt]').forEach((b) => (b.onclick = () => toggle(b.dataset.gt)));
    z.querySelectorAll('[data-gd]').forEach((b) => (b.onclick = () => remove(b.dataset.gd)));
  }
  function toggle(id) {
    const g = all().find((x) => x.id === id);
    if (!g) return;
    if (cloud()) Sync.gateSave(Object.assign({}, g, { on: !g.on })).catch(() => toast(T2('gb_fail')));
    else {
      const x = (DB.gates || []).find((y) => y.id === id);
      if (x) x.on = !g.on;
      save();
      paintList();
    }
  }
  function remove(id) {
    if (!confirm(T2('gb_confirm_del'))) return;
    if (ED === id) {
      ED = null;
      DRAFT = blank();
    }
    if (cloud()) Sync.gateDel(id).then(() => toast(T2('gb_deleted')), () => toast(T2('gb_fail')));
    else {
      DB.gates = (DB.gates || []).filter((g) => g.id !== id);
      save();
      toast(T2('gb_deleted'));
      paintList();
    }
  }

  function onChange() {
    const h = location.hash || '';
    if (/^#\/gatebuilder/.test(h)) paintList();
    else if (/^#\/bonus/.test(h) && !BM) paintBonus();
    notify();
  }
  return { clean, all, active, unsolved, badge, notify, onChange, validate, blank, state: () => ({ DRAFT, ED }) };
})();

addEventListener('hashchange', () => setTimeout(() => window.Gates && Gates.notify(), 500));
setTimeout(() => window.Gates && Gates.notify(), 1800);
