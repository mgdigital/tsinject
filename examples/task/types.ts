export type TaskStatus = 'BACKLOG' | 'READY' | 'IN_PROGRESS' | 'DONE'

export type Task = {
  id: string
  status: TaskStatus
  description: string
  created: Date
  updated: Date
}

export type AddTaskRequest = {
  description: string
  status?: TaskStatus
}

export type UpdateTaskRequest = {
  id: string
  description?: string
  status?: TaskStatus
}

export interface ITaskRepository {
  putTask: (task: Task) => Promise<void>
  getTask: (id: string) => Promise<Task>
  listTasks: () => Promise<Task[]>
  deleteTask: (taskId: string) => Promise<void>
}

export interface ITaskService {
  addTask: (request: AddTaskRequest) => Promise<Task>
  getTask: (taskId: string) => Promise<Task>
  listTasks: () => Promise<Task[]>
  updateTask: (request: UpdateTaskRequest) => Promise<Task>
  deleteTask: (taskId: string) => Promise<void>
}
