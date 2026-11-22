'use strict';

const REMEDIAL = 70;
const SAFE = 75;

window.Sim = (() => {
  const RANKS = ['Unranked', 'E-Rank Hunter', 'D-Rank Hunter', 'C-Rank Hunter', 'B-Rank Hunter', 'A-Rank Hunter', 'S-Rank Hunter'];
  const xpFor = (n) => (n > 0 ? 50 : 0) + AX.slice(0, n).reduce((a, r) => a + r.xp, 0);
  const rankIc = (n) => (n > 0 ? AX[n - 1].c : '0');
  function section() {
    return `<section class="sec" id="sim"><h2 class="rv">Simulasi Sistem & Ranking Hunter</h2><p class="mut rv" style="margin-bottom:16px">Coba sistemnya sebelum masuk. Geser untuk melihat bagaimana gelar naik dari E-Rank sampai Shadow Monarch, lalu ubah kurva kuadrat langsung di halaman depan.</p><div class="grid2"><div class="card rv simcard" id="simr"><small class="tag">[ SYSTEM ] SIMULASI RANKING</small><h3>Dari E-Rank sampai Shadow Monarch</h3><label class="simsl">Dungeon yang ditaklukkan: <b id="srn">0</b> dari 6<input id="srs" type="range" min="0" max="6" step="1" value="0" aria-label="Dungeon yang ditaklukkan"></label><div class="simhero" id="srh"></div><div class="simladder" id="srl"></div></div><div class="card rv simcard" id="simc"><small class="tag">[ SYSTEM ] DEMO KURVA</small><h3>Mini Parabola Dungeon</h3><div class="simgraph" id="scg"></div><div class="simctl"><label>a = <b id="sav">1</b><input id="sa" type="range" min="-3" max="3" step="0.5" value="1" aria-label="a"></label><label>h = <b id="shv">0</b><input id="sh" type="range" min="-5" max="5" step="1" value="0" aria-label="h"></label><label>k = <b id="skv">0</b><input id="sk2" type="range" min="-5" max="5" step="1" value="0" aria-label="k"></label></div><div class="simread" id="scr"></div></div></div></section>`;
  }
  function ladder(n, xp) {
    const t = titleOf(xp);
    const T = TT.map((x) => x[1]);
    return (
      `<div class="sl-ranks">${RANKS.map((r, i) => `<span class="${i === n ? 'cur' : i < n ? 'done' : ''}">${i === 0 ? '-' : r.charAt(0)}</span>`).join('')}</div>` +
      `<div class="sl-titles">${TT.map((x) => `<div class="${x[1] === t ? 'cur' : xp >= x[0] ? 'done' : ''}"><b>${x[1]}</b><small>${x[0]} XP</small></div>`).join('')}</div>`
    );
  }
  function drawRank(n) {
    const xp = xpFor(n),
      c = rankIc(n),
      m = n > 0 && Mon.has(c) ? Mon.svg(c, n >= 6 ? 'ko' : 'idle', 92) : '';
    $('#srn').textContent = n;
    $('#srh').innerHTML = `<div class="simfig">${m}</div><div class="simtx"><b class="ttl">${RANKS[n]}</b><p class="mut">Gelar: ${titleOf(xp)}</p><p class="mut">${xp} XP | ${n > 0 ? n + 1 : 0} prajurit bayangan</p><div class="bar"><i style="width:${Math.min(100, (xp / 1200) * 100)}%"></i></div><small class="mut">${n > 0 ? 'Monster terakhir dikalahkan: ' + Mon.info(c).n : 'Belum ada monster dikalahkan. Mulai dari Gerbang.'}</small></div>`;
    $('#srl').innerHTML = ladder(n, xp);
  }
  const f2 = (v) => String(+v.toFixed(2)).replace('-', '\u2212');
  function drawCurve() {
    const a = +$('#sa').value || 0.5,
      h = +$('#sh').value,
      k = +$('#sk2').value,
      W = 360,
      H = 240,
      X = (x) => 20 + ((x + 8) / 16) * (W - 40),
      Y = (y) => H - 20 - ((y + 8) / 16) * (H - 40);
    let d = '';
    for (let i = 0; i <= 160; i++) {
      const x = -8 + (i / 160) * 16,
        y = a * (x - h) ** 2 + k;
      d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(Math.max(-9, Math.min(9, y))).toFixed(1);
    }
    let g = '';
    for (let i = -8; i <= 8; i += 2) g += `<path d="M${X(i)} 20V${H - 20}M20 ${Y(i)}H${W - 20}" stroke="#1e2a66" stroke-width="1"/>`;
    $('#scg').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik parabola"><defs><clipPath id="scc"><rect x="20" y="20" width="${W - 40}" height="${H - 40}"/></clipPath></defs><rect width="${W}" height="${H}" rx="12" fill="#0b1030"/>${g}<path d="M${X(0)} 20V${H - 20}M20 ${Y(0)}H${W - 20}" stroke="#8e9ad0" stroke-width="1.6"/><path d="M${X(h)} 20V${H - 20}" stroke="#9a5aff" stroke-width="1.6" stroke-dasharray="5 5"/><path clip-path="url(#scc)" d="${d}" fill="none" stroke="#5ee6f2" stroke-width="3.2" stroke-linecap="round"/><circle cx="${X(h)}" cy="${Y(k)}" r="6" fill="#ffd86b" stroke="#6a4a00" stroke-width="2"/></svg>`;
    $('#sav').textContent = a;
    $('#shv').textContent = h;
    $('#skv').textContent = k;
    const hx = h === 0 ? 'x' : h > 0 ? `(x - ${h})` : `(x + ${-h})`;
    const eq = `y = ${a === 1 ? '' : a === -1 ? '-' : a}${hx}^2 ${k < 0 ? '- ' + -k : k > 0 ? '+ ' + k : ''}`.trim();
    $('#scr').innerHTML = `<p>$${eq}$</p><p class="mut">Vertex: (${h}, ${k}) | Sumbu simetri: x = ${h}</p><p class="mut">${a > 0 ? 'Parabola terbuka ke atas' : 'Parabola terbuka ke bawah'} | ${Math.abs(a) > 1 ? 'Lebih sempit' : Math.abs(a) < 1 ? 'Lebih lebar' : 'Lebar standar'}</p><p class="mut">y-intercept: (0, ${f2(a * h * h + k)})</p>`;
  }
  function init() {
    if (!$('#srs')) return;
    $('#srs').oninput = (e) => {
      drawRank(+e.target.value);
      AU.sfx('click');
    };
    ['sa', 'sh', 'sk2'].forEach((id) => ($('#' + id).oninput = drawCurve));
    drawRank(0);
    drawCurve();
  }
  return { section, init };
})();

const flawless = (u, c) => {
  const it = Q[c] || [];
  return !!u.done[c] && it.length > 0 && it.every((_, j) => {
    const s = u.st[c + j] || {};
    return s.done && s.ok && s.att === 1 && !s.hint;
  });
};
const flawlessCount = (u) => 'EDCBAS'.split('').filter((c) => flawless(u, c)).length;

const ACH = [
  ['first', 'Pemburu Pertama', 'Taklukkan Gerbang pertamamu.', 'dagger', (u) => [!!u.done['0'], u.done['0'] ? '1/1' : '0/1']],
  ['flaw', 'Tanpa Cacat', 'Taklukkan satu dungeon dengan semua jawaban benar di percobaan pertama, tanpa petunjuk.', 'star', (u) => [flawlessCount(u) >= 1, Math.min(1, flawlessCount(u)) + '/1']],
  ['flaw3', 'Hunter Sempurna', 'Raih predikat Tanpa Cacat di 3 dungeon.', 'crown', (u) => [flawlessCount(u) >= 3, Math.min(3, flawlessCount(u)) + '/3']],
  ['raidk', 'Raja Raid', 'Jawab benar minimal 80% soal dalam satu Raid Waktu.', 'bolt', (u) => {
    const need = Math.max(1, Math.ceil(cfg().raidN * 0.8)),
      b = (u.raid || {}).best || 0;
    return [b >= need, Math.min(b, need) + '/' + need];
  }],
  ['raidv', 'Veteran Raid', 'Selesaikan 5 kali Raid Waktu.', 'swords', (u) => {
    const n = ((u.raid || {}).runs || []).length;
    return [n >= 5, Math.min(n, 5) + '/5'];
  }],
  ['six', 'Penakluk Enam Gerbang', 'Taklukkan Rank E, D, C, B, A, dan S.', 'gate', (u) => {
    const n = 'EDCBAS'.split('').filter((c) => u.done[c]).length;
    return [n === 6, n + '/6'];
  }],
  ['rs', 'Penakluk Rank S', 'Kalahkan Shadow Sovereign Monarch di Rank S.', 'crown', (u) => [!!u.done.S, u.done.S ? '1/1' : '0/1']],
  ['army', 'Komandan Pasukan', 'Kumpulkan 5 prajurit bayangan.', 'helm', (u) => {
    const n = Bat.army(u).length;
    return [n >= 5, Math.min(n, 5) + '/5'];
  }],
  ['xp', 'Shadow Monarch', 'Capai 1200 XP.', 'crystal', (u) => [xpOf(u) >= 1200, Math.min(xpOf(u), 1200) + '/1200']],
  ['gain', 'Lompatan Besar', 'Raih N-gain tinggi (0,7 atau lebih) antara pretest dan posttest.', 'trophy', (u) => {
    const g = ngain(u);
    return [g != null && g >= 0.7, g == null ? '-' : g.toFixed(2)];
  }],
];
const achList = (u) => ACH.map((a) => {
  const r = a[4](u);
  return { id: a[0], n: a[1], d: a[2], ic: a[3], ok: r[0], p: r[1] };
});
V.archive = () => {
  const u = me(),
    army = Bat.army(u),
    ach = achList(u),
    got = ach.filter((a) => a.ok).length;

  try {
    const k = 'ad_ach_' + u.name,
      seen = JSON.parse(localStorage.getItem(k) || '[]'),
      fresh = ach.filter((a) => a.ok && !seen.includes(a.id));
    if (fresh.length) {
      localStorage.setItem(k, JSON.stringify(ach.filter((a) => a.ok).map((a) => a.id)));
      if (seen.length || fresh.length) setTimeout(() => fresh.forEach((a) => Sys.pop('Pencapaian baru: ' + a.n, 'good', 2600)), 500);
    }
  } catch (e) {

  }
  const coll = Bat.SOLDIERS.map((c) => {
    const x = Bat.soldierInfo(c),
      d = u.done[c],
      r = RK.find((k) => k.c === c),
      b = Bat.BUFF[x.buff];
    return `<div class="card shcard rv ${d ? 'got' : 'lock'}" style="--c:${x.col}"><div class="shfigw">${
      c === 'R' ? Co.get('raja').svg(d ? 'happy' : 'sad') : Mon.shadow(c, 92)
    }</div><h3>${d ? esc(Mon.sname(x.n)) : '???'}</h3><p class="ttl sm">${d ? esc(x.role) : 'Prajurit tersembunyi'}</p><p class="mut sm">${
      d ? IC(b.ic, 13) + ' ' + b.n + ': ' + b.d : 'Taklukkan ' + r.n + ' untuk mengekstraknya.'
    }</p>${d ? `<small class="mut">Diekstrak di ${r.n} | skor ${d.score}</small>` : ''}${d ? `<p><button class="btn ghost sm spotbtn" type="button" data-spot="shadow:${c}">&#9654; Putar Intro / Spotlight</button></p>` : ''}</div>`;
  }).join('');
  return `<div class="sys rv"><small class="tag">[ SYSTEM ] ARSIP BAYANGAN</small><h2>Arsip Bayangan & Pencapaian</h2><p class="mut">Setiap dungeon yang kamu taklukkan mengekstrak satu prajurit bayangan permanen. Panggil mereka di pertempuran untuk buff nyata.</p><div class="grid4" style="margin-top:12px"><div class="card stat"><b data-n="${army.length}">0</b><span>Prajurit bayangan</span></div><div class="card stat"><b data-n="${got}">0</b><span>Pencapaian dari ${ach.length}</span></div><div class="card stat"><b data-n="${flawlessCount(u)}">0</b><span>Dungeon Tanpa Cacat</span></div><div class="card stat"><b data-n="${(u.raid || {}).best || 0}">0</b><span>Skor Raid terbaik</span></div></div></div><h3 class="rv">Koleksi Monster yang Diekstrak</h3><div class="grid4 shgrid">${coll}</div><h3 class="rv">Lencana Pencapaian</h3><div class="grid3">${ach
    .map(
      (a) =>
        `<div class="card ach rv ${a.ok ? 'ok' : ''}"><span class="achic">${IC(a.ok ? a.ic : 'starO', 26)}</span><div><b>${a.n}</b><p class="mut sm">${a.d}</p><small class="tagc">${a.ok ? 'Tercapai' : 'Progres ' + a.p}</small></div></div>`,
    )
    .join('')}</div>`;
};

const stuHealth = (s) => {
  const sc = AX.map((r) => (s.done[r.c] ? s.done[r.c].score : null)),
    dn = sc.filter((x) => x != null),
    avg = dn.length ? Math.round(dn.reduce((a, b) => a + b, 0) / dn.length) : 0,
    weak = AX.map((r, i) => ({ r, sc: sc[i] })).filter((x) => x.sc != null && x.sc < REMEDIAL),
    stuck = AX.filter((r) => !s.done[r.c] && (Q[r.c] || []).some((_, j) => {
      const t = s.st[r.c + j];
      return t && t.att > 0 && !t.ok && !t.done;
    })),
    prog = Math.round((RK.filter((r) => s.done[r.c]).length / RK.length) * 100);
  let status = 'Aman';
  if (!dn.length && !Object.keys(s.st || {}).length) status = 'Belum mulai';
  else if (weak.length || stuck.length || (dn.length && avg < REMEDIAL)) status = 'Butuh remedial';
  else if (avg < SAFE) status = 'Pantau';
  return { s, sc, avg, weak, stuck, prog, status, low: weak.slice().sort((a, b) => a.sc - b.sc)[0] };
};
const monData = () => {
  const all = students().sort((a, b) => xpOf(b) - xpOf(a)),
    H = all.map(stuHealth),
    byRank = AX.map((r, i) => {
      const need = H.filter((h) => h.weak.some((w) => w.r.c === r.c) || h.stuck.some((x) => x.c === r.c)),
        done = H.filter((h) => h.sc[i] != null),
        avg = done.length ? Math.round(done.reduce((a, h) => a + h.sc[i], 0) / done.length) : 0;
      return { r, need, avg, done: done.length };
    });
  return { all, H, byRank, ts: new Date() };
};
const csvEsc = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
const tl = (s) => (window.I18N ? I18N.t(s) : s);
function reportRows(D) {
  const head = [tl('Nama'), tl('Title'), 'XP', ...AX.map((r) => r.n), 'Pretest', 'Posttest', 'N-gain', tl('Progres') + ' %', tl('Status')];
  const rows = D.H.map((h) => [h.s.name, titleOf(xpOf(h.s)), xpOf(h.s), ...h.sc.map((x) => (x == null ? '' : x)), pre(h.s) ?? '', post(h.s) ?? '', fmt(ngain(h.s)), h.prog, tl(h.status)]);
  return { head, rows };
}
function downloadFile(name, mime, text) {
  const b = new Blob(['\ufeff' + text], { type: mime + ';charset=utf-8' }),
    a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 500);
}
function reportHTML(D) {
  const { head, rows } = reportRows(D),
    when = D.ts.toLocaleString(window.I18N ? I18N.locale() : 'id-ID'),
    n = D.H.length,
    cnt = (s) => D.H.filter((h) => h.status === s).length;
  return `<!doctype html><html lang="${window.I18N ? I18N.lang : 'id'}"><head><meta charset="utf-8"><title>${tl('Laporan Kelas')}: Shadow Monarch's Quadratic Dungeon</title><style>body{font:14px/1.5 Arial,sans-serif;color:#111;margin:24px}h1{font-size:22px;margin:0}h2{font-size:16px;margin:22px 0 6px;border-bottom:2px solid #4d8bff;padding-bottom:4px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #bbb;padding:4px 6px;text-align:left}th{background:#eef2ff}.s{display:flex;gap:12px;margin:10px 0}.s div{border:1px solid #bbb;border-radius:8px;padding:8px 12px}.bad{color:#b00020;font-weight:700}.ok{color:#0a7a3d;font-weight:700}small{color:#555}@media print{button{display:none}}</style></head><body><h1>${tl('Laporan Kelas')}: Shadow Monarch's Quadratic Dungeon</h1><small>${tl('Dibuat')}: ${when}</small><div class="s"><div><b>${n}</b><br>${tl('Siswa')}</div><div><b class="ok">${cnt('Aman')}</b><br>${tl('Aman')}</div><div><b>${cnt('Pantau')}</b><br>${tl('Pantau')}</div><div><b class="bad">${cnt('Butuh remedial')}</b><br>${tl('Butuh remedial')}</div><div><b>${cnt('Belum mulai')}</b><br>${tl('Belum mulai')}</div></div><h2>${tl('Analisis per dungeon')}</h2><table><tr><th>${tl('Dungeon')}</th><th>${tl('Rata-rata skor')}</th><th>${tl('Selesai')}</th><th>${tl('Butuh remedial')}</th></tr>${D.byRank
    .map((b) => `<tr><td>${b.r.n}: ${esc(tl(b.r.t))}</td><td>${b.avg}</td><td>${b.done}/${n}</td><td>${b.need.map((h) => esc(h.s.name)).join(', ') || '-'}</td></tr>`)
    .join('')}</table><h2>${tl('Daftar siswa')}</h2><table><tr>${head.map((x) => `<th>${esc(x)}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</table></body></html>`;
}
function printReport(D) {
  const f = document.createElement('iframe');
  f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(f);
  f.contentDocument.open();
  f.contentDocument.write(reportHTML(D));
  f.contentDocument.close();
  setTimeout(() => {
    try {
      f.contentWindow.focus();
      f.contentWindow.print();
    } catch (e) {
      toast('Tidak bisa membuka dialog cetak. Coba unduh laporan HTML.');
    }
    setTimeout(() => f.remove(), 2000);
  }, 400);
}
let MON_T = null;
V.monitor = () => {
  const D = monData(),
    n = D.H.length,
    cnt = (s) => D.H.filter((h) => h.status === s).length;
  const chip = (h) => `<span class="rem" title="${esc(h.s.name)}">${esc(h.s.name)}</span>`;
  const cards = D.byRank
    .map((b) => {
      const need = b.need.length;
      return `<div class="card mhc rv ${need ? 'warn' : 'good'}" style="--col:${b.r.col}"><div class="mhh"><span class="badge" style="background:${b.r.col}">${RI(b.r.c)}</span><div><b>${b.r.n}</b><small class="mut">${b.r.t}</small></div></div><div class="mhs"><div><b>${b.avg}</b><small>Rata-rata skor</small></div><div><b>${b.done}/${n}</b><small>Selesai</small></div><div><b class="${need ? 'bad' : ''}">${need}</b><small>Butuh remedial</small></div></div><div class="mhl">${need ? b.need.map(chip).join('') : '<small class="mut">Semua aman di Rank ini.</small>'}</div></div>`;
    })
    .join('');
  const tr = D.H.map(
    (h) =>
      `<tr class="pick" data-go="#/class"><td>${esc(h.s.name)}</td><td><div class="bar sm"><i style="width:${h.prog}%"></i></div>${h.prog}%</td><td>${h.avg || '-'}</td><td>${h.low ? h.low.r.n + ' (' + h.low.sc + ')' : h.stuck[0] ? h.stuck[0].n : '-'}</td><td><span class="hst ${h.status.replace(/\s/g, '')}">${h.status}</span></td></tr>`,
  ).join('');
  return `<div class="sys rv"><small class="tag">[ SYSTEM ] MONITOR LIVE</small><h2>Monitor Live & Ekspor Laporan</h2><p class="mut"><span class="livedot"></span><span id="monts">Diperbarui ${D.ts.toLocaleTimeString()}</span> | Data kelas dimuat ulang otomatis setiap 15 detik.</p><div class="v11act"><button class="btn" id="mprint">Cetak laporan</button><button class="btn ghost" id="mcsv">Unduh CSV</button><button class="btn ghost" id="mhtml">Unduh laporan HTML</button></div>${window.Tr ? Tr.teacherBox() : ''}</div><div class="grid4"><div class="card stat rv"><b data-n="${n}">0</b><span>Siswa</span></div><div class="card stat rv good"><b data-n="${cnt('Aman')}">0</b><span>Aman</span></div><div class="card stat rv"><b data-n="${cnt('Pantau')}">0</b><span>Pantau</span></div><div class="card stat rv warn"><b data-n="${cnt('Butuh remedial')}">0</b><span>Butuh remedial</span></div></div><h3 class="rv">Kesehatan Belajar per Rank</h3><div class="grid3">${cards}</div><div class="card rv"><small class="tag">[ SYSTEM ] KESEHATAN BELAJAR SISWA</small><table><tr><th>NAMA</th><th>PROGRES</th><th>RATA-RATA</th><th>RANK LEMAH</th><th>STATUS</th></tr>${tr || '<tr><td colspan="5" class="mut">Belum ada siswa.</td></tr>'}</table></div>`;
};
V.monitor.post = () => {
  const D = monData();
  $('#mprint').onclick = () => printReport(D);
  $('#mcsv').onclick = () => {
    const { head, rows } = reportRows(D);
    downloadFile('laporan-kelas-arise.csv', 'text/csv', [head, ...rows].map((r) => r.map(csvEsc).join(',')).join('\r\n'));
  };
  $('#mhtml').onclick = () => downloadFile('laporan-kelas-arise.html', 'text/html', reportHTML(D));
  clearInterval(MON_T);
  MON_T = setInterval(() => {
    if ((location.hash || '') !== '#/monitor') return clearInterval(MON_T);
    if (!window.Cloud || typingNow()) return;
    Cloud.others().then((ch) => ch && (location.hash || '') === '#/monitor' && !typingNow() && route());
  }, 15000);
};
