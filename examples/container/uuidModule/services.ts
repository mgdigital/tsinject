import type { UUIDGenerator } from '../../util/types'
import type * as keys from './keys'

type UUIDServices = {
  [keys.uuidGenerator]: UUIDGenerator
}

export default UUIDServices
