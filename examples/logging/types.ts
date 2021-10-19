export type LogLevel = 'debug' | 'info' | 'error'

export type LogFormatter = (level: LogLevel, message: string, data?: Record<string, unknown>) => string

export type LogWriter = (logLine: string) => void

export type LogWithLevelFunction = (level: LogLevel, message: string, data?: Record<string, unknown>) => void

export type LogFunction = (message: string, data?: Record<string, unknown>) => void

export type LoggerConfig = {
  level: LogLevel
  pretty: boolean
}

export type ILogger = {
  level: LogLevel
  is: (level: LogLevel) => boolean
  log: LogWithLevelFunction
  debug: LogFunction
  info: LogFunction
  error: LogFunction
}
