import type { ContainerModule } from '@mgdigital/tsinject'
import type FastifyServices from './services'
import * as keys from './keys'
import * as loggingModule from '../loggingModule'
import createFastifyInstance from '../../fastify/createFastifyInstance'
import runFastifyServer from '../../fastify/runFastifyServer'

const fastifyModule: ContainerModule<
  loggingModule.services &
  FastifyServices
> = {
  key: Symbol('fastifyModule'),
  build: builder => builder
    .use(loggingModule.default)
    .define(
      keys.fastifyInstanceBuilders,
      () => []
    )
    .define(
      keys.fastifyInstance,
      container => createFastifyInstance(
        ...container.get(keys.fastifyInstanceBuilders)
      )
    )
    .define(
      keys.fastifyServerRunner,
      container => runFastifyServer(
        container.get(keys.fastifyInstance),
        container.get(loggingModule.keys.logger)
      )
    )
}

export default fastifyModule
