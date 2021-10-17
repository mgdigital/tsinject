import type {
  ContainerKey,
  ContainerServiceMap,
  FactoryMap,
  IContainer
} from './types'
import { containerKeys, DefinitionNotFoundError } from '.'
import memoize from './memoize'

type GetterMap<TServiceMap extends ContainerServiceMap = ContainerServiceMap> = {
  [ref in keyof TServiceMap]: () => TServiceMap[ref]
}

class Container<TServiceMap extends ContainerServiceMap> implements IContainer<TServiceMap> {
  private readonly getters: GetterMap<TServiceMap>

  constructor (
    factories: FactoryMap<TServiceMap>
  ) {
    this.getters = containerKeys(factories)
      .reduce<Partial<GetterMap<TServiceMap>>>(
        (acc, key) => ({
          ...acc,
          [key]: memoize(() => factories[key](this))
        }),
        {}
      ) as GetterMap<TServiceMap>
  }

  get keys (): ContainerKey[] {
    return containerKeys(this.getters)
  }

  get <
    TKey extends keyof TTServiceMap,
    TTServiceMap extends TServiceMap
  >(
    ref: TKey
  ): TTServiceMap[TKey] {
    const getter = this.getters[ref as keyof TServiceMap]
    if (getter === undefined) {
      throw new DefinitionNotFoundError(ref as ContainerKey)
    }
    return getter() as TTServiceMap[TKey]
  }
}

export default Container
