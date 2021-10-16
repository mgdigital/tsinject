import type { ContainerModule } from '../../types'
import * as keys from './keys'

const processEnvModule: ContainerModule<
  keys.ProcessEnvServiceMap
> =
  containerBuilder => containerBuilder
    .define(
      keys.processEnv,
      () => Object.freeze({ ...process.env })
    )

export default processEnvModule
