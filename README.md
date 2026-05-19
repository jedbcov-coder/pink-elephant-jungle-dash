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

## Deployment notes

- This repo is configured for **GitHub Pages**.
- Vite is configured with the GitHub Pages base path (`/pink-elephant-jungle-dash/`) in `vite.config.js`.
- GitHub Actions workflow `.github/workflows/static.yml` installs dependencies, builds the app, uploads `dist/`, and deploys to Pages.
- The known sandbox preview error below is benign and can be ignored:
  - `Uncaught TypeError: Cannot assign to read only property 'open' of object '#<Window>'`
