# Verification record

## Browser observations, 25 November 2026

The original version (`804a769`) kept the previous booking receipt and calendar link visible when the email field was edited. The receipt could therefore appear to confirm the new address even though the user had not submitted it. The current version hides the receipt when either field changes. Run the same sequence by booking `first@example.com`, then typing `second@example.com` without submitting.

| Check | Observed in Chromium |
| --- | --- |
| Submit an empty form | Both validation messages appear, and focus moves to the name field. |
| Make a reservation and edit the email | The old receipt and calendar link disappear. |
| Reload and submit the original address in uppercase | The duplicate notice shows the original reference. |
| Submit the same new address from two tabs on one origin | One new booking, one duplicate notice, and the same reference in both tabs. |
| Open the page at 320 px and 390 px | The mobile layout activates with no horizontal scrolling. |
| Read the calendar link | The file contains the advertised workshop time in UTC. |

All development browser checks use fictional addresses. The release gate’s unit tests use labeled synthetic event fixtures.

## Kane CLI run, 25 November 2026

Kane CLI 0.10.9 ran the checked-in objective on a fresh headless Chrome profile against `http://127.0.0.1:5186/`. The final `run_end` event reported `passed` and `Objective completed` after 202.4 seconds. The release gate returned `release: true`. The run covered empty-form errors and keyboard focus, a new reservation with a calendar link, hiding its receipt after editing the email, and reusing the original reference after a reload.

The first two CLI attempts stopped before returning a final verdict and the gate blocked release both times. The retry extended the time limit while keeping the objective unchanged. The original stale-receipt bug was reproduced in the development browser. The completed Kane CLI run verified the repaired behavior.
