import type {
  ContainerKey,
  ContainerKeyOf,
  ContainerModule,
  ContainerServiceMap,
  Decorator,
  IContainer,
  IContainerBuilder,
  FactoryMap,
  Factory
} from './types'
import { Container } from '.'

class ContainerBuilder<TServiceMap extends ContainerServiceMap = ContainerServiceMap>
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

  decorate <TKey extends ContainerKeyOf<TServiceMap>>(
    key: TKey,
    decorator: Decorator<TServiceMap[TKey], TServiceMap>
  ): IContainerBuilder<TServiceMap> {
    return this.define(key, decorator(this.factories[key]))
  }

  use <
    TModuleServices extends ContainerServiceMap
  >(module: ContainerModule<TModuleServices, TServiceMap>): IContainerBuilder<TServiceMap & TModuleServices> {
    return module(this)
  }

  createContainer (): IContainer<TServiceMap> {
    return new Container(this.factories)
  }
}

export default ContainerBuilder
