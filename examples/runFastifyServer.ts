import { newContainerBuilder } from '@mgdigital/tsinject'
import * as fastifyModule from './container/fastifyModule'
import * as taskModule from './container/taskModule'

const container = newContainerBuilder()
  .use(taskModule.default)
  .createContainer()

const runServer = container.get(fastifyModule.keys.fastifyServerRunner)

void runServer(3000)
