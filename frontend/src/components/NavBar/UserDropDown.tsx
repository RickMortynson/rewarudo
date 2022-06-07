import { UserSlice } from '@store/reducers/UserSlice'
import { useAppSelector, useAppDispatch } from '@store/hooks'
import { MdArrowDropDown } from 'react-icons/md'
import * as nearConnection from '@near/connect'
import { useState } from 'react'

const UserDropDown = () => {
  const user = useAppSelector(store => store.UserSlice)

  const [showDropDown, setShowDropDown] = useState(false)

  const dispatch = useAppDispatch()
  const { Logout } = UserSlice.actions

  const handleLogoutClick = () => {
    dispatch(Logout())
  }

  return (
    <div className='relative flex select-none flex-col items-center text-skin-base'>
      {user.loggedIn ? (
        <>
          <div
            className='flex cursor-pointer items-center'
            onClick={() => setShowDropDown(!showDropDown)}
          >
            {nearConnection.wallet.getAccountId()}
            <MdArrowDropDown className='text-3xl' />
          </div>
          {showDropDown && (
            <div
              onMouseLeave={() => setShowDropDown(false)}
              className='absolute top-8 w-full rounded-md border-slate-300 bg-skin-ternary text-sm shadow-lg  ring-2 ring-slate-200 transition-shadow children:px-2 children:py-1'
            >
              <div className='flex items-center border-b border-slate-400 hover:shadow-md'>
                <span className='pr-2'>Balance:</span>
                {nearConnection.formatBalanceToHuman(user.balance)}
              </div>
              <button className='w-full text-left hover:shadow-md' onClick={handleLogoutClick}>
                Logout
              </button>
            </div>
          )}
        </>
      ) : (
        <button onClick={() => nearConnection.connectWallet()}>Login</button>
      )}
    </div>
  )
}

export default UserDropDown
