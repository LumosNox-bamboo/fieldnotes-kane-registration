Test only the Fieldnotes Workshop page at the provided local URL. Use a fresh browser context with no previous demo reservation, and stay on this origin. All data is fictional. Verify each checkpoint on the visible page:

1. Submit an empty form. Both inline validation messages appear and the Full name field receives focus. No booking receipt is visible.
2. Enter `Sample Attendee` and `kane-flow@example.com`. Submit. The heading reads `Place reserved`, the reference begins with `FN-`, and an `Add to calendar` link appears. Remember the full reference currently shown.
3. Edit the email field to `another@example.com` without clicking submit. The previous receipt and calendar link are no longer visible.
4. Reload this same page. Enter the same name and use `KANE-FLOW@example.com`. Submit. The heading reads `Already registered` and the full reference matches step 2.
