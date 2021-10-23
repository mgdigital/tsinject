import type { ContainerModule } from '@mgdigital/tsinject'
import type TaskServices from './services'
import * as dateModule from '../dateModule'
import * as fastifyModule from '../fastifyModule'
import * as loggingModule from '../loggingModule'
import * as uuidModule from '../uuidModule'
import * as keys from './keys'
import InMemoryTaskRepository from '../../task/InMemoryTaskRepository'
import taskAPIFastifyRouter from '../../task/taskAPIFastifyRouter'
import TaskService from '../../task/TaskService'

const taskModule: ContainerModule<
  dateModule.services &
  fastifyModule.services &
  loggingModule.services &
  uuidModule.services &
  TaskServices
> = {
  key: Symbol('taskModule'),
  build: builder => builder
    .use(dateModule.default)
    .use(fastifyModule.default)
    .use(loggingModule.default)
    .use(uuidModule.default)
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
      keys.taskAPIFastifyRouter,
      container => taskAPIFastifyRouter(
        container.get(keys.taskService)
      )
    )
    .decorate(
      fastifyModule.keys.fastifyInstanceBuilders,
      factory => container => [
        ...factory(container),
        container.get(keys.taskAPIFastifyRouter)
      ]
    )
}

export default taskModule
