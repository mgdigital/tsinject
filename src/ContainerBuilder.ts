import type {
  ContainerKey,
  ContainerModule,
  Decorator,
  IContainer,
  IContainerBuilder,
  FactoryMap,
  Factory,
  ServiceMap
} from './types'
import Container from './Container'

/**
 * Default implementation for [[IContainerBuilder]].
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
   ): IContainerBuilder<TServiceMap & Record<TKey, TService>> {
    return new ContainerBuilder({
      ...this.factories,
      [key]: factory
    } as FactoryMap<TServiceMap & Record<TKey, TService>>)
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
      decorator(this.factories[key as ContainerKey] as Factory<TTServiceMap[TKey]>)
    ) as IContainerBuilder<TServiceMap>
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
