import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DarkModeStore = {
  darkMode: boolean
  toggleDarkMode: () => void
}

export const useDarkMode = create<DarkModeStore>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'dark-mode-storage',
    }
  )
)