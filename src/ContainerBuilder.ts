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
    return this.define(
      key as ContainerKey,
      decorator(
        this.factories[key as ContainerKey] as Factory<ServiceTypeOf<TTServiceMap, TKey>>
      )
    )
  }

  use <
    TModuleServices extends ServiceMap
  >(module: ContainerModule<TModuleServices, TServiceMap>): IContainerBuilder<TServiceMap & TModuleServices> {
    return module(this)
  }

  createContainer (): IContainer<TServiceMap> {
    return new Container(this.factories)
  }
}

export default ContainerBuilder
