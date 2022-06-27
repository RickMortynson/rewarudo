import './TaskCard.scss'

import { Field, Form, Formik } from 'formik'
import * as NearApi from 'near-api-js'
import { useState } from 'react'

import Modal from '@/components/Modal'
import { approveTaskCompletion, takeTask } from '@/near/contract'
import { Task, TaskStatus } from '@/near/contract/utils'
import { useAppSelector } from '@/store/hooks'

import CardField from './CardField'
import ExpandableCardGrid from './ExpandableCardGrid'

type Props = {
  task_id: string
  task: Task
  show_accent?: boolean
  className?: string
}

const TaskCard = ({ task, task_id, className, show_accent = true }: Props) => {
  const [showModal, setShowModal] = useState(false)

  const { id: user_id } = useAppSelector(store => store.UserSlice)

  return (
    <div
      onClick={() => setShowModal(!showModal)}
      className={`card-grid-component card-paddings relative mb-6 
        cursor-pointer rounded-md border border-slate-300 bg-gradient-to-tr from-brand/50  
        shadow-md transition-shadow duration-300 last:mb-0 hover:shadow-sm 
        ${className}`}
    >
      <ExpandableCardGrid task={task} />

      {show_accent && (
        <div
          className='card-accent flex flex-col items-center justify-center 
          border-brand/50  bg-gradient-to-t from-brand/60 to-brand/10 font-bold duration-[200] hover:from-brand/70 hover:to-brand/10 md:text-xl'
        >
          <p className='text-lg italic md:text-2xl '>
            {NearApi.utils.format.formatNearAmount(task.reward)} Ⓝ
          </p>
        </div>
      )}

      {showModal && (
        <Modal
          className='card-grid-component card-grid-component_modal-size mx-20'
          close={() => setShowModal(!showModal)}
        >
          <ExpandableCardGrid task={task}>
            <CardField title='Description'>{task.description}</CardField>
            <CardField title='Performer' className='italic'>
              {task.performer ? task.performer : '-'}
            </CardField>
            {String(task.status) === TaskStatus[TaskStatus.Done] && (
              <CardField title='Result comment'>{task.result_comment}</CardField>
            )}
            <CardField title='Reward'>
              {NearApi.utils.format.formatNearAmount(task.reward)} Ⓝ
            </CardField>
          </ExpandableCardGrid>

          {String(task.status) === TaskStatus[TaskStatus.Created] && task.orderer !== user_id && (
            <button
              onClick={() => takeTask(task_id)}
              className='col-span-3 mt-6 w-full  rounded-md border-brand/40 bg-brand/30 
                px-8 py-[6px] shadow-md transition-all hover:bg-brand/50 hover:shadow'
            >
              Take task
            </button>
          )}

          {String(task.status) === TaskStatus[TaskStatus.InProgress] && task.orderer === user_id && (
            <Formik
              initialValues={{ comment: '' }}
              onSubmit={submittedValues => {
                approveTaskCompletion(task_id, submittedValues.comment)
              }}
            >
              <Form className='col-span-3'>
                <Field
                  name='comment'
                  className='mt-8 min-h-[60px] w-full border border-black/40 px-2 
                    py-[2px] shadow-md focus:outline-skin-base '
                  placeholder='You can leave comment about this performer'
                  as={'textarea'}
                />
                <button
                  className=' mt-2 w-full rounded-md border-brand/40 bg-brand/30 
                  px-8 py-[6px] shadow-md transition-all hover:bg-brand/50 hover:shadow'
                >
                  Approve finalization
                </button>
              </Form>
            </Formik>
          )}
        </Modal>
      )}
    </div>
  )
}

export default TaskCard
