import { IconType } from 'react-icons'
import { MdOutlineAutoAwesome, MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md'

export type scheme = {
  title: string
  component: IconType
}

const themesList = new Map<string, scheme>([
  [
    'light-scheme',
    {
      title: 'light',
      component: MdOutlineLightMode
    }
  ],
  [
    'dark-scheme',
    {
      title: 'dark',
      component: MdOutlineDarkMode
    }
  ],
  [
    'auto-scheme',
    {
      title: 'system',
      component: MdOutlineAutoAwesome
    }
  ]
])

export { themesList }
