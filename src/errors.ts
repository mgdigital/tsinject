import type { ContainerKey } from './types'

export class InjectError extends Error {}

export class DefinitionNotFoundError extends InjectError {
  constructor (
    public readonly key: ContainerKey
  ) {
    super(`Definition for "${key.toString()}" was not found in the container`)
  }
}
