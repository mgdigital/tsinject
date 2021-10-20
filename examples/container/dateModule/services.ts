import type { DateProvider } from '../../util/types'
import type * as keys from './keys'

type DateServices = {
  [keys.dateProvider]: DateProvider
}

export default DateServices
