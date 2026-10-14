import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { toLines, schedule } = require('./cast-timeline.js');

test('toLines normalizes CRLF and splits events into one flat line list', () => {
  const events = [
    { t: 0, text: '\r\n  herdr — Demo\r\n' },
    { t: 0.2, text: '  $ command\r\n' },
  ];
  assert.deepEqual(toLines(events), ['', '  herdr — Demo', '  $ command']);
});

test('toLines keeps inner blank lines (spacing between commands)', () => {
  const events = [{ t: 0, text: 'a\n\nb\n' }];
  assert.deepEqual(toLines(events), ['a', '', 'b']);
});

test('toLines drops trailing blank lines only', () => {
  const events = [{ t: 0, text: 'a\n\n\n' }];
  assert.deepEqual(toLines(events), ['a']);
});

test('toLines handles an empty event list', () => {
  assert.deepEqual(toLines([]), []);
});

test('schedule spaces lines evenly from zero', () => {
  const lines = ['a', 'b', 'c'];
  const out = schedule(lines, 0.09);
  assert.deepEqual(out.map((s) => s.at), [0, 0.09, 0.18]);
  assert.deepEqual(out.map((s) => s.line), ['a', 'b', 'c']);
});

test('schedule returns an empty list for empty lines', () => {
  assert.deepEqual(schedule([], 0.09), []);
});
