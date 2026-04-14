"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Triangle, Box, FileText, Image, Zap, Layers, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';
import * as THREE from 'three';

interface ModelInfoProps {
  isOpen: boolean;
  onClose: () => void;
  scene: THREE.Object3D; // GLTF scene object
  fileName?: string;
  fileSize?: number;
  animations?: THREE.AnimationClip[]; // Animation clips
  loadTime?: number; // Load time in milliseconds
}

export function ModelInfo({ isOpen, onClose, scene, fileName, fileSize, animations, loadTime }: ModelInfoProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'geometry' | 'materials' | 'hierarchy'>('overview');

  const modelStats = useMemo(() => {
    if (!scene) return null;

    let vertexCount = 0;
    let triangleCount = 0;
    let meshCount = 0;
    let materialCount = 0;
    let textureCount = 0;
    let textureMemory = 0;
    const textures = new Set<string>();
    const materials: Array<{name: string, type: string, properties: Record<string, unknown>}> = [];
    const hierarchy: Array<{name: string, type: string, children: number, level: number}> = [];
    const boundingBox = {
      min: { x: Infinity, y: Infinity, z: Infinity },
      max: { x: -Infinity, y: -Infinity, z: -Infinity },
    };

    const traverseScene = (object: THREE.Object3D, level = 0) => {
      // Add to hierarchy
      hierarchy.push({
        name: object.name || `Object_${object.id}`,
        type: object.type,
        children: object.children.length,
        level
      });

      if (object instanceof THREE.Mesh) {
        meshCount++;

        // Count vertices and triangles
        if (object.geometry) {
          if (object.geometry.attributes.position) {
            vertexCount += object.geometry.attributes.position.count;
          }
          if (object.geometry.index) {
            triangleCount += object.geometry.index.count / 3;
          } else if (object.geometry.attributes.position) {
            triangleCount += object.geometry.attributes.position.count / 3;
          }
        }

        // Calculate bounding box
        if (object.geometry?.boundingBox) {
          boundingBox.min.x = Math.min(boundingBox.min.x, object.geometry.boundingBox.min.x);
          boundingBox.min.y = Math.min(boundingBox.min.y, object.geometry.boundingBox.min.y);
          boundingBox.min.z = Math.min(boundingBox.min.z, object.geometry.boundingBox.min.z);
          boundingBox.max.x = Math.max(boundingBox.max.x, object.geometry.boundingBox.max.x);
          boundingBox.max.y = Math.max(boundingBox.max.y, object.geometry.boundingBox.max.y);
          boundingBox.max.z = Math.max(boundingBox.max.z, object.geometry.boundingBox.max.z);
        }

        // Count materials and textures
        if (object.material) {
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
          materialCount += objectMaterials.length;

          objectMaterials.forEach((material: THREE.Material) => {
            // Collect material information
            const baseProperties = {
              transparent: material.transparent,
              opacity: material.opacity,
              side: material.side === THREE.FrontSide ? 'Front' : material.side === THREE.BackSide ? 'Back' : 'Double',
            };

            let properties: Record<string, unknown> = baseProperties;

            // Add material-specific properties
            if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
              properties = {
                ...baseProperties,
                color: material.color.getHexString(),
                roughness: material.roughness,
                metalness: material.metalness,
                emissive: material.emissive.getHexString(),
              };
            }

            const materialInfo = {
              name: material.name || `Material_${Math.random().toString(36).substr(2, 9)}`,
              type: material.type,
              properties,
            };

            materials.push(materialInfo);

            // Check for textures in material
            ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap'].forEach((textureType) => {
              const texture = (material as THREE.Material & Record<string, THREE.Texture | null>)[textureType];
              if (texture && texture instanceof THREE.Texture) {
                const textureId = `${textureType}_${texture.uuid}`;
                if (!textures.has(textureId)) {
                  textures.add(textureId);
                  textureCount++;

                  // Estimate texture memory usage
                  let width = 512; // Default fallback
                  let height = 512; // Default fallback
                  try {
                    if (texture.image && typeof texture.image === 'object') {
                      const img = texture.image as { width?: number; height?: number };
                      if (img.width) width = img.width;
                      if (img.height) height = img.height;
                    }
                  } catch {
                    // Keep defaults
                  }
                  const bytesPerPixel = 4; // RGBA
                  textureMemory += width * height * bytesPerPixel;
                }
              }
            });
          });
        }
      }

      // Traverse children
      object.children.forEach(child => traverseScene(child, level + 1));
    };

    traverseScene(scene);

    const dimensions = {
      width: boundingBox.max.x - boundingBox.min.x,
      height: boundingBox.max.y - boundingBox.min.y,
      depth: boundingBox.max.z - boundingBox.min.z,
    };

    // Calculate volume and surface area (approximate)
    const volume = dimensions.width * dimensions.height * dimensions.depth;
    const surfaceArea = 2 * (dimensions.width * dimensions.height + dimensions.width * dimensions.depth + dimensions.height * dimensions.depth);

    // Performance rating based on triangle count
    let performanceRating = 'Excellent';
    if (triangleCount > 100000) performanceRating = 'Poor';
    else if (triangleCount > 50000) performanceRating = 'Fair';
    else if (triangleCount > 25000) performanceRating = 'Good';

    return {
      vertexCount,
      triangleCount: Math.floor(triangleCount),
      meshCount,
      materialCount,
      textureCount,
      textureMemory,
      dimensions,
      boundingBox,
      volume,
      surfaceArea,
      performanceRating,
      animationsCount: animations?.length || 0,
      loadTime,
      materials,
      hierarchy,
    };
  }, [scene, animations, loadTime]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  if (!modelStats) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 max-w-md w-full mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">Model Information</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-4">
              <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Info },
                  { id: 'geometry', label: 'Geometry', icon: Triangle },
                  { id: 'materials', label: 'Materials', icon: Settings },
                  { id: 'hierarchy', label: 'Hierarchy', icon: Layers },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as typeof activeTab)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      activeTab === id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {activeTab === 'overview' && (
                <>
                  {/* File Info */}
                  {fileName && (
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-white">File</span>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>Name: {fileName}</div>
                        {fileSize && <div>Size: {formatFileSize(fileSize)}</div>}
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <Triangle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-white">{formatNumber(modelStats.triangleCount)}</div>
                      <div className="text-xs text-gray-400">Triangles</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <Box className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-white">{modelStats.meshCount}</div>
                      <div className="text-xs text-gray-400">Meshes</div>
                    </div>
                  </div>

                  {/* Performance Rating */}
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">Performance Rating</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold ${
                        modelStats.performanceRating === 'Excellent' ? 'text-green-400' :
                        modelStats.performanceRating === 'Good' ? 'text-blue-400' :
                        modelStats.performanceRating === 'Fair' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>{modelStats.performanceRating}</span>
                      {modelStats.loadTime && (
                        <span className="text-sm text-gray-400">{modelStats.loadTime}ms load time</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'geometry' && (
                <>
                  {/* Detailed Geometry Stats */}
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Triangle className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Geometry Statistics</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400 mb-1">Vertices</div>
                        <div className="text-white font-mono">{formatNumber(modelStats.vertexCount)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Triangles</div>
                        <div className="text-white font-mono">{formatNumber(modelStats.triangleCount)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Meshes</div>
                        <div className="text-white font-mono">{modelStats.meshCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Materials</div>
                        <div className="text-white font-mono">{modelStats.materialCount}</div>
                      </div>
                    </div>
                  </div>

                  {/* Dimensions & Volume */}
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Box className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-white">Dimensions & Volume</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-gray-400 text-xs mb-1">Dimensions (W×H×D)</div>
                        <div className="text-white font-mono text-sm">
                          {modelStats.dimensions.width.toFixed(2)} × {modelStats.dimensions.height.toFixed(2)} × {modelStats.dimensions.depth.toFixed(2)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-400 text-xs mb-1">Volume</div>
                          <div className="text-white font-mono text-sm">{modelStats.volume.toFixed(2)} units³</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs mb-1">Surface Area</div>
                          <div className="text-white font-mono text-sm">{modelStats.surfaceArea.toFixed(2)} units²</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Textures */}
                  {modelStats.textureCount > 0 && (
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-3">
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image className="w-4 h-4 text-orange-400" aria-hidden="true" />
                        <span className="text-sm font-medium text-white">Textures</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400 mb-1">Count</div>
                          <div className="text-white font-mono">{modelStats.textureCount}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">Memory Usage</div>
                          <div className="text-white font-mono">{formatFileSize(modelStats.textureMemory)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-3">
                  {modelStats.materials.length > 0 ? (
                    modelStats.materials.map((material, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-white">{material.name}</span>
                          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                            {material.type}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(material.properties).map(([key, value]) => (
                            <div key={key} className="text-gray-400">
                              {key}: <span className="text-white">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                      <Settings className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <div className="text-gray-400">No materials found</div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'hierarchy' && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-white">Scene Hierarchy</span>
                  </div>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {modelStats.hierarchy.slice(0, 50).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs py-1 px-2 rounded hover:bg-gray-700"
                        style={{ paddingLeft: `${item.level * 16 + 8}px` }}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          item.type === 'Mesh' ? 'bg-green-400' :
                          item.type === 'Group' ? 'bg-blue-400' :
                          'bg-gray-400'
                        }`} />
                        <span className="text-gray-300 truncate">{item.name}</span>
                        <span className="text-gray-500 ml-auto">({item.children})</span>
                      </div>
                    ))}
                    {modelStats.hierarchy.length > 50 && (
                      <div className="text-xs text-gray-500 text-center py-2">
                        ... and {modelStats.hierarchy.length - 50} more objects
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
