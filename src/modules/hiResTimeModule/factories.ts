import type { Factory } from '../../types'
import type { GetHiResTime, HiResTimer } from './types'
import * as keys from './keys'
import * as utils from './utils'

export const getHiResTime: Factory<GetHiResTime> = () => 
  utils.getHiResTime

export const hiResTimer: Factory<HiResTimer, {
  [keys.getHiResTime]: GetHiResTime
}> = container => 
  utils.hiResTimer(
    container.get(keys.getHiResTime)
  )
