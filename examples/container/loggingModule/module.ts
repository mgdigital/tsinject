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
> = builder => builder
  .use(processEnvModule.default)
  .define(
    keys.loggerConfig,
    container => loggerConfigFromEnv(
      container.get(processEnvModule.keys.processEnv)
    )
  )
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

export default loggingModule
