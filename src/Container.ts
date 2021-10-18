import type {
  ContainerKey,
  FactoryMap,
  IContainer,
  ServiceMap
} from './types'
import { containerKeys, ServiceNotFoundError } from '.'
import memoize from './memoize'

type GetterMap<TServiceMap extends ServiceMap = ServiceMap> = {
  [key in keyof TServiceMap]: () => TServiceMap[key]
}

/**
 * Default implementation for [[IContainer]].
 *
 * @hidden
 */
class Container<TServiceMap extends ServiceMap> implements IContainer<TServiceMap> {
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
    TKey extends keyof TServiceMap = keyof TServiceMap,
    T extends TServiceMap[TKey] = TServiceMap[TKey]
  >(
    key: TKey
  ): T {
    const getter = this.getters[key]
    if (getter === undefined) {
      throw new ServiceNotFoundError(key as ContainerKey)
    }
    return getter() as T
  }

  has <
    TKey extends keyof TServiceMap = keyof TServiceMap,
    T extends TServiceMap[TKey] = TServiceMap[TKey]
  >(
    key: TKey
  ): this is IContainer<{ [k in TKey]: T }> {
    return this.keys.includes(key as ContainerKey)
  }
}

export default Container
