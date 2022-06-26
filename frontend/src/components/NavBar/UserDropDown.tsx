import './NavBar.scss'

import { MdArrowDropDown } from 'react-icons/md'
import { Link } from 'react-router-dom'

import * as nearConnection from '@/near/connect'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { UserSlice } from '@/store/reducers/UserSlice'

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
            <Link to='/profile' className='sidebar-button disable-link-when-expanded'>
              <span className=''>{nearConnection.wallet.getAccountId()}</span>
            </Link>
            <MdArrowDropDown className='text-3xl' />
          </div>

          <div
            id='user-dropdown-menu'
            onMouseLeave={() => toggleDropdownShown()}
            className='user-dropdown-menu'
          >
            <Link to='/profile' className='user-dropdown-item hide-when-collapsed'>
              <span>Profile</span>
            </Link>

            <span className='user-dropdown-item'>
              Balance:
              <span className='pl-1 font-normal'>
                {nearConnection.formatBalanceToHuman(user.balance)}
              </span>
            </span>

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
