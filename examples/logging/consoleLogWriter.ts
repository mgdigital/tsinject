import type { LogWriter } from '../logging/types'

const consoleLogWriter: LogWriter = (logLine) =>
  console.log(...logLine)

export default consoleLogWriter
