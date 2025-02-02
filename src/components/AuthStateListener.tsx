'use client';
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/store/auth'

export const AuthStateListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login, logout } = useAuth()

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        login({
          email: user.email || '',
          name: user.displayName || undefined
        })
      } else {
        logout()
      }
    })
  }, [login, logout])

  return <>{children}</>
}