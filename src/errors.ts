import type { ContainerKey } from './types'

export class TSInjectError extends Error {}

export class DefinitionNotFoundError extends TSInjectError {
  constructor (
    public readonly key: ContainerKey
  ) {
    super(`Definition for "${key.toString()}" was not found in the container`)
  }
}
