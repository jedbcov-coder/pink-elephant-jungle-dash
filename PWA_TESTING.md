# PWA testing checklist (beginner-friendly)

Use this after you deploy the latest `docs/` build to GitHub Pages.

## 1) Open the live game in Chrome or Edge
- Go to: `https://jedbcov-coder.github.io/pink-elephant-jungle-dash/`

## 2) Open DevTools
- Windows/Linux: `F12` or `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

## 3) Check the Manifest
- Open **Application** tab.
- Click **Manifest** in the left panel.
- Confirm you can see:
  - app name
  - icons
  - `display: standalone`
  - `start_url` and `scope`
- Confirm the icon entries point to `./favicon.png` for the listed install sizes.

## 4) Check Service Worker
- In **Application** tab, click **Service Workers**.
- Confirm one service worker is registered and active.

## 5) Check Cache Storage
- In **Application** tab, click **Cache Storage**.
- Confirm a cache named `game-pwa-v1` exists.

## 6) Install the app
- In the browser address bar/menu, click **Install app** (name can vary).
- Accept install.

## 7) Confirm standalone window
- Open the installed app from your desktop/start menu.
- Confirm it opens in its own app window (not a normal browser tab).

## 8) Confirm gameplay still works
- Verify keyboard controls, touch controls, audio, UI, score/lives, and level flow still behave normally.

## 9) Quick offline safety check
- In DevTools, go to **Network** tab and switch to **Offline**.
- Refresh the app.
- Confirm the app shell still opens (some dynamic assets may still require network if not cached yet).

## 10) If an old version is stuck
1. Open DevTools → **Application**.
2. Under **Service Workers**, click **Update** then **Unregister**.
3. Under **Storage**, click **Clear site data**.
4. Hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`).
5. Reopen the page.

When you ship a future update, bump the cache name in `public/service-worker.js` (for example `game-pwa-v2`) so old cached files are cleaned up automatically.
