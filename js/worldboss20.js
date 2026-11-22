'use strict';

window.WBoss = (() => {
  const MAXHIT = 1500,
    SIM_NAMES = ['Wildan', 'Rara', 'Dimas', 'Sinta', 'Bagas', 'Nadia'],
    TIER_FLOOR = { 1: 1, 2: 4, 3: 8 },
    REWARD = 20,
    REWARD_TOP = 20,
    RECENT_MS = 2 * 3600e3;
  const T = (k, v) => T2(k, v);
  const cloud = () => !!(window.Sync && Sync.isOn());
  const isT = () => {
    try {
      return me().role === 'teacher';
    } catch (e) {
      return false;
    }
  };
  const typing = () => typeof typingNow === 'function' && typingNow();
  const str = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');
  const idOk = (v) => typeof v === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(v);
  const fmt = (n) => (+n || 0).toLocaleString(window.I18N ? I18N.locale() : 'id-ID');
  const rid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const $z = () => document.getElementById('wbz');
  const q$ = (s) => document.querySelector('#wbz ' + s);
  const myKey = () => {
    try {
      return cloud() ? Cloud.uid : 'L:' + DB.me;
    } catch (e) {
      return '';
    }
  };
  const S = {
    bid: null,
    hits: [],
    unsub: null,
    ready: false,
    mounted: false,
    seen: null,
    key: '',
    q: null,
    ans: null,
    streak: 0,
    t0: 0,
    lock: 0,
    lockT: 0,
    mood: '',
    moodT: 0,
    simT: 0,
    proj: false,
    sel: null,
    notified: new Set(),
    finalSent: {},
  };

  const LK = 'ad_wb_local';
  const lread = () => {
    try {
      const o = JSON.parse(localStorage.getItem(LK) || 'null');
      if (o && Array.isArray(o.bosses) && o.hits && typeof o.hits === 'object') return o;
    } catch (e) {

    }
    return { bosses: [], hits: {} };
  };
  const lwrite = (o) => {
    try {
      localStorage.setItem(LK, JSON.stringify(o));
    } catch (e) {

    }
  };

  function cleanBoss(d, id) {
    if (!d || !idOk(id) || typeof d.name !== 'string') return null;
    const maxHp = Math.round(+d.maxHp);
    if (!(maxHp >= 500 && maxHp <= 1000000)) return null;
    return {
      id,
      name: str(d.name, 60),
      sub: str(d.sub, 80),
      cls: str(d.cls, 16),
      maxHp,
      tier: [1, 2, 3, 4].includes(d.tier) ? d.tier : 1,
      mon: window.Mon && Mon.has(d.mon) ? String(d.mon) : 'S',
      status: d.status === 'ended' ? 'ended' : 'active',
      by: str(d.by, 24),
      ts: +d.ts || 0,
      endedAt: +d.endedAt || 0,
      result: d.result === 'victory' || d.result === 'retreat' ? d.result : '',
      top: str(d.top, 24),
      topDmg: +d.topDmg || 0,
      hits: +d.hits || 0,
      players: +d.players || 0,
    };
  }
  function cleanHit(h, id) {
    if (!h || !idOk(id) || typeof h.by !== 'string') return null;
    const dmg = Math.round(+h.dmg);
    if (!(dmg >= 1 && dmg <= MAXHIT)) return null;
    return { id, uid: str(h.uid, 60), by: str(h.by, 24), dmg, crit: !!h.crit, combo: Math.max(0, Math.min(99, h.combo | 0)), t: +h._t || +h.t || 0, sim: !!h.sim };
  }

  const bosses = () =>
    (cloud() ? (Sync.bosses() || []).map((d) => cleanBoss(d, d._id)) : lread().bosses.map((d) => cleanBoss(d, d.id)))
      .filter(Boolean)
      .sort((a, b) => b.ts - a.ts);

  const myCls = () => {
    try {
      return me().cls || '';
    } catch (e) {
      return '';
    }
  };
  const relevant = (b) => isT() || !b.cls || b.cls === myCls();
  const recent = (b) => b.status === 'active' || Date.now() - (b.endedAt || b.ts) < RECENT_MS;

  const choices = () => bosses().filter((b) => relevant(b) && recent(b));
  function current() {
    const pool = choices();
    if (isT() && S.sel) {
      const s = pool.find((b) => b.id === S.sel);
      if (s) return s;
    }

    const pick = (l) => (isT() ? l[0] : l.find((b) => b.cls && b.cls === myCls()) || l[0]);
    return pick(pool.filter((b) => b.status === 'active')) || pick(pool) || null;
  }
  const hitsOf = (b) => (b && S.bid === b.id ? S.hits : []);
  const total = (b) => hitsOf(b).reduce((a, h) => a + h.dmg, 0);
  const hpOf = (b) => Math.max(0, b.maxHp - total(b));
  function board(b) {
    const m = new Map();
    hitsOf(b).forEach((h) => {
      const k = h.uid || h.by;
      let r = m.get(k);
      if (!r) m.set(k, (r = { key: k, by: h.by, dmg: 0, hits: 0, crit: 0, sim: h.sim }));
      r.dmg += h.dmg;
      r.hits++;
      if (h.crit) r.crit++;
    });
    return [...m.values()].sort((a, c) => c.dmg - a.dmg);
  }

  function phase(b) {
    if (!b) return 'none';
    if (b.status === 'active') return hpOf(b) <= 0 && S.ready ? 'win' : 'active';
    return b.result === 'victory' ? 'win' : 'end';
  }

  function unsubHits() {
    try {
      S.unsub && S.unsub();
    } catch (e) {

    }
    S.unsub = null;
    S.bid = null;
    S.hits = [];
    S.ready = false;
    S.seen = null;
  }
  const localHits = () => {
    S.hits = ((lread().hits[S.bid] || []).map((h) => cleanHit(h, h.id))).filter(Boolean);
    S.ready = true;
  };
  function subHits(bid) {
    if (S.bid === bid && (S.unsub || !bid)) return;
    unsubHits();
    if (!bid) return;
    S.bid = bid;
    if (cloud()) {
      S.unsub = FB.watchHits(
        bid,
        (l) => {
          S.hits = l.map((h) => cleanHit(h, h._id)).filter(Boolean);
          S.ready = true;
          onHits();
        },
        (e) => {
          console.warn('watch hits', e);
          toast(e && e.code === 'permission-denied' ? T('wb_err_rules') : T('wb_err_fail'));
        },
      );
    } else {
      localHits();
      S.unsub = () => {};
    }
  }

  const failMsg = (e) => toast(e && e.code === 'permission-denied' ? T('wb_err_rules') : T('wb_err_fail'));
  async function createBoss(f) {
    const id = rid('b'),
      now = Date.now(),
      d = { id, name: f.name, sub: f.sub, cls: f.cls || '', maxHp: f.maxHp, tier: f.tier, mon: f.mon, status: 'active', by: DB.me, uid: cloud() ? Cloud.uid : 'L', ts: now };
    const olds = bosses().filter((b) => b.status === 'active' && b.cls === (f.cls || ''));
    if (cloud()) {
      for (const o of olds) await FB.updateIn('worldBoss', o.id, { status: 'ended', result: 'retreat', endedAt: now });
      await FB.setIn('worldBoss', id, d);
    } else {
      const o = lread();
      o.bosses.forEach((b) => b.status === 'active' && Object.assign(b, { status: 'ended', result: 'retreat', endedAt: now }));
      o.bosses.push(d);
      o.bosses = o.bosses.slice(-12);
      lwrite(o);
    }
    S.notified.add(id);
    S.sel = id;
    onBosses();
    return id;
  }
  async function endBoss(b, result) {
    const bd = board(b),
      upd = { status: 'ended', result, endedAt: Date.now(), top: bd[0] ? bd[0].by : '', topDmg: bd[0] ? bd[0].dmg : 0, hits: hitsOf(b).length, players: bd.length };
    if (cloud()) await FB.updateIn('worldBoss', b.id, upd);
    else {
      const o = lread(),
        x = o.bosses.find((y) => y.id === b.id);
      x && Object.assign(x, upd);
      lwrite(o);
      onBosses();
    }
  }
  async function delBoss(b) {
    if (cloud()) await FB.delBoss(b.id);
    else {
      const o = lread();
      o.bosses = o.bosses.filter((y) => y.id !== b.id);
      delete o.hits[b.id];
      lwrite(o);
      unsubHits();
      onBosses();
    }
  }

  function finalize(b) {
    if (!isT() || !b || b.status !== 'active' || S.finalSent[b.id] || !S.ready || hpOf(b) > 0) return;
    S.finalSent[b.id] = 1;
    endBoss(b, 'victory').catch(failMsg);
  }

  const ri = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  function nextQ() {
    const b = current();
    if (!b || !window.RedGate) return;
    const tier = b.tier === 4 ? Math.min(3, 1 + Math.floor(S.streak / 3)) : b.tier;
    S.q = RedGate.gen(TIER_FLOOR[tier] || 1, S.q && S.q.type);
    S.ans = null;
    S.t0 = Date.now();
    S.lock = 0;
  }

  function calcDmg(p, ms, streak) {
    const base = 150 + 30 * (p.tier || 1),
      speed = Math.round(80 * Math.max(0, Math.min(1, (40000 - ms) / 30000))),
      combo = 15 * Math.min(streak - 1, 6),
      crit = streak % 3 === 0;
    let dmg = base + speed + combo + ri(0, 40);
    if (crit) dmg *= 2;
    if (window.Forge) dmg = Math.round(dmg * Forge.wbMul());
    return { dmg: Math.min(MAXHIT, dmg), crit };
  }
  function sendHit(b, r) {
    const h = { uid: myKey(), by: DB.me, dmg: r.dmg, crit: r.crit, combo: Math.min(99, S.streak) },
      id = rid('h');
    if (cloud()) FB.addHit(b.id, id, h).catch(failMsg);
    else {
      const o = lread(),
        l = (o.hits[b.id] = o.hits[b.id] || []);
      l.push(Object.assign({ id, t: Date.now() }, h));
      if (l.length > 600) l.splice(0, l.length - 600);
      lwrite(o);
      localHits();
      onHits();
    }
  }
  function submit(sel) {
    const b = current();
    if (!b || !S.q || S.ans) return;
    if (phase(b) !== 'active') return paintQ();
    const p = S.q,
      o = p.opts[sel],
      ok = sel === p.key;
    if (ok) {
      S.streak++;
      const r = calcDmg(p, Date.now() - S.t0, S.streak);
      S.ans = { sel, ok, dmg: r.dmg, crit: r.crit };
      sendHit(b, r);
      window.Forge && Forge.hit(r.dmg, r.crit);
      window.AU && AU.sfx(r.crit ? 'up' : 'ok');
      if (r.crit && window.Sys) {
        Sys.shake(0.7);
        Sys.flash('#ffd86b');
      }
      window.Sys && Sys.pop(T(r.crit ? 'wb_q_crit' : 'wb_q_hit', { d: r.dmg }), 'good', 1600);
    } else {
      S.streak = 0;
      S.ans = { sel, ok: false };
      S.lock = Date.now() + 3000;
      if (o.mis && window.Mentor) {
        Mentor.record(o.mis);
        Mentor.show(o.mis, o.mv, { ms: 7000 });
        try {
          save();
        } catch (e) {

        }
      } else window.AU && AU.sfx('bad');
      window.Sys && Sys.shake(0.5);
    }
    paintQ();
  }

  const mkTr = (el) => window.renderMath && renderMath(el);
  const when = (t) => {
    try {
      return new Date(t).toLocaleTimeString(window.I18N ? I18N.locale() : 'id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };
  const monOpts = () =>
    ['S', 'A', 'B', 'C', 'D', 'E', '0']
      .filter((c) => window.Mon && Mon.has(c))
      .map((c) => `<option value="${c}">${esc(Mon.info(c).n)}</option>`)
      .join('');
  function form() {
    return `<div class="card wbform"><h3>${T('wb_f_h')}</h3><div class="wbfg">
<label>${T('wb_f_name')}<input id="wbfn" maxlength="60" value="${esc(T('wb_f_def_name'))}"></label>
<label>${T('wb_f_sub')}<input id="wbfs" maxlength="80" value="${esc(T('wb_f_def_sub'))}"></label>
<label>${T('wb_f_cls')}<select id="wbfc"><option value="">${T('cl_all')}</option>${(window.Cls ? Cls.known() : []).map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></label>
<label>${T('wb_f_hp')}<input id="wbfh" type="number" inputmode="numeric" min="500" max="1000000" step="500" value="10000"></label>
<label>${T('wb_f_diff')}<select id="wbfd"><option value="1">${T('wb_d1')}</option><option value="2" selected>${T('wb_d2')}</option><option value="3">${T('wb_d3')}</option><option value="4">${T('wb_d4')}</option></select></label>
<label>${T('wb_f_mon')}<select id="wbfm">${monOpts()}</select></label></div>
<p class="err" id="wbfe" role="alert"></p><p><button class="btn" id="wbgo">${T('wb_f_go')}</button></p></div>`;
  }
  function ctl(b, ph) {
    const ch = choices();
    let h = ph === 'active' ? '' : form();
    if (ch.length > 1)
      h += `<div class="card wbsess"><label>${T('wb_sess')}<select id="wbsel">${ch
        .map((x) => `<option value="${esc(x.id)}"${b && x.id === b.id ? ' selected' : ''}>${esc(x.name)} | ${esc(Cls.label(x.cls).replace(/<[^>]*>/g, ''))} | ${T(x.status === 'active' ? 'wb_ph_active' : 'wb_hist_win')}</option>`)
        .join('')}</select></label></div>`;
    if (b)
      h += `<div class="card wbctl"><button class="btn" id="wbproj">${T(S.proj ? 'wb_c_exit' : 'wb_c_proj')}</button>${
        ph === 'active' ? `<button class="btn ghost" id="wbend">${T('wb_c_end')}</button>` : ''
      }<button class="btn ghost" id="wbdel">${T('wb_c_del')}</button></div>`;
    return h;
  }
  function history() {
    const l = bosses().slice(0, 6);
    return `<div class="card wbhist"><h3>${T('wb_hist_h')}</h3>${
      l.length
        ? `<table><tr><th>Boss</th><th>${T('cl_label')}</th><th>HP</th><th>Status</th><th>MVP</th></tr>${l
            .map(
              (b) =>
                `<tr><td>${esc(b.name)}</td><td>${esc(b.cls || '*')}</td><td>${fmt(b.maxHp)}</td><td>${b.status === 'active' ? T('wb_ph_active') : b.result === 'victory' ? T('wb_hist_win') : T('wb_hist_ret')}</td><td>${b.top ? esc(b.top) + ' (' + fmt(b.topDmg) + ')' : '-'}</td></tr>`,
            )
            .join('')}</table>`
        : `<p class="mut">${T('wb_hist_empty')}</p>`
    }</div>`;
  }
  const waiting = () =>
    `<div class="card wbwait"><div class="wbwf">${window.Mon ? Mon.svg('E', 'idle', 120) : ''}</div><div><h3>${T('wb_wait_h')}</h3><p class="mut">${T('wb_wait_p')}</p></div></div>`;
  function arena(b, ph, t) {
    return `<div class="wbgrid"><div class="wbcol">
<div class="card wbboss" id="wbbs"><div class="wbfig" id="wbfig"></div><div class="wbinfo"><small class="tag" id="wbph"></small> <small class="clchip">${esc(Cls.label(b.cls).replace(/<[^>]*>/g, ''))}</small>
<h3 class="wbname">${esc(b.name)}</h3><p class="mut sm wbsub">${esc(b.sub)}</p>
<div class="wbhpw"><div class="wbhp" id="wbhp" role="progressbar" aria-valuemin="0" aria-valuemax="${b.maxHp}"><i id="wbhpf"></i></div><div class="wbhpt"><b id="wbhpn"></b><span id="wbhpm"></span></div></div>
<div class="wbstats"><span>${T('wb_s_players')} <b id="wbn1">0</b></span><span>${T('wb_s_hits')} <b id="wbn2">0</b></span><span>${T('wb_s_dmg')} <b id="wbn3">0</b></span></div></div>
<div class="wbfx" id="wbfx" aria-hidden="true"></div></div>
${t ? '' : '<div class="card wbq" id="wbq"></div>'}${ph === 'active' ? '' : '<div class="card wbres" id="wbres"></div>'}
</div><div class="wbcol"><div class="card"><h3>${T('wb_log_h')}</h3><ul class="wblog" id="wblog" aria-live="off"></ul></div>
<div class="card"><h3>${T('wb_top_h')}</h3><ol class="wbtop" id="wbtop"></ol></div></div></div>`;
  }
  function paint() {
    const z = $z();
    if (!z) return;
    const b = current(),
      ph = phase(b),
      t = isT();
    S.key = (b ? b.id : '-') + ph + (t ? 't' : 's');
    let h = cloud() ? '' : `<p class="card mut sm wblocal">${T('wb_local')}</p>`;
    if (t) h += ctl(b, ph);
    h += b ? arena(b, ph, t) : t ? '' : waiting();
    if (t) h += history();
    z.innerHTML = h;
    z.classList.toggle('wbproj', S.proj);
    wire(z);
    S.mood = '';
    patch(true);
    if (!t && b) paintQ();
    if (window.Gloss) Gloss.apply(z);

    if (!t && b && ph === 'active' && window.Cut && Cut.auto() && S.introBid !== b.id) {
      S.introBid = b.id;
      try {
        Cut.boss(b.mon, { name: b.name, wb: true, fig: b.mon });
      } catch (e) {}
    }
  }
  function setMood(m, b) {
    const f = document.getElementById('wbfig');
    if (!f || !b || S.mood === m) return;
    S.mood = m;
    f.innerHTML = window.Mon ? Mon.svg(b.mon, m, 200) : '';
  }
  function baseMood(b, ph, pct) {
    return ph === 'win' ? 'ko' : ph === 'end' ? 'idle' : pct < 30 ? 'atk' : 'idle';
  }
  const setT = (id, v) => {
    const e = q$('#' + id);
    if (e && e.textContent !== String(v)) e.textContent = v;
  };
  function patch(first) {
    const z = $z(),
      b = current();
    if (!z || !b || !document.getElementById('wbbs')) return;
    const ph = phase(b),
      hits = hitsOf(b),
      hp = hpOf(b),
      pct = (hp / b.maxHp) * 100,
      bd = board(b);
    const f = q$('#wbhpf');
    f.style.width = pct + '%';
    f.className = pct > 60 ? '' : pct > 30 ? 'mid' : 'lo';
    q$('#wbhp').setAttribute('aria-valuenow', hp);
    setT('wbhpn', fmt(hp));
    setT('wbhpm', ' / ' + fmt(b.maxHp));
    setT('wbn1', bd.length);
    setT('wbn2', hits.length);
    setT('wbn3', fmt(b.maxHp - hp));
    const pe = q$('#wbph');
    pe.textContent = T(ph === 'active' ? 'wb_ph_active' : ph === 'win' ? 'wb_ph_win' : 'wb_ph_end');
    pe.className = 'tag wbph ' + ph;

    const fresh = S.seen && S.ready ? hits.filter((h) => !S.seen.has(h.id)) : [];
    if (S.ready) S.seen = new Set(hits.map((h) => h.id));
    fresh.slice(-4).forEach((h) => floatDmg(h));
    if (fresh.length) {
      setMood('hurt', b);
      clearTimeout(S.moodT);
      S.moodT = setTimeout(() => setMood(baseMood(b, phase(b), (hpOf(b) / b.maxHp) * 100), b), 450);
      if (fresh.some((h) => h.crit) && window.Sys && isT()) Sys.shake(0.5);
      if (isT() && window.AU) AU.sfx('hit');
    } else if (!S.moodT || first) setMood(baseMood(b, ph, pct), b);
    if (ph !== 'active' && fresh.length === 0) setMood(baseMood(b, ph, pct), b);
    renderLog(b, hits, fresh);
    renderTop(bd);
    if (ph !== 'active') renderRes(b, ph, bd);
  }
  function floatDmg(h) {
    const fx = document.getElementById('wbfx');
    if (!fx) return;
    const s = document.createElement('span');
    s.className = 'wbdmg' + (h.crit ? ' crit' : '');
    s.textContent = '-' + fmt(h.dmg);
    s.style.left = 12 + Math.random() * 70 + '%';
    fx.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }
  function renderLog(b, hits, fresh) {
    const el = document.getElementById('wblog');
    if (!el) return;
    const fr = new Set(fresh.map((h) => h.id)),
      sorted = hits.slice().sort((a, c) => a.t - c.t || (a.id < c.id ? -1 : 1));
    let cum = 0,
      final = null;
    sorted.forEach((h) => {
      cum += h.dmg;
      if (!final && cum >= b.maxHp) final = h.id;
    });
    const li = sorted
      .slice(-40)
      .reverse()
      .map((h) => {
        const k = h.id === final ? 'wb_log_final' : h.crit ? 'wb_log_crit' : 'wb_log_hit';
        return `<li class="${h.crit ? 'crit' : ''}${h.id === final ? ' final' : ''}${fr.has(h.id) ? ' new' : ''}"><time>${when(h.t)}</time><span>${T(k, { n: '<b>' + esc(h.by) + '</b>', d: '<em>' + fmt(h.dmg) + '</em>' })}${h.sim ? ` <small class="mut">(${T('wb_log_sim')})</small>` : ''}</span></li>`;
      })
      .join('');
    el.innerHTML = li + `<li class="sys0"><time>${when(b.ts)}</time><span>${T('wb_log_start', { b: '<b>' + esc(b.name) + '</b>' })}</span></li>`;
    if (!hits.length) el.insertAdjacentHTML('afterbegin', `<li class="mut">${T('wb_log_empty')}</li>`);
  }
  function renderTop(bd) {
    const el = document.getElementById('wbtop');
    if (!el) return;
    const max = (bd[0] && bd[0].dmg) || 1,
      mine = myKey();
    el.innerHTML = bd.length
      ? bd
          .slice(0, S.proj ? 10 : 6)
          .map((r, i) => `<li class="${r.key === mine ? 'me' : ''}"><span class="wbrk">${i + 1}</span><span class="wbnm">${esc(r.by)}${r.key === mine ? ` <small class="mut">(${T('wb_you')})</small>` : ''}</span><b>${fmt(r.dmg)}</b><i style="width:${Math.max(4, (r.dmg / max) * 100)}%"></i></li>`)
          .join('')
      : `<li class="mut">${T('wb_top_empty')}</li>`;
  }

  function claim(b, bd) {
    const u = me();
    if (!u || u.role !== 'student' || !S.ready) return 0;
    u.wb = u.wb || {};
    if (u.wb[b.id]) return u.wb[b.id].xp;
    const i = bd.findIndex((r) => r.key === myKey());
    if (i < 0) return 0;
    const xp = REWARD + (i < 3 ? REWARD_TOP : 0),
      mc = window.Forge ? Forge.onBoss(i) : 0;
    u.wb[b.id] = { dmg: bd[i].dmg, xp, mc, ts: Date.now() };
    const ks = Object.keys(u.wb).sort((x, y) => u.wb[x].ts - u.wb[y].ts);
    while (ks.length > 20) delete u.wb[ks.shift()];
    u.bonus = (u.bonus || 0) + xp;
    save();
    window.AU && AU.sfx('up');
    window.Sys && Sys.pop(T('wb_r_xp', { n: xp }), 'good', 2600);
    mc && window.Sys && setTimeout(() => Sys.pop(T('fg_wb_mana', { n: mc }), 'good', 2600), 900);
    return xp;
  }
  function renderRes(b, ph, bd) {
    const el = document.getElementById('wbres');
    if (!el) return;
    const mine = bd.find((r) => r.key === myKey()),
      t = isT();
    let xp = 0;
    if (ph === 'win' && !t) xp = claim(b, bd);
    if (!xp && !t) xp = ((me().wb || {})[b.id] || {}).xp || 0;
    el.innerHTML =
      `<h3 class="ttl">${ph === 'win' ? T('wb_r_win_h', { b: esc(b.name) }) : T('wb_r_end_h')}</h3>` +
      (bd[0] ? `<p>${T('wb_r_mvp', { n: esc(bd[0].by), d: fmt(bd[0].dmg) })}</p>` : '') +
      (!t && mine ? `<p>${T('wb_r_you', { d: fmt(mine.dmg), h: mine.hits })}</p>` : '') +
      (xp ? `<p class="ttl">${T('wb_r_xp', { n: xp })}</p>` : '') +
      (!t && ((me().wb || {})[b.id] || {}).mc ? `<p class="ttl">${T('fg_wb_mana', { n: me().wb[b.id].mc })}</p>` : '') +
      (!t ? `<p class="mut">${T('wb_r_wait')}</p>` : '');
  }
  function paintQ() {
    const z = document.getElementById('wbq'),
      b = current();
    if (!z || !b) return;
    clearInterval(S.lockT);
    const ph = phase(b);
    if (ph !== 'active' && !S.ans) {
      z.innerHTML = `<h3>${T('wb_q_h')}</h3><p class="mut">${T('wb_q_over')}</p>`;
      return;
    }
    if (!S.q) nextQ();
    const p = S.q,
      a = S.ans,
      opts = p.opts
        .map((o, x) => {
          const cls = a ? (x === p.key ? 'rgok' : x === a.sel ? 'rgbad' : '') : '';
          return `<label class="${cls}"><input type="radio" name="wbq" value="${x}" ${a ? 'disabled' : ''} ${a && x === a.sel ? 'checked' : ''}><span>${String.fromCharCode(65 + x)}. ${o.label()}</span></label>`;
        })
        .join('');
    let res = '';
    if (a) {
      res = a.ok
        ? `<p class="res rgres ok">${T(a.crit ? 'wb_q_crit' : 'wb_q_hit', { d: a.dmg })}</p>`
        : `<p class="res rgres bad">${T('wb_q_miss')} | ${T('wb_q_reveal')}: ${p.opts[p.key].label()}</p>`;
      res += `<p class="exp">${p.exp()}</p><p><button class="btn" id="wbnx">${T('wb_q_next')}</button></p>`;
    }
    z.innerHTML = `<h3>${T('wb_q_h')}</h3><div class="dgs"><span>${T('wb_q_combo')} <b>${S.streak}</b></span></div><p>${T(p.q, { f: p.f })}</p><div class="opts">${opts}</div>${
      a ? '' : `<p class="mut sm" id="wbpk">${T('wb_q_tip')}</p><button class="btn" id="wbat">${T('wb_q_atk')}</button>`
    }${res}`;
    const at = z.querySelector('#wbat');
    at &&
      (at.onclick = () => {
        const c = z.querySelector('input[name=wbq]:checked');
        c ? submit(+c.value) : toast(T('wb_q_pick'));
      });
    const nx = z.querySelector('#wbnx');
    if (nx) {
      nx.onclick = () => {
        if (S.lock > Date.now()) return;
        nextQ();
        paintQ();
        scrollTo({ top: z.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' });
      };
      if (S.lock > Date.now()) {
        const tick = () => {
          const s = Math.ceil((S.lock - Date.now()) / 1000);
          if (s <= 0) {
            clearInterval(S.lockT);
            nx.disabled = false;
            nx.textContent = T('wb_q_next');
          } else {
            nx.disabled = true;
            nx.textContent = T('wb_q_stun', { n: s });
          }
        };
        tick();
        S.lockT = setInterval(tick, 250);
      }
    }
    mkTr(z);
  }
  function wire(z) {
    const g = (id) => z.querySelector('#' + id);
    g('wbgo') &&
      (g('wbgo').onclick = async () => {
        const name = g('wbfn').value.trim(),
          maxHp = Math.round(+g('wbfh').value),
          er = g('wbfe');
        er.textContent = '';
        if (name.length < 3) return (er.textContent = T('wb_err_name'));
        if (!(maxHp >= 500 && maxHp <= 1000000)) return (er.textContent = T('wb_err_hp'));
        g('wbgo').disabled = true;
        try {
          S.streak = 0;
          S.q = null;
          S.ans = null;
          await createBoss({ name, sub: g('wbfs').value.trim(), cls: g('wbfc').value, maxHp, tier: +g('wbfd').value, mon: g('wbfm').value });
          window.AU && AU.sfx('arise');
        } catch (e) {
          er.textContent = e && e.code === 'permission-denied' ? T('wb_err_rules') : T('wb_err_fail');
        }
        g('wbgo') && (g('wbgo').disabled = false);
      });
    g('wbsel') &&
      (g('wbsel').onchange = (e) => {
        S.sel = e.target.value;
        S.q = null;
        const b = current();
        subHits(b ? b.id : null);
        paint();
      });
    g('wbend') && (g('wbend').onclick = () => confirm(T('wb_c_confirm_end')) && current() && endBoss(current(), 'retreat').catch(failMsg));
    g('wbdel') && (g('wbdel').onclick = () => confirm(T('wb_c_confirm_del')) && current() && delBoss(current()).catch(failMsg));
    g('wbproj') &&
      (g('wbproj').onclick = () => {
        S.proj = !S.proj;
        z.classList.toggle('wbproj', S.proj);
        g('wbproj').textContent = T(S.proj ? 'wb_c_exit' : 'wb_c_proj');
        try {
          if (S.proj && z.requestFullscreen) z.requestFullscreen().catch(() => {});
          else if (!S.proj && document.fullscreenElement) document.exitFullscreen();
        } catch (e) {

        }
        patch(false);
      });
  }
  document.addEventListener('fullscreenchange', () => {
    const z = $z();
    if (!document.fullscreenElement && S.proj && z) {
      S.proj = false;
      z.classList.remove('wbproj');
      const b = q$('#wbproj');
      b && (b.textContent = T('wb_c_proj'));
      patch(false);
    }
  });

  function refresh() {
    const z = $z();
    if (!z || !S.mounted) return;
    const b = current(),
      key = (b ? b.id : '-') + phase(b) + (isT() ? 't' : 's');
    if (key !== S.key && !typing()) paint();
    else patch(false);
    isT() && b && finalize(b);
  }
  function onHits() {
    const b = current();
    if (S.mounted && b && b.id === S.bid) refresh();
  }
  function onBosses() {
    try {
      const b = current();
      if (S.mounted) {
        subHits(b ? b.id : null);
        refresh();
      }
      notify();
    } catch (e) {
      console.warn('WBoss.onBosses', e);
    }
  }
  const badge = () => {
    try {
      const a = bosses().find((b) => b.status === 'active' && relevant(b));
      return a && me().role === 'student' && !/^#\/worldboss/.test(location.hash) ? ' <span class="nbadge wbpulse">!</span>' : '';
    } catch (e) {
      return '';
    }
  };
  function notify() {
    const u = me();
    if (!u || u.role !== 'student') return;
    const a = bosses().find((b) => b.status === 'active' && relevant(b));
    if (a && !S.notified.has(a.id)) {
      S.notified.add(a.id);
      if (!/^#\/worldboss/.test(location.hash)) {
        window.Sys && Sys.pop(T('wb_toast'), 'warn', 4200);
        window.AU && AU.sfx('arise');
      }
    }
    const link = document.querySelector('#nav a[data-go="#/worldboss"]');
    if (link) {
      const old = link.querySelector('.nbadge');
      old && old.remove();
      link.insertAdjacentHTML('beforeend', badge());
    }
  }

  function stopSim() {
    clearTimeout(S.simT);
    S.simT = 0;
  }
  function startSim() {
    stopSim();
    if (cloud()) return;
    const loop = () => {
      const b = current();
      if (S.mounted && b && b.id === S.bid && phase(b) === 'active') {
        const nm = SIM_NAMES[ri(0, SIM_NAMES.length - 1)],
          crit = Math.random() < 0.14,
          o = lread(),
          l = (o.hits[b.id] = o.hits[b.id] || []);
        l.push({ id: rid('h'), t: Date.now(), uid: 'S:' + nm, by: nm, dmg: Math.round((160 + Math.random() * 190) * (crit ? 2 : 1)), crit, combo: crit ? 3 : ri(1, 2), sim: 1 });
        if (l.length > 600) l.splice(0, l.length - 600);
        lwrite(o);
        localHits();
        onHits();
      }
      S.simT = setTimeout(loop, 3500 + Math.random() * 4500);
    };
    S.simT = setTimeout(loop, 2500);
  }
  addEventListener('storage', (e) => {
    if (e.key !== LK || cloud()) return;
    S.bid && localHits();
    onBosses();
    onHits();
  });
  function unmount() {
    S.mounted = false;
    unsubHits();
    clearInterval(S.lockT);
    clearTimeout(S.moodT);
    stopSim();
    S.proj = false;
    try {
      document.fullscreenElement && document.exitFullscreen();
    } catch (e) {

    }
  }
  let hashBound = false;
  function mount() {
    S.mounted = true;
    const b = current();
    subHits(b ? b.id : null);
    paint();
    startSim();
    if (!hashBound) {
      hashBound = true;
      addEventListener('hashchange', () => !/^#\/worldboss/.test(location.hash) && unmount());
    }
    notify();
  }
  const reset = () => {
    unmount();
    S.notified.clear();
    S.finalSent = {};
  };

  V.worldboss = () =>
    `<div class="sys rv wbh"><small class="tag">${T('wb_tag')}</small><h2>${T('wb_title')}</h2><p class="mut">${isT() ? T('wb_intro_t') : T('wb_intro_s')}</p></div><div id="wbz"></div>`;
  V.worldboss.post = mount;
  return { choices, onBosses, reset, badge, calcDmg, state: () => S, phase, current, board, mount, unmount };
})();
