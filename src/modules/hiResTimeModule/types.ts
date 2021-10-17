import type * as keys from './keys'

export type GetHiResTime = () => bigint
export type HiResTimer = () => () => number

export type ServiceMap = {
  [keys.getHiResTime]: GetHiResTime
  [keys.hiResTimer]: HiResTimer
}
