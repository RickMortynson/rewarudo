import { PropsWithChildren } from 'react'

type CardFieldProps = { title: string; className?: string }
const CardField = ({
  title,
  className,
  children
}: CardFieldProps & PropsWithChildren): JSX.Element => {
  return (
    <>
      <h2>{title}:</h2>
      <span className={`flex items-center ${className}`}>{children}</span>
    </>
  )
}
export default CardField
