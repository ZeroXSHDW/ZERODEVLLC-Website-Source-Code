import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorFallback } from "../ErrorFallback";

describe("ErrorFallback", () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
  });

  it("renders error message and retry button", () => {
    const error = new Error("Test error");
    render(<ErrorFallback error={error} onRetry={mockOnRetry} />);

    expect(screen.getByText("Unexpected Error")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    const error = new Error("Test error");
    render(<ErrorFallback error={error} onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it("shows WebGL error message for WebGL-related errors", () => {
    const error = new Error("WebGL context lost");
    render(<ErrorFallback error={error} onRetry={mockOnRetry} />);

    expect(screen.getByText("WebGL Not Supported")).toBeInTheDocument();
  });

  it("shows model load error message for load-related errors", () => {
    const error = new Error("Failed to load model");
    render(<ErrorFallback error={error} onRetry={mockOnRetry} />);

    expect(screen.getByText("Failed to Load Model")).toBeInTheDocument();
  });

  it("does not render retry button when onRetry is not provided", () => {
    const error = new Error("Test error");
    render(<ErrorFallback error={error} />);

    expect(
      screen.queryByRole("button", { name: /try again/i }),
    ).not.toBeInTheDocument();
  });
});
