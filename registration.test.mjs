import assert from 'node:assert/strict';
import test from 'node:test';
import { calendarFile, reservePlace } from './dist/registration.mjs';

test('a later reservation with the same email preserves the original reference', () => {
  const records = new Map();
  const storage = {
    getItem: key => records.get(key),
    setItem: (key, data) => records.set(key, data),
  };
  const first = reservePlace(storage, { name: '  Taylor Demo  ', email: 'demo@example.com' }, () => 'FN-ONE');
  const second = reservePlace(storage, { name: 'Another Name', email: ' Demo@Example.com ' }, () => 'FN-TWO');
  assert.deepEqual(first, {
    duplicate: false,
    entry: { name: 'Taylor Demo', email: 'demo@example.com', reference: 'FN-ONE' },
  });
  assert.deepEqual(second, { duplicate: true, entry: first.entry });
  assert.equal(JSON.parse([...records.values()][0]).length, 1);
});

test('a failed write is visible to the form rather than treated as a booking', () => {
  const storage = {
    getItem: () => null,
    setItem: () => { throw new Error('Storage disabled'); },
  };
  assert.throws(
    () => reservePlace(storage, { name: 'Taylor Demo', email: 'demo@example.com' }, () => 'FN-ONE'),
    /Storage disabled/,
  );
});

test('the calendar file exports the advertised winter CET time in UTC', () => {
  const event = calendarFile();
  assert.match(event, /DTSTART:20261203T163000Z\r\nDTEND:20261203T180000Z/);
  assert.ok(event.endsWith('END:VCALENDAR\r\n'));
});
