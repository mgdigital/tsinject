import type { FastifyInstance } from 'fastify'
import type { AddTaskRequest, ITaskService, TaskStatus } from './types'

const tasksFastifyAppRouter = (service: ITaskService, app: FastifyInstance): FastifyInstance => app
  .get(
    '/tasks',
    async () => service.listTasks()
  )
  .post(
    '/tasks',
    async req => service.addTask(req.body as AddTaskRequest)
  )
  .get(
    '/tasks/:taskId',
    async req => service.getTask((req.params as Record<string, string>).taskId)
  )
  .post(
    '/tasks/:taskId',
    async req => service.updateTask({
      id: (req.params as Record<string, string>).taskId,
      description: (req.body as Record<string, string>).description,
      status: (req.body as Record<string, string>).status as TaskStatus
    })
  )
  .delete(
    '/tasks/:taskId',
    async req => service.deleteTask((req.params as Record<string, string>).taskId)
  )

export default tasksFastifyAppRouter
