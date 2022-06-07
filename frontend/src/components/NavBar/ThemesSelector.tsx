import { useMemo, useState, useEffect } from 'react'
import { IconType } from 'react-icons'
import { themesList, scheme } from './themes'

const ThemesSelector = () => {
  const [colorScheme, setColorScheme] = useState('auto-scheme')
  const [expandThemeSelector, setExpandThemeSelector] = useState(false)

  useEffect(() => {
    const rootElem = document.getElementById('root') as HTMLDivElement
    rootElem.classList.add(colorScheme)

    if (
      colorScheme === 'dark-scheme' ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches && colorScheme === 'auto-scheme')
    ) {
      // TODO: add dark scheme setup
    } else {
      document.body.style.background =
        getComputedStyle(rootElem).getPropertyValue('--color-bg-secondary')
    }
  }, [colorScheme])

  const changeColorScheme = (todoNewTitle: string) => {
    setColorScheme(oldScheme => {
      const rootElem = document.getElementById('root') as HTMLDivElement
      rootElem.classList.remove(oldScheme)
      return todoNewTitle
    })
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
        className='relative flex cursor-pointer flex-col'
        onClick={() => {
          setExpandThemeSelector(!expandThemeSelector)
        }}
      >
        <SelectedThemeIcon className='text-2xl text-skin-base' />

        {expandThemeSelector && (
          <div
            onMouseLeave={() => setExpandThemeSelector(false)}
            className='absolute top-8 -left-9 rounded-md border-slate-300 bg-skin-ternary shadow-lg ring-2 ring-slate-200'
          >
            {Array.from(themesList).map(([className, value]) => {
              return (
                <div
                  onClick={() => changeColorScheme(className)}
                  className='flex items-center border-b border-slate-400 px-2 py-1 transition-shadow last-of-type:border-b-0 hover:shadow-md'
                  key={className}
                >
                  <div>
                    <value.component />
                  </div>
                  <span className='whitespace-nowrap pl-2 text-sm'>{value.title}</span>
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
