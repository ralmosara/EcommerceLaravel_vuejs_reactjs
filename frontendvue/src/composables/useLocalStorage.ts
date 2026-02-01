import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): [Ref<T>, (value: T) => void] {
  // Get initial value from localStorage or use default
  const getInitialValue = (): T => {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  const storedValue = ref<T>(getInitialValue()) as Ref<T>

  // Watch for changes and persist to localStorage
  watch(
    storedValue,
    (newValue) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, JSON.stringify(newValue))
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error)
        }
      }
    },
    { deep: true }
  )

  const setValue = (value: T) => {
    storedValue.value = value
  }

  return [storedValue, setValue]
}
