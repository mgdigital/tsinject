import type { LogWriter } from './types'

const consoleLogWriter: LogWriter = (level, message, data) =>
  console.log(`${level}: ${message}`, data)

export default consoleLogWriter
