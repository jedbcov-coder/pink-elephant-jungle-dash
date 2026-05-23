# Pink Elephant Jungle Dash

## Play the game
<img width="1774" height="887" alt="pe-jungledash" src="https://github.com/user-attachments/assets/55be6aa3-74ab-412a-be98-e74b854bae1b" />

Live playable version: https://jedbcov-coder.github.io/pink-elephant-jungle-dash/

Pink Elephant Jungle Dash is a beginner-friendly 3D browser game where you run as a pink elephant, collect fruit, dodge jungle hazards, and try to survive as long as possible.


## Install as an app (PWA)

This game can now be installed from Chrome/Edge using the browser install button when opened from GitHub Pages.

- Manifest file: `manifest.webmanifest`
- Service worker: `service-worker.js`
- Install icons: all manifest icon entries now reuse the existing `favicon.png` file (no extra image files needed)

If you publish updates and a browser shows an older cached version, follow `OFFLINE_TESTING.md` for the exact reset and verification steps.

## Recent update

- Added a portrait fallback overlay ("Rotate your device") for phones/tablets that ignore orientation lock, while desktop windowed play remains unchanged.
- Improved offline reliability: service worker now uses navigation fallback + broader asset caching and shows an in-app update banner so players can refresh to new deployments without being stuck on stale cache.
- Added a professional in-game **Install Game** card on the start screen that only appears when `beforeinstallprompt` is available, hides after install or dismissal, and stores a `pwaInstallDismissed` local setting so players are not nagged.
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
- **Touch devices:** use the on-screen control buttons

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
