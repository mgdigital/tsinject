import type { ContainerModule } from '@mgdigital/tsinject'
import type UUIDServices from './services'
import * as keys from './keys'
import generateUUID from '../../util/generateUUID'

const uuidModule: ContainerModule<UUIDServices> = builder => builder
  .define(
    keys.uuidGenerator,
    () => generateUUID
  )

export default uuidModule
