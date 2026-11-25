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

All browser checks use fictional addresses. These are development browser observations. The Kane CLI verdict is a separate step, produced by `node kane-release-gate.mjs` when the CLI is authenticated. The release gate’s tests use labeled synthetic event fixtures.
