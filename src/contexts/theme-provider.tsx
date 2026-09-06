import React, { useEffect, useState } from 'react';
import { ThemeContext, type Theme } from '@/contexts/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || saved === 'system' ? saved : 'light';
    } catch {
      return 'light';
    }
  });
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateActualTheme = () => {
      let newTheme: 'light' | 'dark';

      if (theme === 'system') {
        newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        newTheme = theme === 'dark' ? 'dark' : 'light';
      }

      setActualTheme(newTheme);

      // Update DOM
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      document.documentElement.style.colorScheme = newTheme;

      try {
        localStorage.setItem('theme', theme);
      } catch {
        // Appearance can still change for this session when storage is blocked.
      }
    };

    updateActualTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateActualTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
