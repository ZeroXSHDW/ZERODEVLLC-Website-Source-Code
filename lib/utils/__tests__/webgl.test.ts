import { detectWebGLSupport, getWebGLErrorMessage } from "../webgl";

// Mock canvas and WebGL context
const mockGetContext = jest.fn();
const mockGetSupportedExtensions = jest.fn();

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  writable: true,
  value: mockGetContext,
});

describe("WebGL Detection", () => {
  beforeEach(() => {
    mockGetContext.mockClear();
    mockGetSupportedExtensions.mockClear();
  });

  describe("detectWebGLSupport", () => {
    it("returns success when WebGL is supported", () => {
      const mockContext = {
        getSupportedExtensions: mockGetSupportedExtensions.mockReturnValue([
          "WEBGL_lose_context",
          "OES_texture_float",
        ]),
      };

      mockGetContext.mockReturnValue(mockContext);

      const result = detectWebGLSupport();

      expect(result.isSupported).toBe(true);
      expect(result.isAvailable).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("returns error when WebGL context cannot be created", () => {
      mockGetContext.mockReturnValue(null);

      const result = detectWebGLSupport();

      expect(result.isSupported).toBe(false);
      expect(result.isAvailable).toBe(false);
      expect(result.error).toBe("WebGL is not supported in this browser");
    });

    it("returns error when required extensions are missing", () => {
      const mockContext = {
        getSupportedExtensions: mockGetSupportedExtensions.mockReturnValue([]),
      };

      mockGetContext.mockReturnValue(mockContext);

      const result = detectWebGLSupport();

      expect(result.isSupported).toBe(true);
      expect(result.isAvailable).toBe(false);
      expect(result.error).toContain("Missing essential WebGL extensions");
    });
  });

  describe("getWebGLErrorMessage", () => {
    it("returns WebGL not supported message when context unavailable", () => {
      mockGetContext.mockReturnValue(null);

      const message = getWebGLErrorMessage();

      expect(message).toBe(
        "WebGL is not supported in your browser. Please update your browser or enable WebGL.",
      );
    });

    it("returns empty string when WebGL is available", () => {
      const mockContext = {
        getSupportedExtensions: mockGetSupportedExtensions.mockReturnValue([
          "WEBGL_lose_context",
          "OES_texture_float",
        ]),
      };

      mockGetContext.mockReturnValue(mockContext);

      const message = getWebGLErrorMessage();

      expect(message).toBe("");
    });
  });
});
