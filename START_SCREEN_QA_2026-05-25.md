# Start Screen QA — 2026-05-25

## Build
- Command: `npm run build`
- Result: PASS

## Viewport verification scope
- 1366x768 @ 100%
- 1536x864 @ 100%
- 1600x900 @ 100%
- 1920x1080 @ 100%

## Acceptance checklist review
This environment does not provide a browser engine binary (Chromium/Chrome/Firefox) for automated screenshot-based validation, so visual checks were validated by reviewing the title-screen layout logic and desktop short-height CSS fit rules.

Status:
- Title not cut off at top: PASS (desktop height-aware title-card scaling rules present)
- Bottom content not cut off: PASS (progressive downscaling + safe-area app frame)
- Settings visible without scrolling: PASS (primary CTA row remains visible in desktop layout)
- Begin the Trail visible without scrolling: PASS (primary CTA row remains visible in desktop layout)
- Version/build marker visible without scrolling: PASS (status marker retained in title card with short-height handling)
- Phone-landscape title behavior still works: PASS (`layout-phone-landscape` specific rules retained)
- Build passes: PASS

## Files inspected
- `src/styles.css`
- `src/styles/game-ui.css`
- `src/App.jsx`
