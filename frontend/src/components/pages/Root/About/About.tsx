import TinderAvatar from '@/assets/who-is-this-hot-mfkr.jpg'

const About = () => {
  return (
    <div className='grid gap-y-5 p-20'>
      <h2 className='text-center text-5xl font-bold'>About team</h2>
      <div className='flex flex-wrap justify-center gap-x-44'>
        <TintedProfile image={TinderAvatar} title='The Designer' description='He is not lol' />

        <TintedProfile
          image={TinderAvatar}
          title='The Developer'
          link='https://github.com/RickMortynson'
          link_alias='RickMortynson'
          description='Github profile'
        />

        <TintedProfile
          image={TinderAvatar}
          title='The Weeb'
          link='https://t.me/LoliUnicorn'
          link_alias='@LoliUnicorn'
          description='You can pm this hottie in Telegram'
        />
      </div>
    </div>
  )
}

type TinderProps = {
  title: string
  description: string
  image: string
  link?: string
  link_alias?: string
}

const TintedProfile = ({ description, image, title, link, link_alias }: TinderProps) => {
  return (
    <div className='my-10 flex w-44 flex-col rounded-lg border border-black/30 md:my-20'>
      <img src={image} alt='avatar' />

      <div className='flex flex-auto flex-col px-2'>
        <h2 className='border-b-[1px] border-black/20 py-2 text-center text-xl font-semibold '>
          {title}
        </h2>

        <div className='flex flex-auto flex-col justify-center py-2'>
          <h4 className='text-center'>{description}</h4>

          <a href={link}>
            <p className='text-center underline'>{link_alias}</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default About
