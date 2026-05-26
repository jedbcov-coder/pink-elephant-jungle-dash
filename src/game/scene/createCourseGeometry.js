// Ownership: Course mesh construction helper extracted from App.jsx track setup logic.
import * as THREE from "three";
import { CONFIG } from "../config.js";
import { makeMaterial } from "../rendering/materials.js";
import { trackAngle, trackCenter } from "../track.js";

export function createTrackRibbonGeometry(innerLocalX, outerLocalX, startZ = 14, endZ = -824, step = 3.2) {
  const vertices = [];
  const uvs = [];
  const indices = [];
  const rows = Math.floor((startZ - endZ) / step) + 1;

  for (let i = 0; i <= rows; i++) {
    const z = Math.max(endZ, startZ - i * step);
    const angle = trackAngle(z);
    const normalX = Math.cos(angle);
    const centerX = trackCenter(z);
    vertices.push(centerX + innerLocalX * normalX, 0, z, centerX + outerLocalX * normalX, 0, z);
    uvs.push(0, i * 0.18, 1, i * 0.18);
    if (i < rows) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createCourseGeometry({ scene, textures, courseVisualEndZ }) {
  const pathGroup = new THREE.Group();
  scene.add(pathGroup);
  const pathMat = makeMaterial("#b87938", { map: textures.pathCracks, normalMap: textures.pathCrackNormal, normalScale: [0.32, 0.32], roughness: 0.95 });
  const shoulderMat = makeMaterial("#6f4a27", { roughness: 1 });
  const bankMat = makeMaterial("#174026", { roughness: 1 });
  const lipMat = makeMaterial("#d5a25b", { roughness: 0.92 });
  const safeHalfWidth = CONFIG.corridorHalfWidth + 0.62;
  const pathSurface = new THREE.Mesh(createTrackRibbonGeometry(-safeHalfWidth, safeHalfWidth, 14, courseVisualEndZ, 3.2), pathMat);
  pathSurface.position.y = 0.055;
  pathSurface.receiveShadow = true;
  pathGroup.add(pathSurface);

  [
    [-safeHalfWidth - 0.86, -safeHalfWidth, shoulderMat, 0.045],
    [safeHalfWidth, safeHalfWidth + 0.86, shoulderMat, 0.045],
    [-safeHalfWidth - 1.22, -safeHalfWidth - 0.86, bankMat, 0.16],
    [safeHalfWidth + 0.86, safeHalfWidth + 1.22, bankMat, 0.16],
    [-safeHalfWidth - 0.12, -safeHalfWidth + 0.08, lipMat, 0.105],
    [safeHalfWidth - 0.08, safeHalfWidth + 0.12, lipMat, 0.105],
  ].forEach(([inner, outer, material, y]) => {
    const ribbon = new THREE.Mesh(createTrackRibbonGeometry(inner, outer, 14, courseVisualEndZ, 3.2), material);
    ribbon.position.y = y;
    ribbon.receiveShadow = true;
    pathGroup.add(ribbon);
  });

  return { pathGroup, courseVisualEndZ, pathSurface };
}
