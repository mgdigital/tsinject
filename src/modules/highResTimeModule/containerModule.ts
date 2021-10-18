import type { ContainerModule } from '../../types'
import type { ServiceMap } from './types'
import * as keys from './keys'
import * as utils from './utils'

const containerModule: ContainerModule<ServiceMap> = builder => builder
  .define(
    keys.getHighResTime,
    () => utils.getHighResTime
  )
  .define(
    keys.highResTimer,
    container => utils.highResTimer(
      container.get(keys.getHighResTime)
    )
  )

export default containerModule
