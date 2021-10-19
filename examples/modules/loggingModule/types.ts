import type { ILogger, LogFormatter, LoggerConfig, LogWriter } from '../../logging/types'
import type * as keys from './keys'

export type LoggingServices = {
  [keys.loggerConfig]: LoggerConfig
  [keys.logFormatter]: LogFormatter
  [keys.logWriter]: LogWriter
  [keys.logger]: ILogger
}
