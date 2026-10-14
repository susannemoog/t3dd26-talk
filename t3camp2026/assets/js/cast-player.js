/*
 * Minimal dependency-free player for asciicast v3 files.
 *
 * Usage: CastPlayer.create('assets/casts/demo1.cast', element);
 *
 * Loads a .cast file (first line: JSON header with cols/rows/idle_time_limit,
 * then one JSON event per line: [t, 'o', text]), replays the output events
 * time-controlled via requestAnimationFrame into a dark-styled <pre>.
 * No autoplay; click the terminal to play/pause.
 */
(function () {
  'use strict';

  function loadCast(src) {
    return fetch(src).then(function (res) {
      if (!res.ok) throw new Error('cast-player: cannot load ' + src + ' (' + res.status + ')');
      return res.text();
    }).then(function (text) {
      var lines = text.split('\n');
      var header = JSON.parse(lines[0]);
      var events = [];
      for (var i = 1; i < lines.length; i++) {
        var line = lines[i];
        if (!line.trim()) continue;
        var ev = JSON.parse(line);
        if (ev[1] === 'o') {
          events.push({ t: ev[0], text: String(ev[2]).replace(/\r\n/g, '\n') });
        }
      }
      return { header: header, events: events };
    });
  }

  /*
   * Build the playback timeline: cap the gap between two events at
   * idleTimeLimit seconds (asciinema idle_time_limit semantics).
   */
  function buildTimeline(events, idleTimeLimit) {
    var timeline = [];
    var prev = null;
    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      var at = ev.t;
      if (prev !== null) {
        var gap = ev.t - prev;
        if (gap > idleTimeLimit) at = prev + idleTimeLimit;
      }
      timeline.push({ at: at, text: ev.text });
      prev = at;
    }
    return timeline;
  }

  function create(src, container, opts) {
    opts = opts || {};
    var speed = opts.speed || 1;

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
      'align-items:center;justify-content:center;background:rgba(0,0,40,0.55);' +
      'font-family:\'Menlo\',monospace;font-size:14px;font-weight:700;' +
      'letter-spacing:0.08em;color:#AAFF00;">&#9654; Wiedergabe</div>';
    container.appendChild(root);

    var screen = root.querySelector('.cast-player-screen');
    var overlay = root.querySelector('.cast-player-overlay');
    screen.style.cssText = [
      'margin:0',
      'padding:12px 14px',
      'font-family:\'Menlo\',monospace',
      'font-size:13px',
      'line-height:1.35',
      'color:#D8DFFF',
      'background:transparent',
      'white-space:pre',
      'overflow:hidden',
      'box-sizing:border-box'
    ].join(';');

    var timeline = null;
    var idleCap = 2.0;
    var playing = false;
    var finished = false;
    var elapsed = 0;   // playback time in timeline units
    var clock = 0;     // performance.now() at last frame
    var rafId = null;
    var index = 0;     // next timeline entry to apply

    function setPlaying(on) {
      playing = on;
      overlay.style.display = on ? 'none' : 'flex';
      if (on) {
        clock = performance.now();
        rafId = requestAnimationFrame(frame);
      } else if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function frame(now) {
      var delta = (now - clock) / 1000;
      clock = now;
      elapsed += delta * speed;

      while (index < timeline.length && timeline[index].at <= elapsed) {
        screen.textContent += timeline[index].text;
        index++;
        screen.scrollTop = screen.scrollHeight;
      }

      if (index >= timeline.length) {
        finished = true;
        setPlaying(false);
        return;
      }
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (finished || !timeline.length) {
        // restart from the beginning
        screen.textContent = '';
        index = 0;
        elapsed = 0;
        finished = false;
      }
      setPlaying(true);
    }

    function toggle() {
      if (playing) {
        setPlaying(false);
        overlay.innerHTML = '&#10074;&#10074; Pause';
      } else {
        start();
      }
    }

    root.addEventListener('click', toggle);

    loadCast(src).then(function (cast) {
      var term = cast.header.term || {};
      idleCap = typeof cast.header.idle_time_limit === 'number' ? cast.header.idle_time_limit : idleCap;
      timeline = buildTimeline(cast.events, idleCap);

      // Size the terminal from the cast's cols/rows so the aspect stays right
      if (term.rows) {
        var lineH = 13 * 1.35; // font-size * line-height
        root.style.height = Math.ceil(term.rows * lineH + 24) + 'px';
      }
      if (opts.rows) root.style.height = Math.ceil(opts.rows * 13 * 1.35 + 24) + 'px';
    }).catch(function (err) {
      screen.textContent = String(err.message || err);
      screen.style.color = '#FF7F7F';
      root.style.cursor = 'default';
      root.removeEventListener('click', toggle);
    });

    return { play: start, pause: function () { setPlaying(false); }, toggle: toggle };
  }

  window.CastPlayer = { create: create };
})();
