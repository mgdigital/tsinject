import type * as keys from './keys'

export type DemoRunner = () => Promise<void>

export type ServiceMap = {
  [keys.demoRunner]: DemoRunner
}
