# Pink Elephant Jungle Dash

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

- Playable low-poly 3D jungle runner with a pink elephant character
- Level loading now uses a beginner-friendly level registry with a safe fallback to Level 1
- Runtime level data is now built from the selected level config using a level-id helper
- Fruit collection, obstacle dodging, and life-based gameplay
- Keyboard and touch controls for desktop and mobile play
- In-game pause/settings overlay and audio controls
- Procedural jungle decoration for replay variety

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
