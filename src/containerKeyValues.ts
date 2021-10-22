import type { ContainerKey } from '.'
import { containerKeys } from '.'

/**
 * Get all property values `T[]` from any object that is a `Record<ContainerKey, T>`
 *
 * @typeParam T - The type of the property values.
 * @param obj - The object to extract the values from.
 * @returns The extracted values.
 */
const containerKeyValues = <T>(obj: Record<ContainerKey, T>): T[] =>
  containerKeys(obj)
    .map(key => obj[key])

export default containerKeyValues
