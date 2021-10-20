import type { FastifyInstance } from 'fastify'
import type { ServerRunner } from './types'
import type { ILogger } from '../logging/types'

const runFastifyServer = (
  fastify: FastifyInstance,
  logger: ILogger
): ServerRunner =>
  async port =>
    fastify.listen(port)
      .then(address => logger.info(`Server listening at ${address} with routes:\n\n${fastify.printRoutes()}`))
      .catch((error: Error) => {
        logger.error(`Error starting server: ${error.message}`, { error })
        process.exit(1)
      })

export default runFastifyServer
