import type { ContainerModule } from '@mgdigital/tsinject'
import type { ServiceMap } from './types'
import * as keys from './keys'
import getProcessEnv from './getProcessEnv'

const processEnvModule: ContainerModule<
  ServiceMap
> =
  builder => builder
    .define(
      keys.processEnv,
      getProcessEnv
    )

export default processEnvModule
