/*
 * Minimal dependency-free player for asciicast v3 files.
 *
 * Usage: CastPlayer.create('assets/casts/demo1.cast', element);
 *
 * Loads a .cast file (first line: JSON header, then one JSON event per
 * line: [t, 'o', text]), flattens the output into lines and reveals them
 * at a fixed cadence via requestAnimationFrame into a dark-styled <pre>.
 * Deliberately a motion demo, not an archival replay: the gaps where the
 * agents were working would freeze the screen, so timing is replaced by
 * a per-line cadence.
 *
 * Overlay covers the terminal only before the first play and when the
 * playback finished. While playing there is no overlay; clicking pauses
 * and shows a small corner badge instead.
 */
(function () {
  'use strict';

  var LINE_INTERVAL = 0.09; // seconds per revealed line

  function loadCast(src) {
    return fetch(src).then(function (res) {
      if (!res.ok) throw new Error('cast-player: cannot load ' + src + ' (' + res.status + ')');
      return res.text();
    }).then(function (text) {
      var lines = text.split('\n');
      var header = JSON.parse(lines[0]);
      var events = [];
      for (var i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        var ev = JSON.parse(lines[i]);
        if (ev[1] === 'o') {
          events.push({ t: ev[0], text: String(ev[2]) });
        }
      }
      return { header: header, events: events };
    });
  }

  function create(src, container, opts) {
    opts = opts || {};
    var interval = opts.interval || LINE_INTERVAL;
    var fontPx = opts.fontPx || 13;

    var root = document.createElement('div');
    root.className = 'cast-player';
    root.style.cssText = [
      'position:relative',
      'width:100%',
      'background:#000028',
      'border-radius:10px',
      'overflow:hidden',
      'cursor:pointer',
      'box-sizing:border-box'
    ].join(';');
    root.innerHTML =
      '<pre class="cast-player-screen" spellcheck="false"></pre>' +
      '<div class="cast-player-overlay" style="position:absolute;inset:0;display:flex;' +
      'align-items:center;justify-content:center;background:rgba(0,0,40,0.6);' +
      'font-family:\'Menlo\',monospace;font-size:15px;font-weight:700;' +
      'letter-spacing:0.08em;color:#AAFF00;">&#9654; Wiedergabe</div>' +
      '<div class="cast-player-badge" style="position:absolute;right:10px;bottom:8px;' +
      'display:none;background:rgba(0,0,40,0.85);border:1px solid rgba(170,255,0,0.4);' +
      'border-radius:999px;padding:2px 10px;font-family:\'Menlo\',monospace;' +
      'font-size:11px;font-weight:700;color:#AAFF00;"></div>';
    container.appendChild(root);

    var screen = root.querySelector('.cast-player-screen');
    var overlay = root.querySelector('.cast-player-overlay');
    var badge = root.querySelector('.cast-player-badge');
    screen.style.cssText = [
      'margin:0',
      'padding:12px 14px',
      'font-family:\'Menlo\',monospace',
      'font-size:' + fontPx + 'px',
      'line-height:1.35',
      'color:#D8DFFF',
      'background:transparent',
      'white-space:pre',
      'overflow:hidden',
      'box-sizing:border-box'
    ].join(';');

    var schedule = null;
    var playing = false;
    var finished = false;
    var started = false;
    var elapsed = 0;   // playback time in seconds
    var clock = 0;     // performance.now() at last frame
    var rafId = null;
    var index = 0;     // next schedule entry to reveal

    function frame(now) {
      var delta = (now - clock) / 1000;
      clock = now;
      if (playing) {
        elapsed += delta;
        while (index < schedule.length && schedule[index].at <= elapsed) {
          screen.textContent += schedule[index].line + '\n';
          index++;
        }
        screen.scrollTop = screen.scrollHeight;
        if (index >= schedule.length) {
          finished = true;
          playing = false;
          showOverlay('&#9654; Nochmal');
          return;
        }
      }
      rafId = requestAnimationFrame(frame);
    }

    function showOverlay(html) {
      overlay.innerHTML = html;
      overlay.style.display = 'flex';
      badge.style.display = 'none';
    }

    function start() {
      if (finished || !started) {
        screen.textContent = '';
        index = 0;
        elapsed = 0;
        finished = false;
      }
      started = true;
      playing = true;
      overlay.style.display = 'none';
      badge.innerHTML = '&#10074;&#10074; läuft — Klick pausiert';
      badge.style.display = 'block';
      if (rafId === null) {
        clock = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    }

    function pause() {
      playing = false;
      badge.innerHTML = '&#9654; pausiert — Klick für weiter';
      badge.style.display = 'block';
    }

    function toggle() {
      if (playing) {
        pause();
      } else {
        start();
      }
    }

    root.addEventListener('click', toggle);

    loadCast(src).then(function (cast) {
      var lines = window.CastTimeline.toLines(cast.events);
      schedule = window.CastTimeline.schedule(lines, interval);

      // Size the terminal from the cast's cols/rows so the aspect stays right
      var term = cast.header.term || {};
      if (term.rows) {
        var lineH = fontPx * 1.35;
        root.style.height = Math.ceil(term.rows * lineH + 24) + 'px';
      }
    }).catch(function (err) {
      screen.textContent = String(err.message || err);
      screen.style.color = '#FF7F7F';
      root.style.cursor = 'default';
      root.removeEventListener('click', toggle);
    });

    return { play: start, pause: pause, toggle: toggle };
  }

  window.CastPlayer = { create: create };
})();
