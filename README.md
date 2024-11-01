[//]: # (
    DO NOT EDIT THIS FILE DIRECTLY
    run `pnpm run build:docs` to regenerate
  )


<div align='center'><img src='assets/banner.svg' alt='assets/banner.svg'></div>


<div align='center'><h3>aspectra</h3></div>


<div align='center'>The decorator framework.</div>


### Installation



This library provides **stable (stage 3) decorators**. Set the following options in your `tsconfig.json`:


> `"experimentalDecorators": false` // or remove this line



### Features




  | injection | general |
  | - | - |
  | [`provider`](#provider)<br>[`provide`](#provide)<br>[`contextualize`](#contextualize)<br>[`isolated`](#isolated)<br>[`lazy`](#lazy)<br>[`local`](#local)<br>[`transient`](#transient) | [`autobind`](#autobind)<br>[`bound`](#bound)<br>[`main`](#main)<br>[`memoized`](#memoized)<br>[`sealed`](#sealed)<br>[`singleton`](#singleton) |
  


---



### injection



#### `provider`



Registers a class as a provider, allowing it to be injected via
[`@provide`](#provide).





```typescript
@provider
class DatabaseProvider {
  public getAll() {
    // ...
  }
}
```





#### `provide`



Inject a [`@provider`](#provider) into a class field.


> Regardless of how many times it is injected, the same instance will be
> returned each time.



```typescript
class Providers {
  @provide(SampleProvider)
  // notice the `!` for definite assignment
  private readonly provider!: SampleProvider;

  // this will be the same instance as the `provider` above
  @provide(SampleProvider)
  private readonly second_provider!: SampleProvider;
}
```





#### `contextualize`



Associates a class with one or more contexts, allowing for contextualized
dependency injection.

With a combination with other decorators, you can have a fine-grained control
over the scope of a provider.

<div align='center'>
  <img src='assets/context-control.png' alt='context-controlled-provider'>
</div>





```typescript
const contextId = 'custom_context';
const otherContextId = 'other_context';

@contextualize(contextId)
@provider
class Provider {}

// You can also contextualize into multiple contexts
@contextualize(contextId, otherContextId)
class Consumer {
  // This provider is resolved within the same context as `Provider`
  @provide(Provider)
  public readonly provider!: Provider;
}

class OutOfContextConsumer {
  // This injection will fail at runtime as it defaults to the global context,
  // which does not contain the `Provider` instance from `custom_context`
  @provide(Provider)
  public readonly provider!: Provider;
}
```





#### `isolated`



Marks a provider as `@isolated`, ensuring that a unique instance is created
for each context.





```typescript
@isolated
@provider
class Logger {
  public readonly id = generateId()
}

@contextualize('database')
@provider
class Database {
  @provide(Logger)
  public logger!: Logger // first instance
}

@contextualize('printer')
@provider
class Printer {
  @provide(Logger)
  public logger!: Logger // new instance
}
```





#### `lazy`



Marks a class as lazy-loaded.


> All providers are by default instantiated when [`@provide`](#provide)d. When a class is
> marked [`@lazy`](#lazy), it will only be instantiated when it is first requested.



```typescript
@provider
class Provider {}

@lazy
@provider
class LazyProvider {}

class Providers {
  // `Provider` will be instantiated immediately
  @provide(Provider)
  private readonly provider!: Provider

  @provide(LazyProvider)
  private readonly lazyProvider!: LazyProvider
}

// `LazyProvider` will be instantiated here
const providers = new Providers()
```





#### `local`



Marks a class as `@local`, restricting its access to specific contexts and
preventing it from being exposed globally. (By default, providers are global
even if [`@contextualize`](#contextualize)d.)


> If a [`@local`](#local) provider is not paired with a context using
> [`@contextualize`](#contextualize), it will trigger a runtime error as it
> cannot be accessed by any consumers.



```typescript
@local
@contextualize('custom_context')
@provider
class LocalService {
  // This service will only be accessible within 'custom_context'
}

@contextualize('custom_context')
@provider
class CustomContext {
  // This service will be accessible in both 'custom_context' & global context
}

@contextualize('custom_context')
@local
class LocalConsumer {
  // This consumer will only be able to access 'LocalService' within 'custom_context'
  // will not look up in global context
  @provide(LocalService)
  private readonly service!: LocalService
}
```





#### `transient`



All providers are by default `singleton`, meaning they are instantiated
once and reused. However, [`@transient`](#transient) classes will be
instantiated every time they are requested.


> Similar to [`@isolated`](#isolated), but the difference is that
> [`transient`](#transient) creates a new instance every time while
> [`isolated`](#isolated) creates a new instance **per context**
> (meaning "different context, different instance").



```typescript
@provider
class Provider {}

@transient
@provider
class TransientProvider {}

class Providers {
  @provide(Provider)
  private readonly provider!: Provider

  @provide(Provider)
  private readonly otherProvider!: Provider

  // ^ These will be the same instance (`singleton`)

  @provide(TransientProvider)
  private readonly transientProvider!: TransientProvider

  @provide(TransientProvider)
  private readonly otherTransientProvider!: TransientProvider

  // ^ These will be different instances (`transient`)
}
```


### general



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





#### `memoized`



Memoizes the method. Usful for optimizing expensive computations.





```typescript
class Calculator {
  @memoized public square(num: number): number {
    console.log('Calculating...')
    return num * num
  }
}

const calculator = new Calculator()
console.log(calculator.square(2)) // Calculating... 4
console.log(calculator.square(2)) // 4
```





#### `sealed`



Seals a class, preventing it from being extended.


> Error is thrown when attempting to instantiate a derived class.



```typescript
@sealed
class Base {}

class Derived extends Base {}

const instance = new Derived() // throws
```





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