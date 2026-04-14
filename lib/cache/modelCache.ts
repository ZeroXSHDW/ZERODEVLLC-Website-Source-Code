import * as THREE from 'three';

interface CachedModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
  timestamp: number;
}

interface CacheStats {
  totalModels: number;
  hitRate: number;
  hits: number;
  misses: number;
}

class ModelCache {
  private cache = new Map<string, CachedModel>();
  private accessOrder: string[] = [];
  private maxSize: number;
  private maxAge: number;
  private hits = 0;
  private misses = 0;

  constructor(maxSize: number = 10, maxAgeHours: number = 1) {
    this.maxSize = maxSize; // Maximum number of models to cache
    this.maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds
  }

  set(key: string, model: Omit<CachedModel, 'timestamp'>): void {
    // Remove from access order if already exists
    const existingIndex = this.accessOrder.indexOf(key);
    if (existingIndex > -1) {
      this.accessOrder.splice(existingIndex, 1);
    }

    // Evict oldest entries if cache is full
    while (this.cache.size >= this.maxSize) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    // Add new entry
    this.cache.set(key, {
      ...model,
      timestamp: Date.now(),
    });
    this.accessOrder.push(key);
  }

  get(key: string): CachedModel | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      this.misses++;
      return null;
    }

    // Move to end (most recently used)
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(key);
    }

    this.hits++;
    return entry;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && (Date.now() - entry.timestamp) <= this.maxAge;
  }

  delete(key: string): void {
    this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder.length = 0;
    this.hits = 0;
    this.misses = 0;
  }

  getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    return {
      totalModels: this.cache.size,
      hitRate: totalRequests > 0 ? this.hits / totalRequests : 0,
      hits: this.hits,
      misses: this.misses,
    };
  }

  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    // Use Array.from to avoid iterator issues
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > this.maxAge) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
    });
  }
}

// Create and export a singleton instance
const modelCache = new ModelCache(10, 1); // Cache up to 10 models for 1 hour

export { modelCache };
export type { CachedModel, CacheStats };