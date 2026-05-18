# Codex Task Prompts

Use these prompts as one-task Codex assignments derived from `docs/follow-up-issues.md`. Open a separate Codex session for each numbered task. Do not combine architecture extraction with gameplay tuning, and do not combine any two prompts below in the same implementation request.

## Prompt 1: Add local reset and pause controls polish

```text
Implement and test only this task for Pink Elephant Jungle Runner. Keep the scope small, preserve the game's pink elephant jungle runner identity, its low-poly procedural look, and its lightweight browser footprint. Prefer tuning existing Three.js primitives, generated materials, canvas textures, and Web Audio patterns over introducing heavy external models, texture packs, or audio libraries.

Detailed task-stub from the follow-up report:

Summary:
Improve the local in-game reset and pause flow so players can safely recover, replay, and pause without losing the breezy jungle-runner feel.

Goals:
- Add or refine a clearly labeled local reset action that restarts the current run without requiring a browser refresh.
- Keep pause/resume behavior predictable for timers, movement state, audio state, overlays, and keyboard input.
- Make reset and pause affordances visible from the HUD and pause overlay while keeping the playful pink elephant presentation.
- Ensure keyboard shortcuts and click/tap buttons do not conflict with existing movement or leaderboard interactions.

Acceptance criteria:
- Resetting a run returns score, fruit, hazards, camera shake, active effects, and player position to a clean start state.
- Pausing freezes gameplay simulation and resumes without time jumps, stuck input, or overlapping music cues.
- The UI copy keeps the jungle breather / pink elephant runner tone.
- The implementation remains local-only and does not require backend changes.

Constraints:
- Do not replace the procedural low-poly scene or HUD with an external UI kit.
- Avoid adding new runtime dependencies unless they are demonstrably necessary.

Implementation instructions:
- Touch only files needed for this reset/pause polish.
- Do not do broad architecture extraction or unrelated gameplay tuning.
- Add or update tests/checks appropriate for this task, then run the relevant project checks before committing.
```

## Prompt 2: Seed jungle decoration for replayable procedural variety

```text
Implement and test only this task for Pink Elephant Jungle Runner. Keep the scope small, preserve the game's pink elephant jungle runner identity, its low-poly procedural look, and its lightweight browser footprint. Prefer tuning existing Three.js primitives, generated materials, canvas textures, and Web Audio patterns over introducing heavy external models, texture packs, or audio libraries.

Detailed task-stub from the follow-up report:

Summary:
Introduce seeded decorative variation along the jungle route so runs can feel richer while remaining deterministic and easy to debug.

Goals:
- Use a seedable random source for non-gameplay jungle decoration placement, color variation, and scale variation.
- Add lightweight props such as canopy clusters, flowers, vines, reeds, stones, or distant silhouettes using procedural geometry/materials.
- Keep collision-critical obstacles and collectibles governed by existing level data unless this issue explicitly expands that data.
- Expose enough seed metadata in development logs or debug helpers to reproduce visual arrangements.

Acceptance criteria:
- The same seed produces the same decoration layout across reloads.
- Different seeds produce noticeable but tasteful jungle variation.
- Decoration does not block the player path, hide critical pickups, or reduce obstacle readability.
- The pink elephant and jungle gate remain the visual focus.

Constraints:
- Do not import heavy foliage packs, photorealistic textures, or model libraries.
- Keep the art direction low-poly, colorful, readable, and procedural.

Implementation instructions:
- Touch only files needed for seeded non-gameplay decoration.
- Do not do broad architecture extraction or unrelated movement/audio/gameplay tuning.
- Add or update tests/checks appropriate for deterministic decoration behavior, then run the relevant project checks before committing.
```

## Prompt 3: Add optional touch controls for mobile play

```text
Implement and test only this task for Pink Elephant Jungle Runner. Keep the scope small, preserve the game's pink elephant jungle runner identity, its low-poly procedural look, and its lightweight browser footprint. Prefer tuning existing Three.js primitives, generated materials, canvas textures, and Web Audio patterns over introducing heavy external models, texture packs, or audio libraries.

Detailed task-stub from the follow-up report:

Summary:
Provide optional touch-friendly controls so the game is playable on phones and tablets without compromising keyboard play.

Goals:
- Add on-screen controls for lane movement, jump, and charge/dash actions.
- Show touch controls only when useful, such as on coarse-pointer devices or after a player opts in.
- Keep buttons large, readable, and compatible with the existing jungle HUD style.
- Ensure touch input shares the same movement state path as keyboard input where practical.

Acceptance criteria:
- A player can start, move, jump, charge/dash, pause, and reset using touch only.
- Keyboard controls continue to work unchanged on desktop.
- Touch controls do not cover core gameplay information, leaderboard entry, or major hazards.
- Multi-touch and rapid taps do not leave movement keys stuck.

Constraints:
- Do not replace the existing input system wholesale if a small adapter can bridge touch to current input state.
- Avoid third-party gesture libraries unless native pointer/touch events are insufficient.

Implementation instructions:
- Touch only files needed for optional touch controls and related styling.
- Do not do broad architecture extraction or unrelated gameplay/audio tuning.
- Add or update tests/checks appropriate for input behavior, then run the relevant project checks before committing.
```

## Prompt 4: Batch static props with instancing

```text
Implement and test only this task for Pink Elephant Jungle Runner. Keep the scope small, preserve the game's pink elephant jungle runner identity, its low-poly procedural look, and its lightweight browser footprint. Prefer tuning existing Three.js primitives, generated materials, canvas textures, and Web Audio patterns over introducing heavy external models, texture packs, or audio libraries.

Detailed task-stub from the follow-up report:

Summary:
Improve performance headroom by rendering repeated static jungle props with instancing while preserving the handmade procedural look.

Goals:
- Identify repeated static meshes that can share geometry and materials, such as leaves, rocks, flowers, posts, or background trunks.
- Convert suitable repeated props to `THREE.InstancedMesh` or an equivalent lightweight batching strategy.
- Keep transforms, colors, and scale variation flexible enough for organic jungle dressing.
- Document which prop categories are instanced and which remain individual meshes for gameplay or animation reasons.

Acceptance criteria:
- Repeated static decorations render with fewer draw calls than equivalent individual meshes.
- Instanced props maintain low-poly silhouettes and do not visually flatten the jungle.
- Collision, pickup, and enemy behavior remain unchanged.
- The approach is compatible with the existing Vite/Three.js stack.

Constraints:
- Do not use large external optimization frameworks.
- Do not convert animated or gameplay-critical entities to instances unless their behavior remains correct and testable.

Implementation instructions:
- Touch only files needed for static prop instancing and any focused documentation of the chosen prop categories.
- Do not do broad architecture extraction or unrelated gameplay tuning.
- Add or update tests/checks appropriate for rendering setup regressions, then run the relevant project checks before committing.
```

## Prompt 5: Polish procedural audio cues and mix

```text
Implement and test only this task for Pink Elephant Jungle Runner. Keep the scope small, preserve the game's pink elephant jungle runner identity, its low-poly procedural look, and its lightweight browser footprint. Prefer tuning existing Three.js primitives, generated materials, canvas textures, and Web Audio patterns over introducing heavy external models, texture packs, or audio libraries.

Detailed task-stub from the follow-up report:

Summary:
Refine the procedural music and sound effects so they better support the jungle chase, fruit collection, pause state, and end-of-run moments.

Goals:
- Tune Web Audio synth parameters for cleaner fruit pickups, hazard impacts, stampede pressure, pause/resume transitions, and victory/game-over moments.
- Add small procedural variations in pitch, envelope, or timing to avoid repetitive cues.
- Preserve separate mute controls for music, sound effects, and all audio.
- Make audio transitions robust when resetting, pausing, tab-switching, or starting from browser autoplay restrictions.

Acceptance criteria:
- Gameplay sounds are readable without becoming harsh or overwhelming.
- Pausing and resetting do not leave hanging notes, duplicated loops, or stale scheduled cues.
- The title/theme/gameplay audio still feels playful and jungle-themed.
- No external audio files are required for the polish pass.

Constraints:
- Keep audio procedural through Web Audio unless a future issue explicitly approves small local assets.
- Do not add large sample packs, music files, or heavyweight audio engines.

Implementation instructions:
- Touch only files needed for procedural audio cue and mix polish.
- Do not do broad architecture extraction or unrelated gameplay tuning.
- Add or update tests/checks appropriate for audio state behavior, then run the relevant project checks before committing.
```
