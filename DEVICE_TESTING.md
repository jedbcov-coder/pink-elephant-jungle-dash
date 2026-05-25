# DEVICE_TESTING.md

This checklist is the **required tablet release gate** for **Pink Elephant Jungle Dash**.  
Run it before every update.

## 1) Target devices (must test on real hardware)

- [ ] **Samsung Galaxy tablet class device** (example: Galaxy Tab S9 / S8 / A9+)
- [ ] **One additional Android tablet profile** from a different brand or Android skin (example: Lenovo Tab, Pixel Tablet, Xiaomi Pad)

Record tested devices for this release:

- Device 1 model + Android version:
- Device 2 model + Android version:

## 2) Required test modes

Test each target device in all modes below:

- [ ] **Browser tab mode** (Chrome in normal tab)
- [ ] **Installed PWA mode** (launched from home screen/app drawer)
- [ ] **Installed display behavior** feels standalone/fullscreen (no browser-chrome dependence during normal play)
- [ ] **Landscape primary gameplay** works (default play orientation)
- [ ] **Portrait fallback message** is clear and appears when gameplay should not run in portrait

## 3) UX quality checks (tablet comfort + clarity)

- [ ] Text is readable at normal arm-distance tablet use (HUD, buttons, prompts)
- [ ] Thumb controls are easy and comfortable (no strain, no cramped spacing)
- [ ] No accidental edge taps from bezel/home gesture areas during active play
- [ ] Obstacles are visually clear and recognizable in under **1 second** while running

## 4) Stability checks (must pass on each target tablet)

- [ ] Start a run, lock device, unlock, and confirm the game resumes safely
- [ ] Rotate device during an active run and confirm state/input stability
- [ ] Switch to another app, return to game, and confirm session continuity
- [ ] Play a long session (15+ minutes) and confirm no major memory/performance degradation

## 5) Pass/Fail sign-off (release gate)

A release is blocked unless **all boxes are checked**.

- [ ] Device coverage complete (Samsung Galaxy tablet class + one additional Android tablet)
- [ ] All required test modes passed
- [ ] All UX quality checks passed
- [ ] All stability checks passed
- [ ] Any found issues are logged and resolved or explicitly deferred with owner/date
- [ ] Final reviewer sign-off completed

Sign-off details:

- Reviewer:
- Date:
- Release/Build version:
- Final decision: **PASS / FAIL**

## 6) Issue log (if anything fails)

For each issue found:

- Device model + Android version
- Mode (browser tab / installed PWA / orientation)
- Exact step to reproduce
- Expected result
- Actual result
- Screenshot/video link
- Status (open / fixed / deferred)
- Owner + target fix date
