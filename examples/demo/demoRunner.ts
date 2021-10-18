import { HighResTimer } from '../highResTimer'
import Logger from '../logging/Logger'
import { DemoRunner } from './types'

const demoRunner = (
  startTimer: HighResTimer,
  logger: Logger,
  env: NodeJS.ProcessEnv
): DemoRunner => async () => {
  const getDuration = startTimer()
  logger.info('Logging env', { env })
  const duration = getDuration()
  logger.info('Got duration', { duration })
}

export default demoRunner
