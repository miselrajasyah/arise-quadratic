'use strict';

window.Cut = (() => {
  const { clamp, seg, ease, env, hash, lerp, n1, esc } = Fx24.u;
  const L = () => Fx24.u.lang();
  const tr = (s) => (window.I18N && s ? I18N.t(String(s)) : s);

  const G = {
    me: () => (typeof me === 'function' && typeof DB !== 'undefined' && DB && DB.me ? me() : null),
    Co: () => (typeof Co !== 'undefined' ? Co : null),
    SK: () => (typeof SKILLS !== 'undefined' ? SKILLS : {}),
    RK: () => (typeof RK !== 'undefined' ? RK : []),
    TT: () => (typeof TT !== 'undefined' ? TT : []),
    RS: () => (typeof RS !== 'undefined' ? RS : null),
    lock: (c) => (typeof lockText === 'function' ? lockText(c) : ''),
  };
  const fmt = (s, o) => String(s).replace(/\{(\w+)\}/g, (_, k) => (o && o[k] != null ? o[k] : ''));

  const CT = {
    id: { boss: 'Boss Gate muncul! Bersiaplah bertarung.', wb: 'World Boss muncul! Serang bersama seluruh kelas.', hp: 'HP', arise: 'Ekstraksi berhasil. {n} bergabung ke pasukan bayangan-mu.', joined: 'bergabung ke pasukanmu', rankup: 'KENAIKAN GELAR', up: 'Gelar naik: {a} → {b}!', skill: 'SKILL', elem: 'Elemen', locked: 'TERKUNCI', need: 'Syarat', teaser: 'Karakter tersembunyi. Buka dengan: {r}', teaserS: 'Prajurit tersembunyi. Taklukkan gate-nya untuk mengekstrak.', shadow: 'Prajurit Bayangan', free: 'GRATIS', block: 'TAHAN!', life: '+1 NYAWA', sec: 'dtk', daily: 'MISI HARIAN', hintw: 'PETUNJUK', raid: 'POIN RAID', xp: 'XP' },
    en: { boss: 'A Gate Boss appears! Get ready to fight.', wb: 'A World Boss appears! Strike together with the whole class.', hp: 'HP', arise: 'Extraction complete. {n} joins your shadow army.', joined: 'joins your army', rankup: 'RANK UP', up: 'Title up: {a} → {b}!', skill: 'SKILL', elem: 'Element', locked: 'LOCKED', need: 'Requirement', teaser: 'Hidden character. Unlock by: {r}', teaserS: 'Hidden soldier. Conquer its gate to extract it.', shadow: 'Shadow Soldier', free: 'FREE', block: 'BLOCK!', life: '+1 LIFE', sec: 's', daily: 'DAILY QUEST', hintw: 'HINT', raid: 'RAID PTS', xp: 'XP' },
    ja: { boss: 'ゲートボスが出現！戦いに備えよ。', wb: 'ワールドボス出現！クラス全員で攻撃せよ。', hp: 'HP', arise: '抽出完了。{n}があなたの影の軍団に加わった。', joined: 'が軍団に加わった', rankup: 'ランクアップ', up: '称号アップ：{a} → {b}！', skill: 'スキル', elem: '属性', locked: 'ロック中', need: '条件', teaser: '隠しキャラクター。解放条件：{r}', teaserS: '隠された兵士。ゲートを攻略して抽出しよう。', shadow: 'シャドウソルジャー', free: '無料', block: '防御！', life: '+1 ライフ', sec: '秒', daily: 'デイリー', hintw: 'ヒント', raid: 'レイドPT', xp: 'XP' },
    ko: { boss: '게이트 보스 출현! 전투를 준비하라.', wb: '월드 보스 출현! 반 전체가 함께 공격하라.', hp: 'HP', arise: '추출 완료. {n}이(가) 그림자 군단에 합류했다.', joined: '군단에 합류', rankup: '랭크 업', up: '칭호 상승: {a} → {b}!', skill: '스킬', elem: '속성', locked: '잠김', need: '조건', teaser: '숨겨진 캐릭터. 해제 조건: {r}', teaserS: '숨겨진 병사. 게이트를 정복해 추출하세요.', shadow: '섀도 솔저', free: '무료', block: '방어!', life: '+1 목숨', sec: '초', daily: '일일 퀘스트', hintw: '힌트', raid: '레이드 점수', xp: 'XP' },
  };
  const C = () => CT[L()] || CT.id;
  const EL = {
    shadow: { id: 'Bayangan', en: 'Shadow', ja: '影', ko: '그림자' },
    slime: { id: 'Slime', en: 'Slime', ja: 'スライム', ko: '슬라임' },
    knight: { id: 'Kesatria', en: 'Knight', ja: '騎士', ko: '기사' },
    light: { id: 'Cahaya', en: 'Light', ja: '光', ko: '빛' },
    swarm: { id: 'Koloni', en: 'Swarm', ja: '群れ', ko: '군집' },
    royal: { id: 'Kerajaan', en: 'Royal', ja: '王家', ko: '왕가' },
    night: { id: 'Malam', en: 'Night', ja: '夜', ko: '밤' },
    ice: { id: 'Es', en: 'Ice', ja: '氷', ko: '얼음' },
    nature: { id: 'Alam', en: 'Nature', ja: '自然', ko: '자연' },
    guild: { id: 'Guild', en: 'Guild', ja: 'ギルド', ko: '길드' },
    earth: { id: 'Bumi', en: 'Earth', ja: '大地', ko: '대지' },
    steel: { id: 'Baja', en: 'Steel', ja: '鋼', ko: '강철' },
    venom: { id: 'Racun', en: 'Venom', ja: '毒', ko: '독' },
    hex: { id: 'Sihir', en: 'Hex', ja: '呪術', ko: '주술' },
    blood: { id: 'Darah', en: 'Blood', ja: '血', ko: '피' },
    void: { id: 'Hampa', en: 'Void', ja: '虚無', ko: '공허' },
    curve: { id: 'Kurva', en: 'Curve', ja: '曲線', ko: '곡선' },
  };
  const elName = (k) => (EL[k] || EL.shadow)[L()] || (EL[k] || EL.shadow).id;

  const CH24 = {
    kage: { col: '#9a5aff', el: 'shadow', demo: 'hint' },
    parabo: { col: '#5ee6f2', el: 'slime', demo: 'bounce' },
    noir: { col: '#8fa0ff', el: 'knight', demo: 'shield' },
    lumi: { col: '#ffd86b', el: 'light', demo: 'xp' },
    ratu: { col: '#f472a8', el: 'swarm', demo: 'ants' },
    raja: { col: '#ff9a5a', el: 'royal', demo: 'crown' },
    mochi: { col: '#ffb4d6', el: 'night', demo: 'time' },
    aurel: { col: '#7bd8ff', el: 'ice', demo: 'freeze' },
    zeri: { col: '#4cc38a', el: 'nature', demo: 'root' },
    gildan: { col: '#ffcf5a', el: 'guild', demo: 'guild' },
  };
  const SH24 = {
    0: { col: '#c27dff', el: 'earth' },
    E: { col: '#7a86ff', el: 'steel' },
    D: { col: '#ff4fd8', el: 'venom' },
    C: { col: '#7bd8ff', el: 'ice' },
    B: { col: '#b36bff', el: 'hex' },
    A: { col: '#ff3d7a', el: 'blood' },
    S: { col: '#d9a8ff', el: 'void' },
    R: { col: '#ff9a5a', el: 'curve' },
  };
  const BUFFDEMO = { Pemulih: 'heal', Pengintai: 'scout', Pelindung: 'wall' };

  const raja = (mood) => (G.Co() && G.Co().get('raja') ? G.Co().get('raja').svg(mood || 'smug') : '');
  const bossFig = (code, mood) => {
    const k = String(code);
    if (k === 'R' || k === 'RAID' || k === 'raja') return raja(mood === 'ko' ? 'ko' : 'smug');
    if (window.Mon && Mon.has(k)) return Mon.svg(k, mood || 'idle');
    return window.Mon ? Mon.svg('E', mood || 'idle') : '';
  };
  const shadowFig = (code, size = 160) => (String(code) === 'R' ? raja('happy') : window.Mon ? Mon.shadow(code, size) : '');

  const bolt = (x0, y0, x1, y1, seed, amp = 26) => {
    let d = `M${n1(x0)} ${n1(y0)}`;
    const n = 7;
    for (let i = 1; i < n; i++) {
      const k = i / n,
        j = (hash(seed + i * 3.1) - 0.5) * amp * (1 - Math.abs(k - 0.5) * 0.6);
      d += `L${n1(lerp(x0, x1, k) + j)} ${n1(lerp(y0, y1, k) + (hash(seed + i * 5.7) - 0.5) * amp * 0.5)}`;
    }
    return d + `L${n1(x1)} ${n1(y1)}`;
  };
  const star = (x, y, r) => `M${n1(x)} ${n1(y - r)}Q${n1(x)} ${n1(y)} ${n1(x + r)} ${n1(y)}Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y + r)}Q${n1(x)} ${n1(y)} ${n1(x - r)} ${n1(y)}Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y - r)}Z`;
  const ring = (cx, cy, r, col, w, o) => (o > 0.01 ? `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="none" stroke="${col}" stroke-width="${n1(w)}" opacity="${n1(o * 100) / 100}"/>` : '');

  function bossScene(o) {
    const W = 800,
      H = 450,
      DUR = 4.8;
    const cx = 400,
      cy = 230;
    const crackPaths = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const a = (i / 8) * Math.PI * 2 + hash(i) * 0.4;
      let d = `M${cx} ${cy}`,
        x = cx,
        y = cy;
      for (let s = 1; s <= 6; s++) {
        const r = s * (34 + hash(i + s) * 22);
        x = cx + Math.cos(a + (hash(i * 7 + s) - 0.5) * 0.7) * r * 1.35;
        y = cy + Math.sin(a + (hash(i * 7 + s) - 0.5) * 0.7) * r * 0.9;
        d += `L${n1(x)} ${n1(y)}`;
      }
      return d;
    });
    const hp = o.hpText || '';
    return {
      W,
      H,
      dur: DUR,
      ratio: '16/9',
      poster: 3,
      figure: `<div class="bs-fig">${bossFig(o.fig, 'idle')}</div>`,
      defs: (P) =>
        `<radialGradient id="${P.g}p" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#d9b8ff"/><stop offset=".6" stop-color="#7a3cff"/><stop offset="1" stop-color="#12062e" stop-opacity="0"/></radialGradient><radialGradient id="${P.g}v" cx="50%" cy="50%" r="75%"><stop offset=".45" stop-color="#ff1d3a" stop-opacity="0"/><stop offset="1" stop-color="#ff1d3a" stop-opacity=".85"/></radialGradient><pattern id="${P.g}h" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="28" fill="#ffd400"/><rect x="14" width="14" height="28" fill="#1a1205"/></pattern>`,
      back(t, P) {
        const shk = t > 0.55 && t < 1.4 ? (hash(Math.floor(t * 40)) - 0.5) * 8 * env(t, 0.55, 0.6, 1.1, 1.4) : t > 1.5 && t < 1.8 ? (hash(Math.floor(t * 40) + 9) - 0.5) * 10 : 0;
        const dy = t > 0.55 && t < 1.4 ? (hash(Math.floor(t * 40) + 3) - 0.5) * 6 : 0;
        const pr = ease(seg(t, 0.05, 1.0)),
          fade = 1 - ease(seg(t, 4.35, 4.8));
        let s = `<rect width="${W}" height="${H}" fill="#04030d"/><g transform="translate(${n1(shk)} ${n1(dy)})" opacity="${n1(fade * 100) / 100}">`;

        s += `<ellipse cx="${cx}" cy="${cy}" rx="${n1(250 * pr)}" ry="${n1(200 * pr)}" fill="url(#${P.g}p)" opacity="${n1(0.18 + 0.6 * ease(seg(t, 0.5, 1.5)))}"/>`;
        s += ring(cx, cy, 120 * pr + 10, '#9a5aff', 3, pr * 0.8) + ring(cx, cy, 190 * pr, '#5ee6f2', 2, pr * 0.45);

        const cr = ease(seg(t, 0.35, 1.2));
        s += `<g fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" filter="url(#${P.g})" opacity="${n1(Math.min(1, cr * 3) * (1 - ease(seg(t, 3.6, 4.2)) * 0.6) * 100) / 100}">${crackPaths.map((d) => `<path d="${d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${n1((1 - cr) * 100) / 100}"/>`).join('')}</g>`;

        const al = env(t, 0.8, 1.1, 3.9, 4.4),
          pul = 0.55 + 0.45 * Math.sin(t * 12);
        s += `<rect width="${W}" height="${H}" fill="url(#${P.g}v)" opacity="${n1(al * pul * 100) / 100}"/>`;
        s += `<rect y="0" width="${W}" height="${n1(26 * al)}" fill="url(#${P.g}h)" opacity=".9"/><rect y="${n1(H - 26 * al)}" width="${W}" height="${n1(26 * al)}" fill="url(#${P.g}h)" opacity=".9"/>`;

        s += `<ellipse cx="${cx}" cy="388" rx="${n1(210 * ease(seg(t, 1.5, 2.6)))}" ry="22" fill="#ff1d3a" opacity="${n1(0.35 * ease(seg(t, 1.5, 2.6)) * 100) / 100}"/>`;
        return s + '</g>';
      },
      front(t, P) {
        const fade = 1 - ease(seg(t, 4.35, 4.8));
        let s = `<g opacity="${n1(fade * 100) / 100}">`;

        const w = ease(seg(t, 0.95, 1.25)) * (1 - ease(seg(t, 4.0, 4.3)));
        if (w > 0.01) {
          const gl = t < 1.7 ? (hash(Math.floor(t * 30)) > 0.55 ? 1 : 0) : 0,
            tx = '[ SYSTEM WARNING: BOSS DETECTED ]';
          s += `<g opacity="${n1(w * 100) / 100}" font-family="Orbitron,sans-serif" font-weight="800" font-size="25" text-anchor="middle" letter-spacing="1.5">`;
          if (gl) s += `<text x="${400 - 5}" y="84" fill="#5ee6f2" opacity=".7">${tx}</text><text x="${400 + 5}" y="86" fill="#ff4d8d" opacity=".7">${tx}</text>`;
          s += `<text x="400" y="85" fill="#ff3b4d" filter="url(#${P.g})">${tx}</text></g>`;
        }

        const pl = ease(seg(t, 2.55, 3.0)) * (1 - ease(seg(t, 4.0, 4.3)));
        if (pl > 0.01) {
          const f = ease(seg(t, 2.8, 3.9)),
            dx = (1 - ease(seg(t, 2.55, 3.0))) * -60;
          s += `<g opacity="${n1(pl * 100) / 100}" transform="translate(${n1(dx)} 0)">`;
          s += `<rect x="90" y="338" width="620" height="82" rx="14" fill="rgba(8,4,22,.86)" stroke="#ff3b4d" stroke-width="2.5"/>`;
          s += `<text x="112" y="372" fill="#fff" font-family="Orbitron,sans-serif" font-weight="800" font-size="25">${esc(o.name)}</text>`;
          s += `<text x="688" y="372" text-anchor="end" fill="#ff7a8a" font-family="Orbitron,sans-serif" font-weight="800" font-size="19">BOSS</text>`;
          s += `<rect x="112" y="386" width="576" height="20" rx="10" fill="#2a0a14" stroke="#7a1a2a"/><rect x="112" y="386" width="${n1(576 * f)}" height="20" rx="10" fill="#ff2a4a" filter="url(#${P.g})"/>`;
          s += `<text x="400" y="402" text-anchor="middle" fill="#fff" font-family="Orbitron,sans-serif" font-weight="800" font-size="15">${esc(hp || C().hp + ' ' + Math.round(f * 100) + '%')}</text>`;
          s += '</g>';
        }

        const fl = env(t, 1.45, 1.52, 1.52, 1.75) * 0.8 + env(t, 4.2, 4.5, 4.55, 4.8) * 0.9;
        if (fl > 0.01) s += `<rect width="${W}" height="${H}" fill="#fff" opacity="${n1(fl * 100) / 100}"/>`;
        return s + '</g>';
      },
      dom(t, P) {
        const f = P.fig && P.fig.firstElementChild;
        if (!f) return;
        const k = ease(seg(t, 1.45, 2.5)),
          over = Math.sin(clamp((t - 1.45) / 1.2) * Math.PI) * 0.06,
          sc = 0.16 + 0.84 * k + over,
          fade = 1 - ease(seg(t, 4.35, 4.8)),
          br = 0.2 + 0.8 * ease(seg(t, 1.5, 2.2)),
          jit = t > 3.0 && t < 4.0 ? Math.sin(t * 60) * 1.2 : 0;
        f.style.opacity = k > 0.001 ? String(fade) : '0';
        f.style.transform = `translate(${n1(jit)}px, ${n1((1 - k) * 14)}px) scale(${n1(sc * 100) / 100})`;
        f.style.filter = `brightness(${n1(br * 100) / 100}) drop-shadow(0 0 ${n1(10 + 18 * (1 - k))}px rgba(255,40,70,.8))`;
      },
      cv(ctx, t, w, h) {
        for (let i = 0; i < 70; i++) {
          const st = 0.5 + hash(i + 7) * 0.9,
            age = t - st;
          if (age < 0 || age > 1.6) continue;
          const a = hash(i) * Math.PI * 2,
            v = 70 + hash(i + 99) * 260,
            x = cx + Math.cos(a) * v * age * 1.2,
            y = cy + Math.sin(a) * v * age * 0.9 + 140 * age * age;
          ctx.globalAlpha = (1 - age / 1.6) * 0.9;
          ctx.fillStyle = i % 3 ? '#ff6a3d' : i % 3 === 1 ? '#c9a7ff' : '#fff';
          ctx.fillRect(x, y, 3 + hash(i + 3) * 4, 3 + hash(i + 5) * 4);
        }
        if (t > 1.6 && t < 4.3) {
          for (let i = 0; i < 26; i++) {
            const p = (t * 0.5 + hash(i + 40)) % 1,
              x = 120 + hash(i + 41) * 560,
              y = 400 - p * 330;
            ctx.globalAlpha = Math.sin(p * Math.PI) * 0.7;
            ctx.fillStyle = '#ff4d5e';
            ctx.fillRect(x, y, 3, 3);
          }
        }
        ctx.globalAlpha = 1;
      },
      ev: [
        [0.08, (S, b) => S.charge(b)],
        [0.5, (S, b) => S.crack(b)],
        [0.62, (S, b) => S.thud(b)],
        [0.95, (S, b) => S.alarm(b)],
        [1.45, (S, b) => (S.boom(b), S.roar(b))],
        [1.95, (S, b) => S.alarm(b)],
        ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => [2.8 + i * 0.11, (S, b) => S.tick(b, 700 + i * 90)]),
        [4.0, (S, b) => S.sys(b)],
        [4.25, (S, b) => S.zap(b)],
      ],
    };
  }

  function boss(c, o = {}) {
    const k = String(c),
      mi = window.Mon && Mon.info(k);
    const name = o.name || (window.Bat ? Bat.monName(k) : mi ? mi.n : 'BOSS');
    const sc = bossScene({ fig: o.fig || o.mon || k, name, hpText: o.hpText });
    return Fx24.modal({
      scene: sc,
      cls: 'cs-boss',
      label: 'Boss Intro: ' + name,
      autoOpt: true,
      onDone: o.onDone,
      hold: 120,
      caption: () => `<span class="cs-line">${esc(o.wb ? C().wb : C().boss)}</span>`,
    });
  }

  function bossGate(c) {
    try {
      const rs = G.RS(),
        u = G.me();
      if (!Fx24.auto() || c === 'P' || c === 'T' || !rs || !u) return false;
      if (u.done && u.done[c]) return false;
      rs.bi = rs.bi || {};
      if (rs.bi[c]) return false;
      rs.bi[c] = 1;
      boss(c);
      return true;
    } catch (e) {
      console.warn('bossGate:', e);
      return false;
    }
  }

  const heart = (x, y, s, col, o = 1) => `<path transform="translate(${n1(x)} ${n1(y)}) scale(${n1(s * 100) / 100})" d="M0 10C-26-8-18-30 0-16C18-30 26-8 0 10Z" fill="${col}" opacity="${o}"/>`;
  const bulb = (x, y, s, col, glowId, lit = 1) => `<g transform="translate(${n1(x)} ${n1(y)}) scale(${n1(s * 100) / 100})" filter="url(#${glowId})"><path d="M0-34C-22-34-30-10-18 6C-12 14-10 20-10 26H10C10 20 12 14 18 6C30-10 22-34 0-34Z" fill="${col}" fill-opacity="${n1(0.25 + 0.6 * lit)}" stroke="${col}" stroke-width="3"/><path d="M-9 33H9M-6 40H6" stroke="${col}" stroke-width="4" stroke-linecap="round"/></g>`;
  const clock = (x, y, r, col, ang, glowId) => `<g transform="translate(${n1(x)} ${n1(y)})" filter="url(#${glowId})"><circle r="${r}" fill="rgba(10,16,60,.7)" stroke="${col}" stroke-width="4"/><path d="M0-${r - 6}V-${r - 14}M${r - 6} 0H${r - 14}M0 ${r - 6}V${r - 14}M-${r - 6} 0H-${r - 14}" stroke="${col}" stroke-width="3"/><path d="M0 0L${n1(Math.sin(ang) * (r - 12))} ${n1(-Math.cos(ang) * (r - 12))}" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle r="5" fill="${col}"/></g>`;
  const tx = (x, y, s, fill, size, anchor = 'middle', op = 1, extra = '') => `<text x="${n1(x)}" y="${n1(y)}" text-anchor="${anchor}" fill="${fill}" font-size="${size}" font-weight="800" font-family="Orbitron,Rajdhani,sans-serif" opacity="${n1(op * 100) / 100}" ${extra}>${esc(s)}</text>`;
  const DEMO = {
    hint(p, col, g, T) {
      let s = bulb(160, 78, 1.5, col, g, 0.4 + 0.6 * ease(seg(p, 0, 0.3)));
      for (let i = 0; i < 3; i++) {
        const k = (p * 2.2 + i / 3) % 1;
        s += ring(160, 70, 46 + k * 70, col, 3, (1 - k) * 0.7);
      }
      const sw = ease(seg(p, 0.45, 0.6));
      s += `<text x="160" y="205" text-anchor="middle" fill="#ff7aa8" font-size="${n1(54 - 22 * sw)}" font-weight="800" font-family="Orbitron,sans-serif" opacity="${n1(1 - 0.45 * sw)}">−10</text>`;
      if (sw > 0.02) s += `<path d="M${n1(128 - 12 * 0)} 190H${n1(128 + 64 * sw)}" stroke="#ff7aa8" stroke-width="4"/>` + tx(160, 252, '−5', col, 62 * ease(seg(p, 0.5, 0.7)) + 8, 'middle', sw, `filter="url(#${g})"`);
      return s;
    },
    bounce(p, col, g, T) {
      let s = '';
      const crack = ease(seg(p, 0.3, 0.5)),
        back = ease(seg(p, 0.62, 0.9));
      [90, 160, 230].forEach((x, i) => {
        if (i < 2) s += heart(x, 56, 1.3, '#ff5d8f');
        else {
          const sh = crack > 0 && back < 0.01 ? Math.sin(p * 90) * 3 * crack : 0;
          s += heart(x + sh, 56, 1.3, back > 0.5 ? '#ff5d8f' : '#554466', back > 0.5 ? 1 : 1 - crack * 0.4);
          if (crack > 0.3 && back < 0.5) s += `<path d="M${n1(x + sh - 4)} 36L${n1(x + sh + 2)} 52L${n1(x + sh - 3)} 64" stroke="#fff" stroke-width="3" fill="none"/>`;
        }
      });

      const u = seg(p, 0.5, 0.9),
        sx = lerp(70, 230, u),
        sy = 200 - Math.sin(u * Math.PI) * 120 * (u > 0 && u < 1 ? 1 : 0),
        sq = u > 0 && u < 1 ? 1 : 1 + Math.sin(p * 20) * 0.05;
      s += `<g transform="translate(${n1(sx)} ${n1(sy)}) scale(${n1(sq * 100) / 100} ${n1((2 - sq) * 100) / 100})" filter="url(#${g})"><path d="M-34 26C-34-18 34-18 34 26Z" fill="${col}" fill-opacity=".8" stroke="${col}" stroke-width="3"/><circle cx="-11" cy="6" r="5" fill="#0a0f33"/><circle cx="11" cy="6" r="5" fill="#0a0f33"/></g>`;
      s += `<ellipse cx="160" cy="232" rx="120" ry="8" fill="${col}" opacity=".25"/>`;
      if (back > 0.4) s += tx(230, 108 - back * 12, T.life, '#9dffb5', 22, 'middle', ease(seg(p, 0.85, 0.95)) * (1 - ease(seg(p, 0.98, 1))));
      return s;
    },
    shield(p, col, g, T) {
      const dm = ease(seg(p, 0.15, 0.45));
      let s = bulb(160, 128, 1.3, '#ffd86b', g, 1);
      s += `<path d="M40 160A120 120 0 0 1 280 160" fill="none" stroke="${col}" stroke-width="${n1(8 * dm)}" opacity="${n1(dm)}" filter="url(#${g})" stroke-dasharray="400" stroke-dashoffset="${n1(400 * (1 - dm))}"/>`;
      const hit = seg(p, 0.45, 0.75);
      if (hit > 0 && hit < 1) {
        const x = lerp(10, 125, ease(hit)),
          y = lerp(20, 80, ease(hit));
        s += tx(x, y, '−10', '#ff7aa8', 34, 'middle', 1 - ease(seg(hit, 0.85, 1)));
        if (hit > 0.8) s += ring(135, 90, (hit - 0.8) * 140, col, 4, 1 - (hit - 0.8) * 4);
      }
      if (p > 0.72) s += tx(160, 226, T.free, '#9dffb5', 40, 'middle', ease(seg(p, 0.72, 0.82)), `filter="url(#${g})"`);
      return s;
    },
    xp(p, col, g, T) {
      let s = '';
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + p * 1.5;
        s += `<path d="M160 90L${n1(160 + Math.cos(a) * 150)} ${n1(90 + Math.sin(a) * 150)}" stroke="${col}" stroke-width="5" opacity=".18"/>`;
      }
      s += `<circle cx="160" cy="90" r="${n1(34 + 4 * Math.sin(p * 12))}" fill="${col}" filter="url(#${g})"/>`;
      const f = lerp(0.4, 0.4 + 0.4 * 0.85, ease(seg(p, 0.25, 0.8)));
      s += `<rect x="30" y="196" width="260" height="22" rx="11" fill="rgba(10,16,60,.8)" stroke="${col}" stroke-width="2"/><rect x="30" y="196" width="${n1(260 * 0.4)}" height="22" rx="11" fill="#5ee6f2"/><rect x="${n1(30 + 260 * 0.4)}" y="196" width="${n1(260 * (f - 0.4))}" height="22" rx="11" fill="${col}" filter="url(#${g})"/>`;
      for (let i = 0; i < 3; i++) {
        const k = (p * 1.6 + i / 3) % 1;
        s += tx(120 + i * 40, 180 - k * 90, '+10%', '#fff', 26, 'middle', Math.sin(k * Math.PI));
      }
      return s + tx(160, 250, '+10% ' + T.xp, col, 24);
    },
    ants(p, col, g, T) {
      let s = '';
      const pile = Math.floor(ease(seg(p, 0.15, 0.9)) * 5);
      for (let i = 0; i < pile; i++) s += `<rect x="${236 + (i % 2) * 8}" y="${214 - i * 22}" width="40" height="20" rx="4" fill="${col}" fill-opacity=".85" stroke="#fff" stroke-width="1.5"/>`;
      for (let i = 0; i < 4; i++) {
        const k = (p * 1.7 + i * 0.27) % 1,
          x = lerp(0, 250, k),
          y = 218 + Math.sin(k * 30 + i) * 2;
        s += `<g transform="translate(${n1(x)} ${n1(y)})"><rect x="-4" y="-34" width="26" height="14" rx="3" fill="${col}" fill-opacity=".9"/><ellipse cx="0" cy="-8" rx="9" ry="7" fill="#2b1233" stroke="${col}" stroke-width="2"/><ellipse cx="14" cy="-8" rx="8" ry="6" fill="#2b1233" stroke="${col}" stroke-width="2"/><circle cx="24" cy="-10" r="6" fill="#2b1233" stroke="${col}" stroke-width="2"/><path d="M-4 -2L-8 6M4 -2L4 6M14 -2L18 6" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/></g>`;
      }
      s += tx(160, 58, '+20%', col, 54, 'middle', ease(seg(p, 0.2, 0.4)), `filter="url(#${g})"`);
      return s + tx(160, 92, T.raid, '#fff', 20, 'middle', ease(seg(p, 0.3, 0.5)));
    },
    crown(p, col, g, T) {
      let s = `<g transform="translate(160 ${n1(66 + Math.sin(p * 8) * 3)})" filter="url(#${g})"><path d="M-52 24L-60-16L-28 6L0-26L28 6L60-16L52 24Z" fill="${col}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><circle cx="-60" cy="-16" r="6" fill="#fff"/><circle cx="0" cy="-26" r="7" fill="#fff"/><circle cx="60" cy="-16" r="6" fill="#fff"/></g>`;
      for (let i = 0; i < 12; i++) {
        const k = (p * 1.4 + hash(i + 3)) % 1,
          x = 50 + hash(i) * 220,
          y = 100 + k * 130;
        s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="9" fill="#ffd86b" stroke="#fff" stroke-width="2" opacity="${n1(Math.sin(k * Math.PI))}"/>`;
      }
      s += `<ellipse cx="160" cy="236" rx="${n1(30 + 60 * ease(seg(p, 0.1, 0.9)))}" ry="10" fill="#ffd86b" opacity=".5"/>`;
      return s + tx(160, 190, '+20% ' + T.xp, '#fff', 34, 'middle', ease(seg(p, 0.35, 0.5)), `filter="url(#${g})"`);
    },
    time(p, col, g, T) {
      const ang = lerp(5.2, 2.6, ease(seg(p, 0.25, 0.9)));
      let s = clock(160, 108, 70, col, ang, g);
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * (1.12 + (i / 8) * 0.76),
          x = 160 + Math.cos(a) * 100,
          y = 108 + Math.sin(a) * 100,
          on = p > 0.1 + i * 0.07;
        s += `<g transform="translate(${n1(x)} ${n1(y)}) scale(.9)" opacity="${on ? 1 : 0.25}"><path d="M-9 8C-12-6-9-12-6-14L-3-9H3L6-14C9-12 12-6 9 8Z" fill="${col}"/></g>`;
      }
      s += `<rect x="40" y="214" width="240" height="14" rx="7" fill="rgba(10,16,60,.8)" stroke="${col}" stroke-width="2"/><rect x="40" y="214" width="${n1(150 + 90 * ease(seg(p, 0.35, 0.8)))}" height="14" rx="7" fill="${col}"/>`;
      return s + tx(160, 258, '+10 ' + T.sec, '#fff', 30, 'middle', ease(seg(p, 0.45, 0.6)), `filter="url(#${g})"`);
    },
    freeze(p, col, g, T) {
      const f = ease(seg(p, 0.25, 0.6));
      let s = clock(160, 104, 70, col, 4.0 + Math.sin(p * 10) * 0.05 * (1 - f), g);
      s += `<circle cx="160" cy="104" r="70" fill="#bfeeff" opacity="${n1(0.5 * f)}"/>`;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2,
          r1 = 70,
          r2 = 70 + 32 * f * (0.7 + 0.3 * hash(i));
        s += `<path d="M${n1(160 + Math.cos(a) * r1)} ${n1(104 + Math.sin(a) * r1)}L${n1(160 + Math.cos(a) * r2)} ${n1(104 + Math.sin(a) * r2)}" stroke="#e6faff" stroke-width="5" stroke-linecap="round" filter="url(#${g})"/>`;
      }
      for (let i = 0; i < 10; i++) {
        const k = (p * 0.9 + hash(i + 8)) % 1;
        s += `<path d="${star(30 + hash(i) * 260, 20 + k * 220, 6)}" fill="#fff" opacity="${n1(Math.sin(k * Math.PI) * 0.9)}"/>`;
      }
      return s + tx(160, 236, '+15 ' + T.sec, '#fff', 34, 'middle', ease(seg(p, 0.5, 0.65)), `filter="url(#${g})"`);
    },
    root(p, col, g, T) {
      const gr = ease(seg(p, 0.1, 0.7));
      let s = `<g filter="url(#${g})"><path d="M70 150L92 176L128 80H250" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="500" stroke-dashoffset="${n1(500 * (1 - gr))}"/></g>`;
      for (let i = 0; i < 4; i++) {
        const k = ease(seg(p, 0.35 + i * 0.1, 0.65 + i * 0.1)),
          x = 150 + i * 28;
        s += `<g opacity="${n1(k)}"><path d="M${x} 80Q${x - 10} 50 ${x} 36" stroke="${col}" stroke-width="3" fill="none"/><ellipse cx="${x + 8}" cy="42" rx="11" ry="6" transform="rotate(-30 ${x + 8} 42)" fill="${col}"/></g>`;
      }
      const bl = ease(seg(p, 0.65, 0.9));
      s += `<g transform="translate(250 66) scale(${n1(bl * 100) / 100})" filter="url(#${g})"><circle r="9" fill="#ffd86b"/>${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${n1(Math.cos((i / 5) * 6.283) * 15)}" cy="${n1(Math.sin((i / 5) * 6.283) * 15)}" rx="9" ry="6" fill="#ff9ec8" transform="rotate(${i * 72} ${n1(Math.cos((i / 5) * 6.283) * 15)} ${n1(Math.sin((i / 5) * 6.283) * 15)})"/>`).join('')}</g>`;
      s += `<rect x="40" y="200" width="240" height="16" rx="8" fill="rgba(10,16,60,.8)" stroke="${col}" stroke-width="2"/><rect x="40" y="200" width="${n1(240 * lerp(0.3, 0.3 * 1.3 + 0.35, ease(seg(p, 0.6, 0.95))))}" height="16" rx="8" fill="${col}"/>`;
      return s + tx(160, 252, '+30% ' + T.daily, '#fff', 20, 'middle', ease(seg(p, 0.6, 0.75)));
    },
    guild(p, col, g, T) {
      let s = `<path d="M90 20H230V170L160 140L90 170Z" fill="rgba(60,40,10,.7)" stroke="${col}" stroke-width="4" filter="url(#${g})"/><path d="M124 56H196M124 72H196" stroke="${col}" stroke-width="3" opacity=".6"/>`;
      const it = [
        ['+10% XP', '#ffd86b', 0.15],
        ['+8 ' + T.sec, '#5ee6f2', 0.38],
        [T.hintw + ' −5', '#c9a7ff', 0.6],
      ];
      it.forEach((m, i) => {
        const k = ease(seg(p, m[2], m[2] + 0.14)),
          y = 214 + (i - 1) * 0;
        s += `<g transform="translate(${60 + i * 100} ${n1(214 - 18 * k)}) scale(${n1((0.4 + 0.6 * k) * 100) / 100})" opacity="${n1(k)}"><circle r="30" fill="rgba(10,16,60,.85)" stroke="${m[1]}" stroke-width="4" filter="url(#${g})"/><text y="6" text-anchor="middle" fill="${m[1]}" font-size="17" font-weight="800" font-family="Orbitron,sans-serif">${esc(m[0])}</text></g>`;
      });
      s += `<g transform="translate(160 92)" fill="${col}"><circle r="18"/><path d="M-12 16L0 46L12 16Z"/></g>`;
      return s + `<path d="${star(160, 92, 14)}" fill="#fff" opacity="${n1(0.5 + 0.5 * Math.sin(p * 14))}"/>`;
    },
    heal(p, col, g, T) {
      const f = lerp(0.4, 0.65, ease(seg(p, 0.3, 0.8)));
      let s = heart(160, 62, 2.4, '#ff5d8f', 0.95);
      s += `<rect x="30" y="170" width="260" height="26" rx="13" fill="rgba(10,16,60,.8)" stroke="#9dffb5" stroke-width="2.5"/><rect x="30" y="170" width="${n1(260 * 0.4)}" height="26" rx="13" fill="#4cc38a"/><rect x="${n1(30 + 260 * 0.4)}" y="170" width="${n1(260 * (f - 0.4))}" height="26" rx="13" fill="#9dffb5" filter="url(#${g})"/>`;
      for (let i = 0; i < 8; i++) {
        const k = (p * 1.5 + hash(i + 2)) % 1;
        s += `<path d="M${n1(60 + hash(i) * 200)} ${n1(150 - k * 120)}h14M${n1(67 + hash(i) * 200)} ${n1(143 - k * 120)}v14" stroke="#9dffb5" stroke-width="4" stroke-linecap="round" opacity="${n1(Math.sin(k * Math.PI))}"/>`;
      }
      return s + tx(160, 238, '+25% HP', '#9dffb5', 34, 'middle', ease(seg(p, 0.45, 0.6)), `filter="url(#${g})"`);
    },
    scout(p, col, g, T) {
      const lab = ['A', 'B', 'C', 'D'],
        ang = p * 6.283 * 1.15 - 1.2;
      let s = `<circle cx="160" cy="84" r="62" fill="rgba(10,16,60,.7)" stroke="${col}" stroke-width="3"/>${ring(160, 84, 40, col, 2, 0.4)}${ring(160, 84, 20, col, 2, 0.4)}<path d="M160 84L${n1(160 + Math.cos(ang) * 62)} ${n1(84 + Math.sin(ang) * 62)}" stroke="${col}" stroke-width="5" filter="url(#${g})"/><path d="M160 84L${n1(160 + Math.cos(ang - 0.35) * 62)} ${n1(84 + Math.sin(ang - 0.35) * 62)}L${n1(160 + Math.cos(ang) * 62)} ${n1(84 + Math.sin(ang) * 62)}Z" fill="${col}" opacity=".25"/>`;
      lab.forEach((l, i) => {
        const x = 20 + i * 72,
          dead = i === 2 && p > 0.62;
        s += `<g opacity="${dead ? n1(1 - ease(seg(p, 0.7, 0.9)) * 0.7) : 1}"><rect x="${x}" y="176" width="62" height="44" rx="9" fill="rgba(10,16,60,.85)" stroke="${dead ? '#ff7aa8' : col}" stroke-width="3"/><text x="${x + 31}" y="206" text-anchor="middle" fill="#fff" font-size="24" font-weight="800" font-family="Orbitron,sans-serif">${l}</text>${dead ? `<path d="M${x + 8} 182L${x + 54} 214M${x + 54} 182L${x + 8} 214" stroke="#ff7aa8" stroke-width="5" stroke-linecap="round"/>` : ''}</g>`;
      });
      return s + tx(160, 252, '−1', '#ff7aa8', 26, 'middle', ease(seg(p, 0.65, 0.8)));
    },
    wall(p, col, g, T) {
      const dm = ease(seg(p, 0.1, 0.4)),
        hit = seg(p, 0.45, 0.75);
      let s = `<g transform="translate(160 150)" fill="${col}"><circle cy="-34" r="16" fill-opacity=".9"/><path d="M-20 38L-14-12H14L20 38Z" fill-opacity=".85"/></g>`;
      s += `<path d="M44 190A116 116 0 0 1 276 190" fill="none" stroke="${col}" stroke-width="${n1(9 * dm)}" opacity="${n1(dm)}" filter="url(#${g})" stroke-dasharray="400" stroke-dashoffset="${n1(400 * (1 - dm))}"/>`;
      if (hit > 0 && hit < 1) {
        const o = 1 - ease(seg(hit, 0.6, 1));
        s += [0, 1, 2].map((i) => `<path d="M${n1(30 + i * 14)} ${n1(20 + i * 10)}L${n1(lerp(30 + i * 14, 120 + i * 8, ease(hit)))} ${n1(lerp(20 + i * 10, 70 + i * 4, ease(hit)))}" stroke="#ff4d6d" stroke-width="7" stroke-linecap="round" opacity="${n1(o)}"/>`).join('');
        if (hit > 0.5) s += ring(124, 76, (hit - 0.5) * 120, '#fff', 4, (1 - hit) * 1.6);
      }
      return s + (p > 0.62 ? tx(160, 238, T.block, '#fff', 34, 'middle', ease(seg(p, 0.62, 0.75)), `filter="url(#${g})"`) : '');
    },
  };

  function spotScene(o) {
    const W = 640,
      H = 480,
      locked = !!o.locked,
      DUR = locked ? 4.6 : 7.2,
      col = o.col;
    const rays = [...Array(14)].map((_, i) => i);
    const T = C();
    return {
      W,
      H,
      dur: DUR,
      ratio: '4/3',
      poster: locked ? 1.4 : 5.5,
      figure: `<div class="sp-fig">${o.fig}</div>`,
      defs: (P) => `<radialGradient id="${P.g}a" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${col}" stop-opacity=".95"/><stop offset=".55" stop-color="${col}" stop-opacity=".3"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient><linearGradient id="${P.g}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`,
      back(t, P) {
        let s = `<rect width="${W}" height="${H}" fill="#05030f"/>`;

        const sp = ease(seg(t, 0.1, 0.8));
        s += `<path d="M300 0H340L520 410H120Z" fill="url(#${P.g}b)" opacity="${n1(0.28 * sp * 100) / 100}"/>`;
        s += `<ellipse cx="170" cy="418" rx="${n1(140 * sp)}" ry="16" fill="${col}" opacity="${n1(0.35 * sp * 100) / 100}"/>`;

        const fl = env(t, 1.15, 1.35, 1.4, 2.3);
        if (fl > 0.01) {
          s += `<circle cx="170" cy="250" r="${n1(70 + 180 * ease(seg(t, 1.15, 1.9)))}" fill="url(#${P.g}a)" opacity="${n1(fl * 100) / 100}"/>`;
          s += `<g stroke="${col}" stroke-width="5" stroke-linecap="round" opacity="${n1(fl * 0.9 * 100) / 100}" filter="url(#${P.g})">${rays.map((i) => `<path d="${bolt(170, 250, 170 + Math.cos((i / 14) * 6.283) * 300, 250 + Math.sin((i / 14) * 6.283) * 240, i * 5 + Math.floor(t * 18), 22)}" fill="none"/>`).join('')}</g>`;
        }
        s += ring(170, 250, 30 + 330 * ease(seg(t, 1.2, 2.2)), col, 6, 1 - ease(seg(t, 1.2, 2.2))) + ring(170, 250, 20 + 240 * ease(seg(t, 1.35, 2.2)), '#fff', 3, 0.8 * (1 - ease(seg(t, 1.35, 2.2))));

        const pa = locked ? 0 : ease(seg(t, 3.0, 3.4));
        if (pa > 0.01) {
          const p = seg(t, 3.3, 6.4);
          s += `<g opacity="${n1(pa * 100) / 100}" transform="translate(${n1(lerp(30, 0, pa))} 0)"><rect x="296" y="96" width="328" height="296" rx="16" fill="rgba(8,10,40,.82)" stroke="${col}" stroke-width="3"/><g transform="translate(300 120)">${DEMO[o.demo] ? DEMO[o.demo](p, col, P.g, T) : ''}</g></g>`;
        }

        const wf = env(t, 1.3, 1.36, 1.36, 1.7) * 0.85;
        if (wf > 0.01) s += `<rect width="${W}" height="${H}" fill="#fff" opacity="${n1(wf * 100) / 100}"/>`;
        return s;
      },
      front(t, P) {
        let s = '';
        const q = ease(seg(t, 0.4, 0.9)) * (1 - ease(seg(t, 1.3, 1.8)));
        if (q > 0.01 && !locked) s += `<text x="170" y="250" text-anchor="middle" font-size="120" font-weight="800" fill="#fff" opacity="${n1(q * 0.18 * 100) / 100}" font-family="Orbitron,sans-serif">?</text>`;
        if (locked) {
          const a = ease(seg(t, 2.2, 2.8));
          s += `<g opacity="${n1(a)}"><rect x="300" y="170" width="320" height="140" rx="16" fill="rgba(8,10,40,.88)" stroke="${col}" stroke-width="3"/>${tx(460, 230, '??? ' + T.locked, col, 34, 'middle', 1, `filter="url(#${P.g})"`)}${tx(460, 272, o.need || '', '#fff', 17, 'middle', 0.9)}</g>`;
        }

        const n = ease(seg(t, 2.0, 2.5));
        if (!locked && n > 0.01) {
          s += `<g opacity="${n1(n)}" transform="translate(${n1((1 - n) * -80)} 0)"><rect x="14" y="14" width="${W - 28}" height="68" rx="14" fill="rgba(8,10,40,.86)" stroke="${col}" stroke-width="3"/>`;
          s += `<text x="34" y="46" fill="#fff" font-size="${o.name.length > 14 ? 24 : 30}" font-weight="800" font-family="Orbitron,Rajdhani,sans-serif" filter="url(#${P.g})">${esc(o.name)}</text>`;
          s += `<text x="34" y="70" fill="${col}" font-size="19" font-weight="700">${esc(o.role)}</text>`;
          s += `<rect x="${W - 168}" y="30" width="136" height="34" rx="17" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="2"/><text x="${W - 100}" y="54" text-anchor="middle" fill="#fff" font-size="19" font-weight="800">${esc(o.elem)}</text></g>`;

          const sk = ease(seg(t, 3.0, 3.5));
          s += `<g opacity="${n1(sk)}"><text x="460" y="426" text-anchor="middle" fill="${col}" font-size="22" font-weight="800" font-family="Orbitron,Rajdhani,sans-serif" filter="url(#${P.g})">${esc(T.skill)}: ${esc(o.skillName)}</text></g>`;
        }
        return s;
      },
      dom(t, P) {
        const f = P.fig && P.fig.firstElementChild;
        if (!f) return;
        const k = locked ? 0 : ease(seg(t, 1.4, 2.2)),
          a = env(t, 0.2, 0.9, 99, 100),
          pop = 0.9 + 0.1 * k + Math.sin(clamp((t - 1.4) / 0.9) * Math.PI) * 0.06,
          g = locked ? 6 : n1(4 + 16 * (1 - k) + 6 * k + 3 * Math.sin(t * 4));
        f.style.opacity = String(a);
        f.style.transform = `scale(${n1(pop * 100) / 100})`;
        f.style.filter = `brightness(${n1(k * 100) / 100}) drop-shadow(0 0 ${g}px ${k < 0.5 ? '#fff' : o.col})`;
      },
      cv(ctx, t) {

        for (let i = 0; i < 44; i++) {
          const p = (t * 0.12 + hash(i)) % 1;
          ctx.globalAlpha = Math.sin(p * Math.PI) * 0.6;
          ctx.fillStyle = i % 3 ? o.col : '#fff';
          ctx.fillRect(20 + hash(i + 1) * 600, 440 - p * 420, 2.5, 2.5);
        }
        for (let i = 0; i < 40; i++) {
          const st = 1.3 + hash(i + 70) * 0.2,
            age = t - st;
          if (age < 0 || age > 1.2) continue;
          const a = hash(i + 71) * 6.283,
            v = 90 + hash(i + 72) * 240;
          ctx.globalAlpha = 1 - age / 1.2;
          ctx.fillStyle = i % 2 ? o.col : '#fff';
          ctx.fillRect(170 + Math.cos(a) * v * age, 250 + Math.sin(a) * v * age * 0.8, 4, 4);
        }
        ctx.globalAlpha = 1;
      },
      ev: locked
        ? [
            [0.5, (S, b) => S.charge(b)],
            [1.3, (S, b) => (S.boom(b), S.zap(b))],
            [2.3, (S, b) => S.sys(b)],
          ]
        : [
            [0.5, (S, b) => S.charge(b)],
            [1.3, (S, b) => (S.boom(b), S.zap(b))],
            [1.9, (S, b) => S.chime(b, 988)],
            [2.1, (S, b) => S.sys(b)],
            ...(DEMO_SND[o.demo] || []).map((e) => [3.3 + e[0] * 3.1, e[1]]),
          ],
    };
  }

  const DEMO_SND = {
    hint: [[0.1, (S, b) => S.ping(b, 1100)], [0.52, (S, b) => S.chime(b, 1318)]],
    bounce: [[0.32, (S, b) => S.crack(b)], [0.62, (S, b) => S.whoosh(b)], [0.9, (S, b) => S.coin(b)]],
    shield: [[0.18, (S, b) => S.shield(b)], [0.6, (S, b) => S.hit(b)], [0.72, (S, b) => S.coin(b)]],
    xp: [[0.25, (S, b) => S.charge(b)], [0.75, (S, b) => S.chime(b, 1046)]],
    ants: [[0.2, (S, b) => S.tick(b, 600)], [0.4, (S, b) => S.coin(b)], [0.75, (S, b) => S.coin(b)]],
    crown: [[0.1, (S, b) => S.chime(b, 784)], [0.4, (S, b) => S.coin(b)], [0.7, (S, b) => S.coin(b)]],
    time: [[0.25, (S, b) => S.tick(b, 900)], [0.5, (S, b) => S.chime(b, 1175)]],
    freeze: [[0.28, (S, b) => S.freeze(b)], [0.55, (S, b) => S.chime(b, 1568)]],
    root: [[0.15, (S, b) => S.whoosh(b)], [0.68, (S, b) => S.chime(b, 880)]],
    guild: [[0.15, (S, b) => S.fan(b)], [0.4, (S, b) => S.coin(b)], [0.62, (S, b) => S.coin(b)]],
    heal: [[0.3, (S, b) => S.heal(b)]],
    scout: [[0.1, (S, b) => S.ping(b, 1200)], [0.4, (S, b) => S.ping(b, 1400)], [0.65, (S, b) => S.hit(b)]],
    wall: [[0.1, (S, b) => S.shield(b)], [0.5, (S, b) => S.hit(b)], [0.62, (S, b) => S.chime(b, 988)]],
  };

  function spot(kind, id) {
    try {
      const u = G.me();
      let d;
      if (kind === 'char') {
        const ch = G.Co() && G.Co().get(id);
        if (!ch) return null;
        const m = CH24[id] || { col: '#9a5aff', el: 'shadow', demo: 'hint' },
          un = G.Co() && u ? G.Co().unlocked(u) : [id],
          locked = !un.includes(id);
        const sk = G.SK()[id];
        let need = '';
        if (locked) need = C().need + ': ' + tr(G.lock(ch));
        d = { name: ch.name, role: tr(ch.role), col: m.col, elem: elName(m.el), demo: m.demo, skillName: sk ? tr(sk.n) : '', skillDesc: sk ? tr(sk.d) : '', skillKind: sk ? tr(sk.k) : '', fig: ch.svg(locked ? 'sad' : 'happy'), locked, need: locked ? need : '', quote: ch.quote };
      } else {
        const x = window.Bat && Bat.soldierInfo(id);
        if (!x) return null;
        const m = SH24[id] || SH24.E,
          done = u && u.done && u.done[id],
          locked = !done && !(u && u.role === 'teacher'),
          b = Bat.BUFF[x.buff];
        const rk = G.RK().find((r) => r.c === id);
        d = { name: window.Mon ? Mon.sname(x.n) : x.n, role: tr(x.role), col: m.col, elem: elName(m.el), demo: BUFFDEMO[x.buff] || 'heal', skillName: tr(b.n), skillDesc: tr(b.d), skillKind: C().shadow, fig: shadowFig(id, 200), locked, need: locked && rk ? C().need + ': ' + tr(rk.n) : '' };
      }
      const sc = spotScene(d);
      const capHtml = (t) => {
        if (d.locked) return t < 2.2 ? '<span class="cs-line mut">…</span>' : `<span class="cs-line">${esc(kind === 'char' ? fmt(C().teaser, { r: d.need.replace(/^[^:]*:\s*/, '') }) : C().teaserS)}</span>`;
        if (t < 2.1) return '<span class="cs-line mut">…</span>';
        return `<b class="cs-name">${esc(d.name)}</b> <span class="cs-elem">${esc(C().elem)}: ${esc(d.elem)}</span>${d.skillName ? `<span class="cs-skill"><b>${esc(C().skill)}: ${esc(d.skillName)}</b> <em>${esc(d.skillKind)}</em><br>${esc(d.skillDesc)}</span>` : ''}`;
      };
      return Fx24.modal({ scene: sc, cls: 'cs-spot', label: (d.locked ? '???' : d.name) + ' Spotlight', replay: true, caption: capHtml, onDone: null });
    } catch (e) {
      console.warn('spot:', e);
      return null;
    }
  }

  function ariseScene(o) {
    const W = 800,
      H = 450,
      DUR = 5.0,
      col = o.col || '#9a5aff',
      T = C();
    const TTL = G.TT(),
      titles = TTL.map((t) => t[1]);
    const ti = Math.max(0, titles.indexOf(o.up)),
      tf = Math.max(0, titles.indexOf(o.from));
    return {
      W,
      H,
      dur: DUR,
      ratio: '16/9',
      poster: 2.6,
      figure: `<div class="ar-f1">${o.boss}</div><div class="ar-f2">${o.shadow}</div>`,
      defs: (P) => `<radialGradient id="${P.g}r" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#c9a7ff" stop-opacity=".9"/><stop offset=".5" stop-color="#7a3cff" stop-opacity=".35"/><stop offset="1" stop-color="#12062e" stop-opacity="0"/></radialGradient><linearGradient id="${P.g}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b46bff"/></linearGradient>`,
      back(t, P) {
        const fade = 1 - ease(seg(t, 4.7, 5));
        let s = `<rect width="${W}" height="${H}" fill="#05030f"/><g opacity="${n1(fade * 100) / 100}">`;
        s += `<ellipse cx="400" cy="250" rx="${n1(320 * ease(seg(t, 0.2, 1.4)))}" ry="${n1(230 * ease(seg(t, 0.2, 1.4)))}" fill="url(#${P.g}r)" opacity="${n1(0.7 * Math.max(env(t, 0.2, 1.2, 3.4, 4.6), 0.35 * ease(seg(t, 1.2, 1.6))) * 100) / 100}"/>`;

        const rn = ease(seg(t, 0.3, 1.1));
        s += `<g transform="translate(400 392) scale(1 .16)" opacity="${n1(rn * 0.85 * 100) / 100}" fill="none" stroke="${col}" stroke-width="5"><circle r="${n1(220 * rn)}" stroke-dasharray="14 12" transform="rotate(${n1(t * 40)})"/><circle r="${n1(150 * rn)}" stroke="#c9a7ff" stroke-dasharray="40 16" transform="rotate(${n1(-t * 60)})"/></g>`;

        if (t < 2.5) {
          const st = Math.floor(t * 14),
            on = env(t, 0.05, 0.3, 1.9, 2.5);
          [0, 1, 2, 3, 4, 5].forEach((i) => {
            if (hash(st + i * 13) > 0.5 && on > 0.05) {
              const x0 = 120 + hash(i + st) * 560;
              s += `<g fill="none" stroke-linecap="round" opacity="${n1(on * 100) / 100}" filter="url(#${P.g})"><path d="${bolt(x0, -10, 400 + (hash(i + 3) - 0.5) * 120, 300, st * 7 + i, 40)}" stroke="#d9b8ff" stroke-width="6"/><path d="${bolt(x0, -10, 400 + (hash(i + 3) - 0.5) * 120, 300, st * 7 + i, 40)}" stroke="#fff" stroke-width="2.4"/></g>`;
            }
          });
        }

        const sh = seg(t, 2.0, 2.9);
        s += ring(400, 250, 40 + 520 * ease(sh), '#d9b8ff', 8 * (1 - sh) + 1, 1 - sh) + ring(400, 250, 20 + 360 * ease(seg(t, 2.05, 2.9)), '#fff', 4, 0.8 * (1 - seg(t, 2.05, 2.9)));
        return s + '</g>';
      },
      front(t, P) {
        const fade = 1 - ease(seg(t, 4.7, 5));
        let s = `<g opacity="${n1(fade * 100) / 100}">`;

        const a = ease(seg(t, 1.95, 2.15)),
          mv = o.up ? ease(seg(t, 2.9, 3.4)) : 0,
          sc = lerp(2.4, 1, a) * lerp(1, 0.5, mv),
          y = lerp(250, 74, mv);
        if (a > 0.01) {
          const shk = t < 2.45 ? (hash(Math.floor(t * 50)) - 0.5) * 8 * (1 - seg(t, 2.1, 2.45)) : 0;
          s += `<g transform="translate(${n1(400 + shk)} ${n1(y)}) scale(${n1(sc * 100) / 100})" opacity="${n1(a)}"><text text-anchor="middle" y="30" font-size="108" font-weight="800" font-family="Orbitron,sans-serif" letter-spacing="8" fill="url(#${P.g}t)" stroke="#5b2fd0" stroke-width="2" filter="url(#${P.g2})">ARISE!</text></g>`;
        }

        const c1 = ease(seg(t, 2.9, 3.4));
        if (c1 > 0.01) {
          if (!o.up) {
            s += `<g opacity="${n1(c1)}" transform="translate(0 ${n1((1 - c1) * 30)})"><rect x="110" y="336" width="580" height="86" rx="14" fill="rgba(10,6,34,.88)" stroke="${col}" stroke-width="3"/><text x="400" y="372" text-anchor="middle" fill="#fff" font-size="27" font-weight="800" font-family="Orbitron,Rajdhani,sans-serif">${esc(o.sname)}</text><text x="400" y="404" text-anchor="middle" fill="${col}" font-size="20" font-weight="700">${esc(T.shadow)} · ${esc(o.buff || '')}</text></g>`;
          } else {
            s += `<g opacity="${n1(c1)}"><text x="400" y="142" text-anchor="middle" fill="#ffd86b" font-size="30" font-weight="800" font-family="Orbitron,sans-serif" letter-spacing="4" filter="url(#${P.g})">${esc(T.rankup)}</text>`;
            const cw = 168,
              gap = 14,
              x0 = (W - (cw * 4 + gap * 3)) / 2;
            titles.forEach((nm, i) => {
              const x = x0 + i * (cw + gap),
                isNew = i === ti,
                reach = i <= ti,
                pulse = isNew ? 0.6 + 0.4 * Math.sin(t * 9) : 1,
                pop = isNew ? ease(seg(t, 3.7, 4.1)) : 1;
              s += `<g transform="translate(${n1(x)} ${n1(isNew ? 168 - 12 * pop : 168)})" opacity="${reach ? 1 : 0.35}"><rect width="${cw}" height="${isNew ? 84 : 72}" rx="12" fill="rgba(10,6,34,.9)" stroke="${isNew ? '#ffd86b' : i === tf ? '#8e9ad0' : '#3a2a8a'}" stroke-width="${isNew ? 4 : 2}" ${isNew ? `filter="url(#${P.g})"` : ''}/>`;
              s += `<text x="${cw / 2}" y="34" text-anchor="middle" fill="${isNew ? '#ffd86b' : '#c9d3ff'}" font-size="${nm.length > 14 ? 17 : 19}" font-weight="800" font-family="Orbitron,Rajdhani,sans-serif">${esc(tr(nm))}</text><text x="${cw / 2}" y="${isNew ? 62 : 56}" text-anchor="middle" fill="${isNew ? '#fff' : '#8e9ad0'}" font-size="16" font-weight="700" opacity="${isNew ? pulse : 1}">${esc((TTL[i] ? TTL[i][0] : 0) + ' XP')}</text></g>`;
              if (i < titles.length - 1) s += `<path d="M${n1(x + cw + 2)} 204h${gap - 4}" stroke="${i < ti ? '#ffd86b' : '#3a2a8a'}" stroke-width="4" stroke-linecap="round"/>`;
            });
            const xs = ease(seg(t, 3.9, 4.3));
            s += `<text x="400" y="290" text-anchor="middle" fill="#fff" font-size="24" font-weight="800" opacity="${n1(xs)}">${esc(tr(o.from))} → <tspan fill="#ffd86b">${esc(tr(o.up))}</tspan></text>`;
            s += `<text x="400" y="332" text-anchor="middle" fill="${col}" font-size="21" font-weight="700" opacity="${n1(xs)}">${esc(o.sname)} ${esc(T.joined)}${o.xp ? ' · +' + o.xp + ' XP' : ''}</text></g>`;
          }
        }
        const wf = env(t, 1.98, 2.04, 2.04, 2.4) * 0.9;
        if (wf > 0.01) s += `<rect width="${W}" height="${H}" fill="#fff" opacity="${n1(wf * 100) / 100}"/>`;
        return s + '</g>';
      },
      dom(t, P) {
        const f1 = P.fig.children[0],
          f2 = P.fig.children[1];
        if (!f1 || !f2) return;
        const up = o.up ? ease(seg(t, 2.9, 3.4)) : 0;

        const dis = ease(seg(t, 0.9, 1.9)),
          a1 = ease(seg(t, 0.15, 0.6)) * (1 - dis);
        f1.style.opacity = String(n1(a1 * 100) / 100);
        f1.style.transform = `translate(${n1(Math.sin(t * 50) * 2 * (1 - dis))}px, ${n1(-dis * 30)}px) scale(${n1((1 - dis * 0.15) * 100) / 100})`;
        f1.style.filter = `grayscale(${n1(0.6 + 0.4 * dis)}) brightness(${n1((1 + dis * 1.5) * 100) / 100}) blur(${n1(dis * 5)}px)`;
        const r = ease(seg(t, 1.25, 2.2)),
          a2 = r * (1 - ease(seg(t, 4.7, 5)));
        f2.style.opacity = String(n1(a2 * 100) / 100);
        f2.style.transform = `translateY(${n1((1 - r) * 40 - up * 36)}px) scale(${n1((0.7 + 0.3 * r) * (1 - up * 0.32) * 100) / 100})`;
        f2.style.filter = `drop-shadow(0 0 ${n1(10 + 14 * Math.sin(t * 5) ** 2)}px ${col})`;
      },
      cv(ctx, t) {

        for (let i = 0; i < 90; i++) {
          const st = 0.7 + hash(i + 1) * 1.4,
            age = t - st;
          if (age < 0 || age > 1.5) continue;
          const k = age / 1.5,
            x = 400 + (hash(i + 2) - 0.5) * 240 * (1 - k * 0.6),
            y = 330 - k * 240;
          ctx.globalAlpha = Math.sin(k * Math.PI) * 0.9;
          ctx.fillStyle = i % 3 ? col : '#fff';
          ctx.fillRect(x, y, 3 + hash(i + 3) * 3, 3 + hash(i + 3) * 3);
        }
        for (let i = 0; i < 60; i++) {
          const age = t - 2.0 - hash(i + 20) * 0.1;
          if (age < 0 || age > 1.3) continue;
          const a = hash(i + 21) * 6.283,
            v = 120 + hash(i + 22) * 320;
          ctx.globalAlpha = 1 - age / 1.3;
          ctx.fillStyle = i % 2 ? '#d9b8ff' : '#fff';
          ctx.fillRect(400 + Math.cos(a) * v * age, 250 + Math.sin(a) * v * age * 0.7, 4, 4);
        }
        ctx.globalAlpha = 1;
      },
      ev: [
        [0.05, (S, b) => S.zap(b)],
        [0.45, (S, b) => S.zap(b)],
        [0.8, (S, b) => S.charge(b)],
        [0.95, (S, b) => S.zap(b)],
        [1.95, (S, b) => S.arise(b)],
        [2.95, (S, b) => (o.up ? S.fan(b) : S.chime(b, 988))],
        [3.8, (S, b) => o.up && S.chime(b, 1318)],
      ],
    };
  }

  function arise(o = {}) {
    try {
      const c = String(o.c),
        x = window.Bat && Bat.soldierInfo(c);
      if (!x) {
        o.done && o.done();
        return null;
      }
      const m = SH24[c] || SH24.E,
        b = Bat.BUFF[x.buff],
        sname = window.Mon ? Mon.sname(x.n) : x.n;
      const sc = ariseScene({ col: m.col, boss: bossFig(c, 'ko'), shadow: shadowFig(c, 220), sname, buff: tr(b.n), up: o.up || null, from: o.from || '', xp: o.xp || 0 });
      return Fx24.modal({
        scene: sc,
        cls: 'cs-arise',
        label: 'ARISE',
        autoOpt: true,
        onDone: o.done,
        hold: 150,
        caption: (t) => (t < 2.0 ? '<span class="cs-line mut">…</span>' : `<span class="cs-line">${esc(o.up ? fmt(C().up, { a: tr(o.from), b: tr(o.up) }) : fmt(C().arise, { n: sname }))}</span>`),
      });
    } catch (e) {
      console.warn('arise:', e);
      o.done && o.done();
      return null;
    }
  }

  return { boss, bossGate, spot, arise, auto: Fx24.auto, CH24, SH24 };
})();
