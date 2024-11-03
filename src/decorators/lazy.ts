import { MultipleScopeModifierError } from '../lib/error'
import { Strategy } from '../lib/strategy'
import { Metadata } from '../metadata'
import type { ProviderClassType } from '../provider'

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
export function lazy(
  target: ProviderClassType,
  context: ClassDecoratorContext<typeof target>,
) {
  const metadata = Metadata.fromContext(context)
  if (metadata.strategy !== Strategy.DEFAULT) {
    throw new MultipleScopeModifierError(
      target.name,
      metadata.strategy,
      lazy.name,
    )
  }
  metadata.strategy = Strategy.LAZY
}