'use strict';

window.GMap = (() => {
  const W = 960,
    H = 560;

  const POS = {
    P: [74, 478],
    0: [196, 418],
    E: [322, 476],
    D: [456, 402],
    C: [386, 284],
    B: [540, 232],
    A: [694, 286],
    S: [834, 170],
    R: [704, 96],
    T: [548, 70],
  };

  const SIDE = [
    ['raid', 590, 470, 'D', '#/raid', 'Raid Waktu', 'bolt'],
    ['chars', 214, 290, 'C', '#/chars', 'Guild Hall', 'hunter'],
    ['arch', 806, 372, 'A', '#/archive', 'Arsip Bayangan', 'crown'],
    ['redgate', 96, 352, '0', '#/redgate', 'Endless Red Gate', 'gate'],
    ['wboss', 884, 252, 'S', '#/worldboss', 'World Boss Raid', 'swords'],
  ];
  const ORDER = ['P', '0', 'E', 'D', 'C', 'B', 'A', 'S', 'R', 'T'];
  const ic = (n, x, y, s) => (window.ICS ? ICS(n, x, y, s) : '');
  const MONPOS = { 0: [-6, -92], E: [-10, -96], D: [18, 38], C: [-76, -84], B: [-80, -90], A: [36, -92], S: [26, -96], R: [-86, -78] };

  const seg = (p0, p1, p2, p3) => {
    const t = 0.18,
      c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t],
      c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    return `M${p1[0]} ${p1[1]}C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  };
  const stOf = (u, c) => {
    const i = RK.findIndex((r) => r.c === c);
    return i < 0 ? 'locked' : state(u, i);
  };
  const fog = () => {
    let s = '';
    for (let i = 0; i < 18; i++) {
      const x = (i * 163 + 40) % W,
        y = (i * 97 + 60) % H,
        r = 50 + ((i * 37) % 60);
      s += `<circle class="gfog" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${-(i * 1.7).toFixed(1)}s;animation-duration:${16 + (i % 5) * 4}s"/>`;
    }
    for (let i = 0; i < 28; i++) {
      const x = (i * 211 + 17) % W,
        y = (i * 131 + 23) % H;
      s += `<circle class="gspk" cx="${x}" cy="${y}" r="${1 + (i % 3) * 0.7}" style="animation-delay:${-(i * 0.43).toFixed(2)}s"/>`;
    }
    return s;
  };
  const monIcon = (c, x, y, s, u) => {
    const stt = stOf(u, c),
      p = MONPOS[c];
    if (!p) return '';
    const mx = x + p[0],
      my = y + p[1];
    if (stt === 'done') return `<g class="gmon done" transform="translate(${mx} ${my})">${(c === 'R' ? '' : Mon.shadow(c, 64).replace('<svg ', '<svg x="0" y="0" '))}</g>`;
    let svg;
    if (c === 'R') svg = Co.get('raja').svg(stt === 'locked' ? 'sad' : 'smug').replace('<svg ', '<svg width="64" height="64" ');
    else svg = Mon.svg(c, 'idle', 64);
    return `<g class="gmon ${stt}" transform="translate(${mx} ${my})">${svg}</g>`;
  };
  const node = (c, u, cur) => {
    const [x, y] = POS[c],
      r = RK.find((k) => k.c === c),
      stt = stOf(u, c),
      col = r.col;
    const tst = stt === 'current' ? 'cur' : stt;
    let h = `<g class="gnode ${tst}" data-g="${c}" tabindex="0" role="button" aria-label="${r.n}: ${r.t}" style="--col:${col}">`;
    if (stt !== 'locked') h += `<circle class="glow" cx="${x}" cy="${y}" r="44" fill="${col}" opacity=".18"/>`;
    h += `<circle class="ring r1" cx="${x}" cy="${y}" r="30" style="transform-origin:${x}px ${y}px"/><circle class="ring r2" cx="${x}" cy="${y}" r="22" style="transform-origin:${x}px ${y}px"/><circle class="core" cx="${x}" cy="${y}" r="16"/>`;
    h += ic(Ico.RICON[c] || 'gate', x, y, 20);
    if (stt === 'done') h += `<g transform="translate(${x + 18} ${y - 28})"><circle r="9" fill="#4cc38a"/><path d="M-4 0l3 3 5-6" stroke="#06210f" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    if (stt === 'locked') h += `<g transform="translate(${x + 18} ${y - 28})"><circle r="9" fill="#2a3166"/><rect x="-4" y="-1" width="8" height="6" rx="1.2" fill="#8e9ad0"/><path d="M-2.6 -1v-2.4a2.6 2.6 0 015.2 0V-1" fill="none" stroke="#8e9ad0" stroke-width="1.6"/></g>`;
    h += `<text class="glab" x="${x}" y="${y + 52}" text-anchor="middle">${r.n}</text><text class="gsub" x="${x}" y="${y + 67}" text-anchor="middle">${r.t}</text></g>`;
    return h + monIcon(c, x, y, 64, u);
  };
  const side = (s, u) => {
    const [id, x, y, , , name, icn] = s;
    return `<g class="gnode side" data-s="${id}" tabindex="0" role="button" aria-label="${name}"><circle class="glow" cx="${x}" cy="${y}" r="30" fill="#9a5aff" opacity=".18"/><circle class="ring r1" cx="${x}" cy="${y}" r="20" style="transform-origin:${x}px ${y}px"/><circle class="core" cx="${x}" cy="${y}" r="12"/>${ic(icn, x, y, 15)}<text class="glab sm" x="${x}" y="${y + 36}" text-anchor="middle">${name}</text></g>`;
  };
  function svg(u) {
    const cur = RK.find((r, i) => state(u, i) === 'current');
    const pts = ORDER.map((c) => POS[c]);
    const P = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
    let paths = '';
    for (let i = 0; i < ORDER.length - 1; i++) {
      const a = ORDER[i],
        b = ORDER[i + 1],
        d = seg(P(i - 1), P(i), P(i + 1), P(i + 2)),
        reached = !!(u.done[a]),
        going = reached && !u.done[b] && stOf(u, b) !== 'locked';
      paths += `<path class="gpath base" d="${d}"/><path class="gpath lit ${reached ? 'on' : ''} ${going ? 'go' : ''}" d="${d}"/>`;
    }
    let br = '';
    SIDE.forEach((s) => {
      const from = POS[s[3]],
        d = `M${from[0]} ${from[1]}Q${(from[0] + s[1]) / 2 + 20} ${(from[1] + s[2]) / 2 - 30} ${s[1]} ${s[2]}`;
      br += `<path class="gpath base br" d="${d}"/><path class="gpath lit br ${u.done[s[3]] ? 'on' : ''}" d="${d}"/>`;
    });

    let hunter = '';
    const hc = cur ? cur.c : 'T';
    if (POS[hc]) {
      const [x, y] = POS[hc];
      hunter = `<g class="ghunter" transform="translate(${x} ${y - 56})"><g class="hbob"><path d="M0 28l-10-14a14 14 0 1120 0z" fill="#ffd86b" stroke="#6a4a00" stroke-width="1.6"/><circle cy="0" r="10" fill="#0b1030" stroke="#ffd86b" stroke-width="2"/><text y="4" text-anchor="middle" font-size="11" font-weight="800" fill="#ffd86b">${esc((u.name || '?').trim().charAt(0).toUpperCase())}</text></g></g>`;
    }
    return `<svg class="gmapsvg" viewBox="0 0 ${W} ${H}" role="group" aria-label="Peta Dungeon"><defs><radialGradient id="gbgr" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#1a2260"/><stop offset=".6" stop-color="#0b1030"/><stop offset="1" stop-color="#05071a"/></radialGradient><filter id="gblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter></defs><rect width="${W}" height="${H}" rx="16" fill="url(#gbgr)"/><g class="ggrid" opacity=".5">${Array.from({ length: 13 }, (_, i) => `<path d="M${i * 80} 0V${H}" /><path d="M0 ${i * 50}H${W}"/>`).join('')}</g>${fog()}${window.Gm247 ? Gm247.skySVG() : ''}<g class="gpaths">${br}${paths}</g>${ORDER.filter((c) => POS[c]).map((c) => node(c, u, cur)).join('')}${SIDE.map((s) => side(s, u)).join('')}${hunter}<text class="gcompass" x="${W - 28}" y="38" text-anchor="end">HUNTER ASSOCIATION // GATE MAP</text></svg>`;
  }
  const legend = () =>
    `<div class="glegend"><span><i class="lg done"></i>Ditaklukkan</span><span><i class="lg cur"></i>Gate aktif</span><span><i class="lg open"></i>Terbuka</span><span><i class="lg locked"></i>Terkunci</span><span><i class="lg hunt"></i>Posisi Hunter</span></div>`;
  function panel(c, u) {
    const r = RK.find((k) => k.c === c),
      i = RK.indexOf(r),
      stt = state(u, i),
      mi = Mon.info(c),
      isR = c === 'R';
    const mon = mi ? `${mi.n} (${mi.role}). Serangan balik: -${mi.dmg} HP tiap jawaban salah.` : isR ? 'Raja Parabola (Boss akhir). Serangan balik: -34 HP tiap jawaban salah.' : 'Tes ini tidak ada monsternya.';
    const lab = { done: 'Ditaklukkan', current: 'Gate aktif', open: 'Terbuka', locked: 'Terkunci' }[stt];
    const sh = Bat.army(u).find((x) => x.c === c);
    return `<div class="sys gpanel" style="--col:${r.col}"><span class="badge" style="background:${r.col}">${RI(c)}</span><div class="gpt"><small class="tag">[ SYSTEM ] GATE ${r.n.toUpperCase()} | ${lab}</small><h3>${r.n}: ${r.t}</h3><p class="mut">${mon}</p><p class="mut sm">${r.xp ? 'Hadiah: +' + r.xp + ' XP' : 'Tanpa XP'}${sh ? ' | Prajurit bayangan: Shadow ' + esc(sh.n) : ''}</p></div><div class="gpa">${
      stt === 'locked' ? '<button class="btn ghost" disabled>Gate terkunci</button>' : `<button class="btn" data-go="#/rank/${c}">${stt === 'done' ? 'Masuk lagi' : 'Masuk Gate'}</button>`
    }</div></div>`;
  }
  function view() {
    const u = me(),
      cur = RK.find((r, i) => state(u, i) === 'current');
    return `<div class="sys rv"><small class="tag">[ SYSTEM ] PETA DUNGEON</small><h2>Quadratic Function Dungeon</h2><p class="mut">Taklukkan dungeon secara berurutan. Tiap dungeon terbuka setelah yang sebelumnya selesai. Ketuk gerbang untuk melihat monster penjaganya.</p></div><div class="gmapw rv">${svg(u)}</div>${legend()}<div id="gpanel">${panel(cur ? cur.c : 'T', u)}</div><h3 class="rv">Pretest, Gerbang, dan Part 1 (Rank E, D, C)</h3>${ladder(u, RK.filter((r) => r.c === 'P' || r.c === '0' || r.part === 1))}<h3 class="rv">Part 2 (Rank B, A, S), Wrap-up, dan Posttest</h3>${ladder(u, RK.filter((r) => r.part === 2 || r.c === 'T'))}`;
  }
  function post() {
    const u = me(),
      w = document.querySelector('.gmapw');
    if (!w) return;
    const pick = (el) => {
      const c = el.dataset.g;
      if (c) {
        const i = RK.findIndex((r) => r.c === c);
        document.getElementById('gpanel').innerHTML = panel(c, u);
        w.querySelectorAll('.gnode.sel').forEach((n) => n.classList.remove('sel'));
        el.classList.add('sel');
        if (state(u, i) === 'locked') {
          AU.sfx('bad');
          Sys.pop('Gate terkunci. Taklukkan gate sebelumnya dulu.', 'warn');
        } else AU.sfx('ok');
        return;
      }
      const s = SIDE.find((x) => x[0] === el.dataset.s);
      if (s) window.Gm247 ? Gm247.enter(s[4]) : (location.hash = s[4]);
    };
    w.querySelectorAll('.gnode').forEach((n) => {
      n.addEventListener('click', () => pick(n));
      n.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick(n)));
    });
  }
  return { view, post, svg, panel, POS, ORDER };
})();

V.map = () => GMap.view();
V.map.post = () => GMap.post();
