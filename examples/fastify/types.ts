import type { FastifyInstance as _FastifyInstance } from 'fastify'

export type FastifyInstance = _FastifyInstance

export type FastifyInstanceBuilder = (instance: FastifyInstance) => FastifyInstance

export type FastifyServerRunner = (port: number) => Promise<void>
