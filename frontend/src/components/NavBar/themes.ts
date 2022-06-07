import { MdOutlineAutoAwesome, MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md'
import { IconType } from 'react-icons'

export type scheme = {
  title: string
  component: IconType
}

const themesList = new Map<string, scheme>([
  [
    'light-scheme',
    {
      title: 'light theme',
      component: MdOutlineLightMode
    }
  ],
  [
    'dark-scheme',
    {
      title: 'dark theme',
      component: MdOutlineDarkMode
    }
  ],
  [
    'auto-scheme',
    {
      title: 'system theme',
      component: MdOutlineAutoAwesome
    }
  ]
])

export { themesList }
