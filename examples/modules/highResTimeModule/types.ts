import type { GetHighResTime, HighResTimer } from '../../highResTime/types'
import type * as keys from './keys'

export type HighResTimeServices = {
  [keys.getHighResTime]: GetHighResTime
  [keys.highResTimer]: HighResTimer
}
