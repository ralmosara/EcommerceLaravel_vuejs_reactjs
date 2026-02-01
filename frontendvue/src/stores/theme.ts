import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'theme'

export const useThemeStore = defineStore('theme', () => {
  // Initialize from localStorage or default to dark
  const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'light' || stored === 'dark') {
        return stored
      }
    }
    return 'dark'
  }

  const theme = ref<Theme>(getInitialTheme())

  // Apply theme class to document element
  const applyTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement
      if (newTheme === 'dark') {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.remove('dark')
        root.classList.add('light')
      }
    }
  }

  // Watch for theme changes and persist
  watch(theme, (newTheme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, newTheme)
      applyTheme(newTheme)
    }
  }, { immediate: true })

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  return {
    theme,
    toggleTheme,
    setTheme,
  }
})
