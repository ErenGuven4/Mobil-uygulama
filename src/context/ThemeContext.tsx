// Uygulamanın tamamında açık/karanlık tema (Dark Mode) durumunu yönettiğim context dosyası.
// React Context API ile tüm ekranlar tema rengine erişebilir ve dark mode'u değiştirebilir.
// AsyncStorage ile kullanıcının tercih ettiği tema kaydedilip uygulama açılınca geri yüklenir.
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

// ThemeColors tipi: LIGHT_COLORS nesnesinin yapısına eşdeğer (tipleri otomatik türetiliyor).
type ThemeColors = typeof LIGHT_COLORS;

// Context'in taşıyacağı veri yapısı:
// - isDarkMode: karanlık mod açık mı?
// - theme: aktif renk paleti (açık ya da karanlık)
// - toggleDarkMode: modu değiştiren fonksiyon
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
      // Telefon hafızasında '@theme_mode' anahtarıyla kaydedilen tercihi çekiyoruz.
      // Değer 'dark' ise isDarkMode=true, 'light' ise false ayarlanır.
      const savedTheme = await AsyncStorage.getItem('@theme_mode');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (e) {
      console.error('Tema yüklenirken hata oluştu:', e);
    }
  }

  // Modu tersine çeviren ve yeni değeri AsyncStorage'a kaydeden fonksiyon.
  // !isDarkMode ile mevcut değeri tersine alırız (true→false, false→true).
  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);                                           // State'i hemen güncelle
      await AsyncStorage.setItem('@theme_mode', newMode ? 'dark' : 'light'); // Kaydet
    } catch (e) {
      console.error('Tema kaydedilirken hata oluştu:', e);
    }
  };

  // isDarkMode değerine göre hangi renk paletinin aktif olduğuna karar veriyoruz.
  const theme = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// useTheme hook'u: herhangi bir bileşen içinden ThemeContext'e erişmeyi kolaylaştırır.
// ThemeProvider'un dışında kullanılırsa hata fırlatır.
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme context provider (ThemeProvider) içinde kullanılmalıdır.');
  }
  return context;
};
