import { Formik, Field, Form } from 'formik'

import { createTask } from '@near/contract'
import { createTaskProps, TaskCategories } from '@near/contract/utils'
import { useAppSelector } from '@store/hooks'
import './CreateTask.scss'

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
    <div
      className={`${user_className} w-full rounded-md border border-slate-300 bg-white p-4 shadow-sm drop-shadow-sm md:px-8 md:py-6`}
    >
      <h3 className='col-span-2 mb-2 text-center text-2xl font-semibold md:mb-4 md:text-start'>
        Create task
      </h3>
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
            <div className='field-grid'>
              <label>Title</label>
              <Field
                className='field-action-area'
                name='title'
                placeholder='Title'
                validate={validateTitle}
              />
              {errors.title && touched.title && (
                <span className='error-message'>{errors.title}</span>
              )}
            </div>

            <div className='field-grid'>
              <label>Description</label>
              <Field
                className='field-action-area'
                name='description'
                placeholder='Description'
                validate={validateDesc}
              />
              {errors.description && touched.description && (
                <span className='error-message'>{errors.description}</span>
              )}
            </div>

            <div className='field-grid'>
              <label>Deadline</label>
              <Field
                className='field-action-area'
                name='deadline'
                placeholder='deadline'
                type='date'
              />
            </div>

            <div className='field-grid'>
              <label>Category</label>
              <Field className='field-action-area' name='category_arg' as='select'>
                {Object.keys(TaskCategories)
                  // transform enum from TaskCategories to string `category`
                  .filter(key => isNaN(Number(key)))
                  .map((category, index) => {
                    return (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    )
                  })}
              </Field>
            </div>

            <div className='field-grid'>
              <label>Deposit</label>
              <Field
                className='field-action-area'
                name='deposit'
                placeholder='reward ✨'
                type='number'
                validate={validateReward}
                min={0}
              />
              {errors.deposit && touched.deposit && (
                <span className='error-message'>{errors.deposit}</span>
              )}
            </div>

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
