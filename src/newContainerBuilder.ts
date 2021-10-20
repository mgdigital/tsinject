import type { IContainerBuilder } from './types'
import ContainerBuilder from './ContainerBuilder'

/**
 * Create a new IContainerBuilder instance.
 *
 * @returns IContainerBuilder
 */
const newContainerBuilder = (): IContainerBuilder =>
  ContainerBuilder.create()

export default newContainerBuilder
