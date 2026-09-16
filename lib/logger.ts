/**
 * Frontend Logger Utility
 * 
 * Provides consistent logging across the application.
 * In production, console.log/debug calls are suppressed.
 * Errors and warnings are always logged.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
    isDevelopment: boolean;
    prefix?: string;
}

class Logger {
    private isDevelopment: boolean;
    private prefix: string;

    constructor(config: LoggerConfig) {
        this.isDevelopment = config.isDevelopment;
        this.prefix = config.prefix || '[App]';
    }

    /**
     * Debug level - only in development
     */
    debug(...args: unknown[]): void {
        if (this.isDevelopment) {
            console.debug(this.prefix, ...args);
        }
    }

    /**
     * Info level - only in development
     */
    log(...args: unknown[]): void {
        if (this.isDevelopment) {
            console.log(this.prefix, ...args);
        }
    }

    /**
     * Info level alias
     */
    info(...args: unknown[]): void {
        this.log(...args);
    }

    /**
     * Warning level - always logged
     */
    warn(...args: unknown[]): void {
        console.warn(this.prefix, ...args);
    }

    /**
     * Error level - always logged
     */
    error(...args: unknown[]): void {
        console.error(this.prefix, ...args);
    }

    /**
     * Create a child logger with a specific prefix
     */
    child(name: string): Logger {
        return new Logger({
            isDevelopment: this.isDevelopment,
            prefix: `${this.prefix}[${name}]`,
        });
    }
}

// Default logger instance
const logger = new Logger({
    isDevelopment: process.env.NODE_ENV !== 'production',
    prefix: '[AnserTech]',
});

// Named loggers for different modules
export const authLogger = logger.child('Auth');
export const apiLogger = logger.child('API');
export const dashboardLogger = logger.child('Dashboard');
export const agentLogger = logger.child('Agent');

export default logger;
