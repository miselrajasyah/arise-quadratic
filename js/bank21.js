'use strict';

window.LANG_DATA = window.LANG_DATA || {};
window.PQ = { 0: [], E: [], D: [], C: [], B: [], A: [], S: [] };
window.X21 = (id, en, ja, ko) => {
  const ex = window.LANG_DATA[id];
  if (ex && (ex[0] !== en || ex[1] !== ja || ex[2] !== ko) && !window.__bankDup) (window.__bankDup = window.__bankDup || []).push(id);
  window.LANG_DATA[id] = [en, ja, ko];
  return id;
};

window.MC21 = (L, q, o, hint, exp, mis, more) => {
  const it = Object.assign({ t: 'mc', L, q, o, a: [0], hint, exp }, mis ? { mis } : {}, more || {});
  it.show = it.a.map((i) => o[i]).join(' ; ');
  return it;
};

window.FL21 = (L, q, f, show, hint, exp) => ({ t: 'fill', L, q, f, show, hint, exp });
window.LAYER = [
  null,
  { n: 'Kontekstual', c: '#5ee6f2' },
  { n: 'Model Situasi', c: '#4cc38a' },
  { n: 'Model Formal', c: '#ffd86b' },
  { n: 'Matematika Formal', c: '#f472a8' },
];
const TAGS = { 0: 'GATE', P: 'PRETEST', T: 'POSTTEST', R: 'WRAP-UP' };
window.QADD = (c, items) => {
  items.forEach((it) => {
    if (!it.tag) it.tag = (TAGS[c] || 'RANK ' + c) + ' | BOSS';
    if (c === 'P' || c === 'T' || c === 'R') it.tag = TAGS[c];
    Q[c].push(it);
  });
};
if (!Q['0']) Q['0'] = [];

const LT = { E: [2, 3, 3, 4], D: [1, 4, 3, 4], C: [2, 3, 4, 4], B: [1, 3, 2, 4, 3, 4, 4], A: [2, 3, 4], S: [3, 3, 3, 4], R: [2, 3, 4], P: [4, 4, 4, 4, 4], T: [4, 4, 4, 4, 4] };
Object.keys(LT).forEach((c) => LT[c].forEach((l, i) => Q[c][i] && (Q[c][i].L = l)));
