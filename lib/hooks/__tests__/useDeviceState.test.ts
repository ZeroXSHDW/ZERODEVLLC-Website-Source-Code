import { act, renderHook, waitFor } from '@testing-library/react';
import { useDeviceState } from '../useDeviceState';

// Mock navigator
const mockNavigator = {
  userAgent: 'Mozilla/5.0',
  maxTouchPoints: 0,
  xr: undefined,
};

Object.defineProperty(window, 'navigator', {
  writable: true,
  value: mockNavigator,
});

describe('useDeviceState', () => {
  beforeEach(() => {
    // Reset window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useDeviceState());

    expect(result.current.deviceState).toEqual({
      isMobile: false,
      arSupported: false,
      vrSupported: false,
      touchStartTime: null,
      lastTapTime: null,
    });
  });

  it('should detect mobile device', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      configurable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useDeviceState());

    await waitFor(() => {
      expect(result.current.deviceState.isMobile).toBe(true);
    });
  });

  it('should set touch start time', () => {
    const { result } = renderHook(() => useDeviceState());

    const timestamp = Date.now();
    act(() => {
      result.current.setTouchStartTime(timestamp);
    });

    expect(result.current.deviceState.touchStartTime).toBe(timestamp);
  });

  it('should set last tap time', () => {
    const { result } = renderHook(() => useDeviceState());

    const timestamp = Date.now();
    act(() => {
      result.current.setLastTapTime(timestamp);
    });

    expect(result.current.deviceState.lastTapTime).toBe(timestamp);
  });
});

