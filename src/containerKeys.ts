import type { ContainerKey } from './types'

const containerKeys = <TKey extends ContainerKey = ContainerKey>(obj: Record<TKey, unknown>): TKey[] => [
  ...Object.getOwnPropertySymbols(obj),
  ...Object.keys(obj)
] as TKey[]

export default containerKeys
