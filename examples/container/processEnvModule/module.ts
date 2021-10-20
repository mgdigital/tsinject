import type { ContainerModule } from '@mgdigital/tsinject'
import type ProcessEnvServices from './services'
import * as keys from './keys'
import getProcessEnv from '../../util/getProcessEnv'

const processEnvModule: ContainerModule<
  ProcessEnvServices
> =
  builder => builder
    .define(
      keys.processEnv,
      getProcessEnv
    )

export default processEnvModule
