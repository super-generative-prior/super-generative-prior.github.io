/* =============================================================================
   team.html — the member grid. Content lives in assets/js/papers.js (window.TEAM)
   ========================================================================== */
(function () {
  'use strict';

  var S = window.SHM;
  var TINTS = ['super', 'hyper', 'master'];

  function build() {
    var T = window.TEAM || { members: [] };
    var blurb = document.getElementById('teamBlurb');
    if (blurb) blurb.textContent = T.blurb || '';

    var grid = document.getElementById('teamGrid');
    (T.members || []).forEach(function (m, i) {
      var li = S.make('li', 'tm');
      li.style.setProperty('--c', S.ERA_COLOR[TINTS[i % 3]]);
      li.style.setProperty('--d', (60 + i * 45) + 'ms');

      var avatar = m.photo
        ? '<img src="' + S.esc(m.photo) + '" alt="' + S.esc(m.name) + '">'
        : '<span class="tm-initials">' + S.esc(S.initials(m.name)) + '</span>';

      var inner =
        '<span class="tm-avatar">' + avatar + '</span>' +
        '<span class="tm-name">' + S.esc(m.name) + '</span>' +
        (m.role ? '<span class="tm-role">' + S.esc(m.role) + '</span>' : '') +
        (m.place ? '<span class="tm-place">' + S.esc(m.place) + '</span>' : '');

      li.appendChild(S.linkOr(m.href, inner, 'tm-link'));
      grid.appendChild(li);
    });

    S.buildHeroLogos();
    S.buildFooter('team');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
