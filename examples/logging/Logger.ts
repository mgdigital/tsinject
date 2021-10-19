import type { ILogger, LogFormatter, LogLevel, LogWriter } from '../logging/types'
import isLogLevel from './isLogLevel'

class Logger implements ILogger {
  constructor (
    private readonly format: LogFormatter,
    private readonly write: LogWriter,
    public readonly level: LogLevel = 'debug'
  ) { }

  is = isLogLevel(this.level)

  log (level: LogLevel, message: string, data?: Record<string, unknown>): void {
    if (this.is(level)) {
      this.write(this.format(level, message, data))
    }
  }

  debug (message: string, data?: Record<string, unknown>): void {
    this.log('debug', message, data)
  }

  info (message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data)
  }

  error (message: string, data?: Record<string, unknown>): void {
    this.log('error', message, data)
  }
}

export default Logger
