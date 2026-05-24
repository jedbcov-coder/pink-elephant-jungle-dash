# Device Profile Blueprint (Drop-in)

Use this blueprint to apply separate UI sizing/settings for phone, tablet, desktop, and 2-in-1 devices.

## 1) Add viewport meta tag

Put this in your `index.html` `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

## 2) Add profile CSS

Create a CSS file (example: `src/styles/device-profile.css`) and paste:

```css
/* Base defaults */
:root {
  --hud-font-size: 18px;
  --btn-height: 52px;
  --icon-size: 24px;
  --control-gap: 12px;
  --hud-edge-pad: 12px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
}

.game-shell {
  min-height: 100svh;
  min-height: 100dvh;
  padding-top: calc(var(--hud-edge-pad) + var(--safe-top));
  padding-right: calc(var(--hud-edge-pad) + var(--safe-right));
  padding-bottom: calc(var(--hud-edge-pad) + var(--safe-bottom));
  padding-left: calc(var(--hud-edge-pad) + var(--safe-left));
}

.hud-text { font-size: var(--hud-font-size); }

.game-btn {
  min-height: var(--btn-height);
  min-width: var(--btn-height);
  padding: 0 14px;
}

.icon {
  width: var(--icon-size);
  height: var(--icon-size);
}

.controls {
  display: flex;
  gap: var(--control-gap);
}

.bottom-controls {
  margin-bottom: max(8px, var(--safe-bottom));
}

/* Device profiles */
body.profile-phone {
  --hud-font-size: 16px;
  --btn-height: 50px;
  --icon-size: 22px;
  --control-gap: 10px;
  --hud-edge-pad: 10px;
}

body.profile-tablet {
  --hud-font-size: 22px;
  --btn-height: 60px;
  --icon-size: 30px;
  --control-gap: 16px;
  --hud-edge-pad: 16px;
}

body.profile-desktop {
  --hud-font-size: 18px;
  --btn-height: 48px;
  --icon-size: 22px;
  --control-gap: 12px;
  --hud-edge-pad: 12px;
}

/* Input mode */
body.input-touch .game-btn {
  min-height: max(var(--btn-height), 56px);
}

body.input-mouse .game-btn:hover {
  filter: brightness(1.08);
}

.rotate-message { display: none; }
body.profile-phone.portrait .rotate-message { display: block; }
```

## 3) Add profile detection script

Create `src/device-profile.js` and paste:

```js
(function () {
  const body = document.body;
  const mqTouch = window.matchMedia('(pointer: coarse)');
  const mqLandscape = window.matchMedia('(orientation: landscape)');

  function getProfile() {
    const shortSide = Math.min(window.innerWidth, window.innerHeight);
    const isTouch = mqTouch.matches;

    if (shortSide < 600) return 'phone';
    if (isTouch && shortSide >= 600 && shortSide <= 1200) return 'tablet';
    return 'desktop';
  }

  function getInputMode() {
    return mqTouch.matches ? 'touch' : 'mouse';
  }

  function applyClasses() {
    body.classList.remove('profile-phone', 'profile-tablet', 'profile-desktop');
    body.classList.remove('input-touch', 'input-mouse');
    body.classList.remove('portrait', 'landscape');

    body.classList.add('profile-' + getProfile());
    body.classList.add('input-' + getInputMode());
    body.classList.add(mqLandscape.matches ? 'landscape' : 'portrait');
  }

  applyClasses();
  window.addEventListener('resize', applyClasses);
  window.addEventListener('orientationchange', applyClasses);
  mqTouch.addEventListener?.('change', applyClasses);
  mqLandscape.addEventListener?.('change', applyClasses);
})();
```

Then load it once (example in `index.html`):

```html
<script src="/src/device-profile.js"></script>
```

## 4) Minimal HTML pattern

```html
<body>
  <div class="game-shell">
    <div class="rotate-message">Please rotate your device to landscape.</div>
    <div class="hud-text">Score: 1200</div>

    <div class="controls bottom-controls">
      <button class="game-btn"><span class="icon">◀</span></button>
      <button class="game-btn"><span class="icon">▶</span></button>
      <button class="game-btn">Jump</button>
    </div>
  </div>
</body>
```

## 5) How to apply in this project safely

1. Keep existing gameplay logic unchanged.
2. Move hard-coded UI sizes into variables (`--btn-height`, `--hud-font-size`, etc.).
3. Let `profile-*` classes set those values.
4. Test on phone/tablet/desktop and one touch laptop (2-in-1).

Recommended defaults for this jungle runner:
- Phone: 50–56px controls
- Tablet: 60px controls, larger HUD
- Desktop: tighter controls + hover feedback
