import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '@/app/(tabs)/HomeScreen';
import PlaylistScreen from '@/app/(tabs)/PlaylistScreen';

const Tab = createMaterialTopTabNavigator();

interface NavigationBarProps {
  isDarkMode: boolean;
}

export default function NavigationBar({ isDarkMode }: NavigationBarProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarItemStyle: {
          width: 128,
          justifyContent: 'space-between',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#ff3131',
        },
        tabBarStyle: {
          marginTop: 20,
          marginBottom: 20,
          backgroundColor: isDarkMode ? '#222' : '#fff',
        },
        tabBarLabelStyle: {
          color: isDarkMode ? '#fff' : '#000',
        },
      }}
    >
      <Tab.Screen name="Sons" component={HomeScreen} />
      <Tab.Screen name="PlayList" component={PlaylistScreen} />
      <Tab.Screen name="Paramètres" component={HomeScreen} />
    </Tab.Navigator>
  );
}
