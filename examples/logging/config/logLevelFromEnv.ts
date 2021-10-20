import type { LogLevel } from '../types'
import logLevels from '../logLevels'
import * as defaults from './defaults'
import * as envVars from './envVars'

const logLevelFromEnv = (env: NodeJS.ProcessEnv): LogLevel => {
  const envLogLevel = env[envVars.logLevel]
  if (envLogLevel === undefined) {
    return defaults.logLevel
  }
  if (!logLevels.includes(envLogLevel as LogLevel)) {
    throw new Error('Invalid LOG_LEVEL environment variable')
  }
  return envLogLevel as LogLevel
}

export default logLevelFromEnv
