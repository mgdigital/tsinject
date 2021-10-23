import type {
  ContainerKey,
  FactoryMap,
  Container,
  ServiceMap,
  ServiceTypeOf
} from './types'
import { containerKeys, ServiceNotFoundError } from '.'
import memoize from './memoize'

type GetterMap<TServiceMap extends ServiceMap = ServiceMap> = {
  [key in keyof TServiceMap]: () => ServiceTypeOf<TServiceMap, key>
}

/**
 * Default implementation for [[Container]].
 *
 * @internal
 */
class ContainerImpl<TServiceMap extends ServiceMap> implements Container<TServiceMap> {
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
    TKey extends keyof TServiceMap = keyof TServiceMap
  >(
    key: TKey
  ): ServiceTypeOf<TServiceMap, TKey> {
    const getter = this.getters[key]
    if (getter === undefined) {
      throw new ServiceNotFoundError(key as ContainerKey)
    }
    return getter()
  }

  has <
    TKey extends keyof TServiceMap = keyof TServiceMap
  >(
    key: TKey
  ): this is Container<{ [k in TKey]: ServiceTypeOf<TServiceMap, TKey> }> {
    return key in this.getters
  }
}

export default ContainerImpl
