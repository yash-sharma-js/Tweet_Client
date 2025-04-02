
import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initialize theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If theme is saved in localStorage, use that, otherwise use system preference
    const initialDarkMode = savedTheme 
      ? savedTheme === 'dark' 
      : prefersDark;
    
    setIsDarkMode(initialDarkMode);
    
    // Apply the theme
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      
      // Save to localStorage
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      // Apply the theme
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newMode;
    });
  };

  return { isDarkMode, toggleTheme };
}
