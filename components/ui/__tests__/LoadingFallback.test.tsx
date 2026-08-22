import { render, screen } from "@testing-library/react";
import { LoadingFallback } from "../LoadingFallback";

describe("LoadingFallback", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders loading animation", () => {
    render(<LoadingFallback />);
    // Should have the main loading container
    const loadingContainer = document.querySelector(
      ".relative.z-10.text-center",
    );
    expect(loadingContainer).toBeInTheDocument();

    // Should have loading dots animation
    const dots = document.querySelectorAll(".bg-white.rounded-full");
    expect(dots.length).toBeGreaterThan(0);
  });

  it("renders custom message when provided", () => {
    const customMessage = "Custom loading message";
    render(<LoadingFallback message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("shows progress bar when progress is provided", () => {
    render(<LoadingFallback progress={75} />);
    const progressBar = document.querySelector(".bg-gradient-to-r");
    expect(progressBar).toBeInTheDocument();
    // The progress bar should exist and have the gradient class
    expect(progressBar).toHaveClass("bg-gradient-to-r");
  });

  it("shows default progress animation when no progress provided", () => {
    render(<LoadingFallback />);
    const progressBar = document.querySelector(".bg-gradient-to-r");
    expect(progressBar).toBeInTheDocument();
  });

  it("renders loading animation elements", () => {
    render(<LoadingFallback />);
    // Should have loading animation elements (center dot and status indicators)
    const centerDot = document.querySelector(".w-3.h-3.bg-white.rounded-full");
    expect(centerDot).toBeInTheDocument();

    // Should have status indicators
    const statusIndicators = document.querySelectorAll(
      ".bg-blue-500, .bg-purple-500, .bg-pink-500",
    );
    expect(statusIndicators.length).toBeGreaterThan(0);
  });
});
