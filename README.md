# Pink Elephant Jungle Dash

## Play the game
<img width="1774" height="887" alt="pe-jungledash" src="https://github.com/user-attachments/assets/55be6aa3-74ab-412a-be98-e74b854bae1b" />

Live playable version: https://jedbcov-coder.github.io/pink-elephant-jungle-dash/

Pink Elephant Jungle Dash is a beginner-friendly 3D browser game where you run as a pink elephant, collect fruit, dodge jungle hazards, and try to survive as long as possible.


### Latest two-thumb touch controls update

- Reworked touch gameplay controls into a clear two-thumb layout for phone-landscape, tablet touch-landscape, and touch-enabled 2-in-1 fullscreen mode.
- Left cluster now places the original circular elephant portrait **CHARGE** badge at the top with **LEFT/RIGHT** steering buttons below.
- Right cluster now places **JUMP** on top and **SMASH / HOLD SLIDE** below, both wired to existing gameplay inputs (no mechanic changes).
- Added stronger stuck-input safety: touch inputs now auto-release on pointer cancel/leave/up, pause, settings open, game end, and window/app focus loss.


### Latest Settings button readability pass

- Root cause fixed: the in-game pause/settings shortcut was combining `hud-gold-frame-button` (gold/bright style) with `hud-settings-button`, causing style conflicts and occasional white/pale-yellow rendering in some layouts.
- Added one shared Settings button theme for both `.hud-settings-button` and legacy `.title-settings-button`, including readable hover/focus/active/disabled states.
- Added `.hud-settings-icon-button` so icon-only Settings/Pause stays dark, bordered, high-contrast, and touch-friendly on desktop/tablet/phone-landscape.

### Latest timer stability fix

- Fixed the negative gameplay timer bug (for example `TIME -1166:41`) by hardening elapsed-time math during pause/resume, fullscreen focus changes, and lifecycle restore events.
- Timer display now always clamps to a safe non-negative `mm:ss` value, and restart now clears lifecycle timing snapshots so a new run always starts cleanly at `00:00`.

### Latest 2-in-1 fullscreen HUD + Settings fix

- Unified all **Settings** buttons under one shared high-contrast jungle style (title screen, pause overlay, in-game pause shortcut, and settings panel close) to remove the white/pale-yellow unreadable variant.
- Fixed negative timer output by clamping elapsed time at zero and preventing lifecycle resume from double-applying paused duration during focus/fullscreen transitions.
- Added a touch-capable **tablet/2-in-1 medium HUD mode**: less dense side panels, separated score/crate visuals, smaller trail-depth/timer footprint, smaller charge badge, and cleaner center play lane.
- Hid floating audio controls during active gameplay; audio toggles remain available in Pause + Settings.

### Latest desktop-layout repair

- Start screen desktop/laptop scaling pass: title card now uses short-height responsive sizing, wider landscape fit, tighter spacing, and keeps **Settings** + **Begin the Trail** visible at normal browser zoom; on short-height desktop/laptop viewports, full controls/help cards are hidden and replaced by the concise tip/self-test line.
- Restored desktop/laptop UI after mobile HUD regression: tightened phone-landscape CSS scoping, added explicit desktop/tablet guard rules, removed title-card internal scrolling on larger layouts, and reinforced the title Settings button contrast states so desktop visuals remain polished while mobile foundation classes stay available for future work.

### Latest HUD update

- Phone-landscape now uses a **separate minimal gameplay HUD** (not the desktop HUD): top-left fruit/lives, top-center state pill, top-right timer + pause, tiny bottom-center prompt, and corner thumb controls so the center track stays clear on Samsung S23 landscape fullscreen.



### Latest phone-landscape polish

- Removed the last phone-landscape left-edge gutter source by hard-forcing full-viewport width (`100vw`) and zero side padding/margins on the phone-landscape shell/frame/canvas path, plus matching backdrop color and horizontal overflow lock.
- Tightened top-left Fruit/Lives badges and converted timer + settings into a compact single top-right row.
- Reduced settings button size for phone-landscape and moved/shrunk prompt lower so it stays out of the elephant path and clear of thumb controls.
- Forced phone-landscape touch controls to render visible at gameplay start (no extra touch needed), and raised their z-index over HUD layers.
- Hid the dashed safe-frame in phone-landscape by default (treated as non-gameplay debug/decorative chrome).

## New: Device profile blueprint

Need separate settings for phone/tablet/desktop/2-in-1? Copy the ready-to-paste guide in `docs/DEVICE_PROFILE_BLUEPRINT.md`.


For browser/install quality testing (install prompt, standalone launch, fullscreen behavior, orientation, address-bar resize, and wake/resume), use `PWA_TESTING.md`.



## Device compatibility update

The app now uses a stricter universal-device baseline:

- mobile-first responsive layout that scales up to tablet and desktop
- safe-area-aware shell/frame for notch and home-bar devices
- minimum 48px touch target baseline for on-screen controls
- responsive typography with `clamp()` sizing
- orientation + resize handling that keeps active run state
- install + offline behavior validated through manifest and service worker

Use `DEVICE_TESTING.md` for manual validation across phone, tablet, and desktop before release.
For tablet sign-off before each update, complete every required item in the tablet release gate inside `DEVICE_TESTING.md`.

## Install as an app (PWA)

This game can now be installed from Chrome/Edge using the browser install button when opened from GitHub Pages.

Offline mode is configured so previously loaded game files can be used without a network connection, and the app shows an **Update available** prompt when a newer deployment is ready.

- Manifest file: `manifest.webmanifest`
- Service worker: `service-worker.js`
- Install icons: all manifest icon entries now reuse the existing `favicon.png` file (no extra image files needed)

If you publish updates and a browser shows an older cached version, follow `OFFLINE_TESTING.md` for the exact reset and verification steps.

## Recent update

- Startup flow now logs a single boot message in the browser console: `Pink Elephant version: [version] | [build label] | [update note]`, sourced from `src/appInfo.js` for one clear release marker per app load.
- Updated the title-screen deployment marker source (`src/appInfo.js`) to keep one authoritative Version/Build/Update export set, plus a maintainer note to bump it for every visible deployment (especially GitHub Pages publishes).
- Title-screen status marker update: replaced the player-visible self-test summary text with three compact build lines (**Version**, **Build**, **Update**) so the title area keeps a subtle release/status indicator without looking like gameplay HUD.
- Level-complete overlay mobile-fit pass: added compact phone-landscape result card sizing (smaller trophy/title/text/stats spacing), removed complete-card scrolling on short landscape phones, and kept the next-level primary button visible without scrolling.
- Progression flow polish: after finishing a level with a next level available, the completion screen now shows only the next-level primary action (for example **Start Sunset Temple Run**, then **Start Night Run**) and hides level-restart actions there; restart flows in pause/game-over remain available.
- Removed CSS `@import` chaining for game UI styles: `src/main.jsx` now imports `src/styles.css` and `src/styles/game-ui.css` directly to avoid `postcss-import` parsing failures during build.
- Samsung S23 phone-landscape HUD hardening: removed the desktop right-side HUD slab from phone-landscape gameplay, forced full viewport fill with no side blue strip, tightened a true mini top-row (fruit/lives, level, timer + smaller pause), kept prompt as a bottom-center pill, and forced touch controls to render immediately above HUD overlays.
- Touch-zone alignment fix for phone-landscape gameplay: movement controls now live in the bottom-left zone, while Jump/Slide + Charge + Smash live in the bottom-right zone for clearer two-thumb play.
- Phone-landscape touch-controls startup fix: when gameplay begins after **Begin the Trail**, controls now appear immediately in `auto`/`on` mode (no second touch required), while desktop keyboard-first behavior stays unchanged.
- Phone-landscape gameplay HUD split: desktop-heavy HUD panels are now fully hidden on `layout-phone-landscape`, replaced by a minimal gameplay-first HUD (top-left fruit/lives, top-center state pill, top-right timer + pause, bottom-center tiny prompt, and highest-priority corner touch controls) to keep the center lane clear on Samsung S23 landscape.
- Settings button readability fix: replaced conflicting title-button color path with a hard-scoped title selector (including phone-landscape override) so the button now keeps a dark translucent background, clear border, and high-contrast cream/white text on both desktop and Samsung S23 landscape.
- Phone-landscape title-fit pass (Samsung S23 fullscreen): removed title-card scrolling risk, tightened title spacing/typography, hid extra helper panels/self-test note in phone-landscape, and kept only the core title content + Settings + Begin button visible without scrolling.
- Viewport root-sizing hard reset for phone-landscape fullscreen (Samsung S23 target): normalized `html/body/#root` and app shell/frame sizing to `100%` width with `100dvh` height, removed root safe-area side padding from the viewport container path, and prevented horizontal background peeking so gameplay now fills edge-to-edge without blue side strips.
- Added a stable layout-mode system (`desktop`, `tablet-landscape`, `phone-landscape`, `phone-portrait`) on the root app shell, fixed Samsung S23 phone-landscape title fitting so Settings + Begin the Trail stay visible without scrolling, corrected Settings button contrast states, and added HUD mobile hook classes for the next phone-landscape HUD pass without changing gameplay logic.
- Ran a focused contrast/readability pass for gameplay clarity: increased HUD label/pill contrast (removing low-contrast gray-on-gray combinations), boosted critical warning telegraph visibility and border strength, brightened obstacle warning accents, and darkened/desaturated mid/far background foliage/stone layers so player + hazards + pickups separate more clearly from scenery (including reduced-brightness / glare readability checks).

- Added gameplay performance profiling and adaptive visual scaling for obstacle-heavy moments: the game now samples sustained frame rate, tracks nearby obstacle density, and automatically lowers non-essential effects first (particle burst counts, bloom strength, mist/telegraph intensity, snake accent animation frequency, and shadow quality) when performance drops, while keeping core obstacle readability and gameplay responsiveness stable during longer runs.

- Added lifecycle-safe auto-pause/resume for app/tab focus changes (tab switch, app switch, lock/unlock, notification interruptions): active runs now pause automatically, keep current run progress in memory, restore without duplicate timers, and apply a short post-resume safety window to avoid unfair instant hits.

- HUD safe-zone refactor: top HUD is now floating/translucent instead of full-width bars, critical gameplay HUD is kept inside an inner safe-zone rectangle, score moved to top-left, pause/settings stays top-right, movement stays bottom-left, and action controls stay bottom-right for better tablet and wide-screen consistency.

- Tablet comfort/accessibility pass: enlarged touch targets for gameplay and HUD utility controls (48px minimum, 56px+ on primary controls), increased HUD text scale into an 18–28px-friendly range with heavier readable weights, added larger control spacing/invisible hitbox padding, and kept primary gameplay center clear by pinning utility controls to safe edge zones.

- Mobile/PWA viewport hardening pass: gameplay wrappers now use modern dynamic viewport units (`100svh` fallback + `100dvh`), safe-area padding is enforced on the game frame + HUD edges, and portrait on phones/tablets now shows rotate guidance instead of cramped play.

- Fixed mobile landscape viewport sizing for edge-to-edge play (including Galaxy S23): root/layout containers now lock to `100vw` + `100dvh`, body margin/overflow are constrained, the gameplay canvas fills the visible viewport, and horizontal scrolling is blocked during gameplay.
- Added a dedicated mobile-landscape control pattern for screens up to 900px wide: desktop keyboard-help overlays are now hidden in that view, and on-screen touch controls are pinned to the left/right edges with safer button sizing and spacing for thumbs.

- Audited and tightened the PWA manifest for install quality: kept manifest links in installable HTML, switched app display mode to `standalone` for a cleaner installed experience, and added explicit 192x192 + 512x512 icon entries required by installability checks.

- Added responsive typography scaling for headings, HUD counters, labels, and buttons using `clamp()`.
- Raised text baseline readability on small phones and set form input fonts to at least 16px to prevent mobile auto-zoom.
- Shortened gameplay-facing helper copy to keep overlays easier to scan during play.

- Added a universal responsive game frame: phones use full safe screen area, while tablets/desktops keep a centered 16:9 gameplay frame with optional side-panel space and preserved HUD readability.
- Added explicit orientation behavior rules: portrait/landscape detection is now always tracked, normal menus remain usable in both orientations, and active gameplay on touch devices shows a clear rotate-device overlay in portrait while preserving your current run state through rotation changes.
- Standardized interactive touch targets to a 48px minimum across buttons and form controls, added visible keyboard focus rings, and increased mobile control spacing so nearby controls keep at least an 8px gap.
- Added explicit safe-area protection coverage across the main app shell and bottom HUD anchors so top and bottom UI stay clear of notches and iOS home indicators, including standalone PWA display mode handling.
- Audited the layout for mobile-first responsiveness and added exact breakpoint tiers for small phones (320–480px), large phones (481–767px), tablets (768–1023px), and desktop (1024px+), backed by shared CSS variables for spacing, fonts, radii, and max layout width.
- Strengthened viewport safety rules with flexible units (`rem`, `%`, `vw`, `svh`, `dvh`, `min()`, `max()`, `clamp()`) so major containers avoid fixed widths, stay centered on large displays, and prevent horizontal scrolling.
- Added a dedicated **Level 3: Night Run** base theme with a purple night sky plus a white moon backdrop so the third level now has its own clear nighttime look.
- Reduced expected browser permission noise: fullscreen and audio resume calls now run only from user gestures, and rejected permission attempts are logged as short development-only debug messages so gameplay continues without noisy console warnings.
- Fixed branch-collision self-test failures by requiring actual AABB overlap before branch damage/blocking is applied, which aligns branch hit handling with visual overlap and keeps valid slide clearances passing.
- Improved self-test failure logging in the browser console so each failed test now prints as its own readable warning line with a test name and reason, plus a compact failure table for quick debugging.
- Added the modern `<meta name="mobile-web-app-capable" content="yes">` tag above the existing Apple tag in `index.html`, while keeping iOS compatibility and fixing the Chrome deprecation warning.
- Added the modern `<meta name="mobile-web-app-capable" content="yes">` tag in both source and deployed HTML so PWA capability checks no longer rely only on the deprecated iOS-only tag.
- Fixed a startup crash in `src/App.jsx` by removing a call to an undefined development texture preview helper (`createTexturePreviewPanel`), so the live scene now starts normally.
- Simplified install stability by removing unused ESLint package dependencies from `package.json` (the project checks already run TypeScript + CSS checks), eliminating the recurring ESLint peer-conflict path during `npm install`.
- Added a project `.npmrc` with `legacy-peer-deps=true` as a safety fallback so `npm install` can proceed even if npm encounters transient peer-resolution conflicts in some environments.
- Removed unused React ESLint plugins from devDependencies to eliminate the recurring npm peer-dependency (`ERESOLVE`) conflict path while keeping lint/check behavior unchanged for this project.
- Strengthened npm dependency resolution by adding explicit npm `overrides` for ESLint 9.x (`eslint` and `@eslint/js`) to prevent future lock/install drift back to ESLint 10 peer conflicts.
- Fixed npm install `ERESOLVE` conflict by pinning ESLint 9-compatible metadata in project manifests so `eslint-plugin-react@7.37.5` resolves cleanly instead of trying ESLint 10.
- Fixed recurring `vite: not found` build failures in environments that install only production dependencies by moving `vite` from devDependencies to dependencies so `npm run build` and `npm run build:pages` can run reliably.
- Added a lightweight CSS brace sanity check (`npm run check:css`) so accidental unclosed/extra braces in `src/styles/game-ui.css` are caught before build.
- Fixed a CSS build blocker by removing an accidentally duplicated `@media` wrapper in `src/styles/game-ui.css` that caused a PostCSS `Unclosed block` error during `npm run build`.
- Updated lint tooling compatibility by pinning ESLint 9.x so `eslint-plugin-react@7.37.5` installs cleanly without peer-dependency conflicts.
- Fixed PWA install prompt state wiring in `src/App.jsx` so the Settings install card uses `usePwaInstallPrompt` state instead of an undeclared global, preventing mobile startup crashes (`deferredInstallPrompt is not defined`) while preserving existing install behavior.
- Standardized viewport/container sizing across `index.html`, `src/styles.css`, `src/styles/game-ui.css`, and the `src/App.jsx` gameplay mount so `html`, `body`, and `#root` consistently fill the viewport using `100%` + `100dvh`, the mount inherits full size, and horizontal overflow risk is reduced without gameplay logic changes.
- Updated touch-control visibility detection in `src/App.jsx` so phones/tablets keep on-screen touch controls, while wide desktop keyboard-first layouts now suppress touch controls by default even on touch-capable hardware.
- Added a dedicated tablet-landscape touch-control tier between phone and desktop in `src/styles/game-ui.css`, keeping the same left-thumb run button + right action cluster pattern while slightly increasing button size/spacing and nudging edge offsets for safer HUD corner clearance.
- Scoped legacy `.touch-controls` grid layout to desktop-style pointer conditions only, while keeping the new mobile thumb overlay (`.mobile-controls`) as the source of truth for phones so desktop/tablet no longer inherit unintended mobile placement and phones no longer inherit old grid assumptions.
- Aligned root/mobile viewport layout rules across `index.html`, `src/styles.css`, and `src/styles/game-ui.css` so `html`, `body`, `#root`, and gameplay container consistently use full viewport sizing (`100vw` + `100dvh`), remove left gutter risk, and prevent horizontal scrolling during gameplay (including Galaxy S23 landscape checks).
- Updated mobile control CSS with a fixed full-screen `.mobile-controls` overlay, left-side run button sizing, and right-side 2-column action cluster spacing tuned for safe-area insets and landscape phone layouts while keeping the center gameplay lane mostly clear.
- Mobile phones now hide desktop-oriented keyboard help cards on the title overlay (including the primary key mapping grid and large advanced tip panel) while desktop players still see full keyboard guidance.
- Reorganized mobile touch controls into a clearer two-side layout: dedicated left-side Charge button and right-side movement/action cluster (Left, Right, Slide, Smash) while keeping the same input behavior and keyboard mappings.
- Added a unified in-game Settings screen (Title + Pause access) that groups Audio, Controls, Display quality preset (stored only), PWA install/app mode, Save Data tools, and About/version in one place while keeping gameplay logic unchanged.
- Moved service-worker update prompt and registration logic out of `src/main.jsx` into `src/pwa/setupServiceWorkerUpdatePrompt.js` to keep the main boot file cleaner without changing behavior.
- Cleaned up duplicate PWA install card wiring: `App.jsx` now imports `PwaInstallCard` only once from `src/components/game-ui/PwaInstallCard.jsx`, and removed the old duplicate component file.
- Separated PWA concerns by moving service-worker update prompt setup into `src/pwa/setupServiceWorkerUpdatePrompt.js` while keeping install-prompt hook logic in `src/hooks/usePwaInstallPrompt.js`.
- Moved service-worker update prompt and registration logic out of `src/main.jsx` into `src/hooks/usePwaInstallPrompt.js` to keep the main boot file cleaner without changing behavior.
- Split `App.jsx` UI responsibilities into focused game UI components (`TouchControls`, `PwaInstallCard`, `SaveDebugTools`, `RotateOverlay`) to keep the main app file easier to maintain without changing gameplay behavior.
- Improved service-worker update reliability by registering with `updateViaCache: "none"`, which helps browsers fetch fresh worker code during new deployments.
- Added save utility controls for debugging: reset all save data, export save JSON (settings/profile/IndexedDB records), and import save JSON with schema validation + migration before safe replacement.
- App startup now initializes the save system before gameplay loops begin, safely loads settings/profile snapshot, applies saved audio preferences through the save manager path, and falls back to defaults if loading fails.
- Added explicit mobile UI breakpoints (small phone / large phone / tablet) and switched touch control + HUD sizing to responsive scale variables with capped font/icon sizes so gameplay UI stays readable without becoming tiny or oversized.
- Enforced larger minimum touch target sizes for on-screen controls (44px+ baseline, larger on phones/tablets) and adjusted landscape safe-area placement so control clusters and side badges sit farther from thumb conflict zones and notches.
- Added a manual multi-device mobile playtest checklist for readability and touch comfort validation across small phones, large phones, and tablets.
- Added notch/cutout-safe HUD inset rules for top counters, pause controls, side panels, and touch controls so landscape-left and landscape-right keep critical UI inside tappable safe zones on Android phones.
- Scoped touch gesture blocking to gameplay area only, added stronger double-tap/pinch/scroll prevention on the game canvas container, and improved multi-touch button tracking so movement + action combos work reliably.
- Improved mobile immersive gameplay handling: the game now requests fullscreen on first touch/start, re-applies immersive mode after resume/app-switch/orientation changes, hides non-essential debug chrome while actively playing, and uses a safe viewport-height fallback so HUD elements stay visible on browsers that refuse full immersive mode.
- Added a portrait fallback overlay ("Rotate your device") for phones/tablets that ignore orientation lock, while desktop windowed play remains unchanged.
- Clarified immersive-mode behavior: fullscreen and landscape lock requests are now treated as best-effort only (many browsers block them silently), and gameplay keeps using the existing rotate overlay + safe layout fallback when immersive APIs are unavailable.
- Improved offline reliability: service worker now uses navigation fallback + broader asset caching and shows an in-app update banner so players can refresh to new deployments without being stuck on stale cache.
- Added a professional in-game **Install Game** card on the start screen that only appears when `beforeinstallprompt` is available, hides after install or dismissal, and stores a `pwaInstallDismissed` local setting so players are not nagged.
- Refactored custom PWA install prompt code into a reusable hook (`usePwaInstallPrompt`) plus a dedicated UI component (`PwaInstallCard`) without changing install behavior.
- Tuned peach collectible colors/glow so they read as soft pastel orange with a red blush instead of bright white glowing orbs.
- Replaced the in-game bottom-right Charge mascot with the app favicon image so gameplay HUD branding now matches the browser/app icon.
- Split recurring level-element data into dedicated preset files (`obstacle-presets.js`, `enemy-presets.js`, `collectible-presets.js`) so crocodile rivers, low vine gates, fallen logs, monkeys, and fruit pickup layouts can be edited locally without touching large mixed level files.
- Upgraded offline mode so the service worker automatically caches Vite build assets from `.vite/manifest.json`, keeps GitHub Pages subfolder paths working, and prompts players to reload when a new version is ready.
- Added an in-app **Update available** banner with **Refresh** or **Later**, so players can safely move to new deployments without being stuck on old cached files.
- Added a short `OFFLINE_TESTING.md` checklist for verifying install, offline play, and update behavior.

- Simplified PWA icon setup to reuse the existing `public/favicon.png` directly in the manifest and service worker cache, so no generated PNG files are required in Codex workflows.
- Added a shared level theme constant for the “sunset-temple-run” palette and wired Levels 2 and 3 to reuse it, keeping gameplay behavior unchanged.
- Reworked the in-game side HUD into one responsive row that wraps safely and stacks on smaller screens, so Energy and Trail Depth cards stay readable and never overlap Time/Score center HUD elements.
- Fixed Snake Gate accent data so each snake registers only one complete accent object (including tongue/eye/head/segments), and added defensive animation checks to prevent optional mesh errors near branch obstacles.
- Upgraded the Snake Gate look to better match the target style with denser hanging vines, branch offshoots, snake belly/tongue details, plus animated head bob/eye glow/tongue flick and a one-time proximity warning sting in the slide telegraph window.
- Added animated danger accents to the slide branch gate (snake head bob + eye glow pulses + extra warning bark bands) and a one-time proximity warning sting when entering the slide telegraph window.
- Updated GitHub Actions checkout step in CodeQL workflow from `actions/checkout@v4` to `actions/checkout@v5` to stay ahead of the Node.js 20 deprecation warning.
- Fixed HUD spacing so the Energy and Charge panel no longer overlaps the top-left counters.
- Redesigned the low jump log obstacle to look like a fallen jungle tree with thicker vines, richer moss clumps, and broken branch stubs across the path.
- Redesigned collectible fruit visuals so peaches, sugar cane, and pineapples look more like real edible fruit while keeping a bright golden glow that attracts pickup routes.
- Redesigned the belly-slide obstacle into a giant twin-tree gate with interwoven overhead branches, denser hanging vines, and snake details, and tightened collision depth so players must belly-slide instead of double-jumping over it.
- Refreshed monkey enemy hands/arms to remove banana-like shapes that looked like fangs, so monkeys read friendlier during gameplay.
- Fixed the browser tab icon (favicon) path so it loads correctly in both local development and on GitHub Pages.
- Added a safety ground reset after low-obstacle bump collisions so the elephant always drops back to normal ground height instead of floating at obstacle height.
- Tightened branch must-slide geometry (lower clearance, wider lane coverage, deeper depth window) and aligned collision/self-tests so standing always collides, sliding clears, and double-jump timing cannot phase through.
- Tightened the branch slide gate again with a slightly lower clearance floor and lowered snake/vine warning visuals so what you see lines up better with the stricter collider at full speed.

- Rebuilt slide branch obstacles into a clear 3-part silhouette (chunky side supports, dense overhead branch mass, and low hanging warning elements) and aligned the visual bottom edge to the gameplay collision bottom for reliable must-slide readability.

- Reworked the Snake Gate branch obstacle to better match the concept art: thicker twisted side trunks, denser overhead branch canopy with snake silhouettes, and a fuller hanging vine curtain that clearly marks the slide zone while staying aligned with collision height.

- Rebuilt river crocodiles into a clearer low-poly silhouette (longer snout, raised eye bumps, dorsal scutes, tapered bent tail, and leg stubs) and added subtle head-bob motion so they read better from the gameplay chase camera.

- Recalibrated the Snake Gate belly-slide clearance slightly upward so proper belly-slides pass reliably again while standing still collides.


- Added a new `src/game/save/saveManager.js` persistence entry point with safe localStorage JSON handling plus IndexedDB stores for scores, achievements, and progression events.

- Added a centralized save schema (`saveSchema.js`) with versioned defaults and safe migration so old or partial local save data is auto-completed without deleting unknown fields.

- Improved PWA update flow for installed players: update banner now supports session-level **Later** dismissal, **Refresh** sends `SKIP_WAITING`, and reload happens only after the new worker takes control to avoid reload loops.
- Updated service-worker lifecycle for safer releases: removed automatic `skipWaiting()` during install, kept versioned cache cleanup on activate, and switched static asset fetches to stale-while-revalidate behavior.


- Added `DEVICE_TESTING_MATRIX.md` with a simple pass/fail device checklist covering phone/tablet/desktop in portrait and landscape.

## Mobile touch regression checklist


## Save Data QA

Quick beginner-friendly checks for save persistence:

1. Start the game, change one setting, refresh the page, and confirm the setting stayed changed.
2. Finish a run, refresh the page, and confirm your best score is still there.
3. Unlock a skin, refresh the page, and confirm the skin is still unlocked and still selected.
4. Trigger an achievement, refresh the page, and confirm the achievement still appears.
5. Use the reset/clear save utility, then confirm the game returns to default settings and default progress.
6. Repeat one quick save test in a browser private/incognito window and note that storage can be limited by browser rules.

Use this quick checklist after gameplay input changes:

- Tap controls: each touch button responds instantly.
- Hold controls: charge/slide stay active while your finger stays down.
- Swipe across controls: no stuck input after finger leaves a button.
- Multi-touch combo: hold movement + tap Jump/Smash at the same time.
- Virtual joystick/buttons area: no page scroll, pull-to-refresh, pinch zoom, or double-tap zoom while playing.
- Pause/resume: pausing clears held inputs; resuming does not keep phantom movement.
- Menus/settings: when not actively playing, UI panels can still scroll if content grows.

Device validation target:

- Android Chrome (latest stable)
- iOS Safari (latest stable)

UI readability and comfort playtest sizes:

- Small phone (example width: ~360px)
- Large phone (example width: ~414px)
- Tablet (example width: ~768px)


## Mobile Experience

This section is the release checklist for mobile quality. Use it before publishing updates.

### Short checklist

- [ ] Orientation: game is playable in landscape, and portrait shows the rotate-device helper when needed.
- [ ] Fullscreen persistence: immersive/fullscreen mode returns after app switching, notifications, or resume.
- [ ] Touch reliability: taps, holds, and multi-touch combos are stable with no stuck inputs.
- [ ] Notch safety: HUD and controls stay inside safe areas on cutout/notch devices.
- [ ] UI readability: score, energy, and control labels are readable on small phone, large phone, and tablet sizes.

### Key flow test sequence

Run this exact flow on each test device:

1. Cold launch the game from a closed state.
2. Start a run and restart the level.
3. Put the app/browser in background, then return to foreground.
4. Rotate the device (landscape-left and landscape-right).
5. Receive a notification while the game is open (or simulate interruption), then return to the game.
6. Confirm controls still respond correctly and HUD is still visible/readable.

### Glitch log format (required)

Log every visual or input glitch in this format:

- Device model:
- OS version:
- Browser or app-wrapper version (for example: Chrome 125, Safari 18, WebView build):
- Flow step where issue happened:
- What happened:
- How often (always / sometimes / once):
- Screenshot or short recording captured: yes/no

### Fix order (priority)

Fix items in this order:

1. Input mistakes (missed taps, stuck buttons, wrong action triggers).
2. Hidden or blocked controls/HUD (safe-area or overlap issues).
3. Fullscreen/orientation recovery issues.
4. Cosmetic polish (spacing, non-blocking visual tweaks).

### Re-test gate before release

Before release, re-test every fixed mobile issue on at least **two real devices** (not only desktop emulation), then confirm no regressions in the key flow sequence above.

### Known mobile limits

- Some browsers can ignore fullscreen or orientation lock requests because of platform policy; the game falls back to a safe in-game layout and rotate guidance when needed.
- Small UI differences can happen between standalone PWA mode and normal browser-tab mode.

## Repo safety settings (recommended)

- GitHub Pages: deploy from `main` branch and `/docs` folder
- Deploy workflow: removed (manual publish flow only)
- CodeQL JavaScript/TypeScript: **On**
- CodeQL Actions: **Off**
- `docs/.nojekyll`: present
- `npm run build:pages`: manual publish step

## Controls

- **Move left/right:** `←` / `→`
- **Run faster (charge):** hold `↑`
- **Jump:** tap `Space`
- **Slide:** hold `Space`
- **Trunk smash:** `Shift`
- **Phone/mobile (landscape):** controls appear immediately after you press **Begin the Trail** (when Touch mode is Auto or On). Left thumb: **Run + Left/Right steering**. Right thumb: **Jump/Slide, Charge, Smash**.
- **Phone/mobile (landscape):** controls appear immediately after you press **Begin the Trail** (when Touch mode is Auto or On). Left thumb: **Run/Charge**. Right thumb: **Left, Right, Slide, Smash**.
- **Tablet:** touch controls stay enabled with **tablet-optimized spacing and button sizing** for easier taps.
- **Desktop:** **keyboard-first controls are preserved** (same key mappings as before).
- **2-in-1 laptops:** default behavior is **Auto** (touch controls on tablet/phone-like layouts, keyboard-first on desktop-wide layouts). You can override this in **Settings → Controls** with **Touch: Auto / On / Off**.

## Mobile layout notes

- The mobile UI is optimized for **landscape play** so your thumbs have more room and the center view stays clear.
- In phone-landscape gameplay, the app uses a **minimal HUD** to keep the elephant path visible: top-left fruit/lives, top-center state, top-right timer/pause, and a small bottom prompt only when needed.
- Controls and HUD respect **safe-area insets** (notch/cutout areas), so important buttons and stats stay visible and tappable on modern phones.

## Main features

- Mobile-native tuning: landscape orientation lock attempt, immersive fullscreen request on first touch, notch/safe-area padding, and zoom-disabled viewport for stable game controls
- 3D jungle runner gameplay with a pink elephant character
- Softer monkey enemy look (removed banana-like hand shapes for a friendlier silhouette)
- Animated crocodiles that snap open and closed with visible white teeth when you get close
- HUD polish to keep energy/charge labels and bars readable on smaller screens
- Refined menu logo glow and in-game charge badge styling for cleaner readability
- Fruit collection, hazard dodging, and life-based runs
- Belly-slide tree gate obstacles with interwoven branches, hanging vines, and snakes
- Fruit collection with redesigned edible-looking peaches, sugar cane, and golden pineapples
- Hazard dodging and life-based runs
- Fruit collection, hazard dodging, and life-based runs with fallen-tree jump obstacles wrapped in vines and moss
- Multiple levels with increasing distance and speed
- Level 2 and Level 3 now share the same sunset color palette for a consistent look
- Keyboard and touch controls for desktop and mobile
- Pause/settings overlay and audio controls

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown in your terminal (usually `http://localhost:5173/`).

## Deploy to GitHub Pages (single method)

This project uses **one deployment method only**:

- **Source:** `main` branch
- **Folder:** `/docs`
- **GitHub Actions deploy workflows:** not used for deployment

Steps:

1. Build the Pages output:

```bash
npm run build:pages
```

2. Commit and push your changes, including the updated `docs/` folder.

Notes:

- `build:pages` creates a production build directly in `docs/`.
- Deployment does **not** use GitHub Actions workflows.
- `docs/.nojekyll` must stay in the repo as an empty file.


- Touch quick pause: tap/click center gameplay area to open pause menu with quick audio controls.
