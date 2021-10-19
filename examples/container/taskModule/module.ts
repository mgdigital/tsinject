import Fastify from 'fastify'
import type { ContainerModule } from '@mgdigital/tsinject'
import type TaskServices from './services'
import * as dateModule from '../dateModule'
import * as loggingModule from '../loggingModule'
import * as uuidModule from '../uuidModule'
import * as keys from './keys'
import InMemoryTaskRepository from '../../task/InMemoryTaskRepository'
import TaskService from '../../task/TaskService'
import tasksFastifyAppRouter from '../../task/tasksFastifyAppRouter'
import runFastifyServer from '../../util/runFastifyServer'

const taskModule: ContainerModule<
  dateModule.services &
  uuidModule.services &
  loggingModule.services &
  TaskServices
> = builder => builder
  .use(dateModule.default)
  .use(uuidModule.default)
  .use(loggingModule.default)
  .define(
    keys.taskRepository,
    () => new InMemoryTaskRepository()
  )
  .define(
    keys.taskService,
    container => new TaskService(
      container.get(keys.taskRepository),
      container.get(uuidModule.keys.uuidGenerator),
      container.get(dateModule.keys.dateProvider),
      container.get(loggingModule.keys.logger)
    )
  )
  .define(
    keys.taskFastifyApp,
    container => tasksFastifyAppRouter(
      container.get(keys.taskService),
      Fastify()
    )
  )
  .define(
    keys.taskServerRunner,
    container => runFastifyServer(
      container.get(keys.taskFastifyApp),
      container.get(loggingModule.keys.logger)
    )
  )

export default taskModule
