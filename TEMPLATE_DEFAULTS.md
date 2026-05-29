# PWA Game Template Defaults

This repo is a working prototype for the default webapp PWA game template.

Use this checklist when starting a new game from the repo or when checking whether a prototype still matches the template expectations.

## Core Flow

Default game flow:

1. Boot/loading screen
2. Start screen
3. Settings
4. Level briefing
5. Playing
6. Pause menu
7. Level complete
8. Next level or final completion
9. Game over
10. Credits/About

## Default Screens

- Start screen with game name, logo, blurb, start button, and settings button
- Loading screen with a friendly fallback if the game bundle does not load
- Settings screen with audio, controls, display, save tools, install status, and credits
- Level briefing with level name, objective, and difficulty
- Pause screen with resume, settings, and restart
- Level complete screen with stats and continue/restart actions
- Game over screen with retry
- Credits/About surface for attribution and template version info

## Audio Defaults

- Title-screen soundtrack
- Per-level music support
- SFX for important actions and UI events
- Master/music/SFX toggles
- Browser-safe audio unlock after player interaction

## PWA Defaults

- Web app manifest
- Installable app metadata
- Service worker
- Offline shell caching
- Custom offline fallback page
- Cache versioning
- Update-available prompt
- GitHub Pages `/docs` deployment output
- `docs/.nojekyll` marker created by `npm run build:pages`

## Save Defaults

- Local settings persistence
- Profile/progression schema
- IndexedDB stores for scores, achievements, and progression events
- Export save
- Import save
- Reset save
- Safe schema migration for older saves

## Input Defaults

- Keyboard controls
- Touch controls
- Mobile layout detection
- Pause shortcut
- Input buffering for jump/slide timing
- Safe release on pause, app blur, and game end

## Accessibility Defaults

- Touch-friendly controls
- Safe-area support for phones/tablets
- Portrait rotate guidance
- Settings structure ready for high contrast and reduced-motion options
- Readable HUD and menu text at mobile/tablet sizes

## Developer Defaults

- `npm run dev`
- `npm run check`
- `npm run build`
- `npm run build:pages`
- CSS brace check
- TypeScript/JSDoc check path
- CodeQL workflow
- Security notes for browser games
- Environment example file

## Current Prototype Status

Already active in Pink Elephant Jungle Dash:

- Start/settings/pause/complete/game-over screens
- Loading fallback shell
- Dedicated level-select screen
- Dedicated credits/about screen
- Accessibility settings for motion, contrast, text size, and softer flashes
- Gamepad polling through an InputManager-style helper
- Optional haptic feedback for action, pickup, impact, and success events
- Achievement definitions, unlock persistence, toast feedback, and settings display
- Asset manifest convention for music, SFX, images, levels, and recommended folders
- Title music and generated SFX
- Data-driven Levels 1-3
- Save manager and save tools
- PWA manifest/service worker/update prompt
- Touch controls and responsive HUD
- Dev debug panel
- Formal state-machine module
- Template config file for title, blurb, logo, theme color, start music, default level, and default feature switches
- Reusable UI primitives for buttons, icon buttons, modals, sliders, toggles, tabs, tooltips, progress/health bars, score counters, timers, level cards, settings rows, confirm dialogs, and toasts
- Custom offline fallback page
- Friendly error screen with restart, menu, and copy-debug actions
- GitHub Pages build output

Still good future template upgrades:

- Asset replacement guide with real downloadable placeholder packs
- Template setup wizard for quickly renaming the game, replacing art, and choosing default features
