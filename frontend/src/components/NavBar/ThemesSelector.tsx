import { useMemo, useState, useEffect } from 'react'
import { IconType } from 'react-icons'
import { themesList, scheme } from './themes'
import './NavBar.scss'

const ThemesSelector = () => {
  const [colorScheme, setColorScheme] = useState('auto-scheme')
  const [expandThemeSelector, setExpandThemeSelector] = useState(false)

  const getLocalStorageTheme = () => {
    return localStorage.getItem('theme')
  }

  const setLocalStorageTheme = (theme: string) => {
    localStorage.setItem('theme', theme)
  }

  // useEffect tries to load theme from localStorage
  useEffect(() => {
    const theme = getLocalStorageTheme()
    console.log(theme)

    if (!theme) {
      changeSystemColorScheme('auto-scheme')
      return
    }

    changeSystemColorScheme(theme)
  }, [])

  // useEffect changes color scheme based on `colorScheme` value
  const changeSystemColorScheme = (colorScheme: string) => {
    setColorScheme(colorScheme)
    setLocalStorageTheme(colorScheme)

    const rootElem = document.getElementById('root') as HTMLDivElement

    // unset previous color scheme
    ;['auto-scheme', 'light-scheme', 'dark-scheme'].forEach(scheme => {
      rootElem.classList.toggle(scheme, false)
    })

    rootElem.classList.toggle(colorScheme, true)

    if (
      colorScheme === 'dark-scheme' ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches && colorScheme === 'auto-scheme')
    ) {
      // TODO: add dark scheme setup
    } else {
      document.body.style.background =
        getComputedStyle(rootElem).getPropertyValue('--html-brand-color')
    }
  }

  const SelectedThemeIcon = useMemo((): IconType => {
    switch (colorScheme) {
      case 'light-scheme':
        return (themesList.get('light-scheme') as scheme).component
      case 'dark-scheme':
        return (themesList.get('dark-scheme') as scheme).component
      default:
        return (themesList.get('auto-scheme') as scheme).component
    }
  }, [colorScheme])

  return (
    <>
      <div
        onClick={() => {
          setExpandThemeSelector(!expandThemeSelector)
        }}
        className='sidebar-button relative flex cursor-pointer'
      >
        <SelectedThemeIcon className='h-full text-2xl text-skin-base' />
        <span className='sidebar-button-alias'>Change color scheme</span>

        {expandThemeSelector && (
          <div className='theme-dropdown-menu'>
            <div className='theme-switch-bubble'></div>
            {Array.from(themesList).map(([className, value]) => {
              return (
                <div
                  className='theme-dropdown-item'
                  onClick={e => {
                    e.stopPropagation() //to not trigger setExpandThemeSelector
                    changeSystemColorScheme(className)
                  }}
                  key={className}
                >
                  <value.component />
                  <span className='pl-2 '>{value.title}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default ThemesSelector
