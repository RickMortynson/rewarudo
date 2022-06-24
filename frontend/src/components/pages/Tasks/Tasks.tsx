import { useEffect, useMemo, useState } from 'react'
import { getTasks } from '@near/contract'
import { GetTasksReturn } from '@near/contract/utils'
import CreateTask from './CreateTask'
import TaskCard from './TaskCard'
import { setPaddingTopUsingNavHeight } from '@utils/mixins'

const Tasks = () => {
  const [tasks, setTasks] = useState<GetTasksReturn>()

  useEffect(() => {
    // set padding based on navbar height

    setPaddingTopUsingNavHeight('tasks-page', '5rem')

    // fetch all tasks once every 10 seconds
    getTasks().then(response => setTasks(response))
    const fetchTasks = setInterval(() => {
      getTasks().then(response => setTasks(response))
    }, 10000)

    return () => clearInterval(fetchTasks)
  }, [])

  const TasksToShow = useMemo(() => {
    if (!tasks || tasks.length === 0) return <div>There is no available tasks with this filter</div>
    console.log('pass check', tasks)

    return tasks.map(taskMap => {
      const [task_id, task] = taskMap

      return <TaskCard key={task_id} task={task} task_id={task_id} />
    })
  }, [tasks])

  return (
    <div
      id='tasks-page'
      className='grid gap-4 bg-skin-secondary py-20 px-4 md:grid-cols-3 md:px-20 '
    >
      <CreateTask className='md:col-span-2' />
      <div className='flex shrink-0 flex-grow-[2] basis-1/3  items-center justify-center bg-white'>
        filter here
      </div>
      <div className='rounded-md border border-slate-300 bg-white p-4 shadow-sm drop-shadow-sm md:col-span-3 md:px-8 md:py-6'>
        {TasksToShow}
      </div>
    </div>
  )
}

export default Tasks
