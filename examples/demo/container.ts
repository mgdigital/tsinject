import { newContainerBuilder } from '@mgdigital/tsinject'
import demoModule from './demoModule'

const container = newContainerBuilder()
  .use(demoModule)
  .createContainer()

export default container
