import { Field, Form, Formik } from 'formik'

import FormFieldWrap from '@/components/helpers/FormFieldWrap'
import { formatBalanceToHuman } from '@/near/connect'
import { createTask } from '@/near/contract'
import { createTaskProps, TaskCategories } from '@/near/contract/utils'
import { useAppSelector } from '@/store/hooks'

const CreateTask = ({ className: user_className }: { className: string }) => {
  const { balance: user_balance } = useAppSelector(state => state.UserSlice)

  const handleSubmit = (values: createTaskProps) => {
    createTask(values)
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
    // format to shorter version to not run out of javascript's float limit and to not get a NaN
    let formattedBalance = formatBalanceToHuman(user_balance, 2000)

    // near formatter separates thousands with commas, which normally
    // would lead to NaN error when trying to parse such number.
    // Therefore replace commas with empty string
    formattedBalance = formattedBalance.replaceAll(',', '')
    const balance = Number(formattedBalance)

    if (balance > transaction_amount) return ''
    else return 'Not enough near for this action'
  }

  return (
    <div className={`${user_className} flex w-full flex-col shadow-sm drop-shadow-sm`}>
      <h3 className='col-span-2'>Create task</h3>

      <div className='h-full'>
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
            <Form className='flex h-full flex-col content-between'>
              <div className='flex flex-auto flex-col gap-y-1'>
                <FormFieldWrap label='Title' error={errors.title} touched={touched.title}>
                  <Field name='title' placeholder='Title' validate={validateTitle} />
                </FormFieldWrap>

                <FormFieldWrap
                  label='Description'
                  error={errors.description}
                  touched={touched.description}
                >
                  <Field name='description' placeholder='Description' validate={validateDesc} />
                </FormFieldWrap>

                <FormFieldWrap label='Deadline'>
                  <Field name='deadline' placeholder='deadline' type='date' />
                </FormFieldWrap>

                <FormFieldWrap
                  label='Category'
                  select_enum={TaskCategories}
                  select_name='category_arg'
                />

                <FormFieldWrap label='Deposit' error={errors.deposit} touched={touched.deposit}>
                  <Field
                    name='deposit'
                    placeholder='reward ✨'
                    type='number'
                    validate={validateReward}
                    min={0}
                  />
                </FormFieldWrap>
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
    </div>
  )
}

export default CreateTask
