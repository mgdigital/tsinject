import type * as keys from './keys'

export type GetHighResTime = () => bigint
export type HighResTimer = () => () => number

export type ServiceMap = {
  [keys.getHighResTime]: GetHighResTime
  [keys.highResTimer]: HighResTimer
}
