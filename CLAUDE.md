# CLAUDE.md

## Testing

- After developing any new feature, always test it with Playwright before reporting it as done.
  - Playwright and Chromium are pre-installed in cloud sessions: `require('playwright')` works and `chromium.launch()` needs no options. Do not run `playwright install`.
  - Cover the feature's happy path and its main edge/failure cases, and include an Arabic/RTL check where the UI is bilingual.
  - Report the results faithfully: what passed, what failed (with output), and anything that was not tested.
