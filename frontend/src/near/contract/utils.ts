export enum TaskCategories {
  Development,
  Design,
  Writing,
  Researching,
  Typing,
  Mentoring
}

export type createTaskProps = {
  title: string
  description: string
  category_arg: string

  // deadline in method caller must be 'number' type, but it is more
  // convenient to use deadline as string in the task creation form
  deadline: number | string
  deposit: number
}

export type Task = {
  category: keyof typeof TaskCategories
  deadline: number
  description: string
  orderer: string
  performer: string | null
  result_comment: string | null
  reward: string
  status: 'Created' | 'InProgress' | 'Done'
  title: string
}

// export type GetTasksReturn = Map<string, Task>[]
export type GetTasksReturn = [string, Task][]
