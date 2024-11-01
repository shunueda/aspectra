import { type Serializable, serialize } from '#general/serialize'
import type { Fun, UnknownArgs } from '#types'

/**
 * Memoizes the method. Usful for optimizing expensive computations.
 *
 * @example
 * ```typescript
 * class Calculator {
 *   @memoized public square(num: number): number {
 *     console.log('Calculating...')
 *     return num * num
 *   }
 * }
 *
 * const calculator = new Calculator()
 * console.log(calculator.square(2)) // Calculating... 4
 * console.log(calculator.square(2)) // 4
 * ```
 */
export function memoized<T, U extends UnknownArgs & Serializable, R>(
  target: Fun<U, R, T>,
  context: ClassMethodDecoratorContext<T, typeof target>,
) {
  const cache = new Map<string, R>()
  context.addInitializer(function () {
    this[context.name as keyof T] = ((...args: U) => {
      const key = serialize(args)
      if (cache.has(key)) {
        // biome-ignore lint/style/noNonNullAssertion: Checked for existence above
        return cache.get(key)!
      }
      const result = target.call(this, ...args)
      cache.set(key, result)
      return result
    }) as T[keyof T]
  })
}
