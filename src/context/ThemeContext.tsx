// Uygulamanın tamamında açık/karanlık tema (Dark Mode) durumunu yönettiğim context dosyası.
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

type ThemeColors = typeof LIGHT_COLORS;

interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Telefona kaydedilen karanlık mod tercihini çekip uyguladım.
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_mode');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (e) {
      console.error('Tema yüklenirken hata oluştu:', e);
    }
  }

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('@theme_mode', newMode ? 'dark' : 'light');
    } catch (e) {
      console.error('Tema kaydedilirken hata oluştu:', e);
    }
  };

  const theme = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme context provider (ThemeProvider) içinde kullanılmalıdır.');
  }
  return context;
};
