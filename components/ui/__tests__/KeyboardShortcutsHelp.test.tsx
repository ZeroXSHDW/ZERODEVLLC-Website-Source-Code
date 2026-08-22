import { render, screen, fireEvent } from "@testing-library/react";
import { KeyboardShortcutsHelp } from "../KeyboardShortcutsHelp";

describe("KeyboardShortcutsHelp", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("does not render when isOpen is false", () => {
    render(<KeyboardShortcutsHelp isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();
  });

  it("renders keyboard shortcuts when isOpen is true", () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
    expect(screen.getByText("Reset camera view")).toBeInTheDocument();
    expect(screen.getByText("Toggle auto-rotation")).toBeInTheDocument();
    expect(screen.getByText("Ctrl/Cmd + R")).toBeInTheDocument();
    expect(screen.getByText("Space")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />);
    const closeButton = document.querySelector(
      'button[class*="text-gray-400"]',
    );
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("displays all keyboard shortcuts", () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />);

    const shortcuts = [
      "Reset camera view",
      "Toggle auto-rotation",
      "Toggle controls panel",
      "Toggle performance mode",
      "Front camera preset",
      "Side camera preset",
      "Top camera preset",
      "Isometric camera preset",
    ];

    shortcuts.forEach((shortcut) => {
      expect(screen.getByText(shortcut)).toBeInTheDocument();
    });
  });

  it("shows keyboard shortcut keys", () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Ctrl/Cmd + R")).toBeInTheDocument();
    expect(screen.getByText("Space")).toBeInTheDocument();
    expect(screen.getByText("Ctrl/Cmd + C")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
