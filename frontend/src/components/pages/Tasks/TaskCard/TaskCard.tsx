import { useState } from 'react'
import * as NearApi from 'near-api-js'
import { Field, Form, Formik } from 'formik'

import Modal from '@components/Modal'
import { Task } from '@near/contract/utils'
import './TaskCard.scss'
import CardField from './CardField'
import ExpandableCardGrid from './ExpandableCardGrid'
import { takeTask, approveTaskCompletion } from '@near/contract'
import { useAppSelector } from '@store/hooks'

type Props = {
  task_id: string
  task: Task
}

const TaskCard = ({ task, task_id }: Props) => {
  const [showModal, setShowModal] = useState(false)

  const { id: user_id } = useAppSelector(store => store.UserSlice)

  console.log('orderer:', task.orderer)
  console.log('actual user:', user_id)

  return (
    <div
      onClick={() => setShowModal(!showModal)}
      className='card-grid-component card-paddings relative mb-6 cursor-pointer rounded-md border border-slate-300 bg-white shadow-md transition-shadow duration-300 last:mb-0 hover:shadow-sm'
    >
      <ExpandableCardGrid task={task} />

      <div className='card-accent flex flex-col items-center justify-center border-brand/50 bg-brand/40 font-bold duration-[200] hover:bg-brand/60 md:text-xl'>
        <p>Reward: {NearApi.utils.format.formatNearAmount(task.reward)} Ⓝ</p>
      </div>

      {showModal && (
        <Modal
          className='card-grid-component card-grid-component_modal-size mx-20'
          close={() => setShowModal(!showModal)}
        >
          <ExpandableCardGrid task={task}>
            <CardField title='Description'>{task.description}</CardField>
            <CardField title='Performer' className='italic'>
              {task.performer ? task.performer : '-'}{' '}
            </CardField>
            {task.status === 'Done' && (
              <CardField title='Result comment'>{task.result_comment}</CardField>
            )}
            <CardField title='Reward'>
              {NearApi.utils.format.formatNearAmount(task.reward)} Ⓝ
            </CardField>
          </ExpandableCardGrid>

          {task.status === 'Created' && task.orderer !== user_id && (
            <button
              onClick={() => takeTask(task_id)}
              className='col-span-3 mt-6 w-full  rounded-md border-brand/40 bg-brand/30 px-8 py-[6px] shadow-md transition-all hover:bg-brand/50 hover:shadow'
            >
              Take task
            </button>
          )}

          {task.status === 'InProgress' && task.orderer === user_id && (
            <Formik
              initialValues={{ comment: '' }}
              onSubmit={submittedValues => {
                approveTaskCompletion(task_id, submittedValues.comment)
              }}
            >
              <Form className='col-span-3'>
                <Field
                  name='comment'
                  className='mt-8 min-h-[60px] w-full border border-black/40 px-2 py-[2px] shadow-md focus:outline-skin-base '
                  placeholder='You can leave comment about this performer'
                  as={'textarea'}
                />
                <button className=' mt-2 w-full rounded-md border-brand/40 bg-brand/30 px-8 py-[6px] shadow-md transition-all hover:bg-brand/50 hover:shadow'>
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