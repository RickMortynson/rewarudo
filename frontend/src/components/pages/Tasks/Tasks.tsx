import './Tasks.scss'

import { useEffect, useMemo, useState } from 'react'

import { filterTasks, paginationLimit } from '@/near/contract'
import {
  getDefaultTaskFilterValues,
  GetTasksReturn,
  TasksFilterValues
} from '@/near/contract/utils'
import { setPaddingTopUsingNavHeight } from '@/utils/mixins'

import CreateTask from './CreateTask'
import TaskCard from './TaskCard'
import TasksFilter from './TasksFilter'
import TasksPagination from './TasksPagination'

const Tasks = () => {
  const [tasks, setTasks] = useState<GetTasksReturn>()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [filterValues, setFilterValues] = useState(
    getDefaultTaskFilterValues() as TasksFilterValues
  )

  // set padding based on navbar height
  useEffect(() => {
    setPaddingTopUsingNavHeight('tasks-page', '5rem')
  }, [])

  useEffect(() => {
    // fetch all tasks every 10 seconds
    filterTasks(filterValues, currentPage * paginationLimit - paginationLimit)
      .then(response => {
        setTasks(response.filtered_tasks)
        setTotalPages(Math.ceil(response.total_size / paginationLimit))
      })
      .catch(() => {
        setTasks([])
        setTotalPages(0)
        // actually errors can be expected here, such as panic when min_reward < 0 (u128 error), etc
        // but this behavior is ok 👹👹👹
        console.log('just hope this was an expected error :D')
      })

    const fetchTasks = setInterval(() => {
      // same func as before
      filterTasks(filterValues, currentPage * paginationLimit - paginationLimit)
        .then(response => {
          setTasks(response.filtered_tasks)
          setTotalPages(Math.ceil(response.total_size / paginationLimit))
        })
        .catch(() => {
          setTasks([])
          setTotalPages(0)
          console.log('just hope this was an expected error :D')
        })
    }, 10000)

    return () => clearInterval(fetchTasks)
  }, [filterValues, currentPage])

  const TasksToShow = useMemo(() => {
    if (!tasks || tasks.length === 0) return <div>There is no available tasks with this filter</div>

    return tasks?.map(taskMap => {
      const [task_id, task] = taskMap

      return <TaskCard key={task_id} task={task} task_id={task_id} />
    })
  }, [tasks])

  return (
    <div
      id='tasks-page'
      className='grid gap-4 bg-skin-secondary py-20 px-4 md:grid-cols-2 md:px-20'
    >
      <CreateTask className='tasks-element-wrapper' />

      <TasksFilter
        filterValues={filterValues}
        updateFilterValues={setFilterValues}
        className='tasks-element-wrapper'
      />

      <div className='tasks-element-wrapper rounded-md border border-slate-300 bg-white p-4 shadow-sm drop-shadow-sm md:col-span-2 md:px-8 md:py-6'>
        {TasksToShow}
      </div>

      <TasksPagination currentPage={currentPage} setPage={setCurrentPage} totalPages={totalPages} />
    </div>
  )
}

export default Tasks
