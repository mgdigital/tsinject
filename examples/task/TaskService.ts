import type { AddTaskRequest, ITaskRepository, ITaskService, Task, UpdateTaskRequest } from './types'
import type { DateProvider, UUIDGenerator } from '../util/types'
import type { ILogger } from '../logging/types'

class TaskService implements ITaskService {
  constructor (
    private readonly repository: ITaskRepository,
    private readonly generateUUID: UUIDGenerator,
    private readonly getDate: DateProvider,
    private readonly logger: ILogger
  ) { }

  async addTask (request: AddTaskRequest): Promise<Task> {
    const date = this.getDate()
    const task = {
      id: this.generateUUID(),
      description: request.description,
      status: request.status ?? 'BACKLOG',
      created: date,
      updated: date
    }
    await this.repository.putTask(task)
    this.logger.info('New task added', { task })
    return task
  }

  async getTask (taskId: string): Promise<Task> {
    return this.repository.getTask(taskId)
  }

  async listTasks (): Promise<Task[]> {
    return this.repository.listTasks()
  }

  async updateTask (request: UpdateTaskRequest): Promise<Task> {
    const task = await this.repository.getTask(request.id)
    const updatedTask = {
      ...task,
      description: request.description ?? task.description,
      status: request.status ?? task.status,
      updated: this.getDate()
    }
    await this.repository.putTask(updatedTask)
    this.logger.info('Task updated', { task: updatedTask })
    return updatedTask
  }

  async deleteTask (taskId: string): Promise<void> {
    return this.repository.deleteTask(taskId)
  }
}

export default TaskService
