import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { createTheme, Theme } from '../lib/theme';

type AppContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  cardType: 'big' | 'small';
  setCardType: (type: 'big' | 'small') => void;
  toggleCardType: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [manualTheme, setManualTheme] = useState<'light' | 'dark' | null>(null);
  const [cardType, setCardType] = useState<'big' | 'small'>('small');
  
  const isDark = useMemo(() => {
    return manualTheme ? manualTheme === 'dark' : deviceColorScheme === 'dark';
  }, [manualTheme, deviceColorScheme]);
  
  const theme = useMemo(() => {
    return createTheme(isDark);
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setManualTheme(isDark ? 'light' : 'dark');
  }, [isDark]);

  const toggleCardType = useCallback(() => {
    setCardType(prev => prev === 'small' ? 'big' : 'small');
  }, []);

  const contextValue = useMemo(() => ({
    theme,
    isDark,
    toggleTheme,
    cardType,
    setCardType,
    toggleCardType
  }), [theme, isDark, toggleTheme, cardType, toggleCardType]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useTheme must be used within AppProvider');
  }
  return context;
};

export const useGrid = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useGrid must be used within AppProvider');
  }
  return { cardType: context.cardType, setCardType: context.setCardType, toggleCardType: context.toggleCardType };
};

// Keep ThemeProvider as alias for backward compatibility
export const ThemeProvider = AppProvider;