import { Routes, Route } from 'react-router-dom'
import Root from '@components/pages/Root'
import Tasks from '@components/pages/Tasks'

const Main = () => {
  return (
    <Routes>
      <Route path='/' element={<Root />} />
      <Route path='/tasks' element={<Tasks />} />
    </Routes>
  )
}

export default Main
