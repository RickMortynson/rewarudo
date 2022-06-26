import { useEffect } from 'react'

import { setPaddingTopUsingNavHeight } from '@/utils/mixins'

const Profile = () => {
  useEffect(() => {
    setPaddingTopUsingNavHeight('profile', '5rem')
  }, [])
  return <div id='profile'>Profile</div>
}

export default Profile
