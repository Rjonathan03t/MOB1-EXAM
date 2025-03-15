import React from 'react';
import { SafeAreaView } from 'react-native';
import TopBar from '@/components/TopBar';  // Assurez-vous que le chemin est correct
import NavigationBar from '@/components/NavigationBar';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBar />
      <NavigationBar />
    </SafeAreaView>
  );
}
