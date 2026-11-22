'use strict';

window.Bat = (() => {
  const MAXHP = 100,
    MAX_SUMMON = 3,
    HEAL_PCT = 0.25,
    RESCUE_SEC = 8,
    RESCUE_HP = 50;
  const SOLDIERS = ['0', 'E', 'D', 'C', 'B', 'A', 'S', 'R'];
  const BUFF = {
    Pemulih: { ic: 'crystal', n: 'Pemulih', d: 'Memulihkan 25% HP yang hilang', sfx: 'heal' },
    Pengintai: { ic: 'radar', n: 'Pengintai', d: 'Menghapus 1 opsi jawaban salah', sfx: 'arise' },
    Pelindung: { ic: 'shield', n: 'Pelindung', d: 'Perisai kebal untuk 1 jawaban salah', sfx: 'shield' },
  };
  const ic = (n, s) => (window.IC ? IC(n, s) : '');
  const uname = () => (typeof DB !== 'undefined' && DB.me) || '_';
  const LSK = () => 'ad_bt_' + uname();
  let mem = {},
    memFor = null;
  const load = () => {
    if (memFor === uname()) return mem;
    memFor = uname();
    try {
      mem = JSON.parse(localStorage.getItem(LSK()) || '{}') || {};
    } catch (e) {
      mem = {};
    }
    return mem;
  };
  const store = () => {
    try {
      localStorage.setItem(LSK(), JSON.stringify(load()));
    } catch (e) {

    }
  };

  const soldierInfo = (c) => {
    if (c === 'R') return { c, n: 'Raja Parabola', role: 'Penguasa Kurva', buff: 'Pemulih', col: '#ff9a5a' };
    const m = Mon.info(c);
    return m ? { c, n: m.n, role: m.role, buff: m.buff, col: m.col } : null;
  };
  const army = (u) => SOLDIERS.filter((c) => u && u.done && u.done[c]).map(soldierInfo).filter(Boolean);
  const monName = (c) => (c === 'R' || c === 'RAID' ? (Co.get('raja') || {}).name || 'Raja Parabola' : (Mon.info(c) || {}).n || '?');

  const key = (c) => c;
  const st = (c) => {
    const m = load();
    if (!m[key(c)]) m[key(c)] = { hp: MAXHP, sh: 0, used: [], down: 0 };
    return m[key(c)];
  };
  const dmgOf = (c) => (c === 'R' ? 34 : c === 'RAID' ? 15 : Mon.dmg(c));
  const left = (c) => {
    const u = me(),
      a = army(u).length,
      s = st(c);
    return Math.max(0, Math.min(MAX_SUMMON, a) - s.used.length);
  };

  const active = (c) => c !== 'P' && c !== 'T';
  const blocked = (c) => active(c) && st(c).hp <= 0;

  const curItem = (c) => {
    if (c === 'RAID') return typeof RD !== 'undefined' && RD && RD.items && RD.items[RD.i] ? RD.items[RD.i].it : null;
    return Q[c] && Q[c][RS.qi] ? Q[c][RS.qi] : null;
  };
  const root = (c) => (c === 'RAID' ? document.getElementById('rdz') : document.getElementById('rk'));

  const monFig = (c, mood) => {
    if (c === 'R' || c === 'RAID') {
      const ch = Co.get('raja');
      return ch ? ch.svg(mood === 'atk' ? 'smug' : mood === 'ko' ? 'ko' : mood === 'hurt' ? 'wow' : 'happy') : '';
    }
    return Mon.svg(c, mood);
  };
  const hpCls = (p) => (p > 60 ? 'hi' : p > 30 ? 'mid' : 'lo');
  const playerBar = (c) => {
    const s = st(c),
      p = Math.max(0, Math.round((s.hp / MAXHP) * 100));
    return `<div class="phpw"><div class="php ${hpCls(p)}"><i style="width:${p}%"></i></div><small class="phpt">HP Hunter ${Math.max(0, s.hp)}/${MAXHP}${s.sh ? ' | Perisai aktif' : ''}</small></div>`;
  };
  const sumBtn = (c) => {
    const n = army(me()).length,
      l = left(c);
    if (!n) return `<button class="btn ghost bsum off" id="bsum" data-c="${c}" disabled>${ic('crown', 16)} Panggil Bayangan (0)</button>`;
    return `<button type="button" class="btn bsum ${l ? '' : 'off'}" id="bsum" data-c="${c}" ${l ? '' : 'disabled'}>${ic('crown', 16)} Panggil Bayangan (${l})</button>`;
  };

  function html(c, items) {
    if (c === 'P' || c === 'T') return '';
    const u = me(),
      n = items.length,
      okc = items.filter((_, j) => (u.st[c + j] || {}).ok).length,
      ans = items.filter((_, j) => (u.st[c + j] || {}).done).length,
      hp = Math.round((1 - okc / n) * 100),
      fin = ans === n,
      s = st(c),
      boss = c === 'S' || c === 'R',
      mood = s.hp <= 0 ? 'atk' : fin ? (hp === 0 ? 'ko' : 'idle') : RS.hit === 'miss' ? 'atk' : RS.hit === 'hit' ? 'hurt' : 'idle',
      dm = dmgOf(c);
    const mi = Mon.info(c);
    return `<div class="battle v11 ${RS.hit || ''} ${RS.hit === 'miss' ? 'hurtp' : ''}" data-c="${c}"><div class="bmon"><div class="bfig bigmon">${monFig(c, mood)}</div><div class="binfo"><b>${monName(c)}${boss ? ' (Boss)' : ''}</b><small class="mut">${mi ? mi.role : 'Raja terakhir'}</small><div class="hp"><i style="width:${hp}%"></i></div><small class="mut">${
      fin ? (hp === 0 ? 'Tumbang! Kamu menang telak!' : 'Kabur dengan sisa ' + hp + '% HP. Coba lagi lain waktu!') : 'HP monster ' + hp + '%. Jawab benar untuk menyerang!'
    }</small><small class="dmgnote">Serangan balik: -${dm} HP tiap jawaban salah</small></div></div><div class="bpl"><div class="bplh"><span class="bpav">${window.Avatar ? Avatar.html(u.name, 38) : ''}</span><b>${esc(u.name)}</b></div>${playerBar(c)}<div class="bact">${sumBtn(c)}</div>${armyChips()}</div></div>`;
  }
  function armyChips() {
    const a = army(me());
    if (!a.length) return `<small class="mut chipnote">Taklukkan dungeon untuk mengekstrak prajurit bayangan.</small>`;
    return `<div class="chips">${a.map((x) => `<span class="chip" title="${esc(x.n)}: ${esc(x.buff)}" style="--c:${x.col}">${x.c === '0' ? 'G' : x.c}</span>`).join('')}</div>`;
  }
  function refresh(c) {
    const r = root(c);
    if (!r) return;
    const b = r.querySelector('.battle.v11');
    if (!b) return;
    const w = b.querySelector('.phpw');
    if (w) w.outerHTML = playerBar(c);
    const bs = b.querySelector('.bact');
    if (bs) bs.innerHTML = sumBtn(c);
  }
  const retrig = (el, cls, ms = 700) => {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  };

  function onWrong(c) {
    if (!active(c)) return;
    const s = st(c),
      r = root(c),
      b = r && r.querySelector('.battle.v11'),
      fig = b && b.querySelector('.bfig');
    if (fig) fig.innerHTML = monFig(c, 'atk');
    retrig(b, 'hurtp');
    retrig(fig, 'lunge', 800);
    AU.sfx('mAtk');
    if (s.sh) {
      s.sh = 0;
      store();
      setTimeout(() => AU.sfx('shield'), 200);
      Sys.pop('Perisai bayangan menahan serangan!', 'good');
      refresh(c);
      return;
    }
    const d = dmgOf(c);
    s.hp = Math.max(0, s.hp - d);
    store();
    setTimeout(() => AU.sfx('hurt'), 260);
    setTimeout(() => {
      Sys.shake(Math.min(2, d / 18));
      Sys.flash('#ff2a4a');
    }, 260);
    Sys.pop('-' + d + ' HP (' + monName(c) + ')', 'dmg');
    refresh(c);
    if (s.hp <= 0) {
      s.down = 1;
      store();
      setTimeout(() => koUI(c), 1100);
    }
  }
  function onRight(c) {
    if (!active(c)) return;
    const r = root(c),
      b = r && r.querySelector('.battle.v11'),
      fig = b && b.querySelector('.bfig');
    AU.sfx('atk');
    if (fig) {
      fig.innerHTML = monFig(c, 'hurt');
      retrig(b, 'hit', 700);
    }
  }
  function onClear(c) {
    AU.sfx('ko');
  }

  function modal(h, id = 'bm11') {
    let m = document.getElementById(id);
    if (m) m.remove();
    m = document.createElement('div');
    m.id = id;
    m.className = 'v11m';
    m.innerHTML = `<div class="sys v11box">${h}</div>`;
    document.body.appendChild(m);
    return m;
  }
  const closeModal = (id = 'bm11') => {
    const m = document.getElementById(id);
    if (m) m.remove();
  };
  function koUI(c) {
    if (!document.getElementById('app') || document.getElementById('app').hidden) return;
    AU.sfx('down');
    const m = modal(
      `<small class="tag">[ SYSTEM ] HUNTER TUMBANG</small><h2>HP kamu habis</h2><p class="mut">${monName(c)} terlalu kuat untuk saat ini. Pulihkan dirimu atau ulangi pertempuran Gate ini dari awal.</p><div class="v11act"><button class="btn" id="bkr">Pulihkan diri (${RESCUE_SEC} detik)</button><button class="btn ghost" id="bkx">${c === 'RAID' ? 'Akhiri Raid' : 'Ulangi pertempuran Gate'}</button></div><p class="mut sm" id="bkn"></p>`,
    );
    m.querySelector('#bkr').onclick = () => rescue(c, m);
    m.querySelector('#bkx').onclick = () => {
      closeModal();
      restart(c);
    };
  }
  function rescue(c, m) {
    const b = m.querySelector('#bkr'),
      x = m.querySelector('#bkx'),
      n = m.querySelector('#bkn');
    b.disabled = x.disabled = true;
    let t = RESCUE_SEC;
    AU.sfx('heal');
    const iv = setInterval(() => {
      t--;
      n.textContent = 'Meditasi... ' + t + ' detik';
      if (t <= 0) {
        clearInterval(iv);
        const s = st(c);
        s.hp = RESCUE_HP;
        s.down = 0;
        store();
        closeModal();
        AU.sfx('heal');
        Sys.pop('HP dipulihkan ke ' + RESCUE_HP + '. Lanjutkan pertempuran!', 'heal');
        if (c === 'RAID') {
          refresh(c);
          if (typeof RD !== 'undefined' && RD && RD.pend) {
            RD.pend = 0;
            typeof raidAdvance === 'function' && raidAdvance();
          }
        } else {
          typeof paint === 'function' && paint();
        }
      }
    }, 1000);
    n.textContent = 'Meditasi... ' + t + ' detik';
  }
  function restart(c) {
    const s = st(c);
    s.hp = MAXHP;
    s.sh = 0;
    s.used = [];
    s.down = 0;
    store();
    if (c === 'RAID') {
      if (typeof RD !== 'undefined' && RD) {
        RD.hpOut = 1;
        typeof raidFinish === 'function' && raidFinish();
      }
      return;
    }
    const u = me();
    (Q[c] || []).forEach((_, j) => {
      if (u.st[c + j]) delete u.st[c + j];
    });
    save();
    RS.qi = 0;
    RS.step = typeof stepsOf === 'function' ? Math.max(0, stepsOf(c).indexOf('Soal')) : 3;
    typeof paint === 'function' && paint();
    Sys.pop('Pertempuran diulang. HP penuh!', 'info');
  }

  function openSummon(c) {
    if (c === 'P' || c === 'T') return;
    const u = me(),
      a = army(u),
      s = st(c),
      l = left(c);
    if (!a.length) return Sys.pop('Belum ada prajurit bayangan. Taklukkan dungeon dulu.', 'warn');
    if (!l) return Sys.pop('Prajurit bayangan sudah terpakai di pertempuran ini.', 'warn');
    AU.sfx('arise');
    Sys.flash('#9a5aff');
    const it = curItem(c),
      canElim = it && it.t === 'mc';
    const rows = a
      .map((x) => {
        const used = s.used.includes(x.c),
          b = BUFF[x.buff];
        let why = '';
        if (x.buff === 'Pemulih' && s.hp >= MAXHP) why = 'HP masih penuh';
        if (x.buff === 'Pelindung' && s.sh) why = 'Perisai sudah aktif';
        if (x.buff === 'Pengintai' && !canElim) why = 'Hanya untuk soal pilihan ganda';
        const dis = used || why;
        return `<button class="srow ${dis ? 'dis' : ''}" data-s="${x.c}" ${dis ? 'disabled' : ''} style="--c:${x.col}"><span class="sfig">${x.c === 'R' ? Co.get('raja').svg('happy') : Mon.shadow(x.c, 54)}</span><span class="stx"><b>${esc(Mon.sname(x.n))}</b><small>${ic(b.ic, 13)} ${b.n}: ${b.d}</small><em>${used ? 'Sudah dipanggil' : why || 'Siap dipanggil'}</em></span></button>`;
      })
      .join('');
    const m = modal(
      `<small class="tag">[ SYSTEM ] ARISE</small><h2>Panggil Bayangan</h2><p class="mut">Pilih prajurit bayangan. Sisa panggilan di pertempuran ini: <b>${l}</b></p><div class="srows">${rows}</div><p><button class="btn ghost" id="bsx">Batal</button></p>`,
      'bsm11',
    );
    m.querySelector('#bsx').onclick = () => closeModal('bsm11');
    m.querySelectorAll('.srow').forEach((b) => (b.onclick = () => summon(c, b.dataset.s)));
  }
  function summon(c, code) {
    const x = soldierInfo(code),
      s = st(c);
    if (!x || s.used.includes(code) || left(c) <= 0) return;
    closeModal('bsm11');
    const b = BUFF[x.buff];
    let msg = '';
    if (x.buff === 'Pemulih') {
      const lost = MAXHP - s.hp,
        add = Math.max(1, Math.ceil(lost * HEAL_PCT));
      if (lost <= 0) return Sys.pop('HP masih penuh.', 'warn');
      s.hp = Math.min(MAXHP, s.hp + add);
      s.down = 0;
      msg = '+' + add + ' HP dipulihkan';
    } else if (x.buff === 'Pelindung') {
      if (s.sh) return Sys.pop('Perisai sudah aktif.', 'warn');
      s.sh = 1;
      msg = 'Perisai kebal aktif untuk 1 jawaban salah';
    } else {
      const it = curItem(c);
      if (!it || it.t !== 'mc') return Sys.pop('Hanya untuk soal pilihan ganda.', 'warn');
      if (!eliminate(c, it)) return Sys.pop('Tidak ada opsi salah yang tersisa.', 'warn');
      msg = '1 opsi salah dihapus';
    }
    s.used.push(code);
    store();
    AU.sfx(b.sfx);
    if (b.sfx !== 'arise') setTimeout(() => AU.sfx('arise'), 120);
    ariseFx(x, msg);
    refresh(c);
  }
  function eliminate(c, it) {
    const r = root(c);
    if (!r) return false;
    const labs = [...r.querySelectorAll('.opts label')].filter((l) => {
      const i = l.querySelector('input');
      return i && !i.disabled && !l.classList.contains('elim') && !it.a.includes(+i.value);
    });
    if (!labs.length) return false;
    const l = labs[Math.floor(Math.random() * labs.length)];
    l.classList.add('elim');
    const i = l.querySelector('input');
    i.checked = false;
    i.disabled = true;
    return true;
  }
  function ariseFx(x, msg) {
    const o = document.getElementById('ovl');
    if (o) {
      o.innerHTML = `<div class="ariseov"><small class="tag">[ SYSTEM ]</small><h2>ARISE!</h2><div class="shfig" style="--c:${x.col}">${x.c === 'R' ? Co.get('raja').svg('happy') : Mon.shadow(x.c, 120)}</div><p>${esc(Mon.sname(x.n))}</p></div>`;
      o.hidden = false;
      setTimeout(() => (o.hidden = true), 1500);
    }
    Sys.pop(msg, 'good', 2400);
  }

  function extract(c) {
    const x = soldierInfo(c);
    if (!x) return;
    AU.sfx('arise');
    Sys.flash('#9a5aff');
    const o = document.getElementById('ovl');
    if (o) {
      o.innerHTML = `<div class="ariseov"><small class="tag">[ SYSTEM ] SHADOW EXTRACTION</small><h2>ARISE!</h2><div class="shfig big" style="--c:${x.col}">${c === 'R' ? Co.get('raja').svg('happy') : Mon.shadow(c, 150)}</div><p>${esc(Mon.sname(x.n))} bergabung ke pasukanmu</p><p class="mut">${esc(BUFF[x.buff].n)}: ${esc(BUFF[x.buff].d)}</p></div>`;
      o.hidden = false;
      setTimeout(() => (o.hidden = true), 2600);
    }
  }

  function hall() {
    const a = army(me());
    AU.sfx('arise');
    Sys.flash('#9a5aff');
    const o = document.getElementById('ovl');
    if (!o) return;
    o.innerHTML = `<div class="ariseov"><small class="tag">[ SYSTEM ]</small><h2>ARISE!</h2><p>${a.length ? 'Pasukan bayangan dipanggil: ' + a.length + ' prajurit' : 'Belum ada prajurit bayangan. Taklukkan dungeon untuk mengekstraknya.'}</p><div class="shrow">${a.map((x) => `<div class="shfig" style="--c:${x.col}">${x.c === 'R' ? Co.get('raja').svg('happy') : Mon.shadow(x.c, 76)}</div>`).join('')}</div></div>`;
    o.hidden = false;
    setTimeout(() => (o.hidden = true), 2200);
  }

  function intro(c) {
    if (c === 'P' || c === 'T') return '';
    const mi = Mon.info(c),
      nm = monName(c);
    return `<div class="monintro"><div class="bfig bigmon">${monFig(c, 'idle')}</div><div><small class="tag">[ SYSTEM ] MONSTER PENJAGA</small><h3>${nm}</h3><p class="mut">${mi ? mi.role : 'Boss terakhir'}</p><p class="dmgnote">Serangan balik: -${dmgOf(c)} HP tiap jawaban salah</p></div></div>`;
  }

  function raidState() {
    return st('RAID');
  }
  function raidStartReset() {
    const s = st('RAID');
    s.hp = MAXHP;
    s.sh = 0;
    s.used = [];
    s.down = 0;
    store();
  }
  function raidHud(code) {
    const s = st('RAID'),
      p = Math.max(0, Math.round((s.hp / MAXHP) * 100)),
      mi = Mon.info(code);
    return `<div class="battle v11 raidhud" data-c="RAID"><div class="bmon"><div class="bfig">${monFig(code === 'R' ? 'R' : code, 'idle')}</div><div class="binfo"><b>${monName(code)}</b><small class="dmgnote">Serangan balik: -${dmgOf('RAID')} HP tiap jawaban salah</small></div></div><div class="bpl"><div class="bact">${sumBtn('RAID')}</div>${playerBar('RAID')}</div></div>`;
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('#bsum');
    if (b && !b.disabled) openSummon(b.dataset.c);
  });

  return {
    MAXHP,
    MAX_SUMMON,
    BUFF,
    SOLDIERS,
    army,
    soldierInfo,
    html,
    intro,
    st,
    left,
    active,
    blocked,
    onWrong,
    onRight,
    onClear,
    koUI,
    extract,
    hall,
    raidHud,
    raidStartReset,
    raidState,
    dmgOf,
    refresh,
    restart,
    monName,
    monFig,
    closeModal,
  };
})();
