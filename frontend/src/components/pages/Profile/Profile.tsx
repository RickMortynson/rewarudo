import { ChangeEvent, useEffect, useMemo, useState } from 'react'

import TaskCard from '@/components/pages/Tasks/TaskCard'
import { getTasksById, getUserTasksInfo } from '@/near/contract'
import { GetTasksReturn } from '@/near/contract/utils'
import { useAppSelector } from '@/store/hooks'
import { setPaddingTopUsingNavHeight } from '@/utils/mixins'

const Profile = () => {
  const { id } = useAppSelector(state => state.UserSlice)

  const [tasks, setTasks] = useState([] as GetTasksReturn)
  const [mobileSelect, setMobileSelect] = useState('ordered')

  // set padding based on navbar height
  useEffect(() => {
    setPaddingTopUsingNavHeight('profile', '5rem')
  }, [])

  useEffect(() => {
    getUserTasksInfo(id).then(response => {
      const allFetchedTasks = response?.order_tasks_id.concat(response.perform_tasks_id)

      if (allFetchedTasks !== undefined) {
        getTasksById(allFetchedTasks).then(response => {
          console.log(response)
          console.log(id)
          console.log(response[0][1].orderer === id)

          setTasks(response)
        })
      }
    })
  }, [id])

  const orderedTasks = useMemo(() => {
    const filteredOrderTasks = tasks.filter(task => task[1].orderer === id)
    console.log(filteredOrderTasks)

    return filteredOrderTasks.length > 0 ? (
      filteredOrderTasks.map(task => (
        <TaskCard show_accent={false} task_id={task[0]} key={task[0]} task={task[1]} />
      ))
    ) : (
      <div>This user does not have any ordered tasks</div>
    )
  }, [tasks])

  const performedTasks = useMemo(() => {
    const filteredPerformedTasks = tasks.filter(task => task[1].performer === id)

    return filteredPerformedTasks.length > 0 ? (
      filteredPerformedTasks.map(task => (
        <TaskCard show_accent={false} task_id={task[0]} key={task[0]} task={task[1]} />
      ))
    ) : (
      <div>This user does not have any ordered tasks</div>
    )
  }, [tasks])

  return (
    <div id='profile' className='grid  gap-x-8 py-20 px-4 md:grid-cols-2 md:px-20'>
      <h3 className='mb-2 hidden text-center text-2xl font-bold md:mb-4 md:block md:text-start'>
        Ordered
      </h3>
      <h3 className='mb-2 hidden text-center text-2xl font-bold md:mb-4 md:block md:text-start'>
        Performed
      </h3>

      <select
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setMobileSelect(e.target.value)
        }}
        className='mb-4 block p-2 md:hidden'
      >
        <option value={'ordered'}>Show ordered</option>
        <option value={'performed'}>Show performed</option>
      </select>

      <div className={`md:block ${mobileSelect === 'ordered' ? 'block' : 'hidden'}`}>
        {orderedTasks}
      </div>
      <div className={`md:block ${mobileSelect === 'performed' ? 'block' : 'hidden'}`}>
        {performedTasks}
      </div>
    </div>
  )
}

export default Profile
