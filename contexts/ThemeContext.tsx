"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextType {
  theme: 'light' | 'dark';
  fontSize: FontSize;
  highContrast: boolean;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
}

interface ThemeProviderProps {
  readonly children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const savedFontSize = localStorage.getItem('fontSize') as FontSize | null;
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    if (savedFontSize) {
      setFontSize(savedFontSize);
    }

    setHighContrast(savedHighContrast);
  }, []);

  useEffect(() => {
    // Apply theme class to document
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply font size class to document
    const root = document.documentElement;
    
    // Remove existing font size classes
    root.classList.remove('font-small', 'font-medium', 'font-large');
    
    // Add current font size class
    root.classList.add(`font-${fontSize}`);
    
    // Save to localStorage
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    // Apply high contrast class to document
    const root = document.documentElement;
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Save to localStorage
    localStorage.setItem('highContrast', highContrast.toString());
  }, [highContrast]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetFontSize = (size: FontSize) => {
    setFontSize(size);
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const value = useMemo(() => ({
    theme, 
    fontSize, 
    highContrast, 
    toggleTheme, 
    setFontSize: handleSetFontSize, 
    toggleHighContrast 
  }), [theme, fontSize, highContrast]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}