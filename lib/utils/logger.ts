/**
 * Centralized logging utility
 * Respects environment and provides structured logging
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerConfig {
  level: LogLevel;
  enableInProduction: boolean;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggerConfig;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.config = {
      level: this.isDevelopment ? "debug" : "warn",
      enableInProduction: false,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment && !this.config.enableInProduction) {
      return level === "error" || level === "warn";
    }
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    ...args: unknown[]
  ): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case "debug":
        if (this.shouldLog(level)) {
          console.debug(prefix, message, ...args);
        }
        break;
      case "info":
        if (this.shouldLog(level)) {
          console.info(prefix, message, ...args);
        }
        break;
      case "warn":
        if (this.shouldLog(level)) {
          console.warn(prefix, message, ...args);
        }
        break;
      case "error":
        if (this.shouldLog(level)) {
          console.error(prefix, message, ...args);
        }
        break;
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.formatMessage("debug", message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.formatMessage("info", message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.formatMessage("warn", message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.formatMessage("error", message, ...args);
  }

  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  enableProductionLogging(): void {
    this.config.enableInProduction = true;
  }

  disableProductionLogging(): void {
    this.config.enableInProduction = false;
  }
}

export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, ...args: unknown[]) =>
    logger.debug(message, ...args),
  info: (message: string, ...args: unknown[]) => logger.info(message, ...args),
  warn: (message: string, ...args: unknown[]) => logger.warn(message, ...args),
  error: (message: string, ...args: unknown[]) =>
    logger.error(message, ...args),
};
