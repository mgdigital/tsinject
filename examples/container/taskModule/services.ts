import type { ITaskRepository, ITaskService } from '../../task/types'
import type { FastifyInstanceBuilder } from '../../fastify/types'
import type * as keys from './keys'

type TaskServices = {
  [keys.taskRepository]: ITaskRepository
  [keys.taskService]: ITaskService
  [keys.taskAPIFastifyRouter]: FastifyInstanceBuilder
}

export default TaskServices
