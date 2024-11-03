import { ok } from 'node:assert'
import { describe, test } from 'node:test'
import { Context, contextualize, provider } from 'aspectra'
import { Metadata } from '../../src/metadata'

const contextId = import.meta.filename

@contextualize(contextId)
@provider
class Provider {}

describe(import.meta.filename, () => {
  test('should create a provider', () => {
    ok(
      [...Context.getAllVisible(Provider)].some(context =>
        context.container.resolve(Provider, new Metadata()),
      ),
    )
  })
})