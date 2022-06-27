import { Field, Form, Formik } from 'formik'

import FormFieldWrap from '@/components/helpers/FormFieldWrap'
import { TaskCategories, TasksFilterValues, TaskStatus } from '@/near/contract/utils'

type Props = {
  className?: string
  filterValues: TasksFilterValues
  updateFilterValues: (values: TasksFilterValues) => void
}

const TaskFilter = ({ className, filterValues, updateFilterValues }: Props) => {
  const handleSubmit = (updatedValues: TasksFilterValues) => {
    updateFilterValues(updatedValues)
  }

  return (
    <div className={`items-center justify-center ${className}`}>
      <h3>Filter tasks</h3>
      <Formik initialValues={filterValues} onSubmit={handleSubmit}>
        <Form className='grid gap-1'>
          <FormFieldWrap
            label='Status'
            select_enum={TaskStatus}
            select_name='status'
            select_possibleEmpty
          />
          <FormFieldWrap
            label='Category'
            select_enum={TaskCategories}
            select_name='category'
            select_possibleEmpty
          />
          <FormFieldWrap label='Orderer'>
            <Field name='orderer' placeholder='Orderer' />
          </FormFieldWrap>
          <FormFieldWrap label='Performer'>
            <Field name='performer' placeholder='Performer' />
          </FormFieldWrap>
          <FormFieldWrap label='Max deadline'>
            <Field name='max_deadline' type='date' />
          </FormFieldWrap>
          <FormFieldWrap label='Reward range'>
            <div className='col-span-2 flex items-center justify-between [&>*]:w-[45%] '>
              <Field
                name='reward_min'
                className='border-b border-black/50 pl-1'
                placeholder='min'
                type='number'
              />
              -
              <Field
                name='reward_max'
                className='border-b border-black/50 pl-1'
                placeholder='max'
                type='number'
              />
            </div>
          </FormFieldWrap>
          <button
            className='mt-3 w-full rounded-md border border-brand/40 bg-brand/30 py-[6px] font-semibold shadow-md transition-colors hover:bg-brand/40'
            type='submit'
          >
            Apply filter
          </button>
        </Form>
      </Formik>
    </div>
  )
}

export default TaskFilter
