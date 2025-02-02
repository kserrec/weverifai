import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  email: string
  name?: string
}

type AuthStore = {
  user: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  clearStore: () => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      clearStore: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)