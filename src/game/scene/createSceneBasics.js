// Ownership: Scene fundamentals helper extracted from App.jsx world setup logic.
import * as THREE from "three";
import { CAMERA_FEEDBACK, CONFIG } from "../config.js";

export function createSceneBasics({ mount, currentLevelConfig }) {
  const scene = new THREE.Scene();
  const activeCourse = currentLevelConfig.course ?? {};
  const activeTheme = currentLevelConfig.theme ?? {};
  const courseFloorLength = activeCourse.floorLength ?? CONFIG.floorLength;
  const courseFinishZ = activeCourse.finishLineZ ?? CONFIG.finishLineZ;
  const courseVisualEndZ = Math.min(-824, courseFinishZ - 32);
  const themeBackground = activeTheme.background ?? "#87c1ab";

  scene.background = new THREE.Color(themeBackground);
  scene.fog = new THREE.Fog(activeTheme.fog ?? themeBackground, 35, 160);

  const camera = new THREE.PerspectiveCamera(CAMERA_FEEDBACK.cameraFov, mount.clientWidth / Math.max(1, mount.clientHeight), 0.1, 360);
  camera.position.set(0, 8, 16);

  scene.add(new THREE.AmbientLight(activeTheme.ambient ?? "#ffffff", 0.9));
  const sun = new THREE.DirectionalLight(activeTheme.key ?? "#fff4e6", 2.2);
  sun.position.set(-8, 24, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -34;
  sun.shadow.camera.right = 34;
  sun.shadow.camera.top = 34;
  sun.shadow.camera.bottom = -34;
  scene.add(sun);

  if (activeTheme.moon) {
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(activeTheme.moon.radius ?? 3.8, 24, 24),
      new THREE.MeshBasicMaterial({ color: activeTheme.moon.color ?? "#ffffff", fog: false })
    );
    moon.position.set(activeTheme.moon.x ?? -22, activeTheme.moon.y ?? 23, activeTheme.moon.z ?? -88);
    scene.add(moon);

    const moonGlow = new THREE.PointLight(activeTheme.moon.glow ?? "#d9ccff", 0.9, 140, 2);
    moonGlow.position.copy(moon.position);
    scene.add(moonGlow);
  }

  return { scene, camera, sun, activeCourse, activeTheme, courseFloorLength, courseFinishZ, courseVisualEndZ };
}
