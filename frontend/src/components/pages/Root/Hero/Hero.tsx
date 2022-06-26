import './Hero.scss'

import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <>
      <div className='custom__hero--background relative flex h-[66.6666667vh] flex-col items-center'>
        <h2 className='custom__title--fontsize--textshadow  absolute bottom-[40%] select-none font-bold uppercase text-skin-invert'>
          rewarudo
        </h2>

        <Link
          className='custom__button--fontsize--shadow absolute bottom-[20%] rounded-md 
           bg-skin-secondary px-[1.5em] py-[0.5em]'
          to={'/tasks'}
        >
          <button>check tasks</button>
        </Link>
      </div>
    </>
  )
}

export default Hero
