/**
 * WebGL detection and support utilities
 */

export function detectWebGLSupport(): {
  isSupported: boolean;
  isAvailable: boolean;
  error?: string;
} {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      return {
        isSupported: false,
        isAvailable: false,
        error: "WebGL is not supported in this browser",
      };
    }

    // Check for essential WebGL extensions (be less strict)
    const essentialExtensions = ["WEBGL_lose_context"];

    const supportedExtensions = gl.getSupportedExtensions() || [];
    const missingEssential = essentialExtensions.filter(
      (ext) => !supportedExtensions.includes(ext),
    );

    if (missingEssential.length > 0) {
      return {
        isSupported: true,
        isAvailable: false,
        error: `Missing essential WebGL extensions: ${missingEssential.join(", ")}`,
      };
    }

    return {
      isSupported: true,
      isAvailable: true,
    };
  } catch (error) {
    return {
      isSupported: false,
      isAvailable: false,
      error: error instanceof Error ? error.message : "Unknown WebGL error",
    };
  }
}

export function getWebGLErrorMessage(): string {
  const { isSupported, isAvailable, error } = detectWebGLSupport();

  if (!isSupported) {
    return "WebGL is not supported in your browser. Please update your browser or enable WebGL.";
  }

  if (!isAvailable) {
    return (
      error || "WebGL is not available. Please check your graphics drivers."
    );
  }

  return "";
}
