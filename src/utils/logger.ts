/**
 * Structured Logger Utility
 * 
 * Provides leveled logging with structured context data.
 * - In development: Outputs color-coded, formatted messages to the console.
 * - In production: Suppresses debug/info logs; only warns and errors are emitted.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: unknown;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const LOG_LEVEL_STYLES: Record<LogLevel, string> = {
    debug: 'color: #9ca3af; font-weight: normal',
    info: 'color: #3b82f6; font-weight: bold',
    warn: 'color: #f59e0b; font-weight: bold',
    error: 'color: #ef4444; font-weight: bold',
};

const LOG_LEVEL_ICONS: Record<LogLevel, string> = {
    debug: '🔍',
    info: 'ℹ️',
    warn: '⚠️',
    error: '🚨',
};

class Logger {
    private minLevel: LogLevel;

    constructor() {
        this.minLevel = import.meta.env.PROD ? 'warn' : 'debug';
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.minLevel];
    }

    private log(level: LogLevel, message: string, context?: LogContext): void {
        if (!this.shouldLog(level)) return;

        const timestamp = new Date().toISOString();
        const icon = LOG_LEVEL_ICONS[level];
        const style = LOG_LEVEL_STYLES[level];
        const prefix = `${icon} [${timestamp.slice(11, 19)}]`;

        const consoleFn = level === 'error'
            ? console.error
            : level === 'warn'
                ? console.warn
                : console.log;

        if (context && Object.keys(context).length > 0) {
            consoleFn(`%c${prefix} ${message}`, style, context);
        } else {
            consoleFn(`%c${prefix} ${message}`, style);
        }
    }

    /** Verbose debug info — suppressed in production */
    debug(message: string, context?: LogContext): void {
        this.log('debug', message, context);
    }

    /** General informational messages — suppressed in production */
    info(message: string, context?: LogContext): void {
        this.log('info', message, context);
    }

    /** Potential issues worth investigating */
    warn(message: string, context?: LogContext): void {
        this.log('warn', message, context);
    }

    /** Errors and failures */
    error(message: string, context?: LogContext): void {
        this.log('error', message, context);
    }
}

/** Singleton logger instance */
export const logger = new Logger();
