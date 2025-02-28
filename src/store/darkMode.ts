import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DarkModeState {
  darkMode: boolean
  toggleDarkMode: () => void
}

export const useDarkMode = create<DarkModeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.darkMode
          if (newDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { darkMode: newDarkMode }
        })
      },
    }),
    {
      name: 'dark-mode',
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark')
        }
      },
    }
  )
)