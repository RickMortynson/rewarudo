import Hero from './Hero'

const Root = () => {
  return (
    <div className='overflow-scroll'>
      <Hero />
      <div className='flex h-[80vh] items-center justify-center text-4xl text-skin-base'>
        about us, contributors and other stuff
      </div>
    </div>
  )
}

export default Root
