import type { ContainerModule } from '../../types'
import type { ServiceMap } from './types'
import * as factories from './factories'
import * as keys from './keys'

const containerModule: ContainerModule<
  ServiceMap
> =
  builder => builder
    .define(keys.processEnv, factories.processEnv)

export default containerModule
