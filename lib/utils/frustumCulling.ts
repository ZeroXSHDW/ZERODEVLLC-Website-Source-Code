/**
 * Advanced Frustum Culling System
 * Optimizes rendering by culling objects outside the camera's view
 */

import * as THREE from 'three';

interface CullingStats {
  totalObjects: number;
  culledObjects: number;
  visibleObjects: number;
  cullingTime: number;
}

export class FrustumCuller {
  private frustum = new THREE.Frustum();
  private matrix = new THREE.Matrix4();
  private stats: CullingStats = {
    totalObjects: 0,
    culledObjects: 0,
    visibleObjects: 0,
    cullingTime: 0,
  };

  /**
   * Update frustum from camera
   */
  updateFromCamera(camera: THREE.Camera): void {
    this.matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.matrix);
  }

  /**
   * Check if object is visible
   */
  isVisible(object: THREE.Object3D): boolean {
    // Fast bounding sphere check first
    if (object instanceof THREE.Mesh && object.geometry) {
      const boundingSphere = new THREE.Sphere();
      object.geometry.computeBoundingSphere();
      boundingSphere.copy(object.geometry.boundingSphere!);
      boundingSphere.applyMatrix4(object.matrixWorld);

      if (!this.frustum.intersectsSphere(boundingSphere)) {
        return false;
      }
    }

    // More precise bounding box check
    const box = new THREE.Box3();
    box.setFromObject(object);
    return this.frustum.intersectsBox(box);
  }

  /**
   * Cull objects in a scene
   */
  cullScene(scene: THREE.Scene, camera: THREE.Camera): void {
    const startTime = performance.now();
    this.updateFromCamera(camera);

    let total = 0;
    let culled = 0;

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Light || object instanceof THREE.Camera) {
        total++;
        
        // Store original visibility if not already stored
        if (object.userData.originalVisible === undefined) {
          object.userData.originalVisible = object.visible;
        }

        // If the object was originally invisible, it stays invisible
        if (object.userData.originalVisible === false) {
          culled++;
          return;
        }

        // Check visibility against frustum
        if (!this.isVisible(object)) {
          object.visible = false;
          culled++;
        } else {
          object.visible = true;
        }
      }
    });

    this.stats = {
      totalObjects: total,
      culledObjects: culled,
      visibleObjects: total - culled,
      cullingTime: performance.now() - startTime,
    };
  }

  /**
   * Get culling statistics
   */
  getStats(): CullingStats {
    return { ...this.stats };
  }

  /**
   * Reset all objects to visible
   */
  resetVisibility(scene: THREE.Scene): void {
    scene.traverse((object) => {
      if (object.userData.originalVisible !== undefined) {
        object.visible = object.userData.originalVisible;
      }
    });
  }
}

// Singleton instance
export const frustumCuller = new FrustumCuller();

