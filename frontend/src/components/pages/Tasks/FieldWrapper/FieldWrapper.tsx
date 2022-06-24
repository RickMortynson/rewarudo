import './FieldWrapper.scss'

type Props = {
  label: string
  error?: string
  touched?: boolean

  // children - expected formik field
  children: JSX.Element
}

const FieldWrapper = ({ label, children, touched, error }: Props) => {
  return (
    <div className='wrapper'>
      <div className='container'>
        <label>{label}</label>
        {children}
      </div>
      {error && touched && <span className='error-message'>{error}</span>}
    </div>
  )
}

export default FieldWrapper
