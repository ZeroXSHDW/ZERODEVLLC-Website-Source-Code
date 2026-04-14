import { render, screen, fireEvent } from '@testing-library/react';
import { MobileGestureHelp } from '../MobileGestureHelp';

// Mock window properties for mobile detection
const mockInnerWidth = 400;
const mockUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';

beforeAll(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, value: mockInnerWidth });
  Object.defineProperty(window, 'navigator', {
    value: { userAgent: mockUserAgent },
    writable: true,
  });
});

describe('MobileGestureHelp', () => {
  beforeEach(() => {
    // Reset to desktop by default
    window.innerWidth = 1024;
    window.navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  });

  it('does not render on desktop devices', () => {
    render(<MobileGestureHelp isOpen={true} onClose={() => {}} />);
    expect(screen.queryByText('Touch Gestures')).not.toBeInTheDocument();
  });

  it('renders on mobile devices when open', () => {
    // Mock mobile device
    window.innerWidth = 768;
    window.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15';

    render(<MobileGestureHelp isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Touch Gestures')).toBeInTheDocument();
    expect(screen.getByText('Rotate')).toBeInTheDocument();
    expect(screen.getByText('Zoom')).toBeInTheDocument();
    expect(screen.getByText('Pan')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    window.innerWidth = 768;
    window.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15';

    render(<MobileGestureHelp isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('Touch Gestures')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    window.innerWidth = 768;
    window.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15';

    const mockOnClose = jest.fn();
    render(<MobileGestureHelp isOpen={true} onClose={mockOnClose} />);

    // Find the close button by its classes
    const closeButton = document.querySelector('.text-gray-400.hover\\:text-white');
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('detects mobile based on user agent', () => {
    // Test iPhone
    window.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15';
    const { rerender } = render(<MobileGestureHelp isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Touch Gestures')).toBeInTheDocument();

    // Test Android
    window.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36';
    rerender(<MobileGestureHelp isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Touch Gestures')).toBeInTheDocument();
  });
});
