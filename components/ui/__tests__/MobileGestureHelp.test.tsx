import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MobileGestureHelp } from "../MobileGestureHelp";

// Mock window properties for mobile detection
const mockInnerWidth = 400;
const mockUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)";

beforeAll(() => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: mockInnerWidth,
  });
  Object.defineProperty(window, "navigator", {
    value: { userAgent: mockUserAgent, maxTouchPoints: 5 },
    writable: true,
    configurable: true,
  });
});

describe("MobileGestureHelp", () => {
  beforeEach(() => {
    // Reset to desktop by default
    window.innerWidth = 1024;
    Object.defineProperty(window.navigator, "userAgent", {
      writable: true,
      configurable: true,
      value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    });
  });

  it("does not render on desktop devices", async () => {
    render(<MobileGestureHelp isOpen={true} onClose={() => {}} />);
    await waitFor(() => {
      expect(screen.queryByText(/Touch Tutorial/i)).not.toBeInTheDocument();
    });
  });

  it("renders on mobile devices when open", async () => {
    window.innerWidth = 768;
    Object.defineProperty(window.navigator, "userAgent", {
      writable: true,
      configurable: true,
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
    });

    render(<MobileGestureHelp isOpen={true} onClose={() => {}} />);

    // Title and first step content appear after client-side mobile detection
    expect(await screen.findByText(/Touch Tutorial/i)).toBeInTheDocument();
    expect(screen.getByText("Rotate")).toBeInTheDocument();
  });

  it("does not render when closed", async () => {
    window.innerWidth = 768;
    Object.defineProperty(window.navigator, "userAgent", {
      writable: true,
      configurable: true,
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
    });

    render(<MobileGestureHelp isOpen={false} onClose={() => {}} />);
    await waitFor(() => {
      expect(screen.queryByText(/Touch Tutorial/i)).not.toBeInTheDocument();
    });
  });

  it("calls onClose when close button is clicked", async () => {
    window.innerWidth = 768;
    Object.defineProperty(window.navigator, "userAgent", {
      writable: true,
      configurable: true,
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
    });

    const mockOnClose = jest.fn();
    render(<MobileGestureHelp isOpen={true} onClose={mockOnClose} />);

    const closeButton = await screen.findByLabelText(
      /close touch gestures help/i,
    );
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("detects mobile based on user agent", async () => {
    Object.defineProperty(window.navigator, "userAgent", {
      writable: true,
      configurable: true,
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
    });
    const { rerender } = render(
      <MobileGestureHelp isOpen={true} onClose={() => {}} />,
    );
    expect(await screen.findByText(/Touch Tutorial/i)).toBeInTheDocument();

    Object.defineProperty(window.navigator, "userAgent", {
      writable: true,
      configurable: true,
      value: "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36",
    });
    rerender(<MobileGestureHelp isOpen={true} onClose={() => {}} />);
    expect(await screen.findByText(/Touch Tutorial/i)).toBeInTheDocument();
  });
});
