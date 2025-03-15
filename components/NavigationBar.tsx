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
                    width: 128,
                    justifyContent:'space-between'
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
            <Tab.Screen name="Sons" component={HomeScreen} />
            <Tab.Screen name="PlayList" component={HomeScreen} />
            <Tab.Screen name="Paramètres" component={HomeScreen} />
        </Tab.Navigator>
    );
}
