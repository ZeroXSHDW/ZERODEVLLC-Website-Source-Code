import '@testing-library/jest-dom'

// Mock WebGL for testing
const mockWebGLContext = {
  getSupportedExtensions: jest.fn(() => []),
  getExtension: jest.fn(),
  createShader: jest.fn(),
  createProgram: jest.fn(),
  createBuffer: jest.fn(),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
  getAttribLocation: jest.fn(),
  getUniformLocation: jest.fn(),
  uniformMatrix4fv: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  clear: jest.fn(),
  viewport: jest.fn(),
  drawArrays: jest.fn(),
  drawElements: jest.fn(),
};

HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
  if (contextType === 'webgl' || contextType === 'experimental-webgl') {
    return mockWebGLContext;
  }
  return null;
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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
