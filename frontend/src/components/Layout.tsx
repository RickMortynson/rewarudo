import NavBar from '@components/NavBar'
import { useUpdateUserValue } from '@components/hooks/useUpdateUserValue'
import { Route, Routes } from 'react-router-dom'
import Root from './pages/Root'
import Tasks from './pages/Tasks'

const Layout = () => {
  useUpdateUserValue()

  return (
    <div className='relative flex h-screen flex-col bg-skin-secondary'>
      <div id='modal-window'></div>
      <NavBar />
      <Routes>
        <Route path='/' element={<Root />} />
        <Route path='/tasks' element={<Tasks />} />
      </Routes>
    </div>
  )
}

export default Layout
