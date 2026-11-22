'use strict';

window.Fx24 = (() => {
  const NS = 'http://www.w3.org/2000/svg';

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const ease = (x) => x * x * (3 - 2 * x);
  const env = (t, a, b, c, d) => ease(seg(t, a, b)) * (1 - ease(seg(t, c, d)));
  const hash = (i) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const lerp = (a, b, k) => a + (b - a) * k;
  const n1 = (v) => +(+v).toFixed(1);
  const lang = () => (window.I18N && I18N.lang) || document.documentElement.lang || 'id';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const ls = {
    get(k, d) {
      try {
        const v = localStorage.getItem(k);
        return v == null ? d : v;
      } catch (e) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {

      }
    },
  };
  const reduced = () => {
    try {
      return (typeof DB !== 'undefined' && !!DB && !!DB.rm) || !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  };

  const UI = {
    id: { skip: 'Lewati', replay: 'Putar ulang', close: 'Tutup', sfxOn: 'SFX: ON', sfxOff: 'SFX: OFF', sfxTitle: 'Mute atau nyalakan efek suara cutscene', auto: 'Jangan putar cutscene otomatis lagi', play: 'Putar', pause: 'Jeda' },
    en: { skip: 'Skip', replay: 'Replay', close: 'Close', sfxOn: 'SFX: ON', sfxOff: 'SFX: OFF', sfxTitle: 'Mute or unmute cutscene sound effects', auto: 'Do not autoplay cutscenes again', play: 'Play', pause: 'Pause' },
    ja: { skip: 'スキップ', replay: 'もう一度', close: '閉じる', sfxOn: 'SFX: ON', sfxOff: 'SFX: OFF', sfxTitle: 'カットシーンの効果音をミュート／解除', auto: 'カットシーンを自動再生しない', play: '再生', pause: '一時停止' },
    ko: { skip: '건너뛰기', replay: '다시 재생', close: '닫기', sfxOn: 'SFX: ON', sfxOff: 'SFX: OFF', sfxTitle: '컷신 효과음 음소거 또는 해제', auto: '컷신 자동 재생 끄기', play: '재생', pause: '일시정지' },
  };
  const T = () => UI[lang()] || UI.id;

  const S = { sfx: ls.get('ad_fx24_sfx', '1') !== '0', auto: ls.get('ad_fx24_auto', '1') !== '0' };
  const setSfx = (on) => {
    S.sfx = !!on;
    ls.set('ad_fx24_sfx', on ? '1' : '0');
    live.forEach((c) => c.bus && c.bus.set && c.bus.set(S.sfx));
  };
  const setAuto = (on) => {
    S.auto = !!on;
    ls.set('ad_fx24_auto', on ? '1' : '0');
  };

  const auto = () => S.auto && !reduced();

  let AC = null,
    nbuf = null;
  const actx = () => {
    if (AC) return AC;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    try {
      AC = new C();
    } catch (e) {
      return null;
    }
    const n = AC.sampleRate * 2;
    nbuf = AC.createBuffer(1, n, AC.sampleRate);
    const ch = nbuf.getChannelData(0);
    for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1;
    return AC;
  };

  const mkBus = () => {
    const c = actx();
    if (!c) return null;
    if (c.state === 'suspended') c.resume().catch(() => {});
    const out = c.createGain(),
      comp = c.createDynamicsCompressor(),
      d = c.createDelay(0.6),
      fb = c.createGain(),
      lp = c.createBiquadFilter(),
      wet = c.createGain();
    out.gain.value = S.sfx ? 0.9 : 0;
    d.delayTime.value = 0.22;
    fb.gain.value = 0.32;
    lp.type = 'lowpass';
    lp.frequency.value = 2200;
    wet.gain.value = 0.35;
    out.connect(comp);
    comp.connect(c.destination);
    out.connect(d);
    d.connect(lp);
    lp.connect(fb);
    fb.connect(d);
    lp.connect(wet);
    wet.connect(comp);
    return {
      c,
      out,
      echo: d,
      set(on) {
        try {
          out.gain.setTargetAtTime(on ? 0.9 : 0, c.currentTime, 0.02);
        } catch (e) {}
      },
      kill() {
        try {
          out.gain.cancelScheduledValues(c.currentTime);
          out.gain.setTargetAtTime(0, c.currentTime, 0.02);
        } catch (e) {}
        setTimeout(() => {
          [out, comp, d, fb, lp, wet].forEach((n) => {
            try {
              n.disconnect();
            } catch (e) {}
          });
        }, 250);
      },
    };
  };
  const tone = (b, f, t0, d, type = 'sine', v = 0.12, f2, send = 0.25) => {
    if (!b) return;
    const c = b.c,
      o = c.createOscillator(),
      g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + d);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + Math.min(0.03, d / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g);
    g.connect(b.out);
    if (send) {
      const s = c.createGain();
      s.gain.value = send;
      g.connect(s);
      s.connect(b.echo);
    }
    o.start(t0);
    o.stop(t0 + d + 0.05);
  };
  const nz = (b, t0, d, v, ftype, f0, f1, q = 1) => {
    if (!b || !nbuf) return;
    const c = b.c,
      s = c.createBufferSource(),
      fl = c.createBiquadFilter(),
      g = c.createGain();
    s.buffer = nbuf;
    fl.type = ftype;
    fl.Q.value = q;
    fl.frequency.setValueAtTime(f0, t0);
    fl.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + d);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + d * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    s.connect(fl);
    fl.connect(g);
    g.connect(b.out);
    s.start(t0, Math.random());
    s.stop(t0 + d + 0.05);
  };
  const chime = (b, f, t0, v = 0.1) => {
    tone(b, f, t0, 1.2, 'sine', v);
    tone(b, f * 2.01, t0, 0.8, 'sine', v * 0.5);
  };

  const SND = {
    whoosh: (b) => nz(b, b.c.currentTime, 0.55, 0.3, 'bandpass', 250, 3400, 1.2),
    thud: (b) => {
      const t = b.c.currentTime;
      tone(b, 130, t, 0.5, 'sine', 0.6, 38, 0);
      nz(b, t, 0.25, 0.3, 'lowpass', 900, 80);
    },
    crack: (b) => {
      const t = b.c.currentTime;
      nz(b, t, 0.4, 0.5, 'highpass', 3200, 700, 0.8);
      tone(b, 95, t + 0.02, 0.35, 'sawtooth', 0.25, 34, 0);
    },
    alarm: (b) => {
      const t = b.c.currentTime;
      for (let i = 0; i < 4; i++) tone(b, i % 2 ? 640 : 880, t + i * 0.2, 0.19, 'square', 0.07, undefined, 0.1);
    },
    charge: (b) => {
      const t = b.c.currentTime;
      tone(b, 110, t, 1.1, 'sawtooth', 0.09, 880, 0.3);
      nz(b, t, 1.1, 0.18, 'bandpass', 300, 5200, 2);
    },
    zap: (b) => {
      const t = b.c.currentTime;
      nz(b, t, 0.22, 0.4, 'highpass', 1500, 9000, 0.7);
      tone(b, 2200, t, 0.18, 'square', 0.07, 180, 0.1);
    },
    boom: (b) => {
      const t = b.c.currentTime;
      tone(b, 150, t, 1.4, 'sine', 0.75, 32, 0);
      nz(b, t, 1, 0.45, 'lowpass', 2800, 110);
    },
    roar: (b) => {
      const t = b.c.currentTime;
      tone(b, 96, t, 0.9, 'sawtooth', 0.16, 48, 0.2);
      tone(b, 72, t, 0.9, 'square', 0.08, 40, 0.2);
      nz(b, t, 0.8, 0.2, 'lowpass', 1100, 140);
    },
    sys: (b) => {
      const t = b.c.currentTime;
      tone(b, 880, t, 0.12, 'square', 0.04, undefined, 0.1);
      tone(b, 1320, t + 0.13, 0.16, 'square', 0.04, undefined, 0.1);
    },
    tick: (b, f = 1200) => tone(b, f, b.c.currentTime, 0.05, 'square', 0.035, undefined, 0),
    ping: (b, f = 1400) => tone(b, f, b.c.currentTime, 0.5, 'sine', 0.09),
    chime: (b, f = 880) => chime(b, f, b.c.currentTime),
    coin: (b) => {
      const t = b.c.currentTime;
      tone(b, 988, t, 0.1, 'square', 0.05, undefined, 0.1);
      tone(b, 1319, t + 0.08, 0.35, 'square', 0.05, undefined, 0.2);
    },
    heal: (b) => {
      const t = b.c.currentTime;
      [523, 659, 784, 1047].forEach((f, i) => tone(b, f, t + i * 0.1, 0.45, 'triangle', 0.1));
    },
    shield: (b) => {
      const t = b.c.currentTime;
      tone(b, 300, t, 0.4, 'sawtooth', 0.08, 700, 0.2);
      chime(b, 1046, t + 0.15, 0.08);
    },
    freeze: (b) => {
      const t = b.c.currentTime;
      nz(b, t, 0.5, 0.2, 'highpass', 5000, 2400);
      [1568, 2093, 2637].forEach((f, i) => tone(b, f, t + i * 0.06, 0.5, 'sine', 0.05));
    },
    fan: (b) => {
      const t = b.c.currentTime;
      [392, 523, 659, 784, 1047].forEach((f, i) => tone(b, f, t + i * 0.1, 0.5, 'triangle', 0.13));
      [196, 261, 329].forEach((f) => tone(b, f, t + 0.45, 1.2, 'sawtooth', 0.05, undefined, 0.4));
    },
    arise: (b) => {
      const t = b.c.currentTime;
      tone(b, 150, t, 1.6, 'sine', 0.7, 32, 0);
      tone(b, 75, t + 0.02, 1.4, 'triangle', 0.3, 28, 0);
      nz(b, t, 1.1, 0.4, 'lowpass', 3000, 120);
      [110, 164.8, 220, 277.2].forEach((f, i) => {
        tone(b, f, t + 0.25, 2.2, 'sawtooth', 0.04, undefined, 0.4);
        tone(b, f * 2, t + 0.25, 2.2, 'sine', 0.025, undefined, 0.3);
      });
      [659.3, 784, 987.8, 1318.5, 1568].forEach((f, i) => chime(b, f, t + 0.7 + i * 0.13, 0.1));
    },
    hit: (b) => {
      const t = b.c.currentTime;
      nz(b, t, 0.2, 0.35, 'highpass', 1400, 7000, 0.8);
      tone(b, 1760, t, 0.15, 'triangle', 0.15, 880, 0.2);
      tone(b, 130, t + 0.07, 0.2, 'sine', 0.35, 60, 0);
    },
    shatter: (b) => {
      const t = b.c.currentTime;
      nz(b, t, 0.5, 0.35, 'highpass', 4000, 1200, 0.6);
      [1760, 2349, 2794].forEach((f, i) => tone(b, f, t + i * 0.04, 0.5, 'sine', 0.06));
    },
    pad: (b) => {
      const t = b.c.currentTime;
      [220, 277.2, 329.6].forEach((f) => {
        tone(b, f, t, 2.4, 'sawtooth', 0.035, undefined, 0.4);
        tone(b, f * 1.006, t, 2.4, 'triangle', 0.03, undefined, 0.4);
      });
    },
  };

  const plot = (o) => {
    const [x0, x1] = o.x,
      [y0, y1] = o.y,
      sx = o.w / (x1 - x0),
      sy = o.h / (y1 - y0);
    const X = (x) => n1(o.l + (x - x0) * sx),
      Y = (y) => n1(o.t + o.h - (y - y0) * sy);
    return {
      X,
      Y,
      sx,
      sy,
      path(f, a = x0, b = x1, step = 0.12) {
        let d = '',
          pen = false;
        for (let x = a; x <= b + 1e-9; x += step) {
          const y = f(x),
            py = o.t + o.h - (y - y0) * sy;
          if (py < o.t - 40 || py > o.t + o.h + 40) {
            pen = false;
            continue;
          }
          d += (pen ? 'L' : 'M') + X(x) + ' ' + n1(py);
          pen = true;
        }
        return d;
      },
      grid() {
        let d = '';
        for (let x = Math.ceil(x0); x <= x1; x++) d += 'M' + X(x) + ' ' + o.t + 'V' + (o.t + o.h);
        for (let y = Math.ceil(y0); y <= y1; y++) d += 'M' + o.l + ' ' + Y(y) + 'H' + (o.l + o.w);
        return d;
      },
      axes() {
        let d = '';
        if (y0 <= 0 && y1 >= 0) d += 'M' + o.l + ' ' + Y(0) + 'H' + (o.l + o.w);
        if (x0 <= 0 && x1 >= 0) d += 'M' + X(0) + ' ' + o.t + 'V' + (o.t + o.h);
        return d;
      },
    };
  };

  const live = new Set();
  let uid = 0;
  const FILTERS = (g, g2) =>
    `<filter id="${g}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="${g2}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

  function Player(opts) {
    const sc = opts.scene,
      W = sc.W || 800,
      H = sc.H || 450,
      id = ++uid;
    const P = { id, t: 0, prev: 0, playing: false, started: false, ended: false, dead: false, W, H, g: 'fx' + id + 'g', g2: 'fx' + id + 'g2', scene: sc, stage: opts.stage, lang };
    const stage = opts.stage;
    stage.innerHTML = '';
    stage.classList.add('fx-stage');
    const mkSvg = (cls) => {
      const s = document.createElementNS(NS, 'svg');
      s.setAttribute('viewBox', `0 0 ${W} ${H}`);
      s.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      s.setAttribute('aria-hidden', 'true');
      s.setAttribute('class', 'fx-svg ' + cls);
      s.setAttribute('font-family', 'Rajdhani,sans-serif');
      s.innerHTML = `<defs>${FILTERS(P.g, P.g2)}${sc.defs ? (typeof sc.defs === 'function' ? sc.defs(P) : sc.defs) : ''}</defs><g class="fx-layer"></g>`;
      return s;
    };
    const svgB = mkSvg('fx-back');
    stage.appendChild(svgB);
    const layB = svgB.querySelector('.fx-layer');
    let fig = null;
    if (sc.figure) {
      fig = document.createElement('div');
      fig.className = 'fx-fig';
      fig.innerHTML = typeof sc.figure === 'function' ? sc.figure(P) : sc.figure;
      stage.appendChild(fig);
    }
    P.fig = fig;
    const cv = document.createElement('canvas');
    cv.className = 'fx-cv';
    stage.appendChild(cv);
    const cx = cv.getContext('2d');
    let svgF = null,
      layF = null;
    if (sc.front) {
      svgF = mkSvg('fx-front');
      stage.appendChild(svgF);
      layF = svgF.querySelector('.fx-layer');
    }
    let lastB = '',
      lastF = '',
      raf = 0,
      lastTs = 0,
      ro = null;
    const resize = () => {
      if (P.dead) return;
      const w = stage.clientWidth || 640,
        dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.max(2, Math.round(w * dpr));
      cv.height = Math.max(2, Math.round(((w * H) / W) * dpr));
      draw(P.t);
    };
    const draw = (t) => {
      if (P.dead) return;
      if (sc.back) {
        const m = sc.back(t, P);
        if (m !== lastB) {
          lastB = m;
          layB.innerHTML = m;
        }
      }
      if (sc.dom) sc.dom(t, P);
      if (cx && sc.cv) {
        const k = cv.width / W;
        cx.setTransform(1, 0, 0, 1, 0, 0);
        cx.clearRect(0, 0, cv.width, cv.height);
        cx.setTransform(k, 0, 0, k, 0, 0);
        sc.cv(cx, t, W, H, P);
      }
      if (sc.front && layF) {
        const m = sc.front(t, P);
        if (m !== lastF) {
          lastF = m;
          layF.innerHTML = m;
        }
      }
      opts.onTick && opts.onTick(t, P);
    };
    P.draw = draw;
    P.bus = null;
    const fire = () => {
      if (!sc.ev || !P.bus) return;
      sc.ev.forEach((e) => {
        if (e[0] > P.prev && e[0] <= P.t) {
          try {
            e[1](SND, P.bus, P);
          } catch (x) {}
        }
      });
    };
    const loop = (ts) => {
      raf = 0;
      if (!P.playing || P.dead) return;
      if (!stage.isConnected) return P.destroy();
      const dt = lastTs ? Math.min(0.1, (ts - lastTs) / 1000) : 0;
      lastTs = ts;
      P.t = Math.min(sc.dur, P.t + dt);
      fire();
      P.prev = P.t;
      draw(P.t);
      if (P.t >= sc.dur) {
        P.playing = false;
        P.ended = true;
        opts.onState && opts.onState(P);
        opts.onEnd && opts.onEnd(P);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    P.play = () => {
      if (P.dead) return;
      if (P.ended || P.t >= sc.dur - 0.02) {
        P.t = 0;
        P.prev = 0;
        P.ended = false;
      }
      if (!P.bus) P.bus = mkBus();
      else if (P.bus.c.state === 'suspended') P.bus.c.resume().catch(() => {});
      if (P.bus) P.bus.set(S.sfx);
      P.started = true;
      P.playing = true;
      lastTs = 0;
      opts.onState && opts.onState(P);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    P.pause = () => {
      P.playing = false;
      cancelAnimationFrame(raf);
      raf = 0;
      if (P.bus) P.bus.set(false);
      opts.onState && opts.onState(P);
      draw(P.t);
    };
    P.replay = () => {
      P.t = 0;
      P.prev = 0;
      P.ended = false;
      P.play();
    };
    P.seekEnd = () => {
      P.t = sc.dur;
      P.prev = sc.dur;
      P.ended = true;
      P.playing = false;
      cancelAnimationFrame(raf);
      draw(P.t);
    };
    P.destroy = () => {
      if (P.dead) return;
      P.playing = false;
      P.dead = true;
      cancelAnimationFrame(raf);
      raf = 0;
      if (ro) ro.disconnect();
      if (P.bus) P.bus.kill();
      live.delete(P);
      opts.onDestroy && opts.onDestroy(P);
    };
    P.abort = P.destroy;
    live.add(P);
    if (window.ResizeObserver) {
      ro = new ResizeObserver(resize);
      ro.observe(stage);
    }
    resize();
    return P;
  }

  let openModal = null;
  const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

  function modal(o) {
    closeAll();
    const t = T(),
      sc = o.scene,
      prevFocus = document.activeElement;
    const ov = document.createElement('div');
    ov.className = 'cs-ov ' + (o.cls || '');
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', o.label || 'Cutscene');
    ov.setAttribute('data-no-i18n', '');
    ov.innerHTML = `<div class="cs-box"><div class="cs-stage" style="aspect-ratio:${sc.ratio || '16/9'}"></div><div class="cs-cap" aria-live="polite"></div><div class="cs-bar">${
      o.replay ? `<button type="button" class="cs-b cs-rp">${t.replay}</button>` : ''
    }<button type="button" class="cs-b cs-sfx" title="${esc(t.sfxTitle)}"></button>${
      o.autoOpt ? `<label class="cs-auto"><input type="checkbox"> <span>${esc(t.auto)}</span></label>` : ''
    }<button type="button" class="cs-b cs-skip primary">${o.replay ? t.close : t.skip} ▸</button></div></div>`;
    document.body.appendChild(ov);
    document.body.classList.add('cs-lock');
    const stage = ov.querySelector('.cs-stage'),
      cap = ov.querySelector('.cs-cap'),
      bSkip = ov.querySelector('.cs-skip'),
      bSfx = ov.querySelector('.cs-sfx'),
      bRp = ov.querySelector('.cs-rp'),
      chk = ov.querySelector('.cs-auto input');
    const sfxLabel = () => {
      const tt = T();
      bSfx.textContent = S.sfx ? tt.sfxOn : tt.sfxOff;
      bSfx.classList.toggle('off', !S.sfx);
      bSfx.setAttribute('aria-pressed', S.sfx ? 'false' : 'true');
    };
    sfxLabel();
    let closed = false,
      lastCap = '';
    const C = { ov, P: null };
    const cleanup = () => {
      if (closed) return false;
      closed = true;
      document.removeEventListener('keydown', onKey, true);
      live.delete(C);
      if (openModal === C) openModal = null;
      if (C.P) C.P.destroy();
      ov.remove();
      if (!document.querySelector('.cs-ov')) document.body.classList.remove('cs-lock');
      try {
        prevFocus && prevFocus.focus && prevFocus.isConnected && prevFocus.focus({ preventScroll: true });
      } catch (e) {}
      return true;
    };
    C.abort = () => {

      cleanup();
    };
    C.finish = () => {

      if (cleanup() && o.onDone) {
        try {
          o.onDone();
        } catch (e) {
          console.warn('cutscene onDone:', e);
        }
      }
    };
    C.pause = () => C.P && C.P.playing && ((C._wasPlaying = true), C.P.pause());
    C.resume = () => {
      if (C._wasPlaying && C.P && !C.P.dead) {
        C._wasPlaying = false;
        C.P.play();
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        if ((e.key === 'Enter' || e.key === ' ') && /^(BUTTON|INPUT|A|LABEL)$/.test((e.target && e.target.tagName) || '') && ov.contains(e.target)) {
          if (e.target !== bSkip) return;
        }
        e.preventDefault();
        e.stopPropagation();
        C.finish();
      } else if (e.key === 'Tab') {
        const f = [...ov.querySelectorAll(FOCUSABLE)].filter((x) => !x.disabled);
        if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    bSkip.onclick = () => C.finish();
    bSfx.onclick = () => {
      setSfx(!S.sfx);
      sfxLabel();
    };
    if (chk) {
      chk.checked = !S.auto;
      chk.onchange = () => setAuto(!chk.checked);
    }
    if (bRp)
      bRp.onclick = () => {
        C.P && C.P.replay();
      };
    C.P = Player({
      stage,
      scene: sc,
      onTick(tm, P) {
        if (o.caption) {
          const c = o.caption(tm, P);
          if (c !== lastCap) {
            lastCap = c;
            cap.innerHTML = c;
          }
        }
      },
      onEnd() {
        if (o.replay) return;
        setTimeout(() => !closed && C.finish(), o.hold == null ? 250 : o.hold);
      },
    });
    live.add(C);
    openModal = C;
    C.P.play();
    bSkip.focus({ preventScroll: true });
    return C;
  }

  const closeAll = () => {
    [...live].forEach((c) => {
      try {
        c.abort();
      } catch (e) {}
    });
  };

  window.addEventListener('hashchange', closeAll);
  window.addEventListener('pagehide', closeAll);
  document.addEventListener('langchange', closeAll);

  document.addEventListener('visibilitychange', () => {
    live.forEach((c) => {
      try {
        if (document.hidden) c.pause && c.pause();
        else c.resume && c.resume();
      } catch (e) {}
    });
  });

  return { u: { clamp, seg, ease, env, hash, lerp, n1, esc, plot, lang }, Player, modal, closeAll, SND, UI, T, sfx: { get: () => S.sfx, set: setSfx }, autoOpt: { get: () => S.auto, set: setAuto }, auto, reduced, live, NS };
})();
