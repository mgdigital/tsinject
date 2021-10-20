import type { ContainerKey } from './types'

/**
 * Base class for all errors thrown by tsinject.
 */
export class TSInjectError extends Error {}

/**
 * Error thrown when a non-existent key is requested from the container.
 */
export class ServiceNotFoundError extends TSInjectError {
  constructor (
    public readonly key: ContainerKey
  ) {
    super(`Definition for "${key.toString()}" was not found in the container`)
  }
}
