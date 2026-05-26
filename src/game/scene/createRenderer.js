// Ownership: Scene bootstrap helper extracted from App.jsx renderer setup logic.
import * as THREE from "three";

export function createRenderer({ mount, scene, camera, createPostProcessing, setSceneError }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch (error) {
    const message = error?.message || "WebGL is unavailable in this browser.";
    console.error("Pink Elephant WebGL renderer failed to start", error);
    setSceneError(message);
    throw error;
  }

  setSceneError(null);
  const rendererPixelRatio = () => Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  renderer.setPixelRatio(rendererPixelRatio());
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  mount.appendChild(renderer.domElement);

  let postProcessing = null;
  try {
    postProcessing = createPostProcessing(renderer, scene, camera, {
      width: mount.clientWidth,
      height: Math.max(1, mount.clientHeight),
      pixelRatio: rendererPixelRatio(),
    });
  } catch (error) {
    console.warn("Pink Elephant post-processing failed; falling back to direct rendering", error);
  }

  return { renderer, rendererPixelRatio, postProcessing };
}
