'use strict';

window.Cine = (() => {
  const W = 800,
    H = 450,
    DUR = 40,
    POSTER_T = 7.4;
  const NS = 'http://www.w3.org/2000/svg';

  const TX = {
    id: {
      sub: [
        '[SYSTEM] Sebuah Gerbang Dungeon terbuka. Mana neon mengalir keluar dari celahnya.',
        'Di baliknya menanti ujian terbesar: Quadratic Dungeon.',
        'Hanya Hunter yang menguasai fungsi kuadrat yang boleh melangkah masuk.',
        'Sang Hunter melempar belati. Lintasannya melengkung membentuk parabola.',
        'Rumusnya y = a(x − h)² + k. Titik puncak (h, k) adalah titik tertinggi lemparan.',
        'Sumbu simetri x = h membelah parabola menjadi dua sisi yang sama persis.',
        'Ubah k, h, lalu a. Lihat kurva bergeser dan menyempit secara langsung.',
        'Satu parabola, tiga wujud: Bentuk Vertex, Bentuk Standar, dan Bentuk Faktor.',
        'Jabarkan bentuk vertex menjadi standar, lalu faktorkan menjadi bentuk faktor.',
        'Titik puncak menjadi perisai, akar menjadi jembatan, titik potong y menjadi portal dimensi.',
        'Dari balik bayangan, siluet Shadow Monarch bangkit.',
        'Rank E, D, C, B, A, hingga S menunggu untuk ditaklukkan.',
        'Bangkit & Taklukkan Semua Rank (E hingga S)!',
      ],
      tag: '[ SYSTEM ] GERBANG TERDETEKSI',
      chal: 'Tantangan: taklukkan fungsi kuadrat',
      vtx: 'Titik puncak (h, k)',
      axis: 'Sumbu simetri x = h',
      vf: 'Bentuk Vertex',
      sf: 'Bentuk Standar',
      ff: 'Bentuk Faktor',
      expand: 'jabarkan',
      factor: 'faktorkan',
      lbl: ['Perisai · puncak (1, 4)', 'Jembatan · akar x = −1 dan x = 3', 'Portal · titik potong y (0, 3)'],
      call: 'BANGKIT & TAKLUKKAN SEMUA RANK',
      cta: 'Daftar & Mulai Berburu',
      scenes: ['1 · Gerbang Dungeon', '2 · Lintasan Parabola', '3 · Tiga Bentuk', '4 · Shadow Monarch'],
      ui: {
        region: 'Trailer sinematik Quadratic Dungeon',
        poster: 'Putar Trailer Sinematik',
        posterSub: 'Motion graphic 40 detik',
        play: 'Putar',
        pause: 'Jeda',
        replay: 'Ulangi',
        sfxOn: 'SFX: ON',
        sfxOff: 'SFX: OFF',
        seek: 'Posisi video',
        sfxTitle: 'Mute atau nyalakan efek suara trailer',
      },
    },
    en: {
      sub: [
        '[SYSTEM] A Dungeon Gate opens. Neon mana pours out of the rift.',
        'Beyond it waits the greatest trial: the Quadratic Dungeon.',
        'Only a Hunter who masters quadratic functions may step inside.',
        'The Hunter throws a dagger. Its path curves into a parabola.',
        'The formula is y = a(x − h)² + k. The vertex (h, k) is the peak of the throw.',
        'The axis of symmetry x = h splits the parabola into two identical halves.',
        'Change k, then h, then a. Watch the curve shift and narrow live.',
        'One parabola, three forms: Vertex Form, Standard Form, and Factored Form.',
        'Expand vertex form into standard form, then factor it into factored form.',
        'The vertex becomes a shield, the roots become a bridge, the y-intercept a dimensional portal.',
        'From the shadows, the silhouette of the Shadow Monarch rises.',
        'Ranks E, D, C, B, A, all the way to S await conquest.',
        'Rise & Conquer Every Rank (E to S)!',
      ],
      tag: '[ SYSTEM ] GATE DETECTED',
      chal: 'Challenge: conquer quadratic functions',
      vtx: 'Vertex (h, k)',
      axis: 'Axis of symmetry x = h',
      vf: 'Vertex Form',
      sf: 'Standard Form',
      ff: 'Factored Form',
      expand: 'expand',
      factor: 'factor',
      lbl: ['Shield · vertex (1, 4)', 'Bridge · roots x = −1 and x = 3', 'Portal · y-intercept (0, 3)'],
      call: 'RISE & CONQUER EVERY RANK',
      cta: 'Sign Up & Start Hunting',
      scenes: ['1 · Dungeon Gate', '2 · Parabola Path', '3 · Three Forms', '4 · Shadow Monarch'],
      ui: {
        region: 'Quadratic Dungeon cinematic trailer',
        poster: 'Play Cinematic Trailer',
        posterSub: '40-second motion graphic',
        play: 'Play',
        pause: 'Pause',
        replay: 'Replay',
        sfxOn: 'SFX: ON',
        sfxOff: 'SFX: OFF',
        seek: 'Video position',
        sfxTitle: 'Mute or unmute trailer sound effects',
      },
    },
    ja: {
      sub: [
        '[SYSTEM] ダンジョンゲートが開く。裂け目からネオンの魔力があふれ出す。',
        'その先に待つのは最大の試練、二次ダンジョン。',
        '二次関数を極めたハンターだけが足を踏み入れられる。',
        'ハンターが短剣を投げる。軌跡は放物線を描く。',
        '式は y = a(x − h)² + k。頂点 (h, k) は軌道の最高点。',
        '対称軸 x = h が放物線を左右対称に二分する。',
        'k、h、a の順に変えてみよう。曲線が動き、細くなる。',
        '一つの放物線に三つの形：頂点形式、標準形、因数分解形。',
        '頂点形式を展開して標準形に、さらに因数分解して因数分解形へ。',
        '頂点は盾に、解は橋に、y切片は次元ポータルになる。',
        '影の中から、シャドウモナークのシルエットが立ち上がる。',
        'ランクE、D、C、B、A、そしてSが攻略を待っている。',
        '目覚めよ、全ランク（EからS）を制覇せよ！',
      ],
      tag: '[ SYSTEM ] ゲート検出',
      chal: '挑戦：二次関数を攻略せよ',
      vtx: '頂点 (h, k)',
      axis: '対称軸 x = h',
      vf: '頂点形式',
      sf: '標準形',
      ff: '因数分解形',
      expand: '展開',
      factor: '因数分解',
      lbl: ['盾 · 頂点 (1, 4)', '橋 · 解 x = −1 と x = 3', 'ポータル · y切片 (0, 3)'],
      call: '目覚めよ、全ランクを制覇せよ',
      cta: '登録して狩りを始める',
      scenes: ['1 · ダンジョンゲート', '2 · 放物線の軌道', '3 · 三つの形', '4 · シャドウモナーク'],
      ui: {
        region: '二次ダンジョン シネマティックトレーラー',
        poster: 'トレーラーを再生',
        posterSub: '40秒のモーショングラフィック',
        play: '再生',
        pause: '一時停止',
        replay: 'もう一度',
        sfxOn: 'SFX: ON',
        sfxOff: 'SFX: OFF',
        seek: '再生位置',
        sfxTitle: 'トレーラーの効果音をミュート／解除',
      },
    },
    ko: {
      sub: [
        '[SYSTEM] 던전 게이트가 열린다. 균열에서 네온 마나가 쏟아져 나온다.',
        '그 너머에는 가장 큰 시험, 이차함수 던전이 기다린다.',
        '이차함수를 마스터한 헌터만 들어갈 수 있다.',
        '헌터가 단검을 던진다. 궤적은 포물선을 그린다.',
        '식은 y = a(x − h)² + k. 꼭짓점 (h, k)는 궤적의 최고점이다.',
        '대칭축 x = h는 포물선을 똑같은 두 부분으로 나눈다.',
        'k, h, a 순서로 바꿔 보자. 곡선이 움직이고 좁아진다.',
        '하나의 포물선, 세 가지 형태: 꼭짓점 형태, 표준형, 인수분해형.',
        '꼭짓점 형태를 전개해 표준형으로, 다시 인수분해해 인수분해형으로.',
        '꼭짓점은 방패, 근은 다리, y절편은 차원 포털이 된다.',
        '그림자 속에서 섀도 모나크의 실루엣이 일어선다.',
        '랭크 E, D, C, B, A, 그리고 S가 정복을 기다린다.',
        '일어나 모든 랭크(E부터 S)를 정복하라!',
      ],
      tag: '[ SYSTEM ] 게이트 감지',
      chal: '도전: 이차함수를 정복하라',
      vtx: '꼭짓점 (h, k)',
      axis: '대칭축 x = h',
      vf: '꼭짓점 형태',
      sf: '표준형',
      ff: '인수분해형',
      expand: '전개',
      factor: '인수분해',
      lbl: ['방패 · 꼭짓점 (1, 4)', '다리 · 근 x = −1, x = 3', '포털 · y절편 (0, 3)'],
      call: '일어나 모든 랭크를 정복하라',
      cta: '가입하고 사냥 시작',
      scenes: ['1 · 던전 게이트', '2 · 포물선 궤적', '3 · 세 가지 형태', '4 · 섀도 모나크'],
      ui: {
        region: '이차함수 던전 시네마틱 트레일러',
        poster: '트레일러 재생',
        posterSub: '40초 모션 그래픽',
        play: '재생',
        pause: '일시정지',
        replay: '다시 재생',
        sfxOn: 'SFX: ON',
        sfxOff: 'SFX: OFF',
        seek: '재생 위치',
        sfxTitle: '트레일러 효과음 음소거 또는 해제',
      },
    },
  };

  const CUES = [
    [0.6, 3.8], [4.0, 7.0], [7.2, 9.9],
    [10.3, 13.2], [13.4, 16.8], [17.0, 19.8], [20.0, 21.9],
    [22.2, 25.0], [25.2, 28.2], [28.4, 31.8],
    [32.2, 35.0], [35.2, 38.0], [38.2, 40.01],
  ];
  const L = () => {
    const l = (window.I18N && I18N.lang) || document.documentElement.lang || 'id';
    return TX[l] || TX.id;
  };

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const ease = (x) => x * x * (3 - 2 * x);
  const env = (t, a, b, c, d) => ease(seg(t, a, b)) * (1 - ease(seg(t, c, d)));
  const hash = (i) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const frac = (x) => x - Math.floor(x);
  const f1 = (v) => {
    const r = Math.round(v * 10) / 10;
    return (Math.abs(r - Math.round(r)) < 1e-9 ? String(Math.round(r)) : r.toFixed(1)).replace('-', '−');
  };
  const mmss = (t) => {
    const s = Math.floor(clamp(t, 0, DUR));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };
  const PAL = ['#5ee6f2', '#9a5aff', '#4d8bff', '#f472a8', '#ffd86b'];

  const X2 = (x) => 100 + (x + 2) * 50,
    Y2 = (y) => 330 - (y + 1.5) * 32.5;
  const X3 = (x) => 190 + (x + 2.5) * 60,
    Y3 = (y) => 335 - (y + 1) * 48;

  const params = (t) => {
    const s1 = ease(seg(t, 18.0, 19.0)),
      s2 = ease(seg(t, 19.5, 20.5)),
      s3 = ease(seg(t, 20.8, 21.8));
    return { a: -0.2 + -0.2 * s3, h: 4 - 1 * s2, k: 5 + 1 * s1 };
  };

  const SVG = `
<defs>
  <filter id="cnG" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="cnG2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <radialGradient id="cnPortal" cx="50%" cy="58%" r="62%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".22" stop-color="#9ff3ff"/><stop offset=".55" stop-color="#7a3cff"/><stop offset="1" stop-color="#1a0a4a"/></radialGradient>
  <linearGradient id="cnDoor" x1="0" x2="1"><stop offset="0" stop-color="#1a2260"/><stop offset="1" stop-color="#090d2e"/></linearGradient>
  <linearGradient id="cnAr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b46bff"/></linearGradient>
  <clipPath id="cnArch"><path d="M312 382V205A88 88 0 0 1 488 205V382Z"/></clipPath>
  <g id="cnSold"><circle cx="0" cy="-44" r="7"/><path d="M-10 -36L10 -36L13 -10L6 0L-6 0L-13 -10Z"/><path d="M-10 -34L-18 -16M10 -34L18 -16" fill="none"/><circle cx="-2.6" cy="-45" r="1.5" fill="#ff4d6d" stroke="none"/><circle cx="2.6" cy="-45" r="1.5" fill="#ff4d6d" stroke="none"/></g>
</defs>

<!-- ============ ADEGAN 1: GERBANG ============ -->
<g id="g1">
  <g id="gGateWrap">
    <ellipse id="gGlow" cx="400" cy="386" rx="190" ry="24" fill="#7a3cff" opacity="0"/>
    <g id="gGate">
      <g clip-path="url(#cnArch)">
        <rect id="gPortalBg" x="300" y="100" width="200" height="290" fill="url(#cnPortal)" opacity="0"/>
        <g id="gSwirl" fill="none" stroke-width="3" opacity="0">
          <ellipse cx="400" cy="272" rx="26" ry="34" stroke="#fff" stroke-dasharray="10 12"/>
          <ellipse cx="400" cy="272" rx="52" ry="68" stroke="#9ff3ff" stroke-dasharray="26 14"/>
          <ellipse cx="400" cy="272" rx="80" ry="102" stroke="#c9a7ff" stroke-dasharray="40 20"/>
          <ellipse cx="400" cy="272" rx="108" ry="136" stroke="#7a3cff" stroke-dasharray="14 30"/>
        </g>
        <g id="gDoorL"><rect x="298" y="110" width="102" height="280" fill="url(#cnDoor)"/><path d="M340 140V372M372 140V372M310 200H400M310 300H400" stroke="#5ee6f2" stroke-width="1.6" opacity=".55" fill="none"/><path d="M386 250l8 12-8 12-8-12z" fill="#5ee6f2" opacity=".8"/></g>
        <g id="gDoorR"><rect x="400" y="110" width="102" height="280" fill="url(#cnDoor)"/><path d="M428 140V372M460 140V372M400 200H490M400 300H490" stroke="#5ee6f2" stroke-width="1.6" opacity=".55" fill="none"/><path d="M414 250l8 12-8 12-8-12z" fill="#5ee6f2" opacity=".8"/></g>
      </g>
      <path d="M296 384V205A104 104 0 0 1 504 205V384" fill="none" stroke="#5ee6f2" stroke-width="5" filter="url(#cnG)"/>
      <path d="M306 384V205A94 94 0 0 1 494 205V384" fill="none" stroke="#9a5aff" stroke-width="2" opacity=".9"/>
      <circle id="gRune" cx="400" cy="205" r="124" fill="none" stroke="#9a5aff" stroke-width="3" stroke-dasharray="3 11" opacity=".8"/>
    </g>
  </g>
  <text id="gTag" x="400" y="34" text-anchor="middle" fill="#5ee6f2" font-size="17" font-family="Orbitron,sans-serif" letter-spacing="2"></text>
  <g id="gTitleG" opacity="0">
    <text id="gTitle" x="400" y="72" text-anchor="middle" fill="#fff" font-size="40" font-weight="800" font-family="Orbitron,sans-serif" letter-spacing="3" filter="url(#cnG)">QUADRATIC DUNGEON</text>
    <text id="gChal" x="400" y="104" text-anchor="middle" fill="#ffd86b" font-size="22" font-weight="700"></text>
  </g>
</g>

<!-- ============ ADEGAN 2: PARABOLA ============ -->
<g id="g2" opacity="0">
  <path id="g2Grid" fill="none" stroke="#4d8bff" stroke-width="1" opacity=".18"/>
  <path id="g2Axes" fill="none" stroke="#8e9ad0" stroke-width="2" opacity=".85"/>
  <text id="g2Fx" x="400" y="38" text-anchor="middle" fill="#fff" font-size="26" font-weight="700" opacity="0">y = a(x − h)² + k</text>
  <text id="g2Eq" x="400" y="38" text-anchor="middle" fill="#fff" font-size="26" font-weight="700" opacity="0"><tspan>y = </tspan><tspan id="eqA" fill="#f472a8"></tspan><tspan>(x </tspan><tspan id="eqH" fill="#5ee6f2"></tspan><tspan>)² </tspan><tspan id="eqK" fill="#ffd86b"></tspan></text>
  <!-- Hunter -->
  <g id="g2Hunter" opacity="0" stroke="#c9a7ff" stroke-width="3.2" stroke-linecap="round" fill="none" filter="url(#cnG)">
    <circle cx="0" cy="-52" r="8" fill="#0a0f33"/>
    <path d="M0 -44V-20M0 -20L-10 0M0 -20L10 0"/>
    <path d="M-6 -44Q-16 -30 -12 -16" opacity=".7"/>
    <g id="g2Arm"><path d="M0 -40L22 -40"/></g>
  </g>
  <path id="g2Under" fill="none" stroke="#9a5aff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".28"/>
  <path id="g2Curve" fill="none" stroke="#5ee6f2" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="g2Tgt" opacity="0"><path d="M0 -12L10 0L0 12L-10 0Z" fill="none" stroke="#f472a8" stroke-width="3"/><circle r="3" fill="#f472a8"/></g>
  <circle id="g2Hit" r="4" fill="none" stroke="#ffd86b" stroke-width="3" opacity="0"/>
  <line id="g2Axis" stroke="#ffd86b" stroke-width="2" stroke-dasharray="7 6" opacity="0"/>
  <text id="g2AxisL" text-anchor="middle" fill="#ffd86b" font-size="19" font-weight="700" opacity="0"></text>
  <line id="g2Pair" stroke="#f472a8" stroke-width="2" stroke-dasharray="4 5" opacity="0"/>
  <circle id="g2P1" r="6" fill="#f472a8" opacity="0"/><circle id="g2P2" r="6" fill="#f472a8" opacity="0"/>
  <g id="g2Vtx" opacity="0"><circle id="g2VR" r="14" fill="none" stroke="#ffd86b" stroke-width="2"/><circle r="7" fill="#ffd86b" filter="url(#cnG)"/></g>
  <text id="g2VtxL" text-anchor="middle" fill="#ffd86b" font-size="20" font-weight="700" opacity="0"></text>
  <g id="g2Dag" opacity="0"><path d="M-16 0L8 -3.4L18 0L8 3.4Z" fill="#e8fbff" stroke="#5ee6f2" stroke-width="1.5" filter="url(#cnG)"/><path d="M-16 -5V5" stroke="#ffd86b" stroke-width="3"/></g>
</g>

<!-- ============ ADEGAN 3: TIGA BENTUK ============ -->
<g id="g3" opacity="0">
  <g id="g3Cards">
    <g id="c0" transform="translate(25 85)"><rect width="240" height="200" rx="14" fill="rgba(10,16,60,.88)" stroke="#5ee6f2" stroke-width="2.5"/>
      <text class="ct" x="120" y="30" text-anchor="middle" fill="#5ee6f2" font-size="18" font-weight="800" font-family="Orbitron,sans-serif"></text>
      <g transform="translate(120 100)" filter="url(#cnG)"><path d="M0 -36L30 -25V4C30 22 12 34 0 44C-12 34 -30 22 -30 4V-25Z" fill="rgba(94,230,242,.16)" stroke="#5ee6f2" stroke-width="3"/><circle cy="-4" r="6" fill="#ffd86b"/></g>
      <text class="cg" x="120" y="172" text-anchor="middle" fill="#fff" font-size="22" font-weight="700">y = a(x − h)² + k</text>
      <text class="cn" x="120" y="172" text-anchor="middle" fill="#ffd86b" font-size="22" font-weight="700" opacity="0">y = −(x − 1)² + 4</text></g>
    <g id="c1" transform="translate(280 85)"><rect width="240" height="200" rx="14" fill="rgba(10,16,60,.88)" stroke="#9a5aff" stroke-width="2.5"/>
      <text class="ct" x="120" y="30" text-anchor="middle" fill="#c9a7ff" font-size="18" font-weight="800" font-family="Orbitron,sans-serif"></text>
      <g id="c1Ring" transform="translate(120 100)" fill="none" filter="url(#cnG)"><ellipse rx="22" ry="34" stroke="#fff" stroke-width="3"/><ellipse rx="38" ry="46" stroke="#9a5aff" stroke-width="3" stroke-dasharray="14 9"/><circle r="6" fill="#9ff3ff"/></g>
      <text class="cg" x="120" y="172" text-anchor="middle" fill="#fff" font-size="22" font-weight="700">y = ax² + bx + c</text>
      <text class="cn" x="120" y="172" text-anchor="middle" fill="#ffd86b" font-size="22" font-weight="700" opacity="0">y = −x² + 2x + 3</text></g>
    <g id="c2" transform="translate(535 85)"><rect width="240" height="200" rx="14" fill="rgba(10,16,60,.88)" stroke="#ffd86b" stroke-width="2.5"/>
      <text class="ct" x="120" y="30" text-anchor="middle" fill="#ffd86b" font-size="18" font-weight="800" font-family="Orbitron,sans-serif"></text>
      <g transform="translate(120 108)" fill="none" stroke="#ffd86b" stroke-width="3" filter="url(#cnG)"><path d="M-54 24Q0 -50 54 24"/><path d="M-54 24H54"/><path d="M-36 24V4M-18 24V-9M0 24V-14M18 24V-9M36 24V4" stroke-width="2"/></g>
      <text class="cg" x="120" y="172" text-anchor="middle" fill="#fff" font-size="22" font-weight="700">y = a(x − p)(x − q)</text>
      <text class="cn" x="120" y="172" text-anchor="middle" fill="#ffd86b" font-size="22" font-weight="700" opacity="0">y = −(x + 1)(x − 3)</text></g>
  </g>
  <g id="g3Arr" fill="none" stroke="#ffd86b" stroke-width="3" stroke-linecap="round">
    <path id="ar1" d="M145 292Q272 338 392 292" stroke-dasharray="1000" stroke-dashoffset="1000"/><path id="ah1" d="M380 286L394 292L379 300" opacity="0"/>
    <path id="ar2" d="M400 292Q527 338 647 292" stroke-dasharray="1000" stroke-dashoffset="1000"/><path id="ah2" d="M635 286L649 292L634 300" opacity="0"/>
  </g>
  <g id="ex1" opacity="0"><text id="ex1l" x="272" y="336" text-anchor="middle" fill="#ffd86b" font-size="20" font-weight="800"></text><text x="272" y="360" text-anchor="middle" fill="#fff" font-size="18" font-weight="700">−(x − 1)² + 4 → −x² + 2x + 3</text></g>
  <g id="ex2" opacity="0"><text id="ex2l" x="527" y="336" text-anchor="middle" fill="#ffd86b" font-size="20" font-weight="800"></text><text x="527" y="360" text-anchor="middle" fill="#fff" font-size="18" font-weight="700">−x² + 2x + 3 → −(x + 1)(x − 3)</text></g>
  <!-- mini plot: perisai, jembatan, portal -->
  <g id="g3Plot" opacity="0">
    <text id="p3Eq" x="400" y="34" text-anchor="middle" fill="#fff" font-size="21" font-weight="700">y = −(x − 1)² + 4 = −x² + 2x + 3 = −(x + 1)(x − 3)</text>
    <path id="p3Grid" fill="none" stroke="#4d8bff" stroke-width="1" opacity=".18"/>
    <path id="p3Axes" fill="none" stroke="#8e9ad0" stroke-width="2" opacity=".85"/>
    <path id="p3Curve" fill="none" stroke="#5ee6f2" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
    <g id="p3Shield" filter="url(#cnG)"><path d="M0 -22L19 -15V3C19 14 8 21 0 27C-8 21 -19 14 -19 3V-15Z" fill="rgba(94,230,242,.25)" stroke="#5ee6f2" stroke-width="2.6"/><circle cy="-2" r="4" fill="#ffd86b"/></g>
    <g id="p3Bridge" fill="none" stroke="#ffd86b" stroke-linecap="round" filter="url(#cnG)"><path id="p3Deck" stroke-width="6"/><path id="p3Arc" stroke-width="3"/><path id="p3Susp" stroke-width="1.8"/><path id="p3Pyl" stroke-width="6"/></g>
    <g id="p3Portal" fill="none" filter="url(#cnG)"><ellipse rx="12" ry="19" stroke="#fff" stroke-width="2.4"/><ellipse id="p3PR" rx="22" ry="28" stroke="#9a5aff" stroke-width="2.6" stroke-dasharray="9 7"/><circle r="4" fill="#9ff3ff"/></g>
    <text id="p3L0" fill="#5ee6f2" font-size="21" font-weight="700" opacity="0"></text>
    <text id="p3L1" text-anchor="middle" fill="#ffd86b" font-size="21" font-weight="700" opacity="0"></text>
    <text id="p3L2" text-anchor="end" fill="#c9a7ff" font-size="21" font-weight="700" opacity="0"></text>
  </g>
</g>

<!-- ============ ADEGAN 4: SHADOW MONARCH ============ -->
<g id="g4" opacity="0">
  <g id="g4Sold" fill="#06041a" stroke="#9a5aff" stroke-width="1.6" opacity="0" filter="url(#cnG)"></g>
  <g id="g4Mon" opacity="0">
    <g transform="translate(400 368) scale(.95)" fill="#05031a" stroke="#b46bff" stroke-width="2.4" stroke-linejoin="round" filter="url(#cnG2)">
      <path d="M-30 -190C-70 -170 -110 -90 -128 0L128 0C110 -90 70 -170 30 -190Z"/>
      <path d="M-26 -192L26 -192L36 -110L22 0L-22 0L-36 -110Z"/>
      <path d="M-34 -190Q-56 -202 -64 -178L-36 -166Z M34 -190Q56 -202 64 -178L36 -166Z"/>
      <path d="M-34 -176L-54 -104L-44 -62M34 -176L54 -104L44 -62" fill="none"/>
      <circle cx="0" cy="-214" r="19"/>
      <path d="M-17 -228L-25 -262L-9 -238L0 -270L9 -238L25 -262L17 -228Z"/>
      <path d="M62 -120L62 0M52 -100H72" fill="none" stroke-width="3"/>
    </g>
    <g id="g4Eyes" transform="translate(400 368) scale(.95)"><ellipse cx="-7" cy="-215" rx="5" ry="2.4" fill="#e9d5ff"/><ellipse cx="7" cy="-215" rx="5" ry="2.4" fill="#e9d5ff"/><ellipse cx="-7" cy="-215" rx="10" ry="5" fill="#b46bff" opacity=".45"/><ellipse cx="7" cy="-215" rx="10" ry="5" fill="#b46bff" opacity=".45"/></g>
  </g>
  <g id="g4Tiles"></g>
  <text id="g4Arise" x="400" y="250" text-anchor="middle" fill="url(#cnAr)" font-size="96" font-weight="800" font-family="Orbitron,sans-serif" letter-spacing="8" filter="url(#cnG2)" opacity="0">ARISE</text>
  <g id="g4Call" opacity="0">
    <text id="g4C1" x="400" y="58" text-anchor="middle" fill="#fff" font-size="29" font-weight="800" font-family="Orbitron,sans-serif" filter="url(#cnG)"></text>
    <text x="400" y="92" text-anchor="middle" fill="#ffd86b" font-size="26" font-weight="800" font-family="Orbitron,sans-serif" letter-spacing="6">E · D · C · B · A · S</text>
  </g>
</g>`;

  const ICO = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" fill="currentColor"/></svg>',
    snd: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  };
  const section = () => `<section class="cn-sec" id="cine" data-no-i18n role="region" aria-label="${L().ui.region}">
<div class="cn-player">
  <div class="cn-screen">
    <div class="cn-stage" id="cnStage">
      <canvas id="cnCv"></canvas>
      <svg id="cnSvg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" font-family="Rajdhani,sans-serif">${SVG}</svg>
      <div class="cn-chip" id="cnChip"></div>
      <div class="cn-time" id="cnTime">00:00 / 00:40</div>
      <div class="cn-poster" id="cnPoster"><button type="button" class="cn-big" id="cnBig" aria-label="">${ICO.play}</button><b id="cnPT"></b><small id="cnPS"></small></div>
      <div class="cn-end" id="cnEnd" hidden><button type="button" class="btn" data-auth="register" id="cnCta"></button></div>
    </div>
    <div class="cn-sub" id="cnSub" aria-live="off"></div>
  </div>
  <div class="cn-bar">
    <button type="button" class="cn-b" id="cnPlay">${ICO.play}<span></span></button>
    <button type="button" class="cn-b" id="cnPause">${ICO.pause}<span></span></button>
    <button type="button" class="cn-b" id="cnReplay">${ICO.replay}<span></span></button>
    <input type="range" id="cnSeek" min="0" max="${DUR * 10}" value="0" step="1">
    <button type="button" class="cn-b cn-sfx" id="cnSfx">${ICO.snd}<span></span></button>
  </div>
</div></section>`;

  const S = { t: 0, playing: false, started: false, ended: false, sfx: true, prev: 0, lastCue: -2, lang: '' };
  try {
    S.sfx = localStorage.getItem('ad_cn_sfx') !== '0';
  } catch (e) {}
  let R = null;
  let raf = 0,
    lastTs = 0,
    cv = null,
    cx = null,
    cs = 1;
  let ST = { dag: { x: 0, y: 0, p: 0, vis: 0 } };

  const $$ = (id) => document.getElementById(id);
  const setA = (el, a) => {
    for (const k in a) el.setAttribute(k, a[k]);
  };
  const op = (el, v) => el.setAttribute('opacity', v < 0.003 ? 0 : +v.toFixed(3));

  let AC = null,
    master = null,
    bus = null,
    echo = null,
    nbuf = null,
    drone = null;
  const audioInit = () => {
    if (AC) return;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    AC = new C();
    master = AC.createGain();
    master.gain.value = S.sfx ? 0.85 : 0;
    const comp = AC.createDynamicsCompressor();
    bus = AC.createGain();
    bus.connect(comp);
    comp.connect(master);
    master.connect(AC.destination);
    const d = AC.createDelay(0.8),
      fb = AC.createGain(),
      lp = AC.createBiquadFilter();
    d.delayTime.value = 0.27;
    fb.gain.value = 0.36;
    lp.type = 'lowpass';
    lp.frequency.value = 2300;
    d.connect(lp);
    lp.connect(fb);
    fb.connect(d);
    lp.connect(bus);
    echo = d;
    const n = AC.sampleRate * 2,
      b = AC.createBuffer(1, n, AC.sampleRate),
      ch = b.getChannelData(0);
    for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1;
    nbuf = b;

    const o1 = AC.createOscillator(),
      o2 = AC.createOscillator(),
      g1 = AC.createGain(),
      g2 = AC.createGain(),
      f = AC.createBiquadFilter();
    o1.type = 'sawtooth';
    o2.type = 'sine';
    f.type = 'lowpass';
    f.frequency.value = 260;
    g1.gain.value = 0;
    g2.gain.value = 0;
    o1.connect(f);
    f.connect(g1);
    g1.connect(bus);
    o2.connect(g2);
    g2.connect(bus);
    o1.start();
    o2.start();
    drone = { o1, o2, g1, g2, f };
  };
  const tone = (f, t0, d, type = 'sine', v = 0.1, f2, send = 0.3) => {
    if (!AC) return;
    const o = AC.createOscillator(),
      g = AC.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + d);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + Math.min(0.03, d / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g);
    g.connect(bus);
    if (send) {
      const s = AC.createGain();
      s.gain.value = send;
      g.connect(s);
      s.connect(echo);
    }
    o.start(t0);
    o.stop(t0 + d + 0.05);
  };
  const nz = (t0, d, v, type, f0, f1, q = 1) => {
    if (!AC) return;
    const s = AC.createBufferSource(),
      fl = AC.createBiquadFilter(),
      g = AC.createGain();
    s.buffer = nbuf;
    fl.type = type;
    fl.Q.value = q;
    fl.frequency.setValueAtTime(f0, t0);
    fl.frequency.exponentialRampToValueAtTime(f1, t0 + d);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + d * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    s.connect(fl);
    fl.connect(g);
    g.connect(bus);
    s.start(t0, Math.random());
    s.stop(t0 + d + 0.05);
  };
  const arp = (fs, t0, gap, d, type, v) => fs.forEach((f, i) => tone(f, t0 + i * gap, d, type, v));
  const pad = (fs, t0, d, v) =>
    fs.forEach((f) => {
      tone(f, t0, d, 'sawtooth', v, undefined, 0.4);
      tone(f * 1.006, t0, d, 'triangle', v * 0.8, undefined, 0.4);
    });
  const sys = (n) => {
    const t = AC.currentTime;
    tone(880, t, 0.12, 'square', 0.04);
    tone(1320, t + 0.13, 0.16, 'square', 0.04);
    if (n) tone(1760, t + 0.28, 0.2, 'square', 0.03);
  };

  const EV = [
    [0.6, () => sys(0)],
    [4.2, () => { const t = AC.currentTime; nz(t, 2.8, 0.55, 'lowpass', 160, 70); tone(95, t, 2.6, 'sawtooth', 0.08, 55, 0.1); }],
    [5.0, () => tone(48, AC.currentTime, 1.4, 'sine', 0.35, 30, 0)],
    [6.8, () => arp([523, 659, 784, 1047], AC.currentTime, 0.13, 0.7, 'triangle', 0.09)],
    [8.6, () => nz(AC.currentTime, 1.5, 0.12, 'bandpass', 300, 3200, 3)],
    [10.4, () => sys(1)],
    [11.9, () => { const t = AC.currentTime; tone(1568, t, 0.5, 'sine', 0.07); tone(2093, t + 0.1, 0.5, 'sine', 0.05); }],
    [12.05, () => { const t = AC.currentTime; nz(t, 1.5, 0.09, 'bandpass', 500, 2600, 4); nz(t + 1.5, 1.5, 0.08, 'bandpass', 2600, 500, 4); }],
    [15.0, () => { const t = AC.currentTime; tone(170, t, 0.4, 'triangle', 0.28, 55, 0); nz(t, 0.25, 0.2, 'highpass', 1500, 3000); tone(1320, t + 0.05, 0.9, 'sine', 0.07); }],
    [15.6, () => { const t = AC.currentTime; tone(988, t, 0.9, 'sine', 0.1); tone(1480, t + 0.02, 0.9, 'sine', 0.04); }],
    [16.7, () => tone(420, AC.currentTime, 0.6, 'sine', 0.09, 980)],
    [18.0, () => tone(1175, AC.currentTime, 0.28, 'triangle', 0.1)],
    [19.5, () => tone(880, AC.currentTime, 0.28, 'triangle', 0.1)],
    [20.8, () => tone(659, AC.currentTime, 0.28, 'triangle', 0.1)],
    [22.2, () => arp([523, 659, 784], AC.currentTime, 0.22, 0.9, 'triangle', 0.09)],
    [25.2, () => { const t = AC.currentTime; nz(t, 0.9, 0.1, 'highpass', 600, 4000); tone(784, t + 0.5, 0.6, 'triangle', 0.1); }],
    [27.2, () => { const t = AC.currentTime; nz(t, 0.9, 0.1, 'highpass', 600, 4000); tone(1047, t + 0.5, 0.6, 'triangle', 0.1); }],
    [28.8, () => nz(AC.currentTime, 1.0, 0.1, 'bandpass', 400, 2400, 2)],
    [29.95, () => { const t = AC.currentTime; tone(392, t, 1.2, 'sine', 0.12); tone(784, t, 1.2, 'triangle', 0.07); }],
    [30.65, () => { const t = AC.currentTime; tone(523, t, 1.2, 'sine', 0.12); tone(1047, t, 1.2, 'triangle', 0.07); }],
    [31.3, () => { const t = AC.currentTime; tone(659, t, 1.2, 'sine', 0.12); tone(1318, t, 1.2, 'triangle', 0.07); }],
    [32.3, () => { const t = AC.currentTime; tone(42, t, 2.4, 'sine', 0.4, 28, 0); nz(t, 2, 0.4, 'lowpass', 220, 60); }],
    [33.0, () => { const t = AC.currentTime; pad([220, 277, 330], t, 3.2, 0.05); tone(55, t, 3, 'sawtooth', 0.12, 41, 0.1); nz(t, 0.6, 0.25, 'highpass', 800, 5000); }],
    [35.4, () => tone(440, AC.currentTime, 0.45, 'triangle', 0.1)],
    [35.8, () => tone(494, AC.currentTime, 0.45, 'triangle', 0.1)],
    [36.2, () => tone(554, AC.currentTime, 0.45, 'triangle', 0.1)],
    [36.6, () => tone(659, AC.currentTime, 0.45, 'triangle', 0.1)],
    [37.0, () => tone(740, AC.currentTime, 0.45, 'triangle', 0.1)],
    [37.4, () => tone(880, AC.currentTime, 0.7, 'triangle', 0.12)],
    [38.2, () => { const t = AC.currentTime; pad([220, 277, 330, 440, 554], t, 2.2, 0.045); tone(55, t, 1.5, 'sine', 0.3, 40, 0); nz(t, 0.5, 0.2, 'highpass', 1000, 6000); }],
  ];
  const droneFrame = (t) => {
    if (!AC || !drone) return;
    const now = AC.currentTime,
      sc = t < 10 ? 0 : t < 22 ? 1 : t < 32 ? 2 : 3,
      base = [55, 65.4, 73.4, 49][t < 10 ? 0 : sc],
      vol = t < 10 ? 0.03 + 0.1 * seg(t, 0.5, 9) : t < 22 ? 0.06 : t < 32 ? 0.07 : 0.1 + 0.08 * seg(t, 32, 39);
    const on = S.playing ? 1 : 0;
    drone.o1.frequency.setTargetAtTime(base, now, 0.5);
    drone.o2.frequency.setTargetAtTime(base * 1.5, now, 0.5);
    drone.f.frequency.setTargetAtTime(220 + 500 * seg(t, 30, 38), now, 0.5);
    drone.g1.gain.setTargetAtTime(vol * on, now, 0.4);
    drone.g2.gain.setTargetAtTime(vol * 0.8 * on, now, 0.4);
  };
  const setSfx = (on) => {
    S.sfx = on;
    try {
      localStorage.setItem('ad_cn_sfx', on ? '1' : '0');
    } catch (e) {}
    if (master) master.gain.setTargetAtTime(on ? 0.85 : 0, AC.currentTime, 0.05);
    uiSync();
  };

  const canvasFrame = (t) => {
    if (!cx) return;
    const c = cx;
    c.setTransform(cs, 0, 0, cs, 0, 0);
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
    const bg = c.createRadialGradient(400, 260, 40, 400, 240, 520);
    const s4 = ease(seg(t, 32, 34)),
      s3 = env(t, 21.5, 23, 31.5, 32.5);
    bg.addColorStop(0, `rgb(${16 + 22 * s4 + 6 * s3},${12 + 4 * s3},${52 + 30 * s4 + 18 * s3})`);
    bg.addColorStop(1, '#04051a');
    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'lighter';

    if (t < 11) {
      const g = ease(seg(t, 0.8, 4.4)),
        z = 1 + 2 * ease(seg(t, 9, 10.4));
      const rg = c.createRadialGradient(400, 300, 10, 400, 300, 280 * z);
      rg.addColorStop(0, `rgba(122,60,255,${0.45 * g * (1 - seg(t, 9.8, 10.8))})`);
      rg.addColorStop(1, 'rgba(122,60,255,0)');
      c.fillStyle = rg;
      c.fillRect(0, 0, W, H);
    }

    if (t > 32) {
      const a = ease(seg(t, 32.2, 34)),
        cxr = 400,
        cyr = 250;
      for (let i = 0; i < 16; i++) {
        const ang = i * 0.3927 + t * 0.12,
          len = 460,
          w = 0.07 + 0.03 * Math.sin(t * 1.3 + i);
        const gr = c.createLinearGradient(cxr, cyr, cxr + Math.cos(ang) * len, cyr + Math.sin(ang) * len);
        gr.addColorStop(0, `rgba(154,90,255,${0.28 * a})`);
        gr.addColorStop(1, 'rgba(154,90,255,0)');
        c.fillStyle = gr;
        c.beginPath();
        c.moveTo(cxr, cyr);
        c.lineTo(cxr + Math.cos(ang - w) * len, cyr + Math.sin(ang - w) * len);
        c.lineTo(cxr + Math.cos(ang + w) * len, cyr + Math.sin(ang + w) * len);
        c.closePath();
        c.fill();
      }
      const fl = env(t, 32.2, 32.45, 32.45, 33.2);
      if (fl > 0.01) {
        c.fillStyle = `rgba(210,180,255,${0.6 * fl})`;
        c.fillRect(0, 0, W, H);
      }
    }

    const N = 64;
    for (let i = 0; i < N; i++) {
      const sd = hash(i + 1),
        sp = 0.04 + hash(i + 77) * 0.07,
        u = frac(t * sp + sd),
        x = hash(i + 33) * W + Math.sin(t * 0.8 + i) * 18,
        y = H + 10 - u * (H + 30);
      const col = t < 10 ? PAL[i % 3] : t < 22 ? PAL[(i % 2) * 2] : t < 32 ? PAL[1 + (i % 2) * 2] : PAL[1 + (i % 4 === 0 ? 2 : 0)];
      c.globalAlpha = (0.5 * Math.sin(u * Math.PI) * (0.4 + 0.6 * hash(i + 5))) * (t < 0.5 ? seg(t, 0, 0.5) : 1);
      c.fillStyle = col;
      c.beginPath();
      c.arc(x, y, 1 + hash(i + 9) * 2.2, 0, 6.283);
      c.fill();
    }

    const flow = ease(seg(t, 4.3, 5.6)) * (1 - ease(seg(t, 9.4, 10.2)));
    if (flow > 0.01) {
      const M = Math.round(110 * flow);
      for (let i = 0; i < M; i++) {
        const sd = hash(i + 200),
          u = frac(t * 0.28 + sd),
          th = hash(i + 300) * 6.283 + u * 3.2 + t * 0.4,
          r = u * 250 + 8,
          x = 400 + Math.cos(th) * r * 1.25,
          y = 270 + Math.sin(th) * r * 0.55 - u * 70;
        c.globalAlpha = (1 - u) * 0.85 * flow;
        c.fillStyle = PAL[i % 5];
        c.beginPath();
        c.arc(x, y, 1.2 + (1 - u) * 2.6, 0, 6.283);
        c.fill();
      }
    }

    const d = ST.dag;
    if (d.vis > 0.02 && t > 12 && t < 22.2) {
      const pr = params(t),
        s = Math.sqrt(pr.k / -pr.a),
        xl = pr.h - s,
        xr = pr.h + s;
      for (let k = 0; k < 28; k++) {
        const pp = d.p - k * 0.016;
        if (pp < 0) break;
        const x = xl + (xr - xl) * pp,
          y = pr.a * (x - pr.h) * (x - pr.h) + pr.k;
        c.globalAlpha = (1 - k / 28) * 0.75 * d.vis;
        c.fillStyle = k % 2 ? '#5ee6f2' : '#b46bff';
        c.beginPath();
        c.arc(X2(x) + (hash(k + t * 3) - 0.5) * 4, Y2(y) + (hash(k + 9 + t * 3) - 0.5) * 4, 4.2 * (1 - k / 34), 0, 6.283);
        c.fill();
      }
    }

    if (t > 33.5) {
      const a = ease(seg(t, 33.5, 35));
      for (let i = 0; i < 46; i++) {
        const u = frac(t * 0.18 + hash(i + 500)),
          x = 400 + (hash(i + 600) - 0.5) * 360 + Math.sin(t + i) * 14,
          y = 372 - u * 330;
        c.globalAlpha = Math.sin(u * Math.PI) * 0.8 * a;
        c.fillStyle = i % 5 === 0 ? '#ff4d6d' : i % 2 ? '#b46bff' : '#e9d5ff';
        c.beginPath();
        c.arc(x, y, 1 + hash(i + 700) * 2.2, 0, 6.283);
        c.fill();
      }
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';

    const vg = c.createRadialGradient(400, 225, 230, 400, 225, 480);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,.55)');
    c.fillStyle = vg;
    c.fillRect(0, 0, W, H);
  };

  const curvePath = (pr, xa, xb, n = 56) => {
    let d = '';
    for (let i = 0; i <= n; i++) {
      const x = xa + ((xb - xa) * i) / n,
        y = pr.a * (x - pr.h) * (x - pr.h) + pr.k;
      d += (i ? 'L' : 'M') + X2(x).toFixed(1) + ' ' + Y2(y).toFixed(1);
    }
    return d;
  };
  const update = (t) => {
    const r = R;

    const g1o = 1 - ease(seg(t, 9.6, 10.4));
    op(r.g1, g1o);
    const gs = 0.8 + 0.2 * ease(seg(t, 0.8, 3.2)),
      zoom = 1 + 0.9 * ease(seg(t, 9.0, 10.4));
    r.gGateWrap.setAttribute('transform', `translate(400 272) scale(${(gs * zoom).toFixed(3)}) translate(-400 -272)`);
    op(r.gGate, ease(seg(t, 0.8, 2.6)));
    op(r.gGlow, 0.35 + 0.65 * ease(seg(t, 0.8, 4.4)));
    const open = ease(seg(t, 4.2, 7.2));
    r.gDoorL.setAttribute('transform', `translate(${(-104 * open).toFixed(1)} 0)`);
    r.gDoorR.setAttribute('transform', `translate(${(104 * open).toFixed(1)} 0)`);
    op(r.gPortalBg, ease(seg(t, 4.2, 5.6)));
    op(r.gSwirl, ease(seg(t, 4.6, 6)));
    r.gSwirl.setAttribute('transform', `rotate(${(t * 55).toFixed(1)} 400 272)`);
    r.gRune.setAttribute('transform', `rotate(${(-t * 14).toFixed(1)} 400 205)`);
    op(r.gTag, env(t, 0.5, 1.2, 3.4, 4.2) * (0.7 + 0.3 * Math.sin(t * 14)));
    const ti = env(t, 6.0, 7.4, 9.2, 10.0);
    op(r.gTitleG, ti);
    r.gTitleG.setAttribute('transform', `translate(400 70) scale(${(1.15 - 0.15 * ease(seg(t, 6, 7.4))).toFixed(3)}) translate(-400 -70)`);

    const g2o = env(t, 9.9, 10.6, 21.4, 22.1);
    op(r.g2, g2o);
    if (g2o > 0) {
      const pr = params(t),
        s = Math.sqrt(pr.k / -pr.a),
        xl = pr.h - s,
        xr = pr.h + s;

      const hx = 125,
        hy = 330,
        hin = ease(seg(t, 10.4, 11.4)),
        hout = 1 - ease(seg(t, 15.2, 16.2));
      op(r.g2Hunter, hin * hout);
      r.g2Hunter.setAttribute('transform', `translate(${(hx - 40 * (1 - hin)).toFixed(1)} ${hy})`);
      const th = ease(seg(t, 11.7, 12.2)),
        ang = -125 + 105 * th;
      r.g2Arm.setAttribute('transform', `rotate(${ang.toFixed(1)} 0 -40)`);

      let gd = '';
      for (let x = -2; x <= 10; x++) gd += `M${X2(x)} ${Y2(-1.5)}V${Y2(6.5)}`;
      for (let y = -1; y <= 6; y++) gd += `M${X2(-2)} ${Y2(y)}H${X2(10)}`;
      if (!r.g2Grid._d) {
        r.g2Grid.setAttribute('d', gd);
        r.g2Axes.setAttribute('d', `M${X2(-2)} ${Y2(0)}H${X2(10.2)}M${X2(0)} ${Y2(-1.5)}V${Y2(6.6)}M${X2(10.2) - 9} ${Y2(0) - 5}L${X2(10.2)} ${Y2(0)}L${X2(10.2) - 9} ${Y2(0) + 5}M${X2(0) - 5} ${Y2(6.6) + 9}L${X2(0)} ${Y2(6.6)}L${X2(0) + 5} ${Y2(6.6) + 9}`);
        r.g2Grid._d = 1;
      }
      op(r.g2Grid, ease(seg(t, 10.4, 11.6)) * 0.18);
      op(r.g2Axes, ease(seg(t, 10.4, 11.6)));

      op(r.g2Fx, ease(seg(t, 10.8, 11.6)) * (1 - ease(seg(t, 14.4, 15.2))));
      op(r.g2Eq, ease(seg(t, 14.6, 15.4)));
      r.eqA.textContent = f1(pr.a);
      r.eqH.textContent = pr.h >= 0 ? '− ' + f1(pr.h) : '+ ' + f1(-pr.h);
      r.eqK.textContent = pr.k >= 0 ? '+ ' + f1(pr.k) : '− ' + f1(-pr.k);

      const fly = clamp((t - 12.0) / 3.0),
        xc = t < 15 ? xl + (xr - xl) * fly : xr;
      if (t >= 12) {
        const dd = curvePath(pr, xl, Math.max(xl + 0.001, xc));
        r.g2Curve.setAttribute('d', dd);
        r.g2Under.setAttribute('d', dd);
        op(r.g2Curve, 1);
        op(r.g2Under, 1);
      } else {
        op(r.g2Curve, 0);
        op(r.g2Under, 0);
      }

      const tg = ease(seg(t, 13, 14)) * (1 - ease(seg(t, 15.4, 16)));
      op(r.g2Tgt, tg);
      r.g2Tgt.setAttribute('transform', `translate(${X2(9)} ${Y2(0)})`);
      const hit = seg(t, 15.0, 15.8);
      op(r.g2Hit, hit > 0 && hit < 1 ? 1 - hit : 0);
      setA(r.g2Hit, { cx: X2(9), cy: Y2(0), r: 6 + 40 * hit });

      let p = 0,
        dv = 0;
      if (t >= 12 && t < 21.9) {
        if (t < 15) p = fly;
        else if (t < 15.6) p = 1;
        else p = frac((t - 15.6) / 3.4);
        dv = ease(seg(t, 12, 12.3)) * (1 - ease(seg(t, 21.4, 21.9)));
        if (t >= 15 && t < 15.6) dv *= 1 - seg(t, 15.2, 15.6);
        const x = xl + (xr - xl) * p,
          y = pr.a * (x - pr.h) * (x - pr.h) + pr.k,
          dy = 2 * pr.a * (x - pr.h),
          an = (Math.atan2(-32.5 * dy, 50) * 180) / Math.PI;
        r.g2Dag.setAttribute('transform', `translate(${X2(x).toFixed(1)} ${Y2(y).toFixed(1)}) rotate(${an.toFixed(1)})`);
        ST.dag = { x: X2(x), y: Y2(y), p, vis: dv };
      } else ST.dag = { x: 0, y: 0, p: 0, vis: 0 };
      op(r.g2Dag, dv);

      const vv = ease(seg(t, 15.5, 16.2)),
        vx = X2(pr.h),
        vy = Y2(pr.k);
      op(r.g2Vtx, vv);
      r.g2Vtx.setAttribute('transform', `translate(${vx.toFixed(1)} ${vy.toFixed(1)})`);
      r.g2VR.setAttribute('r', (12 + 8 * frac(t * 0.9)).toFixed(1));
      r.g2VR.setAttribute('opacity', (1 - frac(t * 0.9)).toFixed(2));
      op(r.g2VtxL, ease(seg(t, 15.8, 16.5)) * (1 - ease(seg(t, 20.6, 21.2))) * (t > 16.5 ? 1 : 1));
      setA(r.g2VtxL, { x: vx.toFixed(1), y: (vy - 24).toFixed(1) });

      const ax = ease(seg(t, 16.6, 17.4));
      op(r.g2Axis, ax);
      setA(r.g2Axis, { x1: vx.toFixed(1), x2: vx.toFixed(1), y1: vy.toFixed(1), y2: (vy + (Y2(0) - vy) * ax + 24 * ax).toFixed(1) });
      op(r.g2AxisL, ease(seg(t, 17.2, 17.9)));
      setA(r.g2AxisL, { x: vx.toFixed(1), y: 311 });

      const pa = ease(seg(t, 17.6, 18.3)) * (1 - ease(seg(t, 21.2, 21.8))),
        dd2 = s * (0.55 + 0.3 * Math.sin(t * 1.7)),
        py = Y2(pr.a * dd2 * dd2 + pr.k);
      op(r.g2Pair, pa * 0.9);
      op(r.g2P1, pa);
      op(r.g2P2, pa);
      setA(r.g2Pair, { x1: X2(pr.h - dd2).toFixed(1), x2: X2(pr.h + dd2).toFixed(1), y1: py.toFixed(1), y2: py.toFixed(1) });
      setA(r.g2P1, { cx: X2(pr.h - dd2).toFixed(1), cy: py.toFixed(1) });
      setA(r.g2P2, { cx: X2(pr.h + dd2).toFixed(1), cy: py.toFixed(1) });
    }

    const g3o = env(t, 21.9, 22.4, 31.5, 32.1);
    op(r.g3, g3o);
    if (g3o > 0) {
      const cardsO = 1 - ease(seg(t, 28.0, 28.7));
      op(r.g3Cards, cardsO);
      op(r.g3Arr, cardsO);
      r.cards.forEach((c, i) => {
        const a = ease(seg(t, 22.3 + i * 0.35, 23.0 + i * 0.35));
        c.setAttribute('transform', `translate(${[25, 280, 535][i]} ${(85 + 24 * (1 - a) - 18 * ease(seg(t, 28, 28.7))).toFixed(1)})`);
        op(c, a);
        const cn = ease(seg(t, 24.8, 25.4));
        c.querySelector('.cg').setAttribute('opacity', (1 - cn).toFixed(2));
        c.querySelector('.cn').setAttribute('opacity', cn.toFixed(2));
      });
      r.c1Ring.setAttribute('transform', `translate(120 100) rotate(${(t * 70).toFixed(1)})`);
      const a1 = ease(seg(t, 25.4, 26.6)),
        a2 = ease(seg(t, 27.3, 28.0));
      r.ar1.setAttribute('stroke-dashoffset', (1000 - 1000 * a1 * 0.28).toFixed(1));
      r.ar2.setAttribute('stroke-dashoffset', (1000 - 1000 * ease(seg(t, 27.0, 28.0)) * 0.28).toFixed(1));
      op(r.ah1, a1 > 0.98 ? 1 : 0);
      op(r.ah2, ease(seg(t, 27.0, 28.0)) > 0.98 ? 1 : 0);
      op(r.ex1, a1 * cardsO);
      op(r.ex2, ease(seg(t, 27.2, 28.0)) * cardsO);

      const po = ease(seg(t, 28.5, 29.2)) * (1 - ease(seg(t, 31.4, 32.0)));
      op(r.g3Plot, po);
      if (po > 0) {
        if (!r.p3Grid._d) {
          let gd = '';
          for (let x = -2; x <= 4; x++) gd += `M${X3(x)} ${Y3(-0.8)}V${Y3(5)}`;
          for (let y = 0; y <= 5; y++) gd += `M${X3(-2.5)} ${Y3(y)}H${X3(4.5)}`;
          r.p3Grid.setAttribute('d', gd);
          r.p3Axes.setAttribute('d', `M${X3(-2.5)} ${Y3(0)}H${X3(4.6)}M${X3(0)} ${Y3(-0.8)}V${Y3(5.1)}`);
          r.p3Grid._d = 1;
        }
        const dr = ease(seg(t, 28.7, 29.8)),
          xa = -1.15,
          xb = xa + 4.3 * dr;
        let d = '';
        for (let i = 0; i <= 44; i++) {
          const x = xa + ((xb - xa) * i) / 44,
            y = -(x - 1) * (x - 1) + 4;
          d += (i ? 'L' : 'M') + X3(x).toFixed(1) + ' ' + Y3(y).toFixed(1);
        }
        r.p3Curve.setAttribute('d', dr > 0.01 ? d : '');
        const pop = (a, b) => {
          const v = ease(seg(t, a, b));
          return { v, s: v < 1 ? 0.3 + 0.9 * v + 0.1 * Math.sin(v * 3.1416) : 1 + 0.06 * Math.sin(t * 4) };
        };
        const s1 = pop(29.9, 30.5),
          b1 = pop(30.6, 31.2),
          p1 = pop(31.2, 31.8);
        op(r.p3Shield, s1.v);
        r.p3Shield.setAttribute('transform', `translate(${X3(1)} ${Y3(4) - 4}) scale(${s1.s.toFixed(3)})`);
        op(r.p3Bridge, b1.v);
        const x0 = X3(-1),
          x1 = X3(3),
          yb = Y3(0),
          prog = b1.v;
        r.p3Deck.setAttribute('d', `M${x0} ${yb}H${(x0 + (x1 - x0) * prog).toFixed(1)}`);
        r.p3Arc.setAttribute('d', `M${x0} ${yb}Q${(x0 + x1) / 2} ${(yb - 120 * prog).toFixed(1)} ${(x0 + (x1 - x0) * prog).toFixed(1)} ${yb}`);
        let sp = '';
        for (let i = 1; i < 8; i++) {
          const u = i / 8,
            xx = x0 + (x1 - x0) * u;
          sp += `M${xx.toFixed(1)} ${yb}V${(yb - 120 * prog * 2 * u * (1 - u) * 1).toFixed(1)}`;
        }
        r.p3Susp.setAttribute('d', sp);
        r.p3Pyl.setAttribute('d', `M${x0} ${yb + 8}V${yb - 10}M${x1} ${yb + 8}V${yb - 10}`);
        op(r.p3Portal, p1.v);
        r.p3Portal.setAttribute('transform', `translate(${X3(0)} ${Y3(3)}) scale(${p1.s.toFixed(3)})`);
        r.p3PR.setAttribute('transform', `rotate(${(t * 90).toFixed(1)})`);
        op(r.p3L0, ease(seg(t, 30.2, 30.8)));
        setA(r.p3L0, { x: X3(1) + 30, y: Y3(4) + 4 });
        op(r.p3L1, ease(seg(t, 30.9, 31.4)));
        setA(r.p3L1, { x: X3(1), y: Y3(0) + 38 });
        op(r.p3L2, ease(seg(t, 31.4, 31.9)));
        setA(r.p3L2, { x: X3(0) - 34, y: Y3(3) + 6 });
      }
    }

    const g4o = ease(seg(t, 32.0, 32.4));
    op(r.g4, g4o);
    if (g4o > 0) {
      const ar = env(t, 32.3, 32.9, 33.8, 34.7);
      op(r.g4Arise, ar);
      r.g4Arise.setAttribute('transform', `translate(400 250) scale(${(1.45 - 0.45 * ease(seg(t, 32.3, 33.4)) + 0.3 * ease(seg(t, 33.8, 34.7))).toFixed(3)}) translate(-400 -250)`);
      const mo = ease(seg(t, 32.9, 34.7));
      op(r.g4Mon, mo);
      r.g4Mon.setAttribute('transform', `translate(0 ${(34 * (1 - mo)).toFixed(1)})`);
      op(r.g4Eyes, 0.75 + 0.25 * Math.sin(t * 5));

      r.sold.forEach((s, i) => {
        const a = ease(seg(t, 34.6 + i * 0.16, 35.3 + i * 0.16));
        op(s.el, a);
        s.el.setAttribute('transform', `translate(${s.x} ${(s.y + 24 * (1 - a)).toFixed(1)}) scale(${s.sc})`);
      });
      op(r.g4Sold, 1);

      r.tiles.forEach((tl, i) => {
        const a = ease(seg(t, 35.2 + i * 0.4, 35.8 + i * 0.4));
        op(tl.el, a);
        tl.el.setAttribute('transform', `translate(${tl.x} ${(tl.y + 14 * (1 - a)).toFixed(1)}) scale(${(0.6 + 0.4 * a).toFixed(3)})`);
      });
      const co = ease(seg(t, 37.6, 38.3));
      op(r.g4Call, co);
      r.g4Call.setAttribute('transform', `translate(400 70) scale(${(0.92 + 0.08 * co).toFixed(3)}) translate(-400 -70)`);
    }
  };

  const render = (t) => {
    if (!R || !R.root.isConnected) return;
    update(t);
    canvasFrame(t);

    const lang = L();
    let ci = -1;
    for (let i = 0; i < CUES.length; i++) if (t >= CUES[i][0] && t < CUES[i][1]) ci = i;
    if (ci !== S.lastCue || S.lang !== (window.I18N ? I18N.lang : 'id')) {
      R.sub.textContent = ci >= 0 ? lang.sub[ci] : '';
      R.sub.classList.toggle('on', ci >= 0);
      S.lastCue = ci;
      S.lang = window.I18N ? I18N.lang : 'id';
    }
    const sc = t < 10 ? 0 : t < 22 ? 1 : t < 32 ? 2 : 3;
    if (R.chip.dataset.s !== String(sc) + S.lang) {
      R.chip.dataset.s = String(sc) + S.lang;
      R.chip.textContent = lang.scenes[sc];
    }
    R.time.textContent = `${mmss(t)} / ${mmss(DUR)}`;
    R.end.hidden = !(S.started && t >= 39.2);
    R.seek.value = Math.round(t * 10);
    R.seek.style.setProperty('--p', ((t / DUR) * 100).toFixed(1) + '%');
  };
  const applyLang = () => {
    const l = L(),
      r = R;
    r.root.setAttribute('aria-label', l.ui.region);
    r.gTag.textContent = l.tag;
    r.gChal.textContent = l.chal;
    r.cards.forEach((c, i) => (c.querySelector('.ct').textContent = [l.vf, l.sf, l.ff][i]));
    r.ex1l.textContent = l.expand;
    r.ex2l.textContent = l.factor;
    r.g2VtxL.textContent = l.vtx;
    r.g2AxisL.textContent = l.axis;
    r.p3L0.textContent = l.lbl[0];
    r.p3L1.textContent = l.lbl[1];
    r.p3L2.textContent = l.lbl[2];
    r.g4C1.textContent = l.call;
    r.cta.textContent = l.cta;
    r.pt.textContent = l.ui.poster;
    r.ps.textContent = l.ui.posterSub;
    r.big.setAttribute('aria-label', l.ui.poster);
    r.bPlay.lastChild.textContent = l.ui.play;
    r.bPause.lastChild.textContent = l.ui.pause;
    r.bReplay.lastChild.textContent = l.ui.replay;
    r.seek.setAttribute('aria-label', l.ui.seek);
    r.bSfx.title = l.ui.sfxTitle;
    uiSync();
    S.lastCue = -2;
    S.lang = '';
    r.chip.dataset.s = '';
  };
  const uiSync = () => {
    if (!R) return;
    const l = L();
    R.bPlay.disabled = S.playing;
    R.bPause.disabled = !S.playing;
    R.bPlay.classList.toggle('on', S.playing);
    R.bSfx.innerHTML = (S.sfx ? ICO.snd : ICO.mute) + '<span>' + (S.sfx ? l.ui.sfxOn : l.ui.sfxOff) + '</span>';
    R.bSfx.setAttribute('aria-pressed', S.sfx ? 'false' : 'true');
    R.bSfx.classList.toggle('off', !S.sfx);
    R.poster.hidden = S.started;
    R.stage.classList.toggle('playing', S.playing);
  };

  const siteVisible = () => {
    const s = $$('site');
    return !!R && R.root.isConnected && s && !s.hidden;
  };
  const loop = (ts) => {
    raf = 0;
    if (!S.playing) return;
    if (!siteVisible()) return pause();
    const dt = lastTs ? Math.min(0.1, (ts - lastTs) / 1000) : 0;
    lastTs = ts;
    S.t = Math.min(DUR, S.t + dt);
    if (AC && S.sfx !== false) {
      EV.forEach((e) => {
        if (e[0] > S.prev && e[0] <= S.t) {
          try {
            e[1]();
          } catch (x) {}
        }
      });
    }
    S.prev = S.t;
    droneFrame(S.t);
    render(S.t);
    if (S.t >= DUR) {
      S.playing = false;
      S.ended = true;
      droneFrame(S.t);
      uiSync();
      return;
    }
    raf = requestAnimationFrame(loop);
  };
  const play = () => {
    if (!R) return;
    if (S.ended || S.t >= DUR - 0.05) {
      S.t = 0;
      S.prev = 0;
      S.ended = false;
    }
    audioInit();
    if (AC && AC.state === 'suspended') AC.resume();
    S.started = true;
    S.playing = true;
    lastTs = 0;
    uiSync();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  };
  const pause = () => {
    S.playing = false;
    cancelAnimationFrame(raf);
    raf = 0;
    droneFrame(S.t);
    if (AC && AC.state === 'running') setTimeout(() => !S.playing && AC.suspend(), 450);
    uiSync();
    render(S.started ? S.t : POSTER_T);
  };
  const replay = () => {
    S.t = 0;
    S.prev = 0;
    S.ended = false;
    play();
  };
  const seek = (t) => {
    S.t = clamp(t, 0, DUR);
    S.prev = S.t;
    S.started = true;
    S.ended = S.t >= DUR;
    uiSync();
    render(S.t);
  };
  const resize = () => {
    if (!R || !R.root.isConnected) return;
    const w = R.stage.clientWidth || 800,
      dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(((w * H) / W) * dpr);
    cs = cv.width / W;
    render(S.started ? S.t : POSTER_T);
  };

  const init = () => {
    const root = $$('cine');
    cancelAnimationFrame(raf);
    raf = 0;
    if (!root) {
      R = null;
      return;
    }

    const wasPlaying = S.playing;
    R = {
      root,
      stage: $$('cnStage'),
      sub: $$('cnSub'),
      chip: $$('cnChip'),
      time: $$('cnTime'),
      poster: $$('cnPoster'),
      end: $$('cnEnd'),
      big: $$('cnBig'),
      pt: $$('cnPT'),
      ps: $$('cnPS'),
      cta: $$('cnCta'),
      bPlay: $$('cnPlay'),
      bPause: $$('cnPause'),
      bReplay: $$('cnReplay'),
      bSfx: $$('cnSfx'),
      seek: $$('cnSeek'),
    };
    ['g1', 'gGateWrap', 'gGate', 'gGlow', 'gDoorL', 'gDoorR', 'gPortalBg', 'gSwirl', 'gRune', 'gTag', 'gTitleG', 'gTitle', 'gChal', 'g2', 'g2Grid', 'g2Axes', 'g2Fx', 'g2Eq', 'eqA', 'eqH', 'eqK', 'g2Hunter', 'g2Arm', 'g2Under', 'g2Curve', 'g2Tgt', 'g2Hit', 'g2Axis', 'g2AxisL', 'g2Pair', 'g2P1', 'g2P2', 'g2Vtx', 'g2VR', 'g2VtxL', 'g2Dag', 'g3', 'g3Cards', 'g3Arr', 'c1Ring', 'ar1', 'ar2', 'ah1', 'ah2', 'ex1', 'ex2', 'ex1l', 'ex2l', 'g3Plot', 'p3Eq', 'p3Grid', 'p3Axes', 'p3Curve', 'p3Shield', 'p3Bridge', 'p3Deck', 'p3Arc', 'p3Susp', 'p3Pyl', 'p3Portal', 'p3PR', 'p3L0', 'p3L1', 'p3L2', 'g4', 'g4Sold', 'g4Mon', 'g4Eyes', 'g4Tiles', 'g4Arise', 'g4Call', 'g4C1'].forEach((id) => (R[id] = $$(id)));
    R.cards = [$$('c0'), $$('c1'), $$('c2')];

    const SD = [[120, 368, 1.5], [205, 366, 1.25], [290, 364, 1.0], [680, 368, 1.5], [595, 366, 1.25], [510, 364, 1.0]];
    R.g4Sold.innerHTML = '';
    R.sold = SD.map((s, i) => {
      const g = document.createElementNS(NS, 'use');
      g.setAttribute('href', '#cnSold');
      g.setAttribute('opacity', 0);
      R.g4Sold.appendChild(g);
      return { el: g, x: s[0], y: s[1], sc: s[2] };
    });

    const TA = [170, 145, 120, 60, 35, 10],
      TC = ['#4d8bff', '#4cc38a', '#ffd86b', '#f472a8', '#ff8a4d', '#b46bff'];
    R.g4Tiles.innerHTML = '';
    R.tiles = 'EDCBAS'.split('').map((ch, i) => {
      const g = document.createElementNS(NS, 'g'),
        a = (TA[i] * Math.PI) / 180;
      g.setAttribute('opacity', 0);
      g.innerHTML = `<rect x="-24" y="-24" width="48" height="48" rx="11" fill="rgba(8,10,40,.9)" stroke="${TC[i]}" stroke-width="3" filter="url(#cnG)"/><text y="9" text-anchor="middle" fill="${TC[i]}" font-size="28" font-weight="800" font-family="Orbitron,sans-serif">${ch}</text>`;
      R.g4Tiles.appendChild(g);
      return { el: g, x: +(400 + 330 * Math.cos(a)).toFixed(1), y: +(335 - 170 * Math.sin(a)).toFixed(1) };
    });
    cv = $$('cnCv');
    cx = cv.getContext('2d');
    applyLang();

    R.big.onclick = play;
    R.poster.onclick = (e) => e.target === R.poster && play();
    R.bPlay.onclick = play;
    R.bPause.onclick = pause;
    R.bReplay.onclick = replay;
    R.bSfx.onclick = () => setSfx(!S.sfx);
    R.seek.oninput = () => seek(R.seek.value / 10);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(R.stage);
    resize();
    if (wasPlaying) {
      S.playing = false;
      play();
    } else {
      uiSync();
      render(S.started ? S.t : POSTER_T);
    }
  };
  document.addEventListener('visibilitychange', () => document.hidden && S.playing && pause());
  window.addEventListener('resize', () => R && resize());

  return { section, init, play, pause, replay, seek, state: S, DUR };
})();
