# PWA Browser QA Checklist (tablet game focus)

Use this checklist after deploying the latest build to GitHub Pages:
`https://jedbcov-coder.github.io/pink-elephant-jungle-dash/`

---

## A) Install prompt behavior

- [ ] Open in **Chrome (Android)** and **Safari (iPad/iPhone)**.
- [ ] Confirm the in-game install card only appears when install is actually supported.
- [ ] Dismiss install once and confirm it does not immediately re-nag during the same session.
- [ ] If browser supports native prompt, confirm the install action opens the browser install flow.
- [ ] Confirm canceling install does **not** break gameplay or layout.

## B) Standalone launch behavior

- [ ] Install the app from browser.
- [ ] Launch from home screen/app launcher.
- [ ] Confirm it opens as an app experience (no normal tab chrome).
- [ ] Confirm title screen, settings, and first gameplay run render correctly.

## C) Fullscreen behavior

- [ ] Start a run and interact once (tap/click) to allow user-gesture-gated APIs.
- [ ] Confirm app attempts immersive/fullscreen where browser allows it.
- [ ] If fullscreen is denied by browser policy, confirm game remains playable (no blocked input, no clipped HUD).

## D) Orientation handling

- [ ] Start run in landscape.
- [ ] Rotate to portrait during active run.
- [ ] Confirm rotate overlay appears and run state is preserved.
- [ ] Rotate back to landscape and confirm run resumes without reset.

## E) Address bar collapse/expand handling

- [ ] In browser mode (not installed), scroll/tap so mobile address bar collapses and expands.
- [ ] Confirm viewport height updates cleanly (no permanent black bar, no HUD drift off-screen).
- [ ] Confirm touch controls stay reachable after each collapse/expand transition.

## F) Wake/resume handling

- [ ] During an active run, lock device (sleep) for 10+ seconds.
- [ ] Wake and return to app.
- [ ] Confirm no duplicate timers/audio glitches, no stuck controls, and no sudden unfair collision on immediate resume.
- [ ] Background app, then foreground again; verify same results.

---

## Manifest validation (tablet game UX keys)

Current manifest values to validate:

- `display`: `standalone` ✅
- `orientation`: `landscape` ✅
- `start_url`: `./` ✅
- icon entries: `192x192` + `512x512` ✅

Validation checks:

- [ ] In DevTools → Application → Manifest, confirm `display` is `standalone`.
- [ ] Confirm `orientation` is `landscape`.
- [ ] Confirm `start_url` resolves to the game root under GitHub Pages subpath.
- [ ] Confirm both required icon sizes are present and load without errors.
- [ ] Confirm `scope` keeps navigation inside the app path.

---

## Browser mode vs installed mode regression check

- [ ] Open game in normal browser tab and capture baseline: HUD position, controls, text scale.
- [ ] Open installed PWA and compare same screens.
- [ ] Confirm installed experience has no layout regression (no clipping, overlap, or shifted controls).

---

## Viewport + HUD verification matrix

Run in both browsers below (where available on your test devices):

- Chrome mobile/tablet
- Safari mobile/tablet

For each browser:

- [ ] Landscape baseline: HUD and controls aligned in safe zones.
- [ ] Flip orientation portrait→landscape and landscape→portrait→landscape: HUD returns to correct anchors.
- [ ] Wake-from-sleep: HUD remains correctly positioned.
- [ ] Address bar collapse/expand (browser mode): HUD stays in place.

---

## Browser-specific quirks and safe fallback logic (no one-off hacks)

### Known quirks to expect

1. Fullscreen/orientation lock may be ignored unless triggered by a user gesture.
2. iOS Safari may not fully honor immersive fullscreen APIs.
3. Mobile browser UI bars can change viewport height while playing.
4. Wake/resume can trigger delayed resize/visibility events.

### Safe fallback logic to keep

- Keep fullscreen + orientation lock as **best effort only**.
- Always preserve a playable non-fullscreen path.
- Use dynamic viewport measurements (`visualViewport` + resize listeners) to recalculate layout.
- Re-run immersive request on focus/pageshow/orientationchange when active gameplay resumes.
- Preserve run state during orientation or visibility transitions; avoid forced run reset.
- Add short post-resume safety buffer to prevent immediate unfair collisions.

---

## Quick issue log template

When something fails, log:

- Device + OS
- Browser + version
- Installed or browser mode
- Orientation at failure
- Exact step from checklist
- What happened
- Screenshot/video
