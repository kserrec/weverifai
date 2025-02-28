'use client';

import { useEffect } from 'react';
import { useDarkMode } from '@/store/darkMode';

/**
 * ThemeInitializer handles the initialization and updates of theme-related DOM classes.
 * It manages:
 * 1. Initial store hydration
 * 2. Theme transition enabling/disabling
 * 3. Dark mode class updates
 */
export function ThemeInitializer(): null {
  const { darkMode } = useDarkMode();

  // Handle initial setup
  useEffect(() => {
    // Rehydrate the store with persisted data
    useDarkMode.persist.rehydrate();
    
    // Enable smooth transitions after initial render
    document.documentElement.classList.add('theme-initialized');
  }, []);

  // Handle theme changes
  useEffect(() => {
    // Update dark mode class based on store state
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return null;
} 