import type { ContainerBuilder } from './types'
import ContainerBuilderImpl from './ContainerBuilderImpl'

/**
 * Create a new ContainerBuilder instance.
 *
 * @returns ContainerBuilder
 */
const newContainerBuilder = (): ContainerBuilder =>
  ContainerBuilderImpl.create()

export default newContainerBuilder
