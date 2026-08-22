import { logger, log } from "../logger";

// Mock console methods
const mockConsoleDebug = jest.spyOn(console, "debug").mockImplementation();
const mockConsoleInfo = jest.spyOn(console, "info").mockImplementation();
const mockConsoleWarn = jest.spyOn(console, "warn").mockImplementation();
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

describe("Logger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Jest runs with NODE_ENV=test (not development); enable logging so level filtering is testable
    logger.enableProductionLogging();
    logger.setLevel("debug");
  });

  afterAll(() => {
    mockConsoleDebug.mockRestore();
    mockConsoleInfo.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
    logger.disableProductionLogging();
  });

  describe("log.debug", () => {
    it("should log debug messages", () => {
      log.debug("Test debug message");
      expect(mockConsoleDebug).toHaveBeenCalled();
    });
  });

  describe("log.info", () => {
    it("should log info messages", () => {
      log.info("Test info message");
      expect(mockConsoleInfo).toHaveBeenCalled();
    });
  });

  describe("log.warn", () => {
    it("should log warning messages", () => {
      log.warn("Test warning message");
      expect(mockConsoleWarn).toHaveBeenCalled();
    });
  });

  describe("log.error", () => {
    it("should log error messages", () => {
      log.error("Test error message");
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe("log level filtering", () => {
    it("should not log debug messages when level is info", () => {
      logger.setLevel("info");
      log.debug("This should not be logged");
      expect(mockConsoleDebug).not.toHaveBeenCalled();
    });

    it("should log info messages when level is info", () => {
      logger.setLevel("info");
      log.info("This should be logged");
      expect(mockConsoleInfo).toHaveBeenCalled();
    });

    it("should log warnings when level is warn", () => {
      logger.setLevel("warn");
      log.warn("This should be logged");
      expect(mockConsoleWarn).toHaveBeenCalled();
    });

    it("should always log errors", () => {
      logger.setLevel("error");
      log.error("This should always be logged");
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });
});
