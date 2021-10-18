import type { ILogger, LogWriter } from './types'

class Logger implements ILogger {

  constructor (
    private readonly write: LogWriter
  ) { }

  debug (message: string, data?: Record<string, unknown>): void {
    this.write('debug', message, data)
  }

  info (message: string, data?: Record<string, unknown>): void {
    this.write('info', message, data)
  }

  error (message: string, data?: Record<string, unknown>): void {
    this.write('error', message, data)
  }
}

export default Logger
