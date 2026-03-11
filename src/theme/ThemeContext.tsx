import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { AppTheme, lightTheme, darkTheme } from './themes';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: AppTheme;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  preference?: ThemePreference;
  onPreferenceChange?: (pref: ThemePreference) => void;
}

export function ThemeProvider({
  children,
  preference = 'system',
  onPreferenceChange,
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();

  const resolvedPreference: ThemePreference = preference;

  const isDark =
    resolvedPreference === 'system'
      ? systemScheme === 'dark'
      : resolvedPreference === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  const setPreference = (pref: ThemePreference) => {
    onPreferenceChange?.(pref);
  };

  return (
    <ThemeContext.Provider value={{ theme, preference: resolvedPreference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
