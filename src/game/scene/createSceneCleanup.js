// Ownership: Scene teardown helper extracted from App.jsx cleanup logic.
export function createSceneCleanup({
  currentLevelId,
  cancelAnimationFrame,
  frame,
  keyDown,
  keyUp,
  handleWindowBlur,
  handleDocumentHidden,
  handlePageHide,
  handleWindowFocus,
  resize,
  resetGameRef,
  scene,
  textures,
  postProcessing,
  renderer,
  mount,
  safeRemoveRendererDomElement,
  audioManagerRef,
  hardDispose = false,
  transitionContext = null,
}) {
  console.debug("[scene-cleanup-start]", currentLevelId);
  if (transitionContext) {
    console.debug("[level-transition-cleanup-start]", transitionContext);
  }
  try {
    cancelAnimationFrame(frame);
    window.removeEventListener("keydown", keyDown);
    window.removeEventListener("keyup", keyUp);
    window.removeEventListener("blur", handleWindowBlur);
    document.removeEventListener("visibilitychange", handleDocumentHidden);
    window.removeEventListener("pagehide", handlePageHide);
    window.removeEventListener("focus", handleWindowFocus);
    window.removeEventListener("resize", resize);
    resetGameRef.current = null;

    const seenGeometries = new Set();
    const seenMaterials = new Set();
    const seenTextures = new Set();

    const collectTexture = (value) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach(collectTexture);
        return;
      }
      if (value.isTexture && typeof value.dispose === "function") {
        seenTextures.add(value);
        return;
      }
      if (value.value && value.value !== value) collectTexture(value.value);
    };

    const collectMaterial = (material) => {
      if (!material) return;
      if (Array.isArray(material)) {
        material.forEach(collectMaterial);
        return;
      }
      if (seenMaterials.has(material)) return;
      seenMaterials.add(material);
      Object.values(material).forEach(collectTexture);
      if (material.uniforms) Object.values(material.uniforms).forEach(collectTexture);
    };

    const collectObjectResources = (object) => {
      if (object.geometry && typeof object.geometry.dispose === "function") {
        seenGeometries.add(object.geometry);
      }
      collectMaterial(object.material);
    };

    if (scene) {
      collectTexture(scene.background);
      collectTexture(scene.environment);
      scene.traverse(collectObjectResources);
    }
    Object.values(textures ?? {}).forEach(collectTexture);

    seenGeometries.forEach((geometry) => geometry.dispose());
    seenMaterials.forEach((material) => material.dispose?.());
    seenTextures.forEach((texture) => texture.dispose());
    postProcessing?.dispose();
    console.debug("[renderer-dom-parent]", renderer?.domElement?.parentNode);
    safeRemoveRendererDomElement(renderer, mount);
    renderer?.renderLists?.dispose?.();
    renderer?.dispose?.();
    if (hardDispose) {
      try {
        renderer?.forceContextLoss?.();
      } catch (error) {
        console.warn("[scene-cleanup] forceContextLoss failed", error);
      }
    }
    scene?.clear?.();
    if (hardDispose) {
      audioManagerRef.current?.dispose();
    }
  } catch (error) {
    console.warn("[scene-cleanup] Non-fatal cleanup error", error);
  }
  console.debug("[scene-cleanup-end]", currentLevelId);
}
