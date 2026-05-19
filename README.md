# Pink Elephant Jungle Dash

Pink Elephant Jungle Dash is a playable browser game prototype built with React and Three.js. You guide a pink elephant through a jungle dash course, collecting fruit and pineapples, avoiding obstacles, and reaching the jungle gate.

## Play the game

Live playable version: https://jedbcov-coder.github.io/pink-elephant-jungle-dash/

## Controls

- **Charge / run:** Hold ↑ or W to build elephant charge and speed up.
- **Steer:** Use ← / A and → / D to move left and right.
- **Jump:** Tap Space.
- **Slide:** Hold Space to slide under hazards.
- **Smash / Spin:** Press Z or E for elephant attacks when available.
- **Touch controls:** On phones, tablets, small screens, or touch devices, use the on-screen buttons for Charge, Left, Right, Jump, Slide, and Smash.
- **Pause and settings:** Use the gold gear button in the HUD.
- **Audio:** Use the sound, music, and SFX buttons at the bottom left during play.

## Main features

- Low-poly 3D jungle dash course starring a pink elephant.
- Seeded jungle decoration with bigger banana leaves, hanging vines, moss, rocks, ruin silhouettes, and a centralized registry for reusable procedural stone, leaf, moss, path crack, subtle stone/path normal-map, elephant skin, water, foam, and pickup glow textures.
- Hidden development-only texture preview flag in `src/App.jsx` for checking generated texture thumbnails while keeping normal gameplay clean.
- Stacked HUD counters for fruit, lives, next extra life progress, score, combo multiplier, timer, and crates.
- Pause/settings overlay, local self-tests for scoring, fruit-life rewards, combos, collision helpers.
- GitHub Pages deployment through the included workflow at `.github/workflows/deploy-pages.yml`.

## Tech Stack

- **React** for the game shell and HUD overlays.
- **Three.js** for the 3D scene, player, track, obstacles, pickups, and camera.
- **Vite** for local development, production builds, and static output.
- **Plain CSS entrypoint (`src/styles.css`)** for global app styles and utility classes used by the React HUD/title overlays.
- **GitHub Actions + GitHub Pages** for deployment.

## Install Dependencies

```bash
npm install
```

If you are working in CI or another clean environment with a lockfile available, prefer:

```bash
npm ci
```

## Run Locally

```bash
npm run dev
```

Then open the local URL printed by Vite, usually <http://localhost:5173/>. In hosted workspaces, forward port `5173` from the ports or preview panel.

## Build

```bash
npm run build
```

The production build is written to `dist/`. That folder is generated output and should not be committed.

## Preview the Production Build

```bash
npm run preview
```

This serves the already-built `dist/` folder so you can sanity-check the same static assets GitHub Pages will publish.



## Troubleshooting

If you see `Uncaught TypeError: Cannot assign to read only property 'open' of object '#<Window>'` in a sandboxed preview, treat it as a known benign iframe restriction and ignore it.

If the game stays on **"Loading game…"** on GitHub Pages, it usually means JavaScript files did not load from the right URL path. This project uses a relative Vite base path (`./`) in `vite.config.js` so it works on normal GitHub Pages project URLs.

## Deployment

Deployment uses two workflows: `.github/workflows/deploy-pages.yml` for the production game build, and `.github/workflows/static.yml` as the single master static Pages workflow (combined from the previous duplicate static files).

The same workflow validates pull requests into `main`, pushes to `main`, and manual dispatches with the scripts currently defined in `package.json`:

1. Checks out the repository.
2. Installs Node dependencies.
3. Runs `npm run check`.
4. Runs `npm run build`.

For pull requests, validation stops there so no GitHub Pages deployment is attempted. For pushes to `main` and manual dispatches, the workflow then uploads only the generated `dist/` folder as the GitHub Pages artifact and deploys that artifact to GitHub Pages.

Vite is configured with a relative base path in `vite.config.js`, so the built game can run correctly from the repository subpath used by GitHub Pages.

## Project Structure

```text
.
├── .github/workflows/
│   ├── deploy-pages.yml       # GitHub Pages build and deploy workflow
│   └── static.yml             # Master static Pages workflow
├── docs/                      # Planning notes and follow-up issue drafts
│   ├── codex-task-prompts.md  # One-task Codex prompt templates
│   └── follow-up-issues.md    # Scoped next-step issue drafts
├── index.html                 # Vite HTML entrypoint
├── src/
│   ├── App.jsx                # Main React game component and game loop
│   ├── main.jsx               # Browser entrypoint and stylesheet import
│   ├── components/
│   │   └── Icon.jsx           # Small reusable HUD icon component
│   ├── game/
│   │   ├── audio.js           # Music note data and frequency helper
│   │   ├── config.js          # Core movement, camera, and world constants
│   │   ├── fruitLife.js       # Pure fruit-life and combo scoring helpers
│   │   ├── input.js           # Keyboard and touch control state helpers
│   │   ├── level.js           # Level layout: fruit, obstacles, rivers, enemies
│   │   ├── math.js            # Shared math and collision helpers
│   │   ├── selfTests.js       # Lightweight runtime sanity checks
│   │   ├── track.js           # Curved jungle path coordinate helpers
│   │   └── rendering/
│   │       ├── decorativeProps.js # Decorative leaf, moss, rock, and ruin prop builders
│   │       ├── jungleProps.js     # Low-poly tree and bush builders
│   │       ├── materials.js       # Three.js material factory
│   │       └── textures.js        # Generated canvas textures and the scene texture registry
│   └── styles/
│       └── game-ui.css        # Local utility CSS used by the HUD overlays
├── package.json               # Scripts and dependencies
├── tsconfig.json              # JavaScript-aware TypeScript project check config
└── vite.config.js             # Vite build config for GitHub Pages
```

## Where the Main Game Logic Lives

- **Game loop and scene assembly:** `src/App.jsx`
- **Movement and camera constants:** `src/game/config.js`
- **Level and obstacle placement:** `src/game/level.js`
- **Collision helpers:** `src/game/math.js`
- **Fruit-life and combo scoring helpers:** `src/game/fruitLife.js`
- **Keyboard and touch controls:** `src/game/input.js`
- **Track curve helpers:** `src/game/track.js`
- **Generated materials, textures, and decorative prop builders:** `src/game/rendering/`
- **Development texture preview:** `SHOW_TEXTURE_PREVIEW` near the top of `src/App.jsx`; leave it `false` unless you are debugging generated textures locally.
- **HUD styling:** `src/styles/game-ui.css`

## Adding Future Assets or Levels

- Add static image, audio, or model files under `src/assets/` if they are imported from code, or under `public/` if they should be copied directly to the build output.
- Add new level placement data in `src/game/level.js`. Keep level data declarative where possible so it is easy to tune without changing the game loop.
- Add new movement, camera, or tuning constants in `src/game/config.js` instead of scattering magic numbers through the game loop.
- Add reusable UI pieces under `src/components/`.

## Follow-up Issue Drafts

GitHub-ready follow-up issue drafts live in `docs/follow-up-issues.md`. Codex-ready one-task prompts for those drafts live in `docs/codex-task-prompts.md`. Together they cover local reset/pause polish, seeded jungle decoration, optional touch controls, instanced static props, and procedural audio polish while preserving the pink elephant jungle dash identity and lightweight low-poly procedural style.

## Notes for Future Cleanup

The refactor keeps gameplay conservative: the main scene and update loop remain in `src/App.jsx`, while decorative jungle prop builders live in `src/game/rendering/` to avoid changing behaviour accidentally. Future work can gradually extract larger systems, such as player physics, obstacle collision handling, audio playback, and enemy updates, once there are automated browser-level regression checks.


## Repository housekeeping

Imported workspace leftovers were removed so the repo only keeps files used by the active Vite app and project docs.
