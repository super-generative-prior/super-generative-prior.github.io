/* =============================================================================
   papers/<id>.html — the full page for one work.
   Every page is the same shell; everything below is rendered from window.PAPERS.
   Sections that have no data simply do not appear.
   ========================================================================== */
(function () {
  'use strict';

  var S = window.SHM;
  var PAPERS = window.PAPERS || [], ERAS = window.ERAS || {};
  var STATUS = { published: '', accepted: 'To appear', submission: 'Coming soon' };
  var make = S.make, esc = S.esc;

  function indexOf(id) {
    for (var i = 0; i < PAPERS.length; i++) if (PAPERS[i].id === id) return i;
    return -1;
  }

  function section(cls, kicker, title, lede) {
    var sec = make('section', 'p-sec ' + cls);
    var w = make('div', 'wrap');
    if (kicker || title) {
      var h = make('header', 'sec-head');
      if (kicker) h.appendChild(make('p', 'sec-kicker', esc(kicker)));
      if (title) h.appendChild(make('h2', 'sec-title', esc(title)));
      if (lede) h.appendChild(make('p', 'sec-lede', esc(lede)));
      w.appendChild(h);
    }
    sec.appendChild(w);
    sec.body = w;
    return sec;
  }

  /* ------------------------------------------------------------ top bar -- */
  function buildBar(active) {
    var host = document.getElementById('pbDots');
    if (!host) return;
    PAPERS.forEach(function (p) {
      var a = make('a', 'pb-item' + (p.id === active ? ' is-on' : ''));
      a.href = p.id === active ? '#top' : p.id + '.html';
      a.style.setProperty('--c', S.ERA_COLOR[p.era]);
      a.title = p.name + ' — ' + p.venue;
      if (p.status !== 'published') a.classList.add('is-soon');
      a.innerHTML = '<i class="pb-dot"></i><span>' + esc(p.name) + '</span>';
      host.appendChild(a);
    });
  }

  /* -------------------------------------------------------------- hero -- */
  function hero(p) {
    var el = make('header', 'p-hero');
    var w = make('div', 'wrap');

    var tags = make('p', 'd-tags');
    tags.innerHTML =
      '<span class="tag tag-era">' + esc(ERAS[p.era] ? ERAS[p.era].label : p.era) + '</span>' +
      '<span class="tag tag-venue">' + esc(p.venue) + '</span>' +
      (STATUS[p.status] && STATUS[p.status] !== p.venue
        ? '<span class="tag tag-status">' + esc(STATUS[p.status]) + '</span>' : '');
    w.appendChild(tags);

    w.appendChild(make('h1', 'p-name', esc(p.name)));
    /* a work with no public title yet just shows its name */
    if (p.title && p.title !== p.name) w.appendChild(make('p', 'p-title', esc(p.title)));

    if (p.authors) {
      var au = make('p', 'p-authors', esc(p.authors));
      w.appendChild(au);
    }

    var links = make('div', 'd-links p-links');
    if (p.soon && !(p.links || []).length) {
      /* the coming-soon card already says it; an inert "soon" pill would just repeat it */
      el.appendChild(w);
      return el;
    }
    if ((p.links || []).length) {
      p.links.forEach(function (l) {
        var live = S.live(l.href);
        var a = S.linkOr(l.href, esc(l.label) + (live ? ' <em>↗</em>' : ' <em>soon</em>'), 'd-link');
        if (!live) a.setAttribute('aria-disabled', 'true');
        links.appendChild(a);
      });
    } else {
      var s = make('span', 'd-link', 'Links coming soon');
      s.setAttribute('aria-disabled', 'true');
      links.appendChild(s);
    }
    w.appendChild(links);

    el.appendChild(w);
    return el;
  }

  /* -------------------------------------------------------------- lede -- */
  function lede(p) {
    var sec = make('section', 'p-sec p-lede');
    var w = make('div', 'wrap');
    if (p.tagline) w.appendChild(make('p', 'p-tagline', esc(p.tagline)));
    if (p.abstract) w.appendChild(make('p', 'p-abstract', esc(p.abstract)));
    sec.appendChild(w);
    return sec;
  }

  /* ------------------------------------------------------------ teaser -- */
  function teaser(p) {
    if (!p.teaser) return null;
    var sec = make('section', 'p-sec p-teaser');
    var w = make('div', 'wrap-wide');
    var fig = make('figure', 'tz');
    fig.innerHTML = '<img src="' + esc(S.path(p.teaser.src)) + '" alt="' + esc(p.teaser.alt || p.name) + '">' +
      (p.teaser.caption ? '<figcaption>' + esc(p.teaser.caption) + '</figcaption>' : '');
    w.appendChild(fig);
    sec.appendChild(w);
    return sec;
  }

  /* ------------------------------------------------------ at a glance -- */
  function facts(p) {
    if (!(p.facts || []).length) return null;
    var sec = section('p-facts');
    var dl = make('dl', 'pf-grid');
    p.facts.forEach(function (f) {
      var d = make('div', 'pf');
      d.innerHTML = '<dd>' + esc(f.v) + '</dd><dt>' + esc(f.k) + '</dt>';
      dl.appendChild(d);
    });
    sec.body.appendChild(dl);
    return sec;
  }

  /* ------------------------------------------------------- coming soon -- */
  function soon(p) {
    if (!p.soon) return null;
    var sec = make('section', 'p-sec p-soon');
    var w = make('div', 'wrap');
    var box = make('div', 'soon-box');
    box.innerHTML =
      '<p class="soon-label">' + esc(p.soon.label || 'Coming soon') + '</p>' +
      (p.soon.title ? '<h2 class="soon-title">' + esc(p.soon.title) + '</h2>' : '') +
      (p.soon.text ? '<p class="soon-text">' + esc(p.soon.text) + '</p>' : '') +
      (p.soon.meta ? '<p class="soon-meta">' + esc(p.soon.meta) + '</p>' : '');
    w.appendChild(box);
    sec.appendChild(w);
    return sec;
  }

  /* ----------------------------------------------- before / after pairs -- */
  function gallery(p) {
    var g = p.gallery;
    if (!g || !(g.items || []).length) return null;

    var sec = section('p-gallery', g.kicker || 'Results', g.title || 'Before and after', g.note);
    var grid = make('div', 'cmp-grid');

    /* when the source ships several widths, hand the browser a srcset and let it choose */
    function img(cls, base, alt, eager) {
      var ext = g.ext || '.png';
      var src, set = '';
      if ((g.widths || []).length) {
        var ws = g.widths;
        src = base + '_' + ws[ws.length - 1] + ext;
        set = ' srcset="' + ws.map(function (w) { return esc(S.path(base + '_' + w + ext)) + ' ' + w + 'w'; }).join(', ') +
          '" sizes="' + esc(g.sizes || '(max-width:900px) 92vw, 44vw') + '"';
      } else {
        src = base;
      }
      return '<img class="' + cls + '" src="' + esc(S.path(src)) + '"' + set +
        ' alt="' + esc(alt) + '" decoding="async" loading="' + (eager ? 'eager' : 'lazy') + '">';
    }

    g.items.forEach(function (it, i) {
      var fig = make('figure', 'cmp');
      var box = make('div', 'cmp-box');
      box.innerHTML =
        img('cmp-a', it.after, (it.label || '') + ' — restored', i === 0) +
        img('cmp-b', it.before, (it.label || '') + ' — input', i === 0) +
        '<span class="cmp-tag is-l">' + esc(g.beforeLabel || 'Input') + '</span>' +
        '<span class="cmp-tag is-r">' + esc(g.afterLabel || p.name) + '</span>' +
        '<span class="cmp-bar" aria-hidden="true"><i></i></span>' +
        '<input class="cmp-range" type="range" min="0" max="100" value="50" step="0.1" ' +
        'aria-label="Reveal ' + esc(it.label || 'the restored image') + '">';

      var range = box.querySelector('.cmp-range');
      range.addEventListener('input', function () {
        box.style.setProperty('--pos', range.value + '%');
      });

      /* a broken image should drop its card, not leave a hole */
      var failed = 0;
      box.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () {
          if (++failed && fig.parentNode) fig.parentNode.removeChild(fig);
          if (!grid.children.length && sec.parentNode) sec.parentNode.removeChild(sec);
        });
      });

      fig.appendChild(box);
      if (it.label) fig.appendChild(make('figcaption', null, esc(it.label)));
      grid.appendChild(fig);
    });

    sec.body.appendChild(grid);
    if (g.credit) sec.body.appendChild(make('p', 'cmp-credit', esc(g.credit)));
    return sec;
  }

  /* --------------------------------------------------------- animation -- */
  function animation(p) {
    if (!p.anim) return null;

    var sec = make('section', 'p-sec p-anim');
    var w = make('div', 'wrap-wide');

    var head = make('header', 'sec-head anim-head');
    var txt = make('div', 'ah-txt');
    txt.appendChild(make('p', 'sec-kicker', 'How it works'));
    if (p.anim.title) txt.appendChild(make('h2', 'sec-title', esc(p.anim.title)));
    if (p.anim.note) txt.appendChild(make('p', 'sec-lede', esc(p.anim.note)));
    head.appendChild(txt);

    /* our own transport — the embedded figure hides its own controls */
    var ctl = make('div', 'anim-ctl');

    var back = make('button', 'anim-step is-prev');
    back.type = 'button';
    back.setAttribute('aria-label', 'Previous step');

    var play = make('button', 'anim-btn');
    play.type = 'button';
    play.innerHTML = '<span class="ab-i" aria-hidden="true"></span><span class="ab-l">Pause</span>';
    play.setAttribute('aria-label', 'Pause the figure');

    var fwd = make('button', 'anim-step is-next');
    fwd.type = 'button';
    fwd.setAttribute('aria-label', 'Next step');

    ctl.appendChild(back);
    ctl.appendChild(play);
    ctl.appendChild(fwd);
    head.appendChild(ctl);
    w.appendChild(head);

    var frame = make('div', 'anim-frame');
    var ifr = make('iframe');
    ifr.src = S.path(p.anim.src);
    ifr.title = (p.anim.title || p.name) + ' — animated walkthrough';
    ifr.setAttribute('scrolling', 'no');
    ifr.setAttribute('loading', 'lazy');
    frame.appendChild(ifr);
    w.appendChild(frame);

    var hint = make('p', 'anim-hint',
      'Ten steps, playing on a loop. Pause it, or walk through them yourself — with the arrows ' +
      'above, or <kbd>←</kbd> <kbd>→</kbd>.');
    w.appendChild(hint);

    sec.appendChild(w);

    /* embedPlaying is the figure's real state, reported by the embed itself;
       userPaused records that the viewer — not the observer — stopped it. */
    /* visible starts true on purpose: if the observer is late or never fires, the
       figure should be playing, not stuck paused */
    var embedPlaying = true, userPaused = false, pausedByUs = false, visible = true;

    function tell(cmd) {
      if (ifr.contentWindow) ifr.contentWindow.postMessage({ type: 'shm-anim-cmd', cmd: cmd }, '*');
    }

    play.addEventListener('click', function () {
      userPaused = embedPlaying;   /* about to stop it → that was the viewer's doing */
      tell('toggle');
    });
    back.addEventListener('click', function () { tell('prev'); });
    fwd.addEventListener('click', function () { tell('next'); });

    /* height bridge: the embedded page reports its own height.
       Only ever grow, so the caption changing length does not make the page jump. */
    var maxH = 0, lastW = 0;
    window.addEventListener('message', function (e) {
      if (!ifr.contentWindow || e.source !== ifr.contentWindow) return;
      var d = e.data || {};
      if (d.type === 'shm-anim-state') {
        embedPlaying = !!d.playing;
        play.classList.toggle('is-paused', !d.playing);
        play.querySelector('.ab-l').textContent = d.playing ? 'Pause' : 'Play';
        play.setAttribute('aria-label', (d.playing ? 'Pause' : 'Play') + ' the figure');
        return;
      }
      if (d.type !== 'shm-anim-height' || !d.h) return;
      var w2 = frame.clientWidth;
      if (w2 !== lastW) { lastW = w2; maxH = 0; }
      if (d.h + 4 > maxH) { maxH = d.h + 4; ifr.style.height = maxH + 'px'; }
    });
    /* no resize reset here: the embed's height depends on its width only, and the
       width change above already clears the cap. Resetting on a height-only resize
       made the frame snap down to a short caption and jolt the page. */

    /* do not burn cycles animating something nobody is looking at — but never
       start something that was stopped on purpose, or that reduced motion stopped */
    function sync() {
      if (!visible) {
        if (embedPlaying) { tell('pause'); pausedByUs = true; }
      } else if (pausedByUs && !userPaused) {
        tell('play'); pausedByUs = false;
      }
    }

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { visible = en.isIntersecting; });
        sync();
      }, { rootMargin: '150px 0px' }).observe(frame);
    }

    /* the first observer callback lands before the frame exists, so its pause is
       lost; re-apply once the embed is live and has announced itself */
    ifr.addEventListener('load', function () { setTimeout(sync, 80); });

    /* what the page needs in order to drive the figure from the keyboard */
    sec.api = {
      step: function (dir) { tell(dir); },
      isVisible: function () { return visible; }
    };

    return sec;
  }

  /* ------------------------------------------------------------ method -- */
  function method(p) {
    if (!(p.method || []).length) return null;
    var sec = section('p-method', 'The method', p.methodTitle || 'Step by step');
    var ol = make('ol', 'ms-grid');
    p.method.forEach(function (m, i) {
      var li = make('li', 'ms');
      li.innerHTML =
        '<span class="ms-n">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
        '<h3>' + esc(m.t) + '</h3>' +
        '<p>' + esc(m.s) + '</p>';
      ol.appendChild(li);
    });
    sec.body.appendChild(ol);
    return sec;
  }

  /* ------------------------------------------------------ contributions -- */
  function highlights(p) {
    if (!(p.highlights || []).length) return null;
    var sec = section('p-highlights', 'Contributions', 'What this work adds');
    var ul = make('ul', 'd-highlights');
    p.highlights.forEach(function (h) { ul.appendChild(make('li', null, esc(h))); });
    sec.body.appendChild(ul);
    return sec;
  }

  /* ----------------------------------------------------------- results -- */
  function results(p) {
    if (!(p.results || []).length) return null;
    var sec = section('p-results', 'Results', p.resultsTitle || 'What it does');
    var ul = make('ul', 'rs-list');
    p.results.forEach(function (r) {
      var li = make('li', 'rs');
      li.innerHTML = '<p class="rs-claim">' + esc(r.claim) + '</p>' +
        (r.evidence ? '<p class="rs-ev">' + esc(r.evidence) + '</p>' : '');
      ul.appendChild(li);
    });
    sec.body.appendChild(ul);
    return sec;
  }

  /* --------------------------------------------------------- evolution -- */
  function evolution(p, i) {
    var sec = make('section', 'p-sec p-evo');
    var w = make('div', 'wrap');

    if (p.step) {
      var box = make('div', 'd-step');
      box.innerHTML = '<span class="d-step-label">Step in the evolution</span><p>' + esc(p.step) + '</p>';
      w.appendChild(box);
    }

    var nav = make('nav', 'd-nav');
    [PAPERS[i - 1], PAPERS[i + 1]].forEach(function (q, k) {
      if (!q) { nav.appendChild(make('span')); return; }
      var a = make('a', 'd-nav-btn' + (k ? ' is-next' : ''));
      a.href = q.id + '.html';
      a.innerHTML = '<span class="dir">' + (k ? 'Next →' : '← Previous') + '</span>' +
        '<span class="nm">' + esc(q.name) + '</span>' +
        '<span class="vn">' + esc(q.venue) + '</span>';
      nav.appendChild(a);
    });
    w.appendChild(nav);

    sec.appendChild(w);
    return sec;
  }

  /* --------------------------------------------------------- resources -- */
  function resources(p) {
    var extra = (p.resources || []).filter(function (r) { return S.live(r.href); });
    if (!extra.length && !p.bibtex) return null;

    var sec = section('p-res', 'Resources', 'Everything for this work');

    if (extra.length) {
      var ul = make('ul', 'res-grid');
      extra.forEach(function (r) {
        var li = make('li', 'res');
        var a = make('a', 'res-link');
        a.href = r.href; a.target = '_blank'; a.rel = 'noopener';
        a.innerHTML = '<span class="res-l">' + esc(r.label) + '</span>' +
          (r.note ? '<span class="res-n">' + esc(r.note) + '</span>' : '') +
          '<span class="res-a">↗</span>';
        li.appendChild(a);
        ul.appendChild(li);
      });
      sec.body.appendChild(ul);
    }

    if (p.bibtex) {
      var cite = make('details', 'cite');
      cite.open = true;                  /* the citation is the point of the section */
      cite.innerHTML = '<summary>BibTeX</summary><pre>' + esc(p.bibtex) + '</pre>' +
        '<button class="copy" type="button">Copy</button>';
      cite.querySelector('.copy').addEventListener('click', function (e) {
        var btn = e.currentTarget, txt = cite.querySelector('pre').textContent;
        var done = function () {
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
        };
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, done);
        else done();
      });
      sec.body.appendChild(cite);
    }
    return sec;
  }

  /* ---------------------------------------------------------------- go -- */
  function build() {
    var id = document.body.dataset.paper;
    var i = indexOf(id);
    if (i < 0) return;
    var p = PAPERS[i];

    document.body.dataset.era = p.era;
    buildBar(id);

    var root = document.getElementById('paperRoot');
    var figure = animation(p);
    [hero(p), lede(p), teaser(p), facts(p), soon(p), gallery(p), figure, method(p),
      highlights(p), results(p), evolution(p, i), resources(p)]
      .forEach(function (n) { if (n) root.appendChild(n); });

    S.buildFooter('paper');

    /* ← and → belong to the figure. They never change page: moving between works
       is what the dots at the top and the prev/next links at the bottom are for. */
    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey ||
          e.isComposing) return;

      if (e.key === 'Escape') { location.href = S.base() + 'index.html#' + p.id; return; }
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

      /* the comparison slider and any text field own their own arrows */
      var a = document.activeElement;
      if (a && a.closest && a.closest('input,textarea,select,[contenteditable]')) return;

      /* nothing to drive, or the figure is not on screen — leave the keys alone
         so the page still scrolls normally */
      if (!figure || !figure.api || !figure.api.isVisible()) return;

      e.preventDefault();
      figure.api.step(e.key === 'ArrowRight' ? 'next' : 'prev');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
