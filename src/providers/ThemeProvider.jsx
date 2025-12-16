import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext(null)

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const themeInfo = {
    theme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={themeInfo}>{children}</ThemeContext.Provider>
  )
}

export default ThemeProvider
