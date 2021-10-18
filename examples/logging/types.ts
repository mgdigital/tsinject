import type * as keys from './keys'

export type LogLevel = 'debug' | 'info' | 'error'

export type LogWriter = (level: LogLevel, message: string, data?: Record<string, unknown>) => void

export type LogFunction = (message: string, data?: Record<string, unknown>) => void

export type ILogger = {
  [level in LogLevel]: LogFunction
}

export type ServiceMap = {
  [keys.logWriter]: LogWriter
  [keys.logger]: ILogger
}
