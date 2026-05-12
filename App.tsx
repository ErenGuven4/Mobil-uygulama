// ============================================
// App.tsx — Ana Uygulama Dosyası
// ============================================
// React Navigation ile ekranlar arası
// geçişi yönetir.
//
// Ekran Akışı:
//   Splash → LevelSelect → Game
// ============================================

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import GameScreen from './src/screens/GameScreen';
import { initAudio } from './src/utils/audio';

// Navigasyon tip tanımları
type RootStackParamList = {
  Splash: undefined;
  LevelSelect: undefined;
  Game: { levelId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    // Uygulama başladığında ses sistemini başlat
    initAudio();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false, // Tüm ekranlarda varsayılan header'ı gizle
          animation: 'slide_from_right', // Sağdan sola geçiş animasyonu
          contentStyle: { backgroundColor: '#FFF5F7' },
        }}
      >
        {/* Karşılama Ekranı */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animation: 'fade', // Splash ekranı fade ile açılsın
          }}
        />

        {/* Seviye Seçim Ekranı */}
        <Stack.Screen
          name="LevelSelect"
          component={LevelSelectScreen}
          options={{
            animation: 'slide_from_bottom', // Alttan yukarı açılsın
          }}
        />

        {/* Oyun Ekranı */}
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            animation: 'slide_from_right',
            gestureEnabled: false, // Oyun sırasında geri kaydırmayı engelle
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
