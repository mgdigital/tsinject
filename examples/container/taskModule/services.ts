import type { FastifyInstance } from 'fastify'
import type { ITaskRepository, ITaskService } from '../../task/types'
import type { ServerRunner } from '../../util/types'
import type * as keys from './keys'

type TaskServices = {
  [keys.taskRepository]: ITaskRepository
  [keys.taskService]: ITaskService
  [keys.taskFastifyApp]: FastifyInstance
  [keys.taskServerRunner]: ServerRunner
}

export default TaskServices
