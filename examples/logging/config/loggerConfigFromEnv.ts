import type { LoggerConfig } from '../types'
import logLevelFromEnv from './logLevelFromEnv'
import * as defaults from './defaults'
import * as envVars from './envVars'

const loggerConfigFromEnv = (env: NodeJS.ProcessEnv): LoggerConfig => ({
  level: logLevelFromEnv(env),
  pretty: env[envVars.pretty] === undefined
    ? defaults.pretty
    : env[envVars.pretty]?.toUpperCase() === 'TRUE'
})

export default loggerConfigFromEnv
