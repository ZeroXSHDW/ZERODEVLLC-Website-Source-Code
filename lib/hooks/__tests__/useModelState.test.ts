import { renderHook, act } from "@testing-library/react";
import * as THREE from "three";
import { useModelState } from "../useModelState";

describe("useModelState", () => {
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useModelState());

    expect(result.current.modelState).toEqual({
      isLoaded: false,
      error: null,
      loadingProgress: 0,
      sceneData: null,
      uploadedFileUrl: null,
      animations: [],
      animationActions: null,
      currentAnimation: null,
      isAnimationPlaying: false,
      loadStartTime: null,
      loadTime: null,
    });
  });

  it("should update loading progress", () => {
    const { result } = renderHook(() => useModelState());

    act(() => {
      result.current.setLoadingProgress(0.5);
    });

    expect(result.current.modelState.loadingProgress).toBe(0.5);
    expect(result.current.modelState.loadStartTime).not.toBeNull();
  });

  it("should set model as loaded", () => {
    const { result } = renderHook(() => useModelState());
    const scene = new THREE.Group();
    const animations: THREE.AnimationClip[] = [];

    act(() => {
      result.current.setLoadingProgress(0.5);
      result.current.setModelLoaded(scene, animations);
    });

    expect(result.current.modelState.isLoaded).toBe(true);
    expect(result.current.modelState.sceneData).toBe(scene);
    expect(result.current.modelState.animations).toEqual(animations);
    expect(result.current.modelState.loadingProgress).toBe(1);
    expect(result.current.modelState.loadTime).not.toBeNull();
  });

  it("should set model error", () => {
    const { result } = renderHook(() => useModelState());
    const error = {
      type: "load" as const,
      message: "Test error",
      originalError: new Error("Test error"),
    };

    act(() => {
      result.current.setModelError(error);
    });

    expect(result.current.modelState.error).toEqual(error);
    expect(result.current.modelState.isLoaded).toBe(false);
  });

  it("should set uploaded file URL", () => {
    const { result } = renderHook(() => useModelState());
    const url = "blob:http://localhost/test";

    act(() => {
      result.current.setUploadedFile(url);
    });

    expect(result.current.modelState.uploadedFileUrl).toBe(url);
    expect(result.current.modelState.isLoaded).toBe(false);
    expect(result.current.modelState.loadingProgress).toBe(0);
  });

  it("should set animations", () => {
    const { result } = renderHook(() => useModelState());
    const animations = [
      new THREE.AnimationClip("animation1", 1, []),
      new THREE.AnimationClip("animation2", 1, []),
    ];
    const actions = {
      animation1: {} as THREE.AnimationAction,
      animation2: {} as THREE.AnimationAction,
    };

    act(() => {
      result.current.setAnimations(animations, actions);
    });

    expect(result.current.modelState.animations).toEqual(animations);
    expect(result.current.modelState.animationActions).toEqual(actions);
    expect(result.current.modelState.currentAnimation).toBe("animation1");
  });

  it("should reset model state", () => {
    const { result } = renderHook(() => useModelState());
    const scene = new THREE.Group();
    const url = "blob:http://localhost/test";

    act(() => {
      result.current.setModelLoaded(scene, []);
      result.current.setUploadedFile(url);
      result.current.resetModel();
    });

    expect(result.current.modelState.sceneData).toBeNull();
    expect(result.current.modelState.uploadedFileUrl).toBeNull();
    expect(result.current.modelState.isLoaded).toBe(false);
  });
});
