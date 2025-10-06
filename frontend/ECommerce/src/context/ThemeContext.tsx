import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { createTheme, Theme } from '../lib/theme';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [manualTheme, setManualTheme] = useState<'light' | 'dark' | null>(null);
  
  const isDark = useMemo(() => {
    return manualTheme ? manualTheme === 'dark' : deviceColorScheme === 'dark';
  }, [manualTheme, deviceColorScheme]);
  
  const theme = useMemo(() => {
    return createTheme(isDark);
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setManualTheme(isDark ? 'light' : 'dark');
  }, [isDark]);

  const contextValue = useMemo(() => ({
    theme,
    isDark,
    toggleTheme
  }), [theme, isDark, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};