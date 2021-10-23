import type {
  ContainerKey,
  ContainerModule,
  Decorator,
  Container,
  ContainerBuilder,
  FactoryMap,
  Factory,
  ServiceMap,
  ServiceTypeOf
} from './types'
import ContainerImpl from './ContainerImpl'

/**
 * Default implementation for [[ContainerBuilder]].
 *
 * @internal
 */
class ContainerBuilderImpl<TServiceMap extends ServiceMap>
implements ContainerBuilder<TServiceMap> {
  private constructor (
    private readonly factories: FactoryMap<TServiceMap>,
    private readonly usedModules: ContainerKey[]
  ) { }

  static create (): ContainerBuilder {
    return new ContainerBuilderImpl({}, [])
  }

  define <
    TKey extends ContainerKey,
    TService
  >(
    key: TKey,
    factory: Factory<TService, TServiceMap>
   ): ContainerBuilder<TServiceMap & { [key in TKey]: TService }> {
    return new ContainerBuilderImpl(
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
  ): ContainerBuilder<TServiceMap> {
    return new ContainerBuilderImpl(
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
  ): ContainerBuilder<TServiceMap & TModuleServices> {
    if (this.usedModules.includes(module.key)) {
      return this
    }
    return module.build(
      new ContainerBuilderImpl(
        this.factories,
        [...this.usedModules, module.key]
      )
    )
  }

  createContainer (): Container<TServiceMap> {
    return new ContainerImpl(this.factories)
  }
}

export default ContainerBuilderImpl
