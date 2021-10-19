import type { LogFormatter, LogLevel } from './types'
import { inspect } from 'util'
import colors from 'colors/safe'

const getColor = (level: LogLevel): (str: string) => string => {
  switch (level) {
    case 'debug':
      return colors.green
    case 'info':
      return colors.blue
    default:
      return colors.red
  }
}

const prettyLogFormatter: LogFormatter = (level, message, data) => {
  const color = getColor(level)
  return [
    colors.underline(color(`${level}:`)),
    colors.bold(color(message)),
    ...(data != null)
      ? [
        colors.white(inspect(data, false, 5))
      ]
      : []
  ]
}

export default prettyLogFormatter
