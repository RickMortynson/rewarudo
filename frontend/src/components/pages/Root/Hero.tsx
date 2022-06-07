import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <>
      <div className="relative mt-14 flex h-[60vh] flex-col items-center justify-center bg-[url('/src/images/handshaking.jpeg')] bg-cover bg-center">
        <h2 className='mb-[2.5rem] select-none text-4xl font-bold uppercase text-white transition-all duration-500 [text-shadow:0_4px_8px_rgba(0,0,0,0.5)] hover:[text-shadow:0_4px_8px_rgba(0,0,0,0.75)] sm:text-6xl lg:text-8xl'>
          rewarudo
        </h2>
        <button className='absolute bottom-10 rounded-md bg-skin-ternary  px-6 py-2 text-2xl font-semibold shadow-md shadow-black/50 drop-shadow-lg transition-shadow duration-300 hover:shadow-black/25 md:bottom-28'>
          <Link to={'/tasks'}> check tasks</Link>
        </button>
      </div>
    </>
  )
}

export default Hero
