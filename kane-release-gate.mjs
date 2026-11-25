import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function releaseDecision(exitCode, stdout) {
  const lines = stdout.trim().split('\n');
  let result;
  try {
    result = JSON.parse(lines.at(-1));
  } catch {
    return { release: false, reason: 'No final Kane CLI verdict' };
  }
  if (result?.type !== 'run_end' || result.v !== 1) {
    return { release: false, reason: 'Unrecognized final Kane CLI event' };
  }
  return {
    release: exitCode === 0 && result.status === 'passed',
    reason: result.reason ?? result.status ?? 'Missing run status',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const objective = readFileSync(new URL('./verification-objective.md', import.meta.url), 'utf-8');
  const run = spawnSync(process.env.FIELDNOTES_KANE_CLI ?? 'kane-cli', [
    'run', objective, '--url', 'http://127.0.0.1:5186/', '--headless', '--agent',
    '--max-steps', '32', '--timeout', '480', '--final-validation', 'on',
  ], { encoding: 'utf-8', timeout: 525_000, maxBuffer: 2 * 1024 * 1024, stdio: ['ignore', 'pipe', 'inherit'] });
  const evidence = new URL('./test-results/', import.meta.url);
  mkdirSync(evidence, { recursive: true, mode: 0o700 });
  writeFileSync(new URL('kane-run.ndjson', evidence), run.stdout ?? '', { mode: 0o600 });
  const decision = releaseDecision(run.status, run.stdout ?? '');
  console.log(JSON.stringify(decision));
  process.exitCode = decision.release ? 0 : 1;
}
