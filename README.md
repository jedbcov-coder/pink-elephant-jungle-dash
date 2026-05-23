# Pink Elephant Jungle Dash

## Play the game

Live playable version: https://jedbcov-coder.github.io/pink-elephant-jungle-dash/

Pink Elephant Jungle Dash is a beginner-friendly 3D browser game where you run as a pink elephant, collect fruit, dodge jungle hazards, and try to survive as long as possible.

## Recent update

- Fixed the browser tab icon (favicon) path so it loads correctly in both local development and on GitHub Pages.

## Repo safety settings (recommended)

- GitHub Pages: deploy from `main` branch and `/docs` folder
- Deploy workflow: removed (manual publish flow only)
- CodeQL JavaScript/TypeScript: **On**
- CodeQL Actions: **Off**
- `docs/.nojekyll`: present
- `npm run build:pages`: manual publish step

## Controls

- **Move left/right:** `A` / `D` or `←` / `→`
- **Run faster (charge):** hold `W` or `↑`
- **Jump:** tap `Space`
- **Slide:** hold `Space`
- **Smash/Spin (when available):** `Z` or `E`
- **Touch devices:** use the on-screen control buttons

## Main features

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
- Level 2 now uses a warm orange sunset sky, and Level 3 (Night Run) uses the previous purple-white moonlit look
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
