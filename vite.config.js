import { defineConfig } from "vite";

const repoBase = "/pink-elephant-jungle-dash/";
const isPagesBuild = process.env.GITHUB_PAGES === "true" || process.env.npm_lifecycle_event === "build:pages";

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || String(Date.now())),
  },
  base: isPagesBuild ? repoBase : "/",
  build: {
    manifest: true,
  },
});
