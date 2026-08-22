import { useRef, useCallback, useEffect } from "react";

interface WorkerTask {
  id: string;
  type: "simplify_mesh" | "optimize_texture";
  data: unknown;
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
}

export function useGeometryWorker() {
  const workerRef = useRef<Worker | null>(null);
  const tasksRef = useRef<Map<string, WorkerTask>>(new Map());
  const nextIdRef = useRef(0);

  useEffect(() => {
    // Create worker
    workerRef.current = new Worker("/workers/geometryWorker.js");

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { data, id, error } = e.data;
      const task = tasksRef.current.get(id);

      if (task) {
        if (error) {
          task.reject(new Error(error));
        } else {
          task.resolve(data);
        }
        tasksRef.current.delete(id);
      }
    };

    workerRef.current.onerror = (_error) => {
      // Reject all pending tasks on worker error
      tasksRef.current.forEach((task) => {
        task.reject(new Error("Worker error"));
      });
      tasksRef.current.clear();
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const postTask = useCallback(
    <T>(type: WorkerTask["type"], data: unknown): Promise<T> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error("Worker not available"));
          return;
        }

        const id = `task_${nextIdRef.current++}`;
        const task: WorkerTask = {
          id,
          type,
          data,
          resolve: resolve as (result: unknown) => void,
          reject,
        };

        tasksRef.current.set(id, task);

        workerRef.current.postMessage({
          type,
          data,
          id,
        });
      });
    },
    [],
  );

  const simplifyMesh = useCallback(
    async (
      positions: Float32Array,
      indices: Uint32Array,
      targetTriangleCount: number,
    ) => {
      return postTask("simplify_mesh", {
        positions,
        indices,
        targetTriangleCount,
      });
    },
    [postTask],
  );

  const optimizeTexture = useCallback(
    async (
      imageData: ImageData,
      options: {
        maxSize: number;
        quality: number;
        performanceMode: boolean;
      },
    ) => {
      return postTask("optimize_texture", {
        imageData,
        options,
      });
    },
    [postTask],
  );

  return {
    simplifyMesh,
    optimizeTexture,
    isSupported: typeof Worker !== "undefined",
  };
}
