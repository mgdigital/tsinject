import type { ContainerModule } from '@mgdigital/tsinject'
import type LoggingServices from './services'
import * as processEnvModule from '../processEnvModule'
import * as keys from './keys'
import consoleLogWriter from '../../logging/consoleLogWriter'
import Logger from '../../logging/Logger'
import loggerConfigFromEnv from '../../logging/config/loggerConfigFromEnv'
import prettyLogFormatter from '../../logging/prettyLogFormatter'
import simpleLogFormatter from '../../logging/simpleLogFormatter'

const loggingModule: ContainerModule<
  processEnvModule.services &
  LoggingServices
> = {
  // Specify a unique key for the module
  key: Symbol('loggingModule'),
  build: builder => builder
    // Use another container module that provides services required by this one
    .use(processEnvModule.default)
    // Define a config object based on environment variables
    .define(
      keys.loggerConfig,
      container => loggerConfigFromEnv(
        container.get(processEnvModule.keys.processEnv)
      )
    )
    // Provide a different implementation depending on environment variable configuration
    .define(
      keys.logFormatter,
      container => container.get(keys.loggerConfig).pretty
        ? prettyLogFormatter
        : simpleLogFormatter
    )
    .define(
      keys.logWriter,
      () => consoleLogWriter
    )
    .define(
      keys.logger,
      container => new Logger(
        container.get(keys.logFormatter),
        container.get(keys.logWriter),
        container.get(keys.loggerConfig).level
      )
    )
}

export default loggingModule
