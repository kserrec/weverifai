import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Cookies from 'js-cookie'

type User = {
  email: string
  name?: string
  username: string
}

type AuthStore = {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  clearStore: () => void
  setLoading: (loading: boolean) => void
}

const cookieStorage = {
  getItem: (name: string) => {
    const value = Cookies.get(name)
    return value ? value : null
  },
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, { 
      expires: 30, // 30 days
      path: '/',
      sameSite: 'strict'
    })
  },
  removeItem: (name: string) => Cookies.remove(name)
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isLoading: true,
      login: (user) => set({ user, isLoggedIn: true, isLoading: false }),
      logout: () => set({ user: null, isLoggedIn: false, isLoading: false }),
      clearStore: () => set({ user: null, isLoggedIn: false, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
      skipHydration: true,
    }
  )
)

// Call this in your root layout or app component
export const initializeAuth = async () => {
  await useAuth.persist.rehydrate()
}