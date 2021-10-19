import type { ITaskRepository, Task } from './types'

class InMemoryTaskRepository implements ITaskRepository {
  private readonly tasks: Record<string, Task> = {}

  async putTask (task: Task): Promise<void> {
    this.tasks[task.id] = task
  }

  async getTask (id: string): Promise<Task> {
    const task = this.tasks[id]
    if (task === undefined) {
      throw new Error('Task not found')
    }
    return task
  }

  async listTasks (): Promise<Task[]> {
    return Object.values(this.tasks)
  }

  async deleteTask (taskId: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.tasks[taskId]
  }
}

export default InMemoryTaskRepository
