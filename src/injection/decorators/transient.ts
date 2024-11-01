import { Metadata } from '#injection/metadata'
import { type ProviderClassType, ProviderScope } from '#injection/provider'
import { Contract } from '#internal/contract'

/**
 * All providers are by default `singleton`, meaning they are instantiated
 * once and reused. However, [`@transient`](#transient) classes will be
 * instantiated every time they are requested.
 *
 * @remarks
 * Similar to [`@isolated`](#isolated), but the difference is that
 * [`transient`](#transient) creates a new instance every time while
 * [`isolated`](#isolated) creates a new instance **per context**
 * (meaning "different context, different instance").
 *
 * @example
 * ```typescript
 * @provider
 * class Provider {}
 *
 * @transient
 * @provider
 * class TransientProvider {}
 *
 * class Providers {
 *   @provide(Provider)
 *   private readonly provider!: Provider
 *
 *   @provide(Provider)
 *   private readonly otherProvider!: Provider
 *
 *   // ^ These will be the same instance (`singleton`)
 *
 *   @provide(TransientProvider)
 *   private readonly transientProvider!: TransientProvider
 *
 *   @provide(TransientProvider)
 *   private readonly otherTransientProvider!: TransientProvider
 *
 *   // ^ These will be different instances (`transient`)
 * }
 * ```
 */
export function transient(
  target: ProviderClassType,
  context: ClassDecoratorContext<typeof target>,
) {
  const metadata = Metadata.fromContext(context)
  Contract.MULTIPLE_PROVIDER_SCOPE_MODIFIER.check(
    target,
    metadata,
    transient.name,
  )
  metadata.providerScope = ProviderScope.TRANSIENT
}
