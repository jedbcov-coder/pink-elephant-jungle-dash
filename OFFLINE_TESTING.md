# Offline testing checklist

Use this after `npm run build:pages` and after publishing to GitHub Pages.

1. Open the live game while online once.
2. Install the app from the browser install button (optional but recommended).
3. Open DevTools → **Application** and confirm a service worker is active.
4. In DevTools → **Application → Cache Storage**, confirm there is a `jungle-dash-offline-*` cache.
5. In DevTools → **Network**, enable **Offline**.
6. Refresh the page.
7. Confirm the app shell still opens and gameplay starts.
8. Confirm already-loaded images/audio/assets still appear offline.
9. Go back online, deploy a small change, then reload the app.
10. Confirm an **Update available** banner appears and **Refresh** loads the new version.

If you still see stale files:
- DevTools → Application → **Service Workers**: click **Unregister**.
- DevTools → Application → **Storage**: click **Clear site data**.
- Reopen the game online once, then retest offline.
