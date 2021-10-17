import type { Factory } from '../../types'

export const processEnv: Factory<NodeJS.ProcessEnv> = () =>
  Object.freeze({ ...process.env })
