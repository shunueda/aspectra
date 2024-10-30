[//]: # (
    DO NOT EDIT THIS FILE DIRECTLY
    run `pnpm run build:docs` to regenerate
  )


<div align='center'><img src='assets/banner.svg' alt='assets/banner.svg'></div>


<div align='center'><h3>aspectra</h3></div>


<div align='center'>The decorator library.</div>


<br />


> This package provides **stage 3 (stable) decorators.**
> `experimentalDecorators` must be **DISABLED** in `tsconfig.json`



### Features



#### decorators



- [`autobind`](#autobind)



- [`bound`](#bound)



- [`entry`](#entry)



- [`main`](#main)



- [`memoize`](#memoize)



- [`sealed`](#sealed)



- [`singleton`](#singleton)



#### injection



- [`contextualized`](#contextualized)



- [`provide`](#provide)



- [`provider`](#provider)



---



### decorators



#### `autobind`



Automatically binds all class methods to the instance.





```typescript
@autobind
class Example {
  private readonly name = 'John'

  public greet() {
    console.log(`Hello from ${this.name}`)
  }

  public farewell() {
    console.log(`Goodbye from ${this.name}`)
  }
}

const { greet, farewell } = new Example()
greet() // 'Hello from John'
farewell() // 'Goodbye from John'
```


### 



#### `bound`



Binds a class method to its instance.





```typescript
class Example {
  private readonly name = 'John'

  @bound public greet() {
    console.log(`Hello from ${this.name}`)
  }
}

const { greet } = new Example()
greet() // 'Hello from John'
```


### 



#### `entry`



Automatically invokes a class's static `main` method.


> The target class must include a static `main` method.



```typescript
@entry
class Main {
  public static main() {
    console.log('Hello, World!')
  }
}
```


### 



#### `main`



Automatically invokes a decorated method.





```typescript
import { main } from 'aspectra'

class Main {
  @main public static start() {
    console.log('Hello, World!')
  }
}
```


### 



#### `memoize`



Memoizes the method. Usful for optimizing expensive computations.





```typescript
class Calculator {
  @memoize
  public square(num: number): number {
    console.log('Calculating...')
    return num * num
  }
}

const calculator = new Calculator()
console.log(calculator.square(2)) // Calculating... 4
console.log(calculator.square(2)) // 4
```


### 



#### `sealed`



Seals a class, preventing it from being extended.


> Error is thrown when attempting to instantiate a derived class.



```typescript
@sealed
class Base {}

class Derived extends Base {}

const instance = new Derived() // throws
```


### 



#### `singleton`



Makes a class singleton, ensuring that only one instance of the class is created.





```typescript
@singleton
class Person {
  public readonly id = Math.random()
}

const john = new Person()
const jane = new Person()

john.id === jane.id // true
```


### injection



#### `contextualized`



Injection is contextualized. This allows a manual control of the context.
(Note: Read [`@provider`](#provider) and [`@provide`](#provide) first for
better understanding.)

`provider`s are stored in a `container`, which is registered in a `context`.
You won't have to worry about this. By default, all `provider`s are stored
in a primary context, however, there might be a case you want to create an
isolated context; for example, when you want to run tests
([Example](https://github.com/shunueda/aspectra/blob/main/test/decorators/injection/provide.ts)).


> Use of this decorator is optional, even if you want to manually controll the
> context. Just like the example below, you can add a static field
> `[Aspectra.context]`. However, `@contextualized` will check for the existence
> of this field at compile time, so it is recommended for better type safety.



```typescript
const context = 'custom_context'

@contextualized
@provider
class Provider {
  public static readonly [Aspectra.context] = context
}

@contextualized
class Consumer {
  public static readonly [Aspectra.context] = context

  // this will be resolved from the same context as `Provider`
  @provide(Provider)
  public readonly provider!: Provider
}

class OutOfContextConsumer {
  // this will fail at runtime as the context is different of that of `Provider`
  // `@provide` will attemp to resolve from the primary context (and fail)
  @provide(Provider)
  public readonly provider!: Provider
}
```


### 



#### `provide`



Inject a [`@provider`](#provider) into a class field.


> If an `identifier` is provided (`string` or `symbol`), this will be used to
> resolve the dependency.
> 
> Even if a provider is injected multiple times, **same** instance will
> be returned every time.



```typescript
class Providers {
  @provide(SampleProvider)
  // notice the `!` for definite assignment
  private readonly provider!: SampleProvider;

  // with a custom name
  @provide('custom_name')
  private readonly namedProvider!: NamedProvider;

  // this will be a same instance as the `provider` above
  @provide(SampleProvider)
  private readonly second_provider!: SampleProvider;
}
```


### 



#### `provider`



Registers a class as a provider, allowing it to be injected via
[`@provide`](#provide).


> You can set a custom `identifier` (`string` or `symbol`).



```typescript
@provider
class SampleProvider {
  // ...
}

@provider('custom_name')
class NamedSampleProvider {
  // ...
}
```