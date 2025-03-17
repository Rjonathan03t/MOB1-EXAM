import React from 'react';
import { SafeAreaView, useColorScheme, StatusBar, StyleSheet } from 'react-native';
import TopBar from '@/components/TopBar';
import NavigationBar from '@/components/NavigationBar';

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#222' : '#fff'}
      />
      <SafeAreaView style={isDarkMode ? styles.darkContainer : styles.lightContainer}>
        <TopBar isDarkMode={isDarkMode} />
        <NavigationBar isDarkMode={isDarkMode} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
});