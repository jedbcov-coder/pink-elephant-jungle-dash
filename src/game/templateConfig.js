export const GAME_TEMPLATE_CONFIG = Object.freeze({
  title: "Pink Elephant Jungle Dash",
  shortTitle: "Pink Elephant",
  blurb: "A tiny 3D jungle runner template for webapp PWA game projects.",
  logo: "/favicon.png",
  themeColor: "#0c2217",
  startMusic: "title-theme",
  defaultLevel: "level-1",
  features: Object.freeze({
    levelSelect: true,
    achievements: true,
    haptics: true,
    gamepad: true,
    offlineMode: true,
    credits: true,
    accessibilitySettings: true,
  }),
});

export function isTemplateFeatureEnabled(featureName) {
  return Boolean(GAME_TEMPLATE_CONFIG.features[featureName]);
}
