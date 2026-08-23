import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "node:util";
import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from "node:stream/web";

// NextRequest/NextResponse need Fetch primitives that jsdom does not expose.
if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder;
}
for (const [name, implementation] of Object.entries({
  ReadableStream,
  TransformStream,
  WritableStream,
})) {
  if (typeof globalThis[name] === "undefined") {
    globalThis[name] = implementation;
  }
}
if (typeof globalThis.Request === "undefined") {
  const edgeFetch = require("next/dist/compiled/@edge-runtime/primitives/fetch");
  for (const name of ["Request", "Response", "Headers", "fetch"]) {
    if (typeof globalThis[name] === "undefined" && edgeFetch[name]) {
      globalThis[name] = edgeFetch[name];
    }
  }
}

// Blob URL APIs used by model upload / reset paths (jsdom does not implement these)
if (typeof URL.createObjectURL !== "function") {
  URL.createObjectURL = jest.fn(() => "blob:mock-url");
}
if (typeof URL.revokeObjectURL !== "function") {
  URL.revokeObjectURL = jest.fn();
}

// Mock WebGL for testing
const mockWebGLContext = {
  canvas: document.createElement("canvas"),
  drawingBufferWidth: 1,
  drawingBufferHeight: 1,
  getSupportedExtensions: jest.fn(() => [
    "WEBGL_lose_context",
    "OES_texture_float",
  ]),
  getExtension: jest.fn((name) => {
    if (name === "WEBGL_lose_context") {
      return { loseContext: jest.fn(), restoreContext: jest.fn() };
    }
    return {};
  }),
  getParameter: jest.fn(() => 0),
  getShaderPrecisionFormat: jest.fn(() => ({
    rangeMin: 127,
    rangeMax: 127,
    precision: 23,
  })),
  createShader: jest.fn(() => ({})),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  getShaderParameter: jest.fn(() => true),
  createProgram: jest.fn(() => ({})),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  getProgramParameter: jest.fn(() => true),
  deleteShader: jest.fn(),
  deleteProgram: jest.fn(),
  createBuffer: jest.fn(() => ({})),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
  createTexture: jest.fn(() => ({})),
  bindTexture: jest.fn(),
  texParameteri: jest.fn(),
  texImage2D: jest.fn(),
  createFramebuffer: jest.fn(() => ({})),
  bindFramebuffer: jest.fn(),
  framebufferTexture2D: jest.fn(),
  createRenderbuffer: jest.fn(() => ({})),
  bindRenderbuffer: jest.fn(),
  renderbufferStorage: jest.fn(),
  framebufferRenderbuffer: jest.fn(),
  getAttribLocation: jest.fn(() => 0),
  getUniformLocation: jest.fn(() => ({})),
  enableVertexAttribArray: jest.fn(),
  vertexAttribPointer: jest.fn(),
  uniformMatrix4fv: jest.fn(),
  uniform1i: jest.fn(),
  uniform1f: jest.fn(),
  uniform2f: jest.fn(),
  uniform3f: jest.fn(),
  uniform4f: jest.fn(),
  useProgram: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  blendFunc: jest.fn(),
  depthFunc: jest.fn(),
  cullFace: jest.fn(),
  frontFace: jest.fn(),
  clear: jest.fn(),
  clearColor: jest.fn(),
  clearDepth: jest.fn(),
  viewport: jest.fn(),
  scissor: jest.fn(),
  drawArrays: jest.fn(),
  drawElements: jest.fn(),
  pixelStorei: jest.fn(),
  activeTexture: jest.fn(),
  generateMipmap: jest.fn(),
  deleteBuffer: jest.fn(),
  deleteTexture: jest.fn(),
  deleteFramebuffer: jest.fn(),
  deleteRenderbuffer: jest.fn(),
  isContextLost: jest.fn(() => false),
};

HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
  if (
    contextType === "webgl" ||
    contextType === "webgl2" ||
    contextType === "experimental-webgl"
  ) {
    return mockWebGLContext;
  }
  if (contextType === "2d") {
    return {
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: [] })),
      putImageData: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      translate: jest.fn(),
      transform: jest.fn(),
      setTransform: jest.fn(),
    };
  }
  return null;
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
