import type { ContainerModule } from '@mgdigital/tsinject'
import type DateServices from './services'
import * as keys from './keys'
import getDate from '../../util/getDate'

const dateModule: ContainerModule<DateServices> = {
  key: Symbol('dateModule'),
  build: builder => builder
    .define(
      keys.dateProvider,
      () => getDate
    )
}

export default dateModule
