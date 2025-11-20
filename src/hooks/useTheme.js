import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('editorTheme') || 'dracula'
  })

  useEffect(() => {
    localStorage.setItem('editorTheme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, setTheme }
}