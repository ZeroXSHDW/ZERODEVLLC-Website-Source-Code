import { ServiceWorkerCache } from "@/lib/cache/serviceWorkerCache";

function createResponse(contentType = "model/gltf-binary"): Response {
  const response = {
    ok: true,
    type: "basic",
    redirected: false,
    headers: {
      has: jest.fn().mockReturnValue(false),
      get: jest.fn((name: string) =>
        name === "content-type" ? contentType : null,
      ),
    },
    clone: jest.fn(),
  } as unknown as Response;
  response.clone = jest.fn().mockReturnValue(response);
  return response;
}

describe("ServiceWorkerCache security boundaries", () => {
  let manager: ServiceWorkerCache;
  let cache: {
    add: jest.Mock;
    put: jest.Mock;
    match: jest.Mock;
    keys: jest.Mock;
  };
  let cachesApi: {
    open: jest.Mock;
    keys: jest.Mock;
    delete: jest.Mock;
  };
  let serviceWorker: {
    getRegistration: jest.Mock;
    register: jest.Mock;
    addEventListener: jest.Mock;
    controller: null;
  };
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    manager = new ServiceWorkerCache();
    cache = {
      add: jest.fn().mockResolvedValue(undefined),
      put: jest.fn().mockResolvedValue(undefined),
      match: jest.fn().mockResolvedValue(null),
      keys: jest.fn().mockResolvedValue([]),
    };
    cachesApi = {
      open: jest.fn().mockResolvedValue(cache),
      keys: jest
        .fn()
        .mockResolvedValue([
          "zerodevllc-sw-static-v2",
          "zerodevllc-sw-models-v2",
          "another-app-cache",
        ]),
      delete: jest.fn().mockResolvedValue(true),
    };
    serviceWorker = {
      getRegistration: jest.fn().mockResolvedValue({
        scope: "http://localhost/",
        installing: null,
        addEventListener: jest.fn(),
      }),
      register: jest.fn(),
      addEventListener: jest.fn(),
      controller: null,
    };

    Object.defineProperty(globalThis, "caches", {
      configurable: true,
      value: cachesApi,
    });
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: serviceWorker,
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("refuses unmanaged cache names and cross-origin model URLs", async () => {
    await expect(manager.openCache("another-app-cache")).rejects.toThrow(
      "unmanaged cache",
    );

    await manager.cacheModel(
      "https://attacker.example/model.glb",
      createResponse(),
    );
    await manager.cacheModel(
      "/model.glb?token=should-not-persist",
      createResponse(),
    );

    expect(cachesApi.open).not.toHaveBeenCalled();
  });

  it("caches only validated same-origin models and omits credentials when prefetching", async () => {
    const response = createResponse();
    global.fetch = jest.fn().mockResolvedValue(response);

    await manager.cacheModel("/model.glb", response);
    await manager.prefetchResources([
      "/model.glb",
      "https://attacker.example/model.glb",
      "/model.glb?token=should-not-persist",
    ]);

    expect(cache.put).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith("/model.glb", {
      cache: "no-store",
      credentials: "omit",
    });
  });

  it("pre-caches known public assets without requiring the page shell", async () => {
    await manager.cacheStaticAssets();

    expect(cache.add).toHaveBeenCalledWith("/manifest.json");
    expect(cache.add).toHaveBeenCalledWith("/robots.txt");
    expect(cache.add).not.toHaveBeenCalledWith("/");
  });

  it("reuses an existing root registration and scopes cache statistics and cleanup", async () => {
    await manager.register();
    await manager.register();
    expect(serviceWorker.getRegistration).toHaveBeenCalledWith("/");
    expect(serviceWorker.register).not.toHaveBeenCalled();

    cache.keys.mockResolvedValue([{ url: "/model.glb" } as Request]);
    await expect(manager.getCacheStats()).resolves.toEqual({
      staticCache: 1,
      modelCache: 1,
      textureCache: 0,
      total: 2,
    });

    await manager.clearAllCaches();
    expect(cachesApi.delete).toHaveBeenCalledTimes(2);
    expect(cachesApi.delete).not.toHaveBeenCalledWith("another-app-cache");
  });

  it("does not persist arbitrary offline request data", async () => {
    localStorage.setItem("existing-preference", "keep-me");

    await manager.queueRequest("/api/private", {
      method: "POST",
      headers: { Authorization: "Bearer secret" },
      body: "sensitive body",
    });

    expect(localStorage.getItem("existing-preference")).toBe("keep-me");
    expect(localStorage.length).toBe(1);
  });
});
