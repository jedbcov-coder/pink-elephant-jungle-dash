# Pink Elephant Jungle Dash Agent Instructions
> [!NOTE]
> **DevHut Meta-Repository Context**
> This project is a constituent subproject of the **DevHut** meta-repository.
> - **Product Exports**: All compiled releases and packaging output (`.exe`, `.msi`, `.vsix`, `.paf.exe`, etc.) must be exported directly to the centralized directory `D:\Products\games\pink-elephant-jungle-dash\releases\v<version>\`. Storing product outputs within the local project workspace is forbidden.
> - **Shared Knowledge**: Coding agents are instructed to borrow, reuse, and align with design tokens, architectural patterns, SQLite schemas, Svelte/Tauri integration, and engineering practices from sibling projects in `10-workshop/games/`, `10-workshop/software/`, and `60-tool-rack/`.
> - **Portable Tool Preference**: When selecting tools for diagnostics, file inspection, or build support, prefer portable versions available on `D:\Tools\` over any equivalent installed on `C:\`. This keeps the SSD self-sufficient when moved between laptops. Only fall back to `C:\` tools when `D:\Tools\` does not provide the needed capability.

These instructions apply to the whole repository unless a deeper `AGENTS.md` file gives more specific rules.

## Project at a glance

Pink Elephant Jungle Dash is a frontend-only 3D browser runner game built with React, Vite, and Three.js. The game is deployed as a GitHub Pages friendly PWA.

Main flow:

| Area | Purpose |
| --- | --- |
| `index.html` | Boot shell, metadata, manifest link, and initial loading screen. |
| `src/main.jsx` | React mount point, lazy app load, error boundary, app version logging, and service-worker update prompt setup. |
| `src/App.jsx` | Main game orchestration, scene lifecycle, gameplay state, cut scenes, controls, save tools, and UI wiring. Treat it as legacy/high-risk code. |
| `src/game/**` | Core game logic, levels, collision, movement, save data, audio, haptics, rendering helpers, self-tests, and template defaults. |
| `src/components/**` | Reusable React UI and game overlay components. |
| `src/styles/**` | Global, gameplay, menu, touch, and accessibility styling. |
| `src/pwa/**` | Service-worker registration and update prompt code. |
| `public/**` | Static runtime assets, manifest, service worker, offline page, media, models, and images. |
| `docs/**` | GitHub Pages build output when `npm run build:pages` is used. |
| `scripts/**` | Local maintenance and validation helpers. |

Prefer focused modules under `src/game`, `src/components`, `src/pwa`, or `scripts` instead of adding more unrelated logic to `src/App.jsx`.

## Non-negotiable rules

- Do not commit real secrets. Anything in `src/`, `public/`, `docs/`, built JavaScript, or `VITE_*` variables can become visible to players.
- Keep the game browser-safe. Guard `window`, `document`, `navigator`, `localStorage`, `serviceWorker`, `screen.orientation`, `clipboard`, and similar APIs when code may run during import, tests, build, or restricted browser modes.
- Preserve core controls unless the task asks to change them: keyboard, touch joystick, touch action buttons, gamepad, pause, and optional haptics.
- Preserve accessibility settings and menu usability: high contrast, reduced motion, large text, soft flashes, focus rings, screen-reader labels, and scroll-contained menus.
- Do not hide or ignore real player-facing startup, gameplay, asset, or PWA errors.
- Keep player-facing text short, clear, and suitable for a young audience.

## Development commands

Use these commands from the repository root.

| Command | Use |
| --- | --- |
| `npm install` | Install dependencies, or refresh them after dependency changes. |
| `npm run dev` | Start the local Vite dev server. |
| `npm run check` | Run the CSS brace check and TypeScript no-emit check. |
| `npm run check:css` | Check `src/styles/game-ui.css` brace balance only. |
| `npm run build` | Run the normal production Vite build. |
| `npm run build:pages` | Build GitHub Pages output into `docs/` and ensure `docs/.nojekyll`. |
| `npm run test` | Alias for `npm run check`. |
| `npm run lint` | Alias for `npm run check`. |

## Validation checklist

Before finishing a code change:

1. Run `npm run check`.
2. Run `npm run build` for code, rendering, dependency, PWA, asset-path, or release-marker changes.
3. Run `npm run build:pages` for GitHub Pages, service-worker, public asset, base-path, release, or `docs/` output changes.
4. Smoke test the title screen, **Begin the Trail**, opening cut scene, Level 1 completion, reward cut scene, Level 2 start, pause, quit to home, restart, settings, credits/about, game over, and final reward flow when those areas are touched.
5. For input/UI changes, test keyboard, touch landscape layout, and a basic gamepad path when available.
6. For PWA changes, test first load, refresh after a new build, offline fallback, and update-banner behaviour.

If a check cannot be run in the current environment, state that clearly in the final response and list the risk.

## Release and cache rules

For each visible player-facing update:

- Update `src/appInfo.js`:
  - `APP_VERSION`
  - `APP_BUILD_LABEL`
  - `APP_UPDATE_NOTE`
- Bump `CACHE_VERSION` in `public/service-worker.js` when bundle output, cached files, public assets, media, models, or offline behaviour changes.
- Add a short â€œLatest â€¦ updateâ€ entry near the top of `README.md` for release-facing changes.
- Keep the README release note, `APP_VERSION`, build label, update note, and service-worker cache version aligned.
- Run `npm run build:pages` when preparing GitHub Pages output.
- Do not remove `docs/.nojekyll`. The Pages build helper recreates it.

## GitHub Pages and public paths

- `vite.config.js` uses `/pink-elephant-jungle-dash/` for Pages builds and `/` for normal local/dev builds.
- Do not hard-code root-only runtime paths in app code when an asset must work on GitHub Pages.
- Use `import.meta.env.BASE_URL` aware helpers, such as `resolvePublicAssetUrl`, for public runtime assets.
- Keep service-worker cached paths relative and safe for GitHub Pages.
- Large media and model files, especially `.mp4` and `.glb`, should normally cache after first use rather than being forced into the initial install list.

## PWA, assets, and media

- Put runtime static assets under `public/assets/**` unless imported through Vite from `src`.
- Add new runtime assets to `src/game/assetManifest.js` when they are part of the gameâ€™s known asset set.
- Keep `public/manifest.webmanifest`, `public/service-worker.js`, and `src/game/assetManifest.js` aligned with new public assets.
- Prefer clean filenames for new assets. Only rely on URL encoding when an existing filename requires it.
- Keep cut scenes skippable.
- Stop title/gameplay audio before playing native MP4 cut-scene audio.
- Avoid adding heavy lights, large particle bursts, huge textures, or many new runtime allocations without considering low-end mobile performance.

## Gameplay architecture

- Keep tuning constants in `src/game/config.js` or level modules, not scattered through render or input loops.
- Keep collision, movement, scoring, save, audio, haptics, input, level, state-machine, and rendering helpers in their existing modules.
- Prefer small pure helpers and add self-tests for new gameplay rules.
- Do not use visible GLB models as the gameplay collision source. Keep proven invisible colliders separate from visual art.
- Preserve the current level chain unless the task asks to change it: `level-1 -> level-2 -> level-3 -> null`.
- When adding or changing levels, update the registry, schema/validation, prompt metadata, asset manifest if needed, and self-tests together.
- Keep save-data changes backwards compatible. Add migrations when saved data shape changes.

## React and Three.js rules

- State that changes every frame belongs in refs, local mutable objects, or Three.js objects, not React state.
- Clean up event listeners, intervals, timeouts, animation frames, audio nodes, service-worker handlers, and Three.js resources.
- Dispose geometries, materials, textures, and cloned resources when scene objects are removed.
- Keep expensive allocations out of animation loops. Reuse vectors, boxes, materials, and geometries where practical.
- Keep scene setup and teardown symmetrical.
- Keep Vercel analytics and speed insights host-gated so GitHub Pages does not load missing Vercel-only scripts.

## UI, mobile, and accessibility

- The page and gameplay shell should not scroll during play.
- Longer menus should scroll inside their own cards rather than moving the full page.
- Test phone and tablet landscape layouts when changing menus, overlays, touch controls, HUD spacing, or viewport logic.
- Preserve the pinned bottom-left joystick and bottom-right Jump/Smash action layout unless the task asks for a layout change.
- Fullscreen, orientation lock, haptics, clipboard, media autoplay, and gamepad APIs must fail safely.
- Respect high contrast, reduced motion, large text, and soft-flash settings when adding visuals or effects.
- Avoid player-facing debug panels, build strings, or diagnostic cards unless the task is to add a deliberate debug feature.

## Tests and self-tests

- Add or update `src/game/selfTests.js` for gameplay rules, collision, scoring, level schema, state-machine, save migration, asset manifest, haptic, input, or prompt metadata changes.
- Do not weaken existing assertions just to make a change pass. Fix the underlying logic unless the task explicitly changes the rule.
- Use deterministic seeds for procedural logic and tests.
- Keep unknown-level fallback tests quiet during normal startup.

## Style rules

- Match the local source style: ES modules, double quotes in JavaScript, semicolons, and clear function names.
- Prefer early returns over deep nesting.
- Keep comments useful. Explain browser quirks, gameplay rules, or safety constraints rather than obvious syntax.
- Avoid broad rewrites. Make the smallest safe change that solves the task.
- Do not add new dependencies unless they remove a clear maintenance risk and the bundle impact is acceptable.

## Safe change boundaries

| Change type | Expected files to review |
| --- | --- |
| Small UI/style fix | Related component, `src/styles/**`, affected menu/overlay flow, CSS brace check. |
| Touch or input change | `src/App.jsx`, `src/game/input*.js`, `TouchControls`, layout CSS, gamepad status, pause/release behaviour. |
| Level/content change | `src/game/levels/**`, registry, schema, prompt metadata, self-tests, asset manifest. |
| PWA/cache/release change | `src/appInfo.js`, `public/service-worker.js`, `src/pwa/**`, README, `docs/` output if publishing. |
| Asset or media change | `public/assets/**`, `src/game/assetManifest.js`, service-worker cache rules, cut-scene/audio flow. |
| Save-data change | `src/game/save/**`, migrations, import/export, achievements, self-tests. |
| Security or backend-like feature | Do not place secrets in the frontend. Use a trusted backend, serverless function, or edge function for private work. |

## Known benign sandbox issue

Ignore this sandboxed-environment iframe restriction when it appears and no user-facing game behaviour is broken:

```text
Uncaught TypeError: Cannot assign to read only property 'open' of object '#<Window>'
```

---

## External Tools Registry
For game assets compression, sprite sheets optimization, and haptics/audio tuning, refer to the SSD's global tool registry in [D:\Tools\README.md](file:///D:/Tools/README.md). Specific tools useful for this project include:
*   **FFmpeg** (`D:\Tools\bin\ffmpeg.exe`): Terminal client for compressing background music loops and audio files.
*   **XnConvert Portable** (`D:\Tools\portableapps\PortableApps\XnConvertPortable\`): Batch converter for resizing, format conversions (PNG to WebP), and optimizing sprite assets.
