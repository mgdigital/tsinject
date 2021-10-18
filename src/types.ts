/**
 * Container keys can be `symbol`s or `string`s. Using `unique symbol`s is recommended.
 */
export type ContainerKey = symbol | string

/**
 * A map of container keys to the type of the service they represent.
 *
 * @typeParam TKey - The type of the container key.
 * @typeParam T - The type of the service.
 */
export type ContainerServiceMap<
  TKey extends ContainerKey = ContainerKey,
  T = unknown
> = {
  [key in TKey]: T
}

/**
 * Container interface.
 *
 * @typeParam TServiceMap - The [[ContainerServiceMap]] of the container.
 */
export interface IContainer<
  TServiceMap extends ContainerServiceMap = ContainerServiceMap
> {
  /**
   * Get all keys defined in the container.
   */
  keys: ContainerKey[]

  /**
   * Get a service from the container.
   *
   * @typeParam TKey - The type of the container key of the service to get.
   * @typeParam T - The type of the service to get.
   * @param key - The container key of the service to get.
   */
  get: <
    TKey extends keyof TServiceMap = keyof TServiceMap,
    T extends TServiceMap[TKey] = TServiceMap[TKey]
  >(
    key: TKey
  ) => T

  /**
   * Check if a container key is defined in the container.
   *
   * @typeParam TKey - The container key of the service to check.
   * @typeParam T - The type of the service to check.
   * @param key - The container key of the service to check.
   */
  has: <
    TKey extends keyof TServiceMap = keyof TServiceMap,
    T extends TServiceMap[TKey] = TServiceMap[TKey]
  >(
    key: TKey
  ) => this is IContainer<{ [k in TKey]: T }>
}

/**
 * Container builder interface.
 *
 * @typeParam TServiceMap - The [[ContainerServiceMap]] of services currently defined in the builder.
 */
export interface IContainerBuilder<
  TServiceMap extends ContainerServiceMap = ContainerServiceMap
> {
  /**
   * Define a service in the container builder.
   *
   * @typeParam TKey - The container key of the service.
   * @typeParam TService - The type of the service being defined.
   */
  define: <
    TKey extends ContainerKey,
    TService
  >(
    key: TKey,
    factory: Factory<TService, TServiceMap>
  ) => IContainerBuilder<TServiceMap & Record<TKey, TService>>

  /**
   * Decorate a service already defined in the builder.
   *
   * @typeParam TKey - The container key of the service.
   * @typeParam TTServiceMap - The [[ContainerServiceMap]] of services required by the service.
   */
  decorate: <
    TKey extends keyof TTServiceMap,
    TTServiceMap extends TServiceMap = TServiceMap
  >(
    key: TKey,
    decorator: Decorator<TTServiceMap, TKey>
  ) => IContainerBuilder<TServiceMap>

  /**
   * Use a [[ContainerModule]] in this builder.
   *
   * @typeParam TModuleServices - The [[ContainerServiceMap]] of services provided by the module.
   */
  use: <
    TModuleServices extends ContainerServiceMap
  >(
    module: ContainerModule<TModuleServices, TServiceMap>
  ) => IContainerBuilder<TServiceMap & TModuleServices>

  /**
   * Create a [[IContainer]] with all the services defined in the builder.
   */
  createContainer: () => IContainer<TServiceMap>
}

/**
 * A function that can create a service using a container of its dependencies.
 *
 * @typeParam T - The type of the service.
 * @typeParam TServiceMap - The type of the [[ContainerServiceMap]] that the service depends on.
 */
 export type Factory<
 T,
 TServiceMap extends ContainerServiceMap = ContainerServiceMap
> = (container: IContainer<TServiceMap>) => T

/**
 * A function that can extend a factory.
 */
export type Decorator<
 TServiceMap extends ContainerServiceMap = ContainerServiceMap,
 TKey extends keyof TServiceMap = keyof TServiceMap
> = (factory: Factory<TServiceMap[TKey], TServiceMap>) =>
 Factory<TServiceMap[TKey], TServiceMap>

/**
 * A container module encapsulates one or more calls to an [[IContainerBuilder]] as a reusable component.
 *
 * @typeParam TProvidedServiceMap - The type of the [[ContainerServiceMap]] being provided by the module.
 * @typeParam TRequiredServiceMap - The type of the [[ContainerServiceMap]] that the module depends on.
 * @param builder - A [[ContainerBuilder]] instance with the required services defined.
 * @returns A [[ContainerBuilder]] instance with the provided services defined.
 */
export type ContainerModule<
  TProvidedServiceMap extends ContainerServiceMap = ContainerServiceMap,
  TRequiredServiceMap extends ContainerServiceMap = ContainerServiceMap
> = (builder: IContainerBuilder<TRequiredServiceMap>) =>
  IContainerBuilder<TRequiredServiceMap & TProvidedServiceMap>

/**
 * A map of container keys to factory functions (used internally).
 */
 export type FactoryMap<
 TServiceMap extends ContainerServiceMap = ContainerServiceMap
> = {
 [key in keyof TServiceMap]: Factory<TServiceMap[key], TServiceMap>
}
