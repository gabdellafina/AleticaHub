// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\core\logging\Logger.ts
// Logging Infrastructure - Comprehensive logging system

import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  DEBUG = 'debug',
}

// Log context interface
export interface LogContext {
  userId?: string;
  requestId?: string;
  method?: string;
  url?: string;
  userAgent?: string;
  ip?: string;
  duration?: number;
  statusCode?: number;
  [key: string]: any;
}

class Logger {
  private static instance: Logger;
  private logger: WinstonLogger;

  private constructor() {
    this.logger = this.createLogger();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogger(): WinstonLogger {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Console format for development
    const consoleFormat = format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level}]: ${message} ${metaStr}`;
      })
    );

    // File format for production
    const fileFormat = format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json()
    );

    const logger = createLogger({
      level: isDevelopment ? 'debug' : 'info',
      format: fileFormat,
      defaultMeta: { service: 'atleticahub-api' },
      transports: [
        // Console transport
        new transports.Console({
          format: isDevelopment ? consoleFormat : fileFormat,
        }),
      ],
    });

    // Add file transports in production
    if (!isDevelopment) {
      // Error log file
      logger.add(
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxFiles: '30d',
          maxSize: '20m',
        })
      );

      // Combined log file
      logger.add(
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          maxSize: '20m',
        })
      );

      // HTTP access log
      logger.add(
        new DailyRotateFile({
          filename: 'logs/access-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'http',
          maxFiles: '30d',
          maxSize: '20m',
        })
      );
    }

    return logger;
  }

  // Core logging methods
  error(message: string, meta?: LogContext | Error): void {
    if (meta instanceof Error) {
      this.logger.error(message, { error: meta.message, stack: meta.stack });
    } else {
      this.logger.error(message, meta);
    }
  }

  warn(message: string, meta?: LogContext): void {
    this.logger.warn(message, meta);
  }

  info(message: string, meta?: LogContext): void {
    this.logger.info(message, meta);
  }

  http(message: string, meta?: LogContext): void {
    this.logger.http(message, meta);
  }

  debug(message: string, meta?: LogContext): void {
    this.logger.debug(message, meta);
  }

  // Specialized logging methods
  logRequest(method: string, url: string, meta?: LogContext): void {
    this.http(`${method} ${url}`, {
      method,
      url,
      ...meta,
    });
  }

  logResponse(method: string, url: string, statusCode: number, duration: number, meta?: LogContext): void {
    const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.HTTP;
    this.logger.log(level, `${method} ${url} - ${statusCode} - ${duration}ms`, {
      method,
      url,
      statusCode,
      duration,
      ...meta,
    });
  }

  logError(error: Error, context?: string, meta?: LogContext): void {
    this.error(`${context ? `${context}: ` : ''}${error.message}`, {
      error: error.message,
      stack: error.stack,
      ...meta,
    });
  }

  logAuth(action: string, userId?: string, success: boolean = true, meta?: LogContext): void {
    const message = `Auth ${action} ${success ? 'successful' : 'failed'}`;
    const level = success ? LogLevel.INFO : LogLevel.WARN;
    
    this.logger.log(level, message, {
      action,
      userId,
      success,
      ...meta,
    });
  }

  logDatabase(operation: string, collection: string, documentId?: string, meta?: LogContext): void {
    this.debug(`Database ${operation} on ${collection}${documentId ? ` (${documentId})` : ''}`, {
      operation,
      collection,
      documentId,
      ...meta,
    });
  }

  logSecurity(event: string, severity: 'low' | 'medium' | 'high', meta?: LogContext): void {
    const level = severity === 'high' ? LogLevel.ERROR : severity === 'medium' ? LogLevel.WARN : LogLevel.INFO;
    
    this.logger.log(level, `Security Event: ${event}`, {
      event,
      severity,
      ...meta,
    });
  }

  // Performance logging
  startTimer(label: string): () => void {
    const start = process.hrtime.bigint();
    
    return () => {
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1_000_000; // Convert to milliseconds
      this.debug(`Performance: ${label} took ${duration.toFixed(2)}ms`);
    };
  }

  // Utility methods
  child(defaultMeta: LogContext): Logger {
    const childLogger = new Logger();
    childLogger.logger = this.logger.child(defaultMeta);
    return childLogger;
  }

  getWinstonLogger(): WinstonLogger {
    return this.logger;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
export default logger;
