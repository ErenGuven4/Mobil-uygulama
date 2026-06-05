// Uygulamanın ana giriş noktası, ekranlar arası geçişleri (navigasyonu) burada tanımladım.
import React, { useEffect } from 'react';
// NavigationContainer: React Navigation'ın tüm yönlendirme durumlarını yönettiği en dış kapsayıcı bileşen.
import { NavigationContainer } from '@react-navigation/native';
// createNativeStackNavigator: Sayfaların üst üste yığıldığı (stack) bir geçiş modeli oluşturan navigasyon aracı.
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import NameEntryScreen from './src/screens/NameEntryScreen';
import GameScreen from './src/screens/GameScreen';
import MainTabs from './src/navigation/MainTabs';
import { initAudio } from './src/utils/audio';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// TypeScript için ekranların alacağı parametre listesini (tiplerini) tanımlıyoruz:
// Splash ve NameEntry ekranları parametre almaz (undefined).
// MainTabs ve Game ekranları, hangi kullanıcının ve hangi seviyenin açılacağını bilmek için parametre bekler.
type RootStackParamList = {
  Splash: undefined;
  NameEntry: undefined;
  MainTabs: { userId: string };
  Game: { levelId: number; userId: string };
};

// stack nesnesi: Ekranlar arası geçiş ve yönlendirme işlemlerini yöneteceğimiz Stack yapısı.
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    // Uygulama ilk açıldığında sesleri/hoparlörü hazırlayan initAudio fonksiyonunu çağırıyoruz.
    initAudio();
  }, []);

  return (
    // ThemeProvider: Uygulamanın tamamına tema durumunu (açık/karanlık mod) dağıtır.
    <ThemeProvider>
      {/* AppNavigator'ı ayrı fonksiyon yaptık çünkü Tema Context'ine erişmesi gerekiyor */}
      <AppNavigator />
    </ThemeProvider>
  );
}

// Navigasyon yapısının kurulduğu ve temaya göre arka plan renginin dinamik belirlendiği bileşen.
function AppNavigator() {
  const { theme } = useTheme(); // Context'ten aktif tema nesnesini çek

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash" // İlk açılışta gösterilecek ekranın adı
        screenOptions={{
          headerShown: false, // Sayfaların kendi başlıklarını gizledim, kendi özel tasarımlarımızı kullanacağız.
          animation: 'slide_from_right', // Sayfa geçiş animasyonunu sağdan sola kayacak şekilde ayarladım.
          contentStyle: { backgroundColor: theme.background }, // Sayfaların genel arka plan rengi temadan gelir
        }}
      >
        {/* Açılışta görünen logo ekranını buraya ekledim */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animation: 'fade', // Bu ekran yavaşça belirerek açılsın diye fade (solma) animasyonu verdim.
          }}
        />

        {/* Kullanıcının adını yazdığı ilk giriş ekranını buraya koydum */}
        <Stack.Screen
          name="NameEntry"
          component={NameEntryScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        {/* Alt taraftaki menülü (Harita, Sesler, Başarılar vs.) ana ekran sekmesini tanımladım */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{
            animation: 'slide_from_bottom', // Alt sekme ekranına geçerken aşağıdan yukarı kayarak gelir.
          }}
        />

        {/* Kelimeleri hecelediğimiz ana oyun alanını buraya ekledim */}
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            animation: 'slide_from_right',
            // gestureEnabled: false -> iOS cihazlarda parmakla sola kaydırıp oyundan çıkmayı (geri gitmeyi) engeller.
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

