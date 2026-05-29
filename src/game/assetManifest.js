export const ASSET_MANIFEST = Object.freeze({
  music: {
    title: { id: "title-theme", generated: true, description: "Generated 8-bit title melody" },
    level1: { id: "main-theme", generated: true, description: "Default gameplay loop" },
    level2: { id: "sunset-temple-run-theme", generated: true, description: "Per-level variation hook" },
    level3: { id: "night-run-theme", generated: true, description: "Per-level variation hook" },
  },
  sfx: {
    uiClick: { id: "ui-click", generated: true },
    jump: { id: "jump", generated: true },
    pickup: { id: "fruit", generated: true },
    impact: { id: "hurt", generated: true },
    success: { id: "gate", generated: true },
  },
  images: {
    logo: { path: "/favicon.png", role: "title-logo" },
    hero: { path: "/pe-jungledash.jpg", role: "readme-preview" },
  },
  levels: {
    level1: { module: "src/game/levels/level1.js" },
    level2: { module: "src/game/levels/level2.js" },
    level3: { module: "src/game/levels/level3.js" },
  },
  recommendedFolders: [
    "/assets/audio/music",
    "/assets/audio/sfx",
    "/assets/images/sprites",
    "/assets/images/ui",
    "/assets/fonts",
    "/assets/levels",
    "/assets/data",
  ],
});

export function getAssetManifestSummary() {
  return {
    musicCount: Object.keys(ASSET_MANIFEST.music).length,
    sfxCount: Object.keys(ASSET_MANIFEST.sfx).length,
    imageCount: Object.keys(ASSET_MANIFEST.images).length,
    levelCount: Object.keys(ASSET_MANIFEST.levels).length,
    recommendedFolderCount: ASSET_MANIFEST.recommendedFolders.length,
  };
}
