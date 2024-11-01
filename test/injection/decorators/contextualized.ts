import { deepStrictEqual } from 'node:assert'
import { describe, test } from 'node:test'
import { Context, contextualize } from '#index'

class Uncontextualized {}

const context = 'contex'
const otherContext = 'other_context'

@contextualize(context)
class A1 {}

@contextualize(context)
class A2 {}

@contextualize(otherContext)
class B {}

@contextualize(context, otherContext)
class C {}

describe(import.meta.filename, () => {
  test('should get global context for uncontextualized', () => {
    deepStrictEqual(
      Context.getAllVisible(Uncontextualized),
      new Set([Context.global]),
    )
  })
  test('should register same context', () => {
    deepStrictEqual(
      Context.getAllVisible(A1).intersection(Context.getAllVisible(A2)),
      new Set([Context.global, Context.getFromId(context)]),
    )
  })
  test('should register new contexts', () => {
    deepStrictEqual(
      Context.getAllVisible(A1).intersection(Context.getAllVisible(B)),
      new Set([Context.global]),
    )
  })
  test('should register multiple contexts', () => {
    deepStrictEqual(
      Context.getAllVisible(A1).intersection(Context.getAllVisible(C)),
      new Set([Context.global, Context.getFromId(context)]),
    )
  })
  test('should register multiple contexts in different order', () => {
    deepStrictEqual(
      Context.getAllVisible(C).intersection(Context.getAllVisible(A1)),
      new Set([Context.global, Context.getFromId(context)]),
    )
  })
})
