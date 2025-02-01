'use client';
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/store/auth'

export function AuthStateListener() {
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

  return null
}