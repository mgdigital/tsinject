import type { ContainerModule } from '@mgdigital/tsinject'
import type { ServiceMap } from './types'
import * as keys from './keys'
import consoleLogWriter from './consoleLogWriter'
import Logger from './Logger'

const loggingModule: ContainerModule<
  ServiceMap
> = builder => builder
  .define(
    keys.logWriter,
    () => consoleLogWriter
  )
  .define(
    keys.logger,
    container => new Logger(
      container.get(keys.logWriter)
    )
  )

export default loggingModule
