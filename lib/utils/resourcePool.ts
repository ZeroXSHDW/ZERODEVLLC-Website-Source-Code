/**
 * Resource Pool for Three.js objects
 * Reuses geometries, materials, and textures to reduce memory allocation
 */

import * as THREE from 'three';
import { log } from './logger';

interface PoolConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
}

class ResourcePool<T extends THREE.Object3D | THREE.BufferGeometry | THREE.Material | THREE.Texture> {
  private pool: T[] = [];
  private inUse: Set<T> = new Set();
  private config: PoolConfig;
  private timestamps: Map<T, number> = new Map();

  constructor(config: PoolConfig = { maxSize: 50, ttl: 300000 }) {
    this.config = config;
  }

  /**
   * Acquire an object from the pool or create a new one
   */
  acquire(createFn: () => T): T {
    // Try to reuse an object from the pool
    const available = this.pool.find(obj => !this.inUse.has(obj));
    
    if (available) {
      this.pool = this.pool.filter(obj => obj !== available);
      this.inUse.add(available);
      this.timestamps.set(available, Date.now());
      return available;
    }

    // Create new object if pool is empty
    const newObj = createFn();
    this.inUse.add(newObj);
    this.timestamps.set(newObj, Date.now());
    return newObj;
  }

  /**
   * Release an object back to the pool
   */
  release(obj: T): void {
    if (!this.inUse.has(obj)) {
      return; // Already released
    }

    this.inUse.delete(obj);

    // Clean up object before returning to pool
    if (obj instanceof THREE.BufferGeometry) {
      // Reset geometry (keep data but mark as reusable)
      obj.dispose();
      return; // Don't pool disposed geometries
    }

    if (obj instanceof THREE.Material) {
      // Reset material properties
      obj.needsUpdate = true;
    }

    // Add to pool if not full
    if (this.pool.length < this.config.maxSize) {
      this.pool.push(obj);
      this.timestamps.set(obj, Date.now());
    } else {
      // Pool is full, dispose oldest object
      this.cleanup();
      this.pool.push(obj);
      this.timestamps.set(obj, Date.now());
    }
  }

  /**
   * Clean up old objects from the pool
   */
  cleanup(): void {
    const now = Date.now();
    const toRemove: T[] = [];

    this.pool.forEach(obj => {
      const timestamp = this.timestamps.get(obj);
      if (timestamp && now - timestamp > this.config.ttl) {
        toRemove.push(obj);
      }
    });

    toRemove.forEach(obj => {
      this.pool = this.pool.filter(o => o !== obj);
      this.timestamps.delete(obj);
      
      // Dispose object
      if (obj instanceof THREE.BufferGeometry) {
        obj.dispose();
      } else if (obj instanceof THREE.Material) {
        obj.dispose();
      } else if (obj instanceof THREE.Texture) {
        obj.dispose();
      }
    });

    if (toRemove.length > 0) {
      log.debug(`Cleaned up ${toRemove.length} objects from resource pool`);
    }
  }

  /**
   * Clear the entire pool
   */
  clear(): void {
    this.pool.forEach(obj => {
      if (obj instanceof THREE.BufferGeometry) {
        obj.dispose();
      } else if (obj instanceof THREE.Material) {
        obj.dispose();
      } else if (obj instanceof THREE.Texture) {
        obj.dispose();
      }
    });

    this.pool = [];
    this.inUse.clear();
    this.timestamps.clear();
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      poolSize: this.pool.length,
      inUse: this.inUse.size,
      total: this.pool.length + this.inUse.size,
    };
  }
}

// Singleton pools for different resource types
export const geometryPool = new ResourcePool<THREE.BufferGeometry>({
  maxSize: 30,
  ttl: 300000, // 5 minutes
});

export const materialPool = new ResourcePool<THREE.Material>({
  maxSize: 50,
  ttl: 300000,
});

export const texturePool = new ResourcePool<THREE.Texture>({
  maxSize: 20,
  ttl: 600000, // 10 minutes (textures are more expensive)
});

// Periodic cleanup
if (typeof window !== 'undefined') {
  setInterval(() => {
    geometryPool.cleanup();
    materialPool.cleanup();
    texturePool.cleanup();
  }, 60000); // Clean up every minute
}

