import { VscGithub } from 'react-icons/vsc'
import { Link } from 'react-router-dom'
import ThemesSelector from './ThemesSelector'
import UserDropDown from './UserDropDown'

const NavBar = () => {
  // TODO: store colorScheme in localStorage
  return (
    <header className='fixed top-0 z-30 flex h-14 w-full items-center justify-between bg-skin-base px-6 shadow-md'>
      <Link to='/'>
        <div className='select-none text-xl font-semibold text-skin-base'>Rewarudo</div>
      </Link>

      <div className='flex h-full items-center children:border-r children:border-black children:px-3 last:children:border-r-0 last:children:pr-0'>
        <ThemesSelector />

        <a href='https://github.com/RickMortynson/rewarudo'>
          <VscGithub className='text-2xl ' />
        </a>

        <UserDropDown />
      </div>
    </header>
  )
}

export default NavBar
