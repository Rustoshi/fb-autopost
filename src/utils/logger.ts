type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
    private logLevel: LogLevel;

    constructor(logLevel: LogLevel = 'info') {
        this.logLevel = logLevel;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }

    private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        const formattedArgs = args.length > 0 ? ' ' + args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ') : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedArgs}`;
    }

    debug(message: string, ...args: any[]): void {
        if (this.shouldLog('debug')) {
            console.log('\x1b[36m%s\x1b[0m', this.formatMessage('debug', message, ...args));
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.shouldLog('info')) {
            console.log('\x1b[32m%s\x1b[0m', this.formatMessage('info', message, ...args));
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.shouldLog('warn')) {
            console.warn('\x1b[33m%s\x1b[0m', this.formatMessage('warn', message, ...args));
        }
    }

    error(message: string, ...args: any[]): void {
        if (this.shouldLog('error')) {
            console.error('\x1b[31m%s\x1b[0m', this.formatMessage('error', message, ...args));
        }
    }
}

export const logger = new Logger(process.env.LOG_LEVEL as LogLevel || 'info');
