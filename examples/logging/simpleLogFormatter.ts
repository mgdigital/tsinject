import type { LogFormatter } from './types'
import { inspect } from 'util'

const simpleLogFormatter: LogFormatter = (level, message, data) =>
  [
    `${level}:`,
    message,
    ...(data != null)
      ? [
          inspect(data, false, 5)
        ]
      : []
  ].join(' ')

export default simpleLogFormatter
