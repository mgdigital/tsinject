import type { GetHiResTime } from '../types'

const getHiResTime: GetHiResTime = () =>
  process.hrtime.bigint()

export default getHiResTime
