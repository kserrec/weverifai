'use client';
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/store/auth'
import { getUserData } from '@/services/auth'

export function AuthStateListener() {
  const { login, logout } = useAuth()

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
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
    });
  }, [login, logout]);

  return null;
}