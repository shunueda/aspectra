import { Metadata } from '#metadata'
import { ProviderScope } from '#provider'
import type { Class } from '#types'

/**
 * Marks a class as lazy-loaded.
 *
 * @remarks
 * All providers are by default instantiated when [`@provide`](#provide)d. When a class is
 * marked [`@lazy`](#lazy), it will only be instantiated when it is first requested.
 *
 * @example
 * ```typescript
 * @provider
 * class Provider {}
 *
 * @lazy
 * @provider
 * class LazyProvider {}
 *
 * class Providers {
 *   // `Provider` will be instantiated immediately
 *   @provide(Provider)
 *   private readonly provider!: Provider
 *
 *   @provide(LazyProvider)
 *   private readonly lazyProvider!: LazyProvider
 * }
 *
 * // `LazyProvider` will be instantiated here
 * const providers = new Providers()
 * ```
 */
export function lazy<T>(
  target: Class<T>,
  context: ClassDecoratorContext<typeof target>,
) {
  Metadata.fromContext(context).providerScope = ProviderScope.LAZY
}