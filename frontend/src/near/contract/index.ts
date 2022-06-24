import * as near from 'near-api-js'
import { wallet } from '@near/connect'
import * as NearConnect from 'near-api-js'
import { GetTasksReturn, createTaskProps } from './utils'

const contractId = 'rewarudo.r_unicorn.testnet'

const options = {
  viewMethods: ['get_tasks', 'get_users_tasks_info'],
  changeMethods: ['create_task', 'take_task', 'approve_task_completion']
}

// prettier-ignore
const contract = new near.Contract(
  wallet.account(),
  contractId,
  options
)

const defaultGas = String(Math.pow(10, 12) * 30) //30 TGas

type ContractFunctions = {
  take_task: (task_id: { task_id: string }, gas: string, deposit: string) => void

  get_tasks: () => GetTasksReturn
  create_task: (arg: Omit<createTaskProps, 'deposit'>, gas: string, deposit: string) => string
  approve_task_completion: (approve_payload: { task_id: string; result_comment: string }) => void
}

type Contract = ContractFunctions & NearConnect.Contract

export const getTasks = async (): Promise<GetTasksReturn> => {
  return (await (contract as Contract).get_tasks()) as GetTasksReturn
}

export const createTask = async (props: createTaskProps): Promise<string> => {
  return await (contract as Contract).create_task(
    {
      title: props.title,
      description: props.description,
      category_arg: props.category_arg,
      deadline: new Date(props.deadline).getTime()
    },
    defaultGas,
    NearConnect.utils.format.parseNearAmount(String(props.deposit)) as string
  )
}

export const takeTask = async (task_id: string) => {
  await (contract as Contract).take_task({ task_id }, defaultGas, '')
}

export const approveTaskCompletion = async (task_id: string, result_comment: string) => {
  await (contract as Contract).approve_task_completion({ task_id, result_comment })
}
