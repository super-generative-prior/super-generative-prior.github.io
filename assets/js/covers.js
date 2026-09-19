/* =============================================================================
   COVERS — generated schematic artwork.
   -----------------------------------------------------------------------------
   No photographs to hand, so every card draws its own diagram. Each family has a
   motif that says something about the work, and a seed varies it per entry so no
   two cards look alike. Everything is inline SVG using the card's --c tint, so it
   costs nothing to load and follows the era colours.

   SHM.cover(kind, seed)  →  an <svg> string on a 160 × 100 canvas.
   ========================================================================== */
(function () {
  'use strict';

  /* small deterministic generator — Math.random would reshuffle on every render */
  function rand(seed) {
    var s = (seed * 9301 + 49297) % 233280;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  function svg(inner) {
    return '<svg class="cv" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet" ' +
      'role="presentation" focusable="false">' + inner + '</svg>';
  }

  var C = 'var(--c,var(--accent))';
  var LINE = 'var(--line)';
  var SOFT = 'var(--line-soft)';
  var INK = 'var(--ink-4)';

  function rect(x, y, w, h, fill, o, r) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" rx="' + (r == null ? 2 : r) + '" fill="' + fill + '"' +
      (o != null ? ' opacity="' + o + '"' : '') + '/>';
  }
  function line(x1, y1, x2, y2, stroke, w, o) {
    return '<path d="M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2 + '" fill="none" stroke="' +
      stroke + '" stroke-width="' + (w || 1) + '" stroke-linecap="round"' +
      (o != null ? ' opacity="' + o + '"' : '') + '/>';
  }
  function circ(cx, cy, r, fill, o) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' +
      (o != null ? ' opacity="' + o + '"' : '') + '/>';
  }
  function box(x, y, w, h, o) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" rx="3" fill="' + C + '" opacity="' + (o || .14) + '" stroke="' + C +
      '" stroke-opacity="' + Math.min(1, (o || .14) + .3) + '" stroke-width="1"/>';
  }
  function arrow(x1, x2, y, stroke, o) {
    return line(x1, y, x2 - 3, y, stroke, 1, o) +
      '<path d="M' + (x2 - 3.6) + ',' + (y - 2.4) + ' L' + x2 + ',' + y + ' L' +
      (x2 - 3.6) + ',' + (y + 2.4) + 'Z" fill="' + stroke + '"' +
      (o != null ? ' opacity="' + o + '"' : '') + '/>';
  }

  /* ---------------------------------------------------------------- motifs -- */

  /* degraded field resolving into clean structure */
  function generative(seed) {
    var r = rand(seed), s = '';
    for (var i = 0; i < 70; i++) {
      var x = 12 + r() * 54, y = 16 + r() * 68;
      s += rect(x, y, 1.6 + r() * 3.4, 1.6, INK, .18 + r() * .4, 1);
    }
    for (var j = 0; j < 9; j++) {
      var w = 34 + r() * 26;
      s += rect(90, 20 + j * 7.4, w, 3.4, C, .22 + j * .07, 1.7);
    }
    s += line(79, 12, 79, 88, SOFT, 1);
    s += arrow(68, 90, 50, C, .85);
    return svg(s);
  }

  /* a stack of blocks with a signal running through it */
  function models(seed) {
    var r = rand(seed), s = '', n = 3 + Math.floor(r() * 2), hot = Math.floor(r() * n);
    var w = (120 - (n - 1) * 10) / n;
    for (var i = 0; i < n; i++) {
      var x = 20 + i * (w + 10), h = 30 + r() * 26, y = 50 - h / 2;
      s += box(x, y, w, h, i === hot ? .3 : .12);
      if (i < n - 1) s += arrow(x + w, x + w + 10, 50, INK, .7);
    }
    s += line(8, 50, 20, 50, INK, 1, .7);
    s += arrow(138, 150, 50, C, .9);
    return svg(s);
  }

  /* a grid of units with attribution pooling on a few of them */
  function interpret(seed) {
    var r = rand(seed), s = '';
    var cx = 48 + r() * 64, cy = 34 + r() * 32;
    s += '<defs><radialGradient id="cvg' + seed + '">' +
      '<stop offset="0" stop-color="' + C + '" stop-opacity=".55"/>' +
      '<stop offset="1" stop-color="' + C + '" stop-opacity="0"/></radialGradient></defs>';
    for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 13; x++) {
        var px = 12 + x * 11, py = 14 + y * 9.6;
        var d = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        var hot = Math.max(0, 1 - d / 42);
        s += rect(px, py, 7, 6, hot > .12 ? C : INK, .12 + hot * .7, 1);
      }
    }
    s += circ(cx, cy, 34, 'url(#cvg' + seed + ')');
    return svg(s);
  }

  /* a small decision graph feeding a scored scale */
  function agents(seed) {
    var r = rand(seed), s = '';
    var n = 3, ys = [26, 50, 74];
    s += circ(22, 50, 4.4, C, .85);
    for (var i = 0; i < n; i++) {
      var y = ys[i] + (r() - .5) * 8;
      s += line(26, 50, 60, y, INK, 1, .55);
      s += circ(64, y, 3.4, C, .3 + i * .2);
      s += line(68, y, 96, 50, INK, 1, .4);
    }
    s += circ(100, 50, 4.4, C, .85);
    s += line(112, 22, 112, 78, SOFT, 1);
    for (var k = 0; k < 6; k++) s += rect(112, 24 + k * 10, 4 + r() * 3, 2, INK, .45, 1);
    var mark = 24 + Math.floor(r() * 6) * 10;
    s += rect(112, mark, 34, 3, C, .9, 1.5);
    return svg(s);
  }

  /* ------------------------------------------------------- paper diagrams -- */
  /* these six are drawn to match the work, not generated */
  var PAPER = {
    /* a large frozen prior steered by a small adaptor, with a text line */
    supir: function () {
      return svg(
        box(16, 26, 62, 48, .16) +
        '<text x="47" y="54" text-anchor="middle" font-size="9" fill="' + C + '" opacity=".8" font-family="monospace">2.6B</text>' +
        box(16, 78, 62, 10, .34) +
        arrow(80, 100, 50, INK, .8) +
        box(102, 26, 44, 48, .26) +
        rect(102, 12, 44, 3, C, .5, 1.5) +
        rect(102, 18, 30, 3, C, .3, 1.5) +
        line(124, 22, 124, 26, INK, 1, .6) +
        rect(16, 14, 34, 2.4, INK, .4, 1.2)
      );
    },
    /* information leaving the backbone one way into the adapter */
    unicon: function () {
      var s = '', i;
      for (i = 0; i < 4; i++) {
        s += box(24, 18 + i * 18, 40, 13, .14);
        s += box(96, 18 + i * 18, 40, 13, .3);
        s += arrow(66, 94, 24.5 + i * 18, C, .85);
      }
      s += line(44, 12, 44, 18, INK, 1, .6);
      s += arrow(116, 116, 90, INK, .01);
      s += line(116, 90, 116, 94, INK, 1, .6);
      return svg(s);
    },
    /* one pass: in, through, out */
    hypir: function () {
      return svg(
        rect(10, 34, 26, 32, INK, .3, 2) +
        arrow(38, 58, 50, INK, .8) +
        box(60, 28, 40, 44, .3) +
        arrow(102, 122, 50, INK, .8) +
        rect(124, 34, 26, 32, C, .55, 2) +
        rect(60, 80, 40, 2.4, C, .6, 1.2) +
        '<text x="80" y="20" text-anchor="middle" font-size="8.5" fill="' + C + '" opacity=".75" font-family="monospace">1 PASS</text>'
      );
    },
    /* three frames sharing one warped noise field */
    hypi2vr: function () {
      var s = '', i;
      for (i = 0; i < 3; i++) {
        var x = 14 + i * 48;
        s += rect(x, 44, 38, 30, INK, .22, 2);
        s += box(x, 22, 38, 14, .28);
        if (i < 2) s += arrow(x + 38, x + 48, 29, C, .9);
      }
      s += '<path d="M33,80 C57,92 81,68 105,80 S141,88 141,80" fill="none" stroke="' + C +
        '" stroke-width="1.6" stroke-dasharray="4 3" opacity=".8"/>';
      return svg(s);
    },
    /* one generator, two supervision branches */
    hypvr: function () {
      return svg(
        rect(10, 40, 30, 20, INK, .28, 2) +
        arrow(42, 58, 50, INK, .8) +
        box(60, 36, 36, 28, .3) +
        arrow(98, 116, 26, C, .85) +
        arrow(98, 116, 74, C, .5) +
        box(118, 16, 32, 20, .22) +
        box(118, 64, 32, 20, .22) +
        line(78, 68, 78, 84, C, 1.4, .5) +
        line(78, 26, 78, 36, C, 1.4, .8)
      );
    },
    /* many kinds of damage converging on one model */
    mastir: function () {
      var s = '', i;
      for (i = 0; i < 5; i++) {
        var y = 14 + i * 18;
        s += rect(12, y, 22, 12, INK, .18 + i * .06, 2);
        s += line(36, y + 6, 62, 50, INK, 1, .45);
      }
      s += box(66, 32, 40, 36, .32);
      s += arrow(108, 128, 50, C, .85);
      s += rect(130, 34, 20, 32, C, .5, 2);
      return svg(s);
    }
  };

  var MOTIF = {
    generative: generative,
    models: models,
    interpret: interpret,
    agents: agents
  };

  window.SHM = window.SHM || {};
  window.SHM.cover = function (kind, seed) {
    if (PAPER[kind]) return PAPER[kind]();
    var fn = MOTIF[kind] || models;
    return fn(typeof seed === 'number' ? seed + 1 : 1);
  };
})();
