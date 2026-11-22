'use strict';

window.Brief = (() => {
  const { clamp, seg, ease, env, hash, lerp, n1, plot, lang } = Fx24.u;
  const W = 800,
    H = 450,
    DUR = 15;
  const CUES = [
    [0.3, 3.9],
    [4.1, 8.0],
    [8.2, 11.7],
    [11.9, 15.01],
  ];
  const f1 = (v) => {
    const r = Math.round(v * 10) / 10;
    return (Math.abs(r - Math.round(r)) < 1e-9 ? String(Math.round(r)) : r.toFixed(1)).replace('-', '−');
  };

  const SUB = {
    0: {
      id: ['Gerbang: sang Hunter bersiap melempar belati ke kristal target.', 'Atur sudut dan kekuatan. Lintasan lemparan membentuk lengkung parabola.', 'Belati melesat, mencapai titik tertinggi, lalu menghantam kristal.', 'Kristal pecah menjadi portal menuju Rank E. Setiap lemparan adalah parabola.'],
      en: ['The Gate: the Hunter readies a dagger to hit the target crystal.', 'Set the angle and power. The throw traces a parabola-shaped arc.', 'The dagger flies, reaches its highest point, then strikes the crystal.', 'The crystal bursts into a portal to Rank E. Every throw is a parabola.'],
      ja: ['ゲート：ハンターが短剣を構え、標的のクリスタルを狙う。', '角度と力を決める。投げた軌道は放物線を描く。', '短剣は最高点に達し、クリスタルに命中する。', 'クリスタルはランクEへのポータルに。どの投てきも放物線だ。'],
      ko: ['게이트: 헌터가 단검을 들고 목표 수정을 노린다.', '각도와 힘을 정한다. 던진 궤적은 포물선을 그린다.', '단검이 날아 최고점에 닿고 수정을 명중한다.', '수정이 랭크 E로 가는 포털이 된다. 모든 투척은 포물선이다.'],
    },
    E: {
      id: ['Rank E: Vertex Form. Setiap parabola punya satu titik pusat, yaitu puncaknya.', 'Rumus y = a(x − h)² + k. Portal koordinat (h, k) menandai posisi puncak.', 'Geser h: portal bergerak kiri-kanan. Geser k: portal naik-turun.', 'Garis aura sumbu simetri x = h membelah parabola menjadi dua sisi kembar.'],
      en: ['Rank E: Vertex Form. Every parabola has one center point, its vertex.', 'The formula y = a(x − h)² + k. The coordinate portal (h, k) marks the vertex.', 'Change h: the portal slides left or right. Change k: it moves up or down.', 'The aura line of symmetry x = h splits the parabola into twin halves.'],
      ja: ['ランクE：頂点形式。どの放物線にも中心点、頂点がある。', '式は y = a(x − h)² + k。座標ポータル (h, k) が頂点を示す。', 'h を動かすと左右に、k を動かすと上下にポータルが動く。', 'オーラの線、対称軸 x = h が放物線を左右の双子に分ける。'],
      ko: ['랭크 E: 꼭짓점 형태. 모든 포물선에는 중심점, 꼭짓점이 있다.', '식은 y = a(x − h)² + k. 좌표 포털 (h, k)가 꼭짓점을 나타낸다.', 'h를 바꾸면 포털이 좌우로, k를 바꾸면 상하로 움직인다.', '오라 선, 대칭축 x = h가 포물선을 쌍둥이 두 쪽으로 나눈다.'],
    },
    D: {
      id: ['Rank D: Grafik dan arah bukaan (concavity).', 'Jika a > 0 kurva terbuka ke atas. Energi turun di sisi kiri, naik di sisi kanan.', 'Ubah a menjadi negatif: kurva terbuka ke bawah dan arus energi berbalik.', 'a > 0: titik puncak adalah minimum. a < 0: titik puncak adalah maksimum.'],
      en: ['Rank D: Graphs and concavity.', 'If a > 0 the curve opens upward. Energy falls on the left and rises on the right.', 'Make a negative: the curve opens downward and the energy flow reverses.', 'a > 0: the vertex is a minimum. a < 0: the vertex is a maximum.'],
      ja: ['ランクD：グラフと開く向き（凹凸）。', 'a > 0 なら上に開く。エネルギーは左で下り、右で上る。', 'a を負にすると下に開き、エネルギーの流れが逆になる。', 'a > 0：頂点は最小値。a < 0：頂点は最大値。'],
      ko: ['랭크 D: 그래프와 열리는 방향(볼록성).', 'a > 0이면 위로 열린다. 에너지는 왼쪽에서 내려가고 오른쪽에서 올라간다.', 'a를 음수로 바꾸면 아래로 열리고 에너지 흐름이 뒤집힌다.', 'a > 0: 꼭짓점은 최솟값. a < 0: 꼭짓점은 최댓값.'],
    },
    C: {
      id: ['Rank C: Bentuk Standar y = ax² + bx + c. Kristal mana mulai tumbuh.', 'Koefisien c menentukan titik potong sumbu-y di (0, c). Kristal tumbuh di sana.', 'Ubah b: parabola bergeser, sumbu simetri x = −b/2a, tetapi (0, c) tetap.', 'Koefisien a makin besar membuat parabola makin sempit.'],
      en: ['Rank C: Standard Form y = ax² + bx + c. The mana crystal starts to grow.', 'The coefficient c sets the y-intercept at (0, c). The crystal grows there.', 'Change b: the parabola shifts, axis x = −b/2a, but (0, c) stays.', 'A larger a makes the parabola narrower.'],
      ja: ['ランクC：標準形 y = ax² + bx + c。マナのクリスタルが育ち始める。', '係数 c が y切片 (0, c) を決める。クリスタルはそこで育つ。', 'b を変えると放物線が動く。対称軸は x = −b/2a、(0, c) は動かない。', 'a が大きいほど放物線は細くなる。'],
      ko: ['랭크 C: 표준형 y = ax² + bx + c. 마나 수정이 자라기 시작한다.', '계수 c가 y절편 (0, c)을 정한다. 수정은 그곳에서 자란다.', 'b를 바꾸면 포물선이 이동하고 대칭축은 x = −b/2a, (0, c)는 그대로다.', 'a가 클수록 포물선은 좁아진다.'],
    },
    B: {
      id: ['Rank B: Bentuk Faktor y = a(x − r₁)(x − r₂). Pilar pertama muncul di (r₁, 0).', 'Pilar kedua muncul di (r₂, 0). Keduanya adalah akar, titik potong sumbu-x.', 'Cahaya menyatu dari dua pilar membentuk jembatan parabola. Puncaknya tepat di tengah.', 'Ubah akarnya, jembatan ikut bergeser. Faktor menentukan akar.'],
      en: ['Rank B: Factored Form y = a(x − r₁)(x − r₂). The first pillar rises at (r₁, 0).', 'The second pillar rises at (r₂, 0). They are the roots, the x-intercepts.', 'Light from both pillars merges into a parabolic bridge. Its peak sits exactly in the middle.', 'Change the roots and the bridge shifts. The factors decide the roots.'],
      ja: ['ランクB：因数分解形 y = a(x − r₁)(x − r₂)。最初の柱が (r₁, 0) に立つ。', '二本目の柱が (r₂, 0) に立つ。これらが解、x切片だ。', '二本の柱の光が合わさり、放物線の橋になる。頂点はちょうど中央。', '解を変えると橋も動く。因数が解を決める。'],
      ko: ['랭크 B: 인수분해형 y = a(x − r₁)(x − r₂). 첫 기둥이 (r₁, 0)에 솟는다.', '두 번째 기둥이 (r₂, 0)에 솟는다. 둘은 근, 즉 x절편이다.', '두 기둥의 빛이 합쳐져 포물선 다리가 된다. 꼭짓점은 정확히 가운데다.', '근을 바꾸면 다리도 움직인다. 인수가 근을 정한다.'],
    },
    AS: {
      id: ['Rank A dan S: radar mendeteksi diskriminan D = b² − 4ac.', 'D > 0: parabola memotong sumbu-x di dua titik. Radar menangkap dua sinyal.', 'D = 0: parabola hanya menyentuh sumbu-x. D < 0: tidak ada titik potong.', 'Tiga kondisi terbaca. Segel Shadow Monarch terbuka bagi yang menguasainya.'],
      en: ['Rank A and S: the radar detects the discriminant D = b² − 4ac.', 'D > 0: the parabola crosses the x-axis at two points. The radar catches two signals.', 'D = 0: it only touches the x-axis. D < 0: no x-intercepts at all.', 'Three conditions read. The Shadow Monarch seal opens for those who master them.'],
      ja: ['ランクA・S：レーダーが判別式 D = b² − 4ac を検知する。', 'D > 0：放物線は x軸と2点で交わる。レーダーは2つの信号を捉える。', 'D = 0：x軸に接するだけ。D < 0：x切片はない。', '三つの条件を読み解いた。極めた者にシャドウモナークの封印が開く。'],
      ko: ['랭크 A·S: 레이더가 판별식 D = b² − 4ac를 감지한다.', 'D > 0: 포물선이 x축과 두 점에서 만난다. 레이더가 신호 두 개를 잡는다.', 'D = 0: x축에 접할 뿐이다. D < 0: x절편이 없다.', '세 조건을 읽어냈다. 통달한 자에게 섀도 모나크의 봉인이 열린다.'],
    },
  };
  const CHIP = {
    0: { id: 'GERBANG · Lintasan Belati', en: 'GATE · Dagger Path', ja: 'ゲート · 短剣の軌道', ko: '게이트 · 단검 궤적' },
    E: { id: 'RANK E · Vertex Form', en: 'RANK E · Vertex Form', ja: 'ランクE · 頂点形式', ko: '랭크 E · 꼭짓점 형태' },
    D: { id: 'RANK D · Grafik & Concavity', en: 'RANK D · Graph & Concavity', ja: 'ランクD · グラフと凹凸', ko: '랭크 D · 그래프와 볼록성' },
    C: { id: 'RANK C · Bentuk Standar', en: 'RANK C · Standard Form', ja: 'ランクC · 標準形', ko: '랭크 C · 표준형' },
    B: { id: 'RANK B · Bentuk Faktor', en: 'RANK B · Factored Form', ja: 'ランクB · 因数分解形', ko: '랭크 B · 인수분해형' },
    A: { id: 'RANK A · Integrasi & Diskriminan', en: 'RANK A · Integration & Discriminant', ja: 'ランクA · 統合と判別式', ko: '랭크 A · 통합과 판별식' },
    S: { id: 'RANK S · Integrasi & Diskriminan', en: 'RANK S · Integration & Discriminant', ja: 'ランクS · 統合と判別式', ko: '랭크 S · 통합과 판별식' },
  };
  const UI = {
    id: { region: 'Gate Briefing Motion Graphic', poster: 'Putar Gate Briefing', sub: 'Motion graphic 15 detik', play: 'Putar', pause: 'Jeda', replay: 'Ulangi', sfxOn: 'SFX: ON', sfxOff: 'SFX: OFF', next: 'Lanjut ke langkah berikutnya', title: 'Gate Briefing' },
    en: { region: 'Gate Briefing Motion Graphic', poster: 'Play Gate Briefing', sub: '15-second motion graphic', play: 'Play', pause: 'Pause', replay: 'Replay', sfxOn: 'SFX: ON', sfxOff: 'SFX: OFF', next: 'Continue to the next step', title: 'Gate Briefing' },
    ja: { region: 'ゲートブリーフィング モーショングラフィック', poster: 'ゲートブリーフィングを再生', sub: '15秒のモーショングラフィック', play: '再生', pause: '一時停止', replay: 'もう一度', sfxOn: 'SFX: ON', sfxOff: 'SFX: OFF', next: '次のステップへ', title: 'ゲートブリーフィング' },
    ko: { region: '게이트 브리핑 모션 그래픽', poster: '게이트 브리핑 재생', sub: '15초 모션 그래픽', play: '재생', pause: '일시정지', replay: '다시 재생', sfxOn: 'SFX: ON', sfxOff: 'SFX: OFF', next: '다음 단계로', title: '게이트 브리핑' },
  };
  const U = () => UI[lang()] || UI.id;
  const key = (c) => (c === 'A' || c === 'S' ? 'AS' : String(c));
  const has = (c) => ['0', 'E', 'D', 'C', 'B', 'A', 'S'].includes(String(c));

  const bg = (t) => {
    let s = '<rect width="800" height="450" fill="#04051a"/>';
    for (let i = 0; i < 26; i++) s += `<circle cx="${n1(hash(i) * 800)}" cy="${n1(hash(i + 50) * 450)}" r="${n1(0.8 + hash(i + 9) * 1.2)}" fill="#9ff3ff" opacity="${n1(0.15 + 0.25 * Math.abs(Math.sin(t * 0.8 + i)))}"/>`;
    return s;
  };
  const txt = (x, y, str, fill, size, anchor = 'middle', op = 1, extra = '') => (op > 0.01 ? `<text x="${n1(x)}" y="${n1(y)}" text-anchor="${anchor}" fill="${fill}" font-size="${size}" font-weight="700" opacity="${n1(op * 100) / 100}" ${extra}>${str}</text>` : '');
  const grid = (pl, op = 1) => `<path d="${pl.grid()}" stroke="#4d8bff" stroke-width="1" opacity="${n1(0.17 * op * 100) / 100}" fill="none"/><path d="${pl.axes()}" stroke="#8e9ad0" stroke-width="2" opacity="${n1(0.85 * op * 100) / 100}" fill="none"/>`;
  const curve = (pl, f, col, dr, w = 4, P) => `<path d="${pl.path(f)}" fill="none" stroke="#9a5aff" stroke-width="${w + 7}" opacity=".25" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${n1((1 - dr) * 1000) / 1000}"/><path d="${pl.path(f)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${n1((1 - dr) * 1000) / 1000}"/>`;
  const orb = (x, y, r, col, g, t) => `<g transform="translate(${n1(x)} ${n1(y)})" filter="url(#${g})"><circle r="${r}" fill="${col}"/><circle r="${r * 2}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="6 6" transform="rotate(${n1(t * 90)})" opacity=".8"/></g>`;
  const portal = (x, y, s, t, g) => `<g transform="translate(${n1(x)} ${n1(y)}) scale(${n1(s * 100) / 100})" fill="none" filter="url(#${g})"><ellipse rx="14" ry="22" stroke="#fff" stroke-width="3"/><ellipse rx="26" ry="34" stroke="#9a5aff" stroke-width="3" stroke-dasharray="12 8" transform="rotate(${n1(t * 60)})"/><circle r="5" fill="#9ff3ff"/></g>`;
  const pillar = (x, yb, h, col, g, op = 1) => `<g opacity="${n1(op * 100) / 100}" filter="url(#${g})"><rect x="${n1(x - 11)}" y="${n1(yb - h)}" width="22" height="${n1(Math.max(0, h))}" rx="4" fill="rgba(10,16,60,.85)" stroke="${col}" stroke-width="3"/><path d="M${n1(x - 11)} ${n1(yb - h + 12)}h22" stroke="${col}" stroke-width="2" opacity=".7"/><rect x="${n1(x - 17)}" y="${n1(yb - h - 8)}" width="34" height="10" rx="3" fill="${col}"/></g>`;

  const scene0 = () => {
    const x0 = 160,
      y0 = 335,
      x1 = 672,
      y1 = 232,
      HH = 165;
    const at = (u) => [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u - 4 * HH * u * (1 - u)];
    const path = (a, b) => {
      let d = '';
      for (let i = 0; i <= 40; i++) {
        const u = lerp(a, b, i / 40),
          p = at(u);
        d += (i ? 'L' : 'M') + n1(p[0]) + ' ' + n1(p[1]);
      }
      return d;
    };
    const crystal = (x, y, s, g, o = 1) => `<g transform="translate(${n1(x)} ${n1(y)}) scale(${n1(s * 100) / 100})" opacity="${n1(o)}" filter="url(#${g})"><path d="M0-34L20-8L12 28H-12L-20-8Z" fill="rgba(94,230,242,.35)" stroke="#5ee6f2" stroke-width="3"/><path d="M0-34L0 28M-20-8H20" stroke="#fff" stroke-width="1.5" opacity=".6"/></g>`;
    const HIT = 10.55,
      FLY = [8.2, 10.55];
    return {
      W,
      H,
      dur: DUR,
      poster: 9.4,
      defs: '',
      back(t, P) {
        let s = bg(t);

        s += `<path d="M0 392H800" stroke="#2a3a80" stroke-width="3"/><path d="M0 392H800" stroke="#5ee6f2" stroke-width="1" opacity=".4"/>`;
        s += `<path d="M330 392V210A70 70 0 0 1 470 210V392" fill="none" stroke="#9a5aff" stroke-width="3" opacity=".25"/>`;

        const arm = t < FLY[0] ? 0 : ease(seg(t, FLY[0], FLY[0] + 0.25)) * (1 - ease(seg(t, FLY[0] + 0.3, FLY[0] + 0.7)));
        s += `<g transform="translate(115 392)" stroke="#c9a7ff" stroke-width="4" stroke-linecap="round" fill="none" filter="url(#${P.g})"><circle cy="-62" r="10" fill="#0a0f33"/><path d="M0-52V-24M0-24L-12 0M0-24L12 0"/><path d="M-6-50Q-18-34-14-18" opacity=".7"/><path d="M0-46L${n1(26 + 14 * arm)} ${n1(-52 - 22 * arm)}"/></g>`;
        s += txt(115, 424, 'HUNTER', '#9aa6e8', 15, 'middle', ease(seg(t, 0.6, 1.2)));

        const bob = Math.sin(t * 2.2) * 5;
        if (t < HIT) s += crystal(x1, y1 + bob, 1.5 + 0.1 * Math.sin(t * 3), P.g, ease(seg(t, 0.3, 1.2)));
        else {
          const k = seg(t, HIT, HIT + 1.3);
          for (let i = 0; i < 7; i++) {
            const a = (i / 7) * 6.283 + 0.4,
              d = 160 * ease(k);
            s += `<path d="M0-12L8 6H-8Z" transform="translate(${n1(x1 + Math.cos(a) * d)} ${n1(y1 + Math.sin(a) * d + 90 * k * k)}) rotate(${n1(i * 50 + k * 300)}) scale(1.6)" fill="#5ee6f2" opacity="${n1(1 - k)}"/>`;
          }

          const pk = ease(seg(t, 12.0, 13.4));
          if (pk > 0.01) s += portal(x1, y1 + 20, 2.2 * pk, t, P.g) + txt(x1, y1 + 96, 'RANK E', '#ffd86b', 24, 'middle', pk, `font-family="Orbitron,sans-serif" font-weight="800"`);
        }

        const aim = env(t, 4.1, 5.0, 8.0, 8.4);
        if (aim > 0.01) s += `<path d="${path(0, 1)}" fill="none" stroke="#ffd86b" stroke-width="3" stroke-dasharray="8 9" opacity="${n1(aim * (0.55 + 0.25 * Math.sin(t * 6)) * 100) / 100}"/>`;

        const sl = env(t, 4.3, 5.0, 8.0, 8.5);
        if (sl > 0.01) {
          const a = 0.45 + 0.35 * ease(seg(t, 5.0, 7.0)),
            b = 0.5 + 0.3 * Math.sin(seg(t, 5, 7.5) * 3.1);
          s += `<g opacity="${n1(sl)}" font-size="17" font-weight="700">${txt(90, 78, 'SUDUT / ANGLE', '#9aa6e8', 15, 'start')}<rect x="90" y="86" width="200" height="12" rx="6" fill="rgba(10,16,60,.9)" stroke="#2a3a80"/><rect x="90" y="86" width="${n1(200 * a)}" height="12" rx="6" fill="#5ee6f2"/>${txt(90, 126, 'POWER', '#9aa6e8', 15, 'start')}<rect x="90" y="134" width="200" height="12" rx="6" fill="rgba(10,16,60,.9)" stroke="#2a3a80"/><rect x="90" y="134" width="${n1(200 * b)}" height="12" rx="6" fill="#f472a8"/></g>`;
        }

        if (t >= FLY[0]) {
          const u = ease(seg(t, FLY[0], FLY[1])),
            p = at(u),
            q = at(Math.max(0, u - 0.02)),
            ang = (Math.atan2(p[1] - q[1], p[0] - q[0]) * 180) / Math.PI;
          s += `<path d="${path(0, u)}" fill="none" stroke="#9a5aff" stroke-width="9" opacity=".3" stroke-linecap="round"/><path d="${path(0, u)}" fill="none" stroke="#5ee6f2" stroke-width="3.6" stroke-linecap="round"/>`;
          if (t < HIT) s += `<g transform="translate(${n1(p[0])} ${n1(p[1])}) rotate(${n1(ang)})" filter="url(#${P.g})"><path d="M-18 0L8-4L20 0L8 4Z" fill="#e8fbff" stroke="#5ee6f2" stroke-width="1.5"/><path d="M-18-5V5" stroke="#ffd86b" stroke-width="3.4"/></g>`;

          const ap = at(0.5),
            ak = ease(seg(t, FLY[0] + 1.0, FLY[0] + 1.4));
          if (ak > 0.01) s += `<g transform="translate(${n1(ap[0])} ${n1(ap[1])})" opacity="${n1(ak)}"><circle r="10" fill="#ffd86b" filter="url(#${P.g})"/><circle r="18" fill="none" stroke="#ffd86b" stroke-width="2.4"/></g>` + txt(ap[0], ap[1] - 30, 'PUNCAK / PEAK', '#ffd86b', 19, 'middle', ak * (t > 11.4 ? 1 - ease(seg(t, 11.4, 11.8)) : 1));
        }

        const rp = ease(seg(t, 11.9, 13.0));
        if (rp > 0.01) s += `<path d="${path(0, 1)}" fill="none" stroke="#5ee6f2" stroke-width="3.4" opacity="${n1(0.9 * rp)}"/>` + txt(400, 70, 'y = a(x − h)² + k', '#fff', 30, 'middle', rp, `filter="url(#${P.g})"`);

        const tt = env(t, 0.2, 0.9, 3.3, 3.9);
        s += txt(400, 80, 'RECREATING GRAVITY', '#fff', 36, 'middle', tt, `font-family="Orbitron,sans-serif" font-weight="800" filter="url(#${P.g})"`);

        const hf = env(t, HIT, HIT + 0.04, HIT + 0.04, HIT + 0.4);
        if (hf > 0.01) s += `<circle cx="${x1}" cy="${y1}" r="${n1(30 + 140 * seg(t, HIT, HIT + 0.4))}" fill="#fff" opacity="${n1(hf * 0.8)}"/>` + txt(x1, y1 - 70, 'HIT!', '#ffd86b', 40, 'middle', hf > 0.2 ? 1 : hf * 5, `font-family="Orbitron,sans-serif" font-weight="800"`);
        return s;
      },
      cv(ctx, t) {
        if (t >= HIT && t < HIT + 1.4) {
          for (let i = 0; i < 50; i++) {
            const age = t - HIT,
              a = hash(i) * 6.283,
              v = 80 + hash(i + 9) * 280;
            ctx.globalAlpha = Math.max(0, 1 - age / 1.4);
            ctx.fillStyle = i % 2 ? '#5ee6f2' : '#fff';
            ctx.fillRect(x1 + Math.cos(a) * v * age, y1 + Math.sin(a) * v * age + 120 * age * age, 4, 4);
          }
        }
        if (t >= FLY[0] && t < HIT)
          for (let i = 0; i < 14; i++) {
            const u = clamp(ease(seg(t, FLY[0], FLY[1])) - i * 0.012),
              p = at(u);
            ctx.globalAlpha = 0.7 * (1 - i / 14);
            ctx.fillStyle = '#9ff3ff';
            ctx.fillRect(p[0] - 2 + (hash(i + t * 10) - 0.5) * 6, p[1] - 2 + (hash(i + 5 + t * 10) - 0.5) * 6, 3, 3);
          }
        ctx.globalAlpha = 1;
      },
      ev: [
        [0.3, (S, b) => S.sys(b)],
        [4.2, (S, b) => S.ping(b, 1000)],
        [6.6, (S, b) => S.tick(b, 900)],
        [8.2, (S, b) => S.whoosh(b)],
        [9.7, (S, b) => S.ping(b, 1500)],
        [HIT, (S, b) => (S.hit(b), S.shatter(b))],
        [12.0, (S, b) => S.charge(b)],
        [13.3, (S, b) => S.chime(b, 1046)],
      ],
    };
  };

  const sceneE = () => {
    const pl = plot({ x: [-6, 6], y: [-2, 8], l: 50, t: 70, w: 700, h: 330 }),
      A = 0.5;
    const prm = (t) => ({ h: 3 * ease(seg(t, 2.4, 5.4)), k: 2 * ease(seg(t, 5.6, 8.0)) });
    return {
      W,
      H,
      dur: DUR,
      poster: 12.5,
      back(t, P) {
        const { h, k } = prm(t),
          f = (x) => A * (x - h) ** 2 + k;
        let s = bg(t) + grid(pl, ease(seg(t, 0, 0.8)));
        s += curve(pl, f, '#5ee6f2', ease(seg(t, 0.4, 2.0)), 4);

        s += txt(400, 46, `y = ${A}(x − <tspan fill="#5ee6f2">${f1(h)}</tspan>)² + <tspan fill="#ffd86b">${f1(k)}</tspan>`, '#fff', 30, 'middle', ease(seg(t, 1.0, 1.6)));

        const ax = ease(seg(t, 2.4, 3.2)),
          pul = 0.6 + 0.4 * Math.sin(t * 6),
          aura = env(t, 8.2, 9.0, 11.4, 12.0);
        if (ax > 0.01) {
          s += `<path d="M${pl.X(h)} ${pl.Y(-2)}V${pl.Y(8)}" stroke="#ffd86b" stroke-width="${n1(3 + 16 * aura * pul)}" opacity="${n1(0.12 * ax + 0.28 * aura * pul)}"/><path d="M${pl.X(h)} ${pl.Y(-2)}V${pl.Y(8)}" stroke="#ffd86b" stroke-width="2.5" stroke-dasharray="9 8" opacity="${n1(ax)}"/>`;
          s += txt(pl.X(h) + 10, pl.Y(7.3), `x = ${f1(h)}`, '#ffd86b', 24, 'start', ax);
        }

        if (t > 8.2 && t < 12.0) {
          for (let i = 0; i < 3; i++) {
            const d = 0.8 + ((t * 0.5 + i / 3) % 1) * 3.2,
              y = f(h + d),
              o = aura * (1 - (d - 0.8) / 4);
            if (y > 8) continue;
            s += `<path d="M${pl.X(h - d)} ${pl.Y(y)}H${pl.X(h + d)}" stroke="#f472a8" stroke-width="2" stroke-dasharray="4 5" opacity="${n1(o * 0.8)}"/><circle cx="${pl.X(h - d)}" cy="${pl.Y(y)}" r="6" fill="#f472a8" opacity="${n1(o)}"/><circle cx="${pl.X(h + d)}" cy="${pl.Y(y)}" r="6" fill="#f472a8" opacity="${n1(o)}"/>`;
          }
        }

        const pp = ease(seg(t, 0.9, 1.6));
        s += portal(pl.X(h), pl.Y(k), 1.1 * pp, t, P.g);
        s += txt(pl.X(h) + 38, pl.Y(k) + 8, `(h, k) = (${f1(h)}, ${f1(k)})`, '#fff', 22, 'start', pp);

        const dh = env(t, 2.6, 3.0, 5.0, 5.6),
          dk = env(t, 5.8, 6.2, 7.6, 8.2);
        s += txt(pl.X(h / 2 + 0.2), pl.Y(0) + 34, 'h →', '#5ee6f2', 26, 'middle', dh) + txt(pl.X(h) + 40, pl.Y(k / 2) + 4, 'k ↑', '#ffd86b', 26, 'start', dk);

        const fin = ease(seg(t, 12.2, 12.9));
        if (fin > 0.01) s += `<g opacity="${n1(fin)}"><rect x="38" y="316" width="300" height="104" rx="14" fill="rgba(8,10,40,.9)" stroke="#5ee6f2" stroke-width="2.5"/>${txt(60, 356, 'VERTEX = (3, 2)', '#5ee6f2', 26, 'start', 1, `font-family="Orbitron,sans-serif" font-weight="800"`)}${txt(60, 396, 'SUMBU / AXIS  x = 3', '#ffd86b', 24, 'start')}</g>`;
        return s;
      },
      cv(ctx, t) {
        const { h, k } = prm(t),
          cx = pl.X(h),
          cy = pl.Y(k);
        for (let i = 0; i < 18; i++) {
          const a = t * (1 + hash(i) * 1.2) + i * 0.8,
            r = 26 + hash(i + 2) * 30;
          ctx.globalAlpha = 0.5 + 0.4 * Math.sin(t * 5 + i);
          ctx.fillStyle = i % 2 ? '#9ff3ff' : '#c9a7ff';
          ctx.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 1.3, 3, 3);
        }
        ctx.globalAlpha = 1;
      },
      ev: [
        [0.3, (S, b) => S.sys(b)],
        [1.0, (S, b) => S.chime(b, 880)],
        [2.5, (S, b) => S.whoosh(b)],
        [5.7, (S, b) => S.whoosh(b)],
        [8.3, (S, b) => S.charge(b)],
        [9.6, (S, b) => S.ping(b, 1200)],
        [12.2, (S, b) => S.chime(b, 1318)],
      ],
    };
  };

  const sceneD = () => {
    const pl = plot({ x: [-6, 6], y: [-6, 6], l: 50, t: 62, w: 700, h: 340 });
    const av = (t) => lerp(0.3, -0.3, ease(seg(t, 8.3, 10.3)));
    return {
      W,
      H,
      dur: DUR,
      poster: 6.2,
      back(t, P) {
        const a = av(t),
          f = (x) => a * x * x;
        let s = bg(t) + grid(pl, ease(seg(t, 0, 0.8)));
        s += curve(pl, f, a >= 0 ? '#5ee6f2' : '#f472a8', ease(seg(t, 0.4, 2.0)), 4);
        s += txt(400, 44, `y = <tspan fill="${a >= 0 ? '#5ee6f2' : '#f472a8'}">${f1(Math.round(a * 100) / 100 * 10 / 10)}</tspan>x²`.replace(/(\d)\.(\d)(\d*)</, '$1.$2<'), '#fff', 30, 'middle', ease(seg(t, 1.0, 1.6)));

        s += `<circle cx="${pl.X(0)}" cy="${pl.Y(0)}" r="9" fill="#ffd86b" filter="url(#${P.g})" opacity="${n1(ease(seg(t, 1.6, 2.2)))}"/>`;

        const fl = ease(seg(t, 4.1, 4.9)) * (1 - ease(seg(t, 14.2, 14.9)) * 0);
        if (fl > 0.01) {
          for (let i = 0; i < 12; i++) {
            const x = -5.2 + ((t * 0.55 + i / 12 * 10.4) % 10.4),
              sl = 2 * a * x,
              px = pl.X(x),
              py = pl.Y(f(x));
            if (py < 70 || py > 400) continue;
            const ang = (Math.atan2(-sl * pl.sy, pl.sx) * 180) / Math.PI * -1,
              up = sl < -0.02 ? 1 : sl > 0.02 ? -1 : 0,
              col = Math.abs(sl) < 0.04 ? '#ffd86b' : (a > 0 ? sl > 0 : sl < 0) ? '#4cc38a' : '#f472a8';

            const c2 = sl > 0.04 ? '#4cc38a' : sl < -0.04 ? '#f472a8' : '#ffd86b';
            s += `<g transform="translate(${px} ${py}) rotate(${n1((Math.atan2(-sl * pl.sy, pl.sx) * 180) / Math.PI)})" opacity="${n1(fl * 0.95)}" filter="url(#${P.g})"><path d="M-9-8L4 0L-9 8" fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M-1-8L12 0L-1 8" fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/></g>`;
          }
          const gl = a >= 0;
          s += txt(pl.X(-4.4), pl.Y(gl ? 3.4 : -2.0), (gl ? 'TURUN ↘ ' : 'NAIK ↗ ') + '(−∞, 0)', gl ? '#f472a8' : '#4cc38a', 21, 'middle', fl * (Math.abs(a) > 0.12 ? 1 : 0.3));
          s += txt(pl.X(4.4), pl.Y(gl ? 3.4 : -2.0), (gl ? 'NAIK ↗ ' : 'TURUN ↘ ') + '(0, ∞)', gl ? '#4cc38a' : '#f472a8', 21, 'middle', fl * (Math.abs(a) > 0.12 ? 1 : 0.3));
        }

        const up = env(t, 1.8, 2.4, 7.6, 8.3),
          dn = env(t, 10.0, 10.6, 14.9, 15.1);
        s += txt(400, 84, 'a > 0 · BUKA ATAS / OPENS UP', '#5ee6f2', 24, 'middle', up, `font-family="Orbitron,sans-serif" font-weight="800"`);
        s += txt(400, 84, 'a < 0 · BUKA BAWAH / OPENS DOWN', '#f472a8', 24, 'middle', dn * (t > 11.9 ? 1 - ease(seg(t, 11.9, 12.4)) : 1), `font-family="Orbitron,sans-serif" font-weight="800"`);

        const mn = env(t, 6.0, 6.6, 8.0, 8.4),
          mx = env(t, 10.6, 11.2, 14.9, 15.1);
        s += txt(pl.X(0) + 20, pl.Y(0) + 40, 'MINIMUM', '#ffd86b', 22, 'start', mn) + txt(pl.X(0) + 20, pl.Y(0) - 22, 'MAKSIMUM / MAXIMUM', '#ffd86b', 22, 'start', mx);

        const fin = ease(seg(t, 12.2, 12.9));
        if (fin > 0.01) {
          const card = (x, col, up, label) => `<g transform="translate(${x} 316)"><rect width="320" height="106" rx="14" fill="rgba(8,10,40,.92)" stroke="${col}" stroke-width="2.5"/><path d="${up ? 'M32 78Q80 6 128 78' : 'M32 28Q80 100 128 28'}" fill="none" stroke="${col}" stroke-width="4"/><text x="150" y="54" fill="${col}" font-size="26" font-weight="800" font-family="Orbitron,sans-serif">${label}</text><text x="150" y="86" fill="#fff" font-size="19" font-weight="700">${up ? 'MIN · ↘ lalu ↗' : 'MAX · ↗ lalu ↘'}</text></g>`;
          s += `<g opacity="${n1(fin)}">${card(60, '#5ee6f2', true, 'a > 0')}${card(420, '#f472a8', false, 'a < 0')}</g>`;
        }
        return s;
      },
      cv(ctx, t) {

        const a = av(t);
        if (t < 4.2) return;
        for (let i = 0; i < 26; i++) {
          const x = -5.5 + ((t * 0.4 + hash(i) * 10) % 11),
            y = a * x * x;
          ctx.globalAlpha = 0.45;
          ctx.fillStyle = '#fff';
          ctx.fillRect(pl.X(x) + (hash(i + t) - 0.5) * 14, pl.Y(y) + (hash(i + 3 + t) - 0.5) * 14, 2.5, 2.5);
        }
        ctx.globalAlpha = 1;
      },
      ev: [
        [0.3, (S, b) => S.sys(b)],
        [1.7, (S, b) => S.chime(b, 784)],
        [4.2, (S, b) => S.charge(b)],
        [8.4, (S, b) => S.whoosh(b)],
        [10.3, (S, b) => S.thud(b)],
        [12.2, (S, b) => S.chime(b, 1175)],
      ],
    };
  };

  const sceneC = () => {
    const pl = plot({ x: [-5, 5], y: [-3, 9], l: 50, t: 62, w: 700, h: 340 });
    const prm = (t) => ({ a: lerp(0.5, 1, ease(seg(t, 12.0, 14.0))), b: lerp(0, -2, ease(seg(t, 8.3, 10.8))), c: 3 * ease(seg(t, 4.2, 6.8)) });
    return {
      W,
      H,
      dur: DUR,
      poster: 13,
      back(t, P) {
        const { a, b, c } = prm(t),
          f = (x) => a * x * x + b * x + c,
          vx = -b / (2 * a);
        let s = bg(t) + grid(pl, ease(seg(t, 0, 0.8)));
        s += curve(pl, f, '#5ee6f2', ease(seg(t, 0.4, 2.0)), 4);
        s += txt(400, 46, `y = <tspan fill="#f472a8">${f1(a)}</tspan>x² + <tspan fill="#5ee6f2">${f1(b)}</tspan>x + <tspan fill="#ffd86b">${f1(c)}</tspan>`, '#fff', 30, 'middle', ease(seg(t, 1.0, 1.6)));

        const ax = ease(seg(t, 8.5, 9.4));
        if (ax > 0.01) s += `<path d="M${pl.X(vx)} ${pl.Y(-3)}V${pl.Y(9)}" stroke="#ffd86b" stroke-width="2.5" stroke-dasharray="9 8" opacity="${n1(ax)}"/>` + txt(pl.X(vx) + 10, pl.Y(8.4), `x = −b/2a = ${f1(vx)}`, '#ffd86b', 21, 'start', ax);

        const cr = 0.5 + 0.34 * c + 0.1 * Math.sin(t * 3),
          cx = pl.X(0),
          cy = pl.Y(c),
          ap = ease(seg(t, 1.2, 2.0));
        s += `<g transform="translate(${cx} ${n1(cy)}) scale(${n1(cr * ap * 100) / 100})" filter="url(#${P.g2})"><path d="M0-38L22-8L14 18H-14L-22-8Z" fill="rgba(255,216,107,.35)" stroke="#ffd86b" stroke-width="3"/><path d="M0-38V18M-22-8H22" stroke="#fff" stroke-width="1.6" opacity=".6"/></g>`;

        if (c > 0.05) s += `<path d="M${cx} ${pl.Y(0)}V${n1(cy)}" stroke="#ffd86b" stroke-width="5" opacity=".55" stroke-linecap="round" stroke-dasharray="3 9"/>`;
        const yl = ease(seg(t, 4.3, 5.0));
        s += txt(cx + 34, cy + (c > 1 ? 4 : -14), `(0, c) = (0, ${f1(c)})`, '#ffd86b', 23, 'start', yl);

        const vp = ease(seg(t, 8.3, 9.0));
        s += `<circle cx="${pl.X(vx)}" cy="${pl.Y(f(vx))}" r="7" fill="#f472a8" filter="url(#${P.g})" opacity="${n1(vp)}"/>`;

        const hc = env(t, 4.3, 4.8, 7.8, 8.2),
          hb = env(t, 8.5, 9.0, 11.6, 12.0),
          ha = env(t, 12.2, 12.7, 14.9, 15.1);
        s += txt(560, 124, 'c ↑ → titik potong-y naik / y-intercept rises', '#ffd86b', 20, 'middle', hc) + txt(560, 124, 'b → parabola bergeser / shifts', '#5ee6f2', 20, 'middle', hb) + txt(560, 124, 'a ↑ → makin sempit / narrower', '#f472a8', 20, 'middle', ha);

        const fin = ease(seg(t, 13.6, 14.2));
        if (fin > 0.01) s += `<g opacity="${n1(fin)}"><rect x="430" y="316" width="320" height="100" rx="14" fill="rgba(8,10,40,.92)" stroke="#ffd86b" stroke-width="2.5"/>${txt(452, 356, 'y-intercept = (0, 3)', '#ffd86b', 25, 'start', 1, `font-family="Orbitron,sans-serif" font-weight="800"`)}${txt(452, 392, 'y = x² − 2x + 3', '#fff', 23, 'start')}</g>`;
        return s;
      },
      cv(ctx, t) {
        const { c } = prm(t),
          cx = pl.X(0),
          cy = pl.Y(c);
        for (let i = 0; i < 20; i++) {
          const p = (t * 0.6 + hash(i)) % 1;
          ctx.globalAlpha = Math.sin(p * Math.PI) * 0.8;
          ctx.fillStyle = i % 2 ? '#ffd86b' : '#fff';
          ctx.fillRect(cx + (hash(i + 3) - 0.5) * 60, cy - 10 - p * 70, 3, 3);
        }
        ctx.globalAlpha = 1;
      },
      ev: [
        [0.3, (S, b) => S.sys(b)],
        [1.3, (S, b) => S.chime(b, 880)],
        [4.3, (S, b) => S.charge(b)],
        [6.8, (S, b) => S.coin(b)],
        [8.4, (S, b) => S.whoosh(b)],
        [12.1, (S, b) => S.whoosh(b)],
        [13.8, (S, b) => S.chime(b, 1318)],
      ],
    };
  };

  const sceneB = () => {
    const pl = plot({ x: [-6, 6], y: [-2, 8], l: 50, t: 62, w: 700, h: 340 }),
      A = -0.5;
    const rt = (t) => {
      const k = ease(seg(t, 12.0, 13.6));
      return { r1: lerp(-3, -4, k), r2: lerp(3, 2, k) };
    };
    return {
      W,
      H,
      dur: DUR,
      poster: 8.5,
      back(t, P) {
        const { r1, r2 } = rt(t),
          f = (x) => A * (x - r1) * (x - r2),
          mid = (r1 + r2) / 2;
        let s = bg(t) + grid(pl, ease(seg(t, 0, 0.8)));
        const p1 = ease(seg(t, 0.6, 2.4)),
          p2 = ease(seg(t, 2.6, 4.0)),
          py = pl.Y(0),
          hPix = 120;
        s += pillar(pl.X(r1), py, hPix * p1, '#5ee6f2', P.g, p1 > 0 ? 1 : 0) + pillar(pl.X(r2), py, hPix * p2, '#f472a8', P.g, p2 > 0 ? 1 : 0);
        s += txt(pl.X(r1), py + 36, 'r₁', '#5ee6f2', 26, 'middle', p1) + txt(pl.X(r2), py + 36, 'r₂', '#f472a8', 26, 'middle', p2);
        s += txt(pl.X(r1), py - hPix - 22, `(${f1(r1)}, 0)`, '#5ee6f2', 22, 'middle', p1 * ease(seg(t, 1.8, 2.4))) + txt(pl.X(r2), py - hPix - 22, `(${f1(r2)}, 0)`, '#f472a8', 22, 'middle', p2 * ease(seg(t, 3.4, 4.0)));

        const br = ease(seg(t, 4.3, 7.3)),
          half = (r2 - r1) / 2;
        if (br > 0.01) {
          const d1 = pl.path(f, r1, r1 + half * br, 0.1),
            d2 = pl.path(f, r2 - half * br, r2, 0.1);
          s += `<g fill="none" stroke-linecap="round" filter="url(#${P.g2})"><path d="${d1}" stroke="#ffd86b" stroke-width="6"/><path d="${d2}" stroke="#ffd86b" stroke-width="6"/></g><g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="${d1}"/><path d="${d2}"/></g>`;

          if (br > 0.5) for (let i = 1; i < 8; i++) {
            const x = lerp(r1, r2, i / 8);
            if (Math.abs(x - mid) < half * (1 - br) * 0.9) continue;
            s += `<path d="M${pl.X(x)} ${pl.Y(f(x))}V${py}" stroke="#ffd86b" stroke-width="1.6" opacity="${n1(0.4 * br)}"/>`;
          }
        }

        const ax = ease(seg(t, 8.4, 9.2)),
          vy = f(mid);
        if (ax > 0.01) {
          s += `<path d="M${pl.X(mid)} ${pl.Y(-2)}V${pl.Y(8)}" stroke="#c9a7ff" stroke-width="2.4" stroke-dasharray="9 8" opacity="${n1(ax)}"/><circle cx="${pl.X(mid)}" cy="${pl.Y(vy)}" r="8" fill="#ffd86b" filter="url(#${P.g})" opacity="${n1(ax)}"/>` + txt(pl.X(mid) + 14, pl.Y(vy) - 14, 'x = (r₁ + r₂)/2', '#c9a7ff', 22, 'start', ax);
        }

        const tr = seg(t, 9.0, 11.4);
        if (tr > 0 && tr < 1) {
          const x = lerp(r1, r2, ease(tr));
          s += `<circle cx="${pl.X(x)}" cy="${pl.Y(f(x)) - 14}" r="7" fill="#9ff3ff" filter="url(#${P.g})"/>`;
        }

        s += txt(400, 46, `y = <tspan fill="#ffd86b">${f1(A)}</tspan>(x − <tspan fill="#5ee6f2">${f1(r1)}</tspan>)(x − <tspan fill="#f472a8">${f1(r2)}</tspan>)`.replace(/\(x − (<tspan[^>]*>)−/g, '(x + $1'), '#fff', 30, 'middle', ease(seg(t, 0.6, 1.4)));
        const fin = env(t, 11.9, 12.5, 14.9, 15.1);
        s += txt(400, 128, 'FAKTOR → AKAR / FACTORS → ROOTS', '#ffd86b', 22, 'middle', fin, `font-family="Orbitron,sans-serif" font-weight="800"`);
        return s;
      },
      cv(ctx, t) {
        const { r1, r2 } = rt(t);
        [[r1, '#5ee6f2', 0.6], [r2, '#f472a8', 2.6]].forEach(([r, col, st], j) => {
          if (t < st) return;
          for (let i = 0; i < 12; i++) {
            const p = (t * 0.7 + hash(i + j * 9)) % 1;
            ctx.globalAlpha = Math.sin(p * Math.PI) * 0.8;
            ctx.fillStyle = col;
            ctx.fillRect(pl.X(r) + (hash(i + 3) - 0.5) * 30, pl.Y(0) - p * 150, 3, 3);
          }
        });
        ctx.globalAlpha = 1;
      },
      ev: [
        [0.3, (S, b) => S.sys(b)],
        [0.8, (S, b) => S.thud(b)],
        [2.7, (S, b) => S.thud(b)],
        [4.3, (S, b) => S.charge(b)],
        [7.3, (S, b) => S.chime(b, 1046)],
        [9.0, (S, b) => S.ping(b, 1300)],
        [12.0, (S, b) => S.whoosh(b)],
      ],
    };
  };

  const sceneAS = () => {
    const pl = plot({ x: [-3, 3], y: [-3, 5], l: 430, t: 74, w: 330, h: 290 });
    const cc = (t) => (t < 8.2 ? lerp(0, -2, ease(seg(t, 3.9, 5.2))) : lerp(-2, 2, ease(seg(t, 8.4, 11.2))));
    const RX = 190,
      RY = 236,
      RR = 138;
    return {
      W,
      H,
      dur: DUR,
      poster: 6.5,
      back(t, P) {
        const c = cc(t),
          D = -4 * c,
          f = (x) => x * x + c;
        const col = D > 0.05 ? '#4cc38a' : D < -0.05 ? '#ff7aa8' : '#ffd86b';
        const seal = ease(seg(t, 11.9, 13.2)),
          vis = 1 - 0.78 * seal;
        let s = bg(t);

        s += `<g opacity="${n1(vis * ease(seg(t, 0.2, 1.0)))}"><circle cx="${RX}" cy="${RY}" r="${RR}" fill="rgba(6,22,40,.85)" stroke="${col}" stroke-width="3" filter="url(#${P.g})"/>${[0.66, 0.33].map((k) => `<circle cx="${RX}" cy="${RY}" r="${n1(RR * k)}" fill="none" stroke="${col}" stroke-width="1.6" opacity=".4"/>`).join('')}<path d="M${RX - RR} ${RY}H${RX + RR}M${RX} ${RY - RR}V${RY + RR}" stroke="${col}" stroke-width="1.4" opacity=".35"/>`;
        const sw = t * 3.2;
        s += `<path d="M${RX} ${RY}L${n1(RX + Math.cos(sw) * RR)} ${n1(RY + Math.sin(sw) * RR)}A${RR} ${RR} 0 0 0 ${n1(RX + Math.cos(sw - 0.7) * RR)} ${n1(RY + Math.sin(sw - 0.7) * RR)}Z" fill="${col}" opacity=".28"/><path d="M${RX} ${RY}L${n1(RX + Math.cos(sw) * RR)} ${n1(RY + Math.sin(sw) * RR)}" stroke="${col}" stroke-width="4" filter="url(#${P.g})"/>`;

        const blips = D > 0.05 ? [[-0.55, -0.35], [0.55, -0.35]] : D >= -0.05 ? [[0, -0.3]] : [];
        blips.forEach((b, i) => {
          const ang = Math.atan2(b[1], b[0]),
            diff = ((sw - ang) % 6.283 + 6.283) % 6.283,
            br = Math.max(0.35, 1 - diff / 6.283);
          s += `<circle cx="${n1(RX + b[0] * RR)}" cy="${n1(RY + b[1] * RR)}" r="${n1(7 + 3 * br)}" fill="${col}" opacity="${n1(br)}" filter="url(#${P.g})"/>`;
        });
        if (D < -0.05) s += txt(RX, RY + 8, '∅', col, 56, 'middle', 0.8);
        s += '</g>';

        s += `<g opacity="${n1(vis)}">${grid(pl, ease(seg(t, 0.4, 1.2)))}${curve(pl, f, '#5ee6f2', ease(seg(t, 0.8, 2.2)), 4)}`;
        const xi = Math.sqrt(Math.max(0, -c));
        if (D > 0.05) s += [-xi, xi].map((x) => `<circle cx="${pl.X(x)}" cy="${pl.Y(0)}" r="9" fill="${col}" filter="url(#${P.g})"/>`).join('');
        if (Math.abs(D) <= 0.05) s += `<circle cx="${pl.X(0)}" cy="${pl.Y(0)}" r="10" fill="${col}" filter="url(#${P.g})"/>`;
        s += '</g>';

        s += txt(400, 44, 'D = b² − 4ac', '#fff', 32, 'middle', vis * ease(seg(t, 0.6, 1.4)), `font-family="Orbitron,sans-serif" font-weight="800" filter="url(#${P.g})"`);
        const lab = D > 0.05 ? ['D > 0', '2 titik potong / 2 x-intercepts'] : D >= -0.05 ? ['D = 0', '1 titik singgung / 1 touch point'] : ['D < 0', 'tanpa titik potong / no x-intercepts'];
        if (t > 4.6) s += `<g opacity="${n1(vis * ease(seg(t, 4.6, 5.4)))}"><rect x="446" y="${pl.Y(-2.2)}" width="300" height="62" rx="12" fill="rgba(8,10,40,.9)" stroke="${col}" stroke-width="2.5"/>${txt(596, pl.Y(-2.2) + 28, lab[0], col, 26, 'middle', 1, `font-family="Orbitron,sans-serif" font-weight="800"`)}${txt(596, pl.Y(-2.2) + 52, lab[1], '#fff', 17, 'middle', 1)}</g>`;

        if (seal > 0.01) {
          const cx = 400,
            cy = 232;
          s += `<g opacity="${n1(seal)}"><circle cx="${cx}" cy="${cy}" r="${n1(180 * seal)}" fill="rgba(60,20,120,.35)"/>`;
          s += `<g transform="translate(${cx} ${cy})" fill="none" stroke-linecap="round"><circle r="${n1(170 * seal)}" stroke="#9a5aff" stroke-width="4" stroke-dasharray="16 10" transform="rotate(${n1(t * 30)})" filter="url(#${P.g})"/><circle r="${n1(130 * seal)}" stroke="#c9a7ff" stroke-width="3" stroke-dasharray="40 14" transform="rotate(${n1(-t * 45)})"/><circle r="${n1(96 * seal)}" stroke="#ffd86b" stroke-width="2.5"/></g>`;
          [['>', '#4cc38a', -90], ['=', '#ffd86b', 30], ['<', '#ff7aa8', 150]].forEach((r, i) => {
            const a = (r[2] * Math.PI) / 180,
              ap = ease(seg(t, 12.2 + i * 0.35, 12.8 + i * 0.35));
            s += `<g transform="translate(${n1(cx + Math.cos(a) * 130)} ${n1(cy + Math.sin(a) * 130)}) scale(${n1(ap * 100) / 100})" opacity="${n1(ap)}"><circle r="26" fill="rgba(8,10,40,.95)" stroke="${r[1]}" stroke-width="3.5" filter="url(#${P.g})"/><text y="11" text-anchor="middle" fill="${r[1]}" font-size="32" font-weight="800" font-family="Orbitron,sans-serif">${r[0]}</text></g>`;
          });

          s += `<g transform="translate(${cx} ${cy + 20}) scale(${n1(seal * 100) / 100})" fill="#05031a" stroke="#b46bff" stroke-width="2.4" stroke-linejoin="round" filter="url(#${P.g2})"><path d="M-22 40C-34 20-30-20 0-30C30-20 34 20 22 40Z"/><circle cy="-44" r="14"/><path d="M-12-54L-18-82L-6-64L0-88L6-64L18-82L12-54Z" fill="#ffd86b" stroke="#fff3c4"/></g><g transform="translate(${cx} ${cy - 24})"><ellipse cx="-5" cy="0" rx="4" ry="2" fill="#e9d5ff"/><ellipse cx="5" cy="0" rx="4" ry="2" fill="#e9d5ff"/></g>`;
          s += txt(cx, 438, 'SHADOW MONARCH SEAL', '#ffd86b', 28, 'middle', ease(seg(t, 13.2, 13.9)), `font-family="Orbitron,sans-serif" font-weight="800" letter-spacing="3" filter="url(#${P.g})"`) + '</g>';
        }
        return s;
      },
      cv(ctx, t) {
        if (t > 11.9)
          for (let i = 0; i < 40; i++) {
            const p = (t * 0.35 + hash(i)) % 1;
            ctx.globalAlpha = Math.sin(p * Math.PI) * 0.8;
            ctx.fillStyle = i % 2 ? '#c9a7ff' : '#ffd86b';
            ctx.fillRect(400 + Math.cos(hash(i + 1) * 6.283) * (60 + p * 170), 232 + Math.sin(hash(i + 1) * 6.283) * (50 + p * 120), 3, 3);
          }
        ctx.globalAlpha = 1;
      },
      ev: [
        [0.3, (S, b) => S.sys(b)],
        ...[0, 1, 2, 3, 4, 5].map((i) => [1.2 + i * 0.5, (S, b) => S.ping(b, 1000 + (i % 3) * 200)]),
        [4.2, (S, b) => S.chime(b, 988)],
        [6.4, (S, b) => S.ping(b, 1400)],
        [8.4, (S, b) => S.whoosh(b)],
        [9.1, (S, b) => S.chime(b, 1175)],
        [10.6, (S, b) => S.hit(b)],
        [11.9, (S, b) => S.charge(b)],
        [12.9, (S, b) => S.arise(b)],
      ],
    };
  };
  const SCENES = { 0: scene0, E: sceneE, D: sceneD, C: sceneC, B: sceneB, AS: sceneAS };
  const ICO = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" fill="currentColor"/></svg>',
    snd: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  };

  const html = (c) => {
    if (!has(c)) return '';
    const u = U();
    return `<section class="cn-sec gb-sec" id="gb" data-c="${c}" data-no-i18n role="region" aria-label="${u.region}"><div class="cn-player"><div class="cn-screen"><div class="cn-stage gb-stage" id="gbStage"><div class="gb-host" id="gbHost"></div><div class="cn-chip" id="gbChip"></div><div class="cn-time" id="gbTime">00:00 / 00:15</div><div class="cn-poster" id="gbPoster"><button type="button" class="cn-big" id="gbBig" aria-label="${u.poster}">${ICO.play}</button><b id="gbPT">${u.poster}</b><small id="gbPS">${u.sub}</small></div><div class="cn-end" id="gbEnd" hidden><button type="button" class="btn" id="gbNext">${u.next} ▸</button></div></div><div class="cn-sub" id="gbSub" aria-live="off"></div></div><div class="cn-bar"><button type="button" class="cn-b" id="gbPlay">${ICO.play}<span>${u.play}</span></button><button type="button" class="cn-b" id="gbPause">${ICO.pause}<span>${u.pause}</span></button><button type="button" class="cn-b" id="gbReplay">${ICO.replay}<span>${u.replay}</span></button><div class="gb-sp"></div><button type="button" class="cn-b cn-sfx" id="gbSfx">${ICO.snd}<span></span></button></div></div></section>`;
  };
  let cur = null;
  const stop = () => {
    if (cur && cur.P) cur.P.destroy();
    cur = null;
  };
  const mmss = (t) => {
    const s = Math.floor(clamp(t, 0, DUR));
    return '00:' + String(s).padStart(2, '0') + ' / 00:15';
  };

  let mountTok = 0;
  function mount(c, root) {
    const tok = ++mountTok;
    const run = () => {
      if (tok !== mountTok) return;
      const r = root && root.isConnected ? root : document.getElementById('rk');
      init(c, r);
    };
    init(c, root);
    setTimeout(run, 0);
  }
  function init(c, root, autoplay) {
    stop();
    const sec = (root || document).querySelector('#gb');
    if (!sec || !has(c)) return;
    const k = key(c),
      sc = SCENES[k](),
      q = (id) => sec.querySelector('#' + id);
    const R = { host: q('gbHost'), chip: q('gbChip'), time: q('gbTime'), poster: q('gbPoster'), end: q('gbEnd'), sub: q('gbSub'), play: q('gbPlay'), pause: q('gbPause'), rep: q('gbReplay'), sfx: q('gbSfx'), big: q('gbBig'), next: q('gbNext') };
    const state = { cue: -2, lang: '' };
    const sync = (P) => {
      const u = U(),
        on = Fx24.sfx.get();
      R.play.disabled = P.playing;
      R.pause.disabled = !P.playing;
      R.play.classList.toggle('on', P.playing);
      R.poster.hidden = P.started;
      R.end.hidden = !P.ended;
      R.sfx.innerHTML = (on ? ICO.snd : ICO.mute) + '<span>' + (on ? u.sfxOn : u.sfxOff) + '</span>';
      R.sfx.setAttribute('aria-pressed', on ? 'false' : 'true');
      R.sfx.classList.toggle('off', !on);
    };
    const tick = (t, P) => {
      const L = lang(),
        sub = (SUB[k][L] || SUB[k].id),
        ci = CUES.findIndex((q2) => t >= q2[0] && t < q2[1]);
      if (ci !== state.cue || L !== state.lang) {
        state.cue = ci;
        state.lang = L;
        R.sub.textContent = ci >= 0 ? sub[ci] : '';
        R.sub.classList.toggle('on', ci >= 0);
        R.chip.textContent = (CHIP[c] || CHIP[k] || {})[L] || (CHIP[c] || {}).id || '';
      }
      R.time.textContent = mmss(t);
    };
    const P = Fx24.Player({ stage: R.host, scene: sc, onTick: tick, onState: sync, onEnd: () => sync(P), onDestroy: () => sec.isConnected && sync(P) });
    cur = { P, sec };
    R.chip.textContent = (CHIP[c] || {})[lang()] || (CHIP[c] || {}).id || '';

    const revive = () => {
      if (P.dead || !R.host.isConnected || !cur || cur.P !== P) {
        init(c, document.getElementById('rk') || root);
        return cur && cur.P;
      }
      return P;
    };
    const act = (fn) => () => {
      const Q = revive();
      if (Q && !Q.dead) fn(Q);
    };
    R.big.onclick = act((Q) => Q.play());
    R.poster.onclick = (e) => e.target === R.poster && act((Q) => Q.play())();
    R.play.onclick = act((Q) => Q.play());
    R.pause.onclick = act((Q) => Q.pause());
    R.rep.onclick = act((Q) => Q.replay());
    R.sfx.onclick = () => {
      Fx24.sfx.set(!Fx24.sfx.get());
      const Q = cur && cur.P;
      Q && !Q.dead ? sync(Q) : sync(P);
    };
    R.next.onclick = () => {
      const b = document.querySelector('#rk [data-act="tab"][data-v="1"]:not(.stp button)') || document.querySelector('#rk .card [data-act="tab"]');
      b && b.click();
    };
    P.t = sc.poster;
    P.draw(sc.poster);
    sync(P);
    tick(sc.poster, P);
    R.time.textContent = mmss(0);
    P.t = 0;
    P.prev = 0;
    state.cue = -2;
    R.sub.classList.remove('on');
    R.sub.textContent = '';
    if (autoplay) P.play();
  }
  return { html, init, mount, stop, has, SUB, CHIP, DUR };
})();
