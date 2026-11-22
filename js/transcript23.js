'use strict';

window.Tr = (() => {
  const t = (s) => (window.I18N ? I18N.t(s) : s);
  const D = () => window.PRAC21 && PRAC21.Dx;
  const MINR = () => (window.PRAC21 ? PRAC21.MINR : 2);
  const dstr = () => new Date().toLocaleDateString(window.I18N ? I18N.locale() : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const num = (v) => (v == null || v === '' ? '-' : v);
  const catCls = (c) => (c === 'Tinggi' ? 'hi' : c === 'Sedang' ? 'md' : 'lo');

  const css = `
@page{size:A4;margin:12mm}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font:12px/1.35 'Segoe UI',Arial,'Noto Sans JP','Noto Sans KR',sans-serif;color:#111;margin:0;padding:18px}
.pg{max-width:780px;margin:0 auto 28px;padding:0}
.pg+.pg{break-before:page;page-break-before:always}
.hd{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border-bottom:3px solid #4d8bff;padding-bottom:8px;margin-bottom:10px}
h1{font-size:20px;margin:0}h2{font-size:13px;margin:10px 0 4px;color:#1f3d99;border-bottom:1px solid #c9d4f5;padding-bottom:3px;break-after:avoid}
.sub{color:#555;font-size:12px;margin:2px 0 0}
.id{display:grid;grid-template-columns:repeat(2,1fr);gap:4px 18px;font-size:13px;margin:6px 0}
.id b{display:inline-block;min-width:86px;color:#444}
.k{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:8px 0}
.k div{border:1px solid #b7c4ee;border-radius:8px;padding:4px 8px;text-align:center;background:#f4f7ff}
.k b{display:block;font-size:19px;line-height:1.2}.k small{color:#555;font-size:11px}
.hi{color:#0a7a3d}.md{color:#a06a00}.lo{color:#b3261e}
table{border-collapse:collapse;width:100%;font-size:12px}
th,td{border:1px solid #bbb;padding:2px 7px;text-align:center}th{background:#e8eefc}
td:first-child,th:first-child{text-align:left}tr{break-inside:avoid}
.dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:middle}
.ice{margin:6px 0}
.ir{margin:2px auto;padding:3px 8px;border-radius:6px;border:1px solid #bbb;display:flex;justify-content:space-between;gap:8px;font-size:12px;position:relative;overflow:hidden;break-inside:avoid}
.ir i{position:absolute;left:0;top:0;bottom:0;opacity:.28}
.ir span{position:relative}
.water{border-top:2px dashed #2a6fdb;margin:6px 0;text-align:center;font-size:10px;color:#2a6fdb;line-height:1}
.note{font-size:12px;margin:4px 0}
.ok{color:#0a7a3d}.bad{color:#b3261e}
.fm{font-size:11px;color:#555;margin-top:4px}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:14px;text-align:center;font-size:12px;break-inside:avoid}
.sg div{padding-top:30px}.sg div span{display:block;border-top:1px solid #333;padding-top:3px}
.ft{margin-top:10px;font-size:10px;color:#777;text-align:center}
.bar{display:none}
@media print{body{padding:0}.pg{margin:0}}
@media screen{body{background:#eef1fa}.pg{background:#fff;padding:20px;box-shadow:0 2px 14px rgba(0,0,0,.15);border-radius:6px}.bar{display:block;max-width:780px;margin:0 auto 12px;text-align:right}.bar button{padding:8px 16px;font-size:14px;border-radius:8px;border:1px solid #4d8bff;background:#4d8bff;color:#fff;cursor:pointer}}
@media (max-width:560px){body{padding:8px}.pg{padding:12px}.k{grid-template-columns:repeat(2,1fr)}.id{grid-template-columns:1fr}.sg{gap:12px}}
`;

  function page(u) {
    const dx = D(),
      E = esc;
    if (u.pr === undefined) u.pr = {};
    if (u.wl === undefined) u.wl = {};
    const pr = pre(u),
      po = post(u),
      ng = ngain(u),
      cat = ng == null ? null : ngCat(ng),
      xp = xpOf(u);
    const L = dx ? dx.layers(u) : [];
    const rk = dx ? dx.rank(u) : { strong: null, weak: null };
    const lyN = (l) => t(LAYER[l].n);

    const rows = RK.map((r) => {
      const d = u.done[r.c];
      return `<tr><td><span class="dot" style="background:${r.col}"></span>${E(t(r.n))}</td><td>${E(t(r.t))}</td><td><b>${d ? d.score : '-'}</b></td><td>${d && r.xp ? d.xp : '-'}</td><td class="${d ? 'ok' : 'bad'}">${d ? t('Selesai') : t('Belum')}</td></tr>`;
    }).join('');

    const lyRows = L.slice().reverse().map((x) => {
      const dl = x.pre != null && x.post != null ? x.post - x.pre : null;
      return `<tr><td><span class="dot" style="background:${LAYER[x.l].c}"></span>L${x.l} ${E(lyN(x.l))}</td><td>${num(x.avg == null ? null : x.avg + '%')}</td><td>${num(x.pre == null ? null : x.pre + '%')}</td><td>${num(x.post == null ? null : x.post + '%')}</td><td class="${dl == null ? '' : dl >= 0 ? 'ok' : 'bad'}">${dl == null ? '-' : (dl > 0 ? '+' : '') + dl}</td></tr>`;
    }).join('');
    const bars = L.slice().reverse().map((x, i) => {
      const w = x.avg || 0,
        inset = (4 - x.l) * 4;
      const row = `<div class="ir" style="width:${100 - inset * 2}%;border-color:${LAYER[x.l].c}"><i style="width:${w}%;background:${LAYER[x.l].c}"></i><span><b>L${x.l}</b> ${E(lyN(x.l))}</span><span><b>${x.avg == null ? '-' : x.avg + '%'}</b></span></div>`;
      return row + (x.l === 4 ? `<div class="water">${E(t('garis air'))}</div>` : '');
    }).join('');
    const act = Object.values(u.wl).filter((x) => x.r < MINR()).length,
      res = Object.values(u.wl).filter((x) => x.r >= MINR()).length;
    const pa = [].concat(...['0', 'E', 'D', 'C', 'B', 'A', 'S'].map((c) => (PQ[c] || []).map((_, i) => u.pr[c + i]))).filter((x) => x && x.done);
    const pavg = pa.length ? Math.round(pa.reduce((a, x) => a + (x.score || 0), 0) / pa.length) : null;
    const gainTxt = ng == null ? t('Belum lengkap: N-Gain dihitung otomatis setelah Pretest dan Posttest selesai.') : `(${po} − ${pr}) / (100 − ${pr}) = <b>${fmt(ng)}</b>`;
    return `<section class="pg">
<div class="hd"><div><h1>${E(t('Transkrip Evaluasi Pembelajaran'))}</h1><p class="sub">Shadow Monarch's Quadratic Dungeon | ${E(t('Fungsi Kuadrat'))} | ${E(t('Analisis Iceberg RME'))}</p></div><div class="sub" style="text-align:right">${E(t('Tanggal cetak'))}<br><b>${E(dstr())}</b></div></div>
<div class="id"><div><b>${E(t('Nama'))}</b>: ${E(u.name || '-')}</div><div><b>${E(t('Kelas'))}</b>: ${E(u.cls || '-')}</div><div><b>${E(t('Title Hunter'))}</b>: ${E(titleOf(xp))}</div><div><b>XP</b>: ${xp}</div></div>
<div class="k"><div><b>${num(pr)}</b><small>Pretest</small></div><div><b>${num(po)}</b><small>Posttest</small></div><div><b class="${cat ? catCls(cat) : ''}">${fmt(ng)}</b><small>N-Gain${cat ? ' (' + E(t(cat)) + ')' : ''}</small></div><div><b>${pr != null && po != null ? (po - pr > 0 ? '+' : '') + (po - pr) : '-'}</b><small>${E(t('Selisih skor'))}</small></div></div>
<h2>${E(t('Skor per tahap'))}</h2>
<table><tr><th>${E(t('Tahap'))}</th><th>${E(t('Topik'))}</th><th>${E(t('Skor'))}</th><th>XP</th><th>${E(t('Status'))}</th></tr>${rows}</table>
<h2>${E(t('N-Gain otomatis'))}</h2>
<p class="note">${gainTxt}</p><p class="fm">N-gain = (posttest − pretest) / (100 − pretest). ${E(t('Tinggi'))}: ≥ 0,7 | ${E(t('Sedang'))}: 0,3 – 0,7 | ${E(t('Rendah'))}: &lt; 0,3.</p>
<h2>${E(t('Analisis 4 Lapisan Iceberg RME'))}</h2>
<div class="ice">${bars}</div>
<table><tr><th>${E(t('Lapisan'))}</th><th>${E(t('Rata-rata latihan, kuis, wrap-up (%)'))}</th><th>Pretest</th><th>Posttest</th><th>${E(t('Perubahan'))}</th></tr>${lyRows}</table>
${rk.strong ? `<p class="note ok">${E(t('Lapisan terkuat'))}: <b>L${rk.strong.l} ${E(lyN(rk.strong.l))}</b> (${rk.strong.avg}%)</p>` : ''}${rk.weak ? `<p class="note bad">${E(t('Perlu bimbingan'))}: <b>L${rk.weak.l} ${E(lyN(rk.weak.l))}</b> (${rk.weak.avg}%)</p>` : ''}${!rk.strong && !rk.weak ? `<p class="note">${E(t('Data lapisan belum cukup. Selesaikan Latihan Bertahap dan Kuis Boss agar analisis terisi.'))}</p>` : ''}
<h2>${E(t('Latihan dan Catatan Kesalahan'))}</h2>
<table><tr><th>${E(t('Latihan Bertahap selesai (soal)'))}</th><th>${E(t('Skor rata-rata latihan'))}</th><th>${E(t('Catatan Kesalahan aktif'))}</th><th>${E(t('Catatan Kesalahan teratasi'))}</th></tr><tr><td style="text-align:center">${pa.length}</td><td>${num(pavg)}</td><td>${act}</td><td>${res}</td></tr></table>
<div class="sg"><div><span>${E(t('Guru Mata Pelajaran'))}</span></div><div><span>${E(u.name || t('Hunter'))}</span></div></div>
<p class="ft">${E(t('Dokumen dibuat otomatis oleh sistem Shadow Monarch\'s Quadratic Dungeon dari progres akun siswa.'))}</p>
</section>`;
  }

  function doc(list, forPrint) {
    const lg = window.I18N ? I18N.lang : 'id';
    return `<!doctype html><html lang="${lg}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t('Transkrip Evaluasi Pembelajaran'))}</title><style>${css}</style></head><body>${forPrint ? '' : `<div class="bar"><button onclick="print()">${esc(t('Cetak / Simpan Transkrip Evaluasi'))}</button></div>`}${list.map(page).join('')}</body></html>`;
  }

  function download(name, html) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 600);
  }
  const safe = (s) => String(s || 'siswa').replace(/[^\w\-]+/g, '_').slice(0, 30);

  function print(list) {
    if (!list || !list.length) return toast(t('Belum ada data siswa untuk dicetak.'));
    const file = 'transkrip_evaluasi_' + (list.length === 1 ? safe(list[0].name) : 'kelas') + '.html';
    let f;
    try {
      f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      document.body.appendChild(f);
      f.contentDocument.open();
      f.contentDocument.write(doc(list, true));
      f.contentDocument.close();
    } catch (e) {
      f && f.remove();
      return download(file, doc(list, false));
    }
    setTimeout(() => {
      try {
        f.contentWindow.focus();
        f.contentWindow.print();
      } catch (e) {
        toast(t('Tidak bisa membuka dialog cetak. Transkrip diunduh sebagai berkas HTML.'));
        download(file, doc(list, false));
      }
      setTimeout(() => f.remove(), 60000);
    }, 500);
  }

  const roster = () => {
    const S = students();
    return Object.entries(DB.users)
      .filter(([, u]) => S.includes(u))
      .sort((a, b) => String(a[1].name).localeCompare(String(b[1].name)));
  };
  const Tr = {
    selId: 'all',
    page,
    doc,
    print,

    studentBox: () =>
      `<div class="trbox"><div style="flex:1 1 240px"><b>${esc(t('Transkrip Nilai dan Analisis Iceberg RME'))}</b><p class="mut sm">${esc(t('Rangkuman Pretest, skor tiap Rank (E sampai S), Posttest, N-Gain otomatis, dan 4 lapisan Iceberg RME dalam laporan bersih siap print atau PDF.'))}</p></div><button class="btn" data-tr="me">${esc(t('Cetak / Simpan Transkrip Evaluasi'))}</button></div>`,

    teacherBox() {
      const r = roster();
      if (Tr.selId !== 'all' && !r.some(([k]) => k === Tr.selId)) Tr.selId = 'all';
      return `<div class="trbox"><label>${esc(t('Pilih siswa'))}<select id="trsel"><option value="all" ${Tr.selId === 'all' ? 'selected' : ''}>${esc(t('Semua siswa (1 halaman per siswa)'))} (${r.length})</option>${r.map(([k, u]) => `<option value="${esc(k)}" ${Tr.selId === k ? 'selected' : ''}>${esc(u.name)}${u.cls ? ' | ' + esc(u.cls) : ''}</option>`).join('')}</select></label><button class="btn" data-tr="sel">${esc(t('Cetak / Simpan Transkrip Evaluasi'))}</button></div>`;
    },
  };
  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'trsel') Tr.selId = e.target.value;
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-tr]');
    if (!b) return;
    if (b.dataset.tr === 'me') return print(DB.me && me() ? [me()] : []);
    const v = ($('#trsel') || {}).value || Tr.selId;
    Tr.selId = v;
    const r = roster();
    print(v === 'all' ? r.map((x) => x[1]) : r.filter((x) => x[0] === v).map((x) => x[1]));
  });
  return Tr;
})();
