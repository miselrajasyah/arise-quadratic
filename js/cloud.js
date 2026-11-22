'use strict';

window.Cloud = (() => {
  const DEV = (() => {
    try {
      let d = localStorage.getItem('arise_dev');
      if (!d) localStorage.setItem('arise_dev', (d = Math.random().toString(36).slice(2, 10)));
      return d;
    } catch (_) {
      return 'x' + Math.random().toString(36).slice(2, 8);
    }
  })();
  const C = {
    ready: false,
    failed: false,
    uid: null,
    verified: true,
    timer: 0,
    unsub: null,
    lastOthers: 0,
    status: '',
    busy: 0,
  };
  const ok = () => C.ready && window.FB && FB.current() && me() && me().uid === FB.current().uid;

  const hunterRank = (u) => {
    const n = AX.find((r) => !u.done[r.c]);
    return n ? n.c : 'S';
  };
  const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
  const CODES = RK.map((r) => r.c);

  const sanitize = (d, self) => {
    if (!d || typeof d.name !== 'string' || !NAME_RE.test(d.name)) return null;
    const u = {
      name: d.name,
      role: d.role === 'teacher' ? 'teacher' : 'student',
      uid: String(d.uid || ''),
      email: self ? String(d.email || '') : '',
      pw: '',
      cloud: 1,
      streak: num(d.streak, 1),
      last: typeof d.last === 'string' ? d.last.slice(0, 10) : today(),
      bonus: num(d.bonus),
      cls: window.Cls ? Cls.norm(d.cls) : '',
      clsAt: num(d.clsAt),
      resetAt: num(d.resetAt),
      createdAt: num(d.createdAt),
      done: {},
      st: {},
    };
    CODES.forEach((c) => {
      const x = d.done && d.done[c];
      if (x && typeof x === 'object')
        u.done[c] = { score: num(x.score), xp: num(x.xp), ts: num(x.ts), up: typeof x.up === 'string' ? x.up.slice(0, 40) : undefined };
      if (u.done[c] && u.done[c].up === undefined) delete u.done[c].up;
    });
    if (d.raid && typeof d.raid === 'object') {
      u.raid = {
        best: num(d.raid.best),
        runs: (Array.isArray(d.raid.runs) ? d.raid.runs : []).slice(0, 10).map((r) => ({
          ts: num(r && r.ts),
          ok: num(r && r.ok),
          n: num(r && r.n),
          pts: num(r && r.pts),
          sec: num(r && r.sec),
        })),
      };
    }

    if (d.mis && typeof d.mis === 'object') {
      u.mis = {};
      Object.entries(d.mis).slice(0, 60).forEach(([k, v]) => {
        if (/^[A-Za-z]{2,24}$/.test(k)) u.mis[k] = num(v);
      });
    }
    if (d.rg && typeof d.rg === 'object')
      u.rg = {
        best: num(d.rg.best),
        xp: num(d.rg.xp),
        runs: (Array.isArray(d.rg.runs) ? d.rg.runs : []).slice(0, 10).map((r) => ({ ts: num(r && r.ts), floor: num(r && r.floor), score: num(r && r.score), acc: num(r && r.acc) })),
      };

    if (d.wb && typeof d.wb === 'object') {
      u.wb = {};
      Object.entries(d.wb).slice(0, 30).forEach(([k, x]) => {
        if (!/^[A-Za-z0-9_-]{1,40}$/.test(k) || !x || typeof x !== 'object') return;
        u.wb[k] = { dmg: num(x.dmg), xp: num(x.xp), ts: num(x.ts), mc: num(x.mc) };
      });
    }

    if (window.Forge) Object.assign(u, Forge.clean(d));
    if (d.cg && typeof d.cg === 'object') {
      u.cg = {};
      Object.entries(d.cg).slice(0, 200).forEach(([k, x]) => {
        if (!/^[A-Za-z0-9_-]{1,40}$/.test(k) || !x || typeof x !== 'object') return;
        u.cg[k] = { att: num(x.att), done: x.done ? 1 : 0, ok: x.ok ? 1 : 0, xp: num(x.xp), ts: num(x.ts), pick: num(x.pick, -1) };
      });
    }
    if (d.st && typeof d.st === 'object')
      Object.entries(d.st).forEach(([k, s]) => {
        if (!/^[A-Z0-9]\d{1,2}$/.test(k) || !s || typeof s !== 'object') return;
        const o = { att: num(s.att), done: s.done ? 1 : 0, ok: !!s.ok, score: num(s.score) };
        if (s.hint) o.hint = 1;
        if (typeof s.hp === 'number' && s.hp >= 0 && s.hp <= 10) o.hp = s.hp;
        if (s.ex) o.ex = 1;
        if (typeof s.v === 'string') o.v = s.v.slice(0, 2000);
        else if (Array.isArray(s.v)) o.v = s.v.slice(0, 8).map((x) => String(x).slice(0, 200));
        if (Array.isArray(s.sel)) o.sel = s.sel.slice(0, 5).map((x) => num(x));
        u.st[k] = o;
      });

    u.pr = {};
    if (d.pr && typeof d.pr === 'object')
      Object.entries(d.pr).slice(0, 120).forEach(([k, s]) => {
        if (!/^[A-Z0-9]\d{1,2}$/.test(k) || !s || typeof s !== 'object') return;
        const o = { att: num(s.att), done: s.done ? 1 : 0, ok: s.ok ? 1 : 0, score: num(s.score), h: Math.min(2, num(s.h)), ts: num(s.ts) };
        if (Array.isArray(s.sel)) o.sel = s.sel.slice(0, 5).map((x) => num(x));
        if (Array.isArray(s.v)) o.v = s.v.slice(0, 8).map((x) => String(x).slice(0, 200));
        u.pr[k] = o;
      });
    u.wl = {};
    if (d.wl && typeof d.wl === 'object')
      Object.entries(d.wl).slice(0, 300).forEach(([k, x]) => {
        if (!/^[pq]:[A-Z0-9]\d{1,2}$/.test(k) || !x || typeof x !== 'object') return;
        u.wl[k] = { w: Math.min(99, num(x.w)), r: Math.min(9, num(x.r)), ts: num(x.ts) };
      });
    if (self) {
      if (typeof d.co === 'string' && CHARS.some((c) => c.id === d.co)) u.co = d.co;
      if (Array.isArray(d.seen)) u.seen = d.seen.filter((x) => CHARS.some((c) => c.id === x));
      if (d.dq && typeof d.dq === 'object')
        u.dq = {
          d: String(d.dq.d || ''),
          p: Object.assign({}, d.dq.p || {}),
          c: Object.assign({}, d.dq.c || {}),
        };
      if (d.prefs && typeof d.prefs === 'object') u.prefs = d.prefs;

      if (window.Avatar) {
        const a = Avatar.clean(d.av, d.ph);
        if (a) {
          u.av = a.av;
          if (a.ph) u.ph = a.ph;
        }
      }
    }
    return u;
  };

  const merge = (a, b) => {
    if (b.resetAt > a.resetAt)
      return Object.assign({}, b, { co: b.co || a.co, prefs: b.prefs || a.prefs, av: b.av || a.av, ph: b.ph || a.ph });
    if (a.resetAt > b.resetAt) return a;
    const o = Object.assign({}, a);
    o.done = Object.assign({}, b.done);
    Object.entries(a.done).forEach(([c, x]) => {
      const y = o.done[c];
      if (!y || num(x.ts) > num(y.ts) || (num(x.ts) === num(y.ts) && x.xp >= y.xp)) o.done[c] = x;
    });
    o.st = Object.assign({}, b.st);
    Object.entries(a.st).forEach(([k, x]) => {
      const y = o.st[k];
      if (!y || (x.done && !y.done) || (!!x.done === !!y.done && x.att > y.att)) o.st[k] = x;
    });

    o.pr = Object.assign({}, b.pr || {});
    Object.entries(a.pr || {}).forEach(([k, x]) => {
      const y = o.pr[k];
      if (!y || (x.done && !y.done) || (!!x.done === !!y.done && (x.att > y.att || (x.att === y.att && (x.ts || 0) >= (y.ts || 0))))) o.pr[k] = x;
    });
    o.wl = Object.assign({}, b.wl || {});
    Object.entries(a.wl || {}).forEach(([k, x]) => {
      const y = o.wl[k];
      if (!y) o.wl[k] = x;
      else {
        const nw = (x.ts || 0) >= (y.ts || 0) ? x : y;
        o.wl[k] = { w: Math.max(x.w, y.w), r: nw.r, ts: Math.max(x.ts || 0, y.ts || 0) };
      }
    });
    o.bonus = Math.max(a.bonus || 0, b.bonus || 0);

    o.cls = (a.clsAt || 0) >= (b.clsAt || 0) ? a.cls || b.cls || '' : b.cls || a.cls || '';
    o.clsAt = Math.max(a.clsAt || 0, b.clsAt || 0);
    o.streak = Math.max(a.streak || 1, b.streak || 1);
    o.last = (a.last || '') >= (b.last || '') ? a.last : b.last;
    const ra = a.raid || { best: 0, runs: [] },
      rb = b.raid || { best: 0, runs: [] },
      seen = new Set(),
      runs = [...ra.runs, ...rb.runs]
        .filter((r) => !seen.has(r.ts) && seen.add(r.ts))
        .sort((x, y) => y.ts - x.ts)
        .slice(0, 10);
    if (ra.best || rb.best || runs.length) o.raid = { best: Math.max(ra.best, rb.best), runs };

    if (a.mis || b.mis) {
      o.mis = Object.assign({}, b.mis);
      Object.entries(a.mis || {}).forEach(([k, v]) => (o.mis[k] = Math.max(o.mis[k] || 0, v)));
    }
    if (a.rg || b.rg) {
      const x = a.rg || { best: 0, xp: 0, runs: [] },
        y = b.rg || { best: 0, xp: 0, runs: [] },
        sn = new Set();
      o.rg = {
        best: Math.max(x.best, y.best),
        xp: Math.max(x.xp, y.xp),
        runs: [...x.runs, ...y.runs].filter((r) => !sn.has(r.ts) && sn.add(r.ts)).sort((p, q) => q.ts - p.ts).slice(0, 10),
      };
    }
    if (a.wb || b.wb) o.wb = Object.assign({}, b.wb, a.wb);
    if (window.Forge) Object.assign(o, Forge.merge(a, b));
    if (a.cg || b.cg) {
      o.cg = Object.assign({}, b.cg);
      Object.entries(a.cg || {}).forEach(([k, x]) => {
        const y = o.cg[k];
        if (!y || (x.done && !y.done) || (!!x.done === !!y.done && x.att > y.att)) o.cg[k] = x;
      });
    }

    const da = a.dq,
      db_ = b.dq;
    if (da && db_) {
      if (da.d === db_.d) {
        const p = Object.assign({}, db_.p),
          c = Object.assign({}, db_.c);
        Object.entries(da.p || {}).forEach(([k, v]) => (p[k] = Math.max(p[k] || 0, v)));
        Object.assign(c, da.c || {});
        o.dq = { d: da.d, p, c };
      } else o.dq = da.d > db_.d ? da : db_;
    } else o.dq = da || db_;

    o.co = b.co || a.co;
    o.seen = Array.from(new Set([...(a.seen || []), ...(b.seen || [])]));
    o.prefs = b.prefs || a.prefs;

    const ta = (a.av && a.av.ts) || 0,
      tb = (b.av && b.av.ts) || 0;
    if (a.av || b.av) {
      const w = ta > tb ? a : b;
      o.av = w.av || a.av || b.av;
      o.ph = w.ph || (w === a ? b.ph : a.ph);
      if (o.av && o.av.k !== 'photo') delete o.ph;
    }
    return o;
  };

  const payload = (u) => {
    const xp = xpOf(u),
      full = {
        uid: u.uid,
        email: u.email || '',
        name: u.name,
        role: u.role,
        rank: hunterRank(u),
        xp,
        title: titleOf(xp),
        done: u.done,
        st: u.st,
        pr: u.pr || {},
        wl: u.wl || {},
        streak: u.streak || 1,
        last: u.last || today(),
        bonus: u.bonus || 0,
        cls: u.cls || '',
        clsAt: u.clsAt || 0,
        raid: u.raid || null,
        mis: u.mis || null,
        rg: u.rg || null,
        cg: u.cg || null,
        wb: u.wb || null,
        ...(window.Forge ? Forge.pack(u) : {}),
        dq: u.dq || null,
        co: u.co || null,
        av: u.av || null,
        ph: u.av && u.av.k === 'photo' ? u.ph || null : null,
        seen: u.seen || [],
        prefs: { theme: DB.theme || 'violet', fs: DB.fs || 100, rm: !!DB.rm, coOff: !!DB.coOff },
        resetAt: u.resetAt || 0,
        createdAt: u.createdAt || Date.now(),
        updatedAt: Date.now(),
        dev: DEV,
      };
    if (u.role === 'teacher') full.teacherCode = u.teacherCode || '';

    return JSON.parse(JSON.stringify(full));
  };
  const applyPrefsFrom = (u) => {
    if (u.prefs) {
      DB.theme = u.prefs.theme || DB.theme;
      DB.fs = u.prefs.fs || DB.fs;
      DB.rm = u.prefs.rm != null ? u.prefs.rm : DB.rm;
      DB.coOff = u.prefs.coOff != null ? u.prefs.coOff : DB.coOff;
      applyPrefs();
    }
  };

  const setStatus = (s, tip) => {
    C.status = s;
    const e = document.getElementById('cst');
    if (!e) return;
    const L = {
      ok: ['Tersimpan di cloud', 'ok'],
      busy: ['Menyimpan...', 'busy'],
      off: ['Offline: tersimpan di perangkat', 'off'],
      err: ['Gagal sinkron, mencoba lagi', 'err'],
      local: ['Mode lokal', 'off'],
    }[s];
    e.hidden = !L;
    if (L) {
      e.textContent = '☁ ' + L[0];
      e.className = 'cs ' + L[1];
      e.title = tip || '';
    }
  };

  C.dirty = () => {
    if (!ok()) return;
    clearTimeout(C.timer);
    setStatus('busy');
    C.timer = setTimeout(C.push, 1500);
  };
  C.push = async () => {
    clearTimeout(C.timer);
    if (!ok()) return;
    const u = me(),
      full = payload(u);
    try {
      await FB.putMe(u.uid, full, u.role === 'student' ? FB.slim(full) : null);

      if (window.Sync) await Sync.pushProfile(u).catch((e) => console.warn('profil gagal', e));
      setStatus(navigator.onLine === false ? 'off' : 'ok', 'Terakhir: ' + new Date().toLocaleTimeString('id-ID'));
    } catch (e) {
      console.warn('push gagal', e);
      setStatus(navigator.onLine === false ? 'off' : 'err', String(e && e.code || e));
      if (navigator.onLine !== false) C.timer = setTimeout(C.push, 8000);
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && C.timer) C.push();
  });
  addEventListener('online', () => ok() && C.push());
  addEventListener('offline', () => C.uid && setStatus('off'));

  C.pull = async (user) => {
    let d = await FB.getMe(user.uid);
    if (!d) {

      let base = (user.displayName || (user.email || 'hunter').split('@')[0] || 'hunter')
        .replace(/[^\p{L}\p{N} ._-]/gu, '')
        .slice(0, 18);
      if (base.length < 2) base = 'hunter';
      for (let i = 0; i < 4 && !d; i++) {
        const name = i ? base + Math.floor(100 + Math.random() * 900) : base;
        if (!(await FB.nameFree(name))) continue;
        const p = Object.assign(mk(name, 'student', ''), { uid: user.uid, email: user.email, createdAt: Date.now() });
        delete p.pw;
        const f = payload(p);
        await FB.createProfile(user.uid, f);
        d = f;
      }
      if (!d) throw new Error('profil');
    }
    const remote = sanitize(d, true);
    if (!remote) throw new Error('profil-rusak');

    if (remote.role === 'teacher') remote.teacherCode = d.teacherCode || '';
    const old = DB.users[remote.name];
    const local = old && old.cloud && old.uid === remote.uid ? old : null;

    const u = local ? Object.assign(merge(local, remote), { uid: remote.uid, email: remote.email, cloud: 1, name: remote.name, role: remote.role, pw: '' }) : remote;
    if (remote.role === 'teacher') u.teacherCode = remote.teacherCode;
    DB.users[u.name] = u;
    DB.me = u.name;
    C.uid = u.uid;
    C.verified = !!user.emailVerified;
    applyPrefsFrom(u);
    localStorage.setItem(KEY, JSON.stringify(DB));

    const mergedXp = xpOf(u);
    if (mergedXp !== num(d.xp) || Object.keys(u.st).length !== Object.keys(remote.st).length) C.dirty();
    return u;
  };

  C.others = async (force) => {
    if (!ok()) return false;
    if (!force && Date.now() - C.lastOthers < 15000) return false;
    C.lastOthers = Date.now();
    try {
      const list = me().role === 'teacher' ? await FB.listStudentsFull() : await FB.listLeaderboard();
      const keep = {};
      const sig = () =>
        Object.values(DB.users)
          .filter((x) => x.cloud)
          .map((x) => x.name + ':' + xpOf(x) + ':' + Object.keys(x.st || {}).length + ':' + ((x.raid || {}).best || 0))
          .sort()
          .join('|');
      const before = sig();
      list.forEach((d) => {
        if (d.role !== 'student' || d.uid === C.uid) return;
        const u = sanitize(d, false);
        if (u) keep[u.name] = u;
      });

      Object.keys(DB.users).forEach((n) => {
        const x = DB.users[n];
        if (x.cloud && x.uid !== C.uid) delete DB.users[n];
      });
      Object.entries(keep).forEach(([n, u]) => {
        if (!DB.users[n] || DB.users[n].cloud) DB.users[n] = u;
      });
      localStorage.setItem(KEY, JSON.stringify(DB));
      return sig() !== before;
    } catch (e) {
      console.warn('others gagal', e);
      return false;
    }
  };

  const LIVE = ['#/dash', '#/map', '#/profile', '#/board', '#/chars', '#/settings', '#/help'];
  C.watch = () => {
    if (C.unsub) C.unsub();
    C.unsub = FB.watchMe(
      C.uid,
      (s) => {
        if (!s.exists() || s.metadata.hasPendingWrites) return;
        const d = s.data();
        if (d.dev === DEV || !ok()) return;
        const remote = sanitize(d, true);
        if (!remote) return;
        if (remote.role === 'teacher') remote.teacherCode = d.teacherCode || '';
        const u = me(),
          m = Object.assign(merge(u, remote), { uid: u.uid, email: u.email, cloud: 1, name: u.name, role: u.role, pw: '' });
        if (u.role === 'teacher') m.teacherCode = u.teacherCode;
        DB.users[u.name] = m;
        localStorage.setItem(KEY, JSON.stringify(DB));
        applyPrefsFrom(m);
        toast('Data dari perangkat lain tersinkron');
        if (LIVE.includes(location.hash || '#/dash')) route();
      },
      (e) => console.warn('watch error', e),
    );
  };

  setInterval(() => {
    if (!ok() || me().role !== 'teacher' || document.visibilityState !== 'visible') return;
    if (!['#/class', '#/analysis', '#/resp', '#/board'].includes(location.hash || '#/class')) return;
    C.others(true).then((ch) => ch && !typingNow() && route());
  }, 30000);

  const MSG = {
    'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan Masuk.',
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/weak-password': 'Password terlalu lemah (minimal 6 karakter).',
    'auth/invalid-credential': 'Email atau password salah.',
    'auth/user-not-found': 'Email atau password salah.',
    'auth/wrong-password': 'Email atau password salah.',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.',
    'auth/network-request-failed': 'Tidak ada koneksi internet. Coba lagi saat online.',
    'auth/user-disabled': 'Akun ini dinonaktifkan.',
    'auth/missing-password': 'Isi password dulu.',
    'permission-denied': 'Server menolak. Cek kode guru, atau nama sudah dipakai orang lain.',
    unavailable: 'Server tidak terjangkau. Cek koneksi internet.',
  };
  C.msg = (e) => MSG[e && e.code] || 'Terjadi kesalahan (' + ((e && (e.code || e.message)) || '?') + ').';

  C.register = async ({ name, email, pw, role, code, cls }) => {
    if (!window.FB) throw { code: 'unavailable' };
    if (!(await FB.nameFree(name).catch(() => true))) throw { code: 'nama-dipakai' };
    const p = mk(name, role, '');
    delete p.pw;
    p.cloud = 1;
    if (role === 'student' && cls) {
      p.cls = cls;
      p.clsAt = Date.now();
    }
    const prof = JSON.parse(JSON.stringify(payload(Object.assign(p, { uid: '', email }))));
    C.busy = 1;
    try {
      const r = await FB.register({ email, password: pw, profile: prof, teacherCode: code });
      C.busy = 0;
      await C.onUser(r.user, r.mailed);
      return r;
    } finally {
      C.busy = 0;
    }
  };

  C.onUser = (user, mailed) => {
    if (C.busy) return Promise.resolve();
    if (user && C.pullP && C.pullUid === user.uid) return C.pullP;
    const p = C._onUser(user, mailed);
    if (user) {
      C.pullP = p;
      C.pullUid = user.uid;
      p.finally(() => {
        if (C.pullP === p) C.pullP = C.pullUid = null;
      });
    }
    return p;
  };
  C._onUser = async (user, mailed) => {
    if (!user) {

      if (DB.me && me() && me().cloud) cloudSignedOut();
      return;
    }
    try {
      const u = await C.pull(user);
      C.verified = !!user.emailVerified;
      cloudAfterLogin(u, false, mailed);
    } catch (e) {
      console.warn('pull gagal', e);

      const cached = Object.values(DB.users).find((x) => x.cloud && x.uid === user.uid);
      if (cached) {
        DB.me = cached.name;
        C.uid = cached.uid;
        C.verified = !!user.emailVerified;
        setStatus('off');
        cloudAfterLogin(cached, true);
      } else {
        $('#er') && ($('#er').textContent = 'Gagal memuat data akun: ' + C.msg(e));
        try {
          await FB.logout();
        } catch (_) {}
      }
    }
  };

  C.purge = () => {
    Object.keys(DB.users).forEach((n) => DB.users[n].cloud && delete DB.users[n]);
    DB.me = null;
    save();
  };
  C.logout = async () => {
    clearTimeout(C.timer);
    if (ok()) await C.push().catch(() => {});
    window.Sync && Sync.stop();
    if (C.unsub) C.unsub();
    C.unsub = null;
    C.uid = null;
    try {
      FB && (await FB.logout());
    } catch (_) {}
    C.purge();
  };

  C.init = () => {
    const go = () => {
      C.ready = true;
      FB.onAuth(C.onUser);
    };
    if (window.FB) go();
    else if (window.FB === null) C.failed = true;
    else {
      document.addEventListener('fb-ready', go, { once: true });
      document.addEventListener('fb-fail', () => (C.failed = true), { once: true });
    }
  };
  Object.assign(C, { hunterRank, sanitize, merge, payload, setStatus, DEV, ok });
  return C;
})();
Cloud.init();
