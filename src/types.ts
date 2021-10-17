export type ContainerKey = symbol | string

export type ContainerServiceMap<
  TKey extends ContainerKey = ContainerKey,
  T = unknown
> = {
  [key in TKey]: T
}

export interface IContainer<
  TServiceMap extends ContainerServiceMap = ContainerServiceMap
> {
  keys: ContainerKey[]

  get: <
    TKey extends keyof TTServiceMap = keyof TServiceMap,
    TTServiceMap extends TServiceMap = TServiceMap
  >(
    ref: TKey
  ) => TTServiceMap[TKey]
}

export type Factory<
  T,
  TServiceMap extends ContainerServiceMap = ContainerServiceMap
> = (container: IContainer<TServiceMap>) => T

export type FactoryMap<
  TServiceMap extends ContainerServiceMap = ContainerServiceMap
> = {
  [key in keyof TServiceMap]: Factory<TServiceMap[key], TServiceMap>
}

export type Decorator<
  TServiceMap extends ContainerServiceMap = ContainerServiceMap,
  TKey extends keyof TServiceMap = keyof TServiceMap
> = (factory: Factory<TServiceMap[TKey], TServiceMap>) => Factory<TServiceMap[TKey], TServiceMap>

export interface IContainerBuilder<
  TServiceMap extends ContainerServiceMap = ContainerServiceMap
> {
  define: <
    TKey extends ContainerKey,
    TService
  >(
    key: TKey,
    factory: Factory<TService, TServiceMap>
  ) => IContainerBuilder<TServiceMap & Record<TKey, TService>>

  decorate: <
    TKey extends keyof TTServiceMap,
    TTServiceMap extends TServiceMap = TServiceMap
  >(
    key: TKey,
    decorator: Decorator<TTServiceMap, TKey>
  ) => IContainerBuilder<TServiceMap>

  use: <
    TModuleServices extends ContainerServiceMap
  >(
    module: ContainerModule<TModuleServices, TServiceMap>
  ) => IContainerBuilder<TServiceMap & TModuleServices>

  createContainer: () => IContainer<TServiceMap>
}

export type ContainerModule<
  TProvidedServiceMap extends ContainerServiceMap = ContainerServiceMap,
  TRequiredServiceMap extends ContainerServiceMap = ContainerServiceMap
> = (builder: IContainerBuilder<TRequiredServiceMap>) => IContainerBuilder<TRequiredServiceMap & TProvidedServiceMap>
