import * as THREE from 'three';

interface GPUCapabilities {
  maxTextureSize: number;
  maxRenderbufferSize: number;
  extensions: string[];
  precision: {
    vertex: string;
    fragment: string;
  };
}

export class GPUAccelerator {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private capabilities: GPUCapabilities;

  constructor(canvas?: HTMLCanvasElement) {
    const testCanvas = canvas || document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');

    if (!gl) {
      throw new Error('WebGL not supported');
    }

    this.gl = gl;
    this.capabilities = this.detectCapabilities();
  }

  private detectCapabilities(): GPUCapabilities {
    const gl = this.gl;
    // Check for debug extension but don't store it
    gl.getExtension('WEBGL_debug_renderer_info');

    return {
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      extensions: gl.getSupportedExtensions() || [],
      precision: {
        vertex: this.getPrecision('vertex'),
        fragment: this.getPrecision('fragment'),
      },
    };
  }

  private getPrecision(shaderType: 'vertex' | 'fragment'): string {
    const gl = this.gl;
    const type = shaderType === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;

    if (gl.getShaderPrecisionFormat) {
      const precision = gl.getShaderPrecisionFormat(type, gl.HIGH_FLOAT);
      if (precision && precision.precision > 0) return 'highp';

      const mediumPrecision = gl.getShaderPrecisionFormat(type, gl.MEDIUM_FLOAT);
      if (mediumPrecision && mediumPrecision.precision > 0) return 'mediump';
    }

    return 'lowp';
  }

  // GPU-accelerated texture compression
  async compressTexture(
    texture: THREE.Texture,
    _format: 'astc' | 'etc' | 'dxt' | 'fallback' = 'fallback'
  ): Promise<THREE.Texture> {
    // GPU texture compression not fully implemented yet
    // Return original texture for now
    return texture;
  }

  private getSupportedCompressionFormat(format: string): string | null {
    const extensions = this.capabilities.extensions;

    switch (format) {
      case 'astc':
        if (extensions.includes('WEBGL_compressed_texture_astc')) {
          return 'astc';
        }
        break;
      case 'etc':
        if (extensions.includes('WEBGL_compressed_texture_etc') ||
            extensions.includes('WEBGL_compressed_texture_etc1')) {
          return 'etc';
        }
        break;
      case 'dxt':
        if (extensions.includes('WEBGL_compressed_texture_s3tc') ||
            extensions.includes('WEBKIT_WEBGL_compressed_texture_pvrtc')) {
          return 'dxt';
        }
        break;
    }

    return 'fallback';
  }


  // GPU-accelerated geometry processing
  async processGeometry(geometry: THREE.BufferGeometry, _operation: string): Promise<THREE.BufferGeometry> {
    // This would use WebGL compute shaders or transform feedback
    // For now, return the original geometry
    return geometry;
  }

  // Check if GPU acceleration is available and beneficial
  static isAccelerationAvailable(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      return !!gl;
    } catch {
      return false;
    }
  }

  static shouldUseAcceleration(modelSize: number, deviceMemory: number): boolean {
    // Use GPU acceleration for large models on capable devices
    const minModelSize = 100000; // triangles
    const minMemory = 1024 * 1024 * 1024; // 1GB

    return modelSize > minModelSize && deviceMemory > minMemory;
  }

  dispose(): void {
    // Clean up WebGL resources
    // Dispose of any created textures/buffers
    // Note: gl is stored in this.gl, no need for local variable
  }
}

// WebGL shader utilities for compute operations (WebGL2 only)
// Note: Removed for compatibility with WebGL1

// Performance monitoring for GPU operations
export class GPUMonitor {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private queryExt: any;

  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    this.gl = gl;
    this.queryExt = gl.getExtension('EXT_disjoint_timer_query_webgl2') ||
                   gl.getExtension('EXT_disjoint_timer_query');
  }

  beginQuery(): void {
    if (this.queryExt) {
      // Start timing GPU operations
    }
  }

  endQuery(): Promise<number> {
    return new Promise((resolve) => {
      if (this.queryExt) {
        // Wait for GPU operation to complete and get timing
        resolve(0); // Placeholder
      } else {
        resolve(0);
      }
    });
  }

  getMemoryInfo(): { used: number; available: number } {
    // Get GPU memory information if available
    return { used: 0, available: 0 }; // Placeholder
  }
}
