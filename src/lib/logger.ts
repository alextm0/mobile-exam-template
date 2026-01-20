/**
 * Log levels for the application
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Log categories to distinguish where the log is coming from
 */
export enum LogCategory {
  SERVER = 'SERVER',
  DB = 'DB',
  UI = 'UI',
  APP = 'APP',
  SOCKET = 'SOCKET',
}

class Logger {
  private isDevelopment = __DEV__;

  /**
   * General log method
   */
  log(level: LogLevel, category: LogCategory, message: string, detail?: any) {
    if (!this.isDevelopment && level === LogLevel.DEBUG) return;

    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] [${level}] [${category}] ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, detail || '');
        break;
      case LogLevel.INFO:
        console.log(logMessage, detail || '');
        break;
      case LogLevel.WARN:
        console.warn(logMessage, detail || '');
        break;
      case LogLevel.ERROR:
        console.error(logMessage, detail || '');
        break;
    }
  }

  // Helper methods for semantic logging
  server(message: string, detail?: any) {
    this.log(LogLevel.INFO, LogCategory.SERVER, message, detail);
  }

  db(message: string, detail?: any) {
    this.log(LogLevel.INFO, LogCategory.DB, message, detail);
  }

  ui(message: string, detail?: any) {
    this.log(LogLevel.DEBUG, LogCategory.UI, message, detail);
  }

  error(message: string, error?: any, category: LogCategory = LogCategory.APP) {
    this.log(LogLevel.ERROR, category, message, error);
  }

  warn(message: string, detail?: any, category: LogCategory = LogCategory.APP) {
    this.log(LogLevel.WARN, category, message, detail);
  }

  debug(message: string, detail?: any, category: LogCategory = LogCategory.APP) {
    this.log(LogLevel.DEBUG, category, message, detail);
  }
}

export const logger = new Logger();
