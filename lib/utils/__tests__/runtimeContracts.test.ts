import { renderHook } from "@testing-library/react";
import * as THREE from "three";

import { useStableCallback } from "@/lib/hooks/useStableCallback";
import { modelCache } from "@/lib/cache/modelCache";
import { ErrorHandler, type ModelError } from "@/lib/utils/errorHandler";
import {
  ErrorRecoveryManager,
  type RecoveryStrategy,
} from "@/lib/utils/errorRecovery";
import {
  loadStrategy,
  createPerformanceAwareLoader,
} from "@/lib/utils/bundleSplitting";
import { GeometryOptimizer } from "@/lib/utils/geometryOptimizer";
import { FrustumCuller } from "@/lib/utils/frustumCulling";
import { PerformanceAnalytics } from "@/lib/utils/performanceAnalytics";
import { geometryPool, materialPool } from "@/lib/utils/resourcePool";
import {
  TextureOptimizer,
  detectWebGLCapabilities,
} from "@/lib/utils/textureOptimizer";

function createModel() {
  return { scene: new THREE.Group(), animations: [] };
}

describe("core runtime contracts", () => {
  beforeEach(() => {
    modelCache.clear();
    geometryPool.clear();
    materialPool.clear();
    TextureOptimizer.clearCache();
    jest.restoreAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  describe("model cache", () => {
    it("tracks hits, misses, LRU eviction, and expiry", () => {
      expect(modelCache.get("missing")).toBeNull();

      modelCache.set("first", createModel());
      expect(modelCache.has("first")).toBe(true);
      expect(modelCache.get("first")?.scene).toBeInstanceOf(THREE.Group);

      for (let index = 0; index < 10; index += 1) {
        modelCache.set(`model-${index}`, createModel());
      }
      modelCache.set("newest", createModel());
      expect(modelCache.has("first")).toBe(false);

      const stats = modelCache.getStats();
      expect(stats.totalModels).toBe(10);
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBeCloseTo(1 / 2);
    });

    it("expires entries after their configured age and supports deletion", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
      modelCache.set("expiring", createModel());

      jest.advanceTimersByTime(60 * 60 * 1000 + 1);
      expect(modelCache.get("expiring")).toBeNull();
      modelCache.set("deletable", createModel());
      modelCache.delete("deletable");
      expect(modelCache.has("deletable")).toBe(false);
      jest.useRealTimers();
    });
  });

  describe("error classification and recovery", () => {
    it.each([
      ["network timeout", "network", true],
      ["out of memory", "memory", false],
      ["invalid model", "parse", false],
      ["load aborted", "load", true],
      ["WebGL context lost", "render", false],
      ["unexpected failure", "load", true],
    ])("classifies %s safely", (message, type, recoverable) => {
      const classified = ErrorHandler.classifyError(new Error(message));
      expect(classified.type).toBe(type);
      expect(classified.recoverable).toBe(recoverable);
      expect(classified.originalError).toBeInstanceOf(Error);
    });

    it("returns a user-facing contract for every model error type", () => {
      const types: ModelError["type"][] = [
        "network",
        "memory",
        "parse",
        "render",
        "load",
      ];

      for (const type of types) {
        const message = ErrorHandler.getErrorMessage({
          type,
          message: "failure",
          recoverable: type === "network" || type === "load",
        });
        expect(message.title).toBeTruthy();
        expect(message.message).toBeTruthy();
        expect(message.action).toBeTruthy();
      }
    });

    it("retries only when the condition permits and stops at the bound", async () => {
      const operation = jest
        .fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error("network unavailable"))
        .mockRejectedValueOnce(new Error("network unavailable"))
        .mockResolvedValue("ok");

      await expect(
        ErrorHandler.withRetry(operation, {
          maxRetries: 2,
          baseDelay: 0,
          retryCondition: (error) => error.message.includes("network"),
        }),
      ).resolves.toBe("ok");
      expect(operation).toHaveBeenCalledTimes(3);

      const noRetry = jest
        .fn<() => Promise<string>>()
        .mockRejectedValue(new Error("bad"));
      await expect(
        ErrorHandler.withRetry(noRetry, {
          maxRetries: 3,
          baseDelay: 0,
          retryCondition: () => false,
        }),
      ).rejects.toThrow("bad");
      expect(noRetry).toHaveBeenCalledTimes(1);
    });

    it("opens a circuit after repeated failures and recovers after the timeout", async () => {
      const key = `test-circuit-${Date.now()}`;
      const failing = jest
        .fn<() => Promise<string>>()
        .mockRejectedValue(new Error("down"));
      const options = {
        failureThreshold: 2,
        recoveryTimeout: 0,
        monitoringPeriod: 1,
      };

      await expect(
        ErrorHandler.withCircuitBreaker(key, failing, options),
      ).rejects.toThrow("down");
      await expect(
        ErrorHandler.withCircuitBreaker(key, failing, options),
      ).rejects.toThrow("down");
      await expect(
        ErrorHandler.withCircuitBreaker(key, failing, options),
      ).rejects.toThrow("Circuit breaker is open");

      await expect(
        ErrorHandler.withCircuitBreaker(
          key,
          jest.fn().mockResolvedValue("recovered"),
          options,
        ),
      ).resolves.toBe("recovered");
    });

    it("tries recovery strategies by priority and records failed attempts", async () => {
      const manager = new ErrorRecoveryManager();
      const error: ModelError = {
        type: "network",
        message: "temporary",
        recoverable: true,
      };
      const failed: RecoveryStrategy = {
        priority: 10,
        canRecover: () => true,
        recover: async () => {
          throw new Error("still unavailable");
        },
      };
      const successful: RecoveryStrategy = {
        priority: 1,
        canRecover: () => true,
        recover: async () => undefined,
      };

      manager.registerStrategy(successful);
      manager.registerStrategy(failed);
      await expect(manager.attemptRecovery(error)).resolves.toBe(true);
      expect(manager.getHistory()).toHaveLength(2);
      expect(manager.getHistory().map((entry) => entry.success)).toEqual([
        false,
        true,
      ]);

      manager.clearHistory();
      expect(manager.getHistory()).toEqual([]);
    });
  });

  describe("performance and resource lifecycles", () => {
    it("records, returns, sends, and clears performance metrics", async () => {
      const analytics = new PerformanceAnalytics();
      const fetchMock = jest
        .fn()
        .mockResolvedValue(new Response(null, { status: 204 }));
      global.fetch = fetchMock;

      analytics.recordMetric("frameRate", 60);
      analytics.recordMetrics({ drawCalls: 4, triangles: 12 } as never);
      expect(analytics.getLatestMetrics()).toEqual(
        expect.objectContaining({ frameRate: 60, drawCalls: 4, triangles: 12 }),
      );
      expect(analytics.getAllMetrics()).toHaveLength(1);

      analytics.sendToAnalytics("https://metrics.example.test/collect");
      expect(fetchMock).toHaveBeenCalledWith(
        "https://metrics.example.test/collect",
        expect.objectContaining({ method: "POST" }),
      );
      analytics.clear();
      expect(analytics.getLatestMetrics()).toBeNull();
      analytics.disconnect();
    });

    it("reuses materials, disposes geometries, and clears pooled resources", () => {
      const material = new THREE.MeshBasicMaterial();
      const materialDispose = jest.spyOn(material, "dispose");
      const acquiredMaterial = materialPool.acquire(() => material);
      materialPool.release(acquiredMaterial);
      expect(materialPool.getStats()).toEqual({
        poolSize: 1,
        inUse: 0,
        total: 1,
      });
      expect(materialPool.acquire(() => new THREE.MeshBasicMaterial())).toBe(
        material,
      );

      const geometry = new THREE.BoxGeometry();
      const dispose = jest.spyOn(geometry, "dispose");
      const acquiredGeometry = geometryPool.acquire(() => geometry);
      geometryPool.release(acquiredGeometry);
      expect(dispose).toHaveBeenCalled();
      expect(geometryPool.getStats()).toEqual({
        poolSize: 0,
        inUse: 0,
        total: 0,
      });

      materialPool.release(material);
      materialPool.clear();
      expect(materialDispose).toHaveBeenCalled();
    });
  });

  describe("geometry, frustum, and texture optimization", () => {
    it("instances compatible meshes and retains regular meshes below the threshold", () => {
      const group = new THREE.Group();
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: "#ffffff" });
      for (let index = 0; index < 3; index += 1) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = index;
        group.add(mesh);
      }
      group.updateMatrixWorld(true);

      const optimized = GeometryOptimizer.optimizeScene(group, {
        minInstances: 3,
      });
      expect(optimized.instancedGeometries).toHaveLength(1);
      expect(optimized.instancedGeometries[0].count).toBe(3);
      expect(optimized.memorySaved).toBeGreaterThan(0);

      const regular = GeometryOptimizer.optimizeScene(group, {
        minInstances: 4,
      });
      expect(regular.regularMeshes).toHaveLength(3);
      expect(regular.optimizedTriangleCount).toBe(
        regular.originalTriangleCount,
      );
    });

    it("applies adaptive LOD and strips unused geometry attributes", () => {
      const material = new THREE.MeshStandardMaterial();
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(), material);
      const camera = new THREE.PerspectiveCamera();
      camera.position.set(0, 0, 30);
      GeometryOptimizer.applyAdaptiveLOD(mesh, camera);
      expect(material.normalMap).toBeNull();
      expect(material.aoMap).toBeNull();

      camera.position.z = 100;
      GeometryOptimizer.applyAdaptiveLOD(mesh, camera);
      expect(mesh.visible).toBe(false);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([0, 0, 0], 3),
      );
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute([1, 0, 0], 3),
      );
      const optimized = GeometryOptimizer.optimizeGeometry(geometry);
      expect(optimized.getAttribute("color")).toBeUndefined();
      expect(optimized.boundingSphere).not.toBeNull();
      expect(optimized.boundingBox).not.toBeNull();
    });

    it("culls outside meshes while preserving original visibility for reset", () => {
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
      camera.position.z = 5;
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld(true);
      const scene = new THREE.Scene();
      const visible = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial(),
      );
      const outside = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial(),
      );
      outside.position.x = 100;
      const hidden = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial(),
      );
      hidden.visible = false;
      scene.add(visible, outside, hidden);
      scene.updateMatrixWorld(true);

      const culler = new FrustumCuller();
      culler.cullScene(scene, camera);
      expect(culler.getStats()).toEqual(
        expect.objectContaining({
          totalObjects: 3,
          culledObjects: 2,
          visibleObjects: 1,
        }),
      );
      expect(outside.visible).toBe(false);
      culler.resetVisibility(scene);
      expect(outside.visible).toBe(true);
      expect(hidden.visible).toBe(false);
    });

    it("optimizes materials and indexed geometry while handling missing WebGL", async () => {
      const source = new THREE.MeshStandardMaterial({
        metalness: 0,
        roughness: 1,
      });
      const sourceTexture = new THREE.Texture();
      source.normalMap = sourceTexture;
      const optimizedMaterial = TextureOptimizer.optimizeMaterial(
        source,
        true,
      ) as THREE.MeshStandardMaterial;
      expect(optimizedMaterial).not.toBe(source);
      expect(optimizedMaterial.normalMap).toBeNull();
      expect(optimizedMaterial.metalness).toBe(0.1);
      expect(optimizedMaterial.roughness).toBe(0.8);

      const geometry = new THREE.BoxGeometry();
      const compressed = TextureOptimizer.compressGeometry(geometry, 4);
      expect(compressed.index?.count).toBeLessThan(geometry.index?.count ?? 0);

      const image = document.createElement("img");
      image.width = 4096;
      image.height = 2048;
      const texture = await TextureOptimizer.optimizeTexture(image, {
        maxSize: 2048,
        performanceMode: true,
      });
      expect(texture.image.width).toBe(1024);
      expect(texture.image.height).toBe(512);
      await expect(
        TextureOptimizer.optimizeTexture(image, {
          maxSize: 2048,
          performanceMode: true,
        }),
      ).resolves.toBe(texture);

      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
        configurable: true,
        value: jest.fn().mockReturnValue(null),
      });
      expect(detectWebGLCapabilities()).toEqual({
        maxTextureSize: 2048,
        maxAnisotropy: 1,
        compressedTextureFormats: [],
      });
      Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
        configurable: true,
        value: originalGetContext,
      });
    });
  });

  describe("bundle loading fallbacks", () => {
    it("loads immediately and preserves successful prioritized imports", async () => {
      const first = jest.fn().mockResolvedValue("first");
      const second = jest.fn().mockResolvedValue("second");
      await expect(loadStrategy.immediate([first, second])).resolves.toEqual([
        "first",
        "second",
      ]);

      const failed = jest
        .fn()
        .mockRejectedValue(new Error("optional feature unavailable"));
      await expect(
        loadStrategy.prioritized([
          { import: second, priority: 2 },
          { import: failed, priority: 1 },
          { import: first, priority: 3 },
        ]),
      ).resolves.toEqual(["second", "first"]);
    });

    it("returns settled results and uses a bounded fallback loader", async () => {
      const results = await loadStrategy.networkAware([
        () => Promise.resolve("ok"),
        () => Promise.reject(new Error("offline")),
      ]);
      expect(results).toEqual([
        { status: "fulfilled", value: "ok" },
        { status: "rejected", reason: expect.any(Error) },
      ]);

      const fallback = createPerformanceAwareLoader(
        () => Promise.reject(new Error("timeout")),
        { retries: 0, fallback: "safe" },
      );
      await expect(fallback()).resolves.toBe("safe");
    });

    it("keeps the stable callback identity while using the latest callback", () => {
      const calls: string[] = [];
      const first = renderHook(
        ({ value }) => useStableCallback(() => calls.push(value)),
        {
          initialProps: { value: "first" },
        },
      );
      const stable = first.result.current;
      stable();
      first.rerender({ value: "second" });
      expect(first.result.current).toBe(stable);
      first.result.current();
      expect(calls).toEqual(["first", "second"]);
    });
  });
});
