import type { 
  ContainerKey, 
  ContainerKeyOf, 
  ContainerServiceMap, 
  FactoryMap, 
  IContainer 
} from './types'
import { containerKeys, DefinitionNotFoundError } from '.'
import memoize from './memoize'

type GetterMap<TServiceMap extends ContainerServiceMap = ContainerServiceMap> = {
  [ref in ContainerKeyOf<TServiceMap>]: () => TServiceMap[ref]
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
    TKey extends ContainerKeyOf<TServiceMap>
  >(
    ref: TKey
  ): TServiceMap[TKey] {
    const getter = this.getters[ref]
    if (getter === undefined) {
      throw new DefinitionNotFoundError(ref)
    }
    return getter()
  }
}

export default Container
