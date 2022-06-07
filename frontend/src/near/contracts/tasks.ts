import * as near from 'near-api-js'
import { wallet } from '@near/connect'

const contractId = 'notes.unicorny.testnet'

const options = {
  viewMethods: ['get_tasks'],
  changeMethods: ['add_task']
}

// prettier-ignore
const contract = new near.Contract(
  wallet.account(),
  contractId,
  options
)

export const getTasks = async () => {
  // "as eny" assertion to ignore typescript error "Property does not exist on type"
  // eslint-disable-next-line
  const tasks = await (contract as any).get_tasks({ account_id: wallet.getAccountId() })
  console.log('tasks:', tasks)
}
