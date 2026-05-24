# Offline testing (quick checklist)

Use this after `npm run build:pages` and after publishing to GitHub Pages.

1. Open the live game once while online.
2. (Optional) Install it from the browser install button.
3. Open DevTools → **Application** and verify a service worker is active.
4. Open DevTools → **Application → Cache Storage** and verify `jungle-dash-offline-*` exists.
5. Open DevTools → **Network** and switch to **Offline**.
6. Refresh the page.
7. Confirm the app opens and gameplay starts while offline.
8. Confirm previously loaded assets (images/audio/game files) still work.
9. Go back online, deploy a small update, and reload.
10. Confirm the **Update available** banner appears; click **Refresh** and verify the new version loads.

If stale content remains:
- DevTools → **Application → Service Workers**: **Unregister**
- DevTools → **Application → Storage**: **Clear site data**
- Reopen the game online once, then repeat the offline test.
