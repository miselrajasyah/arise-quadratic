'use strict';

window.Avatar = (() => {
  const A = {};
  const HEX = /^#[0-9a-fA-F]{6}$/;
  const ACC = ['none', 'crown', 'visor', 'horns', 'halo', 'scar', 'mask', 'headband'];
  const ACCN = { none: 'Tanpa', crown: 'Mahkota', visor: 'Visor', horns: 'Tanduk', halo: 'Halo', scar: 'Bekas luka', mask: 'Masker', headband: 'Ikat kepala' };
  const HSN = ['Pendek', 'Panjang', 'Cepak', 'Jabrik', 'Kuncir'];
  const PHOTO_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
  const MAXPH = 40000;
  const DEF = { k: 'build', hs: 0, hc: '#14122a', sk: '#f3d9c4', ar: '#5b3fd9', ey: '#9a5aff', bg: '#1a2152', ac: 'none' };
  const PAL = {
    hc: ['#14122a', '#4a2b12', '#c9a227', '#e8e8f0', '#c93a3a', '#2fd6a0', '#4d8bff', '#f472a8'],
    sk: ['#fbe5d3', '#f3d9c4', '#e0b48f', '#c58c5f', '#8d5a3b', '#5a3a28'],
    ar: ['#5b3fd9', '#4d8bff', '#c93a3a', '#2fd6a0', '#ffb84d', '#3a3f5c', '#f472a8'],
    ey: ['#9a5aff', '#5ee6f2', '#ff5a7a', '#4cc38a', '#ffd86b', '#4d8bff'],
    bg: ['#1a2152', '#2a1650', '#103a40', '#4a1c2a', '#3a3a1c', '#0b0b1a'],
  };
  const esc3 = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const hex = (v, d) => (typeof v === 'string' && HEX.test(v) ? v.toLowerCase() : d);

  A.clean = (av, ph) => {
    if (!av || typeof av !== 'object') return null;
    const o = { k: av.k === 'photo' ? 'photo' : 'build', ts: Number.isFinite(av.ts) ? av.ts : 0 };
    o.hs = Number.isInteger(av.hs) && av.hs >= 0 && av.hs < HSN.length ? av.hs : DEF.hs;
    ['hc', 'sk', 'ar', 'ey', 'bg'].forEach((k) => (o[k] = hex(av[k], DEF[k])));
    o.ac = ACC.includes(av.ac) ? av.ac : 'none';
    if (o.k === 'photo') {
      if (typeof ph === 'string' && ph.length <= 45000 && PHOTO_RE.test(ph)) return { av: o, ph };
      o.k = 'build';
    }
    return { av: o };
  };

  const hairBack = (hs, c) =>
    hs === 1
      ? `<path d="M26 46Q22 20 50 18Q78 20 74 46L80 82Q66 74 62 62L38 62Q34 74 20 82Z" fill="${c}"/>`
      : hs === 4
        ? `<path d="M66 34Q96 38 86 76Q80 58 66 50Z" fill="${c}"/>`
        : '';
  const hairFront = (hs, c) =>
    [
      `<path d="M28 44Q27 22 50 20Q73 22 72 44Q66 34 58 37L52 27L46 37Q36 33 28 44Z" fill="${c}"/>`,
      `<path d="M28 42Q33 25 50 25Q67 25 72 42Q60 33 50 38Q40 33 28 42Z" fill="${c}"/>`,
      `<path d="M29 40Q30 23 50 22Q70 23 71 40Q60 31 50 33Q40 31 29 40Z" fill="${c}"/>`,
      `<path d="M28 42L23 20L37 29L43 12L52 27L62 10L64 29L78 20L72 42Q60 32 50 35Q40 32 28 42Z" fill="${c}"/>`,
      `<path d="M29 40Q30 23 50 22Q70 23 71 40Q60 31 50 33Q40 31 29 40Z" fill="${c}"/>`,
    ][hs];
  const accessory = (ac, a) =>
    ({
      crown: '<path d="M34 26L37 11L44 20L50 8L56 20L63 11L66 26Z" fill="#ffd86b" stroke="#b8860b" stroke-width="1.5"/>',
      visor: '<rect x="29" y="41" width="42" height="11" rx="5.5" fill="#5ee6f2" opacity=".5" stroke="#bff6fb" stroke-width="1.5"/>',
      horns: '<path d="M33 30L26 10L42 24Z M67 30L74 10L58 24Z" fill="#c93a3a" stroke="#6b1414" stroke-width="1.2"/>',
      halo: '<ellipse cx="50" cy="14" rx="17" ry="4.5" fill="none" stroke="#ffd86b" stroke-width="3"/>',
      scar: '<path d="M36 38L46 58" stroke="#c93a3a" stroke-width="2.2" stroke-linecap="round"/>',
      mask: `<path d="M32 54Q50 60 68 54L66 66Q50 72 34 66Z" fill="#23233a" stroke="${a.ar}" stroke-width="1.5"/>`,
      headband: `<path d="M29 34Q50 28 71 34L71 40Q50 34 29 40Z" fill="${a.ar}"/><circle cx="73" cy="38" r="3.2" fill="${a.ar}"/>`,
    })[ac] || '';
  A.svg = (a) => {
    const v = A.clean(a, null);
    const x = v ? v.av : DEF;
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="100" height="100" fill="${x.bg}"/>
<circle cx="50" cy="50" r="46" fill="#ffffff" opacity=".05"/>
${hairBack(x.hs, x.hc)}
<path d="M10 100Q12 74 50 70Q88 74 90 100Z" fill="${x.ar}" stroke="#ffffff" stroke-opacity=".35" stroke-width="1.5"/>
<path d="M32 100L50 80L68 100" fill="none" stroke="#ffffff" stroke-opacity=".45" stroke-width="2"/><circle cx="50" cy="86" r="3.5" fill="#ffd86b"/>
<rect x="44" y="60" width="12" height="14" fill="${x.sk}"/>
<ellipse cx="50" cy="46" rx="20" ry="22" fill="${x.sk}"/><circle cx="30" cy="48" r="3.2" fill="${x.sk}"/><circle cx="70" cy="48" r="3.2" fill="${x.sk}"/>
${hairFront(x.hs, x.hc)}
<ellipse cx="41" cy="48" rx="4.6" ry="5" fill="#fff"/><ellipse cx="59" cy="48" rx="4.6" ry="5" fill="#fff"/>
<circle cx="41" cy="48.5" r="3" fill="${x.ey}"/><circle cx="59" cy="48.5" r="3" fill="${x.ey}"/>
<circle cx="42" cy="47" r="1" fill="#fff"/><circle cx="60" cy="47" r="1" fill="#fff"/>
<path d="M45 60Q50 64 55 60" fill="none" stroke="#4a2230" stroke-width="2" stroke-linecap="round"/>
${accessory(x.ac, x)}</svg>`;
  };

  const src = (name) => {
    const u = DB.me && DB.users[DB.me];
    if (u && u.name === name && u.av) return { av: u.av, ph: u.ph };
    const o = window.Sync && Sync.avatarOf && Sync.avatarOf(name);
    if (o && o.av) return { av: o.av, ph: o.ph };
    const x = DB.users[name];
    if (x && x.av) return { av: x.av, ph: x.ph };
    return null;
  };
  const initial = (name) => {
    let h = 0;
    for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) | 0;
    return `<b class="avi" style="background:hsl(${Math.abs(h) % 360} 55% 42%)">${window.IC ? IC('hunter') : esc3(String(name || '?')[0].toUpperCase())}</b>`;
  };
  const inner = (name) => {
    const s = src(name);
    if (!s) return initial(name);
    if (s.av.k === 'photo' && s.ph) return `<img src="${s.ph}" alt="" width="128" height="128" decoding="async">`;
    return A.svg(s.av);
  };

  A.html = (name, size = 32) => `<span class="av" data-av="${esc3(name)}" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.5)}px">${inner(name)}</span>`;
  A.refreshAll = () => document.querySelectorAll('.av[data-av]').forEach((e) => (e.innerHTML = inner(e.dataset.av)));

  A.compress = (file) =>
    new Promise((res, rej) => {
      if (!file || !/^image\//.test(file.type)) return rej(new Error('Pilih file gambar (JPG, PNG, atau WEBP).'));
      if (file.size > 12 * 1024 * 1024) return rej(new Error('Gambar terlalu besar (maksimal 12 MB).'));
      const url = URL.createObjectURL(file),
        im = new Image();
      im.onload = () => {
        const side = Math.min(im.width, im.height),
          sx = (im.width - side) / 2,
          sy = (im.height - side) / 2;
        let out = '';
        for (const [px, q] of [[128, 0.78], [128, 0.62], [112, 0.55], [96, 0.5], [80, 0.45]]) {
          const c = document.createElement('canvas');
          c.width = c.height = px;
          const g = c.getContext('2d');
          g.fillStyle = '#fff';
          g.fillRect(0, 0, px, px);
          g.imageSmoothingQuality = 'high';
          g.drawImage(im, sx, sy, side, side, 0, 0, px, px);
          out = c.toDataURL('image/jpeg', q);
          if (out.length <= MAXPH) break;
        }
        URL.revokeObjectURL(url);
        out.length <= MAXPH && PHOTO_RE.test(out) ? res(out) : rej(new Error('Foto masih terlalu besar. Coba foto lain.'));
      };
      im.onerror = () => {
        URL.revokeObjectURL(url);
        rej(new Error('Gambar tidak bisa dibaca.'));
      };
      im.src = url;
    });

  let D = null;
  const sw = (key) => PAL[key].map((c) => `<button type="button" class="sw" data-sw="${key}" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join('');
  const colorRow = (key, label) => `<div class="avrow"><span>${label}</span><div class="sws">${sw(key)}<input type="color" data-col="${key}" value="${D[key]}" aria-label="${label} bebas"></div></div>`;
  A.view = () => {
    const u = me(),
      cur = u.av ? A.clean(u.av, u.ph) : null;
    D = Object.assign({}, DEF, cur ? cur.av : {}, { ph: cur && cur.ph ? cur.ph : null });
    const mode = D.k;
    return `<div class="sys rv"><small class="tag">[ SYSTEM ] AVATAR HUNTER</small><h2>Avatar ${esc3(u.name)}</h2><p class="mut">Rakit karaktermu sendiri atau pakai fotomu. Avatar tampil di header, profil, peringkat, dan forum.</p></div>
<div class="grid2"><div class="card rv avprev"><div id="avp" class="avbig">${A.draftInner()}</div><div class="tabs" id="avm" style="margin-top:14px"><button type="button" data-m="build" class="${mode === 'build' ? 'on' : ''}">Rakit avatar</button><button type="button" data-m="photo" class="${mode === 'photo' ? 'on' : ''}">Unggah foto</button></div>
<p style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="avs">Simpan avatar</button><button class="btn ghost" data-go="#/${u.role === 'teacher' ? 'class' : 'profile'}">Batal</button></p><p class="mut sm" id="avmsg"></p></div>
<div class="card rv" id="avc">${A.controls()}</div></div>`;
  };
  A.draftInner = () => (D.k === 'photo' && D.ph ? `<img src="${D.ph}" alt="Foto profil">` : D.k === 'photo' ? '<p class="mut sm" style="padding:20px">Belum ada foto dipilih.</p>' : A.svg(D));
  A.controls = () =>
    D.k === 'photo'
      ? `<h3>Foto dari perangkat</h3><p class="mut sm">Foto dipotong persegi dari bagian tengah, dikecilkan dan dikompres otomatis (di bawah 40 KB) agar ringan disimpan di cloud.</p><label class="avfile">Pilih foto<input type="file" id="avf" accept="image/*"></label><p class="mut sm">Tips: pakai foto wajah dengan latar sederhana.</p>${D.ph ? '<p><button class="btn ghost" id="avx">Buang foto</button></p>' : ''}`
      : `<h3>Rakit karaktermu</h3>
<div class="avrow"><span>Gaya rambut</span><div class="chips">${HSN.map((n, i) => `<button type="button" class="chipb ${D.hs === i ? 'on' : ''}" data-hs="${i}">${n}</button>`).join('')}</div></div>
${colorRow('hc', 'Warna rambut')}${colorRow('sk', 'Warna kulit')}${colorRow('ar', 'Warna zirah')}${colorRow('ey', 'Warna mata')}${colorRow('bg', 'Latar')}
<div class="avrow"><span>Aksesori</span><div class="chips">${ACC.map((a) => `<button type="button" class="chipb ${D.ac === a ? 'on' : ''}" data-ac="${a}">${ACCN[a]}</button>`).join('')}</div></div>
<p><button class="btn ghost" id="avr">Acak</button></p>`;
  const rd = () => {
    $('#avp').innerHTML = A.draftInner();
  };
  const rc = () => {
    $('#avc').innerHTML = A.controls();
  };
  const msg = (t, bad) => {
    const m = $('#avmsg');
    if (m) {
      m.textContent = t;
      m.style.color = bad ? 'var(--gold)' : 'var(--gr)';
    }
  };
  A.post = () => {
    const root = $('#view');
    root.onclick = (e) => {
      const t = e.target;
      const m = t.closest('#avm [data-m]');
      if (m) {
        D.k = m.dataset.m;
        $$('#avm button').forEach((b) => b.classList.toggle('on', b === m));
        rd();
        return rc();
      }
      const s = t.closest('[data-sw]');
      if (s) {
        D[s.dataset.sw] = s.dataset.c;
        const i = $(`[data-col=${s.dataset.sw}]`);
        i && (i.value = s.dataset.c);
        return rd();
      }
      const hs = t.closest('[data-hs]');
      if (hs) {
        D.hs = +hs.dataset.hs;
        $$('[data-hs]').forEach((b) => b.classList.toggle('on', b === hs));
        return rd();
      }
      const ac = t.closest('[data-ac]');
      if (ac) {
        D.ac = ac.dataset.ac;
        $$('[data-ac]').forEach((b) => b.classList.toggle('on', b === ac));
        return rd();
      }
      if (t.closest('#avr')) {
        const p = (k) => PAL[k][Math.floor(Math.random() * PAL[k].length)];
        Object.assign(D, { hs: Math.floor(Math.random() * HSN.length), hc: p('hc'), sk: p('sk'), ar: p('ar'), ey: p('ey'), bg: p('bg'), ac: ACC[Math.floor(Math.random() * ACC.length)] });
        rd();
        return rc();
      }
      if (t.closest('#avx')) {
        D.ph = null;
        rd();
        return rc();
      }
      if (t.closest('#avs')) {
        const u = me();
        if (D.k === 'photo' && !D.ph) return msg('Pilih foto dulu, atau pindah ke Rakit avatar.', true);
        const out = A.clean(Object.assign({}, D, { ts: Date.now() }), D.ph);
        if (!out) return msg('Data avatar tidak valid.', true);
        u.av = out.av;
        if (out.ph) u.ph = out.ph;
        else delete u.ph;
        save();
        A.refreshAll();
        const w = $('#who');
        if (w) w.querySelector('.whoav') && (w.querySelector('.whoav').innerHTML = A.html(u.name, 30));
        AU.sfx('ok');
        toast(u.cloud ? 'Avatar disimpan dan tersinkron ke cloud' : 'Avatar disimpan di perangkat ini');
        msg('Tersimpan.');
      }
    };
    root.oninput = (e) => {
      const c = e.target.closest('[data-col]');
      if (c) {
        D[c.dataset.col] = c.value;
        rd();
      }
    };
    root.onchange = async (e) => {
      if (!e.target.matches('#avf')) return;
      msg('Memproses foto...');
      try {
        D.ph = await A.compress(e.target.files[0]);
        D.k = 'photo';
        rd();
        rc();
        msg('Foto siap (' + Math.round(D.ph.length / 1024) + ' KB). Tekan Simpan avatar.');
      } catch (er) {
        msg(er.message || 'Gagal memproses foto.', true);
      }
    };
  };
  return A;
})();
