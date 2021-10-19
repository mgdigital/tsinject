import type { GetHighResTime } from './types'

const getHighResTime: GetHighResTime = () =>
  process.hrtime.bigint()

export default getHighResTime
