import type { ContainerKey } from './types'

/**
 * Get all the container keys from any object that is a `Record<ContainerKey, unknown>`
 *
 * @typeParam TKey - The type of the container keys.
 * @param obj - The object to extract the keys from.
 * @returns The extracted keys.
 */
const containerKeys = <TKey extends ContainerKey = ContainerKey>(obj: Record<TKey, unknown>): TKey[] => [
  ...Object.getOwnPropertySymbols(obj),
  ...Object.keys(obj)
] as TKey[]

export default containerKeys
