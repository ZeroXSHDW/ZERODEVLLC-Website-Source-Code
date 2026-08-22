import * as THREE from "three";

interface InstancedGeometry {
  geometry: THREE.BufferGeometry;
  matrices: THREE.Matrix4[];
  count: number;
  material: THREE.Material;
}

interface OptimizationResult {
  instancedGeometries: InstancedGeometry[];
  regularMeshes: THREE.Mesh[];
  originalTriangleCount: number;
  optimizedTriangleCount: number;
  memorySaved: number;
}

export class GeometryOptimizer {
  private static geometryCache = new Map<string, THREE.InstancedMesh>();

  /**
   * Analyzes a scene and optimizes geometries by detecting repeated objects
   * and applying instancing where beneficial
   */
  static optimizeScene(
    scene: THREE.Group,
    options: {
      enableInstancing?: boolean;
      minInstances?: number;
      enableFrustumCulling?: boolean;
    } = {},
  ): OptimizationResult {
    const {
      enableInstancing = true,
      minInstances = 3,
      enableFrustumCulling = true,
    } = options;

    const result: OptimizationResult = {
      instancedGeometries: [],
      regularMeshes: [],
      originalTriangleCount: 0,
      optimizedTriangleCount: 0,
      memorySaved: 0,
    };

    // Collect all meshes in the scene
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
        const geometry = child.geometry;
        if (geometry.index) {
          result.originalTriangleCount += geometry.index.count / 3;
        } else {
          result.originalTriangleCount +=
            geometry.attributes.position.count / 3;
        }
      }
    });

    if (!enableInstancing || meshes.length < minInstances) {
      result.regularMeshes = meshes;
      result.optimizedTriangleCount = result.originalTriangleCount;
      return result;
    }

    // Group meshes by geometry and material similarity
    const geometryGroups = new Map<string, THREE.Mesh[]>();

    meshes.forEach((mesh) => {
      const key = this.generateGeometryKey(mesh);
      if (!geometryGroups.has(key)) {
        geometryGroups.set(key, []);
      }
      geometryGroups.get(key)!.push(mesh);
    });

    // Process each group
    geometryGroups.forEach((groupMeshes, _key) => {
      if (groupMeshes.length >= minInstances) {
        // Create instanced geometry
        const instancedGeometry = this.createInstancedGeometry(groupMeshes);
        if (instancedGeometry) {
          result.instancedGeometries.push(instancedGeometry);
          result.optimizedTriangleCount += instancedGeometry.geometry.index
            ? instancedGeometry.geometry.index.count / 3
            : instancedGeometry.geometry.attributes.position.count / 3;

          // Calculate memory savings (approximate)
          const instancesSaved = groupMeshes.length - 1;
          const triangleCount = instancedGeometry.geometry.index
            ? instancedGeometry.geometry.index.count / 3
            : instancedGeometry.geometry.attributes.position.count / 3;
          result.memorySaved += instancesSaved * triangleCount * 4; // Rough estimate
        }
      } else {
        // Keep as regular meshes
        result.regularMeshes.push(...groupMeshes);
        groupMeshes.forEach((mesh) => {
          const geometry = mesh.geometry;
          const triangleCount = geometry.index
            ? geometry.index.count / 3
            : geometry.attributes.position.count / 3;
          result.optimizedTriangleCount += triangleCount;
        });
      }
    });

    // Enable frustum culling for all meshes
    if (enableFrustumCulling) {
      result.regularMeshes.forEach((mesh) => {
        mesh.frustumCulled = true;
      });

      result.instancedGeometries.forEach((instanced) => {
        // InstancedMesh inherits frustumCulling from base mesh
        if (instanced.geometry.userData.baseMesh) {
          (instanced.geometry.userData.baseMesh as THREE.Mesh).frustumCulled =
            true;
        }
      });
    }

    return result;
  }

  /**
   * Creates an instanced geometry from a group of similar meshes
   */
  private static createInstancedGeometry(
    meshes: THREE.Mesh[],
  ): InstancedGeometry | null {
    if (meshes.length < 2) return null;

    const baseMesh = meshes[0];
    const matrices: THREE.Matrix4[] = [];

    // Check if all meshes have compatible materials
    const baseMaterial = baseMesh.material;

    // Only support instancing for single materials, not arrays
    if (Array.isArray(baseMaterial)) return null;

    const allCompatible = meshes.every((mesh) => {
      const meshMaterial = mesh.material;
      // Only support single materials for instancing
      return (
        !Array.isArray(meshMaterial) &&
        this.areMaterialsCompatible(baseMaterial, meshMaterial)
      );
    });

    if (!allCompatible) return null;

    // Collect transformation matrices
    meshes.forEach((mesh) => {
      const matrix = new THREE.Matrix4();
      matrix.copy(mesh.matrixWorld);
      matrices.push(matrix);
    });

    return {
      geometry: baseMesh.geometry,
      matrices,
      count: matrices.length,
      material: baseMaterial,
    };
  }

  /**
   * Generates a unique key for geometry comparison
   */
  private static generateGeometryKey(mesh: THREE.Mesh): string {
    const geometry = mesh.geometry;
    const material = mesh.material;

    // Simple geometry hash based on vertex count and bounds
    const vertexCount = geometry.attributes.position?.count || 0;
    const bounds = new THREE.Box3().setFromObject(mesh);
    const size = bounds.getSize(new THREE.Vector3());

    // Material hash (simplified)
    const materialKey =
      material instanceof THREE.Material ? material.uuid : "unknown";

    return `${vertexCount}_${size.x.toFixed(2)}_${size.y.toFixed(2)}_${size.z.toFixed(2)}_${materialKey}`;
  }

  /**
   * Checks if two materials are compatible for instancing
   */
  private static areMaterialsCompatible(
    mat1: THREE.Material,
    mat2: THREE.Material,
  ): boolean {
    if (mat1.type !== mat2.type) return false;

    // For basic materials, check essential properties
    if (
      mat1 instanceof THREE.MeshStandardMaterial &&
      mat2 instanceof THREE.MeshStandardMaterial
    ) {
      return (
        mat1.color.equals(mat2.color) &&
        mat1.roughness === mat2.roughness &&
        mat1.metalness === mat2.metalness
      );
    }

    if (
      mat1 instanceof THREE.MeshBasicMaterial &&
      mat2 instanceof THREE.MeshBasicMaterial
    ) {
      return mat1.color.equals(mat2.color);
    }

    return false;
  }

  /**
   * Applies level-of-detail based on camera distance
   */
  static applyAdaptiveLOD(
    object: THREE.Object3D,
    camera: THREE.Camera,
    lodDistances: number[] = [10, 25, 50],
  ): void {
    const distance = camera.position.distanceTo(object.position);

    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Adjust material quality based on distance
        if (child.material instanceof THREE.MeshStandardMaterial) {
          if (distance > lodDistances[2]) {
            // Far: Disable expensive features
            child.material.normalMap = null;
            child.material.roughnessMap = null;
            child.material.metalnessMap = null;
            child.material.aoMap = null;
            child.visible = distance < lodDistances[2] * 2; // Hide very far objects
          } else if (distance > lodDistances[1]) {
            // Medium: Reduce texture quality
            child.material.normalMap = null;
            child.material.aoMap = null;
          }
          // Near: Full quality (no changes)
        }
      }
    });
  }

  /**
   * Optimizes geometry by removing unnecessary data and compressing
   */
  static optimizeGeometry(
    geometry: THREE.BufferGeometry,
  ): THREE.BufferGeometry {
    let optimized = geometry.clone();

    // Remove unused attributes
    const usedAttributes = ["position", "normal", "uv", "index"];
    Object.keys(optimized.attributes).forEach((attr) => {
      if (!usedAttributes.includes(attr)) {
        delete optimized.attributes[attr];
      }
    });

    // Merge vertices if beneficial
    if (optimized.attributes.position && !optimized.index) {
      optimized = optimized.toNonIndexed();
    }

    // Compute bounding box/sphere for frustum culling
    optimized.computeBoundingBox();
    optimized.computeBoundingSphere();

    return optimized;
  }

  /**
   * Clears the geometry cache to free memory
   */
  static clearCache(): void {
    this.geometryCache.forEach((instancedMesh) => {
      instancedMesh.dispose();
    });
    this.geometryCache.clear();
  }
}
