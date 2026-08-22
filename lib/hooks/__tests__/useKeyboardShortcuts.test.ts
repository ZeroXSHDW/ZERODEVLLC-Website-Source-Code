import { renderHook, act } from "@testing-library/react";
import { useKeyboardShortcuts } from "../useKeyboardShortcuts";

describe("useKeyboardShortcuts", () => {
  let mockCallbacks: {
    onResetView?: jest.Mock;
    onToggleRotation?: jest.Mock;
    onToggleControls?: jest.Mock;
    onPerformanceToggle?: jest.Mock;
    onCameraPreset?: jest.Mock;
  };

  beforeEach(() => {
    mockCallbacks = {
      onResetView: jest.fn(),
      onToggleRotation: jest.fn(),
      onToggleControls: jest.fn(),
      onPerformanceToggle: jest.fn(),
      onCameraPreset: jest.fn(),
    };
  });

  it("calls onResetView when Ctrl+R is pressed", () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "r", ctrlKey: true });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onResetView).toHaveBeenCalledTimes(1);
  });

  it("calls onResetView when Cmd+R is pressed on Mac", () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "r", metaKey: true });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onResetView).toHaveBeenCalledTimes(1);
  });

  it("calls onToggleRotation when Space is pressed", () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: " " });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onToggleRotation).toHaveBeenCalledTimes(1);
  });

  it("calls onToggleControls when Ctrl+C is pressed", () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "c", ctrlKey: true });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onToggleControls).toHaveBeenCalledTimes(1);
  });

  it("calls onPerformanceToggle when Ctrl+P is pressed", () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "p", ctrlKey: true });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onPerformanceToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onCameraPreset with "front" when 1 is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "1" });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onCameraPreset).toHaveBeenCalledWith("front");
  });

  it('calls onCameraPreset with "side" when 2 is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "2" });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onCameraPreset).toHaveBeenCalledWith("left");
  });

  it('calls onCameraPreset with "top" when 3 is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "3" });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onCameraPreset).toHaveBeenCalledWith("top");
  });

  it('calls onCameraPreset with "isometric" when 4 is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "4" });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onCameraPreset).toHaveBeenCalledWith("isometric");
  });

  it("ignores keyboard events when typing in input fields", () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    // Create a mock input element
    const mockInput = document.createElement("input");
    document.body.appendChild(mockInput);
    mockInput.focus();

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "r", ctrlKey: true });
      Object.defineProperty(event, "target", { value: mockInput });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onResetView).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(mockInput);
  });

  it("ignores keyboard events when typing in textarea fields", () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks));

    // Create a mock textarea element
    const mockTextarea = document.createElement("textarea");
    document.body.appendChild(mockTextarea);
    mockTextarea.focus();

    act(() => {
      const event = new KeyboardEvent("keydown", { key: " " });
      Object.defineProperty(event, "target", { value: mockTextarea });
      document.dispatchEvent(event);
    });

    expect(mockCallbacks.onToggleRotation).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(mockTextarea);
  });
});
