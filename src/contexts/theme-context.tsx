'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark', // Default to dark theme for City Weaver's design
  storageKey = 'city-weaver-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    // Update resolved theme based on theme setting and system preference
    const updateResolvedTheme = () => {
      let newResolvedTheme: ResolvedTheme;

      if (theme === 'system') {
        newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        newResolvedTheme = theme;
      }

      setResolvedTheme(newResolvedTheme);

      // Update document root classes
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolvedTheme);

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', newResolvedTheme === 'dark' ? '#0a0a0a' : '#ffffff');
      }
    };

    updateResolvedTheme();

    // Listen for system theme changes when using 'system' theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateResolvedTheme);

      return () => {
        mediaQuery.removeEventListener('change', updateResolvedTheme);
      };
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
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

// Theme utilities and custom hooks
export function useIsDarkMode() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark';
}

export function useThemeClasses() {
  const { resolvedTheme } = useTheme();

  return {
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    themeClass: resolvedTheme,
  };
}

// Theme-aware color utilities
export function useThemeColors() {
  const { resolvedTheme } = useTheme();

  const colors = {
    // Background colors
    background: resolvedTheme === 'dark' ? '#0a0a0a' : '#ffffff',
    backgroundSecondary: resolvedTheme === 'dark' ? '#121212' : '#f8f9fa',

    // Card colors
    cardDefault: resolvedTheme === 'dark' ? '#1a1a1a' : '#ffffff',
    cardHover: resolvedTheme === 'dark' ? '#2a2a2a' : '#f5f5f5',

    // Text colors
    foreground: resolvedTheme === 'dark' ? '#ffffff' : '#0a0a0a',
    foregroundSecondary: resolvedTheme === 'dark' ? '#a1a1aa' : '#6b7280',
    foregroundMuted: resolvedTheme === 'dark' ? '#71717a' : '#9ca3af',

    // Border colors
    borderDefault: resolvedTheme === 'dark' ? '#27272a' : '#e5e7eb',
    borderSubtle: resolvedTheme === 'dark' ? '#1f1f23' : '#f3f4f6',

    // Magic gradient colors (consistent across themes)
    magicTeal: '#14b8a6',
    magicPurple: '#8b5cf6',

    // Status colors
    success: resolvedTheme === 'dark' ? '#10b981' : '#059669',
    warning: resolvedTheme === 'dark' ? '#f59e0b' : '#d97706',
    error: resolvedTheme === 'dark' ? '#ef4444' : '#dc2626',
    info: resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb',
  };

  return colors;
}

// CSS custom properties updater
export function useUpdateCSSProperties() {
  const colors = useThemeColors();

  useEffect(() => {
    const root = document.documentElement;

    // Update CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
  }, [colors]);
}

export default ThemeContext;