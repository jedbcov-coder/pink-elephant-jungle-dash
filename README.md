# Pink Elephant Jungle Dash
<img width="1774" height="887" alt="image" src="https://github.com/user-attachments/assets/16fabdb3-4b1a-458e-aecf-ef68e0ca0bda" />

## Play the game

Live playable version: https://jedbcov-coder.github.io/pink-elephant-jungle-dash/

Pink Elephant Jungle Dash is a beginner-friendly 3D browser game. You play as a pink elephant running through a jungle path, collecting fruit, dodging hazards, and trying to survive as long as possible.

## Controls

- **Move left/right:** `A` / `D` or `←` / `→`
- **Charge and run faster:** hold `W` or `↑`
- **Jump:** tap `Space`
- **Slide:** hold `Space`
- **Smash/Spin (when available):** `Z` or `E`
- **Touch devices:** use the on-screen control buttons

## Main features

- First-pass logo polish: improved glow, contrast, and small-size readability for the pink elephant badge in both the title screen and in-game charge icon while keeping the same style
- HUD layout spacing fix: moved the left/right HUD cards lower so the Energy/Charge panel no longer overlaps the top Fruit/Lives rows on smaller viewports
- Collectible fruit visuals redesigned to look edible and recognizable: peaches now have stems/leaves and warm blush, sugar cane now looks like cane stalks with nodes/leaves, and golden pineapples now have true pineapple body + crown while keeping attraction glow
- Belly-slide obstacle redesign: low branch bars are replaced by two giant side trees with interwoven canopy overhead, plus hanging jungle vines and snakes; this now blocks jump/double-jump bypass and enforces belly-slide timing
- Crocodiles were redesigned with animated jaws that snap open and closed near the player, now showing bright white teeth for clearer danger cues
- Low jump obstacles were visually redesigned from plain brown bars into fallen jungle trees wrapped in thick vines and moss, while keeping the same gameplay hitbox
- Ground-height recovery safeguard: after a low-obstacle bump, any blocked movement while grounded now forces the elephant back to normal track height so it cannot stay floating above the ground
- Monkey enemy visuals were refreshed to remove the banana badge shapes that could read like fangs, so they look less scary while keeping gameplay the same
- Browser tab now shows a simple embedded PNG favicon for easier game tab recognition (no separate binary file needed)
- Gameplay progression now uses each level's `nextLevel`: finishing Level 1 offers Level 2, and finishing Level 2 now offers Level 3 (Night Run)
- Restart now always restarts the current level, while New Game always returns to Level 1
- Level switching now fully resets run state (pickups, hazards, player state/position/speed, timers, and finish state) so each level starts clean
- Playable low-poly 3D jungle runner with a pink elephant character
- Level loading now uses a beginner-friendly level registry with a safe fallback to Level 1
- Runtime level data now uses `currentLevelId` state and `buildLevelById(currentLevelId)`, starting on Level 1 exactly as before
- Completing Level 1 now shows a clear **Level Complete** screen with a **Start Level 2** action driven by each level's `nextLevel` config
- Level 1 keeps its original loops, hazards, speed, and collectibles, and its progression link stays `nextLevel: "level-2"`
- Level 2 is now tuned as **Sunset Temple Run** with an orange sky and pink sunset orb, while Level 3 is the **Night Run** layout using the previous purple/moon-like dusk palette
- Level-specific movement and course settings are now fully wired: Level 1 max speed stays 40 at 760m, and Level 2 uses max speed 42 with a 1330m finish
- HUD gate text now updates per level (no more hard-coded 760m), and Level 2 now renders path/decor further down the longer course
- Dusk Temple Run now applies its own atmosphere colours (background/fog/lights/accent glow) for a safer themed Level 2 visual
- A development-safe self-test confirms both `buildLevelById("level-1")` and `buildLevelById("level-2")` build with required sections
- Self-tests now verify both Level 2 and Level 3 stay registered as `"level-2"` / `"level-3"` and resolve through `getLevelConfig(...)`
- Self-tests now verify Level 1 finish/gate match global values and Level 2 finish/gate match its level-specific `course` overrides after build
- Fruit collection, obstacle dodging, and life-based gameplay
- Keyboard and touch controls for desktop and mobile play
- In-game pause/settings overlay and audio controls
- Procedural jungle decoration for replay variety


## Level expansion plan

- Level setup now supports an active level id (`currentLevelId`) so restarts can replay the current level while full “new game” reset returns to Level 1.

### Level config fields

- `background`
- `speed`
- `obstacle list`
- `goal distance`
- `music`
- `next level`

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

## Build for production

```bash
npm run build
```

This creates a production-ready `dist/` folder.

## Build for GitHub Pages (`/docs`)

```bash
npm run build:pages
```

This creates a static `docs/` folder that is ready for GitHub Pages branch deployment.

## GitHub Pages publishing (manual)

This project publishes to **GitHub Pages from `main` / `docs`**.

1. Run `npm run build:pages`
2. Commit the updated `docs` folder
3. Push to `main`

## Deployment notes

> Note: In restricted environments where npm packages cannot be installed, `docs/index.html` may be a temporary placeholder until `npm run build:pages` can run with dependencies available.

- This repo uses **GitHub Pages** with **Deploy from a branch**.
- In GitHub repository settings, choose:
  - **Source:** Deploy from a branch
  - **Branch:** `main`
  - **Folder:** `/docs`
- Vite is configured with the GitHub Pages base path (`/pink-elephant-jungle-dash/`) in `vite.config.js`.
- The `docs/index.html` file is built output (not raw source), and references bundled assets under `/pink-elephant-jungle-dash/assets/`.
- Add and keep `docs/.nojekyll` so GitHub Pages serves the built files directly.
- The known sandbox preview error below is benign and can be ignored:
  - `Uncaught TypeError: Cannot assign to read only property 'open' of object '#<Window>'`


## Deployment

- GitHub Pages deploys from **`main` branch / `docs` folder**.
- To publish changes, run `npm run build:pages`.
- Commit and push the updated `docs` folder.
- `.github/workflows/static.yml` was removed because this repo blocks external GitHub Actions.
- `docs/.nojekyll` must remain present so Pages serves Vite files directly.
