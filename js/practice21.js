'use strict';

(() => {
  const PR_RANKS = ['0', 'E', 'D', 'C', 'B', 'A', 'S'];
  const Q_RANKS = ['0', 'E', 'D', 'C', 'B', 'A', 'S', 'R'];
  const MINR = 2;
  const HINT_COST = 5;
  const lyN = (l) => LAYER[l].n;
  const lyC = (l) => LAYER[l].c;
  const lyT = (l) => `<span>Lapisan ${l}</span> <span class="lyn">${lyN(l)}</span>`;
  const rn = (c) => (RK.find((r) => r.c === c) || { n: c }).n;
  const ensure = (u = me()) => {
    u.pr = u.pr || {};
    u.wl = u.wl || {};
    return u;
  };
  const scoreOf = (att, ok, h) => (ok ? Math.max(0, [100, 66, 33, 20][Math.min(att, 4) - 1] - HINT_COST * h) : 0);
  const expOf = (it, k) => it.exp || (window.EXP && (EXP[k] || [])[1]) || '';

  const parse = (id) => {
    const kind = id[0],
      k = id.slice(2),
      c = k[0],
      i = +k.slice(1);
    const it = kind === 'p' ? (PQ[c] || [])[i] : (Q[c] || [])[i];
    const u = me();
    return it ? { id, kind, k, c, i, it, rec: (kind === 'p' ? (u.pr || {})[k] : (u.st || {})[k]) || null } : null;
  };

  const Dx = {

    layers(u) {
      const L = [null, 1, 2, 3, 4].map((l) => (l ? { l, sum: 0, n: 0, tot: 0, ps: 0, pn: 0, ts: 0, tn: 0, pa: 0, pt: 0 } : null));
      const st = (u && u.st) || {},
        pr = (u && u.pr) || {};
      Q_RANKS.forEach((c) =>
        (Q[c] || []).forEach((it, j) => {
          if (it.t === 'open' || !L[it.L]) return;
          L[it.L].tot++;
          const s = st[c + j];
          if (s && s.done) {
            L[it.L].sum += s.score || 0;
            L[it.L].n++;
          }
        }),
      );
      PR_RANKS.forEach((c) =>
        (PQ[c] || []).forEach((it, j) => {
          if (!L[it.L]) return;
          L[it.L].tot++;
          L[it.L].pt++;
          const s = pr[c + j];
          if (s && s.done) {
            L[it.L].sum += s.score || 0;
            L[it.L].n++;
            L[it.L].pa++;
          }
        }),
      );
      ['P', 'T'].forEach((c) =>
        (Q[c] || []).forEach((it, j) => {
          if (!L[it.L]) return;
          const s = st[c + j];
          if (s && s.done) {
            if (c === 'P') {
              L[it.L].ps += s.ok ? 100 : 0;
              L[it.L].pn++;
            } else {
              L[it.L].ts += s.ok ? 100 : 0;
              L[it.L].tn++;
            }
          }
        }),
      );
      return L.slice(1).map((x) => ({
        l: x.l,
        avg: x.n ? Math.round(x.sum / x.n) : null,
        n: x.n,
        tot: x.tot,
        pa: x.pa,
        pt: x.pt,
        pre: x.pn ? Math.round(x.ps / x.pn) : null,
        post: x.tn ? Math.round(x.ts / x.tn) : null,
      }));
    },

    rank(u) {
      const d = Dx.layers(u).filter((x) => x.n >= 2);
      if (d.length < 2) return { strong: null, weak: null, d };
      const s = d.slice().sort((a, b) => b.avg - a.avg || a.l - b.l),
        w = d.slice().sort((a, b) => a.avg - b.avg || b.l - a.l);
      return { strong: s[0].avg > w[0].avg ? s[0] : null, weak: w[0].avg < 80 && s[0].avg > w[0].avg ? w[0] : null, d };
    },

    html(u, opt = {}) {
      const L = Dx.layers(u),
        rk = Dx.rank(u),
        tip = [0, 1, 2, 3, 4];
      const row = (x) =>
        `<div class="dxr" style="--c:${lyC(x.l)};--pad:${(x.l - 1) * 7}%"><div class="dxh"><b>${lyT(x.l)}</b><span class="dxp">${x.avg == null ? '-' : x.avg + '%'}</span></div><div class="pb"><i style="width:${x.avg || 0}%;background:${lyC(x.l)}"></i></div><small class="mut"><span>${x.n ? `${x.n} soal terjawab` : 'Belum ada data'}</span>${x.pre != null || x.post != null ? ` <span>| Pretest ${x.pre ?? '-'}% | Posttest ${x.post ?? '-'}%</span>` : ''}</small></div>`;
      const note = !rk.d.length
        ? '<p class="mut sm">Kerjakan Latihan Bertahap dan Kuis Boss agar rapor ini terisi.</p>'
        : `${rk.strong ? `<p class="dxs ok"><span>Terkuat:</span> <b>${lyT(rk.strong.l)}</b> (${rk.strong.avg}%)</p>` : ''}${rk.weak ? `<p class="dxs bad"><span>Perlu bimbingan:</span> <b>${lyT(rk.weak.l)}</b> (${rk.weak.avg}%)</p><p class="mut sm">Ulangi Latihan Bertahap atau Catatan Kesalahan pada lapisan ini.</p>` : rk.d.length >= 2 ? '<p class="dxs ok">Semua lapisan sudah kuat. Pertahankan!</p>' : ''}`;
      return `<div class="dxberg">${tip
        .slice(1)
        .reverse()
        .map((l) => row(L[l - 1]) + (l === 4 ? '<div class="dxwater"><span>garis air: di bawah ini, pemahaman yang tidak terlihat</span></div>' : ''))
        .join('')}</div>${note}`;
    },
    profileCard(u) {
      const wl = ensure(u).wl,
        act = Object.values(wl).filter((x) => x.r < MINR).length;
      return `<div class="grid2"><div class="card rv dxcard"><small class="tag">[ SYSTEM ] RAPOR DIAGNOSTIK ICEBERG</small><h3>Rapor 4 Lapisan Iceberg</h3>${Dx.html(u)}</div><div class="card rv"><small class="tag">[ SYSTEM ] CATATAN KESALAHAN</small><h3>Weakness Log</h3><p class="mut">Soal yang pernah kamu jawab salah tersimpan otomatis supaya bisa dilatih ulang kapan saja.</p><div class="grid3"><div class="stat"><b>${act}</b><span>Perlu dilatih</span></div><div class="stat"><b>${Object.values(wl).filter((x) => x.r >= MINR).length}</b><span>Sudah teratasi</span></div><div class="stat"><b>${Prac.totalDone(u)}/${Prac.totalAll()}</b><span>Latihan selesai</span></div></div><p style="margin-top:12px"><button class="btn" data-go="#/weakness">Buka Catatan Kesalahan</button></p></div></div>`;
    },

    classAvg(list) {
      return [1, 2, 3, 4].map((l) => {
        const a = list.map((s) => Dx.layers(s)[l - 1]).filter((x) => x.avg != null);
        const pr = list.map((s) => Dx.layers(s)[l - 1].pre).filter((x) => x != null),
          po = list.map((s) => Dx.layers(s)[l - 1].post).filter((x) => x != null);
        const m = (z) => (z.length ? Math.round(z.reduce((p, q) => p + q, 0) / z.length) : null);
        return { l, avg: m(a.map((x) => x.avg)), n: a.length, pre: m(pr), post: m(po) };
      });
    },
    classCard(list, full) {
      const ca = Dx.classAvg(list);
      const ok = ca.filter((x) => x.avg != null);
      const weak = ok.length >= 2 ? ok.slice().sort((a, b) => a.avg - b.avg)[0] : null,
        strong = ok.length >= 2 ? ok.slice().sort((a, b) => b.avg - a.avg)[0] : null;
      const bars = ca
        .slice()
        .reverse()
        .map(
          (x) =>
            `<div class="dxr" style="--c:${lyC(x.l)};--pad:${(x.l - 1) * 7}%"><div class="dxh"><b>${lyT(x.l)}</b><span class="dxp">${x.avg == null ? '-' : x.avg + '%'}</span></div><div class="pb"><i style="width:${x.avg || 0}%;background:${lyC(x.l)}"></i></div><small class="mut"><span>${x.n} siswa berdata</span> <span>| Pretest ${x.pre ?? '-'}% | Posttest ${x.post ?? '-'}%</span></small></div>`,
        )
        .join('');
      let t = '';
      if (full)
        t = `<div class="tblw"><table><tr><th>NAMA</th>${[1, 2, 3, 4].map((l) => `<th>L${l}</th>`).join('')}<th>TERKUAT</th><th>PERLU BIMBINGAN</th><th>CATATAN KESALAHAN</th></tr>${list
          .map((s) => {
            const L = Dx.layers(s),
              r = Dx.rank(s),
              act = Object.values(ensure(s).wl).filter((x) => x.r < MINR).length;
            return `<tr><td>${esc(s.name)}</td>${L.map((x) => `<td style="color:${x.avg == null ? 'inherit' : x.avg >= 80 ? '#4cc38a' : x.avg < 60 ? '#ff6b81' : 'inherit'}">${x.avg ?? '-'}</td>`).join('')}<td>${r.strong ? 'L' + r.strong.l : '-'}</td><td>${r.weak ? 'L' + r.weak.l : '-'}</td><td>${act}</td></tr>`;
          })
          .join('')}</table></div><p class="mut sm">Nilai tiap lapisan = rata-rata skor soal Latihan Bertahap, Kuis Boss, dan Wrap-up pada lapisan itu (0 sampai 100). Hijau: 80 ke atas. Merah: di bawah 60. Terkuat dan Perlu Bimbingan butuh minimal 2 soal terjawab per lapisan.</p>`;
      return `<div class="card rv dxcard"><small class="tag">[ SYSTEM ] DIAGNOSTIK 4 LAPISAN ICEBERG: KELAS</small><h3>Lapisan Pemahaman Kelas</h3><div class="dxberg">${bars}</div>${weak && strong && weak.avg < strong.avg ? `<p class="dxs ok"><span>Lapisan terkuat kelas:</span> <b>${lyT(strong.l)}</b> (${strong.avg}%)</p><p class="dxs bad"><span>Perlu bimbingan kelas:</span> <b>${lyT(weak.l)}</b> (${weak.avg}%)</p>` : '<p class="mut sm">Belum cukup data untuk menentukan lapisan terkuat dan terlemah.</p>'}${t}</div>`;
    },
  };
  window.Dx = Dx;

  const kindOf = (p) => (p.kind === 'p' ? 'Latihan' : p.c === 'R' ? 'Wrap-up' : 'Boss Quiz');
  const itemFields = (it, name, seed, dis, rec) => {
    let h = `<p>${it.q}</p>${it.html || ''}`;
    if (it.t === 'mc') {
      const ord = shuf(it.o.length, seed);
      h +=
        '<div class="opts">' +
        ord
          .map(
            (j, x) =>
              `<label><input type="${it.multi ? 'checkbox' : 'radio'}" name="${name}" value="${j}" ${dis ? 'disabled' : ''} ${rec && rec.sel && rec.sel.includes(j) ? 'checked' : ''}><span>${String.fromCharCode(65 + x)}. ${it.o[j]}</span></label>`,
          )
          .join('') +
        '</div>';
    } else if (it.t === 'fill')
      h +=
        '<div class="fills">' +
        it.f
          .map(
            (f, j) =>
              `<label>${f.l}<input data-f="${j}" autocomplete="off" ${dis ? 'disabled' : ''} value="${esc(((rec && rec.v) || [])[j] || '')}"></label>`,
          )
          .join('') +
        '</div>';
    return h;
  };

  const grade = (it, box) => {
    if (it.t === 'mc') {
      const sel = $$('input:checked', box)
        .map((e) => +e.value)
        .sort((a, b) => a - b);
      if (!sel.length) return null;
      return { ok: sel.join() === it.a.join(), sel };
    }
    const v = $$('[data-f]', box).map((e) => e.value);
    if (!v.some((x) => x.trim())) return null;
    return { ok: it.f.every((f, j) => f.r.test(window.Mp ? Mp.std(v[j]) : (v[j] || '').toLowerCase().replace(/\s/g, ''))), v };
  };

  const Rev = {
    body(it, rec, k) {
      let h = `<div class="rvb"><p class="rvq">${it.q}</p>${it.html || ''}`;
      if (it.t === 'mc')
        h +=
          '<ul class="rvo">' +
          it.o
            .map((o, j) => {
              const good = it.a.includes(j),
                mine = rec && rec.sel && rec.sel.includes(j);
              return `<li class="${good ? 'ok' : mine ? 'bad' : ''}"><i>${good ? '✓' : mine ? '✗' : '•'}</i><span>${o}</span>${mine ? '<em>Jawabanmu</em>' : ''}${good ? '<em class="g">Jawaban benar</em>' : ''}</li>`;
            })
            .join('') +
          '</ul>';
      else {
        h += `<p class="rvf"><span class="mut">Jawabanmu:</span> <b>${rec && rec.v ? esc(rec.v.join(' ; ')) : '-'}</b></p><p class="rvf"><span class="mut">Jawaban benar:</span> <b>${it.show || ''}</b></p>`;
      }
      const ex = expOf(it, k);
      if (ex) h += `<p class="exp"><b>Pembahasan:</b> ${ex}</p>`;
      const hs = Array.isArray(it.hint) ? it.hint : it.hint ? [it.hint] : [];
      if (hs.length) h += `<details class="rvh"><summary>Petunjuk konstruktivis</summary>${hs.map((x, j) => `<p><b>${j + 1}.</b> ${x}</p>`).join('')}</details>`;
      return h + '</div>';
    },

    list(kind, c, items, recOf) {
      return `<div class="rvlist">${items
        .map((it, i) => {
          if (it.t === 'open') return '';
          const r = recOf(i),
            id = kind + ':' + c + i;
          return `<div class="rvi"><div class="rvh2"><b class="rvn">${i + 1}</b><span class="lyb" style="--c:${lyC(it.L || 4)}">L${it.L || 4}</span><span class="rvs ${r && r.done ? (r.ok ? 'ok' : 'bad') : ''}">${r && r.done ? (r.ok ? 'Benar' : 'Perlu belajar lagi') : 'Belum dijawab'}</span>${r && r.done ? `<button class="btn ghost rvbtn" data-rev="${id}">Lihat Pembahasan Lengkap</button>` : ''}</div><div class="revx" hidden></div></div>`;
        })
        .join('')}</div>`;
    },
    toggle(btn) {
      const nx = btn.nextElementSibling,
        box = nx && nx.classList.contains('revx') ? nx : btn.closest('.rvi').querySelector('.revx'),
        p = parse(btn.dataset.rev);
      if (!p) return;
      if (box.hidden) {
        if (!box.innerHTML) box.innerHTML = Rev.body(p.it, p.rec, p.k);
        box.hidden = false;
        btn.textContent = 'Sembunyikan Pembahasan';
      } else {
        box.hidden = true;
        btn.textContent = 'Lihat Pembahasan Lengkap';
      }
    },

    quizList(c) {
      const u = me();
      return Rev.list('q', c, Q[c] || [], (i) => u.st[c + i]);
    },
  };
  window.Rev = Rev;

  const WL = {

    miss(id) {
      const u = ensure(),
        x = (u.wl[id] = u.wl[id] || { w: 0, r: 0, ts: 0 });
      x.w++;
      x.r = 0;
      x.ts = Date.now();
    },
    right(id) {
      const x = ensure().wl[id];
      if (!x) return;
      x.r++;
      x.ts = Date.now();
    },
    list() {
      return Object.entries(ensure().wl)
        .map(([id, x]) => ({ id, x, p: parse(id) }))
        .filter((e) => e.p);
    },
    active: () => WL.list().filter((e) => e.x.r < MINR),
    fixed: () => WL.list().filter((e) => e.x.r >= MINR),
  };
  window.WL = WL;
  let WS = { run: null, flt: 0 };

  V.weakness = () => {
    const act = WL.active().sort((a, b) => b.x.w - a.x.w || a.x.ts - b.x.ts),
      fx = WL.fixed();
    if (WS.run) return '<div id="wkz"></div>';
    const flt = WS.flt,
      vis = flt ? act.filter((e) => e.p.it.L === flt) : act;
    const chips = [0, 1, 2, 3, 4]
      .map((l) => `<button class="btn ${flt === l ? '' : 'ghost'} wkf" data-wf="${l}">${l ? `L${l} <span>${lyN(l)}</span> <i>(${act.filter((e) => e.p.it.L === l).length})</i>` : `<span>Semua</span> <i>(${act.length})</i>`}</button>`)
      .join(' ');
    return `<div class="sys rv"><small class="tag">[ SYSTEM ] CATATAN KESALAHAN</small><h2>Weakness Log</h2><p class="mut">Setiap soal yang pernah kamu jawab salah di Latihan Bertahap, Kuis Penaklukan Gate, dan Wrap-up tersimpan di sini. Latih ulang sampai benar ${MINR} kali berturut-turut, maka soal itu dinyatakan teratasi.</p><div class="grid3" style="margin-top:12px"><div class="stat"><b>${act.length}</b><span>Perlu dilatih</span></div><div class="stat"><b>${fx.length}</b><span>Sudah teratasi</span></div><div class="stat"><b>${act.reduce((a, e) => a + e.x.w, 0) + fx.reduce((a, e) => a + e.x.w, 0)}</b><span>Total salah tercatat</span></div></div></div><div class="card rv"><div class="wkfl">${chips}</div><p style="margin:12px 0"><button class="btn" id="wkall" ${vis.length ? '' : 'disabled'}>Latih ulang semua</button> <span class="mut sm"><span>${vis.length} soal</span></span></p>${
      vis.length
        ? `<div class="tblw"><table><tr><th>DUNGEON</th><th>JENIS</th><th>NO</th><th>LAPISAN</th><th>SALAH</th><th>PROGRES</th><th></th></tr>${vis
            .map(
              (e) =>
                `<tr><td>${rn(e.p.c)}</td><td>${kindOf(e.p)}</td><td>${e.p.i + 1}</td><td><span class="lyb" style="--c:${lyC(e.p.it.L || 4)}">L${e.p.it.L || 4}</span></td><td>${e.x.w}x</td><td>${e.x.r}/${MINR}</td><td><button class="btn ghost wkone" data-wk="${e.id}">Latih</button></td></tr>`,
            )
            .join('')}</table></div>`
        : `<p class="mut">${act.length ? 'Tidak ada soal pada lapisan ini.' : 'Belum ada soal yang perlu dilatih ulang. Kerjakan Latihan Bertahap dan Kuis Boss, soal yang keliru akan masuk ke sini otomatis.'}</p>`
    }</div>${
      fx.length
        ? `<div class="card rv"><small class="tag">[ SYSTEM ] SUDAH TERATASI</small><div class="tblw"><table><tr><th>DUNGEON</th><th>JENIS</th><th>NO</th><th>LAPISAN</th><th></th></tr>${fx
            .map(
              (e) =>
                `<tr><td>${rn(e.p.c)}</td><td>${kindOf(e.p)}</td><td>${e.p.i + 1}</td><td><span class="lyb" style="--c:${lyC(e.p.it.L || 4)}">L${e.p.it.L || 4}</span></td><td><button class="btn ghost wkone" data-wk="${e.id}">Latih lagi</button></td></tr>`,
            )
            .join('')}</table></div></div>`
        : ''
    }`;
  };

  const wkStart = (ids) => {
    const a = ids.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    WS.run = { q: a, i: 0, ok: 0, bad: 0, done: false, res: null };
    route();
  };
  const wkPaint = () => {
    const z = $('#wkz');
    if (!z || !WS.run) return;
    const R = WS.run;
    if (R.i >= R.q.length) {
      z.innerHTML = `<div class="sys rv"><small class="tag">[ SYSTEM ] LATIHAN ULANG SELESAI</small><h2>Latihan ulang selesai</h2><div class="grid3" style="max-width:520px;margin:14px auto"><div class="stat"><b>${R.ok}</b><span>Benar</span></div><div class="stat"><b>${R.bad}</b><span>Masih keliru</span></div><div class="stat"><b>${WL.active().length}</b><span>Masih perlu dilatih</span></div></div><p class="mut">Soal yang benar ${MINR} kali berturut-turut otomatis keluar dari daftar aktif.</p><p><button class="btn" id="wkend">Kembali ke Catatan Kesalahan</button></p></div>`;
      $('#wkend').onclick = () => {
        WS.run = null;
        route();
      };
      return;
    }
    const p = parse(R.q[R.i]);
    if (!p) {
      R.i++;
      return wkPaint();
    }
    const it = p.it,
      d = R.res;
    z.innerHTML = `<div class="sys rv"><small class="tag">[ SYSTEM ] LATIHAN ULANG</small><div class="dots">${R.q.map((_, j) => `<b class="${j < R.i ? 'ok' : ''} ${j === R.i ? 'cur' : ''}">${j + 1}</b>`).join('')}<span class="mut">Soal ${R.i + 1} dari ${R.q.length}</span></div></div><div class="card"><div class="item ${d ? (d.ok ? 'ok' : 'bad') : ''}" data-wk-box><h4><span>${rn(p.c)}</span> <span>${kindOf(p)}</span> <b>${p.i + 1}</b> <span class="lyb" style="--c:${lyC(it.L || 4)}">L${it.L || 4}</span></h4>${itemFields(it, 'wk', 'wk' + p.id + Date.now() % 7, !!d, d)}${d ? `<p class="res">${d.ok ? 'Benar' : 'Belum tepat'}</p>${Rev.body(it, d, p.k)}<p style="margin-top:12px"><button class="btn" id="wknx">${R.i < R.q.length - 1 ? 'Soal berikutnya' : 'Selesai'}</button></p>` : '<button class="btn" id="wkchk">Check my answer</button><p class="res"></p>'}</div></div><p><button class="btn ghost" id="wkstop">Berhenti dan kembali</button></p>`;
    const box = $('[data-wk-box]');
    if (it.draw && !d) it.draw(box);
    $('#wkstop').onclick = () => {
      WS.run = null;
      route();
    };
    if (d) $('#wknx').onclick = () => {
      R.i++;
      R.res = null;
      wkPaint();
    };
    else
      $('#wkchk').onclick = () => {
        const g = grade(it, box);
        if (!g) return toast('Isi jawaban dulu');
        R.res = g;
        if (g.ok) {
          R.ok++;
          WL.right(p.id);
          AU.sfx('ok');
          dq && dq('ans');
        } else {
          R.bad++;
          WL.miss(p.id);
          AU.sfx('bad');
          if (window.Mentor) Mentor.onWrong(p.id, it, g.sel || g.v);
        }
        save();
        wkPaint();
      };
  };
  V.weakness.post = () => {
    if (WS.run) return wkPaint();
    $$('.wkf').forEach((b) => (b.onclick = () => ((WS.flt = +b.dataset.wf), route())));
    $$('.wkone').forEach((b) => (b.onclick = () => wkStart([b.dataset.wk])));
    const a = $('#wkall');
    if (a)
      a.onclick = () =>
        wkStart(
          WL.active()
            .filter((e) => !WS.flt || e.p.it.L === WS.flt)
            .map((e) => e.id),
        );
  };

  let PS = { c: null, qi: 0 };
  const Prac = {
    has: (c) => !!(PQ[c] && PQ[c].length),
    rec: (c, i) => (ensure().pr[c + i]) || null,
    done: (c) => (PQ[c] || []).every((_, i) => (Prac.rec(c, i) || {}).done),
    count: (c) => (PQ[c] || []).filter((_, i) => (Prac.rec(c, i) || {}).done).length,
    totalDone: (u = me()) => PR_RANKS.reduce((a, c) => a + (PQ[c] || []).filter((_, i) => ((u.pr || {})[c + i] || {}).done).length, 0),
    totalAll: () => PR_RANKS.reduce((a, c) => a + (PQ[c] || []).length, 0),

    unlocked(c) {
      const u = ensure();
      if (!Prac.has(c) || u.done[c]) return true;
      return Prac.done(c) && (c !== '0' || !!u.pr.G0 || !!u.done['0']);
    },
    gate0(s) {
      const u = ensure();
      if (!u.pr.G0) u.pr.G0 = { done: 1, score: Math.min(100, Math.round((s / 60) * 100)), ts: Date.now() };
      save();
      toast('Zona target tercapai. Lanjut ke Latihan Bertahap!');
      paint();
    },

    first(c) {
      const i = (PQ[c] || []).findIndex((_, j) => !(Prac.rec(c, j) || {}).done);
      return i < 0 ? 0 : i;
    },
    enter(c) {
      if (PS.c !== c) PS = { c, qi: Prac.first(c) };
    },
    html(c) {
      Prac.enter(c);
      const items = PQ[c],
        u = ensure(),
        qi = Math.min(PS.qi, items.length - 1),
        it = items[qi],
        k = c + qi,
        rec = u.pr[k] || { att: 0 },
        n = Prac.count(c),
        all = n === items.length;
      const layerChips = [1, 2, 3, 4]
        .map((l) => {
          const t = items.filter((x) => x.L === l),
            d = t.filter((x) => (u.pr[c + items.indexOf(x)] || {}).done).length;
          return `<span class="lyc ${it.L === l ? 'on' : ''}" style="--c:${lyC(l)}"><b>L${l}</b> <span>${lyN(l)}</span> <i>${d}/${t.length}</i></span>`;
        })
        .join('');
      const dots = items
        .map((x, j) => {
          const s = u.pr[c + j] || {};
          return `<b class="${s.done ? (s.ok ? 'ok' : 'bad') : ''} ${j === qi ? 'cur' : ''}" data-pgo="${j}" style="${j === qi ? '' : `border-color:${lyC(x.L)}55`}">${j + 1}</b>`;
        })
        .join('');
      let h = `<h3>Latihan Bertahap</h3><p class="mut">Tanpa kehilangan HP. Naik bertahap mengikuti Iceberg: situasi nyata, tabel dan grafik, penemuan model, lalu rumus formal. Selesaikan semua nomor untuk membuka Kuis Penaklukan Gate. Progresmu tersimpan per nomor, jadi boleh dicicil.</p><div class="pgbar"><div class="bar"><div style="width:${Math.round((n / items.length) * 100)}%"></div></div><span class="mut sm">${n}/${items.length} selesai</span></div><div class="lycs">${layerChips}</div><div class="dots">${dots}<span class="mut">Soal ${qi + 1} dari ${items.length}</span></div>`;

      const done = !!rec.done;
      h += `<div class="item pitem ${done ? (rec.ok ? 'ok' : 'bad') : ''}" data-pk="${k}"><h4><span>${rn(c)}</span> <span>| LATIHAN ${qi + 1}</span> <span class="lyb" style="--c:${lyC(it.L)}">L${it.L}</span> <span class="lyn">${lyN(it.L)}</span></h4>${itemFields(it, 'pp' + k, 'p' + k + DB.me, done, rec)}`;
      const hs = it.hint || [];
      const hv = rec.h || 0;
      if (hv) h += `<div class="phints">${hs.slice(0, hv).map((x, j) => `<p class="hintp"><b>Petunjuk ${j + 1}:</b> <span>${x}</span></p>`).join('')}</div>`;
      else h += '<div class="phints"></div>';
      if (!done) {
        const left = 3 - (rec.att || 0);
        h += `<div class="pact">${hv < 2 ? `<button class="btn ghost phint" data-ph="${hv + 1}">Petunjuk ${hv + 1} <small>(-${HINT_COST})</small></button>` : ''}<button class="btn pchk">Check my answer <small>(${left})</small></button></div><p class="res pres">${rec.att ? `<span>Belum tepat. Sisa percobaan: ${left}</span>${rec.nm && hv < 2 ? ' <span class="mnt">Shadow Mentor menyarankan: buka petunjuk dulu.</span>' : ''}` : ''}</p>`;
      } else {
        h += `<p class="res">${rec.ok ? `Benar. Skor ${rec.score}` : 'Belum tepat. Jawaban: ' + (it.show || '')}</p><p class="mentorline">${rec.ok ? '' : 'AI Shadow Mentor mencatat soal ini di Catatan Kesalahan untuk dilatih ulang.'}</p><button class="btn ghost rvbtn" data-rev="p:${k}">Lihat Pembahasan Lengkap</button><div class="revx" hidden></div>`;
      }
      h += '</div>';
      h += `<div class="nav2">${qi > 0 ? `<button class="btn ghost" data-pgo="${qi - 1}">Sebelumnya</button>` : '<span></span>'}${done ? (qi < items.length - 1 ? `<button class="btn" data-pgo="${qi + 1}">Soal berikutnya</button>` : '<span></span>') : '<span></span>'}</div>`;
      if (all) {
        const sc = Math.round(items.reduce((a, _, j) => a + ((u.pr[c + j] || {}).score || 0), 0) / items.length);
        const gate0 = c === '0' && !u.pr.G0 && !u.done['0'];
        h += `<div class="card pdone"><small class="tag">[ SYSTEM ] LATIHAN SELESAI</small><h3><span>Latihan selesai. Skor latihan ${sc}</span></h3>${gate0 ? '<p class="mut">Satu syarat lagi: taklukkan game belati di langkah Praktik, lalu Kuis Penaklukan Gate terbuka.</p>' : '<p class="mut">Kuis Penaklukan Gate sudah terbuka. Boss Gate menunggumu.</p>'}<p>${gate0 ? '<button class="btn" data-tabname="Praktik">Ke game belati</button>' : '<button class="btn" data-tabname="Soal">Buka Kuis Penaklukan Gate</button>'}</p><h4 style="margin-top:14px">Pembahasan tiap nomor</h4>${Rev.list('p', c, items, (j) => u.pr[c + j])}</div>`;
      }
      return h;
    },
    init(c) {
      const it = PQ[c][Math.min(PS.qi, PQ[c].length - 1)],
        box = $('.pitem');
      if (it && it.draw && box && !(Prac.rec(c, PS.qi) || {}).done) it.draw(box);
    },
    check(c) {
      const items = PQ[c],
        qi = PS.qi,
        it = items[qi],
        k = c + qi,
        u = ensure(),
        box = $('.pitem');
      const g = grade(it, box);
      if (!g) return toast(it.t === 'mc' ? 'Pilih jawaban dulu' : 'Isi jawaban dulu');
      const rec = (u.pr[k] = u.pr[k] || { att: 0, h: 0 });
      rec.att++;
      rec.sel = g.sel;
      rec.v = g.v;
      rec.ts = Date.now();
      if (!g.ok) {
        WL.miss('p:' + k);
        const r = window.Mentor ? Mentor.onWrong('p:' + k, it, g.sel || g.v) : null;
        rec.nm = r ? 0 : 1;
      }
      const last = g.ok || rec.att >= 3;
      if (last) {
        rec.done = 1;
        rec.ok = g.ok ? 1 : 0;
        rec.score = scoreOf(rec.att, g.ok, rec.h || 0);
        AU.sfx(g.ok ? 'ok' : 'bad');
        if (g.ok) {
          dq('ans');
          burst($('.pchk'));
        }
        window.Co && Co.say(g.ok ? 'correct' : 'wrong');
      } else {
        AU.sfx('bad');
        window.Co && Co.say('retry');
      }
      save();
      paint();
    },
    hint(c, n) {
      const k = c + PS.qi,
        u = ensure(),
        rec = (u.pr[k] = u.pr[k] || { att: 0, h: 0 });
      if ((rec.h || 0) >= n) return;
      rec.h = n;
      save();
      paint();
    },
  };
  window.Prac = Prac;

  document.addEventListener('click', (e) => {
    const t = e.target.closest ? e.target : null;
    if (!t) return;
    const rb = t.closest('[data-rev]');
    if (rb) return Rev.toggle(rb);
    if (!$('#rk') || RS.c == null) return;
    const c = RS.c;
    if (!Prac.has(c) || stepsOf(c)[RS.step] !== 'Latihan') return;
    const go = t.closest('[data-pgo]');
    if (go) {
      PS.qi = +go.dataset.pgo;
      return paint();
    }
    if (t.closest('.pchk')) return Prac.check(c);
    const ph = t.closest('.phint');
    if (ph) return Prac.hint(c, +ph.dataset.ph);
    const tn = t.closest('[data-tabname]');
    if (tn) {
      RS.step = stepsOf(c).indexOf(tn.dataset.tabname);
      paint();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  const Rpt = {
    head: () => [
      'Nama', 'Kelas', 'Title', 'XP', 'Pretest', 'Gerbang', ...AX.map((r) => r.n), 'Wrap-up', 'Posttest', 'N-gain', 'Kategori N-gain',
      'Latihan Selesai (soal)', 'Latihan Skor Rata-rata',
      'Iceberg L1 Kontekstual (%)', 'Iceberg L2 Model Situasi (%)', 'Iceberg L3 Model Formal (%)', 'Iceberg L4 Matematika Formal (%)',
      'Pretest L1', 'Pretest L2', 'Pretest L3', 'Pretest L4', 'Posttest L1', 'Posttest L2', 'Posttest L3', 'Posttest L4',
      'Lapisan Terkuat', 'Lapisan Perlu Bimbingan', 'Catatan Kesalahan Aktif', 'Catatan Kesalahan Teratasi',
    ],
    row(s) {
      ensure(s);
      const L = Dx.layers(s),
        r = Dx.rank(s),
        d = (c) => (s.done[c] ? s.done[c].score : ''),
        pa = PR_RANKS.flatMap((c) => (PQ[c] || []).map((_, i) => s.pr[c + i])).filter((x) => x && x.done),
        wl = Object.values(s.wl);
      return [
        s.name, s.cls || '', titleOf(xpOf(s)), xpOf(s), pre(s) ?? '', d('0'), ...AX.map((x) => d(x.c)), d('R'), post(s) ?? '',
        fmt(ngain(s)) === '-' ? '' : fmt(ngain(s)), ngain(s) == null ? '' : ngCat(ngain(s)),
        pa.length, pa.length ? Math.round(pa.reduce((a, x) => a + (x.score || 0), 0) / pa.length) : '',
        ...L.map((x) => x.avg ?? ''), ...L.map((x) => x.pre ?? ''), ...L.map((x) => x.post ?? ''),
        r.strong ? 'L' + r.strong.l + ' ' + lyN(r.strong.l) : '', r.weak ? 'L' + r.weak.l + ' ' + lyN(r.weak.l) : '',
        wl.filter((x) => x.r < MINR).length, wl.filter((x) => x.r >= MINR).length,
      ];
    },
    csv(list) {
      const cell = (v) => {
        let t = String(v ?? '');
        if (/^[=+\-@]/.test(t) && isNaN(+t)) t = "'" + t;
        return '"' + t.replace(/"/g, '""') + '"';
      };
      return '﻿' + [Rpt.head(), ...list.map(Rpt.row)].map((r) => r.map(cell).join(',')).join('\r\n');
    },
    save(name, mime, text) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: mime }));
      a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 500);
    },

    report(list) {
      const t = (s) => (window.I18N ? I18N.t(s) : s),
        m = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : '-'),
        g = list.map(ngain).filter((x) => x != null),
        ag = g.length ? g.reduce((a, b) => a + b, 0) / g.length : null,
        ca = Dx.classAvg(list),
        cnt = (cat) => list.filter((s) => ngain(s) != null && ngCat(ngain(s)) === cat).length,
        th = (a) => a.map((x) => `<th>${esc(x)}</th>`).join(''),
        td = (a) => a.map((x) => `<td>${esc(x)}</td>`).join('');
      const date = new Date().toLocaleDateString(window.I18N ? I18N.locale() : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      return `<!doctype html><html lang="${window.I18N ? I18N.lang : 'id'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t('Laporan Akademik Kelas'))}</title><style>body{font:14px/1.5 system-ui,sans-serif;margin:24px;color:#111}h1{font-size:22px;margin:0}h2{font-size:16px;margin:22px 0 8px;border-bottom:2px solid #4d8bff;padding-bottom:4px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #bbb;padding:4px 6px;text-align:center}th{background:#e8eefc}td:first-child,th:first-child{text-align:left}.k{display:flex;gap:12px;flex-wrap:wrap}.k div{border:1px solid #bbb;border-radius:8px;padding:8px 14px;min-width:120px}.k b{font-size:20px;display:block}.w{overflow-x:auto}@media print{body{margin:8mm}h2{break-after:avoid}tr{break-inside:avoid}}</style></head><body><h1>${esc(t('Laporan Akademik Kelas'))}</h1><p>Shadow Monarch's Quadratic Dungeon | ${esc(t('Fungsi Kuadrat'))} | ${esc(date)} | ${list.length} ${esc(t('Siswa'))}</p><h2>${esc(t('Ringkasan'))}</h2><div class="k"><div><b>${m(list.map(pre).filter((x) => x != null))}</b>${esc(t('Rata-rata pretest'))}</div><div><b>${m(list.map(post).filter((x) => x != null))}</b>${esc(t('Rata-rata posttest'))}</div><div><b>${fmt(ag)}</b>${esc(t('Rata-rata N-gain'))} (${esc(ngCat(ag))})</div><div><b>${cnt('Tinggi')} / ${cnt('Sedang')} / ${cnt('Rendah')}</b>N-gain ${esc(t('Tinggi'))} / ${esc(t('Sedang'))} / ${esc(t('Rendah'))}</div></div><h2>${esc(t('Diagnostik 4 Lapisan Iceberg'))}</h2><div class="w"><table><tr>${th([t('Lapisan'), t('Rata-rata latihan, kuis, wrap-up (%)'), 'Pretest (%)', 'Posttest (%)', t('Siswa berdata')])}</tr>${ca.map((x) => `<tr>${td([`L${x.l} ${lyN(x.l)}`, x.avg ?? '-', x.pre ?? '-', x.post ?? '-', x.n])}</tr>`).join('')}</table></div><h2>${esc(t('Rekap per siswa'))}</h2><div class="w"><table><tr>${th(Rpt.head())}</tr>${list.map((s) => `<tr>${td(Rpt.row(s))}</tr>`).join('')}</table></div><p style="margin-top:14px;font-size:12px">N-gain = (posttest - pretest) / (100 - pretest). ${esc(t('Tinggi'))}: 0,7+ | ${esc(t('Sedang'))}: 0,3 - 0,7 | ${esc(t('Rendah'))}: &lt; 0,3.</p></body></html>`;
    },
  };
  window.Rpt = Rpt;
  window.PRAC21 = { Dx, Prac, Rev, WL, Rpt, MINR };
})();

(() => {
  const wrap = (name, add, post) => {
    const f = V[name],
      p = f.post;
    V[name] = (...a) => f(...a) + (add ? add(...a) : '');
    V[name].post = (...a) => {
      if (p) p(...a);
      if (post) post(...a);
    };
  };
  const clsList = () => (window.Cls ? Cls.filter(students(), 'class') : students());
  const btns = '<button class="btn ghost" id="rpcsv">Unduh CSV lengkap</button> <button class="btn ghost" id="rprep">Unduh Laporan Akademik</button>';
  const wire = (list) => {
    const a = $('#rpcsv'),
      b = $('#rprep');
    if (a) a.onclick = () => Rpt.save('rekap_akademik_v21.csv', 'text/csv;charset=utf-8', Rpt.csv(list()));
    if (b) b.onclick = () => Rpt.save('laporan_akademik_v21.html', 'text/html;charset=utf-8', Rpt.report(list()));
  };

  wrap('profile', () => Dx.profileCard(me()));

  wrap('result', (c) => {
    const u = me();
    if (!u.done[c] || !(Q[c] || []).length || (c === 'P' && !u.done.T)) return '';
    return `<div class="card rv"><small class="tag">[ SYSTEM ] PEMBAHASAN</small><h3>Pembahasan tiap nomor</h3>${Rev.quizList(c)}</div>${c === 'T' ? `<div class="card rv dxcard"><small class="tag">[ SYSTEM ] RAPOR DIAGNOSTIK ICEBERG</small><h3>Rapor 4 Lapisan Iceberg</h3>${Dx.html(u)}</div>` : ''}`;
  });

  wrap('class', () => Dx.classCard(clsList(), false), () => {
    const o = $('#csv');
    if (o) {
      o.insertAdjacentHTML('afterend', btns);
      o.remove();
    }
    wire(clsList);
  });

  wrap('analysis', () => Dx.classCard(students(), true) + `<div class="card rv"><small class="tag">[ SYSTEM ] EKSPOR LAPORAN AKADEMIK</small><p class="mut sm">CSV dan laporan memuat Pretest, skor Gerbang dan Rank E sampai S, Wrap-up, Posttest, N-gain otomatis, kemajuan Latihan Bertahap, skor 4 lapisan Iceberg (keseluruhan, pretest, posttest), dan jumlah Catatan Kesalahan.</p><p style="margin-top:10px">${btns}</p></div>`, () => wire(() => students()));
})();
