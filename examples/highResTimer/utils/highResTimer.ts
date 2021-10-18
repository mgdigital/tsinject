import type { GetHighResTime, HighResTimer } from '../types'

const highResTimer = (getHighResTime: GetHighResTime): HighResTimer => () => {
  const startTime = getHighResTime()
  return () => Number(getHighResTime() - startTime)
}

export default highResTimer
