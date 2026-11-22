'use strict';

window.Sfx = (() => {
  let noiseBuf = null,
    fx = null;
  const ok = () => AU.ctx && AU.sfxOn;
  const now = () => AU.ctx.currentTime;
  const noise = () => {
    if (noiseBuf) return noiseBuf;
    const c = AU.ctx,
      n = c.sampleRate * 1.5,
      b = c.createBuffer(1, n, c.sampleRate),
      d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return (noiseBuf = b);
  };

  const bus = () => {
    if (fx && fx.ctx === AU.ctx) return fx.in;
    const c = AU.ctx,
      i = c.createGain(),
      d = c.createDelay(0.6),
      fb = c.createGain(),
      lp = c.createBiquadFilter(),
      wet = c.createGain();
    d.delayTime.value = 0.23;
    fb.gain.value = 0.38;
    lp.type = 'lowpass';
    lp.frequency.value = 2400;
    wet.gain.value = 0.42;
    i.connect(AU.master);
    i.connect(d);
    d.connect(lp);
    lp.connect(fb);
    fb.connect(d);
    lp.connect(wet);
    wet.connect(AU.master);
    fx = { ctx: c, in: i };
    return i;
  };

  const tone = (o) => {
    const c = AU.ctx,
      t = o.t != null ? o.t : now(),
      os = c.createOscillator(),
      v = c.createGain();
    os.type = o.ty || 'sine';
    os.frequency.setValueAtTime(o.f, t);
    if (o.f2) os.frequency.exponentialRampToValueAtTime(o.f2, t + o.d);
    if (o.det) os.detune.value = o.det;
    v.gain.setValueAtTime(0.0001, t);
    v.gain.exponentialRampToValueAtTime(o.g || 0.2, t + (o.a || 0.02));
    v.gain.exponentialRampToValueAtTime(0.0001, t + o.d);
    let last = os;
    if (o.lp) {
      const f = c.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(o.lp, t);
      if (o.lp2) f.frequency.exponentialRampToValueAtTime(o.lp2, t + o.d);
      os.connect(f);
      last = f;
    }
    last.connect(v);
    v.connect(o.dest || AU.master);
    os.start(t);
    os.stop(t + o.d + 0.05);
  };

  const hiss = (o) => {
    const c = AU.ctx,
      t = o.t != null ? o.t : now(),
      s = c.createBufferSource(),
      f = c.createBiquadFilter(),
      v = c.createGain();
    s.buffer = noise();
    f.type = o.ft || 'bandpass';
    f.frequency.setValueAtTime(o.f, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.d);
    f.Q.value = o.q || 1;
    v.gain.setValueAtTime(0.0001, t);
    v.gain.exponentialRampToValueAtTime(o.g || 0.3, t + (o.a || 0.01));
    v.gain.exponentialRampToValueAtTime(0.0001, t + o.d);
    s.connect(f);
    f.connect(v);
    v.connect(o.dest || AU.master);
    s.start(t);
    s.stop(t + o.d + 0.05);
  };
  const chime = (f, t, g = 0.14, dest) => {
    tone({ f, t, d: 1.4, ty: 'sine', g, a: 0.005, dest });
    tone({ f: f * 2.01, t, d: 0.9, ty: 'sine', g: g * 0.5, a: 0.005, dest });
    tone({ f: f * 3, t, d: 0.5, ty: 'triangle', g: g * 0.3, a: 0.005, dest });
  };
  const E = {

    arise() {
      const t = now(),
        d = bus();
      tone({ f: 150, f2: 32, t, d: 1.6, ty: 'sine', g: 0.75, a: 0.01 });
      tone({ f: 75, f2: 28, t: t + 0.02, d: 1.4, ty: 'triangle', g: 0.35, a: 0.01, lp: 400 });
      hiss({ t, d: 1.1, ft: 'lowpass', f: 3000, f2: 120, g: 0.45, a: 0.02, dest: d });
      hiss({ t: t + 0.02, d: 0.25, ft: 'bandpass', f: 90, g: 0.7, a: 0.003 });
      [110, 164.8, 220, 277.2].forEach((f, i) => {
        tone({ f, t: t + 0.25, d: 2.2, ty: 'sawtooth', g: 0.05, a: 0.7, lp: 380, lp2: 900, det: i % 2 ? 7 : -7, dest: d });
        tone({ f: f * 2, t: t + 0.25, d: 2.2, ty: 'sine', g: 0.03, a: 0.9, dest: d });
      });
      [659.3, 784, 987.8, 1318.5, 1568].forEach((f, i) => chime(f, t + 0.7 + i * 0.13, 0.13, d));
    },

    atk() {
      const t = now(),
        d = bus();
      hiss({ t, d: 0.22, ft: 'highpass', f: 1400, f2: 7000, q: 0.8, g: 0.35, a: 0.005 });
      tone({ f: 1760, f2: 880, t, d: 0.16, ty: 'triangle', g: 0.18, a: 0.004, dest: d });
      tone({ f: 1320, t: t + 0.07, d: 0.4, ty: 'sine', g: 0.12, a: 0.004, dest: d });
      tone({ f: 130, f2: 60, t: t + 0.08, d: 0.2, ty: 'sine', g: 0.4, a: 0.004 });
    },

    mAtk() {
      const t = now(),
        d = bus();
      hiss({ t, d: 0.35, ft: 'bandpass', f: 600, f2: 3200, q: 1.6, g: 0.4, a: 0.005 });
      tone({ f: 220, f2: 55, t, d: 0.5, ty: 'sawtooth', g: 0.3, a: 0.01, lp: 1200, lp2: 120, dest: d });
      tone({ f: 80, f2: 38, t: t + 0.12, d: 0.55, ty: 'sine', g: 0.75, a: 0.005 });
      hiss({ t: t + 0.12, d: 0.4, ft: 'lowpass', f: 900, f2: 90, g: 0.5, a: 0.004 });
    },

    hurt() {
      const t = now();
      tone({ f: 300, f2: 70, t, d: 0.5, ty: 'square', g: 0.16, a: 0.005, lp: 1800, lp2: 160 });
      tone({ f: 60, f2: 30, t, d: 0.5, ty: 'sine', g: 0.7, a: 0.004 });
      hiss({ t, d: 0.3, ft: 'lowpass', f: 2200, f2: 160, g: 0.35, a: 0.003 });
    },
    heal() {
      const t = now(),
        d = bus();
      [523.3, 659.3, 784, 1046.5].forEach((f, i) => chime(f, t + i * 0.09, 0.11, d));
      tone({ f: 261.6, t, d: 1.2, ty: 'sine', g: 0.12, a: 0.2, dest: d });
    },
    shield() {
      const t = now(),
        d = bus();
      tone({ f: 330, f2: 990, t, d: 0.35, ty: 'sawtooth', g: 0.08, a: 0.05, lp: 1500, dest: d });
      [880, 1318.5, 1760].forEach((f, i) => chime(f, t + 0.2 + i * 0.08, 0.1, d));
      hiss({ t: t + 0.15, d: 0.5, ft: 'highpass', f: 4000, g: 0.1, a: 0.1, dest: d });
    },

    gate() {
      const t = now(),
        d = bus();
      tone({ f: 48, f2: 70, t, d: 2.0, ty: 'sawtooth', g: 0.3, a: 0.5, lp: 220, lp2: 420 });
      tone({ f: 90, f2: 900, t, d: 1.5, ty: 'sawtooth', g: 0.08, a: 0.9, lp: 500, lp2: 5200, dest: d });
      hiss({ t, d: 1.6, ft: 'bandpass', f: 200, f2: 4200, q: 0.9, g: 0.3, a: 0.9, dest: d });
      tone({ f: 40, f2: 28, t: t + 1.45, d: 0.9, ty: 'sine', g: 0.7, a: 0.005 });
      [1046.5, 1568, 2093, 3136].forEach((f, i) => chime(f, t + 1.45 + i * 0.06, 0.07, d));
    },

    levelup() {
      const t = now(),
        d = bus();
      tone({ f: 110, f2: 55, t, d: 1.0, ty: 'sine', g: 0.7, a: 0.01 });
      hiss({ t, d: 0.7, ft: 'highpass', f: 800, f2: 6000, g: 0.2, a: 0.2, dest: d });
      [329.6, 392, 493.9, 659.3, 784, 987.8, 1318.5].forEach((f, i) => {
        tone({ f, t: t + 0.08 + i * 0.09, d: 0.9, ty: 'triangle', g: 0.2, a: 0.01, dest: d });
        tone({ f: f * 2, t: t + 0.08 + i * 0.09, d: 0.5, ty: 'sine', g: 0.08, a: 0.01, dest: d });
      });
      [164.8, 246.9, 329.6, 392, 493.9].forEach((f, i) => tone({ f, t: t + 0.8, d: 2.4, ty: 'sawtooth', g: 0.06, a: 0.1, lp: 1400, det: i % 2 ? 6 : -6, dest: d }));
      [1318.5, 1760, 2093].forEach((f, i) => chime(f, t + 0.9 + i * 0.11, 0.12, d));
    },

    ko() {
      const t = now(),
        d = bus();
      tone({ f: 260, f2: 40, t, d: 1.2, ty: 'sawtooth', g: 0.28, a: 0.01, lp: 1400, lp2: 90, dest: d });
      tone({ f: 70, f2: 26, t: t + 0.05, d: 1.3, ty: 'sine', g: 0.6, a: 0.01 });
      hiss({ t, d: 0.9, ft: 'lowpass', f: 2600, f2: 80, g: 0.35, a: 0.01 });
      [784, 1046.5, 1568].forEach((f, i) => chime(f, t + 1.0 + i * 0.12, 0.09, d));
    },
    down() {
      const t = now();
      tone({ f: 196, f2: 49, t, d: 1.6, ty: 'sawtooth', g: 0.18, a: 0.01, lp: 900, lp2: 100 });
      tone({ f: 55, f2: 25, t, d: 1.8, ty: 'sine', g: 0.7, a: 0.01 });
    },
  };
  return {
    list: Object.keys(E),
    has: (n) => !!E[n],
    play(n) {
      if (!ok() || !E[n]) return;
      try {
        AU.ctx.resume();
        E[n]();
      } catch (e) {

      }
    },
  };
})();

(() => {
  const old = AU.sfx.bind(AU);
  AU.sfx = function (n) {
    if (Sfx.has(n)) return Sfx.play(n);
    return old(n);
  };
})();

window.Sys = (() => {
  const reduce = () => (typeof DB !== 'undefined' && DB && DB.rm) || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  let box = null;
  const mk = () => {
    if (box && box.isConnected) return box;
    box = document.createElement('div');
    box.id = 'sysw';
    box.setAttribute('aria-live', 'polite');
    document.body.appendChild(box);
    return box;
  };
  const flashEl = () => {
    let f = document.getElementById('sysflash');
    if (!f) {
      f = document.createElement('div');
      f.id = 'sysflash';
      document.body.appendChild(f);
    }
    return f;
  };
  return {

    pop(txt, kind = 'info', ms = 1900) {
      const b = mk(),
        d = document.createElement('div');
      d.className = 'sysp ' + kind;
      d.innerHTML = `<small>[ SYSTEM ]</small><b></b>`;
      d.querySelector('b').textContent = txt;
      b.appendChild(d);
      while (b.children.length > 3) b.firstChild.remove();
      setTimeout(() => d.classList.add('out'), ms);
      setTimeout(() => d.remove(), ms + 400);
    },
    flash(col = '#ff2a4a') {
      if (reduce()) return;
      const f = flashEl();
      f.style.background = col;
      f.classList.remove('on');
      void f.offsetWidth;
      f.classList.add('on');
    },
    shake(power = 1) {
      if (reduce()) return;
      const t = document.getElementById('app') && !document.getElementById('app').hidden ? document.getElementById('app') : document.body;
      t.style.setProperty('--shk', 4 + power * 6 + 'px');
      t.classList.remove('shake11');
      void t.offsetWidth;
      t.classList.add('shake11');
      setTimeout(() => t.classList.remove('shake11'), 650);
    },
  };
})();
