'use strict';

window.Forge = (() => {
  const T = (k, v) => T2(k, v);

  const MANA = {
    dg: 0.5,
    raidBase: 15,
    raidPer: 3,
    raidCap: 90,
    wb: 40,
    wbTop: 40,
  };
  const FX_KEYS = ['wbDmg', 'raidSec', 'xp', 'mana'];

  const ITEMS = [
    { id: 'fang', n: "Kasaka's Venom Fang", slot: 'w', rar: 'rare', price: 120, ic: 'dagger', m: 'rise', col: '#5dff9a', col2: '#1b9a55', fx: { wbDmg: 10 } },
    { id: 'knight', n: 'Knight Killer', slot: 'w', rar: 'rare', price: 240, ic: 'swords', m: 'twinkle', col: '#cfe3ff', col2: '#6f8fd8', fx: { xp: 6 } },
    { id: 'daggers', n: "Demon King's Daggers", slot: 'w', rar: 'epic', price: 480, ic: 'swords', m: 'flame', col: '#ff4d6d', col2: '#8a2bff', fx: { wbDmg: 15, raidSec: 3 } },
    { id: 'kamish', n: "Kamish's Wrath", slot: 'w', rar: 'legend', price: 900, ic: 'crown', m: 'flame', col: '#ffb347', col2: '#ff4d2e', fx: { wbDmg: 25, xp: 5 } },
    { id: 'orb', n: 'Orb of Avarice', slot: 'r', rar: 'rare', price: 200, ic: 'crystal', m: 'twinkle', col: '#ffd86b', col2: '#ff9a3d', fx: { mana: 20 } },
    { id: 'hourglass', n: 'Eternal Hourglass', slot: 'r', rar: 'rare', price: 160, ic: 'seal', m: 'orbit', col: '#7be8ff', col2: '#4d8bff', fx: { raidSec: 5 } },
    { id: 'crest', n: "Igris' Crimson Crest", slot: 'r', rar: 'epic', price: 300, ic: 'helm', m: 'ring', col: '#ff3b57', col2: '#b4122f', fx: { xp: 8 } },
    { id: 'signet', n: "Sovereign's Signet", slot: 'r', rar: 'legend', price: 650, ic: 'gate', m: 'orbit', col: '#b583ff', col2: '#5a2bd8', fx: { wbDmg: 10, mana: 10, raidSec: 2 } },
  ];
  const BY = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
  const num = (v) => (typeof v === 'number' && isFinite(v) && v > 0 ? Math.floor(v) : 0);
  const nf = (n) => (+n || 0).toLocaleString(window.I18N ? I18N.locale() : 'id-ID');
  const ic = (n, s) => (window.IC ? IC(n, s) : '');
  const meU = () => {
    try {
      return DB.me && me();
    } catch (e) {
      return null;
    }
  };
  const isStu = (u) => !!u && u.role === 'student';

  function ensure(u) {
    u.mc = u.mc || { d: {}, x: 0 };
    u.mc.d = u.mc.d || {};
    u.mc.x = num(u.mc.x);
    u.gear = u.gear || { own: [], eq: { w: '', r: '' }, at: 0 };
    u.gear.own = Array.isArray(u.gear.own) ? u.gear.own.filter((id) => BY[id]) : [];
    u.gear.eq = u.gear.eq || { w: '', r: '' };
    u.stat = u.stat || { crit: 0, wbd: 0, wbk: 0 };
    return u;
  }
  const earned = (u) => {
    const m = (u && u.mc) || {};
    return Object.values(m.d || {}).reduce((a, v) => a + num(v), 0) + num(m.x);
  };
  const own = (u) => (u && u.gear && Array.isArray(u.gear.own) ? [...new Set(u.gear.own.filter((id) => BY[id]))] : []);
  const spent = (u) => own(u).reduce((a, id) => a + BY[id].price, 0);
  const bal = (u) => Math.max(0, earned(u) - spent(u));

  const eq = (u) => {
    const o = own(u),
      e = (u && u.gear && u.gear.eq) || {},
      pick = (s) => (o.includes(e[s]) && BY[e[s]] && BY[e[s]].slot === s ? BY[e[s]] : null);
    return { w: pick('w'), r: pick('r') };
  };
  const fxOf = (u) => {
    const t = { wbDmg: 0, raidSec: 0, xp: 0, mana: 0 },
      e = eq(u);
    [e.w, e.r].filter(Boolean).forEach((it) => FX_KEYS.forEach((k) => (t[k] += it.fx[k] || 0)));
    return t;
  };
  const mine = () => {
    const u = meU();
    return isStu(u) ? fxOf(u) : { wbDmg: 0, raidSec: 0, xp: 0, mana: 0 };
  };
  const wbMul = () => 1 + mine().wbDmg / 100;
  const xpMul = () => 1 + mine().xp / 100;
  const raidSec = () => mine().raidSec;
  const manaX = (n) => Math.round(n * (1 + mine().mana / 100));
  const fxLines = (fx) => FX_KEYS.filter((k) => fx[k] > 0).map((k) => T('fg_fx_' + k, { n: fx[k] }));
  const forumOf = (name) => {
    let posts = 0,
      best = 0,
      likes = 0;
    (typeof FR === 'function' ? FR() : []).forEach((t) => {
      if (t.by === name) {
        posts++;
        likes += (t.likes || []).length;
      }
      (t.replies || []).forEach((r) => {
        if (r.by !== name) return;
        posts++;
        if (r.best) best++;
        likes += (r.likes || []).length;
      });
    });
    return { posts, best, likes, score: posts + 2 * best + likes };
  };

  const statOf = (u) => {
    if (u && u.stat) return { crit: num(u.stat.crit), wbd: num(u.stat.wbd), wbk: num(u.stat.wbk) };
    if (u && u.demo) {
      let h = 7;
      for (const ch of u.name) h = (h * 31 + ch.charCodeAt(0)) % 997;
      return { crit: 4 + (h % 23), wbd: 1200 + (h % 41) * 130, wbk: 1 + (h % 3) };
    }
    return { crit: 0, wbd: 0, wbk: 0 };
  };

  const announce = (n, key) => {
    if (n > 0 && window.Sys) Sys.pop(T(key || 'fg_gain', { n }), 'good', 2400);
  };

  function onClear(c, xp) {
    const u = meU();
    if (!isStu(u)) return 0;
    ensure(u);
    if (u.mc.d[c] != null) return 0;
    const n = manaX(c === 'P' ? 5 : Math.max(5, Math.round((xp || 0) * MANA.dg)));
    u.mc.d[c] = n;
    announce(n);
    return n;
  }

  function onRaid(ok, total) {
    const u = meU();
    if (!isStu(u) || !total || ok < total * 0.7) return 0;
    ensure(u);
    const day = today();
    let rd = u.mc.rd;
    if (!rd || rd.d !== day) rd = u.mc.rd = { d: day, n: 0 };
    const n = Math.min(Math.max(0, MANA.raidCap - rd.n), manaX(MANA.raidBase + MANA.raidPer * ok));
    rd.n += n;
    u.mc.x += n;
    announce(n, 'fg_raid_mana');
    return n;
  }

  function onBoss(idx) {
    const u = meU();
    if (!isStu(u)) return 0;
    ensure(u);
    const n = manaX(MANA.wb + (idx < 3 ? MANA.wbTop : 0));
    u.mc.x += n;
    u.stat.wbk = num(u.stat.wbk) + 1;
    return n;
  }

  function hit(dmg, crit) {
    const u = meU();
    if (!isStu(u)) return;
    ensure(u);
    u.stat.wbd = num(u.stat.wbd) + num(dmg);
    if (crit) u.stat.crit = num(u.stat.crit) + 1;
  }

  function buy(id) {
    const u = meU(),
      it = BY[id];
    if (!isStu(u) || !it) return false;
    ensure(u);
    if (own(u).includes(id)) return false;
    if (bal(u) < it.price) {
      toast(T('fg_err_bal'));
      return false;
    }
    u.gear.own.push(id);
    if (!eq(u)[it.slot]) {
      u.gear.eq[it.slot] = id;
      u.gear.at = Date.now();
    }
    save();
    window.AU && AU.sfx('arise');
    window.Sys && (Sys.pop(T('fg_forged', { n: it.n }), 'good', 2600), Sys.flash && Sys.flash(it.col));
    window.burst && burst(null, 70);
    return true;
  }
  function equip(id) {
    const u = meU(),
      it = BY[id];
    if (!isStu(u) || !it) return;
    ensure(u);
    if (!own(u).includes(id)) return;
    u.gear.eq[it.slot] = id;
    u.gear.at = Date.now();
    save();
    window.AU && AU.sfx('up');
    toast(T('fg_equip_ok', { n: it.n }));
  }
  function unequip(slot) {
    const u = meU();
    if (!isStu(u) || !(slot in { w: 1, r: 1 })) return;
    ensure(u);
    const it = BY[u.gear.eq[slot]];
    u.gear.eq[slot] = '';
    u.gear.at = Date.now();
    save();
    it && toast(T('fg_unequip_ok', { n: it.n }));
  }

  const layer = (it) => `<span class="fap fm-${it.m}" style="--c:${it.col};--c2:${it.col2}">${[0, 1, 2, 3, 4, 5, 6].map((k) => `<i style="--i:${k}"></i>`).join('')}</span>`;

  function av(name, size, uo) {
    const base = window.Avatar ? Avatar.html(name, size) : '',
      u = uo || DB.users[name],
      e = u && isStu(u) ? eq(u) : { w: null, r: null },
      l = [e.w, e.r].filter(Boolean);
    if (!l.length) return base;
    return `<span class="faura" style="--s:${size}px;--g:${l[0].col}" title="${esc(l.map((x) => x.n).join(' + '))}"><span class="fav">${base}</span>${l.map(layer).join('')}</span>`;
  }

  const chipIt = (it) => `<span class="fchip" style="--c:${it.col}">${ic(it.ic, 16)} ${esc(it.n)}</span>`;
  const manaChip = (u) => `<span class="fgmana">${ic('crystal', 16)} <b>${nf(bal(u))}</b> ${esc(T('fg_mana'))}</span>`;
  function profileBlock(u) {
    const e = eq(u),
      l = [e.w, e.r].filter(Boolean),
      fx = fxLines(fxOf(u));
    return `<div class="fgprof"><small class="tag">${T('fg_prof_h')}</small><p class="fgchips">${l.map(chipIt).join('') || `<span class="mut sm">${T('fg_none_eq')}</span>`}</p>${fx.length ? `<p class="mut sm">${fx.map(esc).join(' | ')}</p>` : ''}<p>${manaChip(u)} <button class="btn ghost" data-go="#/forge">${T('fg_prof_go')}</button></p></div>`;
  }
  const dashLine = (u) => (isStu(u) ? `<p class="fgdash">${manaChip(u)}</p>` : '');

  let FLT = 'all';
  V.forge = () => {
    const u = me();
    ensure(u);
    return `<div class="sys rv"><small class="tag">${T('fg_tag')}</small><h2>${T('fg_title')}</h2><p class="mut">${T('fg_intro')}</p></div><div id="fgz"></div>`;
  };
  V.forge.post = () => paint();
  function itemCard(u, it) {
    const o = own(u),
      has = o.includes(it.id),
      on = eq(u)[it.slot] === it,
      b = bal(u),
      act = on
        ? `<button class="btn ghost" data-fg="un:${it.slot}">${T('fg_unequip')}</button>`
        : has
          ? `<button class="btn" data-fg="eq:${it.id}">${T('fg_equip')}</button>`
          : b >= it.price
            ? `<button class="btn" data-fg="buy:${it.id}">${T('fg_forge')}</button>`
            : `<button class="btn" disabled>${T('fg_short', { n: nf(it.price - b) })}</button>`;
    return `<div class="card fgitem rar-${it.rar}${on ? ' on' : ''}${has ? ' own' : ''}" data-id="${it.id}" style="--c:${it.col};--c2:${it.col2}"><div class="fgico">${ic(it.ic, 38)}</div><div class="fgbody"><div class="fghd"><b>${esc(it.n)}</b><small class="fgrar">${T('fg_rar_' + it.rar)} | ${T('fg_slot_' + it.slot)}</small></div><p class="mut sm">${T('fg_item_' + it.id)}</p><ul class="fgfx">${fxLines(it.fx).map((x) => `<li>${esc(x)}</li>`).join('')}</ul><div class="fgact"><span class="fgprice">${ic('crystal', 15)} ${nf(it.price)}</span>${on ? `<small class="tagc fgon">${T('fg_equipped')}</small>` : has ? `<small class="tagc">${T('fg_owned')}</small>` : ''}${act}</div></div></div>`;
  }
  function paint(fresh) {
    const z = document.getElementById('fgz'),
      u = meU();
    if (!z || !isStu(u)) return;
    ensure(u);
    const e = eq(u),
      fx = fxLines(fxOf(u)),
      list = ITEMS.filter((i) => FLT === 'all' || i.slot === FLT),
      slot = (s) =>
        `<div class="fgslot">${e[s] ? `<span class="fgsi" style="--c:${e[s].col}">${ic(e[s].ic, 22)}</span><div><small class="mut">${T('fg_slot_' + s)}</small><br><b>${esc(e[s].n)}</b></div><button class="btn ghost" data-fg="un:${s}">${T('fg_unequip')}</button>` : `<span class="fgsi">${ic('starO', 22)}</span><div><small class="mut">${T('fg_slot_' + s)}</small><br><span class="mut">${T('fg_empty')}</span></div>`}</div>`,
      dayN = (u.mc.rd && u.mc.rd.d === today() ? u.mc.rd.n : 0) | 0;
    z.innerHTML = `<div class="grid2 fgtop"><div class="card fgbal"><small class="tag">${T('fg_mana').toUpperCase()}</small><div class="fgbig">${ic('crystal', 34)} <b>${nf(bal(u))}</b></div><p class="mut sm">${T('fg_earned')}: <b>${nf(earned(u))}</b> | ${T('fg_spent')}: <b>${nf(spent(u))}</b></p><h4>${T('fg_src_h')}</h4><ul class="l sm"><li>${T('fg_src_dg')}</li><li>${T('fg_src_raid', { a: MANA.raidBase, b: MANA.raidPer, c: MANA.raidCap })} <small class="mut">(${nf(dayN)}/${MANA.raidCap})</small></li><li>${T('fg_src_wb', { a: MANA.wb, b: MANA.wbTop })}</li></ul></div>
<div class="card fgload"><small class="tag">${T('fg_loadout_h').toUpperCase()}</small><div class="fgprev">${av(u.name, 84, u)}<div><h3>${esc(u.name)}</h3><p class="mut sm">${fx.length ? '' : T('fg_none_eq')}</p>${fx.length ? `<h4>${T('fg_total_h')}</h4><ul class="fgfx">${fx.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div></div>${slot('w')}${slot('r')}</div></div>
<div class="tabs fgtabs" role="tablist">${['all', 'w', 'r'].map((k) => `<button type="button" role="tab" data-fg="flt:${k}" class="${FLT === k ? 'on' : ''}">${T('fg_filter_' + k)}</button>`).join('')}</div>
<div class="fggrid">${list.map((i) => itemCard(u, i)).join('')}</div>`;
    if (fresh) {
      const c = z.querySelector(`.fgitem[data-id="${fresh}"]`);
      c && c.classList.add('fresh');
    }
  }
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest && ev.target.closest('[data-fg]');
    if (!b || !document.getElementById('fgz')) return;
    const [a, v] = b.dataset.fg.split(':');
    if (a === 'flt') FLT = ['all', 'w', 'r'].includes(v) ? v : 'all';
    else if (a === 'buy') {
      if (buy(v)) return paint(v);
    } else if (a === 'eq') equip(v);
    else if (a === 'un') unequip(v);
    paint();
  });

  const CATS = [
    { k: 'xp', ic: 'crown', val: (u) => xpOf(u) },
    { k: 'crit', ic: 'swords', val: (u) => statOf(u).crit },
    { k: 'boss', ic: 'dagger', val: (u) => statOf(u).wbd },
    { k: 'forum', ic: 'book', val: (u) => forumOf(u.name).score },
  ];
  const topOf = (list, c, n = 3) =>
    list
      .map((u) => ({ u, v: c.val(u) }))
      .filter((x) => x.v > 0)
      .sort((a, b) => b.v - a.v || xpOf(b.u) - xpOf(a.u) || a.u.name.localeCompare(b.u.name))
      .slice(0, n);
  const unit = (c, v) => T('hm_u_' + c.k, { n: nf(v) });
  const scopeName = () => {
    try {
      const s = window.Cls ? Cls.sel('board') : '*';
      return s === '*' ? T('cl_all') : s;
    } catch (e) {
      return T('cl_all');
    }
  };
  const boardList = () => (window.Cls ? Cls.filter(students(), 'board') : students());
  function hall(list) {
    const t = meU() && me().role === 'teacher',
      you = DB.me;
    const cards = CATS.map((c) => {
      const r = topOf(list, c),
        w = r[0];
      return `<div class="hmc ${w ? '' : 'empty'}"><div class="hmh"><span class="hmi">${ic(c.ic, 22)}</span><b>${T('hm_c_' + c.k)}</b></div><small class="mut">${T('hm_d_' + c.k)}</small>${
        w
          ? `<div class="hmw">${av(w.u.name, 56, w.u)}<div class="hmwt"><b>${esc(w.u.name)}${w.u.name === you ? ` <small class="mut">(${T('hm_you')})</small>` : ''}</b>${w.u.cls ? ` <small class="clchip">${esc(w.u.cls)}</small>` : ''}<br><span class="ttl">${esc(unit(c, w.v))}</span></div></div>${
              r.length > 1 ? `<ol class="hmr" start="2">${r.slice(1).map((x) => `<li><span>${esc(x.u.name)}</span><em>${esc(unit(c, x.v))}</em></li>`).join('')}</ol>` : ''
            }`
          : `<p class="mut sm hmn">${T('hm_none')}</p>`
      }</div>`;
    }).join('');
    return `<div class="card hall rv"><small class="tag">${T('hm_tag')}</small><h3>${ic('crown', 22)} ${T('hm_title')} <small class="clchip">${esc(scopeName())}</small></h3><p class="mut sm">${T('hm_intro')}</p><div class="hmgrid">${cards}</div>${
      t ? `<div class="hmex"><h4>${T('hm_export_h')}</h4><p class="mut sm">${T('hm_export_p')}</p><p><button class="btn" data-hm="pdf">${T('hm_pdf')}</button> <button class="btn ghost" data-hm="csv">${T('hm_csv')}</button></p></div>` : ''
    }</div>`;
  }

  function reportData() {
    const list = boardList().slice().sort((a, b) => xpOf(b) - xpOf(a)),
      ng = list.map(ngain).filter((x) => x != null),
      avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
    return {
      list,
      scope: scopeName(),
      n: list.length,
      avgXp: list.length ? Math.round(list.reduce((a, u) => a + xpOf(u), 0) / list.length) : 0,
      avgNg: avg(ng),
      done: list.filter((u) => RK.every((r) => u.done[r.c])).length,
      champs: CATS.map((c) => ({ c, top: topOf(list, c) })),
      rows: list.map((u) => {
        const s = statOf(u);
        return { name: u.name, cls: u.cls || '', xp: xpOf(u), title: titleOf(xpOf(u)), prog: Object.keys(u.done).length + '/' + RK.length, ng: fmt(ngain(u)), crit: s.crit, dmg: s.wbd, forum: forumOf(u.name).score, art: own(u).length };
      }),
    };
  }
  const when = () => new Date().toLocaleString(window.I18N ? I18N.locale() : 'id-ID');
  function csvText(D) {
    const e = (a) => a.map(csvEsc).join(','),
      out = [e([T('hm_rep_title')]), e([T('hm_scope', { c: D.scope }), when()]), '', e([T('hm_rep_top3')]), e([T('hm_col_cat'), T('hm_col_rank'), T('hm_col_name'), T('hm_col_cls'), T('hm_col_val')])];
    D.champs.forEach((g) => g.top.forEach((x, i) => out.push(e([T('hm_c_' + g.c.k), i + 1, x.u.name, x.u.cls || '', x.v]))));
    out.push('', e([T('hm_rep_all')]), e([T('hm_col_name'), T('hm_col_cls'), T('hm_col_xp'), T('hm_col_title'), T('hm_col_prog'), T('hm_col_ng'), T('hm_col_crit'), T('hm_col_dmg'), T('hm_col_forum'), T('hm_col_art')]));
    D.rows.forEach((r) => out.push(e([r.name, r.cls, r.xp, r.title, r.prog, r.ng, r.crit, r.dmg, r.forum, r.art])));
    return out.join('\r\n');
  }
  function pdfHtml(D) {
    const th = (a) => `<tr>${a.map((x) => `<th>${esc(x)}</th>`).join('')}</tr>`,
      td = (a) => `<tr>${a.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`,
      lang = window.I18N ? I18N.lang : 'id',
      teacher = meU() ? me().name : '';
    return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(T('hm_rep_title'))}</title><style>
@page{size:A4;margin:14mm}body{font:13px/1.45 Arial,'Noto Sans JP','Noto Sans KR',sans-serif;color:#111;margin:0}
h1{font-size:22px;margin:0}h2{font-size:15px;margin:20px 0 6px;border-bottom:2px solid #6a3fd6;padding-bottom:3px}
.m{color:#555;font-size:12px;margin:3px 0}table{width:100%;border-collapse:collapse;margin:6px 0}
th,td{border:1px solid #bbb;padding:4px 6px;text-align:left;vertical-align:top;font-size:12px}th{background:#ece6ff}
.k{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.k div{flex:1 1 120px;border:1px solid #bbb;border-radius:6px;padding:6px 8px}.k b{display:block;font-size:18px}
.ch{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ch div{border:2px solid #d8b24a;border-radius:8px;padding:8px;break-inside:avoid}.ch small{color:#555}.ch b{font-size:15px}
tr{break-inside:avoid}</style></head><body>
<h1>${esc(T('hm_rep_title'))}</h1><p class="m">Shadow Monarch's Quadratic Dungeon | ${esc(T('hm_scope', { c: D.scope }))}${teacher ? ' | ' + esc(T('hm_rep_by', { n: teacher })) : ''} | ${esc(T('hm_rep_printed', { d: when() }))}</p>
<h2>${esc(T('hm_rep_sum'))}</h2><div class="k"><div>${esc(T('hm_rep_n'))}<b>${D.n}</b></div><div>${esc(T('hm_rep_avgxp'))}<b>${nf(D.avgXp)}</b></div><div>${esc(T('hm_rep_avgng'))}<b>${D.avgNg == null ? '-' : D.avgNg.toFixed(2)}</b></div><div>${esc(T('hm_rep_done'))}<b>${D.done}/${D.n}</b></div></div>
<h2>${esc(T('hm_rep_champs'))}</h2><div class="ch">${D.champs.map((g) => `<div><small>${esc(T('hm_c_' + g.c.k))}</small><br>${g.top[0] ? `<b>${esc(g.top[0].u.name)}</b> ${g.top[0].u.cls ? '(' + esc(g.top[0].u.cls) + ')' : ''}<br>${esc(unit(g.c, g.top[0].v))}` : esc(T('hm_none'))}</div>`).join('')}</div>
<h2>${esc(T('hm_rep_top3'))}</h2><table>${th([T('hm_col_cat'), T('hm_col_rank'), T('hm_col_name'), T('hm_col_cls'), T('hm_col_val')])}${D.champs.map((g) => g.top.map((x, i) => td([T('hm_c_' + g.c.k), i + 1, x.u.name, x.u.cls || '-', unit(g.c, x.v)])).join('')).join('')}</table>
<h2>${esc(T('hm_rep_all'))}</h2><table>${th([T('hm_col_name'), T('hm_col_cls'), T('hm_col_xp'), T('hm_col_title'), T('hm_col_prog'), T('hm_col_ng'), T('hm_col_crit'), T('hm_col_dmg'), T('hm_col_forum'), T('hm_col_art')])}${D.rows.map((r) => td([r.name, r.cls || '-', r.xp, r.title, r.prog, r.ng, r.crit, r.dmg, r.forum, r.art])).join('')}</table></body></html>`;
  }
  function exportPdf(D) {
    const f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
    document.body.appendChild(f);
    f.contentDocument.open();
    f.contentDocument.write(pdfHtml(D));
    f.contentDocument.close();
    setTimeout(() => {
      try {
        f.contentWindow.focus();
        f.contentWindow.print();
      } catch (e) {
        toast(T('hm_pdf_err'));
      }
      setTimeout(() => f.remove(), 2000);
    }, 400);
  }
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest && ev.target.closest('[data-hm]');
    if (!b || !meU() || me().role !== 'teacher') return;
    const D = reportData();
    if (!D.n) return toast(T('hm_empty_export'));
    if (b.dataset.hm === 'pdf') exportPdf(D);
    else downloadFile('hall-of-monarchs-arise.csv', 'text/csv', csvText(D));
  });

  const isId = (v) => typeof v === 'string' && BY[v];

  function clean(d) {
    const o = {};
    if (d && d.mc && typeof d.mc === 'object') {
      o.mc = { d: {}, x: num(d.mc.x) };
      Object.entries(d.mc.d || {})
        .slice(0, 20)
        .forEach(([k, v]) => {
          if (/^[A-Za-z0-9]{1,2}$/.test(k)) o.mc.d[k] = num(v);
        });
      const r = d.mc.rd;
      if (r && typeof r.d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.d)) o.mc.rd = { d: r.d, n: num(r.n) };
    }
    if (d && d.gear && typeof d.gear === 'object') {
      const e = d.gear.eq || {};
      o.gear = { own: (Array.isArray(d.gear.own) ? d.gear.own : []).filter(isId).slice(0, 20), eq: { w: isId(e.w) ? e.w : '', r: isId(e.r) ? e.r : '' }, at: num(d.gear.at) };
    }
    if (d && d.stat && typeof d.stat === 'object') o.stat = { crit: num(d.stat.crit), wbd: num(d.stat.wbd), wbk: num(d.stat.wbk) };
    return o;
  }

  function merge(a, b) {
    const o = {};
    if (a.mc || b.mc) {
      const x = a.mc || { d: {}, x: 0 },
        y = b.mc || { d: {}, x: 0 },
        d = Object.assign({}, y.d);
      Object.entries(x.d || {}).forEach(([k, v]) => (d[k] = Math.max(num(d[k]), num(v))));
      o.mc = { d, x: Math.max(num(x.x), num(y.x)) };
      const ra = x.rd,
        rb = y.rd,
        rd = ra && rb ? (ra.d > rb.d ? ra : rb.d > ra.d ? rb : { d: ra.d, n: Math.max(ra.n, rb.n) }) : ra || rb;
      if (rd) o.mc.rd = rd;
    }
    if (a.gear || b.gear) {
      const x = a.gear || { own: [], eq: {}, at: 0 },
        y = b.gear || { own: [], eq: {}, at: 0 },
        w = num(x.at) >= num(y.at) ? x : y;
      o.gear = { own: [...new Set([...(x.own || []), ...(y.own || [])])], eq: Object.assign({ w: '', r: '' }, w.eq), at: Math.max(num(x.at), num(y.at)) };
    }
    if (a.stat || b.stat) {
      const x = a.stat || {},
        y = b.stat || {};
      o.stat = { crit: Math.max(num(x.crit), num(y.crit)), wbd: Math.max(num(x.wbd), num(y.wbd)), wbk: Math.max(num(x.wbk), num(y.wbk)) };
    }
    return o;
  }

  const pack = (u) => ({ mc: u.mc || null, gear: u.gear || null, stat: u.stat || null });
  const pub = (u) => ({ gear: u.gear ? { own: u.gear.own, eq: u.gear.eq, at: u.gear.at || 0 } : null, stat: u.stat || null });

  return { ITEMS, MANA, onClear, onRaid, onBoss, hit, wbMul, xpMul, raidSec, av, eq, own, bal, earned, fxOf, fxLines, statOf, forumOf, profileBlock, dashLine, manaChip, hall, topOf, reportData, csvText, pdfHtml, clean, merge, pack, pub, buy, equip, unequip };
})();
