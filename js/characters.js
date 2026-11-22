const mouth = (x, y, m, col = '#4a2230', w = 10) =>
  ({
    happy: `<path d="M${x - w} ${y}Q${x} ${y + w * 1.2} ${x + w} ${y}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
    sad: `<path d="M${x - w} ${y + 6}Q${x} ${y - 5} ${x + w} ${y + 6}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
    wow: `<ellipse cx="${x}" cy="${y + 4}" rx="${w * 0.6}" ry="${w * 0.8}" fill="${col}"/>`,
    smug: `<path d="M${x - w} ${y}Q${x + 2} ${y + w * 0.8} ${x + w} ${y - 5}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
    ko: `<path d="M${x - w} ${y + 2}L${x - w / 3} ${y - 2}L${x + w / 3} ${y + 2}L${x + w} ${y - 2}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`,
  })[m] || '';

const eye = (cx, cy, r, iris, m) =>
  m === 'ko'
    ? `<path d="M${cx - r * 0.7} ${cy - r * 0.7}L${cx + r * 0.7} ${cy + r * 0.7}M${cx + r * 0.7} ${cy - r * 0.7}L${cx - r * 0.7} ${cy + r * 0.7}" stroke="#1a1a3a" stroke-width="3.5" stroke-linecap="round"/>`
    : `<g class="blink"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/><circle class="pupil" cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="${iris}"/><circle cx="${cx + r * 0.25}" cy="${cy - r * 0.3}" r="${r * 0.22}" fill="#fff"/></g>`;

const glow = (cx, cy, r, col, m) =>
  m === 'ko'
    ? `<path d="M${cx - r * 0.7} ${cy - r * 0.7}L${cx + r * 0.7} ${cy + r * 0.7}M${cx + r * 0.7} ${cy - r * 0.7}L${cx - r * 0.7} ${cy + r * 0.7}" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>`
    : `<g class="blink"><circle cx="${cx}" cy="${cy}" r="${r * 1.3}" fill="${col}" opacity=".3"/><circle class="pupil" cx="${cx}" cy="${cy}" r="${r * 0.7}" fill="${col}"/><circle cx="${cx + 2}" cy="${cy - 2}" r="2" fill="#fff"/></g>`;
const cheeks = (a, b, y, col = '#ff9ab8') =>
  `<circle cx="${a}" cy="${y}" r="7" fill="${col}" opacity=".5"/><circle cx="${b}" cy="${y}" r="7" fill="${col}" opacity=".5"/>`;
const shadow = `<ellipse cx="100" cy="212" rx="58" ry="8" fill="#000" opacity=".4"/>`;
const wrap = (inner) =>
  `<svg class="chr" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

const kage = (m) =>
  wrap(`${shadow}
<g class="aura"><path d="M30 205Q20 150 45 120Q40 160 60 175Z" fill="#9a5aff" opacity=".4"/><path d="M170 205Q180 150 155 120Q160 160 140 175Z" fill="#9a5aff" opacity=".4"/></g>
<path d="M42 210Q46 128 100 116Q154 128 158 210Z" fill="#14123a" stroke="#7b5cff" stroke-width="2.5"/>
<path d="M80 124L100 152L120 124Z" fill="#5b3fd9"/>
<circle cx="100" cy="84" r="46" fill="#f3d9c4"/>
<path d="M50 86Q52 30 100 26Q150 30 152 86Q138 58 120 66Q110 48 98 64Q82 48 72 68Q58 62 50 86Z" fill="#0b0b1a"/>
<path d="M62 60L52 36L78 52Z M138 60L148 36L122 52Z" fill="#0b0b1a"/>
${eye(80, 94, 11, '#9a5aff', m)}${eye(120, 94, 11, '#9a5aff', m)}${cheeks(64, 136, 110)}${mouth(100, 115, m)}
<g class="dag"><path d="M154 162L166 112L176 162Z" fill="#5ee6f2" stroke="#fff" stroke-width="1.5"/><rect x="151" y="160" width="28" height="6" rx="3" fill="#7b5cff"/><circle cx="165" cy="174" r="9" fill="#f3d9c4"/></g>`);

const noir = (m) =>
  wrap(`${shadow}
<path class="plume" d="M100 56Q66 24 92 6Q90 30 122 22Q108 42 100 56Z" fill="#5ee6f2"/>
<rect x="62" y="140" width="76" height="70" rx="14" fill="#14196a" stroke="#7b8cff" stroke-width="2"/>
<circle cx="48" cy="160" r="22" fill="#1d2a78" stroke="#7b8cff" stroke-width="2"/><circle cx="152" cy="160" r="22" fill="#1d2a78" stroke="#7b8cff" stroke-width="2"/>
<rect x="48" y="50" width="104" height="96" rx="40" fill="#1d2a78" stroke="#8fa0ff" stroke-width="3"/>
<path d="M100 52L100 80" stroke="#8fa0ff" stroke-width="3"/>
<rect x="62" y="84" width="76" height="32" rx="14" fill="#05071a"/>
${glow(82, 100, 9, '#ff5aa8', m)}${glow(118, 100, 9, '#ff5aa8', m)}
<path d="M84 128Q100 ${m === 'sad' ? 124 : 136} 116 128" fill="none" stroke="#8fa0ff" stroke-width="3" stroke-linecap="round"/>
<g class="dag"><rect x="160" y="58" width="9" height="102" rx="3" fill="#cfd8ff"/><rect x="150" y="152" width="29" height="7" rx="3" fill="#ffd86b"/><rect x="160" y="159" width="9" height="22" fill="#6a4cff"/></g>`);

const ratu = (m) =>
  wrap(`${shadow}
<ellipse cx="38" cy="140" rx="30" ry="46" transform="rotate(-20 38 140)" fill="#9fd4ff" opacity=".35"/><ellipse cx="162" cy="140" rx="30" ry="46" transform="rotate(20 162 140)" fill="#9fd4ff" opacity=".35"/>
<ellipse cx="100" cy="178" rx="36" ry="32" fill="#2f1b5e" stroke="#b07bff" stroke-width="2.5"/>
<path d="M78 62Q60 22 38 26" stroke="#b07bff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="38" cy="26" r="7" fill="#ff7ac6"/>
<path d="M122 62Q140 22 162 26" stroke="#b07bff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="162" cy="26" r="7" fill="#ff7ac6"/>
<ellipse cx="100" cy="102" rx="54" ry="48" fill="#3b1f6e" stroke="#b07bff" stroke-width="3"/>
<path d="M72 64L80 40L92 58L100 34L108 58L120 40L128 64Z" fill="#ffd86b" stroke="#e0a800" stroke-width="2"/>
${eye(76, 102, 15, '#ff7ac6', m)}${eye(124, 102, 15, '#ff7ac6', m)}
<path d="M88 132L82 144L94 138Z M112 132L118 144L106 138Z" fill="#b07bff"/>${mouth(100, 128, m, '#ff9ad2')}`);

const lumi = (m) =>
  wrap(`${shadow}
<path d="M54 210Q58 142 100 134Q142 142 146 210Z" fill="#eef3ff" stroke="#4d8bff" stroke-width="2.5"/><path d="M84 140L100 166L116 140Z" fill="#4d8bff"/>
<path d="M52 92Q40 40 100 30Q160 40 148 92Q150 130 138 152Q132 112 126 88L74 88Q68 112 62 152Q50 130 52 92Z" fill="#ffd86b" stroke="#e0b030" stroke-width="2"/>
<circle cx="100" cy="90" r="44" fill="#f3d9c4"/>
<path d="M56 82Q70 50 100 52Q130 50 144 82Q122 68 100 78Q78 68 56 82Z" fill="#ffd86b"/>
<path d="M58 70Q100 44 142 70" stroke="#ff5a8a" stroke-width="7" fill="none" stroke-linecap="round"/>
${eye(80, 94, 10.5, '#4d8bff', m)}${eye(120, 94, 10.5, '#4d8bff', m)}${cheeks(66, 134, 110)}${mouth(100, 116, m)}
<g class="dag"><rect x="26" y="40" width="9" height="104" rx="3" fill="#fff" stroke="#9fd0ff"/><rect x="16" y="140" width="29" height="7" rx="3" fill="#ffd86b"/><rect x="26" y="147" width="9" height="20" fill="#ff5a8a"/><circle cx="31" cy="176" r="9" fill="#f3d9c4"/></g>`);

const slime = (m, king) =>
  wrap(`<ellipse cx="100" cy="209" rx="66" ry="9" fill="#000" opacity=".4"/>
${king ? '<path d="M24 204Q8 120 60 100L140 100Q192 120 176 204Z" fill="#b02a5a"/>' : ''}
<path d="M26 204Q22 96 100 70Q178 96 174 204Q150 214 130 204Q100 216 70 204Q50 214 26 204Z" fill="${king ? '#7b3ff2' : '#4d8bff'}" stroke="${king ? '#c9a8ff' : '#a9c8ff'}" stroke-width="3"/>
<ellipse cx="62" cy="110" rx="16" ry="9" fill="#fff" opacity=".35" transform="rotate(-25 62 110)"/>
<text x="100" y="196" text-anchor="middle" font-size="13" font-family="monospace" fill="#fff" opacity=".7">y = x²</text>
${king ? '<path d="M70 82L78 56L90 74L100 48L110 74L122 56L130 82Z" fill="#ffd86b" stroke="#e0a800" stroke-width="2"/>' : '<path d="M100 72Q96 52 84 48Q96 46 100 62Q104 46 116 44Q106 52 100 72Z" fill="#4cc38a"/>'}
${eye(76, 136, 14, '#1a1a3a', m)}${eye(124, 136, 14, '#1a1a3a', m)}
${king || m === 'smug' ? '<path d="M60 116L92 126M140 116L108 126" stroke="#1a1a3a" stroke-width="4" stroke-linecap="round"/>' : ''}
${mouth(100, 166, m, '#1a1a3a', 18)}`);

const mochi = (m) =>
  wrap(`${shadow}
<path class="aura" d="M150 192Q196 172 184 128Q178 160 148 172Z" fill="#2a1a5e" stroke="#9a5aff" stroke-width="2"/>
<ellipse cx="100" cy="180" rx="40" ry="30" fill="#1b1245" stroke="#7b5cff" stroke-width="2.5"/>
<path d="M52 72L58 24L94 52Z" fill="#1b1245" stroke="#7b5cff" stroke-width="3"/><path d="M148 72L142 24L106 52Z" fill="#1b1245" stroke="#7b5cff" stroke-width="3"/>
<path d="M62 60L64 38L80 52Z M138 60L136 38L120 52Z" fill="#ff9ad2" opacity=".6"/>
<ellipse cx="100" cy="98" rx="54" ry="44" fill="#1b1245" stroke="#7b5cff" stroke-width="3"/>
${eye(76, 98, 13, '#ffd86b', m)}${eye(124, 98, 13, '#ffd86b', m)}
<path d="M95 114L105 114L100 121Z" fill="#ff9ad2"/>${mouth(100, 124, m, '#ff9ad2', 7)}
<path d="M54 112L28 106M54 120L28 124M146 112L172 106M146 120L172 124" stroke="#c9b8ff" stroke-width="2" stroke-linecap="round"/>
<path d="M62 142Q100 162 138 142L134 154Q100 172 66 154Z" fill="#9a5aff"/>`);

const aurel = (m) =>
  wrap(`${shadow}
<path d="M44 210Q48 130 100 120Q152 130 156 210Z" fill="#2a4fb0" stroke="#9fd0ff" stroke-width="2.5"/><path d="M92 124L100 210L108 124Z" fill="#e8f4ff"/>
<path d="M54 92Q44 36 100 28Q156 36 146 92Q150 130 136 156Q132 110 124 86L76 86Q68 110 64 156Q50 130 54 92Z" fill="#eaf4ff" stroke="#b5d8ff" stroke-width="2"/>
<circle cx="100" cy="90" r="44" fill="#f3d9c4"/>
<path d="M56 82Q70 52 100 54Q130 52 144 82Q122 68 100 78Q78 68 56 82Z" fill="#eaf4ff"/>
${eye(80, 94, 10, '#5ee6f2', m)}${eye(120, 94, 10, '#5ee6f2', m)}
<circle cx="80" cy="94" r="15" fill="none" stroke="#ffd86b" stroke-width="2.5"/><circle cx="120" cy="94" r="15" fill="none" stroke="#ffd86b" stroke-width="2.5"/><path d="M95 94L105 94" stroke="#ffd86b" stroke-width="2.5"/>
${cheeks(66, 134, 112)}${mouth(100, 116, m)}
<g class="dag"><rect x="158" y="50" width="7" height="140" rx="3" fill="#8a6a3a"/><path d="M161 18L172 38L161 58L150 38Z" fill="#5ee6f2" stroke="#fff" stroke-width="2"/></g>`);

const zeri = (m) =>
  wrap(`${shadow}
<ellipse cx="50" cy="132" rx="26" ry="44" transform="rotate(-25 50 132)" fill="#ffd1f0" opacity=".55"/><ellipse cx="150" cy="132" rx="26" ry="44" transform="rotate(25 150 132)" fill="#ffd1f0" opacity=".55"/>
<path d="M76 208Q78 152 100 144Q122 152 124 208Z" fill="#ff8ac4" stroke="#ffc2e4" stroke-width="2"/>
<circle cx="62" cy="46" r="16" fill="#ff7ac6"/><circle cx="138" cy="46" r="16" fill="#ff7ac6"/>
<circle cx="100" cy="92" r="46" fill="#f3d9c4"/>
<path d="M54 90Q50 38 100 34Q150 38 146 90Q130 62 100 66Q70 62 54 90Z" fill="#ff7ac6"/>
${eye(80, 96, 11, '#b07bff', m)}${eye(120, 96, 11, '#b07bff', m)}${cheeks(64, 136, 112)}${mouth(100, 117, m)}
<g class="dag"><path d="M150 170L160 146" stroke="#ffd86b" stroke-width="4" stroke-linecap="round"/><path d="M160 120L164 134L178 134L167 143L171 157L160 148L149 157L153 143L142 134L156 134Z" fill="#ffd86b" stroke="#fff" stroke-width="1.5"/></g>
<circle cx="30" cy="70" r="3" fill="#ffd86b"/><circle cx="176" cy="84" r="2.5" fill="#fff"/><circle cx="40" cy="170" r="2.5" fill="#fff"/>`);

const gildan = (m) =>
  wrap(`${shadow}
<path d="M36 210Q42 126 100 116Q158 126 164 210Z" fill="#3a2a10" stroke="#ffd86b" stroke-width="2.5"/>
<circle cx="100" cy="166" r="13" fill="#ffd86b"/><path d="M93.500 173L94.500 162.500 98 166.500 100 160.500 102 166.500 105.500 162.500 106.500 173Z" fill="#3a2a10"/>
<circle cx="100" cy="86" r="46" fill="#e9c9a8"/>
<path d="M54 92Q48 68 62 58Q58 86 66 102Z M146 92Q152 68 138 58Q142 86 134 102Z" fill="#e8e8f0"/>
<path d="M64 102Q100 172 136 102Q120 132 100 130Q80 132 64 102Z" fill="#e8e8f0"/>
<path d="M68 70L92 76M132 70L108 76" stroke="#f0f0f5" stroke-width="6" stroke-linecap="round"/>
${eye(80, 88, 9, '#2b2b2b', m)}${eye(120, 88, 9, '#2b2b2b', m)}
<path d="M76 112Q100 102 124 112Q108 126 100 118Q92 126 76 112Z" fill="#f4f4fa" stroke="#cfcfe0"/>
${m === 'wow' ? '<ellipse cx="100" cy="136" rx="7" ry="9" fill="#4a2230"/>' : ''}
<g class="dag"><rect x="150" y="140" width="34" height="48" rx="4" fill="#f6efd8" stroke="#c9a85a" stroke-width="2"/><path d="M156 152H178M156 162H178M156 172H170" stroke="#c9a85a" stroke-width="2"/></g>`);

const COMMON = {
  hint: [
    'Petunjuk dipakai, poin turun 10. Tapi tenang, nilai tetap bisa naik!',
    'Tidak apa-apa pakai petunjuk. Hunter pintar tahu kapan minta bantuan.',
  ],
  levelup: ['LEVEL UP! Kamu naik kelas, {nama}!', 'Title baru! Jangan lupa traktir bayanganmu.'],
  raid: ['Raid dimulai! Jari siap, otak nyala!', 'Waktu berjalan, jangan sampai kehabisan napas!'],
  raidwin: ['Raid sukses! Cepat dan tepat, mantap!', 'Rekor baru? Bayanganmu bangga!'],
  raidlose: [
    'Raid kali ini kurang beruntung. Ulangi dan balas dendam!',
    'Boss pun butuh beberapa kali percobaan, kok.',
  ],
  forum: [
    'Terima kasih sudah berbagi di forum, guild makin pintar!',
    'Diskusi itu seperti latihan: makin sering makin kuat.',
  ],
  view: {
    dash: ['Ayo lanjutkan petualangan, {nama}!', 'Cek spider analysismu, mana yang masih tipis?'],
    rank: [
      'Dungeon ini menantang, tapi kamu pasti bisa!',
      'Baca misinya dulu, praktik dulu, baru soal.',
    ],
    raid: ['Raid Waktu! Siapkan refleksmu.'],
    forum: ['Ada yang mau ditanyakan? Guild siap membantu.'],
    chars: ['Itu teman-temanku! Pilih salah satu jadi pendampingmu.'],
  },
};

const CHARS = [
  {
    id: 'kage',
    name: 'Kage',
    role: 'Pemburu Bayangan (maskot utama)',
    unlock: { t: 'start' },
    svg: (m) => kage(m),
    bio: 'Pemburu misterius yang bayangannya lebih rajin belajar daripada pemiliknya. Selalu muncul saat kamu butuh dorongan.',
    quote: 'Bayanganmu selalu ada, tapi nilainya kamu yang bikin.',
    say: {
      welcome: [
        'Hei {nama}. Bayanganmu sudah siap. Kamu siap belum?',
        'Arise! Eh, belum. Kerjakan soalnya dulu ya.',
      ],
      correct: [
        'Benar. Bahkan bayanganku terkesan.',
        'Bagus. Itu baru namanya hunter.',
        'Satu soal tumbang, tanpa drama.',
      ],
      wrong: [
        'Salah. Tapi bayangan tidak menghakimi. Sedikit saja.',
        'Itu bukan jawabannya. Tarik napas, coba lagi.',
        'Oops. Raja bayangan pun pernah salah hitung.',
      ],
      retry: ['Masih ada kesempatan. Jangan dibuang sia-sia.', 'Coba lihat vertexnya dulu.'],
      clear: [
        'Dungeon selesai. Bayangan bertepuk tangan dalam diam.',
        'Satu dungeon lagi jatuh. Rapi.',
      ],
      idle: [
        'Kamu masih di sana? Bayanganku sudah tidur siang.',
        'Aku nunggu sambil menghitung akar kuadrat. Sepi banget.',
        'Psst, soal tidak mengerjakan dirinya sendiri.',
      ],
      click: [
        'Jangan colek-colek. Aku sedang menyusun strategi.',
        'Fakta: sumbu simetri parabola selalu lewat vertex.',
        'Kalau a positif, parabola tersenyum. Kalau negatif, cemberut.',
        'Aku bukan ninja, aku bayangan. Beda tipis.',
        'Rahasia: jawaban benar kadang cuma soal teliti.',
      ],
    },
  },
  {
    id: 'parabo',
    name: 'Parabo',
    role: 'Slime Parabola (pembuat onar)',
    unlock: { t: 'start' },
    svg: (m) => slime(m, false),
    bio: 'Slime biru berbentuk parabola. Hidupnya naik turun, tapi vertexnya selalu stabil. Musuh pertamamu sekaligus teman paling berisik.',
    quote: 'Blub! Senyumku selalu terbuka ke atas!',
    say: {
      welcome: [
        'Blub! Halo {nama}! Aku Parabo, hidupku naik turun!',
        'Hai hai! Jangan injak aku, aku licin!',
      ],
      correct: [
        'Blub! Benar! Aku rela kalah asal kamu pintar!',
        'Aduh, HP-ku berkurang! Tapi bangga!',
        'Wah, kamu lebih tajam dari vertexku!',
      ],
      wrong: [
        'Hehe, salah. Tenang, aku juga sering salah nama.',
        'Blub... jawabannya bukan itu. Aku pura-pura tidak lihat.',
        'Salah itu bagian dari kurva belajar!',
      ],
      retry: ['Coba lagi! Aku tunggu sambil bergoyang.', 'Eh eh, tinggal dikit lagi kayaknya!'],
      clear: [
        'Hore! Kamu menang, aku mundur sambil ngeluyur!',
        'Dungeon selesai! Ayo pesta permen jeli!',
      ],
      idle: [
        'Blub... aku bosan. Ayo main parabola!',
        'Kalau kamu tidak bergerak, aku jadi garis lurus.',
        'Aku menggelinding sebentar ya, jangan kabur.',
      ],
      click: [
        'Geli! Jangan dicolek, aku slime sensitif!',
        'Fakta: y = x² itu parabola induknya, aku sepupunya.',
        'Aku mirip parabola karena senyumku selalu terbuka ke atas!',
        'Nilai a makin besar, aku makin langsing. Diet matematika!',
        'Blub blub! Itu bahasa slime untuk semangat!',
      ],
    },
  },
  {
    id: 'noir',
    name: 'Noir',
    role: 'Ksatria Bayangan',
    unlock: { t: 'rank', c: 'C' },
    svg: (m) => noir(m),
    bio: 'Ksatria setia berhelm biru yang bicaranya selalu formal, bahkan saat minta tolong dicarikan kunci rumah.',
    quote: 'Hamba siap membela, tapi tolong jangan tanya kunci jawaban.',
    say: {
      welcome: [
        'Hamba Noir, siap mengawal perjalananmu, {nama}.',
        'Tuan atau Nyonya {nama}, gerbang dungeon sudah terbuka.',
      ],
      correct: [
        'Jawaban yang gagah! Hamba terharu di balik helm.',
        'Tepat sasaran, bagai pedang menebas parabola.',
        'Hormat hamba untuk ketelitianmu!',
      ],
      wrong: [
        'Aduh, perisai hamba ikut retak mendengarnya.',
        'Belum tepat. Ksatria sejati bangkit lagi.',
        'Salah, tapi hamba tetap setia di sisimu.',
      ],
      retry: ['Hamba yakin kamu bisa, coba sekali lagi.', 'Tarik pedang logikamu, hunter.'],
      clear: [
        'Dungeon takluk! Hamba bersorak (pelan, bajuku berat).',
        'Kemenangan gemilang! Hamba catat dalam kronik.',
      ],
      idle: [
        'Hamba menunggu dengan sabar... dan sedikit pegal.',
        'Apakah Tuan sedang berpikir? Hamba tak ingin mengganggu.',
        'Zirah ini panas, tolong lanjutkan soalnya.',
      ],
      click: [
        'Hamba bukan kursi, mohon jangan duduki.',
        'Titah: vertex adalah titik puncak atau dasar parabola.',
        'Helm ini tidak terlalu pengap. Mungkin.',
        'Pedang hamba tajam, tapi tak bisa menjawab soal untukmu.',
        'Sumbu simetri: garis suci yang membelah parabola!',
      ],
    },
  },
  {
    id: 'lumi',
    name: 'Lumi',
    role: 'Pendekar Cahaya',
    unlock: { t: 'rank', c: 'B' },
    svg: (m) => lumi(m),
    bio: 'Pendekar ceria yang pedangnya bersinar setiap kali kamu menjawab benar. Tukang menyemangati nomor satu di guild.',
    quote: 'Cahaya matematika menembus soal tersulit!',
    say: {
      welcome: [
        'Halo {nama}! Lumi di sini, ayo terangi dungeon bareng!',
        'Semangat! Cahaya matematika bersamamu!',
      ],
      correct: [
        'Yeay! Benar! Kamu bersinar banget!',
        'Tebasan sempurna! Cling!',
        'Kamu keren! Aku mau minta tanda tangan!',
      ],
      wrong: [
        'Eh, belum. Tapi kamu hampir bersinar!',
        'Tidak apa-apa, lampu juga kadang berkedip.',
        'Salah sedikit, semangat tetap penuh!',
      ],
      retry: [
        'Ayo coba lagi, aku menyorak dari sini!',
        'Pelan-pelan, cek tanda positif dan negatif.',
      ],
      clear: ['Dungeon bersinar karena kamu! Hore!', 'Kita menang! Boleh high five?'],
      idle: [
        'Kamu lagi mikir ya? Aku tunggu sambil poles pedang.',
        'Hei hei, ayo lanjut. Cahaya tidak menunggu lama!',
        'Aku bikin yel-yel: Parabola! Parabola!',
      ],
      click: [
        'Hehe, geli! Nanti pedangnya jatuh!',
        'Tips: tulis dulu a, h, dan k sebelum menghitung.',
        'Aku suka grafik karena indah dilihat!',
        'Cahaya kuat, tapi nilai tetap harus ditulis rapi!',
        'Jangan lupa istirahat ya. Mata butuh cahaya juga!',
      ],
    },
  },
  {
    id: 'ratu',
    name: 'Antoinette',
    role: 'Ratu Semut Bayangan',
    unlock: { t: 'rank', c: 'A' },
    svg: (m) => ratu(m),
    bio: 'Ratu koloni angka yang rapi dan anggun. Pasukannya bisa mengangkat 50 kali berat badan, dan soal pun terasa ringan.',
    quote: 'Semut kecil, ilmu besar!',
    say: {
      welcome: [
        'Salam, {nama}! Aku Ratu Antoinette, penguasa koloni angka!',
        'Semut kecil, ilmu besar! Ayo belajar!',
      ],
      correct: [
        'Koloniku bersorak! Jawabanmu benar!',
        'Wah, kamu cekatan seperti semut pekerja!',
        'Mahkotaku hampir jatuh saking kagumnya!',
      ],
      wrong: [
        'Hmm, jalur salah. Semut juga kadang tersesat.',
        'Belum tepat. Kita ikuti jejak feromon lagi.',
        'Jangan sedih, rakyatku selalu mencoba lagi.',
      ],
      retry: [
        'Semut tidak menyerah, kamu juga jangan!',
        'Cari akar-akarnya, itu jalur rahasianya.',
      ],
      clear: [
        'Dungeon takluk! Pesta remah roti untuk semua!',
        'Titah ratu: kamu pantas dapat medali!',
      ],
      idle: [
        'Rakyatku sudah baris. Kamu masih belum jawab?',
        'Aku menghitung antena: dua. Jawabanmu mana?',
        'Aku bosan, mau menyuruh pasukan memindahkan gula.',
      ],
      click: [
        'Hei! Antenaku sensitif!',
        'Fakta: faktor (x - p)(x - q) memberi akar p dan q.',
        'Semut bisa mengangkat 50 kali bobot badan, kamu bisa angkat soal ini!',
        'Mahkota ini emas asli, jangan dicolek!',
        'Koloni yang rapi, jawaban pun rapi!',
      ],
    },
  },
  {
    id: 'raja',
    name: 'Raja Parabola',
    role: 'Boss Rank S',
    unlock: { t: 'rank', c: 'S' },
    svg: (m) => slime(m, true),
    bio: 'Raja slime yang merasa dirinya penguasa semua kurva. Galak di luar, sebenarnya takut kalau kamu dapat nilai sempurna.',
    quote: 'Mahkota ini berat, tapi gengsi lebih berat!',
    say: {
      welcome: [
        'MWAHAHA! Aku Raja Parabola! Akan kutaklukkan kamu, {nama}!',
        'Berani datang ke singgasanaku? Hebat!',
      ],
      correct: [
        'GRR! Serangan bagus... kerajaanku goyah!',
        'Tidak mungkin! Jawabanmu tepat!',
        'Kerajaanku retak, tapi aku tetap gagah!',
      ],
      wrong: [
        'HAHAHA! Salah! Rasakan kuasa kurvaku!',
        'Belum cukup kuat, anak muda.',
        'Salah! Mahkotaku makin berkilau!',
      ],
      retry: ['Coba lagi kalau berani!', 'Aku tunggu, jangan lama-lama.'],
      clear: [
        'Aku kalah... tapi aku akan kembali di Posttest!',
        'Hebat! Aku mengaku kalah, ambil mahkotaku!',
      ],
      idle: [
        'Kok diam? Takut ya?',
        'Aku sudah menunggu sejam. Kerajaanku kehabisan camilan.',
        'Cepat jawab, capek berdiri di singgasana!',
      ],
      click: [
        'Hei! Jangan colek raja!',
        'Titahku: gunakan rumus -b/2a!',
        'Sebenarnya aku baik hati, hanya mahkotaku yang galak.',
        'Parabola terbuka ke bawah? Itu berarti aku cemberut.',
        'Mahkota ini berat, tapi gengsi lebih berat!',
      ],
    },
  },
  {
    id: 'mochi',
    name: 'Mochi',
    role: 'Kucing Bayangan',
    unlock: { t: 'raid' },
    svg: (m) => mochi(m),
    bio: 'Kucing bayangan yang hanya muncul untuk hunter yang berani melawan waktu. Suka menjatuhkan benda dari meja, termasuk soal sulit.',
    quote: 'Meong. Itu bahasa kucing untuk: jawabanmu hampir benar.',
    say: {
      welcome: [
        'Meong. Halo {nama}. Aku Mochi, bayangan yang suka rebahan.',
        'Mrrr... kamu datang. Jangan bangunkan aku kalau soalnya mudah.',
      ],
      correct: ['Meong! Benar! Hadiahnya: satu dengkuran.', 'Hmph. Lumayan untuk seorang manusia.'],
      wrong: [
        'Meong... salah. Aku jatuhkan soalnya dari meja sebagai protes.',
        'Salah. Tapi aku tetap mengeong untukmu.',
      ],
      retry: ['Coba lagi. Aku mau tidur 5 menit.'],
      clear: ['Dungeon selesai. Waktunya tidur siang bersama.'],
      idle: ['Meong? Kamu ketiduran duluan?', 'Aku sudah menjilat bulu tiga kali. Ayo lanjut.'],
      click: [
        'Jangan elus perutku. Itu jebakan.',
        'Fakta: x-intercept itu tempat grafik menyentuh sumbu x, seperti aku menyentuh remote TV.',
        'Meong! Itu artinya semangat.',
        'Aku bayangan, tapi dengkuranku nyata.',
      ],
    },
  },
  {
    id: 'aurel',
    name: 'Aurel',
    role: 'Penyihir Es',
    unlock: { t: 'xp', n: 500 },
    svg: (m) => aurel(m),
    bio: 'Penyihir tenang berkacamata yang menghitung semuanya dua kali dan membekukan siapa saja yang menyalin jawaban.',
    quote: 'Dingin kepala, tepat jawabannya.',
    say: {
      welcome: [
        'Salam, {nama}. Otak yang dingin berpikir lebih jernih.',
        'Aurel hadir. Mari kita hitung dengan tenang.',
      ],
      correct: ['Analisis tepat. Es pun bertepuk tangan.', 'Sempurna. Rumusmu sekokoh kristal.'],
      wrong: [
        'Hmm, perhitunganmu mencair di tengah jalan.',
        'Belum tepat. Periksa tanda negatifnya, itu sering membekukan nilai.',
      ],
      retry: ['Hitung ulang dengan tenang.'],
      clear: ['Dungeon beku, nilai mencair indah.'],
      idle: [
        'Aku menunggu sambil membuat patung es berbentuk parabola.',
        'Es mulai mencair. Ayo lanjut.',
      ],
      click: [
        'Jangan sentuh tongkatku, dinginnya bisa membekukan pena.',
        'Tips: simpan x dalam kurung saat substitusi, jangan lupa tandanya.',
        'Kacamata ini bukan hiasan, aku memang rabun parabola.',
        'Dingin itu kunci ketelitian.',
      ],
    },
  },
  {
    id: 'zeri',
    name: 'Zeri',
    role: 'Peri Akar',
    unlock: { t: 'forum', n: 1 },
    svg: (m) => zeri(m),
    bio: 'Peri kecil penunjuk akar persamaan. Muncul setiap ada yang berani bertanya atau membantu di forum.',
    quote: 'Aku menunjuk titik nol, kamu menemukan jalannya!',
    say: {
      welcome: [
        'Halo {nama}! Aku Zeri, peri penunjuk akar!',
        'Ting ting! Ada soal akar? Aku tahu tempatnya!',
      ],
      correct: ['Ting! Benar! Taburan bintang untukmu!', 'Kamu nemu akarnya! Aku bangga!'],
      wrong: [
        'Eh, bukan di situ. Akarnya sembunyi di tempat lain!',
        'Aduh! Debu perinya jatuh. Coba lagi ya.',
      ],
      retry: ['Hampir! Coba kurung faktornya.'],
      clear: ['Dungeon selesai! Taburan glitter untuk semua!'],
      idle: ['Aku terbang muter-muter nungguin kamu.', 'Ting? Kamu masih di sana?'],
      click: [
        'Hihi, geli! Sayapku sensitif!',
        'Akar adalah titik di mana grafik menyentuh sumbu x. Ting!',
        'Kalau parabolanya melayang di atas sumbu, berarti tidak ada akar. Kasihan.',
        'Debu peri ini bukan glitter biasa, ini glitter matematika!',
      ],
    },
  },
  {
    id: 'gildan',
    name: 'Master Gildan',
    role: 'Ketua Guild',
    unlock: { t: 'rank', c: 'T' },
    svg: (m) => gildan(m),
    bio: 'Ketua guild yang galak tapi sayang pada anggotanya. Kumisnya konon menyimpan seluruh rumus kuadrat.',
    quote: 'Kumisku saksi: tidak ada soal yang tak bisa ditaklukkan!',
    say: {
      welcome: [
        'Hmph! Master Gildan di sini. Selamat datang di guild, {nama}.',
        'Tegakkan badan, {nama}! Latihan hari ini dimulai!',
      ],
      correct: ['Hmph! Lumayan. Kumisku sampai bergetar.', 'Bagus! Itu baru anggota guild sejati!'],
      wrong: [
        'Salah! Tapi guild tidak pernah meninggalkan anggotanya.',
        'Hmph, ulangi. Disiplin itu kunci.',
      ],
      retry: ['Satu kesempatan lagi. Jangan mengecewakan kumisku.'],
      clear: ['Hebat! Guild bangga padamu. Traktir kopi!'],
      idle: [
        'Kenapa diam? Guild bukan tempat bengong!',
        'Aku sudah membaca koran dua kali. Cepat lanjut.',
      ],
      click: [
        'Jangan tarik kumisku!',
        'Rumus sumbu simetri: x = -b/2a. Catat di dahi!',
        'Guild ini keluarga, dan keluarga saling membantu.',
        'Aku pernah menaklukkan soal Rank S dengan satu tangan. Tangan satunya pegang kopi.',
      ],
    },
  },
];

const MOODS = {
  welcome: 'happy',
  correct: 'happy',
  wrong: 'sad',
  retry: 'smug',
  clear: 'wow',
  levelup: 'wow',
  idle: 'smug',
  click: 'wow',
  hint: 'happy',
  raid: 'smug',
  raidwin: 'wow',
  raidlose: 'sad',
  forum: 'happy',
};
const Co = {
  last: 0,
  mood: 'happy',
  hideT: null,
  idleT: null,
  get: (id) => CHARS.find((c) => c.id === id),
  unlocked: (u) => CHARS.filter((c) => unlockOk(c, u)).map((c) => c.id),

  sync() {
    const u = me(),
      un = this.unlocked(u);
    u.seen = u.seen || un.slice();
    un.filter((i) => !u.seen.includes(i)).forEach((i) =>
      toast('Karakter baru terbuka: ' + this.get(i).name + '!'),
    );
    u.seen = un;
    save();
  },
  id() {
    const u = me();
    return u && u.co && this.unlocked(u).includes(u.co) ? u.co : 'kage';
  },
  on: () => !DB.coOff,
  mount() {
    $('#co').hidden = !this.on();
    this.render();
    this.touch();
    const b = $('#bc');
    if (b) {
      b.textContent = this.lbl(true);
      b.title = this.advisor() ? T247('adv_toggle') : 'Tampilkan atau sembunyikan teman pendamping';
      b.classList.toggle('on', this.on());
    }
  },
  unmount() {
    $('#co').hidden = true;
    clearTimeout(this.idleT);
  },
  advisor: () => !!(DB.me && me() && me().role === 'teacher' && window.Gm247),
  lbl(short) {
    return window.Gm247 ? Gm247.coText(short) : (short ? 'Teman: ' : 'Teman pendamping: ') + (this.on() ? 'ON' : 'OFF');
  },
  render() {
    if (!DB.me || !me()) return;
    const f = $('#cof');
    f.classList.toggle('advcof', this.advisor());
    const bc = $('#bc');
    if (bc) bc.title = this.advisor() ? T247('adv_toggle') : 'Tampilkan atau sembunyikan teman pendamping';
    window.Aud && Aud.sync();
    if (this.advisor()) {
      f.innerHTML = Gm247.emblem();
      f.title = T247('adv_name') + ': ' + T247('adv_hint');
      f.setAttribute('role', 'button');
      f.tabIndex = 0;
      return;
    }
    f.removeAttribute('role');
    f.removeAttribute('tabindex');
    $('#cof').innerHTML = this.get(this.id()).svg(this.mood);
    const sk = SKILLS[this.id()];
    $('#cof').title = sk ? 'Klik aku! Skill: ' + sk.n : 'Klik aku!';
  },
  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  say(ev, force) {
    if (!DB.me || !me() || !this.on() || $('#co').hidden || this.advisor()) return;
    if (!force && Date.now() - this.last < 1500) return;
    const ch = this.get(this.id()),
      arr = (window.I18N && I18N.say(ev)) || ch.say[ev] || COMMON[ev] || (COMMON.view && COMMON.view[ev]) || ch.say.welcome;
    this.last = Date.now();
    this.mood = MOODS[ev] || 'happy';
    this.render();
    const b = $('#cob');
    b.textContent = this.pick(arr).replace('{nama}', DB.me);
    window.Voice && Voice.speakChar(b.textContent, ch.id, ev);
    b.hidden = false;
    b.classList.remove('pop');
    void b.offsetWidth;
    b.classList.add('pop');
    clearTimeout(this.hideT);
    this.hideT = setTimeout(() => {
      b.hidden = true;
      this.mood = 'happy';
      this.render();
    }, 5200);
  },
  enterView(k) {
    if (['dash', 'rank', 'raid', 'forum', 'chars'].includes(k) && Date.now() - this.last > 8000)
      this.say(k);
  },
  touch() {
    clearTimeout(this.idleT);
    if (DB.me && this.on()) this.idleT = setTimeout(() => this.say('idle'), 40000);
  },
  jump(el) {
    el.classList.remove('jump');
    void el.offsetWidth;
    el.classList.add('jump');
    AU.sfx('hit');
  },
  select(id) {
    me().co = id;
    save();
    this.render();
    this.say('welcome', true);
    const sk = SKILLS[id];
    if (sk) toast('Skill aktif: ' + sk.n + '. ' + sk.d);
  },
  checkUnlock(before) {
    const u = me();
    Co.unlocked(u)
      .filter((i) => !before.includes(i))
      .forEach((i) => toast('Karakter baru terbuka: ' + Co.get(i).name + '!'));
  },

  track() {
    document.addEventListener('pointermove', (e) => {
      if (Co._raf) return;
      Co._raf = requestAnimationFrame(() => {
        Co._raf = 0;
        document.querySelectorAll('.chr').forEach((svg) => {
          const r = svg.getBoundingClientRect();
          if (!r.width) return;
          const dx = e.clientX - (r.left + r.width / 2),
            dy = e.clientY - (r.top + r.height * 0.4),
            d = Math.hypot(dx, dy) || 1,
            k = Math.min(1, d / 200) * 3.5;
          svg
            .querySelectorAll('.pupil')
            .forEach((p) =>
              p.setAttribute('transform', `translate(${(dx / d) * k} ${(dy / d) * k})`),
            );
        });
      });
    });
  },
};

const lockText = (c) => {
  const k = c.unlock;
  return k.t === 'rank'
    ? 'selesaikan ' + (RK.find((r) => r.c === k.c) || {}).n
    : k.t === 'raid'
      ? 'selesaikan 1 Raid Waktu'
      : k.t === 'xp'
        ? 'kumpulkan ' + k.n + ' XP'
        : 'tulis ' + k.n + ' topik atau balasan di forum';
};

const unlockOk = (c, u) => {
  const k = c.unlock;
  if (u.role === 'teacher' || k.t === 'start') return true;
  if (k.t === 'rank') return !!u.done[k.c];
  if (k.t === 'raid') return !!(u.raid && u.raid.runs.length);
  if (k.t === 'xp') return xpOf(u) >= k.n;
  if (k.t === 'forum') return forumCount(u.name) >= k.n;
  return false;
};
const charsView = () => {
  const u = me(),
    un = Co.unlocked(u),
    cur = Co.id();
  return `<div class="sys rv"><small class="tag">[ SYSTEM ] KARAKTER</small><h2>Guild Hall: Para Karakter</h2><p class="mut">Gerakkan kursor atau jarimu, mata mereka mengikuti! Klik karakter untuk berbincang. Taklukkan dungeon untuk membuka karakter baru, lalu pilih satu jadi temanmu. Setiap teman membawa <b>skill</b> unik (disebut juga Enhance) yang langsung aktif.</p>${Skill.cur() ? `<div class="skl on"><b>Skill aktifmu: ${esc(Skill.cur().n)}</b> <span class="tagc">${esc(Skill.cur().k)}</span><p class="mut sm">${esc(Skill.cur().d)}</p></div>` : ''}<p style="margin-top:10px"><button class="btn" id="sumon">Panggil bayangan!</button></p></div>
<div class="grid3">${CHARS.map((c) => {
    const ok = un.includes(c.id);
    return `<div class="card tilt chcard rv ${ok ? '' : 'lock'}" data-ch="${c.id}"><div class="chfig">${c.svg(ok ? 'happy' : 'sad')}</div><div class="cbub" hidden></div><h3>${ok ? c.name : '???'}</h3><p class="ttl sm">${ok ? c.role : 'Karakter tersembunyi'}</p><p class="mut">${ok ? c.bio : 'Taklukkan dungeon untuk mengungkap siapa dia.'}</p>${ok ? `<p class="quote">"${c.quote}"</p>` : ''}${ok ? `<p><button class="btn ghost vbtn" data-voice="${c.id}">${IC('mic')} Dengar suara</button></p>` : ''}${ok ? `<p><button class="btn ghost spotbtn" type="button" data-spot="char:${c.id}">&#9654; Putar Intro / Spotlight</button></p>` : ''}${ok ? Skill.card(c) : '<div class="skl"><b>Skill tersembunyi</b></div>'}${ok ? (cur === c.id ? '<span class="tagc" style="border-color:var(--gold);color:var(--gold)">Temanmu sekarang</span>' : `<button class="btn" data-pick="${c.id}">Jadikan teman</button>`) : `<span class="tagc">Terkunci: ${lockText(c)}</span>`}</div>`;
  }).join('')}</div>`;
};

const battleHTML = (c, items) => {
  if (c === 'P' || c === 'T') return '';
  if (window.Bat) return Bat.html(c, items);
  const u = me(),
    n = items.length,
    okc = items.filter((_, j) => (u.st[c + j] || {}).ok).length,
    ans = items.filter((_, j) => (u.st[c + j] || {}).done).length,
    hp = Math.round((1 - okc / n) * 100),
    boss = c === 'S' || c === 'R',
    ch = Co.get(boss ? 'raja' : 'parabo'),
    fin = ans === n,
    mood = fin
      ? hp === 0
        ? 'ko'
        : 'smug'
      : RS.hit === 'hit'
        ? 'wow'
        : RS.hit === 'miss'
          ? 'smug'
          : 'happy';
  return `<div class="battle ${RS.hit || ''}"><div class="bfig">${ch.svg(mood)}</div><div class="binfo"><b>${ch.name}${boss ? ' (Boss)' : ''}</b><div class="hp"><i style="width:${hp}%"></i></div><small class="mut">${fin ? (hp === 0 ? 'Tumbang! Kamu menang telak!' : 'Kabur dengan sisa ' + hp + '% HP. Coba lagi lain waktu!') : 'HP ' + hp + '%. Jawab benar untuk menyerang!'}</small></div></div>`;
};

const SKILLS = {
  kage: { n: 'Shadow Sense', k: 'Pasif', d: 'Penalti Petunjuk turun dari -10 menjadi -5 poin. Bayanganmu membisikkan arah dengan lebih halus.', hint: 5 },
  parabo: { n: 'Pantulan Kenyal', k: 'Aktif otomatis', d: 'Sekali per dungeon, saat percobaan terakhir salah kamu mendapat 1 percobaan ekstra (nyawa tambahan).', extra: 1 },
  noir: { n: 'Tameng Ksatria', k: 'Pasif', d: 'Petunjuk pertama di setiap dungeon GRATIS, tanpa pengurangan poin.', freeHint: 1 },
  lumi: { n: 'Cahaya Penyemangat', k: 'Pasif', d: 'Bonus +10% XP setiap kali kamu menaklukkan dungeon.', xp: 0.1 },
  ratu: { n: 'Koloni Semut', k: 'Pasif', d: 'Poin Raid +20%. Pasukan semut membantu mengangkat skormu.', raidPts: 0.2 },
  raja: { n: 'Mahkota Kurva', k: 'Pasif', d: 'Bonus +20% XP setiap dungeon. Sang raja berbagi harta karunnya.', xp: 0.2 },
  mochi: { n: 'Sembilan Nyawa', k: 'Pasif', d: 'Raid: tambahan 10 detik di setiap soal. Kucing selalu punya waktu lebih.', raidSec: 10 },
  aurel: { n: 'Beku Waktu', k: 'Aktif', d: 'Sekali per Raid, tekan tombol Beku Waktu untuk menambah 15 detik pada soal yang sedang berjalan.', freeze: 15 },
  zeri: { n: 'Berkah Akar', k: 'Pasif', d: 'Hadiah Misi Harian +30% XP saat diklaim.', dq: 0.3 },
  gildan: { n: 'Restu Ketua Guild', k: 'Pasif', d: 'Bonus +10% XP dungeon, Raid +8 detik per soal, dan penalti Petunjuk hanya -5 poin.', xp: 0.1, raidSec: 8, hint: 5 },
};
const Skill = {
  cur() {
    return DB.me && me() ? SKILLS[Co.id()] || null : null;
  },

  hintCost(c) {
    const s = this.cur();
    if (s && s.freeHint && this.freeAvail(c)) {
      this.note('Petunjuk gratis!');
      return 0;
    }
    const p = s && s.hint != null ? s.hint : 10;
    if (p < 10) this.note('penalti petunjuk hanya -' + p);
    return p;
  },
  freeAvail(c) {
    return !(Q[c] || []).some((_, j) => {
      const t = me().st[c + j];
      return t && t.hint && t.hp === 0;
    });
  },
  hintLabel(c) {
    const s = this.cur();
    if (s && s.freeHint && this.freeAvail(c)) return 'Petunjuk (GRATIS, skill ' + s.n + ')';
    return 'Petunjuk (-' + (s && s.hint != null ? s.hint : 10) + ' poin)';
  },

  canExtra(c, st) {
    const s = this.cur();
    if (!s || !s.extra || st.ex || maxA(c) <= 1) return false;
    return !(Q[c] || []).some((_, j) => (me().st[c + j] || {}).ex);
  },
  xpMul() {
    const s = this.cur();
    return 1 + ((s && s.xp) || 0);
  },
  raidSec() {
    const s = this.cur();
    return (s && s.raidSec) || 0;
  },
  raidPtsMul() {
    const s = this.cur();
    return 1 + ((s && s.raidPts) || 0);
  },
  dqMul() {
    const s = this.cur();
    return 1 + ((s && s.dq) || 0);
  },
  note(t) {
    const s = this.cur();
    if (s) toast('Skill ' + s.n + ': ' + (t === 'extra' ? 'percobaan ekstra diberikan!' : t));
  },

  raidButton() {
    const s = this.cur();
    if (!s || !s.freeze || typeof RD === 'undefined' || !RD || RD.fz || !$('#rk2')) return;
    $('#rk2').insertAdjacentHTML('beforebegin', `<button class="btn ghost" id="rfz" style="margin-right:8px">${s.n} (+${s.freeze} detik)</button>`);
    $('#rfz').onclick = () => {
      if (RD.lock || RD.fz) return;
      RD.fz = 1;
      RD.lim += s.freeze;
      $('#rfz').remove();
      AU.sfx('hit');
      toast('Waktu dibekukan: +' + s.freeze + ' detik');
    };
  },

  card(c) {
    const s = SKILLS[c.id];
    return s
      ? `<div class="skl"><b>Skill: ${esc(s.n)}</b> <span class="tagc">${esc(s.k)}</span><p class="mut sm">${esc(s.d)}</p></div>`
      : '';
  },
};

document.addEventListener('click', (e) => {
  const t = e.target;
  if (me && DB.me) Co.touch();
  const f = t.closest('.chfig'),
    card = t.closest('[data-ch]');
  if (f && card) {
    const ch = Co.get(card.dataset.ch),
      locked = card.classList.contains('lock');
    Co.jump(f);
    const b = $('.cbub', card);
    if (b) {
      b.textContent = locked ? '...' : Co.pick((window.I18N && I18N.say('click')) || ch.say.click);
      if (!locked) window.Voice && Voice.speakChar(b.textContent, ch.id, 'click');
      b.hidden = false;
      clearTimeout(b._t);
      b._t = setTimeout(() => (b.hidden = true), 3500);
    }
  }
  const pk = t.closest('[data-pick]');
  if (pk) {
    Co.select(pk.dataset.pick);
    route();
  }
  if (t.closest('#sumon')) {
    if (window.Bat) Bat.hall();
    else
      overlay(
        `<div><small class="tag">[ SYSTEM ]</small><h2>ARISE!</h2><p>Pasukan bayangan dipanggil</p></div>${army()}`,
        1800,
      );
    Co.say('click', true);
  }
  if (t.closest('#cof')) {
    if (Co.advisor()) Gm247.toggle();
    else Co.say('click', true);
    Co.jump($('#cof'));
  }
  if (t.closest('#bc')) {
    DB.coOff = !DB.coOff;
    save();
    Co.mount();
    if (Co.on()) Co.say('welcome', true);
  }
});
Co.track();
