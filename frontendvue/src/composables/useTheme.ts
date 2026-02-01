import { computed } from 'vue'
import { useThemeStore, type Theme } from '@/stores/theme'

export function useTheme() {
  const themeStore = useThemeStore()

  const theme = computed(() => themeStore.theme)
  const isDark = computed(() => themeStore.theme === 'dark')
  const isLight = computed(() => themeStore.theme === 'light')

  const toggleTheme = () => {
    themeStore.toggleTheme()
  }

  const setTheme = (newTheme: Theme) => {
    themeStore.setTheme(newTheme)
  }

  return {
    theme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
  }
}
