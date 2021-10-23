import type { FastifyInstance, FastifyInstanceBuilder, FastifyServerRunner } from '../../fastify/types'
import type * as keys from './keys'

type FastifyServices = {
  [keys.fastifyInstanceBuilders]: FastifyInstanceBuilder[]
  [keys.fastifyInstance]: FastifyInstance
  [keys.fastifyServerRunner]: FastifyServerRunner
}

export default FastifyServices
