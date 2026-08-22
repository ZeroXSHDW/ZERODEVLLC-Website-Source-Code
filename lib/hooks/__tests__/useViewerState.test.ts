import { renderHook, act } from "@testing-library/react";
import { useViewerState } from "../useViewerState";

describe("useViewerState", () => {
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useViewerState());

    expect(result.current.uiState).toEqual({
      isControlsPanelOpen: false,
      isKeyboardHelpOpen: false,
      isModelInfoOpen: false,
      isPerformanceMonitorOpen: false,
      isExportDialogOpen: false,
      isMobileGestureHelpOpen: false,
    });
  });

  it("should toggle controls panel", () => {
    const { result } = renderHook(() => useViewerState());

    act(() => {
      result.current.toggleControlsPanel();
    });

    expect(result.current.uiState.isControlsPanelOpen).toBe(true);

    act(() => {
      result.current.toggleControlsPanel();
    });

    expect(result.current.uiState.isControlsPanelOpen).toBe(false);
  });

  it("should toggle keyboard help", () => {
    const { result } = renderHook(() => useViewerState());

    act(() => {
      result.current.toggleKeyboardHelp();
    });

    expect(result.current.uiState.isKeyboardHelpOpen).toBe(true);

    act(() => {
      result.current.toggleKeyboardHelp();
    });

    expect(result.current.uiState.isKeyboardHelpOpen).toBe(false);
  });

  it("should toggle model info", () => {
    const { result } = renderHook(() => useViewerState());

    act(() => {
      result.current.toggleModelInfo();
    });

    expect(result.current.uiState.isModelInfoOpen).toBe(true);

    act(() => {
      result.current.toggleModelInfo();
    });

    expect(result.current.uiState.isModelInfoOpen).toBe(false);
  });

  it("should close all panels", () => {
    const { result } = renderHook(() => useViewerState());

    // Open some panels
    act(() => {
      result.current.toggleControlsPanel();
      result.current.toggleKeyboardHelp();
      result.current.toggleModelInfo();
    });

    expect(result.current.uiState.isControlsPanelOpen).toBe(true);
    expect(result.current.uiState.isKeyboardHelpOpen).toBe(true);
    expect(result.current.uiState.isModelInfoOpen).toBe(true);

    // Close all
    act(() => {
      result.current.closeAll();
    });

    expect(result.current.uiState.isControlsPanelOpen).toBe(false);
    expect(result.current.uiState.isKeyboardHelpOpen).toBe(false);
    expect(result.current.uiState.isModelInfoOpen).toBe(false);
    expect(result.current.uiState.isPerformanceMonitorOpen).toBe(false);
    expect(result.current.uiState.isExportDialogOpen).toBe(false);
    expect(result.current.uiState.isMobileGestureHelpOpen).toBe(false);
  });
});
