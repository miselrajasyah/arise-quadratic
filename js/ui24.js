'use strict';

window.Ui24 = (() => {
  const lang = () => (window.I18N && I18N.lang) || 'id';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const reduced = () => (typeof DB !== 'undefined' && DB && DB.rm) || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  const PWT = {
    id: ['Tampilkan password', 'Sembunyikan password'],
    en: ['Show password', 'Hide password'],
    ja: ['パスワードを表示', 'パスワードを隠す'],
    ko: ['비밀번호 표시', '비밀번호 숨기기'],
  };
  const EYE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.9"/></svg>';
  const EYE_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10.5 7 10.5 7a17 17 0 0 1-3.2 4M6.3 6.5C3.4 8.4 1.5 12 1.5 12S5.5 19 12 19a10 10 0 0 0 4.2-.9M9.9 9.9a3.2 3.2 0 0 0 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const pwLabel = (inp, btn) => {
    const shown = inp.type === 'text',
      t = PWT[lang()] || PWT.id;
    btn.setAttribute('aria-label', shown ? t[1] : t[0]);
    btn.title = shown ? t[1] : t[0];
    btn.setAttribute('aria-pressed', shown ? 'true' : 'false');
    btn.innerHTML = shown ? EYE_OFF : EYE;
  };
  const enhance = (root) => {
    (root || document).querySelectorAll('input[type="password"]:not([data-pw24])').forEach((inp) => {
      inp.dataset.pw24 = '1';
      const w = document.createElement('span');
      w.className = 'pwwrap';
      inp.parentNode.insertBefore(w, inp);
      w.appendChild(inp);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pweye';
      b.tabIndex = 0;
      w.appendChild(b);
      pwLabel(inp, b);
      b.addEventListener('pointerdown', (e) => e.preventDefault());
      b.addEventListener('click', () => {
        let s = null,
          e = null;
        try {
          s = inp.selectionStart;
          e = inp.selectionEnd;
        } catch (x) {}
        const show = inp.type === 'password';
        inp.type = show ? 'text' : 'password';
        inp.setAttribute('autocapitalize', 'off');
        inp.setAttribute('spellcheck', 'false');
        pwLabel(inp, b);
        inp.focus({ preventScroll: true });
        try {
          if (s != null) inp.setSelectionRange(s, e);
        } catch (x) {}
      });
    });
  };
  const hideAll = () => {
    document.querySelectorAll('input[data-pw24]').forEach((inp) => {
      if (inp.type === 'text') {
        inp.type = 'password';
        const b = inp.parentNode.querySelector('.pweye');
        b && pwLabel(inp, b);
      }
    });
  };
  const relabel = () =>
    document.querySelectorAll('input[data-pw24]').forEach((inp) => {
      const b = inp.parentNode.querySelector('.pweye');
      b && pwLabel(inp, b);
    });

  let awk = null;
  const awaken = () => {
    if (reduced()) return;
    if (awk) awk.remove();
    const el = document.createElement('div');
    el.className = 'awk24';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<canvas></canvas><div class="awk-ring"></div><div class="awk-txt">AWAKENING</div>';
    document.body.appendChild(el);
    awk = el;
    const cv = el.querySelector('canvas'),
      dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = (cv.width = Math.round(innerWidth * dpr)),
      h = (cv.height = Math.round(innerHeight * dpr)),
      cx = cv.getContext('2d');
    const N = 90,
      P = [...Array(N)].map((_, i) => {
        const a = Math.random() * 6.283,
          v = 120 + Math.random() * 520;
        return { a, v, s: 2 + Math.random() * 4, c: i % 3 === 0 ? '#5ee6f2' : i % 3 === 1 ? '#b46bff' : '#ffffff', l: 0.7 + Math.random() * 0.6 };
      });
    const t0 = performance.now(),
      D = 1300;
    const draw = (now) => {
      if (!el.isConnected) return;
      const t = (now - t0) / 1000;
      cx.clearRect(0, 0, w, h);
      const fl = Math.max(0, 1 - t / 0.35);
      if (fl > 0) {
        cx.fillStyle = `rgba(190,170,255,${0.35 * fl})`;
        cx.fillRect(0, 0, w, h);
      }
      P.forEach((p) => {
        const age = t / p.l;
        if (age > 1) return;
        cx.globalAlpha = 1 - age;
        cx.fillStyle = p.c;
        const d = p.v * t * dpr;
        cx.fillRect(w / 2 + Math.cos(p.a) * d, h * 0.42 + Math.sin(p.a) * d * 0.75 - 60 * t * dpr, p.s * dpr, p.s * dpr);
      });
      cx.globalAlpha = 1;
      if (now - t0 < D) requestAnimationFrame(draw);
      else {
        el.remove();
        if (awk === el) awk = null;
      }
    };
    requestAnimationFrame(draw);
    setTimeout(() => {
      el.remove();
      if (awk === el) awk = null;
    }, D + 400);
  };

  const LEGAL = {
    id: {
      btn: 'Kebijakan Privasi & Ketentuan',
      title: 'Kebijakan Privasi & Ketentuan Penggunaan',
      close: 'Tutup',
      upd: 'Berlaku sejak v2.4. Dokumen ini dibuat ringkas agar mudah dipahami siswa dan guru.',
      s: [
        ['Tujuan', "Shadow Monarch's Quadratic Dungeon adalah media e-learning fungsi kuadrat. Data yang kami simpan hanya dipakai untuk keperluan pembelajaran di kelas."],
        ['Data yang disimpan', 'Nama hunter, email, kelas, peran (siswa atau guru), progres dungeon, skor Pretest, Latihan, Boss Quiz, Posttest, N-Gain, catatan kesalahan, XP, avatar, pengaturan tampilan, serta tulisan yang kamu kirim di Forum Diskusi.'],
        ['Cara data dipakai', 'Guru memakai nilai dan progres untuk melihat perkembangan belajar, menyusun peringkat kelas, dan mencetak Transkrip Evaluasi. Siswa lain hanya melihat nama hunter, title, XP, dan isi forum. Email dan skor tidak ditampilkan ke siswa lain.'],
        ['Penyimpanan dan keamanan', 'Akun dan progres disimpan di layanan cloud Firebase (Authentication dan Firestore). Password dikelola Firebase dan tidak dapat dibaca guru maupun pengembang. Sebagian pengaturan disimpan di browser perangkatmu (localStorage).'],
        ['Yang tidak kami lakukan', 'Data tidak dijual, tidak dipakai untuk iklan, dan tidak dibagikan ke pihak lain di luar keperluan pembelajaran dan layanan cloud di atas.'],
        ['Hak kamu', 'Kamu bisa meminta guru atau pengembang untuk memperbaiki atau menghapus akunmu. Tombol Reset progres di Profil menghapus progres dari akunmu sendiri.'],
        ['Ketentuan penggunaan', 'Gunakan akun sendiri dan jaga kerahasiaan password. Tulis dengan sopan di forum, jangan membagikan data pribadi, dan jangan mencoba merusak atau menembus sistem. Pesan forum dibatasi satu kiriman tiap 5 detik. Akun yang menyalahgunakan layanan dapat dibatasi oleh guru.'],
        ['Konten dan ketersediaan', 'Materi dan soal dibuat untuk pembelajaran dan dapat berubah. Layanan disediakan apa adanya, sebagian fitur (GeoGebra, sinkronisasi) membutuhkan internet.'],
      ],
    },
    en: {
      btn: 'Privacy Policy & Terms',
      title: 'Privacy Policy & Terms of Use',
      close: 'Close',
      upd: 'Effective from v2.4. Kept short so students and teachers can read it easily.',
      s: [
        ['Purpose', "Shadow Monarch's Quadratic Dungeon is an e-learning medium for quadratic functions. The data we store is used only for classroom learning."],
        ['Data we store', 'Hunter name, email, class, role (student or teacher), dungeon progress, Pretest, Practice, Boss Quiz and Posttest scores, N-Gain, mistake log, XP, avatar, display settings, and what you post in the Discussion Forum.'],
        ['How data is used', 'Teachers use scores and progress to follow learning, build the class leaderboard, and print the Evaluation Transcript. Other students only see hunter names, titles, XP and forum posts. Emails and scores are not shown to other students.'],
        ['Storage and security', 'Accounts and progress are stored in the Firebase cloud (Authentication and Firestore). Passwords are handled by Firebase and cannot be read by teachers or developers. Some settings are kept in your own browser (localStorage).'],
        ['What we do not do', 'Data is not sold, not used for ads, and not shared with anyone beyond the learning purpose and the cloud service above.'],
        ['Your rights', 'You may ask your teacher or the developer to correct or delete your account. The Reset progress button in Profile clears the progress of your own account.'],
        ['Terms of use', 'Use your own account and keep your password private. Be polite in the forum, do not share personal data, and do not try to break or bypass the system. Forum posts are limited to one every 5 seconds. Accounts that abuse the service may be restricted by the teacher.'],
        ['Content and availability', 'Lessons and questions are made for learning and may change. The service is provided as is; some features (GeoGebra, sync) need internet.'],
      ],
    },
    ja: {
      btn: 'プライバシーポリシーと利用規約',
      title: 'プライバシーポリシーと利用規約',
      close: '閉じる',
      upd: 'v2.4から適用。生徒と先生が読みやすいよう簡潔にまとめています。',
      s: [
        ['目的', "Shadow Monarch's Quadratic Dungeon は二次関数のeラーニング教材です。保存するデータは授業での学習の目的にのみ使います。"],
        ['保存するデータ', 'ハンター名、メール、クラス、役割（生徒または教師）、ダンジョンの進捗、プレテスト・練習・ボスクイズ・ポストテストの得点、N-Gain、ミスノート、XP、アバター、表示設定、ディスカッションフォーラムへの投稿。'],
        ['データの使い方', '教師は得点と進捗で学びの様子を確認し、クラスのランキングや評価トランスクリプトを作ります。他の生徒に見えるのはハンター名、称号、XP、フォーラムの投稿だけです。メールと得点は他の生徒に表示されません。'],
        ['保存とセキュリティ', 'アカウントと進捗はFirebaseクラウド（AuthenticationとFirestore）に保存されます。パスワードはFirebaseが管理し、教師も開発者も読めません。一部の設定はお使いのブラウザ（localStorage）に保存されます。'],
        ['行わないこと', 'データは販売せず、広告にも使わず、学習の目的と上記クラウドサービス以外の第三者へ共有しません。'],
        ['あなたの権利', '教師または開発者にアカウントの訂正や削除を依頼できます。プロフィールの「進捗をリセット」で自分のアカウントの進捗を消せます。'],
        ['利用規約', '自分のアカウントを使い、パスワードを秘密にしてください。フォーラムでは丁寧に書き、個人情報を共有せず、システムを壊したり回避したりしないでください。フォーラムの投稿は5秒に1回までです。悪用したアカウントは教師が制限することがあります。'],
        ['内容と提供', '教材と問題は学習用で、変更されることがあります。サービスは現状のまま提供され、一部の機能（GeoGebra、同期）はインターネットが必要です。'],
      ],
    },
    ko: {
      btn: '개인정보 처리방침 및 이용약관',
      title: '개인정보 처리방침 및 이용약관',
      close: '닫기',
      upd: 'v2.4부터 적용. 학생과 교사가 쉽게 읽도록 간단히 정리했습니다.',
      s: [
        ['목적', "Shadow Monarch's Quadratic Dungeon은 이차함수 e-러닝 매체입니다. 저장되는 데이터는 수업 학습 목적으로만 사용됩니다."],
        ['저장하는 데이터', '헌터 이름, 이메일, 학급, 역할(학생 또는 교사), 던전 진행도, 사전평가·연습·보스 퀴즈·사후평가 점수, N-Gain, 오답 노트, XP, 아바타, 화면 설정, 토론 포럼에 올린 글.'],
        ['데이터 사용 방법', '교사는 점수와 진행도로 학습 상황을 확인하고 학급 순위와 평가 성적표를 만듭니다. 다른 학생에게는 헌터 이름, 칭호, XP, 포럼 글만 보입니다. 이메일과 점수는 다른 학생에게 표시되지 않습니다.'],
        ['저장과 보안', '계정과 진행도는 Firebase 클라우드(Authentication, Firestore)에 저장됩니다. 비밀번호는 Firebase가 관리하며 교사나 개발자도 볼 수 없습니다. 일부 설정은 기기의 브라우저(localStorage)에 저장됩니다.'],
        ['하지 않는 일', '데이터는 판매하지 않고 광고에 쓰지 않으며, 학습 목적과 위 클라우드 서비스 외의 제3자에게 공유하지 않습니다.'],
        ['여러분의 권리', '교사나 개발자에게 계정 정정 또는 삭제를 요청할 수 있습니다. 프로필의 진행도 초기화 버튼은 본인 계정의 진행도를 지웁니다.'],
        ['이용 약관', '본인 계정을 사용하고 비밀번호를 비밀로 하세요. 포럼에서는 예의를 지키고 개인정보를 공유하지 말며 시스템을 망가뜨리거나 우회하지 마세요. 포럼 글은 5초에 한 번만 올릴 수 있습니다. 서비스를 악용한 계정은 교사가 제한할 수 있습니다.'],
        ['콘텐츠와 제공', '수업 자료와 문제는 학습용이며 바뀔 수 있습니다. 서비스는 있는 그대로 제공되며 일부 기능(GeoGebra, 동기화)은 인터넷이 필요합니다.'],
      ],
    },
  };
  const legalBtn = () => (LEGAL[lang()] || LEGAL.id).btn;
  let lm = null,
    lmPrev = null;
  const closeLegal = () => {
    if (!lm) return;
    lm.remove();
    lm = null;
    document.removeEventListener('keydown', legalKey, true);
    document.body.classList.remove('cs-lock');
    try {
      lmPrev && lmPrev.isConnected && lmPrev.focus({ preventScroll: true });
    } catch (e) {}
  };
  const legalKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLegal();
    } else if (e.key === 'Tab' && lm) {
      const f = [...lm.querySelectorAll('button,a[href]')];
      if (!f.length) return;
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  };
  const openLegal = () => {
    closeLegal();
    const L = LEGAL[lang()] || LEGAL.id;
    lmPrev = document.activeElement;
    lm = document.createElement('div');
    lm.className = 'lg24';
    lm.setAttribute('role', 'dialog');
    lm.setAttribute('aria-modal', 'true');
    lm.setAttribute('aria-label', L.title);
    lm.setAttribute('data-no-i18n', '');
    lm.innerHTML = `<div class="sys lg24-box"><button type="button" class="x" aria-label="${esc(L.close)}">×</button><small class="tag">[ SYSTEM ] LEGAL</small><h2>${esc(L.title)}</h2><p class="mut sm">${esc(L.upd)}</p>${L.s.map((x, i) => `<h3>${i + 1}. ${esc(x[0])}</h3><p>${esc(x[1])}</p>`).join('')}<p style="margin-top:14px"><button type="button" class="btn lg24-ok">${esc(L.close)}</button></p></div>`;
    document.body.appendChild(lm);
    document.body.classList.add('cs-lock');
    lm.addEventListener('click', (e) => {
      if (e.target === lm || e.target.closest('.x') || e.target.closest('.lg24-ok')) closeLegal();
    });
    document.addEventListener('keydown', legalKey, true);
    lm.querySelector('.lg24-ok').focus({ preventScroll: true });
  };

  let lastPost = 0;
  const COOL = 5000;
  const COOLMSG = {
    id: 'Tunggu {n} detik sebelum mengirim pesan lagi.',
    en: 'Please wait {n} seconds before sending another message.',
    ja: '次のメッセージを送るまで{n}秒お待ちください。',
    ko: '다음 메시지를 보내려면 {n}초 기다려 주세요.',
  };

  const forumGate = () => {
    const now = Date.now(),
      left = lastPost + COOL - now;
    if (left > 0) {
      const m = (COOLMSG[lang()] || COOLMSG.id).replace('{n}', Math.ceil(left / 1000));
      if (typeof toast === 'function') toast(m);
      return false;
    }
    lastPost = now;
    return true;
  };

  document.addEventListener('click', (e) => {
    const sp = e.target.closest('[data-spot]');
    if (sp) {
      e.preventDefault();
      e.stopPropagation();
      const [k, id] = sp.dataset.spot.split(':');
      window.Cut && Cut.spot(k, id);
      return;
    }
    if (e.target.closest('[data-legal]')) {
      e.preventDefault();
      openLegal();
    }
  });
  document.addEventListener('langchange', () => {
    relabel();
    document.querySelectorAll('[data-legal]').forEach((b) => (b.textContent = legalBtn()));
    if (lm) openLegal();
  });
  window.addEventListener('hashchange', closeLegal);
  const boot = () => {
    enhance();
    const am = document.getElementById('authm');
    if (am) new MutationObserver(() => am.hidden && hideAll()).observe(am, { attributes: true, attributeFilter: ['hidden'] });

    new MutationObserver(() => document.querySelectorAll('[data-legal]:empty').forEach((b) => (b.textContent = legalBtn()))).observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('[data-legal]:empty').forEach((b) => (b.textContent = legalBtn()));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  return { enhance, hideAll, awaken, openLegal, closeLegal, forumGate, legalBtn };
})();
