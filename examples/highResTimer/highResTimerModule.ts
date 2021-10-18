import type { ContainerModule } from '@mgdigital/tsinject'
import type { ServiceMap } from './types'
import * as keys from './keys'
import * as utils from './utils'

const highResTimerModule: ContainerModule<ServiceMap> = builder => builder
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

export default highResTimerModule
