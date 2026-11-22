'use strict';

window.Sync = (() => {
  const S = { on: false, unsubs: [], th: [], rp: [], prof: {}, psig: null, warned: false, got: {} };
  const live = () => !!(window.Cloud && Cloud.ok && Cloud.ok() && window.FB);
  const str = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');
  const arr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, 300).map((x) => x.slice(0, 40)) : []);
  const idOk = (v) => typeof v === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(v);
  const RANKS = () => ['all'].concat(RK.map((r) => r.c));
  const rid = () => 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const tid = () => 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const fail = (e) => {
    console.warn('sync gagal', e);
    const c = (e && e.code) || '';
    toast(c === 'permission-denied' ? 'Ditolak server. Pastikan firestore.rules Tahap 2 sudah di-Publish.' : 'Gagal menyimpan ke cloud, coba lagi.');
    assemble(true);
  };
  const run = (p) => Promise.resolve(p).catch(fail);

  const fsig = (l) =>
    (l || [])
      .map((t) => [t.id, t.pin ? 1 : 0, t.title, (t.likes || []).length, (t.replies || []).map((r) => [r.id, r.best ? 1 : 0, (r.likes || []).length, r.body.length].join(':')).join(',')].join('|'))
      .join(';');
  const asig = (l) => (l || []).map((x) => x.id + x.text).join(';');
  const refresh = (() => {
    let t = 0;
    return () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (!DB.me || !me() || typeof typingNow === 'function' && typingNow()) return;
        const h = location.hash || '';
        if (!/^#\/(forum|thread|dash|class|analysis)/.test(h)) return;
        const y = scrollY;
        route();
        scrollTo(0, y);
      }, 350);
    };
  })();
  function assemble(force) {
    if (!S.on || !S.got.forum || !S.got.forumReplies) return;
    const rp = {};
    S.rp.forEach((r) => (rp[r.tid] = rp[r.tid] || []).push(r));
    const list = S.th
      .filter((t) => idOk(t._id) && typeof t.title === 'string')
      .map((t) => ({
        id: t._id,
        rank: RANKS().includes(t.rank) ? t.rank : 'all',
        title: str(t.title, 90),
        body: str(t.body, 1000),
        by: str(t.by, 24),
        ts: +t.ts || 0,
        pin: !!t.pin,
        likes: arr(t.likes),
        cloud: 1,
        replies: (rp[t._id] || [])
          .filter((r) => idOk(r._id))
          .sort((a, b) => (+a.ts || 0) - (+b.ts || 0))
          .map((r) => ({ id: r._id, by: str(r.by, 24), body: str(r.body, 1000), ts: +r.ts || 0, likes: arr(r.likes), best: !!r.best })),
      }))
      .sort((a, b) => b.ts - a.ts);
    const changed = fsig(list) !== fsig(DB.forum);
    DB.forum = list;
    DB.forumSrc = 'cloud';
    try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (_) {}
    if (changed || force) refresh();
  }
  function assembleAnn() {
    const list = S.an
      .filter((a) => idOk(a._id) && typeof a.text === 'string')
      .map((a) => ({ id: a._id, text: str(a.text, 300), by: str(a.by, 24), ts: +a.ts || 0 }))
      .sort((x, y) => y.ts - x.ts)
      .slice(0, 30);
    const changed = asig(list) !== asig(DB.ann);
    DB.ann = list;
    DB.annSrc = 'cloud';
    try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (_) {}
    if (changed) refresh();
  }

  const err = (n) => (e) => {
    console.warn('watch ' + n, e);
    if (!S.warned) {
      S.warned = true;
      toast(e && e.code === 'permission-denied' ? 'Forum cloud belum aktif: Publish firestore.rules Tahap 2 di Firebase Console.' : 'Sinkron forum terputus, mencoba lagi...');
    }
  };
  S.an = [];
  S.cgl = [];
  S.wb = [];
  S.start = () => {
    if (S.on || !live()) return;
    S.on = true;
    S.got = {};
    S.warned = false;

    if (DB.forumSrc !== 'cloud') DB.forumLocal = DB.forum || [];
    if (DB.annSrc !== 'cloud') DB.annLocal = DB.ann || [];
    if (DB.cfgSrc !== 'cloud') DB.cfgLocal = DB.cfg || null;
    DB.forum = [];
    DB.ann = [];
    S.unsubs = [
      FB.watchCol('forum', (l) => { S.th = l; S.got.forum = 1; assemble(); }, err('forum')),
      FB.watchCol('forumReplies', (l) => { S.rp = l; S.got.forumReplies = 1; assemble(); }, err('forumReplies')),
      FB.watchCol('announcements', (l) => { S.an = l; assembleAnn(); }, err('announcements')),
      FB.watchDoc(
        'settings',
        'raid',
        (d) => {
          const was = JSON.stringify(DB.cfg || null);
          if (d && Number.isFinite(d.raidSec) && Number.isFinite(d.raidN))
            DB.cfg = { raidSec: Math.min(300, Math.max(20, d.raidSec | 0)), raidN: Math.min(20, Math.max(3, d.raidN | 0)), v: 2 };
          else delete DB.cfg;
          DB.cfgSrc = 'cloud';
          if (was !== JSON.stringify(DB.cfg || null)) {
            try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (_) {}
            if (location.hash === '#/analysis') refresh();
          }
        },
        err('settings'),
      ),

      FB.watchCol(
        'customGates',
        (l) => {
          S.cgl = l.map((d) => Object.assign({}, d, { id: d._id }));
          window.Gates && Gates.onChange();
        },
        err('customGates'),
      ),

      FB.watchCol(
        'worldBoss',
        (l) => {
          S.wb = l;
          window.WBoss && WBoss.onBosses();
        },
        err('worldBoss'),
      ),
      FB.watchCol(
        'profiles',
        (l) => {
          const o = {};
          l.forEach((p) => {
            if (typeof p.name !== 'string' || !window.Avatar) return;
            const a = Avatar.clean(p.av, p.ph);
            o[p.name] = { role: p.role === 'teacher' ? 'teacher' : 'student', av: a && a.av, ph: a && a.ph };
          });
          const sg = (x) => Object.entries(x).map(([n, v]) => n + ((v.av && v.av.ts) || 0) + v.role).join('|');
          const ch = sg(o) !== sg(S.prof);
          S.prof = o;
          if (ch && window.Avatar) Avatar.refreshAll();
        },
        err('profiles'),
      ),
    ];
  };
  S.stop = () => {
    S.unsubs.forEach((f) => { try { f(); } catch (_) {} });
    S.unsubs = [];
    if (!S.on) return;
    S.on = false;
    S.th = S.rp = S.an = [];
    S.cgl = [];
    S.wb = [];
    window.WBoss && WBoss.reset();
    S.prof = {};
    S.psig = null;

    DB.forum = DB.forumLocal || [];
    DB.ann = DB.annLocal || [];
    if (DB.cfgLocal) DB.cfg = DB.cfgLocal;
    else delete DB.cfg;
    DB.forumSrc = DB.annSrc = DB.cfgSrc = 'local';
    delete DB.forumLocal;
    delete DB.annLocal;
    delete DB.cfgLocal;
    try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (_) {}
  };
  S.isOn = () => S.on && live();
  S.bosses = () => S.wb;

  S.threadAdd = (t) =>
    run(FB.setIn('forum', t.id, { id: t.id, rank: t.rank, title: t.title, body: t.body, by: DB.me, uid: Cloud.uid, ts: t.ts, pin: false, likes: [] }));
  S.replyAdd = (tId, r) =>
    run(FB.setIn('forumReplies', r.id, { id: r.id, tid: tId, by: DB.me, uid: Cloud.uid, body: r.body, ts: r.ts, likes: [], best: false }));
  S.like = (tId, on) => run(FB.arrIn('forum', tId, 'likes', DB.me, on));
  S.rlike = (rId, on) => run(FB.arrIn('forumReplies', rId, 'likes', DB.me, on));
  S.pin = (tId, on) => run(FB.updateIn('forum', tId, { pin: !!on }));
  S.best = (tId, rId) => {
    const off = S.rp.filter((r) => r.tid === tId && r.best && r._id !== rId).map((r) => r._id);
    return run(FB.setBest(off, rId));
  };
  S.rdel = (rId) => run(FB.delIn('forumReplies', rId));
  S.tdel = (tId) => run(FB.delMany([['forum', tId]].concat(S.rp.filter((r) => r.tid === tId).map((r) => ['forumReplies', r._id]))));
  S.newThreadId = tid;
  S.newReplyId = rid;

  S.annAdd = (text) => {
    const id = 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    return run(FB.setIn('announcements', id, { id, text, by: DB.me, uid: Cloud.uid, ts: Date.now() }));
  };
  S.annDel = (id) => run(FB.delIn('announcements', id));
  S.saveCfg = (raidSec, raidN) => run(FB.setIn('settings', 'raid', { raidSec, raidN, v: 2, by: DB.me, ts: Date.now() }));

  S.gates = () => S.cgl;

  S.gateSave = (g) => FB.setIn('customGates', g.id, g);
  S.gateDel = (id) => FB.delIn('customGates', id);

  S.role = (n) => (S.prof[n] && S.prof[n].role) || '';
  S.avatarOf = (n) => S.prof[n] || null;

  S.pushProfile = async (u) => {
    if (!S.on || !u || !u.uid) return;
    const sig = JSON.stringify(u.av || null) + (u.ph ? u.ph.length : 0) + u.role;
    if (sig === S.psig) return;
    await FB.setIn('profiles', u.uid, { uid: u.uid, name: u.name, role: u.role, av: u.av || null, ph: u.av && u.av.k === 'photo' ? u.ph || null : null, updatedAt: Date.now() });
    S.psig = sig;
  };
  return S;
})();
