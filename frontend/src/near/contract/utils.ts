export enum TaskCategories {
  Development = 'Development',
  Design = 'Design',
  Writing = 'Writing',
  Researching = 'Researching',
  Typing = 'Typing',
  Mentoring = 'Mentoring'
}

export enum TaskStatus {
  Created = 'Created',
  InProgress = 'InProgress',
  Done = 'Done'
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
  status: TaskStatus
  title: string
}

export type TasksFilterValues = {
  status: string
  category: string
  orderer: string
  performer: string
  max_deadline: number | string //undefine needed to avoid conflict with formik's input with type 'date'
  reward_min: number | string // number from user input, string - input for smart-contract
  reward_max: number | string // number from user input, string - input for smart-contract
}

export const getDefaultTaskFilterValues = (): TasksFilterValues => {
  return {
    category: '',
    max_deadline: '',
    orderer: '',
    performer: '',
    reward_min: 0,
    reward_max: 100,
    status: ''
  }
}

export type TasksPagination = {
  from_index: number
  limit: number
}

export type GetTasksReturn = [string, Task][]

export type FilterTasksReturn = {
  filtered_tasks: GetTasksReturn
  total_size: number
}

export type UserInfo = {
  order_tasks_id: string[]
  perform_tasks_id: string[]
  is_busy: boolean
}
