/**
 * Centralized memory management for Three.js resources
 * Handles cleanup of geometries, materials, textures, and models
 */

import * as THREE from "three";
import { log } from "./logger";

interface MemoryStats {
  geometries: number;
  textures: number;
  materials: number;
  programs: number;
  totalMemory: number;
}

class MemoryManager {
  private disposedResources = new Set<string>();
  private cleanupCallbacks: Array<() => void> = [];

  /**
   * Dispose of a Three.js object and all its resources
   */
  disposeObject(object: THREE.Object3D): void {
    if (!object) return;

    const uuid = object.uuid;
    if (this.disposedResources.has(uuid)) {
      return; // Already disposed
    }

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Dispose geometry
        if (child.geometry) {
          this.disposeGeometry(child.geometry);
        }

        // Dispose materials
        if (child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((material) => {
            this.disposeMaterial(material);
          });
        }
      }

      // Dispose lights
      if (child instanceof THREE.Light) {
        child.dispose();
      }

      // Dispose cameras
      if (child instanceof THREE.Camera) {
        // Cameras don't need explicit disposal, but we track them
      }
    });

    // Clear object
    if (object instanceof THREE.Group || object instanceof THREE.Scene) {
      while (object.children.length > 0) {
        object.remove(object.children[0]);
      }
    }

    this.disposedResources.add(uuid);
    log.debug("Disposed object:", uuid);
  }

  /**
   * Dispose of a geometry
   */
  disposeGeometry(geometry: THREE.BufferGeometry): void {
    if (!geometry) return;

    const uuid = geometry.uuid;
    if (this.disposedResources.has(uuid)) {
      return;
    }

    // Dispose attributes
    Object.values(geometry.attributes).forEach((attribute) => {
      if (attribute && "array" in attribute) {
        // Clear array reference to free memory

        (attribute as any).array = null;
      }
    });

    // Dispose index
    if (geometry.index && "array" in geometry.index) {
      (geometry.index as any).array = null;
    }

    geometry.dispose();
    this.disposedResources.add(uuid);
    log.debug("Disposed geometry:", uuid);
  }

  /**
   * Dispose of a material and its textures
   */
  disposeMaterial(material: THREE.Material): void {
    if (!material) return;

    const uuid = material.uuid;
    if (this.disposedResources.has(uuid)) {
      return;
    }

    // Dispose textures - use string keys since Material interface doesn't include all texture properties
    const textureKeys: string[] = [
      "map",
      "normalMap",
      "roughnessMap",
      "metalnessMap",
      "aoMap",
      "emissiveMap",
      "envMap",
      "lightMap",
      "bumpMap",
      "displacementMap",
      "alphaMap",
      "clearcoatMap",
      "clearcoatNormalMap",
      "clearcoatRoughnessMap",
      "sheenColorMap",
      "sheenRoughnessMap",
      "transmissionMap",
      "thicknessMap",
      "specularColorMap",
      "specularIntensityMap",
      "iridescenceMap",
      "iridescenceThicknessMap",
    ];

    textureKeys.forEach((key) => {
      const texture = (material as unknown as Record<string, unknown>)[key];
      if (texture instanceof THREE.Texture) {
        this.disposeTexture(texture);
      }
    });

    material.dispose();
    this.disposedResources.add(uuid);
    log.debug("Disposed material:", uuid);
  }

  /**
   * Dispose of a texture
   */
  disposeTexture(texture: THREE.Texture): void {
    if (!texture) return;

    const uuid = texture.uuid;
    if (this.disposedResources.has(uuid)) {
      return;
    }

    // Dispose image if it's a canvas or image element
    if (texture.image) {
      if (texture.image instanceof HTMLImageElement) {
        texture.image.src = "";
      } else if (texture.image instanceof HTMLCanvasElement) {
        const ctx = texture.image.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, texture.image.width, texture.image.height);
        }
      } else if (texture.image instanceof ImageBitmap) {
        texture.image.close();
      }
    }

    texture.dispose();
    this.disposedResources.add(uuid);
    log.debug("Disposed texture:", uuid);
  }

  /**
   * Clear WebGL renderer resources
   */
  clearRenderer(renderer: THREE.WebGLRenderer): void {
    if (!renderer) return;

    // Dispose of all programs if possible
    try {
      // renderer.info.programs is more reliable than internal programs record
      if (renderer.info && renderer.info.programs) {
        // Unfortunately three.js doesn't provide a public way to delete all programs
        // but we can at least reset the renderer which helps
      }
    } catch (e) {
      log.warn("Failed to clear some renderer resources:", e);
    }

    // Clear renderer info
    renderer.info.reset();
    log.debug("Cleared renderer resources");
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats(renderer?: THREE.WebGLRenderer): MemoryStats {
    const stats: MemoryStats = {
      geometries: 0,
      textures: 0,
      materials: 0,
      programs: 0,
      totalMemory: 0,
    };

    if (renderer && renderer.info) {
      const info = renderer.info;
      stats.geometries = info.memory.geometries;
      stats.textures = info.memory.textures;
      stats.programs = info.programs?.length || 0;
      stats.totalMemory = stats.geometries + stats.textures;
    }

    return stats;
  }

  /**
   * Force garbage collection (if available)
   */
  forceGC(): void {
    const globalGC = (global as unknown as { gc?: () => void }).gc;
    const windowGC = (window as unknown as { gc?: () => void }).gc;

    if (typeof globalGC === "function") {
      globalGC();
      log.debug("Forced garbage collection");
    } else if (typeof windowGC === "function") {
      windowGC();
      log.debug("Forced garbage collection");
    }
  }

  /**
   * Register a cleanup callback
   */
  registerCleanup(callback: () => void): () => void {
    this.cleanupCallbacks.push(callback);
    return () => {
      const index = this.cleanupCallbacks.indexOf(callback);
      if (index > -1) {
        this.cleanupCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Run all cleanup callbacks
   */
  cleanup(): void {
    this.cleanupCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        log.error("Cleanup callback error:", error);
      }
    });
    this.cleanupCallbacks = [];
  }

  /**
   * Clear all disposed resource tracking
   */
  reset(): void {
    this.disposedResources.clear();
    this.cleanup();
  }

  /**
   * Get count of disposed resources
   */
  getDisposedCount(): number {
    return this.disposedResources.size;
  }
}

export const memoryManager = new MemoryManager();
