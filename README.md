# Fieldnotes Workshop Registration

Fieldnotes is a registration demo for a fictional workshop in Heidelberg. It confirms a reservation, detects repeat registrations by normalized email, and offers a calendar file. Reservations stay in the current browser. There is no server-side capacity counter, attendee database, or email delivery.

## Run locally

```sh
python3 -m http.server 5186 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:5186/`. Use a fictional address on `example.com` to try the form. To repeat a successful booking test from scratch, use a fresh browser profile or a new fictional address.

## Verify

```sh
node --test registration.test.mjs
```

The unit tests check duplicate detection, storage failures, and the calendar’s UTC start and end. The browser acceptance flow covers invalid input, successful submission, and repeat submission after a reload. It checks that both receipts display the same reference even when the capitalization of the email changes.

To run the same acceptance flow with an authenticated Kane CLI:

```sh
kane-cli run "$(cat verification-objective.md)" \
  --url http://127.0.0.1:5186/ --headless --max-steps 30 --timeout 180
```
