'use strict';

window.Materi = (() => {
  const M = {};
  let _id = 0;
  const uid = (p) => p + ++_id;
  const C = { bg: '#0b1030', grid: '#1e2a66', ax: '#8e9ad0', tx: '#cfd8ff', cy: '#5ee6f2', bl: '#4d8bff', vi: '#9a5aff', gold: '#ffd86b', pk: '#f472a8', gr: '#4cc38a', or: '#ff9a5a', rd: '#ff5a7a' };
  const f2 = (v) => String(+(+v).toFixed(2)).replace('-', '\u2212');
  const n2 = (v) => String(+(+v).toFixed(2));
  const $v = (id) => +document.getElementById(id).value;
  const put = (id, h) => {
    const e = document.getElementById(id);
    if (e) e.innerHTML = h;
  };

  const cf = (a) => (a === 1 ? '' : a === -1 ? '-' : n2(a));
  const shiftTerm = (h) => (h === 0 ? 'x' : h > 0 ? `(x - ${n2(h)})` : `(x + ${n2(-h)})`);
  const vertexTeX = (a, h, k) => `y = ${cf(a)}${h === 0 ? 'x' : shiftTerm(h)}^2 ${k < 0 ? '- ' + n2(-k) : k > 0 ? '+ ' + n2(k) : ''}`.trim();
  const stdTeX = (a, b, c) => {
    let s = `y = ${cf(a)}x^2`;
    if (b) s += ` ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : n2(Math.abs(b))}x`;
    if (c) s += ` ${c < 0 ? '-' : '+'} ${n2(Math.abs(c))}`;
    return s;
  };
  const facTeX = (a, r1, r2) => `y = ${cf(a)}${shiftTerm(r1)}${shiftTerm(r2)}`;

  const Gx = (W, H, xr, yr, pad = 30) => ({
    W, H, xr, yr, pad, cid: uid('cp'),
    X: (x) => pad + ((x - xr[0]) / (xr[1] - xr[0])) * (W - 2 * pad),
    Y: (y) => H - pad - ((y - yr[0]) / (yr[1] - yr[0])) * (H - 2 * pad),
  });
  const frame = (g, step = 1, ystep = 1) => {
    let s = `<defs><clipPath id="${g.cid}"><rect x="${g.pad}" y="${g.pad}" width="${g.W - 2 * g.pad}" height="${g.H - 2 * g.pad}"/></clipPath></defs><rect x="0" y="0" width="${g.W}" height="${g.H}" rx="10" fill="${C.bg}"/>`;
    for (let x = Math.ceil(g.xr[0] / step) * step; x <= g.xr[1]; x += step) {
      s += `<line x1="${g.X(x)}" y1="${g.pad}" x2="${g.X(x)}" y2="${g.H - g.pad}" stroke="${C.grid}" stroke-width="1"/>`;
      if (x !== 0) s += `<text x="${g.X(x)}" y="${g.Y(0) > g.H - g.pad - 2 ? g.H - g.pad + 14 : Math.min(g.H - g.pad + 14, g.Y(0) + 14)}" fill="${C.ax}" font-size="11" text-anchor="middle">${f2(x)}</text>`;
    }
    for (let y = Math.ceil(g.yr[0] / ystep) * ystep; y <= g.yr[1]; y += ystep) {
      s += `<line x1="${g.pad}" y1="${g.Y(y)}" x2="${g.W - g.pad}" y2="${g.Y(y)}" stroke="${C.grid}" stroke-width="1"/>`;
      if (y !== 0) s += `<text x="${Math.max(g.pad - 4, Math.min(g.X(0) - 5, g.W))}" y="${g.Y(y) + 4}" fill="${C.ax}" font-size="11" text-anchor="end">${f2(y)}</text>`;
    }
    if (g.xr[0] <= 0 && g.xr[1] >= 0) s += `<line x1="${g.X(0)}" y1="${g.pad}" x2="${g.X(0)}" y2="${g.H - g.pad}" stroke="${C.ax}" stroke-width="1.6"/>`;
    if (g.yr[0] <= 0 && g.yr[1] >= 0) s += `<line x1="${g.pad}" y1="${g.Y(0)}" x2="${g.W - g.pad}" y2="${g.Y(0)}" stroke="${C.ax}" stroke-width="1.6"/>`;
    return s;
  };
  const curve = (g, f, col = C.cy, w = 3, dash = '') => {
    let d = '';
    const lo = g.yr[0] - (g.yr[1] - g.yr[0]),
      hi = g.yr[1] + (g.yr[1] - g.yr[0]);
    for (let i = 0; i <= 200; i++) {
      const x = g.xr[0] + ((g.xr[1] - g.xr[0]) * i) / 200,
        y = Math.max(lo, Math.min(hi, f(x)));
      d += (i ? 'L' : 'M') + g.X(x).toFixed(1) + ' ' + g.Y(y).toFixed(1);
    }
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="round" clip-path="url(#${g.cid})"/>`;
  };
  const dot = (g, x, y, col, label, dx = 8, dy = -8, anchor = 'start') =>
    `<circle cx="${g.X(x)}" cy="${g.Y(y)}" r="5.5" fill="${col}" stroke="#fff" stroke-width="1.5"/>${label ? `<text x="${g.X(x) + dx}" y="${g.Y(y) + dy}" fill="${col}" font-size="13" font-weight="700" text-anchor="${anchor}">${label}</text>` : ''}`;
  const vline = (g, x, col, label) =>
    `<line x1="${g.X(x)}" y1="${g.pad}" x2="${g.X(x)}" y2="${g.H - g.pad}" stroke="${col}" stroke-width="2" stroke-dasharray="7 5"/>${label ? `<text x="${g.X(x) + 6}" y="${g.pad + 14}" fill="${col}" font-size="12" font-weight="700">${label}</text>` : ''}`;
  const arrowDef = (id, col) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${col}"/></marker>`;
  const svg = (g, inner, label) => `<svg class="mat-svg" viewBox="0 0 ${g.W} ${g.H}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

  const sec = (tag, title, body) => `<section class="mat"><small class="tag">[ SYSTEM ] ${tag}</small><h3>${title}</h3>${body}</section>`;
  const hunter = (t) => `<div class="story"><b>Catatan Hunter</b><p>${t}</p></div>`;
  const slider = (id, label, min, max, step, val) => `<label class="msl"><span>${label} = <b id="${id}v">${val}</b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  const head = (c) => `<div class="mat-head"><h2>${MATERI[c].title}</h2><p>${MATERI[c].story}</p></div>`;
  const tips = (c) => `<section class="mat ringkas"><small class="tag">[ SYSTEM ] RINGKASAN</small><h3>Ingat ini, Hunter</h3><ul class="l">${MATERI[c].tips.map((t) => `<li>${t}</li>`).join('')}</ul></section>`;
  const bindSliders = (root, ids, fn) => {
    const run = () => {
      ids.forEach((i) => {
        const e = document.getElementById(i + 'v');
        if (e) e.textContent = n2($v(i));
      });
      fn();
    };
    ids.forEach((i) => {
      const e = document.getElementById(i);
      if (e) e.oninput = run;
    });
    run();
  };
  const MOD = {},
    INIT = {};

  MOD.E = () =>
    head('E') +
    sec('WARP GATE', 'Peta Warp Gate (geser h dan k)',
      `<p class="mut">Geser slider. Gate induk $y = x^2$ (garis putus-putus) berpindah menjadi Gate baru. Panah emas adalah perpindahan Warp Gate dari $(0, 0)$ ke $(h, k)$, garis ungu adalah Aura Simetri.</p>
      <div class="mw"><div class="ctl">${slider('ewh', 'h (geser kanan/kiri)', -5, 5, 1, 2)}${slider('ewk', 'k (geser atas/bawah)', -5, 5, 1, -3)}</div>
      <div id="ewsvg"></div><p class="eq" id="ewq"></p></div>`) +
    sec('TABEL PASANGAN NILAI', 'Titik Gate induk berpindah ke mana?',
      `<p class="mut">Setiap titik $(x, x^2)$ di fungsi induk ikut bergeser menjadi $(x + h,\\; x^2 + k)$ di Gate baru. Tabel ini ikut berubah mengikuti slider di atas.</p>
      <div class="scrl"><table class="mtab" id="ewtab"></table></div>`) +
    sec('EFEK KOEFISIEN a', 'Lebar dan arah bukaan',
      `<p class="mut">Vertex tetap, tetapi nilai $a$ mengubah bentuk Gate: makin besar $|a|$ makin sempit, tanda negatif membalik ke bawah.</p><div id="easvg">${effA()}</div>`) +
    sec('JEBAKAN TANDA', 'Diagram tanda berlawanan',
      `<div class="flow">${[['(x - 3)', 'h = 3', 'geser ke KANAN'], ['(x + 4)', 'h = -4', 'geser ke KIRI'], ['+ 2 di luar', 'k = 2', 'geser ke ATAS'], ['- 5 di luar', 'k = -5', 'geser ke BAWAH']].map((s) => `<div class="fb"><b>${s[0]}</b><span>${s[1]}</span><em>${s[2]}</em></div>`).join('<i class="fa">&rarr;</i>')}</div>
      <p class="mut sm">Tanda di dalam kurung berlawanan dengan arah geser, tanda di luar kurung searah.</p>`) +
    tips('E');
  const effA = () => {
    const g = Gx(520, 260, [-4, 4], [-5, 9]),
      L = [[1, C.cy, 'a = 1'], [2, C.gold, 'a = 2'], [0.4, C.gr, 'a = 0,4'], [-1, C.pk, 'a = \u22121']];
    return svg(g, frame(g) + L.map(([a, c]) => curve(g, (x) => a * x * x, c, 3)).join('') + L.map(([a, c, t], i) => `<rect x="${g.W - 128}" y="${38 + i * 22}" width="12" height="12" fill="${c}"/><text x="${g.W - 110}" y="${49 + i * 22}" fill="${C.tx}" font-size="13">${t}</text>`).join(''), 'Parabola dengan beberapa nilai a');
  };
  INIT.E = () =>
    bindSliders(null, ['ewh', 'ewk'], () => {
      const h = $v('ewh'), k = $v('ewk'),
        g = Gx(520, 340, [-8, 8], [-6, 12]), mk = uid('mk');
      put('ewsvg', svg(g, `<defs>${arrowDef(mk, C.gold)}</defs>` + frame(g) + vline(g, h, C.vi, 'Aura Simetri x = ' + f2(h)) +
        curve(g, (x) => x * x, '#6f7fd0', 2.5, '6 5') + curve(g, (x) => (x - h) ** 2 + k, C.cy, 3.5) +
        (h || k ? `<line x1="${g.X(0)}" y1="${g.Y(0)}" x2="${g.X(h)}" y2="${g.Y(k)}" stroke="${C.gold}" stroke-width="2.5" marker-end="url(#${mk})"/>` : '') +
        (h ? `<text x="${g.X(h / 2)}" y="${g.Y(0) + (k > 0 ? 18 : -8)}" fill="${C.pk}" font-size="12" text-anchor="middle">geser h = ${f2(h)}</text>` : '') +
        dot(g, 0, 0, '#9aa6e8', 'Gate induk (0, 0)', 8, 18) + dot(g, h, k, C.gold, 'Warp Gate (' + f2(h) + ', ' + f2(k) + ')', 10, k > 3 ? 22 : -10), 'Pergeseran parabola'));
      put('ewq', `$${vertexTeX(1, h, k)}$ &nbsp;&rArr;&nbsp; vertex $(${n2(h)}, ${n2(k)})$, sumbu simetri $x = ${n2(h)}$`);
      let rows = '<tr><th>$x$</th><th>$y = x^2$</th><th>Titik induk</th><th>Titik baru $(x + h,\\; x^2 + k)$</th></tr>';
      for (let x = -3; x <= 3; x++) rows += `<tr class="${x === 0 ? 'hi' : ''}"><td>${f2(x)}</td><td>${x * x}</td><td>(${f2(x)}, ${x * x})</td><td>(${f2(x + h)}, ${f2(x * x + k)})${x === 0 ? ' &larr; vertex' : ''}</td></tr>`;
      put('ewtab', rows);
    });

  const plainEq = (a, h, k) => `y = ${a === 1 ? '' : a === -1 ? '-' : f2(a)}(x ${h < 0 ? '+ ' + f2(-h) : '- ' + f2(h)})\u00b2 ${k < 0 ? '- ' + f2(-k) : '+ ' + f2(k)}`;
  const DEX = [[1, 2, -3], [-1, -1, 5], [2, 1, 1], [-0.5, 3, 4]];
  const stepNames = [['1', 'Concavity', 'a > 0 atau a < 0'], ['2', 'Vertex', '(h, k)'], ['3', 'Sumbu simetri', 'x = h'], ['4', 'Naik / turun', 'pisah di x = h'], ['5', 'y-intercept', '(0, f(0))'], ['6', 'Domain dan Range', 'garis bilangan']];
  const flow6 = (on) => {
    const W = 560, H = 190, bw = 160, bh = 66, xs = [10, 200, 390], ys = [10, 112];
    let s = `<rect width="${W}" height="${H}" rx="10" fill="${C.bg}"/><defs>${arrowDef('fa6', C.cy)}</defs>`;
    stepNames.forEach((st, i) => {
      const x = xs[i % 3], y = ys[(i / 3) | 0], a = on === i;
      s += `<g data-step="${i}" style="cursor:pointer"><rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="10" fill="${a ? '#1b2a74' : '#101845'}" stroke="${a ? C.gold : C.bl}" stroke-width="${a ? 3 : 1.5}"/><circle cx="${x + 22}" cy="${y + 22}" r="13" fill="${a ? C.gold : C.vi}"/><text x="${x + 22}" y="${y + 27}" fill="#0b1030" font-size="15" font-weight="800" text-anchor="middle">${st[0]}</text><text x="${x + 44}" y="${y + 27}" fill="#fff" font-size="15" font-weight="700">${st[1]}</text><text x="${x + 14}" y="${y + 53}" fill="${C.cy}" font-size="13">${st[2]}</text></g>`;
      if (i % 3 < 2) s += `<line x1="${x + bw + 2}" y1="${y + bh / 2}" x2="${x + 188}" y2="${y + bh / 2}" stroke="${C.cy}" stroke-width="2" marker-end="url(#fa6)"/>`;
    });
    s += `<path d="M470 76 L470 96 L90 96 L90 112" fill="none" stroke="${C.cy}" stroke-width="2" marker-end="url(#fa6)"/>`;
    return `<svg class="mat-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Alur enam langkah analisis dungeon" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  };

  const nline = (title, lo, hi, loTxt, hiTxt, closedLo, closedHi, col) => {
    const W = 520, H = 70, y = 40, a = 30, b = W - 30;
    const x0 = lo === null ? a : 150, x1 = hi === null ? b : 370;
    return `<svg class="mat-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" rx="8" fill="${C.bg}"/><text x="10" y="16" fill="${C.tx}" font-size="13" font-weight="700">${title}</text>
    <line x1="${a}" y1="${y}" x2="${b}" y2="${y}" stroke="${C.ax}" stroke-width="2"/><line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${col}" stroke-width="7" stroke-linecap="round"/>
    ${lo === null ? `<path d="M${a - 4} ${y}l12 -8v16z" fill="${col}"/>` : `<circle cx="${x0}" cy="${y}" r="7" fill="${closedLo ? col : C.bg}" stroke="${col}" stroke-width="3"/><text x="${x0}" y="${y + 24}" fill="${col}" font-size="13" text-anchor="middle">${loTxt}</text>`}
    ${hi === null ? `<path d="M${b + 4} ${y}l-12 -8v16z" fill="${col}"/>` : `<circle cx="${x1}" cy="${y}" r="7" fill="${closedHi ? col : C.bg}" stroke="${col}" stroke-width="3"/><text x="${x1}" y="${y + 24}" fill="${col}" font-size="13" text-anchor="middle">${hiTxt}</text>`}
    </svg>`;
  };
  MOD.D = () =>
    head('D') +
    sec('ALUR ANALISIS', 'Diagram alur: 6 Langkah Analisis Dungeon',
      `<p class="mut">Klik tiap kotak langkah. Grafik di bawah menyorot bagian yang sedang dianalisis. Pilih fungsi contoh untuk mencoba dungeon lain.</p>
      <div id="dflow">${flow6(-1)}</div>
      <div class="mw"><label class="msl">Fungsi contoh<select id="dsel">${DEX.map((d, i) => `<option value="${i}">${plainEq(...d)}</option>`).join('')}</select></label>
      <div id="dsvg"></div><div class="dpanel" id="dpan"></div></div>`) +
    sec('GARIS BILANGAN', 'Domain dan Range sebagai garis bilangan',
      `<p class="mut">Domain fungsi kuadrat selalu seluruh bilangan real. Range berhenti di vertex: tertutup (titik penuh) di $y = k$ karena nilai $k$ benar-benar dicapai.</p><div id="dnl"></div>`) +
    tips('D');
  INIT.D = (root) => {
    let st = -1;
    const draw = () => {
      const [a, h, k] = DEX[+document.getElementById('dsel').value];
      const f = (x) => a * (x - h) ** 2 + k, up = a > 0,
        g = Gx(520, 340, [-7, 9], [-8, 12]), mk = uid('mk');
      let s = `<defs>${arrowDef(mk, C.gold)}</defs>` + frame(g);
      const yv = f(0);

      const on = (i) => st === -1 || st === i;
      if (on(3)) {
        const gx = (x) => g.X(x);
        s += `<path d="${[...Array(60)].map((_, i) => { const x = g.xr[0] + ((h - g.xr[0]) * i) / 59; return (i ? 'L' : 'M') + gx(x).toFixed(1) + ' ' + g.Y(f(x)).toFixed(1); }).join('')}" fill="none" stroke="${up ? C.rd : C.gr}" stroke-width="5" clip-path="url(#${g.cid})"/>`;
        s += `<path d="${[...Array(60)].map((_, i) => { const x = h + ((g.xr[1] - h) * i) / 59; return (i ? 'L' : 'M') + gx(x).toFixed(1) + ' ' + g.Y(f(x)).toFixed(1); }).join('')}" fill="none" stroke="${up ? C.gr : C.rd}" stroke-width="5" clip-path="url(#${g.cid})"/>`;
        s += `<text x="${g.X(h - 3.2)}" y="${g.Y(f(h - 3.2)) - 10}" fill="${up ? C.rd : C.gr}" font-size="13" font-weight="700">${up ? 'TURUN' : 'NAIK'}</text><text x="${g.X(h + 2)}" y="${g.Y(f(h + 2.6)) - 10}" fill="${up ? C.gr : C.rd}" font-size="13" font-weight="700">${up ? 'NAIK' : 'TURUN'}</text>`;
      } else s += curve(g, f, C.cy, 3.5);
      if (st !== -1 && st !== 3) s += curve(g, f, C.cy, 3.5);
      if (on(0)) s += `<text x="${g.W / 2}" y="${g.H - 8}" fill="${C.gold}" font-size="13" text-anchor="middle">${up ? 'a > 0: terbuka ke ATAS (tersenyum)' : 'a < 0: terbuka ke BAWAH (cemberut)'}</text>`;
      if (on(2)) s += vline(g, h, C.vi, 'x = ' + f2(h));
      if (on(1)) s += dot(g, h, k, C.gold, 'Vertex (' + f2(h) + ', ' + f2(k) + ')', 10, up ? 20 : -10);
      if (on(4)) s += dot(g, 0, yv, C.pk, '(0, ' + f2(yv) + ')', 10, -10);
      put('dsvg', svg(g, s, 'Grafik analisis dungeon'));
      put('dflow', flow6(st));
      const rg = up ? `y \\ge ${n2(k)}` : `y \\le ${n2(k)}`;
      const T = [
        `Terbuka ke <b>${up ? 'atas' : 'bawah'}</b> karena $a = ${n2(a)} ${up ? '\\gt' : '\\lt'} 0$.`,
        `Vertex $(h, k) = (${n2(h)}, ${n2(k)})$, ${up ? 'titik terendah' : 'titik tertinggi'}.`,
        `Sumbu simetri $x = ${n2(h)}$.`,
        `${up ? 'Turun' : 'Naik'} pada $(-\\infty, ${n2(h)})$, ${up ? 'naik' : 'turun'} pada $(${n2(h)}, \\infty)$.`,
        `$y$-intercept: $f(0) = ${cf(a)}(${n2(0 - h)})^2 + (${n2(k)}) = ${n2(yv)}$, titik $(0, ${n2(yv)})$.`,
        `Domain: $(-\\infty, \\infty)$. Range: $${rg}$.`,
      ];
      put('dpan', `<ol class="dsteps">${T.map((t, i) => `<li class="${st === i ? 'on' : ''}" data-step="${i}"><b>${i + 1}.</b> ${t}</li>`).join('')}</ol>`);
      put('dnl', nline('Domain', null, null, '', '', 0, 0, C.cy) + nline('Range', up ? k : null, up ? null : k, 'k = ' + f2(k), 'k = ' + f2(k), 1, 1, C.gold));
    };
    document.getElementById('dsel').onchange = draw;
    const pick = (e) => {
      const s = e.target.closest('[data-step]');
      if (!s || !root.contains(s)) return;
      const i = +s.dataset.step;
      st = st === i ? -1 : i;
      draw();
    };
    if (root._dh) root.removeEventListener('click', root._dh);
    root._dh = pick;
    root.addEventListener('click', pick);
    draw();
  };

  const anatomy = () => {
    const W = 560, H = 150;
    return `<svg class="mat-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Peran koefisien a, b, dan c" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" rx="10" fill="${C.bg}"/>
    <text x="280" y="38" fill="#fff" font-size="30" font-weight="800" text-anchor="middle"><tspan fill="${C.gold}">a</tspan>x\u00b2 + <tspan fill="${C.cy}">b</tspan>x + <tspan fill="${C.pk}">c</tspan></text>
    <path d="M205 46 L110 100" stroke="${C.gold}" stroke-width="2" fill="none"/><path d="M285 46 L285 100" stroke="${C.cy}" stroke-width="2" fill="none"/><path d="M345 46 L450 100" stroke="${C.pk}" stroke-width="2" fill="none"/>
    <g font-size="14"><rect x="20" y="100" width="180" height="40" rx="8" fill="#16205c" stroke="${C.gold}"/><text x="110" y="118" fill="${C.gold}" text-anchor="middle" font-weight="700">a: arah dan lebar</text><text x="110" y="134" fill="${C.tx}" text-anchor="middle" font-size="12">a &gt; 0 atas, a &lt; 0 bawah</text>
    <rect x="190" y="100" width="190" height="40" rx="8" fill="#16205c" stroke="${C.cy}"/><text x="285" y="118" fill="${C.cy}" text-anchor="middle" font-weight="700">b: posisi sumbu</text><text x="285" y="134" fill="${C.tx}" text-anchor="middle" font-size="12">sumbu x = \u2212b / (2a)</text>
    <rect x="370" y="100" width="180" height="40" rx="8" fill="#16205c" stroke="${C.pk}"/><text x="460" y="118" fill="${C.pk}" text-anchor="middle" font-weight="700">c: titik potong sumbu y</text><text x="460" y="134" fill="${C.tx}" text-anchor="middle" font-size="12">titik (0, c)</text></g></svg>`;
  };
  const guildG = () => {
    const g = Gx(520, 300, [-1, 10], [-20, 12], 34), f = (x) => -x * x + 10 * x - 16;
    return svg(g, frame(g, 1, 4) + curve(g, f, C.cy, 3.5) + vline(g, 5, C.vi, 'x = 5') + dot(g, 0, -16, C.pk, 'Modal (0, \u221216)', 10, -6) + dot(g, 2, 0, C.gr, 'Impas (2, 0)', -8, -10, 'end') + dot(g, 8, 0, C.gr, 'Impas (8, 0)', 8, -10) + dot(g, 5, 9, C.gold, 'Untung maks (5, 9)', 10, -10), 'Grafik profit guild');
  };
  MOD.C = () =>
    head('C') +
    sec('KRISTAL MANA', 'Profit Guild: dari rumus menjadi cerita',
      `<p class="mut">Contoh: $P(x) = -x^2 + 10x - 16$ (ribu emas) dengan $x$ ratusan kristal mana yang terjual.</p>${guildG()}
      <div class="scrl"><table class="mtab"><tr><th>Kristal (ratusan) $x$</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr><tr><th>Profit $P(x)$</th>${[...Array(10)].map((_, x) => `<td class="${x === 5 ? 'hi' : ''}">${-x * x + 10 * x - 16}</td>`).join('')}</tr></table></div>
      ${hunter('Saat belum ada kristal terjual ($x = 0$), guild rugi 16 karena modal awal, itulah $c = -16$. Guild baru balik modal di $x = 2$ dan untung terbesar 9 di $x = 5$, tepat di sumbu simetri $x = -\\dfrac{10}{2(-1)} = 5$.')}`) +
    sec('DIAGRAM ALJABAR', 'Peran koefisien a, b, dan c', `${anatomy()}
      <p class="mut">Coba geser slider. Titik merah muda selalu di $(0, c)$, garis ungu selalu di $x = -\\dfrac{b}{2a}$.</p>
      <div class="mw"><div class="ctl">${slider('csa', 'a', -3, 3, 0.5, -1)}${slider('csb', 'b', -10, 10, 1, 10)}${slider('csc', 'c', -10, 10, 1, -6)}</div><div id="csvg"></div><div class="dpanel" id="cpan"></div></div>`) +
    sec('DIAGRAM ALJABAR', 'Dari bentuk standar ke bentuk vertex (melengkapkan kuadrat)',
      `<div class="flow col">${[['Mulai', '$y = ax^2 + bx + c$'], ['Keluarkan $a$', '$y = a\\left(x^2 + \\dfrac{b}{a}x\\right) + c$'], ['Lengkapi kuadrat', '$y = a\\left(x + \\dfrac{b}{2a}\\right)^2 + c - \\dfrac{b^2}{4a}$'], ['Baca vertex', '$\\left(-\\dfrac{b}{2a},\\; c - \\dfrac{b^2}{4a}\\right)$']].map((s, i) => `<div class="fb wide"><em>${i + 1}. ${s[0]}</em><span>${s[1]}</span></div>`).join('<i class="fa dn">&darr;</i>')}</div>`) +
    tips('C');
  INIT.C = () =>
    bindSliders(null, ['csa', 'csb', 'csc'], () => {
      let a = $v('csa');
      if (a === 0) a = 0.5;
      const b = $v('csb'), c = $v('csc'), xv = -b / (2 * a), yv = a * xv * xv + b * xv + c,
        g = Gx(520, 320, [-10, 10], [-16, 16]), f = (x) => a * x * x + b * x + c;
      put('csvg', svg(g, frame(g, 2, 4) + vline(g, xv, C.vi, 'x = ' + f2(xv)) + curve(g, f, C.cy, 3.5) +
        dot(g, 0, c, C.pk, '(0, ' + f2(c) + ')', 10, -10) + dot(g, xv, yv, C.gold, 'vertex (' + f2(xv) + ', ' + f2(yv) + ')', 10, yv > 0 ? 18 : -12), 'Grafik bentuk standar'));
      put('cpan', `<p>$${stdTeX(a, b, c)}$</p><p>$y$-intercept: $(0, c) = (0, ${n2(c)})$</p><p>Sumbu simetri: $x = -\\dfrac{b}{2a} = -\\dfrac{${n2(b)}}{2 \\cdot (${n2(a)})} = ${n2(xv)}$</p><p>Vertex: $y = ${n2(a)}(${n2(xv)})^2 + (${n2(b)})(${n2(xv)}) + (${n2(c)}) = ${n2(yv)}$, jadi $(${n2(xv)}, ${n2(yv)})$ dan grafik membuka ke <b>${a > 0 ? 'atas' : 'bawah'}</b>.</p>`);
    });

  const term = (v) => (v === 0 ? '0' : (v < 0 ? '\u2212' : '') + (Math.abs(v) === 1 ? '' : Math.abs(v)) + 'x');
  const areaSVG = (r1, r2) => {
    const W = 460, H = 300, x0 = 90, y0 = 60, cw1 = 170, ch1 = 110, cw2 = 40 + Math.min(80, Math.abs(r1) * 12), ch2 = 40 + Math.min(70, Math.abs(r2) * 12);
    const cell = (x, y, w, h, col, t, t2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" fill-opacity=".28" stroke="${col}" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 + 5}" fill="#fff" font-size="${w > 120 ? 24 : 17}" font-weight="800" text-anchor="middle">${t}</text>${t2 ? `<text x="${x + w / 2}" y="${y + h - 8}" fill="${C.tx}" font-size="11" text-anchor="middle">${t2}</text>` : ''}`;
    const sgn = (v) => (v < 0 ? C.pk : v > 0 ? C.gr : C.ax);
    const lab = (r) => (r === 0 ? '0' : r > 0 ? '\u2212' + r : '+' + -r);
    return `<svg class="mat-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Area model perkalian faktor" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" rx="10" fill="${C.bg}"/>
    <text x="${x0 + cw1 / 2}" y="${y0 - 14}" fill="${C.cy}" font-size="20" font-weight="800" text-anchor="middle">x</text><text x="${x0 + cw1 + cw2 / 2}" y="${y0 - 14}" fill="${C.gold}" font-size="20" font-weight="800" text-anchor="middle">${lab(r1)}</text>
    <text x="${x0 - 14}" y="${y0 + ch1 / 2 + 7}" fill="${C.cy}" font-size="20" font-weight="800" text-anchor="end">x</text><text x="${x0 - 14}" y="${y0 + ch1 + ch2 / 2 + 7}" fill="${C.gold}" font-size="20" font-weight="800" text-anchor="end">${lab(r2)}</text>
    ${cell(x0, y0, cw1, ch1, C.bl, 'x\u00b2', 'x \u00b7 x')}${cell(x0 + cw1, y0, cw2, ch1, sgn(-r1), term(-r1), '(' + lab(r1) + ') \u00b7 x')}${cell(x0, y0 + ch1, cw1, ch2, sgn(-r2), term(-r2), 'x \u00b7 (' + lab(r2) + ')')}${cell(x0 + cw1, y0 + ch1, cw2, ch2, C.vi, String(r1 * r2), '(' + lab(r1) + ')(' + lab(r2) + ')')}
    <text x="${W / 2}" y="${H - 14}" fill="${C.tx}" font-size="14" text-anchor="middle">Luas total = x\u00b2 ${(-r1 - r2) < 0 ? '\u2212' : '+'} ${Math.abs(r1 + r2) === 1 ? '' : Math.abs(r1 + r2)}x ${r1 * r2 < 0 ? '\u2212' : '+'} ${Math.abs(r1 * r2)}</text></svg>`;
  };
  MOD.B = () =>
    head('B') +
    sec('AREA MODEL', 'Diagram Kotak Perkalian Aljabar',
      `<p class="mut">Setiap faktor adalah sisi sebuah persegi panjang. Luas semua kotak yang dijumlahkan adalah hasil kali kedua faktor. Pilih akar $r_1$ dan $r_2$ untuk melihat kotaknya berubah.</p>
      <div class="mw"><div class="ctl">${slider('br1', 'r\u2081 (akar pertama)', -6, 6, 1, -2)}${slider('br2', 'r\u2082 (akar kedua)', -6, 6, 1, 4)}</div><div id="bsvg"></div><p class="eq" id="bq"></p></div>
      ${hunter('Pemfaktoran adalah kebalikan dari kotak ini. Untuk $x^2 - 5x + 6$, cari dua bilangan yang <b>berjumlah</b> $-5$ dan <b>berkali</b> $6$. Jawabannya $-2$ dan $-3$, sehingga $(x - 2)(x - 3)$.')}`) +
    sec('JEMBATAN PORTAL', 'Arsitektur Jembatan Portal Dimensi',
      `<p class="mut">Dua Gate berdiri di $(r_1, 0)$ dan $(r_2, 0)$. Atur nilai $a$ untuk menentukan tinggi lengkung. Nilai $a$ negatif menghasilkan lengkung jembatan, positif menghasilkan lembah.</p>
      <div class="mw"><div class="ctl">${slider('bra', 'a (bentuk lengkung)', -2, 2, 0.5, -1)}</div><div id="bbr"></div><div class="dpanel" id="bpan"></div></div>`) +
    tips('B');
  INIT.B = () => {
    const draw = () => {
      let r1 = $v('br1'), r2 = $v('br2'), a = $v('bra') || -0.5;
      put('bsvg', areaSVG(r1, r2));
      const S = r1 + r2, P = r1 * r2;
      put('bq', `$${shiftTerm(r1)}${shiftTerm(r2)} = x^2 ${S === 0 ? '' : (-S < 0 ? '- ' : '+ ') + (Math.abs(S) === 1 ? '' : Math.abs(S)) + 'x'} ${P === 0 ? '' : (P < 0 ? '- ' : '+ ') + Math.abs(P)}$ &nbsp;(jumlah akar $= ${S}$, hasil kali akar $= ${P}$)`);
      const lo = Math.min(r1, r2), hi = Math.max(r1, r2), m = (lo + hi) / 2, d = hi - lo, ap = a * (m - r1) * (m - r2);
      const g = Gx(540, 320, [lo - 3, hi + 3], [Math.min(0, ap) - 2, Math.max(0, ap) + 2.5], 34), f = (x) => a * (x - r1) * (x - r2);
      let s = frame(g, 1, Math.max(1, Math.round(Math.abs(ap) / 3)));
      for (let x = lo + 0.5; x < hi; x += 0.5) s += `<line x1="${g.X(x)}" y1="${g.Y(0)}" x2="${g.X(x)}" y2="${g.Y(f(x))}" stroke="${C.vi}" stroke-opacity=".55" stroke-width="1.5"/>`;
      s += `<line x1="${g.X(lo)}" y1="${g.Y(0)}" x2="${g.X(hi)}" y2="${g.Y(0)}" stroke="${C.gold}" stroke-width="5"/>` + curve(g, f, C.cy, 4) + vline(g, m, C.vi, '');
      [r1, r2].forEach((r, i) => (s += `<ellipse cx="${g.X(r)}" cy="${g.Y(0)}" rx="12" ry="22" fill="${C.vi}" fill-opacity=".35" stroke="${C.cy}" stroke-width="3"/><ellipse cx="${g.X(r)}" cy="${g.Y(0)}" rx="5" ry="12" fill="${C.cy}"/><text x="${g.X(r)}" y="${g.Y(0) + 40}" fill="${C.cy}" font-size="13" font-weight="700" text-anchor="middle">Portal ${i ? 'B' : 'A'} (${f2(r)}, 0)</text>`));
      s += dot(g, m, ap, C.gold, 'puncak (' + f2(m) + ', ' + f2(ap) + ')', 10, ap > 0 ? -10 : 20) + `<text x="${g.X(m)}" y="${g.Y(0) - 8}" fill="${C.tx}" font-size="12" text-anchor="middle">bentang ${f2(d)}</text>`;
      put('bbr', svg(g, s, 'Jembatan Portal Dimensi'));
      put('bpan', `<p>$${facTeX(a, r1, r2)}$ &nbsp;dengan akar $x = ${n2(r1)}$ dan $x = ${n2(r2)}$</p><p>Sumbu simetri: $x = \\dfrac{${n2(r1)} + (${n2(r2)})}{2} = ${n2(m)}$. Tinggi puncak: $y = ${n2(ap)}$.</p><p>Bentuk standar: $${stdTeX(a, -a * S, a * P)}$</p>`);
    };
    bindSliders(null, ['br1', 'br2', 'bra'], draw);
  };

  const conv = () => {
    const W = 560, H = 250, N = [[110, 60, 'Vertex form', C.cy, 'y = a(x \u2212 h)\u00b2 + k'], [450, 60, 'Standard form', C.gold, 'y = ax\u00b2 + bx + c'], [280, 200, 'Factored form', C.pk, 'y = a(x \u2212 r\u2081)(x \u2212 r\u2082)']];
    const box = (n) => `<rect x="${n[0] - 100}" y="${n[1] - 28}" width="200" height="56" rx="12" fill="#101845" stroke="${n[3]}" stroke-width="2.5"/><text x="${n[0]}" y="${n[1] - 6}" fill="${n[3]}" font-size="15" font-weight="800" text-anchor="middle">${n[2]}</text><text x="${n[0]}" y="${n[1] + 16}" fill="#fff" font-size="14" text-anchor="middle">${n[4]}</text>`;
    const ar = (x1, y1, x2, y2, col, t, tx, ty) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="2" marker-end="url(#cv)"/><text x="${tx}" y="${ty}" fill="${C.tx}" font-size="12" text-anchor="middle">${t}</text>`;
    return `<svg class="mat-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Diagram konversi tiga bentuk" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" rx="10" fill="${C.bg}"/><defs>${arrowDef('cv', C.tx)}</defs>
    ${ar(212, 48, 346, 48, C.gold, 'kembangkan', 280, 38)}${ar(346, 74, 212, 74, C.cy, 'lengkapi kuadrat', 280, 92)}
    ${ar(430, 92, 340, 176, C.pk, 'faktorkan', 408, 148)}${ar(318, 178, 408, 92, C.gold, 'kembangkan', 336, 128)}
    ${ar(250, 176, 150, 92, C.cy, 'h = (r\u2081+r\u2082)/2', 160, 144)}${box(N[0])}${box(N[1])}${box(N[2])}</svg>`;
  };
  const exG = () => {
    const g = Gx(520, 300, [-5, 7], [-12, 6], 32), f = (x) => x * x - 2 * x - 8;
    return svg(g, frame(g, 1, 2) + curve(g, f, '#dfe6ff', 3.5) + vline(g, 1, C.vi, '') + dot(g, 1, -9, C.cy, 'Vertex (1, \u22129)', 10, 18) + dot(g, 0, -8, C.gold, 'y-int (0, \u22128)', 10, -10) + dot(g, -2, 0, C.pk, '(\u22122, 0)', -8, -12, 'end') + dot(g, 4, 0, C.pk, '(4, 0)', 8, -12), 'Satu fungsi tiga rahasia');
  };
  const triD = () => {
    const mk = (f, roots, t, sub, col) => {
      const g = Gx(170, 150, [-4, 4], [-3, 7], 14);
      return `<figure class="tri">${svg(g, frame(g, 2, 2).replace(/<text[^>]*>[^<]*<\/text>/g, '') + curve(g, f, col, 3) + roots.map((r) => dot(g, r, 0, C.gold, '', 0, 0)).join(''), t)}<figcaption><b style="color:${col}">${t}</b><br>${sub}</figcaption></figure>`;
    };
    return `<div class="tri3">${mk((x) => x * x - 4, [-2, 2], 'D lebih dari 0', '2 monster (2 akar real berbeda)', C.gr)}${mk((x) => (x - 1) ** 2, [1], 'D sama dengan 0', '1 boss kembar (menyentuh sumbu x)', C.gold)}${mk((x) => x * x + 2, [], 'D kurang dari 0', 'Aman: tidak ada akar real', C.rd)}</div>`;
  };
  MOD.A = () =>
    head('A') +
    sec('KARTU PERBANDINGAN CEPAT', 'Tiga bentuk, tiga kekuatan',
      `<div class="grid3 cmp">${[
        ['Vertex form', C.cy, '$y = a(x - h)^2 + k$', 'Vertex $(h, k)$ dan sumbu $x = h$', 'Menggambar cepat, mencari nilai maksimum atau minimum'],
        ['Standard form', C.gold, '$y = ax^2 + bx + c$', '$y$-intercept $(0, c)$ dan sumbu $x = -\\dfrac{b}{2a}$', 'Membaca modal awal, membandingkan lewat koefisien'],
        ['Factored form', C.pk, '$y = a(x - r_1)(x - r_2)$', 'Akar $(r_1, 0)$ dan $(r_2, 0)$, sumbu di tengah akar', 'Mencari titik potong sumbu $x$, memecahkan persamaan'],
      ].map((x) => `<div class="card cmpc" style="border-color:${x[1]}"><h4 style="color:${x[1]}">${x[0]}</h4><p class="eq">${x[2]}</p><p><b>Langsung terlihat:</b> ${x[3]}</p><p class="mut sm"><b>Dipakai untuk:</b> ${x[4]}</p></div>`).join('')}</div>`) +
    sec('DIAGRAM KONVERSI', 'Peta pindah bentuk', `${conv()}<p class="mut sm">Panah menunjukkan teknik untuk berpindah dari satu bentuk ke bentuk lain. Semuanya fungsi yang sama.</p>`) +
    sec('SATU FUNGSI TIGA RAHASIA', 'Contoh: satu parabola, tiga cara membacanya',
      `${exG()}<div class="grid3 cmp"><div class="card cmpc" style="border-color:${C.cy}"><p class="eq">$y = (x - 1)^2 - 9$</p><p class="mut sm">Vertex $(1, -9)$</p></div><div class="card cmpc" style="border-color:${C.gold}"><p class="eq">$y = x^2 - 2x - 8$</p><p class="mut sm">$y$-intercept $(0, -8)$</p></div><div class="card cmpc" style="border-color:${C.pk}"><p class="eq">$y = (x + 2)(x - 4)$</p><p class="mut sm">Akar $-2$ dan $4$</p></div></div>`) +
    sec('RADAR PENDETEKSI MONSTER', 'Tiga kondisi diskriminan', `${triD()}<p class="mut">$D = b^2 - 4ac$ memberi tahu jumlah akar real sebelum kamu mencarinya. Pelajari radarnya lebih dalam di Rank S.</p>`) +
    tips('A');

  const radar2 = (D, rs) => {
    const R = 115, cx = 130, cy = 130;
    const blip = (ang, r, col, big) => `<circle cx="${cx + Math.cos(ang) * r}" cy="${cy - Math.sin(ang) * r}" r="${big ? 10 : 7}" fill="${col}"><animate attributeName="opacity" values="1;.3;1" dur="1.2s" repeatCount="indefinite"/></circle>`;
    let b = '';
    if (D > 0) b = blip(0.9, 70, C.rd, 0) + blip(2.6, 85, C.rd, 0);
    else if (D === 0) b = blip(1.57, 55, C.gold, 1);
    const txt = D > 0 ? '2 MONSTER TERDETEKSI' : D === 0 ? '1 BOSS KEMBAR' : 'AREA AMAN';
    return `<svg class="mat-svg" viewBox="0 0 260 280" role="img" aria-label="Radar pendeteksi monster" xmlns="http://www.w3.org/2000/svg"><rect width="260" height="280" rx="12" fill="#06122a"/>
    ${[30, 60, 90, 115].map((r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1f6f5a" stroke-width="1.5"/>`).join('')}<line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="#1f6f5a"/><line x1="${cx}" y1="${cy - R}" x2="${cx}" y2="${cy + R}" stroke="#1f6f5a"/>
    <g class="sweep" style="transform-origin:${cx}px ${cy}px"><path d="M${cx} ${cy} L${cx + R} ${cy} A${R} ${R} 0 0 0 ${cx + R * Math.cos(0.6)} ${cy - R * Math.sin(0.6)} Z" fill="#4cc38a" fill-opacity=".35"/></g>${b}
    <text x="130" y="268" fill="${D > 0 ? C.rd : D === 0 ? C.gold : C.gr}" font-size="15" font-weight="800" text-anchor="middle">${txt}</text></svg>`;
  };
  const solve = (a, b, c, op) => {
    const D = b * b - 4 * a * c, f = (x) => a * x * x + b * x + c, nonst = op === '>=' || op === '<=';
    const hold = (v, pt) => (pt ? nonst : op === '>' || op === '>=' ? v > 0 : v < 0);
    const rs = D > 0 ? [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((x, y) => x - y) : D === 0 ? [-b / (2 * a)] : [];
    const els = [];
    const edges = [-Infinity].concat(rs, [Infinity]);
    for (let i = 0; i < edges.length - 1; i++) {
      const lo = edges[i], hi = edges[i + 1], t = lo === -Infinity && hi === Infinity ? 0 : lo === -Infinity ? hi - 1 : hi === Infinity ? lo + 1 : (lo + hi) / 2;
      els.push({ pt: 0, lo, hi, ok: hold(f(t), 0) });
      if (i < rs.length) els.push({ pt: 1, lo: rs[i], hi: rs[i], ok: hold(0, 1) });
    }
    const runs = [];
    els.forEach((e) => {
      const last = runs[runs.length - 1];
      if (!e.ok) return;
      if (last && last.end === e) { last.hi = e.hi; last.hiC = e.pt; last.end = els[els.indexOf(e) + 1]; }
      else runs.push({ lo: e.lo, hi: e.hi, loC: e.pt, hiC: e.pt, end: els[els.indexOf(e) + 1] });
    });
    const tex = (r) => {
      if (r.lo === -Infinity && r.hi === Infinity) return 'x \\in \\mathbb{R}';
      if (r.lo === r.hi) return `x = ${n2(r.lo)}`;
      if (r.lo === -Infinity) return `x ${r.hiC ? '\\le' : '\\lt'} ${n2(r.hi)}`;
      if (r.hi === Infinity) return `x ${r.loC ? '\\ge' : '\\gt'} ${n2(r.lo)}`;
      return `${n2(r.lo)} ${r.loC ? '\\le' : '\\lt'} x ${r.hiC ? '\\le' : '\\lt'} ${n2(r.hi)}`;
    };
    return { D, rs, runs, text: runs.length ? runs.map((r) => '$' + tex(r) + '$').join(' atau ') : 'tidak ada penyelesaian (himpunan kosong)' };
  };
  const numLine = (rs, runs) => {
    const W = 540, H = 96, a = 26, b = W - 26, X = (x) => a + ((Math.max(-12, Math.min(12, x)) + 12) / 24) * (b - a), y = 52;
    let s = `<rect width="${W}" height="${H}" rx="10" fill="${C.bg}"/><line x1="${a}" y1="${y}" x2="${b}" y2="${y}" stroke="${C.ax}" stroke-width="2"/>`;
    for (let t = -12; t <= 12; t += 2) s += `<line x1="${X(t)}" y1="${y - 5}" x2="${X(t)}" y2="${y + 5}" stroke="${C.ax}"/><text x="${X(t)}" y="${y + 22}" fill="${C.ax}" font-size="11" text-anchor="middle">${t}</text>`;
    runs.forEach((r) => (s += `<line x1="${r.lo === -Infinity ? a : X(r.lo)}" y1="${y}" x2="${r.hi === Infinity ? b : X(r.hi)}" y2="${y}" stroke="${C.gr}" stroke-width="9" stroke-linecap="round" stroke-opacity=".85"/>${r.lo === -Infinity ? `<path d="M${a - 4} ${y}l12 -9v18z" fill="${C.gr}"/>` : ''}${r.hi === Infinity ? `<path d="M${b + 4} ${y}l-12 -9v18z" fill="${C.gr}"/>` : ''}`));
    rs.forEach((r) => {
      const inc = runs.some((q) => (q.lo === r && q.loC) || (q.hi === r && q.hiC) || (q.lo < r && q.hi > r));
      s += `<circle cx="${X(r)}" cy="${y}" r="8" fill="${inc ? C.gold : C.bg}" stroke="${C.gold}" stroke-width="3"/><text x="${X(r)}" y="${y - 16}" fill="${C.gold}" font-size="13" font-weight="700" text-anchor="middle">${f2(r)}</text>`;
    });
    return `<svg class="mat-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Garis bilangan akar dan penyelesaian" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  };
  MOD.S = () =>
    head('S') +
    sec('RADAR PENDETEKSI MONSTER', 'Diskriminan interaktif',
      `<p class="mut">Atur $a$, $b$, dan $c$ (bentuk standar). Radar menghitung $D = b^2 - 4ac$ lalu menunjukkan berapa monster (akar real) bersembunyi di sumbu $x$. Atau tekan tombol cepat.</p>
      <div class="mw"><p class="presets"><button class="btn ghost" data-pre="2">D &gt; 0 (dua akar)</button><button class="btn ghost" data-pre="1">D = 0 (satu akar)</button><button class="btn ghost" data-pre="0">D &lt; 0 (tanpa akar)</button></p>
      <div class="ctl">${slider('sra', 'a', -3, 3, 0.5, 1)}${slider('srb', 'b', -10, 10, 1, -2)}${slider('src', 'c', -12, 12, 1, -8)}</div>
      <div class="two"><div id="srad"></div><div id="sgr"></div></div><div class="dpanel" id="span"></div></div>`) +
    sec('GARIS BILANGAN', 'Akar sebagai titik di garis bilangan dan pertidaksamaan',
      `<p class="mut">Pilih tanda pertidaksamaan untuk fungsi yang sama. Titik kosong berarti tidak termasuk, titik penuh berarti termasuk. Bagian hijau adalah wilayah aman (penyelesaian).</p>
      <div class="mw"><label class="msl">Tanda<select id="sop"><option value="&gt;">f(x) &gt; 0</option><option value="&lt;">f(x) &lt; 0</option><option value="&gt;=">f(x) &#8805; 0</option><option value="&lt;=">f(x) &#8804; 0</option></select></label>
      <div id="snl"></div><p class="eq" id="ssol"></p></div>
      <div class="flow">${[['1. Satu ruas', 'pindahkan semua suku sehingga lawannya 0'], ['2. Cari akar', 'faktorkan atau pakai rumus'], ['3. Garis bilangan', 'tandai akar, bagi menjadi daerah'], ['4. Uji tanda', 'ambil satu titik tiap daerah']].map((s) => `<div class="fb"><b>${s[0]}</b><em>${s[1]}</em></div>`).join('<i class="fa">&rarr;</i>')}</div>`) +
    tips('S');
  INIT.S = (root) => {
    const draw = () => {
      let a = $v('sra');
      if (a === 0) a = 0.5;
      const b = $v('srb'), c = $v('src'), op = document.getElementById('sop').value, r = solve(a, b, c, op), D = r.D;
      put('srad', radar2(D, r.rs));
      const g = Gx(300, 260, [-8, 8], [-12, 12], 26), f = (x) => a * x * x + b * x + c;
      put('sgr', svg(g, frame(g, 4, 4) + curve(g, f, C.cy, 3.5) + r.rs.map((x) => dot(g, x, 0, C.gold, '', 0, 0)).join(''), 'Grafik fungsi dan akarnya'));
      put('span', `<p>$${stdTeX(a, b, c)}$</p><p>$D = b^2 - 4ac = (${n2(b)})^2 - 4(${n2(a)})(${n2(c)}) = ${n2(D)}$ &nbsp;&rArr;&nbsp; <b>${D > 0 ? 'dua akar real berbeda' : D === 0 ? 'satu akar real (kembar)' : 'tidak ada akar real'}</b></p>${D >= 0 ? `<p>Akar: ${r.rs.map((x, i) => `$x_${i + 1} = ${n2(x)}$`).join(', ')}${r.rs.length === 1 ? ' (grafik menyentuh sumbu $x$ di vertex)' : ''}</p>` : '<p>Parabola tidak memotong sumbu $x$.</p>'}`);
      put('snl', numLine(r.rs, r.runs));
      put('ssol', `Penyelesaian $f(x)\\; ${op === '>' ? '\\gt' : op === '<' ? '\\lt' : op === '>=' ? '\\ge' : '\\le'}\\; 0$: ${r.text}`);
    };
    document.getElementById('sop').onchange = draw;
    bindSliders(null, ['sra', 'srb', 'src'], draw);
    const pre = (e) => {
      const p = e.target.closest('[data-pre]');
      if (!p) return;
      const v = { 2: [1, -2, -8], 1: [1, -4, 4], 0: [1, 0, 4] }[p.dataset.pre];
      ['sra', 'srb', 'src'].forEach((id, i) => (document.getElementById(id).value = v[i]));
      draw();
      ['sra', 'srb', 'src'].forEach((id) => (document.getElementById(id + 'v').textContent = n2($v(id))));
    };
    if (root._ph) root.removeEventListener('click', root._ph);
    root._ph = pre;
    root.addEventListener('click', pre);
  };

  M.kit = { Gx, frame, curve, dot, vline, arrowDef, svg, f2, n2, C, $v, put, slider, vertexTeX, stdTeX, facTeX };
  const ice = (c) => !!(window.Ice && Ice.has(c));
  M.has = (c) => ice(c) || !!MOD[c];
  M.html = (c) => (ice(c) ? Ice.html(c) : MOD[c] ? MOD[c]() : '');
  M.init = (c, root) => (ice(c) ? Ice.init(c, root || document.getElementById('rk')) : INIT[c] && INIT[c](root || document.getElementById('rk')));
  return M;
})();
