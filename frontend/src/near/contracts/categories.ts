import * as near from 'near-api-js'
import { wallet } from '@near/connect'

const contractId = 'categories.unicorny.testnet'

const options = {
  viewMethods: ['get_categories'],
  changeMethods: ['add_category']
}

// prettier-ignore
const contract = new near.Contract(
  wallet.account(),
  contractId,
  options
)

export const getCategories = async () => {
  // "as eny" assertion to ignore typescript error "Property does not exist on type"
  // eslint-disable-next-line
  const categories = await (contract as any).get_categories({ account_id: wallet.getAccountId() })
  console.log('categories:', categories)
}
