import type { ContainerModule } from '@mgdigital/tsinject'
import type { ProcessEnvServices } from './types'
import * as keys from './keys'
import getProcessEnv from '../../processEnv/getProcessEnv'

const processEnvModule: ContainerModule<
  ProcessEnvServices
> =
  builder => builder
    .define(
      keys.processEnv,
      getProcessEnv
    )

export default processEnvModule
export * as keys from './keys'
export * from './types'
