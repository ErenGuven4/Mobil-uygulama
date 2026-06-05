// Alt sekme çubuğunu (tab bar) oluşturan ve ekranlar arası gezinmeyi yöneten navigasyon bileşeni.
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LevelSelectScreen from '../screens/LevelSelectScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SoundboardScreen from '../screens/SoundboardScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import { useTheme } from '../context/ThemeContext';
import { Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// MainTabs bileşeni, alt tab bar ile geçiş yapılan ana ekran grubunu oluşturur.
// route.params'tan gelen userId, diğer ekranlara initialParams ile iletilir.
export default function MainTabs({ route }: any) {
  const { userId } = route.params;  // Oturum açan oyuncunun adı
  const { theme } = useTheme();     // Aktif renk paletini al

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,       // Her ekran kendi başlığını kullanıyor, navigator başlığını gizledim.
        tabBarShowLabel: false,   // Sekme alt yazılarını gizledim, sadece ikon görünsün.
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 2,
          borderTopColor: theme.answerSlotBorder,
          // iOS'ta safe area için ekstra yükseklik ve padding gerekiyor.
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 0,
          paddingTop: Platform.OS === 'ios' ? 10 : 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          margin: 0,
        },
        tabBarActiveTintColor: theme.primary,   // Aktif sekme ikonu rengi
        tabBarInactiveTintColor: theme.textLight, // Pasif sekme ikonu rengi
      }}
    >
      <Tab.Screen 
        name="Harita" 
        component={LevelSelectScreen} 
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo name="map" size={focused ? 28 : 24} color={color} style={{ opacity: focused ? 1 : 0.6 }} />
          ),
        }}
      />
      <Tab.Screen 
        name="Sesler" 
        component={SoundboardScreen} 
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo name="megaphone" size={focused ? 28 : 24} color={color} style={{ opacity: focused ? 1 : 0.6 }} />
          ),
        }}
      />
      <Tab.Screen 
        name="Başarılar" 
        component={AchievementsScreen} 
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo name="trophy" size={focused ? 28 : 24} color={color} style={{ opacity: focused ? 1 : 0.6 }} />
          ),
        }}
      />
      <Tab.Screen 
        name="Skorlar" 
        component={LeaderboardScreen} 
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo name="bar-graph" size={focused ? 28 : 24} color={color} style={{ opacity: focused ? 1 : 0.6 }} />
          ),
        }}
      />
      <Tab.Screen 
        name="Ayarlar" 
        component={SettingsScreen} 
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo name="cog" size={focused ? 28 : 24} color={color} style={{ opacity: focused ? 1 : 0.6 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

