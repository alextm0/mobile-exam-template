const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const LogCategory = {
  SERVER: 'SERVER',
  DB: 'DB',
  APP: 'APP',
};

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  log(level, category, message, detail = null) {
    const timestamp = new Date().toISOString();
    const detailStr = detail ? ` ${JSON.stringify(detail)}` : '';
    const logMessage = `[${timestamp}] [${level}] [${category}] ${message}${detailStr}`;

    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) console.debug(logMessage);
        break;
      case LogLevel.INFO:
        console.log(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  server(message, detail) {
    this.log(LogLevel.INFO, LogCategory.SERVER, message, detail);
  }

  db(message, detail) {
    this.log(LogLevel.INFO, LogCategory.DB, message, detail);
  }

  error(message, error, category = LogCategory.APP) {
    this.log(LogLevel.ERROR, category, message, error);
  }

  warn(message, detail, category = LogCategory.APP) {
    this.log(LogLevel.WARN, category, message, detail);
  }

  debug(message, detail, category = LogCategory.APP) {
    this.log(LogLevel.DEBUG, category, message, detail);
  }
}

module.exports = {
  logger: new Logger(),
  LogLevel,
  LogCategory
};
