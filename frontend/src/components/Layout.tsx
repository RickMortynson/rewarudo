import NavBar from '@components/NavBar'
import { useEffect } from 'react'
import * as nearConnect from '@near/connect'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { UserSlice } from '@store/reducers/UserSlice'
import { getTasks } from '@near/contracts/tasks'
import { getCategories } from '@near/contracts/categories'
import Main from '@components/Main'

const Layout = () => {
  const user = useAppSelector(state => state.UserSlice)
  const { UpdateState } = UserSlice.actions

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!user?.loggedIn) {
      const accountId = nearConnect.wallet.getAccountId()
      if (accountId.length > 0) {
        nearConnect.getWalletBalance().then(balance => {
          dispatch(
            UpdateState({
              id: nearConnect.wallet.getAccountId(),
              balance,
              loggedIn: true
            })
          )
        })
      }
    }
  }, [])

  useEffect(() => {
    getTasks()
    getCategories()
  }, [])

  return (
    <div className='relative bg-skin-ternary'>
      <NavBar />
      <Main />
      {/* footer */}
    </div>
  )
}

export default Layout
