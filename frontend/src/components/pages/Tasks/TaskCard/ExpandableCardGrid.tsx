import { PropsWithChildren } from 'react'
import CardField from './CardField'
import { Task } from '@near/contract/utils'

type Props = {
  task: Omit<Task, 'performer' | 'result_comment'>
}

const CardGrid = ({ task, children }: Props & PropsWithChildren) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  const dateDiff = (timeStamp: number): string => {
    const now = new Date()
    const startOfThisDay =
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      now.getTimezoneOffset() * 60000

    const difference = (timeStamp - startOfThisDay) / 86_400_000 // convert millis to days

    if (difference < 0) {
      const date = Math.abs(difference)
      return `${date} ${date === 1 ? 'day' : 'days'} ago`
    }
    if (difference > 0) {
      const date = difference
      return `${date} ${date === 1 ? 'day' : 'days'} left`
    } else {
      return 'today'
    }
  }

  return (
    <>
      <CardField title='Title' className='row-span-1'>
        {/* both task.title and h4 are in the same span rn */}

        {task.title}
        <h4 className='ml-1 flex items-center rounded-full border border-brand/40 bg-brand/20 px-1 text-xs font-medium'>
          {task.category}
        </h4>
      </CardField>

      {/* prettier-ignore */}
      <CardField title='Orderer' className='italic'>{task.orderer}</CardField>
      <CardField title='Status'>{task.status}</CardField>

      <CardField title='Deadline'>
        {formatDate(task.deadline)} ({dateDiff(task.deadline)})
      </CardField>

      {children}
    </>
  )
}

export default CardGrid
