import { memoryManager } from '../memoryManager';
import * as THREE from 'three';

describe('MemoryManager', () => {
  beforeEach(() => {
    memoryManager.reset();
  });

  describe('disposeObject', () => {
    it('should dispose a simple mesh', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial();
      const mesh = new THREE.Mesh(geometry, material);

      expect(() => memoryManager.disposeObject(mesh)).not.toThrow();
    });

    it('should dispose a group with children', () => {
      const group = new THREE.Group();
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);

      expect(() => memoryManager.disposeObject(group)).not.toThrow();
    });

    it('should not dispose the same object twice', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial();
      const mesh = new THREE.Mesh(geometry, material);

      memoryManager.disposeObject(mesh);
      const disposedCount1 = memoryManager.getDisposedCount();

      memoryManager.disposeObject(mesh);
      const disposedCount2 = memoryManager.getDisposedCount();

      expect(disposedCount2).toBe(disposedCount1);
    });
  });

  describe('disposeGeometry', () => {
    it('should dispose a geometry', () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      expect(() => memoryManager.disposeGeometry(geometry)).not.toThrow();
    });
  });

  describe('disposeMaterial', () => {
    it('should dispose a material', () => {
      const material = new THREE.MeshStandardMaterial();
      expect(() => memoryManager.disposeMaterial(material)).not.toThrow();
    });

    it('should dispose material textures', () => {
      const texture = new THREE.Texture();
      const material = new THREE.MeshStandardMaterial({ map: texture });
      expect(() => memoryManager.disposeMaterial(material)).not.toThrow();
    });
  });

  describe('disposeTexture', () => {
    it('should dispose a texture', () => {
      const texture = new THREE.Texture();
      expect(() => memoryManager.disposeTexture(texture)).not.toThrow();
    });
  });

  describe('getMemoryStats', () => {
    it('should return memory statistics', () => {
      const renderer = new THREE.WebGLRenderer();
      const stats = memoryManager.getMemoryStats(renderer);

      expect(stats).toHaveProperty('geometries');
      expect(stats).toHaveProperty('textures');
      expect(stats).toHaveProperty('materials');
      expect(stats).toHaveProperty('programs');
      expect(stats).toHaveProperty('totalMemory');

      renderer.dispose();
    });
  });

  describe('cleanup callbacks', () => {
    it('should register and call cleanup callbacks', () => {
      const callback = jest.fn();
      const unregister = memoryManager.registerCleanup(callback);

      memoryManager.cleanup();
      expect(callback).toHaveBeenCalledTimes(1);

      unregister();
      memoryManager.cleanup();
      expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });
});

