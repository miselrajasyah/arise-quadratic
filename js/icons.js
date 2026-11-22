'use strict';

(function () {
  const PATHS = {

    gate: '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M8.5 21v-9.4a3.5 3.5 0 0 1 7 0V21Z"/><path d="M4 21V10.5a8 8 0 0 1 16 0V21M8.5 21v-9.4a3.5 3.5 0 0 1 7 0V21M2.5 21h19M12 2.2v2.3"/><path d="M10.2 17.2c0-1.8 3.6-1.5 3.6-3.2"/>',

    dagger:
      '<g transform="rotate(45 12 12)"><path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 1.6l2.3 10.6H9.7Z"/><path d="M12 1.6l2.3 10.6H9.7ZM7.2 12.2h9.6M12 12.2v5.6"/><circle cx="12" cy="19.8" r="1.7"/></g>',

    swords:
      '<g transform="rotate(45 12 12)"><path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 1.5l1.9 12H10.1Z"/><path d="M12 1.5l1.9 12H10.1ZM8 13.5h8M12 13.5v5"/><circle cx="12" cy="20.3" r="1.3"/></g><g transform="rotate(-45 12 12)"><path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 1.5l1.9 12H10.1Z"/><path d="M12 1.5l1.9 12H10.1ZM8 13.5h8M12 13.5v5"/><circle cx="12" cy="20.3" r="1.3"/></g>',

    shield:
      '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 2.6l7.6 2.9v5.9c0 4.7-3.2 8.2-7.6 10.1-4.4-1.9-7.6-5.4-7.6-10.1V5.5Z"/><path d="M12 2.6l7.6 2.9v5.9c0 4.7-3.2 8.2-7.6 10.1-4.4-1.9-7.6-5.4-7.6-10.1V5.5ZM12 7.2v9.4M8.2 11h7.6"/>',

    crystal:
      '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 2.2l6.8 6.2L12 21.8 5.2 8.4Z"/><path d="M12 2.2l6.8 6.2L12 21.8 5.2 8.4ZM5.2 8.4h13.6M9.2 8.4L12 21.8M14.8 8.4L12 21.8M9.2 8.4L12 2.2l2.8 6.2"/>',

    crown:
      '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M3.2 18.2L4.6 7.6 9 12.2 12 5l3 7.2 4.4-4.6 1.4 10.6Z"/><path d="M3.2 18.2L4.6 7.6 9 12.2 12 5l3 7.2 4.4-4.6 1.4 10.6ZM3.2 21h17.6"/><circle cx="4.6" cy="5.9" r="1.1"/><circle cx="12" cy="3.4" r="1.1"/><circle cx="19.4" cy="5.9" r="1.1"/>',

    helm: '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 2.6c4.1 0 7 3 7 7.1v7.6l-3.2 3.3H8.2L5 17.3V9.7c0-4.1 2.900-7.100 7-7.100Z"/><path d="M12 2.6c4.1 0 7 3 7 7.1v7.6l-3.2 3.3H8.2L5 17.3V9.7c0-4.1 2.900-7.100 7-7.100ZM12 2.6v5M7.400 10.200h9.200l-1.100 3.400H8.500Z"/>',

    scroll:
      '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M6 3.2h9l4 4V20.800H6Z"/><path d="M6 3.200h9l4 4V20.800H6ZM15 3.200v4h4M9.200 12h7M9.200 16h7"/>',

    seal: '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 2.5l8.200 4.700v9.600L12 21.500l-8.200-4.700V7.200Z"/><path d="M12 2.500l8.200 4.700v9.600L12 21.500l-8.200-4.700V7.200ZM8 12.200l3 3 5.200-6"/>',

    trophy:
      '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M8 3.500h8v5.500a4 4 0 0 1-8 0Z"/><path d="M8 3.500h8v5.500a4 4 0 0 1-8 0ZM8 5.500H5v1.800A3 3 0 0 0 8 10.200M16 5.500h3v1.800a3 3 0 0 1-3 2.900M12 13v4.200M9 20.500h6M10 17.200h4"/>',

    hunter:
      '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 2.800c-3.400 0-5.800 2.600-5.800 6.200 0 1.600.5 2.800 1.200 3.800L5 21h14l-2.400-8.200c.7-1 1.200-2.200 1.200-3.800 0-3.600-2.400-6.200-5.800-6.200Z"/><path d="M12 2.800c-3.400 0-5.800 2.600-5.800 6.200 0 1.600.5 2.800 1.200 3.800L5 21h14l-2.400-8.200c.7-1 1.200-2.200 1.200-3.800 0-3.600-2.400-6.200-5.800-6.200Z"/><circle cx="10.200" cy="10" r=".9" fill="currentColor" stroke="none"/><circle cx="13.800" cy="10" r=".9" fill="currentColor" stroke="none"/>',

    radar:
      '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 7.300l4 2.500v4.500l-4 2.600-4-2.600V9.800Z"/><path d="M12 2.500l8.200 4.700v9.600L12 21.500l-8.200-4.700V7.200ZM12 7.300l4 2.500v4.500l-4 2.600-4-2.600V9.800ZM12 2.500v4.800M12 16.900v4.600M3.800 7.200L8 9.800M20.200 7.200L16 9.800M3.800 16.800L8 14.300M20.200 16.800L16 14.300"/>',

    star: '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 2.800l2.700 5.800 6.300.7-4.700 4.300 1.300 6.200L12 16.600 6.400 19.800l1.300-6.200L3 9.300l6.300-.7Z"/><path d="M12 2.800l2.700 5.800 6.300.7-4.700 4.300 1.300 6.200L12 16.600 6.400 19.800l1.300-6.200L3 9.300l6.300-.7Z"/>',
    starO:
      '<path d="M12 2.800l2.700 5.800 6.300.7-4.700 4.300 1.300 6.200L12 16.600 6.400 19.800l1.300-6.200L3 9.300l6.300-.7Z" stroke-dasharray="2.500 2"/>',

    book: '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M12 6.500c-1.700-1.600-4.300-2.200-8-2.200v13.500c3.700 0 6.300.6 8 2.200 1.700-1.600 4.300-2.200 8-2.200V4.300c-3.700 0-6.300.6-8 2.200Z"/><path d="M12 6.500c-1.700-1.600-4.300-2.200-8-2.200v13.500c3.700 0 6.300.6 8 2.200 1.700-1.600 4.300-2.200 8-2.200V4.300c-3.700 0-6.300.6-8 2.200ZM12 6.500V20"/>',

    eye: '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M2.500 12S6 5.500 12 5.500 21.500 12 21.500 12 18 18.500 12 18.500 2.500 12 2.500 12Z"/><path d="M2.500 12S6 5.500 12 5.500 21.500 12 21.500 12 18 18.500 12 18.500 2.500 12 2.500 12Z"/><circle cx="12" cy="12" r="3"/>',

    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.500 4l-3 16"/>',

    quill:
      '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M20 3.500C12 4 7.500 8.500 6.500 16l-1.800 4.300L9 18.500c7.500-1 11-6 11-15Z"/><path d="M20 3.500C12 4 7.500 8.500 6.500 16l-1.800 4.300L9 18.500c7.500-1 11-6 11-15ZM8.500 15.500l6-6"/>',

    hourglass:
      '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M7 3.500c0 5 3 6 5 8.500-2 2.500-5 3.500-5 8.500h10c0-5-3-6-5-8.500 2-2.500 5-3.500 5-8.500Z"/><path d="M6 3h12M6 21h12M7 3.500c0 5 3 6 5 8.500-2 2.500-5 3.500-5 8.500M17 3.500c0 5-3 6-5 8.500 2 2.500 5 3.500 5 8.500"/>',

    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.600 2.600 4 5.700 4 9s-1.400 6.400-4 9c-2.600-2.600-4-5.700-4-9s1.400-6.400 4-9Z"/>',

    note: '<path d="M9 18V5.500l11-2.200V16"/><circle cx="6" cy="18" r="3" fill="currentColor" fill-opacity=".2" stroke="none"/><circle cx="17" cy="16" r="3" fill="currentColor" fill-opacity=".2" stroke="none"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    speaker:
      '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M4 9.500v5h4l5 4v-13l-5 4Z"/><path d="M4 9.500v5h4l5 4v-13l-5 4ZM16.500 8.800a4.800 4.800 0 0 1 0 6.400M19 6.300a8.300 8.300 0 0 1 0 11.400"/>',
    mute: '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M4 9.500v5h4l5 4v-13l-5 4Z"/><path d="M4 9.500v5h4l5 4v-13l-5 4ZM17 9.500l4 5M21 9.500l-4 5"/>',
    mic: '<rect fill="currentColor" fill-opacity=".2" stroke="none" x="9" y="3" width="6" height="11" rx="3"/><path d="M9 6a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0ZM5 11a7 7 0 0 0 14 0M12 18v3.200M9 21h6"/>',
    bolt: '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M13 2.200L4.500 13.500H11l-1 8.300 8.500-11.300H12Z"/><path d="M13 2.200L4.500 13.500H11l-1 8.300 8.500-11.300H12Z"/>',
    check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>',
    play: '<path fill="currentColor" fill-opacity=".2" stroke="none" d="M7 4.500v15l12-7.500Z"/><path d="M7 4.500v15l12-7.500Z"/>',

    logo: '<path d="M12 2.300l8.800 5.100v10.200L12 22.700l-8.800-5.100V7.400Z" fill="url(#lgGrad)" fill-opacity=".22" stroke="url(#lgGrad)" stroke-width="1.500"/><path d="M8.600 18.500v-5.600a3.400 3.400 0 0 1 6.800 0v5.600" stroke="url(#lgGrad)" stroke-width="1.500"/><path d="M8.300 9.600l.8-3.200 1.600 1.500L12 5.200l1.300 2.700 1.600-1.500.8 3.200Z" fill="url(#lgGrad)" stroke="none"/><path d="M12 18.500v-3.200" stroke="url(#lgGrad)" stroke-width="1.500"/>',
  };
  const sprite =
    '<svg id="icoSprite" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><linearGradient id="lgGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5ee6f2"/><stop offset="1" stop-color="#9a5aff"/></linearGradient></defs>' +
    Object.keys(PATHS)
      .map((k) => `<symbol id="i-${k}" viewBox="0 0 24 24">${PATHS[k]}</symbol>`)
      .join('') +
    '</svg>';
  const mount = () => {
    if (!document.getElementById('icoSprite')) document.body.insertAdjacentHTML('afterbegin', sprite);
  };
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  const RICON = { P: 'scroll', 0: 'dagger', E: 'gate', D: 'swords', C: 'shield', B: 'crystal', A: 'helm', S: 'crown', R: 'seal', T: 'trophy' };

  const STEPICON = { Misi: 'scroll', Materi: 'book', Praktik: 'crystal', Soal: 'dagger', Latihan: 'swords' };
  const FLOWICON = ['hunter', 'gate', 'crystal', 'radar'];

  const IC = (n, s, cls) =>
    `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"${s ? ` style="width:${s}px;height:${s}px"` : ''}><use href="#i-${n}"/></svg>`;
  const RI = (c, s) => IC(RICON[c] || 'gate', s);

  const ICS = (n, x, y, s) => `<use class="icos" href="#i-${n}" x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}"/>`;

  const FLAGS = {
    id: '<rect width="30" height="10" fill="#e70011"/><rect y="10" width="30" height="10" fill="#fff"/>',
    en: '<rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" stroke-width="1.6"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#c8102e" stroke-width="3.4"/>',
    ja: '<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/>',
    ko: '<rect width="30" height="20" fill="#fff"/><path d="M9 10a6 6 0 0 1 12 0Z" fill="#cd2e3a"/><path d="M9 10a6 6 0 0 0 12 0Z" fill="#0047a0"/><circle cx="12" cy="10" r="3" fill="#cd2e3a"/><circle cx="18" cy="10" r="3" fill="#0047a0"/><g stroke="#000" stroke-width="1.2"><path d="M3 4l3-2M4 6l3-2M3 3.2l1.200-.8M23.500 2l3 2M24 4l3 2M25 6.800l2.500 1.400M3 16l3 2M4 14l3 2M24 18l3-2M23 16l3-2"/></g>',
  };
  const FLAG = (l) => `<svg class="flag" viewBox="0 0 30 20" width="24" height="16" aria-hidden="true" focusable="false"><g>${FLAGS[l] || ''}</g></svg>`;
  window.FLAG = FLAG;
  window.Ico = { PATHS, RICON, STEPICON, FLOWICON, IC, RI, ICS };
  window.IC = IC;
  window.RI = RI;
  window.ICS = ICS;
})();
