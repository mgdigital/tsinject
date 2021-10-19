import type { ContainerModule } from '@mgdigital/tsinject'
import type { HighResTimeServices } from './types'
import * as keys from './keys'
import getHighResTime from '../../highResTime/getHighResTime'
import highResTimer from '../../highResTime/highResTimer'

const highResTimeModule: ContainerModule<HighResTimeServices> = builder => builder
  .define(
    keys.getHighResTime,
    () => getHighResTime
  )
  .define(
    keys.highResTimer,
    container => highResTimer(
      container.get(keys.getHighResTime)
    )
  )

export default highResTimeModule
export * as keys from './keys'
export * from './types'
