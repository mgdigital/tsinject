import Fastify from 'fastify'
import type { FastifyInstance, FastifyInstanceBuilder } from './types'

const createFastifyInstance = (...builders: FastifyInstanceBuilder[]): FastifyInstance =>
  builders.reduce<FastifyInstance>(
    (instance, builder) => builder(instance),
    Fastify()
  )

export default createFastifyInstance
