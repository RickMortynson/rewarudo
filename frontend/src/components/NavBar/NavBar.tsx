import { VscGithub } from 'react-icons/vsc'
import { HiMenu } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import ThemesSelector from './ThemesSelector'
import UserDropDown from './UserDropDown'
import './NavBar.scss'

const NavBar = () => {
  // TODO: store colorScheme in localStorage
  const clickToggler = () => {
    const toggler = document.getElementById('nav-buttons')
    toggler?.classList.toggle('show-sidebar')
  }

  return (
    <header className='navbar' id='navbar'>
      <Link to='/'>
        <div className='select-none text-xl font-semibold text-skin-base'>Rewarudo</div>
      </Link>

      <div id='nav-buttons' className='collapsible'>
        <ThemesSelector />

        <a className='sidebar-button' href='https://github.com/RickMortynson/rewarudo'>
          <VscGithub className='text-2xl' />
          <span className='sidebar-button-alias transition-shadow'>Source code</span>
        </a>

        <UserDropDown />
      </div>
      <div onClick={clickToggler} className='toggle'>
        <HiMenu className='text-3xl' />
      </div>
    </header>
  )
}

export default NavBar
