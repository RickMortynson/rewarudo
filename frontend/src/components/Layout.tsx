import { Route, Routes } from 'react-router-dom'

import { useUpdateUserValue } from '@/components/hooks/useUpdateUserValue'
import NavBar from '@/components/NavBar'
import Profile from '@/components/pages/Profile'
import Root from '@/components/pages/Root'
import Tasks from '@/components/pages/Tasks'

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
