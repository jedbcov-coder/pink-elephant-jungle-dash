# Level Element Data Conventions

Use this folder for **discrete reusable element presets** so targeted behavior/design changes can be made in one local place.

## File naming
- `obstacle-*.js` for obstacle presets (logs, vines/branches, rivers/crocs).
- `enemy-*.js` for enemy presets (monkey patrols).
- `collectible-*.js` for collectible presets (pineapples, peaches, sugar cane).

## Data naming
- Export arrays using uppercase snake case (example: `OBSTACLE_LOG_PRESETS`).
- Each array item is a plain object. Level files clone objects with `{ ...preset }`.
- Add new recurring element presets here first, then reference them from level plans.
