# Fieldnotes Workshop Registration

Fieldnotes is a registration demo for a fictional workshop in Heidelberg. It confirms a reservation, detects repeat registrations by normalized email, and offers a calendar file. Reservations stay in the current browser. There is no server-side capacity counter, attendee database, or email delivery. In browsers supporting Web Locks, simultaneous saves from tabs on the same origin are serialized.

## Run locally

```sh
python3 -m http.server 5186 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:5186/`. Use a fictional address on `example.com` to try the form. To repeat a successful booking test from scratch, use a fresh browser profile or a new fictional address.

## Verify

```sh
node --test
```

The tests check duplicate detection, storage failures, the calendar’s UTC times, and the Kane CLI release decision. The browser acceptance flow covers empty form validation, successful submission, hiding an old receipt when details are edited, and repeat submission after a reload with the same reference.

See [the verification record](VERIFICATION.md) for the reproduced bug and the follow-up browser checks.

To run the acceptance flow with an authenticated Kane CLI, keep the local server running and execute:

```sh
node kane-release-gate.mjs
```

The gate reads the [Kane CLI agent-mode verdict](https://www.testmuai.com/docs/kane-cli-agent-mode). It exits successfully only when the CLI exits successfully and the final `run_end` event reports `passed`. If it blocks release, inspect `test-results/kane-run.ndjson` and the CLI’s evidence for the failed checkpoint. Apply the fix without changing the acceptance criteria, then run the gate again. The raw results remain local and Git ignores them.
