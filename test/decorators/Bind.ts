import { equal } from 'node:assert'
import { describe, test } from 'node:test'
import { Bind } from 'aspectra'

class Test {
  constructor(private value: number) {}

  @Bind
  public retrieve() {
    return this.value
  }

  @Bind
  public increment() {
    this.value++
  }
}

describe(import.meta.filename, () => {
  test(`should return initial value when retrieving - @${Bind.name}`, () => {
    const { retrieve } = new Test(0)
    equal(retrieve(), 0)
  })

  test(`should correctly increment value when method is passed around - @${Bind.name}`, () => {
    const test = new Test(0)
    const { increment } = test
    increment()
    equal(test.retrieve(), 1)
  })

  test(`should increment value twice and retrieve updated value - @${Bind.name}`, () => {
    const { increment, retrieve } = new Test(0)
    increment()
    increment()
    equal(retrieve(), 2)
  })

  test(`should handle negative initial value and increment correctly - @${Bind.name}`, () => {
    const { increment, retrieve } = new Test(-5)
    equal(retrieve(), -5)
    increment()
    equal(retrieve(), -4)
  })

  test(`should handle positive initial value and increment correctly - @${Bind.name}`, () => {
    const { increment, retrieve } = new Test(10)
    equal(retrieve(), 10)
    increment()
    equal(retrieve(), 11)
  })
})
