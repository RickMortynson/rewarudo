import { Route, Routes } from 'react-router-dom'

import NavBar from '@components/NavBar'
import Root from '@components/pages/Root'
import Tasks from '@components/pages/Tasks'
import Profile from '@components/pages/Profile'
import { useUpdateUserValue } from '@components/hooks/useUpdateUserValue'

const Layout = () => {
  // update user info in redux on page refresh
  useUpdateUserValue()

  return (
    <div className='relative flex h-screen flex-col bg-skin-secondary'>
      <div id='modal-window'></div>
      <NavBar />
      <Routes>
        <Route path='/' element={<Root />} />
        <Route path='/tasks' element={<Tasks />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  )
}

export default Layout
