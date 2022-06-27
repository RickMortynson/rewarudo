import { PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'

type Props = {
  show?: boolean
  close: () => void
  className?: string
}

// this implementation gives you a choice - to perform a conditional render using {option && <Modal />}
// or to generate whole html inside this but hide it using <Modal show={false}>
const Modal = ({ children, close, className, show = true }: PropsWithChildren & Props) => {
  const modalElem = document.getElementById('modal-window') as Element

  return ReactDOM.createPortal(
    <div
      onClick={close}
      className={`${
        show ? 'flex' : 'hidden'
      } fixed top-0 left-0 z-[999] flex h-screen w-screen items-center justify-center  backdrop-brightness-[40%]`}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`rounded-md bg-skin-base px-20 py-16 ${className}`}
      >
        {children}
      </div>
    </div>,
    modalElem
  )
}

export default Modal
