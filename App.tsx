// Uygulamanın ana giriş noktası, ekranlar arası geçişleri (navigasyonu) burada tanımladım.

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import NameEntryScreen from './src/screens/NameEntryScreen';
import GameScreen from './src/screens/GameScreen';
import MainTabs from './src/navigation/MainTabs';
import { initAudio } from './src/utils/audio';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Sayfaların hangi parametreleri alacağını tanımladım.
type RootStackParamList = {
  Splash: undefined;
  NameEntry: undefined;
  MainTabs: { userId: string };
  Game: { levelId: number; userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    // Uygulama ilk açıldığında sesleri hazırladım.
    initAudio();
  }, []);

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}

function AppNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false, // Sayfaların kendi başlıklarını gizledim, kendi tasarımımızı kullanacağım.
          animation: 'slide_from_right', // Sayfa geçişlerini sağdan sola kayacak şekilde ayarladım.
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        {/* Açılışta görünen logo ekranını buraya ekledim */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animation: 'fade', // Bu ekran yavaşça belirerek açılsın diye fade verdim
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

        {/* Alt taraftaki menülü ana ekran yapısını buraya tanımladım */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{
            animation: 'slide_from_bottom',
          }}
        />

        {/* Kelimeleri hecelediğimiz ana oyun alanını buraya ekledim */}
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            animation: 'slide_from_right',
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

