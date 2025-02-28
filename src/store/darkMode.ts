'use client';

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DarkModeState {
  darkMode: boolean
  toggleDarkMode: () => void
}

// Helper function to safely update DOM classes
const updateDOMClasses = (isDark: boolean) => {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

// Get initial dark mode from localStorage if available
const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem('dark-mode');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.darkMode ?? false;
    }
  } catch (e) {
    console.error('Error reading dark mode preference:', e);
  }
  return false;
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