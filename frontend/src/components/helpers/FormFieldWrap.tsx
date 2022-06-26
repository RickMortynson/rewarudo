import './styles.scss'

import { Field } from 'formik'
import { PropsWithChildren } from 'react'

type Props = {
  label: string
  touched?: boolean
  error?: string
  className?: string

  select_enum?: object
  select_name?: string
  select_possibleEmpty?: boolean
}

/**
 * FormFieldWrap wraps form and sets standardized styles.
 * If you want to wrap selector by enum values - set select_enum and select_name values.
 * ---
 * @prop {string} label **required** field, sets label of field element
 * @prop {string} className optional className
 * @prop {React.ReactNode} children optional children. It's not recommended to use it with declared select_enum
 * @prop {string} error optional
 * @prop {boolean} touched optional
 * @prop {object} select_enum enum type, if set - creates <option> elements with enum values and wraps them in the Formik's Field. Requires select_name to work properly
 * @prop {string} select_name name of the Formik's initialValues object key
 * @prop {boolean} select_possibleEmpty set true if select can have empty value
 */
function FormFieldWrap({
  label,
  className,
  children,
  error,
  touched,
  select_enum,
  select_name,
  select_possibleEmpty
}: PropsWithChildren<Props>) {
  const selectOptions: JSX.Element[] | undefined = select_enum
    ? Object.keys(select_enum)
        // transform enum to string ignoring numbers that represent enum value index
        .filter(key => isNaN(Number(key)))
        .map((category, index) => {
          return <option key={index}>{category}</option>
        })
    : undefined

  return (
    <div className={`field-grid-child ${className}`}>
      <label>{label}</label>
      {select_enum && (
        <Field name={select_name} default='' as='select'>
          {select_possibleEmpty && <option key='empty_case'> </option>}
          {selectOptions}
        </Field>
      )}

      {children}
      {error && touched && <span className='error-message'>{error}</span>}
    </div>
  )
}

export default FormFieldWrap
