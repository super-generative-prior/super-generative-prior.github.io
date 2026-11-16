/* =============================================================================
   Shared bits used across the site:
   helpers, the era palette, and the site footer.
   ========================================================================== */
window.SHM = (function () {
  'use strict';

  var ERA_COLOR = {
    super: 'var(--super)',
    hyper: 'var(--hyper)',
    master: 'var(--master)'
  };

  function make(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function live(href) { return href && href !== '#'; }

  /* pages under papers/ set window.SHM_BASE = '../' so data paths still resolve */
  function base() { return window.SHM_BASE || ''; }
  function path(p) { return /^([a-z]+:)?\/\//i.test(p || '') ? p : base() + (p || ''); }

  /* an <a> when the link is real, an inert <span> when it is still '#' */
  function linkOr(href, inner, cls) {
    var n;
    if (live(href)) {
      n = make('a', cls, inner);
      n.href = href;
      if (/^https?:/.test(href)) { n.target = '_blank'; n.rel = 'noopener'; }
    } else {
      n = make('span', cls, inner);
    }
    return n;
  }

  /* ---------------------------------------------------------------- logos -- */
  /* Renders into the given host. A logo with no `src` yet becomes a dashed
     wordmark of the same size, so dropping the file in later changes nothing
     about the layout. A broken path falls back the same way. */
  function buildLogos(host) {
    var items = window.LOGOS || [];
    if (!host || !items.length) return;

    var row = make('ul', 'logos-row');

    items.forEach(function (l) {
      var li = make('li', 'logo-item');
      li.style.setProperty('--h', (l.h || 28) + 'px');

      var word = '<span class="logo-word">' + esc(l.name) + '</span>';
      var link = linkOr(l.href, l.src ? '' : word, 'logo-link');
      link.setAttribute('aria-label', l.name);

      if (l.src) {
        var img = make('img');
        img.src = path(l.src);
        img.alt = l.name;
        img.loading = 'lazy';
        img.addEventListener('error', function () {
          link.innerHTML = word;               /* missing file → wordmark */
        });
        link.appendChild(img);
      }

      li.appendChild(link);
      row.appendChild(li);
    });

    host.appendChild(row);
    host.hidden = false;
  }

  function logosIn(where) {
    var p = window.LOGO_PLACEMENT || 'hero';
    return p === 'both' || p === where;
  }

  /* --------------------------------------------------------------- footer -- */
  function buildFooter(page) {
    var host = document.getElementById('siteFooter');
    if (!host) return;
    var onHome = page === 'home';
    var home = onHome ? '' : base() + 'index.html';

    var cols = [
      {
        head: 'Papers',
        items: (window.PAPERS || []).map(function (p) {
          return {
            label: esc(p.name) + ' <span class="yr">' + esc(p.year) + '</span>',
            href: home + '#' + p.id
          };
        })
      },
      {
        head: 'Site',
        items: [
          { label: 'Timeline', href: onHome ? '#top' : base() + 'index.html' },
          { label: 'Related Work', href: home + '#related' }
        ]
      },
      {
        head: 'Group',
        items: (window.LABS || []).map(function (l) {
          return { label: esc(l.name), href: l.href, ext: true };
        })
      }
    ];

    var grid = make('div', 'wrap foot-grid');

    var brand = make('div', 'foot-brand');
    var logo = make('a', 'foot-logo', 'Super <span>Hyper</span> Master');
    logo.href = onHome ? '#top' : base() + 'index.html';
    brand.appendChild(logo);
    brand.appendChild(make('p', 'foot-blurb', 'The Evolution of Generative Restoration'));
    grid.appendChild(brand);

    cols.forEach(function (c) {
      var nav = make('nav', 'foot-col');
      nav.appendChild(make('h3', null, esc(c.head)));
      var ul = make('ul');
      c.items.forEach(function (it) {
        var li = make('li');
        var a = make('a', null, it.label);
        a.href = it.href;
        if (it.ext && /^https?:/.test(it.href)) { a.target = '_blank'; a.rel = 'noopener'; }
        li.appendChild(a);
        ul.appendChild(li);
      });
      nav.appendChild(ul);
      grid.appendChild(nav);
    });

    var bottom = make('div', 'wrap foot-bottom',
      '<p>© ' + new Date().getFullYear() + ' XPixel Group &amp; collaborators.</p>' +
      '<p><a href="#top">Back to top ↑</a></p>');

    host.appendChild(grid);
    if (logosIn('footer')) {
      var strip = make('div', 'wrap logos foot-logos');
      buildLogos(strip);
      host.appendChild(strip);
    }
    host.appendChild(bottom);
  }

  /* the hero strip — both pages have a #heroLogos slot */
  function buildHeroLogos() {
    if (logosIn('hero')) buildLogos(document.getElementById('heroLogos'));
  }

  return {
    ERA_COLOR: ERA_COLOR,
    make: make,
    esc: esc,
    path: path,
    base: base,
    buildHeroLogos: buildHeroLogos,
    live: live,
    linkOr: linkOr,
    buildFooter: buildFooter
  };
})();
