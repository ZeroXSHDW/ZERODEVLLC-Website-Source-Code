import * as THREE from "three";

interface TextureOptimizationOptions {
  maxSize?: number;
  format?: "webp" | "png" | "jpeg";
  quality?: number;
  generateMipmaps?: boolean;
  anisotropy?: number;
  compression?: "none" | "dxt" | "etc" | "astc";
  performanceMode?: boolean;
}

const DEFAULT_OPTIONS: TextureOptimizationOptions = {
  maxSize: 2048,
  format: "webp",
  quality: 0.8,
  generateMipmaps: true,
  anisotropy: 1,
  compression: "none",
  performanceMode: false,
};

// LRU cache for textures to prevent memory leaks
class TextureCache {
  private cache = new Map<string, THREE.Texture>();
  private accessOrder: string[] = [];
  private maxSize = 50;

  get(key: string): THREE.Texture | undefined {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      this.accessOrder.push(key);
      return this.cache.get(key);
    }
    return undefined;
  }

  set(key: string, texture: THREE.Texture): void {
    if (this.cache.has(key)) {
      // Update access order
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      this.accessOrder.push(key);
      return;
    }

    // Check if we need to evict
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) {
        const oldTexture = this.cache.get(oldestKey);
        if (oldTexture) {
          oldTexture.dispose(); // Clean up GPU memory
        }
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, texture);
    this.accessOrder.push(key);
  }

  clear(): void {
    // Dispose all textures before clearing
    this.cache.forEach((texture) => texture.dispose());
    this.cache.clear();
    this.accessOrder.length = 0;
  }
}

export class TextureOptimizer {
  private static textureCache = new TextureCache();

  static async optimizeTexture(
    image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
    options: TextureOptimizationOptions = {},
  ): Promise<THREE.Texture> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const cacheKey = this.generateCacheKey(image, opts);

    // Check cache first
    const cached = this.textureCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Create canvas for processing
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Unable to get 2D context");

    // Calculate optimal size
    let { width, height } = this.getImageDimensions(image);
    const maxSize = opts.performanceMode
      ? Math.min(opts.maxSize!, 1024)
      : opts.maxSize!;

    if (width > maxSize || height > maxSize) {
      const aspectRatio = width / height;
      if (width > height) {
        width = maxSize;
        height = maxSize / aspectRatio;
      } else {
        height = maxSize;
        width = maxSize * aspectRatio;
      }
    }

    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);

    // Draw and optimize
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Apply performance optimizations
    if (opts.performanceMode) {
      // Simple blur for distant textures
      ctx.filter = "blur(0.5px)";
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = "none";
    }

    // Create Three.js texture
    const texture = new THREE.Texture(canvas);

    // Apply texture settings
    texture.generateMipmaps = opts.generateMipmaps!;
    texture.minFilter = opts.generateMipmaps
      ? THREE.LinearMipmapLinearFilter
      : THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = opts.anisotropy!;
    texture.format = THREE.RGBAFormat;

    // Performance mode adjustments
    if (opts.performanceMode) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.anisotropy = 1;
    }

    texture.needsUpdate = true;

    // Cache the texture
    this.textureCache.set(cacheKey, texture);

    return texture;
  }

  static optimizeMaterial(
    material: THREE.Material,
    performanceMode: boolean = false,
  ): THREE.Material {
    if (performanceMode) {
      if (
        material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhysicalMaterial
      ) {
        // Simplify material properties for performance
        const optimizedMaterial = material.clone();

        // Reduce texture usage
        if (optimizedMaterial.normalMap) optimizedMaterial.normalMap = null;
        if (optimizedMaterial.roughnessMap)
          optimizedMaterial.roughnessMap = null;
        if (optimizedMaterial.metalnessMap)
          optimizedMaterial.metalnessMap = null;
        if (optimizedMaterial.aoMap) optimizedMaterial.aoMap = null;
        if (optimizedMaterial.emissiveMap) optimizedMaterial.emissiveMap = null;

        // Simplify shader calculations
        optimizedMaterial.metalness = Math.max(material.metalness, 0.1); // Avoid pure dielectrics
        optimizedMaterial.roughness = Math.min(material.roughness, 0.8); // Avoid perfect mirrors

        return optimizedMaterial;
      }
    }

    return material;
  }

  static compressGeometry(
    geometry: THREE.BufferGeometry,
    targetTriangles: number,
  ): THREE.BufferGeometry {
    // Simple geometry decimation for performance
    const positions = geometry.attributes.position;
    const indices = geometry.index;

    if (!indices || positions.count < targetTriangles * 3) {
      return geometry;
    }

    const originalTriangles = indices.count / 3;
    const samplingRate = Math.max(
      1,
      Math.floor(originalTriangles / targetTriangles),
    );
    const newIndices: number[] = [];

    for (let i = 0; i < originalTriangles; i += samplingRate) {
      const baseIndex = i * 3;
      if (baseIndex + 2 < indices.count) {
        newIndices.push(
          indices.getX(baseIndex),
          indices.getX(baseIndex + 1),
          indices.getX(baseIndex + 2),
        );
      }
    }

    const compressedGeometry = geometry.clone();
    compressedGeometry.setIndex(newIndices);

    return compressedGeometry;
  }

  static clearCache(): void {
    this.textureCache.clear();
  }

  private static getImageDimensions(
    image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  ): { width: number; height: number } {
    if (
      image instanceof HTMLImageElement ||
      image instanceof HTMLCanvasElement
    ) {
      return { width: image.width, height: image.height };
    }
    return { width: image.width, height: image.height };
  }

  private static generateCacheKey(
    image: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
    options: TextureOptimizationOptions,
  ): string {
    const dims = this.getImageDimensions(image);
    return `${dims.width}x${dims.height}_${JSON.stringify(options)}`;
  }
}

// WebGL capability detection for optimal settings
export function detectWebGLCapabilities(): {
  maxTextureSize: number;
  maxAnisotropy: number;
  compressedTextureFormats: string[];
} {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") ||
    (canvas.getContext("experimental-webgl") as WebGLRenderingContext);

  if (!gl) {
    return {
      maxTextureSize: 2048,
      maxAnisotropy: 1,
      compressedTextureFormats: [],
    };
  }

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : "";

  // Detect mobile GPUs and adjust accordingly
  const isMobile = /mali|adreno|powervr|vivante/i.test(renderer.toLowerCase());

  return {
    maxTextureSize: Math.min(
      gl.getParameter(gl.MAX_TEXTURE_SIZE),
      isMobile ? 2048 : 4096,
    ),
    maxAnisotropy: gl.getExtension("EXT_texture_filter_anisotropic")
      ? gl.getParameter(
          gl.getExtension("EXT_texture_filter_anisotropic")!
            .MAX_TEXTURE_MAX_ANISOTROPY_EXT,
        )
      : 1,
    compressedTextureFormats:
      gl
        .getSupportedExtensions()
        ?.filter(
          (ext) =>
            ext.includes("compressed") || ext.includes("texture_compression"),
        ) || [],
  };
}
