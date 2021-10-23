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
    private readonly factories: FactoryMap<TServiceMap>,
    private readonly usedModules: ContainerKey[]
  ) { }

  static create (): IContainerBuilder {
    return new ContainerBuilder({}, [])
  }

  define <
    TKey extends ContainerKey,
    TService
  >(
    key: TKey,
    factory: Factory<TService, TServiceMap>
   ): IContainerBuilder<TServiceMap & { [key in TKey]: TService }> {
    return new ContainerBuilder(
      {
        ...this.factories,
        [key]: factory
      } as FactoryMap<TServiceMap & { [key in TKey]: TService }>,
      this.usedModules
    )
  }

  decorate <
    TKey extends keyof TTServiceMap,
    TTServiceMap extends TServiceMap = TServiceMap
  >(
    key: TKey,
    decorator: Decorator<TTServiceMap, TKey>
  ): IContainerBuilder<TServiceMap> {
    return new ContainerBuilder(
      {
        ...this.factories,
        [key]: decorator(
          this.factories[key as ContainerKey] as Factory<ServiceTypeOf<TTServiceMap, TKey>>
        )
      },
      this.usedModules
    )
  }

  use <
    TModuleServices extends ServiceMap,
    TRequiredServices extends TServiceMap = TServiceMap
  >(
    module: ContainerModule<TModuleServices, TRequiredServices>
  ): IContainerBuilder<TServiceMap & TModuleServices> {
    if (this.usedModules.includes(module.key)) {
      return this
    }
    return module.build(
      new ContainerBuilder(
        this.factories,
        [...this.usedModules, module.key]
      )
    )
  }

  createContainer (): IContainer<TServiceMap> {
    return new Container(this.factories)
  }
}

export default ContainerBuilder
