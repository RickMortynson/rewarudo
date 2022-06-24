import { UserSlice } from '@store/reducers/UserSlice'
import { useAppSelector, useAppDispatch } from '@store/hooks'
import { MdArrowDropDown } from 'react-icons/md'
import * as nearConnection from '@near/connect'

import './NavBar.scss'

const UserDropDown = () => {
  const user = useAppSelector(store => store.UserSlice)

  const dispatch = useAppDispatch()
  const { Logout } = UserSlice.actions

  const toggleDropdownShown = () => {
    document.getElementById('user-dropdown-menu')?.classList.toggle('show-user-dropdown')
  }

  const handleLogoutClick = () => {
    dispatch(Logout())
  }

  return (
    <div className='relative select-none flex-col items-center'>
      {user.loggedIn ? (
        <>
          <div className='user-dropdown-area' onClick={() => toggleDropdownShown()}>
            <span className='sidebar-button'>{nearConnection.wallet.getAccountId()}</span>
            <MdArrowDropDown className='text-3xl' />
          </div>

          <div
            id='user-dropdown-menu'
            onMouseLeave={() => toggleDropdownShown()}
            className='user-dropdown-menu'
          >
            <div className='user-dropdown-item'>
              <span className='pr-2'>Balance:</span>
              {nearConnection.formatBalanceToHuman(user.balance)}
            </div>
            <button className='user-dropdown-item' onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <button className='sidebar-button' onClick={() => nearConnection.connectWallet()}>
          Login
        </button>
      )}
    </div>
  )
}

export default UserDropDown
