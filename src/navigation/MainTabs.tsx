import React from 'react';
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

export default function MainTabs({ route }: any) {
  const { userId } = route.params;
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 2,
          borderTopColor: theme.answerSlotBorder,
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
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textLight,
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

