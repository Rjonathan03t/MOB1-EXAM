import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '@/app/(tabs)/HomeScreen';

const Tab = createMaterialTopTabNavigator();

export default function NavigationBar() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarItemStyle: {
                    width: 120,
                },
                tabBarIndicatorStyle: {
                    backgroundColor: '#ff3131',
                },
                tabBarStyle: {
                    marginTop:20,
                    marginBottom:20,
                },
                tabBarLabelStyle: {
                    color: 'black',
                }
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="PlayList" component={HomeScreen} />
            <Tab.Screen name="Parameter" component={HomeScreen} />
        </Tab.Navigator>
    );
}
