import { ContainerModule } from '../..'
import { ServiceMap } from './types'
import * as factories from './factories'
import * as keys from './keys'

const containerModule: ContainerModule<ServiceMap> = builder => builder
  .define(keys.getHiResTime, factories.getHiResTime)
  .define(keys.hiResTimer, factories.hiResTimer)

export default containerModule
