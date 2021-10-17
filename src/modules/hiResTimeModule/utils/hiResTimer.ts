import type { GetHiResTime, HiResTimer } from '../types'

const hiResTimer = (getHiResTime: GetHiResTime): HiResTimer => () => {
  const start = getHiResTime()
  return () => Number(getHiResTime() - start)
}

export default hiResTimer
