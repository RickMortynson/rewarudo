import './Profile.scss'

import { ChangeEvent, useEffect, useState } from 'react'

import TaskCard from '@/components/pages/Tasks/TaskCard'
import { getTasksById, getUserTasksInfo } from '@/near/contract'
import { GetTasksReturn } from '@/near/contract/utils'
import { useAppSelector } from '@/store/hooks'
import { setPaddingTopUsingNavHeight } from '@/utils/mixins'

const Profile = () => {
  const { id, balance } = useAppSelector(state => state.UserSlice)

  const [mobileSelect, setMobileSelect] = useState('ordered')
  const [tasks, setTasks] = useState<GetTasksReturn>([])
  const [isBusy, setIsBusy] = useState<boolean | undefined>(false)

  // set padding based on navbar height
  useEffect(() => {
    setPaddingTopUsingNavHeight('profile', '5rem')
  }, [])

  useEffect(() => {
    getUserTasksInfo(id).then(response => {
      const allFetchedTasks = response?.order_tasks_id.concat(response.perform_tasks_id)

      if (allFetchedTasks !== undefined) {
        setIsBusy(response?.is_busy)
        getTasksById(allFetchedTasks).then(response => {
          console.log(response)
          console.log(id)
          console.log(response[0][1].orderer === id)

          setTasks(response)
        })
      }
    })
  }, [id])

  const filteredOrderTasks = tasks.filter(task => task[1].orderer === id)
  const orderedTasks =
    filteredOrderTasks.length > 0 ? (
      filteredOrderTasks.map(task => (
        <TaskCard show_accent={false} task_id={task[0]} key={task[0]} task={task[1]} />
      ))
    ) : (
      <div>This user does not have any ordered tasks</div>
    )

  const filteredPerformedTasks = tasks.filter(task => task[1].performer === id)
  const performedTasks =
    filteredPerformedTasks.length > 0 ? (
      filteredPerformedTasks.map(task => (
        <TaskCard show_accent={false} task_id={task[0]} key={task[0]} task={task[1]} />
      ))
    ) : (
      <div>This user does not have any ordered tasks</div>
    )

  return (
    <div id='profile' className='py-20 px-4 md:px-20'>
      <div className='mb-2 border-b border-black/50 pb-2 md:mb-4 md:pb-4'>
        <div className='flex items-center justify-center md:justify-start'>
          <h3>{id}</h3>
          <span
            className={` ${
              isBusy ? 'bg-red-400' : 'bg-green-400'
            } ml-1 mt-1 aspect-square w-3 rounded-full`}
          />
        </div>
        <h3>
          Balance: <span className='text-base'>{balance}</span>
        </h3>
      </div>
      <div className='grid grid-rows-[auto,1fr] gap-x-8 rounded-md md:grid-cols-2'>
        <h3 className='mb-2 hidden md:mb-4 md:block'>Ordered</h3>
        <h3 className='mb-2 hidden md:mb-4 md:block'>Performed</h3>

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
    </div>
  )
}

export default Profile
