// Ownership: Shared geometry/material pool helper extracted from App.jsx resource setup logic.
import * as THREE from "three";

export function createSharedResources({ scene, createBroadBananaLeafGeometry, createMossClumpGeometry, createLargeForegroundRockGeometry, createRuinBlockClusterGeometry }) {
  const particlePool = [];
  const popPools = new Map();
  const pooledParticleGeometry = new THREE.SphereGeometry(1, 8, 8);
  const sharedGeometries = {
    treeTrunk: new THREE.CylinderGeometry(0.22, 0.38, 1, 7),
    treeLeaves: new THREE.DodecahedronGeometry(1, 0),
    bushClump: new THREE.DodecahedronGeometry(1, 0),
    canopy: new THREE.DodecahedronGeometry(1, 0),
    fruit: new THREE.SphereGeometry(0.36, 20, 16),
    fruitLobe: new THREE.SphereGeometry(0.22, 16, 12),
    fruitLeaf: new THREE.ConeGeometry(0.1, 0.24, 6),
    fruitStem: new THREE.CylinderGeometry(0.018, 0.02, 0.16, 5),
    unitBox: new THREE.BoxGeometry(1, 1, 1),
    cane: new THREE.CylinderGeometry(0.1, 0.13, 1.45, 12),
    caneNode: new THREE.TorusGeometry(0.14, 0.026, 8, 14),
    caneLeaf: new THREE.ConeGeometry(0.08, 0.34, 6),
    caneFrond: new THREE.CylinderGeometry(0.018, 0.045, 0.44, 6),
    monkeyBody: new THREE.SphereGeometry(0.72, 14, 10),
    monkeyHead: new THREE.SphereGeometry(0.52, 14, 10),
    monkeyEar: new THREE.SphereGeometry(0.24, 10, 8),
    monkeyMuzzle: new THREE.SphereGeometry(0.24, 10, 8),
    monkeyEye: new THREE.SphereGeometry(0.11, 10, 8),
    monkeyTailSegment: new THREE.CylinderGeometry(0.065, 0.075, 0.44, 8),
    monkeySpike: new THREE.ConeGeometry(0.14, 0.45, 5),
    pineappleBody: new THREE.SphereGeometry(0.38, 16, 14),
    pineappleScale: new THREE.ConeGeometry(0.065, 0.11, 4),
    pineappleLeaf: new THREE.ConeGeometry(0.075, 0.3, 6),
    cueLeaf: new THREE.DodecahedronGeometry(1, 0),
    cueRipple: new THREE.TorusGeometry(1, 0.035, 5, 14),
    cueGlint: new THREE.OctahedronGeometry(0.18, 0),
    edgeStone: new THREE.DodecahedronGeometry(0.42, 0),
    edgeFlower: new THREE.SphereGeometry(0.16, 8, 6),
    edgeStem: new THREE.CylinderGeometry(0.035, 0.045, 0.5, 5),
    edgeTorchPost: new THREE.CylinderGeometry(0.055, 0.075, 1.0, 6),
    edgeTorchFlame: new THREE.ConeGeometry(0.18, 0.42, 7),
    broadBananaLeaf: createBroadBananaLeafGeometry(),
    hangingVine: new THREE.CylinderGeometry(0.026, 0.044, 1, 6),
    mossClump: createMossClumpGeometry(),
    foregroundRock: createLargeForegroundRockGeometry(),
    ruinBlockCluster: createRuinBlockClusterGeometry(),
    jungleBaseMist: new THREE.CircleGeometry(1, 18),
    telegraphArrow: new THREE.ConeGeometry(0.38, 0.82, 3),
  };
  const sharedTreeGeometries = {
    trunk: sharedGeometries.treeTrunk,
    leaves: sharedGeometries.treeLeaves,
    bushClump: sharedGeometries.bushClump,
    broadLeaf: sharedGeometries.broadBananaLeaf,
    vine: sharedGeometries.hangingVine,
    baseMist: sharedGeometries.jungleBaseMist,
  };

  for (let i = 0; i < 96; i++) {
    const mesh = new THREE.Mesh(
      pooledParticleGeometry,
      new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0, depthWrite: false }),
    );
    mesh.visible = false;
    mesh.frustumCulled = false;
    scene.add(mesh);
    particlePool.push({ mesh, active: false, life: 0, startLife: 1, vx: 0, vy: 0, vz: 0 });
  }

  return { particlePool, popPools, pooledParticleGeometry, sharedGeometries, sharedTreeGeometries };
}
