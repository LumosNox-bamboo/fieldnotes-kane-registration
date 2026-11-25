import assert from 'node:assert/strict';
import test from 'node:test';
import { releaseDecision } from './kane-release-gate.mjs';

const passed = '{"type":"run_end","v":1,"status":"passed","reason":"Objective completed"}';
const failed = '{"type":"run_end","v":1,"status":"failed","reason":"Old receipt remained visible"}';

test('a successful exit with a passing final Kane verdict permits release', () => {
  assert.deepEqual(releaseDecision(0, `{"type":"run_start"}\n${passed}\n`), {
    release: true,
    reason: 'Objective completed',
  });
});

test('a failed final verdict or nonzero exit blocks release', () => {
  assert.deepEqual(releaseDecision(1, failed), { release: false, reason: 'Old receipt remained visible' });
  assert.equal(releaseDecision(0, failed).release, false);
  assert.equal(releaseDecision(1, passed).release, false);
});

test('missing, malformed, aborted, and unfamiliar output block release', () => {
  for (const output of ['', '{', '{"type":"run_start"}', passed.replace('"v":1', '"v":2')]) {
    assert.equal(releaseDecision(2, output).release, false);
  }
  assert.equal(releaseDecision(null, passed).release, false);
});
