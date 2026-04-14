/**
 * Instancing Utilities
 * Optimizes rendering of repeated objects using instancing
 */

import * as THREE from 'three';
import { log } from './logger';

interface InstancingOptions {
  maxInstances?: number;
  enableFrustumCulling?: boolean;
}

/**
 * Create an instanced mesh from a base geometry
 */
export function createInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  count: number,
  options: InstancingOptions = {}
): THREE.InstancedMesh {
  const {
    maxInstances = 1000,
    enableFrustumCulling = true,
  } = options;

  const instanceCount = Math.min(count, maxInstances);
  const instancedMesh = new THREE.InstancedMesh(geometry, material, instanceCount);

  // Set up instance matrices
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < instanceCount; i++) {
    matrix.identity();
    instancedMesh.setMatrixAt(i, matrix);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;

  // Enable frustum culling if requested
  if (enableFrustumCulling) {
    instancedMesh.frustumCulled = true;
  }

  log.debug(`Created instanced mesh with ${instanceCount} instances`);

  return instancedMesh;
}

/**
 * Update instance transforms
 */
export function updateInstanceTransforms(
  instancedMesh: THREE.InstancedMesh,
  transforms: Array<{ position?: [number, number, number]; rotation?: [number, number, number]; scale?: [number, number, number] }>
): void {
  const matrix = new THREE.Matrix4();
  const count = Math.min(transforms.length, instancedMesh.count);

  for (let i = 0; i < count; i++) {
    const transform = transforms[i];
    matrix.identity();

    if (transform.position) {
      matrix.setPosition(...transform.position);
    }
    if (transform.rotation) {
      matrix.makeRotationFromEuler(new THREE.Euler(...transform.rotation));
    }
    if (transform.scale) {
      matrix.scale(new THREE.Vector3(...transform.scale));
    }

    instancedMesh.setMatrixAt(i, matrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
}

/**
 * Optimize scene by converting repeated meshes to instanced meshes
 */
export function optimizeSceneWithInstancing(
  scene: THREE.Scene,
  threshold: number = 5 // Minimum number of identical meshes to instance
): void {
  const meshGroups = new Map<string, THREE.Mesh[]>();

  // Group identical meshes
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh && object.geometry && object.material) {
      const key = `${object.geometry.uuid}_${object.material instanceof THREE.Material ? object.material.uuid : 'multi'}`;
      
      if (!meshGroups.has(key)) {
        meshGroups.set(key, []);
      }
      meshGroups.get(key)!.push(object);
    }
  });

      // Convert groups with enough meshes to instanced meshes
      meshGroups.forEach((meshes, key) => {
        if (meshes.length >= threshold) {
          const firstMesh = meshes[0];
          const geometry = firstMesh.geometry;
          const material = firstMesh.material instanceof THREE.Material ? firstMesh.material : firstMesh.material[0];

          // Create instanced mesh
          const instancedMesh = createInstancedMesh(geometry, material, meshes.length);

          // Use world matrices for instancing to handle different parents
          meshes.forEach((mesh, i) => {
            mesh.updateMatrixWorld();
            instancedMesh.setMatrixAt(i, mesh.matrixWorld);
          });
          instancedMesh.instanceMatrix.needsUpdate = true;

          // Add to the scene root or a common parent to maintain world positions
          scene.add(instancedMesh);
          
          // Hide original meshes instead of removing to maintain scene structure if needed,
          // but for optimization, removing is better. Let's remove but be careful.
          meshes.forEach(mesh => {
            if (mesh.parent) mesh.parent.remove(mesh);
          });

          log.debug(`Optimized ${meshes.length} meshes into instanced mesh (key: ${key})`);
        }
      });
}

