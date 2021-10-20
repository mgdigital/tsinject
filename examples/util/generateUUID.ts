import type { UUIDGenerator } from './types'
import { nanoid } from 'nanoid'

const generateUUID: UUIDGenerator = () =>
  nanoid()

export default generateUUID
