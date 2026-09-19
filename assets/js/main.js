/* =============================================================================
   Super Hyper Master — interaction
   Builds the horizontal timeline, the hover preview bubble and the detail panel.
   All copy lives in assets/js/papers.js
   ========================================================================== */
(function () {
  'use strict';

  var PAPERS = window.PAPERS, ERAS = window.ERAS;
  var ERA_COLOR = window.SHM.ERA_COLOR;
  var make = window.SHM.make, esc = window.SHM.esc;
  var STATUS = { published: '', accepted: 'To appear', submission: 'In submission' };

  /* node positions, in % of the track's inner width */
  var LEFT = 6, RIGHT = 94;
  var POS = PAPERS.map(function (_, i) {
    return PAPERS.length === 1 ? 50 : LEFT + i * (RIGHT - LEFT) / (PAPERS.length - 1);
  });

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    body: document.body,
    eras: $('eras'), nodes: $('nodes'), fill: $('trackFill'),
    timeline: $('timeline'), scroll: document.querySelector('.timeline-scroll'),
    hint: $('hint'),
    bubble: $('bubble'), bubName: $('bubName'), bubVenue: $('bubVenue'),
    bubTitle: $('bubTitle'), bubText: $('bubText'),
    stage: $('stage'), overview: $('overview'), ovGrid: $('ovGrid'), detail: $('detail')
  };

  var state = { active: null, hoverTimer: null, swapTimer: null };

  /* ------------------------------------------------------------- helpers */
  function byId(id) {
    for (var i = 0; i < PAPERS.length; i++) if (PAPERS[i].id === id) return PAPERS[i];
    return null;
  }
  function indexOf(id) {
    for (var i = 0; i < PAPERS.length; i++) if (PAPERS[i].id === id) return i;
    return -1;
  }

  /* -------------------------------------------------------- build: eras */
  function buildEras() {
    var groups = [], seen = {};
    PAPERS.forEach(function (p, i) {
      if (!seen[p.era]) { seen[p.era] = { era: p.era, from: i, to: i }; groups.push(seen[p.era]); }
      else seen[p.era].to = i;
    });

    groups.forEach(function (g, gi) {
      var a = POS[g.from], b = POS[g.to];
      var single = g.from === g.to;
      var node = make('div', 'era');
      node.dataset.era = g.era;
      if (single) node.dataset.single = '';
      node.style.setProperty('--era-c', ERA_COLOR[g.era]);
      node.style.left = ((a + b) / 2) + '%';
      node.style.width = single ? '96px' : (b - a) + '%';
      node.style.setProperty('--d', (700 + gi * 90) + 'ms');
      node.appendChild(make('span', 'era-label', esc(ERAS[g.era].label)));
      node.appendChild(make('span', 'era-bracket'));
      el.eras.appendChild(node);
    });
  }

  /* ------------------------------------------------------- build: nodes */
  function buildNodes() {
    PAPERS.forEach(function (p, i) {
      var n = make('button', 'node');
      n.type = 'button';
      n.id = 'node-' + p.id;
      n.dataset.id = p.id;
      n.setAttribute('role', 'tab');
      n.setAttribute('aria-selected', 'false');
      n.setAttribute('aria-label', p.name + ' — ' + p.venue);
      n.style.setProperty('--x', POS[i] + '%');
      n.style.setProperty('--node-c', ERA_COLOR[p.era]);
      n.style.setProperty('--d', (900 + i * 85) + 'ms');
      if (p.status === 'published') n.dataset.published = '';

      /* once the venue is withheld it reads "In submission" already */
      var soon = (STATUS[p.status] && STATUS[p.status] !== p.venue)
        ? '<span class="node-soon">' + esc(STATUS[p.status]) + '</span>' : '';

      n.innerHTML =
        '<span class="node-name">' + esc(p.name) + '</span>' +
        '<span class="node-dot"></span>' +
        '<span class="node-meta"><b>' + esc(p.venue) + '</b>' + soon + '</span>';

      n.addEventListener('mouseenter', function () { showBubble(p, i); });
      n.addEventListener('mouseleave', hideBubble);
      n.addEventListener('focus', function () { showBubble(p, i); });
      n.addEventListener('blur', hideBubble);
      n.addEventListener('click', function () { select(p.id, true); });
      n.addEventListener('keydown', onNodeKey);

      el.nodes.appendChild(n);
    });
  }

  function onNodeKey(e) {
    var i = indexOf(e.currentTarget.dataset.id), t = -1;
    if (e.key === 'ArrowRight') t = Math.min(PAPERS.length - 1, i + 1);
    else if (e.key === 'ArrowLeft') t = Math.max(0, i - 1);
    else if (e.key === 'Home') t = 0;
    else if (e.key === 'End') t = PAPERS.length - 1;
    else return;
    e.preventDefault();
    var btn = document.getElementById('node-' + PAPERS[t].id);
    btn.focus();
    if (state.active) select(PAPERS[t].id, false);
  }

  /* ------------------------------------------------------------- bubble */
  function showBubble(p, i) {
    clearTimeout(state.hoverTimer);
    if (window.matchMedia('(hover:none)').matches) return;

    el.bubName.textContent = p.name;
    el.bubVenue.textContent = p.venue;
    el.bubTitle.textContent = (p.title && p.title !== p.name) ? p.title : '';
    el.bubText.textContent = p.preview || p.tagline || '';
    el.bubble.style.setProperty('--era-c', ERA_COLOR[p.era]);
    el.bubble.style.color = '';

    // position: centred on the node, clamped inside the timeline box
    var host = el.timeline.getBoundingClientRect();
    var inner = el.nodes.getBoundingClientRect();
    var centre = (inner.left - host.left) + inner.width * POS[i] / 100;
    var bw = el.bubble.offsetWidth || 330;
    var left = Math.max(10, Math.min(centre - bw / 2, host.width - bw - 10));
    el.bubble.style.left = left + 'px';
    el.bubble.style.setProperty('--ax', (centre - left) + 'px');
    el.bubble.classList.add('is-on');
    el.hint.classList.add('is-dim');
  }

  function hideBubble() {
    clearTimeout(state.hoverTimer);
    state.hoverTimer = setTimeout(function () {
      el.bubble.classList.remove('is-on');
      el.hint.classList.remove('is-dim');
    }, 90);
  }

  /* ----------------------------------------------------------- overview */
  function buildOverview() {
    Object.keys(ERAS).forEach(function (key) {
      var e = ERAS[key];
      var mine = PAPERS.filter(function (p) { return p.era === key; });
      var card = make('div', 'ov-card');
      card.style.setProperty('--era-c', ERA_COLOR[key]);
      card.innerHTML =
        '<div class="ov-head"><span class="ov-label">' + esc(e.label) + '</span>' +
        '<span class="ov-count">' + mine.length + ' paper' + (mine.length > 1 ? 's' : '') + '</span></div>' +
        '<h3 class="ov-title">' + esc(e.title) + '</h3>' +
        '<p class="ov-blurb">' + esc(e.blurb) + '</p>';
      var list = make('div', 'ov-list');
      mine.forEach(function (p) {
        var chip = make('button', 'ov-chip', esc(p.name));
        chip.type = 'button';
        chip.addEventListener('click', function () { select(p.id, true); });
        list.appendChild(chip);
      });
      card.appendChild(list);
      el.ovGrid.appendChild(card);
    });
  }

  /* ------------------------------------------------------------- detail */
  function fillDetail(p) {
    var i = indexOf(p.id);

    $('dEra').textContent = ERAS[p.era].label;
    $('dVenue').textContent = p.venue;
    var st = $('dStatus');
    var stText = STATUS[p.status] === p.venue ? '' : (STATUS[p.status] || '');
    st.textContent = stText;
    st.dataset.s = stText ? p.status : 'published';   /* 'published' hides the chip */
    $('dName').innerHTML = '<a href="papers/' + esc(p.id) + '.html">' + esc(p.name) + '</a>';
    $('dTitle').textContent = (p.title && p.title !== p.name) ? p.title : '';
    $('dTagline').textContent = p.tagline || '';
    $('dAbstract').textContent = p.abstract || '';

    var hl = $('dHighlights');
    hl.innerHTML = '';
    (p.highlights || []).forEach(function (h, k) {
      var li = make('li', null, esc(h));
      li.style.animation = 'rise .6s var(--ease) backwards';
      li.style.animationDelay = (120 + k * 60) + 'ms';
      hl.appendChild(li);
    });

    var hint = $('dSoon');
    if (p.soon) {
      hint.hidden = false;
      hint.innerHTML = '<b>' + esc(p.soon.label || 'Coming soon') + '</b> ' +
        esc(p.soon.text || '');
    } else {
      hint.hidden = true;
    }

    $('dStep').textContent = p.step || '';

    /* the figure slot doubles as the door to the walkthrough */
    var fig = $('dFigure');
    fig.className = 'd-figure';
    if (p.figure) {
      fig.innerHTML = '<img src="' + esc(p.figure) + '" alt="' + esc(p.name) + ' teaser">';
    } else {
      var art = window.SHM.cover ? window.SHM.cover(p.id, 0) : '';
      fig.className = 'd-figure is-art' + (p.anim ? ' is-anim' : '');
      var label = p.anim
        ? '<span class="fa-t">' + esc(p.anim.title) + '</span>' +
          '<span class="fa-n">Animated walkthrough · 10 steps</span>'
        : '<span class="fa-t">' + esc(p.name) + '</span>' +
          '<span class="fa-n">Not public yet</span>';
      var inner = '<span class="fa-art" aria-hidden="true">' + art + '</span>' +
        '<span class="fa-cap">' + label + '</span>';
      fig.innerHTML = '';
      fig.appendChild(window.SHM.linkOr('papers/' + p.id + '.html', inner, 'fa-link'));
    }

    var stats = $('dStats');
    stats.innerHTML = '';
    (p.stats || []).forEach(function (s) {
      var row = make('div', 'd-stat');
      row.innerHTML = '<dt>' + esc(s.k) + '</dt><dd>' + esc(s.v) + '</dd>';
      stats.appendChild(row);
    });
    stats.style.display = (p.stats || []).length ? '' : 'none';

    $('dAuthors').textContent = p.authors || '—';

    var links = $('dLinks');
    links.innerHTML = '';

    var full = make('a', 'd-link is-primary', 'Full page <em>→</em>');
    full.href = 'papers/' + p.id + '.html';
    links.appendChild(full);

    if ((p.links || []).length) {
      p.links.forEach(function (l) {
        var live = window.SHM.live(l.href);
        var a = window.SHM.linkOr(l.href, esc(l.label) + (live ? ' <em>↗</em>' : ' <em>soon</em>'), 'd-link');
        if (!live) a.setAttribute('aria-disabled', 'true');
        links.appendChild(a);
      });
    }

    var cite = $('dCite');
    if (p.bibtex) { cite.hidden = false; $('dBibtex').textContent = p.bibtex; }
    else cite.hidden = true;

    var prev = PAPERS[i - 1], next = PAPERS[i + 1];
    setNav($('prevBtn'), prev);
    setNav($('nextBtn'), next);

    el.detail.setAttribute('aria-labelledby', 'node-' + p.id);
  }

  function setNav(btn, p) {
    if (!p) { btn.hidden = true; btn.onclick = null; return; }
    btn.hidden = false;
    btn.querySelector('.nm').textContent = p.name;
    btn.onclick = function () { select(p.id, true); };
  }

  /* ------------------------------------------------------------- select */
  /* cross-fade between panels — also used when swapping one paper for another */
  function showPanel(target, render) {
    var cur = document.querySelector('.panel.is-on');
    var instant = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    if (!cur || instant) {
      if (cur && cur !== target) cur.classList.remove('is-on', 'is-out');
      if (render) render();
      target.classList.remove('is-out');
      target.classList.add('is-on');
      return;
    }

    cur.classList.add('is-out');
    clearTimeout(state.swapTimer);
    state.swapTimer = setTimeout(function () {
      cur.classList.remove('is-on', 'is-out');
      if (render) render();
      target.classList.remove('is-on', 'is-out');
      void target.offsetWidth;            /* restart the enter animation */
      target.classList.add('is-on');
    }, 170);
  }

  function select(id, push) {
    var p = byId(id);
    if (!p) return;
    var same = state.active === id;
    state.active = id;

    el.body.dataset.era = p.era;
    el.fill.style.width = POS[indexOf(id)] + '%';

    Array.prototype.forEach.call(el.nodes.children, function (n) {
      var on = n.dataset.id === id;
      n.classList.toggle('is-active', on);
      n.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    Array.prototype.forEach.call(el.eras.children, function (g) {
      g.classList.toggle('is-live', g.dataset.era === p.era);
    });

    if (same && el.detail.classList.contains('is-on')) fillDetail(p);
    else showPanel(el.detail, function () { fillDetail(p); });

    centreNode(id);

    if (push) {
      history.pushState({ id: id }, '', '#' + id);
      nudgeIntoView();
    } else if (history.replaceState) {
      history.replaceState({ id: id }, '', '#' + id);
    }
  }

  function clear(push) {
    state.active = null;
    el.body.dataset.era = 'none';
    el.fill.style.width = '0%';
    Array.prototype.forEach.call(el.nodes.children, function (n) {
      n.classList.remove('is-active');
      n.setAttribute('aria-selected', 'false');
    });
    Array.prototype.forEach.call(el.eras.children, function (g) {
      g.classList.remove('is-live');
    });
    showPanel(el.overview);
    if (push) history.pushState({ id: null }, '', location.pathname + location.search);
  }

  /* keep the active node in view when the timeline scrolls sideways */
  function centreNode(id) {
    var sc = el.scroll, n = document.getElementById('node-' + id);
    if (!sc || !n || sc.scrollWidth <= sc.clientWidth + 4) return;
    var nr = n.getBoundingClientRect(), sr = sc.getBoundingClientRect();
    var delta = (nr.left + nr.width / 2) - (sr.left + sr.width / 2);
    if (Math.abs(delta) < 8) return;
    if (sc.scrollBy) sc.scrollBy({ left: delta, behavior: 'smooth' });
    else sc.scrollLeft += delta;
  }

  function nudgeIntoView(force) {
    /* setTimeout, not rAF: frame callbacks are paused in a background tab, and the
       scroll would then be silently dropped */
    setTimeout(function () {
      var r = el.stage.getBoundingClientRect();
      var y = window.scrollY + r.top - 90;
      if (force) {
        /* a link from the footer can be three screens away — gliding that far is
           disorienting, and the page's smooth scrolling would swallow it anyway */
        var root = document.documentElement, prev = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, y);
        root.style.scrollBehavior = prev;
      } else if (r.top > window.innerHeight - 160) {
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }

  /* ------------------------------------------------------- related work */
  function buildRelated() {
    var host = $('rwGrid');
    if (!host) return;
    var items = window.RELATED || [];
    var groups = window.RELATED_GROUPS || [];

    if (window.RELATED_PLACEHOLDER && items.length) $('relFlag').hidden = false;

    /* newest first inside each group; the year is read off the venue string so
       new entries can be dropped anywhere in the array */
    function year(r) {
      var m = String(r.venue || '').match(/(19|20)\d{2}/);
      return m ? +m[0] : 0;
    }

    groups.forEach(function (g, gi) {
      var mine = items.filter(function (r) { return r.group === g.key; });
      if (!mine.length) return;
      mine = mine.map(function (r, i) { return { r: r, i: i }; })
        .sort(function (a, b) { return year(b.r) - year(a.r) || a.i - b.i; })
        .map(function (x) { return x.r; });

      var sec = make('section', 'rw-group');
      sec.style.setProperty('--c', ERA_COLOR[g.tint] || ERA_COLOR.super);

      var head = make('header', 'rw-head');
      head.innerHTML =
        '<h3 class="rw-h">' + esc(g.title) + '</h3>' +
        (g.note ? '<p class="rw-note">' + esc(g.note) + '</p>' : '') +
        '<span class="rw-count">' + mine.length + '</span>';
      sec.appendChild(head);

      var grid = make('ul', 'rw-grid');
      mine.forEach(function (r, i) {
        var li = make('li', 'rw-card');
        li.style.setProperty('--d', (i % 3) * 70 + 'ms');

        var thumb = r.thumb
          ? '<img src="' + esc(window.SHM.path(r.thumb)) + '" alt="" loading="lazy">'
          : (window.SHM.cover ? window.SHM.cover(g.motif, gi * 7 + i) : '');

        var inner =
          '<span class="rw-thumb">' + thumb + '</span>' +
          '<span class="rw-body">' +
            '<span class="rw-meta">' +
              '<b>' + esc(r.venue) + '</b>' +
              (r.note ? '<i>' + esc(r.note) + '</i>' : '') +
            '</span>' +
            '<span class="rw-title">' + esc(r.title) + '</span>' +
            '<span class="rw-authors">' + esc(r.authors) + '</span>' +
          '</span>';

        li.appendChild(window.SHM.linkOr(r.href, inner, 'rw-link'));
        grid.appendChild(li);
      });

      sec.appendChild(grid);
      host.appendChild(sec);
    });
  }

  /* ---------------------------------------------------------------- wire */
  function init() {
    buildEras();
    buildNodes();
    buildOverview();
    buildRelated();
    window.SHM.buildHeroLogos();
    window.SHM.buildFooter('home');

    if (window.matchMedia('(hover:none)').matches) {
      el.hint.textContent = 'Swipe to explore · tap for the full story';
    }

    $('back').addEventListener('click', function () { clear(true); });

    $('dCopy').addEventListener('click', function (e) {
      e.preventDefault();
      var btn = e.currentTarget;
      var txt = $('dBibtex').textContent;
      var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, done);
      else done();
    });

    document.addEventListener('keydown', function (e) {
      /* a focused timeline node handles its own arrows — don't move twice */
      if (e.defaultPrevented) return;
      var t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || '')) return;
      if (e.key === 'Escape' && state.active) { clear(true); return; }
      if (!state.active) return;
      var i = indexOf(state.active);
      if (e.key === 'ArrowRight' && i < PAPERS.length - 1) { e.preventDefault(); select(PAPERS[i + 1].id, true); }
      if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); select(PAPERS[i - 1].id, true); }
    });

    /* the hash is the router: #supir selects a paper, no hash means overview.
       Anything else (#related, #top) is a plain anchor and left alone. */
    var booted = false;
    function route() {
      var id = location.hash.replace('#', '');
      if (byId(id)) {
        select(id, false);
        /* a hash that arrived after load came from a link — a footer paper link can
           be two screens below the panel it just opened, so take the reader there */
        if (booted) nudgeIntoView(true);
      } else if (!id && state.active) clear(false);
    }
    window.addEventListener('popstate', route);
    window.addEventListener('hashchange', route);

    window.addEventListener('resize', function () { el.bubble.classList.remove('is-on'); });

    route();
    booted = true;

    /* the timeline and cards are injected after the browser has already jumped
       to a plain anchor (#related, #top) — land on it again once it is built */
    var frag = location.hash.slice(1);
    if (frag && !byId(frag)) {
      var anchor = document.getElementById(frag);
      /* not scrollIntoView: behavior 'auto' inherits the page's smooth
         scrolling, which we do not want for a landing jump */
      if (anchor) {
        var land = function () {
          var root = document.documentElement, prev = root.style.scrollBehavior;
          root.style.scrollBehavior = 'auto';   /* the page is smooth-scrolling */
          window.scrollTo(0, anchor.getBoundingClientRect().top + window.scrollY);
          root.style.scrollBehavior = prev;
        };
        setTimeout(land, 0);
        window.addEventListener('load', function () { setTimeout(land, 0); });
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
