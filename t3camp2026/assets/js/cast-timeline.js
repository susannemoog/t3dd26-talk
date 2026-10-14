/*
 * Pure timeline helpers for the cast player — testable in Node and the browser.
 * UMD-ish: module.exports in Node, window.CastTimeline in the browser.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CastTimeline = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /*
   * Flatten cast output events into one list of lines.
   * Normalizes CRLF to LF, keeps inner blank lines (spacing), drops
   * trailing blank lines only. Deliberately ignores the event timing:
   * this is a motion demo, so lines reveal at a fixed cadence instead
   * of freezing on the gaps where the agents were working.
   */
  function toLines(events) {
    var text = events
      .map(function (e) { return e.text; })
      .join('');
    text = text.replace(/\r\n/g, '\n');
    var parts = text.split('\n');
    while (parts.length && parts[parts.length - 1].trim() === '') {
      parts.pop();
    }
    return parts;
  }

  /*
   * Build the reveal schedule: line i appears at i * interval seconds.
   */
  function schedule(lines, interval) {
    return lines.map(function (line, i) {
      return { at: i * interval, line: line };
    });
  }

  return { toLines: toLines, schedule: schedule };
});
