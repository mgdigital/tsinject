import type { LogLevel } from './types'
import logLevels from './logLevels'

const isLogLevel = (envLogLevel: LogLevel): (logLevel: LogLevel) => boolean => {
  const envIndex = logLevels.indexOf(envLogLevel)
  return logLevel =>
    logLevels.indexOf(logLevel) >= envIndex
}

export default isLogLevel
