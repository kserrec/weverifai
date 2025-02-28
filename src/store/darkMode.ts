'use client';

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
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'dark-mode',
      skipHydration: true,
    }
  )
)