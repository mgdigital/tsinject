export type ContainerKey = symbol | string

export type ContainerServiceMap<
  TKey extends ContainerKey = ContainerKey,
  T = unknown
> = {
  [key in TKey]: T
}

export type ContainerKeyOf<TServiceMap extends ContainerServiceMap> = Extract<keyof TServiceMap, ContainerKey>

export interface IContainer<
  TServiceMap extends ContainerServiceMap = ContainerServiceMap
> {
  keys: Array<ContainerKeyOf<TServiceMap>>

  get: <
    TKey extends ContainerKeyOf<TServiceMap>
  >(
    ref: TKey
  ) => TServiceMap[TKey]
}

export type Factory<
  T,
  TDeps extends ContainerServiceMap = ContainerServiceMap
> = (container: IContainer<TDeps>) => T

export type FactoryMap<
  TDeps extends ContainerServiceMap = ContainerServiceMap
> = {
  [key in ContainerKeyOf<TDeps>]: Factory<TDeps[key], TDeps>
}

export type Decorator<
  T,
  TDeps extends ContainerServiceMap = ContainerServiceMap
> = (factory: Factory<T, TDeps>) => Factory<T, TDeps>

export interface IContainerBuilder<
  TServiceMap extends ContainerServiceMap = ContainerServiceMap
> {
  define: <
    TKey extends ContainerKey = ContainerKey,
    TService = unknown,
    TDeps extends ContainerServiceMap = ContainerServiceMap
  >(
    key: TKey,
    factory: Factory<TService, TDeps>
  ) => IContainerBuilder<TServiceMap & { [key in TKey]: TService }>

  decorate: <TKey extends ContainerKeyOf<TServiceMap>>(
    key: TKey,
    decorator: Decorator<TServiceMap[TKey], TServiceMap>
  ) => IContainerBuilder<TServiceMap>

  use: <
    TModuleServices extends ContainerServiceMap = ContainerServiceMap
  >(module: ContainerModule<TModuleServices, TServiceMap>) => IContainerBuilder<TServiceMap & TModuleServices>

  createContainer: () => IContainer<TServiceMap>
}

export type ContainerModule<
  TServiceMap extends ContainerServiceMap = ContainerServiceMap,
  TDeps extends ContainerServiceMap = ContainerServiceMap
> = (builder: IContainerBuilder<TDeps>) => IContainerBuilder<TDeps & TServiceMap>
