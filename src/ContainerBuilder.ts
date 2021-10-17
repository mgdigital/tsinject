import type {
  ContainerKey,
  ContainerModule,
  ContainerServiceMap,
  Decorator,
  IContainer,
  IContainerBuilder,
  FactoryMap,
  Factory
} from './types'
import { Container } from '.'

class ContainerBuilder<TServiceMap extends ContainerServiceMap>
implements IContainerBuilder<TServiceMap> {
  private constructor (
    private readonly factories: FactoryMap<TServiceMap>
  ) { }

  static create (): IContainerBuilder {
    return new ContainerBuilder({}) as IContainerBuilder
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
  TKey extends keyof TTServiceMap = keyof TServiceMap,
    TTServiceMap extends TServiceMap = TServiceMap
  >(
    key: TKey,
    decorator: Decorator<TTServiceMap, TKey>
  ): IContainerBuilder<TServiceMap> {
    return this.define(
      key as ContainerKey,
      decorator(this.factories[key as never] as never) as never
    ) as IContainerBuilder<TServiceMap>
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
