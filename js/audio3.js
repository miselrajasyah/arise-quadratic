'use strict';

(() => {
  const LS = {
    get: (k, d) => {
      try {
        const v = localStorage.getItem(k);
        return v === null ? d : v;
      } catch (e) {
        return d;
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, v);
      } catch (e) {

      }
    },
  };

  const kick = (t, g = 0.4, dest) => {
    const c = AU.ctx,
      o = c.createOscillator(),
      v = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.18);
    v.gain.setValueAtTime(g, t);
    v.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(v);
    v.connect(dest || AU.master);
    o.start(t);
    o.stop(t + 0.35);
  };
  const T = (f, t, d, ty, g, dest) => AU.tone(f, t, d, ty, g, dest);

  const BGM = {
    dungeon: {
      n: 'Dungeon (bawaan)',
      bpm: 84,
      vol: 0.6,
      chords: [
        [110, 220, 261.6, 329.6],
        [87.3, 174.6, 220, 261.6],
        [130.8, 261.6, 329.6, 392],
        [98, 196, 246.9, 293.7],
      ],
      play(c, s, t, sp, mg) {
        if (s === 0) {
          T(c[0] / 2, t, sp * 14, 'sawtooth', 0.08, mg);
          T(c[1], t, sp * 15, 'triangle', 0.05, mg);
        }
        if (s % 2 === 0) T(c[[1, 2, 3, 2][(s / 2) % 4]] * 2, t, sp * 1.6, 'triangle', 0.07, mg);
        if (s % 8 === 4) T(55, t, 0.28, 'sine', 0.3, mg);
      },
    },
    arise: {
      n: 'Arise (epik)',
      bpm: 72,
      vol: 0.55,
      chords: [
        [73.42, 146.83, 174.61, 220],
        [58.27, 116.54, 146.83, 174.61],
        [87.31, 174.61, 220, 261.63],
        [65.41, 130.81, 164.81, 196],
      ],
      play(c, s, t, sp, mg) {
        if (s === 0) {
          T(c[0], t, sp * 15, 'sawtooth', 0.07, mg);
          T(c[0] * 1.006, t, sp * 15, 'sawtooth', 0.05, mg);
          T(c[2] * 2, t, sp * 15, 'triangle', 0.035, mg);
          T(c[3] * 2, t, sp * 15, 'triangle', 0.03, mg);
        }
        if (s % 4 === 0) T(c[(s / 4) % 4] * 4, t, sp * 3, 'triangle', 0.045, mg);
        if (s === 0 || s === 8) kick(t, 0.5, mg);
        if (s === 12) kick(t, 0.28, mg);
      },
    },
    study: {
      n: 'Belajar Tenang',
      bpm: 68,
      vol: 0.7,
      chords: [
        [65.41, 261.63, 329.63, 493.88],
        [55, 220, 261.63, 392],
        [87.31, 220, 261.63, 329.63],
        [98, 246.94, 293.66, 392],
      ],
      scale: [523.25, 587.33, 659.25, 783.99, 880],
      play(c, s, t, sp, mg) {
        if (s === 0) {
          T(c[0], t, sp * 15, 'sine', 0.12, mg);
          [1, 2, 3].forEach((i) => T(c[i], t, sp * 15, 'sine', 0.03, mg));
        }
        if (s % 4 === 2 && Math.random() < 0.6) T(this.scale[Math.floor(Math.random() * this.scale.length)], t, sp * 3, 'sine', 0.05, mg);
        if (s === 8) T(c[0] * 2, t, sp * 2, 'sine', 0.05, mg);
      },
    },
    battle: {
      n: 'Raid Battle',
      bpm: 132,
      vol: 0.5,
      chords: [
        [55, 220, 261.63, 329.63],
        [87.31, 174.61, 220, 261.63],
        [65.41, 261.63, 329.63, 392],
        [49, 196, 246.94, 293.66],
      ],
      play(c, s, t, sp, mg) {
        T(c[0] * (s % 4 === 3 ? 2 : 1), t, sp * 0.8, 'sawtooth', 0.06, mg);
        if (s % 4 === 0) kick(t, 0.45, mg);
        if (s % 8 === 4) T(190, t, 0.08, 'square', 0.05, mg);
        T(c[1 + (s % 3)] * 2, t, sp * 0.6, 'square', 0.03, mg);
      },
    },
    gate: {
      n: 'Shadow Gate (ambient)',
      bpm: 56,
      vol: 0.7,
      chords: [
        [55, 110, 116.54, 164.81],
        [58.27, 116.54, 138.59, 174.61],
        [49, 98, 116.54, 146.83],
        [55, 110, 130.81, 155.56],
      ],
      play(c, s, t, sp, mg) {
        if (s === 0) {
          T(c[0], t, sp * 16, 'sine', 0.14, mg);
          T(c[0] * 1.01, t, sp * 16, 'sine', 0.1, mg);
          T(c[1], t, sp * 16, 'triangle', 0.05, mg);
          T(c[2] * 2, t, sp * 16, 'sine', 0.02, mg);
        }
        if (s % 2 === 0 && Math.random() < 0.22) T(c[3] * (Math.random() < 0.5 ? 4 : 8), t, sp * 6, 'sine', 0.04, mg);
      },
    },
  };
  AU.mood = BGM[LS.get('ad_mood', 'dungeon')] ? LS.get('ad_mood', 'dungeon') : 'dungeon';
  AU.start = function () {
    this.init();
    this.ctx.resume();
    if (this.mus) return;
    this.mus = true;
    const M = BGM[this.mood] || BGM.dungeon,
      mg = (this.mg = this.ctx.createGain());
    mg.gain.value = M.vol;
    mg.connect(this.master);
    const sp = 60 / M.bpm / 2;
    let step = 0,
      next = this.ctx.currentTime + 0.1;
    this.timer = setInterval(() => {
      while (next < this.ctx.currentTime + 0.5) {
        M.play(M.chords[Math.floor(step / 16) % M.chords.length], step % 16, next, sp, mg);
        next += sp;
        step++;
      }
    }, 120);
  };
  AU.stop = function () {
    clearInterval(this.timer);
    this.mus = false;
    const g = this.mg;
    if (g) {
      try {
        g.gain.cancelScheduledValues(0);
        g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
      } catch (e) {
        g.gain.value = 0;
      }
      setTimeout(() => {
        try {
          g.disconnect();
        } catch (e) {

        }
      }, 400);
    }
  };
  AU.setMood = function (id) {
    if (!BGM[id]) return;
    this.mood = id;
    LS.set('ad_mood', id);
    if (this.mus) {
      this.stop();
      setTimeout(() => this.start(), 120);
    }
    Aud.sync();
  };

  if (LS.get('ad_mute', '0') === '1') AU.manual = 1;

  const VOICES = {
    kage: { pitch: 0.55, rate: 0.88, g: 'm' },
    parabo: { pitch: 1.8, rate: 1.15, g: 'n' },
    noir: { pitch: 0.7, rate: 0.92, g: 'm' },
    lumi: { pitch: 1.5, rate: 1.1, g: 'f' },
    ratu: { pitch: 1.3, rate: 0.95, g: 'f' },
    raja: { pitch: 0.5, rate: 0.8, g: 'm' },
    mochi: { pitch: 1.9, rate: 1.2, g: 'n' },
    aurel: { pitch: 1.1, rate: 0.9, g: 'f' },
    zeri: { pitch: 1.7, rate: 1.12, g: 'f' },
    gildan: { pitch: 0.6, rate: 0.85, g: 'm' },
  };
  const LANGS = { id: 'id-ID', en: 'en-US', ja: 'ja-JP', ko: 'ko-KR' };
  const FEM = /female|woman|girl|zira|samantha|karen|susan|victoria|kyoko|yuna|heami|damayanti|ardi|google.*(indonesia|japan|korea)/i;
  const MAL = /\bmale\b|\bman\b|david|mark|daniel|alex|otoya|ichiro|injoon|guy/i;
  const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);
  const SYN = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window ? window.speechSynthesis : null;
  const Voice = {
    on: LS.get('ad_voice', '1') !== '0',
    idle: false,
    supported: !!SYN,
    list: [],
    lang: () => LANGS[(window.I18N && I18N.lang) || 'id'] || 'id-ID',
    load() {
      if (SYN) this.list = SYN.getVoices() || [];
    },

    pick(id) {
      const code = this.lang().slice(0, 2).toLowerCase();
      let l = this.list.filter((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith(code));
      if (!l.length) return null;
      const g = (VOICES[id] || {}).g;
      if (g === 'f' || g === 'm') {
        const m = l.filter((v) => (g === 'f' ? FEM : MAL).test(v.name));
        if (m.length) l = m;
      }
      return l[Math.abs(hash(id)) % l.length];
    },
    setOn(v) {
      this.on = !!v;
      LS.set('ad_voice', this.on ? '1' : '0');
      if (!this.on && SYN) SYN.cancel();
      Aud.sync();
    },
    stop() {
      SYN && SYN.cancel();
    },

    speakChar(text, id, ev, force) {
      if (!SYN || (!force && (!this.on || (ev === 'idle' && !this.idle)))) return;
      const clean = String(text || '')
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180);
      if (!clean) return;
      const p = VOICES[id] || { pitch: 1, rate: 1 },
        u = new SpeechSynthesisUtterance(clean);
      u.lang = this.lang();
      if (!this.list.length) this.load();
      let v = this.pick(id);
      if (!v && this.list.length) {

        v = this.list.find((x) => x.default) || this.list[0];
        u.lang = v.lang;
      }
      try {
        if (v) u.voice = v;
      } catch (e) {

      }
      u.pitch = p.pitch;
      u.rate = p.rate;
      u.volume = Math.max(0.25, Math.min(1, AU.vol * 1.5));
      const duck = (on) => {
        try {
          if (AU.mg && AU.ctx) AU.mg.gain.setTargetAtTime(on ? (BGM[AU.mood] || BGM.dungeon).vol * 0.35 : (BGM[AU.mood] || BGM.dungeon).vol, AU.ctx.currentTime, 0.08);
        } catch (e) {

        }
      };
      u.onstart = () => duck(true);
      u.onend = () => duck(false);
      u.onerror = (ev) => {
        duck(false);

        if (u.__retry || !ev || ev.error === 'canceled' || ev.error === 'interrupted') return;
        const r = new SpeechSynthesisUtterance(clean);
        r.__retry = 1;
        r.pitch = u.pitch;
        r.rate = u.rate;
        r.volume = u.volume;
        r.onstart = () => duck(true);
        r.onend = r.onerror = () => duck(false);
        setTimeout(() => SYN.speak(r), 60);
      };
      if (SYN.speaking || SYN.pending) {
        SYN.cancel();
        setTimeout(() => SYN.speak(u), 60);
      } else SYN.speak(u);
    },
  };
  if (SYN) {
    Voice.load();
    SYN.addEventListener ? SYN.addEventListener('voiceschanged', () => Voice.load()) : (SYN.onvoiceschanged = () => Voice.load());
  }
  window.Voice = Voice;
  window.VOICES = VOICES;

  const $b = (id) => document.getElementById(id);
  const setBtn = (id, icon, text, on) => {
    const b = $b(id);
    if (!b) return;
    b.innerHTML = IC(icon) + '<span>' + text + '</span>';
    b.classList.toggle('on', !!on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  };
  const Aud = {
    BGM,
    sync() {
      setBtn('bm', AU.mus ? 'note' : 'mute', 'Musik: ' + (AU.mus ? 'ON' : 'OFF'), AU.mus);
      setBtn('bs', 'bolt', 'SFX: ' + (AU.sfxOn ? 'ON' : 'OFF'), AU.sfxOn);
      setBtn('bvo', 'mic', 'Suara: ' + (Voice.on ? 'ON' : 'OFF'), Voice.on);
      setBtn('bmood', 'crystal', 'Suasana', false);
      const mb = $b('bmood');
      if (mb) mb.title = (window.I18N ? I18N.t('Suasana musik') : 'Suasana musik') + ': ' + (window.I18N ? I18N.t(BGM[AU.mood].n) : BGM[AU.mood].n);
      const c = $b('bc');
      if (c && typeof Co !== 'undefined') setBtn('bc', 'hunter', Co.lbl(true), Co.on());
      document.querySelectorAll('[data-moodset]').forEach((e) => e.classList.toggle('on', e.dataset.moodset === AU.mood));
      const sm = $b('smo');
      if (sm) sm.value = AU.mood;
      const sv = $b('svo');
      if (sv) sv.textContent = 'Voice Over: ' + (Voice.on ? 'ON' : 'OFF');
    },
    menu() {
      const m = $b('bmenu');
      if (!m) return;
      m.innerHTML = '<small class="tag">[ SYSTEM ] BGM</small>' + Object.keys(BGM).map((k) => `<button type="button" data-moodset="${k}" class="${k === AU.mood ? 'on' : ''}">${IC('note')}<span>${BGM[k].n}</span></button>`).join('');
    },

    settingsHTML: () =>
      `<label>Suasana musik<select id="smo">${Object.keys(BGM).map((k) => `<option value="${k}" ${k === AU.mood ? 'selected' : ''}>${BGM[k].n}</option>`).join('')}</select></label><p style="margin-top:10px"><button class="btn ghost" id="svo">Voice Over: ${Voice.on ? 'ON' : 'OFF'}</button> <button class="btn ghost" id="svt">Tes suara karakter</button></p>${Voice.supported ? '' : '<p class="mut sm">Browser ini belum mendukung Voice Over (Web Speech API).</p>'}`,
    settingsWire() {
      const sm = $b('smo');
      if (sm) sm.onchange = (e) => AU.setMood(e.target.value);
      const sv = $b('svo');
      if (sv) sv.onclick = () => Voice.setOn(!Voice.on);
      const st = $b('svt');
      if (st)
        st.onclick = () => {
          const id = typeof Co !== 'undefined' && DB.me && me() ? Co.id() : 'kage';
          Voice.speakChar(window.I18N && I18N.lang !== 'id' ? I18N.t('Halo! Aku akan menemanimu belajar.') : 'Halo! Aku akan menemanimu belajar.', id, 'click', true);
        };
    },
  };
  window.Aud = Aud;

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('#bm')) LS.set('ad_mute', AU.mus ? '0' : '1');
    if (t.closest('#bvo')) Voice.setOn(!Voice.on);
    const mb = t.closest('#bmood');
    const menu = $b('bmenu');
    if (mb && menu) {
      Aud.menu();
      menu.hidden = !menu.hidden;
      if (!menu.hidden && window.I18N) I18N.apply(menu);
    } else if (menu && !menu.hidden && !t.closest('#bmenu')) menu.hidden = true;
    const ms = t.closest('[data-moodset]');
    if (ms) {
      AU.setMood(ms.dataset.moodset);
      LS.set('ad_mute', '0');
      AU.manual = 1;
      if (!AU.mus) AU.start();
      Aud.sync();
      Aud.menu();
      menu && window.I18N && I18N.apply(menu);
    }
    const vb = t.closest('[data-voice]');
    if (vb) {
      const id = vb.dataset.voice,
        ch = typeof CHARS !== 'undefined' && CHARS.find((c) => c.id === id);
      if (ch) Voice.speakChar(window.I18N && I18N.lang !== 'id' ? (I18N.say('click') || [ch.quote])[0] : ch.quote, id, 'click', true);
    }
  });
  document.addEventListener('keydown', (e) => {
    const menu = $b('bmenu');
    if (e.key === 'Escape' && menu && !menu.hidden) menu.hidden = true;
  });

  if (typeof Co !== 'undefined' && Co.mount) {
    const m0 = Co.mount.bind(Co);
    Co.mount = function () {
      m0();
      Aud.sync();
    };
  }
  Aud.sync();
})();
