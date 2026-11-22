'use strict';

window.Team = (() => {
  const x = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const HEX = /^#[0-9a-fA-F]{6}$/;

  const frame = (name, icon, photo) =>
    `<div class="tmemb tmframe${photo ? '' : ' nophoto'}"><i class="tmring"></i><i class="tmring r2"></i><div class="tmshield">${
      photo ? `<img class="tmimg" src="${x(photo)}" alt="${x(name)}" loading="lazy" decoding="async" onerror="this.parentNode.parentNode.classList.add('nophoto');this.remove()">` : ''
    }<span class="tmfb">${IC(icon || 'hunter')}</span></div></div>`;

  const card = (m, i) => {
    const [name, role, icon, cls, col, tags, duty, photo] = m;
    const ac = HEX.test(col || '') ? col : '#9a5aff';
    const chips = (tags && tags.length ? tags : String(role).split(/\s*&\s*/)).map((t) => `<span class="tmchip">${x(t)}</span>`).join('');
    return `<article class="tmcard tilt rv${i === 0 ? ' master' : ''}" style="--ac:${ac}">
<div class="tmtop"><span class="tmcls">${x(cls || 'Hunter')}</span><span class="tmno">${IC('gate')}<b>${String(i + 1).padStart(2, '0')}</b></span></div>
<div class="tmbody">
${frame(name, icon, photo)}
<div class="tmtxt"><h3>${x(name)}</h3><p class="tmrole">${x(role)}</p>${duty ? `<p class="tmduty">${x(duty)}</p>` : ''}<div class="tmchips">${chips}</div></div>
</div>
<div class="tmfoot"><span>${IC('shield')} ${x(TIM_INFO.guild)}</span><span>${IC('crystal')} ${i === 0 ? 'LEAD' : 'MEMBER'}</span></div>
</article>`;
  };
  const head = () => `<div class="tmhead rv"><div class="tmcrest">${IC('logo', 52)}</div><div><small class="tag">[ SYSTEM ] GUILD REGISTRY</small><h2>${x(TXT.timTitle)}</h2><p class="mut">${x(TIM_INFO.guild)} | ${x(TIM_INFO.course)}</p><p class="mut sm">${x(TIM_INFO.desc)}</p></div></div>`;
  const grid = () => `<div class="tmgrid">${TIM.map(card).join('')}</div>`;
  const banner = () => `<div class="tmban rv"><span>${IC('swords')}</span><div><b>${x(TIM_INFO.project)}</b><small>${x(TIM_INFO.guild)} | ${TIM.length} Hunter</small></div><span>${IC('crown')}</span></div>`;
  return {

    section: () => (typeof SHOW_TEAM !== 'undefined' && !SHOW_TEAM ? '' : `<section class="sec no-gl" id="tim">${head()}${grid()}${banner()}</section>`),

    view: () => `<div class="tmwrap no-gl">${head()}${grid()}${banner()}</div>`,
  };
})();
