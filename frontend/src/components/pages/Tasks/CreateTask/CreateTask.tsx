import { Formik, Field, Form } from 'formik'

import { createTask } from '@near/contract'
import { createTaskProps, TaskCategories } from '@near/contract/utils'
import { useAppSelector } from '@store/hooks'
import FormFieldWrap from '@components/helpers/FormFieldWrap'

const CreateTask = ({ className: user_className }: { className: string }) => {
  const { balance: user_balance } = useAppSelector(state => state.UserSlice)

  const handleSubmit = (values: createTaskProps) => {
    console.log('handle submit')
    const createdTaskId = createTask(values)
    console.log(createdTaskId)
  }

  const validateTitle = (value: string): string => {
    let error = ''
    if (!value) error = 'Required field'
    else if (!/^[\w\s:;,.]{3,32}$/i.test(value.trim())) {
      error = 'Expected 3-32 characters'
    }

    return error
  }

  const validateDesc = (value: string): string => {
    let error = ''
    if (!value) error = 'Required field'
    else if (!/^[\w\s:;,.]{10,256}$/i.test(value.trim())) {
      error = 'Expected 10-256 characters'
    }

    return error
  }

  const validateReward = (transaction_amount: number): string => {
    const balance = Number(user_balance)

    if (balance > transaction_amount) return ''
    else return 'Not enough near for this action'
  }

  return (
    <div className={`${user_className} shadow-sm drop-shadow-sm`}>
      <h3 className='col-span-2'>Create task</h3>

      <Formik
        initialValues={
          {
            title: '',
            category_arg: TaskCategories[TaskCategories.Development],
            deadline: new Date().toLocaleDateString('en-CA'),
            description: '',
            deposit: 0
          } as createTaskProps
        }
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className='grid gap-1'>
            <FormFieldWrap label='Title' error={errors.title} touched={touched.title}>
              <Field
                className='field-action-area'
                name='title'
                placeholder='Title'
                validate={validateTitle}
              />
            </FormFieldWrap>

            <FormFieldWrap
              label='Description'
              error={errors.description}
              touched={touched.description}
            >
              <Field
                className='field-action-area'
                name='description'
                placeholder='Description'
                validate={validateDesc}
              />
            </FormFieldWrap>

            <FormFieldWrap label='Deadline'>
              <Field
                className='field-action-area'
                name='deadline'
                placeholder='deadline'
                type='date'
              />
            </FormFieldWrap>

            <FormFieldWrap
              label='Category'
              select_enum={TaskCategories}
              select_name='category_arg'
            />

            <FormFieldWrap label='Deposit' error={errors.deposit} touched={touched.deposit}>
              <Field
                className='field-action-area'
                name='deposit'
                placeholder='reward ✨'
                type='number'
                validate={validateReward}
                min={0}
              />
            </FormFieldWrap>

            <button
              className='mt-3 w-full rounded-md border border-brand/40 bg-brand/30 py-[6px] font-semibold shadow-md transition-colors hover:bg-brand/40'
              type='submit'
            >
              Submit task
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CreateTask
