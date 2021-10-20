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
export type ServiceMap<
  TKey extends ContainerKey = ContainerKey,
  T = unknown
> = {
  [key in TKey]: T
}

export type ServiceTypeOf<
  TServices extends ServiceMap,
  TKey extends keyof TServices
> =
  TServices[TKey] extends infer T ? T : never

/**
 * Container interface.
 *
 * @typeParam TServiceMap - The [[ServiceMap]] of the container.
 */
export interface IContainer<
  TServiceMap extends ServiceMap = ServiceMap
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
    TKey extends keyof TServiceMap = keyof TServiceMap
  >(
    key: TKey
  ) => ServiceTypeOf<TServiceMap, TKey>

  /**
   * Check if a container key is defined in the container.
   *
   * @typeParam TKey - The container key of the service to check.
   * @typeParam T - The type of the service to check.
   * @param key - The container key of the service to check.
   */
  has: <
    TKey extends keyof TServiceMap = keyof TServiceMap
  >(
    key: TKey
  ) => this is IContainer<{ [k in TKey]: ServiceTypeOf<TServiceMap, TKey> }>
}

/**
 * Container builder interface.
 *
 * @typeParam TServiceMap - The [[ServiceMap]] of services currently defined in the builder.
 */
export interface IContainerBuilder<
  TServiceMap extends ServiceMap = ServiceMap
> {
  /**
   * Define a service in the container builder.
   *
   * @typeParam TKey - The container key of the service.
   * @typeParam TService - The type of the service being defined.
   */
  define: <
    TKey extends ContainerKey = ContainerKey,
    TService = unknown
  >(
    key: TKey,
    factory: Factory<TService, TServiceMap>
  ) => IContainerBuilder<TServiceMap & { [key in TKey]: TService }>

  /**
   * Decorate a service already defined in the builder.
   *
   * @typeParam TKey - The container key of the service.
   * @typeParam TTServiceMap - The [[ServiceMap]] of services required by the service.
   */
  decorate: <
    TKey extends keyof TTServiceMap = keyof TServiceMap,
    TTServiceMap extends TServiceMap = TServiceMap
  >(
    key: TKey,
    decorator: Decorator<TTServiceMap, TKey>
  ) => IContainerBuilder<TServiceMap>

  /**
   * Use a [[ContainerModule]] in this builder.
   *
   * @typeParam TModuleServices - The [[ServiceMap]] of services provided by the module.
   */
  use: <
    TModuleServices extends ServiceMap
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
 * @typeParam TServiceMap - The type of the [[ServiceMap]] that the service depends on.
 */
 export type Factory<
 T,
 TServiceMap extends ServiceMap = ServiceMap
> = (container: IContainer<TServiceMap>) => T

/**
 * A function that can extend a factory.
 */
export type Decorator<
 TServiceMap extends ServiceMap = ServiceMap,
 TKey extends keyof TServiceMap = keyof TServiceMap
> = (factory: Factory<ServiceTypeOf<TServiceMap, TKey>, TServiceMap>) =>
 Factory<ServiceTypeOf<TServiceMap, TKey>, TServiceMap>

/**
 * A container module encapsulates one or more calls to an [[IContainerBuilder]] as a reusable component.
 *
 * @typeParam TProvidedServices - The type of the [[ServiceMap]] being provided by the module.
 * @typeParam TRequiredServices - The type of the [[ServiceMap]] that the module depends on.
 * @param builder - A [[ContainerBuilder]] instance with the required services defined.
 * @returns A [[ContainerBuilder]] instance with the provided services defined.
 */
export type ContainerModule<
  TProvidedServices extends ServiceMap = ServiceMap,
  TRequiredServices extends ServiceMap = ServiceMap
> = (builder: IContainerBuilder<TRequiredServices>) =>
  IContainerBuilder<TRequiredServices & TProvidedServices>

/**
 * A map of container keys to factory functions (used internally).
 */
export type FactoryMap<
 TServiceMap extends ServiceMap = ServiceMap
> = {
 [key in keyof TServiceMap]: Factory<ServiceTypeOf<TServiceMap, key>, TServiceMap>
}
