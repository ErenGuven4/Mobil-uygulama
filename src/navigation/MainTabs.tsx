import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LevelSelectScreen from '../screens/LevelSelectScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SoundboardScreen from '../screens/SoundboardScreen';
import { COLORS } from '../constants/theme';
import { Text, Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabs({ route }: any) {
  const { userId } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 2,
          borderTopColor: COLORS.answerSlotBorder,
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
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
      }}
    >
      <Tab.Screen 
        name="Harita" 
        component={LevelSelectScreen} 
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 26, opacity: focused ? 1 : 0.4, textAlign: 'center' }}>🗺️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Sesler" 
        component={SoundboardScreen} 
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 26, opacity: focused ? 1 : 0.4, textAlign: 'center' }}>🗣️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Başarılar" 
        component={AchievementsScreen} 
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 26, opacity: focused ? 1 : 0.4, textAlign: 'center' }}>🏆</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Ayarlar" 
        component={SettingsScreen} 
        initialParams={{ userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 26, opacity: focused ? 1 : 0.4, textAlign: 'center' }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
