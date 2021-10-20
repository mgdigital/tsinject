# tsinject

Lightweight and flexible dependency injection container for Typescript

## Motivation

Several dependency injection solutions exist for TypeScript. Most use either decorators ([Inversify](https://github.com/inversify/InversifyJS); [TSyringe](https://github.com/microsoft/tsyringe)) or static class properties (Angular). This has several drawbacks:

- The types of service that can be defined are restricted to class instances.
- The code of the class needs modifying to work with the container (e.g. by adding decorators or static properties).
- It will only work with the `expermentalDecorators` option enabled.

tsinject adopts an alternative approach with several objectives:

- Flexibility and reusability of components
- Avoiding global side effects
- Achieving loose coupling in large applications

tsinject works by defining named factory functions in a container builder, with unique symbols mapping services available in the container to their type. These factory functions can return anything, allowing configuration objects, class instances, functions or any other type of value to be defined as a container service. Any code can be containerized without need for modifications such as annotations or static properties.

Any application that does something useful needs to cause side effects. These might include:

- Reading or writing some data in a database
- Checking the current date and time
- Asking the user for input
- Logging a message to the console

These capabilities are implemented by components of the application, with some components depending on others, and with the implementation or configuration of components often depending on values read from the environment. The quickest way to allow components to communicate with each other is often via globally defined singleton instances. This increases complexity, making code more difficult to debug, test and maintain. Instead, by building components that have their dependencies injected, we can create complex but decoupled applications.

## Usage

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

We can then create a [[ContainerModule]] by defining a factory function for each service key (see [./examples/container/loggingModule/module.ts](https://github.com/mgdigital/tsinject/blob/main/examples/container/loggingModule/module.ts)):

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
> = builder => builder
  .use(processEnvModule.default)
  .define(
    keys.loggerConfig,
    container => loggerConfigFromEnv(
      container.get(processEnvModule.keys.processEnv)
    )
  )
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

export default loggingModule
```

We can now create a container from this module, get the logger service from the container and log something:

```typescript
import type { ContainerBuilder } from '@mgdigital/tsinject'
import * as loggingModule from './examples/container/loggingModule'

const container = ContainerBuilder.create()
  .use(loggingModule)
  .createContainer()

const logger = container.get(loggingModule.keys.logger)

logger.info('Logging something!')
```

Note that we shouuld only call [[IContainer.get]] from within a factory function or from the [composition root](https://freecontent.manning.com/dependency-injection-in-net-2nd-edition-understanding-the-composition-root/), avoiding the [service locator anti-pattern](https://freecontent.manning.com/the-service-locator-anti-pattern/).

And that's it! Using the container we can build large and complex but loosely coupled applications from small, simple and easily testable components.

See the [examples](https://github.com/mgdigital/tsinject/tree/main/examples) folder for a more complete application. It includes a simple tasks service with a REST API that can be started with `yarn example:start`.
