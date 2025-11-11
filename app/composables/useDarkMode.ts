export const useDarkMode = () => {
  const isDark = useState('darkMode', () => false)

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    
    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('darkMode', 'true')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('darkMode', 'false')
      }
    }
  }

  const initDarkMode = () => {
    if (process.client) {
      const savedMode = localStorage.getItem('darkMode')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      isDark.value = savedMode ? savedMode === 'true' : prefersDark
      
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  return {
    isDark,
    toggleDarkMode,
    initDarkMode
  }
}
