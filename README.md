# tsinject

Lightweight and flexible dependency injection container for Typescript

## Motivation

Several dependency injection solutions exist for TypeScript. Most use either decorators (Inversify; TSyringe) or static class properties (Angular). This has several drawbacks:

- The types of service that can be defined are restricted to class instances.
- The code of the class needs modifying to work with the container (e.g. by adding decorators or static properties).
- It will only work with the `expermentalDecorators` option enabled.

tsinject adopts an alternative approach with several objectives:

### Flexibility

tsinject works by defining named factory functions in a container builder, with unique symbols mapping services available in the container to their type. These factory functions can return anything, allowing configuration objects, class instances, functions or any other type of value to be defined as a container service. Any code can be containerized without need for modifications such as annotations or static properties.

### Avoiding global side effects

Any application that does something useful needs to cause side effects. These might include:

- Reading or writing some data in a database
- Checking the current date and time
- Asking the user for input
- Logging a message to the console

These capabilities are implemented by components of the application, with some components depending on others, and with the implementation or configuration of components often depending on values read from the environment. The quickest way to allow components to communicate with each other is often via globally defined singleton instances. This increases complexity, making code more difficult to debug, test and maintain. Instead, by building components that have their dependencies injected, we can create complex but decoupled applications.

Take the simple example of a timer, that has this type signature:

```typescript
type HighResTimer = () => () => number
```

When we call the timer, it records the current microtime, and returns a function that when called, subtracts it from the microtime at that moment, thereby returning the duration between the 2 function calls. To time this duration, we must read the start and end time from the system clock. When we come to test our code, we have a problem because the function is not deterministic. The side effect being caused is inaccessible from the code of our test, so we'll have to either use monkey-patching to spoof the current time, or start a separate timer and test that the result is only roughly correct.

Consider this implementation. Firstly, the side effect (a function that gets the current high resolution time) is implemented in isolation:

```typescript
type GetHighResTime = () => bigint

const getHighResTime: GetHighResTime = () =>
  process.hrtime.bigint()
```

The timer function can now be implemented with an injected system clock, and avoids causing a global side effect:

```typescript
const highResTimer = (getHighResTime: GetHighResTime): HighResTimer => () => {
  const startTime = getHighResTime()
  return () => Number(getHighResTime() - startTime)
}
```

This makes our test implementation relatively simple:

```typescript
const startTime = BigInt(Math.pow(11, 14)) // Some number roughly as large as the current microtime
const duration = 1234
const endTime = startTime + BigInt(duration)
const getHighResTime = jest.fn() // Create a mock timer that will supply the start and end time
  .mockReturnValueOnce(startTime)
  .mockReturnValueOnce(endTime)
const startTimer = highResTimer(getHighResTime)
const getDuration = startTimer() // The timer is started at `startTime`
expect(getDuration()).toEqual(duration) // `getDuration` returns the correct duration based on the `endTime`
```

To define this component as a container module, we create globally unique keys (in `keys.ts`) that represent the services provided by the module:

```typescript
export const getHighResTime = Symbol('getHighResTime')
export const highResTimer = Symbol('highResTimer')
```

And we create a [[ServiceMap]] for the module, mapping the keys to the service types they represent:

```typescript
import * as keys from './keys'

export type ServiceMap = {
  [keys.getHighResTime]: GetHighResTime
  [keys.highResTimer]: HighResTimer
}
```

We can now declare a resusable [[ContainerModule]]:

```typescript
const containerModule: ContainerModule<ServiceMap> = builder => builder
  .define(
    keys.getHighResTime,
    () => utils.getHighResTime
  )
  .define(
    keys.highResTimer,
    container => utils.highResTimer(
      container.get(keys.getHighResTime)
    )
  )
```
