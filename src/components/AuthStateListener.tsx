'use client';
import { useEffect } from 'react'
import type { Unsubscribe } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth, initializeAuth } from '@/store/auth'
import { getUserData } from '@/services/auth'

export function AuthStateListener() {
  const { login, logout, setLoading } = useAuth()

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined

    const init = async () => {
      await initializeAuth()
      
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        setLoading(true)
        if (user) {
          const userData = await getUserData(user.uid);
          if (userData) {
            login({
              email: user.email || '',
              username: userData.username,
              name: user.displayName || undefined
            });
          }
        } else {
          logout();
        }
        setLoading(false)
      });
    }

    init().catch(console.error)
    
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [login, logout, setLoading]);

  return null;
}