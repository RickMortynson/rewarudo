import * as nearConnect from 'near-api-js'

import { wallet } from '@/near/connect'

import {
  createTaskProps,
  FilterTasksReturn,
  GetTasksReturn,
  TasksFilterValues,
  TasksPagination
} from './utils'

const contractId = 'rewarudo.r_unicorn.testnet'

const options = {
  viewMethods: ['get_tasks', 'filter_tasks'],
  changeMethods: ['create_task', 'take_task', 'approve_task_completion']
}

const defaultGas = String(Math.pow(10, 12) * 30) //30 TGas
export const paginationLimit = 10

type ContractFunctions = {
  // view methods
  get_tasks: () => GetTasksReturn
  filter_tasks: (object: {
    filter: TasksFilterValues
    pagination: TasksPagination
  }) => FilterTasksReturn

  // change methods
  take_task: (task_id: { task_id: string }, gas: string, deposit: string) => void
  create_task: (arg: Omit<createTaskProps, 'deposit'>, gas: string, deposit: string) => string
  approve_task_completion: (approve_payload: { task_id: string; result_comment: string }) => void
}

type ContractSetup = ContractFunctions & nearConnect.Contract

// prettier-ignore
const contract = new nearConnect.Contract(
  wallet.account(),
  contractId,
  options
) as ContractSetup

export const getTasks = async (): Promise<GetTasksReturn> => {
  return await contract.get_tasks()
}

export const filterTasks = async (
  filter_values: TasksFilterValues,
  from_index: number
): Promise<FilterTasksReturn> => {
  console.log('request:', {
    filter: {
      ...filter_values,
      max_deadline: filter_values.max_deadline ? new Date(filter_values.max_deadline).getTime() : 0, // use 0 if the value was undefined
      reward_min: nearConnect.utils.format.parseNearAmount(String(filter_values.reward_min)),
      reward_max: nearConnect.utils.format.parseNearAmount(String(filter_values.reward_max))
    } as TasksFilterValues,

    pagination: {
      from_index,
      limit: paginationLimit
    } as TasksPagination
  })

  return await contract.filter_tasks({
    filter: {
      ...filter_values,
      max_deadline: filter_values.max_deadline ? new Date(filter_values.max_deadline).getTime() : 0, // use 0 if the value was undefined
      reward_min: nearConnect.utils.format.parseNearAmount(String(filter_values.reward_min)),
      reward_max: nearConnect.utils.format.parseNearAmount(String(filter_values.reward_max))
    } as TasksFilterValues,

    pagination: {
      from_index,
      limit: paginationLimit
    } as TasksPagination
  })
}

export const createTask = async (props: createTaskProps): Promise<string> => {
  return await contract.create_task(
    {
      title: props.title,
      description: props.description,
      category_arg: props.category_arg,
      deadline: new Date(props.deadline).getTime()
    },
    defaultGas,
    nearConnect.utils.format.parseNearAmount(String(props.deposit)) as string
  )
}

export const takeTask = async (task_id: string) => {
  await contract.take_task({ task_id }, defaultGas, '')
}

export const approveTaskCompletion = async (task_id: string, result_comment: string) => {
  await contract.approve_task_completion({ task_id, result_comment })
}
