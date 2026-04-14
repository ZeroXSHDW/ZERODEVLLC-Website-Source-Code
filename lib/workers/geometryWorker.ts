// Web Worker for geometry processing
// This runs in a separate thread to prevent blocking the main UI

export interface GeometryWorkerMessage {
  type: 'process_geometry' | 'optimize_texture' | 'simplify_mesh';
  data: unknown;
  id: string;
}

export interface GeometryWorkerResponse {
  type: 'geometry_processed' | 'texture_optimized' | 'mesh_simplified' | 'error';
  data: unknown;
  id: string;
  error?: string;
}

// Geometry simplification using quadratic error metrics approximation
export function simplifyMesh(
  positions: Float32Array,
  indices: Uint32Array,
  targetTriangleCount: number
): { positions: Float32Array; indices: Uint32Array } {
  // Simple vertex clustering approach for performance
  const vertexCount = positions.length / 3;
  const triangleCount = indices.length / 3;

  if (triangleCount <= targetTriangleCount) {
    return { positions, indices };
  }

  // Calculate grid size for clustering
  getBounds(positions); // Calculate bounds but don't store
  const gridSize = Math.cbrt(vertexCount / targetTriangleCount) * 0.1;

  // Create vertex clusters
  const clusters = new Map<string, number[]>();
  const vertexToCluster = new Array(vertexCount);

  for (let i = 0; i < vertexCount; i++) {
    const x = Math.floor(positions[i * 3] / gridSize);
    const y = Math.floor(positions[i * 3 + 1] / gridSize);
    const z = Math.floor(positions[i * 3 + 2] / gridSize);
    const key = `${x},${y},${z}`;

    if (!clusters.has(key)) {
      clusters.set(key, []);
    }
    clusters.get(key)!.push(i);
    vertexToCluster[i] = key;
  }

  // Create new vertices (centroids of clusters)
  const newPositions: number[] = [];
  const clusterToNewVertex = new Map<string, number>();

  for (const [key, vertexIndices] of Array.from(clusters)) {
    const centroid = [0, 0, 0];
    for (const vertexIndex of vertexIndices) {
      centroid[0] += positions[vertexIndex * 3];
      centroid[1] += positions[vertexIndex * 3 + 1];
      centroid[2] += positions[vertexIndex * 3 + 2];
    }
    centroid[0] /= vertexIndices.length;
    centroid[1] /= vertexIndices.length;
    centroid[2] /= vertexIndices.length;

    newPositions.push(...centroid);
    clusterToNewVertex.set(key, newPositions.length / 3 - 1);
  }

  // Remap triangles to use new vertices
  const newIndices: number[] = [];
  const usedTriangles = Math.floor(targetTriangleCount);

  for (let i = 0; i < Math.min(triangleCount, usedTriangles); i++) {
    const i0 = indices[i * 3];
    const i1 = indices[i * 3 + 1];
    const i2 = indices[i * 3 + 2];

    const c0 = vertexToCluster[i0];
    const c1 = vertexToCluster[i1];
    const c2 = vertexToCluster[i2];

    const newI0 = clusterToNewVertex.get(c0)!;
    const newI1 = clusterToNewVertex.get(c1)!;
    const newI2 = clusterToNewVertex.get(c2)!;

    // Skip degenerate triangles
    if (newI0 !== newI1 && newI1 !== newI2 && newI2 !== newI0) {
      newIndices.push(newI0, newI1, newI2);
    }
  }

  return {
    positions: new Float32Array(newPositions),
    indices: new Uint32Array(newIndices),
  };
}

function getBounds(positions: Float32Array): { min: [number, number, number]; max: [number, number, number] } {
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];

  for (let i = 0; i < positions.length; i += 3) {
    min[0] = Math.min(min[0], positions[i]);
    min[1] = Math.min(min[1], positions[i + 1]);
    min[2] = Math.min(min[2], positions[i + 2]);

    max[0] = Math.max(max[0], positions[i]);
    max[1] = Math.max(max[1], positions[i + 1]);
    max[2] = Math.max(max[2], positions[i + 2]);
  }

  return { min, max };
}

// Texture optimization worker function
export function optimizeTexture(
  imageData: ImageData,
  options: {
    maxSize: number;
    quality: number;
    performanceMode: boolean;
  }
): ImageData {
  const { maxSize, performanceMode } = options;

  // Create canvas for processing
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to get 2D context');

  // Put image data
  ctx.putImageData(imageData, 0, 0);

  // Resize if needed
  let { width, height } = { width: imageData.width, height: imageData.height };

  if (width > maxSize || height > maxSize) {
    const aspectRatio = width / height;
    if (width > height) {
      width = maxSize;
      height = maxSize / aspectRatio;
    } else {
      height = maxSize;
      width = maxSize * aspectRatio;
    }

    const resizedCanvas = new OffscreenCanvas(width, height);
    const resizedCtx = resizedCanvas.getContext('2d');
    if (resizedCtx) {
      resizedCtx.drawImage(canvas, 0, 0, width, height);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(resizedCanvas, 0, 0);
    }
  }

  // Apply performance optimizations
  if (performanceMode) {
    // Simple downsampling for distant textures
    const downsampledCanvas = new OffscreenCanvas(width / 2, height / 2);
    const downsampledCtx = downsampledCanvas.getContext('2d');
    if (downsampledCtx) {
      downsampledCtx.drawImage(canvas, 0, 0, width / 2, height / 2);
      return downsampledCtx.getImageData(0, 0, width / 2, height / 2);
    }
  }

  return ctx.getImageData(0, 0, width, height);
}

// Worker message handler
self.onmessage = (e: MessageEvent<GeometryWorkerMessage>) => {
  const { type, data, id } = e.data;

  try {
    let result: unknown;

    switch (type) {
      case 'process_geometry':
        result = data; // Pass through for now
        break;

      case 'simplify_mesh': {
        const d = data as { positions: Float32Array; indices: Uint32Array; targetTriangleCount: number };
        result = simplifyMesh(d.positions, d.indices, d.targetTriangleCount);
        break;
      }

      case 'optimize_texture': {
        const d = data as { imageData: ImageData; options: { maxSize: number; quality: number; performanceMode: boolean } };
        result = optimizeTexture(d.imageData, d.options);
        break;
      }

      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    const response: GeometryWorkerResponse = {
      type: type === 'process_geometry' ? 'geometry_processed' :
            type === 'simplify_mesh' ? 'mesh_simplified' :
            'texture_optimized',
      data: result,
      id,
    };

    self.postMessage(response);
  } catch (error) {
    const response: GeometryWorkerResponse = {
      type: 'error',
      data: null,
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    self.postMessage(response);
  }
};
