const RK = [
  {
    c: 'P',
    n: 'Pretest',
    xp: 0,
    t: 'Tes awal',
    col: '#8e9ad0',
    info: 'Tes awal 14 soal untuk mengukur kemampuan awalmu. Jawab sebisamu, hanya ada satu kesempatan dan tidak ada XP. Hasilnya dibandingkan dengan posttest di akhir (N-gain).',
  },
  {
    c: '0',
    n: 'Gerbang',
    xp: 50,
    t: 'Game belati',
    col: '#5ee6f2',
    info: 'Intro: Recreating Gravity. Lempar belati tiga kali. Skor total minimal 35 untuk membuka Rank E.',
  },
  {
    c: 'E',
    n: 'Rank E',
    xp: 100,
    t: 'Vertex form',
    col: '#4d8bff',
    part: 1,
    info: 'Fungsi induk $y = x^2$. Setiap fungsi kuadrat adalah transformasi fungsi induk. Bentuk vertex: $y = a(x - h)^2 + k$, vertex $(h, k)$, sumbu simetri $x = h$. Stage paling mudah.',
  },
  {
    c: 'D',
    n: 'Rank D',
    xp: 150,
    t: 'Grafik vertex form',
    col: '#4cc38a',
    part: 1,
    info: 'Langkah menggambar: (a) concavity, (b) vertex, (c) sumbu simetri, (d) interval naik turun, (e) y-intercept, (f) domain dan range. Klik kartu contoh untuk membukanya.',
  },
  {
    c: 'C',
    n: 'Rank C',
    xp: 200,
    t: 'Standard form',
    col: '#ffd86b',
    part: 1,
    info: 'Bentuk standar $y = ax^2 + bx + c$ dengan $a \\neq 0$. Jika $a$ positif parabola terbuka ke atas, jika negatif ke bawah. Sumbu simetri $x = -\\dfrac{b}{2a}$.',
  },
  {
    c: 'B',
    n: 'Rank B',
    xp: 250,
    t: 'Factored form',
    col: '#f472a8',
    part: 2,
    info: 'Bentuk faktor $y = a(x - p)(x - q)$. Akar di $x = p$ dan $x = q$, sumbu simetri di tengahnya $x = \\dfrac{p + q}{2}$. Selesaikan Architectural Bridge Challenge.',
  },
  {
    c: 'A',
    n: 'Rank A',
    xp: 300,
    t: 'Menggabungkan tiga bentuk',
    col: '#b03fd6',
    part: 2,
    info: 'Dungeon playful. Ketik fungsi apa saja dan lihat grafiknya. Makin besar $|a|$, makin sempit parabolanya.',
  },
  {
    c: 'S',
    n: 'Rank S',
    xp: 400,
    t: 'Sketch dan explain',
    col: '#ffffff',
    part: 2,
    info: 'Dungeon tertinggi dan tersulit. Gambar bentuk grafik, temukan x-intercept, lalu y-intercept, vertex, dan sumbu simetri.',
  },
  {
    c: 'R',
    n: 'Wrap-up',
    xp: 50,
    t: 'Review dan Reflection',
    col: '#ff9a5a',
    part: 2,
    info: 'Temukan persamaan dari grafik, baca Remember This, lalu tulis Reflection. Remember: vertex $y = a(x - h)^2 + k$, standar $y = ax^2 + bx + c$, faktor $y = a(x - p)(x - q)$.',
  },
  {
    c: 'T',
    n: 'Posttest',
    xp: 0,
    t: 'Tes akhir',
    col: '#c0c8ff',
    info: 'Tes akhir 5 soal setara pretest. Hanya satu kesempatan dan tidak ada XP. Peningkatanmu dari pretest dihitung sebagai N-gain.',
  },
];

const AX = RK.filter((r) => 'EDCBAS'.includes(r.c)),
  PART = { 1: 'rxe5muqn', 2: 'czmkunwt' };

const TT = [
  [0, 'Shadow Soldier'],
  [400, 'Shadow Knight'],
  [800, 'Shadow Commander'],
  [1200, 'Shadow Monarch'],
];

const SUM = {
  E: 'Fungsi induk dan transformasi grafik lewat vertex form. Stage paling mudah.',
  D: 'Menggambar grafik vertex form: concavity, vertex, sumbu simetri, interval, intercept, domain dan range.',
  C: 'Bentuk standar: arah bukaan, sumbu simetri, dan mencari grafik yang cocok.',
  B: 'Bentuk faktor, akar-akar, dan Architectural Bridge Challenge.',
  A: 'Dungeon playful: ketik fungsi apa saja dan bandingkan bentuk grafiknya.',
  S: 'Dungeon tertinggi: gambar grafik, temukan x-intercept, y-intercept, vertex, dan sumbu simetri.',
};
const R = (s) => new RegExp(s);

const Q = {
  E: [
    {
      t: 'mc',
      tag: 'MULTIPLE QUESTION',
      q: 'Atur slider $h = 3$ dan $k = -2$ pada $y = a(x - h)^2 + k$. Di mana vertex parabola?',
      o: ['$(3, -2)$', '$(-3, 2)$', '$(3, 2)$', '$(-2, 3)$'],
      a: [0],
      show: '$(3, -2)$',
    },
    {
      t: 'open',
      tag: 'DISCUSSION QUESTION',
      q: 'Bagaimana sumbu simetri bergerak terhadap vertex? Jika vertex di $(h, k)$, apa persamaan sumbu simetrinya?',
      min: 12,
      re: /x\s*=\s*h/i,
    },
  ],
  D: [
    {
      t: 'mc',
      tag: 'MULTIPLE QUESTION',
      q: 'Maura, product manager aplikasi busana, memodelkan profit (ribu dolar) terhadap harga langganan bulanan $x$: $p(x) = -(x - 6)^2 + 20$. Apa interval naik dan turunnya?',
      o: [
        'Naik $(-\\infty, 6)$, turun $(6, \\infty)$',
        'Naik $(6, \\infty)$, turun $(-\\infty, 6)$',
        'Naik $(-\\infty, 20)$, turun $(20, \\infty)$',
        'Naik $(-\\infty, -6)$, turun $(-6, \\infty)$',
      ],
      a: [0],
      show: 'Naik $(-\\infty, 6)$, turun $(6, \\infty)$',
    },
    {
      t: 'fill',
      tag: 'CHALLENGER QUESTION',
      q: 'Tentukan karakteristik $f(x) = -2(x + 1)^2 + 5$.',
      f: [
        { l: 'Concavity (atas/bawah)', r: /bawah|down|下|아래/ },
        { l: 'Vertex', r: /^\(?-1,5\)?$/ },
        { l: 'Sumbu simetri', r: /^x=-1$/ },
        { l: '$y$-intercept', r: /^(\(0,3\)|3)$/ },
      ],
      show: 'Terbuka ke bawah, vertex $(-1, 5)$, sumbu $x = -1$, $y$-intercept $(0, 3)$',
    },
  ],
  C: [
    {
      t: 'mc',
      tag: 'MULTIPLE CHOICE',
      q: 'Temukan grafik dari $y = x^2 - 4x + 3$.',
      o: ['Grafik A', 'Grafik B', 'Grafik C'],
      a: [0],
      show: 'Grafik A (vertex $(2, -1)$)',
      html: '<div class="minis"><canvas></canvas><canvas></canvas><canvas></canvas></div>',
      draw(b) {
        [(x) => (x - 2) ** 2 - 1, (x) => -((x - 2) ** 2) + 1, (x) => (x + 2) ** 2 - 1].forEach(
          (f, i) => plot($$('canvas', b)[i], [{ f, col: '#4d8bff' }], { x: [-6, 6], y: [-4, 8] }),
        );
      },
    },
    {
      t: 'fill',
      tag: 'SEMI-PRO QUESTION',
      q: 'Dari grafik yang kamu temukan, tentukan domain dan range (boleh dicoret di kertas dulu).',
      f: [
        { l: 'Domain', r: /semua|all|real|-∞.*∞|r$|ℝ|すべて|全|実数|전체|모든|실수/ },
        { l: 'Range', r: /(≥|>=|\[)-?1?.*-1|y≥-1|y>=-1/ },
      ],
      show: 'Domain: semua bilangan real. Range: $y \\ge -1$',
    },
  ],
  B: [
    {
      t: 'mc',
      tag: 'CHALLENGE 1/5',
      q: 'Jembatan lama: kayu 350 ft di kiri, 1200 ft logam modern, lalu kayu 350 ft di kanan. Kota membangun ulang dengan desain parabola saja. Bagian logam 1200 ft melintang dari $x = 0$ sampai $x = 1200$ dengan puncak 360 ft. Apa persamaan parabola jembatan baru?',
      o: [
        '$y = -0{,}001x(x - 1200)$',
        '$y = 0{,}001x(x - 1200)$',
        '$y = -0{,}001(x + 1200)(x - 1200)$',
        '$y = -0{,}001x(x + 1200)$',
      ],
      a: [0],
      show: '$y = -0{,}001x(x - 1200)$',
      html: '<canvas class="plot" width="560" height="220"></canvas>',
      draw(b) {
        plot($('canvas', b), [{ f: (x) => -0.001 * x * (x - 1200), col: '#f472a8' }], {
          x: [-100, 1300],
          y: [-50, 420],
          pts: [
            { x: 0, y: 0, l: '(0,0)' },
            { x: 1200, y: 0, l: '(1200,0)' },
            { x: 600, y: 360, l: '(600,360)' },
          ],
          axis: 600,
        });
      },
    },
    {
      t: 'mc',
      tag: 'CHALLENGE 2/5',
      q: 'Berapa nilai $c$ yang paling mungkin pada bentuk standar $y = ax^2 + bx + c$ untuk jembatan baru?',
      o: ['Nol', 'Bilangan negatif', 'Bilangan positif'],
      a: [0],
      show: 'Nol, karena grafik melewati titik $(0, 0)$',
    },
    {
      t: 'mc',
      tag: 'CHALLENGE 3/5',
      q: 'Jembatan lama memiliki vertex setinggi 300 ft. Apakah vertex jembatan baru (360 ft) lebih besar atau lebih kecil?',
      o: ['Lebih besar', 'Lebih kecil'],
      a: [0],
      show: 'Lebih besar ($360 \\gt 300$)',
    },
    {
      t: 'mc',
      tag: 'CHALLENGE 4/5',
      q: 'Dengan $y = -0{,}001x(x - 1200)$, berapa $y$-intercept saat $x = 0$?',
      o: ['$(0, 0)$', '$(0, 360)$', '$(0, 1200)$', '$(0, -1200)$'],
      a: [0],
      show: '$(0, 0)$',
    },
    {
      t: 'open',
      tag: 'CHALLENGE 5/5',
      q: 'Banyak jembatan nyata memakai parabola. Cari informasinya, lalu tulis persamaan yang menggambarkan salah satu jembatan itu.',
      min: 20,
    },
  ],
  A: [
    {
      t: 'mc',
      tag: 'MULTIPLE QUESTION',
      q: 'Fungsi mana yang parabolanya paling sempit?',
      o: ['$y = 0{,}5x^2$', '$y = x^2$', '$y = 3x^2$'],
      a: [2],
      show: '$y = 3x^2$ ($|a|$ terbesar)',
    },
  ],
  S: [
    {
      t: 'mc',
      tag: 'MULTIPLE CHOICE',
      q: 'Manakah $x$-intercept dari $y = x^2 - 2x - 8$ (applet kedua)? Pilih semua yang benar.',
      o: ['$x = -2$', '$x = 4$', '$x = 2$', '$x = -4$', '$x = 8$'],
      a: [0, 1],
      multi: 1,
      show: '$x = -2$ dan $x = 4$',
    },
    {
      t: 'fill',
      tag: 'PEAK QUESTION',
      q: 'Di mana $y$-intercept, vertex, dan sumbu simetri pada grafik $y = x^2 - 2x - 8$ (applet ketiga)?',
      f: [
        { l: '$y$-intercept', r: /^\(?0,-8\)?$/ },
        { l: 'Vertex', r: /^\(?1,-9\)?$/ },
        { l: 'Sumbu simetri', r: /^x=1$/ },
      ],
      show: '$y$-intercept $(0, -8)$, vertex $(1, -9)$, sumbu $x = 1$',
    },
  ],
  R: [
    {
      t: 'mc',
      tag: 'MULTIPLE CHOICE',
      q: 'Tentukan persamaan dari grafik (vertex $(1, -4)$, melalui $(3, 0)$).',
      o: ['$y = (x - 1)^2 - 4$', '$y = (x + 1)^2 - 4$', '$y = -(x - 1)^2 - 4$', '$y = (x - 1)^2 + 4$'],
      a: [0],
      show: '$y = (x - 1)^2 - 4$',
      html: '<canvas class="plot" width="480" height="260"></canvas>',
      draw(b) {
        plot($('canvas', b), [{ f: (x) => (x - 1) ** 2 - 4 }], {
          x: [-4, 6],
          y: [-6, 8],
          pts: [
            { x: 1, y: -4, l: '(1,-4)' },
            { x: 3, y: 0, l: '(3,0)' },
          ],
        });
      },
    },
    {
      t: 'open',
      tag: 'REFLECTION',
      q: 'Setelah belajar Part 1 sampai Part 2, bagikan pendapatmu tentang aktivitas ini.',
      min: 20,
    },
  ],
};

const MC = (tag, q, o, a, show, more = {}) => Object.assign({ t: 'mc', tag, q, o, a, show }, more);
Q.P = [
  MC(
    'PRETEST 1',
    'Bentuk umum fungsi kuadrat adalah...',
    ['$y = ax^2 + bx + c$, dengan $a \\neq 0$', '$y = ax + b$', '$y = \\dfrac{a}{x}$', '$y = ax^3 + b$'],
    [0],
    '$y = ax^2 + bx + c$',
  ),
  MC(
    'PRETEST 2',
    'Vertex dari $y = (x - 4)^2 + 1$ adalah...',
    ['$(4, 1)$', '$(-4, 1)$', '$(4, -1)$', '$(1, 4)$'],
    [0],
    '$(4, 1)$',
  ),
  MC(
    'PRETEST 3',
    'Parabola $y = -3x^2 + 2$ terbuka ke...',
    ['Bawah', 'Atas', 'Kanan', 'Kiri'],
    [0],
    'Bawah',
  ),
  MC(
    'PRETEST 4',
    'Sumbu simetri dari $y = x^2 - 6x + 5$ adalah...',
    ['$x = 3$', '$x = 6$', '$x = -3$', '$x = 5$'],
    [0],
    '$x = 3$',
  ),
  MC(
    'PRETEST 5',
    '$y$-intercept dari $y = 2x^2 + 3x - 7$ adalah...',
    ['$(0, -7)$', '$(0, 7)$', '$(0, 3)$', '$(-7, 0)$'],
    [0],
    '$(0, -7)$',
  ),
];
Q.T = [
  MC(
    'POSTTEST 1',
    'Manakah yang merupakan fungsi kuadrat?',
    ['$y = 3x^2 - x + 4$', '$y = 3x + 4$', '$y = \\dfrac{1}{x^2}$', '$y = x^3 - x$'],
    [0],
    '$y = 3x^2 - x + 4$',
  ),
  MC(
    'POSTTEST 2',
    'Vertex dari $y = (x + 2)^2 - 5$ adalah...',
    ['$(-2, -5)$', '$(2, -5)$', '$(-2, 5)$', '$(5, -2)$'],
    [0],
    '$(-2, -5)$',
  ),
  MC(
    'POSTTEST 3',
    'Parabola $y = 0{,}5x^2 - 4$ terbuka ke...',
    ['Atas', 'Bawah', 'Kanan', 'Kiri'],
    [0],
    'Atas',
  ),
  MC(
    'POSTTEST 4',
    'Sumbu simetri dari $y = x^2 + 8x + 3$ adalah...',
    ['$x = -4$', '$x = 4$', '$x = 8$', '$x = -8$'],
    [0],
    '$x = -4$',
  ),
  MC(
    'POSTTEST 5',
    '$y$-intercept dari $y = -x^2 + 5x + 9$ adalah...',
    ['$(0, 9)$', '$(0, -9)$', '$(0, 5)$', '$(9, 0)$'],
    [0],
    '$(0, 9)$',
  ),
];
Q.E.push(
  MC(
    'MULTIPLE QUESTION',
    'Pada $y = 2(x - 1)^2 + 3$, apa efek $a = 2$ dibandingkan $y = (x - 1)^2 + 3$?',
    [
      'Parabola lebih sempit',
      'Parabola lebih lebar',
      'Parabola bergeser ke atas',
      'Parabola terbuka ke bawah',
    ],
    [0],
    'Parabola lebih sempit',
    {
      hint: 'Bandingkan $|a|$ dengan 1.',
      exp: 'Jika $|a| \\gt 1$, parabola menyempit. Vertex tetap di $(1, 3)$.',
    },
  ),
  MC(
    'MULTIPLE QUESTION',
    'Vertex parabola $y = (x + 4)^2 - 3$ adalah...',
    ['$(-4, -3)$', '$(4, -3)$', '$(-4, 3)$', '$(4, 3)$'],
    [0],
    '$(-4, -3)$',
    {
      hint: 'Bentuk $(x - h)$ berarti $x + 4 = x - (-4)$.',
      exp: '$(x + 4)$ sama dengan $(x - (-4))$, jadi $h = -4$ dan $k = -3$.',
    },
  ),
);
Q.D.push(
  MC(
    'MULTIPLE QUESTION',
    'Apa domain dan range dari $y = -(x - 6)^2 + 20$?',
    [
      'Domain: semua real; range: $y \\le 20$',
      'Domain: $x \\le 20$; range: semua real',
      'Domain: semua real; range: $y \\ge 20$',
      'Domain: $x \\ge 6$; range: $y \\le 20$',
    ],
    [0],
    'Domain: semua real; range: $y \\le 20$',
    {
      hint: 'Parabola terbuka ke bawah, jadi nilai $y$ tertinggi ada di vertex.',
      exp: '$a$ negatif sehingga $y$ maksimum $= k = 20$. Domain fungsi kuadrat selalu semua bilangan real.',
    },
  ),
  MC(
    'MULTIPLE QUESTION',
    'Tentukan $y$-intercept dari $y = (x - 2)^2 - 3$.',
    ['$(0, 1)$', '$(0, -3)$', '$(0, 3)$', '$(2, -3)$'],
    [0],
    '$(0, 1)$',
    { hint: 'Substitusikan $x = 0$.', exp: '$(0 - 2)^2 - 3 = 4 - 3 = 1$, jadi $(0, 1)$.' },
  ),
);
Q.C.push(
  MC(
    'MULTIPLE QUESTION',
    'Untuk $y = -x^2 + 6x - 5$, ke mana parabola terbuka dan berapa sumbu simetrinya?',
    ['Ke bawah, $x = 3$', 'Ke atas, $x = 3$', 'Ke bawah, $x = -3$', 'Ke atas, $x = -3$'],
    [0],
    'Ke bawah, $x = 3$',
    {
      hint: 'Lihat tanda $a$, lalu hitung $x = -\\dfrac{b}{2a}$.',
      exp: '$a = -1$ negatif sehingga ke bawah. $x = -\\dfrac{6}{2 \\cdot (-1)} = 3$.',
    },
  ),
  MC(
    'MULTIPLE QUESTION',
    'Vertex dari $y = x^2 - 4x + 3$ adalah...',
    ['$(2, -1)$', '$(-2, 1)$', '$(2, 1)$', '$(4, 3)$'],
    [0],
    '$(2, -1)$',
    {
      hint: '$x = -\\dfrac{b}{2a}$ lalu substitusikan ke fungsi.',
      exp: '$x = \\dfrac{4}{2} = 2$, $y = 4 - 8 + 3 = -1$.',
    },
  ),
);
Q.B.push(
  MC(
    'MULTIPLE QUESTION',
    'Bentuk faktor $y = 2(x - 1)(x + 3)$. Apa akar-akarnya?',
    ['$x = 1$ dan $x = -3$', '$x = -1$ dan $x = 3$', '$x = 2$ dan $x = 1$', '$x = 2$ dan $x = -3$'],
    [0],
    '$x = 1$ dan $x = -3$',
    {
      hint: 'Akar membuat setiap faktor bernilai nol.',
      exp: '$x - 1 = 0$ memberi $x = 1$, dan $x + 3 = 0$ memberi $x = -3$.',
    },
  ),
  MC(
    'MULTIPLE QUESTION',
    'Sumbu simetri dari $y = 2(x - 1)(x + 3)$ adalah...',
    ['$x = -1$', '$x = 1$', '$x = -3$', '$x = 2$'],
    [0],
    '$x = -1$',
    {
      hint: 'Sumbu simetri ada di tengah kedua akar.',
      exp: '$\\dfrac{1 + (-3)}{2} = -1$, jadi $x = -1$.',
    },
  ),
);
Q.A.push(
  MC(
    'MULTIPLE QUESTION',
    'Nilai $a$ manakah yang membuat $y = ax^2$ terbuka ke bawah dan paling lebar?',
    ['$a = -0{,}5$', '$a = -3$', '$a = 0{,}5$', '$a = 3$'],
    [0],
    '$a = -0{,}5$',
    {
      hint: 'Negatif membuka ke bawah, $|a|$ kecil membuat melebar.',
      exp: 'Negatif berarti ke bawah. Di antara $-0{,}5$ dan $-3$, $|a|$ yang lebih kecil lebih lebar.',
    },
  ),
  {
    t: 'fill',
    tag: 'CHALLENGER QUESTION',
    q: 'Tulis fungsi (bentuk vertex) dengan vertex $(2, 1)$, terbuka ke atas, dan $a = 1$.',
    f: [{ l: '$y =$', r: /\(x-2\)(\^2|²)\+1$/ }],
    show: '$y = (x - 2)^2 + 1$',
    hint: 'Pakai $y = a(x - h)^2 + k$ dengan $h = 2$ dan $k = 1$.',
    exp: 'Substitusi $a = 1$, $h = 2$, $k = 1$ menghasilkan $y = (x - 2)^2 + 1$.',
  },
);
Q.S.push(
  MC(
    'MULTIPLE QUESTION',
    'Berapa jumlah $x$-intercept dari $y = x^2 + 4$?',
    ['Tidak ada', 'Satu', 'Dua', 'Tiga'],
    [0],
    'Tidak ada',
    {
      hint: 'Apakah $x^2 = -4$ punya solusi real?',
      exp: 'Vertex $(0, 4)$ berada di atas sumbu $x$ dan parabola terbuka ke atas, sehingga tidak memotong sumbu $x$.',
    },
  ),
  {
    t: 'fill',
    tag: 'PEAK QUESTION',
    q: 'Untuk $y = x^2 - 2x - 8$, tentukan nilai $y$ saat $x = 3$ dan saat $x = -2$.',
    f: [
      { l: '$y$ saat $x = 3$', r: /^-5$/ },
      { l: '$y$ saat $x = -2$', r: /^0$/ },
    ],
    show: '$y = -5$ dan $y = 0$',
    hint: 'Substitusikan langsung ke fungsi.',
    exp: '$x = 3$: $9 - 6 - 8 = -5$. $x = -2$: $4 + 4 - 8 = 0$, jadi $(-2, 0)$ adalah $x$-intercept.',
  },
);
Q.R.push(
  MC(
    'MULTIPLE CHOICE',
    'Apa sumbu simetri dari $y = a(x - h)^2 + k$?',
    ['$x = h$', '$y = k$', '$x = k$', '$y = h$'],
    [0],
    '$x = h$',
    {
      hint: 'Sumbu simetri melewati vertex secara vertikal.',
      exp: 'Vertex di $(h, k)$, sehingga garis simetri vertikalnya adalah $x = h$.',
    },
  ),
);
Q.C[0].noShuf = 1;

const EXP = {
  E0: [
    'Vertex berada di $(h, k)$.',
    'Pada $y = a(x - h)^2 + k$, vertex $(h, k)$. Dengan $h = 3$ dan $k = -2$, vertex $(3, -2)$.',
  ],
  E1: [null, 'Sumbu simetri adalah garis vertikal $x = h$ yang melewati vertex.'],
  D0: [
    'Titik puncak $p(x)$ ada di $x = 6$.',
    'Karena $a$ negatif, profit naik sampai $x = 6$ (vertex) lalu turun.',
  ],
  D1: [
    'Perhatikan tanda di dalam kurung.',
    '$a = -2$ negatif jadi ke bawah. $(x + 1)$ berarti $h = -1$, $k = 5$. Sumbu $x = -1$. $y$-intercept: $-2(1) + 5 = 3$.',
  ],
  C0: [
    'Hitung dulu $x = -\\dfrac{b}{2a}$.',
    '$x = \\dfrac{4}{2} = 2$, $y = 4 - 8 + 3 = -1$. Vertex $(2, -1)$ hanya cocok dengan Grafik A.',
  ],
  C1: [
    'Parabola terbuka ke atas dengan nilai terendah $-1$.',
    'Domain semua bilangan real, dan range $y \\ge -1$.',
  ],
  B0: [
    'Akar di $x = 0$ dan $x = 1200$, dan jembatan melengkung ke bawah.',
    'Faktor $x$ dan $(x - 1200)$ memberi akar $0$ dan $1200$. $a$ negatif agar ke bawah. Cek $x = 600$: $-0{,}001 \\cdot 600 \\cdot (-600) = 360$.',
  ],
  B1: [null, 'Saat $x = 0$, $y = 0$, jadi $c = 0$.'],
  B2: [null, '360 ft lebih besar dari 300 ft.'],
  B3: [null, 'Saat $x = 0$, $y = -0{,}001 \\cdot 0 \\cdot (-1200) = 0$.'],
  A0: [
    'Lihat $|a|$: makin besar makin sempit.',
    'Koefisien $3$ paling besar sehingga parabola paling sempit.',
  ],
  S0: [
    'Faktorkan: $(x - 4)(x + 2)$.',
    '$x^2 - 2x - 8 = (x - 4)(x + 2)$, akar $x = 4$ dan $x = -2$.',
  ],
  S1: [
    '$y$-intercept saat $x = 0$, vertex di $x = -\\dfrac{b}{2a}$.',
    '$x = 0$ memberi $y = -8$. Sumbu $x = 1$, $y = 1 - 2 - 8 = -9$. Vertex $(1, -9)$.',
  ],
  R0: [
    'Pakai vertex $(1, -4)$ pada bentuk vertex.',
    '$y = (x - 1)^2 - 4$. Cek titik $(3, 0)$: $4 - 4 = 0$.',
  ],
};

const TEACHER_CODE = 'guild';

const CLASS_LIST = ['9A', '9B', '9C'];
const OWNER_PASS = 'arise-owner';
const SHOW_TEAM = true;
const REQUIRE_VERIFIED = false;
const SPLASH = true;
const SITE_TITLE = "Shadow Monarch's Quadratic Dungeon";

const TIM_INFO = {
  guild: 'Guild Team 3',
  course: 'E-Learning | MATHEDU',
  project: "Shadow Monarch's Quadratic Dungeon",
  desc: 'Lima anggota guild merancang, membangun, dan menguji dungeon fungsi kuadrat ini bersama-sama.',
};
const TIM = [
  ['Misel Rajasyah Hadi Putra', 'Project Lead & Developer', 'crown', 'Guild Master', '#ffd86b', ['Project Lead', 'Developer'], 'Memimpin arsitektur sistem e-learning, integrasi Firebase, dan mekanik utama dungeon.', 'img/team/misel.jpeg'],
  ['Muhammad Wildan Izzul Haq', 'Storyboard & Visual', 'eye', 'Vision Mage', '#5ee6f2', ['Storyboard', 'Visual'], 'Merancang alur storyboard tiap scene, aset visual tema Solo Leveling, dan antarmuka.', 'img/team/wildan.jpeg'],
  ['Hutama Zidana', 'Konten & Asesmen', 'book', 'Sage of Scrolls', '#4cc38a', ['Konten', 'Asesmen'], 'Menyusun modul materi fungsi kuadrat, soal berjenjang Rank E–S, serta evaluasi N-gain.', 'img/team/zidan.jpeg'],
  ['Panji Batama', 'Developer & QA', 'code', 'Gate Engineer', '#9a5aff', ['Developer', 'QA'], 'Mengembangkan applet interaktif, pengujian lintas perangkat, dan stabilitas fitur.', 'img/team/panji.jpeg'],
  ['Ahmad Abdul Hakim', 'Dokumentasi & Uji Coba', 'quill', 'Chronicler', '#f472a8', ['Dokumentasi', 'Uji Coba'], 'Mengelola uji coba lapangan bersama pengguna, analisis umpan balik, dan dokumentasi proyek.', 'img/team/hakim.jpeg'],
];

const FAQ = [
  [
    'Apa itu Quadratic Dungeon?',
    'E-learning fungsi kuadrat bertema anime Solo Leveling. Kamu naik dari Rank E sampai Rank S sambil menjelajah applet dan menjawab soal.',
  ],
  [
    'Bagaimana sistem XP dan title?',
    'Tiap dungeon memberi XP sesuai skormu. Total 1500 XP. Title naik dari Shadow Soldier, Knight, Commander, sampai Shadow Monarch.',
  ],
  [
    'Apa itu spider analysis?',
    'Jaring 6 sumbu yang menunjukkan skor Rank E sampai S, jadi kamu tahu topik mana yang kuat dan mana yang perlu diulang.',
  ],
  [
    'Apa itu pretest dan posttest?',
    'Pretest mengukur kemampuan awal sebelum belajar, posttest mengukur setelah selesai. Selisihnya dihitung sebagai N-gain dan dilihat guru.',
  ],
  [
    'Apakah GeoGebra aslinya ikut dimuat?',
    'Sekarang website sudah dilengkapi applet interaktif bawaan, Quadratic Lens untuk menganalisis parabola dari foto dunia nyata, dan Visual Math Keypad untuk mengetik rumus. GeoGebra Classroom tetap tersedia sebagai Lab Eksplorasi opsional.',
  ],
  [
    'Bagaimana sistem belajar Iceberg RME & AI Shadow Mentor bekerja?',
    'Tiap dungeon dibuka lewat empat lapisan Iceberg RME: situasi kontekstual, model situasi, temukan polanya, lalu matematika formal. AI Shadow Mentor mendeteksi miskonsepsi dari jawabanmu dan memberi petunjuk yang tepat.',
  ],
  [
    'Apa fungsi Pasukan Bayangan dan Shadow Forge?',
    'Setiap dungeon yang kamu taklukkan mengekstrak satu prajurit bayangan permanen yang bisa dipanggil untuk buff saat bertarung. Di Shadow Forge, Mana Crystals dari dungeon dan raid ditukar dengan artefak berbonus.',
  ],
  [
    'Bagaimana cara mengikuti World Boss Raid bersama teman sekelas?',
    'Masuk dengan akun cloud dan pilih kelasmu. Saat guru memanggil World Boss, halaman raid terbuka otomatis. Jawab soal dengan benar untuk menyerang, dan HP Boss turun langsung di layar seluruh kelas.',
  ],
];

const TXT = {
  brand: 'ARISE',
  brandSub: '//DUNGEON',
  heroTag: '[ SYSTEM ] QUADRATIC FUNCTION DUNGEON',
  heroTitle: 'ARISE',
  heroSub: "Shadow Monarch's Quadratic Dungeon",
  heroDesc:
    'Taklukkan 6 dungeon fungsi kuadrat dari Rank E sampai Rank S, kumpulkan XP, dan jadilah Shadow Monarch.',
  ctaStart: 'Mulai petualangan',
  ctaLogin: 'Sudah punya akun',
  menu: [
    ['about', 'Tentang'],
    ['flow', 'Alur'],
    ['dg', 'Dungeon'],
    ['sim', 'Simulasi'],
    ['fitur', 'Fitur'],
    ['chars', 'Karakter'],
    ['tim', 'Tim'],
    ['faq', 'FAQ'],
  ],
  aboutTitle: 'Tentang',
  backstoryTitle: 'Backstory',
  backstory:
    'Dive into the dungeon of curves where each parabola is a portal to a new challenge. Siswa berperan sebagai shadow soldier yang memakai kemampuan grafik untuk menaklukkan tiap level, seperti Sung Jin-Woo merekrut bayangannya. May the math be with you!',
  objectivesTitle: 'Tujuan belajar',
  objectives: [
    'Transformasi grafik dari vertex form',
    'Vertex dan sumbu simetri dari tiga bentuk',
    'Concavity, interval, domain, dan range',
    'Menggambar parabola dari tiga bentuk',
    'Membandingkan dua fungsi kuadrat',
  ],
  flowTitle: 'Alur Belajar',
  flow: [
    ['1', 'Daftar & Masuk Akun Cloud', 'Buat akun hunter atau masuk sebagai guru. Progres dan XP tersimpan di cloud dan tersinkron di semua perangkat.'],
    ['2', 'Putar Gate Briefing & Pelajari Modul Iceberg RME', 'Tonton video briefing sinematik tiap Rank, lalu telusuri empat lapisan Iceberg RME dibantu AI Shadow Mentor.'],
    ['3', 'Taklukkan Boss & Ekstrak Pasukan Bayangan', 'Kalahkan Boss lewat soal dan raid, lalu ekstrak pasukan bayangan dan tempa artefak untuk buff.'],
    ['4', 'Pantau Rapor Diagnostik Iceberg & Transkrip Nilai', 'Baca spider analysis dan diagnosis miskonsepsi per lapisan, lalu cetak transkrip nilai sebagai PDF.'],
  ],
  dungeonTitle: 'Enam Dungeon',
  fiturTitle: 'Fitur',
  fitur: [
    ['Modul Iceberg RME & AI Shadow Mentor', 'Pembelajaran konstruktivis 4 lapisan Iceberg RME dengan detektor miskonsepsi otomatis dan Visual Math Keypad.'],
    ['Motion Graphic & Anime Cutscene', 'Video briefing sinematik di setiap Rank, Boss Intro Cutscene, Spotlight Karakter, dan animasi ekstraksi ARISE!.'],
    ['World Boss Raid & Quadratic Lens', 'Pertarungan Boss multiplayer sekelas secara real-time dan analisis kurva parabola langsung dari foto dunia nyata.'],
    ['Pasukan Bayangan & Shadow Forge', 'Ekstrak 8 pasukan bayangan berwarna penuh dan tempa artefak menggunakan Mana Crystals untuk buff aktif.'],
    ['Applet Interaktif & Endless Red Gate', 'Game lempar belati, slider vertex, jembatan parabola, dan latihan soal dinamis anti-contek.'],
    ['Dashboard Guru & Transkrip Evaluasi', 'Rekap kelas real-time, Spider Analysis, Custom Gate Builder, N-Gain otomatis, dan cetak rapor PDF.'],
  ],
  charsTitle: 'Para Karakter',
  charsDesc: 'Gerakkan kursor atau jarimu, mata mereka mengikuti! Klik karakter untuk berkenalan.',
  timTitle: 'Tim Pengembang',
  faqTitle: 'FAQ',
  footer: 'MAY THE MATH BE WITH YOU | Account and progress synchronized via Firebase.',
};

const GLOS_INTRO = [
  ['1', 'Daftar dan masuk', 'Kamu jadi seorang Hunter, yaitu pemburu yang tugasnya menaklukkan Gate.'],
  ['2', 'Masuk Gate (dungeon)', 'Satu Gate = satu bab fungsi kuadrat. Mulai dari Rank E yang paling mudah.'],
  ['3', 'Baca Materi, coba Praktik', 'Pelajari penjelasan bergambar, lalu coba applet interaktifnya.'],
  ['4', 'Jawab soal, kalahkan musuh', 'Jawaban benar menurunkan HP musuh dan memberi XP. Salah? Kamu punya beberapa percobaan.'],
  ['5', 'Naik Rank dan Title', 'XP terkumpul membuat Title-mu naik dari Shadow Soldier sampai Shadow Monarch.'],
];
const GLOS = [
  {
    id: 'hunter',
    t: 'Hunter',
    a: ['Hunter', 'hunter'],
    s: 'Sebutan untuk pemain, yaitu kamu sebagai siswa yang belajar.',
    story: 'Hunter adalah orang yang punya kekuatan khusus dan bertugas masuk ke Gate untuk melawan monster.',
    game: 'Kamu adalah Hunter. Setiap soal yang kamu kerjakan membuat Hunter-mu makin kuat (lebih banyak XP).',
  },
  {
    id: 'gate',
    t: 'Gate / Dungeon',
    a: ['Gate', 'Dungeon', 'Dungeon'],
    s: 'Pintu portal menuju satu bab materi. Di dalamnya ada materi, praktik, dan soal.',
    story: 'Gate adalah portal yang tiba-tiba muncul dan membawa Hunter ke dungeon penuh monster.',
    game: 'Satu Gate/Dungeon = satu topik fungsi kuadrat (misalnya Rank E tentang bentuk vertex). Selesaikan misi, materi, praktik, dan soal untuk menaklukkannya.',
  },
  {
    id: 'rank',
    t: 'Rank E sampai S',
    a: ['Rank', 'Rank E', 'Rank D', 'Rank C', 'Rank B', 'Rank A', 'Rank S'],
    s: 'Tingkat kesulitan dungeon: E paling mudah, lalu D, C, B, A, dan S paling sulit.',
    story: 'Hunter dan Gate dibagi menjadi tingkatan E (terlemah) sampai S (terkuat).',
    game: 'Rank E: bentuk vertex. D: grafik. C: bentuk standar. B: bentuk faktor. A: tiga bentuk dan diskriminan. S: tantangan akhir. Kamu naik satu per satu, tidak boleh lompat.',
  },
  {
    id: 'raid',
    t: 'Raid dan Raid Boss',
    a: ['Raid', 'Raid Boss', 'Raid Waktu'],
    s: 'Kuis melawan waktu. Jawab soal acak secepat mungkin untuk poin tertinggi.',
    story: 'Raid adalah serangan beramai-ramai ke Gate besar untuk mengalahkan Boss, monster terkuat di sana.',
    game: 'Raid Waktu: soal acak dari dungeon yang sudah kamu taklukkan, dengan batas waktu per soal. Makin cepat menjawab, makin besar poinnya. Skor terbaikmu masuk Peringkat Raid.',
  },
  {
    id: 'boss',
    t: 'Boss',
    a: ['Boss'],
    s: 'Musuh terkuat di sebuah dungeon. Mengalahkannya berarti menyelesaikan soal-soal dungeon itu.',
    story: 'Boss adalah monster penguasa Gate yang harus dikalahkan agar Gate tertutup.',
    game: 'Bar HP musuh di langkah Soal turun setiap kamu menjawab benar. Rank S dan Wrap-up dijaga oleh Raja Parabola, boss terakhir.',
  },
  {
    id: 'mana',
    t: 'Mana',
    a: ['Mana', 'Kristal Mana'],
    s: 'Energi sihir. Di pelajaran ini, Mana dipakai sebagai contoh nilai yang diatur oleh fungsi kuadrat.',
    story: 'Mana adalah energi yang dipakai Hunter untuk menggunakan kekuatan dan sihir.',
    game: 'Dalam materi Rank C, jumlah Mana dan profit guild dimodelkan dengan fungsi kuadrat, sehingga kamu bisa mencari hasil terbaik (titik puncak).',
  },
  {
    id: 'enhance',
    t: 'Enhance / Skill',
    a: ['Enhance', 'Skill', 'skill'],
    s: 'Kemampuan khusus karakter pendamping, misalnya bonus XP atau tambahan waktu Raid.',
    story: 'Enhance berarti memperkuat kemampuan. Hunter bisa memperkuat skill agar lebih hebat.',
    game: 'Setiap karakter pendamping punya satu skill unik. Pilih karakter di menu Karakter, maka skill-nya langsung aktif membantumu belajar.',
  },
  {
    id: 'xp',
    t: 'XP (Experience Point)',
    a: ['XP', 'Bonus XP'],
    s: 'Poin pengalaman. Makin banyak XP, makin tinggi Title-mu.',
    story: 'XP adalah poin pengalaman yang membuat Hunter naik level.',
    game: 'XP didapat dari menyelesaikan dungeon, Raid, dan Misi Harian. Total XP menentukan Title-mu.',
  },
  {
    id: 'title',
    t: 'Title',
    a: ['Title', 'title'],
    s: 'Gelar yang kamu dapat saat XP mencapai batas tertentu.',
    story: 'Title adalah gelar yang diberikan System kepada Hunter karena pencapaian tertentu.',
    game: 'Urutan Title: Shadow Soldier (0 XP), Shadow Knight (400 XP), Shadow Commander (800 XP), Shadow Monarch (1200 XP).',
  },
  {
    id: 'soldier',
    t: 'Shadow Soldier',
    a: ['Shadow Soldier', 'Shadow Knight', 'Shadow Commander', 'Pasukan Bayangan'],
    s: 'Tingkatan awal Title, lalu naik menjadi Knight dan Commander.',
    story: 'Shadow Soldier adalah pasukan bayangan yang dibangkitkan dan setia pada rajanya.',
    game: 'Shadow Soldier adalah Title awalmu. Setiap dungeon yang selesai membangkitkan satu prajurit di Pasukan Bayanganmu.',
  },
  {
    id: 'monarch',
    t: 'Shadow Monarch',
    a: ['Shadow Monarch'],
    s: 'Title tertinggi (1200 XP). Tanda kamu sudah menguasai fungsi kuadrat.',
    story: 'Shadow Monarch adalah penguasa para bayangan, kekuatan tertinggi di cerita.',
    game: 'Capai 1200 XP untuk mendapat Title ini. Kalau semua dungeon dan posttest selesai, kamu juga bisa mencetak sertifikat Shadow Monarch.',
  },
  {
    id: 'system',
    t: 'System',
    a: ['System'],
    s: 'Suara dan jendela panduan dari game yang memberi tahu misi dan hasilmu.',
    story: 'System adalah antarmuka misterius yang memberi misi, level, dan hadiah kepada pemain.',
    game: 'Kotak bertanda [ SYSTEM ] di website ini adalah pesan dari System: misi, hasil, dan pengumuman.',
  },
  {
    id: 'levelup',
    t: 'Level Up',
    a: ['Level Up', 'LEVEL UP'],
    s: 'Muncul saat Title-mu naik ke tingkat berikutnya.',
    story: 'Level Up terjadi ketika Hunter cukup kuat untuk naik tingkat.',
    game: 'Layar LEVEL UP muncul jika setelah menyelesaikan dungeon atau Raid, XP-mu melewati batas Title berikutnya.',
  },
  {
    id: 'arise',
    t: 'Arise',
    a: ['Arise', 'ARISE'],
    s: 'Perintah untuk membangkitkan bayangan. Di sini jadi nama petualangan kita.',
    story: 'Arise adalah kata yang diucapkan untuk membangkitkan prajurit bayangan.',
    game: 'ARISE adalah nama website ini. Tombol Panggil bayangan di menu Karakter memunculkan Pasukan Bayanganmu.',
  },
  {
    id: 'daily',
    t: 'Daily Quest (Misi Harian)',
    a: ['Daily Quest', 'Misi Harian'],
    s: 'Tugas kecil setiap hari. Selesaikan untuk bonus XP.',
    story: 'Daily Quest adalah latihan harian dari System. Kalau dilewatkan, ada hukumannya.',
    game: 'Tidak ada hukuman di sini. Selesaikan misi harian di Dashboard, lalu tekan Klaim untuk bonus XP.',
  },
  {
    id: 'vertex',
    t: 'Warp Gate (Vertex)',
    a: ['Warp Gate', 'vertex', 'Vertex'],
    s: 'Titik puncak atau dasar parabola, ditulis (h, k). Parabola berputar di titik ini.',
    story: 'Warp Gate adalah istilah di website ini: gerbang teleportasi tempat parabola berpindah posisi.',
    game: 'Vertex adalah titik paling atas (jika parabola membuka ke bawah) atau paling bawah (jika membuka ke atas). Ia menentukan nilai maksimum atau minimum.',
  },
  {
    id: 'aura',
    t: 'Aura Simetri',
    a: ['Aura Simetri', 'sumbu simetri'],
    s: 'Garis tegak x = h yang membagi parabola menjadi dua sisi yang sama.',
    story: 'Aura Simetri adalah istilah di website ini: aura yang menyelimuti parabola secara seimbang.',
    game: 'Sumbu simetri selalu lewat vertex. Titik di kiri dan di kanan garis ini punya tinggi yang sama.',
  },
  {
    id: 'ngain',
    t: 'Pretest, Posttest, N-gain',
    a: ['Pretest', 'Posttest', 'N-gain'],
    s: 'Tes awal dan tes akhir. Selisihnya dihitung sebagai N-gain, ukuran seberapa besar kamu berkembang.',
    story: 'Tidak ada di cerita aslinya. Ini bagian pelajaran.',
    game: 'Kerjakan Pretest sebelum belajar dan Posttest setelah semua dungeon selesai. Guru memakai N-gain untuk melihat peningkatanmu.',
  },
];

const MATERI = {
  E: {
    title: 'Warp Gate: Menggeser Fungsi Induk',
    story:
      'Setiap Gate di dunia ini ternyata berasal dari satu <b>Gate induk</b> yang berdiri tepat di titik asal $(0, 0)$, yaitu parabola $y = x^2$. Hunter berpengalaman tidak menghafal ribuan Gate. Mereka cukup tahu cara <b>memindahkan</b> Gate induk itu dengan Warp Gate ke posisi $(h, k)$.',
    tips: [
      '$y = a(x - h)^2 + k$ memiliki vertex (Warp Gate) di $(h, k)$.',
      '$h$ menggeser ke kanan (jika positif) atau ke kiri (jika negatif). $k$ menggeser ke atas atau ke bawah.',
      'Aura Simetri adalah garis $x = h$. Titik kiri dan kanan garis ini setinggi sama.',
      'Hati-hati tanda: $(x + 4)$ berarti $h = -4$, bukan $4$.',
    ],
  },
  D: {
    title: '6 Langkah Analisis Dungeon',
    story:
      'Sebelum masuk dungeon, Hunter senior selalu memindai lorongnya dengan urutan yang sama. Enam langkah ini membuatmu bisa menggambar dan menjelaskan parabola mana pun dalam bentuk vertex, tanpa menghitung banyak titik.',
    tips: [
      '$a \\gt 0$: membuka ke atas, vertex adalah titik terendah. $a \\lt 0$: membuka ke bawah, vertex adalah titik tertinggi.',
      'Interval naik dan turun dipisahkan oleh sumbu simetri $x = h$.',
      '$y$-intercept: substitusikan $x = 0$ lalu hitung $y$.',
      'Domain selalu semua bilangan real. Range ditentukan oleh $k$ dan arah bukaan.',
    ],
  },
  C: {
    title: 'Kapasitas Kristal Mana dan Profit Guild',
    story:
      'Guild Hunter menjual kristal mana. Untung rugi guild ditulis sebagai fungsi kuadrat standar $P(x) = ax^2 + bx + c$ (dalam ribu emas), dengan $x$ adalah jumlah kristal (dalam ratusan) yang dijual. Dari tiga koefisien saja, kamu bisa membaca modal awal, jumlah penjualan terbaik, dan untung terbesar.',
    tips: [
      '$c$ adalah $y$-intercept: grafik memotong sumbu $y$ di $(0, c)$. Pada cerita guild, $c$ adalah modal awal.',
      'Sumbu simetri $x = -\\dfrac{b}{2a}$, lalu substitusikan ke fungsi untuk mendapat $y$ vertex.',
      '$a$ menentukan arah bukaan dan lebar parabola.',
      'Bentuk standar bisa diubah menjadi bentuk vertex dengan melengkapkan kuadrat.',
    ],
  },
  B: {
    title: 'Jembatan Portal Dimensi',
    story:
      'Dua Gate terpisah jurang dimensi. Arsitek guild membangun <b>Jembatan Portal</b> berbentuk parabola yang tepat menyentuh kedua Gate di $(r_1, 0)$ dan $(r_2, 0)$. Titik-titik itu adalah akar. Cara mencarinya adalah memfaktorkan, dan Diagram Kotak Perkalian membuat pemfaktoran terlihat nyata.',
    tips: [
      '$y = a(x - r_1)(x - r_2)$ memiliki akar $x = r_1$ dan $x = r_2$.',
      'Sumbu simetri berada tepat di tengah akar: $x = \\dfrac{r_1 + r_2}{2}$.',
      'Mengembangkan: $(x - r_1)(x - r_2) = x^2 - (r_1 + r_2)x + r_1 r_2$.',
      'Memfaktorkan $x^2 + bx + c$: cari dua bilangan yang berjumlah $b$ dan berkali $c$.',
    ],
  },
  A: {
    title: 'Tiga Bentuk, Satu Kekuatan',
    story:
      'Seorang Hunter Rank A menguasai tiga bentuk senjata yang sama: vertex, standar, dan faktor. Fungsinya satu, tetapi masing-masing bentuk memperlihatkan rahasia berbeda. Memilih bentuk yang tepat menghemat waktu bertarung.',
    tips: [
      'Vertex form langsung memberi vertex dan sumbu simetri.',
      'Standard form langsung memberi $y$-intercept $(0, c)$.',
      'Factored form langsung memberi akar atau $x$-intercept.',
      'Tiga bentuk itu adalah fungsi yang sama dan bisa saling diubah.',
    ],
  },
  S: {
    title: 'Radar Pendeteksi Monster: Diskriminan dan Pertidaksamaan',
    story:
      'Di Rank S, Hunter memakai <b>Radar Pendeteksi Monster</b>. Radar ini membaca diskriminan $D = b^2 - 4ac$ untuk memberi tahu berapa banyak monster (akar real) yang bersembunyi di garis $y = 0$ sebelum kamu menyerang. Lalu kamu tinggal menentukan wilayah aman, yaitu himpunan penyelesaian pertidaksamaan.',
    tips: [
      '$D \\gt 0$: dua akar real berbeda. $D = 0$: satu akar kembar (grafik menyentuh sumbu $x$). $D \\lt 0$: tidak ada akar real.',
      'Pertidaksamaan kuadrat: cari akar dulu, gambar garis bilangan, lalu uji tanda tiap daerah.',
      'Tanda sama dengan ($\\le$ atau $\\ge$) membuat titik akar ikut menjadi penyelesaian (titik penuh).',
      'Jika $D \\lt 0$, tanda $f(x)$ sama di mana-mana: ikut tanda $a$.',
    ],
  },
};
