'use client';

import { useEffect } from 'react';
import { useDarkMode } from '@/store/darkMode';

export function ThemeInitializer() {
  const { darkMode } = useDarkMode();

  useEffect(() => {
    // Force hydration of the store
    useDarkMode.persist.rehydrate();
    
    // Enable transitions
    document.documentElement.classList.add('theme-initialized');
  }, []);

  useEffect(() => {
    // Update dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return null;
} 