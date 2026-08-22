import { render, screen } from "@testing-library/react";
import { ViewerActionButtons } from "../ViewerActionButtons";

const mockHandlers = {
  onToggleModelInfo: jest.fn(),
  onToggleMobileGestureHelp: jest.fn(),
  onToggleKeyboardHelp: jest.fn(),
  onTogglePerformanceMonitor: jest.fn(),
  onToggleExportDialog: jest.fn(),
};

describe("ViewerActionButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all action buttons", () => {
    render(
      <ViewerActionButtons
        isMobile={false}
        hasSceneData={true}
        {...mockHandlers}
      />,
    );

    expect(screen.getByLabelText(/model information/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/keyboard shortcuts/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/performance monitor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/export dialog/i)).toBeInTheDocument();
  });

  it("should disable model info button when no scene data", () => {
    render(
      <ViewerActionButtons
        isMobile={false}
        hasSceneData={false}
        {...mockHandlers}
      />,
    );

    const modelInfoButton = screen.getByLabelText(
      /model information not available/i,
    );
    expect(modelInfoButton).toBeDisabled();
  });

  it("should show mobile gesture help button on mobile", () => {
    render(
      <ViewerActionButtons
        isMobile={true}
        hasSceneData={true}
        {...mockHandlers}
      />,
    );

    // On mobile, both the dedicated gesture button and the help button share this label
    const gestureButtons = screen.getAllByLabelText(/touch gestures tutorial/i);
    expect(gestureButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("should call handlers when buttons are clicked", () => {
    render(
      <ViewerActionButtons
        isMobile={false}
        hasSceneData={true}
        {...mockHandlers}
      />,
    );

    screen.getByLabelText(/model information/i).click();
    expect(mockHandlers.onToggleModelInfo).toHaveBeenCalledTimes(1);

    screen.getByLabelText(/keyboard shortcuts/i).click();
    expect(mockHandlers.onToggleKeyboardHelp).toHaveBeenCalledTimes(1);

    screen.getByLabelText(/performance monitor/i).click();
    expect(mockHandlers.onTogglePerformanceMonitor).toHaveBeenCalledTimes(1);

    screen.getByLabelText(/export dialog/i).click();
    expect(mockHandlers.onToggleExportDialog).toHaveBeenCalledTimes(1);
  });
});
