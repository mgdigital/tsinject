import type { ContainerModule } from '@mgdigital/tsinject'
import type { ServiceMap } from './types'
import * as highResTimer from '../highResTimer'
import * as logging from '../logging'
import * as processEnv from '../processEnv'
import * as keys from './keys'
import demoRunner from './demoRunner'

const demoModule: ContainerModule<
  highResTimer.ServiceMap &
  logging.ServiceMap &
  processEnv.ServiceMap &
  ServiceMap
> = builder => builder
  .use(highResTimer.highResTimerModule)
  .use(logging.loggingModule)
  .use(processEnv.processEnvModule)
  .define(
    keys.demoRunner,
    container => demoRunner(
      container.get(highResTimer.keys.highResTimer),
      container.get(logging.keys.logger),
      container.get(processEnv.keys.processEnv)
    )
  )

export default demoModule
