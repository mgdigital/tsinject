import { newContainerBuilder } from '@mgdigital/tsinject'
import * as taskModule from './container/taskModule'

const container = newContainerBuilder()
  .use(taskModule.default)
  .createContainer()

const runServer = container.get(taskModule.keys.taskServerRunner)

void runServer(3000)
