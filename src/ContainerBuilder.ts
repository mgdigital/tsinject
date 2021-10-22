import type {
  ContainerKey,
  ContainerModule,
  Decorator,
  IContainer,
  IContainerBuilder,
  FactoryMap,
  Factory,
  ServiceMap,
  ServiceTypeOf
} from './types'
import Container from './Container'

/**
 * Default implementation for [[IContainerBuilder]].
 *
 * @internal
 */
class ContainerBuilder<TServiceMap extends ServiceMap>
implements IContainerBuilder<TServiceMap> {
  private constructor (
    private readonly factories: FactoryMap<TServiceMap>
  ) { }

  static create (): IContainerBuilder {
    return new ContainerBuilder({})
  }

  define <
    TKey extends ContainerKey,
    TService
  >(
    key: TKey,
    factory: Factory<TService, TServiceMap>
   ): IContainerBuilder<TServiceMap & { [key in TKey]: TService }> {
    if (key in this.factories) {
      return this
    }
    return new ContainerBuilder({
      ...this.factories,
      [key]: factory
    } as FactoryMap<TServiceMap & { [key in TKey]: TService }>)
  }

  decorate <
    TKey extends keyof TTServiceMap,
    TTServiceMap extends TServiceMap = TServiceMap
  >(
    key: TKey,
    decorator: Decorator<TTServiceMap, TKey>
  ): IContainerBuilder<TServiceMap> {
    return new ContainerBuilder({
      ...this.factories,
      [key]: decorator(
        this.factories[key as ContainerKey] as Factory<ServiceTypeOf<TTServiceMap, TKey>>
      )
    })
  }

  use <
    TModuleServices extends ServiceMap,
    TRequiredServices extends TServiceMap = TServiceMap
  >(
    module: ContainerModule<TModuleServices, TRequiredServices>
  ): IContainerBuilder<TServiceMap & TModuleServices> {
    return module(this)
  }

  createContainer (): IContainer<TServiceMap> {
    return new Container(this.factories)
  }
}

export default ContainerBuilder
