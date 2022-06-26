import * as nearConnect from '@/near/connect'
import { useAppDispatch } from '@/store/hooks'
import { UserSlice } from '@/store/reducers/UserSlice'

export const useUpdateUserValue = () => {
  const dispatch = useAppDispatch()
  const { UpdateState } = UserSlice.actions

  const accountId = nearConnect.wallet.getAccountId()
  if (accountId.length === 0) return

  nearConnect.getWalletBalance().then(balance => {
    dispatch(
      UpdateState({
        id: accountId,
        balance,
        loggedIn: true
      })
    )
  })
}
