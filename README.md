# @mgdigital/tsinject

Lightweight and flexible dependency injection container for TypeScript.

[![npm version](https://badge.fury.io/js/@mgdigital%2Ftsinject.svg)](https://badge.fury.io/js/@mgdigital%2Ftsinject) [![codecov](https://codecov.io/gh/mgdigital/tsinject/branch/main/graph/badge.svg)](https://codecov.io/gh/mgdigital/tsinject) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/mgdigital/tsinject.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/mgdigital/tsinject/context:javascript)

## Documentation

Install with `npm add @mgdigital/tsinject` or `yarn add @mgdigital/tsinject`.

See [the documentation](https://mgdigital.github.io/tsinject/).

## Motivation

Several dependency injection solutions exist for TypeScript. Most use either decorators ([Inversify](https://github.com/inversify/InversifyJS); [TSyringe](https://github.com/microsoft/tsyringe)) or static class properties (Angular). This has several drawbacks:

<span style="color:red">&cross;</span> The types of service that can be defined are restricted to class instances.

<span style="color:red">&cross;</span> The code of the class needs modifying to work with the container (e.g. by adding decorators or static properties).

<span style="color:red">&cross;</span> It will only work with the `experimentalDecorators` compiler option enabled.

**tsinject** adopts an alternative approach with several objectives:

<span style="color:green">&check;</span> Flexibility, composability and reusability of components

<span style="color:green">&check;</span> Sharing global resources while avoiding global side effects

<span style="color:green">&check;</span> Achieving loose coupling in large applications

**tsinject** works by defining named factory functions in a container builder, with unique symbols mapping services available in the container to their type. These factory functions can return anything, allowing configuration objects, class instances, functions or any other type of value to be defined as a container service. Any code can be containerized without need for modifications such as annotations or static properties.

Any application that does something useful needs to cause side effects. These might include:

- Reading or writing some data in a database
- Checking the current date and time
- Asking the user for input
- Logging a message to the console

These capabilities are implemented by components of the application, with some components depending on others, and with the implementation or configuration of components often depending on values read from the environment. The quickest way to allow components to communicate with each other is often via globally defined singleton instances. Importing these global side effects throughout an application can increase complexity, making code more difficult to debug, test and maintain. Instead, by building components that have their dependencies injected, we can create complex but decoupled applications.

## Usage

### Creating a container module and defining services

Take the example of a logging component, that defines services in a container using the following keys (see [./examples/container/loggingModule/keys.ts](https://github.com/mgdigital/tsinject/blob/main/examples/container/loggingModule/keys.ts)):

```typescript
export const loggerConfig = Symbol('loggerConfig') // Provides config values for other logger services
export const logFormatter = Symbol('logFormatter') // Formats log data to a log line string
export const logWriter = Symbol('logWriter') // Writes log lines, e.g. to the console or to a file
export const logger = Symbol('logger') // The logger service that will be used by consumers of this component
```

We can make a map of container keys to the type of service they represent (see [./examples/container/loggingModule/services.ts](https://github.com/mgdigital/tsinject/blob/main/examples/container/loggingModule/services.ts)):

```typescript
import type { ILogger, LogFormatter, LoggerConfig, LogWriter } from '../../logging/types'
import type * as keys from './keys'

type LoggingServices = {
  [keys.loggerConfig]: LoggerConfig
  [keys.logFormatter]: LogFormatter
  [keys.logWriter]: LogWriter
  [keys.logger]: ILogger
}

export default LoggingServices
```

We can then create a [ContainerModule](https://mgdigital.github.io/tsinject/modules.html#ContainerModule) by defining a factory function for each service key (see [./examples/container/loggingModule/module.ts](https://github.com/mgdigital/tsinject/blob/main/examples/container/loggingModule/module.ts)):

```typescript
import type { ContainerModule } from '@mgdigital/tsinject'
import type LoggingServices from './services'
import * as processEnvModule from '../processEnvModule'
import * as keys from './keys'
import consoleLogWriter from '../../logging/consoleLogWriter'
import Logger from '../../logging/Logger'
import loggerConfigFromEnv from '../../logging/config/loggerConfigFromEnv'
import prettyLogFormatter from '../../logging/prettyLogFormatter'
import simpleLogFormatter from '../../logging/simpleLogFormatter'

const loggingModule: ContainerModule<
  processEnvModule.services &
  LoggingServices
> = {
  // Specify a unique key for the module
  key: Symbol('loggingModule'),
  build: builder => builder
    // Use another container module that provides services required by this one
    .use(processEnvModule.default)
    // Define a config object based on environment variables
    .define(
      keys.loggerConfig,
      container => loggerConfigFromEnv(
        container.get(processEnvModule.keys.processEnv)
      )
    )
    // Provide a different implementation depending on environment variable configuration
    .define(
      keys.logFormatter,
      container => container.get(keys.loggerConfig).pretty
        ? prettyLogFormatter
        : simpleLogFormatter
    )
    .define(
      keys.logWriter,
      () => consoleLogWriter
    )
    .define(
      keys.logger,
      container => new Logger(
        container.get(keys.logFormatter),
        container.get(keys.logWriter),
        container.get(keys.loggerConfig).level
      )
    )
}

export default loggingModule
```

We can now create a container from this module, get the logger service from the container and log something:

```typescript
import { newContainerBuilder } from '@mgdigital/tsinject'
import * as loggingModule from './examples/container/loggingModule'

const container = newContainerBuilder()
  .use(loggingModule.default)
  .createContainer()

const logger = container.get(loggingModule.keys.logger)

logger.info('Logging something!')
```

**Note:** We should only call [Container.get](https://mgdigital.github.io/tsinject/interfaces/Container.html#get) from within a factory function or from the [composition root](https://freecontent.manning.com/dependency-injection-in-net-2nd-edition-understanding-the-composition-root/), avoiding the [service locator anti-pattern](https://freecontent.manning.com/the-service-locator-anti-pattern/).

### Decorators

Decorators allow us to modify an already-defined service. Let's create a custom logging module that decorates some of the services in the base module defined above:


```typescript
import type { ContainerModule } from '@mgdigital/tsinject'
import * as loggingModule from './examples/container/loggingModule'

const customLoggingModule: ContainerModule<
  loggingModule.services
> = {
  key: Symbol('customLoggingModule'),
  build: builder => builder
    .use(loggingModule.default)
    // Decorate the logger config so that output is always pretty
    .decorate(
      loggingModule.keys.loggerConfig,
      factory => container => ({
        ...factory(container),
        pretty: true
      })
    )
    // Decorate the log formatter to append an exclamation mark to all log entries
    .decorate(
      loggingModule.keys.logFormatter,
      factory => container => {
        const baseFormatter = factory(container)
        return (level, message, data) =>
          baseFormatter(level, message, data) + '!'
      }
    )
    // Overwrite the log writer with some other implementation
    .decorate(
      loggingModule.keys.logWriter,
      () => () => myCustomLogWriter
    )
}
```

We can also use decorators to achieve features that aren't explicitly implemented in this library, such as service tagging, which we can do by defining a service as an array:

```typescript
import type { ContainerModule } from '@mgdigital/tsinject'

type TaggedServiceType = { foo: string }

const serviceTag = Symbol('serviceTag')

type ServiceMap = {
  [serviceTag]: TaggedServiceType[]
}

const myModule: ContainerModule<
  ServiceMap
> = {
  key: Symbol('myModule'),
  build: builder => builder
    .define(
      serviceTag,
      () => []
    )
}

const myOtherModule: ContainerModule<
  ServiceMap
> = {
  key: Symbol('myOtherModule'),
  build: builder => builder
    .use(myModule)
    .decorate(
      serviceTag,
      // Add a service to the array of already defined services
      factory => container => [
        ...factory(container),
        { foo: 'bar' }
      ]
    )
}
```

And that's it - unlike some other DI containers that claim to be lightweight, tsinject really is tiny and has a simple API, allowing large and complex but loosely coupled applications to be built from small, simple and easily testable components.

See the [examples](https://github.com/mgdigital/tsinject/tree/main/examples) folder for a more complete application. It includes a simple tasks service with a REST API that can be started by cloning this repository and running `yarn install`, `yarn build` then `yarn example:start`.

---

Copyright (c) 2021 Mike Gibson, https://github.com/mgdigital
